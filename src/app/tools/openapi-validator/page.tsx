import type { Metadata } from "next";
import OpenApiValidatorTool from "./OpenApiValidatorTool";

export const metadata: Metadata = {
  title: "OpenAPI / Swagger Validator",
  description:
    "Validate OpenAPI 3.x and Swagger 2.0 specifications instantly. Checks structure, paths, operations, schemas, security definitions, and best practices. Free online tool — no signup required.",
  keywords: [
    "OpenAPI validator",
    "Swagger validator",
    "OpenAPI 3.0 validator",
    "Swagger 2.0 validator",
    "OpenAPI spec checker",
    "API specification validator",
    "OpenAPI linter",
    "Swagger linter",
    "validate OpenAPI YAML",
    "validate OpenAPI JSON",
  ],
  alternates: {
    canonical: "/tools/openapi-validator",
  },
  openGraph: {
    title: "OpenAPI / Swagger Validator - DevBolt",
    description:
      "Validate OpenAPI 3.x and Swagger 2.0 specs for structure, paths, schemas, security, and best practices. Free online tool.",
    url: "/tools/openapi-validator",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "OpenAPI / Swagger Validator",
  url: "https://devbolt.dev/tools/openapi-validator",
  description:
    "Validate OpenAPI 3.x and Swagger 2.0 specifications instantly. Checks structure, paths, operations, schemas, security definitions, and best practices.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function OpenApiValidatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <OpenApiValidatorTool />
    </>
  );
}
