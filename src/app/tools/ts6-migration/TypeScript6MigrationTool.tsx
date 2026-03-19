"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import RateLimitBanner from "@/components/RateLimitBanner";

// ── Types ──────────────────────────────────────────────────────────────────

type Severity = "error" | "warning" | "info";

interface Issue {
  severity: Severity;
  title: string;
  description: string;
  fix: string;
  option?: string;
  category: string;
}

interface AnalysisResult {
  issues: Issue[];
  fixed: Record<string, unknown>;
  stats: {
    errors: number;
    warnings: number;
    info: number;
    optionsChecked: number;
  };
  grade: string;
  escapeHatch: boolean;
}

// ── Changed defaults reference ─────────────────────────────────────────────

const TS6_DEFAULT_CHANGES: Array<{
  option: string;
  oldDefault: string;
  newDefault: string;
  category: string;
}> = [
  { option: "strict", oldDefault: "false", newDefault: "true", category: "Strictness" },
  { option: "target", oldDefault: "es5 / es2020", newDefault: "es2025", category: "Target & Module" },
  { option: "module", oldDefault: "commonjs", newDefault: "esnext", category: "Target & Module" },
  { option: "moduleResolution", oldDefault: "node10", newDefault: "bundler", category: "Module Resolution" },
  { option: "rootDir", oldDefault: "(inferred)", newDefault: ".", category: "Emit" },
  { option: "types", oldDefault: 'all @types/*', newDefault: "[] (empty)", category: "Type Checking" },
  { option: "noUncheckedSideEffectImports", oldDefault: "false", newDefault: "true", category: "Strictness" },
  { option: "esModuleInterop", oldDefault: "false", newDefault: "true (locked)", category: "Interop" },
  { option: "allowSyntheticDefaultImports", oldDefault: "false", newDefault: "true (locked)", category: "Interop" },
];

// ── JSONC Parser ───────────────────────────────────────────────────────────

function stripJsonComments(text: string): string {
  let result = "";
  let i = 0;
  let inString = false;
  let escape = false;
  while (i < text.length) {
    if (escape) {
      result += text[i];
      escape = false;
      i++;
      continue;
    }
    if (text[i] === "\\" && inString) {
      result += text[i];
      escape = true;
      i++;
      continue;
    }
    if (text[i] === '"') {
      inString = !inString;
      result += text[i];
      i++;
      continue;
    }
    if (!inString) {
      if (text[i] === "/" && text[i + 1] === "/") {
        while (i < text.length && text[i] !== "\n") i++;
        continue;
      }
      if (text[i] === "/" && text[i + 1] === "*") {
        i += 2;
        while (i < text.length && !(text[i] === "*" && text[i + 1] === "/"))
          i++;
        i += 2;
        continue;
      }
    }
    result += text[i];
    i++;
  }
  return result.replace(/,\s*([\]}])/g, "$1");
}

// ── Analyzer ───────────────────────────────────────────────────────────────

