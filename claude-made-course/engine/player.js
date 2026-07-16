/* Skarion Course Engine — master lesson player.
   Expects a global COURSE_CATALOG object (injected by the build script). */
(function () {
  "use strict";

  var state = { mod: 0, current: 0, quizScores: {}, jeSolved: {} };
  var chunks = []; // {id, el, dotEl, kind, requiresAction}
  var CATALOG = window.COURSE_CATALOG || [];
  var LESSON = null;

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.from((root || document).querySelectorAll(sel)); }

  function init() {
    window.SkarionSCORM.init();
    buildSidebar();
    loadModule(0);
    restoreState();
    wireMobileSidebar();
    window.addEventListener("keydown", function (e) {
      if (e.target.tagName === "TEXTAREA" || e.target.tagName === "SELECT" || e.target.tagName === "INPUT") return;
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    });
    window.addEventListener("beforeunload", function () { try { window.SkarionSCORM.finish(); } catch (e) {} });
  }

  // ---------- Persisted state (SCORM suspend_data + localStorage mirror) ----------
  // Shape: { mod, current, quizScores: { chunkIdx: { qi: bool } }, jeSolved: { chunkIdx: bool },
  //         drill: { chunkIdx: { correct, timedOut, total } }, openReview: { chunkIdx: bool },
  //         script: { chunkIdx: bool }, spreadsheet: { chunkIdx: bool }, scenario: { chunkIdx: bool },
  //         video: { chunkIdx: bool }, review: { chunkIdx: { qi: bool } } }
  function saveState() {
    var snap = {
      mod: state.mod, current: state.current,
      quizScores: state.quizScores || {}, jeSolved: state.jeSolved || {},
      drill: SkarionPlayer._drill || {}, openReview: SkarionPlayer._openReview || {},
      script: SkarionPlayer._scriptDone || {}, spreadsheet: SkarionPlayer._ssDone || {},
      scenario: SkarionPlayer._scDone || {}, video: SkarionPlayer._vidDone || {},
      review: SkarionPlayer._reviewState || {}
    };
    try { window.SkarionSCORM.saveState(snap); } catch (e) {}
  }
  // One-line recorder: mark a single chunk bucket as complete, mark satisfied, persist.
  function record(kind, chunkIdx, extra) {
    var buckets = {
      je: "jeSolved", video: "_vidDone", script: "_scriptDone",
      spreadsheet: "_ssDone", scenario: "_scDone", openReview: "_openReview"
    };
    if (kind === "je") { state.jeSolved[chunkIdx] = true; }
    else if (kind === "review") { SkarionPlayer._reviewState = SkarionPlayer._reviewState || {}; }
    else { var b = buckets[kind]; if (b) { var o = SkarionPlayer; o[b] = o[b] || {}; o[b][chunkIdx] = (extra === undefined ? true : extra); } }
    chunks[chunkIdx + 1].satisfied = true;
    updateNav();
    saveState();
  }
  function restoreState() {
    var snap;
    try { snap = window.SkarionSCORM.loadState(); } catch (e) { snap = null; }
    if (!snap) return;
    if (snap.quizScores) state.quizScores = snap.quizScores;
    if (snap.jeSolved) state.jeSolved = snap.jeSolved;
    SkarionPlayer._drill = snap.drill || {};
    SkarionPlayer._openReview = snap.openReview || {};
    SkarionPlayer._scriptDone = snap.script || {};
    SkarionPlayer._ssDone = snap.spreadsheet || {};
    SkarionPlayer._scDone = snap.scenario || {};
    SkarionPlayer._vidDone = snap.video || {};
    SkarionPlayer._reviewState = snap.review || {};
    // Defer visual restoration until after loadModule so the DOM exists.
    setTimeout(function () {
      try { if (typeof snap.mod === "number" && snap.mod !== state.mod) loadModule(snap.mod); } catch (e) {}
      try { if (typeof snap.current === "number") goTo(snap.current); } catch (e) {}
      setTimeout(function () { applySavedSatisfaction(snap); }, 220);
    }, 60);
  }

  // Mark chunks satisfied from saved flags and visually mark the saved answers where the UI supports it.
  function applySavedSatisfaction(snap) {
    var restoreBtn = function (idx, sel, optCorrectIdx) { /* quiz/review button restore is visual-only */ };
    var apply = function (idx) {
      var chunkData = LESSON && LESSON.chunks[idx];
      var screen = chunks[idx + 1] && chunks[idx + 1].el;
      if (!chunkData || !screen) return;
      var type = chunkData.type;

      if (type === "quiz" || type === "review_quiz") {
        var st = (type === "quiz" ? snap.quizScores : snap.review) || {};
        var per = st[idx];
        if (per) {
          (chunkData.questions || []).forEach(function (q, qi) {
            if (q.type === "open") return;
            var chose = -1, disable = false;
            // We only stored correctness booleans; mark the correct answer highlighted as a hint.
            var qEl = (type === "quiz")
              ? $('.quiz-q.gamified[data-qi="' + qi + '"]', screen) || $('.quiz-q[data-qi="' + qi + '"]', screen)
              : $('.quiz-q.review[data-qi="' + qi + '"]', screen);
            if (!qEl) return;
            var btns = $all(".quiz-opt-card", qEl);
            btns.forEach(function (b, oi) { b.disabled = true; if (oi === q.correct_index) b.classList.add("correct"); });
            var ev = $((type === "quiz" ? "#explain-" : "#explain-r-") + idx + "-" + qi, screen);
            if (ev) { ev.classList.add("show"); ev.className = "quiz-explain playful show success-text"; ev.innerHTML = "📌 <strong>Saved from last session.</strong> " + esc(q.explanation || ""); }
          });
          var banner = (type === "quiz") ? $("#score-" + idx, screen) : $("#score-r-" + idx, screen);
          if (banner) { banner.classList.add("show"); banner.innerHTML = "📌 Answered in a previous session — saved."; }
        }
      }

      if (type === "journal_entry_builder" && snap.jeSolved && snap.jeSolved[idx]) {
        var fb = $("#je-feedback-" + idx, screen);
        if (fb) { fb.className = "je-feedback show correct"; fb.innerHTML = "📌 <strong>Saved.</strong> You solved this journal entry in a previous session."; }
      }
      if (type === "video" && snap.video && snap.video[idx]) {
        var vfb = $("#video-fb-" + idx, screen);
        if (vfb) { vfb.className = "je-feedback show correct"; vfb.innerHTML = "📌 Watched in a previous session."; }
      }
      if (type === "script_builder" && snap.script && snap.script[idx]) {
        var sfb = $("#sb-fb-" + idx, screen);
        if (sfb) { sfb.className = "je-feedback show correct"; sfb.innerHTML = "📌 Your 90-second intro was saved in a previous session."; }
      }
      if (type === "spreadsheet_lab" && snap.spreadsheet && snap.spreadsheet[idx]) {
        var ssfb = $("#ss-fb-" + idx, screen);
        if (ssfb) { ssfb.className = "je-feedback show correct"; ssfb.innerHTML = "📌 Lab solved in a previous session."; }
      }
      if (type === "scenario_lab" && snap.scenario && snap.scenario[idx]) {
        var scfb = $("#sc-fb-" + idx, screen);
        if (scfb) { scfb.className = "je-feedback show correct"; scfb.innerHTML = "📌 Submitted in a previous session."; }
      }
      if (type === "timed_drill" && snap.drill && snap.drill[idx]) {
        var d = snap.drill[idx];
        var db = $("#drill-score-" + idx, screen);
        if (db) { db.classList.add("show"); db.innerHTML = "📌 Drill saved — " + d.correct + "/" + d.total + " correct (" + (d.timedOut || 0) + " timed out)."; }
      }
      // Reapply satisfied flag for the saved chunk
      if (isSatisfiedInSnap(snap, idx)) { chunks[idx + 1].satisfied = true; }
    };
    if (!LESSON) return;
    LESSON.chunks.forEach(function (_, i) { apply(i); });
    updateNav();
  }

  function isSatisfiedInSnap(snap, idx) {
    var c = LESSON && LESSON.chunks[idx];
    if (!c) return false;
    var t = c.type;
    if (t === "quiz") return snap.quizScores && snap.quizScores[idx] && Object.keys(snap.quizScores[idx]).length >= (c.questions || []).filter(function (q) { return q.type !== "open"; }).length;
    if (t === "review_quiz") {
      var qs = c.questions || []; var ok = true;
      qs.forEach(function (q, qi) {
        if (q.type === "open") return;
        if (!(snap.review && snap.review[idx] && snap.review[idx][qi])) ok = false;
      });
      return ok;
    }
    if (t === "journal_entry_builder") return !!(snap.jeSolved && snap.jeSolved[idx]);
    if (t === "video") return !!(snap.video && snap.video[idx]);
    if (t === "script_builder") return !!(snap.script && snap.script[idx]);
    if (t === "spreadsheet_lab") return !!(snap.spreadsheet && snap.spreadsheet[idx]);
    if (t === "scenario_lab") return !!(snap.scenario && snap.scenario[idx]);
    if (t === "timed_drill") return !!(snap.drill && snap.drill[idx] && snap.drill[idx].total > 0 && (snap.drill[idx].answered || snap.drill[idx].total));
    return false;
  }

  // ---------- Mobile sidebar (off-canvas drawer) ----------
  function wireMobileSidebar() {
    var sb = $("#catalog-sidebar"), backdrop = $("#sidebar-backdrop");
    var open = function () { sb.classList.add("open"); if (backdrop) backdrop.classList.add("show"); };
    var close = function () { sb.classList.remove("open"); if (backdrop) backdrop.classList.remove("show"); };
    var openBtn = $("#menu-open"), closeBtn = $("#menu-close");
    if (openBtn) openBtn.addEventListener("click", open);
    if (closeBtn) closeBtn.addEventListener("click", close);
    if (backdrop) backdrop.addEventListener("click", close);
    // Auto-close after a nav action on mobile
    document.addEventListener("skarion:nav", close);
    // Debounced resize
    var rt; window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(function () { if (window.innerWidth > 900) close(); }, 150); });
  }

  function buildSidebar() {
    var nav = $("#sidebar-nav");
    nav.innerHTML = "";
    CATALOG.forEach(function(mod, modIdx) {
      var modEl = document.createElement("div");
      modEl.className = "sb-mod";
      modEl.dataset.idx = modIdx;
      
      var title = document.createElement("div");
      title.className = "sb-mod-title";
      title.innerHTML = "<span>" + esc(mod.title) + "</span>";
      title.addEventListener("click", function() { loadModule(modIdx); });
      modEl.appendChild(title);
      
      var chunkList = document.createElement("ul");
      chunkList.className = "sb-chunks";
      
      var introLi = document.createElement("li");
      introLi.className = "sb-chunk";
      introLi.textContent = "Start";
      introLi.addEventListener("click", function() { if (state.mod !== modIdx) loadModule(modIdx); goTo(0); });
      chunkList.appendChild(introLi);
      
      mod.chunks.forEach(function(c, cIdx) {
        var li = document.createElement("li");
        li.className = "sb-chunk";
        li.textContent = shortLabel(c.title, cIdx + 1);
        li.addEventListener("click", function() { if (state.mod !== modIdx) loadModule(modIdx); goTo(cIdx + 1); });
        chunkList.appendChild(li);
      });
      
      modEl.appendChild(chunkList);
      nav.appendChild(modEl);
    });
  }

  function updateSidebarUI() {
    $all(".sb-mod").forEach(function(el, i) {
      el.classList.toggle("active", i === state.mod);
      var cEls = $all(".sb-chunk", el);
      cEls.forEach(function(cEl, ci) {
        cEl.classList.toggle("active", i === state.mod && ci === state.current);
      });
    });
  }

  function loadModule(modIdx) {
    if (modIdx < 0 || modIdx >= CATALOG.length) return;
    state.mod = modIdx;
    state.current = 0;
    LESSON = CATALOG[modIdx];
    
    // reset module-level tracking
    chunks = [];
    $("#stage-inner").innerHTML = "";
    $("#chunk-rail").innerHTML = "";
    
    $("#module-tag").textContent = LESSON.moduleTag || "Module " + (modIdx + 1);
    $("#module-title").textContent = LESSON.title;

    var rail = $("#chunk-rail");
    var stage = $("#stage-inner");

    chunks.push(makeScreen("intro", "Start", renderIntro(), false));
    LESSON.chunks.forEach(function (c, i) {
      var requiresAction = requiresInteraction(c);
      chunks.push(makeScreen("c" + i, c.railLabel || shortLabel(c.title, i + 1), renderChunk(c, i), requiresAction));
    });
    chunks.push(makeScreen("done", "Done", renderComplete(), false));

    chunks.forEach(function (ch) {
      stage.appendChild(ch.el);
      rail.appendChild(ch.dotEl);
    });

    goTo(0);
  }

  function shortLabel(title, n) {
    if (!title) return "Step " + n;
    return title.length > 18 ? title.slice(0, 16) + "…" : title;
  }

  function makeScreen(id, railLabel, innerHtml, requiresAction) {
    var el = document.createElement("div");
    el.className = "screen";
    el.dataset.id = id;
    el.innerHTML = innerHtml;

    var dot = document.createElement("button");
    dot.className = "chunk-dot";
    dot.textContent = railLabel;
    dot.addEventListener("click", function () { goTo(chunks.findIndex(function (c) { return c.id === id; })); });

    return { id: id, el: el, dotEl: dot, requiresAction: requiresAction, satisfied: !requiresAction };
  }

  function renderIntro() {
    var L = LESSON;
    return (
      '<div class="hero-eyebrow">' + esc(L.moduleTag || "") + " · " + esc(L.dayMapping || "") + '</div>' +
      '<h1 class="hero-title">' + esc(L.title) + "</h1>" +
      '<p class="hero-sub">' + esc(L.subhead) + "</p>" +
      (L.hook ? '<div class="hero-hook">' + esc(L.hook) + "</div>" : "")
    );
  }

  function renderComplete() {
    return (
      '<div class="center-screen">' +
      '<div class="complete-badge">✓</div>' +
      '<h1 class="hero-title" style="text-align:center;">Module complete</h1>' +
      '<p class="hero-sub" style="text-align:center;">' + esc(LESSON.title) + " is done. You can move to the next module.</p>" +
      '<button class="nav-btn primary" style="margin-top:20px;" onclick="SkarionPlayer.nextModule()">Go to next module →</button>' +
      "</div>"
    );
  }

  function requiresInteraction(c) {
    return c.type === "quiz" || c.type === "review_quiz" || c.type === "journal_entry_builder" ||
           c.type === "timed_drill" || c.type === "scenario_lab" || c.type === "spreadsheet_lab" ||
           c.type === "script_builder" || c.type === "completion";
  }

  function renderChunk(c, idx) {
    switch (c.type) {
      case "content": return renderContent(c);
      case "flip_cards": return renderFlipCards(c, idx);
      case "quiz": return renderQuiz(c, idx);
      case "review_quiz": return renderReviewQuiz(c, idx);
      case "timed_drill": return renderTimedDrill(c, idx);
      case "script_builder": return renderScriptBuilder(c, idx);
      case "scenario_lab": return renderScenarioLab(c, idx);
      case "spreadsheet_lab": return renderSpreadsheetLab(c, idx);
      case "completion": return renderCompletion(c, idx);
      case "video": return renderVideo(c, idx);
      case "journal_entry_builder": return renderJE(c, idx);
      case "exercise": return renderExercise(c);
      case "timeline": return renderTimeline(c);
      case "drag_and_drop": return renderDragAndDrop(c, idx);
      case "hotspot": return renderHotspot(c, idx);
      default: return "<p>Unknown chunk type: " + esc(c.type) + "</p>";
    }
  }

  function renderVideo(c, idx) {
    var html = '<div class="chunk-kicker">Watch first ▶</div><h2 class="chunk-title">' + esc(c.title) + "</h2>";
    html += '<p class="prose">' + esc(c.intro || "") + "</p>";
    html += '<div class="video-frame" id="video-frame-' + idx + '">';
    if (c.videoSrc) {
      html += '<video id="vid-' + idx + '" controls preload="metadata" playsinline style="width:100%;max-width:760px;border-radius:10px;display:block;"' +
              (c.posterSrc ? ' poster="' + esc(c.posterSrc) + '"' : "") + ">" +
              '<source src="' + esc(c.videoSrc) + '">' +
              "</video>";
    } else if (c.embedSrc) {
      html += '<iframe src="' + esc(c.embedSrc) + '" style="width:100%;max-width:760px;aspect-ratio:16/9;border:0;border-radius:10px;" allowfullscreen></iframe>';
    }
    html += "</div>";
    // Transcript fallback (shown when no real video exists)
    if (c.transcript && (!c.videoSrc && !c.embedSrc)) {
      html += '<div class="video-transcript"><div class="chunk-kicker">Transcript (video not recorded yet)</div><div class="prose">' + c.transcript + "</div></div>";
      html += '<button type="button" class="nav-btn primary" style="margin-top:18px;" onclick="SkarionPlayer.markVideoDone(' + idx + ')">I\'ve read this ▶</button>';
    }
    html += '<div id="video-fb-' + idx + '"></div>';
    return html;
  }

  function renderReviewQuiz(c, idx) {
    var html = '<div class="chunk-kicker" style="color:var(--accent-secondary,#2563eb);">Spaced repetition recall</div>';
    html += '<h2 class="chunk-title">' + esc(c.title) + "</h2>";
    html += '<p class="prose" style="margin-bottom:24px;">' + esc(c.intro || "Before we continue, let's make sure the last module is locked in.") + "</p>";
    c.questions.forEach(function (q, qi) {
      html += '<div class="quiz-q review quiz-q" data-qi="' + qi + '">';
      html += '<div class="quiz-q-text"><strong>Q' + (qi + 1) + ':</strong> ' + esc(q.q) + "</div>";
      if (q.type === "open") {
        html += '<textarea class="review-open" data-qi="' + qi + '" placeholder="Type your answer (just for your own recall)"></textarea>';
      } else {
        html += '<div class="quiz-opts cards">';
        q.options.forEach(function (opt, oi) {
          html += '<button type="button" class="quiz-opt-card" onclick="SkarionPlayer.answerReview(' + idx + "," + qi + "," + oi + ')">' + esc(opt) + "</button>";
        });
        html += "</div>";
      }
      html += '<div class="quiz-explain playful" id="explain-r-' + idx + "-" + qi + '"></div>';
      html += "</div>";
    });
    html += '<div class="quiz-score-banner gamified-banner" id="score-r-' + idx + '"></div>';
    var hasOpen = c.questions.some(function (q) { return q.type === "open"; });
    if (hasOpen) {
      html += '<button type="button" class="nav-btn primary" style="margin-top:18px;" onclick="SkarionPlayer.submitOpenReview(' + idx + ')">Mark review complete</button>';
      html += '<div class="je-feedback" id="openreview-fb-' + idx + '"></div>';
    }
    return html;
  }

  function renderTimedDrill(c, idx) {
    var html = '<div class="chunk-kicker" style="color:var(--accent-secondary,#2563eb);">Timed speed drill</div>';
    html += '<h2 class="chunk-title">' + esc(c.title) + "</h2>";
    html += '<p class="prose" style="margin-bottom:18px;">' + esc(c.intro || "60 seconds per entry. Answer fast — recall under pressure is the goal.") + "</p>";
    html += '<div class="drill-status" id="drill-status-' + idx + '"></div>';
    c.questions.forEach(function (q, qi) {
      html += '<div class="quiz-q timed" data-qi="' + qi + '" id="drill-q-' + idx + '-' + qi + '" style="display:none;">';
      html += '<div class="drill-timer" id="drill-timer-' + idx + '-' + qi + '">60</div>';
      html += '<div class="quiz-q-text"><strong>Entry ' + (qi + 1) + ' of ' + c.questions.length + ':</strong> ' + esc(q.q) + "</div>";
      html += '<div class="quiz-opts cards">';
      q.options.forEach(function (opt, oi) {
        html += '<button type="button" class="quiz-opt-card" onclick="SkarionPlayer.answerDrill(' + idx + "," + qi + "," + oi + ')">' + esc(opt) + "</button>";
      });
      html += "</div>";
      html += '<div class="quiz-explain playful" id="drill-explain-' + idx + "-" + qi + '"></div>';
      html += "</div>";
    });
    html += '<div class="quiz-score-banner gamified-banner" id="drill-score-' + idx + '"></div>';
    html += '<button type="button" class="nav-btn primary" id="drill-start-' + idx + '" onclick="SkarionPlayer.startDrill(' + idx + ')" style="margin-top:18px;">Start drill →</button>';
    return html;
  }

  function renderScenarioLab(c, idx) {
    var html = '<div class="chunk-kicker" style="color:var(--success-color,#059669);">Advanced scenario lab</div>';
    html += '<h2 class="chunk-title">' + esc(c.title) + "</h2>";
    html += '<p class="prose"><strong>Estimated time:</strong> ' + esc(c.time || "45–60 min") + "</p>";
    html += '<p class="prose">' + esc(c.intro || "") + "</p>";
    html += '<div class="scenario-tabs">';
    html += '<button class="scenario-tab active" onclick="SkarionPlayer.scenarioTab(' + idx + ',\'work\')">Your work</button>';
    html += '<button class="scenario-tab" id="st-sol-' + idx + '" onclick="SkarionPlayer.scenarioTab(' + idx + ',\'sol\')">Model solution</button>';
    html += "</div>";
    html += '<div class="scenario-panel" id="sp-work-' + idx + '">';
    if (c.setup) html += '<div class="prose"><div class="chunk-kicker">Setup</div>' + c.setup + "</div>";
    if (c.tasks) {
      html += '<div class="prose"><div class="chunk-kicker">Your tasks</div><ol>';
      c.tasks.forEach(function (t) { html += "<li>" + t + "</li>"; });
      html += "</ol></div>";
    }
    if (c.files && c.files.length) {
      html += '<div class="exercise-files">';
      c.files.forEach(function (f) {
        html += '<a class="file-chip" href="' + assetHref(f.href) + '" target="_blank" rel="noopener">📄 ' + esc(f.label) + "</a>";
      });
      html += "</div>";
    }
    html += '<div class="reflection-box"><label class="chunk-kicker">' + esc(c.submissionPrompt || "Submit your work and reconciliation memo here (saved locally in this browser only)") + '</label><textarea id="sc-sub-' + idx + '" placeholder="Paste your journal entries, memos, and conclusions here..."></textarea></div>';
    html += '<button type="button" class="nav-btn primary" style="margin-top:14px;" onclick="SkarionPlayer.submitScenario(' + idx + ')">Submit scenario work</button>';
    html += '<div class="je-feedback" id="sc-fb-' + idx + '"></div>';
    html += "</div>";
    html += '<div class="scenario-panel" id="sp-sol-' + idx + '" style="display:none;">';
    html += '<div class="prose">' + (c.solution || "<em>Model solution available after you submit your own work.</em>") + "</div>";
    html += "</div>";
    return html;
  }

  function renderSpreadsheetLab(c, idx) {
    var html = '<div class="chunk-kicker spreadsheet-kicker">Live in-browser Excel lab ⧉</div>';
    html += '<h2 class="chunk-title">' + esc(c.title) + "</h2>";
    html += '<div class="je-scenario">' + (c.scenarioHtml || "") + "</div>";
    html += '<div class="ss-toolbar"><span class="ss-tag">Skarion Excel Simulator</span><span class="ss-help">Edit white cells; shaded cells are given/locked. Target cells validate automatically.</span></div>';
    html += '<div class="ss-wrap" id="ss-wrap-' + idx + '"><div class="ss-table" id="ss-' + idx + '"></div></div>';
    html += '<div class="je-feedback" id="ss-fb-' + idx + '"></div>';
    if (c.journalSection) {
      html += '<div class="ss-je"><div class="chunk-kicker">' + esc(c.journalSection.label || "Correcting journal entries") + '</div>';
      html += '<table class="je-table" id="ss-je-' + idx + '"><thead><tr><th>Account</th><th>Debit</th><th>Credit</th></tr></thead><tbody>';
      var rows = c.journalSection.rows || 3;
      var opts = (c.journalSection.accounts || c.accounts || []).map(function (a) { return "<option>" + esc(a) + "</option>"; }).join("");
      for (var r = 0; r < rows; r++) {
        html += '<tr class="je-row"><td><select><option value="">— choose —</option>' + opts + '</select></td><td><input type="number" step="0.01" placeholder="0.00"></td><td><input type="number" step="0.01" placeholder="0.00"></td></tr>';
      }
      html += '</tbody></table>';
      html += '<button type="button" class="je-add-row" onclick="SkarionPlayer.addSSJERow(' + idx + ')">+ Add line</button> &nbsp;';
      html += '<button type="button" class="je-check-btn" onclick="SkarionPlayer.checkSSJE(' + idx + ')">Check journal entries</button><div class="je-feedback" id="ss-je-fb-' + idx + '"></div></div>';
    }
    html += '<button type="button" class="nav-btn primary" style="margin-top:16px;" onclick="SkarionPlayer.checkSpreadsheet(' + idx + ')">Check reconciliation</button>';
    setTimeout(function () { initSpreadsheet(idx); }, 120);
    return html;
  }

  function renderScriptBuilder(c, idx) {
    var html = '<div class="chunk-kicker">Guided script builder ▶</div><h2 class="chunk-title">' + esc(c.title) + "</h2>";
    html += '<p class="prose">' + (c.intro || "") + "</p>";
    c.fields.forEach(function (f, i) {
      html += '<div class="script-field">';
      html += '<label class="chunk-kicker">' + esc(f.label) + '</label>';
      html += '<p class="prose ss-help">' + esc(f.hint || "") + "</p>";
      html += '<textarea id="sb-' + idx + '-' + i + '" data-field="' + i + '" placeholder="' + esc(f.placeholder || "") + '" oninput="SkarionPlayer.updateScript(' + idx + ')"></textarea>';
      html += '<span class="ss-wordcount" id="sb-wc-' + idx + '-' + i + '">0 words</span>';
      html += "</div>";
    });
    html += '<div class="script-preview-wrap"><div class="chunk-kicker">Preview — your 90-second intro</div><div class="script-preview" id="sb-preview-' + idx + '"></div>';
    html += '<span class="ss-wordcount" id="sb-total-' + idx + '">0 words total · target ' + (c.minWords || 180) + "–" + (c.maxWords || 220) + "</span></div>";
    if (c.traps && c.traps.length) {
      html += '<div class="callout warning"><div><strong>Traps to avoid:</strong><ul>';
      c.traps.forEach(function (t) { html += "<li>" + t + "</li>"; });
      html += "</ul></div></div>";
    }
    html += '<button type="button" class="nav-btn primary" style="margin-top:16px;" onclick="SkarionPlayer.submitScript(' + idx + ',' + (c.minWords || 180) + ',' + (c.maxWords || 220) + ')">Save my intro script</button>';
    html += '<div class="je-feedback" id="sb-fb-' + idx + '"></div>';
    return html;
  }

  function renderCompletion(c, idx) {
    var html = '<div class="chunk-kicker" style="text-align:center;">Course Completion 🎓</div>';
    html += '<h2 class="chunk-title" style="text-align:center;">' + esc(c.title || "Skarion Accounting Track — Complete") + "</h2>";
    html += '<div class="completion-banner">Skarion Accounting Track — Complete</div>';
    html += '<div class="completion-summary"><div class="cs-line"><strong>Modules completed:</strong> <span id="cs-modules">' + (c.modules || 9) + '</span></div><div class="cs-line"><strong>Total chunks:</strong> <span id="cs-chunks">' + (c.totalChunks || 60) + '</span></div><div class="cs-line"><strong>Estimated course time:</strong> ~40 hours</div></div>';
    html += '<div class="certificate">';
    html += '<div class="cert-stamp">Certificate of Completion</div>';
    html += '<div class="cert-title">Skarion Accounting Track</div>';
    html += '<div class="cert-body">This is to certify that</div>';
    html += '<input type="text" id="cert-name-' + idx + '" class="cert-name-input" placeholder="Enter your name" oninput="SkarionPlayer.maybeCompleteCert(' + idx + ')" />';
    html += '<div class="cert-body">has successfully completed the full accounting simulation — covering GAAP, the accounting cycle, accounts payable &amp; payroll, accounts receivable &amp; billing, bank reconciliation, month-end close, advanced Excel, SkarionBooks, and interview preparation.</div>';
    html += '<div class="cert-date" id="cert-date-' + idx + '"></div>';
    html += '<div class="cert-sign">Skarion Learning — Accounting Track</div>';
    html += '<div class="cert-actions"><button type="button" class="nav-btn primary" onclick="SkarionPlayer.printCertificate(' + idx + ')">Download Certificate (Print to PDF)</button>';
    if (c.nextActions) {
      c.nextActions.forEach(function (a) { html += '<button type="button" class="nav-btn secondary" onclick="SkarionPlayer.certAction(\'' + esc(a.label).replace(/'/g, "\\'") + "')\">" + esc(a.label) + "</button>"; });
    }
    html += '</div>';
    html += '<div class="je-feedback" id="cert-fb-' + idx + '"></div></div>';
    return html;
  }

  function renderTimeline(c) {
    var html = '<div class="chunk-kicker">Process Flow</div><h2 class="chunk-title">' + esc(c.title) + "</h2>";
    html += '<div class="timeline">';
    c.steps.forEach(function(step, i) {
      html += '<div class="timeline-step" style="animation-delay: ' + (i * 0.2) + 's">';
      html += '<div class="timeline-dot"></div>';
      html += '<div class="timeline-content"><h3>' + esc(step.title) + '</h3><p>' + esc(step.desc) + '</p></div>';
      html += '</div>';
    });
    html += '</div>';
    return html;
  }

  function renderDragAndDrop(c, idx) {
    var html = '<div class="chunk-kicker">Interactive Exercise</div><h2 class="chunk-title">' + esc(c.title) + "</h2>";
    html += '<p class="prose">' + esc(c.instruction) + '</p>';
    html += '<div class="dnd-container">';
    html += '<div class="dnd-items">';
    c.items.forEach(function(item, i) {
      html += '<div class="dnd-item" draggable="true" id="drag-' + idx + '-' + i + '" data-target="' + esc(item.target) + '">' + esc(item.draggable) + '</div>';
    });
    html += '</div>';
    html += '<div class="dnd-targets">';
    var uniqueTargets = [];
    c.items.forEach(function(item) { if(uniqueTargets.indexOf(item.target) === -1) uniqueTargets.push(item.target); });
    uniqueTargets.forEach(function(tgt) {
      html += '<div class="dnd-target" data-accept="' + esc(tgt) + '"><h3>' + esc(tgt) + '</h3><div class="dnd-zone"></div></div>';
    });
    html += '</div></div>';
    
    // Add initialization script for this specific DOM node after render
    setTimeout(function() { initDragAndDrop(idx); }, 100);
    return html;
  }

  function initDragAndDrop(idx) {
    var items = $all('.dnd-item[id^="drag-' + idx + '-"]');
    var zones = $all('.dnd-container .dnd-zone');
    items.forEach(function(item) {
      item.addEventListener('dragstart', function(e) {
        e.dataTransfer.setData('text/plain', item.id);
        item.classList.add('dragging');
      });
      item.addEventListener('dragend', function() { item.classList.remove('dragging'); });
    });
    zones.forEach(function(zone) {
      zone.addEventListener('dragover', function(e) { e.preventDefault(); zone.parentElement.classList.add('drag-over'); });
      zone.addEventListener('dragleave', function(e) { zone.parentElement.classList.remove('drag-over'); });
      zone.addEventListener('drop', function(e) {
        e.preventDefault();
        zone.parentElement.classList.remove('drag-over');
        var id = e.dataTransfer.getData('text/plain');
        var dragged = document.getElementById(id);
        if(dragged && dragged.dataset.target === zone.parentElement.dataset.accept) {
          zone.appendChild(dragged);
          dragged.draggable = false;
          dragged.style.background = 'var(--success-color, #059669)';
          dragged.style.color = 'white';
        } else {
          alert('Incorrect! Try again.');
        }
      });
    });
  }

  function renderHotspot(c, idx) {
    var html = '<div class="chunk-kicker">Visual Analysis</div><h2 class="chunk-title">' + esc(c.title) + "</h2>";
    html += '<div class="hotspot-container" style="position:relative; display:inline-block; max-width:100%; border:1px solid #333; border-radius:8px; overflow:hidden;">';
    html += '<img src="' + esc(c.image) + '" style="display:block; max-width:100%; height:auto;" />';
    c.hotspots.forEach(function(hs, i) {
      html += '<div class="hotspot-dot" style="left:' + hs.x + '%; top:' + hs.y + '%;" onclick="this.querySelector(\'.hotspot-tooltip\').classList.toggle(\'show\')">';
      html += '<div class="hotspot-tooltip"><strong>' + esc(hs.label) + '</strong><br>' + esc(hs.info) + '</div>';
      html += '</div>';
    });
    html += '</div>';
    return html;
  }

  function renderContent(c) {
    var html = '<div class="chunk-kicker">' + esc(c.kicker || "Learn") + "</div>";
    html += '<h2 class="chunk-title">' + esc(c.title) + "</h2>";
    html += '<div class="prose">' + c.bodyHtml + "</div>";
    if (c.callout) {
      var icons = { tip: "💡", warning: "⚠️", story: "📎", danger: "🚫" };
      html += '<div class="callout ' + c.callout.type + '"><span class="icon">' + (icons[c.callout.type] || "•") + '</span><div>' + c.callout.html + "</div></div>";
    }
    return html;
  }

  function renderFlipCards(c, idx) {
    var html = '<div class="chunk-kicker">Quick check</div><h2 class="chunk-title">' + esc(c.title) + "</h2>";
    if (c.intro) html += '<p class="prose">' + esc(c.intro) + "</p>";
    html += '<div class="flip-grid">';
    c.cards.forEach(function (card, i) {
      html += '<div class="flip-card" onclick="this.classList.toggle(\'flipped\')">' +
        '<div class="flip-inner">' +
        '<div class="flip-face flip-front">' + esc(card.front) + "</div>" +
        '<div class="flip-face flip-back">' + esc(card.back) + "</div>" +
        "</div></div>";
    });
    html += "</div>";
    return html;
  }

  function renderQuiz(c, idx) {
    var html = '<div class="chunk-kicker">Gamified Challenge 🏆</div><h2 class="chunk-title">' + esc(c.title) + "</h2>";
    if(c.intro) html += '<p class="prose" style="margin-bottom:24px;">' + esc(c.intro) + '</p>';
    c.questions.forEach(function (q, qi) {
      html += '<div class="quiz-q gamified" data-qi="' + qi + '">';
      html += '<div class="quiz-q-text"><strong>Q' + (qi + 1) + ':</strong> ' + esc(q.q) + "</div>";
      html += '<div class="quiz-opts cards">';
      q.options.forEach(function (opt, oi) {
        html += '<button type="button" class="quiz-opt-card" onclick="SkarionPlayer.answerQuiz(' + idx + "," + qi + "," + oi + ')">' + esc(opt) + "</button>";
      });
      html += "</div>";
      html += '<div class="quiz-explain playful" id="explain-' + idx + "-" + qi + '"></div>';
      html += "</div>";
    });
    html += '<div class="quiz-score-banner gamified-banner" id="score-' + idx + '"></div>';
    return html;
  }

  function renderJE(c, idx) {
    var html = '<div class="chunk-kicker">Practice: journal entry</div><h2 class="chunk-title">' + esc(c.title) + "</h2>";
    html += '<div class="je-scenario">' + c.scenarioHtml + "</div>";
    html += '<table class="je-table" id="je-table-' + idx + '"><thead><tr><th style="width:45%">Account</th><th style="width:25%">Debit</th><th style="width:25%">Credit</th><th></th></tr></thead><tbody>';
    var startRows = c.startRows || 2;
    for (var r = 0; r < startRows; r++) html += jeRowHtml(c, idx);
    html += "</tbody></table>";
    html += '<button type="button" class="je-add-row" onclick="SkarionPlayer.addJERow(' + idx + ')">+ Add line</button><br>';
    html += '<button type="button" class="je-check-btn" onclick="SkarionPlayer.checkJE(' + idx + ',' + JSON.stringify(c.solution).replace(/"/g, "&quot;") + ')">Check my entry</button>';
    html += '<div class="je-feedback" id="je-feedback-' + idx + '"></div>';
    return html;
  }

  function jeRowHtml(c, idx) {
    var opts = c.accounts.map(function (a) { return "<option>" + esc(a) + "</option>"; }).join("");
    return '<tr class="je-row"><td><select><option value="">— choose account —</option>' + opts + "</select></td>" +
      '<td><input type="number" step="0.01" placeholder="0.00"></td>' +
      '<td><input type="number" step="0.01" placeholder="0.00"></td>' +
      '<td></td></tr>';
  }

  function renderExercise(c) {
    var html = '<div class="chunk-kicker">Hands-on exercise</div><h2 class="chunk-title">' + esc(c.title) + "</h2>";
    html += '<div class="exercise-card">';
    html += '<div class="prose">' + c.instructionsHtml + "</div>";
    if (c.files && c.files.length) {
      html += '<div class="exercise-files">';
      c.files.forEach(function (f) {
        html += '<a class="file-chip" href="' + assetHref(f.href) + '" target="_blank" rel="noopener">📄 ' + esc(f.label) + "</a>";
      });
      html += "</div>";
    }
    if (c.reflectionPrompt) {
      html += '<div class="reflection-box"><label class="chunk-kicker" style="margin-top:14px;">' + esc(c.reflectionPrompt) + '</label><textarea placeholder="Type your notes here (saved locally in this browser only)"></textarea></div>';
    }
    html += "</div>";
    return html;
  }

  function esc(s) {
    if (s == null) return "";
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function assetHref(href) {
    // Make /download/... relative so links resolve under master-course/ or SCORM zip root.
    if (typeof href !== "string") return href;
    if (href.indexOf("/download/") === 0) return "download/" + href.slice("/download/".length);
    return href;
  }

  // ---------- Interaction handlers ----------
  window.SkarionPlayer = {
    answerQuiz: function (chunkIdx, qi, oi) {
      var qDef = LESSON.chunks[chunkIdx].questions[qi];
      var qEl = $('.quiz-q[data-qi="' + qi + '"]', chunks[chunkIdx + 1].el);
      var buttons = $all(".quiz-opt-card", qEl);
      var isCorrect = (oi === qDef.correct_index);
      
      buttons.forEach(function (b, i) {
        b.disabled = true;
        if (i === qDef.correct_index) b.classList.add("correct");
        else if (i === oi) b.classList.add("incorrect");
      });
      
      var explainBox = $("#explain-" + chunkIdx + "-" + qi);
      if (isCorrect) {
        qEl.classList.add("animate-burst");
        explainBox.innerHTML = "🎉 <strong>Nailed it!</strong> " + esc(qDef.explanation || "");
        explainBox.classList.add("success-text");
      } else {
        qEl.classList.add("animate-shake");
        explainBox.innerHTML = "💥 <strong>Not quite!</strong> " + esc(qDef.explanation || "");
        explainBox.classList.add("error-text");
      }
      explainBox.classList.add("show");

      state.quizScores[chunkIdx] = state.quizScores[chunkIdx] || {};
      state.quizScores[chunkIdx][qi] = isCorrect;

      var total = LESSON.chunks[chunkIdx].questions.length;
      var answered = Object.keys(state.quizScores[chunkIdx]).length;
      if (answered === total) {
        var correct = Object.values(state.quizScores[chunkIdx]).filter(Boolean).length;
        var banner = $("#score-" + chunkIdx);
        if (correct === total) {
          banner.innerHTML = "🏆 <strong>Flawless Victory!</strong> " + correct + "/" + total + " points.";
          banner.classList.add("perfect");
        } else {
          banner.innerHTML = "⭐ <strong>Good effort!</strong> You scored " + correct + "/" + total + ". Check the explanations above to master this.";
        }
        banner.classList.add("show");
        chunks[chunkIdx + 1].satisfied = true;
        updateNav();
        saveState();
      }
      saveState();
    },

    addJERow: function (chunkIdx) {
      var c = LESSON.chunks[chunkIdx];
      var tbody = $("#je-table-" + chunkIdx + " tbody");
      var tmp = document.createElement("tbody");
      tmp.innerHTML = jeRowHtml(c, chunkIdx);
      tbody.appendChild(tmp.firstElementChild);
    },

    checkJE: function (chunkIdx, solution) {
      var rows = $all("#je-table-" + chunkIdx + " tbody tr");
      var entries = [];
      rows.forEach(function (r) {
        var sel = r.querySelector("select").value;
        var debit = parseFloat(r.querySelector("td:nth-child(2) input").value) || 0;
        var credit = parseFloat(r.querySelector("td:nth-child(3) input").value) || 0;
        if (sel && (debit || credit)) entries.push({ account: sel, debit: debit, credit: credit });
      });

      var totalDebit = entries.reduce(function (s, e) { return s + e.debit; }, 0);
      var totalCredit = entries.reduce(function (s, e) { return s + e.credit; }, 0);
      var balanced = Math.abs(totalDebit - totalCredit) < 0.01 && totalDebit > 0;

      function matches(sol) {
        return sol.every(function (line) {
          return entries.some(function (e) {
            return e.account === line.account &&
              ((line.side === "debit" && Math.abs(e.debit - line.amount) < 0.01 && e.credit === 0) ||
               (line.side === "credit" && Math.abs(e.credit - line.amount) < 0.01 && e.debit === 0));
          });
        }) && entries.length === sol.length;
      }

      var correct = balanced && matches(solution);
      var fb = $("#je-feedback-" + chunkIdx);
      fb.className = "je-feedback show " + (correct ? "correct" : "incorrect");
      if (correct) {
        fb.innerHTML = "✅ <strong>Correct.</strong> Debits and credits balance ($" + totalDebit.toFixed(2) + ") and the accounts match the expected entry.";
      } else if (!balanced) {
        fb.innerHTML = "⚠️ Debits ($" + totalDebit.toFixed(2) + ") and credits ($" + totalCredit.toFixed(2) + ") don't balance yet. Every journal entry needs total debits = total credits.";
      } else {
        fb.innerHTML = "❌ Debits and credits balance, but the accounts or amounts don't match the expected entry. Re-read the scenario and try again.";
      }
if (correct) {
        state.jeSolved[chunkIdx] = true;
        chunks[chunkIdx + 1].satisfied = true;
        updateNav();
        saveState();
      }
    },

    markVideoDone: function (chunkIdx) {
      record("video", chunkIdx);
    },

    markVideoDone: function (chunkIdx) {
      chunks[chunkIdx + 1].satisfied = true;
      var fb = $("#video-fb-" + chunkIdx);
      if (fb) { fb.className = "je-feedback show correct"; fb.innerHTML = "✅ Marked complete."; }
      updateNav();
    },

    answerReview: function (chunkIdx, qi, oi) {
      var qDef = LESSON.chunks[chunkIdx].questions[qi];
      var screen = chunks[chunkIdx + 1].el;
      var qEl = $('.quiz-q.review[data-qi="' + qi + '"]', screen);
      var buttons = $all(".quiz-opt-card", qEl);
      buttons.forEach(function (b, i) {
        b.disabled = true;
        if (i === qDef.correct_index) b.classList.add("correct");
        else if (i === oi) b.classList.add("incorrect");
      });
      var explainBox = $("#explain-r-" + chunkIdx + "-" + qi);
      var isCorrect = (oi === qDef.correct_index);
      qEl.classList.add(isCorrect ? "animate-burst" : "animate-shake");
      explainBox.innerHTML = (isCorrect ? "Locked in. " : "Recall gap. ") + esc(qDef.explanation || "");
      explainBox.className = "quiz-explain playful show " + (isCorrect ? "success-text" : "error-text");
      SkarionPlayer._reviewState = SkarionPlayer._reviewState || {};
      SkarionPlayer._reviewState[chunkIdx] = SkarionPlayer._reviewState[chunkIdx] || {};
      SkarionPlayer._reviewState[chunkIdx][qi] = isCorrect;
      finishReview(chunkIdx);
      saveState();
    },

    submitOpenReview: function (chunkIdx) {
      var screen = chunks[chunkIdx + 1].el;
      var openRows = $all(".review-open", screen);
      if (openRows.length === 0) { finishReview(chunkIdx); return; }
      var allFilled = true;
      openRows.forEach(function (ta) { if ((ta.value || "").trim().length < 10) allFilled = false; });
      var fb = $("#openreview-fb-" + chunkIdx);
      if (!allFilled) {
        fb.className = "je-feedback show incorrect";
        fb.innerHTML = "⚠️ Answer each written question (a short reason is enough) before marking complete.";
        return;
      }
      // Reveal explanations for open-ended questions
      openRows.forEach(function (ta) {
        var qi = parseInt(ta.dataset.qi, 10);
        var qDef = LESSON.chunks[chunkIdx].questions[isNaN(qi) ? -1 : qi];
        var explainBox = ta.closest(".quiz-q.review") && ta.closest(".quiz-q.review").querySelector(".quiz-explain");
        if (explainBox && qDef && qDef.explanation) {
          explainBox.innerHTML = "💡 <strong>Model reasoning.</strong> " + esc(qDef.explanation);
          explainBox.className = "quiz-explain playful show success-text";
        }
        ta.readOnly = true;
        SkarionPlayer._reviewState = SkarionPlayer._reviewState || {};
        SkarionPlayer._reviewState[chunkIdx] = SkarionPlayer._reviewState[chunkIdx] || {};
        SkarionPlayer._reviewState[chunkIdx][ta.dataset.qi] = true;
      });
      SkarionPlayer._openReview = SkarionPlayer._openReview || {};
      SkarionPlayer._openReview[chunkIdx] = true;
      if (fb) { fb.className = "je-feedback show correct"; fb.innerHTML = "Review complete — answers saved locally."; }
      finishReview(chunkIdx);
      saveState();
    },

    startDrill: function (chunkIdx) {
      var startBtn = $("#drill-start-" + chunkIdx);
      if (startBtn) startBtn.style.display = "none";
      SkarionPlayer._drill = SkarionPlayer._drill || {};
      SkarionPlayer._drill[chunkIdx] = { current: 0, correct: 0, timedOut: 0, timers: {} };
      SkarionPlayer.showDrillQ(chunkIdx, 0);
    },

    showDrillQ: function (chunkIdx, qi) {
      var drill = SkarionPlayer._drill[chunkIdx];
      var total = LESSON.chunks[chunkIdx].questions.length;
      // hide all
      $all(".quiz-q.timed", chunks[chunkIdx + 1].el).forEach(function (el) { el.style.display = "none"; });
      var qEl = $("#drill-q-" + chunkIdx + "-" + qi);
      if (!qEl) return;
      qEl.style.display = "block";
      $("#drill-status-" + chunkIdx).innerHTML = "Question " + (qi + 1) + " / " + total + " · Score: " + drill.correct + "/" + qi;
      var seconds = 60;
      var timerEl = $("#drill-timer-" + chunkIdx + "-" + qi);
      if (drill.timers[chunkIdx + "-" + qi]) clearInterval(drill.timers[chunkIdx + "-" + qi]);
      timerEl.textContent = seconds;
      drill.timers[chunkIdx + "-" + qi] = setInterval(function () {
        seconds--;
        if (timerEl) timerEl.textContent = seconds;
        if (seconds <= 0) {
          clearInterval(drill.timers[chunkIdx + "-" + qi]);
          SkarionPlayer.answerDrill(chunkIdx, qi, -1);
        }
      }, 1000);
    },

    answerDrill: function (chunkIdx, qi, oi) {
      var drill = SkarionPlayer._drill[chunkIdx];
      if (!drill) return;
      clearInterval(drill.timers[chunkIdx + "-" + qi]);
      var qDef = LESSON.chunks[chunkIdx].questions[qi];
      var qEl = $("#drill-q-" + chunkIdx + "-" + qi);
      var buttons = $all(".quiz-opt-card", qEl);
      buttons.forEach(function (b, i) {
        b.disabled = true;
        if (i === qDef.correct_index) b.classList.add("correct");
        else if (i === oi) b.classList.add("incorrect");
      });
      var explainBox = $("#drill-explain-" + chunkIdx + "-" + qi);
      var isCorrect = (oi === qDef.correct_index);
      if (isCorrect) drill.correct++;
      if (oi === -1) drill.timedOut++;
      explainBox.innerHTML = (isCorrect ? "✅ " : (oi === -1 ? "⏱️ <strong>Timed out.</strong> " : "❌ ")) + esc(qDef.explanation || "");
      explainBox.className = "quiz-explain playful show " + (isCorrect ? "success-text" : "error-text");
      var total = LESSON.chunks[chunkIdx].questions.length;
      if (qi + 1 < total) {
        setTimeout(function () { SkarionPlayer.showDrillQ(chunkIdx, qi + 1); }, 1300);
      } else {
        setTimeout(function () {
          var banner = $("#drill-score-" + chunkIdx);
          banner.innerHTML = "⏱️ <strong>Drill complete.</strong> " + drill.correct + "/" + total + " correct · " + drill.timedOut + " timed out.";
          banner.classList.add("show");
          drill.total = total; drill.answered = total;
          chunks[chunkIdx + 1].satisfied = true;
          updateNav();
          saveState();
        }, 1300);
      }
      saveState();
    },

    scenarioTab: function (chunkIdx, which) {
      $all(".scenario-tab", chunks[chunkIdx + 1].el).forEach(function (t) { t.classList.remove("active"); });
      $("#sp-work-" + chunkIdx).style.display = (which === "work") ? "block" : "none";
      $("#sp-sol-" + chunkIdx).style.display = (which === "sol") ? "block" : "none";
    },

    submitScenario: function (chunkIdx) {
      var sub = $("#sc-sub-" + chunkIdx);
      var fb = $("#sc-fb-" + chunkIdx);
      if (!sub || (sub.value || "").trim().length < 20) {
        fb.className = "je-feedback show incorrect";
        fb.innerHTML = "⚠️ Write at least a short memo before submitting — it's saved in this browser only.";
        return;
      }
      var solBtn = $("#st-sol-" + chunkIdx);
      // Reveal the solution tab after submission
      if (solBtn) solBtn.style.opacity = "1";
      var solPanel = $("#sp-sol-" + chunkIdx);
      if (solPanel) {
        var fullSol = LESSON.chunks[chunkIdx].solution || "<em>No model solution provided.</em>";
        solPanel.querySelector(".prose").innerHTML = fullSol;
      }
      fb.className = "je-feedback show correct";
      fb.innerHTML = "✅ <strong>Submitted.</strong> Your work is saved locally. The Model Solution tab is now unlocked — compare your approach.";
      record("scenario", chunkIdx);
    },

    // ---------- In-browser spreadsheet labs (jspreadsheet CE) ----------
    initSS: function (chunkIdx, opts) {
      var el = document.getElementById("ss-" + chunkIdx);
      if (!el || !window.jspreadsheet) return null;
      // lock cells via readOnly columns / rows by wrapping pre-filled data
      var cfg = {
        data: opts.rows || [],
        columns: (opts.columns || []).map(function (col) {
          return {
            title: col.title,
            width: col.width || 140,
            type: col.type || "text",
            mask: col.mask || (col.type === "numeric" ? "#,##0.00" : undefined),
            readOnly: !!col.readOnly
          };
        }),
        contextMenu: false,
        allowInsertRow: false, allowInsertColumn: false, allowDeleteRow: false, allowDeleteColumn: false,
        wordWrap: false,
        license: "MIT-licensed CE build"
      };
      return jspreadsheet(el, cfg);
    },

    addSSJERow: function (chunkIdx) {
      var tbody = document.querySelector("#ss-je-" + chunkIdx + " tbody");
      var c = LESSON.chunks[chunkIdx];
      var opts = (c.journalSection.accounts || []).map(function (a) { return "<option>" + esc(a) + "</option>"; }).join("");
      var tr = document.createElement("tr");
      tr.className = "je-row";
      tr.innerHTML = '<td><select><option value="">— choose —</option>' + opts + '</select></td><td><input type="number" step="0.01" placeholder="0.00"></td><td><input type="number" step="0.01" placeholder="0.00"></td>';
      tbody.appendChild(tr);
    },

    checkSSJE: function (chunkIdx) {
      var rows = $all("#ss-je-" + chunkIdx + " tbody tr");
      var sol = (LESSON.chunks[chunkIdx].journalSection && LESSON.chunks[chunkIdx].journalSection.solution) || [];
      var totalD = 0, totalC = 0, ok = sol.length === 0;
      var used = 0;
      rows.forEach(function (r) {
        var sel = r.querySelector("select").value;
        var d = parseFloat(r.querySelector("td:nth-child(2) input").value) || 0;
        var cc = parseFloat(r.querySelector("td:nth-child(3) input").value) || 0;
        if (sel && (d || cc)) { totalD += d; totalC += cc; used++; }
      });
      var fb = $("#ss-je-fb-" + chunkIdx);
      if (sol.length) {
        var matched = 0;
        sol.forEach(function (line) {
          var hit = Array.prototype.some.call(rows, function (r) {
            var sel = r.querySelector("select").value;
            var d = parseFloat(r.querySelector("td:nth-child(2) input").value) || 0;
            var c = parseFloat(r.querySelector("td:nth-child(3) input").value) || 0;
            return sel === line.account &&
              ((line.side === "debit" && Math.abs(d - line.amount) < 0.01 && c === 0) ||
               (line.side === "credit" && Math.abs(c - line.amount) < 0.01 && d === 0));
          });
          if (hit) matched++;
        });
        ok = (matched === sol.length) && Math.abs(totalD - totalC) < 0.01 && totalD > 0;
      }
      fb.className = "je-feedback show " + (ok ? "correct" : "incorrect");
      fb.innerHTML = ok ? "✅ <strong>Journal entries correct.</strong> Debits = Credits = $" + totalD.toFixed(2) + "." :
        (Math.abs(totalD - totalC) > 0.01 && totalD > 0 ? "⚠️ Debits ($" + totalD.toFixed(2) + ") ≠ Credits ($" + totalC.toFixed(2) + ") — balance before checking." :
         "❌ Accounts or amounts don't match the expected correcting entries yet.");
      return ok;
    },

    checkSpreadsheet: function (chunkIdx) {
      var c = LESSON.chunks[chunkIdx];
      var fb = $("#ss-fb-" + chunkIdx);
      var dim = window["SkarionSS_" + chunkIdx];
      var targets = c.targetCells || {};
      var ok = true;
      var detail = [];
      Object.keys(targets).forEach(function (cellRef) {
        var m = cellRef.match(/^([A-Z]+)(\d+)$/);
        if (!m) return;
        var col = m[1].charCodeAt(0) - 65;
        var row = parseInt(m[2], 10) - 1;
        if (dim && dim.el && typeof dim.el.jspreadsheet === "function" && typeof SkarionPlayer._ssVal === "function") {
          var actual = SkarionPlayer._ssVal(chunkIdx, row, col);
          var target = targets[cellRef];
          var matched = (target === null) ? (actual !== null && actual !== "") : (Math.abs((parseFloat(actual) || 0) - target) < 0.01);
          if (!matched) ok = false;
          detail.push(cellRef + " = " + (actual === null || actual === "" ? "—" : (typeof target === "number" ? "$" + (parseFloat(actual) || 0).toFixed(2) : actual)) + (matched ? " ✓" : " ✗ (want " + (typeof target === "number" ? "$" + target.toFixed(2) : target) + ")"));
        }
      });
      var jeOK = true;
      if (c.journalSection && c.journalSection.solution && c.journalSection.solution.length) {
        jeOK = SkarionPlayer.checkSSJE(chunkIdx);
      }
      if (Object.keys(targets).length === 0) ok = false;
      var bothSides = ok;
      if (c.requireBothSidesEqual && Object.keys(targets).length >= 2 && ok) {
        var vals = Object.keys(targets).map(function (ref) { return parseFloat(SkarionPlayer._ssVal(chunkIdx, parseInt(ref.match(/(\d+)/)[1]) - 1, ref.match(/([A-Z]+)/)[1].charCodeAt(0) - 65)) || 0; });
        bothSides = Math.abs(vals[0] - vals[1]) < 0.01;
      }
      var finalOK = ok && bothSides && jeOK;
      fb.className = "je-feedback show " + (finalOK ? "correct" : "incorrect");
      if (finalOK) {
        fb.innerHTML = (c.successMessage || "✅ Target cells match — lab complete.") + " <em>" + (detail.length ? detail.join(" · ") : "") + "</em>";
        record("spreadsheet", chunkIdx);
      } else {
        fb.innerHTML = (c.errorMessage || "❌ Not quite yet — check the highlighted cells.") + " <em>" + (detail.length ? "Targets: " + detail.join(" · ") : "") + "</em>";
      }
    },

    _ssVal: function (chunkIdx, row, col) {
      var dim = window["SkarionSS_" + chunkIdx];
      try {
        var v = dim && jspreadsheet && jspreadsheet.getValueFromCoords ? jspreadsheet.getValueFromCoords(dim, col, row) : null;
        return v;
      } catch (e) { return null; }
    },

    // ---------- Script builder (90-second intro) ----------
    updateScript: function (chunkIdx) {
      var c = LESSON.chunks[chunkIdx];
      var parts = [];
      var total = 0;
      c.fields.forEach(function (f, i) {
        var ta = document.getElementById("sb-" + chunkIdx + "-" + i);
        var txt = (ta && ta.value) || "";
        var wc = SkarionPlayer._wordCount(txt);
        var span = document.getElementById("sb-wc-" + chunkIdx + "-" + i);
        if (span) span.textContent = wc + " words" + (f.minWords ? " · target " + (f.minWords || 40) + "+" : "");
        if (txt.trim()) parts.push(txt.trim());
        total += wc;
      });
      var prev = document.getElementById("sb-preview-" + chunkIdx);
      if (prev) prev.textContent = parts.join("  ");
      var tot = document.getElementById("sb-total-" + chunkIdx);
      if (tot) tot.textContent = total + " words total · target " + (c.minWords || 180) + "–" + (c.maxWords || 220);
    },

    _wordCount: function (s) { return ((s || "").trim().match(/\S+/g) || []).length; },

    submitScript: function (chunkIdx, minW, maxW) {
      var c = LESSON.chunks[chunkIdx];
      var total = 0, allFilled = true;
      c.fields.forEach(function (f, i) {
        var ta = document.getElementById("sb-" + chunkIdx + "-" + i);
        var txt = (ta && ta.value) || "";
        if (txt.trim().length < (f.minLength || 30)) allFilled = false;
        total += SkarionPlayer._wordCount(txt);
      });
      var fb = $("#sb-fb-" + chunkIdx);
      if (!allFilled) {
        fb.className = "je-feedback show incorrect";
        fb.innerHTML = "⚠️ Fill in all three sections with at least a couple of real sentences each.";
        return;
      }
      if (total < minW || total > maxW) {
        fb.className = "je-feedback show incorrect";
        fb.innerHTML = "⚠️ Your script is " + total + " words — aim for " + minW + "–" + maxW + " (about 90 seconds spoken). Trim or expand, then save.";
        return;
      }
      c.fields.forEach(function (f, i) { var ta = document.getElementById("sb-" + chunkIdx + "-" + i); if (ta) ta.readOnly = true; });
      fb.className = "je-feedback show correct";
      fb.innerHTML = "✅ <strong>Intro script saved</strong> (" + total + " words). Practice it out loud — aim for 90 seconds flat. Your script is stored locally in this browser.";
      record("script", chunkIdx);
    },

    // ---------- Cert completion ----------
    maybeCompleteCert: function (chunkIdx) {
      var nameEl = document.getElementById("cert-name-" + chunkIdx);
      var fb = $("#cert-fb-" + chunkIdx);
      if (nameEl && (nameEl.value || "").trim().length >= 2) {
        chunks[chunkIdx + 1].satisfied = true;
        if (fb) { fb.className = "je-feedback show correct"; fb.innerHTML = "✅ Name entered — you can download your certificate."; }
        try { window.SkarionSCORM.complete(true); } catch (e) {}
        updateNav();
        saveState();
      }
    },

    printCertificate: function (chunkIdx) {
      var name = (document.getElementById("cert-name-" + chunkIdx) || {}).value || "";
      if ((name || "").trim().length < 2) {
        var fb = $("#cert-fb-" + chunkIdx);
        fb.className = "je-feedback show incorrect";
        fb.innerHTML = "⚠️ Enter your name on the certificate first.";
        return;
      }
      var dateEl = document.getElementById("cert-date-" + chunkIdx);
      if (dateEl) dateEl.textContent = new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
      var cert = document.querySelector(".certificate");
      var w = window.open("", "_blank");
      w.document.write("<html><head><title>Skarion Accounting Track — Certificate</title><style>" +
        "body{font-family:Georgia,'Times New Roman',serif;text-align:center;padding:40px;background:#fff;color:#14304a;}" +
        ".stamp{letter-spacing:3px;text-transform:uppercase;font-size:14px;color:#0a4d2c;margin-bottom:10px;}" +
        ".title{font-size:38px;font-weight:bold;margin:6px 0 26px;}" +
        ".body{font-size:18px;line-height:1.6;margin:14px 0;}" +
        ".name{font-size:30px;font-weight:bold;border-bottom:2px solid #14304a;display:inline-block;padding:4px 40px;margin:18px 0;}" +
        ".date{margin-top:20px;color:#444;font-size:15px;}" +
        ".sign{margin-top:18px;font-size:15px;color:#0a4d2c;font-weight:bold;}</style></head><body>" +
        cert.innerHTML.replace(/<button[^>]*>.*?<\/button>/gi, "").replace(/<input[^>]*>/gi, function (m) {
          return m.replace(/type="text"/i, 'type="text" value="' + name.replace(/"/g, "&quot;") + '" readonly');
        }) + "</body></html>");
      w.document.close();
      setTimeout(function () { w.print(); }, 400);
    },

    certAction: function (label) {
      // Navigate within the course based on the chosen action
      if (/portfolio/i.test(label) || /checklist/i.test(label)) { goTo(0); return; }
      if (/job search|30-day/i.test(label)) { next(); return; }
      next();
    },
    nextModule: function() {
      if (state.mod < CATALOG.length - 1) {
        loadModule(state.mod + 1);
      }
    }
  };

  // ---------- Navigation ----------
  function goTo(i) {
    if (i < 0 || i >= chunks.length) return;
    state.current = i;
    chunks.forEach(function (c, idx) { c.el.classList.toggle("active", idx === i); });
    updateRail();
    updateProgress();
    updateNav();
    updateSidebarUI();
    $("#stage").scrollTop = 0;

    // Wire video tracking for the active screen (idempotent via class flag)
    var activeScreen = chunks[i] && chunks[i].el;
    if (activeScreen && activeScreen.querySelector("video[id^='vid-']")) {
      var vids = $all("video[id^='vid-']", activeScreen);
      vids.forEach(function (vv) {
        var idx = parseInt((vv.id || "").replace("vid-", ""), 10);
        if (!isNaN(idx) && !vv.dataset.wired) { vv.dataset.wired = "1"; wireVideoTracking(idx); }
      });
    }

    // Overall progress approximation across modules
    var globalPct = ((state.mod + (i / chunks.length)) / CATALOG.length);
    window.SkarionSCORM.setProgress(globalPct);
    if (state.mod === CATALOG.length - 1 && i === chunks.length - 1) {
      window.SkarionSCORM.complete(true);
    }
    saveState();
    document.dispatchEvent(new CustomEvent("skarion:nav", { detail: { mod: state.mod, current: state.current } }));
  }

  function initSpreadsheet(chunkIdx) {
    var c = LESSON.chunks[chunkIdx];
    var el = document.getElementById("ss-" + chunkIdx);
    if (!el) return;
    if (!window.jspreadsheet) {
      el.innerHTML = '<p class="prose" style="color:#b00020;">⚠️ Excel simulator library failed to load (offline/CDN blocked). The download-only version of this lab still works — see the exercise chunk in the sidebar rail.</p>';
      return;
    }
    var rows = (c.data || []).map(function (r) { return r.slice(); });
    var cols = (c.columns || []).map(function (col) {
      return {
        title: col.title || "",
        width: col.width || 160,
        type: col.type || "text",
        mask: col.mask || (col.type === "numeric" ? "#,##0.00" : undefined),
        readOnly: !!col.readOnly,
        decimal: col.type === "numeric" ? "." : undefined
      };
    });
    // Apply per-cell lock from lockedCells ([cellRef]) -> set readOnly on matching column
    if (c.lockedCells && c.lockedCells.length) {
      c.lockedCells.forEach(function (ref) {
        var m = ref.match(/^([A-Z]+)(\d+)$/);
        if (!m) return;
        var colIdx = m[1].charCodeAt(0) - 65;
        var rowIdx = parseInt(m[2], 10) - 1;
        if (cols[colIdx]) cols[colIdx]._lockRows = cols[colIdx]._lockRows || {};
        if (cols[colIdx]) cols[colIdx]._lockRows[rowIdx] = true;
      });
    }
    try {
      window["SkarionSS_" + chunkIdx] = jspreadsheet(el, {
        data: rows,
        columns: cols,
        contextMenu: false,
        allowInsertRow: false, allowInsertColumn: false, allowDeleteRow: false, allowDeleteColumn: false,
        wordWrap: false,
        rowDrag: false,
        onchange: function () { /* validated on button click */ }
      });
    } catch (e) {
      el.innerHTML = '<p class="prose" style="color:#b00020;">⚠️ Could not initialize the Excel simulator: ' + esc(String(e && e.message || e)) + "</p>";
    }
  }

  function finishReview(chunkIdx) {
    var total = LESSON.chunks[chunkIdx].questions.length;
    var screen = chunks[chunkIdx + 1].el;
    var qEls = $all(".quiz-q.review", screen);
    var allAnswered = true;
    qEls.forEach(function (qEl) {
      if (qEl.querySelector(".quiz-opt-card") && !qEl.querySelector(".quiz-opt-card[disabled]") &&
          !qEl.querySelector(".review-open")) allAnswered = false;
    });
    // Open-ended (textarea) answers count as answered immediately (self-graded)
    var openAnswered = $all(".review-open", screen).length;
    var multiAnswered = $all(".quiz-q.review .quiz-opt-card[disabled]", screen).length > 0 ? true : openAnswered > 0;
    var answeredCount = $all(".quiz-q.review", screen).filter(function (el) {
      return el.querySelector(".review-open") || el.querySelector(".quiz-opt-card[disabled]");
    }).length;
    if (answeredCount === total) {
      var banner = $("#score-r-" + chunkIdx);
      if (banner) { banner.innerHTML = "✅ <strong>Review complete.</strong> Recall reinforced — let's continue."; banner.classList.add("show"); }
      chunks[chunkIdx + 1].satisfied = true;
      updateNav();
      saveState();
    }
  }

  // Mark a video chunk satisfied when playback reaches 80%
  function wireVideoTracking(idx) {
    var v = document.getElementById("vid-" + idx);
    if (!v) return;
    v.addEventListener("timeupdate", function () {
      if (v.duration && (v.currentTime / v.duration) >= 0.8) {
        chunks[idx + 1].satisfied = true;
        var fb = $("#video-fb-" + idx);
        if (fb && !fb.classList.contains("correct")) { fb.className = "je-feedback show correct"; fb.innerHTML = "✅ Watched 80% — complete."; updateNav(); }
        saveState();
      }
    });
  }

  function updateRail() {
    chunks.forEach(function (c, idx) {
      c.dotEl.classList.toggle("active", idx === state.current);
      c.dotEl.classList.toggle("done", idx < state.current);
    });
  }

  function updateProgress() {
    var pct = Math.round((state.current / (chunks.length - 1)) * 100);
    $("#progress-fill").style.width = pct + "%";
    $("#progress-label").textContent = pct + "%";
  }

  function updateNav() {
    var atEnd = state.current === chunks.length - 1;
    var atStart = state.current === 0;
    var cur = chunks[state.current];
    $("#nav-prev").disabled = atStart;
    $("#nav-next").disabled = atEnd || !cur.satisfied;
    if (atEnd) {
      $("#nav-next").textContent = (state.mod === CATALOG.length - 1) ? "Finished Course" : "Done with module";
      $("#nav-next").disabled = (state.mod === CATALOG.length - 1);
    } else {
      $("#nav-next").textContent = (cur.satisfied === false ? "Complete this step to continue" : (state.current === chunks.length - 2 ? "Finish module →" : "Continue →"));
    }
  }

  function next() { if (!$("#nav-next").disabled) { if (state.current === chunks.length - 1) { window.SkarionPlayer.nextModule(); } else { goTo(state.current + 1); } } }
  function prev() { if (!$("#nav-prev").disabled) goTo(state.current - 1); }

  document.addEventListener("DOMContentLoaded", function () {
    init();
    $("#nav-next").addEventListener("click", next);
    $("#nav-prev").addEventListener("click", prev);
  });
})();
