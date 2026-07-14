# Phase 1 — MVP Foundation (Weeks 1–12)

**Prerequisites:** None — this is the starting point. Hand this file to GLM first, Chunk 1.

**Goal:** A working, single-tenant-capable-but-multi-tenant-designed LMS that can host the real OSP course, take real enrollments and payments, and answer student questions with AI grounded in the actual course content.

**Stack for this phase only:** Next.js (App Router) + TypeScript + Tailwind + shadcn/ui, Neon Postgres (with pgvector), Supabase Auth, Cloudflare R2 (video/PDF storage), Stripe, OpenRouter. Nothing else — no Durable Objects, no Typesense, no Bunny Stream, no self-hosted AI. See stack sizing note at the bottom.

---

1. **Repo scaffold** — Next.js 16 + TypeScript + Tailwind + shadcn/ui project, ESLint/Prettier, GitHub Actions CI running lint+typecheck on PR. Done when: CI is green on an empty commit.
2. **Neon project + connection** — Provision Neon DB, wire `DATABASE_URL`, add a Postgres client (Drizzle or Prisma — pick one and commit to it). Done when: a health-check route queries `SELECT 1` successfully.
3. **Migration tooling** — Set up the ORM's migration system with a `tenants` table (per architecture blueprint Appendix C schema). Done when: `migrate up`/`down` both work locally and in CI.
4. **Core schema migration 1** — Add `tenant_users`, `courses`, `lessons` tables with RLS policies. Done when: RLS blocks a cross-tenant `SELECT` in a test.
5. **Core schema migration 2** — Add `lesson_progress`, `enrollments`, `quizzes`, `quiz_questions`, `quiz_attempts` tables. Done when: schema diagram matches and migrations apply cleanly.
6. **Supabase Auth wiring** — Email/password + magic link signup/login, JWT includes `tenant_id` claim. Done when: a user can sign up, log in, and a protected route rejects unauthenticated requests.
7. **Tenant provisioning flow** — `POST /api/tenants` creates a tenant row + first admin user + default settings. Done when: a new tenant can be created via API and its admin can log in.
8. **Subdomain/slug routing (single-region, no edge worker yet)** — Next.js middleware resolves `tenant.yourdomain.com` or `/t/[slug]` to a tenant context. Done when: two tenants created locally resolve to isolated data via the same codebase.
9. **RBAC middleware** — Enforce a 5-tier role model (owner/admin/instructor/TA/student) on API routes. Done when: a student hitting an instructor-only route gets 403.
10. **Admin: Course CRUD UI** — Create/edit/list/delete courses (title, slug, description, status). Done when: an admin can create a course through the UI and see it persisted.
11. **Admin: Module/Lesson CRUD UI** — Nested lesson list under a course, drag-to-reorder (position field), lesson types: video, pdf, text, quiz. Done when: lessons can be created, reordered, and typed.
12. **R2 bucket + signed upload** — Cloudflare R2 bucket provisioned, presigned upload URLs for PDFs/video files scoped to `tenant_id/...` paths. Done when: a file uploaded from the admin UI lands in R2 under the correct tenant path and is retrievable via signed URL.
13. **PDF lesson type** — Upload + render PDF lessons in the player (use a PDF.js viewer). Done when: a student can view an uploaded PDF inline.
14. **Video lesson type** — Upload + basic HTML5 video playback from R2 (no HLS/transcoding yet — raw MP4 via signed URL is fine for MVP). Done when: a student can play an uploaded video.
15. **Text/rich-content lesson type** — Store as a JSON `blocks[]` structure (start with just `text` and `video` block types — schema should support future block types without migration). Done when: a rich-text lesson renders correctly.
16. **Quiz builder (admin)** — Create quiz, add multiple-choice/true-false/fill-in-blank questions with correct answers. Done when: an admin can build a quiz matching the question types actually used in the real OSP course quiz bank.
17. **Quiz player (student)** — Take a quiz, submit, get scored, see pass/fail. Fill-in-blank uses simple normalized string match (not semantic yet). Done when: a student can complete a quiz end to end and see a stored `quiz_attempts` row.
18. **Course player shell + progress tracking** — Sidebar of modules/lessons with completion checkmarks, "mark complete" on view, `lesson_progress` updated. Done when: progress persists across sessions and shows % complete per course.
19. **OSP course data import script** — One-off script that reads the `skarion-osp-course` repo (from `KIMI_INSTRUCTIONS_OSP_Course_Audit.md` scrape) and seeds it into tenant #1 via the schema from chunks 4–5. Done when: all 23 modules of the real course exist and are navigable in the player.
20. **Stripe integration — products & checkout** — Map plan tiers (Free/Starter/Pro at minimum for MVP) to Stripe Products, Stripe Checkout session for course/plan purchase. Done when: a test-mode purchase completes and creates an `enrollments` row via webhook.
21. **Stripe webhook handler** — Handle `checkout.session.completed`, `invoice.payment_failed`, `customer.subscription.deleted` — update tenant plan / enrollment state. Done when: webhook events (tested via Stripe CLI) correctly mutate DB state.
22. **Resource caps enforcement** — Enforce student count and course count caps per plan tier at the API layer. Done when: exceeding a Free-tier cap returns a clear upgrade-prompt error, not a silent failure.
23. **RAG ingestion pipeline** — Chunk course content (PDF text + lesson text) into embeddings using `pgvector` on Neon, store per-tenant, per-course. Done when: a course's content is embedded and queryable via cosine similarity in a test script.
24. **AI Q&A endpoint (RAG, OpenRouter only)** — `POST /api/ai/ask` retrieves top-K chunks via pgvector, calls OpenRouter, returns an answer with source lesson citation. Done when: asking a question about real OSP content returns a grounded answer citing the correct module.
25. **AI Tutor chat UI** — Simple chat panel on the lesson page wired to chunk 24's endpoint, shows source citations as links. Done when: a student can ask a question while viewing a lesson and get a cited answer.
26. **Basic admin analytics** — Enrollment count, completion rate, per-lesson time-spent, on one dashboard page. Done when: numbers reconcile against seeded test data.
27. **PWA baseline** — `manifest.json`, service worker registration, "add to home screen" prompt, offline fallback page (not full offline content sync yet — that's Phase 2). Done when: Lighthouse PWA audit passes installability checks.
28. **Error handling & observability baseline** — Structured logging, Sentry (or equivalent) wired for both client and API routes, a `/health` endpoint. Done when: a thrown error in an API route shows up in the error tracker with tenant context.
29. **Security pass** — Rate limiting on auth/AI endpoints, input validation (zod) on all mutating routes, verify RLS is actually enforced (not just app-layer checks) via a cross-tenant integration test suite. Done when: the cross-tenant test suite (write it as part of this chunk) passes and API fuzzing on auth endpoints doesn't leak data.
30. **Phase 1 deploy** — Deploy to production (Cloudflare Pages/Workers or Vercel — pick one), Neon production branch, R2 production bucket, Stripe live keys behind a feature flag, smoke test the full flow (signup → enroll → pay → view lesson → ask AI tutor) against production. Done when: that flow works end-to-end on the live URL with a real (or Stripe test-mode) payment.

---

## Stack sizing note (~20 candidates)

At 20 users this entire phase runs comfortably on free tiers:

| Service | Free tier limit | Fits 20 users? |
|---|---|---|
| Neon (Postgres + pgvector) | 0.5 GB storage, ~190 compute-hrs/mo, autosuspend | Yes, by a wide margin |
| Supabase Auth | 50,000 MAU free | Yes |
| Cloudflare R2 | 10 GB storage, 1M Class A ops/mo free | Yes — 20 users' PDFs/videos won't come close |
| Cloudflare Pages/Workers | Generous free request limits | Yes |
| Stripe | No monthly fee, ~2.9%+30¢ per transaction | Yes |
| OpenRouter | Pay-per-token, no minimum | 20 users asking the AI tutor occasionally = a few dollars/month |

Total infra cost at this scale: **$0–5/month**, plus whatever OpenRouter tokens you burn. See the main `GLM_BUILD_PLAN.md` for the full stack discussion (including why SharePoint doesn't belong in this stack).
