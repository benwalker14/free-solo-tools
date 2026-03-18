import type { Metadata } from "next";
import JsonFormatterTool from "./JsonFormatterTool";

export const metadata: Metadata = {
  title: "JSON Formatter & Validator",
  description:
    "Format, validate, and minify JSON data instantly. Syntax highlighting, error detection, and pretty-printing. Free online JSON tool — no signup required.",
  keywords: [
    "JSON formatter",
    "JSON validator",
    "JSON minifier",
    "JSON pretty print",
    "format JSON online",
  ],
  alternates: {
    canonical: "/tools/json-formatter",
  },
  openGraph: {
    title: "JSON Formatter & Validator - DevBolt",
    description:
      "Format, validate, and minify JSON data instantly. Free online tool.",
    url: "/tools/json-formatter",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "JSON Formatter & Validator",
  url: "https://devbolt.dev/tools/json-formatter",
  description:
    "Format, validate, and minify JSON data instantly. Syntax highlighting, error detection, and pretty-printing.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function JsonFormatterPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <JsonFormatterTool />
    </>
  );
}
