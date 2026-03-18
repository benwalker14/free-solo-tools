"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";
import RateLimitBanner from "@/components/RateLimitBanner";

type EncodeMode = "component" | "uri";

export default function UrlEncoderTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState<EncodeMode>("component");
  const { remaining, dailyLimit, isLimited, recordUsage } =
    useRateLimit("url-encoder");
  const { trackAction } = useToolAnalytics("url-encoder");

  const handleEncode = useCallback(() => {
    if (isLimited) return;
    recordUsage();
    trackAction("encode");
    setError("");
    setOutput("");
    try {
      const encoded =
        mode === "component"
          ? encodeURIComponent(input)
          : encodeURI(input);
      setOutput(encoded);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to encode");
    }
  }, [input, isLimited, recordUsage, trackAction, mode]);

  useKeyboardShortcut("Enter", handleEncode);

  function handleDecode() {
    if (isLimited) return;
    recordUsage();
    trackAction("decode");
    setError("");
    setOutput("");
    try {
      const decoded =
        mode === "component"
          ? decodeURIComponent(input)
          : decodeURI(input);
      setOutput(decoded);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Failed to decode. Make sure the input is valid URL-encoded text.",
      );
    }
  }

  function handleCopy() {
    if (output) {
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
        URL Encoder &amp; Decoder
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Encode and decode URL components or full URIs. Fast, private, and free.
      </p>

      {/* Encoding mode toggle */}
      <div className="mb-4 flex items-center gap-4">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Mode:
        </span>
        <div className="inline-flex rounded-lg border border-gray-300 dark:border-gray-700">
          <button
            onClick={() => setMode("component")}
            className={`rounded-l-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              mode === "component"
                ? "bg-indigo-600 text-white"
                : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
            }`}
          >
            Component
          </button>
          <button
            onClick={() => setMode("uri")}
            className={`rounded-r-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              mode === "uri"
                ? "bg-indigo-600 text-white"
                : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
            }`}
          >
            Full URI
          </button>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-500">
          {mode === "component"
            ? "Encodes all special characters (for query params, path segments)"
            : "Preserves URL-safe characters like :/?#[]@!$&'()*+,;="}
        </span>
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={
          mode === "component"
            ? "Enter text to encode (e.g. hello world&foo=bar)..."
            : "Enter a full URL to encode (e.g. https://example.com/path?q=hello world)..."
        }
        rows={8}
        className="w-full rounded-lg border border-gray-300 bg-white p-4 font-mono text-sm dark:border-gray-700 dark:bg-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      />

      <div className="flex flex-wrap items-center gap-2 mt-4">
        <button
          onClick={handleEncode}
          disabled={isLimited}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          Encode{" "}
          <kbd className="ml-1 hidden rounded bg-indigo-500 px-1.5 py-0.5 text-xs font-normal text-indigo-100 sm:inline">
            Ctrl+Enter
          </kbd>
        </button>
        <button
          onClick={handleDecode}
          disabled={isLimited}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          Decode
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
            rows={8}
            className="w-full rounded-lg border-0 bg-transparent p-4 font-mono text-sm text-gray-900 dark:text-gray-100 focus:outline-none"
          />
        </div>
      )}

      {/* Quick reference */}
      <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
          Quick Reference
        </h2>
        <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
          <p>
            <strong className="text-gray-800 dark:text-gray-200">
              Component mode
            </strong>{" "}
            uses <code className="rounded bg-gray-200 px-1 dark:bg-gray-800">encodeURIComponent</code> / <code className="rounded bg-gray-200 px-1 dark:bg-gray-800">decodeURIComponent</code> — encodes everything except <code className="rounded bg-gray-200 px-1 dark:bg-gray-800">A-Z a-z 0-9 - _ . ~ ! * &apos; ( )</code>. Best for query parameter values and path segments.
          </p>
          <p>
            <strong className="text-gray-800 dark:text-gray-200">
              Full URI mode
            </strong>{" "}
            uses <code className="rounded bg-gray-200 px-1 dark:bg-gray-800">encodeURI</code> / <code className="rounded bg-gray-200 px-1 dark:bg-gray-800">decodeURI</code> — preserves URL structure characters like <code className="rounded bg-gray-200 px-1 dark:bg-gray-800">: / ? # [ ] @ ! $ &amp; &apos; ( ) * + , ; =</code>. Best for encoding an entire URL while keeping its structure intact.
          </p>
        </div>
      </div>
    </div>
  );
}
