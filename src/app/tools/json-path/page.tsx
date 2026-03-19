import type { Metadata } from "next";
import JsonPathTool from "./JsonPathTool";

export const metadata: Metadata = {
  title: "JSON Path Tester",
  description:
    "Test JSONPath expressions against JSON data with real-time evaluation. Extract values, filter arrays, and debug JSON structures. Free online JSONPath tool — no signup required.",
  keywords: [
    "JSONPath tester",
    "JSONPath evaluator",
    "JSON query",
    "JSONPath online",
    "JSON path expression",
    "JSON data extraction",
    "test JSONPath",
    "JSONPath filter",
    "JSON query tool",
  ],
  alternates: {
    canonical: "/tools/json-path",
  },
  openGraph: {
    title: "JSON Path Tester - DevBolt",
    description:
      "Test JSONPath expressions against JSON data with real-time evaluation. Free online tool.",
    url: "/tools/json-path",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "JSON Path Tester",
  url: "https://devbolt.dev/tools/json-path",
  description:
    "Test JSONPath expressions against JSON data with real-time evaluation. Extract values, filter arrays, and debug JSON structures.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  isAccessibleForFree: true,
  browserRequirements: "Any modern web browser",
  creator: { "@type": "Organization", name: "DevBolt", url: "https://devbolt.dev" },
};

export default function JsonPathPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <JsonPathTool />
    </>
  );
}
