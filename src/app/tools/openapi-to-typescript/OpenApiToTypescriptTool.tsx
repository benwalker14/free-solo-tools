"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import yaml from "js-yaml";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";
import RateLimitBanner from "@/components/RateLimitBanner";

// ─── Sample OpenAPI spec ───
const SAMPLE_SPEC = `openapi: "3.0.3"
info:
  title: Bookstore API
  version: "1.0.0"
paths:
  /books:
    get:
      operationId: listBooks
      summary: List all books
      parameters:
        - name: genre
          in: query
          schema:
            $ref: "#/components/schemas/Genre"
        - name: limit
          in: query
          schema:
            type: integer
      responses:
        "200":
          description: List of books
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: "#/components/schemas/Book"
    post:
      operationId: createBook
      summary: Create a book
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/CreateBookRequest"
      responses:
        "201":
          description: Created
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Book"
  /books/{bookId}:
    get:
      operationId: getBook
      summary: Get a book by ID
      parameters:
        - name: bookId
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        "200":
          description: A single book
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Book"
    put:
      operationId: updateBook
      parameters:
        - name: bookId
          in: path
          required: true
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/UpdateBookRequest"
      responses:
        "200":
          description: Updated
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Book"
    delete:
      operationId: deleteBook
      parameters:
        - name: bookId
          in: path
          required: true
          schema:
            type: string
      responses:
        "204":
          description: Deleted
components:
  schemas:
    Genre:
      type: string
      enum:
        - fiction
        - non-fiction
        - science
        - history
        - biography
    Author:
      type: object
      required:
        - name
      properties:
        name:
          type: string
        bio:
          type: string
          nullable: true
        website:
          type: string
          format: uri
    Book:
      type: object
      required:
        - id
        - title
        - author
        - genre
      properties:
        id:
          type: string
          format: uuid
          description: Unique book identifier
        title:
          type: string
          description: Book title
        author:
          $ref: "#/components/schemas/Author"
        genre:
          $ref: "#/components/schemas/Genre"
        publishedYear:
          type: integer
          description: Year the book was published
        tags:
          type: array
          items:
            type: string
        metadata:
          type: object
          additionalProperties:
            type: string
    CreateBookRequest:
      allOf:
        - $ref: "#/components/schemas/UpdateBookRequest"
        - type: object
          required:
            - title
            - author
            - genre
    UpdateBookRequest:
      type: object
      properties:
        title:
          type: string
        author:
          $ref: "#/components/schemas/Author"
        genre:
          $ref: "#/components/schemas/Genre"
        publishedYear:
          type: integer
        tags:
          type: array
          items:
            type: string
    PaginatedResponse:
      type: object
      properties:
        data:
          type: array
          items: {}
        total:
          type: integer
        page:
          type: integer
        pageSize:
          type: integer`;

const SAMPLE_SWAGGER = `swagger: "2.0"
info:
  title: User API
  version: "1.0.0"
basePath: /api/v1
paths:
  /users:
    get:
      operationId: listUsers
      produces:
        - application/json
      parameters:
        - name: role
          in: query
          type: string
          enum:
            - admin
            - user
            - guest
      responses:
        "200":
          description: List of users
          schema:
            type: array
            items:
              $ref: "#/definitions/User"
    post:
      operationId: createUser
      consumes:
        - application/json
      parameters:
        - name: body
          in: body
          required: true
          schema:
            $ref: "#/definitions/CreateUserRequest"
      responses:
        "201":
          description: Created
          schema:
            $ref: "#/definitions/User"
definitions:
  Address:
    type: object
    properties:
      street:
        type: string
      city:
        type: string
      country:
        type: string
  User:
    type: object
    required:
      - id
      - email
      - role
    properties:
      id:
        type: integer
        format: int64
      email:
        type: string
        format: email
      name:
        type: string
      role:
        type: string
        enum:
          - admin
          - user
          - guest
      address:
        $ref: "#/definitions/Address"
      createdAt:
        type: string
        format: date-time
  CreateUserRequest:
    type: object
    required:
      - email
      - role
    properties:
      email:
        type: string
        format: email
      name:
        type: string
      role:
        type: string
        enum:
          - admin
          - user
          - guest`;

