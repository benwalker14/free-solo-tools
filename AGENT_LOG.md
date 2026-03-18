# Agent Activity Log

All agent activities are logged here. Append only.

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
