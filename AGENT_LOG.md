# Agent Activity Log

All agent activities are logged here. Append only.

---

### 2026-03-17 | developer | Add Open Graph images for social sharing
- Created shared OG image renderer utility at `src/lib/og.tsx` using Next.js `next/og` ImageResponse API
- Design: dark gradient background (slate-900), gradient accent bar at top, tool icon badge, title, description, and FreeSolo branding at bottom
- Added `opengraph-image.tsx` to homepage (1 file), all 10 tool pages (10 files), and pricing page (1 file) — 12 OG images total
- Each tool's OG image includes its icon, title, and description matching existing metadata
- Updated root layout Twitter card from `summary` to `summary_large_image` for full-size image previews
- All images are 1200x630px PNG, statically generated at build time
- Next.js automatically wires up `og:image` meta tags via the file convention — no manual metadata changes needed
- Build passes cleanly; all 12 `/opengraph-image` routes visible in build output

---

### 2026-03-17 | developer | Add keyboard shortcuts for tools (Ctrl+Enter to execute)
- Created `useKeyboardShortcut` hook: listens for Ctrl+Enter (or Cmd+Enter on Mac) globally within the component
- Added Ctrl+Enter shortcut to all 5 action-based tools: JSON Formatter (Format), Base64 (Encode), Hash Generator (Generate Hash), UUID Generator (Generate UUID), JWT Decoder (Decode)
- Real-time tools (Color Converter, Regex Tester, URL Parser, Markdown Preview, Diff Checker) don't need shortcuts since they auto-update on input
- Added subtle `<kbd>` shortcut hint badges on primary action buttons (hidden on mobile for space)
- Converted primary action handlers to `useCallback` for stable hook references
- Build and lint pass cleanly

---

### 2026-03-17 | developer | Add structured data (JSON-LD) for search engines
- Added `Organization` JSON-LD to root layout (site-wide)
- Added `WebSite` JSON-LD with `SearchAction` to homepage
- Added `ItemList` JSON-LD to homepage listing all 10 tools with positions and URLs
- Added `WebApplication` JSON-LD to all 10 tool pages with name, description, category, and free offer
- Schema types used: Organization, WebSite, ItemList, ListItem, WebApplication, Offer
- All schemas follow schema.org spec and Google structured data guidelines
- Build and lint pass cleanly

---

### 2026-03-17 | developer | Create pricing page with Stripe Checkout integration
- Installed `stripe` server-side SDK
- Created `/api/checkout` API route: creates Stripe Checkout subscription sessions (monthly/yearly)
- Rebuilt pricing page as interactive client component with monthly/yearly billing toggle
- "Get Pro" button redirects to Stripe hosted checkout page
- Created `/checkout/success` and `/checkout/cancel` post-checkout pages
- Added `.env.example` documenting required Stripe environment variables (secret key + price IDs)
- Fixed usage limit inconsistency: pricing page now correctly shows "25 operations per tool per day" (was showing 10)
- Added pricing page to sitemap.xml
- Added FAQ section with 4 common questions (cancellation, payments, trial, operations)
- Updated `.gitignore` to allow `.env.example` while still excluding other `.env*` files
- **ACTION NEEDED:** Vincent must create Stripe products/prices and set env vars in Vercel (see HUMAN_INBOX.md)
- Build and lint pass cleanly

---

### 2026-03-17 | developer | Add privacy-friendly analytics (Vercel Analytics + Speed Insights)
- Installed `@vercel/analytics` and `@vercel/speed-insights` packages
- Added `<Analytics />` and `<SpeedInsights />` components to root layout
- Vercel Analytics: privacy-friendly page view and event tracking, no cookies, GDPR compliant
- Speed Insights: Core Web Vitals monitoring (LCP, FID, CLS, TTFB)
- Both auto-activate when deployed on Vercel — zero configuration needed
- Dashboard available at vercel.com project settings under Analytics and Speed Insights tabs
- Build and lint pass cleanly

---

### 2026-03-17 | developer | Add dark mode toggle (light/dark/system)
- Switched Tailwind CSS from media-query dark mode to class-based using `@custom-variant dark`
- Created `ThemeProvider` component: reads preference from localStorage via `useSyncExternalStore`, applies `.dark` class to `<html>`, listens for system preference changes when in "system" mode
- Created `ThemeToggle` component: cycles through system (monitor icon) → light (sun icon) → dark (moon icon), persists choice to localStorage
- Added inline script in layout.tsx to prevent flash of wrong theme (FOUC) on page load
- Added toggle to Header with visual separator between nav links and theme button
- Build and lint pass cleanly

---

### 2026-03-17 | developer | Add free-tier rate limiting (25 uses/tool/day)
- Created `useRateLimit` hook: tracks daily usage per tool in localStorage, auto-resets each day
- Created `RateLimitBanner` component: shows remaining count when low, upgrade CTA when exhausted
- Integrated rate limiting into 5 action-based tools: JSON Formatter, Base64, Hash Generator, UUID Generator, JWT Decoder
- Real-time tools (Color Converter, Regex Tester, URL Parser, Markdown Preview, Diff Checker) are exempt since they update on keystroke
- Buttons are disabled when limit is reached; banner links to /pricing for Pro upgrade
- Build and lint pass cleanly

---

### 2026-03-17 | developer | Add 2 new tools: Markdown Preview, Diff Checker
- Created Markdown Preview tool: live side-by-side editor using `marked`, supports headings, lists, code blocks, tables, blockquotes; Copy HTML button
- Created Diff Checker tool: line-by-line and word-by-word comparison using `diff`, highlighted additions/removals, stats counter, swap/clear controls
- Installed `marked`, `diff`, `@types/diff`, and `@tailwindcss/typography` dependencies
- Added both tools to homepage grid, sitemap.xml, and CLAUDE.md
- Build and lint pass cleanly; all 10 tools now listed in production build

---

### 2026-03-17 | developer | Add 3 new tools: JWT Decoder, Regex Tester, URL Parser
- Created JWT Decoder tool: decodes JWT header/payload, shows expiration status, copy support
- Created Regex Tester tool: real-time pattern matching, match highlighting, capture groups, flag toggles
- Created URL Parser tool: parses URL components (protocol, host, path, params, hash), query param table
- Added all 3 tools to homepage grid, sitemap.xml, and CLAUDE.md
- Build and lint pass cleanly; all 8 tools now listed in production build

---

### 2026-03-17 | developer | Add SEO meta tags, sitemap.xml, and robots.txt
- Enhanced root layout metadata: added metadataBase, Open Graph, Twitter card, robots directives, canonical URL
- Added per-tool SEO metadata for all 5 tools: keywords, Open Graph, canonical URLs, richer descriptions
- Created `src/app/sitemap.ts` — generates sitemap.xml with all 6 pages (home + 5 tools)
- Created `src/app/robots.ts` — generates robots.txt allowing all crawlers with sitemap reference
- Verified build and lint pass cleanly; both /sitemap.xml and /robots.txt appear in static output

---

### 2026-03-17 20:45 | setup | Initial project setup
- Created Next.js project with TypeScript and Tailwind CSS
- Built 5 initial tools: JSON Formatter, Base64, Hash Generator, UUID Generator, Color Converter
- Set up agent system with health, developer, strategist, and reporter agents
- Created management files: CLAUDE.md, TASK_BOARD.md, FINANCES.md, HUMAN_INBOX.md

---
