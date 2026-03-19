import type { Metadata } from "next";
import BoxShadowTool from "./BoxShadowTool";

export const metadata: Metadata = {
  title: "CSS Box Shadow Generator",
  description:
    "Create beautiful CSS box shadows visually. Add multiple layers, adjust offsets, blur, spread, color, and opacity. Copy production-ready CSS. Free online tool — no signup required.",
  keywords: [
    "CSS box shadow generator",
    "box shadow CSS",
    "CSS shadow generator",
    "box shadow maker",
    "CSS shadow tool",
    "drop shadow CSS",
    "multiple box shadows",
    "inset shadow",
    "CSS shadow effects",
  ],
  alternates: {
    canonical: "/tools/box-shadow",
  },
  openGraph: {
    title: "CSS Box Shadow Generator - DevBolt",
    description:
      "Design beautiful CSS box shadows visually. Multiple layers, presets, and copy-ready CSS.",
    url: "/tools/box-shadow",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "CSS Box Shadow Generator",
  url: "https://devbolt.dev/tools/box-shadow",
  description:
    "Create beautiful CSS box shadows visually. Add multiple layers, adjust offsets, blur, spread, color, and opacity. Copy production-ready CSS.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  isAccessibleForFree: true,
  browserRequirements: "Any modern web browser",
  creator: { "@type": "Organization", name: "DevBolt", url: "https://devbolt.dev" },
};

export default function BoxShadowPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BoxShadowTool />
    </>
  );
}
