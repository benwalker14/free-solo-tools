"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import RateLimitBanner from "@/components/RateLimitBanner";

type Format =
  | "base64"
  | "base32"
  | "hex"
  | "binary"
  | "url"
  | "html";

const FORMATS: { value: Format; label: string; description: string }[] = [
  { value: "base64", label: "Base64", description: "RFC 4648 standard encoding" },
  { value: "base32", label: "Base32", description: "RFC 4648 A-Z, 2-7 alphabet" },
  { value: "hex", label: "Hex", description: "Hexadecimal byte representation" },
  { value: "binary", label: "Binary", description: "8-bit binary representation" },
  { value: "url", label: "URL", description: "Percent-encoding (RFC 3986)" },
  { value: "html", label: "HTML", description: "HTML entity encoding" },
];

const SAMPLE_TEXT = 'Hello, World! 🚀 <div class="test">&copy; 2026</div>';

// ── Base32 (RFC 4648) ────────────────────────────────────────────────

const B32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

function base32Encode(bytes: Uint8Array): string {
  let result = "";
  let bits = 0;
  let value = 0;

  for (const byte of bytes) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      bits -= 5;
      result += B32_ALPHABET[(value >>> bits) & 0x1f];
    }
  }

  if (bits > 0) {
    result += B32_ALPHABET[(value << (5 - bits)) & 0x1f];
  }

  // Pad to multiple of 8
  while (result.length % 8 !== 0) {
    result += "=";
  }

  return result;
}

function base32Decode(encoded: string): Uint8Array {
  const cleaned = encoded.replace(/=+$/, "").toUpperCase();
  const bytes: number[] = [];
  let bits = 0;
  let value = 0;

  for (const char of cleaned) {
    const idx = B32_ALPHABET.indexOf(char);
    if (idx === -1) {
      throw new Error(`Invalid Base32 character: '${char}'`);
    }
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      bits -= 8;
      bytes.push((value >>> bits) & 0xff);
    }
  }

  return new Uint8Array(bytes);
}

// ── Hex ──────────────────────────────────────────────────────────────

function hexEncode(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(" ");
}

function hexDecode(hex: string): Uint8Array {
  const cleaned = hex.replace(/\s+/g, "");
  if (cleaned.length % 2 !== 0) {
    throw new Error("Hex string must have an even number of characters.");
  }
  if (!/^[0-9a-fA-F]*$/.test(cleaned)) {
    throw new Error("Invalid hex characters. Use 0-9 and A-F only.");
  }
  const bytes = new Uint8Array(cleaned.length / 2);
  for (let i = 0; i < cleaned.length; i += 2) {
    bytes[i / 2] = parseInt(cleaned.substring(i, i + 2), 16);
  }
  return bytes;
}

// ── Binary ───────────────────────────────────────────────────────────

function binaryEncode(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(2).padStart(8, "0"))
    .join(" ");
}

function binaryDecode(bin: string): Uint8Array {
  const cleaned = bin.replace(/\s+/g, "");
  if (!/^[01]*$/.test(cleaned)) {
    throw new Error("Invalid binary. Use 0 and 1 only.");
  }
  // Pad to multiple of 8
  const padded = cleaned.padStart(Math.ceil(cleaned.length / 8) * 8, "0");
  const bytes = new Uint8Array(padded.length / 8);
  for (let i = 0; i < padded.length; i += 8) {
    bytes[i / 8] = parseInt(padded.substring(i, i + 8), 2);
  }
  return bytes;
}

// ── HTML Entities ────────────────────────────────────────────────────

function htmlEncode(text: string): string {
  let result = "";
  for (const char of text) {
    const code = char.codePointAt(0)!;
    if (char === "&") result += "&amp;";
    else if (char === "<") result += "&lt;";
    else if (char === ">") result += "&gt;";
    else if (char === '"') result += "&quot;";
    else if (char === "'") result += "&#39;";
    else if (code > 127) result += `&#${code};`;
    else result += char;
  }
  return result;
}

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'",
  nbsp: "\u00A0", copy: "\u00A9", reg: "\u00AE", trade: "\u2122",
  euro: "\u20AC", pound: "\u00A3", yen: "\u00A5", cent: "\u00A2",
  deg: "\u00B0", times: "\u00D7", divide: "\u00F7",
  ndash: "\u2013", mdash: "\u2014", hellip: "\u2026",
  larr: "\u2190", rarr: "\u2192", uarr: "\u2191", darr: "\u2193",
};

function htmlDecode(text: string): string {
  return text.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (match, entity) => {
    if (entity.startsWith("#x") || entity.startsWith("#X")) {
      const code = parseInt(entity.slice(2), 16);
      return isNaN(code) ? match : String.fromCodePoint(code);
    }
    if (entity.startsWith("#")) {
      const code = parseInt(entity.slice(1), 10);
      return isNaN(code) ? match : String.fromCodePoint(code);
    }
    return NAMED_ENTITIES[entity] ?? match;
  });
}

// ── UTF-8 helpers ────────────────────────────────────────────────────

function textToBytes(text: string): Uint8Array {
  return new TextEncoder().encode(text);
}

function bytesToText(bytes: Uint8Array): string {
  return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
}

// ── Unified encode / decode ──────────────────────────────────────────

