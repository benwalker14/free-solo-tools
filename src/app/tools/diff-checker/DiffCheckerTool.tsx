"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { diffLines, diffWords } from "diff";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";

type DiffMode = "lines" | "words";

export default function DiffCheckerTool() {
  const [original, setOriginal] = useState("");
  const [modified, setModified] = useState("");
  const [mode, setMode] = useState<DiffMode>("lines");
  const { trackFirstInteraction } = useToolAnalytics("diff-checker");

  const diff = useMemo(() => {
    if (!original && !modified) return [];
    if (mode === "words") return diffWords(original, modified);
    return diffLines(original, modified);
  }, [original, modified, mode]);

  const stats = useMemo(() => {
    let added = 0;
    let removed = 0;
    for (const part of diff) {
      if (part.added) added += part.count ?? 0;
      else if (part.removed) removed += part.count ?? 0;
    }
    return { added, removed };
  }, [diff]);

  const hasChanges = diff.some((part) => part.added || part.removed);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="mb-8 block text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        &larr; Back to tools
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Diff Checker
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Compare two blocks of text and see the differences highlighted.
      </p>

      <div className="mb-4 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Mode:
          </label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as DiffMode)}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
          >
            <option value="lines">Line by line</option>
            <option value="words">Word by word</option>
          </select>
        </div>
        <button
          onClick={() => {
            setOriginal(modified);
            setModified(original);
          }}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          Swap
        </button>
        <button
          onClick={() => {
            setOriginal("");
            setModified("");
          }}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          Clear
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Original
          </label>
          <textarea
            value={original}
            onChange={(e) => { trackFirstInteraction(); setOriginal(e.target.value); }}
            placeholder="Paste original text here..."
            className="h-[300px] w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 font-mono text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-600"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Modified
          </label>
          <textarea
            value={modified}
            onChange={(e) => { trackFirstInteraction(); setModified(e.target.value); }}
            placeholder="Paste modified text here..."
            className="h-[300px] w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 font-mono text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-600"
          />
        </div>
      </div>

      {(original || modified) && (
        <div className="mt-6">
          <div className="mb-3 flex items-center gap-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Differences
            </h3>
            {hasChanges ? (
              <div className="flex gap-3 text-xs">
                <span className="rounded bg-green-100 px-2 py-0.5 text-green-800 dark:bg-green-900 dark:text-green-200">
                  +{stats.added} added
                </span>
                <span className="rounded bg-red-100 px-2 py-0.5 text-red-800 dark:bg-red-900 dark:text-red-200">
                  -{stats.removed} removed
                </span>
              </div>
            ) : (
              <span className="text-xs text-gray-500">
                No differences found
              </span>
            )}
          </div>

          <div className="rounded-lg border border-gray-300 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-950">
            <pre className="whitespace-pre-wrap break-words font-mono text-sm text-gray-900 dark:text-gray-100">
              {diff.map((part, i) => (
                <span
                  key={i}
                  className={
                    part.added
                      ? "bg-green-200 text-green-900 dark:bg-green-900 dark:text-green-100"
                      : part.removed
                        ? "bg-red-200 text-red-900 line-through dark:bg-red-900 dark:text-red-100"
                        : ""
                  }
                >
                  {part.value}
                </span>
              ))}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
