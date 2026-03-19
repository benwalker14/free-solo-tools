"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import RateLimitBanner from "@/components/RateLimitBanner";

type SqlDialect = "mysql" | "postgresql" | "sqlite";

interface SqlOptions {
  dialect: SqlDialect;
  tableName: string;
  dropTable: boolean;
  createTable: boolean;
  insertData: boolean;
  batchInsert: boolean;
  ifNotExists: boolean;
  nullableColumns: boolean;
}

function inferSqlType(
  values: unknown[],
  dialect: SqlDialect,
): string {
  const nonNullValues = values.filter((v) => v !== null && v !== undefined);
  if (nonNullValues.length === 0) {
    return dialect === "postgresql" ? "TEXT" : "VARCHAR(255)";
  }

  let hasBoolean = false;
  let hasFloat = false;
  let hasInteger = false;
  let hasString = false;
  let maxStringLen = 0;

  for (const v of nonNullValues) {
    if (typeof v === "boolean") {
      hasBoolean = true;
    } else if (typeof v === "number") {
      if (Number.isInteger(v)) {
        hasInteger = true;
      } else {
        hasFloat = true;
      }
    } else if (typeof v === "string") {
      hasString = true;
      if (v.length > maxStringLen) maxStringLen = v.length;
    } else {
      // objects / arrays → store as text/json
      hasString = true;
      const s = JSON.stringify(v);
      if (s.length > maxStringLen) maxStringLen = s.length;
    }
  }

  // Mixed types → text
  const typeCount =
    (hasBoolean ? 1 : 0) +
    (hasFloat || hasInteger ? 1 : 0) +
    (hasString ? 1 : 0);

  if (typeCount > 1) {
    return "TEXT";
  }

  if (hasBoolean) {
    if (dialect === "sqlite") return "INTEGER";
    return "BOOLEAN";
  }

  if (hasFloat) {
    if (dialect === "sqlite") return "REAL";
    if (dialect === "postgresql") return "DOUBLE PRECISION";
    return "DOUBLE";
  }

  if (hasInteger) {
    const maxVal = Math.max(...nonNullValues.map((v) => Math.abs(v as number)));
    if (maxVal > 2147483647) {
      return "BIGINT";
    }
    return "INTEGER";
  }

  // String — check for special patterns
  if (hasString) {
    const allMatch = (re: RegExp) =>
      nonNullValues.every((v) => re.test(String(v)));

    // Date patterns
    if (allMatch(/^\d{4}-\d{2}-\d{2}$/)) {
      return "DATE";
    }
    if (allMatch(/^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}/)) {
      if (dialect === "sqlite") return "TEXT";
      if (dialect === "postgresql") return "TIMESTAMP";
      return "DATETIME";
    }
    // UUID
    if (
      allMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
      )
    ) {
      if (dialect === "postgresql") return "UUID";
      return "VARCHAR(36)";
    }
    // JSON objects/arrays stored as string
    if (nonNullValues.every((v) => typeof v === "object")) {
      if (dialect === "postgresql") return "JSONB";
      if (dialect === "mysql") return "JSON";
      return "TEXT";
    }

    if (dialect === "sqlite") return "TEXT";
    if (maxStringLen <= 255) {
      return `VARCHAR(${Math.max(50, Math.ceil(maxStringLen / 50) * 50)})`;
    }
    return "TEXT";
  }

  return "TEXT";
}

