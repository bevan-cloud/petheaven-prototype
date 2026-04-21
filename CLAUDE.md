# Silvertree Product Workspace — CLAUDE.md

## What This Project Is

The **Silvertree Product Workspace** is a static GitHub Pages web application that gives product stakeholders at Silvertree Holdings a single, always-live view of product strategy, initiatives, prioritization scores, roadmaps, and sprint status for all portfolio brands.

**Live URL:** `https://bevan-cloud.github.io/petheaven-prototype/`
**All-workspaces landing:** `https://bevan-cloud.github.io/silvertree-product-workspace/`
**Repository:** `bevan-cloud/petheaven-prototype` on GitHub

The site is **read-oriented with write-back capability**: data is pulled from a shared Notion database, rendered as HTML/JS, and edits made in the UI are pushed back to Notion via an N8N webhook (`https://workflow.sih.services/webhook/product-workspace-notion-update`).

---

## Company Workspaces

There are four workspace instances, each with its own URL prefix and brand colour:

| Workspace | URL prefix | Brand colour | Description |
|---|---|---|---|
| Pet Heaven | `/home/` (or implicitly `/petheaven-prototype/`) | `#57AB4E` (green) | South Africa's online pet store |
| UCook | `/ucook/` | `#e05a1e` (orange) | SA's leading meal kit company |
| Faithful to Nature | `/faithful-to-nature/` | `#006654` (teal) | Natural & organic marketplace |
| Bevan Staging | `/staging/` | `#4f46e5` (indigo) | Safe sandbox for building/testing new features |

Every workspace shares identical page structure and features — only data (filtered by `company` field) and brand colours differ.

---

## Global Navigation & Header

**Header bar** (64px, brand-dark background colour):
- Brand logo/wordmark (links back to the workspace home)
- "Product Workspace" label
- **Company Switcher** (top-right pill button): dropdown listing all four workspaces with coloured dot indicators and checkmark on the active one; navigates to `../[brand]/home/` on selection
- **All Workspaces icon** (house icon): links to `https://bevan-cloud.github.io/silvertree-product-workspace/`
- **Sync button** (circular arrow icon): triggers a GitHub Actions workflow dispatch (`sync-notion.yml`) to pull fresh data from Notion; requires a GitHub Personal Access Token stored in `localStorage` under `gh_sync_pat` (prompted on first use)
- **Add Project Request button** (green pill): opens the "Add Project Request" modal (on Projects, Prioritization, and Roadmap pages)

**Breadcrumb navigation:** shown on inner pages as `Home › [Page Name]`

---

## All-Workspaces Landing Page

**URL:** `https://bevan-cloud.github.io/silvertree-product-workspace/`

A minimal centred grid page (no per-brand chrome). Shows four cards in a 4-column grid (2-column on tablet, 1-column on mobile):

- **Pet Heaven card** — logo image, name, tagline "South Africa's online pet store — subscriptions, personalisation & catalogue growth."
- **UCook card** — wordmark logo, tagline "SA's leading meal kit — ecommerce growth, fulfilment ops & web/app enhancement."
- **Faithful to Nature card** — "FtN" wordmark, tagline "Natural & organic marketplace — content, discovery, loyalty & sustainable growth."
- **Bevan Staging card** — test-tube emoji + "Staging" wordmark, tagline "Safe sandbox — build & test new features here before rolling out to production brands."

Each card links to the respective workspace home. Footer: `bevan-cloud.github.io · Product strategy workspace`.

---

## Page: Home / Dashboard

**URLs:**
- Pet Heaven: `/home/`
- UCook: `/ucook/home/`
- Faithful to Nature: `/faithful-to-nature/home/`
- Staging: `/staging/home/`

**Purpose:** Landing page for a workspace. Provides an overview and navigates to the main tools.

### Sections

**Hero / Intro**
- Brand badge (domain name, e.g. `petheaven.co.za`)
- H1: "Product Workspace"
- Subtitle: Brand-specific description of the workspace

**"Navigate to" section label**

**Nav Grid** — 3-column card grid (2-column on tablet, 1-column on mobile). Each card is a large clickable tile linking to a page within the workspace.

Each nav tile contains:
- Coloured accent bar (top edge, brand colour)
- Preview thumbnail (visual mini-mockup of the destination page)
- Page title (DM Serif Display)
- Description paragraph
- Meta tag pills (summary stats or labels)
- Arrow icon (reveals on hover)

### Nav Tiles per Workspace

