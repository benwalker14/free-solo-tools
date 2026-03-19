import type { Metadata } from "next";
import RegexTesterTool from "./RegexTesterTool";

export const metadata: Metadata = {
  title: "Regex Tester",
  description:
    "Test and debug regular expressions in real time. See matches highlighted, capture groups, and match details. Free online regex tool — no signup required.",
  keywords: [
    "regex tester",
    "regex debugger",
    "regular expression tester",
    "regex online",
    "test regex",
  ],
  alternates: {
    canonical: "/tools/regex-tester",
  },
  openGraph: {
    title: "Regex Tester - DevBolt",
    description:
      "Test and debug regular expressions in real time with match highlighting.",
    url: "/tools/regex-tester",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Regex Tester",
  url: "https://devbolt.dev/tools/regex-tester",
  description:
    "Test and debug regular expressions in real time. See matches highlighted, capture groups, and match details.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  isAccessibleForFree: true,
  browserRequirements: "Any modern web browser",
  creator: { "@type": "Organization", name: "DevBolt", url: "https://devbolt.dev" },
};

export default function RegexTesterPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <RegexTesterTool />
    </>
  );
}
