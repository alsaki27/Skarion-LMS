/* Minimal SCORM 1.2 wrapper. Finds the LMS API in a parent/opener window (standard SCORM
   discovery algorithm); no-ops safely when run standalone outside an LMS (e.g. local preview). */
(function (global) {
  "use strict";

  function findAPI(win) {
    var attempts = 0;
    while (win && !win.API && win.parent && win.parent !== win && attempts < 10) {
      win = win.parent;
      attempts++;
    }
    return win && win.API ? win.API : null;
  }

  function locateAPI() {
    var api = findAPI(window);
    if (!api && window.opener) api = findAPI(window.opener);
    return api;
  }

  var SCORM = {
    api: null,
    initialized: false,
    standalone: true,

    init: function () {
      this.api = locateAPI();
      if (this.api) {
        var ok = this.api.LMSInitialize("");
        this.initialized = ok === "true" || ok === true;
        this.standalone = !this.initialized;
      } else {
        this.standalone = true;
      }
      return this.initialized;
    },

    setValue: function (key, value) {
      if (this.initialized && this.api) this.api.LMSSetValue(key, String(value));
    },

    getValue: function (key) {
      if (this.initialized && this.api) return this.api.LMSGetValue(key);
      return "";
    },

    commit: function () {
      if (this.initialized && this.api) this.api.LMSCommit("");
    },

    setProgress: function (fraction) {
      // SCORM 1.2 has no native progress-measure field; store it as a suspend_data breadcrumb.
      this.setValue("cmi.core.lesson_location", String(Math.round(fraction * 100)));
      this.commit();
    },

    recordScore: function (raw, max) {
      max = max || 100;
      this.setValue("cmi.core.score.raw", raw);
      this.setValue("cmi.core.score.min", 0);
      this.setValue("cmi.core.score.max", max);
      this.commit();
    },

    complete: function (passed) {
      this.setValue("cmi.core.lesson_status", passed === false ? "failed" : "completed");
      this.commit();
    },

    finish: function () {
      if (this.initialized && this.api) {
        this.commit();
        this.api.LMSFinish("");
      }
    },

    // ---------- Persisted course state (interactive progress) ----------
    // SCORM 1.2 gives us cmi.suspend_data (string, ~4096 chars typical).
    // We also mirror to localStorage so standalone preview (no LMS) still restores.
    LS_KEY: "skarion_course_state_v1",

    saveState: function (obj) {
      var s;
      try { s = JSON.stringify(obj); } catch (e) { return; }
      try { localStorage.setItem(this.LS_KEY, s); } catch (e) {}
      if (this.initialized) {
        // SCORM 1.2 suspend_data is a string; many LMSs accept ~4096 chars.
        this.setValue("cmi.suspend_data", s);
        this.commit();
      }
    },

    loadState: function () {
      var s = "";
      if (this.initialized) s = this.getValue("cmi.suspend_data") || "";
      if (!s) { try { s = localStorage.getItem(this.LS_KEY) || ""; } catch (e) {} }
      if (!s) return null;
      try { return JSON.parse(s); } catch (e) { return null; }
    },
  };

  global.SkarionSCORM = SCORM;
})(window);