function analyzeTsConfig(input: string): AnalysisResult {
  const cleaned = stripJsonComments(input);
  const config = JSON.parse(cleaned);

  const opts: Record<string, unknown> = config.compilerOptions || {};
  const issues: Issue[] = [];
  const fixed = JSON.parse(JSON.stringify(config));
  if (!fixed.compilerOptions) fixed.compilerOptions = {};
  const fco = fixed.compilerOptions as Record<string, unknown>;

  const has = (key: string) => key in opts;
  const val = (key: string) => opts[key];
  const escapeHatch = val("ignoreDeprecations") === "6.0";

  // ── REMOVED OPTIONS ──

  const target =
    typeof val("target") === "string"
      ? (val("target") as string).toLowerCase()
      : undefined;

  if (target === "es3" || target === "es5") {
    issues.push({
      severity: "error",
      title: `Target "${val("target")}" removed`,
      description: `"target": "${val("target")}" is no longer supported. The lowest target is now "es2015".`,
      fix: 'Set "target": "es2015" (or higher). Use esbuild/SWC/Babel for ES5 output.',
      option: "target",
      category: "Target & Module",
    });
    fco.target = "ES2015";
  }

  if (has("outFile")) {
    issues.push({
      severity: "error",
      title: '"outFile" removed',
      description:
        "The outFile option has been completely removed in TypeScript 6.0.",
      fix: "Remove outFile and use a bundler (Webpack, Rollup, esbuild, Vite).",
      option: "outFile",
      category: "Emit",
    });
    delete fco.outFile;
  }

  if (has("out")) {
    issues.push({
      severity: "error",
      title: '"out" removed',
      description:
        'The "out" option was deprecated in TS 1.8 in favor of outFile, and has been fully removed.',
      fix: 'Remove "out" and use a bundler.',
      option: "out",
      category: "Emit",
    });
    delete fco.out;
  }

  if (has("downlevelIteration")) {
    issues.push({
      severity: "error",
      title: '"downlevelIteration" deprecated',
      description:
        "This option only had effect below ES2015. Any usage (even false) now triggers a deprecation error.",
      fix: "Remove the downlevelIteration option entirely.",
      option: "downlevelIteration",
      category: "Emit",
    });
    delete fco.downlevelIteration;
  }

  const modRes =
    typeof val("moduleResolution") === "string"
      ? (val("moduleResolution") as string).toLowerCase()
      : undefined;

  if (modRes === "node" || modRes === "node10") {
    issues.push({
      severity: "error",
      title: '"moduleResolution": "node" (node10) deprecated',
      description:
        'The legacy Node.js module resolution strategy is deprecated. It doesn\'t support package.json "exports".',
      fix: 'Use "moduleResolution": "nodenext" (Node.js) or "bundler" (bundlers/Bun).',
      option: "moduleResolution",
      category: "Module Resolution",
    });
    fco.moduleResolution = "Bundler";
  }

  if (modRes === "classic") {
    issues.push({
      severity: "error",
      title: '"moduleResolution": "classic" deprecated',
      description:
        "TypeScript's original pre-Node.js resolution strategy is deprecated.",
      fix: 'Use "moduleResolution": "nodenext" or "bundler".',
      option: "moduleResolution",
      category: "Module Resolution",
    });
    fco.moduleResolution = "Bundler";
  }

  const mod =
    typeof val("module") === "string"
      ? (val("module") as string).toLowerCase()
      : undefined;

  if (
    mod === "amd" ||
    mod === "umd" ||
    mod === "system" ||
    mod === "systemjs"
  ) {
    issues.push({
      severity: "error",
      title: `"module": "${val("module")}" removed`,
      description: `The ${(val("module") as string).toUpperCase()} module system is no longer supported.`,
      fix: 'Use "module": "esnext", "preserve", "commonjs", or "nodenext".',
      option: "module",
      category: "Target & Module",
    });
    fco.module = "ESNext";
  }

  if (mod === "none") {
    issues.push({
      severity: "warning",
      title: '"module": "none" deprecated',
      description: 'The "none" module value is deprecated.',
      fix: 'Use "esnext", "preserve", "commonjs", or "nodenext".',
      option: "module",
      category: "Target & Module",
    });
    fco.module = "ESNext";
  }

  if (has("esModuleInterop") && val("esModuleInterop") === false) {
    issues.push({
      severity: "error",
      title: '"esModuleInterop": false no longer allowed',
      description:
        "Safer CJS/ESM interop is always enabled in TS 6.0. Setting it to false is an error.",
      fix: 'Remove "esModuleInterop" or set it to true.',
      option: "esModuleInterop",
      category: "Interop",
    });
    delete fco.esModuleInterop;
  }

  if (
    has("allowSyntheticDefaultImports") &&
    val("allowSyntheticDefaultImports") === false
  ) {
    issues.push({
      severity: "error",
      title: '"allowSyntheticDefaultImports": false no longer allowed',
      description:
        "Synthetic default imports are always permitted in TS 6.0.",
      fix: 'Remove "allowSyntheticDefaultImports" or set it to true.',
      option: "allowSyntheticDefaultImports",
      category: "Interop",
    });
    delete fco.allowSyntheticDefaultImports;
  }

  if (has("alwaysStrict") && val("alwaysStrict") === false) {
    issues.push({
      severity: "error",
      title: '"alwaysStrict": false no longer supported',
      description:
        'All code is now unconditionally in JavaScript strict mode. Non-ESM files always emit "use strict".',
      fix: "Remove alwaysStrict. Ensure code doesn't rely on sloppy mode semantics.",
      option: "alwaysStrict",
      category: "Strictness",
    });
    delete fco.alwaysStrict;
  }

  if (has("charset")) {
    issues.push({
      severity: "error",
      title: '"charset" removed',
      description: "The charset option was deprecated and has been removed. TypeScript always uses UTF-8.",
      fix: 'Remove the "charset" option.',
      option: "charset",
      category: "Deprecated",
    });
    delete fco.charset;
  }

  if (has("noStrictGenericChecks")) {
    issues.push({
      severity: "error",
      title: '"noStrictGenericChecks" removed',
      description: "This escape hatch for bypassing strict generic type checking has been removed.",
      fix: 'Remove "noStrictGenericChecks" and fix any generic type errors.',
      option: "noStrictGenericChecks",
      category: "Strictness",
    });
    delete fco.noStrictGenericChecks;
  }

  if (has("suppressImplicitAnyIndexErrors")) {
    issues.push({
      severity: "error",
      title: '"suppressImplicitAnyIndexErrors" removed',
      description: "This option suppressed errors when indexing objects with string keys. It has been fully removed.",
      fix: 'Remove it. Add index signatures or use noUncheckedIndexedAccess instead.',
      option: "suppressImplicitAnyIndexErrors",
      category: "Strictness",
    });
    delete fco.suppressImplicitAnyIndexErrors;
  }

  // ES5 in lib array
  if (
    opts.lib &&
    Array.isArray(opts.lib) &&
    (opts.lib as string[]).some((l: string) => l.toLowerCase() === "es5")
  ) {
    issues.push({
      severity: "error",
      title: 'lib includes "ES5" — removed',
      description: "The ES5 library typings have been removed. Use ES2015 or newer lib entries.",
      fix: 'Replace "ES5" with "ES2015" or newer in the lib array.',
      option: "lib",
      category: "Target & Module",
    });
    fco.lib = (opts.lib as string[]).map((l: string) =>
      l.toLowerCase() === "es5" ? "ES2015" : l,
    );
  }

  // prepend in project references
  if (config.references && Array.isArray(config.references)) {
    const hasPrepend = (config.references as Array<{ prepend?: boolean }>).some(
      (ref) => ref.prepend,
    );
    if (hasPrepend) {
      issues.push({
        severity: "error",
        title: '"prepend" in project references removed',
        description: "The prepend option in project references has been removed along with outFile.",
        fix: "Remove prepend from project references and use a bundler.",
        category: "Emit",
      });
      fixed.references = (
        config.references as Array<{ path: string; prepend?: boolean }>
      ).map(({ prepend: _p, ...rest }) => rest);
    }
  }

  // ── WARNINGS (deprecated / behavior changes) ──

  if (has("baseUrl")) {
    issues.push({
      severity: "warning",
      title: '"baseUrl" deprecated as resolution root',
      description:
        "baseUrl no longer functions as module resolution lookup root. Inline the base path into paths entries.",
      fix: 'Remove "baseUrl" and prefix paths entries with the base path (e.g., "@app/*": ["./src/app/*"]).',
      option: "baseUrl",
      category: "Module Resolution",
    });
  }

  if (has("importsNotUsedAsValues")) {
    issues.push({
      severity: "warning",
      title: '"importsNotUsedAsValues" deprecated',
      description: "Replaced by verbatimModuleSyntax. Will be removed in a future version.",
      fix: 'Remove "importsNotUsedAsValues" and add "verbatimModuleSyntax": true.',
      option: "importsNotUsedAsValues",
      category: "Module Resolution",
    });
    delete fco.importsNotUsedAsValues;
    fco.verbatimModuleSyntax = true;
  }

  if (has("preserveValueImports")) {
    issues.push({
      severity: "warning",
      title: '"preserveValueImports" deprecated',
      description: "Replaced by verbatimModuleSyntax alongside importsNotUsedAsValues.",
      fix: 'Remove "preserveValueImports" and add "verbatimModuleSyntax": true.',
      option: "preserveValueImports",
      category: "Module Resolution",
    });
    delete fco.preserveValueImports;
    fco.verbatimModuleSyntax = true;
  }

  if (has("keyofStringsOnly")) {
    issues.push({
      severity: "warning",
      title: '"keyofStringsOnly" deprecated',
      description: "This option made keyof only return string keys. It was deprecated and should be removed.",
      fix: 'Remove "keyofStringsOnly". Use Extract<keyof T, string> where needed.',
      option: "keyofStringsOnly",
      category: "Type Checking",
    });
    delete fco.keyofStringsOnly;
  }

  // ── DEFAULT CHANGES (missing explicit values) ──

  if (!has("strict")) {
    issues.push({
      severity: "warning",
      title: '"strict" now defaults to true',
      description:
        "TS 6.0 enables strict mode by default. If your project wasn't using strict mode, this may cause many new type errors.",
      fix: 'Add "strict": false to preserve old behavior, or fix the type errors to adopt strict mode.',
      option: "strict",
      category: "Strictness",
    });
    fco.strict = true;
  }

  if (!has("module") && !mod) {
    issues.push({
      severity: "warning",
      title: '"module" now defaults to "esnext"',
      description:
        'The default changed from "commonjs" to "esnext". Your emit will use import/export instead of require().',
      fix: 'Add "module": "commonjs" if your project needs CommonJS output.',
      option: "module",
      category: "Target & Module",
    });
  }

  if (!has("rootDir")) {
    issues.push({
      severity: "warning",
      title: '"rootDir" now defaults to tsconfig directory',
      description:
        'Previously inferred from input files. Projects with "src/" structures may see output at dist/src/index.js instead of dist/index.js.',
      fix: 'Add "rootDir": "./src" (or your source root) to preserve the previous output structure.',
      option: "rootDir",
      category: "Emit",
    });
  }

  if (!has("types")) {
    issues.push({
      severity: "warning",
      title: '"types" now defaults to [] (empty)',
      description:
        "All @types/* packages were auto-discovered before. Now you must list them explicitly or global types (Buffer, process, Jest matchers) will be missing.",
      fix: 'Add "types": ["node", "jest", ...] for the type packages your project needs.',
      option: "types",
      category: "Type Checking",
    });
  }

  // ── INFO (recommendations & no-ops) ──

  if (!has("target") && !target) {
    issues.push({
      severity: "info",
      title: '"target" now defaults to "es2025"',
      description:
        'The default target changed from "es5"/"es2020" to "es2025". Output will use modern JS features.',
      fix: 'Add an explicit "target" if you need to support older runtimes.',
      option: "target",
      category: "Target & Module",
    });
  }

  if (!has("moduleResolution") && !modRes) {
    issues.push({
      severity: "info",
      title: '"moduleResolution" now defaults to "bundler"',
      description: 'Previously defaulted to "node10". The new "bundler" default supports package.json exports.',
      fix: 'Add "moduleResolution": "nodenext" if targeting Node.js directly.',
      option: "moduleResolution",
      category: "Module Resolution",
    });
  }

  if (!has("noUncheckedSideEffectImports")) {
    issues.push({
      severity: "info",
      title: '"noUncheckedSideEffectImports" now defaults to true',
      description: 'Side-effect imports (e.g., import "./styles.css") must now resolve to existing files.',
      fix: 'Set "noUncheckedSideEffectImports": false if you have non-resolving side-effect imports.',
      option: "noUncheckedSideEffectImports",
      category: "Strictness",
    });
  }

  if (has("esModuleInterop") && val("esModuleInterop") === true) {
    issues.push({
      severity: "info",
      title: '"esModuleInterop": true is now a no-op',
      description: "This behavior is always enabled in TS 6.0. The option can be safely removed.",
      fix: 'Remove "esModuleInterop" to clean up your config.',
      option: "esModuleInterop",
      category: "Interop",
    });
    delete fco.esModuleInterop;
  }

  if (
    has("allowSyntheticDefaultImports") &&
    val("allowSyntheticDefaultImports") === true
  ) {
    issues.push({
      severity: "info",
      title: '"allowSyntheticDefaultImports": true is now a no-op',
      description: "This behavior is always enabled in TS 6.0. The option can be safely removed.",
      fix: 'Remove "allowSyntheticDefaultImports" to clean up your config.',
      option: "allowSyntheticDefaultImports",
      category: "Interop",
    });
    delete fco.allowSyntheticDefaultImports;
  }

  if (escapeHatch) {
    issues.push({
      severity: "info",
      title: '"ignoreDeprecations": "6.0" detected',
      description: "You're using the escape hatch to silence deprecation errors. This will NOT work in TypeScript 7.0.",
      fix: "Plan to address all deprecation warnings before upgrading to TS 7.0.",
      option: "ignoreDeprecations",
      category: "Migration",
    });
  }

  // ── Grade ──

  const errors = issues.filter((i) => i.severity === "error").length;
  const warnings = issues.filter((i) => i.severity === "warning").length;
  const info = issues.filter((i) => i.severity === "info").length;

  let grade = "A";
  if (errors >= 5) grade = "F";
  else if (errors >= 3) grade = "D";
  else if (errors >= 1) grade = "C";
  else if (warnings >= 4) grade = "C";
  else if (warnings >= 2) grade = "B";
  else if (warnings >= 1) grade = "B+";
  else if (info > 0) grade = "A-";

  return {
    issues,
    fixed,
    stats: { errors, warnings, info, optionsChecked: Object.keys(opts).length },
    grade,
    escapeHatch,
  };
}

