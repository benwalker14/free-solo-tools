"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import RateLimitBanner from "@/components/RateLimitBanner";

type Alignment = "left" | "center" | "right" | "none";

interface TableState {
  headers: string[];
  alignments: Alignment[];
  rows: string[][];
}

function createEmptyTable(cols: number, rows: number): TableState {
  return {
    headers: Array.from({ length: cols }, (_, i) => `Header ${i + 1}`),
    alignments: Array.from({ length: cols }, () => "none" as Alignment),
    rows: Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => ""),
    ),
  };
}

function generateMarkdown(table: TableState): string {
  const { headers, alignments, rows } = table;
  const cols = headers.length;

  // Calculate column widths (minimum 3 for separator dashes)
  const widths = Array.from({ length: cols }, (_, c) => {
    let max = headers[c].length;
    for (const row of rows) {
      if (row[c] && row[c].length > max) max = row[c].length;
    }
    return Math.max(max, 3);
  });

  // Pad cell content
  const pad = (text: string, width: number, align: Alignment) => {
    const t = text || "";
    if (t.length >= width) return t;
    const diff = width - t.length;
    if (align === "center") {
      const left = Math.floor(diff / 2);
      return " ".repeat(left) + t + " ".repeat(diff - left);
    }
    if (align === "right") {
      return " ".repeat(diff) + t;
    }
    return t + " ".repeat(diff);
  };

  // Header row
  const headerLine =
    "| " +
    headers.map((h, i) => pad(h, widths[i], alignments[i])).join(" | ") +
    " |";

  // Separator row
  const separatorLine =
    "| " +
    alignments
      .map((a, i) => {
        const w = widths[i];
        if (a === "center") return ":" + "-".repeat(w - 2) + ":";
        if (a === "right") return "-".repeat(w - 1) + ":";
        if (a === "left") return ":" + "-".repeat(w - 1);
        return "-".repeat(w);
      })
      .join(" | ") +
    " |";

  // Data rows
  const dataLines = rows.map(
    (row) =>
      "| " +
      row
        .map((cell, i) => pad(cell || "", widths[i], alignments[i]))
        .join(" | ") +
      " |",
  );

  return [headerLine, separatorLine, ...dataLines].join("\n");
}

function parseCSV(csv: string): TableState | null {
  const lines = csv
    .trim()
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
  if (lines.length === 0) return null;

  const parseLine = (line: string): string[] => {
    const result: string[] = [];
    let field = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (inQuotes) {
        if (ch === '"') {
          if (i + 1 < line.length && line[i + 1] === '"') {
            field += '"';
            i++;
          } else {
            inQuotes = false;
          }
        } else {
          field += ch;
        }
      } else if (ch === '"') {
        inQuotes = true;
      } else if (ch === "," || ch === "\t") {
        result.push(field.trim());
        field = "";
      } else {
        field += ch;
      }
    }
    result.push(field.trim());
    return result;
  };

  const headers = parseLine(lines[0]);
  const cols = headers.length;
  const rows = lines.slice(1).map((line) => {
    const parsed = parseLine(line);
    // Normalize row length
    while (parsed.length < cols) parsed.push("");
    return parsed.slice(0, cols);
  });

  return {
    headers,
    alignments: Array.from({ length: cols }, () => "none" as Alignment),
    rows: rows.length > 0 ? rows : [Array.from({ length: cols }, () => "")],
  };
}

const PRESETS: { name: string; table: TableState }[] = [
  {
    name: "Comparison",
    table: {
      headers: ["Feature", "Free", "Pro"],
      alignments: ["left", "center", "center"],
      rows: [
        ["Storage", "5 GB", "100 GB"],
        ["API Calls", "1,000/mo", "Unlimited"],
        ["Support", "Community", "Priority"],
      ],
    },
  },
  {
    name: "API Reference",
    table: {
      headers: ["Method", "Endpoint", "Description"],
      alignments: ["left", "left", "left"],
      rows: [
        ["GET", "/api/users", "List all users"],
        ["POST", "/api/users", "Create a new user"],
        ["DELETE", "/api/users/:id", "Delete a user"],
      ],
    },
  },
  {
    name: "Changelog",
    table: {
      headers: ["Version", "Date", "Changes"],
      alignments: ["left", "left", "left"],
      rows: [
        ["2.0.0", "2026-03-15", "Major redesign"],
        ["1.1.0", "2026-02-01", "Added dark mode"],
        ["1.0.0", "2026-01-01", "Initial release"],
      ],
    },
  },
  {
    name: "Schedule",
    table: {
      headers: ["Time", "Monday", "Tuesday", "Wednesday"],
      alignments: ["right", "center", "center", "center"],
      rows: [
        ["9:00", "Standup", "Standup", "Standup"],
        ["10:00", "Dev", "Review", "Dev"],
        ["14:00", "Planning", "Dev", "Demo"],
      ],
    },
  },
];

