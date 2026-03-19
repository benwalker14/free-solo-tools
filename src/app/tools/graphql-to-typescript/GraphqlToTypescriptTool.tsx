"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import RateLimitBanner from "@/components/RateLimitBanner";

// ── Types ──────────────────────────────────────────────────────────────────

interface ConvertOptions {
  readonlyTypes: boolean;
  exportTypes: boolean;
  addComments: boolean;
  useTypeInsteadOfInterface: boolean;
  optionalFields: boolean;
  enumAsConst: boolean;
  scalarMappings: Record<string, string>;
  prefixInterfaces: string;
}

interface ParsedField {
  name: string;
  type: string;
  nullable: boolean;
  description?: string;
  args?: ParsedField[];
}

interface ParsedType {
  kind:
    | "type"
    | "input"
    | "enum"
    | "union"
    | "interface"
    | "scalar"
    | "query"
    | "mutation"
    | "subscription";
  name: string;
  fields: ParsedField[];
  values?: string[]; // enum values
  unionTypes?: string[]; // union members
  interfaces?: string[]; // implements
  description?: string;
}

// ── Default scalar mappings ────────────────────────────────────────────────

const DEFAULT_SCALAR_MAP: Record<string, string> = {
  String: "string",
  Int: "number",
  Float: "number",
  Boolean: "boolean",
  ID: "string",
  DateTime: "string",
  Date: "string",
  Time: "string",
  JSON: "Record<string, unknown>",
  JSONObject: "Record<string, unknown>",
  Upload: "File",
  BigInt: "bigint",
  Decimal: "string",
  URL: "string",
  UUID: "string",
  Void: "void",
};

// ── Samples ────────────────────────────────────────────────────────────────

