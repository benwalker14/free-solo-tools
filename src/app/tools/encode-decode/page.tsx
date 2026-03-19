import type { Metadata } from "next";
import EncodeDecodeTool from "./EncodeDecodeTool";

export const metadata: Metadata = {
  title: "Encode / Decode Multi-Tool",
  description:
    "Encode and decode text using Base64, Base32, Hex, Binary, URL encoding, and HTML entities — all in one tool. Fast, private, and free — runs entirely in your browser.",
  keywords: [
    "encode decode online",
    "base64 encoder",
    "base32 encoder",
    "hex encoder",
    "binary converter",
    "url encoder decoder",
    "html entity encoder",
    "text encoder online",
    "encoding tool",
    "multi encoder decoder",
  ],
  alternates: {
    canonical: "/tools/encode-decode",
  },
  openGraph: {
    title: "Encode / Decode Multi-Tool - DevBolt",
    description:
      "Base64, Base32, Hex, Binary, URL, and HTML encoding and decoding in one tool. Free and private.",
    url: "/tools/encode-decode",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Encode / Decode Multi-Tool",
  url: "https://devbolt.dev/tools/encode-decode",
  description:
    "Encode and decode text using Base64, Base32, Hex, Binary, URL encoding, and HTML entities. All-in-one encoding tool — fast, private, and free.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  isAccessibleForFree: true,
  browserRequirements: "Any modern web browser",
  creator: { "@type": "Organization", name: "DevBolt", url: "https://devbolt.dev" },
};

export default function EncodeDecodePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <EncodeDecodeTool />
    </>
  );
}
