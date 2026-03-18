"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";
import RateLimitBanner from "@/components/RateLimitBanner";

type Language = "javascript" | "css" | "html";

// ─── JavaScript Beautifier & Minifier ───────────────────────────────────────

function beautifyJs(code: string, indent: string): string {
  const lines: string[] = [];
  let depth = 0;
  let i = 0;
  let currentLine = "";

  function pushLine() {
    const trimmed = currentLine.trim();
    if (trimmed) {
      lines.push(indent.repeat(depth) + trimmed);
    }
    currentLine = "";
  }

  while (i < code.length) {
    const ch = code[i];

    // String literals (single, double, backtick)
    if (ch === '"' || ch === "'" || ch === "`") {
      const quote = ch;
      let str = ch;
      i++;
      while (i < code.length) {
        if (code[i] === "\\" && i + 1 < code.length) {
          str += code[i] + code[i + 1];
          i += 2;
          continue;
        }
        str += code[i];
        if (code[i] === quote) {
          i++;
          break;
        }
        i++;
      }
      currentLine += str;
      continue;
    }

    // Single-line comment
    if (ch === "/" && i + 1 < code.length && code[i + 1] === "/") {
      pushLine();
      let comment = "";
      while (i < code.length && code[i] !== "\n") {
        comment += code[i];
        i++;
      }
      lines.push(indent.repeat(depth) + comment.trim());
      if (i < code.length) i++; // skip newline
      continue;
    }

    // Multi-line comment
    if (ch === "/" && i + 1 < code.length && code[i + 1] === "*") {
      pushLine();
      let comment = "";
      while (i < code.length) {
        if (code[i] === "*" && i + 1 < code.length && code[i + 1] === "/") {
          comment += "*/";
          i += 2;
          break;
        }
        comment += code[i];
        i++;
      }
      // Preserve multi-line comment structure
      const commentLines = comment.split("\n");
      for (const cl of commentLines) {
        lines.push(indent.repeat(depth) + cl.trim());
      }
      continue;
    }

    // Regex literal (simple detection: after = ( , ; ! & | ? : [ ~ ^ + - * / % {)
    if (ch === "/" && i > 0) {
      // Look back to see if this could be a regex
      let j = i - 1;
      while (j >= 0 && (code[j] === " " || code[j] === "\t" || code[j] === "\n")) j--;
      const prevChar = j >= 0 ? code[j] : "";
      if ("=(!&|?:;,[~^+-*/%{".includes(prevChar) || prevChar === "") {
        let regex = ch;
        i++;
        while (i < code.length) {
          if (code[i] === "\\" && i + 1 < code.length) {
            regex += code[i] + code[i + 1];
            i += 2;
            continue;
          }
          regex += code[i];
          if (code[i] === "/") {
            i++;
            // Flags
            while (i < code.length && /[gimsuy]/.test(code[i])) {
              regex += code[i];
              i++;
            }
            break;
          }
          i++;
        }
        currentLine += regex;
        continue;
      }
    }

    // Opening braces
    if (ch === "{") {
      currentLine += " {";
      pushLine();
      depth++;
      i++;
      continue;
    }

    // Closing braces
    if (ch === "}") {
      pushLine();
      depth = Math.max(0, depth - 1);
      currentLine = "}";
      // Peek ahead for else, catch, finally, while (do-while)
      let peek = i + 1;
      while (peek < code.length && (code[peek] === " " || code[peek] === "\t" || code[peek] === "\n" || code[peek] === "\r")) peek++;
      const rest = code.slice(peek);
      if (rest.startsWith("else") || rest.startsWith("catch") || rest.startsWith("finally") || rest.startsWith("while")) {
        // Don't push yet, let the keyword attach
      } else {
        pushLine();
      }
      i++;
      continue;
    }

    // Semicolons
    if (ch === ";") {
      // Check if inside a for() header
      let parenDepth = 0;
      for (let k = 0; k < currentLine.length; k++) {
        if (currentLine[k] === "(") parenDepth++;
        if (currentLine[k] === ")") parenDepth--;
      }
      if (parenDepth > 0) {
        currentLine += "; ";
        i++;
        continue;
      }
      currentLine += ";";
      pushLine();
      i++;
      continue;
    }

    // Newlines and whitespace
    if (ch === "\n" || ch === "\r") {
      i++;
      continue;
    }

    if (ch === " " || ch === "\t") {
      if (currentLine.length > 0 && currentLine[currentLine.length - 1] !== " ") {
        currentLine += " ";
      }
      i++;
      continue;
    }

    currentLine += ch;
    i++;
  }

  pushLine();
  return lines.join("\n");
}

