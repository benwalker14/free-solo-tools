import type { Metadata } from "next";
import CurlConverterTool from "./CurlConverterTool";

export const metadata: Metadata = {
  title: "cURL to Code Converter",
  description:
    "Convert cURL commands to JavaScript fetch, Python requests, Go, PHP, Ruby, and Java code instantly. Paste from browser DevTools or API docs. Free online tool — no signup required.",
  keywords: [
    "curl to code",
    "curl converter",
    "curl to python",
    "curl to javascript",
    "curl to fetch",
    "curl to go",
    "curl to php",
    "curl to java",
    "curl to ruby",
    "curl command converter",
  ],
  alternates: {
    canonical: "/tools/curl-converter",
  },
  openGraph: {
    title: "cURL to Code Converter - DevBolt",
    description:
      "Convert cURL commands to JavaScript, Python, Go, PHP, Ruby, and Java code instantly.",
    url: "/tools/curl-converter",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "cURL to Code Converter",
  url: "https://devbolt.dev/tools/curl-converter",
  description:
    "Convert cURL commands to JavaScript fetch, Python requests, Go, PHP, Ruby, and Java code instantly. Paste from browser DevTools or API docs.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  isAccessibleForFree: true,
  browserRequirements: "Any modern web browser",
  creator: { "@type": "Organization", name: "DevBolt", url: "https://devbolt.dev" },
};

export default function CurlConverterPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CurlConverterTool />
    </>
  );
}
