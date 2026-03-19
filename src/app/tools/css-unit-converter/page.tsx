import type { Metadata } from "next";
import CssUnitConverterTool from "./CssUnitConverterTool";

export const metadata: Metadata = {
  title: "CSS Unit Converter — px to rem, em, pt, vw, vh, %",
  description:
    "Convert between CSS units instantly — px to rem, em to px, pt, vw, vh, and percent. Batch-convert CSS files. Configurable base font size. Free online tool — no signup required.",
  keywords: [
    "px to rem",
    "rem to px",
    "css unit converter",
    "px to em",
    "em to px",
    "px to pt",
    "css converter",
    "rem calculator",
    "px rem converter",
    "css units",
    "viewport units",
    "vw to px",
    "responsive units",
  ],
  alternates: {
    canonical: "/tools/css-unit-converter",
  },
  openGraph: {
    title: "CSS Unit Converter — px to rem, em, pt, vw, vh, % - DevBolt",
    description:
      "Convert between CSS units instantly — px to rem, em, pt, vw, vh, and %. Batch-convert entire CSS files.",
    url: "/tools/css-unit-converter",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "CSS Unit Converter",
  url: "https://devbolt.dev/tools/css-unit-converter",
  description:
    "Convert between CSS units — px, rem, em, pt, vw, vh, and percent. Batch-convert CSS files with configurable base font size.",
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

export default function CssUnitConverterPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CssUnitConverterTool />
    </>
  );
}
