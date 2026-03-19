"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import RateLimitBanner from "@/components/RateLimitBanner";

/* ─── Types ─── */

interface ReadmeFields {
  projectName: string;
  description: string;
  repoUrl: string;
  homepageUrl: string;
  authorName: string;
  authorGithub: string;
  license: string;
  language: string;
  packageManager: string;
  installCmd: string;
  usageCode: string;
  features: string;
  prerequisites: string;
  contributing: boolean;
  codeOfConduct: boolean;
  changelog: boolean;
}

interface BadgeConfig {
  license: boolean;
  buildStatus: boolean;
  npm: boolean;
  version: boolean;
  prWelcome: boolean;
}

interface SectionConfig {
  badges: boolean;
  features: boolean;
  prerequisites: boolean;
  installation: boolean;
  usage: boolean;
  contributing: boolean;
  license: boolean;
  acknowledgments: boolean;
}

/* ─── Constants ─── */

const LICENSES = [
  "MIT",
  "Apache-2.0",
  "GPL-3.0",
  "BSD-2-Clause",
  "BSD-3-Clause",
  "ISC",
  "MPL-2.0",
  "Unlicense",
  "None",
];

const LANGUAGES = [
  "JavaScript",
  "TypeScript",
  "Python",
  "Go",
  "Rust",
  "Java",
  "C#",
  "Ruby",
  "PHP",
  "Swift",
  "Kotlin",
  "C/C++",
  "Other",
];

const PACKAGE_MANAGERS = [
  "npm",
  "yarn",
  "pnpm",
  "bun",
  "pip",
  "cargo",
  "go",
  "gem",
  "composer",
  "maven",
  "other",
];

const PRESETS: Record<string, { label: string; desc: string }> = {
  minimal: { label: "Minimal", desc: "Title, description, install, license" },
  standard: {
    label: "Standard",
    desc: "Badges, features, install, usage, contributing, license",
  },
  comprehensive: {
    label: "Comprehensive",
    desc: "Everything — full professional README",
  },
};

const DEFAULT_FIELDS: ReadmeFields = {
  projectName: "",
  description: "",
  repoUrl: "",
  homepageUrl: "",
  authorName: "",
  authorGithub: "",
  license: "MIT",
  language: "JavaScript",
  packageManager: "npm",
  installCmd: "",
  usageCode: "",
  features: "",
  prerequisites: "",
  contributing: true,
  codeOfConduct: false,
  changelog: false,
};

const DEFAULT_BADGES: BadgeConfig = {
  license: true,
  buildStatus: false,
  npm: false,
  version: false,
  prWelcome: false,
};

const DEFAULT_SECTIONS: SectionConfig = {
  badges: true,
  features: true,
  prerequisites: false,
  installation: true,
  usage: true,
  contributing: true,
  license: true,
  acknowledgments: false,
};

/* ─── Generator ─── */

