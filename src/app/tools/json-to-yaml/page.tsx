import type { Metadata } from "next";
import JsonYamlTool from "../json-yaml/JsonYamlTool";

const BASE_URL = "https://devbolt.dev";

export const metadata: Metadata = {
  title: "JSON to YAML Converter Online — Free & Instant",
  description:
    "Convert JSON to YAML online instantly. Perfect for Kubernetes manifests, Docker Compose files, GitHub Actions workflows, and CI/CD pipelines. Free, client-side, no signup required.",
  keywords: [
    "json to yaml",
    "json to yaml converter",
    "json to yaml online",
    "convert json to yaml",
    "json to yaml converter online free",
    "json yaml converter",
    "kubernetes yaml converter",
    "json to yaml format",
    "json to yaml tool",
  ],
  alternates: {
    canonical: `${BASE_URL}/tools/json-to-yaml`,
  },
  openGraph: {
    title: "JSON to YAML Converter Online — Free & Instant | DevBolt",
    description:
      "Convert JSON to YAML instantly. Perfect for Kubernetes manifests, Docker Compose files, and CI/CD configs.",
    url: `${BASE_URL}/tools/json-to-yaml`,
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "JSON to YAML Converter",
  url: `${BASE_URL}/tools/json-to-yaml`,
  description:
    "Convert JSON to YAML online. Handles nested objects, arrays, special characters, and multi-document output. Client-side processing — your data never leaves your browser.",
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
      name: "How do I convert JSON to YAML?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Paste your JSON into DevBolt's JSON to YAML converter and the output appears instantly. The tool handles nested objects, arrays, numbers, booleans, nulls, and special characters. You can customize indentation (2 or 4 spaces) and copy or download the YAML output. Everything runs in your browser — no data is sent to any server.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between JSON and YAML?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "JSON (JavaScript Object Notation) uses braces, brackets, and quotes for structure. YAML (YAML Ain't Markup Language) uses indentation and minimal punctuation, making it more human-readable. JSON is better for APIs and data interchange. YAML is preferred for configuration files like Kubernetes manifests, Docker Compose, Ansible playbooks, and GitHub Actions workflows because it supports comments and is easier to read and edit by hand.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use this converter for Kubernetes YAML?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Kubernetes manifests are YAML files, and many tools generate JSON output. This converter transforms JSON API responses, kubectl output (kubectl get pod -o json), or Terraform state into clean YAML ready for Kubernetes. It preserves structure, handles nested specs, and supports the indentation style Kubernetes expects.",
      },
    },
  ],
};

export default function JsonToYamlPage() {
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
      <JsonYamlTool initialMode="json-to-yaml" />

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
          How to Convert JSON to YAML
        </h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          Converting JSON to YAML is one of the most common tasks in modern DevOps and cloud-native
          development. YAML has become the standard configuration language for Kubernetes, Docker
          Compose, GitHub Actions, GitLab CI, Ansible, and dozens of other infrastructure tools. This
          free online converter transforms your JSON data into clean, properly indented YAML in
          milliseconds — entirely in your browser with no server-side processing.
        </p>

        <h3 className="mb-3 mt-8 text-xl font-semibold text-gray-900 dark:text-white">
          Why Convert JSON to YAML?
        </h3>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          While JSON is the lingua franca of APIs and data interchange, YAML offers several advantages
          for configuration files. YAML supports comments, which are essential for documenting
          infrastructure-as-code. Its indentation-based syntax is more readable for deeply nested
          structures like Kubernetes pod specs or Docker Compose service definitions. YAML also
          supports multi-line strings without escape characters, making it ideal for embedding scripts,
          SQL queries, or policy definitions in config files.
        </p>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          Many tools output JSON by default — kubectl returns JSON from API calls, Terraform state
          files are JSON, and most REST APIs respond with JSON. Converting this output to YAML lets
          you integrate it directly into your configuration management workflow. For example, you might
          convert a JSON API response into a Kubernetes ConfigMap, or transform a Terraform output
          into an Ansible variables file.
        </p>

        <h3 className="mb-3 mt-8 text-xl font-semibold text-gray-900 dark:text-white">
          Common Use Cases
        </h3>
        <ul className="mb-4 list-inside list-disc space-y-2 text-gray-600 dark:text-gray-400">
          <li>
            <strong>Kubernetes manifests:</strong> Convert kubectl JSON output into YAML manifests for
            version control and GitOps workflows.
          </li>
          <li>
            <strong>Docker Compose:</strong> Transform JSON service definitions into docker-compose.yml
            format for multi-container applications.
          </li>
          <li>
            <strong>GitHub Actions:</strong> Convert workflow configurations from JSON to YAML for
            .github/workflows/ files.
          </li>
          <li>
            <strong>CI/CD pipelines:</strong> Generate YAML configs for GitLab CI, CircleCI, or Azure
            Pipelines from JSON templates.
          </li>
          <li>
            <strong>Ansible playbooks:</strong> Convert structured data into YAML format for
            automation playbooks and inventory files.
          </li>
          <li>
            <strong>API documentation:</strong> Transform OpenAPI/Swagger specs between JSON and YAML
            representations.
          </li>
        </ul>

        <h3 className="mb-3 mt-8 text-xl font-semibold text-gray-900 dark:text-white">
          JSON vs YAML: Key Differences
        </h3>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          JSON uses curly braces for objects, square brackets for arrays, and requires double quotes
          around all keys and string values. YAML uses indentation to define structure, supports bare
          keys and unquoted strings, and allows inline comments with the # character. YAML also
          supports anchors and aliases for reusing values, multi-document files separated by ---,
          and multiple scalar styles (literal blocks, folded blocks) for multi-line content.
        </p>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          This converter handles all JSON data types — strings, numbers, booleans, null, nested
          objects, and arrays — and produces clean YAML output with your choice of 2-space or 4-space
          indentation. Special characters, Unicode, and deeply nested structures are all preserved
          accurately.
        </p>

        <h3 className="mb-3 mt-8 text-xl font-semibold text-gray-900 dark:text-white">
          Privacy First
        </h3>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          This JSON to YAML converter runs entirely in your browser using client-side JavaScript. Your
          data never leaves your device — no API calls, no server processing, no data storage. This
          makes it safe to use with sensitive configuration data, API keys, credentials, and internal
          infrastructure definitions.
        </p>
      </div>
    </>
  );
}
