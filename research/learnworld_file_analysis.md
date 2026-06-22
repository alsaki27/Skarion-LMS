# Learnworld Architecture — File Intake & Analysis

## File Inventory

| File | Type | Size | Summary |
|------|------|------|---------|
| Skarion_Platform_Architecture.docx | Architecture Blueprint | ~54KB | Complete technical architecture for building a LearnWorlds-like LMS platform using Next.js + Supabase. Covers 9 modules, database schema, API structure, build phases, and tech stack decisions. |
| Skarion_OSP_Course_Architecture_Addendum.docx | Course Addendum | ~28KB | Detailed course structure for OSP Engineering V2, content patterns, storage architecture, SCORM handling, course player specification, and migration plan. |

---

## Per-File Extraction

### File 1: Skarion Platform Architecture Blueprint

**Core Themes:**
- **Platform-as-LMS-Replacement**: Build a custom LMS to replace LearnWorlds, eliminate per-seat fees, and own all data.
- **Tech Stack**: Next.js 14+ (App Router), Supabase (PostgreSQL + Auth + Storage + Realtime), Bunny.net CDN, Resend/SendGrid, Stripe.
- **9-Module Architecture**: Dashboard & Analytics → Courses & Programs → Website/Public Pages → Users & Candidates → Communication & Community → E-Commerce & Payments → Marketing & Affiliates → Reports & Insights → Settings & Integrations.
- **Phased Build**: MVP Core (6 weeks) → Communication & Reporting (4 weeks) → Job Tracking & Automations (4 weeks) → AI Layer & Advanced Features (6 weeks).
- **AI Integration**: Ollama/Qwen local model for interview assist, AI course insights, resume builder AI. Self-hosted for zero per-token cost.
- **Skarion-Specific Additions**: Job application tracker, interview scheduler, Apify scraper sync, placement records, Falood AI, resume builder, autofill Chrome extension, ClickUp integration, Discord job postings.

**Key Claims:**
- Current solution (LearnWorlds) has per-seat/per-student fees; custom platform = full cost control.
- Next.js + Supabase is already in use at Skarion; build leverages existing expertise.
- Bunny.net is cheapest for video (~$0.01/GB storage + bandwidth).
- Supabase Realtime handles chat, notifications, online presence.
- SCORM packages are the most complex content type; requires iframe + API bridge.

**Limitations Noted:**
- AI uses local Ollama/Qwen — limited compared to cloud LLMs but zero cost.
- Mobile app is "future" phase (React Native or PWA).
- Build roadmap is 20 weeks total — fast but may sacrifice polish.
- Single-tenant architecture (one school per deployment) — not designed for multi-tenant SaaS.

### File 2: OSP Course Architecture Addendum

**Core Themes:**
- **Course Content Patterns**: Theory modules (video + PDF + SCORM + quiz) and Project modules (PDF brief + video walkthrough + quiz + assignment).
- **Storage Architecture**: Supabase Storage buckets for covers, videos, PDFs, SCORM, submissions, certificates, avatars, resumes.
- **Video Strategy**: Bunny.net Stream CDN for adaptive streaming; 45 videos ~4.5GB total.
- **SCORM Handling**: Extract ZIP, parse imsmanifest.xml, iframe embed with SCORM API shim (scorm-again/pipwerks), postMessage bridge to Next.js.
- **Course Player Spec**: Classic skin with left sidebar, video/PDF/SCORM/quiz/assignment players, discussion tab, notes panel, progress tracking.
- **Migration Plan**: Parallel platforms → migrate candidates → 30-day fallback.

**Key Claims:**
- SCORM 2004 used in OSP course (confirmed by filenames).
- AutoCAD .dwg files up to 50MB per submission.
- PDF completion tracked by scroll-to-last-page or visit.
- Video resume-from-last-position stored in lesson_progress.

**Limitations Noted:**
- Quiz migration may require manual re-entry or AI parsing (~210+ questions).
- SCORM error handling requires logging table for debugging.
- No automated SCORM content authoring tool mentioned.

---

## Cross-File Mapping

