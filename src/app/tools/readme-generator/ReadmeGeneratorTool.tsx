"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import RateLimitBanner from "@/components/RateLimitBanner";

// ─── Types ──────────────────────────────────────────────────────────────────

interface Badge {
  id: string;
  label: string;
  url: string;
}

interface Section {
  id: string;
  key: string;
  label: string;
  enabled: boolean;
}

type PackageManager = "npm" | "yarn" | "pnpm" | "pip" | "cargo" | "go" | "composer" | "gem" | "other";

// ─── Badge presets ──────────────────────────────────────────────────────────

interface BadgePreset {
  label: string;
  getUrl: (owner: string, repo: string) => string;
  getLink: (owner: string, repo: string) => string;
}

const BADGE_PRESETS: BadgePreset[] = [
  {
    label: "License: MIT",
    getUrl: (o, r) => `https://img.shields.io/github/license/${o}/${r}`,
    getLink: (o, r) => `https://github.com/${o}/${r}/blob/main/LICENSE`,
  },
  {
    label: "Build Status",
    getUrl: (o, r) => `https://img.shields.io/github/actions/workflow/status/${o}/${r}/ci.yml?branch=main`,
    getLink: (o, r) => `https://github.com/${o}/${r}/actions`,
  },
  {
    label: "npm Version",
    getUrl: (_o, r) => `https://img.shields.io/npm/v/${r}`,
    getLink: (_o, r) => `https://www.npmjs.com/package/${r}`,
  },
  {
    label: "Stars",
    getUrl: (o, r) => `https://img.shields.io/github/stars/${o}/${r}`,
    getLink: (o, r) => `https://github.com/${o}/${r}/stargazers`,
  },
  {
    label: "Issues",
    getUrl: (o, r) => `https://img.shields.io/github/issues/${o}/${r}`,
    getLink: (o, r) => `https://github.com/${o}/${r}/issues`,
  },
  {
    label: "PRs Welcome",
    getUrl: () => `https://img.shields.io/badge/PRs-welcome-brightgreen.svg`,
    getLink: () => `http://makeapullrequest.com`,
  },
  {
    label: "Contributors",
    getUrl: (o, r) => `https://img.shields.io/github/contributors/${o}/${r}`,
    getLink: (o, r) => `https://github.com/${o}/${r}/graphs/contributors`,
  },
  {
    label: "Downloads",
    getUrl: (_o, r) => `https://img.shields.io/npm/dm/${r}`,
    getLink: (_o, r) => `https://www.npmjs.com/package/${r}`,
  },
];

// ─── Section definitions ────────────────────────────────────────────────────

const DEFAULT_SECTIONS: Omit<Section, "id">[] = [
  { key: "badges", label: "Badges", enabled: true },
  { key: "description", label: "Description", enabled: true },
  { key: "features", label: "Features", enabled: true },
  { key: "prerequisites", label: "Prerequisites", enabled: false },
  { key: "installation", label: "Installation", enabled: true },
  { key: "usage", label: "Usage", enabled: true },
  { key: "api", label: "API Reference", enabled: false },
  { key: "configuration", label: "Configuration", enabled: false },
  { key: "screenshots", label: "Screenshots", enabled: false },
  { key: "roadmap", label: "Roadmap", enabled: false },
  { key: "contributing", label: "Contributing", enabled: true },
  { key: "license", label: "License", enabled: true },
  { key: "acknowledgments", label: "Acknowledgments", enabled: false },
];

const INSTALL_COMMANDS: Record<PackageManager, { install: string; dev?: string }> = {
  npm: { install: "npm install", dev: "npm run dev" },
  yarn: { install: "yarn add", dev: "yarn dev" },
  pnpm: { install: "pnpm add", dev: "pnpm dev" },
  pip: { install: "pip install" },
  cargo: { install: "cargo add" },
  go: { install: "go get" },
  composer: { install: "composer require" },
  gem: { install: "gem install" },
  other: { install: "" },
};

let sectionIdCounter = 0;
function nextSectionId(): string {
  return `sec_${++sectionIdCounter}`;
}

