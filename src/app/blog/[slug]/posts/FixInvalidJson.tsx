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

export default function FixInvalidJson() {
  return (
    <>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        The &quot;invalid JSON&quot; error means your JSON text violates the
        strict syntax rules of the JSON specification. JSON requires double-quoted
        keys, double-quoted strings, no trailing commas, and no comments. The fix
        depends on which rule you broke. Below is a complete guide to finding and
        fixing every type of JSON parse error across every major language.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        What Does &quot;Invalid JSON&quot; Mean?
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        When you pass a malformed string to a JSON parser, it throws an error.
        The exact message varies by language, but they all mean the same thing:
        the input is not valid JSON. Here is what the error looks like in the
        most common languages:
      </p>
      <CodeBlock title="JavaScript">
        {`SyntaxError: Unexpected token ' in JSON at position 1
SyntaxError: Expected property name or '}' at position 45
SyntaxError: Unexpected end of JSON input`}
      </CodeBlock>
      <CodeBlock title="Python">
        {`json.decoder.JSONDecodeError: Expecting property name enclosed in double quotes: line 2 column 3
json.decoder.JSONDecodeError: Expecting ',' delimiter: line 5 column 1
json.decoder.JSONDecodeError: Extra data: line 1 column 20`}
      </CodeBlock>
      <CodeBlock title="Go">
        {`invalid character '\\'' looking for beginning of value
invalid character '}' after object key:value pair
unexpected end of JSON input`}
      </CodeBlock>
      <CodeBlock title="Java">
        {`com.google.gson.JsonSyntaxException: Expected ':' at line 3 column 12
org.json.JSONException: Unterminated string at character 28`}
      </CodeBlock>
      <p className="mt-4 text-gray-600 dark:text-gray-400">
        Every one of these errors points to the same root cause: the text you
        passed to the parser does not conform to{" "}
        <a
          href="https://www.json.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          RFC 8259
        </a>
        , the JSON specification. The fastest way to find the problem is to paste
        your JSON into a{" "}
        <Link
          href="/tools/json-formatter"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          JSON Formatter
        </Link>{" "}
        that highlights the exact error location.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        The 10 Most Common JSON Errors (With Fixes)
      </h2>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        1. Trailing Commas
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        The single most common JSON error. JavaScript and TypeScript allow
        trailing commas in objects and arrays, but JSON does not. Remove the
        comma after the last item.
      </p>
      <CodeBlock title="Invalid JSON">
        {`{
  "name": "Alice",
  "roles": ["admin", "editor",],
  "age": 30,
}`}
      </CodeBlock>
      <CodeBlock title="Fixed">
        {`{
  "name": "Alice",
  "roles": ["admin", "editor"],
  "age": 30
}`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        2. Single Quotes Instead of Double Quotes
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Python dictionaries and JavaScript objects both accept single quotes.
        JSON does not. Every string and every key must use double quotes.
      </p>
      <CodeBlock title="Invalid JSON">
        {`{'name': 'Alice', 'active': true}`}
      </CodeBlock>
      <CodeBlock title="Fixed">
        {`{"name": "Alice", "active": true}`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        3. Unquoted Keys
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        JavaScript lets you write <Code>{`{ name: "Alice" }`}</Code>. JSON
        requires <Code>{`{ "name": "Alice" }`}</Code>. Every key must be a
        double-quoted string.
      </p>
      <CodeBlock title="Invalid JSON">
        {`{name: "Alice", age: 30}`}
      </CodeBlock>
      <CodeBlock title="Fixed">
        {`{"name": "Alice", "age": 30}`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        4. Comments in JSON
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        JSON has no comment syntax. Neither <Code>{`//`}</Code> single-line
        comments nor <Code>{`/* */`}</Code> block comments are allowed. If
        you need comments in configuration files, use JSONC (supported by VS
        Code and TypeScript&apos;s <Code>tsconfig.json</Code>) or switch to
        YAML.
      </p>
      <CodeBlock title="Invalid JSON">
        {`{
  // API configuration
  "endpoint": "https://api.example.com",
  "timeout": 5000  /* milliseconds */
}`}
      </CodeBlock>
      <CodeBlock title="Fixed">
        {`{
  "endpoint": "https://api.example.com",
  "timeout": 5000
}`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        5. Missing Commas Between Items
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        A missing comma between key-value pairs or array elements causes the
        parser to see an unexpected token. This error is tricky because the
        parser reports the error on the line <em>after</em> the missing comma.
      </p>
      <CodeBlock title="Invalid JSON">
        {`{
  "first": "Alice"
  "last": "Smith"
}`}
      </CodeBlock>
      <CodeBlock title="Fixed">
        {`{
  "first": "Alice",
  "last": "Smith"
}`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        6. Unclosed Brackets or Braces
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Mismatched <Code>{`{}`}</Code> or <Code>{`[]`}</Code> brackets are
        especially common in deeply nested JSON. The error usually appears as
        &quot;unexpected end of JSON input&quot; because the parser reaches the
        end of the string while still expecting a closing bracket.
      </p>
      <CodeBlock title="Invalid JSON — missing closing ]">
        {`{
  "users": [
    {"name": "Alice"},
    {"name": "Bob"}

}`}
      </CodeBlock>
      <CodeBlock title="Fixed">
        {`{
  "users": [
    {"name": "Alice"},
    {"name": "Bob"}
  ]
}`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        7. Invalid Escape Sequences (Windows Paths)
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Backslashes in JSON start escape sequences. A bare <Code>\U</Code> or{" "}
        <Code>\d</Code> is not a valid escape. This most commonly appears with
        Windows file paths.
      </p>
      <CodeBlock title="Invalid JSON">
        {`{"path": "C:\\Users\\docs\\new_file.txt"}`}
      </CodeBlock>
      <CodeBlock title="Fixed — escape the backslashes">
        {`{"path": "C:\\\\Users\\\\docs\\\\new_file.txt"}`}
      </CodeBlock>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        Alternatively, use forward slashes. Windows accepts them in most
        contexts: <Code>{`"C:/Users/docs/new_file.txt"`}</Code>.
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        8. undefined, NaN, and Infinity Values
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        These are valid JavaScript values but not valid JSON. <Code>JSON.stringify()</Code>{" "}
        silently converts <Code>undefined</Code> to nothing and <Code>NaN</Code>/<Code>Infinity</Code>{" "}
        to <Code>null</Code>, but if you manually construct JSON strings with
        these values, the parser will reject them.
      </p>
      <CodeBlock title="Invalid JSON">
        {`{
  "count": NaN,
  "max": Infinity,
  "callback": undefined
}`}
      </CodeBlock>
      <CodeBlock title="Fixed">
        {`{
  "count": null,
  "max": null
}`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        9. Duplicate Keys
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        The JSON spec technically allows duplicate keys, but the behavior is
        undefined. Most parsers silently use the last value, which leads to
        subtle bugs. Some strict validators flag this as an error.
      </p>
      <CodeBlock title="Problematic JSON">
        {`{
  "name": "Alice",
  "name": "Bob"
}`}
      </CodeBlock>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        Which name wins? It depends on the parser. Remove the duplicate to
        avoid unpredictable behavior. Use a{" "}
        <Link
          href="/tools/json-schema"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          JSON Schema Validator
        </Link>{" "}
        to catch duplicate keys automatically.
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        10. BOM (Byte Order Mark) at Start of File
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Some editors (especially on Windows) save files with a UTF-8 BOM
        character (<Code>U+FEFF</Code>) at the beginning. The BOM is invisible
        in most editors but causes <Code>JSON.parse()</Code> to fail with
        &quot;unexpected token&quot; at position 0. The fix is to save the file
        as &quot;UTF-8 without BOM&quot; or strip the BOM in code.
      </p>
      <CodeBlock title="Strip BOM in JavaScript">
        {`function stripBOM(text) {
  return text.charCodeAt(0) === 0xFEFF ? text.slice(1) : text;
}

const data = JSON.parse(stripBOM(rawText));`}
      </CodeBlock>
      <CodeBlock title="Strip BOM in Python">
        {`import codecs

text = raw_text.lstrip(codecs.BOM_UTF8.decode("utf-8"))
data = json.loads(text)`}
      </CodeBlock>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        How to Fix Invalid JSON: Step-by-Step
      </h2>
      <p className="mb-4 text-gray-600 dark:text-gray-400">
        When you hit a JSON parse error, follow these five steps to find and
        fix the problem quickly.
      </p>
      <ol className="space-y-3 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-3">
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
            1
          </span>
          <span>
            <strong className="text-gray-900 dark:text-white">Paste into a JSON formatter.</strong>{" "}
            Copy your JSON and paste it into the{" "}
            <Link
              href="/tools/json-formatter"
              className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              DevBolt JSON Formatter
            </Link>
            . It will instantly highlight the error location and show the exact
            character causing the problem.
          </span>
        </li>
        <li className="flex items-start gap-3">
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
            2
          </span>
          <span>
            <strong className="text-gray-900 dark:text-white">Read the error position.</strong>{" "}
            Every JSON parser tells you where it failed. In JavaScript,{" "}
            <Code>at position 142</Code> means character 142. In Python,{" "}
            <Code>line 5 column 3</Code> gives you the exact coordinates.
            Go to that position in your text.
          </span>
        </li>
        <li className="flex items-start gap-3">
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
            3
          </span>
          <span>
            <strong className="text-gray-900 dark:text-white">Check the line BEFORE the error.</strong>{" "}
            The reported position is where the parser got confused, but the
            actual mistake is often one line earlier. A missing comma on line 4
            shows up as an error on line 5 because the parser only realizes
            something is wrong when it encounters the next token.
          </span>
        </li>
        <li className="flex items-start gap-3">
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
            4
          </span>
          <span>
            <strong className="text-gray-900 dark:text-white">Strip non-JSON content.</strong>{" "}
            If the error is at position 0, your file likely has a BOM, a
            leading whitespace character, or non-JSON text before the opening{" "}
            <Code>{`{`}</Code> or <Code>{`[`}</Code>. Common culprits include
            HTML error pages returned by APIs, log prefixes, or the BOM
            character. Strip everything before the first bracket.
          </span>
        </li>
        <li className="flex items-start gap-3">
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
            5
          </span>
          <span>
            <strong className="text-gray-900 dark:text-white">Validate programmatically.</strong>{" "}
            Add JSON validation to your code so malformed input is caught
            early with a clear error message instead of crashing downstream.
            See the language-specific examples below.
          </span>
        </li>
      </ol>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Fixing JSON in Different Languages
      </h2>
      <p className="mb-4 text-gray-600 dark:text-gray-400">
        Here is how to safely parse JSON and handle errors in the most common
        languages. Each example catches the parse error, extracts a useful
        error message, and avoids crashing your application.
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        JavaScript / Node.js
      </h3>
      <CodeBlock title="JavaScript">
        {`function safeParseJSON(text) {
  // Strip BOM if present
  if (text.charCodeAt(0) === 0xFEFF) {
    text = text.slice(1);
  }

  try {
    return { data: JSON.parse(text), error: null };
  } catch (err) {
    // Extract position from error message
    const match = err.message.match(/position\\s+(\\d+)/i);
    const position = match ? parseInt(match[1], 10) : null;

    return {
      data: null,
      error: err.message,
      position,
      // Show context around the error
      context: position !== null
        ? text.substring(Math.max(0, position - 20), position + 20)
        : null,
    };
  }
}

// Usage
const result = safeParseJSON(input);
if (result.error) {
  console.error("JSON parse error:", result.error);
  if (result.context) {
    console.error("Near:", result.context);
  }
}`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Python
      </h3>
      <CodeBlock title="Python">
        {`import json

def safe_parse_json(text: str) -> tuple[dict | None, str | None]:
    """Parse JSON with detailed error reporting."""
    # Strip BOM
    if text.startswith("\\ufeff"):
        text = text[1:]

    try:
        return json.loads(text), None
    except json.JSONDecodeError as e:
        error_msg = (
            f"Line {e.lineno}, Column {e.colno}: {e.msg}\\n"
            f"Near: {text[max(0, e.pos - 20):e.pos + 20]}"
        )
        return None, error_msg

# Usage
data, error = safe_parse_json(raw_text)
if error:
    print(f"Invalid JSON: {error}")`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Go
      </h3>
      <CodeBlock title="Go">
        {`package main

import (
    "encoding/json"
    "fmt"
    "strings"
)

func safeParseJSON(text string) (map[string]any, error) {
    // Strip BOM
    text = strings.TrimPrefix(text, "\\xef\\xbb\\xbf")

    var result map[string]any
    if err := json.Unmarshal([]byte(text), &result); err != nil {
        if syntaxErr, ok := err.(*json.SyntaxError); ok {
            start := max(0, int(syntaxErr.Offset)-20)
            end := min(len(text), int(syntaxErr.Offset)+20)
            return nil, fmt.Errorf(
                "JSON error at offset %d: %s\\nNear: %s",
                syntaxErr.Offset, syntaxErr.Error(), text[start:end],
            )
        }
        return nil, err
    }
    return result, nil
}`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        CLI (jq, python)
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        The fastest way to validate JSON from the command line is{" "}
        <Code>jq</Code> or Python&apos;s built-in JSON module. Both give you
        clear error messages with line numbers.
      </p>
      <CodeBlock title="Shell">
        {`# Validate with jq (returns error message and exit code 1 if invalid)
jq . data.json

# Validate with Python (no extra install required)
python3 -m json.tool data.json > /dev/null

# Validate from stdin
echo '{"key": "value",}' | jq .

# Validate and pretty-print
cat data.json | python3 -m json.tool --indent 2`}
      </CodeBlock>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Preventing JSON Errors
      </h2>
      <p className="mb-4 text-gray-600 dark:text-gray-400">
        Catching errors after the fact is good. Preventing them in the first
        place is better. Here are four strategies that eliminate most JSON
        errors before they reach production.
      </p>
      <ul className="mt-4 space-y-2 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Use a schema validator.</strong>{" "}
            Define the expected structure of your JSON with{" "}
            <a
              href="https://json-schema.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              JSON Schema
            </a>{" "}
            and validate incoming data against it. This catches structural
            errors (wrong types, missing fields) in addition to syntax errors.
            Try the{" "}
            <Link
              href="/tools/json-schema"
              className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              DevBolt JSON Schema Validator
            </Link>{" "}
            to test your schemas.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Use TypeScript types + JSON serialization.</strong>{" "}
            Never build JSON strings by hand. Use <Code>JSON.stringify()</Code>{" "}
            in JavaScript or <Code>json.dumps()</Code> in Python to serialize
            objects. The serializer handles quoting, escaping, and formatting
            correctly every time.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Lint JSON files in CI.</strong>{" "}
            Add a JSON validation step to your CI pipeline. A simple{" "}
            <Code>{`find . -name '*.json' -exec jq . {} +`}</Code> in your
            GitHub Actions workflow catches broken JSON files before they are
            merged. Tools like <Code>jsonlint</Code> and{" "}
            <Code>prettier --check</Code> work as well.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Use JSONC for config files that need comments.</strong>{" "}
            If you need comments in JSON, use JSONC (JSON with Comments).
            VS Code, TypeScript (<Code>tsconfig.json</Code>), and ESLint all
            support JSONC natively. Use the <Code>.jsonc</Code> extension so
            editors and tools know to allow comments.
          </span>
        </li>
      </ul>

      <div className="my-12 rounded-xl border border-blue-200 bg-blue-50/50 p-6 dark:border-blue-900 dark:bg-blue-950/30">
        <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">
          Deploying APIs that accept JSON payloads?
        </p>
        <p className="mt-2 text-sm text-blue-800 dark:text-blue-400">
          <a
            href="https://www.digitalocean.com/products/app-platform"
            target="_blank"
            rel="noopener sponsored"
            className="font-medium underline hover:no-underline"
          >
            DigitalOcean App Platform
          </a>{" "}
          deploys Node.js, Python, and Go apps from a Git repo with zero server
          config. Auto-scaling, free SSL, and built-in monitoring included.
          Ideal for running JSON-heavy API services.
        </p>
      </div>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Quick Reference: JSON Syntax Rules
      </h2>
      <p className="mb-4 text-gray-600 dark:text-gray-400">
        Bookmark this table. If your JSON is broken, the cause is one of these:
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800">
              <th className="py-3 pr-4 text-left font-semibold text-gray-900 dark:text-white">
                Rule
              </th>
              <th className="py-3 pr-4 text-left font-semibold text-gray-900 dark:text-white">
                Invalid
              </th>
              <th className="py-3 text-left font-semibold text-gray-900 dark:text-white">
                Valid
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-600 dark:text-gray-400">
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4">Keys</td>
              <td className="py-3 pr-4"><Code>{`{name: "v"}`}</Code></td>
              <td className="py-3"><Code>{`{"name": "v"}`}</Code></td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4">Strings</td>
              <td className="py-3 pr-4"><Code>{`'hello'`}</Code></td>
              <td className="py-3"><Code>{`"hello"`}</Code></td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4">Trailing commas</td>
              <td className="py-3 pr-4"><Code>{`[1, 2,]`}</Code></td>
              <td className="py-3"><Code>{`[1, 2]`}</Code></td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4">Comments</td>
              <td className="py-3 pr-4"><Code>{`// note`}</Code></td>
              <td className="py-3">Not supported</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4">Special values</td>
              <td className="py-3 pr-4"><Code>NaN</Code>, <Code>undefined</Code></td>
              <td className="py-3"><Code>null</Code></td>
            </tr>
            <tr>
              <td className="py-3 pr-4">Backslashes</td>
              <td className="py-3 pr-4"><Code>{`"C:\\Users"`}</Code></td>
              <td className="py-3"><Code>{`"C:\\\\Users"`}</Code></td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Fix Your JSON Now
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        The fastest way to fix invalid JSON is to paste it into a tool that
        shows you exactly what is wrong. Use the{" "}
        <Link
          href="/tools/json-formatter"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          DevBolt JSON Formatter & Validator
        </Link>{" "}
        to instantly identify and fix errors — it highlights the broken line,
        explains the problem, and formats your output with proper indentation.
        For complex nested structures, the{" "}
        <Link
          href="/tools/json-visualizer"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          JSON Visualizer
        </Link>{" "}
        renders your data as a collapsible tree so you can spot mismatched
        brackets at a glance. And if you need to query specific paths in large
        JSON files, the{" "}
        <Link
          href="/tools/json-path"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          JSON Path Tester
        </Link>{" "}
        lets you run JSONPath expressions to extract exactly the data you need.
        All tools run entirely in your browser — no data leaves your machine.
      </p>
    </>
  );
}
