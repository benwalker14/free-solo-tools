import type { Metadata } from "next";
import YamlFormatterTool from "./YamlFormatterTool";

export const metadata: Metadata = {
  title: "YAML Validator & Formatter",
  description:
    "Validate, format, beautify, and minify YAML documents instantly. Perfect for Kubernetes manifests, Docker Compose, GitHub Actions, and CI/CD configs. Free online YAML formatter — no signup required.",
  keywords: [
    "YAML validator",
    "YAML formatter",
    "YAML beautifier",
    "format YAML online",
    "YAML linter",
    "YAML minifier",
    "Kubernetes YAML validator",
    "Docker Compose validator",
    "YAML syntax checker",
  ],
  alternates: {
    canonical: "/tools/yaml-formatter",
  },
  openGraph: {
    title: "YAML Validator & Formatter - DevBolt",
    description:
      "Validate, format, beautify, and minify YAML documents instantly. Free online tool.",
    url: "/tools/yaml-formatter",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "YAML Validator & Formatter",
  url: "https://devbolt.dev/tools/yaml-formatter",
  description:
    "Validate, format, beautify, and minify YAML documents instantly. Perfect for Kubernetes manifests, Docker Compose, GitHub Actions, and CI/CD configs.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  isAccessibleForFree: true,
  browserRequirements: "Any modern web browser",
  creator: { "@type": "Organization", name: "DevBolt", url: "https://devbolt.dev" },
};

export default function YamlFormatterPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <YamlFormatterTool />
    </>
  );
}
