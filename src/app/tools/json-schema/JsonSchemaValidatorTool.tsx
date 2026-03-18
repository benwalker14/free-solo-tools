"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import Ajv, { type ErrorObject } from "ajv";
import addFormats from "ajv-formats";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";
import RateLimitBanner from "@/components/RateLimitBanner";

const ajv = new Ajv({ allErrors: true, verbose: true, strict: false });
addFormats(ajv);

const SAMPLE_PAIRS: {
  label: string;
  schema: string;
  data: string;
  description: string;
}[] = [
  {
    label: "User Profile",
    description: "Basic object with required fields and types",
    schema: JSON.stringify(
      {
        $schema: "http://json-schema.org/draft-07/schema#",
        type: "object",
        required: ["name", "email", "age"],
        properties: {
          name: { type: "string", minLength: 1 },
          email: { type: "string", format: "email" },
          age: { type: "integer", minimum: 0, maximum: 150 },
          bio: { type: "string", maxLength: 500 },
          website: { type: "string", format: "uri" },
          tags: {
            type: "array",
            items: { type: "string" },
            maxItems: 10,
            uniqueItems: true,
          },
        },
        additionalProperties: false,
      },
      null,
      2
    ),
    data: JSON.stringify(
      {
        name: "Alice Johnson",
        email: "alice@example.com",
        age: 30,
        bio: "Software engineer and open source contributor.",
        website: "https://alice.dev",
        tags: ["typescript", "react", "nodejs"],
      },
      null,
      2
    ),
  },
  {
    label: "API Response",
    description: "Nested objects with arrays and enums",
    schema: JSON.stringify(
      {
        $schema: "http://json-schema.org/draft-07/schema#",
        type: "object",
        required: ["status", "data"],
        properties: {
          status: { type: "string", enum: ["success", "error"] },
          data: {
            type: "object",
            required: ["items", "total"],
            properties: {
              items: {
                type: "array",
                items: {
                  type: "object",
                  required: ["id", "title"],
                  properties: {
                    id: { type: "integer" },
                    title: { type: "string" },
                    published: { type: "boolean" },
                    createdAt: { type: "string", format: "date-time" },
                  },
                },
              },
              total: { type: "integer", minimum: 0 },
              page: { type: "integer", minimum: 1 },
            },
          },
          message: { type: "string" },
        },
      },
      null,
      2
    ),
    data: JSON.stringify(
      {
        status: "success",
        data: {
          items: [
            {
              id: 1,
              title: "Getting Started with JSON Schema",
              published: true,
              createdAt: "2024-01-15T10:30:00Z",
            },
            {
              id: 2,
              title: "Advanced Validation Patterns",
              published: false,
              createdAt: "2024-02-20T14:00:00Z",
            },
          ],
          total: 2,
          page: 1,
        },
      },
      null,
      2
    ),
  },
  {
    label: "Config File",
    description: "Pattern properties, defaults, and conditionals",
    schema: JSON.stringify(
      {
        $schema: "http://json-schema.org/draft-07/schema#",
        type: "object",
        required: ["name", "version"],
        properties: {
          name: {
            type: "string",
            pattern: "^[a-z][a-z0-9-]*$",
            minLength: 1,
            maxLength: 100,
          },
          version: {
            type: "string",
            pattern: "^\\d+\\.\\d+\\.\\d+$",
          },
          description: { type: "string" },
          private: { type: "boolean" },
          scripts: {
            type: "object",
            additionalProperties: { type: "string" },
          },
          dependencies: {
            type: "object",
            additionalProperties: { type: "string" },
          },
          engines: {
            type: "object",
            properties: {
              node: { type: "string" },
              npm: { type: "string" },
            },
          },
        },
      },
      null,
      2
    ),
    data: JSON.stringify(
      {
        name: "my-awesome-app",
        version: "1.2.3",
        description: "A sample application",
        private: true,
        scripts: {
          dev: "next dev",
          build: "next build",
          start: "next start",
        },
        dependencies: {
          react: "^19.0.0",
          next: "^16.0.0",
        },
        engines: {
          node: ">=20.0.0",
        },
      },
      null,
      2
    ),
  },
];