// ── Samples ────────────────────────────────────────────────────────────────

const SAMPLES: { label: string; config: string }[] = [
  {
    label: "Legacy ES5 Project",
    config: `{
  "compilerOptions": {
    "target": "es5",
    "module": "commonjs",
    "moduleResolution": "node",
    "outFile": "./dist/bundle.js",
    "downlevelIteration": true,
    "esModuleInterop": false,
    "strict": false,
    "baseUrl": "./src",
    "paths": {
      "@app/*": ["app/*"],
      "@lib/*": ["lib/*"]
    }
  },
  "include": ["src/**/*"]
}`,
  },
  {
    label: "Modern Next.js",
    config: `{
  "compilerOptions": {
    "target": "es2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "rootDir": ".",
    "types": ["node"],
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}`,
  },
  {
    label: "Node.js CommonJS",
    config: `{
  "compilerOptions": {
    "target": "es2020",
    "module": "commonjs",
    "moduleResolution": "node",
    "outDir": "./dist",
    "declaration": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true
  },
  "include": ["src"]
}`,
  },
  {
    label: "Minimal (Empty)",
    config: `{
  "compilerOptions": {}
}`,
  },
];

// ── Severity Styles ────────────────────────────────────────────────────────

const SEVERITY_STYLES: Record<
  Severity,
  { bg: string; border: string; icon: string; text: string; badge: string }
