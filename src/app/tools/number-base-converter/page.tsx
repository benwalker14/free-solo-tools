import type { Metadata } from "next";
import NumberBaseConverterTool from "./NumberBaseConverterTool";

export const metadata: Metadata = {
  title: "Number Base Converter",
  description:
    "Convert numbers between binary, octal, decimal, and hexadecimal instantly. Supports BigInt for arbitrarily large numbers. Free online tool — no signup required.",
  keywords: [
    "number base converter",
    "binary converter",
    "hex converter",
    "octal converter",
    "decimal to binary",
    "decimal to hex",
    "binary to decimal",
    "hex to decimal",
    "radix converter",
    "base converter",
  ],
  alternates: {
    canonical: "/tools/number-base-converter",
  },
  openGraph: {
    title: "Number Base Converter - FreeSolo Tools",
    description:
      "Convert numbers between binary, octal, decimal, and hexadecimal instantly.",
    url: "/tools/number-base-converter",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Number Base Converter",
  url: "https://free-solo-tools.vercel.app/tools/number-base-converter",
  description:
    "Convert numbers between binary, octal, decimal, and hexadecimal. Supports arbitrarily large numbers with BigInt.",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function NumberBaseConverterPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <NumberBaseConverterTool />
    </>
  );
}
