# Skarion Accounting Track — Phase 2 Blueprint
### Chunks 31–60 · Video Scripts, Deep Scenarios & Learning-Science Layer

> **For the implementing developer/AI reading this:**
> Phase 1 (Chunks 1–30) built the core accounting curriculum in `content.json` files per module.
> Phase 2 adds three things Phase 1 doesn't have:
> 1. **Video scripts** — narrated explainers with B-roll/image direction. These are the "watch first" entry points into the hardest concepts.
> 2. **Spaced repetition review sessions** — interleaved checkpoints that deliberately force recall of earlier material.
> 3. **Advanced scenario labs** — messy, ambiguous, real-world problems that go far beyond the clean Phase 1 exercises.
>
> **Total course target: ≤ 40 hours.**
> Time budget breakdown:
> | Layer | Count | Avg time | Total |
> |---|---|---|---|
> | Phase 1 chunks (30) | 30 | ~45 min | ~22.5 hrs |
> | Phase 2 video scripts (12) | 12 | ~20 min watch | ~4 hrs |
> | Phase 2 review sessions (6) | 6 | ~30 min | ~3 hrs |
> | Phase 2 deep scenarios (8) | 8 | ~60 min | ~8 hrs |
> | Phase 2 career/soft skills (4) | 4 | ~30 min | ~2 hrs |
> **Total: ~39.5 hours** ✅
>
> **Video script format used throughout:**
> Each script uses a two-column AV format: narration on the left, visual direction on the right.
> Videos should be 3–5 minutes. One concept per video. Never try to cover more than one idea.
> Reference images are described for the video creator — use Unsplash, Pexels, or create in Canva/Figma.

---

## SECTION A — VIDEO SCRIPTS (Chunks 31–42)
*12 explainer videos. Each becomes a `video` chunk type in the SCORM engine.*
*For the engine developer: add a `"type": "video"` chunk renderer that embeds an `<video>` or `<iframe>` tag and marks satisfied when playback reaches 80% completion.*

---

### Chunk 31 — VIDEO: "Why Accounting Exists" (Module 01 opener)
**Placement:** Before Chunk 1. The very first thing a student sees.
**Duration target:** 3 minutes
**Learning objective:** Student understands that accounting is a trust system, not a data entry job.

#### Script (AV Format)

| TIME | NARRATION | VISUAL DIRECTION |
|---|---|---|
| 0:00–0:10 | *"Every business decision — every hire, every loan, every expansion — is made based on numbers. Your job is to make sure those numbers are right."* | Black screen → text appears word by word |
| 0:10–0:35 | *"Accounting isn't about debits and credits. It's about trust. A bank lends $500,000 based on a balance sheet you prepared. A CEO decides whether to hire ten more engineers based on a P&L you closed. If your numbers are wrong, real people are hurt by real decisions."* | **B-roll:** Close-up of a signed loan document. Then a LinkedIn job posting. Then a balance sheet printout with a red circle around a number. |
| 0:35–1:20 | *"This is why accounting jobs — even entry-level ones — require precision under pressure. And it's why every company, from a two-person startup to a Fortune 500, has someone who does exactly what you're about to learn."* | **B-roll:** Office environment, hands typing on a laptop, CFO presenting to a board (stock footage). Reference image: org chart showing accounting department reporting structure. |
| 1:20–2:00 | *"In this course, you are the Staff Accountant for Skarion Manufacturing — a $2 million Virginia manufacturer. You are not reading about accounting. You are doing it. Real invoices, real bank statements, real discrepancies that need to be found and fixed."* | **Screen:** Skarion Manufacturing LLC logo → montage of actual course materials: the bank statement Excel file, an invoice PDF, the SkarionBooks interface. |
| 2:00–2:40 | *"By the end of this course you will be able to say — truthfully — that you closed the books for a real company, reconciled bank statements, caught a $9,500 duplicate deposit, and ran a full payroll entry. That is not theory. That is experience."* | **B-roll:** Someone confidently presenting in a meeting. Then an interview handshake. |
| 2:40–3:00 | *"Let's get started. Module 1: The Accounting Profession — what it actually is, and what employers are actually looking for."* | **Screen:** Module 1 title card with progress bar. |

**Research direction for implementing AI:**
- Search "what is accounting for beginners explainer" on YouTube to see the tone and pacing that lands well.
- The best reference is the first 3 minutes of any CPA firm's "What We Do" corporate video.
- **Reference image 1:** Org chart of a typical accounting department (Staff → Senior → Manager → Controller → CFO). Create in Canva or find on Google Images.
- **Reference image 2:** A clean balance sheet with key line items labeled (Assets, Liabilities, Equity). Skarion's balance sheet from the course materials works perfectly.

---

### Chunk 32 — VIDEO: "Accrual vs. Cash — The Most Important Concept in Accounting"
**Placement:** Module 02, before Chunk 5 (accounting cycle)
**Duration target:** 4 minutes
**Learning objective:** Student can correctly state when revenue and expenses are recognized under accrual accounting.

#### Script (AV Format)

