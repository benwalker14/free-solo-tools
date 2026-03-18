"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";
import RateLimitBanner from "@/components/RateLimitBanner";

type Mode = "encode" | "decode";

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function detectMimeType(base64: string): string {
  const raw = base64.replace(/^data:[^;]+;base64,/, "");
  try {
    const bin = atob(raw.slice(0, 16));
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);

    if (bytes[0] === 0x89 && bytes[1] === 0x50) return "image/png";
    if (bytes[0] === 0xff && bytes[1] === 0xd8) return "image/jpeg";
    if (bytes[0] === 0x47 && bytes[1] === 0x49) return "image/gif";
    if (bytes[0] === 0x52 && bytes[1] === 0x49) return "image/webp";
    if (bytes[0] === 0x00 && bytes[1] === 0x00 && bytes[2] === 0x01)
      return "image/x-icon";
    const text = new TextDecoder().decode(bytes);
    if (text.includes("<svg") || text.includes("<?xml")) return "image/svg+xml";
  } catch {
    // fall through
  }
  return "image/png";
}

function extensionForMime(mime: string): string {
  const map: Record<string, string> = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/gif": "gif",
    "image/webp": "webp",
    "image/svg+xml": "svg",
    "image/x-icon": "ico",
    "image/bmp": "bmp",
  };
  return map[mime] ?? "png";
}

