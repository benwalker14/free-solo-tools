"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";
import RateLimitBanner from "@/components/RateLimitBanner";

const SAMPLE_ENV = `# Database
DATABASE_URL=postgresql://user:password@localhost:5432/mydb
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mydb

# API Keys
API_KEY=fake_live_key_abc123def456ghi789
STRIPE_SECRET_KEY=fake_stripe_test_key_1234567890abcdef
AWS_ACCESS_KEY_ID=FAKE_AWS_KEY_EXAMPLE
AWS_SECRET_ACCESS_KEY=fake_aws_secret_example_key_1234567890

# App Config
NODE_ENV=development
PORT=3000
APP_NAME="My Application"
DEBUG=true
LOG_LEVEL=info

# Auth
JWT_SECRET=changeme
SESSION_SECRET=your-secret-here

# Feature Flags
ENABLE_CACHE = true
REDIS_URL=redis://localhost:6379

# Broken lines
MISSING_VALUE=
INVALID KEY=value
 LEADING_SPACE=bad
DUPLICATE_KEY=first
DUPLICATE_KEY=second
UNQUOTED_SPACES=hello world
INLINE_COMMENT=value # this is a comment`;

const SAMPLE_ENV_EXAMPLE = `# Database
DATABASE_URL=postgresql://user:password@localhost:5432/mydb
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mydb

# API Keys
API_KEY=your-api-key-here
STRIPE_SECRET_KEY=your-stripe-key-here
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret

# App Config
NODE_ENV=development
PORT=3000
APP_NAME="My Application"
DEBUG=false
LOG_LEVEL=info

# Auth
JWT_SECRET=change-this
SESSION_SECRET=change-this

# Feature Flags
ENABLE_CACHE=true
REDIS_URL=redis://localhost:6379

# Mail (not in .env)
SMTP_HOST=smtp.example.com
SMTP_PORT=587`;

interface Issue {
  type: "error" | "warning" | "security" | "info";
  line: number | null;
  message: string;
}

interface CompareResult {
  missing: string[];
  extra: string[];
  matching: string[];
}

interface ParsedEntry {
  lineNumber: number;
  raw: string;
  key: string | null;
  value: string | null;
  isComment: boolean;
  isEmpty: boolean;
}

const SECRET_PATTERNS = [
  /^(API_KEY|APIKEY|API_SECRET)$/i,
  /^.*_(SECRET|TOKEN|PASSWORD|PASSWD|PWD|PRIVATE_KEY|SIGNING_KEY)$/i,
  /^(SECRET|TOKEN|PASSWORD|PRIVATE_KEY)$/i,
  /^(STRIPE_SECRET_KEY|STRIPE_LIVE).*$/i,
  /^(AWS_SECRET_ACCESS_KEY|AWS_SESSION_TOKEN)$/i,
  /^(DATABASE_URL|DB_PASSWORD|DB_PASS)$/i,
  /^(JWT_SECRET|SESSION_SECRET|ENCRYPTION_KEY)$/i,
  /^(GITHUB_TOKEN|GH_TOKEN|GITLAB_TOKEN)$/i,
  /^(SENDGRID_API_KEY|MAILGUN_API_KEY|TWILIO_AUTH_TOKEN)$/i,
  /^(GOOGLE_CLIENT_SECRET|FACEBOOK_APP_SECRET|OAUTH_CLIENT_SECRET)$/i,
];

const PLACEHOLDER_VALUES = [
  /^(changeme|change[-_]?this|replace[-_]?me|todo|fixme)$/i,
  /^(your[-_]?.+[-_]?here|xxx+|placeholder|example|test123)$/i,
  /^(insert[-_]?.+[-_]?here|put[-_]?.+[-_]?here)$/i,
  /^<.+>$/,
  /^\[.+\]$/,
  /^\{.+\}$/,
];

