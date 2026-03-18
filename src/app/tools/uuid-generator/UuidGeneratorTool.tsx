"use client";

import { useState } from "react";
import Link from "next/link";
import { useRateLimit } from "@/hooks/useRateLimit";
import RateLimitBanner from "@/components/RateLimitBanner";

export default function UuidGeneratorTool() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(1);
  const { remaining, dailyLimit, isLimited, recordUsage } =
    useRateLimit("uuid-generator");

  function handleGenerate() {
    if (isLimited) return;
    recordUsage();
    const clamped = Math.max(1, Math.min(100, count));
    const generated: string[] = [];
    for (let i = 0; i < clamped; i++) {
      generated.push(crypto.randomUUID());
    }
    setUuids(generated);
  }

  function handleCopySingle(uuid: string) {
    navigator.clipboard.writeText(uuid);
  }

  function handleCopyAll() {
    if (uuids.length > 0) {
      navigator.clipboard.writeText(uuids.join("\n"));
    }
  }

  function handleClear() {
    setUuids([]);
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
        UUID Generator
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Generate random UUID v4 identifiers. Bulk generation supported.
      </p>

      <div className="flex flex-wrap gap-2 items-center">
        <button
          onClick={handleGenerate}
          disabled={isLimited}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          Generate UUID
        </button>

        <label className="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          Count:
          <input
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-20 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </label>

        {uuids.length > 0 && (
          <>
            <button
              onClick={handleCopyAll}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
            >
              Copy All
            </button>
            <button
              onClick={handleClear}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
            >
              Clear
            </button>
          </>
        )}
        <RateLimitBanner
          remaining={remaining}
          dailyLimit={dailyLimit}
          isLimited={isLimited}
        />
      </div>

      {uuids.length > 0 && (
        <div className="mt-4 rounded-lg border border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-950">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {uuids.map((uuid, index) => (
              <li
                key={index}
                className="flex items-center justify-between px-4 py-2"
              >
                <code className="font-mono text-sm text-gray-900 dark:text-gray-100">
                  {uuid}
                </code>
                <button
                  onClick={() => handleCopySingle(uuid)}
                  className="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Copy
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
