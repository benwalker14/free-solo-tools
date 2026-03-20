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

function WarningBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 rounded-lg border-l-4 border-red-500 bg-red-50 p-4 dark:bg-red-950/30 dark:border-red-400">
      <div className="text-sm text-red-800 dark:text-red-300">{children}</div>
    </div>
  );
}

function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 rounded-lg border-l-4 border-emerald-500 bg-emerald-50 p-4 dark:bg-emerald-950/30 dark:border-emerald-400">
      <div className="text-sm text-emerald-800 dark:text-emerald-300">
        {children}
      </div>
    </div>
  );
}

function AffiliateBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 rounded-lg border-l-4 border-blue-500 bg-blue-50 p-4 dark:bg-blue-950/30 dark:border-blue-400">
      <div className="text-sm text-blue-800 dark:text-blue-300">
        {children}
      </div>
    </div>
  );
}

function ToolLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-indigo-600 underline decoration-indigo-300 underline-offset-2 hover:text-indigo-500 dark:text-indigo-400 dark:decoration-indigo-700 dark:hover:text-indigo-300"
    >
      {children}
    </Link>
  );
}

function ToolCategory({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-8">
      <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
        {title}
      </h3>
      <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
        <table className="w-full text-sm">
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {children}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ToolRow({
  name,
  href,
  description,
}: {
  name: string;
  href: string;
  description: string;
}) {
  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
      <td className="whitespace-nowrap px-4 py-2.5 font-medium">
        <ToolLink href={href}>{name}</ToolLink>
      </td>
      <td className="px-4 py-2.5 text-gray-600 dark:text-gray-400">
        {description}
      </td>
    </tr>
  );
}

export default function CodeBeautifyAlternative() {
  return (
    <>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        In November 2025, CodeBeautify and JSONFormatter were caught storing
        over 5 GB of user submissions on their servers &mdash; including AWS
        keys, database passwords, and Stripe secrets. If you&apos;re looking
        for a CodeBeautify alternative that actually respects your data,
        DevBolt offers 117 developer tools that run entirely in your browser.
        Nothing is ever sent to a server.
      </p>

      <InfoBox>
        <strong>Every tool on DevBolt processes data client-side.</strong> Open
        your browser&apos;s Network tab (F12) while using any tool &mdash;
        you&apos;ll see zero data requests. Your JSON, JWTs, code, and
        credentials never leave your device.
      </InfoBox>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Why Developers Are Leaving CodeBeautify
      </h2>

      <p className="text-gray-600 dark:text-gray-400">
        The 2025 data leak wasn&apos;t a hack. CodeBeautify and JSONFormatter
        were architecturally designed to send your data to their servers for
        processing. That server stored everything. For years, 80,000+
        submissions containing credentials sat in publicly accessible storage
        &mdash; AWS access keys, Stripe API keys, database connection strings,
        even bank account details.
      </p>

      <p className="mt-4 text-gray-600 dark:text-gray-400">
        The problem isn&apos;t unique to CodeBeautify. Any tool that processes
        data server-side can store, log, or leak your input. The only way to
        guarantee safety is to use tools that never see your data in the first
        place &mdash; tools that run entirely in your browser.
      </p>

      <WarningBox>
        <strong>Were you affected?</strong> If you&apos;ve ever pasted API
        keys, tokens, or connection strings into CodeBeautify, JSONFormatter,
        or any server-side tool, rotate those credentials immediately. See our{" "}
        <ToolLink href="/blog/developer-tools-privacy">
          full data leak breakdown
        </ToolLink>{" "}
        for a credential rotation checklist.
      </WarningBox>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        DevBolt vs CodeBeautify: What&apos;s Different
      </h2>

      <div className="my-6 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
              <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Feature</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">DevBolt</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">CodeBeautify</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            <tr>
              <td className="px-4 py-2.5 font-medium text-gray-900 dark:text-white">Tool count</td>
              <td className="px-4 py-2.5 text-emerald-600 dark:text-emerald-400 font-medium">117 tools</td>
              <td className="px-4 py-2.5 text-gray-600 dark:text-gray-400">~45 tools</td>
            </tr>
            <tr>
              <td className="px-4 py-2.5 font-medium text-gray-900 dark:text-white">Data processing</td>
              <td className="px-4 py-2.5 text-emerald-600 dark:text-emerald-400 font-medium">100% client-side</td>
              <td className="px-4 py-2.5 text-red-600 dark:text-red-400">Server-side (data sent to backend)</td>
            </tr>
            <tr>
              <td className="px-4 py-2.5 font-medium text-gray-900 dark:text-white">Data storage</td>
              <td className="px-4 py-2.5 text-emerald-600 dark:text-emerald-400 font-medium">Nothing stored, ever</td>
              <td className="px-4 py-2.5 text-red-600 dark:text-red-400">Submissions stored on server</td>
            </tr>
            <tr>
              <td className="px-4 py-2.5 font-medium text-gray-900 dark:text-white">Signup required</td>
              <td className="px-4 py-2.5 text-emerald-600 dark:text-emerald-400 font-medium">No</td>
              <td className="px-4 py-2.5 text-gray-600 dark:text-gray-400">No (but data is tracked)</td>
            </tr>
            <tr>
              <td className="px-4 py-2.5 font-medium text-gray-900 dark:text-white">Ads</td>
              <td className="px-4 py-2.5 text-emerald-600 dark:text-emerald-400 font-medium">None</td>
              <td className="px-4 py-2.5 text-gray-600 dark:text-gray-400">Heavy ad placement</td>
            </tr>
            <tr>
              <td className="px-4 py-2.5 font-medium text-gray-900 dark:text-white">Dark mode</td>
              <td className="px-4 py-2.5 text-emerald-600 dark:text-emerald-400 font-medium">Yes (system + toggle)</td>
              <td className="px-4 py-2.5 text-gray-600 dark:text-gray-400">Limited</td>
            </tr>
            <tr>
              <td className="px-4 py-2.5 font-medium text-gray-900 dark:text-white">Keyboard shortcuts</td>
              <td className="px-4 py-2.5 text-emerald-600 dark:text-emerald-400 font-medium">Ctrl+K search, Ctrl+Enter execute</td>
              <td className="px-4 py-2.5 text-gray-600 dark:text-gray-400">No</td>
            </tr>
            <tr>
              <td className="px-4 py-2.5 font-medium text-gray-900 dark:text-white">Open source</td>
              <td className="px-4 py-2.5 text-emerald-600 dark:text-emerald-400 font-medium">Yes (GitHub)</td>
              <td className="px-4 py-2.5 text-gray-600 dark:text-gray-400">No</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        How to Verify a Tool Is Client-Side
      </h2>

      <p className="text-gray-600 dark:text-gray-400">
        Don&apos;t take our word for it. You can verify any tool&apos;s
        architecture in 30 seconds:
      </p>

      <CodeBlock title="Steps to verify">{`1. Open DevTools (F12) → Network tab
2. Clear all entries
3. Paste test data into the tool and click "Format" / "Convert" / "Generate"
4. Check the Network tab

✅ Zero requests = client-side (your data stayed local)
❌ POST requests to an API = server-side (your data was sent somewhere)`}</CodeBlock>

      <p className="mt-4 text-gray-600 dark:text-gray-400">
        Try this on DevBolt, then try it on CodeBeautify. The difference is
        immediately visible.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        All 117 Tools &mdash; Organized by Category
      </h2>

      <p className="text-gray-600 dark:text-gray-400">
        Every tool below runs entirely in your browser. No accounts, no data
        collection, no server processing.
      </p>

      {/* JSON & Data Tools */}
      <ToolCategory title="JSON Tools (14)">
        <ToolRow name="JSON Formatter & Validator" href="/tools/json-formatter" description="Format, validate, and minify JSON with syntax highlighting" />
        <ToolRow name="JSON ↔ YAML Converter" href="/tools/json-yaml" description="Convert between JSON and YAML formats" />
        <ToolRow name="JSON Path Tester" href="/tools/json-path" description="Test JSONPath expressions against JSON data" />
        <ToolRow name="JSON Schema Validator" href="/tools/json-schema" description="Validate JSON data against JSON Schema definitions" />
        <ToolRow name="JSON to TypeScript Generator" href="/tools/json-to-typescript" description="Generate TypeScript interfaces from JSON" />
        <ToolRow name="JSON to CSV Converter" href="/tools/json-to-csv" description="Convert JSON arrays to downloadable CSV files" />
        <ToolRow name="JSON Diff" href="/tools/json-diff" description="Deep structural comparison of two JSON documents" />
        <ToolRow name="JSON Mock Data Generator" href="/tools/json-mock-generator" description="Generate fake JSON data for API testing" />
        <ToolRow name="JSON Visualizer & Tree Viewer" href="/tools/json-visualizer" description="Interactive collapsible tree view for JSON data" />
        <ToolRow name="JSON to Code Generator" href="/tools/json-to-code" description="Generate Go, Python, Rust, Java, C#, Dart, Swift, Kotlin from JSON" />
        <ToolRow name="JSON to Zod Converter" href="/tools/json-to-zod" description="Convert JSON and JSON Schema to Zod validation schemas" />
        <ToolRow name="JSON to SQL Converter" href="/tools/json-to-sql" description="Convert JSON arrays to CREATE TABLE + INSERT statements" />
        <ToolRow name="JSON to GraphQL Schema" href="/tools/json-to-graphql" description="Generate GraphQL schema definitions from JSON data" />
        <ToolRow name="CSV ↔ JSON Converter" href="/tools/csv-json" description="Convert between CSV and JSON formats" />
      </ToolCategory>

      {/* Encoding & Hashing */}
      <ToolCategory title="Encoding, Hashing & Cryptography (9)">
        <ToolRow name="Base64 Encoder & Decoder" href="/tools/base64" description="Encode and decode Base64 with Unicode support" />
        <ToolRow name="URL Encoder & Decoder" href="/tools/url-encoder" description="Encode and decode URL-encoded strings" />
        <ToolRow name="HTML Entity Encoder & Decoder" href="/tools/html-entities" description="Encode and decode HTML entities" />
        <ToolRow name="Hash Generator" href="/tools/hash-generator" description="Generate SHA-1, SHA-256, SHA-384, SHA-512 hashes" />
        <ToolRow name="File Hash Calculator" href="/tools/file-hash" description="Drag-and-drop file hashing with MD5, SHA-1, SHA-256, SHA-512" />
        <ToolRow name="Encode / Decode Multi-Tool" href="/tools/encode-decode" description="Base64, Base32, Hex, Binary, URL, HTML — all in one" />
        <ToolRow name="Image to Base64 Converter" href="/tools/image-base64" description="Convert images to Base64 data URIs" />
        <ToolRow name="Text ↔ Binary Converter" href="/tools/text-binary" description="Convert text to binary and back" />
        <ToolRow name="Password Generator" href="/tools/password-generator" description="Generate cryptographically strong random passwords" />
      </ToolCategory>

      {/* Format & Validate */}
      <ToolCategory title="Formatters & Validators (9)">
        <ToolRow name="SQL Formatter & Beautifier" href="/tools/sql-formatter" description="Format and beautify SQL queries" />
        <ToolRow name="XML Formatter & Validator" href="/tools/xml-formatter" description="Format, validate, and minify XML" />
        <ToolRow name="YAML Validator & Formatter" href="/tools/yaml-formatter" description="Validate and format YAML documents" />
        <ToolRow name="JS/CSS/HTML Minifier & Beautifier" href="/tools/code-minifier" description="Minify and beautify JavaScript, CSS, and HTML" />
        <ToolRow name="Markdown Preview" href="/tools/markdown-preview" description="Write and preview Markdown with live rendering" />
        <ToolRow name="Diff Checker" href="/tools/diff-checker" description="Compare two texts and highlight differences" />
        <ToolRow name="Git Diff Viewer" href="/tools/git-diff-viewer" description="Render unified diffs with syntax highlighting" />
        <ToolRow name="Dockerfile Validator" href="/tools/dockerfile-validator" description="Validate Dockerfiles for syntax, security, and best practices" />
        <ToolRow name="Docker Compose Validator" href="/tools/docker-compose" description="Validate and format Docker Compose files" />
      </ToolCategory>

      {/* TypeScript & JavaScript */}
      <ToolCategory title="TypeScript & JavaScript (10)">
        <ToolRow name="JavaScript/TypeScript Playground" href="/tools/js-playground" description="Run JS/TS in-browser with sandboxed execution" />
        <ToolRow name="TypeScript to JavaScript Converter" href="/tools/typescript-to-js" description="Strip types from TypeScript to produce clean JavaScript" />
        <ToolRow name="HTML to JSX Converter" href="/tools/html-to-jsx" description="Convert HTML to valid JSX with attribute mappings" />
        <ToolRow name="SVG to JSX Converter" href="/tools/svg-to-jsx" description="Convert SVG to React/TypeScript components" />
        <ToolRow name="tsconfig.json Visual Builder" href="/tools/tsconfig-builder" description="Visual form-based tsconfig builder with presets" />
        <ToolRow name="TypeScript 6.0 Migration Checker" href="/tools/ts6-migration" description="Analyze tsconfig.json for TS 6.0 breaking changes" />
        <ToolRow name="ESLint to Biome Converter" href="/tools/eslint-to-biome" description="Convert ESLint config to Biome with 100+ rule mappings" />
        <ToolRow name="Zod Schema Generator" href="/tools/zod-schema" description="Generate Zod schemas from JSON data" />
        <ToolRow name="package.json Generator" href="/tools/package-json-generator" description="Visual package.json builder with framework presets" />
        <ToolRow name="GraphQL to TypeScript Converter" href="/tools/graphql-to-typescript" description="Convert GraphQL SDL schemas to TypeScript interfaces" />
      </ToolCategory>

      {/* CSS & Design */}
      <ToolCategory title="CSS & Design (13)">
        <ToolRow name="Color Converter" href="/tools/color-converter" description="Convert between HEX, RGB, and HSL" />
        <ToolRow name="Color Palette Generator" href="/tools/color-palette" description="Generate harmonious color palettes" />
        <ToolRow name="Color Contrast Checker" href="/tools/contrast-checker" description="Check WCAG color contrast accessibility" />
        <ToolRow name="CSS Gradient Generator" href="/tools/gradient-generator" description="Visual linear and radial gradient builder" />
        <ToolRow name="CSS Box Shadow Generator" href="/tools/box-shadow" description="Visual box-shadow builder with presets" />
        <ToolRow name="CSS Text Shadow Generator" href="/tools/text-shadow" description="Visual text-shadow builder" />
        <ToolRow name="CSS Border Radius Generator" href="/tools/border-radius" description="Visual border-radius builder" />
        <ToolRow name="CSS Flexbox Generator" href="/tools/flexbox-generator" description="Visual flexbox layout builder" />
        <ToolRow name="CSS Grid Generator" href="/tools/grid-generator" description="Visual CSS Grid layout builder" />
        <ToolRow name="CSS Animation Generator" href="/tools/css-animation" description="Visual keyframe animation builder" />
        <ToolRow name="Tailwind CSS Generator" href="/tools/tailwind-generator" description="Visual Tailwind utility class builder" />
        <ToolRow name="CSS to Tailwind Converter" href="/tools/css-to-tailwind" description="Convert CSS properties to Tailwind classes" />
        <ToolRow name="Code Screenshot Generator" href="/tools/code-screenshot" description="Generate beautiful code screenshots with themes" />
      </ToolCategory>

      {/* API & Web */}
      <ToolCategory title="API & Web Development (11)">
        <ToolRow name="JWT Decoder" href="/tools/jwt-decoder" description="Decode and inspect JSON Web Tokens" />
        <ToolRow name="JWT Builder & Generator" href="/tools/jwt-builder" description="Build and sign JWTs with 10 algorithms" />
        <ToolRow name="cURL to Code Converter" href="/tools/curl-converter" description="Convert cURL commands to Python, JavaScript, Go, and more" />
        <ToolRow name="URL Parser" href="/tools/url-parser" description="Parse URLs into protocol, host, path, and query params" />
        <ToolRow name="HTTP Status Code Reference" href="/tools/http-status-codes" description="Complete HTTP status code reference with REST cheat sheet" />
        <ToolRow name="OpenAPI / Swagger Validator" href="/tools/openapi-validator" description="Validate OpenAPI 3.x and Swagger 2.0 specs" />
        <ToolRow name="OpenAPI to TypeScript Converter" href="/tools/openapi-to-typescript" description="Generate TypeScript types from OpenAPI schemas" />
        <ToolRow name="Open Graph Preview & Debugger" href="/tools/og-preview" description="Preview Open Graph meta tags across social platforms" />
        <ToolRow name="Brotli/Gzip Compression Tester" href="/tools/compression-tester" description="Compare Brotli, Gzip, and Deflate compression ratios" />
        <ToolRow name="SQL to TypeScript/Prisma/Drizzle" href="/tools/sql-to-typescript" description="Convert SQL schemas to TS interfaces, Prisma, and Drizzle" />
        <ToolRow name="TOML ↔ JSON/YAML Converter" href="/tools/toml-converter" description="Convert between TOML, JSON, and YAML" />
      </ToolCategory>

      {/* Security */}
      <ToolCategory title="Security & Privacy (7)">
        <ToolRow name="AI Code Security Scanner" href="/tools/code-security-scanner" description="Scan code for hardcoded secrets, injection, XSS, SSRF" />
        <ToolRow name="Code Complexity Analyzer" href="/tools/code-complexity-analyzer" description="Cyclomatic complexity, cognitive complexity, maintainability index" />
        <ToolRow name="CSP Header Builder" href="/tools/csp-builder" description="Visual Content Security Policy builder with presets" />
        <ToolRow name="Security Headers Generator" href="/tools/security-headers" description="Generate and analyze HTTP security headers" />
        <ToolRow name=".env File Validator" href="/tools/env-validator" description="Validate .env files for secrets, duplicates, and syntax" />
        <ToolRow name="Privacy Policy Generator" href="/tools/privacy-policy" description="Generate GDPR/CCPA-compliant privacy policies" />
        <ToolRow name="Chmod Calculator" href="/tools/chmod-calculator" description="Calculate Unix file permissions" />
      </ToolCategory>

      {/* DevOps & Config */}
      <ToolCategory title="DevOps & Configuration (10)">
        <ToolRow name="Kubernetes YAML Validator" href="/tools/k8s-validator" description="Validate 20+ K8s resource types and best practices" />
        <ToolRow name="Nginx Config Generator" href="/tools/nginx-config" description="Form-based Nginx config builder with presets" />
        <ToolRow name=".gitignore Generator" href="/tools/gitignore-generator" description="Generate .gitignore files for any stack" />
        <ToolRow name="Crontab Generator" href="/tools/cron-generator" description="Visual crontab expression builder" />
        <ToolRow name="Cron Expression Parser" href="/tools/cron-parser" description="Parse and explain cron expressions" />
        <ToolRow name="robots.txt Generator" href="/tools/robots-generator" description="Generate robots.txt with bot presets" />
        <ToolRow name="MCP Config Builder" href="/tools/mcp-config-builder" description="Build MCP server configurations for AI editors" />
        <ToolRow name="Git Command Builder" href="/tools/git-command-builder" description="Interactive Git command builder with cheat sheet" />
        <ToolRow name="IP / CIDR Toolkit" href="/tools/subnet-calculator" description="Subnet calculator, VLSM divider, IP range to CIDR" />
        <ToolRow name="Date Format Tester" href="/tools/date-format-tester" description="Test strftime, date-fns, Go, and Java date formats" />
      </ToolCategory>

      {/* Text & Content */}
      <ToolCategory title="Text & Content (8)">
        <ToolRow name="Regex Tester" href="/tools/regex-tester" description="Test regex patterns with real-time match highlighting" />
        <ToolRow name="Regex Generator" href="/tools/regex-generator" description="60+ curated patterns searchable by English description" />
        <ToolRow name="Word & Character Counter" href="/tools/word-counter" description="Count words, characters, sentences, and reading time" />
        <ToolRow name="Case Converter" href="/tools/case-converter" description="Convert between camelCase, snake_case, PascalCase, and more" />
        <ToolRow name="Lorem Ipsum Generator" href="/tools/lorem-ipsum" description="Generate placeholder text in paragraphs, sentences, or words" />
        <ToolRow name="Number Base Converter" href="/tools/number-base-converter" description="Convert between decimal, hex, octal, and binary" />
        <ToolRow name="ASCII Art Text Generator" href="/tools/ascii-art" description="Generate ASCII art text in 7 font styles" />
        <ToolRow name="Markdown Table Generator" href="/tools/markdown-table" description="Visual Markdown table builder" />
      </ToolCategory>

      {/* Generators */}
      <ToolCategory title="Generators & Builders (14)">
        <ToolRow name="UUID Generator" href="/tools/uuid-generator" description="Generate UUID v4 identifiers in bulk" />
        <ToolRow name="QR Code Generator" href="/tools/qr-code" description="Generate QR codes for URLs, text, WiFi, and more" />
        <ToolRow name="Favicon Generator" href="/tools/favicon-generator" description="Generate favicons from text, emoji, or images" />
        <ToolRow name="Placeholder Image Generator" href="/tools/placeholder-image" description="Generate placeholder images with custom dimensions" />
        <ToolRow name="SVG Optimizer & Viewer" href="/tools/svg-optimizer" description="Optimize SVG files and preview the result" />
        <ToolRow name="Image Compressor" href="/tools/image-compressor" description="Compress images client-side with quality control" />
        <ToolRow name="Meta Tag Generator" href="/tools/meta-tag-generator" description="Generate meta tags for SEO and social sharing" />
        <ToolRow name="README Generator" href="/tools/readme-generator" description="Build professional GitHub README files" />
        <ToolRow name="URL Slug Generator" href="/tools/slug-generator" description="Generate clean URL slugs from text" />
        <ToolRow name="HTML ↔ Markdown Converter" href="/tools/html-markdown" description="Convert between HTML and Markdown" />
        <ToolRow name="Epoch Converter" href="/tools/epoch-converter" description="Convert between Unix timestamps and dates" />
        <ToolRow name="JSON to TypeScript Generator" href="/tools/json-to-typescript" description="Generate TypeScript interfaces from JSON" />
        <ToolRow name="AI Prompt Template Builder" href="/tools/prompt-builder" description="Structured prompt builder for developers" />
        <ToolRow name="AI Model Comparison" href="/tools/ai-model-comparison" description="Compare 21 AI models across 7 providers" />
      </ToolCategory>

      {/* AI & Modern Tools */}
      <ToolCategory title="AI & Developer Intelligence (5)">
        <ToolRow name="LLM Token Counter & Cost Calculator" href="/tools/token-counter" description="Count tokens and estimate costs across 19 models" />
        <ToolRow name="AI Model Comparison" href="/tools/ai-model-comparison" description="Interactive comparison of 21 models from 7 providers" />
        <ToolRow name="AI Prompt Template Builder" href="/tools/prompt-builder" description="Structured prompts for code review, testing, docs" />
        <ToolRow name="AI Code Security Scanner" href="/tools/code-security-scanner" description="Scan AI-generated code for 25 vulnerability patterns" />
        <ToolRow name="Code Complexity Analyzer" href="/tools/code-complexity-analyzer" description="Measure code quality before shipping AI-generated code" />
      </ToolCategory>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Tools CodeBeautify Doesn&apos;t Have
      </h2>

      <p className="text-gray-600 dark:text-gray-400">
        Beyond matching CodeBeautify&apos;s core formatters and converters,
        DevBolt covers categories that CodeBeautify doesn&apos;t touch:
      </p>

      <ul className="mt-4 ml-6 list-disc space-y-2 text-gray-600 dark:text-gray-400">
        <li>
          <strong className="text-gray-900 dark:text-white">
            Security scanning
          </strong>{" "}
          &mdash;{" "}
          <ToolLink href="/tools/code-security-scanner">
            AI Code Security Scanner
          </ToolLink>
          {" "}detects hardcoded secrets, injection, XSS, SSRF, and 25 other
          vulnerability patterns
        </li>
        <li>
          <strong className="text-gray-900 dark:text-white">
            TypeScript tooling
          </strong>{" "}
          &mdash; tsconfig builder, TS 6.0 migration checker, TS-to-JS
          converter, GraphQL/OpenAPI/SQL to TypeScript converters
        </li>
        <li>
          <strong className="text-gray-900 dark:text-white">
            CSS visual builders
          </strong>{" "}
          &mdash; Flexbox, Grid, animations, gradients, shadows, and border
          radius &mdash; all with live preview and copy-ready output
        </li>
        <li>
          <strong className="text-gray-900 dark:text-white">
            DevOps validators
          </strong>{" "}
          &mdash; Dockerfile, Docker Compose, Kubernetes YAML, Nginx config,
          and .env file validation
        </li>
        <li>
          <strong className="text-gray-900 dark:text-white">
            AI development tools
          </strong>{" "}
          &mdash; token counter, model comparison, prompt templates, and MCP
          config builder
        </li>
        <li>
          <strong className="text-gray-900 dark:text-white">
            Code generation
          </strong>{" "}
          &mdash; JSON to Go/Python/Rust/Java/C#/Dart/Swift/Kotlin, SQL to
          Prisma/Drizzle, cURL to code in 8 languages
        </li>
      </ul>

      <AffiliateBox>
        <strong>Hosting your own tools?</strong>{" "}
        <a
          href="https://www.digitalocean.com/?refcode=placeholder"
          rel="noopener sponsored"
          className="underline"
        >
          DigitalOcean
        </a>{" "}
        offers $200 in free credits for new accounts &mdash; enough to run a
        developer tools site for months.
      </AffiliateBox>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        DevBolt vs Other Alternatives
      </h2>

      <p className="text-gray-600 dark:text-gray-400">
        DevBolt isn&apos;t the only CodeBeautify alternative, but it&apos;s
        the only one with 117+ tools that are all client-side:
      </p>

      <div className="my-6 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
              <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Site</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Tools</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Client-side?</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Ads?</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            <tr>
              <td className="px-4 py-2.5 font-medium text-indigo-600 dark:text-indigo-400">DevBolt</td>
              <td className="px-4 py-2.5 text-gray-900 dark:text-white font-medium">117</td>
              <td className="px-4 py-2.5 text-emerald-600 dark:text-emerald-400">All tools</td>
              <td className="px-4 py-2.5 text-emerald-600 dark:text-emerald-400">None</td>
            </tr>
            <tr>
              <td className="px-4 py-2.5 text-gray-900 dark:text-white">devformat.tools</td>
              <td className="px-4 py-2.5 text-gray-600 dark:text-gray-400">~52</td>
              <td className="px-4 py-2.5 text-emerald-600 dark:text-emerald-400">Most</td>
              <td className="px-4 py-2.5 text-gray-600 dark:text-gray-400">Minimal</td>
            </tr>
            <tr>
              <td className="px-4 py-2.5 text-gray-900 dark:text-white">CodeBeautify</td>
              <td className="px-4 py-2.5 text-gray-600 dark:text-gray-400">~45</td>
              <td className="px-4 py-2.5 text-red-600 dark:text-red-400">No (server-side)</td>
              <td className="px-4 py-2.5 text-red-600 dark:text-red-400">Heavy</td>
            </tr>
            <tr>
              <td className="px-4 py-2.5 text-gray-900 dark:text-white">10015.io</td>
              <td className="px-4 py-2.5 text-gray-600 dark:text-gray-400">~40</td>
              <td className="px-4 py-2.5 text-gray-600 dark:text-gray-400">Mixed</td>
              <td className="px-4 py-2.5 text-gray-600 dark:text-gray-400">Some</td>
            </tr>
            <tr>
              <td className="px-4 py-2.5 text-gray-900 dark:text-white">transform.tools</td>
              <td className="px-4 py-2.5 text-gray-600 dark:text-gray-400">~30</td>
              <td className="px-4 py-2.5 text-emerald-600 dark:text-emerald-400">Most</td>
              <td className="px-4 py-2.5 text-gray-600 dark:text-gray-400">None</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Why Client-Side Matters for Developer Tools
      </h2>

      <p className="text-gray-600 dark:text-gray-400">
        Developers routinely paste sensitive data into online tools &mdash;
        JWT tokens with user data, JSON API responses with credentials,
        config files with database URLs, code with hardcoded secrets.
        Server-side tools create three risks:
      </p>

      <ul className="mt-4 ml-6 list-decimal space-y-2 text-gray-600 dark:text-gray-400">
        <li>
          <strong className="text-gray-900 dark:text-white">
            Data storage
          </strong>{" "}
          &mdash; servers can log or store your input (as CodeBeautify did)
        </li>
        <li>
          <strong className="text-gray-900 dark:text-white">
            Data breaches
          </strong>{" "}
          &mdash; stored data can be hacked, leaked, or misconfigured
        </li>
        <li>
          <strong className="text-gray-900 dark:text-white">
            Third-party access
          </strong>{" "}
          &mdash; analytics, CDNs, and ad networks on the page can intercept
          data in transit
        </li>
      </ul>

      <p className="mt-4 text-gray-600 dark:text-gray-400">
        Client-side tools eliminate all three. Your data is processed by
        JavaScript running in your browser&apos;s sandbox. It never touches
        a network connection. Even if someone compromised the DevBolt server,
        they would get HTML and JavaScript &mdash; not your data, because
        your data was never there.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Getting Started
      </h2>

      <p className="text-gray-600 dark:text-gray-400">
        No signup required. Pick a tool and start using it:
      </p>

      <ul className="mt-4 ml-6 list-disc space-y-2 text-gray-600 dark:text-gray-400">
        <li>
          <ToolLink href="/tools/json-formatter">JSON Formatter</ToolLink>
          {" "}&mdash; the most common CodeBeautify use case, now 100% client-side
        </li>
        <li>
          <ToolLink href="/tools/base64">Base64 Encoder & Decoder</ToolLink>
          {" "}&mdash; encode/decode without sending data to a server
        </li>
        <li>
          <ToolLink href="/tools/jwt-decoder">JWT Decoder</ToolLink>
          {" "}&mdash; inspect tokens that may contain user PII
        </li>
        <li>
          <ToolLink href="/tools/code-security-scanner">AI Code Security Scanner</ToolLink>
          {" "}&mdash; scan AI-generated code for vulnerabilities before shipping
        </li>
        <li>
          <ToolLink href="/">Browse all 117 tools</ToolLink>
          {" "}&mdash; searchable with Ctrl+K from any page
        </li>
      </ul>

      <InfoBox>
        <strong>Keyboard tip:</strong> Press{" "}
        <Code>Ctrl+K</Code> (or <Code>Cmd+K</Code> on Mac)
        from any page to instantly search all 117 tools. Use arrow keys to
        navigate and Enter to open.
      </InfoBox>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Frequently Asked Questions
      </h2>

      <div className="mt-6 space-y-6">
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            Is DevBolt really free?
          </h3>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Yes. All 117 tools are free to use with no signup, no account,
            and no limits on usage. DevBolt also offers a Pro API for
            developers who want to integrate tools programmatically.
          </p>
        </div>

        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            How can I verify that tools are client-side?
          </h3>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Open your browser&apos;s DevTools (F12), go to the Network tab,
            clear all entries, then use any tool. If zero network requests
            are made when you process data, the tool is client-side. DevBolt
            is also{" "}
            <a
              href="https://github.com/benwalker14/free-solo-tools"
              rel="noopener"
              className="text-indigo-600 underline hover:text-indigo-500 dark:text-indigo-400"
            >
              open source on GitHub
            </a>
            {" "}&mdash; you can read every line of code.
          </p>
        </div>

        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            Does DevBolt work offline?
          </h3>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            DevBolt is a Progressive Web App (PWA). After your first visit,
            tools are cached by the service worker and work offline. You can
            install DevBolt as a standalone app from your browser.
          </p>
        </div>

        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            Should I rotate my credentials if I used CodeBeautify?
          </h3>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Yes. If you ever pasted API keys, database passwords, JWT
            secrets, or connection strings into any server-side tool, rotate
            them now. See our{" "}
            <ToolLink href="/blog/developer-tools-privacy">
              data leak breakdown
            </ToolLink>
            {" "}for a step-by-step credential rotation guide.
          </p>
        </div>

        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            What makes DevBolt different from devformat.tools?
          </h3>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            DevBolt has 117 tools vs devformat&apos;s ~52. DevBolt also
            covers categories devformat doesn&apos;t &mdash; security
            scanning, DevOps validation, AI development tools, CSS visual
            builders, and TypeScript tooling. Both are client-side, but
            DevBolt has twice the tool coverage.
          </p>
        </div>
      </div>
    </>
  );
}
