import type { Metadata } from "next";
import JsonSchemaValidatorTool from "./JsonSchemaValidatorTool";

export const metadata: Metadata = {
  title: "JSON Schema Validator",
  description:
    "Validate JSON data against JSON Schema (Draft 07) with detailed error reporting. Generate schemas from sample data, test format validation, and debug schema issues. Free online tool — no signup required.",
  keywords: [
    "JSON Schema validator",
    "JSON Schema online",
    "validate JSON Schema",
    "JSON Schema tester",
    "JSON Schema draft 07",
    "JSON validation tool",
    "JSON Schema generator",
    "ajv validator",
    "JSON Schema format",
  ],
  alternates: {
    canonical: "/tools/json-schema",
  },
  openGraph: {
    title: "JSON Schema Validator - DevBolt",
    description:
      "Validate JSON data against JSON Schema with detailed error reporting. Free online tool.",
    url: "/tools/json-schema",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "JSON Schema Validator",
  url: "https://devbolt.dev/tools/json-schema",
  description:
    "Validate JSON data against JSON Schema (Draft 07) with detailed error reporting. Generate schemas from sample data and debug schema issues.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  isAccessibleForFree: true,
  browserRequirements: "Any modern web browser",
  creator: { "@type": "Organization", name: "DevBolt", url: "https://devbolt.dev" },
};

export default function JsonSchemaPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <JsonSchemaValidatorTool />
    </>
  );
}