function minifyJs(code: string): string {
  let result = "";
  let i = 0;
  let lastNonSpace = "";

  while (i < code.length) {
    const ch = code[i];

    // String literals
    if (ch === '"' || ch === "'" || ch === "`") {
      const quote = ch;
      result += ch;
      i++;
      while (i < code.length) {
        if (code[i] === "\\" && i + 1 < code.length) {
          result += code[i] + code[i + 1];
          i += 2;
          continue;
        }
        result += code[i];
        if (code[i] === quote) {
          lastNonSpace = quote;
          i++;
          break;
        }
        i++;
      }
      continue;
    }

    // Single-line comment — strip
    if (ch === "/" && i + 1 < code.length && code[i + 1] === "/") {
      while (i < code.length && code[i] !== "\n") i++;
      if (i < code.length) i++;
      continue;
    }

    // Multi-line comment — strip
    if (ch === "/" && i + 1 < code.length && code[i + 1] === "*") {
      i += 2;
      while (i < code.length) {
        if (code[i] === "*" && i + 1 < code.length && code[i + 1] === "/") {
          i += 2;
          break;
        }
        i++;
      }
      continue;
    }

    // Whitespace
    if (ch === " " || ch === "\t" || ch === "\n" || ch === "\r") {
      // Check if we need a space to separate identifiers/keywords
      let j = i + 1;
      while (j < code.length && (code[j] === " " || code[j] === "\t" || code[j] === "\n" || code[j] === "\r")) j++;
      const nextChar = j < code.length ? code[j] : "";
      // Need space between word characters
      if (
        /[a-zA-Z0-9_$]/.test(lastNonSpace) &&
        /[a-zA-Z0-9_$]/.test(nextChar)
      ) {
        result += " ";
      }
      i = j;
      continue;
    }

    result += ch;
    lastNonSpace = ch;
    i++;
  }

  return result;
}

// ─── CSS Beautifier & Minifier ──────────────────────────────────────────────

function beautifyCss(code: string, indent: string): string {
  const lines: string[] = [];
  let depth = 0;
  let i = 0;
  let currentLine = "";

  function pushLine() {
    const trimmed = currentLine.trim();
    if (trimmed) {
      lines.push(indent.repeat(depth) + trimmed);
    }
    currentLine = "";
  }

  while (i < code.length) {
    const ch = code[i];

    // String literals
    if (ch === '"' || ch === "'") {
      const quote = ch;
      let str = ch;
      i++;
      while (i < code.length) {
        if (code[i] === "\\" && i + 1 < code.length) {
          str += code[i] + code[i + 1];
          i += 2;
          continue;
        }
        str += code[i];
        if (code[i] === quote) {
          i++;
          break;
        }
        i++;
      }
      currentLine += str;
      continue;
    }

    // Comments
    if (ch === "/" && i + 1 < code.length && code[i + 1] === "*") {
      pushLine();
      let comment = "";
      while (i < code.length) {
        if (code[i] === "*" && i + 1 < code.length && code[i + 1] === "/") {
          comment += "*/";
          i += 2;
          break;
        }
        comment += code[i];
        i++;
      }
      const commentLines = comment.split("\n");
      for (const cl of commentLines) {
        lines.push(indent.repeat(depth) + cl.trim());
      }
      continue;
    }

    if (ch === "{") {
      currentLine += " {";
      pushLine();
      depth++;
      i++;
      continue;
    }

    if (ch === "}") {
      pushLine();
      depth = Math.max(0, depth - 1);
      lines.push(indent.repeat(depth) + "}");
      // Add blank line after top-level rule blocks
      if (depth === 0) {
        lines.push("");
      }
      i++;
      continue;
    }

    if (ch === ";") {
      currentLine += ";";
      pushLine();
      i++;
      continue;
    }

    if (ch === "\n" || ch === "\r") {
      i++;
      continue;
    }

    if (ch === " " || ch === "\t") {
      if (currentLine.length > 0 && currentLine[currentLine.length - 1] !== " ") {
        currentLine += " ";
      }
      i++;
      continue;
    }

    currentLine += ch;
    i++;
  }

  pushLine();

  // Remove trailing blank lines
  while (lines.length > 0 && lines[lines.length - 1].trim() === "") {
    lines.pop();
  }

  return lines.join("\n");
}

