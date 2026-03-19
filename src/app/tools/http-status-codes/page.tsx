import type { Metadata } from "next";
import HttpStatusCodesTool from "./HttpStatusCodesTool";

export const metadata: Metadata = {
  title: "HTTP Status Code Reference",
  description:
    "Complete HTTP status code reference. Look up 1xx, 2xx, 3xx, 4xx, and 5xx codes with detailed explanations, use cases, and troubleshooting tips. Free developer tool — no signup required.",
  keywords: [
    "HTTP status codes",
    "HTTP status code reference",
    "HTTP error codes",
    "HTTP response codes",
    "404 not found",
    "500 internal server error",
    "301 redirect",
    "200 OK",
    "HTTP status code list",
    "REST API status codes",
  ],
  alternates: {
    canonical: "/tools/http-status-codes",
  },
  openGraph: {
    title: "HTTP Status Code Reference - DevBolt",
    description:
      "Complete reference for all HTTP status codes with detailed explanations and use cases.",
    url: "/tools/http-status-codes",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "HTTP Status Code Reference",
  url: "https://devbolt.dev/tools/http-status-codes",
  description:
    "Complete HTTP status code reference with detailed explanations for 1xx informational, 2xx success, 3xx redirection, 4xx client error, and 5xx server error codes.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function HttpStatusCodesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HttpStatusCodesTool />
    </>
  );
}
