"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";
import { useRateLimit } from "@/hooks/useRateLimit";
import RateLimitBanner from "@/components/RateLimitBanner";

// ── Types ──

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

interface TreeStats {
  keys: number;
  values: number;
  depth: number;
  arrays: number;
  objects: number;
  strings: number;
  numbers: number;
  booleans: number;
  nulls: number;
}

// ── Stats computation ──

function computeStats(value: JsonValue, depth = 0): TreeStats {
  const stats: TreeStats = {
    keys: 0, values: 0, depth, arrays: 0, objects: 0,
    strings: 0, numbers: 0, booleans: 0, nulls: 0,
  };

  if (value === null) {
    stats.nulls = 1;
    stats.values = 1;
    return stats;
  }
  if (typeof value === "string") {
    stats.strings = 1;
    stats.values = 1;
    return stats;
  }
  if (typeof value === "number") {
    stats.numbers = 1;
    stats.values = 1;
    return stats;
  }
  if (typeof value === "boolean") {
    stats.booleans = 1;
    stats.values = 1;
    return stats;
  }
  if (Array.isArray(value)) {
    stats.arrays = 1;
    let maxDepth = depth;
    for (const item of value) {
      const child = computeStats(item, depth + 1);
      stats.keys += child.keys;
      stats.values += child.values;
      stats.arrays += child.arrays;
      stats.objects += child.objects;
      stats.strings += child.strings;
      stats.numbers += child.numbers;
      stats.booleans += child.booleans;
      stats.nulls += child.nulls;
      if (child.depth > maxDepth) maxDepth = child.depth;
    }
    stats.depth = maxDepth;
    return stats;
  }
  // Object
  stats.objects = 1;
  const entries = Object.entries(value);
  stats.keys = entries.length;
  let maxDepth = depth;
  for (const [, v] of entries) {
    const child = computeStats(v, depth + 1);
    stats.keys += child.keys;
    stats.values += child.values;
    stats.arrays += child.arrays;
    stats.objects += child.objects;
    stats.strings += child.strings;
    stats.numbers += child.numbers;
    stats.booleans += child.booleans;
    stats.nulls += child.nulls;
    if (child.depth > maxDepth) maxDepth = child.depth;
  }
  stats.depth = maxDepth;
  return stats;
}

// ── Samples ──

const SAMPLES: { label: string; json: string }[] = [
  {
    label: "API Response",
    json: JSON.stringify({
      status: "success",
      data: {
        users: [
          { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "admin", active: true },
          { id: 2, name: "Bob Smith", email: "bob@example.com", role: "editor", active: true },
          { id: 3, name: "Charlie Brown", email: "charlie@example.com", role: "viewer", active: false },
        ],
        pagination: { page: 1, per_page: 25, total: 3, total_pages: 1 },
      },
      meta: { request_id: "req_abc123", timestamp: "2026-03-19T12:00:00Z" },
    }, null, 2),
  },
  {
    label: "Package.json",
    json: JSON.stringify({
      name: "my-app",
      version: "1.0.0",
      private: true,
      scripts: { dev: "next dev", build: "next build", start: "next start", lint: "next lint" },
      dependencies: { next: "^15.0.0", react: "^19.0.0", "react-dom": "^19.0.0", typescript: "^5.6.0" },
      devDependencies: { "@types/node": "^22.0.0", "@types/react": "^19.0.0", eslint: "^9.0.0", "tailwindcss": "^4.0.0" },
    }, null, 2),
  },
  {
    label: "Nested Config",
    json: JSON.stringify({
      database: {
        primary: { host: "db.example.com", port: 5432, name: "app_prod", ssl: true, pool: { min: 5, max: 20, idle_timeout: 30000 } },
        replica: { host: "db-ro.example.com", port: 5432, name: "app_prod", ssl: true, pool: { min: 2, max: 10, idle_timeout: 30000 } },
      },
      cache: { driver: "redis", host: "cache.example.com", port: 6379, ttl: 3600, prefix: "app:" },
      logging: { level: "info", format: "json", outputs: ["stdout", "file"], file: { path: "/var/log/app.log", max_size: "100MB", rotation: 7 } },
      features: { dark_mode: true, notifications: true, beta_features: false, max_upload_size: 10485760 },
    }, null, 2),
  },
  {
    label: "GeoJSON",
    json: JSON.stringify({
      type: "FeatureCollection",
      features: [
        { type: "Feature", geometry: { type: "Point", coordinates: [-73.9857, 40.7484] }, properties: { name: "Empire State Building", city: "New York", height: 443 } },
        { type: "Feature", geometry: { type: "Point", coordinates: [2.2945, 48.8584] }, properties: { name: "Eiffel Tower", city: "Paris", height: 330 } },
        { type: "Feature", geometry: { type: "Point", coordinates: [139.7454, 35.6586] }, properties: { name: "Tokyo Tower", city: "Tokyo", height: 333 } },
      ],
    }, null, 2),
  },
];

