"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PatternEntry {
  pattern: string;
  description: string;
  example: string;
}

interface Category {
  name: string;
  slug: string;
  entries: PatternEntry[];
}

interface FAQ {
  question: string;
  answer: string;
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const categories: Category[] = [
  {
    name: "Metacharacters",
    slug: "metacharacters",
    entries: [
      { pattern: ".", description: "Matches any character except newline", example: "a.c matches \"abc\", \"a1c\", \"a-c\"" },
      { pattern: "^", description: "Start of string (or line in multiline mode)", example: "^Hello matches \"Hello world\"" },
      { pattern: "$", description: "End of string (or line in multiline mode)", example: "world$ matches \"Hello world\"" },
      { pattern: "\\", description: "Escapes a metacharacter to match it literally", example: "\\. matches a literal dot \".\"" },
      { pattern: "|", description: "Alternation — matches the expression before or after", example: "cat|dog matches \"cat\" or \"dog\"" },
      { pattern: "()", description: "Grouping — groups expressions and captures matches", example: "(ab)+ matches \"abab\"" },
      { pattern: "[]", description: "Character class — matches any single character inside", example: "[aeiou] matches any vowel" },
    ],
  },
  {
    name: "Character Classes",
    slug: "character-classes",
    entries: [
      { pattern: "[abc]", description: "Matches any one of a, b, or c", example: "[abc] in \"apple\" matches \"a\"" },
      { pattern: "[^abc]", description: "Matches any character NOT a, b, or c", example: "[^abc] in \"apple\" matches \"p\"" },
      { pattern: "[a-z]", description: "Matches any lowercase letter a through z", example: "[a-z]+ matches \"hello\"" },
      { pattern: "[A-Z0-9]", description: "Matches any uppercase letter or digit", example: "[A-Z0-9] matches \"A\" or \"5\"" },
      { pattern: "\\d", description: "Matches any digit (equivalent to [0-9])", example: "\\d{3} matches \"123\"" },
      { pattern: "\\D", description: "Matches any non-digit character", example: "\\D+ matches \"abc\"" },
      { pattern: "\\w", description: "Matches any word character [a-zA-Z0-9_]", example: "\\w+ matches \"hello_42\"" },
      { pattern: "\\W", description: "Matches any non-word character", example: "\\W matches \"@\" in \"a@b\"" },
      { pattern: "\\s", description: "Matches any whitespace (space, tab, newline)", example: "\\s+ matches \" \" (spaces)" },
      { pattern: "\\S", description: "Matches any non-whitespace character", example: "\\S+ matches \"hello\"" },
      { pattern: "\\t", description: "Matches a tab character", example: "\\t matches tab in \"a\\tb\"" },
      { pattern: "\\n", description: "Matches a newline character", example: "\\n matches line breaks" },
    ],
  },
  {
    name: "Quantifiers",
    slug: "quantifiers",
    entries: [
      { pattern: "*", description: "Matches 0 or more of the preceding element (greedy)", example: "ab*c matches \"ac\", \"abc\", \"abbc\"" },
      { pattern: "+", description: "Matches 1 or more of the preceding element (greedy)", example: "ab+c matches \"abc\", \"abbc\" but not \"ac\"" },
      { pattern: "?", description: "Matches 0 or 1 of the preceding element", example: "colou?r matches \"color\" and \"colour\"" },
      { pattern: "{n}", description: "Matches exactly n occurrences", example: "\\d{4} matches \"2026\"" },
      { pattern: "{n,}", description: "Matches n or more occurrences", example: "\\d{2,} matches \"42\" and \"123\"" },
      { pattern: "{n,m}", description: "Matches between n and m occurrences", example: "\\d{2,4} matches \"42\", \"123\", \"2026\"" },
      { pattern: "*? / +?", description: "Lazy quantifiers -- match as few characters as possible", example: "<.*?> matches \"<b>\" in \"<b>bold</b>\"" },
      { pattern: "*+ / ++", description: "Possessive quantifiers -- no backtracking (if supported)", example: "a++b prevents backtracking on a's" },
    ],
  },
  {
    name: "Anchors & Boundaries",
    slug: "anchors",
    entries: [
      { pattern: "^", description: "Matches the start of the string", example: "^foo matches \"foo bar\" but not \"bar foo\"" },
      { pattern: "$", description: "Matches the end of the string", example: "bar$ matches \"foo bar\" but not \"bar foo\"" },
      { pattern: "\\b", description: "Word boundary -- between a word and non-word character", example: "\\bcat\\b matches \"cat\" not \"catch\"" },
      { pattern: "\\B", description: "Non-word boundary -- NOT at a word boundary", example: "\\Bcat matches \"scat\" but not \"cat\"" },
      { pattern: "\\A / \\Z", description: "Absolute start / end of string (ignores multiline flag)", example: "\\Afoo matches only at very start of input" },
    ],
  },
  {
    name: "Groups & Lookaround",
    slug: "groups",
    entries: [
      { pattern: "(abc)", description: "Capturing group -- captures matched text for backreference", example: "(\\d+)-(\\d+) captures \"12\" and \"34\"" },
      { pattern: "(?:abc)", description: "Non-capturing group -- groups without capturing", example: "(?:ab)+ matches \"abab\" without capture" },
      { pattern: "(?<name>abc)", description: "Named capturing group", example: "(?<year>\\d{4}) captures and names it \"year\"" },
      { pattern: "\\1", description: "Backreference -- matches same text as group 1", example: "(\\w+)\\s\\1 matches \"the the\"" },
      { pattern: "(?=abc)", description: "Positive lookahead -- asserts what follows matches", example: "\\d(?=px) matches \"5\" in \"5px\"" },
      { pattern: "(?!abc)", description: "Negative lookahead -- asserts what follows does NOT match", example: "\\d(?!px) matches \"5\" in \"5em\"" },
      { pattern: "(?<=abc)", description: "Positive lookbehind -- asserts what precedes matches", example: "(?<=\\$)\\d+ matches \"50\" in \"$50\"" },
      { pattern: "(?<!abc)", description: "Negative lookbehind -- asserts what precedes does NOT match", example: "(?<!\\$)\\d+ matches \"50\" in \"50 items\"" },
    ],
  },
  {
    name: "Flags",
    slug: "flags",
    entries: [
      { pattern: "g", description: "Global -- find all matches, not just the first", example: "/a/g in \"banana\" matches all 3 a's" },
      { pattern: "i", description: "Case-insensitive matching", example: "/hello/i matches \"Hello\", \"HELLO\"" },
      { pattern: "m", description: "Multiline -- ^ and $ match line starts/ends", example: "/^foo/m matches \"foo\" on any line" },
      { pattern: "s", description: "Dotall -- makes . match newline characters too", example: "/a.b/s matches \"a\\nb\"" },
      { pattern: "u", description: "Unicode -- enables full Unicode matching", example: "/\\u{1F600}/u matches emoji" },
      { pattern: "y", description: "Sticky -- matches only at lastIndex position", example: "/foo/y matches at exact position" },
    ],
  },
  {
    name: "Common Patterns",
    slug: "common-patterns",
    entries: [
      { pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}", description: "Email address", example: "user@example.com" },
      { pattern: "https?:\\/\\/[\\w\\-._~:/?#\\[\\]@!$&'()*+,;=%]+", description: "URL (http/https)", example: "https://devbolt.dev/tools" },
      { pattern: "\\b\\d{1,3}(\\.\\d{1,3}){3}\\b", description: "IPv4 address", example: "192.168.1.1" },
      { pattern: "\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])", description: "Date in YYYY-MM-DD format", example: "2026-03-19" },
      { pattern: "#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})", description: "Hex color code", example: "#1a2b3c or #abc" },
      { pattern: "\\+?\\d{1,3}[-.\\s]?\\(?\\d{1,4}\\)?[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,9}", description: "Phone number (international)", example: "+1 (555) 123-4567" },
      { pattern: "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}", description: "UUID v4 format", example: "550e8400-e29b-41d4-a716-446655440000" },
      { pattern: "(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}", description: "Strong password (8+ chars, upper, lower, digit, special)", example: "P@ssw0rd!" },
      { pattern: "<([a-zA-Z][a-zA-Z0-9]*)\\b[^>]*>(.*?)<\\/\\1>", description: "HTML tag with content (simple)", example: "<b>bold text</b>" },
      { pattern: "^\\s+|\\s+$", description: "Leading and trailing whitespace (for trimming)", example: "\"  hello  \" captures spaces" },
      { pattern: "\\d{1,3}(,\\d{3})*(\\.\\d+)?", description: "Number with commas and optional decimals", example: "1,234,567.89" },
      { pattern: "[a-z0-9]+(?:-[a-z0-9]+)*", description: "URL-friendly slug", example: "my-blog-post-title" },
      { pattern: "\\b[A-Z][a-z]+(?:\\s[A-Z][a-z]+)*\\b", description: "Capitalized words (proper names)", example: "John Smith" },
      { pattern: "(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)", description: "Single IPv4 octet (0-255)", example: "255, 192, 0" },
    ],
  },
];

const ALL_TAB = "all";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function RegexCheatSheet({ faqs }: { faqs: FAQ[] }) {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState(ALL_TAB);
  const [copiedPattern, setCopiedPattern] = useState<string | null>(null);

  // Filter logic
  const filteredCategories = useMemo(() => {
    const query = search.toLowerCase().trim();
    return categories
      .filter((cat) => activeTab === ALL_TAB || cat.slug === activeTab)
      .map((cat) => ({
        ...cat,
        entries: cat.entries.filter(
          (entry) =>
            !query ||
            entry.pattern.toLowerCase().includes(query) ||
            entry.description.toLowerCase().includes(query) ||
            entry.example.toLowerCase().includes(query)
        ),
      }))
      .filter((cat) => cat.entries.length > 0);
  }, [search, activeTab]);

  const totalEntries = categories.reduce((sum, cat) => sum + cat.entries.length, 0);
  const visibleEntries = filteredCategories.reduce((sum, cat) => sum + cat.entries.length, 0);

  const handleCopy = async (pattern: string) => {
    await copyToClipboard(pattern);
    setCopiedPattern(pattern);
    setTimeout(() => setCopiedPattern(null), 1500);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      {/* Header */}
      <div className="mx-auto max-w-4xl">
        <nav className="mb-8 text-sm text-gray-500 dark:text-gray-400">
          <Link
            href="/cheatsheets"
            className="transition-colors hover:text-gray-700 dark:hover:text-gray-300"
          >
            Cheat Sheets
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 dark:text-white">Regex</span>
        </nav>

        <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          Regex Cheat Sheet
        </h1>
        <p className="mb-8 text-lg text-gray-600 dark:text-gray-400">
          Interactive regular expression reference with {totalEntries} patterns.
          Search, filter by category, copy any pattern, or click &ldquo;Try it&rdquo; to
          test in the Regex Tester.
        </p>
      </div>

      {/* Search */}
      <div className="mx-auto mb-6 max-w-4xl">
        <div className="relative">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search patterns, descriptions, or examples..."
            className="w-full rounded-lg border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder-gray-500 dark:focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Category tabs */}
      <div className="mx-auto mb-6 max-w-4xl">
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
          <button
            onClick={() => setActiveTab(ALL_TAB)}
            className={`shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === ALL_TAB
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setActiveTab(cat.slug)}
              className={`shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === cat.slug
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Match count */}
      <div className="mx-auto mb-8 max-w-4xl">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Showing {visibleEntries} of {totalEntries} patterns
        </p>
      </div>

      {/* Pattern tables */}
      <div className="mx-auto max-w-4xl space-y-10">
        {filteredCategories.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-12 text-center dark:border-gray-800 dark:bg-gray-900">
            <p className="text-gray-500 dark:text-gray-400">
              No patterns match your search. Try a different query.
            </p>
          </div>
        ) : (
          filteredCategories.map((cat) => (
            <section key={cat.slug}>
              <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
                {cat.name}
              </h2>
              <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
                {/* Table header */}
                <div className="hidden grid-cols-[minmax(120px,1fr)_2fr_2fr_auto] gap-4 border-b border-gray-200 bg-gray-50 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:border-gray-800 dark:bg-gray-900/50 dark:text-gray-400 sm:grid">
                  <div>Pattern</div>
                  <div>Description</div>
                  <div>Example</div>
                  <div className="text-right">Actions</div>
                </div>
                {/* Rows */}
                <div className="divide-y divide-gray-100 bg-white dark:divide-gray-800/50 dark:bg-gray-900">
                  {cat.entries.map((entry, idx) => (
                    <div
                      key={idx}
                      className="group grid grid-cols-1 gap-2 px-4 py-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/40 sm:grid-cols-[minmax(120px,1fr)_2fr_2fr_auto] sm:items-center sm:gap-4"
                    >
                      {/* Pattern */}
                      <div>
                        <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm font-mono text-indigo-600 dark:bg-gray-800 dark:text-indigo-400">
                          {entry.pattern}
                        </code>
                      </div>
                      {/* Description */}
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        {entry.description}
                      </div>
                      {/* Example */}
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {entry.example}
                      </div>
                      {/* Actions */}
                      <div className="flex items-center gap-2 sm:justify-end">
                        <button
                          onClick={() => handleCopy(entry.pattern)}
                          className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2.5 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                          title="Copy pattern"
                        >
                          {copiedPattern === entry.pattern ? (
                            <>
                              <svg className="h-3.5 w-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                              Copied
                            </>
                          ) : (
                            <>
                              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                              Copy
                            </>
                          )}
                        </button>
                        <Link
                          href="/tools/regex-tester"
                          className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2.5 py-1.5 text-xs font-medium text-indigo-600 transition-colors hover:bg-indigo-100 dark:bg-indigo-950/50 dark:text-indigo-400 dark:hover:bg-indigo-900/50"
                        >
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Try it
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ))
        )}
      </div>

      {/* FAQ Section */}
      <div className="mx-auto mt-16 max-w-4xl">
        <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
          Frequently Asked Questions
        </h2>
        <div className="divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900">
          {faqs.map((faq, i) => (
            <details key={i} className="group" open={i === 0}>
              <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 text-left text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50 dark:text-white dark:hover:bg-gray-800/50 [&::-webkit-details-marker]:hidden">
                <span>{faq.question}</span>
                <svg
                  className="ml-3 h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200 group-open:rotate-180"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </summary>
              <div className="px-5 pb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* Related Tools */}
      <div className="mx-auto mt-16 max-w-4xl">
        <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
          Related Tools
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/tools/regex-tester"
            className="group rounded-lg border border-gray-200 bg-white p-5 transition-all hover:border-indigo-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-indigo-700"
          >
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                Regex Tester
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Test patterns with real-time highlighting, capture groups, and match details.
            </p>
          </Link>
          <Link
            href="/tools/regex-generator"
            className="group rounded-lg border border-gray-200 bg-white p-5 transition-all hover:border-indigo-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-indigo-700"
          >
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                Regex Generator
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Generate regex patterns from plain English descriptions using AI.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