// ─── Types ───
/* eslint-disable @typescript-eslint/no-explicit-any */
type Schema = Record<string, any>;
type OpenAPISpec = Record<string, any>;

interface ConvertOptions {
  style: "interface" | "type";
  exportKeyword: boolean;
  readonlyProps: boolean;
  optionalByDefault: boolean;
  addJSDoc: boolean;
  generatePathTypes: boolean;
  inlineSmallSchemas: boolean;
}

// ─── Converter logic ───

function pascalCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");
}

function resolveRef(spec: OpenAPISpec, ref: string): Schema | null {
  if (!ref.startsWith("#/")) return null;
  const parts = ref.slice(2).split("/");
  let current: any = spec;
  for (const part of parts) {
    if (current == null || typeof current !== "object") return null;
    current = current[part];
  }
  return current ?? null;
}

function getRefName(ref: string): string {
  const parts = ref.split("/");
  return pascalCase(parts[parts.length - 1]);
}

function schemaToType(
  schema: Schema | null | undefined,
  spec: OpenAPISpec,
  options: ConvertOptions,
  indent: number = 0,
  visited: Set<string> = new Set()
): string {
  if (!schema) return "unknown";

  // $ref
  if (schema.$ref) {
    return getRefName(schema.$ref);
  }

  // allOf
  if (schema.allOf) {
    const parts = (schema.allOf as Schema[]).map((s) =>
      schemaToType(s, spec, options, indent, visited)
    );
    return parts.join(" & ");
  }

  // oneOf
  if (schema.oneOf) {
    const parts = (schema.oneOf as Schema[]).map((s) =>
      schemaToType(s, spec, options, indent, visited)
    );
    return parts.join(" | ");
  }

  // anyOf
  if (schema.anyOf) {
    const parts = (schema.anyOf as Schema[]).map((s) =>
      schemaToType(s, spec, options, indent, visited)
    );
    return parts.join(" | ");
  }

  // enum
  if (schema.enum) {
    return (schema.enum as any[])
      .map((v) => (typeof v === "string" ? `"${v}"` : String(v)))
      .join(" | ");
  }

  const type = schema.type;
  const nullable = schema.nullable === true;
  const wrap = (t: string) => (nullable ? `${t} | null` : t);

  // array
  if (type === "array") {
    const itemType = schemaToType(
      schema.items || {},
      spec,
      options,
      indent,
      visited
    );
    const needsParens = itemType.includes(" | ") || itemType.includes(" & ");
    return wrap(needsParens ? `(${itemType})[]` : `${itemType}[]`);
  }

  // object
  if (type === "object" || schema.properties) {
    const props = schema.properties as Record<string, Schema> | undefined;
    if (!props || Object.keys(props).length === 0) {
      if (schema.additionalProperties) {
        if (
          typeof schema.additionalProperties === "object" &&
          Object.keys(schema.additionalProperties).length > 0
        ) {
          const valType = schemaToType(
            schema.additionalProperties,
            spec,
            options,
            indent,
            visited
          );
          return wrap(`Record<string, ${valType}>`);
        }
        return wrap("Record<string, unknown>");
      }
      return wrap("Record<string, unknown>");
    }
    const required = new Set<string>(
      (schema.required as string[]) || []
    );
    const pad = "  ".repeat(indent + 1);
    const closing = "  ".repeat(indent);
    const lines: string[] = [];
    lines.push("{");
    for (const [key, propSchema] of Object.entries(props)) {
      const isRequired = required.has(key) && !options.optionalByDefault;
      const opt = isRequired ? "" : "?";
      const ro = options.readonlyProps ? "readonly " : "";
      const propType = schemaToType(
        propSchema,
        spec,
        options,
        indent + 1,
        visited
      );
      if (options.addJSDoc && propSchema.description) {
        lines.push(`${pad}/** ${propSchema.description} */`);
      }
      lines.push(`${pad}${ro}${safePropName(key)}${opt}: ${propType};`);
    }
    if (schema.additionalProperties) {
      const valType =
        typeof schema.additionalProperties === "object" &&
        Object.keys(schema.additionalProperties).length > 0
          ? schemaToType(
              schema.additionalProperties,
              spec,
              options,
              indent + 1,
              visited
            )
          : "unknown";
      lines.push(`${pad}[key: string]: ${valType};`);
    }
    lines.push(`${closing}}`);
    return wrap(lines.join("\n"));
  }

  // primitives
  if (type === "string") return wrap("string");
  if (type === "integer" || type === "number") return wrap("number");
  if (type === "boolean") return wrap("boolean");

  return wrap("unknown");
}

