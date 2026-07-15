"""Build skarion_accounting_track.db from schema.sql + seed data.

Run from this directory:  python build_db.py
Idempotent: deletes and recreates the .db file each run.
"""
import os
import sqlite3

HERE = os.path.dirname(os.path.abspath(__file__))
DB = os.path.join(HERE, "skarion_accounting_track.db")

if os.path.exists(DB):
    os.remove(DB)

con = sqlite3.connect(DB)
con.executescript(open(os.path.join(HERE, "schema.sql"), encoding="utf-8").read())
cur = con.cursor()

cur.execute(
    "INSERT INTO course (slug, title, tagline, audience, duration_days, version) VALUES (?,?,?,?,?,?)",
    (
        "accounting-track",
        "Skarion Accounting Track: US Accounting Job Simulation",
        "Simulate a year, don't teach a semester.",
        "Zero-experience candidates targeting entry-level US accounting roles "
        "(AP/AR clerk, staff accountant, junior analyst, bookkeeper)",
        10,
        "v1",
    ),
)
course_id = cur.lastrowid

modules = [
    # position, slug, title, summary, day_mapping, status
    (0, "00-course-design", "Course Design & Backbone",
     "The V1 spec: market analysis, philosophy, 10-day path, 12-month extension, MVR criteria, research assignments.",
     None, "ready"),
    (1, "01-job-market-research", "Job Market Research",
     "50 entry-level postings analyzed to calibrate course content; structured workbook with auto summary.",
     "calibration", "needs_revision"),
    (2, "02-quickbooks-online-lab", "QuickBooks Online Lab",
     "Set up Skarion Manufacturing LLC in QBO; produce the illustrated cheat-sheet walkthrough.",
     "Day 1", "needs_redo"),
    (3, "03-core-accounting-practice", "Core Accounting Practice (January Cycle)",
     "Full January packet: COA, opening balances, AP, AR with VA sales tax, payroll, fixed assets, loan, plus 12 graded questions.",
     "Days 2-7", "ready"),
    (4, "04-bank-reconciliation-lab", "Bank Reconciliation Lab",
     "Three consecutive monthly statements with seeded problems; all reconcile to zero.",
     "Day 4", "ready"),
    (5, "05-accounts-payable-simulation", "Accounts Payable Simulation",
     "30 vendor invoices with 3-way match exercises, seeded discrepancies, and instructor key.",
     "Day 2", "ready"),
    (6, "06-interview-preparation", "Interview Preparation",
     "126-question bank + 20 must-know cheat sheet with Context/Action/Result answers.",
     "Day 10 + throughout", "needs_revision"),
    (7, "07-excel-toolkit", "Excel Toolkit",
     "Five working templates: bank rec, AR aging, AP aging, expense dashboard, close checklist.",
     "Day 9", "ready"),
    (8, "08-payroll-fundamentals", "Payroll Fundamentals",
     "US payroll tax mechanics reference (verified 2026 figures).",
     "Day 5", "ready"),
    (9, "09-month-end-close", "Month-End Close",
     "Close playbook: timeline, 15 steps, checklist, soft vs hard close, grading rubric.",
     "Days 7-8", "ready"),
]
mid = {}
for pos, slug, title, summary, days, status in modules:
    cur.execute(
        "INSERT INTO module (course_id, position, slug, title, summary, day_mapping, status) VALUES (?,?,?,?,?,?,?)",
        (course_id, pos, slug, title, summary, days, status),
    )
    mid[slug] = cur.lastrowid

