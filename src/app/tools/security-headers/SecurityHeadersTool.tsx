"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";

/* ─── Types ───────────────────────────────────────────────────────── */

type Tab = "builder" | "presets" | "reference";

type OutputFormat =
  | "raw"
  | "nginx"
  | "apache"
  | "vercel"
  | "netlify"
  | "cloudflare";

interface HeaderConfig {
  enabled: boolean;
  value: string;
}

interface HeadersState {
  strictTransportSecurity: {
    enabled: boolean;
    maxAge: number;
    includeSubDomains: boolean;
    preload: boolean;
  };
  xContentTypeOptions: { enabled: boolean };
  xFrameOptions: { enabled: boolean; value: "DENY" | "SAMEORIGIN" };
  referrerPolicy: {
    enabled: boolean;
    value: string;
  };
  permissionsPolicy: {
    enabled: boolean;
    camera: string;
    microphone: string;
    geolocation: string;
    payment: string;
    usb: string;
    gyroscope: string;
    magnetometer: string;
    accelerometer: string;
    autoplay: string;
    fullscreen: string;
  };
  contentSecurityPolicy: HeaderConfig;
  crossOriginOpenerPolicy: {
    enabled: boolean;
    value: string;
  };
  crossOriginEmbedderPolicy: {
    enabled: boolean;
    value: string;
  };
  crossOriginResourcePolicy: {
    enabled: boolean;
    value: string;
  };
  xXssProtection: { enabled: boolean; value: string };
  xDnsPrefetchControl: { enabled: boolean; value: string };
  xPermittedCrossDomainPolicies: { enabled: boolean; value: string };
}

/* ─── Constants ───────────────────────────────────────────────────── */

const PERMISSIONS_VALUES = [
  { label: "Allow all", value: "*" },
  { label: "Self only", value: "self" },
  { label: "Deny", value: "()" },
];

const REFERRER_OPTIONS = [
  "no-referrer",
  "no-referrer-when-downgrade",
  "origin",
  "origin-when-cross-origin",
  "same-origin",
  "strict-origin",
  "strict-origin-when-cross-origin",
  "unsafe-url",
];

const COOP_OPTIONS = [
  { value: "same-origin", label: "same-origin — full isolation" },
  {
    value: "same-origin-allow-popups",
    label: "same-origin-allow-popups — allow popups",
  },
  { value: "unsafe-none", label: "unsafe-none — no restrictions" },
];

const COEP_OPTIONS = [
  { value: "require-corp", label: "require-corp — require CORP headers" },
  { value: "credentialless", label: "credentialless — no credentials for cross-origin" },
  { value: "unsafe-none", label: "unsafe-none — no restrictions" },
];

const CORP_OPTIONS = [
  { value: "same-origin", label: "same-origin — same origin only" },
  { value: "same-site", label: "same-site — same site" },
  { value: "cross-origin", label: "cross-origin — any origin" },
];

const PERMISSIONS_FEATURES = [
  { key: "camera" as const, label: "Camera" },
  { key: "microphone" as const, label: "Microphone" },
  { key: "geolocation" as const, label: "Geolocation" },
  { key: "payment" as const, label: "Payment" },
  { key: "usb" as const, label: "USB" },
  { key: "gyroscope" as const, label: "Gyroscope" },
  { key: "magnetometer" as const, label: "Magnetometer" },
  { key: "accelerometer" as const, label: "Accelerometer" },
  { key: "autoplay" as const, label: "Autoplay" },
  { key: "fullscreen" as const, label: "Fullscreen" },
];

const DEFAULT_STATE: HeadersState = {
  strictTransportSecurity: {
    enabled: true,
    maxAge: 31536000,
    includeSubDomains: true,
    preload: false,
  },
  xContentTypeOptions: { enabled: true },
  xFrameOptions: { enabled: true, value: "DENY" },
  referrerPolicy: { enabled: true, value: "strict-origin-when-cross-origin" },
  permissionsPolicy: {
    enabled: true,
    camera: "()",
    microphone: "()",
    geolocation: "()",
    payment: "()",
    usb: "()",
    gyroscope: "()",
    magnetometer: "()",
    accelerometer: "()",
    autoplay: "()",
    fullscreen: "self",
  },
  contentSecurityPolicy: { enabled: false, value: "" },
  crossOriginOpenerPolicy: { enabled: false, value: "same-origin" },
  crossOriginEmbedderPolicy: { enabled: false, value: "require-corp" },
  crossOriginResourcePolicy: { enabled: false, value: "same-origin" },
  xXssProtection: { enabled: true, value: "0" },
  xDnsPrefetchControl: { enabled: false, value: "on" },
  xPermittedCrossDomainPolicies: { enabled: false, value: "none" },
};

interface Preset {
  name: string;
  description: string;
  badge: string;
  state: HeadersState;
}

