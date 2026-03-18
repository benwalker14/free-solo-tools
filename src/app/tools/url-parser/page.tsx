import type { Metadata } from "next";
import UrlParserTool from "./UrlParserTool";

export const metadata: Metadata = {
  title: "URL Parser",
  description:
    "Parse and inspect URL components instantly. View protocol, host, path, query parameters, and hash. Free online URL parser — no signup required.",
  keywords: [
    "URL parser",
    "URL decoder",
    "parse URL online",
    "URL components",
    "query string parser",
  ],
  alternates: {
    canonical: "/tools/url-parser",
  },
  openGraph: {
    title: "URL Parser - FreeSolo Tools",
    description:
      "Parse and inspect URL components. View protocol, host, path, query parameters, and hash.",
    url: "/tools/url-parser",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "URL Parser",
  url: "https://free-solo-tools.vercel.app/tools/url-parser",
  description:
    "Parse and inspect URL components instantly. View protocol, host, path, query parameters, and hash.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function UrlParserPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <UrlParserTool />
    </>
  );
}
