
import os

def replace_in_file(path, old, new):
    if not os.path.exists(path): return
    with open(path, "r", encoding="utf-8") as f: content = f.read()
    content = content.replace(old, new)
    with open(path, "w", encoding="utf-8") as f: f.write(content)

replace_in_file("skarionbooks/index.html", "Skarion Manufacturing LLC", "Skarion Engineering")
replace_in_file("skarionbooks/app.js", "Raw Materials Inventory", "Work-In-Progress (WIP)")
replace_in_file("skarionbooks/app.js", "Finished Goods Inventory", "Prepaid Software Licenses")
replace_in_file("skarionbooks/app.js", "Sales Revenue", "Engineering Design Revenue")
replace_in_file("skarionbooks/app.js", "Cost of Goods Sold", "COGS - Subcontractors")
replace_in_file("skarionbooks/app.js", "Equipment", "GIS Server & Workstations")

