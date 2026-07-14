import json, base64, urllib.request

import os
token = os.environ['GITHUB_TOKEN']
repo = 'alsaki27/skarion-osp-course'
headers = {'Authorization': f'Bearer {token}', 'Accept': 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28'}

def gh_put(path, content, msg):
    content_b64 = base64.b64encode(content.encode('utf-8')).decode()
    data = json.dumps({'message': msg, 'content': content_b64, 'branch': 'main'}).encode()
    req = urllib.request.Request(f'https://api.github.com/repos/{repo}/contents/{path}', data=data, headers=headers, method='PUT')
    with urllib.request.urlopen(req) as r:
        return json.loads(r.read().decode())

# Create README.md
readme = '''# Skarion — Outside Plant Engineering V2 Course

This repository is a complete text-based clone of the OSP Engineering V2 course
hosted on Skarion's LearnWorlds platform.

## Course Overview

- **Platform:** LearnWorlds (being migrated to Skarion internal platform)
- **Course ID:** outside-plant-engineering-v2
- **Total Modules:** 23 (Modules 01–23)
- **Total Lessons:** ~94 across published sections
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
| 03 | Fiber Technology Essentials | Theory |
| 04 | Fiber Technology Essentials (cont.) | Theory |
| 05 | Legal & Regulatory Framework | Theory |
| 06 | Underground Infrastructure | Theory |
| 07 | GIS Address Classification & Capacity Planning | Theory |
| 08 | PON Technology & Network Architecture | Theory |
| 09 | Design Constraints & Optimization | Theory |
| 10 | HLD Theory | Theory |
| 11 | SKARION Design Standards | Theory |
| 12 | HLD Project 01 – Tracing EOP, CL and ROW | Practical |
| 13 | HLD Project 02 – Service Groups | Practical |
| 14 | HLD Project 03 – Conduit, Handhole & Flowerpot | Practical |
| 15 | HLD Project 04 – Splice Closure Placement | Practical |
| 16 | HLD Project 05 – Vicinity Map | Practical |
| 17 | LLD Project 01 – Labelling Equipment | Practical |
| 18 | LLD Project 02 – Schematic | Practical |
| 19 | LLD Project 03 – Cable and Terminal Labelling | Practical |
| 20 | LLD Project 04 – Paperspace, Splice Point & Splice Diagram | Practical |
| 21 | LLD Project 05 – BOM | Practical |
| 22 | LLD Project 06 – Splice Matrix | Practical |
| 23 | Extra: Certification Roadmap | Bonus |

---

*Built by Kimi via WebBridge scraping from skarion.learnworlds.com*
*Classification: Internal — Skarion Confidential*
'''

gh_put('README.md', readme, 'Initial commit: Add root README with course overview')
print('README.md created')

# Create COURSE_SUMMARY.md
summary = '''# COURSE_SUMMARY.md — Outside Plant Engineering V2

## Course Description
OSP Engineering V2 is a comprehensive training program for Outside Plant (OSP) engineers in the fiber telecommunications industry. The course covers the full spectrum of OSP engineering from career fundamentals through high-level design (HLD) and low-level design (LLD) projects.

## Target Audience
- Aspiring OSP engineers
- Telecom technicians transitioning to design roles
- Civil engineers entering fiber infrastructure
- Current OSP engineers seeking certification and skill advancement

## Learning Outcomes
Upon completion, learners will be able to:
- Understand the OSP engineering career path and industry landscape
- Design fiber network architecture from submarine cables to customer premises
- Apply fiber technology knowledge including splicing, termination, and cable management
- Navigate legal, regulatory, and right-of-way requirements
- Execute HLD projects using SKARION design standards
- Complete LLD projects including BOMs, schematics, and splice matrices
- Prepare for industry certifications (FOA, ETA, BICSI)

## Course Structure

### Theory Modules (1–11)
Foundation knowledge covering OSP concepts, network architecture, fiber technology, regulations, and design principles.

### HLD Projects (12–16)
High-Level Design practical projects:
- Tracing EOP, CL and ROW
- Service Group design
- Conduit, Handhole & Flowerpot placement
- Splice Closure placement
- Vicinity Map creation

### LLD Projects (17–22)
Low-Level Design practical projects:
- Equipment labelling
- Schematic drawings
- Cable and terminal labelling
- Paperspace and splice diagrams
- Bill of Materials (BOM)
- Splice matrix

### Extra (23)
Certification roadmap and career guidance.

## Tech Stack Used to Build This Course
- **Platform:** LearnWorlds LMS
- **Video hosting:** LearnWorlds native video CDN
- **PDFs:** Standard PDF documents
- **Quizzes:** LearnWorlds native quiz builder
- **SCORM Labs:** Interactive HTML5/SCORM 2004 packages
- **Assignments:** File upload with AutoCAD deliverables (.dwg, .dxf, .pdf)

---

*Generated during course audit. Content captured exactly as-is from LearnWorlds.*
'''

gh_put('COURSE_SUMMARY.md', summary, 'Add COURSE_SUMMARY.md with course description and learning outcomes')
print('COURSE_SUMMARY.md created')

# Create _meta/ folder placeholder files
meta_readme = '''# _meta/ — Course Metadata & Analysis

This folder contains machine-readable and analysis-ready files about the entire OSP Engineering V2 course.

## Files

- `course-structure.json` — Complete JSON representation of all modules, lessons, types, and durations
- `quiz-bank.md` — All 210+ questions across all 21 quizzes in one document
- `improvement-notes.md` — Kimi's analysis of gaps, redundancies, and improvement opportunities

---
'''

gh_put('_meta/README.md', meta_readme, 'Add _meta folder README')
print('_meta/README.md created')

# Placeholder course-structure.json
structure = '{\n  "courseId": "outside-plant-engineering-v2",\n  "courseTitle": "Outside Plant Engineering V2",\n  "status": "in-progress",\n  "note": "Will be completed after all modules are scraped"\n}'
gh_put('_meta/course-structure.json', structure, 'Add placeholder course-structure.json')
print('course-structure.json placeholder created')

print('All root files created successfully!')
