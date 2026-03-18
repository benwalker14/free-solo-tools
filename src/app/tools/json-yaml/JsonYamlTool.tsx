"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import yaml from "js-yaml";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import RateLimitBanner from "@/components/RateLimitBanner";

type Mode = "json-to-yaml" | "yaml-to-json";

const SAMPLE_JSON = `{
  "apiVersion": "apps/v1",
  "kind": "Deployment",
  "metadata": {
    "name": "web-app",
    "labels": {
      "app": "web",
      "environment": "production"
    }
  },
  "spec": {
    "replicas": 3,
    "selector": {
      "matchLabels": {
        "app": "web"
      }
    },
    "template": {
      "spec": {
        "containers": [
          {
            "name": "web",
            "image": "nginx:1.25",
            "ports": [{ "containerPort": 80 }],
            "resources": {
              "limits": { "cpu": "500m", "memory": "128Mi" },
              "requests": { "cpu": "250m", "memory": "64Mi" }
            }
          }
        ]
      }
    }
  }
}`;

const SAMPLE_YAML = `apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
  labels:
    app: web
    environment: production
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web
  template:
    spec:
      containers:
        - name: web
          image: "nginx:1.25"
          ports:
            - containerPort: 80
          resources:
            limits:
              cpu: 500m
              memory: 128Mi
            requests:
              cpu: 250m
              memory: 64Mi`;

export default function JsonYamlTool() {
  const [mode, setMode] = useState<Mode>("json-to-yaml");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [indent, setIndent] = useState(2);
  const [copied, setCopied] = useState(false);

  const { trackAction } = useToolAnalytics("json-yaml");
  const { remaining, dailyLimit, isLimited, recordUsage } =
    useRateLimit("json-yaml");

  const handleConvert = useCallback(() => {
    setError("");
    setOutput("");
    setCopied(false);

    if (!input.trim()) {
      setError("Please enter some data to convert.");
      return;
    }

    if (isLimited) return;
    recordUsage();
    trackAction(mode);

    if (mode === "json-to-yaml") {
      try {
        const parsed = JSON.parse(input);
        const result = yaml.dump(parsed, {
          indent,
          lineWidth: -1,
          noRefs: true,
          sortKeys: false,
        });
        setOutput(result);
      } catch {
        setError("Invalid JSON. Check your syntax and try again.");
      }
    } else {
      try {
        const parsed = yaml.load(input);
        if (parsed === undefined || parsed === null) {
          setError("YAML is empty or contains only comments.");
          return;
        }
        const result = JSON.stringify(parsed, null, indent);
        setOutput(result);
      } catch (e) {
        const msg = e instanceof yaml.YAMLException ? e.message : "Invalid YAML. Check your syntax and try again.";
        setError(msg);
      }
    }
  }, [input, mode, indent, isLimited, recordUsage, trackAction]);

  useKeyboardShortcut("Enter", handleConvert);

  function handleCopy() {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function handleLoadSample() {
    setInput(mode === "json-to-yaml" ? SAMPLE_JSON : SAMPLE_YAML);
    setOutput("");
    setError("");
  }

  function handleSwapMode() {
    const newMode: Mode =
      mode === "json-to-yaml" ? "yaml-to-json" : "json-to-yaml";
    setMode(newMode);
    if (output) {
      setInput(output);
      setOutput("");
    }
    setError("");
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
        JSON ↔ YAML Converter
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Convert between JSON and YAML formats. Perfect for Kubernetes configs,
        CI/CD pipelines, and configuration files.
      </p>

      <RateLimitBanner remaining={remaining} dailyLimit={dailyLimit} isLimited={isLimited} />

      {/* Mode toggle + options */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
          <button
            onClick={() => handleSwapMode()}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              mode === "json-to-yaml"
                ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
            }`}
            disabled={mode === "json-to-yaml"}
          >
            JSON → YAML
          </button>
          <button
            onClick={() => handleSwapMode()}
            className={`px-4 py-2 text-sm font-medium transition-colors border-l border-gray-300 dark:border-gray-600 ${
              mode === "yaml-to-json"
                ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
            }`}
            disabled={mode === "yaml-to-json"}
          >
            YAML → JSON
          </button>
        </div>

        {/* Indent */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 dark:text-gray-400">
            Indent:
          </label>
          <select
            value={indent}
            onChange={(e) => setIndent(Number(e.target.value))}
            className="rounded border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300"
          >
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
            {mode === "yaml-to-json" && <option value={0}>Minified</option>}
          </select>
        </div>
      </div>

      {/* Input */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {mode === "json-to-yaml" ? "JSON Input" : "YAML Input"}
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
          placeholder={
            mode === "json-to-yaml"
              ? '{\n  "key": "value",\n  "list": [1, 2, 3]\n}'
              : "key: value\nlist:\n  - 1\n  - 2\n  - 3"
          }
          rows={14}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 font-mono text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
          spellCheck={false}
        />
      </div>

      {/* Convert button */}
      <button
        onClick={handleConvert}
        disabled={isLimited || !input.trim()}
        className="mb-6 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-gray-900"
      >
        Convert{" "}
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
              {mode === "json-to-yaml" ? "YAML Output" : "JSON Output"}
            </label>
            <button
              onClick={handleCopy}
              className="rounded border border-gray-300 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <pre className="max-h-96 overflow-auto rounded-lg border border-gray-200 bg-white p-4 font-mono text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100">
            {output}
          </pre>
        </div>
      )}

      {/* Info */}
      <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          About JSON ↔ YAML Conversion
        </h2>
        <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
          <li>
            <strong>JSON</strong> (JavaScript Object Notation) — strict syntax
            with quoted keys, used for APIs and data exchange.
          </li>
          <li>
            <strong>YAML</strong> (YAML Ain&apos;t Markup Language) —
            human-friendly format using indentation, popular for configs
            (Kubernetes, Docker Compose, GitHub Actions, etc.).
          </li>
          <li>
            Swap button carries output to input for round-trip conversion.
          </li>
          <li>
            Sample data uses a Kubernetes Deployment manifest — a real-world
            use case for this tool.
          </li>
          <li>
            Everything runs in your browser — no data is sent over the network.
          </li>
        </ul>
      </div>
    </div>
  );
}
