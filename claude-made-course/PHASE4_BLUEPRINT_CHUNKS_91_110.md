# Skarion Accounting Track — Phase 4 Final Blueprint
### Chunks 91–110 · Gap Analysis · New Modules · Video Production Plan · AI Tools

> **Context for GLM:** Phases 1–3 are built or in progress (Chunks 1–90).
> This is the final phase. It closes every gap identified from competitor research,
> adds the topics ALL other bootcamps skip, and prepares the full video production pipeline.
> After this, the course is complete.

---

## COMPETITOR GAP ANALYSIS
### What Every Other Accounting Bootcamp Skips (And We Won't)

Research across Udemy, Coursera, Noble Desktop, Graduate School USA, and CourseCareers
reveals a consistent pattern of what gets left out:

| Gap | Why Competitors Skip It | Why We're Adding It |
|---|---|---|
| **Financial Ratios & Analysis** | "That's FP&A, not bookkeeping" | Every interview asks "what does this P&L tell you?" You need ratios. |
| **Cost/Managerial Accounting basics** | "Taught in Accounting II" | Job descriptions routinely ask for cost center tracking, variance analysis |
| **Reading the Income Statement like a business owner** | Assumed knowledge | Students learn to produce financials but not interpret them |
| **Sales tax, use tax, 1099 basics** | "Tax changes too often" | These come up in the first week on any AP/AR job |
| **Basic financial modeling / scenario analysis** | "That's advanced" | Even entry-level roles now ask for Excel forecast models |
| **Understanding an audit** | "That's auditor territory" | Every accountant interacts with auditors; knowing the process removes fear |
| **Reading financial news** | Never taught | An accountant who can't connect business news to accounting treatment is a liability |
| **Soft close vs. hard close** | Assumed knowledge | Massive confusion in first jobs |
| **Intercompany transactions** | "Too advanced" | Common even at mid-size companies with subsidiaries |
| **Chart of accounts design** | Assumed | Every company has a different COA; knowing how they're built is a superpower |

---

## NEW MODULES: What We're Adding

---

## MODULE 10 — Financial Ratios & Reading the Numbers Like a CFO
**Chunks: 91–93** | **Estimated time: 3 hours**
*This is the module that separates a bookkeeper from an accountant.*

### Chunk 91 — VIDEO + Content: "The 8 Ratios Every Accountant Must Know Cold"
**Type:** `video` + rich content
**Duration:** 5 minutes
**Learning objective:** Student can calculate and interpret 8 financial ratios from a real P&L and Balance Sheet.

**The 8 ratios (with Skarion Manufacturing numbers throughout):**

| Ratio | Formula | Skarion January | What It Tells You |
|---|---|---|---|
| **Gross Profit Margin** | (Revenue − COGS) ÷ Revenue | ($480K − $140K) ÷ $480K = **70.8%** | How profitable the core service is before overhead |
| **Operating Profit Margin** | Operating Income ÷ Revenue | $242K ÷ $480K = **50.4%** | Profitability after all operating costs |
| **Current Ratio** | Current Assets ÷ Current Liabilities | $1.6M ÷ $340K = **4.7x** | Can the company pay short-term bills? >2x is healthy |
| **Quick Ratio** | (Cash + AR) ÷ Current Liabilities | ($336K + $997K) ÷ $340K = **3.9x** | More conservative liquidity (excludes prepaid/inventory) |
| **DSO (Days Sales Outstanding)** | AR ÷ (Revenue ÷ 365) | $997K ÷ ($4.8M ÷ 365) = **75.8 days** | How long to collect; >60 days flags a cash risk |
| **DPO (Days Payable Outstanding)** | AP ÷ (COGS ÷ 365) | $280K ÷ ($1.68M ÷ 365) = **60.8 days** | How long before you pay vendors |
| **Debt-to-Equity** | Total Liabilities ÷ Total Equity | $820K ÷ $2.1M = **0.39x** | Financial leverage; <1x is conservative |
| **Return on Assets** | Net Income ÷ Total Assets | $242K ÷ $4.02M = **6.0%** | How efficiently assets generate profit |

**Video script outline (AV format):**

