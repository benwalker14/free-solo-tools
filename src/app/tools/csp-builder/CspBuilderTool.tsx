"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type SourceValue =
  | "'self'"
  | "'none'"
  | "'unsafe-inline'"
  | "'unsafe-eval'"
  | "'strict-dynamic'"
  | "'unsafe-hashes'"
  | "'wasm-unsafe-eval'"
  | "data:"
  | "blob:"
  | "mediastream:"
  | "https:"
  | "http:"
  | "*";

interface DirectiveConfig {
  key: string;
  label: string;
  description: string;
  enabled: boolean;
  sources: SourceValue[];
  customSources: string;
  category: "fetch" | "document" | "navigation" | "reporting";
}

interface Preset {
  id: string;
  name: string;
  description: string;
  directives: Partial<Record<string, { enabled: boolean; sources: SourceValue[]; customSources: string }>>;
}

type Tab = "builder" | "presets" | "reference";
type OutputFormat = "header" | "meta" | "nginx" | "apache" | "vercel" | "netlify";

// ---------------------------------------------------------------------------
// Source options
// ---------------------------------------------------------------------------

const SOURCE_OPTIONS: { value: SourceValue; label: string; description: string }[] = [
  { value: "'self'", label: "'self'", description: "Same origin (protocol + host + port)" },
  { value: "'none'", label: "'none'", description: "Block all sources for this directive" },
  { value: "'unsafe-inline'", label: "'unsafe-inline'", description: "Allow inline scripts/styles (weakens CSP)" },
  { value: "'unsafe-eval'", label: "'unsafe-eval'", description: "Allow eval() and similar (weakens CSP)" },
  { value: "'strict-dynamic'", label: "'strict-dynamic'", description: "Trust scripts loaded by trusted scripts" },
  { value: "'unsafe-hashes'", label: "'unsafe-hashes'", description: "Allow specific inline event handlers" },
  { value: "'wasm-unsafe-eval'", label: "'wasm-unsafe-eval'", description: "Allow WebAssembly compilation" },
  { value: "data:", label: "data:", description: "Allow data: URIs" },
  { value: "blob:", label: "blob:", description: "Allow blob: URIs" },
  { value: "mediastream:", label: "mediastream:", description: "Allow mediastream: URIs" },
  { value: "https:", label: "https:", description: "Allow any HTTPS source" },
  { value: "http:", label: "http:", description: "Allow any HTTP source (insecure)" },
  { value: "*", label: "*", description: "Allow all sources (defeats CSP purpose)" },
];

// ---------------------------------------------------------------------------
// Directive definitions
// ---------------------------------------------------------------------------

function createDirectives(): DirectiveConfig[] {
  return [
    { key: "default-src", label: "default-src", description: "Fallback for all fetch directives not explicitly set", enabled: false, sources: [], customSources: "", category: "fetch" },
    { key: "script-src", label: "script-src", description: "Controls which scripts can execute", enabled: false, sources: [], customSources: "", category: "fetch" },
    { key: "style-src", label: "style-src", description: "Controls which stylesheets can be applied", enabled: false, sources: [], customSources: "", category: "fetch" },
    { key: "img-src", label: "img-src", description: "Controls which images can be loaded", enabled: false, sources: [], customSources: "", category: "fetch" },
    { key: "font-src", label: "font-src", description: "Controls which fonts can be loaded", enabled: false, sources: [], customSources: "", category: "fetch" },
    { key: "connect-src", label: "connect-src", description: "Controls which URLs can be loaded via fetch, XHR, WebSocket", enabled: false, sources: [], customSources: "", category: "fetch" },
    { key: "media-src", label: "media-src", description: "Controls which audio/video sources can be loaded", enabled: false, sources: [], customSources: "", category: "fetch" },
    { key: "object-src", label: "object-src", description: "Controls <object>, <embed>, and <applet> sources", enabled: false, sources: [], customSources: "", category: "fetch" },
    { key: "frame-src", label: "frame-src", description: "Controls which URLs can be embedded in iframes", enabled: false, sources: [], customSources: "", category: "fetch" },
    { key: "child-src", label: "child-src", description: "Controls web workers and nested browsing contexts", enabled: false, sources: [], customSources: "", category: "fetch" },
    { key: "worker-src", label: "worker-src", description: "Controls which scripts can be run as workers", enabled: false, sources: [], customSources: "", category: "fetch" },
    { key: "manifest-src", label: "manifest-src", description: "Controls which manifest files can be loaded", enabled: false, sources: [], customSources: "", category: "fetch" },
    { key: "prefetch-src", label: "prefetch-src", description: "Controls which resources can be prefetched", enabled: false, sources: [], customSources: "", category: "fetch" },
    { key: "base-uri", label: "base-uri", description: "Restricts URLs for the <base> element", enabled: false, sources: [], customSources: "", category: "document" },
    { key: "form-action", label: "form-action", description: "Restricts URLs that forms can submit to", enabled: false, sources: [], customSources: "", category: "navigation" },
    { key: "frame-ancestors", label: "frame-ancestors", description: "Controls which pages can embed this page (clickjacking protection)", enabled: false, sources: [], customSources: "", category: "navigation" },
    { key: "navigate-to", label: "navigate-to", description: "Restricts URLs the page can navigate to", enabled: false, sources: [], customSources: "", category: "navigation" },
  ];
}

