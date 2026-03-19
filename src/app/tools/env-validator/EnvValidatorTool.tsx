"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";
import RateLimitBanner from "@/components/RateLimitBanner";

// --- Types ---

interface Issue {
  type: "error" | "warning" | "security";
  line: number | null;
  message: string;
}

interface EnvEntry {
  line: number;
  key: string;
  value: string;
  raw: string;
}

interface ValidationResult {
  issues: Issue[];
  entries: EnvEntry[];
  stats: {
    totalLines: number;
    variables: number;
    comments: number;
    blankLines: number;
    duplicates: number;
    securityWarnings: number;
  };
}

// --- Constants ---

const SENSITIVE_KEY_PATTERNS = [
  /password/i,
  /passwd/i,
  /secret/i,
  /token/i,
  /api[_-]?key/i,
  /private[_-]?key/i,
  /access[_-]?key/i,
  /auth/i,
  /credential/i,
  /connection[_-]?string/i,
  /database[_-]?url/i,
  /db[_-]?pass/i,
  /encryption[_-]?key/i,
  /signing[_-]?key/i,
  /jwt[_-]?secret/i,
  /session[_-]?secret/i,
  /smtp[_-]?pass/i,
  /sendgrid/i,
  /stripe[_-]?(?:secret|key)/i,
  /aws[_-]?secret/i,
  /client[_-]?secret/i,
];

const PLACEHOLDER_VALUES = new Set([
  "your-secret-here",
  "your-api-key",
  "change-me",
  "changeme",
  "xxx",
  "todo",
  "fixme",
  "replace-me",
  "your-token-here",
  "your-password-here",
  "example",
  "placeholder",
]);

const SAMPLE_ENV = [
  "# Application",
  "NODE_ENV=production",
  "PORT=3000",
  'APP_NAME="My Application"',
  "APP_URL=http://localhost:3000",
  "",
  "# Database",
  "DATABASE_URL=postgresql://user:password123@localhost:5432/mydb",
  "DB_HOST=localhost",
  "DB_PORT=5432",
  "DB_USER=admin",
  "DB_PASSWORD=super_secret_password",
  "DB_NAME=mydb",
  "",
  "# Authentication",
  "JWT_SECRET=my-jwt-secret-key-do-not-share",
  "SESSION_SECRET=keyboard_cat",
  "AUTH_TOKEN=sk_live_abc123def456",
  "",
  "# API Keys",
  "STRIPE_SECRET_KEY=sk_live_51234567890",
  "STRIPE_PUBLISHABLE_KEY=pk_live_51234567890",
  "SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxx",
  "AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE",
  "AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
  "",
  "# Misc",
  "DEBUG=true",
  "LOG_LEVEL=info",
  "FEATURE_FLAG_NEW_UI=",
  "CACHE_TTL = 3600",
  "INVALID LINE WITHOUT EQUALS",
  "DUPLICATE_KEY=first",
  "DUPLICATE_KEY=second",
  " LEADING_SPACE=bad",
  "API KEY=value with space in name",
].join("\n");

// --- Validation ---