let badgeIdCounter = 0;
function nextBadgeId(): string {
  return `badge_${++badgeIdCounter}`;
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function ReadmeGeneratorTool() {
  // Project basics
  const [projectName, setProjectName] = useState("My Awesome Project");
  const [description, setDescription] = useState("A brief description of what this project does and who it's for.");
  const [owner, setOwner] = useState("username");
  const [repo, setRepo] = useState("my-awesome-project");
  const [license, setLicense] = useState("MIT");
  const [packageManager, setPackageManager] = useState<PackageManager>("npm");

  // Content
  const [features, setFeatures] = useState("Feature one\nFeature two\nFeature three");
  const [prerequisites, setPrerequisites] = useState("Node.js >= 18\nnpm >= 9");
  const [installSteps, setInstallSteps] = useState("");
  const [usageCode, setUsageCode] = useState("");
  const [usageLang, setUsageLang] = useState("bash");
  const [apiContent, setApiContent] = useState("");
  const [configContent, setConfigContent] = useState("");
  const [screenshotUrl, setScreenshotUrl] = useState("");
  const [roadmapItems, setRoadmapItems] = useState("Add more features\nImprove documentation\nAdd tests");
  const [acknowledgments, setAcknowledgments] = useState("");
  const [authorName, setAuthorName] = useState("");

  // Badges & sections
  const [badges, setBadges] = useState<Badge[]>([]);
  const [sections, setSections] = useState<Section[]>(() =>
    DEFAULT_SECTIONS.map((s) => ({ ...s, id: nextSectionId() })),
  );

  // Output
  const [copied, setCopied] = useState(false);

  const { trackAction } = useToolAnalytics("readme-generator");
  const { remaining, dailyLimit, isLimited, recordUsage } =
    useRateLimit("readme-generator");

  // ─── Badge management ───────────────────────────────────────────────────

  function addPresetBadge(preset: BadgePreset) {
    const url = preset.getUrl(owner, repo);
    const link = preset.getLink(owner, repo);
    setBadges((prev) => [
      ...prev,
      { id: nextBadgeId(), label: preset.label, url: `[![${preset.label}](${url})](${link})` },
    ]);
  }

  function removeBadge(id: string) {
    setBadges((prev) => prev.filter((b) => b.id !== id));
  }

  // ─── Section management ─────────────────────────────────────────────────

  function toggleSection(id: string) {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)),
    );
  }

  function moveSection(id: string, direction: -1 | 1) {
    setSections((prev) => {
      const idx = prev.findIndex((s) => s.id === id);
      if (idx < 0) return prev;
      const newIdx = idx + direction;
      if (newIdx < 0 || newIdx >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[newIdx]] = [next[newIdx], next[idx]];
      return next;
    });
  }

  // ─── Generate markdown ──────────────────────────────────────────────────

  const output = useMemo(() => {
    const lines: string[] = [];
    const enabledKeys = new Set(sections.filter((s) => s.enabled).map((s) => s.key));

    // Title
    lines.push(`# ${projectName}`);
    lines.push("");

    // Badges
    if (enabledKeys.has("badges") && badges.length > 0) {
      lines.push(badges.map((b) => b.url).join(" "));
      lines.push("");
    }

    // Description
    if (enabledKeys.has("description") && description.trim()) {
      lines.push(description.trim());
      lines.push("");
    }

    // Table of contents
    const tocSections = sections.filter(
      (s) => s.enabled && s.key !== "badges" && s.key !== "description",
    );
    if (tocSections.length > 2) {
      lines.push("## Table of Contents");
      lines.push("");
      for (const s of tocSections) {
        const anchor = s.label.toLowerCase().replace(/\s+/g, "-");
        lines.push(`- [${s.label}](#${anchor})`);
      }
      lines.push("");
    }

    // Features
    if (enabledKeys.has("features") && features.trim()) {
      lines.push("## Features");
      lines.push("");
      for (const f of features.split("\n").filter(Boolean)) {
        lines.push(`- ${f.trim()}`);
      }
      lines.push("");
    }

    // Prerequisites
    if (enabledKeys.has("prerequisites") && prerequisites.trim()) {
      lines.push("## Prerequisites");
      lines.push("");
      for (const p of prerequisites.split("\n").filter(Boolean)) {
        lines.push(`- ${p.trim()}`);
      }
      lines.push("");
    }

    // Installation
    if (enabledKeys.has("installation")) {
      lines.push("## Installation");
      lines.push("");

      if (installSteps.trim()) {
        lines.push(installSteps.trim());
      } else {
        const pm = INSTALL_COMMANDS[packageManager];
        lines.push("Clone the repository:");
        lines.push("");
        lines.push("```bash");
        lines.push(`git clone https://github.com/${owner}/${repo}.git`);
        lines.push(`cd ${repo}`);
        lines.push("```");
        lines.push("");

        if (pm.install) {
          lines.push("Install dependencies:");
          lines.push("");
          lines.push("```bash");
          lines.push(`${pm.install}`);
          lines.push("```");
          lines.push("");
        }

        if (pm.dev) {
          lines.push("Start the development server:");
          lines.push("");
          lines.push("```bash");
          lines.push(pm.dev);
          lines.push("```");
          lines.push("");
        }
      }
    }

    // Usage
    if (enabledKeys.has("usage")) {
      lines.push("## Usage");
      lines.push("");
      if (usageCode.trim()) {
        lines.push(`\`\`\`${usageLang}`);
        lines.push(usageCode.trim());
        lines.push("```");
      } else {
        lines.push(`\`\`\`${usageLang}`);
        if (packageManager === "npm" || packageManager === "yarn" || packageManager === "pnpm") {
          lines.push(`${packageManager === "npm" ? "npx" : packageManager} ${repo}`);
        } else {
          lines.push(`# Add usage examples here`);
        }
        lines.push("```");
      }
      lines.push("");
    }

    // API Reference
    if (enabledKeys.has("api")) {
      lines.push("## API Reference");
      lines.push("");
      if (apiContent.trim()) {
        lines.push(apiContent.trim());
      } else {
        lines.push("| Method | Endpoint | Description |");
        lines.push("|--------|----------|-------------|");
        lines.push("| `GET` | `/api/example` | Get all items |");
        lines.push("| `POST` | `/api/example` | Create an item |");
      }
      lines.push("");
    }

    // Configuration
    if (enabledKeys.has("configuration")) {
      lines.push("## Configuration");
      lines.push("");
      if (configContent.trim()) {
        lines.push(configContent.trim());
      } else {
        lines.push("Create a `.env` file in the root directory:");
        lines.push("");
        lines.push("```env");
        lines.push("API_KEY=your_api_key");
        lines.push("DATABASE_URL=your_database_url");
        lines.push("```");
      }
      lines.push("");
    }

    // Screenshots
    if (enabledKeys.has("screenshots")) {
      lines.push("## Screenshots");
      lines.push("");
      if (screenshotUrl.trim()) {
        lines.push(`![Screenshot](${screenshotUrl.trim()})`);
      } else {
        lines.push("![Screenshot](https://via.placeholder.com/800x400?text=Screenshot)");
      }
      lines.push("");
    }

    // Roadmap
    if (enabledKeys.has("roadmap") && roadmapItems.trim()) {
      lines.push("## Roadmap");
      lines.push("");
      for (const item of roadmapItems.split("\n").filter(Boolean)) {
        lines.push(`- [ ] ${item.trim()}`);
      }
      lines.push("");
    }

    // Contributing
    if (enabledKeys.has("contributing")) {
      lines.push("## Contributing");
      lines.push("");
      lines.push("Contributions are welcome! Here's how you can help:");
      lines.push("");
      lines.push("1. Fork the repository");
      lines.push(`2. Create a feature branch (\`git checkout -b feature/amazing-feature\`)`);
      lines.push(`3. Commit your changes (\`git commit -m 'Add amazing feature'\`)`);
      lines.push(`4. Push to the branch (\`git push origin feature/amazing-feature\`)`);
      lines.push("5. Open a Pull Request");
      lines.push("");
    }

    // License
    if (enabledKeys.has("license")) {
      lines.push("## License");
      lines.push("");
      lines.push(
        `This project is licensed under the ${license} License — see the [LICENSE](LICENSE) file for details.`,
      );
      lines.push("");
    }

    // Acknowledgments
    if (enabledKeys.has("acknowledgments") && acknowledgments.trim()) {
      lines.push("## Acknowledgments");
      lines.push("");
      for (const a of acknowledgments.split("\n").filter(Boolean)) {
        lines.push(`- ${a.trim()}`);
      }
      lines.push("");
    }

    // Footer
    if (authorName.trim()) {
      lines.push("---");
      lines.push("");
      lines.push(`Made with ❤️ by [${authorName.trim()}](https://github.com/${owner})`);
      lines.push("");
    }

    return lines.join("\n");
  }, [
    projectName, description, owner, repo, license, packageManager,
    features, prerequisites, installSteps, usageCode, usageLang,
    apiContent, configContent, screenshotUrl, roadmapItems,
    acknowledgments, authorName, badges, sections,
  ]);

  const handleGenerate = useCallback(() => {
    if (isLimited) return;
    recordUsage();
    trackAction("generate");
  }, [isLimited, recordUsage, trackAction]);

  useKeyboardShortcut("Enter", handleGenerate);

  function handleCopy() {
    navigator.clipboard.writeText(output);
    setCopied(true);
    trackAction("copy");
    if (!isLimited) recordUsage();
    setTimeout(() => setCopied(false), 1500);
  }

  function handleDownload() {
    const blob = new Blob([output], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "README.md";
    a.click();
    URL.revokeObjectURL(url);
    trackAction("download");
    if (!isLimited) recordUsage();
  }

  // ─── Render ───────────────────────────────────────────────────────────

  const inputClasses =
    "w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100";
  const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";
  const cardClasses =
    "rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900";

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="mb-8 block text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        &larr; Back to tools
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        README Generator
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Generate a professional GitHub README.md for your project. Fill in the
        details, toggle sections, and copy or download the result.
      </p>

      <RateLimitBanner
        remaining={remaining}
        dailyLimit={dailyLimit}
        isLimited={isLimited}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left column: inputs */}
        <div className="space-y-6">
          {/* Project basics */}
          <div className={cardClasses}>
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Project Details
            </h2>
            <div className="space-y-3">
              <div>
                <label className={labelClasses}>Project Name</label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className={inputClasses}
                  placeholder="My Awesome Project"
                />
              </div>
              <div>
                <label className={labelClasses}>Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={inputClasses + " min-h-[60px]"}
                  rows={2}
                  placeholder="A brief description of what this project does..."
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClasses}>GitHub Owner</label>
                  <input
                    type="text"
                    value={owner}
                    onChange={(e) => setOwner(e.target.value)}
                    className={inputClasses}
                    placeholder="username"
                  />
                </div>
                <div>
                  <label className={labelClasses}>Repository Name</label>
                  <input
                    type="text"
                    value={repo}
                    onChange={(e) => setRepo(e.target.value)}
                    className={inputClasses}
                    placeholder="my-awesome-project"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClasses}>Package Manager</label>
                  <select
                    value={packageManager}
                    onChange={(e) => setPackageManager(e.target.value as PackageManager)}
                    className={inputClasses}
                  >
                    <option value="npm">npm</option>
                    <option value="yarn">yarn</option>
                    <option value="pnpm">pnpm</option>
                    <option value="pip">pip (Python)</option>
                    <option value="cargo">cargo (Rust)</option>
                    <option value="go">go</option>
                    <option value="composer">composer (PHP)</option>
                    <option value="gem">gem (Ruby)</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className={labelClasses}>License</label>
                  <select
                    value={license}
                    onChange={(e) => setLicense(e.target.value)}
                    className={inputClasses}
                  >
                    <option value="MIT">MIT</option>
                    <option value="Apache-2.0">Apache 2.0</option>
                    <option value="GPL-3.0">GPL 3.0</option>
                    <option value="BSD-2-Clause">BSD 2-Clause</option>
                    <option value="BSD-3-Clause">BSD 3-Clause</option>
                    <option value="ISC">ISC</option>
                    <option value="MPL-2.0">MPL 2.0</option>
                    <option value="Unlicense">Unlicense</option>
                  </select>
                </div>
              </div>
              <div>
                <label className={labelClasses}>Author Name (optional)</label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className={inputClasses}
                  placeholder="Your Name"
                />
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className={cardClasses}>
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Badges
            </h2>
            <div className="flex flex-wrap gap-2 mb-3">
              {BADGE_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => addPresetBadge(preset)}
                  className="rounded border border-gray-300 bg-white px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 transition-colors dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-indigo-950 dark:hover:border-indigo-700 dark:hover:text-indigo-300"
                >
                  + {preset.label}
                </button>
              ))}
            </div>
            {badges.length > 0 && (
              <div className="space-y-1.5">
                {badges.map((badge) => (
                  <div
                    key={badge.id}
                    className="flex items-center gap-2 rounded border border-gray-100 bg-gray-50 px-2.5 py-1.5 text-xs dark:border-gray-700 dark:bg-gray-800"
                  >
                    <span className="flex-1 font-medium text-gray-700 dark:text-gray-300 truncate">
                      {badge.label}
                    </span>
                    <button
                      onClick={() => removeBadge(badge.id)}
                      className="text-gray-400 hover:text-red-600 dark:text-gray-500 dark:hover:text-red-400"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
            {badges.length === 0 && (
              <p className="text-xs text-gray-400 dark:text-gray-600">
                Click badges above to add them. They use your GitHub owner/repo.
              </p>
            )}
          </div>

          {/* Sections toggle */}
          <div className={cardClasses}>
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Sections
            </h2>
            <div className="space-y-1.5">
              {sections.map((section, idx) => (
                <div
                  key={section.id}
                  className="flex items-center gap-2"
                >
                  <div className="flex flex-col gap-0.5">
                    <button
                      onClick={() => moveSection(section.id, -1)}
                      disabled={idx === 0}
                      className="text-[10px] leading-none text-gray-400 hover:text-gray-600 disabled:opacity-30 dark:text-gray-500 dark:hover:text-gray-300"
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => moveSection(section.id, 1)}
                      disabled={idx === sections.length - 1}
                      className="text-[10px] leading-none text-gray-400 hover:text-gray-600 disabled:opacity-30 dark:text-gray-500 dark:hover:text-gray-300"
                    >
                      ▼
                    </button>
                  </div>
                  <label className="flex flex-1 items-center gap-2 cursor-pointer text-sm text-gray-700 dark:text-gray-300">
                    <input
                      type="checkbox"
                      checked={section.enabled}
                      onChange={() => toggleSection(section.id)}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-900"
                    />
                    {section.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Content sections */}
          {sections.find((s) => s.key === "features")?.enabled && (
            <div className={cardClasses}>
              <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Features (one per line)
              </h2>
              <textarea
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
                className={inputClasses + " min-h-[80px] font-mono"}
                rows={4}
                placeholder={"Feature one\nFeature two\nFeature three"}
              />
            </div>
          )}

          {sections.find((s) => s.key === "prerequisites")?.enabled && (
            <div className={cardClasses}>
              <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Prerequisites (one per line)
              </h2>
              <textarea
                value={prerequisites}
                onChange={(e) => setPrerequisites(e.target.value)}
                className={inputClasses + " min-h-[60px] font-mono"}
                rows={3}
                placeholder={"Node.js >= 18\nnpm >= 9"}
              />
            </div>
          )}

          {sections.find((s) => s.key === "installation")?.enabled && (
            <div className={cardClasses}>
              <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Custom Install Steps (optional — leave blank for auto-generated)
              </h2>
              <textarea
                value={installSteps}
                onChange={(e) => setInstallSteps(e.target.value)}
                className={inputClasses + " min-h-[80px] font-mono"}
                rows={4}
                placeholder="Leave blank to auto-generate from package manager..."
              />
            </div>
          )}

          {sections.find((s) => s.key === "usage")?.enabled && (
            <div className={cardClasses}>
              <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Usage Example
              </h2>
              <div className="mb-2">
                <label className={labelClasses}>Language</label>
                <select
                  value={usageLang}
                  onChange={(e) => setUsageLang(e.target.value)}
                  className={inputClasses + " w-32"}
                >
                  {["bash", "javascript", "typescript", "python", "go", "rust", "java", "ruby", "php", "csharp"].map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
              <textarea
                value={usageCode}
                onChange={(e) => setUsageCode(e.target.value)}
                className={inputClasses + " min-h-[80px] font-mono"}
                rows={4}
                placeholder="Add your usage example code here..."
              />
            </div>
          )}

          {sections.find((s) => s.key === "api")?.enabled && (
            <div className={cardClasses}>
              <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                API Reference (markdown)
              </h2>
              <textarea
                value={apiContent}
                onChange={(e) => setApiContent(e.target.value)}
                className={inputClasses + " min-h-[80px] font-mono"}
                rows={4}
                placeholder="Leave blank for a sample API table..."
              />
            </div>
          )}

          {sections.find((s) => s.key === "configuration")?.enabled && (
            <div className={cardClasses}>
              <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Configuration (markdown)
              </h2>
              <textarea
                value={configContent}
                onChange={(e) => setConfigContent(e.target.value)}
                className={inputClasses + " min-h-[80px] font-mono"}
                rows={4}
                placeholder="Leave blank for a sample .env example..."
              />
            </div>
          )}

          {sections.find((s) => s.key === "screenshots")?.enabled && (
            <div className={cardClasses}>
              <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Screenshot URL
              </h2>
              <input
                type="text"
                value={screenshotUrl}
                onChange={(e) => setScreenshotUrl(e.target.value)}
                className={inputClasses}
                placeholder="https://example.com/screenshot.png"
              />
            </div>
          )}

          {sections.find((s) => s.key === "roadmap")?.enabled && (
            <div className={cardClasses}>
              <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Roadmap Items (one per line)
              </h2>
              <textarea
                value={roadmapItems}
                onChange={(e) => setRoadmapItems(e.target.value)}
                className={inputClasses + " min-h-[60px] font-mono"}
                rows={3}
                placeholder={"Add more features\nImprove documentation"}
              />
            </div>
          )}

          {sections.find((s) => s.key === "acknowledgments")?.enabled && (
            <div className={cardClasses}>
              <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Acknowledgments (one per line)
              </h2>
              <textarea
                value={acknowledgments}
                onChange={(e) => setAcknowledgments(e.target.value)}
                className={inputClasses + " min-h-[60px] font-mono"}
                rows={3}
                placeholder={"Inspired by awesome-readme\nBuilt with Next.js"}
              />
            </div>
          )}
        </div>

        {/* Right column: live preview */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              README.md Preview
            </h2>
            <div className="flex gap-2">
              <button
                onClick={handleDownload}
                className="rounded border border-gray-300 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
              >
                Download .md
              </button>
              <button
                onClick={handleCopy}
                className="rounded border border-gray-300 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
          <pre className="max-h-[80vh] overflow-auto rounded-lg border border-gray-200 bg-white p-4 font-mono text-sm text-gray-900 whitespace-pre-wrap break-words dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100">
            {output}
          </pre>
        </div>
      </div>

      {/* Info */}
      <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          About README Generator
        </h2>
        <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
          <li>
            Instantly generate a professional README.md for any GitHub project.
          </li>
          <li>
            Add shields.io badges for license, build status, npm version, stars, and more.
          </li>
          <li>
            Toggle and reorder 13 sections: badges, description, features, prerequisites,
            installation, usage, API reference, configuration, screenshots, roadmap,
            contributing, license, and acknowledgments.
          </li>
          <li>
            Auto-generates installation steps for npm, yarn, pnpm, pip, cargo, go, composer, and gem.
          </li>
          <li>
            Download as .md or copy to clipboard — everything runs in your browser.
          </li>
        </ul>
      </div>
    </div>
  );
}