const SAMPLES: { name: string; schema: string }[] = [
  {
    name: "Blog API",
    schema: `"""A blog post"""
type Post {
  id: ID!
  title: String!
  content: String!
  slug: String!
  published: Boolean!
  createdAt: DateTime!
  updatedAt: DateTime
  author: User!
  tags: [Tag!]!
  comments: [Comment!]!
}

type User {
  id: ID!
  name: String!
  email: String!
  avatar: String
  bio: String
  posts: [Post!]!
  role: UserRole!
}

type Comment {
  id: ID!
  body: String!
  author: User!
  post: Post!
  createdAt: DateTime!
}

type Tag {
  id: ID!
  name: String!
  slug: String!
  posts: [Post!]!
}

enum UserRole {
  ADMIN
  EDITOR
  AUTHOR
  READER
}

input CreatePostInput {
  title: String!
  content: String!
  slug: String
  published: Boolean
  tagIds: [ID!]
}

input UpdatePostInput {
  title: String
  content: String
  slug: String
  published: Boolean
  tagIds: [ID!]
}

type Query {
  posts(limit: Int, offset: Int, published: Boolean): [Post!]!
  post(id: ID!): Post
  users: [User!]!
  user(id: ID!): User
  tags: [Tag!]!
}

type Mutation {
  createPost(input: CreatePostInput!): Post!
  updatePost(id: ID!, input: UpdatePostInput!): Post
  deletePost(id: ID!): Boolean!
  register(name: String!, email: String!, password: String!): User!
}

scalar DateTime`,
  },
  {
    name: "E-Commerce",
    schema: `type Product {
  id: ID!
  name: String!
  description: String
  price: Float!
  currency: Currency!
  images: [String!]!
  category: Category!
  inStock: Boolean!
  variants: [ProductVariant!]
}

type ProductVariant {
  id: ID!
  name: String!
  sku: String!
  price: Float!
  stock: Int!
  attributes: [Attribute!]!
}

type Attribute {
  key: String!
  value: String!
}

type Category {
  id: ID!
  name: String!
  slug: String!
  parent: Category
  children: [Category!]!
}

type Order {
  id: ID!
  items: [OrderItem!]!
  total: Float!
  status: OrderStatus!
  shippingAddress: Address!
  createdAt: DateTime!
}

type OrderItem {
  product: Product!
  quantity: Int!
  price: Float!
}

type Address {
  street: String!
  city: String!
  state: String
  zip: String!
  country: String!
}

enum Currency {
  USD
  EUR
  GBP
  JPY
  CAD
}

enum OrderStatus {
  PENDING
  CONFIRMED
  SHIPPED
  DELIVERED
  CANCELLED
  REFUNDED
}

union SearchResult = Product | Category

input ProductFilter {
  categoryId: ID
  minPrice: Float
  maxPrice: Float
  inStock: Boolean
  search: String
}

type Query {
  products(filter: ProductFilter, limit: Int, offset: Int): [Product!]!
  product(id: ID!): Product
  categories: [Category!]!
  orders: [Order!]!
  search(query: String!): [SearchResult!]!
}

scalar DateTime`,
  },
  {
    name: "GitHub-like",
    schema: `interface Node {
  id: ID!
}

type Repository implements Node {
  id: ID!
  name: String!
  fullName: String!
  description: String
  isPrivate: Boolean!
  isFork: Boolean!
  stargazerCount: Int!
  forkCount: Int!
  owner: User!
  defaultBranch: String!
  languages: [Language!]!
  license: String
  createdAt: DateTime!
  updatedAt: DateTime!
}

type User implements Node {
  id: ID!
  login: String!
  name: String
  avatarUrl: String!
  bio: String
  company: String
  location: String
  followers: Int!
  following: Int!
  repositories(first: Int, after: String): RepositoryConnection!
}

type Language {
  name: String!
  color: String
  percentage: Float!
}

type RepositoryConnection {
  edges: [RepositoryEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type RepositoryEdge {
  node: Repository!
  cursor: String!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}

type Issue implements Node {
  id: ID!
  number: Int!
  title: String!
  body: String
  state: IssueState!
  author: User!
  assignees: [User!]!
  labels: [Label!]!
  createdAt: DateTime!
}

type Label {
  name: String!
  color: String!
  description: String
}

enum IssueState {
  OPEN
  CLOSED
}

type Query {
  repository(owner: String!, name: String!): Repository
  user(login: String!): User
  search(query: String!, type: SearchType!, first: Int): SearchResultConnection!
}

enum SearchType {
  REPOSITORY
  USER
  ISSUE
}

type SearchResultConnection {
  nodes: [Node!]!
  totalCount: Int!
}

scalar DateTime`,
  },
  {
    name: "Simple Types",
    schema: `type User {
  id: ID!
  name: String!
  email: String!
  age: Int
}

type Post {
  id: ID!
  title: String!
  body: String!
  author: User!
}

enum Status {
  ACTIVE
  INACTIVE
  BANNED
}

input CreateUserInput {
  name: String!
  email: String!
  age: Int
}`,
  },
];

// ── Parser ─────────────────────────────────────────────────────────────────

