/**
 * Quick answer blocks for all tool pages.
 * 2-3 sentence direct answers displayed above the tool UI.
 * Optimized for AI Overview citation and featured snippet extraction.
 */
export const quickAnswers: Record<string, { question: string; answer: string }> = {
  "json-formatter": {
    question: "How do I format and validate JSON online?",
    answer:
      "Paste your JSON into the editor and click Format to instantly pretty-print it with proper indentation, or click Minify to compress it. The tool validates your JSON in real time, highlighting syntax errors with line numbers so you can fix them quickly. Everything runs in your browser — your data is never sent to a server.",
  },
  "base64": {
    question: "How do I encode or decode Base64 online?",
    answer:
      "Paste any text and click Encode to convert it to a Base64 string, or paste a Base64 string and click Decode to get the original text back. This tool supports full Unicode (including emoji and non-Latin characters) and runs entirely in your browser with no server round-trip.",
  },
  "hash-generator": {
    question: "How do I generate a SHA-256 or MD5 hash online?",
    answer:
      "Enter your text and instantly see its hash in SHA-1, SHA-256, SHA-384, SHA-512, and MD5. You can copy any hash with one click. All hashing is performed client-side using the Web Crypto API — your input never leaves your browser.",
  },
  "uuid-generator": {
    question: "How do I generate a UUID online?",
    answer:
      "Click Generate to create a cryptographically random UUID v4 instantly. You can generate UUIDs in bulk (up to 500 at once), choose between uppercase and lowercase, and copy all results with one click. UUIDs are generated in your browser using the native crypto API.",
  },
  "color-converter": {
    question: "How do I convert colors between HEX, RGB, and HSL?",
    answer:
      "Enter a color in any format — HEX (#ff6600), RGB (rgb(255, 102, 0)), or HSL (hsl(24, 100%, 50%)) — and instantly see it converted to all other formats. The tool includes a live color preview and lets you copy any value with one click.",
  },
  "jwt-decoder": {
    question: "How do I decode a JWT token online?",
    answer:
      "Paste your JWT token and instantly see its decoded header and payload as formatted JSON. The tool parses all standard claims (exp, iat, iss, sub, aud) and shows human-readable expiration dates. Your token is decoded entirely in the browser — it is never sent to any server.",
  },
  "regex-tester": {
    question: "How do I test a regular expression online?",
    answer:
      "Enter your regex pattern and test string, and see all matches highlighted in real time. The tool supports JavaScript regex flags (g, i, m, s, u), shows capture groups, and explains what each part of your pattern does. Everything runs client-side in your browser.",
  },
  "url-parser": {
    question: "How do I parse a URL into its components?",
    answer:
      "Paste any URL and instantly see it broken down into protocol, hostname, port, path, query parameters, and fragment. Query parameters are displayed in a searchable table. All parsing happens in your browser using the native URL API.",
  },
  "markdown-preview": {
    question: "How do I preview Markdown online?",
    answer:
      "Type or paste your Markdown in the editor and see a live-rendered preview side by side. The tool supports GitHub Flavored Markdown including tables, task lists, fenced code blocks with syntax highlighting, and strikethrough. Your content never leaves your browser.",
  },
  "diff-checker": {
    question: "How do I compare two texts and find differences online?",
    answer:
      "Paste your original text on the left and modified text on the right, then click Compare. The tool highlights added, removed, and changed lines with color coding. You can switch between inline and side-by-side views. All comparison runs locally in your browser.",
  },
  "epoch-converter": {
    question: "How do I convert a Unix timestamp to a human-readable date?",
    answer:
      "Paste a Unix epoch timestamp (seconds or milliseconds) and instantly see it as a formatted date and time in your local timezone and UTC. You can also convert any date/time back to an epoch timestamp. The tool shows the current epoch in real time.",
  },
  "password-generator": {
    question: "How do I generate a strong random password online?",
    answer:
      "Click Generate to create a cryptographically secure random password. Customize length (8-128 characters), and toggle uppercase, lowercase, numbers, and symbols. The tool shows a strength meter and entropy estimate. Passwords are generated locally — nothing is sent over the network.",
  },
  "lorem-ipsum": {
    question: "How do I generate lorem ipsum placeholder text online?",
    answer:
      "Select the number of paragraphs, sentences, or words you need and click Generate. The tool produces classic lorem ipsum placeholder text for your designs, mockups, and layouts. Copy the output with one click. Everything runs in your browser — no signup required.",
  },
  "case-converter": {
    question: "How do I convert text between camelCase, snake_case, and other cases?",
    answer:
      "Paste your text and instantly see it converted to camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, Title Case, and more. You can copy any result with one click. All processing happens in your browser.",
  },
  "number-base-converter": {
    question: "How do I convert numbers between binary, decimal, and hexadecimal?",
    answer:
      "Enter a number in any base — binary, octal, decimal, or hexadecimal — and instantly see it converted to all other bases. The tool handles large numbers and updates in real time as you type. Everything runs in your browser.",
  },
  "csv-json": {
    question: "How do I convert CSV to JSON or JSON to CSV online?",
    answer:
      "Paste CSV data to convert it to a JSON array of objects (using the first row as keys), or paste a JSON array to convert it to CSV format. The tool handles quoted fields, commas in values, and various delimiters. Everything runs client-side.",
  },
  "cron-parser": {
    question: "How do I read a cron expression in plain English?",
    answer:
      "Paste a cron expression (e.g., 0 9 * * MON-FRI) and instantly see its human-readable description plus the next scheduled run times. The tool supports standard 5-field cron syntax with minutes, hours, day-of-month, month, and day-of-week. Everything runs in your browser.",
  },
  "word-counter": {
    question: "How do I count words and characters in text online?",
    answer:
      "Paste or type your text to instantly see the word count, character count (with and without spaces), sentence count, paragraph count, and estimated reading time. The tool updates in real time as you type and runs entirely in your browser.",
  },
  "url-encoder": {
    question: "How do I URL-encode or decode a string online?",
    answer:
      "Paste your text and click Encode to percent-encode special characters for safe use in URLs, or paste an encoded string and click Decode to restore the original. The tool handles all Unicode characters and runs entirely in your browser.",
  },
  "json-yaml": {
    question: "How do I convert JSON to YAML or YAML to JSON online?",
    answer:
      "Paste JSON on one side to convert it to YAML, or paste YAML to convert it to JSON. The tool handles nested objects, arrays, multiline strings, and comments. Conversion is instant and runs entirely in your browser with no data sent to a server.",
  },
  "chmod-calculator": {
    question: "How do I calculate Unix file permissions (chmod)?",
    answer:
      "Toggle read, write, and execute checkboxes for owner, group, and others to instantly see the numeric (e.g., 755) and symbolic (e.g., rwxr-xr-x) permission values. You can also enter a numeric value to see which permissions it represents. Everything runs in your browser.",
  },
  "html-entities": {
    question: "How do I encode or decode HTML entities online?",
    answer:
      "Paste text containing special characters like <, >, &, or \" and click Encode to convert them to HTML entities (&lt;, &gt;, &amp;). Paste encoded text and click Decode to restore the original characters. The tool handles all named and numeric HTML entities. Everything runs in your browser.",
  },
  "gradient-generator": {
    question: "How do I create a CSS gradient online?",
    answer:
      "Pick your colors, adjust the angle or direction, and see a live preview of your gradient. The tool generates production-ready CSS for linear, radial, and conic gradients. Copy the CSS with one click and paste it directly into your stylesheet. Everything runs in your browser.",
  },
  "qr-code": {
    question: "How do I generate a QR code online?",
    answer:
      "Enter any text or URL and instantly generate a QR code you can download as PNG or SVG. Customize the size, error correction level, and foreground/background colors. The QR code is generated entirely in your browser with no server call.",
  },
  "sql-formatter": {
    question: "How do I format and beautify SQL online?",
    answer:
      "Paste your SQL query and click Format to instantly indent and align keywords, clauses, and expressions for readability. The tool supports standard SQL, PostgreSQL, MySQL, and other dialects. Your queries are formatted locally — they never leave your browser.",
  },
  "xml-formatter": {
    question: "How do I format and validate XML online?",
    answer:
      "Paste your XML and click Format to instantly pretty-print it with proper indentation, or click Minify to compress it. The tool validates your XML structure in real time, highlighting syntax errors like unclosed tags or mismatched elements. Everything runs in your browser — your data never leaves your device.",
  },
  "code-minifier": {
    question: "How do I minify or beautify JavaScript, CSS, or HTML online?",
    answer:
      "Paste your code, select the language (JavaScript, CSS, or HTML), and click Minify to strip whitespace and reduce file size, or click Beautify to format it with clean indentation. The tool shows the size reduction percentage. Everything runs in your browser — your code never leaves your device.",
  },
  "image-base64": {
    question: "How do I convert an image to Base64 online?",
    answer:
      "Drag and drop an image (or click to upload) and instantly get its Base64-encoded data URI string. You can copy it as a CSS background-image, HTML img src, or raw Base64. You can also decode a Base64 string back to a viewable image. Everything runs in your browser — your images never leave your device.",
  },
  "color-palette": {
    question: "How do I generate a color palette online?",
    answer:
      "Pick a base color and choose a harmony rule — complementary, analogous, triadic, tetradic, split-complementary, or monochromatic — to instantly generate a cohesive color palette. Each color shows HEX, RGB, and HSL values. Copy any value with one click. Everything runs in your browser.",
  },
  "json-to-typescript": {
    question: "How do I generate TypeScript interfaces from JSON?",
    answer:
      "Paste your JSON data and instantly get TypeScript interfaces with correctly inferred types for strings, numbers, booleans, arrays, nested objects, and nullable fields. Customize the root interface name and toggle between interface and type alias output. Everything runs in your browser — your data never leaves your device.",
  },
  "html-markdown": {
    question: "How do I convert HTML to Markdown or Markdown to HTML?",
    answer:
      "Paste HTML to convert it to clean Markdown, or paste Markdown to generate HTML. The tool handles headings, links, images, lists, tables, code blocks, bold, italic, and more. Conversion is instant and bidirectional. Everything runs in your browser — your content never leaves your device.",
  },
  "yaml-formatter": {
    question: "How do I format and validate YAML online?",
    answer:
      "Paste your YAML and click Format to pretty-print it with consistent indentation. The tool validates your YAML in real time, catching syntax errors like bad indentation, duplicate keys, and invalid characters. You can also minify YAML into compact form. Everything runs in your browser — your data never leaves your device.",
  },
  "json-path": {
    question: "How do I test JSONPath expressions online?",
    answer:
      "Paste your JSON data, type a JSONPath expression like $.store.book[*].title, and see matching results highlighted in real time. The tool supports dot notation, bracket notation, wildcards, array slicing, and filter expressions. Everything runs in your browser — your data never leaves your device.",
  },
  "svg-optimizer": {
    question: "How do I optimize and minify SVG files online?",
    answer:
      "Paste your SVG code or upload an SVG file and the tool removes metadata, editor data, comments, and unnecessary attributes to reduce file size. See a before/after comparison with size reduction percentage and a live preview. Everything runs in your browser — your SVGs never leave your device.",
  },
  "image-compressor": {
    question: "How do I compress images online without losing quality?",
    answer:
      "Drag and drop an image (JPEG, PNG, or WebP), adjust the quality slider, and optionally resize dimensions. The tool shows a side-by-side preview with file size comparison. Download the compressed image in JPEG, WebP, or PNG format. Everything runs in your browser — your images never leave your device.",
  },
  "box-shadow": {
    question: "How do I create a CSS box shadow online?",
    answer:
      "Adjust sliders for horizontal offset, vertical offset, blur radius, spread radius, and color to design your box shadow visually. Add multiple shadow layers, choose from presets, and see a live preview. Copy the production-ready CSS with one click. Everything runs in your browser.",
  },
  "contrast-checker": {
    question: "How do I check color contrast for accessibility (WCAG)?",
    answer:
      "Enter a foreground and background color to instantly see the contrast ratio and whether it passes WCAG 2.1 AA and AAA standards for normal text, large text, and UI components. The tool shows pass/fail badges for each level. Everything runs in your browser.",
  },
  "flexbox-generator": {
    question: "How do I build a CSS flexbox layout online?",
    answer:
      "Set flex container properties (direction, wrap, justify-content, align-items, gap) and configure individual flex items using visual controls. See a live preview of your layout and copy the production-ready CSS. Choose from presets like navbar, card grid, or holy grail. Everything runs in your browser.",
  },
  "grid-generator": {
    question: "How do I build a CSS grid layout online?",
    answer:
      "Define columns, rows, and gap with visual controls, then place items on the grid with a live preview. Configure grid-template-columns, grid-template-rows, and item placement. Choose from presets like dashboard, gallery, or sidebar layout. Copy the CSS with one click. Everything runs in your browser.",
  },
  "border-radius": {
    question: "How do I generate CSS border-radius online?",
    answer:
      "Adjust per-corner sliders to set border-radius values for top-left, top-right, bottom-right, and bottom-left independently. See a live preview shape, toggle between px, %, and em units, and choose from presets like pill, circle, or blob. Copy the CSS with one click. Everything runs in your browser.",
  },
  "text-shadow": {
    question: "How do I create a CSS text shadow online?",
    answer:
      "Adjust sliders for horizontal offset, vertical offset, blur radius, and color to design text shadows visually. Add multiple shadow layers for effects like neon glow, 3D text, or emboss. See a live preview and copy the production-ready CSS with one click. Everything runs in your browser.",
  },
  "css-animation": {
    question: "How do I create CSS keyframe animations online?",
    answer:
      "Choose from animation presets (fade, slide, bounce, rotate, pulse, and more) or build custom keyframe animations visually. Set timing function, duration, delay, iteration count, and direction. See a live preview and copy the production-ready @keyframes CSS. Everything runs in your browser.",
  },
  "markdown-table": {
    question: "How do I create a Markdown table online?",
    answer:
      "Add rows and columns with the visual editor, type your content, and set column alignment (left, center, right). The tool generates properly formatted Markdown table syntax that you can copy with one click. You can also import CSV data. Everything runs in your browser.",
  },
  "text-binary": {
    question: "How do I convert text to binary or binary to text online?",
    answer:
      "Enter text to instantly see it converted to binary (8-bit per character), hexadecimal, octal, or decimal representation. Paste binary or hex to decode it back to text. The tool handles full UTF-8 Unicode including emoji. Everything runs in your browser.",
  },
  "meta-tag-generator": {
    question: "How do I generate SEO meta tags online?",
    answer:
      "Fill in your page title, description, URL, and image to generate SEO meta tags, Open Graph tags, and Twitter Card tags. See live previews of how your page will appear in Google results and social media shares. Copy the HTML with one click. Everything runs in your browser.",
  },
  "json-schema": {
    question: "How do I validate JSON against a JSON Schema online?",
    answer:
      "Paste your JSON data and JSON Schema (Draft 07) to instantly validate the data against the schema. The tool reports all validation errors with paths to the failing fields. You can also generate a schema from sample JSON data. Everything runs in your browser — your data never leaves your device.",
  },
  "subnet-calculator": {
    question: "How do I calculate subnets and CIDR ranges online?",
    answer:
      "Enter an IP address with CIDR notation (e.g., 192.168.1.0/24) to see the network address, broadcast address, usable host range, and total hosts. Use the VLSM divider to split networks, convert IP ranges to CIDR, or classify any IP address. Everything runs in your browser.",
  },
  "gitignore-generator": {
    question: "How do I generate a .gitignore file online?",
    answer:
      "Select from 50+ templates for Node.js, Python, Java, Go, Rust, and more, then generate a comprehensive .gitignore file. Combine multiple templates for monorepos. Download or copy the result with one click. Everything runs in your browser — no signup required.",
  },
  "cron-generator": {
    question: "How do I generate a cron expression online?",
    answer:
      "Select the frequency (every minute, hourly, daily, weekly, monthly), pick the time and days, and the tool generates the correct cron expression. See a human-readable description and the next run times to verify your schedule. Copy the expression with one click. Everything runs in your browser.",
  },
  "favicon-generator": {
    question: "How do I generate a favicon online?",
    answer:
      "Type a letter, emoji, or short text, choose colors and font, and generate favicons in multiple sizes (16x16, 32x32, 180x180). Download PNG icons, an SVG favicon, Apple Touch Icon, and the HTML link tags to add to your site. Everything runs in your browser — no signup required.",
  },
  "slug-generator": {
    question: "How do I convert text to a URL slug online?",
    answer:
      "Paste any text and instantly get a clean, URL-friendly slug with lowercase letters, hyphens, and no special characters. The tool handles Unicode, transliterates accented characters, and supports bulk conversion. Copy with one click. Everything runs in your browser.",
  },
  "curl-converter": {
    question: "How do I convert a cURL command to code?",
    answer:
      "Paste a cURL command and instantly get equivalent code in JavaScript (fetch/axios), Python (requests), Go, PHP, Ruby, and Java. The tool parses headers, data payloads, authentication, and all common cURL flags. Everything runs in your browser — your requests are never sent to a server.",
  },
  "json-to-csv": {
    question: "How do I convert JSON to CSV online?",
    answer:
      "Paste a JSON array of objects and instantly get a CSV file with headers extracted from the JSON keys. The tool flattens nested objects, lets you select columns, and handles special characters. Download as .csv or copy to clipboard. Everything runs in your browser.",
  },
  "tailwind-generator": {
    question: "How do I build Tailwind CSS classes visually online?",
    answer:
      "Use the visual builder to configure spacing, typography, colors, borders, layout, and effects, then see the generated Tailwind utility classes and a live preview. Choose from component presets like buttons, cards, and inputs. Copy the classes with one click. Everything runs in your browser.",
  },
  "og-preview": {
    question: "How do I preview Open Graph and Twitter Card meta tags?",
    answer:
      "Enter a URL or paste HTML containing meta tags to see how your page will look when shared on Facebook, Twitter/X, LinkedIn, and Slack. The tool validates required tags and flags missing or incorrect Open Graph and Twitter Card properties. Everything runs in your browser.",
  },
  "js-playground": {
    question: "How do I run JavaScript or TypeScript in my browser?",
    answer:
      "Type or paste JavaScript or TypeScript code in the editor and click Run to execute it instantly with console output. The tool captures console.log, errors, and return values in a built-in console. Choose from example snippets to get started. Everything runs in a sandboxed environment in your browser.",
  },
  "json-diff": {
    question: "How do I compare two JSON objects online?",
    answer:
      "Paste the original JSON on the left and the modified JSON on the right, then click Compare. The tool shows structural differences — added keys, removed keys, and changed values — in a tree view with color coding. Expand or collapse nodes to focus on specific changes. Everything runs in your browser.",
  },
  "toml-converter": {
    question: "How do I convert TOML to JSON or YAML online?",
    answer:
      "Paste your TOML content (e.g., Cargo.toml, pyproject.toml) and instantly convert it to JSON or YAML. You can also convert JSON or YAML back to TOML. The tool handles nested tables, arrays of tables, and inline tables. Everything runs in your browser.",
  },
  "encode-decode": {
    question: "How do I encode or decode text in multiple formats online?",
    answer:
      "Paste text and instantly encode or decode it in Base64, Base32, Hex, Binary, URL encoding, and HTML entities — all from a single interface. Switch between formats with one click. The tool handles full Unicode. Everything runs in your browser — your data never leaves your device.",
  },
  "docker-compose": {
    question: "How do I validate a Docker Compose file online?",
    answer:
      "Paste your docker-compose.yml and click Validate to check for syntax errors, invalid service configurations, undefined networks, circular dependencies, and best practice violations. The tool formats your compose file and highlights issues with fix suggestions. Everything runs in your browser.",
  },
  "privacy-policy": {
    question: "How do I generate a privacy policy online?",
    answer:
      "Fill in your company name, website, contact info, and select the data practices that apply — cookies, analytics, third-party services, GDPR, CCPA, COPPA compliance. The tool generates a customized privacy policy you can copy or download. Everything runs in your browser — your information never leaves your device.",
  },
  "http-status-codes": {
    question: "What do HTTP status codes mean?",
    answer:
      "Browse the complete reference of 63 HTTP status codes organized by category — 1xx informational, 2xx success, 3xx redirection, 4xx client error, 5xx server error. Each code includes a description, common causes, and how to handle it. Search or filter to find any code quickly.",
  },
  "date-format-tester": {
    question: "How do I test date format patterns online?",
    answer:
      "Enter a date format pattern (strftime, date-fns/Unicode, Go, or Java style) and see the formatted output for any date in real time. The tool shows a token reference table with all available format specifiers. Choose from common presets like ISO 8601 or RFC 2822. Everything runs in your browser.",
  },
  "json-mock-generator": {
    question: "How do I generate fake JSON data for testing?",
    answer:
      "Define a schema with 30+ field types (names, emails, addresses, dates, UUIDs, custom patterns) or choose from templates like Users, Products, or Orders. Generate up to 500 rows of realistic mock data. Download as .json or copy to clipboard. Everything runs in your browser — no API key required.",
  },
  "readme-generator": {
    question: "How do I generate a GitHub README online?",
    answer:
      "Fill in your project details and toggle sections like badges, installation, usage, API reference, contributing, and license. The tool generates a professional README.md with shields.io badges, code blocks, and proper Markdown formatting. Copy or download the result. Everything runs in your browser.",
  },
  "dockerfile-validator": {
    question: "How do I validate a Dockerfile online?",
    answer:
      "Paste your Dockerfile and click Validate to check for syntax errors, security issues (running as root, latest tags), best practices (multi-stage builds, layer optimization), and deprecated instructions. Each issue includes a severity, line number, and fix suggestion. Everything runs in your browser.",
  },
  "k8s-validator": {
    question: "How do I validate Kubernetes YAML online?",
    answer:
      "Paste your Kubernetes manifest and click Validate to check for missing required fields, invalid resource types, label/selector mismatches, security issues, and best practices like resource limits and health probes. Supports 20+ resource types and multi-document YAML. Everything runs in your browser.",
  },
  "robots-generator": {
    question: "How do I generate a robots.txt file online?",
    answer:
      "Select which bots to allow or block — Googlebot, Bingbot, AI crawlers (GPTBot, ClaudeBot, CCBot), and more. Add custom allow/disallow paths, specify sitemaps, and set crawl delays. Choose from presets like allow all, block all, or block AI bots. Copy or download the result. Everything runs in your browser.",
  },
  "openapi-validator": {
    question: "How do I validate an OpenAPI or Swagger spec online?",
    answer:
      "Paste your OpenAPI 3.x or Swagger 2.0 spec in JSON or YAML format and click Validate. The tool checks structure, paths, operations, parameters, schemas, security definitions, $ref resolution, and best practices. Issues are grouped by severity with specific fix guidance. Everything runs in your browser.",
  },
  "zod-schema": {
    question: "How do I generate a Zod schema from JSON?",
    answer:
      "Paste sample JSON data and the tool infers a Zod validation schema with auto-detected types including email, URL, UUID, and datetime formats. Toggle options like .optional(), .strict(), coerce mode, and z.infer type alias. Copy the output and use it directly in your TypeScript project. Everything runs in your browser.",
  },
  "placeholder-image": {
    question: "How do I generate a placeholder image online?",
    answer:
      "Enter dimensions or choose from 16 presets (social media, device sizes, ad formats), pick colors and optional text, then download as PNG, JPEG, WebP, or SVG. The tool auto-sizes text and auto-contrasts colors. Copy the data URL for inline use. Everything runs in your browser — no external service needed.",
  },
  "nginx-config": {
    question: "How do I generate an Nginx configuration file online?",
    answer:
      "Choose a preset (static site, reverse proxy, SPA, Node.js, PHP, load balancer, HTTPS) and customize server blocks, SSL/TLS settings, gzip compression, security headers, rate limiting, and upstream servers. The tool generates a complete nginx.conf you can copy or download. Everything runs in your browser.",
  },
  "env-validator": {
    question: "How do I validate a .env file online?",
    answer:
      "Paste your .env file and the tool checks for syntax errors, duplicate keys, naming convention violations, exposed secrets (passwords, API keys), and missing quotes. Use Compare mode to diff .env vs .env.example for missing or extra variables. Export a clean .env.example template. Everything runs in your browser.",
  },
  "file-hash": {
    question: "How do I calculate a file hash (checksum) online?",
    answer:
      "Drag and drop any file to instantly compute its MD5, SHA-1, SHA-256, SHA-384, and SHA-512 hashes. Use Verify mode to paste an expected hash and check if it matches. File hashing uses the Web Crypto API and runs entirely in your browser — your files never leave your device.",
  },
  "ascii-art": {
    question: "How do I generate ASCII art text online?",
    answer:
      "Type your text (up to 30 characters) and choose from 7 font styles — Banner, Block, Shadow, Slim, Star, Dot, and Lines. Optionally wrap the output in comment syntax for C/JS, Python/Shell, HTML, or a box border. Copy the result with one click. Everything runs in your browser.",
  },
  "regex-generator": {
    question: "How do I generate a regex pattern from a description?",
    answer:
      "Describe what you need to match in plain English, or browse 60+ curated patterns across 10 categories (email, URL, IP, date, phone, and more). Use the visual composer to build patterns from building blocks, then test them live with match highlighting. Everything runs in your browser.",
  },
  "token-counter": {
    question: "How do I count LLM tokens and estimate API costs?",
    answer:
      "Paste your text and select a model (GPT-4o, Claude, Gemini, Llama, Mistral, DeepSeek) to see the token count and estimated API cost. The tool uses BPE tokenization, shows context window usage, and lets you compare costs across 19 models from 6 providers. Everything runs in your browser.",
  },
  "ai-model-comparison": {
    question: "How do I compare AI models and coding IDEs?",
    answer:
      "Browse and compare 23 AI models from OpenAI, Anthropic, Google, Meta, Mistral, DeepSeek, and xAI plus 5 coding IDEs. Filter by provider, tier, or capabilities, sort by context window or pricing, and view side-by-side comparisons of up to 4 models. Data is regularly updated with the latest pricing.",
  },
  "git-command-builder": {
    question: "How do I build git commands online?",
    answer:
      "Select a git operation (clone, branch, merge, rebase, stash, reset, tag, and more) and fill in the parameters using a visual form. The tool generates the correct git command with warnings for destructive operations. Browse the 80+ entry cheat sheet for quick reference. Everything runs in your browser.",
  },
  "csp-builder": {
    question: "How do I build a Content Security Policy header online?",
    answer:
      "Configure 17 CSP directives (default-src, script-src, style-src, img-src, and more) using visual controls with source value options. Choose from framework presets for Next.js, React, WordPress, or API servers. See a real-time security analysis with a letter grade. Export as HTTP header, meta tag, or Nginx/Apache/Vercel/Netlify config. Everything runs in your browser.",
  },
  "html-to-jsx": {
    question: "How do I convert HTML to JSX for React?",
    answer:
      "Paste your HTML and instantly get valid JSX with 50+ attribute conversions — class to className, for to htmlFor, inline styles to objects, SVG attributes to camelCase, and void elements self-closed. The tool shows a change log of all transformations. Everything runs in your browser.",
  },
  "json-to-code": {
    question: "How do I generate typed code from JSON?",
    answer:
      "Paste JSON data and select a language — Go, Python, Java, C#, Dart, Rust, Swift, or Kotlin — to generate typed structs, classes, or dataclasses with proper type inference, naming conventions, and serialization annotations. The tool handles nested objects, arrays, and null values. Everything runs in your browser.",
  },
  "code-screenshot": {
    question: "How do I create a code screenshot online?",
    answer:
      "Paste your code, choose a theme (Dracula, Monokai, GitHub Dark, Nord, and more), select the language for syntax highlighting, pick a background style, and export as a high-resolution PNG or JPEG. Customize padding, font size, line numbers, and window chrome. Everything runs in your browser — a free alternative to Carbon and Ray.so.",
  },
  "css-to-tailwind": {
    question: "How do I convert CSS to Tailwind utility classes?",
    answer:
      "Paste your CSS rules and instantly see the equivalent Tailwind utility classes for 100+ properties — layout, spacing, typography, borders, effects, transforms, and more. The tool handles shorthand expansion and shows any unconverted properties. Everything runs in your browser.",
  },
  "json-visualizer": {
    question: "How do I visualize JSON as an interactive tree?",
    answer:
      "Paste your JSON and see it rendered as a collapsible tree with color-coded types (strings, numbers, booleans, nulls). Search for keys or values, copy JSONPath on hover, and control the expand depth. The tool shows data statistics including total keys, depth, and type counts. Everything runs in your browser.",
  },
  "svg-to-jsx": {
    question: "How do I convert SVG to a React component?",
    answer:
      "Paste your SVG and get JSX or a full React/TypeScript component with 80+ attributes converted to camelCase, inline styles as objects, and xmlns stripped. Options include forwardRef, memo, props spread, custom component name, and TypeScript output. See a preview of the SVG. Everything runs in your browser.",
  },
  "prompt-builder": {
    question: "How do I build AI prompts for developers?",
    answer:
      "Choose from 8 developer templates (code review, unit tests, API docs, data analysis, commit messages, SQL queries, refactoring, code explanation), customize with reusable {{variables}}, and export in 5 formats — plain text, system+user, OpenAI API, Anthropic API, or Gemini API. Everything runs in your browser.",
  },
  "mcp-config-builder": {
    question: "How do I build an MCP configuration file?",
    answer:
      "Select your MCP client (Claude Desktop, Cursor, VS Code, Windsurf, Claude Code), add servers from 16 templates (filesystem, GitHub, Slack, Postgres, and more), configure transport and arguments, and generate a valid MCP config file. Copy or download the result. Everything runs in your browser.",
  },
  "openapi-to-typescript": {
    question: "How do I convert an OpenAPI spec to TypeScript?",
    answer:
      "Paste your OpenAPI 3.x or Swagger 2.0 spec in JSON or YAML format and instantly get TypeScript interfaces and types. The tool resolves $ref references, handles allOf/oneOf/anyOf, generates enums, and creates API operation types. Download the .ts file or copy to clipboard. Everything runs in your browser.",
  },
  "json-to-zod": {
    question: "How do I convert JSON or JSON Schema to Zod?",
    answer:
      "Paste JSON data (the tool infers types) or a JSON Schema (precise conversion with $ref, allOf/oneOf/anyOf, format constraints, and defaults). The output is a production-ready Zod schema with .optional(), .strict(), coerce, and .describe() options. Download as .ts or copy. Everything runs in your browser.",
  },
  "jwt-builder": {
    question: "How do I create and sign a JWT token online?",
    answer:
      "Build a JWT visually — set standard claims (iss, sub, aud, exp, iat, nbf, jti), add custom claims with type selection, choose an algorithm (HMAC, RSA, or ECDSA), and generate a signed token. The tool creates key pairs in your browser for RSA/ECDSA. Your secrets never leave your device.",
  },
  "tsconfig-builder": {
    question: "How do I build a tsconfig.json file online?",
    answer:
      "Choose a framework preset (Next.js, React/Vite, Node.js, or npm Library) and configure 35+ compiler options across strictness, emit, interop, and module resolution using visual controls. Each option includes an explanation. Download the generated tsconfig.json or copy it. Everything runs in your browser.",
  },
  "graphql-to-typescript": {
    question: "How do I convert a GraphQL schema to TypeScript?",
    answer:
      "Paste your GraphQL SDL schema and instantly get TypeScript interfaces, types, enums, unions, and operation types. The tool handles non-null/nullable types, list types, field arguments, implements, and 15+ custom scalar mappings. Download as .ts or copy. Everything runs in your browser.",
  },
  "package-json-generator": {
    question: "How do I generate a package.json file online?",
    answer:
      "Choose a preset (Next.js, React+Vite, Node.js CLI, npm Library, Express API, Monorepo) and customize name, version, scripts, dependencies, module config, and exports. The visual builder handles ESM/CJS, bin, engines, and keywords. Download or copy the result. Everything runs in your browser.",
  },
  "security-headers": {
    question: "How do I generate HTTP security headers?",
    answer:
      "Toggle 12 security headers (HSTS, CSP, X-Frame-Options, Referrer-Policy, Permissions-Policy, and more) using visual controls. Choose a preset (Strict, Moderate, Basic, API, Next.js, WordPress) and export as raw headers, Nginx, Apache, Vercel, Netlify, or Cloudflare config. See a security grade (A+ to F). Everything runs in your browser.",
  },
  "typescript-to-js": {
    question: "How do I convert TypeScript to JavaScript online?",
    answer:
      "Paste your TypeScript code and instantly get clean JavaScript with types, interfaces, enums, generics, access modifiers, and type assertions stripped. Options include converting enums to objects, removing comments, and preserving JSX. The tool uses a custom transpiler — no server needed. Everything runs in your browser.",
  },
  "json-to-sql": {
    question: "How do I convert JSON to SQL online?",
    answer:
      "Paste a JSON array of objects and get SQL CREATE TABLE and INSERT statements for PostgreSQL, MySQL, or SQLite. The tool auto-infers column types (integer, float, boolean, date, UUID, JSON) and generates dialect-specific syntax. Download as .sql or copy. Everything runs in your browser.",
  },
  "json-to-graphql": {
    question: "How do I generate a GraphQL schema from JSON?",
    answer:
      "Paste JSON data and the tool infers GraphQL types with automatic type detection (String, Int, Float, Boolean, ID, DateTime). Nested objects become separate types. Options include Query/Mutation generation, non-null fields, and descriptions. Download as .graphql or copy. Everything runs in your browser.",
  },
  "git-diff-viewer": {
    question: "How do I view a git diff with syntax highlighting?",
    answer:
      "Paste unified diff output from git diff and see it rendered with syntax highlighting, line numbers, and color-coded additions/deletions. Switch between inline and side-by-side views. The tool shows per-file stats and a total summary. Collapsible file sections help you focus. Everything runs in your browser.",
  },
  "sql-to-typescript": {
    question: "How do I convert SQL to TypeScript, Prisma, or Drizzle?",
    answer:
      "Paste SQL CREATE TABLE statements and get TypeScript interfaces, Prisma schema, or Drizzle ORM table definitions. The tool parses constraints (PRIMARY KEY, FOREIGN KEY, UNIQUE, DEFAULT), maps 30+ SQL types, and generates framework-specific annotations. Download or copy. Everything runs in your browser.",
  },
  "compression-tester": {
    question: "How do I test Brotli vs Gzip compression online?",
    answer:
      "Paste text (JSON, HTML, CSS, or any content) and instantly see compression results for Brotli, Gzip, and Deflate side by side — compressed size, savings percentage, ratio, and compression time. The tool highlights the best algorithm. Everything runs in your browser using native CompressionStream and brotli-wasm.",
  },
  "ts6-migration": {
    question: "How do I check my tsconfig for TypeScript 6.0 compatibility?",
    answer:
      "Paste your tsconfig.json and the tool checks for TS 6.0 breaking changes (removed ES3/ES5, outFile, AMD/UMD modules), deprecated options, and 9 changed defaults (strict:true, target:es2025, module:esnext). You get a readiness grade (A to F) with fix instructions for each issue. Everything runs in your browser.",
  },
  "eslint-to-biome": {
    question: "How do I convert my ESLint config to Biome?",
    answer:
      "Paste your .eslintrc.json or module.exports config and get a biome.json with 100+ rule mappings from ESLint core, TypeScript-ESLint, React, JSX-A11y, and import plugins. The tool extracts formatter settings, detects extends presets (Airbnb, Standard, Prettier), and generates migration steps. Everything runs in your browser.",
  },
  "code-security-scanner": {
    question: "How do I scan code for security vulnerabilities online?",
    answer:
      "Paste your JavaScript or TypeScript code and click Scan to detect hardcoded secrets, SQL injection, XSS, command injection, SSRF, prototype pollution, and 20+ other vulnerability patterns. Each finding includes severity, CWE reference, and fix guidance. All analysis runs in your browser — your code is never uploaded.",
  },
  "code-complexity-analyzer": {
    question: "How do I measure code complexity online?",
    answer:
      "Paste your JavaScript or TypeScript code and click Analyze to see cyclomatic complexity, cognitive complexity, nesting depth, and maintainability index for every function. Each function gets a risk rating with actionable refactoring recommendations. All analysis runs in your browser — your code never leaves your device.",
  },
  "http-request-builder": {
    question: "How do I build an HTTP request and generate code online?",
    answer:
      "Select the HTTP method, enter a URL, then configure headers, query parameters, authorization, and body using the visual builder. The tool instantly generates working code in cURL, JavaScript, Python, Go, Rust, and PHP. Copy the generated snippet into your project. Everything runs in your browser — your data never leaves your device.",
  },
  "github-actions-validator": {
    question: "How do I validate a GitHub Actions workflow YAML online?",
    answer:
      "Paste your workflow YAML and click Validate to check for syntax errors, missing required fields, broken job dependencies, deprecated action versions, and common misconfigurations. The validator flags errors, warnings, and best-practice suggestions with specific fix guidance. Everything runs in your browser — your workflow files never leave your device.",
  },
  "tailwind-to-css": {
    question: "How do I convert Tailwind CSS classes to standard CSS?",
    answer:
      "Paste your Tailwind utility classes (or a full class=\"...\" attribute) and the tool instantly generates the equivalent standard CSS properties. It supports 500+ classes including spacing, layout, typography, borders, transforms, filters, and arbitrary bracket values like w-[300px]. Customize the CSS selector name in the output. Everything runs in your browser — your code never leaves your device.",
  },
  "env-converter": {
    question: "How do I convert a .env file to Docker Compose or Kubernetes YAML?",
    answer:
      "Paste your .env file and select an output format: Docker Compose inline environment, Docker Compose env_file reference, Kubernetes ConfigMap, Kubernetes Secret (base64 or stringData), or docker run -e flags. The tool parses KEY=VALUE pairs, strips quotes, detects sensitive keys (passwords, tokens, API keys), and generates valid YAML or shell commands. Everything runs in your browser — your secrets never leave your device.",
  },
  "json-xml": {
    question: "How do I convert JSON to XML or XML to JSON online?",
    answer:
      "Paste your JSON or XML, select the conversion direction, and click Convert. JSON objects become XML elements, arrays wrap items in configurable tags, and primitives become text content. XML attributes are preserved with a configurable prefix (default: '@'). Options include XML declaration, CDATA sections, root element name, and indentation. Download as .xml or .json. Everything runs in your browser — your data never leaves your device.",
  },
  "css-unit-converter": {
    question: "How do I convert px to rem or other CSS units online?",
    answer:
      "Enter a value, select the source and target units (px, rem, em, pt, vw, vh, %), and get the result instantly. Set your root font size (default 16px) for accurate rem/em calculations. Use the batch converter to paste CSS and replace all px values with rem (or any other unit) at once. A reference table shows common px-to-rem conversions. Everything runs in your browser — your code never leaves your device.",
  },
  "html-table-generator": {
    question: "How do I generate an HTML table online?",
    answer:
      "Add rows and columns, type your content, and choose a style (minimal, bordered, striped, or modern). Click Generate to get clean HTML code with proper thead/tbody structure. Export as plain HTML, inline CSS (for emails), or Tailwind CSS classes. You can also import CSV data. Everything runs in your browser — your data never leaves your device.",
  },
  "aspect-ratio-calculator": {
    question: "How do I calculate aspect ratio from width and height?",
    answer:
      "Enter the width and height in pixels and this calculator instantly shows the simplified ratio (e.g., 16:9), decimal value, CSS aspect-ratio property, visual preview, and a table of equivalent sizes at common resolutions. Use the Resize tab to scale dimensions while preserving proportions, or browse Device Presets for phones, tablets, monitors, and social media formats. Everything runs in your browser — no signup required.",
  },
  "clip-path": {
    question: "How do I create custom CSS clip-path shapes?",
    answer:
      "Select a shape type (circle, ellipse, inset, or polygon), then adjust the visual controls to design your clip-path. For polygons, drag the points directly on the preview or choose from 13 presets including triangle, star, hexagon, arrow, cross, and more. The generator outputs production-ready CSS that you can copy with one click. Add the -webkit- prefix for older Safari support. Everything runs in your browser — no signup required.",
  },
  "css-filter": {
    question: "How do I use CSS filters to add visual effects?",
    answer:
      "Use the sliders to adjust 10 CSS filter functions — blur, brightness, contrast, grayscale, hue-rotate, invert, opacity, saturate, sepia, and drop-shadow. The live preview updates in real time so you can see exactly how your filters look. Choose from 12 presets like Vintage, B&W, Warm, Cool, and Dramatic for quick starting points, then fine-tune individual values. Copy the production-ready CSS with one click. Everything runs in your browser — no signup required.",
  },
  "xpath-tester": {
    question: "How do I test XPath expressions against XML online?",
    answer:
      "Paste your XML into the editor, type an XPath expression like //book[@category='programming']/title, and click Evaluate to see matching nodes instantly. The tool supports element selection, attribute filtering, axes (ancestor, descendant, sibling), and XPath functions (count, contains, starts-with). Click any example query button to try common patterns. Everything runs in your browser using the native XPath 1.0 engine — no data is sent to a server.",
  },
};
