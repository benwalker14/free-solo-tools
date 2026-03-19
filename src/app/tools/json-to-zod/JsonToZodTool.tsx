"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import RateLimitBanner from "@/components/RateLimitBanner";

// ─── Input mode ──────────────────────────────────────────────
type InputMode = "json" | "jsonSchema";

// ─── Options ─────────────────────────────────────────────────
interface ConvertOptions {
  rootName: string;
  optional: boolean;
  strict: boolean;
  coerce: boolean;
  descriptions: boolean;
  inferFormats: boolean;
  defaultValues: boolean;
  readonly: boolean;
}

// ─── Sample data ─────────────────────────────────────────────
const SAMPLE_JSON = `{
  "id": 1,
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "website": "https://alice.dev",
  "isActive": true,
  "age": 30,
  "score": 95.5,
  "role": "admin",
  "status": "active",
  "address": {
    "street": "123 Main St",
    "city": "Springfield",
    "state": "IL",
    "zip": "62704"
  },
  "tags": ["developer", "speaker"],
  "scores": [95, 87, 92],
  "metadata": null,
  "createdAt": "2024-01-15T10:30:00Z",
  "projects": [
    {
      "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "title": "Website Redesign",
      "completed": false
    }
  ]
}`;

const SAMPLE_JSON_SCHEMA = `{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "User",
  "type": "object",
  "required": ["id", "name", "email", "role"],
  "properties": {
    "id": {
      "type": "integer",
      "description": "Unique user identifier",
      "minimum": 1
    },
    "name": {
      "type": "string",
      "minLength": 1,
      "maxLength": 100,
      "description": "Full name"
    },
    "email": {
      "type": "string",
      "format": "email",
      "description": "Email address"
    },
    "website": {
      "type": "string",
      "format": "uri"
    },
    "age": {
      "type": "integer",
      "minimum": 0,
      "maximum": 150
    },
    "role": {
      "type": "string",
      "enum": ["admin", "editor", "viewer"],
      "default": "viewer"
    },
    "status": {
      "type": "string",
      "enum": ["active", "inactive", "suspended"]
    },
    "tags": {
      "type": "array",
      "items": { "type": "string" },
      "minItems": 0,
      "maxItems": 20
    },
    "address": {
      "$ref": "#/$defs/Address"
    },
    "projects": {
      "type": "array",
      "items": { "$ref": "#/$defs/Project" }
    },
    "metadata": {
      "oneOf": [
        { "type": "object", "additionalProperties": true },
        { "type": "null" }
      ]
    }
  },
  "$defs": {
    "Address": {
      "type": "object",
      "required": ["street", "city"],
      "properties": {
        "street": { "type": "string" },
        "city": { "type": "string" },
        "state": { "type": "string", "pattern": "^[A-Z]{2}$" },
        "zip": { "type": "string", "pattern": "^\\\\d{5}(-\\\\d{4})?$" }
      }
    },
    "Project": {
      "type": "object",
      "required": ["id", "title"],
      "properties": {
        "id": { "type": "string", "format": "uuid" },
        "title": { "type": "string", "minLength": 1 },
        "completed": { "type": "boolean", "default": false },
        "priority": {
          "type": "integer",
          "minimum": 1,
          "maximum": 5,
          "default": 3
        }
      }
    }
  }
}`;

// ─── Pattern detection for JSON input ────────────────────────
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

// ─── Naming helpers ──────────────────────────────────────────
function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function toPascalCase(key: string): string {
  return key
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => capitalize(part))
    .join("");
}

function toCamelCase(key: string): string {
  const parts = key.split(/[-_\s]+/).filter(Boolean);
  return parts.map((p, i) => (i === 0 ? p : capitalize(p))).join("");
}

function isValidIdentifier(key: string): boolean {
  return /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key);
}

function quoteKey(key: string): string {
  return isValidIdentifier(key) ? key : `"${key}"`;
}

// ═══════════════════════════════════════════════════════════════
// JSON Schema → Zod converter
// ═══════════════════════════════════════════════════════════════

