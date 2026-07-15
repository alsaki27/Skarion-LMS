/* Generates a Canva-ready PPTX deck from a module's content.json.
 * Usage: node build_pptx.js <module-slug> [<module-slug> ...]
 * Reads:  ../modules/<slug>/content.json
 * Writes: ../slide-decks/<slug>.pptx
 */
const fs = require("fs");
const path = require("path");
const pptxgen = require("pptxgenjs");

const ROOT = path.join(__dirname, "..");
const MODULES_DIR = path.join(ROOT, "modules");
const OUT_DIR = path.join(ROOT, "slide-decks");

// ---------- Palette: "Midnight Ledger" — navy dominant, ice-blue support, gold accent ----------
const NAVY = "1E2761";
const NAVY_DARK = "141B49";
const ICE = "CADCFC";
const ICE_TINT = "EEF3FC";
const GOLD = "E8A33D";
const WHITE = "FFFFFF";
const INK = "20242E";
const GRAY = "5B6472";

const FONT_HEAD = "Cambria";
const FONT_BODY = "Calibri";

function stripTags(html) {
  return html.replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
}

function extractBullets(html, maxBullets = 6) {
  const liMatches = [...html.matchAll(/<li>(.*?)<\/li>/gs)].map((m) => stripTags(m[1]));
  if (liMatches.length) return liMatches.slice(0, maxBullets);
  const pMatches = [...html.matchAll(/<p>(.*?)<\/p>/gs)].map((m) => stripTags(m[1])).filter(Boolean);
  if (pMatches.length) return pMatches.slice(0, maxBullets);
  const text = stripTags(html);
  return text ? [text] : [];
}

function extractTableRows(html) {
  const rows = [...html.matchAll(/<tr>(.*?)<\/tr>/gs)].map((m) =>
    [...m[1].matchAll(/<t[hd]>(.*?)<\/t[hd]>/gs)].map((c) => stripTags(c[1]))
  );
  return rows;
}

function badge(slide, num) {
  slide.addShape("ellipse", { x: 0.55, y: 0.5, w: 0.55, h: 0.55, fill: { color: GOLD }, line: { type: "none" } });
  slide.addText(num, { x: 0.55, y: 0.5, w: 0.55, h: 0.55, align: "center", valign: "middle", fontFace: FONT_HEAD, bold: true, fontSize: 16, color: NAVY_DARK });
}

function footer(slide, moduleTag) {
  slide.addText(moduleTag, { x: 0.5, y: 7.1, w: 8, h: 0.3, fontFace: FONT_BODY, fontSize: 9, color: GRAY });
}