function minifyCss(code: string): string {
  let result = "";
  let i = 0;

  while (i < code.length) {
    const ch = code[i];

    // String literals
    if (ch === '"' || ch === "'") {
      const quote = ch;
      result += ch;
      i++;
      while (i < code.length) {
        if (code[i] === "\\" && i + 1 < code.length) {
          result += code[i] + code[i + 1];
          i += 2;
          continue;
        }
        result += code[i];
        if (code[i] === quote) {
          i++;
          break;
        }
        i++;
      }
      continue;
    }

    // Comments — strip
    if (ch === "/" && i + 1 < code.length && code[i + 1] === "*") {
      i += 2;
      while (i < code.length) {
        if (code[i] === "*" && i + 1 < code.length && code[i + 1] === "/") {
          i += 2;
          break;
        }
        i++;
      }
      continue;
    }

    // Whitespace
    if (ch === " " || ch === "\t" || ch === "\n" || ch === "\r") {
      let j = i + 1;
      while (j < code.length && (code[j] === " " || code[j] === "\t" || code[j] === "\n" || code[j] === "\r")) j++;
      // Only keep space if between word characters or needed for selector syntax
      const prev = result.length > 0 ? result[result.length - 1] : "";
      const next = j < code.length ? code[j] : "";
      if (
        prev && next &&
        !"{};:,>~+".includes(prev) &&
        !"{};:,>~+".includes(next) &&
        prev !== "(" && next !== ")" &&
        prev !== ")" && next !== "{"
      ) {
        // Check if space is needed between tokens
        if (/[a-zA-Z0-9_%#.)"]/.test(prev) && /[a-zA-Z0-9_.#@(]/.test(next)) {
          result += " ";
        }
      }
      i = j;
      continue;
    }

    // Remove space after : and before ; in declarations
    result += ch;
    i++;
  }

  // Clean up extra spaces around specific characters
  result = result.replace(/\s*{\s*/g, "{");
  result = result.replace(/\s*}\s*/g, "}");
  result = result.replace(/\s*;\s*/g, ";");
  result = result.replace(/\s*:\s*/g, ":");
  result = result.replace(/\s*,\s*/g, ",");
  // Restore space in media queries and similar constructs
  result = result.replace(/@(media|supports|keyframes|font-face|import|charset|layer)/g, "@$1 ");
  result = result.replace(/\band\(/g, "and (");

  return result;
}

// ─── HTML Beautifier & Minifier ─────────────────────────────────────────────

const HTML_VOID_ELEMENTS = new Set([
  "area", "base", "br", "col", "embed", "hr", "img", "input",
  "link", "meta", "param", "source", "track", "wbr",
]);

const HTML_INLINE_ELEMENTS = new Set([
  "a", "abbr", "b", "bdi", "bdo", "br", "cite", "code", "data", "em",
  "i", "kbd", "mark", "q", "s", "samp", "small", "span", "strong",
  "sub", "sup", "time", "u", "var", "wbr", "img", "input",
]);

const HTML_RAW_CONTENT_TAGS = new Set(["script", "style", "pre", "code", "textarea"]);

interface HtmlToken {
  type: "doctype" | "comment" | "openTag" | "closeTag" | "selfCloseTag" | "text";
  raw: string;
  tagName?: string;
  attributes?: string;
}

function tokenizeHtml(html: string): HtmlToken[] {
  const tokens: HtmlToken[] = [];
  let i = 0;

  while (i < html.length) {
    if (html[i] === "<") {
      // Comment
      if (html.startsWith("<!--", i)) {
        const end = html.indexOf("-->", i);
        if (end === -1) {
          tokens.push({ type: "text", raw: html.slice(i) });
          break;
        }
        tokens.push({ type: "comment", raw: html.slice(i, end + 3) });
        i = end + 3;
        continue;
      }

      // DOCTYPE
      if (html.slice(i, i + 9).toLowerCase() === "<!doctype") {
        const end = html.indexOf(">", i);
        if (end === -1) {
          tokens.push({ type: "text", raw: html.slice(i) });
          break;
        }
        tokens.push({ type: "doctype", raw: html.slice(i, end + 1) });
        i = end + 1;
        continue;
      }

      // Close tag
      if (html[i + 1] === "/") {
        const end = html.indexOf(">", i);
        if (end === -1) {
          tokens.push({ type: "text", raw: html.slice(i) });
          break;
        }
        const tagName = html.slice(i + 2, end).trim().toLowerCase();
        tokens.push({ type: "closeTag", raw: html.slice(i, end + 1), tagName });
        i = end + 1;
        continue;
      }

      // Open tag (handle attributes with > inside quoted values)
      let j = i + 1;
      while (j < html.length) {
        if (html[j] === '"' || html[j] === "'") {
          const q = html[j];
          j++;
          while (j < html.length && html[j] !== q) j++;
          if (j < html.length) j++;
          continue;
        }
        if (html[j] === ">") break;
        j++;
      }
      if (j >= html.length) {
        tokens.push({ type: "text", raw: html.slice(i) });
        break;
      }

      const tagContent = html.slice(i + 1, j);
      const selfClosing = tagContent.trimEnd().endsWith("/");
      const cleanContent = selfClosing ? tagContent.replace(/\/\s*$/, "") : tagContent;

      const nameMatch = cleanContent.match(/^(\S+)([\s\S]*)$/);
      if (nameMatch) {
        const tagName = nameMatch[1].toLowerCase();
        const attributes = nameMatch[2].trim();
        const isSelfClose = selfClosing || HTML_VOID_ELEMENTS.has(tagName);
        tokens.push({
          type: isSelfClose ? "selfCloseTag" : "openTag",
          raw: html.slice(i, j + 1),
          tagName,
          attributes: attributes || undefined,
        });

        i = j + 1;

        // For raw content tags (script, style, pre), grab everything until closing tag
        if (!isSelfClose && HTML_RAW_CONTENT_TAGS.has(tagName)) {
          const closePattern = `</${tagName}>`;
          const closeIdx = html.toLowerCase().indexOf(closePattern, i);
          if (closeIdx !== -1) {
            const rawContent = html.slice(i, closeIdx);
            if (rawContent) {
              tokens.push({ type: "text", raw: rawContent });
            }
            tokens.push({
              type: "closeTag",
              raw: html.slice(closeIdx, closeIdx + closePattern.length),
              tagName,
            });
            i = closeIdx + closePattern.length;
          }
        }
      } else {
        tokens.push({ type: "text", raw: html.slice(i, j + 1) });
        i = j + 1;
      }
      continue;
    }

    // Text content
    let text = "";
    while (i < html.length && html[i] !== "<") {
      text += html[i];
      i++;
    }
    if (text) {
      tokens.push({ type: "text", raw: text });
    }
  }

  return tokens;
}

function beautifyHtml(html: string, indent: string): string {
  const tokens = tokenizeHtml(html);
  const lines: string[] = [];
  let depth = 0;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    switch (token.type) {
      case "doctype":
        lines.push(indent.repeat(depth) + token.raw.trim());
        break;

      case "comment":
        lines.push(indent.repeat(depth) + token.raw.trim());
        break;

      case "openTag": {
        const attrs = token.attributes ? " " + token.attributes : "";
        const tagStr = `<${token.tagName}${attrs}>`;

        // Check for inline pattern: <tag>short text</tag>
        if (
          i + 2 < tokens.length &&
          tokens[i + 1].type === "text" &&
          tokens[i + 2].type === "closeTag" &&
          tokens[i + 2].tagName === token.tagName
        ) {
          const textContent = tokens[i + 1].raw.trim();
          if (textContent && !textContent.includes("\n") && textContent.length < 80) {
            lines.push(
              indent.repeat(depth) +
              `<${token.tagName}${attrs}>${textContent}</${token.tagName}>`
            );
            i += 2;
            break;
          }
        }

        lines.push(indent.repeat(depth) + tagStr);

        // Don't increase depth for inline elements
        if (!HTML_INLINE_ELEMENTS.has(token.tagName || "")) {
          depth++;
        }

        // For raw content tags, preserve content indentation
        if (HTML_RAW_CONTENT_TAGS.has(token.tagName || "")) {
          if (i + 1 < tokens.length && tokens[i + 1].type === "text") {
            const content = tokens[i + 1].raw;
            // Preserve raw content as-is but re-indent
            const contentLines = content.split("\n");
            for (const cl of contentLines) {
              const trimmed = cl.trim();
              if (trimmed) {
                lines.push(indent.repeat(depth) + trimmed);
              }
            }
            i++;
          }
        }
        break;
      }

      case "closeTag": {
        if (!HTML_INLINE_ELEMENTS.has(token.tagName || "")) {
          depth = Math.max(0, depth - 1);
        }
        lines.push(indent.repeat(depth) + `</${token.tagName}>`);
        break;
      }

      case "selfCloseTag": {
        const attrs = token.attributes ? " " + token.attributes : "";
        const closing = HTML_VOID_ELEMENTS.has(token.tagName || "") ? ">" : " />";
        lines.push(indent.repeat(depth) + `<${token.tagName}${attrs}${closing}`);
        break;
      }

      case "text": {
        const trimmed = token.raw.trim();
        if (trimmed) {
          lines.push(indent.repeat(depth) + trimmed);
        }
        break;
      }
    }
  }

  return lines.join("\n");
}

function minifyHtml(html: string): string {
  const tokens = tokenizeHtml(html);
  let result = "";

  for (const token of tokens) {
    switch (token.type) {
      case "comment":
        // Strip comments (except conditional comments for IE)
        if (token.raw.startsWith("<!--[if")) {
          result += token.raw;
        }
        break;
      case "text": {
        // Collapse whitespace in text nodes
        const collapsed = token.raw.replace(/\s+/g, " ").trim();
        if (collapsed) {
          result += collapsed;
        }
        break;
      }
      default:
        // For tags, strip internal whitespace
        result += token.raw.replace(/\s+/g, " ").trim();
        break;
    }
  }

  return result;
}

// ─── Samples ────────────────────────────────────────────────────────────────

const SAMPLE_JS = `// Simple Express.js API server
const express = require('express');
const app = express();

app.use(express.json());

// User data store
const users = [
  { id: 1, name: "Alice", role: "admin" },
  { id: 2, name: "Bob", role: "user" },
  { id: 3, name: "Charlie", role: "user" }
];

// Get all users with optional role filter
app.get('/api/users', (req, res) => {
  const { role } = req.query;
  if (role) {
    const filtered = users.filter(u => u.role === role);
    return res.json({ count: filtered.length, users: filtered });
  }
  res.json({ count: users.length, users });
});

// Get user by ID
app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json(user);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});`;

const SAMPLE_CSS = `/* Global reset and base styles */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  --primary: #6366f1;
  --primary-hover: #4f46e5;
  --bg: #ffffff;
  --text: #1f2937;
  --border: #e5e7eb;
  --radius: 8px;
}

body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  color: var(--text);
  background: var(--bg);
  line-height: 1.6;
}

/* Card component */
.card {
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.5rem;
  transition: box-shadow 0.2s ease;
}

.card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card__title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

/* Button styles */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: var(--radius);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn--primary {
  background: var(--primary);
  color: white;
  border: none;
}

.btn--primary:hover {
  background: var(--primary-hover);
}

/* Responsive grid */
@media (min-width: 768px) {
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }
}`;

const SAMPLE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My App - Dashboard</title>
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <header class="navbar">
    <a href="/" class="logo">MyApp</a>
    <nav>
      <ul class="nav-links">
        <li><a href="/dashboard">Dashboard</a></li>
        <li><a href="/settings">Settings</a></li>
        <li><a href="/profile">Profile</a></li>
      </ul>
    </nav>
  </header>
  <main class="container">
    <h1>Welcome back, User</h1>
    <div class="card-grid">
      <div class="card">
        <h2>Statistics</h2>
        <p>View your usage stats and analytics.</p>
        <button class="btn btn-primary">View Stats</button>
      </div>
      <div class="card">
        <h2>Recent Activity</h2>
        <p>Check your recent actions and history.</p>
        <button class="btn btn-secondary">View Activity</button>
      </div>
    </div>
  </main>
  <footer>
    <p>&copy; 2024 MyApp. All rights reserved.</p>
  </footer>
  <script src="/app.js"></script>
</body>
</html>`;

const LANG_CONFIG: Record<
  Language,
  {
    label: string;
    placeholder: string;
    sample: string;
    beautify: (code: string, indent: string) => string;
    minify: (code: string) => string;
  }
> = {
  javascript: {
    label: "JavaScript",
    placeholder: "Paste your JavaScript code here...",
    sample: SAMPLE_JS,
    beautify: beautifyJs,
    minify: minifyJs,
  },
  css: {
    label: "CSS",
    placeholder: "Paste your CSS code here...",
    sample: SAMPLE_CSS,
    beautify: beautifyCss,
    minify: minifyCss,
  },
  html: {
    label: "HTML",
    placeholder: "Paste your HTML markup here...",
    sample: SAMPLE_HTML,
    beautify: beautifyHtml,
    minify: minifyHtml,
  },
};

export default function CodeMinifierTool() {
  const [language, setLanguage] = useState<Language>("javascript");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [indentSize, setIndentSize] = useState<"2" | "4" | "tab">("2");
  const { remaining, dailyLimit, isLimited, recordUsage } =
    useRateLimit("code-minifier");
  const { trackAction } = useToolAnalytics("code-minifier");

  const getIndent = () => {
    if (indentSize === "tab") return "\t";
    return " ".repeat(Number(indentSize));
  };

  const config = LANG_CONFIG[language];

  const handleBeautify = useCallback(() => {
    if (isLimited) return;
    recordUsage();
    trackAction("beautify");
    setError("");
    setOutput("");
    try {
      if (!input.trim()) {
        setError("Please enter code to beautify.");
        return;
      }
      const result = config.beautify(input, getIndent());
      setOutput(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error beautifying code");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, isLimited, recordUsage, trackAction, indentSize, language]);

  useKeyboardShortcut("Enter", handleBeautify);

  function handleMinify() {
    if (isLimited) return;
    recordUsage();
    trackAction("minify");
    setError("");
    setOutput("");
    try {
      if (!input.trim()) {
        setError("Please enter code to minify.");
        return;
      }
      const result = config.minify(input);
      setOutput(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error minifying code");
    }
  }

  function handleCopy() {
    if (output) {
      navigator.clipboard.writeText(output);
    }
  }

  function handleLoadSample() {
    setInput(config.sample);
    setOutput("");
    setError("");
  }

  function handleLanguageChange(lang: Language) {
    setLanguage(lang);
    setInput("");
    setOutput("");
    setError("");
  }

  // Calculate size stats
  const inputSize = new Blob([input]).size;
  const outputSize = output ? new Blob([output]).size : 0;
  const savings = inputSize > 0 && outputSize > 0
    ? Math.round((1 - outputSize / inputSize) * 100)
    : 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="mb-8 block text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        &larr; Back to tools
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Code Minifier &amp; Beautifier
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Minify or beautify JavaScript, CSS, and HTML code instantly. No
        data leaves your browser.
      </p>

      {/* Language tabs */}
      <div className="flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden mb-4 w-fit">
        {(["javascript", "css", "html"] as const).map((lang) => (
          <button
            key={lang}
            onClick={() => handleLanguageChange(lang)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              language === lang
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            {LANG_CONFIG[lang].label}
          </button>
        ))}
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={config.placeholder}
        rows={12}
        spellCheck={false}
        className="w-full rounded-lg border border-gray-300 bg-white p-4 font-mono text-sm dark:border-gray-700 dark:bg-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      />

      {/* Options row */}
      <div className="flex flex-wrap items-center gap-4 mt-3 text-sm">
        <div className="flex items-center gap-2">
          <label className="text-gray-600 dark:text-gray-400 font-medium">
            Indent:
          </label>
          <div className="flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
            {(["2", "4", "tab"] as const).map((size) => (
              <button
                key={size}
                onClick={() => setIndentSize(size)}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  indentSize === size
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                {size === "tab" ? "Tab" : `${size} spaces`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap items-center gap-2 mt-4">
        <button
          onClick={handleBeautify}
          disabled={isLimited}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          Beautify{" "}
          <kbd className="ml-1 hidden rounded bg-indigo-500 px-1.5 py-0.5 text-xs font-normal text-indigo-100 sm:inline">
            Ctrl+Enter
          </kbd>
        </button>
        <button
          onClick={handleMinify}
          disabled={isLimited}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          Minify
        </button>
        <button
          onClick={handleLoadSample}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
        >
          Load sample
        </button>
        <RateLimitBanner
          remaining={remaining}
          dailyLimit={dailyLimit}
          isLimited={isLimited}
        />
      </div>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-600 dark:bg-red-950 dark:border-red-800 dark:text-red-400">
          {error}
        </div>
      )}

      {output && (
        <div className="relative mt-4 rounded-lg border border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-950">
          <div className="flex items-center justify-between px-4 pt-3">
            {/* Size stats */}
            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
              <span>
                Input: {inputSize.toLocaleString()} B
              </span>
              <span>
                Output: {outputSize.toLocaleString()} B
              </span>
              {savings !== 0 && (
                <span
                  className={
                    savings > 0
                      ? "text-green-600 dark:text-green-400 font-medium"
                      : "text-amber-600 dark:text-amber-400"
                  }
                >
                  {savings > 0 ? `${savings}% smaller` : `${Math.abs(savings)}% larger`}
                </span>
              )}
            </div>
            <button
              onClick={handleCopy}
              className="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Copy
            </button>
          </div>
          <textarea
            readOnly
            value={output}
            rows={Math.min(20, output.split("\n").length + 1)}
            spellCheck={false}
            className="w-full rounded-lg border-0 bg-transparent p-4 font-mono text-sm text-gray-900 dark:text-gray-100 focus:outline-none"
          />
        </div>
      )}

      {/* About section */}
      <details className="mt-8 rounded-lg border border-gray-200 dark:border-gray-700">
        <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          About Code Minification &amp; Beautification
        </summary>
        <div className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400 space-y-3">
          <p>
            <strong>Beautify</strong> reformats your code with proper indentation,
            line breaks, and spacing for maximum readability. Great for reading
            minified production code or cleaning up messy formatting.
          </p>
          <p>
            <strong>Minify</strong> removes all unnecessary whitespace, comments,
            and formatting to produce the smallest possible output. Minified code
            loads faster and uses less bandwidth — essential for production
            deployments.
          </p>
          <p>
            <strong>JavaScript:</strong> Handles string literals (single, double,
            template), comments (single-line and multi-line), regex literals, and
            all modern syntax. Preserves semicolons and statement structure.
          </p>
          <p>
            <strong>CSS:</strong> Handles selectors, declarations, at-rules
            (@media, @keyframes), comments, and nested structures. Collapses
            whitespace around delimiters for maximum compression.
          </p>
          <p>
            <strong>HTML:</strong> Handles all standard tags, void elements (br,
            img, input, etc.), comments, DOCTYPE declarations, and embedded
            script/style content. Preserves content within pre and textarea tags.
          </p>
        </div>
      </details>
    </div>
  );
}