| TIME | NARRATION | VISUAL |
|---|---|---|
| 0:00–0:30 | *"A controller doesn't just close the books. They read them. These 8 ratios are how senior accountants immediately know whether a month was actually good or just looks good on the surface."* | Skarion January P&L and Balance Sheet side by side on screen. |
| 0:30–2:30 | Walk through each ratio, calculating live on screen with Skarion's numbers. Narrate what each number means in plain language. | Screen: Calculator cells filling in on a clean worksheet. Each ratio animating in with its result. Color coding: green = healthy, yellow = watch, red = concerning. |
| 2:30–4:00 | *"Here is the real skill: knowing when a ratio changes and why. Gross margin dropped from 70.8% to 65.2% between January and February. That tells you COGS went up faster than revenue — before you even look at the detail."* | Animation: ratio changing month over month. Arrow pointing to COGS line. |
| 4:00–5:00 | *"In the lab, you'll calculate all 8 ratios from Skarion's Q1 data and write one sentence of interpretation for each. That sentence is the start of your controller's commentary."* | Transition to Chunk 92 spreadsheet lab. |

**Research direction for GLM:**
- The Skarion Q1 financial data from the Capstone (Chunk 83) should be the data source.
- Search "financial ratio analysis tutorial CFO" for the framing — the goal is to sound analytical, not academic.
- Reference: Warren Buffett's annual letter ratios are the gold standard for plain-language ratio interpretation.

---

### Chunk 92 — SPREADSHEET LAB: Ratio Dashboard (Live in Browser)
**Type:** `spreadsheet_lab` (jspreadsheet CE)
**What the student builds:**

A ratio dashboard spreadsheet with three tabs:
- **Tab 1:** January financials (P&L + Balance Sheet pre-filled, locked)
- **Tab 2:** Ratio Calculations — student enters each formula, result auto-calculates
- **Tab 3:** Trend Dashboard — February and March data pre-filled; student calculates ratios for all three months and the trend appears as a sparkline (or simple color-coded table if sparklines aren't in jspreadsheet)

**Validation:** All 8 ratios must be within 0.1% of the correct answer. On completion, a banner: "Ratio Analysis Complete — You're reading financials like a CFO."

---

### Chunk 93 — "What the Numbers Are Trying to Tell You — Reading the Story"
**Type:** Content + Gamified Quiz
**The hardest skill: interpreting a set of ratios as a narrative**

**Three scenario cards (student picks the right interpretation):**

**Scenario A:** Revenue up 15%, gross margin down 8%, DSO up from 45 to 72 days.
- What's happening? (Revenue growth is hollow — COGS rising faster, clients paying slower. Cash is about to tighten despite the revenue number looking good.)
- Wrong answers: "Business is growing well" / "Costs are under control"

**Scenario B:** Net income up 20%, current ratio down from 3.2x to 1.4x, DPO down from 45 to 22 days.
- What's happening? (Profitability improved but liquidity is deteriorating — the company is paying vendors faster than it's collecting, and cash is being squeezed.)

**Scenario C:** Gross margin stable, operating margin declining, return on assets declining.
- What's happening? (Operating expenses are growing — probably headcount or SG&A — eating into profits that the core business is generating just fine.)

**Quiz (4 questions):** Apply ratio interpretation to Skarion's Q1 data — calculate which quarter had the best gross margin, worst DSO, and identify the one ratio that should concern the controller most.

---

## MODULE 11 — Cost Accounting & Managerial Basics
**Chunks: 94–96** | **Estimated time: 2.5 hours**
*The accounting that runs the inside of the business, not the outside.*

### Chunk 94 — "Job Costing vs. Process Costing — Which One Applies to You"
**Type:** Content + Comparison + Skarion Lab
**Why it matters:** Every services firm and manufacturer tracks costs differently. Getting this wrong means your P&L by project is useless.

**Theory:**
- **Job Costing:** Costs tracked per specific job/project. Every cost (labor, materials, overhead) assigned to a specific job number. Skarion's model — every fiber design project has its own job code.
- **Process Costing:** Costs averaged across a continuous production process. Used in manufacturing (paint factory, oil refinery). Not relevant to Skarion but important to recognize.
- **Direct vs. Indirect Costs:**
  - Direct: easily traced to a specific job (offshore drafting hours on Project Alpha)
  - Indirect/Overhead: cannot be directly traced (office rent, utilities, management salaries) — must be *allocated*

**Skarion Job Costing Lab:**
- Three active projects: Tennessee Corridor ($1.2M contract), Texas Long-Haul ($800K), Virginia Metro ($350K)
- Student allocates costs correctly to each project:
  - Direct: offshore labor hours × rate per project
  - Direct: software license costs allocated by project hours consumed
  - Indirect overhead: office rent and utilities allocated by % of total project revenue
- Calculate actual cost vs. contract value for each project → **gross profit by project**

