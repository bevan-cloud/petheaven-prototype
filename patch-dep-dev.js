const fs = require('fs');
const path = require('path');
const BASE = 'C:\\Users\\bevan\\AppData\\Local\\Temp\\petheaven-prototype';

function read(rel)  { return fs.readFileSync(path.join(BASE, rel), 'utf8'); }
function write(rel, html) { fs.writeFileSync(path.join(BASE, rel), html, 'utf8'); }

// ─── SVG icon strings (no closing slash — inline HTML) ───────────────────────
const DEV_SVG = `<svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M4.5 4L2 7l2.5 3M9.5 4L12 7l-2.5 3M8.5 3.5l-3 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const AI_SVG  = `<svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M7 1.5l1.3 3.8L12.5 7l-4.2 1.7L7 12.5l-1.3-3.8L1.5 7l4.2-1.5z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>`;

// ─── Badge CSS (injected into notion-write.js and prioritization pages) ──────
const DD_CSS = `
/* ── Dev / AI type badges ── */
.dd-badge{display:inline-flex;align-items:center;gap:4px;font-size:11px;font-weight:600;padding:2px 8px;border-radius:10px;white-space:nowrap}
.dd-dev{background:#e8f5e9;color:#1b5e20;border:1px solid #a8d4aa}
.dd-ai{background:#eef2ff;color:#3730a3;border:1px solid #c7d2fe}
`;

const issues = [];
function ok(msg)   { console.log(`  ✓ ${msg}`); }
function warn(msg) { console.log(`  ✗ ${msg}`); issues.push(msg); }

// ════════════════════════════════════════════════════════════════════════════
// 1. sync-notion.js
// ════════════════════════════════════════════════════════════════════════════
{
  let f = read('sync-notion.js');
  if (!f.includes('depDev')) {
    // Add property read after archive line
    f = f.replace(
      `const archive  = p.Archive?.checkbox ?? false;`,
      `const archive  = p.Archive?.checkbox ?? false;\n  const depDev   = p['Dependent on Dev']?.checkbox ?? null;`
    );
    // Add to return object after archive
    f = f.replace(
      `    archive,\n  };`,
      `    archive,\n    depDev,\n  };`
    );
    write('sync-notion.js', f);
    ok('sync-notion.js — depDev added');
  } else { ok('sync-notion.js — already patched'); }
}

// ════════════════════════════════════════════════════════════════════════════
// 2. staging/notion-write.js
// ════════════════════════════════════════════════════════════════════════════
{
  let f = read('staging/notion-write.js');
  if (!f.includes('depDev')) {
    // 2a. Add CSS for dd-badge inside the existing css template literal
    f = f.replace(
      `/* Lead hint text */`,
      `/* Dev/AI type badge */
    .dd-badge{display:inline-flex;align-items:center;gap:4px;font-size:11px;font-weight:600;padding:2px 8px;border-radius:10px;white-space:nowrap}
    .dd-dev{background:#e8f5e9;color:#1b5e20;border:1px solid #a8d4aa}
    .dd-ai{background:#eef2ff;color:#3730a3;border:1px solid #c7d2fe}

    /* Lead hint text */`
    );

    // 2b. buildProps — add depDev case before 'default'
    f = f.replace(
      `      default: return null;`,
      `      case 'depDev': return { 'Dependent on Dev': { checkbox: value === 'true' } };\n      default: return null;`
    );

    // 2c. displayHtml — add depDev case before the final 'default'
    f = f.replace(
      `      default:\n        return v ? esc(v) : '<span class="nw-text-muted">—</span>';`,
      `      case 'depDev': {
        if(v===''||v===null||v===undefined||v==='null') return \`<span class="nw-text-muted">—</span>\`;
        const yes = v==='true'||v===true;
        return yes
          ? \`<span class="dd-badge dd-dev">${DEV_SVG}Dev</span>\`
          : \`<span class="dd-badge dd-ai">${AI_SVG}AI</span>\`;
      }
      default:\n        return v ? esc(v) : '<span class="nw-text-muted">—</span>';`
    );

    // 2d. optionsFor — add depDev case before the final 'default'
    f = f.replace(
      `      default: return [];`,
      `      case 'depDev': return [\n        { value:'true',  label:'🧑\u200d💻 Yes — Dev Required' },\n        { value:'false', label:'✦ No — AI / No Dev' },\n        { value:'',      label:'— Not Set —' },\n      ];\n      default: return [];`
    );

    write('staging/notion-write.js', f);
    ok('staging/notion-write.js — depDev added');
  } else { ok('staging/notion-write.js — already patched'); }
}

