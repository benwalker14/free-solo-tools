"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";
import RateLimitBanner from "@/components/RateLimitBanner";

const SAMPLE_DOCKERFILE = `FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --production=false

COPY . .
RUN npm run build

FROM node:20-alpine

WORKDIR /app

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

EXPOSE 3000

USER appuser

HEALTHCHECK --interval=30s --timeout=10s --retries=3 \\
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

CMD ["node", "dist/index.js"]`;

interface Issue {
  type: "error" | "warning" | "info";
  line: number | null;
  message: string;
}

const VALID_INSTRUCTIONS = new Set([
  "FROM",
  "RUN",
  "CMD",
  "LABEL",
  "MAINTAINER",
  "EXPOSE",
  "ENV",
  "ADD",
  "COPY",
  "ENTRYPOINT",
  "VOLUME",
  "USER",
  "WORKDIR",
  "ARG",
  "ONBUILD",
  "STOPSIGNAL",
  "HEALTHCHECK",
  "SHELL",
]);

interface ParsedLine {
  lineNumber: number;
  raw: string;
  instruction: string | null;
  args: string;
  isContinuation: boolean;
  isComment: boolean;
  isEmpty: boolean;
}

function parseDockerfile(input: string): ParsedLine[] {
  const rawLines = input.split("\n");
  const parsed: ParsedLine[] = [];
  let continuation = false;

  for (let i = 0; i < rawLines.length; i++) {
    const raw = rawLines[i];
    const trimmed = raw.trim();

    if (trimmed === "") {
      parsed.push({
        lineNumber: i + 1,
        raw,
        instruction: null,
        args: "",
        isContinuation: continuation,
        isComment: false,
        isEmpty: true,
      });
      continuation = false;
      continue;
    }

    if (trimmed.startsWith("#")) {
      parsed.push({
        lineNumber: i + 1,
        raw,
        instruction: null,
        args: "",
        isContinuation: false,
        isComment: true,
        isEmpty: false,
      });
      continue;
    }

    if (continuation) {
      parsed.push({
        lineNumber: i + 1,
        raw,
        instruction: null,
        args: trimmed,
        isContinuation: true,
        isComment: false,
        isEmpty: false,
      });
      continuation = trimmed.endsWith("\\");
      continue;
    }

    // Parse instruction
    const match = trimmed.match(/^([A-Za-z]+)\s*(.*)/);
    if (match) {
      const instruction = match[1].toUpperCase();
      const args = match[2] || "";
      parsed.push({
        lineNumber: i + 1,
        raw,
        instruction,
        args,
        isContinuation: false,
        isComment: false,
        isEmpty: false,
      });
      continuation = trimmed.endsWith("\\");
    } else {
      parsed.push({
        lineNumber: i + 1,
        raw,
        instruction: null,
        args: "",
        isContinuation: false,
        isComment: false,
        isEmpty: false,
      });
    }
  }

  return parsed;
}