**The key insight:** Skarion's 70.8% gross margin overall might hide that Tennessee Corridor is making 82% and Virginia Metro is losing money at -12%. Job costing reveals this.

---

### Chunk 95 — "Variance Analysis — What Went Wrong and Where"
**Type:** Content + Flip Cards + Journal Entry Builder
**This is the skill that gets accountants promoted to senior faster than anything else.**

**Theory:**
- **Budget vs. Actual:** Every company has a budget. Every month, actual results differ. Variance analysis explains why.
- **Favorable variance (F):** Actual is better than budget (lower cost or higher revenue)
- **Unfavorable variance (U):** Actual is worse than budget (higher cost or lower revenue)
- **Price variance:** The cost per unit was different from budget
- **Volume/Efficiency variance:** You used more or fewer units than budgeted

**Skarion January Example:**
- Budgeted offshore drafting cost: $38.00/mile × 3,200 miles = $121,600
- Actual offshore drafting cost: $41.50/mile × 3,380 miles = $140,270
- Total variance: $18,670 Unfavorable
- **Price variance:** ($41.50 − $38.00) × 3,380 miles = $11,830 U (paid more per mile than budgeted)
- **Volume variance:** (3,380 − 3,200) × $38.00 = $6,840 U (used more miles than budgeted)

**Flip Cards (5):** Budget variance, Price variance, Volume variance, Favorable, Unfavorable — with Skarion examples for each.

**Journal Entry Builder:** Record the journal entry that would have prevented the variance from going undetected — a mid-month review entry that flags the COGS overrun and notifies the PM.

---

### Chunk 96 — "Cost Centers, Profit Centers, and How Big Companies Think"
**Type:** Content + Quiz
**Why it matters:** Once you move beyond a 10-person company, accounting is organized by segment. Understanding this gets you hired at larger firms.

**Theory:**
- **Cost Center:** A department or division that incurs costs but doesn't directly generate revenue. Examples: IT, HR, Legal, the accounting team itself.
- **Profit Center:** A unit that generates its own revenue and has its own P&L. Examples: each regional office, each product line.
- **Investment Center:** A profit center that also controls its own capital investment decisions.

**How this shows up in accounting:**
- Cost center accounting requires allocating shared costs (rent, utilities, management overhead) across departments
- A simple allocation method: allocate by headcount percentage, by square footage, or by revenue percentage
- **Intercompany transactions:** when a cost center in one entity charges another entity — this creates an intercompany receivable/payable that must be eliminated in consolidation

**Skarion Context:** If Skarion expanded to two offices (Virginia and Texas), the Virginia office doing HLD and the Texas office doing LLD would each be profit centers. The IT team supporting both would be a cost center. The controller needs to allocate IT costs to both offices fairly.

**Quiz (3 questions):** Allocate Skarion's $8,000/month of IT and office overhead costs across three cost centers using headcount, revenue, and square footage methods — which method produces the most equitable allocation and why?

---

## MODULE 12 — Tax Basics for Non-Tax Accountants
**Chunks: 97–98** | **Estimated time: 1.5 hours**
*You don't need to be a tax accountant. You need to not make their job harder.*

### Chunk 97 — "The Taxes Every Staff Accountant Encounters"
**Type:** Content + Flip Cards
**What this module is NOT:** A comprehensive tax guide. Tax changes constantly and requires a specialist.
**What this module IS:** The 6 tax concepts you WILL encounter in the first year that you must handle correctly.

**The 6:**

**1. Payroll Tax Deposits**
- FICA (Social Security + Medicare) must be deposited with the IRS on a semi-weekly or monthly schedule depending on your payroll size
- The deposit is separate from the payroll journal entry — you record the liability, then deposit it
- Late deposits trigger a 2–15% penalty. This is the #1 tax penalty entry-level accountants accidentally cause.
- **Skarion context:** Monthly deposit for $6,256 employer FICA + $12,056 employee FICA withheld = $18,312 deposited to IRS via EFTPS by the 15th of the following month

**2. Sales Tax (for product-selling companies)**
- Collected from customers at point of sale, remitted to state monthly/quarterly
- It's NOT revenue — it's a liability (Sales Tax Payable) from the moment it's collected
- Skarion is a services firm so doesn't collect sales tax on designs, but if they sold physical cables/equipment they would
- **Journal entry:** Dr Cash $106,000 / Cr Revenue $100,000 / Cr Sales Tax Payable $6,000

