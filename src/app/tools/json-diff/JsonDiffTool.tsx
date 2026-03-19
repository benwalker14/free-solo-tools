"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { useRateLimit } from "@/hooks/useRateLimit";
import RateLimitBanner from "@/components/RateLimitBanner";

type DiffType = "added" | "removed" | "changed" | "unchanged";

interface DiffEntry {
  path: string;
  type: DiffType;
  oldValue?: unknown;
  newValue?: unknown;
}

type ViewMode = "tree" | "raw";

function formatValue(val: unknown): string {
  if (val === undefined) return "undefined";
  return JSON.stringify(val, null, 2);
}

function shortenValue(val: unknown, max = 80): string {
  const s = JSON.stringify(val);
  if (s === undefined) return "undefined";
  if (s.length <= max) return s;
  return s.slice(0, max) + "...";
}

function deepDiff(
  a: unknown,
  b: unknown,
  path: string = ""
): DiffEntry[] {
  const results: DiffEntry[] = [];

  if (a === b) return results;

  // Both are null or same primitive
  if (a === null || b === null || typeof a !== "object" || typeof b !== "object") {
    if (a !== b) {
      results.push({ path: path || "(root)", type: "changed", oldValue: a, newValue: b });
    }
    return results;
  }

  // One is array, other is not (or both arrays)
  const aIsArray = Array.isArray(a);
  const bIsArray = Array.isArray(b);

  if (aIsArray !== bIsArray) {
    results.push({ path: path || "(root)", type: "changed", oldValue: a, newValue: b });
    return results;
  }

  if (aIsArray && bIsArray) {
    const maxLen = Math.max(a.length, b.length);
    for (let i = 0; i < maxLen; i++) {
      const itemPath = path ? `${path}[${i}]` : `[${i}]`;
      if (i >= a.length) {
        results.push({ path: itemPath, type: "added", newValue: b[i] });
      } else if (i >= b.length) {
        results.push({ path: itemPath, type: "removed", oldValue: a[i] });
      } else {
        results.push(...deepDiff(a[i], b[i], itemPath));
      }
    }
    return results;
  }

  // Both are objects
  const aObj = a as Record<string, unknown>;
  const bObj = b as Record<string, unknown>;
  const allKeys = new Set([...Object.keys(aObj), ...Object.keys(bObj)]);

  for (const key of allKeys) {
    const keyPath = path ? `${path}.${key}` : key;
    if (!(key in aObj)) {
      results.push({ path: keyPath, type: "added", newValue: bObj[key] });
    } else if (!(key in bObj)) {
      results.push({ path: keyPath, type: "removed", oldValue: aObj[key] });
    } else {
      results.push(...deepDiff(aObj[key], bObj[key], keyPath));
    }
  }

  return results;
}

const SAMPLE_LEFT = JSON.stringify(
  {
    name: "DevBolt",
    version: "1.0.0",
    description: "Free online developer tools",
    features: ["JSON Formatter", "Base64 Codec", "Hash Generator"],
    config: {
      theme: "light",
      language: "en",
      analytics: true,
    },
    maintainers: [
      { name: "Alice", role: "lead" },
      { name: "Bob", role: "dev" },
    ],
  },
  null,
  2
);

const SAMPLE_RIGHT = JSON.stringify(
  {
    name: "DevBolt",
    version: "2.0.0",
    description: "Free online developer tools — fast & private",
    features: ["JSON Formatter", "Base64 Codec", "Hash Generator", "JSON Diff"],
    config: {
      theme: "dark",
      language: "en",
      notifications: true,
    },
    maintainers: [
      { name: "Alice", role: "lead" },
      { name: "Charlie", role: "dev" },
    ],
    license: "MIT",
  },
  null,
  2
);