const PRESETS: Preset[] = [
  {
    name: "Strict",
    description:
      "Maximum security — all headers enabled with restrictive values. Ideal for dashboards, admin panels, and apps that don't embed external content.",
    badge: "A+",
    state: {
      strictTransportSecurity: {
        enabled: true,
        maxAge: 63072000,
        includeSubDomains: true,
        preload: true,
      },
      xContentTypeOptions: { enabled: true },
      xFrameOptions: { enabled: true, value: "DENY" },
      referrerPolicy: { enabled: true, value: "no-referrer" },
      permissionsPolicy: {
        enabled: true,
        camera: "()",
        microphone: "()",
        geolocation: "()",
        payment: "()",
        usb: "()",
        gyroscope: "()",
        magnetometer: "()",
        accelerometer: "()",
        autoplay: "()",
        fullscreen: "()",
      },
      contentSecurityPolicy: {
        enabled: true,
        value:
          "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
      },
      crossOriginOpenerPolicy: { enabled: true, value: "same-origin" },
      crossOriginEmbedderPolicy: { enabled: true, value: "require-corp" },
      crossOriginResourcePolicy: { enabled: true, value: "same-origin" },
      xXssProtection: { enabled: true, value: "0" },
      xDnsPrefetchControl: { enabled: true, value: "off" },
      xPermittedCrossDomainPolicies: { enabled: true, value: "none" },
    },
  },
  {
    name: "Moderate",
    description:
      "Balanced security for most web apps. HSTS, anti-clickjacking, referrer control, and permissions policy enabled. Good for sites that need some external resources.",
    badge: "A",
    state: {
      ...DEFAULT_STATE,
      strictTransportSecurity: {
        enabled: true,
        maxAge: 31536000,
        includeSubDomains: true,
        preload: false,
      },
      xContentTypeOptions: { enabled: true },
      xFrameOptions: { enabled: true, value: "SAMEORIGIN" },
      referrerPolicy: {
        enabled: true,
        value: "strict-origin-when-cross-origin",
      },
      permissionsPolicy: {
        ...DEFAULT_STATE.permissionsPolicy,
        enabled: true,
      },
      xXssProtection: { enabled: true, value: "0" },
    },
  },
  {
    name: "Basic",
    description:
      "Minimum recommended headers. Covers HSTS, X-Content-Type-Options, and X-Frame-Options — the bare essentials every site should have.",
    badge: "B",
    state: {
      ...DEFAULT_STATE,
      strictTransportSecurity: {
        enabled: true,
        maxAge: 31536000,
        includeSubDomains: false,
        preload: false,
      },
      xContentTypeOptions: { enabled: true },
      xFrameOptions: { enabled: true, value: "SAMEORIGIN" },
      referrerPolicy: { enabled: false, value: "strict-origin-when-cross-origin" },
      permissionsPolicy: { ...DEFAULT_STATE.permissionsPolicy, enabled: false },
      contentSecurityPolicy: { enabled: false, value: "" },
      crossOriginOpenerPolicy: { enabled: false, value: "same-origin" },
      crossOriginEmbedderPolicy: { enabled: false, value: "require-corp" },
      crossOriginResourcePolicy: { enabled: false, value: "same-origin" },
      xXssProtection: { enabled: true, value: "0" },
      xDnsPrefetchControl: { enabled: false, value: "on" },
      xPermittedCrossDomainPolicies: { enabled: false, value: "none" },
    },
  },
  {
    name: "API Server",
    description:
      "Optimized for JSON APIs. No framing, strict CORS, minimal permissions. Pairs well with CORS headers configured at the API gateway level.",
    badge: "API",
    state: {
      strictTransportSecurity: {
        enabled: true,
        maxAge: 31536000,
        includeSubDomains: true,
        preload: false,
      },
      xContentTypeOptions: { enabled: true },
      xFrameOptions: { enabled: true, value: "DENY" },
      referrerPolicy: { enabled: true, value: "no-referrer" },
      permissionsPolicy: {
        enabled: true,
        camera: "()",
        microphone: "()",
        geolocation: "()",
        payment: "()",
        usb: "()",
        gyroscope: "()",
        magnetometer: "()",
        accelerometer: "()",
        autoplay: "()",
        fullscreen: "()",
      },
      contentSecurityPolicy: {
        enabled: true,
        value: "default-src 'none'; frame-ancestors 'none'",
      },
      crossOriginOpenerPolicy: { enabled: true, value: "same-origin" },
      crossOriginEmbedderPolicy: { enabled: false, value: "require-corp" },
      crossOriginResourcePolicy: { enabled: true, value: "same-origin" },
      xXssProtection: { enabled: true, value: "0" },
      xDnsPrefetchControl: { enabled: true, value: "off" },
      xPermittedCrossDomainPolicies: { enabled: true, value: "none" },
    },
  },
  {
    name: "Next.js / Vercel",
    description:
      "Tuned for Next.js apps on Vercel. Accounts for inline scripts/styles, Image Optimization, and Vercel Analytics.",
    badge: "▲",
    state: {
      strictTransportSecurity: {
        enabled: true,
        maxAge: 63072000,
        includeSubDomains: true,
        preload: true,
      },
      xContentTypeOptions: { enabled: true },
      xFrameOptions: { enabled: true, value: "DENY" },
      referrerPolicy: {
        enabled: true,
        value: "strict-origin-when-cross-origin",
      },
      permissionsPolicy: {
        enabled: true,
        camera: "()",
        microphone: "()",
        geolocation: "()",
        payment: "()",
        usb: "()",
        gyroscope: "()",
        magnetometer: "()",
        accelerometer: "()",
        autoplay: "()",
        fullscreen: "self",
      },
      contentSecurityPolicy: {
        enabled: true,
        value:
          "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self'; connect-src 'self' https://vitals.vercel-insights.com; frame-ancestors 'none'",
      },
      crossOriginOpenerPolicy: { enabled: true, value: "same-origin" },
      crossOriginEmbedderPolicy: { enabled: false, value: "require-corp" },
      crossOriginResourcePolicy: {
        enabled: true,
        value: "cross-origin",
      },
      xXssProtection: { enabled: true, value: "0" },
      xDnsPrefetchControl: { enabled: true, value: "on" },
      xPermittedCrossDomainPolicies: { enabled: true, value: "none" },
    },
  },
  {
    name: "WordPress",
    description:
      "WordPress-friendly security headers. Allows inline styles/scripts that WP themes require, permits embeds for the block editor.",
    badge: "WP",
    state: {
      strictTransportSecurity: {
        enabled: true,
        maxAge: 31536000,
        includeSubDomains: false,
        preload: false,
      },
      xContentTypeOptions: { enabled: true },
      xFrameOptions: { enabled: true, value: "SAMEORIGIN" },
      referrerPolicy: {
        enabled: true,
        value: "strict-origin-when-cross-origin",
      },
      permissionsPolicy: {
        enabled: true,
        camera: "()",
        microphone: "()",
        geolocation: "()",
        payment: "()",
        usb: "()",
        gyroscope: "()",
        magnetometer: "()",
        accelerometer: "()",
        autoplay: "self",
        fullscreen: "self",
      },
      contentSecurityPolicy: { enabled: false, value: "" },
      crossOriginOpenerPolicy: { enabled: false, value: "same-origin" },
      crossOriginEmbedderPolicy: { enabled: false, value: "require-corp" },
      crossOriginResourcePolicy: { enabled: false, value: "same-origin" },
      xXssProtection: { enabled: true, value: "0" },
      xDnsPrefetchControl: { enabled: false, value: "on" },
      xPermittedCrossDomainPolicies: { enabled: true, value: "none" },
    },
  },
];