// ---------------------------------------------------------------------------
// Presets
// ---------------------------------------------------------------------------

const PRESETS: Preset[] = [
  {
    id: "strict",
    name: "Strict (Recommended)",
    description: "Tight policy — blocks inline scripts/styles, no eval, self-only sources. Best security baseline.",
    directives: {
      "default-src": { enabled: true, sources: ["'self'"], customSources: "" },
      "script-src": { enabled: true, sources: ["'self'"], customSources: "" },
      "style-src": { enabled: true, sources: ["'self'"], customSources: "" },
      "img-src": { enabled: true, sources: ["'self'"], customSources: "" },
      "font-src": { enabled: true, sources: ["'self'"], customSources: "" },
      "connect-src": { enabled: true, sources: ["'self'"], customSources: "" },
      "object-src": { enabled: true, sources: ["'none'"], customSources: "" },
      "frame-ancestors": { enabled: true, sources: ["'none'"], customSources: "" },
      "base-uri": { enabled: true, sources: ["'self'"], customSources: "" },
      "form-action": { enabled: true, sources: ["'self'"], customSources: "" },
    },
  },
  {
    id: "moderate",
    name: "Moderate",
    description: "Allows inline styles and HTTPS images. Good balance of security and compatibility.",
    directives: {
      "default-src": { enabled: true, sources: ["'self'"], customSources: "" },
      "script-src": { enabled: true, sources: ["'self'"], customSources: "" },
      "style-src": { enabled: true, sources: ["'self'", "'unsafe-inline'"], customSources: "" },
      "img-src": { enabled: true, sources: ["'self'", "data:", "https:"], customSources: "" },
      "font-src": { enabled: true, sources: ["'self'", "https:"], customSources: "" },
      "connect-src": { enabled: true, sources: ["'self'"], customSources: "" },
      "object-src": { enabled: true, sources: ["'none'"], customSources: "" },
      "frame-ancestors": { enabled: true, sources: ["'self'"], customSources: "" },
      "base-uri": { enabled: true, sources: ["'self'"], customSources: "" },
      "form-action": { enabled: true, sources: ["'self'"], customSources: "" },
    },
  },
  {
    id: "nextjs",
    name: "Next.js",
    description: "Tuned for Next.js apps — allows inline styles (CSS-in-JS), image CDNs, and Vercel analytics.",
    directives: {
      "default-src": { enabled: true, sources: ["'self'"], customSources: "" },
      "script-src": { enabled: true, sources: ["'self'", "'unsafe-eval'"], customSources: "" },
      "style-src": { enabled: true, sources: ["'self'", "'unsafe-inline'"], customSources: "" },
      "img-src": { enabled: true, sources: ["'self'", "data:", "blob:", "https:"], customSources: "" },
      "font-src": { enabled: true, sources: ["'self'"], customSources: "" },
      "connect-src": { enabled: true, sources: ["'self'"], customSources: "https://vitals.vercel-insights.com" },
      "object-src": { enabled: true, sources: ["'none'"], customSources: "" },
      "frame-ancestors": { enabled: true, sources: ["'none'"], customSources: "" },
      "base-uri": { enabled: true, sources: ["'self'"], customSources: "" },
    },
  },
  {
    id: "react-spa",
    name: "React / Vite SPA",
    description: "For React SPAs built with Vite or CRA — allows inline styles and eval for HMR in dev.",
    directives: {
      "default-src": { enabled: true, sources: ["'self'"], customSources: "" },
      "script-src": { enabled: true, sources: ["'self'", "'unsafe-inline'"], customSources: "" },
      "style-src": { enabled: true, sources: ["'self'", "'unsafe-inline'"], customSources: "" },
      "img-src": { enabled: true, sources: ["'self'", "data:", "blob:"], customSources: "" },
      "font-src": { enabled: true, sources: ["'self'", "data:"], customSources: "" },
      "connect-src": { enabled: true, sources: ["'self'"], customSources: "" },
      "object-src": { enabled: true, sources: ["'none'"], customSources: "" },
      "base-uri": { enabled: true, sources: ["'self'"], customSources: "" },
      "form-action": { enabled: true, sources: ["'self'"], customSources: "" },
    },
  },
  {
    id: "wordpress",
    name: "WordPress",
    description: "Compatible with WordPress — allows inline scripts/styles, admin AJAX, and common CDNs.",
    directives: {
      "default-src": { enabled: true, sources: ["'self'"], customSources: "" },
      "script-src": { enabled: true, sources: ["'self'", "'unsafe-inline'", "'unsafe-eval'"], customSources: "" },
      "style-src": { enabled: true, sources: ["'self'", "'unsafe-inline'"], customSources: "https://fonts.googleapis.com" },
      "img-src": { enabled: true, sources: ["'self'", "data:", "https:"], customSources: "" },
      "font-src": { enabled: true, sources: ["'self'"], customSources: "https://fonts.gstatic.com" },
      "connect-src": { enabled: true, sources: ["'self'"], customSources: "" },
      "object-src": { enabled: true, sources: ["'none'"], customSources: "" },
      "frame-src": { enabled: true, sources: ["'self'"], customSources: "" },
      "base-uri": { enabled: true, sources: ["'self'"], customSources: "" },
      "form-action": { enabled: true, sources: ["'self'"], customSources: "" },
    },
  },
  {
    id: "api-only",
    name: "API-Only / Headless",
    description: "Maximal lockdown for APIs with no browser rendering — blocks everything.",
    directives: {
      "default-src": { enabled: true, sources: ["'none'"], customSources: "" },
      "script-src": { enabled: true, sources: ["'none'"], customSources: "" },
      "style-src": { enabled: true, sources: ["'none'"], customSources: "" },
      "img-src": { enabled: true, sources: ["'none'"], customSources: "" },
      "frame-ancestors": { enabled: true, sources: ["'none'"], customSources: "" },
      "base-uri": { enabled: true, sources: ["'none'"], customSources: "" },
      "form-action": { enabled: true, sources: ["'none'"], customSources: "" },
    },
  },
  {
    id: "google-fonts",
    name: "Google Fonts + Analytics",
    description: "Self-hosted app using Google Fonts and Google Analytics — adds required CDN domains.",
    directives: {
      "default-src": { enabled: true, sources: ["'self'"], customSources: "" },
      "script-src": { enabled: true, sources: ["'self'"], customSources: "https://www.googletagmanager.com https://www.google-analytics.com" },
      "style-src": { enabled: true, sources: ["'self'", "'unsafe-inline'"], customSources: "https://fonts.googleapis.com" },
      "img-src": { enabled: true, sources: ["'self'", "data:"], customSources: "https://www.google-analytics.com" },
      "font-src": { enabled: true, sources: ["'self'"], customSources: "https://fonts.gstatic.com" },
      "connect-src": { enabled: true, sources: ["'self'"], customSources: "https://www.google-analytics.com https://analytics.google.com" },
      "object-src": { enabled: true, sources: ["'none'"], customSources: "" },
      "frame-ancestors": { enabled: true, sources: ["'none'"], customSources: "" },
      "base-uri": { enabled: true, sources: ["'self'"], customSources: "" },
      "form-action": { enabled: true, sources: ["'self'"], customSources: "" },
    },
  },
];

