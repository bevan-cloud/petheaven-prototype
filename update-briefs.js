#!/usr/bin/env node
// update-briefs.js
// Sets the 'Refernce' URL field on all 82 FY27 items in Notion to the staging roadmap URL.
// Also backfills Description for items that still have empty/very-short text.
// Run: node update-briefs.js
// Then: node sync-notion.js  (to pull stagingUrl into notion-data.js)

const STAGING_URL = 'https://bevan-cloud.github.io/petheaven-prototype/staging/roadmap/';

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
const HEADERS = {
  'Authorization': `Bearer ${TOKEN}`,
  'Notion-Version': '2022-06-28',
  'Content-Type': 'application/json',
};
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ─── Summaries for items that have no/very-short desc in Notion ──────────────
// (Items that were injected with desc:'' or desc shorter than 25 chars)
const SUMMARIES = {
  'Enhance Subscription Experience':    'Improve the end-to-end post-purchase subscription experience with full self-serve controls — pause, skip, swap, and frequency management — reducing churn caused by inflexibility in the current subscription dashboard.',
  'RC Full Brand Coupon Integration':   'Integrate Royal Canin and other brand-funded coupons natively into subscription checkout and ongoing management flows, replacing manual out-of-band redemption with a seamless coupon lifecycle inside the platform.',
  'Rewarding Subs':                     'Launch a subscription-exclusive rewards programme — cashback, early product access, and loyalty tiers — that incentivises long-term subscription retention and increases subscriber lifetime value.',
  'Personalised Upsells on Subs':       'Surface personalised add-on product recommendations to subscribers at high-intent moments (confirmation, skip, renewal) using pet profile and purchase history signals to increase basket size per subscription cycle.',
  'Pet Life Cycle Journey':             'Map and personalise the customer experience by pet life stage — puppy to adult to senior — with automated content, product recommendations, and CRM flows that evolve as the pet grows.',
  'Personalised Recommendations':       'Build a recommendations engine that surfaces the most relevant products for each customer based on their pet profile, purchase history, and browsing behaviour across PDP, category, and home pages.',
  'Cross Sell Recommendation':          'Surface contextually relevant cross-sell product recommendations at PDP, cart, and post-purchase stages — driven by pet profile data and purchase history to maximise basket value.',
  'Mobile First Design':                'Redesign all key page templates (PDP, category, cart, checkout) to be mobile-first — with responsive layouts optimised for thumb navigation, faster load times, and a significantly improved mobile conversion funnel.',
  'Product Cards Revamp':               'Redesign product listing cards to surface richer information — star ratings, S&S pricing delta, quick-add-to-cart, and species/breed filter signals — reducing the clicks required to reach a purchase decision.',
  'Enhanced Product Reviews':           'A two-phase initiative to build purchase trust and increase conversion through improved review visibility, verified purchase signals, and intelligent review surfacing at key decision moments.',
  'M1 Category Restructure':            'Restructure the Magento 1 category taxonomy for improved discoverability, cleaner attribute filtering, and better SEO — creating a foundation for the upcoming M2 migration and future navigation improvements.',
  'Bundle Product Styling':             'Improve the visual presentation of bundle and multi-pack products in category listings and on PDP, making the value proposition and pack contents clearer to increase bundle attach rates.',
  'Brand Page Revamp':                  'Redesign brand landing pages with editorial content, featured products, brand story sections, and improved SEO structure — transforming them from bare product listings into high-converting brand-curated destinations.',
  'M1 Attribute Restructure':           'Restructure product attributes in Magento 1 to enable cleaner filtering, better data feed exports, and a well-prepared attribute schema ahead of M2 migration.',
  'Aptivate Add to Cart Videos':        'Integrate Aptivate shoppable video widgets on PDPs to show products in real-life use contexts, with a direct add-to-cart action from within the video — increasing purchase confidence and conversion.',
  'Homepage Refresh':                   'Deliver a full homepage redesign with an updated hero zone, pet-type navigation entry points, personalised content for logged-in users, social proof sections, and optimised editorial content placement.',
  'Edgars Integration':                 'Integrate Edgars loyalty and payment acceptance as a new customer acquisition and retention channel — expanding Pet Heaven\'s reach to Edgars cardholders across their existing retail footprint.',
  'Gift Cards':                         'Implement digital gift card purchasing and redemption — enabling gifting for pet owners and providing an acquisition channel via gifters who may not be existing Pet Heaven customers.',
  'Loyalty Driven through Suppliers':   'Build a supplier-co-funded loyalty programme where key brands contribute points, discounts, or exclusive bundles for subscribers — creating a differentiated retention mechanic without full cost to Pet Heaven.',
  'Insurance Integration':              'Integrate a pet insurance offering at PDP and checkout as an optional add-on — partnering with a provider to create a seamless enrolment flow that increases lifetime customer value and reduces price sensitivity.',
  'Pet Services':                       'Build a pet services marketplace within the Pet Heaven ecosystem — connecting customers with grooming, training, vet, and pet sitting services, deepening PH\'s role as the complete pet care destination.',
  'Vet Acquisition / Partnership':      'Establish partnerships with vet practices to co-market Pet Heaven products through vet-recommended diet tools, referral programmes, and joint promotions — acquiring high-intent, high-LTV customers at the point of professional advice.',
  'My Shop for PH':                     'Create a personalised curated shop experience for logged-in Pet Heaven customers — a "my shop" view that surfaces the most relevant products based on pet profile, purchase history, and subscription status.',
  'Solution Based Categories':          'Restructure select categories around pet health problems and solutions (e.g. "Joint Health", "Sensitive Stomach") rather than product types — meeting customers at their intent and improving discoverability for health-focused products.',
  'Start Using PostHog Features':       'Activate PostHog\'s advanced feature set after initial installation — session replays, heatmaps, feature flags, and A/B experiment infrastructure — turning the analytics investment into actionable product intelligence.',
  'Pet Profile Data Strategy':          'Define and execute a strategy for making pet profile data actionable across personalisation, recommendations, CRM segmentation, and product development — moving from data collection to data-driven growth.',
};

