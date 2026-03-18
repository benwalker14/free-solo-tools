"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";
import RateLimitBanner from "@/components/RateLimitBanner";

export default function JsonFormatterTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const { remaining, dailyLimit, isLimited, recordUsage } =
    useRateLimit("json-formatter");
  const { trackAction } = useToolAnalytics("json-formatter");

  const handleFormat = useCallback(() => {
    if (isLimited) return;
    recordUsage();
    trackAction("format");
    setError("");
    setOutput("");
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid JSON");
    }
  }, [input, isLimited, recordUsage, trackAction]);

  useKeyboardShortcut("Enter", handleFormat);

  function handleMinify() {
    if (isLimited) return;
    recordUsage();
    trackAction("minify");
    setError("");
    setOutput("");
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid JSON");
    }
  }

  function handleValidate() {
    if (isLimited) return;
    recordUsage();
    trackAction("validate");
    setError("");
    setOutput("");
    try {
      JSON.parse(input);
      setOutput("__valid__");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid JSON");
    }
  }

  function handleCopy() {
    if (output && output !== "__valid__") {
      navigator.clipboard.writeText(output);
    }
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
        JSON Formatter &amp; Validator
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Format, validate, and minify JSON data instantly.
      </p>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste your JSON here..."
        rows={10}
        className="w-full rounded-lg border border-gray-300 bg-white p-4 font-mono text-sm dark:border-gray-700 dark:bg-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      />

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

      {output === "__valid__" && (
        <div className="mt-4 rounded-lg bg-green-50 border border-green-200 p-4 text-sm text-green-600 dark:bg-green-950 dark:border-green-800 dark:text-green-400">
          Valid JSON ✓
        </div>
      )}

      {output && output !== "__valid__" && (
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
            rows={10}
            className="w-full rounded-lg border-0 bg-transparent p-4 font-mono text-sm text-gray-900 dark:text-gray-100 focus:outline-none"
          />
        </div>
      )}
    </div>
  );
}
