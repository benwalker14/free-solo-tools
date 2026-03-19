import type { Metadata } from "next";
import XpathTesterTool from "./XpathTesterTool";

export const metadata: Metadata = {
  title: "XPath Tester",
  description:
    "Test XPath expressions against XML data with real-time evaluation. Select elements, filter by attributes, and navigate XML structures. Free online XPath tool — no signup required.",
  keywords: [
    "XPath tester",
    "XPath evaluator",
    "XML query",
    "XPath online",
    "XPath expression tester",
    "XML data extraction",
    "test XPath",
    "XPath selector",
    "XML query tool",
    "XPath validator",
  ],
  alternates: {
    canonical: "/tools/xpath-tester",
  },
  openGraph: {
    title: "XPath Tester - DevBolt",
    description:
      "Test XPath expressions against XML data with real-time evaluation. Free online tool.",
    url: "/tools/xpath-tester",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "XPath Tester",
  url: "https://devbolt.dev/tools/xpath-tester",
  description:
    "Test XPath expressions against XML data with real-time evaluation. Select elements, filter by attributes, and navigate XML document structures.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  isAccessibleForFree: true,
  browserRequirements: "Any modern web browser",
  creator: {
    "@type": "Organization",
    name: "DevBolt",
    url: "https://devbolt.dev",
  },
};

export default function XpathTesterPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <XpathTesterTool />
    </>
  );
}
