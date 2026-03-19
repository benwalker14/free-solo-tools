import { NextRequest, NextResponse } from "next/server";
import { createHash, randomUUID } from "crypto";
import { authenticateApiKey } from "@/lib/api-auth";

const MAX_OPERATIONS = 50;

const VALID_TOOLS = [
  "json-format",
  "base64",
  "hash",
  "uuid",
  "url-encode",
  "jwt-decode",
  "case-convert",
  "epoch",
] as const;

type ToolName = (typeof VALID_TOOLS)[number];

interface BatchOperation {
  tool: ToolName;
  params: Record<string, unknown>;
}

interface BatchResult {
  tool: string;
  status: "success" | "error";
  data?: unknown;
  error?: string;
}

// ---------- Tool processors ----------

function processJsonFormat(params: Record<string, unknown>): unknown {
  const { input, action = "format", indent = 2 } = params;
  if (typeof input !== "string" || !input.trim()) {
    throw new Error("Missing required field: input");
  }
  const parsed = JSON.parse(input);
  switch (action) {
    case "minify":
      return { result: JSON.stringify(parsed), valid: true };
    case "validate":
      return { valid: true };
    case "format":
    default:
      return { result: JSON.stringify(parsed, null, Number(indent) || 2), valid: true };
  }
}

function processBase64(params: Record<string, unknown>): unknown {
  const { input, action = "encode" } = params;
  if (typeof input !== "string") {
    throw new Error("Missing required field: input");
  }
  if (action === "decode") {
    return { result: Buffer.from(input, "base64").toString("utf-8") };
  }
  return { result: Buffer.from(input, "utf-8").toString("base64") };
}

const HASH_ALGORITHMS = ["sha1", "sha256", "sha384", "sha512", "md5"] as const;

function processHash(params: Record<string, unknown>): unknown {
  const { input, algorithm, encoding = "hex" } = params;
  if (typeof input !== "string") {
    throw new Error("Missing required field: input");
  }
  const enc = encoding === "base64" ? "base64" : "hex";
  if (algorithm) {
    const algo = String(algorithm).toLowerCase();
    if (!HASH_ALGORITHMS.includes(algo as (typeof HASH_ALGORITHMS)[number])) {
      throw new Error(`Unsupported algorithm. Use: ${HASH_ALGORITHMS.join(", ")}`);
    }
    return { algorithm: algo, hash: createHash(algo).update(String(input), "utf-8").digest(enc) };
  }
  const hashes: Record<string, string> = {};
  for (const algo of HASH_ALGORITHMS) {
    hashes[algo] = createHash(algo).update(String(input), "utf-8").digest(enc);
  }
  return { hashes };
}

function processUuid(params: Record<string, unknown>): unknown {
  const count = Math.min(Math.max(Number(params.count) || 1, 1), 100);
  const uppercase = params.uppercase === true;
  const uuids: string[] = [];
  for (let i = 0; i < count; i++) {
    const id = randomUUID();
    uuids.push(uppercase ? id.toUpperCase() : id);
  }
  return { uuids, count: uuids.length };
}

function processUrlEncode(params: Record<string, unknown>): unknown {
  const { input, action = "encode", mode = "component" } = params;
  if (typeof input !== "string") {
    throw new Error("Missing required field: input");
  }
  let result: string;
  if (action === "decode") {
    result = mode === "full" ? decodeURI(input) : decodeURIComponent(input);
  } else {
    result = mode === "full" ? encodeURI(input) : encodeURIComponent(input);
  }
  return { result };
}

function processJwtDecode(params: Record<string, unknown>): unknown {
  const { token } = params;
  if (typeof token !== "string" || !token.trim()) {
    throw new Error("Missing required field: token");
  }
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new Error("Invalid JWT format. Expected 3 dot-separated parts.");
  }
  const decodeBase64Url = (str: string): string => {
    const padded = str.replace(/-/g, "+").replace(/_/g, "/");
    return Buffer.from(padded, "base64").toString("utf-8");
  };
  const header = JSON.parse(decodeBase64Url(parts[0]));
  const payload = JSON.parse(decodeBase64Url(parts[1]));
  const signature = parts[2];
  const timestamps: Record<string, string> = {};
  for (const key of ["iat", "exp", "nbf"] as const) {
    if (typeof payload[key] === "number") {
      timestamps[key] = new Date(payload[key] * 1000).toISOString();
    }
  }
  const isExpired = typeof payload.exp === "number" && payload.exp * 1000 < Date.now();
  return { header, payload, signature, timestamps, expired: isExpired };
}

type CaseType = "camel" | "pascal" | "snake" | "kebab" | "constant" | "dot" | "title" | "sentence" | "lower" | "upper";

const VALID_CASES: CaseType[] = ["camel", "pascal", "snake", "kebab", "constant", "dot", "title", "sentence", "lower", "upper"];

