"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";

// --- Types ---

interface BotRule {
  id: string;
  userAgent: string;
  allow: string[];
  disallow: string[];
  crawlDelay: string;
}

// --- Constants ---

const COMMON_BOTS = [
  { label: "All Bots", value: "*" },
  { label: "Googlebot", value: "Googlebot" },
  { label: "Googlebot-Image", value: "Googlebot-Image" },
  { label: "Bingbot", value: "Bingbot" },
  { label: "Slurp (Yahoo)", value: "Slurp" },
  { label: "DuckDuckBot", value: "DuckDuckBot" },
  { label: "Baiduspider", value: "Baiduspider" },
  { label: "YandexBot", value: "YandexBot" },
  { label: "facebot", value: "facebot" },
  { label: "Twitterbot", value: "Twitterbot" },
  { label: "Applebot", value: "Applebot" },
  { label: "AhrefsBot", value: "AhrefsBot" },
  { label: "SemrushBot", value: "SemrushBot" },
  { label: "GPTBot", value: "GPTBot" },
  { label: "ChatGPT-User", value: "ChatGPT-User" },
  { label: "ClaudeBot", value: "ClaudeBot" },
  { label: "Google-Extended", value: "Google-Extended" },
  { label: "CCBot", value: "CCBot" },
];

const COMMON_PATHS = [
  "/admin/",
  "/api/",
  "/private/",
  "/tmp/",
  "/cgi-bin/",
  "/wp-admin/",
  "/wp-includes/",
  "/wp-content/plugins/",
  "/search",
  "/login",
  "/register",
  "/checkout/",
  "/cart/",
  "/account/",
  "/*.json$",
  "/*.xml$",
  "/*.pdf$",
];

const PRESETS: Record<string, { label: string; description: string; rules: BotRule[]; sitemaps: string[] }> = {
  allowAll: {
    label: "Allow All",
    description: "Allow all crawlers to access everything",
    rules: [
      { id: "1", userAgent: "*", allow: ["/"], disallow: [], crawlDelay: "" },
    ],
    sitemaps: [],
  },
  blockAll: {
    label: "Block All",
    description: "Block all crawlers from accessing the site",
    rules: [
      { id: "1", userAgent: "*", allow: [], disallow: ["/"], crawlDelay: "" },
    ],
    sitemaps: [],
  },
  standard: {
    label: "Standard Website",
    description: "Allow crawling with common admin/private paths blocked",
    rules: [
      {
        id: "1",
        userAgent: "*",
        allow: ["/"],
        disallow: ["/admin/", "/api/", "/private/", "/cgi-bin/", "/search"],
        crawlDelay: "",
      },
    ],
    sitemaps: [],
  },
  wordpress: {
    label: "WordPress",
    description: "Standard WordPress robots.txt setup",
    rules: [
      {
        id: "1",
        userAgent: "*",
        allow: ["/wp-content/uploads/"],
        disallow: ["/wp-admin/", "/wp-includes/", "/wp-content/plugins/", "/trackback/", "/feed/", "/comments/"],
        crawlDelay: "",
      },
    ],
    sitemaps: ["/sitemap.xml"],
  },
  ecommerce: {
    label: "E-Commerce",
    description: "E-commerce site with cart/checkout blocked",
    rules: [
      {
        id: "1",
        userAgent: "*",
        allow: ["/"],
        disallow: ["/cart/", "/checkout/", "/account/", "/admin/", "/api/", "/search", "/wishlist/"],
        crawlDelay: "",
      },
    ],
    sitemaps: ["/sitemap.xml"],
  },
  blockAiBots: {
    label: "Block AI Bots",
    description: "Allow search engines but block AI training crawlers",
    rules: [
      { id: "1", userAgent: "*", allow: ["/"], disallow: [], crawlDelay: "" },
      { id: "2", userAgent: "GPTBot", allow: [], disallow: ["/"], crawlDelay: "" },
      { id: "3", userAgent: "ChatGPT-User", allow: [], disallow: ["/"], crawlDelay: "" },
      { id: "4", userAgent: "Google-Extended", allow: [], disallow: ["/"], crawlDelay: "" },
      { id: "5", userAgent: "CCBot", allow: [], disallow: ["/"], crawlDelay: "" },
      { id: "6", userAgent: "ClaudeBot", allow: [], disallow: ["/"], crawlDelay: "" },
    ],
    sitemaps: ["/sitemap.xml"],
  },
};

