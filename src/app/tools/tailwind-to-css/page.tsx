import type { Metadata } from "next";
import TailwindToCssTool from "./TailwindToCssTool";

export const metadata: Metadata = {
  title: "Tailwind CSS to CSS Converter — Convert Utility Classes to CSS",
  description:
    "Convert Tailwind CSS utility classes to standard CSS instantly. Supports 500+ classes — spacing, layout, typography, borders, transforms, filters, and arbitrary values. Free online tool, fully client-side.",
  keywords: [
    "tailwind to css",
    "tailwind to css converter",
    "convert tailwind to css",
    "tailwind css to css",
    "tailwind utility classes to css",
    "tailwind converter",
    "tailwind css converter online",
    "tailwind to plain css",
    "reverse tailwind",
  ],
  alternates: {
    canonical: "/tools/tailwind-to-css",
  },
  openGraph: {
    title: "Tailwind CSS to CSS Converter - DevBolt",
    description:
      "Convert Tailwind CSS utility classes to standard CSS instantly. 500+ classes supported. Free, client-side, no signup.",
    url: "/tools/tailwind-to-css",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Tailwind CSS to CSS Converter",
  url: "https://devbolt.dev/tools/tailwind-to-css",
  description:
    "Convert Tailwind CSS utility classes to standard CSS instantly. Supports spacing, layout, typography, borders, transforms, filters, and arbitrary values. Free online tool.",
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

export default function TailwindToCssPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TailwindToCssTool />
    </>
  );
}
