"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import yaml from "js-yaml";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";
import { useSmartPasteInput } from "@/hooks/useSmartPasteInput";
import RateLimitBanner from "@/components/RateLimitBanner";

const SAMPLE_COMPOSE = `services:
  web:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgres://db:5432/app
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_started
    volumes:
      - ./src:/app/src
      - node_modules:/app/node_modules
    networks:
      - frontend
      - backend
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: app
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: secret
    volumes:
      - pgdata:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    networks:
      - backend
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    networks:
      - backend
    volumes:
      - redis_data:/data

volumes:
  pgdata:
  node_modules:
  redis_data:

networks:
  frontend:
  backend:`;

interface Issue {
  type: "error" | "warning" | "info";
  message: string;
}

const VALID_TOP_LEVEL_KEYS = new Set([
  "version",
  "services",
  "networks",
  "volumes",
  "configs",
  "secrets",
  "name",
  "include",
  "x-",
]);

const VALID_SERVICE_KEYS = new Set([
  "image",
  "build",
  "command",
  "entrypoint",
  "container_name",
  "depends_on",
  "deploy",
  "dns",
  "dns_search",
  "env_file",
  "environment",
  "expose",
  "external_links",
  "extra_hosts",
  "healthcheck",
  "hostname",
  "init",
  "labels",
  "links",
  "logging",
  "network_mode",
  "networks",
  "pid",
  "platform",
  "ports",
  "privileged",
  "profiles",
  "pull_policy",
  "read_only",
  "restart",
  "runtime",
  "scale",
  "secrets",
  "security_opt",
  "shm_size",
  "stdin_open",
  "stop_grace_period",
  "stop_signal",
  "sysctls",
  "tmpfs",
  "tty",
  "ulimits",
  "user",
  "userns_mode",
  "volumes",
  "volumes_from",
  "working_dir",
  "cap_add",
  "cap_drop",
  "cgroup_parent",
  "configs",
  "cpu_count",
  "cpu_percent",
  "cpu_shares",
  "cpu_period",
  "cpu_quota",
  "cpu_rt_runtime",
  "cpu_rt_period",
  "cpus",
  "cpuset",
  "devices",
  "device_cgroup_rules",
  "domainname",
  "ipc",
  "isolation",
  "mac_address",
  "mem_limit",
  "mem_reservation",
  "mem_swappiness",
  "memswap_limit",
  "oom_kill_disable",
  "oom_score_adj",
  "group_add",
  "develop",
  "annotations",
  "attach",
  "credential_spec",
  "blkio_config",
  "storage_opt",
]);

function isExtensionKey(key: string): boolean {
  return key.startsWith("x-");
}

