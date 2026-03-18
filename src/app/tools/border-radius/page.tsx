import type { Metadata } from "next";
import BorderRadiusTool from "./BorderRadiusTool";

export const metadata: Metadata = {
  title: "CSS Border Radius Generator",
  description:
    "Create CSS border-radius visually. Adjust each corner independently, choose units (px, %, em, rem), use presets, and copy production-ready CSS. Free online tool — no signup required.",
  keywords: [
    "CSS border radius generator",
    "border radius CSS",
    "rounded corners CSS",
    "CSS border radius tool",
    "border radius maker",
    "CSS corner rounding",
    "border radius calculator",
    "CSS rounded box",
    "border radius preview",
  ],
  alternates: {
    canonical: "/tools/border-radius",
  },
  openGraph: {
    title: "CSS Border Radius Generator - DevBolt",
    description:
      "Design CSS border-radius visually with per-corner controls, presets, and copy-ready CSS.",
    url: "/tools/border-radius",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "CSS Border Radius Generator",
  url: "https://devbolt.dev/tools/border-radius",
  description:
    "Create CSS border-radius visually. Adjust each corner independently, choose units, use presets, and copy production-ready CSS.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function BorderRadiusPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BorderRadiusTool />
    </>
  );
}
