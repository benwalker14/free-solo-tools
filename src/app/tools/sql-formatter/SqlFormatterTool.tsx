"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";
import RateLimitBanner from "@/components/RateLimitBanner";

// SQL keywords grouped by formatting behavior
const MAJOR_KEYWORDS = [
  "SELECT",
  "FROM",
  "WHERE",
  "SET",
  "JOIN",
  "LEFT JOIN",
  "RIGHT JOIN",
  "INNER JOIN",
  "OUTER JOIN",
  "FULL JOIN",
  "FULL OUTER JOIN",
  "LEFT OUTER JOIN",
  "RIGHT OUTER JOIN",
  "CROSS JOIN",
  "NATURAL JOIN",
  "ON",
  "ORDER BY",
  "GROUP BY",
  "HAVING",
  "LIMIT",
  "OFFSET",
  "UNION",
  "UNION ALL",
  "INTERSECT",
  "EXCEPT",
  "INSERT INTO",
  "VALUES",
  "UPDATE",
  "DELETE FROM",
  "CREATE TABLE",
  "CREATE INDEX",
  "CREATE VIEW",
  "ALTER TABLE",
  "DROP TABLE",
  "DROP INDEX",
  "DROP VIEW",
  "RETURNING",
  "WITH",
  "CASE",
  "WHEN",
  "THEN",
  "ELSE",
  "END",
  "INTO",
  "FETCH",
  "FOR",
  "WINDOW",
];

const INDENT_KEYWORDS = ["AND", "OR"];

const ALL_KEYWORDS = [
  ...MAJOR_KEYWORDS,
  ...INDENT_KEYWORDS,
  "AS",
  "IN",
  "NOT",
  "NULL",
  "IS",
  "LIKE",
  "ILIKE",
  "BETWEEN",
  "EXISTS",
  "ALL",
  "ANY",
  "SOME",
  "TRUE",
  "FALSE",
  "ASC",
  "DESC",
  "DISTINCT",
  "COUNT",
  "SUM",
  "AVG",
  "MIN",
  "MAX",
  "COALESCE",
  "NULLIF",
  "CAST",
  "IF",
  "THEN",
  "ELSE",
  "ELSIF",
  "BEGIN",
  "COMMIT",
  "ROLLBACK",
  "SAVEPOINT",
  "GRANT",
  "REVOKE",
  "PRIMARY KEY",
  "FOREIGN KEY",
  "REFERENCES",
  "CONSTRAINT",
  "DEFAULT",
  "CHECK",
  "UNIQUE",
  "INDEX",
  "TABLE",
  "VIEW",
  "DATABASE",
  "SCHEMA",
  "CASCADE",
  "RESTRICT",
  "TRIGGER",
  "PROCEDURE",
  "FUNCTION",
  "RETURN",
  "DECLARE",
  "CURSOR",
  "OPEN",
  "CLOSE",
  "LATERAL",
  "OVER",
  "PARTITION BY",
  "ROWS",
  "RANGE",
  "UNBOUNDED",
  "PRECEDING",
  "FOLLOWING",
  "CURRENT ROW",
];

interface Token {
  type: "keyword" | "string" | "number" | "identifier" | "operator" | "punctuation" | "comment" | "whitespace";
  value: string;
  upper?: string;
}

