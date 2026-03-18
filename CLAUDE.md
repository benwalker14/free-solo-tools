# DevBolt - Autonomous Web Application

## Overview
DevBolt is a free online utility tools platform. Users get fast, clean tools with no signup required. Revenue comes from premium subscriptions and tasteful advertising.

**Owner:** Vincent (GitHub: benwalker14)
**Stack:** Next.js 16 (App Router), TypeScript, Tailwind CSS 4, deployed on Vercel
**Production URL:** https://devbolt.dev/
**GitHub:** https://github.com/benwalker14/free-solo-tools
**Revenue Model:** Freemium - free tier with limits + Pro at $4.99/mo or $39.99/yr

## Architecture
- `src/app/` - Next.js App Router pages
- `src/app/tools/[tool-name]/` - Each tool has page.tsx (server, metadata) + [Name]Tool.tsx (client)
- `src/components/` - Shared React components (Header, Footer, ToolCard)
- `agents/` - Agent prompts and scripts
- All tools run entirely client-side (no backend API needed for tools)

## Agent System
This project is autonomously managed by Claude Code agents running on Windows Task Scheduler.

### Agent Types
- **health**: Checks app builds, runs lints, verifies deployment is up (every 4 hours)
- **developer**: Implements features, fixes bugs, improves code quality (twice daily)
- **strategist**: Researches new tools to add, analyzes SEO opportunities, plans roadmap (daily)
- **reporter**: Summarizes activities and writes updates to HUMAN_INBOX.md (daily)

### Agent Rules
1. ALWAYS read TASK_BOARD.md before starting work
2. ALWAYS log activities to AGENT_LOG.md (append, never overwrite)
3. NEVER spend money without logging to FINANCES.md and writing to HUMAN_INBOX.md
4. ALWAYS commit with clear, descriptive messages
5. ALWAYS push to GitHub after committing
6. Run `npm run build` before pushing to verify no build errors
7. Write to HUMAN_INBOX.md when you need human input (questions, decisions requiring approval)
8. Keep TASK_BOARD.md updated as you complete or add tasks
9. Do NOT delete or overwrite HUMAN_INBOX.md entries - only append
10. Respect the budget rules in FINANCES.md

## Key Commands
- `npm run dev` - Start dev server (port 3000)
- `npm run build` - Production build (always run before pushing)
- `npm run lint` - Run ESLint
- `git push origin master` - Deploy (Vercel auto-deploys from master)

## Current Tools
1. JSON Formatter & Validator (/tools/json-formatter)
2. Base64 Encoder & Decoder (/tools/base64)
3. Hash Generator - SHA family (/tools/hash-generator)
4. UUID Generator (/tools/uuid-generator)
5. Color Converter - HEX/RGB/HSL (/tools/color-converter)
6. JWT Decoder (/tools/jwt-decoder)
7. Regex Tester (/tools/regex-tester)
8. URL Parser (/tools/url-parser)
9. Markdown Preview (/tools/markdown-preview)
10. Diff Checker (/tools/diff-checker)
11. Epoch Converter (/tools/epoch-converter)
12. Password Generator (/tools/password-generator)
13. Lorem Ipsum Generator (/tools/lorem-ipsum)
14. Case Converter (/tools/case-converter)
15. Number Base Converter (/tools/number-base-converter)
16. CSV ↔ JSON Converter (/tools/csv-json)
17. Cron Expression Parser (/tools/cron-parser)
18. Word & Character Counter (/tools/word-counter)
19. URL Encoder & Decoder (/tools/url-encoder)
20. JSON ↔ YAML Converter (/tools/json-yaml)
21. Chmod Calculator (/tools/chmod-calculator)
22. HTML Entity Encoder & Decoder (/tools/html-entities)
23. CSS Gradient Generator (/tools/gradient-generator)
24. QR Code Generator (/tools/qr-code)
25. SQL Formatter & Beautifier (/tools/sql-formatter)
26. XML Formatter & Validator (/tools/xml-formatter)
27. JS/CSS/HTML Minifier & Beautifier (/tools/code-minifier)
28. Image to Base64 Converter (/tools/image-base64)