// ─── Load notion-data.js to get notionIds ─────────────────────────────────────
const { readFileSync } = require('fs');
const src = readFileSync('staging/notion-data.js', 'utf8');
// The file declares `const NOTION_ITEMS = [...]`
// We eval it in a safe scope to extract the array
let NOTION_ITEMS;
eval(src.replace('const NOTION_ITEMS', 'NOTION_ITEMS'));

const fy27 = NOTION_ITEMS.filter(it => it.qLabel && it.qLabel.includes('FY27'));
console.log(`Found ${fy27.length} FY27 items to update.`);

// ─── Patch a single Notion page ───────────────────────────────────────────────
async function patchPage(notionId, desc, url) {
  const props = {};
  if (url)  props['Refernce']    = { url };
  if (desc) props['Description'] = { rich_text: [{ text: { content: desc.slice(0, 2000) } }] };
  if (Object.keys(props).length === 0) return;

  const res = await fetch(`https://api.notion.com/v1/pages/${notionId}`, {
    method: 'PATCH',
    headers: HEADERS,
    body: JSON.stringify({ properties: props }),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`${res.status}: ${txt}`);
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  let done = 0, failed = 0;
  for (const it of fy27) {
    try {
      // Backfill description only when Notion currently has none / very short
      const backfill = (!it.desc || it.desc.length < 25) ? (SUMMARIES[it.name] || null) : null;
      await patchPage(it.notionId, backfill, STAGING_URL);
      done++;
    } catch (e) {
      console.warn(`  WARN [${it.name}]: ${e.message}`);
      failed++;
    }
    await sleep(350);
    if (done % 10 === 0) process.stdout.write(`  ${done}/${fy27.length}…\n`);
  }
  console.log(`\nDone. ${done} updated, ${failed} failed.`);
  console.log('Now run: node sync-notion.js');
}

main().catch(err => { console.error(err.message); process.exit(1); });
