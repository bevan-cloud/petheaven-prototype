const fs = require('fs');
const path = require('path');
const BASE = 'C:\\Users\\bevan\\AppData\\Local\\Temp\\petheaven-prototype';

function read(rel)  { return fs.readFileSync(path.join(BASE, rel), 'utf8'); }
function write(rel, html) { fs.writeFileSync(path.join(BASE, rel), html, 'utf8'); }

const DEV_SVG = `<svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M4.5 4L2 7l2.5 3M9.5 4L12 7l-2.5 3M8.5 3.5l-3 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const AI_SVG  = `<svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M7 1.5l1.3 3.8L12.5 7l-4.2 1.7L7 12.5l-1.3-3.8L1.5 7l4.2-1.5z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>`;

const issues = [];
function ok(msg)   { console.log(`  ✓ ${msg}`); }
function warn(msg) { console.log(`  ✗ ${msg}`); issues.push(msg); }

function patch(html, oldStr, newStr, label) {
  if (html.includes(oldStr)) return html.replace(oldStr, newStr);
  warn(label + ' — anchor not found');
  return html;
}

// ════════════════════════════════════════════════════════════════════════════
// Flyout row snippet builder
// ════════════════════════════════════════════════════════════════════════════
function ddFlyoutRow(varName) {
  // Builds the JS template-literal expression for the flyout prop cell
  return `\${${varName} ? ${varName}.buildFlyoutProp('depDev', p.depDev===null?'':String(p.depDev), p.notionId, 'Dev Dependent') : \`<div class="flyout-prop"><div class="flyout-prop-lbl">Dev Dependent</div><div>\${p.depDev===true?'<span class=\\"dd-badge dd-dev\\">Dev</span>':p.depDev===false?'<span class=\\"dd-badge dd-ai\\">AI</span>':'<span class=\\"flyout-prop-val-muted\\">—</span>'}</div></div>\`}`;
}

// ════════════════════════════════════════════════════════════════════════════
// 1. Flyout — projects (quadrantHtml, multi-line)
// ════════════════════════════════════════════════════════════════════════════
const PROJ_OLD  = "        <div>${quadrantHtml}</div>\r\n      </div>\r\n    </div>`";
const PROJ_NEW  = "        <div>${quadrantHtml}</div>\r\n      </div>\r\n      " + ddFlyoutRow('_nwF') + "\r\n    </div>`";

// ════════════════════════════════════════════════════════════════════════════
// 2. Flyout — prioritization (qdHtml, single-line with \r\n before </div>)
// ════════════════════════════════════════════════════════════════════════════
const PRIO_OLD  = "</div></div>\r\n    </div>\r\n    ${_brief ? _brief :";
const PRIO_NEW  = "</div></div>\r\n      " + ddFlyoutRow('window._nw') + "\r\n    </div>\r\n    ${_brief ? _brief :";

// ════════════════════════════════════════════════════════════════════════════
// 3. Flyout — roadmap (qdHtml, then engineers div)
// ════════════════════════════════════════════════════════════════════════════
const RM_OLD    = "</div></div>\r\n      <div style=\"grid-column:1/-1\"><div class=\"flyout-prop-lbl\">Engineers</div>";
const RM_NEW    = "</div></div>\r\n      " + ddFlyoutRow('window._nw') + "\r\n      <div style=\"grid-column:1/-1\"><div class=\"flyout-prop-lbl\">Engineers</div>";

// ════════════════════════════════════════════════════════════════════════════
// 4. Prioritization tables — CSS, helper fn, header & row
// ════════════════════════════════════════════════════════════════════════════
const DD_CSS = `
/* ── Dev/AI type badges ─────────────────────────────────────────────── */
.dd-badge{display:inline-flex;align-items:center;gap:4px;font-size:11px;font-weight:600;padding:2px 8px;border-radius:10px;white-space:nowrap}
.dd-dev{background:#e8f5e9;color:#1b5e20;border:1px solid #a8d4aa}
.dd-ai{background:#eef2ff;color:#3730a3;border:1px solid #c7d2fe}
.rice-table th.dd-col,.rice-table td.dd-col{text-align:center;width:64px}
`;

const DEV_TYPE_FN = `function devTypeIcon(v){\r\n  if(v===null||v===undefined||v==='') return '<span style="color:var(--gray-3)">—</span>';\r\n  return v\r\n    ? \`<span class="dd-badge dd-dev">${DEV_SVG}Dev</span>\`\r\n    : \`<span class="dd-badge dd-ai">${AI_SVG}AI</span>\`;\r\n}\r\n`;

// RICE header: add Type col before Effort
const RICE_HDR_OLD = "            <th onclick=\"setSort('e')\">Effort</th>\r\n          </tr>";
const RICE_HDR_NEW = "            <th onclick=\"setSort('e')\">Effort</th>\r\n            <th class=\"dd-col\" title=\"Dev Dependent\">Type</th>\r\n          </tr>";