function parseGraphQLSchema(schema: string): ParsedType[] {
  const types: ParsedType[] = [];
  // Remove single-line comments
  const cleaned = schema.replace(/#[^\n]*/g, "");

  // Match type definitions with optional description
  const blockRegex =
    /(?:"""([\s\S]*?)"""\s*)?(?:"([^"]*?)"\s*)?(type|input|enum|union|interface|scalar)\s+(\w+)(?:\s+implements\s+([\w\s&,]+))?\s*(?:\{([\s\S]*?)\})?/g;

  let match;
  while ((match = blockRegex.exec(cleaned)) !== null) {
    const description = (match[1] || match[2] || "").trim();
    const kind = match[3] as ParsedType["kind"];
    const name = match[4];
    const implementsStr = match[5];
    const body = match[6] || "";

    if (kind === "scalar") {
      types.push({
        kind: "scalar",
        name,
        fields: [],
        description: description || undefined,
      });
      continue;
    }

    if (kind === "enum") {
      const values = body
        .split("\n")
        .map((l) => l.replace(/"""[\s\S]*?"""/g, "").replace(/"[^"]*"/g, "").trim())
        .filter((l) => l && !l.startsWith("#"));
      types.push({
        kind: "enum",
        name,
        fields: [],
        values,
        description: description || undefined,
      });
      continue;
    }

    if (kind === "union") {
      // union Foo = Bar | Baz — body might be empty, check rest of line
      const unionMatch = cleaned
        .substring(match.index)
        .match(/union\s+\w+\s*=\s*([^\n{]+)/);
      const unionTypes = unionMatch
        ? unionMatch[1].split("|").map((t) => t.trim()).filter(Boolean)
        : [];
      types.push({
        kind: "union",
        name,
        fields: [],
        unionTypes,
        description: description || undefined,
      });
      continue;
    }

    const mappedKind =
      name === "Query"
        ? "query"
        : name === "Mutation"
          ? "mutation"
          : name === "Subscription"
            ? "subscription"
            : (kind as ParsedType["kind"]);

    const interfaces = implementsStr
      ? implementsStr.split(/[&,]/).map((i) => i.trim()).filter(Boolean)
      : undefined;

    const fields = parseFields(body);

    types.push({
      kind: mappedKind,
      name,
      fields,
      interfaces,
      description: description || undefined,
    });
  }

  return types;
}

function parseFields(body: string): ParsedField[] {
  const fields: ParsedField[] = [];
  // Remove multi-line descriptions within field block
  const cleaned = body.replace(/"""[\s\S]*?"""/g, "");
  const lines = cleaned.split("\n");

  let currentDescription = "";

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    // Single-line description
    const descMatch = trimmed.match(/^"([^"]*)"$/);
    if (descMatch) {
      currentDescription = descMatch[1];
      continue;
    }

    // Field line: name(args): Type or name: Type
    const fieldMatch = trimmed.match(
      /^(\w+)(?:\(([^)]*)\))?\s*:\s*(.+?)$/
    );
    if (fieldMatch) {
      const name = fieldMatch[1];
      const argsStr = fieldMatch[2];
      const typeStr = fieldMatch[3].trim();

      const { tsType, nullable } = parseGraphQLType(typeStr);
      const args = argsStr ? parseArguments(argsStr) : undefined;

      fields.push({
        name,
        type: tsType,
        nullable,
        description: currentDescription || undefined,
        args: args && args.length > 0 ? args : undefined,
      });
      currentDescription = "";
    }
  }

  return fields;
}

function parseArguments(argsStr: string): ParsedField[] {
  const args: ParsedField[] = [];
  // Split on commas not inside brackets
  let depth = 0;
  let current = "";
  for (const char of argsStr) {
    if (char === "[" || char === "(") depth++;
    if (char === "]" || char === ")") depth--;
    if (char === "," && depth === 0) {
      if (current.trim()) args.push(parseArgField(current.trim()));
      current = "";
    } else {
      current += char;
    }
  }
  if (current.trim()) args.push(parseArgField(current.trim()));
  return args;
}

function parseArgField(arg: string): ParsedField {
  const match = arg.match(/^(\w+)\s*:\s*(.+?)(?:\s*=\s*.+)?$/);
  if (!match) return { name: arg, type: "unknown", nullable: true };
  const { tsType, nullable } = parseGraphQLType(match[2].trim());
  return { name: match[1], type: tsType, nullable };
}

function parseGraphQLType(typeStr: string): {
  tsType: string;
  nullable: boolean;
} {
  // Store raw for nullable check
  const rawType = typeStr.trim();
  const isNonNull = rawType.endsWith("!");
  const inner = isNonNull ? rawType.slice(0, -1) : rawType;

  // List type: [Type!]! or [Type]! or [Type!] or [Type]
  const listMatch = inner.match(/^\[(.+)\]$/);
  if (listMatch) {
    const { tsType: itemType } = parseGraphQLType(listMatch[1]);
    return { tsType: `${itemType}[]`, nullable: !isNonNull };
  }

  // Named type
  return { tsType: inner.replace("!", ""), nullable: !isNonNull };
}