function generateReadme(
  fields: ReadmeFields,
  badges: BadgeConfig,
  sections: SectionConfig
): string {
  const lines: string[] = [];
  const repoPath = extractRepoPath(fields.repoUrl);

  // Title
  lines.push(`# ${fields.projectName || "Project Name"}`);
  lines.push("");

  // Description
  if (fields.description) {
    lines.push(`> ${fields.description}`);
    lines.push("");
  }

  // Badges
  if (sections.badges) {
    const badgeLines: string[] = [];
    if (badges.license && fields.license !== "None" && repoPath) {
      badgeLines.push(
        `[![License: ${fields.license}](https://img.shields.io/badge/License-${encodeURIComponent(fields.license)}-blue.svg)](https://opensource.org/licenses/${fields.license})`
      );
    }
    if (badges.buildStatus && repoPath) {
      badgeLines.push(
        `[![Build Status](https://img.shields.io/github/actions/workflow/status/${repoPath}/ci.yml?branch=main)](https://github.com/${repoPath}/actions)`
      );
    }
    if (badges.npm && fields.projectName) {
      const pkg = fields.projectName.toLowerCase().replace(/\s+/g, "-");
      badgeLines.push(
        `[![npm version](https://img.shields.io/npm/v/${pkg}.svg)](https://www.npmjs.com/package/${pkg})`
      );
    }
    if (badges.version && repoPath) {
      badgeLines.push(
        `[![GitHub release](https://img.shields.io/github/v/release/${repoPath})](https://github.com/${repoPath}/releases)`
      );
    }
    if (badges.prWelcome) {
      badgeLines.push(
        "[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)"
      );
    }
    if (badgeLines.length > 0) {
      lines.push(badgeLines.join(" "));
      lines.push("");
    }
  }

  // Homepage link
  if (fields.homepageUrl) {
    lines.push(`**[Live Demo / Homepage](${fields.homepageUrl})**`);
    lines.push("");
  }

  // Features
  if (sections.features && fields.features.trim()) {
    lines.push("## Features");
    lines.push("");
    const featureList = fields.features
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);
    for (const f of featureList) {
      const line = f.startsWith("-") || f.startsWith("*") ? f : `- ${f}`;
      lines.push(line);
    }
    lines.push("");
  }

  // Prerequisites
  if (sections.prerequisites && fields.prerequisites.trim()) {
    lines.push("## Prerequisites");
    lines.push("");
    const prereqs = fields.prerequisites
      .split("\n")
      .map((p) => p.trim())
      .filter(Boolean);
    for (const p of prereqs) {
      const line = p.startsWith("-") || p.startsWith("*") ? p : `- ${p}`;
      lines.push(line);
    }
    lines.push("");
  }

  // Installation
  if (sections.installation) {
    lines.push("## Installation");
    lines.push("");
    const installCmd = fields.installCmd.trim() || guessInstallCmd(fields);
    if (repoPath) {
      lines.push("```bash");
      lines.push(`git clone https://github.com/${repoPath}.git`);
      lines.push(
        `cd ${repoPath.split("/").pop() || fields.projectName.toLowerCase().replace(/\s+/g, "-")}`
      );
      lines.push(installCmd);
      lines.push("```");
    } else {
      lines.push("```bash");
      lines.push(installCmd);
      lines.push("```");
    }
    lines.push("");
  }

  // Usage
  if (sections.usage) {
    lines.push("## Usage");
    lines.push("");
    if (fields.usageCode.trim()) {
      const lang = guessCodeLang(fields.language);
      lines.push("```" + lang);
      lines.push(fields.usageCode.trim());
      lines.push("```");
    } else {
      const lang = guessCodeLang(fields.language);
      lines.push("```" + lang);
      lines.push(guessUsageCmd(fields));
      lines.push("```");
    }
    lines.push("");
  }

  // Contributing
  if (sections.contributing) {
    lines.push("## Contributing");
    lines.push("");
    lines.push("Contributions are welcome! Please follow these steps:");
    lines.push("");
    lines.push("1. Fork the repository");
    lines.push(
      "2. Create a feature branch (`git checkout -b feature/amazing-feature`)"
    );
    lines.push(
      "3. Commit your changes (`git commit -m 'Add amazing feature'`)"
    );
    lines.push(
      "4. Push to the branch (`git push origin feature/amazing-feature`)"
    );
    lines.push("5. Open a Pull Request");
    lines.push("");
    if (fields.codeOfConduct) {
      lines.push(
        "Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing."
      );
      lines.push("");
    }
  }

  // Changelog
  if (fields.changelog) {
    lines.push("## Changelog");
    lines.push("");
    lines.push("See [CHANGELOG.md](CHANGELOG.md) for a list of changes.");
    lines.push("");
  }

  // License
  if (sections.license && fields.license !== "None") {
    lines.push("## License");
    lines.push("");
    if (fields.license === "MIT") {
      lines.push(
        "This project is licensed under the [MIT License](LICENSE) — see the [LICENSE](LICENSE) file for details."
      );
    } else {
      lines.push(
        `Distributed under the ${fields.license} License. See [LICENSE](LICENSE) for more information.`
      );
    }
    lines.push("");
    lines.push("---");
    lines.push("");
    const heart = "\u2764\uFE0F";
    lines.push(
      `Made with ${heart} by [${fields.authorName || "Your Name"}](https://github.com/${fields.authorGithub || "username"})`
    );
    lines.push("");
  }

  // Acknowledgments
  if (sections.acknowledgments) {
    lines.push("## Acknowledgments");
    lines.push("");
    lines.push(
      "- List resources, libraries, or people you'd like to thank"
    );
    lines.push("");
  }

  return lines.join("\n");
}

