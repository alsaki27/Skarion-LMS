# Skarion Accounting Track — Professionalization Fix-It Plan
**Prepared:** July 16, 2026 · **Scope:** `claude-made-course/` (the interactive web course + SkarionBooks)
**Trigger:** "The sidebar does not help, it's terrible" + general professionalism pass.

Every item below was found by reading the actual code (`engine/player.js`, `engine/theme.css`, `engine/template.html`) and running the build — not a generic checklist. File paths and line references are current as of this commit.

---

## TIER 1 — Sidebar & Navigation (the reported problem)

### Root cause
`buildSidebar()` (`player.js:179-213`) renders one `<div class="sb-mod">` per module, each containing a `<ul class="sb-chunks">` with **every chunk in that module as a flat `<li>`**. Two behaviors compound into a bad experience:

1. **Clicking a module title navigates you into it immediately** (`title.addEventListener("click", () => loadModule(modIdx))` at line 190) — there is no way to just *expand and browse* a module's chunk list without leaving wherever you currently are. You cannot preview Module 9's contents while sitting in Module 3.
2. **Only the active module's chunk list is ever expanded** (`.sb-chunks{display:none} .sb-mod.active .sb-chunks{display:block}`, theme.css:343-344) — so browsing feels like tunnel vision: one long undifferentiated list of truncated titles (`shortLabel()`, ~18 chars) for whichever module you're currently in, and 14 collapsed one-line module titles for everything else.

Module 09 (`09-interview-prep/content.json`, 95KB — by far the largest file, roughly 3× any other module) is the worst case: expanding it dumps a very long flat list of near-identical short labels with zero grouping, no chunk-type indication (quiz vs. video vs. exercise all look the same), and no progress markers beyond a single `.active` highlight.

### Fixes

1. **Decouple "expand" from "navigate."** Clicking a module title should toggle its chunk list open/closed. Add a separate, explicit click target (a chevron icon or the chunk row itself) that navigates. Multiple modules should be allowed open at once, or at minimum switching modules shouldn't require committing to navigation.
2. **Group chunks by type within each module** using a small icon per chunk-type (📄 content, 🎥 video, ✅ quiz, 📊 spreadsheet_lab, ⚖️ journal_entry_builder, 🧩 scenario_lab, ⏱ timed_drill, 🔀 drag_and_drop) so the list is scannable, not a wall of text.
3. **Add per-chunk completion state** (a checkmark or filled dot) driven by the same `SkarionPlayer._*Done` / `state.quizScores` data already tracked in `saveState()` (player.js:33-43) — the data exists, the sidebar just doesn't surface it.
4. **Add a per-module progress ring or fraction** (e.g. "7/40") next to each module title, computed from the same satisfied-chunk tracking.
5. **Give the module title a real disclosure affordance** — a chevron that rotates open/closed — instead of a bare `<span>` (theme.css:340) that gives no visual hint it's interactive.
6. **Cap or virtualize long lists.** For a 40+-chunk module, render the flat list in labeled sub-groups (e.g. "Foundations," "Practice," "Assessment") rather than one continuous scroll — the blueprint docs (`COURSE_BLUEPRINT_30_CHUNKS.md` and phases 2–4) already group content this way; the sidebar should mirror those groupings instead of flattening them.
7. **Fix the color system mismatch.** The sidebar hardcodes `#111827`, `#E8A33D`, `#CADCFC`, `#9CA3AF` (theme.css:293, 303, 342, 345) instead of the CSS custom properties defined at the top of the same file (`--bg-elev-1`, `--accent`, `--text-dim`, etc., theme.css:4-30). This is why the sidebar visually reads as bolted-on rather than part of the same design system — bring it onto the token system so a future palette change updates it automatically.
8. **Persist and restore sidebar scroll position** when returning from a chunk — right now the sidebar re-renders fresh navigation state without memory of where the learner was scrolled to.
9. **Make "current chunk" auto-scroll into view** in the sidebar when navigating via Next/Back (not just via sidebar clicks) — right now `updateSidebarUI()` (player.js:215-223) only toggles classes, it never calls `.scrollIntoView()`.
10. **Desktop: make the sidebar collapsible.** At >900px it's permanently visible at 280px (theme.css:290-301) with no toggle — for a single-column reading experience (the `.stage-inner` max-width is 760px per the original design), a fixed 280px rail is a lot of permanent chrome. Add the same open/close affordance the mobile drawer already has, just persisted as a user preference (localStorage), not hidden behind a media query.