function encode(text: string, format: Format): string {
  switch (format) {
    case "base64":
      return btoa(unescape(encodeURIComponent(text)));
    case "base32":
      return base32Encode(textToBytes(text));
    case "hex":
      return hexEncode(textToBytes(text));
    case "binary":
      return binaryEncode(textToBytes(text));
    case "url":
      return encodeURIComponent(text);
    case "html":
      return htmlEncode(text);
  }
}

function decode(encoded: string, format: Format): string {
  switch (format) {
    case "base64":
      return decodeURIComponent(escape(atob(encoded.trim())));
    case "base32":
      return bytesToText(base32Decode(encoded.trim()));
    case "hex":
      return bytesToText(hexDecode(encoded));
    case "binary":
      return bytesToText(binaryDecode(encoded));
    case "url":
      return decodeURIComponent(encoded);
    case "html":
      return htmlDecode(encoded);
  }
}

export default function EncodeDecodeTool() {
  const [format, setFormat] = useState<Format>("base64");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const { trackAction } = useToolAnalytics("encode-decode");
  const { remaining, dailyLimit, isLimited, recordUsage } =
    useRateLimit("encode-decode");

  const handleEncode = useCallback(() => {
    setError("");
    setOutput("");
    setCopied(false);
    if (!input.trim()) {
      setError("Please enter some text to encode.");
      return;
    }
    if (isLimited) return;
    recordUsage();
    trackAction(`encode-${format}`);
    try {
      setOutput(encode(input, format));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Encoding failed.");
    }
  }, [input, format, isLimited, recordUsage, trackAction]);

  useKeyboardShortcut("Enter", handleEncode);

  function handleDecode() {
    setError("");
    setOutput("");
    setCopied(false);
    if (!input.trim()) {
      setError("Please enter encoded data to decode.");
      return;
    }
    if (isLimited) return;
    recordUsage();
    trackAction(`decode-${format}`);
    try {
      setOutput(decode(input, format));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Decoding failed. Check your input.");
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function handleLoadSample() {
    setInput(SAMPLE_TEXT);
    setOutput("");
    setError("");
    setCopied(false);
  }

  function handleSwap() {
    setInput(output);
    setOutput("");
    setError("");
    setCopied(false);
  }

  function handleFormatChange(f: Format) {
    setFormat(f);
    setOutput("");
    setError("");
    setCopied(false);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="mb-8 block text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        &larr; Back to tools
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Encode / Decode Multi-Tool
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Encode and decode text using Base64, Base32, Hex, Binary, URL encoding,
        or HTML entities — all in one place.
      </p>

      <RateLimitBanner
        remaining={remaining}
        dailyLimit={dailyLimit}
        isLimited={isLimited}
      />

      {/* Format selector */}
      <div className="mb-4">
        <div className="flex flex-wrap rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
          {FORMATS.map((f, i) => (
            <button
              key={f.value}
              onClick={() => handleFormatChange(f.value)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                i > 0
                  ? "border-l border-gray-300 dark:border-gray-600"
                  : ""
              } ${
                format === f.value
                  ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                  : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
              }`}
              disabled={format === f.value}
            >
              {f.label}
            </button>
          ))}
        </div>
        <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-500">
          {FORMATS.find((f) => f.value === format)?.description}
        </p>
      </div>

      {/* Input */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Input
          </label>
          <button
            onClick={handleLoadSample}
            className="text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            Load sample
          </button>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to encode or encoded data to decode..."
          rows={8}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 font-mono text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
          spellCheck={false}
        />
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <button
          onClick={handleEncode}
          disabled={isLimited || !input.trim()}
          className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-gray-900 transition-colors"
        >
          Encode{" "}
          <kbd className="ml-1.5 hidden rounded bg-indigo-500 px-1.5 py-0.5 text-xs font-medium sm:inline-block">
            Ctrl+Enter
          </kbd>
        </button>
        <button
          onClick={handleDecode}
          disabled={isLimited || !input.trim()}
          className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
        >
          Decode
        </button>
        {output && (
          <button
            onClick={handleSwap}
            className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
            title="Move output to input"
          >
            ↕ Swap
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Output */}
      {output && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Output
            </label>
            <button
              onClick={handleCopy}
              className="rounded border border-gray-300 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <pre className="max-h-96 overflow-auto rounded-lg border border-gray-200 bg-white p-4 font-mono text-sm text-gray-900 whitespace-pre-wrap break-all dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100">
            {output}
          </pre>
        </div>
      )}

      {/* Info */}
      <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          About Encoding Formats
        </h2>
        <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
          <li>
            <strong>Base64</strong> — encodes binary data as ASCII text using
            A-Z, a-z, 0-9, +, /. Common in data URIs, email attachments, and
            API payloads.
          </li>
          <li>
            <strong>Base32</strong> — uses A-Z and 2-7 (case-insensitive). Used
            in TOTP secrets, Tor addresses, and file systems that are
            case-insensitive.
          </li>
          <li>
            <strong>Hex</strong> — each byte as two hex digits. Used in
            checksums, color codes, and low-level debugging.
          </li>
          <li>
            <strong>Binary</strong> — each byte as 8 bits. Useful for
            understanding bit-level data representation.
          </li>
          <li>
            <strong>URL</strong> — percent-encodes special characters for safe
            use in URLs and query strings (RFC 3986).
          </li>
          <li>
            <strong>HTML</strong> — encodes special characters as HTML entities
            to prevent XSS and display issues in web pages.
          </li>
          <li>
            Everything runs in your browser — no data is sent over the network.
          </li>
        </ul>
      </div>
    </div>
  );
}