function tokenize(sql: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < sql.length) {
    // Whitespace
    if (/\s/.test(sql[i])) {
      let ws = "";
      while (i < sql.length && /\s/.test(sql[i])) {
        ws += sql[i];
        i++;
      }
      tokens.push({ type: "whitespace", value: ws });
      continue;
    }

    // Single-line comment --
    if (sql[i] === "-" && sql[i + 1] === "-") {
      let comment = "";
      while (i < sql.length && sql[i] !== "\n") {
        comment += sql[i];
        i++;
      }
      tokens.push({ type: "comment", value: comment });
      continue;
    }

    // Multi-line comment /* */
    if (sql[i] === "/" && sql[i + 1] === "*") {
      let comment = "/*";
      i += 2;
      while (i < sql.length && !(sql[i] === "*" && sql[i + 1] === "/")) {
        comment += sql[i];
        i++;
      }
      if (i < sql.length) {
        comment += "*/";
        i += 2;
      }
      tokens.push({ type: "comment", value: comment });
      continue;
    }

    // Single-quoted string
    if (sql[i] === "'") {
      let str = "'";
      i++;
      while (i < sql.length) {
        if (sql[i] === "'" && sql[i + 1] === "'") {
          str += "''";
          i += 2;
        } else if (sql[i] === "'") {
          str += "'";
          i++;
          break;
        } else {
          str += sql[i];
          i++;
        }
      }
      tokens.push({ type: "string", value: str });
      continue;
    }

    // Double-quoted identifier
    if (sql[i] === '"') {
      let str = '"';
      i++;
      while (i < sql.length && sql[i] !== '"') {
        str += sql[i];
        i++;
      }
      if (i < sql.length) {
        str += '"';
        i++;
      }
      tokens.push({ type: "identifier", value: str });
      continue;
    }

    // Backtick-quoted identifier (MySQL)
    if (sql[i] === "`") {
      let str = "`";
      i++;
      while (i < sql.length && sql[i] !== "`") {
        str += sql[i];
        i++;
      }
      if (i < sql.length) {
        str += "`";
        i++;
      }
      tokens.push({ type: "identifier", value: str });
      continue;
    }

    // Numbers
    if (/\d/.test(sql[i]) || (sql[i] === "." && i + 1 < sql.length && /\d/.test(sql[i + 1]))) {
      let num = "";
      while (i < sql.length && /[\d.eE+-]/.test(sql[i])) {
        num += sql[i];
        i++;
      }
      tokens.push({ type: "number", value: num });
      continue;
    }

    // Operators (multi-char)
    if (sql[i] === "<" && sql[i + 1] === ">") {
      tokens.push({ type: "operator", value: "<>" });
      i += 2;
      continue;
    }
    if (sql[i] === "<" && sql[i + 1] === "=") {
      tokens.push({ type: "operator", value: "<=" });
      i += 2;
      continue;
    }
    if (sql[i] === ">" && sql[i + 1] === "=") {
      tokens.push({ type: "operator", value: ">=" });
      i += 2;
      continue;
    }
    if (sql[i] === "!" && sql[i + 1] === "=") {
      tokens.push({ type: "operator", value: "!=" });
      i += 2;
      continue;
    }
    if (sql[i] === "|" && sql[i + 1] === "|") {
      tokens.push({ type: "operator", value: "||" });
      i += 2;
      continue;
    }
    if (sql[i] === ":" && sql[i + 1] === ":") {
      tokens.push({ type: "operator", value: "::" });
      i += 2;
      continue;
    }

    // Single-char operators and punctuation
    if ("=<>+-*/%&|^~".includes(sql[i])) {
      tokens.push({ type: "operator", value: sql[i] });
      i++;
      continue;
    }

    if ("(),;.".includes(sql[i])) {
      tokens.push({ type: "punctuation", value: sql[i] });
      i++;
      continue;
    }

    // Words (keywords or identifiers)
    if (/[a-zA-Z_@#]/.test(sql[i])) {
      let word = "";
      while (i < sql.length && /[a-zA-Z0-9_@#$]/.test(sql[i])) {
        word += sql[i];
        i++;
      }
      const upper = word.toUpperCase();
      if (ALL_KEYWORDS.includes(upper)) {
        tokens.push({ type: "keyword", value: word, upper });
      } else {
        tokens.push({ type: "identifier", value: word });
      }
      continue;
    }

    // Anything else — pass through
    tokens.push({ type: "operator", value: sql[i] });
    i++;
  }

  return tokens;
}

// Merge adjacent keyword tokens for multi-word keywords like "LEFT JOIN", "ORDER BY", etc.
function mergeMultiWordKeywords(tokens: Token[]): Token[] {
  const result: Token[] = [];
  const nonWsTokens = tokens.filter((t) => t.type !== "whitespace");
  let tokenIndex = 0;

  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i].type === "whitespace") {
      result.push(tokens[i]);
      continue;
    }

    if (tokens[i].type === "keyword") {
      const upper = tokens[i].upper || tokens[i].value.toUpperCase();

      // Look ahead (skipping whitespace) for multi-word keywords
      const nextNonWsIdx = tokenIndex + 1;
      const nextNonWs = nonWsTokens[nextNonWsIdx];

      if (nextNonWs && nextNonWs.type === "keyword") {
        const combined = upper + " " + (nextNonWs.upper || nextNonWs.value.toUpperCase());
        const tripleCheck = () => {
          const thirdNonWs = nonWsTokens[nextNonWsIdx + 1];
          if (thirdNonWs && thirdNonWs.type === "keyword") {
            return combined + " " + (thirdNonWs.upper || thirdNonWs.value.toUpperCase());
          }
          return null;
        };

        const triple = tripleCheck();
        if (triple && [...MAJOR_KEYWORDS, ...ALL_KEYWORDS].includes(triple)) {
          // Skip whitespace and next two keyword tokens
          result.push({ type: "keyword", value: triple, upper: triple });
          // Skip forward past the merged tokens
          let skip = 2; // need to skip 2 more keyword tokens (and their interleaving whitespace)
          let j = i + 1;
          while (j < tokens.length && skip > 0) {
            if (tokens[j].type !== "whitespace") skip--;
            j++;
          }
          i = j - 1;
          tokenIndex += 3;
          continue;
        }

        if ([...MAJOR_KEYWORDS, ...ALL_KEYWORDS].includes(combined)) {
          result.push({ type: "keyword", value: combined, upper: combined });
          // Skip whitespace and next keyword token
          let skip = 1;
          let j = i + 1;
          while (j < tokens.length && skip > 0) {
            if (tokens[j].type !== "whitespace") skip--;
            j++;
          }
          i = j - 1;
          tokenIndex += 2;
          continue;
        }
      }
    }

    result.push(tokens[i]);
    tokenIndex++;
  }

  return result;
}

