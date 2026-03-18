"use client";

import { useState } from "react";
import Link from "next/link";
import { useRateLimit } from "@/hooks/useRateLimit";
import RateLimitBanner from "@/components/RateLimitBanner";

interface DecodedJwt {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4 !== 0) {
    base64 += "=";
  }
  return atob(base64);
}

function decodeJwt(token: string): DecodedJwt {
  const parts = token.trim().split(".");
  if (parts.length !== 3) {
    throw new Error("Invalid JWT: must have 3 parts separated by dots");
  }

  const header = JSON.parse(base64UrlDecode(parts[0]));
  const payload = JSON.parse(base64UrlDecode(parts[1]));
  const signature = parts[2];

  return { header, payload, signature };
}

function formatTimestamp(value: unknown): string | null {
  if (typeof value !== "number") return null;
  try {
    return new Date(value * 1000).toLocaleString();
  } catch {
    return null;
  }
}

function getExpirationStatus(payload: Record<string, unknown>): {
  label: string;
  color: string;
} | null {
  if (typeof payload.exp !== "number") return null;
  const now = Math.floor(Date.now() / 1000);
  if (payload.exp < now) {
    return { label: "Expired", color: "text-red-600 dark:text-red-400" };
  }
  return { label: "Valid", color: "text-green-600 dark:text-green-400" };
}

export default function JwtDecoderTool() {
  const [input, setInput] = useState("");
  const [decoded, setDecoded] = useState<DecodedJwt | null>(null);
  const [error, setError] = useState("");
  const { remaining, dailyLimit, isLimited, recordUsage } =
    useRateLimit("jwt-decoder");

  function handleDecode() {
    if (isLimited) return;
    setError("");
    setDecoded(null);
    if (!input.trim()) return;
    recordUsage();

    try {
      setDecoded(decodeJwt(input));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to decode JWT");
    }
  }

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text);
  }

  const expStatus = decoded ? getExpirationStatus(decoded.payload) : null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="mb-8 block text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        &larr; Back to tools
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        JWT Decoder
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Decode and inspect JSON Web Tokens. View header, payload, and
        expiration status.
      </p>

      <div className="space-y-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your JWT here (eyJhbGciOiJIUzI1NiIs...)"
          rows={4}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 font-mono text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-600"
        />

        <div className="flex items-center gap-2">
          <button
            onClick={handleDecode}
            disabled={isLimited}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            Decode
          </button>
          <button
            onClick={() => {
              setInput("");
              setDecoded(null);
              setError("");
            }}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
          >
            Clear
          </button>
          <RateLimitBanner
            remaining={remaining}
            dailyLimit={dailyLimit}
            isLimited={isLimited}
          />
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
            {error}
          </div>
        )}

        {decoded && (
          <div className="space-y-4">
            {expStatus && (
              <div className="flex items-center gap-2 text-sm font-medium">
                <span className="text-gray-600 dark:text-gray-400">
                  Status:
                </span>
                <span className={expStatus.color}>{expStatus.label}</span>
                {typeof decoded.payload.exp === "number" && (
                  <span className="text-gray-500 dark:text-gray-500">
                    (expires {formatTimestamp(decoded.payload.exp)})
                  </span>
                )}
              </div>
            )}

            <Section
              title="Header"
              data={decoded.header}
              onCopy={() =>
                handleCopy(JSON.stringify(decoded.header, null, 2))
              }
            />
            <Section
              title="Payload"
              data={decoded.payload}
              onCopy={() =>
                handleCopy(JSON.stringify(decoded.payload, null, 2))
              }
              renderValue={(key, value) => {
                if (
                  (key === "exp" || key === "iat" || key === "nbf") &&
                  typeof value === "number"
                ) {
                  return (
                    <>
                      {JSON.stringify(value)}
                      <span className="ml-2 text-gray-500 dark:text-gray-500">
                        ({formatTimestamp(value)})
                      </span>
                    </>
                  );
                }
                return null;
              }}
            />

            <div>
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Signature
                </h3>
              </div>
              <div className="rounded-lg border border-gray-300 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-950">
                <code className="break-all font-mono text-xs text-gray-600 dark:text-gray-400">
                  {decoded.signature}
                </code>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Section({
  title,
  data,
  onCopy,
  renderValue,
}: {
  title: string;
  data: Record<string, unknown>;
  onCopy: () => void;
  renderValue?: (key: string, value: unknown) => React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          {title}
        </h3>
        <button
          onClick={onCopy}
          className="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          Copy
        </button>
      </div>
      <div className="rounded-lg border border-gray-300 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-950">
        <pre className="overflow-x-auto font-mono text-sm text-gray-900 dark:text-gray-100">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="py-0.5">
              <span className="text-indigo-600 dark:text-indigo-400">
                &quot;{key}&quot;
              </span>
              :{" "}
              {renderValue?.(key, value) ?? (
                <span>{JSON.stringify(value)}</span>
              )}
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
}