lessons = [
    ("02-quickbooks-online-lab", 1, "US GAAP, cash vs accrual, the accounting equation", "morning",
     "Foundations: why US companies use accrual; debits/credits by account type; common accounts."),
    ("02-quickbooks-online-lab", 2, "QBO company setup", "afternoon",
     "Company file, fiscal year, COA customization, bank accounts, opening balances, navigation."),
    ("05-accounts-payable-simulation", 1, "The AP process and 3-way match", "morning",
     "Receive-verify-approve-enter-pay; PO + receiving report + invoice matching; discrepancy handling."),
    ("05-accounts-payable-simulation", 2, "Process 30 Skarion vendor invoices", "afternoon",
     "Hands-on entry, categorization, hold decisions, and AP aging."),
    ("04-bank-reconciliation-lab", 1, "Bank feeds, rules, transfers, loan payments", "morning",
     "QBO banking mechanics; principal vs interest; fees and interest income."),
    ("04-bank-reconciliation-lab", 2, "Reconcile January-March statements", "afternoon",
     "Match, investigate, clear; duplicates, missing items, wrong amounts, outstanding checks."),
    ("08-payroll-fundamentals", 1, "Payroll accounting mechanics", "morning",
     "Gross-to-net, FICA/Medicare, FUTA/SUTA wage bases, employer taxes, PTO accruals."),
    ("08-payroll-fundamentals", 2, "Process January payroll for 15 employees", "afternoon",
     "Calculate withholdings, post entries, reconcile register to bank."),
    ("09-month-end-close", 1, "Accruals and adjustments", "morning",
     "Close checklist; accruals, prepaids, unearned revenue, depreciation, bad debt."),
    ("09-month-end-close", 2, "Reconciliation and reporting", "afternoon",
     "Balance-sheet account reconciliations; P&L, Balance Sheet, Cash Flow; CEO summary."),
    ("07-excel-toolkit", 1, "Excel for accountants", "morning",
     "VLOOKUP/XLOOKUP/INDEX-MATCH, SUMIFS, pivot tables, conditional formatting, validation."),
    ("07-excel-toolkit", 2, "Build the five templates", "afternoon",
     "Bank rec worksheet, AR/AP aging, expense dashboard, close checklist - from scratch."),
    ("06-interview-preparation", 1, "The 1-year-experience story framework", None,
     "Context/Action/Result answers grounded in the simulation's real numbers."),
]
for slug, pos, title, session, summary in lessons:
    cur.execute(
        "INSERT INTO lesson (module_id, position, title, session, summary) VALUES (?,?,?,?,?)",
        (mid[slug], pos, title, session, summary),
    )

assignments = [
    ("01-job-market-research", "Analyze 50 entry-level job postings",
     "Fill Skarion_ACT_Job_Postings_Analysis_TEMPLATE.xlsx with 50 qualifying (0-1 yr) postings.",
     "Completed workbook with auto-populated Summary sheet", 4.0, 0),
    ("02-quickbooks-online-lab", "QBO setup walkthrough (REDO)",
     "Fresh USD QBO trial as Skarion Manufacturing LLC; 9 required actions; cropped screenshots; "
     "'what confused me' and 'common mistakes' sections.",
     "QuickBooks Online Cheat Sheet document", 4.0, 0),
    ("03-core-accounting-practice", "January accounting cycle - 12 questions",
     "Work the full January packet and answer all 12 questions.",
     "Completed answer sheet graded against solution key", 8.0, 1),
    ("04-bank-reconciliation-lab", "Reconcile January, February, March",
     "Complete all three reconciliation worksheets; document each reconciling item.",
     "Three zero-difference worksheets + reconciliation memos", 4.0, 1),
    ("05-accounts-payable-simulation", "Process the 30-invoice batch",
     "3-way match all invoices; flag and dispose of every seeded issue per the control log.",
     "Completed control log matching the instructor key", 4.0, 1),
    ("06-interview-preparation", "Mock interview against the 20-question sheet",
     "Answer all 20 using simulation-specific numbers; scored with the bank's rubric.",
     "Scored mock-interview session", 2.0, 1),
    ("07-excel-toolkit", "Rebuild the three core tools from scratch",
     "Bank rec worksheet, AR aging, expense dashboard - built blank-sheet-up as portfolio pieces.",
     "Three portfolio workbooks", 4.0, 1),
    ("09-month-end-close", "Perform the January close",
     "Execute the playbook's practice assignment end-to-end; produce the close package.",
     "Close checklist + financial statements + CEO summary", 6.0, 1),
]
for slug, title, instr, deliv, hours, graded in assignments:
    cur.execute(
        "INSERT INTO assignment (module_id, title, instructions, deliverable, est_hours, graded) VALUES (?,?,?,?,?,?)",
        (mid[slug], title, instr, deliv, hours, graded),
    )

