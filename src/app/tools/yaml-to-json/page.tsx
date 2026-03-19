import type { Metadata } from "next";
import JsonYamlTool from "../json-yaml/JsonYamlTool";

const BASE_URL = "https://devbolt.dev";

export const metadata: Metadata = {
  title: "YAML to JSON Converter Online — Free & Instant",
  description:
    "Convert YAML to JSON online instantly. Parse Kubernetes manifests, Docker Compose files, and CI/CD configs into valid JSON. Free, client-side, no signup required.",
  keywords: [
    "yaml to json",
    "yaml to json converter",
    "yaml to json online",
    "convert yaml to json",
    "yaml to json converter online free",
    "yaml parser",
    "yaml to json format",
    "kubernetes yaml to json",
    "yaml to json tool",
  ],
  alternates: {
    canonical: `${BASE_URL}/tools/yaml-to-json`,
  },
  openGraph: {
    title: "YAML to JSON Converter Online — Free & Instant | DevBolt",
    description:
      "Convert YAML to JSON instantly. Parse Kubernetes manifests, Docker Compose files, and CI/CD configs into valid JSON.",
    url: `${BASE_URL}/tools/yaml-to-json`,
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "YAML to JSON Converter",
  url: `${BASE_URL}/tools/yaml-to-json`,
  description:
    "Convert YAML to JSON online. Parses YAML including anchors, aliases, multi-document, and custom tags into valid JSON. Client-side processing.",
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
      name: "How do I convert YAML to JSON?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Paste your YAML into DevBolt's YAML to JSON converter and the JSON output appears instantly. The tool handles nested mappings, sequences, anchors, aliases, multi-line strings, and all YAML scalar types. You can set indentation to 2 or 4 spaces and copy or download the result. Everything runs in your browser — no data is sent to any server.",
      },
    },
    {
      "@type": "Question",
      name: "Why would I convert YAML to JSON?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Common reasons include: using YAML configs with JSON-only APIs, programmatically processing Kubernetes manifests, importing Docker Compose configurations into tools that expect JSON, debugging YAML parsing issues by viewing the resolved JSON structure, and converting configuration for languages and libraries that only support JSON. JSON is also required for many REST APIs, AWS CloudFormation (when not using YAML), and browser-based applications.",
      },
    },
    {
      "@type": "Question",
      name: "Does this converter handle YAML anchors and aliases?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. The converter fully resolves YAML anchors (&) and aliases (*), expanding them into the JSON output. It also handles merge keys (<<), multi-document YAML (--- separators), and all standard YAML 1.2 features. The output is valid, minifiable JSON that any JSON parser can consume.",
      },
    },
  ],
};

export default function YamlToJsonPage() {
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
      <JsonYamlTool initialMode="yaml-to-json" />

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
          How to Convert YAML to JSON
        </h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          YAML is the dominant configuration language in the cloud-native ecosystem, but many APIs,
          libraries, and programming languages expect JSON. This free online YAML to JSON converter
          parses your YAML instantly and produces valid, properly formatted JSON — entirely in your
          browser with zero server-side processing.
        </p>

        <h3 className="mb-3 mt-8 text-xl font-semibold text-gray-900 dark:text-white">
          Why Convert YAML to JSON?
        </h3>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          JSON is the universal data interchange format. While YAML excels as a human-readable
          configuration language, JSON is required when interacting with REST APIs, storing structured
          data in databases, processing configurations programmatically in JavaScript or Python, or
          working with tools that only accept JSON input. Converting YAML to JSON is also useful for
          debugging — JSON&apos;s explicit syntax makes it easier to spot structural issues that
          YAML&apos;s indentation-based format can hide.
        </p>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          Modern infrastructure tools like Kubernetes accept both YAML and JSON for manifests, but
          the kubectl API server returns JSON. If you need to diff, validate, or programmatically
          modify Kubernetes resources, converting your YAML manifests to JSON first simplifies the
          process. Similarly, AWS CloudFormation historically required JSON templates, and many
          linting and validation tools work better with JSON input.
        </p>

        <h3 className="mb-3 mt-8 text-xl font-semibold text-gray-900 dark:text-white">
          Common Use Cases
        </h3>
        <ul className="mb-4 list-inside list-disc space-y-2 text-gray-600 dark:text-gray-400">
          <li>
            <strong>API integration:</strong> Convert YAML configs to JSON for REST API requests or
            responses that require JSON format.
          </li>
          <li>
            <strong>Kubernetes debugging:</strong> Parse Kubernetes YAML manifests into JSON for
            programmatic processing with jq, Python, or JavaScript.
          </li>
          <li>
            <strong>Configuration migration:</strong> Transform YAML configs into JSON for tools and
            frameworks that only support JSON configuration files.
          </li>
          <li>
            <strong>Data processing:</strong> Load YAML data files into JSON-based data pipelines,
            databases, or analytics tools.
          </li>
          <li>
            <strong>Validation and linting:</strong> Convert YAML to JSON to use with JSON Schema
            validators, JSON linters, and structural validation tools.
          </li>
          <li>
            <strong>AWS CloudFormation:</strong> Transform YAML templates to JSON when working with
            older tools or APIs that require JSON format.
          </li>
        </ul>

        <h3 className="mb-3 mt-8 text-xl font-semibold text-gray-900 dark:text-white">
          YAML Features This Converter Handles
        </h3>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          This converter supports the full YAML 1.2 specification including nested mappings and
          sequences, flow style (inline JSON-like syntax), block scalars (literal | and folded &gt;
          blocks), anchors (&amp;) and aliases (*) with merge keys (&lt;&lt;), tagged values,
          multiple documents separated by ---, and all scalar types (strings, integers, floats,
          booleans, nulls, timestamps). The output is valid JSON with configurable indentation for
          readability.
        </p>

        <h3 className="mb-3 mt-8 text-xl font-semibold text-gray-900 dark:text-white">
          Privacy First
        </h3>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          This YAML to JSON converter runs entirely in your browser using the js-yaml library. Your
          configuration files, manifests, and data never leave your device — no API calls, no server
          processing, no data retention. This makes it safe for sensitive infrastructure configs,
          credentials, and internal service definitions.
        </p>
      </div>
    </>
  );
}
