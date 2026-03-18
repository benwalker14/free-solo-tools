import type { Metadata } from "next";
import JwtDecoderTool from "./JwtDecoderTool";

export const metadata: Metadata = {
  title: "JWT Decoder",
  description:
    "Decode and inspect JSON Web Tokens instantly. View header, payload, and expiration status. Free online JWT tool — no signup required.",
  keywords: [
    "JWT decoder",
    "JWT parser",
    "JSON Web Token",
    "decode JWT online",
    "JWT debugger",
  ],
  alternates: {
    canonical: "/tools/jwt-decoder",
  },
  openGraph: {
    title: "JWT Decoder - DevBolt",
    description:
      "Decode and inspect JSON Web Tokens instantly. View header, payload, and expiration.",
    url: "/tools/jwt-decoder",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "JWT Decoder",
  url: "https://devbolt.dev/tools/jwt-decoder",
  description:
    "Decode and inspect JSON Web Tokens instantly. View header, payload, and expiration status.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function JwtDecoderPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <JwtDecoderTool />
    </>
  );
}
