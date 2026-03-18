import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "FreeSolo Tools is a free suite of online developer utilities — built and managed autonomously by AI agents. No signup, no clutter, just tools.",
  openGraph: {
    title: "About | FreeSolo Tools",
    description:
      "A free developer toolkit built and maintained by autonomous AI agents.",
    url: "https://free-solo-tools.vercel.app/about",
  },
};

const tools = [
  { name: "JSON Formatter", href: "/tools/json-formatter" },
  { name: "Base64 Codec", href: "/tools/base64" },
  { name: "Hash Generator", href: "/tools/hash-generator" },
  { name: "UUID Generator", href: "/tools/uuid-generator" },
  { name: "Color Converter", href: "/tools/color-converter" },
  { name: "JWT Decoder", href: "/tools/jwt-decoder" },
  { name: "Regex Tester", href: "/tools/regex-tester" },
  { name: "URL Parser", href: "/tools/url-parser" },
  { name: "Markdown Preview", href: "/tools/markdown-preview" },
  { name: "Diff Checker", href: "/tools/diff-checker" },
  { name: "Epoch Converter", href: "/tools/epoch-converter" },
  { name: "Password Generator", href: "/tools/password-generator" },
  { name: "Lorem Ipsum Generator", href: "/tools/lorem-ipsum" },
  { name: "Case Converter", href: "/tools/case-converter" },
  { name: "Number Base Converter", href: "/tools/number-base-converter" },
  { name: "CSV ↔ JSON Converter", href: "/tools/csv-json" },
  { name: "Cron Expression Parser", href: "/tools/cron-parser" },
  { name: "Word & Character Counter", href: "/tools/word-counter" },
  { name: "URL Encoder & Decoder", href: "/tools/url-encoder" },
  { name: "JSON ↔ YAML Converter", href: "/tools/json-yaml" },
  { name: "Chmod Calculator", href: "/tools/chmod-calculator" },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-3xl">
        {/* Hero */}
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          About FreeSolo Tools
        </h1>
        <p className="mb-12 text-lg text-gray-600 dark:text-gray-400">
          Fast, free, and private developer utilities — no signup, no clutter.
        </p>

        {/* What we do */}
        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
            What is FreeSolo Tools?
          </h2>
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            FreeSolo Tools is a collection of free online utilities built for
            developers and power users. Every tool runs entirely in your browser
            — your data never leaves your device. No accounts, no tracking, no
            dark patterns. Just open a tool and use it.
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            Need more? A{" "}
            <Link
              href="/pricing"
              className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              Pro subscription
            </Link>{" "}
            unlocks unlimited daily usage, removes ads, and adds features like
            batch processing and API access.
          </p>
        </section>

        {/* The experiment */}
        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
            Built by AI, for Real Use
          </h2>
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            FreeSolo Tools is an experiment in autonomous software. The site is
            designed, coded, deployed, and maintained by a team of AI agents
            running on a schedule — each with a specific role:
          </p>
          <ul className="mb-4 space-y-2 text-gray-600 dark:text-gray-400">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
              <span>
                <strong className="text-gray-900 dark:text-white">
                  Developer
                </strong>{" "}
                — builds features, fixes bugs, and improves code quality
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
              <span>
                <strong className="text-gray-900 dark:text-white">
                  Strategist
                </strong>{" "}
                — researches which tools to build next and plans the roadmap
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
              <span>
                <strong className="text-gray-900 dark:text-white">
                  Health Monitor
                </strong>{" "}
                — checks that the app builds, lints, and deploys correctly
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
              <span>
                <strong className="text-gray-900 dark:text-white">
                  Reporter
                </strong>{" "}
                — summarizes agent activity for the human owner
              </span>
            </li>
          </ul>
          <p className="text-gray-600 dark:text-gray-400">
            A human (Vincent) provides the infrastructure and keeps the lights
            on, but the product decisions — what to build, how to build it, and
            when to ship — are made by the agents. The source code is public on{" "}
            <a
              href="https://github.com/benwalker14/free-solo-tools"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              GitHub
            </a>
            .
          </p>
        </section>

        {/* Tools */}
        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
            Available Tools
          </h2>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {tools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:border-indigo-300 hover:text-indigo-600 dark:border-gray-800 dark:text-gray-300 dark:hover:border-indigo-700 dark:hover:text-indigo-400"
              >
                {tool.name}
              </Link>
            ))}
          </div>
        </section>

        {/* Privacy */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
            Privacy First
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            All tools process data locally in your browser using the Web Crypto
            API and standard JavaScript. We use{" "}
            <a
              href="https://vercel.com/analytics"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              Vercel Analytics
            </a>{" "}
            for privacy-friendly, cookieless page-view metrics — nothing else.
            Read our{" "}
            <Link
              href="/privacy"
              className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              Privacy Policy
            </Link>{" "}
            for full details.
          </p>
        </section>
      </div>
    </div>
  );
}
