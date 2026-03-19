"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import RateLimitBanner from "@/components/RateLimitBanner";

// ── Types ──────────────────────────────────────────────────────────────────

type PackageType = "module" | "commonjs";
type License = "MIT" | "Apache-2.0" | "ISC" | "BSD-3-Clause" | "GPL-3.0-only" | "UNLICENSED" | "";

interface PackageState {
  name: string;
  version: string;
  description: string;
  main: string;
  module: string;
  types: string;
  type: PackageType;
  license: License;
  author: string;
  repository: string;
  keywords: string[];
  scripts: Record<string, string>;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  engines: { node?: string };
  private: boolean;
  files: string[];
  exports: boolean;
  bin: string;
}

interface Preset {
  name: string;
  description: string;
  state: Partial<PackageState>;
}

// ── Presets ─────────────────────────────────────────────────────────────────

const DEFAULT_STATE: PackageState = {
  name: "my-package",
  version: "1.0.0",
  description: "",
  main: "index.js",
  module: "",
  types: "",
  type: "module",
  license: "MIT",
  author: "",
  repository: "",
  keywords: [],
  scripts: {},
  dependencies: {},
  devDependencies: {},
  engines: {},
  private: false,
  files: [],
  exports: false,
  bin: "",
};

const PRESETS: Preset[] = [
  {
    name: "Next.js App",
    description: "Next.js application with TypeScript",
    state: {
      name: "my-nextjs-app",
      version: "0.1.0",
      private: true,
      scripts: {
        dev: "next dev",
        build: "next build",
        start: "next start",
        lint: "next lint",
      },
      dependencies: {
        next: "^15.0.0",
        react: "^19.0.0",
        "react-dom": "^19.0.0",
      },
      devDependencies: {
        typescript: "^5.7.0",
        "@types/node": "^22.0.0",
        "@types/react": "^19.0.0",
        "@types/react-dom": "^19.0.0",
        eslint: "^9.0.0",
        "eslint-config-next": "^15.0.0",
      },
    },
  },
  {
    name: "React + Vite",
    description: "React SPA with Vite",
    state: {
      name: "my-react-app",
      version: "0.1.0",
      private: true,
      type: "module",
      scripts: {
        dev: "vite",
        build: "tsc -b && vite build",
        preview: "vite preview",
        lint: 'eslint "src/**/*.{ts,tsx}"',
      },
      dependencies: {
        react: "^19.0.0",
        "react-dom": "^19.0.0",
      },
      devDependencies: {
        typescript: "^5.7.0",
        vite: "^6.0.0",
        "@vitejs/plugin-react": "^4.0.0",
        "@types/react": "^19.0.0",
        "@types/react-dom": "^19.0.0",
        eslint: "^9.0.0",
      },
    },
  },
  {
    name: "Node.js CLI",
    description: "Command-line tool with TypeScript",
    state: {
      name: "my-cli",
      version: "1.0.0",
      type: "module",
      main: "dist/index.js",
      types: "dist/index.d.ts",
      bin: "dist/cli.js",
      files: ["dist"],
      scripts: {
        build: "tsc",
        dev: "tsx watch src/index.ts",
        start: "node dist/index.js",
        lint: "eslint src/",
        test: "vitest",
        prepublishOnly: "npm run build",
      },
      devDependencies: {
        typescript: "^5.7.0",
        tsx: "^4.0.0",
        vitest: "^3.0.0",
        "@types/node": "^22.0.0",
        eslint: "^9.0.0",
      },
      engines: { node: ">=20.0.0" },
    },
  },
  {
    name: "npm Library",
    description: "Publishable npm package with dual CJS/ESM",
    state: {
      name: "my-library",
      version: "1.0.0",
      type: "module",
      main: "dist/index.cjs",
      module: "dist/index.js",
      types: "dist/index.d.ts",
      exports: true,
      files: ["dist"],
      scripts: {
        build: "tsup src/index.ts --format cjs,esm --dts",
        dev: "tsup src/index.ts --format cjs,esm --dts --watch",
        lint: "eslint src/",
        test: "vitest",
        prepublishOnly: "npm run build",
      },
      devDependencies: {
        typescript: "^5.7.0",
        tsup: "^8.0.0",
        vitest: "^3.0.0",
        eslint: "^9.0.0",
      },
      engines: { node: ">=18.0.0" },
    },
  },
  {
    name: "Express API",
    description: "Express REST API with TypeScript",
    state: {
      name: "my-api",
      version: "1.0.0",
      private: true,
      type: "module",
      main: "dist/index.js",
      scripts: {
        build: "tsc",
        dev: "tsx watch src/index.ts",
        start: "node dist/index.js",
        lint: "eslint src/",
        test: "vitest",
      },
      dependencies: {
        express: "^5.0.0",
        cors: "^2.8.5",
        helmet: "^8.0.0",
        dotenv: "^16.4.0",
      },
      devDependencies: {
        typescript: "^5.7.0",
        tsx: "^4.0.0",
        "@types/node": "^22.0.0",
        "@types/express": "^5.0.0",
        "@types/cors": "^2.8.17",
        vitest: "^3.0.0",
        eslint: "^9.0.0",
      },
      engines: { node: ">=20.0.0" },
    },
  },
  {
    name: "Monorepo Root",
    description: "Turborepo/pnpm workspace root",
    state: {
      name: "my-monorepo",
      version: "0.0.0",
      private: true,
      scripts: {
        build: "turbo build",
        dev: "turbo dev",
        lint: "turbo lint",
        test: "turbo test",
        format: 'prettier --write "**/*.{ts,tsx,md}"',
      },
      devDependencies: {
        turbo: "^2.0.0",
        prettier: "^3.0.0",
      },
    },
  },
  {
    name: "Minimal",
    description: "Bare-bones package.json",
    state: {
      name: "my-package",
      version: "1.0.0",
      description: "",
      main: "index.js",
      type: "module",
      scripts: {},
      dependencies: {},
      devDependencies: {},
      license: "MIT",
    },
  },
];

