"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";
import RateLimitBanner from "@/components/RateLimitBanner";

const SAMPLE_OPENAPI = `openapi: "3.0.3"
info:
  title: Pet Store API
  description: A sample API that manages pets in a store
  version: "1.0.0"
  contact:
    name: API Support
    email: support@example.com
  license:
    name: MIT
servers:
  - url: https://api.example.com/v1
    description: Production server
  - url: https://staging.example.com/v1
    description: Staging server
paths:
  /pets:
    get:
      operationId: listPets
      summary: List all pets
      description: Returns a list of all pets in the store
      tags:
        - pets
      parameters:
        - name: limit
          in: query
          description: Maximum number of pets to return
          required: false
          schema:
            type: integer
            minimum: 1
            maximum: 100
            default: 20
      responses:
        "200":
          description: A list of pets
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: "#/components/schemas/Pet"
        "500":
          description: Internal server error
    post:
      operationId: createPet
      summary: Create a pet
      description: Creates a new pet in the store
      tags:
        - pets
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/NewPet"
      responses:
        "201":
          description: Pet created successfully
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Pet"
        "400":
          description: Invalid input
  /pets/{petId}:
    get:
      operationId: getPetById
      summary: Get a pet by ID
      description: Returns a single pet by its ID
      tags:
        - pets
      parameters:
        - name: petId
          in: path
          required: true
          description: The ID of the pet to retrieve
          schema:
            type: string
      responses:
        "200":
          description: A single pet
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Pet"
        "404":
          description: Pet not found
components:
  schemas:
    Pet:
      type: object
      required:
        - id
        - name
      properties:
        id:
          type: string
          description: Unique identifier for the pet
        name:
          type: string
          description: Name of the pet
        tag:
          type: string
          description: Optional tag for the pet
        status:
          type: string
          enum:
            - available
            - pending
            - sold
    NewPet:
      type: object
      required:
        - name
      properties:
        name:
          type: string
          description: Name of the pet
        tag:
          type: string
          description: Optional tag for the pet`;

interface Issue {
  type: "error" | "warning" | "info";
  path: string;
  message: string;
}

interface SpecSummary {
  version: string;
  title: string;
  pathCount: number;
  operationCount: number;
  schemaCount: number;
  methods: Record<string, number>;
}

// ─── Minimal YAML parser ───
// Handles the subset of YAML typical in OpenAPI specs: mappings, sequences, scalars,
// quoted strings, flow sequences/mappings, comments, multi-line strings
type YamlValue = string | number | boolean | null | YamlValue[] | { [key: string]: YamlValue };

