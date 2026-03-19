import type { Metadata } from "next";
import FileHashTool from "./FileHashTool";

export const metadata: Metadata = {
  title: "File Hash Calculator",
  description:
    "Compute MD5, SHA-1, SHA-256, SHA-384, and SHA-512 hashes for any file. Drag and drop to verify file integrity with checksum comparison. Free, private, runs in your browser.",
  keywords: [
    "file hash calculator",
    "file checksum",
    "sha256 file hash",
    "md5 checksum",
    "file integrity checker",
    "sha512 hash file",
    "verify file hash",
    "drag and drop hash",
    "file hash online",
    "checksum verifier",
  ],
  alternates: {
    canonical: "/tools/file-hash",
  },
  openGraph: {
    title: "File Hash Calculator - DevBolt",
    description:
      "Compute MD5, SHA-1, SHA-256, SHA-384, and SHA-512 hashes for any file. Drag and drop to verify file integrity.",
    url: "/tools/file-hash",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "File Hash Calculator",
  url: "https://devbolt.dev/tools/file-hash",
  description:
    "Compute MD5, SHA-1, SHA-256, SHA-384, and SHA-512 hashes for any file. Drag and drop to verify file integrity with checksum comparison. Free, private, runs entirely in your browser.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function FileHashPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <FileHashTool />
    </>
  );
}