export default function JsonDiffTool() {
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");
  const [leftError, setLeftError] = useState("");
  const [rightError, setRightError] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("tree");
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());
  const { trackFirstInteraction, trackAction } = useToolAnalytics("json-diff");
  const { isLimited, remaining, dailyLimit, recordUsage } = useRateLimit("json-diff");

  const parsedLeft = useMemo(() => {
    if (!left.trim()) return { ok: true as const, value: undefined };
    try {
      return { ok: true as const, value: JSON.parse(left) };
    } catch (e) {
      return { ok: false as const, error: (e as Error).message };
    }
  }, [left]);

  const parsedRight = useMemo(() => {
    if (!right.trim()) return { ok: true as const, value: undefined };
    try {
      return { ok: true as const, value: JSON.parse(right) };
    } catch (e) {
      return { ok: false as const, error: (e as Error).message };
    }
  }, [right]);

  const diffs = useMemo(() => {
    if (!parsedLeft.ok || !parsedRight.ok) return [];
    if (parsedLeft.value === undefined || parsedRight.value === undefined) return [];
    return deepDiff(parsedLeft.value, parsedRight.value);
  }, [parsedLeft, parsedRight]);

  const stats = useMemo(() => {
    let added = 0,
      removed = 0,
      changed = 0;
    for (const d of diffs) {
      if (d.type === "added") added++;
      else if (d.type === "removed") removed++;
      else if (d.type === "changed") changed++;
    }
    return { added, removed, changed, total: added + removed + changed };
  }, [diffs]);

  const handleCompare = useCallback(() => {
    if (isLimited) return;
    recordUsage();
    trackAction("compare");
    setLeftError("");
    setRightError("");
    if (left.trim() && !parsedLeft.ok) {
      setLeftError(parsedLeft.error);
    }
    if (right.trim() && !parsedRight.ok) {
      setRightError(parsedRight.error);
    }
  }, [isLimited, recordUsage, trackAction, left, right, parsedLeft, parsedRight]);

  useKeyboardShortcut("Enter", handleCompare, { ctrl: true });

  const togglePath = (path: string) => {
    setExpandedPaths((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  };

  const expandAll = () => setExpandedPaths(new Set(diffs.map((d) => d.path)));
  const collapseAll = () => setExpandedPaths(new Set());

  const loadSample = () => {
    setLeft(SAMPLE_LEFT);
    setRight(SAMPLE_RIGHT);
    setLeftError("");
    setRightError("");
    trackAction("load-sample");
  };

  const handleSwap = () => {
    setLeft(right);
    setRight(left);
    setLeftError("");
    setRightError("");
  };

  const handleClear = () => {
    setLeft("");
    setRight("");
    setLeftError("");
    setRightError("");
    setExpandedPaths(new Set());
  };

  const canCompare =
    left.trim().length > 0 && right.trim().length > 0;

  const showResults =
    parsedLeft.ok &&
    parsedRight.ok &&
    parsedLeft.value !== undefined &&
    parsedRight.value !== undefined;

  const typeColor = (type: DiffType) => {
    switch (type) {
      case "added":
        return "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300";
      case "removed":
        return "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300";
      case "changed":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300";
      default:
        return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  const typeBorder = (type: DiffType) => {
    switch (type) {
      case "added":
        return "border-l-green-500";
      case "removed":
        return "border-l-red-500";
      case "changed":
        return "border-l-yellow-500";
      default:
        return "border-l-gray-300";
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="mb-8 block text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        &larr; Back to tools
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        JSON Diff
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Compare two JSON objects and see structural differences — added, removed,
        and changed keys highlighted.
      </p>

      <RateLimitBanner remaining={remaining} dailyLimit={dailyLimit} isLimited={isLimited} />

      {/* Controls */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <button
          onClick={handleCompare}
          disabled={!canCompare || isLimited}
          className="rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Compare (Ctrl+Enter)
        </button>
        <button
          onClick={loadSample}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          Load Sample
        </button>
        <button
          onClick={handleSwap}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          Swap
        </button>
        <button
          onClick={handleClear}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          Clear
        </button>

        {showResults && diffs.length > 0 && (
          <div className="ml-auto flex items-center gap-2">
            <div className="flex rounded-md border border-gray-300 dark:border-gray-600">
              <button
                onClick={() => setViewMode("tree")}
                className={`px-3 py-1.5 text-sm ${viewMode === "tree" ? "bg-indigo-600 text-white" : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"} rounded-l-md`}
              >
                Tree
              </button>
              <button
                onClick={() => setViewMode("raw")}
                className={`px-3 py-1.5 text-sm ${viewMode === "raw" ? "bg-indigo-600 text-white" : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"} rounded-r-md`}
              >
                Raw
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Input panels */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Left (Original)
          </label>
          <textarea
            value={left}
            onChange={(e) => {
              trackFirstInteraction();
              setLeft(e.target.value);
              setLeftError("");
            }}
            placeholder='{"key": "value"}'
            spellCheck={false}
            className={`h-[300px] w-full resize-none rounded-lg border ${leftError ? "border-red-400 dark:border-red-600" : "border-gray-300 dark:border-gray-700"} bg-white px-4 py-3 font-mono text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-600`}
          />
          {leftError && (
            <p className="mt-1 text-xs text-red-500 dark:text-red-400">
              Invalid JSON: {leftError}
            </p>
          )}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Right (Modified)
          </label>
          <textarea
            value={right}
            onChange={(e) => {
              trackFirstInteraction();
              setRight(e.target.value);
              setRightError("");
            }}
            placeholder='{"key": "value"}'
            spellCheck={false}
            className={`h-[300px] w-full resize-none rounded-lg border ${rightError ? "border-red-400 dark:border-red-600" : "border-gray-300 dark:border-gray-700"} bg-white px-4 py-3 font-mono text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-600`}
          />
          {rightError && (
            <p className="mt-1 text-xs text-red-500 dark:text-red-400">
              Invalid JSON: {rightError}
            </p>
          )}
        </div>
      </div>

      {/* Results */}
      {showResults && (
        <div className="mt-6">
          {/* Stats bar */}
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Differences
            </h3>
            {stats.total > 0 ? (
              <div className="flex gap-2 text-xs">
                {stats.added > 0 && (
                  <span className="rounded bg-green-100 px-2 py-0.5 text-green-800 dark:bg-green-900 dark:text-green-200">
                    +{stats.added} added
                  </span>
                )}
                {stats.removed > 0 && (
                  <span className="rounded bg-red-100 px-2 py-0.5 text-red-800 dark:bg-red-900 dark:text-red-200">
                    -{stats.removed} removed
                  </span>
                )}
                {stats.changed > 0 && (
                  <span className="rounded bg-yellow-100 px-2 py-0.5 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                    ~{stats.changed} changed
                  </span>
                )}
              </div>
            ) : (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                No differences found — JSON objects are identical
              </span>
            )}
            {stats.total > 0 && viewMode === "tree" && (
              <div className="ml-auto flex gap-2">
                <button
                  onClick={expandAll}
                  className="text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  Expand all
                </button>
                <button
                  onClick={collapseAll}
                  className="text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  Collapse all
                </button>
              </div>
            )}
          </div>

          {stats.total > 0 && viewMode === "tree" && (
            <div className="space-y-1">
              {diffs.map((entry) => {
                const isExpanded = expandedPaths.has(entry.path);
                return (
                  <div
                    key={entry.path}
                    className={`rounded-md border border-l-4 ${typeBorder(entry.type)} border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900`}
                  >
                    <button
                      onClick={() => togglePath(entry.path)}
                      className="flex w-full items-center gap-3 px-3 py-2 text-left"
                    >
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        {isExpanded ? "▼" : "▶"}
                      </span>
                      <code className="text-sm font-mono text-gray-800 dark:text-gray-200 font-medium">
                        {entry.path}
                      </code>
                      <span
                        className={`ml-auto rounded px-2 py-0.5 text-xs font-medium ${typeColor(entry.type)}`}
                      >
                        {entry.type}
                      </span>
                    </button>
                    {isExpanded && (
                      <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3 font-mono text-sm">
                        {entry.type === "added" && (
                          <div>
                            <span className="text-xs font-sans text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                              New value
                            </span>
                            <pre className="mt-1 whitespace-pre-wrap break-words text-green-700 dark:text-green-400">
                              {formatValue(entry.newValue)}
                            </pre>
                          </div>
                        )}
                        {entry.type === "removed" && (
                          <div>
                            <span className="text-xs font-sans text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                              Old value
                            </span>
                            <pre className="mt-1 whitespace-pre-wrap break-words text-red-700 dark:text-red-400">
                              {formatValue(entry.oldValue)}
                            </pre>
                          </div>
                        )}
                        {entry.type === "changed" && (
                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div>
                              <span className="text-xs font-sans text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                Old value
                              </span>
                              <pre className="mt-1 whitespace-pre-wrap break-words text-red-700 dark:text-red-400">
                                {formatValue(entry.oldValue)}
                              </pre>
                            </div>
                            <div>
                              <span className="text-xs font-sans text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                New value
                              </span>
                              <pre className="mt-1 whitespace-pre-wrap break-words text-green-700 dark:text-green-400">
                                {formatValue(entry.newValue)}
                              </pre>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {stats.total > 0 && viewMode === "raw" && (
            <div className="rounded-lg border border-gray-300 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-950">
              <pre className="whitespace-pre-wrap break-words font-mono text-sm text-gray-900 dark:text-gray-100">
                {diffs.map((entry) => {
                  const prefix =
                    entry.type === "added"
                      ? "+"
                      : entry.type === "removed"
                        ? "-"
                        : "~";
                  const line =
                    entry.type === "changed"
                      ? `${prefix} ${entry.path}: ${shortenValue(entry.oldValue)} → ${shortenValue(entry.newValue)}`
                      : entry.type === "added"
                        ? `${prefix} ${entry.path}: ${shortenValue(entry.newValue)}`
                        : `${prefix} ${entry.path}: ${shortenValue(entry.oldValue)}`;
                  return (
                    <span
                      key={entry.path}
                      className={
                        entry.type === "added"
                          ? "text-green-700 dark:text-green-400"
                          : entry.type === "removed"
                            ? "text-red-700 dark:text-red-400"
                            : "text-yellow-700 dark:text-yellow-400"
                      }
                    >
                      {line}
                      {"\n"}
                    </span>
                  );
                })}
              </pre>
            </div>
          )}

          {stats.total === 0 && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center dark:border-green-800 dark:bg-green-950">
              <p className="text-green-700 dark:text-green-300 font-medium">
                The two JSON objects are structurally identical.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Info section */}
      <div className="mt-12 rounded-lg border border-gray-200 bg-gray-50 px-6 py-5 dark:border-gray-700 dark:bg-gray-900">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          About JSON Diff
        </h2>
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <p>
            This tool performs a deep structural comparison of two JSON documents.
            Unlike a plain text diff, it understands JSON semantics — comparing
            objects by key and arrays by index, so reordering whitespace or
            formatting won&apos;t produce false differences.
          </p>
          <p>
            <strong>Added</strong> keys exist only in the right document.{" "}
            <strong>Removed</strong> keys exist only in the left.{" "}
            <strong>Changed</strong> keys exist in both but have different values.
            Nested objects and arrays are traversed recursively, showing the full
            JSON path to each difference.
          </p>
          <p>
            Use <strong>Tree view</strong> to inspect each difference interactively,
            or <strong>Raw view</strong> for a compact, copy-friendly summary. Press{" "}
            <kbd className="rounded border border-gray-300 bg-white px-1.5 py-0.5 font-mono text-xs dark:border-gray-600 dark:bg-gray-800">
              Ctrl+Enter
            </kbd>{" "}
            to compare.
          </p>
        </div>
      </div>
    </div>
  );
}
