"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";
import RateLimitBanner from "@/components/RateLimitBanner";

interface QueryResult {
  columns: string[];
  values: (string | number | null | Uint8Array)[][];
}

interface QueryOutput {
  type: "result" | "error" | "info";
  message?: string;
  result?: QueryResult;
  time?: number;
}

type SqlJsDatabase = {
  run: (sql: string) => void;
  exec: (sql: string) => QueryResult[];
  close: () => void;
};

type SqlJsStatic = {
  Database: new () => SqlJsDatabase;
};

const SAMPLES: { label: string; sql: string }[] = [
  {
    label: "Create & Query",
    sql: `-- Create a sample table
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  age INTEGER,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Insert sample data
INSERT INTO users (name, email, age) VALUES
  ('Alice Johnson', 'alice@example.com', 30),
  ('Bob Smith', 'bob@example.com', 25),
  ('Carol White', 'carol@example.com', 35),
  ('Dave Brown', 'dave@example.com', 28),
  ('Eve Davis', 'eve@example.com', 32);

-- Query the data
SELECT * FROM users ORDER BY age;`,
  },
  {
    label: "JOINs",
    sql: `-- Create tables with relationships
CREATE TABLE departments (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE employees (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  department_id INTEGER,
  salary REAL,
  FOREIGN KEY (department_id) REFERENCES departments(id)
);

INSERT INTO departments VALUES (1, 'Engineering'), (2, 'Marketing'), (3, 'Sales');

INSERT INTO employees (name, department_id, salary) VALUES
  ('Alice', 1, 95000), ('Bob', 1, 88000),
  ('Carol', 2, 72000), ('Dave', 3, 68000),
  ('Eve', 1, 105000), ('Frank', 2, 76000);

-- INNER JOIN
SELECT e.name, d.name AS department, e.salary
FROM employees e
INNER JOIN departments d ON e.department_id = d.id
ORDER BY e.salary DESC;`,
  },
  {
    label: "Aggregations",
    sql: `CREATE TABLE orders (
  id INTEGER PRIMARY KEY,
  customer TEXT NOT NULL,
  product TEXT NOT NULL,
  quantity INTEGER,
  price REAL,
  order_date TEXT
);

INSERT INTO orders (customer, product, quantity, price, order_date) VALUES
  ('Alice', 'Widget', 5, 9.99, '2024-01-15'),
  ('Bob', 'Gadget', 2, 24.99, '2024-01-16'),
  ('Alice', 'Gadget', 1, 24.99, '2024-01-17'),
  ('Carol', 'Widget', 10, 9.99, '2024-02-01'),
  ('Bob', 'Doohickey', 3, 14.99, '2024-02-05'),
  ('Alice', 'Widget', 2, 9.99, '2024-02-10'),
  ('Carol', 'Gadget', 4, 24.99, '2024-02-15'),
  ('Dave', 'Widget', 7, 9.99, '2024-03-01');

-- Aggregate queries
SELECT customer, COUNT(*) AS orders, SUM(quantity * price) AS total_spent
FROM orders
GROUP BY customer
ORDER BY total_spent DESC;

SELECT product, SUM(quantity) AS total_sold, ROUND(AVG(price), 2) AS avg_price
FROM orders
GROUP BY product
HAVING total_sold > 5;`,
  },
  {
    label: "Window Functions",
    sql: `CREATE TABLE sales (
  id INTEGER PRIMARY KEY,
  salesperson TEXT,
  region TEXT,
  amount REAL,
  sale_date TEXT
);

INSERT INTO sales (salesperson, region, amount, sale_date) VALUES
  ('Alice', 'North', 1200, '2024-01-05'),
  ('Bob', 'South', 800, '2024-01-10'),
  ('Alice', 'North', 1500, '2024-01-15'),
  ('Carol', 'East', 950, '2024-01-20'),
  ('Bob', 'South', 1100, '2024-02-01'),
  ('Alice', 'North', 1800, '2024-02-10'),
  ('Carol', 'East', 1300, '2024-02-15'),
  ('Dave', 'West', 700, '2024-02-20'),
  ('Bob', 'South', 900, '2024-03-01'),
  ('Carol', 'East', 1600, '2024-03-05');

-- Window functions: running total and rank
SELECT
  salesperson,
  amount,
  sale_date,
  SUM(amount) OVER (PARTITION BY salesperson ORDER BY sale_date) AS running_total,
  RANK() OVER (ORDER BY amount DESC) AS amount_rank,
  ROW_NUMBER() OVER (PARTITION BY salesperson ORDER BY sale_date) AS sale_num
FROM sales
ORDER BY salesperson, sale_date;`,
  },
  {
    label: "Subqueries & CTEs",
    sql: `CREATE TABLE products (
  id INTEGER PRIMARY KEY,
  name TEXT,
  category TEXT,
  price REAL,
  stock INTEGER
);

INSERT INTO products (name, category, price, stock) VALUES
  ('Laptop', 'Electronics', 999.99, 50),
  ('Phone', 'Electronics', 699.99, 120),
  ('Tablet', 'Electronics', 499.99, 80),
  ('Desk', 'Furniture', 299.99, 30),
  ('Chair', 'Furniture', 199.99, 45),
  ('Monitor', 'Electronics', 349.99, 60),
  ('Keyboard', 'Accessories', 79.99, 200),
  ('Mouse', 'Accessories', 49.99, 250),
  ('Headset', 'Accessories', 129.99, 90),
  ('Bookshelf', 'Furniture', 149.99, 25);

-- CTE with category stats
WITH category_stats AS (
  SELECT category,
    COUNT(*) AS num_products,
    ROUND(AVG(price), 2) AS avg_price,
    SUM(stock) AS total_stock
  FROM products
  GROUP BY category
)
SELECT * FROM category_stats ORDER BY avg_price DESC;

-- Subquery: products above their category average price
SELECT name, category, price,
  (SELECT ROUND(AVG(p2.price), 2) FROM products p2 WHERE p2.category = products.category) AS category_avg
FROM products
WHERE price > (SELECT AVG(p2.price) FROM products p2 WHERE p2.category = products.category)
ORDER BY category, price DESC;`,
  },
];

