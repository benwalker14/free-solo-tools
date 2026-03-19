"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import RateLimitBanner from "@/components/RateLimitBanner";

interface GenOptions {
  rootName: string;
  addDescriptions: boolean;
  useNonNull: boolean;
  generateQueries: boolean;
  generateMutations: boolean;
}

function toPascalCase(str: string): string {
  return str
    .split(/[-_\s]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");
}

function toFieldName(str: string): string {
  // Keep as-is if already camelCase or lowercase
  if (/^[a-z][a-zA-Z0-9]*$/.test(str)) return str;
  // Convert snake_case/kebab-case to camelCase
  return str
    .split(/[-_]+/)
    .map((w, i) => (i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))
    .join("");
}

interface CollectedType {
  name: string;
  fields: { name: string; type: string; description?: string }[];
}

function inferGraphQLType(
  value: unknown,
  key: string,
  parentName: string,
  collected: CollectedType[],
  options: GenOptions,
): string {
  if (value === null || value === undefined) return "String";

  if (typeof value === "boolean") return "Boolean";
  if (typeof value === "number") {
    return Number.isInteger(value) ? "Int" : "Float";
  }
  if (typeof value === "string") {
    // Detect common patterns
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) return "ID";
    if (key.toLowerCase() === "id" || key.toLowerCase().endsWith("_id") || key.toLowerCase().endsWith("Id")) return "ID";
    if (/^\d{4}-\d{2}-\d{2}(T|\s)\d{2}:\d{2}/.test(value)) return "DateTime";
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return "Date";
    if (/^https?:\/\//.test(value)) return "String";
    if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)) return "String";
    return "String";
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return "[String]";
    const elemType = inferGraphQLType(value[0], key, parentName, collected, options);
    return `[${elemType}]`;
  }

  if (typeof value === "object") {
    const typeName = toPascalCase(key);
    buildType(
      value as Record<string, unknown>,
      typeName,
      collected,
      options,
    );
    return typeName;
  }

  return "String";
}

function buildType(
  obj: Record<string, unknown>,
  typeName: string,
  collected: CollectedType[],
  options: GenOptions,
): void {
  // Avoid duplicates
  if (collected.some((t) => t.name === typeName)) return;

  const fields: CollectedType["fields"] = [];

  for (const [key, value] of Object.entries(obj)) {
    const fieldName = toFieldName(key);
    let gqlType = inferGraphQLType(value, key, typeName, collected, options);

    // For arrays of objects, merge all elements for complete type
    if (Array.isArray(value) && value.length > 0 && typeof value[0] === "object" && value[0] !== null && !Array.isArray(value[0])) {
      const elemTypeName = toPascalCase(key);
      const merged: Record<string, unknown> = {};
      for (const item of value) {
        if (item && typeof item === "object" && !Array.isArray(item)) {
          for (const [k, v] of Object.entries(item as Record<string, unknown>)) {
            if (!(k in merged) || merged[k] === null) merged[k] = v;
          }
        }
      }
      // Remove any prior incomplete version
      const idx = collected.findIndex((t) => t.name === elemTypeName);
      if (idx !== -1) collected.splice(idx, 1);
      buildType(merged, elemTypeName, collected, options);
      gqlType = `[${elemTypeName}]`;
    }

    if (options.useNonNull && value !== null && value !== undefined) {
      gqlType = `${gqlType}!`;
    }

    fields.push({
      name: fieldName,
      type: gqlType,
      description: options.addDescriptions ? describeField(key, value) : undefined,
    });
  }

  collected.push({ name: typeName, fields });
}

function describeField(key: string, value: unknown): string | undefined {
  if (typeof value === "string") {
    if (/^[0-9a-f]{8}-[0-9a-f]{4}/.test(value)) return "Unique identifier";
    if (/^\d{4}-\d{2}-\d{2}(T|\s)/.test(value)) return "Timestamp";
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return "Date value";
    if (/^https?:\/\//.test(value)) return "URL";
    if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)) return "Email address";
  }
  if (key.toLowerCase() === "id" || key.toLowerCase().endsWith("_id")) return "Unique identifier";
  return undefined;
}