**Overlaps:**
- Both files discuss the same tech stack (Next.js + Supabase + Bunny.net).
- Both files detail course player requirements and content types.
- Database schema in both files is consistent (UUIDs, RLS, TIMESTAMPTZ).

**Complementarities:**
- File 1 provides the high-level platform architecture; File 2 provides the deep course-level implementation details.
- File 1 covers admin/website/e-commerce; File 2 covers learner-facing content delivery.
- File 2 adds migration strategy that File 1 doesn't cover.

**Contradictions:**
- None detected. The addendum is explicitly designed to be read alongside the main blueprint.

---

## Gap Analysis

**Critical gaps that external research must fill:**

1. **Competitor Architecture Analysis**: What are the actual tech stacks, scalability limits, and architectural weaknesses of LearnWorlds, Thinkific, Kajabi, Teachable, and emerging platforms? The files describe LearnWorlds' *features* but not its *architecture*.

2. **Multi-Tenant SaaS Design**: The current architecture is single-tenant (one school per deployment). To make Learnworld affordable for *people* (i.e., a SaaS platform serving many schools/creators), a multi-tenant architecture is essential. The files do not address this.

3. **Futuristic Technology Trends**: What emerging technologies (AI-native, edge computing, WebAssembly, real-time collaboration, micro-frontends, serverless, etc.) could give Learnworld a 10-year advantage? The files only mention basic AI (Ollama/Qwen) and standard web tech.

4. **Affordability at Scale**: How can the infrastructure cost be kept low enough to offer affordable pricing while maintaining quality? The files mention cost-saving choices (Bunny.net, local AI) but don't model a multi-tenant cost structure.

5. **10-Year Durability**: What architecture patterns ensure the platform remains dominant and maintainable for 10 years? The files focus on a 20-week build, not long-term evolution.

6. **Security & Compliance**: GDPR, SOC2, data residency, encryption-at-rest — mentioned briefly but not architecturally designed.

7. **Performance at Scale**: The files mention 93 users currently. What happens at 10,000? 1,000,000? No scaling strategy is defined.

8. **API & Extensibility**: How does the platform become an ecosystem? API design, webhooks, plugin architecture, marketplace — not covered.

9. **Mobile-First / PWA**: Mobile is listed as "future phase." What is the modern standard for mobile learning?

10. **AI-Native Learning**: The files mention AI as bolt-on features (interview assist, resume builder). What does an *AI-native* LMS look like where AI is foundational, not additive?

---

## Consolidated Theme List

These themes will feed into dimension decomposition for the architecture planning research:

1. **Competitor Architecture Deep Dive** — Tech stacks, scalability, limits of LearnWorlds, Thinkific, Kajabi, Teachable, Circle, Mighty Networks, Esmerise, emerging platforms.
2. **Multi-Tenant SaaS Architecture** — Row-level tenant isolation, shared infrastructure, tenant-aware routing, cost per tenant.
3. **Futuristic Web Technologies** — Edge computing, micro-frontends, WebAssembly, serverless, CQRS, event sourcing, real-time sync engines.
4. **AI-Native Platform Design** — LLM-first architecture, RAG for course content, AI-generated courses, adaptive learning, intelligent tutoring systems.
5. **Affordable Infrastructure at Scale** — Serverless databases, CDN strategies, video encoding optimization, compute cost reduction, open-source alternatives.
6. **10-Year Evolution Strategy** — Plugin architecture, API-first design, backward compatibility, migration patterns, technology drift management.
7. **Security, Compliance, Data Residency** — SOC2, GDPR, encryption, tenant isolation, audit trails.
8. **Performance & Scalability** — Database sharding, read replicas, caching strategies, CDN, edge rendering, concurrent user limits.
9. **Mobile & Cross-Platform** — PWA vs native, offline-first, mobile-optimized video, cross-platform sync.
10. **Ecosystem & Extensibility** — Plugin marketplace, webhook architecture, API versioning, third-party integrations, developer experience.
11. **Content & Media Architecture** — Next-gen video (WebRTC, HLS, AV1), interactive content (H5P, xAPI), SCORM/xAPI evolution, collaborative editing.
12. **Community & Social Learning** — Real-time collaboration, peer learning, social graphs, gamification engines, community-driven content.
