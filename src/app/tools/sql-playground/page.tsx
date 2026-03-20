import type { Metadata } from "next";
import SQLPlaygroundTool from "./SQLPlaygroundTool";

export const metadata: Metadata = {
  title: "SQL Playground",
  description:
    "Run SQL queries in your browser with a full SQLite database powered by WebAssembly. Practice JOINs, CTEs, window functions, and more. Free online SQL playground — no signup, no server.",
  keywords: [
    "SQL playground",
    "online SQL editor",
    "SQL fiddle",
    "SQLite playground",
    "run SQL online",
    "SQL practice",
    "SQL sandbox",
    "SQL query tester",
    "browser SQL",
    "WebAssembly SQLite",
  ],
  alternates: {
    canonical: "/tools/sql-playground",
  },
  openGraph: {
    title: "SQL Playground - DevBolt",
    description:
      "Run SQL queries in your browser with a full SQLite database. No signup, no server — powered by WebAssembly.",
    url: "/tools/sql-playground",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "SQL Playground",
  url: "https://devbolt.dev/tools/sql-playground",
  description:
    "Run SQL queries in your browser with a full SQLite database powered by WebAssembly. Practice JOINs, CTEs, window functions, aggregations, and more.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  isAccessibleForFree: true,
  browserRequirements: "Any modern web browser with WebAssembly support",
  creator: {
    "@type": "Organization",
    name: "DevBolt",
    url: "https://devbolt.dev",
  },
};

export default function SQLPlaygroundPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SQLPlaygroundTool />
    </>
  );
}
