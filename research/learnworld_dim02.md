## Dim 02: Multi-Tenant SaaS Architecture

### Tenant Isolation Strategy

For Learnworld — a SaaS LMS targeting 10,000+ individual creators, schools, and bootcamps — the recommended isolation strategy is **Shared Schema with `tenant_id` Row-Level Security (RLS)**. This is the industry-validated default for B2B SaaS platforms serving fewer than 10,000 tenants.[^1][^2]

**Four architecture patterns were evaluated:**

| Pattern | Isolation | Operational Overhead | Cost | Best For |
|---------|-----------|----------------------|------|----------|
| **Shared Schema + `tenant_id` + RLS** | Logical (RLS-enforced) | Low — single migration set | Near-zero marginal cost | **Default for Learnworld** |
| Schema-per-tenant | Logical (schema boundary) | High — N-schema migrations | Medium | Avoid — "a trap for >50 tenants"[^2] |
| Database-per-tenant | Physical (instance-level) | Very High — fleet management | High per tenant | Enterprise/regulated only |
| Hybrid Tiering | Mixed | Very High | Optimized for power-law distribution | Mature scale-up (10K+ → enterprise) |

**Why shared schema wins for Learnworld:**
- **Affordability at small scale**: A school with 1 user incurs virtually zero marginal infrastructure cost. All tenants share a single Supabase project ($25/mo Pro tier).[^3]
- **Proven at scale**: Notion runs shared schema with `workspace_id` partitioning across 480 logical shards on 32 physical Postgres databases.[^4][^5]
- **Frontend Horizon** (agency) runs 10+ clients on a single $25/mo Supabase project using RLS with `site_id` claims.[^3]
- **Migration simplicity**: One schema migration applies to all tenants instantly. No N-schema drift management.[^2]
- **RLS is cryptographically secure**: Policies are enforced at the database level; application bugs cannot leak tenant data if RLS is correctly configured.[^6]

**The scaling path** follows a hybrid tiering evolution: shared schema for the long tail of small tenants, dedicated databases for enterprise customers requiring physical isolation.[^2][^7]

---

### Database Design (tenant_id RLS, indexes, partitioning)

**Schema Pattern**
Every tenant-scoped table includes a `tenant_id` (UUID) column. All queries are scoped to this column. RLS policies enforce that a user can only read/write rows where `tenant_id` matches their JWT claim.

**RLS Policy Template (Frontend Horizon pattern)**[^3]
```sql
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select own tenant" ON courses
  FOR SELECT USING (tenant_id = (auth.jwt() ->> 'tenant_id'));

CREATE POLICY "insert own tenant" ON courses
  FOR INSERT WITH CHECK (tenant_id = (auth.jwt() ->> 'tenant_id'));
```

**Critical Indexing Strategy**
```sql
-- Composite index for every tenant-scoped query pattern
CREATE INDEX idx_courses_tenant_created ON courses(tenant_id, created_at DESC);

-- For join-heavy LMS workloads (enrollments, progress)
CREATE INDEX idx_enrollments_tenant_user ON enrollments(tenant_id, user_id);
```

**Connection Pooler Safety with PgBouncer/Supavisor**
When using transaction-mode pooling (required for serverless/edge), session-based `SET` variables leak across transactions. Use transaction-scoped `set_config`:[^2][^8]
```sql
-- WRONG: leaks across pooled connections
SET SESSION app.current_tenant_id = 'tenant-123';

-- CORRECT: scoped to transaction
SELECT set_config('app.current_tenant_id', 'tenant-123', true);
```

**Partitioning for Scale**
- **Phase 1 (1–1K tenants)**: No partitioning. Single database with RLS.
- **Phase 2 (1K–10K tenants)**: Native PostgreSQL partitioning on `tenant_id` for large tables (e.g., `user_progress`, `activity_logs`).
- **Phase 3 (10K+ tenants)**: Logical shards. Following Notion's model, pre-create 480 logical shards (schemas) across physical databases, routing by `tenant_id` hash. This requires zero application code changes when adding physical nodes.[^4][^5]

**Per-Tenant Resource Guardrails**[^2][^9]
```sql
-- Set statement timeout per tenant role to prevent noisy neighbors
ALTER ROLE tenant_123 SET statement_timeout = '30s';
```

---

### Storage Isolation (Supabase Storage buckets per tenant)

**Two viable patterns were evaluated:**

