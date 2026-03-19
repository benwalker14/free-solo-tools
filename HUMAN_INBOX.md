# Human Inbox

Messages from Claude agents for Vincent. Check this file periodically.

---

## 2026-03-18 - Phase 2 Strategy: From 60 Tools to First Revenue

**From:** Strategist Agent
**Priority:** High (P1 — strategic inflection point)

### TL;DR

DevBolt has 60 tools and zero revenue. The tool-building phase delivered massive output, but **more tools alone won't generate revenue**. It's time to shift from building to growing. This analysis identifies a critical SEO bug, recommends a 80/20 shift toward growth work, proposes the next selective tool wave, and lays out the content strategy needed to reach 10K+ monthly visits.

---

### Critical Finding: Blog Posts Missing from Sitemap

**Bug:** The 3 blog posts (JWT tutorial, Regex cheat sheet, cURL guide) are **not included in `sitemap.xml`**. Google may not discover this content efficiently. The sitemap currently includes all 60 tool pages and 25 sub-pages, but completely omits `/blog` and `/blog/*` URLs.

**Impact:** Blog content is our primary informational SEO play. Without sitemap inclusion, these posts may take weeks longer to get indexed, delaying the traffic funnel they're designed to create.

**Fix:** Developer agent should add blog posts to `src/app/sitemap.ts` — a 5-minute fix with outsized impact.

---

### Strategic Shift: 80% Growth / 20% Tools

We've reached a natural inflection point. At 60 tools, we cover the vast majority of common developer tool queries. Adding tool #61-#70 has **diminishing returns** compared to:
- Making our existing 60 tools discoverable (SEO)
- Creating content funnels that drive traffic to tools (blog)
- Turning traffic into revenue (ads, Pro subscriptions)

**Recommended effort allocation going forward:**
| Activity | % of Agent Time | Why |
|----------|----------------|-----|
| SEO optimization (sub-pages, sitemap, metadata) | 30% | Highest leverage — more indexed pages = more search traffic |
| Content marketing (blog posts, guides) | 25% | Informational queries drive 10x more traffic than tool queries |
| Revenue activation (ads, Stripe, Pro features) | 15% | Can't grow what we can't measure/monetize |
| New tools (selective, high-volume only) | 20% | Only tools with 25K+/mo searches and clear competitive gaps |
| UX/performance improvements | 10% | Retain users who do arrive |

---

### SEO Expansion Plan: From 85 Indexed Pages to 250+

**Current state:** 60 tool pages + 25 sub-pages + 6 static pages + 3 blog posts = ~94 indexable URLs.

**Target:** 250+ indexed pages within 30 days.

**How:**

#### 1. Programmatic Sub-Pages — Phase 2 (Priority: P1)
Currently only 10/60 tools have sub-pages. Expand to 40+ tools:

| Tool Cluster | Sub-page Examples | New Pages |
|-------------|-------------------|-----------|
| CSS generators (6 tools) | Individual property pages (e.g., /box-shadow/inset, /flexbox/center) | ~18 |
| Converter tools (21 tools) | Individual conversion pairs (e.g., /json-yaml/json-to-yaml) | ~30 |
| JSON tools (6 tools) | Use-case pages (e.g., /json-to-typescript/nested-objects) | ~12 |
| Generator tools (cron, gitignore, etc.) | Template/example pages (e.g., /gitignore-generator/node, /cron-generator/every-5-minutes) | ~20 |
| Remaining tools | FAQ/example pages | ~20 |
| **Total new sub-pages** | | **~100** |

Each sub-page already has the template from Phase 1 (FAQPage schema, content sections, breadcrumbs). The developer just needs to populate `tool-subpages.ts` with more entries.

#### 2. Blog Content Expansion — From 3 to 15 Posts (Priority: P1)
Target informational queries that funnel directly to our tools:

| Blog Post | Target Query | Linked Tool |
|-----------|-------------|-------------|
| "How to validate JSON: Common errors and fixes" | 40K+/mo | JSON Formatter |
| "Base64 encoding explained for beginners" | 25K+/mo | Base64 Codec |
| "Understanding Unix timestamps and epoch time" | 20K+/mo | Epoch Converter |
| "How to write a .gitignore file" | 30K+/mo | .gitignore Generator |
| "CSS Flexbox: A visual guide" | 50K+/mo | Flexbox Generator |
| "Docker Compose tutorial: From zero to multi-service" | 25K+/mo | Docker Compose Validator |
| "Understanding HTTP status codes" | 40K+/mo | (new reference page) |
| "How to generate UUIDs in JavaScript, Python, Go" | 15K+/mo | UUID Generator |
| "SVG optimization: Why and how" | 10K+/mo | SVG Optimizer |
| "CSS Grid layout: A complete guide" | 45K+/mo | Grid Generator |
| "JSON Path syntax explained with examples" | 10K+/mo | JSON Path Tester |
| "Color theory for web developers" | 15K+/mo | Color Palette Generator |

**Combined estimated search volume: 325K+/mo**. Even capturing 1% = 3,250 monthly visits from blog alone.

---

### Next Tool Wave: #63-#72 (Selective, High-Impact)

Only tools with **25K+/mo search volume** or **strong differentiation**:

| # | Tool | Est. Search Vol | Strategic Rationale |
|---|------|----------------|-------------------|
| 63 | **Timestamp / Date Format Tester** | 50K+/mo | Test strftime, moment.js, Intl patterns — no good free tool |
| 64 | **JSON Mock Data Generator** | 25K+/mo | Generate realistic fake JSON for APIs — competitors charge for this |
| 65 | **Privacy Policy Generator** | 100K+/mo | Legal template generator — massive search volume, low competition for dev-focused version |
| 66 | **HTTP Status Code Reference** | 40K+/mo | Evergreen reference page — sticky, bookmarkable, low maintenance |
| 67 | **README Generator** | 20K+/mo | GitHub README builder — complements Markdown tools, viral potential |
| 68 | **Placeholder Image Generator** | 15K+/mo | Generate placeholder images client-side with custom sizes/text |
| 69 | **robots.txt Generator** | 15K+/mo | Complements Meta Tag Generator, small but targeted audience |
| 70 | **ASCII Art Text Generator** | 20K+/mo | Fun tool with social sharing/viral potential |
| 71 | **File Hash Calculator** | 15K+/mo | Drag-and-drop file → SHA-256/MD5, extends Hash Generator |
| 72 | **Nginx Config Generator** | 15K+/mo | Growing query, no clean free tool exists |

**Build priority:** #63, #65, #66, #64, #67 first (highest volume, lowest complexity).

**Note on #65 (Privacy Policy Generator):** This is a breakout opportunity. "Privacy policy generator" gets 100K+ monthly searches. Most free generators are ad-heavy or require signup. A clean, fast, client-side version on DevBolt could become our single highest-traffic page.

---

### Revenue Acceleration

#### Stripe (P0 — STILL BLOCKING)
This was flagged on 2026-03-17 and again on 2026-03-18. Pro subscriptions cannot work without Stripe env vars in Vercel. Every day without this is a day we can't even test the conversion funnel.

**Minimum action:** Set up Stripe test mode keys in Vercel. Takes 15 minutes:
1. Go to https://dashboard.stripe.com → Get API keys
2. Create "DevBolt Pro" product with $4.99/mo and $39.99/yr prices
3. Add `STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID_MONTHLY`, `STRIPE_PRICE_ID_YEARLY` to Vercel env vars

#### Carbon Ads (P1 — Apply Now)
- Developer-focused, single ad per page, no tracking cookies
- Fits our privacy-first brand perfectly
- Expected CPM: $2-5 for developer audience
- At 10K monthly visits → ~$20-50/mo passive revenue
- Application at https://www.carbonads.net/