function buildDeck(slug) {
  const contentPath = path.join(MODULES_DIR, slug, "content.json");
  if (!fs.existsSync(contentPath)) {
    console.log(`  SKIP ${slug}: no content.json`);
    return false;
  }
  const L = JSON.parse(fs.readFileSync(contentPath, "utf-8"));

  const pres = new pptxgen();
  pres.defineLayout({ name: "WIDE", width: 13.333, height: 7.5 });
  pres.layout = "WIDE";
  pres.author = "Skarion Accounting Track";
  pres.title = L.title;

  // ---------- Title slide ----------
  let slide = pres.addSlide();
  slide.background = { color: NAVY };
  slide.addShape("ellipse", { x: 10.6, y: -1.8, w: 5, h: 5, fill: { color: NAVY_DARK }, line: { type: "none" } });
  slide.addShape("ellipse", { x: -1.5, y: 5.2, w: 3.5, h: 3.5, fill: { color: NAVY_DARK }, line: { type: "none" } });
  slide.addText((L.moduleTag || "").toUpperCase(), { x: 0.8, y: 1.6, w: 10, h: 0.4, fontFace: FONT_BODY, fontSize: 13, bold: true, color: GOLD, charSpacing: 2 });
  slide.addText(L.title, { x: 0.8, y: 2.1, w: 11.2, h: 1.6, fontFace: FONT_HEAD, fontSize: 40, bold: true, color: WHITE });
  slide.addText(L.subhead || "", { x: 0.8, y: 3.75, w: 10.5, h: 1.1, fontFace: FONT_BODY, fontSize: 16, color: ICE, lineSpacingMultiple: 1.3 });
  if (L.dayMapping) {
    slide.addShape("roundRect", { x: 0.8, y: 5.1, w: 3.6, h: 0.5, rectRadius: 0.25, fill: { color: NAVY_DARK }, line: { color: GOLD, width: 1 } });
    slide.addText(L.dayMapping, { x: 0.8, y: 5.1, w: 3.6, h: 0.5, align: "center", valign: "middle", fontFace: FONT_BODY, fontSize: 11, color: ICE, bold: true });
  }
  slide.addText("SKARION ACCOUNTING TRACK", { x: 0.8, y: 6.9, w: 8, h: 0.3, fontFace: FONT_BODY, fontSize: 10, color: GRAY, charSpacing: 1 });

  // ---------- Hook slide ----------
  if (L.hook) {
    slide = pres.addSlide();
    slide.background = { color: ICE_TINT };
    badge(slide, "★");
    slide.addShape("roundRect", { x: 1.4, y: 1.6, w: 10.5, h: 4.0, rectRadius: 0.12, fill: { color: WHITE }, shadow: { type: "outer", color: "808080", opacity: 0.25, blur: 12, offset: 4, angle: 90 }, line: { type: "none" } });
    slide.addText("WHY THIS MATTERS", { x: 1.9, y: 2.0, w: 9.5, h: 0.4, fontFace: FONT_BODY, fontSize: 12, bold: true, color: GOLD, charSpacing: 2 });
    slide.addText(stripTags(L.hook), { x: 1.9, y: 2.5, w: 9.5, h: 2.8, fontFace: FONT_HEAD, fontSize: 22, italic: true, color: NAVY, lineSpacingMultiple: 1.4 });
    footer(slide, L.moduleTag);
  }

  // ---------- Content chunks ----------
  L.chunks.forEach((chunk, idx) => {
    const num = String(idx + 1).padStart(2, "0");
    if (chunk.type === "content") {
      slide = pres.addSlide();
      slide.background = { color: WHITE };
      badge(slide, num);
      slide.addText((chunk.kicker || "").toUpperCase(), { x: 1.35, y: 0.58, w: 9, h: 0.35, fontFace: FONT_BODY, fontSize: 11, bold: true, color: GOLD, charSpacing: 2 });
      slide.addText(chunk.title, { x: 0.8, y: 1.0, w: 11.7, h: 0.9, fontFace: FONT_HEAD, fontSize: 26, bold: true, color: NAVY });

      const bullets = extractBullets(chunk.bodyHtml, 5);
      const tableRows = extractTableRows(chunk.bodyHtml);
      const hasCallout = !!chunk.callout;
      const bodyW = hasCallout ? 7.0 : 11.7;

      if (tableRows.length > 1) {
        const tRows = tableRows.map((r, ri) =>
          r.map((cellText) => ({
            text: cellText,
            options: { fontFace: FONT_BODY, fontSize: 11, color: ri === 0 ? WHITE : INK, bold: ri === 0, fill: { color: ri === 0 ? NAVY : ri % 2 === 0 ? ICE_TINT : WHITE } },
          }))
        );
        slide.addTable(tRows, { x: 0.8, y: 2.05, w: bodyW, colW: Array(tableRows[0].length).fill(bodyW / tableRows[0].length), autoPage: false, border: { type: "solid", color: "D8DEEA", pt: 0.5 }, fontSize: 11 });
      } else if (bullets.length) {
        slide.addText(
          bullets.map((b) => ({ text: b, options: { bullet: { code: "25AA", indent: 18 }, breakLine: true, paraSpaceAfter: 12 } })),
          { x: 0.8, y: 2.05, w: bodyW, h: 4.3, fontFace: FONT_BODY, fontSize: 15, color: INK, valign: "top" }
        );
      }

      if (hasCallout) {
        const calloutColors = { tip: [GOLD, "FFF7E8"], warning: ["C9862B", "FFF3DE"], story: [NAVY, ICE_TINT], danger: ["B23B3B", "FBEAEA"] };
        const [accentColor, bg] = calloutColors[chunk.callout.type] || [NAVY, ICE_TINT];
        slide.addShape("roundRect", { x: 8.1, y: 2.05, w: 4.4, h: 3.9, rectRadius: 0.1, fill: { color: bg }, line: { type: "none" } });
        slide.addShape("ellipse", { x: 8.4, y: 2.35, w: 0.4, h: 0.4, fill: { color: accentColor }, line: { type: "none" } });
        slide.addText(chunk.callout.type.toUpperCase(), { x: 9.0, y: 2.35, w: 3.3, h: 0.4, fontFace: FONT_BODY, fontSize: 10, bold: true, color: accentColor, charSpacing: 1.5 });
        slide.addText(stripTags(chunk.callout.html), { x: 8.4, y: 2.85, w: 3.9, h: 2.9, fontFace: FONT_BODY, fontSize: 12.5, color: INK, lineSpacingMultiple: 1.3 });
      }
      footer(slide, L.moduleTag);
    }

    if (chunk.type === "flip_cards") {
      slide = pres.addSlide();
      slide.background = { color: WHITE };
      badge(slide, num);
      slide.addText(chunk.title, { x: 1.35, y: 0.55, w: 10, h: 0.6, fontFace: FONT_HEAD, fontSize: 24, bold: true, color: NAVY });
      const cards = chunk.cards.slice(0, 6);
      const cols = 3, rows = 2;
      const cardW = 3.85, cardH = 2.05, gapX = 0.25, gapY = 0.25, startX = 0.8, startY = 1.55;
      cards.forEach((card, i) => {
        const c = i % cols, r = Math.floor(i / cols);
        const x = startX + c * (cardW + gapX), y = startY + r * (cardH + gapY);
        slide.addShape("roundRect", { x, y, w: cardW, h: cardH, rectRadius: 0.09, fill: { color: ICE_TINT }, line: { type: "none" } });
        slide.addText(card.front, { x: x + 0.25, y: y + 0.18, w: cardW - 0.5, h: 0.6, fontFace: FONT_HEAD, fontSize: 14.5, bold: true, color: NAVY });
        slide.addText(stripTags(card.back), { x: x + 0.25, y: y + 0.78, w: cardW - 0.5, h: cardH - 0.95, fontFace: FONT_BODY, fontSize: 10.5, color: GRAY, lineSpacingMultiple: 1.2 });
      });
      footer(slide, L.moduleTag);
    }

    if (chunk.type === "quiz") {
      slide = pres.addSlide();
      slide.background = { color: NAVY };
      slide.addShape("ellipse", { x: 11.2, y: -1.2, w: 4, h: 4, fill: { color: NAVY_DARK }, line: { type: "none" } });
      slide.addText("SELF-CHECK", { x: 0.8, y: 0.55, w: 6, h: 0.4, fontFace: FONT_BODY, fontSize: 12, bold: true, color: GOLD, charSpacing: 2 });
      slide.addText(chunk.title, { x: 0.8, y: 0.95, w: 11, h: 0.7, fontFace: FONT_HEAD, fontSize: 24, bold: true, color: WHITE });
      const qs = chunk.questions.slice(0, 3);
      let y = 1.95;
      qs.forEach((q, qi) => {
        slide.addShape("ellipse", { x: 0.8, y: y, w: 0.42, h: 0.42, fill: { color: GOLD }, line: { type: "none" } });
        slide.addText(String(qi + 1), { x: 0.8, y: y, w: 0.42, h: 0.42, align: "center", valign: "middle", fontFace: FONT_BODY, fontSize: 13, bold: true, color: NAVY_DARK });
        slide.addText(q.q, { x: 1.4, y: y - 0.02, w: 10.7, h: 0.9, fontFace: FONT_BODY, fontSize: 14, color: ICE, lineSpacingMultiple: 1.25 });
        y += 1.55;
      });
      slide.addText("Answer choices and full explanations are in the interactive lesson.", { x: 0.8, y: 6.9, w: 10, h: 0.3, fontFace: FONT_BODY, fontSize: 10, italic: true, color: GRAY });
    }

    if (chunk.type === "journal_entry_builder") {
      slide = pres.addSlide();
      slide.background = { color: WHITE };
      badge(slide, num);
      slide.addText("PRACTICE: JOURNAL ENTRY", { x: 1.35, y: 0.58, w: 9, h: 0.35, fontFace: FONT_BODY, fontSize: 11, bold: true, color: GOLD, charSpacing: 2 });
      slide.addText(chunk.title, { x: 0.8, y: 1.0, w: 11.5, h: 0.7, fontFace: FONT_HEAD, fontSize: 22, bold: true, color: NAVY });
      slide.addShape("roundRect", { x: 0.8, y: 1.85, w: 11.7, h: 1.15, rectRadius: 0.08, fill: { color: ICE_TINT }, line: { type: "none" } });
      slide.addText(stripTags(chunk.scenarioHtml), { x: 1.1, y: 1.98, w: 11.1, h: 0.9, fontFace: FONT_BODY, fontSize: 12.5, color: INK, lineSpacingMultiple: 1.25 });

      const rows = [[
        { text: "Account", options: { bold: true, color: WHITE, fill: { color: NAVY }, fontFace: FONT_BODY, fontSize: 12 } },
        { text: "Debit", options: { bold: true, color: WHITE, fill: { color: NAVY }, fontFace: FONT_BODY, fontSize: 12, align: "right" } },
        { text: "Credit", options: { bold: true, color: WHITE, fill: { color: NAVY }, fontFace: FONT_BODY, fontSize: 12, align: "right" } },
      ]];
      chunk.solution.forEach((line, i) => {
        rows.push([
          { text: line.account, options: { fontFace: FONT_BODY, fontSize: 12, color: INK, fill: { color: i % 2 ? WHITE : ICE_TINT } } },
          { text: line.side === "debit" ? `$${line.amount.toFixed(2)}` : "", options: { fontFace: FONT_BODY, fontSize: 12, color: INK, align: "right", fill: { color: i % 2 ? WHITE : ICE_TINT } } },
          { text: line.side === "credit" ? `$${line.amount.toFixed(2)}` : "", options: { fontFace: FONT_BODY, fontSize: 12, color: INK, align: "right", fill: { color: i % 2 ? WHITE : ICE_TINT } } },
        ]);
      });
      slide.addTable(rows, { x: 1.6, y: 3.35, w: 8.0, colW: [4.4, 1.8, 1.8], border: { type: "solid", color: "D8DEEA", pt: 0.5 }, fontSize: 12 });
      slide.addText("Answer key — hidden from students in the interactive version until they submit their own entry.", { x: 0.8, y: 6.9, w: 10.5, h: 0.3, fontFace: FONT_BODY, fontSize: 9.5, italic: true, color: GRAY });
    }

    if (chunk.type === "exercise") {
      slide = pres.addSlide();
      slide.background = { color: ICE_TINT };
      badge(slide, num);
      slide.addText("HANDS-ON EXERCISE", { x: 1.35, y: 0.58, w: 9, h: 0.35, fontFace: FONT_BODY, fontSize: 11, bold: true, color: GOLD, charSpacing: 2 });
      slide.addText(chunk.title, { x: 0.8, y: 1.0, w: 11.5, h: 0.7, fontFace: FONT_HEAD, fontSize: 24, bold: true, color: NAVY });
      const steps = extractBullets(chunk.instructionsHtml, 5);
      slide.addShape("roundRect", { x: 0.8, y: 1.9, w: 7.3, h: 4.4, rectRadius: 0.1, fill: { color: WHITE }, line: { type: "none" } });
      slide.addText(
        steps.map((s) => ({ text: s, options: { bullet: { code: "25AA", indent: 16 }, breakLine: true, paraSpaceAfter: 10 } })),
        { x: 1.1, y: 2.15, w: 6.7, h: 3.9, fontFace: FONT_BODY, fontSize: 13.5, color: INK, valign: "top" }
      );
      if (chunk.files && chunk.files.length) {
        let fy = 1.9;
        chunk.files.forEach((f) => {
          slide.addShape("roundRect", { x: 8.35, y: fy, w: 4.15, h: 0.65, rectRadius: 0.32, fill: { color: NAVY }, line: { type: "none" } });
          slide.addText("📄 " + f.label, { x: 8.55, y: fy, w: 3.8, h: 0.65, align: "left", valign: "middle", fontFace: FONT_BODY, fontSize: 11, color: WHITE, bold: true });
          fy += 0.85;
        });
      }
      if (chunk.reflectionPrompt) {
        slide.addShape("roundRect", { x: 8.35, y: 5.3, w: 4.15, h: 1.55, rectRadius: 0.1, fill: { color: NAVY_DARK }, line: { type: "none" } });
        slide.addText("REFLECT", { x: 8.6, y: 5.45, w: 3.6, h: 0.3, fontFace: FONT_BODY, fontSize: 10, bold: true, color: GOLD, charSpacing: 1.5 });
        slide.addText(chunk.reflectionPrompt, { x: 8.6, y: 5.75, w: 3.6, h: 1.0, fontFace: FONT_BODY, fontSize: 11, italic: true, color: ICE, lineSpacingMultiple: 1.2 });
      }
    }
  });

  // ---------- Closing slide ----------
  slide = pres.addSlide();
  slide.background = { color: NAVY };
  slide.addShape("ellipse", { x: 5.4, y: 1.0, w: 2.5, h: 2.5, fill: { color: GOLD }, line: { type: "none" } });
  slide.addText("✓", { x: 5.4, y: 1.0, w: 2.5, h: 2.5, align: "center", valign: "middle", fontFace: FONT_HEAD, fontSize: 60, bold: true, color: NAVY_DARK });
  slide.addText("Module complete", { x: 1.8, y: 3.9, w: 9.7, h: 0.8, align: "center", fontFace: FONT_HEAD, fontSize: 30, bold: true, color: WHITE });
  slide.addText(L.title, { x: 1.8, y: 4.6, w: 9.7, h: 0.5, align: "center", fontFace: FONT_BODY, fontSize: 15, color: ICE });

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const outPath = path.join(OUT_DIR, `${slug}.pptx`);
  return pres.writeFile({ fileName: outPath }).then(() => {
    console.log(`  OK   ${slug} -> slide-decks/${slug}.pptx`);
    return true;
  });
}

async function main() {
  const args = process.argv.slice(2);
  const slugs = args.length ? args : fs.readdirSync(MODULES_DIR).filter((d) => fs.statSync(path.join(MODULES_DIR, d)).isDirectory());
  console.log(`Building ${slugs.length} deck(s)...`);
  for (const slug of slugs) {
    try {
      await buildDeck(slug);
    } catch (e) {
      console.log(`  FAIL ${slug}: ${e.message}`);
    }
  }
}

main();