// ── Build JSON ──────────────────────────────────────────────────────────────

function buildPackageJson(state: PackageState): string {
  const pkg: Record<string, unknown> = {};

  pkg.name = state.name;
  pkg.version = state.version;
  if (state.description) pkg.description = state.description;
  if (state.private) pkg.private = true;
  pkg.type = state.type;
  if (state.main) pkg.main = state.main;
  if (state.module) pkg.module = state.module;
  if (state.types) pkg.types = state.types;

  if (state.exports && state.main) {
    pkg.exports = {
      ".": {
        ...(state.types ? { types: state.types } : {}),
        ...(state.module ? { import: state.module } : {}),
        ...(state.main ? { require: state.main } : {}),
        ...(state.main && !state.module ? { default: state.main } : {}),
      },
    };
  }

  if (state.bin) pkg.bin = state.bin;
  if (state.files.length > 0) pkg.files = state.files;

  if (Object.keys(state.scripts).length > 0) pkg.scripts = state.scripts;
  if (Object.keys(state.dependencies).length > 0) pkg.dependencies = state.dependencies;
  if (Object.keys(state.devDependencies).length > 0) pkg.devDependencies = state.devDependencies;

  if (state.keywords.length > 0) pkg.keywords = state.keywords;
  if (state.author) pkg.author = state.author;
  if (state.license) pkg.license = state.license;
  if (state.repository) pkg.repository = { type: "git", url: state.repository };
  if (state.engines.node) pkg.engines = state.engines;

  return JSON.stringify(pkg, null, 2);
}

// ── Dep editor ──────────────────────────────────────────────────────────────

