import type { Metadata } from "next";
import JsonToCsvTool from "./JsonToCsvTool";

export const metadata: Metadata = {
  title: "JSON to CSV Converter",
  description:
    "Convert JSON to CSV instantly. Flatten nested objects with dot notation, select columns, choose delimiters, and download as .csv file. Free online tool — no signup required.",
  keywords: [
    "json to csv",
    "json to csv converter",
    "convert json to csv",
    "json to csv online",
    "json csv converter",
    "json export csv",
    "json to spreadsheet",
    "json to excel",
    "flatten json to csv",
    "json to csv download",
  ],
  alternates: {
    canonical: "/tools/json-to-csv",
  },
  openGraph: {
    title: "JSON to CSV Converter - DevBolt",
    description:
      "Convert JSON to CSV instantly with nested object flattening, column selection, and .csv download.",
    url: "/tools/json-to-csv",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "JSON to CSV Converter",
  url: "https://devbolt.dev/tools/json-to-csv",
  description:
    "Convert JSON to CSV with nested object flattening, custom delimiters, column selection, and file download.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function JsonToCsvPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <JsonToCsvTool />
    </>
  );
}
