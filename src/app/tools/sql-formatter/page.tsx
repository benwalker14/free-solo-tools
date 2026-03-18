import type { Metadata } from "next";
import SqlFormatterTool from "./SqlFormatterTool";

export const metadata: Metadata = {
  title: "SQL Formatter & Beautifier",
  description:
    "Format, beautify, and minify SQL queries instantly. Supports SELECT, INSERT, UPDATE, DELETE, JOINs, subqueries, and more. Free online SQL formatter — no signup required.",
  keywords: [
    "SQL formatter",
    "SQL beautifier",
    "SQL pretty print",
    "format SQL online",
    "SQL minifier",
    "SQL query formatter",
  ],
  alternates: {
    canonical: "/tools/sql-formatter",
  },
  openGraph: {
    title: "SQL Formatter & Beautifier - FreeSolo Tools",
    description:
      "Format, beautify, and minify SQL queries instantly. Free online tool.",
    url: "/tools/sql-formatter",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "SQL Formatter & Beautifier",
  url: "https://free-solo-tools.vercel.app/tools/sql-formatter",
  description:
    "Format, beautify, and minify SQL queries instantly. Supports SELECT, INSERT, UPDATE, DELETE, JOINs, subqueries, and more.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function SqlFormatterPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SqlFormatterTool />
    </>
  );
}
