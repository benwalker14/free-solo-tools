import type { Metadata } from "next";
import SecurityHeadersTool from "./SecurityHeadersTool";

export const metadata: Metadata = {
  title: "Security Headers Generator",
  description:
    "Generate HTTP security headers for Nginx, Apache, Vercel, Netlify, and Cloudflare. Visual builder with presets, security scoring, and multi-format output. Free online tool — no signup required.",
  keywords: [
    "security headers generator",
    "http security headers",
    "security headers checker",
    "hsts header generator",
    "x-frame-options generator",
    "content security policy",
    "referrer policy generator",
    "permissions policy generator",
    "security headers nginx",
    "security headers apache",
  ],
  alternates: {
    canonical: "/tools/security-headers",
  },
  openGraph: {
    title: "Security Headers Generator - DevBolt",
    description:
      "Generate HTTP security headers visually with presets, security scoring, and multi-format output. Free, client-side, no signup.",
    url: "/tools/security-headers",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Security Headers Generator",
  url: "https://devbolt.dev/tools/security-headers",
  description:
    "Generate HTTP security headers for Nginx, Apache, Vercel, Netlify, and Cloudflare. Visual builder with presets and security scoring.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function SecurityHeadersPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SecurityHeadersTool />
    </>
  );
}