function parseYaml(input: string): YamlValue {
  const lines = input.split("\n");
  let pos = 0;

  function currentIndent(line: string): number {
    const match = line.match(/^( *)/);
    return match ? match[1].length : 0;
  }

  function skipEmpty() {
    while (pos < lines.length) {
      const trimmed = lines[pos].trim();
      if (trimmed === "" || trimmed.startsWith("#")) {
        pos++;
      } else {
        break;
      }
    }
  }

  function parseScalar(raw: string): YamlValue {
    const trimmed = raw.trim();
    if (trimmed === "" || trimmed === "~" || trimmed === "null") return null;
    if (trimmed === "true") return true;
    if (trimmed === "false") return false;
    // quoted string
    if (
      (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
      (trimmed.startsWith("'") && trimmed.endsWith("'"))
    ) {
      return trimmed.slice(1, -1);
    }
    // number
    const num = Number(trimmed);
    if (!isNaN(num) && trimmed !== "") return num;
    return trimmed;
  }

  function parseFlowValue(s: string): YamlValue {
    const t = s.trim();
    if (t.startsWith("[")) return parseFlowArray(t);
    if (t.startsWith("{")) return parseFlowObject(t);
    return parseScalar(t);
  }

  function parseFlowArray(s: string): YamlValue[] {
    const inner = s.slice(1, s.lastIndexOf("]")).trim();
    if (inner === "") return [];
    return splitFlowItems(inner).map((item) => parseFlowValue(item));
  }

  function parseFlowObject(s: string): Record<string, YamlValue> {
    const inner = s.slice(1, s.lastIndexOf("}")).trim();
    if (inner === "") return {};
    const result: Record<string, YamlValue> = {};
    for (const item of splitFlowItems(inner)) {
      const colIdx = item.indexOf(":");
      if (colIdx >= 0) {
        const key = item.slice(0, colIdx).trim();
        const val = item.slice(colIdx + 1).trim();
        result[key.replace(/^["']|["']$/g, "")] = parseFlowValue(val);
      }
    }
    return result;
  }

  function splitFlowItems(s: string): string[] {
    const items: string[] = [];
    let depth = 0;
    let current = "";
    let inQuote: string | null = null;
    for (let i = 0; i < s.length; i++) {
      const ch = s[i];
      if (inQuote) {
        current += ch;
        if (ch === inQuote) inQuote = null;
        continue;
      }
      if (ch === '"' || ch === "'") {
        inQuote = ch;
        current += ch;
      } else if (ch === "[" || ch === "{") {
        depth++;
        current += ch;
      } else if (ch === "]" || ch === "}") {
        depth--;
        current += ch;
      } else if (ch === "," && depth === 0) {
        items.push(current.trim());
        current = "";
      } else {
        current += ch;
      }
    }
    if (current.trim()) items.push(current.trim());
    return items;
  }

  function parseValue(_indent: number): YamlValue {
    skipEmpty();
    if (pos >= lines.length) return null;

    const line = lines[pos];
    const trimmed = line.trim();

    // Flow collections on a single line
    if (trimmed.startsWith("[")) return parseFlowValue(trimmed);
    if (trimmed.startsWith("{")) return parseFlowValue(trimmed);

    // Check if this is a sequence item
    if (trimmed.startsWith("- ")) {
      return parseSequence(currentIndent(line));
    }
    if (trimmed === "-") {
      return parseSequence(currentIndent(line));
    }

    // Check if this is a mapping
    const colonMatch = trimmed.match(/^([^:]+?):\s*(.*)/);
    if (colonMatch) {
      return parseMapping(currentIndent(line));
    }

    // Plain scalar
    pos++;
    return parseScalar(trimmed);
  }

  function parseSequence(indent: number): YamlValue[] {
    const items: YamlValue[] = [];
    while (pos < lines.length) {
      skipEmpty();
      if (pos >= lines.length) break;
      const line = lines[pos];
      const ci = currentIndent(line);
      if (ci < indent) break;
      if (ci !== indent) break;
      const trimmed = line.trim();
      if (!trimmed.startsWith("-")) break;

      const after = trimmed.slice(1).trim();
      if (after === "") {
        // Block content under bare -
        pos++;
        skipEmpty();
        if (pos < lines.length && currentIndent(lines[pos]) > indent) {
          items.push(parseValue(currentIndent(lines[pos])));
        } else {
          items.push(null);
        }
      } else if (after.startsWith("[") || after.startsWith("{")) {
        pos++;
        items.push(parseFlowValue(after));
      } else {
        // Check if value after - is a mapping key
        const subColon = after.match(/^([^:]+?):\s*(.*)/);
        if (subColon) {
          pos++;
          const childIndent = indent + 2;
          const obj: Record<string, YamlValue> = {};
          const key = subColon[1].replace(/^["']|["']$/g, "");
          const val = subColon[2].trim();
          // Remove inline comment
          const cleanVal = val.replace(/\s+#.*$/, "");
          if (cleanVal === "" || cleanVal === "|" || cleanVal === ">") {
            skipEmpty();
            if (pos < lines.length && currentIndent(lines[pos]) > indent) {
              obj[key] = parseValue(currentIndent(lines[pos]));
            } else {
              obj[key] = cleanVal === "|" || cleanVal === ">" ? "" : null;
            }
          } else {
            obj[key] = parseScalar(cleanVal);
          }
          // Parse remaining keys at deeper indent
          skipEmpty();
          while (pos < lines.length) {
            skipEmpty();
            if (pos >= lines.length) break;
            const nextLine = lines[pos];
            const ni = currentIndent(nextLine);
            if (ni <= indent) break;
            const nt = nextLine.trim();
            const nColon = nt.match(/^([^:]+?):\s*(.*)/);
            if (nColon && ni >= childIndent) {
              const nKey = nColon[1].replace(/^["']|["']$/g, "");
              const nVal = nColon[2].trim().replace(/\s+#.*$/, "");
              pos++;
              if (nVal === "" || nVal === "|" || nVal === ">") {
                skipEmpty();
                if (pos < lines.length && currentIndent(lines[pos]) > ni) {
                  obj[nKey] = parseValue(currentIndent(lines[pos]));
                } else {
                  obj[nKey] = nVal === "|" || nVal === ">" ? "" : null;
                }
              } else if (nVal.startsWith("[") || nVal.startsWith("{")) {
                obj[nKey] = parseFlowValue(nVal);
              } else {
                obj[nKey] = parseScalar(nVal);
              }
            } else if (nt.startsWith("- ") && ni > indent) {
              // This is a nested sequence under the last key
              // We already moved past; back up not needed since we handle inline
              break;
            } else {
              break;
            }
          }
          items.push(obj);
        } else {
          pos++;
          items.push(parseScalar(after));
        }
      }
    }
    return items;
  }

  function parseMapping(indent: number): Record<string, YamlValue> {
    const obj: Record<string, YamlValue> = {};
    while (pos < lines.length) {
      skipEmpty();
      if (pos >= lines.length) break;
      const line = lines[pos];
      const ci = currentIndent(line);
      if (ci < indent) break;
      if (ci !== indent) break;
      const trimmed = line.trim();
      if (trimmed.startsWith("-")) break;

      const colonMatch = trimmed.match(/^([^:]+?):\s*(.*)/);
      if (!colonMatch) break;

      const key = colonMatch[1].replace(/^["']|["']$/g, "");
      const rawVal = colonMatch[2].trim().replace(/\s+#.*$/, "");
      pos++;

      if (rawVal === "" || rawVal === "|" || rawVal === ">") {
        skipEmpty();
        if (pos < lines.length && currentIndent(lines[pos]) > indent) {
          if (rawVal === "|" || rawVal === ">") {
            // Multi-line string
            const strIndent = currentIndent(lines[pos]);
            const parts: string[] = [];
            while (pos < lines.length) {
              const sl = lines[pos];
              if (sl.trim() === "" && rawVal === "|") {
                parts.push("");
                pos++;
                continue;
              }
              if (currentIndent(sl) < strIndent && sl.trim() !== "") break;
              parts.push(sl.slice(strIndent));
              pos++;
            }
            obj[key] = parts.join(rawVal === "|" ? "\n" : " ").trim();
          } else {
            obj[key] = parseValue(currentIndent(lines[pos]));
          }
        } else {
          obj[key] = null;
        }
      } else if (rawVal.startsWith("[") || rawVal.startsWith("{")) {
        obj[key] = parseFlowValue(rawVal);
      } else {
        obj[key] = parseScalar(rawVal);
      }
    }
    return obj;
  }

  skipEmpty();
  if (pos >= lines.length) return {};
  return parseValue(currentIndent(lines[pos]));
}

// ─── OpenAPI Validation Logic ───

const VALID_HTTP_METHODS = ["get", "put", "post", "delete", "options", "head", "patch", "trace"];

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function getStr(obj: Record<string, unknown>, key: string): string | undefined {
  const v = obj[key];
  return typeof v === "string" ? v : v != null ? String(v) : undefined;
}

function getObj(obj: Record<string, unknown>, key: string): Record<string, unknown> | undefined {
  const v = obj[key];
  return isObject(v) ? v as Record<string, unknown> : undefined;
}

function getArr(obj: Record<string, unknown>, key: string): unknown[] | undefined {
  const v = obj[key];
  return Array.isArray(v) ? v : undefined;
}

function detectVersion(spec: Record<string, unknown>): { version: string; isSwagger: boolean } {
  const swagger = getStr(spec, "swagger");
  if (swagger) return { version: swagger, isSwagger: true };
  const openapi = getStr(spec, "openapi");
  if (openapi) return { version: openapi, isSwagger: false };
  return { version: "unknown", isSwagger: false };
}

function validateSpec(spec: unknown): { issues: Issue[]; summary: SpecSummary | null } {
  const issues: Issue[] = [];

  if (!isObject(spec)) {
    issues.push({ type: "error", path: "/", message: "Specification must be a JSON/YAML object" });
    return { issues, summary: null };
  }

  const root = spec as Record<string, unknown>;
  const { version, isSwagger } = detectVersion(root);

  // ─── Root structure ───
  if (version === "unknown") {
    issues.push({
      type: "error",
      path: "/",
      message: 'Missing "openapi" or "swagger" version field. Must specify OpenAPI version (e.g., "3.0.3") or Swagger version ("2.0").',
    });
    return { issues, summary: null };
  }

  if (isSwagger && version !== "2.0") {
    issues.push({ type: "error", path: "/swagger", message: `Invalid Swagger version "${version}". Only "2.0" is valid.` });
  }

  if (!isSwagger) {
    if (!/^3\.\d+\.\d+$/.test(version)) {
      issues.push({ type: "error", path: "/openapi", message: `Invalid OpenAPI version "${version}". Expected format: 3.x.x (e.g., "3.0.3", "3.1.0").` });
    }
  }

  // ─── Info object ───
  const info = getObj(root, "info");
  if (!info) {
    issues.push({ type: "error", path: "/info", message: 'Missing required "info" object.' });
  } else {
    if (!getStr(info, "title")) {
      issues.push({ type: "error", path: "/info/title", message: 'Missing required "info.title".' });
    }
    if (!getStr(info, "version")) {
      issues.push({ type: "error", path: "/info/version", message: 'Missing required "info.version".' });
    }
    if (!getStr(info, "description")) {
      issues.push({ type: "warning", path: "/info/description", message: "Missing info.description. Adding a description helps API consumers understand the purpose of your API." });
    }
    const contact = getObj(info, "contact");
    if (!contact) {
      issues.push({ type: "info", path: "/info/contact", message: "Consider adding contact information for API support." });
    }
    const license = getObj(info, "license");
    if (license && !getStr(license, "name")) {
      issues.push({ type: "error", path: "/info/license/name", message: 'License object requires a "name" field.' });
    }
  }

  // ─── Servers (OpenAPI 3.x) / host (Swagger 2.0) ───
  if (!isSwagger) {
    const servers = getArr(root, "servers");
    if (!servers || servers.length === 0) {
      issues.push({ type: "warning", path: "/servers", message: "No servers defined. Consumers won't know the base URL for the API." });
    } else {
      servers.forEach((srv, i) => {
        if (isObject(srv)) {
          const s = srv as Record<string, unknown>;
          if (!getStr(s, "url")) {
            issues.push({ type: "error", path: `/servers/${i}/url`, message: `Server at index ${i} is missing required "url" field.` });
          }
        }
      });
    }
  } else {
    if (!getStr(root, "host")) {
      issues.push({ type: "warning", path: "/host", message: "No host defined. Consider specifying the API host." });
    }
    if (!getStr(root, "basePath")) {
      issues.push({ type: "info", path: "/basePath", message: 'No basePath defined. Defaults to "/".' });
    }
  }

  // ─── Paths ───
  const paths = getObj(root, "paths");
  if (!paths) {
    issues.push({ type: "error", path: "/paths", message: 'Missing required "paths" object.' });
    return { issues, summary: buildSummary(root, version, 0, 0, 0, {}) };
  }

  if (Object.keys(paths).length === 0) {
    issues.push({ type: "warning", path: "/paths", message: "No paths defined. The API has no endpoints." });
  }

  let operationCount = 0;
  const methods: Record<string, number> = {};
  const operationIds = new Set<string>();
  const usedTags = new Set<string>();
  const definedTags = new Set<string>();

  // Collect defined tags
  const tagDefs = getArr(root, "tags");
  if (tagDefs) {
    tagDefs.forEach((t) => {
      if (isObject(t)) {
        const name = getStr(t as Record<string, unknown>, "name");
        if (name) definedTags.add(name);
      }
    });
  }

  for (const [pathKey, pathValue] of Object.entries(paths)) {
    if (pathKey.startsWith("x-")) continue; // extension

    if (!pathKey.startsWith("/")) {
      issues.push({ type: "error", path: `/paths/${pathKey}`, message: `Path "${pathKey}" must start with "/".` });
    }

    // Check for path parameter consistency
    const pathParams = (pathKey.match(/\{([^}]+)\}/g) || []).map((p) => p.slice(1, -1));

    if (!isObject(pathValue)) {
      issues.push({ type: "error", path: `/paths/${pathKey}`, message: `Path "${pathKey}" must be an object.` });
      continue;
    }

    const pathObj = pathValue as Record<string, unknown>;
    const pathLevelParams = getArr(pathObj, "parameters") || [];

    for (const [method, opValue] of Object.entries(pathObj)) {
      if (method === "parameters" || method === "summary" || method === "description" || method.startsWith("x-")) continue;

      if (!VALID_HTTP_METHODS.includes(method)) {
        issues.push({ type: "error", path: `/paths/${pathKey}/${method}`, message: `Invalid HTTP method "${method}". Must be one of: ${VALID_HTTP_METHODS.join(", ")}.` });
        continue;
      }

      operationCount++;
      methods[method.toUpperCase()] = (methods[method.toUpperCase()] || 0) + 1;

      if (!isObject(opValue)) {
        issues.push({ type: "error", path: `/paths/${pathKey}/${method}`, message: "Operation must be an object." });
        continue;
      }

      const op = opValue as Record<string, unknown>;
      const opPath = `/paths/${pathKey}/${method}`;

      // operationId
      const operationId = getStr(op, "operationId");
      if (!operationId) {
        issues.push({ type: "warning", path: `${opPath}/operationId`, message: `Missing operationId for ${method.toUpperCase()} ${pathKey}. Operation IDs enable code generation and API client naming.` });
      } else {
        if (operationIds.has(operationId)) {
          issues.push({ type: "error", path: `${opPath}/operationId`, message: `Duplicate operationId "${operationId}". Each operation must have a unique operationId.` });
        }
        operationIds.add(operationId);
      }

      // summary/description
      if (!getStr(op, "summary") && !getStr(op, "description")) {
        issues.push({ type: "warning", path: opPath, message: `${method.toUpperCase()} ${pathKey} has no summary or description.` });
      }

      // tags
      const tags = getArr(op, "tags");
      if (!tags || tags.length === 0) {
        issues.push({ type: "info", path: `${opPath}/tags`, message: `${method.toUpperCase()} ${pathKey} has no tags. Tags help organize endpoints in documentation.` });
      } else {
        tags.forEach((t) => {
          if (typeof t === "string") usedTags.add(t);
        });
      }

      // responses
      const responses = getObj(op, "responses");
      if (!responses) {
        issues.push({ type: "error", path: `${opPath}/responses`, message: `Missing required "responses" for ${method.toUpperCase()} ${pathKey}.` });
      } else {
        const responseCodes = Object.keys(responses).filter((k) => !k.startsWith("x-"));
        if (responseCodes.length === 0) {
          issues.push({ type: "error", path: `${opPath}/responses`, message: "Responses object must contain at least one response." });
        }

        const hasSuccess = responseCodes.some((code) => code.startsWith("2") || code === "default");
        if (!hasSuccess) {
          issues.push({ type: "warning", path: `${opPath}/responses`, message: `No success response (2xx) defined for ${method.toUpperCase()} ${pathKey}.` });
        }

        for (const [code, respValue] of Object.entries(responses)) {
          if (code.startsWith("x-")) continue;
          if (code !== "default" && !/^[1-5]\d{2}$/.test(code)) {
            issues.push({ type: "error", path: `${opPath}/responses/${code}`, message: `Invalid HTTP status code "${code}". Must be a 3-digit number (e.g., "200") or "default".` });
          }
          if (isObject(respValue)) {
            const resp = respValue as Record<string, unknown>;
            if (!getStr(resp, "description")) {
              issues.push({ type: "warning", path: `${opPath}/responses/${code}/description`, message: `Response ${code} is missing a description.` });
            }
          }
        }
      }

      // Parameters — check path params are declared
      const opParams = getArr(op, "parameters") || [];
      const allParams = [...pathLevelParams, ...opParams];
      const declaredPathParams = new Set<string>();

      allParams.forEach((p, i) => {
        if (isObject(p)) {
          const param = p as Record<string, unknown>;
          const pName = getStr(param, "name");
          const pIn = getStr(param, "in");

          if (!pName) {
            issues.push({ type: "error", path: `${opPath}/parameters/${i}`, message: "Parameter is missing required \"name\" field." });
          }
          if (!pIn) {
            issues.push({ type: "error", path: `${opPath}/parameters/${i}`, message: `Parameter "${pName || "?"}" is missing required "in" field.` });
          } else if (!["query", "header", "path", "cookie"].includes(pIn) && (!isSwagger || pIn !== "body" && pIn !== "formData")) {
            issues.push({ type: "error", path: `${opPath}/parameters/${i}`, message: `Parameter "${pName || "?"}" has invalid "in" value "${pIn}".` });
          }

          if (pIn === "path") {
            if (pName) declaredPathParams.add(pName);
            if (param.required !== true) {
              issues.push({ type: "error", path: `${opPath}/parameters/${i}`, message: `Path parameter "${pName}" must have "required: true".` });
            }
          }

          // Schema check (OpenAPI 3.x)
          if (!isSwagger && pIn !== "body") {
            if (!getObj(param, "schema")) {
              issues.push({ type: "warning", path: `${opPath}/parameters/${i}`, message: `Parameter "${pName || "?"}" is missing a schema definition.` });
            }
          }
          // Type check (Swagger 2.0)
          if (isSwagger && pIn !== "body") {
            if (!getStr(param, "type")) {
              issues.push({ type: "warning", path: `${opPath}/parameters/${i}`, message: `Parameter "${pName || "?"}" is missing a type definition.` });
            }
          }
        }
      });

      // Check all path template params are declared
      for (const pp of pathParams) {
        if (!declaredPathParams.has(pp)) {
          issues.push({ type: "error", path: opPath, message: `Path parameter "{${pp}}" in "${pathKey}" is not declared in operation parameters.` });
        }
      }

      // requestBody checks (OpenAPI 3.x)
      if (!isSwagger) {
        if (["post", "put", "patch"].includes(method) && !getObj(op, "requestBody")) {
          issues.push({ type: "info", path: `${opPath}/requestBody`, message: `${method.toUpperCase()} ${pathKey} has no requestBody. Consider if this endpoint should accept a body.` });
        }
        const reqBody = getObj(op, "requestBody");
        if (reqBody) {
          if (!getObj(reqBody, "content")) {
            issues.push({ type: "error", path: `${opPath}/requestBody/content`, message: "requestBody is missing required \"content\" field." });
          }
        }
      }
    }
  }

  // ─── Tags consistency ───
  for (const tag of usedTags) {
    if (definedTags.size > 0 && !definedTags.has(tag)) {
      issues.push({ type: "warning", path: "/tags", message: `Tag "${tag}" is used in operations but not defined in the root "tags" array.` });
    }
  }
  for (const tag of definedTags) {
    if (!usedTags.has(tag)) {
      issues.push({ type: "info", path: "/tags", message: `Tag "${tag}" is defined but not used by any operation.` });
    }
  }

  // ─── Components / Definitions ───
  let schemaCount = 0;
  if (!isSwagger) {
    const components = getObj(root, "components");
    if (components) {
      const schemas = getObj(components, "schemas");
      if (schemas) {
        schemaCount = Object.keys(schemas).length;
        validateSchemas(schemas, "/components/schemas", issues);
      }
      // Security schemes
      const secSchemes = getObj(components, "securitySchemes");
      if (secSchemes) {
        for (const [name, scheme] of Object.entries(secSchemes)) {
          if (isObject(scheme)) {
            const s = scheme as Record<string, unknown>;
            if (!getStr(s, "type")) {
              issues.push({ type: "error", path: `/components/securitySchemes/${name}`, message: `Security scheme "${name}" is missing required "type" field.` });
            }
          }
        }
      }
    }
  } else {
    const definitions = getObj(root, "definitions");
    if (definitions) {
      schemaCount = Object.keys(definitions).length;
      validateSchemas(definitions, "/definitions", issues);
    }
    // Swagger 2.0 security definitions
    const secDefs = getObj(root, "securityDefinitions");
    if (secDefs) {
      for (const [name, def] of Object.entries(secDefs)) {
        if (isObject(def)) {
          const d = def as Record<string, unknown>;
          if (!getStr(d, "type")) {
            issues.push({ type: "error", path: `/securityDefinitions/${name}`, message: `Security definition "${name}" is missing required "type" field.` });
          }
        }
      }
    }
  }

  // ─── Global security ───
  const security = getArr(root, "security");
  if (security && security.length > 0) {
    security.forEach((secReq, i) => {
      if (isObject(secReq)) {
        for (const schemeName of Object.keys(secReq as Record<string, unknown>)) {
          // Verify scheme is defined
          if (!isSwagger) {
            const secSchemes = getObj(getObj(root, "components") || {}, "securitySchemes");
            if (secSchemes && !(schemeName in secSchemes)) {
              issues.push({ type: "error", path: `/security/${i}`, message: `Security requirement references undefined scheme "${schemeName}".` });
            }
          } else {
            const secDefs = getObj(root, "securityDefinitions");
            if (secDefs && !(schemeName in secDefs)) {
              issues.push({ type: "error", path: `/security/${i}`, message: `Security requirement references undefined definition "${schemeName}".` });
            }
          }
        }
      }
    });
  }

  // ─── $ref validation ───
  validateRefs(root, root, "/", issues, isSwagger);

  const summary = buildSummary(root, version, Object.keys(paths).length, operationCount, schemaCount, methods);
  return { issues, summary };
}

function validateSchemas(schemas: Record<string, unknown>, basePath: string, issues: Issue[]) {
  const validTypes = ["string", "number", "integer", "boolean", "array", "object", "null"];

  for (const [name, schema] of Object.entries(schemas)) {
    if (!isObject(schema)) continue;
    const s = schema as Record<string, unknown>;
    const schemaPath = `${basePath}/${name}`;

    const type = getStr(s, "type");
    if (type && !validTypes.includes(type)) {
      issues.push({ type: "error", path: schemaPath, message: `Schema "${name}" has invalid type "${type}". Valid types: ${validTypes.join(", ")}.` });
    }

    if (type === "array" && !s.items) {
      issues.push({ type: "error", path: `${schemaPath}/items`, message: `Array schema "${name}" must define "items".` });
    }

    if (!getStr(s, "description")) {
      issues.push({ type: "info", path: schemaPath, message: `Schema "${name}" has no description.` });
    }

    // Validate properties recursively
    const properties = getObj(s, "properties");
    if (properties) {
      for (const [propName, propVal] of Object.entries(properties)) {
        if (isObject(propVal)) {
          const prop = propVal as Record<string, unknown>;
          const propType = getStr(prop, "type");
          if (propType && !validTypes.includes(propType)) {
            issues.push({ type: "error", path: `${schemaPath}/properties/${propName}`, message: `Property "${propName}" has invalid type "${propType}".` });
          }
          if (propType === "array" && !prop.items) {
            issues.push({ type: "error", path: `${schemaPath}/properties/${propName}/items`, message: `Array property "${propName}" must define "items".` });
          }
        }
      }
    }

    // Check required properties exist
    const required = getArr(s, "required");
    if (required && properties) {
      for (const req of required) {
        if (typeof req === "string" && !(req in properties)) {
          issues.push({ type: "warning", path: `${schemaPath}/required`, message: `Required property "${req}" is not defined in properties of schema "${name}".` });
        }
      }
    }
  }
}

function validateRefs(node: unknown, root: Record<string, unknown>, path: string, issues: Issue[], isSwagger: boolean) {
  if (Array.isArray(node)) {
    node.forEach((item, i) => validateRefs(item, root, `${path}/${i}`, issues, isSwagger));
    return;
  }
  if (!isObject(node)) return;
  const obj = node as Record<string, unknown>;

  if (typeof obj.$ref === "string") {
    const ref = obj.$ref as string;
    if (ref.startsWith("#/")) {
      const parts = ref.slice(2).split("/");
      let current: unknown = root;
      for (const part of parts) {
        if (!isObject(current)) {
          issues.push({ type: "error", path, message: `Broken $ref: "${ref}" — path segment "${part}" not found.` });
          return;
        }
        current = (current as Record<string, unknown>)[part];
      }
      if (current === undefined) {
        issues.push({ type: "error", path, message: `Broken $ref: "${ref}" — target does not exist.` });
      }
    }
    return;
  }

  for (const [key, value] of Object.entries(obj)) {
    validateRefs(value, root, `${path}${key}/`, issues, isSwagger);
  }
}

function buildSummary(
  root: Record<string, unknown>,
  version: string,
  pathCount: number,
  operationCount: number,
  schemaCount: number,
  methods: Record<string, number>,
): SpecSummary {
  const info = getObj(root, "info");
  return {
    version,
    title: info ? getStr(info, "title") || "(untitled)" : "(untitled)",
    pathCount,
    operationCount,
    schemaCount,
    methods,
  };
}

// ─── Component ───

export default function OpenApiValidatorTool() {
  const [input, setInput] = useState("");
  const [issues, setIssues] = useState<Issue[] | null>(null);
  const [summary, setSummary] = useState<SpecSummary | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "error" | "warning" | "info">("all");

  const { remaining, dailyLimit, isLimited, recordUsage } = useRateLimit("openapi-validator");
  const { trackAction } = useToolAnalytics("openapi-validator");

  const handleValidate = useCallback(() => {
    if (isLimited || !input.trim()) return;
    recordUsage();
    trackAction("validate");
    setParseError(null);

    const trimmed = input.trim();

    // Try JSON first, then YAML
    let spec: unknown;
    try {
      spec = JSON.parse(trimmed);
    } catch {
      try {
        spec = parseYaml(trimmed);
      } catch (e) {
        setParseError(`Failed to parse input as JSON or YAML: ${e instanceof Error ? e.message : String(e)}`);
        setIssues(null);
        setSummary(null);
        return;
      }
    }

    const result = validateSpec(spec);
    setIssues(result.issues);
    setSummary(result.summary);
  }, [input, isLimited, recordUsage, trackAction]);

  useKeyboardShortcut("Enter", handleValidate);

  const handleLoadSample = () => {
    setInput(SAMPLE_OPENAPI);
    setIssues(null);
    setSummary(null);
    setParseError(null);
  };

  const handleClear = () => {
    setInput("");
    setIssues(null);
    setSummary(null);
    setParseError(null);
  };

  const filteredIssues = issues
    ? filter === "all"
      ? issues
      : issues.filter((i) => i.type === filter)
    : null;

  const errorCount = issues?.filter((i) => i.type === "error").length ?? 0;
  const warningCount = issues?.filter((i) => i.type === "warning").length ?? 0;
  const infoCount = issues?.filter((i) => i.type === "info").length ?? 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-6">
        <Link
          href="/"
          className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          &larr; Back to all tools
        </Link>
      </div>

      <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
        OpenAPI / Swagger Validator
      </h1>
      <p className="mb-6 text-gray-600 dark:text-gray-400">
        Validate OpenAPI 3.x and Swagger 2.0 specifications. Checks structure, paths,
        operations, parameters, schemas, security, and best practices.
      </p>

      {/* Input */}
      <div className="mb-4">
        <label
          htmlFor="openapi-input"
          className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          OpenAPI / Swagger Specification (JSON or YAML)
        </label>
        <textarea
          id="openapi-input"
          rows={18}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your OpenAPI 3.x or Swagger 2.0 spec here..."
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 font-mono text-sm text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:ring-indigo-900"
          spellCheck={false}
        />
      </div>

      {/* Buttons */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <button
          onClick={handleValidate}
          disabled={isLimited || !input.trim()}
          className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Validate (Ctrl+Enter)
        </button>
        <button
          onClick={handleLoadSample}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          Load Sample
        </button>
        <button
          onClick={handleClear}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
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
        <div className="mb-6 rounded-lg border border-red-300 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950">
          <p className="text-sm font-medium text-red-800 dark:text-red-200">Parse Error</p>
          <p className="mt-1 text-sm text-red-700 dark:text-red-300">{parseError}</p>
        </div>
      )}

      {/* Results */}
      {issues !== null && (
        <div className="space-y-6">
          {/* Summary Card */}
          {summary && (
            <div className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
              <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
                Spec Summary
              </h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div>
                  <p className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Version</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {summary.version.startsWith("2") ? `Swagger ${summary.version}` : `OpenAPI ${summary.version}`}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Paths</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{summary.pathCount}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Operations</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{summary.operationCount}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Schemas</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{summary.schemaCount}</p>
                </div>
              </div>
              {Object.keys(summary.methods).length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {Object.entries(summary.methods).map(([method, count]) => (
                    <span
                      key={method}
                      className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                    >
                      {method} &times; {count}
                    </span>
                  ))}
                </div>
              )}
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">{summary.title}</span>
              </p>
            </div>
          )}

          {/* Validation Result Header */}
          <div className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Validation Results
              </h2>
              <div className="flex items-center gap-2">
                {errorCount === 0 && warningCount === 0 ? (
                  <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                    Valid
                  </span>
                ) : errorCount > 0 ? (
                  <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-800 dark:bg-red-900 dark:text-red-200">
                    {errorCount} Error{errorCount !== 1 ? "s" : ""}
                  </span>
                ) : null}
                {warningCount > 0 && (
                  <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                    {warningCount} Warning{warningCount !== 1 ? "s" : ""}
                  </span>
                )}
                {infoCount > 0 && (
                  <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {infoCount} Info
                  </span>
                )}
              </div>
            </div>

            {/* Filter buttons */}
            {issues.length > 0 && (
              <div className="mb-4 flex gap-2">
                {(["all", "error", "warning", "info"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                      filter === f
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                    }`}
                  >
                    {f === "all" ? `All (${issues.length})` : f === "error" ? `Errors (${errorCount})` : f === "warning" ? `Warnings (${warningCount})` : `Info (${infoCount})`}
                  </button>
                ))}
              </div>
            )}

            {/* Issues list */}
            {filteredIssues && filteredIssues.length > 0 ? (
              <div className="space-y-2">
                {filteredIssues.map((issue, i) => (
                  <div
                    key={i}
                    className={`rounded-md border p-3 ${
                      issue.type === "error"
                        ? "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950"
                        : issue.type === "warning"
                          ? "border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950"
                          : "border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span
                        className={`mt-0.5 flex-shrink-0 text-xs font-bold uppercase ${
                          issue.type === "error"
                            ? "text-red-700 dark:text-red-400"
                            : issue.type === "warning"
                              ? "text-yellow-700 dark:text-yellow-400"
                              : "text-blue-700 dark:text-blue-400"
                        }`}
                      >
                        {issue.type === "error" ? "ERR" : issue.type === "warning" ? "WARN" : "INFO"}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-gray-900 dark:text-gray-100">
                          {issue.message}
                        </p>
                        <p className="mt-0.5 font-mono text-xs text-gray-500 dark:text-gray-400">
                          {issue.path}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : issues.length === 0 ? (
              <p className="text-sm text-green-700 dark:text-green-300">
                No issues found. Your specification looks good!
              </p>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No {filter} issues found.
              </p>
            )}
          </div>

          {/* What we check */}
          <div className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
            <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
              What We Check
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Structure</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Version field, info object, required fields, servers/host
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Paths &amp; Operations</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Valid paths, HTTP methods, operationId uniqueness, responses
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Parameters</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Path param consistency, required fields, schema/type definitions
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Schemas</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Valid types, array items, required property existence, $ref resolution
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Security</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Security scheme definitions, requirement references
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Best Practices</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Descriptions, tags consistency, contact info, license
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
