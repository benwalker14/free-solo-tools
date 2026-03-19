"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import RateLimitBanner from "@/components/RateLimitBanner";

/* ─── Types ─── */

interface MetaTag {
  type: "meta" | "title" | "link";
  property?: string;
  name?: string;
  content?: string;
  rel?: string;
  href?: string;
}

interface OgData {
  title: string;
  description: string;
  image: string;
  url: string;
  siteName: string;
  type: string;
  locale: string;
  twitterCard: string;
  twitterSite: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  canonical: string;
  favicon: string;
}

interface ValidationItem {
  level: "error" | "warning" | "pass";
  message: string;
}

type InputMode = "url" | "html";
type PreviewTab = "facebook" | "twitter" | "linkedin" | "slack";

/* ─── Helpers ─── */

function extractOgData(tags: MetaTag[]): OgData {
  const get = (key: string): string => {
    const tag = tags.find(
      (t) => t.property === key || t.name === key
    );
    return tag?.content || "";
  };

  const titleTag = tags.find((t) => t.type === "title");
  const canonical = tags.find((t) => t.type === "link" && t.rel === "canonical");
  const favicon = tags.find(
    (t) => t.type === "link" && (t.rel === "icon" || t.rel === "shortcut icon")
  );

  return {
    title: get("og:title") || get("twitter:title") || titleTag?.content || "",
    description:
      get("og:description") || get("twitter:description") || get("description") || "",
    image: get("og:image") || get("twitter:image") || "",
    url: get("og:url") || "",
    siteName: get("og:site_name") || "",
    type: get("og:type") || "",
    locale: get("og:locale") || "",
    twitterCard: get("twitter:card") || "",
    twitterSite: get("twitter:site") || "",
    twitterTitle: get("twitter:title") || "",
    twitterDescription: get("twitter:description") || "",
    twitterImage: get("twitter:image") || "",
    canonical: canonical?.href || "",
    favicon: favicon?.href || "",
  };
}

function validateTags(data: OgData, tags: MetaTag[]): ValidationItem[] {
  const items: ValidationItem[] = [];

  // Title checks
  if (!data.title) {
    items.push({ level: "error", message: "Missing page title (og:title or <title>)" });
  } else if (data.title.length > 90) {
    items.push({ level: "warning", message: `Title is ${data.title.length} chars — keep under 60-70 for best display` });
  } else {
    items.push({ level: "pass", message: "Title is present and well-sized" });
  }

  // Description checks
  if (!data.description) {
    items.push({ level: "error", message: "Missing description (og:description or meta description)" });
  } else if (data.description.length > 200) {
    items.push({ level: "warning", message: `Description is ${data.description.length} chars — keep under 160-200` });
  } else {
    items.push({ level: "pass", message: "Description is present and well-sized" });
  }

  // Image checks
  if (!data.image) {
    items.push({ level: "warning", message: "No og:image — links will appear without an image preview" });
  } else {
    if (!data.image.startsWith("http")) {
      items.push({ level: "warning", message: "og:image should use an absolute URL (https://...)" });
    } else {
      items.push({ level: "pass", message: "og:image is present with absolute URL" });
    }
  }

  // OG specific tags
  const hasOgTitle = tags.some((t) => t.property === "og:title");
  const hasOgDesc = tags.some((t) => t.property === "og:description");
  if (!hasOgTitle) {
    items.push({ level: "warning", message: "Missing og:title — Facebook/LinkedIn will use <title> as fallback" });
  }
  if (!hasOgDesc) {
    items.push({ level: "warning", message: "Missing og:description — social platforms will use meta description as fallback" });
  }

  // og:url
  if (!data.url) {
    items.push({ level: "warning", message: "Missing og:url — recommended for canonical social sharing URL" });
  } else {
    items.push({ level: "pass", message: "og:url is present" });
  }

  // og:type
  if (!data.type) {
    items.push({ level: "warning", message: "Missing og:type — defaults to 'website', but explicit is better" });
  } else {
    items.push({ level: "pass", message: `og:type is "${data.type}"` });
  }

  // Twitter card checks
  if (!data.twitterCard) {
    items.push({ level: "warning", message: "Missing twitter:card — Twitter/X will not show a rich preview" });
  } else {
    const valid = ["summary", "summary_large_image", "app", "player"];
    if (!valid.includes(data.twitterCard)) {
      items.push({ level: "error", message: `Invalid twitter:card value "${data.twitterCard}"` });
    } else {
      items.push({ level: "pass", message: `twitter:card is "${data.twitterCard}"` });
    }
  }

  return items;
}

