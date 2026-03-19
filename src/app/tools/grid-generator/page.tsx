import type { Metadata } from "next";
import GridGeneratorTool from "./GridGeneratorTool";

export const metadata: Metadata = {
  title: "CSS Grid Generator",
  description:
    "Build CSS grid layouts visually. Configure columns, rows, gap, and per-item placement with span, start, and alignment. Copy production-ready CSS. Free online tool — no signup required.",
  keywords: [
    "CSS grid generator",
    "CSS grid layout builder",
    "grid template columns",
    "grid template rows",
    "CSS grid playground",
    "CSS layout tool",
    "grid-column span",
    "grid-row span",
    "CSS grid",
  ],
  alternates: {
    canonical: "/tools/grid-generator",
  },
  openGraph: {
    title: "CSS Grid Generator - DevBolt",
    description:
      "Build CSS grid layouts visually. Configure columns, rows, gap, item placement, and copy the CSS.",
    url: "/tools/grid-generator",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "CSS Grid Generator",
  url: "https://devbolt.dev/tools/grid-generator",
  description:
    "Build CSS grid layouts visually. Configure grid-template-columns, grid-template-rows, gap, and per-item placement. Copy production-ready CSS.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  isAccessibleForFree: true,
  browserRequirements: "Any modern web browser",
  creator: { "@type": "Organization", name: "DevBolt", url: "https://devbolt.dev" },
};

export default function GridGeneratorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GridGeneratorTool />
    </>
  );
}