function parseEnvFile(input: string): ParsedEntry[] {
  const lines = input.split("\n");
  const entries: ParsedEntry[] = [];

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const trimmed = raw.trim();

    if (trimmed === "") {
      entries.push({
        lineNumber: i + 1,
        raw,
        key: null,
        value: null,
        isComment: false,
        isEmpty: true,
      });
      continue;
    }

    if (trimmed.startsWith("#")) {
      entries.push({
        lineNumber: i + 1,
        raw,
        key: null,
        value: null,
        isComment: true,
        isEmpty: false,
      });
      continue;
    }

    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) {
      entries.push({
        lineNumber: i + 1,
        raw,
        key: null,
        value: null,
        isComment: false,
        isEmpty: false,
      });
    } else {
      const key = trimmed.substring(0, eqIndex).trimEnd();
      let value = trimmed.substring(eqIndex + 1).trimStart();
      // Strip surrounding quotes
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      entries.push({
        lineNumber: i + 1,
        raw,
        key,
        value,
        isComment: false,
        isEmpty: false,
      });
    }
  }

  return entries;
}

function validateEnv(input: string): Issue[] {
  const issues: Issue[] = [];

  if (!input.trim()) {
    return [{ type: "error", line: null, message: "Empty input" }];
  }

  const entries = parseEnvFile(input);
  const keyEntries = entries.filter((e) => !e.isComment && !e.isEmpty);
  const seenKeys = new Map<string, number>();

  for (const entry of keyEntries) {
    // Lines without = sign
    if (entry.key === null) {
      issues.push({
        type: "error",
        line: entry.lineNumber,
        message: `Invalid syntax — missing "=" sign: "${entry.raw.trim()}"`,
      });
      continue;
    }

    const key = entry.key;
    const value = entry.value ?? "";

    // Leading whitespace
    if (entry.raw !== entry.raw.trimStart()) {
      issues.push({
        type: "warning",
        line: entry.lineNumber,
        message: `Leading whitespace before key "${key}"`,
      });
    }

    // Key validation: must start with letter or underscore, only alphanumeric + underscore
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) {
      if (key.includes(" ")) {
        issues.push({
          type: "error",
          line: entry.lineNumber,
          message: `Key "${key}" contains spaces — keys cannot have spaces`,
        });
      } else if (/^\d/.test(key)) {
        issues.push({
          type: "error",
          line: entry.lineNumber,
          message: `Key "${key}" starts with a digit — keys must start with a letter or underscore`,
        });
      } else {
        issues.push({
          type: "warning",
          line: entry.lineNumber,
          message: `Key "${key}" contains non-standard characters — stick to A-Z, 0-9, and underscore`,
        });
      }
    }

    // Key casing: should be UPPER_SNAKE_CASE
    if (
      /^[A-Za-z_][A-Za-z0-9_]*$/.test(key) &&
      key !== key.toUpperCase() &&
      !key.startsWith("npm_") &&
      !key.startsWith("next_")
    ) {
      issues.push({
        type: "info",
        line: entry.lineNumber,
        message: `Key "${key}" is not UPPER_SNAKE_CASE — convention is uppercase (e.g., "${key.toUpperCase()}")`,
      });
    }

    // Duplicate keys
    if (seenKeys.has(key)) {
      issues.push({
        type: "warning",
        line: entry.lineNumber,
        message: `Duplicate key "${key}" — previously defined on line ${seenKeys.get(key)}. Only the last value will be used`,
      });
    }
    seenKeys.set(key, entry.lineNumber);

    // Empty value for secret-looking keys
    if (value === "" && SECRET_PATTERNS.some((p) => p.test(key))) {
      issues.push({
        type: "security",
        line: entry.lineNumber,
        message: `"${key}" is empty — this looks like a required secret`,
      });
    } else if (value === "") {
      issues.push({
        type: "warning",
        line: entry.lineNumber,
        message: `"${key}" has an empty value`,
      });
    }

    // Placeholder values
    if (value && PLACEHOLDER_VALUES.some((p) => p.test(value))) {
      issues.push({
        type: "security",
        line: entry.lineNumber,
        message: `"${key}" appears to have a placeholder value ("${value}") — replace before deploying`,
      });
    }

    // Spaces around = in raw line
    const rawTrimmed = entry.raw.trim();
    const rawEqIndex = rawTrimmed.indexOf("=");
    if (rawEqIndex > 0) {
      const beforeEq = rawTrimmed[rawEqIndex - 1];
      const afterEq = rawTrimmed[rawEqIndex + 1];
      if (beforeEq === " " || afterEq === " ") {
        issues.push({
          type: "warning",
          line: entry.lineNumber,
          message: `Spaces around "=" for "${key}" — some parsers don't support this`,
        });
      }
    }

    // Unquoted value with spaces
    const rawValue = rawTrimmed.substring(rawTrimmed.indexOf("=") + 1);
    if (
      rawValue.includes(" ") &&
      !rawValue.trimStart().startsWith('"') &&
      !rawValue.trimStart().startsWith("'")
    ) {
      // Check if it looks like an inline comment
      if (rawValue.includes(" #")) {
        issues.push({
          type: "warning",
          line: entry.lineNumber,
          message: `"${key}" may have an inline comment — inline comments are not supported by all parsers`,
        });
      } else {
        issues.push({
          type: "warning",
          line: entry.lineNumber,
          message: `"${key}" has an unquoted value with spaces — wrap in quotes for reliability`,
        });
      }
    }

    // Detect secrets that look real (not placeholders)
    if (value && SECRET_PATTERNS.some((p) => p.test(key))) {
      const looksReal =
        value.length > 8 &&
        !PLACEHOLDER_VALUES.some((p) => p.test(value)) &&
        !/^(localhost|127\.0\.0\.1|0\.0\.0\.0)/.test(value);

      if (looksReal) {
        issues.push({
          type: "security",
          line: entry.lineNumber,
          message: `"${key}" contains what appears to be a real secret — ensure this file is in .gitignore`,
        });
      }
    }
  }

  // Sort by line number
  issues.sort((a, b) => {
    if (a.line === null && b.line === null) return 0;
    if (a.line === null) return 1;
    if (b.line === null) return -1;
    return a.line - b.line;
  });

  return issues;
}

