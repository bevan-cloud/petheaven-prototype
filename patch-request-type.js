const fs = require('fs');
const path = require('path');
const BASE = 'C:\\Users\\bevan\\AppData\\Local\\Temp\\petheaven-prototype';

function read(rel)  { return fs.readFileSync(path.join(BASE, rel), 'utf8'); }
function write(rel, html) { fs.writeFileSync(path.join(BASE, rel), html, 'utf8'); }

const errs = [];
function ok(msg)   { console.log('  ✓ ' + msg); }
function warn(msg) { console.log('  ✗ ' + msg); errs.push(msg); }

// Anchor: the end of the depDev ternary fallback, common to all 12 files
const ANCHOR = "'<span class=\\\"flyout-prop-val-muted\\\">—</span>'}</div></div>`}";

// Projects variant uses _nwF and esc()
const PROJ_RT = "\r\n      ${_nwF ? _nwF.buildFlyoutProp('requestType', p.requestType||'', p.notionId, 'Request Type') : `<div class=\"flyout-prop\"><div class=\"flyout-prop-lbl\">Request Type</div><div class=\"flyout-prop-val\">${esc(p.requestType||'—')}</div></div>`}";

// Roadmap/prioritization variant uses window._nw and fEsc()
const RM_RT = "\r\n      ${window._nw ? window._nw.buildFlyoutProp('requestType', p.requestType||'', p.notionId, 'Request Type') : `<div class=\"flyout-prop\"><div class=\"flyout-prop-lbl\">Request Type</div><div class=\"flyout-prop-val\">${fEsc(p.requestType||'—')}</div></div>`}";

const PROJ_FILES = [
  'projects/index.html',
  'staging/projects/index.html',
  'ucook/projects/index.html',
  'faithful-to-nature/projects/index.html',
];
const RM_PRIO_FILES = [
  'roadmap/index.html',
  'staging/roadmap/index.html',
  'ucook/roadmap/index.html',
  'faithful-to-nature/roadmap/index.html',
  'prioritization/index.html',
  'staging/prioritization/index.html',
  'ucook/prioritization/index.html',
  'faithful-to-nature/prioritization/index.html',
];

function patch(files, insert) {
  for (const rel of files) {
    let f = read(rel);
    if (f.includes("'requestType', p.requestType")) { ok(rel + ' — already patched'); continue; }
    if (!f.includes(ANCHOR)) { warn(rel + ' — anchor not found'); continue; }
    f = f.replace(ANCHOR, ANCHOR + insert);
    write(rel, f);
    ok(rel);
  }
}

console.log('\n── Projects ─────────────────────────────────');
patch(PROJ_FILES, PROJ_RT);

console.log('\n── Roadmap + Prioritization ─────────────────');
patch(RM_PRIO_FILES, RM_RT);

console.log('\n─────────────────────────────────────────────');
if (errs.length) { console.log('Issues:'); errs.forEach(e => console.log('  ✗', e)); }
else { console.log('All done — no issues.'); }
