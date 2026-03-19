"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";
import RateLimitBanner from "@/components/RateLimitBanner";

// ── Types ──────────────────────────────────────────────────────────────────

type Target =
  | "ES5"
  | "ES6"
  | "ES2015"
  | "ES2016"
  | "ES2017"
  | "ES2018"
  | "ES2019"
  | "ES2020"
  | "ES2021"
  | "ES2022"
  | "ES2023"
  | "ES2024"
  | "ESNext";

type Module =
  | "CommonJS"
  | "ES6"
  | "ES2015"
  | "ES2020"
  | "ES2022"
  | "ESNext"
  | "Node16"
  | "NodeNext"
  | "Bundler"
  | "Preserve"
  | "None";

type ModuleResolution =
  | "Node"
  | "Node16"
  | "NodeNext"
  | "Bundler"
  | "Classic";

type Jsx =
  | "react"
  | "react-jsx"
  | "react-jsxdev"
  | "preserve"
  | "react-native"
  | "";

interface CompilerOptions {
  // Target & Module
  target: Target;
  module: Module;
  moduleResolution: ModuleResolution;
  lib: string[];
  // Strictness
  strict: boolean;
  noImplicitAny: boolean;
  strictNullChecks: boolean;
  strictFunctionTypes: boolean;
  strictBindCallApply: boolean;
  strictPropertyInitialization: boolean;
  noImplicitThis: boolean;
  alwaysStrict: boolean;
  useUnknownInCatchVariables: boolean;
  noUncheckedIndexedAccess: boolean;
  exactOptionalPropertyTypes: boolean;
  // Emit
  outDir: string;
  declaration: boolean;
  declarationMap: boolean;
  sourceMap: boolean;
  noEmit: boolean;
  removeComments: boolean;
  importHelpers: boolean;
  downlevelIteration: boolean;
  // Interop
  esModuleInterop: boolean;
  allowSyntheticDefaultImports: boolean;
  forceConsistentCasingInFileNames: boolean;
  isolatedModules: boolean;
  verbatimModuleSyntax: boolean;
  allowJs: boolean;
  checkJs: boolean;
  resolveJsonModule: boolean;
  // Type Checking
  skipLibCheck: boolean;
  noUnusedLocals: boolean;
  noUnusedParameters: boolean;
  noImplicitReturns: boolean;
  noFallthroughCasesInSwitch: boolean;
  noPropertyAccessFromIndexSignature: boolean;
  // JSX
  jsx: Jsx;
  jsxImportSource: string;
  // Module Resolution
  baseUrl: string;
  rootDir: string;
  paths: Record<string, string[]>;
  // Project
  composite: boolean;
  incremental: boolean;
}

interface TsconfigState {
  compilerOptions: CompilerOptions;
  include: string[];
  exclude: string[];
  extends: string;
}

// ── Descriptions (tooltips) ────────────────────────────────────────────────

const OPTION_DESCRIPTIONS: Record<string, string> = {
  target: "Set the JavaScript language version for emitted output.",
  module: "Specify what module code is generated.",
  moduleResolution: "Strategy for resolving import specifiers.",
  lib: "Library files to include in the compilation.",
  strict: "Enable all strict type-checking options.",
  noImplicitAny:
    "Error on expressions/declarations with implied 'any' type.",
  strictNullChecks:
    "Include 'null' and 'undefined' in the type system.",
  strictFunctionTypes:
    "Check function parameter types contravariantly.",
  strictBindCallApply:
    "Check that bind, call, apply arguments match the original function.",
  strictPropertyInitialization:
    "Check that class properties are assigned in the constructor.",
  noImplicitThis:
    "Error when 'this' has an implied 'any' type.",
  alwaysStrict:
    "Emit 'use strict' in each source file.",
  useUnknownInCatchVariables:
    "Default catch clause variables to 'unknown' instead of 'any'.",
  noUncheckedIndexedAccess:
    "Add 'undefined' to index signature results.",
  exactOptionalPropertyTypes:
    "Differentiate between undefined and optional properties.",
  outDir: "Output directory for compiled files.",
  declaration: "Generate .d.ts declaration files.",
  declarationMap: "Generate source maps for .d.ts files.",
  sourceMap: "Generate source map files for debugging.",
  noEmit: "Do not emit output (type-checking only).",
  removeComments: "Remove comments from output files.",
  importHelpers:
    "Import helper functions from tslib instead of inlining.",
  downlevelIteration:
    "Emit more compliant, but verbose iteration for ES5/ES3.",
  esModuleInterop:
    "Emit additional JavaScript for CommonJS module interop.",
  allowSyntheticDefaultImports:
    "Allow default imports from modules with no default export.",
  forceConsistentCasingInFileNames:
    "Ensure imports use consistent casing with the file system.",
  isolatedModules:
    "Ensure each file can be safely transpiled in isolation.",
  verbatimModuleSyntax:
    "Do not transform import/export statements.",
  allowJs: "Allow JavaScript files in the project.",
  checkJs: "Type-check JavaScript files.",
  resolveJsonModule: "Allow importing .json files.",
  skipLibCheck: "Skip type checking of declaration (.d.ts) files.",
  noUnusedLocals: "Error on unused local variables.",
  noUnusedParameters: "Error on unused function parameters.",
  noImplicitReturns:
    "Error when not all code paths return a value.",
  noFallthroughCasesInSwitch:
    "Error for fallthrough cases in switch statements.",
  noPropertyAccessFromIndexSignature:
    "Require bracket notation for index signature properties.",
  jsx: "Control how JSX is emitted.",
  jsxImportSource:
    "Module specifier for importing JSX factory functions.",
  baseUrl: "Base directory for resolving non-relative module names.",
  rootDir: "Root directory of source files.",
  composite:
    "Enable constraints for project references.",
  incremental: "Save .tsbuildinfo for faster subsequent builds.",
};

