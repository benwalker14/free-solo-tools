import type { Metadata } from "next";
import GitHubActionsValidatorTool from "./GitHubActionsValidatorTool";

export const metadata: Metadata = {
  title: "GitHub Actions YAML Validator",
  description:
    "Validate GitHub Actions workflow YAML files instantly. Checks syntax, triggers, job structure, step configuration, needs dependencies, expressions, and common misconfigurations. Free online tool — no signup required.",
  keywords: [
    "GitHub Actions validator",
    "GitHub Actions YAML validator",
    "GitHub workflow validator",
    "validate GitHub Actions",
    "GitHub Actions linter",
    "GitHub Actions syntax checker",
    "CI/CD validator",
    "workflow YAML checker",
    "GitHub Actions checker online",
  ],
  alternates: {
    canonical: "/tools/github-actions-validator",
  },
  openGraph: {
    title: "GitHub Actions YAML Validator - DevBolt",
    description:
      "Validate GitHub Actions workflows for syntax, triggers, jobs, steps, and dependencies. Free online tool.",
    url: "/tools/github-actions-validator",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "GitHub Actions YAML Validator",
  url: "https://devbolt.dev/tools/github-actions-validator",
  description:
    "Validate GitHub Actions workflow YAML files instantly. Checks syntax, triggers, job structure, step configuration, needs dependencies, expressions, and common misconfigurations.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  isAccessibleForFree: true,
  browserRequirements: "Any modern web browser",
  creator: { "@type": "Organization", name: "DevBolt", url: "https://devbolt.dev" },
};

export default function GitHubActionsValidatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GitHubActionsValidatorTool />
    </>
  );
}