**Pet Heaven home tiles:**
1. **Projects** → `../projects/` — "Active product initiatives — including project briefs, prototype links, and feature scope for each workstream." Tags: `3 active projects`, `3 prototypes live`, `3 briefs complete`
2. **Prioritization** → `../prioritization/` — "Impact vs effort scoring, backlog ranking, and initiative sequencing." Tags: `Impact / effort`, `Roadmap`, `Backlog`
3. **Roadmap** → `../roadmap/` — "FY2026/27 quarterly plan. Click any initiative to drill into the brief, RICE scores, and rationale." Tags: `FY2026/27`, `Q1 – Q4`, `63 initiatives`
4. **Sprint Board** → `../sprint-board/` — "Live Jira sprint board — active issues by status, backlog, and sprint insights." Tags: `Jira · FM project`, `Auto-synced`
5. **Style Guide** → `../style-guide/` — "Pet Heaven CI and design system — colours, typography, buttons, components." Tags: `Colour system`, `Typography`, `Buttons`, `Components`

**Staging home tiles:**
1. **Projects** — "Staging project briefs — safe to experiment, break, and rebuild without affecting production brands." Tags: `8 test projects`, `3 live`, `staging only`
2. **Prioritization** — "Test the RICE scoring and Impact vs Effort matrix with dummy initiatives." Tags: `8 test items`, `RICE + Matrix`, `staging only`
3. **Roadmap** — "Quarterly staging plan. Test roadmap layouts, brief structures, and quarter logic safely." Tags: `8 test items`, `FY2026/27`, `Q1–Q4`
4. **Style Guide** — "Staging colour palette, typography tokens, and component patterns for testing brand changes." Tags: `Indigo #4f46e5`, `DM Sans`, `staging only`
5. **Sprint Board** — "Active sprint pulled from Jira — track in-flight work across To Do, In Progress, In Review and Done." Tags: `Jira`, `Sprint tracking`, `staging only`

**UCook home tiles** (same structure):
1. **Projects** — Tags: `9 Q1 initiatives`, `3 live`, `4 themes`
2. **Prioritization** — Tags: `19 initiatives`, `RICE scoring`, `6 themes`
3. **Roadmap** — Tags: `19 initiatives`, `FY2026/27`, `Q1–Q4`
4. **Sprint Board**
5. **Style Guide** — Tags: `Gordita` (brand typeface), `Orange #FF6803`, `Pill buttons`

**Faithful to Nature home tiles:**
- Same 5 tiles. Sprint Board tags: `Jira · FM project`, `M1 — Magento 1`, `M2 — Magento 2`

---

## Page: Projects

**URLs:**
- Pet Heaven: `/projects/`
- UCook: `/ucook/projects/`
- Faithful to Nature: `/faithful-to-nature/projects/`
- Staging: `/staging/projects/`

**Purpose:** A searchable, filterable, sortable list of all product roadmap initiatives for the brand, with two display modes (table and card grid).

### Data Source

All data is loaded from `/staging/notion-data.js` — a JS file auto-generated by `sync-notion.js` from the shared Notion "Road Map" database. Items are filtered to the current brand using the `company` array field (values: `PH`, `UCOOK`, `FTN`, `All`). As of last sync (2026-04-21), the database contains **640 total items**.

### Hero Section

- Breadcrumb: `Home › Projects`
- Badge: `[brand domain] · FY2026/27 · Projects`
- H1: "Projects"
- Subtitle: "All [Brand] roadmap initiatives — search, filter by status, pillar, or quarter, and switch between table and card views."

### Header Controls (in site header)

- **Sync button** (circular arrow) — triggers GitHub Actions workflow to pull fresh Notion data
- **Add Project Request button** (green) — opens the "Add Project Request" modal

### Controls Bar

- **Search input** — real-time text search by initiative name and description
- **Filter button** (dropdown) — adds filter chips. Filter dimensions:
  - Status (`Live`, `In Progress`, `In Review`, `Planned`, `Done`)
  - Quarter (dynamically populated from data; FY quarters like `Q1 FY27`, `Q2 FY27`, etc.)
  - Pillars (dynamically populated: see pillars list below)
  - Matrix Quadrant (`⚡ Quick Win`, `🎯 Big Bet`, `💭 Fill In`, `⚠ Time Sink`)
- **Sort button** (dropdown) — sets a chip-level sort by: Status, Quarter, Pillars, or Matrix Quadrant; direction toggleable (↑/↓)
- **Reset button** — clears all filters and sorts (hidden when no filters are active)
- **Results count** — shows "X of Y" matching items
- **View toggle** — `Table` | `Cards` buttons (table is default)

Active filters appear as **filter chips** in the controls bar. Each chip has a label, a `<select>` to pick the specific value, and an × button to remove it.

**Default filter behaviour:** On page load, the filter automatically selects the current financial quarter (or the next quarter with data).

### Table View

Columns (all headers are clickable to sort asc/desc):
1. `#` — row index
2. `Project` — initiative name (bold) + truncated description below it
3. `Status` — editable pill badge (Live / In Progress / In Review / Planned / Done)
4. `Pillar` — editable coloured tag (strategic pillar)
5. `Quarter` — editable text (e.g. `Q2 FY27`)
6. `Priority` — editable text (e.g. `P1 🔥 Critical`, `P2`, `P3`, etc.)
7. `RICE` — calculated score (right-aligned, bold)