interface SchemaNode {
  type?: string | string[];
  properties?: Record<string, SchemaNode>;
  required?: string[];
  items?: SchemaNode | SchemaNode[];
  enum?: unknown[];
  const?: unknown;
  $ref?: string;
  allOf?: SchemaNode[];
  anyOf?: SchemaNode[];
  oneOf?: SchemaNode[];
  not?: SchemaNode;
  format?: string;
  pattern?: string;
  minimum?: number;
  maximum?: number;
  exclusiveMinimum?: number;
  exclusiveMaximum?: number;
  minLength?: number;
  maxLength?: number;
  minItems?: number;
  maxItems?: number;
  default?: unknown;
  description?: string;
  additionalProperties?: boolean | SchemaNode;
  nullable?: boolean;
  $defs?: Record<string, SchemaNode>;
  definitions?: Record<string, SchemaNode>;
  title?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface CollectedSchema {
  name: string;
  varName: string;
  body: string;
}

function resolveRef(
  ref: string,
  root: SchemaNode,
): { schema: SchemaNode; name: string } | null {
  // Handle local $ref: #/$defs/Foo or #/definitions/Foo
  const match = ref.match(
    /^#\/(?:\$defs|definitions)\/(.+)$/,
  );
  if (!match) return null;
  const name = match[1];
  const defs = root.$defs || root.definitions || {};
  const schema = defs[name];
  if (!schema) return null;
  return { schema, name };
}

function schemaNodeToZod(
  node: SchemaNode,
  root: SchemaNode,
  collected: CollectedSchema[],
  parentName: string,
  key: string,
  requiredKeys: Set<string>,
  options: ConvertOptions,
  indent: string,
): string {
  // $ref
  if (node.$ref) {
    const resolved = resolveRef(node.$ref, root);
    if (resolved) {
      // Ensure the referenced schema has been collected
      const refVarName = toCamelCase(resolved.name) + "Schema";
      if (!collected.some((c) => c.varName === refVarName)) {
        buildSchemaObject(
          resolved.schema,
          root,
          collected,
          resolved.name,
          options,
        );
      }
      return refVarName;
    }
    return "z.unknown() /* unresolved $ref */";
  }

  // allOf — merge with z.intersection or chained .and()
  if (node.allOf && node.allOf.length > 0) {
    const parts = node.allOf.map((sub, i) =>
      schemaNodeToZod(
        sub,
        root,
        collected,
        parentName,
        `${key}AllOf${i}`,
        requiredKeys,
        options,
        indent,
      ),
    );
    if (parts.length === 1) return parts[0];
    return parts.reduce((a, b) => `z.intersection(${a}, ${b})`);
  }

  // anyOf / oneOf → z.union
  if (node.anyOf && node.anyOf.length > 0) {
    const parts = node.anyOf.map((sub, i) =>
      schemaNodeToZod(
        sub,
        root,
        collected,
        parentName,
        `${key}AnyOf${i}`,
        requiredKeys,
        options,
        indent,
      ),
    );
    if (parts.length === 1) return parts[0];
    return `z.union([${parts.join(", ")}])`;
  }
  if (node.oneOf && node.oneOf.length > 0) {
    const parts = node.oneOf.map((sub, i) =>
      schemaNodeToZod(
        sub,
        root,
        collected,
        parentName,
        `${key}OneOf${i}`,
        requiredKeys,
        options,
        indent,
      ),
    );
    if (parts.length === 1) return parts[0];
    return `z.union([${parts.join(", ")}])`;
  }

  // enum
  if (node.enum && node.enum.length > 0) {
    const allStrings = node.enum.every((v) => typeof v === "string");
    if (allStrings) {
      const vals = node.enum.map((v) => `"${v}"`).join(", ");
      return `z.enum([${vals}])`;
    }
    const vals = node.enum
      .map((v) => {
        if (typeof v === "string") return `z.literal("${v}")`;
        if (typeof v === "number") return `z.literal(${v})`;
        if (typeof v === "boolean") return `z.literal(${v})`;
        if (v === null) return "z.null()";
        return "z.unknown()";
      })
      .join(", ");
    return `z.union([${vals}])`;
  }

  // const
  if (node.const !== undefined) {
    if (typeof node.const === "string") return `z.literal("${node.const}")`;
    if (typeof node.const === "number" || typeof node.const === "boolean")
      return `z.literal(${node.const})`;
    if (node.const === null) return "z.null()";
    return "z.unknown()";
  }

  // Determine types
  let types: string[] = [];
  if (node.type) {
    types = Array.isArray(node.type) ? node.type : [node.type];
  }

  // nullable handling
  const isNullable =
    node.nullable === true || types.includes("null");
  const nonNullTypes = types.filter((t) => t !== "null");

  // If multiple non-null types, use z.union
  if (nonNullTypes.length > 1) {
    const parts = nonNullTypes.map((t) =>
      buildPrimitiveZod({ ...node, type: t }, root, collected, parentName, key, options, indent),
    );
    let result = `z.union([${parts.join(", ")}])`;
    if (isNullable) result += ".nullable()";
    return result;
  }

  const singleType = nonNullTypes[0] || (types.length === 0 ? undefined : undefined);

  // If no type specified but has properties, treat as object
  if (!singleType && node.properties) {
    return buildObjectZod(node, root, collected, parentName, key, options, indent, isNullable);
  }

  // If no type at all
  if (!singleType) {
    let result = "z.unknown()";
    if (isNullable) result += ".nullable()";
    return result;
  }

  let result = buildPrimitiveZod(
    { ...node, type: singleType },
    root,
    collected,
    parentName,
    key,
    options,
    indent,
  );
  if (isNullable) result += ".nullable()";
  return result;
}

function buildPrimitiveZod(
  node: SchemaNode,
  root: SchemaNode,
  collected: CollectedSchema[],
  parentName: string,
  key: string,
  options: ConvertOptions,
  indent: string,
): string {
  const t = Array.isArray(node.type) ? node.type[0] : node.type;

  switch (t) {
    case "string": {
      let s = options.coerce ? "z.coerce.string()" : "z.string()";
      // format
      if (node.format === "email") s += ".email()";
      else if (node.format === "uri" || node.format === "url") s += ".url()";
      else if (node.format === "uuid") s += ".uuid()";
      else if (node.format === "date-time" || node.format === "datetime")
        s += ".datetime()";
      else if (node.format === "date") s += ".date()";
      else if (node.format === "ipv4") s += '.ip({ version: "v4" })';
      else if (node.format === "ipv6") s += '.ip({ version: "v6" })';
      // constraints
      if (node.minLength !== undefined) s += `.min(${node.minLength})`;
      if (node.maxLength !== undefined) s += `.max(${node.maxLength})`;
      if (node.pattern) s += `.regex(/${node.pattern}/)`;
      return s;
    }
    case "number": {
      let s = options.coerce ? "z.coerce.number()" : "z.number()";
      if (node.minimum !== undefined) s += `.gte(${node.minimum})`;
      if (node.maximum !== undefined) s += `.lte(${node.maximum})`;
      if (node.exclusiveMinimum !== undefined)
        s += `.gt(${node.exclusiveMinimum})`;
      if (node.exclusiveMaximum !== undefined)
        s += `.lt(${node.exclusiveMaximum})`;
      return s;
    }
    case "integer": {
      let s = options.coerce ? "z.coerce.number().int()" : "z.number().int()";
      if (node.minimum !== undefined) s += `.gte(${node.minimum})`;
      if (node.maximum !== undefined) s += `.lte(${node.maximum})`;
      if (node.exclusiveMinimum !== undefined)
        s += `.gt(${node.exclusiveMinimum})`;
      if (node.exclusiveMaximum !== undefined)
        s += `.lt(${node.exclusiveMaximum})`;
      return s;
    }
    case "boolean":
      return options.coerce ? "z.coerce.boolean()" : "z.boolean()";
    case "null":
      return "z.null()";
    case "array": {
      let itemZod = "z.unknown()";
      if (node.items) {
        if (Array.isArray(node.items)) {
          // tuple
          const tupleItems = node.items.map((item, i) =>
            schemaNodeToZod(
              item,
              root,
              collected,
              parentName,
              `${key}Item${i}`,
              new Set(),
              options,
              indent,
            ),
          );
          let s = `z.tuple([${tupleItems.join(", ")}])`;
          if (node.minItems !== undefined) s += `.min(${node.minItems})`;
          if (node.maxItems !== undefined) s += `.max(${node.maxItems})`;
          return s;
        }
        itemZod = schemaNodeToZod(
          node.items,
          root,
          collected,
          parentName,
          `${key}Item`,
          new Set(),
          options,
          indent,
        );
      }
      let s = `z.array(${itemZod})`;
      if (node.minItems !== undefined) s += `.min(${node.minItems})`;
      if (node.maxItems !== undefined) s += `.max(${node.maxItems})`;
      return s;
    }
    case "object":
      return buildObjectZod(node, root, collected, parentName, key, options, indent, false);
    default:
      return "z.unknown()";
  }
}

function buildObjectZod(
  node: SchemaNode,
  root: SchemaNode,
  collected: CollectedSchema[],
  parentName: string,
  key: string,
  options: ConvertOptions,
  _indent: string,
  isNullable: boolean,
): string {
  // If object has no properties, use z.record or z.object({})
  if (!node.properties || Object.keys(node.properties).length === 0) {
    if (node.additionalProperties && typeof node.additionalProperties === "object") {
      const valZod = schemaNodeToZod(
        node.additionalProperties,
        root,
        collected,
        parentName,
        `${key}Value`,
        new Set(),
        options,
        "  ",
      );
      let s = `z.record(z.string(), ${valZod})`;
      if (isNullable) s += ".nullable()";
      return s;
    }
    if (node.additionalProperties === true) {
      let s = "z.record(z.string(), z.unknown())";
      if (isNullable) s += ".nullable()";
      return s;
    }
    let s = `z.object({})${options.strict ? ".strict()" : ""}`;
    if (isNullable) s += ".nullable()";
    return s;
  }

  // Named object → collect as a separate schema
  const typeName = toPascalCase(key || "Root");
  const fullName =
    parentName && key ? `${parentName}${typeName}` : typeName || "Root";

  buildSchemaObject(node, root, collected, fullName, options);

  let ref = `${toCamelCase(fullName)}Schema`;
  if (isNullable) ref += ".nullable()";
  return ref;
}

function buildSchemaObject(
  node: SchemaNode,
  root: SchemaNode,
  collected: CollectedSchema[],
  schemaName: string,
  options: ConvertOptions,
): void {
  const varName = toCamelCase(schemaName) + "Schema";

  // Avoid duplicates
  if (collected.some((c) => c.varName === varName)) return;

  const props = node.properties || {};
  const requiredSet = new Set<string>(node.required || []);
  const entries = Object.entries(props);

  if (entries.length === 0) {
    collected.push({
      name: schemaName,
      varName,
      body: `const ${varName} = z.object({})${options.strict ? ".strict()" : ""};`,
    });
    return;
  }

  const lines = entries.map(([propKey, propSchema]) => {
    let zodType = schemaNodeToZod(
      propSchema,
      root,
      collected,
      schemaName,
      propKey,
      requiredSet,
      options,
      "  ",
    );

    // description
    if (options.descriptions && propSchema.description) {
      zodType += `.describe("${propSchema.description.replace(/"/g, '\\"')}")`;
    }

    // default
    if (options.defaultValues && propSchema.default !== undefined) {
      const defVal =
        typeof propSchema.default === "string"
          ? `"${propSchema.default}"`
          : JSON.stringify(propSchema.default);
      zodType += `.default(${defVal})`;
    }

    // optional (field not in required and not global optional)
    if (!requiredSet.has(propKey) && !options.optional) {
      zodType += ".optional()";
    }

    // global optional
    if (options.optional) {
      zodType += ".optional()";
    }

    // readonly
    if (options.readonly) {
      zodType += ".readonly()";
    }

    return `  ${quoteKey(propKey)}: ${zodType},`;
  });

  const strict = options.strict ? ".strict()" : "";
  const passthrough =
    node.additionalProperties === true ? ".passthrough()" : "";
  collected.push({
    name: schemaName,
    varName,
    body: `const ${varName} = z.object({\n${lines.join("\n")}\n})${strict}${passthrough};`,
  });
}

function convertJsonSchema(input: string, options: ConvertOptions): string {
  const schema: SchemaNode = JSON.parse(input);
  const collected: CollectedSchema[] = [];
  const rootName = options.rootName.trim() || "Root";

  // First, process all $defs/definitions so they are available
  const defs = schema.$defs || schema.definitions || {};
  for (const [defName, defSchema] of Object.entries(defs)) {
    buildSchemaObject(defSchema, schema, collected, defName, options);
  }

  // Process root
  const rootVarName = toCamelCase(rootName) + "Schema";
  if (schema.type === "array" || (Array.isArray(schema.type) && schema.type.includes("array"))) {
    const itemZod = schema.items
      ? schemaNodeToZod(
          schema.items as SchemaNode,
          schema,
          collected,
          rootName,
          rootName + "Item",
          new Set(),
          options,
          "",
        )
      : "z.unknown()";
    collected.push({
      name: rootName,
      varName: rootVarName,
      body: `const ${rootVarName} = z.array(${itemZod});`,
    });
  } else if (schema.properties) {
    buildSchemaObject(schema, schema, collected, rootName, options);
  } else if (schema.type) {
    const zodType = schemaNodeToZod(
      schema,
      schema,
      collected,
      "",
      rootName,
      new Set(),
      options,
      "",
    );
    collected.push({
      name: rootName,
      varName: rootVarName,
      body: `const ${rootVarName} = ${zodType};`,
    });
  } else {
    // Fallback — treat as object
    buildSchemaObject(schema, schema, collected, rootName, options);
  }

  // Deduplicate and order: dependencies first, root last
  const seen = new Set<string>();
  const ordered: CollectedSchema[] = [];
  for (const item of collected) {
    if (!seen.has(item.varName)) {
      seen.add(item.varName);
      ordered.push(item);
    }
  }

  // Move root schema to end
  const rootIdx = ordered.findIndex((s) => s.varName === rootVarName);
  if (rootIdx > -1 && rootIdx < ordered.length - 1) {
    const [rootItem] = ordered.splice(rootIdx, 1);
    ordered.push(rootItem);
  }

  const importLine = 'import { z } from "zod";\n';
  const schemas = ordered.map((s) => s.body).join("\n\n");
  const typeLine = `\ntype ${toPascalCase(rootName)} = z.infer<typeof ${rootVarName}>;`;

  return importLine + "\n" + schemas + typeLine;
}

// ═══════════════════════════════════════════════════════════════
// JSON → Zod converter (infers from data)
// ═══════════════════════════════════════════════════════════════

interface InferCollected {
  name: string;
  varName: string;
  body: string;
}

function inferZodType(
  value: unknown,
  parentName: string,
  key: string,
  collected: InferCollected[],
  options: ConvertOptions,
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
    return options.coerce ? "z.coerce.boolean()" : "z.boolean()";
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return "z.array(z.unknown())";
    const elementTypes = value.map((item) =>
      inferZodType(item, parentName, key, collected, options),
    );
    const unique = [...new Set(elementTypes)];
    if (unique.length === 1) return `z.array(${unique[0]})`;
    return `z.array(z.union([${unique.join(", ")}]))`;
  }