let nextId = 100;
function genId() {
  return String(nextId++);
}

// --- Component ---

export default function RobotsGeneratorTool() {
  const [rules, setRules] = useState<BotRule[]>([
    { id: genId(), userAgent: "*", allow: ["/"], disallow: [], crawlDelay: "" },
  ]);
  const [sitemaps, setSitemaps] = useState<string[]>([""]);
  const [copied, setCopied] = useState(false);
  const [activeRuleId, setActiveRuleId] = useState<string>(rules[0].id);
  const { trackFirstInteraction } = useToolAnalytics("robots-generator");

  // --- Helpers ---

  const updateRule = useCallback(
    (id: string, patch: Partial<BotRule>) => {
      trackFirstInteraction();
      setRules((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
    },
    [trackFirstInteraction]
  );

  const addRule = useCallback(() => {
    trackFirstInteraction();
    const newId = genId();
    setRules((prev) => [
      ...prev,
      { id: newId, userAgent: "Googlebot", allow: [], disallow: [], crawlDelay: "" },
    ]);
    setActiveRuleId(newId);
  }, [trackFirstInteraction]);

  const removeRule = useCallback(
    (id: string) => {
      setRules((prev) => {
        const next = prev.filter((r) => r.id !== id);
        if (next.length === 0) {
          const newId = genId();
          setActiveRuleId(newId);
          return [{ id: newId, userAgent: "*", allow: [], disallow: [], crawlDelay: "" }];
        }
        if (activeRuleId === id) {
          setActiveRuleId(next[0].id);
        }
        return next;
      });
    },
    [activeRuleId]
  );

  const addPath = useCallback(
    (ruleId: string, type: "allow" | "disallow", path: string) => {
      trackFirstInteraction();
      setRules((prev) =>
        prev.map((r) => {
          if (r.id !== ruleId) return r;
          const list = [...r[type]];
          if (!list.includes(path)) list.push(path);
          return { ...r, [type]: list };
        })
      );
    },
    [trackFirstInteraction]
  );

  const removePath = useCallback((ruleId: string, type: "allow" | "disallow", index: number) => {
    setRules((prev) =>
      prev.map((r) => {
        if (r.id !== ruleId) return r;
        const list = [...r[type]];
        list.splice(index, 1);
        return { ...r, [type]: list };
      })
    );
  }, []);

  const applyPreset = useCallback(
    (key: string) => {
      trackFirstInteraction();
      const preset = PRESETS[key];
      if (!preset) return;
      const newRules = preset.rules.map((r) => ({ ...r, id: genId() }));
      setRules(newRules);
      setActiveRuleId(newRules[0].id);
      setSitemaps(preset.sitemaps.length > 0 ? preset.sitemaps : [""]);
    },
    [trackFirstInteraction]
  );

  // --- Generate output ---

  const output = useMemo(() => {
    const lines: string[] = [];

    lines.push("# robots.txt");
    lines.push("# Generated by DevBolt robots.txt Generator");
    lines.push("# https://devbolt.dev/tools/robots-generator");
    lines.push("");

    for (const rule of rules) {
      lines.push(`User-agent: ${rule.userAgent}`);

      for (const p of rule.disallow) {
        if (p.trim()) lines.push(`Disallow: ${p.trim()}`);
      }
      if (rule.disallow.length === 0) {
        // When no disallows, explicitly show Disallow: (empty = allow all)
        // But only if there are no Allow directives either, or we just show Allow
      }

      for (const p of rule.allow) {
        if (p.trim()) lines.push(`Allow: ${p.trim()}`);
      }

      if (rule.crawlDelay.trim()) {
        lines.push(`Crawl-delay: ${rule.crawlDelay.trim()}`);
      }

      lines.push("");
    }

    const validSitemaps = sitemaps.filter((s) => s.trim());
    for (const s of validSitemaps) {
      lines.push(`Sitemap: ${s.trim()}`);
    }
    if (validSitemaps.length > 0) lines.push("");

    return lines.join("\n");
  }, [rules, sitemaps]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [output]);

  const handleDownload = useCallback(() => {
    trackFirstInteraction();
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "robots.txt";
    a.click();
    URL.revokeObjectURL(url);
  }, [output, trackFirstInteraction]);

  const activeRule = rules.find((r) => r.id === activeRuleId) || rules[0];
  const [newAllowPath, setNewAllowPath] = useState("");
  const [newDisallowPath, setNewDisallowPath] = useState("");

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="mb-8 block text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        &larr; Back to tools
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        robots.txt Generator
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Generate a robots.txt file to control how search engines crawl your
        website. Add rules for specific bots, set allowed/disallowed paths,
        crawl delays, and sitemaps.
      </p>

      {/* Presets */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Presets
        </h2>
        <div className="flex flex-wrap gap-2">
          {Object.entries(PRESETS).map(([key, preset]) => (
            <button
              key={key}
              onClick={() => applyPreset(key)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
              title={preset.description}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        {/* Left: Rule editor */}
        <div>
          {/* Rule tabs */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {rules.map((rule) => (
              <button
                key={rule.id}
                onClick={() => setActiveRuleId(rule.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  activeRuleId === rule.id
                    ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                }`}
              >
                {rule.userAgent}
              </button>
            ))}
            <button
              onClick={addRule}
              className="rounded-lg border border-dashed border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-500 transition-colors hover:border-indigo-400 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-400 dark:hover:border-indigo-500 dark:hover:text-indigo-400"
            >
              + Add Rule
            </button>
          </div>

          {/* Active rule editor */}
          {activeRule && (
            <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
              {/* User-Agent selector */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  User-Agent
                </label>
                <div className="flex gap-2">
                  <select
                    value={
                      COMMON_BOTS.find((b) => b.value === activeRule.userAgent)
                        ? activeRule.userAgent
                        : "__custom__"
                    }
                    onChange={(e) => {
                      if (e.target.value !== "__custom__") {
                        updateRule(activeRule.id, { userAgent: e.target.value });
                      }
                    }}
                    className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                  >
                    {COMMON_BOTS.map((bot) => (
                      <option key={bot.value} value={bot.value}>
                        {bot.label}
                      </option>
                    ))}
                    <option value="__custom__">Custom...</option>
                  </select>
                  {!COMMON_BOTS.find((b) => b.value === activeRule.userAgent) && (
                    <input
                      type="text"
                      value={activeRule.userAgent}
                      onChange={(e) =>
                        updateRule(activeRule.id, { userAgent: e.target.value })
                      }
                      placeholder="Custom bot name"
                      className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                      spellCheck={false}
                    />
                  )}
                </div>
              </div>

              {/* Disallow paths */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Disallow (blocked paths)
                </label>
                <div className="space-y-1.5">
                  {activeRule.disallow.map((path, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <code className="flex-1 rounded border border-red-200 bg-red-50 px-3 py-1.5 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
                        {path}
                      </code>
                      <button
                        onClick={() => removePath(activeRule.id, "disallow", i)}
                        className="rounded p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                        title="Remove"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newDisallowPath}
                      onChange={(e) => setNewDisallowPath(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && newDisallowPath.trim()) {
                          addPath(activeRule.id, "disallow", newDisallowPath.trim());
                          setNewDisallowPath("");
                        }
                      }}
                      placeholder="/path-to-block/"
                      className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                      spellCheck={false}
                    />
                    <button
                      onClick={() => {
                        if (newDisallowPath.trim()) {
                          addPath(activeRule.id, "disallow", newDisallowPath.trim());
                          setNewDisallowPath("");
                        }
                      }}
                      className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/50"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Quick-add common paths */}
                <div className="mt-2 flex flex-wrap gap-1">
                  {COMMON_PATHS.filter((p) => !activeRule.disallow.includes(p))
                    .slice(0, 8)
                    .map((path) => (
                      <button
                        key={path}
                        onClick={() => addPath(activeRule.id, "disallow", path)}
                        className="rounded border border-gray-200 bg-gray-50 px-2 py-0.5 text-[11px] font-mono text-gray-500 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:border-red-800 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                      >
                        {path}
                      </button>
                    ))}
                </div>
              </div>

              {/* Allow paths */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Allow (explicitly allowed paths)
                </label>
                <div className="space-y-1.5">
                  {activeRule.allow.map((path, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <code className="flex-1 rounded border border-green-200 bg-green-50 px-3 py-1.5 text-sm text-green-700 dark:border-green-900 dark:bg-green-950/30 dark:text-green-400">
                        {path}
                      </code>
                      <button
                        onClick={() => removePath(activeRule.id, "allow", i)}
                        className="rounded p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                        title="Remove"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newAllowPath}
                      onChange={(e) => setNewAllowPath(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && newAllowPath.trim()) {
                          addPath(activeRule.id, "allow", newAllowPath.trim());
                          setNewAllowPath("");
                        }
                      }}
                      placeholder="/path-to-allow/"
                      className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                      spellCheck={false}
                    />
                    <button
                      onClick={() => {
                        if (newAllowPath.trim()) {
                          addPath(activeRule.id, "allow", newAllowPath.trim());
                          setNewAllowPath("");
                        }
                      }}
                      className="rounded-lg bg-green-50 px-3 py-1.5 text-xs font-medium text-green-600 hover:bg-green-100 dark:bg-green-950/30 dark:text-green-400 dark:hover:bg-green-950/50"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Crawl-delay */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Crawl-delay (seconds, optional)
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={activeRule.crawlDelay}
                  onChange={(e) =>
                    updateRule(activeRule.id, { crawlDelay: e.target.value })
                  }
                  placeholder="e.g. 10"
                  className="w-32 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                />
                <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                  Seconds between requests. Not supported by all bots.
                </p>
              </div>

              {/* Remove rule button */}
              {rules.length > 1 && (
                <button
                  onClick={() => removeRule(activeRule.id)}
                  className="text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  Remove this rule
                </button>
              )}
            </div>
          )}

          {/* Sitemaps */}
          <div className="mt-6">
            <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Sitemaps
            </label>
            <div className="space-y-2">
              {sitemaps.map((sitemap, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    value={sitemap}
                    onChange={(e) => {
                      trackFirstInteraction();
                      const next = [...sitemaps];
                      next[i] = e.target.value;
                      setSitemaps(next);
                    }}
                    placeholder="https://example.com/sitemap.xml"
                    className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                    spellCheck={false}
                  />
                  {sitemaps.length > 1 && (
                    <button
                      onClick={() =>
                        setSitemaps((prev) => prev.filter((_, j) => j !== i))
                      }
                      className="rounded p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                      title="Remove"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => setSitemaps((prev) => [...prev, ""])}
                className="text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                + Add sitemap
              </button>
            </div>
          </div>
        </div>

        {/* Right: Output preview */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              robots.txt Preview
            </h2>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {rules.length} rule{rules.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="relative rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-950">
            <pre className="max-h-[540px] min-h-[300px] overflow-auto p-4 font-mono text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-all">
              {output}
            </pre>
          </div>

          {/* Action buttons */}
          <div className="mt-4 flex gap-3">
            <button
              onClick={handleCopy}
              className="flex-1 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
            >
              {copied ? "Copied!" : "Copy to Clipboard"}
            </button>
            <button
              onClick={handleDownload}
              className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Download robots.txt
            </button>
          </div>
        </div>
      </div>

      {/* Info section */}
      <div className="mt-10 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          About robots.txt
        </h2>
        <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
          <li>
            <strong>robots.txt</strong> is a text file placed at the root of
            your website that tells search engine crawlers which pages they can
            or cannot access.
          </li>
          <li>
            <code className="rounded bg-gray-200 px-1 dark:bg-gray-800">
              User-agent
            </code>{" "}
            specifies which bot the rules apply to.{" "}
            <code className="rounded bg-gray-200 px-1 dark:bg-gray-800">*</code>{" "}
            means all bots.
          </li>
          <li>
            <code className="rounded bg-gray-200 px-1 dark:bg-gray-800">
              Disallow
            </code>{" "}
            blocks a path from crawling.{" "}
            <code className="rounded bg-gray-200 px-1 dark:bg-gray-800">
              Allow
            </code>{" "}
            overrides a disallow for a more specific path.
          </li>
          <li>
            <code className="rounded bg-gray-200 px-1 dark:bg-gray-800">
              Crawl-delay
            </code>{" "}
            sets seconds between requests (supported by Bing, Yandex; ignored by Google).
          </li>
          <li>
            <code className="rounded bg-gray-200 px-1 dark:bg-gray-800">
              Sitemap
            </code>{" "}
            directives help crawlers discover your sitemap. Use full URLs.
          </li>
          <li>
            robots.txt is advisory — well-behaved bots follow it, but it does not
            enforce access control. Use authentication for truly private content.
          </li>
          <li>
            Everything runs in your browser — no data is sent over the network.
          </li>
        </ul>
      </div>
    </div>
  );
}