Status badge colours:
- Live: green (`#e8f5e9` / `#1b5e20`)
- In Progress: amber (`#fff8e1` / `#7a5a00`)
- Planned: brand-light (`#e8f5e6` / `#2F6C38`)
- In Review: purple (`#f3e5f5` / `#6a1b9a`)
- Done: grey (`#efefec` / `#5a5a54`)

**Click-to-edit fields** (in table, when Notion write is enabled): Status, Pillar, Quarter, Priority cells become inline `<select>` or `<input>` elements on click; saving patches the Notion database via the N8N webhook. Editable cells show a subtle border-bottom on hover.

**Row click:** Opens the project flyout panel.

### Card View

A 2-column grid (1-column on mobile). Each card contains:
- 5px coloured accent bar at top (pillar colour)
- Header row: initiative name (DM Serif Display) + lead avatar initials + status badge
- Pillar tag pill
- Description text (3-line clamp)
- Footer row: engineer avatar stack + meta pills (Quarter, RICE score, Impact score)

### Project Flyout Panel

A right-side panel (480px wide, full-height on desktop; full-screen bottom sheet on mobile) that slides in when a project row or card is clicked. Content:

- Colour accent bar (pillar colour)
- Company tags (e.g. `PH`, `UCOOK`)
- Type pill (`Quick Win` / `Existing Roadmap` / `Medium-term`) — green/purple/amber
- AI badge (`✦ AI`) — purple, shown for AI-assisted initiatives
- Initiative title (DM Serif Display, 26px)
- Subtitle/description
- **Properties grid** (2-column, editable via notion-write.js):
  - Status (dropdown)
  - Pillar (dropdown)
  - Quarter (dropdown)
  - Priority (dropdown)
  - Project Lead (text input; note: must match a Notion workspace member)
  - Matrix Quadrant (calculated badge: Quick Win / Big Bet / Fill In / Time Sink)
  - Dev Dependent (badge: `Dev` green / `AI` purple / blank)
- **Project Brief section** (from `project-briefs.js`):
  - Summary paragraph
  - Feature bullet list
  - Links (Prototype, Staging Roadmap, Staging Prioritization) — each with icon, title, subtitle
- **RICE Score Breakdown** section:
  - 4-cell grid: R (purple), I (green), C (orange), E (blue) — each cell shows value + label, click-to-edit number input
  - RICE Score total bar (gradient green, shows calculated score)
- **"Open in Notion" link** — external link to the Notion page
- Close button (×) or Escape key closes flyout

### Add Project Request Modal

Triggered by "Add Project Request" button. An 820px × 86vh modal overlay containing:
- Header: "Add Project Request" title + "Open in Notion" secondary link + close button
- Body: iframe loading the Notion form at `https://silvertree.notion.site/ebd//1b56bd1cdd3480e49398c9ded6684010`
- Loading spinner shown until iframe loads

---

## Page: Prioritization

**URLs:**
- Pet Heaven: `/prioritization/`
- UCook: `/ucook/prioritization/`
- Faithful to Nature: `/faithful-to-nature/prioritization/`
- Staging: `/staging/prioritization/`

**Purpose:** Two complementary scoring frameworks for evaluating and ranking initiatives. All scoring values are editable and write back to Notion in real time.

### Hero Section

- Badge: `[brand domain] · FY2026/27 · Prioritization`
- H1: "Prioritization"
- Subtitle: "Two complementary frameworks for evaluating [Brand]'s product backlog — RICE scoring and the Impact vs Effort matrix. All scores are editable."

### View Tabs (three tabs, always visible)

1. **RICE Scoring** (default active)
2. **Impact vs Effort**
3. **Kanban**

Below the tabs, a **model description panel** changes based on active view.

### View Tab 1: RICE Scoring

**Model description panel:**
- RICE formula banner: `RICE = (R × I × C) ÷ E` with subtitle `higher score = higher priority · all values editable`
- Four dimension definitions:
  - **R — Reach**: How many users are affected? Scale 1–10
  - **I — Impact**: How much does it move the metric? Scale 1–5
  - **C — Confidence**: How certain are we? Scale 1–5
  - **E — Effort**: Build cost — higher = more work. Scale 1–5
- Usage hint: "Click any R / I / C / E value to edit it. Press Enter or Tab to save, Esc to cancel."

**Controls bar** (same search/filter/sort/reset bar as Projects page, with same dimensions: Status, Quarter, Pillars, Matrix Quadrant)

**RICE table** — section label: "All test initiatives — ranked by RICE score"

Table columns (all sortable):
1. `#` — rank
2. `Initiative` — name
3. `Theme` — strategic pillar (coloured tag)
4. `RICE Score` — calculated total (default sort, descending)
5. `Reach` — editable number (R)
6. `Impact` — editable number (I)
7. `Confidence` — editable number (C%)
8. `Effort` — editable number (E)
9. `Type` — Dev Dependent badge (Dev / AI / blank)

