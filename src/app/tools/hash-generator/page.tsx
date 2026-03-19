import type { Metadata } from "next";
import HashGeneratorTool from "./HashGeneratorTool";

export const metadata: Metadata = {
  title: "Hash Generator (SHA-256, SHA-512)",
  description:
    "Generate SHA-1, SHA-256, SHA-384, and SHA-512 hashes online. Uses the Web Crypto API for secure, client-side hashing. Free and private.",
  keywords: [
    "SHA-256 generator",
    "SHA-512 hash",
    "hash generator online",
    "SHA-1 hash",
    "crypto hash",
  ],
  alternates: {
    canonical: "/tools/hash-generator",
  },
  openGraph: {
    title: "Hash Generator (SHA-256, SHA-512) - DevBolt",
    description:
      "Generate SHA-1, SHA-256, SHA-384, SHA-512 hashes online. Secure and free.",
    url: "/tools/hash-generator",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Hash Generator (SHA-256, SHA-512)",
  url: "https://devbolt.dev/tools/hash-generator",
  description:
    "Generate SHA-1, SHA-256, SHA-384, and SHA-512 hashes online. Uses the Web Crypto API for secure, client-side hashing.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  isAccessibleForFree: true,
  browserRequirements: "Any modern web browser",
  creator: { "@type": "Organization", name: "DevBolt", url: "https://devbolt.dev" },
};

export default function HashGeneratorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HashGeneratorTool />
    </>
  );
}
