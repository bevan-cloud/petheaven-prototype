const fs = require('fs');
const path = require('path');
const BASE = 'C:\\Users\\bevan\\AppData\\Local\\Temp\\petheaven-prototype';

function read(rel)  { return fs.readFileSync(path.join(BASE, rel), 'utf8'); }
function write(rel, html) { fs.writeFileSync(path.join(BASE, rel), html, 'utf8'); }

const errs = [];
function ok(msg)   { console.log('  ✓ ' + msg); }
function warn(msg) { console.log('  ✗ ' + msg); errs.push(msg); }

// The comments injection goes just before the "Open in Notion" link at the end of
// the flyout innerHTML template literal.
// Projects uses spaces around ternary colon; roadmap/prioritization don't.
const COMMENTS_INJECT = "\r\n    \${window._nw ? window._nw.buildCommentsHtml(p) : ''}";

// Projects — two variants (with/without blank line before overlay)
const PROJ_ANCHOR_OLD  = "    </a>\` : ''}\r\n  \`;\r\n  document.getElementById('overlay').classList.add('open');";
const PROJ_ANCHOR_NEW  = COMMENTS_INJECT + "\r\n    </a>\` : ''}\r\n  \`;\r\n  document.getElementById('overlay').classList.add('open');";
const PROJ_ANCHOR_OLD2 = "    </a>\` : ''}\r\n  \`;\r\n\r\n  document.getElementById('overlay').classList.add('open');";
const PROJ_ANCHOR_NEW2 = COMMENTS_INJECT + "\r\n    </a>\` : ''}\r\n  \`;\r\n\r\n  document.getElementById('overlay').classList.add('open');";

const RM_PRIO_ANCHOR_OLD = "    </a>\`:''}\r\n  \`;\r\n  document.getElementById('overlay').classList.add('open');";
const RM_PRIO_ANCHOR_NEW = COMMENTS_INJECT + "\r\n    </a>\`:''}\r\n  \`;\r\n  document.getElementById('overlay').classList.add('open');";

const PROJ_FILES = [
  'projects/index.html',
  'staging/projects/index.html',
  'ucook/projects/index.html',
  'faithful-to-nature/projects/index.html',
];
const RM_FILES = [
  'roadmap/index.html',
  'staging/roadmap/index.html',
  'ucook/roadmap/index.html',
  'faithful-to-nature/roadmap/index.html',
];
const PRIO_FILES = [
  'prioritization/index.html',
  'staging/prioritization/index.html',
  'ucook/prioritization/index.html',
  'faithful-to-nature/prioritization/index.html',
];

function patch(files, oldStr, newStr) {
  for (const rel of files) {
    let f = read(rel);
    if (f.includes("buildCommentsHtml(p)")) { ok(rel + ' — already patched'); continue; }
    if (!f.includes(oldStr)) { warn(rel + ' — anchor not found'); continue; }
    f = f.replace(oldStr, newStr);
    write(rel, f);
    ok(rel);
  }
}

console.log('\n── Projects ─────────────────────────────────');
for (const rel of PROJ_FILES) {
  let f = read(rel);
  if (f.includes("buildCommentsHtml(p)")) { ok(rel + ' — already patched'); continue; }
  if (f.includes(PROJ_ANCHOR_OLD)) {
    f = f.replace(PROJ_ANCHOR_OLD, PROJ_ANCHOR_NEW); write(rel, f); ok(rel);
  } else if (f.includes(PROJ_ANCHOR_OLD2)) {
    f = f.replace(PROJ_ANCHOR_OLD2, PROJ_ANCHOR_NEW2); write(rel, f); ok(rel);
  } else { warn(rel + ' — anchor not found'); }
}

console.log('\n── Roadmap ──────────────────────────────────');
patch(RM_FILES, RM_PRIO_ANCHOR_OLD, RM_PRIO_ANCHOR_NEW);

console.log('\n── Prioritization ───────────────────────────');
patch(PRIO_FILES, RM_PRIO_ANCHOR_OLD, RM_PRIO_ANCHOR_NEW);

console.log('\n─────────────────────────────────────────────');
if (errs.length) { console.log('Issues:'); errs.forEach(e => console.log('  ✗', e)); }
else { console.log('All done — no issues.'); }
