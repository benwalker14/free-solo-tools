"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";

type ShapeType = "circle" | "ellipse" | "inset" | "polygon";

interface Point {
  x: number;
  y: number;
}

interface PolygonPreset {
  name: string;
  points: Point[];
}

const POLYGON_PRESETS: PolygonPreset[] = [
  {
    name: "Triangle",
    points: [
      { x: 50, y: 0 },
      { x: 0, y: 100 },
      { x: 100, y: 100 },
    ],
  },
  {
    name: "Diamond",
    points: [
      { x: 50, y: 0 },
      { x: 100, y: 50 },
      { x: 50, y: 100 },
      { x: 0, y: 50 },
    ],
  },
  {
    name: "Pentagon",
    points: [
      { x: 50, y: 0 },
      { x: 100, y: 38 },
      { x: 82, y: 100 },
      { x: 18, y: 100 },
      { x: 0, y: 38 },
    ],
  },
  {
    name: "Hexagon",
    points: [
      { x: 25, y: 0 },
      { x: 75, y: 0 },
      { x: 100, y: 50 },
      { x: 75, y: 100 },
      { x: 25, y: 100 },
      { x: 0, y: 50 },
    ],
  },
  {
    name: "Octagon",
    points: [
      { x: 30, y: 0 },
      { x: 70, y: 0 },
      { x: 100, y: 30 },
      { x: 100, y: 70 },
      { x: 70, y: 100 },
      { x: 30, y: 100 },
      { x: 0, y: 70 },
      { x: 0, y: 30 },
    ],
  },
  {
    name: "Star",
    points: [
      { x: 50, y: 0 },
      { x: 61, y: 35 },
      { x: 98, y: 35 },
      { x: 68, y: 57 },
      { x: 79, y: 91 },
      { x: 50, y: 70 },
      { x: 21, y: 91 },
      { x: 32, y: 57 },
      { x: 2, y: 35 },
      { x: 39, y: 35 },
    ],
  },
  {
    name: "Arrow Right",
    points: [
      { x: 0, y: 20 },
      { x: 60, y: 20 },
      { x: 60, y: 0 },
      { x: 100, y: 50 },
      { x: 60, y: 100 },
      { x: 60, y: 80 },
      { x: 0, y: 80 },
    ],
  },
  {
    name: "Arrow Left",
    points: [
      { x: 40, y: 0 },
      { x: 40, y: 20 },
      { x: 100, y: 20 },
      { x: 100, y: 80 },
      { x: 40, y: 80 },
      { x: 40, y: 100 },
      { x: 0, y: 50 },
    ],
  },
  {
    name: "Cross",
    points: [
      { x: 35, y: 0 },
      { x: 65, y: 0 },
      { x: 65, y: 35 },
      { x: 100, y: 35 },
      { x: 100, y: 65 },
      { x: 65, y: 65 },
      { x: 65, y: 100 },
      { x: 35, y: 100 },
      { x: 35, y: 65 },
      { x: 0, y: 65 },
      { x: 0, y: 35 },
      { x: 35, y: 35 },
    ],
  },
  {
    name: "Chevron",
    points: [
      { x: 0, y: 0 },
      { x: 75, y: 0 },
      { x: 100, y: 50 },
      { x: 75, y: 100 },
      { x: 0, y: 100 },
      { x: 25, y: 50 },
    ],
  },
  {
    name: "Trapezoid",
    points: [
      { x: 20, y: 0 },
      { x: 80, y: 0 },
      { x: 100, y: 100 },
      { x: 0, y: 100 },
    ],
  },
  {
    name: "Parallelogram",
    points: [
      { x: 25, y: 0 },
      { x: 100, y: 0 },
      { x: 75, y: 100 },
      { x: 0, y: 100 },
    ],
  },
  {
    name: "Message",
    points: [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 75 },
      { x: 75, y: 75 },
      { x: 75, y: 100 },
      { x: 50, y: 75 },
      { x: 0, y: 75 },
    ],
  },
];

