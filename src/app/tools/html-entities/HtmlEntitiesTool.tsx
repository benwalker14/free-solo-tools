"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";
import RateLimitBanner from "@/components/RateLimitBanner";

type EncodeMode = "minimal" | "all";

// Named HTML entities (decode map: entity name → character)
const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: "\u00A0",
  copy: "\u00A9",
  reg: "\u00AE",
  trade: "\u2122",
  euro: "\u20AC",
  pound: "\u00A3",
  yen: "\u00A5",
  cent: "\u00A2",
  deg: "\u00B0",
  plusmn: "\u00B1",
  times: "\u00D7",
  divide: "\u00F7",
  micro: "\u00B5",
  para: "\u00B6",
  sect: "\u00A7",
  middot: "\u00B7",
  bull: "\u2022",
  hellip: "\u2026",
  prime: "\u2032",
  Prime: "\u2033",
  lsquo: "\u2018",
  rsquo: "\u2019",
  ldquo: "\u201C",
  rdquo: "\u201D",
  laquo: "\u00AB",
  raquo: "\u00BB",
  ndash: "\u2013",
  mdash: "\u2014",
  larr: "\u2190",
  uarr: "\u2191",
  rarr: "\u2192",
  darr: "\u2193",
  harr: "\u2194",
  spades: "\u2660",
  clubs: "\u2663",
  hearts: "\u2665",
  diams: "\u2666",
  ne: "\u2260",
  le: "\u2264",
  ge: "\u2265",
  infin: "\u221E",
  fnof: "\u0192",
  alpha: "\u03B1",
  beta: "\u03B2",
  gamma: "\u03B3",
  delta: "\u03B4",
  pi: "\u03C0",
  sigma: "\u03C3",
  omega: "\u03C9",
};

// Reverse map: character → preferred entity name (for "all" mode)
const CHAR_TO_ENTITY: Record<string, string> = {};
for (const [name, char] of Object.entries(NAMED_ENTITIES)) {
  // Only store the first (shortest/most common) mapping per character
  if (!CHAR_TO_ENTITY[char]) {
    CHAR_TO_ENTITY[char] = name;
  }
}

const COMMON_ENTITIES = [
  { char: "&", entity: "&amp;", code: "&#38;", description: "Ampersand" },
  { char: "<", entity: "&lt;", code: "&#60;", description: "Less than" },
  { char: ">", entity: "&gt;", code: "&#62;", description: "Greater than" },
  { char: '"', entity: "&quot;", code: "&#34;", description: "Double quote" },
  { char: "'", entity: "&apos;", code: "&#39;", description: "Single quote" },
  {
    char: "\u00A0",
    entity: "&nbsp;",
    code: "&#160;",
    description: "Non-breaking space",
  },
  { char: "\u00A9", entity: "&copy;", code: "&#169;", description: "Copyright" },
  {
    char: "\u00AE",
    entity: "&reg;",
    code: "&#174;",
    description: "Registered trademark",
  },
  { char: "\u2122", entity: "&trade;", code: "&#8482;", description: "Trademark" },
  { char: "\u20AC", entity: "&euro;", code: "&#8364;", description: "Euro sign" },
  {
    char: "\u00A3",
    entity: "&pound;",
    code: "&#163;",
    description: "Pound sign",
  },
  { char: "\u2014", entity: "&mdash;", code: "&#8212;", description: "Em dash" },
  { char: "\u2013", entity: "&ndash;", code: "&#8211;", description: "En dash" },
  {
    char: "\u2026",
    entity: "&hellip;",
    code: "&#8230;",
    description: "Ellipsis",
  },
  { char: "\u00B0", entity: "&deg;", code: "&#176;", description: "Degree" },
  { char: "\u00D7", entity: "&times;", code: "&#215;", description: "Multiply" },
  { char: "\u00F7", entity: "&divide;", code: "&#247;", description: "Divide" },
  { char: "\u2192", entity: "&rarr;", code: "&#8594;", description: "Right arrow" },
];

function encodeHtmlEntities(text: string, mode: EncodeMode): string {
  if (mode === "minimal") {
    // Only encode the 5 XML special characters
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  // "all" mode: encode special chars + all non-ASCII characters
  let result = "";
  for (const char of text) {
    const code = char.codePointAt(0)!;

    // Encode & < > " ' using named entities
    if (char === "&") {
      result += "&amp;";
    } else if (char === "<") {
      result += "&lt;";
    } else if (char === ">") {
      result += "&gt;";
    } else if (char === '"') {
      result += "&quot;";
    } else if (char === "'") {
      result += "&#39;";
    } else if (code > 127) {
      // Non-ASCII: use named entity if available, otherwise numeric
      const entityName = CHAR_TO_ENTITY[char];
      if (entityName) {
        result += `&${entityName};`;
      } else {
        result += `&#${code};`;
      }
    } else {
      // Printable ASCII — pass through
      result += char;
    }
  }
  return result;
}

function decodeHtmlEntities(text: string): string {
  return text.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (match, entity) => {
    // Numeric: &#123; or &#x7B;
    if (entity.startsWith("#x") || entity.startsWith("#X")) {
      const code = parseInt(entity.slice(2), 16);
      return isNaN(code) ? match : String.fromCodePoint(code);
    }
    if (entity.startsWith("#")) {
      const code = parseInt(entity.slice(1), 10);
      return isNaN(code) ? match : String.fromCodePoint(code);
    }
    // Named entity
    const char = NAMED_ENTITIES[entity];
    return char !== undefined ? char : match;
  });
}