// ════════════════════════════════════════════════════════════════════════════
// 3. Flyout injection helpers
// ════════════════════════════════════════════════════════════════════════════

// The "Dev Dependent" row to inject — using window._nw if available, static fallback otherwise
const DD_FLYOUT_ROW_NW = (varName) =>
  `\${${varName} ? ${varName}.buildFlyoutProp('depDev', p.depDev===null?'':String(p.depDev), p.notionId, 'Dev Dependent') : \`<div class="flyout-prop"><div class="flyout-prop-lbl">Dev Dependent</div><div>\${p.depDev===true?'<span class=\\"dd-badge dd-dev\\">Dev</span>':p.depDev===false?'<span class=\\"dd-badge dd-ai\\">AI</span>':'<span class=\\"flyout-prop-val-muted\\">—</span>'}</div></div>\`}`;

// ─ projects pages  ────────────────────────────────────────────────────────────
// Anchor: the end of the flyout-props grid (after quadrantHtml block)
const PROJ_ANCHOR_OLD =
`      <div class="flyout-prop">
        <div class="flyout-prop-lbl">Matrix Quadrant</div>
        <div>\${quadrantHtml}</div>
      </div>
    </div>\``;

const PROJ_ANCHOR_NEW =
`      <div class="flyout-prop">
        <div class="flyout-prop-lbl">Matrix Quadrant</div>
        <div>\${quadrantHtml}</div>
      </div>
      ${DD_FLYOUT_ROW_NW('_nwF')}
    </div>\``;

// ─ prioritization pages  ──────────────────────────────────────────────────────
const PRIO_ANCHOR_OLD =
`      <div><div class="flyout-prop-lbl">Matrix Quadrant</div><div>\${qdHtml}</div></div>
    </div>`;

const PRIO_ANCHOR_NEW =
`      <div><div class="flyout-prop-lbl">Matrix Quadrant</div><div>\${qdHtml}</div></div>
      ${DD_FLYOUT_ROW_NW('window._nw')}
    </div>`;

// ─ roadmap pages  ─────────────────────────────────────────────────────────────
// The engineers row comes right after Matrix Quadrant — insert between them
const RM_ANCHOR_OLD =
`      <div><div class="flyout-prop-lbl">Matrix Quadrant</div><div>\${qdHtml}</div></div>\n      <div style="grid-column:1/-1">`;

const RM_ANCHOR_NEW =
`      <div><div class="flyout-prop-lbl">Matrix Quadrant</div><div>\${qdHtml}</div></div>\n      ${DD_FLYOUT_ROW_NW('window._nw')}\n      <div style="grid-column:1/-1">`;

// ════════════════════════════════════════════════════════════════════════════
// 4. Patch all 12 page flyouts
// ════════════════════════════════════════════════════════════════════════════
const FLYOUT_FILES = {
  projects: [
    'projects/index.html',
    'staging/projects/index.html',
    'ucook/projects/index.html',
    'faithful-to-nature/projects/index.html',
  ],
  prioritization: [
    'prioritization/index.html',
    'staging/prioritization/index.html',
    'ucook/prioritization/index.html',
    'faithful-to-nature/prioritization/index.html',
  ],
  roadmap: [
    'roadmap/index.html',
    'staging/roadmap/index.html',
    'ucook/roadmap/index.html',
    'faithful-to-nature/roadmap/index.html',
  ],
};

for (const rel of FLYOUT_FILES.projects) {
  let f = read(rel);
  if (f.includes("Dev Dependent")) { ok(`${rel} flyout — already patched`); continue; }
  if (f.includes(PROJ_ANCHOR_OLD)) {
    f = f.replace(PROJ_ANCHOR_OLD, PROJ_ANCHOR_NEW);
    write(rel, f);
    ok(`${rel} flyout (projects)`);
  } else { warn(`${rel} — projects anchor not found`); }
}

for (const rel of FLYOUT_FILES.prioritization) {
  let f = read(rel);
  if (f.includes("Dev Dependent")) { ok(`${rel} flyout — already patched`); continue; }
  if (f.includes(PRIO_ANCHOR_OLD)) {
    f = f.replace(PRIO_ANCHOR_OLD, PRIO_ANCHOR_NEW);
    write(rel, f);
    ok(`${rel} flyout (prioritization)`);
  } else { warn(`${rel} — prioritization anchor not found`); }
}

for (const rel of FLYOUT_FILES.roadmap) {
  let f = read(rel);
  if (f.includes("Dev Dependent")) { ok(`${rel} flyout — already patched`); continue; }
  if (f.includes(RM_ANCHOR_OLD)) {
    f = f.replace(RM_ANCHOR_OLD, RM_ANCHOR_NEW);
    write(rel, f);
    ok(`${rel} flyout (roadmap)`);
  } else { warn(`${rel} — roadmap anchor not found`); }
}

