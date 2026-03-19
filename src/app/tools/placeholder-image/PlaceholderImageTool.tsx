"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import RateLimitBanner from "@/components/RateLimitBanner";

interface Preset {
  label: string;
  width: number;
  height: number;
  group: string;
}

const PRESETS: Preset[] = [
  // Common web
  { label: "Square", width: 400, height: 400, group: "Common" },
  { label: "Banner", width: 728, height: 90, group: "Common" },
  { label: "Thumbnail", width: 150, height: 150, group: "Common" },
  { label: "Hero", width: 1920, height: 600, group: "Common" },
  // Social media
  { label: "OG Image", width: 1200, height: 630, group: "Social" },
  { label: "Twitter Card", width: 1200, height: 675, group: "Social" },
  { label: "Instagram Post", width: 1080, height: 1080, group: "Social" },
  { label: "Instagram Story", width: 1080, height: 1920, group: "Social" },
  { label: "Facebook Cover", width: 820, height: 312, group: "Social" },
  // Devices
  { label: "iPhone 15", width: 393, height: 852, group: "Devices" },
  { label: "iPad", width: 810, height: 1080, group: "Devices" },
  { label: "MacBook", width: 1440, height: 900, group: "Devices" },
  { label: "4K", width: 3840, height: 2160, group: "Devices" },
  // Ads
  { label: "Leaderboard", width: 728, height: 90, group: "Ads" },
  { label: "Medium Rect", width: 300, height: 250, group: "Ads" },
  { label: "Skyscraper", width: 160, height: 600, group: "Ads" },
];

const FORMAT_OPTIONS = ["PNG", "JPEG", "WebP", "SVG"] as const;
type ImageFormat = (typeof FORMAT_OPTIONS)[number];

function getContrastColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#333333" : "#ffffff";
}

