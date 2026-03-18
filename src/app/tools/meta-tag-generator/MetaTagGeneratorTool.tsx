"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import RateLimitBanner from "@/components/RateLimitBanner";

interface MetaFields {
  title: string;
  description: string;
  url: string;
  image: string;
  siteName: string;
  author: string;
  ogType: string;
  twitterCard: string;
  twitterSite: string;
  twitterCreator: string;
  locale: string;
  robots: string;
  themeColor: string;
  canonical: string;
  keywords: string;
}

const DEFAULTS: MetaFields = {
  title: "",
  description: "",
  url: "",
  image: "",
  siteName: "",
  author: "",
  ogType: "website",
  twitterCard: "summary_large_image",
  twitterSite: "",
  twitterCreator: "",
  locale: "en_US",
  robots: "index, follow",
  themeColor: "#ffffff",
  canonical: "",
  keywords: "",
};

const OG_TYPES = [
  "website",
  "article",
  "profile",
  "book",
  "music.song",
  "music.album",
  "video.movie",
  "video.episode",
  "product",
];

const TWITTER_CARDS = [
  "summary",
  "summary_large_image",
  "app",
  "player",
];

const ROBOTS_OPTIONS = [
  "index, follow",
  "noindex, follow",
  "index, nofollow",
  "noindex, nofollow",
];

function generateMetaTags(f: MetaFields): string {
  const lines: string[] = [];

  lines.push("<!-- Primary Meta Tags -->");
  if (f.title) lines.push(`<title>${esc(f.title)}</title>`);
  if (f.title) lines.push(`<meta name="title" content="${esc(f.title)}" />`);
  if (f.description) lines.push(`<meta name="description" content="${esc(f.description)}" />`);
  if (f.author) lines.push(`<meta name="author" content="${esc(f.author)}" />`);
  if (f.keywords) lines.push(`<meta name="keywords" content="${esc(f.keywords)}" />`);
  if (f.robots) lines.push(`<meta name="robots" content="${esc(f.robots)}" />`);
  if (f.themeColor) lines.push(`<meta name="theme-color" content="${esc(f.themeColor)}" />`);
  if (f.canonical) lines.push(`<link rel="canonical" href="${esc(f.canonical)}" />`);

  const hasOg = f.title || f.description || f.url || f.image || f.siteName;
  if (hasOg) {
    lines.push("");
    lines.push("<!-- Open Graph / Facebook -->");
    lines.push(`<meta property="og:type" content="${esc(f.ogType)}" />`);
    if (f.url) lines.push(`<meta property="og:url" content="${esc(f.url)}" />`);
    if (f.title) lines.push(`<meta property="og:title" content="${esc(f.title)}" />`);
    if (f.description) lines.push(`<meta property="og:description" content="${esc(f.description)}" />`);
    if (f.image) lines.push(`<meta property="og:image" content="${esc(f.image)}" />`);
    if (f.siteName) lines.push(`<meta property="og:site_name" content="${esc(f.siteName)}" />`);
    if (f.locale) lines.push(`<meta property="og:locale" content="${esc(f.locale)}" />`);
  }

  const hasTwitter = f.title || f.description || f.image;
  if (hasTwitter) {
    lines.push("");
    lines.push("<!-- Twitter -->");
    lines.push(`<meta property="twitter:card" content="${esc(f.twitterCard)}" />`);
    if (f.url) lines.push(`<meta property="twitter:url" content="${esc(f.url)}" />`);
    if (f.title) lines.push(`<meta property="twitter:title" content="${esc(f.title)}" />`);
    if (f.description) lines.push(`<meta property="twitter:description" content="${esc(f.description)}" />`);
    if (f.image) lines.push(`<meta property="twitter:image" content="${esc(f.image)}" />`);
    if (f.twitterSite) lines.push(`<meta property="twitter:site" content="${esc(f.twitterSite)}" />`);
    if (f.twitterCreator) lines.push(`<meta property="twitter:creator" content="${esc(f.twitterCreator)}" />`);
  }

  return lines.join("\n");
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max - 1) + "…";
}

