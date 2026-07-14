INSTRUCTIONS FOR KIMI
Build the OSP Engineering Course GitHub Repository
Using WebBridge to scrape, extract, and clone every piece of the course

Prepared by: Claude (Anthropic) for Abdullah Al Saki, CEO — Skarion
Date: June 2026  |  Classification: Internal
 
1. What You Are Building

You are Kimi, an AI with WebBridge (live browser access). Your job is to log into the Skarion LearnWorlds account, scrape every piece of content from the Outside Plant Engineering V2 course, and build a complete, well-structured GitHub repository that is a full text-based clone of the course.

This repo will be used to:
•	Feed the entire course to an AI (likely another Kimi session) to analyze it for improvements
•	Serve as the single source of truth for the course structure going forward
•	Enable Skarion to rebuild this course on their own internal platform without LearnWorlds

⚠️  IMPORTANT — Read Before You Start
You are acting as a content scraper and repo builder. Do NOT modify, rewrite, or improve any content.
Capture everything EXACTLY as it appears in LearnWorlds — word for word for PDFs, question for question for quizzes.
For videos, capture the title, duration, and a brief description of what is covered (infer from title + module context).
If you are unsure about something, write a TODO comment in the relevant .md file and move on.
Do not skip any module, lesson, quiz question, or assignment. Every piece matters.

2. Starting Point — Credentials & Repo

2.1 GitHub Repository
The private repo has already been created by Abdullah. Use your stored GitHub token to access it.

Field	Value
Repo Name	skarion-osp-course
Owner	Abullah's GitHub account (alsaki27)
Visibility	Private
Branch	main
Token	Set via GITHUB_TOKEN environment variable (do not hardcode — see repo owner for the value)

📌 Repo Setup — Do This First
1. Clone the repo locally or use GitHub API to create files directly via API calls.
2. Create a root-level README.md as the very first commit so the repo is not empty.
3. All files must be committed to the main branch.
4. Use descriptive commit messages per module, e.g.: 'Add Module 1: Career & Industry Focus'

2.2 LearnWorlds Login
Log into the Skarion LearnWorlds admin panel using WebBridge.

Field	Value
Admin URL	https://skarion.learnworlds.com
Account	Use Abdullah's credentials (already in your context from prior sessions)
Course to scrape	Outside Plant Engineering V2
Course ID	outside-plant-engineering-v2
Direct admin link	https://skarion.learnworlds.com/author/course?courseid=outside-plant-engineering-v2&tab=contents
 
3. Repository File Structure

Create this exact folder and file structure. Every module gets its own subfolder. Every lesson gets its own .md file. Every quiz gets its own .md file. Every assignment gets its own .md file.

Path	Contents
README.md	Course overview, how to use this repo, links to each module
COURSE_SUMMARY.md	Full course description, target audience, learning outcomes, tech stack used to build it
module-01-career-industry-focus/	
  README.md	Module overview, learning objectives, lesson list
  01-intro-to-osp-engineering.md	Video lesson — title, duration, topics covered, key concepts
  02-osp-career-progression.md	Video lesson — title, duration, topics covered, key concepts
  03-module-1-1-roles-and-outlook.md	PDF lesson — full extracted text content
  04-essential-skills-for-osp-engineers.md	Video lesson — title, duration, topics covered, key concepts
  05-module-1-2-essential-soft-skills.md	PDF lesson — full extracted text content
module-02-network-architecture/	
  README.md	Module overview + lesson list
  [one .md per lesson]	Same pattern — video summary or full PDF text
  quiz-01.md	All 13 quiz questions with options and correct answers
module-03-fiber-technology-essentials/	
  [lessons + quiz-02.md]	
module-04-fiber-technology-cont/	
  [lessons + quiz-03.md]	
module-05-legal-regulatory/	
  [lessons + quiz-04.md]	
module-06-underground-infrastructure/	
  [lessons + quiz-05.md]	
module-07-gis-capacity-planning/	
  [lessons + quiz-06.md]	
module-08-pon-technology/	
  [lessons + quiz-07.md]	
module-09-design-constraints/	
  [lessons + quiz-08.md]	
module-10-hld-theory/	
  [lessons + quiz-09.md]	
module-11-skarion-design-standards/	
  [lessons + quiz-10.md]	
