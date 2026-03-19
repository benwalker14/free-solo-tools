import type { Metadata } from "next";
import SlugGeneratorTool from "./SlugGeneratorTool";

export const metadata: Metadata = {
  title: "URL Slug Generator",
  description:
    "Convert text into clean, URL-friendly slugs instantly. Handles Unicode transliteration, stop words removal, configurable separators, max length, and bulk mode. Free online tool — no signup required.",
  keywords: [
    "slug generator",
    "url slug generator",
    "text to slug",
    "slug converter",
    "url slug creator",
    "seo friendly url",
    "permalink generator",
    "url slugify",
    "slug maker",
    "clean url generator",
  ],
  alternates: {
    canonical: "/tools/slug-generator",
  },
  openGraph: {
    title: "URL Slug Generator - DevBolt",
    description:
      "Convert text into clean, URL-friendly slugs with Unicode support, stop words removal, and bulk mode.",
    url: "/tools/slug-generator",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "URL Slug Generator",
  url: "https://devbolt.dev/tools/slug-generator",
  description:
    "Convert text into clean, URL-friendly slugs instantly. Handles Unicode transliteration, stop words removal, configurable separators, and bulk mode.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function SlugGeneratorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SlugGeneratorTool />
    </>
  );
}
