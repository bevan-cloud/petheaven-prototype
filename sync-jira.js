// sync-jira.js — Fetches active + next sprint issues from Jira and writes per-company jira-sprint-data.js
// Usage: node sync-jira.js
// Env vars: JIRA_EMAIL, JIRA_API_TOKEN, COMPANY (ucook | staging — defaults to staging)
// Jira instance: silvertree-holdings-dev.atlassian.net

'use strict';

const https = require('https');
const fs = require('fs');
const path = require('path');

// ─── Configuration ────────────────────────────────────────────────────────────

const JIRA_BASE = 'silvertree-holdings-dev.atlassian.net';
const JIRA_API  = '/rest/api/3';

// COMPANY determines which projects to fetch and where to write the output.
// Add new companies here as sprint boards are built out.
const COMPANY_CONFIG = {
  staging:            { projects: ['UC', 'FM'], outDir: 'staging'            },
  ucook:              { projects: ['UC'],        outDir: 'ucook'              },
  'faithful-to-nature': { projects: ['FM'],     outDir: 'faithful-to-nature' },
  petheaven:          { projects: ['FM'],        outDir: '.'                  },
};

const COMPANY = (process.env.COMPANY || 'staging').toLowerCase();
const config  = COMPANY_CONFIG[COMPANY];

if (!config) {
  console.error(`[sync-jira] ERROR: Unknown COMPANY "${COMPANY}". Valid values: ${Object.keys(COMPANY_CONFIG).join(', ')}`);
  process.exit(1);
}

const PROJECTS = config.projects;

const ACTIVE_FIELDS = 'summary,status,issuetype,priority,assignee,parent,subtasks,timetracking,description,customfield_10020';
const NEXT_FIELDS   = 'summary,status,issuetype,priority,assignee,parent,customfield_10020';

// ─── Auth ─────────────────────────────────────────────────────────────────────

const email = process.env.JIRA_EMAIL;
const token = process.env.JIRA_API_TOKEN;

if (!email || !token) {
  console.error('[sync-jira] ERROR: JIRA_EMAIL and JIRA_API_TOKEN env vars are required.');
  process.exit(1);
}

const authHeader = 'Basic ' + Buffer.from(email + ':' + token).toString('base64');

// ─── HTTP helper ──────────────────────────────────────────────────────────────

function request(urlPath) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: JIRA_BASE,
      path: urlPath,
      method: 'GET',
      headers: {
        Authorization: authHeader,
        Accept: 'application/json',
      },
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        if (res.statusCode < 200 || res.statusCode >= 300) {
          return reject(new Error(`HTTP ${res.statusCode} for ${urlPath}: ${body}`));
        }
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          reject(new Error(`Failed to parse JSON from ${urlPath}: ${e.message}`));
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

// ─── JQL search with pagination ───────────────────────────────────────────────

async function searchJql(jql, fields, label) {
  const allIssues = [];
  let startAt = 0;
  const maxResults = 100;

  console.log(`[sync-jira] ${label}...`);

  while (true) {
    const encoded = encodeURIComponent(jql);
    const url = `${JIRA_API}/search/jql?jql=${encoded}&fields=${encodeURIComponent(fields)}&maxResults=${maxResults}&startAt=${startAt}`;
    const data = await request(url);

    const issues = data.issues || [];
    allIssues.push(...issues);

    const total = data.total || 0;
    const fetched = startAt + issues.length;

    if (fetched >= total || issues.length === 0) break;
    startAt = fetched;
  }

  console.log(`[sync-jira] Found ${allIssues.length} issues`);
  return allIssues;
}

// ─── Issue mapper ─────────────────────────────────────────────────────────────

function mapIssue(issue) {
  const fields = issue.fields || {};

  return {
    id: issue.id,
    key: issue.key,
    summary: fields.summary || '',
    issuetype: { name: fields.issuetype ? fields.issuetype.name : 'Unknown' },
    status: {
      name: fields.status ? fields.status.name : 'Unknown',
      category: fields.status && fields.status.statusCategory ? fields.status.statusCategory.key : 'undefined',
    },
    priority: { name: fields.priority ? fields.priority.name : 'Medium' },
    assignee: fields.assignee
      ? {
          displayName: fields.assignee.displayName || '',
          avatar: (fields.assignee.avatarUrls && fields.assignee.avatarUrls['32x32']) || '',
        }
      : null,
    parent: fields.parent
      ? {
          key: fields.parent.key || '',
          summary: (fields.parent.fields && fields.parent.fields.summary) || '',
          issuetype: (fields.parent.fields && fields.parent.fields.issuetype && fields.parent.fields.issuetype.name) || '',
        }
      : null,
    subtasks: (fields.subtasks || []).map((s) => ({
      key: s.key,
      summary: s.fields ? s.fields.summary : '',
      status: {
        name: s.fields && s.fields.status ? s.fields.status.name : 'Unknown',
        category: s.fields && s.fields.status && s.fields.status.statusCategory
          ? s.fields.status.statusCategory.key
          : 'undefined',
      },
    })),
    timetracking: {
      spent: (fields.timetracking && fields.timetracking.timeSpent) || null,
      remaining: (fields.timetracking && fields.timetracking.remainingEstimate) || null,
      spentSeconds: (fields.timetracking && fields.timetracking.timeSpentSeconds) || 0,
      remainingSeconds: (fields.timetracking && fields.timetracking.remainingEstimateSeconds) || 0,
    },
    description: typeof fields.description === 'string'
      ? fields.description.substring(0, 2000)
      : '',
    url: 'https://silvertree-holdings-dev.atlassian.net/browse/' + issue.key,
    project: issue.key.split('-')[0],
  };
}

