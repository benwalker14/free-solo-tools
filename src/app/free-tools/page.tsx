import type { Metadata } from "next";
import Link from "next/link";
import { tools, TOOL_CATEGORIES } from "@/data/tools";

const BASE_URL = "https://devbolt.dev";

export const metadata: Metadata = {
  title: "Free Developer Tools Online — 90+ Browser-Based Utilities",
  description:
    "90+ free online developer tools that run entirely in your browser. JSON formatter, Base64 encoder, hash generator, UUID generator, regex tester, and more. No signup, no tracking, 100% client-side.",
  keywords: [
    "free developer tools",
    "free online developer tools",
    "free dev tools",
    "developer utilities",
    "online dev tools",
    "web developer tools free",
    "free coding tools",
    "browser developer tools",
    "client-side developer tools",
    "no signup developer tools",
    "json formatter free",
    "base64 encoder free",
    "hash generator free",
    "uuid generator free",
    "regex tester free",
  ],
  openGraph: {
    title: "Free Developer Tools Online — 90+ Browser-Based Utilities",
    description:
      "90+ free online developer tools. No signup, no tracking. JSON formatter, Base64, hash generator, UUID, regex tester, and more. 100% client-side.",
    url: `${BASE_URL}/free-tools`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Developer Tools Online — 90+ Browser-Based Utilities",
    description:
      "90+ free online developer tools. No signup, no tracking. 100% client-side.",
  },
  alternates: {
    canonical: `${BASE_URL}/free-tools`,
  },
};

const categoryDescriptions: Record<string, { tagline: string; intro: string }> =
  {
    Format: {
      tagline: "Clean up messy code in one click",
      intro:
        "Paste unformatted JSON, SQL, XML, YAML, or minified code and get perfectly indented, syntax-validated output instantly.",
    },
    Convert: {
      tagline: "Transform data between any format",
      intro:
        "Base64, hex, binary, CSV, JSON, YAML, TOML, Markdown, TypeScript types — convert between formats without installing anything.",
    },
    Generate: {
      tagline: "Create what you need, fast",
      intro:
        "UUIDs, passwords, hashes, QR codes, placeholder images, CSS effects, meta tags, config files, and more — generated entirely in your browser.",
    },
    Inspect: {
      tagline: "Decode, validate, and debug",
      intro:
        "JWT tokens, regex patterns, URLs, Dockerfiles, Kubernetes manifests, OpenAPI specs — inspect and validate without leaving your browser.",
    },
  };

