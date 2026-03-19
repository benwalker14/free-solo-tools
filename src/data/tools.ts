export interface Tool {
  title: string;
  description: string;
  href: string;
  icon: string;
  category: ToolCategory;
}

export type ToolCategory = "Format" | "Convert" | "Generate" | "Inspect";

export const TOOL_CATEGORIES: ToolCategory[] = [
  "Format",
  "Convert",
  "Generate",
  "Inspect",
];

export const tools: Tool[] = [
  {
    title: "JSON Formatter",
    description: "Format, validate, and minify JSON data instantly",
    href: "/tools/json-formatter",
    icon: "{ }",
    category: "Format",
  },
  {
    title: "Base64 Codec",
    description: "Encode and decode Base64 strings with Unicode support",
    href: "/tools/base64",
    icon: "B64",
    category: "Convert",
  },
  {
    title: "Hash Generator",
    description: "Generate SHA-1, SHA-256, SHA-384, SHA-512 hashes",
    href: "/tools/hash-generator",
    icon: "#",
    category: "Generate",
  },
  {
    title: "UUID Generator",
    description: "Generate random UUID v4 identifiers in bulk",
    href: "/tools/uuid-generator",
    icon: "ID",
    category: "Generate",
  },
  {
    title: "Color Converter",
    description: "Convert colors between HEX, RGB, and HSL formats",
    href: "/tools/color-converter",
    icon: "CLR",
    category: "Convert",
  },
  {
    title: "JWT Decoder",
    description: "Decode and inspect JSON Web Tokens instantly",
    href: "/tools/jwt-decoder",
    icon: "JWT",
    category: "Inspect",
  },
  {
    title: "Regex Tester",
    description: "Test regular expressions with real-time match highlighting",
    href: "/tools/regex-tester",
    icon: ".*",
    category: "Inspect",
  },
  {
    title: "URL Parser",
    description: "Parse URLs into protocol, host, path, and query params",
    href: "/tools/url-parser",
    icon: "URL",
    category: "Inspect",
  },
  {
    title: "Markdown Preview",
    description: "Write and preview Markdown with live rendering",
    href: "/tools/markdown-preview",
    icon: "MD",
    category: "Format",
  },
  {
    title: "Diff Checker",
    description: "Compare two texts and see differences highlighted",
    href: "/tools/diff-checker",
    icon: "+-",
    category: "Inspect",
  },
  {
    title: "Epoch Converter",
    description: "Convert Unix timestamps to dates and back",
    href: "/tools/epoch-converter",
    icon: "EP",
    category: "Convert",
  },
  {
    title: "Password Generator",
    description: "Generate strong, secure random passwords",
    href: "/tools/password-generator",
    icon: "PW",
    category: "Generate",
  },
  {
    title: "Lorem Ipsum Generator",
    description: "Generate placeholder text for designs and layouts",
    href: "/tools/lorem-ipsum",
    icon: "Li",
    category: "Generate",
  },
  {
    title: "Case Converter",
    description:
      "Convert text between camelCase, snake_case, kebab-case, and more",
    href: "/tools/case-converter",
    icon: "Aa",
    category: "Convert",
  },
  {
    title: "Number Base Converter",
    description: "Convert numbers between binary, octal, decimal, and hex",
    href: "/tools/number-base-converter",
    icon: "0x",
    category: "Convert",
  },
  {
    title: "CSV ↔ JSON Converter",
    description: "Convert between CSV and JSON formats with custom delimiters",
    href: "/tools/csv-json",
    icon: "CSV",
    category: "Convert",
  },
  {
    title: "Cron Expression Parser",
    description:
      "Parse cron schedules into plain English with next run times",
    href: "/tools/cron-parser",
    icon: "CRN",
    category: "Inspect",
  },
  {
    title: "Word & Character Counter",
    description:
      "Count words, characters, sentences, and estimate reading time",
    href: "/tools/word-counter",
    icon: "W#",
    category: "Inspect",
  },
  {
    title: "URL Encoder & Decoder",
    description:
      "Encode and decode URLs with encodeURIComponent and encodeURI",
    href: "/tools/url-encoder",
    icon: "%20",
    category: "Convert",
  },
  {
    title: "JSON ↔ YAML Converter",
    description:
      "Convert between JSON and YAML for Kubernetes, Docker, and CI/CD configs",
    href: "/tools/json-yaml",
    icon: "YML",
    category: "Convert",
  },
  {
    title: "Chmod Calculator",
    description:
      "Calculate Unix file permissions with an interactive permission matrix",
    href: "/tools/chmod-calculator",
    icon: "rwx",
    category: "Inspect",
  },
  {
    title: "HTML Entity Encoder",
    description:
      "Encode and decode HTML entities, special characters, and symbols",
    href: "/tools/html-entities",
    icon: "&;",
    category: "Convert",
  },
  {
    title: "CSS Gradient Generator",
    description: "Create beautiful CSS gradients visually with live preview",
    href: "/tools/gradient-generator",
    icon: "GRD",
    category: "Generate",
  },
  {
    title: "QR Code Generator",
    description: "Generate customizable QR codes from text or URLs",
    href: "/tools/qr-code",
    icon: "QR",
    category: "Generate",
  },
  {
    title: "SQL Formatter",
    description: "Format, beautify, and minify SQL queries instantly",
    href: "/tools/sql-formatter",
    icon: "SQL",
    category: "Format",
  },
  {
    title: "XML Formatter",
    description:
      "Format, beautify, validate, and minify XML documents instantly",
    href: "/tools/xml-formatter",
    icon: "XML",
    category: "Format",
  },
  {
    title: "Code Minifier & Beautifier",
    description:
      "Minify and beautify JavaScript, CSS, and HTML code instantly",
    href: "/tools/code-minifier",
    icon: "MIN",
    category: "Format",
  },
  {
    title: "Image to Base64",
    description:
      "Convert images to Base64 data URIs or decode Base64 back to images",
    href: "/tools/image-base64",
    icon: "IMG",
    category: "Convert",
  },
  {
    title: "Color Palette Generator",
    description:
      "Generate harmonious color palettes using color theory algorithms",
    href: "/tools/color-palette",
    icon: "PAL",
    category: "Generate",
  },
  {
    title: "JSON to TypeScript",
    description:
      "Generate TypeScript interfaces and type aliases from JSON data",
    href: "/tools/json-to-typescript",
    icon: "TS",
    category: "Convert",
  },
  {
    title: "HTML ↔ Markdown",
    description:
      "Convert between HTML and Markdown in either direction",
    href: "/tools/html-markdown",
    icon: "H↔M",
    category: "Convert",
  },
  {
    title: "YAML Formatter",
    description:
      "Validate, format, beautify, and minify YAML documents instantly",
    href: "/tools/yaml-formatter",
    icon: "YAM",
    category: "Format",
  },
  {
    title: "JSON Path Tester",
    description:
      "Test JSONPath expressions against JSON data with real-time evaluation",
    href: "/tools/json-path",
    icon: "$..",
    category: "Inspect",
  },
  {
    title: "SVG Optimizer",
    description:
      "Optimize SVGs by removing metadata, comments, editor data, and unnecessary attributes",
    href: "/tools/svg-optimizer",
    icon: "SVG",
    category: "Format",
  },
  {
    title: "Image Compressor",
    description:
      "Compress and resize images with adjustable quality — JPEG, WebP, and PNG",
    href: "/tools/image-compressor",
    icon: "CMP",
    category: "Convert",
  },
  {
    title: "Box Shadow Generator",
    description:
      "Design CSS box shadows visually with multiple layers, presets, and live preview",
    href: "/tools/box-shadow",
    icon: "SHD",
    category: "Generate",
  },
  {
    title: "Color Contrast Checker",
    description:
      "Check WCAG 2.1 color contrast ratios for AA and AAA accessibility compliance",
    href: "/tools/contrast-checker",
    icon: "A11",
    category: "Inspect",
  },
  {
    title: "Flexbox Generator",
    description:
      "Build CSS flexbox layouts visually with live preview, item config, and presets",
    href: "/tools/flexbox-generator",
    icon: "FLX",
    category: "Generate",
  },
  {
    title: "Grid Generator",
    description:
      "Build CSS grid layouts visually with columns, rows, gap, item placement, and presets",
    href: "/tools/grid-generator",
    icon: "Grid",
    category: "Generate",
  },
  {
    title: "Border Radius Generator",
    description:
      "Design CSS border-radius visually with per-corner controls, unit selection, and presets",
    href: "/tools/border-radius",
    icon: "◜◝",
    category: "Generate",
  },
  {
    title: "Text Shadow Generator",
    description:
      "Design CSS text shadows visually with multiple layers, presets, and live preview",
    href: "/tools/text-shadow",
    icon: "Tˢ",
    category: "Generate",
  },
  {
    title: "CSS Animation Generator",
    description:
      "Build CSS keyframe animations visually with presets, live preview, and copy-ready code",
    href: "/tools/css-animation",
    icon: "ANI",
    category: "Generate",
  },
  {
    title: "Markdown Table Generator",
    description:
      "Build Markdown tables visually with an interactive editor, CSV import, and alignment controls",
    href: "/tools/markdown-table",
    icon: "TBL",
    category: "Generate",
  },
  {
    title: "Text ↔ Binary Converter",
    description:
      "Convert text to binary, hexadecimal, octal, or decimal and decode back with UTF-8 support",
    href: "/tools/text-binary",
    icon: "01",
    category: "Convert",
  },
  {
    title: "Meta Tag Generator",
    description:
      "Generate SEO, Open Graph, and Twitter Card meta tags with live Google and social previews",
    href: "/tools/meta-tag-generator",
    icon: "META",
    category: "Generate",
  },
  {
    title: "JSON Schema Validator",
    description:
      "Validate JSON data against JSON Schema (Draft 07) with detailed error reporting and schema generation",
    href: "/tools/json-schema",
    icon: "JSV",
    category: "Inspect",
  },
  {
    title: "IP / CIDR Toolkit",
    description:
      "Subnet calculator, VLSM divider, IP range to CIDR converter, and IP address classifier",
    href: "/tools/subnet-calculator",
    icon: "IP",
    category: "Inspect",
  },
  {
    title: ".gitignore Generator",
    description:
      "Generate .gitignore files from 50+ templates — Node.js, Python, Java, Go, Rust, and more",
    href: "/tools/gitignore-generator",
    icon: ".gi",
    category: "Generate",
  },
  {
    title: "Crontab Generator",
    description:
      "Build cron expressions visually — select frequency, time, and days to generate cron schedules",
    href: "/tools/cron-generator",
    icon: "⏰",
    category: "Generate",
  },
  {
    title: "Favicon Generator",
    description:
      "Generate favicons from text or emoji — download PNGs, SVG, Apple Touch Icon, and HTML tags",
    href: "/tools/favicon-generator",
    icon: "FAV",
    category: "Generate",
  },
  {
    title: "URL Slug Generator",
    description:
      "Convert text into clean, URL-friendly slugs with Unicode transliteration and bulk mode",
    href: "/tools/slug-generator",
    icon: "/slug",
    category: "Convert",
  },
  {
    title: "cURL to Code",
    description:
      "Convert cURL commands to JavaScript, Python, Go, PHP, Ruby, and Java code instantly",
    href: "/tools/curl-converter",
    icon: "cURL",
    category: "Convert",
  },
  {
    title: "JSON to CSV Converter",
    description:
      "Convert JSON arrays to CSV with nested object flattening, column selection, and .csv download",
    href: "/tools/json-to-csv",
    icon: "J→C",
    category: "Convert",
  },
  {
    title: "Tailwind CSS Generator",
    description:
      "Build Tailwind CSS utility classes visually with live preview and component presets",
    href: "/tools/tailwind-generator",
    icon: "TW",
    category: "Generate",
  },
  {
    title: "Open Graph Preview",
    description:
      "Preview and debug Open Graph, Twitter Card, and SEO meta tags for social sharing",
    href: "/tools/og-preview",
    icon: "OG",
    category: "Inspect",
  },
  {
    title: "JS/TS Playground",
    description:
      "Run JavaScript and TypeScript code in your browser with instant console output",
    href: "/tools/js-playground",
    icon: "JS",
    category: "Inspect",
  },
  {
    title: "JSON Diff",
    description:
      "Compare two JSON objects and see structural differences — added, removed, and changed keys",
    href: "/tools/json-diff",
    icon: "J±",
    category: "Inspect",
  },
  {
    title: "TOML ↔ JSON/YAML",
    description:
      "Convert between TOML, JSON, and YAML — perfect for Cargo.toml and pyproject.toml",
    href: "/tools/toml-converter",
    icon: "TML",
    category: "Convert",
  },
  {
    title: "Encode / Decode Multi-Tool",
    description:
      "Base64, Base32, Hex, Binary, URL, and HTML encoding & decoding all in one tool",
    href: "/tools/encode-decode",
    icon: "E/D",
    category: "Convert",
  },
  {
    title: "Docker Compose Validator",
    description:
      "Validate and format Docker Compose files — check services, networks, volumes, and dependencies",
    href: "/tools/docker-compose",
    icon: "DCK",
    category: "Inspect",
  },
  {
    title: "Privacy Policy Generator",
    description:
      "Generate a customized privacy policy with GDPR, CCPA, cookies, analytics, and payment sections",
    href: "/tools/privacy-policy",
    icon: "PP",
    category: "Generate",
  },
  {
    title: "HTTP Status Codes",
    description:
      "Complete HTTP status code reference — 1xx, 2xx, 3xx, 4xx, 5xx with detailed explanations and use cases",
    href: "/tools/http-status-codes",
    icon: "HTTP",
    category: "Inspect",
  },
  {
    title: "Date Format Tester",
    description:
      "Test date format patterns for strftime, date-fns, Moment.js, Go, and Java with live preview and token reference",
    href: "/tools/date-format-tester",
    icon: "DT",
    category: "Inspect",
  },
  {
    title: "JSON Mock Data Generator",
    description:
      "Generate realistic fake JSON data for API testing with 30+ field types, preset templates, and schema builder",
    href: "/tools/json-mock-generator",
    icon: "MCK",
    category: "Generate",
  },
  {
    title: "README Generator",
    description:
      "Generate professional GitHub README.md files with badges, installation steps, usage examples, and more",
    href: "/tools/readme-generator",
    icon: "RDM",
    category: "Generate",
  },
  {
    title: "Dockerfile Validator",
    description:
      "Validate and lint Dockerfiles for syntax errors, security issues, best practices, and layer optimization",
    href: "/tools/dockerfile-validator",
    icon: "DKR",
    category: "Inspect",
  },
  {
    title: "Kubernetes YAML Validator",
    description:
      "Validate Kubernetes manifests for syntax, required fields, best practices, security, and resource limits",
    href: "/tools/k8s-validator",
    icon: "K8s",
    category: "Inspect",
  },
];
