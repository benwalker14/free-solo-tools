"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";

// Common unicode transliterations
const TRANSLITERATIONS: Record<string, string> = {
  à: "a", á: "a", â: "a", ã: "a", ä: "a", å: "a", æ: "ae",
  ç: "c", è: "e", é: "e", ê: "e", ë: "e",
  ì: "i", í: "i", î: "i", ï: "i",
  ð: "d", ñ: "n", ò: "o", ó: "o", ô: "o", õ: "o", ö: "o", ø: "o",
  ù: "u", ú: "u", û: "u", ü: "u", ý: "y", ÿ: "y",
  ß: "ss", þ: "th",
  ą: "a", ć: "c", ę: "e", ł: "l", ń: "n", ś: "s", ź: "z", ż: "z",
  č: "c", ď: "d", ě: "e", ň: "n", ř: "r", š: "s", ť: "t", ů: "u", ž: "z",
  ő: "o", ű: "u",
  ā: "a", ē: "e", ī: "i", ō: "o", ū: "u",
  đ: "d",
};

const COMMON_STOP_WORDS = new Set([
  "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for",
  "of", "with", "by", "from", "is", "it", "as", "if", "not", "no",
  "be", "was", "are", "were", "been", "have", "has", "had",
  "do", "does", "did", "will", "would", "shall", "should",
  "may", "might", "must", "can", "could",
  "this", "that", "these", "those",
]);

type SeparatorStyle = "hyphen" | "underscore" | "dot";

function transliterate(text: string): string {
  return text
    .split("")
    .map((char) => TRANSLITERATIONS[char] || TRANSLITERATIONS[char.toLowerCase()] || char)
    .join("");
}

function generateSlug(
  text: string,
  separator: SeparatorStyle,
  lowercase: boolean,
  removeStopWords: boolean,
  maxLength: number,
): string {
  if (!text.trim()) return "";

  let result = transliterate(text);

  // Normalize to ASCII-safe
  result = result.normalize("NFKD").replace(/[\u0300-\u036f]/g, "");

  if (lowercase) {
    result = result.toLowerCase();
  }

  // Replace non-alphanumeric chars with separator
  const sep = separator === "hyphen" ? "-" : separator === "underscore" ? "_" : ".";
  result = result.replace(/[^a-zA-Z0-9]+/g, sep);

  // Remove stop words if enabled
  if (removeStopWords) {
    const parts = result.split(sep).filter((word) => {
      return !COMMON_STOP_WORDS.has(word.toLowerCase());
    });
    result = parts.join(sep);
  }

  // Remove leading/trailing separators
  result = result.replace(new RegExp(`^[${sep === "." ? "\\." : sep}]+|[${sep === "." ? "\\." : sep}]+$`, "g"), "");

  // Collapse repeated separators
  result = result.replace(new RegExp(`[${sep === "." ? "\\." : sep}]{2,}`, "g"), sep);

  // Enforce max length (trim at word boundary)
  if (maxLength > 0 && result.length > maxLength) {
    result = result.slice(0, maxLength);
    const lastSep = result.lastIndexOf(sep);
    if (lastSep > maxLength * 0.5) {
      result = result.slice(0, lastSep);
    }
  }

  return result;
}

const PRESETS = [
  { label: "WordPress", separator: "hyphen" as SeparatorStyle, lowercase: true, stopWords: true, maxLength: 75 },
  { label: "GitHub", separator: "hyphen" as SeparatorStyle, lowercase: true, stopWords: false, maxLength: 0 },
  { label: "Python / Django", separator: "hyphen" as SeparatorStyle, lowercase: true, stopWords: false, maxLength: 50 },
  { label: "Ruby on Rails", separator: "hyphen" as SeparatorStyle, lowercase: true, stopWords: false, maxLength: 0 },
  { label: "File naming", separator: "underscore" as SeparatorStyle, lowercase: true, stopWords: false, maxLength: 0 },
  { label: "SEO-friendly", separator: "hyphen" as SeparatorStyle, lowercase: true, stopWords: true, maxLength: 60 },
];

