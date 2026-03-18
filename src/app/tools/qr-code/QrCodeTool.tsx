"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import QRCode from "qrcode";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";
import RateLimitBanner from "@/components/RateLimitBanner";

type ErrorCorrectionLevel = "L" | "M" | "Q" | "H";

const EC_LEVELS: { value: ErrorCorrectionLevel; label: string; desc: string }[] = [
  { value: "L", label: "L", desc: "~7% recovery" },
  { value: "M", label: "M", desc: "~15% recovery" },
  { value: "Q", label: "Q", desc: "~25% recovery" },
  { value: "H", label: "H", desc: "~30% recovery" },
];

const SIZES = [128, 256, 512, 1024] as const;

export default function QrCodeTool() {
  const [input, setInput] = useState("");
  const [errorLevel, setErrorLevel] = useState<ErrorCorrectionLevel>("M");
  const [size, setSize] = useState<number>(256);
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { remaining, dailyLimit, isLimited, recordUsage } = useRateLimit("qr-code");
  const { trackAction } = useToolAnalytics("qr-code");

  const generate = useCallback(() => {
    if (!input.trim()) {
      setError("Please enter text or a URL to encode.");
      setDataUrl(null);
      return;
    }
    if (isLimited) return;
    recordUsage();
    trackAction("generate");
    setError(null);

    const canvas = canvasRef.current;
    if (!canvas) return;

    QRCode.toCanvas(
      canvas,
      input,
      {
        errorCorrectionLevel: errorLevel,
        width: size,
        margin: 2,
        color: { dark: fgColor, light: bgColor },
      },
      (err) => {
        if (err) {
          setError(err.message || "Failed to generate QR code.");
          setDataUrl(null);
          return;
        }
        setDataUrl(canvas.toDataURL("image/png"));
      }
    );
  }, [input, errorLevel, size, fgColor, bgColor, isLimited, recordUsage, trackAction]);

  useKeyboardShortcut("Enter", generate);

  const download = useCallback(() => {
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `qr-code-${size}x${size}.png`;
    a.click();
  }, [dataUrl, size]);

  const copyToClipboard = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/png")
      );
      if (blob) {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
      }
    } catch {
      // Fallback: copy data URL as text
      if (dataUrl) {
        await navigator.clipboard.writeText(dataUrl);
      }
    }
  }, [dataUrl]);

  const loadSample = useCallback(() => {
    setInput("https://devbolt.dev/tools/qr-code");
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/"
          className="mb-4 inline-block text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          &larr; All tools
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          QR Code Generator
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Generate QR codes from text or URLs. Customize colors, size, and error
          correction level. Download as PNG.
        </p>
      </div>

      <RateLimitBanner remaining={remaining} dailyLimit={dailyLimit} isLimited={isLimited} />

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left column: input & options */}
        <div className="space-y-6">
          {/* Input */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Text or URL
              </label>
              <button
                onClick={loadSample}
                className="text-xs text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                Load sample
              </button>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter text, URL, email, phone number, or any data..."
              rows={4}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 font-mono text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder-gray-500"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
              {input.length > 0 ? `${input.length} characters` : "Up to ~4,296 alphanumeric or ~2,953 bytes"}
            </p>
          </div>

          {/* Error correction */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Error Correction Level
            </label>
            <div className="grid grid-cols-4 gap-2">
              {EC_LEVELS.map((level) => (
                <button
                  key={level.value}
                  onClick={() => setErrorLevel(level.value)}
                  className={`rounded-lg border px-3 py-2 text-center text-sm transition-colors ${
                    errorLevel === level.value
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:border-indigo-500 dark:bg-indigo-950 dark:text-indigo-300"
                      : "border-gray-300 text-gray-600 hover:border-gray-400 dark:border-gray-700 dark:text-gray-400 dark:hover:border-gray-600"
                  }`}
                >
                  <div className="font-semibold">{level.label}</div>
                  <div className="text-xs opacity-70">{level.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Size */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Size
            </label>
            <div className="grid grid-cols-4 gap-2">
              {SIZES.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
                    size === s
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:border-indigo-500 dark:bg-indigo-950 dark:text-indigo-300"
                      : "border-gray-300 text-gray-600 hover:border-gray-400 dark:border-gray-700 dark:text-gray-400 dark:hover:border-gray-600"
                  }`}
                >
                  {s}px
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Foreground
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="h-9 w-9 cursor-pointer rounded border border-gray-300 dark:border-gray-700"
                />
                <input
                  type="text"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 font-mono text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Background
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="h-9 w-9 cursor-pointer rounded border border-gray-300 dark:border-gray-700"
                />
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 font-mono text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Generate button */}
          <button
            onClick={generate}
            disabled={isLimited || !input.trim()}
            className="w-full rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Generate QR Code
            <kbd className="ml-2 hidden rounded bg-indigo-500 px-1.5 py-0.5 text-xs font-normal sm:inline-block">
              Ctrl+Enter
            </kbd>
          </button>

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
        </div>

        {/* Right column: preview */}
        <div className="flex flex-col items-center">
          <div
            className="flex items-center justify-center rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700"
            style={{ minHeight: 280, width: "100%" }}
          >
            <canvas
              ref={canvasRef}
              className={`max-w-full ${dataUrl ? "" : "hidden"}`}
              style={{ imageRendering: "pixelated" }}
            />
            {!dataUrl && (
              <p className="text-sm text-gray-400 dark:text-gray-600">
                QR code preview will appear here
              </p>
            )}
          </div>

          {dataUrl && (
            <div className="mt-4 flex gap-3">
              <button
                onClick={download}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Download PNG
              </button>
              <button
                onClick={copyToClipboard}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Copy to Clipboard
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Info section */}
      <details className="group mt-12">
        <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
          About QR Codes
        </summary>
        <div className="mt-4 space-y-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          <p>
            <strong className="text-gray-900 dark:text-white">
              QR (Quick Response) codes
            </strong>{" "}
            are two-dimensional barcodes that can store text, URLs, contact info,
            Wi-Fi credentials, and more. They were invented in 1994 by Denso
            Wave for tracking automotive parts and are now used everywhere from
            restaurant menus to payment systems.
          </p>
          <p>
            <strong className="text-gray-900 dark:text-white">
              Error correction
            </strong>{" "}
            allows QR codes to be read even when partially damaged or obscured.
            Level L recovers ~7% of data, M ~15%, Q ~25%, and H ~30%. Higher
            levels make the code larger but more resilient — use H if you plan to
            overlay a logo.
          </p>
          <p>
            <strong className="text-gray-900 dark:text-white">
              Capacity
            </strong>{" "}
            depends on the data type and error correction level. A Version 40
            QR code (the largest) can hold up to 4,296 alphanumeric characters
            or 2,953 bytes of binary data at the lowest error correction level.
          </p>
          <p>
            <strong className="text-gray-900 dark:text-white">
              Common uses:
            </strong>{" "}
            URLs (<code>https://...</code>), plain text, email addresses (
            <code>mailto:...</code>), phone numbers (<code>tel:...</code>),
            SMS (<code>smsto:...</code>), Wi-Fi credentials (
            <code>WIFI:T:WPA;S:network;P:password;;</code>), and vCards for
            contact sharing.
          </p>
        </div>
      </details>
    </div>
  );
}
