"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";
import RateLimitBanner from "@/components/RateLimitBanner";

const SAMPLE_WORKFLOW = `name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

permissions:
  contents: read

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run lint

  test:
    runs-on: ubuntu-latest
    needs: lint
    strategy:
      matrix:
        node-version: [18, 20, 22]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: \${{ matrix.node-version }}
          cache: npm
      - run: npm ci
      - run: npm test

  deploy:
    runs-on: ubuntu-latest
    needs: [lint, test]
    if: github.ref == 'refs/heads/main'
    environment: production
    steps:
      - uses: actions/checkout@v4
      - run: echo "Deploying to production"`;

const SAMPLE_BAD_WORKFLOW = `name: Buggy Workflow

on: push

jobs:
  build:
    steps:
      - uses: actions/checkout@v4
      - run: npm test

  deploy:
    runs-on: ubuntu-latest
    needs: [build, missing-job]
    steps:
      - uses: actions/checkout@latest
      - name: Deploy
        uses: actions/deploy@v1
        run: echo "can't have both"`;

const SAMPLE_REUSABLE = `name: Release

on:
  workflow_dispatch:
    inputs:
      version:
        description: "Release version"
        required: true
        type: string
      dry-run:
        description: "Dry run mode"
        required: false
        type: boolean
        default: false
  schedule:
    - cron: "0 9 * * 1"

concurrency:
  group: release-\${{ github.ref }}
  cancel-in-progress: true

jobs:
  release:
    runs-on: ubuntu-latest
    timeout-minutes: 30
    permissions:
      contents: write
      packages: write
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - name: Setup
        uses: actions/setup-node@v4
        with:
          node-version: 20
          registry-url: https://registry.npmjs.org
      - run: npm ci
      - run: npm run build
      - name: Publish
        if: \${{ !inputs.dry-run }}
        run: npm publish
        env:
          NODE_AUTH_TOKEN: \${{ secrets.NPM_TOKEN }}`;

interface Issue {
  type: "error" | "warning" | "info";
  path: string;
  message: string;
}

// ---- Minimal YAML parser (handles the subset used in GitHub Actions) ----
type YamlValue =
  | string
  | number
  | boolean
  | null
  | YamlValue[]
  | { [key: string]: YamlValue };

function parseYaml(input: string): { value: YamlValue | null; error: string | null } {
  try {
    const trimmed = input.trim();
    if (!trimmed) return { value: null, error: "Empty input" };
    const lines = trimmed.split("\n");
    const result = parseBlock(lines, 0, 0);
    return { value: result.value, error: null };
  } catch (e) {
    return { value: null, error: e instanceof Error ? e.message : "YAML parse error" };
  }
}

interface ParseResult {
  value: YamlValue;
  nextLine: number;
}

function getIndent(line: string): number {
  const match = line.match(/^( *)/);
  return match ? match[1].length : 0;
}

function stripComment(line: string): string {
  let inSingle = false;
  let inDouble = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === "'" && !inDouble) inSingle = !inSingle;
    else if (ch === '"' && !inSingle) inDouble = !inDouble;
    else if (ch === "#" && !inSingle && !inDouble && (i === 0 || line[i - 1] === " ")) {
      return line.slice(0, i).trimEnd();
    }
  }
  return line;
}

function parseScalar(raw: string): YamlValue {
  const s = raw.trim();
  if (s === "" || s === "~" || s === "null") return null;
  if (s === "true" || s === "True" || s === "TRUE") return true;
  if (s === "false" || s === "False" || s === "FALSE") return false;
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    return s.slice(1, -1);
  }
  if (/^-?\d+$/.test(s)) return parseInt(s, 10);
  if (/^-?\d+\.\d+$/.test(s)) return parseFloat(s);
  return s;
}

function parseFlowValue(s: string): YamlValue {
  const trimmed = s.trim();
  if (trimmed.startsWith("[")) return parseFlowSequence(trimmed);
  if (trimmed.startsWith("{")) return parseFlowMapping(trimmed);
  return parseScalar(trimmed);
}

function parseFlowSequence(s: string): YamlValue[] {
  const inner = s.slice(1, -1).trim();
  if (!inner) return [];
  return splitFlow(inner).map((item) => parseFlowValue(item));
}

