import type { Metadata } from "next";
import MarkdownTableTool from "./MarkdownTableTool";

export const metadata: Metadata = {
  title: "Markdown Table Generator",
  description:
    "Build Markdown tables visually with an interactive editor. Add rows and columns, set alignment, import CSV data, and copy clean Markdown. Free online tool — no signup required.",
  keywords: [
    "markdown table generator",
    "markdown table creator",
    "markdown table editor",
    "markdown table builder",
    "csv to markdown table",
    "github markdown table",
    "markdown table syntax",
    "markdown table formatter",
    "online markdown table",
  ],
  alternates: {
    canonical: "/tools/markdown-table",
  },
  openGraph: {
    title: "Markdown Table Generator - DevBolt",
    description:
      "Build Markdown tables visually with an interactive editor. Import CSV, set alignment, and copy clean Markdown.",
    url: "/tools/markdown-table",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Markdown Table Generator",
  url: "https://devbolt.dev/tools/markdown-table",
  description:
    "Build Markdown tables visually with an interactive editor. Add rows and columns, set alignment, import CSV data, and copy clean Markdown.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function MarkdownTablePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MarkdownTableTool />
    </>
  );
}
