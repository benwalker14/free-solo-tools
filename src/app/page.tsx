import type { Metadata } from "next";
import ToolGrid from "@/components/ToolGrid";
import { tools } from "@/data/tools";

const BASE_URL = "https://devbolt.dev";

export const metadata: Metadata = {
  title: `${tools.length}+ Free Developer Tools — Zero Tracking | DevBolt`,
  description: `${tools.length}+ free online developer tools that run entirely in your browser. JSON formatter, Base64 encoder, hash generator, regex tester, and more. No signup, no tracking, 100% client-side.`,
  openGraph: {
    title: `${tools.length}+ Free Developer Tools — Zero Tracking`,
    description: `Fast, free, and 100% client-side developer tools. Your data never leaves your browser. No signup, no cookies, just tools.`,
    url: BASE_URL,
  },
  twitter: {
    title: `${tools.length}+ Free Developer Tools — Zero Tracking`,
    description: `Fast, free, and 100% client-side developer tools. Your data never leaves your browser.`,
  },
  alternates: {
    canonical: BASE_URL,
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "DevBolt",
  url: BASE_URL,
  description:
    "Fast, clean, free online tools for developers. No signup required.",
  potentialAction: {
    "@type": "SearchAction",
    target: `${BASE_URL}/?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

const itemListJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Free Online Developer Tools",
  numberOfItems: tools.length,
  itemListElement: tools.map((tool, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: tool.title,
    url: `${BASE_URL}${tool.href}`,
  })),
};

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <div className="mb-16 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          {tools.length}+ Developer Tools.{" "}
          <span className="text-indigo-600 dark:text-indigo-400">
            Zero Tracking.
          </span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
          Fast, free, and 100% client-side. Your data never leaves your
          browser. No signup, no cookies, just&nbsp;tools.
        </p>
      </div>
      <ToolGrid tools={tools} />
    </div>
  );
}