export default function SlugGeneratorTool() {
  const [input, setInput] = useState("");
  const [separator, setSeparator] = useState<SeparatorStyle>("hyphen");
  const [lowercase, setLowercase] = useState(true);
  const [removeStopWords, setRemoveStopWords] = useState(false);
  const [maxLength, setMaxLength] = useState(0);
  const [bulkMode, setBulkMode] = useState(false);
  const [copied, setCopied] = useState(false);
  const { trackFirstInteraction } = useToolAnalytics("slug-generator");

  const slugs = useMemo(() => {
    if (bulkMode) {
      return input
        .split("\n")
        .filter((line) => line.trim())
        .map((line) => ({
          input: line.trim(),
          slug: generateSlug(line.trim(), separator, lowercase, removeStopWords, maxLength),
        }));
    }
    const slug = generateSlug(input, separator, lowercase, removeStopWords, maxLength);
    return slug ? [{ input: input.trim(), slug }] : [];
  }, [input, separator, lowercase, removeStopWords, maxLength, bulkMode]);

  function handleInputChange(value: string) {
    setInput(value);
    trackFirstInteraction();
    setCopied(false);
  }

  function applyPreset(preset: (typeof PRESETS)[number]) {
    setSeparator(preset.separator);
    setLowercase(preset.lowercase);
    setRemoveStopWords(preset.stopWords);
    setMaxLength(preset.maxLength);
    trackFirstInteraction();
    setCopied(false);
  }

  function handleCopy() {
    const text = bulkMode
      ? slugs.map((s) => s.slug).join("\n")
      : slugs[0]?.slug || "";
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const sepChar = separator === "hyphen" ? "-" : separator === "underscore" ? "_" : ".";

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="mb-8 block text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        &larr; Back to tools
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        URL Slug Generator
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Convert text into clean, URL-friendly slugs. Handles Unicode,
        transliteration, and stop words.
      </p>

      {/* Presets */}
      <div className="mb-6">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
          Quick presets
        </label>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => applyPreset(preset)}
              className="rounded-full border border-gray-300 px-3 py-1 text-xs font-medium text-gray-600 hover:border-indigo-400 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-400 dark:hover:border-indigo-500 dark:hover:text-indigo-400 transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Options */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
            Separator
          </label>
          <select
            value={separator}
            onChange={(e) => {
              setSeparator(e.target.value as SeparatorStyle);
              setCopied(false);
            }}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
          >
            <option value="hyphen">Hyphen (-)</option>
            <option value="underscore">Underscore (_)</option>
            <option value="dot">Dot (.)</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
            Max length
          </label>
          <input
            type="number"
            value={maxLength || ""}
            onChange={(e) => {
              setMaxLength(Math.max(0, parseInt(e.target.value) || 0));
              setCopied(false);
            }}
            placeholder="No limit"
            min={0}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
          />
        </div>

        <label className="flex items-center gap-2 self-end pb-2 cursor-pointer">
          <input
            type="checkbox"
            checked={lowercase}
            onChange={(e) => {
              setLowercase(e.target.checked);
              setCopied(false);
            }}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-900"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Lowercase
          </span>
        </label>

        <label className="flex items-center gap-2 self-end pb-2 cursor-pointer">
          <input
            type="checkbox"
            checked={removeStopWords}
            onChange={(e) => {
              setRemoveStopWords(e.target.checked);
              setCopied(false);
            }}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-900"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Remove stop words
          </span>
        </label>
      </div>

      {/* Bulk mode toggle */}
      <div className="mb-4 flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {bulkMode ? "Input text (one per line)" : "Input text"}
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={bulkMode}
            onChange={(e) => setBulkMode(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-900"
          />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Bulk mode
          </span>
        </label>
      </div>

      {/* Input */}
      <textarea
        value={input}
        onChange={(e) => handleInputChange(e.target.value)}
        placeholder={
          bulkMode
            ? "Enter text, one per line:\nHow to Build a REST API\n10 Tips for Better SEO\nIntroduction à la Programmation"
            : "e.g. How to Build a REST API with Node.js & Express"
        }
        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 font-mono text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
        rows={bulkMode ? 6 : 3}
        spellCheck={false}
      />

      {/* Output */}
      {slugs.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {bulkMode ? `Generated slugs (${slugs.length})` : "Generated slug"}
            </h2>
            <button
              onClick={handleCopy}
              className="rounded border border-gray-300 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
            >
              {copied ? "Copied!" : bulkMode ? "Copy All" : "Copy"}
            </button>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {slugs.map((item, i) => (
              <div key={i} className="px-4 py-3">
                {bulkMode && (
                  <div className="text-xs text-gray-400 dark:text-gray-500 mb-1 truncate">
                    {item.input}
                  </div>
                )}
                <div className="font-mono text-sm text-gray-900 dark:text-gray-100 break-all">
                  {item.slug}
                </div>
                {!bulkMode && maxLength > 0 && (
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {item.slug.length} / {maxLength} characters
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* URL preview */}
          {!bulkMode && slugs[0] && (
            <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-900">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                URL preview
              </div>
              <div className="font-mono text-sm text-gray-700 dark:text-gray-300 break-all">
                <span className="text-gray-400">https://example.com/blog/</span>
                <span className="text-indigo-600 dark:text-indigo-400">
                  {slugs[0].slug}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Live examples */}
      {!input.trim() && (
        <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Examples
          </h2>
          <div className="space-y-2 text-sm">
            {[
              "How to Build a REST API with Node.js",
              "Les Misérables — Victor Hugo",
              "10 Günter's Tips & Tricks for CSS!",
              "Привет мир (Hello World)",
            ].map((example) => (
              <div key={example} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                <span className="text-gray-500 dark:text-gray-400 truncate sm:w-1/2">
                  {example}
                </span>
                <span className="text-gray-300 dark:text-gray-600 hidden sm:block">
                  &rarr;
                </span>
                <code className="font-mono text-indigo-600 dark:text-indigo-400 break-all">
                  {generateSlug(example, separator, lowercase, removeStopWords, maxLength) || "(empty — adjust settings)"}
                </code>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          About URL Slugs
        </h2>
        <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
          <li>
            A URL slug is the part of a URL that identifies a page in human-readable form — e.g.{" "}
            <code className="text-xs bg-gray-200 dark:bg-gray-800 px-1 rounded">/blog/how{sepChar}to{sepChar}build{sepChar}a{sepChar}rest{sepChar}api</code>.
          </li>
          <li>
            Unicode characters like accented letters (é, ñ, ü) are transliterated to their ASCII equivalents for maximum compatibility.
          </li>
          <li>
            Stop words (a, the, in, of, etc.) can be removed to create shorter, cleaner URLs that rank better for SEO.
          </li>
          <li>
            Everything runs in your browser — no data is sent over the network.
          </li>
        </ul>
      </div>

      {/* Related tools */}
      <div className="mt-6">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Related tools
        </h2>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Case Converter", href: "/tools/case-converter" },
            { label: "URL Encoder", href: "/tools/url-encoder" },
            { label: "URL Parser", href: "/tools/url-parser" },
            { label: "Meta Tag Generator", href: "/tools/meta-tag-generator" },
          ].map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="rounded-full border border-gray-300 px-3 py-1 text-xs font-medium text-gray-600 hover:border-indigo-400 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-400 dark:hover:border-indigo-500 dark:hover:text-indigo-400 transition-colors"
            >
              {tool.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
