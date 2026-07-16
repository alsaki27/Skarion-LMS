# Skarion Accounting Track — Project Handover
**Date:** July 15, 2026 (see update below)
**Status:** Active development — latest code pushed ✅  
**Prepared for:** Next developer / Nuzhat / content team

---

## 📌 Update — July 16, 2026

Two new planning documents were added at the repo root. Read them before starting new work — this handover's own "known issues" list below is now partially stale (several items it flags have already been fixed; treat this file as historical context, not current truth, and defer to the two docs below for what's actually next):

1. **[`FIX_IT_PLAN.md`](claude-made-course/FIX_IT_PLAN.md)** (in `claude-made-course/`) — a 30-item, 6-tier professionalization plan for the *current static site*: the sidebar UX (reported broken — clicking a module navigates instead of expanding it, no completion state, no type icons, hardcoded colors off the design-token system), a CDN reliance risk (`jspreadsheet` loaded from `bossanova.uk` at runtime — breaks under most corporate LMS iframe CSPs), stale build artifacts, and SkarionBooks gaps. **GLM is executing Tier 1 (the sidebar) now** — see `claude-made-course/GLM_INSTRUCTIONS.md` for the exact brief handed to it.
2. **[`PHASE_1B_ACCOUNTING_TRACK_PLATFORM_MIGRATION.md`](PHASE_1B_ACCOUNTING_TRACK_PLATFORM_MIGRATION.md)** (repo root, alongside the `PHASE_1`–`PHASE_4` files) — the bigger structural fix: this course is currently hardcoded (`content.json` hand-edited by whoever can write JSON → a Python build script → one static HTML file), with no real instructor/student/admin roles, no server-side submission storage, no file-upload UI. This 30-chunk plan migrates the existing 171-chunk, 15-module course onto the real platform already specced in `PHASE_1_MVP_FOUNDATION.md` (Neon + Supabase Auth + R2, 5-tier RBAC) — adding the 14 accounting-specific interactive block types (journal-entry builder, spreadsheet lab, drag-and-drop, etc.) that plan didn't originally cover, plus a no-code Course Builder UI so an instructor never has to touch JSON again. **Nothing gets rebuilt from scratch** — it's an import/migration of the existing content and files, not a rewrite.

Suggested reading order for whoever picks this up next: `FIX_IT_PLAN.md` → `GLM_INSTRUCTIONS.md` → `PHASE_1B_ACCOUNTING_TRACK_PLATFORM_MIGRATION.md`.

---

## 🔗 Key Links

| Resource | Link |
|---|---|
| **GitHub Repo** | https://github.com/alsaki27/Skarion-LMS |
| **Local Preview** | http://localhost:5059/index.html (run command below to start) |
| **SCORM Package** | `claude-made-course/scorm-packages/Skarion-Accounting-Track-Master.zip` |
| **Course Blueprint (30 chunks)** | `course_blueprint.md` (in this brain folder) |

> [!IMPORTANT]
> **The entire course is specced as 30 chunks across 9 modules.** Every module, every topic, every quiz question, every journal entry scenario, and every interactive element type is fully described in:
> 
> 📄 **`claude-made-course/COURSE_BLUEPRINT_30_CHUNKS.md`** — in the repo root, committed to GitHub.
> 
> The next developer's job is to write `content.json` files for each module following that blueprint exactly. They do not need to make any structural decisions — everything is already decided. They just need to write the JSON.

### To start local preview
```powershell
cd "C:\Users\sakis\Documents\Claude\Skarion-LMS-work\Skarion-LMS\claude-made-course\master-course"
python -m http.server 5059
# Then open http://localhost:5059/index.html
```

### To let a friend access it (same local network)
```powershell
# Find your local IP:
ipconfig  # look for IPv4 Address e.g. 192.168.1.45
# They visit: http://192.168.1.45:5059/index.html
```

---

## 📁 Repo Structure — What Lives Where