#### Ad Network Comparison (Research-Backed Numbers)

| Network | Est. Monthly at 100K PVs | Developer Perception | Entry Barrier |
|---------|-------------------------|---------------------|--------------|
| **EthicalAds** | ~$200/mo | Very Good | Low — apply directly |
| **Carbon Ads** | ~$170/mo | Excellent | High — invite-only |
| **Google AdSense** | $300-$1,500/mo | Poor (devs hate it) | Easy |
| **BuySellAds** | $200-$500/mo | Good | Medium — needs 50K+ traffic |

**Recommendation:** Start with **EthicalAds** — easiest to join, privacy-focused (no tracking), fits our brand. Apply to Carbon Ads later once traffic exceeds 50K/mo. **Avoid AdSense** — it damages trust with developer audiences and conflicts with our privacy-first positioning.

**Benchmark:** CodeBeautify makes ~$5,500/mo from ads at 2.3M monthly visits.

#### Affiliate Programs (Specific Opportunities)

| Program | Commission | Cookie Duration | Fit for DevBolt |
|---------|-----------|----------------|----------------|
| **DigitalOcean** | 10% recurring for 12 months | — | High — devs deploy tools |
| **Cloudways** | Up to $125/sale or $30 + 7% lifetime | 90 days | High |
| **Netlify** | Up to 20% revenue share | — | High — Next.js devs |
| **Hostinger** | 30-36% per sale | 30 days | Medium |

**Where to place:** Blog posts (deployment guides), tool pages (contextual), resource pages.
**Realistic early estimate:** $200-$500/mo once blog content matures.

#### NEW: Developer Newsletter (High-Leverage Addition)

A weekly "Developer Tips" newsletter can be a meaningful revenue stream with minimal effort:
- **Platform:** beehiiv (free plan up to 1,000 subscribers, built-in monetization)
- **Format:** 1 dev tip + 1 tool spotlight + 1 sponsor slot per week
- **Monetization:** beehiiv Boosts ($0.50-$2/subscriber acquired), sponsorships ($50-$100/issue at <5K subs)
- **Realistic goal:** 2,000 subscribers in 6 months = ~$200-$400/mo from sponsorships
- **Collection method:** Email opt-in on tool pages — "Get weekly developer tips. No spam."

#### Research-Backed Revenue Projections

**Conservative (6-12 months, 50K monthly pageviews):**

| Revenue Stream | Monthly Estimate |
|---------------|-----------------|
| Pro API subscriptions (~100 subscribers @ $4.99) | $500 |
| EthicalAds | $100 |
| Affiliate links (blog + contextual) | $200 |
| Newsletter sponsorships (~1K subscribers) | $100 |
| **Total** | **$900/month** |

**Optimistic (12-24 months, 200K monthly pageviews):**

| Revenue Stream | Monthly Estimate |
|---------------|-----------------|
| Pro API subscriptions (~500 subscribers @ $4.99) | $2,500 |
| Carbon Ads or EthicalAds | $400 |
| Affiliate links (mature blog) | $800 |
| Newsletter sponsorships (~5K subscribers) | $500 |
| Sponsored tool placements | $500 |
| **Total** | **$4,700/month** |

**Break-even on $500 budget:** Month 4-6 at conservative pace.

**Key freemium insight:** Developer tools see 2-5% free-to-paid conversion. At 10K monthly active users, expect 200-500 Pro subscribers. The free tier should work perfectly for individuals but create natural friction for teams (batch processing, saved sessions, collaboration).

---

### Competitive Positioning Update

We should lean harder into the **privacy-first positioning**. Our key differentiator vs CodeBeautify (540 cookies) and similar sites:

> "60+ developer tools. Zero tracking cookies. 100% client-side. Your data never leaves your browser."

This should be prominently displayed on the homepage and in all marketing. It's not just a feature — it's the brand.

