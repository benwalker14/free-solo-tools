"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";
import RateLimitBanner from "@/components/RateLimitBanner";

type ConversionMode = "epoch-to-date" | "date-to-epoch";

function formatDate(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function formatUtcDate(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())} ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}`;
}

function getRelativeTime(date: Date): string {
  const now = Date.now();
  const diffMs = date.getTime() - now;
  const absDiff = Math.abs(diffMs);
  const isPast = diffMs < 0;
  const suffix = isPast ? "ago" : "from now";

  if (absDiff < 60_000) return "just now";
  if (absDiff < 3_600_000) {
    const mins = Math.floor(absDiff / 60_000);
    return `${mins} minute${mins !== 1 ? "s" : ""} ${suffix}`;
  }
  if (absDiff < 86_400_000) {
    const hrs = Math.floor(absDiff / 3_600_000);
    return `${hrs} hour${hrs !== 1 ? "s" : ""} ${suffix}`;
  }
  const days = Math.floor(absDiff / 86_400_000);
  if (days < 365) return `${days} day${days !== 1 ? "s" : ""} ${suffix}`;
  const years = Math.floor(days / 365);
  return `${years} year${years !== 1 ? "s" : ""} ${suffix}`;
}

interface ConversionResult {
  epochSeconds: number;
  epochMilliseconds: number;
  utc: string;
  local: string;
  iso8601: string;
  relative: string;
  dayOfWeek: string;
}

export default function EpochConverterTool() {
  const [mode, setMode] = useState<ConversionMode>("epoch-to-date");
  const [epochInput, setEpochInput] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [timeInput, setTimeInput] = useState("00:00:00");
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [error, setError] = useState("");

  const { remaining, dailyLimit, isLimited, recordUsage } =
    useRateLimit("epoch-converter");
  const { trackAction } = useToolAnalytics("epoch-converter");

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const handleConvert = useCallback(() => {
    if (isLimited) return;
    recordUsage();
    trackAction("convert");
    setError("");
    setResult(null);

    try {
      let date: Date;

      if (mode === "epoch-to-date") {
        const raw = epochInput.trim();
        if (!raw) {
          setError("Please enter a Unix timestamp.");
          return;
        }
        const num = Number(raw);
        if (!Number.isFinite(num)) {
          setError("Invalid number. Enter a Unix timestamp (seconds or milliseconds).");
          return;
        }
        // Auto-detect seconds vs milliseconds: if > 1e12, treat as ms
        const ms = Math.abs(num) > 1e12 ? num : num * 1000;
        date = new Date(ms);
      } else {
        if (!dateInput) {
          setError("Please select a date.");
          return;
        }
        const [h, m, s] = timeInput.split(":").map(Number);
        date = new Date(`${dateInput}T${String(h || 0).padStart(2, "0")}:${String(m || 0).padStart(2, "0")}:${String(s || 0).padStart(2, "0")}`);
      }

      if (isNaN(date.getTime())) {
        setError("Invalid date. Please check your input.");
        return;
      }

      setResult({
        epochSeconds: Math.floor(date.getTime() / 1000),
        epochMilliseconds: date.getTime(),
        utc: formatUtcDate(date) + " UTC",
        local: formatDate(date) + ` (${Intl.DateTimeFormat().resolvedOptions().timeZone})`,
        iso8601: date.toISOString(),
        relative: getRelativeTime(date),
        dayOfWeek: days[date.getDay()],
      });
    } catch {
      setError("Failed to parse input. Please check the format.");
    }
  }, [mode, epochInput, dateInput, timeInput, isLimited, recordUsage, trackAction, days]);

  useKeyboardShortcut("Enter", handleConvert);

  const handleNow = useCallback(() => {
    if (mode === "epoch-to-date") {
      setEpochInput(Math.floor(Date.now() / 1000).toString());
    } else {
      const now = new Date();
      const pad = (n: number) => n.toString().padStart(2, "0");
      setDateInput(
        `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
      );
      setTimeInput(`${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`);
    }
  }, [mode]);

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text);
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
        Epoch / Timestamp Converter
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Convert between Unix timestamps and human-readable dates. Supports
        seconds and milliseconds.
      </p>

      {/* Mode toggle */}
      <div className="mb-6 flex rounded-lg border border-gray-300 dark:border-gray-700 overflow-hidden w-fit">
        <button
          onClick={() => {
            setMode("epoch-to-date");
            setResult(null);
            setError("");
          }}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            mode === "epoch-to-date"
              ? "bg-indigo-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
          }`}
        >
          Epoch &rarr; Date
        </button>
        <button
          onClick={() => {
            setMode("date-to-epoch");
            setResult(null);
            setError("");
          }}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            mode === "date-to-epoch"
              ? "bg-indigo-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
          }`}
        >
          Date &rarr; Epoch
        </button>
      </div>

      {/* Input */}
      <div className="mb-4">
        {mode === "epoch-to-date" ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Unix Timestamp
            </label>
            <input
              type="text"
              value={epochInput}
              onChange={(e) => setEpochInput(e.target.value)}
              placeholder="e.g. 1710720000 or 1710720000000"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 font-mono text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        ) : (
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date
              </label>
              <input
                type="date"
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Time (HH:MM:SS)
              </label>
              <input
                type="text"
                value={timeInput}
                onChange={(e) => setTimeInput(e.target.value)}
                placeholder="00:00:00"
                className="w-32 rounded-lg border border-gray-300 bg-white px-4 py-2 font-mono text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2 items-center mb-6">
        <button
          onClick={handleConvert}
          disabled={isLimited}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          Convert{" "}
          <kbd className="ml-1 hidden rounded bg-indigo-500 px-1.5 py-0.5 text-xs font-normal text-indigo-100 sm:inline">
            Ctrl+Enter
          </kbd>
        </button>
        <button
          onClick={handleNow}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
        >
          Use Current Time
        </button>
        <RateLimitBanner
          remaining={remaining}
          dailyLimit={dailyLimit}
          isLimited={isLimited}
        />
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="rounded-lg border border-gray-300 dark:border-gray-700 overflow-hidden">
          <table className="w-full text-sm">
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {[
                ["Epoch (seconds)", String(result.epochSeconds)],
                ["Epoch (milliseconds)", String(result.epochMilliseconds)],
                ["UTC", result.utc],
                ["Local Time", result.local],
                ["ISO 8601", result.iso8601],
                ["Day of Week", result.dayOfWeek],
                ["Relative", result.relative],
              ].map(([label, value]) => (
                <tr key={label} className="group">
                  <td className="bg-gray-50 px-4 py-2.5 font-medium text-gray-700 dark:bg-gray-900 dark:text-gray-300 w-48">
                    {label}
                  </td>
                  <td className="px-4 py-2.5 font-mono text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-950">
                    <div className="flex items-center justify-between gap-2">
                      <span className="break-all">{value}</span>
                      <button
                        onClick={() => handleCopy(value)}
                        className="shrink-0 rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 opacity-0 group-hover:opacity-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-all"
                      >
                        Copy
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Quick reference */}
      <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-900">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
          Quick Reference
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500">
          Unix epoch is the number of seconds since January 1, 1970 00:00:00
          UTC. Timestamps with 13+ digits are automatically treated as
          milliseconds. Negative values represent dates before 1970.
        </p>
      </div>
    </div>
  );
}
