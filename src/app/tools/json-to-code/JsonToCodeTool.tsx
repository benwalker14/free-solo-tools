"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import RateLimitBanner from "@/components/RateLimitBanner";

type Language =
  | "go"
  | "python"
  | "java"
  | "csharp"
  | "dart"
  | "rust"
  | "swift"
  | "kotlin";

interface LanguageOption {
  id: Language;
  label: string;
  icon: string;
}

const LANGUAGES: LanguageOption[] = [
  { id: "go", label: "Go", icon: "Go" },
  { id: "python", label: "Python", icon: "Py" },
  { id: "java", label: "Java", icon: "Jv" },
  { id: "csharp", label: "C#", icon: "C#" },
  { id: "dart", label: "Dart", icon: "Dt" },
  { id: "rust", label: "Rust", icon: "Rs" },
  { id: "swift", label: "Swift", icon: "Sw" },
  { id: "kotlin", label: "Kotlin", icon: "Kt" },
];

const SAMPLE_JSON = `{
  "id": 1,
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "isActive": true,
  "age": 30,
  "score": 95.5,
  "address": {
    "street": "123 Main St",
    "city": "Springfield",
    "state": "IL",
    "zip": "62704"
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
    }
  ]
}`;

// ── Utility helpers ──

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function toPascalCase(key: string): string {
  return key
    .split(/[-_\s]+/)
    .map((part) => capitalize(part))
    .join("");
}

