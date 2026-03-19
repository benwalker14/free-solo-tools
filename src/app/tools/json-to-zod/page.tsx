import type { Metadata } from "next";
import JsonToZodTool from "./JsonToZodTool";

export const metadata: Metadata = {
  title: "JSON to Zod Converter",
  description:
    "Convert JSON or JSON Schema to Zod validation schemas online. Supports $ref, allOf/oneOf/anyOf, enum, format constraints, required/optional, and nested objects. Free online tool — no signup required.",
  keywords: [
    "json to zod",
    "json to zod converter",
    "json schema to zod",
    "zod converter",
    "convert json to zod",
    "zod schema from json",
    "json schema zod",
    "zod validation generator",
    "typescript zod",
    "zod online converter",
  ],
  alternates: { canonical: "/tools/json-to-zod" },
  openGraph: {
    title: "JSON to Zod Converter - DevBolt",
    description:
      "Convert JSON or JSON Schema to Zod validation schemas. Supports $ref, allOf/oneOf, enum, format constraints, and nested objects.",
    url: "/tools/json-to-zod",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "JSON to Zod Converter",
  url: "https://devbolt.dev/tools/json-to-zod",
  description:
    "Convert JSON data or JSON Schema definitions to Zod validation schemas with full support for $ref, allOf/oneOf/anyOf, enum, format constraints, and nested objects.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  isAccessibleForFree: true,
  browserRequirements: "Any modern web browser",
  creator: { "@type": "Organization", name: "DevBolt", url: "https://devbolt.dev" },
};

export default function JsonToZodPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <JsonToZodTool />
    </>
  );
}
