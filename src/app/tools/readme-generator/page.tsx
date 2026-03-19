import type { Metadata } from "next";
import ReadmeGeneratorTool from "./ReadmeGeneratorTool";

export const metadata: Metadata = {
  title: "README Generator",
  description:
    "Generate professional GitHub README.md files instantly. Fill in your project details and get a polished, well-structured README with badges, installation steps, usage examples, and more. Free online tool — no signup required.",
  keywords: [
    "readme generator",
    "github readme generator",
    "readme template",
    "readme.md generator",
    "markdown readme",
    "github readme template",
    "project readme generator",
    "readme builder",
    "readme creator",
    "generate readme online",
  ],
  alternates: {
    canonical: "/tools/readme-generator",
  },
  openGraph: {
    title: "README Generator - DevBolt",
    description:
      "Generate professional GitHub README.md files with badges, installation steps, usage examples, and more.",
    url: "/tools/readme-generator",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "README Generator",
  url: "https://devbolt.dev/tools/readme-generator",
  description:
    "Generate professional GitHub README.md files instantly. Fill in your project details and get a polished, well-structured README with badges, installation, usage, and more.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  isAccessibleForFree: true,
  browserRequirements: "Any modern web browser",
  creator: { "@type": "Organization", name: "DevBolt", url: "https://devbolt.dev" },
};

export default function ReadmeGeneratorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ReadmeGeneratorTool />
    </>
  );
}