export default function MetaTagGeneratorTool() {
  const [fields, setFields] = useState<MetaFields>(DEFAULTS);
  const [copied, setCopied] = useState(false);
  const [activePreview, setActivePreview] = useState<"google" | "social">("google");
  const { trackAction } = useToolAnalytics("meta-tag-generator");
  const { isLimited, remaining, dailyLimit, recordUsage } = useRateLimit("meta-tag-generator");

  const output = useMemo(() => generateMetaTags(fields), [fields]);
  const hasContent = output.split("\n").some((l) => !l.startsWith("<!--") && l.trim() !== "");

  const handleCopy = async () => {
    if (!hasContent) return;
    recordUsage();
    if (isLimited) return;
    trackAction("copy");
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useKeyboardShortcut("Enter", handleCopy);

  const update = (key: keyof MetaFields, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  };

  const reset = () => setFields(DEFAULTS);

  const charCount = (val: string, max: number) => {
    const len = val.length;
    const over = len > max;
    return (
      <span className={`text-xs ${over ? "text-red-400" : "text-slate-500"}`}>
        {len}/{max}
      </span>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/"
          className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
        >
          ← Back to Tools
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-white mb-2">
        Meta Tag Generator
      </h1>
      <p className="text-slate-400 mb-6">
        Generate HTML meta tags for SEO, Open Graph, and Twitter Cards with live
        preview.
      </p>

      <RateLimitBanner isLimited={isLimited} remaining={remaining} dailyLimit={dailyLimit} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left — Form */}
        <div className="space-y-6">
          {/* Basic Meta Tags */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
            <h2 className="text-lg font-semibold text-white mb-4">
              Basic Meta Tags
            </h2>
            <div className="space-y-4">
              <Field
                label="Page Title"
                value={fields.title}
                onChange={(v) => update("title", v)}
                placeholder="My Awesome Website"
                suffix={charCount(fields.title, 60)}
              />
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm font-medium text-slate-300">
                    Description
                  </label>
                  {charCount(fields.description, 160)}
                </div>
                <textarea
                  value={fields.description}
                  onChange={(e) => update("description", e.target.value)}
                  placeholder="A brief description of your page content..."
                  rows={3}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm resize-none"
                />
              </div>
              <Field
                label="Page URL"
                value={fields.url}
                onChange={(v) => update("url", v)}
                placeholder="https://example.com/page"
                type="url"
              />
              <Field
                label="Canonical URL"
                value={fields.canonical}
                onChange={(v) => update("canonical", v)}
                placeholder="https://example.com/page"
                type="url"
              />
              <Field
                label="Image URL"
                value={fields.image}
                onChange={(v) => update("image", v)}
                placeholder="https://example.com/image.png"
                type="url"
              />
              <Field
                label="Site Name"
                value={fields.siteName}
                onChange={(v) => update("siteName", v)}
                placeholder="My Website"
              />
              <Field
                label="Author"
                value={fields.author}
                onChange={(v) => update("author", v)}
                placeholder="John Doe"
              />
              <Field
                label="Keywords"
                value={fields.keywords}
                onChange={(v) => update("keywords", v)}
                placeholder="web development, tools, seo"
              />
            </div>
          </div>

          {/* Advanced Options */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
            <h2 className="text-lg font-semibold text-white mb-4">
              Advanced Options
            </h2>
            <div className="space-y-4">
              <SelectField
                label="OG Type"
                value={fields.ogType}
                onChange={(v) => update("ogType", v)}
                options={OG_TYPES}
              />
              <SelectField
                label="Twitter Card"
                value={fields.twitterCard}
                onChange={(v) => update("twitterCard", v)}
                options={TWITTER_CARDS}
              />
              <Field
                label="Twitter @site"
                value={fields.twitterSite}
                onChange={(v) => update("twitterSite", v)}
                placeholder="@yoursite"
              />
              <Field
                label="Twitter @creator"
                value={fields.twitterCreator}
                onChange={(v) => update("twitterCreator", v)}
                placeholder="@author"
              />
              <SelectField
                label="Robots"
                value={fields.robots}
                onChange={(v) => update("robots", v)}
                options={ROBOTS_OPTIONS}
              />
              <Field
                label="Locale"
                value={fields.locale}
                onChange={(v) => update("locale", v)}
                placeholder="en_US"
              />
              <div>
                <label className="text-sm font-medium text-slate-300 mb-1 block">
                  Theme Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={fields.themeColor}
                    onChange={(e) => update("themeColor", e.target.value)}
                    className="w-10 h-10 rounded border border-slate-600 cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={fields.themeColor}
                    onChange={(e) => update("themeColor", e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={reset}
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            Reset all fields
          </button>
        </div>

        {/* Right — Output & Preview */}
        <div className="space-y-6">
          {/* Generated Code */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-white">
                Generated Meta Tags
              </h2>
              <button
                onClick={handleCopy}
                disabled={!hasContent || isLimited}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white text-sm rounded-lg transition-colors"
              >
                {copied ? "Copied!" : "Copy All"}
              </button>
            </div>
            <pre className="bg-slate-900 border border-slate-600 rounded-lg p-4 text-sm text-slate-300 overflow-x-auto whitespace-pre-wrap break-words font-mono max-h-[500px] overflow-y-auto">
              {hasContent ? output : "Fill in the fields to generate meta tags..."}
            </pre>
            <p className="text-xs text-slate-500 mt-2">
              Paste these tags inside the <code className="text-slate-400">&lt;head&gt;</code> of your HTML document.
              <span className="ml-2 text-slate-600">Ctrl+Enter to copy</span>
            </p>
          </div>

          {/* Live Preview */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">
                Live Preview
              </h2>
              <div className="flex bg-slate-900 rounded-lg p-0.5">
                <button
                  onClick={() => setActivePreview("google")}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    activePreview === "google"
                      ? "bg-slate-700 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Google
                </button>
                <button
                  onClick={() => setActivePreview("social")}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    activePreview === "social"
                      ? "bg-slate-700 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Social Card
                </button>
              </div>
            </div>

            {activePreview === "google" ? (
              <GooglePreview fields={fields} />
            ) : (
              <SocialPreview fields={fields} />
            )}
          </div>

          {/* Quick Reference */}
          <details className="bg-slate-800 border border-slate-700 rounded-lg">
            <summary className="px-5 py-3 cursor-pointer text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Quick reference
            </summary>
            <div className="px-5 pb-4 text-sm text-slate-400 space-y-3">
              <div>
                <h3 className="text-slate-200 font-medium mb-1">Title</h3>
                <p>Keep under 60 characters. Google truncates at ~60 chars in search results.</p>
              </div>
              <div>
                <h3 className="text-slate-200 font-medium mb-1">Description</h3>
                <p>Keep under 160 characters. This appears below the title in search results.</p>
              </div>
              <div>
                <h3 className="text-slate-200 font-medium mb-1">OG Image</h3>
                <p>Recommended size: 1200×630px. Use absolute URLs (https://...).</p>
              </div>
              <div>
                <h3 className="text-slate-200 font-medium mb-1">Twitter Cards</h3>
                <p><code className="text-slate-300">summary</code> — small square image. <code className="text-slate-300">summary_large_image</code> — large banner image above title.</p>
              </div>
              <div>
                <h3 className="text-slate-200 font-medium mb-1">Canonical URL</h3>
                <p>Use when multiple URLs serve the same content to tell search engines which is the &quot;real&quot; page.</p>
              </div>
            </div>
          </details>
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
  type = "text",
  suffix,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  suffix?: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-sm font-medium text-slate-300">{label}</label>
        {suffix}
      </div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
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

function GooglePreview({ fields }: { fields: MetaFields }) {
  const title = fields.title || "Page Title";
  const desc = fields.description || "Page description will appear here...";
  const url = fields.url || "https://example.com";

  return (
    <div className="bg-white rounded-lg p-4">
      <div className="text-sm text-[#202124] truncate" style={{ fontFamily: "Arial, sans-serif" }}>
        {url}
      </div>
      <div
        className="text-xl text-[#1a0dab] hover:underline cursor-pointer truncate mt-0.5"
        style={{ fontFamily: "Arial, sans-serif" }}
      >
        {truncate(title, 60)}
      </div>
      <div
        className="text-sm text-[#4d5156] mt-0.5 line-clamp-2"
        style={{ fontFamily: "Arial, sans-serif" }}
      >
        {truncate(desc, 160)}
      </div>
    </div>
  );
}

function SocialPreview({ fields }: { fields: MetaFields }) {
  const title = fields.title || "Page Title";
  const desc = fields.description || "Page description will appear here...";
  const displayUrl = fields.url
    ? fields.url.replace(/^https?:\/\//, "").split("/")[0]
    : "example.com";

  return (
    <div className="bg-slate-900 border border-slate-600 rounded-lg overflow-hidden">
      {/* Image placeholder */}
      <div className="w-full h-[160px] bg-slate-700 flex items-center justify-center">
        {fields.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={fields.image}
            alt="OG preview"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
              (e.target as HTMLImageElement).parentElement!.classList.add("flex", "items-center", "justify-center");
              const span = document.createElement("span");
              span.className = "text-slate-500 text-sm";
              span.textContent = "Image preview";
              (e.target as HTMLImageElement).parentElement!.appendChild(span);
            }}
          />
        ) : (
          <span className="text-slate-500 text-sm">Image preview</span>
        )}
      </div>
      <div className="p-3">
        <div className="text-xs text-slate-500 uppercase tracking-wide">
          {displayUrl}
        </div>
        <div className="text-white font-semibold mt-1 truncate">
          {truncate(title, 70)}
        </div>
        <div className="text-sm text-slate-400 mt-0.5 line-clamp-2">
          {truncate(desc, 200)}
        </div>
      </div>
    </div>
  );
}
