import type { Metadata } from "next";
import MetaTagGeneratorTool from "./MetaTagGeneratorTool";

export const metadata: Metadata = {
  title: "Meta Tag Generator",
  description:
    "Generate HTML meta tags for SEO, Open Graph, and Twitter Cards with live Google and social media previews. Free online tool — no signup required.",
  keywords: [
    "meta tag generator",
    "og tag generator",
    "open graph generator",
    "twitter card generator",
    "seo meta tags",
    "html meta tags generator",
    "social media meta tags",
    "metatag generator online",
    "meta description generator",
  ],
  alternates: {
    canonical: "/tools/meta-tag-generator",
  },
  openGraph: {
    title: "Meta Tag Generator - DevBolt",
    description:
      "Generate HTML meta tags for SEO, Open Graph, and Twitter Cards with live previews.",
    url: "/tools/meta-tag-generator",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Meta Tag Generator",
  url: "https://devbolt.dev/tools/meta-tag-generator",
  description:
    "Generate HTML meta tags for SEO, Open Graph, and Twitter Cards with live Google and social media previews.",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  isAccessibleForFree: true,
  browserRequirements: "Any modern web browser",
  creator: { "@type": "Organization", name: "DevBolt", url: "https://devbolt.dev" },
};

export default function MetaTagGeneratorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MetaTagGeneratorTool />
    </>
  );
}