function safePropName(key: string): string {
  if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key)) return key;
  return `"${key}"`;
}

function generateInterfaces(
  spec: OpenAPISpec,
  options: ConvertOptions
): string {
  const lines: string[] = [];
  const isSwagger = !!spec.swagger;
  const schemas: Record<string, Schema> = isSwagger
    ? spec.definitions || {}
    : spec.components?.schemas || {};

  // Header comment
  lines.push("// Generated by DevBolt OpenAPI to TypeScript Converter");
  lines.push(
    `// Source: ${spec.info?.title || "Unknown API"} v${spec.info?.version || "?"}`
  );
  lines.push(
    `// Spec: ${isSwagger ? `Swagger ${spec.swagger}` : `OpenAPI ${spec.openapi}`}`
  );
  lines.push("");

  // Generate type for each schema
  for (const [name, schema] of Object.entries(schemas)) {
    const typeName = pascalCase(name);

    // JSDoc
    if (options.addJSDoc && schema.description) {
      lines.push(`/** ${schema.description} */`);
    }

    const exp = options.exportKeyword ? "export " : "";

    // Enum shortcut: generate a union type alias regardless of style
    if (schema.enum && schema.type === "string") {
      const values = (schema.enum as string[])
        .map((v) => `"${v}"`)
        .join(" | ");
      lines.push(`${exp}type ${typeName} = ${values};`);
      lines.push("");
      continue;
    }

    if (schema.enum) {
      const values = (schema.enum as any[])
        .map((v) => (typeof v === "string" ? `"${v}"` : String(v)))
        .join(" | ");
      lines.push(`${exp}type ${typeName} = ${values};`);
      lines.push("");
      continue;
    }

    // allOf: use intersection
    if (schema.allOf) {
      const typeBody = schemaToType(schema, spec, options, 0, new Set());
      lines.push(`${exp}type ${typeName} = ${typeBody};`);
      lines.push("");
      continue;
    }

    // oneOf/anyOf: use union
    if (schema.oneOf || schema.anyOf) {
      const typeBody = schemaToType(schema, spec, options, 0, new Set());
      lines.push(`${exp}type ${typeName} = ${typeBody};`);
      lines.push("");
      continue;
    }

    // Object with properties
    if (schema.type === "object" || schema.properties) {
      if (options.style === "interface" && !schema.additionalProperties) {
        // Interface
        const required = new Set<string>(
          (schema.required as string[]) || []
        );
        const props = (schema.properties || {}) as Record<string, Schema>;
        lines.push(`${exp}interface ${typeName} {`);
        for (const [key, propSchema] of Object.entries(props)) {
          const isRequired =
            required.has(key) && !options.optionalByDefault;
          const opt = isRequired ? "" : "?";
          const ro = options.readonlyProps ? "readonly " : "";
          const propType = schemaToType(
            propSchema,
            spec,
            options,
            1,
            new Set()
          );
          if (options.addJSDoc && propSchema.description) {
            lines.push(`  /** ${propSchema.description} */`);
          }
          lines.push(`  ${ro}${safePropName(key)}${opt}: ${propType};`);
        }
        lines.push("}");
      } else {
        // Type alias
        const typeBody = schemaToType(schema, spec, options, 0, new Set());
        lines.push(`${exp}type ${typeName} = ${typeBody};`);
      }
      lines.push("");
      continue;
    }

    // Fallback: simple type alias
    const typeBody = schemaToType(schema, spec, options, 0, new Set());
    lines.push(`${exp}type ${typeName} = ${typeBody};`);
    lines.push("");
  }

  // Generate path/operation types
  if (options.generatePathTypes && spec.paths) {
    lines.push("// ─── API Operation Types ───");
    lines.push("");

    for (const [path, pathItem] of Object.entries(spec.paths as Record<string, any>)) {
      const methods = ["get", "post", "put", "patch", "delete", "options", "head"];
      for (const method of methods) {
        const op = pathItem[method];
        if (!op) continue;

        const opName = op.operationId
          ? pascalCase(op.operationId)
          : pascalCase(`${method}_${path.replace(/[^a-zA-Z0-9]/g, "_")}`);

        // Path params
        const pathParams = extractParams(op, pathItem, "path", spec, isSwagger);
        const queryParams = extractParams(op, pathItem, "query", spec, isSwagger);

        // Path params type
        if (pathParams.length > 0) {
          const exp = options.exportKeyword ? "export " : "";
          lines.push(`${exp}interface ${opName}PathParams {`);
          for (const p of pathParams) {
            const opt = p.required ? "" : "?";
            if (options.addJSDoc && p.description) {
              lines.push(`  /** ${p.description} */`);
            }
            lines.push(`  ${safePropName(p.name)}${opt}: ${p.type};`);
          }
          lines.push("}");
          lines.push("");
        }

        // Query params type
        if (queryParams.length > 0) {
          const exp = options.exportKeyword ? "export " : "";
          lines.push(`${exp}interface ${opName}QueryParams {`);
          for (const p of queryParams) {
            const opt = p.required ? "" : "?";
            if (options.addJSDoc && p.description) {
              lines.push(`  /** ${p.description} */`);
            }
            lines.push(`  ${safePropName(p.name)}${opt}: ${p.type};`);
          }
          lines.push("}");
          lines.push("");
        }

        // Request body type
        const bodyType = extractRequestBody(op, spec, options, isSwagger);
        if (bodyType) {
          const exp = options.exportKeyword ? "export " : "";
          lines.push(`${exp}type ${opName}RequestBody = ${bodyType};`);
          lines.push("");
        }

        // Response type
        const responseType = extractResponseType(op, spec, options, isSwagger);
        if (responseType) {
          const exp = options.exportKeyword ? "export " : "";
          lines.push(`${exp}type ${opName}Response = ${responseType};`);
          lines.push("");
        }
      }
    }
  }

  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim() + "\n";
}

