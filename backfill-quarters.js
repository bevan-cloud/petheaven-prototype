#!/usr/bin/env node
// backfill-quarters.js — sets Quarter = "2025 and Prior" on all Road Map items
// Usage: node backfill-quarters.js

const DB_ID = '22d9af46-2129-4dcf-ab3a-1cb48e665965';
const QUARTER_VALUE = '2025 and Prior';

// Load token from .env
function loadToken() {
  if (process.env.NOTION_TOKEN) return process.env.NOTION_TOKEN;
  try {
    const fs = require('fs');
    const match = fs.readFileSync('.env', 'utf8').match(/^NOTION_TOKEN\s*=\s*(.+)$/m);
    if (match) return match[1].trim();
  } catch {}
  throw new Error('NOTION_TOKEN not set in .env');
}
const TOKEN = loadToken();

const HEADERS = {
  'Authorization': `Bearer ${TOKEN}`,
  'Notion-Version': '2022-06-28',
  'Content-Type': 'application/json',
};

// Step 1: add "2025 and Prior" option to the Quarter select field
async function addQuarterOption() {
  console.log(`Adding "${QUARTER_VALUE}" option to Quarter field…`);
  const res = await fetch(`https://api.notion.com/v1/databases/${DB_ID}`, {
    method: 'PATCH',
    headers: HEADERS,
    body: JSON.stringify({
      properties: {
        Quarter: {
          select: {
            options: [
              { name: '2025 and Prior', color: 'gray' },
              { name: 'Q1 2026',        color: 'blue' },
              { name: 'Q2 2026',        color: 'green' },
              { name: 'Q3 2026',        color: 'yellow' },
              { name: 'Q4 2026',        color: 'orange' },
            ],
          },
        },
      },
    }),
  });
  if (!res.ok) throw new Error(`DB update failed: ${res.status} ${await res.text()}`);
  console.log('  Quarter options added.');
}

// Step 2: fetch all page IDs from the database
async function fetchAllPageIds() {
  const ids = [];
  let cursor;
  do {
    const body = { page_size: 100 };
    if (cursor) body.start_cursor = cursor;
    const res = await fetch(`https://api.notion.com/v1/databases/${DB_ID}/query`, {
      method: 'POST', headers: HEADERS, body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`Query failed: ${res.status} ${await res.text()}`);
    const data = await res.json();
    for (const page of data.results) {
      if (!page.properties.Archive?.checkbox && page.properties.Project?.title?.length) {
        ids.push(page.id);
      }
    }
    cursor = data.has_more ? data.next_cursor : undefined;
  } while (cursor);
  return ids;
}

// Step 3: update a single page's Quarter field
async function setQuarter(pageId) {
  const res = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
    method: 'PATCH',
    headers: HEADERS,
    body: JSON.stringify({
      properties: {
        Quarter: { select: { name: QUARTER_VALUE } },
      },
    }),
  });
  if (!res.ok) throw new Error(`Page ${pageId} update failed: ${res.status}`);
}

// Throttle helper — Notion allows ~3 req/s
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  await addQuarterOption();

  console.log('Fetching all page IDs…');
  const ids = await fetchAllPageIds();
  console.log(`  Found ${ids.length} items to update.`);

  let done = 0, failed = 0;
  for (const id of ids) {
    try {
      await setQuarter(id);
      done++;
    } catch (e) {
      console.warn(`  WARN: ${e.message}`);
      failed++;
    }
    // ~2.5 req/s to stay safely under Notion's rate limit
    await sleep(400);
    if (done % 50 === 0) process.stdout.write(`  ${done}/${ids.length}…\n`);
  }

  console.log(`\nDone. ${done} updated, ${failed} failed.`);
  console.log('Run `node sync-notion.js` to refresh staging/notion-data.js.');
}

main().catch(err => { console.error(err.message); process.exit(1); });
