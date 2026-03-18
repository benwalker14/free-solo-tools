import type { Metadata } from "next";
import TextBinaryTool from "./TextBinaryTool";

export const metadata: Metadata = {
  title: "Text to Binary Converter",
  description:
    "Convert text to binary, hexadecimal, octal, or decimal — and decode back to text. Full Unicode/UTF-8 support with byte breakdown table. Free online tool — no signup required.",
  keywords: [
    "text to binary converter",
    "binary to text converter",
    "text to hex converter",
    "hex to text converter",
    "ascii to binary",
    "binary translator",
    "text to octal converter",
    "binary converter online",
    "utf-8 encoder",
  ],
  alternates: {
    canonical: "/tools/text-binary",
  },
  openGraph: {
    title: "Text to Binary Converter - DevBolt",
    description:
      "Convert text to binary, hex, octal, or decimal and back. Full Unicode support with byte breakdown.",
    url: "/tools/text-binary",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Text to Binary Converter",
  url: "https://devbolt.dev/tools/text-binary",
  description:
    "Convert text to binary, hexadecimal, octal, or decimal representations and decode back to text. Full Unicode/UTF-8 support.",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function TextBinaryPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TextBinaryTool />
    </>
  );
}