export default function PlaceholderImageTool() {
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [bgColor, setBgColor] = useState("#cccccc");
  const [textColor, setTextColor] = useState("#666666");
  const [customText, setCustomText] = useState("");
  const [fontSize, setFontSize] = useState(0); // 0 = auto
  const [format, setFormat] = useState<ImageFormat>("PNG");
  const [copied, setCopied] = useState(false);
  const [presetGroup, setPresetGroup] = useState("Common");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  const { trackAction } = useToolAnalytics("placeholder-image");
  const { remaining, dailyLimit, isLimited, recordUsage } =
    useRateLimit("placeholder-image");

  const displayText = customText || `${width} × ${height}`;

  const computedFontSize =
    fontSize > 0 ? fontSize : Math.max(14, Math.min(width, height) / 8);

  // Draw on the preview canvas whenever settings change
  useEffect(() => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;

    // Scale preview to fit, max 500px wide
    const maxPreview = 500;
    const scale = Math.min(1, maxPreview / width, maxPreview / height);
    const pw = Math.round(width * scale);
    const ph = Math.round(height * scale);

    canvas.width = pw;
    canvas.height = ph;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, pw, ph);

    const scaledFontSize = Math.max(10, computedFontSize * scale);
    ctx.font = `600 ${scaledFontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    ctx.fillStyle = textColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(displayText, pw / 2, ph / 2, pw - 20);
  }, [width, height, bgColor, textColor, displayText, computedFontSize]);

  const drawFullCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    ctx.font = `600 ${computedFontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    ctx.fillStyle = textColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(displayText, width / 2, height / 2, width - 40);
  }, [width, height, bgColor, textColor, displayText, computedFontSize]);

  function generateSvg(): string {
    const escapedText = displayText
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="100%" height="100%" fill="${bgColor}"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
    font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif"
    font-weight="600" font-size="${computedFontSize}" fill="${textColor}">${escapedText}</text>
</svg>`;
  }

  const handleDownload = useCallback(() => {
    if (isLimited) return;
    recordUsage();
    trackAction("download");

    if (format === "SVG") {
      const svg = generateSvg();
      const blob = new Blob([svg], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `placeholder-${width}x${height}.svg`;
      a.click();
      URL.revokeObjectURL(url);
      return;
    }

    drawFullCanvas();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const mimeTypes: Record<string, string> = {
      PNG: "image/png",
      JPEG: "image/jpeg",
      WebP: "image/webp",
    };
    const extensions: Record<string, string> = {
      PNG: "png",
      JPEG: "jpg",
      WebP: "webp",
    };

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `placeholder-${width}x${height}.${extensions[format]}`;
        a.click();
        URL.revokeObjectURL(url);
      },
      mimeTypes[format],
      format === "JPEG" ? 0.92 : undefined,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    width,
    height,
    bgColor,
    textColor,
    displayText,
    computedFontSize,
    format,
    isLimited,
    recordUsage,
    trackAction,
    drawFullCanvas,
  ]);

  const handleCopyDataUrl = useCallback(() => {
    if (isLimited) return;
    recordUsage();
    trackAction("copy-data-url");

    if (format === "SVG") {
      const svg = generateSvg();
      const dataUrl = `data:image/svg+xml;base64,${btoa(svg)}`;
      navigator.clipboard.writeText(dataUrl);
    } else {
      drawFullCanvas();
      const canvas = canvasRef.current;
      if (!canvas) return;
      const mimeTypes: Record<string, string> = {
        PNG: "image/png",
        JPEG: "image/jpeg",
        WebP: "image/webp",
      };
      const dataUrl = canvas.toDataURL(mimeTypes[format], 0.92);
      navigator.clipboard.writeText(dataUrl);
    }

    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    width,
    height,
    bgColor,
    textColor,
    displayText,
    computedFontSize,
    format,
    isLimited,
    recordUsage,
    trackAction,
    drawFullCanvas,
  ]);

  const handleCopyHtml = useCallback(() => {
    trackAction("copy-html");
    const tag = `<img src="https://devbolt.dev/api/placeholder/${width}x${height}?bg=${bgColor.slice(1)}&text=${textColor.slice(1)}" alt="Placeholder ${width}x${height}" width="${width}" height="${height}" />`;
    navigator.clipboard.writeText(tag);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [width, height, bgColor, textColor, trackAction]);

  useKeyboardShortcut("Enter", handleDownload);

  function handlePreset(preset: Preset) {
    setWidth(preset.width);
    setHeight(preset.height);
  }

  function handleSwapDimensions() {
    setWidth(height);
    setHeight(width);
  }

  function handleAutoTextColor() {
    setTextColor(getContrastColor(bgColor));
  }

  const groups = [...new Set(PRESETS.map((p) => p.group))];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="mb-8 block text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        &larr; Back to tools
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Placeholder Image Generator
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Generate custom placeholder images for wireframes, mockups, and
        prototyping. Download as PNG, JPEG, WebP, or SVG.
      </p>

      <RateLimitBanner
        remaining={remaining}
        dailyLimit={dailyLimit}
        isLimited={isLimited}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
        {/* Controls */}
        <div className="space-y-5">
          {/* Dimensions */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Dimensions (px)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={width}
                onChange={(e) =>
                  setWidth(Math.max(1, Math.min(4096, Number(e.target.value))))
                }
                min={1}
                max={4096}
                className="w-28 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
              />
              <span className="text-gray-400">×</span>
              <input
                type="number"
                value={height}
                onChange={(e) =>
                  setHeight(Math.max(1, Math.min(4096, Number(e.target.value))))
                }
                min={1}
                max={4096}
                className="w-28 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
              />
              <button
                onClick={handleSwapDimensions}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
                title="Swap width and height"
              >
                ⇄
              </button>
            </div>
          </div>

          {/* Presets */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Presets
            </label>
            <div className="mb-2 flex gap-1">
              {groups.map((g) => (
                <button
                  key={g}
                  onClick={() => setPresetGroup(g)}
                  className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                    presetGroup === g
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {PRESETS.filter((p) => p.group === presetGroup).map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => handlePreset(preset)}
                  className={`rounded border px-2.5 py-1 text-xs transition-colors ${
                    width === preset.width && height === preset.height
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                      : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
                  }`}
                >
                  {preset.label}{" "}
                  <span className="text-gray-400 dark:text-gray-500">
                    {preset.width}×{preset.height}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Background
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="h-9 w-9 cursor-pointer rounded border border-gray-300 dark:border-gray-600"
                />
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (/^#[0-9a-fA-F]{0,6}$/.test(v)) setBgColor(v);
                  }}
                  className="w-24 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-mono text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Text Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="h-9 w-9 cursor-pointer rounded border border-gray-300 dark:border-gray-600"
                />
                <input
                  type="text"
                  value={textColor}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (/^#[0-9a-fA-F]{0,6}$/.test(v)) setTextColor(v);
                  }}
                  className="w-24 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-mono text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                />
                <button
                  onClick={handleAutoTextColor}
                  className="rounded-lg border border-gray-300 px-2.5 py-2 text-xs text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
                  title="Auto-pick contrasting text color"
                >
                  Auto
                </button>
              </div>
            </div>
          </div>

          {/* Custom text */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Custom Text{" "}
              <span className="font-normal text-gray-400">
                (blank = dimensions)
              </span>
            </label>
            <input
              type="text"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder={`${width} × ${height}`}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
            />
          </div>

          {/* Font size */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Font Size{" "}
              <span className="font-normal text-gray-400">
                (0 = auto: {Math.round(computedFontSize)}px)
              </span>
            </label>
            <input
              type="number"
              value={fontSize}
              onChange={(e) =>
                setFontSize(Math.max(0, Math.min(500, Number(e.target.value))))
              }
              min={0}
              max={500}
              className="w-28 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
            />
          </div>

          {/* Format */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Format
            </label>
            <div className="flex gap-1.5">
              {FORMAT_OPTIONS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                    format === f
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleDownload}
              disabled={isLimited}
              className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-gray-900"
            >
              Download {format}{" "}
              <kbd className="ml-1.5 hidden rounded bg-indigo-500 px-1.5 py-0.5 text-xs font-medium sm:inline-block">
                Ctrl+Enter
              </kbd>
            </button>
            <button
              onClick={handleCopyDataUrl}
              disabled={isLimited}
              className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            >
              {copied ? "Copied!" : "Copy Data URL"}
            </button>
            <button
              onClick={handleCopyHtml}
              className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
            >
              Copy HTML Tag
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className="flex flex-col items-center">
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Preview
          </label>
          <div className="rounded-lg border border-gray-200 bg-white p-2 dark:border-gray-700 dark:bg-gray-900">
            <canvas
              ref={previewCanvasRef}
              className="block max-w-full"
              style={{ imageRendering: "auto" }}
            />
          </div>
          <p className="mt-2 text-xs text-gray-400">
            {width} × {height}px &middot; {format}
          </p>
        </div>
      </div>

      {/* Hidden full-size canvas for export */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Info */}
      <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          About Placeholder Image Generator
        </h2>
        <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
          <li>
            <strong>Instant placeholders</strong> — generate images for
            wireframes, mockups, and UI prototyping without any external
            service.
          </li>
          <li>
            <strong>Custom dimensions</strong> — set any width and height up to
            4096px, or use presets for social media, devices, and ad sizes.
          </li>
          <li>
            <strong>Multiple formats</strong> — download as PNG, JPEG, WebP, or
            SVG. Copy as a data URL for inline use.
          </li>
          <li>
            <strong>Custom text &amp; colors</strong> — add your own label text,
            pick background and text colors, or auto-detect contrast.
          </li>
          <li>
            Everything runs in your browser — no data is sent over the network.
          </li>
        </ul>
      </div>
    </div>
  );
}
