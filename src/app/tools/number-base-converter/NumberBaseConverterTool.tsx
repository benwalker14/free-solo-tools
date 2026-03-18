"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";

const COMMON_BASES = [
  { label: "Binary", base: 2, prefix: "0b" },
  { label: "Octal", base: 8, prefix: "0o" },
  { label: "Decimal", base: 10, prefix: "" },
  { label: "Hexadecimal", base: 16, prefix: "0x" },
] as const;

const DIGITS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/**
 * Parse an input string to a BigInt value.
 * Supports prefixes: 0b (binary), 0o (octal), 0x (hex).
 * Falls back to the specified source base.
 */
function parseInput(input: string, sourceBase: number): bigint | null {
  const trimmed = input.trim().replace(/_/g, "");
  if (!trimmed) return null;

  try {
    const lower = trimmed.toLowerCase();

    // Auto-detect prefixed values
    if (lower.startsWith("0b")) return BigInt("0b" + lower.slice(2));
    if (lower.startsWith("0o")) return BigInt("0o" + lower.slice(2));
    if (lower.startsWith("0x")) return BigInt("0x" + lower.slice(2));

    // Parse as the selected source base
    if (sourceBase === 10) {
      return BigInt(trimmed);
    }

    // Manual base conversion for non-decimal
    const upper = trimmed.toUpperCase();
    let result = BigInt(0);
    const baseBig = BigInt(sourceBase);
    for (const ch of upper) {
      const val = DIGITS.indexOf(ch);
      if (val < 0 || val >= sourceBase) return null;
      result = result * baseBig + BigInt(val);
    }
    return result;
  } catch {
    return null;
  }
}

/**
 * Convert a BigInt value to a string in the given base.
 */
function toBase(value: bigint, base: number): string {
  if (value === BigInt(0)) return "0";

  const negative = value < BigInt(0);
  let v = negative ? -value : value;
  const baseBig = BigInt(base);
  let result = "";

  while (v > BigInt(0)) {
    const remainder = Number(v % baseBig);
    result = DIGITS[remainder] + result;
    v = v / baseBig;
  }

  return negative ? "-" + result : result;
}

/**
 * Group digits for readability (e.g., 4-digit groups for binary, 3 for decimal).
 */
function groupDigits(str: string, base: number): string {
  const negative = str.startsWith("-");
  const digits = negative ? str.slice(1) : str;

  let groupSize: number;
  if (base === 2) groupSize = 4;
  else if (base === 10) groupSize = 3;
  else if (base === 16) groupSize = 4;
  else if (base === 8) groupSize = 3;
  else groupSize = 4;

  const separator = base === 10 ? "," : " ";

  // Group from right to left
  const parts: string[] = [];
  for (let i = digits.length; i > 0; i -= groupSize) {
    const start = Math.max(0, i - groupSize);
    parts.unshift(digits.slice(start, i));
  }

  return (negative ? "-" : "") + parts.join(separator);
}

interface ConversionResult {
  label: string;
  base: number;
  prefix: string;
  raw: string;
  grouped: string;
}

export default function NumberBaseConverterTool() {
  const [input, setInput] = useState("");
  const [sourceBase, setSourceBase] = useState(10);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const { trackFirstInteraction } = useToolAnalytics("number-base-converter");

  const results = useMemo((): ConversionResult[] => {
    const value = parseInput(input, sourceBase);
    if (value === null) return [];

    return COMMON_BASES.map(({ label, base, prefix }) => {
      const raw = toBase(value, base);
      return {
        label,
        base,
        prefix,
        raw,
        grouped: groupDigits(raw, base),
      };
    });
  }, [input, sourceBase]);

  const bitInfo = useMemo(() => {
    const value = parseInput(input, sourceBase);
    if (value === null) return null;
    const abs = value < BigInt(0) ? -value : value;
    const bits = abs === BigInt(0) ? 1 : abs.toString(2).length;
    return { value, bits };
  }, [input, sourceBase]);

  function handleInputChange(value: string) {
    setInput(value);
    trackFirstInteraction();
    setCopiedIdx(null);
  }

  function handleCopy(text: string, idx: number) {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  }

  function handleCopyAll() {
    const text = results
      .map((r) => `${r.label} (base ${r.base}): ${r.prefix}${r.raw}`)
      .join("\n");
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
        Number Base Converter
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Convert numbers between binary, octal, decimal, and hexadecimal.
        Results update as you type.
      </p>

      {/* Source base selector */}
      <div className="mb-4">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
          Input base
        </label>
        <div className="flex flex-wrap gap-2">
          {COMMON_BASES.map(({ label, base }) => (
            <button
              key={base}
              onClick={() => {
                setSourceBase(base);
                setCopiedIdx(null);
              }}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                sourceBase === base
                  ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:border-indigo-400 dark:bg-indigo-950 dark:text-indigo-300"
                  : "border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:border-gray-500 dark:hover:bg-gray-800"
              }`}
            >
              {label} ({base})
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="mb-6">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
          Enter a number
          <span className="ml-2 text-xs font-normal text-gray-400 dark:text-gray-500">
            Supports 0b, 0o, 0x prefixes for auto-detection
          </span>
        </label>
        <input
          type="text"
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={
            sourceBase === 2
              ? "e.g. 11010110"
              : sourceBase === 8
                ? "e.g. 326"
                : sourceBase === 16
                  ? "e.g. D6"
                  : "e.g. 214"
          }
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 font-mono text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
          spellCheck={false}
          autoComplete="off"
        />
      </div>

      {/* Error state */}
      {input.trim() && results.length === 0 && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
          Invalid number for base {sourceBase}. Check your input and try again.
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Conversions
              </h2>
              {bitInfo && (
                <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                  {bitInfo.bits} bit{bitInfo.bits !== 1 ? "s" : ""}
                </span>
              )}
            </div>
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
                key={r.base}
                className="flex items-center justify-between px-4 py-3 group"
              >
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                    {r.label} (base {r.base})
                  </span>
                  <div className="font-mono text-sm text-gray-900 dark:text-gray-100 break-all mt-0.5">
                    <span className="text-gray-400 dark:text-gray-500">
                      {r.prefix}
                    </span>
                    {r.grouped}
                  </div>
                </div>
                <button
                  onClick={() => handleCopy(r.prefix + r.raw, i)}
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
          About Number Base Conversion
        </h2>
        <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
          <li>
            Supports arbitrarily large numbers using BigInt — no precision loss.
          </li>
          <li>
            Use prefixes for quick input: <code className="rounded bg-gray-200 px-1 dark:bg-gray-800">0b</code> for
            binary, <code className="rounded bg-gray-200 px-1 dark:bg-gray-800">0o</code> for
            octal, <code className="rounded bg-gray-200 px-1 dark:bg-gray-800">0x</code> for hex.
          </li>
          <li>
            Underscores in input are ignored for readability
            (e.g. <code className="rounded bg-gray-200 px-1 dark:bg-gray-800">1_000_000</code>).
          </li>
          <li>
            Everything runs in your browser — no data is sent over the network.
          </li>
        </ul>
      </div>
    </div>
  );
}
