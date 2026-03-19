import type { Metadata } from "next";
import DockerComposeTool from "./DockerComposeTool";

export const metadata: Metadata = {
  title: "Docker Compose Validator & Formatter",
  description:
    "Validate and format Docker Compose files instantly. Checks YAML syntax, service structure, network and volume references, depends_on chains, and common misconfigurations. Free online tool — no signup required.",
  keywords: [
    "Docker Compose validator",
    "docker-compose.yml validator",
    "Docker Compose linter",
    "validate Docker Compose",
    "Docker Compose formatter",
    "Docker Compose syntax checker",
    "docker-compose checker",
    "Docker Compose online",
    "compose file validator",
  ],
  alternates: {
    canonical: "/tools/docker-compose",
  },
  openGraph: {
    title: "Docker Compose Validator & Formatter - DevBolt",
    description:
      "Validate and format Docker Compose files instantly. Checks syntax, structure, and references. Free online tool.",
    url: "/tools/docker-compose",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Docker Compose Validator & Formatter",
  url: "https://devbolt.dev/tools/docker-compose",
  description:
    "Validate and format Docker Compose files instantly. Checks YAML syntax, service structure, network and volume references, depends_on chains, and common misconfigurations.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  isAccessibleForFree: true,
  browserRequirements: "Any modern web browser",
  creator: { "@type": "Organization", name: "DevBolt", url: "https://devbolt.dev" },
};

export default function DockerComposePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DockerComposeTool />
    </>
  );
}
