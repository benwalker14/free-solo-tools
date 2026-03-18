"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";

interface ColorStop {
  id: number;
  color: string;
  position: number;
}

type GradientType = "linear" | "radial";
type RadialShape = "circle" | "ellipse";

const RADIAL_POSITIONS = [
  "center",
  "top",
  "top right",
  "right",
  "bottom right",
  "bottom",
  "bottom left",
  "left",
  "top left",
] as const;

const PRESETS: {
  name: string;
  type: GradientType;
  angle: number;
  stops: { color: string; position: number }[];
}[] = [
  {
    name: "Sunset",
    type: "linear",
    angle: 135,
    stops: [
      { color: "#ff512f", position: 0 },
      { color: "#f09819", position: 100 },
    ],
  },
  {
    name: "Ocean",
    type: "linear",
    angle: 90,
    stops: [
      { color: "#2193b0", position: 0 },
      { color: "#6dd5ed", position: 100 },
    ],
  },
  {
    name: "Purple Haze",
    type: "linear",
    angle: 135,
    stops: [
      { color: "#7b4397", position: 0 },
      { color: "#dc2430", position: 100 },
    ],
  },
  {
    name: "Emerald",
    type: "linear",
    angle: 180,
    stops: [
      { color: "#11998e", position: 0 },
      { color: "#38ef7d", position: 100 },
    ],
  },
  {
    name: "Midnight",
    type: "linear",
    angle: 180,
    stops: [
      { color: "#0f0c29", position: 0 },
      { color: "#302b63", position: 50 },
      { color: "#24243e", position: 100 },
    ],
  },
  {
    name: "Peach",
    type: "linear",
    angle: 90,
    stops: [
      { color: "#ed6ea0", position: 0 },
      { color: "#ec8c69", position: 100 },
    ],
  },
  {
    name: "Sky",
    type: "radial",
    angle: 0,
    stops: [
      { color: "#e0eafc", position: 0 },
      { color: "#cfdef3", position: 100 },
    ],
  },
  {
    name: "Aurora",
    type: "linear",
    angle: 135,
    stops: [
      { color: "#00c6ff", position: 0 },
      { color: "#0072ff", position: 50 },
      { color: "#7c2ae8", position: 100 },
    ],
  },
];

let nextId = 3;