module-12-hld-project-01-eop-cl-row/	
  README.md	Project brief, objective, deliverable
  project-brief.md	Full PDF brief text
  walkthrough-video.md	Video title, duration, what the instructor demonstrates step by step
  quiz-11.md	Quiz questions
  assignment.md	Assignment instructions, file requirements, acceptance criteria
module-13-hld-project-02-service-groups/	Same structure as project module above
module-14-hld-project-03-conduit-handhole/	
module-15-hld-project-04-splice-closure/	
module-16-hld-project-05-vicinity-map/	
module-17-lld-project-01-labelling/	
module-18-lld-project-02-schematic/	
module-19-lld-project-03-cable-terminal/	
module-20-lld-project-04-paperspace-splice/	
module-21-lld-project-05-bom/	
module-22-lld-project-06-splice-matrix/	
module-23-extra-certification-roadmap/	
  certifications-roadmap.md	Full PDF text of the certifications roadmap
_meta/	
  course-structure.json	Machine-readable full course outline (all modules, lessons, types, durations)
  quiz-bank.md	All 210+ questions across all 21 quizzes in one document
  improvement-notes.md	Kimi's own analysis of gaps, redundancies, improvements spotted while building the repo
 
4. How to Scrape Each Content Type

The course has 5 content types. Here is exactly how to handle each one.

4.1 PDF Lessons
PDFs are the most important content. They are the module reading materials and project briefs. You MUST get the full text of every single PDF.

Step-by-step to download a PDF:
1.	Navigate to the course outline: https://skarion.learnworlds.com/author/course?courseid=outside-plant-engineering-v2&tab=contents
2.	Hover over the PDF lesson row — action buttons appear: Settings, Preview, +, upload, duplicate, copy, move, delete
3.	Click the 'Settings' button
4.	A right-side panel opens titled 'Update pdf file'
5.	At the top right of the panel you will see the filename (e.g. '1.1.pdf') as a clickable link
6.	Click that filename link — the PDF opens in a new tab via the LearnWorlds PDF server
7.	Use WebBridge to extract the full text from the PDF tab
8.	Copy all extracted text into the corresponding .md file in the repo
9.	Close that panel, move to the next PDF

💡 PDF Naming Pattern
PDFs are named by module number: 1.1.pdf, 1.2.pdf, 2.1.pdf, 2.2.pdf, 2.3.pdf, 3.1.pdf, 4.1.pdf, etc.
Project brief PDFs are named by project: HLD Project 01.pdf, LLD Project 02.pdf, etc.
The filename shown in the Settings panel is the actual filename — note it before clicking.

PDF .md file format:
# Module 1.1 – OSP Engineering: Roles & Outlook

**Type:** PDF Reading Material
**Module:** 01 – Career & Industry Focus
**Filename:** 1.1.pdf

---

## Full Content

[PASTE FULL EXTRACTED PDF TEXT HERE — every word, every heading, every table]

---

## Notes

[Any formatting observations, e.g. 'Document contains diagrams that could not be extracted as text']

4.2 Video Lessons
You cannot download or transcribe the videos — they are hosted on LearnWorlds' video CDN and are not accessible via URL scraping. Instead, for each video lesson you will create a structured summary based on the title, module context, and any description visible in the admin panel.

How to get video information:
10.	Hover over the video lesson row in the course outline
11.	Note: the title and duration are always visible in the outline (e.g. 'Submarine to Home Journey  02:03')
12.	Click 'Settings' on the video — a right panel opens with the video title, description field, and settings
13.	Note the description if there is one
14.	Click 'Edit Video' if available — this opens the video editor which may show chapter markers or interactive question timestamps
15.	Record all of this in the .md file

Video .md file format:
# Introduction to OSP Engineering

**Type:** Video Lesson
**Module:** 01 – Career & Industry Focus
**Duration:** 01:08
**Position:** Lesson 1 of 5 in this module

---

## What This Video Covers

Based on the title and module context, this video introduces learners to the Outside Plant (OSP)
engineering field. As the opening lesson of Module 1, it likely covers:

- Definition of Outside Plant (OSP) engineering
- Overview of where OSP fits in the telecom industry
- What an OSP engineer does day-to-day
- Why OSP is a high-demand, lower-competition career path

