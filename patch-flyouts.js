#!/usr/bin/env node
// patch-flyouts.js — adds the shared flyout to prioritization + roadmap pages

const fs = require('fs');

// ─── Shared blocks ────────────────────────────────────────────────────────────

const FLYOUT_CSS = `
/* ── Flyout overlay ── */
.overlay{position:fixed;inset:0;background:rgba(0,0,0,.35);z-index:300;opacity:0;pointer-events:none;transition:opacity .2s}
.overlay.open{opacity:1;pointer-events:all}
/* ── Flyout panel ── */
.flyout{position:fixed;top:0;right:0;bottom:0;width:480px;background:#fff;z-index:400;box-shadow:-8px 0 40px rgba(0,0,0,.14);transform:translateX(100%);transition:transform .25s cubic-bezier(.4,0,.2,1);display:flex;flex-direction:column;overflow:hidden}
.flyout.open{transform:translateX(0)}
.flyout-close-row{display:flex;justify-content:flex-end;padding:16px 20px 0;flex-shrink:0}
.flyout-close{width:32px;height:32px;border-radius:var(--radius);border:1px solid var(--gray-2);background:#fff;cursor:pointer;font-size:18px;color:var(--gray-4);display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:background .15s}
.flyout-close:hover{background:var(--gray-1)}
.flyout-body{overflow-y:auto;padding:4px 24px 40px;flex:1}
.flyout-tags{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px}
.flyout-tag{font-size:11px;font-weight:500;padding:3px 10px;border-radius:20px;border:1px solid var(--gray-2);color:var(--gray-5);background:var(--gray-1)}
.flyout-title{font-family:'DM Serif Display',serif;font-size:26px;line-height:1.2;color:var(--black);margin-bottom:8px}
.flyout-subtitle{font-size:14px;color:var(--gray-4);line-height:1.6;margin-bottom:0}
.flyout-props{margin-top:20px;padding-top:20px;border-top:1px solid var(--gray-2);display:grid;grid-template-columns:1fr 1fr;gap:16px 12px}
.flyout-prop-lbl{font-size:10px;font-weight:600;letter-spacing:.07em;text-transform:uppercase;color:var(--gray-4);margin-bottom:5px}
.flyout-prop-val{font-size:13px;color:var(--black);font-weight:500;line-height:1.4}
.flyout-prop-val-muted{font-size:13px;color:var(--gray-3);font-style:italic}
.f-quadrant{display:inline-flex;align-items:center;gap:5px;font-size:12px;font-weight:600;padding:3px 10px;border-radius:20px}
.flyout-section{margin-top:20px;padding-top:20px;border-top:1px solid var(--gray-2)}
.flyout-section-hdr{display:flex;align-items:center;gap:10px;margin-bottom:12px}
.flyout-section-title{font-size:10px;font-weight:700;letter-spacing:.09em;text-transform:uppercase;color:var(--gray-4)}
.flyout-desc{font-size:13px;color:var(--gray-5);line-height:1.75}
.flyout-desc-empty{font-size:13px;color:var(--gray-3);font-style:italic}
.f-rice-row{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:12px}
.f-rice-cell{background:var(--gray-1);border:1px solid var(--gray-2);border-radius:var(--radius);padding:12px 8px;text-align:center}
.f-rice-val{font-size:20px;font-weight:700}
.f-rice-r{color:#4527a0}.f-rice-i{color:#1b5e20}.f-rice-c{color:#b84714}.f-rice-e{color:#1a5fa8}
.f-rice-lbl{font-size:10px;color:var(--gray-4);text-transform:uppercase;letter-spacing:.05em;margin-top:3px}
.f-rice-total{background:linear-gradient(135deg,var(--brand-dark),var(--brand));border-radius:var(--radius);padding:12px 16px;display:flex;align-items:center;justify-content:space-between;color:#fff}
.f-rice-score{font-size:24px;font-weight:700}
.f-rice-score-lbl{font-size:11px;opacity:.75;text-transform:uppercase;letter-spacing:.06em}
.flyout-notion-link{display:flex;align-items:center;gap:8px;margin-top:20px;padding:12px 16px;background:var(--brand-light);border:1px solid var(--brand-mid);border-radius:var(--radius-lg);text-decoration:none;color:var(--brand-dark);font-size:13px;font-weight:600;transition:background .15s}
.flyout-notion-link:hover{background:var(--brand-mid)}
.fs-live{background:#e8f5e9;color:#1b5e20;font-size:11px;font-weight:600;padding:3px 10px;border-radius:20px;display:inline-block}
.fs-progress{background:#fff8e1;color:#7a5a00;font-size:11px;font-weight:600;padding:3px 10px;border-radius:20px;display:inline-block}
.fs-planned{background:var(--brand-light);color:var(--brand-dark);font-size:11px;font-weight:600;padding:3px 10px;border-radius:20px;display:inline-block}
.fs-review{background:#f3e5f5;color:#6a1b9a;font-size:11px;font-weight:600;padding:3px 10px;border-radius:20px;display:inline-block}
.fs-done{background:var(--gray-2);color:var(--gray-5);font-size:11px;font-weight:600;padding:3px 10px;border-radius:20px;display:inline-block}
@media(max-width:760px){
  .flyout{width:100%;border-radius:var(--radius-xl) var(--radius-xl) 0 0;top:auto;height:92vh;transform:translateY(100%)}
  .flyout.open{transform:translateY(0)}
}`;

