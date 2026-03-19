import type { Metadata } from "next";
import HtmlTableGeneratorTool from "./HtmlTableGeneratorTool";

export const metadata: Metadata = {
  title: "HTML Table Generator — Build Tables Visually",
  description:
    "Build HTML tables visually with an interactive editor. Add rows, columns, header rows, and styling. Export as plain HTML, inline CSS, or Tailwind. Free online tool — no signup required.",
  keywords: [
    "html table generator",
    "html table creator",
    "html table builder",
    "html table maker",
    "create html table online",
    "html table code generator",
    "html table with css",
    "responsive html table",
    "html table template",
    "csv to html table",
  ],
  alternates: {
    canonical: "/tools/html-table-generator",
  },
  openGraph: {
    title: "HTML Table Generator — Build Tables Visually - DevBolt",
    description:
      "Build HTML tables visually with an interactive editor. Export as plain HTML, inline CSS, or Tailwind classes.",
    url: "/tools/html-table-generator",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "HTML Table Generator",
  url: "https://devbolt.dev/tools/html-table-generator",
  description:
    "Build HTML tables visually with an interactive editor. Add rows, columns, header rows, and styling. Export as plain HTML, inline CSS, or Tailwind classes.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  isAccessibleForFree: true,
  browserRequirements: "Any modern web browser",
  creator: {
    "@type": "Organization",
    name: "DevBolt",
    url: "https://devbolt.dev",
  },
};

export default function HtmlTableGeneratorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HtmlTableGeneratorTool />
    </>
  );
}
