# Course Content Store (SQLite)

`skarion_accounting_track.db` — a platform-neutral content model of the whole course, ready to feed the Skarion LMS importer.

- **Schema:** `schema.sql` — course → module → lesson/assignment; resources (file paths relative to `courses/accounting-track/`), learning objectives mapped to the backbone's 10 MVR exit criteria, and a `review_finding` table tracking every issue from the July 2026 review with its fix status.
- **Rebuild:** `python build_db.py` (idempotent — drops and recreates the .db).

Useful queries:
```sql
-- what's blocking launch
SELECT m.slug, f.severity, f.finding FROM review_finding f
JOIN module m ON m.id = f.module_id
WHERE f.fix_status = 'open' ORDER BY CASE f.severity
  WHEN 'blocker' THEN 0 WHEN 'error' THEN 1 WHEN 'improvement' THEN 2 ELSE 3 END;

-- MVR readiness map
SELECT o.mvr_item, o.text, m.title, m.status FROM objective o
JOIN module m ON m.id = o.module_id
WHERE o.mvr_item IS NOT NULL ORDER BY o.mvr_item;
```