// ---------------------------------------------------------------------------
// Reference data
// ---------------------------------------------------------------------------

interface ReferenceEntry {
  directive: string;
  description: string;
  example: string;
  category: string;
}

const REFERENCE: ReferenceEntry[] = [
  { directive: "default-src", description: "Fallback policy for all unspecified fetch directives. Set this first, then override specific directives as needed.", example: "default-src 'self'", category: "Fetch" },
  { directive: "script-src", description: "Controls which scripts can be executed. Most important directive for XSS prevention.", example: "script-src 'self' https://cdn.example.com", category: "Fetch" },
  { directive: "style-src", description: "Controls which stylesheets can be applied. CSS-in-JS frameworks often require 'unsafe-inline'.", example: "style-src 'self' 'unsafe-inline'", category: "Fetch" },
  { directive: "img-src", description: "Controls image loading. data: is needed for inline images. Consider https: for user-uploaded image CDNs.", example: "img-src 'self' data: https:", category: "Fetch" },
  { directive: "font-src", description: "Controls font loading. Required for web fonts from CDNs like Google Fonts.", example: "font-src 'self' https://fonts.gstatic.com", category: "Fetch" },
  { directive: "connect-src", description: "Controls fetch(), XHR, WebSocket, and EventSource destinations. Must include API endpoints.", example: "connect-src 'self' https://api.example.com", category: "Fetch" },
  { directive: "media-src", description: "Controls audio and video element sources.", example: "media-src 'self'", category: "Fetch" },
  { directive: "object-src", description: "Controls <object>, <embed>, and <applet>. Almost always set to 'none' — these elements are legacy.", example: "object-src 'none'", category: "Fetch" },
  { directive: "frame-src", description: "Controls which URLs can be loaded in <iframe> and <frame> elements.", example: "frame-src 'self' https://www.youtube.com", category: "Fetch" },
  { directive: "child-src", description: "Controls web workers and nested browsing contexts. Fallback: script-src and frame-src.", example: "child-src 'self' blob:", category: "Fetch" },
  { directive: "worker-src", description: "Controls Worker, SharedWorker, and ServiceWorker scripts.", example: "worker-src 'self' blob:", category: "Fetch" },
  { directive: "manifest-src", description: "Controls web app manifest loading.", example: "manifest-src 'self'", category: "Fetch" },
  { directive: "base-uri", description: "Restricts <base> element URLs. Set to 'self' to prevent base-tag injection attacks.", example: "base-uri 'self'", category: "Document" },
  { directive: "form-action", description: "Restricts form submission URLs. Prevents form-based data exfiltration.", example: "form-action 'self'", category: "Navigation" },
  { directive: "frame-ancestors", description: "Controls which pages can embed this page in <iframe>. Replaces X-Frame-Options. NOT supported in meta tags.", example: "frame-ancestors 'none'", category: "Navigation" },
  { directive: "upgrade-insecure-requests", description: "Instructs browsers to upgrade HTTP requests to HTTPS. No value needed.", example: "upgrade-insecure-requests", category: "Document" },
  { directive: "block-all-mixed-content", description: "Blocks all HTTP resources on HTTPS pages. Deprecated in favor of upgrade-insecure-requests.", example: "block-all-mixed-content", category: "Document" },
  { directive: "report-uri", description: "URL to send CSP violation reports to (deprecated in CSP3, use report-to instead).", example: "report-uri /csp-report", category: "Reporting" },
  { directive: "report-to", description: "Reporting API group name for CSP violation reports (CSP Level 3).", example: "report-to csp-endpoint", category: "Reporting" },
];

