"""Generate the two Excel-lab CSVs referenced by Module 07."""
import csv, os
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
COURSES = os.path.join(ROOT, "..", "courses", "accounting-track")
SCEN = os.path.join(COURSES, "scenario-labs")

# Drafting labor raw export (1,200 rows, messy names, for the cleaning lab)
raw = os.path.join(SCEN, "Raw_Drafting_Labor.csv")
if not os.path.exists(raw):
    import random
    random.seed(11)
    projs = ["TN-CORRIDOR-FIBER","TX-LONG-HAUL","VA-METRO-ROUTE","OH-EXPANSION"]
    vendors = ["Global CAD Solutions ", "global cad solutions", "Dominion Aluminum & Fasteners","Southfield GIS Inc."]
    with open(raw,"w",newline="",encoding="utf-8") as fh:
        w = csv.writer(fh)
        w.writerow(["task_id","date","vendor_raw","project_code_raw","miles","amount"])
        for n in range(1,1201):
            d = f"2026-0{random.randint(1,3)}-{random.randint(1,28):02d}"
            v = random.choice(vendors)
            p = random.choice(projs).replace("-"," ")  # deliberately inconsistent
            miles = round(random.uniform(5,30),1)
            amt = round(miles * random.uniform(38.5,42.0),2)
            w.writerow([n, d, v, p, miles, amt])
    print("wrote Raw_Drafting_Labor.csv (1200 rows)")

# Clean project mapping table
m = os.path.join(SCEN, "Project_Mapping_Table.csv")
if not os.path.exists(m):
    with open(m,"w",newline="",encoding="utf-8") as fh:
        w = csv.writer(fh)
        w.writerow(["project_code","project_name","client","budget"])
        w.writerow(["TN-CORRIDOR-FIBER","Tennessee Corridor","Atlantic Fiber Co.", 1200000])
        w.writerow(["TX-LONG-HAUL","Texas Long-Haul","Lone Star Telecom", 800000])
        w.writerow(["VA-METRO-ROUTE","Virginia Metro","Dominion Metro LLC", 350000])
        w.writerow(["OH-EXPANSION","Ohio Expansion","Ohio Valley Cable", 600000])
    print("wrote Project_Mapping_Table.csv")
print("DONE")