const REFERENCE_HEADERS = [
  {
    name: "Strict-Transport-Security",
    description:
      "Forces HTTPS connections. Tells browsers to only connect via HTTPS for the specified duration. HSTS preload lists make this permanent.",
    example: "max-age=31536000; includeSubDomains; preload",
    impact: "Critical",
    support: "All modern browsers",
  },
  {
    name: "Content-Security-Policy",
    description:
      "Controls which resources the browser can load. The most powerful security header — prevents XSS, data injection, and clickjacking.",
    example: "default-src 'self'; script-src 'self'",
    impact: "Critical",
    support: "All modern browsers",
  },
  {
    name: "X-Content-Type-Options",
    description:
      "Prevents MIME-type sniffing. Stops browsers from guessing content types, which can lead to XSS via uploaded files.",
    example: "nosniff",
    impact: "High",
    support: "All modern browsers",
  },
  {
    name: "X-Frame-Options",
    description:
      "Prevents clickjacking by controlling whether the page can be embedded in iframes. Largely superseded by CSP frame-ancestors.",
    example: "DENY",
    impact: "High",
    support: "All modern browsers",
  },
  {
    name: "Referrer-Policy",
    description:
      "Controls how much referrer information is sent with requests. Prevents leaking sensitive URLs to third parties.",
    example: "strict-origin-when-cross-origin",
    impact: "Medium",
    support: "All modern browsers",
  },
  {
    name: "Permissions-Policy",
    description:
      "Controls which browser features (camera, mic, geolocation) the page and its iframes can use. Formerly Feature-Policy.",
    example: "camera=(), microphone=(), geolocation=()",
    impact: "Medium",
    support: "Chromium, Firefox (partial)",
  },
  {
    name: "Cross-Origin-Opener-Policy",
    description:
      "Isolates the browsing context from cross-origin windows. Required for SharedArrayBuffer and high-resolution timers.",
    example: "same-origin",
    impact: "Medium",
    support: "Chromium, Firefox, Safari",
  },
  {
    name: "Cross-Origin-Embedder-Policy",
    description:
      "Controls loading of cross-origin resources. Required alongside COOP for cross-origin isolation (SharedArrayBuffer).",
    example: "require-corp",
    impact: "Medium",
    support: "Chromium, Firefox, Safari",
  },
  {
    name: "Cross-Origin-Resource-Policy",
    description:
      "Controls which origins can include the resource. Prevents cross-origin reads of sensitive resources like images or API responses.",
    example: "same-origin",
    impact: "Medium",
    support: "Chromium, Firefox, Safari",
  },
  {
    name: "X-XSS-Protection",
    description:
      "Legacy XSS filter. Modern recommendation is to set to '0' to disable buggy browser XSS auditors, and rely on CSP instead.",
    example: "0",
    impact: "Low",
    support: "Deprecated — use CSP instead",
  },
  {
    name: "X-DNS-Prefetch-Control",
    description:
      "Controls DNS prefetching. Setting to 'off' prevents the browser from pre-resolving domain names for links on the page, reducing privacy leaks.",
    example: "off",
    impact: "Low",
    support: "All modern browsers",
  },
  {
    name: "X-Permitted-Cross-Domain-Policies",
    description:
      "Controls Adobe Flash and PDF policies. Setting to 'none' prevents Flash/PDF from loading cross-domain data.",
    example: "none",
    impact: "Low",
    support: "Adobe products",
  },
];

/* ─── Utility functions ───────────────────────────────────────────── */

