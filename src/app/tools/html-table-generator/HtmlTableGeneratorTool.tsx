"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import RateLimitBanner from "@/components/RateLimitBanner";

interface TableState {
  headers: string[];
  rows: string[][];
  hasHeader: boolean;
}

type OutputFormat = "plain" | "inline-css" | "tailwind";
type TableStyle = "minimal" | "bordered" | "striped" | "modern";

function createEmptyTable(cols: number, rowCount: number): TableState {
  return {
    headers: Array.from({ length: cols }, (_, i) => `Header ${i + 1}`),
    rows: Array.from({ length: rowCount }, () =>
      Array.from({ length: cols }, () => ""),
    ),
    hasHeader: true,
  };
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function generateHtml(
  table: TableState,
  format: OutputFormat,
  style: TableStyle,
  caption: string,
): string {
  const indent = "  ";
  const lines: string[] = [];

  // Table open tag
  if (format === "plain") {
    lines.push("<table>");
  } else if (format === "inline-css") {
    const tableStyles: Record<TableStyle, string> = {
      minimal:
        "border-collapse: collapse; width: 100%; font-family: sans-serif;",
      bordered:
        "border-collapse: collapse; width: 100%; font-family: sans-serif; border: 2px solid #333;",
      striped:
        "border-collapse: collapse; width: 100%; font-family: sans-serif;",
      modern:
        "border-collapse: collapse; width: 100%; font-family: system-ui, sans-serif; border-radius: 8px; overflow: hidden;",
    };
    lines.push(`<table style="${tableStyles[style]}">`);
  } else {
    const tableClasses: Record<TableStyle, string> = {
      minimal: "w-full border-collapse font-sans",
      bordered: "w-full border-collapse font-sans border-2 border-gray-800",
      striped: "w-full border-collapse font-sans",
      modern:
        "w-full border-collapse font-sans rounded-lg overflow-hidden shadow",
    };
    lines.push(`<table class="${tableClasses[style]}">`);
  }

  // Caption
  if (caption.trim()) {
    if (format === "inline-css") {
      lines.push(
        `${indent}<caption style="caption-side: top; padding: 8px; font-weight: bold; text-align: left;">${escapeHtml(caption)}</caption>`,
      );
    } else if (format === "tailwind") {
      lines.push(
        `${indent}<caption class="caption-top p-2 font-bold text-left">${escapeHtml(caption)}</caption>`,
      );
    } else {
      lines.push(`${indent}<caption>${escapeHtml(caption)}</caption>`);
    }
  }

  // Header
  if (table.hasHeader) {
    lines.push(`${indent}<thead>`);
    lines.push(`${indent}${indent}<tr>`);
    for (const h of table.headers) {
      const cell = escapeHtml(h || "");
      if (format === "plain") {
        lines.push(`${indent}${indent}${indent}<th>${cell}</th>`);
      } else if (format === "inline-css") {
        const thStyles: Record<TableStyle, string> = {
          minimal:
            "padding: 10px 12px; text-align: left; border-bottom: 2px solid #ddd; font-weight: 600;",
          bordered:
            "padding: 10px 12px; text-align: left; border: 1px solid #333; font-weight: 600; background: #f5f5f5;",
          striped:
            "padding: 10px 12px; text-align: left; border-bottom: 2px solid #ddd; font-weight: 600; background: #f0f0f0;",
          modern:
            "padding: 12px 16px; text-align: left; font-weight: 600; background: #1f2937; color: #fff;",
        };
        lines.push(
          `${indent}${indent}${indent}<th style="${thStyles[style]}">${cell}</th>`,
        );
      } else {
        const thClasses: Record<TableStyle, string> = {
          minimal:
            "px-3 py-2.5 text-left border-b-2 border-gray-300 font-semibold",
          bordered:
            "px-3 py-2.5 text-left border border-gray-800 font-semibold bg-gray-100",
          striped:
            "px-3 py-2.5 text-left border-b-2 border-gray-300 font-semibold bg-gray-100",
          modern:
            "px-4 py-3 text-left font-semibold bg-gray-800 text-white",
        };
        lines.push(
          `${indent}${indent}${indent}<th class="${thClasses[style]}">${cell}</th>`,
        );
      }
    }
    lines.push(`${indent}${indent}</tr>`);
    lines.push(`${indent}</thead>`);
  }

  // Body
  lines.push(`${indent}<tbody>`);
  table.rows.forEach((row, r) => {
    if (format === "plain") {
      lines.push(`${indent}${indent}<tr>`);
    } else if (format === "inline-css") {
      const isEven = r % 2 === 0;
      let trStyle = "";
      if (style === "striped" && !isEven) {
        trStyle = ' style="background: #f9f9f9;"';
      } else if (style === "modern" && !isEven) {
        trStyle = ' style="background: #f3f4f6;"';
      }
      lines.push(`${indent}${indent}<tr${trStyle}>`);
    } else {
      const isEven = r % 2 === 0;
      let trClass = "";
      if (style === "striped" && !isEven) {
        trClass = ' class="bg-gray-50"';
      } else if (style === "modern" && !isEven) {
        trClass = ' class="bg-gray-50"';
      }
      lines.push(`${indent}${indent}<tr${trClass}>`);
    }

    for (const cell of row) {
      const val = escapeHtml(cell || "");
      if (format === "plain") {
        lines.push(`${indent}${indent}${indent}<td>${val}</td>`);
      } else if (format === "inline-css") {
        const tdStyles: Record<TableStyle, string> = {
          minimal: "padding: 8px 12px; border-bottom: 1px solid #eee;",
          bordered: "padding: 8px 12px; border: 1px solid #333;",
          striped: "padding: 8px 12px; border-bottom: 1px solid #eee;",
          modern: "padding: 10px 16px; border-bottom: 1px solid #e5e7eb;",
        };
        lines.push(
          `${indent}${indent}${indent}<td style="${tdStyles[style]}">${val}</td>`,
        );
      } else {
        const tdClasses: Record<TableStyle, string> = {
          minimal: "px-3 py-2 border-b border-gray-200",
          bordered: "px-3 py-2 border border-gray-800",
          striped: "px-3 py-2 border-b border-gray-200",
          modern: "px-4 py-2.5 border-b border-gray-200",
        };
        lines.push(
          `${indent}${indent}${indent}<td class="${tdClasses[style]}">${val}</td>`,
        );
      }
    }
    lines.push(`${indent}${indent}</tr>`);
  });
  lines.push(`${indent}</tbody>`);
  lines.push("</table>");

  return lines.join("\n");
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
    while (parsed.length < cols) parsed.push("");
    return parsed.slice(0, cols);
  });

  return {
    headers,
    rows: rows.length > 0 ? rows : [Array.from({ length: cols }, () => "")],
    hasHeader: true,
  };
}

