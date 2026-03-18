import type { Metadata } from "next";
import XmlFormatterTool from "./XmlFormatterTool";

export const metadata: Metadata = {
  title: "XML Formatter & Validator",
  description:
    "Format, beautify, validate, and minify XML documents instantly. Supports comments, CDATA, processing instructions, and namespaces. Free online XML formatter — no signup required.",
  keywords: [
    "XML formatter",
    "XML beautifier",
    "XML validator",
    "format XML online",
    "XML minifier",
    "XML pretty print",
    "XML parser",
  ],
  alternates: {
    canonical: "/tools/xml-formatter",
  },
  openGraph: {
    title: "XML Formatter & Validator - DevBolt",
    description:
      "Format, beautify, validate, and minify XML documents instantly. Free online tool.",
    url: "/tools/xml-formatter",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "XML Formatter & Validator",
  url: "https://devbolt.dev/tools/xml-formatter",
  description:
    "Format, beautify, validate, and minify XML documents instantly. Supports comments, CDATA, processing instructions, and namespaces.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function XmlFormatterPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <XmlFormatterTool />
    </>
  );
}
