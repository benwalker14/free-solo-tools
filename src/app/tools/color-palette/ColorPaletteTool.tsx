"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";

// --- Color conversion utilities ---

interface HSL {
  h: number; // 0-360
  s: number; // 0-100
  l: number; // 0-100
}

interface RGB {
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
}

function hexToRgb(hex: string): RGB {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.substring(0, 2), 16),
    g: parseInt(h.substring(2, 4), 16),
    b: parseInt(h.substring(4, 6), 16),
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  return (
    "#" +
    [clamp(r), clamp(g), clamp(b)]
      .map((c) => c.toString(16).padStart(2, "0"))
      .join("")
  );
}

function rgbToHsl(r: number, g: number, b: number): HSL {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function hslToRgb(h: number, s: number, l: number): RGB {
  h /= 360;
  s /= 100;
  l /= 100;
  if (s === 0) {
    const v = Math.round(l * 255);
    return { r: v, g: v, b: v };
  }
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return {
    r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, h) * 255),
    b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
  };
}

function hexToHsl(hex: string): HSL {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHsl(r, g, b);
}

function hslToHex(h: number, s: number, l: number): string {
  const { r, g, b } = hslToRgb(h, s, l);
  return rgbToHex(r, g, b);
}

function wrapHue(h: number): number {
  return ((h % 360) + 360) % 360;
}

// --- Palette generation algorithms ---

type HarmonyType =
  | "complementary"
  | "analogous"
  | "triadic"
  | "tetradic"
  | "split-complementary"
  | "monochromatic";

interface PaletteColor {
  hex: string;
  label: string;
}

function generatePalette(hex: string, harmony: HarmonyType): PaletteColor[] {
  const hsl = hexToHsl(hex);
  const { h, s, l } = hsl;

  switch (harmony) {
    case "complementary":
      return [
        { hex, label: "Base" },
        { hex: hslToHex(wrapHue(h + 180), s, l), label: "Complement" },
      ];

    case "analogous":
      return [
        { hex: hslToHex(wrapHue(h - 30), s, l), label: "Analogous -30\u00B0" },
        { hex, label: "Base" },
        { hex: hslToHex(wrapHue(h + 30), s, l), label: "Analogous +30\u00B0" },
      ];

    case "triadic":
      return [
        { hex, label: "Base" },
        { hex: hslToHex(wrapHue(h + 120), s, l), label: "Triad 120\u00B0" },
        { hex: hslToHex(wrapHue(h + 240), s, l), label: "Triad 240\u00B0" },
      ];

    case "tetradic":
      return [
        { hex, label: "Base" },
        { hex: hslToHex(wrapHue(h + 90), s, l), label: "Tetrad 90\u00B0" },
        { hex: hslToHex(wrapHue(h + 180), s, l), label: "Tetrad 180\u00B0" },
        { hex: hslToHex(wrapHue(h + 270), s, l), label: "Tetrad 270\u00B0" },
      ];

    case "split-complementary":
      return [
        { hex, label: "Base" },
        { hex: hslToHex(wrapHue(h + 150), s, l), label: "Split 150\u00B0" },
        { hex: hslToHex(wrapHue(h + 210), s, l), label: "Split 210\u00B0" },
      ];

    case "monochromatic":
      return [
        { hex: hslToHex(h, s, Math.max(l - 30, 5)), label: "Darkest" },
        { hex: hslToHex(h, s, Math.max(l - 15, 10)), label: "Dark" },
        { hex, label: "Base" },
        { hex: hslToHex(h, s, Math.min(l + 15, 90)), label: "Light" },
        { hex: hslToHex(h, s, Math.min(l + 30, 95)), label: "Lightest" },
      ];
  }
}

// --- Shades/tints generation ---

function generateShades(hex: string, count: number): string[] {
  const hsl = hexToHsl(hex);
  const shades: string[] = [];
  for (let i = 0; i < count; i++) {
    const l = Math.round((100 / (count + 1)) * (i + 1));
    shades.push(hslToHex(hsl.h, hsl.s, l));
  }
  return shades;
}

// --- Contrast helpers ---

function relativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  const toLinear = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function contrastRatio(hex1: string, hex2: string): number {
  const l1 = relativeLuminance(hex1);
  const l2 = relativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function contrastTextColor(hex: string): string {
  return relativeLuminance(hex) > 0.179 ? "#000000" : "#ffffff";
}

// --- Export formats ---

function exportCSS(palette: PaletteColor[]): string {
  const lines = palette.map(
    (c, i) => `  --color-${i + 1}: ${c.hex};`
  );
  return `:root {\n${lines.join("\n")}\n}`;
}

function exportTailwind(palette: PaletteColor[]): string {
  const entries = palette.map(
    (c, i) => `      '${(i + 1) * 100}': '${c.hex}',`
  );
  return `// tailwind.config.js\ncolors: {\n  palette: {\n${entries.join("\n")}\n  }\n}`;
}

function exportSCSS(palette: PaletteColor[]): string {
  return palette
    .map((c, i) => `$color-${i + 1}: ${c.hex};`)
    .join("\n");
}

function exportJSON(palette: PaletteColor[]): string {
  const obj: Record<string, string> = {};
  palette.forEach((c, i) => {
    obj[`color-${i + 1}`] = c.hex;
  });
  return JSON.stringify(obj, null, 2);
}

type ExportFormat = "css" | "tailwind" | "scss" | "json";

const HARMONY_OPTIONS: { value: HarmonyType; label: string }[] = [
  { value: "complementary", label: "Complementary" },
  { value: "analogous", label: "Analogous" },
  { value: "triadic", label: "Triadic" },
  { value: "tetradic", label: "Tetradic (Square)" },
  { value: "split-complementary", label: "Split-Complementary" },
  { value: "monochromatic", label: "Monochromatic" },
];

const EXPORT_OPTIONS: { value: ExportFormat; label: string }[] = [
  { value: "css", label: "CSS Variables" },
  { value: "tailwind", label: "Tailwind" },
  { value: "scss", label: "SCSS" },
  { value: "json", label: "JSON" },
];

export default function ColorPaletteTool() {
  const [baseColor, setBaseColor] = useState("#6366f1");
  const [harmony, setHarmony] = useState<HarmonyType>("analogous");
  const [exportFormat, setExportFormat] = useState<ExportFormat>("css");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedExport, setCopiedExport] = useState(false);
  const { trackFirstInteraction } = useToolAnalytics("color-palette");

  const palette = useMemo(
    () => generatePalette(baseColor, harmony),
    [baseColor, harmony]
  );

  const shades = useMemo(() => generateShades(baseColor, 9), [baseColor]);

  const exportCode = useMemo(() => {
    switch (exportFormat) {
      case "css":
        return exportCSS(palette);
      case "tailwind":
        return exportTailwind(palette);
      case "scss":
        return exportSCSS(palette);
      case "json":
        return exportJSON(palette);
    }
  }, [palette, exportFormat]);

  const handleBaseColorChange = useCallback(
    (value: string) => {
      trackFirstInteraction();
      if (/^#[0-9a-fA-F]{6}$/.test(value)) {
        setBaseColor(value);
      }
    },
    [trackFirstInteraction]
  );

  function copyColor(hex: string, index: number) {
    navigator.clipboard.writeText(hex);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  }

  function copyExport() {
    navigator.clipboard.writeText(exportCode);
    setCopiedExport(true);
    setTimeout(() => setCopiedExport(false), 1500);
  }

  function randomBaseColor() {
    trackFirstInteraction();
    const hex =
      "#" +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0");
    setBaseColor(hex);
  }

  const inputClass =
    "rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";
  const btnClass =
    "rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors";
  const btnActiveClass =
    "rounded-lg border border-indigo-500 bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700 dark:border-indigo-500 dark:bg-indigo-950 dark:text-indigo-300";

  const baseHsl = hexToHsl(baseColor);
  const baseRgb = hexToRgb(baseColor);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="mb-8 block text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        &larr; Back to tools
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Color Palette Generator
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Generate harmonious color palettes from any base color using color theory
        algorithms.
      </p>

      {/* Base Color Picker */}
      <div className="mb-8 rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-800/50">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Base Color
            </label>
            <input
              type="color"
              value={baseColor}
              onChange={(e) => handleBaseColorChange(e.target.value)}
              className="h-10 w-14 cursor-pointer rounded border-0 bg-transparent p-0"
            />
            <input
              type="text"
              value={baseColor}
              onChange={(e) => {
                const val = e.target.value;
                if (/^#[0-9a-fA-F]{0,6}$/.test(val)) {
                  if (val.length === 7) handleBaseColorChange(val);
                  else setBaseColor(val as string);
                }
              }}
              onBlur={() => {
                if (!/^#[0-9a-fA-F]{6}$/.test(baseColor)) {
                  setBaseColor("#6366f1");
                }
              }}
              className={`${inputClass} w-24 font-mono`}
            />
          </div>
          <button onClick={randomBaseColor} className={btnClass}>
            Random
          </button>
          <div className="ml-auto text-xs text-gray-500 dark:text-gray-400 font-mono space-x-3">
            <span>
              RGB({baseRgb.r}, {baseRgb.g}, {baseRgb.b})
            </span>
            <span>
              HSL({baseHsl.h}, {baseHsl.s}%, {baseHsl.l}%)
            </span>
          </div>
        </div>
      </div>

      {/* Harmony Type Selector */}
      <div className="mb-6">
        <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Color Harmony
        </h2>
        <div className="flex flex-wrap gap-2">
          {HARMONY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                trackFirstInteraction();
                setHarmony(opt.value);
              }}
              className={harmony === opt.value ? btnActiveClass : btnClass}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Generated Palette */}
      <div className="mb-8">
        <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Palette
        </h2>
        <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${palette.length}, 1fr)` }}>
          {palette.map((color, i) => {
            const textColor = contrastTextColor(color.hex);
            const ratio = contrastRatio(color.hex, "#ffffff");
            const ratioBlack = contrastRatio(color.hex, "#000000");
            const rgb = hexToRgb(color.hex);
            const hsl = hexToHsl(color.hex);
            return (
              <button
                key={i}
                onClick={() => copyColor(color.hex, i)}
                className="group relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                title={`Click to copy ${color.hex}`}
              >
                <div
                  className="flex flex-col items-center justify-center py-10 px-2"
                  style={{ backgroundColor: color.hex }}
                >
                  <span
                    className="text-sm font-bold mb-1"
                    style={{ color: textColor }}
                  >
                    {copiedIndex === i ? "Copied!" : color.hex.toUpperCase()}
                  </span>
                  <span
                    className="text-xs opacity-80"
                    style={{ color: textColor }}
                  >
                    {color.label}
                  </span>
                </div>
                <div className="bg-white dark:bg-gray-900 px-2 py-2 text-center">
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 font-mono leading-relaxed">
                    rgb({rgb.r}, {rgb.g}, {rgb.b})
                    <br />
                    hsl({hsl.h}, {hsl.s}%, {hsl.l}%)
                  </p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
                    {ratio >= 4.5 ? "AA \u2713" : ratio >= 3 ? "AA Large" : ""}{" "}
                    on white &middot;{" "}
                    {ratioBlack >= 4.5
                      ? "AA \u2713"
                      : ratioBlack >= 3
                        ? "AA Large"
                        : ""}{" "}
                    on black
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Shades & Tints */}
      <div className="mb-8">
        <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Shades &amp; Tints
        </h2>
        <div className="flex rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
          {shades.map((shade, i) => (
            <button
              key={i}
              onClick={() => {
                navigator.clipboard.writeText(shade);
                setCopiedIndex(100 + i);
                setTimeout(() => setCopiedIndex(null), 1500);
              }}
              className="flex-1 h-16 relative group transition-transform hover:scale-y-110 focus:outline-none"
              style={{ backgroundColor: shade }}
              title={shade}
            >
              <span
                className="absolute inset-0 flex items-center justify-center text-[10px] font-mono font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: contrastTextColor(shade) }}
              >
                {copiedIndex === 100 + i ? "Copied!" : shade.toUpperCase()}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Export */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Export
          </h2>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {EXPORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setExportFormat(opt.value)}
                  className={`rounded px-2 py-1 text-xs font-medium transition-colors ${
                    exportFormat === opt.value
                      ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <button
              onClick={copyExport}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
            >
              {copiedExport ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
        <pre className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm font-mono text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 overflow-x-auto">
          {exportCode}
        </pre>
      </div>

      {/* Quick Reference */}
      <details className="rounded-lg border border-gray-200 dark:border-gray-700">
        <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
          About Color Harmonies
        </summary>
        <div className="border-t border-gray-200 px-4 py-3 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-400 space-y-2">
          <p>
            <strong className="text-gray-900 dark:text-white">
              Complementary
            </strong>{" "}
            uses two colors opposite each other on the color wheel (180&deg;
            apart). Creates high contrast and visual tension.
          </p>
          <p>
            <strong className="text-gray-900 dark:text-white">Analogous</strong>{" "}
            uses colors adjacent on the color wheel (30&deg; apart). Creates
            harmonious, natural-feeling palettes.
          </p>
          <p>
            <strong className="text-gray-900 dark:text-white">Triadic</strong>{" "}
            uses three colors equally spaced (120&deg; apart). Offers vibrant
            variety while maintaining balance.
          </p>
          <p>
            <strong className="text-gray-900 dark:text-white">
              Tetradic (Square)
            </strong>{" "}
            uses four colors at 90&deg; intervals. Rich color schemes — best
            when one color dominates.
          </p>
          <p>
            <strong className="text-gray-900 dark:text-white">
              Split-Complementary
            </strong>{" "}
            uses one base plus two colors adjacent to its complement (150&deg;
            and 210&deg;). Less tension than complementary, still vibrant.
          </p>
          <p>
            <strong className="text-gray-900 dark:text-white">
              Monochromatic
            </strong>{" "}
            varies lightness of a single hue. Clean, elegant, and easy to
            implement.
          </p>
          <p>
            <strong className="text-gray-900 dark:text-white">
              WCAG Contrast
            </strong>{" "}
            — AA requires 4.5:1 ratio for normal text. &ldquo;AA Large&rdquo;
            means it passes the 3:1 threshold for large text (18px+ bold or
            24px+).
          </p>
        </div>
      </details>
    </div>
  );
}
