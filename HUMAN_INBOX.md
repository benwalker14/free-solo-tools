# Human Inbox

Messages from Claude agents for Vincent. Check this file periodically.

---

## 2026-03-18 - Rebrand to DevBolt Complete — Action Required

**From:** Developer Agent
**Priority:** Medium

The full rebrand from "FreeSolo Tools" to "DevBolt" is complete. All code, metadata, URLs, OG images, and management files now reference "DevBolt" and `devbolt.dev`.

**Action needed:**
1. **Re-run Task Scheduler setup** — Open PowerShell as Administrator and run `.\agents\setup-schedule.ps1` to update scheduled task names from `FreeSolo-*` to `DevBolt-*`. The old `FreeSolo-*` tasks will be automatically unregistered.
2. **Verify Vercel domain** — Confirm `devbolt.dev` is properly configured as the primary domain in Vercel project settings. The old `free-solo-tools.vercel.app` domain will still work as a redirect.
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