const FLYOUT_HTML = `
<div class="overlay" id="overlay" onclick="closeFlyout()"></div>
<div class="flyout" id="flyout">
  <div class="flyout-close-row">
    <button class="flyout-close" onclick="closeFlyout()">×</button>
  </div>
  <div class="flyout-body" id="flyoutBody"></div>
</div>`;

const FLYOUT_JS = `
// ─── Shared flyout ────────────────────────────────────────────────────────────
const F_STATUS = {
  live:    {cls:'fs-live',    label:'Live'},
  progress:{cls:'fs-progress',label:'In Progress'},
  planned: {cls:'fs-planned', label:'Planned'},
  review:  {cls:'fs-review',  label:'In Review'},
  done:    {cls:'fs-done',    label:'Done'},
};
const F_ACCENT = {
  'Top Line Growth':'#2e7d32','Margin Improvements':'#c62828',
  'Cost Control & Cash Flow':'#4527a0','People':'#b71c1c',
  'Internal Working Improvement':'#1a5fa8','UX/UI':'#3730a3',
};
function fEsc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
function fRice(it){return(it.r&&it.i&&it.c&&it.e)?Math.round(it.r*it.i*(it.c/100)/it.e):0;}
function fStatus(s){const m=F_STATUS[s]||F_STATUS.planned;return\`<span class="\${m.cls}">\${m.label}</span>\`;}
function fTheme(t){const c=THEME_COLORS[t]||{bg:'#f5f5f5',border:'#ddd',text:'#555'};return\`<span style="display:inline-block;font-size:11px;font-weight:500;padding:2px 8px;border-radius:10px;background:\${c.bg};border:1px solid \${c.border};color:\${c.text}">\${t||'—'}</span>\`;}
function fQuadrant(mi,me){
  if(!mi||!me) return null;
  const hi=mi>=3,he=me>=3;
  if(hi&&!he) return {label:'Quick Win',color:'#1b5e20',bg:'#e8f5e9',border:'#a8d4aa'};
  if(hi&&he)  return {label:'Big Bet',  color:'#b84714',bg:'#fdf1ec',border:'#f0b89a'};
  if(!hi&&!he)return {label:'Fill In',  color:'#1a5fa8',bg:'#e8f1fc',border:'#90bef5'};
  return              {label:'Time Sink',color:'#7a5a00',bg:'#fff8e1',border:'#f5d48b'};
}
function openFlyout(itemId){
  const p=ITEMS.find(it=>it.id===itemId);
  if(!p) return;
  const qd=fQuadrant(p.mi,p.me);
  const hasRice=p.r||p.i||p.c||p.e>1;
  const rice=fRice(p);
  const accent=F_ACCENT[p.theme]||'#4f46e5';
  const sm=F_STATUS[p.status]||F_STATUS.planned;
  const tagHtml=(p.company||[]).map(c=>\`<span class="flyout-tag">\${fEsc(c)}</span>\`).join('');
  const qdHtml=qd
    ?\`<span class="f-quadrant" style="background:\${qd.bg};border:1px solid \${qd.border};color:\${qd.color}">\${qd.label}</span>\`
    :\`<span class="flyout-prop-val-muted">No matrix data</span>\`;
  document.getElementById('flyoutBody').innerHTML=\`
    <div style="height:4px;border-radius:2px;background:\${accent};margin-bottom:20px"></div>
    \${tagHtml?\`<div class="flyout-tags">\${tagHtml}</div>\`:''}
    <div class="flyout-title">\${fEsc(p.name)}</div>
    \${p.desc?\`<p class="flyout-subtitle">\${fEsc(p.desc)}</p>\`:''}
    <div class="flyout-props">
      <div><div class="flyout-prop-lbl">Status</div><div>\${fStatus(p.status)}</div></div>
      <div><div class="flyout-prop-lbl">Pillar</div><div>\${fTheme(p.theme)}</div></div>
      <div><div class="flyout-prop-lbl">Quarter</div><div class="flyout-prop-val">\${fEsc(p.qLabel||'—')}</div></div>
      <div><div class="flyout-prop-lbl">Priority</div><div class="flyout-prop-val">\${fEsc(p.priority||'—')}</div></div>
      <div><div class="flyout-prop-lbl">Project Lead</div><div class="flyout-prop-val">\${p.lead?fEsc(p.lead):'<span class=\\"flyout-prop-val-muted\\">—</span>'}</div></div>
      <div><div class="flyout-prop-lbl">Matrix Quadrant</div><div>\${qdHtml}</div></div>
    </div>
    <div class="flyout-section">
      <div class="flyout-section-hdr">
        <span class="flyout-section-title">Project Brief</span>
        <span class="\${sm.cls}" style="font-size:11px">\${sm.label}</span>
      </div>
      \${p.desc?\`<p class="flyout-desc">\${fEsc(p.desc)}</p>\`:'<p class="flyout-desc-empty">No description added in Notion yet.</p>'}
    </div>
    <div class="flyout-section">
      <div class="flyout-section-hdr"><span class="flyout-section-title">RICE Score Breakdown</span></div>
      \${hasRice?\`
        <div class="f-rice-row">
          <div class="f-rice-cell"><div class="f-rice-val f-rice-r">\${p.r||0}</div><div class="f-rice-lbl">R</div></div>
          <div class="f-rice-cell"><div class="f-rice-val f-rice-i">\${p.i||0}</div><div class="f-rice-lbl">I</div></div>
          <div class="f-rice-cell"><div class="f-rice-val f-rice-c">\${p.c||0}</div><div class="f-rice-lbl">C</div></div>
          <div class="f-rice-cell"><div class="f-rice-val f-rice-e">\${p.e||1}</div><div class="f-rice-lbl">E</div></div>
        </div>
        <div class="f-rice-total">
          <div><div class="f-rice-score-lbl">RICE Score</div><div class="f-rice-score">\${rice.toLocaleString()}</div></div>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="13" stroke="rgba(255,255,255,.3)" stroke-width="1.5"/><path d="M8 14l4 4 8-8" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>\
    </div>
    \${p.notionUrl?\`
    <a class="flyout-notion-link" href="\${p.notionUrl}" target="_blank" rel="noopener">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" stroke-width="1.4"/><path d="M5 8h6M5 5.5h6M5 10.5h4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
      Open in Notion
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style="margin-left:auto"><path d="M2.5 9.5l7-7M9.5 9.5V2.5H2.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </a>\`:''}
  \`;
  document.getElementById('overlay').classList.add('open');
  document.getElementById('flyout').classList.add('open');
  document.body.style.overflow='hidden';
}
function closeFlyout(){
  document.getElementById('overlay').classList.remove('open');
  document.getElementById('flyout').classList.remove('open');
  document.body.style.overflow='';
}
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeFlyout();});`;

