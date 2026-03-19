"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ParsedCurl {
  url: string;
  method: string;
  headers: Record<string, string>;
  data: string;
  auth: { user: string; pass: string } | null;
  followRedirects: boolean;
  insecure: boolean;
  compressed: boolean;
  formData: { name: string; value: string }[];
}

type Language =
  | "javascript"
  | "python"
  | "node"
  | "php"
  | "go"
  | "ruby"
  | "java";

// ---------------------------------------------------------------------------
// Shell tokenizer — handles single/double quotes, backslash escapes, and
// line continuations (\<newline>)
// ---------------------------------------------------------------------------

function tokenize(input: string): string[] {
  // Normalize line continuations: backslash followed by newline
  const s = input.replace(/\\\r?\n/g, " ").trim();

  const tokens: string[] = [];
  let i = 0;
  const len = s.length;

  while (i < len) {
    // Skip whitespace
    while (i < len && /\s/.test(s[i])) i++;
    if (i >= len) break;

    let token = "";
    while (i < len && !/\s/.test(s[i])) {
      const ch = s[i];
      if (ch === "'") {
        // Single-quoted string: no escapes, read until closing '
        i++;
        while (i < len && s[i] !== "'") {
          token += s[i];
          i++;
        }
        i++; // skip closing '
      } else if (ch === '"') {
        // Double-quoted string: handle backslash escapes
        i++;
        while (i < len && s[i] !== '"') {
          if (s[i] === "\\" && i + 1 < len) {
            const next = s[i + 1];
            if (next === '"' || next === "\\" || next === "$" || next === "`") {
              token += next;
              i += 2;
            } else {
              token += s[i];
              i++;
            }
          } else {
            token += s[i];
            i++;
          }
        }
        i++; // skip closing "
      } else if (ch === "\\" && i + 1 < len) {
        token += s[i + 1];
        i += 2;
      } else {
        token += ch;
        i++;
      }
    }
    if (token) tokens.push(token);
  }

  return tokens;
}

// ---------------------------------------------------------------------------
// cURL parser
// ---------------------------------------------------------------------------