type KeywordCase = "upper" | "lower" | "preserve";

function formatSql(sql: string, indent: string, keywordCase: KeywordCase): string {
  const rawTokens = tokenize(sql);
  const tokens = mergeMultiWordKeywords(rawTokens);
  // Filter out whitespace — we'll re-insert our own
  const meaningful = tokens.filter((t) => t.type !== "whitespace");

  if (meaningful.length === 0) return "";

  let result = "";
  let depth = 0;
  let newline = true;
  let inSelect = false;

  function addNewline() {
    result = result.trimEnd();
    result += "\n" + indent.repeat(depth);
    newline = true;
  }

  function applyCase(token: Token): string {
    if (token.type !== "keyword") return token.value;
    const upper = token.upper || token.value.toUpperCase();
    if (keywordCase === "upper") return upper;
    if (keywordCase === "lower") return upper.toLowerCase();
    return token.value;
  }

  for (let i = 0; i < meaningful.length; i++) {
    const token = meaningful[i];
    const upper = token.upper || token.value.toUpperCase();
    const prev = i > 0 ? meaningful[i - 1] : null;

    if (token.type === "comment") {
      if (!newline) addNewline();
      result += token.value;
      addNewline();
      continue;
    }

    if (token.type === "keyword" && MAJOR_KEYWORDS.includes(upper)) {
      // Track SELECT context for comma handling
      if (upper === "SELECT") inSelect = true;
      if (["FROM", "WHERE", "INTO", "SET", "VALUES", "RETURNING"].includes(upper)) inSelect = false;

      // CASE/END handle their own indentation
      if (upper === "CASE") {
        if (!newline) result += " ";
        result += applyCase(token);
        depth++;
        addNewline();
        continue;
      }
      if (upper === "WHEN" || upper === "THEN" || upper === "ELSE") {
        addNewline();
        result += applyCase(token);
        continue;
      }
      if (upper === "END") {
        depth = Math.max(0, depth - 1);
        addNewline();
        result += applyCase(token);
        continue;
      }

      // All other major keywords start a new line
      if (i > 0) addNewline();
      result += applyCase(token);
      newline = false;
      continue;
    }

    if (token.type === "keyword" && INDENT_KEYWORDS.includes(upper)) {
      addNewline();
      result += indent + applyCase(token);
      newline = false;
      continue;
    }

    // Punctuation handling
    if (token.type === "punctuation") {
      if (token.value === "(") {
        if (!newline) result += " ";
        result += "(";
        depth++;
        addNewline();
        newline = true;
        continue;
      }
      if (token.value === ")") {
        depth = Math.max(0, depth - 1);
        addNewline();
        result += ")";
        newline = false;
        continue;
      }
      if (token.value === ",") {
        result += ",";
        if (inSelect) {
          addNewline();
        }
        newline = false;
        continue;
      }
      if (token.value === ";") {
        result += ";";
        result += "\n";
        newline = true;
        inSelect = false;
        continue;
      }
      if (token.value === ".") {
        result += ".";
        newline = false;
        continue;
      }
    }

    // Everything else — add with spacing
    if (!newline && prev && prev.type === "punctuation" && prev.value === ".") {
      // No space after dot (table.column)
      result += applyCase(token);
    } else if (!newline) {
      result += " " + applyCase(token);
    } else {
      result += applyCase(token);
      newline = false;
    }
  }

  return result.trim();
}

