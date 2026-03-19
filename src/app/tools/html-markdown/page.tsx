import type { Metadata } from "next";
import HtmlMarkdownTool from "./HtmlMarkdownTool";

export const metadata: Metadata = {
  title: "HTML ↔ Markdown Converter",
  description:
    "Convert between HTML and Markdown in either direction. Handles headings, lists, code blocks, tables, links, and images. Free online tool — no signup required.",
  keywords: [
    "html to markdown",
    "markdown to html",
    "html markdown converter",
    "convert html to md",
    "convert markdown to html",
    "html to md",
    "markdown converter",
    "turndown",
    "online markdown tool",
  ],
  alternates: {
    canonical: "/tools/html-markdown",
  },
  openGraph: {
    title: "HTML ↔ Markdown Converter - DevBolt",
    description:
      "Convert between HTML and Markdown in either direction. Free online tool.",
    url: "/tools/html-markdown",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "HTML ↔ Markdown Converter",
  url: "https://devbolt.dev/tools/html-markdown",
  description:
    "Convert between HTML and Markdown in either direction. Handles headings, lists, code blocks, tables, links, and images.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  isAccessibleForFree: true,
  browserRequirements: "Any modern web browser",
  creator: { "@type": "Organization", name: "DevBolt", url: "https://devbolt.dev" },
};

export default function HtmlMarkdownPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HtmlMarkdownTool />
    </>
  );
}
