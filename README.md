# DevBolt

**111 free, privacy-first developer tools that run entirely in your browser.**

No signup. No tracking. Your data never leaves your device.

[devbolt.dev](https://devbolt.dev)

---

## What is DevBolt?

DevBolt is a free online toolkit for developers and power users. Every tool runs 100% client-side — nothing is sent to a server. JSON you paste, code you analyze, images you compress — all processed locally in your browser.

Built as an experiment in autonomous software: the site is designed, coded, deployed, and maintained by a team of AI agents (Claude Code) running on a schedule, with a human owner overseeing decisions.

## Features

- **111 tools** across 4 categories: Format, Convert, Generate, and Inspect
- **100% client-side** — your data never leaves your browser
- **No signup required** — open any tool and start using it immediately
- **Dark mode** — light, dark, and system themes
- **Command palette** — press `Ctrl+K` to instantly search and jump to any tool
- **Keyboard shortcuts** — `Ctrl+Enter` to execute in every tool
- **PWA support** — install as a desktop app, works offline
- **Pro API** — REST API with 8 endpoints for automation workflows

## Tool Catalog

### Format (7 tools)
JSON Formatter, SQL Formatter, XML Formatter, YAML Formatter, Markdown Preview, Code Minifier/Beautifier, Docker Compose Validator

### Convert (34 tools)
Base64 Codec, Color Converter, CSS Unit Converter, CSV/JSON Converter, JSON/YAML Converter, JSON/XML Converter, HTML/Markdown Converter, JSON to TypeScript, Epoch Converter, URL Encoder, HTML Entities, TOML Converter, Encode/Decode Multi-Tool, CSS to Tailwind, Tailwind to CSS, JSON to Code (8 languages), SVG to JSX, HTML to JSX, TypeScript to JavaScript, JSON to SQL, JSON to GraphQL, JSON to Zod, JSON to CSV, OpenAPI to TypeScript, GraphQL to TypeScript, SQL to TypeScript/Prisma/Drizzle, ESLint to Biome, cURL to Code, Text/Binary Converter, .env to Docker/K8s, and more

### Generate (39 tools)
Hash Generator, UUID Generator, Password Generator, Lorem Ipsum, QR Code, CSS Gradient Generator, Box Shadow Generator, Flexbox Generator, Grid Generator, CSS Animation Generator, Border Radius Generator, Text Shadow Generator, Color Palette, Placeholder Image, Favicon Generator, Meta Tag Generator, .gitignore Generator, robots.txt Generator, Crontab Generator, Nginx Config, README Generator, Privacy Policy Generator, JSON Mock Data, Regex Generator, JWT Builder, Security Headers, CSP Builder, AI Prompt Builder, MCP Config Builder, tsconfig Builder, package.json Generator, Code Screenshot, Markdown Table Generator, URL Slug Generator, ASCII Art Text, and more

### Inspect (31 tools)
JWT Decoder, Regex Tester, URL Parser, Diff Checker, JSON Diff, JSON Path Tester, JSON Schema Validator, JSON Visualizer, SVG Optimizer, Image Compressor, Color Contrast Checker, Word Counter, Chmod Calculator, Cron Parser, Number Base Converter, Case Converter, Subnet/CIDR Toolkit, Open Graph Preview, Date Format Tester, Token Counter, AI Model Comparison, Git Command Builder, File Hash Calculator, .env Validator, Dockerfile Validator, Kubernetes Validator, OpenAPI Validator, GitHub Actions Validator, HTTP Status Codes, Code Complexity Analyzer, AI Code Security Scanner, and more

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Runtime:** React 19
- **Hosting:** Vercel
- **Payments:** Stripe
- **Analytics:** Vercel Analytics (privacy-friendly, no cookies)

## How It's Built

DevBolt is autonomously managed by four AI agent roles:

| Agent | Role |
|-------|------|
| **Developer** | Builds features, fixes bugs, improves code quality |
| **Strategist** | Researches tools to build, analyzes SEO, plans the roadmap |
| **Health Monitor** | Verifies the app builds, lints, and deploys correctly |
| **Reporter** | Summarizes activity for the human owner |

The agents run on a schedule via Windows Task Scheduler. A human owner ([@benwalker14](https://github.com/benwalker14)) reviews decisions, manages finances, and handles external actions.

## Privacy

Every tool processes data locally in your browser using client-side JavaScript. DevBolt does not:

- Send your input data to any server
- Store your data anywhere
- Use tracking cookies
- Require an account to use tools

You can verify this yourself by opening your browser's Network tab while using any tool.

## Development

```bash
npm install
npm run dev      # Start dev server on port 3000
npm run build    # Production build
npm run lint     # Run ESLint
```

## License

All rights reserved.
