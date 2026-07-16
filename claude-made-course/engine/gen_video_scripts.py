"""Generate standalone video-script markdown files for production.
Extracts every `video` chunk across modules/*/content.json and writes
video-scripts/VIDEO_{num}_{slug}.md with metadata header + transcript + production notes.
"""
import json, os, re, glob

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
MODDIR = os.path.join(ROOT, "modules")
OUT = os.path.join(ROOT, "video-scripts")
os.makedirs(OUT, exist_ok=True)

# Map of chunk number -> (module tag, duration). Inflected from where the video appears.
# We infer the chunk number from the kicker ("Chunk N — ...") when present; otherwise positional fallback.
DUR_BY_TITLE = {
    "Why Accounting Exists": "3 min",
    "Accrual vs. Cash — The Most Important Concept in Accounting": "4 min",
    "How to Read a Chart of Accounts in 5 Minutes": "3.5 min",
    "The 3-Way Match — Why You Never Pay an Invoice on Faith": "4 min",
    "How Bank Reconciliation Actually Works — The Two-Sided Method": "5 min",
    "What Happens During Month-End Close — A Real Close, Step by Step": "5 min",
    "Excel for Accountants — The 3 Functions That Do 80% of the Work": "4 min",
    "How to Answer Any Accounting Interview Question": "4 min",
    "Revenue Recognition in 3 Minutes (ASC 606)": "3 min",
    "Payroll — What Actually Gets Withheld and Why": "3.5 min",
    "What is Accounts Receivable Aging and Why It Matters": "3.5 min",
    "Bad Debt — Estimating What You Won't Collect (Allowance Method)": "3 min",
    "Tell Me About Yourself — The 90-Second Version": "3 min",
    "Salary Negotiation — What to Say When They Make the Offer": "3.5 min",
    "How to Use AI Tools in Accounting — Without Getting in Trouble": "4 min",
    "Your First Week on the Job — Don't Do These Things": "3.5 min",
    "What the CPA Exam Is — Do You Need It?": "3 min",
    "Building Your Accounting Portfolio Before Your First Job": "4 min",
    "The STAR Method in 4 Minutes — With Real Accounting Examples": "4 min",
    "How to Research a Company in 20 Minutes Before an Interview": "3 min",
    "The 8 Ratios Every Accountant Must Know Cold": "5 min",
    "What a Financial Model Actually Is": "4 min",
    "What Happens During an Audit — From the Accountant's Seat": "4 min",
}

def slugify(s):
    s = s.lower()
    s = re.sub(r"[^a-z0-9]+", "_", s).strip("_")
    return s

def chunk_num_from_kicker(c):
    m = re.search(r"Chunk\s+(\d+)", c.get("kicker", "") or "")
    return int(m.group(1)) if m else None

videos = []
for cpath in sorted(glob.glob(os.path.join(MODDIR, "*", "content.json"))):
    slug_mod = os.path.basename(os.path.dirname(cpath))
    try:
        data = json.load(open(cpath, encoding="utf-8"))
    except Exception:
        continue
    for c in data.get("chunks", []):
        if c.get("type") != "video":
            continue
        num = chunk_num_from_kicker(c)
        title = c.get("title", "Untitled")
        videos.append({
            "num": num,
            "title": title,
            "transcript": c.get("transcript", ""),
            "intro": c.get("intro", ""),
            "module": slug_mod,
            "tag": data.get("moduleTag", ""),
        })

print(f"Found {len(videos)} video chunks.")
count = 0
for v in videos:
    num = v["num"]
    title = v["title"]
    if num is None:
        print(f"  (skipped no-num): {title}")
        continue
    dur = DUR_BY_TITLE.get(title, "3–5 min")
    slug = slugify(title)
    fname = f"VIDEO_{num}_{slug}.md".replace("__", "_")
    # Strip HTML tags from transcript for a cleaner read
    raw = v["transcript"] or v["intro"] or "*(Transcript will be added during recording.)*"
    # Convert <p>...</p> blocks to paragraphs, <strong>...</strong> to bold
    txt = re.sub(r"</?p>", "\n", raw)
    txt = re.sub(r"<strong>(.*?)</strong>", r"**\1**", txt)
    txt = re.sub(r"<em>(.*?)</em>", r"*\1*", txt)
    txt = re.sub(r"</?ol>", "", txt)
    txt = re.sub(r"</?ul>", "", txt)
    txt = re.sub(r"</?li>", "\n- ", txt)
    txt = re.sub(r"\n{3,}", "\n\n", txt).strip()
    content = f"""# Video {num} — {title}
**Chunk:** {num} · **Module:** {v['tag']} · **Duration target:** {dur} · **Type:** Talking head / instructor
**Learning objective:** {v['intro'][:200]}{'...' if len(v['intro'])>200 else ''}

## Narration (transcript fallback exists in the in-course `video` chunk)

{txt}

## Visual direction (production brief)
- This script's narration is finalized (above). The visual column was authored in the Phase blueprints; for recorded production, layer B-roll and on-screen text per the blueprint AV table for this chunk.
- Use Skarion course assets (the bank statement, the AR aging table, SkarionBooks UI) wherever the script references a real number — these add credibility beyond stock footage.

## Reference images needed
1. The Skarion visual referenced in the narration (balance sheet / AR aging / SkarionBooks screen / ratio dashboard — pull from the matching module).
2. A clean two-column animation of the key concept (timeline, T-account, ratio dashboard) — build in Canva or Figma.
"""
    with open(os.path.join(OUT, fname), "w", encoding="utf-8") as f:
        f.write(content)
    count += 1
    print(f"  wrote {fname}")

print(f"Done. {count} video-script markdown files in {OUT}")