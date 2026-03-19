import type { Metadata } from "next";
import JsonToCodeTool from "./JsonToCodeTool";

export const metadata: Metadata = {
  title: "JSON to Code Generator — Go, Python, Java, C#, Dart, Rust, Swift, Kotlin",
  description:
    "Generate typed code from JSON in 8 languages — Go structs, Python dataclasses, Java classes, C# classes, Dart classes, Rust structs, Swift structs, Kotlin data classes. Free online tool, no signup.",
  keywords: [
    "json to code",
    "json to go",
    "json to python",
    "json to java",
    "json to csharp",
    "json to dart",
    "json to rust",
    "json to swift",
    "json to kotlin",
    "json to struct",
    "json to class",
    "json to dataclass",
    "json code generator",
    "quicktype alternative",
    "json to go struct",
    "json to python dataclass",
    "json to java class",
    "json to rust struct",
  ],
  alternates: {
    canonical: "/tools/json-to-code",
  },
  openGraph: {
    title: "JSON to Code Generator - DevBolt",
    description:
      "Generate typed code from JSON in 8 languages — Go, Python, Java, C#, Dart, Rust, Swift, Kotlin.",
    url: "/tools/json-to-code",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "JSON to Code Generator",
  url: "https://devbolt.dev/tools/json-to-code",
  description:
    "Generate typed code from JSON in 8 languages — Go structs, Python dataclasses, Java classes, C# classes, Dart classes, Rust structs, Swift Codable structs, Kotlin data classes.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function JsonToCodePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <JsonToCodeTool />
    </>
  );
}
