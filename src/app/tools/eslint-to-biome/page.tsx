import type { Metadata } from "next";
import EslintToBiomeTool from "./EslintToBiomeTool";

export const metadata: Metadata = {
  title:
    "ESLint to Biome Converter — Migrate .eslintrc to biome.json",
  description:
    "Convert your ESLint config to Biome instantly. Maps 100+ rules from core ESLint, TypeScript, React, JSX-A11y, and import plugins to biome.json. Free, client-side — no signup required.",
  keywords: [
    "eslint to biome",
    "eslint to biome converter",
    "migrate eslint to biome",
    "biome migration",
    "eslintrc to biome.json",
    "biome config generator",
    "eslint biome migration tool",
    "replace eslint with biome",
    "biome v2 migration",
  ],
  alternates: {
    canonical: "/tools/eslint-to-biome",
  },
  openGraph: {
    title: "ESLint to Biome Converter - DevBolt",
    description:
      "Convert your ESLint config to Biome. Maps 100+ rules to biome.json. Free, client-side, no signup.",
    url: "/tools/eslint-to-biome",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "ESLint to Biome Converter",
  url: "https://devbolt.dev/tools/eslint-to-biome",
  description:
    "Convert ESLint configurations to Biome. Maps 100+ rules from core, TypeScript, React, JSX-A11y, and import plugins with formatter extraction.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function EslintToBiomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <EslintToBiomeTool />
    </>
  );
}
