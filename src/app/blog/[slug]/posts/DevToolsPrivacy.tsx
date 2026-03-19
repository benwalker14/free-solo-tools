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

export default function DevToolsPrivacy() {
  return (
    <>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        In November 2025, two of the most popular online developer tools
        &mdash; CodeBeautify and JSONFormatter &mdash; suffered a catastrophic
        data leak. Over 5 GB of user submissions were exposed publicly,
        containing AWS access keys, database passwords, Stripe secret keys, and
        bank account credentials. The tools that developers trusted with
        sensitive data were silently storing everything on their servers.
      </p>

      <p className="mt-4 text-gray-600 dark:text-gray-400">
        This wasn&apos;t a sophisticated hack. It was an architectural choice:
        these tools sent your data to a server for processing. That server
        stored it. And for years, nobody noticed &mdash; until 80,000+
        submissions containing credentials were discovered sitting in publicly
        accessible storage.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        What Happened: The 2025 Developer Tools Data Leak
      </h2>

      <p className="text-gray-600 dark:text-gray-400">
        The leak was reported by The Hacker News, BleepingComputer,
        SecurityWeek, and TechRadar. Here&apos;s what was found:
      </p>

      <ul className="mt-4 ml-6 list-disc space-y-2 text-gray-600 dark:text-gray-400">
        <li>
          <strong className="text-gray-900 dark:text-white">
            AWS access keys and secret keys
          </strong>{" "}
          &mdash; full programmatic access to cloud infrastructure
        </li>
        <li>
          <strong className="text-gray-900 dark:text-white">
            Database connection strings
          </strong>{" "}
          &mdash; with plaintext passwords to production databases
        </li>
        <li>
          <strong className="text-gray-900 dark:text-white">
            Stripe secret keys
          </strong>{" "}
          &mdash; complete access to payment processing
        </li>
        <li>
          <strong className="text-gray-900 dark:text-white">
            Google Cloud and Azure credentials
          </strong>
        </li>
        <li>
          <strong className="text-gray-900 dark:text-white">
            Active Directory credentials
          </strong>{" "}
          &mdash; enterprise network access
        </li>
        <li>
          <strong className="text-gray-900 dark:text-white">
            Bank account numbers and financial data
          </strong>
        </li>
      </ul>

      <WarningBox>
        <strong>The root cause was simple:</strong> CodeBeautify and
        JSONFormatter processed user input on their servers. Every JSON blob,
        every Base64 string, every JWT token &mdash; all sent to their backend,
        processed, and stored. Over 5 years, this accumulated into a massive
        trove of sensitive data sitting in cloud storage with inadequate access
        controls.
      </WarningBox>

      <p className="text-gray-600 dark:text-gray-400">
        These weren&apos;t small sites. CodeBeautify receives roughly 2.3
        million monthly visits. JSONFormatter is similarly popular. Combined,
        they serve around 5 million developers per month. The trust was
        implicit: developers assumed their input was processed and discarded. It
        wasn&apos;t.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Server-Side vs. Client-Side: Why Architecture Matters
      </h2>

      <p className="text-gray-600 dark:text-gray-400">
        Most online developer tools follow the same pattern: you paste data into
        a text area, click a button, and get a result. What you can&apos;t see
        is <em>where</em> the processing happens. There are two fundamentally
        different approaches:
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Server-Side Processing (How Most Tools Work)
      </h3>

      <ol className="mt-4 ml-6 list-decimal space-y-2 text-gray-600 dark:text-gray-400">
        <li>You paste your JSON, JWT, Base64 string, or config file</li>
        <li>
          Your browser sends that data to the tool&apos;s server via an HTTP
          request
        </li>
        <li>The server processes it and sends the result back</li>
        <li>
          Your data now exists on someone else&apos;s server &mdash; and may be
          logged, cached, or stored
        </li>
      </ol>

      <CodeBlock title="What happens behind the scenes (server-side)">{`POST /api/format-json HTTP/1.1
Host: some-tool-site.com
Content-Type: application/json

{
  "input": "{\\"aws_secret_key\\": \\"AKIA...\\"}"
}

// Your secret key is now on their server.
// Was it logged? Stored? Cached? You have no way to know.`}</CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Client-Side Processing (The Safe Approach)
      </h3>

      <ol className="mt-4 ml-6 list-decimal space-y-2 text-gray-600 dark:text-gray-400">
        <li>You paste your data</li>
        <li>
          JavaScript running <em>in your browser</em> processes it locally
        </li>
        <li>The result appears on screen</li>
        <li>
          <strong className="text-gray-900 dark:text-white">
            No network request is made. Your data never leaves your device.
          </strong>
        </li>
      </ol>

      <InfoBox>
        <strong>How to verify:</strong> Open your browser&apos;s Developer Tools
        (F12), go to the Network tab, and paste data into the tool. If no
        requests are made to external servers, the tool is processing locally.
        Try this on{" "}
        <Link
          href="/tools/json-formatter"
          className="font-medium text-emerald-700 underline dark:text-emerald-300"
        >
          DevBolt&apos;s JSON Formatter
        </Link>{" "}
        &mdash; you&apos;ll see zero network activity.
      </InfoBox>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        What Developers Commonly Paste into Online Tools
      </h2>

      <p className="text-gray-600 dark:text-gray-400">
        Think about the last time you used an online JSON formatter, Base64
        decoder, or JWT debugger. What did you paste? Developers routinely paste
        data containing:
      </p>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800">
              <th className="py-3 pr-4 text-left font-semibold text-gray-900 dark:text-white">
                Tool
              </th>
              <th className="py-3 text-left font-semibold text-gray-900 dark:text-white">
                What Often Gets Pasted
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-600 dark:text-gray-400">
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4">JSON Formatter</td>
              <td className="py-3">
                API responses with tokens, config files with credentials, .env
                contents
              </td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4">Base64 Decoder</td>
              <td className="py-3">
                Authentication headers, encoded tokens, certificate data
              </td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4">JWT Decoder</td>
              <td className="py-3">
                Session tokens with user IDs, roles, permissions, email
                addresses
              </td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4">Diff Checker</td>
              <td className="py-3">
                Config changes, code with hardcoded secrets, environment files
              </td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4">URL Parser</td>
              <td className="py-3">
                URLs with API keys in query parameters, OAuth callback URLs
              </td>
            </tr>
            <tr>
              <td className="py-3 pr-4">YAML/TOML Formatter</td>
              <td className="py-3">
                Kubernetes configs, CI/CD pipeline definitions, Docker secrets
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-gray-600 dark:text-gray-400">
        With server-side tools, every one of these interactions is a potential
        data leak. Not because someone is intentionally stealing your data, but
        because servers log things. They cache things. They store things in
        temporary files. And as the 2025 leak proved, those stored copies can
        accumulate for years.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        How to Check If a Tool Is Safe
      </h2>

      <p className="text-gray-600 dark:text-gray-400">
        Don&apos;t take any tool&apos;s word for it &mdash; verify. Here are
        concrete steps to check whether a developer tool is actually processing
        your data locally:
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        1. Check the Network Tab
      </h3>

      <ol className="mt-4 ml-6 list-decimal space-y-2 text-gray-600 dark:text-gray-400">
        <li>
          Open Developer Tools (<Code>F12</Code> or{" "}
          <Code>Ctrl+Shift+I</Code>)
        </li>
        <li>Go to the Network tab</li>
        <li>Paste data into the tool and click the action button</li>
        <li>
          Look for XHR/Fetch requests &mdash; if you see requests to the
          tool&apos;s API, your data left your browser
        </li>
      </ol>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        2. Try It Offline
      </h3>

      <p className="text-gray-600 dark:text-gray-400">
        Disconnect from the internet, then use the tool. If it still works, it&apos;s
        processing locally. Server-dependent tools will break immediately.
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        3. Check for Cookies and Trackers
      </h3>

      <p className="text-gray-600 dark:text-gray-400">
        In Developer Tools, check the Application tab → Cookies. Privacy audits
        have found that CodeBeautify sets over 540 tracking cookies. A
        client-side tool doesn&apos;t need cookies to function.
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        4. Check If the Source Is Open
      </h3>

      <p className="text-gray-600 dark:text-gray-400">
        Open-source tools let you verify exactly what happens with your data.
        You can read the code and confirm there are no hidden API calls.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        A Checklist for Choosing Developer Tools
      </h2>

      <p className="text-gray-600 dark:text-gray-400">
        Before pasting anything sensitive into an online tool, run through this
        checklist:
      </p>

      <div className="my-6 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
        <div className="bg-gray-50 p-4 dark:bg-gray-900">
          <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-emerald-500">&#x2713;</span>
              <span>
                <strong>Client-side processing</strong> &mdash; Does the tool
                process data in your browser? Check the Network tab.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-emerald-500">&#x2713;</span>
              <span>
                <strong>No account required</strong> &mdash; If a tool
                doesn&apos;t need your data, it doesn&apos;t need your email.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-emerald-500">&#x2713;</span>
              <span>
                <strong>Minimal cookies</strong> &mdash; Zero tracking cookies
                is ideal. Hundreds is a red flag.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-emerald-500">&#x2713;</span>
              <span>
                <strong>Works offline</strong> &mdash; A true client-side tool
                should work without an internet connection.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-emerald-500">&#x2713;</span>
              <span>
                <strong>Open source</strong> &mdash; The code is verifiable.
                No hidden data collection.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-emerald-500">&#x2713;</span>
              <span>
                <strong>HTTPS enforced</strong> &mdash; Data in transit should
                always be encrypted.
              </span>
            </li>
          </ul>
        </div>
      </div>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        What About Desktop Alternatives?
      </h2>

      <p className="text-gray-600 dark:text-gray-400">
        Desktop tools like DevToys (Windows), DevUtils (macOS), and IT Tools
        (self-hosted) process everything locally by design. They&apos;re
        excellent options when available. However, they have trade-offs:
      </p>

      <ul className="mt-4 ml-6 list-disc space-y-2 text-gray-600 dark:text-gray-400">
        <li>
          <strong className="text-gray-900 dark:text-white">
            Installation required
          </strong>{" "}
          &mdash; not always possible on work machines or shared environments
        </li>
        <li>
          <strong className="text-gray-900 dark:text-white">
            Platform-locked
          </strong>{" "}
          &mdash; DevToys is Windows-only, DevUtils is macOS-only
        </li>
        <li>
          <strong className="text-gray-900 dark:text-white">Updates</strong>{" "}
          &mdash; web-based tools are always up to date
        </li>
        <li>
          <strong className="text-gray-900 dark:text-white">
            Accessibility
          </strong>{" "}
          &mdash; a URL works from any device, anywhere
        </li>
      </ul>

      <p className="mt-4 text-gray-600 dark:text-gray-400">
        The ideal is a web-based tool that processes everything client-side
        &mdash; the convenience of a URL with the privacy of a desktop app.
        This is exactly how{" "}
        <Link
          href="/"
          className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          DevBolt
        </Link>{" "}
        is built. Every one of our{" "}
        <Link
          href="/free-tools"
          className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          78+ tools
        </Link>{" "}
        runs entirely in your browser. No server calls. No data storage. No
        cookies.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Lessons from the Leak
      </h2>

      <p className="text-gray-600 dark:text-gray-400">
        The CodeBeautify/JSONFormatter incident should change how developers
        think about online tools. Here are the key takeaways:
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        1. Never Paste Production Secrets into Server-Side Tools
      </h3>

      <p className="text-gray-600 dark:text-gray-400">
        This sounds obvious, but 80,000+ submissions containing real credentials
        prove that developers do it constantly. If a tool sends data to a
        server, treat it like pasting your secrets into a public Slack channel.
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        2. &ldquo;We Don&apos;t Store Your Data&rdquo; Is Not Enough
      </h3>

      <p className="text-gray-600 dark:text-gray-400">
        Many tools claim they don&apos;t store user input. The problem is that
        servers have logs, caches, temporary files, error tracking, and
        monitoring &mdash; all of which can capture data even if the
        application doesn&apos;t intentionally save it. The only guarantee is
        to never send the data in the first place.
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        3. Architecture Is the Real Privacy Policy
      </h3>

      <p className="text-gray-600 dark:text-gray-400">
        Privacy policies are legal documents. They describe intent. Client-side
        architecture is a <em>technical guarantee</em>. When data never leaves
        your browser, there&apos;s nothing to leak, nothing to subpoena,
        nothing to breach. The architecture <em>is</em> the protection.
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        4. Rotate Any Credentials You&apos;ve Pasted into Server-Side Tools
      </h3>

      <p className="text-gray-600 dark:text-gray-400">
        If you&apos;ve ever pasted AWS keys, API tokens, database passwords, or
        any credential into a server-side tool, rotate those credentials now.
        You have no way of knowing what was logged or stored. Here&apos;s how
        to check and rotate common credentials:
      </p>

      <CodeBlock title="Rotating common credentials">{`# AWS: Rotate access keys
aws iam create-access-key --user-name your-user
aws iam delete-access-key --access-key-id OLD_KEY_ID --user-name your-user

# Stripe: Roll API keys in Dashboard → Developers → API keys → Roll key

# Database: Change password
ALTER USER your_user WITH PASSWORD 'new_secure_password';

# GitHub: Settings → Developer settings → Personal access tokens → Regenerate

# Google Cloud: IAM → Service accounts → Keys → Create new key → Delete old key`}</CodeBlock>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Building a Safer Workflow
      </h2>

      <p className="text-gray-600 dark:text-gray-400">
        Here&apos;s a practical framework for using developer tools safely:
      </p>

      <ol className="mt-4 ml-6 list-decimal space-y-3 text-gray-600 dark:text-gray-400">
        <li>
          <strong className="text-gray-900 dark:text-white">
            Use client-side tools by default.
          </strong>{" "}
          For JSON formatting, Base64 encoding, JWT decoding, hashing, and most
          developer utilities, there&apos;s no reason to send data to a server.
          These operations can all happen in JavaScript.
        </li>
        <li>
          <strong className="text-gray-900 dark:text-white">
            Strip secrets before pasting.
          </strong>{" "}
          If you must use a server-side tool, remove or replace sensitive values
          first. Use <Code>REDACTED</Code> or dummy values.
        </li>
        <li>
          <strong className="text-gray-900 dark:text-white">
            Bookmark trusted tools.
          </strong>{" "}
          Don&apos;t Google &ldquo;json formatter&rdquo; every time and click
          the first result. Save the tools you&apos;ve verified as safe.
        </li>
        <li>
          <strong className="text-gray-900 dark:text-white">
            Use the Network tab.
          </strong>{" "}
          Spend 30 seconds verifying a new tool before trusting it with
          sensitive data. It could save you from a breach.
        </li>
        <li>
          <strong className="text-gray-900 dark:text-white">
            Educate your team.
          </strong>{" "}
          Share this checklist with your team. Security is only as strong as the
          weakest link.
        </li>
      </ol>

      <InfoBox>
        <strong>DevBolt&apos;s approach:</strong> Every tool on DevBolt
        processes data entirely in your browser using JavaScript and Web APIs.
        No server calls, no cookies, no account required. You can verify this
        yourself &mdash; open the Network tab and paste anything. You&apos;ll
        see zero requests to our servers. Try the{" "}
        <Link
          href="/tools/json-formatter"
          className="font-medium text-emerald-700 underline dark:text-emerald-300"
        >
          JSON Formatter
        </Link>
        ,{" "}
        <Link
          href="/tools/base64"
          className="font-medium text-emerald-700 underline dark:text-emerald-300"
        >
          Base64 Decoder
        </Link>
        , or{" "}
        <Link
          href="/tools/jwt-decoder"
          className="font-medium text-emerald-700 underline dark:text-emerald-300"
        >
          JWT Decoder
        </Link>{" "}
        and see for yourself.
      </InfoBox>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        The Bottom Line
      </h2>

      <p className="text-gray-600 dark:text-gray-400">
        The 2025 data leak at CodeBeautify and JSONFormatter wasn&apos;t an
        isolated incident &mdash; it was the inevitable consequence of a flawed
        architecture. When developer tools send your data to a server, that data
        exists outside your control. No privacy policy can change that. No
        promise can un-send it.
      </p>

      <p className="mt-4 text-gray-600 dark:text-gray-400">
        The solution isn&apos;t to stop using online tools. It&apos;s to use
        tools that are built right &mdash; tools that process everything
        locally, in your browser, without ever sending your data anywhere. Check
        the Network tab. Verify the architecture. Your credentials will thank
        you.
      </p>
    </>
  );
}
