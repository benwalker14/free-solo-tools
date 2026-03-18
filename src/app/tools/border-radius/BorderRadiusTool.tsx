"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";

interface Preset {
  name: string;
  values: [number, number, number, number];
  unit: string;
  description: string;
}

const PRESETS: Preset[] = [
  { name: "Rounded", values: [8, 8, 8, 8], unit: "px", description: "Subtle rounding" },
  { name: "Pill", values: [9999, 9999, 9999, 9999], unit: "px", description: "Fully rounded" },
  { name: "Circle", values: [50, 50, 50, 50], unit: "%", description: "Perfect circle" },
  { name: "Leaf", values: [0, 50, 0, 50], unit: "%", description: "Diagonal rounding" },
  { name: "Drop", values: [50, 50, 50, 0], unit: "%", description: "Teardrop shape" },
  { name: "Ticket", values: [12, 12, 12, 12], unit: "px", description: "Card-style rounding" },
  { name: "Blob", values: [30, 70, 70, 30], unit: "%", description: "Organic shape" },
  { name: "Tab", values: [12, 12, 0, 0], unit: "px", description: "Top-only rounding" },
];

const UNITS = ["px", "%", "em", "rem"] as const;
type Unit = (typeof UNITS)[number];

export default function BorderRadiusTool() {
  const [topLeft, setTopLeft] = useState(12);
  const [topRight, setTopRight] = useState(12);
  const [bottomRight, setBottomRight] = useState(12);
  const [bottomLeft, setBottomLeft] = useState(12);
  const [linked, setLinked] = useState(true);
  const [unit, setUnit] = useState<Unit>("px");
  const [boxWidth, setBoxWidth] = useState(200);
  const [boxHeight, setBoxHeight] = useState(200);
  const [boxColor, setBoxColor] = useState("#6366f1");
  const [bgColor, setBgColor] = useState("#f3f4f6");
  const [copied, setCopied] = useState(false);
  const { trackFirstInteraction } = useToolAnalytics("border-radius");

  const setAll = useCallback(
    (value: number) => {
      setTopLeft(value);
      setTopRight(value);
      setBottomRight(value);
      setBottomLeft(value);
    },
    [],
  );

  const allEqual = topLeft === topRight && topRight === bottomRight && bottomRight === bottomLeft;

  const buildCSS = useCallback((): string => {
    if (allEqual) {
      return `border-radius: ${topLeft}${unit};`;
    }
    return `border-radius: ${topLeft}${unit} ${topRight}${unit} ${bottomRight}${unit} ${bottomLeft}${unit};`;
  }, [topLeft, topRight, bottomRight, bottomLeft, unit, allEqual]);

  const cssValue = buildCSS();

  const borderRadiusStyle = `${topLeft}${unit} ${topRight}${unit} ${bottomRight}${unit} ${bottomLeft}${unit}`;

  function handleCornerChange(corner: "tl" | "tr" | "br" | "bl", value: number) {
    trackFirstInteraction();
    if (linked) {
      setAll(value);
    } else {
      switch (corner) {
        case "tl": setTopLeft(value); break;
        case "tr": setTopRight(value); break;
        case "br": setBottomRight(value); break;
        case "bl": setBottomLeft(value); break;
      }
    }
  }

  function applyPreset(preset: Preset) {
    trackFirstInteraction();
    const [tl, tr, br, bl] = preset.values;
    setTopLeft(tl);
    setTopRight(tr);
    setBottomRight(br);
    setBottomLeft(bl);
    setUnit(preset.unit as Unit);
    setLinked(tl === tr && tr === br && br === bl);
  }

  function copyCSS() {
    navigator.clipboard.writeText(cssValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const maxVal = unit === "%" ? 50 : unit === "px" ? 200 : 20;

  const inputClass =
    "rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="mb-8 block text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        &larr; Back to tools
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        CSS Border Radius Generator
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Design CSS border-radius visually. Adjust each corner independently or
        link them, choose units, and copy the CSS.
      </p>

      {/* Live Preview */}
      <div
        className="mb-8 flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700"
        style={{ backgroundColor: bgColor, height: Math.max(boxHeight + 80, 200) }}
      >
        <div
          className="transition-all duration-150 border-2 border-dashed border-gray-400/30"
          style={{
            width: `${boxWidth}px`,
            height: `${boxHeight}px`,
            backgroundColor: boxColor,
            borderRadius: borderRadiusStyle,
          }}
        />
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Left: Controls */}
        <div className="space-y-6">
          {/* Unit & Link */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Unit:
              </label>
              <select
                value={unit}
                onChange={(e) => { trackFirstInteraction(); setUnit(e.target.value as Unit); }}
                className={`${inputClass} w-20`}
              >
                {UNITS.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
            <button
              onClick={() => {
                trackFirstInteraction();
                if (!linked) {
                  setAll(topLeft);
                }
                setLinked(!linked);
              }}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                linked
                  ? "border border-indigo-500 bg-indigo-50 text-indigo-700 dark:border-indigo-500 dark:bg-indigo-950 dark:text-indigo-300"
                  : "border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {linked ? (
                  <>
                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                  </>
                ) : (
                  <>
                    <path d="M18 13h-5" />
                    <path d="M11 5h5a2 2 0 0 1 2 2v5" />
                    <path d="M6 19h5a2 2 0 0 0 2-2v-5" />
                    <path d="M6 5h.01" />
                    <path d="M18 19h.01" />
                  </>
                )}
              </svg>
              {linked ? "Linked" : "Unlinked"}
            </button>
          </div>

          {/* Corner Controls */}
          <div className="space-y-3">
            {([
              ["tl", "Top Left", topLeft] as const,
              ["tr", "Top Right", topRight] as const,
              ["br", "Bottom Right", bottomRight] as const,
              ["bl", "Bottom Left", bottomLeft] as const,
            ]).map(([key, label, value]) => (
              <div key={key} className="flex flex-wrap items-center gap-3">
                <label className="w-24 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {label}
                </label>
                <input
                  type="range"
                  min={0}
                  max={maxVal}
                  value={value}
                  onChange={(e) => handleCornerChange(key, Number(e.target.value))}
                  className="w-32 accent-indigo-600 sm:w-40"
                />
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min={0}
                    max={maxVal * 2}
                    value={value}
                    onChange={(e) => handleCornerChange(key, Math.max(0, Number(e.target.value) || 0))}
                    className={`${inputClass} w-20 tabular-nums`}
                  />
                  <span className="text-sm text-gray-500 dark:text-gray-400">{unit}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Box Settings */}
          <div>
            <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Preview Settings
            </h2>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600 dark:text-gray-400">W:</label>
                <input
                  type="number"
                  min={50}
                  max={400}
                  value={boxWidth}
                  onChange={(e) => { trackFirstInteraction(); setBoxWidth(Math.max(50, Number(e.target.value) || 50)); }}
                  className={`${inputClass} w-20 tabular-nums`}
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600 dark:text-gray-400">H:</label>
                <input
                  type="number"
                  min={50}
                  max={400}
                  value={boxHeight}
                  onChange={(e) => { trackFirstInteraction(); setBoxHeight(Math.max(50, Number(e.target.value) || 50)); }}
                  className={`${inputClass} w-20 tabular-nums`}
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600 dark:text-gray-400">Box:</label>
                <input
                  type="color"
                  value={boxColor}
                  onChange={(e) => { trackFirstInteraction(); setBoxColor(e.target.value); }}
                  className="h-9 w-12 cursor-pointer rounded border-0 bg-transparent p-0"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600 dark:text-gray-400">BG:</label>
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => { trackFirstInteraction(); setBgColor(e.target.value); }}
                  className="h-9 w-12 cursor-pointer rounded border-0 bg-transparent p-0"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Corner Diagram */}
        <div className="flex items-center justify-center">
          <div className="relative" style={{ width: 180, height: 180 }}>
            {/* Visual box */}
            <div
              className="absolute inset-4 border-2 border-indigo-400 dark:border-indigo-500 transition-all duration-150"
              style={{ borderRadius: borderRadiusStyle }}
            />
            {/* Corner labels */}
            <div className="absolute top-0 left-0 text-xs font-mono font-medium text-gray-600 dark:text-gray-400">
              {topLeft}{unit}
            </div>
            <div className="absolute top-0 right-0 text-xs font-mono font-medium text-gray-600 dark:text-gray-400">
              {topRight}{unit}
            </div>
            <div className="absolute bottom-0 right-0 text-xs font-mono font-medium text-gray-600 dark:text-gray-400">
              {bottomRight}{unit}
            </div>
            <div className="absolute bottom-0 left-0 text-xs font-mono font-medium text-gray-600 dark:text-gray-400">
              {bottomLeft}{unit}
            </div>
          </div>
        </div>
      </div>

      {/* CSS Output */}
      <div className="mt-8 mb-8">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            CSS Output
          </h2>
          <button
            onClick={copyCSS}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
          >
            {copied ? "Copied!" : "Copy CSS"}
          </button>
        </div>
        <pre className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm font-mono text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 overflow-x-auto whitespace-pre-wrap">
          {cssValue}
        </pre>
      </div>

      {/* Presets */}
      <div className="mb-8">
        <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Presets
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {PRESETS.map((preset) => {
            const [tl, tr, br, bl] = preset.values;
            const u = preset.unit;
            const previewRadius = `${tl}${u} ${tr}${u} ${br}${u} ${bl}${u}`;
            return (
              <button
                key={preset.name}
                onClick={() => applyPreset(preset)}
                className="group rounded-lg border border-gray-200 p-3 text-left transition-colors hover:border-indigo-400 dark:border-gray-700 dark:hover:border-indigo-600"
              >
                <div className="mb-2 flex h-16 items-center justify-center rounded-md bg-gray-100 dark:bg-gray-800">
                  <div
                    className="h-10 w-10 bg-indigo-500"
                    style={{ borderRadius: previewRadius }}
                  />
                </div>
                <span className="text-xs font-medium text-gray-600 group-hover:text-indigo-600 dark:text-gray-400 dark:group-hover:text-indigo-400">
                  {preset.name}
                </span>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {preset.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Reference */}
      <details className="rounded-lg border border-gray-200 dark:border-gray-700">
        <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
          About CSS Border Radius
        </summary>
        <div className="border-t border-gray-200 px-4 py-3 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-400 space-y-2">
          <p>
            The{" "}
            <code className="mx-1 rounded bg-gray-100 px-1.5 py-0.5 text-xs dark:bg-gray-800">
              border-radius
            </code>{" "}
            property rounds the corners of an element. You can set a single value for all
            corners or specify each corner individually.
          </p>
          <p>
            <strong className="text-gray-900 dark:text-white">Shorthand:</strong>{" "}
            <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs dark:bg-gray-800">
              border-radius: top-left top-right bottom-right bottom-left
            </code>{" "}
            — values go clockwise from the top-left corner.
          </p>
          <p>
            <strong className="text-gray-900 dark:text-white">Units:</strong>{" "}
            Use <strong>px</strong> for fixed rounding, <strong>%</strong> for
            proportional rounding (50% on a square creates a circle),{" "}
            <strong>em/rem</strong> for scalable rounding relative to font size.
          </p>
          <p>
            <strong className="text-gray-900 dark:text-white">Pill shape:</strong>{" "}
            Set a very large pixel value (e.g. 9999px) on a rectangular element to
            create a fully rounded pill shape. This works because the radius is
            clamped to half the element&apos;s dimension.
          </p>
          <p>
            <strong className="text-gray-900 dark:text-white">Elliptical corners:</strong>{" "}
            CSS also supports separate horizontal and vertical radii using the{" "}
            <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs dark:bg-gray-800">
              border-radius: h-radius / v-radius
            </code>{" "}
            syntax for asymmetric curves, though this generator focuses on circular (uniform) corners.
          </p>
        </div>
      </details>
    </div>
  );
}
