import type { Metadata } from "next";
import CspBuilderTool from "./CspBuilderTool";

export const metadata: Metadata = {
  title: "CSP Header Builder",
  description:
    "Build Content Security Policy headers visually with framework presets for Next.js, WordPress, React, and more. Security analysis, multi-format output (Nginx, Apache, Vercel, Netlify). Free online tool — no signup required.",
  keywords: [
    "csp header builder",
    "content security policy generator",
    "csp generator",
    "csp builder",
    "content security policy builder",
    "csp header generator",
    "security headers",
    "csp directives",
    "csp policy generator",
    "csp online tool",
  ],
  alternates: {
    canonical: "/tools/csp-builder",
  },
  openGraph: {
    title: "CSP Header Builder - DevBolt",
    description:
      "Build Content Security Policy headers visually with framework presets and security analysis. Free, client-side, no signup.",
    url: "/tools/csp-builder",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "CSP Header Builder",
  url: "https://devbolt.dev/tools/csp-builder",
  description:
    "Build Content Security Policy headers visually with framework presets for Next.js, WordPress, React, and more. Security analysis and multi-format output.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function CspBuilderPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CspBuilderTool />
    </>
  );
}
