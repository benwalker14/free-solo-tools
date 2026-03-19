"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useSmartPasteInput } from "@/hooks/useSmartPasteInput";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import RateLimitBanner from "@/components/RateLimitBanner";

// ── Types ──

interface EnvEntry {
  key: string;
  value: string;
  comment?: string;
}

type OutputFormat =
  | "docker-compose-env"
  | "docker-compose-env-file"
  | "k8s-configmap"
  | "k8s-secret"
  | "k8s-secret-stringdata"
  | "docker-run";

interface FormatOption {
  id: OutputFormat;
  label: string;
  description: string;
}

// ── Constants ──

const OUTPUT_FORMATS: FormatOption[] = [
  {
    id: "docker-compose-env",
    label: "Docker Compose (inline env)",
    description: "environment: block with KEY=VALUE pairs",
  },
  {
    id: "docker-compose-env-file",
    label: "Docker Compose (env_file)",
    description: "env_file reference with .env file",
  },
  {
    id: "k8s-configmap",
    label: "Kubernetes ConfigMap",
    description: "ConfigMap YAML with data: section",
  },
  {
    id: "k8s-secret",
    label: "Kubernetes Secret (base64)",
    description: "Secret YAML with base64-encoded data:",
  },
  {
    id: "k8s-secret-stringdata",
    label: "Kubernetes Secret (stringData)",
    description: "Secret YAML with plain stringData:",
  },
  {
    id: "docker-run",
    label: "Docker Run Flags",
    description: "docker run -e flags for each variable",
  },
];

const SENSITIVE_KEY_PATTERNS = [
  /password/i,
  /passwd/i,
  /secret/i,
  /token/i,
  /api[_-]?key/i,
  /private[_-]?key/i,
  /access[_-]?key/i,
  /credential/i,
  /connection[_-]?string/i,
  /database[_-]?url/i,
  /db[_-]?pass/i,
  /encryption[_-]?key/i,
  /signing[_-]?key/i,
  /jwt[_-]?secret/i,
  /session[_-]?secret/i,
  /smtp[_-]?pass/i,
  /stripe[_-]?(?:secret|key)/i,
  /aws[_-]?secret/i,
  /client[_-]?secret/i,
];

function isSensitiveKey(key: string): boolean {
  return SENSITIVE_KEY_PATTERNS.some((p) => p.test(key));
}

const SAMPLES: { label: string; value: string }[] = [
  {
    label: "Web App",
    value: [
      "# Application",
      "NODE_ENV=production",
      "PORT=3000",
      'APP_NAME="My Web App"',
      "APP_URL=https://myapp.example.com",
      "",
      "# Database",
      "DATABASE_URL=postgresql://user:pass@db:5432/myapp",
      "DB_POOL_SIZE=10",
      "",
      "# Redis",
      "REDIS_URL=redis://redis:6379/0",
      "",
      "# Auth",
      "JWT_SECRET=super-secret-jwt-key-123",
      "SESSION_SECRET=keyboard_cat_42",
      "",
      "# External APIs",
      "STRIPE_SECRET_KEY=sk_live_abc123",
      "SENDGRID_API_KEY=SG.xxxxxxxxxxxx",
      "",
      "# Feature Flags",
      "FEATURE_NEW_DASHBOARD=true",
      "LOG_LEVEL=info",
    ].join("\n"),
  },
  {
    label: "Microservice",
    value: [
      "# Service Config",
      "SERVICE_NAME=payment-service",
      "SERVICE_PORT=8080",
      "GRPC_PORT=9090",
      "",
      "# Database",
      "POSTGRES_HOST=pg-primary.internal",
      "POSTGRES_PORT=5432",
      "POSTGRES_DB=payments",
      "POSTGRES_USER=svc_payment",
      "POSTGRES_PASSWORD=db-password-here",
      "",
      "# Message Queue",
      "RABBITMQ_URL=amqp://rabbitmq:5672",
      "RABBITMQ_QUEUE=payment_events",
      "",
      "# Observability",
      "OTEL_EXPORTER_OTLP_ENDPOINT=http://otel-collector:4317",
      "LOG_FORMAT=json",
    ].join("\n"),
  },
  {
    label: "Next.js",
    value: [
      "# Next.js",
      "NEXT_PUBLIC_APP_URL=https://mysite.com",
      "NEXT_PUBLIC_API_URL=https://api.mysite.com",
      "NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX",
      "",
      "# Auth (server-only)",
      "NEXTAUTH_URL=https://mysite.com",
      "NEXTAUTH_SECRET=nextauth-secret-key",
      "GITHUB_CLIENT_ID=abc123",
      "GITHUB_CLIENT_SECRET=secret456",
      "",
      "# Database",
      "DATABASE_URL=postgresql://user:pass@localhost:5432/nextapp",
      "",
      "# Email",
      "RESEND_API_KEY=re_xxxxxxxxxxxx",
    ].join("\n"),
  },
  {
    label: "Minimal",
    value: ["APP_PORT=8080", "DEBUG=false", "API_KEY=my-api-key-here"].join(
      "\n"
    ),
  },
];

