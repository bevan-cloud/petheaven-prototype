const fs = require('fs');
const path = require('path');
const BASE = 'C:\\Users\\bevan\\AppData\\Local\\Temp\\petheaven-prototype';

function read(rel)  { return fs.readFileSync(path.join(BASE, rel), 'utf8'); }
function write(rel, html) { fs.writeFileSync(path.join(BASE, rel), html, 'utf8'); }

const errs = [];
function ok(msg)   { console.log('  ✓ ' + msg); }
function warn(msg) { console.log('  ✗ ' + msg); errs.push(msg); }

function patch(f, oldStr, newStr, label) {
  if (f.includes(oldStr)) return f.replace(oldStr, newStr);
  warn(label + ' — anchor not found');
  return f;
}
function patchAll(f, oldStr, newStr, label) {
  if (f.includes(oldStr)) return f.split(oldStr).join(newStr);
  warn(label + ' — anchor not found');
  return f;
}

// ── CSS (injected once per file) ─────────────────────────────────────────────
const KP_CSS = `
/* ── Key Project glow ───────────────────────────────────────────────────── */
.key-project{border-color:#f59e0b!important;box-shadow:0 0 0 1px rgba(245,158,11,.3),0 0 18px rgba(245,158,11,.22),0 2px 8px rgba(0,0,0,.06)!important}
.kp-star{display:inline-flex;align-items:center;gap:2px;font-size:10px;font-weight:700;padding:1px 7px;border-radius:8px;background:#fef3c7;color:#b45309;border:1px solid rgba(245,158,11,.5);margin-left:6px;vertical-align:middle;white-space:nowrap;flex-shrink:0}
tr.key-project td{background:rgba(245,158,11,.05)!important}
tr.key-project td:first-child{box-shadow:inset 3px 0 0 #f59e0b}
`;

// ════════════════════════════════════════════════════════════════════════════
// PROJECTS pages
// ════════════════════════════════════════════════════════════════════════════
// Card class
const PROJ_CARD_OLD = 'return `<div class="project-card" onclick="openFlyout(${idx})">';
const PROJ_CARD_NEW = "return `<div class=\"${p.requestType === '1. Key Project' ? 'project-card key-project' : 'project-card'}\" onclick=\"openFlyout(${idx})\">";

// Badge in card name
const PROJ_NAME_OLD = '<div class="pc-name">${esc(p.name)}</div>';
const PROJ_NAME_NEW = "<div class=\"pc-name\">${esc(p.name)}${p.requestType === '1. Key Project' ? '<span class=\"kp-star\">★ Key Project</span>' : ''}</div>";

// Table row class
const PROJ_TR_OLD = 'return `<tr onclick="openFlyout(${idx})" data-nid="${p.notionId}">';
const PROJ_TR_NEW = "return `<tr onclick=\"openFlyout(${idx})\" data-nid=\"${p.notionId}\"${p.requestType === '1. Key Project' ? ' class=\"key-project\"' : ''}>";

// Badge in table name cell
const PROJ_TDNAME_OLD = '<td><div class="pt-name">${esc(p.name)}</div>';
const PROJ_TDNAME_NEW = "<td><div class=\"pt-name\">${esc(p.name)}${p.requestType === '1. Key Project' ? '<span class=\"kp-star\">★ Key</span>' : ''}</div>";

// ════════════════════════════════════════════════════════════════════════════
// ROADMAP pages
// ════════════════════════════════════════════════════════════════════════════
const RM_CARD_OLD = '`<div class="rm-card" data-id="${it.id}" draggable="true" style="border-left-color:${c.bar}">';
const RM_CARD_NEW = "`<div class=\"${it.requestType === '1. Key Project' ? 'rm-card key-project' : 'rm-card'}\" data-id=\"${it.id}\" draggable=\"true\" style=\"border-left-color:${c.bar}\">";

// Badge in roadmap card name
const RM_NAME_OLD = '<div class="rm-card-name">${esc(it.name)}</div>';
const RM_NAME_NEW = "<div class=\"rm-card-name\">${esc(it.name)}${it.requestType === '1. Key Project' ? '<span class=\"kp-star\">★ Key</span>' : ''}</div>";

// ════════════════════════════════════════════════════════════════════════════
// PRIORITIZATION pages
// ════════════════════════════════════════════════════════════════════════════
// RICE + Matrix both use same <tr> anchor — patchAll replaces both
const PRIO_TR_OLD = 'return `<tr onclick="openFlyout(${it.id})" style="cursor:pointer">';
const PRIO_TR_NEW = "return `<tr onclick=\"openFlyout(${it.id})\" style=\"cursor:pointer\"${it.requestType === '1. Key Project' ? ' class=\"key-project\"' : ''}>";

// Badge in name cell (same in both RICE and Matrix tables)
const PRIO_TDNAME_OLD = '<td><div class="item-name">${it.name}</div></td>';
const PRIO_TDNAME_NEW = "<td><div class=\"item-name\">${it.name}${it.requestType === '1. Key Project' ? '<span class=\"kp-star\">★ Key</span>' : ''}</div></td>";

// ════════════════════════════════════════════════════════════════════════════
// FILE LISTS
// ════════════════════════════════════════════════════════════════════════════
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

// ════════════════════════════════════════════════════════════════════════════
// APPLY
// ════════════════════════════════════════════════════════════════════════════
console.log('\n── Projects ─────────────────────────────────');
for (const rel of PROJ_FILES) {
  let f = read(rel);
  if (f.includes('key-project')) { ok(rel + ' — already patched'); continue; }
  f = f.replace('</style>', KP_CSS + '</style>');
  f = patch(f, PROJ_CARD_OLD, PROJ_CARD_NEW, rel + ' card class');
  f = patch(f, PROJ_NAME_OLD, PROJ_NAME_NEW, rel + ' card badge');
  f = patch(f, PROJ_TR_OLD,   PROJ_TR_NEW,   rel + ' tr class');
  f = patch(f, PROJ_TDNAME_OLD, PROJ_TDNAME_NEW, rel + ' td badge');
  write(rel, f);
  ok(rel);
}

console.log('\n── Roadmap ──────────────────────────────────');
for (const rel of RM_FILES) {
  let f = read(rel);
  if (f.includes('key-project')) { ok(rel + ' — already patched'); continue; }
  f = f.replace('</style>', KP_CSS + '</style>');
  f = patch(f, RM_CARD_OLD, RM_CARD_NEW, rel + ' card class');
  f = patch(f, RM_NAME_OLD, RM_NAME_NEW, rel + ' card badge');
  write(rel, f);
  ok(rel);
}

console.log('\n── Prioritization ───────────────────────────');
for (const rel of PRIO_FILES) {
  let f = read(rel);
  if (f.includes('key-project')) { ok(rel + ' — already patched'); continue; }
  f = f.replace('</style>', KP_CSS + '</style>');
  f = patchAll(f, PRIO_TR_OLD, PRIO_TR_NEW, rel + ' tr class');
  f = patchAll(f, PRIO_TDNAME_OLD, PRIO_TDNAME_NEW, rel + ' td badge');
  write(rel, f);
  ok(rel);
}

console.log('\n─────────────────────────────────────────────');
if (errs.length) { console.log('Issues:'); errs.forEach(e => console.log('  ✗', e)); }
else { console.log('All done — no issues.'); }
