
import os, json, shutil

modules_dir = "modules"

# Combine 00 and 01 into 01-intro-and-market
os.makedirs(f"{modules_dir}/01-intro-and-market", exist_ok=True)
c00 = json.load(open(f"{modules_dir}/00-course-design/content.json", encoding="utf-8"))
c01 = json.load(open(f"{modules_dir}/01-job-market-research/content.json", encoding="utf-8"))
c01["title"] = "Intro & Job Market Research"
c01["chunks"] = c00["chunks"] + c01["chunks"]
with open(f"{modules_dir}/01-intro-and-market/content.json", "w", encoding="utf-8") as f: json.dump(c01, f, indent=2)

# Combine 05 and 08 into 03-ap-and-payroll
os.makedirs(f"{modules_dir}/03-ap-and-payroll", exist_ok=True)
c05 = json.load(open(f"{modules_dir}/05-accounts-payable-simulation/content.json", encoding="utf-8"))
c08 = json.load(open(f"{modules_dir}/08-payroll-fundamentals/content.json", encoding="utf-8"))
c05["title"] = "Accounts Payable & Payroll"
c05["chunks"] = c05["chunks"] + c08["chunks"]
with open(f"{modules_dir}/03-ap-and-payroll/content.json", "w", encoding="utf-8") as f: json.dump(c05, f, indent=2)

# Simple renames using shutil.copytree
def copy_mod(old, new):
    if os.path.exists(f"{modules_dir}/{old}"):
        shutil.copytree(f"{modules_dir}/{old}", f"{modules_dir}/{new}", dirs_exist_ok=True)

copy_mod("03-core-accounting-practice", "02-core-accounting-practice")
copy_mod("04-bank-reconciliation-lab", "04-bank-reconciliation-lab_temp")
copy_mod("09-month-end-close", "05-month-end-close")
copy_mod("07-excel-toolkit", "06-advanced-excel")
copy_mod("02-quickbooks-online-lab", "07-quickbooks-lab")
copy_mod("06-interview-preparation", "08-interview-prep")

# Now delete all old ones
olds = ["00-course-design", "01-job-market-research", "02-quickbooks-online-lab", "03-core-accounting-practice", "04-bank-reconciliation-lab", "05-accounts-payable-simulation", "06-interview-preparation", "07-excel-toolkit", "08-payroll-fundamentals", "09-month-end-close"]
for o in olds:
    if os.path.exists(f"{modules_dir}/{o}"):
        shutil.rmtree(f"{modules_dir}/{o}")

# rename temp
os.rename(f"{modules_dir}/04-bank-reconciliation-lab_temp", f"{modules_dir}/04-bank-reconciliation-lab")

print("Done renaming!")