| TIME | NARRATION | VISUAL DIRECTION |
|---|---|---|
| 0:00–0:20 | *"If you only understand one thing from this course, make it this: accounting records economic events when they happen — not when cash moves."* | Bold text on screen: **"Record when it happens. Not when cash moves."** |
| 0:20–1:10 | *"Here is a real example. Skarion completes a 500-mile fiber design package and delivers it to Atlantic Fiber Co. on January 28th. Atlantic Fiber doesn't pay until March 15th. Under cash accounting, we record $480,000 of revenue in March. Under accrual accounting — which is what GAAP requires — we record $480,000 of revenue in January, the day we delivered the work."* | **Animation:** Simple timeline showing Jan 28 delivery vs Mar 15 payment. Two parallel rows: "Cash Basis" (recording at March) vs "Accrual Basis" (recording at January). Animate them side by side. |
| 1:10–2:00 | *"Why does this matter? Because cash accounting lies. You could have a wildly profitable January in reality — you delivered millions of dollars of work — but your cash basis P&L shows almost nothing because no one paid you yet. Investors, banks, and your own CFO can't make good decisions from that."* | **Reference image:** Side-by-side Income Statement: Cash basis shows $0 revenue in January. Accrual basis shows $480,000. Same company, same month. Completely different picture. |
| 2:00–3:00 | *"The flip side is also true. If you prepay $36,000 for your annual Vetro license on January 1st, that is not a $36,000 expense in January. That $36,000 benefits your entire year. So accrual accounting says: record $3,000 per month as expense, for twelve months. The rest sits on your balance sheet as a Prepaid Asset until you've consumed it."* | **Animation:** Bar chart showing $36,000 on Jan 1 → broken into 12 equal $3,000 monthly bars labeled Feb through Dec. |
| 3:00–3:40 | *"This is called the matching principle — match your expenses to the revenue they helped generate. And it is the foundation of every adjusting entry you will ever make during month-end close."* | **Text on screen:** "Matching Principle: expenses belong in the same period as the revenue they help generate." |
| 3:40–4:00 | *"In the next section, we will walk through the full accounting cycle — how a source document becomes a journal entry, becomes a ledger balance, becomes a financial statement. Let's go."* | Module navigation forward prompt. |

**Research direction:**
- Look up "accrual vs cash accounting Khan Academy" — their animation style for this exact concept is the gold standard.
- **Reference image 1:** A simple T-account diagram showing Prepaid Software (Asset) being debited and Cash being credited.
- **Reference image 2:** Monthly amortization schedule table for the $36,000 Vetro license (Jan–Dec, $3,000/month).

---

### Chunk 33 — VIDEO: "How to Read a Chart of Accounts in 5 Minutes"
**Placement:** Module 02, before Chunk 6 (COA deep dive)
**Duration target:** 3.5 minutes

| TIME | NARRATION | VISUAL DIRECTION |
|---|---|---|
| 0:00–0:25 | *"The Chart of Accounts is the master list of every bucket that money can go into at a company. Every journal entry, every financial statement, every report — all of it traces back to this list. If you don't understand it, you can't do the job."* | Screen recording of QuickBooks/SkarionBooks COA screen opening. |
| 0:25–1:15 | *"Here is the pattern that never changes: accounts starting with 1 are Assets — things the company owns. 2s are Liabilities — things the company owes. 3s are Equity. 4s are Revenue. And 5 through 6 are Expenses. This numbering is not arbitrary — it maps directly to the accounting equation."* | **Animation:** The number ranges appearing one by one with labels. 1000s = 🏦 Assets. 2000s = 📋 Liabilities. 3000s = 💰 Equity. 4000s = 📈 Revenue. 5000-6999 = 📉 Expenses. |
| 1:15–2:30 | *"Let me show you Skarion Manufacturing's actual Chart of Accounts..."* [walk through key accounts one by one, explaining the purpose of each] | **Screen recording:** Scroll through Skarion's COA in SkarionBooks. Pause on notable accounts: 1200 Unbilled AR, 2100 Accrued Wages, 5100 COGS Subcontractors. |
| 2:30–3:15 | *"One thing interviewers always ask: what is the difference between a temporary account and a permanent account? Permanent accounts — Assets, Liabilities, Equity — carry their balance forward year after year. Temporary accounts — Revenue and Expenses — get zeroed out at year-end and their net balance flows into Retained Earnings."* | **Reference image:** Side-by-side table of Permanent (Balance Sheet) vs Temporary (Income Statement) accounts. |
| 3:15–3:30 | *"In the next section, you will do a drag-and-drop exercise with Skarion's actual transactions. Let's see if you can classify them correctly."* | Transition to Chunk 6 interactive. |

**Research direction:**
- Search "QuickBooks Online chart of accounts tutorial" — the UI walkthroughs there show exactly the kind of screen recording needed.
- **Reference image:** Skarion Manufacturing's COA exported as a clean table (pull from `shared/MASTER_COMPANY_PROFILE.md`).

---

### Chunk 34 — VIDEO: "The 3-Way Match — Why You Never Pay an Invoice on Faith"
**Placement:** Module 03, before Chunk 9 (AP workflow)
**Duration target:** 4 minutes

| TIME | NARRATION | VISUAL DIRECTION |
|---|---|---|
| 0:00–0:30 | *"The 3-way match is one of the most powerful internal controls in accounts payable. And it is also one of the most common interview questions for any entry-level accounting role. Here is exactly how it works."* | Text: "The 3-Way Match" with three icons: Purchase Order → Receiving Report → Vendor Invoice |
| 0:30–1:30 | *"You need three documents to agree before you can pay a vendor invoice. First, the Purchase Order — your company authorized the spend. Second, the Receiving Report — the goods or services were actually delivered. Third, the Vendor Invoice — the amount billed matches what was ordered and delivered. All three numbers have to align: quantity, unit price, total."* | **Animation:** Three overlapping circles (Venn diagram style). PO, Receiving Report, Invoice. Where all three overlap: "Pay it." Where only two overlap: "Hold it." |
| 1:30–2:30 | *"Let me show you a real example from Skarion's accounts payable files. Invoice DAF-2601-014 from Dominion Aluminum & Fasteners. The Purchase Order was approved at $38.00 per unit. But the invoice billed $39.50 per unit — a $126.36 overage on 84 units. The right move: hold the invoice and contact the vendor for a credit memo. Do not pay it."* | **Screen:** Show the actual Dominion invoice PDF from Module 05. Circle the $39.50 unit price. Show the PO price of $38.00. Highlight the $126.36 variance. |
| 2:30–3:20 | *"The 3-way match catches vendor billing errors, pricing changes that slipped through, duplicate invoices, and in worst-case scenarios, fraud. It only works if you actually do it on every invoice — not just the big ones."* | **B-roll:** Someone reviewing invoices at a desk with multiple monitors. |
| 3:20–4:00 | *"In the exercise coming up, you will get a batch of invoices and you need to decide: pay, hold, or escalate. Use the 3-way match. The answer is in the documents."* | Transition to Chunk 10 exercise. |