function extractRepoPath(url: string): string {
  if (!url) return "";
  const match = url.match(/github\.com[/:]([^/]+\/[^/.]+)/);
  return match ? match[1] : "";
}

function guessInstallCmd(fields: ReadmeFields): string {
  const pm = fields.packageManager;
  switch (pm) {
    case "npm":
      return "npm install";
    case "yarn":
      return "yarn install";
    case "pnpm":
      return "pnpm install";
    case "bun":
      return "bun install";
    case "pip":
      return "pip install -r requirements.txt";
    case "cargo":
      return "cargo build";
    case "go":
      return "go mod download";
    case "gem":
      return "bundle install";
    case "composer":
      return "composer install";
    case "maven":
      return "mvn install";
    default:
      return "# install dependencies";
  }
}

function guessCodeLang(language: string): string {
  const map: Record<string, string> = {
    JavaScript: "javascript",
    TypeScript: "typescript",
    Python: "python",
    Go: "go",
    Rust: "rust",
    Java: "java",
    "C#": "csharp",
    Ruby: "ruby",
    PHP: "php",
    Swift: "swift",
    Kotlin: "kotlin",
    "C/C++": "c",
  };
  return map[language] || "bash";
}

function guessUsageCmd(fields: ReadmeFields): string {
  const pm = fields.packageManager;
  switch (pm) {
    case "npm":
      return "npm start";
    case "yarn":
      return "yarn start";
    case "pnpm":
      return "pnpm start";
    case "bun":
      return "bun start";
    case "pip":
      return "python main.py";
    case "cargo":
      return "cargo run";
    case "go":
      return "go run .";
    case "gem":
      return "ruby main.rb";
    case "composer":
      return "php artisan serve";
    case "maven":
      return "mvn spring-boot:run";
    default:
      return "# run the project";
  }
}

/* ─── Component ─── */