## Description (from LearnWorlds admin)

[Paste any description text visible in the Settings panel, or write 'No description provided']

## Interactive Elements

[Note any interactive questions embedded in the video if visible in the editor, or 'None detected']

## Notes for Course Clone

- VIDEO REQUIRED: A replacement video covering the above topics must be recorded for the Skarion platform
- Suggested length: ~1–2 minutes
- Suggested format: Instructor talking head OR screen + voiceover with slides

4.3 Quiz Lessons
Every quiz must be fully captured — all questions, all answer options, and the correct answer marked. There are 21 quizzes with approximately 210+ questions total.

How to access quiz questions:
16.	Hover over the quiz lesson row in the course outline
17.	Click the 'Settings' button (the gear/Settings button, NOT the bar-chart analytics icon)
18.	OR: look for an 'Edit' or pen icon that opens the quiz builder directly
19.	The quiz builder opens — left sidebar shows all question titles numbered 1 to N
20.	Click each question in the sidebar to reveal the full question text and answer options in the center panel
21.	Note: the correct answer is marked with a green checkmark (✓) and a '+1' score badge next to the correct option
22.	For Match the Following questions: the left column has items to match, the right column has images or text answers
23.	For Ordering questions: record the items and the correct order
24.	There is also an 'Export → Export as .csv' button at the top of the quiz builder — try this first as it exports ALL questions at once

🔑 Export CSV First
In the quiz builder, click Export (top menu bar) → Export as .csv
This downloads a CSV with all questions and answers for that quiz in one file.
Open it, read all the questions and answers, then write them into the quiz .md file.
If the CSV export fails or produces garbled output, fall back to clicking each question manually.

Quiz .md file format:
# Quiz 1 — Module 2: Network Architecture Fundamentals

**Total Questions:** 13
**Pass Mark:** 100% (open-book)
**Attempts:** Unlimited
**Type:** Open-book exam (stated in quiz start screen instructions)

---

## Questions

### Q1. Match the following
**Type:** Match
**Match these items to their images:**
| Term | Answer |
| ---- | ------ |
| FDH  | [Image of FDH cabinet — Fiber Distribution Hub] |
| ONT  | [Image of ONT device — Optical Network Terminal] |
| MST  | [Image of MST — Multi-Service Terminal] |
*(Images cannot be extracted — describe what each image shows)*

### Q2. What is the primary role of a cable landing station?
**Type:** Multiple Choice (select one)
- [ ] To store spare fiber optic cables
- [x] To connect subsea cables to terrestrial infrastructure  ✓ CORRECT
- [ ] To provide local internet service directly to homes
- [ ] To amplify optical signals

### Q3. Place the network component in order from top to bottom.
**Type:** Ordering
**Correct order:**
1. Central Office
2. FDH
3. MST
4. ONT
5. Router

[Continue for all questions...]

4.4 Project Assignments (HLD & LLD Projects)
Project modules (Modules 12–22) each contain one assignment. The assignment is the file-upload submission where candidates submit their AutoCAD design work. The assignment has instructions that must be fully captured.

How to access assignment content:
25.	Hover over the assignment lesson row — it shows a pencil/assignment icon
26.	Click Settings — the settings panel shows the assignment title and instructions
27.	Also open the PDF brief in the same module (the PDF file with the project instructions) — this has the full detailed brief
28.	Note: the assignment panel may also show accepted file types and max file size

Assignment .md file format:
# Assignment: HLD Project 01 – Tracing EOP, CL and ROW

**Type:** File Upload Assignment
**Module:** 12 – HLD Project 01
**Accepted Formats:** .dwg, .pdf, .zip, .dxf
**Max File Size:** [Note from settings panel]
**Pass Mark:** [Note from settings panel if visible]

---

## Assignment Instructions

[Paste full instructions text from the assignment settings panel]

## Project Brief (from PDF)

[Paste full text from the HLD Project 01 PDF brief — this is the main deliverable description]

## Walkthrough Video

**Video Title:** HLD Project 01 – Tracing EOP, CL and ROW
**Duration:** 08:53
**What the video demonstrates:**
[Describe what the instructor walkthrough covers based on the project title and context]

## Evaluation Criteria

[If visible in the assignment settings — otherwise note 'Not specified in admin panel']