function DependencyEditor({
  label,
  deps,
  onChange,
}: {
  label: string;
  deps: Record<string, string>;
  onChange: (d: Record<string, string>) => void;
}) {
  const [newName, setNewName] = useState("");
  const [newVersion, setNewVersion] = useState("^1.0.0");

  const addDep = useCallback(() => {
    const name = newName.trim();
    if (!name) return;
    onChange({ ...deps, [name]: newVersion || "*" });
    setNewName("");
    setNewVersion("^1.0.0");
  }, [deps, newName, newVersion, onChange]);

  const removeDep = useCallback(
    (name: string) => {
      const next = { ...deps };
      delete next[name];
      onChange(next);
    },
    [deps, onChange]
  );

  return (
    <div>
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <div className="mt-1 space-y-1">
        {Object.entries(deps).map(([name, version]) => (
          <div
            key={name}
            className="flex items-center gap-2 rounded bg-gray-50 px-2 py-1 text-sm dark:bg-gray-800"
          >
            <span className="flex-1 font-mono text-gray-800 dark:text-gray-200">
              {name}
            </span>
            <span className="font-mono text-gray-500 dark:text-gray-400">
              {version}
            </span>
            <button
              onClick={() => removeDep(name)}
              className="text-red-500 hover:text-red-700 dark:text-red-400"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="package-name"
          onKeyDown={(e) => e.key === "Enter" && addDep()}
          className="flex-1 rounded border border-gray-300 bg-white px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
        />
        <input
          type="text"
          value={newVersion}
          onChange={(e) => setNewVersion(e.target.value)}
          placeholder="^1.0.0"
          onKeyDown={(e) => e.key === "Enter" && addDep()}
          className="w-24 rounded border border-gray-300 bg-white px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
        />
        <button
          onClick={addDep}
          className="rounded bg-blue-600 px-2 py-1 text-sm text-white hover:bg-blue-700"
        >
          Add
        </button>
      </div>
    </div>
  );
}

function ScriptEditor({
  scripts,
  onChange,
}: {
  scripts: Record<string, string>;
  onChange: (s: Record<string, string>) => void;
}) {
  const [newName, setNewName] = useState("");
  const [newCmd, setNewCmd] = useState("");

  const addScript = useCallback(() => {
    const name = newName.trim();
    if (!name) return;
    onChange({ ...scripts, [name]: newCmd });
    setNewName("");
    setNewCmd("");
  }, [scripts, newName, newCmd, onChange]);

  const removeScript = useCallback(
    (name: string) => {
      const next = { ...scripts };
      delete next[name];
      onChange(next);
    },
    [scripts, onChange]
  );

  return (
    <div>
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Scripts
      </label>
      <div className="mt-1 space-y-1">
        {Object.entries(scripts).map(([name, cmd]) => (
          <div
            key={name}
            className="flex items-center gap-2 rounded bg-gray-50 px-2 py-1 text-sm dark:bg-gray-800"
          >
            <span className="w-28 shrink-0 font-mono font-medium text-blue-700 dark:text-blue-400">
              {name}
            </span>
            <span className="flex-1 truncate font-mono text-gray-600 dark:text-gray-400">
              {cmd}
            </span>
            <button
              onClick={() => removeScript(name)}
              className="text-red-500 hover:text-red-700 dark:text-red-400"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="script name"
          onKeyDown={(e) => e.key === "Enter" && addScript()}
          className="w-28 shrink-0 rounded border border-gray-300 bg-white px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
        />
        <input
          type="text"
          value={newCmd}
          onChange={(e) => setNewCmd(e.target.value)}
          placeholder="command"
          onKeyDown={(e) => e.key === "Enter" && addScript()}
          className="flex-1 rounded border border-gray-300 bg-white px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
        />
        <button
          onClick={addScript}
          className="rounded bg-blue-600 px-2 py-1 text-sm text-white hover:bg-blue-700"
        >
          Add
        </button>
      </div>
    </div>
  );
}

function TagEditor({
  label,
  items,
  onChange,
  placeholder,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder: string;
}) {
  const [value, setValue] = useState("");

  const add = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || items.includes(trimmed)) return;
    onChange([...items, trimmed]);
    setValue("");
  }, [items, value, onChange]);

  return (
    <div>
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <div className="mt-1 flex flex-wrap gap-1">
        {items.map((item) => (
          <span
            key={item}
            className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
          >
            {item}
            <button
              onClick={() => onChange(items.filter((i) => i !== item))}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="mt-1 flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          onKeyDown={(e) => e.key === "Enter" && add()}
          className="flex-1 rounded border border-gray-300 bg-white px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
        />
        <button
          onClick={add}
          className="rounded bg-gray-200 px-2 py-1 text-sm text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300"
        >
          Add
        </button>
      </div>
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────

export default function PackageJsonGeneratorTool() {
  useToolAnalytics("package-json-generator");
  const { isLimited, remaining, dailyLimit, recordUsage } = useRateLimit("package-json-generator");

  const [state, setState] = useState<PackageState>({
    ...DEFAULT_STATE,
    ...PRESETS[0].state,
    scripts: { ...DEFAULT_STATE.scripts, ...PRESETS[0].state.scripts },
    dependencies: { ...DEFAULT_STATE.dependencies, ...PRESETS[0].state.dependencies },
    devDependencies: { ...DEFAULT_STATE.devDependencies, ...PRESETS[0].state.devDependencies },
    keywords: [...(PRESETS[0].state.keywords || DEFAULT_STATE.keywords)],
    files: [...(PRESETS[0].state.files || DEFAULT_STATE.files)],
    engines: { ...DEFAULT_STATE.engines, ...PRESETS[0].state.engines },
  });
  const [copied, setCopied] = useState(false);
  const [activePreset, setActivePreset] = useState(PRESETS[0].name);

  const output = useMemo(() => buildPackageJson(state), [state]);

  const handleCopy = useCallback(() => {
    if (isLimited) return;
    recordUsage();
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output, isLimited, recordUsage]);

  const handleDownload = useCallback(() => {
    if (isLimited) return;
    recordUsage();
    const blob = new Blob([output], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "package.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [output, isLimited, recordUsage]);

  useKeyboardShortcut("Enter", handleCopy, { ctrl: true });

  const applyPreset = useCallback((preset: Preset) => {
    setActivePreset(preset.name);
    setState({
      ...DEFAULT_STATE,
      ...preset.state,
      scripts: { ...DEFAULT_STATE.scripts, ...preset.state.scripts },
      dependencies: { ...DEFAULT_STATE.dependencies, ...preset.state.dependencies },
      devDependencies: { ...DEFAULT_STATE.devDependencies, ...preset.state.devDependencies },
      keywords: [...(preset.state.keywords || DEFAULT_STATE.keywords)],
      files: [...(preset.state.files || DEFAULT_STATE.files)],
      engines: { ...DEFAULT_STATE.engines, ...preset.state.engines },
    });
  }, []);

  const updateField = useCallback(
    <K extends keyof PackageState>(key: K, value: PackageState[K]) => {
      setState((prev) => ({ ...prev, [key]: value }));
      setActivePreset("");
    },
    []
  );

  return (
    <div className="mx-auto max-w-6xl">
      <RateLimitBanner remaining={remaining} dailyLimit={dailyLimit} isLimited={isLimited} />

      {/* Presets */}
      <div className="mb-6 flex flex-wrap gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset.name}
            onClick={() => applyPreset(preset)}
            className={`rounded-lg px-3 py-1.5 text-sm transition ${
              activePreset === preset.name
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
            title={preset.description}
          >
            {preset.name}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left: Form */}
        <div className="space-y-4">
          {/* Basic Info */}
          <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">
              Basic Info
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400">
                  name
                </label>
                <input
                  type="text"
                  value={state.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className="mt-0.5 w-full rounded border border-gray-300 bg-white px-2 py-1.5 font-mono text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400">
                  version
                </label>
                <input
                  type="text"
                  value={state.version}
                  onChange={(e) => updateField("version", e.target.value)}
                  className="mt-0.5 w-full rounded border border-gray-300 bg-white px-2 py-1.5 font-mono text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                />
              </div>
            </div>
            <div className="mt-3">
              <label className="text-xs text-gray-500 dark:text-gray-400">
                description
              </label>
              <input
                type="text"
                value={state.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="A brief description of your package"
                className="mt-0.5 w-full rounded border border-gray-300 bg-white px-2 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
              />
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400">
                  author
                </label>
                <input
                  type="text"
                  value={state.author}
                  onChange={(e) => updateField("author", e.target.value)}
                  placeholder="Your Name <email>"
                  className="mt-0.5 w-full rounded border border-gray-300 bg-white px-2 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400">
                  license
                </label>
                <select
                  value={state.license}
                  onChange={(e) =>
                    updateField("license", e.target.value as License)
                  }
                  className="mt-0.5 w-full rounded border border-gray-300 bg-white px-2 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                >
                  <option value="">None</option>
                  <option value="MIT">MIT</option>
                  <option value="Apache-2.0">Apache 2.0</option>
                  <option value="ISC">ISC</option>
                  <option value="BSD-3-Clause">BSD 3-Clause</option>
                  <option value="GPL-3.0-only">GPL 3.0</option>
                  <option value="UNLICENSED">UNLICENSED</option>
                </select>
              </div>
            </div>
            <div className="mt-3">
              <label className="text-xs text-gray-500 dark:text-gray-400">
                repository (git URL)
              </label>
              <input
                type="text"
                value={state.repository}
                onChange={(e) => updateField("repository", e.target.value)}
                placeholder="https://github.com/user/repo.git"
                className="mt-0.5 w-full rounded border border-gray-300 bg-white px-2 py-1.5 font-mono text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
              />
            </div>
            <div className="mt-3 flex flex-wrap gap-3">
              <label className="flex items-center gap-1.5 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={state.private}
                  onChange={(e) => updateField("private", e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-gray-300 text-blue-600 dark:border-gray-600"
                />
                private
              </label>
              <label className="flex items-center gap-1.5 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={state.exports}
                  onChange={(e) => updateField("exports", e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-gray-300 text-blue-600 dark:border-gray-600"
                />
                exports field
              </label>
            </div>
          </div>

          {/* Module Config */}
          <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">
              Module Config
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400">
                  type
                </label>
                <select
                  value={state.type}
                  onChange={(e) =>
                    updateField("type", e.target.value as PackageType)
                  }
                  className="mt-0.5 w-full rounded border border-gray-300 bg-white px-2 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                >
                  <option value="module">module (ESM)</option>
                  <option value="commonjs">commonjs (CJS)</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400">
                  main
                </label>
                <input
                  type="text"
                  value={state.main}
                  onChange={(e) => updateField("main", e.target.value)}
                  placeholder="dist/index.js"
                  className="mt-0.5 w-full rounded border border-gray-300 bg-white px-2 py-1.5 font-mono text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400">
                  module
                </label>
                <input
                  type="text"
                  value={state.module}
                  onChange={(e) => updateField("module", e.target.value)}
                  placeholder="dist/index.mjs"
                  className="mt-0.5 w-full rounded border border-gray-300 bg-white px-2 py-1.5 font-mono text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400">
                  types
                </label>
                <input
                  type="text"
                  value={state.types}
                  onChange={(e) => updateField("types", e.target.value)}
                  placeholder="dist/index.d.ts"
                  className="mt-0.5 w-full rounded border border-gray-300 bg-white px-2 py-1.5 font-mono text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400">
                  bin
                </label>
                <input
                  type="text"
                  value={state.bin}
                  onChange={(e) => updateField("bin", e.target.value)}
                  placeholder="dist/cli.js"
                  className="mt-0.5 w-full rounded border border-gray-300 bg-white px-2 py-1.5 font-mono text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400">
                  engines.node
                </label>
                <input
                  type="text"
                  value={state.engines.node || ""}
                  onChange={(e) =>
                    updateField("engines", {
                      node: e.target.value || undefined,
                    })
                  }
                  placeholder=">=18.0.0"
                  className="mt-0.5 w-full rounded border border-gray-300 bg-white px-2 py-1.5 font-mono text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                />
              </div>
            </div>
          </div>

          {/* Scripts */}
          <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <ScriptEditor
              scripts={state.scripts}
              onChange={(s) => updateField("scripts", s)}
            />
          </div>

          {/* Dependencies */}
          <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <DependencyEditor
              label="dependencies"
              deps={state.dependencies}
              onChange={(d) => updateField("dependencies", d)}
            />
          </div>

          <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <DependencyEditor
              label="devDependencies"
              deps={state.devDependencies}
              onChange={(d) => updateField("devDependencies", d)}
            />
          </div>

          {/* Keywords & Files */}
          <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700 space-y-3">
            <TagEditor
              label="keywords"
              items={state.keywords}
              onChange={(k) => updateField("keywords", k)}
              placeholder="keyword"
            />
            <TagEditor
              label="files"
              items={state.files}
              onChange={(f) => updateField("files", f)}
              placeholder="dist"
            />
          </div>
        </div>

        {/* Right: Output */}
        <div className="lg:sticky lg:top-4 lg:self-start">
          <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700">
              <span className="font-mono text-sm font-medium text-gray-700 dark:text-gray-300">
                package.json
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
                {Object.keys(state.scripts).length}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Scripts
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 p-3 text-center dark:border-gray-700">
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {Object.keys(state.dependencies).length}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Deps
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 p-3 text-center dark:border-gray-700">
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {Object.keys(state.devDependencies).length}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                DevDeps
              </p>
            </div>
          </div>

          <p className="mt-3 text-center text-xs text-gray-400 dark:text-gray-500">
            Press{" "}
            <kbd className="rounded border border-gray-300 bg-gray-100 px-1.5 py-0.5 text-xs dark:border-gray-600 dark:bg-gray-800">
              Ctrl+Enter
            </kbd>{" "}
            to copy
          </p>

          {/* Related tools */}
          <div className="mt-6 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Related Tools
            </h3>
            <div className="mt-2 space-y-1">
              <Link
                href="/tools/tsconfig-builder"
                className="block text-sm text-blue-600 hover:underline dark:text-blue-400"
              >
                tsconfig.json Builder — TypeScript config generator
              </Link>
              <Link
                href="/tools/json-formatter"
                className="block text-sm text-blue-600 hover:underline dark:text-blue-400"
              >
                JSON Formatter — validate your package.json
              </Link>
              <Link
                href="/tools/gitignore-generator"
                className="block text-sm text-blue-600 hover:underline dark:text-blue-400"
              >
                .gitignore Generator — generate project gitignore
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