> = {
  error: {
    bg: "bg-red-50 dark:bg-red-900/20",
    border: "border-red-200 dark:border-red-800",
    icon: "\u2715",
    text: "text-red-800 dark:text-red-300",
    badge: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  },
  warning: {
    bg: "bg-amber-50 dark:bg-amber-900/20",
    border: "border-amber-200 dark:border-amber-800",
    icon: "\u26A0",
    text: "text-amber-800 dark:text-amber-300",
    badge: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  },
  info: {
    bg: "bg-blue-50 dark:bg-blue-900/20",
    border: "border-blue-200 dark:border-blue-800",
    icon: "\u2139",
    text: "text-blue-800 dark:text-blue-300",
    badge: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  },
};

const GRADE_COLORS: Record<string, string> = {
  A: "text-emerald-600 dark:text-emerald-400",
  "A-": "text-emerald-600 dark:text-emerald-400",
  "B+": "text-green-600 dark:text-green-400",
  B: "text-green-600 dark:text-green-400",
  C: "text-amber-600 dark:text-amber-400",
  D: "text-orange-600 dark:text-orange-400",
  F: "text-red-600 dark:text-red-400",
};

// ── Component ──────────────────────────────────────────────────────────────

export default function TypeScript6MigrationTool() {
  const { remaining, dailyLimit, isLimited, recordUsage } =
    useRateLimit("ts6-migration");
  const { trackAction } = useToolAnalytics("ts6-migration");

  const [input, setInput] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");
  const [filterSeverity, setFilterSeverity] = useState<Severity | "all">("all");
  const [activeTab, setActiveTab] = useState<"issues" | "fixed">("issues");
  const [copied, setCopied] = useState(false);

  const handleAnalyze = useCallback(() => {
    if (isLimited || !input.trim()) return;
    setError("");
    setCopied(false);

    try {
      recordUsage();
      trackAction("analyze");
      setResult(analyzeTsConfig(input));
      setActiveTab("issues");
      setFilterSeverity("all");
    } catch (e) {
      setError(
        `Invalid JSON: ${e instanceof Error ? e.message : "Could not parse tsconfig.json"}`,
      );
      setResult(null);
    }
  }, [input, isLimited, recordUsage, trackAction]);

  useKeyboardShortcut("Enter", handleAnalyze);

  const handleSample = useCallback(
    (config: string) => {
      setInput(config);
      setResult(null);
      setError("");
      trackAction("load-sample");
    },
    [trackAction],
  );

  const handleClear = useCallback(() => {
    setInput("");
    setResult(null);
    setError("");
    setFilterSeverity("all");
  }, []);

  const filteredIssues = useMemo(() => {
    if (!result) return [];
    if (filterSeverity === "all") return result.issues;
    return result.issues.filter((i) => i.severity === filterSeverity);
  }, [result, filterSeverity]);

  const groupedIssues = useMemo(() => {
    const groups: Record<string, Issue[]> = {};
    for (const issue of filteredIssues) {
      if (!groups[issue.category]) groups[issue.category] = [];
      groups[issue.category].push(issue);
    }
    return groups;
  }, [filteredIssues]);

  const copyFixed = useCallback(async () => {
    if (!result) return;
    await navigator.clipboard.writeText(JSON.stringify(result.fixed, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [result]);

  const downloadFixed = useCallback(() => {
    if (!result) return;
    const blob = new Blob([JSON.stringify(result.fixed, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tsconfig.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [result]);

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-2 text-2xl font-bold text-gray-900 md:text-3xl dark:text-gray-100">
        TypeScript 6.0 Migration Checker
      </h1>
      <p className="mb-6 text-gray-600 dark:text-gray-400">
        Paste your tsconfig.json and instantly see every breaking change,
        deprecated option, and default shift in TypeScript 6.0. Get a readiness
        grade, step-by-step fixes, and a corrected config. Supports JSONC
        (comments &amp; trailing commas).
      </p>

      <RateLimitBanner
        remaining={remaining}
        dailyLimit={dailyLimit}
        isLimited={isLimited}
      />

      {/* Samples */}
      <div className="mb-4 flex flex-wrap gap-2">
        <span className="self-center text-sm font-medium text-gray-600 dark:text-gray-400">
          Samples:
        </span>
        {SAMPLES.map((s) => (
          <button
            key={s.label}
            onClick={() => handleSample(s.config)}
            className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="mb-4">
        <textarea
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setResult(null);
            setError("");
          }}
          placeholder="Paste your tsconfig.json here..."
          spellCheck={false}
          className="h-64 w-full rounded-lg border border-gray-300 bg-white p-4 font-mono text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 dark:focus:ring-blue-800"
        />
      </div>

      {/* Actions */}
      <div className="mb-8 flex flex-wrap items-center gap-3">
        <button
          onClick={handleAnalyze}
          disabled={isLimited || !input.trim()}
          className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-700 dark:hover:bg-blue-600"
        >
          Analyze for TS 6.0
        </button>
        <button
          onClick={handleClear}
          className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Clear
        </button>
        <span className="text-xs text-gray-400 dark:text-gray-500">
          Ctrl+Enter to analyze
        </span>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Summary bar */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
            <div className="rounded-lg border border-gray-200 bg-white p-4 text-center dark:border-gray-700 dark:bg-gray-800">
              <div
                className={`text-3xl font-bold ${GRADE_COLORS[result.grade] || "text-gray-600"}`}
              >
                {result.grade}
              </div>
              <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Readiness
              </div>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4 text-center dark:border-gray-700 dark:bg-gray-800">
              <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                {result.stats.errors}
              </div>
              <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Errors
              </div>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4 text-center dark:border-gray-700 dark:bg-gray-800">
              <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                {result.stats.warnings}
              </div>
              <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Warnings
              </div>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4 text-center dark:border-gray-700 dark:bg-gray-800">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {result.stats.info}
              </div>
              <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Info
              </div>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4 text-center dark:border-gray-700 dark:bg-gray-800">
              <div className="text-3xl font-bold text-gray-700 dark:text-gray-300">
                {result.stats.optionsChecked}
              </div>
              <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Options
              </div>
            </div>
          </div>

          {/* Escape hatch banner */}
          {result.escapeHatch && (
            <div className="rounded-lg border border-purple-200 bg-purple-50 p-4 dark:border-purple-800 dark:bg-purple-900/20">
              <p className="text-sm font-medium text-purple-800 dark:text-purple-300">
                Escape hatch active:{" "}
                <code className="rounded bg-purple-100 px-1.5 py-0.5 text-xs dark:bg-purple-900/40">
                  &quot;ignoreDeprecations&quot;: &quot;6.0&quot;
                </code>{" "}
                silences deprecation errors. This will <strong>not</strong> work
                in TypeScript 7.0.
              </p>
            </div>
          )}

          {/* Tabs: Issues / Fixed Config */}
          <div className="flex gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
            <button
              onClick={() => setActiveTab("issues")}
              className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${activeTab === "issues" ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white" : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"}`}
            >
              Issues ({result.issues.length})
            </button>
            <button
              onClick={() => setActiveTab("fixed")}
              className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${activeTab === "fixed" ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white" : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"}`}
            >
              Fixed Config
            </button>
          </div>

          {/* Issues Tab */}
          {activeTab === "issues" && (
            <>
              {/* Filter buttons */}
              <div className="flex flex-wrap gap-2">
                {(["all", "error", "warning", "info"] as const).map((sev) => (
                  <button
                    key={sev}
                    onClick={() => setFilterSeverity(sev)}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                      filterSeverity === sev
                        ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                    }`}
                  >
                    {sev === "all"
                      ? `All (${result.issues.length})`
                      : `${sev.charAt(0).toUpperCase() + sev.slice(1)} (${result.stats[sev === "error" ? "errors" : sev === "warning" ? "warnings" : "info"]})`}
                  </button>
                ))}
              </div>

              {/* Issues grouped by category */}
              {Object.keys(groupedIssues).length === 0 ? (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-6 text-center dark:border-emerald-800 dark:bg-emerald-900/20">
                  <p className="font-medium text-emerald-800 dark:text-emerald-300">
                    No issues found for this filter.
                  </p>
                </div>
              ) : (
                Object.entries(groupedIssues).map(([category, catIssues]) => (
                  <div key={category}>
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      {category}
                    </h3>
                    <div className="space-y-3">
                      {catIssues.map((issue, idx) => {
                        const style = SEVERITY_STYLES[issue.severity];
                        return (
                          <div
                            key={`${category}-${idx}`}
                            className={`rounded-lg border p-4 ${style.bg} ${style.border}`}
                          >
                            <div className="flex items-start gap-3">
                              <span
                                className={`mt-0.5 text-lg leading-none ${style.text}`}
                              >
                                {style.icon}
                              </span>
                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className={`font-semibold ${style.text}`}>
                                    {issue.title}
                                  </span>
                                  <span
                                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${style.badge}`}
                                  >
                                    {issue.severity}
                                  </span>
                                  {issue.option && (
                                    <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                                      {issue.option}
                                    </code>
                                  )}
                                </div>
                                <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                                  {issue.description}
                                </p>
                                <div className="mt-2 rounded-md bg-white/60 p-2.5 dark:bg-gray-900/30">
                                  <p className="text-sm">
                                    <span className="font-medium text-gray-900 dark:text-gray-100">
                                      Fix:{" "}
                                    </span>
                                    <span className="text-gray-700 dark:text-gray-300">
                                      {issue.fix}
                                    </span>
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </>
          )}

          {/* Fixed Config Tab */}
          {activeTab === "fixed" && (
            <div>
              <div className="mb-3 flex items-center gap-2">
                <button
                  onClick={copyFixed}
                  className="rounded-md bg-gray-100 px-3 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
                <button
                  onClick={downloadFixed}
                  className="rounded-md bg-gray-100 px-3 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Download tsconfig.json
                </button>
              </div>
              <pre className="max-h-[500px] overflow-auto rounded-lg border border-gray-200 bg-gray-50 p-4 font-mono text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
                {JSON.stringify(result.fixed, null, 2)}
              </pre>
            </div>
          )}

          {/* Default changes reference table */}
          <div className="mt-8">
            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100">
              TypeScript 6.0 Default Changes Reference
            </h2>
            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800">
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                      Option
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                      TS 5.x Default
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                      TS 6.0 Default
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                      Category
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {TS6_DEFAULT_CHANGES.map((row) => (
                    <tr key={row.option} className="bg-white dark:bg-gray-900">
                      <td className="px-4 py-2.5">
                        <code className="text-xs font-medium text-gray-900 dark:text-gray-100">
                          {row.option}
                        </code>
                      </td>
                      <td className="px-4 py-2.5 text-gray-600 dark:text-gray-400">
                        {row.oldDefault}
                      </td>
                      <td className="px-4 py-2.5 font-medium text-gray-900 dark:text-gray-100">
                        {row.newDefault}
                      </td>
                      <td className="px-4 py-2.5 text-gray-500 dark:text-gray-400">
                        {row.category}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Link to tsconfig builder */}
          <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Need to rebuild your tsconfig.json from scratch? Try the{" "}
              <Link
                href="/tools/tsconfig-builder"
                className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                tsconfig.json Visual Builder
              </Link>{" "}
              with framework presets for Next.js, React/Vite, Node.js, and more.
            </p>
          </div>
        </div>
      )}

      {/* Reference section (shown before analysis) */}
      {!result && !error && (
        <div className="mt-8 space-y-6">
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100">
              What changed in TypeScript 6.0?
            </h2>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              TypeScript 6.0 is the last JavaScript-based major release before
              the TypeScript 7.0 Go rewrite. It includes significant breaking
              changes to compiler defaults, removes legacy module systems, and
              deprecates options that will be hard-removed in 7.0.
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg border border-red-100 bg-red-50 p-4 dark:border-red-900 dark:bg-red-900/20">
                <h3 className="font-semibold text-red-800 dark:text-red-300">
                  Removed
                </h3>
                <ul className="mt-2 space-y-1 text-sm text-red-700 dark:text-red-300/80">
                  <li>target ES3/ES5</li>
                  <li>outFile option</li>
                  <li>module AMD/UMD/System</li>
                  <li>moduleResolution classic</li>
                  <li>esModuleInterop: false</li>
                </ul>
              </div>
              <div className="rounded-lg border border-amber-100 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-900/20">
                <h3 className="font-semibold text-amber-800 dark:text-amber-300">
                  Deprecated
                </h3>
                <ul className="mt-2 space-y-1 text-sm text-amber-700 dark:text-amber-300/80">
                  <li>moduleResolution: node</li>
                  <li>baseUrl as resolution root</li>
                  <li>downlevelIteration</li>
                  <li>alwaysStrict: false</li>
                  <li>module: none</li>
                </ul>
              </div>
              <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-900/20">
                <h3 className="font-semibold text-blue-800 dark:text-blue-300">
                  New Defaults
                </h3>
                <ul className="mt-2 space-y-1 text-sm text-blue-700 dark:text-blue-300/80">
                  <li>strict: true</li>
                  <li>target: es2025</li>
                  <li>module: esnext</li>
                  <li>moduleResolution: bundler</li>
                  <li>types: [] (empty)</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Build or update your config with the{" "}
              <Link
                href="/tools/tsconfig-builder"
                className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                tsconfig.json Visual Builder
              </Link>
              . All analysis runs client-side &mdash; your config never leaves
              your device.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