4.5 SCORM Interactive Labs
The course has ~15 SCORM packages used as interactive simulations. These cannot be fully scraped as they are packaged HTML5/Flash applications. Document what each one is.

SCORM .md file format:
# SCORM Lab: Mini Fusion Lab

**Type:** SCORM Interactive Lab
**Module:** 04 – Fiber Technology Essentials (cont.)
**Filename:** mini_fusion_lab_scorm2004
**SCORM Version:** SCORM 2004

---

## What This Lab Simulates

Based on the filename and module context, this interactive lab simulates the fiber fusion
splicing process. Learners likely:
- Practice the steps of fusion splicing in a virtual environment
- See the equipment used and the correct procedure sequence
- Receive feedback on their choices

## Notes for Course Clone

- SCORM PACKAGE REQUIRED: The original .zip file can be exported from LearnWorlds and re-hosted
- Alternative: Build an equivalent interactive exercise using a tool like H5P or Articulate
- Original file is stored in LearnWorlds blob storage as: mini_fusion_lab_scorm2004
 
5. Module-by-Module Scraping Guide

Work through the modules in order. This table tells you exactly what to scrape in each module and what files to create.

#	Module Name	Folder Name	Files to Create
01	Career & Industry Focus	module-01-career-industry-focus/	README.md, 01-intro-to-osp-engineering.md (VIDEO), 02-osp-career-progression.md (VIDEO), 03-module-1-1-roles-outlook.md (PDF FULL TEXT), 04-essential-skills.md (VIDEO), 05-module-1-2-soft-skills.md (PDF FULL TEXT)
02	Network Architecture Fundamentals	module-02-network-architecture/	README.md, 01-submarine-to-home-journey.md (VIDEO), 02-module-2-1.md (PDF), 03-internet-co-to-customer.md (VIDEO), 04-passive-optical-network.md (VIDEO), 05-module-2-2.md (PDF), 06-optical-splitter-exfo.md (SCORM), 07-centralized-vs-cascaded.md (VIDEO), 08-module-2-3.md (PDF), quiz-01.md (13 QUESTIONS)
03	Fiber Technology Essentials	module-03-fiber-technology/	README.md, 01-fiber-mechanism-types.md (VIDEO), 02-fiber-colour-coding.md (VIDEO), 03-cable-attenuation-tests.md (VIDEO), 04-module-3-1.md (PDF), 05-color-snap.md (SCORM), 06-total-internal-reflection.md (SCORM), quiz-02.md (10 QUESTIONS)
04	Fiber Technology Essentials (cont.)	module-04-fiber-technology-cont/	README.md, 01-fiber-splicing.md (VIDEO), 02-splice-closures.md (VIDEO), 03-module-4-1.md (PDF), 04-mini-fusion-lab.md (SCORM), quiz-03.md (15 QUESTIONS)
05	Legal & Regulatory Framework	module-05-legal-regulatory/	README.md, 01-row-eop-cl.md (VIDEO), 02-rules-regulations.md (VIDEO), 03-module-5-1.md (PDF), 04-permit-picker.md (SCORM), quiz-04.md (10 QUESTIONS)
06	Underground Infrastructure	module-06-underground-infrastructure/	README.md, 01-underground-construction.md (VIDEO), 02-handholes-excavation.md (VIDEO), 03-ont-mounting.md (VIDEO), 04-module-6-1.md (PDF), 05-811-locate.md (SCORM), 06-aerial-fiber-networks.md (VIDEO), 07-aerial-installations.md (VIDEO), 08-storm-hardening-nesc.md (VIDEO), 09-aerial-maintenance.md (VIDEO), 10-module-6-2.md (PDF), 11-osp-hardware-choices.md (VIDEO), 12-terminal-sizing.md (VIDEO), 13-spansense.md (SCORM), 14-module-6-3.md (PDF), quiz-05.md (20 QUESTIONS)
07	GIS Address Classification & Capacity Planning	module-07-gis-capacity-planning/	README.md, 01-address-classification.md (VIDEO), 02-module-7-1.md (PDF), 03-capacity-calculation.md (VIDEO), 04-module-7-2.md (PDF), quiz-06.md (9 QUESTIONS)
08	PON Technology & Network Architecture	module-08-pon-technology/	README.md, 01-pon-gpon-xgpon.md (VIDEO), 02-module-8-1.md (PDF), quiz-07.md (10 QUESTIONS)
09	Design Constraints & Optimization	module-09-design-constraints/	README.md, 01-fiber-count-rules.md (VIDEO), 02-three-mechanical-rules.md (VIDEO), 03-fiber-optic-protection.md (VIDEO), 04-cost-optimization.md (VIDEO), 05-module-9-1.md (PDF), quiz-08.md (10 QUESTIONS)
10	HLD Theory	module-10-hld-theory/	README.md, 01-module-10-1-intro-hld.md (PDF), 02-module-10-2-mapping.md (PDF), 03-module-10-3-project-planning.md (PDF), 04-module-10-4-network-hierarchy.md (PDF), 05-module-10-5-placement-principles.md (PDF), quiz-09.md (14 QUESTIONS)
11	SKARION Design Standards	module-11-skarion-design-standards/	README.md, 01-skarion-design-standards.md (PDF — MOST IMPORTANT: this is proprietary Skarion content), quiz-10.md (20 QUESTIONS)
12	HLD Project 01 – Tracing EOP, CL and ROW	module-12-hld-project-01-eop-cl-row/	README.md, project-brief.md (PDF), walkthrough-video.md (VIDEO 08:53), quiz-11.md (10 QUESTIONS), assignment.md
13	HLD Project 02 – Service Groups	module-13-hld-project-02-service-groups/	README.md, project-brief.md (PDF), walkthrough-video.md (VIDEO 03:25), quiz-12.md (10 QUESTIONS), assignment.md
14	HLD Project 03 – Conduit, Handhole & Flowerpot	module-14-hld-project-03-conduit-handhole/	README.md, project-brief.md (PDF), walkthrough-video.md (VIDEO 06:16), quiz-13.md (10 QUESTIONS), assignment.md
15	HLD Project 04 – Splice Closure Placement	module-15-hld-project-04-splice-closure/	README.md, project-brief.md (PDF), walkthrough-video.md (VIDEO 05:00), quiz-14.md (10 QUESTIONS), assignment.md
16	HLD Project 05 – Vicinity Map	module-16-hld-project-05-vicinity-map/	README.md, project-brief.md (PDF), walkthrough-video.md (VIDEO 03:06), quiz-15.md (7 QUESTIONS), assignment.md
17	LLD Project 01 – Labelling Equipment	module-17-lld-project-01-labelling/	README.md, project-brief.md (PDF), walkthrough-video.md (VIDEO 05:06), quiz-16.md (10 QUESTIONS), assignment.md
18	LLD Project 02 – Schematic	module-18-lld-project-02-schematic/	README.md, project-brief.md (PDF), walkthrough-video.md (VIDEO 09:28), quiz-17.md (10 QUESTIONS), assignment.md
19	LLD Project 03 – Cable and Terminal Labelling	module-19-lld-project-03-cable-terminal/	README.md, project-brief.md (PDF), walkthrough-video.md (VIDEO 03:51), quiz-18.md (10 QUESTIONS), assignment.md
20	LLD Project 04 – Paperspace, Splice Point & Splice Diagram	module-20-lld-project-04-paperspace-splice/	README.md, project-brief.md (PDF), walkthrough-video.md (VIDEO 02:46), quiz-19.md (10 QUESTIONS), assignment.md
21	LLD Project 05 – BOM	module-21-lld-project-05-bom/	README.md, project-brief.md (PDF — NO VIDEO for this one), quiz-20.md (10 QUESTIONS), assignment.md
22	LLD Project 06 – Splice Matrix	module-22-lld-project-06-splice-matrix/	README.md, project-brief.md (PDF — NO VIDEO for this one), quiz-21.md (10 QUESTIONS), assignment.md
23	Extra: Certification Roadmap	module-23-extra-certification-roadmap/	README.md, certifications-roadmap.md (PDF FULL TEXT — this is a standalone bonus resource)
 