**Option A: Bucket-per-Tenant (Frontend Horizon approach)**[^3]
- Each tenant gets a dedicated Storage bucket (e.g., `school-abc-images`, `school-abc-private`).
- Public buckets are read-only-to-anonymous, write-only-to-service-role.
- Private buckets use RLS policies scoped to `site_id` JWT claim.
- **Pros**: True isolation at the bucket level; easy to migrate a tenant to dedicated storage later.
- **Cons**: Bucket count limits on Supabase (check current quotas); more buckets to manage.

**Option B: Path-Based Isolation in Shared Bucket**[^10][^11]
- Single bucket per asset type (public, private, documents).
- Object paths prefixed with `tenant_id`: `school-abc/course-123/video.mp4`.
- RLS policies on `storage.objects` filter by `storage.foldername(name)` matching the tenant ID.

```sql
CREATE POLICY "tenant file isolation" ON storage.objects
FOR SELECT USING (
  (auth.jwt() ->> 'tenant_id') = split_part(name, '/', 1)
);
```

**Recommendation for Learnworld**: Start with **Option B (path-based)** for simplicity. Migrate high-usage tenants to dedicated buckets (Option A) if they hit per-bucket rate limits or require custom retention policies. Always enable RLS on storage buckets — Supabase blocks all uploads by default until policies are defined.[^10][^11]

**Security layers**:[^11]
1. Bucket-level: public vs private designation
2. RLS policy-level: tenant-scoped access rules
3. Signed URLs: time-limited access for private assets
4. Service-role-only writes: frontend never uploads directly with elevated keys

---

### Auth & Identity (multi-tenant auth flow)

**Recommended: Supabase Auth + Custom JWT Claims for tenant_id**

Supabase Auth supports injecting custom claims into the JWT at sign-in via **Auth Hooks** (Postgres functions). This is the pattern used by Frontend Horizon and validated in production.[^3]

**Auth Flow:**
```
User logs in → Supabase Auth Hook injects tenant_id into JWT
→ Every API request carries JWT
→ PostgREST/Edge Function evaluates JWT
→ RLS policy filters by tenant_id claim
→ Database returns only scoped rows
```

**JWT Claim Structure:**
```json
{
  "sub": "user-uuid",
  "tenant_id": "school-abc-uuid",
  "role": "instructor",
  "aud": "authenticated"
}
```

**Alternative: Clerk B2B Authentication**[^12]
- Clerk provides native multi-tenant "Organizations" with verified domains, invitations, and custom roles.
- Supports SAML/OIDC per tenant for enterprise SSO.
- Can be integrated with Supabase by passing the Clerk session token to Supabase as a custom JWT.
- **Trade-off**: Clerk adds ~$25–100/mo at scale but eliminates auth engineering. Best for teams prioritizing speed over cost optimization.

**User-Tenant Membership Model:**
```sql
CREATE TABLE tenant_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  tenant_id UUID REFERENCES tenants(id),
  role TEXT CHECK (role IN ('owner', 'admin', 'instructor', 'student')),
  joined_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, tenant_id)
);
```

**Critical Security Rules:**[^6][^11]
- Never expose `service_role` key to the client. Use it only in server-side Edge Functions or API routes.
- Edge Functions must forward the user's JWT (not service_role) when querying the database to preserve RLS context.
- Always validate tenant membership in application code *before* relying solely on RLS — defense in depth.

---

### Tenant Routing (subdomain vs custom domain)

**Subdomain Routing (`school.learnworld.com`)**

Next.js middleware extracts the subdomain from the `Host` header and rewrites to internal tenant routes:[^13][^14]

```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  const subdomain = host.replace('.learnworld.com', '');
  
  // Rewrite to internal tenant route
  const url = request.nextUrl.clone();
  url.pathname = `/tenant/${subdomain}${url.pathname}`;
  return NextResponse.rewrite(url);
}
```

**DNS & SSL for Subdomains:**
- Wildcard DNS: `*.learnworld.com → CNAME → cname.vercel-dns.com`
- Vercel auto-provisions wildcard SSL via Let's Encrypt.[^14]
- Zero manual SSL work for new subdomains.

**Custom Domains (`school.com`)**

For schools/bootcamps requiring white-label branding:[^13][^15]
- **Vercel for Platforms**: Use the Vercel REST API or SDK to programmatically add custom domains to your project.
- **Cloudflare**: Custom domains point a CNAME to your origin. Cloudflare handles SSL termination and CDN.
- **SSL**: Automated via Let's Encrypt (Vercel) or Cloudflare's Universal SSL. No manual certificate management.

