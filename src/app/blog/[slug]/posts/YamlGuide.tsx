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

export default function YamlGuide() {
  return (
    <>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        YAML (&quot;YAML Ain&apos;t Markup Language&quot;) is the configuration
        language of modern DevOps. Kubernetes manifests, GitHub Actions
        workflows, Docker Compose files, Ansible playbooks — they all use YAML.
        This guide covers the syntax, common pitfalls, and the tricky edge
        cases that trip up even experienced developers.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        YAML Basics
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        YAML uses indentation (spaces, never tabs) to represent structure.
        At its core, everything is either a mapping (key-value pair), a
        sequence (list), or a scalar (string, number, boolean).
      </p>
      <CodeBlock title="YAML">
        {`# This is a comment

# Mapping (key: value)
name: DevBolt
url: https://devbolt.dev
port: 3000

# Sequence (list)
tools:
  - JSON Formatter
  - Base64 Encoder
  - Hash Generator

# Nested mapping
database:
  host: localhost
  port: 5432
  credentials:
    user: admin
    password: secret`}
      </CodeBlock>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Data Types
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        YAML auto-detects types. This is powerful but also the source of many
        bugs:
      </p>
      <CodeBlock title="YAML">
        {`# Strings
name: hello              # unquoted
name: "hello world"      # double-quoted (supports escapes)
name: 'hello world'      # single-quoted (literal)

# Numbers
count: 42                # integer
price: 19.99             # float
hex: 0xff                # hexadecimal
octal: 0o755             # octal

# Booleans
enabled: true
disabled: false

# Null
value: null
also_null: ~
also_null_2:             # empty value = null

# Dates
created: 2026-03-18
timestamp: 2026-03-18T14:30:00Z`}
      </CodeBlock>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        The Norway Problem (and Other Type Gotchas)
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        YAML&apos;s auto-typing is its most notorious footgun. Country codes,
        version numbers, and other values can be silently interpreted as the
        wrong type:
      </p>
      <CodeBlock title="Dangerous YAML">
        {`# These are all interpreted as booleans (true/false):
country: NO           # false (not the string "NO"!)
answer: yes           # true
flag: off             # false
confirm: on           # true

# These are interpreted as numbers:
version: 1.0          # float 1.0 (not string "1.0")
zipcode: 01onal           # octal 1 (not string "01")
build: 3.10           # float 3.1 (not string "3.10")

# Fix: always quote ambiguous values
country: "NO"
version: "1.0"
zipcode: "01234"
build: "3.10"`}
      </CodeBlock>
      <p className="text-gray-600 dark:text-gray-400">
        This is called the{" "}
        <strong className="text-gray-900 dark:text-white">
          Norway problem
        </strong>
        . The country code &quot;NO&quot; becomes boolean{" "}
        <Code>false</Code>. The fix is simple: quote any value that could be
        misinterpreted.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Multiline Strings
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        YAML has two multiline operators. This is one of its most useful
        features:
      </p>
      <CodeBlock title="YAML">
        {`# Literal block (|) — preserves newlines exactly
script: |
  #!/bin/bash
  echo "Hello"
  echo "World"
# Result: "#!/bin/bash\\necho \\"Hello\\"\\necho \\"World\\"\\n"

# Folded block (>) — joins lines with spaces (like HTML)
description: >
  This is a long
  description that will
  be folded into one line.
# Result: "This is a long description that will be folded into one line.\\n"

# Strip trailing newline with "-"
script: |-
  echo "no trailing newline"
# Result: "echo \\"no trailing newline\\""

# Keep trailing newlines with "+"
script: |+
  line one
  line two

# Result: "line one\\nline two\\n\\n"`}
      </CodeBlock>
      <p className="text-gray-600 dark:text-gray-400">
        Use <Code>|</Code> (literal) for shell scripts, SQL, and code where
        newlines matter. Use <Code>&gt;</Code> (folded) for long descriptions
        and prose.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Anchors and Aliases
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Avoid repetition with anchors (<Code>&amp;</Code>) and aliases (
        <Code>*</Code>):
      </p>
      <CodeBlock title="YAML">
        {`# Define an anchor
defaults: &defaults
  timeout: 30
  retries: 3
  log_level: info

# Reuse with alias
development:
  <<: *defaults
  log_level: debug    # override one value

production:
  <<: *defaults
  timeout: 60         # override one value

# Without anchors, you'd repeat all three values twice`}
      </CodeBlock>
      <p className="text-gray-600 dark:text-gray-400">
        The <Code>&lt;&lt;</Code> merge key injects all key-value pairs from
        the anchor. Any keys you define after the merge override the anchored
        values.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Multi-Document Files
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        A single YAML file can contain multiple documents, separated by{" "}
        <Code>---</Code>. This is commonly used in Kubernetes:
      </p>
      <CodeBlock title="YAML">
        {`# Document 1: Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web
spec:
  replicas: 3
---
# Document 2: Service
apiVersion: v1
kind: Service
metadata:
  name: web
spec:
  type: ClusterIP
  ports:
    - port: 80`}
      </CodeBlock>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Flow Style (Inline Syntax)
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        YAML supports a compact JSON-like syntax for short values:
      </p>
      <CodeBlock title="YAML">
        {`# Flow mapping (inline object)
point: {x: 10, y: 20}

# Flow sequence (inline array)
colors: [red, green, blue]

# Mixed
servers:
  - {host: web1, port: 80}
  - {host: web2, port: 80}

# Equivalent block style:
servers:
  - host: web1
    port: 80
  - host: web2
    port: 80`}
      </CodeBlock>
      <p className="text-gray-600 dark:text-gray-400">
        Flow style is great for short, simple data. For anything complex, stick
        with block style for readability.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        YAML vs JSON vs TOML
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800">
              <th className="py-3 pr-4 text-left font-semibold text-gray-900 dark:text-white">
                Feature
              </th>
              <th className="py-3 pr-4 text-left font-semibold text-gray-900 dark:text-white">
                YAML
              </th>
              <th className="py-3 pr-4 text-left font-semibold text-gray-900 dark:text-white">
                JSON
              </th>
              <th className="py-3 text-left font-semibold text-gray-900 dark:text-white">
                TOML
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-600 dark:text-gray-400">
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4">Comments</td>
              <td className="py-3 pr-4">Yes</td>
              <td className="py-3 pr-4">No</td>
              <td className="py-3">Yes</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4">Multiline strings</td>
              <td className="py-3 pr-4">Yes (| and &gt;)</td>
              <td className="py-3 pr-4">No</td>
              <td className="py-3">Yes (triple quotes)</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4">References/anchors</td>
              <td className="py-3 pr-4">Yes</td>
              <td className="py-3 pr-4">No</td>
              <td className="py-3">No</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4">Readability</td>
              <td className="py-3 pr-4">High</td>
              <td className="py-3 pr-4">Medium</td>
              <td className="py-3">High</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4">Parsing safety</td>
              <td className="py-3 pr-4">Risky (type coercion)</td>
              <td className="py-3 pr-4">Safe</td>
              <td className="py-3">Safe</td>
            </tr>
            <tr>
              <td className="py-3 pr-4">Common use</td>
              <td className="py-3 pr-4">K8s, CI/CD, Ansible</td>
              <td className="py-3 pr-4">APIs, package.json</td>
              <td className="py-3">Cargo.toml, pyproject</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Real-World Examples
      </h2>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        GitHub Actions Workflow
      </h3>
      <CodeBlock title=".github/workflows/ci.yaml">
        {`name: CI
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node: [18, 20, 22]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: \${{ matrix.node }}
      - run: npm ci
      - run: npm test`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Docker Compose
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        See our{" "}
        <Link
          href="/blog/docker-compose-guide"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          Docker Compose guide
        </Link>{" "}
        for a deep dive. Here&apos;s the basic structure:
      </p>
      <CodeBlock title="compose.yaml">
        {`services:
  web:
    image: nginx:alpine
    ports:
      - "8080:80"
    volumes:
      - ./html:/usr/share/nginx/html
    depends_on:
      - api

  api:
    build: ./api
    environment:
      DATABASE_URL: postgres://user:pass@db:5432/app`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Kubernetes Deployment
      </h3>
      <CodeBlock title="deployment.yaml">
        {`apiVersion: apps/v1
kind: Deployment
metadata:
  name: web
  labels:
    app: web
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
        - name: web
          image: myapp:1.2.3
          ports:
            - containerPort: 8080
          resources:
            limits:
              memory: "256Mi"
              cpu: "500m"`}
      </CodeBlock>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Common Mistakes
      </h2>
      <ul className="space-y-4 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Using tabs for indentation.</strong>{" "}
            YAML only allows spaces. A single tab will cause a parse error.
            Configure your editor to insert spaces when you press Tab in YAML
            files.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Not quoting ambiguous values.</strong>{" "}
            Values like <Code>NO</Code>, <Code>yes</Code>, <Code>1.0</Code>,{" "}
            <Code>on</Code>, and <Code>off</Code> are interpreted as booleans or
            numbers. Always quote strings that could be misinterpreted.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Inconsistent indentation.</strong>{" "}
            YAML doesn&apos;t mandate a specific indent size, but mixing 2-space
            and 4-space indentation in the same file will cause confusion (and
            often errors). Pick 2 spaces and stick with it.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Duplicate keys.</strong>{" "}
            YAML silently allows duplicate keys — the last one wins. This can
            cause hard-to-find bugs when you accidentally define the same key
            twice in a large file.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Forgetting the space after colons.</strong>{" "}
            <Code>key:value</Code> is a string, not a mapping. You need a space:{" "}
            <Code>key: value</Code>.
          </span>
        </li>
      </ul>

      <div className="my-12 rounded-xl border border-blue-200 bg-blue-50/50 p-6 dark:border-blue-900 dark:bg-blue-950/30">
        <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">
          Running YAML in production?
        </p>
        <p className="mt-2 text-sm text-blue-800 dark:text-blue-400">
          If you&apos;re deploying Kubernetes manifests,{" "}
          <a
            href="https://www.digitalocean.com/products/kubernetes"
            target="_blank"
            rel="noopener sponsored"
            className="font-medium underline hover:no-underline"
          >
            DigitalOcean Kubernetes
          </a>{" "}
          offers managed clusters with free control plane, automatic upgrades,
          and simple pricing. Great for teams that want K8s without the
          infrastructure overhead.
        </p>
      </div>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Try It Yourself
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Use our{" "}
        <Link
          href="/tools/yaml-formatter"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          YAML Validator & Formatter
        </Link>{" "}
        to validate and format your YAML files. Need to convert between
        formats? The{" "}
        <Link
          href="/tools/json-yaml"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          JSON ↔ YAML Converter
        </Link>{" "}
        handles that instantly. And if you&apos;re working with Kubernetes, our{" "}
        <Link
          href="/tools/k8s-validator"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          Kubernetes YAML Validator
        </Link>{" "}
        checks for resource-specific issues beyond basic syntax.
      </p>
    </>
  );
}