6. README Templates

6.1 Root README.md
# Skarion — Outside Plant Engineering V2 Course

This repository is a complete text-based clone of the OSP Engineering V2 course
hosted on Skarion's LearnWorlds platform.

## Course Overview

- **Platform:** LearnWorlds (being migrated to Skarion internal platform)
- **Course ID:** outside-plant-engineering-v2
- **Total Modules:** 23 (Modules 01–23)
- **Total Lessons:** 94 across 24 published sections
- **Content Types:** Videos (~45), PDFs (~34), Quizzes (21), Assignments (10), SCORM Labs (~15)
- **Course Structure:** Theory (Modules 1–11) → HLD Projects (12–16) → LLD Projects (17–22) → Extra (23)

## How to Use This Repo

- Each module has its own subfolder
- PDFs contain the full extracted text
- Videos contain a structured summary (title, duration, topics covered)
- Quizzes contain all questions and correct answers
- Assignments contain the full brief and submission requirements

## Module Index

| # | Module | Type |
|---|--------|------|
| 01 | Career & Industry Focus | Theory |
| 02 | Network Architecture Fundamentals | Theory |
| ... | ... | ... |
| 12–16 | HLD Projects 01–05 | Practical |
| 17–22 | LLD Projects 01–06 | Practical |
| 23 | Extra: Certification Roadmap | Bonus |

