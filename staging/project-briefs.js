// project-briefs.js — shared project brief data for staging flyouts
// Loaded via <script src="../project-briefs.js"> in all 3 staging pages
// DO NOT edit notion-data.js — this file is separately maintained

(function () {
  var style = document.createElement('style');
  style.textContent = [
    /* Type pills */
    '.f-type-pill { display:inline-block; font-size:10px; font-weight:600; padding:2px 8px; border-radius:20px; white-space:nowrap; line-height:1.6; }',
    '.f-type-qw   { background:#dcfce7; color:#166534; }',
    '.f-type-er   { background:#ede9fe; color:#4c1d95; }',
    '.f-type-mt   { background:#fef3c7; color:#92400e; }',
    '.f-type-unk  { background:var(--gray-2); color:var(--gray-5); }',
    /* AI badge */
    '.f-ai-badge  { display:inline-flex; align-items:center; gap:3px; background:#ede9fe; color:#5b21b6; font-size:9px; font-weight:700; padding:2px 7px; border-radius:20px; letter-spacing:.04em; text-transform:uppercase; }',
    /* Pills row */
    '.f-pill-row  { display:flex; align-items:center; flex-wrap:wrap; gap:6px; margin-bottom:12px; }',
    /* Project brief block */
    '.f-brief       { margin-top:20px; padding-top:20px; border-top:1px solid var(--gray-2); }',
    '.f-brief-lbl   { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:.07em; color:var(--gray-4); margin-bottom:8px; display:flex; align-items:center; gap:7px; }',
    '.f-brief-badge { font-size:9px; font-weight:700; background:var(--brand-light); color:var(--brand-dark); padding:1px 7px; border-radius:20px; text-transform:none; letter-spacing:.02em; }',
    '.f-brief-sum   { font-size:12px; color:var(--gray-5); line-height:1.7; margin-bottom:12px; }',
    '.f-brief-feats { list-style:none; display:flex; flex-direction:column; gap:5px; margin-bottom:14px; }',
    '.f-brief-feat  { display:flex; align-items:flex-start; gap:7px; font-size:11px; color:var(--gray-5); line-height:1.5; }',
    '.f-brief-dot   { width:5px; height:5px; border-radius:50%; background:var(--brand); flex-shrink:0; margin-top:5px; }',
    '.f-brief-links { display:flex; flex-direction:column; gap:6px; }',
    '.f-brief-link  { display:flex; align-items:center; gap:9px; padding:8px 10px; border-radius:10px; border:1px solid var(--gray-2); text-decoration:none; transition:border-color .15s,background .15s; }',
    '.f-brief-link:hover { border-color:var(--brand); background:var(--brand-light); }',
    '.f-brief-link-icon  { font-size:13px; flex-shrink:0; width:24px; text-align:center; }',
    '.f-brief-link-title { font-size:12px; font-weight:600; color:var(--black); display:block; line-height:1.3; }',
    '.f-brief-link-sub   { font-size:11px; color:var(--gray-4); display:block; margin-top:1px; }',
    '.f-brief-link-arr   { color:var(--gray-3); flex-shrink:0; margin-left:auto; }',
  ].join('\n');
  document.head.appendChild(style);
})();

// ─── Standard staging links ───────────────────────────────────────────────────
var STAGING_RM  = { label:'Staging Roadmap',        sub:'FY27 Q1–Q4 planning view',   href:'https://bevan-cloud.github.io/petheaven-prototype/staging/roadmap/',        icon:'🗺️' };
var STAGING_PRI = { label:'Staging Prioritization', sub:'RICE table & impact matrix',  href:'https://bevan-cloud.github.io/petheaven-prototype/staging/prioritization/', icon:'⚡' };

