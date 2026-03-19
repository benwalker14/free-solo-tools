import type { Metadata } from "next";
import JsPlaygroundTool from "./JsPlaygroundTool";

export const metadata: Metadata = {
  title: "JavaScript / TypeScript Playground",
  description:
    "Run JavaScript and TypeScript code directly in your browser. Instant execution, console output, and code examples. Free online JS playground — no signup required.",
  keywords: [
    "javascript playground",
    "typescript playground",
    "run javascript online",
    "js playground",
    "code playground",
    "javascript executor",
    "run js code online",
    "typescript online compiler",
  ],
  alternates: {
    canonical: "/tools/js-playground",
  },
  openGraph: {
    title: "JavaScript / TypeScript Playground - DevBolt",
    description:
      "Run JavaScript and TypeScript code directly in your browser. Free online playground with instant execution.",
    url: "/tools/js-playground",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "JavaScript / TypeScript Playground",
  url: "https://devbolt.dev/tools/js-playground",
  description:
    "Run JavaScript and TypeScript code directly in your browser. Instant execution, console output, and code examples.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function JsPlaygroundPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <JsPlaygroundTool />
    </>
  );
}
