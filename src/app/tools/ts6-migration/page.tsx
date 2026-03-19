import type { Metadata } from "next";
import TypeScript6MigrationTool from "./TypeScript6MigrationTool";

export const metadata: Metadata = {
  title: "TypeScript 6.0 Migration Checker",
  description:
    "Analyze your tsconfig.json for TypeScript 6.0 breaking changes, deprecated options, and new defaults. Get a readiness grade and step-by-step migration fixes. Free, client-side — no signup required.",
  keywords: [
    "typescript 6 migration",
    "typescript 6.0 breaking changes",
    "tsconfig migration checker",
    "typescript 6 upgrade guide",
    "ts 6.0 migration tool",
    "typescript 6 breaking changes checker",
    "tsconfig analyzer",
    "typescript upgrade tool",
    "ts6 migration",
    "typescript 6 compatibility",
  ],
  alternates: {
    canonical: "/tools/ts6-migration",
  },
  openGraph: {
    title: "TypeScript 6.0 Migration Checker - DevBolt",
    description:
      "Analyze your tsconfig.json for TS 6.0 breaking changes. Get a readiness grade and migration fixes.",
    url: "/tools/ts6-migration",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "TypeScript 6.0 Migration Checker",
  url: "https://devbolt.dev/tools/ts6-migration",
  description:
    "Analyze tsconfig.json for TypeScript 6.0 breaking changes, deprecated options, and new defaults. Client-side migration checker tool.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  isAccessibleForFree: true,
  browserRequirements: "Any modern web browser",
  creator: { "@type": "Organization", name: "DevBolt", url: "https://devbolt.dev" },
};

export default function TS6MigrationCheckerPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TypeScript6MigrationTool />
    </>
  );
}
