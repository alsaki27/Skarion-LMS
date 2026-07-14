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

# Module 1 README
m1_readme = '''# Module 01: Career & Industry Focus

**Access:** Free (all learners)
**Status:** Published

## Learning Objectives

- Understand what Outside Plant (OSP) engineering is and where it fits in the telecom industry
- Explore the career progression path for OSP engineers
- Learn the essential technical and soft skills required for OSP engineering roles
- Understand the roles, responsibilities, and industry outlook for OSP professionals

## Lessons

| # | Title | Type | Duration |
|---|-------|------|----------|
| 1 | Introduction to OSP Engineering | Video | 01:08 |
| 2 | OSP Engineering Career Progression | Video | 01:10 |
| 3 | Module 1.1 - OSP Engineering: Roles & Outlook | PDF | — |
| 4 | Essential Skills for OSP Engineers | Video | 01:16 |
| 5 | Module 1.2 - Essential Soft Skills for OSP Engineers | PDF | — |

## Key Concepts Covered

- Definition and scope of OSP engineering
- Career path from entry-level to senior roles
- Industry demand and competitive landscape
- Technical skills (fiber, splicing, design tools)
- Soft skills (communication, problem-solving, teamwork)

## Prerequisites

None — this is the first module. No prior knowledge required.
'''

gh_put('module-01-career-industry-focus/README.md', m1_readme, 'Add Module 1: Career & Industry Focus')
print('Module 1 README created')

# Video 1: Introduction to OSP Engineering
v1 = '''# Introduction to OSP Engineering

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

No description provided

## Interactive Elements

None detected

## Notes for Course Clone

- VIDEO REQUIRED: A replacement video covering the above topics must be recorded for the Skarion platform
- Suggested length: ~1–2 minutes
- Suggested format: Instructor talking head OR screen + voiceover with slides
'''

gh_put('module-01-career-industry-focus/01-intro-to-osp-engineering.md', v1, 'Add Module 1.1: Introduction to OSP Engineering video summary')
print('Video 1 created')

# Video 2: OSP Engineering Career Progression
v2 = '''# OSP Engineering Career Progression

**Type:** Video Lesson
**Module:** 01 – Career & Industry Focus
**Duration:** 01:10
**Position:** Lesson 2 of 5 in this module

---

## What This Video Covers

Based on the title and module context, this video covers the career progression path for OSP engineers:

- Entry-level positions and starting points
- Mid-level roles and responsibilities
- Senior/leadership positions
- Salary expectations and growth trajectory
- Industry sectors that hire OSP engineers (telcos, contractors, utilities)

## Description (from LearnWorlds admin)

No description provided

## Interactive Elements

None detected

## Notes for Course Clone

- VIDEO REQUIRED: A replacement video covering career progression must be recorded
- Suggested length: ~1–2 minutes
- Suggested format: Visual timeline or chart showing career stages
'''

gh_put('module-01-career-industry-focus/02-osp-career-progression.md', v2, 'Add Module 1.2: OSP Engineering Career Progression video summary')
print('Video 2 created')

# Video 4: Essential Skills for OSP Engineers
v4 = '''# Essential Skills for OSP Engineers

**Type:** Video Lesson
**Module:** 01 – Career & Industry Focus
**Duration:** 01:16
**Position:** Lesson 4 of 5 in this module

---

## What This Video Covers

Based on the title and module context, this video covers the essential technical and soft skills required for OSP engineering roles:

- Technical skills: fiber optics, splicing, cable management, CAD/design tools
- Soft skills: communication, problem-solving, teamwork, safety awareness
- Certifications and qualifications that enhance employability
- Physical requirements and working conditions

## Description (from LearnWorlds admin)

No description provided

## Interactive Elements

None detected

## Notes for Course Clone

- VIDEO REQUIRED: A replacement video covering essential skills must be recorded
- Suggested length: ~1–2 minutes
- Suggested format: Slide-based presentation with skill categories
'''

gh_put('module-01-career-industry-focus/04-essential-skills.md', v4, 'Add Module 1.4: Essential Skills for OSP Engineers video summary')
print('Video 4 created')

print('Module 1 video files created. PDFs and remaining files need WebBridge extraction.')
