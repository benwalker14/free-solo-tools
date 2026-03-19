import type { Metadata } from "next";
import TomlConverterTool from "../toml-converter/TomlConverterTool";

const BASE_URL = "https://devbolt.dev";

export const metadata: Metadata = {
  title: "TOML to JSON Converter Online — Free & Instant",
  description:
    "Convert TOML to JSON online instantly. Transform Cargo.toml, pyproject.toml, Hugo configs, and other TOML files into valid JSON. Free, client-side, no signup required.",
  keywords: [
    "toml to json",
    "toml to json converter",
    "toml to json online",
    "convert toml to json",
    "toml parser",
    "cargo.toml to json",
    "pyproject.toml to json",
    "toml converter online",
    "toml to json format",
  ],
  alternates: {
    canonical: `${BASE_URL}/tools/toml-to-json`,
  },
  openGraph: {
    title: "TOML to JSON Converter Online — Free & Instant | DevBolt",
    description:
      "Convert TOML to JSON instantly. Perfect for Cargo.toml, pyproject.toml, and Hugo configuration files.",
    url: `${BASE_URL}/tools/toml-to-json`,
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "TOML to JSON Converter",
  url: `${BASE_URL}/tools/toml-to-json`,
  description:
    "Convert TOML to JSON online. Handles tables, arrays of tables, inline tables, dotted keys, and all TOML data types. Client-side processing.",
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
      name: "How do I convert TOML to JSON?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Paste your TOML into DevBolt's TOML to JSON converter and the JSON output appears instantly. The tool handles tables, arrays of tables, inline tables, dotted keys, multiline strings, dates, integers (hex, octal, binary), floats, booleans, and all TOML v1.0 features. You can customize indentation and copy or download the JSON result.",
      },
    },
    {
      "@type": "Question",
      name: "What is TOML and where is it used?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "TOML (Tom's Obvious Minimal Language) is a configuration file format designed to be easy to read and write. It's used by Rust projects (Cargo.toml), Python packaging (pyproject.toml), Hugo static sites (config.toml), Starship terminal prompt, Deno (deno.json can reference TOML), and many other tools. TOML supports comments, has clear semantics, and maps unambiguously to a hash table/dictionary structure.",
      },
    },
    {
      "@type": "Question",
      name: "What's the difference between TOML and JSON?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "TOML supports comments, has native date/time types, uses tables (sections) for grouping, and has a cleaner syntax for nested structures. JSON has no comment support, represents everything as strings/numbers/booleans/null/objects/arrays, and uses nested braces for structure. TOML is designed for configuration files that humans edit; JSON is designed for data interchange between programs. Converting between them is lossless for data, though TOML comments are lost in JSON conversion.",
      },
    },
  ],
};

export default function TomlToJsonPage() {
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
      <TomlConverterTool initialMode="toml-to-json" />

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
          How to Convert TOML to JSON
        </h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          TOML is the configuration language of choice for Rust (Cargo.toml), Python packaging
          (pyproject.toml), Hugo static sites, and a growing number of developer tools. But when
          you need to process TOML data programmatically, integrate with JSON-based APIs, or use
          tools that only accept JSON input, you need a reliable TOML to JSON converter. This free
          online tool transforms TOML into valid JSON instantly in your browser.
        </p>

        <h3 className="mb-3 mt-8 text-xl font-semibold text-gray-900 dark:text-white">
          Why Convert TOML to JSON?
        </h3>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          While TOML excels as a human-readable configuration format, JSON is the universal data
          interchange language. Converting TOML to JSON is necessary when building tools that
          process Cargo.toml or pyproject.toml files, integrating TOML-based configurations with
          JSON APIs, migrating projects between different configuration formats, or debugging
          complex TOML files by viewing their resolved JSON structure. JSON&apos;s explicit syntax
          can make it easier to verify that a TOML file is being parsed as intended.
        </p>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          The Rust ecosystem, in particular, uses TOML extensively for Cargo.toml package manifests,
          workspace configurations, and build profiles. Converting these to JSON enables
          programmatic analysis — checking dependency versions, extracting metadata for CI/CD
          pipelines, or feeding configuration data into JavaScript-based tools.
        </p>

        <h3 className="mb-3 mt-8 text-xl font-semibold text-gray-900 dark:text-white">
          Common Use Cases
        </h3>
        <ul className="mb-4 list-inside list-disc space-y-2 text-gray-600 dark:text-gray-400">
          <li>
            <strong>Rust projects:</strong> Parse Cargo.toml into JSON for dependency analysis,
            version checking, and CI/CD automation scripts.
          </li>
          <li>
            <strong>Python packaging:</strong> Convert pyproject.toml to JSON for tooling that
            processes Python project metadata and build configurations.
          </li>
          <li>
            <strong>Hugo sites:</strong> Transform Hugo config.toml into JSON for programmatic
            site configuration and theme development.
          </li>
          <li>
            <strong>Configuration migration:</strong> Move from TOML-based configs to JSON-based
            alternatives when changing tools or frameworks.
          </li>
          <li>
            <strong>Debugging:</strong> Visualize the resolved structure of complex TOML files
            with nested tables and arrays of tables in JSON format.
          </li>
          <li>
            <strong>API integration:</strong> Feed TOML configuration data into REST APIs and
            webhooks that accept JSON payloads.
          </li>
        </ul>

        <h3 className="mb-3 mt-8 text-xl font-semibold text-gray-900 dark:text-white">
          TOML Features Supported
        </h3>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          This converter supports the full TOML v1.0 specification including standard tables
          [table], arrays of tables [[array]], inline tables, dotted keys (a.b.c = value), basic
          and literal strings, multiline strings, integers in decimal/hex/octal/binary, floats
          including inf and nan, booleans, offset date-times, local date-times, local dates, and
          local times. Comments are preserved in the TOML input but naturally excluded from JSON
          output since JSON does not support comments.
        </p>

        <h3 className="mb-3 mt-8 text-xl font-semibold text-gray-900 dark:text-white">
          Privacy First
        </h3>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          This TOML to JSON converter runs entirely in your browser. Your configuration files,
          Cargo.toml manifests, and project metadata never leave your device — no API calls, no
          server processing, no data retention. Safe for private projects and internal tooling.
        </p>
      </div>
    </>
  );
}
