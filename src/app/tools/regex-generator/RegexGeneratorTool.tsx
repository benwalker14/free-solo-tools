"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";

// ---------------------------------------------------------------------------
// Pattern library — 60+ curated patterns grouped by category
// ---------------------------------------------------------------------------

interface RegexPattern {
  name: string;
  pattern: string;
  flags: string;
  description: string;
  keywords: string[];
  example: string;
}

interface PatternCategory {
  name: string;
  icon: string;
  patterns: RegexPattern[];
}

const PATTERN_LIBRARY: PatternCategory[] = [
  {
    name: "Email & Contact",
    icon: "@",
    patterns: [
      { name: "Email Address", pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}", flags: "g", description: "Matches standard email addresses", keywords: ["email", "mail", "address", "contact", "@"], example: "user@example.com" },
      { name: "Email (Strict)", pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$", flags: "", description: "Validates a single email address (full string match)", keywords: ["email", "validate", "strict", "exact"], example: "user@example.com" },
      { name: "Phone (US)", pattern: "\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}", flags: "g", description: "Matches US phone numbers in various formats", keywords: ["phone", "telephone", "us", "number", "call"], example: "(555) 123-4567" },
      { name: "Phone (International)", pattern: "\\+?\\d{1,4}[-.\\s]?\\(?\\d{1,4}\\)?[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,9}", flags: "g", description: "Matches international phone numbers with optional country code", keywords: ["phone", "international", "country code", "global"], example: "+44 20 7946 0958" },
    ],
  },
  {
    name: "URLs & Web",
    icon: "🔗",
    patterns: [
      { name: "URL (HTTP/HTTPS)", pattern: "https?://[\\w-]+(\\.[\\w-]+)+(/[\\w.,@?^=%&:/~+#-]*)?", flags: "gi", description: "Matches HTTP and HTTPS URLs", keywords: ["url", "link", "http", "https", "web", "website"], example: "https://example.com/path?q=1" },
      { name: "Domain Name", pattern: "(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\\.)+[a-zA-Z]{2,}", flags: "g", description: "Matches domain names", keywords: ["domain", "hostname", "site", "dns"], example: "example.com" },
      { name: "Slug (URL-safe)", pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$", flags: "", description: "Matches URL-friendly slugs (lowercase, hyphens)", keywords: ["slug", "url", "path", "seo", "friendly"], example: "my-blog-post" },
      { name: "Query Parameter", pattern: "[?&]([^=&]+)=([^&]*)", flags: "g", description: "Extracts query string parameters as key=value pairs", keywords: ["query", "parameter", "querystring", "url param"], example: "?key=value&foo=bar" },
    ],
  },
  {
    name: "IP & Network",
    icon: "🌐",
    patterns: [
      { name: "IPv4 Address", pattern: "\\b(?:(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\b", flags: "g", description: "Matches valid IPv4 addresses (0.0.0.0 – 255.255.255.255)", keywords: ["ip", "ipv4", "address", "network", "server"], example: "192.168.1.1" },
      { name: "IPv6 Address", pattern: "(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}", flags: "g", description: "Matches full IPv6 addresses", keywords: ["ip", "ipv6", "address", "network"], example: "2001:0db8:85a3:0000:0000:8a2e:0370:7334" },
      { name: "MAC Address", pattern: "(?:[0-9A-Fa-f]{2}[:-]){5}[0-9A-Fa-f]{2}", flags: "g", description: "Matches MAC addresses (colon or dash separated)", keywords: ["mac", "address", "hardware", "network", "ethernet"], example: "01:23:45:67:89:AB" },
      { name: "CIDR Notation", pattern: "\\b(?:\\d{1,3}\\.){3}\\d{1,3}/\\d{1,2}\\b", flags: "g", description: "Matches IPv4 CIDR notation (e.g., 10.0.0.0/8)", keywords: ["cidr", "subnet", "network", "ip range"], example: "10.0.0.0/24" },
      { name: "Port Number", pattern: ":(\\d{1,5})\\b", flags: "g", description: "Matches port numbers after a colon", keywords: ["port", "network", "server", "socket"], example: ":8080" },
    ],
  },
  {
    name: "Dates & Times",
    icon: "📅",
    patterns: [
      { name: "Date (YYYY-MM-DD)", pattern: "\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])", flags: "g", description: "Matches ISO 8601 dates", keywords: ["date", "iso", "yyyy", "year", "month", "day"], example: "2026-03-18" },
      { name: "Date (MM/DD/YYYY)", pattern: "(?:0[1-9]|1[0-2])/(?:0[1-9]|[12]\\d|3[01])/\\d{4}", flags: "g", description: "Matches US-formatted dates", keywords: ["date", "us", "american", "slash"], example: "03/18/2026" },
      { name: "Date (DD/MM/YYYY)", pattern: "(?:0[1-9]|[12]\\d|3[01])/(?:0[1-9]|1[0-2])/\\d{4}", flags: "g", description: "Matches European-formatted dates", keywords: ["date", "european", "dd", "uk", "slash"], example: "18/03/2026" },
      { name: "Time (24h)", pattern: "(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d)?", flags: "g", description: "Matches 24-hour time (HH:MM or HH:MM:SS)", keywords: ["time", "24", "hour", "clock", "hh:mm"], example: "14:30:00" },
      { name: "Time (12h)", pattern: "(?:1[0-2]|0?[1-9]):[0-5]\\d\\s?(?:AM|PM|am|pm)", flags: "g", description: "Matches 12-hour time with AM/PM", keywords: ["time", "12", "hour", "am", "pm", "clock"], example: "2:30 PM" },
      { name: "ISO 8601 Datetime", pattern: "\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(?:\\.\\d+)?(?:Z|[+-]\\d{2}:\\d{2})?", flags: "g", description: "Matches ISO 8601 datetime strings with optional timezone", keywords: ["iso", "datetime", "timestamp", "utc", "timezone"], example: "2026-03-18T14:30:00Z" },
    ],
  },
  {
    name: "Numbers & Currency",
    icon: "#",
    patterns: [
      { name: "Integer", pattern: "-?\\d+", flags: "g", description: "Matches positive and negative integers", keywords: ["integer", "number", "digit", "whole", "int"], example: "-42" },
      { name: "Decimal Number", pattern: "-?\\d+\\.\\d+", flags: "g", description: "Matches decimal numbers", keywords: ["decimal", "float", "number", "point", "double"], example: "3.14" },
      { name: "Currency (USD)", pattern: "\\$[\\d,]+\\.?\\d{0,2}", flags: "g", description: "Matches US dollar amounts", keywords: ["currency", "dollar", "usd", "money", "price", "$"], example: "$1,234.56" },
      { name: "Currency (EUR)", pattern: "€[\\d.,]+", flags: "g", description: "Matches Euro amounts", keywords: ["currency", "euro", "eur", "money", "price", "€"], example: "€1.234,56" },
      { name: "Percentage", pattern: "-?\\d+(?:\\.\\d+)?%", flags: "g", description: "Matches percentage values", keywords: ["percent", "percentage", "%", "ratio"], example: "99.9%" },
      { name: "Hex Number", pattern: "0x[0-9A-Fa-f]+", flags: "g", description: "Matches hexadecimal numbers (0x prefix)", keywords: ["hex", "hexadecimal", "0x", "number"], example: "0xFF" },
      { name: "Number with Commas", pattern: "\\d{1,3}(?:,\\d{3})*(?:\\.\\d+)?", flags: "g", description: "Matches numbers with thousands separators", keywords: ["number", "comma", "thousands", "formatted"], example: "1,234,567.89" },
    ],
  },
  {
    name: "Strings & Text",
    icon: "Aa",
    patterns: [
      { name: "Quoted String (Double)", pattern: "\"([^\"\\\\]|\\\\.)*\"", flags: "g", description: "Matches double-quoted strings with escaped characters", keywords: ["string", "quote", "double", "quoted", "text"], example: "\"hello world\"" },
      { name: "Quoted String (Single)", pattern: "'([^'\\\\]|\\\\.)*'", flags: "g", description: "Matches single-quoted strings with escaped characters", keywords: ["string", "quote", "single", "quoted", "text"], example: "'hello world'" },
      { name: "Words Only", pattern: "\\b[a-zA-Z]+\\b", flags: "g", description: "Matches alphabetic words", keywords: ["word", "alpha", "letter", "text", "alphabetic"], example: "Hello" },
      { name: "Alphanumeric", pattern: "\\b[a-zA-Z0-9]+\\b", flags: "g", description: "Matches alphanumeric tokens", keywords: ["alphanumeric", "word", "token", "id"], example: "abc123" },
      { name: "Whitespace", pattern: "\\s+", flags: "g", description: "Matches one or more whitespace characters", keywords: ["whitespace", "space", "tab", "newline", "blank"], example: "   " },
      { name: "Non-empty Line", pattern: "^.+$", flags: "gm", description: "Matches non-empty lines", keywords: ["line", "non-empty", "content", "text"], example: "This is a line" },
      { name: "Empty Lines", pattern: "^\\s*$", flags: "gm", description: "Matches blank or whitespace-only lines", keywords: ["empty", "blank", "line", "whitespace"], example: "" },
      { name: "Duplicate Words", pattern: "\\b(\\w+)\\s+\\1\\b", flags: "gi", description: "Finds repeated consecutive words (e.g., 'the the')", keywords: ["duplicate", "repeat", "double", "word", "typo"], example: "the the" },
    ],
  },
  {
    name: "Code & Dev",
    icon: "</>",
    patterns: [
      { name: "HTML Tag", pattern: "<([a-zA-Z][a-zA-Z0-9]*)\\b[^>]*>", flags: "g", description: "Matches opening HTML tags with attributes", keywords: ["html", "tag", "element", "xml", "markup"], example: "<div class=\"foo\">" },
      { name: "HTML Comment", pattern: "<!--[\\s\\S]*?-->", flags: "g", description: "Matches HTML comments", keywords: ["html", "comment", "markup", "<!--"], example: "<!-- comment -->" },
      { name: "Hex Color", pattern: "#(?:[0-9A-Fa-f]{3}){1,2}\\b", flags: "g", description: "Matches 3 or 6 digit hex color codes", keywords: ["hex", "color", "colour", "css", "#"], example: "#FF5733" },
      { name: "CSS Class Selector", pattern: "\\.[a-zA-Z_][a-zA-Z0-9_-]*", flags: "g", description: "Matches CSS class selectors", keywords: ["css", "class", "selector", "style"], example: ".my-class" },
      { name: "JavaScript Variable", pattern: "\\b(?:const|let|var)\\s+([a-zA-Z_$][a-zA-Z0-9_$]*)", flags: "g", description: "Matches JS variable declarations", keywords: ["javascript", "variable", "const", "let", "var", "declaration"], example: "const myVar" },
      { name: "Import Statement", pattern: "(?:import|require)\\s*\\(?['\"]([^'\"]+)['\"]\\)?", flags: "g", description: "Matches JS/TS import or require paths", keywords: ["import", "require", "module", "javascript", "typescript"], example: "import 'lodash'" },
      { name: "TODO/FIXME Comment", pattern: "(?://|#|/\\*)\\s*(?:TODO|FIXME|HACK|XXX|BUG)\\b.*", flags: "gi", description: "Matches TODO/FIXME comments in code", keywords: ["todo", "fixme", "hack", "comment", "annotation"], example: "// TODO: fix this" },
      { name: "Semver Version", pattern: "\\bv?\\d+\\.\\d+\\.\\d+(?:-[a-zA-Z0-9.]+)?(?:\\+[a-zA-Z0-9.]+)?\\b", flags: "g", description: "Matches semantic version strings", keywords: ["version", "semver", "semantic", "release", "npm"], example: "v1.2.3-beta.1" },
      { name: "UUID v4", pattern: "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}", flags: "g", description: "Matches UUID version 4 strings", keywords: ["uuid", "guid", "id", "identifier", "unique"], example: "550e8400-e29b-41d4-a716-446655440000" },
      { name: "JSON Key", pattern: "\"([^\"]+)\"\\s*:", flags: "g", description: "Matches JSON object keys", keywords: ["json", "key", "property", "field", "object"], example: "\"name\": " },
      { name: "Environment Variable", pattern: "\\b[A-Z][A-Z0-9_]{2,}\\b", flags: "g", description: "Matches UPPER_SNAKE_CASE identifiers (env vars, constants)", keywords: ["env", "environment", "variable", "constant", "uppercase", "snake"], example: "DATABASE_URL" },
    ],
  },
  {
    name: "Validation",
    icon: "✓",
    patterns: [
      { name: "Username", pattern: "^[a-zA-Z0-9_-]{3,20}$", flags: "", description: "Validates usernames (3-20 chars, alphanumeric, dash, underscore)", keywords: ["username", "user", "login", "account", "handle"], example: "john_doe-99" },
      { name: "Password (Strong)", pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$", flags: "", description: "Requires 8+ chars with upper, lower, digit, and special character", keywords: ["password", "strong", "security", "validate", "strength"], example: "Pa$$w0rd!" },
      { name: "Hex Color (Strict)", pattern: "^#(?:[0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$", flags: "", description: "Validates a full hex color code", keywords: ["hex", "color", "validate", "css"], example: "#FF5733" },
      { name: "Credit Card", pattern: "\\b(?:\\d{4}[- ]?){3}\\d{4}\\b", flags: "g", description: "Matches credit card number formats (groups of 4 digits)", keywords: ["credit", "card", "payment", "number", "visa", "mastercard"], example: "4111-1111-1111-1111" },
      { name: "SSN (US)", pattern: "\\b\\d{3}-\\d{2}-\\d{4}\\b", flags: "g", description: "Matches US Social Security Number format", keywords: ["ssn", "social", "security", "number", "us"], example: "123-45-6789" },
      { name: "ZIP Code (US)", pattern: "\\b\\d{5}(?:-\\d{4})?\\b", flags: "g", description: "Matches US ZIP codes (5 digit or ZIP+4)", keywords: ["zip", "postal", "code", "us", "address"], example: "90210-1234" },
      { name: "Postal Code (UK)", pattern: "[A-Z]{1,2}\\d[A-Z\\d]?\\s?\\d[A-Z]{2}", flags: "gi", description: "Matches UK postcodes", keywords: ["postal", "postcode", "uk", "british", "address"], example: "SW1A 1AA" },
    ],
  },
  {
    name: "Files & Paths",
    icon: "📁",
    patterns: [
      { name: "File Extension", pattern: "\\.[a-zA-Z0-9]{1,10}$", flags: "", description: "Matches file extensions", keywords: ["file", "extension", "suffix", "type"], example: ".tsx" },
      { name: "File Path (Unix)", pattern: "(?:/[\\w.-]+)+", flags: "g", description: "Matches Unix-style file paths", keywords: ["path", "file", "unix", "linux", "directory"], example: "/usr/local/bin/node" },
      { name: "File Path (Windows)", pattern: "[A-Za-z]:\\\\(?:[\\w.-]+\\\\)*[\\w.-]+", flags: "g", description: "Matches Windows file paths", keywords: ["path", "file", "windows", "directory", "drive"], example: "C:\\Users\\admin\\file.txt" },
      { name: "Image File", pattern: "\\S+\\.(?:png|jpe?g|gif|svg|webp|ico|bmp|tiff?)\\b", flags: "gi", description: "Matches image filenames by extension", keywords: ["image", "file", "picture", "photo", "png", "jpg", "svg"], example: "logo.png" },
    ],
  },
  {
    name: "Data Formats",
    icon: "{}",
    patterns: [
      { name: "JWT Token", pattern: "eyJ[A-Za-z0-9_-]+\\.eyJ[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+", flags: "g", description: "Matches JSON Web Tokens", keywords: ["jwt", "token", "json", "web", "auth", "bearer"], example: "eyJhbGciOi...eyJzdWIiOi...SflKxwRJSM..." },
      { name: "Base64 String", pattern: "(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?", flags: "g", description: "Matches Base64 encoded strings", keywords: ["base64", "encoded", "encoding", "data"], example: "SGVsbG8gV29ybGQ=" },
      { name: "YAML Key-Value", pattern: "^([\\w.-]+):\\s*(.+)$", flags: "gm", description: "Matches YAML key-value pairs", keywords: ["yaml", "key", "value", "config", "yml"], example: "name: John" },
      { name: "Markdown Link", pattern: "\\[([^\\]]+)\\]\\(([^)]+)\\)", flags: "g", description: "Matches Markdown-style links [text](url)", keywords: ["markdown", "link", "url", "md", "reference"], example: "[Click here](https://example.com)" },
      { name: "Markdown Heading", pattern: "^#{1,6}\\s+.+$", flags: "gm", description: "Matches Markdown headings (# to ######)", keywords: ["markdown", "heading", "header", "title", "h1", "h2"], example: "## My Heading" },
      { name: "CSV Field", pattern: "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|([^,\\n]*))", flags: "g", description: "Matches CSV fields including quoted values", keywords: ["csv", "field", "column", "comma", "separated"], example: "\"hello, world\",simple" },
    ],
  },
];

// ---------------------------------------------------------------------------
// Regex composer building blocks
// ---------------------------------------------------------------------------

interface ComposerBlock {
  label: string;
  snippet: string;
  description: string;
}

interface ComposerCategory {
  name: string;
  blocks: ComposerBlock[];
}

const COMPOSER_BLOCKS: ComposerCategory[] = [
  {
    name: "Characters",
    blocks: [
      { label: ".", snippet: ".", description: "Any character" },
      { label: "\\d", snippet: "\\d", description: "Digit (0-9)" },
      { label: "\\D", snippet: "\\D", description: "Non-digit" },
      { label: "\\w", snippet: "\\w", description: "Word char (a-z, 0-9, _)" },
      { label: "\\W", snippet: "\\W", description: "Non-word char" },
      { label: "\\s", snippet: "\\s", description: "Whitespace" },
      { label: "\\S", snippet: "\\S", description: "Non-whitespace" },
      { label: "[abc]", snippet: "[abc]", description: "Character set" },
      { label: "[^abc]", snippet: "[^abc]", description: "Negated set" },
      { label: "[a-z]", snippet: "[a-z]", description: "Range" },
    ],
  },
  {
    name: "Quantifiers",
    blocks: [
      { label: "*", snippet: "*", description: "0 or more" },
      { label: "+", snippet: "+", description: "1 or more" },
      { label: "?", snippet: "?", description: "0 or 1" },
      { label: "{n}", snippet: "{3}", description: "Exactly n" },
      { label: "{n,}", snippet: "{3,}", description: "n or more" },
      { label: "{n,m}", snippet: "{3,6}", description: "Between n and m" },
      { label: "*?", snippet: "*?", description: "0+ (lazy)" },
      { label: "+?", snippet: "+?", description: "1+ (lazy)" },
    ],
  },
  {
    name: "Anchors & Boundaries",
    blocks: [
      { label: "^", snippet: "^", description: "Start of string/line" },
      { label: "$", snippet: "$", description: "End of string/line" },
      { label: "\\b", snippet: "\\b", description: "Word boundary" },
      { label: "\\B", snippet: "\\B", description: "Non-word boundary" },
    ],
  },
  {
    name: "Groups & Lookaround",
    blocks: [
      { label: "(…)", snippet: "()", description: "Capturing group" },
      { label: "(?:…)", snippet: "(?:)", description: "Non-capturing group" },
      { label: "(?=…)", snippet: "(?=)", description: "Positive lookahead" },
      { label: "(?!…)", snippet: "(?!)", description: "Negative lookahead" },
      { label: "(?<=…)", snippet: "(?<=)", description: "Positive lookbehind" },
      { label: "(?<!…)", snippet: "(?<!)", description: "Negative lookbehind" },
      { label: "a|b", snippet: "|", description: "Alternation (OR)" },
    ],
  },
  {
    name: "Escapes",
    blocks: [
      { label: "\\.", snippet: "\\.", description: "Literal dot" },
      { label: "\\(", snippet: "\\(", description: "Literal parenthesis" },
      { label: "\\[", snippet: "\\[", description: "Literal bracket" },
      { label: "\\\\", snippet: "\\\\", description: "Literal backslash" },
      { label: "\\n", snippet: "\\n", description: "Newline" },
      { label: "\\t", snippet: "\\t", description: "Tab" },
    ],
  },
];

// ---------------------------------------------------------------------------
// Regex explanation engine
// ---------------------------------------------------------------------------

function explainRegex(pattern: string): string[] {
  if (!pattern) return [];
  const explanations: string[] = [];
  let i = 0;

  while (i < pattern.length) {
    const rest = pattern.slice(i);

    // Named/non-capturing groups, lookarounds
    if (rest.startsWith("(?<=")) { explanations.push("(?<=…) — Positive lookbehind"); i += 4; continue; }
    if (rest.startsWith("(?<!")) { explanations.push("(?<!…) — Negative lookbehind"); i += 4; continue; }
    if (rest.startsWith("(?=")) { explanations.push("(?=…) — Positive lookahead"); i += 3; continue; }
    if (rest.startsWith("(?!")) { explanations.push("(?!…) — Negative lookahead"); i += 3; continue; }
    if (rest.startsWith("(?:")) { explanations.push("(?:…) — Non-capturing group"); i += 3; continue; }

    // Character classes
    if (rest.startsWith("\\d")) { explanations.push("\\d — Digit (0-9)"); i += 2; continue; }
    if (rest.startsWith("\\D")) { explanations.push("\\D — Non-digit"); i += 2; continue; }
    if (rest.startsWith("\\w")) { explanations.push("\\w — Word character (letter, digit, _)"); i += 2; continue; }
    if (rest.startsWith("\\W")) { explanations.push("\\W — Non-word character"); i += 2; continue; }
    if (rest.startsWith("\\s")) { explanations.push("\\s — Whitespace character"); i += 2; continue; }
    if (rest.startsWith("\\S")) { explanations.push("\\S — Non-whitespace character"); i += 2; continue; }
    if (rest.startsWith("\\b")) { explanations.push("\\b — Word boundary"); i += 2; continue; }
    if (rest.startsWith("\\B")) { explanations.push("\\B — Non-word boundary"); i += 2; continue; }
    if (rest.startsWith("\\n")) { explanations.push("\\n — Newline"); i += 2; continue; }
    if (rest.startsWith("\\t")) { explanations.push("\\t — Tab"); i += 2; continue; }

    // Escaped characters
    if (pattern[i] === "\\" && i + 1 < pattern.length) {
      explanations.push(`\\${pattern[i + 1]} — Literal '${pattern[i + 1]}'`);
      i += 2; continue;
    }

    // Character sets
    if (pattern[i] === "[") {
      const close = pattern.indexOf("]", i + 1);
      if (close !== -1) {
        const set = pattern.slice(i, close + 1);
        const negated = set[1] === "^";
        explanations.push(`${set} — ${negated ? "Negated character" : "Character"} set`);
        i = close + 1; continue;
      }
    }

    // Quantifiers
    if (pattern[i] === "{") {
      const close = pattern.indexOf("}", i + 1);
      if (close !== -1) {
        const q = pattern.slice(i, close + 1);
        const lazy = pattern[close + 1] === "?";
        explanations.push(`${q}${lazy ? "?" : ""} — Quantifier (repeat)${lazy ? " lazy" : ""}`);
        i = close + 1 + (lazy ? 1 : 0); continue;
      }
    }

    // Simple tokens
    const simpleMap: Record<string, string> = {
      "^": "^ — Start of string/line",
      "$": "$ — End of string/line",
      ".": ". — Any character (except newline)",
      "*": "* — 0 or more (greedy)",
      "+": "+ — 1 or more (greedy)",
      "?": "? — 0 or 1 (optional)",
      "|": "| — Alternation (OR)",
      "(": "( — Start of group",
      ")": ") — End of group",
    };

    if (simpleMap[pattern[i]]) {
      // Check for lazy quantifier
      if ((pattern[i] === "*" || pattern[i] === "+") && pattern[i + 1] === "?") {
        explanations.push(`${pattern[i]}? — ${pattern[i] === "*" ? "0" : "1"} or more (lazy)`);
        i += 2; continue;
      }
      explanations.push(simpleMap[pattern[i]]);
      i++; continue;
    }

    // Literal characters
    if (/[a-zA-Z0-9]/.test(pattern[i])) {
      // Group consecutive literals
      let literal = "";
      while (i < pattern.length && /[a-zA-Z0-9]/.test(pattern[i])) {
        literal += pattern[i]; i++;
      }
      explanations.push(`${literal} — Literal "${literal}"`);
      continue;
    }

    // Skip any other single character
    explanations.push(`${pattern[i]} — Literal '${pattern[i]}'`);
    i++;
  }

  return explanations;
}

// ---------------------------------------------------------------------------
// Match helpers
// ---------------------------------------------------------------------------

interface MatchResult {
  fullMatch: string;
  index: number;
  groups: string[];
}

function getMatches(pattern: string, flags: string, text: string): MatchResult[] {
  if (!pattern || !text) return [];
  try {
    const effectiveFlags = flags.includes("g") ? flags : flags + "g";
    const regex = new RegExp(pattern, effectiveFlags);
    const results: MatchResult[] = [];
    let match: RegExpExecArray | null;
    let safety = 0;
    while ((match = regex.exec(text)) !== null && safety < 1000) {
      results.push({ fullMatch: match[0], index: match.index, groups: match.slice(1) });
      if (match[0].length === 0) regex.lastIndex++;
      safety++;
    }
    return results;
  } catch { return []; }
}

function getRegexError(pattern: string, flags: string): string | null {
  if (!pattern) return null;
  try { new RegExp(pattern, flags); return null; } catch (e) { return e instanceof Error ? e.message : "Invalid regex"; }
}

// ---------------------------------------------------------------------------
// Search helper
// ---------------------------------------------------------------------------

function searchPatterns(query: string): RegexPattern[] {
  if (!query.trim()) return [];
  const terms = query.toLowerCase().split(/\s+/);
  const scored: { pattern: RegexPattern; score: number }[] = [];

  for (const cat of PATTERN_LIBRARY) {
    for (const p of cat.patterns) {
      let score = 0;
      const searchable = [p.name, p.description, ...p.keywords].map(s => s.toLowerCase());
      for (const term of terms) {
        for (const s of searchable) {
          if (s.includes(term)) {
            score += s === term ? 3 : s.startsWith(term) ? 2 : 1;
          }
        }
      }
      if (score > 0) scored.push({ pattern: p, score });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.map(s => s.pattern);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

type Tab = "search" | "library" | "composer";

export default function RegexGeneratorTool() {
  const [tab, setTab] = useState<Tab>("search");
  const [search, setSearch] = useState("");
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [testText, setTestText] = useState("");
  const [copied, setCopied] = useState(false);
  const [expandedCat, setExpandedCat] = useState<string | null>(null);
  const { trackAction, trackFirstInteraction } = useToolAnalytics("regex-generator");

  const regexError = useMemo(() => getRegexError(pattern, flags), [pattern, flags]);
  const matches = useMemo(() => regexError ? [] : getMatches(pattern, flags, testText), [pattern, flags, testText, regexError]);
  const explanation = useMemo(() => explainRegex(pattern), [pattern]);
  const searchResults = useMemo(() => searchPatterns(search), [search]);

  const selectPattern = useCallback((p: RegexPattern) => {
    setPattern(p.pattern);
    setFlags(p.flags || "g");
    setTestText(p.example);
    trackAction("select_pattern");
  }, [trackAction]);

  const insertSnippet = useCallback((snippet: string) => {
    setPattern(prev => prev + snippet);
    trackAction("insert_snippet");
  }, [trackAction]);

  const handleCopy = useCallback(() => {
    const full = `/${pattern}/${flags}`;
    navigator.clipboard.writeText(full);
    setCopied(true);
    trackAction("copy");
    setTimeout(() => setCopied(false), 1500);
  }, [pattern, flags, trackAction]);

  const toggleFlag = (flag: string) => {
    setFlags(prev => prev.includes(flag) ? prev.replace(flag, "") : prev + flag);
  };

  const highlightedParts = useMemo(() => {
    if (!pattern || !testText || regexError || matches.length === 0) return null;
    const parts: { text: string; highlight: boolean }[] = [];
    let lastIndex = 0;
    for (const m of matches) {
      if (m.index > lastIndex) parts.push({ text: testText.slice(lastIndex, m.index), highlight: false });
      parts.push({ text: m.fullMatch, highlight: true });
      lastIndex = m.index + m.fullMatch.length;
    }
    if (lastIndex < testText.length) parts.push({ text: testText.slice(lastIndex), highlight: false });
    return parts;
  }, [pattern, testText, regexError, matches]);

  const FLAG_OPTIONS = [
    { flag: "g", label: "Global", desc: "Find all matches" },
    { flag: "i", label: "Case Insensitive", desc: "Ignore case" },
    { flag: "m", label: "Multiline", desc: "^ and $ match line boundaries" },
    { flag: "s", label: "Dotall", desc: ". matches newlines" },
  ];

  const TABS: { id: Tab; label: string; desc: string }[] = [
    { id: "search", label: "Search Patterns", desc: "Describe what you need in English" },
    { id: "library", label: "Pattern Library", desc: "Browse 60+ patterns by category" },
    { id: "composer", label: "Regex Composer", desc: "Build regex with building blocks" },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <Link href="/" className="mb-8 block text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300">
        &larr; Back to tools
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Regex Generator</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Find regex patterns by describing what you need, browse a curated library of 60+ patterns, or compose your own with building blocks.
      </p>

      {/* ---- Tab selector ---- */}
      <div className="mb-6 flex gap-1 rounded-xl bg-gray-100 p-1 dark:bg-gray-800">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              tab === t.id
                ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            <span className="block">{t.label}</span>
            <span className="block text-xs font-normal opacity-60">{t.desc}</span>
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* ---- Left panel: tabs content ---- */}
        <div className="space-y-4">
          {/* Search tab */}
          {tab === "search" && (
            <div className="space-y-3">
              <input
                type="text"
                value={search}
                onChange={e => { trackFirstInteraction(); setSearch(e.target.value); }}
                placeholder='Describe what you need... e.g. "email address", "ip address", "date format"'
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-600"
              />
              {search.trim() && (
                <div className="rounded-lg border border-gray-200 dark:border-gray-700">
                  {searchResults.length === 0 ? (
                    <p className="p-4 text-sm text-gray-500 dark:text-gray-400">
                      No patterns found. Try different keywords or browse the library.
                    </p>
                  ) : (
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700 max-h-[420px] overflow-y-auto">
                      {searchResults.map((p, i) => (
                        <li key={i}>
                          <button
                            onClick={() => selectPattern(p)}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-900 dark:text-white">{p.name}</span>
                              <span className="text-xs text-indigo-600 dark:text-indigo-400">Use &rarr;</span>
                            </div>
                            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{p.description}</p>
                            <code className="mt-1 block truncate text-xs font-mono text-gray-600 dark:text-gray-500">/{p.pattern}/{p.flags}</code>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
              {!search.trim() && (
                <div className="rounded-lg border border-dashed border-gray-300 dark:border-gray-700 p-6 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Popular searches</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {["email", "url", "phone", "ip address", "date", "hex color", "uuid", "password", "html tag", "number"].map(q => (
                      <button
                        key={q}
                        onClick={() => setSearch(q)}
                        className="rounded-full border border-gray-300 px-3 py-1 text-xs text-gray-700 hover:border-indigo-400 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-indigo-500 dark:hover:text-indigo-400"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Library tab */}
          {tab === "library" && (
            <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
              {PATTERN_LIBRARY.map(cat => (
                <div key={cat.name} className="rounded-lg border border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setExpandedCat(expandedCat === cat.name ? null : cat.name)}
                    className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-sm">{cat.icon}</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{cat.name}</span>
                      <span className="text-xs text-gray-400">({cat.patterns.length})</span>
                    </span>
                    <svg className={`h-4 w-4 text-gray-400 transition-transform ${expandedCat === cat.name ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  {expandedCat === cat.name && (
                    <ul className="divide-y divide-gray-100 border-t border-gray-200 dark:divide-gray-700 dark:border-gray-700">
                      {cat.patterns.map((p, i) => (
                        <li key={i}>
                          <button
                            onClick={() => selectPattern(p)}
                            className="w-full px-4 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-900 dark:text-white">{p.name}</span>
                              <span className="text-xs text-indigo-600 dark:text-indigo-400">Use &rarr;</span>
                            </div>
                            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{p.description}</p>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Composer tab */}
          {tab === "composer" && (
            <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Click blocks to append to your pattern. Use the regex field on the right to edit directly.
              </p>
              {COMPOSER_BLOCKS.map(cat => (
                <div key={cat.name}>
                  <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">{cat.name}</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.blocks.map((b, i) => (
                      <button
                        key={i}
                        onClick={() => insertSnippet(b.snippet)}
                        title={b.description}
                        className="rounded-md border border-gray-300 px-2.5 py-1.5 font-mono text-xs text-gray-700 hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-700 dark:border-gray-600 dark:text-gray-300 dark:hover:border-indigo-500 dark:hover:bg-indigo-950 dark:hover:text-indigo-300 transition-colors"
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ---- Right panel: pattern editor, tester, explanation ---- */}
        <div className="space-y-4">
          {/* Pattern input */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Regex Pattern</label>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 dark:text-gray-500 font-mono">/</span>
              <input
                type="text"
                value={pattern}
                onChange={e => { trackFirstInteraction(); setPattern(e.target.value); }}
                placeholder="Enter or build your regex pattern..."
                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 font-mono text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-600"
              />
              <span className="text-gray-400 dark:text-gray-500 font-mono">/{flags}</span>
            </div>
            {regexError && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{regexError}</p>}
          </div>

          {/* Flags */}
          <div className="flex flex-wrap gap-3">
            {FLAG_OPTIONS.map(f => (
              <label key={f.flag} className="inline-flex items-center gap-1.5 text-sm" title={f.desc}>
                <input type="checkbox" checked={flags.includes(f.flag)} onChange={() => toggleFlag(f.flag)} className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800" />
                <span className="text-gray-700 dark:text-gray-300">{f.label}</span>
                <span className="font-mono text-xs text-gray-400">({f.flag})</span>
              </label>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button onClick={handleCopy} disabled={!pattern} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed">
              {copied ? "Copied!" : "Copy Regex"}
            </button>
            <button onClick={() => { setPattern(""); setFlags("g"); setTestText(""); }} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">
              Clear
            </button>
          </div>

          {/* Test input */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Test String</label>
            <textarea
              value={testText}
              onChange={e => { trackFirstInteraction(); setTestText(e.target.value); }}
              placeholder="Paste text to test your regex against..."
              rows={4}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 font-mono text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-600"
            />
          </div>

          {/* Highlighted matches */}
          {highlightedParts && (
            <div>
              <h3 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Highlighted Matches ({matches.length})
              </h3>
              <div className="rounded-lg border border-gray-300 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-950">
                <pre className="whitespace-pre-wrap break-words font-mono text-sm text-gray-900 dark:text-gray-100">
                  {highlightedParts.map((part, i) =>
                    part.highlight ? (
                      <mark key={i} className="rounded bg-yellow-200 px-0.5 text-gray-900 dark:bg-yellow-800 dark:text-yellow-100">{part.text}</mark>
                    ) : (
                      <span key={i}>{part.text}</span>
                    )
                  )}
                </pre>
              </div>
            </div>
          )}

          {/* Match results */}
          {matches.length > 0 && (
            <div>
              <h3 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Match Details
              </h3>
              <div className="rounded-lg border border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-950 max-h-48 overflow-y-auto">
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {matches.slice(0, 50).map((m, i) => (
                    <li key={i} className="px-4 py-2">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-medium text-gray-400">#{i + 1}</span>
                        <code className="font-mono text-sm text-gray-900 dark:text-gray-100">&quot;{m.fullMatch}&quot;</code>
                        <span className="text-xs text-gray-500">at {m.index}</span>
                      </div>
                      {m.groups.length > 0 && (
                        <div className="mt-1 ml-8 flex flex-wrap gap-2">
                          {m.groups.map((g, gi) => (
                            <span key={gi} className="rounded bg-indigo-50 px-2 py-0.5 text-xs font-mono text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                              Group {gi + 1}: &quot;{g ?? ""}&quot;
                            </span>
                          ))}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Regex explanation */}
          {explanation.length > 0 && (
            <div>
              <h3 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Pattern Breakdown
              </h3>
              <div className="rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-950 max-h-48 overflow-y-auto">
                <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                  {explanation.map((line, i) => {
                    const [token, ...descParts] = line.split(" — ");
                    return (
                      <li key={i} className="flex items-baseline gap-3 px-4 py-1.5">
                        <code className="font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400 shrink-0">{token}</code>
                        <span className="text-xs text-gray-600 dark:text-gray-400">{descParts.join(" — ")}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
