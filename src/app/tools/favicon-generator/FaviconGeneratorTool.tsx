"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";

const FAVICON_SIZES = [16, 32, 48, 180, 192, 512] as const;

const SHAPE_OPTIONS = [
  { value: "square", label: "Square", radius: 0 },
  { value: "rounded", label: "Rounded", radius: 20 },
  { value: "circle", label: "Circle", radius: 50 },
] as const;

const PRESETS = [
  { label: "Blue / White", bg: "#3b82f6", fg: "#ffffff", text: "D" },
  { label: "Dark / Cyan", bg: "#0f172a", fg: "#22d3ee", text: "⚡" },
  { label: "Green / White", bg: "#16a34a", fg: "#ffffff", text: "✓" },
  { label: "Red / White", bg: "#dc2626", fg: "#ffffff", text: "!" },
  { label: "Purple / White", bg: "#7c3aed", fg: "#ffffff", text: "★" },
  { label: "Orange / Dark", bg: "#f97316", fg: "#1e293b", text: "🔥" },
  { label: "Black / Yellow", bg: "#000000", fg: "#facc15", text: "⚙" },
  { label: "Gradient Blue", bg: "#2563eb", fg: "#ffffff", text: "▶" },
];

function drawFavicon(
  canvas: HTMLCanvasElement,
  size: number,
  text: string,
  bgColor: string,
  fgColor: string,
  radiusPercent: number,
  fontScale: number,
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  canvas.width = size;
  canvas.height = size;
  ctx.clearRect(0, 0, size, size);

  // Draw background with border radius
  const radius = (radiusPercent / 100) * (size / 2);
  ctx.beginPath();
  ctx.roundRect(0, 0, size, size, radius);
  ctx.fillStyle = bgColor;
  ctx.fill();

  // Draw text/emoji
  if (text) {
    const fontSize = Math.round(size * (fontScale / 100));
    ctx.font = `bold ${fontSize}px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", system-ui, sans-serif`;
    ctx.fillStyle = fgColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, size / 2, size / 2 + size * 0.03);
  }
}

