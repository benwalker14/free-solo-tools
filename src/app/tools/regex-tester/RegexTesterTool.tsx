"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

interface MatchResult {
  fullMatch: string;
  index: number;
  groups: string[];
}

function getMatches(pattern: string, flags: string, text: string): MatchResult[] {
  if (!pattern || !text) return [];

  try {
    const effectiveFlags = flags.includes("g") ? flags : flags + "g";
    const regex = new RegExp(pattern, effectiveFlags);
    const results: MatchResult[] = [];

    let match: RegExpExecArray | null;
    let safety = 0;
    while ((match = regex.exec(text)) !== null && safety < 1000) {
      results.push({
        fullMatch: match[0],
        index: match.index,
        groups: match.slice(1),
      });
      if (match[0].length === 0) regex.lastIndex++;
      safety++;
    }
    return results;
  } catch {
    return [];
  }
}

function getRegexError(pattern: string, flags: string): string | null {
  if (!pattern) return null;
  try {
    new RegExp(pattern, flags);
    return null;
  } catch (e) {
    return e instanceof Error ? e.message : "Invalid regex";
  }
}

const FLAG_OPTIONS = [
  { flag: "g", label: "Global", description: "Find all matches" },
  { flag: "i", label: "Case Insensitive", description: "Ignore case" },
  { flag: "m", label: "Multiline", description: "^ and $ match line boundaries" },
  { flag: "s", label: "Dotall", description: ". matches newlines" },
];

export default function RegexTesterTool() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [testString, setTestString] = useState("");

  const regexError = useMemo(() => getRegexError(pattern, flags), [pattern, flags]);
  const matches = useMemo(
    () => (regexError ? [] : getMatches(pattern, flags, testString)),
    [pattern, flags, testString, regexError]
  );

  function toggleFlag(flag: string) {
    setFlags((prev) =>
      prev.includes(flag) ? prev.replace(flag, "") : prev + flag
    );
  }

  const highlightedText = useMemo(() => {
    if (!pattern || !testString || regexError || matches.length === 0) {
      return null;
    }

    const parts: { text: string; highlight: boolean }[] = [];
    let lastIndex = 0;

    for (const match of matches) {
      if (match.index > lastIndex) {
        parts.push({
          text: testString.slice(lastIndex, match.index),
          highlight: false,
        });
      }
      parts.push({ text: match.fullMatch, highlight: true });
      lastIndex = match.index + match.fullMatch.length;
    }

    if (lastIndex < testString.length) {
      parts.push({ text: testString.slice(lastIndex), highlight: false });
    }

    return parts;
  }, [pattern, testString, regexError, matches]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="mb-8 block text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        &larr; Back to tools
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Regex Tester
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Test regular expressions in real time with match highlighting and
        capture groups.
      </p>

      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Pattern
          </label>
          <div className="flex items-center gap-2">
            <span className="text-gray-400 dark:text-gray-500 font-mono">/</span>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="Enter regex pattern..."
              className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 font-mono text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-600"
            />
            <span className="text-gray-400 dark:text-gray-500 font-mono">
              /{flags}
            </span>
          </div>
          {regexError && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {regexError}
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          {FLAG_OPTIONS.map(({ flag, label, description }) => (
            <label
              key={flag}
              className="inline-flex items-center gap-1.5 text-sm"
              title={description}
            >
              <input
                type="checkbox"
                checked={flags.includes(flag)}
                onChange={() => toggleFlag(flag)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800"
              />
              <span className="text-gray-700 dark:text-gray-300">{label}</span>
              <span className="font-mono text-xs text-gray-400">({flag})</span>
            </label>
          ))}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Test String
          </label>
          <textarea
            value={testString}
            onChange={(e) => setTestString(e.target.value)}
            placeholder="Enter text to test against..."
            rows={6}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 font-mono text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-600"
          />
        </div>

        {highlightedText && (
          <div>
            <h3 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Highlighted Matches
            </h3>
            <div className="rounded-lg border border-gray-300 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-950">
              <pre className="whitespace-pre-wrap break-words font-mono text-sm text-gray-900 dark:text-gray-100">
                {highlightedText.map((part, i) =>
                  part.highlight ? (
                    <mark
                      key={i}
                      className="rounded bg-yellow-200 px-0.5 text-gray-900 dark:bg-yellow-800 dark:text-yellow-100"
                    >
                      {part.text}
                    </mark>
                  ) : (
                    <span key={i}>{part.text}</span>
                  )
                )}
              </pre>
            </div>
          </div>
        )}

        <div>
          <h3 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
            Matches ({matches.length})
          </h3>
          {matches.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-500">
              {pattern
                ? "No matches found"
                : "Enter a pattern and test string to see matches"}
            </p>
          ) : (
            <div className="rounded-lg border border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-950">
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {matches.map((match, i) => (
                  <li key={i} className="px-4 py-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium text-gray-400 dark:text-gray-500">
                        #{i + 1}
                      </span>
                      <code className="font-mono text-sm text-gray-900 dark:text-gray-100">
                        &quot;{match.fullMatch}&quot;
                      </code>
                      <span className="text-xs text-gray-500 dark:text-gray-500">
                        at index {match.index}
                      </span>
                    </div>
                    {match.groups.length > 0 && (
                      <div className="mt-1 ml-8 flex flex-wrap gap-2">
                        {match.groups.map((group, gi) => (
                          <span
                            key={gi}
                            className="rounded bg-indigo-50 px-2 py-0.5 text-xs font-mono text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                          >
                            Group {gi + 1}: &quot;{group ?? ""}&quot;
                          </span>
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
