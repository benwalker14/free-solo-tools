import type { Metadata } from "next";
import JsonXmlTool from "./JsonXmlTool";

export const metadata: Metadata = {
  title: "JSON ↔ XML Converter",
  description:
    "Convert JSON to XML and XML to JSON instantly. Handles nested objects, arrays, attributes, CDATA sections, and XML declarations. Free online tool — no signup required.",
  keywords: [
    "json to xml",
    "xml to json",
    "json xml converter",
    "xml converter",
    "json converter",
    "convert json to xml online",
    "convert xml to json online",
    "xml to json online",
    "json to xml online",
    "xml parser",
    "json xml transform",
  ],
  alternates: {
    canonical: "/tools/json-xml",
  },
  openGraph: {
    title: "JSON ↔ XML Converter - DevBolt",
    description:
      "Convert between JSON and XML formats instantly. Handles nested objects, arrays, attributes, and CDATA.",
    url: "/tools/json-xml",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "JSON ↔ XML Converter",
  url: "https://devbolt.dev/tools/json-xml",
  description:
    "Convert JSON to XML and XML to JSON. Handles nested objects, arrays, attributes, CDATA sections, and XML declarations.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  isAccessibleForFree: true,
  browserRequirements: "Any modern web browser",
  creator: { "@type": "Organization", name: "DevBolt", url: "https://devbolt.dev" },
};

export default function JsonXmlPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <JsonXmlTool />
    </>
  );
}
