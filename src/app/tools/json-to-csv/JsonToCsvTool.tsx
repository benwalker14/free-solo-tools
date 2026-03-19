"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import RateLimitBanner from "@/components/RateLimitBanner";

/**
 * Flatten a nested object into dot-notation keys.
 * e.g. { a: { b: 1 } } → { "a.b": 1 }
 */
function flattenObject(
  obj: Record<string, unknown>,
  prefix = "",
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (
      value !== null &&
      typeof value === "object" &&
      !Array.isArray(value)
    ) {
      Object.assign(
        result,
        flattenObject(value as Record<string, unknown>, fullKey),
      );
    } else if (Array.isArray(value)) {
      // Arrays become JSON strings in CSV
      result[fullKey] = JSON.stringify(value);
    } else {
      result[fullKey] = value;
    }
  }

  return result;
}

function escapeField(value: unknown, delimiter: string): string {
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

function convertJsonToCsv(
  data: Record<string, unknown>[],
  delimiter: string,
  selectedColumns: string[] | null,
  flatten: boolean,
): { csv: string; headers: string[]; rowCount: number } {
  const processed = flatten ? data.map((row) => flattenObject(row)) : data;

  // Collect all unique keys preserving insertion order
  const headersSet = new Set<string>();
  for (const row of processed) {
    for (const key of Object.keys(row)) {
      headersSet.add(key);
    }
  }
  const allHeaders = Array.from(headersSet);
  const headers = selectedColumns
    ? selectedColumns.filter((c) => allHeaders.includes(c))
    : allHeaders;

  const headerLine = headers.map((h) => escapeField(h, delimiter)).join(delimiter);
  const rows = processed.map((row) =>
    headers.map((h) => escapeField(row[h], delimiter)).join(delimiter),
  );

  return {
    csv: [headerLine, ...rows].join("\n"),
    headers: allHeaders,
    rowCount: processed.length,
  };
}

const SAMPLE_FLAT = `[
  { "name": "Alice Johnson", "email": "alice@example.com", "age": 30, "city": "New York" },
  { "name": "Bob Smith", "email": "bob@example.com", "age": 25, "city": "San Francisco" },
  { "name": "Carol White", "email": "carol@example.com", "age": 35, "city": "Chicago" }
]`;

const SAMPLE_NESTED = `[
  {
    "name": "Alice Johnson",
    "contact": { "email": "alice@example.com", "phone": "555-0101" },
    "address": { "city": "New York", "state": "NY", "zip": "10001" }
  },
  {
    "name": "Bob Smith",
    "contact": { "email": "bob@example.com", "phone": "555-0202" },
    "address": { "city": "San Francisco", "state": "CA", "zip": "94102" }
  }
]`;

export default function JsonToCsvTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [delimiter, setDelimiter] = useState(",");
  const [flatten, setFlatten] = useState(true);
  const [copied, setCopied] = useState(false);
  const [rowCount, setRowCount] = useState<number | null>(null);
  const [allColumns, setAllColumns] = useState<string[]>([]);
  const [excludedColumns, setExcludedColumns] = useState<Set<string>>(
    new Set(),
  );

  const { trackAction } = useToolAnalytics("json-to-csv");
  const { remaining, dailyLimit, isLimited, recordUsage } =
    useRateLimit("json-to-csv");

  const selectedColumns = useMemo(() => {
    if (excludedColumns.size === 0) return null;
    return allColumns.filter((c) => !excludedColumns.has(c));
  }, [allColumns, excludedColumns]);

  const handleConvert = useCallback(() => {
    setError("");
    setOutput("");
    setRowCount(null);
    setCopied(false);

    if (!input.trim()) {
      setError("Please paste your JSON data to convert.");
      return;
    }

    if (isLimited) return;
    recordUsage();
    trackAction("json-to-csv");

    try {
      const parsed = JSON.parse(input);

      if (!Array.isArray(parsed)) {
        setError(
          'JSON must be an array of objects. e.g. [{ "key": "value" }, ...]',
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
          "Each item in the array must be an object with key-value pairs.",
        );
        return;
      }

      const result = convertJsonToCsv(
        parsed as Record<string, unknown>[],
        delimiter,
        selectedColumns,
        flatten,
      );
      setOutput(result.csv);
      setRowCount(result.rowCount);
      setAllColumns(result.headers);
    } catch {
      setError("Invalid JSON. Check your syntax and try again.");
    }
  }, [input, delimiter, selectedColumns, flatten, isLimited, recordUsage, trackAction]);

  useKeyboardShortcut("Enter", handleConvert);

  function handleCopy() {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function handleDownload() {
    const blob = new Blob([output], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  function toggleColumn(col: string) {
    setExcludedColumns((prev) => {
      const next = new Set(prev);
      if (next.has(col)) {
        next.delete(col);
      } else {
        next.add(col);
      }
      return next;
    });
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
        JSON to CSV Converter
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Convert JSON arrays to CSV format. Automatically flattens nested objects
        with dot notation, lets you select columns, and download as a .csv file.
      </p>

      <RateLimitBanner
        remaining={remaining}
        dailyLimit={dailyLimit}
        isLimited={isLimited}
      />

      {/* Options */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
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

        <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
          <input
            type="checkbox"
            checked={flatten}
            onChange={(e) => setFlatten(e.target.checked)}
            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-900"
          />
          Flatten nested objects
        </label>
      </div>

      {/* Input */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            JSON Input
          </label>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setInput(SAMPLE_FLAT);
                setOutput("");
                setError("");
                setRowCount(null);
                setAllColumns([]);
                setExcludedColumns(new Set());
              }}
              className="text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              Flat sample
            </button>
            <button
              onClick={() => {
                setInput(SAMPLE_NESTED);
                setOutput("");
                setError("");
                setRowCount(null);
                setAllColumns([]);
                setExcludedColumns(new Set());
              }}
              className="text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              Nested sample
            </button>
          </div>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={'Paste your JSON array here...\n[{ "name": "Alice", "email": "alice@example.com", "age": 30 }]'}
          rows={12}
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
        Convert to CSV{" "}
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

      {/* Column selector (shown after first conversion) */}
      {allColumns.length > 0 && (
        <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Columns ({allColumns.length - excludedColumns.size} of{" "}
              {allColumns.length} selected)
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => setExcludedColumns(new Set())}
                className="text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                Select all
              </button>
              <button
                onClick={() => setExcludedColumns(new Set(allColumns))}
                className="text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                Deselect all
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {allColumns.map((col) => (
              <button
                key={col}
                onClick={() => toggleColumn(col)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  excludedColumns.has(col)
                    ? "bg-gray-200 text-gray-400 dark:bg-gray-800 dark:text-gray-600"
                    : "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                }`}
              >
                {col}
              </button>
            ))}
          </div>
          {excludedColumns.size > 0 && (
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
              Click &quot;Convert to CSV&quot; again to apply column changes.
            </p>
          )}
        </div>
      )}

      {/* Output */}
      {output && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                CSV Output
              </label>
              {rowCount !== null && (
                <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                  {rowCount} row{rowCount !== 1 ? "s" : ""}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleDownload}
                className="rounded border border-gray-300 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
              >
                Download .csv
              </button>
              <button
                onClick={handleCopy}
                className="rounded border border-gray-300 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
          <pre className="max-h-96 overflow-auto rounded-lg border border-gray-200 bg-white p-4 font-mono text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100">
            {output}
          </pre>
        </div>
      )}

      {/* Info */}
      <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          About JSON to CSV Conversion
        </h2>
        <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
          <li>
            Nested objects are flattened using dot notation (e.g.{" "}
            <code className="rounded bg-gray-200 px-1 dark:bg-gray-800">
              address.city
            </code>
            ).
          </li>
          <li>
            Arrays within objects are serialized as JSON strings in the CSV
            output.
          </li>
          <li>
            Select or deselect columns after converting to customize your
            output.
          </li>
          <li>
            Supports comma, tab, semicolon, and pipe delimiters.
          </li>
          <li>
            Download the result as a .csv file ready for Excel, Google Sheets,
            or any spreadsheet app.
          </li>
          <li>
            Everything runs in your browser — no data is sent over the network.
          </li>
        </ul>
      </div>
    </div>
  );
}
