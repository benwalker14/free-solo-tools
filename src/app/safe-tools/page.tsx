import type { Metadata } from "next";
import Link from "next/link";
import { tools } from "@/data/tools";

const BASE_URL = "https://devbolt.dev";

export const metadata: Metadata = {
  title:
    "Safe Developer Tools — Private, Client-Side Alternatives to CodeBeautify",
  description:
    "100% client-side developer tools that never send your data to a server. Safe JSON formatter, private Base64 encoder, secure JWT decoder. Zero tracking cookies. A privacy-first alternative to CodeBeautify and similar tools.",
  keywords: [
    "safe json formatter",
    "safe developer tools",
    "private developer tools",
    "codebeautify alternative",
    "private json formatter",
    "safe base64 encoder",
    "safe jwt decoder",
    "client-side developer tools",
    "no tracking developer tools",
    "private code formatter",
    "secure online tools",
    "safe yaml formatter",
    "safe regex tester",
    "private hash generator",
    "codebeautify data leak",
    "jsonformatter alternative",
  ],
  openGraph: {
    title:
      "Safe Developer Tools — Private, Client-Side Alternatives to CodeBeautify",
    description:
      "100% client-side developer tools. Zero tracking. Your data never leaves your browser. Safe alternatives to CodeBeautify and JSONFormatter.",
    url: `${BASE_URL}/safe-tools`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Safe Developer Tools — Privacy-First & Client-Side",
    description:
      "100% client-side developer tools. Zero tracking. Your data never leaves your browser.",
  },
  alternates: {
    canonical: `${BASE_URL}/safe-tools`,
  },
};

// Tools most relevant to safety/privacy concerns — these handle sensitive data
const sensitiveDataTools = [
  "json-formatter",
  "base64",
  "jwt-decoder",
  "jwt-builder",
  "hash-generator",
  "password-generator",
  "url-encoder",
  "html-entities",
  "encode-decode",
  "env-validator",
  "file-hash",
  "json-schema",
  "json-path",
  "yaml-formatter",
  "xml-formatter",
  "sql-formatter",
  "regex-tester",
  "url-parser",
  "csp-builder",
  "security-headers",
];

const safeTools = tools.filter((t) => {
  const slug = t.href.replace("/tools/", "");
  return sensitiveDataTools.includes(slug);
});

const competitors = [
  {
    name: "CodeBeautify",
    issue: "5GB user data leaked in Nov 2025 breach",
    tracking: "500+ cookies",
    serverSide: true,
  },
  {
    name: "JSONFormatter.org",
    issue: "Sends data to servers for processing",
    tracking: "200+ cookies",
    serverSide: true,
  },
  {
    name: "FreeFormatter.com",
    issue: "Server-side processing, heavy ad tracking",
    tracking: "300+ cookies",
    serverSide: true,
  },
  {
    name: "DevBolt",
    issue: "Zero breaches, zero data collection",
    tracking: "0 cookies",
    serverSide: false,
  },
];