  if (type === "object") {
    const typeName = toPascalCase(key);
    const fullName =
      parentName && key ? `${parentName}${typeName}` : typeName || "Root";
    buildInferredObject(
      value as Record<string, unknown>,
      fullName,
      collected,
      options,
    );
    return `${toCamelCase(fullName)}Schema`;
  }

  return "z.unknown()";
}

function buildInferredObject(
  obj: Record<string, unknown>,
  schemaName: string,
  collected: InferCollected[],
  options: ConvertOptions,
): void {
  const varName = toCamelCase(schemaName) + "Schema";
  if (collected.some((c) => c.varName === varName)) return;

  const entries = Object.entries(obj);
  if (entries.length === 0) {
    collected.push({
      name: schemaName,
      varName,
      body: `const ${varName} = z.object({})${options.strict ? ".strict()" : ""};`,
    });
    return;
  }

  const lines = entries.map(([propKey, value]) => {
    let zodType = inferZodType(value, schemaName, propKey, collected, options);

    if (options.descriptions) {
      const label = propKey
        .replace(/([A-Z])/g, " $1")
        .replace(/[-_]/g, " ")
        .trim()
        .toLowerCase();
      zodType += `.describe("${label}")`;
    }

    if (options.optional) {
      zodType += ".optional()";
    }

    if (options.readonly) {
      zodType += ".readonly()";
    }

    return `  ${quoteKey(propKey)}: ${zodType},`;
  });

  const strict = options.strict ? ".strict()" : "";
  collected.push({
    name: schemaName,
    varName,
    body: `const ${varName} = z.object({\n${lines.join("\n")}\n})${strict};`,
  });
}