// ---------------------------------------------------------------------------
// Utility: generate CSP string
// ---------------------------------------------------------------------------

function generateCsp(directives: DirectiveConfig[], upgradeInsecure: boolean): string {
  const parts: string[] = [];

  for (const d of directives) {
    if (!d.enabled) continue;
    const allSources = [
      ...d.sources,
      ...d.customSources
        .split(/[\s,]+/)
        .map((s) => s.trim())
        .filter(Boolean),
    ];
    if (allSources.length === 0) continue;
    parts.push(`${d.key} ${allSources.join(" ")}`);
  }

  if (upgradeInsecure) {
    parts.push("upgrade-insecure-requests");
  }

  return parts.join("; ");
}

// ---------------------------------------------------------------------------
// Utility: security analysis
// ---------------------------------------------------------------------------

interface SecurityIssue {
  level: "error" | "warning" | "info";
  message: string;
}

function analyzeSecurity(directives: DirectiveConfig[], upgradeInsecure: boolean): SecurityIssue[] {
  const issues: SecurityIssue[] = [];
  const enabled = directives.filter((d) => d.enabled);
  const get = (key: string) => enabled.find((d) => d.key === key);

  if (enabled.length === 0) {
    issues.push({ level: "info", message: "No directives enabled. Enable at least default-src to start." });
    return issues;
  }

  if (!get("default-src")) {
    issues.push({ level: "warning", message: "No default-src set — unspecified directives will have no restrictions." });
  }

  const scriptSrc = get("script-src") || get("default-src");
  if (scriptSrc) {
    const all = [...scriptSrc.sources, ...scriptSrc.customSources.split(/[\s,]+/).filter(Boolean)];
    if (all.includes("'unsafe-inline'") && !all.includes("'strict-dynamic'")) {
      issues.push({ level: "warning", message: "script-src allows 'unsafe-inline' — vulnerable to XSS injection." });
    }
    if (all.includes("'unsafe-eval'")) {
      issues.push({ level: "warning", message: "script-src allows 'unsafe-eval' — eval() and new Function() are permitted." });
    }
    if (all.includes("*")) {
      issues.push({ level: "error", message: "script-src uses wildcard (*) — any domain can execute scripts." });
    }
    if (all.includes("http:")) {
      issues.push({ level: "error", message: "script-src allows http: — scripts can be loaded over insecure connections." });
    }
  }

  const styleSrc = get("style-src") || get("default-src");
  if (styleSrc) {
    const all = [...styleSrc.sources, ...styleSrc.customSources.split(/[\s,]+/).filter(Boolean)];
    if (all.includes("*")) {
      issues.push({ level: "error", message: "style-src uses wildcard (*) — any domain can inject styles." });
    }
  }

  if (!get("object-src")) {
    const def = get("default-src");
    if (!def || !def.sources.includes("'none'")) {
      issues.push({ level: "warning", message: "object-src not set — <object> and <embed> elements are unrestricted." });
    }
  }

  if (!get("base-uri")) {
    issues.push({ level: "info", message: "base-uri not set — consider restricting to 'self' to prevent base-tag hijacking." });
  }

  if (!get("frame-ancestors")) {
    issues.push({ level: "info", message: "frame-ancestors not set — page can be embedded in iframes (clickjacking risk)." });
  }

  if (!upgradeInsecure) {
    issues.push({ level: "info", message: "upgrade-insecure-requests not enabled — HTTP resources won't auto-upgrade to HTTPS." });
  }

  if (issues.length === 0) {
    issues.push({ level: "info", message: "Policy looks strong. Test it in report-only mode before deploying." });
  }

  return issues;
}

