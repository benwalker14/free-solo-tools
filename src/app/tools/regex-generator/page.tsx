import type { Metadata } from "next";
import RegexGeneratorTool from "./RegexGeneratorTool";

export const metadata: Metadata = {
  title: "Regex Generator",
  description:
    "Generate regular expressions by describing what you need in plain English. Browse 60+ curated patterns, compose regex with building blocks, and test live with match highlighting. Free, runs in your browser.",
  keywords: [
    "regex generator",
    "regular expression generator",
    "regex builder",
    "regex creator",
    "regex pattern generator",
    "regex from english",
    "regex examples",
    "regex patterns",
    "regex library",
    "regex composer",
    "regex helper",
    "regex tool",
  ],
  alternates: {
    canonical: "/tools/regex-generator",
  },
  openGraph: {
    title: "Regex Generator - DevBolt",
    description:
      "Generate regular expressions by describing what you need. 60+ curated patterns, visual composer, and live testing.",
    url: "/tools/regex-generator",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Regex Generator",
  url: "https://devbolt.dev/tools/regex-generator",
  description:
    "Generate regular expressions by describing what you need in plain English. Browse 60+ curated patterns, compose regex with building blocks, and test live with match highlighting. Free, runs entirely in your browser.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function RegexGeneratorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <RegexGeneratorTool />
    </>
  );
}
