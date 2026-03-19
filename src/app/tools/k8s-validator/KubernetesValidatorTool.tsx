"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";
import RateLimitBanner from "@/components/RateLimitBanner";

const SAMPLE_MANIFEST = `apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
  namespace: production
  labels:
    app: web-app
    version: "1.0"
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web-app
  template:
    metadata:
      labels:
        app: web-app
    spec:
      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
      containers:
        - name: web
          image: nginx:1.25-alpine
          ports:
            - containerPort: 8080
          resources:
            requests:
              cpu: 100m
              memory: 128Mi
            limits:
              cpu: 500m
              memory: 256Mi
          livenessProbe:
            httpGet:
              path: /healthz
              port: 8080
            initialDelaySeconds: 10
            periodSeconds: 15
          readinessProbe:
            httpGet:
              path: /ready
              port: 8080
            initialDelaySeconds: 5
            periodSeconds: 10
          securityContext:
            readOnlyRootFilesystem: true
            allowPrivilegeEscalation: false
---
apiVersion: v1
kind: Service
metadata:
  name: web-app
  namespace: production
spec:
  selector:
    app: web-app
  ports:
    - port: 80
      targetPort: 8080
      protocol: TCP
  type: ClusterIP`;

interface Issue {
  type: "error" | "warning" | "info";
  doc: number;
  path: string;
  message: string;
}

// Simple YAML parser — handles the subset of YAML used in Kubernetes manifests
// Supports: mappings, sequences, scalars, multi-document (---), comments, quoted strings, flow sequences/mappings
type YamlValue =
  | string
  | number
  | boolean
  | null
  | YamlValue[]
  | { [key: string]: YamlValue };

function parseYamlDocuments(input: string): { docs: YamlValue[]; error: string | null } {
  const rawDocs = input.split(/^---\s*$/m);
  const docs: YamlValue[] = [];

  for (const raw of rawDocs) {
    const trimmed = raw.trim();
    if (!trimmed || trimmed.split("\n").every((l) => l.trim() === "" || l.trim().startsWith("#"))) continue;
    try {
      const parsed = parseYamlDoc(trimmed);
      docs.push(parsed);
    } catch (e) {
      return { docs: [], error: e instanceof Error ? e.message : "YAML parse error" };
    }
  }

  return { docs, error: null };
}

function parseYamlDoc(input: string): YamlValue {
  const lines = input.split("\n");
  const result = parseBlock(lines, 0, 0);
  return result.value;
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
  // Strip inline comments, but not # inside quotes
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
  // Quoted strings
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    return s.slice(1, -1);
  }
  // Numbers
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
  // Remove outer brackets
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
  // Skip blank/comment lines
  let i = startLine;
  while (i < lines.length) {
    const stripped = lines[i].trim();
    if (stripped === "" || stripped.startsWith("#")) {
      i++;
      continue;
    }
    break;
  }
  if (i >= lines.length) return { value: null, nextLine: i };

  const line = lines[i];
  const stripped = stripComment(line).trim();
  const indent = getIndent(line);

  // Is this a sequence item?
  if (stripped.startsWith("- ") || stripped === "-") {
    return parseSequence(lines, i, indent);
  }

  // Is this a mapping?
  if (stripped.includes(":")) {
    return parseMapping(lines, i, indent);
  }

  // Scalar
  return { value: parseScalar(stripped), nextLine: i + 1 };
}