function validateDockerfile(input: string): Issue[] {
  const issues: Issue[] = [];

  if (!input.trim()) {
    return [{ type: "error", line: null, message: "Empty input" }];
  }

  const lines = parseDockerfile(input);
  const instructions = lines.filter(
    (l) => l.instruction !== null && !l.isContinuation && !l.isComment && !l.isEmpty
  );

  if (instructions.length === 0) {
    issues.push({
      type: "error",
      line: null,
      message: "No valid instructions found in Dockerfile",
    });
    return issues;
  }

  // Check for unknown instructions
  for (const line of instructions) {
    if (line.instruction && !VALID_INSTRUCTIONS.has(line.instruction)) {
      issues.push({
        type: "error",
        line: line.lineNumber,
        message: `Unknown instruction "${line.instruction}"`,
      });
    }
  }

  // Must start with FROM (or ARG before FROM)
  const firstNonArg = instructions.find((l) => l.instruction !== "ARG");
  if (!firstNonArg || firstNonArg.instruction !== "FROM") {
    issues.push({
      type: "error",
      line: firstNonArg?.lineNumber ?? 1,
      message:
        "Dockerfile must begin with a FROM instruction (only ARG may precede it)",
    });
  }

  // Collect all FROM instructions to understand stages
  const fromInstructions = instructions.filter((l) => l.instruction === "FROM");
  const stageNames = new Set<string>();

  for (const from of fromInstructions) {
    const args = from.args.trim();
    // Check for :latest or no tag
    const imageMatch = args.match(/^(\S+?)(?:\s+[Aa][Ss]\s+(\S+))?$/);
    if (imageMatch) {
      const image = imageMatch[1];
      const alias = imageMatch[2];
      if (alias) stageNames.add(alias.toLowerCase());

      // Check for latest tag
      if (image.endsWith(":latest")) {
        issues.push({
          type: "warning",
          line: from.lineNumber,
          message: `Using ":latest" tag on "${image}" — pin to a specific version for reproducible builds`,
        });
      } else if (!image.includes(":") && !image.includes("$") && image !== "scratch") {
        issues.push({
          type: "warning",
          line: from.lineNumber,
          message: `No tag specified for "${image}" (defaults to :latest) — pin to a specific version`,
        });
      }
    }

    if (!args) {
      issues.push({
        type: "error",
        line: from.lineNumber,
        message: "FROM requires an image argument",
      });
    }
  }

  if (fromInstructions.length > 1) {
    issues.push({
      type: "info",
      line: fromInstructions[0].lineNumber,
      message: `Multi-stage build detected — ${fromInstructions.length} stages`,
    });
  }

  // Collect full RUN commands (including continuations)
  const runCommands: { lineNumber: number; fullCommand: string }[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.instruction === "RUN") {
      let full = line.args;
      let j = i + 1;
      while (j < lines.length && lines[j].isContinuation) {
        full += " " + lines[j].args.replace(/\\$/, "").trim();
        j++;
      }
      runCommands.push({ lineNumber: line.lineNumber, fullCommand: full.replace(/\\$/, "").trim() });
    }
  }

  // Check RUN instructions for best practices
  for (const run of runCommands) {
    const cmd = run.fullCommand;

    // apt-get install without --no-install-recommends
    if (
      cmd.includes("apt-get install") &&
      !cmd.includes("--no-install-recommends")
    ) {
      issues.push({
        type: "warning",
        line: run.lineNumber,
        message:
          "Consider using --no-install-recommends with apt-get install to reduce image size",
      });
    }

    // apt-get install without cleanup
    if (
      cmd.includes("apt-get install") &&
      !cmd.includes("rm -rf /var/lib/apt/lists")
    ) {
      issues.push({
        type: "warning",
        line: run.lineNumber,
        message:
          "Consider cleaning apt cache in the same layer: rm -rf /var/lib/apt/lists/*",
      });
    }

    // apt-get update without install in same RUN
    if (cmd.includes("apt-get update") && !cmd.includes("apt-get install")) {
      issues.push({
        type: "warning",
        line: run.lineNumber,
        message:
          "apt-get update should be combined with apt-get install in the same RUN to avoid cache issues",
      });
    }

    // Using curl/wget to pipe to shell
    if (
      cmd.match(/curl\s.*\|\s*(sh|bash)/) ||
      cmd.match(/wget\s.*\|\s*(sh|bash)/)
    ) {
      issues.push({
        type: "warning",
        line: run.lineNumber,
        message:
          "Piping from curl/wget to shell is risky — consider downloading, verifying, then executing",
      });
    }
  }

  // Check ADD vs COPY
  const addInstructions = instructions.filter((l) => l.instruction === "ADD");
  for (const add of addInstructions) {
    const args = add.args.trim();
    // ADD is fine for URLs and tar extraction
    if (!args.match(/^https?:\/\//) && !args.match(/\.(tar|gz|bz2|xz|tgz)/i)) {
      issues.push({
        type: "warning",
        line: add.lineNumber,
        message:
          "Prefer COPY over ADD for local files — ADD has implicit tar extraction and URL fetching behavior",
      });
    }
  }

  // Check for multiple CMD / ENTRYPOINT (only last takes effect)
  const cmdInstructions = instructions.filter((l) => l.instruction === "CMD");
  // In multi-stage builds, check within the last stage only
  const lastFromIndex = instructions.findLastIndex((l) => l.instruction === "FROM");
  const lastStageInstructions = instructions.slice(lastFromIndex);

  const lastStageCmds = lastStageInstructions.filter((l) => l.instruction === "CMD");
  if (lastStageCmds.length > 1) {
    issues.push({
      type: "warning",
      line: lastStageCmds[0].lineNumber,
      message: `Multiple CMD instructions in final stage — only the last one (line ${lastStageCmds[lastStageCmds.length - 1].lineNumber}) will take effect`,
    });
  }

  const lastStageEntrypoints = lastStageInstructions.filter(
    (l) => l.instruction === "ENTRYPOINT"
  );
  if (lastStageEntrypoints.length > 1) {
    issues.push({
      type: "warning",
      line: lastStageEntrypoints[0].lineNumber,
      message: `Multiple ENTRYPOINT instructions in final stage — only the last one (line ${lastStageEntrypoints[lastStageEntrypoints.length - 1].lineNumber}) will take effect`,
    });
  }

  // CMD / ENTRYPOINT shell form vs exec form
  for (const cmd of [...cmdInstructions, ...instructions.filter((l) => l.instruction === "ENTRYPOINT")]) {
    const args = cmd.args.trim();
    if (args && !args.startsWith("[")) {
      issues.push({
        type: "info",
        line: cmd.lineNumber,
        message: `${cmd.instruction} uses shell form — exec form (JSON array) is preferred for proper signal handling`,
      });
    }
  }

  // WORKDIR should use absolute paths
  const workdirInstructions = instructions.filter(
    (l) => l.instruction === "WORKDIR"
  );
  for (const wd of workdirInstructions) {
    const path = wd.args.trim();
    if (path && !path.startsWith("/") && !path.startsWith("$")) {
      issues.push({
        type: "warning",
        line: wd.lineNumber,
        message: `WORKDIR "${path}" is relative — use an absolute path for clarity`,
      });
    }
  }

  // EXPOSE validation
  const exposeInstructions = instructions.filter(
    (l) => l.instruction === "EXPOSE"
  );
  for (const exp of exposeInstructions) {
    const args = exp.args.trim();
    if (!args) {
      issues.push({
        type: "error",
        line: exp.lineNumber,
        message: "EXPOSE requires at least one port argument",
      });
    } else {
      const ports = args.split(/\s+/);
      for (const port of ports) {
        const portMatch = port.match(/^(\d+)(\/(?:tcp|udp))?$/);
        if (!portMatch && !port.startsWith("$")) {
          issues.push({
            type: "warning",
            line: exp.lineNumber,
            message: `EXPOSE: unusual port format "${port}" — expected number or number/protocol`,
          });
        } else if (portMatch) {
          const num = parseInt(portMatch[1], 10);
          if (num < 1 || num > 65535) {
            issues.push({
              type: "error",
              line: exp.lineNumber,
              message: `EXPOSE: port ${num} out of range (1-65535)`,
            });
          }
        }
      }
    }
  }

  // MAINTAINER is deprecated
  const maintainerInstructions = instructions.filter(
    (l) => l.instruction === "MAINTAINER"
  );
  for (const m of maintainerInstructions) {
    issues.push({
      type: "warning",
      line: m.lineNumber,
      message:
        'MAINTAINER is deprecated — use LABEL maintainer="name" instead',
    });
  }

  // Check if USER is set (running as root)
  const lastStageUser = lastStageInstructions.filter(
    (l) => l.instruction === "USER"
  );
  if (lastStageUser.length === 0 && fromInstructions.length > 0) {
    // Check if the base image is scratch
    const lastFrom = fromInstructions[fromInstructions.length - 1];
    if (!lastFrom.args.trim().startsWith("scratch")) {
      issues.push({
        type: "warning",
        line: null,
        message:
          "No USER instruction in final stage — container will run as root. Consider adding a non-root user",
      });
    }
  }

  // Check for HEALTHCHECK in final stage
  const lastStageHealthcheck = lastStageInstructions.filter(
    (l) => l.instruction === "HEALTHCHECK"
  );
  if (lastStageHealthcheck.length === 0 && fromInstructions.length > 0) {
    issues.push({
      type: "info",
      line: null,
      message:
        "No HEALTHCHECK instruction — consider adding one for container orchestration",
    });
  }

  // ENV with spaces (old syntax without =)
  const envInstructions = instructions.filter((l) => l.instruction === "ENV");
  for (const env of envInstructions) {
    const args = env.args.trim();
    // Old-style: ENV KEY VALUE (no = sign, only sets one var)
    if (args && !args.includes("=") && args.split(/\s+/).length === 2) {
      issues.push({
        type: "info",
        line: env.lineNumber,
        message:
          'ENV uses legacy "KEY VALUE" syntax — prefer "KEY=VALUE" form',
      });
    }
  }

  // COPY --from referencing unknown stage
  const copyInstructions = instructions.filter((l) => l.instruction === "COPY");
  for (const cp of copyInstructions) {
    const fromMatch = cp.args.match(/--from=(\S+)/);
    if (fromMatch) {
      const ref = fromMatch[1];
      // If it's a number, it's a stage index; if a name, check against stageNames
      if (!/^\d+$/.test(ref) && !stageNames.has(ref.toLowerCase())) {
        issues.push({
          type: "error",
          line: cp.lineNumber,
          message: `COPY --from="${ref}" references unknown build stage`,
        });
      }
    }
  }

  // Sort by line number (nulls last)
  issues.sort((a, b) => {
    if (a.line === null && b.line === null) return 0;
    if (a.line === null) return 1;
    if (b.line === null) return -1;
    return a.line - b.line;
  });

  return issues;
}