function parseHtmlToTags(html: string): MetaTag[] {
  const tags: MetaTag[] = [];

  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (titleMatch) {
    tags.push({ type: "title", content: titleMatch[1].trim() });
  }

  const metaRegex = /<meta\s+([^>]*?)\/?>/gi;
  let match;
  while ((match = metaRegex.exec(html)) !== null) {
    const attrs = match[1];
    const tag: MetaTag = { type: "meta" };
    const propMatch = attrs.match(/property\s*=\s*["']([^"']+)["']/i);
    const nameMatch = attrs.match(/name\s*=\s*["']([^"']+)["']/i);
    const contentMatch = attrs.match(/content\s*=\s*["']([^"']*?)["']/i);
    if (propMatch) tag.property = propMatch[1];
    if (nameMatch) tag.name = nameMatch[1];
    if (contentMatch) tag.content = contentMatch[1];
    if (tag.property || tag.name) tags.push(tag);
  }

  const linkRegex = /<link\s+([^>]*?)\/?>/gi;
  while ((match = linkRegex.exec(html)) !== null) {
    const attrs = match[1];
    const relMatch = attrs.match(/rel\s*=\s*["']([^"']+)["']/i);
    const hrefMatch = attrs.match(/href\s*=\s*["']([^"']*?)["']/i);
    if (relMatch && hrefMatch) {
      const rel = relMatch[1].toLowerCase();
      if (["canonical", "icon", "shortcut icon", "apple-touch-icon"].includes(rel)) {
        tags.push({ type: "link", rel, href: hrefMatch[1] });
      }
    }
  }

  return tags;
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max - 1) + "\u2026";
}

function domainFrom(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url.replace(/^https?:\/\//, "").split("/")[0] || "example.com";
  }
}

/* ─── Main Component ─── */