async function initSqlJs(): Promise<SqlJsStatic> {
  const initModule = await import("sql.js").then(
    (m) => m.default || m
  );
  return initModule({
    locateFile: () => "/sql-wasm.wasm",
  });
}

function formatCellValue(val: string | number | null | Uint8Array): string {
  if (val === null) return "NULL";
  if (val instanceof Uint8Array) return `[BLOB ${val.length} bytes]`;
  return String(val);
}

export default function SQLPlaygroundTool() {
  const [sql, setSql] = useState(SAMPLES[0].sql);
  const [outputs, setOutputs] = useState<QueryOutput[]>([]);
  const [running, setRunning] = useState(false);
  const [dbReady, setDbReady] = useState(false);
  const [dbError, setDbError] = useState("");
  const [schema, setSchema] = useState<{ name: string; sql: string }[]>([]);
  const [showSchema, setShowSchema] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const sqlJsRef = useRef<SqlJsStatic | null>(null);
  const dbRef = useRef<SqlJsDatabase | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { remaining, dailyLimit, isLimited, recordUsage } = useRateLimit("sql-playground");
  const { trackAction } = useToolAnalytics("sql-playground");

  // Initialize sql.js on mount
  useEffect(() => {
    initSqlJs()
      .then((SQL) => {
        sqlJsRef.current = SQL;
        dbRef.current = new SQL.Database();
        setDbReady(true);
      })
      .catch((err) => {
        setDbError(`Failed to load SQLite engine: ${err.message}`);
      });

    return () => {
      dbRef.current?.close();
    };
  }, []);

  const refreshSchema = useCallback(() => {
    if (!dbRef.current) return;
    try {
      const results = dbRef.current.exec(
        "SELECT name, sql FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name"
      );
      if (results.length > 0) {
        setSchema(
          results[0].values.map((row) => ({
            name: String(row[0]),
            sql: String(row[1]),
          }))
        );
      } else {
        setSchema([]);
      }
    } catch {
      setSchema([]);
    }
  }, []);

  const runQuery = useCallback(() => {
    if (!dbRef.current || isLimited || running) return;

    const trimmed = sql.trim();
    if (!trimmed) return;

    recordUsage();
    trackAction("run-query");
    setRunning(true);

    // Add to history (avoid duplicates at top)
    setHistory((prev) => {
      const filtered = prev.filter((h) => h !== trimmed);
      return [trimmed, ...filtered].slice(0, 20);
    });

    const newOutputs: QueryOutput[] = [];

    // Split statements, handling semicolons inside strings
    const statements = splitStatements(trimmed);

    for (const stmt of statements) {
      const s = stmt.trim();
      if (!s) continue;

      const t0 = performance.now();
      try {
        const results = dbRef.current.exec(s);
        const dt = performance.now() - t0;

        if (results.length > 0) {
          for (const result of results) {
            newOutputs.push({ type: "result", result, time: dt });
          }
        } else {
          // DDL/DML statement with no result set
          const upper = s.toUpperCase();
          if (
            upper.startsWith("INSERT") ||
            upper.startsWith("UPDATE") ||
            upper.startsWith("DELETE")
          ) {
            const changes = dbRef.current.exec(
              "SELECT changes() AS affected_rows"
            );
            const rows =
              changes.length > 0 ? changes[0].values[0][0] : 0;
            newOutputs.push({
              type: "info",
              message: `${rows} row(s) affected`,
              time: dt,
            });
          } else {
            newOutputs.push({
              type: "info",
              message: "Statement executed successfully",
              time: dt,
            });
          }
        }
      } catch (err) {
        const dt = performance.now() - t0;
        newOutputs.push({
          type: "error",
          message: err instanceof Error ? err.message : String(err),
          time: dt,
        });
      }
    }

    setOutputs(newOutputs);
    refreshSchema();
    setRunning(false);
  }, [sql, isLimited, running, recordUsage, trackAction, refreshSchema]);

  const resetDatabase = useCallback(() => {
    if (!sqlJsRef.current) return;
    dbRef.current?.close();
    dbRef.current = new sqlJsRef.current.Database();
    setOutputs([]);
    setSchema([]);
    trackAction("reset-db");
  }, [trackAction]);

  const loadSample = useCallback(
    (sampleSql: string) => {
      // Reset DB for clean sample
      if (sqlJsRef.current) {
        dbRef.current?.close();
        dbRef.current = new sqlJsRef.current.Database();
        setSchema([]);
      }
      setSql(sampleSql);
      setOutputs([]);
      trackAction("load-sample");
    },
    [trackAction]
  );

  const copyOutput = useCallback(() => {
    const text = outputs
      .map((o) => {
        if (o.type === "error") return `ERROR: ${o.message}`;
        if (o.type === "info") return o.message;
        if (o.result) {
          const { columns, values } = o.result;
          const header = columns.join("\t");
          const rows = values.map((r) => r.map(formatCellValue).join("\t"));
          return [header, ...rows].join("\n");
        }
        return "";
      })
      .join("\n\n");
    navigator.clipboard.writeText(text);
    trackAction("copy-output");
  }, [outputs, trackAction]);

  useKeyboardShortcut("Enter", runQuery);

  if (dbError) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 text-center">
          <p className="text-red-400 font-medium">{dbError}</p>
          <p className="text-zinc-400 text-sm mt-2">
            Try refreshing the page. The SQLite WebAssembly engine failed to
            load.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <RateLimitBanner remaining={remaining} dailyLimit={dailyLimit} isLimited={isLimited} />

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <button
          onClick={runQuery}
          disabled={!dbReady || isLimited || running || !sql.trim()}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
        >
          {running ? (
            <>
              <span className="animate-spin">⟳</span> Running…
            </>
          ) : (
            <>▶ Run (Ctrl+Enter)</>
          )}
        </button>

        <button
          onClick={resetDatabase}
          disabled={!dbReady}
          className="px-3 py-2 bg-zinc-700 hover:bg-zinc-600 disabled:bg-zinc-800 disabled:text-zinc-600 text-zinc-300 rounded-lg text-sm transition-colors"
        >
          Reset DB
        </button>

        <button
          onClick={() => setShowSchema((v) => !v)}
          className={`px-3 py-2 rounded-lg text-sm transition-colors ${
            showSchema
              ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
              : "bg-zinc-700 hover:bg-zinc-600 text-zinc-300"
          }`}
        >
          Schema {schema.length > 0 && `(${schema.length})`}
        </button>

        <button
          onClick={() => setShowHistory((v) => !v)}
          className={`px-3 py-2 rounded-lg text-sm transition-colors ${
            showHistory
              ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
              : "bg-zinc-700 hover:bg-zinc-600 text-zinc-300"
          }`}
        >
          History {history.length > 0 && `(${history.length})`}
        </button>

        {outputs.length > 0 && (
          <button
            onClick={copyOutput}
            className="px-3 py-2 bg-zinc-700 hover:bg-zinc-600 text-zinc-300 rounded-lg text-sm transition-colors ml-auto"
          >
            Copy Results
          </button>
        )}
      </div>

      {/* Sample buttons */}
      <div className="flex flex-wrap gap-2 mb-3">
        <span className="text-xs text-zinc-500 self-center">Samples:</span>
        {SAMPLES.map((s) => (
          <button
            key={s.label}
            onClick={() => loadSample(s.sql)}
            className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 rounded text-xs border border-zinc-700 hover:border-zinc-600 transition-colors"
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Loading state */}
      {!dbReady && !dbError && (
        <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-6 text-center mb-4">
          <p className="text-zinc-400 animate-pulse">
            Loading SQLite engine…
          </p>
        </div>
      )}

      {/* Schema panel */}
      {showSchema && (
        <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4 mb-3">
          <h3 className="text-sm font-medium text-zinc-300 mb-2">
            Current Schema
          </h3>
          {schema.length === 0 ? (
            <p className="text-xs text-zinc-500">
              No tables yet. Run a CREATE TABLE statement.
            </p>
          ) : (
            <div className="space-y-2">
              {schema.map((t) => (
                <details key={t.name} className="group">
                  <summary className="cursor-pointer text-sm text-blue-400 hover:text-blue-300">
                    {t.name}
                  </summary>
                  <pre className="mt-1 text-xs text-zinc-400 bg-zinc-900/50 rounded p-2 overflow-x-auto">
                    {t.sql}
                  </pre>
                </details>
              ))}
            </div>
          )}
        </div>
      )}

      {/* History panel */}
      {showHistory && (
        <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4 mb-3">
          <h3 className="text-sm font-medium text-zinc-300 mb-2">
            Query History
          </h3>
          {history.length === 0 ? (
            <p className="text-xs text-zinc-500">No queries run yet.</p>
          ) : (
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {history.map((h, i) => (
                <button
                  key={i}
                  onClick={() => setSql(h)}
                  className="block w-full text-left px-2 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/50 rounded truncate transition-colors"
                >
                  {h.slice(0, 120)}
                  {h.length > 120 ? "…" : ""}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Main layout: Editor + Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* SQL Editor */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">
            SQL Editor
          </label>
          <textarea
            ref={textareaRef}
            value={sql}
            onChange={(e) => setSql(e.target.value)}
            className="w-full h-80 bg-zinc-900 border border-zinc-700 rounded-lg p-4 text-sm text-zinc-100 font-mono resize-y focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 placeholder-zinc-600"
            placeholder="Enter SQL statements here..."
            spellCheck={false}
          />
          <div className="flex justify-between text-xs text-zinc-500 mt-1">
            <span>SQLite dialect • Multiple statements supported</span>
            <span>{sql.length} chars</span>
          </div>
        </div>

        {/* Results */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">
            Results
          </label>
          <div className="h-80 bg-zinc-900 border border-zinc-700 rounded-lg overflow-auto">
            {outputs.length === 0 ? (
              <div className="h-full flex items-center justify-center text-zinc-500 text-sm">
                Run a query to see results
              </div>
            ) : (
              <div className="divide-y divide-zinc-800">
                {outputs.map((output, i) => (
                  <div key={i} className="p-3">
                    {output.type === "error" && (
                      <div className="text-red-400 text-sm font-mono">
                        <span className="text-red-500 font-bold">
                          ERROR:{" "}
                        </span>
                        {output.message}
                      </div>
                    )}
                    {output.type === "info" && (
                      <div className="text-emerald-400 text-sm font-mono flex items-center justify-between">
                        <span>{output.message}</span>
                        {output.time !== undefined && (
                          <span className="text-zinc-500 text-xs">
                            {output.time.toFixed(1)}ms
                          </span>
                        )}
                      </div>
                    )}
                    {output.type === "result" && output.result && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-zinc-500">
                            {output.result.values.length} row
                            {output.result.values.length !== 1 ? "s" : ""}
                            {" × "}
                            {output.result.columns.length} column
                            {output.result.columns.length !== 1 ? "s" : ""}
                          </span>
                          {output.time !== undefined && (
                            <span className="text-xs text-zinc-500">
                              {output.time.toFixed(1)}ms
                            </span>
                          )}
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm text-left">
                            <thead>
                              <tr className="border-b border-zinc-700">
                                {output.result.columns.map((col, ci) => (
                                  <th
                                    key={ci}
                                    className="px-3 py-1.5 text-xs font-semibold text-blue-400 bg-zinc-800/50 whitespace-nowrap"
                                  >
                                    {col}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {output.result.values.map((row, ri) => (
                                <tr
                                  key={ri}
                                  className="border-b border-zinc-800/50 hover:bg-zinc-800/30"
                                >
                                  {row.map((cell, ci) => (
                                    <td
                                      key={ci}
                                      className={`px-3 py-1.5 text-xs font-mono whitespace-nowrap ${
                                        cell === null
                                          ? "text-zinc-600 italic"
                                          : typeof cell === "number"
                                            ? "text-amber-400"
                                            : "text-zinc-300"
                                      }`}
                                    >
                                      {formatCellValue(cell)}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick reference */}
      <div className="mt-8 bg-zinc-800/50 border border-zinc-700 rounded-lg p-5">
        <h2 className="text-lg font-semibold text-zinc-100 mb-3">
          SQLite Quick Reference
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div>
            <h3 className="text-blue-400 font-medium mb-1.5">Data Definition</h3>
            <pre className="text-xs text-zinc-400 bg-zinc-900/50 rounded p-2 overflow-x-auto">{`CREATE TABLE t (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  val REAL DEFAULT 0
);
ALTER TABLE t ADD col TEXT;
DROP TABLE IF EXISTS t;`}</pre>
          </div>
          <div>
            <h3 className="text-blue-400 font-medium mb-1.5">Queries</h3>
            <pre className="text-xs text-zinc-400 bg-zinc-900/50 rounded p-2 overflow-x-auto">{`SELECT * FROM t WHERE x > 5;
SELECT a, COUNT(*) FROM t
  GROUP BY a HAVING COUNT(*) > 1;
SELECT * FROM t1
  JOIN t2 ON t1.id = t2.fk;`}</pre>
          </div>
          <div>
            <h3 className="text-blue-400 font-medium mb-1.5">Data Manipulation</h3>
            <pre className="text-xs text-zinc-400 bg-zinc-900/50 rounded p-2 overflow-x-auto">{`INSERT INTO t (a, b)
  VALUES (1, 'x'), (2, 'y');
UPDATE t SET a = 10 WHERE id = 1;
DELETE FROM t WHERE a IS NULL;`}</pre>
          </div>
          <div>
            <h3 className="text-blue-400 font-medium mb-1.5">Functions</h3>
            <pre className="text-xs text-zinc-400 bg-zinc-900/50 rounded p-2 overflow-x-auto">{`COUNT, SUM, AVG, MIN, MAX
LENGTH, UPPER, LOWER, TRIM
SUBSTR, REPLACE, INSTR
COALESCE, NULLIF, IIF
date, time, datetime, strftime`}</pre>
          </div>
          <div>
            <h3 className="text-blue-400 font-medium mb-1.5">Window Functions</h3>
            <pre className="text-xs text-zinc-400 bg-zinc-900/50 rounded p-2 overflow-x-auto">{`ROW_NUMBER() OVER (
  PARTITION BY col
  ORDER BY col2
)
RANK, DENSE_RANK, NTILE
LAG, LEAD, FIRST_VALUE`}</pre>
          </div>
          <div>
            <h3 className="text-blue-400 font-medium mb-1.5">CTEs & Subqueries</h3>
            <pre className="text-xs text-zinc-400 bg-zinc-900/50 rounded p-2 overflow-x-auto">{`WITH cte AS (
  SELECT a, COUNT(*) AS cnt
  FROM t GROUP BY a
)
SELECT * FROM cte
  WHERE cnt > 1;`}</pre>
          </div>
        </div>
      </div>

      {/* Features / How it works */}
      <div className="mt-6 bg-zinc-800/50 border border-zinc-700 rounded-lg p-5">
        <h2 className="text-lg font-semibold text-zinc-100 mb-3">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-zinc-400">
          <div>
            <h3 className="text-zinc-200 font-medium mb-1">
              In-Browser SQLite
            </h3>
            <p>
              This playground runs a complete SQLite database engine in your
              browser using WebAssembly. No server required — your queries and
              data never leave your device.
            </p>
          </div>
          <div>
            <h3 className="text-zinc-200 font-medium mb-1">
              Full SQL Support
            </h3>
            <p>
              Supports CREATE, INSERT, UPDATE, DELETE, SELECT with JOINs,
              subqueries, CTEs, window functions, aggregations, indexes, views,
              triggers, and more.
            </p>
          </div>
          <div>
            <h3 className="text-zinc-200 font-medium mb-1">
              Multiple Statements
            </h3>
            <p>
              Run multiple SQL statements in sequence separated by semicolons.
              Each statement&apos;s results display separately with execution timing.
            </p>
          </div>
          <div>
            <h3 className="text-zinc-200 font-medium mb-1">
              Schema Inspector
            </h3>
            <p>
              Click &quot;Schema&quot; to view all tables in your database with their
              CREATE TABLE definitions. Useful for checking column names and
              types.
            </p>
          </div>
        </div>
      </div>

      {/* Privacy note */}
      <p className="mt-4 text-xs text-zinc-500 text-center">
        Powered by{" "}
        <Link
          href="https://sql.js.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300"
        >
          sql.js
        </Link>{" "}
        (SQLite compiled to WebAssembly). Your SQL and data are processed
        entirely in your browser — nothing is sent to any server. Database
        resets when you refresh the page.
      </p>
    </div>
  );
}

/**
 * Split SQL text into individual statements, respecting string literals
 * so semicolons inside strings are not treated as delimiters.
 */
function splitStatements(sql: string): string[] {
  const statements: string[] = [];
  let current = "";
  let inSingle = false;
  let inDouble = false;
  let i = 0;

  while (i < sql.length) {
    const ch = sql[i];

    if (ch === "'" && !inDouble) {
      // Handle escaped single quotes ('')
      if (inSingle && i + 1 < sql.length && sql[i + 1] === "'") {
        current += "''";
        i += 2;
        continue;
      }
      inSingle = !inSingle;
      current += ch;
    } else if (ch === '"' && !inSingle) {
      inDouble = !inDouble;
      current += ch;
    } else if (ch === ";" && !inSingle && !inDouble) {
      const trimmed = current.trim();
      if (trimmed) statements.push(trimmed);
      current = "";
    } else if (ch === "-" && sql[i + 1] === "-" && !inSingle && !inDouble) {
      // Skip line comments
      const lineEnd = sql.indexOf("\n", i);
      if (lineEnd === -1) {
        i = sql.length;
        continue;
      }
      i = lineEnd + 1;
      continue;
    } else if (ch === "/" && sql[i + 1] === "*" && !inSingle && !inDouble) {
      // Skip block comments
      const blockEnd = sql.indexOf("*/", i + 2);
      if (blockEnd === -1) {
        i = sql.length;
        continue;
      }
      i = blockEnd + 2;
      continue;
    } else {
      current += ch;
    }
    i++;
  }

  const trimmed = current.trim();
  if (trimmed) statements.push(trimmed);

  return statements;
}
