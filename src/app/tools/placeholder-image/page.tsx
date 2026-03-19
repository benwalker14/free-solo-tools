import type { Metadata } from "next";
import PlaceholderImageTool from "./PlaceholderImageTool";

export const metadata: Metadata = {
  title: "Placeholder Image Generator",
  description:
    "Generate custom placeholder images for wireframes, mockups, and prototyping. Choose dimensions, colors, text, and download as PNG, JPEG, WebP, or SVG. Free online tool — no signup required.",
  keywords: [
    "placeholder image generator",
    "placeholder image",
    "dummy image generator",
    "placeholder png",
    "wireframe image",
    "mockup placeholder",
    "test image generator",
    "placeholder svg",
    "image placeholder tool",
    "custom placeholder image",
  ],
  alternates: {
    canonical: "/tools/placeholder-image",
  },
  openGraph: {
    title: "Placeholder Image Generator - DevBolt",
    description:
      "Generate custom placeholder images for wireframes and prototyping. Download as PNG, JPEG, WebP, or SVG.",
    url: "/tools/placeholder-image",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Placeholder Image Generator",
  url: "https://devbolt.dev/tools/placeholder-image",
  description:
    "Generate custom placeholder images for wireframes, mockups, and prototyping. Choose dimensions, colors, text, and download as PNG, JPEG, WebP, or SVG.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function PlaceholderImagePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PlaceholderImageTool />
    </>
  );
}