// ─── Extract sprint metadata from customfield_10020 ──────────────────────────

function extractSprintInfo(issues, type) {
  // customfield_10020 can be an array of sprint objects
  for (const issue of issues) {
    const sprints = issue.fields && issue.fields.customfield_10020;
    if (!sprints || !Array.isArray(sprints) || sprints.length === 0) continue;

    if (type === 'active') {
      const active = sprints.find((s) => s.state === 'active');
      if (active) return {
        id: active.id, name: active.name, state: active.state, goal: active.goal || '',
        startDate: active.startDate || null, endDate: active.endDate || null,
      };
    }

    if (type === 'next') {
      const future = sprints.find((s) => s.state === 'future');
      if (future) return {
        id: future.id, name: future.name, state: future.state, goal: future.goal || '',
        startDate: future.startDate || null, endDate: future.endDate || null,
      };
      // Fall back to first sprint in list
      const first = sprints[0];
      if (first) return {
        id: first.id, name: first.name, state: first.state, goal: first.goal || '',
        startDate: first.startDate || null, endDate: first.endDate || null,
      };
    }
  }

  return null;
}

// ─── Fetch one project ────────────────────────────────────────────────────────

async function fetchProject(key) {
  // ── Active sprint ────────────────────────────────────────────────────────
  const activeJql = `project = ${key} AND sprint in openSprints() ORDER BY created ASC`;
  const activeRaw = await searchJql(
    activeJql,
    ACTIVE_FIELDS,
    `Fetching ${key} active sprint`
  );

  // ── Next sprint ──────────────────────────────────────────────────────────
  // First try any future sprint (no hardcoded name — works across all projects)
  let nextRaw = [];
  const nextJql = `project = ${key} AND sprint in futureSprints() ORDER BY created ASC`;
  nextRaw = await searchJql(
    nextJql,
    NEXT_FIELDS,
    `Fetching ${key} next sprint`
  );

  // If no future sprint, try a sprint named "Product Backlog" (UC convention).
  // Wrapped in try/catch — other projects may not have this sprint and Jira
  // returns a 400 for unknown sprint names, which would otherwise crash the sync.
  if (nextRaw.length === 0) {
    try {
      console.log(`[sync-jira] No future sprint found for ${key}, trying Product Backlog...`);
      const backlogJql = `project = ${key} AND sprint = "Product Backlog" ORDER BY created ASC`;
      nextRaw = await searchJql(backlogJql, NEXT_FIELDS, `Fetching ${key} Product Backlog`);
    } catch (e) {
      console.log(`[sync-jira] No "Product Backlog" sprint for ${key} — skipping backlog fallback.`);
      nextRaw = [];
    }
  }

  // ── Sprint metadata ──────────────────────────────────────────────────────
  const activeSprint = extractSprintInfo(activeRaw, 'active');
  const nextSprint   = extractSprintInfo(nextRaw, 'next');

  // ── Map issues ───────────────────────────────────────────────────────────
  const activeIssues = activeRaw.map(mapIssue);
  const nextIssues   = nextRaw.map(mapIssue);

  return {
    meta: {
      activeSprint,
      nextSprint,
    },
    activeIssues,
    nextIssues,
  };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('[sync-jira] Starting Jira sprint sync...');

  const projectData = {};
  const allActiveIssues = [];
  const allNextIssues   = [];

  for (const key of PROJECTS) {
    console.log(`[sync-jira] ── Project: ${key} ──────────────────────`);
    const result = await fetchProject(key);

    projectData[key] = {
      activeSprint: result.meta.activeSprint,
      nextSprint:   result.meta.nextSprint,
    };

    allActiveIssues.push(...result.activeIssues);
    allNextIssues.push(...result.nextIssues);
  }

  const syncedAt = new Date().toISOString();

  const output = {
    projects: projectData,
    issues: {
      active: allActiveIssues,
      next:   allNextIssues,
    },
    syncedAt,
  };

  // ── Write output file ────────────────────────────────────────────────────
  const outDir  = path.join(__dirname, config.outDir);
  const outFile = path.join(outDir, 'jira-sprint-data.js');

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const fileContent = [
    '// Auto-generated by sync-jira.js — do not edit manually',
    `// Last synced: ${syncedAt}`,
    `window.JIRA_SPRINT_DATA = ${JSON.stringify(output, null, 2)};`,
  ].join('\n') + '\n';

  fs.writeFileSync(outFile, fileContent, 'utf8');

  console.log(`[sync-jira] Written ${outFile}`);
  console.log(`[sync-jira] Active issues: ${allActiveIssues.length} | Next issues: ${allNextIssues.length}`);
  console.log('[sync-jira] Done.');
}

main().catch((err) => {
  console.error('[sync-jira] FATAL:', err.message || err);
  process.exit(1);
});
