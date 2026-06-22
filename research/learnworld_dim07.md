## Dim 07: Ecosystem & Extensibility Architecture

**Goal**: Design Learnworld as a **platform**, not just a product — enabling third-party developers, agencies, and integrators to build on top of it, creating a competitive moat that Teachable, Thinkific, and Kajabi cannot match. The strategic positioning is to become the **"Shopify of LMS"** — a beautiful, user-friendly platform with deep, WordPress-like extensibility, but without the security and reliability nightmares of the WordPress plugin model.

---

### Plugin Marketplace Architecture

#### The Core Architectural Decision: External Apps vs. Internal Plugins

The single most consequential decision in Learnworld's ecosystem architecture is whether third-party extensions run **inside** the platform (like WordPress/Moodle plugins) or **outside** as independent services (like Shopify Apps or Canvas LTI tools). Research overwhelmingly favors a hybrid external-first model with controlled internal embedding.

**Why the WordPress Model Must Be Avoided:**
- WordPress plugins run in the same execution environment as core, sharing the same database, PHP runtime, and global state. This creates catastrophic security exposure: 90% of WordPress hacks exploit plugin vulnerabilities, and 35% of plugins are effectively abandoned (no updates in 12+ months). [^1]
- The average WooCommerce store runs 27 active plugins, generating ~216 additional HTTP requests per page load and 40–60% slower page speeds compared to native solutions. Plugin conflicts routinely cause checkout failures, data corruption, and 15–30% spikes in cart abandonment. [^2]
- At scale, WordPress requires treating the platform as "infrastructure, not a CMS" — with CDN, WAF, reverse proxy, object cache, and OPcache layers whose primary purpose is to prevent requests from reaching WordPress at all. [^3]

**The Shopify/Canvas Model — External Apps with API Integration:**
- Shopify apps are standalone web applications that communicate with Shopify via OAuth2-authenticated APIs. They do not execute inside Shopify's infrastructure. This means a buggy app cannot crash a merchant's store. [^4]
- Canvas LMS takes the same approach: it has no native plugin directory. Extensions run as external LTI 1.3 tools or REST API consumers through the curated Canvas App Center. External tools cannot break Canvas during upgrades — a genuine reliability advantage. [^5]
- Moodle, by contrast, offers 2,700+ native plugins with deep core modification capability, but this creates "moderate upgrade risk from extensions" and requires auditing all plugins before major version upgrades. [^6]

**Recommended Learnworld Architecture: "Islands with Bridges"**

```
┌─────────────────────────────────────────────────────────────┐
│                    LEARNWORLD CORE PLATFORM                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │  Course     │  │  User Mgmt  │  │  Commerce & Billing │  │
│  │  Engine     │  │  & Auth     │  │                     │  │
│  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘  │
│         │                │                     │            │
│  ┌──────▼────────────────▼─────────────────────▼──────────┐  │
│  │              API GATEWAY (Kong/AWS/Apigee)               │  │
│  │  • Rate limiting per app/tenant                         │  │
│  │  • OAuth2 token validation                              │  │
│  │  • Webhook routing & signature verification             │  │
│  │  • API versioning & request transformation              │  │
│  └──────┬───────────────────────────────────────────────────┘  │
│         │                                                     │
│  ┌──────▼──────────────────────────────────────────────────┐  │
│  │              EVENT BUS (Kafka/NATS/RabbitMQ)            │  │
│  │  • course.created, user.enrolled, payment.completed     │  │
│  │  • payment.failed, certificate.issued, content.viewed │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  SANDBOXED UI EMBEDDING (iframe + postMessage)       │   │
│  │  • App blocks in course builder (like Shopify sections)│   │
│  │  • Admin dashboard widgets                             │   │
│  │  • Student-facing activity modules (LTI-style)           │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          │                   │                   │
    ┌─────▼─────┐      ┌─────▼─────┐      ┌─────▼─────┐
    │  App #1   │      │  App #2   │      │  App #3   │
    │  External │      │  External │      │  External │
    │  Service  │      │  Service  │      │  Service  │
    │  (Node/   │      │  (Python/ │      │  (No-code/│
    │   Rails)  │      │   Django) │      │   Zapier) │
    └───────────┘      └───────────┘      └───────────┘
```

**Key Components:**

1. **Plugin Registry & Manifest System**: Every app submits a JSON manifest defining its name, version, required permissions (scopes), webhook subscriptions, UI extension points (course builder blocks, admin widgets, student activities), and sandbox permission requirements. This manifest is the contract between Learnworld and the app.

2. **App Installation Flow**: When a school admin installs an app, Learnworld provisions an OAuth2 client for that app-tenant pair, grants the requested scopes, and generates webhook signing secrets. The app receives an access token and a tenant-specific API base URL. No code from the app runs on Learnworld servers.

3. **UI Extension Points via Sandboxed iframes**: For apps that need to render inside Learnworld's UI, the platform provides controlled iframe containers with a `sandbox` attribute. Allowed capabilities are declared in the manifest and enforced by the platform:
   - `allow-scripts` — JavaScript execution (always required)
   - `allow-same-origin` — Required for cookies/localStorage and API requests from the iframe to the app's own origin
   - `allow-forms` — Form submission within the iframe
   - `allow-popups` — For OAuth flows or external links
   - `allow-popups-to-escape-sandbox` — For full OAuth redirects
   - Communication between the iframe and parent occurs exclusively via `postMessage` with strict origin checking and message validation schemas. [^7]