**Recommended homepage tagline update:** Change from generic "Free Online Utilities" to something that communicates the privacy angle:
- "60+ Developer Tools. Zero Tracking. 100% Client-Side."
- "Fast, Free Developer Tools — Your Data Never Leaves Your Browser"

---

### Action Items Summary (Priority Order)

1. **[DEV — 5 min]** Fix sitemap bug: add blog posts to `sitemap.xml`
2. **[HUMAN — 15 min]** Set up Stripe test keys in Vercel (P0, still blocking since 2026-03-17)
3. **[HUMAN — 10 min]** Apply to EthicalAds (easiest entry) and/or Carbon Ads
4. **[DEV — 2 days]** Expand programmatic sub-pages from 25 → 125+ pages
5. **[DEV — 3 days]** Write 12 new blog posts targeting high-volume informational queries
6. **[DEV — 1 day]** Add email newsletter opt-in (beehiiv free tier) + collection points on tool pages
7. **[DEV — 1 day]** Build Privacy Policy Generator (#65) — potential breakout page (100K+/mo searches)
8. **[DEV — 1 day]** Build HTTP Status Code Reference (#66) — evergreen traffic magnet
9. **[DEV — 1 day]** Build Timestamp/Date Format Tester (#63)
10. **[DEV — ongoing]** Continue building tools #64, #67-#72 at reduced pace

---

## 2026-03-18 - Strategic Analysis: Growth Roadmap & Next Tool Wave

**From:** Strategist Agent
**Priority:** High (P1 — task board is empty, need direction)

### Executive Summary

DevBolt has 52 tools and $0 revenue. The task board is cleared. It's time to shift from pure tool building to a **growth + monetization** strategy. Below is a competitive analysis, the next tool wave, and a concrete growth plan.

---

### Competitive Landscape

**CodeBeautify.org** — Our #1 benchmark
- **2.1M monthly visits**, global rank ~40K
- **1,000+ tools** — they win on sheer volume
- Top traffic drivers: JSON tools, converters, random generators, unit converters
- **Weakness:** 540 tracking cookies, terrible privacy. Their privacy audit is damning.
- **Opportunity:** DevBolt runs 100% client-side with zero tracking cookies. This is a real differentiator.

**DevUtils.lol** — Privacy-focused competitor
- Similar "100% client-side" positioning as us
- Offers smart contract testing, broader tool set
- Growing via developer trust and privacy messaging

**Key Insight:** The market is splitting into "big & bloated with ads" (CodeBeautify, Online-Tools) vs "clean & private" (DevUtils, IT Tools). DevBolt should firmly position in the **clean & private** camp — it's a growing segment that commands premium pricing.

---

### Next Tool Wave: 10 High-Impact Tools (#53–#62)

Prioritized by **search volume × competitive gap × build complexity**:

| # | Tool | Search Volume | Why |
|---|------|--------------|-----|
| 53 | **JSON to CSV Converter** | 40K+/mo | Huge query, we only have CSV↔JSON — need dedicated page for reverse |
| 54 | **IP/Subnet/CIDR Calculator** (expand existing) | 35K+/mo | Network engineers search this constantly |
| 55 | **Diff Viewer for JSON** | 25K+/mo | JSON diff is searched separately from text diff |
| 56 | **Tailwind CSS Generator** | 30K+/mo | Hot framework, no competitor has a good one |
| 57 | **Regex Generator (AI-assisted)** | 20K+/mo | Describe pattern in English → get regex. Differentiator. |
| 58 | **TOML ↔ JSON/YAML Converter** | 15K+/mo | Growing with Rust/Cargo/pyproject.toml adoption |
| 59 | **Encode/Decode Multi-tool** (Base32, Hex, Binary, URL, HTML — all in one) | 30K+/mo combined | One page capturing long-tail for every encoding variant |
| 60 | **JavaScript/TypeScript Playground** | 25K+/mo | Run JS in-browser with console output, popular with learners |
| 61 | **Open Graph Preview / Debugger** | 20K+/mo | Test social sharing cards — complements our Meta Tag Generator |
| 62 | **Docker Compose Validator** | 15K+/mo | Growing with container adoption, no clean free tool exists |

**Build order recommendation:** #53, #56, #57, #60, #61 first (highest impact, lowest complexity).

---

### Growth Strategy (Non-Tool Work)

This is the **critical shift**. More tools alone won't drive revenue. Here's what will:

#### 1. Programmatic SEO Pages (P1 — Highest Impact)
Create template-driven pages that target long-tail searches:
- `/tools/json-formatter/examples` — "how to format nested JSON", "JSON with comments"
- `/tools/hash-generator/sha256` — individual pages per algorithm
- `/converters/json-to-[format]` — one page per conversion pair
- **Why:** CodeBeautify gets 2.1M visits largely because they have 1000+ indexed pages. We need more surface area. Each tool should spawn 2–3 sub-pages targeting specific long-tail queries.
- **Estimated impact:** 3–5x organic search impressions within 60 days.

#### 2. Content/Blog Section (P2)
Add a `/blog` or `/guides` section with:
- "How to decode a JWT token" (tutorial linking to our tool)
- "cURL command cheat sheet" (linking to curl converter)
- "Regex cheat sheet for JavaScript" (linking to regex tester)
- **Why:** Informational queries drive 10x more traffic than tool queries. A tutorial that links to the tool creates a funnel.

#### 3. Chrome Extension (P2)
- Quick-access extension with top 5 tools (JSON format, Base64, UUID, Hash, JWT)
- Links back to devbolt.dev for full features
- **Why:** Free distribution channel via Chrome Web Store. CodeBeautify has one.

#### 4. Ad Monetization — Start with Carbon Ads (P1)
- **Carbon Ads** (carbon.io) — developer-focused, tasteful, single-ad-per-page format
- Expected CPM: $2–5 for developer audience
- At 10K monthly visits → ~$20–50/mo. At 100K → ~$200–500/mo
- **Zero privacy compromise** — no tracking cookies, fits our brand
- **Why:** Revenue before Pro subscriptions kick in. Bridge the gap.

#### 5. Stripe Setup (P0 — BLOCKING)
- Pro subscriptions literally can't work until Stripe env vars are set in Vercel
- This was flagged on 2026-03-17 and is still pending
- **Action:** Set up Stripe test mode immediately, then go live

---

### Revenue Projections (Conservative)

| Milestone | Monthly Visits | Ad Revenue | Pro Subs | Total Monthly |
|-----------|---------------|------------|----------|---------------|
| Month 1 (now) | ~500 | $0 | $0 | $0 |
| Month 3 | 5K–10K | $10–50 | 1–2 ($5–10) | $15–60 |
| Month 6 | 25K–50K | $50–250 | 5–15 ($25–75) | $75–325 |
| Month 12 | 100K+ | $200–500 | 25–50 ($125–250) | $325–750 |

**Break-even on the $500 budget:** ~Month 6–8 at this pace.
**Key accelerator:** Programmatic SEO pages are the single highest-leverage activity.

---

### Recommended Task Board Update

**P0 (Critical):**
- [ ] Set up Stripe environment variables in Vercel (BLOCKING — no revenue without this)

**P1 (High — Growth):**
- [ ] Implement programmatic SEO: sub-pages for top 10 tools (e.g., /tools/hash-generator/sha256)
- [ ] Apply to Carbon Ads for developer-focused ad monetization
- [ ] Add JSON to CSV Converter tool (#53)
- [ ] Add Tailwind CSS Generator tool (#56)

**P2 (Medium — Content & Tools):**
- [ ] Add /blog section with 3 initial guides (JWT tutorial, Regex cheat sheet, cURL guide)
- [ ] Add AI-assisted Regex Generator tool (#57)
- [ ] Add JavaScript Playground tool (#60)
- [ ] Add Open Graph Preview tool (#61)
- [ ] Build Chrome Extension (top 5 tools quick access)

**P3 (Low — Expand Catalog):**
- [ ] Add TOML converter (#58)
- [ ] Add Encode/Decode multi-tool (#59)
- [ ] Add Docker Compose Validator (#62)
- [ ] Add JSON Diff tool (#55)
- [ ] Expand Subnet Calculator into full IP toolkit (#54)

---

## 2026-03-18 - Daily Report

**From:** Reporter Agent
**Priority:** Info

### What Happened Today

A massive day of autonomous development. The agents collectively shipped 36 new tools, a full rebrand, and multiple infrastructure improvements — all in a single day.

**Developer Agent (41 actions):**
- Built **22 new tools** (#25–#46): SQL Formatter, QR Code, CSS Gradient, HTML Entities, Chmod Calculator, JSON↔YAML, URL Encoder, Word Counter, CSV↔JSON, Number Base Converter, Case Converter, Lorem Ipsum, Password Generator, Epoch Converter, Color Palette, Image to Base64, JS/CSS/HTML Minifier, XML Formatter, JSON to TypeScript, HTML↔Markdown, YAML Formatter, JSON Path, SVG Optimizer, Image Compressor, Box Shadow, Contrast Checker, Flexbox Generator, Grid Generator, Border Radius, Text Shadow, CSS Animation, Markdown Table, Text↔Binary, Meta Tag Generator, JSON Schema Validator
- Completed **full rebrand** from FreeSolo Tools → DevBolt (40+ files updated, all URLs/metadata/OG images)
- Added **homepage search & filter** with category pills and consolidated tools data
- Added **PWA support** (service worker, installable app, offline caching)
- Added **tool usage analytics** (Vercel Analytics custom events)
- Added **favorites/bookmarks** system (localStorage)
- Added **missing OG images** for 8 tools
- Fixed broken /privacy and /terms links, added custom 404 page, fixed PWA icon branding
- Fixed lint warnings (0 errors, 0 warnings)
- Subnet Calculator (#47) is in progress (untracked files in git)

**Strategist Agent (2 actions):**
- Researched top 10 tool recommendations ranked by SEO impact
- Proposed 3 rebranding options (DevBolt was selected and executed)

**Health Agent (5 checks):**
- All 5 routine health checks passed — build, lint, git, production, and security all green
- Production at https://devbolt.dev/ responding correctly

### Current Status
- Tasks completed: 44
- Tasks in progress: 1 (Subnet Calculator #47 — code exists but not yet committed)
- Tasks pending: 2 (P3: API endpoints for Pro, batch processing for Pro)
- App health: **Healthy** — all checks passing, 0 vulnerabilities

### Financial Summary
- Balance: **$486.82**
- Revenue today: $0.00
- Expenses today: $13.18 (domain: devbolt.dev)
- Total budget spent: $13.18 of $500.00 (2.6%)

### Decisions Needed
1. ~~**Stripe setup still pending**~~ DONE (2026-03-18) — Env vars configured in Vercel.
2. ~~**Task Scheduler re-run needed**~~ DONE (2026-03-18) — Orchestrator replaced separate tasks.
3. ~~**Verify Vercel domain**~~ DONE (2026-03-18) — devbolt.dev is primary, www.devbolt.dev serves production, free-solo-tools.vercel.app redirects correctly.
4. **Tool catalog is now at 46 (47 pending)** — with the P2/P3 task board nearly empty, the strategist should be prompted for the next wave of tool priorities or a shift toward growth/monetization tasks.

---

## 2026-03-18 - Rebrand to DevBolt Complete — Action Required

**From:** Developer Agent
**Priority:** Medium

The full rebrand from "FreeSolo Tools" to "DevBolt" is complete. All code, metadata, URLs, OG images, and management files now reference "DevBolt" and `devbolt.dev`.

**Action needed:**
1. ~~**Re-run Task Scheduler setup**~~ DONE (2026-03-18)
2. ~~**Verify Vercel domain**~~ DONE (2026-03-18) — All three domains configured correctly.
3. **Note on localStorage** — Existing users' favorites and rate limit counters will reset since the storage keys changed (`freesolo-*` → `devbolt-*`). This only affects a small number of early users.

---

## 2026-03-18 - Rebranding Decision Needed: Pick a Product Name

**From:** Strategist Agent
**Priority:** High (P1 — blocks domain purchase and full rebrand)

The strategist has researched competitor naming, domain availability, and SEO considerations. Here are the top 3 options:

### Option 1: DevBolt (Recommended)
- **devbolt.dev** — Available, ~$12/yr
- Short (7 chars), energetic, "bolt" = speed/electricity. Lightning bolt logo writes itself.
- devbolt.com returns 404 (registered but unused — could negotiate later)

### Option 2: ByteTools (Best for SEO)
- **bytetools.dev** — Available, ~$12/yr
- "Tools" literally in the name = strong organic search match
- bytetools.com is parked (likely acquirable cheaply)

### Option 3: SnipTools (Best for Budget)
- **sniptools.com** AND **sniptools.dev** — Both available at standard price (~$10-12/yr each)
- Own both .com and .dev for under $25/yr total. No negotiation needed.

**Action needed:** Pick a name (or suggest your own) and I'll handle the full rebrand — rename across all files, update Vercel project, and buy the domain. Domain cost comes from the $500 budget.

**Strategy note:** I recommend starting with a .dev domain regardless of choice. It's HTTPS-enforced, developer-trusted, and cheap. Acquire .com later if brand takes off.

---

## 2026-03-18 - Next Tool Priorities (SEO-Driven)

**From:** Strategist Agent
**Priority:** Info

Based on competitor analysis and search volume data, the developer agent should build these next (in order):

1. **XML Formatter & Validator** — 56K monthly searches, every competitor has it, we don't. Biggest gap.
2. **JS/CSS/HTML Minifier & Beautifier** — 100K+ combined searches. minifier.org is a whole site for just this.
3. **Image to Base64 Converter** — 30K+ searches, natural extension of existing Base64 tool.

These 3 tools target 150K+ combined monthly searches and are all LOW complexity. Task board has been updated.

---

## 2026-03-17 - Stripe Setup Required for Pro Subscriptions

**From:** Developer Agent
**Priority:** High

The pricing page with Stripe Checkout is built and deployed. To activate Pro subscriptions, you need to:

1. **Create a Stripe account** (if you don't have one) at https://dashboard.stripe.com
2. **Create a product** called "DevBolt Pro" with two prices:
   - Monthly: $4.99/month recurring
   - Yearly: $39.99/year recurring
3. **Set these environment variables** in Vercel (Settings > Environment Variables):
   - `STRIPE_SECRET_KEY` — your Stripe secret key (starts with `sk_live_` or `sk_test_`)
   - `STRIPE_PRICE_ID_MONTHLY` — the monthly price ID (starts with `price_`)
   - `STRIPE_PRICE_ID_YEARLY` — the yearly price ID (starts with `price_`)

Until these are set, the "Get Pro" button will show a friendly error message. The pricing page is fully functional otherwise — billing toggle, FAQ, and success/cancel flows are all ready.

**Tip:** Use test mode keys first (`sk_test_`) to verify the flow before going live.

---

## 2026-03-17 - Initial Setup Complete

**From:** Setup Agent
**Priority:** Info

DevBolt has been initialized. Here's what's set up:
- Next.js app with 5 initial tools
- Agent system with scheduled tasks
- GitHub repo and Vercel deployment (pending your action)

**Action needed:**
1. Review the app and agent setup
2. Create a GitHub repo and push (instructions in agents/setup-guide.md)
3. Connect to Vercel for auto-deployment
4. Set up Windows Task Scheduler tasks (run agents/setup-schedule.ps1 as admin)

---
