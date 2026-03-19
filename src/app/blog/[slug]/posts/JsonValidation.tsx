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

export default function JsonValidation() {
  return (
    <>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        JSON is the backbone of modern APIs, config files, and data exchange.
        When it breaks, error messages are often cryptic. This guide covers the
        most common JSON errors, how to spot them, and how to fix them fast.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        JSON Syntax Rules
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        JSON is strict about its syntax. Unlike JavaScript objects, JSON has no
        room for flexibility. Here are the rules:
      </p>
      <ul className="mt-4 space-y-2 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>Keys must be double-quoted strings. <Code>{`"name"`}</Code> is valid, <Code>{`name`}</Code> or <Code>{`'name'`}</Code> is not.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>Strings must use double quotes. <Code>{`"hello"`}</Code> works, <Code>{`'hello'`}</Code> does not.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>No trailing commas. The last item in an array or object must not have a comma after it.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>No comments. JSON does not support <Code>{`//`}</Code> or <Code>{`/* */`}</Code> comments.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>Values can be: strings, numbers, booleans (<Code>true</Code>/<Code>false</Code>), <Code>null</Code>, arrays, or objects.</span>
        </li>
      </ul>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        The 7 Most Common JSON Errors
      </h2>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        1. Trailing Commas
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        The most frequent mistake. JavaScript allows trailing commas, JSON does
        not:
      </p>
      <CodeBlock title="Invalid JSON">
        {`{
  "name": "Alice",
  "age": 30,    ← trailing comma
}`}
      </CodeBlock>
      <CodeBlock title="Valid JSON">
        {`{
  "name": "Alice",
  "age": 30
}`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        2. Single Quotes
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        JSON requires double quotes for all strings and keys. This is a common
        mistake when copying from JavaScript or Python code:
      </p>
      <CodeBlock title="Invalid JSON">
        {`{'name': 'Alice'}   ← single quotes`}
      </CodeBlock>
      <CodeBlock title="Valid JSON">
        {`{"name": "Alice"}   ← double quotes`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        3. Unquoted Keys
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        JavaScript objects allow unquoted keys. JSON does not:
      </p>
      <CodeBlock title="Invalid JSON">
        {`{name: "Alice"}     ← unquoted key`}
      </CodeBlock>
      <CodeBlock title="Valid JSON">
        {`{"name": "Alice"}   ← quoted key`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        4. Comments
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        JSON has no comment syntax. If you need comments in config files,
        consider JSONC (JSON with Comments, used by VS Code) or YAML:
      </p>
      <CodeBlock title="Invalid JSON">
        {`{
  // database config
  "host": "localhost",
  "port": 5432  /* default postgres port */
}`}
      </CodeBlock>
      <p className="text-gray-600 dark:text-gray-400">
        A common workaround is to use a <Code>{`"_comment"`}</Code> key, though
        this adds to the payload:
      </p>
      <CodeBlock title="Workaround">
        {`{
  "_comment": "database config",
  "host": "localhost",
  "port": 5432
}`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        5. Missing or Extra Brackets
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Mismatched <Code>{`{}`}</Code> or <Code>{`[]`}</Code> brackets are hard to
        spot in deeply nested structures. Most editors highlight matching
        brackets, and a JSON formatter will immediately show where the mismatch
        is.
      </p>
      <CodeBlock title="Invalid — missing closing bracket">
        {`{
  "users": [
    {"name": "Alice"},
    {"name": "Bob"}

}`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        6. Invalid Number Formats
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        JSON numbers have specific rules:
      </p>
      <CodeBlock title="Invalid numbers">
        {`.5        ← must have leading zero: 0.5
+1        ← no leading plus sign
0x1A      ← no hex notation
NaN       ← not a valid JSON value
Infinity  ← not a valid JSON value`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        7. Unescaped Special Characters
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Strings containing special characters need proper escaping:
      </p>
      <CodeBlock title="Characters that must be escaped">
        {`"   → \\"    (double quote)
\\   → \\\\   (backslash)
newline → \\n
tab     → \\t`}
      </CodeBlock>
      <p className="text-gray-600 dark:text-gray-400">
        A common source of this error is file paths on Windows:
      </p>
      <CodeBlock title="Invalid JSON">
        {`{"path": "C:\\Users\\data"}`}
      </CodeBlock>
      <CodeBlock title="Valid JSON">
        {`{"path": "C:\\\\Users\\\\data"}`}
      </CodeBlock>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        How to Debug JSON Errors
      </h2>
      <ol className="space-y-3 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-3">
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
            1
          </span>
          <span>
            <strong className="text-gray-900 dark:text-white">Use a JSON formatter.</strong>{" "}
            Paste your JSON into a{" "}
            <Link href="/tools/json-formatter" className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
              JSON Formatter
            </Link>{" "}
            to get an immediate error message with the line number.
          </span>
        </li>
        <li className="flex items-start gap-3">
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
            2
          </span>
          <span>
            <strong className="text-gray-900 dark:text-white">Check the error position.</strong>{" "}
            <Code>JSON.parse()</Code> errors include a position number.{" "}
            <Code>Unexpected token at position 142</Code> means the error is at
            character 142 of the string.
          </span>
        </li>
        <li className="flex items-start gap-3">
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
            3
          </span>
          <span>
            <strong className="text-gray-900 dark:text-white">Look at the character before the error.</strong>{" "}
            If the parser says &quot;unexpected token at line 5,&quot; the actual
            problem is often on line 4 (a missing comma, for example).
          </span>
        </li>
        <li className="flex items-start gap-3">
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
            4
          </span>
          <span>
            <strong className="text-gray-900 dark:text-white">Validate programmatically.</strong>{" "}
            Wrap <Code>JSON.parse()</Code> in a try/catch to handle malformed
            input gracefully.
          </span>
        </li>
      </ol>
      <CodeBlock title="JavaScript">
        {`function parseJSON(input) {
  try {
    return { data: JSON.parse(input), error: null };
  } catch (e) {
    return { data: null, error: e.message };
  }
}`}
      </CodeBlock>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        JSON vs JavaScript Objects
      </h2>
      <p className="mb-4 text-gray-600 dark:text-gray-400">
        Many errors come from confusing JSON with JavaScript object literals.
        Here&apos;s a quick comparison:
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800">
              <th className="py-3 pr-4 text-left font-semibold text-gray-900 dark:text-white">
                Feature
              </th>
              <th className="py-3 pr-4 text-left font-semibold text-gray-900 dark:text-white">
                JSON
              </th>
              <th className="py-3 text-left font-semibold text-gray-900 dark:text-white">
                JavaScript
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-600 dark:text-gray-400">
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4">Keys</td>
              <td className="py-3 pr-4">Must be double-quoted</td>
              <td className="py-3">Can be unquoted</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4">Strings</td>
              <td className="py-3 pr-4">Double quotes only</td>
              <td className="py-3">Single, double, or backticks</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4">Trailing commas</td>
              <td className="py-3 pr-4">Not allowed</td>
              <td className="py-3">Allowed</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4">Comments</td>
              <td className="py-3 pr-4">Not allowed</td>
              <td className="py-3">Allowed</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4">Functions</td>
              <td className="py-3 pr-4">Not allowed</td>
              <td className="py-3">Allowed as values</td>
            </tr>
            <tr>
              <td className="py-3 pr-4"><Code>undefined</Code></td>
              <td className="py-3 pr-4">Not allowed</td>
              <td className="py-3">Allowed</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Validate Your JSON
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Use our{" "}
        <Link
          href="/tools/json-formatter"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          JSON Formatter & Validator
        </Link>{" "}
        to instantly check and fix your JSON. It pinpoints errors, formats the
        output with proper indentation, and runs entirely in your browser. For
        schema validation, try the{" "}
        <Link
          href="/tools/json-schema"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          JSON Schema Validator
        </Link>{" "}
        to verify your JSON matches an expected structure.
      </p>
    </>
  );
}
