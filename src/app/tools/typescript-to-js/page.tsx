import type { Metadata } from "next";
import TypescriptToJsTool from "./TypescriptToJsTool";

export const metadata: Metadata = {
  title: "TypeScript to JavaScript Converter",
  description:
    "Convert TypeScript to JavaScript instantly — strip types, interfaces, enums, generics, and access modifiers to get clean JS output. Free online tool — no signup required.",
  keywords: [
    "typescript to javascript",
    "typescript to javascript converter",
    "convert typescript to javascript",
    "ts to js converter",
    "typescript to js online",
    "strip typescript types",
    "remove typescript types",
    "ts to js",
    "typescript compiler online",
    "decompile typescript",
  ],
  alternates: {
    canonical: "/tools/typescript-to-js",
  },
  openGraph: {
    title: "TypeScript to JavaScript Converter - DevBolt",
    description:
      "Convert TypeScript to JavaScript instantly — strip types, interfaces, enums, and generics. Free, client-side, no signup.",
    url: "/tools/typescript-to-js",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "TypeScript to JavaScript Converter",
  url: "https://devbolt.dev/tools/typescript-to-js",
  description:
    "Convert TypeScript to JavaScript by stripping types, interfaces, enums, generics, and access modifiers. Get clean JavaScript output instantly.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function TypescriptToJsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TypescriptToJsTool />
    </>
  );
}
