"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";

/**
 * Split input text into an array of lowercase words by detecting:
 * - whitespace, hyphens, underscores, dots, slashes (delimiters)
 * - camelCase boundaries (lowercase→uppercase, e.g. "myVar" → ["my", "var"])
 * - UPPER runs before a lowercase (e.g. "XMLParser" → ["xml", "parser"])
 */
function toWords(input: string): string[] {
  if (!input.trim()) return [];

  // Insert a separator before camelCase boundaries
  const expanded = input
    // lowercase followed by uppercase: myVar → my|Var
    .replace(/([a-z])([A-Z])/g, "$1\0$2")
    // UPPER run followed by Uppercase+lowercase: XMLParser → XML|Parser
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1\0$2");

  return expanded
    .split(/[\s\-_./\\]+|\0/)
    .map((w) => w.toLowerCase())
    .filter(Boolean);
}

function toCamelCase(words: string[]): string {
  if (words.length === 0) return "";
  return words[0] + words.slice(1).map(capitalize).join("");
}

function toPascalCase(words: string[]): string {
  return words.map(capitalize).join("");
}

function toSnakeCase(words: string[]): string {
  return words.join("_");
}

function toConstantCase(words: string[]): string {
  return words.map((w) => w.toUpperCase()).join("_");
}

function toKebabCase(words: string[]): string {
  return words.join("-");
}

function toDotCase(words: string[]): string {
  return words.join(".");
}

function toPathCase(words: string[]): string {
  return words.join("/");
}

function toTitleCase(words: string[]): string {
  return words.map(capitalize).join(" ");
}

function toSentenceCase(words: string[]): string {
  if (words.length === 0) return "";
  return capitalize(words[0]) + " " + words.slice(1).join(" ");
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

interface CaseResult {
  label: string;
  value: string;
}

function getAllCases(input: string): CaseResult[] {
  const words = toWords(input);
  if (words.length === 0) return [];

  return [
    { label: "camelCase", value: toCamelCase(words) },
    { label: "PascalCase", value: toPascalCase(words) },
    { label: "snake_case", value: toSnakeCase(words) },
    { label: "CONSTANT_CASE", value: toConstantCase(words) },
    { label: "kebab-case", value: toKebabCase(words) },
    { label: "dot.case", value: toDotCase(words) },
    { label: "path/case", value: toPathCase(words) },
    { label: "Title Case", value: toTitleCase(words) },
    { label: "Sentence case", value: toSentenceCase(words) },
    { label: "lowercase", value: words.join(" ") },
    { label: "UPPERCASE", value: words.map((w) => w.toUpperCase()).join(" ") },
  ];
}

export default function CaseConverterTool() {
  const [input, setInput] = useState("");
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const { trackFirstInteraction } = useToolAnalytics("case-converter");

  const results = useMemo(() => getAllCases(input), [input]);

  function handleInputChange(value: string) {
    setInput(value);
    trackFirstInteraction();
    setCopiedIdx(null);
  }

  function handleCopy(value: string, idx: number) {
    navigator.clipboard.writeText(value);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  }

  function handleCopyAll() {
    const text = results.map((r) => `${r.label}: ${r.value}`).join("\n");
    navigator.clipboard.writeText(text);
    setCopiedIdx(-1);
    setTimeout(() => setCopiedIdx(null), 1500);
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
        Text Case Converter
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Convert text between camelCase, snake_case, kebab-case, and more.
        Results update as you type.
      </p>

      {/* Input */}
      <div className="mb-6">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
          Input text
        </label>
        <textarea
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="Type or paste text… e.g. myVariableName, my-css-class, MY_CONSTANT"
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 font-mono text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
          rows={3}
          spellCheck={false}
        />
      </div>

      {/* Results */}
      {results.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Conversions
            </h2>
            <button
              onClick={handleCopyAll}
              className="rounded border border-gray-300 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
            >
              {copiedIdx === -1 ? "Copied!" : "Copy All"}
            </button>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {results.map((r, i) => (
              <div
                key={r.label}
                className="flex items-center justify-between px-4 py-3 group"
              >
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                    {r.label}
                  </span>
                  <div className="font-mono text-sm text-gray-900 dark:text-gray-100 break-all mt-0.5">
                    {r.value}
                  </div>
                </div>
                <button
                  onClick={() => handleCopy(r.value, i)}
                  className="ml-3 flex-shrink-0 rounded border border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-500 opacity-0 group-hover:opacity-100 focus:opacity-100 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800 transition-all"
                >
                  {copiedIdx === i ? "Copied!" : "Copy"}
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Info */}
      <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          About Case Conversion
        </h2>
        <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
          <li>
            Automatically detects word boundaries from camelCase, separators
            (hyphens, underscores, dots, slashes), and whitespace.
          </li>
          <li>
            Supports 11 case styles commonly used in programming, CSS, file
            paths, and documentation.
          </li>
          <li>
            Everything runs in your browser — no data is sent over the network.
          </li>
        </ul>
      </div>
    </div>
  );
}