// ── Generator ──────────────────────────────────────────────────────────────

function generateTypeScript(
  types: ParsedType[],
  options: ConvertOptions
): string {
  const lines: string[] = [];
  const scalarMap = { ...DEFAULT_SCALAR_MAP, ...options.scalarMappings };
  const prefix = options.prefixInterfaces || "";
  const exportKw = options.exportTypes ? "export " : "";
  const readonlyKw = options.readonlyTypes ? "readonly " : "";
  const typeKw = options.useTypeInsteadOfInterface ? "type" : "interface";

  // Collect custom scalars
  const customScalars = types.filter((t) => t.kind === "scalar");
  if (customScalars.length > 0) {
    lines.push("// ── Scalars ──");
    lines.push("");
    for (const s of customScalars) {
      if (options.addComments && s.description) {
        lines.push(`/** ${s.description} */`);
      }
      const mapped = scalarMap[s.name] || "unknown";
      lines.push(`${exportKw}type ${prefix}${s.name} = ${mapped};`);
    }
    lines.push("");
  }

  // Enums
  const enums = types.filter((t) => t.kind === "enum");
  if (enums.length > 0) {
    lines.push("// ── Enums ──");
    lines.push("");
    for (const e of enums) {
      if (options.addComments && e.description) {
        lines.push(`/** ${e.description} */`);
      }
      if (options.enumAsConst) {
        lines.push(
          `${exportKw}const ${prefix}${e.name} = {`
        );
        for (const v of e.values || []) {
          lines.push(`  ${v}: "${v}",`);
        }
        lines.push("} as const;");
        lines.push(
          `${exportKw}type ${prefix}${e.name} = (typeof ${prefix}${e.name})[keyof typeof ${prefix}${e.name}];`
        );
      } else {
        lines.push(`${exportKw}enum ${prefix}${e.name} {`);
        for (const v of e.values || []) {
          lines.push(`  ${v} = "${v}",`);
        }
        lines.push("}");
      }
      lines.push("");
    }
  }

  // Unions
  const unions = types.filter((t) => t.kind === "union");
  if (unions.length > 0) {
    lines.push("// ── Unions ──");
    lines.push("");
    for (const u of unions) {
      if (options.addComments && u.description) {
        lines.push(`/** ${u.description} */`);
      }
      const members = (u.unionTypes || [])
        .map((t) => `${prefix}${t}`)
        .join(" | ");
      lines.push(`${exportKw}type ${prefix}${u.name} = ${members};`);
      lines.push("");
    }
  }

  // Interfaces (GraphQL interfaces)
  const gqlInterfaces = types.filter((t) => t.kind === "interface");
  if (gqlInterfaces.length > 0) {
    lines.push("// ── Interfaces ──");
    lines.push("");
    for (const iface of gqlInterfaces) {
      emitObjectType(iface, lines, scalarMap, options, prefix, exportKw, readonlyKw, typeKw);
    }
  }

  // Object types (type, query, mutation, subscription)
  const objectTypes = types.filter(
    (t) =>
      t.kind === "type" ||
      t.kind === "input" ||
      t.kind === "query" ||
      t.kind === "mutation" ||
      t.kind === "subscription"
  );

  // Group: types, then inputs, then query/mutation/subscription
  const regularTypes = objectTypes.filter(
    (t) => t.kind === "type"
  );
  const inputTypes = objectTypes.filter((t) => t.kind === "input");
  const operationTypes = objectTypes.filter(
    (t) =>
      t.kind === "query" ||
      t.kind === "mutation" ||
      t.kind === "subscription"
  );

  if (regularTypes.length > 0) {
    lines.push("// ── Types ──");
    lines.push("");
    for (const t of regularTypes) {
      emitObjectType(t, lines, scalarMap, options, prefix, exportKw, readonlyKw, typeKw);
    }
  }

  if (inputTypes.length > 0) {
    lines.push("// ── Input Types ──");
    lines.push("");
    for (const t of inputTypes) {
      emitObjectType(t, lines, scalarMap, options, prefix, exportKw, readonlyKw, typeKw);
    }
  }

  if (operationTypes.length > 0) {
    lines.push("// ── Operations ──");
    lines.push("");
    for (const t of operationTypes) {
      emitObjectType(t, lines, scalarMap, options, prefix, exportKw, readonlyKw, typeKw);
    }
  }

  return lines.join("\n");
}

