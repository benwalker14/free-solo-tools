"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import RateLimitBanner from "@/components/RateLimitBanner";

type Mode = "csv-to-json" | "json-to-csv";

/**
 * Parse a CSV string into an array of objects.
 * Handles quoted fields (including escaped quotes ""), commas inside quotes,
 * and newlines inside quoted fields.
 */
function parseCsv(
  csv: string,
  delimiter: string,
): { data: Record<string, string>[]; headers: string[] } | { error: string } {
  const lines: string[][] = [];
  let current: string[] = [];
  let field = "";
  let inQuotes = false;
  const chars = csv.trim();

  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];

    if (inQuotes) {
      if (ch === '"') {
        // Escaped quote ("") or end of quoted field
        if (i + 1 < chars.length && chars[i + 1] === '"') {
          field += '"';
          i++; // skip next quote
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === delimiter) {
        current.push(field);
        field = "";
      } else if (ch === "\r") {
        // skip \r, handle \n next
      } else if (ch === "\n") {
        current.push(field);
        field = "";
        if (current.some((f) => f.length > 0) || current.length > 1) {
          lines.push(current);
        }
        current = [];
      } else {
        field += ch;
      }
    }
  }

  // Last field / last line
  current.push(field);
  if (current.some((f) => f.length > 0) || current.length > 1) {
    lines.push(current);
  }

  if (lines.length === 0) {
    return { error: "No data found. Check that your CSV is not empty." };
  }

  const headers = lines[0].map((h) => h.trim());
  if (headers.some((h) => h === "")) {
    return {
      error:
        "Empty header detected. Every column in the first row must have a name.",
    };
  }

  const data: Record<string, string>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const row: Record<string, string> = {};
    for (let j = 0; j < headers.length; j++) {
      row[headers[j]] = lines[i][j] ?? "";
    }
    data.push(row);
  }

  return { data, headers };
}

/**
 * Convert an array of objects to a CSV string.
 */