function compareEnvFiles(envInput: string, exampleInput: string): CompareResult {
  const envEntries = parseEnvFile(envInput);
  const exampleEntries = parseEnvFile(exampleInput);

  const envKeys = new Set(
    envEntries
      .filter((e) => e.key !== null)
      .map((e) => e.key as string)
  );
  const exampleKeys = new Set(
    exampleEntries
      .filter((e) => e.key !== null)
      .map((e) => e.key as string)
  );

  const missing = [...exampleKeys].filter((k) => !envKeys.has(k));
  const extra = [...envKeys].filter((k) => !exampleKeys.has(k));
  const matching = [...envKeys].filter((k) => exampleKeys.has(k));

  return { missing, extra, matching };
}

type Mode = "validate" | "compare";

export default function EnvValidatorTool() {
  const [mode, setMode] = useState<Mode>("validate");
  const [input, setInput] = useState("");
  const [exampleInput, setExampleInput] = useState("");
  const [issues, setIssues] = useState<Issue[]>([]);
  const [compareResult, setCompareResult] = useState<CompareResult | null>(null);
  const [hasValidated, setHasValidated] = useState(false);
  const [copied, setCopied] = useState(false);
  const { remaining, dailyLimit, isLimited, recordUsage } =
    useRateLimit("env-validator");
  const { trackAction } = useToolAnalytics("env-validator");

  const handleValidate = useCallback(() => {
    if (isLimited) return;
    recordUsage();
    setCopied(false);

    if (mode === "validate") {
      trackAction("validate");
      if (!input.trim()) {
        setIssues([
          { type: "error", line: null, message: "Please enter a .env file to validate." },
        ]);
        setHasValidated(false);
        return;
      }
      const result = validateEnv(input);
      setIssues(result);
      setCompareResult(null);
      setHasValidated(true);
    } else {
      trackAction("compare");
      if (!input.trim()) {
        setIssues([
          { type: "error", line: null, message: "Please enter your .env file content." },
        ]);
        setHasValidated(false);
        return;
      }
      if (!exampleInput.trim()) {
        setIssues([
          { type: "error", line: null, message: "Please enter your .env.example file content." },
        ]);
        setHasValidated(false);
        return;
      }
      // Validate the .env file
      const validationIssues = validateEnv(input);
      // Compare keys
      const comparison = compareEnvFiles(input, exampleInput);
      setIssues(validationIssues);
      setCompareResult(comparison);
      setHasValidated(true);
    }
  }, [input, exampleInput, mode, isLimited, recordUsage, trackAction]);

  useKeyboardShortcut("Enter", handleValidate);

  function handleLoadSample() {
    setInput(SAMPLE_ENV);
    if (mode === "compare") {
      setExampleInput(SAMPLE_ENV_EXAMPLE);
    }
    setIssues([]);
    setCompareResult(null);
    setHasValidated(false);
    setCopied(false);
  }

  function handleCopy() {
    navigator.clipboard.writeText(input);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function handleClear() {
    setInput("");
    setExampleInput("");
    setIssues([]);
    setCompareResult(null);
    setHasValidated(false);
    setCopied(false);
  }

  const errorCount = issues.filter((i) => i.type === "error").length;
  const warningCount = issues.filter((i) => i.type === "warning").length;
  const securityCount = issues.filter((i) => i.type === "security").length;
  const infoCount = issues.filter((i) => i.type === "info").length;

  const issueTypeColor = (type: Issue["type"]) => {
    switch (type) {
      case "error":
        return "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400";
      case "warning":
        return "bg-yellow-50 text-yellow-700 dark:bg-yellow-950/50 dark:text-yellow-400";
      case "security":
        return "bg-orange-50 text-orange-700 dark:bg-orange-950/50 dark:text-orange-400";
      case "info":
        return "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400";
    }
  };

  const issueTypeLabel = (type: Issue["type"]) => {
    switch (type) {
      case "error":
        return "ERR";
      case "warning":
        return "WARN";
      case "security":
        return "SEC";
      case "info":
        return "INFO";
    }
  };

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
        Validate .env files for syntax errors, security issues, and best
        practices. Compare against .env.example to find missing keys.
      </p>

      {/* Mode toggle */}
      <div className="mb-6 flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden w-fit">
        <button
          onClick={() => {
            setMode("validate");
            setCompareResult(null);
            setHasValidated(false);
          }}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            mode === "validate"
              ? "bg-indigo-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
        >
          Validate
        </button>
        <button
          onClick={() => {
            setMode("compare");
            setCompareResult(null);
            setHasValidated(false);
          }}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            mode === "compare"
              ? "bg-indigo-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
        >
          Compare with .env.example
        </button>
      </div>

      {/* Input area */}
      <div className={mode === "compare" ? "grid gap-4 lg:grid-cols-2" : ""}>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {mode === "compare" ? ".env" : "Paste your .env file"}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="# Paste your .env file here&#10;DATABASE_URL=postgresql://...&#10;API_KEY=..."
            rows={mode === "compare" ? 14 : 16}
            spellCheck={false}
            className="w-full rounded-lg border border-gray-300 bg-white p-4 font-mono text-sm dark:border-gray-700 dark:bg-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        {mode === "compare" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              .env.example
            </label>
            <textarea
              value={exampleInput}
              onChange={(e) => setExampleInput(e.target.value)}
              placeholder="# Paste your .env.example file here&#10;DATABASE_URL=postgresql://...&#10;API_KEY=your-key-here"
              rows={14}
              spellCheck={false}
              className="w-full rounded-lg border border-gray-300 bg-white p-4 font-mono text-sm dark:border-gray-700 dark:bg-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap items-center gap-2 mt-4">
        <button
          onClick={handleValidate}
          disabled={isLimited}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          {mode === "validate" ? "Validate" : "Compare"}{" "}
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
          onClick={handleCopy}
          disabled={!input}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
        <button
          onClick={handleClear}
          disabled={!input && !exampleInput}
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

      {/* Compare results */}
      {compareResult && hasValidated && (
        <div className="mt-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Key Comparison
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/50">
              <div className="text-2xl font-bold text-red-700 dark:text-red-400">
                {compareResult.missing.length}
              </div>
              <div className="text-sm font-medium text-red-600 dark:text-red-400">
                Missing from .env
              </div>
              {compareResult.missing.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {compareResult.missing.map((k) => (
                    <li
                      key={k}
                      className="text-xs font-mono text-red-700 dark:text-red-400"
                    >
                      {k}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-950/50">
              <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">
                {compareResult.extra.length}
              </div>
              <div className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                Extra in .env
              </div>
              {compareResult.extra.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {compareResult.extra.map((k) => (
                    <li
                      key={k}
                      className="text-xs font-mono text-yellow-700 dark:text-yellow-400"
                    >
                      {k}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950/50">
              <div className="text-2xl font-bold text-green-700 dark:text-green-400">
                {compareResult.matching.length}
              </div>
              <div className="text-sm font-medium text-green-600 dark:text-green-400">
                Matching keys
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Validation results */}
      {issues.length > 0 && (
        <div className="mt-6 space-y-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {mode === "compare" ? "Validation Issues in .env" : "Validation Results"}
          </h2>
          {/* Summary bar */}
          <div className="flex items-center gap-3 text-sm font-medium">
            {errorCount === 0 &&
              warningCount === 0 &&
              securityCount === 0 &&
              hasValidated && (
                <span className="text-green-600 dark:text-green-400">
                  Valid .env file
                </span>
              )}
            {errorCount > 0 && (
              <span className="text-red-600 dark:text-red-400">
                {errorCount} error{errorCount !== 1 ? "s" : ""}
              </span>
            )}
            {securityCount > 0 && (
              <span className="text-orange-600 dark:text-orange-400">
                {securityCount} security{" "}
                {securityCount !== 1 ? "issues" : "issue"}
              </span>
            )}
            {warningCount > 0 && (
              <span className="text-yellow-600 dark:text-yellow-400">
                {warningCount} warning{warningCount !== 1 ? "s" : ""}
              </span>
            )}
            {infoCount > 0 && (
              <span className="text-blue-600 dark:text-blue-400">
                {infoCount} info
              </span>
            )}
          </div>

          {/* Issue list */}
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700 overflow-hidden">
            {issues.map((issue, i) => (
              <div
                key={i}
                className={`flex items-start gap-2 px-4 py-2.5 text-sm ${issueTypeColor(issue.type)}`}
              >
                <span className="font-medium shrink-0 mt-0.5">
                  {issueTypeLabel(issue.type)}
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
        </div>
      )}

      {hasValidated && issues.length === 0 && (
        <div className="mt-6 rounded-lg bg-green-50 border border-green-200 p-4 text-sm text-green-700 dark:bg-green-950/50 dark:border-green-800 dark:text-green-400">
          No issues found — your .env file looks good!
        </div>
      )}

      {/* About section */}
      <details className="mt-8 rounded-lg border border-gray-200 dark:border-gray-700">
        <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          About .env Validation
        </summary>
        <div className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400 space-y-3">
          <p>
            .env files store environment variables for your application —
            database URLs, API keys, feature flags, and configuration.
            Misconfigurations can cause runtime errors or security breaches.
          </p>
          <p>
            <strong>What we check:</strong>
          </p>
          <ul className="list-disc ml-5 space-y-1">
            <li>
              <strong>Syntax</strong> — valid KEY=VALUE format, no missing{" "}
              <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">
                =
              </code>{" "}
              signs, no leading whitespace
            </li>
            <li>
              <strong>Duplicate keys</strong> — only the last value is used by
              most parsers
            </li>
            <li>
              <strong>Security</strong> — detects real secrets, placeholder
              values, and empty credentials
            </li>
            <li>
              <strong>Quoting</strong> — values with spaces should be quoted;
              inline comments may break
            </li>
            <li>
              <strong>Naming conventions</strong> — UPPER_SNAKE_CASE is the
              standard
            </li>
            <li>
              <strong>Key comparison</strong> — compare .env against
              .env.example to catch missing variables
            </li>
          </ul>
          <p>
            Everything runs in your browser — no data is sent over the network.
          </p>
        </div>
      </details>
    </div>
  );
}