function validateCompose(input: string): { issues: Issue[]; parsed: Record<string, unknown> | null } {
  const issues: Issue[] = [];

  if (!input.trim()) {
    return { issues: [{ type: "error", message: "Empty input" }], parsed: null };
  }

  // Parse YAML
  let parsed: unknown;
  try {
    parsed = yaml.load(input, { schema: yaml.DEFAULT_SCHEMA });
  } catch (e) {
    if (e instanceof yaml.YAMLException) {
      let msg = "Invalid YAML syntax";
      if (e.mark) {
        msg = `Line ${e.mark.line + 1}, Column ${e.mark.column + 1}: ${e.reason || e.message}`;
      }
      return { issues: [{ type: "error", message: msg }], parsed: null };
    }
    return { issues: [{ type: "error", message: "Failed to parse YAML" }], parsed: null };
  }

  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    issues.push({ type: "error", message: "Docker Compose file must be a YAML mapping (object) at root level" });
    return { issues, parsed: null };
  }

  const doc = parsed as Record<string, unknown>;

  // Check top-level keys
  for (const key of Object.keys(doc)) {
    if (!VALID_TOP_LEVEL_KEYS.has(key) && !isExtensionKey(key)) {
      issues.push({ type: "warning", message: `Unknown top-level key: "${key}"` });
    }
  }

  // Version field
  if ("version" in doc) {
    issues.push({
      type: "info",
      message: `"version" field ("${doc.version}") is obsolete in Compose v2+ and can be removed`,
    });
  }

  // Services
  if (!("services" in doc)) {
    issues.push({ type: "error", message: 'Missing required "services" key' });
    return { issues, parsed: doc };
  }

  const services = doc.services;
  if (typeof services !== "object" || services === null || Array.isArray(services)) {
    issues.push({ type: "error", message: '"services" must be a mapping' });
    return { issues, parsed: doc };
  }

  const serviceNames = new Set(Object.keys(services as Record<string, unknown>));
  const declaredVolumes = new Set<string>();
  const declaredNetworks = new Set<string>();

  // Collect declared volumes
  if (doc.volumes && typeof doc.volumes === "object" && !Array.isArray(doc.volumes)) {
    for (const v of Object.keys(doc.volumes as Record<string, unknown>)) {
      declaredVolumes.add(v);
    }
  }

  // Collect declared networks
  if (doc.networks && typeof doc.networks === "object" && !Array.isArray(doc.networks)) {
    for (const n of Object.keys(doc.networks as Record<string, unknown>)) {
      declaredNetworks.add(n);
    }
  }

  const svcMap = services as Record<string, unknown>;

  for (const [svcName, svcDef] of Object.entries(svcMap)) {
    if (isExtensionKey(svcName)) continue;

    if (typeof svcDef !== "object" || svcDef === null || Array.isArray(svcDef)) {
      issues.push({ type: "error", message: `Service "${svcName}": must be a mapping` });
      continue;
    }

    const svc = svcDef as Record<string, unknown>;

    // Check service keys
    for (const key of Object.keys(svc)) {
      if (!VALID_SERVICE_KEYS.has(key) && !isExtensionKey(key)) {
        issues.push({ type: "warning", message: `Service "${svcName}": unknown key "${key}"` });
      }
    }

    // Must have image or build
    if (!("image" in svc) && !("build" in svc)) {
      issues.push({ type: "error", message: `Service "${svcName}": must specify either "image" or "build"` });
    }

    // Validate depends_on
    if ("depends_on" in svc) {
      const deps = svc.depends_on;
      let depNames: string[] = [];
      if (Array.isArray(deps)) {
        depNames = deps.filter((d) => typeof d === "string") as string[];
      } else if (typeof deps === "object" && deps !== null) {
        depNames = Object.keys(deps as Record<string, unknown>);
      }

      for (const dep of depNames) {
        if (dep === svcName) {
          issues.push({ type: "error", message: `Service "${svcName}": depends on itself` });
        } else if (!serviceNames.has(dep)) {
          issues.push({ type: "error", message: `Service "${svcName}": depends on undefined service "${dep}"` });
        }
      }
    }

    // Validate ports
    if ("ports" in svc && Array.isArray(svc.ports)) {
      for (const port of svc.ports) {
        if (typeof port === "string") {
          const portStr = port as string;
          // Basic port format validation: host:container or just container
          const portPattern = /^(\d{1,5}(-\d{1,5})?(:\d{1,5}(-\d{1,5})?)?(\/\w+)?|"\d{1,5}(-\d{1,5})?(:\d{1,5}(-\d{1,5})?)?(\/\w+)?"|[\d.:/-]+)$/;
          if (!portPattern.test(portStr)) {
            issues.push({ type: "warning", message: `Service "${svcName}": unusual port format "${portStr}"` });
          }
        }
      }
    }

    // Check network references
    if ("networks" in svc) {
      const svcNetworks = svc.networks;
      let networkNames: string[] = [];
      if (Array.isArray(svcNetworks)) {
        networkNames = svcNetworks.filter((n) => typeof n === "string") as string[];
      } else if (typeof svcNetworks === "object" && svcNetworks !== null) {
        networkNames = Object.keys(svcNetworks as Record<string, unknown>);
      }

      if (declaredNetworks.size > 0) {
        for (const net of networkNames) {
          if (!declaredNetworks.has(net)) {
            issues.push({
              type: "error",
              message: `Service "${svcName}": references undefined network "${net}"`,
            });
          }
        }
      }
    }

    // Check named volume references
    if ("volumes" in svc && Array.isArray(svc.volumes)) {
      for (const vol of svc.volumes) {
        if (typeof vol === "string") {
          const volStr = vol as string;
          // Named volumes: name:/path (not starting with . or / or ~)
          const parts = volStr.split(":");
          if (parts.length >= 2) {
            const source = parts[0];
            if (source && !source.startsWith(".") && !source.startsWith("/") && !source.startsWith("~") && !source.startsWith("$")) {
              if (declaredVolumes.size > 0 && !declaredVolumes.has(source)) {
                issues.push({
                  type: "error",
                  message: `Service "${svcName}": references undefined volume "${source}"`,
                });
              }
            }
          }
        }
      }
    }

    // Restart policy
    if ("restart" in svc && typeof svc.restart === "string") {
      const validPolicies = ["no", "always", "on-failure", "unless-stopped"];
      if (!validPolicies.includes(svc.restart)) {
        issues.push({
          type: "warning",
          message: `Service "${svcName}": unusual restart policy "${svc.restart}" — expected one of: ${validPolicies.join(", ")}`,
        });
      }
    }
  }

  // Check for unused volumes
  if (declaredVolumes.size > 0) {
    const usedVolumes = new Set<string>();
    for (const [svcName, svcDef] of Object.entries(svcMap)) {
      if (isExtensionKey(svcName)) continue;
      const svc = svcDef as Record<string, unknown>;
      if ("volumes" in svc && Array.isArray(svc.volumes)) {
        for (const vol of svc.volumes) {
          if (typeof vol === "string") {
            const parts = (vol as string).split(":");
            if (parts.length >= 2) {
              const source = parts[0];
              if (source && !source.startsWith(".") && !source.startsWith("/") && !source.startsWith("~") && !source.startsWith("$")) {
                usedVolumes.add(source);
              }
            }
          }
        }
      }
    }
    for (const v of declaredVolumes) {
      if (!usedVolumes.has(v)) {
        issues.push({ type: "info", message: `Volume "${v}" is declared but not used by any service` });
      }
    }
  }

  // Check for unused networks
  if (declaredNetworks.size > 0) {
    const usedNetworks = new Set<string>();
    for (const [svcName, svcDef] of Object.entries(svcMap)) {
      if (isExtensionKey(svcName)) continue;
      const svc = svcDef as Record<string, unknown>;
      if ("networks" in svc) {
        const svcNetworks = svc.networks;
        let networkNames: string[] = [];
        if (Array.isArray(svcNetworks)) {
          networkNames = svcNetworks.filter((n) => typeof n === "string") as string[];
        } else if (typeof svcNetworks === "object" && svcNetworks !== null) {
          networkNames = Object.keys(svcNetworks as Record<string, unknown>);
        }
        for (const n of networkNames) usedNetworks.add(n);
      }
    }
    for (const n of declaredNetworks) {
      if (!usedNetworks.has(n)) {
        issues.push({ type: "info", message: `Network "${n}" is declared but not used by any service` });
      }
    }
  }

  return { issues, parsed: doc };
}

