import type { Metadata } from "next";
import CompressionTesterTool from "./CompressionTesterTool";

export const metadata: Metadata = {
  title: "Brotli / Gzip Compression Tester",
  description:
    "Test text compression ratios with Brotli, Gzip, and Deflate algorithms side by side. Compare sizes, ratios, and speeds. Free online tool — no signup required.",
  keywords: [
    "brotli compression tester",
    "gzip compression tester",
    "compression ratio calculator",
    "brotli vs gzip",
    "text compression test",
    "gzip compression ratio",
    "brotli compression ratio",
    "deflate compression",
    "web compression test",
    "compression comparison",
  ],
  alternates: {
    canonical: "/tools/compression-tester",
  },
  openGraph: {
    title: "Brotli / Gzip Compression Tester - DevBolt",
    description:
      "Test text compression ratios with Brotli, Gzip, and Deflate side by side. Compare sizes, ratios, and speeds.",
    url: "/tools/compression-tester",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Brotli / Gzip Compression Tester",
  url: "https://devbolt.dev/tools/compression-tester",
  description:
    "Test and compare Brotli, Gzip, and Deflate compression ratios for text content. Client-side compression testing tool.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function CompressionTesterPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CompressionTesterTool />
    </>
  );
}
