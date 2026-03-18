import type { Metadata } from "next";
import PasswordGeneratorTool from "./PasswordGeneratorTool";

export const metadata: Metadata = {
  title: "Password Generator",
  description:
    "Generate strong, cryptographically secure random passwords. Customize length, character sets, and generate in bulk. Free online password tool — no signup required.",
  keywords: [
    "password generator",
    "random password",
    "strong password generator",
    "secure password",
    "password creator online",
    "bulk password generator",
  ],
  alternates: {
    canonical: "/tools/password-generator",
  },
  openGraph: {
    title: "Password Generator - FreeSolo Tools",
    description:
      "Generate strong, cryptographically secure random passwords with customizable options.",
    url: "/tools/password-generator",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Password Generator",
  url: "https://free-solo-tools.vercel.app/tools/password-generator",
  description:
    "Generate strong, cryptographically secure random passwords with customizable length and character sets.",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function PasswordGeneratorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PasswordGeneratorTool />
    </>
  );
}
