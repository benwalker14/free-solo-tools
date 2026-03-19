import type { Metadata } from "next";
import TomlConverterTool from "./TomlConverterTool";

export const metadata: Metadata = {
  title: "TOML ↔ JSON/YAML Converter",
  description:
    "Convert between TOML, JSON, and YAML formats instantly. Perfect for Cargo.toml, pyproject.toml, Hugo configs, and more. Free online tool — no signup required.",
  keywords: [
    "toml to json",
    "json to toml",
    "toml to yaml",
    "yaml to toml",
    "toml converter",
    "toml parser",
    "cargo toml",
    "pyproject toml",
    "toml online",
    "toml json yaml converter",
  ],
  alternates: {
    canonical: "/tools/toml-converter",
  },
  openGraph: {
    title: "TOML ↔ JSON/YAML Converter - DevBolt",
    description:
      "Convert between TOML, JSON, and YAML formats instantly. Perfect for Cargo.toml and pyproject.toml.",
    url: "/tools/toml-converter",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "TOML ↔ JSON/YAML Converter",
  url: "https://devbolt.dev/tools/toml-converter",
  description:
    "Convert between TOML, JSON, and YAML formats. Perfect for Cargo.toml, pyproject.toml, and configuration files.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  isAccessibleForFree: true,
  browserRequirements: "Any modern web browser",
  creator: { "@type": "Organization", name: "DevBolt", url: "https://devbolt.dev" },
};

export default function TomlConverterPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TomlConverterTool />
    </>
  );
}