```
Skarion-LMS/
│
├── courses/accounting-track/          ← NUZHAT'S ORIGINAL WORK (source material)
│   ├── 00-course-design/              ← Course backbone spec
│   ├── 01-job-market-research/        ← Job market analysis (needs rebuild per feedback)
│   ├── 02-quickbooks-online-lab/      ← FULL REDO REQUIRED (kaizen/Taka screenshots)
│   ├── 03-core-accounting-practice/   ← STRONG — AR_Invoices, Skarion P&L, exercises
│   ├── 04-bank-reconciliation-lab/    ← STRONG — 3 months of real bank statements (.xlsx)
│   ├── 05-accounts-payable-simulation/← STRONG — 30 invoices, control log, 3-way match
│   ├── 06-interview-preparation/      ← Interview Cheat Sheet + 126 Question Bank
│   ├── 07-excel-toolkit/              ← 5 Excel templates (Bank Rec, AR Aging, AP Aging, etc.)
│   ├── 08-payroll-fundamentals/       ← US Payroll reference sheet
│   ├── 09-month-end-close/            ← Month-end close playbook
│   ├── db/                            ← SQLite content database (schema.sql, skarion_accounting_track.db)
│   ├── feedback-for-nuzhat/           ← Full review & edit notes from course director
│   └── shared/
│       └── MASTER_COMPANY_PROFILE.md  ← THE SINGLE SOURCE OF TRUTH for company data
│
├── claude-made-course/                ← THE INTERACTIVE WEB COURSE (what the engine builds)
│   ├── engine/
│   │   ├── build_course.py            ← BUILD SCRIPT: reads all content.json → outputs master index.html
│   │   ├── player.js                  ← COURSE PLAYER: renders chunks, sidebar, quizzes, journal entries
│   │   ├── template.html              ← HTML shell that player.js and theme.css get injected into
│   │   ├── theme.css                  ← All styling for the course UI
│   │   └── scorm-api.js               ← SCORM 1.2 API bridge (tracks progress to LMS)
│   │
│   ├── modules/                       ← ONE FOLDER PER MODULE — this is where content lives
│   │   ├── 01-intro-and-market/
│   │   │   └── content.json           ← Module 01 content (expanded, prestige theory restored)
│   │   ├── 02-core-accounting-practice/
│   │   │   └── content.json           ← Module 02 (NEEDS EXPANSION per blueprint)
│   │   ├── 03-ap-and-payroll/
│   │   │   └── content.json           ← Module 03 (NEEDS RESTORATION — Skarion Engineering tone stripped)
│   │   ├── 04-ar-and-billing/
│   │   │   └── (EMPTY — write content.json per blueprint Chunks 13–16)
│   │   ├── 05-bank-reconciliation-lab/
│   │   │   └── content.json           ← Module 05 (GOOD — add Cash Posting chunks per blueprint)
│   │   ├── 06-month-end-close/
│   │   │   └── content.json           ← Module 06 (needs expansion per blueprint Chunks 21–23)
│   │   ├── 07-advanced-excel/
│   │   │   └── content.json           ← Module 07 (partially done — expand per blueprint Chunks 24–25)
│   │   ├── 08-quickbooks-lab/
│   │   │   └── content.json           ← Module 08 SkarionBooks lab
│   │   └── 09-interview-prep/
│   │       └── content.json           ← Module 09 (STRONG — strongest existing module)
│   │
│   ├── skarionbooks/                  ← QUICKBOOKS SIMULATOR (replaces paid QBO)
│   │   ├── index.html                 ← Full SPA — Chart of Accounts, Journal Entries, Reports
│   │   ├── app.js                     ← All SkarionBooks logic
│   │   └── style.css                  ← SkarionBooks styling
│   │
│   ├── slide-decks/                   ← PowerPoint exports (one per original module) — for team manual editing
│   ├── master-course/                 ← LOCAL PREVIEW BUILD OUTPUT (rebuilt by build_course.py)
│   │   ├── index.html                 ← The compiled course (open this in browser)
│   │   └── skarionbooks/              ← Copy of SkarionBooks for local linking
│   │
│   └── scorm-packages/                ← FINAL DELIVERABLE ZIPS
│       └── Skarion-Accounting-Track-Master.zip  ← Upload this to any SCORM LMS
│
├── research/                          ← LMS platform research (LearnWorlds, feature dimensions)
└── README.md
```

---

## 🏗️ How the Engine Works

The build pipeline is simple and modular:

```
content.json files (per module)
        ↓
  build_course.py   (reads all modules/, injects into template)
        ↓
  master-course/index.html   (single HTML file, fully self-contained)
        ↓
  player.js   (renders chunks dynamically based on chunk "type" field)
```

### To rebuild after editing any content.json:
```powershell
cd "C:\Users\sakis\Documents\Claude\Skarion-LMS-work\Skarion-LMS\claude-made-course"
python engine/build_course.py
```

### content.json chunk types (what player.js knows how to render):

