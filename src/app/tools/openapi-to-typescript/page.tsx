import type { Metadata } from "next";
import OpenApiToTypescriptTool from "./OpenApiToTypescriptTool";

export const metadata: Metadata = {
  title: "OpenAPI to TypeScript Converter",
  description:
    "Convert OpenAPI 3.x and Swagger 2.0 specs to TypeScript interfaces and types. Handles $ref resolution, allOf/oneOf/anyOf, enums, nested objects, and request/response types. Free online tool — no signup required.",
  keywords: [
    "openapi to typescript",
    "swagger to typescript",
    "openapi typescript generator",
    "openapi codegen typescript",
    "swagger typescript types",
    "openapi interface generator",
    "openapi types generator",
    "convert openapi to typescript",
    "openapi schema to typescript",
    "swagger codegen typescript",
  ],
  alternates: {
    canonical: "/tools/openapi-to-typescript",
  },
  openGraph: {
    title: "OpenAPI to TypeScript Converter - DevBolt",
    description:
      "Convert OpenAPI 3.x and Swagger 2.0 specs to TypeScript interfaces. $ref resolution, enums, allOf/oneOf/anyOf. Free, client-side, no signup.",
    url: "/tools/openapi-to-typescript",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "OpenAPI to TypeScript Converter",
  url: "https://devbolt.dev/tools/openapi-to-typescript",
  description:
    "Convert OpenAPI 3.x and Swagger 2.0 specifications to TypeScript interfaces and types. Handles $ref, allOf/oneOf/anyOf, enums, and nested objects.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  isAccessibleForFree: true,
  browserRequirements: "Any modern web browser",
  creator: { "@type": "Organization", name: "DevBolt", url: "https://devbolt.dev" },
};

export default function OpenApiToTypescriptPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <OpenApiToTypescriptTool />
    </>
  );
}
