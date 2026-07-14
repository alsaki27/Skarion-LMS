# Phase 3 — Moat & Ecosystem (Weeks 25–40)

**Prerequisites:** `PHASE_2_DIFFERENTIATION_GROWTH.md` complete and its Chunk 30 smoke test passing in production.

**Goal:** API/webhooks, plugin foundation, white-label, live sessions, SSO, and the infra deliberately deferred from Phase 1 (multi-region, self-hosted AI cost optimization) — the features that unlock School/Campus tier revenue.

---

1. **Public REST API v1** — `/v1/courses`, `/v1/users`, `/v1/enrollments` with API key auth, cursor pagination, rate limiting. Done when: an external script can list/create courses using only an API key.
2. **OpenAPI spec + docs site** — Auto-generated from route definitions, published developer portal page. Done when: the spec validates and renders in Swagger UI.
3. **Webhook infrastructure** — Event table + delivery worker (Cloudflare Queues now justified — async fan-out at scale), HMAC signing, retry with backoff, dead-letter table. Done when: a test webhook endpoint receives a signed, retried-on-failure `enrollment.created` event.
4. **Webhook management UI** — Tenant admin can register endpoints, pick event types, view delivery logs. Done when: an admin can configure and see delivery success/failure history.
5. **OAuth2 app framework** — App registration, client credentials, scoped permissions (`courses:read`, `users:read:pii`, etc.). Done when: a registered app can obtain a token limited to its granted scopes.
6. **Sandboxed iframe app SDK** — `postMessage`-based JS SDK for external apps to embed and call the API within tenant context. Done when: a minimal example app (e.g. a "hello world" widget) embeds and reads course data.
7. **White-label: custom domain** — CNAME verification + automatic SSL, tenant resolution updated to handle custom domains alongside subdomains. Done when: a test custom domain serves the correct tenant.
8. **White-label: branding** — Logo/colors/fonts stored in `tenant.settings`, applied via CSS variables at runtime, no code forks. Done when: two tenants visually differ using only settings data.
9. **White-label: custom email sending** — SPF/DKIM setup docs + per-tenant "from" address for transactional email. Done when: a tenant's emails arrive from their own domain.
10. **SSO: SAML 2.0** — Support Okta/Azure AD as IdP via a SAML library, mapped to `tenant_users` provisioning. Done when: a test IdP (e.g. a free Okta dev org) can log a user into a tenant.
11. **SCIM provisioning** — Auto create/update/deactivate users pushed from an IdP. Done when: a SCIM test client can provision/deprovision a user and it reflects in `tenant_users`.
12. **SCORM/cmi5 export** — Package a Learnworld course back out as SCORM/cmi5 for legacy system compatibility. Done when: an exported package validates against a SCORM conformance checker.
13. **xAPI / LRS endpoint** — Public statement API for external xAPI-emitting tools, stored per tenant. Done when: a sample xAPI statement POSTed externally is stored and queryable.
14. **Live session infra (LiveKit or mediasoup)** — Provision SFU, basic 1:many video room tied to a course. Done when: an instructor can host a live session and students can join and see/hear them.
15. **Live session: breakout rooms** — Dynamic sub-room creation/assignment within a session. Done when: an instructor can split a session into groups and rejoin the main room.
16. **Live session: recording** — Auto-record and store to R2, auto-generate a lesson entry pointing to the recording. Done when: a recorded session is playable as a normal video lesson afterward.
17. **Collaborative whiteboard** — Canvas + CRDT sync (Yjs) for live sessions. Done when: two participants see each other's drawings in real time.
18. **Real-time collaborative course editing (Yjs + Tiptap)** — Multiple instructors editing a lesson's rich-text content simultaneously with live cursors. Done when: two admin sessions editing the same lesson merge without data loss.
19. **Draft/preview/publish branching for content** — `main`/`draft`/`preview` states, publish flow. Done when: editing a published lesson doesn't affect the live version until published.
20. **Manager auto-enrollment rules** — "If role = X, enroll in Y" rule engine for enterprise tenants. Done when: creating a matching user auto-triggers enrollment per a configured rule.
21. **Skills matrix** — Role-to-skill mapping with gap visualization at the org level (aggregate of Student Knowledge Model data). Done when: an org admin sees a correct skill-coverage heatmap across their team.
22. **Certificate expiry & recertification** — Expiry dates, renewal workflow, automated reminder emails. Done when: an expiring certificate triggers the reminder flow on schedule.
23. **WCAG 2.1 AA accessibility pass** — Audit and fix core flows (course player, quiz, checkout) with axe-core in CI. Done when: axe-core reports zero critical violations on the audited pages.
24. **GDPR compliance tooling** — Data export (per-user JSON dump), right-to-erasure flow (with audit log retention per policy), cookie consent. Done when: a test user can request and receive a full data export and an erasure request correctly anonymizes/deletes per policy.
25. **Audit log implementation** — Append-only, hash-linked `audit_logs` table, applied to admin actions. Done when: tampering with a historical row breaks the hash chain verification check.
26. **Multi-region read replica (first non-US region, only if a real tenant needs it)** — Add one Neon read replica, route tenant reads by `region` field. Done when: a tenant pinned to the new region measurably reads from the replica (verify via query tracing, not just config).
27. **Self-hosted inference cost optimization (only if OpenRouter spend justifies it)** — Stand up Ollama for the highest-volume, lowest-complexity AI task (e.g. simple grading) behind the same `AIProvider` interface used since Phase 1. Done when: that task routes to local inference with automatic fallback to OpenRouter on failure.
28. **Partner/developer program scaffolding** — Revenue-share tracking table, app listing/review flow (even if manually curated at first). Done when: an app can be submitted, approved, and appear in a basic marketplace listing page.
29. **Load/perf testing** — k6 or similar against course player, quiz submission, and AI endpoints at a target concurrency. Done when: p99 latency targets are met or a documented bottleneck + remediation plan exists.
30. **Phase 3 deploy + SOC2-readiness checklist** — Deploy, run the security/audit checklist (cross-tenant leakage tests, access review), document gaps against SOC2 Type I control list even if not pursuing certification yet. Done when: checklist is complete and any failing item has a tracked fix.
