## Dim 04: Edge-First Global Infrastructure

> **Target**: Sub-50ms latency worldwide for Learnworld (LMS/SaaS).  
> **Current Stack**: Vercel + Supabase Cloud.  
> **Proposed Evolution**: Hybrid edge-native architecture combining Cloudflare Workers (edge API), Vercel (SSR/Next.js), and Supabase (primary database + read replicas).  
> **Last Updated**: 2026-07-10

---

### 1. Edge Compute Strategy (Cloudflare Workers + Vercel Edge Hybrid)

#### 1.1 Platform Comparison & Selection Rationale

The serverless landscape has shifted decisively to the edge. Three platforms dominate the 2026 conversation: **Cloudflare Workers**, **Vercel Edge Functions**, and **AWS Lambda@Edge** [^1][^2].

| Metric | Cloudflare Workers | Vercel Edge | AWS Lambda@Edge |
|--------|-------------------|-------------|-----------------|
| Cold Start | 0-5ms (sub-1ms in 2026) | 10-50ms | 100-3000ms |
| Warm Latency (P50) | 1-10ms | 5-30ms | 5-50ms |
| Global Distribution | Automatic (330+ cities) | Automatic (edge) | Manual (200+ PoPs) |
| Max Duration | 30s (paid), up to 5 min | 25s | 30s |
| Memory | 128MB | 128MB | Up to 3,008MB |
| Concurrent Requests | Unlimited (V8 isolates) | Plan-based | 1,000/region |
| Egress Cost | **$0** | $0 (Pro tier) | $0.09/GB |

[^1]: Cloudflare Workers vs AWS Lambda vs Vercel Edge Functions - 2025 Serverless Comparison, compare.crashbytes.com  
[^2]: Lambda@Edge vs Cloudflare Workers vs Vercel Edge: Latency, Limits, and Cost in 2025, prabhatgiri.com

**Cloudflare Workers** runs on V8 isolates rather than containers, achieving effectively zero cold starts. Every deployment is global across 330+ cities simultaneously, executing within 50ms of 95% of the world's population [^3]. The pricing model is CPU-time-based rather than wall-clock, making I/O-bound workloads (API gateways, proxies) 70-90% cheaper than Lambda [^3][^4].