function generateSchemaFromJson(data: unknown): object {
  if (data === null) return { type: "null" };
  if (Array.isArray(data)) {
    if (data.length === 0) return { type: "array" };
    const itemSchemas = data.map(generateSchemaFromJson);
    // Use the first item's schema as representative
    return { type: "array", items: itemSchemas[0] };
  }
  if (typeof data === "object") {
    const props: Record<string, object> = {};
    const required: string[] = [];
    for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
      props[key] = generateSchemaFromJson(value);
      required.push(key);
    }
    return {
      type: "object",
      required,
      properties: props,
    };
  }
  if (typeof data === "number") {
    return Number.isInteger(data) ? { type: "integer" } : { type: "number" };
  }
  return { type: typeof data as string };
}

function formatErrorPath(error: ErrorObject): string {
  const path = error.instancePath || "/";
  return path === "" ? "/" : path;
}

function formatErrorMessage(error: ErrorObject): string {
  const { keyword, params, message } = error;
  switch (keyword) {
    case "type":
      return `Expected type "${(params as { type: string }).type}", got ${typeof error.data}`;
    case "required":
      return `Missing required property "${(params as { missingProperty: string }).missingProperty}"`;
    case "additionalProperties":
      return `Unexpected property "${(params as { additionalProperty: string }).additionalProperty}"`;
    case "enum":
      return `Value must be one of: ${((params as { allowedValues: unknown[] }).allowedValues).map((v) => JSON.stringify(v)).join(", ")}`;
    case "format":
      return `Must match format "${(params as { format: string }).format}"`;
    case "minimum":
      return `Must be >= ${(params as { limit: number }).limit}`;
    case "maximum":
      return `Must be <= ${(params as { limit: number }).limit}`;
    case "minLength":
      return `Must be at least ${(params as { limit: number }).limit} character(s)`;
    case "maxLength":
      return `Must be at most ${(params as { limit: number }).limit} character(s)`;
    case "pattern":
      return `Must match pattern: ${(params as { pattern: string }).pattern}`;
    case "uniqueItems":
      return "Array items must be unique";
    case "maxItems":
      return `Array must have at most ${(params as { limit: number }).limit} items`;
    case "minItems":
      return `Array must have at least ${(params as { limit: number }).limit} items`;
    default:
      return message || `Validation failed: ${keyword}`;
  }
}