// ════════════════════════════════════════════════════════════════════════════
// 5. Prioritization pages — Type column in RICE + Matrix tables
// ════════════════════════════════════════════════════════════════════════════
const PRIO_CSS = DD_CSS + `
/* Dev/AI type column */
.dd-col{width:70px;text-align:center}
.rice-table th.dd-col,.rice-table td.dd-col{text-align:center}
`;

// devTypeIcon helper function to inject
const DEV_TYPE_FN = `
function devTypeIcon(v){
  if(v===null||v===undefined) return '<span style="color:var(--gray-3)">—</span>';
  return v
    ? \`<span class="dd-badge dd-dev">${DEV_SVG}Dev</span>\`
    : \`<span class="dd-badge dd-ai">${AI_SVG}AI</span>\`;
}`;

// RICE table header — add Type column before Effort
const RICE_HDR_OLD = `            <th onclick="setSort('e')">Effort</th>
          </tr>`;
const RICE_HDR_NEW = `            <th onclick="setSort('e')">Effort</th>
            <th class="dd-col" title="Dev Dependent">Type</th>
          </tr>`;

// RICE row — add Type cell at end of row
const RICE_ROW_OLD = `      <td onclick="event.stopPropagation()">\${_nw ? _nw.buildEditSpan('e',it.e,it.notionId) : it.e}</td>
    </tr>`;
const RICE_ROW_NEW = `      <td onclick="event.stopPropagation()">\${_nw ? _nw.buildEditSpan('e',it.e,it.notionId) : it.e}</td>
      <td class="dd-col">\${devTypeIcon(it.depDev)}</td>
    </tr>`;

// Matrix table header — add Type column before RICE
const MAT_HDR_OLD = `            <th onclick="setMSort('score')">RICE</th>`;
const MAT_HDR_NEW = `            <th class="dd-col" title="Dev Dependent">Type</th>
            <th onclick="setMSort('score')">RICE</th>`;

// Matrix row — add Type cell before RICE score cell
const MAT_ROW_OLD = `      <td><span class="score-val">\${sc}</span><div class="score-sub">RICE</div></td>
      <td>\${quadrantHtml(q)}</td>
    </tr>`;
const MAT_ROW_NEW = `      <td class="dd-col">\${devTypeIcon(it.depDev)}</td>
      <td><span class="score-val">\${sc}</span><div class="score-sub">RICE</div></td>
      <td>\${quadrantHtml(q)}</td>
    </tr>`;

const PRIO_FILES = [
  'prioritization/index.html',
  'staging/prioritization/index.html',
  'ucook/prioritization/index.html',
  'faithful-to-nature/prioritization/index.html',
];

for (const rel of PRIO_FILES) {
  let f = read(rel);
  let changed = false;

  // Add CSS
  if (!f.includes('dd-col')) {
    f = f.replace('</style>', PRIO_CSS + '</style>');
    changed = true;
  }

  // Add devTypeIcon helper — inject before the render() function
  if (!f.includes('function devTypeIcon')) {
    f = f.replace('function render(){', DEV_TYPE_FN + '\nfunction render(){');
    changed = true;
  }

  // RICE table header
  if (f.includes(RICE_HDR_OLD)) {
    f = f.replace(RICE_HDR_OLD, RICE_HDR_NEW);
    changed = true;
  } else { warn(`${rel} — RICE header anchor not found`); }

  // RICE table row
  if (f.includes(RICE_ROW_OLD)) {
    f = f.replace(RICE_ROW_OLD, RICE_ROW_NEW);
    changed = true;
  } else { warn(`${rel} — RICE row anchor not found`); }

  // Matrix table header
  if (f.includes(MAT_HDR_OLD)) {
    f = f.replace(MAT_HDR_OLD, MAT_HDR_NEW);
    changed = true;
  } else { warn(`${rel} — Matrix header anchor not found`); }

  // Matrix table row
  if (f.includes(MAT_ROW_OLD)) {
    f = f.replace(MAT_ROW_OLD, MAT_ROW_NEW);
    changed = true;
  } else { warn(`${rel} — Matrix row anchor not found`); }

  if (changed) { write(rel, f); ok(`${rel} — table columns + helper added`); }
}

// ════════════════════════════════════════════════════════════════════════════
console.log('\n─────────────────────────────────────');
if (issues.length) { console.log('Issues:'); issues.forEach(i => console.log('  ✗', i)); }
else { console.log('All done — no issues.'); }
