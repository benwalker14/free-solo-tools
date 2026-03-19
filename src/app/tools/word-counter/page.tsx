import type { Metadata } from "next";
import WordCounterTool from "./WordCounterTool";

export const metadata: Metadata = {
  title: "Word & Character Counter",
  description:
    "Count words, characters, sentences, and paragraphs instantly. Estimate reading and speaking time. Free online tool — no signup required.",
  keywords: [
    "word counter",
    "character counter",
    "letter counter",
    "word count online",
    "character count online",
    "reading time calculator",
    "text statistics",
  ],
  alternates: {
    canonical: "/tools/word-counter",
  },
  openGraph: {
    title: "Word & Character Counter - DevBolt",
    description:
      "Count words, characters, sentences, paragraphs, and estimate reading time instantly.",
    url: "/tools/word-counter",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Word & Character Counter",
  url: "https://devbolt.dev/tools/word-counter",
  description:
    "Count words, characters, sentences, and paragraphs. Estimate reading and speaking time.",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  isAccessibleForFree: true,
  browserRequirements: "Any modern web browser",
  creator: { "@type": "Organization", name: "DevBolt", url: "https://devbolt.dev" },
};

export default function WordCounterPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <WordCounterTool />
    </>
  );
}