function generateSchema(json: string, options: GenOptions): { schema: string; typeCount: number; fieldCount: number; customScalars: string[] } {
  const parsed = JSON.parse(json);
  const collected: CollectedType[] = [];
  const rootName = toPascalCase(options.rootName) || "Root";

  let rootData: Record<string, unknown>;

  if (Array.isArray(parsed)) {
    if (parsed.length === 0) {
      return { schema: `type ${rootName} {\n  id: ID\n}`, typeCount: 1, fieldCount: 1, customScalars: [] };
    }
    // Merge all array elements
    const merged: Record<string, unknown> = {};
    for (const item of parsed) {
      if (item && typeof item === "object" && !Array.isArray(item)) {
        for (const [k, v] of Object.entries(item as Record<string, unknown>)) {
          if (!(k in merged) || merged[k] === null) merged[k] = v;
        }
      }
    }
    rootData = merged;
  } else if (parsed !== null && typeof parsed === "object") {
    rootData = parsed as Record<string, unknown>;
  } else {
    return { schema: `# Cannot generate schema from primitive value`, typeCount: 0, fieldCount: 0, customScalars: [] };
  }

  buildType(rootData, rootName, collected, options);

  // Detect custom scalars
  const customScalars = new Set<string>();
  for (const t of collected) {
    for (const f of t.fields) {
      const baseType = f.type.replace(/[\[\]!]/g, "");
      if (baseType === "DateTime") customScalars.add("DateTime");
      if (baseType === "Date") customScalars.add("Date");
    }
  }

  const lines: string[] = [];

  // Scalar declarations
  if (customScalars.size > 0) {
    for (const s of customScalars) {
      lines.push(`scalar ${s}`);
    }
    lines.push("");
  }

  // Types (reverse so root is last — dependencies first)
  const reversed = [...collected].reverse();
  for (const t of reversed) {
    lines.push(`type ${t.name} {`);
    for (const f of t.fields) {
      if (f.description) {
        lines.push(`  """${f.description}"""`);
      }
      lines.push(`  ${f.name}: ${f.type}`);
    }
    lines.push("}");
    lines.push("");
  }

  // Query type
  if (options.generateQueries) {
    const rootFieldName = rootName.charAt(0).toLowerCase() + rootName.slice(1);
    lines.push("type Query {");
    lines.push(`  ${rootFieldName}(id: ID!): ${rootName}`);
    lines.push(`  ${rootFieldName}s: [${rootName}!]!`);
    lines.push("}");
    lines.push("");
  }

  // Mutation type
  if (options.generateMutations) {
    const inputName = `${rootName}Input`;

    // Generate input type
    const rootType = collected.find((t) => t.name === rootName);
    if (rootType) {
      lines.push(`input ${inputName} {`);
      for (const f of rootType.fields) {
        // Input fields skip ID and use base types without !
        if (f.name === "id") continue;
        const baseType = f.type.replace(/!/g, "");
        lines.push(`  ${f.name}: ${baseType}`);
      }
      lines.push("}");
      lines.push("");
    }

    lines.push("type Mutation {");
    lines.push(`  create${rootName}(input: ${inputName}!): ${rootName}!`);
    lines.push(`  update${rootName}(id: ID!, input: ${inputName}!): ${rootName}`);
    lines.push(`  delete${rootName}(id: ID!): Boolean!`);
    lines.push("}");
    lines.push("");
  }

  const totalFields = collected.reduce((sum, t) => sum + t.fields.length, 0);

  return {
    schema: lines.join("\n").trimEnd(),
    typeCount: collected.length,
    fieldCount: totalFields,
    customScalars: [...customScalars],
  };
}

