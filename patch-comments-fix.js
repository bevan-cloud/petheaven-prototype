const fs = require('fs');
const path = require('path');
const BASE = 'C:\\Users\\bevan\\AppData\\Local\\Temp\\petheaven-prototype';

function read(rel)  { return fs.readFileSync(path.join(BASE, rel), 'utf8'); }
function write(rel, html) { fs.writeFileSync(path.join(BASE, rel), html, 'utf8'); }

const errs = [];
function ok(msg)   { console.log('  ✓ ' + msg); }
function warn(msg) { console.log('  ✗ ' + msg); errs.push(msg); }

// ── The problem: comments were injected BEFORE </a> — inside the anchor tag.
// ── Fix: move injection to AFTER the entire Open in Notion ternary block.

const COMMENTS_HTML = "\r\n    \${window._nw ? window._nw.buildCommentsHtml(p) : ''}";

// Projects variant (spaces around colon)
const PROJ_WRONG_OLD = COMMENTS_HTML + "\r\n    </a>\` : ''}\r\n  \`;\r\n  document.getElementById('overlay').classList.add('open');";
const PROJ_WRONG_OLD2 = COMMENTS_HTML + "\r\n    </a>\` : ''}\r\n  \`;\r\n\r\n  document.getElementById('overlay').classList.add('open');";

const PROJ_FIXED     = "\r\n    </a>\` : ''}" + COMMENTS_HTML + "\r\n  \`;\r\n  document.getElementById('overlay').classList.add('open');";
const PROJ_FIXED2    = "\r\n    </a>\` : ''}" + COMMENTS_HTML + "\r\n  \`;\r\n\r\n  document.getElementById('overlay').classList.add('open');";

// Roadmap/Prio variant (no spaces around colon)
const RM_WRONG_OLD   = COMMENTS_HTML + "\r\n    </a>\`:''}\r\n  \`;\r\n  document.getElementById('overlay').classList.add('open');";
const RM_FIXED       = "\r\n    </a>\`:''}" + COMMENTS_HTML + "\r\n  \`;\r\n  document.getElementById('overlay').classList.add('open');";

const ALL_FILES = [
  'projects/index.html',
  'staging/projects/index.html',
  'ucook/projects/index.html',
  'faithful-to-nature/projects/index.html',
  'roadmap/index.html',
  'staging/roadmap/index.html',
  'ucook/roadmap/index.html',
  'faithful-to-nature/roadmap/index.html',
  'prioritization/index.html',
  'staging/prioritization/index.html',
  'ucook/prioritization/index.html',
  'faithful-to-nature/prioritization/index.html',
];

for (const rel of ALL_FILES) {
  let f = read(rel);
  let changed = false;

  if (f.includes(PROJ_WRONG_OLD)) {
    f = f.replace(PROJ_WRONG_OLD, PROJ_FIXED);
    changed = true;
  } else if (f.includes(PROJ_WRONG_OLD2)) {
    f = f.replace(PROJ_WRONG_OLD2, PROJ_FIXED2);
    changed = true;
  } else if (f.includes(RM_WRONG_OLD)) {
    f = f.replace(RM_WRONG_OLD, RM_FIXED);
    changed = true;
  } else {
    warn(rel + ' — anchor not found (may already be correct)');
    continue;
  }

  write(rel, f);
  ok(rel + ' — fixed');
}

console.log('\n─────────────────────────────────────────────');
if (errs.length) { console.log('Issues:'); errs.forEach(e => console.log('  ✗', e)); }
else { console.log('All done — no issues.'); }
