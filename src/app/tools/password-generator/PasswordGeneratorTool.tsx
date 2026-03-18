"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";
import RateLimitBanner from "@/components/RateLimitBanner";

interface PasswordOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
}

const CHAR_SETS = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
};

function generatePassword(options: PasswordOptions): string {
  let chars = "";
  if (options.uppercase) chars += CHAR_SETS.uppercase;
  if (options.lowercase) chars += CHAR_SETS.lowercase;
  if (options.numbers) chars += CHAR_SETS.numbers;
  if (options.symbols) chars += CHAR_SETS.symbols;

  if (!chars) return "";

  const array = new Uint32Array(options.length);
  crypto.getRandomValues(array);
  return Array.from(array, (n) => chars[n % chars.length]).join("");
}

function estimateStrength(options: PasswordOptions): {
  label: string;
  color: string;
  percent: number;
} {
  let poolSize = 0;
  if (options.uppercase) poolSize += 26;
  if (options.lowercase) poolSize += 26;
  if (options.numbers) poolSize += 10;
  if (options.symbols) poolSize += 26;

  if (poolSize === 0) return { label: "None", color: "bg-gray-400", percent: 0 };

  const entropy = options.length * Math.log2(poolSize);

  if (entropy < 28) return { label: "Very Weak", color: "bg-red-500", percent: 10 };
  if (entropy < 36) return { label: "Weak", color: "bg-orange-500", percent: 25 };
  if (entropy < 60) return { label: "Fair", color: "bg-yellow-500", percent: 50 };
  if (entropy < 80) return { label: "Strong", color: "bg-green-500", percent: 75 };
  return { label: "Very Strong", color: "bg-emerald-500", percent: 100 };
}

export default function PasswordGeneratorTool() {
  const [passwords, setPasswords] = useState<string[]>([]);
  const [count, setCount] = useState(1);
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [copied, setCopied] = useState<number | null>(null);

  const { remaining, dailyLimit, isLimited, recordUsage } =
    useRateLimit("password-generator");
  const { trackAction } = useToolAnalytics("password-generator");

  const handleGenerate = useCallback(() => {
    if (isLimited) return;
    if (!options.uppercase && !options.lowercase && !options.numbers && !options.symbols) return;
    recordUsage();
    trackAction("generate");
    const clamped = Math.max(1, Math.min(100, count));
    const generated: string[] = [];
    for (let i = 0; i < clamped; i++) {
      generated.push(generatePassword(options));
    }
    setPasswords(generated);
    setCopied(null);
  }, [count, options, isLimited, recordUsage, trackAction]);

  useKeyboardShortcut("Enter", handleGenerate);

  const strength = estimateStrength(options);
  const noCharSet = !options.uppercase && !options.lowercase && !options.numbers && !options.symbols;

  function handleCopy(pw: string, index: number) {
    navigator.clipboard.writeText(pw);
    setCopied(index);
    setTimeout(() => setCopied(null), 1500);
  }

  function handleCopyAll() {
    if (passwords.length > 0) {
      navigator.clipboard.writeText(passwords.join("\n"));
    }
  }

  function toggleOption(key: keyof Omit<PasswordOptions, "length">) {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
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
        Password Generator
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Generate strong, cryptographically secure random passwords.
      </p>

      {/* Options */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
        {/* Length slider */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Length
            </label>
            <input
              type="number"
              min={4}
              max={128}
              value={options.length}
              onChange={(e) =>
                setOptions((prev) => ({
                  ...prev,
                  length: Math.max(4, Math.min(128, Number(e.target.value) || 4)),
                }))
              }
              className="w-16 rounded border border-gray-300 bg-white px-2 py-1 text-center text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <input
            type="range"
            min={4}
            max={128}
            value={options.length}
            onChange={(e) =>
              setOptions((prev) => ({ ...prev, length: Number(e.target.value) }))
            }
            className="w-full accent-indigo-600"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>4</span>
            <span>128</span>
          </div>
        </div>

        {/* Character set toggles */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {(
            [
              ["uppercase", "A-Z"],
              ["lowercase", "a-z"],
              ["numbers", "0-9"],
              ["symbols", "!@#"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => toggleOption(key)}
              className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                options[key]
                  ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:border-indigo-400 dark:bg-indigo-950 dark:text-indigo-300"
                  : "border-gray-300 text-gray-500 hover:border-gray-400 dark:border-gray-600 dark:text-gray-400 dark:hover:border-gray-500"
              }`}
            >
              {label}
              <span className="ml-1.5 text-xs opacity-70 capitalize">{key}</span>
            </button>
          ))}
        </div>

        {noCharSet && (
          <p className="mt-2 text-sm text-red-500">
            Select at least one character set.
          </p>
        )}

        {/* Strength meter */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-600 dark:text-gray-400">Strength</span>
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {strength.label}
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className={`h-2 rounded-full transition-all ${strength.color}`}
              style={{ width: `${strength.percent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 items-center">
        <button
          onClick={handleGenerate}
          disabled={isLimited || noCharSet}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          Generate Password{" "}
          <kbd className="ml-1 hidden rounded bg-indigo-500 px-1.5 py-0.5 text-xs font-normal text-indigo-100 sm:inline">
            Ctrl+Enter
          </kbd>
        </button>

        <label className="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          Count:
          <input
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-20 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </label>

        {passwords.length > 0 && (
          <>
            <button
              onClick={handleCopyAll}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
            >
              Copy All
            </button>
            <button
              onClick={() => {
                setPasswords([]);
                setCopied(null);
              }}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
            >
              Clear
            </button>
          </>
        )}
        <RateLimitBanner
          remaining={remaining}
          dailyLimit={dailyLimit}
          isLimited={isLimited}
        />
      </div>

      {/* Results */}
      {passwords.length > 0 && (
        <div className="mt-4 rounded-lg border border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-950">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {passwords.map((pw, index) => (
              <li
                key={index}
                className="flex items-center justify-between gap-3 px-4 py-2"
              >
                <code className="min-w-0 break-all font-mono text-sm text-gray-900 dark:text-gray-100">
                  {pw}
                </code>
                <button
                  onClick={() => handleCopy(pw, index)}
                  className="flex-shrink-0 rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  {copied === index ? "Copied!" : "Copy"}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Info */}
      <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          How it works
        </h2>
        <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
          <li>
            Passwords are generated using the{" "}
            <code className="rounded bg-gray-200 px-1 py-0.5 text-xs dark:bg-gray-800">
              crypto.getRandomValues()
            </code>{" "}
            Web Crypto API for cryptographic randomness.
          </li>
          <li>
            Everything runs in your browser — no passwords are sent over the network.
          </li>
          <li>
            Strength is estimated from entropy (password length &times; log&#8322; of character pool size).
          </li>
        </ul>
      </div>
    </div>
  );
}