interface ParamInfo {
  name: string;
  type: string;
  required: boolean;
  description?: string;
}

function extractParams(
  op: any,
  pathItem: any,
  location: string,
  spec: OpenAPISpec,
  isSwagger: boolean
): ParamInfo[] {
  const params: ParamInfo[] = [];
  const allParams = [...(pathItem.parameters || []), ...(op.parameters || [])];

  for (let p of allParams) {
    if (p.$ref) {
      const resolved = resolveRef(spec, p.$ref);
      if (resolved) p = resolved;
      else continue;
    }
    if (p.in !== location) continue;

    let type = "string";
    if (isSwagger) {
      type = swaggerParamType(p);
    } else if (p.schema) {
      type = schemaToType(p.schema, spec, {
        style: "type",
        exportKeyword: false,
        readonlyProps: false,
        optionalByDefault: false,
        addJSDoc: false,
        generatePathTypes: false,
        inlineSmallSchemas: false,
      }, 0, new Set());
    }

    params.push({
      name: p.name,
      type,
      required: p.required ?? false,
      description: p.description,
    });
  }

  return params;
}

function swaggerParamType(p: any): string {
  if (p.enum) {
    return p.enum.map((v: any) => typeof v === "string" ? `"${v}"` : String(v)).join(" | ");
  }
  const t = p.type;
  if (t === "integer" || t === "number") return "number";
  if (t === "boolean") return "boolean";
  if (t === "array" && p.items) {
    const itemType = swaggerParamType(p.items);
    return `${itemType}[]`;
  }
  return "string";
}

