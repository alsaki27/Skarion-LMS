# LEARNWORLD
## Futuristic Architecture Blueprint
### A 10-Year Dominant SaaS for AI-Native Learning

---

**Version**: 1.0 | **Date**: June 2026
**Classification**: Strategic Architecture
**Prepared for**: Abdullah Al Saki, CEO — Skarion

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [The Competitive Landscape](#2-the-competitive-landscape)
3. [Architecture Philosophy & First Principles](#3-architecture-philosophy--first-principles)
4. [The 10-Year Tech Stack](#4-the-10-year-tech-stack)
5. [Multi-Tenant SaaS Core](#5-multi-tenant-saas-core)
6. [AI-Native Learning Layer](#6-ai-native-learning-layer)
7. [Edge-First Global Infrastructure](#7-edge-first-global-infrastructure)
8. [Next-Gen Content Architecture](#8-next-gen-content-architecture)
9. [Mobile-First & Offline-First](#9-mobile-first--offline-first)
10. [Ecosystem & Extensibility](#10-ecosystem--extensibility)
11. [Security, Compliance & Trust](#11-security-compliance--trust)
12. [Affordable Cost Architecture](#12-affordable-cost-architecture)
13. [10-Year Evolution Roadmap](#13-10-year-evolution-roadmap)
14. [Implementation Phases](#14-implementation-phases)

---

## 1. Executive Summary

### The Opportunity

Every major LMS and course platform in the market today — LearnWorlds, Kajabi, Teachable, Thinkific, Canvas, Moodle — was built between 2010 and 2015 on Ruby on Rails monoliths. They are architecturally trapped. They cannot modernize. They can only bolt new features onto aging foundations. This is why they charge $33–$499/month, have limited AI capabilities, require expensive native mobile apps, and lock users into proprietary ecosystems.

**Learnworld is the opportunity to build what they cannot become.**

### The Vision

Learnworld is a **multi-tenant, AI-native, edge-first, offline-capable LMS SaaS** that serves individual creators, coaches, bootcamps, schools, and enterprises at a fraction of the cost of competitors. It is built on modern serverless infrastructure that makes the marginal cost per tenant near-zero, enabling a genuinely affordable free tier and paid tiers starting at $9/month.

### Key Differentiators

| Dimension | Competitors | Learnworld |
|-----------|------------|------------|
| **Architecture** | Rails monoliths (2012-2015) | Modular monolith → microservices, built 2026+ |
| **Tenancy** | Single-tenant per account | True multi-tenant with RLS isolation |
| **AI** | Bolt-on features, rate-limited | AI-native: adaptive learning, ITS, RAG, auto-generation |
| **Infrastructure** | Centralized servers, high latency | Edge-first, sub-50ms global, data residency compliant |
| **Mobile** | $199+/mo native app add-on | PWA-first, offline-capable, zero extra cost |
| **Content** | SCORM 2004 (frozen since 2009) | cmi5 + xAPI 2.0 + JSON-native, collaborative editing |
| **Extensibility** | Zapier integrations only | Plugin marketplace, API-first, white-label |
| **Pricing** | $33-$499/mo, transaction fees | Free tier → $9/mo, no transaction fees on Pro+ |
| **Cost/Tenant** | $2-5/student/year | $0.15-0.50/tenant/month at scale |

### 10-Year North Star

> **By 2036, Learnworld is the default platform for creating, delivering, and monetizing learning experiences — from a single creator's course to a university's degree program — because it is the only platform that was architecturally designed to evolve.**

---

## 2. The Competitive Landscape

### 2.1 The Rails Monolith Trap

Every incumbent competitor is a Ruby on Rails monolith built in the early 2010s. This was the right choice for rapid prototyping at the time, but it creates an architectural trap:

- **Coordination nightmare**: Adding features requires touching the same codebase, causing regressions and slowing development
- **Scaling ceiling**: Vertical scaling hits limits; horizontal scaling requires expensive infrastructure
- **Technology lock-in**: Cannot easily adopt modern AI, edge computing, or real-time features
- **Mobile app hostage situation**: Native apps require separate codebases, so they charge $149-$199/month as an add-on

**Competitor Architecture Autopsy:**

| Platform | Tech Stack | Core Weakness | Hard Limit |
|----------|-----------|---------------|------------|
| **LearnWorlds** | Rails monolith on GCP | No auto-save (architectural); AI is pay-per-call bolt-on | 99.95% SLA only on $299+/mo tier |
| **Kajabi** | Rails monolith + 80+ tools | Stripe Connect lock-in; 20% automation failure rate | 3 products + 1,000 members on basic plan |
| **Teachable** | Rails (Hotmart-owned since 2020) | Optimized for extraction, not innovation; retroactive limits | Cannot do enterprise SCORM |
| **Thinkific** | Bootstrapped Rails ($65M ARR) | "Paid but never launched" pattern; SCORM only on Plus | App Store model = incomplete core |
| **Canvas** | Ruby + PostgreSQL (open-source) | Complex, expensive, ugly UI | Requires 0.5-1.0 FTE admin |
| **Moodle** | PHP (400M+ users) | Extremely outdated UX; requires heavy customization | High total cost of ownership |

### 2.2 Emerging Threats

- **AI-native platforms**: Sana Labs, CYPHER Learning, 360Learning — built with AI as foundation, not add-on
- **Open-source**: Moodle, Canvas, Open edX — zero lock-in, full ownership, but require technical expertise
- **Price disruptors**: Skool ($99 flat), Systeme.io ($17/mo), EzyCourse — making incumbents look expensive

### 2.3 Strategic Gaps Learnworld Will Exploit

1. **Affordable AI**: Competitors charge for AI tokens or cap usage. Learnworld uses a hybrid local + cloud model.
2. **Offline learning**: No competitor offers true offline course access. Learnworld is PWA-first with offline sync.
3. **True multi-tenancy**: Competitors run one instance per customer. Learnworld shares infrastructure with RLS isolation.
4. **Content evolution**: SCORM is frozen. Learnworld uses cmi5 + xAPI + JSON-native content from day one.
5. **Plugin ecosystem**: No competitor has a true plugin marketplace. Learnworld builds the "Shopify of LMS."
6. **Edge performance**: Competitors serve from central data centers. Learnworld uses edge compute for sub-50ms globally.
7. **Mobile without ransom**: Competitors charge $149+/mo for native apps. Learnworld's PWA is free and native-like.
8. **Collaborative authoring**: No competitor offers real-time collaborative course building. Learnworld uses CRDTs (Yjs).
9. **Data sovereignty**: Competitors have US-only or EU-only data centers. Learnworld routes data by jurisdiction at the edge.
10. **10-year evolution**: Competitors are trapped in monoliths. Learnworld is designed to evolve.

---

## 3. Architecture Philosophy & First Principles

### 3.1 Core Principles

1. **Multi-Tenant by Design**: Every line of code is written for shared infrastructure. Isolation is enforced at the database layer (RLS), not just the application layer.
2. **AI-Native, Not AI-Bolted-On**: AI is the foundational layer. The student knowledge model, adaptive path engine, and content generation are core architecture, not features.
3. **Edge-First**: Compute happens as close to the user as possible. Static content from CDN. Dynamic content from edge functions. Database from regional replicas.
4. **Offline-First**: The app works without internet. Sync happens when connection returns. This is essential for learners in low-connectivity regions.
5. **API-First, Plugin-Ready**: Every feature is accessible via API. The UI is just one client. Third-party developers can build plugins, integrations, and white-label solutions.
6. **Affordable at Scale**: Infrastructure choices must make the marginal cost per tenant near-zero. This enables a free tier and low-cost paid tiers.
7. **10-Year Durability**: The architecture must evolve without rewriting. Start with a modular monolith. Extract microservices only when justified. Maintain backward compatibility.

### 3.2 The Modular Monolith Foundation

> **Start with a modular monolith. Extract microservices only when you have 10,000+ tenants and a clear isolation boundary.**

This is the pattern proven by Shopify ("Majestic Monolith"), Netflix (evolved from monolith), and GitHub. It gives us:
- **3x faster MVP development** than microservices
- **Single deploy** for most features
- **Enforced module boundaries** that make future extraction possible
- **No distributed systems complexity** until we need it

The extraction trigger points are:
- A module needs independent scaling (e.g., AI inference, video processing)
- A module needs a different technology stack (e.g., Rust for real-time, Python for ML)
- A module requires compliance isolation (e.g., enterprise tenant data)
- Team size exceeds 50 engineers and deploy coordination becomes a bottleneck

---

## 4. The 10-Year Tech Stack

### 4.1 Stack Overview

| Layer | Technology | Why This Choice | 10-Year Durability |
|-------|-----------|-----------------|-------------------|
| **Frontend** | Next.js 16 (App Router) + TypeScript + Tailwind CSS + shadcn/ui | Server-side rendering, edge deployment, fastest MVP dev | Vercel is the dominant React framework; App Router is the future |
| **Backend** | Node.js (NestJS for modules) + Supabase Edge Functions | Type-safe, massive ecosystem, runs on Cloudflare Workers | Node.js powers 70% of new SaaS; NestJS enforces modularity |
| **Database** | Neon PostgreSQL (serverless) + read replicas | Scale-to-zero, branching, point-in-time recovery, pgvector | Postgres is the most durable database; Neon is serverless-native |
| **Auth** | Supabase Auth (multi-tenant orgs) | RLS built-in, JWT with tenant claims, OAuth2, MFA | Supabase Auth is open-source; no lock-in |
| **Edge Compute** | Cloudflare Workers + Vercel Edge Functions | Sub-ms cold starts, zero egress, global 330+ PoPs | Cloudflare is the edge leader; Workers are the standard |
| **Storage** | Cloudflare R2 (objects) + Bunny Stream (video) | $0 egress, $0.015/GB storage, AV1-ready | R2 is the S3 killer; Bunny is the video CDN leader |
| **Real-Time** | Durable Objects (WebSocket Hibernation) + Supabase Realtime | 97% cost reduction vs persistent WebSockets, global presence | Durable Objects are the edge real-time standard |
| **Search** | Typesense (open-source) + pgvector (semantic) | Typo-tolerant, faceted search, $0 licensing | Typesense is gaining market share; pgvector is native Postgres |
| **AI** | Ollama (local) + OpenRouter (cloud routing) + vLLM | Self-hosted for free inference; cloud for frontier models | Model-agnostic layer; swap models without changing code |
| **Queue** | Cloudflare Queues (event bus) | At-least-once delivery, global, cheap | Native to Cloudflare ecosystem |
| **Monitoring** | Cloudflare Observatory + Vercel Analytics + Better Stack | Edge-native monitoring, real-user metrics | Integrated with our infrastructure |
| **DevOps** | GitHub Actions + Terraform (Pulumi) + Docker | IaC, CI/CD, reproducible deployments | Industry standard |

### 4.2 Why Not Supabase for Database?

We use **Neon** for the primary database instead of Supabase Postgres because:
- **Scale-to-zero**: Neon suspends compute after 5 minutes of inactivity. A tenant with no users costs $0.
- **Branching**: Every PR gets a database branch for testing. This is revolutionary for CI/CD.
- **Read replicas**: Built-in, globally distributed, for read-heavy workloads.
- **Cost**: Cheaper at scale for multi-tenant workloads with idle periods.

We still use **Supabase Auth** (it works with any Postgres database) and **Supabase Realtime** (for broadcast channels).

### 4.3 Why Cloudflare + Vercel Hybrid?

| Layer | Platform | Reason |
|-------|----------|--------|
| **API/Edge Logic** | Cloudflare Workers | Cheaper ($5/10M requests), zero egress, better for I/O-bound workloads |
| **SSR/Frontend** | Vercel | Best-in-class Next.js experience, preview deployments, auto-scaling |
| **Object Storage** | Cloudflare R2 | $0 egress vs $0.09/GB on AWS S3 |
| **Real-Time** | Durable Objects | WebSocket Hibernation API = 97% cost reduction |
| **Queue** | Cloudflare Queues | Native, cheap, global |
| **Video** | Bunny Stream | $0.005/GB delivery, 5-10x cheaper than AWS |

This hybrid stack costs **~$475/month** at launch vs **$2,000-5,000/month** on AWS for equivalent traffic.

---

## 5. Multi-Tenant SaaS Core

### 5.1 Tenant Isolation Strategy

**Shared schema + `tenant_id` + Row Level Security (RLS)**

This is the pattern used by Notion (480 logical shards on 32 physical Postgres databases), Frontend Horizon (10+ clients on one $25/mo Supabase project), and recommended by ClickHouse as the best default for B2B SaaS in 2026.

Every tenant-scoped table has:
```sql
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  title TEXT NOT NULL,
  ...
);

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON courses
  FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);
```

**Why this wins:**
- Lowest operational overhead (one schema, one migration applies to all tenants)
- Marginal cost per tenant = $0 (tenant 1 and tenant 1,000 share the same compute)
- Proven to scale to 10,000+ tenants with proper indexing
- Schema-per-tenant is a trap for >50 tenants (migration complexity explodes)
- Database-per-tenant is 10-15x more expensive (reserved for enterprise premium tier)

### 5.2 Tenant Routing

```
User Request → Cloudflare Worker (edge)
  → Extract subdomain from Host header (school.learnworld.com)
  → KV lookup: subdomain → tenant_id + config
  → Set tenant_id in JWT claim
  → Route to Vercel SSR or Cloudflare API
  → Database query uses RLS with tenant_id context
```

**Custom domains**: Premium tenants get CNAME-based custom domains. Vercel's wildcard SSL handles automatic provisioning. The edge worker resolves the custom domain to tenant_id via KV.

### 5.3 Database Design

```sql
-- Core tenant table
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  plan_id TEXT NOT NULL DEFAULT 'free',
  settings JSONB DEFAULT '{}',
  custom_domain TEXT,
  region TEXT DEFAULT 'us-east-1', -- data residency
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User-tenant relationship (users can belong to multiple tenants)
CREATE TABLE tenant_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'student',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, user_id)
);
```

**Index strategy**: Composite indexes on `(tenant_id, created_at)`, `(tenant_id, status)`, and `(tenant_id, user_id)` for every tenant-scoped table.

### 5.4 Storage Isolation

**Path-based isolation in shared R2 buckets**:
```
tenant_id/courses/covers/course_id.jpg
tenant_id/courses/videos/lesson_id.mp4
tenant_id/submissions/lesson_id/user_id/timestamp.dwg
tenant_id/certificates/issued/cert_id.pdf
```

R2 does not have native RLS, so access control is enforced at the Cloudflare Worker layer. Signed URLs with time-limited expiry prevent hotlinking.

### 5.5 Auth & Identity

**Multi-tenant auth flow**:
1. User visits `school.learnworld.com`
2. Edge worker resolves subdomain → tenant_id
3. Auth request includes tenant_id in metadata
4. Supabase Auth creates user with tenant claim in JWT
5. All subsequent requests carry `tenant_id` in JWT
6. RLS policies enforce `tenant_id` isolation on every query

**Edge Functions must forward the user JWT** (never use service_role) to preserve RLS context.

### 5.6 Scaling Path

| Phase | Tenants | Infrastructure | Cost/Tenant |
|-------|---------|---------------|-------------|
| **MVP** | 1-100 | Single Neon DB + RLS | ~$0.50 |
| **Growth** | 100-1,000 | Indexes + connection pooling | ~$0.20 |
| **Scale** | 1,000-10,000 | Read replicas + partitioning | ~$0.10 |
| **Mass Scale** | 10,000-100,000 | Sharded Postgres + hybrid tiering | ~$0.05 |
| **Enterprise** | 100+ | Dedicated DB per tenant (premium) | Custom pricing |

---

## 6. AI-Native Learning Layer

### 6.1 The AI-Native Difference

Competitors bolt AI on as features: "AI course outline generator" (300-1,000 prompts/month, then you pay more). This is because their architecture cannot support AI as a core layer.

**Learnworld's AI is foundational:**
- Every student interaction is logged to a **Student Knowledge Model**
- An **Adaptive Learning Path Engine** uses this model to personalize content sequencing
- A **RAG Architecture** grounds AI responses in course-specific content (no hallucinations)
- **AI Tutors** provide Socratic, personalized help 24/7
- **Auto-Content Generation** creates courses, quizzes, and assignments from prompts
- **Auto-Grading** with feedback is handled by AI, not just multiple-choice matching

### 6.2 Student Knowledge Model

This is the "student brain" that the platform maintains for every learner. It is a 6-layer hybrid data structure:

```typescript
interface StudentKnowledgeModel {
  // Layer 1: Bayesian Knowledge Tracing (BKT)
  bkt: {
    skillId: string;
    pL0: number;      // Initial mastery probability
    pT: number;       // Learning probability
    pG: number;       // Guess probability
    pS: number;       // Slip probability
    mastery: number;  // Current mastery probability (0-1)
  }[];

  // Layer 2: Deep Knowledge Tracing (DKT) hidden state
  dkt: {
    hiddenState: Float32Array;  // LSTM hidden state vector
    interactionSequence: Interaction[];
  };

  // Layer 3: Concept embeddings
  conceptEmbeddings: {
    conceptId: string;
    embedding: number[];  // Vector representation of understanding
    relatedConcepts: string[];
  }[];

  // Layer 4: Interaction history
  interactions: {
    timestamp: Date;
    contentId: string;
    type: 'video' | 'quiz' | 'assignment' | 'discussion';
    score: number;
    timeSpent: number;
    hintsUsed: number;
    errors: ErrorPattern[];
  }[];

  // Layer 5: Affective & behavioral metrics
  affective: {
    frustrationLevel: number;  // Derived from error patterns, time spent
    engagementScore: number;   // Frequency of logins, time on platform
    helpSeekingBehavior: number; // How often they ask for hints
    selfRegulation: number;    // Pace consistency, revision patterns
  };

  // Layer 6: Knowledge graph position
  knowledgeGraph: {
    nodeId: string;
    status: 'not_started' | 'in_progress' | 'mastered' | 'struggling';
    prerequisites: string[];
    readyToLearn: boolean;
  }[];
}
```

This model is updated in real-time with every student interaction. It powers the adaptive path engine, AI tutor responses, and predictive analytics.

### 6.3 Adaptive Learning Path Engine

The engine uses reinforcement learning to determine the optimal next content for each student:

```
Student State (knowledge model + affective metrics)
  → Policy Network (trained on completion data across all tenants)
  → Action: {nextLesson, difficulty, format, supportLevel}
  → Student Interacts
  → Reward: +1 for completion, +0.5 for engagement, -1 for abandonment
  → Update Policy Network
```

**Key algorithms**:
- **BKT** for skill mastery tracking (proven, interpretable)
- **DKT/DKVMN** for deep sequence modeling of learning
- **Multi-armed bandits** for content exploration vs exploitation
- **Collaborative filtering** for "students like you also studied..."

**Empirical result**: GenMentor (a similar system) achieved 78.5% completion prediction accuracy, enabling proactive intervention before students drop out.

### 6.4 RAG Architecture for Course Content

Every AI interaction is grounded in the tenant's actual course content. No hallucinations. No generic advice.

```
User Question
  → Intent Classification ("Is this a factual question about the course?")
  → If Yes: Hybrid Retrieval (BM25 + semantic search on course content)
    → Top-K chunks retrieved from Typesense (BM25) + pgvector (semantic)
    → Re-ranking with cross-encoder
    → Context assembled: {course chunks, student knowledge model, conversation history}
    → LLM generates answer with source attribution
  → If No: Direct LLM response (general knowledge, off-topic)
```

**Content chunking**:
- Video transcripts are chunked by topic segment
- PDFs are chunked by section with overlap
- Quiz questions are stored as individual documents
- Assignment instructions are chunked with rubric sections

**Source attribution**: Every AI response includes "Based on Module 3.2 — Fiber Construction" so students can verify and learn deeper.

### 6.5 AI Tutor / Socratic Agent

The AI tutor is not a chatbot. It is a **pedagogical agent** that adapts to the student's knowledge state.

```
Student asks a question
  → System checks Student Knowledge Model
  → If struggling: Socratic questioning ("What do you think happens when...?")
  → If close to mastery: Confirm and extend ("Yes, and consider this edge case...")
  → If frustrated: Provide worked example, reduce difficulty
  → If bored: Increase challenge, suggest advanced content
```

**Multi-agent architecture** (6 specialized agents + 1 orchestrator):
1. **Orchestrator**: Routes queries to the right agent
2. **Content Agent**: Retrieves and synthesizes course material
3. **Pedagogy Agent**: Determines teaching strategy (Socratic, direct, example-based)
4. **Assessment Agent**: Generates quiz questions, evaluates answers
5. **Motivation Agent**: Encourages, gamifies, detects burnout
6. **Meta-Cognition Agent**: Teaches study strategies, self-regulation
7. **Language Agent**: Translates, simplifies complex text

### 6.6 Auto-Content Generation

Course creators can generate courses from a single prompt:

```
Input: "Create a 10-module course on Outside Plant Engineering for fiber optic technicians"
  → Instructional Agent: Plans curriculum structure (ADDIE model)
  → Content Agent: Generates module outlines, learning objectives
  → Media Agent: Suggests video scripts, diagram descriptions
  → Quiz Agent: Generates 15 questions per module with distractors
  → Assignment Agent: Creates project briefs with rubrics
  → Review Agent: Quality checks for accuracy, pedagogy, alignment
  → Output: Complete course draft, ready for instructor review and refinement
```

**Quality control**: Teacher-in-the-loop. AI generates drafts; human approves, edits, and publishes. This achieves 7x speedup in course creation while maintaining quality.

### 6.7 Auto-Grading & Feedback

| Content Type | Grading Method | Example |
|-------------|---------------|---------|
| **Multiple choice** | Exact match + partial credit | Standard |
| **Fill-in-blank** | Fuzzy matching + semantic similarity | "fusion splicing" vs "splicing" |
| **Short answer** | LLM-evaluated against rubric | 0-100 score with feedback |
| **Essay** | LLM + rubric-based evaluation | Structure, argument, evidence |
| **Code** | Judge0 execution + LLM review | Compile, test cases, style |
| **Project file** | LLM-assisted rubric evaluation | AutoCAD file → checklist evaluation |
| **Discussion** | Peer + AI evaluation | Engagement, critical thinking |

**AI cost optimization**: Small models (7B) for simple grading, frontier models (70B) for complex evaluation. Local Ollama for free inference on common tasks. Average cost per auto-grade: $0.001-0.01.

### 6.8 AI Cost Architecture

| Layer | Technology | Cost Model | When Used |
|-------|-----------|------------|-----------|
| **Local inference** | Ollama + llama.cpp + vLLM | $0 (self-hosted) | Common tasks, high-volume grading, real-time tutoring |
| **Edge inference** | Cloudflare Workers AI | $0.001-0.01/request | Low-latency, privacy-sensitive |
| **Cloud routing** | OpenRouter | Pay-per-token | Frontier models, complex reasoning |
| **Semantic cache** | Redis + pgvector | $0 (cached) | Repeated questions, common queries |

**Break-even**: Self-hosted GPU is justified at $20,000-$50,000/month API spend. Below that, hybrid local + cloud is optimal.

---

## 7. Edge-First Global Infrastructure

### 7.1 Why Edge-First?

Traditional SaaS serves from central data centers (e.g., AWS us-east-1). A user in India or Brazil waits 200-500ms for every request. This is unacceptable for interactive learning.

**Edge-first means**:
- Static assets: served from 330+ CDN PoPs (< 20ms)
- Dynamic API: executed at nearest edge node (< 50ms)
- Database reads: served from regional read replicas
- Database writes: sent to primary region (async replication)
- Real-time: WebSockets via Durable Objects in the user's region

### 7.2 Architecture Diagram

```
User in Brazil
  ↓ 20ms
Cloudflare PoP (São Paulo)
  → Edge Worker: Auth, tenant routing, caching, personalization
  → R2 CDN: Static assets, videos, PDFs
  → Durable Object: Real-time chat, presence, notifications
  → KV: Tenant config, session data, feature flags
  ↓ 80ms
Neon Read Replica (South America)
  → Course data, progress, quiz results
  ↓ 150ms
Neon Primary (US-East)
  → Writes: enrollment, purchases, content creation
```

### 7.3 Edge Compute Strategy

| Workload | Platform | Latency | Cost |
|----------|----------|---------|------|
| **API requests** | Cloudflare Workers | < 50ms | $5/10M requests |
| **SSR pages** | Vercel Edge | < 100ms | Included with Vercel |
| **Auth/tenant routing** | Cloudflare Workers | < 20ms | $5/10M requests |
| **Real-time** | Durable Objects | < 50ms | ~$10/mo per active room |
| **Background jobs** | Cloudflare Workers (cron) | N/A | $0.12/mo per cron |

### 7.4 Database Strategy

**Neon architecture**:
- **Primary**: One write-primary in US-East (lowest latency for most creators)
- **Read Replicas**: EU (Frankfurt), APAC (Singapore), South America (São Paulo)
- **Branching**: Every PR gets a database branch for testing (zero-cost, zero-time provisioning)
- **Scale-to-zero**: Compute suspends after 5 minutes of inactivity

**Connection pooling**: PgBouncer / Supavisor enables 10,000+ pooled connections from 100 direct connections. Essential for multi-tenant workloads.

### 7.5 Real-Time at Edge

**Durable Objects WebSocket Hibernation**:
- Traditional WebSocket server: $416/month for 100 concurrent connections
- Durable Objects Hibernation: ~$10/month for the same (97% cost reduction)
- Hibernation: connection state is persisted to disk when idle; restored when message arrives
- Each room (course discussion, group chat, live session) = one Durable Object

**Supabase Realtime**: Used for broadcast channels (notifications, activity feeds) where WebSocket is not needed.

### 7.6 Data Residency & Compliance

- **EU tenants**: Data stored in EU read replica + primary region (if required)
- **US tenants**: Data stored in US-East
- **APAC tenants**: Data stored in Singapore
- **GeoDNS routing**: `eu.learnworld.com`, `us.learnworld.com`, or automatic based on tenant registration country
- **Shadow identifiers**: Separate user IDs per region to prevent cross-border data leakage

### 7.7 Cost Model

| Component | Monthly Cost (Launch) | Monthly Cost (10K Tenants) |
|-----------|----------------------|---------------------------|
| Cloudflare Workers | $5 | $50 |
| Cloudflare R2 | $10 | $200 |
| Neon Database | $25 | $500 |
| Bunny Stream | $20 | $500 |
| Vercel (Pro) | $20 | $100 |
| Typesense | $29 | $100 |
| **Total** | **~$109** | **~$1,450** |

At 10,000 tenants with 2.5% conversion to paid ($20 ARPU average), revenue = $5,000/month. Infrastructure cost = $1,450/month. **Gross margin = 71%**.

---

## 8. Next-Gen Content Architecture

### 8.1 Beyond SCORM: The cmi5 + xAPI + JSON-Native Stack

SCORM 2004 was frozen in 2009. It is a ZIP-based package format with a JavaScript API bridge. It is the primary pain point in every LMS migration.

**Learnworld's content stack**:

| Layer | Standard | Purpose |
|-------|----------|---------|
| **Packaging** | cmi5 (xAPI profile) | Structured course import/export |
| **Tracking** | xAPI 2.0 (Tin Can) | Learning record store (LRS) for all experiences |
| **Content** | JSON-native | Modern, interactive, versionable |
| **Interactivity** | H5P + custom components | Rich interactive content |
| **Video** | WebRTC → HLS | Live + on-demand streaming |
| **Collaboration** | Yjs CRDTs | Real-time collaborative editing |

### 8.2 Content Model

Every piece of content is a JSON document stored in the database:

```json
{
  "id": "lesson-123",
  "tenant_id": "tenant-456",
  "type": "interactive",
  "version": 3,
  "branches": {
    "main": "commit-abc",
    "draft": "commit-def",
    "preview": "commit-ghi"
  },
  "blocks": [
    { "type": "video", "video_id": "bunny-uuid", "transcript": "..." },
    { "type": "text", "content": "<rich-text>", "collaborative": true },
    { "type": "h5p", "content_id": "interactive-123" },
    { "type": "quiz", "quiz_id": "quiz-456" },
    { "type": "assignment", "rubric": "...", "files": [] }
  ],
  "metadata": {
    "estimated_duration": 1200,
    "prerequisites": ["lesson-122"],
    "learning_objectives": ["obj-1", "obj-2"],
    "ai_embeddings": [0.1, 0.2, ...]
  }
}
```

### 8.3 Real-Time Collaborative Course Building

Course creators collaborate in real-time, like Google Docs or Figma:

- **Yjs CRDTs**: Handle 26,000-156,000 operations per second with automatic conflict resolution
- **ProseMirror/Tiptap**: Rich text editor with real-time cursors and selections
- **Awareness protocol**: Shows who is editing what, live cursors, presence
- **IndexedDB persistence**: Offline editing; sync when reconnected
- **Git-like branching**: `main` (published), `draft` (work in progress), `preview` (review)

### 8.4 Live Session Architecture

Native WebRTC live sessions, not embedded Zoom/Meet:

| Component | Technology | Capability |
|-----------|-----------|------------|
| **SFU** | LiveKit or mediasoup | 1:200 instructor:student ratio |
| **Breakout rooms** | Parent/child Durable Objects | Dynamic group creation |
| **Whiteboard** | Canvas + CRDT sync | Collaborative drawing |
| **Recording** | FFmpeg composite | Auto-record, auto-transcribe |
| **Engagement** | Real-time scoring | Attention tracking, chat sentiment |
| **Signaling** | Durable Objects | WebRTC signaling at edge |

### 8.5 Video Architecture

| Format | Codec | Use Case |
|--------|-------|----------|
| **On-demand** | AV1 + HLS | 30-50% smaller than H.264, royalty-free |
| **Live** | VP9 + WebRTC | Real-time interactive |
| **Recording** | H.264 + HLS | Maximum compatibility |
| **Adaptive** | ABR ladder (240p-4K) | Automatic quality based on bandwidth |

**CDN**: Bunny Stream for on-demand ($0.005/GB delivery). Cloudflare Stream for live (if needed). R2 for long-tail storage.

### 8.6 Content Interoperability & Portability

- **Import**: cmi5, SCORM 1.2/2004, Common Cartridge, LTI 1.3, Markdown, Notion, Google Docs
- **Export**: cmi5, xAPI, JSON, HTML, PDF, SCORM 1.2/2004 (for legacy systems)
- **API**: Public LRS endpoint for xAPI statements
- **LTI 1.3 Advantage**: Full tool provider + platform support

---

## 9. Mobile-First & Offline-First

### 9.1 PWA-First Strategy

No native app required. The PWA provides:
- **Install to home screen**: iOS and Android (Android prompts; iOS requires manual add)
- **Push notifications**: Web Push API (Android works; iOS works since iOS 16.4+ for EU, iOS 17+ globally)
- **Background sync**: Queue actions when offline, execute when reconnected
- **Offline storage**: Multi-GB content libraries (Android/Chrome); lightweight metadata (iOS)
- **File system access**: Save assignments, upload files from device

**Cost**: $0. Competitors charge $149-$199/month for native apps.

### 9.2 Offline Storage Architecture

| Content Type | Storage | Limit | Sync Strategy |
|-------------|---------|-------|---------------|
| **Course metadata** | IndexedDB | ~50MB | Differential sync (Yjs) |
| **PDFs** | Cache API + OPFS | ~500MB | Background fetch, chunked |
| **Videos** | OPFS + HLS segments | 2-5GB (Android), 50MB (iOS) | Selective download, resume |
| **Quiz data** | IndexedDB | ~10MB | Pre-sync question banks |
| **Progress** | IndexedDB | ~1MB | Background sync queue |

### 9.3 iOS-Specific Handling

iOS has restrictions that require special handling:
- **7-day cache expiry**: Service Worker caches must be refreshed weekly
- **50MB storage cap**: For heavy content, use a Capacitor wrapper (single WebView, native file system access)
- **No background sync**: Use periodic background sync (if available) or push-triggered sync
- **EU DMA restrictions**: In EU, iOS may strip PWA features. Capacitor fallback is required.

**Strategy**: PWA-first for Android and global iOS. Capacitor fallback for EU iOS users who need full offline capability.

### 9.4 Conflict Resolution

When a learner works offline and syncs back:
- **CRDTs (Yjs)**: Automatic merge for collaborative content (notes, discussions)
- **Last-write-wins (LWW)**: For simple progress tracking
- **Server reconciliation**: For quiz submissions (server answer is authoritative)
- **Conflict UI**: For assignments (show both versions, let user choose)

---

## 10. Ecosystem & Extensibility

### 10.1 Plugin Marketplace Architecture

Learnworld is the "Shopify of LMS" — a platform that third-party developers extend.

**App model**: External apps (like Shopify), NOT internal plugins (like WordPress). Reasons:
- **Security**: WordPress's internal plugin model is responsible for 90% of hacks. External apps run in sandboxed iframes with `postMessage` communication.
- **Reliability**: External apps cannot crash the core platform.
- **Scalability**: External apps scale independently.

**Architecture**:
```
Learnworld Core (Next.js + Neon)
  ←→ API Proxy (Cloudflare Worker)
    ←→ External App (iframe or separate domain)
      ←→ OAuth2 authentication
      ←→ Granular permissions (courses:read, users:read:pii, etc.)
      ←→ Webhook events (user.enrolled, course.completed, etc.)
```

### 10.2 API-First Design

**Dual API strategy**:
- **REST API** (public): `/v1/courses`, `/v1/users`, `/v1/enrollments`. Cursor-based pagination, idempotency keys, bulk operations. Versioned via URL path (`/v1/`, `/v2/`).
- **GraphQL** (internal): Complex queries for mobile and internal dashboards. Schema evolution with `@deprecated`.
- **OpenAPI**: Auto-generated `/openapi.json` and `/llms.txt` for AI agent discovery.

### 10.3 Webhook Architecture

- **Queue-first**: Cloudflare Queues guarantee at-least-once delivery
- **HMAC signature**: Every webhook is signed for verification
- **Exponential backoff + jitter**: Failed deliveries retry with increasing delay
- **Circuit breakers**: Stop sending to failing endpoints after 5 consecutive failures
- **Dead-letter queue**: Inspect and replay failed webhooks
- **Event versioning**: Webhook payloads include version number; 18-month deprecation window

**Event categories**: `user.*`, `course.*`, `enrollment.*`, `payment.*`, `progress.*`, `certificate.*`, `community.*`, `ai.*`, `tenant.*`, `security.*`, `integration.*`

### 10.4 White-Label Architecture

Premium tenants get full white-label:
- **Custom domain**: CNAME + auto-SSL
- **Branding**: Logo, colors, fonts, CSS variables
- **Custom emails**: Send from tenant's domain (SPF/DKIM)
- **Custom mobile app**: Capacitor wrapper with tenant branding (optional, enterprise tier)
- **Configuration-driven**: All customization via `tenant.settings` JSONB — no code forks

### 10.5 Developer Experience

- **Developer portal**: Interactive API explorer, sandbox schools, auto-generated SDKs (TypeScript, Python, Go, Ruby, PHP, Java)
- **Postman collections**: One-click import
- **Webhook inspector**: Test and debug webhook deliveries
- **App CLI**: `learnworld app:create`, `learnworld app:deploy`, `learnworld app:logs`
- **Partner program**: Bronze → Silver → Gold → Platinum (revenue share, co-marketing, priority support)

### 10.6 Integration Ecosystem Strategy

**6-category marketplace**:
1. **Analytics**: Mixpanel, Amplitude, PostHog, Google Analytics 4
2. **Marketing**: Mailchimp, ConvertKit, ActiveCampaign, HubSpot
3. **Commerce**: Stripe, PayPal, Paddle, Lemon Squeezy
4. **Content**: H5P, Notion, Google Docs, Figma
5. **Community**: Discord, Slack, Circle (embed)
6. **Credentials**: Credly, Accredible, blockchain certificates

**Revenue split**: 70% developer, 30% Learnworld (industry standard).

---

## 11. Security, Compliance & Trust

### 11.1 Security by Design

1. **Defense in depth**: RLS + application validation + edge firewall + WAF
2. **Privacy by design**: GDPR data minimization from day one
3. **Least privilege**: Granular permissions, no broad admin access
4. **Immutable evidence**: Append-only audit logs with hash linking
5. **Assume breach**: Zero-trust network, encrypt everything

### 11.2 Tenant Isolation Verification

5 methods to prove isolation to auditors:
1. **Automated CI/CD tests**: Cross-tenant data leakage tests on every build
2. **Third-party penetration test**: Annual tenant isolation audit
3. **Architecture documentation**: Published security whitepaper
4. **Incident runbook**: Cross-tenant leak response procedures
5. **Quarterly access reviews**: Verify no cross-tenant data exposure

### 11.3 Encryption Strategy

| Layer | Method | Key Management |
|-------|--------|---------------|
| **At rest (database)** | AES-256 | Neon managed |
| **At rest (storage)** | AES-256 | Cloudflare managed |
| **In transit** | TLS 1.3 | Automatic (Cloudflare) |
| **Application-level** | Envelope encryption | KMS + tenant-specific keys |
| **Enterprise (BYOK)** | Customer-managed keys | Bring your own key (premium tier) |

### 11.4 Compliance Roadmap

| Milestone | Target | Cost | Timeline |
|-----------|--------|------|----------|
| **MVP Launch** | HTTPS, RLS, MFA, input validation, security headers | $0 | Day 1 |
| **SOC 2 Type I** | Security controls audited | $15,000-$30,000 | Month 6-9 |
| **SOC 2 Type II** | Continuous security monitoring | $25,000-$80,000 | Month 12-18 |
| **GDPR full compliance** | DPO, data export, right to erasure, cookie consent | $10,000-$20,000 | Month 6-12 |
| **FERPA** | For US K-12 and higher ed | $5,000-$15,000 | Month 12-18 |
| **Data residency (EU/APAC)** | Regional data centers | $500-$2,000/mo | Month 12-18 |
| **ISO 27001** | International security standard | $30,000-$60,000 | Year 2-3 |

### 11.5 Data Residency Architecture

- **Tenant registration**: Country captured at sign-up
- **Region pinning**: Tenant data stored in assigned region
- **GeoDNS**: `tenant.learnworld.com` resolves to nearest edge, but data stays in pinned region
- **Sub-processor transparency**: Published list of data processors by region
- **Migration**: Tenant can request data migration to another region (enterprise tier)

### 11.6 Audit Trails & Immutable Logs

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  actor_id UUID NOT NULL,      -- Who did it
  action TEXT NOT NULL,        -- What happened
  resource_type TEXT NOT NULL, -- What was affected
  resource_id UUID,            -- Which record
  changes JSONB,               -- Before/after snapshot
  ip_address INET,             -- Where from
  user_agent TEXT,             -- How
  hash TEXT NOT NULL,          -- Hash of this row + previous hash (blockchain-like)
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

- **Append-only**: No UPDATE or DELETE allowed
- **Hash-linked**: Each row contains hash of previous row (tamper-evident)
- **WORM storage**: Write Once Read Many (separate archive storage)
- **Retention**: 1 year online, 3-7 years in cold archive

### 11.7 Identity & Access Management

**6-tier RBAC**:
1. **Super Admin**: Platform-level access (Learnworld team only)
2. **Tenant Owner**: Full access to tenant data and settings
3. **Tenant Admin**: Manage users, courses, billing (no deletion)
4. **Instructor**: Create/edit courses, grade assignments
5. **Teaching Assistant**: Grade assignments, moderate community
6. **Student**: View enrolled content, participate in community

**ABAC (Attribute-Based Access Control)**: For enterprise hierarchies (department-level access, time-based access, location-based access).

### 11.8 Incident Response

**NIST 6-phase framework**:
1. **Preparation**: Playbooks, contact lists, tool access
2. **Detection & Analysis**: Monitoring alerts, log analysis, scope assessment
3. **Containment**: Isolate affected tenants, preserve evidence
4. **Eradication**: Remove threat, patch vulnerabilities
5. **Recovery**: Restore services, verify integrity
6. **Post-Incident**: Lessons learned, report, policy updates

**Severity matrix**:
- **P0 (Critical)**: Cross-tenant data leak, full platform outage, ransomware → 15-minute response
- **P1 (High)**: Single tenant outage, payment processing failure → 1-hour response
- **P2 (Medium)**: Feature degradation, performance issue → 4-hour response
- **P3 (Low)**: Cosmetic bug, minor inconvenience → 24-hour response

---

## 12. Affordable Cost Architecture

### 12.1 Infrastructure Cost Model

**Per-tenant cost at small scale** (100 students, 10 courses, 5GB video):

| Component | Cost/Month |
|-----------|------------|
| Database (Neon, scale-to-zero) | ~$0.02-0.05 |
| Storage (R2) | ~$0.05 |
| API requests (Workers) | ~$0.01 |
| Video delivery (Bunny Stream) | ~$0.10-0.30 |
| Auth (Supabase, amortized) | ~$0.00 |
| **Total per tenant** | **~$0.15-0.50** |

**Target**: <$0.30 per MAU/month at scale.

### 12.2 Resource Caps & Abuse Prevention

| Tier | Students | Courses | Video Storage | API Requests/Month |
|------|----------|---------|---------------|-------------------|
| **Free** | 50 | 3 | 1 GB | 50K |
| **Starter ($9)** | 250 | 10 | 10 GB | 500K |
| **Pro ($29)** | 1,000 | Unlimited | 100 GB | 5M |
| **School ($79)** | Unlimited | Unlimited | 500 GB | Unlimited |
| **Campus ($199)** | Unlimited | Unlimited | 2 TB | Unlimited |

**Abuse prevention**:
1. PostgreSQL RLS: Prevents cross-tenant leaks even with app bugs
2. API rate limiting per tenant: Enforced at Cloudflare edge
3. Storage quotas: Block uploads at 100%, warn at 80%
4. Connection pooling: 0.25 CU Neon = 104 direct connections, 10,000 pooled
5. CPU time caps: 10ms/request free, 50ms paid on Workers
6. Video throttling: Free tier capped at 720p; 1080p/4K require Pro+
7. Scale-to-zero: Neon suspends compute for inactive tenants

### 12.3 Open-Source Component Strategy

| Proprietary | Open-Source Replacement | Annual Savings |
|-------------|------------------------|----------------|
| Articulate 360 ($1,499/yr/seat) | H5P (MIT) | $1,500+/seat |
| Adobe Captivate ($408/yr) | Adapt Learning (GPL) | $400+/seat |
| Docebo/Blackboard ($50K-150K/yr) | Moodle + custom Next.js | $50K-150K/yr |
| Auth0 ($200-500/mo) | Supabase Auth (Apache 2.0) | $2,400-6,000/yr |
| Algolia ($500-1,000/mo) | Typesense (GPL) | $6,000-12,000/yr |
| Zoom/Webex ($50-200/mo) | Jitsi Meet (Apache 2.0) | $600-2,400/yr |
| Zapier/Make ($100-500/mo) | n8n (Fair-code) | $1,200-6,000/yr |

**Total open-source licensing cost: $0**

### 12.4 Pricing Strategy

| Tier | Monthly | Annual | Target | Key Features |
|------|---------|--------|--------|-------------|
| **Free** | $0 | $0 | Hobbyists | 50 students, 3 courses, basic AI |
| **Starter** | $9 | $90 | Solo creators | 250 students, custom domain, AI assistant |
| **Pro** | $29 | $290 | Coaches, consultants | 1,000 students, full AI, white-label |
| **School** | $79 | $790 | Small schools, bootcamps | Unlimited students, SSO, API access |
| **Campus** | $199 | $1,990 | Universities, enterprises | SLA, custom integrations, BYOK, dedicated support |

**Transaction fee strategy**: 5% on Free, 2% on Starter, 0% on Pro+. At $1,000/month in course sales, a 5% fee = $50 — enough to cover a free tenant's infrastructure cost.

### 12.5 Break-Even Analysis

**Cost per free tenant**: ~$0.09-0.15/month

| Scenario | Free Tenants | Conversion Rate | Paid Revenue | Gross Margin | Result |
|----------|-------------|-----------------|--------------|--------------|--------|
| A | 1,000 | 2% Starter | $180/mo | $60/mo | Break-even |
| B | 1,000 | 3% Starter + 1% Pro | $560/mo | $440/mo (79%) | **Profitable** |
| C | 10,000 | 2.5% avg | $5,000/mo | $4,000/mo (80%) | **Highly profitable** |

**Break-even point: ~2,000 free tenants with 2.5% conversion**

### 12.6 Scaling Economics

| Phase | Tenants | Infra Cost | Cost/Tenant | Revenue (2.5% conv) | Gross Margin |
|-------|---------|------------|-------------|---------------------|--------------|
| **MVP** | 1-100 | $0-50/mo | $0.50-1.00 | $0-225/mo | Varies |
| **Growth** | 100-1,000 | $200-800/mo | $0.20-0.40 | $450-4,500/mo | 60-70% |
| **Scale** | 1,000-10,000 | $1,500-5,000/mo | $0.10-0.25 | $4,500-45,000/mo | 70-80% |
| **Mass Scale** | 10,000-100,000 | $8,000-25,000/mo | $0.05-0.15 | $50,000-150,000/mo | 70-85% |

---

## 13. 10-Year Evolution Roadmap

### 13.1 The Rails Monolith Trap (Why We Avoid It)

Every competitor is a Rails monolith from 2012-2015. The trap has 3 phases:
1. **Rapid growth**: Rails enables fast feature shipping; technical debt accumulates
2. **Deceleration**: Every new feature requires touching the same code; 33-42% of dev time lost to technical debt
3. **Architectural paralysis**: Rewrite is too risky; extraction is too expensive; the company is trapped

**67% of monolith-to-microservices migrations fail** (research by 34 real-world case studies). The survivors (Shopify, Netflix, GitHub) succeeded because they did not start with microservices — they started with modular monoliths and extracted carefully.

### 13.2 Modular Monolith Foundation

**Shopify's "Majestic Monolith" model**:
- Enforce module boundaries in code (e.g., `src/modules/courses/`, `src/modules/ai/`)
- Each module has its own domain logic, data access, and API
- Shared infrastructure (database, auth, edge) but isolated code
- Modules communicate via internal APIs, not direct database access
- This makes future extraction possible without rewriting

### 13.3 Microservices Extraction Trigger Points

Extract a module to a separate service ONLY when:
1. **Scaling**: The module needs 10x more compute than the rest (e.g., AI inference, video processing)
2. **Technology mismatch**: The module needs a different stack (e.g., Rust for real-time, Python for ML)
3. **Compliance**: Enterprise tenants require physical isolation for a specific module
4. **Team size**: Module has 8+ engineers and deploys independently
5. **Deploy bottleneck**: Module changes cause 30%+ of production incidents

**Extraction pattern**: Strangler Fig — route traffic gradually from monolith to new service over 6-12 months.

### 13.4 API Versioning & Backward Compatibility

**18-year compatibility commitment**:
- API versions supported for 18 months after deprecation notice
- URL-based versioning: `/v1/courses`, `/v2/courses`
- Semantic versioning: additive-only changes within major versions
- GraphQL: `@deprecated` directive with migration guide
- Webhooks: payload versioning, 18-month deprecation window
- Plugin compatibility layer: older plugins run in sandboxed compatibility mode

### 13.5 Technology Drift Management

**6-layer drift framework**:
1. **Runtime**: Node.js LTS (upgrade every 2 years)
2. **Framework**: Next.js (follow Vercel releases, 1-year lag)
3. **Database**: PostgreSQL (major versions, 1-year lag)
4. **AI models**: Abstraction layer; swap models without changing code
5. **Edge platform**: Cloudflare (follow platform updates)
6. **Dependencies**: Quarterly dependency audit; automated CVE scanning

**Quarterly dependency audit**: Review all dependencies for abandonment, security, and better alternatives.

**Dual-boot CI**: Run tests on both current and next versions of Node.js, PostgreSQL, and Next.js before upgrading.

### 13.6 AI Model Evolution Strategy

LLMs evolve every 6 months. We cannot hardcode to GPT-4 or Claude 3.

**AI abstraction layer**:
```typescript
interface AIProvider {
  generate(options: AIOptions): Promise<AIResponse>;
  grade(options: GradeOptions): Promise<GradeResult>;
  embed(text: string): Promise<number[]>;
}

// Implementations
class OllamaProvider implements AIProvider { ... }
class OpenRouterProvider implements AIProvider { ... }
class CloudflareAIProvider implements AIProvider { ... }
```

**Model routing**: Small models (7B) for simple tasks; frontier models (70B+) for complex reasoning. Automatic fallback if one provider is down.

**Prompt versioning**: All prompts are versioned in Git. A/B test prompt changes. Rollback if quality degrades.

**3-phase AI roadmap**:
- **Phase 1 (Now)**: Cloud API + local Ollama hybrid
- **Phase 2 (Year 2-3)**: Edge inference on Cloudflare Workers AI (lower latency, better privacy)
- **Phase 3 (Year 4-6)**: Agentic AI — autonomous agents that can take actions on behalf of students and instructors

### 13.7 Team Scaling & Platform Engineering

| Stage | Engineers | Focus | Infrastructure |
|-------|-----------|-------|---------------|
| **Startup** | 3-10 | Feature velocity | Vercel + Cloudflare + Neon |
| **Growth** | 10-30 | Modular boundaries | Terraform, CI/CD, feature flags |
| **Scale** | 30-50 | Platform engineering | Internal developer platform (IDP), golden paths |
| **Enterprise** | 50+ | Domain teams | Microservices, dedicated SRE, FinOps |

**Platform engineering** (starts at 30+ engineers):
- **Internal Developer Platform (IDP)**: Self-service provisioning for developers
- **Golden paths**: Pre-approved templates for new services
- **SLOs-as-code**: Every service has defined SLOs in Terraform
- **FinOps guardrails**: Cost alerts per team, per service, per tenant

### 13.8 Feature Flags & Safe Evolution

**4 toggle categories**:
1. **Release toggles**: Hide unfinished features
2. **Experiment toggles**: A/B test new features
3. **Ops toggles**: Circuit breakers, rate limits, kill switches
4. **Permission toggles**: Feature access by plan/tier

**Ring-based deployment**:
- Ring 0: Internal team
- Ring 1: Beta tenants (volunteers)
- Ring 2: 5% of tenants
- Ring 3: 25% of tenants
- Ring 4: 100% of tenants

**Flag hygiene**: Flags older than 30 days are automatically flagged for removal. 73% incident reduction from AI-driven progressive delivery.

### 13.9 The 10-Year Roadmap

#### Years 1-3: Foundation (Now - 2029)
- **Goal**: Launch MVP, reach 1,000 tenants, prove unit economics
- **Architecture**: Modular monolith on Cloudflare + Vercel + Neon
- **Features**: Core LMS + AI assistant + PWA + basic plugin marketplace
- **Team**: 3-15 engineers
- **Metrics**: <$0.30/MAU, 2.5% free-to-paid conversion, 99.9% uptime

#### Years 4-6: Selective Extraction (2029-2032)
- **Goal**: Scale to 10,000+ tenants, extract high-scale modules
- **Architecture**: AI inference service, video processing service, real-time service extracted
- **Features**: Advanced AI tutoring, native live sessions, full white-label, enterprise SSO
- **Team**: 15-50 engineers, platform engineering team
- **Metrics**: 70%+ gross margin, SOC2 Type II, 99.99% uptime

#### Years 7-10: Global Scale (2032-2036)
- **Goal**: 100,000+ tenants, global presence, AI-native dominance
- **Architecture**: Multi-region, sharded databases, hybrid tenant isolation
- **Features**: Agentic AI, VR/AR learning, global credential network, AI-generated degrees
- **Team**: 50+ engineers, dedicated SRE, AI research team
- **Metrics**: #1 LMS by active learners, 80%+ gross margin, 99.999% uptime

---

## 14. Implementation Phases

### Phase 1: Foundation (Months 1-3)
**Goal**: Multi-tenant core + basic LMS + AI assistant MVP

| Module | Deliverable |
|--------|-------------|
| **Tenant Core** | Subdomain routing, RLS, tenant onboarding, custom domain |
| **Auth** | Supabase Auth multi-tenant, OAuth2, MFA |
| **Course Builder** | JSON-native content, video upload, PDF, basic quiz |
| **Course Player** | Video player, PDF viewer, quiz engine, progress tracking |
| **AI Assistant** | RAG-based Q&A, local Ollama for common queries |
| **PWA** | Service Worker, offline storage, background sync |
| **Payments** | Stripe integration, subscription billing, resource caps |

### Phase 2: Growth (Months 4-6)
**Goal**: Community + advanced AI + content marketplace

| Module | Deliverable |
|--------|-------------|
| **Community** | Discussion spaces, real-time chat (Durable Objects), notifications |
| **Advanced AI** | Student knowledge model, adaptive paths, auto-quiz generation |
| **Assignments** | File upload, rubric-based grading, peer review |
| **Certificates** | Template builder, auto-issuance, verification |
| **Content Import** | SCORM, cmi5, Markdown, Notion import |
| **Admin Dashboard** | Analytics, user management, enrollment, reports |

### Phase 3: Scale (Months 7-9)
**Goal**: Plugin marketplace + ecosystem + enterprise features

| Module | Deliverable |
|--------|-------------|
| **Plugin Marketplace** | App store, developer portal, SDK, OAuth2 apps |
| **API v1** | REST + GraphQL, webhooks, OpenAPI |
| **White-Label** | Full branding, custom domain, custom email |
| **Live Sessions** | WebRTC native, breakout rooms, whiteboard, recording |
| **Mobile Polish** | Push notifications, offline video, Capacitor fallback |
| **Compliance** | SOC2 Type I, GDPR full compliance, data export |

### Phase 4: Dominance (Months 10-12)
**Goal**: AI-native dominance + global edge + enterprise

| Module | Deliverable |
|--------|-------------|
| **AI Tutor** | Full ITS, Socratic agent, multi-agent system |
| **Auto-Content** | AI course generation, auto-grading, feedback |
| **Global Edge** | EU/APAC read replicas, data residency, GeoDNS |
| **Enterprise** | SSO (SAML), SCIM, BYOK, dedicated support |
| **Analytics** | Advanced reporting, predictive analytics, AI insights |
| **Marketplace** | 50+ integrations, 10+ certified apps, partner program |

---

## Appendices

### A. Complete Tech Stack Summary

| Layer | Technology | Cost (Launch) | Cost (Scale) |
|-------|-----------|----------------|--------------|
| **Frontend** | Next.js 16 + Tailwind + shadcn/ui | $20 (Vercel) | $100 |
| **Edge Compute** | Cloudflare Workers | $5 | $50 |
| **SSR** | Vercel Edge Functions | Included | Included |
| **Database** | Neon PostgreSQL | $25 | $500 |
| **Read Replicas** | Neon (multi-region) | $0 | $200 |
| **Auth** | Supabase Auth | $0 | $0 |
| **Object Storage** | Cloudflare R2 | $10 | $200 |
| **Video CDN** | Bunny Stream | $20 | $500 |
| **Real-Time** | Durable Objects + Supabase Realtime | $10 | $100 |
| **Queue** | Cloudflare Queues | $0 | $20 |
| **Search** | Typesense Cloud | $29 | $100 |
| **AI (Local)** | Ollama + vLLM | $0 | $200 (GPU) |
| **AI (Cloud)** | OpenRouter | $50 | $500 |
| **Monitoring** | Cloudflare + Vercel + Better Stack | $0 | $50 |
| **DevOps** | GitHub Actions + Terraform | $0 | $20 |
| **Total** | | **~$109/mo** | **~$1,450/mo** |

### B. Cost Comparison vs. Competitors (1-Year TCO, 500 Students)

| Platform | Annual Cost | Per-Student/Year |
|----------|-------------|------------------|
| **Learnworld (Pro)** | **$348** | **$0.70** |
| Teachable (Pro) | $1,428 | $2.86 |
| Kajabi (Basic) | $1,068 | $2.14 |
| LearnWorlds (Pro) | $1,188 | $2.38 |
| Thinkific (Start) | $1,188 | $2.38 |
| Moodle (self-hosted) | $8,000-15,000 | $16-30 |
| Canvas (SaaS) | $25,000-50,000 | $50-100 |

### C. Multi-Tenant Database Schema (Core)

```sql
-- Tenants
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  plan_id TEXT NOT NULL DEFAULT 'free',
  settings JSONB DEFAULT '{}',
  custom_domain TEXT,
  region TEXT DEFAULT 'us-east-1',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users (auth handled by Supabase Auth)
CREATE TABLE tenant_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'student',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, user_id)
);

-- Courses
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'draft',
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, slug)
);

-- Lessons (JSON-native content)
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  course_id UUID NOT NULL REFERENCES courses(id),
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  content JSONB DEFAULT '{}',
  position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Student Knowledge Model
CREATE TABLE student_knowledge (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  user_id UUID NOT NULL,
  course_id UUID REFERENCES courses(id),
  bkt_state JSONB DEFAULT '{}',
  dkt_state JSONB DEFAULT '{}',
  concept_embeddings JSONB DEFAULT '[]',
  interaction_history JSONB DEFAULT '[]',
  affective_metrics JSONB DEFAULT '{}',
  knowledge_graph JSONB DEFAULT '[]',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Progress
CREATE TABLE lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  user_id UUID NOT NULL,
  lesson_id UUID NOT NULL REFERENCES lessons(id),
  status TEXT DEFAULT 'not_started',
  score NUMERIC,
  time_spent INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enforce RLS on all tables
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_knowledge ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY tenant_isolation ON courses
  FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

CREATE POLICY tenant_isolation ON lessons
  FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

CREATE POLICY tenant_isolation ON student_knowledge
  FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

CREATE POLICY tenant_isolation ON lesson_progress
  FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);
```

### D. Key Performance Targets

| Metric | Target (Launch) | Target (1 Year) | Target (3 Years) |
|--------|----------------|----------------|-----------------|
| **API Latency (p99)** | < 100ms | < 50ms | < 20ms |
| **Page Load Time** | < 2s | < 1s | < 0.5s |
| **Video Start Time** | < 3s | < 1s | < 0.5s |
| **Uptime** | 99.9% | 99.95% | 99.99% |
| **Offline Capability** | Basic | Full (Android), Limited (iOS) | Full (all platforms) |
| **Concurrent Users** | 1,000 | 10,000 | 100,000 |
| **Tenants** | 100 | 1,000 | 10,000 |
| **Time to Course Create** | < 5 min | < 2 min | < 30 sec (AI-generated) |

---

*End of Learnworld Futuristic Architecture Blueprint v1.0*
