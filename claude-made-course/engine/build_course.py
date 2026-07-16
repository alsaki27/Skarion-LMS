"""Build the Skarion Accounting Track master interactive course.

Compiles all modules into a single Master Course SCORM 1.2 zip
with a global left-nav catalog.
"""
import json
import os
import re
import sys
import zipfile
import shutil

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
ENGINE = os.path.dirname(os.path.abspath(__file__))
MODULES_DIR = os.path.join(ROOT, "modules")
SCORM_DIR = os.path.join(ROOT, "scorm-packages")
COURSES_DIR = os.path.join(ROOT, "..", "courses", "accounting-track")

TEMPLATE = open(os.path.join(ENGINE, "template.html"), encoding="utf-8").read()
THEME_CSS = open(os.path.join(ENGINE, "theme.css"), encoding="utf-8").read()
SCORM_JS = open(os.path.join(ENGINE, "scorm-api.js"), encoding="utf-8").read()
PLAYER_JS = open(os.path.join(ENGINE, "player.js"), encoding="utf-8").read()

DOWNLOAD_RE = re.compile(r"/download/([^\"]+)")

MANIFEST_TMPL = """<?xml version="1.0" standalone="no" ?>
<manifest identifier="SKARION_MASTER" version="1"
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
      <title>Skarion Accounting Track</title>
      <item identifier="ITEM_1" identifierref="RES_1">
        <title>Skarion Accounting Track</title>
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

def collect_download_refs(catalog):
    """Scan every content.json chunk for /download/<path> hrefs.
    Returns a list of relative paths (e.g. ['05-bank-rec/Jan.xlsx'])."""
    refs = []
    def walk(obj):
        if isinstance(obj, dict):
            for k, v in obj.items():
                if k in ("href",) and isinstance(v, str):
                    m = DOWNLOAD_RE.search(v)
                    if m:
                        refs.append(m.group(1))
                else:
                    walk(v)
        elif isinstance(obj, list):
            for x in obj:
                walk(x)
    for mod in catalog:
        walk(mod)
    # de-duplicate, preserve order
    seen = set(); out = []
    for r in refs:
        if r not in seen:
            seen.add(r); out.append(r)
    return out

def find_asset(src_path):
    """Resolve a /download/<src> path against the courses/accounting-track tree.
    Handles both the module-folder-prefixed and legacy (04- vs 05-) layouts."""
    if os.path.exists(src_path):
        return src_path
    # Legacy: 04-bank-reconciliation-lab vs 05-bank-reconciliation-lab
    alt = re.sub(r"^04-bank-reconciliation-lab", "05-bank-reconciliation-lab", src_path)
    if os.path.exists(alt):
        return alt
    alt2 = re.sub(r"^05-bank-reconciliation-lab", "04-bank-reconciliation-lab", src_path)
    if os.path.exists(alt2):
        return alt2
    return None

def main():
    slugs = sorted(d for d in os.listdir(MODULES_DIR) if os.path.isdir(os.path.join(MODULES_DIR, d)))

    catalog = []
    for slug in slugs:
        cpath = os.path.join(MODULES_DIR, slug, "content.json")
        if os.path.exists(cpath):
            content = json.load(open(cpath, encoding="utf-8"))
            content["slug"] = slug
            catalog.append(content)

    print(f"Building Master Course with {len(catalog)} modules...")

    # Collect downloadable asset references and resolve them under courses/accounting-track
    download_refs = collect_download_refs(catalog)
    download_assets = []  # list of (abs_src, arcname)
    missing = []
    for rel in download_refs:
        src = find_asset(os.path.normpath(os.path.join(COURSES_DIR, rel)))
        if src:
            download_assets.append((src, "download/" + rel.replace("\\", "/")))
        else:
            missing.append(rel)
    if missing:
        print(f"  [assets] {len(download_assets)} resolved, {len(missing)} MISSING (will need generated):")
        for m in missing[:20]:
            print(f"     - {m}")

    catalog_json = json.dumps(catalog, ensure_ascii=False)
    html = TEMPLATE
    html = html.replace("{{THEME_CSS}}", THEME_CSS)
    html = html.replace("{{CATALOG_JSON}}", catalog_json)
    html = html.replace("{{SCORM_JS}}", SCORM_JS)
    html = html.replace("{{PLAYER_JS}}", PLAYER_JS)

    skarionbooks_dir = os.path.join(ROOT, "skarionbooks")

    os.makedirs(SCORM_DIR, exist_ok=True)
    zip_path = os.path.join(SCORM_DIR, "Skarion-Accounting-Track-Master.zip")

    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr("imsmanifest.xml", MANIFEST_TMPL)
        z.writestr("index.html", html)

        if os.path.exists(skarionbooks_dir):
            for root, _, files in os.walk(skarionbooks_dir):
                for file in files:
                    file_path = os.path.join(root, file)
                    arcname = os.path.relpath(file_path, ROOT).replace("\\", "/")
                    z.write(file_path, arcname)

        for src, arcname in download_assets:
            z.write(src, arcname)

    # Build individual SCORM packages
    for mod in catalog:
        mod_html = TEMPLATE
        mod_html = mod_html.replace("{{THEME_CSS}}", THEME_CSS)
        mod_html = mod_html.replace("{{CATALOG_JSON}}", json.dumps([mod], ensure_ascii=False))
        mod_html = mod_html.replace("{{SCORM_JS}}", SCORM_JS)
        mod_html = mod_html.replace("{{PLAYER_JS}}", PLAYER_JS)
        
        mod_zip = os.path.join(SCORM_DIR, f"{mod['slug']}.zip")
        with zipfile.ZipFile(mod_zip, "w", zipfile.ZIP_DEFLATED) as z:
            z.writestr("imsmanifest.xml", MANIFEST_TMPL)
            z.writestr("index.html", mod_html)
            if os.path.exists(skarionbooks_dir):
                for root, _, files in os.walk(skarionbooks_dir):
                    for file in files:
                        file_path = os.path.join(root, file)
                        arcname = os.path.relpath(file_path, ROOT).replace("\\", "/")
                        z.write(file_path, arcname)
            for src, arcname in download_assets:
                z.write(src, arcname)

    # Also save to master-course/index.html for local testing
    master_dir = os.path.join(ROOT, "master-course")
    os.makedirs(master_dir, exist_ok=True)
    with open(os.path.join(master_dir, "index.html"), "w", encoding="utf-8") as f:
        f.write(html)

    master_sb = os.path.join(master_dir, "skarionbooks")
    if os.path.exists(skarionbooks_dir):
        if os.path.exists(master_sb):
            shutil.rmtree(master_sb)
        shutil.copytree(skarionbooks_dir, master_sb)

    # Mirror the download/ assets into master-course/download/ for local preview
    master_dl = os.path.join(master_dir, "download")
    for src, arcname in download_assets:
        dst = os.path.join(master_dir, arcname.replace("/", os.sep))
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        shutil.copyfile(src, dst)
    print(f"  [assets] {len(download_assets)} download files packaged + copied to master-course/download/")

    print(f"Master course built -> scorm-packages/Skarion-Accounting-Track-Master.zip")

if __name__ == "__main__":
    main()
