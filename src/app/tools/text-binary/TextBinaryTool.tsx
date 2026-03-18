"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";

type Format = "binary" | "hex" | "octal" | "decimal";
type Direction = "encode" | "decode";

interface FormatConfig {
  label: string;
  encode: (text: string) => string;
  decode: (encoded: string) => string;
  placeholder: string;
  separator: string;
}

const FORMATS: Record<Format, FormatConfig> = {
  binary: {
    label: "Binary",
    encode: (text) =>
      Array.from(new TextEncoder().encode(text))
        .map((b) => b.toString(2).padStart(8, "0"))
        .join(" "),
    decode: (encoded) => {
      const bytes = encoded.trim().split(/\s+/);
      if (bytes.length === 0 || (bytes.length === 1 && bytes[0] === ""))
        return "";
      const arr = bytes.map((b) => {
        const n = parseInt(b, 2);
        if (isNaN(n) || n < 0 || n > 255 || !/^[01]+$/.test(b))
          throw new Error(`Invalid binary byte: "${b}"`);
        return n;
      });
      return new TextDecoder("utf-8", { fatal: true }).decode(
        new Uint8Array(arr)
      );
    },
    placeholder: "01001000 01100101 01101100 01101100 01101111",
    separator: " ",
  },
  hex: {
    label: "Hexadecimal",
    encode: (text) =>
      Array.from(new TextEncoder().encode(text))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join(" "),
    decode: (encoded) => {
      const clean = encoded.replace(/\s+/g, "");
      if (clean.length === 0) return "";
      if (clean.length % 2 !== 0)
        throw new Error("Hex string must have even number of characters");
      if (!/^[0-9a-fA-F]+$/.test(clean))
        throw new Error("Invalid hex characters found");
      const arr: number[] = [];
      for (let i = 0; i < clean.length; i += 2) {
        arr.push(parseInt(clean.substring(i, i + 2), 16));
      }
      return new TextDecoder("utf-8", { fatal: true }).decode(
        new Uint8Array(arr)
      );
    },
    placeholder: "48 65 6c 6c 6f",
    separator: " ",
  },
  octal: {
    label: "Octal",
    encode: (text) =>
      Array.from(new TextEncoder().encode(text))
        .map((b) => b.toString(8).padStart(3, "0"))
        .join(" "),
    decode: (encoded) => {
      const bytes = encoded.trim().split(/\s+/);
      if (bytes.length === 0 || (bytes.length === 1 && bytes[0] === ""))
        return "";
      const arr = bytes.map((b) => {
        const n = parseInt(b, 8);
        if (isNaN(n) || n < 0 || n > 255 || !/^[0-7]+$/.test(b))
          throw new Error(`Invalid octal byte: "${b}"`);
        return n;
      });
      return new TextDecoder("utf-8", { fatal: true }).decode(
        new Uint8Array(arr)
      );
    },
    placeholder: "110 145 154 154 157",
    separator: " ",
  },
  decimal: {
    label: "Decimal",
    encode: (text) =>
      Array.from(new TextEncoder().encode(text))
        .map((b) => b.toString(10))
        .join(" "),
    decode: (encoded) => {
      const bytes = encoded.trim().split(/\s+/);
      if (bytes.length === 0 || (bytes.length === 1 && bytes[0] === ""))
        return "";
      const arr = bytes.map((b) => {
        const n = parseInt(b, 10);
        if (isNaN(n) || n < 0 || n > 255 || !/^\d+$/.test(b))
          throw new Error(`Invalid decimal byte: "${b}"`);
        return n;
      });
      return new TextDecoder("utf-8", { fatal: true }).decode(
        new Uint8Array(arr)
      );
    },
    placeholder: "72 101 108 108 111",
    separator: " ",
  },
};

const FORMAT_KEYS: Format[] = ["binary", "hex", "octal", "decimal"];