export default function ReadmeGeneratorTool() {
  const [fields, setFields] = useState<ReadmeFields>(DEFAULT_FIELDS);
  const [badges, setBadges] = useState<BadgeConfig>(DEFAULT_BADGES);
  const [sections, setSections] = useState<SectionConfig>(DEFAULT_SECTIONS);
  const [copied, setCopied] = useState(false);
  const [preview, setPreview] = useState<"raw" | "preview">("raw");
  const { trackAction } = useToolAnalytics("readme-generator");
  const { isLimited, remaining, dailyLimit, recordUsage } =
    useRateLimit("readme-generator");

  const output = useMemo(
    () => generateReadme(fields, badges, sections),
    [fields, badges, sections]
  );

  const handleCopy = async () => {
    if (!output.trim()) return;
    recordUsage();
    if (isLimited) return;
    trackAction("copy");
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!output.trim()) return;
    recordUsage();
    if (isLimited) return;
    trackAction("download");
    const blob = new Blob([output], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "README.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  useKeyboardShortcut("Enter", handleCopy);

  const update = <K extends keyof ReadmeFields>(
    key: K,
    value: ReadmeFields[K]
  ) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  };

  const toggleBadge = (key: keyof BadgeConfig) => {
    setBadges((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleSection = (key: keyof SectionConfig) => {
    setSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const applyPreset = (preset: string) => {
    switch (preset) {
      case "minimal":
        setSections({
          badges: false,
          features: false,
          prerequisites: false,
          installation: true,
          usage: false,
          contributing: false,
          license: true,
          acknowledgments: false,
        });
        break;
      case "standard":
        setSections({
          badges: true,
          features: true,
          prerequisites: false,
          installation: true,
          usage: true,
          contributing: true,
          license: true,
          acknowledgments: false,
        });
        break;
      case "comprehensive":
        setSections({
          badges: true,
          features: true,
          prerequisites: true,
          installation: true,
          usage: true,
          contributing: true,
          license: true,
          acknowledgments: true,
        });
        break;
    }
  };

  const reset = () => {
    setFields(DEFAULT_FIELDS);
    setBadges(DEFAULT_BADGES);
    setSections(DEFAULT_SECTIONS);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/"
          className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
        >
          &larr; Back to Tools
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-white mb-2">README Generator</h1>
      <p className="text-slate-400 mb-6">
        Generate professional GitHub README.md files with badges, installation
        steps, usage examples, and more.
      </p>

      <RateLimitBanner
        isLimited={isLimited}
        remaining={remaining}
        dailyLimit={dailyLimit}
      />

      {/* Preset buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {Object.entries(PRESETS).map(([key, { label, desc }]) => (
          <button
            key={key}
            onClick={() => applyPreset(key)}
            title={desc}
            className="px-3 py-1.5 bg-slate-800 border border-slate-700 hover:border-blue-500 text-slate-300 hover:text-white text-sm rounded-lg transition-colors"
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left — Form */}
        <div className="space-y-6">
          {/* Project Info */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
            <h2 className="text-lg font-semibold text-white mb-4">
              Project Info
            </h2>
            <div className="space-y-4">
              <Field
                label="Project Name"
                value={fields.projectName}
                onChange={(v) => update("projectName", v)}
                placeholder="my-awesome-project"
              />
              <TextArea
                label="Description"
                value={fields.description}
                onChange={(v) => update("description", v)}
                placeholder="A brief description of what your project does and why it matters."
                rows={2}
              />
              <Field
                label="GitHub Repository URL"
                value={fields.repoUrl}
                onChange={(v) => update("repoUrl", v)}
                placeholder="https://github.com/username/repo"
              />
              <Field
                label="Homepage / Demo URL"
                value={fields.homepageUrl}
                onChange={(v) => update("homepageUrl", v)}
                placeholder="https://my-project.dev"
              />
              <div className="grid grid-cols-2 gap-4">
                <Field
                  label="Author Name"
                  value={fields.authorName}
                  onChange={(v) => update("authorName", v)}
                  placeholder="John Doe"
                />
                <Field
                  label="GitHub Username"
                  value={fields.authorGithub}
                  onChange={(v) => update("authorGithub", v)}
                  placeholder="johndoe"
                />
              </div>
            </div>
          </div>

          {/* Tech & Build */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
            <h2 className="text-lg font-semibold text-white mb-4">
              Tech Stack
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <SelectField
                  label="Language"
                  value={fields.language}
                  onChange={(v) => update("language", v)}
                  options={LANGUAGES}
                />
                <SelectField
                  label="Package Manager"
                  value={fields.packageManager}
                  onChange={(v) => update("packageManager", v)}
                  options={PACKAGE_MANAGERS}
                />
              </div>
              <SelectField
                label="License"
                value={fields.license}
                onChange={(v) => update("license", v)}
                options={LICENSES}
              />
            </div>
          </div>

          {/* Sections Toggle */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
            <h2 className="text-lg font-semibold text-white mb-4">Sections</h2>
            <div className="grid grid-cols-2 gap-3">
              {(Object.keys(sections) as (keyof SectionConfig)[]).map(
                (key) => (
                  <label
                    key={key}
                    className="flex items-center gap-2 cursor-pointer text-sm text-slate-300 hover:text-white"
                  >
                    <input
                      type="checkbox"
                      checked={sections[key]}
                      onChange={() => toggleSection(key)}
                      className="w-4 h-4 rounded border-slate-600 bg-slate-900 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
                    />
                    {sectionLabel(key)}
                  </label>
                )
              )}
            </div>
          </div>

          {/* Badges */}
          {sections.badges && (
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
              <h2 className="text-lg font-semibold text-white mb-4">Badges</h2>
              <div className="grid grid-cols-2 gap-3">
                {(Object.keys(badges) as (keyof BadgeConfig)[]).map((key) => (
                  <label
                    key={key}
                    className="flex items-center gap-2 cursor-pointer text-sm text-slate-300 hover:text-white"
                  >
                    <input
                      type="checkbox"
                      checked={badges[key]}
                      onChange={() => toggleBadge(key)}
                      className="w-4 h-4 rounded border-slate-600 bg-slate-900 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
                    />
                    {badgeLabel(key)}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Content Sections */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
            <h2 className="text-lg font-semibold text-white mb-4">Content</h2>
            <div className="space-y-4">
              {sections.features && (
                <TextArea
                  label="Features (one per line)"
                  value={fields.features}
                  onChange={(v) => update("features", v)}
                  placeholder={
                    "Fast and lightweight\nEasy to configure\nFull TypeScript support"
                  }
                  rows={4}
                />
              )}
              {sections.prerequisites && (
                <TextArea
                  label="Prerequisites (one per line)"
                  value={fields.prerequisites}
                  onChange={(v) => update("prerequisites", v)}
                  placeholder={"Node.js >= 18\nnpm >= 9"}
                  rows={2}
                />
              )}
              {sections.installation && (
                <TextArea
                  label="Install Command (override)"
                  value={fields.installCmd}
                  onChange={(v) => update("installCmd", v)}
                  placeholder={`Leave blank to auto-generate from package manager (${guessInstallCmd(fields)})`}
                  rows={2}
                />
              )}
              {sections.usage && (
                <TextArea
                  label="Usage Code"
                  value={fields.usageCode}
                  onChange={(v) => update("usageCode", v)}
                  placeholder="Leave blank for default, or paste a code example"
                  rows={4}
                />
              )}
              {sections.contributing && (
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-300 hover:text-white">
                    <input
                      type="checkbox"
                      checked={fields.codeOfConduct}
                      onChange={() =>
                        update("codeOfConduct", !fields.codeOfConduct)
                      }
                      className="w-4 h-4 rounded border-slate-600 bg-slate-900 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
                    />
                    Include Code of Conduct reference
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-300 hover:text-white">
                    <input
                      type="checkbox"
                      checked={fields.changelog}
                      onChange={() => update("changelog", !fields.changelog)}
                      className="w-4 h-4 rounded border-slate-600 bg-slate-900 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
                    />
                    Include Changelog section
                  </label>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={reset}
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            Reset all fields
          </button>
        </div>

        {/* Right — Output */}
        <div className="space-y-6">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex bg-slate-900 rounded-lg p-0.5">
                <button
                  onClick={() => setPreview("raw")}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    preview === "raw"
                      ? "bg-slate-700 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Markdown
                </button>
                <button
                  onClick={() => setPreview("preview")}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    preview === "preview"
                      ? "bg-slate-700 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Preview
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleDownload}
                  disabled={isLimited}
                  className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white text-sm rounded-lg transition-colors"
                >
                  Download .md
                </button>
                <button
                  onClick={handleCopy}
                  disabled={isLimited}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white text-sm rounded-lg transition-colors"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>

            {preview === "raw" ? (
              <pre className="bg-slate-900 border border-slate-600 rounded-lg p-4 text-sm text-slate-300 overflow-x-auto whitespace-pre-wrap break-words font-mono max-h-[700px] overflow-y-auto">
                {output || "Fill in the fields to generate your README..."}
              </pre>
            ) : (
              <div className="bg-white rounded-lg p-6 max-h-[700px] overflow-y-auto">
                <MarkdownPreview markdown={output} />
              </div>
            )}
            <p className="text-xs text-slate-500 mt-2">
              <span className="text-slate-600">Ctrl+Enter to copy</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Sub-components ─── */

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-slate-300 mb-1 block">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
      />
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-slate-300 mb-1 block">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm resize-none font-mono"
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="text-sm font-medium text-slate-300 mb-1 block">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 text-sm"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function MarkdownPreview({ markdown }: { markdown: string }) {
  const html = useMemo(() => simpleMarkdownToHtml(markdown), [markdown]);
  return (
    <div
      className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-code:bg-gray-100 prose-code:px-1 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-li:text-gray-700 prose-blockquote:border-l-blue-500 prose-blockquote:text-gray-600 prose-hr:border-gray-300 prose-img:max-w-full"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/* ─── Simple Markdown → HTML ─── */

function simpleMarkdownToHtml(md: string): string {
  let html = escapeHtml(md);

  // Code blocks
  html = html.replace(
    /```(\w*)\n([\s\S]*?)```/g,
    (_m, _lang, code) => `<pre><code>${code.trim()}</code></pre>`
  );

  // Inline code
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

  // Headers
  html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>");
  html = html.replace(/^# (.+)$/gm, "<h1>$1</h1>");

  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

  // Italic
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");

  // Blockquotes
  html = html.replace(
    /^&gt; (.+)$/gm,
    "<blockquote><p>$1</p></blockquote>"
  );

  // Badge images with links (must be before plain images and links)
  html = html.replace(
    /\[!\[([^\]]*)\]\(([^)]+)\)\]\(([^)]+)\)/g,
    '<a href="$3"><img src="$2" alt="$1" /></a>'
  );

  // Images
  html = html.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    '<img src="$2" alt="$1" />'
  );

  // Links
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2">$1</a>'
  );

  // Horizontal rules
  html = html.replace(/^---$/gm, "<hr />");

  // Numbered lists
  html = html.replace(/(^(?:\d+\. .+\n?)+)/gm, (match) => {
    const items = match
      .trim()
      .split("\n")
      .map((line) => `<li>${line.replace(/^\d+\.\s+/, "")}</li>`)
      .join("");
    return `<ol>${items}</ol>`;
  });

  // Unordered lists
  html = html.replace(/(^(?:- .+\n?)+)/gm, (match) => {
    const items = match
      .trim()
      .split("\n")
      .map((line) => `<li>${line.replace(/^- /, "")}</li>`)
      .join("");
    return `<ul>${items}</ul>`;
  });

  // Paragraphs
  html = html.replace(/^(?!<[a-z/])(.+)$/gm, "<p>$1</p>");

  // Clean up empty paragraphs
  html = html.replace(/<p>\s*<\/p>/g, "");

  return html;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/* ─── Helpers ─── */

function sectionLabel(key: keyof SectionConfig): string {
  const labels: Record<keyof SectionConfig, string> = {
    badges: "Badges",
    features: "Features",
    prerequisites: "Prerequisites",
    installation: "Installation",
    usage: "Usage",
    contributing: "Contributing",
    license: "License",
    acknowledgments: "Acknowledgments",
  };
  return labels[key];
}

function badgeLabel(key: keyof BadgeConfig): string {
  const labels: Record<keyof BadgeConfig, string> = {
    license: "License",
    buildStatus: "Build Status (CI)",
    npm: "npm Version",
    version: "GitHub Release",
    prWelcome: "PRs Welcome",
  };
  return labels[key];
}
