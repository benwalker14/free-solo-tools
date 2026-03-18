"use client";

import { useState } from "react";
import Link from "next/link";
import { useRateLimit } from "@/hooks/useRateLimit";
import RateLimitBanner from "@/components/RateLimitBanner";

const HASH_TYPES = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"] as const;
type HashType = (typeof HASH_TYPES)[number];

export default function HashGeneratorTool() {
  const [input, setInput] = useState("");
  const [hashType, setHashType] = useState<HashType>("SHA-256");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const { remaining, dailyLimit, isLimited, recordUsage } =
    useRateLimit("hash-generator");

  async function handleGenerate() {
    if (!input || isLimited) return;
    recordUsage();
    setLoading(true);
    setOutput("");
    try {
      const data = new TextEncoder().encode(input);
      const hashBuffer = await crypto.subtle.digest(hashType, data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      setOutput(hashHex);
    } catch {
      setOutput("Error generating hash");
    } finally {
      setLoading(false);
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
        Hash Generator
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Generate SHA-1, SHA-256, SHA-384, and SHA-512 hashes using the Web
        Crypto API.
      </p>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter text to hash..."
        rows={10}
        className="w-full rounded-lg border border-gray-300 bg-white p-4 font-mono text-sm dark:border-gray-700 dark:bg-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      />

      <div className="flex flex-wrap gap-2 mt-4">
        {HASH_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => setHashType(type)}
            className={
              hashType === type
                ? "rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors"
                : "rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
            }
          >
            {type}
          </button>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <button
          onClick={handleGenerate}
          disabled={loading || !input || isLimited}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate Hash"}
        </button>
        <RateLimitBanner
          remaining={remaining}
          dailyLimit={dailyLimit}
          isLimited={isLimited}
        />
      </div>

      {output && (
        <div className="relative mt-4 rounded-lg border border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-950">
          <button
            onClick={handleCopy}
            className="absolute right-2 top-2 rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Copy
          </button>
          <pre className="p-4 font-mono text-sm text-gray-900 dark:text-gray-100 break-all whitespace-pre-wrap">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}