function parseCurl(raw: string): ParsedCurl {
  const tokens = tokenize(raw);

  const result: ParsedCurl = {
    url: "",
    method: "",
    headers: {},
    data: "",
    auth: null,
    followRedirects: false,
    insecure: false,
    compressed: false,
    formData: [],
  };

  // Skip leading "curl" if present
  let start = 0;
  if (tokens[0]?.toLowerCase() === "curl") start = 1;

  for (let i = start; i < tokens.length; i++) {
    const t = tokens[i];

    // Handle --flag=value style
    if (t.startsWith("--") && t.includes("=")) {
      const eq = t.indexOf("=");
      const flag = t.slice(0, eq);
      const val = t.slice(eq + 1);
      handleLongFlag(flag, val, result);
      continue;
    }

    // Combined short flags like -sSL or -XPOST
    if (
      t.startsWith("-") &&
      !t.startsWith("--") &&
      t.length > 2 &&
      !flagTakesValue(t)
    ) {
      // Check for -XPOST pattern (flag that takes value with value appended)
      const flag = t.slice(0, 2);
      if (shortFlagTakesValue(flag)) {
        handleShortFlag(flag, t.slice(2), result);
        continue;
      }
      // Otherwise it's combined boolean flags like -sSL
      for (let j = 1; j < t.length; j++) {
        handleBooleanFlag(`-${t[j]}`, result);
      }
      continue;
    }

    switch (t) {
      case "-X":
      case "--request":
        result.method = tokens[++i]?.toUpperCase() || "GET";
        break;
      case "-H":
      case "--header": {
        const header = tokens[++i] || "";
        const colonIdx = header.indexOf(":");
        if (colonIdx > 0) {
          const key = header.slice(0, colonIdx).trim();
          const value = header.slice(colonIdx + 1).trim();
          result.headers[key] = value;
        }
        break;
      }
      case "-d":
      case "--data":
      case "--data-raw":
      case "--data-binary":
      case "--data-ascii":
        result.data = tokens[++i] || "";
        if (!result.method) result.method = "POST";
        break;
      case "--data-urlencode":
        result.data = tokens[++i] || "";
        if (!result.method) result.method = "POST";
        if (!result.headers["Content-Type"]) {
          result.headers["Content-Type"] =
            "application/x-www-form-urlencoded";
        }
        break;
      case "-F":
      case "--form": {
        const formVal = tokens[++i] || "";
        const eqIdx = formVal.indexOf("=");
        if (eqIdx > 0) {
          result.formData.push({
            name: formVal.slice(0, eqIdx),
            value: formVal.slice(eqIdx + 1),
          });
        }
        if (!result.method) result.method = "POST";
        break;
      }
      case "-u":
      case "--user": {
        const cred = tokens[++i] || "";
        const colonI = cred.indexOf(":");
        if (colonI > 0) {
          result.auth = {
            user: cred.slice(0, colonI),
            pass: cred.slice(colonI + 1),
          };
        } else {
          result.auth = { user: cred, pass: "" };
        }
        break;
      }
      case "-A":
      case "--user-agent":
        result.headers["User-Agent"] = tokens[++i] || "";
        break;
      case "-e":
      case "--referer":
        result.headers["Referer"] = tokens[++i] || "";
        break;
      case "-b":
      case "--cookie":
        result.headers["Cookie"] = tokens[++i] || "";
        break;
      case "-L":
      case "--location":
        result.followRedirects = true;
        break;
      case "-k":
      case "--insecure":
        result.insecure = true;
        break;
      case "--compressed":
        result.compressed = true;
        break;
      case "-I":
      case "--head":
        result.method = "HEAD";
        break;
      case "-o":
      case "--output":
      case "-O":
      case "--remote-name":
        // Skip output file arg for -o
        if (t === "-o" || t === "--output") i++;
        break;
      case "-s":
      case "--silent":
      case "-S":
      case "--show-error":
      case "-v":
      case "--verbose":
      case "-f":
      case "--fail":
      case "-N":
      case "--no-buffer":
        // Boolean flags — no value to consume
        break;
      default:
        // Bare URL
        if (
          !t.startsWith("-") &&
          (t.startsWith("http://") ||
            t.startsWith("https://") ||
            t.startsWith("http%") ||
            t.includes("://") ||
            (!result.url && !t.startsWith("-")))
        ) {
          result.url = t;
        }
        break;
    }
  }

  if (!result.method) result.method = "GET";
  return result;
}

function flagTakesValue(t: string): boolean {
  return ["-X", "-H", "-d", "-u", "-A", "-e", "-b", "-o", "-F"].includes(
    t.slice(0, 2),
  );
}

function shortFlagTakesValue(f: string): boolean {
  return ["-X", "-H", "-d", "-u", "-A", "-e", "-b", "-o", "-F"].includes(f);
}

function handleShortFlag(flag: string, val: string, result: ParsedCurl) {
  switch (flag) {
    case "-X":
      result.method = val.toUpperCase();
      break;
    case "-H": {
      const c = val.indexOf(":");
      if (c > 0) {
        result.headers[val.slice(0, c).trim()] = val.slice(c + 1).trim();
      }
      break;
    }
    case "-d":
      result.data = val;
      if (!result.method) result.method = "POST";
      break;
  }
}

function handleLongFlag(flag: string, val: string, result: ParsedCurl) {
  switch (flag) {
    case "--request":
      result.method = val.toUpperCase();
      break;
    case "--header": {
      const c = val.indexOf(":");
      if (c > 0) {
        result.headers[val.slice(0, c).trim()] = val.slice(c + 1).trim();
      }
      break;
    }
    case "--data":
    case "--data-raw":
    case "--data-binary":
    case "--data-ascii":
      result.data = val;
      if (!result.method) result.method = "POST";
      break;
    case "--user": {
      const colonI = val.indexOf(":");
      if (colonI > 0) {
        result.auth = { user: val.slice(0, colonI), pass: val.slice(colonI + 1) };
      } else {
        result.auth = { user: val, pass: "" };
      }
      break;
    }
    case "--user-agent":
      result.headers["User-Agent"] = val;
      break;
    case "--referer":
      result.headers["Referer"] = val;
      break;
    case "--cookie":
      result.headers["Cookie"] = val;
      break;
  }
}