export default function OgPreviewTool() {
  const [mode, setMode] = useState<InputMode>("url");
  const [urlInput, setUrlInput] = useState("");
  const [htmlInput, setHtmlInput] = useState("");
  const [tags, setTags] = useState<MetaTag[] | null>(null);
  const [fetchedUrl, setFetchedUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [previewTab, setPreviewTab] = useState<PreviewTab>("facebook");

  const { trackAction } = useToolAnalytics("og-preview");
  const { isLimited, remaining, dailyLimit, recordUsage } = useRateLimit("og-preview");

  const ogData = useMemo(() => (tags ? extractOgData(tags) : null), [tags]);
  const validation = useMemo(
    () => (ogData && tags ? validateTags(ogData, tags) : []),
    [ogData, tags]
  );

  const handleFetchUrl = useCallback(async () => {
    if (!urlInput.trim() || isLimited) return;
    recordUsage();
    trackAction("fetch-url");
    setError("");
    setLoading(true);
    setTags(null);

    try {
      const res = await fetch("/api/og-fetch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlInput.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to fetch URL");
      } else {
        setTags(data.tags);
        setFetchedUrl(data.url || urlInput.trim());
      }
    } catch {
      setError("Network error — could not reach the server");
    } finally {
      setLoading(false);
    }
  }, [urlInput, isLimited, recordUsage, trackAction]);

  const handleParseHtml = useCallback(() => {
    if (!htmlInput.trim() || isLimited) return;
    recordUsage();
    trackAction("parse-html");
    setError("");
    const parsed = parseHtmlToTags(htmlInput);
    if (parsed.length === 0) {
      setError("No meta tags found in the provided HTML");
      setTags(null);
    } else {
      setTags(parsed);
      setFetchedUrl("");
    }
  }, [htmlInput, isLimited, recordUsage, trackAction]);

  const handleAnalyze = mode === "url" ? handleFetchUrl : handleParseHtml;

  useKeyboardShortcut("Enter", handleAnalyze);

  const handleReset = () => {
    setUrlInput("");
    setHtmlInput("");
    setTags(null);
    setFetchedUrl("");
    setError("");
  };

  const errorCount = validation.filter((v) => v.level === "error").length;
  const warningCount = validation.filter((v) => v.level === "warning").length;
  const passCount = validation.filter((v) => v.level === "pass").length;

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
        Open Graph Preview & Debugger
      </h1>
      <p className="text-slate-400 mb-6">
        Preview how your links look on Facebook, Twitter/X, LinkedIn, and Slack.
        Debug missing or invalid meta tags.
      </p>

      <RateLimitBanner isLimited={isLimited} remaining={remaining} dailyLimit={dailyLimit} />

      {/* Input Section */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-5 mb-6">
        {/* Mode Toggle */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex bg-slate-900 rounded-lg p-0.5">
            <button
              onClick={() => setMode("url")}
              className={`px-4 py-1.5 text-sm rounded-md transition-colors ${
                mode === "url"
                  ? "bg-slate-700 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Fetch URL
            </button>
            <button
              onClick={() => setMode("html")}
              className={`px-4 py-1.5 text-sm rounded-md transition-colors ${
                mode === "html"
                  ? "bg-slate-700 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Paste HTML
            </button>
          </div>
          {tags && (
            <button
              onClick={handleReset}
              className="ml-auto text-sm text-slate-400 hover:text-white transition-colors"
            >
              Reset
            </button>
          )}
        </div>

        {mode === "url" ? (
          <div className="flex gap-3">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com"
              className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.ctrlKey) {
                  e.preventDefault();
                  handleFetchUrl();
                }
              }}
            />
            <button
              onClick={handleFetchUrl}
              disabled={!urlInput.trim() || loading || isLimited}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
            >
              {loading ? "Fetching\u2026" : "Analyze"}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <textarea
              value={htmlInput}
              onChange={(e) => setHtmlInput(e.target.value)}
              placeholder={'Paste your HTML <head> content or full HTML here...\n\nExample:\n<meta property="og:title" content="My Page" />\n<meta property="og:description" content="Description here" />\n<meta property="og:image" content="https://example.com/image.png" />'}
              rows={6}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm font-mono resize-none"
            />
            <button
              onClick={handleParseHtml}
              disabled={!htmlInput.trim() || isLimited}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
            >
              Analyze HTML
            </button>
          </div>
        )}

        {error && (
          <div className="mt-3 px-4 py-2.5 bg-red-900/40 border border-red-700 rounded-lg text-sm text-red-300">
            {error}
          </div>
        )}

        <p className="text-xs text-slate-500 mt-3">
          {mode === "url"
            ? "Enter a URL to fetch and analyze its Open Graph and meta tags."
            : "Paste HTML containing meta tags to preview how they render on social platforms."}
          <span className="ml-2 text-slate-600">Ctrl+Enter to analyze</span>
        </p>
      </div>

      {/* Results */}
      {ogData && tags && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left — Previews */}
          <div className="space-y-6">
            {/* Social Previews */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">
                  Social Previews
                </h2>
                <div className="flex bg-slate-900 rounded-lg p-0.5">
                  {(["facebook", "twitter", "linkedin", "slack"] as PreviewTab[]).map(
                    (tab) => (
                      <button
                        key={tab}
                        onClick={() => setPreviewTab(tab)}
                        className={`px-3 py-1 text-sm rounded-md transition-colors capitalize ${
                          previewTab === tab
                            ? "bg-slate-700 text-white"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        {tab === "twitter" ? "X / Twitter" : tab}
                      </button>
                    )
                  )}
                </div>
              </div>

              {previewTab === "facebook" && (
                <FacebookPreview data={ogData} url={fetchedUrl} />
              )}
              {previewTab === "twitter" && (
                <TwitterPreview data={ogData} url={fetchedUrl} />
              )}
              {previewTab === "linkedin" && (
                <LinkedInPreview data={ogData} url={fetchedUrl} />
              )}
              {previewTab === "slack" && (
                <SlackPreview data={ogData} url={fetchedUrl} />
              )}
            </div>

            {/* Validation */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
              <h2 className="text-lg font-semibold text-white mb-3">
                Validation
              </h2>
              <div className="flex gap-4 mb-4 text-sm">
                {errorCount > 0 && (
                  <span className="text-red-400">
                    {errorCount} error{errorCount !== 1 ? "s" : ""}
                  </span>
                )}
                {warningCount > 0 && (
                  <span className="text-amber-400">
                    {warningCount} warning{warningCount !== 1 ? "s" : ""}
                  </span>
                )}
                {passCount > 0 && (
                  <span className="text-green-400">
                    {passCount} passed
                  </span>
                )}
              </div>
              <div className="space-y-2">
                {validation.map((item, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-2 text-sm px-3 py-2 rounded-lg ${
                      item.level === "error"
                        ? "bg-red-900/20 text-red-300"
                        : item.level === "warning"
                        ? "bg-amber-900/20 text-amber-300"
                        : "bg-green-900/20 text-green-300"
                    }`}
                  >
                    <span className="mt-0.5 shrink-0">
                      {item.level === "error"
                        ? "\u2716"
                        : item.level === "warning"
                        ? "\u26A0"
                        : "\u2714"}
                    </span>
                    <span>{item.message}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — Tag Table */}
          <div className="space-y-6">
            {/* Extracted OG Data */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
              <h2 className="text-lg font-semibold text-white mb-3">
                Open Graph Data
              </h2>
              <div className="space-y-2">
                {([
                  ["og:title", ogData.title],
                  ["og:description", ogData.description],
                  ["og:image", ogData.image],
                  ["og:url", ogData.url],
                  ["og:site_name", ogData.siteName],
                  ["og:type", ogData.type],
                  ["og:locale", ogData.locale],
                  ["twitter:card", ogData.twitterCard],
                  ["twitter:site", ogData.twitterSite],
                  ["twitter:title", ogData.twitterTitle],
                  ["twitter:description", ogData.twitterDescription],
                  ["twitter:image", ogData.twitterImage],
                  ["canonical", ogData.canonical],
                ] as [string, string][]).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-start gap-3 text-sm"
                  >
                    <span className="text-slate-400 font-mono shrink-0 min-w-[160px]">
                      {key}
                    </span>
                    {value ? (
                      <span className="text-white break-all">
                        {key.includes("image") && value.startsWith("http") ? (
                          <a
                            href={value}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 underline"
                          >
                            {truncate(value, 80)}
                          </a>
                        ) : (
                          truncate(value, 120)
                        )}
                      </span>
                    ) : (
                      <span className="text-slate-600 italic">not set</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* All Meta Tags */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
              <h2 className="text-lg font-semibold text-white mb-3">
                All Detected Tags ({tags.length})
              </h2>
              <div className="max-h-[400px] overflow-y-auto space-y-1">
                {tags.map((tag, i) => (
                  <div
                    key={i}
                    className="text-sm font-mono px-3 py-1.5 bg-slate-900 rounded text-slate-300 break-all"
                  >
                    {tag.type === "title" && (
                      <>
                        <span className="text-purple-400">&lt;title&gt;</span>{" "}
                        {tag.content}
                      </>
                    )}
                    {tag.type === "meta" && (
                      <>
                        <span className="text-blue-400">
                          {tag.property || tag.name}
                        </span>
                        {" = "}
                        <span className="text-green-300">
                          {tag.content || ""}
                        </span>
                      </>
                    )}
                    {tag.type === "link" && (
                      <>
                        <span className="text-amber-400">
                          link[{tag.rel}]
                        </span>
                        {" = "}
                        <span className="text-green-300">{tag.href}</span>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty state before analysis */}
      {!tags && !loading && !error && (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-12 text-center">
          <div className="text-4xl mb-3 text-slate-600">OG</div>
          <p className="text-slate-400 text-sm">
            Enter a URL or paste HTML above to preview how your page looks when
            shared on social media.
          </p>
          <p className="text-slate-500 text-xs mt-2">
            Works with Facebook, Twitter/X, LinkedIn, Slack, Discord, and more.
          </p>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-12 text-center">
          <div className="text-slate-400 text-sm">
            Fetching and analyzing meta tags...
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Preview Components ─── */

function ImagePlaceholder({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className={`bg-slate-700 flex items-center justify-center ${className || ""}`}>
        <span className="text-slate-500 text-sm">No image</span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={`object-cover ${className || ""}`}
      onError={() => setFailed(true)}
    />
  );
}

function FacebookPreview({ data, url }: { data: OgData; url: string }) {
  const domain = domainFrom(data.url || url);
  const title = data.title || "Page Title";
  const desc = data.description || "No description available";

  return (
    <div className="border border-slate-600 rounded-lg overflow-hidden bg-[#242526]">
      <ImagePlaceholder
        src={data.image}
        alt="OG preview"
        className="w-full h-[200px]"
      />
      <div className="px-3 py-2.5 border-t border-slate-600">
        <div className="text-xs text-[#b0b3b8] uppercase tracking-wide">
          {domain}
        </div>
        <div className="text-[#e4e6eb] font-semibold mt-0.5 line-clamp-2 text-[15px] leading-tight">
          {truncate(title, 90)}
        </div>
        <div className="text-sm text-[#b0b3b8] mt-0.5 line-clamp-1">
          {truncate(desc, 110)}
        </div>
      </div>
    </div>
  );
}

function TwitterPreview({ data, url }: { data: OgData; url: string }) {
  const domain = domainFrom(data.url || url);
  const title = data.twitterTitle || data.title || "Page Title";
  const desc = data.twitterDescription || data.description || "";
  const image = data.twitterImage || data.image;
  const isLargeCard = data.twitterCard !== "summary";

  if (isLargeCard) {
    return (
      <div className="border border-slate-600 rounded-2xl overflow-hidden bg-[#15202b]">
        <ImagePlaceholder
          src={image}
          alt="Twitter preview"
          className="w-full h-[200px]"
        />
        <div className="px-3 py-2.5">
          <div className="text-[13px] text-[#8899a6]">{domain}</div>
          <div className="text-white font-normal text-[15px] leading-tight line-clamp-2">
            {truncate(title, 70)}
          </div>
          <div className="text-[#8899a6] text-[15px] mt-0.5 line-clamp-2">
            {truncate(desc, 200)}
          </div>
        </div>
      </div>
    );
  }

  // summary card — horizontal layout
  return (
    <div className="border border-slate-600 rounded-2xl overflow-hidden bg-[#15202b] flex">
      <ImagePlaceholder
        src={image}
        alt="Twitter preview"
        className="w-[130px] h-[130px] shrink-0"
      />
      <div className="px-3 py-2.5 flex flex-col justify-center min-w-0">
        <div className="text-[13px] text-[#8899a6]">{domain}</div>
        <div className="text-white font-normal text-[15px] leading-tight line-clamp-2">
          {truncate(title, 70)}
        </div>
        <div className="text-[#8899a6] text-[15px] mt-0.5 line-clamp-2">
          {truncate(desc, 200)}
        </div>
      </div>
    </div>
  );
}

function LinkedInPreview({ data, url }: { data: OgData; url: string }) {
  const domain = domainFrom(data.url || url);
  const title = data.title || "Page Title";
  const desc = data.description || "";

  return (
    <div className="border border-slate-600 rounded-lg overflow-hidden bg-[#1b1f23]">
      <ImagePlaceholder
        src={data.image}
        alt="LinkedIn preview"
        className="w-full h-[200px]"
      />
      <div className="px-3 py-2.5 border-t border-slate-600">
        <div className="text-[14px] text-white font-semibold line-clamp-2 leading-tight">
          {truncate(title, 90)}
        </div>
        {desc && (
          <div className="text-[12px] text-[#ffffffb3] mt-0.5 line-clamp-2">
            {truncate(desc, 200)}
          </div>
        )}
        <div className="text-[12px] text-[#ffffff99] mt-1">{domain}</div>
      </div>
    </div>
  );
}

function SlackPreview({ data, url }: { data: OgData; url: string }) {
  const domain = data.siteName || domainFrom(data.url || url);
  const title = data.title || "Page Title";
  const desc = data.description || "";

  return (
    <div className="bg-[#1a1d21] rounded-lg overflow-hidden">
      <div className="flex">
        <div className="w-1 bg-slate-500 shrink-0 rounded-l" />
        <div className="p-3 min-w-0 flex-1">
          <div className="text-[13px] text-[#d1d2d3] font-bold">{domain}</div>
          <div className="text-[15px] text-[#1d9bd1] font-medium mt-0.5 line-clamp-1 hover:underline cursor-pointer">
            {truncate(title, 90)}
          </div>
          {desc && (
            <div className="text-[13px] text-[#d1d2d3] mt-0.5 line-clamp-3">
              {truncate(desc, 300)}
            </div>
          )}
          {data.image && (
            <div className="mt-2">
              <ImagePlaceholder
                src={data.image}
                alt="Slack preview"
                className="max-w-[360px] max-h-[200px] rounded"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