// ── Lib options ────────────────────────────────────────────────────────────

const LIB_OPTIONS = [
  "ES5",
  "ES6",
  "ES2015",
  "ES2016",
  "ES2017",
  "ES2018",
  "ES2019",
  "ES2020",
  "ES2021",
  "ES2022",
  "ES2023",
  "ES2024",
  "ESNext",
  "DOM",
  "DOM.Iterable",
  "DOM.AsyncIterable",
  "WebWorker",
  "ScriptHost",
];

// ── Presets ─────────────────────────────────────────────────────────────────

interface Preset {
  name: string;
  description: string;
  state: TsconfigState;
}

const DEFAULT_OPTIONS: CompilerOptions = {
  target: "ES2020",
  module: "ESNext",
  moduleResolution: "Bundler",
  lib: [],
  strict: true,
  noImplicitAny: false,
  strictNullChecks: false,
  strictFunctionTypes: false,
  strictBindCallApply: false,
  strictPropertyInitialization: false,
  noImplicitThis: false,
  alwaysStrict: false,
  useUnknownInCatchVariables: false,
  noUncheckedIndexedAccess: false,
  exactOptionalPropertyTypes: false,
  outDir: "",
  declaration: false,
  declarationMap: false,
  sourceMap: false,
  noEmit: false,
  removeComments: false,
  importHelpers: false,
  downlevelIteration: false,
  esModuleInterop: true,
  allowSyntheticDefaultImports: false,
  forceConsistentCasingInFileNames: true,
  isolatedModules: false,
  verbatimModuleSyntax: false,
  allowJs: false,
  checkJs: false,
  resolveJsonModule: false,
  skipLibCheck: true,
  noUnusedLocals: false,
  noUnusedParameters: false,
  noImplicitReturns: false,
  noFallthroughCasesInSwitch: false,
  noPropertyAccessFromIndexSignature: false,
  jsx: "",
  jsxImportSource: "",
  baseUrl: "",
  rootDir: "",
  paths: {},
  composite: false,
  incremental: false,
};

const PRESETS: Preset[] = [
  {
    name: "Next.js (App Router)",
    description: "Recommended for Next.js 13+ with App Router",
    state: {
      compilerOptions: {
        ...DEFAULT_OPTIONS,
        target: "ES2017",
        module: "ESNext",
        moduleResolution: "Bundler",
        lib: ["DOM", "DOM.Iterable", "ESNext"],
        strict: true,
        noEmit: true,
        esModuleInterop: true,
        isolatedModules: true,
        jsx: "preserve",
        incremental: true,
        skipLibCheck: true,
        allowJs: true,
        resolveJsonModule: true,
        forceConsistentCasingInFileNames: true,
        paths: { "@/*": ["./src/*"] },
      },
      include: [
        "next-env.d.ts",
        "**/*.ts",
        "**/*.tsx",
        ".next/types/**/*.ts",
      ],
      exclude: ["node_modules"],
      extends: "",
    },
  },
  {
    name: "React SPA (Vite)",
    description: "Vite + React project with SWC/esbuild",
    state: {
      compilerOptions: {
        ...DEFAULT_OPTIONS,
        target: "ES2020",
        module: "ESNext",
        moduleResolution: "Bundler",
        lib: ["ES2020", "DOM", "DOM.Iterable"],
        strict: true,
        noEmit: true,
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        forceConsistentCasingInFileNames: true,
        isolatedModules: true,
        jsx: "react-jsx",
        resolveJsonModule: true,
        skipLibCheck: true,
      },
      include: ["src"],
      exclude: ["node_modules"],
      extends: "",
    },
  },
  {
    name: "Node.js (ESM)",
    description: "Modern Node.js with ES Modules",
    state: {
      compilerOptions: {
        ...DEFAULT_OPTIONS,
        target: "ES2022",
        module: "Node16",
        moduleResolution: "Node16",
        lib: ["ES2022"],
        strict: true,
        esModuleInterop: true,
        forceConsistentCasingInFileNames: true,
        skipLibCheck: true,
        outDir: "./dist",
        declaration: true,
        sourceMap: true,
        resolveJsonModule: true,
      },
      include: ["src"],
      exclude: ["node_modules", "dist"],
      extends: "",
    },
  },
  {
    name: "Node.js (CommonJS)",
    description: "Traditional Node.js with require()",
    state: {
      compilerOptions: {
        ...DEFAULT_OPTIONS,
        target: "ES2020",
        module: "CommonJS",
        moduleResolution: "Node",
        lib: ["ES2020"],
        strict: true,
        esModuleInterop: true,
        forceConsistentCasingInFileNames: true,
        skipLibCheck: true,
        outDir: "./dist",
        declaration: true,
        sourceMap: true,
        resolveJsonModule: true,
      },
      include: ["src"],
      exclude: ["node_modules", "dist"],
      extends: "",
    },
  },
  {
    name: "Library (npm)",
    description: "For publishing npm packages with types",
    state: {
      compilerOptions: {
        ...DEFAULT_OPTIONS,
        target: "ES2020",
        module: "ESNext",
        moduleResolution: "Bundler",
        lib: ["ES2020"],
        strict: true,
        esModuleInterop: true,
        forceConsistentCasingInFileNames: true,
        skipLibCheck: true,
        outDir: "./dist",
        declaration: true,
        declarationMap: true,
        sourceMap: true,
        composite: true,
        isolatedModules: true,
        verbatimModuleSyntax: true,
      },
      include: ["src"],
      exclude: ["node_modules", "dist"],
      extends: "",
    },
  },
  {
    name: "Strict Maximum",
    description: "All strict + additional type-checking flags",
    state: {
      compilerOptions: {
        ...DEFAULT_OPTIONS,
        target: "ES2022",
        module: "ESNext",
        moduleResolution: "Bundler",
        lib: ["ES2022"],
        strict: true,
        noUncheckedIndexedAccess: true,
        exactOptionalPropertyTypes: true,
        noUnusedLocals: true,
        noUnusedParameters: true,
        noImplicitReturns: true,
        noFallthroughCasesInSwitch: true,
        noPropertyAccessFromIndexSignature: true,
        esModuleInterop: true,
        forceConsistentCasingInFileNames: true,
        isolatedModules: true,
        skipLibCheck: true,
        noEmit: true,
        declaration: true,
        sourceMap: true,
        verbatimModuleSyntax: true,
      },
      include: ["src"],
      exclude: ["node_modules"],
      extends: "",
    },
  },
];

