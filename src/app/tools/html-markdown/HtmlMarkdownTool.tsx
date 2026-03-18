"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { marked } from "marked";
import TurndownService from "turndown";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import RateLimitBanner from "@/components/RateLimitBanner";

type Direction = "html-to-md" | "md-to-html";
type HeadingStyle = "atx" | "setext";
type BulletMarker = "-" | "*" | "+";
type CodeBlockStyle = "fenced" | "indented";

const SAMPLE_HTML = `<h1>Welcome to DevBolt</h1>
<p>This is a <strong>sample HTML</strong> document with <em>various elements</em> to convert.</p>

<h2>Features</h2>
<ul>
  <li>Convert HTML to clean Markdown</li>
  <li>Convert Markdown back to HTML</li>
  <li>Configurable output options</li>
</ul>

<h3>Code Example</h3>
<pre><code>function hello(name) {
  return \`Hello, \${name}!\`;
}</code></pre>

<blockquote>
  <p>This tool runs entirely in your browser — no data is sent to any server.</p>
</blockquote>

<p>Visit <a href="https://devbolt.dev">DevBolt</a> for more tools.</p>

<table>
  <thead>
    <tr><th>Format</th><th>Use Case</th></tr>
  </thead>
  <tbody>
    <tr><td>HTML</td><td>Web pages, emails</td></tr>
    <tr><td>Markdown</td><td>Documentation, READMEs</td></tr>
  </tbody>
</table>`;

const SAMPLE_MD = `# Welcome to DevBolt

This is a **sample Markdown** document with *various elements* to convert.

## Features

- Convert Markdown to clean HTML
- Convert HTML back to Markdown
- Configurable output options

### Code Example

\`\`\`
function hello(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

> This tool runs entirely in your browser — no data is sent to any server.

Visit [DevBolt](https://devbolt.dev) for more tools.

| Format | Use Case |
|--------|----------|
| HTML | Web pages, emails |
| Markdown | Documentation, READMEs |`;