Row click → opens flyout. R/I/C/E cells: click-to-edit number input (nw-edit-num), saves to Notion on change.

### View Tab 2: Impact vs Effort (Matrix)

**Model description panel:** Impact vs Effort 2×2 grid showing four quadrant labels:
- ⚡ **Quick Wins** (high impact, low effort) — Do now (green)
- 🎯 **Big Bets** (high impact, high effort) — Plan & resource (blue)
- 💭 **Nice to Have** (low impact, low effort) — If capacity allows (grey)
- 🕳️ **Time Sinks** (low impact, high effort) — Deprioritise (red)

**Bubble chart** (interactive):
- Canvas area with crosshair dividers separating the 4 quadrants
- Each initiative plotted as a bubble; bubble size reflects RICE score
- Axes: X = Effort (1–5), Y = Impact (1–5)
- Bubble colour = strategic pillar (from `MATRIX_THEME_COLORS`)
- Legend (top-right): pillar colours
- Clicking a bubble → opens flyout
- "Not yet scored — excluded from matrix" section below chart with chip list of unscored items

**Matrix table** — same data below the chart

Table columns (sortable):
1. `#` — rank
2. `Initiative`
3. `Theme`
4. `Status`
5. `R`, `I`, `C%`, `E` — editable
6. `Type` — Dev Dependent
7. `RICE` — total score
8. `Quadrant` — Quick Win / Big Bet / Fill In / Time Sink

Clicking Impact or Effort value in the table → inline edit; matrix re-renders instantly.

### View Tab 3: Kanban

A horizontal status board. Five columns:
1. **Planned** (indigo, `#3730a3`)
2. **In Progress** (amber, `#d97706`)
3. **In Review** (violet, `#7c3aed`)
4. **Live** (green, `#059669`)
5. **Done** (grey, `#6b7280`)

Each column shows: column header (name + item count), cards below.

**Drag-and-drop:** Initiative cards can be dragged between columns. On drop, the card's status is updated in Notion via N8N webhook (maps local status keys to Notion status names, e.g. `progress` → `4. In progress`).

---

## Page: Roadmap

**URLs:**
- Pet Heaven: `/roadmap/`
- UCook: `/ucook/roadmap/`
- Faithful to Nature: `/faithful-to-nature/roadmap/`
- Staging: `/staging/roadmap/`

**Purpose:** FY2026/27 quarterly product roadmap. Three views of the same data, plus drill-down into individual quarters.

### Hero Section

- Badge: `[brand domain] · FY2026/27 · Roadmap`
- H1: "Roadmap"
- Subtitle: "FY2026/27 quarterly plan. Click any initiative to drill into the brief, RICE scores, and rationale behind the prioritisation."

### FY Banner

A banner component (`fy-banner`) appears at the top of each view, showing the current financial year and quarter context.

### View Tabs (three tabs)

1. **Kanban** (default active) — quarter columns with initiative cards
2. **Timeline** — pillar-by-quarter grid (Gantt-style table)
3. **By Pillar** — collapsible pillar sections each showing 4 quarter columns

### Controls Bar

- **Search input** — filters initiatives by name
- **Filter button** — adds filter chips for: Status, Quarter, Pillars
- **Sort button** — sort by: Status, Quarter, Pillars
- **Reset button** — clears all filters
- **Results count**

### View 1: Kanban

**Quarter columns** (4 columns for Q1–Q4 FY27):
- Each column header shows: quarter label (e.g. `Q1 FY27`), period (e.g. `Apr – Jun 2026`), initiative count, "View status board" drill-down hint
- Current quarter has a "Current" badge
- Clicking a column header → opens the **Quarter Drill-Down Panel** for that quarter

**Initiative cards** (inside columns) show:
- Left accent bar (pillar colour)
- Initiative name
- Status badge
- RICE score (if available)
- Pillar tag

**Backlog section** — below the quarter columns; shows initiatives not yet scheduled into the current FY.

**Drag-and-drop:** Cards can be dragged between quarter columns to reschedule them. The drop saves the new `qLabel` to Notion.

### View 2: Timeline

A table where:
- Rows = Strategic pillars
- Columns = Financial year quarters (Q1–Q4)
- Each cell contains coloured initiative bars

**Filter bar** at top: "All quarters" button + individual quarter filter buttons (e.g. `Q1 · Apr–Jun 2026`). Clicking a quarter filter narrows the timeline to show only that quarter's column.

Each initiative bar shows:
- Initiative name
- Status label
- RICE score

Clicking a bar → opens flyout.

Drag-and-drop between cells reschedules the initiative.

### View 3: By Pillar

A list of collapsible pillar sections. Each section:
- Coloured left bar + pillar name + initiative count ("X initiatives this FY")
- Chevron toggle (collapsed/expanded)
- When expanded: 4-column grid (Q1–Q4), each cell showing initiative cards for that pillar+quarter combination, with "Now" badge on current quarter