function extractRequestBody(
  op: any,
  spec: OpenAPISpec,
  options: ConvertOptions,
  isSwagger: boolean
): string | null {
  if (isSwagger) {
    const bodyParam = (op.parameters || []).find(
      (p: any) => p.in === "body"
    );
    if (!bodyParam?.schema) return null;
    return schemaToType(bodyParam.schema, spec, options, 0, new Set());
  }

  const content = op.requestBody?.content;
  if (!content) return null;
  const jsonContent =
    content["application/json"] || content["*/*"] || Object.values(content)[0];
  if (!jsonContent || !(jsonContent as any).schema) return null;
  return schemaToType((jsonContent as any).schema, spec, options, 0, new Set());
}

function extractResponseType(
  op: any,
  spec: OpenAPISpec,
  options: ConvertOptions,
  isSwagger: boolean
): string | null {
  const responses = op.responses;
  if (!responses) return null;

  // Find success response (2xx)
  const successKey = Object.keys(responses).find(
    (k) => k.startsWith("2") || k === "default"
  );
  if (!successKey) return null;
  const response = responses[successKey];

  if (isSwagger) {
    if (!response.schema) return null;
    return schemaToType(response.schema, spec, options, 0, new Set());
  }

  const content = response.content;
  if (!content) return null;
  const jsonContent =
    content["application/json"] || content["*/*"] || Object.values(content)[0];
  if (!jsonContent || !(jsonContent as any).schema) return null;
  return schemaToType((jsonContent as any).schema, spec, options, 0, new Set());
}

// ─── Component ───