**3. Use Tax**
- When you buy taxable goods from an out-of-state vendor who doesn't charge sales tax, you owe use tax to your state
- Most companies ignore this until an audit — accountants should track it
- **Skarion context:** If Skarion buys $12,000 of survey equipment from an Ohio vendor with no Virginia sales tax charged, they owe Virginia use tax ($12,000 × 5.3% = $636)

**4. 1099 Filing**
- Any contractor paid more than $600 in a year must receive a 1099-NEC by January 31
- The accountant must track all contractor payments and prepare 1099s at year-end
- **Skarion context:** Global CAD Solutions receives ~$600,000/year in payments — they receive a 1099-NEC annually

**5. W-2 Preparation**
- All W2 employees receive their W-2 by January 31
- The data comes from the payroll records the accountant maintains all year
- The W-2 must match the payroll tax deposits exactly — discrepancies trigger IRS notices

**6. Estimated Tax Payments (for pass-throughs)**
- If Skarion is an LLC or S-Corp, the owner pays quarterly estimated taxes on their share of profit
- The accountant prepares the calculation: prior year's tax liability ÷ 4, paid in April/June/September/January
- This is often confused with the business's payroll taxes — they are completely different

**Flip Cards (6):** One card per concept, front = scenario, back = correct accounting treatment and the penalty for getting it wrong.

---

### Chunk 98 — "Tax vs. Book Differences — Why Two Sets of Numbers Exist"
**Type:** Content + Quiz
**The concept most self-taught accountants never learn and most interviews touch on.**

**Theory:**
- **Book accounting** follows GAAP — it's for investors, banks, and management
- **Tax accounting** follows IRS rules — it's for the tax return
- These two are different. That's legal, expected, and managed through **deferred tax assets and liabilities**

**The most common differences:**
1. **Depreciation:** GAAP uses straight-line. IRS often allows accelerated depreciation (MACRS, Section 179 immediate expensing). Same asset, different annual expense for book vs. tax.
2. **Revenue recognition:** GAAP recognizes on delivery (ASC 606). Tax sometimes allows installment method — recognize revenue as cash is received.
3. **Bad debt:** GAAP uses the allowance method (estimate and reserve). Tax only allows write-off when debt is actually uncollectible (specific charge-off method).
4. **Meals & entertainment:** 100% book expense; only 50% deductible for tax (or 0% for entertainment post-2017 TCJA).