export default function GradientGeneratorTool() {
  const [gradientType, setGradientType] = useState<GradientType>("linear");
  const [angle, setAngle] = useState(135);
  const [radialShape, setRadialShape] = useState<RadialShape>("circle");
  const [radialPosition, setRadialPosition] =
    useState<(typeof RADIAL_POSITIONS)[number]>("center");
  const [stops, setStops] = useState<ColorStop[]>([
    { id: 1, color: "#6366f1", position: 0 },
    { id: 2, color: "#ec4899", position: 100 },
  ]);
  const [copied, setCopied] = useState(false);
  const { trackFirstInteraction } = useToolAnalytics("gradient-generator");

  const buildGradientCSS = useCallback(() => {
    const sortedStops = [...stops].sort((a, b) => a.position - b.position);
    const stopsStr = sortedStops
      .map((s) => `${s.color} ${s.position}%`)
      .join(", ");

    if (gradientType === "linear") {
      return `linear-gradient(${angle}deg, ${stopsStr})`;
    }
    return `radial-gradient(${radialShape} at ${radialPosition}, ${stopsStr})`;
  }, [stops, gradientType, angle, radialShape, radialPosition]);

  const cssValue = buildGradientCSS();
  const fullCSS = `background: ${cssValue};`;

  function addStop() {
    trackFirstInteraction();
    if (stops.length >= 10) return;
    const sorted = [...stops].sort((a, b) => a.position - b.position);
    // Place new stop between the last two stops
    const lastTwo = sorted.slice(-2);
    const midPos = Math.round(
      (lastTwo[0].position + lastTwo[1].position) / 2,
    );
    // Blend colors for the midpoint
    setStops([
      ...stops,
      { id: nextId++, color: "#a855f7", position: midPos },
    ]);
  }

  function removeStop(id: number) {
    trackFirstInteraction();
    if (stops.length <= 2) return;
    setStops(stops.filter((s) => s.id !== id));
  }

  function updateStopColor(id: number, color: string) {
    trackFirstInteraction();
    setStops(stops.map((s) => (s.id === id ? { ...s, color } : s)));
  }

  function updateStopPosition(id: number, position: number) {
    trackFirstInteraction();
    const clamped = Math.max(0, Math.min(100, position));
    setStops(
      stops.map((s) => (s.id === id ? { ...s, position: clamped } : s)),
    );
  }

  function applyPreset(preset: (typeof PRESETS)[number]) {
    trackFirstInteraction();
    setGradientType(preset.type);
    setAngle(preset.angle);
    setStops(
      preset.stops.map((s) => ({ id: nextId++, ...s })),
    );
    if (preset.type === "radial") {
      setRadialShape("circle");
      setRadialPosition("center");
    }
  }

  function copyCSS() {
    navigator.clipboard.writeText(fullCSS);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function reverseStops() {
    trackFirstInteraction();
    setStops(
      stops.map((s) => ({ ...s, position: 100 - s.position })),
    );
  }

  const inputClass =
    "rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";
  const btnClass =
    "rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors";
  const btnActiveClass =
    "rounded-lg border border-indigo-500 bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700 dark:border-indigo-500 dark:bg-indigo-950 dark:text-indigo-300";

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="mb-8 block text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        &larr; Back to tools
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        CSS Gradient Generator
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Create beautiful CSS gradients visually. Adjust colors, stops, angles,
        and copy the CSS.
      </p>

      {/* Live Preview */}
      <div
        className="mb-8 h-48 w-full rounded-xl border border-gray-200 dark:border-gray-700 shadow-inner"
        style={{ background: cssValue }}
      />

      {/* Gradient Type Toggle */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Type:
        </span>
        <button
          onClick={() => {
            trackFirstInteraction();
            setGradientType("linear");
          }}
          className={gradientType === "linear" ? btnActiveClass : btnClass}
        >
          Linear
        </button>
        <button
          onClick={() => {
            trackFirstInteraction();
            setGradientType("radial");
          }}
          className={gradientType === "radial" ? btnActiveClass : btnClass}
        >
          Radial
        </button>
      </div>

      {/* Controls */}
      <div className="mb-6 space-y-4">
        {gradientType === "linear" && (
          <div className="flex flex-wrap items-center gap-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Angle:
            </label>
            <input
              type="range"
              min={0}
              max={360}
              value={angle}
              onChange={(e) => {
                trackFirstInteraction();
                setAngle(Number(e.target.value));
              }}
              className="w-48 accent-indigo-600"
            />
            <div className="flex items-center gap-1">
              <input
                type="number"
                min={0}
                max={360}
                value={angle}
                onChange={(e) => {
                  trackFirstInteraction();
                  setAngle(
                    Math.max(0, Math.min(360, Number(e.target.value) || 0)),
                  );
                }}
                className={`${inputClass} w-20`}
              />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                deg
              </span>
            </div>
            {/* Quick angle buttons */}
            <div className="flex gap-1">
              {[0, 45, 90, 135, 180, 270].map((a) => (
                <button
                  key={a}
                  onClick={() => {
                    trackFirstInteraction();
                    setAngle(a);
                  }}
                  className={`rounded px-2 py-1 text-xs font-medium transition-colors ${
                    angle === a
                      ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                  }`}
                >
                  {a}&deg;
                </button>
              ))}
            </div>
          </div>
        )}

        {gradientType === "radial" && (
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Shape:
              </label>
              <button
                onClick={() => {
                  trackFirstInteraction();
                  setRadialShape("circle");
                }}
                className={
                  radialShape === "circle" ? btnActiveClass : btnClass
                }
              >
                Circle
              </button>
              <button
                onClick={() => {
                  trackFirstInteraction();
                  setRadialShape("ellipse");
                }}
                className={
                  radialShape === "ellipse" ? btnActiveClass : btnClass
                }
              >
                Ellipse
              </button>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Position:
              </label>
              <select
                value={radialPosition}
                onChange={(e) => {
                  trackFirstInteraction();
                  setRadialPosition(
                    e.target.value as (typeof RADIAL_POSITIONS)[number],
                  );
                }}
                className={inputClass}
              >
                {RADIAL_POSITIONS.map((pos) => (
                  <option key={pos} value={pos}>
                    {pos}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Color Stops */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Color Stops ({stops.length})
          </h2>
          <div className="flex gap-2">
            <button onClick={reverseStops} className={btnClass}>
              Reverse
            </button>
            <button
              onClick={addStop}
              disabled={stops.length >= 10}
              className={`${btnClass} ${stops.length >= 10 ? "opacity-40 cursor-not-allowed" : ""}`}
            >
              + Add Stop
            </button>
          </div>
        </div>

        {/* Gradient bar showing stop positions */}
        <div
          className="mb-4 h-6 w-full rounded-lg border border-gray-200 dark:border-gray-700"
          style={{ background: cssValue.replace(/\d+deg, /, "90deg, ").replace(/circle|ellipse/, "ellipse").replace(/at [^,]+,/, "at center,") }}
        />

        <div className="space-y-3">
          {[...stops]
            .sort((a, b) => a.position - b.position)
            .map((stop) => (
              <div
                key={stop.id}
                className="flex flex-wrap items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800/50"
              >
                <input
                  type="color"
                  value={stop.color}
                  onChange={(e) => updateStopColor(stop.id, e.target.value)}
                  className="h-9 w-12 cursor-pointer rounded border-0 bg-transparent p-0"
                />
                <input
                  type="text"
                  value={stop.color}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^#[0-9a-fA-F]{0,6}$/.test(val)) {
                      updateStopColor(stop.id, val);
                    }
                  }}
                  className={`${inputClass} w-24 font-mono`}
                />
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={stop.position}
                  onChange={(e) =>
                    updateStopPosition(stop.id, Number(e.target.value))
                  }
                  className="w-32 accent-indigo-600 sm:w-48"
                />
                <span className="w-10 text-sm text-gray-500 dark:text-gray-400 tabular-nums">
                  {stop.position}%
                </span>
                <button
                  onClick={() => removeStop(stop.id)}
                  disabled={stops.length <= 2}
                  className={`ml-auto rounded p-1 text-gray-400 hover:text-red-500 transition-colors ${
                    stops.length <= 2
                      ? "opacity-30 cursor-not-allowed"
                      : ""
                  }`}
                  title="Remove stop"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
        </div>
      </div>

      {/* CSS Output */}
      <div className="mb-8">
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
        <pre className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm font-mono text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 overflow-x-auto">
          {fullCSS}
        </pre>
      </div>

      {/* Presets */}
      <div className="mb-8">
        <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Presets
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {PRESETS.map((preset) => {
            const sortedStops = [...preset.stops].sort(
              (a, b) => a.position - b.position,
            );
            const stopsStr = sortedStops
              .map((s) => `${s.color} ${s.position}%`)
              .join(", ");
            const previewCSS =
              preset.type === "linear"
                ? `linear-gradient(${preset.angle}deg, ${stopsStr})`
                : `radial-gradient(circle at center, ${stopsStr})`;
            return (
              <button
                key={preset.name}
                onClick={() => applyPreset(preset)}
                className="group rounded-lg border border-gray-200 p-2 text-left transition-colors hover:border-indigo-400 dark:border-gray-700 dark:hover:border-indigo-600"
              >
                <div
                  className="mb-2 h-16 w-full rounded-md"
                  style={{ background: previewCSS }}
                />
                <span className="text-xs font-medium text-gray-600 group-hover:text-indigo-600 dark:text-gray-400 dark:group-hover:text-indigo-400">
                  {preset.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Reference */}
      <details className="rounded-lg border border-gray-200 dark:border-gray-700">
        <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
          About CSS Gradients
        </summary>
        <div className="border-t border-gray-200 px-4 py-3 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-400 space-y-2">
          <p>
            <strong className="text-gray-900 dark:text-white">
              Linear gradients
            </strong>{" "}
            transition colors along a straight line defined by an angle.
            <code className="mx-1 rounded bg-gray-100 px-1.5 py-0.5 text-xs dark:bg-gray-800">
              0deg
            </code>
            goes upward,{" "}
            <code className="mx-1 rounded bg-gray-100 px-1.5 py-0.5 text-xs dark:bg-gray-800">
              90deg
            </code>
            goes right,{" "}
            <code className="mx-1 rounded bg-gray-100 px-1.5 py-0.5 text-xs dark:bg-gray-800">
              180deg
            </code>
            goes downward.
          </p>
          <p>
            <strong className="text-gray-900 dark:text-white">
              Radial gradients
            </strong>{" "}
            radiate outward from a center point. Choose between{" "}
            <code className="mx-1 rounded bg-gray-100 px-1.5 py-0.5 text-xs dark:bg-gray-800">
              circle
            </code>
            (equal radius) and{" "}
            <code className="mx-1 rounded bg-gray-100 px-1.5 py-0.5 text-xs dark:bg-gray-800">
              ellipse
            </code>
            (stretches to fit the element).
          </p>
          <p>
            <strong className="text-gray-900 dark:text-white">
              Color stops
            </strong>{" "}
            define where each color appears along the gradient (0% = start,
            100% = end). Add more stops for complex multi-color gradients.
          </p>
        </div>
      </details>
    </div>
  );
}