function parseFlowMapping(s: string): { [key: string]: YamlValue } {
  const inner = s.slice(1, -1).trim();
  if (!inner) return {};
  const result: { [key: string]: YamlValue } = {};
  for (const pair of splitFlow(inner)) {
    const colonIdx = pair.indexOf(":");
    if (colonIdx === -1) continue;
    const key = pair.slice(0, colonIdx).trim();
    const val = pair.slice(colonIdx + 1).trim();
    result[key] = parseFlowValue(val);
  }
  return result;
}

function splitFlow(s: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let current = "";
  for (const ch of s) {
    if (ch === "[" || ch === "{") depth++;
    else if (ch === "]" || ch === "}") depth--;
    if (ch === "," && depth === 0) {
      parts.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  if (current.trim()) parts.push(current.trim());
  return parts;
}

function parseBlock(lines: string[], startLine: number, _minIndent: number): ParseResult {
  let i = startLine;
  while (i < lines.length) {
    const stripped = lines[i].trim();
    if (stripped === "" || stripped.startsWith("#")) { i++; continue; }
    break;
  }
  if (i >= lines.length) return { value: null, nextLine: i };

  const line = lines[i];
  const stripped = stripComment(line).trim();
  const indent = getIndent(line);

  if (stripped.startsWith("- ") || stripped === "-") {
    return parseSequence(lines, i, indent);
  }
  if (stripped.includes(":")) {
    return parseMapping(lines, i, indent);
  }
  return { value: parseScalar(stripped), nextLine: i + 1 };
}

function parseSequence(lines: string[], startLine: number, baseIndent: number): ParseResult {
  const items: YamlValue[] = [];
  let i = startLine;

  while (i < lines.length) {
    const stripped = lines[i].trim();
    if (stripped === "" || stripped.startsWith("#")) { i++; continue; }
    const indent = getIndent(lines[i]);
    if (indent < baseIndent) break;
    if (indent > baseIndent) break;
    if (!stripped.startsWith("-")) break;

    const afterDash = stripped.slice(1).trim();
    if (!afterDash) {
      const child = parseBlock(lines, i + 1, indent + 2);
      items.push(child.value);
      i = child.nextLine;
    } else if (afterDash.startsWith("[") || afterDash.startsWith("{")) {
      items.push(parseFlowValue(afterDash));
      i++;
    } else if (afterDash.includes(":")) {
      const virtualLines: string[] = [];
      const itemIndent = indent + 2;
      virtualLines.push(" ".repeat(itemIndent) + afterDash);
      let j = i + 1;
      while (j < lines.length) {
        const nextStripped = lines[j].trim();
        if (nextStripped === "" || nextStripped.startsWith("#")) { j++; continue; }
        const nextIndent = getIndent(lines[j]);
        if (nextIndent <= indent) break;
        virtualLines.push(lines[j]);
        j++;
      }
      const child = parseMapping(virtualLines, 0, itemIndent);
      items.push(child.value);
      i = j;
    } else {
      items.push(parseScalar(afterDash));
      i++;
    }
  }
  return { value: items, nextLine: i };
}

function parseMapping(lines: string[], startLine: number, baseIndent: number): ParseResult {
  const map: { [key: string]: YamlValue } = {};
  let i = startLine;

  while (i < lines.length) {
    const stripped = lines[i].trim();
    if (stripped === "" || stripped.startsWith("#")) { i++; continue; }
    const indent = getIndent(lines[i]);
    if (indent < baseIndent) break;
    if (indent > baseIndent) break;

    const clean = stripComment(lines[i]).trim();
    const colonMatch = clean.match(/^([^:]+?):\s*(.*)/);
    if (!colonMatch) { i++; continue; }

    const key = colonMatch[1].trim();
    const valueStr = colonMatch[2].trim();

    if (valueStr === "" || valueStr === "|" || valueStr === "|-" || valueStr === ">" || valueStr === ">-") {
      if (valueStr === "|" || valueStr === "|-" || valueStr === ">" || valueStr === ">-") {
        let block = "";
        let j = i + 1;
        let blockIndent = -1;
        while (j < lines.length) {
          const raw = lines[j];
          const rawStripped = raw.trim();
          if (rawStripped === "") { block += "\n"; j++; continue; }
          const bi = getIndent(raw);
          if (blockIndent === -1) blockIndent = bi;
          if (bi < blockIndent) break;
          block += (block ? "\n" : "") + raw.slice(blockIndent);
          j++;
        }
        map[key] = block;
        i = j;
      } else {
        const child = parseBlock(lines, i + 1, indent + 1);
        map[key] = child.value;
        i = child.nextLine;
      }
    } else if (valueStr.startsWith("[") || valueStr.startsWith("{")) {
      map[key] = parseFlowValue(valueStr);
      i++;
    } else {
      map[key] = parseScalar(valueStr);
      i++;
    }
  }
  return { value: map, nextLine: i };
}

// ---- GitHub Actions Validation Logic ----

const VALID_TRIGGERS = new Set([
  "branch_protection_rule", "check_run", "check_suite", "create", "delete",
  "deployment", "deployment_status", "discussion", "discussion_comment",
  "fork", "gollum", "issue_comment", "issues", "label", "merge_group",
  "milestone", "page_build", "project", "project_card", "project_column",
  "public", "pull_request", "pull_request_review", "pull_request_review_comment",
  "pull_request_target", "push", "registry_package", "release",
  "repository_dispatch", "schedule", "status", "watch", "workflow_call",
  "workflow_dispatch", "workflow_run",
]);

const VALID_PERMISSIONS = new Set([
  "actions", "attestations", "checks", "contents", "deployments",
  "discussions", "id-token", "issues", "packages", "pages",
  "pull-requests", "repository-projects", "security-events", "statuses",
]);

const VALID_PERMISSION_VALUES = new Set(["read", "write", "none"]);

const DEPRECATED_ACTIONS: Record<string, string> = {
  "actions/checkout@v1": "actions/checkout@v4",
  "actions/checkout@v2": "actions/checkout@v4",
  "actions/checkout@v3": "actions/checkout@v4",
  "actions/setup-node@v1": "actions/setup-node@v4",
  "actions/setup-node@v2": "actions/setup-node@v4",
  "actions/setup-node@v3": "actions/setup-node@v4",
  "actions/setup-python@v1": "actions/setup-python@v5",
  "actions/setup-python@v2": "actions/setup-python@v5",
  "actions/setup-python@v3": "actions/setup-python@v5",
  "actions/setup-python@v4": "actions/setup-python@v5",
  "actions/setup-java@v1": "actions/setup-java@v4",
  "actions/setup-java@v2": "actions/setup-java@v4",
  "actions/setup-java@v3": "actions/setup-java@v4",
  "actions/setup-go@v1": "actions/setup-go@v5",
  "actions/setup-go@v2": "actions/setup-go@v5",
  "actions/setup-go@v3": "actions/setup-go@v5",
  "actions/setup-go@v4": "actions/setup-go@v5",
  "actions/upload-artifact@v1": "actions/upload-artifact@v4",
  "actions/upload-artifact@v2": "actions/upload-artifact@v4",
  "actions/upload-artifact@v3": "actions/upload-artifact@v4",
  "actions/download-artifact@v1": "actions/download-artifact@v4",
  "actions/download-artifact@v2": "actions/download-artifact@v4",
  "actions/download-artifact@v3": "actions/download-artifact@v4",
  "actions/cache@v1": "actions/cache@v4",
  "actions/cache@v2": "actions/cache@v4",
  "actions/cache@v3": "actions/cache@v4",
};

function validateWorkflow(doc: YamlValue): Issue[] {
  const issues: Issue[] = [];

  if (!doc || typeof doc !== "object" || Array.isArray(doc)) {
    issues.push({ type: "error", path: "/", message: "Workflow root must be a YAML mapping" });
    return issues;
  }

  const obj = doc as Record<string, YamlValue>;

  // --- name (optional but recommended) ---
  if (!obj.name) {
    issues.push({ type: "info", path: "name", message: "Workflow has no 'name' — consider adding one for clarity in the GitHub Actions UI" });
  }

  // --- on (required) ---
  if (!obj.on) {
    issues.push({ type: "error", path: "on", message: "Missing required field 'on' — workflows must define at least one trigger event" });
  } else {
    validateTriggers(obj.on, issues);
  }

  // --- permissions (optional) ---
  if (obj.permissions !== undefined && obj.permissions !== null) {
    validatePermissions(obj.permissions, "permissions", issues);
  }

  // --- env (optional) ---
  if (obj.env !== undefined && obj.env !== null) {
    if (typeof obj.env !== "object" || Array.isArray(obj.env)) {
      issues.push({ type: "error", path: "env", message: "Top-level 'env' must be a mapping of key-value pairs" });
    }
  }

  // --- concurrency (optional) ---
  if (obj.concurrency !== undefined) {
    if (typeof obj.concurrency === "object" && !Array.isArray(obj.concurrency)) {
      const conc = obj.concurrency as Record<string, YamlValue>;
      if (!conc.group) {
        issues.push({ type: "error", path: "concurrency", message: "Concurrency must define a 'group' field" });
      }
    } else if (typeof obj.concurrency !== "string") {
      issues.push({ type: "error", path: "concurrency", message: "'concurrency' must be a string or an object with 'group'" });
    }
  }

  // --- jobs (required) ---
  if (!obj.jobs) {
    issues.push({ type: "error", path: "jobs", message: "Missing required field 'jobs' — workflows must define at least one job" });
  } else if (typeof obj.jobs !== "object" || Array.isArray(obj.jobs)) {
    issues.push({ type: "error", path: "jobs", message: "'jobs' must be a mapping of job IDs to job configurations" });
  } else {
    const jobs = obj.jobs as Record<string, YamlValue>;
    const jobIds = new Set(Object.keys(jobs));

    if (jobIds.size === 0) {
      issues.push({ type: "error", path: "jobs", message: "No jobs defined — workflows must have at least one job" });
    }

    for (const [jobId, jobDef] of Object.entries(jobs)) {
      // Job ID validation
      if (!/^[a-zA-Z_][a-zA-Z0-9_-]*$/.test(jobId)) {
        issues.push({ type: "error", path: `jobs.${jobId}`, message: `Invalid job ID "${jobId}" — must start with a letter or underscore, and contain only alphanumeric characters, hyphens, or underscores` });
      }

      if (!jobDef || typeof jobDef !== "object" || Array.isArray(jobDef)) {
        issues.push({ type: "error", path: `jobs.${jobId}`, message: "Job definition must be a mapping" });
        continue;
      }

      validateJob(jobId, jobDef as Record<string, YamlValue>, jobIds, issues);
    }
  }

  return issues;
}

function validateTriggers(on: YamlValue, issues: Issue[]) {
  if (typeof on === "string") {
    if (!VALID_TRIGGERS.has(on)) {
      issues.push({ type: "error", path: "on", message: `Unknown trigger event "${on}"` });
    }
    return;
  }

  if (Array.isArray(on)) {
    for (const trigger of on) {
      if (typeof trigger === "string" && !VALID_TRIGGERS.has(trigger)) {
        issues.push({ type: "error", path: "on", message: `Unknown trigger event "${trigger}"` });
      }
    }
    return;
  }

  if (typeof on === "object" && on !== null) {
    const triggers = on as Record<string, YamlValue>;
    for (const [triggerName, triggerConfig] of Object.entries(triggers)) {
      if (!VALID_TRIGGERS.has(triggerName)) {
        issues.push({ type: "error", path: `on.${triggerName}`, message: `Unknown trigger event "${triggerName}"` });
      }

      // Schedule validation
      if (triggerName === "schedule" && Array.isArray(triggerConfig)) {
        for (let i = 0; i < triggerConfig.length; i++) {
          const entry = triggerConfig[i] as Record<string, YamlValue>;
          if (entry && typeof entry === "object" && entry.cron) {
            const cron = String(entry.cron);
            const parts = cron.trim().split(/\s+/);
            if (parts.length !== 5) {
              issues.push({ type: "error", path: `on.schedule[${i}].cron`, message: `Invalid cron expression "${cron}" — expected 5 fields (minute hour day month weekday)` });
            }
          } else if (entry && typeof entry === "object" && !entry.cron) {
            issues.push({ type: "error", path: `on.schedule[${i}]`, message: "Schedule entry must have a 'cron' field" });
          }
        }
      }

      // workflow_dispatch inputs
      if (triggerName === "workflow_dispatch" && triggerConfig && typeof triggerConfig === "object" && !Array.isArray(triggerConfig)) {
        const wdConfig = triggerConfig as Record<string, YamlValue>;
        if (wdConfig.inputs && typeof wdConfig.inputs === "object" && !Array.isArray(wdConfig.inputs)) {
          const inputs = wdConfig.inputs as Record<string, YamlValue>;
          for (const [inputName, inputDef] of Object.entries(inputs)) {
            if (inputDef && typeof inputDef === "object" && !Array.isArray(inputDef)) {
              const def = inputDef as Record<string, YamlValue>;
              if (!def.description) {
                issues.push({ type: "warning", path: `on.workflow_dispatch.inputs.${inputName}`, message: "Input is missing 'description' — recommended for UI clarity" });
              }
              if (def.type && typeof def.type === "string") {
                const validTypes = ["boolean", "choice", "environment", "number", "string"];
                if (!validTypes.includes(def.type)) {
                  issues.push({ type: "error", path: `on.workflow_dispatch.inputs.${inputName}.type`, message: `Invalid input type "${def.type}" — must be one of: ${validTypes.join(", ")}` });
                }
              }
            }
          }
        }
      }
    }
  }
}

function validatePermissions(perms: YamlValue, path: string, issues: Issue[]) {
  if (typeof perms === "string") {
    if (perms !== "read-all" && perms !== "write-all") {
      issues.push({ type: "error", path, message: `Invalid permissions shorthand "${perms}" — must be "read-all" or "write-all"` });
    }
    return;
  }

  if (typeof perms === "object" && !Array.isArray(perms)) {
    const permMap = perms as Record<string, YamlValue>;
    for (const [scope, value] of Object.entries(permMap)) {
      if (!VALID_PERMISSIONS.has(scope)) {
        issues.push({ type: "warning", path: `${path}.${scope}`, message: `Unknown permission scope "${scope}"` });
      }
      if (typeof value === "string" && !VALID_PERMISSION_VALUES.has(value)) {
        issues.push({ type: "error", path: `${path}.${scope}`, message: `Invalid permission value "${value}" — must be "read", "write", or "none"` });
      }
    }
  }
}

function validateJob(jobId: string, job: Record<string, YamlValue>, allJobIds: Set<string>, issues: Issue[]) {
  const path = `jobs.${jobId}`;

  // --- runs-on (required unless uses reusable workflow) ---
  const usesReusable = typeof job.uses === "string";
  if (!job["runs-on"] && !usesReusable) {
    issues.push({ type: "error", path: `${path}.runs-on`, message: "Missing required field 'runs-on' — every job needs a runner (e.g., ubuntu-latest)" });
  } else if (job["runs-on"] && typeof job["runs-on"] === "string") {
    const runner = job["runs-on"] as string;
    const knownRunners = ["ubuntu-latest", "ubuntu-24.04", "ubuntu-22.04", "ubuntu-20.04", "windows-latest", "windows-2022", "windows-2019", "macos-latest", "macos-15", "macos-14", "macos-13"];
    // Only warn for non-expression, non-self-hosted runners
    if (!runner.startsWith("${{") && runner !== "self-hosted" && !knownRunners.includes(runner) && !runner.startsWith("self-hosted")) {
      issues.push({ type: "info", path: `${path}.runs-on`, message: `Runner "${runner}" is not a standard GitHub-hosted runner — may be self-hosted or custom` });
    }
  }

  // --- needs (job dependencies) ---
  if (job.needs !== undefined) {
    const needs = Array.isArray(job.needs) ? job.needs : [job.needs];
    for (const dep of needs) {
      const depStr = String(dep);
      if (!allJobIds.has(depStr)) {
        issues.push({ type: "error", path: `${path}.needs`, message: `Job depends on "${depStr}" which is not defined in this workflow` });
      }
      if (depStr === jobId) {
        issues.push({ type: "error", path: `${path}.needs`, message: `Job cannot depend on itself` });
      }
    }
  }

  // --- timeout-minutes ---
  if (job["timeout-minutes"] !== undefined) {
    const timeout = job["timeout-minutes"];
    if (typeof timeout === "number" && (timeout < 1 || timeout > 360)) {
      issues.push({ type: "warning", path: `${path}.timeout-minutes`, message: `Timeout ${timeout} minutes is outside the typical range (1-360)` });
    }
  } else if (!usesReusable) {
    issues.push({ type: "info", path: path, message: "No timeout-minutes set — default is 360 minutes (6 hours). Consider setting a shorter timeout." });
  }

  // --- permissions ---
  if (job.permissions !== undefined) {
    validatePermissions(job.permissions, `${path}.permissions`, issues);
  }

  // --- strategy.matrix ---
  if (job.strategy) {
    const strategy = job.strategy as Record<string, YamlValue>;
    if (strategy.matrix && typeof strategy.matrix === "object" && !Array.isArray(strategy.matrix)) {
      const matrix = strategy.matrix as Record<string, YamlValue>;
      let hasValues = false;
      for (const [key, val] of Object.entries(matrix)) {
        if (key === "include" || key === "exclude") continue;
        if (Array.isArray(val) && val.length === 0) {
          issues.push({ type: "warning", path: `${path}.strategy.matrix.${key}`, message: `Matrix variable "${key}" has an empty array — this job will not run` });
        }
        if (Array.isArray(val) && val.length > 0) hasValues = true;
      }
      if (!hasValues && !matrix.include) {
        issues.push({ type: "warning", path: `${path}.strategy.matrix`, message: "Matrix has no variable arrays and no 'include' entries — this job may not produce any matrix combinations" });
      }
    }
  }

  // --- steps (required unless reusable workflow) ---
  if (usesReusable) {
    // Reusable workflow call — steps not allowed
    if (job.steps) {
      issues.push({ type: "error", path: `${path}.steps`, message: "Jobs using reusable workflows (uses) cannot also define 'steps'" });
    }
    return;
  }

  if (!job.steps) {
    issues.push({ type: "error", path: `${path}.steps`, message: "Missing required field 'steps' — every job needs at least one step" });
    return;
  }

  if (!Array.isArray(job.steps) || job.steps.length === 0) {
    issues.push({ type: "error", path: `${path}.steps`, message: "Job must have at least one step" });
    return;
  }

  const stepIds = new Set<string>();
  for (let si = 0; si < job.steps.length; si++) {
    const step = job.steps[si] as Record<string, YamlValue>;
    if (!step || typeof step !== "object") continue;
    validateStep(step, `${path}.steps[${si}]`, stepIds, issues);
  }
}

function validateStep(step: Record<string, YamlValue>, path: string, stepIds: Set<string>, issues: Issue[]) {
  const hasUses = step.uses !== undefined;
  const hasRun = step.run !== undefined;

  // --- id ---
  if (step.id !== undefined) {
    const id = String(step.id);
    if (stepIds.has(id)) {
      issues.push({ type: "error", path: `${path}.id`, message: `Duplicate step ID "${id}" — step IDs must be unique within a job` });
    }
    stepIds.add(id);
    if (!/^[a-zA-Z_][a-zA-Z0-9_-]*$/.test(id)) {
      issues.push({ type: "error", path: `${path}.id`, message: `Invalid step ID "${id}" — must start with a letter or underscore` });
    }
  }

  // --- uses or run (one is required) ---
  if (!hasUses && !hasRun) {
    issues.push({ type: "error", path, message: "Step must have either 'uses' (for an action) or 'run' (for a shell command)" });
  }

  if (hasUses && hasRun) {
    issues.push({ type: "error", path, message: "Step cannot have both 'uses' and 'run' — use one or the other" });
  }

  // --- uses validation ---
  if (hasUses && typeof step.uses === "string") {
    const uses = step.uses;

    // Check for :latest tag
    if (uses.endsWith("@latest")) {
      issues.push({ type: "warning", path: `${path}.uses`, message: `Action "${uses}" uses @latest — pin to a specific version for reproducible builds` });
    }

    // Check for deprecated actions
    if (DEPRECATED_ACTIONS[uses]) {
      issues.push({ type: "warning", path: `${path}.uses`, message: `Action "${uses}" is outdated — upgrade to ${DEPRECATED_ACTIONS[uses]}` });
    }

    // Check uses format: owner/repo@ref, ./local-path, or docker://
    if (!uses.startsWith("./") && !uses.startsWith("docker://")) {
      if (!uses.includes("@")) {
        issues.push({ type: "error", path: `${path}.uses`, message: `Action "${uses}" is missing a version reference (@v4, @main, @sha) — always pin action versions` });
      } else if (!uses.includes("/")) {
        issues.push({ type: "error", path: `${path}.uses`, message: `Action "${uses}" is missing the owner/repo prefix (e.g., actions/checkout@v4)` });
      }
    }

    // 'with' makes sense only with 'uses'
  }

  // 'with' without 'uses'
  if (step.with && !hasUses) {
    issues.push({ type: "warning", path: `${path}.with`, message: "'with' inputs are only used with 'uses' actions, not with 'run' commands — use 'env' instead" });
  }

  // --- env ---
  if (step.env !== undefined && step.env !== null) {
    if (typeof step.env !== "object" || Array.isArray(step.env)) {
      issues.push({ type: "error", path: `${path}.env`, message: "Step 'env' must be a mapping of key-value pairs" });
    }
  }

  // --- if condition ---
  if (step.if !== undefined && typeof step.if === "string") {
    const cond = step.if;
    // Check for common expression issues
    if (cond.includes("${{") && !cond.includes("}}")) {
      issues.push({ type: "error", path: `${path}.if`, message: "Unclosed expression — '${{' without matching '}}'" });
    }
  }

  // --- shell ---
  if (step.shell !== undefined && typeof step.shell === "string") {
    const validShells = ["bash", "pwsh", "python", "sh", "cmd", "powershell"];
    if (!validShells.includes(step.shell) && !step.shell.includes("{0}")) {
      issues.push({ type: "warning", path: `${path}.shell`, message: `Shell "${step.shell}" is not a standard GitHub Actions shell — expected one of: ${validShells.join(", ")}` });
    }
  }

  // --- continue-on-error ---
  if (step["continue-on-error"] === true) {
    issues.push({ type: "info", path: `${path}.continue-on-error`, message: "Step will continue even if it fails — make sure downstream steps handle this" });
  }
}

// ---- Component ----

export default function GitHubActionsValidatorTool() {
  const [input, setInput] = useState("");
  const [issues, setIssues] = useState<Issue[]>([]);
  const [hasValidated, setHasValidated] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [filter, setFilter] = useState<"all" | "error" | "warning" | "info">("all");
  const { remaining, dailyLimit, isLimited, recordUsage } =
    useRateLimit("github-actions-validator");
  const { trackAction } = useToolAnalytics("github-actions-validator");

  const handleValidate = useCallback(() => {
    if (isLimited) return;
    recordUsage();
    trackAction("validate");
    setCopied(false);
    setParseError(null);
    setFilter("all");

    if (!input.trim()) {
      setIssues([]);
      setHasValidated(false);
      return;
    }

    const { value, error } = parseYaml(input);
    if (error) {
      setParseError(error);
      setIssues([]);
      setHasValidated(true);
      return;
    }

    if (!value) {
      setParseError("No valid YAML content found");
      setIssues([]);
      setHasValidated(true);
      return;
    }

    const result = validateWorkflow(value);
    setIssues(result);
    setHasValidated(true);
  }, [input, isLimited, recordUsage, trackAction]);

  useKeyboardShortcut("Enter", handleValidate);

  function handleLoadSample(sample: string) {
    setInput(sample);
    setIssues([]);
    setHasValidated(false);
    setParseError(null);
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

  const filteredIssues = filter === "all" ? issues : issues.filter((i) => i.type === filter);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="mb-8 block text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        &larr; Back to tools
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        GitHub Actions YAML Validator
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Validate GitHub Actions workflow files for syntax errors, missing fields,
        deprecated actions, broken job dependencies, and common misconfigurations.
        Runs entirely in your browser.
      </p>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste your GitHub Actions workflow YAML here..."
        rows={18}
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
          onClick={() => handleLoadSample(SAMPLE_WORKFLOW)}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
        >
          CI workflow
        </button>
        <button
          onClick={() => handleLoadSample(SAMPLE_BAD_WORKFLOW)}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
        >
          Buggy workflow
        </button>
        <button
          onClick={() => handleLoadSample(SAMPLE_REUSABLE)}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
        >
          Release workflow
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

      {/* Parse error */}
      {parseError && (
        <div className="mt-4 rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700 dark:bg-red-950/50 dark:border-red-800 dark:text-red-400">
          <span className="font-medium">YAML Parse Error:</span> {parseError}
        </div>
      )}

      {/* Validation results */}
      {hasValidated && !parseError && (
        <div className="mt-4 space-y-2">
          {/* Summary bar */}
          <div className="flex flex-wrap items-center gap-3 text-sm font-medium">
            {errorCount === 0 && warningCount === 0 && issues.length === 0 && (
              <span className="text-green-600 dark:text-green-400">
                All checks passed
              </span>
            )}
            {errorCount > 0 && (
              <button
                onClick={() => setFilter(filter === "error" ? "all" : "error")}
                className={`text-red-600 dark:text-red-400 hover:underline ${filter === "error" ? "underline font-bold" : ""}`}
              >
                {errorCount} error{errorCount !== 1 ? "s" : ""}
              </button>
            )}
            {warningCount > 0 && (
              <button
                onClick={() => setFilter(filter === "warning" ? "all" : "warning")}
                className={`text-yellow-600 dark:text-yellow-400 hover:underline ${filter === "warning" ? "underline font-bold" : ""}`}
              >
                {warningCount} warning{warningCount !== 1 ? "s" : ""}
              </button>
            )}
            {infoCount > 0 && (
              <button
                onClick={() => setFilter(filter === "info" ? "all" : "info")}
                className={`text-blue-600 dark:text-blue-400 hover:underline ${filter === "info" ? "underline font-bold" : ""}`}
              >
                {infoCount} info
              </button>
            )}
            {filter !== "all" && (
              <button
                onClick={() => setFilter("all")}
                className="text-gray-500 dark:text-gray-400 text-xs hover:underline"
              >
                Show all
              </button>
            )}
          </div>

          {/* Issue list */}
          {filteredIssues.length > 0 && (
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700 overflow-hidden">
              {filteredIssues.map((issue, i) => (
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
                    <span className="font-mono opacity-70">{issue.path} </span>
                    {issue.message}
                  </span>
                </div>
              ))}
            </div>
          )}

          {issues.length === 0 && (
            <div className="rounded-lg bg-green-50 border border-green-200 p-4 text-sm text-green-700 dark:bg-green-950/50 dark:border-green-800 dark:text-green-400">
              No issues found — your GitHub Actions workflow looks good!
            </div>
          )}
        </div>
      )}

      {/* About section */}
      <details className="mt-8 rounded-lg border border-gray-200 dark:border-gray-700">
        <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          About GitHub Actions Workflow Validation
        </summary>
        <div className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400 space-y-3">
          <p>
            GitHub Actions workflows are YAML files in{" "}
            <code className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs">.github/workflows/</code>{" "}
            that define CI/CD automation — building, testing, deploying, and more.
          </p>
          <p>
            <strong>What we check:</strong>
          </p>
          <ul className="list-disc ml-5 space-y-1">
            <li>Required fields — on (triggers), jobs, runs-on, steps</li>
            <li>Trigger validation — event names, cron schedules, workflow_dispatch inputs</li>
            <li>Job structure — runs-on, needs dependencies, timeout, strategy/matrix</li>
            <li>Step validation — uses vs run, action version pinning, id uniqueness</li>
            <li>Deprecated actions — flags outdated action versions with upgrade suggestions</li>
            <li>Permissions — validates permission scopes and values</li>
            <li>Expression syntax — unclosed $&#123;&#123; &#125;&#125; expressions</li>
            <li>Reusable workflows — validates uses/steps exclusivity</li>
            <li>Best practices — timeouts, concurrency groups, naming</li>
          </ul>
          <p>
            Everything runs in your browser — no data is sent over the network.
          </p>
        </div>
      </details>
    </div>
  );
}
