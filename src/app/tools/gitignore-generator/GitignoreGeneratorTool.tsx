"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";

// --- Template data ---

interface GitignoreTemplate {
  name: string;
  category: string;
  patterns: string[];
}

const TEMPLATES: GitignoreTemplate[] = [
  // Languages
  {
    name: "Node.js",
    category: "Language",
    patterns: [
      "node_modules/",
      "npm-debug.log*",
      "yarn-debug.log*",
      "yarn-error.log*",
      ".pnpm-debug.log*",
      "dist/",
      "build/",
      ".npm",
      ".eslintcache",
      ".node_repl_history",
      "*.tgz",
      ".yarn-integrity",
      ".env",
      ".env.local",
      ".env.*.local",
    ],
  },
  {
    name: "Python",
    category: "Language",
    patterns: [
      "__pycache__/",
      "*.py[cod]",
      "*$py.class",
      "*.so",
      "dist/",
      "build/",
      "*.egg-info/",
      "*.egg",
      ".eggs/",
      ".Python",
      "env/",
      "venv/",
      ".venv/",
      "*.whl",
      ".mypy_cache/",
      ".pytest_cache/",
      ".ruff_cache/",
      "htmlcov/",
      ".coverage",
      ".tox/",
      ".nox/",
      "pip-log.txt",
    ],
  },
  {
    name: "Java",
    category: "Language",
    patterns: [
      "*.class",
      "*.jar",
      "*.war",
      "*.ear",
      "*.nar",
      "hs_err_pid*",
      "replay_pid*",
      "target/",
      "pom.xml.tag",
      "pom.xml.releaseBackup",
      "pom.xml.versionsBackup",
      "pom.xml.next",
      ".mvn/timing.properties",
      ".mvn/wrapper/maven-wrapper.jar",
      ".gradle/",
      "build/",
      "!gradle-wrapper.jar",
      ".gradle-cache/",
    ],
  },
  {
    name: "Go",
    category: "Language",
    patterns: [
      "*.exe",
      "*.exe~",
      "*.dll",
      "*.so",
      "*.dylib",
      "*.test",
      "*.out",
      "vendor/",
      "go.work",
    ],
  },
  {
    name: "Rust",
    category: "Language",
    patterns: [
      "target/",
      "Cargo.lock",
      "**/*.rs.bk",
      "*.pdb",
    ],
  },
  {
    name: "Ruby",
    category: "Language",
    patterns: [
      "*.gem",
      "*.rbc",
      ".bundle/",
      "vendor/bundle/",
      ".config",
      "coverage/",
      "InstalledFiles",
      "lib/bundler/man/",
      "pkg/",
      "rdoc/",
      "spec/reports/",
      "test/tmp/",
      "test/version_tmp/",
      "tmp/",
      ".byebug_history",
      ".dat*",
      "rerun.txt",
      "pickle-email-*.html",
    ],
  },
  {
    name: "C / C++",
    category: "Language",
    patterns: [
      "*.d",
      "*.slo",
      "*.lo",
      "*.o",
      "*.obj",
      "*.gch",
      "*.pch",
      "*.so",
      "*.dylib",
      "*.dll",
      "*.mod",
      "*.smod",
      "*.lai",
      "*.la",
      "*.a",
      "*.lib",
      "*.exe",
      "*.out",
      "*.app",
    ],
  },
  {
    name: "C#",
    category: "Language",
    patterns: [
      "[Bb]in/",
      "[Oo]bj/",
      "[Ll]og/",
      "[Ll]ogs/",
      "*.user",
      "*.dbmdl",
      "*.suo",
      "*.cache",
      "*.rsuser",
      "packages/",
      "*.nupkg",
      "project.lock.json",
      "*.nuget.props",
      "*.nuget.targets",
      ".vs/",
    ],
  },
  {
    name: "Swift",
    category: "Language",
    patterns: [
      ".build/",
      "Packages/",
      "Package.pins",
      "Package.resolved",
      "xcuserdata/",
      "*.xcscmblueprint",
      "*.xccheckout",
      "DerivedData/",
      "*.moved-aside",
      "*.pbxuser",
      "!default.pbxuser",
      "*.mode1v3",
      "!default.mode1v3",
      "*.mode2v3",
      "!default.mode2v3",
      "*.perspectivev3",
      "!default.perspectivev3",
    ],
  },
  {
    name: "PHP",
    category: "Language",
    patterns: [
      "vendor/",
      "composer.phar",
      ".env",
      ".phpunit.result.cache",
      "phpunit.xml",
      "*.cache",
      "/storage/*.key",
      "Homestead.json",
      "Homestead.yaml",
      "npm-debug.log",
      "yarn-error.log",
    ],
  },
  {
    name: "Kotlin",
    category: "Language",
    patterns: [
      "*.class",
      "*.jar",
      "*.war",
      "*.ear",
      "target/",
      ".gradle/",
      "build/",
      "!gradle-wrapper.jar",
      "out/",
      ".kotlin/",
    ],
  },
  {
    name: "Dart / Flutter",
    category: "Language",
    patterns: [
      ".dart_tool/",
      ".packages",
      "build/",
      ".pub-cache/",
      ".pub/",
      "pubspec.lock",
      "*.iml",
      ".flutter-plugins",
      ".flutter-plugins-dependencies",
    ],
  },
  // Frameworks
  {
    name: "Next.js",
    category: "Framework",
    patterns: [
      ".next/",
      "out/",
      "build/",
      "node_modules/",
      "npm-debug.log*",
      "yarn-debug.log*",
      "yarn-error.log*",
      ".env",
      ".env.local",
      ".env.*.local",
      ".vercel",
      "*.tsbuildinfo",
      "next-env.d.ts",
    ],
  },
  {
    name: "React",
    category: "Framework",
    patterns: [
      "node_modules/",
      "build/",
      "dist/",
      ".env",
      ".env.local",
      ".env.*.local",
      "npm-debug.log*",
      "yarn-debug.log*",
      "yarn-error.log*",
      ".eslintcache",
      "coverage/",
    ],
  },
  {
    name: "Vue.js",
    category: "Framework",
    patterns: [
      "node_modules/",
      "dist/",
      ".env",
      ".env.local",
      ".env.*.local",
      "npm-debug.log*",
      "yarn-debug.log*",
      "yarn-error.log*",
      ".eslintcache",
      "*.local",
    ],
  },
  {
    name: "Angular",
    category: "Framework",
    patterns: [
      "node_modules/",
      "dist/",
      "tmp/",
      "out-tsc/",
      "bazel-out",
      ".sass-cache/",
      "connect.lock",
      "coverage/",
      "libpeerconnection.log",
      "testem.log",
      "typings/",
      ".angular/",
      ".env",
    ],
  },
  {
    name: "Django",
    category: "Framework",
    patterns: [
      "*.log",
      "*.pot",
      "*.pyc",
      "__pycache__/",
      "local_settings.py",
      "db.sqlite3",
      "db.sqlite3-journal",
      "media/",
      "staticfiles/",
      ".env",
      "venv/",
      ".venv/",
    ],
  },
  {
    name: "Rails",
    category: "Framework",
    patterns: [
      "*.rbc",
      "capybara-*.html",
      ".rspec",
      "/db/*.sqlite3",
      "/db/*.sqlite3-journal",
      "/db/*.sqlite3-shm",
      "/db/*.sqlite3-wal",
      "/public/system",
      "/coverage/",
      "/spec/tmp",
      "rerun.txt",
      "pickle-email-*.html",
      ".bundle",
      "/vendor/bundle",
      "/log/*",
      "/tmp/*",
      "storage/",
      ".byebug_history",
    ],
  },
  {
    name: "Laravel",
    category: "Framework",
    patterns: [
      "/vendor/",
      "node_modules/",
      "npm-debug.log",
      "yarn-error.log",
      ".env",
      ".env.backup",
      "Homestead.json",
      "Homestead.yaml",
      "/public/hot",
      "/public/storage",
      "/storage/*.key",
      ".phpunit.result.cache",
    ],
  },
  {
    name: "Spring Boot",
    category: "Framework",
    patterns: [
      "target/",
      "!.mvn/wrapper/maven-wrapper.jar",
      "!**/src/main/**/target/",
      "!**/src/test/**/target/",
      ".gradle/",
      "build/",
      "!gradle/wrapper/gradle-wrapper.jar",
      "!**/src/main/**/build/",
      "!**/src/test/**/build/",
      "*.class",
      "*.jar",
      "*.war",
      "*.ear",
      ".sts4-cache/",
    ],
  },
  {
    name: ".NET",
    category: "Framework",
    patterns: [
      "[Bb]in/",
      "[Oo]bj/",
      "[Ll]og/",
      "*.user",
      "*.suo",
      ".vs/",
      "packages/",
      "*.nupkg",
      "project.lock.json",
      "*.nuget.targets",
      "launchSettings.json",
      "appsettings.*.json",
    ],
  },
  // Tools & Environments
  {
    name: "macOS",
    category: "OS",
    patterns: [
      ".DS_Store",
      ".AppleDouble",
      ".LSOverride",
      "Icon\r",
      "._*",
      ".DocumentRevisions-V100",
      ".fseventsd",
      ".Spotlight-V100",
      ".TemporaryItems",
      ".Trashes",
      ".VolumeIcon.icns",
      ".com.apple.timemachine.donotpresent",
      ".AppleDB",
      ".AppleDesktop",
    ],
  },
  {
    name: "Windows",
    category: "OS",
    patterns: [
      "Thumbs.db",
      "Thumbs.db:encryptable",
      "ehthumbs.db",
      "ehthumbs_vista.db",
      "*.stackdump",
      "[Dd]esktop.ini",
      "$RECYCLE.BIN/",
      "*.cab",
      "*.msi",
      "*.msix",
      "*.msm",
      "*.msp",
      "*.lnk",
    ],
  },
  {
    name: "Linux",
    category: "OS",
    patterns: [
      "*~",
      ".fuse_hidden*",
      ".directory",
      ".Trash-*",
      ".nfs*",
    ],
  },
  {
    name: "Visual Studio Code",
    category: "IDE",
    patterns: [
      ".vscode/*",
      "!.vscode/settings.json",
      "!.vscode/tasks.json",
      "!.vscode/launch.json",
      "!.vscode/extensions.json",
      "*.code-workspace",
      ".history/",
    ],
  },
  {
    name: "JetBrains",
    category: "IDE",
    patterns: [
      ".idea/",
      "*.iws",
      "*.iml",
      "*.ipr",
      "out/",
      "cmake-build-*/",
    ],
  },
  {
    name: "Vim",
    category: "IDE",
    patterns: [
      "[._]*.s[a-v][a-z]",
      "!*.svg",
      "[._]*.sw[a-p]",
      "[._]s[a-rt-v][a-z]",
      "[._]ss[a-gi-z]",
      "[._]sw[a-p]",
      "Session.vim",
      "Sessionx.vim",
      ".netrwhist",
      "*~",
      "tags",
      "[._]*.un~",
    ],
  },
  {
    name: "Emacs",
    category: "IDE",
    patterns: [
      "*~",
      "\\#*\\#",
      "/.emacs.desktop",
      "/.emacs.desktop.lock",
      "*.elc",
      "auto-save-list",
      "tramp",
      ".\\#*",
      "flycheck_*.el",
    ],
  },
  {
    name: "Sublime Text",
    category: "IDE",
    patterns: [
      "*.tmlanguage.cache",
      "*.tmPreferences.cache",
      "*.stTheme.cache",
      "*.sublime-workspace",
      "*.sublime-project",
      "sftp-config.json",
      "sftp-config-alt*.json",
      "Package Control.last-run",
      "Package Control.ca-list",
      "Package Control.ca-bundle",
      "Package Control.system-ca-bundle",
      "Package Control.cache/",
      "Package Control.ca-certs/",
      "bh_unicode_properties.cache",
      "GitHub.sublime-settings",
    ],
  },
  {
    name: "Xcode",
    category: "IDE",
    patterns: [
      "build/",
      "DerivedData/",
      "*.pbxuser",
      "!default.pbxuser",
      "*.mode1v3",
      "!default.mode1v3",
      "*.mode2v3",
      "!default.mode2v3",
      "*.perspectivev3",
      "!default.perspectivev3",
      "xcuserdata/",
      "*.xcscmblueprint",
      "*.xccheckout",
      "*.moved-aside",
      "*.hmap",
      "*.ipa",
      "*.dSYM.zip",
      "*.dSYM",
      "timeline.xctimeline",
      "playground.xcworkspace",
    ],
  },
  // Infrastructure
  {
    name: "Docker",
    category: "Infrastructure",
    patterns: [
      "docker-compose.override.yml",
      ".docker/",
    ],
  },
  {
    name: "Terraform",
    category: "Infrastructure",
    patterns: [
      "**/.terraform/*",
      "*.tfstate",
      "*.tfstate.*",
      "crash.log",
      "crash.*.log",
      "*.tfvars",
      "*.tfvars.json",
      "override.tf",
      "override.tf.json",
      "*_override.tf",
      "*_override.tf.json",
      ".terraformrc",
      "terraform.rc",
      ".terraform.lock.hcl",
    ],
  },
  {
    name: "Ansible",
    category: "Infrastructure",
    patterns: [
      "*.retry",
      "inventory/*",
      "!inventory/example",
      "vault_password_file",
      ".vault_pass",
    ],
  },
  // Miscellaneous
  {
    name: "Environment Files",
    category: "Misc",
    patterns: [
      ".env",
      ".env.local",
      ".env.*.local",
      ".env.development",
      ".env.test",
      ".env.production",
      ".env.staging",
      "*.pem",
      "*.key",
      "*.crt",
      "*.p12",
    ],
  },
  {
    name: "Logs",
    category: "Misc",
    patterns: [
      "logs/",
      "*.log",
      "npm-debug.log*",
      "yarn-debug.log*",
      "yarn-error.log*",
      "pnpm-debug.log*",
      "lerna-debug.log*",
    ],
  },
  {
    name: "Coverage & Testing",
    category: "Misc",
    patterns: [
      "coverage/",
      "*.lcov",
      ".nyc_output/",
      "lib-cov/",
      ".jest/",
      ".pytest_cache/",
      "htmlcov/",
      "test-results/",
    ],
  },
  {
    name: "Package Managers",
    category: "Misc",
    patterns: [
      "node_modules/",
      ".pnp.*",
      ".yarn/cache",
      ".yarn/unplugged",
      ".yarn/build-state.yml",
      ".yarn/install-state.gz",
      "bower_components/",
    ],
  },
  {
    name: "Databases",
    category: "Misc",
    patterns: [
      "*.sqlite",
      "*.sqlite3",
      "*.db",
      "*.db-journal",
      "*.db-shm",
      "*.db-wal",
      "dump.rdb",
    ],
  },
];

