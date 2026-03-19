import type { Metadata } from "next";
import ZodSchemaTool from "./ZodSchemaTool";

export const metadata: Metadata = {
  title: "Zod Schema Generator",
  description:
    "Generate Zod validation schemas from JSON data instantly. Auto-detects emails, URLs, UUIDs, dates, integers, and nested objects. Free online tool — no signup required.",
  keywords: [
    "zod schema generator",
    "json to zod",
    "zod generator",
    "zod schema from json",
    "zod validation",
    "typescript schema",
    "zod object generator",
    "zod inference",
    "zod coerce",
    "generate zod schema",
  ],
  alternates: {
    canonical: "/tools/zod-schema",
  },
  openGraph: {
    title: "Zod Schema Generator - DevBolt",
    description:
      "Generate Zod validation schemas from JSON data instantly. Auto-detects formats and nested structures.",
    url: "/tools/zod-schema",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Zod Schema Generator",
  url: "https://devbolt.dev/tools/zod-schema",
  description:
    "Generate Zod validation schemas from JSON data. Auto-detects emails, URLs, UUIDs, dates, integers, and nested objects.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  isAccessibleForFree: true,
  browserRequirements: "Any modern web browser",
  creator: { "@type": "Organization", name: "DevBolt", url: "https://devbolt.dev" },
};

export default function ZodSchemaPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ZodSchemaTool />
    </>
  );
}
