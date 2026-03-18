import type { Metadata } from "next";
import TextShadowTool from "./TextShadowTool";

export const metadata: Metadata = {
  title: "CSS Text Shadow Generator",
  description:
    "Create beautiful CSS text shadows visually. Add multiple layers, adjust offsets, blur, color, and opacity. Copy production-ready CSS. Free online tool — no signup required.",
  keywords: [
    "CSS text shadow generator",
    "text shadow CSS",
    "CSS text shadow tool",
    "text shadow maker",
    "CSS text effects",
    "text glow CSS",
    "neon text effect",
    "3D text shadow",
    "CSS typography effects",
  ],
  alternates: {
    canonical: "/tools/text-shadow",
  },
  openGraph: {
    title: "CSS Text Shadow Generator - DevBolt",
    description:
      "Design beautiful CSS text shadows visually. Multiple layers, presets, and copy-ready CSS.",
    url: "/tools/text-shadow",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "CSS Text Shadow Generator",
  url: "https://devbolt.dev/tools/text-shadow",
  description:
    "Create beautiful CSS text shadows visually. Add multiple layers, adjust offsets, blur, color, and opacity. Copy production-ready CSS.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function TextShadowPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TextShadowTool />
    </>
  );
}
