import type { Metadata } from "next";
import GraphqlToTypescriptTool from "./GraphqlToTypescriptTool";

export const metadata: Metadata = {
  title: "GraphQL to TypeScript Converter",
  description:
    "Convert GraphQL SDL schemas to TypeScript interfaces and types. Handles object types, input types, enums, unions, interfaces, scalars, and operations. Free online tool — no signup required.",
  keywords: [
    "graphql to typescript",
    "graphql typescript codegen",
    "graphql schema to types",
    "graphql typescript generator",
    "graphql codegen online",
    "convert graphql to typescript",
    "graphql types generator",
    "graphql sdl to typescript",
    "graphql interface generator",
    "graphql enum typescript",
  ],
  alternates: {
    canonical: "/tools/graphql-to-typescript",
  },
  openGraph: {
    title: "GraphQL to TypeScript Converter - DevBolt",
    description:
      "Convert GraphQL SDL schemas to TypeScript interfaces. Types, inputs, enums, unions, scalars. Free, client-side, no signup.",
    url: "/tools/graphql-to-typescript",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "GraphQL to TypeScript Converter",
  url: "https://devbolt.dev/tools/graphql-to-typescript",
  description:
    "Convert GraphQL SDL schemas to TypeScript interfaces and types. Handles object types, input types, enums, unions, interfaces, scalars, and query/mutation operations.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function GraphqlToTypescriptPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GraphqlToTypescriptTool />
    </>
  );
}
