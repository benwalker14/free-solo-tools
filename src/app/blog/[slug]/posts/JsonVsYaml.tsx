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

export default function JsonVsYaml() {
  return (
    <>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        JSON and YAML are both data serialization formats used for configuration
        files, APIs, and data exchange. JSON is strict and machine-friendly.
        YAML is flexible and human-friendly — but that flexibility comes with
        gotchas. This guide covers the real differences and when each format is
        the right choice.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Quick Comparison
      </h2>
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
                YAML
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-600 dark:text-gray-400">
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Syntax</td>
              <td className="py-3 pr-4">Braces and brackets</td>
              <td className="py-3">Indentation-based</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Comments</td>
              <td className="py-3 pr-4">Not allowed</td>
              <td className="py-3"><Code># comment</Code></td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Data types</td>
              <td className="py-3 pr-4">String, number, boolean, null, array, object</td>
              <td className="py-3">Same + dates, timestamps, binary, anchors</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Multiline strings</td>
              <td className="py-3 pr-4">Escaped <Code>\n</Code> only</td>
              <td className="py-3"><Code>|</Code> (literal) and <Code>&gt;</Code> (folded)</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Trailing commas</td>
              <td className="py-3 pr-4">Not allowed (strict)</td>
              <td className="py-3">No commas at all</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">File size</td>
              <td className="py-3 pr-4">Larger (braces, quotes, commas)</td>
              <td className="py-3">Smaller (indentation only)</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Parsing speed</td>
              <td className="py-3 pr-4">Very fast (simple grammar)</td>
              <td className="py-3">Slower (complex grammar)</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Multiple documents</td>
              <td className="py-3 pr-4">Not supported</td>
              <td className="py-3"><Code>---</Code> separator</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Primary use</td>
              <td className="py-3 pr-4">APIs, data exchange, package.json</td>
              <td className="py-3">Config files (K8s, Docker, CI/CD)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        The Same Data in Both Formats
      </h2>
      <CodeBlock title="JSON">
        {`{
  "name": "my-api",
  "version": "2.1.0",
  "database": {
    "host": "localhost",
    "port": 5432,
    "ssl": true,
    "replicas": ["db-1.example.com", "db-2.example.com"]
  },
  "features": {
    "cache": true,
    "rateLimit": 1000,
    "allowedOrigins": ["https://app.example.com", "https://admin.example.com"]
  }
}`}
      </CodeBlock>
      <CodeBlock title="YAML">
        {`name: my-api
version: "2.1.0"  # Quote to prevent float interpretation
database:
  host: localhost
  port: 5432
  ssl: true
  replicas:
    - db-1.example.com
    - db-2.example.com
features:
  cache: true
  rateLimit: 1000
  allowedOrigins:
    - https://app.example.com
    - https://admin.example.com`}
      </CodeBlock>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Where JSON Wins
      </h2>
      <ul className="mt-4 space-y-3 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Unambiguous parsing.</strong>{" "}
            JSON has exactly one way to represent each value. No implicit type
            coercion, no whitespace sensitivity, no surprises.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Universal native support.</strong>{" "}
            Every language has a built-in JSON parser. JavaScript&apos;s{" "}
            <Code>JSON.parse()</Code> is the fastest serialization in the browser.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">API standard.</strong>{" "}
            REST APIs, GraphQL responses, WebSocket messages, and JWT payloads
            all use JSON. It&apos;s the lingua franca of data exchange.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Tooling.</strong>{" "}
            JSON Schema, JSON Path, JSON Patch, and JSON Pointer are mature
            specifications with broad ecosystem support.
          </span>
        </li>
      </ul>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Where YAML Wins
      </h2>
      <ul className="mt-4 space-y-3 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Readability.</strong>{" "}
            No braces, no brackets, no quotes on keys. For config files that
            humans edit frequently, YAML is easier to scan.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Comments.</strong>{" "}
            JSON has no comment syntax. YAML lets you annotate config with{" "}
            <Code># explanation</Code>. This alone drives many teams to YAML
            for configuration.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Multiline strings.</strong>{" "}
            YAML&apos;s <Code>|</Code> (literal block) and <Code>&gt;</Code> (folded block)
            make embedding SQL, shell scripts, or templates natural.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Anchors and aliases.</strong>{" "}
            YAML&apos;s <Code>&amp;anchor</Code> and <Code>*alias</Code> system
            lets you reuse config blocks without duplication — useful in CI/CD
            pipelines.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Multi-document files.</strong>{" "}
            A single YAML file can contain multiple documents separated by{" "}
            <Code>---</Code>. Kubernetes uses this for deploying multiple
            resources from one file.
          </span>
        </li>
      </ul>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        YAML&apos;s Gotchas
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        YAML&apos;s flexibility creates real foot-guns that have caused
        production incidents:
      </p>
      <ul className="mt-4 space-y-4 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">The Norway problem.</strong>{" "}
            <Code>NO</Code> is parsed as boolean <Code>false</Code> in YAML 1.1.
            Country codes, abbreviations, and environment names like{" "}
            <Code>on</Code>/<Code>off</Code>/<Code>yes</Code>/<Code>no</Code> get
            silently converted.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Version numbers as floats.</strong>{" "}
            <Code>version: 3.10</Code> becomes <Code>3.1</Code> because it&apos;s
            parsed as a floating-point number. Always quote version strings.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Indentation errors.</strong>{" "}
            Mixing tabs and spaces, or inconsistent indentation, produces
            parse errors or wrong nesting. JSON&apos;s braces make structure
            explicit regardless of whitespace.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Security (yaml.load).</strong>{" "}
            YAML supports arbitrary object instantiation in some parsers.
            Python&apos;s <Code>yaml.safe_load()</Code> exists because{" "}
            <Code>yaml.load()</Code> can execute code. JSON has no such risk.
          </span>
        </li>
      </ul>

      <CodeBlock title="YAML gotchas in action">
        {`# These are all boolean false in YAML 1.1:
country: NO    # Parsed as false, not the string "NO"
flag: off      # Parsed as false
answer: n      # Parsed as false

# This loses precision:
version: 3.10  # Parsed as 3.1 (float)

# Fix: always quote ambiguous values
country: "NO"
version: "3.10"`}
      </CodeBlock>

      <div className="my-12 rounded-xl border border-blue-200 bg-blue-50/50 p-6 dark:border-blue-900 dark:bg-blue-950/30">
        <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">
          Managing YAML-heavy infrastructure?
        </p>
        <p className="mt-2 text-sm text-blue-800 dark:text-blue-400">
          <a
            href="https://www.digitalocean.com/"
            target="_blank"
            rel="noopener sponsored"
            className="font-medium underline hover:no-underline"
          >
            DigitalOcean
          </a>{" "}
          provides managed Kubernetes and simple cloud infrastructure.
          Validate your K8s manifests and Docker Compose files before
          deploying.
        </p>
      </div>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        When to Use Each
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800">
              <th className="py-3 pr-4 text-left font-semibold text-gray-900 dark:text-white">
                Use Case
              </th>
              <th className="py-3 pr-4 text-left font-semibold text-gray-900 dark:text-white">
                Format
              </th>
              <th className="py-3 text-left font-semibold text-gray-900 dark:text-white">
                Why
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-600 dark:text-gray-400">
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4">REST APIs</td>
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">JSON</td>
              <td className="py-3">Industry standard, native browser support</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4">Kubernetes manifests</td>
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">YAML</td>
              <td className="py-3">Comments, multi-doc, ecosystem convention</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4">CI/CD pipelines</td>
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">YAML</td>
              <td className="py-3">GitHub Actions, GitLab CI, CircleCI all use YAML</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4">package.json / tsconfig</td>
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">JSON</td>
              <td className="py-3">Tooling expects JSON, programmatic read/write</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4">Docker Compose</td>
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">YAML</td>
              <td className="py-3">Comments for documentation, readable service defs</td>
            </tr>
            <tr>
              <td className="py-3 pr-4">Data interchange</td>
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">JSON</td>
              <td className="py-3">Unambiguous, fast parsing, universal support</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        The Verdict
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        <strong className="text-gray-900 dark:text-white">Use JSON for data exchange</strong>{" "}
        — APIs, databases, and anything machines parse programmatically.{" "}
        <strong className="text-gray-900 dark:text-white">Use YAML for configuration</strong>{" "}
        — files humans edit frequently where comments and readability matter.
        When in doubt, use JSON. It has fewer surprises, faster parsing, and
        universal support.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Try It Yourself
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Convert between formats instantly with the{" "}
        <Link
          href="/tools/json-yaml"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          JSON ↔ YAML Converter
        </Link>
        . Validate your JSON with the{" "}
        <Link
          href="/tools/json-formatter"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          JSON Formatter & Validator
        </Link>
        , or check your YAML syntax with the{" "}
        <Link
          href="/tools/yaml-formatter"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          YAML Validator & Formatter
        </Link>
        .
      </p>
    </>
  );
}
