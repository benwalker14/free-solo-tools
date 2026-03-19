import Link from "next/link";

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm font-mono text-indigo-600 dark:bg-gray-800 dark:text-indigo-400">
      {children}
    </code>
  );
}

function CodeBlock({ children, title }: { children: string; title?: string }) {
  return (
    <div className="my-6 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
      {title && (
        <div className="border-b border-gray-200 bg-gray-50 px-4 py-2 text-xs font-medium text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
          {title}
        </div>
      )}
      <pre className="overflow-x-auto bg-gray-50 p-4 text-sm leading-relaxed dark:bg-gray-900">
        <code className="font-mono text-gray-800 dark:text-gray-200">
          {children}
        </code>
      </pre>
    </div>
  );
}

function PatternTable({
  rows,
}: {
  rows: { pattern: string; description: string; example?: string }[];
}) {
  return (
    <div className="my-6 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-800">
            <th className="py-3 pr-4 text-left font-semibold text-gray-900 dark:text-white">
              Pattern
            </th>
            <th className="py-3 pr-4 text-left font-semibold text-gray-900 dark:text-white">
              Description
            </th>
            {rows.some((r) => r.example) && (
              <th className="py-3 text-left font-semibold text-gray-900 dark:text-white">
                Example
              </th>
            )}
          </tr>
        </thead>
        <tbody className="text-gray-600 dark:text-gray-400">
          {rows.map((row, i) => (
            <tr
              key={i}
              className="border-b border-gray-100 dark:border-gray-800/50"
            >
              <td className="py-3 pr-4">
                <Code>{row.pattern}</Code>
              </td>
              <td className="py-3 pr-4">{row.description}</td>
              {rows.some((r) => r.example) && (
                <td className="py-3 font-mono text-xs text-gray-500 dark:text-gray-500">
                  {row.example || ""}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function RegexCheatSheet() {
  return (
    <>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        Regular expressions are one of those tools that feel cryptic until they
        click — then you use them everywhere. This cheat sheet covers the
        syntax you&apos;ll actually need, with practical examples for common
        tasks like validation, parsing, and search-and-replace.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Metacharacters
      </h2>
      <p className="mb-2 text-gray-600 dark:text-gray-400">
        These characters have special meaning in regex. To match them literally,
        escape with a backslash (<Code>\</Code>).
      </p>
      <PatternTable
        rows={[
          { pattern: ".", description: "Any character except newline", example: "a.c → abc, a1c" },
          { pattern: "^", description: "Start of string (or line in multiline mode)", example: "^Hello" },
          { pattern: "$", description: "End of string (or line in multiline mode)", example: "world$" },
          { pattern: "\\", description: "Escape next character", example: "\\. matches literal dot" },
          { pattern: "|", description: "Alternation (OR)", example: "cat|dog" },
          { pattern: "()", description: "Capturing group", example: "(abc)+" },
          { pattern: "[]", description: "Character class", example: "[aeiou]" },
        ]}
      />

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Character Classes
      </h2>
      <PatternTable
        rows={[
          { pattern: "[abc]", description: "Match a, b, or c" },
          { pattern: "[^abc]", description: "Match anything except a, b, or c" },
          { pattern: "[a-z]", description: "Match any lowercase letter" },
          { pattern: "[A-Z0-9]", description: "Match uppercase letter or digit" },
          { pattern: "\\d", description: "Digit [0-9]" },
          { pattern: "\\D", description: "Non-digit [^0-9]" },
          { pattern: "\\w", description: "Word character [a-zA-Z0-9_]" },
          { pattern: "\\W", description: "Non-word character" },
          { pattern: "\\s", description: "Whitespace (space, tab, newline)" },
          { pattern: "\\S", description: "Non-whitespace" },
        ]}
      />

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Quantifiers
      </h2>
      <p className="mb-2 text-gray-600 dark:text-gray-400">
        Quantifiers specify how many times the preceding element should match.
        By default they are <strong className="text-gray-900 dark:text-white">greedy</strong> (match
        as much as possible). Add <Code>?</Code> to make them lazy.
      </p>
      <PatternTable
        rows={[
          { pattern: "*", description: "0 or more", example: "ab*c → ac, abc, abbc" },
          { pattern: "+", description: "1 or more", example: "ab+c → abc, abbc" },
          { pattern: "?", description: "0 or 1 (optional)", example: "colou?r → color, colour" },
          { pattern: "{n}", description: "Exactly n times", example: "\\d{4} → 2026" },
          { pattern: "{n,}", description: "n or more times", example: "\\d{2,} → 42, 123" },
          { pattern: "{n,m}", description: "Between n and m times", example: "\\d{2,4} → 42, 123, 2026" },
          { pattern: "*?", description: "0 or more (lazy)", example: "<.*?> → first tag only" },
          { pattern: "+?", description: "1 or more (lazy)" },
        ]}
      />

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Anchors & Boundaries
      </h2>
      <PatternTable
        rows={[
          { pattern: "^", description: "Start of string", example: "^Start" },
          { pattern: "$", description: "End of string", example: "end$" },
          { pattern: "\\b", description: "Word boundary", example: "\\bword\\b" },
          { pattern: "\\B", description: "Not a word boundary" },
        ]}
      />

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Groups & Backreferences
      </h2>
      <PatternTable
        rows={[
          { pattern: "(abc)", description: "Capturing group", example: "(\\d+)-(\\d+)" },
          { pattern: "(?:abc)", description: "Non-capturing group" },
          { pattern: "(?<name>abc)", description: "Named capturing group" },
          { pattern: "\\1", description: "Backreference to group 1", example: "(\\w+)\\s\\1 → word word" },
          { pattern: "(?=abc)", description: "Lookahead (matches if followed by abc)" },
          { pattern: "(?!abc)", description: "Negative lookahead" },
          { pattern: "(?<=abc)", description: "Lookbehind (matches if preceded by abc)" },
          { pattern: "(?<!abc)", description: "Negative lookbehind" },
        ]}
      />

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Flags
      </h2>
      <PatternTable
        rows={[
          { pattern: "g", description: "Global — find all matches, not just the first" },
          { pattern: "i", description: "Case-insensitive matching" },
          { pattern: "m", description: "Multiline — ^ and $ match line boundaries" },
          { pattern: "s", description: "Dotall — . matches newline characters" },
          { pattern: "u", description: "Unicode — correct handling of Unicode characters" },
        ]}
      />

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Common Patterns
      </h2>
      <p className="mb-4 text-gray-600 dark:text-gray-400">
        Copy-paste ready patterns for everyday validation and parsing tasks:
      </p>

      <h3 className="mt-6 mb-2 text-lg font-semibold text-gray-900 dark:text-white">
        Email (simplified)
      </h3>
      <CodeBlock>
        {`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$`}
      </CodeBlock>

      <h3 className="mt-6 mb-2 text-lg font-semibold text-gray-900 dark:text-white">
        URL
      </h3>
      <CodeBlock>
        {`https?:\\/\\/[\\w\\-]+(\\.[\\w\\-]+)+[\\/\\w\\-._~:?#[\\]@!$&'()*+,;=]*`}
      </CodeBlock>

      <h3 className="mt-6 mb-2 text-lg font-semibold text-gray-900 dark:text-white">
        IPv4 Address
      </h3>
      <CodeBlock>
        {`^(?:(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$`}
      </CodeBlock>

      <h3 className="mt-6 mb-2 text-lg font-semibold text-gray-900 dark:text-white">
        Date (YYYY-MM-DD)
      </h3>
      <CodeBlock>
        {`^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$`}
      </CodeBlock>

      <h3 className="mt-6 mb-2 text-lg font-semibold text-gray-900 dark:text-white">
        Hex Color
      </h3>
      <CodeBlock>
        {`^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$`}
      </CodeBlock>

      <h3 className="mt-6 mb-2 text-lg font-semibold text-gray-900 dark:text-white">
        Strong Password
      </h3>
      <p className="mb-2 text-gray-600 dark:text-gray-400">
        At least 8 characters, one uppercase, one lowercase, one digit, one
        special character:
      </p>
      <CodeBlock>
        {`^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$`}
      </CodeBlock>

      <h3 className="mt-6 mb-2 text-lg font-semibold text-gray-900 dark:text-white">
        HTML Tags
      </h3>
      <CodeBlock>
        {`<([a-zA-Z][a-zA-Z0-9]*)\\b[^>]*>(.*?)<\\/\\1>`}
      </CodeBlock>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Tips for Writing Better Regex
      </h2>
      <ul className="space-y-3 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Start simple</strong> — get a basic
            pattern working first, then refine edge cases.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Use non-capturing groups</strong>{" "}
            (<Code>(?:...)</Code>) when you don&apos;t need the match — it&apos;s
            faster and cleaner.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Be specific</strong> —{" "}
            <Code>\d{`{4}`}</Code> is better than <Code>\d+</Code> when you
            know you need exactly 4 digits.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Test with edge cases</strong> — empty
            strings, special characters, and Unicode input.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Avoid catastrophic backtracking</strong>{" "}
            — nested quantifiers like <Code>(a+)+</Code> can freeze your
            program on bad input.
          </span>
        </li>
      </ul>

      <div className="my-12 rounded-xl border border-blue-200 bg-blue-50/50 p-6 dark:border-blue-900 dark:bg-blue-950/30">
        <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">
          Using regex for server-side validation?
        </p>
        <p className="mt-2 text-sm text-blue-800 dark:text-blue-400">
          <a
            href="https://www.cloudways.com/"
            target="_blank"
            rel="noopener sponsored"
            className="font-medium underline hover:no-underline"
          >
            Cloudways
          </a>{" "}
          provides managed hosting with optimized PHP, Node.js, and Python
          stacks. Built-in SSL, firewalls, and automated backups so you can
          focus on your application logic.
        </p>
      </div>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Test Your Patterns
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Use our{" "}
        <Link
          href="/tools/regex-tester"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          Regex Tester
        </Link>{" "}
        to try these patterns with real-time highlighting. Paste any pattern
        from this guide and test it against your own input — everything runs
        locally in your browser.
      </p>
    </>
  );
}