function handleBooleanFlag(flag: string, result: ParsedCurl) {
  switch (flag) {
    case "-L":
      result.followRedirects = true;
      break;
    case "-k":
      result.insecure = true;
      break;
    case "-I":
      result.method = "HEAD";
      break;
    // -s, -S, -v, -f, -N — informational, ignore
  }
}

// ---------------------------------------------------------------------------
// Code generators
// ---------------------------------------------------------------------------

function escStr(s: string, q: string = '"'): string {
  return s.replace(/\\/g, "\\\\").replace(new RegExp(q, "g"), `\\${q}`);
}

function generateJavaScript(p: ParsedCurl): string {
  const lines: string[] = [];
  const opts: string[] = [];
  opts.push(`  method: "${p.method}"`);

  const headerEntries = Object.entries(p.headers);
  if (headerEntries.length > 0 || p.auth) {
    const hLines: string[] = [];
    for (const [k, v] of headerEntries) {
      hLines.push(`    "${escStr(k)}": "${escStr(v)}"`);
    }
    if (p.auth) {
      hLines.push(
        `    "Authorization": "Basic " + btoa("${escStr(p.auth.user)}:${escStr(p.auth.pass)}")`,
      );
    }
    opts.push(`  headers: {\n${hLines.join(",\n")}\n  }`);
  }

  if (p.data) {
    // Try to detect if JSON
    try {
      JSON.parse(p.data);
      opts.push(`  body: JSON.stringify(${p.data})`);
    } catch {
      opts.push(`  body: "${escStr(p.data)}"`);
    }
  }

  if (p.formData.length > 0) {
    lines.push("const formData = new FormData();");
    for (const f of p.formData) {
      lines.push(`formData.append("${escStr(f.name)}", "${escStr(f.value)}");`);
    }
    lines.push("");
    opts.push("  body: formData");
  }

  if (p.followRedirects === false && p.method !== "GET") {
    opts.push("  redirect: \"manual\"");
  }

  lines.push(`const response = await fetch("${escStr(p.url)}", {`);
  lines.push(opts.join(",\n"));
  lines.push("});");
  lines.push("");
  lines.push("const data = await response.json();");
  lines.push("console.log(data);");

  return lines.join("\n");
}

