# Phase 2 — Differentiation & Growth (Weeks 13–24)

**Prerequisites:** `PHASE_1_MVP_FOUNDATION.md` complete and its Chunk 30 smoke test passing in production.

**Goal:** Community, gamification, adaptive learning basics, assignments/grading, and content import — the features that make Learnworld feel alive and justify Starter/Pro pricing.

**New infra this phase:** Cloudflare Queues (or a simple job queue table + cron) for async work, and Supabase Realtime for chat/presence (cheaper to start than Durable Objects — only move to Durable Objects if Realtime's connection limits become a real bottleneck).

---

1. **Assignment lesson type (schema + admin)** — File-upload assignment with instructions, accepted file types, rubric fields. Done when: an admin can create an assignment matching the HLD/LLD project structure from the real course.
2. **Assignment submission (student)** — Upload to R2, submission record, status (submitted/graded). Done when: a student can submit a file and see submission history.
3. **Rubric-based grading UI (instructor)** — Score against rubric criteria, leave feedback, publish grade. Done when: a grade + feedback is visible to the student after publish.
4. **AI-assisted grading suggestion** — For short-answer/essay quiz questions, call OpenRouter with the rubric to suggest a score + feedback; instructor approves/edits before it's published (human-in-loop, never auto-publish). Done when: AI suggestion appears in the grading UI and is never auto-published without approval.
5. **Semantic fill-in-blank grading** — Replace Phase 1's exact-match with embedding similarity threshold, matching real quiz needs (e.g. "fusion splicing" vs "splicing"). Done when: a test suite of near-miss answers grades correctly.
6. **Discussion/community schema** — Course-scoped discussion threads, replies, tenant-scoped. Done when: CRUD works and RLS isolates tenants.
7. **Discussion UI** — Threaded view on course/lesson pages, @mentions stored (notification wiring comes in chunk 9). Done when: students can post and reply within a course.
8. **Real-time presence + chat (Supabase Realtime)** — Live "who's online" + a course-wide chat channel. Done when: two browser sessions see each other's messages/presence live.
9. **Notifications system** — In-app notification bell + email digest (via Resend or similar) for @mentions, grading, enrollment. Done when: triggering each event type produces a notification.
10. **Streaks & daily goals** — Daily activity tracking, streak counter with a grace/freeze mechanism. Done when: streak increments/resets correctly across simulated day boundaries in tests.
11. **XP & levels** — XP awarded per activity type (lesson complete, quiz pass, assignment submit), level thresholds, badge on profile. Done when: XP totals reconcile with activity log.
12. **Visual skill tree** — Render course/module prerequisite graph with locked/unlocked/mastered states from `lesson_progress` + course structure. Done when: tree correctly reflects real prerequisite chains from the OSP course modules.
13. **Study groups** — Self-formable groups scoped to a course, shared discussion space. Done when: a student can create/join a group and post to its private thread.
14. **Certificates** — Template (HTML→PDF), auto-issue on course completion, verification page with a public URL + hash. Done when: completing a course generates a downloadable, independently-verifiable certificate.
15. **Student Knowledge Model v1** — Implement Bayesian Knowledge Tracing (BKT) only (skip deep-sequence modeling/embeddings — over-engineered for current data volume), updated on every quiz/lesson interaction. Done when: mastery probability per skill updates correctly against a known BKT test vector.
16. **Adaptive path v1** — Use BKT mastery to recommend "next lesson" (rule-based: lowest-mastery prerequisite-satisfied skill first — skip a trained RL policy until there's usage data to train on). Done when: recommendation changes appropriately as a test student's mastery changes.
17. **At-risk / dropout flagging** — Rule-based (not ML yet) flags: N days inactive, quiz score cliff. Done when: seeded inactive/struggling test users are correctly flagged on the instructor dashboard.
18. **Instructor intervention actions** — From an at-risk flag, one-click "send encouragement email" / "schedule 1:1" action. Done when: triggering the action sends the email and logs the intervention.
19. **AI Quiz Generator** — Admin provides a lesson/PDF; AI generates N draft questions with distractors for review before publishing (never auto-publish). Done when: generated questions for a real OSP module are coherent and instructor can edit before saving.
20. **AI Course Outline Generator** — Prompt → module/lesson skeleton (titles + objectives only, no content) for instructor to flesh out. Done when: a generated outline for a plausible new course topic is structurally sound.
21. **Content import: Markdown** — Import a folder of `.md` files (like the `skarion-osp-course` repo format) directly into course/lesson structure. Done when: Phase 1's one-off OSP import could be done via this generic importer instead.
22. **Content import: SCORM 1.2/2004** — Parse SCORM package manifest, embed as an iframe'd lesson type. Done when: a sample SCORM package (e.g. one of the OSP course's ~15 labs) plays correctly.
23. **Subscription management UI** — Student-facing plan/billing page: upgrade, downgrade, cancel, view invoices (Stripe Customer Portal integration). Done when: a test user can self-serve cancel and see it reflected in `enrollments`/plan state.
24. **Dunning / failed payment recovery** — Stripe webhook-driven email sequence on `invoice.payment_failed`, grace period before access is revoked. Done when: a simulated failed payment triggers the email and access isn't cut immediately.
25. **Order bumps + coupons** — Discount codes at checkout, one simple order-bump offer (e.g. "add certificate prep pack"). Done when: a coupon code correctly reduces the Stripe Checkout price.
26. **Manager/instructor dashboard v2** — Cohort view: all students, completion %, at-risk flags, grading queue, in one place. Done when: an instructor can triage their whole course from this single view.
27. **Offline content sync (PWA v2)** — IndexedDB caching of lesson metadata + downloaded PDFs for offline viewing (defer video offline to Phase 3 — storage complexity isn't worth it yet). Done when: a lesson viewed once is readable with network disabled.
28. **Background sync queue** — Actions taken offline (quiz answers, progress marks) queue and flush on reconnect. Done when: completing a quiz offline and reconnecting correctly submits it.
29. **Full RLS + integration test sweep** — Expand Phase 1's cross-tenant test suite to cover every table/route added in Phase 2. Done when: suite passes and covers 100% of new tenant-scoped tables.
30. **Phase 2 deploy + regression pass** — Deploy, re-run the Phase 1 smoke test plus a Phase 2 smoke test (community post, assignment submit+grade, certificate issue, offline lesson view). Done when: both smoke tests pass in production.
