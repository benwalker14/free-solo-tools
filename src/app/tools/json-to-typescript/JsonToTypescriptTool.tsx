"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import RateLimitBanner from "@/components/RateLimitBanner";

type OutputStyle = "interface" | "type";

const SAMPLE_JSON = `{
  "id": 1,
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "isActive": true,
  "age": 30,
  "address": {
    "street": "123 Main St",
    "city": "Springfield",
    "state": "IL",
    "zip": "62704",
    "coordinates": {
      "lat": 39.7817,
      "lng": -89.6501
    }
  },
  "roles": ["admin", "editor"],
  "scores": [95, 87, 92],
  "metadata": null,
  "projects": [
    {
      "id": 101,
      "title": "Website Redesign",
      "tags": ["frontend", "design"],
      "completed": false
    },
    {
      "id": 102,
      "title": "API Migration",
      "tags": ["backend"],
      "completed": true
    }
  ]
}`;

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function toTypeName(key: string): string {
  // Convert snake_case, kebab-case, or plain words to PascalCase
  return key
    .split(/[-_\s]+/)
    .map((part) => capitalize(part))
    .join("");
}

function isValidIdentifier(key: string): boolean {
  return /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key);
}

function quoteKey(key: string): string {
  return isValidIdentifier(key) ? key : `"${key}"`;
}

interface GeneratorOptions {
  rootName: string;
  style: OutputStyle;
  makeOptional: boolean;
  makeReadonly: boolean;
  inlineNestedObjects: boolean;
}

interface GeneratedType {
  name: string;
  body: string;
}

function inferType(
  value: unknown,
  parentName: string,
  key: string,
  collectedTypes: GeneratedType[],
  options: GeneratorOptions,
): string {
  if (value === null) return "null";
  if (value === undefined) return "undefined";

  const type = typeof value;

  if (type === "string") return "string";
  if (type === "number") return "number";
  if (type === "boolean") return "boolean";

  if (Array.isArray(value)) {
    if (value.length === 0) return "unknown[]";

    const elementTypes = value.map((item) =>
      inferType(item, parentName, key, collectedTypes, options),
    );

    // Deduplicate
    const unique = [...new Set(elementTypes)];

    if (unique.length === 1) return `${unique[0]}[]`;
    return `(${unique.join(" | ")})[]`;
  }

  if (type === "object") {
    const typeName = toTypeName(key);
    const fullTypeName =
      parentName && key ? `${parentName}${typeName}` : typeName || "Root";

    if (options.inlineNestedObjects) {
      return buildInlineType(
        value as Record<string, unknown>,
        fullTypeName,
        collectedTypes,
        options,
      );
    }

    buildNamedType(
      value as Record<string, unknown>,
      fullTypeName,
      collectedTypes,
      options,
    );
    return fullTypeName;
  }

  return "unknown";
}

function buildInlineType(
  obj: Record<string, unknown>,
  parentName: string,
  collectedTypes: GeneratedType[],
  options: GeneratorOptions,
): string {
  const entries = Object.entries(obj);
  if (entries.length === 0) return "Record<string, unknown>";

  const lines = entries.map(([key, value]) => {
    const valueType = inferType(value, parentName, key, collectedTypes, options);
    const prefix = options.makeReadonly ? "readonly " : "";
    const opt = options.makeOptional ? "?" : "";
    return `${prefix}${quoteKey(key)}${opt}: ${valueType}`;
  });

  return `{ ${lines.join("; ")} }`;
}

function buildNamedType(
  obj: Record<string, unknown>,
  typeName: string,
  collectedTypes: GeneratedType[],
  options: GeneratorOptions,
): void {
  const entries = Object.entries(obj);

  if (entries.length === 0) {
    collectedTypes.push({
      name: typeName,
      body:
        options.style === "interface"
          ? `interface ${typeName} {\n  [key: string]: unknown;\n}`
          : `type ${typeName} = Record<string, unknown>;`,
    });
    return;
  }

  const lines = entries.map(([key, value]) => {
    const valueType = inferType(value, typeName, key, collectedTypes, options);
    const prefix = options.makeReadonly ? "readonly " : "";
    const opt = options.makeOptional ? "?" : "";
    return `  ${prefix}${quoteKey(key)}${opt}: ${valueType};`;
  });

  if (options.style === "interface") {
    collectedTypes.push({
      name: typeName,
      body: `interface ${typeName} {\n${lines.join("\n")}\n}`,
    });
  } else {
    collectedTypes.push({
      name: typeName,
      body: `type ${typeName} = {\n${lines.join("\n")}\n};`,
    });
  }
}

function generateTypescript(json: string, options: GeneratorOptions): string {
  const parsed = JSON.parse(json);
  const collectedTypes: GeneratedType[] = [];

  if (Array.isArray(parsed)) {
    if (parsed.length === 0) {
      return options.style === "interface"
        ? `interface ${options.rootName} {\n  [key: string]: unknown;\n}`
        : `type ${options.rootName} = Record<string, unknown>;`;
    }
    // Infer from the first element if it's an object
    const first = parsed[0];
    if (first !== null && typeof first === "object" && !Array.isArray(first)) {
      // Merge keys from all array elements for a more complete type
      const merged: Record<string, unknown> = {};
      for (const item of parsed) {
        if (item && typeof item === "object" && !Array.isArray(item)) {
          for (const [k, v] of Object.entries(item as Record<string, unknown>)) {
            if (!(k in merged) || merged[k] === null) {
              merged[k] = v;
            }
          }
        }
      }
      buildNamedType(merged, options.rootName, collectedTypes, options);
    } else {
      const elementType = inferType(
        first,
        "",
        options.rootName,
        collectedTypes,
        options,
      );
      return `type ${options.rootName} = ${elementType};`;
    }
  } else if (parsed !== null && typeof parsed === "object") {
    buildNamedType(
      parsed as Record<string, unknown>,
      options.rootName,
      collectedTypes,
      options,
    );
  } else {
    const t = inferType(parsed, "", options.rootName, collectedTypes, options);
    return `type ${options.rootName} = ${t};`;
  }

  // Reverse so that the root type is last (dependencies defined first)
  collectedTypes.reverse();
  return collectedTypes.map((t) => t.body).join("\n\n");
}

