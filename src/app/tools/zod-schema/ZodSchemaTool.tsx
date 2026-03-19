"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import RateLimitBanner from "@/components/RateLimitBanner";

const SAMPLE_JSON = `{
  "id": 1,
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "website": "https://alice.dev",
  "isActive": true,
  "age": 30,
  "score": 95.5,
  "role": "admin",
  "address": {
    "street": "123 Main St",
    "city": "Springfield",
    "state": "IL",
    "zip": "62704"
  },
  "tags": ["developer", "speaker"],
  "scores": [95, 87, 92],
  "metadata": null,
  "projects": [
    {
      "id": 101,
      "title": "Website Redesign",
      "completed": false
    }
  ]
}`;

interface GeneratorOptions {
  rootName: string;
  optional: boolean;
  strict: boolean;
  coerce: boolean;
  descriptions: boolean;
  inferFormats: boolean;
}

// Pattern detection for smart string refinements
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_RE = /^https?:\/\/.+/;
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2})?/;

function detectStringFormat(value: string): string | null {
  if (EMAIL_RE.test(value)) return "email";
  if (UUID_RE.test(value)) return "uuid";
  if (URL_RE.test(value)) return "url";
  if (ISO_DATE_RE.test(value)) return "datetime";
  return null;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function toCamelCase(key: string): string {
  return key
    .split(/[-_\s]+/)
    .map((part, i) => (i === 0 ? part : capitalize(part)))
    .join("");
}

function toPascalCase(key: string): string {
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

interface CollectedSchema {
  name: string;
  body: string;
}

function inferZodType(
  value: unknown,
  parentName: string,
  key: string,
  collected: CollectedSchema[],
  options: GeneratorOptions,
  indent: string,
): string {
  if (value === null || value === undefined) return "z.null()";

  const type = typeof value;

  if (type === "string") {
    const str = value as string;
    if (options.coerce) return "z.coerce.string()";
    if (options.inferFormats && str.length > 0) {
      const format = detectStringFormat(str);
      if (format === "email") return "z.string().email()";
      if (format === "uuid") return "z.string().uuid()";
      if (format === "url") return "z.string().url()";
      if (format === "datetime") return "z.string().datetime()";
    }
    return "z.string()";
  }

  if (type === "number") {
    if (options.coerce) return "z.coerce.number()";
    if (Number.isInteger(value)) return "z.number().int()";
    return "z.number()";
  }

  if (type === "boolean") {
    if (options.coerce) return "z.coerce.boolean()";
    return "z.boolean()";
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return "z.array(z.unknown())";

    const elementTypes = value.map((item) =>
      inferZodType(item, parentName, key, collected, options, indent),
    );
    const unique = [...new Set(elementTypes)];

    if (unique.length === 1) return `z.array(${unique[0]})`;
    return `z.array(z.union([${unique.join(", ")}]))`;
  }

  if (type === "object") {
    const typeName = toPascalCase(key);
    const fullName =
      parentName && key ? `${parentName}${typeName}` : typeName || "Root";

    buildObjectSchema(
      value as Record<string, unknown>,
      fullName,
      collected,
      options,
    );
    return `${toCamelCase(fullName)}Schema`;
  }

  return "z.unknown()";
}

function buildObjectSchema(
  obj: Record<string, unknown>,
  schemaName: string,
  collected: CollectedSchema[],
  options: GeneratorOptions,
): void {
  const entries = Object.entries(obj);

  if (entries.length === 0) {
    collected.push({
      name: schemaName,
      body: `const ${toCamelCase(schemaName)}Schema = z.object({})${options.strict ? ".strict()" : ""};`,
    });
    return;
  }

  const lines = entries.map(([key, value]) => {
    let zodType = inferZodType(
      value,
      schemaName,
      key,
      collected,
      options,
      "  ",
    );

    if (options.descriptions) {
      const label = key
        .replace(/([A-Z])/g, " $1")
        .replace(/[-_]/g, " ")
        .trim()
        .toLowerCase();
      zodType += `.describe("${label}")`;
    }

    if (options.optional) {
      zodType += ".optional()";
    }

    return `  ${quoteKey(key)}: ${zodType},`;
  });

  const strict = options.strict ? ".strict()" : "";
  collected.push({
    name: schemaName,
    body: `const ${toCamelCase(schemaName)}Schema = z.object({\n${lines.join("\n")}\n})${strict};`,
  });
}

function generateZodSchema(json: string, options: GeneratorOptions): string {
  const parsed = JSON.parse(json);
  const collected: CollectedSchema[] = [];
  const rootVarName = toCamelCase(options.rootName || "Root");

  if (Array.isArray(parsed)) {
    if (parsed.length === 0) {
      return `const ${rootVarName}Schema = z.array(z.unknown());`;
    }
    const first = parsed[0];
    if (first !== null && typeof first === "object" && !Array.isArray(first)) {
      // Merge all array items for a complete schema
      const merged: Record<string, unknown> = {};
      for (const item of parsed) {
        if (item && typeof item === "object" && !Array.isArray(item)) {
          for (const [k, v] of Object.entries(
            item as Record<string, unknown>,
          )) {
            if (!(k in merged) || merged[k] === null) {
              merged[k] = v;
            }
          }
        }
      }
      const itemName = options.rootName + "Item";
      buildObjectSchema(merged, itemName, collected, options);
      collected.push({
        name: options.rootName,
        body: `const ${rootVarName}Schema = z.array(${toCamelCase(itemName)}Schema);`,
      });
    } else {
      const elementType = inferZodType(
        first,
        "",
        options.rootName,
        collected,
        options,
        "",
      );
      return `const ${rootVarName}Schema = z.array(${elementType});`;
    }
  } else if (parsed !== null && typeof parsed === "object") {
    buildObjectSchema(
      parsed as Record<string, unknown>,
      options.rootName,
      collected,
      options,
    );
  } else {
    const t = inferZodType(
      parsed,
      "",
      options.rootName,
      collected,
      options,
      "",
    );
    return `const ${rootVarName}Schema = ${t};`;
  }

  // Dependencies first, root last
  collected.reverse();

  // Build output with import + type inference
  const importLine = 'import { z } from "zod";\n';
  const schemas = collected.map((s) => s.body).join("\n\n");
  const typeLine = `\ntype ${toPascalCase(options.rootName)} = z.infer<typeof ${rootVarName}Schema>;`;

  return importLine + "\n" + schemas + typeLine;
}

export default function ZodSchemaTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [rootName, setRootName] = useState("User");
  const [optional, setOptional] = useState(false);
  const [strict, setStrict] = useState(false);
  const [coerce, setCoerce] = useState(false);
  const [descriptions, setDescriptions] = useState(false);
  const [inferFormats, setInferFormats] = useState(true);
  const [copied, setCopied] = useState(false);

  const { trackAction } = useToolAnalytics("zod-schema");
  const { remaining, dailyLimit, isLimited, recordUsage } =
    useRateLimit("zod-schema");

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
      const result = generateZodSchema(input, {
        rootName: rootName.trim() || "Root",
        optional,
        strict,
        coerce,
        descriptions,
        inferFormats,
      });
      setOutput(result);
    } catch {
      setError("Invalid JSON. Check your syntax and try again.");
    }
  }, [
    input,
    rootName,
    optional,
    strict,
    coerce,
    descriptions,
    inferFormats,
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
        Zod Schema Generator
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Generate Zod validation schemas from JSON data. Detects emails, URLs,
        UUIDs, dates, integers, and nested objects automatically.
      </p>

      <RateLimitBanner
        remaining={remaining}
        dailyLimit={dailyLimit}
        isLimited={isLimited}
      />

      {/* Options */}
      <div className="mb-4 flex flex-wrap items-center gap-4">
        {/* Root name */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 dark:text-gray-400">
            Schema name:
          </label>
          <input
            type="text"
            value={rootName}
            onChange={(e) => setRootName(e.target.value)}
            className="w-32 rounded border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="User"
          />
        </div>

        {/* Checkboxes */}
        <label className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
          <input
            type="checkbox"
            checked={optional}
            onChange={(e) => setOptional(e.target.checked)}
            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          .optional()
        </label>

        <label className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
          <input
            type="checkbox"
            checked={strict}
            onChange={(e) => setStrict(e.target.checked)}
            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          .strict()
        </label>

        <label className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
          <input
            type="checkbox"
            checked={coerce}
            onChange={(e) => setCoerce(e.target.checked)}
            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          Coerce
        </label>

        <label className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
          <input
            type="checkbox"
            checked={descriptions}
            onChange={(e) => setDescriptions(e.target.checked)}
            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          .describe()
        </label>

        <label className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
          <input
            type="checkbox"
            checked={inferFormats}
            onChange={(e) => setInferFormats(e.target.checked)}
            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          Infer formats
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
          placeholder={'{\n  "name": "Alice",\n  "email": "alice@example.com",\n  "age": 30\n}'}
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
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Zod Schema Output
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
          About Zod Schema Generator
        </h2>
        <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
          <li>
            <strong>Zod</strong> is the most popular TypeScript-first schema
            validation library, used with tRPC, React Hook Form, Next.js server
            actions, and more.
          </li>
          <li>
            <strong>Format inference</strong> — detects emails, URLs, UUIDs, and
            ISO dates in string values and applies{" "}
            <code className="text-xs">.email()</code>,{" "}
            <code className="text-xs">.url()</code>,{" "}
            <code className="text-xs">.uuid()</code>,{" "}
            <code className="text-xs">.datetime()</code> refinements.
          </li>
          <li>
            <strong>Integers</strong> — whole numbers get{" "}
            <code className="text-xs">.int()</code>, decimals stay as{" "}
            <code className="text-xs">z.number()</code>.
          </li>
          <li>
            <strong>.strict()</strong> — rejects objects with unknown keys at
            runtime, great for API input validation.
          </li>
          <li>
            <strong>Coerce</strong> — uses{" "}
            <code className="text-xs">z.coerce.string()</code> etc. to
            auto-convert incoming values (useful for form data and query
            params).
          </li>
          <li>
            <strong>Type inference</strong> — generates a{" "}
            <code className="text-xs">z.infer&lt;typeof schema&gt;</code> type
            alias so you get TypeScript types for free.
          </li>
          <li>
            Everything runs in your browser — no data is sent over the network.
          </li>
        </ul>
      </div>
    </div>
  );
}
