const fs = require('fs');
const path = require('path');
const BASE = 'C:\\Users\\bevan\\AppData\\Local\\Temp\\petheaven-prototype';
function read(rel)  { return fs.readFileSync(path.join(BASE, rel), 'utf8'); }
function write(rel, html) { fs.writeFileSync(path.join(BASE, rel), html, 'utf8'); }

const DEV_SVG = `<svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M4.5 4L2 7l2.5 3M9.5 4L12 7l-2.5 3M8.5 3.5l-3 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const AI_SVG  = `<svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M7 1.5l1.3 3.8L12.5 7l-4.2 1.7L7 12.5l-1.3-3.8L1.5 7l4.2-1.5z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>`;

// The depDev flyout row (uses window._nw if available, static fallback otherwise)
const DD_ROW = `\${window._nw ? window._nw.buildFlyoutProp('depDev', p.depDev===null?'':String(p.depDev), p.notionId, 'Dev Dependent') : \`<div class="flyout-prop"><div class="flyout-prop-lbl">Dev Dependent</div><div>\${p.depDev===true?'<span class=\\"dd-badge dd-dev\\">${DEV_SVG}Dev</span>':p.depDev===false?'<span class=\\"dd-badge dd-ai\\">${AI_SVG}AI</span>':'<span class=\\"flyout-prop-val-muted\\">—</span>'}</div></div>\`}`;

// 1. Duplicate matrix header to remove
const DUP_HDR_OLD = `<th class="dd-col" title="Dev Dependent">Type</th>\r\n            <th class="dd-col" title="Dev Dependent">Type</th>`;
const DUP_HDR_NEW = `<th class="dd-col" title="Dev Dependent">Type</th>`;

// 2. Flyout injection — after Matrix Quadrant closing tag, before </div> that closes flyout-props
const FLY_OLD = `<div class="flyout-prop-lbl">Matrix Quadrant</div><div>\${qdHtml}</div></div>\r\n    </div>`;
const FLY_NEW = `<div class="flyout-prop-lbl">Matrix Quadrant</div><div>\${qdHtml}</div></div>\r\n      ${DD_ROW}\r\n    </div>`;

const PRIO_FILES = [
  'prioritization/index.html',
  'staging/prioritization/index.html',
  'ucook/prioritization/index.html',
  'faithful-to-nature/prioritization/index.html',
];

for (const rel of PRIO_FILES) {
  let f = read(rel);
  let changed = false;

  // Fix 1: remove duplicate matrix type header
  if (f.includes(DUP_HDR_OLD)) {
    f = f.replace(DUP_HDR_OLD, DUP_HDR_NEW);
    changed = true;
    console.log(`  [dedup hdr]  ${rel}`);
  }

  // Fix 2: add flyout row (only if not already present in flyout context)
  // Check specifically in the flyout area, not the table header
  if (!f.includes("buildFlyoutProp('depDev'")) {
    if (f.includes(FLY_OLD)) {
      f = f.replace(FLY_OLD, FLY_NEW);
      changed = true;
      console.log(`  [flyout row] ${rel}`);
    } else {
      console.log(`  WARN: flyout anchor not found in ${rel}`);
    }
  } else {
    console.log(`  [flyout row already present] ${rel}`);
  }

  if (changed) {
    write(rel, f);
    console.log(`✓ ${rel}`);
  }
}

console.log('\nDone.');
