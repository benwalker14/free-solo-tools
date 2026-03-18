"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { JSONPath } from "jsonpath-plus";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";
import RateLimitBanner from "@/components/RateLimitBanner";

const SAMPLE_JSON = `{
  "store": {
    "name": "TechBooks",
    "books": [
      {
        "title": "The Pragmatic Programmer",
        "author": "David Thomas",
        "price": 49.99,
        "tags": ["programming", "best-practices"],
        "inStock": true
      },
      {
        "title": "Clean Code",
        "author": "Robert C. Martin",
        "price": 39.99,
        "tags": ["programming", "refactoring"],
        "inStock": true
      },
      {
        "title": "Design Patterns",
        "author": "Gang of Four",
        "price": 54.99,
        "tags": ["programming", "architecture"],
        "inStock": false
      },
      {
        "title": "The Art of Computer Science",
        "author": "Donald Knuth",
        "price": 79.99,
        "tags": ["computer-science", "algorithms"],
        "inStock": true
      }
    ],
    "location": {
      "city": "San Francisco",
      "state": "CA",
      "zip": "94102"
    }
  }
}`;

const EXAMPLE_QUERIES = [
  { path: "$.store.books[*].title", description: "All book titles" },
  { path: "$.store.books[?(@.price < 50)]", description: "Books under $50" },
  { path: "$.store.books[?(@.inStock == true)].title", description: "In-stock book titles" },
  { path: "$..author", description: "All authors (recursive)" },
  { path: "$.store.books[0]", description: "First book" },
  { path: "$.store.books[-1:]", description: "Last book" },
  { path: "$.store.books[0:2]", description: "First two books" },
  { path: "$..tags[*]", description: "All tags (flattened)" },
];

export default function JsonPathTool() {
  const [jsonInput, setJsonInput] = useState("");
  const [pathInput, setPathInput] = useState("");
  const [output, setOutput] = useState("");
  const [matchCount, setMatchCount] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const { remaining, dailyLimit, isLimited, recordUsage } =
    useRateLimit("json-path");
  const { trackAction } = useToolAnalytics("json-path");

  const handleEvaluate = useCallback(() => {
    if (isLimited) return;
    recordUsage();
    trackAction("evaluate");
    setError("");
    setOutput("");
    setMatchCount(null);
    setCopied(false);

    if (!jsonInput.trim()) {
      setError("Please enter JSON data.");
      return;
    }
    if (!pathInput.trim()) {
      setError("Please enter a JSONPath expression.");
      return;
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonInput);
    } catch (e) {
      setError(
        "Invalid JSON: " + (e instanceof Error ? e.message : "Parse error")
      );
      return;
    }

    try {
      const results = JSONPath({ path: pathInput, json: parsed as object });
      setMatchCount(results.length);
      if (results.length === 0) {
        setOutput("No matches found.");
      } else if (results.length === 1) {
        setOutput(JSON.stringify(results[0], null, 2));
      } else {
        setOutput(JSON.stringify(results, null, 2));
      }
    } catch (e) {
      setError(
        "JSONPath error: " +
          (e instanceof Error ? e.message : "Invalid expression")
      );
    }
  }, [jsonInput, pathInput, isLimited, recordUsage, trackAction]);

  useKeyboardShortcut("Enter", handleEvaluate);

  function handleCopy() {
    if (output && output !== "No matches found.") {
      navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  }

  function handleLoadSample() {
    setJsonInput(SAMPLE_JSON);
    setPathInput("$.store.books[*].title");
    setOutput("");
    setError("");
    setMatchCount(null);
    setCopied(false);
  }

  function handleExampleClick(path: string) {
    setPathInput(path);
    setOutput("");
    setError("");
    setMatchCount(null);
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
        JSON Path Tester
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Test JSONPath expressions against your JSON data with real-time
        evaluation. Perfect for building API queries, data extraction, and
        debugging JSON structures.
      </p>

      {/* JSON Input */}
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        JSON Data
      </label>
      <textarea
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
        placeholder="Paste your JSON here..."
        rows={12}
        spellCheck={false}
        className="w-full rounded-lg border border-gray-300 bg-white p-4 font-mono text-sm dark:border-gray-700 dark:bg-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      />

      {/* JSONPath Input */}
      <label className="mt-4 block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        JSONPath Expression
      </label>
      <input
        type="text"
        value={pathInput}
        onChange={(e) => setPathInput(e.target.value)}
        placeholder="$.store.books[*].title"
        spellCheck={false}
        className="w-full rounded-lg border border-gray-300 bg-white p-3 font-mono text-sm dark:border-gray-700 dark:bg-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      />

      {/* Example queries */}
      {jsonInput.trim() && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {EXAMPLE_QUERIES.map((ex) => (
            <button
              key={ex.path}
              onClick={() => handleExampleClick(ex.path)}
              title={ex.path}
              className="rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-xs text-gray-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-indigo-950 dark:hover:border-indigo-800 dark:hover:text-indigo-300 transition-colors"
            >
              {ex.description}
            </button>
          ))}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-wrap items-center gap-2 mt-4">
        <button
          onClick={handleEvaluate}
          disabled={isLimited}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          Evaluate{" "}
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
        <RateLimitBanner
          remaining={remaining}
          dailyLimit={dailyLimit}
          isLimited={isLimited}
        />
      </div>

      {/* Error */}
      {error && (
        <div className="mt-4 rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-600 dark:bg-red-950 dark:border-red-800 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Results */}
      {output && (
        <div className="mt-4">
          {matchCount !== null && (
            <div className="mb-2 text-sm text-gray-600 dark:text-gray-400">
              {matchCount === 0
                ? "No matches"
                : `${matchCount} match${matchCount === 1 ? "" : "es"} found`}
            </div>
          )}
          <div className="relative rounded-lg border border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-950">
            {output !== "No matches found." && (
              <button
                onClick={handleCopy}
                className="absolute right-2 top-2 rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            )}
            <textarea
              readOnly
              value={output}
              rows={Math.min(20, output.split("\n").length + 1)}
              spellCheck={false}
              className="w-full rounded-lg border-0 bg-transparent p-4 font-mono text-sm text-gray-900 dark:text-gray-100 focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* About section */}
      <details className="mt-8 rounded-lg border border-gray-200 dark:border-gray-700">
        <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          About JSONPath
        </summary>
        <div className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400 space-y-3">
          <p>
            JSONPath is a query language for JSON, similar to XPath for XML. It
            lets you extract specific values from complex JSON structures using
            path expressions.
          </p>
          <div>
            <strong>Common syntax:</strong>
            <ul className="mt-1 ml-4 list-disc space-y-1">
              <li>
                <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">$</code>{" "}
                — root object
              </li>
              <li>
                <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">.key</code>{" "}
                — child property
              </li>
              <li>
                <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">[*]</code>{" "}
                — all array elements
              </li>
              <li>
                <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">[0]</code>,{" "}
                <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">[0:3]</code>{" "}
                — array index / slice
              </li>
              <li>
                <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">..</code>{" "}
                — recursive descent (search all levels)
              </li>
              <li>
                <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">[?(@.price &lt; 50)]</code>{" "}
                — filter expression
              </li>
            </ul>
          </div>
          <p>
            JSONPath is commonly used in REST API testing, data pipelines, and
            configuration management to extract or validate specific fields from
            JSON payloads.
          </p>
          <p>
            Everything runs in your browser — no data is sent over the network.
          </p>
        </div>
      </details>
    </div>
  );
}
