import type { Metadata } from "next";
import SqlToTypescriptTool from "./SqlToTypescriptTool";

export const metadata: Metadata = {
  title: "SQL to TypeScript / Prisma / Drizzle Converter",
  description:
    "Convert SQL CREATE TABLE statements to TypeScript interfaces, Prisma schema, and Drizzle ORM definitions. Supports PostgreSQL, MySQL, and SQLite. Free online tool — no signup required.",
  keywords: [
    "sql to typescript",
    "sql to prisma",
    "sql to drizzle",
    "sql to typescript converter",
    "create table to typescript",
    "sql to prisma schema",
    "sql to drizzle orm",
    "sql type mapping",
    "database to typescript",
    "sql schema converter",
  ],
  alternates: {
    canonical: "/tools/sql-to-typescript",
  },
  openGraph: {
    title: "SQL to TypeScript / Prisma / Drizzle Converter - DevBolt",
    description:
      "Convert SQL CREATE TABLE statements to TypeScript interfaces, Prisma schema, and Drizzle ORM definitions.",
    url: "/tools/sql-to-typescript",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "SQL to TypeScript / Prisma / Drizzle Converter",
  url: "https://devbolt.dev/tools/sql-to-typescript",
  description:
    "Convert SQL CREATE TABLE statements to TypeScript interfaces, Prisma schema, and Drizzle ORM table definitions with automatic type mapping.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function SqlToTypescriptPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SqlToTypescriptTool />
    </>
  );
}