export default function MarkdownTableTool() {
  const [table, setTable] = useState<TableState>(createEmptyTable(3, 3));
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [csvInput, setCsvInput] = useState("");
  const [showImport, setShowImport] = useState(false);
  const [showReference, setShowReference] = useState(false);
  const [importError, setImportError] = useState("");
  const outputRef = useRef<HTMLTextAreaElement>(null);

  const { trackAction } = useToolAnalytics("markdown-table");
  const { isLimited, remaining, dailyLimit, recordUsage } = useRateLimit("markdown-table");

  const generate = useCallback(() => {
    if (isLimited) return;
    recordUsage();
    trackAction("generate");
    const md = generateMarkdown(table);
    setOutput(md);
  }, [table, isLimited, recordUsage, trackAction]);

  useKeyboardShortcut("Enter", generate);

  // Auto-generate on any table change
  const updateAndGenerate = useCallback(
    (newTable: TableState) => {
      setTable(newTable);
      // Generate immediately with new table
      if (!isLimited) {
        const md = generateMarkdown(newTable);
        setOutput(md);
      }
    },
    [isLimited],
  );

  const updateHeader = (col: number, value: string) => {
    const next = { ...table, headers: [...table.headers] };
    next.headers[col] = value;
    updateAndGenerate(next);
  };

  const updateCell = (row: number, col: number, value: string) => {
    const next = { ...table, rows: table.rows.map((r) => [...r]) };
    next.rows[row][col] = value;
    updateAndGenerate(next);
  };

  const updateAlignment = (col: number, align: Alignment) => {
    const next = { ...table, alignments: [...table.alignments] };
    next.alignments[col] = align;
    updateAndGenerate(next);
  };

  const addColumn = () => {
    const cols = table.headers.length;
    if (cols >= 10) return;
    const next: TableState = {
      headers: [...table.headers, `Header ${cols + 1}`],
      alignments: [...table.alignments, "none"],
      rows: table.rows.map((r) => [...r, ""]),
    };
    updateAndGenerate(next);
  };

  const removeColumn = (col: number) => {
    if (table.headers.length <= 1) return;
    const next: TableState = {
      headers: table.headers.filter((_, i) => i !== col),
      alignments: table.alignments.filter((_, i) => i !== col),
      rows: table.rows.map((r) => r.filter((_, i) => i !== col)),
    };
    updateAndGenerate(next);
  };

  const addRow = () => {
    if (table.rows.length >= 50) return;
    const next: TableState = {
      ...table,
      rows: [
        ...table.rows,
        Array.from({ length: table.headers.length }, () => ""),
      ],
    };
    updateAndGenerate(next);
  };

  const removeRow = (row: number) => {
    if (table.rows.length <= 1) return;
    const next: TableState = {
      ...table,
      rows: table.rows.filter((_, i) => i !== row),
    };
    updateAndGenerate(next);
  };

  const copyToClipboard = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const importCSV = () => {
    setImportError("");
    const parsed = parseCSV(csvInput);
    if (!parsed) {
      setImportError("Could not parse CSV. Check your input.");
      return;
    }
    if (parsed.headers.length > 10) {
      setImportError("Maximum 10 columns supported.");
      return;
    }
    recordUsage();
    trackAction("import-csv");
    updateAndGenerate(parsed);
    setShowImport(false);
    setCsvInput("");
  };

  const applyPreset = (preset: TableState) => {
    recordUsage();
    trackAction("apply-preset");
    updateAndGenerate(preset);
  };

  const clearTable = () => {
    updateAndGenerate(createEmptyTable(3, 3));
  };

  const alignIcon = (align: Alignment) => {
    switch (align) {
      case "left":
        return "←";
      case "center":
        return "↔";
      case "right":
        return "→";
      default:
        return "—";
    }
  };

  const nextAlignment = (current: Alignment): Alignment => {
    const order: Alignment[] = ["none", "left", "center", "right"];
    const idx = order.indexOf(current);
    return order[(idx + 1) % order.length];
  };

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {/* Navigation */}
        <div className="mb-6 flex items-center gap-3 text-sm text-gray-400">
          <Link href="/" className="hover:text-gray-200">
            Home
          </Link>
          <span>/</span>
          <span className="text-gray-200">Markdown Table Generator</span>
        </div>

        {/* Title */}
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-lg text-blue-400">
              TBL
            </div>
            <h1 className="text-2xl font-bold sm:text-3xl">
              Markdown Table Generator
            </h1>
          </div>
          <p className="text-gray-400">
            Build Markdown tables visually. Edit cells, set column alignment,
            import CSV, or start from a preset. Copy the generated Markdown to
            your clipboard.
          </p>
        </div>

        <RateLimitBanner isLimited={isLimited} remaining={remaining} dailyLimit={dailyLimit} />

        {/* Presets */}
        <div className="mb-6">
          <h3 className="mb-2 text-sm font-medium text-gray-400">Presets</h3>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.name}
                onClick={() => applyPreset(p.table)}
                className="rounded-md border border-gray-700 bg-gray-800 px-3 py-1.5 text-sm hover:border-blue-500 hover:bg-gray-750 transition-colors"
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <button
            onClick={addColumn}
            disabled={table.headers.length >= 10}
            className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            + Column
          </button>
          <button
            onClick={addRow}
            disabled={table.rows.length >= 50}
            className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            + Row
          </button>
          <button
            onClick={() => setShowImport(!showImport)}
            className="rounded-md border border-gray-700 bg-gray-800 px-3 py-1.5 text-sm hover:border-blue-500 transition-colors"
          >
            Import CSV
          </button>
          <button
            onClick={clearTable}
            className="rounded-md border border-gray-700 bg-gray-800 px-3 py-1.5 text-sm text-red-400 hover:border-red-500 transition-colors"
          >
            Clear
          </button>
          <span className="ml-auto text-xs text-gray-500">
            {table.headers.length} cols &times; {table.rows.length} rows
          </span>
        </div>

        {/* CSV Import */}
        {showImport && (
          <div className="mb-4 rounded-lg border border-gray-700 bg-gray-900 p-4">
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Paste CSV or tab-separated data (first row = headers)
            </label>
            <textarea
              value={csvInput}
              onChange={(e) => setCsvInput(e.target.value)}
              rows={5}
              className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm font-mono text-gray-200 placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              placeholder={"Name, Age, City\nAlice, 30, Portland\nBob, 25, Austin"}
            />
            {importError && (
              <p className="mt-1 text-sm text-red-400">{importError}</p>
            )}
            <div className="mt-2 flex gap-2">
              <button
                onClick={importCSV}
                className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium hover:bg-blue-500 transition-colors"
              >
                Import
              </button>
              <button
                onClick={() => {
                  setShowImport(false);
                  setCsvInput("");
                  setImportError("");
                }}
                className="rounded-md border border-gray-700 bg-gray-800 px-3 py-1.5 text-sm hover:border-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Table Editor */}
        <div className="mb-6 overflow-x-auto rounded-lg border border-gray-700 bg-gray-900">
          <table className="w-full border-collapse text-sm">
            {/* Alignment controls row */}
            <thead>
              <tr className="border-b border-gray-700 bg-gray-800/50">
                <th className="w-10 p-1" />
                {table.headers.map((_, c) => (
                  <th key={c} className="p-1">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() =>
                          updateAlignment(c, nextAlignment(table.alignments[c]))
                        }
                        className="rounded px-2 py-0.5 text-xs text-gray-400 hover:bg-gray-700 hover:text-gray-200 transition-colors"
                        title={`Alignment: ${table.alignments[c]} (click to cycle)`}
                      >
                        {alignIcon(table.alignments[c])}{" "}
                        {table.alignments[c] === "none"
                          ? "default"
                          : table.alignments[c]}
                      </button>
                      {table.headers.length > 1 && (
                        <button
                          onClick={() => removeColumn(c)}
                          className="rounded px-1 text-xs text-gray-500 hover:bg-red-900/30 hover:text-red-400 transition-colors"
                          title="Remove column"
                        >
                          &times;
                        </button>
                      )}
                    </div>
                  </th>
                ))}
              </tr>

              {/* Header cells */}
              <tr className="border-b border-gray-600 bg-gray-800">
                <td className="w-10 p-1 text-center text-xs text-gray-500">
                  H
                </td>
                {table.headers.map((h, c) => (
                  <td key={c} className="p-1">
                    <input
                      type="text"
                      value={h}
                      onChange={(e) => updateHeader(c, e.target.value)}
                      className="w-full rounded border border-gray-600 bg-gray-700 px-2 py-1.5 text-sm font-semibold text-gray-100 placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      placeholder={`Header ${c + 1}`}
                    />
                  </td>
                ))}
              </tr>
            </thead>

            {/* Data rows */}
            <tbody>
              {table.rows.map((row, r) => (
                <tr
                  key={r}
                  className="border-b border-gray-800 hover:bg-gray-800/30"
                >
                  <td className="w-10 p-1 text-center">
                    {table.rows.length > 1 ? (
                      <button
                        onClick={() => removeRow(r)}
                        className="rounded px-1 text-xs text-gray-500 hover:bg-red-900/30 hover:text-red-400 transition-colors"
                        title="Remove row"
                      >
                        &times;
                      </button>
                    ) : (
                      <span className="text-xs text-gray-600">
                        {r + 1}
                      </span>
                    )}
                  </td>
                  {row.map((cell, c) => (
                    <td key={c} className="p-1">
                      <input
                        type="text"
                        value={cell}
                        onChange={(e) => updateCell(r, c, e.target.value)}
                        className="w-full rounded border border-gray-700 bg-gray-800 px-2 py-1.5 text-sm text-gray-200 placeholder:text-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        placeholder={`Row ${r + 1}`}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Generate Button */}
        <button
          onClick={generate}
          disabled={isLimited}
          className="mb-6 w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors sm:w-auto sm:px-8"
        >
          Generate Markdown (Ctrl+Enter)
        </button>

        {/* Output */}
        {output && (
          <div className="mb-8">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-300">
                Generated Markdown
              </h3>
              <button
                onClick={copyToClipboard}
                className="rounded-md border border-gray-700 bg-gray-800 px-3 py-1 text-xs hover:border-blue-500 transition-colors"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <textarea
              ref={outputRef}
              readOnly
              value={output}
              rows={Math.min(output.split("\n").length + 1, 20)}
              className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 font-mono text-sm text-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        )}

        {/* Preview */}
        {output && (
          <div className="mb-8">
            <h3 className="mb-2 text-sm font-medium text-gray-300">Preview</h3>
            <div className="overflow-x-auto rounded-lg border border-gray-700 bg-gray-900 p-4">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-gray-600">
                    {table.headers.map((h, i) => (
                      <th
                        key={i}
                        className="px-3 py-2 font-semibold text-gray-200"
                        style={{
                          textAlign:
                            table.alignments[i] === "none"
                              ? "left"
                              : table.alignments[i],
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {table.rows.map((row, r) => (
                    <tr
                      key={r}
                      className="border-b border-gray-800 last:border-0"
                    >
                      {row.map((cell, c) => (
                        <td
                          key={c}
                          className="px-3 py-2 text-gray-300"
                          style={{
                            textAlign:
                              table.alignments[c] === "none"
                                ? "left"
                                : table.alignments[c],
                          }}
                        >
                          {cell || "\u00A0"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Quick Reference */}
        <div className="rounded-lg border border-gray-700 bg-gray-900">
          <button
            onClick={() => setShowReference(!showReference)}
            className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-gray-300 hover:bg-gray-800/50 transition-colors"
          >
            <span>Quick Reference: Markdown Table Syntax</span>
            <span className="text-gray-500">
              {showReference ? "−" : "+"}
            </span>
          </button>
          {showReference && (
            <div className="border-t border-gray-700 px-4 py-3 text-sm text-gray-400 space-y-3">
              <div>
                <h4 className="font-medium text-gray-300 mb-1">
                  Basic Syntax
                </h4>
                <pre className="rounded bg-gray-800 p-3 text-xs overflow-x-auto">
{`| Header 1 | Header 2 | Header 3 |
| -------- | -------- | -------- |
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |`}
                </pre>
              </div>
              <div>
                <h4 className="font-medium text-gray-300 mb-1">
                  Column Alignment
                </h4>
                <pre className="rounded bg-gray-800 p-3 text-xs overflow-x-auto">
{`| Left     | Center   | Right    |
| :------- | :------: | -------: |
| aligned  | aligned  | aligned  |`}
                </pre>
                <ul className="mt-1 list-disc pl-5 text-xs space-y-0.5">
                  <li>
                    <code className="text-blue-400">:---</code> = left-aligned
                  </li>
                  <li>
                    <code className="text-blue-400">:---:</code> = centered
                  </li>
                  <li>
                    <code className="text-blue-400">---:</code> = right-aligned
                  </li>
                  <li>
                    <code className="text-blue-400">---</code> = default
                    (usually left)
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-300 mb-1">Tips</h4>
                <ul className="list-disc pl-5 text-xs space-y-0.5">
                  <li>
                    The header row and separator row are required — data rows
                    are optional.
                  </li>
                  <li>
                    Pipes at the start and end of each row are optional in most
                    parsers but recommended.
                  </li>
                  <li>
                    Columns don&apos;t need to be aligned in the source — the
                    padding is cosmetic.
                  </li>
                  <li>
                    You can use inline Markdown (bold, italic, code, links)
                    inside cells.
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
