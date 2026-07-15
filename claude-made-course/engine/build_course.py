"""Build the Skarion Accounting Track interactive course.

For every modules/<slug>/content.json:
  1. Render a self-contained HTML lesson player -> modules/<slug>/index.html
  2. Package a SCORM 1.2 zip (imsmanifest.xml + the same self-contained HTML) -> scorm-packages/<slug>.zip

Run:  python build_course.py [slug ...]     (omit slugs to build everything)
"""
import json
import os
import sys
import zipfile

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
ENGINE = os.path.dirname(os.path.abspath(__file__))
MODULES_DIR = os.path.join(ROOT, "modules")
SCORM_DIR = os.path.join(ROOT, "scorm-packages")

TEMPLATE = open(os.path.join(ENGINE, "template.html"), encoding="utf-8").read()
THEME_CSS = open(os.path.join(ENGINE, "theme.css"), encoding="utf-8").read()
SCORM_JS = open(os.path.join(ENGINE, "scorm-api.js"), encoding="utf-8").read()
PLAYER_JS = open(os.path.join(ENGINE, "player.js"), encoding="utf-8").read()

MANIFEST_TMPL = """<?xml version="1.0" standalone="no" ?>
<manifest identifier="SKARION_{IDENT}" version="1"
  xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2"
  xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.imsproject.org/xsd/imscp_rootv1p1p2 imscp_rootv1p1p2.xsd
                       http://www.imsglobal.org/xsd/imsmd_rootv1p2p1 imsmd_rootv1p2p1.xsd
                       http://www.adlnet.org/xsd/adlcp_rootv1p2 adlcp_rootv1p2.xsd">
  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>1.2</schemaversion>
  </metadata>
  <organizations default="SKARION_ORG">
    <organization identifier="SKARION_ORG">
      <title>{TITLE}</title>
      <item identifier="ITEM_1" identifierref="RES_1">
        <title>{TITLE}</title>
      </item>
    </organization>
  </organizations>
  <resources>
    <resource identifier="RES_1" type="webcontent" adlcp:scormtype="sco" href="index.html">
      <file href="index.html"/>
    </resource>
  </resources>
</manifest>
"""


def render_html(content):
    lesson_json = json.dumps(content, ensure_ascii=False)
    html = TEMPLATE
    html = html.replace("{{TITLE}}", content["title"])
    html = html.replace("{{THEME_CSS}}", THEME_CSS)
    html = html.replace("{{LESSON_JSON}}", lesson_json)
    html = html.replace("{{SCORM_JS}}", SCORM_JS)
    html = html.replace("{{PLAYER_JS}}", PLAYER_JS)
    return html


def build_module(slug):
    mdir = os.path.join(MODULES_DIR, slug)
    content_path = os.path.join(mdir, "content.json")
    if not os.path.exists(content_path):
        print(f"  SKIP {slug}: no content.json yet")
        return False
    content = json.load(open(content_path, encoding="utf-8"))
    html = render_html(content)

    out_html = os.path.join(mdir, "index.html")
    with open(out_html, "w", encoding="utf-8") as f:
        f.write(html)

    os.makedirs(SCORM_DIR, exist_ok=True)
    zip_path = os.path.join(SCORM_DIR, f"{slug}.zip")
    manifest = MANIFEST_TMPL.format(IDENT=slug.replace("-", "_").upper(), TITLE=content["title"])
    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr("imsmanifest.xml", manifest)
        z.writestr("index.html", html)
        skarionbooks_dir = os.path.join(ROOT, "skarionbooks")
        if os.path.exists(skarionbooks_dir):
            for root, _, files in os.walk(skarionbooks_dir):
                for file in files:
                    file_path = os.path.join(root, file)
                    arcname = os.path.relpath(file_path, ROOT).replace("\\", "/")
                    z.write(file_path, arcname)

    n_chunks = len(content.get("chunks", []))
    print(f"  OK   {slug}: {n_chunks} chunks -> index.html + scorm-packages/{slug}.zip")
    return True


def main():
    args = sys.argv[1:]
    slugs = args if args else sorted(
        d for d in os.listdir(MODULES_DIR) if os.path.isdir(os.path.join(MODULES_DIR, d))
    )
    print(f"Building {len(slugs)} module(s)...")
    built = 0
    for slug in slugs:
        if build_module(slug):
            built += 1
    print(f"\n{built}/{len(slugs)} modules built.")


if __name__ == "__main__":
    main()
