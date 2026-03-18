import type { Metadata } from "next";
import QrCodeTool from "./QrCodeTool";

export const metadata: Metadata = {
  title: "QR Code Generator",
  description:
    "Generate QR codes from text, URLs, or any data. Customize colors, size, and error correction level. Download as PNG. Free online QR code generator — no signup required.",
  keywords: [
    "QR code generator",
    "QR code maker",
    "create QR code",
    "QR code from URL",
    "QR code from text",
    "free QR code generator",
  ],
  alternates: {
    canonical: "/tools/qr-code",
  },
  openGraph: {
    title: "QR Code Generator - FreeSolo Tools",
    description:
      "Generate customizable QR codes from text or URLs. Download as PNG. Free online tool.",
    url: "/tools/qr-code",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "QR Code Generator",
  url: "https://free-solo-tools.vercel.app/tools/qr-code",
  description:
    "Generate QR codes from text, URLs, or any data. Customize colors, size, and error correction level. Download as PNG.",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function QrCodePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <QrCodeTool />
    </>
  );
}
