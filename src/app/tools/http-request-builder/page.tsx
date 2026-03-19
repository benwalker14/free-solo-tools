import type { Metadata } from "next";
import HttpRequestBuilderTool from "./HttpRequestBuilderTool";

export const metadata: Metadata = {
  title: "HTTP Request Builder",
  description:
    "Build HTTP requests visually and generate code in cURL, JavaScript, Python, Go, Rust, and PHP. Set method, URL, headers, query params, auth, and body — no coding required. Free online tool.",
  keywords: [
    "http request builder",
    "api request builder",
    "rest api tester",
    "curl generator",
    "http client online",
    "postman alternative",
    "reqbin alternative",
    "build http request",
    "api request generator",
    "http request to code",
  ],
  alternates: {
    canonical: "/tools/http-request-builder",
  },
  openGraph: {
    title: "HTTP Request Builder - DevBolt",
    description:
      "Build HTTP requests visually and generate code in cURL, JavaScript, Python, Go, Rust, and PHP.",
    url: "/tools/http-request-builder",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "HTTP Request Builder",
  url: "https://devbolt.dev/tools/http-request-builder",
  description:
    "Build HTTP requests visually and generate code in cURL, JavaScript, Python, Go, Rust, and PHP. Set method, URL, headers, query params, auth, and body.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  isAccessibleForFree: true,
  browserRequirements: "Any modern web browser",
  creator: { "@type": "Organization", name: "DevBolt", url: "https://devbolt.dev" },
};

export default function HttpRequestBuilderPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HttpRequestBuilderTool />
    </>
  );
}