const SAMPLE_USER = `{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "age": 30,
  "isActive": true,
  "role": "admin",
  "address": {
    "street": "123 Main St",
    "city": "Springfield",
    "state": "IL",
    "zip": "62704"
  },
  "posts": [
    {
      "id": 1,
      "title": "Getting Started with GraphQL",
      "published": true,
      "createdAt": "2025-03-15T10:30:00Z"
    },
    {
      "id": 2,
      "title": "Advanced Schema Design",
      "published": false,
      "createdAt": "2025-03-16T14:22:00Z"
    }
  ]
}`;

const SAMPLE_ECOMMERCE = `[
  {
    "id": "prod_001",
    "name": "Wireless Mouse",
    "price": 29.99,
    "inStock": true,
    "category": "Electronics",
    "rating": 4.5,
    "tags": ["wireless", "ergonomic"],
    "images": [
      { "url": "https://example.com/mouse-1.jpg", "alt": "Front view", "width": 800, "height": 600 }
    ],
    "reviews": [
      { "id": 1, "author": "Bob", "rating": 5, "comment": "Great mouse!", "date": "2025-02-20" }
    ]
  }
]`;

const SAMPLE_API = `{
  "data": {
    "viewer": {
      "login": "octocat",
      "name": "The Octocat",
      "avatarUrl": "https://github.com/octocat.png",
      "bio": "Open source enthusiast",
      "repositories": [
        {
          "name": "hello-world",
          "description": "My first repository",
          "stargazerCount": 1500,
          "forkCount": 300,
          "isPrivate": false,
          "updatedAt": "2025-03-10T08:00:00Z",
          "primaryLanguage": {
            "name": "JavaScript",
            "color": "#f1e05a"
          }
        }
      ]
    }
  }
}`;

