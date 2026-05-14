#!/usr/bin/env node
// sync-notion.js — fetches Notion Road Map and writes staging/notion-data.js
// Usage: node sync-notion.js
// Requires: Node 18+ (uses native fetch)

const DB_ID  = '22d9af46-2129-4dcf-ab3a-1cb48e665965';
const OUTPUT = 'staging/notion-data.js';

// Load token from .env file or NOTION_TOKEN environment variable
function loadToken() {
  if (process.env.NOTION_TOKEN) return process.env.NOTION_TOKEN;
  try {
    const fs = require('fs');
    const match = fs.readFileSync('.env', 'utf8').match(/^NOTION_TOKEN\s*=\s*(.+)$/m);
    if (match) return match[1].trim();
  } catch {}
  throw new Error('NOTION_TOKEN not set. Add it to a .env file:\n  NOTION_TOKEN=ntn_...');
}
const TOKEN = loadToken();

// ─── Notion status → workspace status ────────────────────────────────────────
const STATUS_MAP = {
  '0. Conceptual Idea':          'planned',
  '0.1 Concept Validation':      'planned',
  '1.1 Product Scoping':         'planned',
  '1.2 Technical Scoping':       'planned',
  '1. Scoping':                  'planned',
  '2. Scoped':                   'planned',
  '3. Scheduled for Development':'planned',
  '11. Parked':                  'planned',
  '4. In progress':              'progress',
  '5. QA':                       'review',
  '6. On Hold / Pending Feedback':'review',
  'Live':                        'live',
  '10. Done':                    'done',
  '12. Wont Do':                 'done',
};

// Extract 'Q1' from 'Q1 2026'
function parseQ(raw) {
  if (!raw) return '';
  const m = raw.match(/^(Q\d)/);
  return m ? m[1] : '';
}

// ─── Fetch all pages from Notion database (handles pagination) ────────────────
async function queryAll() {
  const results = [];
  let cursor;
  do {
    const body = { page_size: 100 };
    if (cursor) body.start_cursor = cursor;
    const res = await fetch(`https://api.notion.com/v1/databases/${DB_ID}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Notion API ${res.status}: ${text}`);
    }
    const data = await res.json();
    results.push(...data.results);
    cursor = data.has_more ? data.next_cursor : undefined;
  } while (cursor);
  return results;
}

// ─── Map a Notion page to workspace item format ───────────────────────────────
function mapItem(page, idx) {
  const p = page.properties;

  const name    = (p.Project?.title  ?? []).map(t => t.plain_text).join('').trim();
  const company = (p.Company?.multi_select ?? []).map(c => c.name);
  const theme   = p['Strategic Pillar']?.select?.name || 'Other';
  const status  = STATUS_MAP[p.Status?.status?.name] ?? 'planned';
  const qRaw    = p.Quarter?.select?.name || '';
  const q       = parseQ(qRaw);
  const r       = p.Reach?.number          ?? 0;
  const i       = p.Impact?.number         ?? 0;
  const c       = p.Confidence?.number     ?? 0;
  const e       = p.Effort?.number         || 1;   // avoid /0
  const desc    = (p.Description?.rich_text ?? []).map(b => b.plain_text).join('').slice(0, 300).trim();
  const priority = p.Priority?.select?.name || '';
  const pillar   = p['Strategic Pillar']?.select?.name || '';
  const archive  = p.Archive?.checkbox ?? false;
  const depDevRaw = p['Dependent on Dev']?.select?.name || null;
  const depDev    = depDevRaw === 'Yes' ? true : depDevRaw === 'No' ? false : null;
  const lead      = (p.Lead?.rich_text ?? []).map(t => t.plain_text).join('').trim() || '';
  const engineers = (p.Engineers?.people ?? []).map(e => e.name).filter(Boolean);
  const stagingUrl = p['Refernce']?.url || '';
  const requestType = p['Request Type']?.select?.name || '';

  return {
    id:        idx + 1,
    notionId:  page.id,
    name:      name || 'Untitled',
    company,
    theme,
    pillar,
    status,
    q,
    qLabel:    qRaw,
    r, i, c, e,
    desc,
    notionUrl: page.url,
    priority,
    lead,
    engineers,
    stagingUrl,
    archive,
    depDev,
    requestType,
  };
}