function validateEnv(input: string): ValidationResult {
  const issues: Issue[] = [];
  const entries: EnvEntry[] = [];
  const lines = input.split("\n");
  const seenKeys = new Map<string, number>();
  let commentCount = 0;
  let blankCount = 0;
  let securityWarningCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const lineNum = i + 1;
    const raw = lines[i];
    const trimmed = raw.trim();

    // Blank line
    if (trimmed === "") {
      blankCount++;
      continue;
    }

    // Comment line
    if (trimmed.startsWith("#")) {
      commentCount++;
      continue;
    }

    // Check for leading whitespace (not blank/comment)
    if (raw !== trimmed && raw.length > 0 && /^\s+\S/.test(raw)) {
      issues.push({
        type: "warning",
        line: lineNum,
        message:
          "Line has leading whitespace \u2014 this may cause unexpected behavior in some parsers",
      });
    }

    // Must contain = sign
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) {
      issues.push({
        type: "error",
        line: lineNum,
        message:
          'Invalid syntax \u2014 missing "=" sign. Expected KEY=VALUE format',
      });
      continue;
    }

    const key = trimmed.substring(0, eqIndex).trim();
    const value = trimmed.substring(eqIndex + 1);

    // Validate key
    if (key === "") {
      issues.push({
        type: "error",
        line: lineNum,
        message: 'Empty key name before "="',
      });
      continue;
    }

    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(key)) {
      issues.push({
        type: "error",
        line: lineNum,
        message: `Invalid variable name "${key}" \u2014 must match [a-zA-Z_][a-zA-Z0-9_]*`,
      });
    }

    // Check for spaces around = sign
    const rawEqIndex = raw.indexOf("=");
    const rawBeforeEq = raw.substring(0, rawEqIndex);
    const rawAfterEq = raw.substring(rawEqIndex + 1);
    if (rawBeforeEq.endsWith(" ") || rawAfterEq.startsWith(" ")) {
      issues.push({
        type: "warning",
        line: lineNum,
        message:
          'Spaces around "=" \u2014 some tools (e.g., Docker, shell) may not parse this correctly',
      });
    }

    // Parse value (handle quotes)
    const valueTrimmed = value.trim();
    let parsedValue = valueTrimmed;

    if (
      (valueTrimmed.startsWith('"') &&
        valueTrimmed.endsWith('"') &&
        valueTrimmed.length >= 2) ||
      (valueTrimmed.startsWith("'") &&
        valueTrimmed.endsWith("'") &&
        valueTrimmed.length >= 2)
    ) {
      parsedValue = valueTrimmed.slice(1, -1);
    } else if (
      (valueTrimmed.startsWith('"') && !valueTrimmed.endsWith('"')) ||
      (valueTrimmed.startsWith("'") && !valueTrimmed.endsWith("'"))
    ) {
      issues.push({
        type: "error",
        line: lineNum,
        message:
          "Unmatched quote \u2014 value starts with a quote but does not end with one",
      });
    }

    // Check for empty value
    if (valueTrimmed === "") {
      issues.push({
        type: "warning",
        line: lineNum,
        message: `"${key}" has an empty value \u2014 is this intentional?`,
      });
    }

    // Check for placeholder values
    if (PLACEHOLDER_VALUES.has(parsedValue.toLowerCase())) {
      issues.push({
        type: "warning",
        line: lineNum,
        message: `"${key}" appears to have a placeholder value ("${parsedValue}")`,
      });
    }

    // Check for inline comments without quotes
    if (
      !valueTrimmed.startsWith('"') &&
      !valueTrimmed.startsWith("'") &&
      valueTrimmed.includes(" #")
    ) {
      issues.push({
        type: "warning",
        line: lineNum,
        message:
          'Possible inline comment detected \u2014 unquoted values with "#" may be parsed differently by different tools',
      });
    }

    // Duplicate key check
    if (seenKeys.has(key)) {
      issues.push({
        type: "error",
        line: lineNum,
        message: `Duplicate key "${key}" \u2014 first defined on line ${seenKeys.get(key)}. Only the last value will be used`,
      });
    }
    seenKeys.set(key, lineNum);

    // Security checks
    const isSensitiveKey = SENSITIVE_KEY_PATTERNS.some((pattern) =>
      pattern.test(key),
    );

    if (isSensitiveKey && parsedValue && parsedValue.length > 0) {
      const looksLikeRealSecret =
        parsedValue.length > 5 &&
        !PLACEHOLDER_VALUES.has(parsedValue.toLowerCase()) &&
        parsedValue !== "true" &&
        parsedValue !== "false" &&
        !/^\d+$/.test(parsedValue) &&
        !parsedValue.startsWith("${") &&
        !parsedValue.startsWith("$");

      if (looksLikeRealSecret) {
        issues.push({
          type: "security",
          line: lineNum,
          message: `"${key}" appears to contain a real secret \u2014 ensure this .env file is in your .gitignore`,
        });
        securityWarningCount++;
      }
    }

    // Check for URLs with embedded credentials
    if (/(?:\/\/)[^:]+:[^@]+@/.test(parsedValue)) {
      issues.push({
        type: "security",
        line: lineNum,
        message: `"${key}" contains a URL with embedded credentials \u2014 consider using separate variables for username/password`,
      });
      securityWarningCount++;
    }

    entries.push({
      line: lineNum,
      key,
      value: parsedValue,
      raw,
    });
  }

  // Sort issues by line number
  issues.sort((a, b) => {
    if (a.line === null && b.line === null) return 0;
    if (a.line === null) return 1;
    if (b.line === null) return -1;
    return a.line - b.line;
  });

  const duplicateCount = issues.filter(
    (i) => i.type === "error" && i.message.includes("Duplicate key"),
  ).length;

  return {
    issues,
    entries,
    stats: {
      totalLines: lines.length,
      variables: seenKeys.size,
      comments: commentCount,
      blankLines: blankCount,
      duplicates: duplicateCount,
      securityWarnings: securityWarningCount,
    },
  };
}

