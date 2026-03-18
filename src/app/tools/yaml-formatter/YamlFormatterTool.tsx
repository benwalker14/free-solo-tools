"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import yaml from "js-yaml";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";
import RateLimitBanner from "@/components/RateLimitBanner";

const SAMPLE_YAML = `# Kubernetes Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
  namespace: production
  labels:
    app: web
    tier: frontend
    environment: production
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
        - name: nginx
          image: nginx:1.25-alpine
          ports:
            - containerPort: 80
              protocol: TCP
          resources:
            limits:
              cpu: 500m
              memory: 128Mi
            requests:
              cpu: 250m
              memory: 64Mi
          livenessProbe:
            httpGet:
              path: /healthz
              port: 80
            initialDelaySeconds: 10
            periodSeconds: 30
          env:
            - name: NODE_ENV
              value: production
            - name: LOG_LEVEL
              value: info`;

function validateYaml(input: string): { valid: boolean; error?: string; parsed?: unknown } {
  if (!input.trim()) {
    return { valid: false, error: "Empty input" };
  }

  try {
    const parsed = yaml.load(input, { schema: yaml.DEFAULT_SCHEMA });
    return { valid: true, parsed };
  } catch (e) {
    if (e instanceof yaml.YAMLException) {
      let msg = e.message;
      if (e.mark) {
        msg = `Line ${e.mark.line + 1}, Column ${e.mark.column + 1}: ${e.reason || e.message}`;
      }
      return { valid: false, error: msg };
    }
    return { valid: false, error: "Invalid YAML" };
  }
}

function formatYaml(input: string, indent: number, sortKeys: boolean): string {
  const parsed = yaml.load(input, { schema: yaml.DEFAULT_SCHEMA });
  return yaml.dump(parsed, {
    indent,
    lineWidth: -1,
    noRefs: true,
    sortKeys,
    quotingType: '"',
    forceQuotes: false,
  }).trimEnd();
}

function minifyYaml(input: string): string {
  const parsed = yaml.load(input, { schema: yaml.DEFAULT_SCHEMA });
  return yaml.dump(parsed, {
    indent: 1,
    lineWidth: -1,
    noRefs: true,
    flowLevel: 0,
    sortKeys: false,
  }).trimEnd();
}

export default function YamlFormatterTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [validation, setValidation] = useState<{
    valid: boolean;
    error?: string;
  } | null>(null);
  const [indentSize, setIndentSize] = useState<"2" | "4">("2");
  const [sortKeys, setSortKeys] = useState(false);
  const [copied, setCopied] = useState(false);
  const { remaining, dailyLimit, isLimited, recordUsage } =
    useRateLimit("yaml-formatter");
  const { trackAction } = useToolAnalytics("yaml-formatter");

  const handleFormat = useCallback(() => {
    if (isLimited) return;
    recordUsage();
    trackAction("format");
    setError("");
    setOutput("");
    setValidation(null);
    setCopied(false);
    try {
      if (!input.trim()) {
        setError("Please enter YAML to format.");
        return;
      }
      const result = validateYaml(input);
      setValidation(result);
      if (!result.valid) {
        setError(result.error || "Invalid YAML");
        return;
      }
      const formatted = formatYaml(input, Number(indentSize), sortKeys);
      setOutput(formatted);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error formatting YAML");
    }
  }, [input, isLimited, recordUsage, trackAction, indentSize, sortKeys]);

  useKeyboardShortcut("Enter", handleFormat);

  function handleMinify() {
    if (isLimited) return;
    recordUsage();
    trackAction("minify");
    setError("");
    setOutput("");
    setValidation(null);
    setCopied(false);
    try {
      if (!input.trim()) {
        setError("Please enter YAML to minify.");
        return;
      }
      const result = validateYaml(input);
      setValidation(result);
      if (!result.valid) {
        setError(result.error || "Invalid YAML");
        return;
      }
      const minified = minifyYaml(input);
      setOutput(minified);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error minifying YAML");
    }
  }

  function handleValidate() {
    if (isLimited) return;
    recordUsage();
    trackAction("validate");
    setError("");
    setOutput("");
    setCopied(false);
    try {
      if (!input.trim()) {
        setError("Please enter YAML to validate.");
        return;
      }
      const result = validateYaml(input);
      setValidation(result);
      if (!result.valid) {
        setError(result.error || "Invalid YAML");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error validating YAML");
    }
  }

  function handleCopy() {
    if (output) {
      navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  }

  function handleLoadSample() {
    setInput(SAMPLE_YAML);
    setOutput("");
    setError("");
    setValidation(null);
    setCopied(false);
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
        YAML Validator &amp; Formatter
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Validate, format, beautify, and minify YAML documents instantly. Perfect
        for Kubernetes manifests, Docker Compose files, CI/CD configs, and more.
      </p>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste your YAML here..."
        rows={12}
        spellCheck={false}
        className="w-full rounded-lg border border-gray-300 bg-white p-4 font-mono text-sm dark:border-gray-700 dark:bg-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      />

      {/* Options row */}
      <div className="flex flex-wrap items-center gap-4 mt-3 text-sm">
        <div className="flex items-center gap-2">
          <label className="text-gray-600 dark:text-gray-400 font-medium">
            Indent:
          </label>
          <div className="flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
            {(["2", "4"] as const).map((size) => (
              <button
                key={size}
                onClick={() => setIndentSize(size)}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  indentSize === size
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                {size} spaces
              </button>
            ))}
          </div>
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={sortKeys}
            onChange={(e) => setSortKeys(e.target.checked)}
            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600"
          />
          <span className="text-gray-600 dark:text-gray-400 font-medium">
            Sort keys
          </span>
        </label>
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
          onClick={handleValidate}
          disabled={isLimited}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          Validate
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

      {/* Validation result */}
      {validation && !error && (
        <div className="mt-4 rounded-lg bg-green-50 border border-green-200 p-4 text-sm text-green-700 dark:bg-green-950 dark:border-green-800 dark:text-green-400">
          Valid YAML document
        </div>
      )}

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
            {copied ? "Copied!" : "Copy"}
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
          About YAML Formatting
        </summary>
        <div className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400 space-y-3">
          <p>
            YAML (YAML Ain&apos;t Markup Language) is a human-readable data
            serialization format widely used for configuration files in
            Kubernetes, Docker Compose, GitHub Actions, Ansible, and more.
          </p>
          <p>
            <strong>Validation:</strong> Checks for correct YAML syntax including
            proper indentation, valid key-value pairs, correct use of colons and
            dashes, and proper quoting. Reports the exact line and column of errors.
          </p>
          <p>
            <strong>Format:</strong> Parses and re-serializes your YAML with
            consistent indentation. Optionally sorts keys alphabetically for
            easier scanning and diff-friendly output.
          </p>
          <p>
            <strong>Minify:</strong> Converts block-style YAML to compact flow
            style, reducing file size while preserving all data. Useful for
            embedding YAML in scripts or reducing payload size.
          </p>
          <p>
            Everything runs in your browser — no data is sent over the network.
          </p>
        </div>
      </details>
    </div>
  );
}