function emitObjectType(
  type: ParsedType,
  lines: string[],
  scalarMap: Record<string, string>,
  options: ConvertOptions,
  prefix: string,
  exportKw: string,
  readonlyKw: string,
  typeKw: string
) {
  if (options.addComments && type.description) {
    lines.push(`/** ${type.description} */`);
  }

  const extendsStr =
    type.interfaces && type.interfaces.length > 0
      ? ` extends ${type.interfaces.map((i) => `${prefix}${i}`).join(", ")}`
      : "";

  const name = `${prefix}${type.name}`;

  if (options.useTypeInsteadOfInterface) {
    lines.push(`${exportKw}type ${name} = ${extendsStr ? `${type.interfaces!.map((i) => `${prefix}${i}`).join(" & ")} & ` : ""}{`);
  } else {
    lines.push(`${exportKw}${typeKw} ${name}${extendsStr} {`);
  }

  for (const field of type.fields) {
    if (options.addComments && field.description) {
      lines.push(`  /** ${field.description} */`);
    }

    const tsType = resolveType(field.type, scalarMap, prefix);
    const optional = field.nullable && options.optionalFields ? "?" : "";
    const nullSuffix = field.nullable && !options.optionalFields ? " | null" : "";

    // If field has args, generate comment with args info
    if (options.addComments && field.args && field.args.length > 0) {
      const argsStr = field.args
        .map((a) => `${a.name}: ${resolveType(a.type, scalarMap, prefix)}`)
        .join(", ");
      lines.push(`  /** Args: (${argsStr}) */`);
    }

    lines.push(
      `  ${readonlyKw}${field.name}${optional}: ${tsType}${nullSuffix};`
    );
  }

  lines.push("}");
  lines.push("");

  // Generate args type for operation fields
  if (
    (type.kind === "query" ||
      type.kind === "mutation" ||
      type.kind === "subscription") &&
    type.fields.some((f) => f.args && f.args.length > 0)
  ) {
    for (const field of type.fields) {
      if (field.args && field.args.length > 0) {
        const argsName = `${prefix}${capitalize(field.name)}Args`;
        lines.push(`${exportKw}${options.useTypeInsteadOfInterface ? "type" : "interface"} ${argsName}${options.useTypeInsteadOfInterface ? " = " : " "}{`);
        for (const arg of field.args) {
          const tsType = resolveType(arg.type, scalarMap, prefix);
          const optional = arg.nullable && options.optionalFields ? "?" : "";
          const nullSuffix = arg.nullable && !options.optionalFields ? " | null" : "";
          lines.push(
            `  ${readonlyKw}${arg.name}${optional}: ${tsType}${nullSuffix};`
          );
        }
        lines.push("}");
        lines.push("");
      }
    }
  }
}

