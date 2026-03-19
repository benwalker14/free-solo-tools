"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import RateLimitBanner from "@/components/RateLimitBanner";

/* ---------- Types ---------- */

type ViewMode = "inline" | "side-by-side";

interface DiffLine {
  type: "context" | "addition" | "deletion" | "hunk-header" | "file-header";
  content: string;
  oldLineNum: number | null;
  newLineNum: number | null;
}

interface DiffFile {
  oldName: string;
  newName: string;
  hunks: DiffHunk[];
  additions: number;
  deletions: number;
}

interface DiffHunk {
  header: string;
  lines: DiffLine[];
}

/* ---------- Parser ---------- */

function parseDiff(raw: string): DiffFile[] {
  const lines = raw.split("\n");
  const files: DiffFile[] = [];
  let currentFile: DiffFile | null = null;
  let currentHunk: DiffHunk | null = null;
  let oldLine = 0;
  let newLine = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // File header: diff --git a/... b/...
    if (line.startsWith("diff --git ") || line.startsWith("diff --combined ")) {
      if (currentFile) files.push(currentFile);
      currentFile = { oldName: "", newName: "", hunks: [], additions: 0, deletions: 0 };
      currentHunk = null;
      continue;
    }

    // Old file name
    if (line.startsWith("--- ")) {
      if (currentFile) {
        currentFile.oldName = line.slice(4).replace(/^a\//, "");
      }
      continue;
    }

    // New file name
    if (line.startsWith("+++ ")) {
      if (currentFile) {
        currentFile.newName = line.slice(4).replace(/^b\//, "");
      }
      continue;
    }

    // Skip index, mode, and other header lines
    if (
      line.startsWith("index ") ||
      line.startsWith("old mode ") ||
      line.startsWith("new mode ") ||
      line.startsWith("new file mode ") ||
      line.startsWith("deleted file mode ") ||
      line.startsWith("similarity index ") ||
      line.startsWith("rename from ") ||
      line.startsWith("rename to ") ||
      line.startsWith("copy from ") ||
      line.startsWith("copy to ") ||
      line.startsWith("Binary files ")
    ) {
      // If we have a current file but no name yet from --- and +++, try to extract from diff --git line
      continue;
    }

    // Hunk header: @@ -X,Y +A,B @@
    const hunkMatch = line.match(/^@@\s+-(\d+)(?:,\d+)?\s+\+(\d+)(?:,\d+)?\s+@@(.*)/);
    if (hunkMatch) {
      // If no currentFile, create one (handles diffs without "diff --git" prefix)
      if (!currentFile) {
        currentFile = { oldName: "", newName: "", hunks: [], additions: 0, deletions: 0 };
      }
      oldLine = parseInt(hunkMatch[1], 10);
      newLine = parseInt(hunkMatch[2], 10);
      currentHunk = {
        header: line,
        lines: [
          {
            type: "hunk-header",
            content: line,
            oldLineNum: null,
            newLineNum: null,
          },
        ],
      };
      currentFile.hunks.push(currentHunk);
      continue;
    }

    if (!currentHunk) {
      // If we see +/- lines without a hunk header yet, create a default file/hunk
      if (
        (line.startsWith("+") || line.startsWith("-") || line.startsWith(" ")) &&
        !currentFile
      ) {
        currentFile = { oldName: "", newName: "", hunks: [], additions: 0, deletions: 0 };
        oldLine = 1;
        newLine = 1;
        currentHunk = { header: "", lines: [] };
        currentFile.hunks.push(currentHunk);
      } else {
        continue;
      }
    }

    if (line.startsWith("+")) {
      currentHunk.lines.push({
        type: "addition",
        content: line.slice(1),
        oldLineNum: null,
        newLineNum: newLine,
      });
      newLine++;
      if (currentFile) currentFile.additions++;
    } else if (line.startsWith("-")) {
      currentHunk.lines.push({
        type: "deletion",
        content: line.slice(1),
        oldLineNum: oldLine,
        newLineNum: null,
      });
      oldLine++;
      if (currentFile) currentFile.deletions++;
    } else if (line.startsWith(" ") || line === "") {
      // Context line (or empty line within a hunk)
      if (currentHunk.lines.length > 0 || line.startsWith(" ")) {
        currentHunk.lines.push({
          type: "context",
          content: line.startsWith(" ") ? line.slice(1) : line,
          oldLineNum: oldLine,
          newLineNum: newLine,
        });
        oldLine++;
        newLine++;
      }
    } else if (line.startsWith("\\")) {
      // "\ No newline at end of file" — skip
      continue;
    }
  }

  if (currentFile) files.push(currentFile);
  return files;
}

/* ---------- Sample Diffs ---------- */

const SAMPLE_DIFFS = [
  {
    name: "Simple Change",
    diff: `diff --git a/src/utils.ts b/src/utils.ts
index a1b2c3d..e4f5g6h 100644
--- a/src/utils.ts
+++ b/src/utils.ts
@@ -1,7 +1,8 @@
-export function greet(name: string) {
-  return "Hello, " + name;
+export function greet(name: string, greeting = "Hello") {
+  return \`\${greeting}, \${name}!\`;
 }

-export function farewell(name: string) {
-  return "Goodbye, " + name;
+export function farewell(name: string, formal = false) {
+  const word = formal ? "Farewell" : "Goodbye";
+  return \`\${word}, \${name}!\`;
 }`,
  },
  {
    name: "Multiple Files",
    diff: `diff --git a/package.json b/package.json
index abc1234..def5678 100644
--- a/package.json
+++ b/package.json
@@ -3,7 +3,8 @@
   "version": "1.0.0",
   "dependencies": {
     "react": "^18.2.0",
-    "react-dom": "^18.2.0"
+    "react-dom": "^18.2.0",
+    "zustand": "^4.5.0"
   },
   "scripts": {
     "dev": "next dev",
diff --git a/src/store.ts b/src/store.ts
new file mode 100644
--- /dev/null
+++ b/src/store.ts
@@ -0,0 +1,12 @@
+import { create } from 'zustand';
+
+interface AppState {
+  count: number;
+  increment: () => void;
+  decrement: () => void;
+}
+
+export const useStore = create<AppState>((set) => ({
+  count: 0,
+  increment: () => set((s) => ({ count: s.count + 1 })),
+  decrement: () => set((s) => ({ count: s.count - 1 })),
+}));`,
  },
  {
    name: "Refactoring",
    diff: `diff --git a/src/api/handler.ts b/src/api/handler.ts
index 1a2b3c4..5d6e7f8 100644
--- a/src/api/handler.ts
+++ b/src/api/handler.ts
@@ -1,18 +1,22 @@
-import { Request, Response } from "express";
+import type { Request, Response, NextFunction } from "express";
+import { ValidationError, NotFoundError } from "./errors";

-export function handleGet(req: Request, res: Response) {
+export async function handleGet(
+  req: Request,
+  res: Response,
+  next: NextFunction,
+) {
   try {
     const id = req.params.id;
-    if (!id) {
-      res.status(400).json({ error: "Missing id" });
-      return;
+    if (!id || !/^[a-f0-9-]+$/.test(id)) {
+      throw new ValidationError("Invalid id format");
     }
-    // TODO: fetch from database
-    const data = { id, name: "Example" };
-    res.json(data);
-  } catch (err) {
-    console.log(err);
-    res.status(500).json({ error: "Server error" });
+    const data = await fetchById(id);
+    if (!data) {
+      throw new NotFoundError(\`Resource \${id} not found\`);
+    }
+    res.json({ status: "ok", data });
+  } catch (err: unknown) {
+    next(err);
   }
 }`,
  },
];

/* ---------- Component ---------- */

export default function GitDiffViewerTool() {
  const [input, setInput] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("inline");
  const [copied, setCopied] = useState(false);
  const { trackAction, trackFirstInteraction } = useToolAnalytics("git-diff-viewer");
  const { remaining, dailyLimit, isLimited, recordUsage } = useRateLimit("git-diff-viewer");

  const files = useMemo(() => {
    if (!input.trim()) return [];
    return parseDiff(input);
  }, [input]);

  const stats = useMemo(() => {
    let totalAdditions = 0;
    let totalDeletions = 0;
    for (const f of files) {
      totalAdditions += f.additions;
      totalDeletions += f.deletions;
    }
    return {
      filesChanged: files.length,
      additions: totalAdditions,
      deletions: totalDeletions,
    };
  }, [files]);

  const handleParse = useCallback(() => {
    if (!input.trim()) return;
    if (isLimited) return;
    recordUsage();
    trackAction("parse");
  }, [input, isLimited, recordUsage, trackAction]);

  useKeyboardShortcut("Enter", handleParse);

  const handleCopy = useCallback(async () => {
    if (!input) return;
    await navigator.clipboard.writeText(input);
    setCopied(true);
    trackAction("copy");
    setTimeout(() => setCopied(false), 2000);
  }, [input, trackAction]);

  const loadSample = useCallback(
    (diff: string) => {
      trackFirstInteraction();
      setInput(diff);
      if (!isLimited) {
        recordUsage();
        trackAction("sample");
      }
    },
    [trackFirstInteraction, isLimited, recordUsage, trackAction],
  );

  const handleClear = useCallback(() => {
    setInput("");
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="mb-8 block text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        &larr; Back to tools
      </Link>

      <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
        Git Diff Viewer
      </h1>
      <p className="mb-6 text-gray-600 dark:text-gray-400">
        Paste unified diff output (from <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm dark:bg-gray-800">git diff</code>) and view it with syntax
        highlighting, line numbers, and side-by-side or inline display.
      </p>

      <RateLimitBanner remaining={remaining} dailyLimit={dailyLimit} isLimited={isLimited} />

      {/* Controls */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">View:</label>
          <select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value as ViewMode)}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
          >
            <option value="inline">Inline</option>
            <option value="side-by-side">Side by Side</option>
          </select>
        </div>

        <button
          onClick={handleCopy}
          disabled={!input}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-40 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          {copied ? "Copied!" : "Copy Diff"}
        </button>

        <button
          onClick={handleClear}
          disabled={!input}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-40 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          Clear
        </button>

        <span className="text-xs text-gray-400 dark:text-gray-500">
          Ctrl+Enter to parse
        </span>
      </div>

      {/* Samples */}
      <div className="mb-4 flex flex-wrap gap-2">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Samples:</span>
        {SAMPLE_DIFFS.map((s) => (
          <button
            key={s.name}
            onClick={() => loadSample(s.diff)}
            className="rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-300 dark:hover:bg-indigo-900"
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* Input */}
      <textarea
        value={input}
        onChange={(e) => {
          trackFirstInteraction();
          setInput(e.target.value);
        }}
        placeholder={`Paste unified diff output here...\n\nExample:\ndiff --git a/file.ts b/file.ts\n--- a/file.ts\n+++ b/file.ts\n@@ -1,3 +1,4 @@\n import React from 'react';\n+import { useState } from 'react';\n \n export default function App() {`}
        className="mb-6 h-[200px] w-full resize-y rounded-lg border border-gray-300 bg-white px-4 py-3 font-mono text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-600"
      />

      {/* Stats */}
      {files.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {stats.filesChanged} file{stats.filesChanged !== 1 ? "s" : ""} changed
          </span>
          <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
            +{stats.additions} insertion{stats.additions !== 1 ? "s" : ""}
          </span>
          <span className="rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-200">
            -{stats.deletions} deletion{stats.deletions !== 1 ? "s" : ""}
          </span>
        </div>
      )}

      {/* Rendered Diff */}
      {files.map((file, fi) => (
        <div key={fi} className="mb-6 overflow-hidden rounded-lg border border-gray-300 dark:border-gray-700">
          {/* File header */}
          <div className="flex items-center justify-between border-b border-gray-300 bg-gray-100 px-4 py-2 dark:border-gray-700 dark:bg-gray-800">
            <span className="font-mono text-sm font-semibold text-gray-800 dark:text-gray-200">
              {file.newName || file.oldName || "unknown file"}
              {file.oldName && file.newName && file.oldName !== file.newName && file.oldName !== "/dev/null" && (
                <span className="ml-2 text-xs font-normal text-gray-500 dark:text-gray-400">
                  (renamed from {file.oldName})
                </span>
              )}
            </span>
            <div className="flex gap-2 text-xs">
              <span className="text-green-700 dark:text-green-400">+{file.additions}</span>
              <span className="text-red-700 dark:text-red-400">-{file.deletions}</span>
            </div>
          </div>

          {/* Diff content */}
          {viewMode === "inline" ? (
            <InlineView hunks={file.hunks} />
          ) : (
            <SideBySideView hunks={file.hunks} />
          )}
        </div>
      ))}

      {/* Empty state */}
      {!input.trim() && (
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">
            Paste a unified diff above to render it with syntax highlighting and line numbers.
          </p>
        </div>
      )}

      {input.trim() && files.length === 0 && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 dark:border-amber-700 dark:bg-amber-950">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            Could not parse any diff hunks. Make sure you paste a valid unified diff (output from <code className="rounded bg-amber-100 px-1 dark:bg-amber-900">git diff</code>).
          </p>
        </div>
      )}
    </div>
  );
}

/* ---------- Inline View ---------- */

function InlineView({ hunks }: { hunks: DiffHunk[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse font-mono text-sm">
        <tbody>
          {hunks.map((hunk, hi) =>
            hunk.lines.map((line, li) => {
              if (line.type === "hunk-header") {
                return (
                  <tr key={`${hi}-${li}`} className="bg-indigo-50 dark:bg-indigo-950">
                    <td
                      colSpan={3}
                      className="px-4 py-1 text-xs text-indigo-600 dark:text-indigo-400"
                    >
                      {line.content}
                    </td>
                  </tr>
                );
              }

              const bgClass =
                line.type === "addition"
                  ? "bg-green-50 dark:bg-green-950/40"
                  : line.type === "deletion"
                    ? "bg-red-50 dark:bg-red-950/40"
                    : "";

              const textClass =
                line.type === "addition"
                  ? "text-green-800 dark:text-green-300"
                  : line.type === "deletion"
                    ? "text-red-800 dark:text-red-300"
                    : "text-gray-700 dark:text-gray-300";

              const prefix =
                line.type === "addition" ? "+" : line.type === "deletion" ? "-" : " ";

              return (
                <tr key={`${hi}-${li}`} className={bgClass}>
                  <td className="w-12 select-none border-r border-gray-200 px-2 py-0 text-right text-xs text-gray-400 dark:border-gray-700 dark:text-gray-600">
                    {line.oldLineNum ?? ""}
                  </td>
                  <td className="w-12 select-none border-r border-gray-200 px-2 py-0 text-right text-xs text-gray-400 dark:border-gray-700 dark:text-gray-600">
                    {line.newLineNum ?? ""}
                  </td>
                  <td className={`whitespace-pre px-4 py-0 ${textClass}`}>
                    <span className="mr-2 select-none">{prefix}</span>
                    {line.content}
                  </td>
                </tr>
              );
            }),
          )}
        </tbody>
      </table>
    </div>
  );
}

/* ---------- Side-by-Side View ---------- */

interface SideBySidePair {
  left: DiffLine | null;
  right: DiffLine | null;
  type: "context" | "change" | "hunk-header";
  hunkHeader?: string;
}

function buildSideBySidePairs(hunks: DiffHunk[]): SideBySidePair[] {
  const pairs: SideBySidePair[] = [];

  for (const hunk of hunks) {
    let i = 0;
    const lines = hunk.lines;

    while (i < lines.length) {
      const line = lines[i];

      if (line.type === "hunk-header") {
        pairs.push({ left: null, right: null, type: "hunk-header", hunkHeader: line.content });
        i++;
        continue;
      }

      if (line.type === "context") {
        pairs.push({ left: line, right: line, type: "context" });
        i++;
        continue;
      }

      // Collect consecutive deletions and additions
      const deletions: DiffLine[] = [];
      const additions: DiffLine[] = [];

      while (i < lines.length && lines[i].type === "deletion") {
        deletions.push(lines[i]);
        i++;
      }
      while (i < lines.length && lines[i].type === "addition") {
        additions.push(lines[i]);
        i++;
      }

      const maxLen = Math.max(deletions.length, additions.length);
      for (let j = 0; j < maxLen; j++) {
        pairs.push({
          left: j < deletions.length ? deletions[j] : null,
          right: j < additions.length ? additions[j] : null,
          type: "change",
        });
      }
    }
  }

  return pairs;
}

function SideBySideView({ hunks }: { hunks: DiffHunk[] }) {
  const pairs = useMemo(() => buildSideBySidePairs(hunks), [hunks]);

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse font-mono text-sm">
        <tbody>
          {pairs.map((pair, pi) => {
            if (pair.type === "hunk-header") {
              return (
                <tr key={pi} className="bg-indigo-50 dark:bg-indigo-950">
                  <td
                    colSpan={4}
                    className="px-4 py-1 text-xs text-indigo-600 dark:text-indigo-400"
                  >
                    {pair.hunkHeader}
                  </td>
                </tr>
              );
            }

            const leftBg =
              pair.left?.type === "deletion"
                ? "bg-red-50 dark:bg-red-950/40"
                : "";
            const rightBg =
              pair.right?.type === "addition"
                ? "bg-green-50 dark:bg-green-950/40"
                : "";

            const leftText =
              pair.left?.type === "deletion"
                ? "text-red-800 dark:text-red-300"
                : "text-gray-700 dark:text-gray-300";
            const rightText =
              pair.right?.type === "addition"
                ? "text-green-800 dark:text-green-300"
                : "text-gray-700 dark:text-gray-300";

            return (
              <tr key={pi}>
                {/* Left side (old) */}
                <td
                  className={`w-12 select-none border-r border-gray-200 px-2 py-0 text-right text-xs text-gray-400 dark:border-gray-700 dark:text-gray-600 ${leftBg}`}
                >
                  {pair.left?.oldLineNum ?? ""}
                </td>
                <td
                  className={`w-1/2 whitespace-pre border-r border-gray-300 px-4 py-0 dark:border-gray-600 ${leftBg} ${leftText}`}
                >
                  {pair.left ? (
                    <>
                      <span className="mr-2 select-none">
                        {pair.left.type === "deletion" ? "-" : " "}
                      </span>
                      {pair.left.content}
                    </>
                  ) : null}
                </td>
                {/* Right side (new) */}
                <td
                  className={`w-12 select-none border-r border-gray-200 px-2 py-0 text-right text-xs text-gray-400 dark:border-gray-700 dark:text-gray-600 ${rightBg}`}
                >
                  {pair.right?.newLineNum ?? ""}
                </td>
                <td
                  className={`w-1/2 whitespace-pre px-4 py-0 ${rightBg} ${rightText}`}
                >
                  {pair.right ? (
                    <>
                      <span className="mr-2 select-none">
                        {pair.right.type === "addition" ? "+" : " "}
                      </span>
                      {pair.right.content}
                    </>
                  ) : null}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