function convertJson(input: string, options: ConvertOptions): string {
  const parsed = JSON.parse(input);
  const collected: InferCollected[] = [];
  const rootName = options.rootName.trim() || "Root";
  const rootVarName = toCamelCase(rootName) + "Schema";

  if (Array.isArray(parsed)) {
    if (parsed.length === 0) {
      return `import { z } from "zod";\n\nconst ${rootVarName} = z.array(z.unknown());\n\ntype ${toPascalCase(rootName)} = z.infer<typeof ${rootVarName}>;`;
    }
    const first = parsed[0];
    if (first !== null && typeof first === "object" && !Array.isArray(first)) {
      const merged: Record<string, unknown> = {};
      for (const item of parsed) {
        if (item && typeof item === "object" && !Array.isArray(item)) {
          for (const [k, v] of Object.entries(item as Record<string, unknown>)) {
            if (!(k in merged) || merged[k] === null) merged[k] = v;
          }
        }
      }
      const itemName = rootName + "Item";
      buildInferredObject(merged, itemName, collected, options);
      collected.push({
        name: rootName,
        varName: rootVarName,
        body: `const ${rootVarName} = z.array(${toCamelCase(itemName)}Schema);`,
      });
    } else {
      const elementType = inferZodType(first, "", rootName, collected, options);
      return `import { z } from "zod";\n\nconst ${rootVarName} = z.array(${elementType});\n\ntype ${toPascalCase(rootName)} = z.infer<typeof ${rootVarName}>;`;
    }
  } else if (parsed !== null && typeof parsed === "object") {
    buildInferredObject(
      parsed as Record<string, unknown>,
      rootName,
      collected,
      options,
    );
  } else {
    const t = inferZodType(parsed, "", rootName, collected, options);
    return `import { z } from "zod";\n\nconst ${rootVarName} = ${t};\n\ntype ${toPascalCase(rootName)} = z.infer<typeof ${rootVarName}>;`;
  }

  // Deduplicate
  const seen = new Set<string>();
  const ordered: InferCollected[] = [];
  for (const item of collected) {
    if (!seen.has(item.varName)) {
      seen.add(item.varName);
      ordered.push(item);
    }
  }

  // Move root to end
  const rootIdx = ordered.findIndex((s) => s.varName === rootVarName);
  if (rootIdx > -1 && rootIdx < ordered.length - 1) {
    const [rootItem] = ordered.splice(rootIdx, 1);
    ordered.push(rootItem);
  }

  const importLine = 'import { z } from "zod";\n';
  const schemas = ordered.map((s) => s.body).join("\n\n");
  const typeLine = `\ntype ${toPascalCase(rootName)} = z.infer<typeof ${rootVarName}>;`;

  return importLine + "\n" + schemas + typeLine;
}