export default function DockerfileValidatorTool() {
  const [input, setInput] = useState("");
  const [issues, setIssues] = useState<Issue[]>([]);
  const [hasValidated, setHasValidated] = useState(false);
  const [copied, setCopied] = useState(false);
  const { remaining, dailyLimit, isLimited, recordUsage } =
    useRateLimit("dockerfile-validator");
  const { trackAction } = useToolAnalytics("dockerfile-validator");

  const handleValidate = useCallback(() => {
    if (isLimited) return;
    recordUsage();
    trackAction("validate");
    setCopied(false);

    if (!input.trim()) {
      setIssues([{ type: "error", line: null, message: "Please enter a Dockerfile to validate." }]);
      setHasValidated(false);
      return;
    }

    const result = validateDockerfile(input);
    setIssues(result);
    setHasValidated(true);
  }, [input, isLimited, recordUsage, trackAction]);

  useKeyboardShortcut("Enter", handleValidate);

  function handleLoadSample() {
    setInput(SAMPLE_DOCKERFILE);
    setIssues([]);
    setHasValidated(false);
    setCopied(false);
  }

  function handleCopy() {
    navigator.clipboard.writeText(input);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
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
        Dockerfile Validator
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Validate your Dockerfile for syntax errors, security issues, and best
        practices. Checks instructions, image tags, layer optimization, and
        more.
      </p>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste your Dockerfile here..."
        rows={16}
        spellCheck={false}
        className="w-full rounded-lg border border-gray-300 bg-white p-4 font-mono text-sm dark:border-gray-700 dark:bg-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      />

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
          onClick={handleLoadSample}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
        >
          Load sample
        </button>
        <button
          onClick={handleCopy}
          disabled={!input}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
        <RateLimitBanner
          remaining={remaining}
          dailyLimit={dailyLimit}
          isLimited={isLimited}
        />
      </div>

      {/* Validation results */}
      {issues.length > 0 && (
        <div className="mt-4 space-y-2">
          {/* Summary bar */}
          <div className="flex items-center gap-3 text-sm font-medium">
            {errorCount === 0 && warningCount === 0 && hasValidated && (
              <span className="text-green-600 dark:text-green-400">
                Valid Dockerfile
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
                <span>
                  {issue.line && (
                    <span className="font-mono opacity-70">
                      Line {issue.line}:{" "}
                    </span>
                  )}
                  {issue.message}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {hasValidated && issues.length === 0 && (
        <div className="mt-4 rounded-lg bg-green-50 border border-green-200 p-4 text-sm text-green-700 dark:bg-green-950/50 dark:border-green-800 dark:text-green-400">
          No issues found — your Dockerfile looks good!
        </div>
      )}

      {/* About section */}
      <details className="mt-8 rounded-lg border border-gray-200 dark:border-gray-700">
        <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          About Dockerfile Validation
        </summary>
        <div className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400 space-y-3">
          <p>
            A Dockerfile is a text document containing instructions to
            assemble a Docker container image. Each instruction creates a
            layer in the image.
          </p>
          <p>
            <strong>What we check:</strong>
          </p>
          <ul className="list-disc ml-5 space-y-1">
            <li>Valid Dockerfile instructions (FROM, RUN, COPY, etc.)</li>
            <li>
              FROM requirements — must be first instruction, image tag
              pinning
            </li>
            <li>
              Multi-stage build validation — stage names and{" "}
              <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">
                COPY --from
              </code>{" "}
              references
            </li>
            <li>
              Security — running as root, piping scripts from URLs
            </li>
            <li>
              Best practices — ADD vs COPY, exec form vs shell form,
              apt-get cleanup
            </li>
            <li>
              Layer optimization — combining apt-get update and install,
              cleaning caches
            </li>
            <li>
              Deprecated instructions like{" "}
              <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">
                MAINTAINER
              </code>
            </li>
            <li>EXPOSE port validation and WORKDIR absolute paths</li>
            <li>HEALTHCHECK and USER instruction presence</li>
          </ul>
          <p>
            Everything runs in your browser — no data is sent over the
            network.
          </p>
        </div>
      </details>
    </div>
  );
}