export default function FaviconGeneratorTool() {
  const [text, setText] = useState("D");
  const [bgColor, setBgColor] = useState("#3b82f6");
  const [fgColor, setFgColor] = useState("#ffffff");
  const [shape, setShape] = useState<"square" | "rounded" | "circle">("rounded");
  const [fontScale, setFontScale] = useState(60);
  const [copied, setCopied] = useState<string | null>(null);

  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const downloadCanvasRef = useRef<HTMLCanvasElement>(null);
  const { trackAction } = useToolAnalytics("favicon-generator");

  const radiusPercent = SHAPE_OPTIONS.find((s) => s.value === shape)?.radius ?? 20;

  // Redraw preview whenever config changes
  useEffect(() => {
    if (previewCanvasRef.current) {
      drawFavicon(previewCanvasRef.current, 256, text, bgColor, fgColor, radiusPercent, fontScale);
    }
  }, [text, bgColor, fgColor, radiusPercent, fontScale]);

  const downloadSize = useCallback(
    (size: number) => {
      const canvas = downloadCanvasRef.current;
      if (!canvas) return;
      drawFavicon(canvas, size, text, bgColor, fgColor, radiusPercent, fontScale);
      trackAction("download");

      const link = document.createElement("a");
      link.download = size === 180 ? "apple-touch-icon.png" : `favicon-${size}x${size}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    },
    [text, bgColor, fgColor, radiusPercent, fontScale, trackAction],
  );

  const downloadAll = useCallback(() => {
    trackAction("download-all");
    for (const size of FAVICON_SIZES) {
      setTimeout(() => downloadSize(size), FAVICON_SIZES.indexOf(size) * 150);
    }
  }, [downloadSize, trackAction]);

  const downloadSvg = useCallback(() => {
    trackAction("download-svg");
    const r = (radiusPercent / 100) * 128;
    const fontSize = Math.round(256 * (fontScale / 100));
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
  <rect width="256" height="256" rx="${r}" ry="${r}" fill="${bgColor}" />
  <text x="128" y="136" font-family="system-ui, sans-serif" font-size="${fontSize}" font-weight="bold" fill="${fgColor}" text-anchor="middle" dominant-baseline="middle">${text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</text>
</svg>`;
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const link = document.createElement("a");
    link.download = "favicon.svg";
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
  }, [text, bgColor, fgColor, radiusPercent, fontScale, trackAction]);

  const copyLinkTags = useCallback(() => {
    const tags = `<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">`;
    navigator.clipboard.writeText(tags);
    setCopied("tags");
    setTimeout(() => setCopied(null), 2000);
    trackAction("copy-tags");
  }, [trackAction]);

  const copyWebManifest = useCallback(() => {
    const manifest = JSON.stringify(
      {
        icons: [
          { src: "/favicon-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "/favicon-512x512.png", sizes: "512x512", type: "image/png" },
        ],
      },
      null,
      2,
    );
    navigator.clipboard.writeText(manifest);
    setCopied("manifest");
    setTimeout(() => setCopied(null), 2000);
    trackAction("copy-manifest");
  }, [trackAction]);

  const applyPreset = useCallback(
    (preset: (typeof PRESETS)[number]) => {
      setText(preset.text);
      setBgColor(preset.bg);
      setFgColor(preset.fg);
      trackAction("preset");
    },
    [trackAction],
  );

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/"
          className="text-sm text-slate-400 hover:text-blue-400 transition-colors"
        >
          ← Back to DevBolt
        </Link>
        <h1 className="text-3xl font-bold mt-2 text-white">Favicon Generator</h1>
        <p className="text-slate-400 mt-1">
          Generate favicons from text or emoji — download PNGs for all sizes plus SVG and HTML tags.
        </p>
      </div>

      {/* Hidden canvas for downloads */}
      <canvas ref={downloadCanvasRef} className="hidden" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Controls */}
        <div className="space-y-5">
          {/* Text input */}
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Text / Emoji
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={4}
              placeholder="D"
              className="w-full bg-slate-900 border border-slate-600 rounded-md px-3 py-2 text-white text-lg font-mono focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            />
            <p className="text-xs text-slate-500 mt-1">1-2 characters work best. Emojis supported.</p>
          </div>

          {/* Colors */}
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Colors
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Background</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer border border-slate-600 bg-transparent"
                  />
                  <input
                    type="text"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-600 rounded-md px-2 py-1.5 text-sm text-white font-mono focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Text</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer border border-slate-600 bg-transparent"
                  />
                  <input
                    type="text"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-600 rounded-md px-2 py-1.5 text-sm text-white font-mono focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Shape */}
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Shape
            </label>
            <div className="flex gap-2">
              {SHAPE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setShape(opt.value as typeof shape)}
                  className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    shape === opt.value
                      ? "bg-blue-600 text-white"
                      : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Font size */}
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Font Size: {fontScale}%
            </label>
            <input
              type="range"
              min={20}
              max={90}
              value={fontScale}
              onChange={(e) => setFontScale(Number(e.target.value))}
              className="w-full accent-blue-500"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>20%</span>
              <span>90%</span>
            </div>
          </div>

          {/* Presets */}
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Quick Presets
            </label>
            <div className="grid grid-cols-4 gap-2">
              {PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => applyPreset(preset)}
                  className="flex flex-col items-center gap-1 p-2 rounded-md bg-slate-700 hover:bg-slate-600 transition-colors group"
                  title={preset.label}
                >
                  <div
                    className="w-8 h-8 rounded-md flex items-center justify-center text-sm font-bold"
                    style={{ backgroundColor: preset.bg, color: preset.fg }}
                  >
                    {preset.text}
                  </div>
                  <span className="text-[10px] text-slate-400 group-hover:text-slate-300 truncate w-full text-center">
                    {preset.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Preview & Downloads */}
        <div className="space-y-5">
          {/* Large preview */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 flex flex-col items-center">
            <label className="block text-sm font-medium text-slate-300 mb-4 self-start">
              Preview
            </label>
            <canvas
              ref={previewCanvasRef}
              width={256}
              height={256}
              className="rounded-lg"
              style={{ imageRendering: "auto" }}
            />

            {/* Size previews */}
            <div className="flex items-end gap-4 mt-6">
              {[16, 32, 48].map((size) => (
                <div key={size} className="flex flex-col items-center gap-1">
                  <canvas
                    ref={(el) => {
                      if (el) drawFavicon(el, size, text, bgColor, fgColor, radiusPercent, fontScale);
                    }}
                    width={size}
                    height={size}
                    style={{ imageRendering: size <= 32 ? "pixelated" : "auto" }}
                  />
                  <span className="text-[10px] text-slate-500">{size}px</span>
                </div>
              ))}
            </div>

            {/* Browser tab mockup */}
            <div className="mt-6 w-full">
              <label className="block text-xs text-slate-500 mb-2">Browser tab preview</label>
              <div className="bg-slate-700 rounded-t-lg px-3 py-2 flex items-center gap-2 max-w-xs">
                <canvas
                  ref={(el) => {
                    if (el) drawFavicon(el, 16, text, bgColor, fgColor, radiusPercent, fontScale);
                  }}
                  width={16}
                  height={16}
                  className="shrink-0"
                />
                <span className="text-xs text-slate-300 truncate">My Website — Home</span>
                <span className="text-slate-500 ml-auto text-xs">×</span>
              </div>
              <div className="bg-slate-900 rounded-b-lg h-4 border-t border-slate-600" />
            </div>
          </div>

          {/* Download buttons */}
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Download
            </label>

            <div className="grid grid-cols-3 gap-2 mb-3">
              {FAVICON_SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => downloadSize(size)}
                  className="px-3 py-2 rounded-md bg-slate-700 hover:bg-slate-600 text-sm text-slate-200 transition-colors text-center"
                >
                  {size === 180 ? "180 (Apple)" : `${size}×${size}`}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={downloadAll}
                className="flex-1 px-4 py-2.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors"
              >
                Download All PNGs
              </button>
              <button
                onClick={downloadSvg}
                className="px-4 py-2.5 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium transition-colors"
              >
                SVG
              </button>
            </div>
          </div>

          {/* HTML tags */}
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <label className="block text-sm font-medium text-slate-300 mb-3">
              HTML &amp; Manifest
            </label>
            <div className="flex gap-2">
              <button
                onClick={copyLinkTags}
                className="flex-1 px-3 py-2 rounded-md bg-slate-700 hover:bg-slate-600 text-sm text-slate-200 transition-colors"
              >
                {copied === "tags" ? "✓ Copied!" : "Copy <link> Tags"}
              </button>
              <button
                onClick={copyWebManifest}
                className="flex-1 px-3 py-2 rounded-md bg-slate-700 hover:bg-slate-600 text-sm text-slate-200 transition-colors"
              >
                {copied === "manifest" ? "✓ Copied!" : "Copy Manifest Icons"}
              </button>
            </div>
          </div>

          {/* Related tools */}
          <div className="text-sm text-slate-500">
            Related:{" "}
            <Link href="/tools/image-compressor" className="text-blue-400 hover:underline">
              Image Compressor
            </Link>
            {" · "}
            <Link href="/tools/svg-optimizer" className="text-blue-400 hover:underline">
              SVG Optimizer
            </Link>
            {" · "}
            <Link href="/tools/meta-tag-generator" className="text-blue-400 hover:underline">
              Meta Tag Generator
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
