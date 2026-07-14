# Learnworld — Architecture Audit & GLM Execution Plan

**Prepared for:** Abdullah Al Saki, CEO — Skarion
**Source docs audited:** `Learnworld_Futuristic_Architecture_Blueprint.md`, `Learnworld_Master_Feature_Analysis.md`, `plan.md`
**Purpose:** Turn a 10-year vision document into a sequence of small, independently-codable chunks a coding agent (GLM) can execute to actual working software.

---

## Part 1 — Audit of the Architecture Plan

### What's strong
- **Tenant isolation model** (shared schema + `tenant_id` + RLS) is the right default — proven pattern, cheap, matches your stated cost goals. Don't second-guess this.
- **Modular monolith first, extract later** is the correct call for a 3–15 engineer team. The blueprint correctly identifies extraction triggers instead of pre-emptively building microservices.
- **JSON-native content model** (`blocks[]` on lessons) is a good foundation for cmi5/xAPI/H5P/AI-generation without being locked to SCORM's rigidity.
- **Cost architecture** (Neon scale-to-zero, R2 zero-egress, Cloudflare Workers) is genuinely cheap and the numbers in section 12/Appendix A are realistic for a serverless stack.

### Gaps and risks — fix before coding starts

1. **The stack has too many moving parts for an MVP built by an AI coding agent.** Neon + Supabase Auth + Supabase Realtime + Cloudflare Workers + Cloudflare R2 + Cloudflare Queues + Durable Objects + Vercel + Bunny Stream + Typesense + Ollama + vLLM + OpenRouter is 12 external services before you've shipped a single course. Every one is a credential to manage, a failure mode to debug, a thing GLM can misconfigure.
   → **Fix:** Collapse the MVP stack (Phase 1) to 5 services: **Next.js + Neon (with Supabase Auth) + Cloudflare R2 + Stripe + OpenRouter**. Defer Durable Objects, Typesense, Bunny Stream, self-hosted Ollama/vLLM, and multi-region replicas to Phase 3+, exactly as the extraction-trigger philosophy in §3.2 of the blueprint already argues for modules — apply the same discipline to *infrastructure*, not just code.

2. **The plan doesn't connect to the asset you already have.** You have a real, fully-built 21-quiz, 23-module Outside Plant Engineering course sitting in LearnWorlds (see `KIMI_INSTRUCTIONS_OSP_Course_Audit.md`) and an existing Skarion internal LMS (Next.js + Supabase, single-tenant, 9 modules per `plan.md`). The blueprint is written as if starting from zero. It shouldn't.
   → **Fix:** Phase 1 treats the OSP course as tenant #1's seed data and treats the existing internal LMS as the migration source, not a footnote.

3. **AI cost/ops complexity is front-loaded.** Self-hosted Ollama + vLLM for "local inference" requires a GPU box, driver management, and model ops — none of which a coding agent can safely provision unattended, and none of which is needed to prove the product.
   → **Fix:** Phase 1 AI = OpenRouter only (cloud, pay-per-token, zero infra). Local inference becomes a Phase 3 cost-optimization, not a Phase 1 dependency.

4. **93-feature priority matrix is a roadmap, not a build plan.** Items like "Agentic AI," "AI Avatar Instructors," and "Emotion-Aware Interface" are stated as outcomes, not engineering tasks — a coding agent can't act on "build agentic AI." They need to be decomposed into schema + endpoint + UI + test chunks, which is what the phase files do.

5. **Phase 4 items (neuroadaptive/EEG, federated learning, VR worlds) are research bets, not roadmap items for a company that hasn't shipped v1 yet.** Keep them in the vision doc; don't let them appear in any chunk list before Phase 4, and treat Phase 4 as "backlog," not a committed sprint.

6. **No CI/testing/environment chunks exist anywhere in the blueprint.** For an AI agent doing unsupervised implementation, "write a test that proves this chunk works" has to be part of every single chunk, or errors compound silently across 120 chunks. Every chunk in every phase file ends with a concrete Done-When check for this reason.

7. **Multi-region edge (EU/APAC replicas, GeoDNS, data residency) is Phase 3+ in the blueprint's own roadmap (§7.6, §11.5) but the tech stack table lists it as Day 1 infra.** Keep it out until you have non-US tenants asking for it — building it early is speculative engineering with no one to validate it against.

### Net recommendation
Ship a real, single-region, 5-service MVP that can enroll a real student in the real OSP course and take real payment — in Phase 1. Add collaboration/gamification/community in Phase 2. Add enterprise/compliance/plugin ecosystem in Phase 3. Keep Phase 4 as backlog. This is the same phase structure the blueprint already proposes (§14) — the chunking just makes each phase actually buildable by an agent instead of a slide.

