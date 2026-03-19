import type { Metadata } from "next";
import CssToTailwindTool from "./CssToTailwindTool";

export const metadata: Metadata = {
  title: "CSS to Tailwind Converter — Convert CSS to Utility Classes",
  description:
    "Convert CSS to Tailwind CSS utility classes instantly. Supports 100+ properties — layout, spacing, typography, borders, effects. Free online tool, fully client-side.",
  keywords: [
    "css to tailwind",
    "css to tailwind converter",
    "convert css to tailwind",
    "tailwind converter",
    "css to utility classes",
    "tailwind css converter",
    "css tailwind converter online",
    "tailwind class generator",
    "css to tw",
  ],
  alternates: {
    canonical: "/tools/css-to-tailwind",
  },
  openGraph: {
    title: "CSS to Tailwind Converter - DevBolt",
    description:
      "Convert CSS to Tailwind CSS utility classes instantly. 100+ properties supported. Free, client-side, no signup.",
    url: "/tools/css-to-tailwind",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "CSS to Tailwind Converter",
  url: "https://devbolt.dev/tools/css-to-tailwind",
  description:
    "Convert CSS to Tailwind CSS utility classes instantly. Supports layout, spacing, typography, borders, effects, and more. Free online tool.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  isAccessibleForFree: true,
  browserRequirements: "Any modern web browser",
  creator: { "@type": "Organization", name: "DevBolt", url: "https://devbolt.dev" },
};

export default function CssToTailwindPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CssToTailwindTool />
    </>
  );
}