function formatCompose(input: string, indent: number, sortKeys: boolean): string {
  const parsed = yaml.load(input, { schema: yaml.DEFAULT_SCHEMA });
  return yaml.dump(parsed, {
    indent,
    lineWidth: -1,
    noRefs: true,
    sortKeys,
    quotingType: '"',
    forceQuotes: false,
  }).trimEnd();
}

export default function DockerComposeTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [issues, setIssues] = useState<Issue[]>([]);
  const [indentSize, setIndentSize] = useState<"2" | "4">("2");
  const [sortKeys, setSortKeys] = useState(false);
  const [copied, setCopied] = useState(false);
  const { remaining, dailyLimit, isLimited, recordUsage } =
    useRateLimit("docker-compose");
  const { trackAction } = useToolAnalytics("docker-compose");
  useSmartPasteInput(setInput);

  const handleValidate = useCallback(() => {
    if (isLimited) return;
    recordUsage();
    trackAction("validate");
    setError("");
    setOutput("");
    setIssues([]);
    setCopied(false);

    if (!input.trim()) {
      setError("Please enter a Docker Compose file to validate.");
      return;
    }

    const result = validateCompose(input);
    setIssues(result.issues);
  }, [input, isLimited, recordUsage, trackAction]);

  useKeyboardShortcut("Enter", handleValidate);

  function handleFormat() {
    if (isLimited) return;
    recordUsage();
    trackAction("format");
    setError("");
    setOutput("");
    setIssues([]);
    setCopied(false);

    if (!input.trim()) {
      setError("Please enter a Docker Compose file to format.");
      return;
    }

    const result = validateCompose(input);
    const errors = result.issues.filter((i) => i.type === "error");
    if (errors.length > 0) {
      setIssues(result.issues);
      return;
    }

    try {
      const formatted = formatCompose(input, Number(indentSize), sortKeys);
      setOutput(formatted);
      setIssues(result.issues);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error formatting file");
    }
  }

  function handleCopy() {
    if (output) {
      navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  }

  function handleLoadSample() {
    setInput(SAMPLE_COMPOSE);
    setOutput("");
    setError("");
    setIssues([]);
    setCopied(false);
  }

  const errorCount = issues.filter((i) => i.type === "error").length;
  const warningCount = issues.filter((i) => i.type === "warning").length;
  const infoCount = issues.filter((i) => i.type === "info").length;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="mb-8 block text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        &larr; Back to tools
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Docker Compose Validator
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Validate and format Docker Compose files. Checks YAML syntax, service
        structure, network and volume references, dependency chains, and common
        misconfigurations.
      </p>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste your docker-compose.yml here..."
        rows={14}
        spellCheck={false}
        className="w-full rounded-lg border border-gray-300 bg-white p-4 font-mono text-sm dark:border-gray-700 dark:bg-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      />

      {/* Options row */}
      <div className="flex flex-wrap items-center gap-4 mt-3 text-sm">
        <div className="flex items-center gap-2">
          <label className="text-gray-600 dark:text-gray-400 font-medium">
            Indent:
          </label>
          <div className="flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
            {(["2", "4"] as const).map((size) => (
              <button
                key={size}
                onClick={() => setIndentSize(size)}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  indentSize === size
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                {size} spaces
              </button>
            ))}
          </div>
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={sortKeys}
            onChange={(e) => setSortKeys(e.target.checked)}
            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600"
          />
          <span className="text-gray-600 dark:text-gray-400 font-medium">
            Sort keys
          </span>
        </label>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap items-center gap-2 mt-4">
        <button
          onClick={handleValidate}
          disabled={isLimited}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          Validate{" "}
          <kbd className="ml-1 hidden rounded bg-indigo-500 px-1.5 py-0.5 text-xs font-normal text-indigo-100 sm:inline">
            Ctrl+Enter
          </kbd>
        </button>
        <button
          onClick={handleFormat}
          disabled={isLimited}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          Format
        </button>
        <button
          onClick={handleLoadSample}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
        >
          Load sample
        </button>
        <RateLimitBanner
          remaining={remaining}
          dailyLimit={dailyLimit}
          isLimited={isLimited}
        />
      </div>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-600 dark:bg-red-950 dark:border-red-800 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Validation results */}
      {issues.length > 0 && (
        <div className="mt-4 space-y-2">
          {/* Summary bar */}
          <div className="flex items-center gap-3 text-sm font-medium">
            {errorCount === 0 && warningCount === 0 && (
              <span className="text-green-600 dark:text-green-400">
                Valid Docker Compose file
              </span>
            )}
            {errorCount > 0 && (
              <span className="text-red-600 dark:text-red-400">
                {errorCount} error{errorCount !== 1 ? "s" : ""}
              </span>
            )}
            {warningCount > 0 && (
              <span className="text-yellow-600 dark:text-yellow-400">
                {warningCount} warning{warningCount !== 1 ? "s" : ""}
              </span>
            )}
            {infoCount > 0 && (
              <span className="text-blue-600 dark:text-blue-400">
                {infoCount} info
              </span>
            )}
          </div>

          {/* Issue list */}
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700 overflow-hidden">
            {issues.map((issue, i) => (
              <div
                key={i}
                className={`flex items-start gap-2 px-4 py-2.5 text-sm ${
                  issue.type === "error"
                    ? "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400"
                    : issue.type === "warning"
                      ? "bg-yellow-50 text-yellow-700 dark:bg-yellow-950/50 dark:text-yellow-400"
                      : "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400"
                }`}
              >
                <span className="font-medium shrink-0 mt-0.5">
                  {issue.type === "error"
                    ? "ERR"
                    : issue.type === "warning"
                      ? "WARN"
                      : "INFO"}
                </span>
                <span>{issue.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {output && (
        <div className="relative mt-4 rounded-lg border border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-950">
          <button
            onClick={handleCopy}
            className="absolute right-2 top-2 rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
          <textarea
            readOnly
            value={output}
            rows={Math.min(20, output.split("\n").length + 1)}
            spellCheck={false}
            className="w-full rounded-lg border-0 bg-transparent p-4 font-mono text-sm text-gray-900 dark:text-gray-100 focus:outline-none"
          />
        </div>
      )}

      {/* About section */}
      <details className="mt-8 rounded-lg border border-gray-200 dark:border-gray-700">
        <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          About Docker Compose Validation
        </summary>
        <div className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400 space-y-3">
          <p>
            Docker Compose is a tool for defining and running multi-container
            applications. Compose files use YAML to configure your app&apos;s
            services, networks, and volumes.
          </p>
          <p>
            <strong>What we check:</strong>
          </p>
          <ul className="list-disc ml-5 space-y-1">
            <li>Valid YAML syntax with precise error locations</li>
            <li>Top-level structure (services, networks, volumes, configs, secrets)</li>
            <li>Service keys against the Compose specification</li>
            <li>Every service has an <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">image</code> or <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">build</code> directive</li>
            <li>Network and volume references resolve to declared resources</li>
            <li><code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">depends_on</code> references exist and don&apos;t self-reference</li>
            <li>Port format validity and restart policy values</li>
            <li>Unused declared volumes and networks</li>
          </ul>
          <p>
            <strong>Format:</strong> Re-serializes your Compose file with
            consistent indentation and optionally sorted keys, making it easier
            to review and compare in version control.
          </p>
          <p>
            Everything runs in your browser — no data is sent over the network.
          </p>
        </div>
      </details>
    </div>
  );
}