---

## Part 2 — How to use this with GLM

- Feed GLM **one chunk at a time**, in order, from the phase file below. Each chunk is scoped to be completable in a single focused session (roughly one PR).
- Every chunk has a **Done-When** — a concrete, checkable condition (a test passing, an endpoint returning X, a page rendering Y). Do not let GLM mark a chunk complete without it.
- Commit after every chunk, same discipline as `KIMI_INSTRUCTIONS_OSP_Course_Audit.md` used for the scraping job — small commits, descriptive messages, never batch.
- If GLM gets stuck on a chunk for more than ~2 retries, stop and bring it back to a human rather than letting it improvise architecture.
- Chunks within a phase are ordered by dependency — don't skip ahead. Don't move to the next phase file until the current one's final chunk (deploy + smoke test) passes.

---

## Part 3 — Is this runnable? What stack do you actually need?

**Yes, this is runnable** — the whole point of the Part 1 rewrite was to cut the blueprint's 12-service stack down to something a coding agent can actually stand up and you can actually operate. Phase 1's stack is deliberately minimal: **Next.js + Neon (Postgres, with Supabase Auth) + Cloudflare R2 + Stripe + OpenRouter.**

**On "Cloudflare + SharePoint + free Neon" — for ~20 candidates:**

- **Cloudflare + free Neon**: yes, more than enough. See the sizing table below.
- **SharePoint**: this doesn't belong in the stack, and I'd drop it. SharePoint is a Microsoft document-library/intranet product — it has no role as an app host, database, or auth provider for a custom Next.js SaaS. It can't run your server code, doesn't do row-level tenant isolation, and integrating it would mean building a custom connector for zero benefit. If what you actually want is "where do PDFs/videos live," that's already R2 (Phase 1, chunk 12) — R2 is cheaper, faster, and it's what the whole content-serving pipeline (signed URLs, tenant-scoped paths) is built around. If you meant something else by "SharePoint" (e.g. you already have an M365 tenant and want to reuse existing files), say so and I'll fold that in as a one-time import source instead of a runtime dependency.

**Minimal viable stack for ~20 candidates:**

| Service | Role | Free tier | Fits 20 users? |
|---|---|---|---|
| Next.js app | Frontend + API routes | Hosted free on Cloudflare Pages/Workers *or* Vercel | Yes |
| Neon | Postgres + pgvector (tenants, courses, quizzes, embeddings) | 0.5 GB storage, ~190 compute-hrs/mo, autosuspend | Yes, by a wide margin |
| Supabase Auth | Login/signup, JWT with tenant claim | 50,000 MAU free | Yes |
| Cloudflare R2 | Video/PDF storage | 10 GB storage, 1M Class A ops/mo free | Yes — 20 users' files won't come close |
| Stripe | Payments | No monthly fee, ~2.9%+30¢/transaction | Yes |
| OpenRouter | AI tutor + quiz generation | Pay-per-token, no minimum | A few dollars/month at this volume |

**Total infra cost for 20 candidates: roughly $0–5/month**, plus a small OpenRouter token bill. Nothing in Phase 1 requires a paid tier of anything. You don't need Bunny Stream, Durable Objects, Typesense, or self-hosted AI until you're at hundreds of concurrent tenants (see the deferrals in Part 1, point 1) — those only get added in Phase 3, and only if usage actually justifies the cost per §6.8's break-even math.

---

## Part 4 — Phase files

The 4-phase, 30-chunks-per-phase plan is split into separate files so each can be handed to GLM independently:

| File | Weeks | Outcome |
|---|---|---|
| [`PHASE_1_MVP_FOUNDATION.md`](./PHASE_1_MVP_FOUNDATION.md) | 1–12 | Real course, real payment, real AI tutor, live in production |
| [`PHASE_2_DIFFERENTIATION_GROWTH.md`](./PHASE_2_DIFFERENTIATION_GROWTH.md) | 13–24 | Community, gamification, grading, adaptive paths |
| [`PHASE_3_MOAT_ECOSYSTEM.md`](./PHASE_3_MOAT_ECOSYSTEM.md) | 25–40 | API/webhooks, white-label, SSO, live sessions |
| [`PHASE_4_ENTERPRISE_BACKLOG.md`](./PHASE_4_ENTERPRISE_BACKLOG.md) | 41+ | Unscoped backlog — build only against validated demand |

Hand GLM `PHASE_1_MVP_FOUNDATION.md`, Chunk 1 first. Do not hand over Phase 2+ until Phase 1's chunk 30 smoke test passes in production.
