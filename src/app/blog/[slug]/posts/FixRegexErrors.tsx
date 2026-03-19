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

export default function FixRegexErrors() {
  return (
    <>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        Regex errors almost always come down to one of three things: a syntax
        mistake in the pattern itself, a logic error where the pattern matches
        more or less than you intended, or a language-specific escaping issue
        that silently changes your expression. This guide walks through every
        common regex problem, explains why it happens, and shows you how to fix
        it.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        How Regex Engines Work (Quick Overview)
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Before debugging regex, it helps to understand what the engine is
        actually doing. Most regex engines (Perl, Python, JavaScript, Java) use
        a <strong className="text-gray-900 dark:text-white">backtracking NFA</strong>{" "}
        (nondeterministic finite automaton). The engine reads your pattern left
        to right, tries to match each token against the input string, and
        backtracks when it hits a dead end.
      </p>
      <p className="mt-4 text-gray-600 dark:text-gray-400">
        Three concepts explain most regex behavior:
      </p>
      <ul className="mt-4 space-y-3 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Greedy matching</strong>{" "}
            — quantifiers like <Code>*</Code>, <Code>+</Code>, and{" "}
            <Code>{`{n,m}`}</Code> match as much text as possible, then give
            back characters one at a time until the rest of the pattern succeeds.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Lazy matching</strong>{" "}
            — appending <Code>?</Code> to a quantifier (<Code>*?</Code>,{" "}
            <Code>+?</Code>) reverses this: it matches as little as possible
            first, expanding only when needed.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Backtracking</strong>{" "}
            — when the engine can&apos;t match the next token, it rewinds to the
            last choice point and tries a different path. Excessive backtracking
            is the root cause of catastrophic performance.
          </span>
        </li>
      </ul>
      <p className="mt-4 text-gray-600 dark:text-gray-400">
        Go&apos;s RE2 engine is different — it uses a DFA approach that
        guarantees linear-time matching but sacrifices features like
        backreferences and lookahead. Knowing your engine matters when debugging.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        The 10 Most Common Regex Errors
      </h2>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        1. Unescaped Special Characters
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Characters like <Code>.</Code>, <Code>*</Code>, <Code>+</Code>,{" "}
        <Code>?</Code>, <Code>(</Code>, <Code>)</Code>, <Code>[</Code>,{" "}
        <Code>{`{`}</Code>, <Code>^</Code>, <Code>$</Code>, <Code>|</Code>, and{" "}
        <Code>\</Code> have special meaning. If you want to match a literal dot
        in a filename, you need <Code>\.</Code> — not <Code>.</Code>, which
        matches any character.
      </p>
      <CodeBlock title="Bug: matches 'file_txt' too">{`/file.txt/`}</CodeBlock>
      <CodeBlock title="Fix: escaped dot">{`/file\\.txt/`}</CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        2. Greedy vs Lazy Matching
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        The classic mistake: using <Code>.*</Code> to extract content between
        delimiters. Greedy <Code>.*</Code> consumes everything, so if your
        string has multiple delimiters, you get the longest possible match
        instead of the shortest.
      </p>
      <CodeBlock title="Greedy: matches from first < to last >">{`<.*>`}</CodeBlock>
      <CodeBlock title="Lazy: matches each tag individually">{`<.*?>`}</CodeBlock>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        Given <Code>{`<b>hello</b>`}</Code>, the greedy version matches the
        entire string. The lazy version matches <Code>{`<b>`}</Code> and{" "}
        <Code>{`</b>`}</Code> separately.
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        3. Missing Anchors
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        If you write a regex to validate an email but forget <Code>^</Code> and{" "}
        <Code>$</Code>, the pattern will happily match{" "}
        <Code>!!!user@example.com!!!</Code> because the valid email is a
        substring. Always anchor patterns used for validation.
      </p>
      <CodeBlock title="Bug: partial match passes validation">{`/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}/`}</CodeBlock>
      <CodeBlock title="Fix: anchored for full-string match">{`/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/`}</CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        4. Character Class Mistakes
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Writing <Code>[a-Z]</Code> looks reasonable, but ASCII puts several
        special characters between <Code>Z</Code> (90) and <Code>a</Code> (97).
        Most engines will either error or match unintended characters like{" "}
        <Code>[</Code>, <Code>\</Code>, <Code>]</Code>, <Code>^</Code>, and{" "}
        <Code>_</Code>. Use <Code>[a-zA-Z]</Code> instead.
      </p>
      <CodeBlock title="Bug: invalid or overly broad range">{`/[a-Z]+/`}</CodeBlock>
      <CodeBlock title="Fix: explicit uppercase and lowercase ranges">{`/[a-zA-Z]+/`}</CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        5. Catastrophic Backtracking
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Nested quantifiers like <Code>(a+)+</Code>, <Code>(.*a){`{10}`}</Code>,
        or <Code>([a-zA-Z]+)*</Code> create exponential backtracking paths. On
        input that almost-but-doesn&apos;t-quite match, the engine tries every
        permutation before failing — freezing your program for seconds or
        minutes.
      </p>
      <CodeBlock title="Dangerous: exponential backtracking">{`/(a+)+b/
// Test with: "aaaaaaaaaaaaaaaaac"
// Engine tries 2^n paths before failing`}</CodeBlock>
      <CodeBlock title="Fix: flatten the nesting">{`/a+b/`}</CodeBlock>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        Use atomic groups <Code>{'(?>...)'}</Code> or possessive quantifiers{" "}
        <Code>a++</Code> where supported. Or switch to a linear-time engine
        like RE2.
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        6. Forgetting Flags
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Your pattern looks correct but doesn&apos;t match? Check the flags.
        Common oversights: not using <Code>i</Code> for case-insensitive
        matching, not using <Code>m</Code> (multiline) so <Code>^</Code> and{" "}
        <Code>$</Code> match line boundaries, and not using <Code>s</Code>{" "}
        (dotall) so <Code>.</Code> also matches newlines.
      </p>
      <CodeBlock title="Bug: won't match 'Hello' or 'HELLO'">{`/hello/`}</CodeBlock>
      <CodeBlock title="Fix: case-insensitive flag">{`/hello/i`}</CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        7. Escaping Differences Between Languages
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        A regex that works in one language may break in another because of how
        the host language handles string escaping. In Java, you must double-escape
        backslashes: <Code>{`"\\\\d+"`}</Code> to get the regex{" "}
        <Code>\d+</Code>. In Python, raw strings (<Code>r&quot;\d+&quot;</Code>)
        avoid this problem. In JavaScript, the <Code>/pattern/</Code> literal
        syntax sidesteps string escaping entirely.
      </p>
      <CodeBlock title="Java: double escaping required">{`Pattern.compile("\\\\d{4}-\\\\d{2}-\\\\d{2}")`}</CodeBlock>
      <CodeBlock title="Python: raw string avoids double escaping">{`re.compile(r"\\d{4}-\\d{2}-\\d{2}")`}</CodeBlock>
      <CodeBlock title="JavaScript: regex literal, no extra escaping">{`/\\d{4}-\\d{2}-\\d{2}/`}</CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        8. Lookahead/Lookbehind Not Supported
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Lookahead (<Code>(?=...)</Code>, <Code>(?!...)</Code>) and lookbehind (
        <Code>(?&lt;=...)</Code>, <Code>(?&lt;!...)</Code>) are powerful, but
        not universally supported. Go&apos;s RE2 engine has no lookaround at
        all. Older JavaScript engines (pre-ES2018) lack lookbehind. Some engines
        only support fixed-width lookbehind. If your regex silently fails or
        throws a syntax error, check your engine&apos;s feature support.
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        9. Unicode and Special Characters
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        The shorthand <Code>\w</Code> only matches <Code>[a-zA-Z0-9_]</Code> in
        most engines — it will not match accented characters like{" "}
        <Code>e</Code>, <Code>n</Code>, or emoji. If you need to match Unicode
        letters, use Unicode property escapes where available (
        <Code>{`\\p{L}`}</Code> in JavaScript with the <Code>u</Code> flag, or{" "}
        <Code>{`\\p{Letter}`}</Code> in Java and .NET).
      </p>
      <CodeBlock title="JavaScript: matching Unicode letters">{`/\\p{L}+/u`}</CodeBlock>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        Also watch for emoji, which may be multiple code points. A single emoji
        like a flag can be 4+ code units, so <Code>.</Code> may not match it as
        one &quot;character&quot; without the <Code>u</Code> or <Code>v</Code>{" "}
        flag.
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        10. Capture Groups vs Non-Capturing Groups
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Every <Code>(...)</Code> creates a capture group that the engine stores
        in memory. If you have dozens of groups and don&apos;t need the captured
        values, use non-capturing groups <Code>(?:...)</Code> instead. This
        reduces memory usage and avoids confusing backreference numbering. It
        also makes your intent clearer — grouping for precedence, not for
        extraction.
      </p>
      <CodeBlock title="Unnecessary captures">{`/(https?):\\/\\/(www\\.)?([a-z]+)\\.([a-z]{2,})/`}</CodeBlock>
      <CodeBlock title="Better: only capture what you need">{`/(?:https?):\\/\\/(?:www\\.)?([a-z]+)\\.([a-z]{2,})/`}</CodeBlock>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        How to Debug Regex: Step-by-Step
      </h2>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Step 1: Test in a Regex Tester
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Don&apos;t debug regex by running your entire application. Paste the
        pattern and sample input into a dedicated{" "}
        <Link
          href="/tools/regex-tester"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          Regex Tester
        </Link>{" "}
        that highlights matches in real time. You&apos;ll spot the problem in
        seconds instead of minutes.
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Step 2: Break the Pattern into Parts
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Complex patterns are hard to reason about as a whole. Strip your regex
        down to the first token, verify it matches, then add tokens one at a
        time. The moment matching breaks, you&apos;ve found the bug.
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Step 3: Add Anchors and Test Boundary Cases
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Add <Code>^</Code> and <Code>$</Code> to see if your pattern matches
        the full string or just a substring. Test with empty strings, strings
        with leading/trailing whitespace, and strings with special characters.
        Use a{" "}
        <Link
          href="/tools/word-counter"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          Word Counter
        </Link>{" "}
        to verify character counts when working with length-dependent patterns.
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Step 4: Use Named Capture Groups for Readability
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Replace <Code>(\d{`{4}`})</Code> with{" "}
        <Code>(?&lt;year&gt;\d{`{4}`})</Code>. Named groups make complex
        patterns self-documenting and reduce bugs caused by renumbering groups
        when you edit the pattern.
      </p>
      <CodeBlock title="Named groups for a date pattern">{`/(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})/`}</CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Step 5: Check Language-Specific Quirks
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        If the pattern works in a tester but fails in your code, the issue is
        almost certainly escaping, flag syntax, or engine support. See the
        language-specific section below. Also check whether your language uses{" "}
        <Code>match</Code> (partial) vs <Code>fullmatch</Code> (anchored) — in
        Python, <Code>re.match</Code> only anchors at the start, not the end.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Regex Patterns That Actually Work
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        These battle-tested patterns handle real-world input. Each is anchored
        for validation use. Need to convert the casing of matched results? Our{" "}
        <Link
          href="/tools/case-converter"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          Case Converter
        </Link>{" "}
        can help.
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Email (Simplified, RFC-Aware)
      </h3>
      <CodeBlock title="Covers 99%+ of real-world addresses">{`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$`}</CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        URL with Protocol
      </h3>
      <CodeBlock>{`^https?:\\/\\/[\\w.-]+(?:\\.[\\w.-]+)+[\\/\\w._~:?#\\[\\]@!$&'()*+,;=-]*$`}</CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        IPv4 Address
      </h3>
      <CodeBlock>{`^(?:(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$`}</CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Date (YYYY-MM-DD)
      </h3>
      <CodeBlock>{`^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$`}</CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        US Phone Number
      </h3>
      <CodeBlock title="Matches (555) 123-4567, 555-123-4567, 5551234567">{`^\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}$`}</CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Semantic Version (SemVer)
      </h3>
      <CodeBlock>{`^(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)(?:-((?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\\.(?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\\+([0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*))?$`}</CodeBlock>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Language-Specific Regex Gotchas
      </h2>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        JavaScript
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        The <Code>/g</Code> flag makes <Code>RegExp</Code> objects stateful —{" "}
        <Code>.test()</Code> and <Code>.exec()</Code> advance an internal{" "}
        <Code>lastIndex</Code> pointer, so calling the same regex on different
        strings can produce wrong results if you don&apos;t reset it.
        Lookbehind (<Code>(?&lt;=...)</Code>) is supported in modern engines
        (Chrome 62+, Node 8.10+, Firefox 78+) but not in IE or older Safari.
        Always use the <Code>u</Code> flag when matching Unicode text.
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Python
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Always use raw strings (<Code>r&quot;...&quot;</Code>) — without them,
        Python&apos;s string parser interprets backslash sequences before the
        regex engine sees them. Use <Code>re.VERBOSE</Code> (or the{" "}
        <Code>x</Code> flag) to add comments and whitespace to complex patterns.
        Remember that <Code>re.match()</Code> only matches at the start of the
        string; use <Code>re.fullmatch()</Code> for validation or{" "}
        <Code>re.search()</Code> to find a pattern anywhere.
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Go
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Go uses the RE2 engine, which guarantees linear-time matching but does
        not support backreferences, lookahead, or lookbehind. If you&apos;re
        porting a regex from another language that uses these features, you will
        need to rewrite the logic — often by splitting into multiple regex calls
        or using Go&apos;s string manipulation functions.
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Java
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Java strings require double escaping: <Code>\d</Code> becomes{" "}
        <Code>{`"\\\\d"`}</Code> in source code. This is the single biggest
        source of regex bugs in Java. The <Code>Pattern.COMMENTS</Code> flag is
        equivalent to verbose mode. Java supports variable-length lookbehind,
        which many other engines do not — patterns relying on this will not port
        cleanly.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Preventing Regex Bugs
      </h2>
      <ul className="space-y-3 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Use named capture groups</strong>{" "}
            — they make patterns self-documenting and eliminate the fragility of
            positional backreferences.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Comment complex patterns</strong>{" "}
            — use verbose mode (<Code>x</Code> flag in Python, <Code>COMMENTS</Code>{" "}
            in Java) to add inline comments explaining each section of the regex.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Unit test regex separately</strong>{" "}
            — write dedicated tests with positive matches, negative matches,
            edge cases (empty string, very long input, Unicode), and known
            adversarial inputs for backtracking.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Set timeouts on regex execution</strong>{" "}
            — .NET has <Code>Regex.MatchTimeout</Code>, and you can implement
            similar safeguards in other languages to prevent catastrophic
            backtracking from freezing production.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Use a regex generator for common patterns</strong>{" "}
            — instead of writing email, URL, or phone patterns from scratch, use
            a tool like our{" "}
            <Link
              href="/tools/regex-generator"
              className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              Regex Generator
            </Link>{" "}
            to start from a tested baseline.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Prefer specific character classes</strong>{" "}
            — <Code>[0-9]</Code> is clearer and more predictable than{" "}
            <Code>\d</Code> across engines, and <Code>[a-zA-Z]</Code> is
            explicit about what it matches.
          </span>
        </li>
      </ul>

      <div className="my-12 rounded-xl border border-blue-200 bg-blue-50/50 p-6 dark:border-blue-900 dark:bg-blue-950/30">
        <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">
          Building form validation or data pipelines with regex?
        </p>
        <p className="mt-2 text-sm text-blue-800 dark:text-blue-400">
          <a
            href="https://www.cloudways.com"
            target="_blank"
            rel="noopener sponsored"
            className="font-medium underline hover:no-underline"
          >
            Cloudways
          </a>{" "}
          gives you managed cloud hosting with one-click PHP, Node.js, and
          Python — deploy the backend for your validation logic in minutes.
        </p>
      </div>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Stop Guessing, Start Testing
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Most regex bugs are not mysterious — they are predictable mistakes with
        straightforward fixes. Unescaped characters, greedy quantifiers, missing
        anchors, and language-specific escaping account for the vast majority of
        issues. The fastest way to fix them is to isolate the pattern in a
        dedicated tester, break it apart, and rebuild incrementally.
      </p>
      <p className="mt-4 text-gray-600 dark:text-gray-400">
        Try your patterns in our{" "}
        <Link
          href="/tools/regex-tester"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          Regex Tester
        </Link>{" "}
        with real-time highlighting, or use the{" "}
        <Link
          href="/tools/regex-generator"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          Regex Generator
        </Link>{" "}
        to build common patterns without writing them by hand. Both tools run
        entirely in your browser — no data leaves your machine.
      </p>
    </>
  );
}