const faqs = [
  {
    question: "What makes a developer tool 'safe'?",
    answer:
      "A safe developer tool processes all data entirely in your browser using client-side JavaScript. It never sends your input to a remote server, uses zero tracking cookies, and does not store any user data. You can verify this by opening your browser's Network tab — a safe tool makes zero network requests when you format, encode, or decode data.",
  },
  {
    question: "Is DevBolt a safe alternative to CodeBeautify?",
    answer:
      "Yes. Unlike CodeBeautify, which suffered a 5GB data breach in November 2025 exposing user credentials and API keys, DevBolt runs every tool 100% client-side. Your data never leaves your browser. We use zero tracking cookies and collect only anonymous, cookieless page-view analytics via Vercel Analytics. No user data is stored, so there is nothing to breach.",
  },
  {
    question: "How can I verify that a tool is truly client-side?",
    answer:
      "Open your browser's Developer Tools (F12), go to the Network tab, and clear the log. Then use the tool — paste JSON, encode Base64, decode a JWT. If no network requests are made during processing (only the initial page load), the tool is genuinely client-side. DevBolt passes this test for every tool.",
  },
  {
    question: "Should I use online tools for sensitive data like API keys?",
    answer:
      "Only if the tool is client-side. Server-side tools send your data over the network, where it can be logged, cached, or leaked. Client-side tools like DevBolt process everything in your browser's memory — your API keys, JWT tokens, and passwords never leave your device. For maximum security, you can use DevBolt offline via the PWA.",
  },
  {
    question: "What happened in the CodeBeautify data breach?",
    answer:
      "In November 2025, CodeBeautify and JSONFormatter.com suffered a data breach that exposed approximately 5GB of user data, including credentials, API keys, and code snippets that users had pasted into their tools. The data was exfiltrated because these tools process user input on their servers rather than client-side. This incident highlighted the risks of using server-side developer tools for sensitive data.",
  },
  {
    question: "Does DevBolt work offline?",
    answer:
      "Yes. DevBolt is a Progressive Web App (PWA) that you can install from your browser. Once installed, all tools work completely offline — no internet connection required. This provides an additional layer of security since your data cannot leave your device even in theory.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

const webpageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Safe Developer Tools — Private, Client-Side Alternatives",
  description:
    "100% client-side developer tools that never send your data to a server. A privacy-first alternative to CodeBeautify.",
  url: `${BASE_URL}/safe-tools`,
  isPartOf: {
    "@type": "WebSite",
    name: "DevBolt",
    url: BASE_URL,
  },
};

export default function SafeToolsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webpageJsonLd) }}
      />

      {/* Hero */}
      <div className="mb-16 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-sm font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
            />
          </svg>
          Your data never leaves your browser
        </div>

        <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          Safe Developer Tools
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
          {tools.length}+ tools that run{" "}
          <strong className="text-gray-900 dark:text-white">
            100% in your browser
          </strong>
          . No server uploads, no tracking cookies, no data collection. A
          privacy-first alternative to CodeBeautify, JSONFormatter, and other
          tools that send your data to their servers.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            Zero Cookies
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            Zero Server Uploads
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            Zero Data Breaches
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            Works Offline
          </span>
        </div>
      </div>

      {/* The Problem */}
      <section className="mb-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-4 text-center text-2xl font-semibold text-gray-900 dark:text-white">
            Why &ldquo;Safe&rdquo; Matters for Developer Tools
          </h2>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            In November 2025, CodeBeautify and JSONFormatter.com suffered a
            major data breach that exposed approximately{" "}
            <strong className="text-gray-900 dark:text-white">
              5GB of user data
            </strong>{" "}
            — including API keys, JWT tokens, database credentials, and source
            code that developers had pasted into their tools. This happened
            because those tools send your data to their servers for processing.
          </p>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            Every time you paste a JWT token, API key, or database connection
            string into a server-side tool, that data is transmitted over the
            network and potentially logged, cached, or stored on infrastructure
            you do not control. Even without a breach, this creates unnecessary
            risk.
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            DevBolt eliminates this risk entirely.{" "}
            <strong className="text-gray-900 dark:text-white">
              Every tool runs 100% in your browser.
            </strong>{" "}
            Your data is processed in memory using client-side JavaScript and the
            Web Crypto API. Nothing is sent to any server — ever. You can verify
            this yourself by opening your browser&apos;s Network tab.
          </p>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="mb-16">
        <h2 className="mb-6 text-center text-2xl font-semibold text-gray-900 dark:text-white">
          DevBolt vs Server-Side Tools
        </h2>
        <div className="overflow-x-auto">
          <table className="mx-auto w-full max-w-3xl text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">
                  Tool
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">
                  Tracking Cookies
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">
                  Server Processing
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">
                  Data Safety
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
              {competitors.map((comp) => (
                <tr
                  key={comp.name}
                  className={
                    comp.name === "DevBolt"
                      ? "bg-emerald-50/50 dark:bg-emerald-950/20"
                      : ""
                  }
                >
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                    {comp.name}
                    {comp.name === "DevBolt" && (
                      <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900 dark:text-emerald-400">
                        You are here
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                    <span
                      className={
                        comp.tracking === "0 cookies"
                          ? "font-medium text-emerald-600 dark:text-emerald-400"
                          : "text-red-600 dark:text-red-400"
                      }
                    >
                      {comp.tracking}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {comp.serverSide ? (
                      <span className="inline-flex items-center gap-1 text-red-600 dark:text-red-400">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                        Yes — data sent to servers
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        No — 100% client-side
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                    {comp.issue}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* How to Verify */}
      <section className="mb-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-4 text-center text-2xl font-semibold text-gray-900 dark:text-white">
            How to Verify a Tool is Safe
          </h2>
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900">
            <ol className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
              <li className="flex gap-3">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                  1
                </span>
                <span>
                  Open your browser&apos;s Developer Tools ({" "}
                  <code className="rounded bg-gray-200 px-1.5 py-0.5 text-xs font-mono dark:bg-gray-800">
                    F12
                  </code>{" "}
                  or{" "}
                  <code className="rounded bg-gray-200 px-1.5 py-0.5 text-xs font-mono dark:bg-gray-800">
                    Ctrl+Shift+I
                  </code>
                  )
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                  2
                </span>
                <span>
                  Go to the{" "}
                  <strong className="text-gray-900 dark:text-white">
                    Network
                  </strong>{" "}
                  tab and click{" "}
                  <strong className="text-gray-900 dark:text-white">
                    Clear
                  </strong>
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                  3
                </span>
                <span>
                  Use the tool — paste JSON, encode Base64, decode a JWT token
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                  4
                </span>
                <span>
                  Check the Network tab —{" "}
                  <strong className="text-gray-900 dark:text-white">
                    zero requests
                  </strong>{" "}
                  means the tool is truly client-side and your data stayed in
                  your browser
                </span>
              </li>
            </ol>
          </div>
        </div>
      </section>

      {/* Safe Tools Grid */}
      <section className="mb-16">
        <h2 className="mb-2 text-center text-2xl font-semibold text-gray-900 dark:text-white">
          Tools Safe for Sensitive Data
        </h2>
        <p className="mb-8 text-center text-gray-600 dark:text-gray-400">
          These tools frequently handle API keys, tokens, passwords, and
          credentials. Every one runs 100% in your browser.
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {safeTools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group flex items-start gap-3 rounded-lg border border-gray-200 p-4 transition-colors hover:border-emerald-300 hover:bg-emerald-50/50 dark:border-gray-800 dark:hover:border-emerald-700 dark:hover:bg-emerald-950/30"
            >
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-gray-100 font-mono text-xs font-bold text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                {tool.icon}
              </span>
              <div className="min-w-0">
                <span className="font-medium text-gray-900 group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400">
                  {tool.title}
                </span>
                <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-500">
                  {tool.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* All Tools CTA */}
      <section className="mb-16 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 p-8 text-center text-white sm:p-12">
        <h2 className="mb-3 text-2xl font-bold sm:text-3xl">
          All {tools.length}+ Tools Are Client-Side
        </h2>
        <p className="mx-auto mb-6 max-w-xl text-emerald-100">
          The tools above are the most commonly used with sensitive data, but
          every tool on DevBolt runs in your browser. No exceptions.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="rounded-lg bg-white px-6 py-2.5 text-sm font-semibold text-emerald-600 shadow-sm transition-colors hover:bg-emerald-50"
          >
            Browse All {tools.length}+ Tools
          </Link>
          <Link
            href="/blog/developer-tools-privacy"
            className="rounded-lg border border-emerald-400 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-500"
          >
            Read Our Privacy Deep-Dive
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl">
        <h2 className="mb-8 text-center text-2xl font-semibold text-gray-900 dark:text-white">
          Frequently Asked Questions
        </h2>
        <div className="divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900">
          {faqs.map((faq, i) => (
            <details key={i} className="group" open={i === 0}>
              <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 text-left text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50 dark:text-white dark:hover:bg-gray-800/50 [&::-webkit-details-marker]:hidden">
                <span>{faq.question}</span>
                <svg
                  className="ml-3 h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200 group-open:rotate-180"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </summary>
              <div className="px-5 pb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
