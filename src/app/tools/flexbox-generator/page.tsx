import type { Metadata } from "next";
import FlexboxGeneratorTool from "./FlexboxGeneratorTool";

export const metadata: Metadata = {
  title: "CSS Flexbox Generator",
  description:
    "Build CSS flexbox layouts visually. Configure flex-direction, justify-content, align-items, flex-wrap, gap, and per-item properties. Copy production-ready CSS. Free online tool — no signup required.",
  keywords: [
    "CSS flexbox generator",
    "flexbox layout builder",
    "CSS flex generator",
    "flexbox playground",
    "CSS layout tool",
    "flex-direction",
    "justify-content",
    "align-items",
    "flexbox CSS",
  ],
  alternates: {
    canonical: "/tools/flexbox-generator",
  },
  openGraph: {
    title: "CSS Flexbox Generator - DevBolt",
    description:
      "Build CSS flexbox layouts visually. Configure container and item properties, preview live, and copy the CSS.",
    url: "/tools/flexbox-generator",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "CSS Flexbox Generator",
  url: "https://devbolt.dev/tools/flexbox-generator",
  description:
    "Build CSS flexbox layouts visually. Configure flex-direction, justify-content, align-items, flex-wrap, gap, and per-item properties. Copy production-ready CSS.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  isAccessibleForFree: true,
  browserRequirements: "Any modern web browser",
  creator: { "@type": "Organization", name: "DevBolt", url: "https://devbolt.dev" },
};

export default function FlexboxGeneratorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <FlexboxGeneratorTool />
    </>
  );
}
