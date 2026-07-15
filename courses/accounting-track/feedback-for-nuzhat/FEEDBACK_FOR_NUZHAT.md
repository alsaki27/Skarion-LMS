# Accounting Track V1 — Full Review & Feedback for Nuzhat

**Reviewer:** Skarion course direction (July 2026)
**Scope:** Every deliverable in `Course Dev ACT` was opened and inspected in full — every Word doc read end-to-end, every Excel formula traced, all 30 invoice PDFs' math recomputed, and the bank reconciliations re-verified by hand. Job-market claims were re-checked against live July 2026 data.

---

## The headline

Nuzhat, the majority of this work is genuinely strong — in several places stronger than the spec required. Assignments 3, 4, 5, and the Excel templates are near-professional quality: internally consistent, mathematically clean, and built with real teaching intent (instructor keys, seeded discrepancies, working formulas). That is the hard part of course-building, and you did it well.

Two deliverables, however, miss the brief badly (Assignment 2 and Assignment 1), there are two genuine accounting errors in the Assignment 3 solution key that must be fixed before any student sees it, and there is one systemic issue — inconsistent company data across files — that quietly undermines the course's core promise ("one continuous simulated company = one continuous true story").

**Grade by module:**

| Module | Verdict |
|---|---|
| A1 — Job postings analysis | ❌ Rebuild required |
| A2 — QuickBooks report + BS/P&L | ❌ Full redo required |
| A3 — Practice exercise sheet | ✅ Excellent (strongest doc) |
| A3 — Solution key | ⚠️ Accurate overall, 2 real errors |
| A4 — Bank statements ×3 | ✅ Excellent (strongest deliverable) |
| A5 — 30 invoices + control log | ✅ Excellent (best-designed) |
| A6 — Interview question bank | ⚠️ Complete but generic answers |
| A7 — 5 Excel templates | ⚠️ Very good, 1 structural bug |
| A8 — Payroll reference sheet | ✅ Accurate, needs 1 cross-reference |
| A9 — Month-end close playbook | ✅ Solid, needs Skarion tie-in |
| 20-question cheat sheet | ✅ Full spec compliance |

---

## 1. Assignment 2 — QuickBooks Report + kaizen BS/P&L ❌ REDO

This is the one deliverable that fails outright, and it's also the most visible one to students.

**What's wrong:**
- The QBO company in every screenshot is named **"kaizen"**, denominated in **Bangladeshi Taka**, with customers named "tahmid," "jude," "mbappe," "messi." The spec is a **US**, **USD**, Virginia manufacturer. A student practicing on this cannot tell a US interview story from it.
- The numbers are impossible: a bank-reconciliation beginning balance of **৳676,276,796**, a ৳250,000,000 "interest" deposit, a ৳500,000 bank service charge, and a P&L showing $10,500 of income against $1,240,200 of expenses (including a $1,000,000 monthly rent line). The exported Balance Sheet shows ~$675.7M of total assets for what's supposed to be a $2M-revenue company.
- The Balance Sheet/P&L exports contain **no COGS, no Inventory, no AR/AP, no Fixed Assets, no Loan** — none of the accounts a manufacturer has. They're default QBO demo data ("sales1", "sales 2", "Opening Balance Equity").
- Screenshots are raw full-desktop captures with your personal browser tabs visible (Facebook etc.). Crop to the QBO window only.
- Two deliverable elements the backbone explicitly requires are missing entirely: **"your own notes on what was confusing or easy"** and **"a list of most common mistakes you made or almost made."** Those reflection notes are actually the most valuable part of this assignment — they become the course's "watch out for this" callouts.

