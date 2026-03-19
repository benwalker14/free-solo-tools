import type { Metadata } from "next";
import OgPreviewTool from "./OgPreviewTool";

export const metadata: Metadata = {
  title: "Open Graph Preview & Debugger",
  description:
    "Preview and debug Open Graph, Twitter Card, and SEO meta tags. See how your links look on Facebook, Twitter/X, LinkedIn, and Slack. Free online tool — no signup required.",
  keywords: [
    "open graph preview",
    "og tag tester",
    "open graph debugger",
    "twitter card preview",
    "social media preview",
    "og meta tags checker",
    "facebook link preview",
    "linkedin preview tool",
    "meta tag debugger",
    "social share preview",
  ],
  alternates: {
    canonical: "/tools/og-preview",
  },
  openGraph: {
    title: "Open Graph Preview & Debugger - DevBolt",
    description:
      "Preview and debug Open Graph, Twitter Card, and SEO meta tags. See how your links look on social media.",
    url: "/tools/og-preview",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Open Graph Preview & Debugger",
  url: "https://devbolt.dev/tools/og-preview",
  description:
    "Preview and debug Open Graph, Twitter Card, and SEO meta tags. See how your links look on Facebook, Twitter/X, LinkedIn, and Slack.",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  isAccessibleForFree: true,
  browserRequirements: "Any modern web browser",
  creator: { "@type": "Organization", name: "DevBolt", url: "https://devbolt.dev" },
};

export default function OgPreviewPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <OgPreviewTool />
    </>
  );
}