function minifySql(sql: string): string {
  const tokens = tokenize(sql);
  let result = "";
  let prevNonWs: Token | null = null;

  for (const token of tokens) {
    if (token.type === "whitespace") {
      // Replace all whitespace with a single space (needed between keywords/identifiers)
      if (prevNonWs && prevNonWs.type !== "punctuation" && prevNonWs.value !== "(" && prevNonWs.value !== ".") {
        result += " ";
      }
      continue;
    }
    if (token.type === "comment") {
      // Strip comments in minified output
      continue;
    }
    // Remove space before dot and after dot
    if (token.type === "punctuation" && token.value === ".") {
      result = result.trimEnd();
      result += ".";
      prevNonWs = token;
      continue;
    }
    if (prevNonWs && prevNonWs.type === "punctuation" && prevNonWs.value === ".") {
      result = result.trimEnd();
    }
    // Remove space after opening paren
    if (prevNonWs && prevNonWs.type === "punctuation" && prevNonWs.value === "(") {
      result = result.trimEnd();
    }
    // Remove space before closing paren, comma, semicolon
    if (token.type === "punctuation" && [")", ",", ";"].includes(token.value)) {
      result = result.trimEnd();
    }
    result += token.value;
    prevNonWs = token;
  }

  return result.trim();
}

const SAMPLE_SQL = `select u.id, u.name, u.email, o.total_amount, count(oi.id) as item_count from users u inner join orders o on u.id = o.user_id left join order_items oi on o.id = oi.order_id where u.created_at >= '2024-01-01' and o.status in ('completed', 'shipped') and o.total_amount > 50.00 group by u.id, u.name, u.email, o.total_amount having count(oi.id) > 2 order by o.total_amount desc limit 25;`;

