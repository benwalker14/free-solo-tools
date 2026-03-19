import type { Metadata } from "next";
import ColorConverterTool from "./ColorConverterTool";

export const metadata: Metadata = {
  title: "Color Converter (HEX, RGB, HSL)",
  description:
    "Convert colors between HEX, RGB, and HSL formats instantly. Live color preview included. Free online color converter — no signup required.",
  keywords: [
    "color converter",
    "HEX to RGB",
    "RGB to HSL",
    "color picker online",
    "HEX to HSL",
  ],
  alternates: {
    canonical: "/tools/color-converter",
  },
  openGraph: {
    title: "Color Converter (HEX, RGB, HSL) - DevBolt",
    description:
      "Convert colors between HEX, RGB, and HSL formats. Free online tool.",
    url: "/tools/color-converter",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Color Converter (HEX, RGB, HSL)",
  url: "https://devbolt.dev/tools/color-converter",
  description:
    "Convert colors between HEX, RGB, and HSL formats instantly. Live color preview included.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  isAccessibleForFree: true,
  browserRequirements: "Any modern web browser",
  creator: { "@type": "Organization", name: "DevBolt", url: "https://devbolt.dev" },
};

export default function ColorConverterPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ColorConverterTool />
    </>
  );
}
