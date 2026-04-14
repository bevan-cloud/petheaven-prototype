#!/usr/bin/env node
// inject-projects.js
// Creates Pet Heaven (63) and UCook (19) projects in the Notion Road Map DB.
// PH projects → Quarter: Q1 FY27
// UCook projects → Quarter: Q1–Q4 FY27 per their roadmap assignments
// Run: node inject-projects.js
// Then: node sync-notion.js   (to refresh staging/notion-data.js)

const DB_ID = '22d9af46-2129-4dcf-ab3a-1cb48e665965';

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
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ─── Step 1: add FY27 quarter options ────────────────────────────────────────
async function addFY27Quarters() {
  console.log('Adding Q1–Q4 FY27 quarter options to Notion schema…');
  const res = await fetch(`https://api.notion.com/v1/databases/${DB_ID}`, {
    method: 'PATCH',
    headers: HEADERS,
    body: JSON.stringify({
      properties: {
        Quarter: {
          select: {
            options: [
              { name: '2025 and Prior', color: 'gray'   },
              { name: 'Q1 2026',        color: 'blue'   },
              { name: 'Q2 2026',        color: 'green'  },
              { name: 'Q3 2026',        color: 'yellow' },
              { name: 'Q4 2026',        color: 'orange' },
              { name: 'Q1 FY27',        color: 'blue'   },
              { name: 'Q2 FY27',        color: 'green'  },
              { name: 'Q3 FY27',        color: 'yellow' },
              { name: 'Q4 FY27',        color: 'orange' },
            ],
          },
        },
      },
    }),
  });
  if (!res.ok) throw new Error(`Schema update failed: ${res.status} ${await res.text()}`);
  console.log('  Done.');
}