export default function SqlFormatterTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [indentSize, setIndentSize] = useState<"2" | "4" | "tab">("2");
  const [keywordCase, setKeywordCase] = useState<KeywordCase>("upper");
  const { remaining, dailyLimit, isLimited, recordUsage } =
    useRateLimit("sql-formatter");
  const { trackAction } = useToolAnalytics("sql-formatter");

  const getIndent = () => {
    if (indentSize === "tab") return "\t";
    return " ".repeat(Number(indentSize));
  };

  const handleFormat = useCallback(() => {
    if (isLimited) return;
    recordUsage();
    trackAction("format");
    setError("");
    setOutput("");
    try {
      if (!input.trim()) {
        setError("Please enter a SQL query to format.");
        return;
      }
      const formatted = formatSql(input, getIndent(), keywordCase);
      setOutput(formatted);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error formatting SQL");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, isLimited, recordUsage, trackAction, indentSize, keywordCase]);

  useKeyboardShortcut("Enter", handleFormat);

  function handleMinify() {
    if (isLimited) return;
    recordUsage();
    trackAction("minify");
    setError("");
    setOutput("");
    try {
      if (!input.trim()) {
        setError("Please enter a SQL query to minify.");
        return;
      }
      const minified = minifySql(input);
      setOutput(minified);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error minifying SQL");
    }
  }

  function handleCopy() {
    if (output) {
      navigator.clipboard.writeText(output);
    }
  }

  function handleLoadSample() {
    setInput(SAMPLE_SQL);
    setOutput("");
    setError("");
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
        SQL Formatter &amp; Beautifier
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Format, beautify, and minify SQL queries instantly. Supports SELECT, INSERT,
        UPDATE, DELETE, CREATE, and more.
      </p>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste your SQL query here..."
        rows={8}
        spellCheck={false}
        className="w-full rounded-lg border border-gray-300 bg-white p-4 font-mono text-sm dark:border-gray-700 dark:bg-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      />

      {/* Options row */}
      <div className="flex flex-wrap items-center gap-4 mt-3 text-sm">
        <div className="flex items-center gap-2">
          <label className="text-gray-600 dark:text-gray-400 font-medium">Indent:</label>
          <div className="flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
            {(["2", "4", "tab"] as const).map((size) => (
              <button
                key={size}
                onClick={() => setIndentSize(size)}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  indentSize === size
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                {size === "tab" ? "Tab" : `${size} spaces`}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-gray-600 dark:text-gray-400 font-medium">Keywords:</label>
          <div className="flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
            {(["upper", "lower", "preserve"] as const).map((kc) => (
              <button
                key={kc}
                onClick={() => setKeywordCase(kc)}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  keywordCase === kc
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                {kc === "upper" ? "UPPER" : kc === "lower" ? "lower" : "Preserve"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap items-center gap-2 mt-4">
        <button
          onClick={handleFormat}
          disabled={isLimited}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          Format{" "}
          <kbd className="ml-1 hidden rounded bg-indigo-500 px-1.5 py-0.5 text-xs font-normal text-indigo-100 sm:inline">
            Ctrl+Enter
          </kbd>
        </button>
        <button
          onClick={handleMinify}
          disabled={isLimited}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          Minify
        </button>
        <button
          onClick={handleLoadSample}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
        >
          Load sample
        </button>
        <RateLimitBanner
          remaining={remaining}
          dailyLimit={dailyLimit}
          isLimited={isLimited}
        />
      </div>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-600 dark:bg-red-950 dark:border-red-800 dark:text-red-400">
          {error}
        </div>
      )}

      {output && (
        <div className="relative mt-4 rounded-lg border border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-950">
          <button
            onClick={handleCopy}
            className="absolute right-2 top-2 rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Copy
          </button>
          <textarea
            readOnly
            value={output}
            rows={Math.min(20, output.split("\n").length + 1)}
            spellCheck={false}
            className="w-full rounded-lg border-0 bg-transparent p-4 font-mono text-sm text-gray-900 dark:text-gray-100 focus:outline-none"
          />
        </div>
      )}

      {/* About section */}
      <details className="mt-8 rounded-lg border border-gray-200 dark:border-gray-700">
        <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          About SQL Formatting
        </summary>
        <div className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400 space-y-3">
          <p>
            This tool formats SQL queries for readability by placing major clauses
            on new lines and applying consistent indentation. It supports standard
            SQL syntax including SELECT, INSERT, UPDATE, DELETE, CREATE TABLE,
            subqueries, JOINs, CASE expressions, and more.
          </p>
          <p>
            <strong>Keyword casing:</strong> Choose UPPER, lower, or preserve original
            casing for SQL keywords. UPPER is the most common convention for readability.
          </p>
          <p>
            <strong>Minify:</strong> Removes all unnecessary whitespace and comments,
            producing compact single-line SQL. Useful for logging, URLs, or reducing payload size.
          </p>
          <p>
            <strong>Supported features:</strong> String literals (single/double quotes),
            backtick-quoted identifiers (MySQL), multi-word keywords (LEFT JOIN, ORDER BY,
            GROUP BY), inline/block comments, CASE/WHEN expressions, and subqueries
            with proper parenthesis indentation.
          </p>
        </div>
      </details>
    </div>
  );
}
