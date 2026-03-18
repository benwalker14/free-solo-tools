"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";
import RateLimitBanner from "@/components/RateLimitBanner";

type OutputFormat = "jpeg" | "webp" | "png";

interface CompressionResult {
  blob: Blob;
  url: string;
  width: number;
  height: number;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function extensionForFormat(fmt: OutputFormat): string {
  return fmt === "jpeg" ? "jpg" : fmt;
}

export default function ImageCompressorTool() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState("");
  const [originalWidth, setOriginalWidth] = useState(0);
  const [originalHeight, setOriginalHeight] = useState(0);
  const [result, setResult] = useState<CompressionResult | null>(null);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);

  // Options
  const [quality, setQuality] = useState(80);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("jpeg");
  const [maxWidth, setMaxWidth] = useState<string>("");
  const [maxHeight, setMaxHeight] = useState<string>("");
  const [maintainAspect, setMaintainAspect] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { remaining, dailyLimit, isLimited, recordUsage } =
    useRateLimit("image-compressor");
  const { trackAction } = useToolAnalytics("image-compressor");

  const compress = useCallback(
    async (file: File) => {
      if (isLimited) return;
      recordUsage();
      trackAction("compress");
      setError("");
      setIsCompressing(true);

      try {
        const bitmap = await createImageBitmap(file);
        let targetW = bitmap.width;
        let targetH = bitmap.height;

        const mw = maxWidth ? parseInt(maxWidth, 10) : 0;
        const mh = maxHeight ? parseInt(maxHeight, 10) : 0;

        if (mw > 0 || mh > 0) {
          if (maintainAspect) {
            const aspect = bitmap.width / bitmap.height;
            if (mw > 0 && mh > 0) {
              if (bitmap.width / mw > bitmap.height / mh) {
                targetW = mw;
                targetH = Math.round(mw / aspect);
              } else {
                targetH = mh;
                targetW = Math.round(mh * aspect);
              }
            } else if (mw > 0) {
              targetW = mw;
              targetH = Math.round(mw / aspect);
            } else {
              targetH = mh;
              targetW = Math.round(mh * aspect);
            }
          } else {
            if (mw > 0) targetW = mw;
            if (mh > 0) targetH = mh;
          }
        }

        // Only downscale, never upscale
        if (targetW > bitmap.width) targetW = bitmap.width;
        if (targetH > bitmap.height) targetH = bitmap.height;

        const canvas = canvasRef.current!;
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext("2d")!;
        ctx.clearRect(0, 0, targetW, targetH);
        ctx.drawImage(bitmap, 0, 0, targetW, targetH);
        bitmap.close();

        const mime =
          outputFormat === "jpeg"
            ? "image/jpeg"
            : outputFormat === "webp"
              ? "image/webp"
              : "image/png";

        const q = outputFormat === "png" ? undefined : quality / 100;

        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob(
            (b) => (b ? resolve(b) : reject(new Error("Compression failed"))),
            mime,
            q
          );
        });

        // Revoke previous result URL
        if (result?.url) URL.revokeObjectURL(result.url);

        setResult({
          blob,
          url: URL.createObjectURL(blob),
          width: targetW,
          height: targetH,
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to compress image."
        );
      } finally {
        setIsCompressing(false);
      }
    },
    [
      isLimited,
      recordUsage,
      trackAction,
      quality,
      outputFormat,
      maxWidth,
      maxHeight,
      maintainAspect,
      result,
    ]
  );

  const handleFile = useCallback(
    (file: File) => {
      setError("");
      setResult(null);

      if (!file.type.startsWith("image/")) {
        setError("Please select an image file (PNG, JPG, GIF, WebP, BMP).");
        return;
      }

      if (file.size > 20 * 1024 * 1024) {
        setError("File too large. Maximum size is 20 MB.");
        return;
      }

      setOriginalFile(file);

      // Revoke previous URL
      if (originalUrl) URL.revokeObjectURL(originalUrl);

      const url = URL.createObjectURL(file);
      setOriginalUrl(url);

      const img = new Image();
      img.onload = () => {
        setOriginalWidth(img.naturalWidth);
        setOriginalHeight(img.naturalHeight);
      };
      img.src = url;
    },
    [originalUrl]
  );

  const handleCompress = useCallback(() => {
    if (originalFile) compress(originalFile);
  }, [originalFile, compress]);

  useKeyboardShortcut("Enter", handleCompress);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDownload = useCallback(() => {
    if (!result) return;
    const ext = extensionForFormat(outputFormat);
    const baseName = originalFile?.name.replace(/\.[^.]+$/, "") ?? "image";
    const a = document.createElement("a");
    a.href = result.url;
    a.download = `${baseName}-compressed.${ext}`;
    a.click();
  }, [result, outputFormat, originalFile]);

  const handleReset = useCallback(() => {
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (result?.url) URL.revokeObjectURL(result.url);
    setOriginalFile(null);
    setOriginalUrl("");
    setOriginalWidth(0);
    setOriginalHeight(0);
    setResult(null);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [originalUrl, result]);

  const savings =
    originalFile && result
      ? (((originalFile.size - result.blob.size) / originalFile.size) * 100).toFixed(1)
      : null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="mb-8 block text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        &larr; Back to tools
      </Link>

      <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
        Image Compressor
      </h1>
      <p className="mb-8 text-gray-600 dark:text-gray-400">
        Compress and resize images in your browser. Adjust quality, change
        format, and reduce file size — nothing is uploaded to any server.
      </p>

      {/* Upload zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 transition-colors ${
          isDragging
            ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950"
            : "border-gray-300 bg-white hover:border-indigo-400 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-indigo-600 dark:hover:bg-gray-800"
        }`}
      >
        <svg
          className="mb-3 h-10 w-10 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
          />
        </svg>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Drop an image here or click to browse
        </p>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
          PNG, JPG, GIF, WebP, BMP — max 20 MB
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Options */}
      {originalFile && (
        <div className="mt-6 space-y-4 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
            Compression Settings
          </h2>

          {/* Output format */}
          <div className="flex flex-wrap items-center gap-4">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Format:
            </label>
            <div className="flex gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
              {(["jpeg", "webp", "png"] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setOutputFormat(fmt)}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    outputFormat === fmt
                      ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white"
                      : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  }`}
                >
                  {fmt.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Quality slider (not for PNG) */}
          {outputFormat !== "png" && (
            <div className="flex flex-wrap items-center gap-4">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Quality:
              </label>
              <input
                type="range"
                min={1}
                max={100}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="h-2 w-48 cursor-pointer accent-indigo-600"
              />
              <span className="min-w-[3ch] text-sm font-mono text-gray-900 dark:text-gray-100">
                {quality}%
              </span>
            </div>
          )}

          {/* Resize options */}
          <div className="flex flex-wrap items-center gap-4">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Max size:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={maxWidth}
                onChange={(e) => setMaxWidth(e.target.value)}
                placeholder={String(originalWidth)}
                min={1}
                className="w-24 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-500">&times;</span>
              <input
                type="number"
                value={maxHeight}
                onChange={(e) => setMaxHeight(e.target.value)}
                placeholder={String(originalHeight)}
                min={1}
                className="w-24 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <span className="text-xs text-gray-500 dark:text-gray-500">
                px (leave blank = no resize)
              </span>
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={maintainAspect}
              onChange={(e) => setMaintainAspect(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            Maintain aspect ratio
          </label>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={handleCompress}
              disabled={isLimited || isCompressing}
              className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {isCompressing ? "Compressing..." : "Compress"}{" "}
              {!isCompressing && (
                <kbd className="ml-1 hidden rounded bg-indigo-500 px-1.5 py-0.5 text-xs font-normal text-indigo-100 sm:inline">
                  Ctrl+Enter
                </kbd>
              )}
            </button>
            <button
              onClick={handleReset}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Reset
            </button>
            <RateLimitBanner
              remaining={remaining}
              dailyLimit={dailyLimit}
              isLimited={isLimited}
            />
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Results */}
      {result && originalFile && (
        <div className="mt-6 space-y-4">
          {/* Stats bar */}
          <div className="flex flex-wrap gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm dark:border-gray-700 dark:bg-gray-950">
            <div>
              <span className="font-medium text-gray-900 dark:text-gray-200">
                Original:
              </span>{" "}
              <span className="text-gray-600 dark:text-gray-400">
                {formatBytes(originalFile.size)} ({originalWidth}&times;
                {originalHeight})
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-900 dark:text-gray-200">
                Compressed:
              </span>{" "}
              <span className="text-gray-600 dark:text-gray-400">
                {formatBytes(result.blob.size)} ({result.width}&times;
                {result.height})
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-900 dark:text-gray-200">
                Savings:
              </span>{" "}
              <span
                className={
                  Number(savings) > 0
                    ? "font-semibold text-green-600 dark:text-green-400"
                    : "font-semibold text-amber-600 dark:text-amber-400"
                }
              >
                {Number(savings) > 0 ? `${savings}% smaller` : `${Math.abs(Number(savings))}% larger`}
              </span>
            </div>
          </div>

          {/* Side-by-side preview */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Original
              </h3>
              <div className="rounded-lg border border-gray-200 bg-[repeating-conic-gradient(#e5e7eb_0%_25%,transparent_0%_50%)] bg-[length:20px_20px] p-3 dark:border-gray-700 dark:bg-[repeating-conic-gradient(#374151_0%_25%,transparent_0%_50%)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={originalUrl}
                  alt="Original"
                  className="max-h-56 max-w-full rounded"
                />
              </div>
            </div>
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Compressed
              </h3>
              <div className="rounded-lg border border-gray-200 bg-[repeating-conic-gradient(#e5e7eb_0%_25%,transparent_0%_50%)] bg-[length:20px_20px] p-3 dark:border-gray-700 dark:bg-[repeating-conic-gradient(#374151_0%_25%,transparent_0%_50%)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={result.url}
                  alt="Compressed"
                  className="max-h-56 max-w-full rounded"
                />
              </div>
            </div>
          </div>

          {/* Download */}
          <button
            onClick={handleDownload}
            className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
          >
            Download Compressed Image
          </button>
        </div>
      )}

      {/* Hidden canvas for compression */}
      <canvas ref={canvasRef} className="hidden" />

      {/* About section */}
      <details className="group mt-12">
        <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
          About Image Compression
        </summary>
        <div className="mt-4 space-y-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          <p>
            This tool compresses images entirely in your browser using the
            Canvas API. No data is sent to any server — your images stay
            completely private.
          </p>
          <p>
            <strong className="text-gray-900 dark:text-gray-200">
              JPEG:
            </strong>{" "}
            Best for photographs. The quality slider controls lossy compression
            — lower values mean smaller files but more artifacts. 70-85% is
            typically a good balance.
          </p>
          <p>
            <strong className="text-gray-900 dark:text-gray-200">
              WebP:
            </strong>{" "}
            Modern format with superior compression. Produces ~25-35% smaller
            files than JPEG at equivalent quality. Supported by all modern
            browsers.
          </p>
          <p>
            <strong className="text-gray-900 dark:text-gray-200">
              PNG:
            </strong>{" "}
            Lossless format — no quality slider. Best for graphics, icons, and
            images with transparency. File size depends on image complexity, not
            a quality setting.
          </p>
          <p>
            <strong className="text-gray-900 dark:text-gray-200">
              Resizing:
            </strong>{" "}
            Set max width and/or height to downscale images. The tool never
            upscales — if the original is smaller than the specified dimensions,
            it keeps the original size.
          </p>
        </div>
      </details>
    </div>
  );
}