// ─── Patch prioritization/index.html ─────────────────────────────────────────
{
  let c = fs.readFileSync('staging/prioritization/index.html', 'utf8');

  // 1. Inject CSS before </style>
  c = c.replace('</style>', FLYOUT_CSS + '\n</style>');

  // 2. Make RICE table rows clickable
  c = c.replace(
    'return `<tr>\n      <td><div class="rank-badge">${idx+1}</div></td>',
    'return `<tr onclick="openFlyout(${it.id})" style="cursor:pointer">\n      <td><div class="rank-badge">${idx+1}</div></td>'
  );

  // 3. Make matrix table rows clickable + stop propagation on edit cells
  c = c.replace(
    'return `<tr>\n      <td><div class="item-name">${it.name}</div></td>',
    'return `<tr onclick="openFlyout(${it.id})" style="cursor:pointer">\n      <td><div class="item-name">${it.name}</div></td>'
  );
  c = c.replace(
    /onclick="startEditMatrix\(event\)"/g,
    'onclick="event.stopPropagation();startEditMatrix(event)"'
  );

  // 4. Make matrix bubbles clickable
  c = c.replace(
    "b.title=`${item.name}\\nImpact: ${item.mi} | Effort: ${item.me}\\nRICE: ${item.score}`;",
    "b.title=`${item.name}\\nImpact: ${item.mi} | Effort: ${item.me}\\nRICE: ${item.score}`;\n    b.onclick=()=>openFlyout(item.id);\n    b.style.cursor='pointer';"
  );

  // 5. Inject flyout HTML + JS before </body>
  c = c.replace('</body>', FLYOUT_HTML + '\n<script>' + FLYOUT_JS + '\n</script>\n</body>');

  fs.writeFileSync('staging/prioritization/index.html', c, 'utf8');
  console.log('Patched: staging/prioritization/index.html');
}

// ─── Patch roadmap/index.html ─────────────────────────────────────────────────
{
  let c = fs.readFileSync('staging/roadmap/index.html', 'utf8');

  // 1. Inject CSS before </style>
  c = c.replace('</style>', FLYOUT_CSS + '\n</style>');

  // 2. Make roadmap cards clickable
  c = c.replace(
    'return `<div class="rm-card" style="background:${c.bg};border-color:${c.border}">',
    'return `<div class="rm-card" style="background:${c.bg};border-color:${c.border};cursor:pointer" onclick="openFlyout(${it.id})">'
  );

  // 3. Inject flyout HTML + JS before </body>
  c = c.replace('</body>', FLYOUT_HTML + '\n<script>' + FLYOUT_JS + '\n</script>\n</body>');

  fs.writeFileSync('staging/roadmap/index.html', c, 'utf8');
  console.log('Patched: staging/roadmap/index.html');
}

console.log('Done.');
