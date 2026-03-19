"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import * as TOML from "smol-toml";
import yaml from "js-yaml";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import RateLimitBanner from "@/components/RateLimitBanner";

type Mode = "toml-to-json" | "json-to-toml" | "toml-to-yaml" | "yaml-to-toml";

const SAMPLE_TOML = `[package]
name = "my-app"
version = "0.1.0"
edition = "2021"
description = "A sample Rust project"

[dependencies]
serde = { version = "1.0", features = ["derive"] }
tokio = { version = "1", features = ["full"] }
reqwest = "0.11"

[dev-dependencies]
assert_cmd = "2.0"

[[bin]]
name = "my-app"
path = "src/main.rs"

[profile.release]
opt-level = 3
lto = true`;

const SAMPLE_JSON = `{
  "package": {
    "name": "my-app",
    "version": "0.1.0",
    "edition": "2021",
    "description": "A sample Rust project"
  },
  "dependencies": {
    "serde": {
      "version": "1.0",
      "features": ["derive"]
    },
    "tokio": {
      "version": "1",
      "features": ["full"]
    },
    "reqwest": "0.11"
  },
  "dev-dependencies": {
    "assert_cmd": "2.0"
  },
  "bin": [
    {
      "name": "my-app",
      "path": "src/main.rs"
    }
  ],
  "profile": {
    "release": {
      "opt-level": 3,
      "lto": true
    }
  }
}`;

const SAMPLE_YAML = `package:
  name: my-app
  version: "0.1.0"
  edition: "2021"
  description: A sample Rust project
dependencies:
  serde:
    version: "1.0"
    features:
      - derive
  tokio:
    version: "1"
    features:
      - full
  reqwest: "0.11"
dev-dependencies:
  assert_cmd: "2.0"
bin:
  - name: my-app
    path: src/main.rs
profile:
  release:
    opt-level: 3
    lto: true`;

function getSampleInput(mode: Mode): string {
  switch (mode) {
    case "toml-to-json":
    case "toml-to-yaml":
      return SAMPLE_TOML;
    case "json-to-toml":
      return SAMPLE_JSON;
    case "yaml-to-toml":
      return SAMPLE_YAML;
  }
}

function getInputLabel(mode: Mode): string {
  switch (mode) {
    case "toml-to-json":
    case "toml-to-yaml":
      return "TOML Input";
    case "json-to-toml":
      return "JSON Input";
    case "yaml-to-toml":
      return "YAML Input";
  }
}

function getOutputLabel(mode: Mode): string {
  switch (mode) {
    case "toml-to-json":
      return "JSON Output";
    case "toml-to-yaml":
      return "YAML Output";
    case "json-to-toml":
    case "yaml-to-toml":
      return "TOML Output";
  }
}

function getPlaceholder(mode: Mode): string {
  switch (mode) {
    case "toml-to-json":
    case "toml-to-yaml":
      return '[package]\nname = "my-app"\nversion = "0.1.0"';
    case "json-to-toml":
      return '{\n  "package": {\n    "name": "my-app"\n  }\n}';
    case "yaml-to-toml":
      return "package:\n  name: my-app\n  version: \"0.1.0\"";
  }
}

const MODES: { value: Mode; label: string }[] = [
  { value: "toml-to-json", label: "TOML → JSON" },
  { value: "json-to-toml", label: "JSON → TOML" },
  { value: "toml-to-yaml", label: "TOML → YAML" },
  { value: "yaml-to-toml", label: "YAML → TOML" },
];

export default function TomlConverterTool() {
  const [mode, setMode] = useState<Mode>("toml-to-json");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [indent, setIndent] = useState(2);
  const [copied, setCopied] = useState(false);

  const { trackAction } = useToolAnalytics("toml-converter");
  const { remaining, dailyLimit, isLimited, recordUsage } =
    useRateLimit("toml-converter");

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

    try {
      switch (mode) {
        case "toml-to-json": {
          const parsed = TOML.parse(input);
          setOutput(JSON.stringify(parsed, null, indent));
          break;
        }
        case "json-to-toml": {
          const parsed = JSON.parse(input);
          if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
            setError("TOML root must be an object (table). Arrays and primitives are not valid TOML root values.");
            return;
          }
          setOutput(TOML.stringify(parsed));
          break;
        }
        case "toml-to-yaml": {
          const parsed = TOML.parse(input);
          setOutput(
            yaml.dump(parsed, {
              indent,
              lineWidth: -1,
              noRefs: true,
              sortKeys: false,
            })
          );
          break;
        }
        case "yaml-to-toml": {
          const parsed = yaml.load(input);
          if (parsed === undefined || parsed === null) {
            setError("YAML is empty or contains only comments.");
            return;
          }
          if (typeof parsed !== "object" || Array.isArray(parsed)) {
            setError("TOML root must be an object (table). The YAML input must represent a mapping, not a scalar or sequence.");
            return;
          }
          setOutput(TOML.stringify(parsed as Record<string, unknown>));
          break;
        }
      }
    } catch (e) {
      const msg =
        e instanceof Error
          ? e.message
          : "Conversion failed. Check your syntax and try again.";
      setError(msg);
    }
  }, [input, mode, indent, isLimited, recordUsage, trackAction]);

  useKeyboardShortcut("Enter", handleConvert);

  function handleCopy() {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function handleLoadSample() {
    setInput(getSampleInput(mode));
    setOutput("");
    setError("");
  }

  function handleModeChange(newMode: Mode) {
    setMode(newMode);
    setInput("");
    setOutput("");
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
        TOML ↔ JSON/YAML Converter
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Convert between TOML, JSON, and YAML formats. Perfect for Cargo.toml,
        pyproject.toml, and configuration files.
      </p>

      <RateLimitBanner
        remaining={remaining}
        dailyLimit={dailyLimit}
        isLimited={isLimited}
      />

      {/* Mode toggle + options */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
          {MODES.map((m, i) => (
            <button
              key={m.value}
              onClick={() => handleModeChange(m.value)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                i > 0
                  ? "border-l border-gray-300 dark:border-gray-600"
                  : ""
              } ${
                mode === m.value
                  ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                  : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
              }`}
              disabled={mode === m.value}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Indent (for JSON/YAML output) */}
        {(mode === "toml-to-json" || mode === "toml-to-yaml") && (
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
              {mode === "toml-to-json" && (
                <option value={0}>Minified</option>
              )}
            </select>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {getInputLabel(mode)}
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
          placeholder={getPlaceholder(mode)}
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
              {getOutputLabel(mode)}
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
          About TOML ↔ JSON/YAML Conversion
        </h2>
        <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
          <li>
            <strong>TOML</strong> (Tom&apos;s Obvious Minimal Language) — simple
            config format used by Cargo (Rust), pyproject.toml (Python), Hugo,
            and many CLI tools.
          </li>
          <li>
            <strong>JSON</strong> — strict key-value format for APIs, data
            exchange, and tooling configs like package.json and tsconfig.json.
          </li>
          <li>
            <strong>YAML</strong> — indentation-based format popular for
            Kubernetes, Docker Compose, and CI/CD pipelines.
          </li>
          <li>
            TOML requires a table (object) at the root — arrays and primitives
            are not valid top-level values.
          </li>
          <li>
            Everything runs in your browser — no data is sent over the network.
          </li>
        </ul>
      </div>
    </div>
  );
}