**Research direction:**
- The actual invoices in `courses/accounting-track/05-accounts-payable-simulation/` are the real reference material. Show those.
- **Reference image 1:** Annotated invoice showing which fields map to PO vs receiving vs invoice.
- **Reference image 2:** A simple decision flowchart: Does the invoice match the PO? → Y/N → Does the receiving report confirm delivery? → Y/N → Pay / Hold / Escalate.

---

### Chunk 35 — VIDEO: "How Bank Reconciliation Actually Works — The Two-Sided Method"
**Placement:** Module 05, before Chunk 17 (bank rec theory)
**Duration target:** 5 minutes

| TIME | NARRATION | VISUAL DIRECTION |
|---|---|---|
| 0:00–0:30 | *"'Walk me through a bank reconciliation.' This is the most common technical question in entry-level accounting interviews. After this video, you will have a real answer with a real dollar amount. Not a textbook definition — a specific, documented reconciliation you actually completed."* | Interview setting B-roll. Then text: "Most common interview question in entry-level accounting." |
| 0:30–1:30 | *"A bank reconciliation proves that your books and the bank's records show the same true cash balance — after accounting for timing differences. The bank doesn't know about the check you wrote yesterday. Your books don't know about the $18.50 of interest the bank credited this morning. These are not errors. They are expected."* | **Animation:** Two columns appearing side by side: "Bank Statement" and "Your Books." Items appearing in one but not the other, labeled "Timing Difference." |
| 1:30–3:00 | *"Here is the method. From the bank statement: start with the ending balance. Add any deposits in transit — payments you recorded that haven't hit the bank yet. Subtract any outstanding checks — payments the vendor hasn't cashed yet. This gives you the adjusted bank balance. From your books: start with the GL cash balance. Add any bank credits you haven't recorded yet — like interest. Subtract any bank fees you haven't recorded yet. This gives you the adjusted book balance. These two adjusted numbers must be identical. If they are not, there is a real error, and finding it is the job."* | **Screen recording:** Build the reconciliation worksheet live. Start with the two blank columns. Fill in numbers one by one as they're mentioned. Final line: Adjusted Bank $336,250 = Adjusted Book $336,250. ✓ |
| 3:00–4:00 | *"In Skarion's January reconciliation, the bank showed $312,450. The books showed $346,823.60 — a $34,373 gap. Four of those were timing differences. One was a real error: a $10,547 customer deposit had been entered twice in QuickBooks. The correcting entry: debit Accounts Receivable, credit Cash. The reconciliation then balanced to exactly $336,250."* | **Screen:** The actual January reconciliation worksheet being filled in. Circle the duplicate deposit. Show the correcting journal entry. |
| 4:00–4:30 | *"Notice we did not debit Sales Revenue — the sale was never overstated. We only debit AR, because the cash side was overstated. Details like that are what make an interviewer stop and actually believe you."* | Bold text: "Debit AR, not Revenue. The sale was never double-counted." |
| 4:30–5:00 | *"In the lab, you will reconcile three months of Skarion's actual bank statements. Each one has a seeded error. Find it, fix it, document it."* | Transition to Chunk 20 exercise. |

**Research direction:**
- The actual bank statement Excel files in `courses/accounting-track/04-bank-reconciliation-lab/` are the screen recording material.
- **Reference image:** The completed two-sided reconciliation table from the course blueprint (Chunk 19).
- Look up "bank reconciliation tutorial QuickBooks" on YouTube — the standard screen-recording style is exactly right here.

---

### Chunk 36 — VIDEO: "What Happens During Month-End Close — A Real Close, Step by Step"
**Placement:** Module 06, before Chunk 21
**Duration target:** 5 minutes

| TIME | NARRATION | VISUAL DIRECTION |
|---|---|---|
| 0:00–0:30 | *"Month-end close is when accounting stops being an ongoing data entry job and becomes a high-stakes deadline operation. Everything has to be done in the right order, on the right day, and nothing can be skipped."* | Calendar graphic: a month with Days 1-5 highlighted in sequence. |
| 0:30–2:00 | *"Here is Skarion's five-day close schedule. Day one: lock all timesheets and AP. Any invoice not entered by 5 PM goes into next month. Day two: post payroll, employer taxes, and all offshore contractor accruals. Day three: calculate work-in-progress, post depreciation, post the loan interest accrual. Day four: bank reconciliation, tie the AR subledger to the GL, tie the AP subledger to the GL. Day five: review the P&L against budget, produce the financial package, get controller sign-off."* | **Screen:** A close checklist — like a project management spreadsheet — with items being checked off one by one as they're mentioned. |
| 2:00–3:00 | *"The hardest part of month-end for a services firm is the adjusting entries — the journal entries you post for things that happened but haven't been invoiced yet. Your offshore drafting team worked 400 hours in January. The invoice won't arrive until February 4th. But the expense belongs in January. So on January 31st, you accrue it: debit COGS Subcontractors, credit Accrued Liabilities."* | **Animation:** Journal entry appearing: Dr COGS–Subcontractor $14,800 / Cr Accrued Liabilities $14,800. Then the income statement updating with January's correct expense figure. |
| 3:00–4:00 | *"Then on February 1st, you reverse that accrual. And when the invoice actually arrives on February 4th, you post it normally. The reversal ensures the expense doesn't get counted twice."* | **Animation:** Reversal entry appearing, then normal AP entry. Calendar showing the sequence. |
| 4:00–5:00 | *"The close playbook in your course materials lists every single entry you need to post during Skarion's January close. Your job in the exercise is to work through the playbook and post each entry in SkarionBooks — in the right order, with the right amounts."* | Show the Month_End_Close_Playbook.xlsx briefly. Transition to exercise. |

