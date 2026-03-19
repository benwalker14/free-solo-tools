import type { Metadata } from "next";
import ColorPaletteTool from "./ColorPaletteTool";

export const metadata: Metadata = {
  title: "Color Palette Generator - Create Harmonious Color Schemes",
  description:
    "Generate beautiful color palettes using color theory. Complementary, analogous, triadic, tetradic, split-complementary, and monochromatic harmonies. Export as CSS, Tailwind, SCSS, or JSON. Free online tool — no signup required.",
  keywords: [
    "color palette generator",
    "color scheme generator",
    "color harmony",
    "complementary colors",
    "analogous colors",
    "triadic colors",
    "color theory tool",
    "CSS color palette",
    "Tailwind color palette",
  ],
  alternates: {
    canonical: "/tools/color-palette",
  },
  openGraph: {
    title: "Color Palette Generator - DevBolt",
    description:
      "Generate harmonious color palettes from any base color using color theory algorithms. Free online tool.",
    url: "/tools/color-palette",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Color Palette Generator",
  url: "https://devbolt.dev/tools/color-palette",
  description:
    "Generate beautiful, harmonious color palettes using color theory algorithms. Supports complementary, analogous, triadic, tetradic, split-complementary, and monochromatic harmonies.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  isAccessibleForFree: true,
  browserRequirements: "Any modern web browser",
  creator: { "@type": "Organization", name: "DevBolt", url: "https://devbolt.dev" },
};

export default function ColorPalettePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ColorPaletteTool />
    </>
  );
}
