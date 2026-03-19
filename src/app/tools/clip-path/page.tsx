import type { Metadata } from "next";
import ClipPathTool from "./ClipPathTool";

export const metadata: Metadata = {
  title: "CSS Clip-path Generator",
  description:
    "Create CSS clip-path shapes visually with circle, ellipse, inset, and polygon modes. Drag polygon points, use 13 shape presets, and copy production-ready CSS. Free online tool.",
  keywords: [
    "CSS clip-path generator",
    "clip-path CSS",
    "CSS clip path maker",
    "polygon clip-path",
    "CSS shape generator",
    "clip-path polygon",
    "CSS clipping path",
    "clip-path circle",
    "CSS mask shape",
    "clip-path tool online",
  ],
  alternates: {
    canonical: "/tools/clip-path",
  },
  openGraph: {
    title: "CSS Clip-path Generator - DevBolt",
    description:
      "Design CSS clip-path shapes visually with draggable polygon points, circle, ellipse, and inset modes. Copy production-ready CSS.",
    url: "/tools/clip-path",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "CSS Clip-path Generator",
  url: "https://devbolt.dev/tools/clip-path",
  description:
    "Create CSS clip-path shapes visually with circle, ellipse, inset, and polygon modes. Drag polygon points, use shape presets, and copy production-ready CSS.",
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

export default function ClipPathPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ClipPathTool />
    </>
  );
}
