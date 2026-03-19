import type { Metadata } from "next";
import JsonDiffTool from "./JsonDiffTool";

export const metadata: Metadata = {
  title: "JSON Diff",
  description:
    "Compare two JSON objects and see structural differences — added, removed, and changed keys with values highlighted. Free online JSON diff tool.",
  keywords: [
    "json diff",
    "json compare",
    "compare json",
    "json difference",
    "json diff online",
    "json comparison tool",
    "compare json objects",
  ],
  alternates: {
    canonical: "/tools/json-diff",
  },
  openGraph: {
    title: "JSON Diff - DevBolt",
    description:
      "Compare two JSON objects and see structural differences highlighted. Free online tool.",
    url: "/tools/json-diff",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "JSON Diff",
  url: "https://devbolt.dev/tools/json-diff",
  description:
    "Compare two JSON objects and see structural differences — added, removed, and changed keys with values highlighted.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function JsonDiffPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <JsonDiffTool />
    </>
  );
}
