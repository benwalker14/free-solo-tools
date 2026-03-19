import type { Metadata } from "next";
import PackageJsonGeneratorTool from "./PackageJsonGeneratorTool";

export const metadata: Metadata = {
  title: "package.json Generator",
  description:
    "Generate package.json visually with framework presets (Next.js, Vite, Express, npm library, CLI, monorepo). Add dependencies, scripts, and module config. Free online tool — no signup required.",
  keywords: [
    "package.json generator",
    "package.json builder",
    "create package.json",
    "npm init online",
    "package.json creator",
    "node package generator",
    "package.json template",
    "npm package.json",
    "generate package.json",
    "package.json editor",
  ],
  alternates: {
    canonical: "/tools/package-json-generator",
  },
  openGraph: {
    title: "package.json Generator - DevBolt",
    description:
      "Generate package.json with framework presets, dependency editor, and scripts. Free, client-side, no signup.",
    url: "/tools/package-json-generator",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "package.json Generator",
  url: "https://devbolt.dev/tools/package-json-generator",
  description:
    "Generate package.json files visually with framework presets, dependency management, script editor, and module configuration. Download or copy instantly.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  isAccessibleForFree: true,
  browserRequirements: "Any modern web browser",
  creator: { "@type": "Organization", name: "DevBolt", url: "https://devbolt.dev" },
};

export default function PackageJsonGeneratorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PackageJsonGeneratorTool />
    </>
  );
}