export default function JsonToTypescriptTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [rootName, setRootName] = useState("Root");
  const [style, setStyle] = useState<OutputStyle>("interface");
  const [makeOptional, setMakeOptional] = useState(false);
  const [makeReadonly, setMakeReadonly] = useState(false);
  const [inlineNestedObjects, setInlineNestedObjects] = useState(false);
  const [copied, setCopied] = useState(false);

  const { trackAction } = useToolAnalytics("json-to-typescript");
  const { remaining, dailyLimit, isLimited, recordUsage } =
    useRateLimit("json-to-typescript");

  const handleGenerate = useCallback(() => {
    setError("");
    setOutput("");
    setCopied(false);

    if (!input.trim()) {
      setError("Please enter some JSON to convert.");
      return;
    }

    if (isLimited) return;
    recordUsage();
    trackAction("generate");

    try {
      const result = generateTypescript(input, {
        rootName: rootName.trim() || "Root",
        style,
        makeOptional,
        makeReadonly,
        inlineNestedObjects,
      });
      setOutput(result);
    } catch {
      setError("Invalid JSON. Check your syntax and try again.");
    }
  }, [
    input,
    rootName,
    style,
    makeOptional,
    makeReadonly,
    inlineNestedObjects,
    isLimited,
    recordUsage,
    trackAction,
  ]);

  useKeyboardShortcut("Enter", handleGenerate);

  function handleCopy() {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function handleLoadSample() {
    setInput(SAMPLE_JSON);
    setOutput("");
    setError("");
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
        JSON to TypeScript
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Generate TypeScript interfaces or type aliases from JSON data. Handles
        nested objects, arrays, nulls, and mixed types.
      </p>

      <RateLimitBanner
        remaining={remaining}
        dailyLimit={dailyLimit}
        isLimited={isLimited}
      />

      {/* Options */}
      <div className="mb-4 flex flex-wrap items-center gap-4">
        {/* Style toggle */}
        <div className="flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
          <button
            onClick={() => setStyle("interface")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              style === "interface"
                ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
            }`}
          >
            interface
          </button>
          <button
            onClick={() => setStyle("type")}
            className={`px-4 py-2 text-sm font-medium transition-colors border-l border-gray-300 dark:border-gray-600 ${
              style === "type"
                ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
            }`}
          >
            type
          </button>
        </div>

        {/* Root name */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 dark:text-gray-400">
            Root name:
          </label>
          <input
            type="text"
            value={rootName}
            onChange={(e) => setRootName(e.target.value)}
            className="w-32 rounded border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="Root"
          />
        </div>

        {/* Checkboxes */}
        <label className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
          <input
            type="checkbox"
            checked={makeOptional}
            onChange={(e) => setMakeOptional(e.target.checked)}
            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          Optional props
        </label>

        <label className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
          <input
            type="checkbox"
            checked={makeReadonly}
            onChange={(e) => setMakeReadonly(e.target.checked)}
            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          Readonly
        </label>

        <label className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
          <input
            type="checkbox"
            checked={inlineNestedObjects}
            onChange={(e) => setInlineNestedObjects(e.target.checked)}
            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          Inline nested
        </label>
      </div>

      {/* Input */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            JSON Input
          </label>
          <button
            onClick={handleLoadSample}
            className="text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            Load sample
          </button>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={'{\n  "name": "Alice",\n  "age": 30,\n  "active": true\n}'}
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
        Generate{" "}
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
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              TypeScript Output
            </label>
            <button
              onClick={handleCopy}
              className="rounded border border-gray-300 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <pre className="max-h-96 overflow-auto rounded-lg border border-gray-200 bg-white p-4 font-mono text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100">
            {output}
          </pre>
        </div>
      )}

      {/* Info */}
      <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          About JSON to TypeScript
        </h2>
        <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
          <li>
            <strong>Interfaces vs Types</strong> — interfaces are extendable and
            commonly used for object shapes; type aliases support unions and
            intersections.
          </li>
          <li>
            <strong>Nested objects</strong> — by default, each nested object gets
            its own named type. Enable &quot;Inline nested&quot; to embed them
            directly.
          </li>
          <li>
            <strong>Arrays</strong> — element types are inferred from all items.
            Mixed-type arrays become union types (e.g.,{" "}
            <code className="text-xs">(string | number)[]</code>).
          </li>
          <li>
            <strong>Root arrays</strong> — if your JSON is an array of objects,
            all objects are merged to produce a complete type.
          </li>
          <li>
            <strong>Null values</strong> — inferred as <code className="text-xs">null</code>.
            Enable &quot;Optional props&quot; to mark all properties with{" "}
            <code className="text-xs">?</code>.
          </li>
          <li>
            Everything runs in your browser — no data is sent over the network.
          </li>
        </ul>
      </div>
    </div>
  );
}
