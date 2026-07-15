# Skarion Accounting Track — Phase 3 Blueprint
### Chunks 61–90 · UI Polish · Real Interview Prep · In-Browser Labs · Capstone

> **Context for GLM:** You have already built Chunks 1–60. This is the final layer.
> Phase 1 = core accounting curriculum (`content.json` per module).
> Phase 2 = video scripts, spaced repetition, advanced scenarios.
> Phase 3 = finish line. Polish the UI, make the labs feel real, and get the candidate genuinely job-ready.
>
> **Three non-negotiable upgrades in this phase:**
> 1. The Excel lab must feel like Excel — in-browser spreadsheet, not a download prompt.
> 2. The SkarionBooks lab must feel like QuickBooks — sidebar nav, transaction forms, running reports.
> 3. The interview prep must use real questions from real firms, not textbook STAR examples.

---

## SECTION E — IN-BROWSER LAB UPGRADES (Chunks 61–65)
*UI specifications for making labs feel like the actual software. Both a content spec AND an engineering spec.*

---

### Chunk 61 — ENGINEERING SPEC: In-Browser Excel (jspreadsheet CE)

**What this is:** A new chunk type `"type": "spreadsheet_lab"` that renders a real, interactive spreadsheet inside the SCORM course — no download required, no Excel license needed. The student works directly in the browser.

**Library to use:** `jspreadsheet CE` (MIT-licensed, free for this use case)
- CDN: `https://bossanova.uk/jspreadsheet/v4/jspreadsheet.js`
- CSS: `https://bossanova.uk/jspreadsheet/v4/jspreadsheet.css`
- Docs: https://bossanova.uk/jspreadsheet/v4/

**How it works:**
The `content.json` for a `spreadsheet_lab` chunk includes:
```json
{
  "type": "spreadsheet_lab",
  "title": "Bank Reconciliation Worksheet",
  "scenarioHtml": "<p>Fill in the two-sided reconciliation below...</p>",
  "columns": [
    {"title": "Item", "type": "text", "width": 260},
    {"title": "Bank Side ($)", "type": "numeric", "width": 120, "mask": "#,##0.00"},
    {"title": "Book Side ($)", "type": "numeric", "width": 120, "mask": "#,##0.00"}
  ],
  "data": [
    ["Ending Balance per Bank Statement", 312450.00, null],
    ["+ Deposits in Transit", null, null],
    ["− Outstanding Checks", null, null],
    ["= Adjusted Bank Balance", null, null],
    ["", null, null],
    ["Ending Balance per GL", null, 346823.60],
    ["+ Unrecorded Bank Credits", null, null],
    ["− Unrecorded Bank Fees", null, null],
    ["= Adjusted Book Balance", null, null]
  ],
  "lockedCells": ["A1","A2","A3","A4","A5","A6","A7","A8","A9","B1","C6"],
  "targetCells": {
    "B4": 336250.00,
    "C9": 336250.00
  },
  "successCondition": "B4 === C9",
  "successMessage": "✅ Both sides balance at $336,250.00 — reconciliation complete.",
  "errorMessage": "❌ The two sides don't match yet. Check your deposits in transit and outstanding checks."
}
```

**player.js renderer logic:**
1. Render the jspreadsheet grid into a `<div id="ss-{chunkIdx}">` container
2. Lock the `lockedCells` so pre-filled data can't be edited
3. On cell change: evaluate `successCondition` — if true, show `successMessage` and mark chunk satisfied
4. Style: make the spreadsheet look like Excel (white cells, gridlines, column headers A/B/C, row numbers)

