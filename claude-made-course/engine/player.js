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
    window.addEventListener("keydown", function (e) {
      if (e.target.tagName === "TEXTAREA" || e.target.tagName === "SELECT" || e.target.tagName === "INPUT") return;
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    });
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
      var requiresAction = c.type === "quiz" || c.type === "journal_entry_builder";
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

  function renderChunk(c, idx) {
    switch (c.type) {
      case "content": return renderContent(c);
      case "flip_cards": return renderFlipCards(c, idx);
      case "quiz": return renderQuiz(c, idx);
      case "journal_entry_builder": return renderJE(c, idx);
      case "exercise": return renderExercise(c);
      case "timeline": return renderTimeline(c);
      case "drag_and_drop": return renderDragAndDrop(c, idx);
      case "hotspot": return renderHotspot(c, idx);
      default: return "<p>Unknown chunk type: " + esc(c.type) + "</p>";
    }
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
    var html = '<div class="chunk-kicker">Knowledge check</div><h2 class="chunk-title">' + esc(c.title) + "</h2>";
    c.questions.forEach(function (q, qi) {
      html += '<div class="quiz-q" data-qi="' + qi + '">';
      html += '<div class="quiz-q-text">' + (qi + 1) + ". " + esc(q.q) + "</div>";
      html += '<div class="quiz-opts">';
      q.options.forEach(function (opt, oi) {
        html += '<button type="button" class="quiz-opt" onclick="SkarionPlayer.answerQuiz(' + idx + "," + qi + "," + oi + ')">' + esc(opt) + "</button>";
      });
      html += "</div>";
      html += '<div class="quiz-explain" id="explain-' + idx + "-" + qi + '">' + esc(q.explanation || "") + "</div>";
      html += "</div>";
    });
    html += '<div class="quiz-score-banner" id="score-' + idx + '"></div>';
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
        html += '<a class="file-chip" href="' + esc(f.href) + '" target="_blank" rel="noopener">📄 ' + esc(f.label) + "</a>";
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

  // ---------- Interaction handlers ----------
  window.SkarionPlayer = {
    answerQuiz: function (chunkIdx, qi, oi) {
      var qDef = LESSON.chunks[chunkIdx].questions[qi];
      var qEl = $('.quiz-q[data-qi="' + qi + '"]', chunks[chunkIdx + 1].el);
      var buttons = $all(".quiz-opt", qEl);
      buttons.forEach(function (b, i) {
        b.disabled = true;
        if (i === qDef.correct_index) b.classList.add("correct");
        else if (i === oi) b.classList.add("incorrect");
      });
      $("#explain-" + chunkIdx + "-" + qi).classList.add("show");

      state.quizScores[chunkIdx] = state.quizScores[chunkIdx] || {};
      state.quizScores[chunkIdx][qi] = oi === qDef.correct_index;

      var total = LESSON.chunks[chunkIdx].questions.length;
      var answered = Object.keys(state.quizScores[chunkIdx]).length;
      if (answered === total) {
        var correct = Object.values(state.quizScores[chunkIdx]).filter(Boolean).length;
        var banner = $("#score-" + chunkIdx);
        banner.textContent = "Score: " + correct + " / " + total + (correct === total ? " — nice work." : " — review the explanations above.");
        banner.classList.add("show");
        chunks[chunkIdx + 1].satisfied = true;
        updateNav();
      }
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
      }
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
    
    // Overall progress approximation across modules
    var globalPct = ((state.mod + (i / chunks.length)) / CATALOG.length);
    window.SkarionSCORM.setProgress(globalPct);
    if (state.mod === CATALOG.length - 1 && i === chunks.length - 1) {
      window.SkarionSCORM.complete(true);
    }
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