**Research direction:**
- The `courses/accounting-track/09-month-end-close/Month_End_Close_Playbook.xlsx` is the screen recording source material.
- **Reference image:** A clean close checklist table (Owner / Task / Due Date / Status / Supporting Doc).
- **Reference image:** The adjusting entry T-accounts for the 5 entries from Chunk 22 of Phase 1.

---

### Chunk 37 — VIDEO: "Excel for Accountants — The 3 Functions That Do 80% of the Work"
**Placement:** Module 07, before Chunk 24
**Duration target:** 4 minutes

| TIME | NARRATION | VISUAL DIRECTION |
|---|---|---|
| 0:00–0:30 | *"If you can only learn three Excel functions before your first accounting job, learn these: VLOOKUP, SUMIFS, and PivotTables. Everything else is optional. These three will handle 80% of the real work you will actually do in accounting."* | Text: Three functions listed. Not as a bullet list — as three bold cards on screen. |
| 0:30–1:30 | *"VLOOKUP — or its modern replacement XLOOKUP — is how you match data from two different tables. In accounting, the most common use: you have a 3,000-row expense report and a separate table of GL account numbers. VLOOKUP pulls the GL number into the right row automatically. Without it, you're doing that manually. For 3,000 rows."* | **Screen recording:** Show the Raw_Expense_Export.csv open in Excel. Show the GL_Mapping_Table.csv next to it. Type the VLOOKUP formula. Watch it fill in the GL codes across all rows. |
| 1:30–2:30 | *"SUMIFS adds up numbers that meet multiple conditions at once. 'Give me the total COGS for Project Alpha, in January, from Global CAD Solutions.' That is a SUMIFS with three criteria. The syntax: SUMIFS(sum range, criteria range 1, criteria 1, criteria range 2, criteria 2...)."* | **Screen:** Type a SUMIFS formula in Excel live. Show the criteria being added one by one. Show the result changing with each criteria added. |
| 2:30–3:30 | *"PivotTables are the fastest way to summarize large data sets. Drag Project Code to rows, Vendor Name to columns, Amount to values. In 10 seconds you have a summary that would take an hour to build with formulas."* | **Screen recording:** Create a PivotTable live from the offshore labor data. Show the drag-and-drop. Show the instant summary appearing. |
| 3:30–4:00 | *"In the Excel lab, you will get raw offshore drafting data — 1,200 rows. You will use all three of these to produce the project profitability summary. Start with VLOOKUP to tag the project codes. Then SUMIFS to sum by project. Then a PivotTable to present it."* | Transition to Chunk 24 lab. |

**Research direction:**
- Search "XLOOKUP tutorial 2024 accounting" and "SUMIFS multiple criteria" on YouTube — the screen recording approach from channels like Leila Gharani or ExcelJet is the gold standard.
- The actual `Raw_Expense_Export.csv` and `GL_Mapping_Table.csv` in `claude-made-course/modules/07-advanced-excel/` are the demo files.
- **Reference image:** Side-by-side of messy raw data vs clean PivotTable output.

---

### Chunk 38 — VIDEO: "How to Answer Any Accounting Interview Question"
**Placement:** Module 09, before Chunk 28
**Duration target:** 4 minutes

| TIME | NARRATION | VISUAL DIRECTION |
|---|---|---|
| 0:00–0:30 | *"Every candidate in your interview knows basic accounting. The question the interviewer is actually asking is: can you tell me a specific story from real work that proves it? That is the only thing that separates the people who get hired from the people who don't."* | Two-person interview scene (stock B-roll). |
| 0:30–1:30 | *"The framework is Context, Action, Result. Context: what company, what month, what situation. Action: what you did, what you checked, what you found. Result: what the correction was, what the effect was. Every answer you give in an accounting interview should fit this structure."* | **Text animation:** C → A → R appearing one at a time with definitions. |
| 1:30–2:30 | *"Here is the weak answer to 'Tell me about a time you found an error in the books': 'I'm very detail-oriented and I always catch errors.' That is a motivational poster. Here is the strong answer: 'During a bank reconciliation in January, QuickBooks showed $34,000 more cash than the bank statement. I compared deposits by date and amount, found a customer payment from Coastal Electric — $9,503.60 — that had been entered twice. I confirmed the bank only received it once, reversed the duplicate with a debit to AR and credit to Cash, and the reconciliation balanced to $336,250.' The second answer is unfakeable. That's the point."* | **Split screen:** Left = weak answer in grey text. Right = strong answer with the specific numbers highlighted in Skarion's brand color. |
| 2:30–3:30 | *"Notice three things about the strong answer: it has a specific dollar amount. It names the company and the document. And it gets the journal entry direction exactly right — debit AR, not Sales Revenue, because the sale was never double-counted. That level of detail tells the interviewer that you actually did this work."* | Zoom in on each of the three elements of the strong answer. |
| 3:30–4:00 | *"In the interview prep module, you will get 10 must-know questions with Skarion-specific answers. Practice saying them out loud. The goal is not to memorize — it is to internalize the structure so you can apply it to any question."* | Transition to Chunk 28. |

---

### Chunks 39–42 — VIDEO SCRIPTS (shorter, 2-3 min each)

**Chunk 39 — VIDEO: "Revenue Recognition in 3 Minutes (ASC 606)"**
- Placement: Module 04, before Chunk 13
- Key visual: The 5-step model as an animated funnel
- The hook: "A client signs a $2.4M contract. When do you record the $2.4M? The wrong answer costs companies millions in restatements."
- Cover: 5 steps of ASC 606 with the Skarion HLD/LLD contract as the example
- **Research direction:** Search "ASC 606 revenue recognition simple explanation" — CPA-firm explainer videos are the best reference. Look up Deloitte's ASC 606 overview video on YouTube.

