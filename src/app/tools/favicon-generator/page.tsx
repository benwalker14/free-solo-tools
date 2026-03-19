import type { Metadata } from "next";
import FaviconGeneratorTool from "./FaviconGeneratorTool";

export const metadata: Metadata = {
  title: "Favicon Generator",
  description:
    "Generate favicons from text or emoji instantly. Download PNGs in all standard sizes (16×16 to 512×512), SVG, Apple Touch Icon, plus HTML link tags and web manifest. Free online tool — no signup required.",
  keywords: [
    "favicon generator",
    "favicon creator",
    "favicon maker",
    "generate favicon",
    "emoji favicon",
    "text favicon",
    "favicon png",
    "favicon svg",
    "apple touch icon generator",
    "web app icon generator",
  ],
  alternates: {
    canonical: "/tools/favicon-generator",
  },
  openGraph: {
    title: "Favicon Generator - DevBolt",
    description:
      "Generate favicons from text or emoji. Download PNGs, SVG, and get HTML tags instantly.",
    url: "/tools/favicon-generator",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Favicon Generator",
  url: "https://devbolt.dev/tools/favicon-generator",
  description:
    "Generate favicons from text or emoji instantly. Download PNGs in all standard sizes, SVG, Apple Touch Icon, plus HTML link tags and web manifest.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  isAccessibleForFree: true,
  browserRequirements: "Any modern web browser",
  creator: { "@type": "Organization", name: "DevBolt", url: "https://devbolt.dev" },
};

export default function FaviconGeneratorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <FaviconGeneratorTool />
    </>
  );
}
