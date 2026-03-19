import type { Metadata } from "next";
import DockerfileValidatorTool from "./DockerfileValidatorTool";

export const metadata: Metadata = {
  title: "Dockerfile Validator & Linter",
  description:
    "Validate and lint Dockerfiles instantly. Checks syntax, security issues, best practices, layer optimization, and multi-stage build references. Free online tool — no signup required.",
  keywords: [
    "Dockerfile validator",
    "Dockerfile linter",
    "validate Dockerfile",
    "Dockerfile syntax checker",
    "Dockerfile best practices",
    "Docker lint",
    "Dockerfile checker online",
    "Dockerfile security check",
    "Docker image validator",
  ],
  alternates: {
    canonical: "/tools/dockerfile-validator",
  },
  openGraph: {
    title: "Dockerfile Validator & Linter - DevBolt",
    description:
      "Validate Dockerfiles for syntax errors, security issues, and best practices. Free online tool.",
    url: "/tools/dockerfile-validator",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Dockerfile Validator & Linter",
  url: "https://devbolt.dev/tools/dockerfile-validator",
  description:
    "Validate and lint Dockerfiles instantly. Checks syntax, security issues, best practices, layer optimization, and multi-stage build references.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  isAccessibleForFree: true,
  browserRequirements: "Any modern web browser",
  creator: { "@type": "Organization", name: "DevBolt", url: "https://devbolt.dev" },
};

export default function DockerfileValidatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DockerfileValidatorTool />
    </>
  );
}
