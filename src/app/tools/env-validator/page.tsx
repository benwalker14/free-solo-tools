import type { Metadata } from "next";
import EnvValidatorTool from "./EnvValidatorTool";

export const metadata: Metadata = {
  title: ".env File Validator",
  description:
    "Validate .env files for syntax errors, duplicate keys, security risks, and best practices. Export .env.example templates and sanitized copies. Free online tool — no signup required.",
  keywords: [
    "env file validator",
    "dotenv validator",
    "env file checker",
    "env file linter",
    "environment variables validator",
    "env security checker",
    "dotenv syntax checker",
    "env file best practices",
    "env example generator",
    "validate environment variables",
  ],
  alternates: {
    canonical: "/tools/env-validator",
  },
  openGraph: {
    title: ".env File Validator - DevBolt",
    description:
      "Validate .env files for syntax errors, duplicate keys, security risks, and best practices.",
    url: "/tools/env-validator",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: ".env File Validator",
  url: "https://devbolt.dev/tools/env-validator",
  description:
    "Validate .env files for syntax errors, duplicate keys, security risks, and best practices. Export .env.example templates and sanitized copies.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function EnvValidatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <EnvValidatorTool />
    </>
  );
}