### Quarter Drill-Down Panel

A full-screen overlay panel opened by clicking a quarter column header. Contains:

**Header:**
- Close button (×) or Escape key
- Breadcrumb: `Roadmap › [Quarter label]`
- Eyebrow: `Quarter N · Current/Completed/Upcoming quarter`
- Title: `Q[N] FY[YY] · [Period]`
- Subtitle: `X initiatives scheduled`
- Tally row: Shipped / In Flight / Total counts

**Sub-tabs inside the panel:**
1. **Kanban** (default) — 5-column status board (Planned, In Progress, In Review, Live, Done) with initiative cards; drag-and-drop between columns saves status to Notion
2. **Timeline** — pillar rows showing all initiatives in that quarter as coloured bars

Clicking a card → opens the flyout (stacked on top of the drill panel).

### Initiative Flyout (Roadmap)

Same structure as the Projects flyout:
- Colour accent bar
- Company tags, type pill, AI badge
- Initiative title + subtitle
- Properties (Status, Pillar, Quarter, Priority — all editable; Matrix Quadrant badge; Dev Dependent)
- Project Brief (if available in `project-briefs.js`)
- RICE Score Breakdown (editable R/I/C/E cells + total)
- "Open in Notion" link

---

## Page: Sprint Board

**URLs:**
- Pet Heaven: `/sprint-board/`
- Staging: `/staging/sprint-board/` (linked from staging home)
- (Other brands likely share the same Jira FM project)

**Purpose:** A live Jira sprint board showing the current sprint's tickets and product backlog.

**Data source:** `/jira-sprint-data.js` — auto-generated by `sync-jira.js` from the Jira FM project.
- Last sync: 2026-04-21T08:17:48Z
- Project: `FM` (silvertree-holdings-dev.atlassian.net)
- Active sprint: `Sprint 47` (started 2026-04-13)
- 41 active sprint issues (15 To Do, 21 In Progress/QA, 5 Done)
- Issue types: Epic (4), Story (29), Bug (8)
- Assignees: Shaughn Le Grange, Bevan Hendricks, Jadon Hansen, juanv, Anton Geyer, ntsakon, erickv, Shak Matiwana, Paul Cook, Francois Raubenheimer

### Hero Section

- Badge: `Pet Heaven · Sprint Board`
- H1: "Sprint Board"
- Subtitle: "Active sprint pulled from Jira. Cards show live status — click any ticket to see full details."
- **Stats bar** (4 stat boxes): Active Issues / In Progress / Done / Assignees
- **Sprint Goal pill** (expandable): shows sprint name + goal text; click to expand full goal description

### Controls Bar

- **Search input** — filters tickets by summary text
- **Assignee filter** (`<select>`) — filter to a specific team member
- **Reset button** — clears search and assignee filter
- **Filter count** — shows number of items visible

### Section 1: Active Sprint — Kanban Board

A 3-column Kanban grid:
- **To Do** (blue, `#3b82f6`)
- **In Progress** (amber, `#f59e0b`)
- **Done** (green, `#10b981`)

Each issue card shows:
- Issue type icon (Epic / Story / Bug)
- Issue key (e.g. `FM-2550`) — links to Jira
- Summary text
- Assignee avatar + name
- Priority indicator
- Time tracking (if available)

**Sprint Insights button** — opens the Sprint Insights panel.

### Section 2: Product Backlog Table

Heading: "Up Next · Product Backlog"

Table columns:
1. `Type` — issue type icon
2. `Ticket` — issue key (links to Jira)
3. `Summary`
4. `Status` — coloured status badge
5. `Pri` — priority
6. `Assignee`

### Sprint Insights Panel

A slide-in panel showing sprint analytics:
- **Donut chart** — Done / In Progress / To Do percentages
- **Progress bar** — segmented by status
- **Assignee breakdown** — per-assignee bar chart showing done / in-progress / to-do counts
- **Legend:** Done (green) / In Progress (amber) / To Do (blue)
- Tally items: Done / In Progress / To Do

### Issue Detail Flyout

Clicking a card → right-side flyout showing:
- Issue key + link to Jira (`Open in Jira` button)
- Summary
- Status badge
- Type, Priority, Assignee (with avatar)
- Time tracking (spent / remaining)
- Description
- Subtasks table (if any): subtask key, summary, status dot, progress bar showing done count
- Epic drill-down (if the issue is an Epic): embedded 3-column Kanban for the epic's stories

---

## Page: Style Guide

**URLs:**
- Pet Heaven: `/style-guide/`
- Staging: `/staging/style-guide/`
- UCook: `/ucook/style-guide/`
- Faithful to Nature: `/faithful-to-nature/style-guide/`

**Purpose:** Complete brand/CI reference for the brand's design system.

### Navigation (sticky left/top nav)

Links: Colours | Typography | Buttons | Logo | Components | Layout | Quick Ref

### Sections