// ── Tree Node Component ──

function TreeNode({
  keyName,
  value,
  path,
  depth,
  expandedPaths,
  toggleExpand,
  searchTerm,
  onCopy,
}: {
  keyName: string | number | null;
  value: JsonValue;
  path: string;
  depth: number;
  expandedPaths: Set<string>;
  toggleExpand: (path: string) => void;
  searchTerm: string;
  onCopy: (text: string, label: string) => void;
}) {
  const isExpanded = expandedPaths.has(path);
  const isObject = value !== null && typeof value === "object" && !Array.isArray(value);
  const isArray = Array.isArray(value);
  const isExpandable = isObject || isArray;

  const matchesSearch = searchTerm
    ? (keyName !== null && String(keyName).toLowerCase().includes(searchTerm.toLowerCase())) ||
      (!isExpandable && String(value).toLowerCase().includes(searchTerm.toLowerCase()))
    : false;

  // Render the value inline
  const renderValue = () => {
    if (value === null) return <span className="text-gray-500 dark:text-gray-400 italic">null</span>;
    if (typeof value === "boolean")
      return <span className="text-purple-600 dark:text-purple-400">{value ? "true" : "false"}</span>;
    if (typeof value === "number")
      return <span className="text-blue-600 dark:text-blue-400">{String(value)}</span>;
    if (typeof value === "string") {
      const display = value.length > 120 ? value.slice(0, 120) + "..." : value;
      return <span className="text-green-700 dark:text-green-400">&quot;{display}&quot;</span>;
    }
    return null;
  };

  const itemCount = isArray ? value.length : isObject ? Object.keys(value).length : 0;

  return (
    <div className={`${depth > 0 ? "ml-5 border-l border-gray-200 dark:border-gray-700 pl-3" : ""}`}>
      <div
        className={`group flex items-start gap-1.5 py-0.5 rounded px-1 -ml-1 ${
          matchesSearch ? "bg-yellow-100 dark:bg-yellow-900/30" : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
        }`}
      >
        {/* Expand toggle */}
        {isExpandable ? (
          <button
            onClick={() => toggleExpand(path)}
            className="mt-0.5 flex-shrink-0 w-4 h-4 flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            aria-label={isExpanded ? "Collapse" : "Expand"}
          >
            <svg
              className={`w-3 h-3 transition-transform duration-150 ${isExpanded ? "rotate-90" : ""}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        ) : (
          <span className="w-4 flex-shrink-0" />
        )}

        {/* Key */}
        <div className="flex items-start gap-1 min-w-0 flex-1 font-mono text-xs leading-5">
          {keyName !== null && (
            <>
              <span className="text-red-700 dark:text-red-400 flex-shrink-0">
                {typeof keyName === "number" ? `[${keyName}]` : `"${keyName}"`}
              </span>
              <span className="text-gray-400 flex-shrink-0">:</span>
            </>
          )}

          {isExpandable ? (
            <button
              onClick={() => toggleExpand(path)}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            >
              {isArray ? `[${!isExpanded ? `${itemCount} items` : ""}]` : `{${!isExpanded ? `${itemCount} keys` : ""}}`}
              {!isExpanded && (
                <span className="ml-1 text-gray-400 text-[10px]">
                  {isArray ? `Array(${itemCount})` : `Object(${itemCount})`}
                </span>
              )}
            </button>
          ) : (
            <span className="break-all">{renderValue()}</span>
          )}

          {/* Copy buttons - visible on hover */}
          <span className="invisible group-hover:visible flex-shrink-0 flex gap-1 ml-auto">
            <button
              onClick={() => onCopy(path, "path")}
              className="text-[10px] text-gray-400 hover:text-indigo-500 px-1"
              title={`Copy path: ${path}`}
            >
              path
            </button>
            <button
              onClick={() => onCopy(JSON.stringify(value, null, 2), "value")}
              className="text-[10px] text-gray-400 hover:text-indigo-500 px-1"
              title="Copy value"
            >
              copy
            </button>
          </span>
        </div>
      </div>

      {/* Children */}
      {isExpandable && isExpanded && (
        <div>
          {isArray
            ? value.map((item, idx) => (
                <TreeNode
                  key={idx}
                  keyName={idx}
                  value={item}
                  path={`${path}[${idx}]`}
                  depth={depth + 1}
                  expandedPaths={expandedPaths}
                  toggleExpand={toggleExpand}
                  searchTerm={searchTerm}
                  onCopy={onCopy}
                />
              ))
            : Object.entries(value as Record<string, JsonValue>).map(([k, v]) => (
                <TreeNode
                  key={k}
                  keyName={k}
                  value={v}
                  path={path ? `${path}.${k}` : k}
                  depth={depth + 1}
                  expandedPaths={expandedPaths}
                  toggleExpand={toggleExpand}
                  searchTerm={searchTerm}
                  onCopy={onCopy}
                />
              ))}
        </div>
      )}
    </div>
  );
}

// ── Collect all expandable paths ──

function collectPaths(value: JsonValue, path: string, depth: number, maxDepth?: number): string[] {
  const paths: string[] = [];
  if (value === null || typeof value !== "object") return paths;
  if (maxDepth !== undefined && depth >= maxDepth) return paths;

  paths.push(path);

  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      paths.push(...collectPaths(value[i], `${path}[${i}]`, depth + 1, maxDepth));
    }
  } else {
    for (const [k, v] of Object.entries(value)) {
      paths.push(...collectPaths(v, path ? `${path}.${k}` : k, depth + 1, maxDepth));
    }
  }
  return paths;
}

// ── Main Component ──

export default function JsonVisualizerTool() {
  const [input, setInput] = useState("");
  const [parsedData, setParsedData] = useState<JsonValue | undefined>(undefined);
  const [parseError, setParseError] = useState<string | null>(null);
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const { trackAction } = useToolAnalytics("json-visualizer");
  const { remaining, dailyLimit, isLimited, recordUsage } =
    useRateLimit("json-visualizer");

  // Parse JSON when input changes
  const handleParse = useCallback(
    (jsonStr: string) => {
      setInput(jsonStr);
      if (!jsonStr.trim()) {
        setParsedData(undefined);
        setParseError(null);
        return;
      }
      try {
        const parsed = JSON.parse(jsonStr);
        setParsedData(parsed);
        setParseError(null);
        // Auto-expand first 2 levels
        const initialPaths = collectPaths(parsed, "$", 0, 2);
        setExpandedPaths(new Set(initialPaths));
        if (!isLimited) {
          recordUsage();
          trackAction("visualize");
        }
      } catch (e) {
        setParsedData(undefined);
        setParseError(e instanceof Error ? e.message : "Invalid JSON");
      }
    },
    [isLimited, recordUsage, trackAction],
  );

  const toggleExpand = useCallback((path: string) => {
    setExpandedPaths((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  }, []);

  const expandAll = useCallback(() => {
    if (parsedData === undefined) return;
    const all = collectPaths(parsedData, "$", 0);
    setExpandedPaths(new Set(all));
  }, [parsedData]);

  const collapseAll = useCallback(() => {
    setExpandedPaths(new Set(["$"]));
  }, []);

  const expandToDepth = useCallback(
    (depth: number) => {
      if (parsedData === undefined) return;
      const paths = collectPaths(parsedData, "$", 0, depth);
      setExpandedPaths(new Set(paths));
    },
    [parsedData],
  );

  const handleCopy = useCallback((text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 1500);
  }, []);

  const stats = useMemo(() => {
    if (parsedData === undefined) return null;
    return computeStats(parsedData);
  }, [parsedData]);

  // Keyboard shortcut for search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "f" && parsedData !== undefined) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [parsedData]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="mb-8 block text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        &larr; Back to tools
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        JSON Visualizer & Tree Viewer
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Paste JSON and explore it as an interactive, collapsible tree. Click
        nodes to expand/collapse, search for keys or values, and copy paths or
        data.
      </p>

      <RateLimitBanner
        remaining={remaining}
        dailyLimit={dailyLimit}
        isLimited={isLimited}
      />

      {/* Samples */}
      <div className="mb-4 flex flex-wrap gap-2">
        <span className="text-xs text-gray-500 dark:text-gray-400 self-center">
          Samples:
        </span>
        {SAMPLES.map((s) => (
          <button
            key={s.label}
            onClick={() => handleParse(s.json)}
            className="rounded border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            JSON Input
          </label>
          <textarea
            value={input}
            onChange={(e) => handleParse(e.target.value)}
            placeholder={`Paste JSON here, e.g.:\n\n{\n  "name": "DevBolt",\n  "tools": 84,\n  "features": ["tree view", "search", "copy"]\n}`}
            rows={20}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 font-mono text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
            spellCheck={false}
          />
          {parseError && (
            <div className="mt-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:border-red-800 dark:text-red-400">
              Parse error: {parseError}
            </div>
          )}
        </div>

        {/* Tree View */}
        <div>
          <div className="flex items-center justify-between mb-2 gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Tree View
            </label>
            {parsedData !== undefined && (
              <div className="flex items-center gap-1">
                <button
                  onClick={collapseAll}
                  className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 px-1.5 py-0.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Collapse
                </button>
                <button
                  onClick={() => expandToDepth(2)}
                  className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 px-1.5 py-0.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  L2
                </button>
                <button
                  onClick={() => expandToDepth(3)}
                  className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 px-1.5 py-0.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  L3
                </button>
                <button
                  onClick={() => expandToDepth(5)}
                  className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 px-1.5 py-0.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  L5
                </button>
                <button
                  onClick={expandAll}
                  className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 px-1.5 py-0.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  All
                </button>
              </div>
            )}
          </div>

          {/* Search bar */}
          {parsedData !== undefined && (
            <div className="relative mb-2">
              <input
                ref={searchRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search keys or values... (Ctrl+F)"
                className="w-full rounded-lg border border-gray-300 bg-white pl-8 pr-3 py-1.5 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
              />
              <svg
                className="absolute left-2.5 top-2 w-3.5 h-3.5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          )}

          <div className="rounded-lg border border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-900 min-h-[30rem] max-h-[40rem] overflow-auto p-3">
            {parsedData === undefined ? (
              <div className="flex items-center justify-center h-full min-h-[30rem] text-gray-400 dark:text-gray-500 text-sm">
                Paste JSON to visualize the tree
              </div>
            ) : (
              <TreeNode
                keyName={null}
                value={parsedData}
                path="$"
                depth={0}
                expandedPaths={expandedPaths}
                toggleExpand={toggleExpand}
                searchTerm={searchTerm}
                onCopy={handleCopy}
              />
            )}
          </div>

          {/* Copy notification */}
          {copied && (
            <div className="mt-2 text-xs text-green-600 dark:text-green-400">
              Copied {copied}!
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="mt-6 grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-3">
          {[
            { label: "Keys", value: stats.keys, color: "text-red-600 dark:text-red-400" },
            { label: "Depth", value: stats.depth, color: "text-indigo-600 dark:text-indigo-400" },
            { label: "Objects", value: stats.objects, color: "text-orange-600 dark:text-orange-400" },
            { label: "Arrays", value: stats.arrays, color: "text-amber-600 dark:text-amber-400" },
            { label: "Strings", value: stats.strings, color: "text-green-600 dark:text-green-400" },
            { label: "Numbers", value: stats.numbers, color: "text-blue-600 dark:text-blue-400" },
            { label: "Booleans", value: stats.booleans, color: "text-purple-600 dark:text-purple-400" },
            { label: "Nulls", value: stats.nulls, color: "text-gray-500 dark:text-gray-400" },
            { label: "Size", value: `${(new Blob([input]).size / 1024).toFixed(1)}KB`, color: "text-gray-600 dark:text-gray-300" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-center dark:border-gray-700 dark:bg-gray-800"
            >
              <div className={`text-lg font-bold ${s.color}`}>{s.value}</div>
              <div className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      {parsedData !== undefined && (
        <div className="mt-4 flex gap-3">
          <button
            onClick={() => handleCopy(JSON.stringify(parsedData, null, 2), "formatted JSON")}
            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
          >
            {copied === "formatted JSON" ? "Copied!" : "Copy Formatted"}
          </button>
          <button
            onClick={() => handleCopy(JSON.stringify(parsedData), "minified JSON")}
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            {copied === "minified JSON" ? "Copied!" : "Copy Minified"}
          </button>
          <button
            onClick={() => {
              setInput("");
              setParsedData(undefined);
              setParseError(null);
              setSearchTerm("");
              setExpandedPaths(new Set());
            }}
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Clear
          </button>
        </div>
      )}

      {/* Info */}
      <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          About JSON Visualizer
        </h2>
        <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
          <li>
            <strong>Interactive tree</strong> — expand and collapse nodes to
            explore deeply nested JSON structures.
          </li>
          <li>
            <strong>Search</strong> — find keys or values instantly with
            highlighted matches. Use Ctrl+F to focus the search bar.
          </li>
          <li>
            <strong>Copy paths &amp; values</strong> — hover over any node to
            copy its JSON path or value to your clipboard.
          </li>
          <li>
            <strong>Depth control</strong> — expand to a specific depth level
            (L2, L3, L5) or expand/collapse everything.
          </li>
          <li>
            <strong>Stats</strong> — see key count, nesting depth, type
            distribution, and size at a glance.
          </li>
          <li>
            Everything runs in your browser — no data is sent over the network.
          </li>
        </ul>
      </div>
    </div>
  );
}
