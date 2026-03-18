# Agent Activity Log

All agent activities are logged here. Append only.

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
