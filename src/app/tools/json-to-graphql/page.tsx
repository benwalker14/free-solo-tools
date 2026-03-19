import type { Metadata } from "next";
import JsonToGraphqlTool from "./JsonToGraphqlTool";

export const metadata: Metadata = {
  title: "JSON to GraphQL Schema Generator",
  description:
    "Generate GraphQL schema definitions from JSON data. Automatically infers types, detects IDs and dates, creates nested types, and generates Query/Mutation operations. Free online tool — no signup required.",
  keywords: [
    "json to graphql",
    "json to graphql schema",
    "json to graphql converter",
    "generate graphql schema",
    "graphql schema generator",
    "json to graphql online",
    "graphql type generator",
    "json to graphql types",
    "graphql schema from json",
    "convert json to graphql",
  ],
  alternates: {
    canonical: "/tools/json-to-graphql",
  },
  openGraph: {
    title: "JSON to GraphQL Schema Generator - DevBolt",
    description:
      "Generate GraphQL schema definitions from JSON data with automatic type inference and Query/Mutation generation.",
    url: "/tools/json-to-graphql",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "JSON to GraphQL Schema Generator",
  url: "https://devbolt.dev/tools/json-to-graphql",
  description:
    "Generate GraphQL schema definitions from JSON data with automatic type inference, ID/date detection, and Query/Mutation generation.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  isAccessibleForFree: true,
  browserRequirements: "Any modern web browser",
  creator: { "@type": "Organization", name: "DevBolt", url: "https://devbolt.dev" },
};

export default function JsonToGraphqlPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <JsonToGraphqlTool />
    </>
  );
}