6.2 Module README Template
# Module [NUMBER]: [MODULE TITLE]

**Access:** Free (all learners)
**Status:** Published

## Learning Objectives

[List 3–5 learning objectives based on the content of this module]

## Lessons

| # | Title | Type | Duration/Pages |
|---|-------|------|----------------|
| 1 | [Lesson title] | Video | [duration] |
| 2 | [Lesson title] | PDF | [pages if known] |
| 3 | [Lesson title] | SCORM Lab | — |
| 4 | Quiz [N] | Quiz | [N] questions |

## Key Concepts Covered

[3–5 bullet points of the main concepts taught in this module]

## Prerequisites

[What should learners know before this module? Based on module order.]
 
7. The _meta/ Folder

This is the most valuable folder in the repo. It provides machine-readable and analysis-ready files about the whole course.

7.1 course-structure.json
A complete JSON representation of the course. Generate this AFTER you have scraped everything else. Format:

{
  "courseId": "outside-plant-engineering-v2",
  "courseTitle": "Outside Plant Engineering V2",
  "totalModules": 23,
  "totalLessons": 94,
  "modules": [
    {
      "number": 1,
      "title": "Career & Industry Focus",
      "folder": "module-01-career-industry-focus",
      "access": "free",
      "lessons": [
        {
          "position": 1,
          "title": "Introduction to OSP Engineering",
          "type": "video",
          "duration": "01:08",
          "file": "01-intro-to-osp-engineering.md"
        },
        {
          "position": 3,
          "title": "Module 1.1 - OSP Engineering: Roles & Outlook",
          "type": "pdf",
          "originalFilename": "1.1.pdf",
          "file": "03-module-1-1-roles-outlook.md"
        }
      ]
    }
  ]
}

7.2 quiz-bank.md
One single file with ALL 21 quizzes and all ~210+ questions. This is so the entire quiz bank can be reviewed in one pass. Format it as:
# OSP Engineering V2 — Full Quiz Bank

## Quiz 1 — Module 2: Network Architecture Fundamentals
**13 questions | Pass: 100% | Open book**

Q1. [question text]
- [ ] Option A
- [x] Option B ✓
- [ ] Option C

[...all 13 questions...]

---

## Quiz 2 — Module 3: Fiber Technology Essentials
[...and so on for all 21 quizzes...]

7.3 improvement-notes.md
As you scrape the course, note anything that stands out as a potential improvement. This is Kimi's own analysis. Examples:

# Course Improvement Notes — Kimi Analysis

Generated while building this repo on [DATE].

## Gaps Noticed

- Module 8 (PON Technology) only has 1 video and 1 PDF — seems thin compared to the topic's complexity
- Module 10 (HLD Theory) has 5 PDFs but NO videos — learners get no visual walkthrough before projects
- LLD Project 05 (BOM) and 06 (Splice Matrix) have no walkthrough video — learners go in blind

## Redundancies Noticed

- Modules 03 and 04 are both titled 'Fiber Technology Essentials' — confusing naming
- Quiz question wording inconsistency: some quizzes say 'select all that apply', quiz editor shows single select

## Content Quality Notes

- [Note anything that seems unclear, outdated, or incomplete in the PDFs]

## Structural Suggestions

