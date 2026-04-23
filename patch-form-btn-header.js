const fs = require('fs');
const path = require('path');

const BASE = 'C:\\Users\\bevan\\AppData\\Local\\Temp\\petheaven-prototype';

// Button HTML to inject into the header (before </header>)
const HEADER_BTN = `  <button class="add-req-btn" onclick="openPF()" style="margin-left:12px;margin-top:0">
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M7 2v10M2 7h10" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>
    Add Project Request
  </button>`;

// The hero button block we want to remove (added by the previous patch)
const HERO_BTN_RE = /\n\s*<button class="add-req-btn" onclick="openPF\(\)">\s*\n\s*<svg[^<]*<\/svg>\s*\n\s*Add Project Request\s*\n\s*<\/button>/;

// CSS override so the button sits flush in the header
const CSS_OVERRIDE = `
.site-header .add-req-btn{margin-top:0;margin-left:12px;padding:7px 14px;font-size:12px}
`;

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

  // 1. Remove hero-section button
  if (HERO_BTN_RE.test(html)) {
    html = html.replace(HERO_BTN_RE, '');
    changed = true;
    console.log(`  [rm hero btn]  ${rel}`);
  } else {
    console.log(`  WARN: hero btn not found in ${rel}`);
    issues.push(rel + ' (hero btn not found)');
  }

  // 2. Add button to header (just before </header>)
  if (!html.includes('site-header .add-req-btn')) {
    // inject CSS override
    html = html.replace('</style>', CSS_OVERRIDE + '</style>');
    changed = true;
  }

  if (!html.match(/<\/header>\s*\n\s*<div class="hero"/)) {
    // safety: only inject if we haven't already
    if (!html.includes(HEADER_BTN.trim())) {
      html = html.replace('</header>', HEADER_BTN + '\n</header>');
      changed = true;
      console.log(`  [add hdr btn]  ${rel}`);
    }
  }

  if (changed) {
    fs.writeFileSync(fp, html, 'utf8');
    console.log(`✓ ${rel}`);
  } else {
    console.log(`= ${rel}`);
  }
}

console.log('\n─────────────────────────────────────');
if (issues.length) {
  console.log('Issues:', issues);
} else {
  console.log('All done.');
}
