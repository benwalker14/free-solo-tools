import type { Metadata } from "next";
import JsonToSqlTool from "./JsonToSqlTool";

export const metadata: Metadata = {
  title: "JSON to SQL Converter",
  description:
    "Convert JSON arrays to SQL CREATE TABLE and INSERT statements for PostgreSQL, MySQL, and SQLite. Automatic type inference, batch inserts, and .sql download. Free online tool — no signup required.",
  keywords: [
    "json to sql",
    "json to sql converter",
    "convert json to sql",
    "json to sql online",
    "json to insert statement",
    "json to create table",
    "json to postgresql",
    "json to mysql",
    "json to sqlite",
    "json to database",
  ],
  alternates: {
    canonical: "/tools/json-to-sql",
  },
  openGraph: {
    title: "JSON to SQL Converter - DevBolt",
    description:
      "Convert JSON arrays to SQL CREATE TABLE and INSERT statements for PostgreSQL, MySQL, and SQLite.",
    url: "/tools/json-to-sql",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "JSON to SQL Converter",
  url: "https://devbolt.dev/tools/json-to-sql",
  description:
    "Convert JSON arrays to SQL CREATE TABLE and INSERT statements with automatic type inference for PostgreSQL, MySQL, and SQLite.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  isAccessibleForFree: true,
  browserRequirements: "Any modern web browser",
  creator: { "@type": "Organization", name: "DevBolt", url: "https://devbolt.dev" },
};

export default function JsonToSqlPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <JsonToSqlTool />
    </>
  );
}
