import type { Metadata } from "next";
import UrlEncoderTool from "./UrlEncoderTool";

export const metadata: Metadata = {
  title: "URL Encoder & Decoder",
  description:
    "Encode and decode URLs and URL components online. Supports encodeURIComponent and encodeURI modes. Fast, private, and free — runs entirely in your browser.",
  keywords: [
    "URL encoder",
    "URL decoder",
    "URL encode online",
    "URL decode online",
    "encodeURIComponent",
    "encodeURI",
    "percent encoding",
    "URL escape",
  ],
  alternates: {
    canonical: "/tools/url-encoder",
  },
  openGraph: {
    title: "URL Encoder & Decoder - FreeSolo Tools",
    description:
      "Encode and decode URLs and URL components online. Free, fast, and private.",
    url: "/tools/url-encoder",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "URL Encoder & Decoder",
  url: "https://free-solo-tools.vercel.app/tools/url-encoder",
  description:
    "Encode and decode URLs and URL components online. Supports encodeURIComponent and encodeURI modes. Fast, private, and free.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function UrlEncoderPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <UrlEncoderTool />
    </>
  );
}
