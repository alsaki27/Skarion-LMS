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
  };

  global.SkarionSCORM = SCORM;
})(window);
