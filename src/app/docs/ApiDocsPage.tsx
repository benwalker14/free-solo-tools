"use client";

import { useState } from "react";
import Link from "next/link";

interface Endpoint {
  method: string;
  path: string;
  title: string;
  description: string;
  body: Record<string, string>;
  exampleRequest: string;
  exampleResponse: string;
}

const BASE_URL = "https://devbolt.dev";

const endpoints: Endpoint[] = [
  {
    method: "POST",
    path: "/api/v1/tools/json-format",
    title: "JSON Format",
    description: "Format, validate, or minify JSON data.",
    body: {
      input: '(string, required) — JSON string to process',
      action: '(string) — "format" (default), "minify", or "validate"',
      indent: "(number) — indent size for formatting (default: 2)",
    },
    exampleRequest: `curl -X POST ${BASE_URL}/api/v1/tools/json-format \\
  -H "Authorization: Bearer dvb_your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{"input": "{\\"name\\":\\"DevBolt\\"}", "action": "format"}'`,
    exampleResponse: `{
  "result": "{\\n  \\"name\\": \\"DevBolt\\"\\n}",
  "valid": true
}`,
  },
  {
    method: "POST",
    path: "/api/v1/tools/base64",
    title: "Base64 Encode/Decode",
    description: "Encode or decode Base64 strings with UTF-8 support.",
    body: {
      input: "(string, required) — text to encode or Base64 string to decode",
      action: '(string) — "encode" (default) or "decode"',
    },
    exampleRequest: `curl -X POST ${BASE_URL}/api/v1/tools/base64 \\
  -H "Authorization: Bearer dvb_your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{"input": "Hello, DevBolt!", "action": "encode"}'`,
    exampleResponse: `{
  "result": "SGVsbG8sIERldkJvbHQh"
}`,
  },
  {
    method: "POST",
    path: "/api/v1/tools/hash",
    title: "Hash Generator",
    description:
      "Generate SHA-1, SHA-256, SHA-384, SHA-512, or MD5 hashes. Omit algorithm to get all.",
    body: {
      input: "(string, required) — text to hash",
      algorithm:
        '(string) — "sha1", "sha256", "sha384", "sha512", "md5", or omit for all',
      encoding: '(string) — "hex" (default) or "base64"',
    },
    exampleRequest: `curl -X POST ${BASE_URL}/api/v1/tools/hash \\
  -H "Authorization: Bearer dvb_your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{"input": "hello world", "algorithm": "sha256"}'`,
    exampleResponse: `{
  "algorithm": "sha256",
  "hash": "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9"
}`,
  },
  {
    method: "POST",
    path: "/api/v1/tools/uuid",
    title: "UUID Generator",
    description: "Generate one or more UUID v4 identifiers.",
    body: {
      count: "(number) — how many UUIDs to generate (1–100, default: 1)",
      uppercase: "(boolean) — return uppercase UUIDs (default: false)",
    },
    exampleRequest: `curl -X POST ${BASE_URL}/api/v1/tools/uuid \\
  -H "Authorization: Bearer dvb_your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{"count": 3}'`,
    exampleResponse: `{
  "uuids": [
    "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "7c9e6679-7425-40de-944b-e07fc1f90ae7",
    "550e8400-e29b-41d4-a716-446655440000"
  ],
  "count": 3
}`,
  },
  {
    method: "POST",
    path: "/api/v1/tools/url-encode",
    title: "URL Encode/Decode",
    description: "URL encode or decode strings using encodeURIComponent or encodeURI.",
    body: {
      input: "(string, required) — text to encode or encoded string to decode",
      action: '(string) — "encode" (default) or "decode"',
      mode: '(string) — "component" (default) or "full"',
    },
    exampleRequest: `curl -X POST ${BASE_URL}/api/v1/tools/url-encode \\
  -H "Authorization: Bearer dvb_your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{"input": "hello world & foo=bar", "action": "encode"}'`,
    exampleResponse: `{
  "result": "hello%20world%20%26%20foo%3Dbar"
}`,
  },
  {
    method: "POST",
    path: "/api/v1/tools/jwt-decode",
    title: "JWT Decoder",
    description:
      "Decode a JWT into header, payload, and signature with expiry check.",
    body: {
      token: "(string, required) — JWT string (eyJ...)",
    },
    exampleRequest: `curl -X POST ${BASE_URL}/api/v1/tools/jwt-decode \\
  -H "Authorization: Bearer dvb_your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{"token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkRldkJvbHQifQ.xyz"}'`,
    exampleResponse: `{
  "header": { "alg": "HS256" },
  "payload": { "sub": "1234567890", "name": "DevBolt" },
  "signature": "xyz",
  "timestamps": {},
  "expired": false
}`,
  },
  {
    method: "POST",
    path: "/api/v1/tools/case-convert",
    title: "Case Converter",
    description:
      "Convert text between camelCase, snake_case, kebab-case, PascalCase, and more. Omit target to get all.",
    body: {
      input: "(string, required) — text to convert",
      to: '(string) — "camel", "pascal", "snake", "kebab", "constant", "dot", "title", "sentence", "lower", "upper", or omit for all',
    },
    exampleRequest: `curl -X POST ${BASE_URL}/api/v1/tools/case-convert \\
  -H "Authorization: Bearer dvb_your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{"input": "hello world example", "to": "camel"}'`,
    exampleResponse: `{
  "result": "helloWorldExample"
}`,
  },
  {
    method: "POST",
    path: "/api/v1/tools/epoch",
    title: "Epoch Converter",
    description:
      'Convert between Unix timestamps and dates. Send "timestamp", "date", or "action": "now".',
    body: {
      timestamp: "(number) — Unix timestamp (seconds or milliseconds)",
      date: '(string) — ISO 8601 date string (e.g. "2024-01-15T12:00:00Z")',
      action: '(string) — "now" to get current time',
    },
    exampleRequest: `curl -X POST ${BASE_URL}/api/v1/tools/epoch \\
  -H "Authorization: Bearer dvb_your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{"timestamp": 1700000000}'`,
    exampleResponse: `{
  "timestamp": 1700000000,
  "timestamp_ms": 1700000000000,
  "iso": "2023-11-14T22:13:20.000Z",
  "utc": "Tue, 14 Nov 2023 22:13:20 GMT"
}`,
  },
];