function buildHeaders(state: HeadersState): Record<string, string> {
  const headers: Record<string, string> = {};

  if (state.strictTransportSecurity.enabled) {
    let val = `max-age=${state.strictTransportSecurity.maxAge}`;
    if (state.strictTransportSecurity.includeSubDomains)
      val += "; includeSubDomains";
    if (state.strictTransportSecurity.preload) val += "; preload";
    headers["Strict-Transport-Security"] = val;
  }

  if (state.xContentTypeOptions.enabled) {
    headers["X-Content-Type-Options"] = "nosniff";
  }

  if (state.xFrameOptions.enabled) {
    headers["X-Frame-Options"] = state.xFrameOptions.value;
  }

  if (state.referrerPolicy.enabled) {
    headers["Referrer-Policy"] = state.referrerPolicy.value;
  }

  if (state.permissionsPolicy.enabled) {
    const features = PERMISSIONS_FEATURES.map((f) => {
      const v =
        state.permissionsPolicy[f.key as keyof typeof state.permissionsPolicy];
      if (v === "()" || v === "") return `${f.key}=()`;
      if (v === "*") return `${f.key}=*`;
      return `${f.key}=(${v})`;
    });
    headers["Permissions-Policy"] = features.join(", ");
  }

  if (state.contentSecurityPolicy.enabled && state.contentSecurityPolicy.value) {
    headers["Content-Security-Policy"] = state.contentSecurityPolicy.value;
  }

  if (state.crossOriginOpenerPolicy.enabled) {
    headers["Cross-Origin-Opener-Policy"] =
      state.crossOriginOpenerPolicy.value;
  }

  if (state.crossOriginEmbedderPolicy.enabled) {
    headers["Cross-Origin-Embedder-Policy"] =
      state.crossOriginEmbedderPolicy.value;
  }

  if (state.crossOriginResourcePolicy.enabled) {
    headers["Cross-Origin-Resource-Policy"] =
      state.crossOriginResourcePolicy.value;
  }

  if (state.xXssProtection.enabled) {
    headers["X-XSS-Protection"] = state.xXssProtection.value;
  }

  if (state.xDnsPrefetchControl.enabled) {
    headers["X-DNS-Prefetch-Control"] = state.xDnsPrefetchControl.value;
  }

  if (state.xPermittedCrossDomainPolicies.enabled) {
    headers["X-Permitted-Cross-Domain-Policies"] =
      state.xPermittedCrossDomainPolicies.value;
  }

  return headers;
}

function formatOutput(
  headers: Record<string, string>,
  format: OutputFormat,
): string {
  const entries = Object.entries(headers);
  if (entries.length === 0) return "# No headers enabled";

  switch (format) {
    case "raw":
      return entries.map(([k, v]) => `${k}: ${v}`).join("\n");

    case "nginx":
      return entries
        .map(([k, v]) => `add_header ${k} "${v}" always;`)
        .join("\n");

    case "apache":
      return entries
        .map(([k, v]) => `Header always set ${k} "${v}"`)
        .join("\n");

    case "vercel":
      return JSON.stringify(
        {
          headers: [
            {
              source: "/(.*)",
              headers: entries.map(([key, value]) => ({ key, value })),
            },
          ],
        },
        null,
        2,
      );

    case "netlify":
      return (
        "/*\n" + entries.map(([k, v]) => `  ${k}: ${v}`).join("\n")
      );

    case "cloudflare":
      return (
        "/*\n" + entries.map(([k, v]) => `  ${k}: ${v}`).join("\n")
      );

    default:
      return entries.map(([k, v]) => `${k}: ${v}`).join("\n");
  }
}

interface SecurityIssue {
  type: "error" | "warning" | "info";
  message: string;
}

function analyzeHeaders(state: HeadersState): {
  grade: string;
  score: number;
  issues: SecurityIssue[];
} {
  let score = 0;
  const issues: SecurityIssue[] = [];

  // HSTS (25 points max)
  if (state.strictTransportSecurity.enabled) {
    score += 15;
    if (state.strictTransportSecurity.maxAge >= 31536000) score += 5;
    else
      issues.push({
        type: "warning",
        message: "HSTS max-age should be at least 1 year (31536000 seconds)",
      });
    if (state.strictTransportSecurity.includeSubDomains) score += 3;
    if (state.strictTransportSecurity.preload) score += 2;
  } else {
    issues.push({
      type: "error",
      message: "HSTS is not enabled — site may be vulnerable to downgrade attacks",
    });
  }

  // X-Content-Type-Options (10 points)
  if (state.xContentTypeOptions.enabled) {
    score += 10;
  } else {
    issues.push({
      type: "error",
      message:
        "X-Content-Type-Options is not set — browser MIME-type sniffing may cause XSS",
    });
  }

  // X-Frame-Options (10 points)
  if (state.xFrameOptions.enabled) {
    score += 10;
    if (state.xFrameOptions.value === "DENY") {
      issues.push({
        type: "info",
        message: "X-Frame-Options: DENY — page cannot be embedded in any iframe",
      });
    }
  } else {
    issues.push({
      type: "warning",
      message:
        "X-Frame-Options not set — page may be vulnerable to clickjacking",
    });
  }

  // Referrer-Policy (10 points)
  if (state.referrerPolicy.enabled) {
    score += 10;
    if (state.referrerPolicy.value === "unsafe-url") {
      score -= 5;
      issues.push({
        type: "warning",
        message:
          "Referrer-Policy: unsafe-url sends the full URL as referrer — consider a stricter policy",
      });
    }
  } else {
    issues.push({
      type: "warning",
      message: "Referrer-Policy not set — browsers will use default (may leak URLs)",
    });
  }

  // Permissions-Policy (10 points)
  if (state.permissionsPolicy.enabled) {
    score += 10;
  } else {
    issues.push({
      type: "info",
      message:
        "Permissions-Policy not set — browser features like camera/mic are unrestricted",
    });
  }

  // CSP (20 points)
  if (state.contentSecurityPolicy.enabled && state.contentSecurityPolicy.value) {
    score += 20;
    if (state.contentSecurityPolicy.value.includes("'unsafe-inline'")) {
      score -= 5;
      issues.push({
        type: "warning",
        message:
          "CSP contains 'unsafe-inline' — weakens XSS protection. Use nonces or hashes instead.",
      });
    }
    if (state.contentSecurityPolicy.value.includes("'unsafe-eval'")) {
      score -= 5;
      issues.push({
        type: "warning",
        message:
          "CSP contains 'unsafe-eval' — allows eval(), weakening XSS protection",
      });
    }
  } else {
    issues.push({
      type: "warning",
      message:
        "Content-Security-Policy not set — no protection against XSS and injection attacks. Use the CSP Header Builder for detailed configuration.",
    });
  }

  // Cross-Origin headers (10 points)
  if (state.crossOriginOpenerPolicy.enabled) score += 4;
  if (state.crossOriginResourcePolicy.enabled) score += 3;
  if (state.crossOriginEmbedderPolicy.enabled) score += 3;

  // X-XSS-Protection (5 points)
  if (state.xXssProtection.enabled) {
    score += 5;
    if (state.xXssProtection.value !== "0") {
      issues.push({
        type: "warning",
        message:
          "X-XSS-Protection should be '0'. The browser XSS auditor is deprecated and can introduce vulnerabilities. Use CSP instead.",
      });
    }
  }

  const grade =
    score >= 90
      ? "A+"
      : score >= 80
        ? "A"
        : score >= 70
          ? "B"
          : score >= 55
            ? "C"
            : score >= 40
              ? "D"
              : "F";

  if (issues.length === 0) {
    issues.push({
      type: "info",
      message: "All recommended security headers are configured.",
    });
  }

  return { grade, score: Math.min(100, Math.max(0, score)), issues };
}

