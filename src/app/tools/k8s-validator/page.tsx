import type { Metadata } from "next";
import KubernetesValidatorTool from "./KubernetesValidatorTool";

export const metadata: Metadata = {
  title: "Kubernetes YAML Validator",
  description:
    "Validate Kubernetes YAML manifests instantly. Checks syntax, required fields, best practices, resource limits, security context, probes, and selector matching. Supports 20+ resource types. Free online tool — no signup required.",
  keywords: [
    "Kubernetes YAML validator",
    "K8s manifest validator",
    "Kubernetes lint",
    "validate Kubernetes YAML",
    "K8s YAML checker",
    "Kubernetes manifest linter",
    "Kubernetes deployment validator",
    "K8s config validator",
    "Kubernetes best practices checker",
  ],
  alternates: {
    canonical: "/tools/k8s-validator",
  },
  openGraph: {
    title: "Kubernetes YAML Validator - DevBolt",
    description:
      "Validate Kubernetes manifests for syntax, required fields, best practices, and security. Free online tool.",
    url: "/tools/k8s-validator",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Kubernetes YAML Validator",
  url: "https://devbolt.dev/tools/k8s-validator",
  description:
    "Validate Kubernetes YAML manifests instantly. Checks syntax, required fields, best practices, resource limits, security context, probes, and selector matching.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  isAccessibleForFree: true,
  browserRequirements: "Any modern web browser",
  creator: { "@type": "Organization", name: "DevBolt", url: "https://devbolt.dev" },
};

export default function KubernetesValidatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <KubernetesValidatorTool />
    </>
  );
}
