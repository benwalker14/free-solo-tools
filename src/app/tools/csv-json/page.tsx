import type { Metadata } from "next";
import CsvJsonTool from "./CsvJsonTool";

export const metadata: Metadata = {
  title: "CSV ↔ JSON Converter",
  description:
    "Convert CSV to JSON and JSON to CSV instantly. Handles quoted fields, custom delimiters (comma, tab, semicolon, pipe), and large datasets. Free online tool — no signup required.",
  keywords: [
    "csv to json",
    "json to csv",
    "csv converter",
    "json converter",
    "csv parser",
    "csv to json online",
    "json to csv online",
    "convert csv",
    "csv json tool",
    "data converter",
  ],
  alternates: {
    canonical: "/tools/csv-json",
  },
  openGraph: {
    title: "CSV ↔ JSON Converter - DevBolt",
    description:
      "Convert between CSV and JSON formats instantly with support for custom delimiters.",
    url: "/tools/csv-json",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "CSV ↔ JSON Converter",
  url: "https://devbolt.dev/tools/csv-json",
  description:
    "Convert CSV to JSON and JSON to CSV. Handles quoted fields, custom delimiters, and large datasets.",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  isAccessibleForFree: true,
  browserRequirements: "Any modern web browser",
  creator: { "@type": "Organization", name: "DevBolt", url: "https://devbolt.dev" },
};

export default function CsvJsonPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CsvJsonTool />
    </>
  );
}