4. **Two Types of Apps**: 
   - **External Apps**: Run entirely on the developer's infrastructure; interact via REST/GraphQL APIs and webhooks. No UI embedding. Example: A CRM sync tool, an analytics pipeline, a certificate issuance service.
   - **Embedded Apps**: Run as external services but render UI inside Learnworld via sandboxed iframes. Example: A custom quiz engine, a collaborative whiteboard activity, a gamification leaderboard widget.

5. **Capability-Based API Model**: Instead of giving apps blanket access to a tenant's data, Learnworld exposes **capability bundles**:
   - `courses:read` — Read course metadata and content structure
   - `courses:write` — Modify course content (requires elevated approval)
   - `users:read` — Read learner profiles (anonymized by default)
   - `users:read:email` — Read email addresses (requires explicit consent)
   - `enrollments:read` — Read enrollment status and progress
   - `enrollments:write` — Enroll/unenroll users
   - `payments:read` — Read transaction history
   - `certificates:issue` — Issue completion certificates
   - `webhooks:subscribe` — Subscribe to platform events
   - `ui:course_builder` — Render a block in the course builder
   - `ui:admin_widget` — Render a widget in the admin dashboard
   - `ui:student_activity` — Render an activity inside a lesson

#### App Review & Approval Process

Learnworld must operate a curated marketplace — not a free-for-all:
- **Automated static analysis**: Manifest validation, dependency vulnerability scanning (e.g., npm audit, Snyk), CSP policy review for embedded apps.
- **Functional testing**: Apps submitted for embedding undergo automated UI tests — iframe isolation verification, postMessage protocol compliance, resource load timing checks.
- **Manual review for elevated scopes**: Any app requesting `users:read:email`, `payments:read`, or `courses:write` undergoes human review of business legitimacy, privacy policy, and data handling practices.
- **Graduated access**: New apps start with limited distribution (10 schools) before gaining marketplace-wide visibility. This contains blast radius.
- **Ongoing monitoring**: Post-install, Learnworld monitors API call patterns for abuse, anomalous data extraction, or excessive rate limit consumption.

---

### API-First Design (GraphQL + REST + Webhooks)

#### REST as the Public Default, GraphQL for Complex Clients

Modern API-first SaaS platforms must expose both REST and GraphQL, but with clear boundaries. According to 2026 production benchmarks, REST handles roughly a third more simple requests per server, while GraphQL achieves lower latency on complex queries that would otherwise require multiple REST round trips. For a public API consumed by unknown third-party developers, REST's predictability and native HTTP caching usually outweigh GraphQL's flexibility — but GraphQL is "table stakes" for modern developer expectations. [^8]

**Recommended Dual-API Strategy:**

| Dimension | REST API | GraphQL API |
|-----------|----------|-------------|
| **Primary use** | Third-party integrations, simple CRUD, public API | Internal frontend, mobile apps, complex nested queries |
| **Endpoint** | `/api/v1/courses`, `/api/v1/users` | `/api/v2/graphql` |
| **Caching** | Native HTTP caching via ETags/Cache-Control | Custom CDN/persisted queries |
| **Rate limiting** | Straightforward per-endpoint | Query complexity analysis + cost scoring |
| **Versioning** | URL-based (`/v1/`, `/v2/`) | Schema evolution with deprecation |
| **SDK support** | Primary target for auto-generated SDKs | Secondary; used by advanced integrators |
| **Documentation** | OpenAPI 3.1 spec at `/openapi.json` | Schema introspection + GraphiQL explorer |

