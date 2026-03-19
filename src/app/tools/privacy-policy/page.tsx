import type { Metadata } from "next";
import PrivacyPolicyTool from "./PrivacyPolicyTool";

export const metadata: Metadata = {
  title: "Privacy Policy Generator",
  description:
    "Generate a free, customized privacy policy for your website or app. Includes GDPR, CCPA, cookies, analytics, and payment sections. Download as text, Markdown, or HTML — no signup required.",
  keywords: [
    "privacy policy generator",
    "privacy policy template",
    "free privacy policy generator",
    "privacy policy for website",
    "gdpr privacy policy",
    "ccpa privacy policy",
    "privacy policy generator free",
    "website privacy policy",
    "app privacy policy generator",
    "generate privacy policy online",
  ],
  alternates: {
    canonical: "/tools/privacy-policy",
  },
  openGraph: {
    title: "Privacy Policy Generator - DevBolt",
    description:
      "Generate a customized privacy policy for your website or app with GDPR, CCPA, and cookie compliance.",
    url: "/tools/privacy-policy",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Privacy Policy Generator",
  url: "https://devbolt.dev/tools/privacy-policy",
  description:
    "Generate a free, customized privacy policy for your website or app. Includes GDPR, CCPA, cookies, analytics, and payment sections.",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  isAccessibleForFree: true,
  browserRequirements: "Any modern web browser",
  creator: { "@type": "Organization", name: "DevBolt", url: "https://devbolt.dev" },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PrivacyPolicyTool />
    </>
  );
}
