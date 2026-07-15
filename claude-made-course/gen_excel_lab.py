
import csv, random, datetime

categories = ["Meals", "Software", "Travel", "Office Supplies", "Hardware"]
desc_map = {
    "Meals": ["Starbucks", "Panera", "Chipotle", "Uber Eats"],
    "Software": ["AWS", "GitHub", "Slack", "Zoom"],
    "Travel": ["Delta", "Uber", "Marriott", "Lyft"],
    "Office Supplies": ["Staples", "Amazon", "Office Depot"],
    "Hardware": ["Apple", "Dell", "Best Buy"]
}

with open("modules/06-advanced-excel/Raw_Expense_Export.csv", "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(["TxnDate_Messy", "Employee", "Description", "Category", "Amount"])
    
    start_date = datetime.date(2026, 1, 1)
    for i in range(500):
        cat = random.choice(categories)
        desc = random.choice(desc_map[cat]) + f" #{random.randint(100, 999)}"
        amount = round(random.uniform(10.0, 500.0), 2)
        emp = random.choice(["E. Smith", "J. Doe", "A. Johnson", "B. Williams"])
        d = start_date + datetime.timedelta(days=random.randint(0, 30))
        # Messy date format
        d_str = f"{d.year}_{d.month}_{d.day}"
        writer.writerow([d_str, emp, desc, cat, amount])

with open("modules/06-advanced-excel/GL_Mapping_Table.csv", "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(["Category", "GL_Account"])
    writer.writerow(["Meals", "6300"])
    writer.writerow(["Software", "6500"])
    writer.writerow(["Travel", "6400"])
    writer.writerow(["Office Supplies", "6200"])
    writer.writerow(["Hardware", "1500"])