function escapeValue(
  value: unknown,
  dialect: SqlDialect,
): string {
  if (value === null || value === undefined) return "NULL";
  if (typeof value === "boolean") {
    if (dialect === "sqlite") return value ? "1" : "0";
    return value ? "TRUE" : "FALSE";
  }
  if (typeof value === "number") return String(value);
  if (typeof value === "object") {
    const json = JSON.stringify(value);
    return "'" + json.replace(/'/g, "''") + "'";
  }
  return "'" + String(value).replace(/'/g, "''") + "'";
}

function quoteIdentifier(name: string, dialect: SqlDialect): string {
  if (dialect === "mysql") return "`" + name.replace(/`/g, "``") + "`";
  return '"' + name.replace(/"/g, '""') + '"';
}

function generateSql(
  data: Record<string, unknown>[],
  options: SqlOptions,
): string {
  const { dialect, tableName, dropTable, createTable, insertData, batchInsert, ifNotExists, nullableColumns } =
    options;

  // Collect all unique keys
  const columnsSet = new Set<string>();
  for (const row of data) {
    for (const key of Object.keys(row)) {
      columnsSet.add(key);
    }
  }
  const columns = Array.from(columnsSet);

  // Infer types
  const columnTypes: Record<string, string> = {};
  const hasNull: Record<string, boolean> = {};
  for (const col of columns) {
    const values = data.map((row) => row[col]);
    columnTypes[col] = inferSqlType(values, dialect);
    hasNull[col] = values.some((v) => v === null || v === undefined);
  }

  const lines: string[] = [];

  // DROP TABLE
  if (dropTable) {
    if (dialect === "postgresql") {
      lines.push(`DROP TABLE IF EXISTS ${quoteIdentifier(tableName, dialect)} CASCADE;`);
    } else {
      lines.push(`DROP TABLE IF EXISTS ${quoteIdentifier(tableName, dialect)};`);
    }
    lines.push("");
  }

  // CREATE TABLE
  if (createTable) {
    const ifne = ifNotExists ? " IF NOT EXISTS" : "";
    lines.push(
      `CREATE TABLE${ifne} ${quoteIdentifier(tableName, dialect)} (`,
    );
    const colDefs = columns.map((col, i) => {
      const qt = quoteIdentifier(col, dialect);
      const type = columnTypes[col];
      const nullable = nullableColumns && hasNull[col] ? "" : " NOT NULL";
      const comma = i < columns.length - 1 ? "," : "";
      return `  ${qt} ${type}${nullable}${comma}`;
    });
    lines.push(...colDefs);
    lines.push(");");
    lines.push("");
  }

  // INSERT statements
  if (insertData && data.length > 0) {
    const quotedCols = columns
      .map((c) => quoteIdentifier(c, dialect))
      .join(", ");

    if (batchInsert) {
      lines.push(
        `INSERT INTO ${quoteIdentifier(tableName, dialect)} (${quotedCols})`,
      );
      lines.push("VALUES");
      data.forEach((row, i) => {
        const vals = columns
          .map((col) => escapeValue(row[col] ?? null, dialect))
          .join(", ");
        const comma = i < data.length - 1 ? "," : ";";
        lines.push(`  (${vals})${comma}`);
      });
    } else {
      for (const row of data) {
        const vals = columns
          .map((col) => escapeValue(row[col] ?? null, dialect))
          .join(", ");
        lines.push(
          `INSERT INTO ${quoteIdentifier(tableName, dialect)} (${quotedCols}) VALUES (${vals});`,
        );
      }
    }
    lines.push("");
  }

  return lines.join("\n").trimEnd();
}

const SAMPLE_USERS = `[
  { "id": 1, "name": "Alice Johnson", "email": "alice@example.com", "age": 30, "active": true },
  { "id": 2, "name": "Bob Smith", "email": "bob@example.com", "age": 25, "active": true },
  { "id": 3, "name": "Carol White", "email": "carol@example.com", "age": 35, "active": false }
]`;

const SAMPLE_PRODUCTS = `[
  { "sku": "WIDGET-001", "name": "Blue Widget", "price": 9.99, "stock": 150, "category": "Widgets" },
  { "sku": "GADGET-042", "name": "Red Gadget", "price": 24.50, "stock": 75, "category": "Gadgets" },
  { "sku": "WIDGET-002", "name": "Green Widget", "price": 12.00, "stock": 200, "category": "Widgets" },
  { "sku": "TOOL-100", "name": "Multi-Tool", "price": 49.99, "stock": 30, "category": "Tools" }
]`;

const SAMPLE_EVENTS = `[
  { "event_id": "evt_001", "user_id": 1, "type": "login", "timestamp": "2025-03-15T08:30:00Z", "metadata": { "ip": "192.168.1.1", "browser": "Chrome" } },
  { "event_id": "evt_002", "user_id": 2, "type": "purchase", "timestamp": "2025-03-15T09:15:00Z", "metadata": { "item": "WIDGET-001", "amount": 9.99 } },
  { "event_id": "evt_003", "user_id": 1, "type": "logout", "timestamp": "2025-03-15T10:00:00Z", "metadata": null }
]`;

const SAMPLE_NESTED = `[
  { "id": "550e8400-e29b-41d4-a716-446655440000", "name": "Project Alpha", "start_date": "2025-01-15", "budget": 50000, "tags": ["frontend", "react"] },
  { "id": "6ba7b810-9dad-11d1-80b4-00c04fd430c8", "name": "Project Beta", "start_date": "2025-03-01", "budget": 120000, "tags": ["backend", "api", "go"] }
]`;

const DIALECTS: { value: SqlDialect; label: string }[] = [
  { value: "postgresql", label: "PostgreSQL" },
  { value: "mysql", label: "MySQL" },
  { value: "sqlite", label: "SQLite" },
];

export default function JsonToSqlTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState<{
    rows: number;
    columns: number;
  } | null>(null);

  const [options, setOptions] = useState<SqlOptions>({
    dialect: "postgresql",
    tableName: "my_table",
    dropTable: false,
    createTable: true,
    insertData: true,
    batchInsert: true,
    ifNotExists: true,
    nullableColumns: true,
  });

  const { trackAction } = useToolAnalytics("json-to-sql");
  const { remaining, dailyLimit, isLimited, recordUsage } =
    useRateLimit("json-to-sql");

  const handleConvert = useCallback(() => {
    setError("");
    setOutput("");
    setStats(null);
    setCopied(false);

    if (!input.trim()) {
      setError("Please paste your JSON data to convert.");
      return;
    }

    if (isLimited) return;
    recordUsage();
    trackAction("json-to-sql");

    try {
      const parsed = JSON.parse(input);

      if (!Array.isArray(parsed)) {
        setError(
          'JSON must be an array of objects. e.g. [{ "id": 1, "name": "Alice" }]',
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

      if (!options.createTable && !options.insertData) {
        setError("Enable at least one of CREATE TABLE or INSERT DATA.");
        return;
      }

      const data = parsed as Record<string, unknown>[];
      const sql = generateSql(data, options);

      // Count columns
      const colSet = new Set<string>();
      for (const row of data) {
        for (const key of Object.keys(row)) colSet.add(key);
      }

      setOutput(sql);
      setStats({ rows: data.length, columns: colSet.size });
    } catch {
      setError("Invalid JSON. Check your syntax and try again.");
    }
  }, [input, options, isLimited, recordUsage, trackAction]);

  useKeyboardShortcut("Enter", handleConvert);

  function handleCopy() {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function handleDownload() {
    const blob = new Blob([output], { type: "text/sql;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${options.tableName}.sql`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function loadSample(json: string, name: string) {
    setInput(json);
    setOutput("");
    setError("");
    setStats(null);
    setOptions((prev) => ({ ...prev, tableName: name }));
  }

  function updateOption<K extends keyof SqlOptions>(
    key: K,
    value: SqlOptions[K],
  ) {
    setOptions((prev) => ({ ...prev, [key]: value }));
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
        JSON to SQL Converter
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Convert JSON arrays to SQL CREATE TABLE and INSERT statements. Supports
        PostgreSQL, MySQL, and SQLite with automatic type inference.
      </p>

      <RateLimitBanner
        remaining={remaining}
        dailyLimit={dailyLimit}
        isLimited={isLimited}
      />

      {/* Options */}
      <div className="mb-4 space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">
              Dialect:
            </label>
            <select
              value={options.dialect}
              onChange={(e) =>
                updateOption("dialect", e.target.value as SqlDialect)
              }
              className="rounded border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300"
            >
              {DIALECTS.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">
              Table:
            </label>
            <input
              type="text"
              value={options.tableName}
              onChange={(e) =>
                updateOption(
                  "tableName",
                  e.target.value.replace(/[^a-zA-Z0-9_]/g, "_") || "my_table",
                )
              }
              className="w-36 rounded border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300"
              placeholder="my_table"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
            <input
              type="checkbox"
              checked={options.createTable}
              onChange={(e) => updateOption("createTable", e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-900"
            />
            CREATE TABLE
          </label>

          <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
            <input
              type="checkbox"
              checked={options.insertData}
              onChange={(e) => updateOption("insertData", e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-900"
            />
            INSERT DATA
          </label>

          <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
            <input
              type="checkbox"
              checked={options.dropTable}
              onChange={(e) => updateOption("dropTable", e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-900"
            />
            DROP TABLE IF EXISTS
          </label>

          <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
            <input
              type="checkbox"
              checked={options.ifNotExists}
              onChange={(e) => updateOption("ifNotExists", e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-900"
            />
            IF NOT EXISTS
          </label>

          <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
            <input
              type="checkbox"
              checked={options.batchInsert}
              onChange={(e) => updateOption("batchInsert", e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-900"
            />
            Batch INSERT
          </label>

          <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
            <input
              type="checkbox"
              checked={options.nullableColumns}
              onChange={(e) => updateOption("nullableColumns", e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-900"
            />
            Nullable columns
          </label>
        </div>
      </div>

      {/* Input */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            JSON Input
          </label>
          <div className="flex gap-3">
            <button
              onClick={() => loadSample(SAMPLE_USERS, "users")}
              className="text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              Users
            </button>
            <button
              onClick={() => loadSample(SAMPLE_PRODUCTS, "products")}
              className="text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              Products
            </button>
            <button
              onClick={() => loadSample(SAMPLE_EVENTS, "events")}
              className="text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              Events
            </button>
            <button
              onClick={() => loadSample(SAMPLE_NESTED, "projects")}
              className="text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              Projects
            </button>
          </div>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={'Paste your JSON array here...\n[{ "id": 1, "name": "Alice", "email": "alice@example.com" }]'}
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
        Convert to SQL{" "}
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
                SQL Output
              </label>
              {stats && (
                <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                  {stats.columns} col{stats.columns !== 1 ? "s" : ""} &middot;{" "}
                  {stats.rows} row{stats.rows !== 1 ? "s" : ""}
                </span>
              )}
              <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                {DIALECTS.find((d) => d.value === options.dialect)?.label}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleDownload}
                className="rounded border border-gray-300 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
              >
                Download .sql
              </button>
              <button
                onClick={handleCopy}
                className="rounded border border-gray-300 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
          <pre className="max-h-[32rem] overflow-auto rounded-lg border border-gray-200 bg-white p-4 font-mono text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100">
            {output}
          </pre>
        </div>
      )}

      {/* Info */}
      <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          About JSON to SQL Conversion
        </h2>
        <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
          <li>
            Automatically infers SQL column types from JSON values — integers,
            floats, booleans, dates, UUIDs, and text.
          </li>
          <li>
            Supports PostgreSQL, MySQL, and SQLite with dialect-specific syntax
            (quoting, types, booleans).
          </li>
          <li>
            Generates CREATE TABLE with NOT NULL constraints and INSERT
            statements with proper escaping.
          </li>
          <li>
            Batch INSERT mode combines all rows into a single statement for
            faster bulk loading.
          </li>
          <li>
            Nested objects and arrays are serialized as JSON/JSONB (PostgreSQL)
            or TEXT (SQLite).
          </li>
          <li>
            Everything runs in your browser — no data is sent over the network.
          </li>
        </ul>
      </div>
    </div>
  );
}
