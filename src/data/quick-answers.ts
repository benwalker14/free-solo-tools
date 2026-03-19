/**
 * Quick answer blocks for top tool pages.
 * 2-3 sentence direct answers displayed above the tool UI.
 * Optimized for AI Overview citation and featured snippet extraction.
 */
export const quickAnswers: Record<string, { question: string; answer: string }> = {
  "json-formatter": {
    question: "How do I format and validate JSON online?",
    answer:
      "Paste your JSON into the editor and click Format to instantly pretty-print it with proper indentation, or click Minify to compress it. The tool validates your JSON in real time, highlighting syntax errors with line numbers so you can fix them quickly. Everything runs in your browser — your data is never sent to a server.",
  },
  base64: {
    question: "How do I encode or decode Base64 online?",
    answer:
      "Paste any text and click Encode to convert it to a Base64 string, or paste a Base64 string and click Decode to get the original text back. This tool supports full Unicode (including emoji and non-Latin characters) and runs entirely in your browser with no server round-trip.",
  },
  "hash-generator": {
    question: "How do I generate a SHA-256 or MD5 hash online?",
    answer:
      "Enter your text and instantly see its hash in SHA-1, SHA-256, SHA-384, SHA-512, and MD5. You can copy any hash with one click. All hashing is performed client-side using the Web Crypto API — your input never leaves your browser.",
  },
  "uuid-generator": {
    question: "How do I generate a UUID online?",
    answer:
      "Click Generate to create a cryptographically random UUID v4 instantly. You can generate UUIDs in bulk (up to 500 at once), choose between uppercase and lowercase, and copy all results with one click. UUIDs are generated in your browser using the native crypto API.",
  },
  "color-converter": {
    question: "How do I convert colors between HEX, RGB, and HSL?",
    answer:
      "Enter a color in any format — HEX (#ff6600), RGB (rgb(255, 102, 0)), or HSL (hsl(24, 100%, 50%)) — and instantly see it converted to all other formats. The tool includes a live color preview and lets you copy any value with one click.",
  },
  "jwt-decoder": {
    question: "How do I decode a JWT token online?",
    answer:
      "Paste your JWT token and instantly see its decoded header and payload as formatted JSON. The tool parses all standard claims (exp, iat, iss, sub, aud) and shows human-readable expiration dates. Your token is decoded entirely in the browser — it is never sent to any server.",
  },
  "regex-tester": {
    question: "How do I test a regular expression online?",
    answer:
      "Enter your regex pattern and test string, and see all matches highlighted in real time. The tool supports JavaScript regex flags (g, i, m, s, u), shows capture groups, and explains what each part of your pattern does. Everything runs client-side in your browser.",
  },
  "url-parser": {
    question: "How do I parse a URL into its components?",
    answer:
      "Paste any URL and instantly see it broken down into protocol, hostname, port, path, query parameters, and fragment. Query parameters are displayed in a searchable table. All parsing happens in your browser using the native URL API.",
  },
  "markdown-preview": {
    question: "How do I preview Markdown online?",
    answer:
      "Type or paste your Markdown in the editor and see a live-rendered preview side by side. The tool supports GitHub Flavored Markdown including tables, task lists, fenced code blocks with syntax highlighting, and strikethrough. Your content never leaves your browser.",
  },
  "diff-checker": {
    question: "How do I compare two texts and find differences online?",
    answer:
      "Paste your original text on the left and modified text on the right, then click Compare. The tool highlights added, removed, and changed lines with color coding. You can switch between inline and side-by-side views. All comparison runs locally in your browser.",
  },
  "epoch-converter": {
    question: "How do I convert a Unix timestamp to a human-readable date?",
    answer:
      "Paste a Unix epoch timestamp (seconds or milliseconds) and instantly see it as a formatted date and time in your local timezone and UTC. You can also convert any date/time back to an epoch timestamp. The tool shows the current epoch in real time.",
  },
  "password-generator": {
    question: "How do I generate a strong random password online?",
    answer:
      "Click Generate to create a cryptographically secure random password. Customize length (8-128 characters), and toggle uppercase, lowercase, numbers, and symbols. The tool shows a strength meter and entropy estimate. Passwords are generated locally — nothing is sent over the network.",
  },
  "url-encoder": {
    question: "How do I URL-encode or decode a string online?",
    answer:
      "Paste your text and click Encode to percent-encode special characters for safe use in URLs, or paste an encoded string and click Decode to restore the original. The tool handles all Unicode characters and runs entirely in your browser.",
  },
  "json-yaml": {
    question: "How do I convert JSON to YAML or YAML to JSON online?",
    answer:
      "Paste JSON on one side to convert it to YAML, or paste YAML to convert it to JSON. The tool handles nested objects, arrays, multiline strings, and comments. Conversion is instant and runs entirely in your browser with no data sent to a server.",
  },
  "case-converter": {
    question: "How do I convert text between camelCase, snake_case, and other cases?",
    answer:
      "Paste your text and instantly see it converted to camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, Title Case, and more. You can copy any result with one click. All processing happens in your browser.",
  },
  "csv-json": {
    question: "How do I convert CSV to JSON or JSON to CSV online?",
    answer:
      "Paste CSV data to convert it to a JSON array of objects (using the first row as keys), or paste a JSON array to convert it to CSV format. The tool handles quoted fields, commas in values, and various delimiters. Everything runs client-side.",
  },
  "sql-formatter": {
    question: "How do I format and beautify SQL online?",
    answer:
      "Paste your SQL query and click Format to instantly indent and align keywords, clauses, and expressions for readability. The tool supports standard SQL, PostgreSQL, MySQL, and other dialects. Your queries are formatted locally — they never leave your browser.",
  },
  "qr-code": {
    question: "How do I generate a QR code online?",
    answer:
      "Enter any text or URL and instantly generate a QR code you can download as PNG or SVG. Customize the size, error correction level, and foreground/background colors. The QR code is generated entirely in your browser with no server call.",
  },
  "word-counter": {
    question: "How do I count words and characters in text online?",
    answer:
      "Paste or type your text to instantly see the word count, character count (with and without spaces), sentence count, paragraph count, and estimated reading time. The tool updates in real time as you type and runs entirely in your browser.",
  },
  "code-security-scanner": {
    question: "How do I scan code for security vulnerabilities online?",
    answer:
      "Paste your JavaScript or TypeScript code and click Scan to detect hardcoded secrets, SQL injection, XSS, command injection, SSRF, prototype pollution, and 20+ other vulnerability patterns. Each finding includes severity, CWE reference, and fix guidance. All analysis runs in your browser — your code is never uploaded.",
  },
  "code-complexity-analyzer": {
    question: "How do I measure code complexity online?",
    answer:
      "Paste your JavaScript or TypeScript code and click Analyze to see cyclomatic complexity, cognitive complexity, nesting depth, and maintainability index for every function. Each function gets a risk rating with actionable refactoring recommendations. All analysis runs in your browser — your code never leaves your device.",
  },
  "http-request-builder": {
    question: "How do I build an HTTP request and generate code online?",
    answer:
      "Select the HTTP method, enter a URL, then configure headers, query parameters, authorization, and body using the visual builder. The tool instantly generates working code in cURL, JavaScript, Python, Go, Rust, and PHP. Copy the generated snippet into your project. Everything runs in your browser — your data never leaves your device.",
  },
  "github-actions-validator": {
    question: "How do I validate a GitHub Actions workflow YAML online?",
    answer:
      "Paste your workflow YAML and click Validate to check for syntax errors, missing required fields, broken job dependencies, deprecated action versions, and common misconfigurations. The validator flags errors, warnings, and best-practice suggestions with specific fix guidance. Everything runs in your browser — your workflow files never leave your device.",
  },
  "tailwind-to-css": {
    question: "How do I convert Tailwind CSS classes to standard CSS?",
    answer:
      "Paste your Tailwind utility classes (or a full class=\"...\" attribute) and the tool instantly generates the equivalent standard CSS properties. It supports 500+ classes including spacing, layout, typography, borders, transforms, filters, and arbitrary bracket values like w-[300px]. Customize the CSS selector name in the output. Everything runs in your browser — your code never leaves your device.",
  },
  "env-converter": {
    question: "How do I convert a .env file to Docker Compose or Kubernetes YAML?",
    answer:
      "Paste your .env file and select an output format: Docker Compose inline environment, Docker Compose env_file reference, Kubernetes ConfigMap, Kubernetes Secret (base64 or stringData), or docker run -e flags. The tool parses KEY=VALUE pairs, strips quotes, detects sensitive keys (passwords, tokens, API keys), and generates valid YAML or shell commands. Everything runs in your browser — your secrets never leave your device.",
  },
};