resources = [
    ("00-course-design", "00-course-design/Accounting_Track_V1_Backbone.md", "markdown", "internal",
     "Course backbone spec", None),
    ("01-job-market-research", "01-job-market-research/Skarion_ACT_Job_Postings_Analysis_TEMPLATE.xlsx",
     "spreadsheet", "internal", "Rebuilt postings analysis workbook", "Structured columns + auto Summary sheet"),
    ("01-job-market-research", "01-job-market-research/Job_Postings_Raw_List_v1_DRAFT.xlsx",
     "spreadsheet", "internal", "v1 raw list (draft)", "~1/3 of rows qualify for migration"),
    ("02-quickbooks-online-lab", "02-quickbooks-online-lab/_drafts-needs-redo/QuickBooks_Report_v1_kaizen_DRAFT.docx",
     "doc", "internal", "v1 QBO report (kaizen draft)", "Reference only - being redone"),
    ("03-core-accounting-practice", "03-core-accounting-practice/Skarion_Practice_Exercise_Sheet.docx",
     "doc", "student", "January practice packet", "Benefits assumption + FUTA note added in review"),
    ("03-core-accounting-practice", "03-core-accounting-practice/Skarion_Practice_Solution_Key.docx",
     "doc", "instructor", "Solution key", "Duplicate-deposit JE corrected to Debit 1100 AR"),
    ("04-bank-reconciliation-lab", "04-bank-reconciliation-lab/Bank_Statement_2026-01_January.xlsx",
     "spreadsheet", "both", "January bank statement + worksheet", None),
    ("04-bank-reconciliation-lab", "04-bank-reconciliation-lab/Bank_Statement_2026-02_February.xlsx",
     "spreadsheet", "both", "February bank statement + worksheet", None),
    ("04-bank-reconciliation-lab", "04-bank-reconciliation-lab/Bank_Statement_2026-03_March.xlsx",
     "spreadsheet", "both", "March bank statement + worksheet", "Duplicate-entries row relabeled (+/-)"),
    ("05-accounts-payable-simulation", "05-accounts-payable-simulation/Combined_30_Vendor_Invoices.pdf",
     "pdf", "student", "All 30 invoices, combined", None),
    ("05-accounts-payable-simulation", "05-accounts-payable-simulation/invoices",
     "folder", "student", "Individual invoice PDFs", "028 filename fixed"),
    ("05-accounts-payable-simulation", "05-accounts-payable-simulation/AP_Invoice_Control_Log.xlsx",
     "spreadsheet", "both", "Invoice control log", "Instructor Key tab is instructor-only"),
    ("06-interview-preparation", "06-interview-preparation/Interview_Question_Bank_126Q.docx",
     "doc", "both", "126-question interview bank", None),
    ("06-interview-preparation", "06-interview-preparation/Interview_Cheat_Sheet_20_Questions.docx",
     "doc", "student", "20 must-know questions", None),
    ("07-excel-toolkit", "07-excel-toolkit/Template_01_Bank_Reconciliation_Worksheet.xlsx",
     "spreadsheet", "student", "Bank reconciliation template", "Duplicate-entries row added in review"),
    ("07-excel-toolkit", "07-excel-toolkit/Template_02_AR_Aging_Report.xlsx",
     "spreadsheet", "student", "AR aging template", None),
    ("07-excel-toolkit", "07-excel-toolkit/Template_03_AP_Aging_Report.xlsx",
     "spreadsheet", "student", "AP aging template", None),
    ("07-excel-toolkit", "07-excel-toolkit/Template_04_Expense_Analysis_Dashboard.xlsx",
     "spreadsheet", "student", "Expense dashboard", "Vendor chart added in review"),
    ("07-excel-toolkit", "07-excel-toolkit/Template_05_Month_End_Close_Checklist.xlsx",
     "spreadsheet", "student", "Close checklist template", None),
    ("08-payroll-fundamentals", "08-payroll-fundamentals/US_Payroll_Reference_Sheet.docx",
     "doc", "student", "US payroll reference", "2026 SS wage base verified: $184,500"),
    ("09-month-end-close", "09-month-end-close/Month_End_Close_Playbook.docx",
     "doc", "both", "Month-end close playbook", None),
]
for slug, path, kind, role, title, notes in resources:
    cur.execute(
        "INSERT INTO resource (module_id, file_path, kind, role, title, notes) VALUES (?,?,?,?,?,?)",
        (mid[slug], path, kind, role, title, notes),
    )