**How to redo it (est. 3–4 hours):**
1. Start a fresh QBO trial. Company name: *Skarion Manufacturing LLC*. Locale/currency: **US / USD**. Fiscal year Jan–Dec, accrual basis.
2. Use the vendor list from your own Assignment 5 control log and realistic amounts from your own Assignment 3 exercise (they're good!). Enter 5 bills, 5 invoices, 5 payments from that data.
3. Reconcile one month using your own Assignment 4 January statement.
4. Screenshot each step, cropped, and write 1–3 "what confused me / what I almost got wrong" notes per task.
5. Re-export the P&L and Balance Sheet — they should now look like a small manufacturer and roughly cohere with the Assignment 3 opening balances.

---

## 2. Assignment 1 — Job Postings Analysis ❌ REBUILD

**What's wrong:**
- The spec asks for structured columns per posting (software, skills list, education, experience required, CPA mentioned Y/N, "month-end close" mentioned Y/N, "reconciliation" mentioned Y/N). Your file has 6 columns, with requirements and responsibilities pasted as paragraph blobs — the roll-up statistics the assignment exists to produce can't be computed from it.
- There is **no summary sheet** at all (spec: most common titles, top-10 software, top-15 skills, average salary, % requiring 0–1 years).
- The population is wrong. The list includes an **FBI Special Agent** posting, a community-college **Accounting Instructor**, an **Assistant Treasurer (5–10 yrs)**, an **Accounting Lead (5+ yrs)**, Senior Tax Accountant, and Audit Senior (2–6 yrs). The assignment is specifically about **entry-level (0–1 yr)** staff accountant / AP / AR / junior accountant / junior analyst roles, because the whole course is calibrated against what *those* postings ask for.

**How to fix (est. 3–4 hours):** A rebuilt workbook with the correct column structure, dropdown validation, and a formula-driven Summary tab is provided at `01-job-market-research/Skarion_ACT_Job_Postings_Analysis_TEMPLATE.xlsx` — refill it with 50 genuinely entry-level postings. Keep any rows from your original list that qualify (roughly a third do).

---

## 3. Assignment 3 — Practice Exercise + Solution Key ⚠️ TWO ERRORS TO FIX

The exercise sheet is the **strongest document in the set**: 233 lines of internally consistent company data with deliberately seeded discrepancies (PO mismatch, duplicate deposit, transposed payment, missing accrual) — exactly the "true interview story" raw material the course promises. The solution key was hand-verified: AP totals, 5.3% VA sales tax, 2/10 Net 30 discount math, AR aging, all 10 assets' depreciation (including the in-service-by-the-15th rule), loan interest, and a bank reconciliation converging on $217,334.09 from both directions — **all correct**. Careful work.

Two real errors, both in the solution key:

**Error 1 — Underivable benefits number.** The key shows *"Employer benefits expense: $5,250.00"*, but the exercise's payroll source data only gives employee-side 401(k) and health deductions. There is no employer contribution rate anywhere in the packet — a student cannot derive $5,250 from what they're given (it implies an undisclosed $350/employee × 15). **Fix:** add "Employer benefits contribution: $350/employee/month" to the exercise's payroll source data, or delete the line from the key.

**Error 2 — Wrong journal entry (GAAP mechanics).** For the duplicate-deposit correction the key says *Debit 4000 Sales Revenue / Credit 1000 Operating Checking $9,503.60*. Debiting revenue for a duplicated **cash recording** is incorrect — revenue was never overstated; the duplicate deposit incorrectly cleared the customer's invoice twice. Correct entry: **Debit Accounts Receivable / Credit Cash $9,503.60** (reinstate the receivable). This one matters because it's precisely the kind of story a student will retell in an interview — if they retell the wrong entry, a competent interviewer will catch it.

**Also add one footnote:** the exercise uses a flat, uncapped "FUTA/SUTA training rate of 1.2%," but your own Assignment 8 correctly teaches the real mechanics (0.6% net FUTA on first $7,000; ~2.5% VA SUTA on first $8,000). Neither document flags the other. A student who quotes "1.2% FUTA/SUTA" in an interview as if it were real gets embarrassed. Add: *"1.2% is a simplified flat training rate for this exercise only — see the Payroll Reference Sheet for the real wage-base mechanics."*

---

## 4. Assignment 4 — Bank Statements ✅ EXCELLENT (one label fix)

This is the strongest deliverable in the whole package. All three months verified by hand:
- Month-to-month continuity is perfect (Jan ending $107,993.63 = Feb starting; Feb ending $143,559.16 = Mar starting).
- Every seeded problem reconciles exactly to zero: Jan (outstanding check #1018 $4,925; duplicate GL deposit DEP-1005 $6,800; unrecorded $35 fee), Feb (rent $12,800 vs $12,750; unrecorded interest $18.75; outstanding check #1042 $3,640), Mar (duplicate check #1052 $735; deposit DEP-3007 $7,520 vs $7,250; unentered ACH-INS $1,280).

**One fix:** in the **March** Reconciliation Worksheet, the "Less: duplicate book entries" row needs a **"(+/-)"** in its label. March's duplicate is a duplicated *debit* (unlike January's duplicated credit), so the worksheet only balances if the student enters a negative number there — which contradicts the general "use positive numbers" instruction. (Fixed in the reorganized copy; mirror it in your source file.)

---

## 5. Assignment 5 — Vendor Invoices + Control Log ✅ EXCELLENT

Best-designed deliverable in the set. All 30 invoices' arithmetic recomputed — zero errors, to the penny. All seven required variety types present and documented in the Instructor Key. The VA sales-tax treatment (5.3% on tangible goods only, service/labor lines excluded) is *correct* — a sophisticated touch most course-builders would get wrong. The "NOVA Packaging vs NOVA Industrial Waste" trap (two different companies sharing a name fragment) is realistic and clever.

Three small items:
1. **Rename** `Assignment 5_Assignment 5_SMI_AP_Invoice_028_...pdf` — the prefix got typed twice. (Renamed in the reorganized copy.)
2. **Category balance:** price discrepancies (2/30), true missing-PO holds (2/30), and duplicates (2/30) are thin vs. their real-world frequency. Consider adding ~3 more invoices weighted toward price discrepancies.
3. The printed "Training Notice — fictional" line on every invoice is prominent enough to break immersion. Consider moving it to a small footer or light watermark.
4. (Optional realism) Duplicate case #021 has a different date than #001 (Jan 29 vs Jan 5). A literal duplicate resend usually keeps the original invoice date — the vendor is re-sending the same document. Keeping the date identical makes the "same invoice number + same date + same amount" detection pattern cleaner.

---

## 6. Assignment 6 + Cheat Sheet — Interview Prep ⚠️ ONE SYSTEMIC UPGRADE

The counts check out: **126 questions** (56 technical / 30 behavioral / 20 software / 20 scenario) vs. the 120+ required, with a scoring rubric. The 20-question cheat sheet matches the backbone's list **verbatim and in order**. Spot-checked technical content is accurate.

**The gap:** your own "Answer style rule" says every good answer needs *"a clear example from the simulation"* — but the large majority of technical answers are generic textbook explanations with no Skarion numbers. This is the single biggest missed opportunity in the whole course, because **specific numbers are the entire point of the simulation**. The data already exists in your other files; the answers just don't cite it.

**Fix pattern (apply to at least the 56 technical answers and cheat-sheet Q1/Q8/Q19):**
- Generic: *"When I find a reconciliation discrepancy, I trace it to the source document..."*
- Skarion-specific: *"In my January close at Skarion Manufacturing, the bank statement and ledger were off by $6,800 — a customer deposit recorded twice as DEP-1005. I traced it, reversed the duplicate against AR, and documented it in the rec memo. Adjusted balance came to $217,334.09."*

Every number in the second version comes from files you already built. That's what makes the story credible and *rehearsable*.

---

## 7. Assignment 7 — Excel Templates ⚠️ ONE REAL BUG + TWO GAPS

All five templates use genuine working formulas (SUMIFS, COUNTIFS, nested IFs, TEXT match-keys) — not static values pretending to be templates. AR/AP aging bucket math verified correct. The close checklist's 30 tasks across 15 areas exceed spec. Good work.

1. **Template 01 (Bank Rec) — structural bug, must fix:** the reconciliation section has **no line item for duplicate book entries**, so the $4,200 seeded duplicate deposit can never be corrected — the Reconciliation Difference is stuck at −$4,200 no matter what the student does. Your own Assignment 4 worksheets have this row; the template just missed it. (Fixed in the reorganized copy: added a "Less: duplicate book entries" row wired to the duplicate-flagged GL rows.)
2. **Template 04 (Expense Dashboard):** spec asks for charts by category, vendor, **and** month — the vendor table exists but has no chart (2 of 3 charted). Also, there are zero native PivotTables in the file; everything is SUMIFS-built. Functionally fine, but Day 9 of the course *teaches pivot tables* — students should see at least one real PivotTable modeled in the flagship dashboard.
3. **(Systemic — see §8)** the customer/vendor names here don't match the other assignments.

---

## 8. The systemic issue: three different "Skarions" 🔴 IMPORTANT

Each file family invented its own company data pool:
- Assignment 4 bank statements: "Blue Ridge **Fixtures Inc.**"
- Assignment 7 AR template: "Blue Ridge **Retail Fixtures**"
- Assignment 5 invoices: "Blue Ridge **Industrial Plastics**" (a different company altogether)

The backbone's design (Assignment 3 of the spec) calls for **one canonical company profile** — 20 named vendors, 30 named customers, 15 employees, one loan, 10 assets — reused in *every* exercise. That's what turns nine separate assignments into "a year at one company," which is the product. Right now a sharp student would notice their employer's customer list changes between exercises.

**Fix:** a master list has been started for you at `shared/MASTER_COMPANY_PROFILE.md`, seeded from your Assignment 5 vendor list (the most complete one) and Assignment 3's employees/assets/loan. Adopt it as the single source of truth, then do a rename pass on the bank statements and the AR/AP/expense templates. Est. 2–3 hours.

---

## Fix priority (in order)

1. **Redo Assignment 2** in a USD Skarion company (3–4 h) — blocks everything QBO-related.
2. **Fix the two solution-key errors** + FUTA footnote (30 min) — accuracy blockers.
3. **Fix Template 01's missing duplicate row** + March "(+/-)" label (done in reorganized copy — mirror in your sources, 20 min).
4. **Rebuild Assignment 1** using the provided template (3–4 h).
5. **Skarion-ify the interview answers** in A6 + cheat sheet (3–4 h) — biggest value-per-hour upgrade.
6. **Master company profile alignment pass** (2–3 h).
7. Nice-to-haves: vendor chart + PivotTable in T04, 3 more discrepancy invoices, watermark the training notice.

See `NEXT_STEPS.md` for what's missing from the course as a whole (beyond fixing existing files) and `JOB_MARKET_RESEARCH_2026.md` for what the July 2026 market data changes.