**The key concept:**
- When GAAP records more income than the tax return: creates a **Deferred Tax Liability** (you'll pay this tax later)
- When GAAP records less income than the tax return: creates a **Deferred Tax Asset** (you've prepaid tax you'll use later)

**Quiz (3 questions):** 
1. Skarion depreciates a $70,000 server over 7 years straight-line (GAAP: $10,000/year). For tax, they elect 100% bonus depreciation in Year 1. What is the deferred tax liability created in Year 1 (assume 21% tax rate)?
2. Skarion writes off $112,700 of TeleCom Builders' AR under GAAP using the allowance method in Q3. For tax, they can't take the deduction until the debt is legally uncollectible in Q4. When does the deferred tax asset reverse?
3. Skarion takes the team out for dinner — $840 restaurant bill. How much is deductible for tax?

---

## MODULE 13 — Financial Modeling Fundamentals
**Chunks: 99–101** | **Estimated time: 3 hours**
*The skill that opens doors to FP&A, finance teams, and senior accounting roles.*

### Chunk 99 — VIDEO + Content: "What a Financial Model Actually Is"
**Type:** `video` + content
**Duration:** 4 minutes
**The key distinction:** A financial model is not a static report. It's a living Excel file with connected assumptions — change one number and every output updates automatically.

**Video script outline:**

| TIME | NARRATION | VISUAL |
|---|---|---|
| 0:00–0:30 | *"A budget is what we plan to spend. A financial model is a tool that answers: what happens to our profit if revenue grows 20%? What if COGS rises 5%? What if we hire two more PMs? A model makes those questions answerable in seconds."* | Screen: A P&L. Then input cells highlighted in blue. Then results changing as inputs change. |
| 0:30–1:30 | *"The anatomy of any model: Inputs (blue cells — assumptions, rates, headcount), Calculations (formulas — never hard-coded numbers), and Outputs (the financial statements that result). The discipline is: never put a number in a calculation cell. Every number that could change is an assumption."* | Animation: three layers appearing — blue inputs at top, formula engine in middle, output statements at bottom. |
| 1:30–3:00 | *"Here is a simple revenue model for Skarion: Miles of HLD completed × price per mile = Revenue. Completion rate × total contracted miles × average price. Change the completion rate from 75% to 85% and revenue jumps $192,000. That is the model."* | Screen recording: Live Excel model showing the formula structure. Changing one input cell, watching all downstream numbers update. |
| 3:00–4:00 | *"In the lab, you'll build a 3-statement model for Skarion's next quarter — revenue assumptions, COGS as a percentage of revenue, a simplified balance sheet and cash flow. The model will have 12 assumption inputs and 40+ connected outputs."* | Transition to Chunk 100 spreadsheet lab. |

**Research direction for GLM:**
- Search "3-statement financial model tutorial Excel" — the Wall Street Prep and Corporate Finance Institute (CFI) free resources are the best reference for structure.
- The model should be buildable in jspreadsheet CE (for the in-browser version) OR downloadable as an Excel template.
- Recommend: provide both — a `spreadsheet_lab` chunk for exploration, and a downloadable `Template_07_Three_Statement_Model.xlsx` for full-featured Excel work.

---

### Chunk 100 — SPREADSHEET LAB: Build the Skarion 3-Statement Model
**Type:** `spreadsheet_lab` (jspreadsheet) + downloadable Excel
**This is the most advanced Excel exercise in the course.**

**Structure (6 tabs):**
- **Tab 1: Assumptions** (all blue input cells) — Revenue growth rate, COGS %, headcount additions, average salary, capex plan, loan repayment schedule
- **Tab 2: Income Statement** — all formulas referencing Tab 1
- **Tab 3: Balance Sheet** — all formulas referencing IS
- **Tab 4: Cash Flow Statement** — indirect method, referencing IS and BS
- **Tab 5: Scenarios** — a dropdown that switches between Base Case, Bull Case (+20% revenue), Bear Case (-15% revenue) — all three scenario outputs visible simultaneously
- **Tab 6: Charts** — Revenue, Gross Margin %, and Cash Balance charted across all three scenarios

**Validation:** The Balance Sheet must balance (Assets = L + E) in all three scenarios. The Cash Flow ending balance must tie to the Balance Sheet cash figure.

---

### Chunk 101 — "Scenario Analysis & Break-Even"
**Type:** Content + Spreadsheet Lab
**Two practical tools every accountant will encounter:**

**Break-Even Analysis:**
- Fixed costs ÷ (Revenue per mile − Variable cost per mile)
- Skarion's fixed costs: $98,000/month (salaries, rent, software subscriptions)
- Variable cost: $41.50/mile (offshore drafting)
- Revenue: $160/mile average
- Break-even: $98,000 ÷ ($160 − $41.50) = **827 miles/month**
- Skarion completed 3,000 miles in January → margin of safety: 2,173 miles or 72% above break-even

**Sensitivity Analysis:**
- A simple data table showing profit at varying combinations of miles completed (2,000–4,000) and price per mile ($140–$180)
- The student identifies which combination produces the minimum acceptable profit to cover debt service

---

## MODULE 14 — Understanding Audits & Internal Controls
**Chunks: 102–103** | **Estimated time: 2 hours**

### Chunk 102 — "What Happens During an Audit — From the Accountant's Seat"
**Type:** Content + Timeline + Video Script
**Learning objective:** Student is not scared of auditors. They know exactly what to prepare.

**Video script (4 min):**

| TIME | NARRATION | VISUAL |
|---|---|---|
| 0:00–0:30 | *"The first time auditors walk in, it feels like a tax audit — like they're looking for something you did wrong. They're not. Financial statement auditors are hired by the company's board to verify that the numbers are fairly presented. They want to help you prove your numbers are right."* | B-roll: Two people reviewing documents at a table, collaborative body language. |
| 0:30–1:30 | *"What auditors actually test: existence (does the asset exist?), completeness (are all transactions recorded?), accuracy (are the amounts correct?), cutoff (are things in the right period?), and valuation (are things valued correctly?). For each assertion, they select a sample of transactions and trace them to source documents."* | Text animation: Five audit assertions appearing one by one with a simple definition. |
| 1:30–3:00 | *"What an accountant prepares for audit: a complete reconciliation package (every balance sheet account tied to its subledger), a depreciation schedule with asset receipts attached, the payroll summary tied to W-2s, and all adjusting entries with approval documentation. If you've done the close properly every month, audit prep is just organizing what you already have."* | Screen: A well-organized audit support folder — clearly named, dated PDFs for each account. |
| 3:00–4:00 | *"The most common audit finding for small companies: missing supporting documentation. The fix: every journal entry, every adjustment, every unusual transaction — there is a document attached before you post it. Not after. Before."* | Bold text: "Document before you post. Not after." |

**Timeline: A 6-week audit from field work to opinion:**
1. Week 1: Auditors send PBC list (Prepared By Client) — the support documents they want
2. Week 2: Field work begins — auditors test samples of transactions
3. Week 3: Auditor queries — you answer questions and provide additional support
4. Week 4: Adjusting journal entries — auditors may propose entries for items they found
5. Week 5: Management representation letter — controller/CFO signs off on assertions
6. Week 6: Audit opinion issued

---

### Chunk 103 — "Internal Controls — What They Are and Why You Enforce Them Even When Nobody's Watching"
**Type:** Content + Ethical Scenario Quiz
**The 5 key internal controls every staff accountant operates within:**

1. **Segregation of duties:** The person who approves spending ≠ the person who enters it ≠ the person who signs the check. For small companies where one person does multiple roles: compensating controls (manager review of the bank statement monthly, for example).
2. **Authorization:** No payment without documented approval above a certain threshold. Skarion: invoices under $5,000 require PM approval; over $5,000 require controller approval; over $50,000 require CEO approval.
3. **Reconciliation:** Every balance sheet account reconciled monthly to a source document. This is the control that catches errors and fraud.
4. **Physical controls:** Locked check stock, password-protected accounting software, multi-factor authentication on banking portals. Not glamorous. Non-negotiable.
5. **Independent verification:** The bank reconciliation reviewed by someone who didn't prepare it. The controller signing off on the close package they didn't personally prepare.

**Ethical Scenario Quiz (5 scenarios — student picks Hold/Correct/Escalate/Document):**
1. You notice the controller approved their own $8,500 expense reimbursement — no second approver.
2. A vendor offers you a gift card in exchange for expediting their invoice payment.
3. You find an unfamiliar $4,200 ACH debit on the bank statement with no internal authorization.
4. Your manager asks you to back-date a journal entry to make this quarter's numbers look better.
5. A colleague mentions they've been "borrowing" petty cash and paying it back the next day.

**For each: what is the textbook response vs. the real-world response, and what documentation do you create?**

---

## MODULE 15 — Reading Financial News Like an Accountant
**Chunks: 104–105** | **Estimated time: 1.5 hours**

### Chunk 104 — "The Wall Street Journal for Accountants — Translating Headlines into Journal Entries"
**Type:** Content + Flip Cards
**Why this module exists:** An accountant who can't connect real-world events to accounting treatment is operating with one hand tied behind their back. And it impresses the hell out of interviewers.

**5 real-world headline types and their accounting implications:**

**Headline 1: "Fed Raises Interest Rates by 0.25%"**
- Accounting impact: Variable-rate debt (like a line of credit) now has higher interest expense next month. Accrue more interest. Also, the fair value of fixed-rate bonds on your balance sheet decreases (relevant for investment portfolios).
- Skarion impact: Their $500K term loan at 6.5% — if it were variable, a 0.25% hike = $1,250 more interest per year = $104/month.

**Headline 2: "Tech Firm X Files for Chapter 11 Bankruptcy"**
- Accounting impact: If they owe you money (they're in your AR), you likely need to write off that receivable immediately. Do not wait.
- Skarion impact: If TeleCom Builders filed Chapter 11, the $112,700 balance goes to Write-Off immediately. Dr Allowance for Doubtful Accounts / Cr AR.

**Headline 3: "Company Y Announces Acquisition of Company Z for $800M"**
- Accounting impact: The acquirer records the acquired company's assets at fair value, with any excess over fair value recorded as Goodwill. Goodwill is not amortized (GAAP) but tested annually for impairment.

**Headline 4: "Inflation Running at 4.2% — Input Costs Rising"**
- Accounting impact: COGS rising faster than prices = margin compression. Inventory-carrying businesses may need to use LIFO/FIFO decisions more carefully. Services firms (like Skarion) feel it in wage pressure.

**Headline 5: "Cryptocurrency Exchange Collapses"**
- Accounting impact: Any crypto held as an asset must be marked down to fair value immediately. ASC 350-60 (new 2024 FASB rule) now requires fair-value accounting for crypto — losses and gains recorded in income.

**Flip Cards (5):** One card per headline type — front = headline, back = accounting treatment and the journal entry.

---

### Chunk 105 — "Quarterly Earnings Calls — What the CFO Is Actually Saying"
**Type:** Content + Quiz
**Why it matters:** Understanding investor language makes you a better communicator at every level.

**5 terms every CFO uses on earnings calls, and what they actually mean for the accountant:**

1. **"Revenue grew 18% YoY"** — Year-over-year. You need to know how to calculate YoY and what drives it (volume vs. price vs. mix).
2. **"EBITDA margin expanded 200 basis points"** — A basis point is 0.01%. 200bps = 2%. EBITDA margin went from, say, 22% to 24%.
3. **"We saw a $4M headwind from FX"** — Foreign exchange impact. If you have revenue in multiple currencies, a strengthening dollar reduces reported USD revenue from foreign operations.
4. **"Organic growth of 12% excluding the Westfield acquisition"** — Stripping out growth from acquisitions to show what the underlying business did on its own.
5. **"We're reaffirming guidance"** — The company's own forecast for the next quarter/year. The accountant maintains the financial model that feeds this guidance.

**Quiz (3 questions):** Read a 3-paragraph mock CFO earnings commentary using Skarion's Q1 numbers and answer: What was YoY revenue growth? What is the implied EBITDA margin? Which segment was the biggest contributor to margin improvement?

---

## THE MASTER VIDEO PRODUCTION PLAN

### All Video Scripts in the Course (Complete List)

| Chunk | Title | Duration | Module |
|---|---|---|---|
| 31 | Why Accounting Exists | 3 min | Mod 01 |
| 32 | Accrual vs. Cash | 4 min | Mod 02 |
| 33 | Chart of Accounts in 5 Minutes | 3.5 min | Mod 02 |
| 34 | The 3-Way Match | 4 min | Mod 03 |
| 35 | Bank Reconciliation Method | 5 min | Mod 05 |
| 36 | Month-End Close Step by Step | 5 min | Mod 06 |
| 37 | Excel's 3 Functions That Do 80% of the Work | 4 min | Mod 07 |
| 38 | How to Answer Any Accounting Interview Question | 4 min | Mod 09 |
| 39 | Revenue Recognition in 3 Minutes (ASC 606) | 3 min | Mod 04 |
| 40 | Payroll — What Gets Withheld and Why | 3.5 min | Mod 03 |
| 41 | AR Aging and Why It Matters | 3.5 min | Mod 04 |
| 42 | Bad Debt — The Allowance Method | 3 min | Mod 04 |
| 76 | The STAR Method With Real Accounting Examples | 4 min | Mod 09 |
| 77 | How to Research a Company Before an Interview | 3 min | Mod 09 |
| 78 | Salary Negotiation — What to Say When They Make the Offer | 3.5 min | Mod 09 |
| 79 | AI Tools in Modern Accounting | 4 min | Mod 07 |
| 80 | Your First Week on the Job | 3.5 min | Mod 09 |
| 81 | What the CPA Exam Is — Do You Need It? | 3 min | Mod 09 |
| 82 | Building Your Accounting Portfolio | 4 min | Mod 09 |
| 91 | The 8 Ratios Every Accountant Must Know | 5 min | Mod 10 |
| 99 | What a Financial Model Actually Is | 4 min | Mod 13 |
| 102 | What Happens During an Audit | 4 min | Mod 14 |

**Total video content: ~83 minutes across 22 videos**
**Average per video: 3.8 minutes**
**Production batch recommendation:** Film in 4 sessions of 5–6 videos each

### Video Script File Format for Production
Each script should be prepared as a standalone document:
- File name: `VIDEO_[Chunk#]_[slug].md`
- Stored in: `claude-made-course/video-scripts/` (create this folder)
- Format: Full AV two-column script (narration | visual direction) — exactly as written in Phase 2 & 3 blueprints
- Each script ends with: "Reference images needed: [list]"

---

## HANDOVER FOR GLM — Phase 4

**Read in order:**
1. `claude-made-course/COURSE_BLUEPRINT_30_CHUNKS.md` — Phase 1 (the core)
2. `claude-made-course/PHASE2_BLUEPRINT_CHUNKS_31_60.md` — Phase 2 (video scripts, review sessions, scenarios)
3. `claude-made-course/PHASE3_BLUEPRINT_CHUNKS_61_90.md` — Phase 3 (in-browser labs, interview prep, capstone)
4. `claude-made-course/PHASE4_BLUEPRINT_CHUNKS_91_110.md` — **This document** (new modules, ratios, tax, modeling, audit)

**New modules to create:**
- `modules/10-financial-ratios/content.json` — Chunks 91–93
- `modules/11-cost-accounting/content.json` — Chunks 94–96
- `modules/12-tax-basics/content.json` — Chunks 97–98
- `modules/13-financial-modeling/content.json` — Chunks 99–101
- `modules/14-audit-and-controls/content.json` — Chunks 102–103
- `modules/15-reading-financial-news/content.json` — Chunks 104–105

**New folder to create:**
- `claude-made-course/video-scripts/` — one markdown file per video, named `VIDEO_[chunk]_[slug].md`

---

## AI VIDEO TOOLS — RECOMMENDATION FOR THE OWNER

**Now that the scripts are ready, here is exactly what to use to produce the videos:**

### Tier 1: Talking Head / Instructor Videos (Chunks 31, 32, 33, 35, 36, 38, 76, 78, 80, 81, 91, 99, 102)
These need a "presenter" explaining concepts. You have two options:

**Option A — Record Yourself (Highest credibility)**
- Use a decent webcam (Logitech C920 or better) and a microphone (Blue Yeti or similar)
- Software: **Descript** (descript.com) — record, edit by editing the transcript, auto-remove filler words, add animated lower thirds
- B-roll: Use **Runway** (runwayml.com) to generate the visual cutaway shots described in each script
- Cost: Descript ~$24/month, Runway ~$15/month

**Option B — AI Avatar (Fastest to produce, no camera needed)**
- **HeyGen** (heygen.com) — Upload your script, choose an avatar, it produces a professional talking-head video
- Best for: non-native speakers or anyone camera-shy
- Quality: Good for corporate training, not cinematic
- Workflow: paste the script from the video-scripts/ folder → select a professional avatar → export MP4 → drop into the course
- Cost: ~$29/month for the Creator plan (includes 4 credits/month, ~2 minutes per credit)
- **Important:** For the best result, create a custom avatar of yourself using HeyGen's "Instant Avatar" feature — 2 minutes of you speaking on camera creates an avatar that looks exactly like you for all future videos

**Option C — Hybrid (Recommended)**
- Record yourself once with a clean background for the "intro" and "outro" of each video
- Use HeyGen or Synthesia for the middle sections where you're explaining complex theory
- Use Runway Gen-3 or Google Veo 3 for B-roll shots (the office footage, the hands-on-keyboard footage, the financial document close-ups)

---

### Tier 2: Screen Recording Videos (Chunks 33, 34, 37, 39, 40, 79, 100)
These are walkthroughs of software (Excel, SkarionBooks, QBO). Record these yourself:

**Best tool: Loom** (loom.com)
- Free for up to 25 videos
- Captures screen + face in corner
- Automatic transcript and chapter markers
- Direct shareable link — can embed in the course as an iframe

**Alternative: OBS Studio** (free, open source)
- More control over output quality
- Outputs to MP4 directly

**Workflow:** Open the Excel file or SkarionBooks → start Loom recording → talk through the script while doing the task on screen → export → upload

---

### Tier 3: Animated Explainer Videos (Chunks 32, 36, 76, 91, 99)
These use the animated graphics described in the scripts (timelines, ratio dashboards, T-account animations):

**Best tool: Canva** (canva.com, ~$13/month Pro)
- Create animated slide decks, export as MP4
- Has pre-built accounting/finance presentation templates
- Timeline animations, chart reveals, text animations — all the visuals described in the scripts
- Fastest for someone without motion design experience

**Best tool for higher quality: Runway Gen-3**
- Generate the specific animated moments (the P&L numbers counting up, the T-account filling in, the ratio dashboard building itself) as short AI video clips
- Drop these clips into Descript or CapCut for final editing with your narration

---

### Complete Production Stack (What to Actually Buy)

| Tool | Purpose | Cost |
|---|---|---|
| **Descript** | Record, edit, caption all narrated videos | $24/month |
| **HeyGen** | AI avatar for complex theory videos if not recording yourself | $29/month |
| **Canva Pro** | Animated slides, thumbnails, lower thirds | $13/month |
| **Loom** | Screen recording for software walkthroughs | Free (25 videos) |
| **Runway Gen-3** | B-roll and animated visual clips | $15/month |
| **Total** | | **~$81/month** |

Cancel Runway and HeyGen after the videos are produced — they're project tools, not ongoing subscriptions.

### Production Order (Do This First)
Start with the videos that cover the most critical concepts and will be watched most:
1. Chunk 31 — Why Accounting Exists (course opener — every student sees this)
2. Chunk 35 — Bank Reconciliation (most common interview question)
3. Chunk 38 — How to Answer Any Interview Question (highest career impact)
4. Chunk 32 — Accrual vs. Cash (foundational theory)
5. Chunk 76 — STAR Method (interview prep)
Then work through the rest in module order.
