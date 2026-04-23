const fs = require('fs');
const path = require('path');

const BASE = 'C:\\Users\\bevan\\AppData\\Local\\Temp\\petheaven-prototype';
const FORM_URL = 'https://silvertree.notion.site/ebd//1b56bd1cdd3480e49398c9ded6684010';

const CSS = `
/* ── Add Project Request Modal ───────────────────────────────────────────── */
.add-req-btn{display:inline-flex;align-items:center;gap:8px;background:var(--brand);color:#fff;border:none;border-radius:8px;padding:9px 18px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:background .15s;white-space:nowrap;margin-top:16px;flex-shrink:0}
.add-req-btn:hover{background:var(--brand-dark)}
.add-req-btn svg{flex-shrink:0}
.pf-overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:2000;display:none;align-items:center;justify-content:center}
.pf-overlay.open{display:flex}
.pf-modal{background:#fff;border-radius:12px;width:820px;max-width:calc(100vw - 40px);height:86vh;max-height:820px;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 24px 64px rgba(0,0,0,.3)}
.pf-modal-hdr{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid var(--gray-2);flex-shrink:0}
.pf-modal-title{font-size:15px;font-weight:700;color:var(--black);display:flex;align-items:center;gap:10px}
.pf-modal-icon{width:28px;height:28px;border-radius:6px;background:var(--brand-light);display:flex;align-items:center;justify-content:center;flex-shrink:0}
.pf-modal-actions{display:flex;align-items:center;gap:8px}
.pf-open-notion{display:inline-flex;align-items:center;gap:5px;font-size:12px;font-weight:500;color:var(--gray-5);text-decoration:none;padding:5px 10px;border:1px solid var(--gray-2);border-radius:6px;background:var(--gray-1);transition:background .15s;white-space:nowrap}
.pf-open-notion:hover{background:var(--gray-2);color:var(--black)}
.pf-modal-close{width:32px;height:32px;border:none;background:var(--gray-1);border-radius:6px;cursor:pointer;font-size:20px;color:var(--gray-5);display:flex;align-items:center;justify-content:center;transition:background .15s;line-height:1;padding:0}
.pf-modal-close:hover{background:var(--gray-2)}
.pf-modal-body{flex:1;overflow:hidden;position:relative}
.pf-frame{width:100%;height:100%;border:none;display:block}
.pf-loading{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;color:var(--gray-4);font-size:13px;background:#fff;pointer-events:none;transition:opacity .3s}
.pf-loading.hidden{opacity:0}
.pf-spinner{width:32px;height:32px;border:3px solid var(--gray-2);border-top-color:var(--brand);border-radius:50%;animation:pfspin .7s linear infinite}
@keyframes pfspin{to{transform:rotate(360deg)}}
`;

const MODAL_HTML = `
<!-- Add Project Request Modal -->
<div class="pf-overlay" id="pfOverlay" onclick="pfClickOutside(event)">
  <div class="pf-modal">
    <div class="pf-modal-hdr">
      <div class="pf-modal-title">
        <div class="pf-modal-icon">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2v10M2 7h10" stroke="#57AB4E" stroke-width="2.2" stroke-linecap="round"/></svg>
        </div>
        Add Project Request
      </div>
      <div class="pf-modal-actions">
        <a class="pf-open-notion" href="${FORM_URL}" target="_blank" rel="noopener">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M5 2H2a1 1 0 00-1 1v7a1 1 0 001 1h7a1 1 0 001-1V7M7.5 1H11v3.5M11 1L5.5 6.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>
          Open in Notion
        </a>
        <button class="pf-modal-close" onclick="closePF()" title="Close">&#215;</button>
      </div>
    </div>
    <div class="pf-modal-body">
      <div class="pf-loading" id="pfLoading">
        <div class="pf-spinner"></div>
        <span>Loading form&#8230;</span>
      </div>
      <iframe class="pf-frame" id="pfFrame" src="" title="Add Project Request" onload="pfFrameLoaded()"></iframe>
    </div>
  </div>
</div>`;

const JS = `
// ── Project Request Form ──────────────────────────────────────────────────────
const _PF_URL='${FORM_URL}';
function openPF(){
  const ov=document.getElementById('pfOverlay');
  const fr=document.getElementById('pfFrame');
  const ld=document.getElementById('pfLoading');
  if(!fr.src||fr.src===location.href){fr.src=_PF_URL;}
  if(ld)ld.classList.remove('hidden');
  ov.classList.add('open');
  document.body.style.overflow='hidden';
}
function closePF(){
  document.getElementById('pfOverlay').classList.remove('open');
  document.body.style.overflow='';
}
function pfClickOutside(e){if(e.target===document.getElementById('pfOverlay'))closePF();}
function pfFrameLoaded(){const ld=document.getElementById('pfLoading');if(ld)ld.classList.add('hidden');}
document.addEventListener('keydown',function(e){if(e.key==='Escape')closePF();});`;

const BUTTON_HTML = `
    <button class="add-req-btn" onclick="openPF()">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2v10M2 7h10" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>
      Add Project Request
    </button>`;

const files = [
  'projects/index.html',
  'prioritization/index.html',
  'roadmap/index.html',
  'staging/projects/index.html',
  'staging/prioritization/index.html',
  'staging/roadmap/index.html',
  'ucook/projects/index.html',
  'ucook/prioritization/index.html',
  'ucook/roadmap/index.html',
  'faithful-to-nature/projects/index.html',
  'faithful-to-nature/prioritization/index.html',
  'faithful-to-nature/roadmap/index.html',
];

const issues = [];

for (const rel of files) {
  const fp = path.join(BASE, rel);
  let html = fs.readFileSync(fp, 'utf8');
  let changed = false;

  // 1. Inject CSS before first </style>
  if (!html.includes('pf-overlay')) {
    html = html.replace('</style>', CSS + '</style>');
    changed = true;
    console.log(`  [css]    ${rel}`);
  }

  // 2. Add button after hero-sub paragraph
  if (!html.includes('openPF()')) {
    // Match the full hero-sub paragraph (inline or multiline)
    const re = /(<p[^>]*class="hero-sub"[^>]*>[\s\S]*?<\/p>)/;
    const m = html.match(re);
    if (m) {
      html = html.replace(m[0], m[0] + BUTTON_HTML);
      changed = true;
      console.log(`  [btn]    ${rel}`);
    } else {
      console.log(`  WARN: hero-sub not found — ${rel}`);
      issues.push(rel + ' (hero-sub)');
    }
  }

  // 3. Add modal HTML before </body>
  if (!html.includes('pfOverlay')) {
    html = html.replace('</body>', MODAL_HTML + '\n</body>');
    changed = true;
    console.log(`  [modal]  ${rel}`);
  }

  // 4. Add JS block before </body>
  if (!html.includes('_PF_URL')) {
    html = html.replace('</body>', `<script>${JS}\n</script>\n</body>`);
    changed = true;
    console.log(`  [js]     ${rel}`);
  }

  if (changed) {
    fs.writeFileSync(fp, html, 'utf8');
    console.log(`✓ ${rel}`);
  } else {
    console.log(`= ${rel} (already patched)`);
  }
}

console.log('\n─────────────────────────────────────');
if (issues.length) {
  console.log(`Issues (${issues.length}):`);
  issues.forEach(i => console.log('  ✗', i));
} else {
  console.log('All files patched successfully.');
}
