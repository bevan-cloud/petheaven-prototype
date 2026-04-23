const fs = require('fs');
const path = require('path');

const BASE = 'C:\\Users\\bevan\\AppData\\Local\\Temp\\petheaven-prototype';

// Exact hero button string to remove (as written by the first patch script)
const HERO_BTN = `
    <button class="add-req-btn" onclick="openPF()">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2v10M2 7h10" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>
      Add Project Request
    </button>`;

// Button to inject into the header
const HEADER_BTN = `  <button class="add-req-btn" onclick="openPF()">
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M7 2v10M2 7h10" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>
    Add Project Request
  </button>
</header>`;

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

  // 1. Remove hero button
  if (html.includes(HERO_BTN)) {
    html = html.replace(HERO_BTN, '');
    changed = true;
    console.log(`  [rm hero]   ${rel}`);
  } else {
    console.log(`  WARN: hero btn not found in ${rel}`);
    issues.push(rel);
  }

  // 2. Add to header (replace </header> only once, only if not already there)
  if (!html.includes('Add Project Request\n  </button>\n</header>')) {
    html = html.replace('</header>', HEADER_BTN);
    changed = true;
    console.log(`  [add hdr]   ${rel}`);
  }

  if (changed) {
    fs.writeFileSync(fp, html, 'utf8');
    console.log(`✓ ${rel}`);
  } else {
    console.log(`= ${rel}`);
  }
}

console.log('\n─────────────────────────────────────');
if (issues.length) console.log('Issues:', issues);
else console.log('All done.');