**REST Design Principles:**
- **Resource-oriented**: `/courses/{id}/enrollments`, `/users/{id}/certificates`, `/schools/{id}/analytics`
- **Consistent pagination**: Cursor-based for datasets over 10,000 records (e.g., `GET /courses?cursor=eyJpZCI6MTIzfQ&limit=50`). Offset-based only for small, filtered admin views. [^9]
- **Idempotency**: All mutating operations accept an `Idempotency-Key` header. The server stores keys for 24 hours and returns cached responses for duplicate requests.
- **Partial responses**: Use `fields` query parameter to specify which fields to return (a lightweight REST alternative to GraphQL's field selection).
- **Bulk operations**: `POST /bulk/enrollments` for batch processing, with async job tracking via `202 Accepted` + `Location: /jobs/{id}`.

**GraphQL Design Principles:**
- **Single endpoint** with schema stitching across domain modules (Course, User, Commerce, Analytics).
- **Query depth limits**: Maximum 10 nested levels to prevent expensive queries.
- **Complexity scoring**: Each field has a cost weight; queries exceeding 1,000 complexity points are rejected.
- **Persisted queries**: For production mobile apps, only allow whitelisted persisted query IDs — no ad-hoc queries. This prevents abuse and enables caching.
- **Schema evolution**: Use `@deprecated(reason: "Use newField instead")` directives. Never remove a field within a major version.

**AI-Ready API Design:**
Serve machine-readable specs at standard paths: `/openapi.json`, `/llms.txt`, `/llms-full.txt`. These enable AI agents to discover, understand, and call Learnworld APIs autonomously. Structured error responses with machine-parsable codes support autonomous retry logic. [^10]

#### Webhook Architecture: Event-Driven Integration Backbone

Webhooks are the primary mechanism for real-time data flow from Learnworld to third-party apps. A polling-only API strategy wastes 98.5% of requests (Zapier data) and introduces 62% higher latency than event-driven architectures. [^11]

**Webhook Architecture Blueprint:**

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   LEARNWORLD     │     │   EVENT ROUTER   │     │  WEBHOOK DELIVERY│
│   PLATFORM       │────▶│   (Kafka/NATS)   │────▶│   ENGINE         │
│                  │     │                  │     │                  │
│  Events:         │     │  • Filtering     │     │  • Retry queue   │
│  course.created  │     │  • Fan-out       │     │  • Backoff       │
│  user.enrolled   │     │  • DLQ routing   │     │  • Circuit       │
│  payment.success │     │                  │     │    breaker       │
│  content.viewed  │     │                  │     │  • HMAC signing  │
└──────────────────┘     └──────────────────┘     └──────────────────┘
                                                           │
                                                           ▼
                                              ┌──────────────────────┐
                                              │   APP ENDPOINTS      │
                                              │  • https://app1.com/ │
                                              │    webhooks/lw       │
                                              │  • https://app2.com/ │
                                              │    receive           │
                                              └──────────────────────┘
```

**Webhook Event Catalog (v1):**
| Category | Events | Payload Size |
|----------|--------|-------------|
| Course | `course.created`, `course.updated`, `course.published`, `course.deleted` | ~2KB |
| Content | `lesson.created`, `lesson.completed`, `quiz.submitted`, `assessment.graded` | ~3KB |
| User | `user.created`, `user.updated`, `user.deactivated` | ~1KB |
| Enrollment | `enrollment.created`, `enrollment.completed`, `enrollment.expired`, `progress.updated` | ~2KB |
| Commerce | `payment.initiated`, `payment.success`, `payment.failed`, `subscription.canceled`, `invoice.generated` | ~4KB |
| Certificate | `certificate.issued`, `certificate.revoked` | ~1KB |
| Community | `post.created`, `comment.added`, `reaction.added` | ~1KB |

**Webhook Reliability Mechanisms:**
1. **At-least-once delivery with idempotency**: Each webhook event carries a unique `event_id` (UUID v4). Apps must implement idempotency by storing processed `event_id` values and deduplicating. Retries ensure delivery but can cause duplicates. [^12]
2. **Exponential backoff with jitter**: On delivery failure (5xx, timeout, 429), retry at: 1s, 2s, 4s, 8s, 16s, 32s, 64s, 128s, 256s, 512s (10 attempts). Add random jitter (±20%) to prevent thundering herd. No retries on 4xx (except 429). [^13]
3. **Dead-letter queue (DLQ)**: After 10 failed attempts, events move to a DLQ for manual inspection and replay. Monitoring alerts fire when DLQ depth exceeds thresholds.
4. **Circuit breaker**: If an endpoint fails 50 consecutive deliveries, pause deliveries for 30 minutes, then resume with a single probe. If probe succeeds, resume normal flow.
5. **HMAC signature verification**: Each webhook includes a `Learnworld-Signature` header with `t=timestamp,v1=signature`. Signature = HMAC-SHA256(webhook_secret, timestamp + "." + raw_body). Apps must verify signature and reject events with timestamps > 5 minutes old (replay attack protection). [^14]
6. **Async acknowledgment**: Apps must return HTTP 200 within 500ms. Any heavy processing must happen asynchronously after acknowledging. If an app does synchronous work before responding and fails, partial state changes + retries = data corruption. [^15]
7. **Event versioning**: Webhook payloads include `api_version: "2025-06-01"`. When breaking changes occur, apps must migrate to a new webhook subscription version. Both versions are delivered during a 6-month deprecation window.

**Webhook Management Portal**: Developers can configure webhook endpoints, subscribe to specific event types, view delivery logs (with request/response bodies), replay failed events, and rotate webhook secrets — all self-service.

---

### Third-Party App Model (OAuth2, Permissions, Sandboxing)

#### OAuth2 Authorization Framework

Learnworld must implement OAuth2 as the exclusive authentication mechanism for third-party apps. This is the industry standard for SaaS platform ecosystems (Shopify, Slack, Notion, Figma, Canvas all use OAuth2). [^16]

**OAuth2 Flows Supported:**

| Flow | Use Case | Implementation |
|------|----------|---------------|
| **Authorization Code + PKCE** | User-facing apps, SPAs, mobile apps | Most secure for public clients. PKCE prevents authorization code interception. [^17] |
| **Client Credentials** | Machine-to-machine, backend sync, nightly reports | Server-to-server without user context. App authenticates with client_id + client_secret. [^18] |
| **Device Authorization** | Smart TV apps, input-constrained devices | Future-proofing for learning apps on TVs or kiosks. |

**Authorization Flow Steps (for App Install):**
1. School admin clicks "Install App" in Learnworld Marketplace.
2. Learnworld redirects admin to the app's OAuth authorization URL with `client_id`, `redirect_uri`, `scope=users:read+enrollments:read+webhooks:subscribe`, and `state` (CSRF token).
3. App displays consent screen: "Learnworld App 'Analytics Pro' is requesting permission to: read user data, read enrollments, receive webhooks."
4. Admin approves. App redirects back to Learnworld with `authorization_code`.
5. Learnworld exchanges code for `access_token` (1-hour expiry) and `refresh_token` (30-day expiry).
6. App stores tokens securely and uses `access_token` in `Authorization: Bearer {token}` header for all API calls.
7. On token expiry, app uses `refresh_token` to obtain a new `access_token` without re-prompting the admin.

**Token Scopes & Permission Granularity:**
Scopes must be granular and user-visible. Overly broad scopes (e.g., `read_all_data`) create liability and reduce admin trust. The recommended scope taxonomy maps to the capability bundles:
- `courses:read` — Read course catalog, structure, and metadata
- `courses:write` — Create/modify courses (requires admin approval)
- `users:read` — Read anonymized user profiles
- `users:read:pii` — Read personally identifiable information (email, name) — requires elevated consent
- `users:write` — Create/modify users
- `enrollments:read` — Read enrollment status and progress
- `enrollments:write` — Enroll/unenroll users in courses
- `payments:read` — Read transaction and invoice data
- `payments:write` — Process refunds, create subscriptions
- `certificates:read` — Read issued certificates
- `certificates:write` — Issue or revoke certificates
- `analytics:read` — Access aggregated analytics data
- `webhooks:subscribe` — Subscribe to platform events
- `ui:embed` — Render UI inside Learnworld (for embedded apps only)

**Admin Consent & Scope Upgrades:**
- Initial app installation uses the minimum scopes declared in the manifest.
- If an app requests additional scopes later, the school admin must re-approve via a consent screen.
- Admins can review and revoke scopes per app at any time from the "Installed Apps" dashboard.
- School-level "master admin" must approve apps that request `payments:write` or `users:write` to prevent abuse.

#### Sandboxing & Security Isolation

For embedded apps that render inside Learnworld's UI, multiple layers of isolation are required:

**1. iframe Sandbox with Capability Declarations:**
The platform generates iframes with a `sandbox` attribute based on the app's manifest. The default is restrictive: `sandbox="allow-scripts"`. Additional capabilities are explicitly granted:
```html
<iframe 
  src="https://trusted-app.com/learnworld-embed?token=..."
  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
  allow="camera; microphone; fullscreen"
  referrerpolicy="origin"
  csp="default-src 'self' https://trusted-app.com; script-src 'self' 'unsafe-inline'; ...">
</iframe>
```
- **Never** combine `allow-scripts` and `allow-same-origin` on a same-origin iframe — this allows the iframe to remove the sandbox attribute entirely. Embedded apps must always be served from a **different origin** than Learnworld (e.g., `apps.learnworld.io` vs `app.learnworld.com`). [^19]
- `allow-same-origin` is only granted to apps that need to use `localStorage` or make authenticated API calls to their own backend. Without it, the iframe operates in a unique origin and cannot access cookies or storage.

**2. Content Security Policy (CSP) per App:**
Each embedded app declares a CSP in its manifest. Learnworld enforces this CSP on the iframe via the `csp` attribute (if supported) or by proxying the iframe through a Workers/Edge function that injects `Content-Security-Policy` headers. The app cannot execute scripts from unapproved domains, load external images, or connect to unauthorized APIs.

**3. postMessage Protocol:**
Cross-origin communication between Learnworld and embedded apps uses a strict `postMessage` protocol:
- Messages must include `origin: "https://app.learnworld.com"` and a `messageId` for request/response correlation.
- Only whitelisted message types are accepted: `GET_CONTEXT`, `RESIZE`, `NAVIGATE`, `SHOW_TOAST`, `REQUEST_API_CALL` (proxied through platform).
- The parent (Learnworld) validates the message origin against the app's registered domain. Messages from unknown origins are discarded.
- The app cannot access `window.parent.location`, `window.parent.document`, or any DOM outside its iframe.

**4. API Proxy for Client-Side Requests:**
Embedded apps should not hold long-lived access tokens in browser-accessible JavaScript. Instead, Learnworld provides an API proxy:
```javascript
// App calls this via postMessage
window.parent.postMessage({
  type: "API_CALL",
  messageId: "req-123",
  method: "GET",
  path: "/courses/42/enrollments",
  headers: { "Accept": "application/json" }
}, "https://app.learnworld.com");

// Platform proxies the request with the app's stored token
// and returns the response via postMessage
```
This ensures access tokens never leak into the app's JavaScript runtime and cannot be extracted by XSS.

**5. Resource Quotas & Throttling:**
- Each embedded app is limited to 50MB of `localStorage` and `IndexedDB` combined.
- iframe JavaScript execution is throttled if CPU usage exceeds 100ms per 1-second window (using `requestIdleCallback` scheduling or Web Workers).
- Network requests from the iframe are routed through the platform's proxy and count against the app's API rate limit.

---

### White-Label Architecture

#### Multi-Tenant Foundation for White-Label Delivery

White-labeling is not merely a skinning layer — it is a **tenant-aware architecture** that enables a single codebase to serve hundreds of distinct branded learning platforms. The most expensive mistake in white-label SaaS is conflating "multi-tenant data isolation" with "white-label branding." They are orthogonal problems requiring different solutions. [^20]

**Tenant Data Isolation Patterns:**

| Pattern | Isolation | Cost | Complexity | Best For |
|---------|-----------|------|------------|----------|
| **Shared DB, tenant_id column** | Row-level filtering; shared blast radius | Lowest | Lowest | Early-stage; tenants similar in size; no regulatory isolation requirements |
| **Schema-per-tenant** | Strong logical isolation; per-tenant backups | Medium | Medium | Tens to low-hundreds of tenants; tenants want clear data separation |
| **Database-per-tenant** | Maximum isolation; compliance-friendly | Highest | Highest | Enterprise/government clients; strict GDPR/healthcare requirements |

**Recommended Approach for Learnworld: Shared DB with Row-Level Security (RLS)**
- Start with a shared PostgreSQL database with `tenant_id` columns on all tenant-scoped tables.
- Enforce isolation via PostgreSQL Row-Level Security policies: `CREATE POLICY tenant_isolation ON courses USING (tenant_id = current_setting('app.current_tenant')::UUID);`
- The application layer sets `app.current_tenant` on each database connection based on the request's authenticated tenant context.
- For enterprise clients requiring physical isolation, offer a **dedicated database** tier (schema-per-tenant or DB-per-tenant) at a premium price point.
- Never fork the codebase for customization. Use configuration-driven variation: rules engines, workflow templates, tenant-level feature flags, branding layers, and metadata-driven forms. [^21]

**White-Label Branding Layers:**

```
┌─────────────────────────────────────────┐
│          BRANDING CONFIGURATION        │
│  Per-tenant JSON config stored in DB   │
│  e.g., themes.active_branding_id       │
├─────────────────────────────────────────┤
│  Logo & Favicon    → CDN URL             │
│  Primary Color    → #4F46E5            │
│  Secondary Color  → #10B981            │
│  Font Family      → "Inter" or custom   │
│  Custom CSS       → Validated CSS block │
│  Domain           → academy.client.com  │
│  Email Sender     → noreply@client.com  │
│  Terms of Service → /tos (customizable) │
│  Privacy Policy   → /privacy (custom)   │
└─────────────────────────────────────────┘
```

**Domain Routing Architecture:**
- Custom domains (CNAME) mapped to `*.learnworld.com` via a wildcard SSL certificate or Let's Encrypt per-domain certificates.
- Request middleware inspects the `Host` header to determine tenant context: `Host: academy.client.com` → resolve to `tenant_id = "client-uuid"` → set branding context → route request.
- The tenant resolution layer must happen at the edge (CDN/WAF level) to avoid hitting the application server for static assets and cached pages. [^22]

**Hierarchical Admin Roles for White-Label/Reseller Scenarios:**
- **Super Admin** (Learnworld internal): Platform-wide operations, billing, feature flag management, marketplace curation.
- **Partner Admin** (White-label agency): Manages a portfolio of client schools. Can create new tenants, configure default branding templates, and view aggregate analytics across their clients. Cannot access non-client tenants.
- **School Admin** (Individual tenant): Full control over their school's courses, users, branding, and installed apps. Can approve app installations within their school.
- **Instructor**: Course-level content creation and student management.
- **Student**: Learning consumption only.
- **App Developer**: External party; access only to OAuth2-scoped APIs for schools that have installed their app.

**Configuration Scale vs. Customization Scale:**
The key to white-label scalability is **configuration, not customization**. Each white-label request should be answered with a configuration option, not a code change:
- Custom billing rule? → Rules engine with tenant-specific expressions.
- Branded workflow? → Workflow template with tenant-specific parameters.
- Custom dashboard? → Admin widget system with tenant-specific layout configs.
- Custom enrollment logic? → Policy engine with per-tenant rule evaluation.

This preserves upgradeability: a single code push updates all tenants simultaneously. Forking code for partner customization creates "technical debt that grows exponentially with each new partner." [^23]

---

### Developer Experience (DX) — Portal, SDKs, Docs

#### The Developer Portal as a Competitive Moat

Developer experience is not a nice-to-have — it is a core moat for platform ecosystems. "Developers abandon APIs that take hours instead of minutes to integrate." The difference between a 5-minute and a 5-hour first API call often comes down to design choices made months earlier. [^24]

**Learnworld Developer Portal Requirements:**

1. **Interactive API Reference**: 
   - Auto-generated from OpenAPI 3.1 spec. Every endpoint shows request/response schemas, authentication requirements, and rate limits.
   - "Try It" console where developers can execute live API calls against a sandbox environment with pre-populated test data.
   - GraphQL Explorer (GraphiQL) with the full schema, query examples, and complexity analysis.

2. **Sandbox Environment**:
   - Every developer account gets a free, isolated sandbox school with pre-seeded data (sample courses, test users, dummy transactions).
   - Sandbox API base URL: `https://sandbox-api.learnworld.com/v1/`
   - Sandbox has its own webhook endpoint viewer — developers can see webhook payloads in real-time without setting up a receiver.
   - Webhook test tool: manually trigger any event type with custom payload overrides to test handler logic.

3. **SDKs & Code Generation**:
   - Auto-generate idiomatic SDKs from OpenAPI spec in 6+ languages: **TypeScript/JavaScript**, **Python**, **Ruby**, **PHP**, **Go**, **Java**.
   - SDKs must include: authentication helpers, automatic pagination (cursor handling), exponential backoff retry logic, idempotency key generation, and webhook signature verification utilities.
   - Publish to official package registries: npm, PyPI, RubyGems, Packagist, Maven Central, Go Modules.
   - SDK versioning strictly matches API versioning. `learnworld-sdk@1.x` calls `v1` APIs; `learnworld-sdk@2.x` calls `v2` APIs.
   - Use tools like **Speakeasy** or **Fern** for spec-first SDK generation to prevent drift between API implementation and client libraries. [^25]

4. **Postman Collection**:
   - Official Postman collection with environment variables for sandbox and production.
   - Pre-request scripts for OAuth2 token refresh.
   - Test scripts for validating response schemas and pagination.

5. **Documentation Quality**:
   - **Quickstarts**: "Build your first app in 5 minutes" — a guided tutorial that creates an OAuth2 app, makes the first API call, and receives the first webhook.
   - **Guides**: Authentication deep-dive, webhook reliability best practices, iframe embedding tutorial, GraphQL query optimization.
   - **Reference**: Complete API endpoint documentation, webhook event catalog, error code glossary, rate limit headers explanation.
   - **Changelog**: API version release notes with breaking change indicators, migration guides, and deprecation timelines.
   - **Status page**: Real-time API uptime, webhook delivery latency, and incident history at `status.learnworld.com`.

6. **Community & Support**:
   - Developer Discord/Forum for peer support, app showcase, and feature requests.
   - Partner program with tiered benefits (Bronze/Silver/Gold/Platinum) based on app install count and revenue generated.
   - Dedicated technical account manager for Gold/Platinum partners.
   - Office hours: weekly live Q&A sessions with the Learnworld API team.

7. **App Builder Tooling**:
   - **App CLI** (`@learnworld/cli`): Scaffold a new app with `learnworld app create`, run a local dev server with webhook tunneling (ngrok-style), validate manifests, and submit to the marketplace.
   - **UI Extension Simulator**: A local browser tool that renders sandboxed iframes with the exact same CSP, sandbox, and postMessage protocol as production — enabling UI development without a full Learnworld environment.
   - **Webhook Inspector**: Browser extension or dashboard panel that shows all webhook deliveries to a developer's endpoint, with payload diffs, retry history, and HMAC signature verification.

---

### Integration Ecosystem Strategy

#### Marketplace Strategy: From Product to Platform

SaaS platforms win when they reduce friction across discovery, procurement, billing, and lifecycle management — while partners help customers integrate and optimize. The strongest SaaS businesses treat architecture as a revenue system: tenant design, observability, automation, and governance determine whether the platform can scale profitably. [^26]

**Learnworld Marketplace Architecture:**

```
┌─────────────────────────────────────────────────────────────┐
│                 LEARNWORLD MARKETPLACE                        │
│                                                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │  Categories │  │  Featured   │  │  Partner Spotlight  │  │
│  │             │  │             │  │                     │  │
│  │  Analytics  │  │  ★ Editor's │  │  "Build with AgencyX"│  │
│  │  Marketing  │  │    Choice   │  │                     │  │
│  │  Commerce   │  │  ★ Trending │  │                     │  │
│  │  Content    │  │             │  │                     │  │
│  │  Community  │  │             │  │                     │  │
│  │  Credentials│  │             │  │                     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  App Card: Logo, Name, Rating, Install Count, Price       ││
│  │  One-click install → OAuth consent → Auto-provision      ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

**Category Strategy — 6 Core Verticals:**
1. **Analytics & Intelligence**: BI dashboards, learner engagement analytics, predictive dropout risk, AI-powered insights.
2. **Marketing & Growth**: Email marketing (Klaviyo, Mailchimp), affiliate management, referral programs, SEO tools, ad tracking.
3. **Commerce & Finance**: Tax calculation (Avalara, TaxJar), multi-currency, subscription management, invoicing, BNPL (Buy Now Pay Later).
4. **Content & Media**: AI video generation, interactive H5P content, SCORM/xAPI players, 3D/VR learning experiences, podcast hosting.
5. **Community & Engagement**: Gamification (badges, leaderboards, streaks), discussion forums, live events, mentoring marketplaces, Slack/Discord integration.
6. **Credentials & Compliance**: Blockchain certificates, digital credential wallets (Credly, Badgr), proctoring (Proctorio, Examity), accreditation reporting.

**Partner Economics & Moat Building:**
- **Revenue sharing**: 70/30 split (developer/platform) for paid apps. For enterprise apps with direct sales, the platform takes a 15% transaction fee on subscriptions processed through the marketplace billing system.
- **App billing integration**: Learnworld handles subscription billing, invoicing, and tax collection for marketplace apps. Developers receive monthly payouts. This reduces friction for developers and ensures the platform captures the payment flow.
- **Certified developer program**: Agencies can become "Learnworld Certified Partners" with a certification exam, co-marketing benefits, and a directory listing. This creates a service provider network — a powerful moat because agencies build practices around the platform and have real switching costs. [^27]
- **Template marketplace**: Beyond apps, offer course templates, page layouts, email sequences, and workflow automations created by the community. Quality templates drive discovery and retention. AI-generated content is allowed but must be labeled and subject to human curation for featured placement.
- **LTI 1.3 Advantage Standard**: Support LTI 1.3 and LTI Advantage (Names and Role Provisioning, Deep Linking, Assignment and Grade Services) to enable plug-and-play integration with the existing educational technology ecosystem — Canvas, Blackboard, Moodle, D2L integrations become trivial. [^28]

**Integration Discovery & Procurement:**
- In-app marketplace browser accessible from the school admin dashboard.
- "People who use X also use Y" recommendations based on install patterns across the platform (anonymized, aggregated).
- "Missing integration" feature request voting — schools upvote desired integrations, and Learnworld uses this data to prioritize partnership outreach.
- One-click install: No code required. OAuth consent → auto-provisioning → immediate availability. For apps requiring configuration, a guided setup wizard runs inside the iframe embed.

---

### Versioning & Backward Compatibility

#### API Versioning Strategy

API versioning is a contractual commitment to developers. Breaking changes without proper versioning destroy trust and create integration debt. Learnworld must treat the API as a public contract and maintain backward compatibility for a minimum of 18 months after deprecation. [^29]

**Versioning Mechanics:**
- **URL-based versioning** for REST: `https://api.learnworld.com/v1/courses`, `https://api.learnworld.com/v2/courses`.
- **Request header versioning** as an alternative: `Accept: application/vnd.learnworld+json; version=2`.
- **GraphQL schema versioning**: GraphQL uses schema evolution. Fields are never removed; they are marked `@deprecated` with a sunset date. New fields are additive only. Major schema changes are rare and communicated 12 months in advance.
- **Webhook versioning**: Each webhook subscription specifies a payload version. When a new version is released, existing subscriptions continue receiving the old version. Developers must explicitly upgrade subscriptions in the developer portal. Both versions are supported for 12 months.

**Deprecation Policy:**
1. **Announcement**: 12 months before deprecation, communicate via developer blog, email, and changelog.
2. **Migration guide**: Publish a detailed migration guide with before/after examples, SDK upgrade instructions, and a breaking change diff.
3. **Deprecation headers**: Include `Sunset: <date>` and `Deprecation: true` headers in responses for deprecated endpoints.
4. **SDK migration**: Release updated SDKs that support both old and new API versions with clear deprecation warnings in the console.
5. **Sunset**: After the deprecation window, return `410 Gone` with a link to the migration guide. Never silently remove an endpoint.

**Breaking Change vs. Non-Breaking Change Classification:**

| Change Type | Breaking? | Example |
|-------------|-----------|---------|
| Removing an endpoint | **Yes** | `DELETE /v1/courses/{id}` removed |
| Renaming a field | **Yes** | `user_name` → `username` |
| Changing field type | **Yes** | `price` from string to number |
| Adding a required parameter | **Yes** | New required `currency` query param |
| Adding a new endpoint | No | `GET /v1/courses/{id}/analytics` |
| Adding an optional field | No | `course` object now includes `author_bio` |
| Expanding enum values | No | `status` enum adds `archived` |
| Changing pagination default | **Yes** | Default `limit` changes from 50 to 20 |
| Changing error format | **Yes** | Error response structure changes |

**Backward Compatibility for Embedded Apps (UI Extensions):**
- The `postMessage` protocol version is included in every context message: `{ protocolVersion: "1.3", ... }`. Apps must declare their minimum supported protocol version in the manifest.
- If Learnworld updates the postMessage protocol, it must continue sending messages in the old format to apps that have not upgraded. New features use new message types; old message types remain unchanged.
- UI block definitions (course builder blocks, admin widgets) use a JSON schema version. The platform validates app-submitted block configs against the declared schema version.

**Platform Upgrade Safety:**
- Because apps run externally (not inside Learnworld core), platform upgrades cannot break third-party apps. The API contract is the only interface. This is the single greatest advantage of the external app model over the WordPress plugin model.
- Internal platform upgrades may change database schemas, but the API layer provides a stable abstraction. Database migrations never affect external API consumers.
- If a breaking API change is absolutely necessary, it is released as a new API version (`v2`), while `v1` continues operating on a compatibility layer that translates between old and new internal schemas.

**Long-Term Support (LTS) Policy:**
- API versions are designated as either "Current" (receiving new features) or "LTS" (receiving only security fixes).
- One LTS version is maintained at all times. When v3 becomes Current, v2 becomes LTS and v1 is sunset after 6 months.
- Enterprise customers on LTS API versions can extend support for an additional 12 months with a paid enterprise support contract.

---

### Citations

[^1]: WordPress Security Research Series, Wordfence, March 2025. "WordPress vulnerabilities usually involve missing or incomplete use of built-in security functions... plugins, themes, and core all share the same global environment." https://www.wordfence.com/blog/2025/03/wordpress-security-research-series-wordpress-security-architecture/

[^2]: Presta, "Beyond Plugins: WooCommerce to Shopify for Scalability," January 2026. "Average WooCommerce store: 27 active plugins... 27 plugins × 8 requests = 216 additional HTTP requests per page load... 90% of WordPress hacks exploit plugin vulnerabilities." https://wearepresta.com/migrate-from-woocommerce-to-shopify-for-scalability/

[^3]: Toimi, "WordPress for Enterprise 2026: Security & Performance at Scale," April 2026. "WordPress does not 'run' in production by itself. It runs inside an architecture... If disabling the theme breaks business logic, the theme is not an interface — it is a hidden application layer." https://toimi.pro/blog/wordpress-scale-security-performance/

[^4]: Qualimero, "Shopify Apps: Best Plugins to Boost Sales," May 2026. "Shopify calls them 'Apps'... third-party extensions that add functionality to your Shopify store. Checkout Extensibility is Shopify's new architecture for customizing the checkout process." https://qualimero.com/en/blog/shopify-apps

[^5]: IBL AI, "Canvas LMS vs Moodle LMS," March 2026. "Canvas takes a different approach entirely — no native plugin directory, extensions run via LTI 1.3 or REST API through the vetted Canvas App Center. External tools can't break Canvas during upgrades." https://ibl.ai/resources/comparisons/canvas-vs-moodle

[^6]: Moodiy Cloud, "Moodle vs Canvas vs Blackboard in 2026," February 2026. "Moodle's plugin ecosystem is unmatched — 2,700+ plugins... The caveat: quality varies significantly... audit all plugins before major version upgrades." https://blog.moodiycloud.com/moodle-vs-canvas-vs-blackboard-2026

[^7]: Pexip Developer Docs, "Sandbox Security." "With Infinity v37, to enhance the security of Plugin API, the default sandbox policy for iframes has been made more restrictive... sandboxValues property of the plugin manifest." https://developer.pexip.com/docs/infinity/web/plugins/webapp-3/sandbox-security/

[^8]: Acquaint Softtech, "Building a Public API for Your SaaS: REST vs GraphQL Design Decisions," June 2026. "REST handles roughly a third more simple requests per server, while GraphQL achieves lower latency on complex queries... default to REST unless you have a specific reason to choose GraphQL." https://acquaintsoft.com/blog/saas-public-api-development

[^9]: Fern, "API design best practices guide (March 2026)," March 2026. "Cursor-based pagination uses opaque tokens pointing to specific positions in ordered result sets... Database queries using indexed cursor values execute in constant time regardless of position." https://buildwithfern.com/post/api-design-best-practices-guide

[^10]: Fern, "API design best practices guide (March 2026)," March 2026. "Design for AI agent consumption by serving machine-readable specs at /openapi.json endpoints and generating llms.txt files, reducing token consumption by over 90% compared to HTML documentation." https://buildwithfern.com/post/api-design-best-practices-guide

[^11]: Xictron, "Webhook Architecture: Event-Driven Shop Integration," June 2026. "98.5% wasted polling requests (Zapier), 3-5% event loss without retries (Hookdeck) and 62% lower latency with an event-driven architecture (IJSAT 2025)." https://www.xictron.com/en/blog/webhook-architecture-event-driven-shop-2026/

[^12]: LiveKit, "Best practices for managing webhook event streams," February 2026. "LiveKit includes a unique ID for each webhook event. Use it as your primary dedupe key... Maintain a 'seen events' store with a unique constraint." https://livekit.com/blog/managing-webhook-event-streams

[^13]: Hookdeck, "Webhooks at Scale: Best Practices and Lessons Learned," March 2026. "Retries with backoff handle transient failures... layer all three for comprehensive webhook reliability: retries handle minutes of failure, replay handles hours, and reconciliation handles everything else." https://hookdeck.com/blog/webhooks-at-scale

[^14]: Hookdeck/InventiveHQ, "Webhook Best Practices: Production-Ready Implementation Guide," November 2025. "Signature verification implemented and tested... Timestamp validation configured (5-minute window)... Separate webhook secrets per provider." https://inventivehq.com/blog/webhook-best-practices-guide

[^15]: LiveKit, "Best practices for managing webhook event streams," February 2026. "The golden rule: ACK fast, process async... Avoid writing to your primary database, calling other services, or running full validation before returning 2xx." https://livekit.com/blog/managing-webhook-event-streams

[^16]: Scalekit, "API authentication in B2B SaaS: Methods and best practices," February 2026. "OAuth 2.0 is the go-to standard when your API needs to allow third-party applications or partners to act on behalf of users without sharing passwords." https://www.scalekit.com/blog/api-authentication-b2b-saas

[^17]: Scalekit, "OAuth 2.0 and OIDC: A Guide to Secure Authorization & Authentication." "Authorization code grant with PKCE... Best for web apps, SPAs, and mobile apps. Strongest option for apps with user-facing logins." https://www.scalekit.com/oauth-authentication

[^18]: Scalekit, "OAuth 2.0 and OIDC: A Guide to Secure Authorization & Authentication." "Client credentials grant... Best for machine-to-machine apps — no user involved. The client app authenticates itself using client_id and client_secret." https://www.scalekit.com/oauth-authentication

[^19]: Mozilla Discourse, "What's the point of forbidding a sandboxed iframe with allow-scripts and allow-same-origin?" June 2021. "If you use combination allow-scripts allow-same-origin that allows the supposedly sandboxed code to remove the sandbox attribute at runtime so there's zero additional security." https://discourse.mozilla.org/t/whats-the-point-of-forbidding-a-sandboxed-iframe-with-allow-scripts-and-allow-same-origin/81365

[^20]: T², "Multi-Tenant White-Label SaaS: Architecture Patterns That Scale," May 2026. "Every white-label SaaS pitch starts the same way: 'We need multi-tenant from day one.' Usually what the team means is 'We want each customer to see their own brand.' Those are two different problems with two different solutions." https://tsquare.com.tr/multi-tenant-white-label-saas-architecture-patterns/

[^21]: Sysgen Pro, "Multi-Tenant SaaS Architecture Lessons for Logistics Platform Performance," May 2026. "Configuration-led architecture is more scalable. Rules engines, workflow templates, tenant-level feature flags, branding layers, and metadata-driven forms allow variation without fragmenting the codebase." https://sysgenpro.com/saas/multi-tenant-saas-architecture-lessons-for-logistics-platform-performance

[^22]: Vercel, "Multi-Tenant Template." "Multi-tenant applications allow you to serve different customers with unique domains from a single codebase... The multi-tenant template uses Next.js middleware to intercept incoming requests and route them based on the hostname." https://vercel.com/platforms/docs/examples/multi-tenant-template

[^23]: HiringThing, "Multi-Tenant ATS Architecture for White Label Partners," May 2026. "Spinning up separate instances for each partner feels easier at first but becomes operationally unsustainable, consuming engineering capacity on maintenance rather than innovation." https://blog.hiringthing.com/multi-tenant-ats-architecture-for-white-label-partners

[^24]: Fern, "API design best practices guide (March 2026)," March 2026. "Developers abandon APIs that take hours to integrate. The difference between a 5-minute and 5-hour first API call often comes down to design choices made months earlier." https://buildwithfern.com/post/api-design-best-practices-guide

[^25]: Speakeasy, "SDK Best Practices," March 2024. "If you make sure your SDK is type safe, idiomatic, and compatible with their existing environment you're going to attract developers and inspire loyalty." https://www.speakeasy.com/blog/sdk-best-practices

[^26]: AppDirect, "How to Power Your SaaS Strategy with AI-Driven Ecosystem-Led Marketplaces," May 2026. "SaaS platforms win when they reduce friction across discovery, procurement, billing, and lifecycle management — while partners help customers integrate and optimize." https://www.appdirect.com/blog/3-reasons-why-saas-platforms-are-evolving-into-ecosystem-led-marketplaces

[^27]: Momentum Nexus, "Competitive Moat for AI-Era SaaS: The 7 Defensibility Types," March 2026. "Service provider network: Consultants and agencies build practices around your tool... AI-era play: Certifications and tooling that make your platform the most profitable for service providers." https://www.momentumnexus.com/blog/competitive-moat-ai-era-saas-7-defensibility-types

[^28]: IBL AI, "Canvas LMS vs Blackboard Learn," March 2026. "Canvas is widely regarded as the most developer-friendly LMS on the market. Its fully public REST API, LTI 1.3 support, and active open-source community make it the preferred platform for institutions building custom tools." https://ibl.ai/resources/comparisons/canvas-vs-blackboard

[^29]: Codingscape, "Build a future-proof digital ecosystem with API-first design," May 2023. "Versioning and backward compatibility — Plan for API versioning and maintain backward compatibility whenever possible. This minimizes disruptions for the applications or services using the API." https://codingscape.com/blog/build-a-future-proof-digital-ecosystem-with-api-first-design
