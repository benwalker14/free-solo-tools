import type { Metadata } from "next";
import JsonToTypescriptTool from "./JsonToTypescriptTool";

export const metadata: Metadata = {
  title: "JSON to TypeScript Generator",
  description:
    "Generate TypeScript interfaces and type aliases from JSON data instantly. Handles nested objects, arrays, nulls, and mixed types. Free online tool — no signup required.",
  keywords: [
    "json to typescript",
    "json to ts",
    "typescript generator",
    "json to interface",
    "json to type",
    "typescript interface generator",
    "json typescript converter",
    "generate types from json",
    "typescript types",
  ],
  alternates: {
    canonical: "/tools/json-to-typescript",
  },
  openGraph: {
    title: "JSON to TypeScript Generator - DevBolt",
    description:
      "Generate TypeScript interfaces and type aliases from JSON data instantly.",
    url: "/tools/json-to-typescript",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "JSON to TypeScript Generator",
  url: "https://devbolt.dev/tools/json-to-typescript",
  description:
    "Generate TypeScript interfaces and type aliases from JSON data. Handles nested objects, arrays, and mixed types.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  isAccessibleForFree: true,
  browserRequirements: "Any modern web browser",
  creator: { "@type": "Organization", name: "DevBolt", url: "https://devbolt.dev" },
};

export default function JsonToTypescriptPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <JsonToTypescriptTool />
    </>
  );
}