objectives = [
    ("02-quickbooks-online-lab", "Explain cash vs accrual accounting and why US companies use accrual", 1),
    ("02-quickbooks-online-lab", "Set up a company in QuickBooks Online with a proper chart of accounts", 2),
    ("05-accounts-payable-simulation", "Process AP: enter bills, 3-way match, handle discrepancies, process payments", 3),
    ("03-core-accounting-practice", "Process AR: invoices, cash application, partial payments, aging reports", 4),
    ("04-bank-reconciliation-lab", "Reconcile a bank statement to the GL and explain discrepancies", 5),
    ("08-payroll-fundamentals", "Process payroll: withholdings, journal entries, bank reconciliation", 6),
    ("09-month-end-close", "Post month-end entries: accruals, prepaids, depreciation, adjustments", 7),
    ("09-month-end-close", "Generate a complete set of financial statements", 8),
    ("07-excel-toolkit", "Use Excel for accounting: lookups, pivot tables, SUMIFS, rec worksheet, aging", 9),
    ("06-interview-preparation", "Tell a specific month-end close story with real numbers and lessons learned", 10),
    ("01-job-market-research", "Keep course content calibrated to live entry-level market requirements", None),
]
for slug, text, mvr in objectives:
    cur.execute(
        "INSERT INTO objective (module_id, text, mvr_item) VALUES (?,?,?)",
        (mid[slug], text, mvr),
    )

findings = [
    ("02-quickbooks-online-lab", "blocker",
     "v1 used unrelated 'kaizen' company in BDT with nine-figure balances; missing required reflection sections. Full redo.",
     "open"),
    ("01-job-market-research", "blocker",
     "v1 lacked structured columns and summary sheet; population included non-entry-level roles.",
     "open"),
    ("03-core-accounting-practice", "error",
     "Solution key debited Sales Revenue for the duplicate-deposit correction (should be 1100 AR).",
     "fixed_in_repo_copy"),
    ("03-core-accounting-practice", "error",
     "Employer benefits expense $5,250 was underivable from source data ($350/employee assumption undisclosed).",
     "fixed_in_repo_copy"),
    ("03-core-accounting-practice", "error",
     "Flat 1.2% FUTA/SUTA training rate conflicted with Module 08's real mechanics with no cross-reference.",
     "fixed_in_repo_copy"),
    ("07-excel-toolkit", "error",
     "Template 01 had no duplicate-book-entries line; reconciliation stuck at -$4,200 permanently.",
     "fixed_in_repo_copy"),
    ("04-bank-reconciliation-lab", "error",
     "March 'Less: duplicate book entries' row required a negative entry but lacked the (+/-) label.",
     "fixed_in_repo_copy"),
    ("05-accounts-payable-simulation", "improvement",
     "Double 'Assignment 5_' prefix on invoice 028 filename.",
     "fixed_in_repo_copy"),
    ("06-interview-preparation", "improvement",
     "Most technical sample answers are generic textbook; rewrite to cite simulation-specific numbers.",
     "open"),
    ("07-excel-toolkit", "improvement",
     "Template 04 lacked a vendor chart (added) and contains no native PivotTable despite Day 9 teaching them.",
     "open"),
    ("09-month-end-close", "improvement",
     "Playbook examples are generic; embed the actual January discrepancies as worked examples.",
     "open"),
    ("05-accounts-payable-simulation", "nice_to_have",
     "Only 2/30 price-discrepancy and 2/30 missing-PO cases; add ~3 more for practice weight.",
     "open"),
    ("05-accounts-payable-simulation", "nice_to_have",
     "Prominent 'Training Notice' on invoices breaks realism; consider footer/watermark.",
     "open"),
    ("04-bank-reconciliation-lab", "improvement",
     "Vendor/customer names differ from Modules 03/05; align to shared/MASTER_COMPANY_PROFILE.md.",
     "open"),
    ("07-excel-toolkit", "improvement",
     "Template vendor/customer names differ from Modules 03/05; align to shared/MASTER_COMPANY_PROFILE.md.",
     "open"),
]
for slug, sev, text, status in findings:
    cur.execute(
        "INSERT INTO review_finding (module_id, severity, finding, fix_status) VALUES (?,?,?,?)",
        (mid[slug], sev, text, status),
    )

con.commit()

# sanity report
for table in ("course", "module", "lesson", "assignment", "resource", "objective", "review_finding"):
    n = cur.execute(f"SELECT COUNT(*) FROM {table}").fetchone()[0]
    print(f"{table}: {n} rows")
con.close()
print("OK ->", DB)