function toCamelCase(key: string): string {
  const pascal = toPascalCase(key);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

function toSnakeCase(key: string): string {
  return key
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .replace(/[-\s]+/g, "_")
    .toLowerCase();
}

function isIntegerValue(n: number): boolean {
  return Number.isFinite(n) && Math.floor(n) === n;
}

// ── Collected types ──

interface CollectedType {
  name: string;
  body: string;
}

// ── Go ──

function goType(
  value: unknown,
  key: string,
  parentName: string,
  collected: CollectedType[],
): string {
  if (value === null || value === undefined) return "interface{}";
  if (typeof value === "string") return "string";
  if (typeof value === "boolean") return "bool";
  if (typeof value === "number")
    return isIntegerValue(value) ? "int64" : "float64";

  if (Array.isArray(value)) {
    if (value.length === 0) return "[]interface{}";
    const et = goType(value[0], key, parentName, collected);
    return `[]${et}`;
  }

  if (typeof value === "object") {
    const typeName = parentName
      ? `${parentName}${toPascalCase(key)}`
      : toPascalCase(key) || "Root";
    buildGoStruct(value as Record<string, unknown>, typeName, collected);
    return typeName;
  }
  return "interface{}";
}

function buildGoStruct(
  obj: Record<string, unknown>,
  name: string,
  collected: CollectedType[],
): void {
  const lines = Object.entries(obj).map(([key, value]) => {
    const fieldName = toPascalCase(key);
    const fieldType = goType(value, key, name, collected);
    return `\t${fieldName} ${fieldType} \`json:"${key}"\``;
  });
  collected.push({
    name,
    body: `type ${name} struct {\n${lines.join("\n")}\n}`,
  });
}

function generateGo(
  parsed: unknown,
  rootName: string,
): string {
  const collected: CollectedType[] = [];
  if (Array.isArray(parsed)) {
    if (
      parsed.length > 0 &&
      parsed[0] !== null &&
      typeof parsed[0] === "object"
    ) {
      const merged = mergeArrayObjects(parsed);
      buildGoStruct(merged, rootName, collected);
    } else {
      return `type ${rootName} = []interface{}`;
    }
  } else if (parsed !== null && typeof parsed === "object") {
    buildGoStruct(parsed as Record<string, unknown>, rootName, collected);
  }
  collected.reverse();
  return collected.map((t) => t.body).join("\n\n");
}

// ── Python ──

function pyType(
  value: unknown,
  key: string,
  parentName: string,
  collected: CollectedType[],
): string {
  if (value === null || value === undefined) return "Optional[Any]";
  if (typeof value === "string") return "str";
  if (typeof value === "boolean") return "bool";
  if (typeof value === "number")
    return isIntegerValue(value) ? "int" : "float";

  if (Array.isArray(value)) {
    if (value.length === 0) return "list[Any]";
    const et = pyType(value[0], key, parentName, collected);
    return `list[${et}]`;
  }

  if (typeof value === "object") {
    const typeName = parentName
      ? `${parentName}${toPascalCase(key)}`
      : toPascalCase(key) || "Root";
    buildPyDataclass(value as Record<string, unknown>, typeName, collected);
    return typeName;
  }
  return "Any";
}

function buildPyDataclass(
  obj: Record<string, unknown>,
  name: string,
  collected: CollectedType[],
): void {
  const lines = Object.entries(obj).map(([key, value]) => {
    const fieldName = toSnakeCase(key);
    const fieldType = pyType(value, key, name, collected);
    return `    ${fieldName}: ${fieldType}`;
  });
  collected.push({
    name,
    body: `@dataclass\nclass ${name}:\n${lines.join("\n")}`,
  });
}

function generatePython(
  parsed: unknown,
  rootName: string,
): string {
  const collected: CollectedType[] = [];
  if (Array.isArray(parsed)) {
    if (
      parsed.length > 0 &&
      parsed[0] !== null &&
      typeof parsed[0] === "object"
    ) {
      const merged = mergeArrayObjects(parsed);
      buildPyDataclass(merged, rootName, collected);
    }
  } else if (parsed !== null && typeof parsed === "object") {
    buildPyDataclass(parsed as Record<string, unknown>, rootName, collected);
  }
  collected.reverse();
  const header = "from dataclasses import dataclass\nfrom typing import Any, Optional\n";
  return header + "\n\n" + collected.map((t) => t.body).join("\n\n");
}

// ── Java ──

function javaType(
  value: unknown,
  key: string,
  parentName: string,
  collected: CollectedType[],
): string {
  if (value === null || value === undefined) return "Object";
  if (typeof value === "string") return "String";
  if (typeof value === "boolean") return "boolean";
  if (typeof value === "number")
    return isIntegerValue(value) ? "long" : "double";

  if (Array.isArray(value)) {
    if (value.length === 0) return "List<Object>";
    const et = javaType(value[0], key, parentName, collected);
    const boxed = javaBoxed(et);
    return `List<${boxed}>`;
  }

  if (typeof value === "object") {
    const typeName = parentName
      ? `${parentName}${toPascalCase(key)}`
      : toPascalCase(key) || "Root";
    buildJavaClass(value as Record<string, unknown>, typeName, collected);
    return typeName;
  }
  return "Object";
}

function javaBoxed(t: string): string {
  const boxMap: Record<string, string> = {
    int: "Integer",
    long: "Long",
    double: "Double",
    float: "Float",
    boolean: "Boolean",
  };
  return boxMap[t] || t;
}

function buildJavaClass(
  obj: Record<string, unknown>,
  name: string,
  collected: CollectedType[],
): void {
  const fields = Object.entries(obj).map(([key, value]) => {
    const fieldName = toCamelCase(key);
    const fieldType = javaType(value, key, name, collected);
    return { fieldName, fieldType, originalKey: key };
  });

  const fieldLines = fields
    .map((f) => `    private ${f.fieldType} ${f.fieldName};`)
    .join("\n");

  const getters = fields
    .map((f) => {
      const getter = `get${toPascalCase(f.originalKey)}`;
      return `    public ${f.fieldType} ${getter}() { return this.${f.fieldName}; }`;
    })
    .join("\n");

  const setters = fields
    .map((f) => {
      const setter = `set${toPascalCase(f.originalKey)}`;
      return `    public void ${setter}(${f.fieldType} ${f.fieldName}) { this.${f.fieldName} = ${f.fieldName}; }`;
    })
    .join("\n");

  collected.push({
    name,
    body: `public class ${name} {\n${fieldLines}\n\n${getters}\n\n${setters}\n}`,
  });
}

function generateJava(
  parsed: unknown,
  rootName: string,
): string {
  const collected: CollectedType[] = [];
  if (Array.isArray(parsed)) {
    if (
      parsed.length > 0 &&
      parsed[0] !== null &&
      typeof parsed[0] === "object"
    ) {
      const merged = mergeArrayObjects(parsed);
      buildJavaClass(merged, rootName, collected);
    }
  } else if (parsed !== null && typeof parsed === "object") {
    buildJavaClass(parsed as Record<string, unknown>, rootName, collected);
  }
  collected.reverse();
  return collected.map((t) => t.body).join("\n\n");
}

// ── C# ──

function csharpType(
  value: unknown,
  key: string,
  parentName: string,
  collected: CollectedType[],
): string {
  if (value === null || value === undefined) return "object?";
  if (typeof value === "string") return "string";
  if (typeof value === "boolean") return "bool";
  if (typeof value === "number")
    return isIntegerValue(value) ? "long" : "double";

  if (Array.isArray(value)) {
    if (value.length === 0) return "List<object>";
    const et = csharpType(value[0], key, parentName, collected);
    return `List<${et}>`;
  }

  if (typeof value === "object") {
    const typeName = parentName
      ? `${parentName}${toPascalCase(key)}`
      : toPascalCase(key) || "Root";
    buildCsharpClass(value as Record<string, unknown>, typeName, collected);
    return typeName;
  }
  return "object";
}

function buildCsharpClass(
  obj: Record<string, unknown>,
  name: string,
  collected: CollectedType[],
): void {
  const props = Object.entries(obj).map(([key, value]) => {
    const propName = toPascalCase(key);
    const propType = csharpType(value, key, name, collected);
    return `    [JsonPropertyName("${key}")]\n    public ${propType} ${propName} { get; set; }`;
  });
  collected.push({
    name,
    body: `public class ${name}\n{\n${props.join("\n\n")}\n}`,
  });
}

function generateCsharp(
  parsed: unknown,
  rootName: string,
): string {
  const collected: CollectedType[] = [];
  if (Array.isArray(parsed)) {
    if (
      parsed.length > 0 &&
      parsed[0] !== null &&
      typeof parsed[0] === "object"
    ) {
      const merged = mergeArrayObjects(parsed);
      buildCsharpClass(merged, rootName, collected);
    }
  } else if (parsed !== null && typeof parsed === "object") {
    buildCsharpClass(parsed as Record<string, unknown>, rootName, collected);
  }
  collected.reverse();
  const header = "using System.Text.Json.Serialization;\n";
  return header + "\n" + collected.map((t) => t.body).join("\n\n");
}

// ── Dart ──

function dartType(
  value: unknown,
  key: string,
  parentName: string,
  collected: CollectedType[],
): string {
  if (value === null || value === undefined) return "dynamic";
  if (typeof value === "string") return "String";
  if (typeof value === "boolean") return "bool";
  if (typeof value === "number")
    return isIntegerValue(value) ? "int" : "double";

  if (Array.isArray(value)) {
    if (value.length === 0) return "List<dynamic>";
    const et = dartType(value[0], key, parentName, collected);
    return `List<${et}>`;
  }

  if (typeof value === "object") {
    const typeName = parentName
      ? `${parentName}${toPascalCase(key)}`
      : toPascalCase(key) || "Root";
    buildDartClass(value as Record<string, unknown>, typeName, collected);
    return typeName;
  }
  return "dynamic";
}

function buildDartClass(
  obj: Record<string, unknown>,
  name: string,
  collected: CollectedType[],
): void {
  const entries = Object.entries(obj);
  const fields = entries.map(([key, value]) => {
    const fieldName = toCamelCase(key);
    const fieldType = dartType(value, key, name, collected);
    return { fieldName, fieldType, originalKey: key };
  });

  const fieldDecls = fields
    .map((f) => `  final ${f.fieldType} ${f.fieldName};`)
    .join("\n");

  const ctorParams = fields
    .map((f) => `    required this.${f.fieldName},`)
    .join("\n");

  const fromJsonFields = fields
    .map((f) => `      ${f.fieldName}: json['${f.originalKey}'],`)
    .join("\n");

  const toJsonFields = fields
    .map((f) => `      '${f.originalKey}': ${f.fieldName},`)
    .join("\n");

  collected.push({
    name,
    body: `class ${name} {
${fieldDecls}

  ${name}({
${ctorParams}
  });

  factory ${name}.fromJson(Map<String, dynamic> json) {
    return ${name}(
${fromJsonFields}
    );
  }

  Map<String, dynamic> toJson() {
    return {
${toJsonFields}
    };
  }
}`,
  });
}

function generateDart(
  parsed: unknown,
  rootName: string,
): string {
  const collected: CollectedType[] = [];
  if (Array.isArray(parsed)) {
    if (
      parsed.length > 0 &&
      parsed[0] !== null &&
      typeof parsed[0] === "object"
    ) {
      const merged = mergeArrayObjects(parsed);
      buildDartClass(merged, rootName, collected);
    }
  } else if (parsed !== null && typeof parsed === "object") {
    buildDartClass(parsed as Record<string, unknown>, rootName, collected);
  }
  collected.reverse();
  return collected.map((t) => t.body).join("\n\n");
}

// ── Rust ──

function rustType(
  value: unknown,
  key: string,
  parentName: string,
  collected: CollectedType[],
): string {
  if (value === null || value === undefined) return "Option<serde_json::Value>";
  if (typeof value === "string") return "String";
  if (typeof value === "boolean") return "bool";
  if (typeof value === "number")
    return isIntegerValue(value) ? "i64" : "f64";

  if (Array.isArray(value)) {
    if (value.length === 0) return "Vec<serde_json::Value>";
    const et = rustType(value[0], key, parentName, collected);
    return `Vec<${et}>`;
  }

  if (typeof value === "object") {
    const typeName = parentName
      ? `${parentName}${toPascalCase(key)}`
      : toPascalCase(key) || "Root";
    buildRustStruct(value as Record<string, unknown>, typeName, collected);
    return typeName;
  }
  return "serde_json::Value";
}

function buildRustStruct(
  obj: Record<string, unknown>,
  name: string,
  collected: CollectedType[],
): void {
  const fields = Object.entries(obj).map(([key, value]) => {
    const fieldName = toSnakeCase(key);
    const fieldType = rustType(value, key, name, collected);
    const needsRename = fieldName !== key;
    const renameAttr = needsRename
      ? `    #[serde(rename = "${key}")]\n`
      : "";
    return `${renameAttr}    pub ${fieldName}: ${fieldType},`;
  });
  collected.push({
    name,
    body: `#[derive(Debug, Serialize, Deserialize)]\npub struct ${name} {\n${fields.join("\n")}\n}`,
  });
}

function generateRust(
  parsed: unknown,
  rootName: string,
): string {
  const collected: CollectedType[] = [];
  if (Array.isArray(parsed)) {
    if (
      parsed.length > 0 &&
      parsed[0] !== null &&
      typeof parsed[0] === "object"
    ) {
      const merged = mergeArrayObjects(parsed);
      buildRustStruct(merged, rootName, collected);
    }
  } else if (parsed !== null && typeof parsed === "object") {
    buildRustStruct(parsed as Record<string, unknown>, rootName, collected);
  }
  collected.reverse();
  const header = "use serde::{Serialize, Deserialize};\n";
  return header + "\n" + collected.map((t) => t.body).join("\n\n");
}

// ── Swift ──

function swiftType(
  value: unknown,
  key: string,
  parentName: string,
  collected: CollectedType[],
): string {
  if (value === null || value === undefined) return "Any?";
  if (typeof value === "string") return "String";
  if (typeof value === "boolean") return "Bool";
  if (typeof value === "number")
    return isIntegerValue(value) ? "Int" : "Double";

  if (Array.isArray(value)) {
    if (value.length === 0) return "[Any]";
    const et = swiftType(value[0], key, parentName, collected);
    return `[${et}]`;
  }

  if (typeof value === "object") {
    const typeName = parentName
      ? `${parentName}${toPascalCase(key)}`
      : toPascalCase(key) || "Root";
    buildSwiftStruct(value as Record<string, unknown>, typeName, collected);
    return typeName;
  }
  return "Any";
}

function buildSwiftStruct(
  obj: Record<string, unknown>,
  name: string,
  collected: CollectedType[],
): void {
  const entries = Object.entries(obj);
  const fields = entries.map(([key, value]) => {
    const fieldName = toCamelCase(key);
    const fieldType = swiftType(value, key, name, collected);
    return { fieldName, fieldType, originalKey: key };
  });

  const fieldDecls = fields
    .map((f) => `    let ${f.fieldName}: ${f.fieldType}`)
    .join("\n");

  const needsCodingKeys = fields.some(
    (f) => f.fieldName !== f.originalKey,
  );

  let codingKeys = "";
  if (needsCodingKeys) {
    const cases = fields
      .map(
        (f) =>
          `        case ${f.fieldName} = "${f.originalKey}"`,
      )
      .join("\n");
    codingKeys = `\n\n    enum CodingKeys: String, CodingKey {\n${cases}\n    }`;
  }

  collected.push({
    name,
    body: `struct ${name}: Codable {\n${fieldDecls}${codingKeys}\n}`,
  });
}

function generateSwift(
  parsed: unknown,
  rootName: string,
): string {
  const collected: CollectedType[] = [];
  if (Array.isArray(parsed)) {
    if (
      parsed.length > 0 &&
      parsed[0] !== null &&
      typeof parsed[0] === "object"
    ) {
      const merged = mergeArrayObjects(parsed);
      buildSwiftStruct(merged, rootName, collected);
    }
  } else if (parsed !== null && typeof parsed === "object") {
    buildSwiftStruct(parsed as Record<string, unknown>, rootName, collected);
  }
  collected.reverse();
  return collected.map((t) => t.body).join("\n\n");
}

// ── Kotlin ──

function kotlinType(
  value: unknown,
  key: string,
  parentName: string,
  collected: CollectedType[],
): string {
  if (value === null || value === undefined) return "Any?";
  if (typeof value === "string") return "String";
  if (typeof value === "boolean") return "Boolean";
  if (typeof value === "number")
    return isIntegerValue(value) ? "Long" : "Double";

  if (Array.isArray(value)) {
    if (value.length === 0) return "List<Any>";
    const et = kotlinType(value[0], key, parentName, collected);
    return `List<${et}>`;
  }

  if (typeof value === "object") {
    const typeName = parentName
      ? `${parentName}${toPascalCase(key)}`
      : toPascalCase(key) || "Root";
    buildKotlinClass(value as Record<string, unknown>, typeName, collected);
    return typeName;
  }
  return "Any";
}

function buildKotlinClass(
  obj: Record<string, unknown>,
  name: string,
  collected: CollectedType[],
): void {
  const fields = Object.entries(obj).map(([key, value]) => {
    const fieldName = toCamelCase(key);
    const fieldType = kotlinType(value, key, name, collected);
    const needsRename = fieldName !== key;
    const annotation = needsRename
      ? `    @SerialName("${key}")\n`
      : "";
    return `${annotation}    val ${fieldName}: ${fieldType},`;
  });
  collected.push({
    name,
    body: `@Serializable\ndata class ${name}(\n${fields.join("\n")}\n)`,
  });
}

function generateKotlin(
  parsed: unknown,
  rootName: string,
): string {
  const collected: CollectedType[] = [];
  if (Array.isArray(parsed)) {
    if (
      parsed.length > 0 &&
      parsed[0] !== null &&
      typeof parsed[0] === "object"
    ) {
      const merged = mergeArrayObjects(parsed);
      buildKotlinClass(merged, rootName, collected);
    }
  } else if (parsed !== null && typeof parsed === "object") {
    buildKotlinClass(parsed as Record<string, unknown>, rootName, collected);
  }
  collected.reverse();
  const header =
    "import kotlinx.serialization.Serializable\nimport kotlinx.serialization.SerialName\n";
  return header + "\n" + collected.map((t) => t.body).join("\n\n");
}

// ── Shared helper ──

function mergeArrayObjects(
  arr: unknown[],
): Record<string, unknown> {
  const merged: Record<string, unknown> = {};
  for (const item of arr) {
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
  return merged;
}

// ── Master generator ──

function generateCode(
  json: string,
  language: Language,
  rootName: string,
): string {
  const parsed = JSON.parse(json);
  const name = rootName.trim() || "Root";

  switch (language) {
    case "go":
      return generateGo(parsed, name);
    case "python":
      return generatePython(parsed, name);
    case "java":
      return generateJava(parsed, name);
    case "csharp":
      return generateCsharp(parsed, name);
    case "dart":
      return generateDart(parsed, name);
    case "rust":
      return generateRust(parsed, name);
    case "swift":
      return generateSwift(parsed, name);
    case "kotlin":
      return generateKotlin(parsed, name);
  }
}

// ── Component ──

export default function JsonToCodeTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [language, setLanguage] = useState<Language>("go");
  const [rootName, setRootName] = useState("Root");
  const [copied, setCopied] = useState(false);

  const { trackAction } = useToolAnalytics("json-to-code");
  const { remaining, dailyLimit, isLimited, recordUsage } =
    useRateLimit("json-to-code");

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
      const result = generateCode(input, language, rootName);
      setOutput(result);
    } catch {
      setError("Invalid JSON. Check your syntax and try again.");
    }
  }, [input, language, rootName, isLimited, recordUsage, trackAction]);

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

  const currentLang = LANGUAGES.find((l) => l.id === language)!;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="mb-8 block text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        &larr; Back to tools
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        JSON to Code Generator
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Generate typed code from JSON in 8 languages — Go structs, Python
        dataclasses, Java/C#/Dart/Kotlin classes, Rust/Swift structs. Handles
        nested objects, arrays, and null values.
      </p>

      <RateLimitBanner
        remaining={remaining}
        dailyLimit={dailyLimit}
        isLimited={isLimited}
      />

      {/* Language selector */}
      <div className="mb-4">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
          Target Language
        </label>
        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.id}
              onClick={() => {
                setLanguage(lang.id);
                setOutput("");
              }}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                language === lang.id
                  ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:border-indigo-400 dark:bg-indigo-950 dark:text-indigo-300"
                  : "border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800"
              }`}
            >
              <span className="font-mono text-xs opacity-70">
                {lang.icon}
              </span>
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      {/* Root name */}
      <div className="mb-4 flex items-center gap-3">
        <label className="text-sm text-gray-600 dark:text-gray-400">
          Root name:
        </label>
        <input
          type="text"
          value={rootName}
          onChange={(e) => setRootName(e.target.value)}
          className="w-40 rounded border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="Root"
        />
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
        Generate {currentLang.label}{" "}
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
              {currentLang.label} Output
            </label>
            <button
              onClick={handleCopy}
              className="rounded border border-gray-300 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <pre className="max-h-[32rem] overflow-auto rounded-lg border border-gray-200 bg-white p-4 font-mono text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100">
            {output}
          </pre>
        </div>
      )}

      {/* Language quick reference */}
      <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Supported Languages
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="pb-2 text-left font-medium text-gray-600 dark:text-gray-400">
                  Language
                </th>
                <th className="pb-2 text-left font-medium text-gray-600 dark:text-gray-400">
                  Output Type
                </th>
                <th className="pb-2 text-left font-medium text-gray-600 dark:text-gray-400">
                  Serialization
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-600 dark:text-gray-400">
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-1.5 font-medium">Go</td>
                <td className="py-1.5">Structs with json tags</td>
                <td className="py-1.5">
                  <code className="text-xs">encoding/json</code>
                </td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-1.5 font-medium">Python</td>
                <td className="py-1.5">Dataclasses with type hints</td>
                <td className="py-1.5">
                  <code className="text-xs">dataclasses</code>
                </td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-1.5 font-medium">Java</td>
                <td className="py-1.5">Classes with getters/setters</td>
                <td className="py-1.5">
                  <code className="text-xs">Jackson / Gson</code>
                </td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-1.5 font-medium">C#</td>
                <td className="py-1.5">
                  Classes with <code className="text-xs">JsonPropertyName</code>
                </td>
                <td className="py-1.5">
                  <code className="text-xs">System.Text.Json</code>
                </td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-1.5 font-medium">Dart</td>
                <td className="py-1.5">Classes with fromJson/toJson</td>
                <td className="py-1.5">
                  <code className="text-xs">dart:convert</code>
                </td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-1.5 font-medium">Rust</td>
                <td className="py-1.5">Structs with serde derive</td>
                <td className="py-1.5">
                  <code className="text-xs">serde</code>
                </td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-1.5 font-medium">Swift</td>
                <td className="py-1.5">Codable structs</td>
                <td className="py-1.5">
                  <code className="text-xs">Codable</code>
                </td>
              </tr>
              <tr>
                <td className="py-1.5 font-medium">Kotlin</td>
                <td className="py-1.5">Data classes with @Serializable</td>
                <td className="py-1.5">
                  <code className="text-xs">kotlinx.serialization</code>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Info */}
      <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          How It Works
        </h2>
        <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
          <li>
            <strong>Nested objects</strong> — each nested object becomes a
            separate named type/class/struct, referenced by the parent.
          </li>
          <li>
            <strong>Arrays</strong> — element types are inferred from the first
            item. Object arrays merge all items for complete field coverage.
          </li>
          <li>
            <strong>Numbers</strong> — integers and floats are detected
            automatically (e.g., <code className="text-xs">int64</code> vs{" "}
            <code className="text-xs">float64</code> in Go).
          </li>
          <li>
            <strong>Null values</strong> — mapped to each language&apos;s
            nullable/optional type (e.g., <code className="text-xs">Any?</code>{" "}
            in Kotlin, <code className="text-xs">Option</code> in Rust).
          </li>
          <li>
            <strong>Naming conventions</strong> — field names follow each
            language&apos;s idiom (camelCase, snake_case, PascalCase) with JSON
            key annotations.
          </li>
          <li>
            Everything runs in your browser — no data is sent over the network.
          </li>
        </ul>
      </div>
    </div>
  );
}