export default function HtmlEntitiesTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState<EncodeMode>("minimal");
  const { remaining, dailyLimit, isLimited, recordUsage } =
    useRateLimit("html-entities");
  const { trackAction } = useToolAnalytics("html-entities");

  const handleEncode = useCallback(() => {
    if (isLimited) return;
    recordUsage();
    trackAction("encode");
    setError("");
    try {
      setOutput(encodeHtmlEntities(input, mode));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to encode");
    }
  }, [input, isLimited, recordUsage, trackAction, mode]);

  useKeyboardShortcut("Enter", handleEncode);

  function handleDecode() {
    if (isLimited) return;
    recordUsage();
    trackAction("decode");
    setError("");
    try {
      setOutput(decodeHtmlEntities(input));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to decode");
    }
  }

  function handleCopy() {
    if (output) {
      navigator.clipboard.writeText(output);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="mb-8 block text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        &larr; Back to tools
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        HTML Entity Encoder &amp; Decoder
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Encode special characters as HTML entities or decode entities back to
        text. Fast, private, and free.
      </p>

      {/* Encoding mode toggle */}
      <div className="mb-4 flex items-center gap-4">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Encode mode:
        </span>
        <div className="inline-flex rounded-lg border border-gray-300 dark:border-gray-700">
          <button
            onClick={() => setMode("minimal")}
            className={`rounded-l-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              mode === "minimal"
                ? "bg-indigo-600 text-white"
                : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
            }`}
          >
            Minimal
          </button>
          <button
            onClick={() => setMode("all")}
            className={`rounded-r-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              mode === "all"
                ? "bg-indigo-600 text-white"
                : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
            }`}
          >
            All Characters
          </button>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-500">
          {mode === "minimal"
            ? 'Only encodes & < > " \' (safe for HTML content)'
            : "Also encodes all non-ASCII characters (for ASCII-only output)"}
        </span>
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter text or HTML entities (e.g. <div class=&quot;hello&quot;> or &amp;copy; &amp;mdash;)..."
        rows={8}
        className="w-full rounded-lg border border-gray-300 bg-white p-4 font-mono text-sm dark:border-gray-700 dark:bg-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      />

      <div className="flex flex-wrap items-center gap-2 mt-4">
        <button
          onClick={handleEncode}
          disabled={isLimited}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          Encode{" "}
          <kbd className="ml-1 hidden rounded bg-indigo-500 px-1.5 py-0.5 text-xs font-normal text-indigo-100 sm:inline">
            Ctrl+Enter
          </kbd>
        </button>
        <button
          onClick={handleDecode}
          disabled={isLimited}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          Decode
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
          <button
            onClick={handleCopy}
            className="absolute right-2 top-2 rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Copy
          </button>
          <textarea
            readOnly
            value={output}
            rows={8}
            className="w-full rounded-lg border-0 bg-transparent p-4 font-mono text-sm text-gray-900 dark:text-gray-100 focus:outline-none"
          />
        </div>
      )}

      {/* Common entities reference table */}
      <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
          Common HTML Entities
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="py-1.5 pr-4 text-left font-medium text-gray-600 dark:text-gray-400">
                  Character
                </th>
                <th className="py-1.5 pr-4 text-left font-medium text-gray-600 dark:text-gray-400">
                  Named
                </th>
                <th className="py-1.5 pr-4 text-left font-medium text-gray-600 dark:text-gray-400">
                  Numeric
                </th>
                <th className="py-1.5 text-left font-medium text-gray-600 dark:text-gray-400">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {COMMON_ENTITIES.map((ent) => (
                <tr key={ent.entity}>
                  <td className="py-1.5 pr-4 font-mono text-gray-900 dark:text-gray-100">
                    {ent.char === "\u00A0" ? "␣" : ent.char}
                  </td>
                  <td className="py-1.5 pr-4">
                    <code className="rounded bg-gray-200 px-1 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                      {ent.entity}
                    </code>
                  </td>
                  <td className="py-1.5 pr-4">
                    <code className="rounded bg-gray-200 px-1 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                      {ent.code}
                    </code>
                  </td>
                  <td className="py-1.5 text-gray-600 dark:text-gray-400">
                    {ent.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick reference */}
      <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
          Quick Reference
        </h2>
        <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
          <p>
            <strong className="text-gray-800 dark:text-gray-200">
              Minimal mode
            </strong>{" "}
            encodes only the 5 characters that are special in HTML/XML:{" "}
            <code className="rounded bg-gray-200 px-1 dark:bg-gray-800">
              &amp; &lt; &gt; &quot; &#39;
            </code>
            . Use this when your text contains HTML tags or attributes.
          </p>
          <p>
            <strong className="text-gray-800 dark:text-gray-200">
              All Characters mode
            </strong>{" "}
            also encodes every non-ASCII character (accented letters, symbols,
            emoji) using named entities where available, or numeric codes. Use
            this when you need pure ASCII output.
          </p>
          <p>
            <strong className="text-gray-800 dark:text-gray-200">
              Decoding
            </strong>{" "}
            recognizes named entities (
            <code className="rounded bg-gray-200 px-1 dark:bg-gray-800">
              &amp;amp;
            </code>
            ), decimal codes (
            <code className="rounded bg-gray-200 px-1 dark:bg-gray-800">
              &amp;#169;
            </code>
            ), and hex codes (
            <code className="rounded bg-gray-200 px-1 dark:bg-gray-800">
              &amp;#xA9;
            </code>
            ).
          </p>
        </div>
      </div>
    </div>
  );
}