```
Tenant DNS setup:
  school.com → CNAME → cname.vercel-dns.com
  Vercel verifies domain → issues SSL cert → routes to tenant
```

**Tenant Resolution Cache:**
- Store `subdomain → tenant_id` and `custom_domain → tenant_id` mappings in Redis/Upstash with edge caching.
- Middleware performs a KV lookup before database query. Sub-millisecond resolution.

**Recommendation for Learnworld**: Start with **subdomains only** (simplest). Add custom domain support via Vercel API for premium tiers ("Pro" and "Enterprise" plans).[^14]

---

### Cost Model (per-tenant infrastructure cost)

**Supabase Pricing Baseline (2026)**[^16]

| Plan | Database | Egress | Storage | Compute | Cost |
|------|----------|--------|---------|---------|------|
| Free | 500 MB | 5 GB/mo | 500 MB | Shared | $0 (pauses after 1 week idle) |
| Pro | 8 GB | 250 GB/mo | 100 GB | Micro (1 vCPU, 1 GB RAM) | **$25/mo** + overages |
| Team | 8 GB | 250 GB/mo | 100 GB | Small+ | $599/mo |

**Marginal Cost Per Tenant — Shared Schema Model:**

| Scenario | Tenants | Users | Infrastructure | Monthly Cost | Marginal Cost / Tenant |
|----------|---------|-------|----------------|--------------|------------------------|
| Creator (1 user) | 1 | 1 | Supabase Pro | $25 | $25 (base) |
| Small school | 1 | 50 | Supabase Pro | $25 | ~$0 incremental |
| 100 small schools | 100 | 5,000 | Supabase Pro | $25–$40 | $0.15–$0.40 |
| 1,000 schools | 1,000 | 50,000 | Supabase Pro + Small compute | $50–$75 | $0.05–$0.075 |
| 10,000 schools | 10,000 | 500,000 | Team plan + read replicas | $600–$1,200 | $0.06–$0.12 |

**Key insight**: With shared schema + RLS, the marginal cost of adding a tenant with 1 user is **effectively zero** until you hit compute, storage, or egress limits. The database doesn't care whether 1,000 tenants each have 1 user or 1 tenant has 1,000 users — the row count and query volume determine cost.[^3][^16]

**Neon Alternative Cost Comparison**[^7][^17]
- Neon charges **$0.106/CU-hour** (Launch tier) or **$0.222/CU-hour** (Scale tier with compliance).
- A Neon project per tenant with scale-to-zero costs ~$0 if idle, but each active tenant incurs compute costs.
- **100 tenants each active 8 hrs/day** ≈ 100 × 0.25 CU × 240 hrs × $0.106 = **$636/mo minimum**.
- **Supabase shared project for 100 tenants**: $25–$40/mo.
- **Verdict**: Neon database-per-tenant is 10–15× more expensive for Learnworld's many-small-tenants model. Neon is better for applications requiring strong physical isolation per tenant.[^7]

**Cost Drivers to Monitor:**
1. **Database storage** (>$8 GB on Pro): $0.125/GB/mo
2. **Egress** (>$250 GB/mo on Pro): $0.09/GB
3. **Storage file volume** (>$100 GB): $0.021/GB/mo
4. **Edge Function invocations** (>$2M/mo on Pro): $2 per million
5. **Auth MAU** (>$50,000/mo on Pro): $0.00325/MAU

**Conclusion**: A single Supabase Pro project ($25/mo) can realistically serve **1,000–2,000 active small tenants** before requiring compute upgrades. At 10,000 tenants, a Team plan ($599/mo) with read replicas and dedicated compute is the natural next step.

---

### Scaling Path (1 tenant → 10K tenants → enterprise)

**Phase 0: MVP (1–10 tenants)**
- Single Supabase project (Free or Pro).
- Shared schema with `tenant_id` RLS.
- Subdomain routing only.
- Path-based Storage isolation.
- No read replicas needed.

**Phase 1: Growth (10–1,000 tenants)**
- Stay on single Supabase Pro project.
- Add composite indexes on `(tenant_id, frequently_queried_column)`.
- Implement connection pooling via **Supavisor** (shared pooler, IPv4, transaction mode).[^8]
- Add per-tenant statement timeouts (30s default) to prevent runaway queries.[^2]
- Introduce caching layer (Redis/Upstash) for tenant config and hot data.
- Monitor `pg_stat_statements` for slow tenant-scoped queries.