| `"type"` value | What it renders | Satisfaction rule |
|---|---|---|
| `content` | Rich HTML with callouts, tables | Auto on scroll |
| `flip_cards` | Horizontal flip-card rail | All cards flipped |
| `quiz` | Gamified multiple-choice (shake/burst) | All answered |
| `journal_entry_builder` | DR/CR entry form with account dropdowns | Correct solution |
| `drag_and_drop` | Drag items to category buckets | All correctly placed |
| `exercise` | File download + text reflection | Text submitted |
| `hotspot` | Image with clickable coordinate points | All hotspots clicked |
| `timeline` | Horizontal step timeline | Auto on render |

---

## 🗂️ Nuzhat's Groundwork — What to Pull From

**The single most important file:** [`courses/accounting-track/shared/MASTER_COMPANY_PROFILE.md`](courses/accounting-track/shared/MASTER_COMPANY_PROFILE.md)

This is the canonical definition of the simulated company. Every module must use these details, not invent new ones.

### Key company data (from the Master Profile):
- **Company name:** Skarion Manufacturing LLC *(the simulation company — distinct from Skarion Engineering the real firm)*
- **Industry:** Small-medium US manufacturer, Virginia
- **Annual revenue:** ~$2M
- **Employees:** ~15
- **Bank:** First National (operating checking, savings, credit card)
- **Loan:** $250,000 term loan at 7.25%
- **Key vendors (established, use these not new ones):**
  - Global CAD Solutions — offshore drafting (use for AP labs)
  - Coastal Electric & Controls — the famous duplicate-deposit story ($9,503.60)
  - Valley Freight Lines — miscoded payment ($270 gap in bank rec)
  - Dominion Aluminum & Fasteners — 3-way match discrepancy ($38.00 vs $39.50/unit, invoice DAF-2601-014)
  - NOVA Packaging — missing PO scenario (invoice NPC-2601-011)
- **Key customers (for AR labs):**
  - Atlantic Fiber Co.
  - Southeast Broadband
  - TeleCom Builders
- **Key figures used across modules (ALWAYS use these numbers, never invent new ones):**
  - January bank rec adjusted balance: **$217,334.09** (later sessions used **$336,250.00** — pick one, the blueprint uses $336,250)
  - Duplicate deposit: **$9,503.60** (Coastal Electric, ref DEP-1005)
  - Monthly depreciation: **$5,208.10** across 10 fixed assets (or $1,000/month for simplified 5-workstation scenario)
  - Loan interest: **$1,510.42/month** ($250k × 7.25% ÷ 12)
  - AR balance: **$176,918.00** (original) / **$997,700** (expanded AR aging in new modules)

### Nuzhat's strongest deliverables to directly integrate:

| Nuzhat's file | Use in which module |
|---|---|
| `04-bank-reconciliation-lab/Bank_Statement_2026-01_January.xlsx` | Module 05, Chunk 20 Excel Lab |
| `04-bank-reconciliation-lab/Bank_Statement_2026-02_February.xlsx` | Module 05, Chunk 20 Excel Lab |
| `04-bank-reconciliation-lab/Bank_Statement_2026-03_March.xlsx` | Module 05, Chunk 20 Excel Lab |
| `05-accounts-payable-simulation/` (30 invoices) | Module 03, Chunk 10 AP lab |
| `06-interview-preparation/Interview_Cheat_Sheet_20_Questions.docx` | Module 09, Chunk 30 Exercise |
| `06-interview-preparation/Interview_Question_Bank_126Q.docx` | Module 09, Chunk 28 |
| `07-excel-toolkit/Template_01_Bank_Rec.xlsx` | Module 05, Chunk 20 |
| `07-excel-toolkit/Template_02_AR_Aging.xlsx` | Module 04, Chunk 15 |
| `07-excel-toolkit/Template_03_AP_Aging.xlsx` | Module 03, Chunk 10 |
| `07-excel-toolkit/Template_04_Expense_Report.xlsx` | Module 07, Chunk 24 |
| `07-excel-toolkit/Template_05_Month_End_Close.xlsx` | Module 06, Chunk 21 |
| `08-payroll-fundamentals/US_Payroll_Reference.xlsx` | Module 03, Chunk 11 |
| `09-month-end-close/Month_End_Close_Playbook.xlsx` | Module 06, Chunk 21 |
| `03-core-accounting-practice/AR_Invoices/` | Module 04, Chunk 14 |

---

## 📋 What Still Needs to Be Built (in priority order)