// ── Parser ──

function parseEnvFile(input: string): EnvEntry[] {
  const entries: EnvEntry[] = [];
  const lines = input.split("\n");

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip empty lines and comments
    if (!trimmed || trimmed.startsWith("#")) continue;

    // Find the first = sign
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;

    const key = trimmed.substring(0, eqIndex).trim();
    let value = trimmed.substring(eqIndex + 1).trim();

    // Skip invalid keys
    if (!key || /\s/.test(key)) continue;

    // Strip surrounding quotes
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    // Check for inline comment (only outside quotes)
    let comment: string | undefined;
    const commentMatch = value.match(/\s+#\s(.+)$/);
    if (commentMatch) {
      comment = commentMatch[1];
      value = value.substring(0, value.length - commentMatch[0].length);
    }

    entries.push({ key, value, comment });
  }

  return entries;
}

// ── Generators ──

function generateDockerComposeEnv(
  entries: EnvEntry[],
  serviceName: string
): string {
  const lines = [
    "# docker-compose.yml",
    "services:",
    `  ${serviceName}:`,
    "    # image: your-image:latest",
    "    environment:",
  ];

  for (const { key, value } of entries) {
    // Quote values with special chars
    const needsQuote = /[:#{}[\],&*?|>!%@`]/.test(value) || value === "";
    const yamlValue = needsQuote ? `"${value}"` : value;
    lines.push(`      ${key}: ${yamlValue}`);
  }

  return lines.join("\n");
}

function generateDockerComposeEnvFile(
  _entries: EnvEntry[],
  serviceName: string
): string {
  const lines = [
    "# docker-compose.yml",
    "services:",
    `  ${serviceName}:`,
    "    # image: your-image:latest",
    "    env_file:",
    "      - .env",
    "      # - .env.local  # override per environment",
  ];

  return lines.join("\n");
}

function generateK8sConfigMap(
  entries: EnvEntry[],
  resourceName: string,
  namespace: string
): string {
  const nonSensitive = entries.filter((e) => !isSensitiveKey(e.key));
  const sensitive = entries.filter((e) => isSensitiveKey(e.key));

  const lines = [
    "apiVersion: v1",
    "kind: ConfigMap",
    "metadata:",
    `  name: ${resourceName}`,
  ];

  if (namespace) {
    lines.push(`  namespace: ${namespace}`);
  }

  lines.push("data:");

  for (const { key, value } of nonSensitive) {
    const yamlValue =
      /[:#{}[\],&*?|>!%@`\n]/.test(value) || value === ""
        ? `"${value.replace(/"/g, '\\"')}"`
        : `"${value}"`;
    lines.push(`  ${key}: ${yamlValue}`);
  }

  if (sensitive.length > 0) {
    lines.push("");
    lines.push("# ⚠ The following keys appear sensitive and should go in a Secret instead:");
    for (const { key } of sensitive) {
      lines.push(`#   - ${key}`);
    }
  }

  return lines.join("\n");
}

function generateK8sSecret(
  entries: EnvEntry[],
  resourceName: string,
  namespace: string,
  useStringData: boolean
): string {
  const lines = [
    "apiVersion: v1",
    "kind: Secret",
    "metadata:",
    `  name: ${resourceName}`,
  ];

  if (namespace) {
    lines.push(`  namespace: ${namespace}`);
  }

  lines.push("type: Opaque");

  if (useStringData) {
    lines.push("stringData:");
    for (const { key, value } of entries) {
      const yamlValue =
        /[:#{}[\],&*?|>!%@`\n]/.test(value) || value === ""
          ? `"${value.replace(/"/g, '\\"')}"`
          : `"${value}"`;
      lines.push(`  ${key}: ${yamlValue}`);
    }
  } else {
    lines.push("data:");
    for (const { key, value } of entries) {
      const b64 = btoa(value);
      lines.push(`  ${key}: ${b64}`);
    }
  }

  return lines.join("\n");
}

function generateDockerRun(
  entries: EnvEntry[],
  imageName: string
): string {
  const lines = [`docker run \\`];
  for (let i = 0; i < entries.length; i++) {
    const { key, value } = entries[i];
    const needsQuote = /[\s$"'`\\!#&|;()<>]/.test(value) || value === "";
    const escaped = needsQuote
      ? `"${value.replace(/"/g, '\\"')}"`
      : value;
    const suffix = i < entries.length - 1 ? " \\" : "";
    lines.push(`  -e ${key}=${escaped}${suffix}`);
  }
  lines.push(`  ${imageName}`);
  return lines.join("\n");
}

function generate(
  entries: EnvEntry[],
  format: OutputFormat,
  serviceName: string,
  resourceName: string,
  namespace: string,
  imageName: string
): string {
  switch (format) {
    case "docker-compose-env":
      return generateDockerComposeEnv(entries, serviceName);
    case "docker-compose-env-file":
      return generateDockerComposeEnvFile(entries, serviceName);
    case "k8s-configmap":
      return generateK8sConfigMap(entries, resourceName, namespace);
    case "k8s-secret":
      return generateK8sSecret(entries, resourceName, namespace, false);
    case "k8s-secret-stringdata":
      return generateK8sSecret(entries, resourceName, namespace, true);
    case "docker-run":
      return generateDockerRun(entries, imageName);
  }
}

// ── Component ──

export default function EnvConverterTool() {
  useToolAnalytics("env-converter");
  const { isLimited, remaining, dailyLimit, recordUsage } = useRateLimit("env-converter");

  const [input, setInput] = useState("");
  const [format, setFormat] = useState<OutputFormat>("docker-compose-env");
  const [serviceName, setServiceName] = useState("app");
  const [resourceName, setResourceName] = useState("app-config");
  const [namespace, setNamespace] = useState("");
  const [imageName, setImageName] = useState("your-image:latest");
  const [output, setOutput] = useState("");
  const [entries, setEntries] = useState<EnvEntry[]>([]);
  const [copied, setCopied] = useState(false);
  const [sensitiveCount, setSensitiveCount] = useState(0);

  const handleConvert = useCallback(() => {
    if (!input.trim() || isLimited) return;
    recordUsage();

    const parsed = parseEnvFile(input);
    setEntries(parsed);
    setSensitiveCount(parsed.filter((e) => isSensitiveKey(e.key)).length);

    const result = generate(
      parsed,
      format,
      serviceName,
      resourceName,
      namespace,
      imageName
    );
    setOutput(result);
  }, [input, format, serviceName, resourceName, namespace, imageName, isLimited, recordUsage]);

  useKeyboardShortcut("Enter", handleConvert, { ctrl: true });

  useSmartPasteInput((text) => {
    setInput(text);
  });

  const handleCopy = useCallback(async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  const handleDownload = useCallback(() => {
    if (!output) return;
    const ext =
      format === "docker-compose-env" || format === "docker-compose-env-file"
        ? "yml"
        : "yaml";
    const filename =
      format === "docker-run" ? "docker-run.sh" : `output.${ext}`;
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }, [output, format]);

  const handleClear = useCallback(() => {
    setInput("");
    setOutput("");
    setEntries([]);
    setSensitiveCount(0);
  }, []);

  const isK8s =
    format === "k8s-configmap" ||
    format === "k8s-secret" ||
    format === "k8s-secret-stringdata";
  const isDocker =
    format === "docker-compose-env" || format === "docker-compose-env-file";

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          .env to Docker/K8s Converter
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Convert .env files to Docker Compose environment blocks, Kubernetes
          ConfigMaps, Secrets, or docker run flags. Sensitive keys are detected
          automatically.{" "}
          <Link
            href="/tools/env-validator"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Validate your .env first →
          </Link>
        </p>
      </div>

      <RateLimitBanner isLimited={isLimited} remaining={remaining} dailyLimit={dailyLimit} />

      {/* Format selector */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Output Format
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {OUTPUT_FORMATS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFormat(f.id)}
              className={`text-left px-3 py-2 rounded-lg border text-sm transition-colors ${
                format === f.id
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300"
              }`}
            >
              <div className="font-medium">{f.label}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {f.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Options row */}
      <div className="flex flex-wrap gap-4">
        {isDocker && (
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              Service Name
            </label>
            <input
              type="text"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value || "app")}
              className="px-3 py-1.5 text-sm rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white w-40"
              placeholder="app"
            />
          </div>
        )}
        {isK8s && (
          <>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Resource Name
              </label>
              <input
                type="text"
                value={resourceName}
                onChange={(e) =>
                  setResourceName(e.target.value || "app-config")
                }
                className="px-3 py-1.5 text-sm rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white w-40"
                placeholder="app-config"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Namespace{" "}
                <span className="text-gray-400 dark:text-gray-500">
                  (optional)
                </span>
              </label>
              <input
                type="text"
                value={namespace}
                onChange={(e) => setNamespace(e.target.value)}
                className="px-3 py-1.5 text-sm rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white w-40"
                placeholder="default"
              />
            </div>
          </>
        )}
        {format === "docker-run" && (
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              Image Name
            </label>
            <input
              type="text"
              value={imageName}
              onChange={(e) =>
                setImageName(e.target.value || "your-image:latest")
              }
              className="px-3 py-1.5 text-sm rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white w-52"
              placeholder="your-image:latest"
            />
          </div>
        )}
      </div>

      {/* Sample buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
          Samples:
        </span>
        {SAMPLES.map((s) => (
          <button
            key={s.label}
            onClick={() => {
              setInput(s.value);
              setOutput("");
              setEntries([]);
            }}
            className="px-2.5 py-1 text-xs font-medium rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              .env Input
            </label>
            {input && (
              <button
                onClick={handleClear}
                className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                Clear
              </button>
            )}
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`# Paste your .env file here\nNODE_ENV=production\nPORT=3000\nDATABASE_URL=postgresql://user:pass@db:5432/app\nAPI_KEY=your-key-here`}
            className="w-full h-80 px-3 py-2 font-mono text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-y"
            spellCheck={false}
          />
        </div>

        {/* Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Output
            </label>
            <div className="flex gap-2">
              {output && (
                <>
                  <button
                    onClick={handleDownload}
                    className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    Download
                  </button>
                  <button
                    onClick={handleCopy}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </>
              )}
            </div>
          </div>
          <textarea
            value={output}
            readOnly
            placeholder="Converted output will appear here..."
            className="w-full h-80 px-3 py-2 font-mono text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-y"
            spellCheck={false}
          />
        </div>
      </div>

      {/* Convert button */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleConvert}
          disabled={!input.trim() || isLimited}
          className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Convert
        </button>
        <span className="text-xs text-gray-400 dark:text-gray-500">
          Ctrl+Enter
        </span>
      </div>

      {/* Stats */}
      {entries.length > 0 && (
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="px-3 py-1.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
            <span className="font-medium">{entries.length}</span> variables
          </div>
          {sensitiveCount > 0 && (
            <div className="px-3 py-1.5 rounded-md bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300">
              <span className="font-medium">{sensitiveCount}</span> sensitive
              key{sensitiveCount !== 1 ? "s" : ""} detected
            </div>
          )}
          <div className="px-3 py-1.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
            Format:{" "}
            <span className="font-medium">
              {OUTPUT_FORMATS.find((f) => f.id === format)?.label}
            </span>
          </div>
        </div>
      )}

      {/* Sensitive key warning */}
      {sensitiveCount > 0 && format === "k8s-configmap" && (
        <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-sm text-amber-800 dark:text-amber-200">
          <strong>Tip:</strong> {sensitiveCount} key
          {sensitiveCount !== 1 ? "s" : ""} (
          {entries
            .filter((e) => isSensitiveKey(e.key))
            .map((e) => e.key)
            .slice(0, 3)
            .join(", ")}
          {sensitiveCount > 3 ? ", ..." : ""}) look sensitive and are flagged in
          the output. Consider using a{" "}
          <button
            onClick={() => setFormat("k8s-secret")}
            className="font-medium underline hover:no-underline"
          >
            Kubernetes Secret
          </button>{" "}
          instead of a ConfigMap for these values.
        </div>
      )}

      {/* Reference section */}
      <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Output Format Reference
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="py-2 pr-4 font-medium text-gray-900 dark:text-white">
                  Format
                </th>
                <th className="py-2 pr-4 font-medium text-gray-900 dark:text-white">
                  Use Case
                </th>
                <th className="py-2 font-medium text-gray-900 dark:text-white">
                  Sensitive Data?
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              <tr>
                <td className="py-2 pr-4 font-mono text-xs">
                  Docker Compose (inline)
                </td>
                <td className="py-2 pr-4">
                  Variables directly in docker-compose.yml
                </td>
                <td className="py-2">
                  Not recommended — values visible in file
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-xs">
                  Docker Compose (env_file)
                </td>
                <td className="py-2 pr-4">
                  Reference .env file from compose
                </td>
                <td className="py-2">
                  Better — .env excluded from VCS via .gitignore
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-xs">
                  K8s ConfigMap
                </td>
                <td className="py-2 pr-4">
                  Non-sensitive config in Kubernetes
                </td>
                <td className="py-2">
                  Not for secrets — data is plain text
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-xs">
                  K8s Secret (base64)
                </td>
                <td className="py-2 pr-4">
                  Standard K8s secrets (base64 encoded)
                </td>
                <td className="py-2">
                  Base64 is encoding, not encryption — use RBAC + encryption at
                  rest
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-xs">
                  K8s Secret (stringData)
                </td>
                <td className="py-2 pr-4">
                  Human-readable secrets (auto-encoded by K8s)
                </td>
                <td className="py-2">
                  Same security as data: — encoded on apply
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-xs">
                  docker run -e
                </td>
                <td className="py-2 pr-4">
                  One-off container runs with env vars
                </td>
                <td className="py-2">
                  Visible in process list — avoid for secrets
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Cross-links */}
      <div className="flex flex-wrap gap-2 text-xs">
        <span className="text-gray-500 dark:text-gray-400">Related:</span>
        <Link
          href="/tools/env-validator"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          .env Validator
        </Link>
        <span className="text-gray-300 dark:text-gray-600">·</span>
        <Link
          href="/tools/docker-compose"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          Docker Compose Validator
        </Link>
        <span className="text-gray-300 dark:text-gray-600">·</span>
        <Link
          href="/tools/k8s-validator"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          Kubernetes Validator
        </Link>
        <span className="text-gray-300 dark:text-gray-600">·</span>
        <Link
          href="/tools/dockerfile-validator"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          Dockerfile Validator
        </Link>
        <span className="text-gray-300 dark:text-gray-600">·</span>
        <Link
          href="/tools/yaml-formatter"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          YAML Formatter
        </Link>
      </div>
    </div>
  );
}
