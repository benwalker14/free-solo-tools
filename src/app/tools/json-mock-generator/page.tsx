import type { Metadata } from "next";
import JsonMockGeneratorTool from "./JsonMockGeneratorTool";

export const metadata: Metadata = {
  title: "JSON Mock Data Generator",
  description:
    "Generate realistic fake JSON data for API testing. Build schemas with 20+ field types — names, emails, addresses, UUIDs, dates, and more. Preset templates for users, products, and orders. Free online tool — no signup required.",
  keywords: [
    "json mock data generator",
    "fake json data",
    "mock api data",
    "json test data generator",
    "random json generator",
    "fake data generator",
    "mock data for testing",
    "json placeholder generator",
    "api mock data",
    "json faker online",
  ],
  alternates: {
    canonical: "/tools/json-mock-generator",
  },
  openGraph: {
    title: "JSON Mock Data Generator - DevBolt",
    description:
      "Generate realistic fake JSON data for API testing with 20+ field types and preset templates.",
    url: "/tools/json-mock-generator",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "JSON Mock Data Generator",
  url: "https://devbolt.dev/tools/json-mock-generator",
  description:
    "Generate realistic fake JSON data for API testing. Build schemas with 20+ field types and preset templates for users, products, and orders.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function JsonMockGeneratorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <JsonMockGeneratorTool />
    </>
  );
}