// ─── PROJECT_BRIEFS ───────────────────────────────────────────────────────────
window.PROJECT_BRIEFS = {

  // ── PET HEAVEN ──────────────────────────────────────────────────────────────

  'S&S PDP': {
    type: 'Existing Roadmap', ai: false,
    summary: 'Redesign the PDP purchase section to visually and functionally distinguish the Subscribe & Save option — surfacing subscription savings, perks, and promotions before the customer commits.',
    features: [
      'Dual purchase option cards — S&S (purple) vs once-off (green)',
      'Dynamic CTA label — "Create Schedule" vs "Add to Cart"',
      'Always-visible S&S perks — savings %, schedule, skip/change/cancel',
      'S&S promo banner with copyable code (first order only)',
      'Dynamic pricing — updates by size across both options',
    ],
    links: [
      { label:'Prototype', sub:'Split purchase cards + S&S promo banner', href:'https://bevan-cloud.github.io/petheaven-prototype/sub-cart-split/', icon:'🖥️' },
      STAGING_RM, STAGING_PRI,
    ],
  },

  'Enhance Subscription Experience': {
    type: 'Existing Roadmap', ai: false,
    summary: 'Improve the end-to-end subscriber experience after the initial purchase — giving customers full control over their schedule, products, and account without needing to cancel. The goal is to reduce churn caused by inflexibility and opacity in the current subscription management flow.',
    features: [
      'Redesigned subscription dashboard — clear upcoming orders, status, and next charge date',
      'One-tap pause, skip, and resume controls with configurable pause duration',
      'In-dashboard product swap — change variant, size, or flavour without restarting the subscription',
      'Frequency change UI — adjust delivery cadence at any time',
      'Push and email notifications for upcoming charges with a pre-charge edit window',
      'Churn-prevention flow — offer pause or discount before confirming cancellation',
    ],
    links: [STAGING_RM, STAGING_PRI],
  },

  'RC Full Brand Coupon Integration': {
    type: 'Existing Roadmap', ai: false,
    summary: 'Integrate Royal Canin and other brand-funded coupon redemption natively into subscription checkout and ongoing management flows, replacing the current manual or out-of-band redemption process. This removes friction for high-value subscribers and enables brand-co-funded retention mechanics.',
    features: [
      'Coupon field surfaced prominently in subscription checkout — not buried in cart',
      'Brand coupon stacking rules — define which codes combine with S&S discounts',
      'Persistent coupon application to recurring orders for multi-use brand promotions',
      'Coupon status panel in subscriber dashboard — active codes, expiry, and savings to date',
      'CS tool to apply or remove brand coupons from active subscriptions without cancelling',
      'Reporting dashboard for brand partners to view coupon redemption performance',
    ],
    links: [STAGING_RM, STAGING_PRI],
  },

  'Subscription Swops': {
    type: 'Existing Roadmap', ai: false,
    summary: 'Allow subscribers to swap products within an active subscription at any time without cancelling — addressing the leading cause of cancellation when a pet changes diet, grows out of a life stage, or a preferred flavour goes out of stock. Swops should feel instant and reversible.',
    features: [
      'Swap product flow accessible from subscription dashboard and OOS notification',
      'Filtered swap catalogue — same species, diet type, and brand pre-selected',
      'Side-by-side price comparison between current and swapped product',
      'Swap takes effect on the next scheduled order, with option to apply immediately',
      'Swap history log in account — restore previous product with one click',
      'AI-matched swap suggestions based on pet profile when initiating from OOS trigger',
    ],
    links: [STAGING_RM, STAGING_PRI],
  },

  'Rewarding Subs': {
    type: 'Existing Roadmap', ai: false,
    summary: 'Design and launch a subscribers-only rewards programme that deepens loyalty by making the subscription relationship feel valuable beyond price savings alone. Rewards should be visible, attainable, and tied to subscriber tenure and behaviour.',
    features: [
      'Subscriber loyalty tiers — Bronze, Silver, Gold — based on consecutive active months',
      'Cashback credits applied to next order at each tier milestone',
      'Early access to new products and limited-run items for Gold-tier subscribers',
      'Birthday and pet-birthday reward triggers — automated discount or free gift',
      'Rewards hub in the subscriber dashboard — points balance, tier progress, upcoming rewards',
      'Email campaigns showcasing tier benefits to non-subscribers as acquisition driver',
    ],
    links: [STAGING_RM, STAGING_PRI],
  },

  'Subscriptions 2.0': {
    type: 'Existing Roadmap', ai: false,
    summary: 'A full rebuild of the subscription platform — addressing the architectural and UX debt that limits growth, causes payment failures, and frustrates subscribers. The new platform should support multi-product baskets, intelligent retry logic, and a best-in-class subscriber dashboard.',
    features: [
      'Multi-product subscription basket — manage multiple items under a single schedule',
      'Unified subscription dashboard with real-time status, next charge, and edit controls',
      'Smart payment retry logic — staggered retries with card-expiry pre-alerts',
      'Dunning flow — automated SMS/email sequence before and after payment failure',
      'Supplier and SKU-level OOS handling — automatic swap suggestion or pause',
      'Admin subscription management console — CS can view, edit, and action any subscription',
    ],
    links: [STAGING_RM, STAGING_PRI],
  },

  'Personalised Upsells on Subs': {
    type: 'Existing Roadmap', ai: false,
    summary: 'Surface personalised product upsell recommendations to subscribers at the highest-intent moments in their subscription lifecycle — at order confirmation, at the skip moment, and ahead of renewal. Upsells should feel curated to the pet, not generic.',
    features: [
      'Pet-profile-matched upsell cards on order confirmation page and email',
      'Skip-moment intervention — "Before you skip, your dog might love…" with one-tap add',
      'Pre-renewal email with recommended add-ons based on last 3 orders',
      'Upsell widget in subscriber dashboard — rotating recommendation refreshed monthly',
      'A/B test framework for upsell copy and placement to optimise attach rate',
      'Supplier-funded upsell slots — brand co-pays for featured recommendation placement',
    ],
    links: [STAGING_RM, STAGING_PRI],
  },

  'AI Diet Calculator + Frequency Wizard': {
    type: 'Quick Win', ai: true,
    summary: 'An AI-powered calculator on the subscription PDP that takes pet weight, breed, age, and activity level as inputs and outputs the recommended bag size and ideal delivery frequency — removing the guesswork that causes subscribers to over- or under-order. This single feature reduces trial-and-error cancellations.',
    features: [
      'Lightweight input widget on S&S PDP — weight, breed, age, activity level',
      'AI model maps inputs to recommended daily portion and bags-per-month calculation',
      'Auto-populates bag size selector and delivery frequency on the subscription form',
      'Results persist to pet profile for use across future recommendations',
      'Mobile-first UX — collapsible calculator that doesn\'t interrupt the purchase flow',
      'Fallback defaults for unknown breeds with a "tell us more" prompt to improve data',
    ],
    links: [STAGING_RM, STAGING_PRI],
  },

  'Preemptive Sub Failures': {
    type: 'Existing Roadmap', ai: false,
    summary: 'Proactively identify and prevent subscription payment failures before they happen, rather than reacting after a charge declines. Early intervention on expiring cards and low-balance signals dramatically reduces involuntary churn — which is often the largest single contributor to subscription revenue loss.',
    features: [
      'Card expiry alert — email and SMS sent 30 and 7 days before expiry with update-card CTA',
      'Pre-charge notification 48 hours before each renewal with one-tap manage link',
      'Smart retry logic — 3-attempt schedule (day 0, day 3, day 7) with backoff',
      'Post-failure dunning sequence — day 1 soft nudge, day 4 urgency, day 8 final notice',
      'CS dashboard flag — subscriptions at risk of failure surfaced with customer contact info',
      'Recovery metric tracking — failed charges recovered vs written off, by cohort',
    ],
    links: [STAGING_RM, STAGING_PRI],
  },

  'PostHog App Analytics': {
    type: 'Quick Win', ai: false,
    summary: 'Implement PostHog in the Pet Heaven mobile app to gain the first real visibility into in-app user behaviour — currently a complete blind spot. Event tracking, funnels, and session recording will immediately enable data-driven decisions on app UX and feature prioritisation.',
    features: [
      'PostHog SDK installed and configured in the PH mobile app (iOS + Android)',
      'Core event taxonomy defined and instrumented — screen views, add-to-cart, checkout steps, subscription actions',
      'Conversion funnels built for: browse → PDP → cart → purchase and sub sign-up flow',
      'Session recording enabled for key flows to identify drop-off and confusion points',
      'App vs web behaviour comparison dashboard — identify channel-specific friction',
      'Alerting on anomalous funnel drop-off rates for proactive issue detection',
    ],
    links: [STAGING_RM, STAGING_PRI],
  },

  'Pet Life Cycle Journey': {
    type: 'Existing Roadmap', ai: false,
    summary: 'Build a personalised customer journey that adapts to the life stage of the customer\'s pet — from the excitement of a new puppy or kitten through to the care needs of a senior pet. Life-stage-aware communication, product recommendations, and content deepen the relationship and increase lifetime value.',
    features: [
      'Pet life stage model — puppy/kitten (0–12m), junior (1–2y), adult (2–7y), senior (7y+)',
      'Automated stage transition triggers based on pet DOB in profile — email and on-site',
      'Stage-appropriate product recommendation sets curated per stage and species',
      'Life stage content hub — nutrition guides, vet tips, training advice per stage',
      'Subscription frequency and pack size recommendations updated at each stage transition',
      'Senior pet upsell programme — joint health, dental, and cognitive support products',
    ],
    links: [STAGING_RM, STAGING_PRI],
  },

  'Maze User Research': {
    type: 'Existing Roadmap', ai: false,
    summary: 'Implement Maze as the primary user research and prototype testing tool to validate UX decisions with real customers before committing to development. Rapid, unmoderated testing reduces the cost of getting UX wrong and builds a culture of evidence-based product decisions.',
    features: [
      'Maze account set up and integrated with Figma design workflow',
      'Prototype test templates built for PDP, checkout, and subscription flows',
      'Participant recruitment panel sourced from PH customer base (opt-in)',
      'Test cadence established — one validated UX decision per sprint minimum',
      'Results dashboard shared with product and design weekly',
      'Repository of past test results and insights accessible to all PMs and designers',
    ],
    links: [STAGING_RM, STAGING_PRI],
  },

  'Food Calculator': {
    type: 'Existing Roadmap', ai: false,
    summary: 'Build a pet food calculator that gives customers a personalised daily portion recommendation and bag size guidance based on their pet\'s weight, breed, age, and activity level. This positions Pet Heaven as an authoritative, helpful resource and reduces uncertainty at the purchase decision stage.',
    features: [
      'Multi-step calculator UI — species, breed, weight, age, activity level, neuter status',
      'Portion output in grams/day with visual portion guide (cup comparison)',
      'Recommended bag size and estimated monthly cost with S&S saving highlighted',
      'Results shareable by link and saveable to pet profile',
      'Breed database with default weight ranges and activity profiles for 200+ breeds',
      'Vet-reviewed methodology badge to build trust in recommendations',
    ],
    links: [STAGING_RM, STAGING_PRI],
  },

  'Calculate Likely Pets': {
    type: 'Existing Roadmap', ai: false,
    summary: 'Build an ML model that infers a customer\'s pet type, species, and likely breed from their purchase history — filling gaps in pet profile data for the large portion of customers who never explicitly create a profile. This unlocks personalisation for customers who haven\'t self-declared their pet.',
    features: [
      'Training dataset built from customers with known pet profiles and corresponding order history',
      'ML classifier model: species (dog/cat/other), broad breed category, approximate age band',
      'Inferred pet profile enrichment — written to a shadow field, never overrides explicit data',
      'Confidence scoring — only surface inferred data above a defined threshold',
      'Progressive disclosure — prompt customer to confirm inferred pet type with one-tap UX',
      'Monthly model retraining pipeline as new labelled data accumulates',
    ],
    links: [STAGING_RM, STAGING_PRI],
  },

  'Personalised Recommendations': {
    type: 'Existing Roadmap', ai: false,
    summary: 'Build a recommendations engine that surfaces relevant products to each customer based on their pet profile, purchase history, and browsing behaviour — moving beyond generic "bestsellers" to genuinely individualised discovery. Personalisation at scale is one of the highest-ROI investments in ecommerce.',
    features: [
      'Collaborative filtering model trained on co-purchase and view-then-buy signals',
      'Pet-profile filter layer — breed, species, age, and diet constraints applied on top of CF model',
      'Recommendations placement: homepage hero strip, PDP "Recommended for Harvey", cart add-ons',
      'Email recommendation block — personalised product picks in weekly digest and abandoned cart flows',
      'Real-time model update pipeline — recommendations refresh within 24 hours of a new purchase',
      'A/B testing framework for recommendation placement and algorithm variants',
    ],
    links: [STAGING_RM, STAGING_PRI],
  },

  'Cross Sell Recommendation': {
    type: 'Existing Roadmap', ai: false,
    summary: 'Surface contextually relevant cross-sell product recommendations at the PDP, cart, and post-purchase stages to increase basket size and introduce customers to product categories they haven\'t yet explored. Cross-sell done well feels like helpful advice, not upselling.',
    features: [
      'PDP cross-sell strip — "Pairs well with" based on complementary product categories',
      'Cart cross-sell widget — one-tap add items under a "Don\'t forget…" header',
      'Post-purchase page cross-sell — "Your order is on its way. Your pet might also love…"',
      'Cross-sell logic rules: complementary categories, same brand, breed-appropriate alternatives',
      'Supplier-funded featured cross-sell slots with performance reporting',
      'Cross-sell conversion tracking — attach rate, revenue per recommendation, by placement',
    ],
    links: [STAGING_RM, STAGING_PRI],
  },

  'PostHog Web Analytics': {
    type: 'Existing Roadmap', ai: false,
    summary: 'Implement the full PostHog web analytics suite to replace or augment current analytics tooling with heatmaps, session replays, funnel analysis, and a built-in A/B testing infrastructure. This gives the product team a single platform for both quantitative and qualitative web insights.',
    features: [
      'PostHog JS snippet installed across all PH web pages with correct sampling',
      'Heatmaps and scroll maps configured for homepage, PDP, category, cart, and checkout',
      'Session replay enabled — filtering to key funnel stages and rage-click events',
      'Conversion funnels built: acquisition → register, browse → purchase, cart → checkout',
      'Feature flags and A/B experiment infrastructure set up for ongoing CRO programme',
      'Custom dashboard for weekly product metrics: traffic, conversion, top exit pages',
    ],
    links: [STAGING_RM, STAGING_PRI],
  },

  'Mobile First Design': {
    type: 'Existing Roadmap', ai: false,
    summary: 'Redesign all key customer-facing templates — PDP, category pages, cart, and checkout — to be genuinely mobile-first, with responsive layouts, thumb-friendly interaction targets, and content hierarchy optimised for small screens. Given that the majority of PH traffic is mobile, this is foundational.',
    features: [
      'Mobile-first PDP redesign — sticky add-to-cart bar, image swipe gallery, collapsible sections',
      'Category page reflow — 2-column grid, floating filter button, horizontal scroll for facets',
      'Checkout flow audit and simplification — reduce steps, large tap targets, autofill support',
      'Navigation overhaul — bottom nav bar for mobile, hamburger cleanup, search prominence',
      'Typography and spacing audit — minimum 16px body text, 44px tap targets throughout',
      'Lighthouse mobile performance budget — target 75+ score across all key templates',
    ],
    links: [STAGING_RM, STAGING_PRI],
  },

  'Product Cards Revamp': {
    type: 'Existing Roadmap', ai: false,
    summary: 'Redesign product listing cards across category, search, and homepage placement to carry richer, more decision-relevant information — including ratings, S&S pricing, quick-add functionality, and species/breed filter signals — while remaining clean and fast on mobile.',
    features: [
      'Star rating and review count displayed below product name on all listing cards',
      'S&S price shown alongside once-off price with savings percentage badge',
      'Quick-add button — add to cart or subscribe without navigating to PDP',
      'Species tag pill (Dog / Cat / Bird etc) visible on card for mixed-species listings',
      'Out-of-stock overlay with "Notify me" CTA instead of hiding the product',
      'Card hover state (desktop) — expanded view with variant selector and add-to-cart',
    ],
    links: [STAGING_RM, STAGING_PRI],
  },

  'Enhanced Product Reviews': {
    type: 'Existing Roadmap', ai: false,
    summary: 'A two-phase initiative to build purchase trust and increase conversion through improved review visibility, verified purchase signals, and intelligent review surfacing.',
    features: [
      'Star ratings on category listing & search pages',
      'Above-fold review snippet on PDP (most helpful + most recent)',
      'Post-purchase review request email (RFM-segmented)',
      'Verified purchase badges — full lifecycle state machine',
      'Mark as useful — logged-in voting, feeds relevance sort',
      'Relevance sort + 4 customer filters',
    ],
    links: [
      { label:'Prototype v1', sub:'PDP with above-fold review snippets', href:'https://bevan-cloud.github.io/petheaven-prototype/#customer-reviews', icon:'🖥️' },
      { label:'Prototype v2', sub:'Verified badges, useful voting & filters', href:'https://bevan-cloud.github.io/petheaven-prototype/pdp-v2/', icon:'🖥️' },
      STAGING_RM, STAGING_PRI,
    ],
  },

  'M1 Category Restructure': {
    type: 'Existing Roadmap', ai: false,
    summary: 'Restructure the Magento 1 category taxonomy to improve product discoverability, SEO performance, and attribute-based filtering — addressing years of ad hoc category growth that has left the navigation confusing and hard to maintain. A clean taxonomy is also a prerequisite for the M2 migration.',
    features: [
      'Full audit of existing M1 category tree — identify duplicates, orphans, and mislabelled nodes',
      'New category architecture — species-first, then life stage, then product type',
      'SEO-optimised category URLs and meta titles applied across restructured tree',
      'Attribute filter groups aligned to new category structure for consistent faceted navigation',
      'Redirect map — all existing category URLs 301-redirected to new equivalents',
      'Merchandising rules updated to match new category assignments',
    ],
    links: [STAGING_RM, STAGING_PRI],
  },

  'Bundle Product Styling': {
    type: 'Existing Roadmap', ai: false,
    summary: 'Improve the visual presentation and purchase clarity of bundle and multi-pack products across listings and PDPs — currently rendered with generic styling that fails to communicate the value proposition or the individual components of the bundle.',
    features: [
      'Bundle listing card treatment — "Bundle" badge, component thumbnail strip, total saving shown',
      'PDP bundle component display — visual breakdown of what\'s included with individual images',
      'Bundle price callout — "Worth RX,XXX — Save RX,XXX" with per-item unit cost shown',
      'Customisable bundle builder UI for mix-and-match bundle types',
      'Bundle-specific add-to-cart CTA — "Add Bundle to Cart" vs standard label',
      'Bundle structured data markup for Google Shopping and rich snippets',
    ],
    links: [STAGING_RM, STAGING_PRI],
  },

  'Merchandising Real Estate': {
    type: 'Existing Roadmap', ai: false,
    summary: 'Optimise the homepage, category pages, and search results pages as commercial merchandising surfaces — bringing discipline and ROI focus to how banner slots, promo spots, and editorial content are allocated. Better merchandising real estate management directly impacts campaign performance.',
    features: [
      'Homepage merchandising plan — hero, secondary banners, and promo strip mapped to commercial calendar',
      'Category page promo slot system — configurable top-of-page banner and in-grid ad units',
      'Editorial content placement strategy — "expert picks", "vet recommended", and seasonal edits',
      'Supplier-funded slot programme — defined placement inventory with performance SLAs',
      'CMS-driven merchandising updates — marketing team self-serve without dev tickets',
      'Weekly merchandising performance report — impressions, clicks, and attributed revenue per slot',
    ],
    links: [STAGING_RM, STAGING_PRI],
  },

  'Brand Page Revamp': {
    type: 'Existing Roadmap', ai: false,
    summary: 'Redesign brand landing pages to move beyond a plain product grid into a richer, editorial destination — with brand story content, featured hero products, and SEO-optimised copy. Strong brand pages improve organic traffic and give supplier partners a compelling reason to invest in PH.',
    features: [
      'Brand hero section — full-width banner, tagline, and brand logo treatment',
      'Brand story editorial block — sourced from brand partners, editable via CMS',
      '"Why we love this brand" trust section — vet endorsement, sustainability, or quality cues',
      'Featured products carousel — manually curated or best-selling with commercial weighting',
      'SEO meta template for brand pages — brand name, key product categories, unique content',
      'Brand page analytics — traffic, conversion, and product click-through per brand',
    ],
    links: [STAGING_RM, STAGING_PRI],
  },

  'M1 Attribute Restructure': {
    type: 'Existing Roadmap', ai: false,
    summary: 'Restructure Magento 1 product attributes for cleaner faceted filtering, improved feed export quality for Google Shopping and comparison engines, and readiness for the eventual M2 migration. Attribute quality directly affects search relevance, filter UX, and feed performance.',
    features: [
      'Full attribute audit — identify redundant, inconsistently used, and missing attributes',
      'Standardised attribute set per product type — food, treat, accessory, supplement',
      'Controlled vocabulary for key filter attributes — breed, life stage, dietary requirement, flavour',
      'Feed-ready attribute mapping — Google Shopping, PriceCheck, and Takealot feed requirements met',
      'Bulk attribute update tooling — batch edit for reclassification without manual PDP edits',
      'Attribute governance process — approval flow for new attribute creation going forward',
    ],
    links: [STAGING_RM, STAGING_PRI],
  },

  'Aptivate Add to Cart Videos': {
    type: 'Existing Roadmap', ai: false,
    summary: 'Integrate Aptivate shoppable video widgets on PDPs to show products in real-world use — demonstrating feeding, unboxing, or pet reactions in a way static images cannot. Shoppable video increases time-on-page, trust, and add-to-cart conversion, especially on mobile.',
    features: [
      'Aptivate widget integrated in PDP media gallery — video plays inline, not in lightbox',
      'Shoppable product tags embedded in video — tap to add directly to cart',
      'Brand-supplied video asset onboarding process — spec sheet, upload portal, review workflow',
      'Video placement A/B test — gallery position 1 vs position 3 vs below-the-fold',
      'Mobile video autoplay with muted default and tap-to-unmute behaviour',
      'Performance reporting — video play rate, shoppable tag click-through, and attributed conversion',
    ],
    links: [STAGING_RM, STAGING_PRI],
  },

  'Homepage Refresh': {
    type: 'Existing Roadmap', ai: false,
    summary: 'Deliver a full homepage redesign that replaces the current static, one-size-fits-all layout with a dynamic, personalised destination — featuring updated hero design, species-based navigation entry points, social proof zones, and content personalised to the logged-in customer\'s pet.',
    features: [
      'New hero section — full-width, animated, with pet-type entry points (Dog, Cat, Bird, etc)',
      'Personalised content zone below the fold — "For Harvey" recommendations for logged-in users',
      'Social proof strip — review count, subscription count, and trust badges above fold',
      'Featured categories with lifestyle imagery replacing flat product grids',
      'Commercial promo banner system — CMS-driven, tied to trading calendar',
      'CRO-optimised footer — newsletter signup, top categories, and trust elements',
    ],
    links: [STAGING_RM, STAGING_PRI],
  },

  'M2 Migration': {
    type: 'Existing Roadmap', ai: false,
    summary: 'Migrate the Pet Heaven platform from Magento 1 to Magento 2 — addressing the growing security, performance, and extensibility risk of running an end-of-life platform. M2 unlocks access to modern extensions, better frontend tooling, improved API capabilities, and a supported security baseline.',
    features: [
      'M1→M2 data migration — customers, orders, products, categories, and CMS content',
      'Theme rebuild — M2-native Luma/Hyva base with PH design system applied',
      'Extension audit and M2-equivalent sourcing — payments, subscriptions, loyalty, search',
      'Performance benchmarking — target sub-3s TTFB and 80+ Lighthouse score post-migration',
      'Phased cutover plan — staging environment, UAT, soft launch, and DNS cutover with rollback',
      'Staff training — admin, merchandising, CS, and marketing workflows in M2',
    ],
    links: [STAGING_RM, STAGING_PRI],
  },

  'Deals Page Structure': {
    type: 'Quick Win', ai: false,
    summary: 'Restructure the deals page with species filtering, countdown timers on flash sales, urgency mechanics, and a clear deal hierarchy — transforming a flat list of promotions into a high-conversion commercial surface. Urgency and relevance are the two levers most proven to lift deals page conversion.',
    features: [
      'Species filter tabs at the top of the deals page — Dog, Cat, Bird, Small Animal, All',
      'Flash sale section with live countdown timers — hours:minutes:seconds display',
      'Deal hierarchy treatment — Hero deal (full-width), Featured deals (2-up), Standard deals (grid)',
      'Urgency indicators — "Only 12 left", "Ends tonight", "X sold today"',
      'Logged-in personalisation layer — deals relevant to the customer\'s pet surfaced first',
      'CMS tool for merchandising team to set deal tier, countdown end time, and urgency copy',
    ],
    links: [STAGING_RM, STAGING_PRI],
  },

  'New Pet Parents Page Redesign': {
    type: 'Quick Win', ai: false,
    summary: 'Replace the current 9-coupon wall on the New Pet Parents page with a guided onboarding journey — Welcome → Meet your pet → What you need → Set up delivery — that converts first-time visitors into profiled, subscribed customers with a single cohesive flow.',
    features: [
      'Step 1 Welcome — hero with emotional new-pet imagery and personalised greeting',
      'Step 2 Meet your pet — inline pet profile creation (name, species, breed, DOB)',
      'Step 3 What you need — curated starter product list based on species and age',
      'Step 4 Set up delivery — S&S subscription prompt with first-order discount prominently shown',
      'Progress indicator — 4-step stepper keeps users oriented and reduces abandonment',
      'Completion state — pet profile saved, first recommendation set displayed, welcome email triggered',
    ],
    links: [STAGING_RM, STAGING_PRI],
  },

  'Personalised Deals Page': {
    type: 'Quick Win', ai: false,
    summary: 'Filter the deals page for logged-in users to surface only deals relevant to their registered pets — turning a generic "Pet Heaven Deals" page into "Deals for Harvey" and dramatically improving the signal-to-noise ratio for customers who have given us their pet data.',
    features: [
      'Logged-in state detection — deals page auto-filters to pet profile species and breed on load',
      'Personalised page header — "Deals for [pet name]" with pet avatar if available',
      'Pet switcher if customer has multiple pets — "Show deals for Max instead"',
      'Non-pet-matched deals collapsed into a "More deals" section, not removed entirely',
      'Logged-out fallback — species tabs and a "Sign in to personalise" prompt above the fold',
      'Personalisation performance tracking — CTR and conversion rate for personalised vs non-personalised cohorts',
    ],
    links: [STAGING_RM, STAGING_PRI],
  },

  'Mobile Audit & Quick Fixes': {
    type: 'Quick Win', ai: false,
    summary: 'Conduct a structured mobile UX audit across the top 10 traffic pages and execute a rapid fix sprint on the most impactful issues — focusing on tap targets, font sizes, and checkout flow usability. This is a time-boxed, high-ROI initiative that addresses known mobile friction before a full mobile-first redesign.',
    features: [
      'Audit of top 10 pages by mobile traffic — scored against tap target, readability, and layout criteria',
      'Fix sprint: minimum 44px tap targets on all interactive elements across audited pages',
      'Fix sprint: minimum 16px body text and sufficient contrast on all key pages',
      'Checkout flow mobile pass — remove unnecessary steps, enable autofill, fix keyboard overlap issues',
      'Before/after Lighthouse mobile score comparison for each fixed page',
      'Prioritised backlog of medium-effort mobile issues for inclusion in next sprint cycle',
    ],
    links: [STAGING_RM, STAGING_PRI],
  },

  'Google CPC Brand Term Review': {
    type: 'Quick Win', ai: false,
    summary: 'Review current Google CPC spend on Pet Heaven brand keywords against organic ranking data — if PH is consistently ranking #1 organically for its own brand terms, reducing or pausing brand bidding could recover significant ad spend with minimal revenue impact.',
    features: [
      'Organic rank audit for brand terms — "Pet Heaven", "PetHeaven", "Pet Heaven online" and variants',
      'Current CPC spend and click attribution analysis for brand keyword campaigns',
      'Holdout experiment design — pause brand bidding in one region or date window, measure organic uplift',
      'Competitor brand keyword audit — assess risk of pausing if competitors are bidding on PH terms',
      'Decision framework — thresholds for when to pause, reduce, or maintain brand spend',
      'Monthly brand keyword health monitoring dashboard post-decision',
    ],
    links: [STAGING_RM, STAGING_PRI],
  },

  'Edgars Integration': {
    type: 'Existing Roadmap', ai: false,
    summary: 'Integrate with the Edgars loyalty and payment ecosystem to unlock a new customer acquisition channel and enable Edgars account holders to earn and spend their rewards on Pet Heaven. This partnership targets an underserved, credit-active customer segment with established pet ownership.',
    features: [
      'Edgars loyalty points earn at PH checkout — points awarded per rand spent',
      'Edgars account payment method added to PH checkout as a first-class option',
      'Co-branded landing page and acquisition campaign assets with Edgars',
      'Subscriber cross-promotion — PH subscription offer surfaced in Edgars CRM communications',
      'CS integration — shared order status visibility for purchases made via Edgars channel',
      'Performance reporting — new customer acquisition and revenue attributed to Edgars channel',
    ],
    links: [STAGING_RM, STAGING_PRI],
  },

  'Gift Cards': {
    type: 'Existing Roadmap', ai: false,
    summary: 'Implement digital gift card purchasing and redemption on Pet Heaven — a high-margin, zero-inventory product that captures gifting occasions and introduces new customers to the platform. Gift cards are a proven new customer acquisition vehicle in the pet vertical.',
    features: [
      'Gift card purchase flow — select denomination (R100–R2000), personalise message, pay',
      'Digital delivery — recipient receives branded email with unique code and redemption instructions',
      'Redemption at checkout — gift card code field with balance display and partial redemption support',
      'Gift card balance check page — self-serve balance lookup without needing to checkout',
      'Corporate bulk gift card programme for HR and B2B gifting use cases',
      'Gift card as return resolution option — CS tool to issue store credit as a gift card',
    ],
    links: [STAGING_RM, STAGING_PRI],
  },

  'Agentic Commerce': {
    type: 'Existing Roadmap', ai: true,
    summary: 'Build AI-driven conversational commerce experiences that allow customers to discover products, build subscription baskets, and get personalised recommendations through natural language interaction — positioning Pet Heaven as a genuinely intelligent pet care partner rather than just a transactional store.',
    features: [
      'Conversational product discovery — chat interface where customers describe needs, AI returns matched products',
      'AI-recommended subscription builder — "Build the perfect subscription for a 2-year-old Golden Retriever"',
      'Proactive reorder suggestions — AI detects likely stock depletion from subscription cadence and purchase history',
      'WhatsApp-based agentic shopping — customers can browse, add to cart, and checkout via WhatsApp',
      'Voice search integration — "Find grain-free cat food under R300" on mobile',
      'Guardrails and escalation paths — AI hands off to CS for complex queries, complaints, or refunds',
    ],
    links: [STAGING_RM, STAGING_PRI],
  },

  'Loyalty Driven through Suppliers': {
    type: 'Existing Roadmap', ai: false,
    summary: 'Design a supplier-funded loyalty programme where pet food and accessory brands co-fund points, exclusive bundles, and subscriber rewards — creating a sustainable loyalty economy where PH coordinates value delivery without bearing the full cost. Supplier-funded loyalty aligns commercial incentives and deepens brand relationships.',
    features: [
      'Supplier loyalty co-funding framework — commercial terms, contribution per point, redemption rules',
      'Brand-specific reward campaigns — "Buy 3 Royal Canin bags, earn a free bag" mechanic',
      'Supplier dashboard — brands see their funded rewards performance: redemption rate, attributed revenue',
      'Subscriber-exclusive brand deals — suppliers offer loyalty members better rates than general public',
      'Loyalty points earn on subscription orders — higher multiplier for S&S vs once-off',
      'Quarterly supplier review pack — loyalty programme ROI metrics and renewal negotiation data',
    ],
    links: [STAGING_RM, STAGING_PRI],
  },

  'Insurance Integration': {
    type: 'Existing Roadmap', ai: false,
    summary: 'Integrate a pet insurance offering at PDP and checkout as a contextual add-on — presented at the moment customers are already thinking about their pet\'s health and wellbeing. Insurance integration creates a recurring revenue stream and a reason for customers to deepen their relationship with PH.',
    features: [
      'Insurance partner integration — API connection to a tier-1 SA pet insurer (MiWay, Oneplan, or Dotsure)',
      'PDP insurance prompt — "Protect [species] from unexpected vet bills" with quote widget',
      'Checkout add-on step — optional insurance enrolment between cart and payment',
      'Pet profile pre-fill — species, breed, and age pre-populated into the insurance quote form',
      'Post-purchase insurance upsell — triggered 3 days after first order with new pet onboarding email',
      'Revenue share reporting — policies initiated and bound via PH referral, monthly reconciliation',
    ],
    links: [STAGING_RM, STAGING_PRI],
  },

  'Pet Services': {
    type: 'Existing Roadmap', ai: false,
    summary: 'Build a pet services marketplace within the PH ecosystem — connecting customers with grooming, training, vet, and pet sitting services alongside their food and accessory purchases. Services extend the relationship with PH beyond transactional shopping into everyday pet care.',
    features: [
      'Services marketplace page — grooming, training, vet, pet sitting, and boarding categories',
      'Service provider onboarding — listing, profile, availability, and booking integration',
      'In-app booking flow — select service, choose provider, pick date and time, pay',
      'Pet profile integration — service providers see the pet\'s breed, age, and health notes ahead of appointment',
      'Review and rating system for service providers — post-service prompt with moderation',
      'Services-as-subscription option — recurring grooming bookings with S&S-style discount',
    ],
    links: [STAGING_RM, STAGING_PRI],
  },

  'Zumvet Integration': {
    type: 'Existing Roadmap', ai: false,
    summary: 'Embed Zumvet tele-vet consultation functionality within the PH app and website, giving customers on-demand access to qualified veterinary advice without leaving the Pet Heaven experience. This positions PH as a holistic pet care platform and drives trust and retention.',
    features: [
      'Zumvet API integration — session initiation, vet availability, and consultation handoff',
      'Entry points on PDP ("Not sure if this is right for your pet? Ask a vet"), cart, and help centre',
      'Pet profile pre-send — vet receives pet name, breed, age, and current diet before session starts',
      'Consultation history stored in PH account — past advice and product recommendations accessible',
      'Post-consultation product recommendation flow — vet-recommended products surfaced with one-tap add-to-cart',
      'Zumvet performance metrics — consultations initiated, completion rate, and attributed order value',
    ],
    links: [STAGING_RM, STAGING_PRI],
  },

  '3DSv2 Payment Security': {
    type: 'Existing Roadmap', ai: false,
    summary: 'Implement 3D Secure 2 (3DSv2) across PH checkout and recurring subscription billing to reduce card fraud, meet PCI compliance requirements, and reduce chargebacks — while delivering a frictionless authentication experience that doesn\'t harm conversion.',
    features: [
      '3DSv2 implementation across all card-present checkout flows (web and app)',
      'Subscription recurring billing 3DSv2 exemption strategy — MIT (merchant-initiated transaction) flags applied correctly',
      'Frictionless flow optimisation — device fingerprinting and risk signals to minimise challenge step frequency',
      'Declined transaction recovery flow — 3DS challenge retry with clear customer messaging',
      'Chargeback rate monitoring before and after rollout — success metric: <0.1% chargeback rate',
      'Acquirer and gateway coordination — confirm 3DSv2 support and test in staging before go-live',
    ],
    links: [STAGING_RM, STAGING_PRI],
  },

  'Vet Acquisition / Partnership': {
    type: 'Existing Roadmap', ai: false,
    summary: 'Partner with independent and group veterinary practices to co-market PH products, offer vet-recommended diet and nutrition tools, and create a bi-directional referral programme — turning the most trusted voice in pet health into a customer acquisition and retention channel.',
    features: [
      'Vet partner programme — commercial terms, co-branded assets, and referral tracking',
      '"Vet Recommended" product badge — awarded to products listed by partner vets as preferred brands',
      'Vet referral landing page — customised onboarding with vet name and first-order discount',
      'Diet recommendation tool for vets — vet-facing portal to send personalised product lists to clients',
      'Vet co-branded email — PH sends approved diet and care reminders on the vet\'s behalf',
      'Programme ROI dashboard — referred customers, retention rate, and LTV vs non-vet cohort',
    ],
    links: [STAGING_RM, STAGING_PRI],
  },

  'Pet Birthday / Life Stage Discounts': {
    type: 'Medium-term', ai: true,
    summary: 'Deploy AI-triggered, automated personalised discounts and offers based on a pet\'s birthday, age milestones, and life stage transitions — delivering high-relevance promotions at the moments of maximum emotional and nutritional significance. These triggers are uniquely possible when you have pet profile data.',
    features: [
      'Pet birthday trigger — automated discount or free gift offer sent 3 days before birthday',
      'Life stage transition trigger — AI detects when a pet crosses a life stage threshold and surfaces relevant new products',
      'First birthday celebration flow — special onboarding from puppy to junior product range',
      'Senior pet transition alert — "Harvey is now 7 — here\'s what changes for senior dogs" with product recommendations',
      'AI discount personalisation — offer depth based on customer lifetime value and churn risk score',
      'Trigger performance dashboard — open rates, redemption rates, and attributed revenue by trigger type',
    ],
    links: [STAGING_RM, STAGING_PRI],
  },

  'Subscribe & Save Savings Ticker': {
    type: 'Quick Win', ai: false,
    summary: 'Show customers a real-time calculated annual saving on the S&S toggle based on their pet\'s estimated consumption rate — making the value of subscribing tangible and specific rather than a generic percentage. "Save R1,842 a year based on Harvey\'s feeding schedule" is far more compelling than "Save 5%".',
    features: [
      'Savings ticker component on the S&S toggle — displays annual saving in rands',
      'Calculation engine: product price × S&S discount × deliveries per year based on bag size and pet weight',
      'Pet profile pre-fill — if pet weight is known, frequency is estimated and ticker populates automatically',
      '"How is this calculated?" tooltip with transparent methodology',
      'Ticker updates dynamically when customer changes bag size or product variant',
      'A/B test: ticker vs static percentage badge — measure conversion impact',
    ],
    links: [STAGING_RM, STAGING_PRI],
  },

  'Puppy Life Stage Journey': {
    type: 'Medium-term', ai: false,
    summary: 'Build an automated, stage-by-stage journey for new puppy owners — triggered from pet registration — that delivers the right nutrition advice, product recommendations, training resources, and vet reminders at each developmental stage from 8 weeks through to adulthood. This is the highest-engagement lifecycle segment PH serves.',
    features: [
      'Puppy journey trigger — activated on pet registration with age <12 months',
      'Stage-gated email series: 8wk, 12wk, 16wk, 6m, 12m — each with appropriate content and product shifts',
      'Product range progression: puppy food → junior food → adult food with timely transition prompts',
      'Vaccination and deworming reminder schedule integrated into the email journey',
      'Training milestone content — in-app tips or linked blog content for each growth phase',
      'Journey completion state — "Harvey is now an adult! Here\'s what changes" with adult range introduction',
    ],
    links: [STAGING_RM, STAGING_PRI],
  },

  'OOS Subscription Swap Email': {
    type: 'Quick Win', ai: true,
    summary: 'Automatically trigger a personalised email when a subscribed product goes out of stock — proactively offering AI-matched alternative products drawn from the customer\'s pet profile before the scheduled order fails. This converts a churn risk moment into a positive service interaction.',
    features: [
      'OOS detection trigger — fires within 1 hour of a subscribed SKU dropping to zero stock',
      'AI alternative matching — 3 ranked alternatives based on pet profile, same species, diet type, and price band',
      'Email template — warm tone, transparent about the OOS situation, presents alternatives with one-tap swap',
      'Direct swap action from email — customer swaps with one click, no login required for the action',
      'Fallback offer — if no suitable alternative found, offer to pause the subscription with one tap',
      'Swap email performance tracking — open rate, swap rate, cancellation rate vs non-contacted OOS cohort',
    ],
    links: [STAGING_RM, STAGING_PRI],
  },

  'AI Personalised Homepage': {
    type: 'Medium-term', ai: true,
    summary: 'Build a breed-specific, fully personalised homepage experience for logged-in customers — powered by pet profile data and purchase history — that replaces the generic one-size-fits-all homepage with a curated, relevant destination that feels like it was built for your specific pet.',
    features: [
      'Logged-in homepage hero — "Good morning, [name]. Here\'s what\'s new for Harvey" with pet photo if uploaded',
      'Personalised product recommendation strip — "Top picks for Harvey" using collaborative filtering + pet profile',
      'Breed-specific content blocks — breed-relevant health tips, featured articles, and specialist products',
      'Dynamic deals section — only deals relevant to the customer\'s registered species and breed',
      'Re-order strip — quick reorder of the customer\'s top 3 most-purchased products',
      'Personalisation transparency control — "Why am I seeing this?" link and preference management',
    ],
    links: [STAGING_RM, STAGING_PRI],
  },

  'AI Cross-sell Strip (Breed-based)': {
    type: 'Quick Win', ai: true,
    summary: 'Replace the generic "you may also like" cross-sell strip on PDP and cart with breed-specific, AI-curated recommendations — surfacing products that are genuinely relevant to a Golden Retriever vs a Siamese cat rather than just the most popular items. Breed-aware cross-sell dramatically improves recommendation relevance.',
    features: [
      'AI recommendation model layer that incorporates breed, life stage, and purchase history signals',
      'PDP breed-aware cross-sell strip — label: "Other [breed] owners also buy" or "Recommended for [breed]"',
      'Cart breed-aware cross-sell — surfaced before checkout with one-tap add',
      'Logged-out fallback — species-level recommendations when no pet profile is available',
      'A/B test: breed-specific vs generic cross-sell — measure attach rate and basket size impact',
      'Model performance dashboard — cross-sell CTR and attributed revenue by breed group',
    ],
    links: [STAGING_RM, STAGING_PRI],
  },

  'Pet Profile tied to Sign-up': {
    type: 'Quick Win', ai: false,
    summary: 'Move pet profile creation from a buried account menu item into step 2 of the account registration flow — capturing pet data at the moment of highest intent and turning every new account into a profiled, personalisation-ready customer from day one.',
    features: [
      'Registration flow extended to 2 steps — Step 1: account details, Step 2: "Tell us about your pet"',
      'Step 2 is optional but incentivised — "Get personalised recommendations" framing with visible benefit',
      'Minimal required fields — species, pet name, and approximate age (3 inputs max)',
      'Skip option with deferred prompt — skipped users see a profile completion nudge on first login',
      'Profile completion rate tracked as a registration funnel metric',
      'Completed profiles immediately feed personalised homepage and recommendation engine',
    ],
    links: [STAGING_RM, STAGING_PRI],
  },

  'WhatsApp UTM Tracking': {
    type: 'Quick Win', ai: false,
    summary: 'Add UTM parameters to all WhatsApp links shared by the CRM and CS teams, combined with webhook-based tracking for WhatsApp-to-web journeys — giving marketing full visibility into WhatsApp as an acquisition and re-engagement channel for the first time.',
    features: [
      'UTM parameter template — standard source/medium/campaign/content structure for WhatsApp links',
      'URL shortener with UTM baked in — readable short links for CS team use',
      'WhatsApp webhook integration — capture message events and link click signals in analytics',
      'Campaign tracking dashboard — WhatsApp channel traffic, landing page, and conversion attribution',
      'CS playbook update — documentation and training on UTM-tagged link usage',
      'Monthly WhatsApp channel performance report — sessions, conversions, and revenue attributed',
    ],
    links: [STAGING_RM, STAGING_PRI],
  },

  'AI Personalised Email Subject Lines': {
    type: 'Quick Win', ai: true,
    summary: 'Use AI to generate personalised email subject lines that incorporate the customer\'s pet name, purchase triggers, and an optimised send time — moving beyond batch-and-blast subject line templates to individualised messaging that drives open rates and downstream conversion.',
    features: [
      'AI subject line generation model trained on PH email performance data and pet profile signals',
      'Pet name variable injection — "Harvey\'s food is almost out…" vs generic "Reorder reminder"',
      'Send time personalisation — per-customer optimal send time based on historical open behaviour',
      'Subject line variant testing — AI generates 3 variants, winner auto-selected after 4-hour holdout',
      'Trigger-based subject line rules — different tone and content for reorder, birthday, OOS, and win-back triggers',
      'Open rate and downstream conversion reporting by personalisation type',
    ],
    links: [STAGING_RM, STAGING_PRI],
  },

  'AI Pet Advisor Widget': {
    type: 'Quick Win', ai: true,
    summary: 'Deploy an "Ask a pet question" AI widget on PDPs and the New Pet Parents page — giving customers instant, knowledgeable answers to pet care and nutrition questions and positioning Pet Heaven as the authoritative, trusted expert rather than just a retailer. The widget reduces pre-purchase anxiety and increases conversion.',
    features: [
      'AI chat widget embedded on PDP below product description — "Got a question about [product]?"',
      'Pet profile context injection — AI knows the customer\'s pet species, breed, and age when answering',
      'Product-specific knowledge base — AI trained on product data sheets, feeding guides, and vet-reviewed content',
      'New Pet Parents page placement — broader pet care Q&A mode for first-time owners',
      'Escalation path — "Speak to our pet care team" handoff for medical questions or complex queries',
      'Widget interaction analytics — top questions asked, satisfaction rating, and conversion impact',
    ],
    links: [STAGING_RM, STAGING_PRI],
  },

  'Rescue & Adoption Charity Partnerships': {
    type: 'Medium-term', ai: false,
    summary: 'Partner with SPCA, Dogtown SA, and other rescue organisations to provide a curated starter subscription pack at the adoption moment — the point of highest emotional engagement in any pet owner\'s journey. This builds brand love from day one and creates a first-to-subscribe cohort with strong lifetime value potential.',
    features: [
      'Rescue organisation partner programme — pack co-branding, fulfilment logistics, and commercial terms',
      'Adoption starter pack — 4-week trial subscription including food, treat, and care essentials',
      'Adoption moment trigger — pack voucher given at adoption with unique code tied to rescue partner',
      'Adoption-to-subscription conversion funnel — post-trial upsell to paid subscription with rescue discount',
      'Pet profile auto-creation from adoption form data — breed, age, and rescue organisation pre-filled',
      'Impact reporting — adoptions supported, conversion rate to paid subscriber, and co-branded content performance',
    ],
    links: [STAGING_RM, STAGING_PRI],
  },

  'Health & Wellness Top Nav': {
    type: 'Quick Win', ai: false,
    summary: 'Add Health & Wellness as a permanent, visible top-level navigation item on the Pet Heaven homepage — addressing its current invisibility in the navigation structure and immediately improving discoverability for one of the fastest-growing product categories in the pet market.',
    features: [
      'H&W added as a top-level nav item on desktop and mobile navigation',
      'H&W mega-menu — subcategories: Supplements, Dental Care, Flea & Tick, Skin & Coat, Joint Health',
      'H&W category SEO page — optimised meta title, description, and header content',
      'H&W featured product slots in mega-menu — editable via CMS',
      'Tracking of H&W category traffic uplift post-nav change',
      'Internal link audit — add H&W links from relevant PDP cross-sell sections and content pages',
    ],
    links: [STAGING_RM, STAGING_PRI],
  },

  'Competitive Price Scraper': {
    type: 'Quick Win', ai: false,
    summary: 'Build a weekly automated scraper that monitors Pet Heaven\'s top 50 SKUs against Takealot and Absolute Pets, flags SKUs where PH is more than 10% above the market price, and delivers a prioritised pricing review report to the commercial team.',
    features: [
      'Scraper targeting Takealot and Absolute Pets for top 50 PH SKUs by revenue',
      'Price match logic — normalise by product name, brand, size, and weight for accurate like-for-like comparison',
      'Weekly automated report — flagged SKUs ranked by revenue impact of price gap',
      '>10% gap alert — Slack or email notification to commercial team for same-day review',
      'Price history dashboard — track competitor pricing trends over time for negotiation context',
      'Expansion roadmap — extend to PriceCheck, Zando, and other relevant channels in phase 2',
    ],
    links: [STAGING_RM, STAGING_PRI],
  },

  'Subs Failure Report by SKU': {
    type: 'Quick Win', ai: false,
    summary: 'Build a live operational report that surfaces subscription payment and fulfilment failures broken down by SKU and grouped by supplier — showing revenue lost per failure event. This gives the commercial and ops teams the data they need to prioritise supplier and payment issues by business impact.',
    features: [
      'Live dashboard: subscription failures in the last 7/30/90 days, broken down by SKU',
      'Supplier grouping — failures aggregated by supplier with total revenue at risk per supplier',
      'Failure type breakdown — payment failure vs OOS fulfilment failure vs other',
      'Revenue lost calculation — subscription value × estimated failures per month per SKU',
      'Trend line — failure rate per SKU over time to identify worsening or improving patterns',
      'Export to CSV — for weekly ops review and supplier escalation with data-backed evidence',
    ],
    links: [STAGING_RM, STAGING_PRI],
  },

  'AI Pet Question Widget (PDPs)': {
    type: 'Quick Win', ai: true,
    summary: 'Deploy a brand education AI widget on PDPs specifically focused on helping customers understand whether a product is right for their pet — combining product knowledge with pet profile context to answer questions like "Is this suitable for a 10-week-old Labrador?" in real time.',
    features: [
      'PDP-embedded AI widget — "Ask a question about this product" entry point below the description',
      'Product knowledge base — AI trained on brand education materials, feeding guides, and ingredient data',
      'Pet profile context — logged-in customers get answers tailored to their specific pet',
      'Common question shortcuts — "Is this suitable for my pet?", "How much should I feed?", "What are the main ingredients?"',
      'Brand-voice tone — answers reflect PH positioning as knowledgeable, warm, and expert',
      'Question log and analytics — top queries per product to inform PDP content improvements',
    ],
    links: [STAGING_RM, STAGING_PRI],
  },

  'Health & Wellness — Discoverability': {
    type: 'Quick Win', ai: false,
    summary: 'Comprehensively improve the discoverability of the Health & Wellness category across the site — addressing navigation, search, content cross-linking, and category page quality in one coordinated initiative. H&W is a high-margin, high-growth category that is currently underperforming due to visibility gaps.',
    features: [
      'Top-level navigation item added (see Health & Wellness Top Nav project for specifics)',
      'H&W category page redesign — editorial header, curated sub-category sections, featured brands',
      'On-site search boost — H&W products surfaced prominently in health, supplement, and wellness search queries',
      'Cross-linking from PDP complementary products — H&W supplements cross-sold from food PDPs',
      'Homepage H&W feature slot — permanent or rotating banner placement in the commercial calendar',
      'H&W SEO content cluster — blog articles and guide pages linking back to category for organic traffic',
    ],
    links: [STAGING_RM, STAGING_PRI],
  },

  'FTN M2 Analytics': {
    type: '', ai: false,
    summary: 'Implement a comprehensive analytics tracking setup for the Faithful to Nature Magento 2 platform — establishing the event taxonomy, data layer, and reporting infrastructure needed to make data-driven product and marketing decisions on the M2 stack.',
    features: [
      'GA4 and/or PostHog implementation on FTN M2 with full ecommerce event tracking',
      'Data layer definition — product impressions, add-to-cart, checkout steps, purchase, and refund events',
      'Conversion funnel configuration — browse to purchase, account registration, and subscription sign-up',
      'Custom dimensions — product category, brand, subscription type, and customer segment',
      'Reporting dashboard — weekly trading metrics, channel performance, and funnel health',
      'Analytics QA process — event validation against a test order and data layer audit before launch',
    ],
    links: [STAGING_RM, STAGING_PRI],
  },

  'My Shop for PH': {
    type: 'Quick Win', ai: false,
    summary: 'Create a personalised "My Shop" experience for logged-in Pet Heaven customers — a curated, persistent page that surfaces their most-purchased products, personalised recommendations, active subscriptions, and quick reorder tools in one place. My Shop reduces time-to-purchase for returning customers.',
    features: [
      'My Shop page — accessible from account menu and homepage for logged-in users',
      'Recent orders quick-reorder strip — last 5 purchased products with one-tap add to cart',
      'Personalised picks section — AI-curated recommendations based on purchase history and pet profile',
      'Active subscriptions summary — next order dates and quick-edit links',
      'Saved products / wishlist — items the customer has saved for later',
      'My Shop engagement metrics — visit rate, reorder conversion, and basket value vs non-My-Shop sessions',
    ],
    links: [STAGING_RM, STAGING_PRI],
  },

  'Solution Based Categories': {
    type: 'Quick Win', ai: false,
    summary: 'Introduce solution-based category pages alongside or in place of product-type categories — organising products around the pet problems they solve (e.g. "Joint Health", "Sensitive Stomach", "Dental Care") rather than product type taxonomies. Customers searching for help think in problems, not product categories.',
    features: [
      'Solution category architecture — map existing products to solution categories across species',
      'Solution landing pages — editorial intro, symptom guide, and curated product set per solution',
      '"What\'s the problem?" navigation entry point — a guided filter to help customers find solutions',
      'Solution categories surfaced in search autocomplete — "joint" triggers "Joint Health" category',
      'Vet-reviewed solution content — short explainer on each condition to build trust and dwell time',
      'Solution category SEO — long-tail keyword targeting for condition-based queries',
    ],
    links: [STAGING_RM, STAGING_PRI],
  },

  'Start Using PostHog Features': {
    type: 'Quick Win', ai: false,
    summary: 'Move beyond initial PostHog installation to actively use its advanced features — session replay, heatmaps, feature flags, and A/B experiment infrastructure — building PostHog into the regular product development workflow so that every significant UX change is tested and measured.',
    features: [
      'Session replay review cadence — product team watches 10 session recordings per sprint for qualitative insights',
      'Heatmaps activated on homepage, PDP, and checkout — reviewed monthly with design team',
      'Feature flag system used for all new feature rollouts — gradual rollout and kill-switch capability',
      'First A/B experiment configured and launched within 2 weeks of activation',
      'PostHog insights shared in weekly product review meeting — standard agenda item',
      'Team training session — PM, design, and dev on PostHog experiment setup and results interpretation',
    ],
    links: [STAGING_RM, STAGING_PRI],
  },

  'Pet Profile Data Strategy': {
    type: 'Quick Win', ai: false,
    summary: 'Define and execute a strategy for making pet profile data genuinely actionable across personalisation, product recommendations, CRM, and product development — answering the question "what are we actually doing with this data?" with a concrete, prioritised delivery plan.',
    features: [
      'Pet profile data audit — what data is collected, completeness rate, and current usage across systems',
      'Data activation map — identify the 5 highest-ROI uses of pet profile data and prioritise implementation',
      'Profile completion rate improvement initiative — in-app prompts, post-purchase flow, incentive programme',
      'Pet profile → CRM integration — profile data flowing into email segmentation and personalisation triggers',
      'Pet profile → recommendations engine integration — profile as a first-order filter on all recommendation outputs',
      'Pet profile data governance — retention policy, POPIA compliance review, and customer-facing data controls',
    ],
    links: [STAGING_RM, STAGING_PRI],
  },

  // ── UCOOK ───────────────────────────────────────────────────────────────────

  'Recipe Card Proofreading': {
    type: 'Quick Win', ai: false,
    summary: 'Implement a structured quality check and correction process for all UCOOK recipe card copy and imagery before delivery — eliminating errors that damage the unboxing experience and erode brand trust. Recipe cards are a primary physical brand touchpoint and must reflect UCOOK\'s quality positioning.',
    features: [
      'Proofreading checklist — ingredients, quantities, steps, allergen callouts, and photography accuracy',
      'Pre-print review gate — no recipe card goes to print without a signed-off proofread',
      'Photography accuracy check — verify all plated dish images match the actual recipe output',
      'Copyediting standard — grammar, tone-of-voice, and formatting consistency guide',
      'Error log and root cause tracking — recurring error types flagged for upstream process fix',
      'Turnaround SLA — proofreading completed within 48 hours of draft submission',
    ],
    links: [STAGING_RM, STAGING_PRI],
  },

  'Acumatica Refactor': {
    type: 'Existing Roadmap', ai: false,
    summary: 'Refactor the Acumatica ERP integration to improve reliability, reduce sync errors, and make the codebase maintainable as UCOOK scales — addressing the technical debt that has accumulated in a critical business system that touches inventory, fulfilment, and finance.',
    features: [
      'Full integration audit — map all current Acumatica sync touchpoints, failure modes, and workarounds',
      'Error handling rewrite — structured logging, alerting, and automatic retry for failed sync events',
      'Data model alignment — ensure UCOOK data structures match Acumatica field expectations cleanly',
      'Idempotency implementation — safe to re-run sync jobs without creating duplicate records',
      'Staging environment for ERP integration testing — no more production-only testing of ERP changes',
      'Runbook documentation — on-call guide for diagnosing and resolving common sync failures',
    ],
    links: [STAGING_RM, STAGING_PRI],
  },

  'Customer Journey — Key Project': {
    type: 'Existing Roadmap', ai: false,
    summary: 'Define the full scope, requirements, user flow mapping, and technical architecture for UCOOK\'s end-to-end customer journey redesign — with the discovery and planning phase completed in Q1 so that development can begin in Q2. This is the foundational project that all other web and app enhancements depend on.',
    features: [
      'Current state journey mapping — document every customer touchpoint from discovery to retention',
      'Pain point and opportunity analysis — qualitative research with existing customers and lapsed users',
      'Future state journey design — desired experience mapped across all channels and life stages',
      'Functional requirements document — detailed spec for each journey stage and handoff',
      'Technical architecture proposal — stack, API design, and dependency map for the new journey build',
      'Q2 development kickoff pack — epics, stories, acceptance criteria, and sprint plan ready for dev',
    ],
    links: [STAGING_RM, STAGING_PRI],
  },

  'Yoyo — WiCodes': {
    type: 'Quick Win', ai: false,
    summary: 'Integrate Yoyo WiCodes into the UCOOK checkout flow for in-store and online loyalty payment functionality — enabling Yoyo-networked customers to pay or redeem loyalty at UCOOK across all channels.',
    features: [
      'Yoyo WiCode payment method added to UCOOK online checkout',
      'QR code / WiCode display at point of sale for in-store and event redemption',
      'Loyalty earn integration — Yoyo points awarded on UCOOK purchases',
      'Real-time balance display during checkout — customer sees available Yoyo balance before paying',
      'Partial payment support — use Yoyo balance for part of order, pay remainder by card',
      'Transaction reconciliation — Yoyo payments visible in finance and CS admin dashboards',
    ],
    links: [STAGING_RM, STAGING_PRI],
  },

  'Yoyo — Gift Voucher Replacement': {
    type: 'Existing Roadmap', ai: false,
    summary: 'Replace UCOOK\'s legacy gift voucher system with Yoyo-powered wrapped vouchers — improving flexibility, tracking, redemption UX, and enabling multi-channel voucher use for the first time.',
    features: [
      'Yoyo wrapped voucher API integration — issue, validate, and redeem vouchers via Yoyo platform',
      'Gift voucher purchase flow on UCOOK — select value, personalise message, checkout',
      'Digital delivery — recipient receives Yoyo-branded voucher via email with redemption instructions',
      'Checkout redemption — Yoyo voucher code field with balance display and partial use',
      'Voucher management portal — CS can issue, void, and check balance of any voucher',
      'Legacy voucher migration — existing outstanding balances mapped to Yoyo equivalents',
    ],
    links: [STAGING_RM, STAGING_PRI],
  },

  'WhatsApp Payment Links': {
    type: 'Quick Win', ai: false,
    summary: 'Enable UCOOK CS and CRM teams to send payment links via WhatsApp for conversational checkout — reducing cart abandonment from customers who engage via WhatsApp but drop off when redirected to the full web checkout flow.',
    features: [
      'Payment link generation tool — CS can create a pre-filled order link for a specific customer and basket',
      'WhatsApp message template with embedded payment link — compliant with WhatsApp Business API policies',
      'One-click checkout from link — customer lands on a streamlined payment page, order pre-populated',
      'Link expiry and single-use enforcement — links expire after 24 hours or first use',
      'Payment confirmation back to WhatsApp thread — automated confirmation message on successful payment',
      'WhatsApp payment link attribution — revenue and conversion tracked against WhatsApp channel in analytics',
    ],
    links: [STAGING_RM, STAGING_PRI],
  },

  'Capacitor iOS App': {
    type: 'Existing Roadmap', ai: false,
    summary: 'The UCOOK iOS app built with Capacitor is live on the App Store — delivering an improved mobile experience, push notification capability, and deeper engagement with UCOOK\'s most loyal customer segment. This is an active platform with ongoing enhancements planned.',
    features: [
      'Capacitor-based iOS app published and maintained on the Apple App Store',
      'Push notification infrastructure — order updates, meal kit reminders, and promotional messages',
      'App-specific onboarding flow — optimised for iOS device capabilities and screen sizes',
      'Deeplink support — marketing links open directly to the relevant in-app screen',
      'App-side analytics — event tracking for in-app behaviour distinct from web sessions',
      'App Store optimisation (ASO) — metadata, screenshots, and review response process established',
    ],
    links: [STAGING_RM, STAGING_PRI],
  },

  'Admin & PWA Upgrades': {
    type: 'Existing Roadmap', ai: false,
    summary: 'Upgrade the UCOOK admin panel and PWA to current framework versions — addressing performance degradation from outdated dependencies, improving developer tooling, and ensuring the admin UI keeps pace with the features being added to the customer-facing product.',
    features: [
      'Admin panel dependency upgrade — all packages updated to current stable versions',
      'PWA framework version bump — target current Nuxt/Next/React version with migration guide followed',
      'Performance benchmarking before and after — admin load time and PWA Lighthouse score targets',
      'Dev tooling improvements — faster local build times, improved HMR, updated linting config',
      'Regression testing suite run after upgrades — critical flows verified before deploying to production',
      'Upgrade documentation — change log and migration notes for the dev team',
    ],
    links: [STAGING_RM, STAGING_PRI],
  },

  'Mono Repo Architecture': {
    type: 'Existing Roadmap', ai: false,
    summary: 'Migrate the UCOOK codebase to a monorepo structure to enable unified dependency management, shared tooling, and faster cross-service development cycles — reducing the overhead of maintaining multiple separate repositories with diverging dependencies and duplicated utility code.',
    features: [
      'Monorepo tooling selection and configuration — Turborepo or Nx with workspace structure defined',
      'Codebase consolidation — all UCOOK services (web, admin, API, shared libs) moved into single repo',
      'Shared package library — common utilities, types, and UI components extracted and shared across apps',
      'Unified CI/CD pipeline — single pipeline configuration with per-app build and deploy targets',
      'Dependency deduplication — shared dependencies resolved at workspace root, reducing install size',
      'Developer experience benchmarks — build time, test time, and local setup time before and after',
    ],
    links: [STAGING_RM, STAGING_PRI],
  },

  'Recipe Management Portal': {
    type: 'Existing Roadmap', ai: false,
    summary: 'Build an internal portal for the UCOOK culinary team to create, edit, and approve recipe cards — eliminating manual handoffs via shared documents or email and giving the product and operations teams a single source of truth for recipe content.',
    features: [
      'Recipe CRUD interface — create, edit, duplicate, and archive recipes with structured fields',
      'Approval workflow — draft → review → approved → print-ready state machine with role-based access',
      'Photography asset management — upload, version, and link images to recipe cards',
      'Allergen and dietary flag management — structured fields with validation for common allergens',
      'Print-ready export — generate print-ready PDF from approved recipe record',
      'Audit log — full change history per recipe for accountability and rollback capability',
    ],
    links: [STAGING_RM, STAGING_PRI],
  },

  'CS Billing Tasks Efficiencies': {
    type: 'Quick Win', ai: false,
    summary: 'Streamline the most time-consuming manual billing tasks performed by the UCOOK customer service team — reducing average handling time, minimising escalation rates, and freeing CS capacity for higher-value customer interactions.',
    features: [
      'Billing task audit — time-study of current CS billing workflows to identify highest-volume manual steps',
      'Automated billing adjustment tool — CS can apply credits, refunds, and plan changes without dev support',
      'Billing FAQ bot — common billing questions answered automatically in CS chat before agent involvement',
      'Escalation reduction — self-serve billing update page for customers to pause, change plan, or update payment',
      'CS billing dashboard — all open billing issues in one view with SLA countdown and resolution status',
      'Handling time measurement — track average billing task resolution time before and after improvements',
    ],
    links: [STAGING_RM, STAGING_PRI],
  },

  'Discounts Refinements': {
    type: 'Quick Win', ai: false,
    summary: 'Improve the UCOOK discount engine to support more flexible promotion mechanics — including better rule stacking, CS override tools, and improved promotion management — reducing the workarounds the commercial and CS teams currently rely on to execute campaigns.',
    features: [
      'Discount rule stacking logic — define which discount types can and cannot be combined',
      'CS discount override tool — CS can manually apply or remove a discount to a specific order or account',
      'Promotion scheduler — set start and end dates for promotions without manual activation',
      'Discount code bulk generation — generate N unique codes for a campaign in one action',
      'Discount usage reporting — redemption rate, revenue impact, and fraud detection for each code',
      'Invalid discount error messaging — clear, human-readable reasons when a code doesn\'t apply',
    ],
    links: [STAGING_RM, STAGING_PRI],
  },

  'Yoyo — Loyalty Pro Integration': {
    type: 'Existing Roadmap', ai: false,
    summary: 'Implement the full Yoyo Loyalty Pro platform for UCOOK — enabling points earning, redemption, and tier management across both retail and online channels. Yoyo Loyalty Pro provides the infrastructure for a sustainable, long-term customer loyalty strategy.',
    features: [
      'Yoyo Loyalty Pro API integration — points earn events fired on all qualifying UCOOK transactions',
      'Loyalty tier system — Bronze, Silver, Gold tiers with defined earn multipliers and benefits per tier',
      'Points redemption at checkout — customer applies loyalty points as a payment method',
      'Loyalty account in UCOOK app — balance, tier status, history, and rewards catalogue',
      'Retail and online unified balance — points earned in any channel redeemable in all channels',
      'Loyalty programme performance dashboard — active members, points outstanding liability, and redemption rate',
    ],
    links: [STAGING_RM, STAGING_PRI],
  },

  'Order Attribution': {
    type: 'Existing Roadmap', ai: false,
    summary: 'Implement multi-touch order attribution modelling to correctly credit the marketing channels that contribute to UCOOK customer acquisition and reactivation — replacing last-click attribution with a more accurate model that reflects the true customer journey and informs media spend allocation.',
    features: [
      'Attribution model selection and configuration — linear, time-decay, or data-driven model evaluated and chosen',
      'Cross-channel tracking audit — UTM coverage, pixel firing, and server-side event verification',
      'Multi-touch attribution data pipeline — all touchpoints captured per order ID',
      'Attribution reporting dashboard — channel contribution by model, CAC by channel, and payback period',
      'Media spend reallocation analysis — how does spend shift when moving from last-click to chosen model',
      'Weekly attribution report delivered to marketing leadership with recommended actions',
    ],
    links: [STAGING_RM, STAGING_PRI],
  },

  'Loop Implementation': {
    type: 'Existing Roadmap', ai: false,
    summary: 'Implement Loop for UCOOK returns and exchanges — moving from a manual, CS-intensive returns process to a self-serve customer portal that reduces handling time, improves the return experience, and gives the operations team structured return data to act on.',
    features: [
      'Loop portal integration — customer-facing self-serve return and exchange initiation flow',
      'Return reason taxonomy — structured options that capture actionable product and logistics feedback',
      'Exchange flow — customer selects replacement before returning original, reducing refund-to-reorder drop-off',
      'Automated return label generation — Loop triggers collection booking with logistics partner',
      'CS dashboard — all open returns visible with status, reason, and SLA timer',
      'Returns analytics — top return reasons by SKU, return rate trends, and revenue recovery rate',
    ],
    links: [STAGING_RM, STAGING_PRI],
  },

  'Capacitor iOS App — Phase 2': {
    type: 'Existing Roadmap', ai: false,
    summary: 'Build on the live UCOOK iOS app with Phase 2 enhancements — deep-linked notifications, improved offline support, and App Clips integration — deepening engagement and extending the app\'s reach to users who haven\'t yet installed the full app.',
    features: [
      'Deep-linked push notifications — tapping a notification opens the specific in-app screen (e.g. this week\'s menu)',
      'Offline support improvements — graceful handling of poor connectivity, cached content, and retry on reconnect',
      'App Clips implementation — lightweight app experience for new user acquisition without full app install',
      'App Clips entry points — QR code on packaging and website links trigger App Clip for onboarding',
      'Notification permission optimisation — request at the right moment with a clear value proposition',
      'Phase 2 performance benchmarks — app size, launch time, and crash rate targets',
    ],
    links: [STAGING_RM, STAGING_PRI],
  },

  'Postgres Upgrade': {
    type: 'Existing Roadmap', ai: false,
    summary: 'Upgrade the UCOOK PostgreSQL database to the latest stable version to access improved performance features, close security vulnerabilities in the current version, and ensure continued support and compatibility with the evolving application stack.',
    features: [
      'Current vs target version assessment — breaking changes, deprecated features, and migration path documented',
      'Staging environment upgrade and validation — full application test suite run against new Postgres version',
      'Query performance benchmarking — identify queries that need rewriting to take advantage of new optimiser',
      'Index and vacuum strategy review — update autovacuum settings and index strategy for new version defaults',
      'Zero-downtime upgrade plan — replica promotion strategy to minimise production outage window',
      'Post-upgrade monitoring period — 2-week enhanced alerting on query performance and error rates',
    ],
    links: [STAGING_RM, STAGING_PRI],
  },

  'Logistics Overhaul': {
    type: 'Existing Roadmap', ai: false,
    summary: 'Conduct a comprehensive review and restructure of UCOOK\'s logistics and delivery operations to address delivery time variability, supplier bottlenecks, and customer experience failures at the last mile — the single biggest driver of UCOOK churn and negative reviews.',
    features: [
      'End-to-end logistics audit — map every step from order cut-off to customer delivery with time and failure data',
      'Carrier performance review — on-time delivery rate, damage rate, and SLA compliance by carrier',
      'Delivery window optimisation — assess feasibility of narrower delivery windows and AM/PM choice',
      'Supplier lead time renegotiation — identify the SKUs and suppliers creating bottlenecks in fulfilment',
      'Packaging review — assess damage rates and cold chain performance for different packaging configurations',
      'Customer communication improvements — proactive delivery delay notifications and real-time tracking link',
    ],
    links: [STAGING_RM, STAGING_PRI],
  },

  'Migration to Cluster': {
    type: 'Existing Roadmap', ai: false,
    summary: 'Migrate UCOOK\'s infrastructure to a cluster-based architecture for improved reliability, horizontal scalability, and reduced deployment risk — moving away from a single-instance setup that creates availability risk and limits the team\'s ability to scale individual services independently.',
    features: [
      'Cluster architecture design — Kubernetes or equivalent orchestration platform selected and configured',
      'Service containerisation — all UCOOK services Dockerised with production-grade Dockerfiles',
      'Horizontal scaling configuration — autoscaling rules for web, API, and worker services based on load',
      'Zero-downtime deployment pipeline — rolling deploy strategy with health check gates',
      'Observability stack — centralised logging, metrics, and tracing across all cluster services',
      'Disaster recovery runbook — cluster failure simulation, backup restore test, and on-call escalation guide',
    ],
    links: [STAGING_RM, STAGING_PRI],
  },

};

