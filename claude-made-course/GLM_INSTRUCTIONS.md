# Paste this to GLM

---

You're working on the Skarion Accounting Track — an interactive SCORM-based course at `github.com/alsaki27/Skarion-LMS`, in the `claude-made-course/` folder. Clone the repo and read `claude-made-course/FIX_IT_PLAN.md` in full before touching anything — it has 30 specific, numbered fixes, each grounded in exact file/line references, organized into 6 tiers by priority. Do not re-derive the plan yourself or restructure it; execute it as written.

**Start with Tier 1 only** (items 1–10, the sidebar). That's the reported pain point ("the sidebar does not help, it's terrible") and it's self-contained — you can ship it without touching anything else. Stop and report back after Tier 1 before moving to Tier 2+.

## Ground rules

1. **Read before writing.** The three files you'll touch most are `claude-made-course/engine/player.js` (~1200+ lines, vanilla JS, no framework/build step), `claude-made-course/engine/theme.css` (449 lines, uses CSS custom properties defined at the top — `--bg`, `--accent`, `--text-dim`, etc.), and `claude-made-course/engine/template.html` (the HTML shell both get injected into). Read each fully before editing — don't guess at surrounding code you haven't seen.
2. **Use the existing design tokens.** Do not introduce new hardcoded hex colors. Every color in your changes should be `var(--something)` referencing the palette already declared in `theme.css:4-30`. This is explicitly what's broken right now (Tier 1, item 7) — don't repeat the mistake while fixing it.
3. **No build step, no dependencies.** This is intentionally vanilla HTML/CSS/JS so the compiled output is a single self-contained `index.html` that works inside a SCORM zip with no external requests (see Tier 3, item 16 — there's currently ONE CDN dependency, `bossanova.uk` for a spreadsheet widget, and it's flagged as a bug, not a pattern to extend). Don't add npm packages, don't add a bundler, don't add more CDN links.
4. **The rebuild command is:** `python engine/build_course.py` (run from `claude-made-course/`). This reads every `modules/*/content.json`, injects `theme.css`/`player.js`/`scorm-api.js` into `template.html`, and writes `master-course/index.html` plus the SCORM zips in `scorm-packages/`. Run this after every change and manually click through the result before considering a task done — don't just eyeball the diff.
5. **Test at scale, not just with 2-3 modules.** The bug you're fixing only shows up badly with real data volume — `modules/09-interview-prep/content.json` is 95KB, by far the largest module. Any sidebar fix has to be checked against that module specifically, not just a small one.
6. **171 chunks currently exist across 15 modules** (`01-intro-and-market` through `15-reading-financial-news`). Don't assume the older module count/names you might see referenced in `HANDOVER.md` at the repo root — that file is stale in places; trust the actual `claude-made-course/modules/` directory listing and `FIX_IT_PLAN.md` over it.
7. **Commit and push when a tier is genuinely done and tested**, not mid-change. Use clear commit messages referencing the plan item numbers (e.g. `"Fix sidebar: decouple expand/navigate, add per-chunk completion state (Tier 1 #1, #3)"`).

## What "done" looks like for Tier 1

- Clicking a module title in the sidebar expands/collapses its chunk list WITHOUT navigating you away from your current chunk.
- Each chunk row shows a small icon indicating its type (content/video/quiz/journal entry/spreadsheet/scenario/drag-drop/timed drill) — the icon-to-type mapping is listed in `FIX_IT_PLAN.md` Tier 1, item 2.
- Completed chunks show a checkmark or equivalent, sourced from the existing `SkarionPlayer._*Done` / `state.quizScores` tracking already in `player.js` (item 3 — this data already exists, you're surfacing it, not inventing new tracking).
- Module 09 (95KB, largest module) is legible when expanded — grouped into labeled sub-sections per item 6, not one continuous flat scroll.
- All sidebar colors reference `var(--...)` tokens, zero new hardcoded hex values.
- Rebuild with `python engine/build_course.py`, open `master-course/index.html` locally, and confirm: sidebar works on a wide viewport AND the existing mobile off-canvas drawer behavior (`wireMobileSidebar()` in player.js) still works unchanged.

Report back with: what you changed, in which files, and confirmation you rebuilt and manually tested against Module 09 specifically before moving to Tier 2.
