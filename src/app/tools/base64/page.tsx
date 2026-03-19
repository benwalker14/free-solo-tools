import type { Metadata } from "next";
import Base64Tool from "./Base64Tool";

export const metadata: Metadata = {
  title: "Base64 Encoder & Decoder",
  description:
    "Encode and decode Base64 strings online with full Unicode support. Fast, private, and free — runs entirely in your browser.",
  keywords: [
    "Base64 encoder",
    "Base64 decoder",
    "Base64 online",
    "encode Base64",
    "decode Base64",
  ],
  alternates: {
    canonical: "/tools/base64",
  },
  openGraph: {
    title: "Base64 Encoder & Decoder - DevBolt",
    description:
      "Encode and decode Base64 strings online. Free, fast, and private.",
    url: "/tools/base64",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Base64 Encoder & Decoder",
  url: "https://devbolt.dev/tools/base64",
  description:
    "Encode and decode Base64 strings online with full Unicode support. Fast, private, and free.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  isAccessibleForFree: true,
  browserRequirements: "Any modern web browser",
  creator: { "@type": "Organization", name: "DevBolt", url: "https://devbolt.dev" },
};

export default function Base64Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Base64Tool />
    </>
  );
}
