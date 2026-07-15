"""Build the Skarion Accounting Track master interactive course.

Compiles all modules into a single Master Course SCORM 1.2 zip
with a global left-nav catalog.
"""
import json
import os
import sys
import zipfile
import shutil

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
ENGINE = os.path.dirname(os.path.abspath(__file__))
MODULES_DIR = os.path.join(ROOT, "modules")
SCORM_DIR = os.path.join(ROOT, "scorm-packages")

TEMPLATE = open(os.path.join(ENGINE, "template.html"), encoding="utf-8").read()
THEME_CSS = open(os.path.join(ENGINE, "theme.css"), encoding="utf-8").read()
SCORM_JS = open(os.path.join(ENGINE, "scorm-api.js"), encoding="utf-8").read()
PLAYER_JS = open(os.path.join(ENGINE, "player.js"), encoding="utf-8").read()

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

    catalog_json = json.dumps(catalog, ensure_ascii=False)
    html = TEMPLATE
    html = html.replace("{{THEME_CSS}}", THEME_CSS)
    html = html.replace("{{CATALOG_JSON}}", catalog_json)
    html = html.replace("{{SCORM_JS}}", SCORM_JS)
    html = html.replace("{{PLAYER_JS}}", PLAYER_JS)

    os.makedirs(SCORM_DIR, exist_ok=True)
    zip_path = os.path.join(SCORM_DIR, "Skarion-Accounting-Track-Master.zip")
    
    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr("imsmanifest.xml", MANIFEST_TMPL)
        z.writestr("index.html", html)
        
        skarionbooks_dir = os.path.join(ROOT, "skarionbooks")
        if os.path.exists(skarionbooks_dir):
            for root, _, files in os.walk(skarionbooks_dir):
                for file in files:
                    file_path = os.path.join(root, file)
                    arcname = os.path.relpath(file_path, ROOT).replace("\\", "/")
                    z.write(file_path, arcname)

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

    print(f"Master course built -> scorm-packages/Skarion-Accounting-Track-Master.zip")

if __name__ == "__main__":
    main()