**01 — Colour System**
- Heading: "Colour Palette"
- Swatch groups: Primary brand colours, Secondary colours, Extended/accent colours, Restricted colours, Neutrals
- Each swatch card: colour block, hex code, colour name, usage description

Pet Heaven specific colours:
- `#57AB4E` PH Green — Primary CTA, headings, key UI elements
- `#FFDF40` PH Yellow — Highlights, badges, promotional elements
- `#3C8BB6` PH Blue — Links, info states, tertiary UI
- `#ED5454` PH Red — Error and alert states
- `#896643` PH Brown (additional colour)

**02 — Typography**
- Heading: "Font System — Bookmania + Poppins" (Pet Heaven uses Poppins as primary brand typeface, weights 400–800; Bookmania for display)
- UCook uses Gordita
- Shows specimen text at various weights

**03 — Buttons**
- Heading: "Button Variants"
- Shows all button styles: Primary, Secondary, Outline, Ghost, Danger, Disabled; with size variants

**04 — Logo**
- Heading: "Logo & Usage"
- Shows logo on light and dark backgrounds; spacing rules; do/don't usage examples

**05 — Components**
- Heading: "UI Components"
- Shows real rendered components from the live Magento site: forms, cards, navigation, etc.

**06 — Layout & Spacing**
- Heading: "Layout Rules"
- Grid, spacing tokens, container widths

**07 — Quick Reference**
- Heading: "Cheat Sheet"
- Condensed one-page summary of all tokens

---

## Data Architecture

### notion-data.js

**Path:** `/staging/notion-data.js` (shared across all brands via `../staging/notion-data.js`)
**Generated by:** `sync-notion.js`
**Last sync:** 2026-04-21T15:30:30Z
**Source:** Notion database "Road Map" (ID: `22d9af46-2129-4dcf-ab3a-1cb48e665965`)
**Total items:** 640

Each item has these fields:
```
id           — integer row ID
notionId     — Notion page UUID
name         — initiative name
company      — array of brand codes: ['PH'], ['UCOOK'], ['FTN'], ['All'], or multi-brand
theme        — strategic pillar (string)
pillar       — legacy/alternate pillar field
status       — 'live' | 'progress' | 'review' | 'planned' | 'done'
q            — quarter number
qLabel       — quarter label (e.g. 'Q1 FY27', '2025 and Prior')
r            — Reach score (0–10)
i            — Impact score (0–5)
c            — Confidence % (0–100)
e            — Effort score (1–5)
desc         — description text
notionUrl    — full Notion page URL
priority     — 'P1 🔥 Critical' | 'P2' | 'P3' | 'P4' | 'P5' | ''
lead         — Project lead name (string)
engineers    — array of engineer names
stagingUrl   — staging/prototype URL
archive      — boolean (archived items excluded from all views)
depDev       — true (Dev) | false (AI) | null (unknown)
```

**RICE formula:** `Math.round(r * i * (c/100) / e)` — returns 0 if any required field is missing.

**Company filter codes:**
- `PH` — Pet Heaven
- `UCOOK` — UCook
- `FTN` — Faithful to Nature
- `All` — Staging/cross-brand items (displayed in Staging workspace)
- `Skoon` — also present in database but no dedicated workspace

**Item counts (non-archived, as of last sync):**
- PH: 180 items
- UCOOK: 292 items
- FTN: 130 items
- Staging (All): 12 items

### jira-sprint-data.js

**Path:** `/jira-sprint-data.js` (root level, shared)
**Generated by:** `sync-jira.js`
**Last sync:** 2026-04-21T08:17:48Z
**Source:** Jira project `FM` at `silvertree-holdings-dev.atlassian.net`
**Structure:**
```
window.JIRA_SPRINT_DATA = {
  projects: {
    FM: {
      activeSprint: { id, name, state, goal, startDate, endDate },
      nextSprint: null
    }
  },
  issues: {
    active: [ ...issue objects ],
    backlog: [ ...issue objects ]
  }
}
```
Each issue: `id`, `key`, `summary`, `issuetype.name`, `status.name`, `status.category` (`new`/`indeterminate`/`done`), `priority.name`, `assignee.displayName`, `assignee.avatar`, `parent`, `subtasks`, `timetracking`, `description`, `url`, `project`

### project-briefs.js

**Path:** `/staging/project-briefs.js`
**Purpose:** Standalone rich brief content for specific initiatives — rendered inside flyouts when a matching brief exists.
**Structure:** `window.PROJECT_BRIEFS` — keyed by exact initiative name
**82 briefs** covering PH, UCook, and FTN initiatives.

Each brief object:
```
type: 'Quick Win' | 'Existing Roadmap' | 'Medium-term'
ai: boolean
summary: string
features: string[]  — bullet point list
links: { label, sub, href, icon }[]
```

### sync.js

**Path:** `/staging/sync.js` (shared across all pages)
**Purpose:** Provides the `triggerSync()` function and visual sync button behaviour.