| # | Task | Effort | Notes |
|---|---|---|---|
| 1 | **Write Module 04 AR & Billing** `content.json` | High | Chunks 13–16 — fully spec'd in course_blueprint.md |
| 2 | **Expand Module 05 Bank Rec** with Cash Posting | Medium | Chunks 17–20 — add 2 new chunks to existing file |
| 3 | **Restore Module 02** Accounting Cycle content | High | Chunks 5–8 — was overwritten with OSP tone, needs prestige theory back |
| 4 | **Restore Module 03** AP & Payroll content | High | Chunks 9–12 — same issue, restore and expand |
| 5 | **Expand Module 06** Month-End Close | Medium | Chunks 21–23 — deeper adjusting entries, financial statements |
| 6 | **Fix Module 09** Interview Prep numbers | Low | Update Skarion Manufacturing numbers to match new modules |
| 7 | **`drag_and_drop` renderer** in player.js | Medium | The chunk type is referenced in blueprint but not yet coded in player.js |
| 8 | **`hotspot` renderer** in player.js | Medium | Referenced in Mod 03 and 04 blueprint — needs coding |
| 9 | **Download file routing** in player.js | Medium | Exercise chunks link to `/download/` paths that need to resolve to `courses/` folder files |
| 10 | **Sidebar overflow fix** | Low | Confirm `.sidebar { overflow-y: auto }` is in theme.css |

---

## 🔄 How Nuzhat's Files Connect to the Engine

The `courses/accounting-track/` folder and `claude-made-course/modules/` folder are **separate** right now. Here is the intended connection:

```
courses/accounting-track/04-bank-reconciliation-lab/Bank_Statement_January.xlsx
    ↓  referenced by  ↓
claude-made-course/modules/05-bank-reconciliation-lab/content.json
    → exercise chunk → "files": [{"label": "January Bank Statement", "href": "/download/05-bank-reconciliation-lab/Bank_Statement_January.xlsx"}]
    ↓  player.js resolves ↓
build_course.py copies the files/ assets into the SCORM zip
```

**Action needed:** Update `build_course.py` to also copy the relevant Excel files from `courses/accounting-track/` into the SCORM zip alongside the HTML. This makes them downloadable from within the course.

---

## ⚠️ Known Issues to Fix

| Issue | Location | Fix |
|---|---|---|
| Module 02 and 03 theory was overwritten with "OSP Engineering" HR onboarding tone | `modules/02/content.json`, `modules/03/content.json` | Rewrite using blueprint Chunks 5–12 |
| Module 04 folder is empty | `modules/04-ar-and-billing/` | Write content.json per blueprint Chunks 13–16 |
| Vendor names inconsistent across Nuzhat's files | `courses/accounting-track/` | Master Profile says resolve by adopting Module 04/07 names; Ridgeway=Valley Freight, Dominion Materials=Dominion Aluminum etc. |
| `drag_and_drop` and `hotspot` chunk types not coded | `engine/player.js` | Add renderers for these two types |
| Download paths in exercise chunks don't resolve | `player.js` + `build_course.py` | Add asset copy step in build script |
| Bank rec adjusted balance inconsistency ($217,334 vs $336,250) | Multiple modules | Decide on one canonical figure; blueprint uses $336,250 |
| Module 09 still references "Skarion Manufacturing LLC" | `modules/09-interview-prep/content.json` | Update company references; lab numbers are fine |

---

## 💻 Tech Stack

| Layer | Technology |
|---|---|
| Course engine | Vanilla JS (player.js) — no framework, no build tools needed |
| Styling | Vanilla CSS (theme.css) |
| Build system | Python 3 (build_course.py) — generates the single index.html |
| SCORM | SCORM 1.2 (scorm-api.js bridges to LMS) |
| SkarionBooks | Vanilla HTML/CSS/JS SPA |
| Version control | Git → GitHub (alsaki27/Skarion-LMS) |
| Local preview | Python `http.server` on port 5059 |
| LMS compatibility | Any SCORM 1.2-compatible LMS (Moodle, LearnWorlds, Docebo, TalentLMS, etc.) |

---

## 🎯 The Vision (for context)

The course puts the student in the role of Staff Accountant at **Skarion Manufacturing LLC** — a simulated $2M Virginia manufacturer. They don't just read theory. They:

1. Process real vendor invoices with a 3-way match
2. Reconcile actual bank statements against a messy GL
3. Build journal entries for payroll, depreciation, and loan interest
4. Generate and apply AR invoices through the revenue lifecycle
5. Close the month and produce financial statements
6. Walk out of the course able to say in an interview: *"I closed the books for a $2M manufacturer — here is the bank balance I reconciled, the duplicate deposit I found, and the exact journal entry I posted."*

The SkarionBooks simulator (custom QuickBooks clone) makes this possible without a $600/year QBO subscription per student.