**Phase 2: Scale (1,000–10,000 tenants)**
- Upgrade to **dedicated PgBouncer** (co-located with Postgres) for lower latency.[^8]
- Add **PostgreSQL read replicas** for analytics/dashboard queries.[^2]
- Partition large tables (`activity_logs`, `user_progress`, `enrollments`) by `tenant_id` range.
- Implement **Edge Function rate limiting** per tenant (daily request quotas).[^9]
- Consider **Neon branching** for dev/staging environments per tenant (optional).[^17]
- Add tenant-level resource usage monitoring (query count, storage, egress).

**Phase 3: Enterprise (10,000+ tenants / enterprise accounts)**
- **Hybrid Tiering**: Move top 1% of tenants (enterprise schools) to dedicated Supabase projects or Neon databases.[^2][^7]
  - Physical isolation for compliance (SOC 2, HIPAA, GDPR).
  - Independent backups and point-in-time recovery.
  - Custom compute sizing per tenant.
- **Sharding**: If single-instance vertical limits are reached, implement logical shards (480 shards, à la Notion) with application-level routing by `tenant_id` hash.[^4][^5]
- **Regional deployment**: Deploy Supabase projects in EU, US, APAC for data residency compliance.[^12]
- **Analytics offloading**: Move tenant-facing dashboards to a CDC-fed columnar store (ClickHouse, BigQuery) to prevent OLTP degradation.[^2]

---

### Implementation Notes

**1. Migration from Single-Tenant to Multi-Tenant**
```sql
-- Add tenant_id to all tenant-scoped tables
ALTER TABLE courses ADD COLUMN tenant_id UUID NOT NULL DEFAULT 'legacy-tenant-id';
ALTER TABLE enrollments ADD COLUMN tenant_id UUID NOT NULL DEFAULT 'legacy-tenant-id';

-- Create composite indexes
CREATE INDEX idx_courses_tenant ON courses(tenant_id);
CREATE INDEX idx_enrollments_tenant_user ON enrollments(tenant_id, user_id);

-- Enable RLS
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "tenant_isolation" ON courses
  FOR ALL USING (tenant_id = (auth.jwt() ->> 'tenant_id'));
```

**2. Noisy Neighbor Mitigation**[^2][^9]
- `statement_timeout` per tenant (30s default, 120s max for heavy reports).
- `idle_in_transaction_session_timeout` to kill abandoned transactions.
- Query cost limits in application middleware before hitting DB.
- Background jobs (video processing, exports) pinned to dedicated Edge Functions or worker queues, not the main API pool.

**3. Connection Pooling Configuration**[^8]
```ini
# PgBouncer transaction mode (recommended for serverless)
pool_mode = transaction
default_pool_size = 20
max_client_conn = 500
reserve_pool_size = 5
reserve_pool_timeout = 3
server_reset_query_always = 1  # Ensure tenant state is cleared
```

**4. Testing RLS Before Production**[^17]
- Use Supabase CLI or Neon branching to create isolated copies of production data.
- Test RLS policies with real JWT tokens and cross-tenant access attempts.
- Automate RLS testing in CI/CD: seed 2 tenants, verify Tenant A cannot read Tenant B's data.

**5. Real-World Validation**[^3]
> "We run 10+ clients on one $25/mo Supabase project. The `site_id` claim in the JWT drives all RLS policies. Storage uses bucket-per-tenant. Migrations are single-file, version-controlled, and apply instantly to all tenants. We've never had a cross-tenant data leak."
> — Frontend Horizon engineering blog

**6. Compliance Roadmap**[^2]
- From day one: design `tenant_memberships` and `audit_logs` with per-tenant deletion/export in mind.
- GDPR Article 17: per-tenant data deletion must be a single query (`DELETE FROM courses WHERE tenant_id = $1`), not a manual hunt across tables.
- SOC 2: RLS policies are audit-friendly — they live in SQL, are version-controlled, and are enforced at the database layer.

---

### Citations

[^1]: Restack — "Multi-tenant architecture in Supabase" (2023). Overview of RLS-based multi-tenancy, shared schema patterns, and security considerations. https://www.restack.io/docs/supabase-knowledge-supabase-multi-tenant-definition

[^2]: ClickHouse / Voxire — "How to architect multi-tenant SaaS on Postgres" (2026). Comprehensive rubric for shared schema vs schema-per-tenant vs database-per-tenant vs hybrid tiering. Transaction-scoped tenant identity, PgBouncer leakage risks, OLTP scaling path, and compliance isolation. https://clickhouse.com/resources/engineering/multi-tenant-saas-postgres-architecture

