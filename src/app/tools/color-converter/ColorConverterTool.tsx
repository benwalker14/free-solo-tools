"use client";

import { useState } from "react";
import Link from "next/link";

interface RGB {
  r: number;
  g: number;
  b: number;
}

interface HSL {
  h: number;
  s: number;
  l: number;
}

function hexToRgb(hex: string): RGB | null {
  const cleaned = hex.replace(/^#/, "");
  if (cleaned.length !== 6) return null;
  const num = parseInt(cleaned, 16);
  if (isNaN(num)) return null;
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function rgbToHex(rgb: RGB): string {
  const toHex = (n: number) =>
    Math.max(0, Math.min(255, Math.round(n)))
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
}

function rgbToHsl(rgb: RGB): HSL {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  if (max === min) {
    return { h: 0, s: 0, l: Math.round(l * 100) };
  }

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

  let h = 0;
  switch (max) {
    case r:
      h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
      break;
    case g:
      h = ((b - r) / d + 2) / 6;
      break;
    case b:
      h = ((r - g) / d + 4) / 6;
      break;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function hslToRgb(hsl: HSL): RGB {
  const h = hsl.h / 360;
  const s = hsl.s / 100;
  const l = hsl.l / 100;

  if (s === 0) {
    const v = Math.round(l * 255);
    return { r: v, g: v, b: v };
  }

  const hue2rgb = (p: number, q: number, t: number) => {
    let tt = t;
    if (tt < 0) tt += 1;
    if (tt > 1) tt -= 1;
    if (tt < 1 / 6) return p + (q - p) * 6 * tt;
    if (tt < 1 / 2) return q;
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
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

export default function ColorConverterTool() {
  const [hexValue, setHexValue] = useState("#6366f1");
  const [rgb, setRgb] = useState<RGB>({ r: 99, g: 102, b: 241 });
  const [hsl, setHsl] = useState<HSL>({ h: 239, s: 84, l: 67 });
  const [error, setError] = useState("");

  function handleHexChange(value: string) {
    setHexValue(value);
    const parsed = hexToRgb(value);
    if (parsed) {
      setRgb(parsed);
      setHsl(rgbToHsl(parsed));
      setError("");
    } else {
      setError("Invalid HEX color");
    }
  }

  function handlePickerChange(value: string) {
    setHexValue(value);
    const parsed = hexToRgb(value);
    if (parsed) {
      setRgb(parsed);
      setHsl(rgbToHsl(parsed));
      setError("");
    }
  }

  function handleRgbChange(channel: keyof RGB, value: number) {
    const clamped = Math.max(0, Math.min(255, isNaN(value) ? 0 : value));
    const newRgb = { ...rgb, [channel]: clamped };
    setRgb(newRgb);
    setHexValue(rgbToHex(newRgb));
    setHsl(rgbToHsl(newRgb));
    setError("");
  }

  function handleHslChange(channel: keyof HSL, value: number) {
    const max = channel === "h" ? 360 : 100;
    const clamped = Math.max(0, Math.min(max, isNaN(value) ? 0 : value));
    const newHsl = { ...hsl, [channel]: clamped };
    setHsl(newHsl);
    const newRgb = hslToRgb(newHsl);
    setRgb(newRgb);
    setHexValue(rgbToHex(newRgb));
    setError("");
  }

  function copyText(text: string) {
    navigator.clipboard.writeText(text);
  }

  const hexDisplay = hexValue.startsWith("#") ? hexValue : `#${hexValue}`;
  const rgbDisplay = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  const hslDisplay = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

  const inputClass =
    "w-20 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="mb-8 block text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        &larr; Back to tools
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Color Converter
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Convert colors between HEX, RGB, and HSL formats.
      </p>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-600 dark:bg-red-950 dark:border-red-800 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="flex flex-wrap items-start gap-6">
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-24 h-24 rounded-lg border border-gray-300 dark:border-gray-700"
            style={{ backgroundColor: hexDisplay }}
          />
          <input
            type="color"
            value={hexDisplay}
            onChange={(e) => handlePickerChange(e.target.value)}
            className="h-10 w-24 cursor-pointer rounded border-0 bg-transparent p-0"
          />
        </div>

        <div className="flex-1 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                HEX
              </label>
              <button
                onClick={() => copyText(hexDisplay)}
                className="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Copy
              </button>
            </div>
            <input
              type="text"
              value={hexValue}
              onChange={(e) => handleHexChange(e.target.value)}
              className={inputClass}
              style={{ width: "8rem" }}
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                RGB
              </label>
              <button
                onClick={() => copyText(rgbDisplay)}
                className="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Copy
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <label className="text-xs text-gray-500 dark:text-gray-400">
                R
              </label>
              <input
                type="number"
                min={0}
                max={255}
                value={rgb.r}
                onChange={(e) => handleRgbChange("r", Number(e.target.value))}
                className={inputClass}
              />
              <label className="text-xs text-gray-500 dark:text-gray-400">
                G
              </label>
              <input
                type="number"
                min={0}
                max={255}
                value={rgb.g}
                onChange={(e) => handleRgbChange("g", Number(e.target.value))}
                className={inputClass}
              />
              <label className="text-xs text-gray-500 dark:text-gray-400">
                B
              </label>
              <input
                type="number"
                min={0}
                max={255}
                value={rgb.b}
                onChange={(e) => handleRgbChange("b", Number(e.target.value))}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                HSL
              </label>
              <button
                onClick={() => copyText(hslDisplay)}
                className="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Copy
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <label className="text-xs text-gray-500 dark:text-gray-400">
                H
              </label>
              <input
                type="number"
                min={0}
                max={360}
                value={hsl.h}
                onChange={(e) => handleHslChange("h", Number(e.target.value))}
                className={inputClass}
              />
              <label className="text-xs text-gray-500 dark:text-gray-400">
                S
              </label>
              <input
                type="number"
                min={0}
                max={100}
                value={hsl.s}
                onChange={(e) => handleHslChange("s", Number(e.target.value))}
                className={inputClass}
              />
              <label className="text-xs text-gray-500 dark:text-gray-400">
                L
              </label>
              <input
                type="number"
                min={0}
                max={100}
                value={hsl.l}
                onChange={(e) => handleHslChange("l", Number(e.target.value))}
                className={inputClass}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