---

## TIER 2 — Visual & brand consistency

11. **Audit every hardcoded hex color across `theme.css`** (449 lines) against the token palette declared at the top — the sidebar isn't the only offender; the timeline (`#E8A33D`, `#1E2761`, `#CADCFC` at lines 355-357) and drag-and-drop components likely have the same drift. Do a single pass converting all component styles to `var(--...)` tokens.
12. **Remove inline styles from `template.html`.** The "Launch SkarionBooks" button (line 28) is fully inline-styled (`style="margin-left:auto; margin-right:20px; padding:6px 12px; background:#1E2761; ..."`) instead of a CSS class — inconsistent with every other button in the file, which uses `.nav-btn` classes. Move it to a `.launch-skarionbooks-btn` class in theme.css.
13. **Fix the page `<title>` per module/SCO.** The individual per-module SCORM zips (built in the loop at `build_course.py:148-166`) all get the exact same hardcoded `<title>Skarion Accounting Track — Job Simulation Course</title>` from the shared template — an LMS course catalog or browser tab list showing 15 SCOs will show 15 identical tab titles. Inject the module title per SCO build.
14. **Add a favicon.** Currently none — browser tabs and any LMS launch-page previews show a generic blank icon.
15. **"Launch SkarionBooks" should not fully navigate away** (`window.open('skarionbooks/index.html', '_self')`, template.html:28) — `_self` replaces the entire course tab, losing all in-memory player state (though `saveState()` mitigates data loss, the *navigation UX* still feels like leaving the product rather than opening a linked tool). Open it in a new tab (`_blank`) or, better, as an in-page modal/iframe so the course shell stays visible.

---

## TIER 3 — Technical reliability & SCORM portability

16. **Vendor the `jspreadsheet`/`jsuites` dependency instead of loading it from `bossanova.uk` at runtime** (template.html:8-11). Six `spreadsheet_lab` chunks across five modules (03, 04, 05, 10, 13) depend on this. Corporate LMS iframes commonly block third-party CDN calls via CSP, and the course already has a defensive fallback message for exactly this failure (`player.js:1180`: *"Excel simulator library failed to load (offline/CDN blocked)"*) — which means the team already knows this breaks. Download the library's JS/CSS into `engine/vendor/` and inline it the same way `theme.css`/`player.js` are inlined, so the SCORM package is genuinely self-contained per the original design goal.
17. **Resolve the canonical bank-rec figure inconsistency flagged in `HANDOVER.md`'s own known-issues list** — confirm `$336,250.00` is now used everywhere (spot-checked as consistent as of this plan, but re-verify after Tier 1/2 edits touch these files) and delete the stale `$217,334.09` figure from any file that still has it (recheck `courses/accounting-track/03-core-accounting-practice/Skarion_Practice_Solution_Key.docx`, which predates the newer modules and still uses the old figure — decide whether Nuzhat's source doc should be updated to match, or whether the interactive course's $336,250 number should be footnoted as "expanded scenario, different from the original practice packet").
18. **Regenerate `slide-decks/*.pptx` and per-module `scorm-packages/*.zip`** — both were built against the old 10-module slugs (`00-course-design` … `09-month-end-close`) and no longer match the current 15-module structure (`01-intro-and-market` … `15-reading-financial-news`). Either delete the stale ones or rerun `node engine/build_pptx.js` and `python engine/build_course.py` against the current module list.
19. **Move one-off migration scripts out of the `claude-made-course/` root.** `gen_excel_lab.py`, `rename_script.py`, `rename_skarionbooks.py` are dev-time one-shot scripts sitting at the top level next to the real engine — either delete them (if their migrations are done and captured in git history) or move to a `claude-made-course/scripts/` folder with a one-line comment explaining what each did and when.
20. **Add a `README.md` to `claude-made-course/`** — right now the only orientation document is the repo-root `HANDOVER.md`, which is already stale in places (its own known-issues list references file states that have since changed). A living README in `claude-made-course/` itself (build commands, module list, chunk-type reference table) is more discoverable and easier to keep in sync than a dated handover memo.
21. **Confirm `master-course/index.html` and `scorm-packages/*.zip` are excluded from source diffs that matter, or committed deliberately** — right now `git status` shows both as tracked+modified on every rebuild (16+ files change per `build_course.py` run). Either .gitignore the build output (`master-course/`, `scorm-packages/*.zip`) and treat them as CI/release artifacts, or keep committing them deliberately as "latest deployable build" — pick one and document it, since right now every content edit produces a noisy 15+-file diff of regenerated binaries.

