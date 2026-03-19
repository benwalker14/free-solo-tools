import type { Metadata } from "next";
import JwtBuilderTool from "./JwtBuilderTool";

export const metadata: Metadata = {
  title: "JWT Builder & Generator",
  description:
    "Build and sign JSON Web Tokens with custom claims, HMAC (HS256/HS384/HS512), RSA (RS256/RS384/RS512), and ECDSA (ES256/ES384/ES512) algorithms. Visual payload editor with expiration presets. Free online JWT generator — 100% client-side.",
  keywords: [
    "JWT builder",
    "JWT generator",
    "create JWT",
    "JSON Web Token generator",
    "JWT token builder",
    "HS256 JWT",
    "RS256 JWT",
    "ES256 JWT",
    "JWT online",
    "generate JWT token",
    "JWT maker",
    "JWT sign online",
  ],
  alternates: {
    canonical: "/tools/jwt-builder",
  },
  openGraph: {
    title: "JWT Builder & Generator - DevBolt",
    description:
      "Build and sign JSON Web Tokens with HMAC, RSA, and ECDSA algorithms. Visual payload editor. 100% client-side.",
    url: "/tools/jwt-builder",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "JWT Builder & Generator",
  url: "https://devbolt.dev/tools/jwt-builder",
  description:
    "Build and sign JSON Web Tokens with custom claims, HMAC, RSA, and ECDSA algorithms. All signing happens in your browser.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function JwtBuilderPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <JwtBuilderTool />
    </>
  );
}