- [Any ideas for restructuring based on seeing the full course]
 
8. Execution Order — Do It In This Sequence

Follow this exact order. Do not jump around. Commit to GitHub after each module so progress is saved even if your session times out.

🚨 Critical Rule — Commit After Every Module
After completing each module folder (all lessons, quiz, assignment), immediately commit to GitHub.
Do NOT batch all commits at the end. Session timeouts will lose your work.
Use commit message format: 'Add Module [N]: [Module Name]'

Phase 1 — Setup (do once)
29.	Confirm you can access the GitHub repo using your stored token
30.	Log into LearnWorlds admin at https://skarion.learnworlds.com using Abdullah's credentials
31.	Navigate to the course outline: https://skarion.learnworlds.com/author/course?courseid=outside-plant-engineering-v2&tab=contents
32.	Create root README.md and COURSE_SUMMARY.md — commit these first
33.	Create the _meta/ folder with empty placeholder files — commit

Phase 2 — Theory Modules (01–11) — Extract PDFs first
34.	For each of Modules 1–11, do PDFs FIRST (highest priority), then videos, then SCORM notes
35.	After each module's PDF files are done, do the quiz for that module
36.	Commit after every completed module

Phase 3 — Project Modules (12–22)
37.	For each project module: PDF brief → video summary → quiz → assignment
38.	These are the most important for candidates — be thorough on the briefs
39.	Commit after every completed project module

Phase 4 — Extra Module (23) & _meta files
40.	Complete Module 23 (Certification Roadmap PDF)
41.	Generate _meta/course-structure.json from everything you have scraped
42.	Compile _meta/quiz-bank.md from all 21 quiz .md files
43.	Write _meta/improvement-notes.md — your own analysis
44.	Final commit: 'Complete course repo — all 23 modules'
 
9. GitHub API Reference

If you prefer to create files via API rather than git clone, use these patterns with your stored token.

Create a file via GitHub API
# PUT request to create or update a file
PUT https://api.github.com/repos/{owner}/{repo}/contents/{path}

Headers:
  Authorization: Bearer {your_github_token}
  Content-Type: application/json

Body (JSON):
{
  "message": "Add Module 1.1 PDF content",
  "content": "{base64-encoded file content}",
  "branch": "main"
}

# To UPDATE an existing file, also include:
  "sha": "{current file sha from GET request}"

Get file SHA (needed for updates)
GET https://api.github.com/repos/{owner}/{repo}/contents/{path}
Headers: Authorization: Bearer {token}
# Response includes 'sha' field — use it in the PUT body

📝 Base64 Encoding
All file content must be base64-encoded when using the GitHub API.
In Python: import base64; base64.b64encode(content.encode()).decode()
In JavaScript: Buffer.from(content).toString('base64')
Markdown files with special characters should be UTF-8 encoded before base64.
 
10. Quality Checklist — Before You Finish

Run through this checklist after you think you are done. Do not mark complete until every item is checked.

Content Completeness
•	All 23 module folders exist in the repo
•	Every PDF lesson has its full text extracted (not just the title)
•	Every video lesson has a structured summary with title, duration, topics
•	Every quiz has ALL questions with ALL answer options and correct answers marked
•	Every project module (12–22) has: project-brief.md + walkthrough-video.md + quiz .md + assignment.md
•	Module 23 (Certification Roadmap) PDF is fully extracted
•	Module 11 (Skarion Design Standards) PDF is fully extracted — this is proprietary content, highest priority

_meta/ Folder
•	course-structure.json is complete and valid JSON
•	quiz-bank.md contains all 21 quizzes with all ~210+ questions
•	improvement-notes.md has at least 5 meaningful observations

GitHub Repo
•	Root README.md is clear and links to all modules
•	COURSE_SUMMARY.md exists with course overview
•	All commits have descriptive messages
•	All files are on the main branch
•	Repo is private

✅ Final Message to Abdullah
When you are done, send Abdullah a message confirming:
1. GitHub repo URL
2. Total number of files created
3. Any PDFs you could NOT extract (list them so he can download manually)
4. Any quiz questions you could not capture (list which quizzes need manual review)
5. Your top 3 improvement observations from improvement-notes.md


— End of Instructions for Kimi —
Skarion Internal | Prepared by Claude | June 2026 | Confidential
