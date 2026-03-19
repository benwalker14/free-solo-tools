import type { Metadata } from "next";
import Link from "next/link";

const BASE_URL = "https://devbolt.dev";

export const metadata: Metadata = {
  title: "Developer Cheat Sheets — Interactive Quick References",
  description:
    "Interactive cheat sheets for Regex, Git, and Docker with search, click-to-test, and direct links to DevBolt tools. All client-side, no signup required.",
  keywords: [
    "regex cheat sheet",
    "git cheat sheet",
    "docker cheat sheet",
    "developer cheat sheets",
    "regex reference",
    "git commands",
    "docker commands",
    "interactive cheat sheet",
  ],
  openGraph: {
    title: "Developer Cheat Sheets — Interactive Quick References | DevBolt",
    description:
      "Interactive cheat sheets for Regex, Git, and Docker. Search, filter, and click to test patterns and commands directly in DevBolt tools.",
    url: `${BASE_URL}/cheatsheets`,
    type: "website",
  },
  alternates: {
    canonical: `${BASE_URL}/cheatsheets`,
  },
};

const cheatsheets = [
  {
    slug: "regex",
    title: "Regex Cheat Sheet",
    description:
      "Complete regular expression reference with metacharacters, quantifiers, lookaround, flags, and 20+ common patterns. Click any pattern to test it instantly.",
    searches: "~200K/mo searches",
    tools: ["Regex Tester", "Regex Generator"],
    icon: ".*",
    color: "indigo",
  },
  {
    slug: "git",
    title: "Git Cheat Sheet",
    description:
      "Every Git command you need — from basics to advanced rebasing, stashing, and recovery. Click any command to build it visually.",
    searches: "~200K/mo searches",
    tools: ["Git Command Builder", "Git Diff Viewer"],
    icon: "git",
    color: "orange",
  },
  {
    slug: "docker",
    title: "Docker Cheat Sheet",
    description:
      "Docker CLI reference covering images, containers, networks, volumes, Compose, and Dockerfile instructions. Click to validate your configs.",
    searches: "~75K/mo searches",
    tools: ["Docker Compose Validator", "Dockerfile Validator"],
    icon: "🐳",
    color: "sky",
  },
];

const colorMap: Record<string, { bg: string; border: string; text: string; badge: string }> = {
  indigo: {
    bg: "bg-indigo-50 dark:bg-indigo-950/30",
    border: "border-indigo-200 dark:border-indigo-800",
    text: "text-indigo-600 dark:text-indigo-400",
    badge: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300",
  },
  orange: {
    bg: "bg-orange-50 dark:bg-orange-950/30",
    border: "border-orange-200 dark:border-orange-800",
    text: "text-orange-600 dark:text-orange-400",
    badge: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  },
  sky: {
    bg: "bg-sky-50 dark:bg-sky-950/30",
    border: "border-sky-200 dark:border-sky-800",
    text: "text-sky-600 dark:text-sky-400",
    badge: "bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300",
  },
};

export default function CheatsheetsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Developer Cheat Sheets",
    description:
      "Interactive cheat sheets for Regex, Git, and Docker with search and click-to-test features.",
    url: `${BASE_URL}/cheatsheets`,
    publisher: {
      "@type": "Organization",
      name: "DevBolt",
      url: BASE_URL,
    },
    hasPart: cheatsheets.map((cs) => ({
      "@type": "WebPage",
      name: cs.title,
      url: `${BASE_URL}/cheatsheets/${cs.slug}`,
    })),
  };

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Developer Cheat Sheets",
    description:
      "Interactive quick references for Regex, Git, and Docker with search and click-to-test features.",
    url: `${BASE_URL}/cheatsheets`,
    numberOfItems: cheatsheets.length,
    itemListElement: cheatsheets.map((cs, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: cs.title,
      url: `${BASE_URL}/cheatsheets/${cs.slug}`,
    })),
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          Cheat Sheets
        </h1>
        <p className="mb-12 text-lg text-gray-600 dark:text-gray-400">
          Interactive quick references with search, filtering, and click-to-test
          integration. Everything runs in your browser.
        </p>

        <div className="space-y-6">
          {cheatsheets.map((cs) => {
            const colors = colorMap[cs.color];
            return (
              <Link
                key={cs.slug}
                href={`/cheatsheets/${cs.slug}`}
                className={`group block rounded-xl border ${colors.border} ${colors.bg} p-6 transition-all hover:shadow-lg`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-white text-xl font-bold ${colors.text} shadow-sm dark:bg-gray-900`}
                  >
                    {cs.icon === "git" ? (
                      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor">
                        <path d="M23.546 10.93L13.067.452a1.55 1.55 0 00-2.188 0L8.708 2.627l2.76 2.76a1.838 1.838 0 012.327 2.341l2.66 2.66a1.838 1.838 0 011.9 3.039 1.837 1.837 0 01-2.6 0 1.846 1.846 0 01-.404-2.02l-2.48-2.48v6.53a1.84 1.84 0 01.5.26 1.838 1.838 0 010 2.6 1.838 1.838 0 01-2.6 0 1.838 1.838 0 010-2.6c.18-.18.39-.31.62-.39v-6.59a1.84 1.84 0 01-.62-.39 1.846 1.846 0 01-.404-2.02L8.2 4.57l-6.18 6.18a1.55 1.55 0 000 2.19l10.48 10.48a1.55 1.55 0 002.186 0l10.44-10.44a1.55 1.55 0 00.42-1.05z" />
                      </svg>
                    ) : (
                      <span>{cs.icon}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-3">
                      <h2 className="text-xl font-semibold text-gray-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                        {cs.title}
                      </h2>
                      <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                        {cs.searches}
                      </span>
                    </div>
                    <p className="mb-3 text-gray-600 dark:text-gray-400">
                      {cs.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {cs.tools.map((tool) => (
                        <span
                          key={tool}
                          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${colors.badge}`}
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
    </div>
  );
}
