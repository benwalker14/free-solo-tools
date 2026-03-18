"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import RateLimitBanner from "@/components/RateLimitBanner";

export default function Base64Tool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const { remaining, dailyLimit, isLimited, recordUsage } =
    useRateLimit("base64");

  const handleEncode = useCallback(() => {
    if (isLimited) return;
    recordUsage();
    setError("");
    setOutput("");
    try {
      const encoded = btoa(unescape(encodeURIComponent(input)));
      setOutput(encoded);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to encode");
    }
  }, [input, isLimited, recordUsage]);

  useKeyboardShortcut("Enter", handleEncode);

  function handleDecode() {
    if (isLimited) return;
    recordUsage();
    setError("");
    setOutput("");
    try {
      const decoded = decodeURIComponent(escape(atob(input)));
      setOutput(decoded);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to decode. Make sure the input is valid Base64.");
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
        Base64 Encoder &amp; Decoder
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Encode and decode Base64 strings online. Fast and private.
      </p>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter text to encode or Base64 to decode..."
        rows={10}
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
            rows={10}
            className="w-full rounded-lg border-0 bg-transparent p-4 font-mono text-sm text-gray-900 dark:text-gray-100 focus:outline-none"
          />
        </div>
      )}
    </div>
  );
}
