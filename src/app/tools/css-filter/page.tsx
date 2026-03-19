import type { Metadata } from "next";
import CssFilterTool from "./CssFilterTool";

export const metadata: Metadata = {
  title: "CSS Filter Generator",
  description:
    "Build CSS filter effects visually — blur, brightness, contrast, grayscale, hue-rotate, invert, opacity, saturate, sepia, and drop-shadow. Live preview with 12 presets. Free online tool.",
  keywords: [
    "CSS filter generator",
    "CSS filter effects",
    "CSS blur generator",
    "CSS grayscale",
    "CSS brightness contrast",
    "CSS hue rotate",
    "CSS sepia filter",
    "CSS drop shadow",
    "CSS image filter",
    "CSS filter tool online",
  ],
  alternates: {
    canonical: "/tools/css-filter",
  },
  openGraph: {
    title: "CSS Filter Generator - DevBolt",
    description:
      "Build CSS filter effects visually with sliders for blur, brightness, contrast, grayscale, and more. 12 presets, live preview, copy production-ready CSS.",
    url: "/tools/css-filter",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "CSS Filter Generator",
  url: "https://devbolt.dev/tools/css-filter",
  description:
    "Build CSS filter effects visually — blur, brightness, contrast, grayscale, hue-rotate, invert, opacity, saturate, sepia, and drop-shadow with live preview and presets.",
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

export default function CssFilterPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CssFilterTool />
    </>
  );
}
