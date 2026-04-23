const fs = require('fs');
const path = require('path');
const BASE = 'C:\\Users\\bevan\\AppData\\Local\\Temp\\petheaven-prototype';

function read(rel)  { return fs.readFileSync(path.join(BASE, rel), 'utf8'); }
function write(rel, html) { fs.writeFileSync(path.join(BASE, rel), html, 'utf8'); }

const issues = [];
function ok(msg)   { console.log(`  ✓ ${msg}`); }
function warn(msg) { console.log(`  ✗ ${msg}`); issues.push(msg); }

// ── CSS to inject before </style> ────────────────────────────────────────────
const EPIC_CSS = `
/* ── Epic badge on card top ─────────────────────────────────────────────── */
.issue-card-top{flex-wrap:nowrap}
.epic-badge{margin-left:auto;font-size:10px;font-weight:600;padding:2px 7px;border-radius:10px;background:rgba(0,0,0,.06);color:var(--gray-5);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:120px;flex-shrink:0;line-height:1.5}
`;

// ── epicBadgeHtml helper function ─────────────────────────────────────────────
const EPIC_FN = `function epicBadgeHtml(issue) {\r\n  if (!issue.parent || issue.parent.issuetype !== 'Epic') return '';\r\n  return '<span class=\"epic-badge\" title=\"' + escHtml(issue.parent.summary) + '\">' + escHtml(issue.parent.summary) + '</span>';\r\n}\r\n`;

// ── renderCard anchor — after issue-key link, before closing </div> ───────────
const CARD_OLD = `  + '<a class="issue-key" href="' + jiraUrl + '" target="_blank" rel="noopener" onclick="event.stopPropagation()">' + escHtml(issue.key) + '</a>'\r\n    + '</div>'`;
const CARD_NEW = `  + '<a class="issue-key" href="' + jiraUrl + '" target="_blank" rel="noopener" onclick="event.stopPropagation()">' + escHtml(issue.key) + '</a>'\r\n    + epicBadgeHtml(issue)\r\n    + '</div>'`;

const FILES = [
  'sprint-board/index.html',
  'staging/sprint-board/index.html',
  'ucook/sprint-board/index.html',
  'faithful-to-nature/sprint-board/index.html',
];

for (const rel of FILES) {
  let f = read(rel);
  let changed = false;

  // 1. CSS
  if (!f.includes('epic-badge')) {
    f = f.replace('</style>', EPIC_CSS + '</style>');
    changed = true;
  }

  // 2. Helper function — insert before renderCard
  if (!f.includes('epicBadgeHtml')) {
    if (f.includes('function renderCard(')) {
      f = f.replace('function renderCard(', EPIC_FN + 'function renderCard(');
      changed = true;
      ok(`${rel} — helper fn injected`);
    } else {
      warn(`${rel} — renderCard anchor not found`);
    }
  } else {
    ok(`${rel} — helper fn already present`);
  }

  // 3. renderCard injection
  if (!f.includes('+ epicBadgeHtml(issue)')) {
    if (f.includes(CARD_OLD)) {
      f = f.replace(CARD_OLD, CARD_NEW);
      changed = true;
      ok(`${rel} — card render patched`);
    } else {
      warn(`${rel} — card render anchor not found`);
    }
  } else {
    ok(`${rel} — card render call already present`);
  }

  if (changed) write(rel, f);
}

console.log('\n─────────────────────────────────────');
if (issues.length) { console.log('Issues:'); issues.forEach(i => console.log('  ✗', i)); }
else { console.log('All done — no issues.'); }
