import type { Metadata } from "next";
import CaseConverterTool from "./CaseConverterTool";

export const metadata: Metadata = {
  title: "Text Case Converter",
  description:
    "Convert text between camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, Title Case, and more. Free online tool — no signup required.",
  keywords: [
    "case converter",
    "text case converter",
    "camelCase converter",
    "snake_case converter",
    "kebab-case converter",
    "PascalCase converter",
    "naming convention converter",
  ],
  alternates: {
    canonical: "/tools/case-converter",
  },
  openGraph: {
    title: "Text Case Converter - DevBolt",
    description:
      "Convert text between camelCase, snake_case, kebab-case, and 8 more styles instantly.",
    url: "/tools/case-converter",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Text Case Converter",
  url: "https://devbolt.dev/tools/case-converter",
  description:
    "Convert text between camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, Title Case, and more.",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  isAccessibleForFree: true,
  browserRequirements: "Any modern web browser",
  creator: { "@type": "Organization", name: "DevBolt", url: "https://devbolt.dev" },
};

export default function CaseConverterPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CaseConverterTool />
    </>
  );
}
