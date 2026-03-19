import type { Metadata } from "next";
import AspectRatioCalculatorTool from "./AspectRatioCalculatorTool";

export const metadata: Metadata = {
  title: "Aspect Ratio Calculator — Resize, Scale & Convert Dimensions",
  description:
    "Calculate aspect ratios from any dimensions, resize images while preserving proportions, and find equivalent sizes for video, web, and print. Device presets for phones, tablets, and monitors. Free online tool — no signup required.",
  keywords: [
    "aspect ratio calculator",
    "aspect ratio converter",
    "image aspect ratio",
    "video aspect ratio",
    "16:9 calculator",
    "resize image ratio",
    "aspect ratio resize",
    "screen resolution ratio",
    "4:3 to 16:9",
    "css aspect-ratio",
    "responsive image size",
    "pixel dimension calculator",
  ],
  alternates: {
    canonical: "/tools/aspect-ratio-calculator",
  },
  openGraph: {
    title: "Aspect Ratio Calculator — Resize, Scale & Convert Dimensions - DevBolt",
    description:
      "Calculate aspect ratios, resize while preserving proportions, and find equivalent sizes for any screen or format.",
    url: "/tools/aspect-ratio-calculator",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Aspect Ratio Calculator",
  url: "https://devbolt.dev/tools/aspect-ratio-calculator",
  description:
    "Calculate aspect ratios from any dimensions, resize images while preserving proportions, and find equivalent sizes for video, web, and print.",
  applicationCategory: "UtilitiesApplication",
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

export default function AspectRatioCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AspectRatioCalculatorTool />
    </>
  );
}