function generatePython(p: ParsedCurl): string {
  const lines: string[] = ["import requests", ""];

  const headerEntries = Object.entries(p.headers);
  if (headerEntries.length > 0) {
    lines.push("headers = {");
    for (const [k, v] of headerEntries) {
      lines.push(`    "${escStr(k)}": "${escStr(v)}",`);
    }
    lines.push("}");
    lines.push("");
  }

  if (p.formData.length > 0) {
    lines.push("files = {");
    for (const f of p.formData) {
      lines.push(`    "${escStr(f.name)}": "${escStr(f.value)}",`);
    }
    lines.push("}");
    lines.push("");
  }

  const args: string[] = [`"${escStr(p.url)}"`];
  if (headerEntries.length > 0) args.push("headers=headers");
  if (p.auth) {
    args.push(`auth=("${escStr(p.auth.user)}", "${escStr(p.auth.pass)}")`);
  }
  if (p.data) {
    try {
      JSON.parse(p.data);
      args.push(`json=${p.data}`);
    } catch {
      args.push(`data="${escStr(p.data)}"`);
    }
  }
  if (p.formData.length > 0) {
    args.push("files=files");
  }
  if (!p.followRedirects) {
    args.push("allow_redirects=False");
  }
  if (p.insecure) {
    args.push("verify=False");
  }

  const method = p.method.toLowerCase();
  const pyMethod = ["get", "post", "put", "patch", "delete", "head", "options"].includes(method)
    ? method
    : "request";

  if (pyMethod === "request") {
    lines.push(
      `response = requests.request("${p.method}", ${args.join(", ")})`,
    );
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

function generateNode(p: ParsedCurl): string {
  // Uses built-in fetch (Node 18+)
  const lines: string[] = [];
  const opts: string[] = [];
  opts.push(`  method: "${p.method}"`);

  const headerEntries = Object.entries(p.headers);
  if (headerEntries.length > 0 || p.auth) {
    const hLines: string[] = [];
    for (const [k, v] of headerEntries) {
      hLines.push(`    "${escStr(k)}": "${escStr(v)}"`);
    }
    if (p.auth) {
      hLines.push(
        `    "Authorization": "Basic " + Buffer.from("${escStr(p.auth.user)}:${escStr(p.auth.pass)}").toString("base64")`,
      );
    }
    opts.push(`  headers: {\n${hLines.join(",\n")}\n  }`);
  }

  if (p.data) {
    try {
      JSON.parse(p.data);
      opts.push(`  body: JSON.stringify(${p.data})`);
    } catch {
      opts.push(`  body: "${escStr(p.data)}"`);
    }
  }

  if (p.formData.length > 0) {
    lines.push("const formData = new FormData();");
    for (const f of p.formData) {
      lines.push(`formData.append("${escStr(f.name)}", "${escStr(f.value)}");`);
    }
    lines.push("");
    opts.push("  body: formData");
  }

  lines.push(`const response = await fetch("${escStr(p.url)}", {`);
  lines.push(opts.join(",\n"));
  lines.push("});");
  lines.push("");
  lines.push("const data = await response.json();");
  lines.push("console.log(data);");
  return lines.join("\n");
}

function generatePHP(p: ParsedCurl): string {
  const lines: string[] = ["<?php", "", "$ch = curl_init();", ""];
  lines.push(`curl_setopt($ch, CURLOPT_URL, "${escStr(p.url)}");`);
  lines.push("curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);");

  if (p.method !== "GET") {
    lines.push(`curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "${p.method}");`);
  }

  const headerEntries = Object.entries(p.headers);
  if (headerEntries.length > 0) {
    lines.push("curl_setopt($ch, CURLOPT_HTTPHEADER, [");
    for (const [k, v] of headerEntries) {
      lines.push(`    "${escStr(k)}: ${escStr(v)}",`);
    }
    lines.push("]);");
  }

  if (p.data) {
    lines.push(`curl_setopt($ch, CURLOPT_POSTFIELDS, '${p.data.replace(/'/g, "\\'")}');`);
  }

  if (p.auth) {
    lines.push(
      `curl_setopt($ch, CURLOPT_USERPWD, "${escStr(p.auth.user)}:${escStr(p.auth.pass)}");`,
    );
  }

  if (p.followRedirects) {
    lines.push("curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);");
  }

  if (p.insecure) {
    lines.push("curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);");
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

function generateGo(p: ParsedCurl): string {
  const lines: string[] = [
    "package main",
    "",
    "import (",
    '\t"fmt"',
    '\t"io"',
    '\t"net/http"',
  ];

  if (p.data || p.formData.length > 0) {
    lines.splice(lines.indexOf('\t"io"'), 0, '\t"bytes"');
  }
  if (p.auth) {
    lines.splice(lines.indexOf('\t"fmt"') + 1, 0, '\t"encoding/base64"');
  }
  if (p.insecure) {
    lines.splice(lines.indexOf('\t"net/http"') + 1, 0, '\t"crypto/tls"');
  }

  lines.push(")");
  lines.push("");
  lines.push("func main() {");

  if (p.data) {
    lines.push(`\tbody := bytes.NewBufferString(\`${p.data}\`)`);
    lines.push(
      `\treq, err := http.NewRequest("${p.method}", "${escStr(p.url)}", body)`,
    );
  } else {
    lines.push(
      `\treq, err := http.NewRequest("${p.method}", "${escStr(p.url)}", nil)`,
    );
  }

  lines.push("\tif err != nil {");
  lines.push("\t\tpanic(err)");
  lines.push("\t}");

  for (const [k, v] of Object.entries(p.headers)) {
    lines.push(`\treq.Header.Set("${escStr(k)}", "${escStr(v)}")`);
  }

  if (p.auth) {
    lines.push(
      `\treq.Header.Set("Authorization", "Basic "+base64.StdEncoding.EncodeToString([]byte("${escStr(p.auth.user)}:${escStr(p.auth.pass)}")))`,
    );
  }

  lines.push("");

  if (p.insecure) {
    lines.push("\tclient := &http.Client{");
    lines.push("\t\tTransport: &http.Transport{");
    lines.push("\t\t\tTLSClientConfig: &tls.Config{InsecureSkipVerify: true},");
    lines.push("\t\t},");
    lines.push("\t}");
  } else {
    lines.push("\tclient := &http.Client{}");
  }

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

function generateRuby(p: ParsedCurl): string {
  const lines: string[] = [
    'require "net/http"',
    'require "uri"',
    'require "json"',
    "",
    `uri = URI.parse("${escStr(p.url)}")`,
    "",
  ];

  const methodMap: Record<string, string> = {
    GET: "Get",
    POST: "Post",
    PUT: "Put",
    PATCH: "Patch",
    DELETE: "Delete",
    HEAD: "Head",
    OPTIONS: "Options",
  };
  const rbMethod = methodMap[p.method] || "Get";

  lines.push(`request = Net::HTTP::${rbMethod}.new(uri)`);

  for (const [k, v] of Object.entries(p.headers)) {
    lines.push(`request["${escStr(k)}"] = "${escStr(v)}"`);
  }

  if (p.auth) {
    lines.push(
      `request.basic_auth("${escStr(p.auth.user)}", "${escStr(p.auth.pass)}")`,
    );
  }

  if (p.data) {
    try {
      JSON.parse(p.data);
      lines.push(`request.body = ${p.data}.to_json`);
    } catch {
      lines.push(`request.body = "${escStr(p.data)}"`);
    }
  }

  lines.push("");
  lines.push("http = Net::HTTP.new(uri.host, uri.port)");
  lines.push('http.use_ssl = uri.scheme == "https"');
  if (p.insecure) {
    lines.push("http.verify_mode = OpenSSL::SSL::VERIFY_NONE");
  }
  lines.push("");
  lines.push("response = http.request(request)");
  lines.push("puts response.code");
  lines.push("puts response.body");
  return lines.join("\n");
}

function generateJava(p: ParsedCurl): string {
  const lines: string[] = [
    "import java.net.URI;",
    "import java.net.http.HttpClient;",
    "import java.net.http.HttpRequest;",
    "import java.net.http.HttpResponse;",
    "",
    "public class Main {",
    "    public static void main(String[] args) throws Exception {",
  ];

  if (p.data) {
    lines.push(
      `        HttpRequest request = HttpRequest.newBuilder()`,
    );
    lines.push(`                .uri(URI.create("${escStr(p.url)}"))`);
    lines.push(`                .method("${p.method}", HttpRequest.BodyPublishers.ofString("${escStr(p.data)}"))`);
  } else {
    lines.push(
      `        HttpRequest request = HttpRequest.newBuilder()`,
    );
    lines.push(`                .uri(URI.create("${escStr(p.url)}"))`);
    if (p.method === "GET") {
      lines.push("                .GET()");
    } else {
      lines.push(
        `                .method("${p.method}", HttpRequest.BodyPublishers.noBody())`,
      );
    }
  }

  for (const [k, v] of Object.entries(p.headers)) {
    lines.push(`                .header("${escStr(k)}", "${escStr(v)}")`);
  }

  if (p.auth) {
    const b64 = `java.util.Base64.getEncoder().encodeToString("${escStr(p.auth.user)}:${escStr(p.auth.pass)}".getBytes())`;
    lines.push(
      `                .header("Authorization", "Basic " + ${b64})`,
    );
  }

  lines.push("                .build();");
  lines.push("");
  lines.push(
    "        HttpClient client = HttpClient.newHttpClient();",
  );
  lines.push(
    "        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());",
  );
  lines.push("");
  lines.push("        System.out.println(response.statusCode());");
  lines.push("        System.out.println(response.body());");
  lines.push("    }");
  lines.push("}");
  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Generator dispatch
// ---------------------------------------------------------------------------

const LANGUAGES: { id: Language; label: string; ext: string }[] = [
  { id: "javascript", label: "JavaScript", ext: "js" },
  { id: "python", label: "Python", ext: "py" },
  { id: "node", label: "Node.js", ext: "js" },
  { id: "php", label: "PHP", ext: "php" },
  { id: "go", label: "Go", ext: "go" },
  { id: "ruby", label: "Ruby", ext: "rb" },
  { id: "java", label: "Java", ext: "java" },
];

function generateCode(lang: Language, parsed: ParsedCurl): string {
  switch (lang) {
    case "javascript":
      return generateJavaScript(parsed);
    case "python":
      return generatePython(parsed);
    case "node":
      return generateNode(parsed);
    case "php":
      return generatePHP(parsed);
    case "go":
      return generateGo(parsed);
    case "ruby":
      return generateRuby(parsed);
    case "java":
      return generateJava(parsed);
  }
}

// ---------------------------------------------------------------------------
// Example cURL commands
// ---------------------------------------------------------------------------

const EXAMPLES = [
  {
    label: "Simple GET",
    curl: 'curl https://api.example.com/users',
  },
  {
    label: "POST JSON",
    curl: `curl -X POST https://api.example.com/users \\
  -H "Content-Type: application/json" \\
  -d '{"name": "John", "email": "john@example.com"}'`,
  },
  {
    label: "With Auth",
    curl: `curl -X GET https://api.example.com/me \\
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0In0.abc123"`,
  },
  {
    label: "Basic Auth",
    curl: `curl -u admin:secret123 https://api.example.com/admin/stats`,
  },
  {
    label: "PUT with headers",
    curl: `curl -X PUT https://api.example.com/users/42 \\
  -H "Content-Type: application/json" \\
  -H "Accept: application/json" \\
  -H "X-API-Key: my-api-key" \\
  -d '{"name": "Jane", "role": "admin"}'`,
  },
  {
    label: "Form data",
    curl: `curl -X POST https://api.example.com/upload \\
  -F "file=@photo.jpg" \\
  -F "description=Profile photo"`,
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function CurlConverterTool() {
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState<Language>("javascript");
  const [copied, setCopied] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);
  const { trackFirstInteraction } = useToolAnalytics("curl-converter");

  const parsed = useMemo(() => {
    if (!input.trim()) return null;
    try {
      return parseCurl(input);
    } catch {
      return null;
    }
  }, [input]);

  const output = useMemo(() => {
    if (!parsed || !parsed.url) return "";
    return generateCode(language, parsed);
  }, [parsed, language]);

  function handleCopy() {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function handleCopyCurl() {
    navigator.clipboard.writeText(input);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 1500);
  }

  function handleInputChange(value: string) {
    setInput(value);
    trackFirstInteraction();
    setCopied(false);
  }

  function handleExample(curl: string) {
    setInput(curl);
    trackFirstInteraction();
    setCopied(false);
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
        cURL to Code Converter
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Paste a cURL command and instantly convert it to JavaScript, Python, Go,
        PHP, Ruby, or Java code.
      </p>

      {/* Quick examples */}
      <div className="mb-6">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
          Quick examples
        </label>
        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex.label}
              type="button"
              onClick={() => handleExample(ex.curl)}
              className="rounded-full border border-gray-300 px-3 py-1 text-xs font-medium text-gray-600 hover:border-indigo-400 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-400 dark:hover:border-indigo-500 dark:hover:text-indigo-400 transition-colors"
            >
              {ex.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            cURL command
          </label>
          {input.trim() && (
            <button
              onClick={handleCopyCurl}
              className="rounded border border-gray-300 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
            >
              {copiedCurl ? "Copied!" : "Copy cURL"}
            </button>
          )}
        </div>
        <textarea
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={`curl -X POST https://api.example.com/users \\
  -H "Content-Type: application/json" \\
  -d '{"name": "John", "email": "john@example.com"}'`}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 font-mono text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
          rows={5}
          spellCheck={false}
        />
      </div>

      {/* Parsed summary */}
      {parsed && parsed.url && (
        <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Parsed request
          </h2>
          <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
            <div>
              <span className="font-medium text-gray-500 dark:text-gray-400">
                Method:{" "}
              </span>
              <span
                className={`inline-block rounded px-1.5 py-0.5 text-xs font-bold ${
                  parsed.method === "GET"
                    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                    : parsed.method === "POST"
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                      : parsed.method === "PUT" || parsed.method === "PATCH"
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
                        : parsed.method === "DELETE"
                          ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                          : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                }`}
              >
                {parsed.method}
              </span>
            </div>
            <div className="break-all">
              <span className="font-medium text-gray-500 dark:text-gray-400">
                URL:{" "}
              </span>
              <span className="text-gray-900 dark:text-gray-100 font-mono text-xs">
                {parsed.url}
              </span>
            </div>
            {Object.keys(parsed.headers).length > 0 && (
              <div className="col-span-full">
                <span className="font-medium text-gray-500 dark:text-gray-400">
                  Headers:{" "}
                </span>
                <span className="text-gray-700 dark:text-gray-300">
                  {Object.keys(parsed.headers).join(", ")}
                </span>
              </div>
            )}
            {parsed.data && (
              <div className="col-span-full">
                <span className="font-medium text-gray-500 dark:text-gray-400">
                  Body:{" "}
                </span>
                <span className="font-mono text-xs text-gray-700 dark:text-gray-300 break-all">
                  {parsed.data.length > 120
                    ? parsed.data.slice(0, 120) + "..."
                    : parsed.data}
                </span>
              </div>
            )}
            {parsed.auth && (
              <div>
                <span className="font-medium text-gray-500 dark:text-gray-400">
                  Auth:{" "}
                </span>
                <span className="text-gray-700 dark:text-gray-300">
                  Basic ({parsed.auth.user}:****)
                </span>
              </div>
            )}
            {parsed.formData.length > 0 && (
              <div className="col-span-full">
                <span className="font-medium text-gray-500 dark:text-gray-400">
                  Form fields:{" "}
                </span>
                <span className="text-gray-700 dark:text-gray-300">
                  {parsed.formData.map((f) => f.name).join(", ")}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Language selector + output */}
      {parsed && parsed.url && (
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

      {/* Empty state with examples */}
      {(!parsed || !parsed.url) && input.trim() && (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950">
          <p className="text-sm text-amber-700 dark:text-amber-300">
            Could not parse a valid URL from the cURL command. Make sure your
            command includes a URL (e.g.{" "}
            <code className="bg-amber-100 dark:bg-amber-900 px-1 rounded text-xs">
              curl https://api.example.com
            </code>
            ).
          </p>
        </div>
      )}

      {/* Info */}
      <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          About cURL to Code
        </h2>
        <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
          <li>
            Paste any cURL command from browser DevTools, API docs, or your
            terminal — it converts to working code instantly.
          </li>
          <li>
            Supports common flags: <code className="text-xs bg-gray-200 dark:bg-gray-800 px-1 rounded">-X</code>{" "}
            <code className="text-xs bg-gray-200 dark:bg-gray-800 px-1 rounded">-H</code>{" "}
            <code className="text-xs bg-gray-200 dark:bg-gray-800 px-1 rounded">-d</code>{" "}
            <code className="text-xs bg-gray-200 dark:bg-gray-800 px-1 rounded">-u</code>{" "}
            <code className="text-xs bg-gray-200 dark:bg-gray-800 px-1 rounded">-F</code>{" "}
            <code className="text-xs bg-gray-200 dark:bg-gray-800 px-1 rounded">-L</code>{" "}
            <code className="text-xs bg-gray-200 dark:bg-gray-800 px-1 rounded">-k</code>{" "}
            and more.
          </li>
          <li>
            Line continuations (<code className="text-xs bg-gray-200 dark:bg-gray-800 px-1 rounded">\</code>) are handled automatically — paste multi-line commands directly.
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
            { label: "JSON Formatter", href: "/tools/json-formatter" },
            { label: "JWT Decoder", href: "/tools/jwt-decoder" },
            { label: "URL Parser", href: "/tools/url-parser" },
            { label: "URL Encoder", href: "/tools/url-encoder" },
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
