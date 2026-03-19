"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS";
type AuthType = "none" | "bearer" | "basic" | "api-key";
type BodyType = "none" | "json" | "form-urlencoded" | "raw";
type OutputLanguage = "curl" | "javascript" | "python" | "go" | "rust" | "php";

interface HeaderEntry {
  key: string;
  value: string;
  enabled: boolean;
}

interface QueryParam {
  key: string;
  value: string;
  enabled: boolean;
}

interface RequestState {
  method: HttpMethod;
  url: string;
  headers: HeaderEntry[];
  queryParams: QueryParam[];
  authType: AuthType;
  authToken: string;
  authUser: string;
  authPass: string;
  apiKeyName: string;
  apiKeyValue: string;
  apiKeyIn: "header" | "query";
  bodyType: BodyType;
  bodyContent: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const METHODS: HttpMethod[] = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"];

const METHOD_COLORS: Record<HttpMethod, string> = {
  GET: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  POST: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  PUT: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  PATCH: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  DELETE: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  HEAD: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  OPTIONS: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
};

const LANGUAGES: { id: OutputLanguage; label: string }[] = [
  { id: "curl", label: "cURL" },
  { id: "javascript", label: "JavaScript" },
  { id: "python", label: "Python" },
  { id: "go", label: "Go" },
  { id: "rust", label: "Rust" },
  { id: "php", label: "PHP" },
];

const COMMON_HEADERS = [
  "Accept",
  "Accept-Encoding",
  "Accept-Language",
  "Cache-Control",
  "Content-Type",
  "Cookie",
  "Origin",
  "Referer",
  "User-Agent",
  "X-Requested-With",
  "X-API-Key",
];

const PRESETS: { label: string; state: Partial<RequestState> }[] = [
  {
    label: "GET JSON API",
    state: {
      method: "GET",
      url: "https://api.example.com/users",
      headers: [
        { key: "Accept", value: "application/json", enabled: true },
      ],
      queryParams: [
        { key: "page", value: "1", enabled: true },
        { key: "limit", value: "20", enabled: true },
      ],
      authType: "bearer",
      authToken: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0In0.abc123",
      bodyType: "none",
      bodyContent: "",
    },
  },
  {
    label: "POST JSON",
    state: {
      method: "POST",
      url: "https://api.example.com/users",
      headers: [
        { key: "Content-Type", value: "application/json", enabled: true },
        { key: "Accept", value: "application/json", enabled: true },
      ],
      queryParams: [],
      authType: "bearer",
      authToken: "your-token-here",
      bodyType: "json",
      bodyContent: JSON.stringify(
        { name: "John Doe", email: "john@example.com", role: "admin" },
        null,
        2,
      ),
    },
  },
  {
    label: "PUT Update",
    state: {
      method: "PUT",
      url: "https://api.example.com/users/42",
      headers: [
        { key: "Content-Type", value: "application/json", enabled: true },
      ],
      queryParams: [],
      authType: "api-key",
      apiKeyName: "X-API-Key",
      apiKeyValue: "sk-your-api-key",
      apiKeyIn: "header",
      bodyType: "json",
      bodyContent: JSON.stringify(
        { name: "Jane Doe", role: "editor" },
        null,
        2,
      ),
    },
  },
  {
    label: "DELETE",
    state: {
      method: "DELETE",
      url: "https://api.example.com/users/42",
      headers: [
        { key: "Accept", value: "application/json", enabled: true },
      ],
      queryParams: [],
      authType: "basic",
      authUser: "admin",
      authPass: "secret",
      bodyType: "none",
      bodyContent: "",
    },
  },
  {
    label: "Form POST",
    state: {
      method: "POST",
      url: "https://api.example.com/login",
      headers: [],
      queryParams: [],
      authType: "none",
      bodyType: "form-urlencoded",
      bodyContent: "username=admin&password=secret&remember=true",
    },
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function escStr(s: string, q: string = '"'): string {
  return s.replace(/\\/g, "\\\\").replace(new RegExp(q, "g"), `\\${q}`);
}

function buildFullUrl(url: string, params: QueryParam[]): string {
  const enabled = params.filter((p) => p.enabled && p.key);
  if (enabled.length === 0) return url;
  const qs = enabled
    .map((p) => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`)
    .join("&");
  return url.includes("?") ? `${url}&${qs}` : `${url}?${qs}`;
}

function getEffectiveHeaders(state: RequestState): Record<string, string> {
  const headers: Record<string, string> = {};
  for (const h of state.headers) {
    if (h.enabled && h.key) headers[h.key] = h.value;
  }
  // Auth headers
  if (state.authType === "bearer" && state.authToken) {
    headers["Authorization"] = `Bearer ${state.authToken}`;
  } else if (state.authType === "basic" && state.authUser) {
    headers["Authorization"] = `Basic <base64(${state.authUser}:${state.authPass})>`;
  } else if (state.authType === "api-key" && state.apiKeyIn === "header" && state.apiKeyName) {
    headers[state.apiKeyName] = state.apiKeyValue;
  }
  // Body content-type
  if (state.bodyType === "json" && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  } else if (state.bodyType === "form-urlencoded" && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/x-www-form-urlencoded";
  }
  return headers;
}

function getEffectiveQueryParams(state: RequestState): QueryParam[] {
  const params = state.queryParams.filter((p) => p.enabled && p.key);
  if (state.authType === "api-key" && state.apiKeyIn === "query" && state.apiKeyName) {
    params.push({ key: state.apiKeyName, value: state.apiKeyValue, enabled: true });
  }
  return params;
}

// ---------------------------------------------------------------------------
// Code generators
// ---------------------------------------------------------------------------

function generateCurl(state: RequestState): string {
  const fullUrl = buildFullUrl(state.url, getEffectiveQueryParams(state));
  const parts: string[] = [`curl -X ${state.method}`];

  parts.push(`  "${fullUrl}"`);

  const headers = getEffectiveHeaders(state);
  // For basic auth in curl, use -u flag instead of header
  if (state.authType === "basic" && state.authUser) {
    delete headers["Authorization"];
    parts.push(`  -u "${escStr(state.authUser)}:${escStr(state.authPass)}"`);
  }

  for (const [k, v] of Object.entries(headers)) {
    parts.push(`  -H "${escStr(k)}: ${escStr(v)}"`);
  }

  if (state.bodyType === "json" && state.bodyContent.trim()) {
    parts.push(`  -d '${state.bodyContent.replace(/'/g, "'\\''")}'`);
  } else if (state.bodyType === "form-urlencoded" && state.bodyContent.trim()) {
    parts.push(`  --data-urlencode '${state.bodyContent.replace(/'/g, "'\\''")}'`);
  } else if (state.bodyType === "raw" && state.bodyContent.trim()) {
    parts.push(`  -d '${state.bodyContent.replace(/'/g, "'\\''")}'`);
  }

  return parts.join(" \\\n");
}

function generateJavaScript(state: RequestState): string {
  const fullUrl = buildFullUrl(state.url, getEffectiveQueryParams(state));
  const headers = getEffectiveHeaders(state);
  // Fix basic auth for JS
  if (state.authType === "basic" && state.authUser) {
    headers["Authorization"] = `Basic \${btoa("${escStr(state.authUser)}:${escStr(state.authPass)}")}`;
  }

  const lines: string[] = [];
  const opts: string[] = [];
  opts.push(`  method: "${state.method}"`);

  const headerEntries = Object.entries(headers);
  if (headerEntries.length > 0) {
    const hLines = headerEntries.map(([k, v]) => {
      if (k === "Authorization" && state.authType === "basic") {
        return `    "${escStr(k)}": "Basic " + btoa("${escStr(state.authUser)}:${escStr(state.authPass)}")`;
      }
      return `    "${escStr(k)}": "${escStr(v)}"`;
    });
    opts.push(`  headers: {\n${hLines.join(",\n")}\n  }`);
  }

  if (state.bodyType === "json" && state.bodyContent.trim()) {
    try {
      JSON.parse(state.bodyContent);
      opts.push(`  body: JSON.stringify(${state.bodyContent})`);
    } catch {
      opts.push(`  body: ${JSON.stringify(state.bodyContent)}`);
    }
  } else if ((state.bodyType === "form-urlencoded" || state.bodyType === "raw") && state.bodyContent.trim()) {
    opts.push(`  body: "${escStr(state.bodyContent)}"`);
  }

  lines.push(`const response = await fetch("${escStr(fullUrl)}", {`);
  lines.push(opts.join(",\n"));
  lines.push("});");
  lines.push("");
  lines.push("const data = await response.json();");
  lines.push("console.log(data);");
  return lines.join("\n");
}

function generatePython(state: RequestState): string {
  const fullUrl = buildFullUrl(state.url, getEffectiveQueryParams(state));
  const headers = getEffectiveHeaders(state);
  const lines: string[] = ["import requests", ""];

  // Remove auth header for basic auth — use requests auth param instead
  const useBasicAuth = state.authType === "basic" && state.authUser;
  if (useBasicAuth) delete headers["Authorization"];

  const headerEntries = Object.entries(headers);
  if (headerEntries.length > 0) {
    lines.push("headers = {");
    for (const [k, v] of headerEntries) {
      lines.push(`    "${escStr(k)}": "${escStr(v)}",`);
    }
    lines.push("}");
    lines.push("");
  }

  const method = state.method.toLowerCase();
  const pyMethod = ["get", "post", "put", "patch", "delete", "head", "options"].includes(method) ? method : "request";
  const args: string[] = [`"${escStr(fullUrl)}"`];
  if (headerEntries.length > 0) args.push("headers=headers");
  if (useBasicAuth) {
    args.push(`auth=("${escStr(state.authUser)}", "${escStr(state.authPass)}")`);
  }
  if (state.bodyType === "json" && state.bodyContent.trim()) {
    try {
      JSON.parse(state.bodyContent);
      args.push(`json=${state.bodyContent}`);
    } catch {
      args.push(`data="${escStr(state.bodyContent)}"`);
    }
  } else if ((state.bodyType === "form-urlencoded" || state.bodyType === "raw") && state.bodyContent.trim()) {
    args.push(`data="${escStr(state.bodyContent)}"`);
  }

  if (pyMethod === "request") {
    lines.push(`response = requests.request("${state.method}", ${args.join(", ")})`);
  } else if (args.length <= 2) {
    lines.push(`response = requests.${pyMethod}(${args.join(", ")})`);
  } else {
    lines.push(`response = requests.${pyMethod}(`);
    for (let i = 0; i < args.length; i++) {
      lines.push(`    ${args[i]}${i < args.length - 1 ? "," : ""}`);
    }
    lines.push(")");
  }

  lines.push("");
  lines.push("print(response.status_code)");
  lines.push("print(response.json())");
  return lines.join("\n");
}

function generateGo(state: RequestState): string {
  const fullUrl = buildFullUrl(state.url, getEffectiveQueryParams(state));
  const headers = getEffectiveHeaders(state);
  const hasBody = (state.bodyType === "json" || state.bodyType === "form-urlencoded" || state.bodyType === "raw") && state.bodyContent.trim();

  // Remove placeholder basic auth header
  const useBasicAuth = state.authType === "basic" && state.authUser;
  if (useBasicAuth) delete headers["Authorization"];

  const lines: string[] = [
    "package main",
    "",
    "import (",
    '\t"fmt"',
    '\t"io"',
    '\t"net/http"',
  ];

  if (hasBody) {
    lines.splice(lines.indexOf('\t"io"'), 0, '\t"bytes"');
  }

  lines.push(")");
  lines.push("");
  lines.push("func main() {");

  if (hasBody) {
    lines.push(`\tbody := bytes.NewBufferString(\`${state.bodyContent}\`)`);
    lines.push(`\treq, err := http.NewRequest("${state.method}", "${escStr(fullUrl)}", body)`);
  } else {
    lines.push(`\treq, err := http.NewRequest("${state.method}", "${escStr(fullUrl)}", nil)`);
  }
  lines.push("\tif err != nil {");
  lines.push("\t\tpanic(err)");
  lines.push("\t}");

  for (const [k, v] of Object.entries(headers)) {
    lines.push(`\treq.Header.Set("${escStr(k)}", "${escStr(v)}")`);
  }

  if (useBasicAuth) {
    lines.push(`\treq.SetBasicAuth("${escStr(state.authUser)}", "${escStr(state.authPass)}")`);
  }

  lines.push("");
  lines.push("\tclient := &http.Client{}");
  lines.push("\tresp, err := client.Do(req)");
  lines.push("\tif err != nil {");
  lines.push("\t\tpanic(err)");
  lines.push("\t}");
  lines.push("\tdefer resp.Body.Close()");
  lines.push("");
  lines.push('\trespBody, _ := io.ReadAll(resp.Body)');
  lines.push('\tfmt.Println(resp.StatusCode)');
  lines.push('\tfmt.Println(string(respBody))');
  lines.push("}");
  return lines.join("\n");
}

function generateRust(state: RequestState): string {
  const fullUrl = buildFullUrl(state.url, getEffectiveQueryParams(state));
  const headers = getEffectiveHeaders(state);
  const hasBody = (state.bodyType === "json" || state.bodyType === "form-urlencoded" || state.bodyType === "raw") && state.bodyContent.trim();

  const useBasicAuth = state.authType === "basic" && state.authUser;
  if (useBasicAuth) delete headers["Authorization"];

  const lines: string[] = [
    "// Add to Cargo.toml:",
    '// reqwest = { version = "0.12", features = ["json"] }',
    '// tokio = { version = "1", features = ["full"] }',
    "",
    "#[tokio::main]",
    "async fn main() -> Result<(), reqwest::Error> {",
    "    let client = reqwest::Client::new();",
    "",
  ];

  const method = state.method.toLowerCase();
  lines.push(`    let response = client.${method}("${escStr(fullUrl)}")`);

  for (const [k, v] of Object.entries(headers)) {
    lines.push(`        .header("${escStr(k)}", "${escStr(v)}")`);
  }

  if (useBasicAuth) {
    lines.push(`        .basic_auth("${escStr(state.authUser)}", Some("${escStr(state.authPass)}"))`);
  }

  if (hasBody && state.bodyType === "json") {
    try {
      JSON.parse(state.bodyContent);
      lines.push(`        .body(r#"${state.bodyContent}"#)`);
    } catch {
      lines.push(`        .body("${escStr(state.bodyContent)}")`);
    }
  } else if (hasBody) {
    lines.push(`        .body("${escStr(state.bodyContent)}")`);
  }

  lines.push("        .send()");
  lines.push("        .await?;");
  lines.push("");
  lines.push('    println!("Status: {}", response.status());');
  lines.push("    let body = response.text().await?;");
  lines.push('    println!("{}", body);');
  lines.push("");
  lines.push("    Ok(())");
  lines.push("}");
  return lines.join("\n");
}

function generatePHP(state: RequestState): string {
  const fullUrl = buildFullUrl(state.url, getEffectiveQueryParams(state));
  const headers = getEffectiveHeaders(state);
  const hasBody = (state.bodyType === "json" || state.bodyType === "form-urlencoded" || state.bodyType === "raw") && state.bodyContent.trim();

  const useBasicAuth = state.authType === "basic" && state.authUser;
  if (useBasicAuth) delete headers["Authorization"];

  const lines: string[] = ["<?php", "", "$ch = curl_init();", ""];
  lines.push(`curl_setopt($ch, CURLOPT_URL, "${escStr(fullUrl)}");`);
  lines.push("curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);");

  if (state.method !== "GET") {
    lines.push(`curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "${state.method}");`);
  }

  const headerEntries = Object.entries(headers);
  if (headerEntries.length > 0) {
    lines.push("curl_setopt($ch, CURLOPT_HTTPHEADER, [");
    for (const [k, v] of headerEntries) {
      lines.push(`    "${escStr(k)}: ${escStr(v)}",`);
    }
    lines.push("]);");
  }

  if (hasBody) {
    lines.push(`curl_setopt($ch, CURLOPT_POSTFIELDS, '${state.bodyContent.replace(/'/g, "\\'")}');`);
  }

  if (useBasicAuth) {
    lines.push(`curl_setopt($ch, CURLOPT_USERPWD, "${escStr(state.authUser)}:${escStr(state.authPass)}");`);
  }

  lines.push("");
  lines.push("$response = curl_exec($ch);");
  lines.push("$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);");
  lines.push("curl_close($ch);");
  lines.push("");
  lines.push("echo $httpCode . \"\\n\";");
  lines.push("echo $response . \"\\n\";");
  return lines.join("\n");
}

function generateCode(lang: OutputLanguage, state: RequestState): string {
  switch (lang) {
    case "curl": return generateCurl(state);
    case "javascript": return generateJavaScript(state);
    case "python": return generatePython(state);
    case "go": return generateGo(state);
    case "rust": return generateRust(state);
    case "php": return generatePHP(state);
  }
}

// ---------------------------------------------------------------------------
// Section toggle component
// ---------------------------------------------------------------------------

function SectionToggle({
  title,
  count,
  open,
  onToggle,
  children,
}: {
  title: string;
  count?: number;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        <span>
          {title}
          {count !== undefined && count > 0 && (
            <span className="ml-2 rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
              {count}
            </span>
          )}
        </span>
        <span className="text-gray-400">{open ? "▲" : "▼"}</span>
      </button>
      {open && <div className="border-t border-gray-200 px-4 py-3 dark:border-gray-700">{children}</div>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const DEFAULT_STATE: RequestState = {
  method: "GET",
  url: "",
  headers: [{ key: "", value: "", enabled: true }],
  queryParams: [{ key: "", value: "", enabled: true }],
  authType: "none",
  authToken: "",
  authUser: "",
  authPass: "",
  apiKeyName: "X-API-Key",
  apiKeyValue: "",
  apiKeyIn: "header",
  bodyType: "none",
  bodyContent: "",
};

export default function HttpRequestBuilderTool() {
  const [state, setState] = useState<RequestState>({ ...DEFAULT_STATE });
  const [language, setLanguage] = useState<OutputLanguage>("curl");
  const [copied, setCopied] = useState(false);
  const [openSections, setOpenSections] = useState({
    headers: false,
    params: false,
    auth: false,
    body: false,
  });
  const { trackFirstInteraction } = useToolAnalytics("http-request-builder");

  const activeHeaderCount = state.headers.filter((h) => h.enabled && h.key).length;
  const activeParamCount = state.queryParams.filter((p) => p.enabled && p.key).length;

  const output = useMemo(() => {
    if (!state.url.trim()) return "";
    return generateCode(language, state);
  }, [state, language]);

  const toggleSection = useCallback((section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  }, []);

  function update(partial: Partial<RequestState>) {
    setState((prev) => ({ ...prev, ...partial }));
    trackFirstInteraction();
  }

  function handlePreset(preset: Partial<RequestState>) {
    setState({ ...DEFAULT_STATE, ...preset });
    trackFirstInteraction();
    setOpenSections({
      headers: (preset.headers?.length ?? 0) > 0,
      params: (preset.queryParams?.length ?? 0) > 0,
      auth: preset.authType !== "none" && preset.authType !== undefined,
      body: preset.bodyType !== "none" && preset.bodyType !== undefined,
    });
  }

  function updateHeader(index: number, field: keyof HeaderEntry, value: string | boolean) {
    const next = [...state.headers];
    next[index] = { ...next[index], [field]: value };
    // Auto-add new row if last row has content
    if (index === next.length - 1 && typeof value === "string" && value) {
      next.push({ key: "", value: "", enabled: true });
    }
    update({ headers: next });
  }

  function removeHeader(index: number) {
    const next = state.headers.filter((_, i) => i !== index);
    if (next.length === 0) next.push({ key: "", value: "", enabled: true });
    update({ headers: next });
  }

  function updateParam(index: number, field: keyof QueryParam, value: string | boolean) {
    const next = [...state.queryParams];
    next[index] = { ...next[index], [field]: value };
    if (index === next.length - 1 && typeof value === "string" && value) {
      next.push({ key: "", value: "", enabled: true });
    }
    update({ queryParams: next });
  }

  function removeParam(index: number) {
    const next = state.queryParams.filter((_, i) => i !== index);
    if (next.length === 0) next.push({ key: "", value: "", enabled: true });
    update({ queryParams: next });
  }

  function handleCopy() {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function handleClear() {
    setState({ ...DEFAULT_STATE });
    setCopied(false);
    setOpenSections({ headers: false, params: false, auth: false, body: false });
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
        HTTP Request Builder
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Build HTTP requests visually and generate code in cURL, JavaScript, Python,
        Go, Rust, or PHP. The reverse of{" "}
        <Link href="/tools/curl-converter" className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 underline">
          cURL to Code
        </Link>.
      </p>

      {/* Presets */}
      <div className="mb-6">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
          Presets
        </label>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => handlePreset(p.state)}
              className="rounded-full border border-gray-300 px-3 py-1 text-xs font-medium text-gray-600 hover:border-indigo-400 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-400 dark:hover:border-indigo-500 dark:hover:text-indigo-400 transition-colors"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Method + URL */}
      <div className="mb-4 flex gap-2">
        <select
          value={state.method}
          onChange={(e) => update({ method: e.target.value as HttpMethod })}
          className={`rounded-lg border border-gray-300 px-3 py-2.5 text-sm font-bold focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-900 ${METHOD_COLORS[state.method]}`}
        >
          {METHODS.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <input
          type="text"
          value={state.url}
          onChange={(e) => update({ url: e.target.value })}
          placeholder="https://api.example.com/endpoint"
          className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-mono text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
        />
        <button
          type="button"
          onClick={handleClear}
          className="rounded-lg border border-gray-300 px-3 py-2.5 text-xs font-medium text-gray-500 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Collapsible sections */}
      <div className="mb-6 space-y-2">
        {/* Query Params */}
        <SectionToggle
          title="Query Parameters"
          count={activeParamCount}
          open={openSections.params}
          onToggle={() => toggleSection("params")}
        >
          <div className="space-y-2">
            {state.queryParams.map((p, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={p.enabled}
                  onChange={(e) => updateParam(i, "enabled", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <input
                  type="text"
                  value={p.key}
                  onChange={(e) => updateParam(i, "key", e.target.value)}
                  placeholder="Key"
                  className="flex-1 rounded border border-gray-300 bg-white px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                />
                <input
                  type="text"
                  value={p.value}
                  onChange={(e) => updateParam(i, "value", e.target.value)}
                  placeholder="Value"
                  className="flex-1 rounded border border-gray-300 bg-white px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                />
                <button
                  type="button"
                  onClick={() => removeParam(i)}
                  className="text-gray-400 hover:text-red-500 text-sm px-1"
                  title="Remove"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </SectionToggle>

        {/* Headers */}
        <SectionToggle
          title="Headers"
          count={activeHeaderCount}
          open={openSections.headers}
          onToggle={() => toggleSection("headers")}
        >
          <div className="mb-3 flex flex-wrap gap-1">
            {COMMON_HEADERS.map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => {
                  const emptyIdx = state.headers.findIndex((hdr) => !hdr.key);
                  if (emptyIdx >= 0) {
                    updateHeader(emptyIdx, "key", h);
                  } else {
                    update({ headers: [...state.headers, { key: h, value: "", enabled: true }] });
                  }
                }}
                className="rounded border border-gray-200 px-2 py-0.5 text-xs text-gray-500 hover:border-indigo-400 hover:text-indigo-600 dark:border-gray-700 dark:text-gray-500 dark:hover:border-indigo-500 dark:hover:text-indigo-400 transition-colors"
              >
                {h}
              </button>
            ))}
          </div>
          <div className="space-y-2">
            {state.headers.map((h, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={h.enabled}
                  onChange={(e) => updateHeader(i, "enabled", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <input
                  type="text"
                  value={h.key}
                  onChange={(e) => updateHeader(i, "key", e.target.value)}
                  placeholder="Header name"
                  className="flex-1 rounded border border-gray-300 bg-white px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                />
                <input
                  type="text"
                  value={h.value}
                  onChange={(e) => updateHeader(i, "value", e.target.value)}
                  placeholder="Value"
                  className="flex-1 rounded border border-gray-300 bg-white px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                />
                <button
                  type="button"
                  onClick={() => removeHeader(i)}
                  className="text-gray-400 hover:text-red-500 text-sm px-1"
                  title="Remove"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </SectionToggle>

        {/* Auth */}
        <SectionToggle
          title="Authorization"
          count={state.authType !== "none" ? 1 : 0}
          open={openSections.auth}
          onToggle={() => toggleSection("auth")}
        >
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {(["none", "bearer", "basic", "api-key"] as AuthType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => update({ authType: t })}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    state.authType === t
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                  }`}
                >
                  {t === "none" ? "None" : t === "bearer" ? "Bearer Token" : t === "basic" ? "Basic Auth" : "API Key"}
                </button>
              ))}
            </div>

            {state.authType === "bearer" && (
              <input
                type="text"
                value={state.authToken}
                onChange={(e) => update({ authToken: e.target.value })}
                placeholder="Bearer token"
                className="w-full rounded border border-gray-300 bg-white px-3 py-2 font-mono text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
              />
            )}

            {state.authType === "basic" && (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={state.authUser}
                  onChange={(e) => update({ authUser: e.target.value })}
                  placeholder="Username"
                  className="flex-1 rounded border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                />
                <input
                  type="password"
                  value={state.authPass}
                  onChange={(e) => update({ authPass: e.target.value })}
                  placeholder="Password"
                  className="flex-1 rounded border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                />
              </div>
            )}

            {state.authType === "api-key" && (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={state.apiKeyName}
                    onChange={(e) => update({ apiKeyName: e.target.value })}
                    placeholder="Key name (e.g. X-API-Key)"
                    className="flex-1 rounded border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                  />
                  <input
                    type="text"
                    value={state.apiKeyValue}
                    onChange={(e) => update({ apiKeyValue: e.target.value })}
                    placeholder="Key value"
                    className="flex-1 rounded border border-gray-300 bg-white px-3 py-2 font-mono text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                  />
                </div>
                <div className="flex gap-2">
                  <label className="text-xs text-gray-500 dark:text-gray-400">Send in:</label>
                  {(["header", "query"] as const).map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => update({ apiKeyIn: loc })}
                      className={`rounded px-2 py-0.5 text-xs font-medium transition-colors ${
                        state.apiKeyIn === loc
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                      }`}
                    >
                      {loc === "header" ? "Header" : "Query Param"}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </SectionToggle>

        {/* Body */}
        <SectionToggle
          title="Request Body"
          count={state.bodyType !== "none" && state.bodyContent.trim() ? 1 : 0}
          open={openSections.body}
          onToggle={() => toggleSection("body")}
        >
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {(["none", "json", "form-urlencoded", "raw"] as BodyType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => update({ bodyType: t })}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    state.bodyType === t
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                  }`}
                >
                  {t === "none" ? "None" : t === "json" ? "JSON" : t === "form-urlencoded" ? "Form URL-Encoded" : "Raw"}
                </button>
              ))}
            </div>

            {state.bodyType !== "none" && (
              <textarea
                value={state.bodyContent}
                onChange={(e) => update({ bodyContent: e.target.value })}
                placeholder={
                  state.bodyType === "json"
                    ? '{\n  "key": "value"\n}'
                    : state.bodyType === "form-urlencoded"
                      ? "key1=value1&key2=value2"
                      : "Raw body content..."
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 font-mono text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
                rows={6}
                spellCheck={false}
              />
            )}
          </div>
        </SectionToggle>
      </div>

      {/* Output */}
      {state.url.trim() && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex flex-wrap gap-1.5">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.id}
                  type="button"
                  onClick={() => {
                    setLanguage(lang.id);
                    setCopied(false);
                  }}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    language === lang.id
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
            <button
              onClick={handleCopy}
              className="rounded border border-gray-300 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>

          <pre className="rounded-lg border border-gray-200 bg-gray-50 p-4 font-mono text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 overflow-x-auto leading-relaxed">
            {output}
          </pre>
        </div>
      )}

      {/* Info */}
      <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          About HTTP Request Builder
        </h2>
        <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
          <li>
            Build HTTP requests visually — set method, URL, headers, query
            parameters, auth, and body without writing code.
          </li>
          <li>
            Generate code in 6 languages: cURL, JavaScript (fetch), Python
            (requests), Go (net/http), Rust (reqwest), and PHP (curl).
          </li>
          <li>
            Supports Bearer tokens, Basic Auth, and API key authentication in
            headers or query parameters.
          </li>
          <li>
            This is the reverse of{" "}
            <Link
              href="/tools/curl-converter"
              className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400"
            >
              cURL to Code
            </Link>{" "}
            — build a request visually instead of parsing a command.
          </li>
          <li>
            Everything runs in your browser — no data is sent over the network.
          </li>
        </ul>
      </div>

      {/* Related tools */}
      <div className="mt-6">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Related tools
        </h2>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "cURL to Code", href: "/tools/curl-converter" },
            { label: "JSON Formatter", href: "/tools/json-formatter" },
            { label: "JWT Decoder", href: "/tools/jwt-decoder" },
            { label: "URL Encoder", href: "/tools/url-encoder" },
            { label: "HTTP Status Codes", href: "/tools/http-status-codes" },
          ].map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="rounded-full border border-gray-300 px-3 py-1 text-xs font-medium text-gray-600 hover:border-indigo-400 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-400 dark:hover:border-indigo-500 dark:hover:text-indigo-400 transition-colors"
            >
              {tool.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
