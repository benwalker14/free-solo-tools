"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";
import RateLimitBanner from "@/components/RateLimitBanner";

type Algorithm = "MD5" | "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512";

const ALGORITHMS: Algorithm[] = [
  "MD5",
  "SHA-1",
  "SHA-256",
  "SHA-384",
  "SHA-512",
];

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

// --- MD5 implementation (Web Crypto does not support MD5) ---
function computeMD5(data: Uint8Array): string {
  const T = new Uint32Array(64);
  for (let i = 0; i < 64; i++) {
    T[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 0x100000000);
  }

  const S = [
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 5, 9, 14, 20,
    5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 4, 11, 16, 23, 4, 11, 16, 23, 4,
    11, 16, 23, 4, 11, 16, 23, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6,
    10, 15, 21,
  ];

  const bitLen = data.length * 8;
  const padLen = (((56 - ((data.length + 1) % 64)) + 64) % 64) + 1;
  const padded = new Uint8Array(data.length + padLen + 8);
  padded.set(data);
  padded[data.length] = 0x80;
  const dv = new DataView(padded.buffer);
  dv.setUint32(padded.length - 8, bitLen >>> 0, true);
  dv.setUint32(padded.length - 4, Math.floor(bitLen / 0x100000000), true);

  let a0 = 0x67452301,
    b0 = 0xefcdab89,
    c0 = 0x98badcfe,
    d0 = 0x10325476;

  const bv = new DataView(padded.buffer);
  for (let off = 0; off < padded.length; off += 64) {
    const M = new Uint32Array(16);
    for (let j = 0; j < 16; j++) M[j] = bv.getUint32(off + j * 4, true);

    let a = a0,
      b = b0,
      c = c0,
      d = d0;
    for (let i = 0; i < 64; i++) {
      let f: number, g: number;
      if (i < 16) {
        f = (b & c) | (~b & d);
        g = i;
      } else if (i < 32) {
        f = (d & b) | (~d & c);
        g = (5 * i + 1) % 16;
      } else if (i < 48) {
        f = b ^ c ^ d;
        g = (3 * i + 5) % 16;
      } else {
        f = c ^ (b | ~d);
        g = (7 * i) % 16;
      }

      f = (f + a + T[i] + M[g]) >>> 0;
      a = d;
      d = c;
      c = b;
      b = (b + ((f << S[i]) | (f >>> (32 - S[i])))) >>> 0;
    }

    a0 = (a0 + a) >>> 0;
    b0 = (b0 + b) >>> 0;
    c0 = (c0 + c) >>> 0;
    d0 = (d0 + d) >>> 0;
  }

  const toHex = (n: number) =>
    [n & 0xff, (n >> 8) & 0xff, (n >> 16) & 0xff, (n >> 24) & 0xff]
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

  return toHex(a0) + toHex(b0) + toHex(c0) + toHex(d0);
}

