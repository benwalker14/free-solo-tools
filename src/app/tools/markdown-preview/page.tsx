import type { Metadata } from "next";
import MarkdownPreviewTool from "./MarkdownPreviewTool";

export const metadata: Metadata = {
  title: "Markdown Preview",
  description:
    "Write and preview Markdown in real time. Supports headings, lists, code blocks, tables, links, and more. Free online Markdown editor — no signup required.",
  keywords: [
    "Markdown preview",
    "Markdown editor",
    "Markdown to HTML",
    "Markdown renderer",
    "online Markdown editor",
  ],
  alternates: {
    canonical: "/tools/markdown-preview",
  },
  openGraph: {
    title: "Markdown Preview - DevBolt",
    description:
      "Write and preview Markdown in real time. Free online tool.",
    url: "/tools/markdown-preview",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Markdown Preview",
  url: "https://devbolt.dev/tools/markdown-preview",
  description:
    "Write and preview Markdown in real time. Supports headings, lists, code blocks, tables, links, and more.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  isAccessibleForFree: true,
  browserRequirements: "Any modern web browser",
  creator: { "@type": "Organization", name: "DevBolt", url: "https://devbolt.dev" },
};

export default function MarkdownPreviewPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MarkdownPreviewTool />
    </>
  );
}
