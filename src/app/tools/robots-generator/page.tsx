import type { Metadata } from "next";
import RobotsGeneratorTool from "./RobotsGeneratorTool";

export const metadata: Metadata = {
  title: "robots.txt Generator",
  description:
    "Generate robots.txt files for your website. Configure crawl rules for Googlebot, Bingbot, and other search engine bots. Set allowed/disallowed paths, crawl delay, and sitemaps. Free online tool — no signup required.",
  keywords: [
    "robots.txt generator",
    "robots.txt creator",
    "robots txt file",
    "robots.txt builder",
    "robots.txt tester",
    "crawl rules generator",
    "search engine crawler",
    "googlebot rules",
    "seo robots txt",
    "website crawl control",
  ],
  alternates: {
    canonical: "/tools/robots-generator",
  },
  openGraph: {
    title: "robots.txt Generator - DevBolt",
    description:
      "Generate robots.txt files with crawl rules for search engine bots. Free online tool.",
    url: "/tools/robots-generator",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "robots.txt Generator",
  url: "https://devbolt.dev/tools/robots-generator",
  description:
    "Generate robots.txt files for your website. Configure crawl rules for Googlebot, Bingbot, and other search engine bots. Set allowed/disallowed paths, crawl delay, and sitemaps.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function RobotsGeneratorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <RobotsGeneratorTool />
    </>
  );
}