On first call: prompts user for GitHub PAT (stored in `localStorage.gh_sync_pat`).
Then: POSTs to GitHub API to dispatch `sync-notion.yml` workflow:
```
POST https://api.github.com/repos/bevan-cloud/petheaven-prototype/actions/workflows/sync-notion.yml/dispatches
Authorization: token [stored PAT]
```
Shows toast notification on success/failure.

### notion-write.js

**Path:** `/staging/notion-write.js` (shared across all pages)
**Purpose:** Provides `window._nw` — a click-to-edit utility for inline editing fields and writing back to Notion.

**N8N Webhook:** `https://workflow.sih.services/webhook/product-workspace-notion-update`
**Payload:** `{ notionPageId: string, properties: Notion properties object }`
**Editable fields:** `status`, `theme` (Pillar), `qLabel` (Quarter), `priority`, `lead`, `depDev`, `r`, `i`, `c`, `e`

The `_nw` object exposes:
- `buildEditSpan(field, val, notionId)` — renders a clickable span that swaps to an input on click
- `buildRiceEditSpan(field, val, notionId)` — for flyout RICE cells
- `buildFlyoutProp(field, val, notionId, label)` — flyout property row with editable value
- `buildLeadInput(val, notionId)` — lead name field with hint text
- `notionPatch(notionId, properties)` — direct Notion patch call via N8N
- `showToast(message)` — bottom-centre floating toast

---

## Strategic Pillars

The same 7 strategic pillars are used across all brands:

| Pillar | Colour (bg / border / text) | Roadmap bar colour |
|---|---|---|
| Top Line Growth | `#e8f5e9` / `#C8EAC2` / `#1b5e20` | `#2e7d32` |
| Margin Improvements | `#fce4ec` / `#f48fb1` / `#880e4f` | `#c62828` |
| Cost Control & Cash Flow | `#ede7f6` / `#b39ddb` / `#4527a0` | `#4527a0` |
| People | `#fce4ec` / `#ef9a9a` / `#b71c1c` | `#b71c1c` |
| Internal Working Improvement | `#e8f1fc` / `#90bef5` / `#1a5fa8` | `#1a5fa8` |
| UX/UI | `#eef2ff` / `#c7d2fe` / `#3730a3` | `#3730a3` |
| Other | `#f5f5f5` / `#ddd` / `#555` | `#57AB4E` (brand) |

---

## Financial Year & Quarter Logic

The system works on a **March–February financial year** (FY27 = March 2026 – February 2027):

| Quarter | Months | Label |
|---|---|---|
| Q1 FY27 | March–May 2026 | `Q1 FY27` |
| Q2 FY27 | June–August 2026 | `Q2 FY27` |
| Q3 FY27 | September–November 2026 | `Q3 FY27` |
| Q4 FY27 | December 2026–February 2027 | `Q4 FY27` |

Items with `qLabel = '2025 and Prior'` are historical items completed before FY27. Items with no `qLabel` appear in the **Backlog** section.

The default filter on Projects and Prioritization pages auto-selects the current quarter (or the next quarter with data) on page load.

---

## Status Values

| Internal key | Display label | Usage |
|---|---|---|
| `live` | Live | Shipped and running in production |
| `progress` | In Progress | Actively in development |
| `review` | In Review | In QA or stakeholder review |
| `planned` | Planned | Scheduled but not started |
| `done` | Done | Completed (hidden by default unless filtered) |

Notion status mapping (from notion-write.js):
- `planned` → `3. Scheduled for Development`
- `progress` → `4. In progress`
- `review` → `5. QA`
- `live` → `Live`
- `done` → `10. Done`

---

## Priority Values

`P1 🔥 Critical` / `P2` / `P3` / `P4` / `P5`

Sort order: P1 (highest) → P5 (lowest) → blank (last)

---

## Matrix Quadrant Logic

Quadrant is computed from Impact (`i`) and Effort (`e`) values at runtime — it is **not stored** in Notion, only calculated:

```
Quick Win:  i >= 3 AND e < 3  → Do now
Big Bet:    i >= 3 AND e >= 3 → Plan & resource
Fill In:    i < 3  AND e < 3  → If capacity allows
Time Sink:  i < 3  AND e >= 3 → Deprioritise
```

(In the Projects page the threshold uses `i >= 1` and `e >= 3`; in the Prioritization matrix view the threshold uses `i >= 3` and `e >= 3`.)

---

## Repository Structure

