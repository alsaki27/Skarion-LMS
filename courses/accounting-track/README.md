# Skarion Accounting Track — US Accounting Job Simulation

**Goal:** a zero-experience candidate finishes this course able to say — truthfully — *"I handled the full accounting cycle for a $2M-revenue Virginia manufacturer: processed vendor invoices with 3-way match, reconciled monthly bank statements, ran payroll entries, closed the month, and produced the financial statements."* Then we place them in exactly that job.

**Method:** simulate a year, don't teach a semester. The student *is* the staff accountant for **Skarion Manufacturing LLC** (see [`shared/MASTER_COMPANY_PROFILE.md`](shared/MASTER_COMPANY_PROFILE.md)) and does the real work in QuickBooks Online + Excel.

## Module map

| # | Module | Maps to 10-day path | Status |
|---|---|---|---|
| 00 | [Course design](00-course-design/) — backbone spec | — | ✅ v1 |
| 01 | [Job market research](01-job-market-research/) | calibration input | 🔨 rebuild in progress (template ready) |
| 02 | [QuickBooks Online lab](02-quickbooks-online-lab/) | Day 1 | ❌ redo required (see feedback) |
| 03 | [Core accounting practice](03-core-accounting-practice/) | Days 2–7 | ✅ strong (2 errors fixed in this copy) |
| 04 | [Bank reconciliation lab](04-bank-reconciliation-lab/) | Day 4 | ✅ strong (Mar label fixed in this copy) |
| 05 | [Accounts payable simulation](05-accounts-payable-simulation/) | Day 2 | ✅ strong |
| 06 | [Interview preparation](06-interview-preparation/) | throughout + Day 10 | ⚠️ needs Skarion-specific answers |
| 07 | [Excel toolkit](07-excel-toolkit/) | Day 9 | ✅ good (T01 bug fixed in this copy) |
| 08 | [Payroll fundamentals](08-payroll-fundamentals/) | Day 5 | ✅ accurate |
| 09 | [Month-end close](09-month-end-close/) | Days 7–8 | ✅ solid |
| — | [shared/](shared/) — master company profile | everything | 🔨 needs completion |
| — | [db/](db/) — SQLite content store | LMS integration | ✅ generated |
| — | [feedback-for-nuzhat/](feedback-for-nuzhat/) | — | 📋 review deliverables |

## What changed vs. the original `Course Dev ACT` folder
1. Files reorganized into per-module folders with descriptive names (no more `Assignment N_...` prefixes).
2. **Fixes applied in this copy** (originals untouched):
   - Solution key: duplicate-deposit correcting entry now debits **1100 Accounts Receivable** (was: Sales Revenue — a GAAP error); employer-benefits assumption ($350/employee/mo) now stated in both exercise and key; FUTA/SUTA 1.2% flagged as a training simplification.
   - Excel Template 01: added the missing **"Less: Duplicate Book Entries"** row — the reconciliation can now actually reach zero.
   - March bank statement: duplicate-entries row labeled **(+/-)**.
   - Template 04: added the missing **vendor spend chart** (3rd chart).
   - Invoice 028 PDF: double "Assignment 5_" prefix removed.
   - New structured Assignment 1 workbook with the required columns and auto-calculating Summary sheet.
3. New shared **master company profile** to end the three-different-Skarions problem.
4. `db/` contains a SQLite content store of the whole course (modules → lessons → assignments → resources → objectives) for LMS import.

## For Nuzhat
Start at [`feedback-for-nuzhat/FEEDBACK_FOR_NUZHAT.md`](feedback-for-nuzhat/FEEDBACK_FOR_NUZHAT.md) (module-by-module edit notes), then [`JOB_MARKET_RESEARCH_2026.md`](feedback-for-nuzhat/JOB_MARKET_RESEARCH_2026.md) (what the July 2026 market changes) and [`NEXT_STEPS.md`](feedback-for-nuzhat/NEXT_STEPS.md) (what to build next, in order).
