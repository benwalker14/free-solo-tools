import type { Metadata } from "next";
import JsonYamlTool from "./JsonYamlTool";

export const metadata: Metadata = {
  title: "JSON ↔ YAML Converter",
  description:
    "Convert JSON to YAML and YAML to JSON instantly. Perfect for Kubernetes configs, Docker Compose, GitHub Actions, and CI/CD pipelines. Free online tool — no signup required.",
  keywords: [
    "json to yaml",
    "yaml to json",
    "json yaml converter",
    "yaml converter",
    "json converter",
    "kubernetes yaml",
    "docker compose yaml",
    "yaml to json online",
    "json to yaml online",
    "yaml parser",
  ],
  alternates: {
    canonical: "/tools/json-yaml",
  },
  openGraph: {
    title: "JSON ↔ YAML Converter - DevBolt",
    description:
      "Convert between JSON and YAML formats instantly. Perfect for Kubernetes and CI/CD configs.",
    url: "/tools/json-yaml",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "JSON ↔ YAML Converter",
  url: "https://devbolt.dev/tools/json-yaml",
  description:
    "Convert JSON to YAML and YAML to JSON. Perfect for Kubernetes configs, Docker Compose, and CI/CD pipelines.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  isAccessibleForFree: true,
  browserRequirements: "Any modern web browser",
  creator: { "@type": "Organization", name: "DevBolt", url: "https://devbolt.dev" },
};

export default function JsonYamlPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <JsonYamlTool />
    </>
  );
}