function splitWords(input: string): string[] {
  return input
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .replace(/[_\-./]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean);
}

function convertCase(input: string, target: CaseType): string {
  const words = splitWords(input);
  if (words.length === 0) return "";
  switch (target) {
    case "camel":
      return words.map((w, i) => (i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())).join("");
    case "pascal":
      return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join("");
    case "snake":
      return words.map((w) => w.toLowerCase()).join("_");
    case "kebab":
      return words.map((w) => w.toLowerCase()).join("-");
    case "constant":
      return words.map((w) => w.toUpperCase()).join("_");
    case "dot":
      return words.map((w) => w.toLowerCase()).join(".");
    case "title":
      return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
    case "sentence":
      return words.map((w, i) => (i === 0 ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : w.toLowerCase())).join(" ");
    case "lower":
      return words.map((w) => w.toLowerCase()).join(" ");
    case "upper":
      return words.map((w) => w.toUpperCase()).join(" ");
    default:
      return input;
  }
}

function processCaseConvert(params: Record<string, unknown>): unknown {
  const { input, to } = params;
  if (typeof input !== "string" || !input.trim()) {
    throw new Error("Missing required field: input");
  }
  if (to) {
    const target = String(to).toLowerCase() as CaseType;
    if (!VALID_CASES.includes(target)) {
      throw new Error(`Invalid case. Use: ${VALID_CASES.join(", ")}`);
    }
    return { result: convertCase(input, target) };
  }
  const results: Record<string, string> = {};
  for (const c of VALID_CASES) {
    results[c] = convertCase(input, c);
  }
  return { results };
}

function processEpoch(params: Record<string, unknown>): unknown {
  if (params.action === "now" || (!params.timestamp && !params.date)) {
    const now = new Date();
    return {
      timestamp: Math.floor(now.getTime() / 1000),
      timestamp_ms: now.getTime(),
      iso: now.toISOString(),
      utc: now.toUTCString(),
    };
  }
  if (params.timestamp !== undefined) {
    let ms = Number(params.timestamp);
    if (ms < 1e12) ms *= 1000;
    const d = new Date(ms);
    if (isNaN(d.getTime())) throw new Error("Invalid timestamp");
    return {
      timestamp: Math.floor(d.getTime() / 1000),
      timestamp_ms: d.getTime(),
      iso: d.toISOString(),
      utc: d.toUTCString(),
    };
  }
  if (params.date) {
    const d = new Date(String(params.date));
    if (isNaN(d.getTime())) throw new Error("Invalid date string");
    return {
      timestamp: Math.floor(d.getTime() / 1000),
      timestamp_ms: d.getTime(),
      iso: d.toISOString(),
      utc: d.toUTCString(),
    };
  }
  throw new Error('Provide "timestamp", "date", or "action": "now"');
}

// ---------- Dispatcher ----------

const processors: Record<ToolName, (params: Record<string, unknown>) => unknown> = {
  "json-format": processJsonFormat,
  base64: processBase64,
  hash: processHash,
  uuid: processUuid,
  "url-encode": processUrlEncode,
  "jwt-decode": processJwtDecode,
  "case-convert": processCaseConvert,
  epoch: processEpoch,
};

/**
 * POST /api/v1/batch
 * Process multiple tool operations in a single request.
 *
 * Body: { "operations": [{ "tool": "hash", "params": { "input": "hello" } }, ...] }
 * Max 50 operations per request.
 */
export async function POST(request: NextRequest) {
  const auth = await authenticateApiKey(
    request.headers.get("authorization")
  );
  if (auth.error) return auth.error;

  try {
    const body = await request.json();

    if (!Array.isArray(body.operations) || body.operations.length === 0) {
      return NextResponse.json(
        { error: "Missing required field: operations (non-empty array)" },
        { status: 400 }
      );
    }

    if (body.operations.length > MAX_OPERATIONS) {
      return NextResponse.json(
        { error: `Too many operations. Maximum is ${MAX_OPERATIONS} per request.` },
        { status: 400 }
      );
    }

    const results: BatchResult[] = body.operations.map(
      (op: BatchOperation, index: number) => {
        if (!op.tool || !VALID_TOOLS.includes(op.tool as ToolName)) {
          return {
            tool: op.tool || `unknown (index ${index})`,
            status: "error" as const,
            error: `Invalid tool. Use: ${VALID_TOOLS.join(", ")}`,
          };
        }

        try {
          const data = processors[op.tool as ToolName](op.params || {});
          return { tool: op.tool, status: "success" as const, data };
        } catch (err) {
          return {
            tool: op.tool,
            status: "error" as const,
            error: err instanceof Error ? err.message : "Processing failed",
          };
        }
      }
    );

    return NextResponse.json({
      results,
      total: results.length,
      succeeded: results.filter((r) => r.status === "success").length,
      failed: results.filter((r) => r.status === "error").length,
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }
}