**Chunk 40 — VIDEO: "Payroll — What Actually Gets Withheld and Why"**
- Placement: Module 03, before Chunk 11
- Key visual: A payroll check showing gross vs net with every deduction labeled
- The hook: "Gross pay is what the employee earns. Net pay is what they take home. The difference is your problem."
- Cover: Federal income tax, FICA (Social Security + Medicare), state taxes, employer match. Use the $79,167 Skarion payroll run.
- **Research direction:** IRS Publication 15 (Employer's Tax Guide) — free PDF, the authoritative source. Search "payroll journal entry W2 employee" for visual reference.

**Chunk 41 — VIDEO: "What is Accounts Receivable Aging and Why It Matters"**
- Placement: Module 04, before Chunk 15
- Key visual: The Skarion AR aging table (0–30, 31–60, 61–90, 90+)
- The hook: "A business can be profitable and still run out of cash. The AR aging report tells you why."
- Cover: How to read the aging table, what the 90+ bucket means for cash flow, DSO calculation with Skarion numbers
- **Research direction:** Search "accounts receivable aging report explained" — look at how CFO-level content channels present this. Use the `Template_02_AR_Aging.xlsx` as the screen recording material.

**Chunk 42 — VIDEO: "Bad Debt — Estimating What You Won't Collect (Allowance Method)"**
- Placement: Module 04, after Chunk 15
- Key visual: AR aging table with the allowance percentage applied to each bucket
- The hook: "GAAP doesn't let you wait until a customer files bankruptcy to record the loss. You estimate it every month."
- Cover: Allowance method vs direct write-off. The two journal entries (establish allowance, write off). The surprise recovery scenario from the blueprint.
- **Research direction:** "Allowance for doubtful accounts journal entry" — AccountingCoach.com has the cleanest visual explanation of the three entries (allowance, write-off, recovery).

---

## SECTION B — SPACED REPETITION REVIEW SESSIONS (Chunks 43–48)
*6 interleaved checkpoints that force recall of earlier material before moving forward.*
*Placement: at the START of Modules 03, 05, 06, 07, 08, 09 — before any new content.*
*For the engine developer: these are `"type": "review_quiz"` chunks. Same UI as the gamified quiz but the intro text explicitly says "Before we start, let's make sure the last module is locked in."*

---

### Chunk 43 — REVIEW: Modules 01–02 Recall (before Module 03 AP/Payroll)
**8 interleaved questions mixing Mod 01 and 02 content:**
1. Under accrual accounting, when is revenue from an HLD delivery recognized? *(Mod 01)*
2. What is the normal balance of an expense account — debit or credit? *(Mod 02)*
3. A $36,000 software license paid in January — what is the balance in Prepaid Software on March 31st? *(Mod 02 — answer: $27,000)*
4. What does the Chart of Accounts number range 2000–2999 represent? *(Mod 02)*
5. Name the five types of accounts and their normal balances. *(Mod 02)*
6. What does GAAP stand for and who writes it? *(Mod 01)*
7. A company records $500K of revenue in December but doesn't receive the cash until February. Which basis of accounting is this? *(Mod 01)*
8. What is the accounting equation? *(Mod 02)*

---

### Chunk 44 — REVIEW: Modules 01–03 Recall (before Module 05 Bank Rec)
**8 interleaved questions:**
1. What are the three documents required for a 3-way match? *(Mod 03)*
2. Skarion's $79,167 gross payroll has $21,056 of employee withholdings. What is the net pay entry credit to Cash? *(Mod 03 — $58,111)*
3. What is the journal entry to accrue $14,800 of offshore drafting labor at month-end? *(Mod 03)*
4. What is the difference between Accounts Payable and Accrued Liabilities? *(Mod 03)*
5. Where on the balance sheet does Accounts Receivable appear? *(Mod 02)*
6. A vendor invoices at $39.50/unit. Your PO was $38.00/unit. What do you do? *(Mod 03 — hold it)*
7. What account is debited when you record employer FICA tax expense? *(Mod 03)*
8. What is the accounting equation and how does a payroll entry affect it? *(Mod 02)*

---

### Chunk 45 — REVIEW: Modules 01–04 Recall (before Module 06 Month-End Close)
**8 interleaved questions mixing AR/billing with earlier content:**
1. Under ASC 606, which of the 5 steps triggers revenue recognition? *(Mod 04)*
2. A client prepays $120,000 before work begins. What is the credit? *(Mod 04 — Deferred Revenue)*
3. Skarion writes off TeleCom Builders' $112,700 balance. What is the journal entry? *(Mod 04)*
4. What is Days Sales Outstanding (DSO) and how is it calculated? *(Mod 04)*
5. What is the difference between Unbilled AR and regular AR? *(Mod 04)*
6. What is the allowance for doubtful accounts and why is it required by GAAP? *(Mod 04)*
7. A customer pays $190,000 of a $405,000 balance and disputes the rest. What do you record? *(Mod 05)*
8. What is the two-sided bank reconciliation method? *(Mod 05)*

---

### Chunk 46 — REVIEW: Full Mixed Recall (before Module 07 Excel)
**Timed speed drill: 10 questions, 60 seconds each**
*Format: student types the journal entry or selects the answer. Timer visible. Score tracked.*
1. Record a $7,200 offshore invoice (Dr/Cr)
2. Record a $36,000 annual software license payment (Dr/Cr)
3. Post January depreciation for 5 workstations @ $200/month each (Dr/Cr)
4. Accrue January loan interest: $500K @ 6.5% (Dr/Cr, amount = $2,708)
5. Record the month-end amortization of Prepaid Software for one month (Dr/Cr)
6. Correct a duplicate $9,503.60 customer deposit (Dr/Cr)
7. Record a $480K AR invoice issued to Atlantic Fiber (Dr/Cr)
8. Record Atlantic Fiber's wire payment of $479,975 (after $25 bank fee) (Dr/Cr)
9. Write off TeleCom Builders' $112,700 AR (Dr/Cr)
10. Establish the bad debt allowance for 1.5% of $997,700 AR (Dr/Cr, amount = $14,966)

---

### Chunk 47 — REVIEW: Scenario Judgment (before Module 08 SkarionBooks)
**5 scenario judgment questions — no multiple choice, student types the response**
1. *You are posting the AP batch and notice invoice #0891 is the same vendor, same amount, same date as invoice #0847 you posted two weeks ago. What do you do?*
2. *A client sends a wire for $45,000 but your open invoice is for $47,500. The client didn't send remittance advice. What steps do you take before posting anything?*
3. *Your manager tells you to just "plug the difference" on the bank reconciliation because it's only $340 and the audit is tomorrow. What do you do?*
4. *You notice that last month's accrual for offshore labor ($14,800) was never reversed on the first of this month. How does this affect the current month's financials and what do you do?*
5. *A vendor is threatening to stop services unless you pay their invoice immediately. The invoice failed the 3-way match two weeks ago. What do you do?*

---

### Chunk 48 — REVIEW: Full Course Final Recall (before Module 09 Interview Prep)
**10 questions, mixed from all 8 modules**
*The questions are drawn from the hardest items from Chunks 43–46. This is deliberate — interleaved spaced repetition at maximum interval.*
1. What is the GAAP-compliant timing for revenue recognition on a service contract milestone?
2. What is the normal balance of Accumulated Depreciation?
3. A $250,000 loan at 7.25% — what is the monthly interest accrual?
4. What three documents make up a 3-way match?
5. Bank statement: $312,450. GL: $346,823. Adjusted bank: $336,250. What is the total of items on the bank side?
6. What journal entry reverses a month-end accrual on the first day of the next month?
7. When does a deferred revenue balance become recognized revenue?
8. What is the DSO for a company with $997,700 AR and $4.8M annual revenue?
9. What is the correcting entry for a duplicate customer deposit of $9,503.60?
10. Name the 5 steps of ASC 606.

---

## SECTION C — ADVANCED SCENARIO LABS (Chunks 49–56)
*8 deep, ambiguous, real-world problems. No clean textbook answers. Student must diagnose, decide, and document.*

---

### Chunk 49 — SCENARIO LAB: "The Month Where Everything Went Wrong"
**Module:** After Module 06 (Month-End Close)
**Estimated time:** 75 minutes
**Learning objective:** Apply the full close checklist under realistic pressure with compounding errors.

**Setup:**
Skarion's February close has 7 problems seeded into the data package. The student downloads the February data and must find and fix all 7 before the trial balance balances.

**Problems seeded (implementing AI should write these into the Excel files):**
1. February payroll was posted for $79,167 but the correct gross was $82,450 (overtime month). $3,283 understated.
2. The Vetro license prepaid amortization was skipped. $3,000 unrecorded expense.
3. An offshore invoice was accrued in January ($14,800) but the reversal was never posted on Feb 1.
4. A customer paid $215,000 but it was posted to the wrong customer (credited Southeast Broadband instead of Atlantic Fiber Co.).
5. Depreciation was posted at $1,200 instead of $1,000 (a typo).
6. The bank fee for February ($45) was never recorded.
7. A prepaid insurance policy ($1,800/quarter = $600/month) has never appeared in the accounts — it was paid in January and forgotten.

**Deliverable:** Student submits the corrected trial balance and a written memo explaining each of the 7 corrections.

**Research direction for implementing AI:**
- Build this as a downloadable Excel workbook with the errors baked in. Model it after Nuzhat's bank statement files in structure.
- The scenario should include an Instructions tab, a Raw Data tab, a Trial Balance tab, and a Corrections Log tab.

---

### Chunk 50 — SCENARIO LAB: "The Client Who Pays in Three Pieces"
**Module:** After Module 04 (AR & Billing)
**Estimated time:** 45 minutes

**Setup:**
Southeast Broadband owes Skarion $405,000 (two open invoices: $215,000 and $190,000). They send three separate wires over 6 weeks:
- Wire 1: $215,000 with a note "Payment for Invoice SE-2026-004"
- Wire 2: $100,000 with no remittance advice and no reference number
- Wire 3: $89,750 with a note "Final payment less 1.25% early payment discount"

For each wire, the student must:
1. Identify which invoice(s) to apply it to
2. Calculate if a discount was legitimately earned (was Wire 3 within the discount window?)
3. Post the journal entry
4. Explain what to do with the $250 short payment after the discount

**Key concepts tested:** Cash application, payment terms (2/10 Net 30 vs. their actual terms), short-payment handling, remittance advice chase.

---

### Chunk 51 — SCENARIO LAB: "The Offshore Invoice Dispute"
**Module:** After Module 03 (AP & Payroll)
**Estimated time:** 60 minutes

**Setup:**
Global CAD Solutions sends invoice GCS-2026-147 for $18,750. The PO covers 500 miles of HLD at $35.00/mile. The invoice claims 500 miles but also includes a line item for "Rush premium — 15%" = $2,812.50. No rush premium was agreed to in the Master Services Agreement.

Student must:
1. Run the 3-way match and document the discrepancy
2. Calculate what should be paid vs. what was billed
3. Draft the hold notice memo to the vendor (text field in the course)
4. Post the correct partial accrual for the undisputed portion
5. Explain the journal entry if the dispute is eventually resolved in Skarion's favor vs. GCS's favor

**Key concepts:** 3-way match, partial payment, vendor dispute documentation, accrual for contested amounts.

---

### Chunk 52 — SCENARIO LAB: "The NSF Check That Started a Collections Problem"
**Module:** After Module 05 (Bank Rec)
**Estimated time:** 45 minutes

**Setup:**
TeleCom Builders sent a $50,000 check in March. The bank deposited it and Skarion's bookkeeper applied it to Invoice TC-2026-011. Two weeks later, the bank reverses the deposit — NSF. The bank also charges a $35 fee. TeleCom Builders has gone silent.

Student must:
1. Post the NSF reversal (reinstate the AR, record the fee)
2. Review TeleCom's full AR aging — they now have $162,700 outstanding across 3 invoices
3. Decide: should Skarion increase the bad debt allowance? By how much? Post the entry.
4. Write the collections memo: what steps would you take in what order?
5. If TeleCom eventually pays $80,000 as a settlement, post the recovery entry and the write-off of the remaining balance

---

### Chunk 53 — SCENARIO LAB: "Fixed Assets — What Gets Capitalized, What Gets Expensed"
**Module:** After Module 06 (Month-End Close)
**Estimated time:** 45 minutes

**Setup:**
Skarion makes five purchases in Q1. Student must classify each as capital expenditure (capitalize) or operating expense (expense immediately), justify the decision, and post the journal entry.

| Purchase | Amount | Notes |
|---|---|---|
| 5 new GIS workstations | $14,500 each | 5-year useful life, $500 salvage value each |
| Annual ArcGIS Pro license renewal | $8,000 | |
| Desk chairs for the engineering office | $3,200 | |
| Server rack for GIS database hosting | $22,000 | 7-year useful life, $0 salvage |
| Repair of existing server (fan replacement) | $450 | Restores functionality, no improvement |

Student also builds the depreciation schedule for the two capitalized assets for their first year.

**Research direction:** The IRS capitalization threshold (de minimis safe harbor is $2,500 per item for most businesses, $5,000 with audited financials) — look up IRS Rev. Proc. 2015-20 for the exact rule. This is the kind of real-world detail interviewers test.

---

### Chunk 54 — SCENARIO LAB: "Year-End and the Closing Entries"
**Module:** After Module 06 (Month-End Close)
**Estimated time:** 60 minutes

**Setup:**
Skarion's December 31st trial balance is provided. All monthly closes have been done correctly. Now the student must post closing entries to zero out all temporary accounts and roll net income into Retained Earnings.

Student must:
1. Identify every temporary account (revenue and expense accounts)
2. Calculate Skarion's net income for the year
3. Post the four closing entries:
   - Close Revenue accounts to Income Summary
   - Close Expense accounts to Income Summary
   - Close Income Summary to Retained Earnings
   - Close Drawings/Distributions (if applicable)
4. Verify post-closing trial balance — only permanent accounts remain with balances
5. Confirm Assets = Liabilities + Updated Equity

**Research direction for implementing AI:**
- This is a classic accounting exercise that every intro textbook covers. The unique element here is using Skarion's real account names and balances from the course. Source the year-end figures from the running totals across all previous modules.

---

### Chunk 55 — SCENARIO LAB: "Build the Financial Statement Package"
**Module:** After Module 06 (Month-End Close)
**Estimated time:** 60 minutes

**Setup:**
Using the January adjusted trial balance from the close exercise (Chunk 23), the student builds the three core financial statements from scratch in Excel:

1. **Income Statement:** Revenue, COGS, Gross Profit, Operating Expenses, Net Income. Calculate Gross Margin % and Operating Margin %.
2. **Balance Sheet:** Current Assets, Long-Term Assets, Current Liabilities, Long-Term Liabilities, Equity. Verify Assets = L + E.
3. **Cash Flow Statement (simplified indirect method):** Start with Net Income, adjust for non-cash items (depreciation), change in working capital, investing activities (any capex), financing activities (loan repayment).

Student then writes a 3-sentence CFO memo: "Here is what happened financially in January, here is what concerns me, and here is what I'd recommend watching in February."

**Template file to create:** `Template_06_Financial_Statement_Package.xlsx` — add this to the `07-excel-toolkit` folder and Nuzhat's `07-excel-toolkit/` folder.

---

### Chunk 56 — SCENARIO LAB: "The Excel Clean-Up Assignment From Hell"
**Module:** Module 07 (Advanced Excel)
**Estimated time:** 90 minutes
**This is the hardest Excel exercise in the course.**

**Setup:**
The student receives `Offshore_Labor_Raw_Q1_2026.csv` — 3,000 rows of individual CAD and GIS task entries from 4 offshore firms across 12 projects. The data has 8 deliberate quality problems:
1. Date column is a single text field "Jan-15-2026" — needs Text-to-Columns
2. Vendor names have inconsistent spacing ("Global CAD Solutions " with trailing space)
3. Two vendors have duplicate entries (same task ID entered twice)
4. Project codes contain typos ("Proj-Alpha" vs "Proj Alpha" vs "ProjAlpha")
5. One column uses a comma as a decimal separator (European format)
6. Three rows have $0 amounts but non-zero hours — a fee structure error
7. A VLOOKUP to the project master fails for 47 rows due to a case mismatch
8. The billing rate column has mixed currency ($, £, €) for the different offshore offices

Student must fix all 8 problems, produce a clean data set, VLOOKUP in project codes, SUMIFS total by project, and build a PivotTable showing hours and cost by project and vendor.

**Research direction for implementing AI:**
- Generate this CSV file programmatically using Python (like the earlier Raw_Expense_Export.csv was generated). Seed exactly these 8 problems into the data.
- The file should have ~3,000 rows with realistic task descriptions like "HLD drafting - Section 4A, Tennessee Corridor" and "GIS data verification - Texas Long-Haul Project."

---

## SECTION D — CAREER & SOFT SKILLS (Chunks 57–60)
*4 chunks that address the non-technical skills that determine whether a candidate gets hired and thrives.*

---

### Chunk 57 — "How to Talk About This Course in an Interview Without Sounding Fake"
**Type:** Content + Flip Cards
**Placement:** Module 09, between Chunk 28 and 29

**Theory:**
The course is a portfolio project — a simulation, not employment. Students need language to present it honestly without underselling or misrepresenting it.

**The exact language framework:**
- ✅ *"In my accounting simulation portfolio project with Skarion Manufacturing, I..."*
- ✅ *"Through a structured accounting simulation, I processed over 30 vendor invoices using 3-way match..."*
- ✅ *"I completed a full month-end close simulation including bank reconciliation, accruals, depreciation, and financial statement preparation."*
- ❌ *"I worked at Skarion Manufacturing."* (misrepresentation)
- ❌ *"I just did some practice exercises."* (underselling)

**The key insight:** Simulation experience is *real experience*. A pilot doesn't need to have crashed a real plane to know how to handle engine failure. They practiced on a simulator. An interviewer who understands accounting training knows this.

**Flip Cards (6):** One per common interview context where the student needs to reframe simulation experience (LinkedIn profile, resume bullet point, "Tell me about yourself," behavioral questions, technical questions, reference questions).

---

### Chunk 58 — "Professional Communication in Accounting — What to Say and When"
**Type:** Content + Scenario Role-Play
**Placement:** Module 09

**Theory:**
Five communication scenarios every junior accountant will face in the first 90 days:
1. **Escalating an error:** "I found a discrepancy I can't resolve alone. Here is what I found, here is what I've already tried, and here is my recommendation."
2. **Pushing back on a bad instruction:** "I want to make sure I understand — you'd like me to adjust the balance to match without tracing the source. Can you walk me through the business reason? I want to make sure we have documentation."
3. **Chasing a late vendor invoice:** "Hi [Vendor], I'm closing January's books and we have outstanding amount [X] for [description]. Can you confirm the invoice status?"
4. **Delivering bad news on cash position:** Clear, factual, solution-oriented. Never alarmist.
5. **Asking for help without looking incompetent:** "I've reviewed [X], tried [Y], and I'm getting [Z] — which isn't matching because of [suspected reason]. Can I get 5 minutes to walk through it with you?"

**Role-play scenarios:** Student reads a situation and selects the best email draft from 3 options.

---

### Chunk 59 — "AI Tools in Modern Accounting — What's Real, What's Hype"
**Type:** Content + Flip Cards
**Placement:** Module 07, after the Excel chunks

**Theory:**
What AI tools are actually doing in accounting in 2025–2026:
- **What AI is good at now:** Categorizing transactions, matching invoices to POs, flagging anomalies in large datasets, auto-populating expense reports
- **What AI is not good at:** Exercising accounting judgment, catching context-dependent fraud, understanding business relationships, GAAP compliance decisions
- **Tools worth knowing:** Sage Intacct's AI features, QuickBooks AI categorization, Microsoft Copilot for Excel, ChatGPT for writing journal entry memos and first-draft reconciliation explanations
- **The safe position for a junior accountant:** AI handles the volume work, you handle the judgment calls and documentation. AI does not sign off. You do.
- **Interview positioning:** "I use AI tools to handle the mechanical volume of data preparation, which lets me spend more time on judgment-intensive work like reconciliation investigation and adjusting entry review."

**Flip Cards (5):** One per major AI accounting tool — what it does, what it can't do, and one sentence on how to describe using it in an interview.

**Research direction for implementing AI:**
- Search "AI in accounting 2025 2026" and "QuickBooks AI features" and "Sage Intacct artificial intelligence" for current capabilities.
- Check the AICPA's position on AI in public accounting for the authoritative framing.
- The distinction between AI for volume work vs. judgment work is the key concept — do not overstate or understate it.

---

### Chunk 60 — "The First 30 Days on the Job — A Playbook"
**Type:** Content + Timeline + Checklist
**Placement:** Final chunk of Module 09 (replaces the current course completion chunk)

**Theory:**
Most new accounting hires fail not because of technical gaps but because they mismanage the first 30 days. This chunk is a concrete playbook.

**Timeline:**
- **Days 1–3:** Learn the COA. Read the accounting policies. Ask for last month's close package and read every entry. Don't post anything yet.
- **Days 4–7:** Shadow AP processing. Ask about the 3-way match policy. Find out who approves what. Ask about the payment run schedule.
- **Days 8–14:** Take ownership of one recurring task (AP entry, cash posting, or bank rec prep). Do it, show your work to your manager, ask for feedback before the deadline.
- **Days 15–21:** Ask to sit in on a close meeting. Take notes. Build your own close checklist based on what you observe.
- **Days 22–30:** Complete your first solo close contribution (even if it's just one assigned journal entry). Ask for review before submitting.

**The three rules:**
1. Never post without documentation. Not one entry.
2. Ask questions before the deadline, not after.
3. The close is a team sport. Your error affects everyone's night.

**Downloadable checklist:** "My First 30 Days on the Job" — a fillable PDF or Word doc with the weekly milestones, key questions to ask, and space for notes on the company's specific processes.

**Research direction for implementing AI:**
- Search "first 90 days accounting job advice" on accounting career blogs (AccountingCoach, Going Concern, CPA Exam Guy).
- The Big 4 public accounting onboarding experience is well documented publicly — use it as the premium reference point.
- The downloadable checklist should be created as a clean, printable Word document and added to `courses/accounting-track/` as `First_30_Days_Checklist.docx`.

---

## Implementation Notes for the Next Developer/AI

### New chunk types needed in player.js
| `"type"` | Description |
|---|---|
| `"video"` | Embeds `<video>` or `<iframe>`. Marks satisfied at 80% playback. Requires `"videoSrc"` and `"posterSrc"` fields. |
| `"review_quiz"` | Same as quiz but with intro text "Before we continue..." and a different color header. Marks satisfied after all answered. |
| `"scenario_lab"` | Full-screen problem statement + tabbed work area (Instructions / Your Work / Solution). Satisfied on text submission. |
| `"timed_drill"` | Quiz with a 60-second countdown per question. Shows timer. Tracks which questions timed out. |

### Where to put the video files
- Video scripts should be recorded and saved as MP4 in: `claude-made-course/videos/chunk-31-why-accounting-exists.mp4` etc.
- The `build_course.py` script needs to copy the `videos/` directory into the SCORM zip.
- For now, before videos are recorded, the `video` chunk can render the script text as a transcript fallback.

### Downloadable assets to create
- `courses/accounting-track/scenario-labs/February_Close_Errors.xlsx` (for Chunk 49)
- `courses/accounting-track/scenario-labs/Offshore_Labor_Raw_Q1_2026.csv` (for Chunk 56, ~3,000 rows, 8 seeded problems)
- `courses/accounting-track/shared/First_30_Days_Checklist.docx` (for Chunk 60)
- `courses/accounting-track/07-excel-toolkit/Template_06_Financial_Statement_Package.xlsx` (for Chunk 55)