```
petheaven-prototype/
├── index.html                    # Redirects to /home/
├── home/index.html               # Pet Heaven home/dashboard
├── projects/index.html           # Pet Heaven projects list
├── prioritization/index.html     # Pet Heaven prioritization
├── roadmap/index.html            # Pet Heaven roadmap
├── sprint-board/index.html       # Sprint board (FM project)
├── style-guide/index.html        # Pet Heaven CI/design system
├── ucook/
│   ├── home/index.html
│   ├── projects/index.html
│   ├── prioritization/index.html
│   ├── roadmap/index.html
│   ├── sprint-board/index.html
│   └── style-guide/index.html
├── faithful-to-nature/
│   ├── home/index.html
│   ├── projects/index.html
│   ├── prioritization/index.html
│   ├── roadmap/index.html
│   ├── sprint-board/index.html
│   └── style-guide/index.html
├── staging/
│   ├── home/index.html
│   ├── projects/index.html
│   ├── prioritization/index.html
│   ├── roadmap/index.html
│   ├── sprint-board/index.html
│   ├── style-guide/index.html
│   ├── notion-data.js            # Auto-generated from Notion (640 items)
│   ├── notion-write.js           # Inline editing + N8N write-back
│   ├── sync.js                   # GitHub Actions sync trigger
│   └── project-briefs.js         # Rich brief content (82 briefs)
├── jira-sprint-data.js           # Auto-generated from Jira FM project
├── sync-notion.js                # Notion sync script (run by GitHub Actions)
├── sync-jira.js                  # Jira sync script (run by GitHub Actions)
├── sub-cart-split/               # PH S&S PDP prototype
├── pdp-v2/                       # PH PDP v2 prototype
├── clp/                          # PH CLP prototype
└── .github/workflows/
    ├── sync-notion.yml           # Triggered by sync button
    └── sync-jira.yml             # Triggered on schedule or manually
```

---

## Design System (Workspace UI)

**Typography:**
- Body: `DM Sans` (400, 500, 600, 700) — loaded from Google Fonts
- Display headings: `DM Serif Display` — loaded from Google Fonts

**CSS Variables (workspace-level, not brand-specific):**
```css
--brand: [brand primary]
--brand-dark: [brand dark]
--brand-light: [lightest tint]
--brand-mid: [mid tint]
--black: #1a1a1a
--gray-1: #f7f7f5   /* page background */
--gray-2: #efefec   /* card borders */
--gray-3: #d0d0c8   /* dividers */
--gray-4: #9a9a94   /* placeholder text */
--gray-5: #5a5a54   /* secondary text */
--white: #ffffff
--radius: 6px
--radius-lg: 10px
--radius-xl: 16px
```

**Layout:**
- Max-width container: `1240px`
- Page padding: `64px 40px 100px` (24px 16px on mobile)
- Header height: `64px`

---

## Common Interactive Patterns

### Click-to-Edit Fields (notion-write.js)
All editable fields (Status, Pillar, Quarter, Priority, Lead, R, I, C, E) follow the same pattern:
1. Field renders as a styled display element (badge, tag, or text)
2. On hover: subtle underline appears
3. On click: element swaps to an `<input>` or `<select>`
4. On change/blur/Enter: value is sent to N8N webhook → Notion is updated → success toast shown
5. On Esc: edit is cancelled

### Flyout Panels
- Triggered by clicking any initiative card or table row
- Slides in from the right (480px wide; full-width bottom sheet on mobile)
- Overlay darkens background; clicking overlay or pressing Escape closes it
- Body is scrollable; header/close button is fixed

### Filter Chips
- Appear in the controls bar when a filter is active
- Each chip shows: filter type label + `<select>` for the value + × remove button
- Sort chip additionally shows direction arrow button

### Drag-and-Drop
- Available on: Kanban view (Prioritization), Kanban view (Roadmap), Quarter Drill-Down kanban
- Dragging a card to a new column fires a Notion patch to update `status` or `qLabel`
- Visual: dragged card reduces opacity; drop target column highlights

### Toast Notifications
- Bottom-centre floating pill (`#1a1a1a` background, white text)
- Shows on: successful Notion save (`✓ Saved to Notion`), N8N errors, sync complete/fail

---

## Prototype Pages

Additional sub-pages exist as standalone prototypes linked from project briefs:

- `/sub-cart-split/` — S&S PDP split purchase cards prototype
- `/pdp-v2/` — Pet Heaven PDP v2
- `/clp/` — Category Landing Page prototype

---

## Key External Integrations

| Integration | Purpose | Mechanism |
|---|---|---|
| **Notion** (silvertree.notion.site) | Source of truth for all roadmap data | Sync via `sync-notion.js` → GitHub Actions → `notion-data.js` |
| **Notion write-back** | Inline field editing | N8N webhook → Notion API |
| **Jira** (silvertree-holdings-dev.atlassian.net) | Sprint board data | Sync via `sync-jira.js` → GitHub Actions → `jira-sprint-data.js` |
| **GitHub Actions** | Runs sync scripts on demand or schedule | Triggered by sync button (workflow_dispatch) |
| **N8N** (workflow.sih.services) | Middleware for Notion writes | `POST /webhook/product-workspace-notion-update` |
| **Notion form** | "Add Project Request" embedded form | iframe embed of Notion page `1b56bd1cdd3480e49398c9ded6684010` |