// ---------------------------------------------------------------------------
// Utility: format output
// ---------------------------------------------------------------------------

function formatOutput(csp: string, format: OutputFormat): string {
  if (!csp) return "// Enable at least one directive to generate output";

  switch (format) {
    case "header":
      return `Content-Security-Policy: ${csp}`;
    case "meta":
      return `<meta http-equiv="Content-Security-Policy" content="${csp}">`;
    case "nginx":
      return `add_header Content-Security-Policy "${csp}" always;`;
    case "apache":
      return `Header always set Content-Security-Policy "${csp}"`;
    case "vercel":
      return JSON.stringify(
        {
          headers: [
            {
              source: "/(.*)",
              headers: [
                {
                  key: "Content-Security-Policy",
                  value: csp,
                },
              ],
            },
          ],
        },
        null,
        2,
      );
    case "netlify":
      return `[[headers]]\n  for = "/*"\n  [headers.values]\n    Content-Security-Policy = "${csp}"`;
    default:
      return csp;
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function CspBuilderTool() {
  useToolAnalytics("csp-builder");

  const [tab, setTab] = useState<Tab>("builder");
  const [directives, setDirectives] = useState<DirectiveConfig[]>(createDirectives);
  const [upgradeInsecure, setUpgradeInsecure] = useState(true);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("header");
  const [copied, setCopied] = useState(false);
  const [refSearch, setRefSearch] = useState("");

  // Generate CSP
  const csp = useMemo(() => generateCsp(directives, upgradeInsecure), [directives, upgradeInsecure]);
  const output = useMemo(() => formatOutput(csp, outputFormat), [csp, outputFormat]);
  const issues = useMemo(() => analyzeSecurity(directives, upgradeInsecure), [directives, upgradeInsecure]);

  // Directive helpers
  const toggleDirective = useCallback((key: string) => {
    setDirectives((prev) =>
      prev.map((d) => (d.key === key ? { ...d, enabled: !d.enabled } : d)),
    );
  }, []);

  const toggleSource = useCallback((key: string, source: SourceValue) => {
    setDirectives((prev) =>
      prev.map((d) => {
        if (d.key !== key) return d;
        const has = d.sources.includes(source);
        return {
          ...d,
          sources: has ? d.sources.filter((s) => s !== source) : [...d.sources, source],
        };
      }),
    );
  }, []);

  const setCustomSources = useCallback((key: string, value: string) => {
    setDirectives((prev) =>
      prev.map((d) => (d.key === key ? { ...d, customSources: value } : d)),
    );
  }, []);

  // Apply preset
  const applyPreset = useCallback((preset: Preset) => {
    setDirectives((prev) =>
      prev.map((d) => {
        const pd = preset.directives[d.key];
        if (pd) {
          return { ...d, enabled: pd.enabled, sources: pd.sources as SourceValue[], customSources: pd.customSources };
        }
        return { ...d, enabled: false, sources: [], customSources: "" };
      }),
    );
  }, []);

  // Reset
  const resetAll = useCallback(() => {
    setDirectives(createDirectives());
    setUpgradeInsecure(true);
  }, []);

  // Copy
  const copyOutput = useCallback(() => {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [output]);

  // Filtered reference
  const filteredRef = useMemo(() => {
    if (!refSearch.trim()) return REFERENCE;
    const q = refSearch.toLowerCase();
    return REFERENCE.filter(
      (r) =>
        r.directive.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q),
    );
  }, [refSearch]);

  // Group directives by category
  const directiveGroups = useMemo(() => {
    const groups: Record<string, DirectiveConfig[]> = {};
    for (const d of directives) {
      const cat = d.category;
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(d);
    }
    return groups;
  }, [directives]);

  const categoryLabels: Record<string, string> = {
    fetch: "Fetch Directives",
    document: "Document Directives",
    navigation: "Navigation Directives",
    reporting: "Reporting Directives",
  };

  const enabledCount = directives.filter((d) => d.enabled).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          CSP Header Builder
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Build Content Security Policy headers visually with framework presets, security analysis, and multi-format output.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
        {(
          [
            { id: "builder" as Tab, label: "Builder", count: enabledCount },
            { id: "presets" as Tab, label: "Presets" },
            { id: "reference" as Tab, label: "Reference" },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              tab === t.id
                ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-gray-100"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            {t.label}
            {"count" in t && t.count ? (
              <span className="ml-1.5 inline-flex items-center rounded-full bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                {t.count}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {/* Builder Tab */}
      {tab === "builder" && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left: Directives */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Directives
              </h2>
              <button
                onClick={resetAll}
                className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Reset All
              </button>
            </div>

            {/* Upgrade insecure */}
            <label className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5 dark:border-gray-700 dark:bg-gray-800">
              <input
                type="checkbox"
                checked={upgradeInsecure}
                onChange={() => setUpgradeInsecure((v) => !v)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600"
              />
              <div>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  upgrade-insecure-requests
                </span>
                <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                  Auto-upgrade HTTP to HTTPS
                </span>
              </div>
            </label>

            {/* Directive groups */}
            {Object.entries(directiveGroups).map(([cat, dirs]) => (
              <div key={cat}>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  {categoryLabels[cat] || cat}
                </h3>
                <div className="space-y-2">
                  {dirs.map((d) => (
                    <div
                      key={d.key}
                      className={`rounded-lg border transition-colors ${
                        d.enabled
                          ? "border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-900/20"
                          : "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
                      }`}
                    >
                      {/* Directive header */}
                      <label className="flex cursor-pointer items-center gap-2 px-3 py-2.5">
                        <input
                          type="checkbox"
                          checked={d.enabled}
                          onChange={() => toggleDirective(d.key)}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600"
                        />
                        <div className="min-w-0 flex-1">
                          <span className="text-sm font-mono font-medium text-gray-900 dark:text-gray-100">
                            {d.label}
                          </span>
                          <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                            {d.description}
                          </span>
                        </div>
                      </label>

                      {/* Sources (when enabled) */}
                      {d.enabled && (
                        <div className="border-t border-gray-200 px-3 py-2.5 dark:border-gray-700">
                          <div className="flex flex-wrap gap-1.5">
                            {SOURCE_OPTIONS.map((src) => {
                              const active = d.sources.includes(src.value);
                              // 'none' is exclusive
                              const isNone = src.value === "'none'";
                              const hasNone = d.sources.includes("'none'");
                              const disabled = !isNone && hasNone;

                              return (
                                <button
                                  key={src.value}
                                  onClick={() => {
                                    if (disabled) return;
                                    if (isNone && !active) {
                                      // Selecting 'none' clears all others
                                      setDirectives((prev) =>
                                        prev.map((dd) =>
                                          dd.key === d.key ? { ...dd, sources: ["'none'"] } : dd,
                                        ),
                                      );
                                    } else if (!isNone && active) {
                                      toggleSource(d.key, src.value);
                                    } else if (!isNone && !active) {
                                      // Adding a source removes 'none'
                                      setDirectives((prev) =>
                                        prev.map((dd) =>
                                          dd.key === d.key
                                            ? { ...dd, sources: [...dd.sources.filter((s) => s !== "'none'"), src.value] }
                                            : dd,
                                        ),
                                      );
                                    } else {
                                      toggleSource(d.key, src.value);
                                    }
                                  }}
                                  title={src.description}
                                  className={`rounded px-2 py-0.5 text-xs font-mono transition-colors ${
                                    active
                                      ? src.value === "'unsafe-inline'" || src.value === "'unsafe-eval'" || src.value === "*" || src.value === "http:"
                                        ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                                        : src.value === "'none'"
                                          ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                          : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                                      : disabled
                                        ? "bg-gray-50 text-gray-300 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
                                  }`}
                                >
                                  {src.label}
                                </button>
                              );
                            })}
                          </div>

                          {/* Custom sources */}
                          <input
                            type="text"
                            value={d.customSources}
                            onChange={(e) => setCustomSources(d.key, e.target.value)}
                            placeholder="Custom domains, e.g. https://cdn.example.com https://api.example.com"
                            className="mt-2 w-full rounded border border-gray-200 bg-white px-2 py-1.5 text-xs font-mono text-gray-700 placeholder-gray-400 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:placeholder-gray-500"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Right: Output + Analysis */}
          <div className="space-y-4">
            {/* Output format selector */}
            <div>
              <h2 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Output Format
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {(
                  [
                    { id: "header" as OutputFormat, label: "HTTP Header" },
                    { id: "meta" as OutputFormat, label: "<meta> Tag" },
                    { id: "nginx" as OutputFormat, label: "Nginx" },
                    { id: "apache" as OutputFormat, label: "Apache" },
                    { id: "vercel" as OutputFormat, label: "Vercel" },
                    { id: "netlify" as OutputFormat, label: "Netlify" },
                  ] as const
                ).map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setOutputFormat(f.id)}
                    className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                      outputFormat === f.id
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Generated output */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Generated Policy
                </h2>
                <button
                  onClick={copyOutput}
                  disabled={!csp}
                  className="rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <pre className="min-h-[80px] max-h-[200px] overflow-auto rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs font-mono text-gray-800 whitespace-pre-wrap break-all dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
                {output}
              </pre>
              {outputFormat === "meta" && csp && (
                <p className="mt-1.5 text-xs text-amber-600 dark:text-amber-400">
                  Note: frame-ancestors is not supported in meta tags — use an HTTP header for that directive.
                </p>
              )}
            </div>

            {/* Security analysis */}
            <div>
              <h2 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Security Analysis
              </h2>
              <div className="space-y-1.5">
                {issues.map((issue, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-2 rounded-lg px-3 py-2 text-xs ${
                      issue.level === "error"
                        ? "bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                        : issue.level === "warning"
                          ? "bg-amber-50 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400"
                          : "bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                    }`}
                  >
                    <span className="mt-px flex-shrink-0">
                      {issue.level === "error" ? "✕" : issue.level === "warning" ? "⚠" : "ℹ"}
                    </span>
                    <span>{issue.message}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick stats */}
            {csp && (
              <div className="rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
                <h2 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Policy Stats
                </h2>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {enabledCount}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Directives</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {csp.length}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Characters</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {issues.filter((i) => i.level === "error").length +
                        issues.filter((i) => i.level === "warning").length}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Warnings</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Presets Tab */}
      {tab === "presets" && (
        <div className="space-y-3">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Start from a preset, then customize in the Builder tab. Applying a preset replaces all current settings.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => {
                  applyPreset(preset);
                  setTab("builder");
                }}
                className="group rounded-lg border border-gray-200 bg-white p-4 text-left transition-colors hover:border-blue-300 hover:bg-blue-50/50 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-700 dark:hover:bg-blue-900/20"
              >
                <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-400">
                  {preset.name}
                </div>
                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {preset.description}
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {Object.entries(preset.directives)
                    .filter(([, v]) => v?.enabled)
                    .map(([key]) => (
                      <span
                        key={key}
                        className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-mono text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                      >
                        {key}
                      </span>
                    ))}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Reference Tab */}
      {tab === "reference" && (
        <div className="space-y-3">
          <input
            type="text"
            value={refSearch}
            onChange={(e) => setRefSearch(e.target.value)}
            placeholder="Search directives..."
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
          />
          <div className="space-y-2">
            {filteredRef.map((r) => (
              <div
                key={r.directive}
                className="rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {r.directive}
                  </span>
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                    {r.category}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                  {r.description}
                </p>
                <code className="mt-1.5 block rounded bg-gray-50 px-2 py-1 text-xs font-mono text-gray-700 dark:bg-gray-900 dark:text-gray-300">
                  {r.example}
                </code>
              </div>
            ))}
            {filteredRef.length === 0 && (
              <p className="py-8 text-center text-sm text-gray-400">
                No directives match &quot;{refSearch}&quot;
              </p>
            )}
          </div>
        </div>
      )}

      {/* SEO sub-page links */}
      <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
        <h2 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
          Related Guides
        </h2>
        <div className="flex flex-wrap gap-2">
          {[
            { href: "/tools/csp-builder/csp-directives-guide", label: "CSP Directives Guide" },
            { href: "/tools/csp-builder/csp-framework-examples", label: "CSP Framework Examples" },
            { href: "/tools/csp-builder/csp-common-issues", label: "Common CSP Issues" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:border-blue-300 hover:text-blue-600 dark:border-gray-700 dark:text-gray-400 dark:hover:border-blue-700 dark:hover:text-blue-400"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