// ─── Auto-detect input mode ──────────────────────────────────
function detectInputMode(input: string): InputMode {
  try {
    const parsed = JSON.parse(input);
    if (
      parsed &&
      typeof parsed === "object" &&
      !Array.isArray(parsed) &&
      (parsed.$schema ||
        parsed.type === "object" ||
        parsed.type === "array" ||
        parsed.properties ||
        parsed.$defs ||
        parsed.definitions ||
        parsed.allOf ||
        parsed.anyOf ||
        parsed.oneOf)
    ) {
      // Looks like JSON Schema if it has schema-specific keywords
      if (
        parsed.$schema ||
        parsed.$defs ||
        parsed.definitions ||
        (parsed.properties && parsed.type)
      ) {
        return "jsonSchema";
      }
    }
  } catch {
    // not valid JSON
  }
  return "json";
}

// ═══════════════════════════════════════════════════════════════
// Component
// ═══════════════════════════════════════════════════════════════

export default function JsonToZodTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState<InputMode>("json");
  const [rootName, setRootName] = useState("User");
  const [optional, setOptional] = useState(false);
  const [strict, setStrict] = useState(false);
  const [coerce, setCoerce] = useState(false);
  const [descriptions, setDescriptions] = useState(false);
  const [inferFormats, setInferFormats] = useState(true);
  const [defaultValues, setDefaultValues] = useState(true);
  const [readonly, setReadonly] = useState(false);
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState<{
    schemas: number;
    fields: number;
    enums: number;
  } | null>(null);

  const { trackAction } = useToolAnalytics("json-to-zod");
  const { remaining, dailyLimit, isLimited, recordUsage } =
    useRateLimit("json-to-zod");

  const handleConvert = useCallback(() => {
    setError("");
    setOutput("");
    setCopied(false);
    setStats(null);

    if (!input.trim()) {
      setError("Please enter JSON or a JSON Schema to convert.");
      return;
    }

    if (isLimited) return;
    recordUsage();
    trackAction("convert");

    try {
      const effectiveMode = mode === "json" ? "json" : "jsonSchema";
      const opts: ConvertOptions = {
        rootName: rootName.trim() || "Root",
        optional,
        strict,
        coerce,
        descriptions,
        inferFormats,
        defaultValues,
        readonly,
      };

      const result =
        effectiveMode === "jsonSchema"
          ? convertJsonSchema(input, opts)
          : convertJson(input, opts);

      setOutput(result);

      // Calculate stats
      const schemaCount = (result.match(/const \w+Schema = /g) || []).length;
      const fieldCount = (result.match(/^\s{2}\w+:/gm) || []).length +
        (result.match(/^\s{2}"/gm) || []).length;
      const enumCount = (result.match(/z\.enum\(/g) || []).length;
      setStats({ schemas: schemaCount, fields: fieldCount, enums: enumCount });
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Invalid input. Check your syntax.";
      setError(
        mode === "jsonSchema"
          ? `Invalid JSON Schema: ${message}`
          : `Invalid JSON: ${message}`,
      );
    }
  }, [
    input,
    mode,
    rootName,
    optional,
    strict,
    coerce,
    descriptions,
    inferFormats,
    defaultValues,
    readonly,
    isLimited,
    recordUsage,
    trackAction,
  ]);

  useKeyboardShortcut("Enter", handleConvert);

  function handleCopy() {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function handleDownload() {
    const blob = new Blob([output], { type: "text/typescript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${toCamelCase(rootName || "schema")}.ts`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleLoadSample() {
    if (mode === "jsonSchema") {
      setInput(SAMPLE_JSON_SCHEMA);
    } else {
      setInput(SAMPLE_JSON);
    }
    setOutput("");
    setError("");
    setStats(null);
  }

  function handleAutoDetect() {
    if (!input.trim()) return;
    const detected = detectInputMode(input);
    setMode(detected);
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
        JSON to Zod Converter
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Convert JSON or JSON Schema to Zod validation schemas. Supports{" "}
        <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">
          $ref
        </code>
        ,{" "}
        <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">
          allOf/oneOf/anyOf
        </code>
        ,{" "}
        <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">
          enum
        </code>
        , format constraints, and nested objects.
      </p>

      <RateLimitBanner
        remaining={remaining}
        dailyLimit={dailyLimit}
        isLimited={isLimited}
      />

      {/* Input mode toggle */}
      <div className="mb-4 flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Input:
        </span>
        <div className="inline-flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
          <button
            onClick={() => {
              setMode("json");
              setOutput("");
              setError("");
              setStats(null);
            }}
            className={`px-3 py-1.5 text-sm font-medium transition-colors ${
              mode === "json"
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            JSON
          </button>
          <button
            onClick={() => {
              setMode("jsonSchema");
              setOutput("");
              setError("");
              setStats(null);
            }}
            className={`px-3 py-1.5 text-sm font-medium transition-colors ${
              mode === "jsonSchema"
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            JSON Schema
          </button>
        </div>
        {input.trim() && (
          <button
            onClick={handleAutoDetect}
            className="text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            Auto-detect
          </button>
        )}
      </div>

      {/* Options */}
      <div className="mb-4 flex flex-wrap items-center gap-4">
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

        <label className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
          <input
            type="checkbox"
            checked={defaultValues}
            onChange={(e) => setDefaultValues(e.target.checked)}
            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          .default()
        </label>

        <label className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
          <input
            type="checkbox"
            checked={readonly}
            onChange={(e) => setReadonly(e.target.checked)}
            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          .readonly()
        </label>
      </div>

      {/* Input */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {mode === "jsonSchema" ? "JSON Schema Input" : "JSON Input"}
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
          placeholder={
            mode === "jsonSchema"
              ? '{\n  "$schema": "http://json-schema.org/draft-07/schema#",\n  "type": "object",\n  "properties": { ... }\n}'
              : '{\n  "name": "Alice",\n  "email": "alice@example.com",\n  "age": 30\n}'
          }
          rows={16}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 font-mono text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
          spellCheck={false}
        />
      </div>

      {/* Convert button */}
      <button
        onClick={handleConvert}
        disabled={isLimited || !input.trim()}
        className="mb-6 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-gray-900"
      >
        Convert to Zod{" "}
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
                Zod Schema Output
              </label>
              {stats && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {stats.schemas} schema{stats.schemas !== 1 ? "s" : ""} &middot;{" "}
                  {stats.fields} field{stats.fields !== 1 ? "s" : ""}
                  {stats.enums > 0 && (
                    <>
                      {" "}
                      &middot; {stats.enums} enum{stats.enums !== 1 ? "s" : ""}
                    </>
                  )}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownload}
                className="rounded border border-gray-300 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
              >
                Download .ts
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
          About JSON to Zod Converter
        </h2>
        <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
          <li>
            <strong>Two input modes</strong> — paste raw JSON data to infer
            schemas, or paste a JSON Schema for precise conversion with{" "}
            <code className="text-xs">$ref</code>,{" "}
            <code className="text-xs">allOf</code>/{" "}
            <code className="text-xs">oneOf</code>/{" "}
            <code className="text-xs">anyOf</code>, and constraints.
          </li>
          <li>
            <strong>JSON Schema support</strong> — converts{" "}
            <code className="text-xs">required</code>,{" "}
            <code className="text-xs">enum</code>,{" "}
            <code className="text-xs">const</code>,{" "}
            <code className="text-xs">format</code> (email, uri, uuid,
            date-time, ipv4, ipv6),{" "}
            <code className="text-xs">pattern</code>,{" "}
            <code className="text-xs">minimum</code>/
            <code className="text-xs">maximum</code>,{" "}
            <code className="text-xs">minLength</code>/
            <code className="text-xs">maxLength</code>,{" "}
            <code className="text-xs">default</code>, and{" "}
            <code className="text-xs">$defs</code>/
            <code className="text-xs">definitions</code>.
          </li>
          <li>
            <strong>Smart inference</strong> — detects emails, URLs, UUIDs, and
            ISO dates in raw JSON values and adds appropriate Zod refinements.
          </li>
          <li>
            <strong>Required vs optional</strong> — JSON Schema{" "}
            <code className="text-xs">required</code> arrays map to required
            fields; all others get <code className="text-xs">.optional()</code>.
          </li>
          <li>
            <strong>TypeScript type</strong> — generates{" "}
            <code className="text-xs">z.infer&lt;typeof schema&gt;</code> so you
            get TypeScript types for free.
          </li>
          <li>
            Everything runs in your browser — no data is sent over the network.
          </li>
        </ul>
      </div>
    </div>
  );
}