const faqs = [
  {
    question: "Are these developer tools really free?",
    answer:
      "Yes, every tool on DevBolt is 100% free to use with no signup required. Power users can upgrade to Pro for higher daily limits, API access, and batch processing, but the core tools are free forever.",
  },
  {
    question: "Is my data safe when using these tools?",
    answer:
      "Absolutely. Every tool runs entirely in your browser using client-side JavaScript. Your data never leaves your device — nothing is sent to our servers. We use zero tracking cookies and only collect anonymous, cookieless page-view analytics via Vercel Analytics.",
  },
  {
    question: "Do I need to create an account?",
    answer:
      "No. All tools work immediately — no accounts, no email verification, no popups. Just open a tool and use it.",
  },
  {
    question: "Can I use these tools offline?",
    answer:
      "Yes. DevBolt is a Progressive Web App (PWA). Install it from your browser and use tools offline — all processing happens locally.",
  },
  {
    question: "What makes DevBolt different from other developer tool sites?",
    answer:
      "Three things: privacy (100% client-side, zero cookies), speed (no server round-trips, instant results), and focus (clean UI, no clutter, no dark patterns). Most competitor sites use 500+ tracking cookies and send your data to their servers. We don't.",
  },
  {
    question: "How many tools does DevBolt have?",
    answer: `DevBolt currently offers ${tools.length}+ free tools across four categories: Format, Convert, Generate, and Inspect. New tools are added regularly based on developer demand and search trends.`,
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
  name: "Free Developer Tools Online",
  description:
    "90+ free online developer tools that run entirely in your browser. No signup, no tracking, 100% client-side.",
  url: `${BASE_URL}/free-tools`,
  isPartOf: {
    "@type": "WebSite",
    name: "DevBolt",
    url: BASE_URL,
  },
};

export default function FreeToolsPage() {
  const toolsByCategory = TOOL_CATEGORIES.map((cat) => ({
    category: cat,
    tools: tools.filter((t) => t.category === cat),
  }));

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
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          Free Developer Tools Online
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
          {tools.length}+ browser-based utilities for developers. No signup, no
          tracking cookies, no server uploads.{" "}
          <strong className="text-gray-900 dark:text-white">
            Your data never leaves your browser.
          </strong>
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 font-medium text-green-700 dark:bg-green-950 dark:text-green-400">
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
            100% Free
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-400">
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
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            Zero Tracking
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1 font-medium text-purple-700 dark:bg-purple-950 dark:text-purple-400">
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
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            Client-Side Only
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 font-medium text-amber-700 dark:bg-amber-950 dark:text-amber-400">
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
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            No Signup Required
          </span>
        </div>
      </div>

      {/* Why DevBolt */}
      <section className="mb-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
            Why Developers Choose DevBolt
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Most online developer tool sites use hundreds of tracking cookies,
            send your data to remote servers, and bury tools behind signup walls.
            DevBolt is different. Every tool runs entirely in your browser —
            nothing is uploaded, nothing is tracked, nothing is stored. You get
            instant results with complete privacy, every time.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-gray-200 p-6 dark:border-gray-800">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
              Privacy by Default
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Zero tracking cookies. Zero data collection. All processing
              happens in your browser using the Web Crypto API and standard
              JavaScript. Your secrets, tokens, and code never leave your
              device.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 p-6 dark:border-gray-800">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
              Instant Results
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              No server round-trips, no loading spinners, no waiting. Paste your
              input and get results immediately. Works offline too — install the
              PWA for full offline access.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 p-6 dark:border-gray-800 sm:col-span-2 lg:col-span-1">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                />
              </svg>
            </div>
            <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
              Clean & Focused
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              No popups, no dark patterns, no clutter. Every tool has a clean
              interface designed for speed. Keyboard shortcuts (Ctrl+Enter),
              one-click copy, and responsive design across all devices.
            </p>
          </div>
        </div>
      </section>

      {/* Tools by Category */}
      {toolsByCategory.map(({ category, tools: categoryTools }) => {
        const desc = categoryDescriptions[category];
        return (
          <section key={category} className="mb-14">
            <div className="mb-6">
              <h2 className="mb-1 text-2xl font-semibold text-gray-900 dark:text-white">
                {category} Tools
                <span className="ml-2 text-base font-normal text-gray-500 dark:text-gray-500">
                  ({categoryTools.length})
                </span>
              </h2>
              {desc && (
                <>
                  <p className="mb-1 text-sm font-medium text-indigo-600 dark:text-indigo-400">
                    {desc.tagline}
                  </p>
                  <p className="max-w-3xl text-sm text-gray-600 dark:text-gray-400">
                    {desc.intro}
                  </p>
                </>
              )}
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {categoryTools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="group flex items-start gap-3 rounded-lg border border-gray-200 p-4 transition-colors hover:border-indigo-300 hover:bg-indigo-50/50 dark:border-gray-800 dark:hover:border-indigo-700 dark:hover:bg-indigo-950/30"
                >
                  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-gray-100 font-mono text-xs font-bold text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                    {tool.icon}
                  </span>
                  <div className="min-w-0">
                    <span className="font-medium text-gray-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
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
        );
      })}

      {/* CTA */}
      <section className="mb-16 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 p-8 text-center text-white sm:p-12">
        <h2 className="mb-3 text-2xl font-bold sm:text-3xl">
          Ready to Try?
        </h2>
        <p className="mx-auto mb-6 max-w-xl text-indigo-100">
          Pick any tool above and start using it immediately. No signup, no
          credit card, no time limit. Every tool is free and runs in your
          browser.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="rounded-lg bg-white px-6 py-2.5 text-sm font-semibold text-indigo-600 shadow-sm transition-colors hover:bg-indigo-50"
          >
            Browse All Tools
          </Link>
          <Link
            href="/pricing"
            className="rounded-lg border border-indigo-400 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
          >
            View Pro Features
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl">
        <h2 className="mb-8 text-center text-2xl font-semibold text-gray-900 dark:text-white">
          Frequently Asked Questions
        </h2>
        <div className="divide-y divide-gray-200 dark:divide-gray-800">
          {faqs.map((faq) => (
            <div key={faq.question} className="py-5">
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                {faq.question}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
