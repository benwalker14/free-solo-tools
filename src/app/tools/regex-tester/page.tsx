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
    title: "Regex Tester - FreeSolo Tools",
    description:
      "Test and debug regular expressions in real time with match highlighting.",
    url: "/tools/regex-tester",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Regex Tester",
  url: "https://free-solo-tools.vercel.app/tools/regex-tester",
  description:
    "Test and debug regular expressions in real time. See matches highlighted, capture groups, and match details.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
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