function SliderControl({
  label,
  value,
  onChange,
  min,
  max,
  unit,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  unit: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="text-xs text-gray-400">{label}</label>
        <span className="text-xs text-gray-500">
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 w-full accent-indigo-500"
      />
    </div>
  );
}

export default function ClipPathTool() {
  const [shape, setShape] = useState<ShapeType>("polygon");
  const [copied, setCopied] = useState(false);
  const { trackFirstInteraction } = useToolAnalytics("clip-path");

  // Circle state
  const [circleRadius, setCircleRadius] = useState(50);
  const [circleCx, setCircleCx] = useState(50);
  const [circleCy, setCircleCy] = useState(50);

  // Ellipse state
  const [ellipseRx, setEllipseRx] = useState(50);
  const [ellipseRy, setEllipseRy] = useState(35);
  const [ellipseCx, setEllipseCx] = useState(50);
  const [ellipseCy, setEllipseCy] = useState(50);

  // Inset state
  const [insetTop, setInsetTop] = useState(10);
  const [insetRight, setInsetRight] = useState(10);
  const [insetBottom, setInsetBottom] = useState(10);
  const [insetLeft, setInsetLeft] = useState(10);
  const [insetRound, setInsetRound] = useState(0);

  // Polygon state
  const [points, setPoints] = useState<Point[]>([
    { x: 50, y: 0 },
    { x: 0, y: 100 },
    { x: 100, y: 100 },
  ]);

  // Preview colors
  const [previewColor, setPreviewColor] = useState("#6366f1");
  const [bgColor, setBgColor] = useState("#1f2937");

  // Drag state
  const [dragging, setDragging] = useState<number | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const buildClipPath = useCallback((): string => {
    switch (shape) {
      case "circle":
        return `circle(${circleRadius}% at ${circleCx}% ${circleCy}%)`;
      case "ellipse":
        return `ellipse(${ellipseRx}% ${ellipseRy}% at ${ellipseCx}% ${ellipseCy}%)`;
      case "inset": {
        const roundStr = insetRound > 0 ? ` round ${insetRound}px` : "";
        return `inset(${insetTop}% ${insetRight}% ${insetBottom}% ${insetLeft}%${roundStr})`;
      }
      case "polygon":
        return `polygon(${points.map((p) => `${p.x}% ${p.y}%`).join(", ")})`;
    }
  }, [
    shape,
    circleRadius,
    circleCx,
    circleCy,
    ellipseRx,
    ellipseRy,
    ellipseCx,
    ellipseCy,
    insetTop,
    insetRight,
    insetBottom,
    insetLeft,
    insetRound,
    points,
  ]);

  const clipPath = buildClipPath();
  const cssOutput = `clip-path: ${clipPath};`;
  const webkitCssOutput = `-webkit-clip-path: ${clipPath};\nclip-path: ${clipPath};`;

  const copyCSS = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, []);

  useKeyboardShortcut("Enter", () => copyCSS(cssOutput), { ctrl: true });

  // Polygon point dragging
  const handlePointerDown = useCallback(
    (index: number, e: React.PointerEvent) => {
      e.preventDefault();
      trackFirstInteraction();
      setDragging(index);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [trackFirstInteraction],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (dragging === null || !previewRef.current) return;
      const rect = previewRef.current.getBoundingClientRect();
      const x = Math.max(
        0,
        Math.min(100, ((e.clientX - rect.left) / rect.width) * 100),
      );
      const y = Math.max(
        0,
        Math.min(100, ((e.clientY - rect.top) / rect.height) * 100),
      );
      setPoints((prev) => {
        const next = [...prev];
        next[dragging] = {
          x: Math.round(x * 10) / 10,
          y: Math.round(y * 10) / 10,
        };
        return next;
      });
    },
    [dragging],
  );

  const handlePointerUp = useCallback(() => {
    setDragging(null);
  }, []);

  const addPoint = useCallback(() => {
    trackFirstInteraction();
    setPoints((prev) => {
      if (prev.length >= 20) return prev;
      const last = prev[prev.length - 1];
      const first = prev[0];
      return [
        ...prev,
        {
          x: Math.round(((last.x + first.x) / 2) * 10) / 10,
          y: Math.round(((last.y + first.y) / 2) * 10) / 10,
        },
      ];
    });
  }, [trackFirstInteraction]);

  const removePoint = useCallback(
    (index: number) => {
      trackFirstInteraction();
      setPoints((prev) =>
        prev.length > 3 ? prev.filter((_, i) => i !== index) : prev,
      );
    },
    [trackFirstInteraction],
  );

  const applyPreset = useCallback(
    (preset: PolygonPreset) => {
      trackFirstInteraction();
      setShape("polygon");
      setPoints(preset.points.map((p) => ({ ...p })));
    },
    [trackFirstInteraction],
  );

  return (
    <main className="min-h-screen bg-gray-950 py-8 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <Link href="/" className="text-sm text-gray-400 hover:text-white">
            &larr; Back to Tools
          </Link>
        </div>

        <h1 className="mb-2 text-3xl font-bold text-white">
          CSS Clip-path Generator
        </h1>
        <p className="mb-8 text-gray-400">
          Create CSS clip-path shapes visually &mdash; circle, ellipse, inset,
          or polygon with draggable points. Copy production-ready CSS.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Controls */}
          <div className="space-y-6">
            {/* Shape selector */}
            <div className="rounded-lg bg-gray-900 p-4">
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Shape Type
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(
                  ["circle", "ellipse", "inset", "polygon"] as ShapeType[]
                ).map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setShape(s);
                      trackFirstInteraction();
                    }}
                    className={`rounded-md px-3 py-2 text-sm font-medium capitalize transition-colors ${
                      shape === s
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Circle controls */}
            {shape === "circle" && (
              <div className="rounded-lg bg-gray-900 p-4 space-y-4">
                <h3 className="text-sm font-medium text-gray-300">
                  Circle Settings
                </h3>
                <SliderControl
                  label="Radius"
                  value={circleRadius}
                  onChange={(v) => {
                    setCircleRadius(v);
                    trackFirstInteraction();
                  }}
                  min={0}
                  max={100}
                  unit="%"
                />
                <SliderControl
                  label="Position X"
                  value={circleCx}
                  onChange={(v) => {
                    setCircleCx(v);
                    trackFirstInteraction();
                  }}
                  min={0}
                  max={100}
                  unit="%"
                />
                <SliderControl
                  label="Position Y"
                  value={circleCy}
                  onChange={(v) => {
                    setCircleCy(v);
                    trackFirstInteraction();
                  }}
                  min={0}
                  max={100}
                  unit="%"
                />
              </div>
            )}

            {/* Ellipse controls */}
            {shape === "ellipse" && (
              <div className="rounded-lg bg-gray-900 p-4 space-y-4">
                <h3 className="text-sm font-medium text-gray-300">
                  Ellipse Settings
                </h3>
                <SliderControl
                  label="Radius X"
                  value={ellipseRx}
                  onChange={(v) => {
                    setEllipseRx(v);
                    trackFirstInteraction();
                  }}
                  min={0}
                  max={100}
                  unit="%"
                />
                <SliderControl
                  label="Radius Y"
                  value={ellipseRy}
                  onChange={(v) => {
                    setEllipseRy(v);
                    trackFirstInteraction();
                  }}
                  min={0}
                  max={100}
                  unit="%"
                />
                <SliderControl
                  label="Position X"
                  value={ellipseCx}
                  onChange={(v) => {
                    setEllipseCx(v);
                    trackFirstInteraction();
                  }}
                  min={0}
                  max={100}
                  unit="%"
                />
                <SliderControl
                  label="Position Y"
                  value={ellipseCy}
                  onChange={(v) => {
                    setEllipseCy(v);
                    trackFirstInteraction();
                  }}
                  min={0}
                  max={100}
                  unit="%"
                />
              </div>
            )}

            {/* Inset controls */}
            {shape === "inset" && (
              <div className="rounded-lg bg-gray-900 p-4 space-y-4">
                <h3 className="text-sm font-medium text-gray-300">
                  Inset Settings
                </h3>
                <SliderControl
                  label="Top"
                  value={insetTop}
                  onChange={(v) => {
                    setInsetTop(v);
                    trackFirstInteraction();
                  }}
                  min={0}
                  max={50}
                  unit="%"
                />
                <SliderControl
                  label="Right"
                  value={insetRight}
                  onChange={(v) => {
                    setInsetRight(v);
                    trackFirstInteraction();
                  }}
                  min={0}
                  max={50}
                  unit="%"
                />
                <SliderControl
                  label="Bottom"
                  value={insetBottom}
                  onChange={(v) => {
                    setInsetBottom(v);
                    trackFirstInteraction();
                  }}
                  min={0}
                  max={50}
                  unit="%"
                />
                <SliderControl
                  label="Left"
                  value={insetLeft}
                  onChange={(v) => {
                    setInsetLeft(v);
                    trackFirstInteraction();
                  }}
                  min={0}
                  max={50}
                  unit="%"
                />
                <SliderControl
                  label="Border Radius"
                  value={insetRound}
                  onChange={(v) => {
                    setInsetRound(v);
                    trackFirstInteraction();
                  }}
                  min={0}
                  max={100}
                  unit="px"
                />
              </div>
            )}

            {/* Polygon point editor */}
            {shape === "polygon" && (
              <div className="rounded-lg bg-gray-900 p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-300">
                    Polygon Points ({points.length})
                  </h3>
                  <button
                    onClick={addPoint}
                    disabled={points.length >= 20}
                    className="rounded-md bg-indigo-600 px-3 py-1 text-xs font-medium text-white hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    + Add Point
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  Drag points on the preview or edit values below.
                </p>
                <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                  {points.map((pt, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-5 text-xs text-gray-500 shrink-0">
                        {i + 1}
                      </span>
                      <input
                        type="number"
                        value={pt.x}
                        onChange={(e) => {
                          trackFirstInteraction();
                          const val = Math.max(
                            0,
                            Math.min(100, Number(e.target.value)),
                          );
                          setPoints((prev) => {
                            const next = [...prev];
                            next[i] = { ...next[i], x: val };
                            return next;
                          });
                        }}
                        className="w-20 rounded bg-gray-800 px-2 py-1 text-sm text-white border border-gray-700 focus:border-indigo-500 focus:outline-none"
                        min={0}
                        max={100}
                        step={0.1}
                      />
                      <span className="text-xs text-gray-500">%</span>
                      <input
                        type="number"
                        value={pt.y}
                        onChange={(e) => {
                          trackFirstInteraction();
                          const val = Math.max(
                            0,
                            Math.min(100, Number(e.target.value)),
                          );
                          setPoints((prev) => {
                            const next = [...prev];
                            next[i] = { ...next[i], y: val };
                            return next;
                          });
                        }}
                        className="w-20 rounded bg-gray-800 px-2 py-1 text-sm text-white border border-gray-700 focus:border-indigo-500 focus:outline-none"
                        min={0}
                        max={100}
                        step={0.1}
                      />
                      <span className="text-xs text-gray-500">%</span>
                      <button
                        onClick={() => removePoint(i)}
                        disabled={points.length <= 3}
                        className="ml-auto text-gray-500 hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Remove point"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Polygon presets */}
            {shape === "polygon" && (
              <div className="rounded-lg bg-gray-900 p-4">
                <h3 className="mb-3 text-sm font-medium text-gray-300">
                  Shape Presets
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {POLYGON_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => applyPreset(preset)}
                      className="rounded-md bg-gray-800 px-2 py-2 text-xs text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Preview colors */}
            <div className="rounded-lg bg-gray-900 p-4">
              <h3 className="mb-3 text-sm font-medium text-gray-300">
                Preview Colors
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs text-gray-500">
                    Shape
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={previewColor}
                      onChange={(e) => setPreviewColor(e.target.value)}
                      className="h-8 w-8 cursor-pointer rounded border border-gray-700 bg-transparent"
                    />
                    <span className="text-sm text-gray-400">
                      {previewColor}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs text-gray-500">
                    Background
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="h-8 w-8 cursor-pointer rounded border border-gray-700 bg-transparent"
                    />
                    <span className="text-sm text-gray-400">{bgColor}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Preview + Output */}
          <div className="space-y-6">
            {/* Visual preview */}
            <div className="rounded-lg bg-gray-900 p-4">
              <h3 className="mb-3 text-sm font-medium text-gray-300">
                Preview
              </h3>
              <div
                ref={previewRef}
                className="relative mx-auto aspect-square w-full max-w-[400px] rounded-lg overflow-hidden select-none touch-none"
                style={{ backgroundColor: bgColor }}
                onPointerMove={
                  shape === "polygon" ? handlePointerMove : undefined
                }
                onPointerUp={shape === "polygon" ? handlePointerUp : undefined}
                onPointerLeave={
                  shape === "polygon" ? handlePointerUp : undefined
                }
              >
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundColor: previewColor,
                    clipPath: clipPath,
                    WebkitClipPath: clipPath,
                  }}
                />

                {/* Polygon drag handles */}
                {shape === "polygon" &&
                  points.map((pt, i) => (
                    <div
                      key={i}
                      className={`absolute z-10 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white cursor-grab transition-transform ${
                        dragging === i
                          ? "bg-indigo-400 scale-125"
                          : "bg-indigo-600 hover:scale-110"
                      }`}
                      style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
                      onPointerDown={(e) => handlePointerDown(i, e)}
                    />
                  ))}

                {/* Circle/Ellipse center indicator */}
                {(shape === "circle" || shape === "ellipse") && (
                  <div
                    className="absolute z-10 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/60 bg-indigo-600/60"
                    style={{
                      left: `${shape === "circle" ? circleCx : ellipseCx}%`,
                      top: `${shape === "circle" ? circleCy : ellipseCy}%`,
                    }}
                  />
                )}
              </div>
            </div>

            {/* CSS output */}
            <div className="rounded-lg bg-gray-900 p-4">
              <h3 className="mb-3 text-sm font-medium text-gray-300">
                CSS Output
              </h3>
              <div className="rounded-md bg-gray-950 p-4 font-mono text-sm text-emerald-400 break-all">
                <code>{cssOutput}</code>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => copyCSS(cssOutput)}
                  className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
                >
                  {copied ? "Copied!" : "Copy CSS"}
                </button>
                <button
                  onClick={() => copyCSS(webkitCssOutput)}
                  className="rounded-md bg-gray-800 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                >
                  Copy with -webkit-
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-600">
                Ctrl+Enter to copy CSS
              </p>
            </div>

            {/* Clip-path reference */}
            <div className="rounded-lg bg-gray-900 p-4">
              <h3 className="mb-3 text-sm font-medium text-gray-300">
                Clip-path Reference
              </h3>
              <div className="space-y-2 text-sm text-gray-400">
                <div>
                  <code className="text-indigo-400">
                    circle(r at cx cy)
                  </code>{" "}
                  &mdash; circular clip
                </div>
                <div>
                  <code className="text-indigo-400">
                    ellipse(rx ry at cx cy)
                  </code>{" "}
                  &mdash; elliptical clip
                </div>
                <div>
                  <code className="text-indigo-400">
                    inset(t r b l round br)
                  </code>{" "}
                  &mdash; rectangular clip with optional rounding
                </div>
                <div>
                  <code className="text-indigo-400">
                    polygon(x1 y1, x2 y2, ...)
                  </code>{" "}
                  &mdash; arbitrary polygon with unlimited vertices
                </div>
              </div>
              <p className="mt-3 text-xs text-gray-500">
                Supported in all modern browsers. Use{" "}
                <code className="text-gray-400">-webkit-clip-path</code> for
                older Safari versions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
