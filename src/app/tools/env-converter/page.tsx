import type { Metadata } from "next";
import EnvConverterTool from "./EnvConverterTool";

export const metadata: Metadata = {
  title: ".env to Docker/Kubernetes Converter — ConfigMap, Secret, Compose",
  description:
    "Convert .env files to Docker Compose environment blocks, Kubernetes ConfigMaps, Kubernetes Secrets (base64 and stringData), and docker run flags. Sensitive key detection included. Free online tool, fully client-side.",
  keywords: [
    "env to docker compose",
    "env to kubernetes configmap",
    "env to kubernetes secret",
    "convert env file to docker",
    "env to k8s configmap",
    "env to k8s secret",
    "dotenv to docker compose",
    "env file to yaml",
    "env to docker run",
    "convert environment variables",
  ],
  alternates: {
    canonical: "/tools/env-converter",
  },
  openGraph: {
    title: ".env to Docker/Kubernetes Converter - DevBolt",
    description:
      "Convert .env files to Docker Compose, Kubernetes ConfigMap/Secret, and docker run flags. Free, client-side, no signup.",
    url: "/tools/env-converter",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: ".env to Docker/Kubernetes Converter",
  url: "https://devbolt.dev/tools/env-converter",
  description:
    "Convert .env files to Docker Compose environment blocks, Kubernetes ConfigMaps, Kubernetes Secrets, and docker run flags. Detects sensitive keys automatically. Free online tool.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  isAccessibleForFree: true,
  browserRequirements: "Any modern web browser",
  creator: {
    "@type": "Organization",
    name: "DevBolt",
    url: "https://devbolt.dev",
  },
};

export default function EnvConverterPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <EnvConverterTool />
    </>
  );
}