[^3]: Frontend Horizon — "Supabase Row Level Security: The Multi-Tenant Pattern We Use Across FH Clients" (2026). Real-world case study of 10+ clients on one $25/mo Supabase project using `site_id` JWT claims, bucket-per-tenant Storage, and Supabase CLI migrations. https://www.frontendhorizon.com/blog/supabase-row-level-security-the-multi-tenant-pattern-we-use-across-fh-clients

[^4]: Notion Engineering — "Herding elephants: lessons learned from sharding Postgres at Notion" (2021). 480 logical shards across 32 physical databases, `workspace_id` as shard key, 500 GB per table limit, zero-downtime migration. https://www.notion.so/blog/sharding-postgres-at-notion

[^5]: Notion Engineering — "The Great Re-shard: adding Postgres capacity with zero downtime" (2023). Expansion from 32 to 96 physical instances while maintaining 480 logical shards. https://www.notion.com/blog/the-great-re-shard

[^6]: Supabase Security Labs — GitHub repo demonstrating RLS broken patterns, cross-tenant leaks, and Edge Function service_role bypass risks. https://github.com/elamilutinovic-vibePep/supabase-security-labs

[^7]: Neon — "What are the best managed Postgres databases for multi-tenant SaaS?" (2026). Neon database-per-tenant model, scale-to-zero, CU-hour pricing, comparison to Supabase per-project compute costs. https://neon.com/faqs/best-managed-postgres-databases-multi-tenant-saas

[^8]: Supabase Docs — "Connect to your database" (2026). Shared Pooler (Supavisor) vs Dedicated Pooler (PgBouncer), session vs transaction mode, IPv4/IPv6 routing, latency considerations. https://supabase.com/docs/guides/database/connecting-to-postgres

[^9]: GitHub — mr-bridge-assistant architecture decision log. Per-tenant rate limiting, request-based quotas, daily limits implementation. https://github.com/Theioz/mr-bridge-assistant/issues/201

[^10]: PromptXL — "Supabase Storage RLS: Secure File Access for SaaS Apps" (2025). Storage policy patterns for tenant isolation, bucket-level vs object-level RLS, public/private bucket design. https://promptxl.com/supabase-storage-rls/

[^11]: SupaScale — "Storage RLS Policies for Self-Hosted Supabase" (2026). `storage.objects` and `storage.buckets` RLS mechanics, path-based tenant isolation, signed URL security. https://www.supascale.app/blog/storage-rls-policies-for-selfhosted-supabase-secure-your-fil

[^12]: Clerk — "How to Design a Multi-Tenant SaaS Architecture" (2025). Clerk B2B toolkit for organizations, JWT-scoped auth, custom roles, SAML/OIDC per tenant. https://clerk.com/blog/how-to-design-multitenant-saas-architecture

[^13]: John Kavanagh — "Building Multi-tenant Applications with Next.js" (2026). Subdomain vs custom domain routing, middleware patterns, Vercel/Cloudflare SSL handling, hybrid approaches. https://johnkavanagh.co.uk/articles/building-a-multi-tenant-application-with-next-js/

[^14]: Vercel — "Vercel for Platforms" (2025). Multi-tenant platform features, wildcard subdomain SSL, custom domain API, unlimited domains, edge routing. https://vercel.com/docs/multi-tenant

[^15]: Viprasol — "Next.js Multi-Tenant Subdomains: Middleware Routing, Per-Tenant Theming, and DNS Setup" (2026). Budget/timeline estimates for multi-tenant routing implementation, Vercel wildcard cert provisioning. https://viprasol.com/blog/nextjs-multi-tenant-subdomain/

[^16]: MakerKit — "Supabase Pricing Calculator (2026)" and Supabase Docs. Pro plan $25/mo, compute credits, storage/egress overage pricing, free tier limits. https://makerkit.dev/pricing-calculator/supabase and https://supabase.com/docs/guides/functions/limits

[^17]: Neon — "Adopt Postgres RLS for Multi-Tenant Apps Without Slowing Your Team Down" (2026). Neon Auth branching for RLS testing, production-like loops, Better Auth integration. https://neon.com/guides/rls-multi-tenant-apps

[^18]: Neon — "One Database per User, Zero Complexity" (2024). Database-per-tenant on Neon's serverless model, 2-second provisioning, autoscaling, scale-to-zero, Agent plan for high-volume fleets. https://neon.com/use-cases/database-per-tenant