**Vercel Edge Functions** (powered by Cloudflare's network) are optimized for Next.js. While cold starts are near-zero, response times sit at 20-50ms median—slower than pure Workers but ideal for SSR and frontend-centric workloads [^1][^2]. Vercel's 2025 introduction of **Fluid Compute** enables in-function concurrency (multiple requests sharing one instance), cutting compute costs by up to 85% for I/O-bound workloads [^5][^6].

**Recommended Hybrid for Learnworld**:

| Layer | Platform | Responsibility |
|-------|----------|---------------|
| SSR / Frontend | Vercel + Next.js | Server components, ISR, preview deployments |
| Edge API / Auth | Cloudflare Workers | JWT validation, tenant routing, A/B testing, lightweight API |
| Real-time / Stateful | Cloudflare Durable Objects | Chat rooms, presence, WebSocket signaling |
| Asset Storage | Cloudflare R2 | Video, images, downloads (zero egress) |
| Database | Supabase PostgreSQL | Primary DB + read replicas |
| Edge Cache | Cloudflare KV | Feature flags, session tokens, config |

[^3]: What Are Cloudflare Workers? Edge Serverless (2026), techjacksolutions.com  
[^4]: The Edge Computing Opportunity: It's Not What You Think, blog.cloudflare.com  
[^5]: Introducing Fluid compute: The power of servers, in serverless form, vercel.com/blog  
[^6]: Vercel Fluid Compute vs Serverless: What Changes in 2025?, merginit.com

#### 1.2 Edge Function Use Cases for Learnworld

Per industry research, edge functions are ideal for: **auth**, **personalization**, **A/B testing**, **lightweight API**, **tenant routing**, and **geolocation-based features** [^1][^7]. For an LMS platform like Learnworld, specific edge function responsibilities include:

- **JWT Ingress Verification**: Validate short-lived tokens at the CDN layer before requests reach origin—returning 401/403 in <5ms [^8].
- **Tenant Routing**: Route requests to the correct Supabase project or read replica based on hostname or path prefix (`tenant.learnworld.com` or `/api/v1/{tenant}/...`).
- **A/B Testing & Feature Flags**: Query Cloudflare KV for experiment assignments and rewrite responses without origin round-trips.
- **Geo-personalization**: Serve localized content, currency, and compliance notices based on `CF-IPCountry`.
- **Rate Limiting**: Apply per-tenant or per-user rate limits at the edge using KV-based token buckets.
- **API Proxy**: Route `/api/edge/*` calls through Workers for sub-20ms response on read-heavy endpoints.

[^7]: Cloud Computing Trends 2025: Edge & Serverless Explained, prismberry.com  
[^8]: Authentication Trends in 2026: Passkeys, AI Agents, and Edge Auth, clerk.com

#### 1.3 Vercel Fluid Compute for SSR/AI Workloads

Vercel's **Fluid Compute** (enabled by default since April 2025) represents a significant evolution. It allows multiple invocations to share a single function instance, processes background tasks via `waitUntil`, and supports execution up to 800s (Pro/Enterprise) or 30 minutes (beta) [^5][^6]. For Learnworld:

- **Next.js SSR**: Fluid Compute handles concurrent user sessions efficiently, reducing cold starts via bytecode caching.
- **AI Workloads**: Streaming LLM responses via Vercel AI SDK benefits from `waitUntil` for post-response analytics.
- **Long Jobs**: Background report generation, bulk exports, or video processing queues.

Trade-off: Fluid Compute is currently limited to Node.js and Python runtimes. Memory under 1GB loses concurrency benefits [^6].

---

### 2. CDN & Global Asset Delivery

#### 2.1 Video CDN Architecture for LMS

Video content represents the most bandwidth-intensive component of modern LMS platforms [^9]. For Learnworld, which serves educational video globally, the delivery stack must include:

1. **Origin Storage**: Cloudflare R2 (S3-compatible, zero egress) or Supabase Storage.
2. **Adaptive Bitrate (ABR) Streaming**: HLS/DASH with multiple renditions (360p, 480p, 720p, 1080p) so learners on weak networks receive functional playback [^9][^10].
3. **Global CDN**: Cloudflare's 330+ edge PoPs cache video segments close to viewers. Cache hits are served sub-50ms.
4. **Tokenized Access**: Signed URLs or JWT-based playback tokens to prevent unauthorized downloads.
5. **Recording -> VOD Pipeline**: Live sessions automatically transcoded to VOD with chapter markers for replay [^9].

[^9]: How Content Delivery Networks Enhance LMS Performance and Learner Experience, eleapsoftware.com  
[^10]: Global Education Live Streaming: CDN & Delivery Guide, dacast.com

#### 2.2 Cloudflare R2 for Video Storage

Cloudflare R2 is purpose-built for high-egress workloads. At $0.015/GB storage with **zero egress fees**, it fundamentally disrupts AWS S3 economics [^11][^12]. One real-world case delivered 15TB of 4K video for $2.18/month versus $1,500-$5,000 on traditional video hosts [^12].

| Provider | Monthly Cost (15TB served) |
|----------|---------------------------|
| Cloudflare R2 | ~$2.18 (storage only, egress free) |
| Vimeo | ~$1,500 (bandwidth-based) |
| Wistia | ~$5,019 (bandwidth + base fee) |
| Mux | ~$1,272 (per-minute billing) |

[^11]: Cloudflare R2 Object Storage, Zero Cost Egress Traffic, lowendtalk.com  
[^12]: Delivering 15TB of 4K video with Cloudflare R2 for $2.18, screencasting.com

**R2 Limitations for Video**: R2 stores data in a single primary location and relies on CDN edge cache for read performance. For truly global low-latency on first access, consider **Cloudflare Stream** (managed video pipeline with encoding, HLS/DASH delivery, and adaptive bitrate) or pairing R2 with Workers that handle range requests and caching headers [^13].

[^13]: Can we serve video with r2? - Storage, community.cloudflare.com

#### 2.3 CDN Configuration for Learnworld

```
Traffic Flow:
  User Request -> Cloudflare Edge (330+ PoPs)
    |-- Static Assets (JS, CSS, images) -> Cache -> <20ms
    |-- Video Segments (HLS .m3u8, .ts) -> Cache -> <50ms
    |-- API /graphql, /api/* -> Cloudflare Worker -> <20ms
    |-- SSR Pages -> Vercel Edge -> <50ms
```

**Cache Strategy**:
- Static assets: Cache-Control `public, max-age=31536000, immutable`
- Video segments: `public, max-age=86400` (1 day), stale-while-revalidate
- API responses: `private, no-store` for authenticated; `public, max-age=60` for catalog data
- Feature flags / config: `public, max-age=3600` with KV as backing store

---

### 3. Database Strategy (Primary + Read Replicas + Edge Caching)

#### 3.1 Supabase Read Replicas for Global Distribution

Supabase Read Replicas distribute read traffic across multiple databases deployed in different AWS regions [^14][^15]. Key capabilities:

- **Multi-region Deployment**: Deploy replicas closer to users (e.g., primary in `us-east-1`, replicas in `eu-west-1`, `ap-southeast-1`).
- **API Load Balancer**: Automatically routes GET requests to the nearest available replica via round-robin [^15].
- **Dedicated Endpoints**: Each replica provides separate connection strings for direct access.
- **Connection Pooling**: Supavisor provides pooled connections per replica.
- **Replication Lag**: Asynchronous replication; typical lag is milliseconds to seconds depending on write volume [^14].

| Operation | Primary | Read Replica |
|-----------|---------|-------------|
| SELECT | Yes | Yes |
| INSERT | Yes | No |
| UPDATE | Yes | No |
| DELETE | Yes | No |
| Realtime | Yes | No (reads only) |

[^14]: Read Replicas | Supabase Docs, supabase.com/docs  
[^15]: Introducing Read Replicas, supabase.com/blog

**Read Replica Limitations**:
- Automatic failover (promoting replica to primary) is **Enterprise-only** [^16].
- No built-in multi-region clustering; reads are distributed but writes are single-region.
- Realtime subscriptions (WebSocket broadcasts) run against the primary.

[^16]: 10 Best Managed Postgres Providers Compared (2026), dreamlit.ai

#### 3.2 Edge Database Patterns for LMS

For an LMS with global users, the recommended database architecture is **write-primary + read-replica + edge cache**:

```
Write Path:
  User -> Edge Worker -> Vercel/Origin -> Supabase Primary (us-east-1)
    -> Replicate async -> Read Replicas (EU, APAC)

Read Path:
  User -> Edge Worker -> Check KV Cache -> Hit? Return <5ms
    -> Miss? Route to nearest Read Replica -> Cache in KV for 60s
```

**Edge Caching with Cloudflare KV**:
- Hot data (course catalog, user progress summaries, feature flags) cached at edge with <5ms reads [^17].
- KV is **eventually consistent** (up to 60s propagation). Design for workloads where stale reads are acceptable [^17][^18].
- Write limit: 1 write/second per key. Use key sharding (`progress:{userId}:{timestamp}`) for high-frequency counters [^17].

[^17]: Cloudflare Workers KV in Practice: A Complete Guide, eastondev.com  
[^18]: KV deep-dive: global cache, eventual consistency, KV vs D1, cloudsecop.net

**Alternative: Cloudflare D1 (SQLite at Edge)**
- D1 is a serverless SQL database distributed globally, but it has a 10GB limit per database and is SQLite-based—not suitable as a primary transactional DB for a large LMS [^16][^19].
- Best used for edge-local caching of relational data, not as the source of truth.

[^19]: Cloudflare D1 (SQLite distributed), referenced in serverless architecture guides 2025

#### 3.3 Connection Pooling & Supavisor

Supabase uses **Supavisor** (a cloud-native connection pooler) to handle thousands of concurrent connections. Each read replica gets its own Supavisor instance. For Learnworld:

- Use **Supabase JavaScript client** with `db` role for reads from nearest replica.
- Use **service role** (or Edge Function with `supabaseAdmin`) for writes routed to primary.
- Implement **read-your-writes consistency** by tagging recent writes and routing subsequent reads to primary for 5 seconds.

---

### 4. Real-Time at Edge (WebSockets, Durable Objects, Supabase Realtime)

#### 4.1 The Challenge: Real-Time in a Serverless World

Real-time features (chat, presence, notifications, collaborative editing) traditionally require WebSocket servers, Redis pub/sub, and complex state management. In serverless environments, stateless functions struggle with persistent connections [^20].

Cloudflare's solution is **Durable Objects**—stateful, single-threaded JavaScript instances with persistent SQLite storage and built-in WebSocket support [^21][^22].

[^20]: WebSockets in Cloudflare & AWS, pikku.dev/blog  
[^21]: Cloudflare Durable Objects | Build stateful apps, cloudflare.com  
[^22]: Live Collaborative Editing in Astro with Cloudflare Durable Objects, launchfa.st

#### 4.2 Durable Objects Architecture for Learnworld

```
Real-Time Room Model:
  Course Chat Room -> Durable Object (id = "chat:course:{courseId}")
    |-- WebSocket connections from all students/instructors
    |-- SQLite storage for message history (last 1000 messages)
    |-- Presence tracking (who is online)
    |-- Broadcast messages to all connected clients

Notification Hub -> Durable Object (id = "notifications:{userId}")
    |-- Per-user WebSocket connection
    |-- Buffer missed messages while offline
    |-- Push to FCM/APNs when user disconnected
```

**Key Durable Objects Features**:
- **Single-threaded execution**: No race conditions; all requests for a room route to the same instance [^21].
- **WebSocket Hibernation**: Objects sleep when idle but keep connections alive. You pay only for active compute time, not 24/7 uptime [^23].
- **SQLite Storage**: Up to 10GB per object (GA since April 2025), with strongly consistent local queries [^24].
- **20:1 billing ratio** for incoming WebSocket messages: 1 million messages billed as 50,000 requests [^23].

[^23]: Pricing - Cloudflare Durable Objects docs, developers.cloudflare.com  
[^24]: cloudflare-durable-objects | Skills Marketplace, lobehub.com

#### 4.3 Cost-Effective Real-Time with Hibernation

A real-world Durable Objects chat example [^23]:

- 100 chat rooms, 100 WebSocket connections each
- 1 message per minute per room, 10ms processing time
- **Total cost: ~$10/month** (requests + duration + $5 Workers base)

Without hibernation, the same workload would cost ~$416/month because duration is billed for wall-clock time while connections are open [^23].

**Implementation Pattern for Learnworld**:
```typescript
class ChatRoom extends DurableObject {
  async fetch(request: Request) {
    const upgrade = request.headers.get("Upgrade");
    if (upgrade === "websocket") {
      const [client, server] = new WebSocketPair();
      this.ctx.acceptWebSocket(server); // Hibernation API
      // Store session, broadcast join, load history
      return new Response(null, { status: 101, webSocket: client });
    }
  }
  
  async webSocketMessage(ws, message) {
    // Parse, persist to SQLite, broadcast to all connections
  }
  
  async webSocketClose(ws) {
    // Remove session, broadcast leave
  }
}
```

#### 4.4 Supabase Realtime for Database Subscriptions

Supabase Realtime provides **Postgres Changes** (database row-level broadcasts) and **Broadcast** (arbitrary channel messages) out of the box [^25]. For Learnworld:

- **Use Supabase Realtime** for: live progress updates, notification feeds, presence in course dashboards (when user is near the primary DB region).
- **Use Durable Objects** for: cross-region chat rooms, live class collaboration, WebRTC signaling, and any stateful coordination that needs <20ms globally.

[^25]: Supabase Realtime documentation, supabase.com

#### 4.5 WebRTC Signaling at Edge

WebRTC requires a signaling server to exchange SDP offers/answers and ICE candidates. Traditional approaches use Firebase, WebSocket servers, or custom backends. For a cost-effective, global-edge solution:

**P2PCF (Peer-to-Peer Cloudflare)** is an open-source pattern that uses Cloudflare Workers + R2 for serverless WebRTC signaling [^26][^27]. Instead of maintaining persistent WebSocket connections, it uses HTTP polling with exponential backoff, making it extremely cheap (often free within Cloudflare's free tier: 100K requests/day, 1M R2 writes/month) [^26].

```
WebRTC Signaling Flow (P2PCF pattern):
  Peer A -> POST /signal/{room} (offer SDP) -> Worker writes to R2
  Peer B -> GET /signal/{room} (poll) -> Worker reads from R2, receives offer
  Peer B -> POST /signal/{room} (answer SDP) -> Worker writes to R2
  Peer A -> GET /signal/{room} (poll) -> Worker reads from R2, receives answer
  ICE candidates exchanged via DataChannel after initial connection
```

[^26]: P2PCF - Low cost, low effort P2P WebRTC serverless signalling, github.com/gfodor/p2pcf  
[^27]: Show HN: P2PCF - Low cost, low effort WebRTC signalling using Cloudflare workers, news.ycombinator.com

**For production Learnworld**: Use **Durable Objects with WebSocket Hibernation** instead of R2 polling for lower latency. Durable Objects can maintain the signaling state in memory and broadcast ICE candidates to all peers in a room instantly.

Cloudflare also offers a **managed TURN server** (Cloudflare Realtime) to ensure WebRTC streams reach users behind firewalls [^28].

[^28]: How WebRTC works: What is WebRTC used for?, cloudflare.com/learning

---

### 5. Data Residency & Compliance

#### 5.1 Regulatory Landscape

Data residency (the physical/geographic location where data is stored and processed) is governed by:

- **GDPR (EU)**: Personal data must be processed within the EEA or under approved transfer mechanisms (SCCs, adequacy decisions) [^29][^30].
- **CCPA/CPRA (California)**: Requires transparency about data processing locations; stricter for "sensitive personal information."
- **LGPD (Brazil)**: Similar to GDPR; data must remain in Brazil unless international transfer safeguards apply.
- **EU AI Act (2026)**: Adds compute and data residency requirements for AI systems processing EU citizen data [^30].

[^29]: What is Data Residency?, peakhour.io  
[^30]: GDPR-Compliant AI Support With EU Data Residency, alhena.ai

#### 5.2 Architecture Patterns for Compliance

**Pattern 1: Separate Data Centers per Jurisdiction**

The cleanest approach is treating each region as an independent production environment with complete replicas of the application stack [^30]:

```
EU Stack:
  Cloudflare Workers (EU edge nodes) -> Supabase Primary (eu-west-1)
  Cloudflare R2 (EU bucket) -> Video/content stored in EU
  
US Stack:
  Cloudflare Workers (US edge nodes) -> Supabase Primary (us-east-1)
  Cloudflare R2 (US bucket)
  
Admin/Analytics:
  Edge server (router) -> Route to correct regional stack based on user location
```

**Pattern 2: Edge Processing with Jurisdictional Boundaries**

For Learnworld, a lighter-weight approach:

1. **Edge Compute**: Process authentication, personalization, and non-PII requests at the nearest Cloudflare edge node (global).
2. **Data Storage**: Store PII (user profiles, progress, chat history) in the jurisdiction-matching Supabase primary.
3. **Read Replicas**: EU users read from EU replicas; US users from US replicas. No cross-border data movement for reads.
4. **Cross-border Writes**: Only when a user explicitly accesses content from another region (e.g., a US student taking an EU course).
5. **Anonymized Analytics**: Aggregate learning analytics (completion rates, engagement) are anonymized and can flow to a central analytics warehouse.

[^30]: GDPR-Compliant AI Support With EU Data Residency, alhena.ai

#### 5.3 Edge-Specific Compliance Measures

- **KV Data Classification**: Never store PII in Cloudflare KV (eventually consistent, no encryption guarantees). Use KV only for feature flags, session tokens, and public config [^18].
- **Durable Objects Region Pinning**: Use `locationHint` to pin Durable Objects to specific jurisdictions (e.g., EU chat rooms run on EU Durable Object nodes) [^31].
- **R2 Location Hints**: Create R2 buckets with location hints (`eu`, `us`, `apac`) to ensure video content stays within the intended region [^32].
- **Zero Trust + Geo Access**: Cloudflare Access can enforce geographic access controls—block admin panels from non-approved countries [^29].

[^31]: Durable Objects support for Oceania region, developers.cloudflare.com  
[^32]: Overview - Cloudflare R2 docs, developers.cloudflare.com

#### 5.4 Shadow Identifiers for Cross-Region Sessions

For admin users who need to manage multiple regions, implement "shadow identifiers"—partial profile representations that don't contain actual PII but maintain session continuity across regional stacks [^30]. This avoids violating GDPR while enabling multi-region operations.

---

### 6. Tenant Routing at Edge

#### 6.1 Multi-Tenant Routing with Cloudflare Workers

Learnworld serves multiple schools/organizations (tenants). Routing requests to the correct tenant and database at the edge eliminates origin round-trips:

```
Routing Strategy:
  1. Subdomain: tenant.learnworld.com
     -> Worker extracts tenant from Host header -> KV lookup -> tenant config
  
  2. Path: learnworld.com/t/{tenantId}/...
     -> Worker extracts tenantId from path -> KV lookup
  
  3. Custom Domain: school.edu
     -> Worker checks CNAME -> resolves to tenant config
```

**Tenant Config in KV** (per-tenant JSON, cached for 1 hour):
```json
{
  "tenantId": "abc123",
  "primaryRegion": "us-east-1",
  "readReplicaEndpoints": ["eu-west-1", "ap-southeast-1"],
  "features": { "aiTutor": true, "liveClass": true },
  "plan": "enterprise",
  "rateLimit": { "requestsPerMinute": 10000 }
}
```

#### 6.2 Connection String Selection

```typescript
// Worker pseudocode
export default {
  async fetch(request, env) {
    const tenant = await getTenantFromRequest(request, env.KV);
    const isWrite = request.method !== 'GET' && request.method !== 'HEAD';
    
    const dbUrl = isWrite 
      ? tenant.primaryDbUrl 
      : getNearestReplica(request.cf.colo, tenant.replicas);
    
    // Route to Supabase with tenant-specific connection
    return proxyToSupabase(request, dbUrl, tenant.jwtSecret);
  }
};
```

#### 6.3 Tenant Isolation & Security

- **Row-Level Security (RLS)**: Supabase RLS policies enforce tenant isolation at the database level. The Worker passes the tenant-scoped JWT to Supabase.
- **Rate Limits per Tenant**: KV-based token bucket per `tenantId`, reset every minute.
- **Custom Domain SSL**: Cloudflare automatically provisions SSL for `*.learnworld.com` and custom domains via CNAME.

---

### 7. Cost Model (Per-Request vs Per-Compute)

#### 7.1 Cloudflare Workers Pricing

Cloudflare Workers charges for **CPU time**, not wall-clock time. This is the critical cost advantage for I/O-bound workloads [^3][^4].

| Plan | Requests | CPU Time | Cost |
|------|----------|----------|------|
| Free | 100,000/day | 10ms/invocation | $0 |
| Paid (minimum) | 10M/month included | 30M CPU-ms/month | $5/month |
| Overage | +$0.30/million | +$0.02/million CPU-ms | — |
| Egress | Unlimited | — | $0 |

**Real-world example**: 10M requests/month, 50ms avg CPU = **$15/month** total [^1].

**Baselime Case Study**: Baselime (observability platform) migrated from AWS Lambda to Cloudflare Workers in 2024 and achieved **83% cost reduction** [^33][^34]:

| Daily Cost | Before (AWS) | After (Cloudflare) |
|-----------|-------------|-------------------|
| Compute | $650 (Lambda) | $25 (Workers) |
| CDN | $140 (CloudFront) | $0 (Free) |
| Data Stream + Analytics | $1,150 (Kinesis + EC2) | $300 (Analytics Engine) |
| **Total** | **$1,940/day** | **$325/day** |

[^33]: Moving Baselime from AWS to Cloudflare, blog.cloudflare.com  
[^34]: Cloud and AI Infrastructure Cost Optimization: A Comprehensive Review, arxiv.org

#### 7.2 Vercel Pricing

| Plan | Edge Requests | Bandwidth | Cost |
|------|--------------|-----------|------|
| Hobby | 100K/month | 100GB | $0 |
| Pro | 1M/month | 1TB | $20/user/month |
| Overage | +$2/million | +$0.15/GB | — |

Vercel Pro at 10M requests/month = **$38/month** (base + 9M overage). At 100M requests, it reaches Enterprise tier ($500-5,000+/month) [^1].

#### 7.3 Durable Objects Pricing

| Metric | Free | Paid |
|--------|------|------|
| Requests | 100K/day | 1M/month + $0.15/million |
| Duration | 13,000 GB-s/day | 400,000 GB-s/month + $12.50/million GB-s |
| SQLite Storage | 5GB | 5GB + $0.20/GB-month |

**WebSocket cost optimization**: Using hibernation, a 100-room chat with 100 connections each (1 msg/minute) costs **~$10/month** versus **$416/month** without hibernation [^23].

#### 7.4 R2 Pricing

| Metric | Cost |
|--------|------|
| Storage | $0.015/GB/month |
| Class A (write) ops | $4.50/million |
| Class B (read) ops | $0.36/million |
| Egress | **$0** |

For Learnworld serving 10TB of video content with 500M reads/month: ~$150 storage + $180 reads = **$330/month** versus thousands in egress on AWS S3 [^11][^12].

#### 7.5 Supabase Pricing (for reference)

| Tier | DB | Auth | Storage | Edge Functions |
|------|-----|------|---------|----------------|
| Free | 500MB | 50K MAU | 1GB | 500K invocations |
| Pro | $25/mo | 100K MAU | 100GB | 2M invocations |
| Team | $599/mo | 200K MAU | 1TB | 5M invocations |

Read replicas are available on Pro+ (additional compute instance cost) [^14][^16].

#### 7.6 Estimated Learnworld Monthly Cost (100K active users, 50M requests/month)

| Service | Estimated Monthly Cost |
|---------|----------------------|
| Cloudflare Workers (Paid) | $20 (50M requests, ~50ms CPU) |
| Cloudflare Durable Objects | $30 (real-time chat + signaling) |
| Cloudflare R2 (10TB video) | $150 storage + $90 reads |
| Cloudflare KV | Included in Workers |
| Vercel Pro (SSR) | $20/user x 3 = $60 |
| Supabase Pro + 2 Read Replicas | $25 + $50 + $50 = $125 |
| **Total** | **~$475/month** |

Comparable AWS architecture (Lambda + CloudFront + S3 + RDS): **$2,000-5,000/month** depending on egress [^1][^33].

---

### 8. Performance Targets & Monitoring

#### 8.1 Latency Targets

| Layer | Target | Measurement |
|-------|--------|-------------|
| Edge API (Workers) | P50 < 20ms, P99 < 50ms | Cold start + execution + KV read |
| SSR (Vercel Edge) | P50 < 50ms, P99 < 150ms | TTFB for cached pages |
| Database Read (Replica) | P50 < 15ms, P99 < 50ms | Query execution time |
| Database Write (Primary) | P50 < 25ms, P99 < 100ms | Round-trip to primary region |
| Video Segment Delivery | P50 < 30ms, P99 < 100ms | CDN cache hit time |
| WebSocket Message | P50 < 10ms, P99 < 50ms | Durable Object broadcast |
| WebRTC Signaling | < 500ms total | Offer -> answer exchange |
| Global TTFB (Time to First Byte) | P50 < 50ms worldwide | Full page load from cold |

#### 8.2 Monitoring Stack

**Cloudflare Observatory** (built-in):
- Workers Logs (3-day retention, real-time tail)
- Tail Workers (real-time log streaming to external endpoints)
- Analytics Engine (ClickHouse-based, for custom metrics)
- Web Analytics (RUM - Real User Monitoring)

**Vercel Monitoring**:
- Real User Analytics (Web Vitals, CLS, LCP, FID)
- Speed Insights (per-route performance)
- Function Logs and invocation metrics

**Supabase Monitoring**:
- Dashboard: replication lag, connection pool status, slow queries
- pg_stat_statements for query optimization
- PITR (Point-in-Time Recovery) for backups

**Custom Metrics to Track**:
- `edge_latency_p50`, `edge_latency_p99` by region
- `db_replica_lag_ms` per replica
- `kv_cache_hit_rate` by namespace
- `websocket_connections_active` per Durable Object class
- `video_buffer_ratio` (rebuffering events / total plays)
- `tenant_routing_errors` (failed KV lookups or DB connections)

#### 8.3 Alerting Thresholds

| Alert | Condition | Severity |
|-------|-----------|----------|
| Edge latency degradation | P99 > 100ms for 5 min | Critical |
| DB replica lag | > 5 seconds for 2 min | Warning |
| KV cache hit rate | < 80% for 10 min | Warning |
| WebSocket connection drops | > 10% in 1 min | Critical |
| R2 error rate | > 1% for 5 min | Critical |
| Supabase connection pool | > 80% utilization | Warning |
| Durable Object overload | "Too many requests" errors | Critical |

---

### 9. Deployment Strategy & Migration Roadmap

#### 9.1 Phase 1: Edge API Layer (Weeks 1-4)
- Deploy Cloudflare Workers for auth, tenant routing, and feature flags.
- Migrate static assets to R2 with custom domain.
- Implement KV caching for hot reads.
- Keep Vercel + Supabase primary unchanged.

#### 9.2 Phase 2: Read Replicas (Weeks 5-8)
- Deploy Supabase read replicas in EU and APAC.
- Update Worker routing logic to direct reads to nearest replica.
- Implement read-your-writes consistency logic.
- Monitor replication lag and query performance.

#### 9.3 Phase 3: Real-Time Features (Weeks 9-12)
- Implement Durable Objects for course chat rooms.
- Add WebSocket presence tracking.
- Deploy WebRTC signaling for live video classes.
- Migrate Supabase Realtime subscriptions for dashboard updates.

#### 9.4 Phase 4: Data Residency (Weeks 13-16)
- Deploy EU-isolated stack (Supabase EU primary, R2 EU bucket, EU-pinned Durable Objects).
- Implement edge routing by jurisdiction.
- Add compliance audit logging.
- Test GDPR data deletion workflows.

#### 9.5 Phase 5: Optimization (Weeks 17-20)
- Fine-tune KV cache TTLs by data type.
- Implement A/B testing at edge.
- Add advanced analytics (Baselime-style observability on Workers Analytics Engine).
- Load testing and cost benchmarking.

---

### 10. Risk Assessment & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Cloudflare Workers 128MB limit | Cannot process large video uploads | Route large uploads to Vercel (Fluid Compute, up to 4GB) or direct-to-R2 with presigned URLs |
| KV eventual consistency | Stale feature flags or session data | Use short TTLs (60s) for session; use Durable Objects for strong consistency when needed |
| Durable Object overload | Single object receives too many requests | Shard by room/user; implement retry with jitter; use rate limits |
| Supabase replica failover | Enterprise-only auto-promotion | Manual failover procedures; consider CockroachDB/Yugabyte if multi-region writes needed |
| Vercel vendor lock-in | Hard to migrate Next.js SSR off Vercel | Keep business logic in Workers/Supabase; Vercel is thin presentation layer |
| WebSocket hibernation state loss | Constructor re-runs on wake | Persist all state to SQLite before idle; reconstruct from storage on wake |
| Compliance audit | Data residency violations | Automated region tagging; quarterly data flow audits; legal review of SCCs |

---

### Citations

[^1]: Cloudflare Workers vs AWS Lambda vs Vercel Edge Functions - 2025 Serverless Comparison, compare.crashbytes.com, Dec 2025.
[^2]: Lambda@Edge vs Cloudflare Workers vs Vercel Edge: Latency, Limits, and Cost in 2025, prabhatgiri.com, Sep 2025.
[^3]: What Are Cloudflare Workers? Edge Serverless (2026), techjacksolutions.com, Jun 2026.
[^4]: The Edge Computing Opportunity: It's Not What You Think, blog.cloudflare.com, Jul 2020.
[^5]: Introducing Fluid compute: The power of servers, in serverless form, vercel.com/blog, Feb 2025.
[^6]: Vercel Fluid Compute vs Serverless: What Changes in 2025?, merginit.com, Jun 2025.
[^7]: Cloud Computing Trends 2025: Edge & Serverless Explained, prismberry.com, May 2025.
[^8]: Authentication Trends in 2026: Passkeys, AI Agents, and Edge Auth, clerk.com, Jun 2026.
[^9]: How Content Delivery Networks Enhance LMS Performance and Learner Experience, eleapsoftware.com, Aug 2025.
[^10]: Global Education Live Streaming: CDN & Delivery Guide, dacast.com, May 2026.
[^11]: Cloudflare R2 Object Storage, Zero Cost Egress Traffic, lowendtalk.com, Sep 2021.
[^12]: Delivering 15TB of 4K video with Cloudflare R2 for $2.18, screencasting.com, Nov 2024.
[^13]: Can we serve video with r2? - Storage, community.cloudflare.com, Aug 2022.
[^14]: Read Replicas | Supabase Docs, supabase.com/docs, Jun 2026.
[^15]: Introducing Read Replicas, supabase.com/blog, Dec 2023.
[^16]: 10 Best Managed Postgres Providers Compared (2026), dreamlit.ai, Apr 2026.
[^17]: Cloudflare Workers KV in Practice: A Complete Guide, eastondev.com, Apr 2026.
[^18]: KV deep-dive: global cache, eventual consistency, KV vs D1, cloudsecop.net, Sep 2025.
[^19]: Serverless 2025: Advanced Patterns, Edge, and Observability, blog.madrigan.com, Oct 2025.
[^20]: WebSockets in Cloudflare & AWS, pikku.dev/blog, Nov 2025.
[^21]: Cloudflare Durable Objects | Build stateful apps, cloudflare.com.
[^22]: Live Collaborative Editing in Astro with Cloudflare Durable Objects, launchfa.st, Dec 2025.
[^23]: Pricing - Cloudflare Durable Objects docs, developers.cloudflare.com, Apr 2026.
[^24]: cloudflare-durable-objects | Skills Marketplace, lobehub.com, May 2026.
[^25]: Supabase Realtime documentation, supabase.com.
[^26]: P2PCF - Low cost, low effort P2P WebRTC serverless signalling, github.com/gfodor/p2pcf, Jul 2022.
[^27]: Show HN: P2PCF - Low cost, low effort WebRTC signalling using Cloudflare workers, news.ycombinator.com, Jul 2022.
[^28]: How WebRTC works: What is WebRTC used for?, cloudflare.com/learning.
[^29]: What is Data Residency?, peakhour.io.
[^30]: GDPR-Compliant AI Support With EU Data Residency, alhena.ai, Aug 2024.
[^31]: Durable Objects support for Oceania region, developers.cloudflare.com.
[^32]: Overview - Cloudflare R2 docs, developers.cloudflare.com, Apr 2026.
[^33]: Moving Baselime from AWS to Cloudflare, blog.cloudflare.com, Oct 2024.
[^34]: Cloud and AI Infrastructure Cost Optimization: A Comprehensive Review, arxiv.org, Jan 2026.
[^35]: Edge Computing: Transforming Modern Data Centres in 2026, asiatechxsg.com, May 2026.
[^36]: Edge Computing Market Size, Trends, Industry Analysis, marketresearchfuture.com, Mar 2024.
[^37]: Supabase vs Vercel (2026): Backend vs Frontend Platform, 13labs.au, Apr 2026.
[^38]: Cloudflare vs Vercel vs Supabase: Developer Platform Comparison, codepick.dev, Mar 2026.
[^39]: Cloudflare WebSockets: CDN, Workers & Durable Objects, websocket.org, Mar 2026.
[^40]: Building Real-Time Chat in Astro with Cloudflare Durable Objects, launchfa.st, Dec 2025.
[^41]: Patterns for authentication at the edge, fastly.com/blog, Dec 2024.
[^42]: Vercel vs Cloudflare: 2025 comparison, covia.io, Apr 2025.
[^43]: Cloudflare Workers KV in Practice, oneuptime.com, Jan 2026.
[^44]: Global Education Live Streaming: CDN & Delivery Guide, dacast.com, May 2026.
[^45]: How to handle WebRTC signaling at edge, github.com/gfodor/p2pcf + community discussions.
