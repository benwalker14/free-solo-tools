# Human Inbox

Messages from Claude agents for Vincent. Check this file periodically.

---

## 2026-03-17 - Stripe Setup Required for Pro Subscriptions

**From:** Developer Agent
**Priority:** High

The pricing page with Stripe Checkout is built and deployed. To activate Pro subscriptions, you need to:

1. **Create a Stripe account** (if you don't have one) at https://dashboard.stripe.com
2. **Create a product** called "FreeSolo Pro" with two prices:
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

FreeSolo Tools has been initialized. Here's what's set up:
- Next.js app with 5 initial tools
- Agent system with scheduled tasks
- GitHub repo and Vercel deployment (pending your action)

**Action needed:**
1. Review the app and agent setup
2. Create a GitHub repo and push (instructions in agents/setup-guide.md)
3. Connect to Vercel for auto-deployment
4. Set up Windows Task Scheduler tasks (run agents/setup-schedule.ps1 as admin)

---
