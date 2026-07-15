-- Skarion Accounting Track — course content store
-- Platform-neutral content model: modules -> lessons -> assignments; resources attach to modules;
-- learning objectives map to modules and to the MVR (minimum viable readiness) exit criteria.

PRAGMA foreign_keys = ON;

CREATE TABLE course (
    id            INTEGER PRIMARY KEY,
    slug          TEXT NOT NULL UNIQUE,
    title         TEXT NOT NULL,
    tagline       TEXT,
    audience      TEXT,
    duration_days INTEGER,
    version       TEXT NOT NULL DEFAULT 'v1'
);

CREATE TABLE module (
    id          INTEGER PRIMARY KEY,
    course_id   INTEGER NOT NULL REFERENCES course(id),
    position    INTEGER NOT NULL,            -- display order
    slug        TEXT NOT NULL UNIQUE,        -- folder name in repo
    title       TEXT NOT NULL,
    summary     TEXT,
    day_mapping TEXT,                        -- which day(s) of the 10-day path
    status      TEXT NOT NULL DEFAULT 'draft'
                CHECK (status IN ('draft','needs_redo','needs_revision','ready')),
    UNIQUE (course_id, position)
);

CREATE TABLE lesson (
    id        INTEGER PRIMARY KEY,
    module_id INTEGER NOT NULL REFERENCES module(id),
    position  INTEGER NOT NULL,
    title     TEXT NOT NULL,
    session   TEXT CHECK (session IN ('morning','afternoon','homework',NULL)),
    summary   TEXT,
    UNIQUE (module_id, position)
);

CREATE TABLE assignment (
    id           INTEGER PRIMARY KEY,
    module_id    INTEGER NOT NULL REFERENCES module(id),
    title        TEXT NOT NULL,
    instructions TEXT,
    deliverable  TEXT,
    est_hours    REAL,
    graded       INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE resource (
    id         INTEGER PRIMARY KEY,
    module_id  INTEGER NOT NULL REFERENCES module(id),
    file_path  TEXT NOT NULL,                -- relative to courses/accounting-track/
    kind       TEXT NOT NULL CHECK (kind IN ('doc','spreadsheet','pdf','markdown','folder')),
    role       TEXT NOT NULL CHECK (role IN ('student','instructor','both','internal')),
    title      TEXT NOT NULL,
    notes      TEXT
);

CREATE TABLE objective (
    id        INTEGER PRIMARY KEY,
    module_id INTEGER NOT NULL REFERENCES module(id),
    text      TEXT NOT NULL,
    mvr_item  INTEGER                        -- 1-10 if it maps to an MVR exit criterion, else NULL
);

-- Review findings tracked as first-class data so the LMS (or Nuzhat) can burn the list down.
CREATE TABLE review_finding (
    id          INTEGER PRIMARY KEY,
    module_id   INTEGER NOT NULL REFERENCES module(id),
    severity    TEXT NOT NULL CHECK (severity IN ('blocker','error','improvement','nice_to_have')),
    finding     TEXT NOT NULL,
    fix_status  TEXT NOT NULL DEFAULT 'open'
                CHECK (fix_status IN ('open','fixed_in_repo_copy','wont_fix')),
    owner       TEXT NOT NULL DEFAULT 'nuzhat'
);
