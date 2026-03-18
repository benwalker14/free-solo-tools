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
];
