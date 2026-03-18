import type { Metadata } from "next";
import UuidGeneratorTool from "./UuidGeneratorTool";

export const metadata: Metadata = {
  title: "UUID Generator",
  description:
    "Generate random UUID v4 identifiers instantly. Bulk generation supported. Free online UUID tool — no signup required.",
  keywords: [
    "UUID generator",
    "UUID v4",
    "random UUID",
    "generate UUID online",
    "bulk UUID generator",
  ],
  alternates: {
    canonical: "/tools/uuid-generator",
  },
  openGraph: {
    title: "UUID Generator - FreeSolo Tools",
    description:
      "Generate random UUID v4 identifiers. Bulk generation supported.",
    url: "/tools/uuid-generator",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "UUID Generator",
  url: "https://free-solo-tools.vercel.app/tools/uuid-generator",
  description:
    "Generate random UUID v4 identifiers instantly. Bulk generation supported.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function UuidGeneratorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <UuidGeneratorTool />
    </>
  );
}