function jsonToCsv(
  data: Record<string, unknown>[],
  delimiter: string,
): string {
  if (data.length === 0) return "";

  // Collect all unique keys in order
  const headersSet = new Set<string>();
  for (const row of data) {
    for (const key of Object.keys(row)) {
      headersSet.add(key);
    }
  }
  const headers = Array.from(headersSet);

  function escapeField(value: unknown): string {
    const str = value == null ? "" : String(value);
    if (
      str.includes(delimiter) ||
      str.includes('"') ||
      str.includes("\n") ||
      str.includes("\r")
    ) {
      return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
  }

  const headerLine = headers.map(escapeField).join(delimiter);
  const rows = data.map((row) =>
    headers.map((h) => escapeField(row[h])).join(delimiter),
  );

  return [headerLine, ...rows].join("\n");
}

const SAMPLE_CSV = `name,email,age,city
Alice Johnson,alice@example.com,30,New York
Bob Smith,bob@example.com,25,San Francisco
Carol White,carol@example.com,35,Chicago`;

const SAMPLE_JSON = `[
  { "name": "Alice Johnson", "email": "alice@example.com", "age": 30, "city": "New York" },
  { "name": "Bob Smith", "email": "bob@example.com", "age": 25, "city": "San Francisco" },
  { "name": "Carol White", "email": "carol@example.com", "age": 35, "city": "Chicago" }
]`;

export default function CsvJsonTool() {
  const [mode, setMode] = useState<Mode>("csv-to-json");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [delimiter, setDelimiter] = useState(",");
  const [indent, setIndent] = useState(2);
  const [copied, setCopied] = useState(false);
  const [rowCount, setRowCount] = useState<number | null>(null);

  const { trackAction } = useToolAnalytics("csv-json");
  const { remaining, dailyLimit, isLimited, recordUsage } =
    useRateLimit("csv-json");

  const handleConvert = useCallback(() => {
    setError("");
    setOutput("");
    setRowCount(null);
    setCopied(false);

    if (!input.trim()) {
      setError("Please enter some data to convert.");
      return;
    }

    if (isLimited) return;
    recordUsage();
    trackAction(mode);

    if (mode === "csv-to-json") {
      const result = parseCsv(input, delimiter);
      if ("error" in result) {
        setError(result.error);
        return;
      }
      setOutput(JSON.stringify(result.data, null, indent));
      setRowCount(result.data.length);
    } else {
      try {
        const parsed = JSON.parse(input);
        if (!Array.isArray(parsed)) {
          setError(
            "JSON must be an array of objects. e.g. [{ \"key\": \"value\" }, ...]",
          );
          return;
        }
        if (parsed.length === 0) {
          setError("JSON array is empty. Nothing to convert.");
          return;
        }
        if (
          typeof parsed[0] !== "object" ||
          parsed[0] === null ||
          Array.isArray(parsed[0])
        ) {
          setError(
            "Each item in the array must be a flat object with key-value pairs.",
          );
          return;
        }
        const csv = jsonToCsv(parsed as Record<string, unknown>[], delimiter);
        setOutput(csv);
        setRowCount(parsed.length);
      } catch {
        setError("Invalid JSON. Check your syntax and try again.");
      }
    }
  }, [input, mode, delimiter, indent, isLimited, recordUsage, trackAction]);

  useKeyboardShortcut("Enter", handleConvert);

  function handleCopy() {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function handleLoadSample() {
    setInput(mode === "csv-to-json" ? SAMPLE_CSV : SAMPLE_JSON);
    setOutput("");
    setError("");
    setRowCount(null);
  }

  function handleSwapMode() {
    const newMode: Mode =
      mode === "csv-to-json" ? "json-to-csv" : "csv-to-json";
    setMode(newMode);
    // If there's output, use it as the new input
    if (output) {
      setInput(output);
      setOutput("");
    }
    setError("");
    setRowCount(null);
    setCopied(false);
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
        CSV ↔ JSON Converter
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Convert between CSV and JSON formats. Handles quoted fields, custom
        delimiters, and nested commas.
      </p>

      <RateLimitBanner remaining={remaining} dailyLimit={dailyLimit} isLimited={isLimited} />

      {/* Mode toggle */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
          <button
            onClick={() => handleSwapMode()}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              mode === "csv-to-json"
                ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
            }`}
            disabled={mode === "csv-to-json"}
          >
            CSV → JSON
          </button>
          <button
            onClick={() => handleSwapMode()}
            className={`px-4 py-2 text-sm font-medium transition-colors border-l border-gray-300 dark:border-gray-600 ${
              mode === "json-to-csv"
                ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
            }`}
            disabled={mode === "json-to-csv"}
          >
            JSON → CSV
          </button>
        </div>

        {/* Delimiter select */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 dark:text-gray-400">
            Delimiter:
          </label>
          <select
            value={delimiter}
            onChange={(e) => setDelimiter(e.target.value)}
            className="rounded border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300"
          >
            <option value=",">Comma (,)</option>
            <option value="&#9;">Tab (⇥)</option>
            <option value=";">Semicolon (;)</option>
            <option value="|">Pipe (|)</option>
          </select>
        </div>

        {/* Indent (only for CSV→JSON) */}
        {mode === "csv-to-json" && (
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">
              Indent:
            </label>
            <select
              value={indent}
              onChange={(e) => setIndent(Number(e.target.value))}
              className="rounded border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300"
            >
              <option value={2}>2 spaces</option>
              <option value={4}>4 spaces</option>
              <option value={0}>Minified</option>
            </select>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {mode === "csv-to-json" ? "CSV Input" : "JSON Input"}
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
            mode === "csv-to-json"
              ? "Paste your CSV data here...\nname,email,age\nAlice,alice@example.com,30"
              : 'Paste your JSON array here...\n[{ "name": "Alice", "email": "alice@example.com" }]'
          }
          rows={10}
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
            <div className="flex items-center gap-3">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {mode === "csv-to-json" ? "JSON Output" : "CSV Output"}
              </label>
              {rowCount !== null && (
                <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                  {rowCount} row{rowCount !== 1 ? "s" : ""}
                </span>
              )}
            </div>
            <button
              onClick={handleCopy}
              className="rounded border border-gray-300 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <pre className="max-h-96 overflow-auto rounded-lg border border-gray-200 bg-white p-4 font-mono text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100">
            {output}
          </pre>
        </div>
      )}

      {/* Info */}
      <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          About CSV ↔ JSON Conversion
        </h2>
        <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
          <li>
            Handles quoted fields with commas, newlines, and escaped quotes
            (<code className="rounded bg-gray-200 px-1 dark:bg-gray-800">
              &quot;&quot;
            </code>
            ).
          </li>
          <li>
            Supports custom delimiters: comma, tab, semicolon, and pipe.
          </li>
          <li>
            CSV → JSON uses the first row as object keys (headers).
          </li>
          <li>
            JSON → CSV flattens objects into columns — nested objects are
            stringified.
          </li>
          <li>
            Everything runs in your browser — no data is sent over the network.
          </li>
        </ul>
      </div>
    </div>
  );
}
