"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

function sRGBtoLinear(c: number): number {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex);
  return (
    0.2126 * sRGBtoLinear(r) +
    0.7152 * sRGBtoLinear(g) +
    0.0722 * sRGBtoLinear(b)
  );
}

function contrastRatio(hex1: string, hex2: string): number {
  const l1 = relativeLuminance(hex1);
  const l2 = relativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

interface WCAGResult {
  label: string;
  sublabel: string;
  threshold: number;
  pass: boolean;
}

function getWCAGResults(ratio: number): WCAGResult[] {
  return [
    { label: "AA", sublabel: "Normal text", threshold: 4.5, pass: ratio >= 4.5 },
    { label: "AA", sublabel: "Large text", threshold: 3, pass: ratio >= 3 },
    { label: "AA", sublabel: "UI components", threshold: 3, pass: ratio >= 3 },
    { label: "AAA", sublabel: "Normal text", threshold: 7, pass: ratio >= 7 },
    { label: "AAA", sublabel: "Large text", threshold: 4.5, pass: ratio >= 4.5 },
  ];
}

const PRESETS: { name: string; fg: string; bg: string }[] = [
  { name: "Black on White", fg: "#000000", bg: "#ffffff" },
  { name: "White on Blue", fg: "#ffffff", bg: "#1d4ed8" },
  { name: "Dark on Light Gray", fg: "#1f2937", bg: "#f3f4f6" },
  { name: "White on Green", fg: "#ffffff", bg: "#15803d" },
  { name: "Navy on Cream", fg: "#1e3a5f", bg: "#fefce8" },
  { name: "White on Red", fg: "#ffffff", bg: "#dc2626" },
];

function isValidHex(hex: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(hex);
}

function ratingColor(ratio: number): string {
  if (ratio >= 7) return "text-green-600 dark:text-green-400";
  if (ratio >= 4.5) return "text-yellow-600 dark:text-yellow-400";
  if (ratio >= 3) return "text-orange-600 dark:text-orange-400";
  return "text-red-600 dark:text-red-400";
}

function ratingLabel(ratio: number): string {
  if (ratio >= 7) return "Excellent";
  if (ratio >= 4.5) return "Good";
  if (ratio >= 3) return "Acceptable for large text";
  return "Poor";
}

export default function ContrastCheckerTool() {
  const [foreground, setForeground] = useState("#1f2937");
  const [background, setBackground] = useState("#ffffff");
  const [fgInput, setFgInput] = useState("#1f2937");
  const [bgInput, setBgInput] = useState("#ffffff");
  const { trackFirstInteraction } = useToolAnalytics("contrast-checker");

  const ratio = useMemo(() => {
    if (!isValidHex(foreground) || !isValidHex(background)) return 1;
    return contrastRatio(foreground, background);
  }, [foreground, background]);

  const wcag = useMemo(() => getWCAGResults(ratio), [ratio]);

  function updateFg(hex: string) {
    trackFirstInteraction();
    setFgInput(hex);
    if (isValidHex(hex)) setForeground(hex);
  }

  function updateBg(hex: string) {
    trackFirstInteraction();
    setBgInput(hex);
    if (isValidHex(hex)) setBackground(hex);
  }

  function swap() {
    trackFirstInteraction();
    setForeground(background);
    setBackground(foreground);
    setFgInput(background);
    setBgInput(foreground);
  }

  function applyPreset(fg: string, bg: string) {
    trackFirstInteraction();
    setForeground(fg);
    setBackground(bg);
    setFgInput(fg);
    setBgInput(bg);
  }

  const inputClass =
    "rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono";

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="mb-8 block text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        &larr; Back to tools
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Color Contrast Checker
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Check the contrast ratio between two colors for WCAG 2.1 accessibility
        compliance. Ensure your text is readable for all users.
      </p>

      {/* Color Pickers */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
        {/* Foreground */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Text Color (Foreground)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={foreground}
              onChange={(e) => updateFg(e.target.value)}
              className="h-10 w-14 cursor-pointer rounded border-0 bg-transparent p-0"
            />
            <input
              type="text"
              value={fgInput}
              onChange={(e) => {
                const v = e.target.value;
                if (v.length <= 7) updateFg(v);
              }}
              maxLength={7}
              className={`${inputClass} w-28`}
            />
          </div>
        </div>

        {/* Swap Button */}
        <button
          onClick={swap}
          className="flex h-10 w-10 items-center justify-center self-end rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
          title="Swap colors"
        >
          &#8644;
        </button>

        {/* Background */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Background Color
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={background}
              onChange={(e) => updateBg(e.target.value)}
              className="h-10 w-14 cursor-pointer rounded border-0 bg-transparent p-0"
            />
            <input
              type="text"
              value={bgInput}
              onChange={(e) => {
                const v = e.target.value;
                if (v.length <= 7) updateBg(v);
              }}
              maxLength={7}
              className={`${inputClass} w-28`}
            />
          </div>
        </div>
      </div>

      {/* Contrast Ratio Display */}
      <div className="mb-8 rounded-xl border border-gray-200 bg-gray-50 p-6 text-center dark:border-gray-700 dark:bg-gray-800/50">
        <p className="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">
          Contrast Ratio
        </p>
        <p className={`text-5xl font-bold tabular-nums ${ratingColor(ratio)}`}>
          {ratio.toFixed(2)}:1
        </p>
        <p className={`mt-1 text-sm font-medium ${ratingColor(ratio)}`}>
          {ratingLabel(ratio)}
        </p>
      </div>

      {/* Live Preview */}
      <div className="mb-8">
        <h2 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
          Live Preview
        </h2>
        <div
          className="rounded-xl border border-gray-200 p-8 dark:border-gray-700"
          style={{ backgroundColor: background }}
        >
          <p
            className="text-2xl font-bold mb-2"
            style={{ color: foreground }}
          >
            Large Text (24px bold)
          </p>
          <p
            className="text-base mb-4"
            style={{ color: foreground }}
          >
            Normal body text at 16px. This is what most of your content will
            look like. Make sure it&apos;s easy to read for all users, including
            those with visual impairments.
          </p>
          <p
            className="text-sm"
            style={{ color: foreground }}
          >
            Small text at 14px — captions, footnotes, and secondary content.
          </p>
          <div className="mt-4 flex gap-3">
            <button
              className="rounded-lg px-4 py-2 text-sm font-medium border-2"
              style={{
                color: foreground,
                borderColor: foreground,
                backgroundColor: background,
              }}
            >
              Button Outline
            </button>
            <button
              className="rounded-lg px-4 py-2 text-sm font-medium"
              style={{
                color: background,
                backgroundColor: foreground,
              }}
            >
              Button Filled
            </button>
          </div>
        </div>
      </div>

      {/* WCAG Results */}
      <div className="mb-8">
        <h2 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
          WCAG 2.1 Compliance
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {wcag.map((r) => (
            <div
              key={`${r.label}-${r.sublabel}`}
              className={`flex items-center justify-between rounded-lg border p-3 ${
                r.pass
                  ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950"
                  : "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950"
              }`}
            >
              <div>
                <span
                  className={`text-sm font-bold ${
                    r.pass
                      ? "text-green-700 dark:text-green-300"
                      : "text-red-700 dark:text-red-300"
                  }`}
                >
                  {r.label}
                </span>
                <span className="ml-1.5 text-sm text-gray-600 dark:text-gray-400">
                  {r.sublabel}
                </span>
                <span className="ml-1 text-xs text-gray-400 dark:text-gray-500">
                  ({r.threshold}:1)
                </span>
              </div>
              <span
                className={`text-lg font-bold ${
                  r.pass
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {r.pass ? "\u2713" : "\u2717"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Presets */}
      <div className="mb-8">
        <h2 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
          Presets
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              onClick={() => applyPreset(p.fg, p.bg)}
              className="group rounded-lg border border-gray-200 p-3 text-left transition-colors hover:border-indigo-400 dark:border-gray-700 dark:hover:border-indigo-600"
            >
              <div
                className="mb-2 flex h-10 items-center justify-center rounded-md text-sm font-medium"
                style={{ backgroundColor: p.bg, color: p.fg }}
              >
                Sample Aa
              </div>
              <span className="text-xs font-medium text-gray-600 group-hover:text-indigo-600 dark:text-gray-400 dark:group-hover:text-indigo-400">
                {p.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Reference */}
      <details className="rounded-lg border border-gray-200 dark:border-gray-700">
        <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
          About WCAG Color Contrast
        </summary>
        <div className="border-t border-gray-200 px-4 py-3 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-400 space-y-2">
          <p>
            The Web Content Accessibility Guidelines (WCAG) define minimum
            contrast ratios to ensure text is readable by people with moderately
            low vision or color deficiencies.
          </p>
          <p>
            <strong className="text-gray-900 dark:text-white">
              AA Normal Text
            </strong>{" "}
            requires a contrast ratio of at least{" "}
            <strong>4.5:1</strong>. This applies to body text under 18pt (24px)
            or under 14pt (18.66px) bold.
          </p>
          <p>
            <strong className="text-gray-900 dark:text-white">
              AA Large Text
            </strong>{" "}
            requires at least <strong>3:1</strong>. Large text is defined as
            18pt+ (24px+) or 14pt+ (18.66px+) bold.
          </p>
          <p>
            <strong className="text-gray-900 dark:text-white">
              AAA
            </strong>{" "}
            is the enhanced level — 7:1 for normal text and 4.5:1 for large
            text. This is recommended for long-form content and critical UI.
          </p>
          <p>
            <strong className="text-gray-900 dark:text-white">
              UI Components
            </strong>{" "}
            like icons, borders, and form controls require at least{" "}
            <strong>3:1</strong> contrast against adjacent colors (WCAG 2.1
            Success Criterion 1.4.11).
          </p>
          <p>
            The contrast ratio is calculated using the{" "}
            <strong className="text-gray-900 dark:text-white">
              relative luminance
            </strong>{" "}
            of each color. The formula is: (L1 + 0.05) / (L2 + 0.05), where L1
            is the lighter color&apos;s luminance.
          </p>
        </div>
      </details>
    </div>
  );
}
