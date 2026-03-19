import type { Metadata } from "next";
import ImageCompressorTool from "./ImageCompressorTool";

export const metadata: Metadata = {
  title: "Image Compressor",
  description:
    "Compress and resize images online for free. Reduce file size with adjustable quality, convert between JPEG, WebP, and PNG formats. Runs entirely in your browser — nothing is uploaded.",
  keywords: [
    "image compressor",
    "compress image online",
    "reduce image size",
    "image optimizer",
    "resize image",
    "JPEG compressor",
    "WebP converter",
    "image quality reducer",
    "compress PNG",
  ],
  alternates: {
    canonical: "/tools/image-compressor",
  },
  openGraph: {
    title: "Image Compressor - DevBolt",
    description:
      "Compress and resize images online. Adjust quality, convert formats, and reduce file size. Free, fast, and private.",
    url: "/tools/image-compressor",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Image Compressor",
  url: "https://devbolt.dev/tools/image-compressor",
  description:
    "Compress and resize images online. Supports JPEG, WebP, and PNG with adjustable quality. Free and private — runs in your browser.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  isAccessibleForFree: true,
  browserRequirements: "Any modern web browser",
  creator: { "@type": "Organization", name: "DevBolt", url: "https://devbolt.dev" },
};

export default function ImageCompressorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ImageCompressorTool />
    </>
  );
}
