import type { Metadata } from "next";
import ImageBase64Tool from "./ImageBase64Tool";

export const metadata: Metadata = {
  title: "Image to Base64 Converter",
  description:
    "Convert images to Base64 data URIs or decode Base64 strings back to images. Supports PNG, JPG, GIF, SVG, WebP, and more. Free online tool — runs entirely in your browser.",
  keywords: [
    "image to Base64",
    "Base64 to image",
    "image Base64 converter",
    "Base64 image encoder",
    "data URI generator",
    "Base64 encode image",
    "image to data URI",
    "convert image to Base64 online",
    "Base64 image decoder",
  ],
  alternates: {
    canonical: "/tools/image-base64",
  },
  openGraph: {
    title: "Image to Base64 Converter - DevBolt",
    description:
      "Convert images to Base64 data URIs or decode Base64 strings back to images. Free, fast, and private.",
    url: "/tools/image-base64",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Image to Base64 Converter",
  url: "https://devbolt.dev/tools/image-base64",
  description:
    "Convert images to Base64 data URIs or decode Base64 strings back to images. Supports PNG, JPG, GIF, SVG, WebP. Free and private.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function ImageBase64Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ImageBase64Tool />
    </>
  );
}
