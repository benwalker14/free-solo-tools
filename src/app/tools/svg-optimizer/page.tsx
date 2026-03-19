import type { Metadata } from "next";
import SvgOptimizerTool from "./SvgOptimizerTool";

export const metadata: Metadata = {
  title: "SVG Optimizer & Viewer",
  description:
    "Optimize and clean SVG files by removing metadata, comments, editor data, and unnecessary attributes. Preview SVGs instantly. Free online SVG optimizer — no signup required.",
  keywords: [
    "SVG optimizer",
    "SVG minifier",
    "optimize SVG online",
    "SVG cleaner",
    "SVG viewer",
    "compress SVG",
    "SVG editor data remover",
    "clean SVG",
    "reduce SVG size",
  ],
  alternates: {
    canonical: "/tools/svg-optimizer",
  },
  openGraph: {
    title: "SVG Optimizer & Viewer - DevBolt",
    description:
      "Optimize and clean SVG files by removing metadata, comments, and editor cruft. Free online tool.",
    url: "/tools/svg-optimizer",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "SVG Optimizer & Viewer",
  url: "https://devbolt.dev/tools/svg-optimizer",
  description:
    "Optimize and clean SVG files by removing metadata, comments, editor data, and unnecessary attributes. Preview SVGs with before/after comparison.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  isAccessibleForFree: true,
  browserRequirements: "Any modern web browser",
  creator: { "@type": "Organization", name: "DevBolt", url: "https://devbolt.dev" },
};

export default function SvgOptimizerPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SvgOptimizerTool />
    </>
  );
}
