# Module 05 — Accounts Payable Simulation (Day 2)
**Objective:** process 30 vendor invoices end-to-end: 3-way match, catch the seeded issues (2 price discrepancies, 3 quantity discrepancies, 2 missing-PO holds, 2 duplicate invoices, 1 unauthorized rush fee), enter, and age.

| File | What it is |
|---|---|
| `invoices/` | 30 individual invoice PDFs (028's double-prefix filename fixed here). |
| `Combined_30_Vendor_Invoices.pdf` | Same 30, one file. |
| `AP_Invoice_Control_Log.xlsx` | Student index + PO/receiving data + **Instructor Key** tab. |

All 30 invoices' math verified to the penny; VA 5.3% sales-tax treatment on goods-vs-services lines is deliberately (and correctly) modeled. The two "NOVA" companies are different vendors on purpose — teaching trap.