// ─── Step 2: create a single Notion page ─────────────────────────────────────
async function createPage(d) {
  const props = {
    'Project':  { title: [{ text: { content: d.name } }] },
    'Company':  { multi_select: d.company.map(c => ({ name: c })) },
    'Quarter':  { select: { name: d.quarter } },
    'Status':   { status: { name: d.status } },
  };
  if (d.pillar)    props['Strategic Pillar'] = { select:    { name: d.pillar } };
  if (d.priority)  props['Priority']         = { select:    { name: d.priority } };
  if (d.r  != null) props['Reach']           = { number: d.r };
  if (d.i  != null) props['Impact']          = { number: d.i };
  if (d.c  != null) props['Confidence']      = { number: d.c }; // stored as %
  if (d.e  != null) props['Effort']          = { number: d.e };
  if (d.mi != null) props['Matrix Impact']   = { number: d.mi };
  if (d.me != null) props['Matrix Effort']   = { number: d.me };
  if (d.desc)       props['Description']     = { rich_text: [{ text: { content: d.desc.slice(0, 2000) } }] };

  const res = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({ parent: { database_id: DB_ID }, properties: props }),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Failed to create "${d.name}": ${res.status} ${txt}`);
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
// c in prototype is 1-5 scale; Notion stores as % → multiply by 20
function pct(c) { return c != null ? c * 20 : null; }

// Map prototype notionImpact → Notion priority
function pri(notionImpact) {
  if (notionImpact === 'High')   return 'P1 🔥 Critical';
  if (notionImpact === 'Medium') return 'P2';
  if (notionImpact === 'Low')    return 'P3';
  return null;
}

// Map prototype PH theme group → Notion Strategic Pillar
function phPillar(theme, bucket) {
  if (theme === 'Subscription Growth & Retention') return 'Top Line Growth';
  if (theme === 'Personalisation & Intelligence')  return 'Top Line Growth';
  if (theme === 'Catalogue & Merchandising')       return 'Top Line Growth';
  if (theme === 'Site Experience & Growth')        return 'UX/UI';
  if (theme === 'Ecosystem & Services Expansion')  return 'Top Line Growth';
  // unassigned — use bucket as fallback
  if (bucket === 'Process') return 'Internal Working Improvement';
  return 'Top Line Growth'; // brainstorming / growth ideas default
}

// Map UCook themeLabel → Notion Strategic Pillar
function ucPillar(themeLabel) {
  if (themeLabel === 'Process Optimization')  return 'Internal Working Improvement';
  if (themeLabel === 'Web/App Enhancement')   return 'UX/UI';
  if (themeLabel === 'Ecommerce Growth')      return 'Top Line Growth';
  if (themeLabel === 'Tech Infrastructure')   return 'Internal Working Improvement';
  if (themeLabel === 'Retail Growth')         return 'Top Line Growth';
  if (themeLabel === 'Data & Insights')       return 'Internal Working Improvement';
  return 'Other';
}

// Map prototype status → Notion status name
function phStatus(type, bucket) {
  if (bucket === 'BRAINSTORMING') return '0. Conceptual Idea';
  if (type === 'Medium-term')     return '0.1 Concept Validation';
  return '3. Scheduled for Development';
}
function ucStatus(status) {
  if (status === 'live')       return 'Live';
  if (status === 'inprogress') return '4. In progress';
  if (status === 'blocked')    return '6. On Hold / Pending Feedback';
  return '3. Scheduled for Development';
}

// UCook quarter label
function ucQ(q) { return `Q${q} FY27`; }

// Priority from RICE impact for UCook (no notionImpact field)
function ucPri(i) {
  if (i >= 5) return 'P1 🔥 Critical';
  if (i >= 4) return 'P2';
  if (i >= 3) return 'P3';
  return 'P4';
}

// ─── PET HEAVEN PROJECTS (63) — all tagged Q1 FY27 ───────────────────────────
const PH_RAW = [
  // SUBSCRIPTION GROWTH & RETENTION
  {id:1,  name:"S&S PDP",                                   theme:"Subscription Growth & Retention", type:"Existing Roadmap", bucket:"Growth & Experience", notionImpact:"High",   desc:"Schedule & Save product detail page improvements", r:7, i:4, c:4, e:2, mi:4, me:2},
  {id:2,  name:"Enhance Subscription Experience",           theme:"Subscription Growth & Retention", type:"Existing Roadmap", bucket:"Growth & Experience", notionImpact:"High",   desc:"", r:6, i:4, c:3, e:4, mi:4, me:4},
  {id:3,  name:"RC Full Brand Coupon Integration",          theme:"Subscription Growth & Retention", type:"Existing Roadmap", bucket:"Growth & Experience", notionImpact:"Medium", desc:"", r:5, i:2, c:3, e:2, mi:2, me:2},
  {id:4,  name:"Subscription Swops",                       theme:"Subscription Growth & Retention", type:"Existing Roadmap", bucket:"Growth & Experience", notionImpact:"Medium", desc:"Allow easy product swaps within subscriptions", r:6, i:3, c:3, e:3, mi:3, me:3},
  {id:5,  name:"Rewarding Subs",                           theme:"Subscription Growth & Retention", type:"Existing Roadmap", bucket:"Growth & Experience", notionImpact:"Medium", desc:"", r:6, i:3, c:3, e:3, mi:3, me:3},
  {id:6,  name:"Subscriptions 2.0",                        theme:"Subscription Growth & Retention", type:"Existing Roadmap", bucket:"Growth & Experience", notionImpact:"High",   desc:"Full subscription platform overhaul", r:7, i:5, c:3, e:5, mi:5, me:5},
  {id:7,  name:"Personalised Upsells on Subs",             theme:"Subscription Growth & Retention", type:"Existing Roadmap", bucket:"Growth & Experience", notionImpact:"High",   desc:"", r:6, i:4, c:3, e:3, mi:4, me:3},
  {id:8,  name:"AI Diet Calculator + Frequency Wizard",    theme:"Subscription Growth & Retention", type:"Quick Win",        bucket:"Growth & Experience", notionImpact:"High",   desc:"Pet weight/breed → recommended bag size + auto-set delivery frequency on subscription PDP", r:5, i:4, c:3, e:2, mi:4, me:2},
  {id:9,  name:"Preemptive Sub Failures",                  theme:"Subscription Growth & Retention", type:"Existing Roadmap", bucket:"Growth & Experience", notionImpact:"High",   desc:"Proactively identify and prevent subscription payment failures", r:6, i:5, c:3, e:2, mi:5, me:2},
  // PERSONALISATION & INTELLIGENCE
  {id:10, name:"PostHog App Analytics",                    theme:"Personalisation & Intelligence",  type:"Quick Win",        bucket:"Process",             notionImpact:"High",   desc:"Implement PostHog for app analytics — currently zero visibility on in-app behaviour", r:6, i:4, c:5, e:1, mi:4, me:1},
  {id:11, name:"Pet Life Cycle Journey",                   theme:"Personalisation & Intelligence",  type:"Existing Roadmap", bucket:"Growth & Experience", notionImpact:"High",   desc:"", r:6, i:4, c:3, e:5, mi:4, me:5},
  {id:12, name:"Maze User Research",                       theme:"Personalisation & Intelligence",  type:"Existing Roadmap", bucket:"Process",             notionImpact:"Medium", desc:"User research and testing tool for UX validation", r:3, i:3, c:4, e:1, mi:3, me:1},
  {id:13, name:"Food Calculator",                          theme:"Personalisation & Intelligence",  type:"Existing Roadmap", bucket:"Growth & Experience", notionImpact:"High",   desc:"Diet and portion calculator for pet food", r:6, i:4, c:3, e:3, mi:4, me:3},
  {id:14, name:"Calculate Likely Pets",                    theme:"Personalisation & Intelligence",  type:"Existing Roadmap", bucket:"Growth & Experience", notionImpact:"Medium", desc:"Predict pet type/breed from purchase behaviour", r:5, i:3, c:3, e:3, mi:3, me:3},
  {id:15, name:"Personalised Recommendations",             theme:"Personalisation & Intelligence",  type:"Existing Roadmap", bucket:"Growth & Experience", notionImpact:"High",   desc:"", r:8, i:4, c:3, e:4, mi:4, me:4},
  {id:16, name:"Cross Sell Recommendation",               theme:"Personalisation & Intelligence",  type:"Existing Roadmap", bucket:"Growth & Experience", notionImpact:"High",   desc:"", r:7, i:4, c:3, e:3, mi:4, me:3},
  {id:17, name:"PostHog Web Analytics",                   theme:"Personalisation & Intelligence",  type:"Existing Roadmap", bucket:"Process",             notionImpact:"High",   desc:"Implement PostHog for web analytics", r:6, i:4, c:5, e:2, mi:4, me:2},
  // CATALOGUE & MERCHANDISING
  {id:18, name:"Mobile First Design",                      theme:"Catalogue & Merchandising",       type:"Existing Roadmap", bucket:"Growth & Experience", notionImpact:"High",   desc:"", r:9, i:4, c:4, e:5, mi:4, me:5},
  {id:19, name:"Product Cards Revamp",                     theme:"Catalogue & Merchandising",       type:"Existing Roadmap", bucket:"Growth & Experience", notionImpact:"High",   desc:"", r:8, i:4, c:4, e:3, mi:4, me:3},
  {id:20, name:"Enhanced Product Reviews",                 theme:"Catalogue & Merchandising",       type:"Existing Roadmap", bucket:"Growth & Experience", notionImpact:"Medium", desc:"", r:7, i:3, c:4, e:3, mi:3, me:3},
  {id:21, name:"M1 Category Restructure",                  theme:"Catalogue & Merchandising",       type:"Existing Roadmap", bucket:"Growth & Experience", notionImpact:"High",   desc:"", r:7, i:4, c:3, e:5, mi:4, me:5},
  {id:22, name:"Bundle Product Styling",                   theme:"Catalogue & Merchandising",       type:"Existing Roadmap", bucket:"Growth & Experience", notionImpact:"Low",    desc:"", r:4, i:1, c:3, e:2, mi:1, me:2},
  {id:23, name:"Merchandising Real Estate",                theme:"Catalogue & Merchandising",       type:"Existing Roadmap", bucket:"Growth & Experience", notionImpact:"Medium", desc:"Better use of homepage and category page merchandising space", r:7, i:3, c:4, e:3, mi:3, me:3},
  {id:24, name:"Brand Page Revamp",                        theme:"Catalogue & Merchandising",       type:"Existing Roadmap", bucket:"Growth & Experience", notionImpact:"Medium", desc:"", r:5, i:2, c:3, e:3, mi:2, me:3},
  {id:25, name:"M1 Attribute Restructure",                 theme:"Catalogue & Merchandising",       type:"Existing Roadmap", bucket:"Process",             notionImpact:"Medium", desc:"", r:5, i:3, c:3, e:4, mi:3, me:4},
  {id:26, name:"Aptivate Add to Cart Videos",              theme:"Catalogue & Merchandising",       type:"Existing Roadmap", bucket:"Growth & Experience", notionImpact:"Medium", desc:"", r:6, i:2, c:3, e:2, mi:2, me:2},
  // SITE EXPERIENCE & GROWTH
  {id:27, name:"Homepage Refresh",                         theme:"Site Experience & Growth",        type:"Existing Roadmap", bucket:"Growth & Experience", notionImpact:"High",   desc:"", r:9, i:4, c:4, e:4, mi:4, me:4},
  {id:28, name:"M2 Migration",                             theme:"Site Experience & Growth",        type:"Existing Roadmap", bucket:"Process",             notionImpact:"High",   desc:"Magento 2 platform migration", r:7, i:5, c:4, e:5, mi:5, me:5},
  {id:29, name:"Deals Page Structure",                     theme:"Site Experience & Growth",        type:"Quick Win",        bucket:"Growth & Experience", notionImpact:"Medium", desc:"Add species filtering, countdown timers on flash sales, urgency mechanics, clear deal hierarchy", r:7, i:3, c:4, e:2, mi:3, me:2},
  {id:30, name:"New Pet Parents Page Redesign",            theme:"Site Experience & Growth",        type:"Quick Win",        bucket:"Growth & Experience", notionImpact:"High",   desc:"Replace 9-coupon wall with guided journey: Welcome → Meet your pet → What you need → Set up delivery", r:6, i:4, c:4, e:2, mi:4, me:2},
  {id:31, name:"Personalised Deals Page",                  theme:"Site Experience & Growth",        type:"Quick Win",        bucket:"Growth & Experience", notionImpact:"High",   desc:"Filter deals by pet profile for logged-in users — \"Deals for Harvey\" not generic \"Pet Heaven Deals\"", r:7, i:4, c:3, e:2, mi:4, me:2},
  {id:32, name:"Mobile Audit & Quick Fixes",               theme:"Site Experience & Growth",        type:"Quick Win",        bucket:"Growth & Experience", notionImpact:"High",   desc:"Fix critical mobile UX on top 10 traffic pages — tap targets, font sizes, checkout flow", r:9, i:4, c:5, e:2, mi:4, me:2},
  {id:33, name:"Google CPC Brand Term Review",             theme:"Site Experience & Growth",        type:"Quick Win",        bucket:"Process",             notionImpact:"High",   desc:"If SEO rank #1 for \"Pet Heaven\", reduce/pause brand keyword bids and measure organic impact", r:5, i:4, c:4, e:1, mi:4, me:1},
  {id:34, name:"Edgars Integration",                       theme:"Site Experience & Growth",        type:"Existing Roadmap", bucket:"Growth & Experience", notionImpact:"Medium", desc:"", r:4, i:3, c:2, e:4, mi:3, me:4},
  {id:35, name:"Gift Cards",                               theme:"Site Experience & Growth",        type:"Existing Roadmap", bucket:"Growth & Experience", notionImpact:"Medium", desc:"", r:5, i:2, c:3, e:3, mi:2, me:3},
  {id:36, name:"Agentic Commerce",                         theme:"Site Experience & Growth",        type:"Existing Roadmap", bucket:"Growth & Experience", notionImpact:"High",   desc:"AI-powered commerce experiences", r:6, i:4, c:2, e:5, mi:4, me:5},
  // ECOSYSTEM & SERVICES EXPANSION
  {id:37, name:"Loyalty Driven through Suppliers",         theme:"Ecosystem & Services Expansion",  type:"Existing Roadmap", bucket:"Growth & Experience", notionImpact:"High",   desc:"", r:6, i:4, c:3, e:5, mi:4, me:5},
  {id:38, name:"Insurance Integration",                    theme:"Ecosystem & Services Expansion",  type:"Existing Roadmap", bucket:"Growth & Experience", notionImpact:"Medium", desc:"", r:4, i:2, c:2, e:4, mi:2, me:4},
  {id:39, name:"Pet Services",                             theme:"Ecosystem & Services Expansion",  type:"Existing Roadmap", bucket:"Growth & Experience", notionImpact:"High",   desc:"", r:5, i:4, c:2, e:5, mi:4, me:5},
  {id:40, name:"Zumvet Integration",                       theme:"Ecosystem & Services Expansion",  type:"Existing Roadmap", bucket:"Growth & Experience", notionImpact:"Medium", desc:"Vet consultation integration", r:4, i:3, c:3, e:3, mi:3, me:3},
  {id:41, name:"3DSv2 Payment Security",                   theme:"Ecosystem & Services Expansion",  type:"Existing Roadmap", bucket:"Process",             notionImpact:"High",   desc:"3D Secure 2 payment security upgrade", r:6, i:5, c:4, e:2, mi:5, me:2},
  {id:42, name:"Vet Acquisition / Partnership",            theme:"Ecosystem & Services Expansion",  type:"Existing Roadmap", bucket:"Growth & Experience", notionImpact:"Medium", desc:"", r:4, i:3, c:2, e:4, mi:3, me:4},
  // BRAINSTORMING / UNASSIGNED
  {id:43, name:"Pet Birthday / Life Stage Discounts",      theme:"—", type:"Medium-term", bucket:"BRAINSTORMING", notionImpact:"High",   desc:"AI-triggered discounts based on pet age, birthday, and life stage transitions", r:6, i:4, c:2, e:3, mi:4, me:3},
  {id:44, name:"Subscribe & Save Savings Ticker",          theme:"—", type:"Quick Win",   bucket:"Growth & Experience", notionImpact:"High", desc:"Real-time annual savings shown on S&S toggle based on pet consumption rate", r:6, i:4, c:3, e:2, mi:4, me:2},
  {id:45, name:"Puppy Life Stage Journey",                 theme:"—", type:"Medium-term", bucket:"Growth & Experience", notionImpact:"High", desc:"Auto puppy→adult journey from registration: food, treats, training, vet reminders at each stage", r:5, i:5, c:3, e:4, mi:5, me:4},
  {id:46, name:"OOS Subscription Swap Email",             theme:"—", type:"Quick Win",   bucket:"Growth & Experience", notionImpact:"High", desc:"Auto-trigger email when subscribed product goes OOS with AI-matched alternatives from pet profile", r:5, i:4, c:4, e:2, mi:4, me:2},
  {id:47, name:"AI Personalised Homepage",                 theme:"—", type:"Medium-term", bucket:"BRAINSTORMING", notionImpact:"High",   desc:"Breed-specific homepage for logged-in users powered by pet profile + purchase history", r:7, i:4, c:2, e:4, mi:4, me:4},
  {id:48, name:"AI Cross-sell Strip (Breed-based)",        theme:"—", type:"Quick Win",   bucket:"Growth & Experience", notionImpact:"High", desc:"Breed-specific cross-sell on PDP and cart — not generic \"you may also like\"", r:7, i:4, c:3, e:2, mi:4, me:2},
  {id:49, name:"Pet Profile tied to Sign-up",              theme:"—", type:"Quick Win",   bucket:"Growth & Experience", notionImpact:"High", desc:"Profile creation as step 2 of account registration — not buried in account menu", r:6, i:4, c:4, e:2, mi:4, me:2},
  {id:50, name:"WhatsApp UTM Tracking",                    theme:"—", type:"Quick Win",   bucket:"Process",             notionImpact:"Medium", desc:"Add UTM parameters to all WhatsApp links + webhook tracking for analytics visibility", r:4, i:3, c:5, e:1, mi:3, me:1},
  {id:51, name:"AI Personalised Email Subject Lines",      theme:"—", type:"Quick Win",   bucket:"BRAINSTORMING", notionImpact:"Medium", desc:"Pet name + trigger-based subject lines with personalised send time per customer", r:6, i:3, c:3, e:2, mi:3, me:2},
  {id:52, name:"AI Pet Advisor Widget",                    theme:"—", type:"Quick Win",   bucket:"Growth & Experience", notionImpact:"High", desc:"\"Ask a pet question\" widget on PDPs and New Pet Parents page — positions PH as the knowledgeable brand", r:7, i:4, c:3, e:2, mi:4, me:2},
  {id:53, name:"Rescue & Adoption Charity Partnerships",   theme:"—", type:"Medium-term", bucket:"Growth & Experience", notionImpact:"High", desc:"SPCA/Dogtown SA starter subscription pack at adoption moment — highest emotional engagement point", r:4, i:4, c:3, e:3, mi:4, me:3},
  {id:54, name:"Health & Wellness Top Nav",                theme:"—", type:"Quick Win",   bucket:"Growth & Experience", notionImpact:"High", desc:"Add H&W as permanent top-level nav item — currently missing from homepage navigation", r:8, i:3, c:5, e:1, mi:3, me:1},
  {id:55, name:"Competitive Price Scraper",                theme:"—", type:"Quick Win",   bucket:"Process",             notionImpact:"High", desc:"Monitor top 50 SKUs vs Takealot + Absolute Pets weekly, flag where PH is >10% above market", r:3, i:4, c:4, e:2, mi:4, me:2},
  {id:56, name:"Subs Failure Report by SKU",               theme:"—", type:"Quick Win",   bucket:"BRAINSTORMING", notionImpact:"High", desc:"Live report of subscription failures per SKU, grouped by supplier by revenue lost", r:3, i:5, c:4, e:2, mi:5, me:2},
  {id:57, name:"AI Pet Question Widget (PDPs)",            theme:"—", type:"Quick Win",   bucket:"BRAINSTORMING", notionImpact:"High", desc:"Brand education widget: \"Ask a pet question\" surfaced on PDPs and the New Pet Parents page", r:7, i:4, c:3, e:2, mi:4, me:2},
  {id:58, name:"Health & Wellness — Discoverability",      theme:"—", type:"Quick Win",   bucket:"BRAINSTORMING", notionImpact:"High", desc:"Health & Wellness is buried and hard to discover — needs surfacing in navigation and on-site", r:8, i:3, c:5, e:1, mi:3, me:1},
  {id:59, name:"FTN M2 Analytics",                        theme:"—", type:"—", bucket:"—", notionImpact:null, desc:"Analytics implementation for the FTN Magento 2 platform", r:null, i:null, c:null, e:null, mi:3, me:3},
  {id:60, name:"My Shop for PH",                          theme:"—", type:"Quick Win", bucket:"Growth & Experience", notionImpact:null, desc:"", r:null, i:null, c:null, e:null, mi:3, me:3},
  {id:61, name:"Solution Based Categories",               theme:"—", type:"Quick Win", bucket:"Growth & Experience", notionImpact:null, desc:"", r:null, i:null, c:null, e:null, mi:3, me:2},
  {id:62, name:"Start Using PostHog Features",            theme:"—", type:"Quick Win", bucket:"Process", notionImpact:null, desc:"", r:null, i:null, c:null, e:null, mi:4, me:1},
  {id:63, name:"Pet Profile Data Strategy",               theme:"—", type:"Quick Win", bucket:"BRAINSTORMING", notionImpact:null, desc:"What are we doing with pet profile data? Can we do more?", r:null, i:null, c:null, e:null, mi:3, me:2},
];

const PH_PROJECTS = PH_RAW.map(p => ({
  name:     p.name,
  company:  ['PH'],
  quarter:  'Q1 FY27',
  status:   phStatus(p.type, p.bucket),
  pillar:   phPillar(p.theme, p.bucket),
  priority: pri(p.notionImpact),
  r:        p.r,
  i:        p.i,
  c:        p.c != null ? pct(p.c) : null,
  e:        p.e,
  mi:       p.mi,
  me:       p.me,
  desc:     p.desc,
}));

// ─── UCOOK PROJECTS (19) — quarters from roadmap assignments ─────────────────
const UC_RAW = [
  // Q1
  {q:1, name:"Recipe Card Proofreading",        theme:"Process Optimization", status:"live",       desc:"Quality check and correction of all recipe card copy and imagery before delivery — improves unboxing experience and brand trust.", r:8, i:3, c:5, e:1, mi:4, me:1},
  {q:1, name:"Acumatica Refactor",              theme:"Process Optimization", status:null,         desc:"Refactor the Acumatica ERP integration for improved reliability, maintainability, and reduced sync errors between systems.", r:4, i:4, c:3, e:4, mi:2, me:4},
  {q:1, name:"Customer Journey — Key Project",  theme:"Web/App Enhancement",  status:null,         desc:"Define scope, requirements, user flow mapping, and architecture for the end-to-end customer journey redesign. Development begins Q2.", r:9, i:5, c:4, e:2, mi:5, me:5},
  {q:1, name:"Yoyo — WiCodes",                 theme:"Ecommerce Growth",     status:"live",       desc:"Integrate Yoyo WiCodes for in-store and online loyalty payment functionality across checkout.", r:6, i:3, c:5, e:2, mi:3, me:4},
  {q:1, name:"Yoyo — Gift Voucher Replacement", theme:"Ecommerce Growth",     status:null,         desc:"Replace legacy gift vouchers with Yoyo-powered wrapped vouchers for improved flexibility, tracking, and redemption UX.", r:5, i:3, c:4, e:3, mi:2, me:3},
  {q:1, name:"WhatsApp Payment Links",          theme:"Ecommerce Growth",     status:null,         desc:"Enable payment links via WhatsApp for CRM-driven checkout — reduces cart abandonment from conversational sales channels.", r:7, i:4, c:4, e:2, mi:4, me:2},
  {q:1, name:"Capacitor iOS App",               theme:"Tech Infrastructure",  status:"live",       desc:"iOS app built with Capacitor — live on App Store with improved mobile experience, push notifications, and deeper engagement.", r:8, i:4, c:5, e:3, mi:4, me:4},
  {q:1, name:"Admin & PWA Upgrades",            theme:"Tech Infrastructure",  status:"inprogress", desc:"Upgrade admin panel and PWA — improved performance, dependency management, and developer tooling.", r:6, i:4, c:4, e:4, mi:2, me:3},
  {q:1, name:"Mono Repo Architecture",          theme:"Tech Infrastructure",  status:null,         desc:"Migrate to monorepo structure for unified dependency management, shared tooling, and faster cross-service development cycles.", r:4, i:5, c:3, e:4, mi:2, me:4},
  // Q2
  {q:2, name:"Recipe Management Portal",        theme:"Process Optimization", status:null,         desc:"Internal portal for the culinary team to manage, edit, and approve recipe cards — eliminating manual handoffs and reducing errors.", r:6, i:4, c:4, e:3, mi:4, me:4},
  {q:2, name:"CS Billing Tasks Efficiencies",   theme:"Process Optimization", status:null,         desc:"Streamline customer service billing workflows to reduce manual tasks, resolution time, and escalation rates.", r:5, i:3, c:4, e:2, mi:3, me:2},
  {q:2, name:"Discounts Refinements",           theme:"Ecommerce Growth",     status:null,         desc:"Improve discount engine flexibility — better rule stacking, CS override tools, improved promotion management.", r:7, i:3, c:4, e:2, mi:3, me:2},
  {q:2, name:"Yoyo — Loyalty Pro Integration",  theme:"Retail Growth",        status:null,         desc:"Full Yoyo Loyalty Pro integration for points earning, redemption, and tier management across retail and online channels.", r:6, i:4, c:3, e:3, mi:4, me:4},
  {q:2, name:"Order Attribution",               theme:"Data & Insights",      status:null,         desc:"Implement multi-touch order attribution modelling to correctly credit marketing channels and inform media spend decisions.", r:6, i:5, c:3, e:3, mi:5, me:3},
  // Q3
  {q:3, name:"Loop Implementation",             theme:"Process Optimization", status:null,         desc:"Implement Loop for returns and exchanges — reduces CS manual processing and improves customer self-serve resolution.", r:5, i:4, c:3, e:3, mi:2, me:3},
  {q:3, name:"Capacitor iOS App — Phase 2",     theme:"Tech Infrastructure",  status:"blocked",    desc:"Phase 2 of the iOS app — deep-linked notifications, improved offline support, and App Clips integration.", r:7, i:4, c:2, e:3, mi:4, me:3},
  {q:3, name:"Postgres Upgrade",                theme:"Tech Infrastructure",  status:null,         desc:"Upgrade to latest PostgreSQL version for improved security, performance, and access to newer database features.", r:4, i:5, c:4, e:3, mi:3, me:4},
  // Q4
  {q:4, name:"Logistics Overhaul",              theme:"Process Optimization", status:null,         desc:"End-to-end review and restructure of logistics and delivery operations — addressing delivery time variability and supplier bottlenecks.", r:7, i:5, c:3, e:4, mi:5, me:5},
  {q:4, name:"Migration to Cluster",            theme:"Tech Infrastructure",  status:null,         desc:"Infrastructure migration to cluster-based architecture for improved reliability, horizontal scalability, and reduced deployment risk.", r:5, i:5, c:3, e:4, mi:4, me:5},
];

const UCOOK_PROJECTS = UC_RAW.map(p => ({
  name:     p.name,
  company:  ['UCOOK'],
  quarter:  ucQ(p.q),
  status:   ucStatus(p.status),
  pillar:   ucPillar(p.theme),
  priority: ucPri(p.i),
  r:        p.r,
  i:        p.i,
  c:        p.c != null ? pct(p.c) : null,
  e:        p.e,
  mi:       p.mi,
  me:       p.me,
  desc:     p.desc,
}));

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  await addFY27Quarters();

  // PH
  console.log(`\nCreating ${PH_PROJECTS.length} Pet Heaven projects…`);
  let done = 0, failed = 0;
  for (const p of PH_PROJECTS) {
    try {
      await createPage(p);
      done++;
    } catch (e) {
      console.warn(`  WARN: ${e.message}`);
      failed++;
    }
    await sleep(400);
    if (done % 10 === 0) process.stdout.write(`  ${done}/${PH_PROJECTS.length}…\n`);
  }
  console.log(`  PH done: ${done} created, ${failed} failed.`);

  // UCook
  done = 0; failed = 0;
  console.log(`\nCreating ${UCOOK_PROJECTS.length} UCook projects…`);
  for (const p of UCOOK_PROJECTS) {
    try {
      await createPage(p);
      done++;
    } catch (e) {
      console.warn(`  WARN: ${e.message}`);
      failed++;
    }
    await sleep(400);
    if (done % 10 === 0) process.stdout.write(`  ${done}/${UCOOK_PROJECTS.length}…\n`);
  }
  console.log(`  UCook done: ${done} created, ${failed} failed.`);

  console.log('\nAll done. Now run:');
  console.log('  node sync-notion.js');
  console.log('  git add staging/notion-data.js && git push');
}

main().catch(err => { console.error(err.message); process.exit(1); });