export default function HtmlMarkdownTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [direction, setDirection] = useState<Direction>("html-to-md");
  const [headingStyle, setHeadingStyle] = useState<HeadingStyle>("atx");
  const [bulletMarker, setBulletMarker] = useState<BulletMarker>("-");
  const [codeBlockStyle, setCodeBlockStyle] =
    useState<CodeBlockStyle>("fenced");
  const [copied, setCopied] = useState(false);

  const { trackAction } = useToolAnalytics("html-markdown");
  const { remaining, dailyLimit, isLimited, recordUsage } =
    useRateLimit("html-markdown");

  const handleConvert = useCallback(() => {
    setError("");
    setOutput("");
    setCopied(false);

    if (!input.trim()) {
      setError(
        direction === "html-to-md"
          ? "Please enter some HTML to convert."
          : "Please enter some Markdown to convert.",
      );
      return;
    }

    if (isLimited) return;
    recordUsage();
    trackAction("convert");

    try {
      if (direction === "html-to-md") {
        const turndown = new TurndownService({
          headingStyle,
          bulletListMarker: bulletMarker,
          codeBlockStyle,
          emDelimiter: "*",
          strongDelimiter: "**",
        });
        setOutput(turndown.turndown(input));
      } else {
        const result = marked.parse(input, { async: false }) as string;
        setOutput(result);
      }
    } catch {
      setError(
        direction === "html-to-md"
          ? "Failed to convert HTML. Check your input and try again."
          : "Failed to convert Markdown. Check your input and try again.",
      );
    }
  }, [
    input,
    direction,
    headingStyle,
    bulletMarker,
    codeBlockStyle,
    isLimited,
    recordUsage,
    trackAction,
  ]);

  useKeyboardShortcut("Enter", handleConvert);

  function handleCopy() {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function handleLoadSample() {
    setInput(direction === "html-to-md" ? SAMPLE_HTML : SAMPLE_MD);
    setOutput("");
    setError("");
  }

  function handleSwap() {
    const newDirection: Direction =
      direction === "html-to-md" ? "md-to-html" : "html-to-md";
    setDirection(newDirection);
    // If there's output, swap it into input for chaining
    if (output) {
      setInput(output);
      setOutput("");
    }
    setError("");
  }

  const inputLabel = direction === "html-to-md" ? "HTML Input" : "Markdown Input";
  const outputLabel =
    direction === "html-to-md" ? "Markdown Output" : "HTML Output";

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="mb-8 block text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        &larr; Back to tools
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        HTML ↔ Markdown Converter
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Convert between HTML and Markdown in either direction. Handles headings,
        lists, code blocks, tables, links, and more.
      </p>

      <RateLimitBanner
        remaining={remaining}
        dailyLimit={dailyLimit}
        isLimited={isLimited}
      />

      {/* Direction toggle + options */}
      <div className="mb-4 flex flex-wrap items-center gap-4">
        {/* Direction toggle */}
        <div className="flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
          <button
            onClick={() => {
              setDirection("html-to-md");
              setOutput("");
              setError("");
            }}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              direction === "html-to-md"
                ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
            }`}
          >
            HTML → MD
          </button>
          <button
            onClick={() => {
              setDirection("md-to-html");
              setOutput("");
              setError("");
            }}
            className={`px-4 py-2 text-sm font-medium transition-colors border-l border-gray-300 dark:border-gray-600 ${
              direction === "md-to-html"
                ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
            }`}
          >
            MD → HTML
          </button>
        </div>

        {/* Swap button */}
        <button
          onClick={handleSwap}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
          title="Swap direction and move output to input"
        >
          ⇄ Swap
        </button>

        {/* HTML→MD specific options */}
        {direction === "html-to-md" && (
          <>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600 dark:text-gray-400">
                Headings:
              </label>
              <select
                value={headingStyle}
                onChange={(e) =>
                  setHeadingStyle(e.target.value as HeadingStyle)
                }
                className="rounded border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="atx"># ATX</option>
                <option value="setext">Setext</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600 dark:text-gray-400">
                Bullets:
              </label>
              <select
                value={bulletMarker}
                onChange={(e) =>
                  setBulletMarker(e.target.value as BulletMarker)
                }
                className="rounded border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="-">- Dash</option>
                <option value="*">* Asterisk</option>
                <option value="+">+ Plus</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600 dark:text-gray-400">
                Code blocks:
              </label>
              <select
                value={codeBlockStyle}
                onChange={(e) =>
                  setCodeBlockStyle(e.target.value as CodeBlockStyle)
                }
                className="rounded border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="fenced">``` Fenced</option>
                <option value="indented">Indented</option>
              </select>
            </div>
          </>
        )}
      </div>

      {/* Input */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {inputLabel}
          </label>
          <button
            onClick={handleLoadSample}
            className="text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            Load sample
          </button>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            direction === "html-to-md"
              ? "<h1>Hello</h1>\n<p>Paste your HTML here...</p>"
              : "# Hello\n\nType your Markdown here..."
          }
          rows={14}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 font-mono text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
          spellCheck={false}
        />
      </div>

      {/* Convert button */}
      <button
        onClick={handleConvert}
        disabled={isLimited || !input.trim()}
        className="mb-6 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-gray-900"
      >
        Convert{" "}
        <kbd className="ml-1.5 hidden rounded bg-indigo-500 px-1.5 py-0.5 text-xs font-medium sm:inline-block">
          Ctrl+Enter
        </kbd>
      </button>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Output */}
      {output && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {outputLabel}
            </label>
            <button
              onClick={handleCopy}
              className="rounded border border-gray-300 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <pre className="max-h-96 overflow-auto rounded-lg border border-gray-200 bg-white p-4 font-mono text-sm text-gray-900 whitespace-pre-wrap dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100">
            {output}
          </pre>
        </div>
      )}

      {/* Info */}
      <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          About HTML ↔ Markdown Converter
        </h2>
        <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
          <li>
            <strong>HTML → Markdown</strong> — converts semantic HTML elements
            into clean, readable Markdown syntax.
          </li>
          <li>
            <strong>Markdown → HTML</strong> — parses Markdown into
            standards-compliant HTML output.
          </li>
          <li>
            <strong>Heading styles</strong> — choose ATX (<code className="text-xs"># Heading</code>) or
            Setext (underlined) for h1/h2.
          </li>
          <li>
            <strong>Swap</strong> — click Swap to reverse direction and chain
            conversions, moving the output into the input.
          </li>
          <li>
            <strong>Tables, code blocks, links</strong> — all common formatting
            elements are preserved during conversion.
          </li>
          <li>
            Everything runs in your browser — no data is sent over the network.
          </li>
        </ul>
      </div>
    </div>
  );
}