// ─── Fetch page-level comments for one page ──────────────────────────────────
async function fetchPageComments(pageId) {
  try {
    const res = await fetch(`https://api.notion.com/v1/comments?block_id=${pageId}`, {
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Notion-Version': '2022-06-28',
      },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results || [])
      .filter(c => c.parent?.type === 'page_id') // page-level only, skip inline
      .map(c => ({
        author: c.created_by?.name || 'Product Workspace',
        date:   c.created_time,
        text:   (c.rich_text || []).map(r => r.plain_text).join('').trim(),
      }))
      .filter(c => c.text);
  } catch { return []; }
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('Fetching Notion Road Map…');
  const pages = await queryAll();
  console.log(`  Fetched ${pages.length} raw pages`);

  const allItems = pages.map(mapItem);

  // Exclude archived items and the template row
  const items = allItems.filter(it =>
    !it.archive && it.name && it.name !== 'Project Template'
  );

  console.log(`  ${items.length} items after filtering archived / template rows`);

  // Fetch page-level comments in batches (10 parallel, 500ms between batches)
  console.log('Fetching comments…');
  const BATCH = 10;
  for (let i = 0; i < items.length; i += BATCH) {
    const batch = items.slice(i, i + BATCH);
    await Promise.all(batch.map(async item => {
      item.comments = await fetchPageComments(item.notionId);
    }));
    if (i + BATCH < items.length) await new Promise(r => setTimeout(r, 500));
  }
  const totalComments = items.reduce((n, it) => n + (it.comments?.length || 0), 0);
  console.log(`  ${totalComments} comments across ${items.length} items`);

  const timestamp = new Date().toISOString();
  const js =
`// Generated by sync-notion.js — do not edit directly
// Last sync: ${timestamp}
// ${items.length} items from Notion Road Map (${DB_ID})

const NOTION_ITEMS = ${JSON.stringify(items, null, 2)};
`;

  const { writeFileSync, readFileSync } = await import('fs');
  writeFileSync(OUTPUT, js, 'utf8');
  console.log(`Written → ${OUTPUT}`);

  // Bust the browser cache across ALL company pages by updating the ?v= query string.
  // This ensures every roadmap/projects/prioritization page fetches fresh notion-data.js
  // after a sync — regardless of which company the user is on.
  const v = Date.now();
  const PAGES = [
    // Staging (original)
    'staging/projects/index.html',
    'staging/prioritization/index.html',
    'staging/roadmap/index.html',
    // Pet Heaven (root)
    'projects/index.html',
    'prioritization/index.html',
    'roadmap/index.html',
    // UCook
    'ucook/projects/index.html',
    'ucook/prioritization/index.html',
    'ucook/roadmap/index.html',
    // Faithful to Nature
    'faithful-to-nature/projects/index.html',
    'faithful-to-nature/prioritization/index.html',
    'faithful-to-nature/roadmap/index.html',
  ];
  for (const page of PAGES) {
    let original;
    try { original = readFileSync(page, 'utf8'); } catch { continue; } // skip if file doesn't exist yet
    let html = original;
    // Cache-bust notion-data.js — matches any path variant ending in notion-data.js
    html = html.replace(/src="([^"]*notion-data\.js)(\?v=\d+)?"/g, (_, path) => `src="${path}?v=${v}"`);
    // Cache-bust shared JS files (notion-write.js, project-briefs.js, sync.js)
    html = html.replace(/src="([^"]*\/(?:notion-write|project-briefs|sync)\.js)(\?v=\d+)?"/g,
      (_, file) => `src="${file}?v=${v}"`);
    if (html !== original) {
      writeFileSync(page, html, 'utf8');
      console.log(`  Cache-busted: ${page}`);
    }
  }

  console.log('Done. Run git add . && git push to publish.');
}

main().catch(err => { console.error(err.message); process.exit(1); });