const PRESETS: { name: string; table: TableState }[] = [
  {
    name: "Pricing",
    table: {
      headers: ["Plan", "Price", "Storage", "Support"],
      rows: [
        ["Free", "$0/mo", "5 GB", "Community"],
        ["Pro", "$9/mo", "100 GB", "Email"],
        ["Enterprise", "$49/mo", "Unlimited", "24/7 Priority"],
      ],
      hasHeader: true,
    },
  },
  {
    name: "API Reference",
    table: {
      headers: ["Method", "Endpoint", "Description", "Auth"],
      rows: [
        ["GET", "/api/users", "List all users", "Bearer token"],
        ["POST", "/api/users", "Create user", "Bearer token"],
        ["GET", "/api/users/:id", "Get user by ID", "Bearer token"],
        ["DELETE", "/api/users/:id", "Delete user", "Admin only"],
      ],
      hasHeader: true,
    },
  },
  {
    name: "Comparison",
    table: {
      headers: ["Feature", "React", "Vue", "Svelte"],
      rows: [
        ["Language", "JSX/TSX", "SFC Templates", "Svelte syntax"],
        ["Bundle Size", "~42 KB", "~33 KB", "~1.6 KB"],
        ["Learning Curve", "Moderate", "Low", "Low"],
        ["State Management", "External (Redux/Zustand)", "Built-in (Pinia)", "Built-in"],
      ],
      hasHeader: true,
    },
  },
  {
    name: "Schedule",
    table: {
      headers: ["Time", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      rows: [
        ["9:00", "Standup", "Standup", "Standup", "Standup", "Standup"],
        ["10:00", "Development", "Code Review", "Development", "Design Review", "Development"],
        ["14:00", "Planning", "Development", "Demo", "Development", "Retro"],
      ],
      hasHeader: true,
    },
  },
];

const STYLES: { value: TableStyle; label: string }[] = [
  { value: "minimal", label: "Minimal" },
  { value: "bordered", label: "Bordered" },
  { value: "striped", label: "Striped" },
  { value: "modern", label: "Modern" },
];

const FORMATS: { value: OutputFormat; label: string }[] = [
  { value: "plain", label: "Plain HTML" },
  { value: "inline-css", label: "Inline CSS" },
  { value: "tailwind", label: "Tailwind CSS" },
];

export default function HtmlTableGeneratorTool() {
  const [table, setTable] = useState<TableState>(createEmptyTable(3, 3));
  const [output, setOutput] = useState("");
  const [format, setFormat] = useState<OutputFormat>("inline-css");
  const [style, setStyle] = useState<TableStyle>("minimal");
  const [caption, setCaption] = useState("");
  const [copied, setCopied] = useState(false);
  const [csvInput, setCsvInput] = useState("");
  const [showImport, setShowImport] = useState(false);
  const [importError, setImportError] = useState("");

  const { trackAction } = useToolAnalytics("html-table-generator");
  const { isLimited, remaining, dailyLimit, recordUsage } =
    useRateLimit("html-table-generator");

  const generate = useCallback(() => {
    if (isLimited) return;
    recordUsage();
    trackAction("generate");
    const html = generateHtml(table, format, style, caption);
    setOutput(html);
  }, [table, format, style, caption, isLimited, recordUsage, trackAction]);

  useKeyboardShortcut("Enter", generate);

  const updateAndGenerate = useCallback(
    (newTable: TableState) => {
      setTable(newTable);
      if (!isLimited) {
        const html = generateHtml(newTable, format, style, caption);
        setOutput(html);
      }
    },
    [format, style, caption, isLimited],
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

  const addColumn = () => {
    if (table.headers.length >= 10) return;
    const cols = table.headers.length;
    const next: TableState = {
      ...table,
      headers: [...table.headers, `Header ${cols + 1}`],
      rows: table.rows.map((r) => [...r, ""]),
    };
    updateAndGenerate(next);
  };

  const removeColumn = (col: number) => {
    if (table.headers.length <= 1) return;
    const next: TableState = {
      ...table,
      headers: table.headers.filter((_, i) => i !== col),
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

  const toggleHeader = () => {
    const next = { ...table, hasHeader: !table.hasHeader };
    updateAndGenerate(next);
  };

  const copyToClipboard = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadHtml = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "table.html";
    a.click();
    URL.revokeObjectURL(url);
    trackAction("download");
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
    setCaption("");
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
          <span className="text-gray-200">HTML Table Generator</span>
        </div>

        {/* Title */}
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-lg text-blue-400">
              TBL
            </div>
            <h1 className="text-2xl font-bold sm:text-3xl">
              HTML Table Generator
            </h1>
          </div>
          <p className="text-gray-400">
            Build HTML tables visually. Edit cells, toggle header rows, choose a
            style, and export as plain HTML, inline CSS, or Tailwind classes.
          </p>
        </div>

        <RateLimitBanner
          isLimited={isLimited}
          remaining={remaining}
          dailyLimit={dailyLimit}
        />

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

        {/* Style & Format Options */}
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-400">
              Table Style
            </label>
            <div className="flex flex-wrap gap-1.5">
              {STYLES.map((s) => (
                <button
                  key={s.value}
                  onClick={() => {
                    setStyle(s.value);
                    if (output) {
                      setOutput(generateHtml(table, format, s.value, caption));
                    }
                  }}
                  className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                    style === s.value
                      ? "border-blue-500 bg-blue-500/10 text-blue-400"
                      : "border-gray-700 bg-gray-800 hover:border-gray-600"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-400">
              Output Format
            </label>
            <div className="flex flex-wrap gap-1.5">
              {FORMATS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => {
                    setFormat(f.value);
                    if (output) {
                      setOutput(generateHtml(table, f.value, style, caption));
                    }
                  }}
                  className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                    format === f.value
                      ? "border-blue-500 bg-blue-500/10 text-blue-400"
                      : "border-gray-700 bg-gray-800 hover:border-gray-600"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-400">
              Caption (optional)
            </label>
            <input
              type="text"
              value={caption}
              onChange={(e) => {
                setCaption(e.target.value);
                if (output) {
                  setOutput(
                    generateHtml(table, format, style, e.target.value),
                  );
                }
              }}
              className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-1.5 text-sm text-gray-200 placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              placeholder="e.g. Monthly pricing"
            />
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
            onClick={toggleHeader}
            className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
              table.hasHeader
                ? "border-blue-500 bg-blue-500/10 text-blue-400"
                : "border-gray-700 bg-gray-800 hover:border-gray-600"
            }`}
          >
            {table.hasHeader ? "Header: On" : "Header: Off"}
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
              placeholder={
                "Name, Role, Department\nAlice, Engineer, Frontend\nBob, Designer, Product"
              }
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
            <thead>
              {/* Column remove buttons */}
              <tr className="border-b border-gray-700 bg-gray-800/50">
                <th className="w-10 p-1" />
                {table.headers.map((_, c) => (
                  <th key={c} className="p-1">
                    {table.headers.length > 1 && (
                      <button
                        onClick={() => removeColumn(c)}
                        className="rounded px-2 py-0.5 text-xs text-gray-500 hover:bg-red-900/30 hover:text-red-400 transition-colors"
                        title="Remove column"
                      >
                        &times; col
                      </button>
                    )}
                  </th>
                ))}
              </tr>

              {/* Header cells */}
              {table.hasHeader && (
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
              )}
            </thead>

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
                      <span className="text-xs text-gray-600">{r + 1}</span>
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
          Generate HTML (Ctrl+Enter)
        </button>

        {/* Output */}
        {output && (
          <div className="mb-8">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-300">
                Generated HTML
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={downloadHtml}
                  className="rounded-md border border-gray-700 bg-gray-800 px-3 py-1 text-xs hover:border-blue-500 transition-colors"
                >
                  Download .html
                </button>
                <button
                  onClick={copyToClipboard}
                  className="rounded-md border border-gray-700 bg-gray-800 px-3 py-1 text-xs hover:border-blue-500 transition-colors"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
            <textarea
              readOnly
              value={output}
              rows={Math.min(output.split("\n").length + 1, 25)}
              className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 font-mono text-sm text-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        )}

        {/* Preview */}
        {output && (
          <div className="mb-8">
            <h3 className="mb-2 text-sm font-medium text-gray-300">
              Live Preview
            </h3>
            <div className="overflow-x-auto rounded-lg border border-gray-700 bg-white p-4 text-gray-900">
              <div dangerouslySetInnerHTML={{ __html: output }} />
            </div>
          </div>
        )}

        {/* Quick Reference */}
        <details className="rounded-lg border border-gray-700 bg-gray-900">
          <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-gray-300 hover:bg-gray-800/50 transition-colors">
            Quick Reference: HTML Table Elements
          </summary>
          <div className="border-t border-gray-700 px-4 py-3 text-sm text-gray-400 space-y-3">
            <div>
              <h4 className="font-medium text-gray-300 mb-1">
                Core Elements
              </h4>
              <ul className="list-disc pl-5 text-xs space-y-0.5">
                <li>
                  <code className="text-blue-400">&lt;table&gt;</code> — the
                  table container
                </li>
                <li>
                  <code className="text-blue-400">&lt;thead&gt;</code> — groups
                  header rows
                </li>
                <li>
                  <code className="text-blue-400">&lt;tbody&gt;</code> — groups
                  body rows
                </li>
                <li>
                  <code className="text-blue-400">&lt;tr&gt;</code> — a table
                  row
                </li>
                <li>
                  <code className="text-blue-400">&lt;th&gt;</code> — a header
                  cell (bold + centered by default)
                </li>
                <li>
                  <code className="text-blue-400">&lt;td&gt;</code> — a data
                  cell
                </li>
                <li>
                  <code className="text-blue-400">&lt;caption&gt;</code> — table
                  title/description (helps accessibility)
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-300 mb-1">
                Accessibility Tips
              </h4>
              <ul className="list-disc pl-5 text-xs space-y-0.5">
                <li>
                  Always use <code className="text-blue-400">&lt;th&gt;</code>{" "}
                  for header cells — screen readers use them to describe data
                  cells.
                </li>
                <li>
                  Add a <code className="text-blue-400">&lt;caption&gt;</code>{" "}
                  to describe the table&apos;s purpose.
                </li>
                <li>
                  Use <code className="text-blue-400">scope=&quot;col&quot;</code>{" "}
                  or{" "}
                  <code className="text-blue-400">scope=&quot;row&quot;</code> on{" "}
                  <code className="text-blue-400">&lt;th&gt;</code> to associate
                  headers with data.
                </li>
                <li>
                  Avoid using tables for layout — only use them for tabular
                  data.
                </li>
              </ul>
            </div>
          </div>
        </details>
      </div>
    </main>
  );
}