---

## TIER 4 — SkarionBooks (the QuickBooks clone)

22. **Build the missing bank-reconciliation screen.** `skarionbooks/app.js` has `renderDashboard`, `renderCOA`, `renderBills`, `renderPayments`, `renderJournal`, `renderReports` — no `renderReconcile`. The Reports view currently just prints a hint (*"Reconciles ending Cash to bank-rec adjusted balance: ~$X"*, app.js:200) instead of a real match/clear UI. Given Module 05 is entirely about bank reconciliation, this is the single highest-value SkarionBooks gap.
23. **Wire SkarionBooks' seed data to the same canonical figures the course teaches** (`$336,250.00` adjusted balance, the `$10,547.10` Southeast Broadband/DEP-0091 duplicate deposit) so a student who completes the Module 05 lab and then opens SkarionBooks sees numbers that actually match what they just practiced, not generic placeholder data.
24. **Add company setup / onboarding flow** — real QuickBooks Online's first-run experience (company name, industry, fiscal year) is part of what Module 02/08 teaches conceptually; SkarionBooks currently starts pre-seeded with no equivalent "Day 1" flow, so the parallel between the simulator and the lesson is weaker than it could be.

---

## TIER 5 — Content polish

25. **`09-interview-prep/content.json` is 95KB — nearly 3× the next-largest module.** Audit whether it should split into two modules (e.g. "Interview Prep — Technical" and "Interview Prep — Behavioral & Portfolio") both for the sidebar-length problem (Tier 1) and for pacing — a single module that takes noticeably longer than every other one breaks the course's rhythm.
26. **Video chunk transcripts are complete (23 chunks, all with timestamped scripts) but only some have been exported as standalone files in `video-scripts/`** (spot-checked: 20 of the newer ones are now present, up from 1 at last check) — confirm all 23 have a corresponding exported `.md` file so the video-production team (Veo3 conversion) has a consistent handoff format instead of "some are files, some are only inline in content.json."
27. **Run a duplicate/near-duplicate check across module content** — with 171 chunks authored across many separate sessions, spot-check for repeated explanations of the same concept (e.g. "what is a 3-way match" could plausibly appear near-verbatim in both Module 03 and Module 09) and consolidate or cross-link instead of repeating.
28. **Standardize the "callout" visual vocabulary** (`tip`/`warning`/`story`/`danger` — theme.css:187-190) — confirm every module actually uses these consistently rather than each having invented its own ad hoc emphasis pattern during separate authoring passes.

---

## TIER 6 — Process

29. **Establish one canonical build command sequence and document it** at the top of the new `claude-made-course/README.md` (Tier 3 item 20): `python engine/build_course.py` → `node engine/build_pptx.js` → commit. Right now this exists only inside `HANDOVER.md`, which several people/sessions have apparently been editing in parallel without it staying current.
30. **Decide the source-of-truth question for parallel work.** Multiple sessions appear to have modified `template.html`, `theme.css`, `scorm-api.js`, `build_course.py`, and `player.js` independently within the same day (July 15–16, 2026, per file mtimes). Before more parallel work happens, agree on a single active branch/session at a time for engine-level files (`engine/*`), since these are shared infrastructure every module depends on — content authors touching `modules/*/content.json` can safely work in parallel, but two people editing `player.js` simultaneously is how the Tier 1–3 inconsistencies above accumulated in the first place.

---

## Suggested execution order
1. Tier 1 (sidebar) — the reported pain point, do this first.
2. Tier 3, items 16–18 (CDN vendoring, stale artifact regen) — reliability before polish.
3. Tier 2 (visual consistency) — fast once Tier 1 touches the same files anyway.
4. Tier 4 (SkarionBooks reconciliation) — highest-value content gap.
5. Tier 5–6 (content polish, process) — ongoing, not blocking.