function CodeBlock({ code, lang }: { code: string; lang: string }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative">
      <div className="absolute right-2 top-2 z-10">
        <button
          onClick={copy}
          className="rounded bg-gray-700 px-2 py-1 text-xs text-gray-300 opacity-0 transition-opacity hover:bg-gray-600 group-hover:opacity-100"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
        <code data-lang={lang}>{code}</code>
      </pre>
    </div>
  );
}

function EndpointCard({ ep }: { ep: Endpoint }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50"
      >
        <span className="rounded bg-indigo-100 px-2 py-0.5 text-xs font-bold text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
          {ep.method}
        </span>
        <code className="text-sm text-gray-700 dark:text-gray-300">
          {ep.path}
        </code>
        <span className="ml-auto text-sm text-gray-500">{ep.title}</span>
        <svg
          className={`h-4 w-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
          />
        </svg>
      </button>

      {open && (
        <div className="border-t border-gray-200 px-4 py-4 dark:border-gray-700">
          <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
            {ep.description}
          </p>

          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
            Request Body
          </h4>
          <ul className="mb-4 space-y-1">
            {Object.entries(ep.body).map(([key, desc]) => (
              <li key={key} className="text-sm">
                <code className="text-indigo-600 dark:text-indigo-400">
                  {key}
                </code>{" "}
                <span className="text-gray-600 dark:text-gray-400">
                  {desc}
                </span>
              </li>
            ))}
          </ul>

          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
            Example Request
          </h4>
          <CodeBlock code={ep.exampleRequest} lang="bash" />

          <h4 className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
            Example Response
          </h4>
          <CodeBlock code={ep.exampleResponse} lang="json" />
        </div>
      )}
    </div>
  );
}

export default function ApiDocsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-3xl">
        {/* Hero */}
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          API Documentation
        </h1>
        <p className="mb-12 text-lg text-gray-600 dark:text-gray-400">
          Access DevBolt tools programmatically with the Pro REST API.
        </p>

        {/* Authentication */}
        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
            Authentication
          </h2>
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            All API endpoints require a Pro subscription. Include your API key in
            the <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm dark:bg-gray-800">Authorization</code> header:
          </p>
          <CodeBlock
            code={`Authorization: Bearer dvb_your_api_key_here`}
            lang="http"
          />
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Your API key is generated automatically when you subscribe to{" "}
            <Link
              href="/pricing"
              className="text-indigo-600 hover:underline dark:text-indigo-400"
            >
              DevBolt Pro
            </Link>
            . You can retrieve it from your checkout confirmation page.
          </p>
        </section>

        {/* Base URL */}
        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
            Base URL
          </h2>
          <CodeBlock code={`https://devbolt.dev/api/v1`} lang="text" />
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            All endpoints accept <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm dark:bg-gray-800">POST</code> requests
            with a JSON body and return JSON responses.
          </p>
        </section>

        {/* Error Handling */}
        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
            Error Handling
          </h2>
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            Errors return a JSON object with an <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm dark:bg-gray-800">error</code> field
            and an appropriate HTTP status code:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="py-2 pr-4 text-left font-medium text-gray-900 dark:text-white">
                    Status
                  </th>
                  <th className="py-2 text-left font-medium text-gray-900 dark:text-white">
                    Meaning
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-600 dark:text-gray-400">
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-2 pr-4">
                    <code>400</code>
                  </td>
                  <td className="py-2">Bad request — invalid input or parameters</td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-2 pr-4">
                    <code>401</code>
                  </td>
                  <td className="py-2">Unauthorized — missing or invalid API key</td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-2 pr-4">
                    <code>403</code>
                  </td>
                  <td className="py-2">Forbidden — subscription not active</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">
                    <code>503</code>
                  </td>
                  <td className="py-2">Service unavailable — API not yet configured</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Quick Start */}
        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
            Quick Start
          </h2>

          <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
            JavaScript (fetch)
          </h3>
          <CodeBlock
            code={`const response = await fetch("${BASE_URL}/api/v1/tools/hash", {
  method: "POST",
  headers: {
    "Authorization": "Bearer dvb_your_api_key",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    input: "hello world",
    algorithm: "sha256",
  }),
});

const data = await response.json();
console.log(data.hash);`}
            lang="javascript"
          />

          <h3 className="mb-2 mt-6 text-lg font-medium text-gray-900 dark:text-white">
            Python (requests)
          </h3>
          <CodeBlock
            code={`import requests

response = requests.post(
    "${BASE_URL}/api/v1/tools/hash",
    headers={"Authorization": "Bearer dvb_your_api_key"},
    json={"input": "hello world", "algorithm": "sha256"},
)

data = response.json()
print(data["hash"])`}
            lang="python"
          />
        </section>

        {/* Endpoints */}
        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
            Endpoints
          </h2>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            Click any endpoint to see request/response details and examples.
          </p>
          <div className="space-y-3">
            {endpoints.map((ep) => (
              <EndpointCard key={ep.path} ep={ep} />
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-xl bg-gray-50 px-6 py-8 text-center dark:bg-gray-800/50">
          <h2 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
            Ready to integrate?
          </h2>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            Get your API key with a DevBolt Pro subscription.
          </p>
          <Link
            href="/pricing"
            className="inline-block rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
          >
            Get Pro — $4.99/mo
          </Link>
        </section>
      </div>
    </div>
  );
}