// ── Helpers ─────────────────────────────────────────────────────────────────

function buildTsconfigJson(state: TsconfigState): string {
  const config: Record<string, unknown> = {};

  if (state.extends) {
    config.extends = state.extends;
  }

  const co: Record<string, unknown> = {};
  const opts = state.compilerOptions;

  // Target & Module
  co.target = opts.target;
  co.module = opts.module;
  co.moduleResolution = opts.moduleResolution;
  if (opts.lib.length > 0) co.lib = opts.lib;

  // JSX
  if (opts.jsx) co.jsx = opts.jsx;
  if (opts.jsxImportSource) co.jsxImportSource = opts.jsxImportSource;

  // Module Resolution
  if (opts.baseUrl) co.baseUrl = opts.baseUrl;
  if (opts.rootDir) co.rootDir = opts.rootDir;
  if (Object.keys(opts.paths).length > 0) co.paths = opts.paths;
  if (opts.resolveJsonModule) co.resolveJsonModule = true;

  // Strictness
  if (opts.strict) co.strict = true;
  // Only emit individual strict flags if strict is off OR if they differ from what strict enables
  if (!opts.strict) {
    if (opts.noImplicitAny) co.noImplicitAny = true;
    if (opts.strictNullChecks) co.strictNullChecks = true;
    if (opts.strictFunctionTypes) co.strictFunctionTypes = true;
    if (opts.strictBindCallApply) co.strictBindCallApply = true;
    if (opts.strictPropertyInitialization)
      co.strictPropertyInitialization = true;
    if (opts.noImplicitThis) co.noImplicitThis = true;
    if (opts.alwaysStrict) co.alwaysStrict = true;
    if (opts.useUnknownInCatchVariables)
      co.useUnknownInCatchVariables = true;
  }
  // These are NOT included in strict, always emit if enabled
  if (opts.noUncheckedIndexedAccess) co.noUncheckedIndexedAccess = true;
  if (opts.exactOptionalPropertyTypes)
    co.exactOptionalPropertyTypes = true;

  // Emit
  if (opts.outDir) co.outDir = opts.outDir;
  if (opts.declaration) co.declaration = true;
  if (opts.declarationMap) co.declarationMap = true;
  if (opts.sourceMap) co.sourceMap = true;
  if (opts.noEmit) co.noEmit = true;
  if (opts.removeComments) co.removeComments = true;
  if (opts.importHelpers) co.importHelpers = true;
  if (opts.downlevelIteration) co.downlevelIteration = true;

  // Interop
  if (opts.esModuleInterop) co.esModuleInterop = true;
  if (opts.allowSyntheticDefaultImports)
    co.allowSyntheticDefaultImports = true;
  if (opts.forceConsistentCasingInFileNames)
    co.forceConsistentCasingInFileNames = true;
  if (opts.isolatedModules) co.isolatedModules = true;
  if (opts.verbatimModuleSyntax) co.verbatimModuleSyntax = true;
  if (opts.allowJs) co.allowJs = true;
  if (opts.checkJs) co.checkJs = true;

  // Type Checking
  if (opts.skipLibCheck) co.skipLibCheck = true;
  if (opts.noUnusedLocals) co.noUnusedLocals = true;
  if (opts.noUnusedParameters) co.noUnusedParameters = true;
  if (opts.noImplicitReturns) co.noImplicitReturns = true;
  if (opts.noFallthroughCasesInSwitch)
    co.noFallthroughCasesInSwitch = true;
  if (opts.noPropertyAccessFromIndexSignature)
    co.noPropertyAccessFromIndexSignature = true;

  // Project
  if (opts.composite) co.composite = true;
  if (opts.incremental) co.incremental = true;

  config.compilerOptions = co;

  if (state.include.length > 0) config.include = state.include;
  if (state.exclude.length > 0) config.exclude = state.exclude;

  return JSON.stringify(config, null, 2);
}

