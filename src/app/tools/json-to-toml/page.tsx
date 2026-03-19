import type { Metadata } from "next";
import TomlConverterTool from "../toml-converter/TomlConverterTool";

const BASE_URL = "https://devbolt.dev";

export const metadata: Metadata = {
  title: "JSON to TOML Converter Online — Free & Instant",
  description:
    "Convert JSON to TOML online instantly. Generate Cargo.toml, pyproject.toml, and Hugo config files from JSON data. Free, client-side, no signup required.",
  keywords: [
    "json to toml",
    "json to toml converter",
    "json to toml online",
    "convert json to toml",
    "json to cargo.toml",
    "json to pyproject.toml",
    "json to toml converter online free",
    "toml generator",
    "json to toml format",
  ],
  alternates: {
    canonical: `${BASE_URL}/tools/json-to-toml`,
  },
  openGraph: {
    title: "JSON to TOML Converter Online — Free & Instant | DevBolt",
    description:
      "Convert JSON to TOML instantly. Generate Cargo.toml, pyproject.toml, and other TOML config files from JSON.",
    url: `${BASE_URL}/tools/json-to-toml`,
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "JSON to TOML Converter",
  url: `${BASE_URL}/tools/json-to-toml`,
  description:
    "Convert JSON to TOML online. Generates clean TOML with proper table sections, arrays, inline tables, and type-appropriate formatting. Client-side processing.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  isAccessibleForFree: true,
  browserRequirements: "Any modern web browser",
  creator: {
    "@type": "Organization",
    name: "DevBolt",
    url: BASE_URL,
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How do I convert JSON to TOML?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Paste your JSON into DevBolt's JSON to TOML converter and the TOML output appears instantly. The tool generates clean TOML with proper [table] sections, arrays of tables ([[array]]), inline tables for small objects, and type-appropriate value formatting. You can copy or download the TOML result. Everything runs in your browser — no data is sent to any server.",
      },
    },
    {
      "@type": "Question",
      name: "Can I generate Cargo.toml from JSON?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. You can convert a JSON representation of a Rust package manifest into Cargo.toml format. The converter handles package metadata (name, version, edition, authors), dependencies with version constraints, dev-dependencies, features, build profiles, and workspace configurations. The output follows TOML conventions with proper table sections.",
      },
    },
    {
      "@type": "Question",
      name: "What JSON structures convert well to TOML?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "TOML maps cleanly to JSON objects with string keys. Nested objects become TOML tables ([section]), arrays of objects become arrays of tables ([[section]]), and scalar values (strings, numbers, booleans) convert directly. Deeply nested structures may use dotted keys (a.b.c = value). Note that TOML does not support heterogeneous arrays (arrays with mixed types), so JSON arrays mixing strings and numbers may need restructuring.",
      },
    },
  ],
};

export default function JsonToTomlPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <TomlConverterTool initialMode="json-to-toml" />

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
          How to Convert JSON to TOML
        </h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          TOML is gaining rapid adoption as the configuration format for Rust (Cargo.toml), Python
          (pyproject.toml), Hugo, Deno, and many modern developer tools. If you have data or
          configuration in JSON format and need to convert it to TOML, this free online converter
          handles the transformation instantly in your browser — generating clean TOML with proper
          table sections, arrays, and type-appropriate formatting.
        </p>

        <h3 className="mb-3 mt-8 text-xl font-semibold text-gray-900 dark:text-white">
          Why Convert JSON to TOML?
        </h3>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          TOML offers significant advantages over JSON for configuration files. It supports inline
          comments, which are essential for documenting configuration choices. Its table-based
          syntax is more readable than deeply nested JSON braces. TOML has native date/time types,
          eliminates the trailing comma problem, and never requires quoting simple string values.
          Converting JSON configurations to TOML makes them more maintainable for teams that
          hand-edit config files.
        </p>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          Common scenarios include bootstrapping a new Rust project by converting a package.json
          structure to Cargo.toml, migrating Python project metadata from setup.cfg or setup.py
          (via JSON) to pyproject.toml, generating Hugo site configurations from templates, or
          converting CI/CD pipeline data into TOML-based configuration files.
        </p>

        <h3 className="mb-3 mt-8 text-xl font-semibold text-gray-900 dark:text-white">
          Common Use Cases
        </h3>
        <ul className="mb-4 list-inside list-disc space-y-2 text-gray-600 dark:text-gray-400">
          <li>
            <strong>Rust development:</strong> Generate Cargo.toml package manifests from JSON
            templates or API responses containing package metadata.
          </li>
          <li>
            <strong>Python packaging:</strong> Create pyproject.toml files from JSON-structured
            project metadata for Poetry, PDM, or Hatch.
          </li>
          <li>
            <strong>Static sites:</strong> Convert JSON config data into Hugo config.toml or
            other TOML-based static site generator configurations.
          </li>
          <li>
            <strong>Configuration migration:</strong> Move from JSON-based configs (e.g.,
            tsconfig.json, package.json patterns) to TOML for projects that prefer TOML.
          </li>
          <li>
            <strong>Template generation:</strong> Convert JSON schemas or templates into TOML
            configuration file templates for distribution.
          </li>
          <li>
            <strong>Tooling automation:</strong> Generate TOML configs programmatically from JSON
            data in CI/CD pipelines and build scripts.
          </li>
        </ul>

        <h3 className="mb-3 mt-8 text-xl font-semibold text-gray-900 dark:text-white">
          How JSON Maps to TOML
        </h3>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          JSON objects become TOML tables: a top-level key-value pair stays at the root, while
          nested objects become [table] sections. JSON arrays of objects become TOML arrays of
          tables ([[table]]). Scalar values map directly — JSON strings become TOML strings,
          numbers become TOML integers or floats, and booleans map to TOML true/false. JSON null
          values are handled as empty strings since TOML does not have a null type. The converter
          produces clean, idiomatic TOML that follows community conventions.
        </p>

        <h3 className="mb-3 mt-8 text-xl font-semibold text-gray-900 dark:text-white">
          Privacy First
        </h3>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          This JSON to TOML converter runs entirely in your browser. Your data and configuration
          files never leave your device — no API calls, no server processing, no data retention.
          Safe for private project configurations, API keys in test configs, and internal tooling
          metadata.
        </p>
      </div>
    </>
  );
}