// --- Component ---

export default function EnvValidatorTool() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [filter, setFilter] = useState<
    "all" | "error" | "warning" | "security"
  >("all");
  const [copied, setCopied] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const { remaining, dailyLimit, isLimited, recordUsage } =
    useRateLimit("env-validator");
  const { trackAction } = useToolAnalytics("env-validator");

  const handleValidate = useCallback(() => {
    if (isLimited) return;
    recordUsage();
    trackAction("validate");
    setCopied(null);

    if (!input.trim()) {
      setResult(null);
      return;
    }

    const validationResult = validateEnv(input);
    setResult(validationResult);
  }, [input, isLimited, recordUsage, trackAction]);

  useKeyboardShortcut("Enter", handleValidate);

  function handleLoadSample() {
    setInput(SAMPLE_ENV);
    setResult(null);
    setCopied(null);
  }

  function handleClear() {
    setInput("");
    setResult(null);
    setCopied(null);
  }

  function handleCopy(text: string, label: string) {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 1500);
  }

  function generateEnvExample(): string {
    if (!result) return "";
    return result.entries
      .filter((e, i, arr) => {
        return arr.findIndex((x) => x.key === e.key) === i;
      })
      .map((e) => `${e.key}=`)
      .join("\n");
  }

  function generateSanitized(): string {
    if (!result) return "";
    const lines = input.split("\n");
    return lines
      .map((line) => {
        const trimmed = line.trim();
        if (trimmed === "" || trimmed.startsWith("#")) return line;
        const eqIdx = line.indexOf("=");
        if (eqIdx === -1) return line;
        const k = line.substring(0, eqIdx);
        return `${k}=<REDACTED>`;
      })
      .join("\n");
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target?.result as string;
        if (text) {
          setInput(text);
          setResult(null);
          setCopied(null);
        }
      };
      reader.readAsText(file);
    }
  }

  const filteredIssues = result
    ? filter === "all"
      ? result.issues
      : result.issues.filter((i) => i.type === filter)
    : [];

  const errorCount =
    result?.issues.filter((i) => i.type === "error").length ?? 0;
  const warningCount =
    result?.issues.filter((i) => i.type === "warning").length ?? 0;
  const securityCount =
    result?.issues.filter((i) => i.type === "security").length ?? 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="mb-8 block text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        &larr; Back to tools
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        .env File Validator
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Validate .env files for syntax errors, duplicate keys, security risks,
        and best practices. Export a sanitized version or .env.example template.
      </p>

      {/* Input area with drag-and-drop */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={`relative ${isDragOver ? "ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-gray-900 rounded-lg" : ""}`}
      >
        {isDragOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-indigo-50/80 dark:bg-indigo-950/80 rounded-lg z-10 pointer-events-none">
            <span className="text-indigo-600 dark:text-indigo-400 font-medium text-sm">
              Drop .env file here
            </span>
          </div>
        )}
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your .env file here or drag-and-drop a file..."
          rows={16}
          spellCheck={false}
          className="w-full rounded-lg border border-gray-300 bg-white p-4 font-mono text-sm dark:border-gray-700 dark:bg-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap items-center gap-2 mt-4">
        <button
          onClick={handleValidate}
          disabled={isLimited || !input.trim()}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          Validate{" "}
          <kbd className="ml-1 hidden rounded bg-indigo-500 px-1.5 py-0.5 text-xs font-normal text-indigo-100 sm:inline">
            Ctrl+Enter
          </kbd>
        </button>
        <button
          onClick={handleLoadSample}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
        >
          Load sample
        </button>
        <button
          onClick={handleClear}
          disabled={!input}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          Clear
        </button>
        <RateLimitBanner
          remaining={remaining}
          dailyLimit={dailyLimit}
          isLimited={isLimited}
        />
      </div>

      {/* Results */}
      {result && (
        <div className="mt-6 space-y-4">
          {/* Stats bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {[
              { label: "Lines", value: result.stats.totalLines, warn: false },
              {
                label: "Variables",
                value: result.stats.variables,
                warn: false,
              },
              { label: "Comments", value: result.stats.comments, warn: false },
              { label: "Blank", value: result.stats.blankLines, warn: false },
              {
                label: "Duplicates",
                value: result.stats.duplicates,
                warn: result.stats.duplicates > 0,
              },
              {
                label: "Security",
                value: result.stats.securityWarnings,
                warn: result.stats.securityWarnings > 0,
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className={`rounded-lg border px-3 py-2 text-center ${
                  stat.warn
                    ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/50"
                    : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50"
                }`}
              >
                <div
                  className={`text-lg font-bold ${
                    stat.warn
                      ? "text-red-600 dark:text-red-400"
                      : "text-gray-900 dark:text-white"
                  }`}
                >
                  {stat.value}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Summary + filter */}
          <div className="flex flex-wrap items-center gap-2">
            {result.issues.length === 0 ? (
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                No issues found &mdash; your .env file looks good!
              </span>
            ) : (
              <>
                <button
                  onClick={() => setFilter("all")}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    filter === "all"
                      ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`}
                >
                  All ({result.issues.length})
                </button>
                {errorCount > 0 && (
                  <button
                    onClick={() => setFilter("error")}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                      filter === "error"
                        ? "bg-red-600 text-white"
                        : "bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-950/50 dark:text-red-400 dark:hover:bg-red-950"
                    }`}
                  >
                    Errors ({errorCount})
                  </button>
                )}
                {warningCount > 0 && (
                  <button
                    onClick={() => setFilter("warning")}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                      filter === "warning"
                        ? "bg-yellow-500 text-white"
                        : "bg-yellow-50 text-yellow-700 hover:bg-yellow-100 dark:bg-yellow-950/50 dark:text-yellow-400 dark:hover:bg-yellow-950"
                    }`}
                  >
                    Warnings ({warningCount})
                  </button>
                )}
                {securityCount > 0 && (
                  <button
                    onClick={() => setFilter("security")}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                      filter === "security"
                        ? "bg-purple-600 text-white"
                        : "bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-950/50 dark:text-purple-400 dark:hover:bg-purple-950"
                    }`}
                  >
                    Security ({securityCount})
                  </button>
                )}
              </>
            )}
          </div>

          {/* Issue list */}
          {filteredIssues.length > 0 && (
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700 overflow-hidden">
              {filteredIssues.map((issue, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-2 px-4 py-2.5 text-sm ${
                    issue.type === "error"
                      ? "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400"
                      : issue.type === "security"
                        ? "bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400"
                        : "bg-yellow-50 text-yellow-700 dark:bg-yellow-950/50 dark:text-yellow-400"
                  }`}
                >
                  <span className="font-medium shrink-0 mt-0.5">
                    {issue.type === "error"
                      ? "ERR"
                      : issue.type === "security"
                        ? "SEC"
                        : "WARN"}
                  </span>
                  <span>
                    {issue.line && (
                      <span className="font-mono opacity-70">
                        Line {issue.line}:{" "}
                      </span>
                    )}
                    {issue.message}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Export actions */}
          <div className="flex flex-wrap gap-2 pt-2">
            <button
              onClick={() => handleCopy(generateEnvExample(), "example")}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
            >
              {copied === "example" ? "Copied!" : "Copy .env.example"}
            </button>
            <button
              onClick={() => handleCopy(generateSanitized(), "sanitized")}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
            >
              {copied === "sanitized"
                ? "Copied!"
                : "Copy sanitized (values redacted)"}
            </button>
            <button
              onClick={() => {
                const blob = new Blob([generateEnvExample()], {
                  type: "text/plain",
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = ".env.example";
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
            >
              Download .env.example
            </button>
          </div>

          {/* Variables table */}
          {result.entries.length > 0 && (
            <details className="rounded-lg border border-gray-200 dark:border-gray-700">
              <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                Parsed Variables ({result.entries.length})
              </summary>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                      <th className="px-4 py-2 text-left font-medium text-gray-500 dark:text-gray-400">
                        Line
                      </th>
                      <th className="px-4 py-2 text-left font-medium text-gray-500 dark:text-gray-400">
                        Key
                      </th>
                      <th className="px-4 py-2 text-left font-medium text-gray-500 dark:text-gray-400">
                        Value
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {result.entries.map((entry, i) => {
                      const isSensitive = SENSITIVE_KEY_PATTERNS.some((p) =>
                        p.test(entry.key),
                      );
                      return (
                        <tr
                          key={i}
                          className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                        >
                          <td className="px-4 py-2 font-mono text-gray-400">
                            {entry.line}
                          </td>
                          <td className="px-4 py-2 font-mono text-gray-900 dark:text-white">
                            {entry.key}
                          </td>
                          <td className="px-4 py-2 font-mono text-gray-600 dark:text-gray-400 max-w-xs truncate">
                            {isSensitive && entry.value ? (
                              <span className="text-purple-600 dark:text-purple-400">
                                {"*".repeat(Math.min(entry.value.length, 20))}
                              </span>
                            ) : entry.value === "" ? (
                              <span className="italic text-gray-400 dark:text-gray-500">
                                (empty)
                              </span>
                            ) : (
                              entry.value
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </details>
          )}
        </div>
      )}

      {/* About section */}
      <details className="mt-8 rounded-lg border border-gray-200 dark:border-gray-700">
        <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          About .env File Validation
        </summary>
        <div className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400 space-y-3">
          <p>
            A{" "}
            <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">
              .env
            </code>{" "}
            file stores environment variables as key-value pairs. They are used
            to configure applications without hardcoding sensitive data like API
            keys and database credentials.
          </p>
          <p>
            <strong>What we check:</strong>
          </p>
          <ul className="list-disc ml-5 space-y-1">
            <li>
              <strong>Syntax</strong> &mdash; valid KEY=VALUE format, proper
              quoting, no spaces around &quot;=&quot;
            </li>
            <li>
              <strong>Variable names</strong> &mdash; must match{" "}
              <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">
                {"[a-zA-Z_][a-zA-Z0-9_]*"}
              </code>
            </li>
            <li>
              <strong>Duplicate keys</strong> &mdash; flags variables defined
              more than once
            </li>
            <li>
              <strong>Empty values</strong> &mdash; warns about variables with no
              value assigned
            </li>
            <li>
              <strong>Placeholder values</strong> &mdash; detects TODO, changeme,
              and similar placeholders
            </li>
            <li>
              <strong>Security</strong> &mdash; flags real secrets in sensitive
              variables (passwords, tokens, API keys)
            </li>
            <li>
              <strong>Embedded credentials</strong> &mdash; warns about URLs
              containing username:password
            </li>
            <li>
              <strong>Inline comments</strong> &mdash; detects potential unquoted
              inline comments
            </li>
          </ul>
          <p>
            <strong>Export options:</strong>
          </p>
          <ul className="list-disc ml-5 space-y-1">
            <li>
              <strong>.env.example</strong> &mdash; keys only, no values. Safe to
              commit to version control.
            </li>
            <li>
              <strong>Sanitized copy</strong> &mdash; all values replaced with{" "}
              <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">
                {"<REDACTED>"}
              </code>{" "}
              for sharing without exposing secrets.
            </li>
          </ul>
          <p>
            Everything runs in your browser &mdash; no data is sent over the
            network.
          </p>
        </div>
      </details>
    </div>
  );
}
