const fs = require('fs');
const path = require('path');
const BASE = 'C:\\Users\\bevan\\AppData\\Local\\Temp\\petheaven-prototype';

function read(rel)  { return fs.readFileSync(path.join(BASE, rel), 'utf8'); }
function write(rel, html) { fs.writeFileSync(path.join(BASE, rel), html, 'utf8'); }

const issues = [];
function ok(msg)   { console.log(`  ✓ ${msg}`); }
function warn(msg) { console.log(`  ✗ ${msg}`); issues.push(msg); }

function patch(f, oldStr, newStr, label) {
  if (f.includes(oldStr)) return f.replace(oldStr, newStr);
  warn(label + ' — anchor not found');
  return f;
}

// ── 1. HTML: add epic select after assignee select ────────────────────────────
const HTML_OLD = `<option value="">All assignees</option>\r\n    </select>\r\n    <button class="ctrl-reset" id="resetBtn"`;
const HTML_NEW = `<option value="">All assignees</option>\r\n    </select>\r\n    <select class="ctrl-select" id="epicFilter" onchange="applyFilters()" aria-label="Filter by epic">\r\n      <option value="">All epics</option>\r\n    </select>\r\n    <button class="ctrl-reset" id="resetBtn"`;

// ── 2. applyFilters: add epic var after assignee var ──────────────────────────
const AF_VAR_OLD = `var assignee = (document.getElementById('assigneeFilter').value || '');\r\n\r\n  function matchIssue`;
const AF_VAR_NEW = `var assignee = (document.getElementById('assigneeFilter').value || '');\r\n  var epic    = (document.getElementById('epicFilter') ? document.getElementById('epicFilter').value || '' : '');\r\n\r\n  function matchIssue`;

// ── 3. applyFilters: add epic check after assignee check ──────────────────────
const AF_CHK_OLD = `if (assignee) {\r\n      var name = (issue.assignee && issue.assignee.displayName) || '';\r\n      if (name !== assignee) return false;\r\n    }\r\n    return true;`;
const AF_CHK_NEW = `if (assignee) {\r\n      var name = (issue.assignee && issue.assignee.displayName) || '';\r\n      if (name !== assignee) return false;\r\n    }\r\n    if (epic) {\r\n      var ep = (issue.parent && issue.parent.issuetype === 'Epic') ? issue.parent.summary : '';\r\n      if (ep !== epic) return false;\r\n    }\r\n    return true;`;

// ── 4. count badge: include epic in active check ──────────────────────────────
const CB_OLD = `if (search || assignee) {`;
const CB_NEW = `if (search || assignee || epic) {`;

// ── 5. resetFilters: also reset epic ─────────────────────────────────────────
const RF_OLD = `document.getElementById('assigneeFilter').value = '';\r\n  applyFilters();`;
const RF_NEW = `document.getElementById('assigneeFilter').value = '';\r\n  var epF = document.getElementById('epicFilter'); if (epF) epF.value = '';\r\n  applyFilters();`;

// ── 6. populateEpicFilter function (inject after populateAssigneeFilter) ───────
const POP_EPIC_FN = `\r\nfunction populateEpicFilter() {\r\n  var sel = document.getElementById('epicFilter');\r\n  if (!sel) return;\r\n  var seen = {};\r\n  var epics = [];\r\n  (_allActive.concat(_allNext)).forEach(function(i) {\r\n    if (i.parent && i.parent.issuetype === 'Epic' && i.parent.summary) {\r\n      var s = i.parent.summary;\r\n      if (!seen[s]) { seen[s] = true; epics.push(s); }\r\n    }\r\n  });\r\n  epics.sort();\r\n  while (sel.options.length > 1) sel.remove(1);\r\n  epics.forEach(function(s) {\r\n    var opt = document.createElement('option');\r\n    opt.value = s;\r\n    opt.textContent = s;\r\n    sel.appendChild(opt);\r\n  });\r\n}\r\n`;

const POP_ANCHOR = `function applyFi`; // sits right after populateAssigneeFilter

// ── 7. call populateEpicFilter() alongside populateAssigneeFilter() ───────────
const CALL_OLD = `populateAssigneeFilter();\r\n  applyFilters();`;
const CALL_NEW = `populateAssigneeFilter();\r\n  populateEpicFilter();\r\n  applyFilters();`;

// ────────────────────────────────────────────────────────────────────────────
const FILES = [
  'sprint-board/index.html',
  'staging/sprint-board/index.html',
  'ucook/sprint-board/index.html',
  'faithful-to-nature/sprint-board/index.html',
];

for (const rel of FILES) {
  if (rel.includes('already')) continue;
  let f = read(rel);

  if (f.includes('id="epicFilter"')) { ok(`${rel} — already patched`); continue; }

  f = patch(f, HTML_OLD,      HTML_NEW,      rel + ' HTML select');
  f = patch(f, AF_VAR_OLD,    AF_VAR_NEW,    rel + ' applyFilters var');
  f = patch(f, AF_CHK_OLD,    AF_CHK_NEW,    rel + ' applyFilters check');
  f = patch(f, CB_OLD,        CB_NEW,        rel + ' count badge');
  f = patch(f, RF_OLD,        RF_NEW,        rel + ' resetFilters');
  f = f.replace(POP_ANCHOR, POP_EPIC_FN + POP_ANCHOR);
  f = patch(f, CALL_OLD,      CALL_NEW,      rel + ' populate call');

  write(rel, f);
  ok(`${rel} — patched`);
}

console.log('\n─────────────────────────────────────');
if (issues.length) { console.log('Issues:'); issues.forEach(i => console.log('  ✗', i)); }
else { console.log('All done — no issues.'); }