**Styling notes:**
- Header row: Excel green (`#217346`) with white text
- Alternating row shading: `#f9f9f9` vs white
- Active cell border: `#1E7145` (Excel's selection green)
- Font: Calibri 11px or system sans-serif
- Toolbar: show at minimum Bold, Format as Number, Format as Currency, Merge Cells

**Research direction:**
- jspreadsheet CE v4 documentation at bossanova.uk has full column type reference, data format, and event hooks
- Search "jspreadsheet tutorial accounting" for implementation examples
- The `onChange` event fires after every cell edit — use it to check the success condition

---

### Chunk 62 — EXCEL LAB: Bank Reconciliation (Live Spreadsheet)
**Type:** `spreadsheet_lab`
**Placement:** Module 05, replaces the download-only exercise in Chunk 20
**What the student sees:** A jspreadsheet grid that looks like the `Template_01_Bank_Rec.xlsx` — but it's live in the browser.

**Pre-filled data (locked):**
- Bank Statement ending balance: $312,450.00
- GL Cash balance: $346,823.60
- Known deposits in transit: three listed transactions with dates and descriptions
- Known outstanding checks: two checks listed with amounts

**Student fills in:**
- The deposit in transit total
- The outstanding check total
- Both adjusted balances
- Two correcting journal entries (separate section below the spreadsheet)

**Validation logic:**
- Adjusted Bank Balance must equal $336,250.00
- Adjusted Book Balance must equal $336,250.00
- Both must match each other
- The two correcting entries (debit/credit) must sum to zero

**Success animation:** Green checkmark sweeps across the row, confetti burst (CSS only, no library), banner: "January Reconciliation Complete — Filed ✅"

---

### Chunk 63 — EXCEL LAB: AR Aging PivotTable (Live Spreadsheet)
**Type:** `spreadsheet_lab`
**Placement:** Module 04, after Chunk 15 (AR Aging theory)

**What the student sees:**
Tab 1 — Raw Data: 200 rows of AR transaction data (customer, invoice date, invoice #, amount, days outstanding). Pre-filled, locked.
Tab 2 — Aging Buckets: Empty grid where the student manually fills in the aging analysis (0–30, 31–60, 61–90, 90+) per customer.
Tab 3 — Summary: Auto-calculates from Tab 2 using SUM formulas — student can see their totals update in real time.

**Validation:** The four bucket totals must sum to the total AR balance ($997,700). The 90+ bucket must flag TeleCom Builders with a red background (conditional formatting simulation using jspreadsheet's `updateCell` styling API).

**The learning goal:** Student experiences the physical process of aging a receivable — not just reading about it.

---

### Chunk 64 — EXCEL LAB: Payroll Journal Entry Builder (Live Spreadsheet)
**Type:** `spreadsheet_lab`
**Placement:** Module 03, Chunk 11

**What the student sees:**
A payroll calculation sheet that works:
- Row 1: Gross wages input (student types $79,167)
- Auto-calculated rows: Federal income tax (19%), Social Security (6.2%), Medicare (1.45%), State tax (4%)
- Auto-calculated: Total withholdings, Net pay
- Journal entry section: Student must enter the DR/CR amounts from the calculated figures
- Validation: DR = CR, amounts match calculated payroll figures

**The formula cells the student sees actually calculating in real time make the payroll logic click in a way no static table can.**

---

### Chunk 65 — SKARIONBOOKS UI OVERHAUL SPEC
**What this is:** An engineering spec to make SkarionBooks feel like QuickBooks Online — not just functionally, but visually and in the workflow experience.

**Current state of SkarionBooks (`skarionbooks/`):** A single-page JS app with a sidebar, journal entry form, and basic reports.

**Target state — QuickBooks Online parity on these 5 screens:**

**Screen 1: Dashboard (home)**
- Top KPI cards: Cash Balance, Outstanding AR, Outstanding AP, Net Income (MTD)
- Cards should animate on load (count up from 0)
- Quick-action buttons: "Create Invoice", "Record Expense", "Pay Bills", "View Reports"
- Recent transactions list (last 10 entries, scrollable)

**Screen 2: Chart of Accounts**
- Full COA in a sortable table: Account Number | Name | Type | Balance
- Click any account → drills into transaction history for that account
- "New Account" button (non-functional in the simulation, but present for visual authenticity)
- Export button that downloads a CSV of the current COA balances

**Screen 3: Enter Bills (AP)**
- Form fields: Vendor dropdown (pre-populated with Skarion's vendor list), Bill Date, Due Date, Account, Description, Amount
- "Save & Close" posts the journal entry (Dr COGS or Expense / Cr AP)
- Running AP balance updates on the dashboard immediately

**Screen 4: Receive Payments (AR)**
- Customer dropdown, Invoice selector (shows open invoices for that customer), Payment Amount, Payment Method (Wire, ACH, Check)
- Applies payment to specific invoice line item, posts Dr Cash / Cr AR
- If payment ≠ invoice total: prompts "Short payment — leave balance open or write off?"

**Screen 5: Reports**
- Income Statement (P&L): Current month vs prior month columns, variance column
- Balance Sheet: As of date selector
- AR Aging: Four bucket columns, auto-colored (green/yellow/orange/red)
- Cash Flow Statement (simplified indirect method)
- All reports: "Print" button that opens browser print dialog

**UI polish details:**
- Color scheme: Match QuickBooks' green-and-white (`#2CA01C` primary, `#F4F4F4` sidebar bg)
- Typography: `Inter` or `Roboto`, 13px body, 11px labels
- All forms: smooth slide-in panel from the right (CSS transform transition)
- Every posted transaction: toast notification bottom-right "Entry Posted ✓"
- Keyboard shortcut: `Ctrl+S` saves any open form

**Research direction for GLM:**
- Navigate to `app.quickbooks.com` (QBO) and screenshot the actual UI for reference — the Dashboard, Chart of Accounts, and Enter Bills screens
- The Skarion house style should match QBO closely enough that a student who moves to the real thing feels immediately at home
- Key QBO reference: the left sidebar has icons + text labels at the top for Dashboard, Banking, Sales (AR), Expenses (AP), Accounting (COA, Journal Entries)

---

## SECTION F — REAL INTERVIEW PREP (Chunks 66–78)
*Real questions. Real answers. STAR method applied to Skarion simulation work. Short intros for non-traditional candidates.*

---

### Chunk 66 — VIDEO SCRIPT: "Tell Me About Yourself — The 90-Second Version"
**Duration:** 3 minutes
**Who this is for:** Especially candidates with resume gaps or non-traditional backgrounds

| TIME | NARRATION | VISUAL |
|---|---|---|
| 0:00–0:20 | *"The most common interview mistake: answering 'Tell me about yourself' by reciting your resume. The interviewer already has your resume. This question is an invitation to tell them why you are in this room."* | Text: "They have your resume. This is not about your resume." |
| 0:20–1:00 | *"Use the Present → Past → Future structure. Present: where you are right now and what you've been doing to prepare. Past: what relevant experience or transferable skills you bring, even from a different field. Future: why this specific role at this specific company, connected to a real thing you know about them."* | Animation: Three boxes appearing. Present / Past / Future with arrows between them. |
| 1:00–2:00 | *"Here is a real example for a career-changer with a non-accounting background: 'Right now I'm actively building accounting skills — I completed a full simulation where I handled the entire accounting cycle for a $2M manufacturer, including month-end close, bank reconciliations, and AP processing. Before that I was in operations management, where I was responsible for budget tracking and cost variance analysis — which gave me strong analytical instincts I now apply to accounting. What I'm looking for is a staff accountant role where I can build real depth in the GL and close cycle, and I'm particularly interested in your firm because of [something specific about the company].'"* | Text callouts highlighting the key phrases: "full simulation," "handled the entire accounting cycle," "strong analytical instincts," and "I'm particularly interested in your firm because." |
| 2:00–2:40 | *"Notice: no apology for the career change. No over-explanation of the gap. The simulation is real work — present it that way. And the last sentence shows you actually researched the company."* | Bold text: "No apology. No over-explanation. Research is preparation." |
| 2:40–3:00 | *"In the next section, you'll build your own version of this script. You'll have 90 seconds. Record yourself. Watch it back."* | Transition to Chunk 67. |

---

### Chunk 67 — "Build Your 90-Second Intro" (Personal Script Builder)
**Type:** Guided reflection exercise
**Placement:** Module 09, before STAR questions

**The exercise:**
Three text fields the student fills in:
1. **Present** (2–3 sentences): "Right now I am... I have completed... My key skills from this training are..."
2. **Past** (2–3 sentences): "Before this, I was in [X] where I [relevant quantified achievement]. This gave me [transferable skill]."
3. **Future** (2–3 sentences): "I'm looking for [specific type of role]. I'm interested in [specific company/type of firm] because [something real and specific]."

Then a **"Preview" button** that combines all three into a clean paragraph — the student's personal intro script.

**Word count validator:** Must be 180–220 words (fits in 90 seconds at average speaking pace).

**Common traps to warn about (shown as callouts in the UI):**
- ❌ Don't start with "I was born in..." or "I've always loved numbers..."
- ❌ Don't say "I don't have much experience but..."
- ❌ Don't just list the resume chronologically
- ✅ Do lead with what you've actively done to prepare
- ✅ Do connect your past to this specific role
- ✅ Do end with something specific about the company

---

### Chunk 68 — STAR BEHAVIORAL QUESTION BANK: Technical Situations
**Type:** Flip cards (front = question, back = STAR model answer using Skarion numbers)
**Placement:** Module 09

**8 Real Technical Behavioral Questions + Skarion STAR Answers:**

**Q1: "Tell me about a time you found an error in the financial records."**
- S: During January's bank reconciliation at Skarion Manufacturing, the GL showed $34,000 more cash than the bank statement.
- T: My job was to find and correct the source before the books could be closed.
- A: I compared deposits line by line by date and amount. I found a customer ACH payment — $10,547.10 from Southeast Broadband — that had been entered in QuickBooks twice. I confirmed the bank had only received one payment, then posted a correcting entry: debit AR, credit Cash for $10,547.10.
- R: The reconciliation balanced to $336,250.00. The entry also reinstated the customer's receivable correctly — no touch to Sales Revenue, since the sale was never double-counted. I documented the correction with the bank reference number and the original entry date.

**Q2: "Describe a time you had to meet a strict deadline under pressure."**
- S: During Skarion's January month-end close, we had a 5-day close window with 12 adjusting entries to post, the bank reconciliation to complete, and financial statements due to the controller on Day 5.
- T: I was responsible for three specific entries: the offshore labor accrual, the Vetro prepaid amortization, and the loan interest accrual.
- A: I prioritized by dependency — the accruals had to go in before the trial balance was run. I built a personal checklist tied to the close calendar, worked the entries in order, and triple-checked each debit/credit before posting. I flagged one potential issue — a missing vendor invoice — to my manager on Day 2, which gave enough time to get the reversal posted before Day 5.
- R: All three entries were posted correctly by Day 3. The controller's financial package was delivered on Day 5 with zero open items. Net income for January was $242,000.

**Q3: "Tell me about a time you identified a process improvement."**
- S: During the AP entry process at Skarion, I noticed that offshore vendor invoices were being matched to purchase orders manually — one invoice at a time — which was creating a bottleneck and occasional mismatches.
- T: I needed a way to speed up the matching without reducing accuracy.
- A: I built a VLOOKUP-based Excel tool that pulled the approved PO unit price next to each invoice line item automatically. If the invoice price exceeded the PO price by more than $0, the row highlighted red. This turned a 45-minute manual review into a 5-minute scan.
- R: The first batch I ran with it caught a $178.75 overbilling from Global CAD Solutions that would have gone through undetected. The tool was adopted for all monthly invoice batches.

**Q4: "Give me an example of when you had to work with incomplete information."**
- S: A client wire transfer of $190,000 arrived with no remittance advice and no reference number — just an amount and a company name.
- T: I needed to apply the payment to the correct open invoices without creating an unapplied cash balance.
- A: I contacted the client's AP department directly and requested the remittance advice. While waiting, I identified the two most likely invoices based on the amount and client's outstanding balance in the AR aging. When remittance arrived 24 hours later, it confirmed my assessment. I applied the payment and documented the delay and method.
- R: The payment was applied correctly within 48 hours of receipt with full documentation. The approach also led to a standard process: any unidentified wire over $5,000 gets a remittance request email within 2 hours of bank notification.

**Q5: "Tell me about a time you had to explain a financial concept to someone without a finance background."**
- S: During month-end close, our project manager wanted to know why our P&L showed high expenses in January even though we'd paid most of our offshore vendors in December.
- T: I needed to explain accrual accounting to someone who only thought in cash terms, without making them feel talked down to.
- A: I used a simple analogy: "If you hire a contractor in December and they finish the job in January, the expense belongs to January — that's when the work happened and when it helped the project. The payment timing doesn't change when the cost was incurred." I then showed them the two lines side by side: the December payment (Prepaid/AP) vs. the January expense recognition.
- R: They understood immediately. The project manager now proactively asks me to flag any large accruals before close so they can plan headcount conversations accordingly.

**Q6: "Describe a time you had to push back on an instruction you thought was wrong."**
- S: During a quarterly close, my manager suggested we "round up" a small reconciliation difference of $340 rather than trace it, because the audit was the next morning.
- T: I needed to push back on this without damaging the relationship or creating a confrontational situation.
- A: I said: "I want to make sure we're covered — can I have 20 minutes to trace it? If I can't find it in 20 minutes, I'll document the unresolved item in the reconciliation notes with an explanation, which gives us a clean paper trail for the auditor either way." He agreed. I found it in 12 minutes — a transposition error on a vendor payment.
- R: The error was corrected, the reconciliation balanced, and we went into the audit clean. The manager later told me he appreciated that I found a path forward instead of just saying no.

**Q7: "Tell me about a time you managed multiple competing priorities."**
- S: On Day 3 of the January close, I had three time-sensitive items land simultaneously: a vendor dispute that needed a hold decision, an AR payment application for a new client wire, and my deadline to post the depreciation entry.
- T: I had to triage and execute without dropping any of them.
- A: I assessed which had the hardest deadline (depreciation had to be in the system before the trial balance ran at 4 PM), which needed additional information (the vendor dispute needed a manager decision, not me), and which I could post immediately (the AR payment was straightforward). I posted the AR payment first (5 minutes), escalated the vendor dispute with a written summary and recommendation (10 minutes), then completed the depreciation entry with its schedule attached.
- R: All three were resolved before 2 PM. The depreciation entry was in the trial balance. The vendor dispute decision came back from my manager by 3 PM and was documented. No deadline was missed.

**Q8: "Tell me about a time you had to adapt to a new system or process quickly."**
- S: In this training, SkarionBooks — a custom accounting simulator — was the primary system. It handles AP, AR, bank reconciliation, and financial reporting, but it uses a different workflow than a standard accounting package.
- T: I needed to become proficient quickly enough to complete a full month-end close cycle.
- A: I started by reviewing the Chart of Accounts structure and mapping it to what I already knew about account types. Then I ran one small transaction — a vendor invoice — end to end before touching anything more complex. I built a personal reference card of the most common entry workflows (bill entry, payment application, journal entry, report generation).
- R: I completed the full January close simulation in the system, including 12 journal entries, a bank reconciliation, three financial statements, and a complete AR aging analysis — without any system errors or requiring re-entries.

---

### Chunk 69 — STAR BEHAVIORAL QUESTION BANK: Soft Skills & Ethics
**Type:** Flip cards
**8 Real Behavioral Questions (soft skills / ethical judgment):**

**Q9: "Describe a time you made a mistake at work and how you handled it."**
- STAR: Posted a depreciation entry to the wrong account (6500 Software instead of 6700 Depreciation). Caught it during the trial balance review. Self-reported immediately to the controller. Reversed the entry and reposted correctly with documentation. Lesson: always verify account numbers against the COA before posting, not after.

**Q10: "Tell me about a time you maintained confidentiality."**
- STAR: Payroll data and vendor contract terms are strictly confidential. During training, I treated all Skarion financial data with the same care I would real client data — no screenshots, no discussion outside of coursework context, files password-protected. This is not a situation I waited to be taught — it was an assumption I came in with.

**Q11: "How do you handle working with someone who isn't pulling their weight on a team?"**
- STAR: Structure your answer around the specific step sequence: first clarify whether they are aware of the issue, then document what's not happening, then flag to a manager only if a deliverable is at risk. Never just absorb their work without flagging it.

**Q12: "Tell me about a time you had to meet a high standard of accuracy."**
- STAR: Every bank reconciliation entry, every payroll calculation, every journal entry in this course had to balance to the exact cent. Walk through the January reconciliation ($336,250.00 exact balance) as the example. The key detail: describe how you verify your own work — does the trial balance balance? Does the AR subledger tie to the GL?

**Q13 — Ethical Scenario: "A vendor offers to pay for your lunch in exchange for approving their invoice faster. What do you do?"**
- Answer structure: Thank them, decline, explain that invoice processing follows a fixed schedule (3-way match → approval → payment run), and document the interaction in writing as a matter of record. Never allow the personal relationship to accelerate the payment cycle.

**Q14: "Describe a time you had to deliver bad news to a manager or stakeholder."**
- STAR: The February close scenario (Chunk 49) — when you discover the 7 errors, you have to communicate them clearly, with root cause and fix, not just the problem.

**Q15: "What do you do when you're stuck and don't know the answer?"**
- Answer: Step 1: try to solve it yourself for a fixed time (15–20 min). Step 2: document what you've tried and what you're seeing. Step 3: escalate with that documentation — "I've looked at X, tried Y, and I'm getting Z which doesn't make sense because of A. Can I get 5 minutes?" Never sit stuck silently and never just guess.

**Q16: "Where do you see yourself in 3 years?"**
- Accounting answer: "In my first year I want to become genuinely fast and reliable on the full close cycle. In year two I want to take ownership of at least one reconciliation area end-to-end. In three years I'd like to be the person my manager turns to for the harder items — the ones that require judgment, not just execution."

---

### Chunk 70 — REAL TECHNICAL INTERVIEW QUESTIONS (20 Must-Know)
**Type:** Flip cards — one card per question, front = question exactly as interviewers phrase it, back = the right answer in full

*These are sourced from actual firm interviews, accounting forums (Reddit r/accounting, Big 4 Bound), and public interview prep resources.*

1. **"Walk me through the accounting cycle."** — 8 steps, in order, with what breaks if each is skipped.
2. **"What is the difference between the income statement and the balance sheet?"** — Temporary vs. permanent accounts. One is a movie, one is a photo.
3. **"If cash increases, what else changes?"** — Depends on the reason. Walk through 3 scenarios: customer payment (AR decreases), borrowing (loan increases), owner investment (equity increases).
4. **"What is goodwill and when does it appear?"** — Only on the balance sheet after a business acquisition. It's the excess of purchase price over fair value of net assets. Cannot be internally generated.
5. **"How do you record a prepaid expense?"** — Debit Prepaid (Asset), Credit Cash. Then monthly: Debit Expense, Credit Prepaid as it's consumed.
6. **"What is EBITDA?"** — Earnings Before Interest, Taxes, Depreciation, and Amortization. Common metric for comparing operating performance across companies with different capital structures.
7. **"Walk me through how you'd close the books at year-end."** — Four closing entries: close revenue to Income Summary, close expenses to Income Summary, close Income Summary to Retained Earnings, close Drawings.
8. **"What is the difference between accounts payable and accrued liabilities?"** — AP: you have an invoice. Accrued: the expense is incurred but no invoice yet.
9. **"What is depreciation, and why don't we just expense the full asset cost when we buy it?"** — Matching principle. The asset generates revenue over multiple years; its cost should be spread over the same period.
10. **"How do you calculate straight-line depreciation?"** — (Cost − Salvage Value) ÷ Useful Life in years. Monthly: divide by 12.
11. **"What is the difference between revenue recognition and cash receipt?"** — Revenue is recognized when earned (performance obligation satisfied). Cash receipt is when money arrives. These are often different dates under accrual.
12. **"What is an accrual, and give me an example."** — Recording an expense before the invoice arrives. Example: offshore labor completed January 31, invoice arrives February 4 — accrue in January.
13. **"What is a contra account? Give an example."** — An account that offsets another account. Accumulated Depreciation offsets the Fixed Asset account. Allowance for Doubtful Accounts offsets AR.
14. **"What is the matching principle?"** — Expenses should be recognized in the same period as the revenue they help generate.
15. **"What is working capital, and how is it calculated?"** — Current Assets minus Current Liabilities. Measures short-term liquidity.
16. **"What is the difference between a debit memo and a credit memo?"** — Debit memo: a document that increases what a customer owes (or reduces a credit). Credit memo: reduces what a customer owes (issued for returns, disputes, overpayments).
17. **"What software have you used for accounting?"** — Name SkarionBooks (custom simulation), QuickBooks Online (conceptual training), Excel (VLOOKUP, SUMIFS, PivotTables — with specific examples from labs).
18. **"What is a journal entry? Give me an example."** — The formal record of a financial transaction. Example: recording the monthly Vetro license amortization — Dr Software Expense $3,000 / Cr Prepaid Software $3,000.
19. **"What is internal control, and why does it matter?"** — Policies and procedures designed to prevent errors and fraud. Examples: 3-way match, bank reconciliation, segregation of duties (the person who approves a payment shouldn't be the same person who enters it).
20. **"Why do you want to work in accounting?"** — Specific answer: "I'm drawn to the fact that accounting is the language every business runs on — and I want to be fluent in it. I find real satisfaction in accuracy under pressure, and I like that the work is specific and verifiable. The reconciliation either balances or it doesn't. I prefer that clarity."

---

### Chunk 71 — REAL FIRM-SPECIFIC QUESTIONS: Big 4 vs. Mid-Size vs. Industry
**Type:** Content + Flip cards
**Placement:** Module 09

**Content section — "Know What They're Actually Assessing":**

| Firm Type | Primary Filter | Common Opening Question | What They're Really Asking |
|---|---|---|---|
| Big 4 (Deloitte, EY, KPMG, PwC) | Culture fit + learning agility + leadership potential | "Tell me about a time you showed leadership." | Can you manage up, manage peers, and thrive in a structured hierarchy? |
| Regional firms (RSM, Grant Thornton, BDO) | Technical readiness + client communication | "How do you explain a complex issue to a non-finance person?" | Will you represent the firm well in front of clients immediately? |
| Industry (corporate accounting, manufacturing, services) | Close cycle ownership + systems proficiency | "What does your month-end close process look like?" | Can you own tasks with minimal supervision from day 1? |
| Startups / fast-growth | Generalist skills + comfort with ambiguity | "How do you build a process when there isn't one?" | Will you create structure, not just follow it? |

**Flip cards — 6 firm-specific questions:**

**Big 4 Deloitte behavioral (actual question from Glassdoor 2024):**
*"Give me an example of a time when you had to manage a project where you didn't have all the information you needed."*
→ Use the unidentified wire transfer scenario (Chunk 50 / Southeast Broadband partial payment).

**EY behavioral (actual question, Glassdoor 2024):**
*"Describe a time you had to quickly learn something completely new. How did you approach it?"*
→ Use the SkarionBooks / new system adaptation story from Q8 (Chunk 68).

**RSM technical (actual question, Reddit r/accounting):**
*"If I give you a trial balance with a $7,500 imbalance, where do you start?"*
→ Divide by 2 first — if the halved amount ($3,750) matches an account balance, it may be a posting that went to the wrong side. Then check for transpositions (if the difference is divisible by 9, it's likely a transposition). Then sort transactions by amount and look for the exact figure.

**Grant Thornton scenario:**
*"A client calls you Friday afternoon and says their bank won't extend a line of credit without audited financials by Monday. What do you do?"*
→ The answer is about prioritization, escalation, and knowing what you can vs. can't promise. A staff accountant doesn't commit to audit timelines — they gather information, escalate to the manager immediately, and prepare whatever supporting documentation is requested.

**Industry (corporate) — actual first interview question at mid-size manufacturer:**
*"What's the first thing you do when you get a new invoice?"*
→ Check for 3-way match. Does the PO exist? Does the receiving report confirm delivery? Does the amount and description match? Only then does it get entered. Walk them through the Dominion Aluminum DAF-2601-014 example.

**Startup:**
*"We don't have a month-end close process. How would you build one?"*
→ Start with the balance sheet reconciliations (cash, AR, AP) because those are the accounts most likely to have errors that compound. Add depreciation and accruals. Run the trial balance. Then build a close checklist that other people can follow. Document the reason for each entry, not just the entry itself.

---

### Chunk 72 — SALARY NEGOTIATION: What to Say and When
**Type:** Content + Flip cards
**Placement:** Module 09, near the end

**Content — "The Three Salary Moments":**

**Moment 1: The Application Form — "What are your salary expectations?"**
- If you can leave it blank, do.
- If you must answer: "I am open to competitive compensation for this role and location. Based on my research, I believe the range for entry-level staff accountants in [city] is $X–$Y, and I'm flexible within that range based on the full compensation package."
- Research source to give GLM: BLS.gov occupational outlook for accountants + Robert Half Salary Guide (published annually) + LinkedIn Salary Insights for your specific city

**Moment 2: The Verbal Offer**
- Do not accept on the spot. "Thank you so much — I'm very excited about this opportunity. Can I have 48 hours to review the details?"
- Counter-offer: "Based on my research and the full scope of the role, I was hoping for [X]. Is there flexibility there?" — X should be 10–15% above their offer.
- If they say no: "I understand. Could we revisit compensation after 6 months if my performance meets expectations?" — get this in writing.

**Moment 3: Negotiating Benefits (when salary is fixed)**
- Remote work days
- Professional development budget (CPA exam support, course reimbursements)
- Start date flexibility
- Sign-on bonus if relocation required

**2025–2026 market benchmarks (research direction for GLM):**
- Entry-level staff accountant, no CPA: $45,000–$62,000 (national average, varies significantly by city)
- Top markets (NYC, SF, Chicago): $58,000–$78,000
- Robert Half 2025 Salary Guide is the best single reference — search "Robert Half 2025 accounting salary guide PDF"
- Give specific numbers in the module so students know their floor before walking in

**Flip cards (4):** Four salary phrases with the exact words — one for each of the four negotiation moments above.

---

### Chunk 73 — LINKEDIN & RESUME OPTIMIZATION
**Type:** Content + Checklist
**Placement:** Module 09

**LinkedIn Profile Checklist (14 items):**
1. ✅ Headline: "Staff Accountant | Full Accounting Cycle | Bank Reconciliation | QBO | Excel" — NOT "Accounting Student Looking for Opportunities"
2. ✅ About section: Uses Present → Past → Future structure (120–200 words)
3. ✅ Simulation experience listed under Experience as a proper entry: "Accounting Simulation Project — Skarion Manufacturing LLC (Jan 2026 – Present)" with 5 bullet points
4. ✅ Skills section: Accounts Payable, Accounts Receivable, Bank Reconciliation, Month-End Close, General Ledger, GAAP, Accrual Accounting, Microsoft Excel, QuickBooks Online
5. ✅ Featured section: Link to a summary document or PDF portfolio of simulation work
6. ✅ Certifications: Any relevant certs (QuickBooks ProAdvisor, Excel MOS, Bookkeeping certificate) listed
7. ✅ Open to Work: Set to "Recruiters only" (not the green banner — that signals desperation)
8. ✅ Connect with accounting recruiters at Robert Half, Kforce, Ledgent Finance — personalized note, not the generic request
9. ✅ Follow target companies' pages and engage (comment substantively, not "Great post!")

**Resume Bullet Formula:**
"[Action verb] [specific task] [quantified result or scope]"

**Before and After:**
- ❌ "Helped with month-end close" 
- ✅ "Executed 12 adjusting journal entries (depreciation, accruals, prepaids) during January month-end close; contributed to financial package delivered on Day 5 of a 5-day close cycle."

**5 Strong Action Verbs for Accounting Bullets:**
- Reconciled · Posted · Processed · Analyzed · Identified (error, discrepancy, variance)

---

### Chunk 74 — WHAT TO RESEARCH BEFORE THE INTERVIEW
**Type:** Content + Checklist
**Placement:** Module 09

**The 20-minute pre-interview research framework:**

**10 minutes on the company:**
1. Their industry (manufacturing, services, healthcare, tech) — how does accounting differ in their context?
2. Their size (headcount, revenue if public) — are you a team of 2 or a department of 40?
3. Recent news (Google "company name news 2025") — have they raised capital, acquired someone, had layoffs, won a contract?
4. Glassdoor reviews — what do current/former employees say about the accounting team culture?
5. Their fiscal year-end — December or non-December? Non-December close means you won't be slammed during the holidays.

**5 minutes on the role:**
6. What accounting functions does the JD emphasize? AP, AR, close, payroll? Match your strongest stories to those.
7. What software do they list? If it's NetSuite, Sage, or SAP — Google "how NetSuite differs from QuickBooks" so you can speak intelligently about learning curves.
8. What level of autonomy does the role have? "Supports the controller" = high oversight. "Owns reconciliations" = independence expected.

**5 minutes on your interviewer:**
9. LinkedIn: What is their background? Did they start in public accounting? Industry? How senior are they?
10. What questions will they ask? If they're the controller, they'll go technical. If they're HR, they'll go behavioral.

---

### Chunk 75 — SPEED DRILL: 60-Second Verbal Answers
**Type:** Timed audio/text challenge
**Placement:** Module 09

**10 questions. Student reads the question. Has 60 seconds to type a full STAR answer.**
**The clock is visible. No pausing.**

1. What is a bank reconciliation and how do you do one?
2. Walk me through a journal entry from source document to GL posting.
3. What do you do if a vendor invoice doesn't match the PO?
4. What is accrual accounting?
5. Give me an example of an adjusting entry.
6. What is COGS and how does it differ from operating expenses?
7. What is the difference between gross profit and net income?
8. What happens to retained earnings at year-end?
9. How do you apply a customer payment to an open invoice?
10. What is the allowance method for bad debt?

**Scoring:** The system scores based on word count (minimum 60 words = full attempt) and presence of key terms (seeded keyword list per question). Full credit for attempt. Bonus displayed (but not required) for perfect keyword hits.

**The goal is not to grade the answers — it is to force the student to say accounting words out loud, quickly, without hesitation. That is the real interview condition.**

---

## SECTION G — MORE VIDEO SCRIPTS (Chunks 76–82)

### Chunk 76 — VIDEO: "The STAR Method in 4 Minutes — With Real Accounting Examples"
**Duration:** 4 minutes

| TIME | NARRATION | VISUAL |
|---|---|---|
| 0:00–0:20 | *"Every behavioral interview question is a test of one thing: can you give me a specific, believable story with a real outcome? The STAR method is the structure that forces you to do that."* | Text: S — T — A — R appearing letter by letter |
| 0:20–1:00 | *"Situation: the context. Who, what, where, when. One to two sentences maximum. Task: what were you specifically responsible for in that situation? Action: the steps YOU took — not the team, not your manager — you. And Result: what happened because of your actions. Numbers if possible."* | Four-panel grid animating in: each letter with its definition |
| 1:00–2:30 | *"Here is the weak version and the strong version of the same story. Weak: 'I found an error in the books and fixed it.' That is not a story. Here is the strong version: During January's bank reconciliation, QuickBooks showed $34,000 more cash than the bank statement — the Situation. My task was to trace the discrepancy before the books could close. I compared every deposit line by date and amount and found a $10,547.10 customer payment from Southeast Broadband that had been entered twice. I confirmed the bank only received it once, then posted the correcting entry — debit AR, credit Cash — and the reconciliation balanced to $336,250."* | Split screen: weak answer (grey, vague) vs. strong answer (color-highlighted with specific numbers). |
| 2:30–3:30 | *"Notice: the strong answer takes 45 seconds. It names a real number, a real company, a real journal entry. It doesn't say 'I'm detail-oriented.' It proves it. That's the only thing that works in a technical interview."* | Timer graphic showing 45 seconds. |
| 3:30–4:00 | *"Your job now: take the 8 questions in the next section and write STAR answers using your Skarion simulation numbers. Don't memorize them word for word — internalize the structure."* | Transition to Chunk 68. |

---

### Chunk 77 — VIDEO: "How to Research a Company in 20 Minutes Before an Interview"
**Duration:** 3 minutes
**Script summary:** Walk through the exact 20-minute research framework from Chunk 74 on screen, using a fictional company as the demo. Show Google News search, LinkedIn company page, Glassdoor reviews, and a job description side-by-side. End with the three things to always say in the first 5 minutes that prove you did your homework.

**Reference images:** Google search results page (showing news hits), LinkedIn company page layout, Glassdoor rating screenshot, job description with key phrases circled.

---

### Chunk 78 — VIDEO: "Salary Negotiation — What to Say When They Make the Offer"
**Duration:** 3.5 minutes
**Script summary:** Role-play format. Two characters: interviewer (off-screen voice) and candidate (on-screen text showing exact words). Walk through all three salary moments from Chunk 72: the application form, the verbal offer, and the benefits negotiation. Include the exact counter-offer phrase word-for-word.

---

### Chunk 79 — VIDEO: "How to Use AI Tools in Accounting — Without Getting in Trouble"
**Duration:** 4 minutes
**Script outline:**

| TIME | NARRATION | VISUAL |
|---|---|---|
| 0:00–0:30 | *"Every accounting firm is now using some form of AI. The question isn't whether you'll work alongside AI tools — it's whether you understand what they can and can't do."* | Montage of AI accounting product logos: Intuit AI, Sage Copilot, Xero AI. |
| 0:30–1:30 | *"What AI is genuinely good at right now: categorizing transactions automatically, matching invoices to POs at scale, flagging anomalies in large GL exports, and auto-generating first-draft journal entry memos. If you have 5,000 expense line items and need them mapped to GL accounts, AI does that faster than any human."* | Screen: AI categorization UI in QuickBooks or Xero. |
| 1:30–2:30 | *"What AI is not good at: exercising judgment on anything context-dependent. Did the expense belong in this period? Is this really an asset or an expense? Is this discount legitimately earned? Those are judgment calls. AI doesn't know your company's accounting policies. It doesn't know the contract terms. It doesn't know what the CFO cares about. You do."* | Bold text: "AI handles volume. You handle judgment." |
| 2:30–3:30 | *"For your interview: 'I use AI tools for the volume layer — categorization, anomaly flagging, first-draft memos. But every AI output gets reviewed before it hits the ledger. The AI suggests, I verify, I post.' That answer shows you're current AND you understand that responsibility can't be delegated to software."* | Text: The three-step rule: AI suggests → human reviews → human posts. |
| 3:30–4:00 | *"Practically: learn how to use ChatGPT to write your reconciliation memo drafts, how to use Excel Copilot to write SUMIFS formulas, and how to spot when the AI-assigned transaction category is wrong. That combination makes you more productive, not replaceable."* | Screen: ChatGPT chat showing a reconciliation memo being drafted. |

---

### Chunk 80 — VIDEO: "Your First Week on the Job — Don't Do These Things"
**Duration:** 3.5 minutes

**5 things new accounting hires do that tank their reputation immediately:**
1. Post an entry without checking with the manager first
2. Assume they know how the company's system works because it looks like something they've seen before
3. Fix a mistake quietly instead of disclosing it
4. Ask the same question twice without writing down the answer the first time
5. Miss a deadline and not flag it until after it's already late

**5 things that build a great reputation in the first week:**
1. Ask to see last month's close package and read every entry
2. Build your own COA cheat sheet on Day 1
3. Confirm every task assignment in writing with the due date
4. Never send anything without reviewing it twice
5. Send a Friday wrap-up email to your manager with what you completed and what's pending

---

### Chunk 81 — VIDEO: "What the CPA Exam Is — Do You Need It?"
**Duration:** 3 minutes

**Content:**
- What CPA stands for, who the AICPA is
- The 4 exam sections: FAR (Financial Accounting & Reporting), AUD (Auditing), REG (Regulation/Tax), BAR or ISC (new 2024 structure)
- Who needs it: public accounting (audit, tax) — generally required. Industry accounting — often not required but valued
- Timeline and cost: typically 18 months to complete all 4 sections, ~$3,000–$5,000 in exam fees + prep materials
- The real question: Do you want to go into public accounting or industry? Your answer determines whether the CPA is essential or optional
- Strong advice: Even if you don't need it, start FAR in year 1. It reinforces everything from this course. FAR covers the exact same content: GAAP, accounting cycle, financial statements, revenue recognition.

---

### Chunk 82 — VIDEO: "Building Your Accounting Portfolio Before Your First Job"
**Duration:** 4 minutes

**What a portfolio is for accounting:**
Not a visual design portfolio. A document that proves you did real work.

**What to include:**
1. A one-page simulation summary: "I performed the following tasks for Skarion Manufacturing's January–March close cycle" — with bullet points and specific dollar figures
2. Screenshots of completed reconciliations (with numbers visible but company name anonymized if needed)
3. A completed financial statement package (P&L, Balance Sheet, Cash Flow) produced during the course
4. Your STAR answer document — 8 questions, written out, with specific numbers
5. Your salary research notes (shows you think strategically, not just technically)

**Where to keep it:**
- A PDF shared via Google Drive link in your LinkedIn profile
- A Notion page with embedded tables and screenshots
- A GitHub repo (for tech-forward firms) — shows comfort with documentation tools

**The one sentence that kills interviews:** "I don't have anything to show you yet." You do. It's this course. Present it like the work it is.

---

## SECTION H — CAPSTONE & COURSE COMPLETION (Chunks 83–90)

---

### Chunk 83 — CAPSTONE PROJECT: "Full Quarter Close — Skarion Manufacturing Q1 2026"
**Type:** `scenario_lab` (largest single assignment in the course)
**Estimated time:** 3–4 hours
**This is the boss level.**

**Setup:**
The student receives the complete Q1 2026 data package for Skarion Manufacturing:
- 90 days of transactions (summarized by week, not individual entries)
- All vendor invoices (AP)
- All customer invoices (AR) with payment history
- Bank statements for January, February, and March
- Payroll summaries for each month
- The list of fixed assets and depreciation schedule

**Deliverables (submitted in text fields and the live spreadsheet):**
1. Month-end close journal entries for all three months (all adjusting entries posted correctly)
2. Three-month bank reconciliation pack (all three months balanced)
3. Q1 P&L (three-column: Jan, Feb, Mar, Q1 Total)
4. Q1 Balance Sheet as of March 31
5. Q1 Cash Flow Statement (simplified indirect method)
6. A 400-word Controller's Memo: "Q1 Financial Summary and Observations for Leadership" — using the actual numbers from the financial statements, pointing out the two biggest trends, one concern, and one recommendation

**This is the portfolio piece. The student should save their Controller's Memo as a sample writing deliverable for interviews.**

---

### Chunk 84 — MOCK INTERVIEW: Full-Length Simulation
**Type:** `exercise`
**Placement:** Module 09, near the end

**Instructions:**
This is a 30-minute mock interview to be conducted with a study partner, mentor, or self-recorded.

**The interview pack (downloadable):**
- 5 questions for the "interviewer" to ask (one from each category: technical, behavioral, scenario, software, "why accounting")
- A scoring rubric for each question (the "interviewer" scores 1–5 on Accuracy, Specificity, Workflow, Judgment, Communication)
- A self-assessment sheet for after the interview: what landed, what felt weak, what to re-practice

**If you don't have a partner:**
Record yourself on your phone. Watch it back. Count the filler words ("um," "basically," "kind of"). If you say any of those more than 3 times in a 60-second answer, you need another take.

---

### Chunk 85 — PORTFOLIO ASSEMBLY GUIDE
**Type:** Checklist + Downloadable Templates
**Placement:** Module 09

**Checklist (14 items):**
1. ✅ Simulation summary document (1 page, PDF)
2. ✅ Q1 Controller's Memo (from Chunk 83 capstone)
3. ✅ Bank reconciliation screenshot (January, balanced to $336,250)
4. ✅ Q1 P&L PDF
5. ✅ STAR answer document (8 questions written out)
6. ✅ LinkedIn profile updated with simulation experience
7. ✅ Resume bullet points rewritten with action verb + scope + result
8. ✅ Salary research documented ($X–$Y for your city, source cited)
9. ✅ 3 target companies researched (company name, role, what you'd say about them)
10. ✅ 90-second intro script written and rehearsed
11. ✅ Mock interview completed and scored
12. ✅ Referrals or connections sought (LinkedIn accounting recruiters followed)
13. ✅ QuickBooks ProAdvisor free certification started/completed
14. ✅ Excel skills documented in resume/LinkedIn (VLOOKUP, SUMIFS, PivotTables — with example)

**Downloadable templates to create:**
- `Portfolio_Summary_Template.docx`
- `Controllers_Memo_Template.docx`
- `STAR_Answer_Worksheet.docx`
- `Resume_Bullet_Rewrite_Template.docx`

---

### Chunk 86 — THE ACCOUNTING JOB SEARCH: A 30-Day Plan
**Type:** Timeline + Content
**Placement:** Module 09

**Week 1 — Foundation**
- Day 1: Finalize LinkedIn profile and resume
- Day 2: Build the portfolio PDF
- Day 3: Research 10 target companies (5 local, 5 remote)
- Day 4: Set up job alerts on LinkedIn, Indeed, Robert Half, Ledgent Finance, Kforce
- Day 5: Connect with 5 accounting recruiters on LinkedIn with personalized note

**Week 2 — Outreach**
- Apply to 3 roles per day (quality over quantity — tailor each cover letter)
- Follow up on any application submitted more than 10 days ago
- Comment substantively on 2 accounting/finance LinkedIn posts per day

**Week 3 — Interviews Begin**
- Use the 20-minute pre-interview research framework (Chunk 74) before every call
- Practice the 90-second intro before every interview (out loud, not in your head)
- Send a thank-you email within 2 hours of every interview

**Week 4 — Negotiation & Decision**
- If you have an offer: wait 48 hours before accepting, counter at 10–15% above
- If you don't have an offer: review your application-to-interview conversion rate. If below 10%, rewrite the resume. If interview-to-offer is low, re-practice the STAR answers.

---

### Chunks 87–88 — FINAL QUIZ: Full Course Assessment
**Type:** Comprehensive gamified quiz
**30 questions pulling from all 9 modules — interleaved and mixed**

*Questions cover: accrual accounting, T-accounts, COA classification, journal entries (8 scenarios), bank reconciliation math, AR aging, bad debt, payroll calculations, depreciation, adjusting entries, revenue recognition, STAR method identification, Excel function use cases, and two ethical scenario judgment questions.*

**Scoring:** 
- 27–30: "Elite level — you're ready."
- 22–26: "Strong. Review the modules flagged below."
- Below 22: "Don't interview yet. Go back to [specific modules based on missed questions]."

---

### Chunk 89 — WHAT HAPPENS AFTER YOU GET THE JOB
**Type:** Content
**Placement:** Final content chunk before completion

**The three things that determine year-1 success:**
1. **You document everything.** Every entry has a ticket number or an email chain. Every adjustment has a supervisor sign-off. You never post without paper.
2. **You ask before the deadline, not after.** If something doesn't make sense and you're 6 hours from the trial balance run, you raise it now, not at 11 PM.
3. **You build systems, not just process tasks.** Don't just do the bank rec — build the template so anyone could do it from your notes. That's what gets you from staff to senior.

**The mindset shift from student to professional:**
- As a student, making a mistake is a learning moment.
- As an accountant, making a mistake means someone's financials are wrong and real decisions get made on bad information.
- The bridge between those two is documentation, verification, and escalation. Those aren't bureaucratic habits — they're the reason accounting is trustworthy.

---

### Chunk 90 — COURSE COMPLETION & CERTIFICATE
**Type:** Completion screen
**SCORM trigger:** `cmi.core.lesson_status = "completed"` fires on reaching this chunk

**What the student sees:**
- Animated completion banner: "Skarion Accounting Track — Complete"
- Summary card: Modules completed, total chunks, estimated hours
- Certificate of Completion (rendered in HTML, print-to-PDF button)
  - Name field (student enters their name)
  - Completion date (auto-filled)
  - Course title and description
  - Signed: "Skarion Learning — Accounting Track"
- Three action buttons:
  - "Download Certificate (PDF)"
  - "View My Portfolio Checklist"
  - "Start the 30-Day Job Search Plan"

---

## Engineering Specs for New UI Components

### New chunk types needed in player.js (additions to Phase 1 spec)

| `"type"` | Description | Satisfied when |
|---|---|---|
| `"spreadsheet_lab"` | jspreadsheet CE in-browser grid | Target cell formula condition true |
| `"timed_drill"` | Quiz with per-question countdown | All questions attempted |
| `"script_builder"` | Multi-field text form with word counter and preview | Word count in valid range + submitted |
| `"completion"` | Certificate screen with name input and print button | Name entered + print triggered |

### jspreadsheet CE implementation notes
- Load from CDN: `https://bossanova.uk/jspreadsheet/v4/`
- Use `jspreadsheet.setEditable(el, false)` for locked cells
- Use `jspreadsheet.setValue(el, row, col, value)` for pre-filled data
- Use `onChange` callback to check success conditions
- Style the container div with `border: 1px solid #d0d0d0; border-radius: 4px; overflow: hidden;`
- The Excel "feel" requires the toolbar to be visible — include at minimum: Undo, Redo, Format as Number, Format as Currency, Bold

### SkarionBooks upgrade implementation notes
- Slide-in side panels: `transform: translateX(100%)` → `translateX(0)` on `transition: transform 0.3s ease`
- Toast notifications: absolute positioned, bottom-right, `opacity: 0` → `1` on entry post, auto-dismiss after 3 seconds
- Report generation: Use `window.print()` with a `@media print` CSS block that hides the nav and shows only the report content
- Dashboard KPI counters: `requestAnimationFrame` count-up animation from 0 to the target value over 1.2 seconds on page load

---

## Handover Summary for GLM

**What you are implementing (Phase 3 / Chunks 61–90):**

| Chunk Range | Section | Primary Task |
|---|---|---|
| 61–65 | In-browser lab upgrades | Add `spreadsheet_lab` chunk type in player.js using jspreadsheet CE; overhaul SkarionBooks UI |
| 66–75 | Real interview prep | STAR behavioral Q&A bank, real firm questions, salary negotiation, LinkedIn optimization |
| 76–82 | Additional video scripts | 7 more AV-format scripts: STAR method, company research, salary, AI in accounting, first week, CPA, portfolio |
| 83–90 | Capstone & completion | Q1 full close capstone, mock interview pack, portfolio assembly, job search plan, final quiz, certificate |

**Files to create/modify:**
- `engine/player.js` → add `spreadsheet_lab`, `timed_drill`, `script_builder`, `completion` renderers
- `engine/theme.css` → add spreadsheet_lab container styles, timed drill UI, completion screen styles
- `skarionbooks/` → full UI overhaul (5 screens: Dashboard, COA, Enter Bills, Receive Payments, Reports)
- `modules/09-interview-prep/content.json` → massive expansion using all chunks from Section F
- `modules/04-ar-and-billing/content.json` → add spreadsheet_lab chunk for AR aging (Chunk 63)
- `modules/05-bank-reconciliation-lab/content.json` → add spreadsheet_lab chunk for bank rec (Chunk 62)
- `modules/03-ap-and-payroll/content.json` → add spreadsheet_lab chunk for payroll (Chunk 64)
- New folder: `courses/accounting-track/capstone/` → Q1 data package for Chunk 83
- New folder: `courses/accounting-track/portfolio-templates/` → Word doc templates for Chunk 85

**Do not rebuild the build_course.py — it already handles everything.**
**Do not change the module folder names — they are locked.**
**Add jspreadsheet CE via CDN in template.html, not as a local file.**