const CATEGORIES = ["Language", "Framework", "OS", "IDE", "Infrastructure", "Misc"] as const;

const CATEGORY_COLORS: Record<string, string> = {
  Language: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  Framework: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400",
  OS: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400",
  IDE: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  Infrastructure: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400",
  Misc: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
};

export default function GitignoreGeneratorTool() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [customRules, setCustomRules] = useState("");
  const [copied, setCopied] = useState(false);
  const { trackFirstInteraction } = useToolAnalytics("gitignore-generator");

  const filtered = useMemo(() => {
    let list = TEMPLATES;
    if (activeCategory) {
      list = list.filter((t) => t.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
      );
    }
    return list;
  }, [search, activeCategory]);

  const output = useMemo(() => {
    if (selected.size === 0 && !customRules.trim()) return "";

    const sections: string[] = [];
    const header = `# Generated by DevBolt .gitignore Generator
# https://devbolt.dev/tools/gitignore-generator
#
# Templates: ${Array.from(selected).sort().join(", ") || "None"}
# Generated: ${new Date().toISOString().split("T")[0]}
`;
    sections.push(header);

    // Gather all selected templates
    const selectedTemplates = TEMPLATES.filter((t) => selected.has(t.name));

    for (const tpl of selectedTemplates) {
      sections.push(`\n### ${tpl.name} ###`);
      sections.push(tpl.patterns.join("\n"));
    }

    if (customRules.trim()) {
      sections.push("\n### Custom Rules ###");
      sections.push(customRules.trim());
    }

    return sections.join("\n") + "\n";
  }, [selected, customRules]);

  const toggleTemplate = useCallback(
    (name: string) => {
      trackFirstInteraction();
      setSelected((prev) => {
        const next = new Set(prev);
        if (next.has(name)) {
          next.delete(name);
        } else {
          next.add(name);
        }
        return next;
      });
    },
    [trackFirstInteraction]
  );

  const handleCopy = useCallback(() => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [output]);

  const handleDownload = useCallback(() => {
    if (!output) return;
    trackFirstInteraction();
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = ".gitignore";
    a.click();
    URL.revokeObjectURL(url);
  }, [output, trackFirstInteraction]);

  const handleClear = useCallback(() => {
    setSelected(new Set());
    setCustomRules("");
  }, []);

  const lineCount = output ? output.split("\n").length - 1 : 0;
  const patternCount = output
    ? output
        .split("\n")
        .filter(
          (line) =>
            line.trim() && !line.startsWith("#") && !line.startsWith("###")
        ).length
    : 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="mb-8 block text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        &larr; Back to tools
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        .gitignore Generator
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Select templates for your project stack to generate a comprehensive
        .gitignore file. Combine multiple templates and add custom rules.
      </p>

      <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        {/* Left: Template selector */}
        <div>
          {/* Search */}
          <div className="mb-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search templates..."
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
              spellCheck={false}
            />
          </div>

          {/* Category filter pills */}
          <div className="mb-4 flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory(null)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                activeCategory === null
                  ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
              }`}
            >
              All
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() =>
                  setActiveCategory(activeCategory === cat ? null : cat)
                }
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  activeCategory === cat
                    ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Template grid */}
          <div className="max-h-[480px] overflow-y-auto rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
            {filtered.length === 0 ? (
              <div className="p-8 text-center text-sm text-gray-500 dark:text-gray-400">
                No templates match your search.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-px bg-gray-200 dark:bg-gray-700 sm:grid-cols-3">
                {filtered.map((tpl) => {
                  const isSelected = selected.has(tpl.name);
                  return (
                    <button
                      key={tpl.name}
                      onClick={() => toggleTemplate(tpl.name)}
                      className={`flex flex-col items-start gap-1 p-3 text-left transition-colors ${
                        isSelected
                          ? "bg-indigo-50 dark:bg-indigo-950/50"
                          : "bg-white hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800"
                      }`}
                    >
                      <div className="flex w-full items-center justify-between">
                        <span
                          className={`text-sm font-medium ${
                            isSelected
                              ? "text-indigo-700 dark:text-indigo-400"
                              : "text-gray-900 dark:text-gray-100"
                          }`}
                        >
                          {tpl.name}
                        </span>
                        <div
                          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                            isSelected
                              ? "border-indigo-500 bg-indigo-500 dark:border-indigo-400 dark:bg-indigo-500"
                              : "border-gray-300 dark:border-gray-600"
                          }`}
                        >
                          {isSelected && (
                            <svg
                              className="h-3 w-3 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={3}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </div>
                      </div>
                      <span
                        className={`inline-block rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
                          CATEGORY_COLORS[tpl.category] || ""
                        }`}
                      >
                        {tpl.category}
                      </span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        {tpl.patterns.length} rules
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Selected count */}
          <div className="mt-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>
              {selected.size} template{selected.size !== 1 ? "s" : ""} selected
            </span>
            {selected.size > 0 && (
              <button
                onClick={handleClear}
                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Custom rules */}
          <div className="mt-4">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Custom Rules
            </label>
            <textarea
              value={customRules}
              onChange={(e) => {
                trackFirstInteraction();
                setCustomRules(e.target.value);
              }}
              placeholder="Add custom ignore patterns, one per line..."
              rows={4}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-mono text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
              spellCheck={false}
            />
          </div>
        </div>

        {/* Right: Output preview */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              .gitignore Preview
            </h2>
            {output && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {lineCount} lines &middot; {patternCount} patterns
              </span>
            )}
          </div>

          <div className="relative rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-950">
            {output ? (
              <pre className="max-h-[540px] overflow-auto p-4 font-mono text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-all">
                {output}
              </pre>
            ) : (
              <div className="flex h-[540px] items-center justify-center text-sm text-gray-400 dark:text-gray-500">
                Select templates to generate your .gitignore
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="mt-4 flex gap-3">
            <button
              onClick={handleCopy}
              disabled={!output}
              className="flex-1 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {copied ? "Copied!" : "Copy to Clipboard"}
            </button>
            <button
              onClick={handleDownload}
              disabled={!output}
              className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Download .gitignore
            </button>
          </div>
        </div>
      </div>

      {/* Info section */}
      <div className="mt-10 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          About .gitignore
        </h2>
        <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
          <li>
            <strong>.gitignore</strong> tells Git which files and directories to
            skip when tracking changes in your repository.
          </li>
          <li>
            Place the file at the <strong>root of your repository</strong>.
            Patterns apply recursively to all subdirectories.
          </li>
          <li>
            Lines starting with <code className="rounded bg-gray-200 px-1 dark:bg-gray-800">#</code> are comments.
            Use <code className="rounded bg-gray-200 px-1 dark:bg-gray-800">!</code> to negate a pattern and re-include a file.
          </li>
          <li>
            Trailing <code className="rounded bg-gray-200 px-1 dark:bg-gray-800">/</code> matches only directories.
            <code className="rounded bg-gray-200 px-1 dark:bg-gray-800">*</code> matches anything except <code className="rounded bg-gray-200 px-1 dark:bg-gray-800">/</code>,
            <code className="rounded bg-gray-200 px-1 dark:bg-gray-800">**</code> matches everything including nested paths.
          </li>
          <li>
            Everything runs in your browser — no data is sent over the network.
          </li>
        </ul>
      </div>
    </div>
  );
}