export default function OpenApiToTypescriptTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [stats, setStats] = useState<{
    schemas: number;
    operations: number;
    specVersion: string;
  } | null>(null);
  const [options, setOptions] = useState<ConvertOptions>({
    style: "interface",
    exportKeyword: true,
    readonlyProps: false,
    optionalByDefault: false,
    addJSDoc: true,
    generatePathTypes: true,
    inlineSmallSchemas: false,
  });
  const [copied, setCopied] = useState(false);

  const { trackAction } = useToolAnalytics("openapi-to-typescript");
  const { remaining, dailyLimit, isLimited, recordUsage } =
    useRateLimit("openapi-to-typescript");

  const handleConvert = useCallback(() => {
    if (isLimited || !input.trim()) return;
    recordUsage();
    setError("");
    setOutput("");
    setStats(null);

    try {
      let spec: OpenAPISpec;
      const trimmed = input.trim();

      // Parse as JSON or YAML
      if (trimmed.startsWith("{")) {
        spec = JSON.parse(trimmed);
      } else {
        spec = yaml.load(trimmed) as OpenAPISpec;
      }

      if (typeof spec !== "object" || spec === null) {
        setError("Invalid input: could not parse as JSON or YAML.");
        return;
      }

      // Validate it's an OpenAPI/Swagger spec
      const isSwagger = !!spec.swagger;
      const isOpenAPI = !!spec.openapi;
      if (!isSwagger && !isOpenAPI) {
        setError(
          'Not a valid OpenAPI spec. Expected "openapi" or "swagger" field at the root.'
        );
        return;
      }

      // Count schemas and operations
      const schemas = isSwagger
        ? spec.definitions || {}
        : spec.components?.schemas || {};
      const schemaCount = Object.keys(schemas).length;

      let operationCount = 0;
      if (spec.paths) {
        for (const pathItem of Object.values(spec.paths as Record<string, any>)) {
          for (const method of ["get", "post", "put", "patch", "delete", "options", "head"]) {
            if (pathItem[method]) operationCount++;
          }
        }
      }

      if (schemaCount === 0 && operationCount === 0) {
        setError(
          "No schemas or operations found in this spec. Add schemas under components.schemas (OpenAPI 3.x) or definitions (Swagger 2.0)."
        );
        return;
      }

      const result = generateInterfaces(spec, options);
      setOutput(result);
      setStats({
        schemas: schemaCount,
        operations: operationCount,
        specVersion: isSwagger
          ? `Swagger ${spec.swagger}`
          : `OpenAPI ${spec.openapi}`,
      });
      trackAction("convert");
    } catch (e: any) {
      setError(e.message || "Failed to parse input.");
    }
  }, [input, options, isLimited, recordUsage, trackAction]);

  useKeyboardShortcut("Enter", handleConvert);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    trackAction("copy");
  }, [output, trackAction]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([output], { type: "text/typescript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "api-types.ts";
    a.click();
    URL.revokeObjectURL(url);
    trackAction("download");
  }, [output, trackAction]);

  const loadSample = useCallback(
    (sample: string, label: string) => {
      setInput(sample);
      setOutput("");
      setError("");
      setStats(null);
      trackAction("load-sample");
      // Track which sample
      void label;
    },
    [trackAction]
  );

  const handleClear = useCallback(() => {
    setInput("");
    setOutput("");
    setError("");
    setStats(null);
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="mb-8 block text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        &larr; Back to tools
      </Link>

      <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
        OpenAPI to TypeScript Converter
      </h1>
      <p className="mb-8 text-gray-600 dark:text-gray-400">
        Paste an OpenAPI 3.x or Swagger 2.0 spec (JSON or YAML) and generate
        TypeScript interfaces, types, and API operation types. Handles $ref
        resolution, allOf/oneOf/anyOf, enums, and nested objects.
      </p>

      <RateLimitBanner
        remaining={remaining}
        dailyLimit={dailyLimit}
        isLimited={isLimited}
      />

      {/* Options */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
          Options
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {/* Style */}
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <span className="whitespace-nowrap">Style:</span>
            <select
              value={options.style}
              onChange={(e) =>
                setOptions((o) => ({
                  ...o,
                  style: e.target.value as "interface" | "type",
                }))
              }
              className="rounded border border-gray-300 bg-white px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-700"
            >
              <option value="interface">interface</option>
              <option value="type">type alias</option>
            </select>
          </label>

          {/* Toggle options */}
          {[
            {
              key: "exportKeyword" as const,
              label: "export",
            },
            {
              key: "readonlyProps" as const,
              label: "readonly",
            },
            {
              key: "optionalByDefault" as const,
              label: "all optional",
            },
            {
              key: "addJSDoc" as const,
              label: "JSDoc",
            },
            {
              key: "generatePathTypes" as const,
              label: "API types",
            },
          ].map(({ key, label }) => (
            <label
              key={key}
              className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
            >
              <input
                type="checkbox"
                checked={options[key]}
                onChange={(e) =>
                  setOptions((o) => ({ ...o, [key]: e.target.checked }))
                }
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      {/* Samples */}
      <div className="mb-4 flex flex-wrap gap-2">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Samples:
        </span>
        <button
          onClick={() => loadSample(SAMPLE_SPEC, "OpenAPI 3.0")}
          className="rounded-md bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        >
          OpenAPI 3.0 (Bookstore)
        </button>
        <button
          onClick={() => loadSample(SAMPLE_SWAGGER, "Swagger 2.0")}
          className="rounded-md bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        >
          Swagger 2.0 (Users)
        </button>
      </div>

      {/* Input */}
      <div className="mb-4">
        <div className="mb-1 flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            OpenAPI / Swagger Spec (JSON or YAML)
          </label>
          {input && (
            <button
              onClick={handleClear}
              className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Clear
            </button>
          )}
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Paste your OpenAPI 3.x or Swagger 2.0 spec here (JSON or YAML)...`}
          rows={14}
          spellCheck={false}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 font-mono text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
        />
      </div>

      {/* Convert button */}
      <button
        onClick={handleConvert}
        disabled={isLimited || !input.trim()}
        className="mb-6 w-full rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-gray-900 sm:w-auto"
      >
        Convert to TypeScript (Ctrl+Enter)
      </button>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Stats */}
      {stats && (
        <div className="mb-4 flex flex-wrap gap-4 rounded-lg border border-indigo-200 bg-indigo-50 p-3 text-sm dark:border-indigo-800 dark:bg-indigo-900/30">
          <span className="text-indigo-700 dark:text-indigo-300">
            <strong>Spec:</strong> {stats.specVersion}
          </span>
          <span className="text-indigo-700 dark:text-indigo-300">
            <strong>Schemas:</strong> {stats.schemas}
          </span>
          <span className="text-indigo-700 dark:text-indigo-300">
            <strong>Operations:</strong> {stats.operations}
          </span>
        </div>
      )}

      {/* Output */}
      {output && (
        <div className="mb-8">
          <div className="mb-1 flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              TypeScript Output
            </label>
            <div className="flex gap-2">
              <button
                onClick={handleDownload}
                className="rounded-md bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                Download .ts
              </button>
              <button
                onClick={handleCopy}
                className="rounded-md bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
          <pre className="max-h-[600px] overflow-auto rounded-lg border border-gray-300 bg-gray-50 p-4 font-mono text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100">
            {output}
          </pre>
        </div>
      )}

      {/* How it works */}
      <div className="space-y-6 border-t border-gray-200 pt-8 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          How It Works
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
              Schema Conversion
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Extracts all schemas from <code>components.schemas</code> (OpenAPI
              3.x) or <code>definitions</code> (Swagger 2.0) and generates
              TypeScript interfaces or type aliases with proper types, optional
              fields, and nested objects.
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
              $ref Resolution
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Follows <code>$ref</code> pointers within the spec to resolve
              references to other schemas, producing clean type names
              (e.g., <code>$ref: &quot;#/components/schemas/Pet&quot;</code> →{" "}
              <code>Pet</code>).
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
              Composition Types
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Handles <code>allOf</code> (intersection types),{" "}
              <code>oneOf</code> and <code>anyOf</code> (union types), and{" "}
              <code>enum</code> values as string literal unions.
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
              API Operation Types
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Optionally generates typed path parameters, query parameters,
              request bodies, and response types from your API&apos;s path
              definitions. Uses <code>operationId</code> for naming.
            </p>
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Supported Features
        </h2>
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="grid gap-2 text-sm text-gray-600 dark:text-gray-400 sm:grid-cols-2">
            <div>
              <strong className="text-gray-900 dark:text-white">
                Schema Types:
              </strong>{" "}
              string, number, integer, boolean, object, array
            </div>
            <div>
              <strong className="text-gray-900 dark:text-white">
                Composition:
              </strong>{" "}
              allOf, oneOf, anyOf, $ref
            </div>
            <div>
              <strong className="text-gray-900 dark:text-white">
                Enums:
              </strong>{" "}
              String and numeric enum → union types
            </div>
            <div>
              <strong className="text-gray-900 dark:text-white">
                Nullable:
              </strong>{" "}
              nullable: true → <code>Type | null</code>
            </div>
            <div>
              <strong className="text-gray-900 dark:text-white">
                Maps:
              </strong>{" "}
              additionalProperties → <code>Record&lt;string, T&gt;</code>
            </div>
            <div>
              <strong className="text-gray-900 dark:text-white">
                Output:
              </strong>{" "}
              interface or type alias, export, readonly, JSDoc
            </div>
            <div>
              <strong className="text-gray-900 dark:text-white">
                Specs:
              </strong>{" "}
              OpenAPI 3.0.x, 3.1.x, Swagger 2.0
            </div>
            <div>
              <strong className="text-gray-900 dark:text-white">
                Operations:
              </strong>{" "}
              Path, query, body, and response types
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