export default function JsonToGraphqlTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState<{
    types: number;
    fields: number;
    scalars: string[];
  } | null>(null);

  const [rootName, setRootName] = useState("Root");
  const [addDescriptions, setAddDescriptions] = useState(false);
  const [useNonNull, setUseNonNull] = useState(true);
  const [generateQueries, setGenerateQueries] = useState(true);
  const [generateMutations, setGenerateMutations] = useState(false);

  const { trackAction } = useToolAnalytics("json-to-graphql");
  const { remaining, dailyLimit, isLimited, recordUsage } =
    useRateLimit("json-to-graphql");

  const handleGenerate = useCallback(() => {
    setError("");
    setOutput("");
    setStats(null);
    setCopied(false);

    if (!input.trim()) {
      setError("Please paste your JSON data to convert.");
      return;
    }

    if (isLimited) return;
    recordUsage();
    trackAction("json-to-graphql");

    try {
      const result = generateSchema(input, {
        rootName: rootName.trim() || "Root",
        addDescriptions,
        useNonNull,
        generateQueries,
        generateMutations,
      });
      setOutput(result.schema);
      setStats({
        types: result.typeCount,
        fields: result.fieldCount,
        scalars: result.customScalars,
      });
    } catch {
      setError("Invalid JSON. Check your syntax and try again.");
    }
  }, [input, rootName, addDescriptions, useNonNull, generateQueries, generateMutations, isLimited, recordUsage, trackAction]);

  useKeyboardShortcut("Enter", handleGenerate);

  function handleCopy() {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function handleDownload() {
    const blob = new Blob([output], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "schema.graphql";
    a.click();
    URL.revokeObjectURL(url);
  }

  function loadSample(json: string, name: string) {
    setInput(json);
    setOutput("");
    setError("");
    setStats(null);
    setRootName(name);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="mb-8 block text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        &larr; Back to tools
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        JSON to GraphQL Schema Generator
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Generate GraphQL schema definitions from JSON data. Automatically infers
        types, detects IDs, dates, and nested objects. Optionally generates Query
        and Mutation types.
      </p>

      <RateLimitBanner
        remaining={remaining}
        dailyLimit={dailyLimit}
        isLimited={isLimited}
      />

      {/* Options */}
      <div className="mb-4 space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">
              Root type:
            </label>
            <input
              type="text"
              value={rootName}
              onChange={(e) => setRootName(e.target.value)}
              className="w-32 rounded border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300"
              placeholder="Root"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
            <input
              type="checkbox"
              checked={useNonNull}
              onChange={(e) => setUseNonNull(e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-900"
            />
            Non-null (!)
          </label>

          <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
            <input
              type="checkbox"
              checked={addDescriptions}
              onChange={(e) => setAddDescriptions(e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-900"
            />
            Add descriptions
          </label>

          <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
            <input
              type="checkbox"
              checked={generateQueries}
              onChange={(e) => setGenerateQueries(e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-900"
            />
            Generate Query
          </label>

          <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
            <input
              type="checkbox"
              checked={generateMutations}
              onChange={(e) => setGenerateMutations(e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-900"
            />
            Generate Mutations
          </label>
        </div>
      </div>

      {/* Input */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            JSON Input
          </label>
          <div className="flex gap-3">
            <button
              onClick={() => loadSample(SAMPLE_USER, "User")}
              className="text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              User
            </button>
            <button
              onClick={() => loadSample(SAMPLE_ECOMMERCE, "Product")}
              className="text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              E-Commerce
            </button>
            <button
              onClick={() => loadSample(SAMPLE_API, "ApiResponse")}
              className="text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              API Response
            </button>
          </div>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={'Paste your JSON here...\n{\n  "id": 1,\n  "name": "Alice",\n  "email": "alice@example.com"\n}'}
          rows={14}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 font-mono text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
          spellCheck={false}
        />
      </div>

      {/* Generate button */}
      <button
        onClick={handleGenerate}
        disabled={isLimited || !input.trim()}
        className="mb-6 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-gray-900"
      >
        Generate Schema{" "}
        <kbd className="ml-1.5 hidden rounded bg-indigo-500 px-1.5 py-0.5 text-xs font-medium sm:inline-block">
          Ctrl+Enter
        </kbd>
      </button>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Output */}
      {output && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                GraphQL Schema
              </label>
              {stats && (
                <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                  {stats.types} type{stats.types !== 1 ? "s" : ""} &middot;{" "}
                  {stats.fields} field{stats.fields !== 1 ? "s" : ""}
                  {stats.scalars.length > 0 && (
                    <> &middot; {stats.scalars.join(", ")}</>
                  )}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleDownload}
                className="rounded border border-gray-300 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
              >
                Download .graphql
              </button>
              <button
                onClick={handleCopy}
                className="rounded border border-gray-300 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
          <pre className="max-h-[32rem] overflow-auto rounded-lg border border-gray-200 bg-white p-4 font-mono text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100">
            {output}
          </pre>
        </div>
      )}

      {/* Info */}
      <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          About JSON to GraphQL Schema
        </h2>
        <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
          <li>
            Infers GraphQL scalar types (String, Int, Float, Boolean, ID) from
            JSON values automatically.
          </li>
          <li>
            Detects UUIDs and ID-like fields → <code className="rounded bg-gray-200 px-1 dark:bg-gray-800">ID</code>,
            dates → <code className="rounded bg-gray-200 px-1 dark:bg-gray-800">DateTime</code> /
            <code className="rounded bg-gray-200 px-1 dark:bg-gray-800">Date</code> custom scalars.
          </li>
          <li>
            Nested objects become separate GraphQL types. Arrays of objects are
            merged for complete field coverage.
          </li>
          <li>
            Optionally generates Query type (get by ID, list all) and Mutation
            type (create, update, delete) with input types.
          </li>
          <li>
            Download the schema as a <code className="rounded bg-gray-200 px-1 dark:bg-gray-800">.graphql</code> file
            ready for your server.
          </li>
          <li>
            Everything runs in your browser — no data is sent over the network.
          </li>
        </ul>
      </div>
    </div>
  );
}