/* ─── Component ───────────────────────────────────────────────────── */

export default function SecurityHeadersTool() {
  useToolAnalytics("security-headers");

  const [tab, setTab] = useState<Tab>("builder");
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("raw");
  const [state, setState] = useState<HeadersState>(DEFAULT_STATE);
  const [copied, setCopied] = useState(false);

  const headers = useMemo(() => buildHeaders(state), [state]);
  const output = useMemo(
    () => formatOutput(headers, outputFormat),
    [headers, outputFormat],
  );
  const analysis = useMemo(() => analyzeHeaders(state), [state]);
  const headerCount = useMemo(
    () => Object.keys(headers).length,
    [headers],
  );

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [output]);

  const applyPreset = useCallback((preset: Preset) => {
    setState(preset.state);
  }, []);

  const gradeColor =
    analysis.grade === "A+" || analysis.grade === "A"
      ? "text-emerald-400"
      : analysis.grade === "B"
        ? "text-blue-400"
        : analysis.grade === "C"
          ? "text-yellow-400"
          : "text-red-400";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">
          Security Headers Generator
        </h1>
        <p className="text-zinc-400">
          Generate and analyze HTTP security headers for Nginx, Apache, Vercel,
          Netlify, and Cloudflare. Visual builder with presets and security
          scoring.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg bg-zinc-800/50 p-1">
        {(
          [
            ["builder", "Builder"],
            ["presets", "Presets"],
            ["reference", "Reference"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              tab === key
                ? "bg-zinc-700 text-white"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Builder tab */}
      {tab === "builder" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Form */}
          <div className="space-y-4">
            {/* HSTS */}
            <HeaderSection
              title="Strict-Transport-Security (HSTS)"
              enabled={state.strictTransportSecurity.enabled}
              onToggle={() =>
                setState((s) => ({
                  ...s,
                  strictTransportSecurity: {
                    ...s.strictTransportSecurity,
                    enabled: !s.strictTransportSecurity.enabled,
                  },
                }))
              }
              badge="Critical"
            >
              <div className="space-y-3">
                <label className="block text-sm text-zinc-400">
                  max-age (seconds)
                  <select
                    value={state.strictTransportSecurity.maxAge}
                    onChange={(e) =>
                      setState((s) => ({
                        ...s,
                        strictTransportSecurity: {
                          ...s.strictTransportSecurity,
                          maxAge: Number(e.target.value),
                        },
                      }))
                    }
                    className="mt-1 block w-full rounded-md bg-zinc-800 border border-zinc-700 text-white px-3 py-2 text-sm"
                  >
                    <option value={86400}>1 day (86400)</option>
                    <option value={2592000}>30 days (2592000)</option>
                    <option value={15768000}>6 months (15768000)</option>
                    <option value={31536000}>1 year (31536000)</option>
                    <option value={63072000}>2 years (63072000)</option>
                  </select>
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm text-zinc-300">
                    <input
                      type="checkbox"
                      checked={state.strictTransportSecurity.includeSubDomains}
                      onChange={() =>
                        setState((s) => ({
                          ...s,
                          strictTransportSecurity: {
                            ...s.strictTransportSecurity,
                            includeSubDomains:
                              !s.strictTransportSecurity.includeSubDomains,
                          },
                        }))
                      }
                      className="rounded bg-zinc-800 border-zinc-600"
                    />
                    includeSubDomains
                  </label>
                  <label className="flex items-center gap-2 text-sm text-zinc-300">
                    <input
                      type="checkbox"
                      checked={state.strictTransportSecurity.preload}
                      onChange={() =>
                        setState((s) => ({
                          ...s,
                          strictTransportSecurity: {
                            ...s.strictTransportSecurity,
                            preload: !s.strictTransportSecurity.preload,
                          },
                        }))
                      }
                      className="rounded bg-zinc-800 border-zinc-600"
                    />
                    preload
                  </label>
                </div>
              </div>
            </HeaderSection>

            {/* X-Content-Type-Options */}
            <HeaderSection
              title="X-Content-Type-Options"
              enabled={state.xContentTypeOptions.enabled}
              onToggle={() =>
                setState((s) => ({
                  ...s,
                  xContentTypeOptions: {
                    enabled: !s.xContentTypeOptions.enabled,
                  },
                }))
              }
              badge="High"
            >
              <p className="text-sm text-zinc-500">
                Always set to <code className="text-zinc-300">nosniff</code> — no
                configuration needed.
              </p>
            </HeaderSection>

            {/* X-Frame-Options */}
            <HeaderSection
              title="X-Frame-Options"
              enabled={state.xFrameOptions.enabled}
              onToggle={() =>
                setState((s) => ({
                  ...s,
                  xFrameOptions: {
                    ...s.xFrameOptions,
                    enabled: !s.xFrameOptions.enabled,
                  },
                }))
              }
              badge="High"
            >
              <div className="flex gap-2">
                {(["DENY", "SAMEORIGIN"] as const).map((val) => (
                  <button
                    key={val}
                    onClick={() =>
                      setState((s) => ({
                        ...s,
                        xFrameOptions: { ...s.xFrameOptions, value: val },
                      }))
                    }
                    className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
                      state.xFrameOptions.value === val
                        ? "border-blue-500 bg-blue-500/20 text-blue-300"
                        : "border-zinc-700 text-zinc-400 hover:border-zinc-500"
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </HeaderSection>

            {/* Referrer-Policy */}
            <HeaderSection
              title="Referrer-Policy"
              enabled={state.referrerPolicy.enabled}
              onToggle={() =>
                setState((s) => ({
                  ...s,
                  referrerPolicy: {
                    ...s.referrerPolicy,
                    enabled: !s.referrerPolicy.enabled,
                  },
                }))
              }
              badge="Medium"
            >
              <select
                value={state.referrerPolicy.value}
                onChange={(e) =>
                  setState((s) => ({
                    ...s,
                    referrerPolicy: {
                      ...s.referrerPolicy,
                      value: e.target.value,
                    },
                  }))
                }
                className="w-full rounded-md bg-zinc-800 border border-zinc-700 text-white px-3 py-2 text-sm"
              >
                {REFERRER_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </HeaderSection>

            {/* Permissions-Policy */}
            <HeaderSection
              title="Permissions-Policy"
              enabled={state.permissionsPolicy.enabled}
              onToggle={() =>
                setState((s) => ({
                  ...s,
                  permissionsPolicy: {
                    ...s.permissionsPolicy,
                    enabled: !s.permissionsPolicy.enabled,
                  },
                }))
              }
              badge="Medium"
            >
              <div className="grid grid-cols-2 gap-2">
                {PERMISSIONS_FEATURES.map((f) => (
                  <div key={f.key} className="flex items-center gap-2">
                    <span className="text-xs text-zinc-400 w-24 truncate">
                      {f.label}
                    </span>
                    <select
                      value={
                        state.permissionsPolicy[
                          f.key as keyof typeof state.permissionsPolicy
                        ] as string
                      }
                      onChange={(e) =>
                        setState((s) => ({
                          ...s,
                          permissionsPolicy: {
                            ...s.permissionsPolicy,
                            [f.key]: e.target.value,
                          },
                        }))
                      }
                      className="flex-1 rounded bg-zinc-800 border border-zinc-700 text-white px-2 py-1 text-xs"
                    >
                      {PERMISSIONS_VALUES.map((pv) => (
                        <option key={pv.value} value={pv.value}>
                          {pv.label}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </HeaderSection>

            {/* CSP */}
            <HeaderSection
              title="Content-Security-Policy"
              enabled={state.contentSecurityPolicy.enabled}
              onToggle={() =>
                setState((s) => ({
                  ...s,
                  contentSecurityPolicy: {
                    ...s.contentSecurityPolicy,
                    enabled: !s.contentSecurityPolicy.enabled,
                  },
                }))
              }
              badge="Critical"
            >
              <div className="space-y-2">
                <textarea
                  value={state.contentSecurityPolicy.value}
                  onChange={(e) =>
                    setState((s) => ({
                      ...s,
                      contentSecurityPolicy: {
                        ...s.contentSecurityPolicy,
                        value: e.target.value,
                      },
                    }))
                  }
                  placeholder="default-src 'self'; script-src 'self' ..."
                  rows={3}
                  className="w-full rounded-md bg-zinc-800 border border-zinc-700 text-white px-3 py-2 text-sm font-mono"
                />
                <p className="text-xs text-zinc-500">
                  For detailed CSP configuration, use the{" "}
                  <Link
                    href="/tools/csp-builder"
                    className="text-blue-400 hover:underline"
                  >
                    CSP Header Builder
                  </Link>{" "}
                  tool.
                </p>
              </div>
            </HeaderSection>

            {/* COOP */}
            <HeaderSection
              title="Cross-Origin-Opener-Policy"
              enabled={state.crossOriginOpenerPolicy.enabled}
              onToggle={() =>
                setState((s) => ({
                  ...s,
                  crossOriginOpenerPolicy: {
                    ...s.crossOriginOpenerPolicy,
                    enabled: !s.crossOriginOpenerPolicy.enabled,
                  },
                }))
              }
              badge="Medium"
            >
              <select
                value={state.crossOriginOpenerPolicy.value}
                onChange={(e) =>
                  setState((s) => ({
                    ...s,
                    crossOriginOpenerPolicy: {
                      ...s.crossOriginOpenerPolicy,
                      value: e.target.value,
                    },
                  }))
                }
                className="w-full rounded-md bg-zinc-800 border border-zinc-700 text-white px-3 py-2 text-sm"
              >
                {COOP_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </HeaderSection>

            {/* COEP */}
            <HeaderSection
              title="Cross-Origin-Embedder-Policy"
              enabled={state.crossOriginEmbedderPolicy.enabled}
              onToggle={() =>
                setState((s) => ({
                  ...s,
                  crossOriginEmbedderPolicy: {
                    ...s.crossOriginEmbedderPolicy,
                    enabled: !s.crossOriginEmbedderPolicy.enabled,
                  },
                }))
              }
              badge="Medium"
            >
              <select
                value={state.crossOriginEmbedderPolicy.value}
                onChange={(e) =>
                  setState((s) => ({
                    ...s,
                    crossOriginEmbedderPolicy: {
                      ...s.crossOriginEmbedderPolicy,
                      value: e.target.value,
                    },
                  }))
                }
                className="w-full rounded-md bg-zinc-800 border border-zinc-700 text-white px-3 py-2 text-sm"
              >
                {COEP_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </HeaderSection>

            {/* CORP */}
            <HeaderSection
              title="Cross-Origin-Resource-Policy"
              enabled={state.crossOriginResourcePolicy.enabled}
              onToggle={() =>
                setState((s) => ({
                  ...s,
                  crossOriginResourcePolicy: {
                    ...s.crossOriginResourcePolicy,
                    enabled: !s.crossOriginResourcePolicy.enabled,
                  },
                }))
              }
              badge="Medium"
            >
              <select
                value={state.crossOriginResourcePolicy.value}
                onChange={(e) =>
                  setState((s) => ({
                    ...s,
                    crossOriginResourcePolicy: {
                      ...s.crossOriginResourcePolicy,
                      value: e.target.value,
                    },
                  }))
                }
                className="w-full rounded-md bg-zinc-800 border border-zinc-700 text-white px-3 py-2 text-sm"
              >
                {CORP_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </HeaderSection>

            {/* X-XSS-Protection */}
            <HeaderSection
              title="X-XSS-Protection"
              enabled={state.xXssProtection.enabled}
              onToggle={() =>
                setState((s) => ({
                  ...s,
                  xXssProtection: {
                    ...s.xXssProtection,
                    enabled: !s.xXssProtection.enabled,
                  },
                }))
              }
              badge="Low"
            >
              <p className="text-sm text-zinc-500">
                Set to <code className="text-zinc-300">0</code> to disable the
                legacy XSS auditor (modern best practice). Use CSP instead.
              </p>
            </HeaderSection>

            {/* X-DNS-Prefetch-Control */}
            <HeaderSection
              title="X-DNS-Prefetch-Control"
              enabled={state.xDnsPrefetchControl.enabled}
              onToggle={() =>
                setState((s) => ({
                  ...s,
                  xDnsPrefetchControl: {
                    ...s.xDnsPrefetchControl,
                    enabled: !s.xDnsPrefetchControl.enabled,
                  },
                }))
              }
              badge="Low"
            >
              <div className="flex gap-2">
                {["on", "off"].map((val) => (
                  <button
                    key={val}
                    onClick={() =>
                      setState((s) => ({
                        ...s,
                        xDnsPrefetchControl: {
                          ...s.xDnsPrefetchControl,
                          value: val,
                        },
                      }))
                    }
                    className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
                      state.xDnsPrefetchControl.value === val
                        ? "border-blue-500 bg-blue-500/20 text-blue-300"
                        : "border-zinc-700 text-zinc-400 hover:border-zinc-500"
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </HeaderSection>

            {/* X-Permitted-Cross-Domain-Policies */}
            <HeaderSection
              title="X-Permitted-Cross-Domain-Policies"
              enabled={state.xPermittedCrossDomainPolicies.enabled}
              onToggle={() =>
                setState((s) => ({
                  ...s,
                  xPermittedCrossDomainPolicies: {
                    ...s.xPermittedCrossDomainPolicies,
                    enabled: !s.xPermittedCrossDomainPolicies.enabled,
                  },
                }))
              }
              badge="Low"
            >
              <select
                value={state.xPermittedCrossDomainPolicies.value}
                onChange={(e) =>
                  setState((s) => ({
                    ...s,
                    xPermittedCrossDomainPolicies: {
                      ...s.xPermittedCrossDomainPolicies,
                      value: e.target.value,
                    },
                  }))
                }
                className="w-full rounded-md bg-zinc-800 border border-zinc-700 text-white px-3 py-2 text-sm"
              >
                <option value="none">none</option>
                <option value="master-only">master-only</option>
                <option value="by-content-type">by-content-type</option>
                <option value="all">all</option>
              </select>
            </HeaderSection>
          </div>

          {/* Right: Output + Analysis */}
          <div className="space-y-4">
            {/* Security Grade */}
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-zinc-300">
                  Security Score
                </h3>
                <span className={`text-3xl font-bold ${gradeColor}`}>
                  {analysis.grade}
                </span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-2 mb-3">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    analysis.score >= 80
                      ? "bg-emerald-500"
                      : analysis.score >= 55
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  }`}
                  style={{ width: `${analysis.score}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-zinc-500 mb-4">
                <span>{headerCount} headers enabled</span>
                <span>{analysis.score}/100</span>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {analysis.issues.map((issue, i) => (
                  <div
                    key={i}
                    className={`text-xs rounded-md px-3 py-2 ${
                      issue.type === "error"
                        ? "bg-red-500/10 text-red-300 border border-red-500/20"
                        : issue.type === "warning"
                          ? "bg-yellow-500/10 text-yellow-300 border border-yellow-500/20"
                          : "bg-blue-500/10 text-blue-300 border border-blue-500/20"
                    }`}
                  >
                    {issue.type === "error"
                      ? "✕ "
                      : issue.type === "warning"
                        ? "⚠ "
                        : "ℹ "}
                    {issue.message}
                  </div>
                ))}
              </div>
            </div>

            {/* Output Format Selector */}
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-zinc-300">
                  Output Format
                </h3>
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 text-xs rounded-md bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <div className="flex flex-wrap gap-1 mb-3">
                {(
                  [
                    ["raw", "Raw Headers"],
                    ["nginx", "Nginx"],
                    ["apache", "Apache"],
                    ["vercel", "Vercel"],
                    ["netlify", "Netlify"],
                    ["cloudflare", "Cloudflare"],
                  ] as const
                ).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setOutputFormat(key)}
                    className={`px-2.5 py-1 text-xs rounded-md border transition-colors ${
                      outputFormat === key
                        ? "border-blue-500 bg-blue-500/20 text-blue-300"
                        : "border-zinc-700 text-zinc-400 hover:border-zinc-500"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <pre className="text-xs font-mono text-zinc-300 bg-zinc-950 rounded-md p-3 overflow-x-auto max-h-96 whitespace-pre-wrap">
                {output}
              </pre>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3 text-center">
                <div className="text-lg font-bold text-white">
                  {headerCount}
                </div>
                <div className="text-xs text-zinc-500">Headers</div>
              </div>
              <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3 text-center">
                <div className={`text-lg font-bold ${gradeColor}`}>
                  {analysis.grade}
                </div>
                <div className="text-xs text-zinc-500">Grade</div>
              </div>
              <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3 text-center">
                <div className="text-lg font-bold text-white">
                  {output.length}
                </div>
                <div className="text-xs text-zinc-500">Bytes</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Presets tab */}
      {tab === "presets" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => {
                applyPreset(preset);
                setTab("builder");
              }}
              className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 text-left hover:border-zinc-600 transition-colors group"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors">
                  {preset.name}
                </h3>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                  {preset.badge}
                </span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {preset.description}
              </p>
            </button>
          ))}
        </div>
      )}

      {/* Reference tab */}
      {tab === "reference" && (
        <div className="space-y-3">
          {REFERENCE_HEADERS.map((h) => (
            <div
              key={h.name}
              className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4"
            >
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-semibold text-white font-mono">
                  {h.name}
                </h3>
                <span
                  className={`text-xs px-2 py-0.5 rounded ${
                    h.impact === "Critical"
                      ? "bg-red-500/20 text-red-300"
                      : h.impact === "High"
                        ? "bg-orange-500/20 text-orange-300"
                        : h.impact === "Medium"
                          ? "bg-blue-500/20 text-blue-300"
                          : "bg-zinc-700 text-zinc-400"
                  }`}
                >
                  {h.impact}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mb-2">{h.description}</p>
              <div className="flex items-center justify-between">
                <code className="text-xs text-emerald-400 bg-zinc-800 px-2 py-0.5 rounded">
                  {h.example}
                </code>
                <span className="text-xs text-zinc-600">{h.support}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SEO sub-page links */}
      <div className="border-t border-zinc-800 pt-6 mt-6">
        <h2 className="text-sm font-semibold text-zinc-400 mb-3">
          Related Guides
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            href="/tools/security-headers/hsts-guide"
            className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3 hover:border-zinc-600 transition-colors"
          >
            <h3 className="text-sm font-medium text-white mb-1">HSTS Guide</h3>
            <p className="text-xs text-zinc-500">
              How Strict-Transport-Security works, preload lists, and deployment best practices.
            </p>
          </Link>
          <Link
            href="/tools/security-headers/security-headers-explained"
            className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3 hover:border-zinc-600 transition-colors"
          >
            <h3 className="text-sm font-medium text-white mb-1">
              Security Headers Explained
            </h3>
            <p className="text-xs text-zinc-500">
              Complete guide to every HTTP security header and when to use each one.
            </p>
          </Link>
          <Link
            href="/tools/security-headers/security-headers-checker"
            className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3 hover:border-zinc-600 transition-colors"
          >
            <h3 className="text-sm font-medium text-white mb-1">
              Security Headers Checker
            </h3>
            <p className="text-xs text-zinc-500">
              How to audit your site&apos;s security headers and fix common issues.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ─── Sub-components ──────────────────────────────────────────────── */

function HeaderSection({
  title,
  enabled,
  onToggle,
  badge,
  children,
}: {
  title: string;
  enabled: boolean;
  onToggle: () => void;
  badge: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-lg border bg-zinc-900/50 p-4 transition-colors ${
        enabled ? "border-zinc-700" : "border-zinc-800 opacity-60"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={onToggle}
            className={`w-9 h-5 rounded-full transition-colors relative ${
              enabled ? "bg-blue-600" : "bg-zinc-700"
            }`}
          >
            <span
              className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                enabled ? "left-4" : "left-0.5"
              }`}
            />
          </button>
          <h3 className="text-sm font-medium text-white">{title}</h3>
        </div>
        <span
          className={`text-xs px-2 py-0.5 rounded ${
            badge === "Critical"
              ? "bg-red-500/20 text-red-300"
              : badge === "High"
                ? "bg-orange-500/20 text-orange-300"
                : badge === "Medium"
                  ? "bg-blue-500/20 text-blue-300"
                  : "bg-zinc-700 text-zinc-400"
          }`}
        >
          {badge}
        </span>
      </div>
      {enabled && children}
    </div>
  );
}