export default function TextBinaryTool() {
  const [direction, setDirection] = useState<Direction>("encode");
  const [format, setFormat] = useState<Format>("binary");
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);
  const { trackFirstInteraction } = useToolAnalytics("text-binary");

  const result = useMemo(() => {
    if (!input.trim()) return { value: "", error: null };
    try {
      const fn =
        direction === "encode"
          ? FORMATS[format].encode
          : FORMATS[format].decode;
      return { value: fn(input), error: null };
    } catch (e) {
      return { value: "", error: (e as Error).message };
    }
  }, [input, direction, format]);

  const allFormats = useMemo(() => {
    if (direction !== "encode" || !input.trim()) return null;
    return FORMAT_KEYS.map((key) => ({
      key,
      label: FORMATS[key].label,
      value: FORMATS[key].encode(input),
    }));
  }, [input, direction]);

  const handleInputChange = useCallback(
    (value: string) => {
      setInput(value);
      trackFirstInteraction();
      setCopied(false);
    },
    [trackFirstInteraction]
  );

  const handleCopy = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, []);

  const handleSwap = useCallback(() => {
    if (result.value && !result.error) {
      setInput(result.value);
      setDirection((d) => (d === "encode" ? "decode" : "encode"));
      setCopied(false);
    }
  }, [result]);

  const handleClear = useCallback(() => {
    setInput("");
    setCopied(false);
  }, []);

  const inputLabel = direction === "encode" ? "Text" : FORMATS[format].label;
  const outputLabel = direction === "encode" ? FORMATS[format].label : "Text";
  const inputPlaceholder =
    direction === "encode"
      ? "Type or paste text to convert…"
      : FORMATS[format].placeholder;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="mb-8 block text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        &larr; Back to tools
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Text ↔ Binary Converter
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Convert text to binary, hexadecimal, octal, or decimal — and back.
        Supports full Unicode via UTF-8 encoding.
      </p>

      {/* Direction & Format Controls */}
      <div className="flex flex-wrap gap-4 mb-6">
        {/* Direction toggle */}
        <div className="flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
          <button
            onClick={() => {
              setDirection("encode");
              setInput("");
              setCopied(false);
            }}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              direction === "encode"
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
            }`}
          >
            Text → Encoded
          </button>
          <button
            onClick={() => {
              setDirection("decode");
              setInput("");
              setCopied(false);
            }}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              direction === "decode"
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
            }`}
          >
            Encoded → Text
          </button>
        </div>

        {/* Format selector */}
        <div className="flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
          {FORMAT_KEYS.map((key) => (
            <button
              key={key}
              onClick={() => {
                setFormat(key);
                setCopied(false);
              }}
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                format === key
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
              }`}
            >
              {FORMATS[key].label}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {inputLabel}
          </label>
          {input && (
            <button
              onClick={handleClear}
              className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
        <textarea
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={inputPlaceholder}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 font-mono text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
          rows={4}
          spellCheck={false}
        />
      </div>

      {/* Swap button */}
      <div className="flex justify-center mb-4">
        <button
          onClick={handleSwap}
          disabled={!result.value || !!result.error}
          className="rounded-full border border-gray-300 p-2 text-gray-500 hover:bg-gray-50 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-indigo-400 transition-colors"
          title="Swap input and output"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M7 16V4m0 0L3 8m4-4 4 4M17 8v12m0 0 4-4m-4 4-4-4" />
          </svg>
        </button>
      </div>

      {/* Output */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {outputLabel}
          </label>
          {result.value && (
            <button
              onClick={() => handleCopy(result.value)}
              className="rounded border border-gray-300 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          )}
        </div>
        {result.error ? (
          <div className="w-full rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
            {result.error}
          </div>
        ) : (
          <div className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 font-mono text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 min-h-[6rem] whitespace-pre-wrap break-all">
            {result.value || (
              <span className="text-gray-400 dark:text-gray-500">
                Result will appear here…
              </span>
            )}
          </div>
        )}
      </div>

      {/* All formats view (only in encode mode) */}
      {allFormats && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            All Formats
          </h2>
          <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {allFormats.map((f) => (
              <div
                key={f.key}
                className="flex items-center justify-between px-4 py-3 group"
              >
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                    {f.label}
                  </span>
                  <div className="font-mono text-sm text-gray-900 dark:text-gray-100 break-all mt-0.5">
                    {f.value}
                  </div>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(f.value);
                  }}
                  className="ml-3 flex-shrink-0 rounded border border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-500 opacity-0 group-hover:opacity-100 focus:opacity-100 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800 transition-all"
                >
                  Copy
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Byte breakdown (encode mode) */}
      {direction === "encode" && input.trim() && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Byte Breakdown
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-2 px-3 font-medium text-gray-500 dark:text-gray-400">
                    Char
                  </th>
                  <th className="text-left py-2 px-3 font-medium text-gray-500 dark:text-gray-400">
                    Binary
                  </th>
                  <th className="text-left py-2 px-3 font-medium text-gray-500 dark:text-gray-400">
                    Hex
                  </th>
                  <th className="text-left py-2 px-3 font-medium text-gray-500 dark:text-gray-400">
                    Oct
                  </th>
                  <th className="text-left py-2 px-3 font-medium text-gray-500 dark:text-gray-400">
                    Dec
                  </th>
                </tr>
              </thead>
              <tbody className="font-mono">
                {(() => {
                  const rows: {
                    char: string;
                    bytes: number[];
                  }[] = [];
                  const chars = Array.from(input);
                  const encoder = new TextEncoder();
                  for (const char of chars.slice(0, 100)) {
                    const bytes = Array.from(encoder.encode(char));
                    rows.push({ char, bytes });
                  }
                  return rows.map((row, i) => (
                    <tr
                      key={i}
                      className="border-b border-gray-100 dark:border-gray-800"
                    >
                      <td className="py-1.5 px-3 text-gray-900 dark:text-gray-100">
                        {row.char === " " ? "␣" : row.char}
                      </td>
                      <td className="py-1.5 px-3 text-gray-700 dark:text-gray-300">
                        {row.bytes
                          .map((b) => b.toString(2).padStart(8, "0"))
                          .join(" ")}
                      </td>
                      <td className="py-1.5 px-3 text-gray-700 dark:text-gray-300">
                        {row.bytes
                          .map((b) => b.toString(16).padStart(2, "0"))
                          .join(" ")}
                      </td>
                      <td className="py-1.5 px-3 text-gray-700 dark:text-gray-300">
                        {row.bytes
                          .map((b) => b.toString(8).padStart(3, "0"))
                          .join(" ")}
                      </td>
                      <td className="py-1.5 px-3 text-gray-700 dark:text-gray-300">
                        {row.bytes.join(" ")}
                      </td>
                    </tr>
                  ));
                })()}
              </tbody>
            </table>
          </div>
          {Array.from(input).length > 100 && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Showing first 100 characters.
            </p>
          )}
        </div>
      )}

      {/* Quick reference */}
      <details className="mt-8 rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
        <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
          Quick Reference — Text Encoding
        </summary>
        <div className="px-4 pb-4 space-y-3 text-sm text-gray-600 dark:text-gray-400">
          <div>
            <strong className="text-gray-700 dark:text-gray-300">
              How it works:
            </strong>{" "}
            Each character is first encoded to bytes using UTF-8, then each byte
            is represented in the selected number base (binary, hex, octal, or
            decimal).
          </div>
          <div>
            <strong className="text-gray-700 dark:text-gray-300">
              Binary (Base 2):
            </strong>{" "}
            Uses digits 0 and 1. Each byte is 8 bits (e.g., &quot;A&quot; =
            01000001). Fundamental to how computers store data.
          </div>
          <div>
            <strong className="text-gray-700 dark:text-gray-300">
              Hexadecimal (Base 16):
            </strong>{" "}
            Uses 0-9 and a-f. Each byte is 2 hex digits (e.g., &quot;A&quot; =
            41). Common in color codes, memory addresses, and debugging.
          </div>
          <div>
            <strong className="text-gray-700 dark:text-gray-300">
              Octal (Base 8):
            </strong>{" "}
            Uses digits 0-7. Each byte is up to 3 octal digits (e.g.,
            &quot;A&quot; = 101). Used in Unix file permissions.
          </div>
          <div>
            <strong className="text-gray-700 dark:text-gray-300">
              Decimal (Base 10):
            </strong>{" "}
            Standard numbers 0-255 for each byte (e.g., &quot;A&quot; = 65).
            Same as ASCII values for the basic Latin alphabet.
          </div>
          <div>
            <strong className="text-gray-700 dark:text-gray-300">
              Unicode support:
            </strong>{" "}
            Non-ASCII characters (emoji, CJK, etc.) produce multiple UTF-8
            bytes. For example, &quot;hello&quot; in Chinese (&#x4F60;&#x597D;) produces 6 bytes.
          </div>
        </div>
      </details>
    </div>
  );
}