// RICE row: add Type cell after Effort cell (Effort is last td before </tr>)
const RICE_ROW_OLD = "      <td onclick=\"event.stopPropagation()\">${_nw ? _nw.buildEditSpan('e',it.e,it.notionId) : it.e}</td>\r\n    </tr>`";
const RICE_ROW_NEW = "      <td onclick=\"event.stopPropagation()\">${_nw ? _nw.buildEditSpan('e',it.e,it.notionId) : it.e}</td>\r\n      <td class=\"dd-col\">${devTypeIcon(it.depDev)}</td>\r\n    </tr>`";

// Matrix header: add Type col before RICE
const MAT_HDR_OLD = "            <th onclick=\"setMSort('score')\">RICE</th>";
const MAT_HDR_NEW = "            <th class=\"dd-col\" title=\"Dev Dependent\">Type</th>\r\n            <th onclick=\"setMSort('score')\">RICE</th>";

// Matrix row: add Type cell before RICE score cell
const MAT_ROW_OLD = "      <td><span class=\"score-val\">${sc}</span><div class=\"score-sub\">RICE</div></td>\r\n      <td>${quadrantHtml(q)}</td>\r\n    </tr>`";
const MAT_ROW_NEW = "      <td class=\"dd-col\">${devTypeIcon(it.depDev)}</td>\r\n      <td><span class=\"score-val\">${sc}</span><div class=\"score-sub\">RICE</div></td>\r\n      <td>${quadrantHtml(q)}</td>\r\n    </tr>`";

// ════════════════════════════════════════════════════════════════════════════
// Run patches
// ════════════════════════════════════════════════════════════════════════════
const ALL_FILES = {
  projects: ['projects/index.html','staging/projects/index.html','ucook/projects/index.html','faithful-to-nature/projects/index.html'],
  prio:     ['prioritization/index.html','staging/prioritization/index.html','ucook/prioritization/index.html','faithful-to-nature/prioritization/index.html'],
  roadmap:  ['roadmap/index.html','staging/roadmap/index.html','ucook/roadmap/index.html','faithful-to-nature/roadmap/index.html'],
};

for (const rel of ALL_FILES.projects) {
  let f = read(rel);
  if (f.includes('Dev Dependent')) { ok(`${rel} — already patched`); continue; }
  f = patch(f, PROJ_OLD, PROJ_NEW, rel + ' projects-flyout');
  write(rel, f);
  ok(`${rel} — flyout patched`);
}

for (const rel of ALL_FILES.prio) {
  let f = read(rel);
  if (f.includes('Dev Dependent')) { ok(`${rel} — already patched`); continue; }
  f = patch(f, PRIO_OLD, PRIO_NEW, rel + ' prio-flyout');
  write(rel, f);
  ok(`${rel} — flyout patched`);
}

for (const rel of ALL_FILES.roadmap) {
  let f = read(rel);
  if (f.includes('Dev Dependent')) { ok(`${rel} — already patched`); continue; }
  f = patch(f, RM_OLD, RM_NEW, rel + ' rm-flyout');
  write(rel, f);
  ok(`${rel} — flyout patched`);
}

// Prioritization table columns
for (const rel of ALL_FILES.prio) {
  let f = read(rel);
  let changed = false;

  if (!f.includes('dd-col')) {
    f = f.replace('</style>', DD_CSS + '</style>');
    changed = true;
  }
  if (!f.includes('function devTypeIcon')) {
    f = f.replace('function render(){', DEV_TYPE_FN + 'function render(){');
    changed = true;
  }
  if (f.includes(RICE_HDR_OLD)) { f = f.replace(RICE_HDR_OLD, RICE_HDR_NEW); changed = true; }
  else { warn(rel + ' — RICE hdr anchor'); }
  if (f.includes(RICE_ROW_OLD)) { f = f.replace(RICE_ROW_OLD, RICE_ROW_NEW); changed = true; }
  else { warn(rel + ' — RICE row anchor'); }
  if (f.includes(MAT_HDR_OLD))  { f = f.replace(MAT_HDR_OLD, MAT_HDR_NEW);  changed = true; }
  else { warn(rel + ' — Matrix hdr anchor'); }
  if (f.includes(MAT_ROW_OLD))  { f = f.replace(MAT_ROW_OLD, MAT_ROW_NEW);  changed = true; }
  else { warn(rel + ' — Matrix row anchor'); }

  if (changed) { write(rel, f); ok(`${rel} — table columns patched`); }
}

console.log('\n─────────────────────────────────────');
if (issues.length) { console.log('Issues:'); issues.forEach(i => console.log('  ✗', i)); }
else { console.log('All done — no issues.'); }