// ── Legacy / alias entries ─────────────────────────────────────────────────
// These entries let the flyout enrich legacy project names that may appear in
// older notion-data snapshots or manually-keyed items in the staging pages.

window.PROJECT_BRIEFS['Category Landing Page Enhancements'] = {
  type: 'Existing Roadmap', ai: false,
  summary: 'Redesign category landing pages to improve discoverability, commercial impact, and filtering UX — adding editorial headers, promo slots, improved attribute facets, and mobile-optimised layouts that make every category page a high-converting destination.',
  features: [
    'Editorial header section — lifestyle image, category description, and SEO copy',
    'Promo banner slot at top of category — CMS-managed, tied to commercial calendar',
    'Improved faceted filtering — species, life stage, brand, diet type, and price range',
    'Sort options — relevance, bestselling, price low/high, newest, highest rated',
    'Category-level promotional product pinning — manually elevate specific products to top of grid',
    'Mobile category page redesign — floating filter button, horizontal scroll facets, 2-column grid',
  ],
  links: [STAGING_RM, STAGING_PRI],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

var _ARR_SVG = '<svg class="f-brief-link-arr" width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M6 12l4-4-4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

function buildBriefHtml(name) {
  var brief = window.PROJECT_BRIEFS[name];
  if (!brief) return '';

  var featsHtml = (brief.features || []).map(function (f) {
    return '<li class="f-brief-feat"><span class="f-brief-dot"></span>' + _esc(f) + '</li>';
  }).join('');

  var linksHtml = (brief.links || []).map(function (l) {
    return (
      '<a class="f-brief-link" href="' + _esc(l.href) + '" target="_blank" rel="noopener noreferrer">' +
        '<span class="f-brief-link-icon">' + (l.icon || '') + '</span>' +
        '<span style="flex:1">' +
          '<span class="f-brief-link-title">' + _esc(l.label) + '</span>' +
          '<span class="f-brief-link-sub">' + _esc(l.sub) + '</span>' +
        '</span>' +
        _ARR_SVG +
      '</a>'
    );
  }).join('');

  return (
    '<div class="f-brief">' +
      '<div class="f-brief-lbl">Project Brief <span class="f-brief-badge">FY27 Roadmap</span></div>' +
      '<p class="f-brief-sum">' + _esc(brief.summary) + '</p>' +
      (featsHtml ? '<ul class="f-brief-feats">' + featsHtml + '</ul>' : '') +
      (linksHtml ? '<div class="f-brief-links">' + linksHtml + '</div>' : '') +
    '</div>'
  );
}

function getBriefMeta(name) {
  var brief = window.PROJECT_BRIEFS[name];
  if (!brief) return { type: '', ai: false };
  return { type: brief.type || '', ai: !!brief.ai };
}

function _esc(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

window.buildBriefHtml = buildBriefHtml;
window.getBriefMeta   = getBriefMeta;