export default function ImageBase64Tool() {
  const [mode, setMode] = useState<Mode>("encode");
  const [base64Output, setBase64Output] = useState("");
  const [previewSrc, setPreviewSrc] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [outputSize, setOutputSize] = useState(0);
  const [error, setError] = useState("");
  const [includePrefix, setIncludePrefix] = useState(true);
  const [copied, setCopied] = useState(false);
  const [decodeInput, setDecodeInput] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { remaining, dailyLimit, isLimited, recordUsage } =
    useRateLimit("image-base64");
  const { trackAction } = useToolAnalytics("image-base64");

  const reset = useCallback(() => {
    setBase64Output("");
    setPreviewSrc("");
    setFileName("");
    setFileSize(0);
    setOutputSize(0);
    setError("");
    setCopied(false);
    setDecodeInput("");
  }, []);

  const encodeFile = useCallback(
    (file: File) => {
      if (isLimited) return;
      recordUsage();
      trackAction("encode");
      setError("");
      setCopied(false);

      if (!file.type.startsWith("image/")) {
        setError("Please select an image file (PNG, JPG, GIF, SVG, WebP, ICO, BMP).");
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setError("File too large. Maximum size is 10 MB.");
        return;
      }

      setFileName(file.name);
      setFileSize(file.size);

      const reader = new FileReader();
      reader.onload = () => {
        const dataUri = reader.result as string;
        setPreviewSrc(dataUri);
        if (includePrefix) {
          setBase64Output(dataUri);
          setOutputSize(new Blob([dataUri]).size);
        } else {
          const raw = dataUri.replace(/^data:[^;]+;base64,/, "");
          setBase64Output(raw);
          setOutputSize(new Blob([raw]).size);
        }
      };
      reader.onerror = () => setError("Failed to read file.");
      reader.readAsDataURL(file);
    },
    [isLimited, recordUsage, trackAction, includePrefix]
  );

  const handleDecode = useCallback(() => {
    if (isLimited) return;
    recordUsage();
    trackAction("decode");
    setError("");
    setCopied(false);
    setBase64Output("");

    const input = decodeInput.trim();
    if (!input) {
      setError("Paste a Base64 string to decode.");
      return;
    }

    let dataUri: string;
    if (input.startsWith("data:image/")) {
      dataUri = input;
    } else {
      try {
        atob(input.slice(0, 100));
      } catch {
        setError("Invalid Base64 string.");
        return;
      }
      const mime = detectMimeType(input);
      dataUri = `data:${mime};base64,${input}`;
    }

    const img = new Image();
    img.onload = () => {
      setPreviewSrc(dataUri);
      const raw = dataUri.replace(/^data:[^;]+;base64,/, "");
      const byteSize = Math.ceil((raw.length * 3) / 4);
      setFileSize(byteSize);
      setOutputSize(new Blob([dataUri]).size);
      setFileName("");
    };
    img.onerror = () => {
      setError(
        "Could not render image. Make sure the Base64 string is a valid image."
      );
    };
    img.src = dataUri;
  }, [isLimited, recordUsage, trackAction, decodeInput]);

  useKeyboardShortcut(
    "Enter",
    mode === "decode" ? handleDecode : () => fileInputRef.current?.click()
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (mode !== "encode") return;
      const file = e.dataTransfer.files[0];
      if (file) encodeFile(file);
    },
    [mode, encodeFile]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) encodeFile(file);
    },
    [encodeFile]
  );

  const handleCopy = useCallback(() => {
    const text = mode === "encode" ? base64Output : previewSrc;
    if (text) {
      navigator.clipboard.writeText(
        mode === "encode" ? base64Output : decodeInput
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [mode, base64Output, previewSrc, decodeInput]);

  const handleDownload = useCallback(() => {
    if (!previewSrc) return;
    const match = previewSrc.match(/^data:(image\/[^;]+);base64,/);
    const mime = match?.[1] ?? "image/png";
    const ext = extensionForMime(mime);
    const a = document.createElement("a");
    a.href = previewSrc;
    a.download = `decoded-image.${ext}`;
    a.click();
  }, [previewSrc]);

  const sizeRatio =
    fileSize > 0
      ? (((outputSize - fileSize) / fileSize) * 100).toFixed(1)
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
        Image to Base64 Converter
      </h1>
      <p className="mb-8 text-gray-600 dark:text-gray-400">
        Convert images to Base64 data URIs or decode Base64 strings back to
        images. All processing happens in your browser.
      </p>

      {/* Mode tabs */}
      <div className="mb-6 flex gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
        {(["encode", "decode"] as const).map((m) => (
          <button
            key={m}
            onClick={() => {
              setMode(m);
              reset();
            }}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              mode === m
                ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            }`}
          >
            {m === "encode" ? "Image → Base64" : "Base64 → Image"}
          </button>
        ))}
      </div>

      {/* Encode mode */}
      {mode === "encode" && (
        <>
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
              PNG, JPG, GIF, SVG, WebP, ICO, BMP — max 10 MB
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <div className="mt-4 flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={includePrefix}
                onChange={(e) => {
                  setIncludePrefix(e.target.checked);
                  if (base64Output) {
                    if (e.target.checked && !base64Output.startsWith("data:")) {
                      const src = previewSrc;
                      setBase64Output(src);
                      setOutputSize(new Blob([src]).size);
                    } else if (
                      !e.target.checked &&
                      base64Output.startsWith("data:")
                    ) {
                      const raw = base64Output.replace(
                        /^data:[^;]+;base64,/,
                        ""
                      );
                      setBase64Output(raw);
                      setOutputSize(new Blob([raw]).size);
                    }
                  }
                }}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              Include data URI prefix
            </label>
            <RateLimitBanner
              remaining={remaining}
              dailyLimit={dailyLimit}
              isLimited={isLimited}
            />
          </div>
        </>
      )}

      {/* Decode mode */}
      {mode === "decode" && (
        <>
          <textarea
            value={decodeInput}
            onChange={(e) => setDecodeInput(e.target.value)}
            placeholder="Paste a Base64 string or data URI (data:image/png;base64,...)"
            rows={8}
            className="w-full rounded-lg border border-gray-300 bg-white p-4 font-mono text-sm dark:border-gray-700 dark:bg-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              onClick={handleDecode}
              disabled={isLimited}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              Decode to Image{" "}
              <kbd className="ml-1 hidden rounded bg-indigo-500 px-1.5 py-0.5 text-xs font-normal text-indigo-100 sm:inline">
                Ctrl+Enter
              </kbd>
            </button>
            <RateLimitBanner
              remaining={remaining}
              dailyLimit={dailyLimit}
              isLimited={isLimited}
            />
          </div>
        </>
      )}

      {/* Error */}
      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Results */}
      {(base64Output || previewSrc) && (
        <div className="mt-6 space-y-4">
          {/* Stats bar */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
            {fileName && (
              <span>
                <span className="font-medium text-gray-900 dark:text-gray-200">
                  File:
                </span>{" "}
                {fileName}
              </span>
            )}
            {fileSize > 0 && (
              <span>
                <span className="font-medium text-gray-900 dark:text-gray-200">
                  {mode === "encode" ? "Original:" : "Image size:"}
                </span>{" "}
                {formatBytes(fileSize)}
              </span>
            )}
            {mode === "encode" && outputSize > 0 && (
              <span>
                <span className="font-medium text-gray-900 dark:text-gray-200">
                  Base64:
                </span>{" "}
                {formatBytes(outputSize)}
                {sizeRatio && (
                  <span className="ml-1 text-amber-600 dark:text-amber-400">
                    (+{sizeRatio}%)
                  </span>
                )}
              </span>
            )}
          </div>

          {/* Image preview */}
          {previewSrc && (
            <div className="rounded-lg border border-gray-200 bg-[repeating-conic-gradient(#e5e7eb_0%_25%,transparent_0%_50%)] bg-[length:20px_20px] p-4 dark:border-gray-700 dark:bg-[repeating-conic-gradient(#374151_0%_25%,transparent_0%_50%)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewSrc}
                alt="Preview"
                className="max-h-64 max-w-full rounded"
              />
            </div>
          )}

          {/* Base64 output (encode mode) */}
          {mode === "encode" && base64Output && (
            <div className="relative rounded-lg border border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-950">
              <button
                onClick={handleCopy}
                className="absolute right-2 top-2 rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
              <textarea
                readOnly
                value={base64Output}
                rows={8}
                className="w-full rounded-lg border-0 bg-transparent p-4 font-mono text-sm text-gray-900 dark:text-gray-100 focus:outline-none"
              />
            </div>
          )}

          {/* Download button (decode mode) */}
          {mode === "decode" && previewSrc && (
            <button
              onClick={handleDownload}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
            >
              Download Image
            </button>
          )}
        </div>
      )}

      {/* About section */}
      <details className="group mt-12">
        <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
          About Image to Base64 Conversion
        </summary>
        <div className="mt-4 space-y-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          <p>
            Base64 encoding converts binary image data into an ASCII text
            string. This is useful for embedding images directly in HTML, CSS,
            or JSON without separate file requests.
          </p>
          <p>
            <strong className="text-gray-900 dark:text-gray-200">
              Data URI format:
            </strong>{" "}
            <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs dark:bg-gray-800">
              data:image/png;base64,iVBORw0KGgo...
            </code>{" "}
            — ready to use in{" "}
            <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs dark:bg-gray-800">
              {"<img src=\"...\" />"}
            </code>{" "}
            tags or CSS{" "}
            <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs dark:bg-gray-800">
              url(...)
            </code>
            .
          </p>
          <p>
            <strong className="text-gray-900 dark:text-gray-200">
              Size overhead:
            </strong>{" "}
            Base64 increases data size by approximately 33%. For small images
            (icons, logos under ~5 KB), the trade-off of eliminating an HTTP
            request is usually worth it. For larger images, serving the file
            directly is more efficient.
          </p>
          <p>
            <strong className="text-gray-900 dark:text-gray-200">
              Supported formats:
            </strong>{" "}
            PNG, JPEG, GIF, SVG, WebP, ICO, and BMP. All processing runs
            entirely in your browser — your images are never uploaded to any
            server.
          </p>
        </div>
      </details>
    </div>
  );
}