// ── Components ──────────────────────────────────────────────────────────────

function SectionHeader({
  title,
  open,
  onToggle,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="flex w-full items-center justify-between rounded-lg bg-gray-100 px-4 py-3 text-left font-semibold text-gray-900 transition hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
    >
      {title}
      <span className="text-gray-500 dark:text-gray-400">
        {open ? "−" : "+"}
      </span>
    </button>
  );
}

function BoolOption({
  label,
  checked,
  onChange,
  description,
  disabled,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  description?: string;
  disabled?: boolean;
}) {
  return (
    <label
      className={`flex items-start gap-3 rounded-lg px-3 py-2 transition hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
        disabled ? "opacity-50" : "cursor-pointer"
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
      />
      <div className="min-w-0 flex-1">
        <span className="font-mono text-sm text-gray-900 dark:text-gray-100">
          {label}
        </span>
        {description && (
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            {description}
          </p>
        )}
      </div>
    </label>
  );
}

function SelectOption({
  label,
  value,
  options,
  onChange,
  description,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  description?: string;
}) {
  const selectClass =
    "rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm font-mono text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100";
  return (
    <div className="flex items-start gap-3 rounded-lg px-3 py-2">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm text-gray-900 dark:text-gray-100 shrink-0">
            {label}
          </span>
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={selectClass}
          >
            {options.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>
        {description && (
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

function TextOption({
  label,
  value,
  onChange,
  placeholder,
  description,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  description?: string;
}) {
  const inputClass =
    "rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm font-mono text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 w-48";
  return (
    <div className="flex items-start gap-3 rounded-lg px-3 py-2">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm text-gray-900 dark:text-gray-100 shrink-0">
            {label}
          </span>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={inputClass}
          />
        </div>
        {description && (
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

function ArrayEditor({
  label,
  items,
  onChange,
  placeholder,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}) {
  const [newItem, setNewItem] = useState("");
  const addItem = () => {
    const v = newItem.trim();
    if (v && !items.includes(v)) {
      onChange([...items, v]);
      setNewItem("");
    }
  };
  return (
    <div className="px-3 py-2">
      <span className="font-mono text-sm text-gray-900 dark:text-gray-100">
        {label}
      </span>
      <div className="mt-2 flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-mono text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
          >
            {item}
            <button
              onClick={() => onChange(items.filter((i) => i !== item))}
              className="ml-0.5 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
            >
              x
            </button>
          </span>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addItem();
            }
          }}
          placeholder={placeholder}
          className="rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm font-mono text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 flex-1"
        />
        <button
          onClick={addItem}
          className="rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
        >
          Add
        </button>
      </div>
    </div>
  );
}

function PathsEditor({
  paths,
  onChange,
}: {
  paths: Record<string, string[]>;
  onChange: (paths: Record<string, string[]>) => void;
}) {
  const [newAlias, setNewAlias] = useState("");
  const [newPath, setNewPath] = useState("");

  const addPath = () => {
    const alias = newAlias.trim();
    const path = newPath.trim();
    if (alias && path) {
      const updated = { ...paths };
      if (updated[alias]) {
        if (!updated[alias].includes(path)) {
          updated[alias] = [...updated[alias], path];
        }
      } else {
        updated[alias] = [path];
      }
      onChange(updated);
      setNewAlias("");
      setNewPath("");
    }
  };

  const entries = Object.entries(paths);

  return (
    <div className="px-3 py-2">
      <span className="font-mono text-sm text-gray-900 dark:text-gray-100">
        paths
      </span>
      <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
        Path aliases for module resolution (requires baseUrl or relative
        paths).
      </p>
      {entries.length > 0 && (
        <div className="mt-2 space-y-1">
          {entries.map(([alias, targets]) => (
            <div
              key={alias}
              className="flex items-center gap-2 rounded bg-gray-50 px-2 py-1 dark:bg-gray-800/50"
            >
              <span className="font-mono text-xs text-blue-700 dark:text-blue-400">
                {alias}
              </span>
              <span className="text-xs text-gray-400">→</span>
              <span className="font-mono text-xs text-gray-700 dark:text-gray-300">
                {targets.join(", ")}
              </span>
              <button
                onClick={() => {
                  const updated = { ...paths };
                  delete updated[alias];
                  onChange(updated);
                }}
                className="ml-auto text-xs text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="mt-2 flex gap-2">
        <input
          type="text"
          value={newAlias}
          onChange={(e) => setNewAlias(e.target.value)}
          placeholder="@/* or @components/*"
          className="rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm font-mono text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 w-40"
        />
        <span className="self-center text-sm text-gray-400">→</span>
        <input
          type="text"
          value={newPath}
          onChange={(e) => setNewPath(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addPath();
            }
          }}
          placeholder="./src/*"
          className="rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm font-mono text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 w-40"
        />
        <button
          onClick={addPath}
          className="rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
        >
          Add
        </button>
      </div>
    </div>
  );
}

function LibSelector({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (libs: string[]) => void;
}) {
  const toggle = (lib: string) => {
    if (selected.includes(lib)) {
      onChange(selected.filter((l) => l !== lib));
    } else {
      onChange([...selected, lib]);
    }
  };

  return (
    <div className="px-3 py-2">
      <span className="font-mono text-sm text-gray-900 dark:text-gray-100">
        lib
      </span>
      <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
        {OPTION_DESCRIPTIONS.lib}
      </p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {LIB_OPTIONS.map((lib) => (
          <button
            key={lib}
            onClick={() => toggle(lib)}
            className={`rounded-md border px-2 py-1 text-xs font-mono transition ${
              selected.includes(lib)
                ? "border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-900/30 dark:text-blue-300"
                : "border-gray-300 bg-white text-gray-600 hover:border-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:border-gray-500"
            }`}
          >
            {lib}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────

export default function TsconfigBuilderTool() {
  const { remaining, dailyLimit, isLimited, recordUsage } =
    useRateLimit("tsconfig-builder");
  const { trackAction } = useToolAnalytics("tsconfig-builder");

  const [state, setState] = useState<TsconfigState>({
    compilerOptions: { ...DEFAULT_OPTIONS },
    include: ["src"],
    exclude: ["node_modules"],
    extends: "",
  });

  const [copied, setCopied] = useState(false);
  const [activePreset, setActivePreset] = useState("");

  // Section toggles
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    "Target & Module": true,
    Strictness: true,
    Emit: false,
    Interop: false,
    "Type Checking": false,
    JSX: false,
    "Module Resolution": false,
    Project: false,
    "Include / Exclude": true,
  });

  const toggleSection = useCallback((section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  }, []);

  const output = useMemo(() => buildTsconfigJson(state), [state]);

  const updateOption = useCallback(
    <K extends keyof CompilerOptions>(key: K, value: CompilerOptions[K]) => {
      setState((prev) => ({
        ...prev,
        compilerOptions: { ...prev.compilerOptions, [key]: value },
      }));
      setActivePreset("");
    },
    [],
  );

  const applyPreset = useCallback(
    (preset: Preset) => {
      if (isLimited) return;
      setState({
        compilerOptions: { ...preset.state.compilerOptions },
        include: [...preset.state.include],
        exclude: [...preset.state.exclude],
        extends: preset.state.extends,
      });
      setActivePreset(preset.name);
      recordUsage();
      trackAction("apply-preset");
    },
    [isLimited, recordUsage, trackAction],
  );

  const handleCopy = useCallback(async () => {
    if (isLimited) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      recordUsage();
      trackAction("copy");
    } catch {
      // fallback
    }
  }, [output, isLimited, recordUsage, trackAction]);

  const handleDownload = useCallback(() => {
    if (isLimited) return;
    const blob = new Blob([output], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tsconfig.json";
    a.click();
    URL.revokeObjectURL(url);
    recordUsage();
    trackAction("download");
  }, [output, isLimited, recordUsage, trackAction]);

  useKeyboardShortcut("Enter", handleCopy);

  const opts = state.compilerOptions;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link
          href="/"
          className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          ← Back to all tools
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          tsconfig.json Visual Builder
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Build your TypeScript configuration visually with explanations for
          every option. Start from a preset or customize from scratch.
        </p>
      </div>

      <RateLimitBanner remaining={remaining} dailyLimit={dailyLimit} isLimited={isLimited} />

      {/* Presets */}
      <div className="mb-8">
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
          Presets
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset)}
              className={`rounded-lg border p-3 text-left transition ${
                activePreset === preset.name
                  ? "border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20"
                  : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/50 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-600 dark:hover:bg-blue-900/10"
              }`}
            >
              <span
                className={`text-sm font-medium ${
                  activePreset === preset.name
                    ? "text-blue-700 dark:text-blue-300"
                    : "text-gray-900 dark:text-gray-100"
                }`}
              >
                {preset.name}
              </span>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {preset.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left: Options */}
        <div className="space-y-3">
          {/* Target & Module */}
          <div>
            <SectionHeader
              title="Target & Module"
              open={openSections["Target & Module"]}
              onToggle={() => toggleSection("Target & Module")}
            />
            {openSections["Target & Module"] && (
              <div className="mt-2 space-y-1 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                <SelectOption
                  label="target"
                  value={opts.target}
                  options={[
                    "ES5",
                    "ES6",
                    "ES2015",
                    "ES2016",
                    "ES2017",
                    "ES2018",
                    "ES2019",
                    "ES2020",
                    "ES2021",
                    "ES2022",
                    "ES2023",
                    "ES2024",
                    "ESNext",
                  ]}
                  onChange={(v) => updateOption("target", v as Target)}
                  description={OPTION_DESCRIPTIONS.target}
                />
                <SelectOption
                  label="module"
                  value={opts.module}
                  options={[
                    "CommonJS",
                    "ES6",
                    "ES2015",
                    "ES2020",
                    "ES2022",
                    "ESNext",
                    "Node16",
                    "NodeNext",
                    "Bundler",
                    "Preserve",
                    "None",
                  ]}
                  onChange={(v) => updateOption("module", v as Module)}
                  description={OPTION_DESCRIPTIONS.module}
                />
                <SelectOption
                  label="moduleResolution"
                  value={opts.moduleResolution}
                  options={[
                    "Node",
                    "Node16",
                    "NodeNext",
                    "Bundler",
                    "Classic",
                  ]}
                  onChange={(v) =>
                    updateOption("moduleResolution", v as ModuleResolution)
                  }
                  description={OPTION_DESCRIPTIONS.moduleResolution}
                />
                <LibSelector
                  selected={opts.lib}
                  onChange={(libs) => updateOption("lib", libs)}
                />
              </div>
            )}
          </div>

          {/* Strictness */}
          <div>
            <SectionHeader
              title="Strictness"
              open={openSections["Strictness"]}
              onToggle={() => toggleSection("Strictness")}
            />
            {openSections["Strictness"] && (
              <div className="mt-2 space-y-0.5 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                <BoolOption
                  label="strict"
                  checked={opts.strict}
                  onChange={(v) => updateOption("strict", v)}
                  description={OPTION_DESCRIPTIONS.strict}
                />
                {opts.strict && (
                  <p className="px-3 text-xs text-green-600 dark:text-green-400">
                    Enables: noImplicitAny, strictNullChecks,
                    strictFunctionTypes, strictBindCallApply,
                    strictPropertyInitialization, noImplicitThis,
                    alwaysStrict, useUnknownInCatchVariables
                  </p>
                )}
                {!opts.strict && (
                  <>
                    <BoolOption
                      label="noImplicitAny"
                      checked={opts.noImplicitAny}
                      onChange={(v) => updateOption("noImplicitAny", v)}
                      description={OPTION_DESCRIPTIONS.noImplicitAny}
                    />
                    <BoolOption
                      label="strictNullChecks"
                      checked={opts.strictNullChecks}
                      onChange={(v) => updateOption("strictNullChecks", v)}
                      description={OPTION_DESCRIPTIONS.strictNullChecks}
                    />
                    <BoolOption
                      label="strictFunctionTypes"
                      checked={opts.strictFunctionTypes}
                      onChange={(v) => updateOption("strictFunctionTypes", v)}
                      description={OPTION_DESCRIPTIONS.strictFunctionTypes}
                    />
                    <BoolOption
                      label="strictBindCallApply"
                      checked={opts.strictBindCallApply}
                      onChange={(v) => updateOption("strictBindCallApply", v)}
                      description={OPTION_DESCRIPTIONS.strictBindCallApply}
                    />
                    <BoolOption
                      label="strictPropertyInitialization"
                      checked={opts.strictPropertyInitialization}
                      onChange={(v) =>
                        updateOption("strictPropertyInitialization", v)
                      }
                      description={
                        OPTION_DESCRIPTIONS.strictPropertyInitialization
                      }
                    />
                    <BoolOption
                      label="noImplicitThis"
                      checked={opts.noImplicitThis}
                      onChange={(v) => updateOption("noImplicitThis", v)}
                      description={OPTION_DESCRIPTIONS.noImplicitThis}
                    />
                    <BoolOption
                      label="alwaysStrict"
                      checked={opts.alwaysStrict}
                      onChange={(v) => updateOption("alwaysStrict", v)}
                      description={OPTION_DESCRIPTIONS.alwaysStrict}
                    />
                    <BoolOption
                      label="useUnknownInCatchVariables"
                      checked={opts.useUnknownInCatchVariables}
                      onChange={(v) =>
                        updateOption("useUnknownInCatchVariables", v)
                      }
                      description={
                        OPTION_DESCRIPTIONS.useUnknownInCatchVariables
                      }
                    />
                  </>
                )}
                <hr className="my-2 border-gray-200 dark:border-gray-700" />
                <p className="px-3 text-xs font-medium text-gray-500 dark:text-gray-400">
                  Additional (not included in strict)
                </p>
                <BoolOption
                  label="noUncheckedIndexedAccess"
                  checked={opts.noUncheckedIndexedAccess}
                  onChange={(v) => updateOption("noUncheckedIndexedAccess", v)}
                  description={OPTION_DESCRIPTIONS.noUncheckedIndexedAccess}
                />
                <BoolOption
                  label="exactOptionalPropertyTypes"
                  checked={opts.exactOptionalPropertyTypes}
                  onChange={(v) =>
                    updateOption("exactOptionalPropertyTypes", v)
                  }
                  description={OPTION_DESCRIPTIONS.exactOptionalPropertyTypes}
                />
              </div>
            )}
          </div>

          {/* Emit */}
          <div>
            <SectionHeader
              title="Emit"
              open={openSections["Emit"]}
              onToggle={() => toggleSection("Emit")}
            />
            {openSections["Emit"] && (
              <div className="mt-2 space-y-0.5 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                <TextOption
                  label="outDir"
                  value={opts.outDir}
                  onChange={(v) => updateOption("outDir", v)}
                  placeholder="./dist"
                  description={OPTION_DESCRIPTIONS.outDir}
                />
                <BoolOption
                  label="declaration"
                  checked={opts.declaration}
                  onChange={(v) => updateOption("declaration", v)}
                  description={OPTION_DESCRIPTIONS.declaration}
                />
                <BoolOption
                  label="declarationMap"
                  checked={opts.declarationMap}
                  onChange={(v) => updateOption("declarationMap", v)}
                  description={OPTION_DESCRIPTIONS.declarationMap}
                />
                <BoolOption
                  label="sourceMap"
                  checked={opts.sourceMap}
                  onChange={(v) => updateOption("sourceMap", v)}
                  description={OPTION_DESCRIPTIONS.sourceMap}
                />
                <BoolOption
                  label="noEmit"
                  checked={opts.noEmit}
                  onChange={(v) => updateOption("noEmit", v)}
                  description={OPTION_DESCRIPTIONS.noEmit}
                />
                <BoolOption
                  label="removeComments"
                  checked={opts.removeComments}
                  onChange={(v) => updateOption("removeComments", v)}
                  description={OPTION_DESCRIPTIONS.removeComments}
                />
                <BoolOption
                  label="importHelpers"
                  checked={opts.importHelpers}
                  onChange={(v) => updateOption("importHelpers", v)}
                  description={OPTION_DESCRIPTIONS.importHelpers}
                />
                <BoolOption
                  label="downlevelIteration"
                  checked={opts.downlevelIteration}
                  onChange={(v) => updateOption("downlevelIteration", v)}
                  description={OPTION_DESCRIPTIONS.downlevelIteration}
                />
              </div>
            )}
          </div>

          {/* Interop */}
          <div>
            <SectionHeader
              title="Interop"
              open={openSections["Interop"]}
              onToggle={() => toggleSection("Interop")}
            />
            {openSections["Interop"] && (
              <div className="mt-2 space-y-0.5 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                <BoolOption
                  label="esModuleInterop"
                  checked={opts.esModuleInterop}
                  onChange={(v) => updateOption("esModuleInterop", v)}
                  description={OPTION_DESCRIPTIONS.esModuleInterop}
                />
                <BoolOption
                  label="allowSyntheticDefaultImports"
                  checked={opts.allowSyntheticDefaultImports}
                  onChange={(v) =>
                    updateOption("allowSyntheticDefaultImports", v)
                  }
                  description={
                    OPTION_DESCRIPTIONS.allowSyntheticDefaultImports
                  }
                />
                <BoolOption
                  label="forceConsistentCasingInFileNames"
                  checked={opts.forceConsistentCasingInFileNames}
                  onChange={(v) =>
                    updateOption("forceConsistentCasingInFileNames", v)
                  }
                  description={
                    OPTION_DESCRIPTIONS.forceConsistentCasingInFileNames
                  }
                />
                <BoolOption
                  label="isolatedModules"
                  checked={opts.isolatedModules}
                  onChange={(v) => updateOption("isolatedModules", v)}
                  description={OPTION_DESCRIPTIONS.isolatedModules}
                />
                <BoolOption
                  label="verbatimModuleSyntax"
                  checked={opts.verbatimModuleSyntax}
                  onChange={(v) => updateOption("verbatimModuleSyntax", v)}
                  description={OPTION_DESCRIPTIONS.verbatimModuleSyntax}
                />
                <BoolOption
                  label="allowJs"
                  checked={opts.allowJs}
                  onChange={(v) => updateOption("allowJs", v)}
                  description={OPTION_DESCRIPTIONS.allowJs}
                />
                <BoolOption
                  label="checkJs"
                  checked={opts.checkJs}
                  onChange={(v) => updateOption("checkJs", v)}
                  description={OPTION_DESCRIPTIONS.checkJs}
                />
                <BoolOption
                  label="resolveJsonModule"
                  checked={opts.resolveJsonModule}
                  onChange={(v) => updateOption("resolveJsonModule", v)}
                  description={OPTION_DESCRIPTIONS.resolveJsonModule}
                />
              </div>
            )}
          </div>

          {/* Type Checking */}
          <div>
            <SectionHeader
              title="Type Checking"
              open={openSections["Type Checking"]}
              onToggle={() => toggleSection("Type Checking")}
            />
            {openSections["Type Checking"] && (
              <div className="mt-2 space-y-0.5 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                <BoolOption
                  label="skipLibCheck"
                  checked={opts.skipLibCheck}
                  onChange={(v) => updateOption("skipLibCheck", v)}
                  description={OPTION_DESCRIPTIONS.skipLibCheck}
                />
                <BoolOption
                  label="noUnusedLocals"
                  checked={opts.noUnusedLocals}
                  onChange={(v) => updateOption("noUnusedLocals", v)}
                  description={OPTION_DESCRIPTIONS.noUnusedLocals}
                />
                <BoolOption
                  label="noUnusedParameters"
                  checked={opts.noUnusedParameters}
                  onChange={(v) => updateOption("noUnusedParameters", v)}
                  description={OPTION_DESCRIPTIONS.noUnusedParameters}
                />
                <BoolOption
                  label="noImplicitReturns"
                  checked={opts.noImplicitReturns}
                  onChange={(v) => updateOption("noImplicitReturns", v)}
                  description={OPTION_DESCRIPTIONS.noImplicitReturns}
                />
                <BoolOption
                  label="noFallthroughCasesInSwitch"
                  checked={opts.noFallthroughCasesInSwitch}
                  onChange={(v) =>
                    updateOption("noFallthroughCasesInSwitch", v)
                  }
                  description={
                    OPTION_DESCRIPTIONS.noFallthroughCasesInSwitch
                  }
                />
                <BoolOption
                  label="noPropertyAccessFromIndexSignature"
                  checked={opts.noPropertyAccessFromIndexSignature}
                  onChange={(v) =>
                    updateOption("noPropertyAccessFromIndexSignature", v)
                  }
                  description={
                    OPTION_DESCRIPTIONS.noPropertyAccessFromIndexSignature
                  }
                />
              </div>
            )}
          </div>

          {/* JSX */}
          <div>
            <SectionHeader
              title="JSX"
              open={openSections["JSX"]}
              onToggle={() => toggleSection("JSX")}
            />
            {openSections["JSX"] && (
              <div className="mt-2 space-y-0.5 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                <SelectOption
                  label="jsx"
                  value={opts.jsx}
                  options={[
                    "",
                    "react",
                    "react-jsx",
                    "react-jsxdev",
                    "preserve",
                    "react-native",
                  ]}
                  onChange={(v) => updateOption("jsx", v as Jsx)}
                  description={OPTION_DESCRIPTIONS.jsx}
                />
                <TextOption
                  label="jsxImportSource"
                  value={opts.jsxImportSource}
                  onChange={(v) => updateOption("jsxImportSource", v)}
                  placeholder="react"
                  description={OPTION_DESCRIPTIONS.jsxImportSource}
                />
              </div>
            )}
          </div>

          {/* Module Resolution */}
          <div>
            <SectionHeader
              title="Module Resolution"
              open={openSections["Module Resolution"]}
              onToggle={() => toggleSection("Module Resolution")}
            />
            {openSections["Module Resolution"] && (
              <div className="mt-2 space-y-0.5 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                <TextOption
                  label="baseUrl"
                  value={opts.baseUrl}
                  onChange={(v) => updateOption("baseUrl", v)}
                  placeholder="./"
                  description={OPTION_DESCRIPTIONS.baseUrl}
                />
                <TextOption
                  label="rootDir"
                  value={opts.rootDir}
                  onChange={(v) => updateOption("rootDir", v)}
                  placeholder="./src"
                  description={OPTION_DESCRIPTIONS.rootDir}
                />
                <PathsEditor
                  paths={opts.paths}
                  onChange={(p) => updateOption("paths", p)}
                />
              </div>
            )}
          </div>

          {/* Project */}
          <div>
            <SectionHeader
              title="Project"
              open={openSections["Project"]}
              onToggle={() => toggleSection("Project")}
            />
            {openSections["Project"] && (
              <div className="mt-2 space-y-0.5 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                <BoolOption
                  label="composite"
                  checked={opts.composite}
                  onChange={(v) => updateOption("composite", v)}
                  description={OPTION_DESCRIPTIONS.composite}
                />
                <BoolOption
                  label="incremental"
                  checked={opts.incremental}
                  onChange={(v) => updateOption("incremental", v)}
                  description={OPTION_DESCRIPTIONS.incremental}
                />
                <TextOption
                  label="extends"
                  value={state.extends}
                  onChange={(v) =>
                    setState((prev) => ({ ...prev, extends: v }))
                  }
                  placeholder="@tsconfig/node20/tsconfig.json"
                  description="Inherit settings from another tsconfig file."
                />
              </div>
            )}
          </div>

          {/* Include / Exclude */}
          <div>
            <SectionHeader
              title="Include / Exclude"
              open={openSections["Include / Exclude"]}
              onToggle={() => toggleSection("Include / Exclude")}
            />
            {openSections["Include / Exclude"] && (
              <div className="mt-2 space-y-2 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                <ArrayEditor
                  label="include"
                  items={state.include}
                  onChange={(items) =>
                    setState((prev) => ({ ...prev, include: items }))
                  }
                  placeholder="src, **/*.ts"
                />
                <ArrayEditor
                  label="exclude"
                  items={state.exclude}
                  onChange={(items) =>
                    setState((prev) => ({ ...prev, exclude: items }))
                  }
                  placeholder="node_modules, dist"
                />
              </div>
            )}
          </div>
        </div>

        {/* Right: Output */}
        <div className="lg:sticky lg:top-4 lg:self-start">
          <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700">
              <span className="font-mono text-sm font-medium text-gray-700 dark:text-gray-300">
                tsconfig.json
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  disabled={isLimited}
                  className="rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
                <button
                  onClick={handleDownload}
                  disabled={isLimited}
                  className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 disabled:opacity-50"
                >
                  Download
                </button>
              </div>
            </div>
            <pre className="max-h-[80vh] overflow-auto p-4 text-sm font-mono text-gray-800 dark:text-gray-200 whitespace-pre">
              {output}
            </pre>
          </div>

          {/* Quick Stats */}
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="rounded-lg border border-gray-200 p-3 text-center dark:border-gray-700">
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {Object.keys(JSON.parse(output).compilerOptions || {}).length}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Options set
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 p-3 text-center dark:border-gray-700">
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {opts.strict ? "ON" : "OFF"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Strict mode
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 p-3 text-center dark:border-gray-700">
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {output.length}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Bytes
              </p>
            </div>
          </div>

          {/* Keyboard shortcut hint */}
          <p className="mt-3 text-center text-xs text-gray-400 dark:text-gray-500">
            Press{" "}
            <kbd className="rounded border border-gray-300 bg-gray-100 px-1.5 py-0.5 text-xs dark:border-gray-600 dark:bg-gray-800">
              Ctrl+Enter
            </kbd>{" "}
            to copy
          </p>

          {/* Related links */}
          <div className="mt-6 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Related Tools
            </h3>
            <div className="mt-2 space-y-1">
              <Link
                href="/tools/json-formatter"
                className="block text-sm text-blue-600 hover:underline dark:text-blue-400"
              >
                JSON Formatter — validate your tsconfig.json
              </Link>
              <Link
                href="/tools/js-playground"
                className="block text-sm text-blue-600 hover:underline dark:text-blue-400"
              >
                JS/TS Playground — test TypeScript code
              </Link>
              <Link
                href="/tools/json-to-code"
                className="block text-sm text-blue-600 hover:underline dark:text-blue-400"
              >
                JSON to Code — generate typed code from JSON
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