export default function JsonSchemaValidatorTool() {
  const [schemaInput, setSchemaInput] = useState("");
  const [dataInput, setDataInput] = useState("");
  const [validationResult, setValidationResult] = useState<
    | { valid: true }
    | { valid: false; errors: ErrorObject[] }
    | null
  >(null);
  const [parseError, setParseError] = useState("");
  const [copied, setCopied] = useState<"schema" | "data" | null>(null);
  const { remaining, dailyLimit, isLimited, recordUsage } =
    useRateLimit("json-schema");
  const { trackAction } = useToolAnalytics("json-schema");

  const handleValidate = useCallback(() => {
    if (isLimited) return;
    recordUsage();
    trackAction("validate");
    setParseError("");
    setValidationResult(null);
    setCopied(null);

    if (!schemaInput.trim()) {
      setParseError("Please enter a JSON Schema.");
      return;
    }
    if (!dataInput.trim()) {
      setParseError("Please enter JSON data to validate.");
      return;
    }

    let schema: object;
    try {
      schema = JSON.parse(schemaInput);
    } catch (e) {
      setParseError(
        "Invalid JSON Schema: " +
          (e instanceof Error ? e.message : "Parse error")
      );
      return;
    }

    let data: unknown;
    try {
      data = JSON.parse(dataInput);
    } catch (e) {
      setParseError(
        "Invalid JSON data: " +
          (e instanceof Error ? e.message : "Parse error")
      );
      return;
    }

    try {
      const validate = ajv.compile(schema);
      const valid = validate(data);
      if (valid) {
        setValidationResult({ valid: true });
      } else {
        setValidationResult({
          valid: false,
          errors: validate.errors || [],
        });
      }
    } catch (e) {
      setParseError(
        "Schema compilation error: " +
          (e instanceof Error ? e.message : "Invalid schema")
      );
    }
  }, [schemaInput, dataInput, isLimited, recordUsage, trackAction]);

  useKeyboardShortcut("Enter", handleValidate);

  const handleGenerateSchema = useCallback(() => {
    trackAction("generate-schema");
    setParseError("");
    setValidationResult(null);

    if (!dataInput.trim()) {
      setParseError("Enter JSON data first, then generate a schema from it.");
      return;
    }

    let data: unknown;
    try {
      data = JSON.parse(dataInput);
    } catch (e) {
      setParseError(
        "Invalid JSON data: " +
          (e instanceof Error ? e.message : "Parse error")
      );
      return;
    }

    const generated = {
      $schema: "http://json-schema.org/draft-07/schema#",
      ...generateSchemaFromJson(data),
    };
    setSchemaInput(JSON.stringify(generated, null, 2));
  }, [dataInput, trackAction]);

  function handleLoadSample(index: number) {
    const sample = SAMPLE_PAIRS[index];
    setSchemaInput(sample.schema);
    setDataInput(sample.data);
    setValidationResult(null);
    setParseError("");
    setCopied(null);
  }

  function handleCopy(which: "schema" | "data") {
    const text = which === "schema" ? schemaInput : dataInput;
    if (text.trim()) {
      navigator.clipboard.writeText(text);
      setCopied(which);
      setTimeout(() => setCopied(null), 1500);
    }
  }

  function handleClear() {
    setSchemaInput("");
    setDataInput("");
    setValidationResult(null);
    setParseError("");
    setCopied(null);
  }

  const errorCount = useMemo(() => {
    if (validationResult && !validationResult.valid) {
      return validationResult.errors.length;
    }
    return 0;
  }, [validationResult]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="mb-8 block text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        &larr; Back to tools
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        JSON Schema Validator
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Validate JSON data against a JSON Schema (Draft 07) with detailed error
        reporting. Generate schemas from sample data or load examples to get
        started.
      </p>

      {/* Sample buttons */}
      <div className="mb-4">
        <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">
          Load example:
        </span>
        {SAMPLE_PAIRS.map((sample, i) => (
          <button
            key={sample.label}
            onClick={() => handleLoadSample(i)}
            title={sample.description}
            className="mr-2 mb-1 rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs text-gray-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-indigo-950 dark:hover:border-indigo-800 dark:hover:text-indigo-300 transition-colors"
          >
            {sample.label}
          </button>
        ))}
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Schema input */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              JSON Schema
            </label>
            <button
              onClick={() => handleCopy("schema")}
              className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              {copied === "schema" ? "Copied!" : "Copy"}
            </button>
          </div>
          <textarea
            value={schemaInput}
            onChange={(e) => setSchemaInput(e.target.value)}
            placeholder='{\n  "type": "object",\n  "properties": { ... }\n}'
            rows={18}
            spellCheck={false}
            className="w-full rounded-lg border border-gray-300 bg-white p-4 font-mono text-sm dark:border-gray-700 dark:bg-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-y"
          />
        </div>

        {/* Data input */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              JSON Data
            </label>
            <button
              onClick={() => handleCopy("data")}
              className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              {copied === "data" ? "Copied!" : "Copy"}
            </button>
          </div>
          <textarea
            value={dataInput}
            onChange={(e) => setDataInput(e.target.value)}
            placeholder='{\n  "name": "Alice",\n  "email": "alice@example.com"\n}'
            rows={18}
            spellCheck={false}
            className="w-full rounded-lg border border-gray-300 bg-white p-4 font-mono text-sm dark:border-gray-700 dark:bg-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-y"
          />
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap items-center gap-2 mt-4">
        <button
          onClick={handleValidate}
          disabled={isLimited}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          Validate{" "}
          <kbd className="ml-1 hidden rounded bg-indigo-500 px-1.5 py-0.5 text-xs font-normal text-indigo-100 sm:inline">
            Ctrl+Enter
          </kbd>
        </button>
        <button
          onClick={handleGenerateSchema}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
        >
          Generate Schema from Data
        </button>
        <button
          onClick={handleClear}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
        >
          Clear
        </button>
        <RateLimitBanner
          remaining={remaining}
          dailyLimit={dailyLimit}
          isLimited={isLimited}
        />
      </div>

      {/* Parse error */}
      {parseError && (
        <div className="mt-4 rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-600 dark:bg-red-950 dark:border-red-800 dark:text-red-400">
          {parseError}
        </div>
      )}

      {/* Validation result */}
      {validationResult && (
        <div className="mt-4">
          {validationResult.valid ? (
            <div className="rounded-lg bg-green-50 border border-green-200 p-4 dark:bg-green-950 dark:border-green-800">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-600 dark:text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-sm font-medium text-green-700 dark:text-green-300">
                  Valid — JSON data matches the schema.
                </span>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-red-200 dark:border-red-800 overflow-hidden">
              <div className="bg-red-50 dark:bg-red-950 px-4 py-3 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-red-600 dark:text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                <span className="text-sm font-medium text-red-700 dark:text-red-300">
                  Invalid — {errorCount} error{errorCount === 1 ? "" : "s"}{" "}
                  found
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-red-100 dark:border-red-900 bg-red-50/50 dark:bg-red-950/50">
                      <th className="px-4 py-2 text-left font-medium text-red-700 dark:text-red-300 w-12">
                        #
                      </th>
                      <th className="px-4 py-2 text-left font-medium text-red-700 dark:text-red-300 w-40">
                        Path
                      </th>
                      <th className="px-4 py-2 text-left font-medium text-red-700 dark:text-red-300 w-24">
                        Keyword
                      </th>
                      <th className="px-4 py-2 text-left font-medium text-red-700 dark:text-red-300">
                        Message
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {validationResult.errors.map((err, i) => (
                      <tr
                        key={i}
                        className="border-b border-red-50 dark:border-red-950 hover:bg-red-50/50 dark:hover:bg-red-950/30"
                      >
                        <td className="px-4 py-2 text-red-500 dark:text-red-400 tabular-nums">
                          {i + 1}
                        </td>
                        <td className="px-4 py-2 font-mono text-xs text-red-600 dark:text-red-400">
                          {formatErrorPath(err)}
                        </td>
                        <td className="px-4 py-2">
                          <span className="inline-block rounded bg-red-100 dark:bg-red-900 px-1.5 py-0.5 text-xs font-medium text-red-700 dark:text-red-300">
                            {err.keyword}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-red-600 dark:text-red-400">
                          {formatErrorMessage(err)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quick reference */}
      <details className="mt-8 rounded-lg border border-gray-200 dark:border-gray-700">
        <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          JSON Schema Quick Reference
        </summary>
        <div className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400 space-y-3">
          <p>
            JSON Schema is a vocabulary for annotating and validating JSON
            documents. It describes the structure, constraints, and
            documentation of JSON data.
          </p>
          <div>
            <strong>Common keywords:</strong>
            <ul className="mt-1 ml-4 list-disc space-y-1">
              <li>
                <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">
                  type
                </code>{" "}
                — Data type: string, number, integer, boolean, object, array,
                null
              </li>
              <li>
                <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">
                  required
                </code>{" "}
                — Array of required property names
              </li>
              <li>
                <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">
                  properties
                </code>{" "}
                — Object property schemas
              </li>
              <li>
                <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">
                  items
                </code>{" "}
                — Schema for array elements
              </li>
              <li>
                <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">
                  enum
                </code>{" "}
                — Allowed values
              </li>
              <li>
                <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">
                  pattern
                </code>{" "}
                — Regex pattern for strings
              </li>
              <li>
                <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">
                  minimum / maximum
                </code>{" "}
                — Number range constraints
              </li>
              <li>
                <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">
                  minLength / maxLength
                </code>{" "}
                — String length constraints
              </li>
              <li>
                <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">
                  format
                </code>{" "}
                — Semantic format: email, uri, date-time, ipv4, uuid, etc.
              </li>
              <li>
                <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">
                  additionalProperties
                </code>{" "}
                — Allow or deny extra properties on objects
              </li>
            </ul>
          </div>
          <div>
            <strong>Combining schemas:</strong>
            <ul className="mt-1 ml-4 list-disc space-y-1">
              <li>
                <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">
                  allOf
                </code>{" "}
                — Must match all schemas
              </li>
              <li>
                <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">
                  anyOf
                </code>{" "}
                — Must match at least one schema
              </li>
              <li>
                <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">
                  oneOf
                </code>{" "}
                — Must match exactly one schema
              </li>
              <li>
                <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">
                  not
                </code>{" "}
                — Must not match the schema
              </li>
            </ul>
          </div>
          <p>
            This tool supports JSON Schema Draft 07 with format validation
            (email, URI, date-time, etc.) via{" "}
            <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">
              ajv-formats
            </code>
            . Everything runs in your browser — no data is sent over the
            network.
          </p>
        </div>
      </details>
    </div>
  );
}