function resolveType(
  rawType: string,
  scalarMap: Record<string, string>,
  prefix: string
): string {
  // Array type
  if (rawType.endsWith("[]")) {
    const inner = rawType.slice(0, -2);
    const resolved = resolveType(inner, scalarMap, prefix);
    return `${resolved}[]`;
  }

  // Check scalar mapping
  if (scalarMap[rawType]) {
    return scalarMap[rawType];
  }

  // Prefix custom types
  return `${prefix}${rawType}`;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ── Component ──────────────────────────────────────────────────────────────

const DEFAULT_OPTIONS: ConvertOptions = {
  readonlyTypes: false,
  exportTypes: true,
  addComments: true,
  useTypeInsteadOfInterface: false,
  optionalFields: true,
  enumAsConst: false,
  scalarMappings: {},
  prefixInterfaces: "",
};

export default function GraphqlToTypescriptTool() {
  const { trackAction } = useToolAnalytics("graphql-to-typescript");
  const { remaining, dailyLimit, isLimited, recordUsage } =
    useRateLimit("graphql-to-typescript");

  const [input, setInput] = useState(SAMPLES[0].schema);
  const [options, setOptions] = useState<ConvertOptions>(DEFAULT_OPTIONS);
  const [copied, setCopied] = useState(false);

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: "", error: "" };
    try {
      const parsed = parseGraphQLSchema(input);
      if (parsed.length === 0) {
        return {
          output: "",
          error: "No GraphQL types found. Paste a valid GraphQL SDL schema.",
        };
      }
      return { output: generateTypeScript(parsed, options), error: "" };
    } catch (e) {
      return {
        output: "",
        error: e instanceof Error ? e.message : "Parse error",
      };
    }
  }, [input, options]);

  const stats = useMemo(() => {
    if (!input.trim()) return null;
    try {
      const parsed = parseGraphQLSchema(input);
      return {
        types: parsed.filter((t) => t.kind === "type").length,
        inputs: parsed.filter((t) => t.kind === "input").length,
        enums: parsed.filter((t) => t.kind === "enum").length,
        unions: parsed.filter((t) => t.kind === "union").length,
        interfaces: parsed.filter((t) => t.kind === "interface").length,
        scalars: parsed.filter((t) => t.kind === "scalar").length,
        operations: parsed.filter(
          (t) =>
            t.kind === "query" ||
            t.kind === "mutation" ||
            t.kind === "subscription"
        ).length,
        totalFields: parsed.reduce((acc, t) => acc + t.fields.length, 0),
      };
    } catch {
      return null;
    }
  }, [input]);

  const handleCopy = useCallback(async () => {
    if (isLimited || !output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      recordUsage();
      trackAction("copy");
    } catch {
      // fallback
    }
  }, [output, isLimited, recordUsage, trackAction]);

  const handleDownload = useCallback(() => {
    if (isLimited || !output) return;
    const blob = new Blob([output], { type: "text/typescript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "types.ts";
    a.click();
    URL.revokeObjectURL(url);
    recordUsage();
    trackAction("download");
  }, [output, isLimited, recordUsage, trackAction]);

  useKeyboardShortcut("Enter", handleCopy);

  const toggleOption = useCallback(
    (key: keyof ConvertOptions) => {
      setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
    },
    []
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link
          href="/"
          className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          ← Back to all tools
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          GraphQL to TypeScript Converter
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Convert GraphQL SDL schemas to TypeScript interfaces, types, enums,
          and operations. Paste your schema and get typed code instantly.
        </p>
      </div>

      <RateLimitBanner remaining={remaining} dailyLimit={dailyLimit} isLimited={isLimited} />

      <div className="mb-6 flex flex-wrap gap-2">
        {SAMPLES.map((sample) => (
          <button
            key={sample.name}
            onClick={() => setInput(sample.schema)}
            className={`rounded-lg px-3 py-1.5 text-sm transition ${
              input === sample.schema
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            {sample.name}
          </button>
        ))}
      </div>

      {/* Options bar */}
      <div className="mb-4 flex flex-wrap gap-x-4 gap-y-2 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/50">
        {(
          [
            ["exportTypes", "export"],
            ["readonlyTypes", "readonly"],
            ["addComments", "Comments"],
            ["useTypeInsteadOfInterface", "type (not interface)"],
            ["optionalFields", "Optional nullable"],
            ["enumAsConst", "Enum as const"],
          ] as const
        ).map(([key, label]) => (
          <label
            key={key}
            className="flex items-center gap-1.5 text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={options[key] as boolean}
              onChange={() => toggleOption(key)}
              className="h-3.5 w-3.5 rounded border-gray-300 text-blue-600 dark:border-gray-600 dark:bg-gray-800"
            />
            {label}
          </label>
        ))}
        <label className="flex items-center gap-1.5 text-sm text-gray-700 dark:text-gray-300">
          <span>Prefix:</span>
          <input
            type="text"
            value={options.prefixInterfaces}
            onChange={(e) =>
              setOptions((prev) => ({
                ...prev,
                prefixInterfaces: e.target.value,
              }))
            }
            placeholder="I"
            className="w-16 rounded border border-gray-300 bg-white px-2 py-0.5 text-sm dark:border-gray-600 dark:bg-gray-800"
          />
        </label>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Left: Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              GraphQL Schema (SDL)
            </label>
            <button
              onClick={() => setInput("")}
              className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Clear
            </button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`type User {\n  id: ID!\n  name: String!\n  email: String!\n}`}
            spellCheck={false}
            className="h-[600px] w-full rounded-lg border border-gray-200 bg-white p-4 font-mono text-sm text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:placeholder-gray-600"
          />
          {error && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}
        </div>

        {/* Right: Output */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              TypeScript Output
            </label>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                disabled={isLimited || !output}
                className="rounded-md bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
              <button
                onClick={handleDownload}
                disabled={isLimited || !output}
                className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 disabled:opacity-50"
              >
                Download .ts
              </button>
            </div>
          </div>
          <pre className="h-[600px] overflow-auto rounded-lg border border-gray-200 bg-gray-50 p-4 font-mono text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
            {output || (
              <span className="text-gray-400 dark:text-gray-600">
                TypeScript types will appear here...
              </span>
            )}
          </pre>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-8">
          {[
            { label: "Types", value: stats.types },
            { label: "Inputs", value: stats.inputs },
            { label: "Enums", value: stats.enums },
            { label: "Unions", value: stats.unions },
            { label: "Interfaces", value: stats.interfaces },
            { label: "Scalars", value: stats.scalars },
            { label: "Operations", value: stats.operations },
            { label: "Fields", value: stats.totalFields },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg border border-gray-200 p-2 text-center dark:border-gray-700"
            >
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {stat.value}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Keyboard shortcut */}
      <p className="mt-3 text-center text-xs text-gray-400 dark:text-gray-500">
        Press{" "}
        <kbd className="rounded border border-gray-300 bg-gray-100 px-1.5 py-0.5 text-xs dark:border-gray-600 dark:bg-gray-800">
          Ctrl+Enter
        </kbd>{" "}
        to copy
      </p>

      {/* Scalar mappings reference */}
      <div className="mt-6 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
          Default Scalar Mappings
        </h3>
        <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 md:grid-cols-4">
          {Object.entries(DEFAULT_SCALAR_MAP)
            .slice(0, 12)
            .map(([gql, ts]) => (
              <div key={gql} className="text-xs text-gray-600 dark:text-gray-400">
                <span className="font-mono text-purple-600 dark:text-purple-400">
                  {gql}
                </span>{" "}
                →{" "}
                <span className="font-mono text-blue-600 dark:text-blue-400">
                  {ts}
                </span>
              </div>
            ))}
        </div>
      </div>

      {/* Related tools */}
      <div className="mt-4 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          Related Tools
        </h3>
        <div className="mt-2 space-y-1">
          <Link
            href="/tools/json-to-typescript"
            className="block text-sm text-blue-600 hover:underline dark:text-blue-400"
          >
            JSON to TypeScript — generate types from JSON data
          </Link>
          <Link
            href="/tools/openapi-to-typescript"
            className="block text-sm text-blue-600 hover:underline dark:text-blue-400"
          >
            OpenAPI to TypeScript — convert REST API specs to types
          </Link>
          <Link
            href="/tools/json-to-code"
            className="block text-sm text-blue-600 hover:underline dark:text-blue-400"
          >
            JSON to Code — generate typed code in 8 languages
          </Link>
          <Link
            href="/tools/zod-schema"
            className="block text-sm text-blue-600 hover:underline dark:text-blue-400"
          >
            Zod Schema Generator — create runtime validation schemas
          </Link>
        </div>
      </div>
    </div>
  );
}