function parseSequence(lines: string[], startLine: number, baseIndent: number): ParseResult {
  const items: YamlValue[] = [];
  let i = startLine;

  while (i < lines.length) {
    const stripped = lines[i].trim();
    if (stripped === "" || stripped.startsWith("#")) {
      i++;
      continue;
    }

    const indent = getIndent(lines[i]);
    if (indent < baseIndent) break;
    if (indent > baseIndent) break; // belongs to a child

    if (!stripped.startsWith("-")) break;

    // Get the value after "- "
    const afterDash = stripped.slice(1).trim();

    if (!afterDash) {
      // Value is on next lines
      const child = parseBlock(lines, i + 1, indent + 2);
      items.push(child.value);
      i = child.nextLine;
    } else if (afterDash.startsWith("[") || afterDash.startsWith("{")) {
      items.push(parseFlowValue(afterDash));
      i++;
    } else if (afterDash.includes(":")) {
      // Inline mapping as sequence item — reconstruct with proper indent
      const virtualLines: string[] = [];
      const itemIndent = indent + 2;
      virtualLines.push(" ".repeat(itemIndent) + afterDash);
      let j = i + 1;
      while (j < lines.length) {
        const nextStripped = lines[j].trim();
        if (nextStripped === "" || nextStripped.startsWith("#")) {
          j++;
          continue;
        }
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
    if (stripped === "" || stripped.startsWith("#")) {
      i++;
      continue;
    }

    const indent = getIndent(lines[i]);
    if (indent < baseIndent) break;
    if (indent > baseIndent) break;

    const clean = stripComment(lines[i]).trim();
    const colonMatch = clean.match(/^([^:]+?):\s*(.*)/);
    if (!colonMatch) {
      i++;
      continue;
    }

    const key = colonMatch[1].trim();
    const valueStr = colonMatch[2].trim();

    if (valueStr === "" || valueStr === "|" || valueStr === "|-" || valueStr === ">" || valueStr === ">-") {
      // Block scalar or nested value
      if (valueStr === "|" || valueStr === "|-" || valueStr === ">" || valueStr === ">-") {
        // Multi-line string — collect indented lines
        let block = "";
        let j = i + 1;
        let blockIndent = -1;
        while (j < lines.length) {
          const raw = lines[j];
          const rawStripped = raw.trim();
          if (rawStripped === "") {
            block += "\n";
            j++;
            continue;
          }
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

// ---------- Kubernetes Validation Logic ----------

const KNOWN_TOP_LEVEL_KINDS = new Set([
  "Pod",
  "Deployment",
  "ReplicaSet",
  "StatefulSet",
  "DaemonSet",
  "Job",
  "CronJob",
  "Service",
  "Ingress",
  "ConfigMap",
  "Secret",
  "PersistentVolumeClaim",
  "PersistentVolume",
  "Namespace",
  "ServiceAccount",
  "Role",
  "ClusterRole",
  "RoleBinding",
  "ClusterRoleBinding",
  "NetworkPolicy",
  "HorizontalPodAutoscaler",
  "PodDisruptionBudget",
  "LimitRange",
  "ResourceQuota",
]);

const WORKLOAD_KINDS = new Set([
  "Deployment",
  "StatefulSet",
  "DaemonSet",
  "Job",
  "CronJob",
  "ReplicaSet",
]);

function get(obj: YamlValue, ...keys: string[]): YamlValue {
  let current: YamlValue = obj;
  for (const k of keys) {
    if (current && typeof current === "object" && !Array.isArray(current) && k in current) {
      current = current[k];
    } else {
      return undefined as unknown as YamlValue;
    }
  }
  return current;
}

function validateK8sManifest(doc: YamlValue, docIndex: number): Issue[] {
  const issues: Issue[] = [];
  const docNum = docIndex + 1;

  if (!doc || typeof doc !== "object" || Array.isArray(doc)) {
    issues.push({ type: "error", doc: docNum, path: "/", message: "Document root must be a YAML mapping" });
    return issues;
  }

  const obj = doc as Record<string, YamlValue>;

  // --- Required top-level fields ---
  if (!obj.apiVersion) {
    issues.push({ type: "error", doc: docNum, path: "apiVersion", message: "Missing required field 'apiVersion'" });
  } else if (typeof obj.apiVersion !== "string") {
    issues.push({ type: "error", doc: docNum, path: "apiVersion", message: "'apiVersion' must be a string" });
  }

  if (!obj.kind) {
    issues.push({ type: "error", doc: docNum, path: "kind", message: "Missing required field 'kind'" });
  } else if (typeof obj.kind !== "string") {
    issues.push({ type: "error", doc: docNum, path: "kind", message: "'kind' must be a string" });
  }

  const kind = typeof obj.kind === "string" ? obj.kind : "";

  if (kind && !KNOWN_TOP_LEVEL_KINDS.has(kind)) {
    issues.push({ type: "info", doc: docNum, path: "kind", message: `Unknown kind "${kind}" — may be a CRD or typo` });
  }

  // metadata
  if (!obj.metadata) {
    issues.push({ type: "error", doc: docNum, path: "metadata", message: "Missing required field 'metadata'" });
  } else if (typeof obj.metadata === "object" && !Array.isArray(obj.metadata)) {
    const meta = obj.metadata as Record<string, YamlValue>;
    if (!meta.name) {
      issues.push({ type: "error", doc: docNum, path: "metadata.name", message: "Missing required field 'metadata.name'" });
    } else if (typeof meta.name === "string" && !/^[a-z0-9]([a-z0-9.-]*[a-z0-9])?$/.test(meta.name)) {
      issues.push({ type: "error", doc: docNum, path: "metadata.name", message: `Invalid name "${meta.name}" — must be lowercase alphanumeric with hyphens/dots, start and end with alphanumeric` });
    }

    if (meta.labels && typeof meta.labels === "object" && !Array.isArray(meta.labels)) {
      validateLabels(meta.labels as Record<string, YamlValue>, "metadata.labels", docNum, issues);
    }
  }

  // --- Kind-specific validation ---
  if (WORKLOAD_KINDS.has(kind)) {
    validateWorkload(obj, kind, docNum, issues);
  }

  if (kind === "Service") {
    validateService(obj, docNum, issues);
  }

  if (kind === "Ingress") {
    validateIngress(obj, docNum, issues);
  }

  if (kind === "CronJob") {
    validateCronJob(obj, docNum, issues);
  }

  if (kind === "ConfigMap" || kind === "Secret") {
    validateConfigMapSecret(obj, kind, docNum, issues);
  }

  return issues;
}

function validateLabels(labels: Record<string, YamlValue>, path: string, doc: number, issues: Issue[]) {
  for (const [key, val] of Object.entries(labels)) {
    if (typeof val !== "string" && typeof val !== "number" && typeof val !== "boolean") {
      issues.push({ type: "error", doc, path: `${path}.${key}`, message: `Label value must be a string, got ${typeof val}` });
    }
    // Label key validation
    const keyPart = key.includes("/") ? key.split("/")[1] : key;
    if (keyPart && keyPart.length > 63) {
      issues.push({ type: "warning", doc, path: `${path}.${key}`, message: `Label key name part exceeds 63 characters` });
    }
  }
}

function validateWorkload(obj: Record<string, YamlValue>, kind: string, doc: number, issues: Issue[]) {
  const spec = obj.spec as Record<string, YamlValue> | undefined;
  if (!spec || typeof spec !== "object" || Array.isArray(spec)) {
    issues.push({ type: "error", doc, path: "spec", message: "Missing required field 'spec'" });
    return;
  }

  // replicas validation
  if (kind === "Deployment" || kind === "ReplicaSet" || kind === "StatefulSet") {
    if (spec.replicas !== undefined && spec.replicas !== null) {
      if (typeof spec.replicas !== "number" || spec.replicas < 0) {
        issues.push({ type: "error", doc, path: "spec.replicas", message: "'replicas' must be a non-negative integer" });
      }
      if (kind === "Deployment" && spec.replicas === 1) {
        issues.push({ type: "info", doc, path: "spec.replicas", message: "Single replica — no high availability. Consider replicas >= 2 for production" });
      }
    }
  }

  // selector required for Deployment, StatefulSet, DaemonSet, ReplicaSet
  if ((kind === "Deployment" || kind === "StatefulSet" || kind === "DaemonSet" || kind === "ReplicaSet") && !spec.selector) {
    issues.push({ type: "error", doc, path: "spec.selector", message: "Missing required field 'spec.selector'" });
  }

  // selector.matchLabels must match template.metadata.labels
  if (spec.selector && spec.template) {
    const selectorLabels = get(spec, "selector", "matchLabels") as Record<string, YamlValue> | undefined;
    const templateLabels = get(spec, "template", "metadata", "labels") as Record<string, YamlValue> | undefined;
    if (selectorLabels && templateLabels) {
      for (const [key, val] of Object.entries(selectorLabels)) {
        const tv = templateLabels[key];
        if (tv === undefined) {
          issues.push({ type: "error", doc, path: "spec.selector.matchLabels", message: `Selector label "${key}" not found in template labels — pods won't be selected` });
        } else if (String(tv) !== String(val)) {
          issues.push({ type: "error", doc, path: "spec.selector.matchLabels", message: `Selector "${key}=${val}" doesn't match template label "${key}=${tv}"` });
        }
      }
    } else if (selectorLabels && !templateLabels) {
      issues.push({ type: "error", doc, path: "spec.template.metadata.labels", message: "Template is missing labels — selector won't match any pods" });
    }
  }

  // template
  const template = spec.template as Record<string, YamlValue> | undefined;
  if (!template || typeof template !== "object") {
    issues.push({ type: "error", doc, path: "spec.template", message: "Missing required field 'spec.template'" });
    return;
  }

  const podSpec = template.spec as Record<string, YamlValue> | undefined;
  if (!podSpec) {
    issues.push({ type: "error", doc, path: "spec.template.spec", message: "Missing required field 'spec.template.spec'" });
    return;
  }

  validatePodSpec(podSpec, "spec.template.spec", doc, issues);
}

function validatePodSpec(podSpec: Record<string, YamlValue>, basePath: string, doc: number, issues: Issue[]) {
  const containers = podSpec.containers;
  if (!containers || !Array.isArray(containers) || containers.length === 0) {
    issues.push({ type: "error", doc, path: `${basePath}.containers`, message: "At least one container is required" });
    return;
  }

  for (let ci = 0; ci < containers.length; ci++) {
    const c = containers[ci] as Record<string, YamlValue>;
    if (!c || typeof c !== "object") continue;
    const cPath = `${basePath}.containers[${ci}]`;

    // name required
    if (!c.name) {
      issues.push({ type: "error", doc, path: cPath, message: "Container is missing required field 'name'" });
    }

    // image required
    if (!c.image) {
      issues.push({ type: "error", doc, path: `${cPath}.image`, message: "Container is missing required field 'image'" });
    } else if (typeof c.image === "string") {
      const img = c.image;
      if (img.endsWith(":latest")) {
        issues.push({ type: "warning", doc, path: `${cPath}.image`, message: `Image "${img}" uses :latest tag — pin to a specific version for reproducible deployments` });
      } else if (!img.includes(":") && !img.includes("@")) {
        issues.push({ type: "warning", doc, path: `${cPath}.image`, message: `Image "${img}" has no tag (defaults to :latest) — pin to a specific version` });
      }
    }

    // resources
    if (!c.resources) {
      issues.push({ type: "warning", doc, path: `${cPath}.resources`, message: "No resource requests/limits — may cause scheduling issues or resource contention" });
    } else {
      const res = c.resources as Record<string, YamlValue>;
      if (!res.requests) {
        issues.push({ type: "warning", doc, path: `${cPath}.resources.requests`, message: "No resource requests — scheduler can't make informed placement decisions" });
      }
      if (!res.limits) {
        issues.push({ type: "warning", doc, path: `${cPath}.resources.limits`, message: "No resource limits — container can consume unlimited node resources" });
      }
    }

    // probes
    if (!c.livenessProbe && !c.readinessProbe && !c.startupProbe) {
      issues.push({ type: "warning", doc, path: cPath, message: "No health probes configured — Kubernetes can't detect if this container is healthy" });
    } else {
      if (!c.readinessProbe) {
        issues.push({ type: "info", doc, path: cPath, message: "No readinessProbe — traffic may be sent before the container is ready" });
      }
    }

    // security context
    const secCtx = c.securityContext as Record<string, YamlValue> | undefined;
    if (!secCtx) {
      issues.push({ type: "info", doc, path: `${cPath}.securityContext`, message: "No container securityContext — consider setting readOnlyRootFilesystem and allowPrivilegeEscalation" });
    } else {
      if (secCtx.privileged === true) {
        issues.push({ type: "warning", doc, path: `${cPath}.securityContext.privileged`, message: "Container runs in privileged mode — this is a significant security risk" });
      }
      if (secCtx.allowPrivilegeEscalation === true) {
        issues.push({ type: "warning", doc, path: `${cPath}.securityContext.allowPrivilegeEscalation`, message: "Privilege escalation is allowed — set to false unless required" });
      }
    }

    // ports validation
    if (c.ports && Array.isArray(c.ports)) {
      for (let pi = 0; pi < c.ports.length; pi++) {
        const port = c.ports[pi] as Record<string, YamlValue>;
        if (port && typeof port === "object") {
          const cp = port.containerPort;
          if (cp === undefined || cp === null) {
            issues.push({ type: "error", doc, path: `${cPath}.ports[${pi}]`, message: "Port is missing required field 'containerPort'" });
          } else if (typeof cp === "number" && (cp < 1 || cp > 65535)) {
            issues.push({ type: "error", doc, path: `${cPath}.ports[${pi}].containerPort`, message: `Port ${cp} is out of range (1-65535)` });
          }
        }
      }
    }
  }

  // Pod-level security context
  const podSec = podSpec.securityContext as Record<string, YamlValue> | undefined;
  if (!podSec) {
    issues.push({ type: "info", doc, path: `${basePath}.securityContext`, message: "No pod securityContext — consider setting runAsNonRoot: true" });
  } else {
    if (podSec.runAsUser === 0) {
      issues.push({ type: "warning", doc, path: `${basePath}.securityContext.runAsUser`, message: "Pod is configured to run as root (UID 0) — use a non-root user" });
    }
  }

  // init containers
  if (podSpec.initContainers && Array.isArray(podSpec.initContainers)) {
    for (let ci = 0; ci < podSpec.initContainers.length; ci++) {
      const c = podSpec.initContainers[ci] as Record<string, YamlValue>;
      if (!c || typeof c !== "object") continue;
      const cPath = `${basePath}.initContainers[${ci}]`;
      if (!c.name) {
        issues.push({ type: "error", doc, path: cPath, message: "Init container is missing required field 'name'" });
      }
      if (!c.image) {
        issues.push({ type: "error", doc, path: `${cPath}.image`, message: "Init container is missing required field 'image'" });
      }
    }
  }
}

function validateService(obj: Record<string, YamlValue>, doc: number, issues: Issue[]) {
  const spec = obj.spec as Record<string, YamlValue> | undefined;
  if (!spec) {
    issues.push({ type: "error", doc, path: "spec", message: "Missing required field 'spec'" });
    return;
  }

  if (!spec.selector) {
    issues.push({ type: "warning", doc, path: "spec.selector", message: "Service has no selector — it won't route to any pods unless you configure endpoints manually" });
  }

  const ports = spec.ports;
  if (!ports || !Array.isArray(ports) || ports.length === 0) {
    issues.push({ type: "error", doc, path: "spec.ports", message: "Service requires at least one port" });
  } else {
    for (let i = 0; i < ports.length; i++) {
      const p = ports[i] as Record<string, YamlValue>;
      if (!p || typeof p !== "object") continue;
      if (p.port === undefined || p.port === null) {
        issues.push({ type: "error", doc, path: `spec.ports[${i}]`, message: "Port is missing required field 'port'" });
      }
    }
  }

  const svcType = spec.type;
  if (typeof svcType === "string") {
    const validTypes = ["ClusterIP", "NodePort", "LoadBalancer", "ExternalName"];
    if (!validTypes.includes(svcType)) {
      issues.push({ type: "error", doc, path: "spec.type", message: `Invalid service type "${svcType}" — must be one of: ${validTypes.join(", ")}` });
    }
    if (svcType === "NodePort") {
      for (let i = 0; i < (ports as YamlValue[]).length; i++) {
        const p = (ports as YamlValue[])[i] as Record<string, YamlValue>;
        if (p && typeof p.nodePort === "number" && (p.nodePort < 30000 || p.nodePort > 32767)) {
          issues.push({ type: "error", doc, path: `spec.ports[${i}].nodePort`, message: `NodePort ${p.nodePort} out of range (30000-32767)` });
        }
      }
    }
  }
}

function validateIngress(obj: Record<string, YamlValue>, doc: number, issues: Issue[]) {
  const spec = obj.spec as Record<string, YamlValue> | undefined;
  if (!spec) {
    issues.push({ type: "error", doc, path: "spec", message: "Missing required field 'spec'" });
    return;
  }

  if (!spec.rules && !spec.defaultBackend) {
    issues.push({ type: "error", doc, path: "spec", message: "Ingress needs at least 'rules' or 'defaultBackend'" });
  }

  if (spec.tls && Array.isArray(spec.tls)) {
    for (let i = 0; i < spec.tls.length; i++) {
      const tls = spec.tls[i] as Record<string, YamlValue>;
      if (tls && typeof tls === "object" && !tls.secretName) {
        issues.push({ type: "warning", doc, path: `spec.tls[${i}]`, message: "TLS entry is missing 'secretName'" });
      }
    }
  } else if (!spec.tls) {
    issues.push({ type: "info", doc, path: "spec.tls", message: "No TLS configured — traffic will be unencrypted" });
  }
}

function validateCronJob(obj: Record<string, YamlValue>, doc: number, issues: Issue[]) {
  const spec = obj.spec as Record<string, YamlValue> | undefined;
  if (!spec) return;

  if (!spec.schedule) {
    issues.push({ type: "error", doc, path: "spec.schedule", message: "CronJob requires a 'schedule' field" });
  } else if (typeof spec.schedule === "string") {
    const parts = spec.schedule.trim().split(/\s+/);
    if (parts.length < 5 || parts.length > 6) {
      issues.push({ type: "error", doc, path: "spec.schedule", message: `Invalid cron schedule "${spec.schedule}" — expected 5 fields (minute hour dom month dow)` });
    }
  }

  if (!spec.jobTemplate) {
    issues.push({ type: "error", doc, path: "spec.jobTemplate", message: "CronJob requires a 'jobTemplate' field" });
  }
}

function validateConfigMapSecret(obj: Record<string, YamlValue>, kind: string, doc: number, issues: Issue[]) {
  if (kind === "Secret") {
    const sObj = obj as Record<string, YamlValue>;
    if (sObj.stringData && sObj.data) {
      issues.push({ type: "info", doc, path: "/", message: "Secret has both 'data' and 'stringData' — stringData values will be merged into data (base64-encoded)" });
    }
    if (sObj.type && typeof sObj.type === "string") {
      const validTypes = ["Opaque", "kubernetes.io/service-account-token", "kubernetes.io/dockercfg", "kubernetes.io/dockerconfigjson", "kubernetes.io/basic-auth", "kubernetes.io/ssh-auth", "kubernetes.io/tls", "bootstrap.kubernetes.io/token"];
      if (!validTypes.includes(sObj.type) && !sObj.type.startsWith("custom/")) {
        issues.push({ type: "info", doc, path: "type", message: `Secret type "${sObj.type}" is not a built-in type — may be a custom type` });
      }
    }
  }
}

function validateAllDocs(docs: YamlValue[]): Issue[] {
  const allIssues: Issue[] = [];
  for (let i = 0; i < docs.length; i++) {
    allIssues.push(...validateK8sManifest(docs[i], i));
  }
  return allIssues;
}

export default function KubernetesValidatorTool() {
  const [input, setInput] = useState("");
  const [issues, setIssues] = useState<Issue[]>([]);
  const [hasValidated, setHasValidated] = useState(false);
  const [docCount, setDocCount] = useState(0);
  const [parseError, setParseError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { remaining, dailyLimit, isLimited, recordUsage } =
    useRateLimit("k8s-validator");
  const { trackAction } = useToolAnalytics("k8s-validator");

  const handleValidate = useCallback(() => {
    if (isLimited) return;
    recordUsage();
    trackAction("validate");
    setCopied(false);
    setParseError(null);

    if (!input.trim()) {
      setIssues([]);
      setHasValidated(false);
      setDocCount(0);
      return;
    }

    const { docs, error } = parseYamlDocuments(input);
    if (error) {
      setParseError(error);
      setIssues([]);
      setHasValidated(true);
      setDocCount(0);
      return;
    }

    if (docs.length === 0) {
      setParseError("No valid YAML documents found");
      setIssues([]);
      setHasValidated(true);
      setDocCount(0);
      return;
    }

    setDocCount(docs.length);
    const result = validateAllDocs(docs);
    setIssues(result);
    setHasValidated(true);
  }, [input, isLimited, recordUsage, trackAction]);

  useKeyboardShortcut("Enter", handleValidate);

  function handleLoadSample() {
    setInput(SAMPLE_MANIFEST);
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

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="mb-8 block text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        &larr; Back to tools
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Kubernetes YAML Validator
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Validate Kubernetes manifests for required fields, structural errors,
        security best practices, and common misconfigurations. Supports
        multi-document YAML.
      </p>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste your Kubernetes YAML manifest here..."
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
          <div className="flex items-center gap-3 text-sm font-medium">
            <span className="text-gray-600 dark:text-gray-400">
              {docCount} document{docCount !== 1 ? "s" : ""} scanned
            </span>
            {errorCount === 0 && warningCount === 0 && issues.length === 0 && (
              <span className="text-green-600 dark:text-green-400">
                All checks passed
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
          {issues.length > 0 && (
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
                    {docCount > 1 && (
                      <span className="font-mono opacity-70">Doc {issue.doc}: </span>
                    )}
                    <span className="font-mono opacity-70">{issue.path} </span>
                    {issue.message}
                  </span>
                </div>
              ))}
            </div>
          )}

          {issues.length === 0 && (
            <div className="rounded-lg bg-green-50 border border-green-200 p-4 text-sm text-green-700 dark:bg-green-950/50 dark:border-green-800 dark:text-green-400">
              No issues found — your Kubernetes manifest looks good!
            </div>
          )}
        </div>
      )}

      {/* About section */}
      <details className="mt-8 rounded-lg border border-gray-200 dark:border-gray-700">
        <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          About Kubernetes YAML Validation
        </summary>
        <div className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400 space-y-3">
          <p>
            Kubernetes manifests are YAML files that describe the desired state
            of your cluster resources — Deployments, Services, ConfigMaps, and
            more.
          </p>
          <p>
            <strong>What we check:</strong>
          </p>
          <ul className="list-disc ml-5 space-y-1">
            <li>Required fields — apiVersion, kind, metadata.name</li>
            <li>
              Workload validation — Deployments, StatefulSets, DaemonSets, Jobs, CronJobs
            </li>
            <li>
              Selector/label matching — ensures selectors match template labels
            </li>
            <li>
              Container checks — image tags, resource requests/limits, health probes
            </li>
            <li>
              Security — privileged mode, privilege escalation, running as root, securityContext
            </li>
            <li>
              Service validation — ports, selectors, NodePort ranges, service types
            </li>
            <li>
              Ingress — TLS configuration, rules, backend references
            </li>
            <li>
              CronJob schedule validation and Secret type checks
            </li>
            <li>Multi-document YAML support (separated by ---)</li>
          </ul>
          <p>
            Everything runs in your browser — no data is sent over the network.
          </p>
        </div>
      </details>
    </div>
  );
}