async function computeHash(
  algo: Algorithm,
  data: Uint8Array,
): Promise<string> {
  if (algo === "MD5") return computeMD5(data);
  const hashBuffer = await crypto.subtle.digest(algo, data.buffer as ArrayBuffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export default function FileHashTool() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hashes, setHashes] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [verifyHash, setVerifyHash] = useState("");
  const [selectedAlgos, setSelectedAlgos] = useState<Set<Algorithm>>(
    new Set(ALGORITHMS),
  );
  const [copied, setCopied] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { remaining, dailyLimit, isLimited, recordUsage } =
    useRateLimit("file-hash");
  const { trackAction } = useToolAnalytics("file-hash");

  const MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024; // 2 GB

  const processFile = useCallback(
    async (f: File) => {
      setError("");
      setHashes({});
      setFile(f);

      if (f.size > MAX_FILE_SIZE) {
        setError("File too large. Maximum size is 2 GB.");
        return;
      }

      if (selectedAlgos.size === 0) {
        setError("Please select at least one hash algorithm.");
        return;
      }

      if (isLimited) return;
      recordUsage();
      trackAction("hash");

      setLoading(true);
      try {
        const buffer = await f.arrayBuffer();
        const data = new Uint8Array(buffer);
        const results: Record<string, string> = {};

        for (const algo of ALGORITHMS) {
          if (selectedAlgos.has(algo)) {
            results[algo] = await computeHash(algo, data);
          }
        }

        setHashes(results);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to compute hashes.",
        );
      } finally {
        setLoading(false);
      }
    },
    [selectedAlgos, isLimited, recordUsage, trackAction, MAX_FILE_SIZE],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const f = e.dataTransfer.files[0];
      if (f) processFile(f);
    },
    [processFile],
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (f) processFile(f);
    },
    [processFile],
  );

  const toggleAlgo = useCallback((algo: Algorithm) => {
    setSelectedAlgos((prev) => {
      const next = new Set(prev);
      if (next.has(algo)) next.delete(algo);
      else next.add(algo);
      return next;
    });
  }, []);

  const handleCopy = useCallback((text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 1500);
  }, []);

  const handleCopyAll = useCallback(() => {
    const text = Object.entries(hashes)
      .map(([algo, hash]) => `${algo}: ${hash}`)
      .join("\n");
    handleCopy(text, "all");
  }, [hashes, handleCopy]);

  // Re-hash with current algorithm selection
  const handleReHash = useCallback(() => {
    if (file) processFile(file);
  }, [file, processFile]);

  useKeyboardShortcut("Enter", handleReHash);

  // Verify hash match
  const verifyNormalized = verifyHash.trim().toLowerCase();
  const matchResult = verifyNormalized
    ? Object.entries(hashes).find(([, hash]) => hash === verifyNormalized)
    : null;
  const hasVerifyMismatch =
    verifyNormalized && Object.keys(hashes).length > 0 && !matchResult;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="mb-8 block text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        &larr; Back to tools
      </Link>

      <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
        File Hash Calculator
      </h1>
      <p className="mb-8 text-gray-600 dark:text-gray-400">
        Drag and drop a file to compute MD5, SHA-1, SHA-256, SHA-384, and
        SHA-512 hashes. Verify file integrity by comparing against an expected
        hash. All processing happens in your browser.
      </p>

      {/* Algorithm selection */}
      <div className="mb-6 flex flex-wrap gap-4">
        {ALGORITHMS.map((algo) => (
          <label
            key={algo}
            className="flex cursor-pointer items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
          >
            <input
              type="checkbox"
              checked={selectedAlgos.has(algo)}
              onChange={() => toggleAlgo(algo)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            {algo}
          </label>
        ))}
      </div>

      {/* Drop zone */}
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
            : "border-gray-300 bg-white hover:border-indigo-400 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-indigo-500"
        }`}
      >
        {loading ? (
          <>
            <svg
              className="mb-3 h-10 w-10 animate-spin text-indigo-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Computing hashes&hellip;
            </span>
          </>
        ) : (
          <>
            <svg
              className="mb-3 h-10 w-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Drop a file here or click to browse
            </span>
            <span className="mt-1 text-xs text-gray-500">
              Any file type, up to 2 GB
            </span>
          </>
        )}
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
          {error}
        </div>
      )}

      {/* File info */}
      {file && !loading && (
        <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
          <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
            <div>
              <span className="text-gray-500 dark:text-gray-400">Name</span>
              <p className="truncate font-medium text-gray-900 dark:text-white">
                {file.name}
              </p>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Size</span>
              <p className="font-medium text-gray-900 dark:text-white">
                {formatBytes(file.size)}
              </p>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Type</span>
              <p className="font-medium text-gray-900 dark:text-white">
                {file.type || "Unknown"}
              </p>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">
                Modified
              </span>
              <p className="font-medium text-gray-900 dark:text-white">
                {new Date(file.lastModified).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Hash results */}
      {Object.keys(hashes).length > 0 && (
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Hash Values
            </h2>
            <button
              onClick={handleCopyAll}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              {copied === "all" ? "Copied!" : "Copy All"}
            </button>
          </div>

          {ALGORITHMS.filter((a) => hashes[a]).map((algo) => (
            <div
              key={algo}
              className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900"
            >
              <span className="mt-0.5 min-w-[70px] text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                {algo}
              </span>
              <code className="flex-1 break-all font-mono text-xs text-gray-800 dark:text-gray-200">
                {hashes[algo]}
              </code>
              <button
                onClick={() => handleCopy(hashes[algo], algo)}
                className="shrink-0 rounded px-2 py-1 text-xs text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950"
              >
                {copied === algo ? "Copied!" : "Copy"}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Verify hash */}
      {Object.keys(hashes).length > 0 && (
        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Verify Hash
          </label>
          <input
            type="text"
            value={verifyHash}
            onChange={(e) => setVerifyHash(e.target.value)}
            placeholder="Paste an expected hash to compare..."
            className="w-full rounded-lg border border-gray-300 bg-white p-3 font-mono text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          {matchResult && (
            <div className="mt-2 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400">
              Match found &mdash; {matchResult[0]}
            </div>
          )}
          {hasVerifyMismatch && (
            <div className="mt-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
              No match &mdash; the hash does not match any computed algorithm
            </div>
          )}
        </div>
      )}

      <RateLimitBanner
        remaining={remaining}
        dailyLimit={dailyLimit}
        isLimited={isLimited}
      />

      {/* About section */}
      <details className="group mt-12">
        <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200">
          About File Hash Calculator
        </summary>
        <div className="mt-4 space-y-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          <p>
            A file hash (or checksum) is a fixed-size string computed from the
            contents of a file. Even a tiny change to the file produces a
            completely different hash, making hashes ideal for verifying file
            integrity &mdash; for example, confirming a download wasn&apos;t
            corrupted or tampered with.
          </p>
          <p>
            <strong>MD5</strong> produces a 128-bit hash. While no longer
            recommended for security purposes, it&apos;s still widely used for
            quick integrity checks and is commonly listed on download pages.
          </p>
          <p>
            <strong>SHA-1</strong> produces a 160-bit hash. It&apos;s used in
            Git for commit IDs and some legacy systems, but is considered weak
            for cryptographic purposes.
          </p>
          <p>
            <strong>SHA-256</strong> is the modern standard for file
            verification, producing a 256-bit hash. It&apos;s used by package
            managers, software distributors, and blockchain systems.
          </p>
          <p>
            <strong>SHA-384</strong> and <strong>SHA-512</strong> provide even
            longer hashes (384 and 512 bits respectively) for applications that
            require extra collision resistance.
          </p>
          <p>
            All hashing is performed entirely in your browser using the Web
            Crypto API (SHA) and a pure JavaScript implementation (MD5). Your
            files are never uploaded to any server.
          </p>
        </div>
      </details>
    </div>
  );
}
