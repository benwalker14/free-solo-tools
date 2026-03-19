"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";

interface FilterState {
  blur: number;
  brightness: number;
  contrast: number;
  grayscale: number;
  hueRotate: number;
  invert: number;
  opacity: number;
  saturate: number;
  sepia: number;
  dropShadowEnabled: boolean;
  dropShadowX: number;
  dropShadowY: number;
  dropShadowBlur: number;
  dropShadowColor: string;
}

interface FilterConfig {
  key: keyof FilterState;
  label: string;
  unit: string;
  min: number;
  max: number;
  defaultValue: number;
  step: number;
  cssFunc: string;
}

const FILTERS: FilterConfig[] = [
  { key: "blur", label: "Blur", unit: "px", min: 0, max: 20, defaultValue: 0, step: 0.1, cssFunc: "blur" },
  { key: "brightness", label: "Brightness", unit: "%", min: 0, max: 300, defaultValue: 100, step: 1, cssFunc: "brightness" },
  { key: "contrast", label: "Contrast", unit: "%", min: 0, max: 300, defaultValue: 100, step: 1, cssFunc: "contrast" },
  { key: "grayscale", label: "Grayscale", unit: "%", min: 0, max: 100, defaultValue: 0, step: 1, cssFunc: "grayscale" },
  { key: "hueRotate", label: "Hue Rotate", unit: "deg", min: 0, max: 360, defaultValue: 0, step: 1, cssFunc: "hue-rotate" },
  { key: "invert", label: "Invert", unit: "%", min: 0, max: 100, defaultValue: 0, step: 1, cssFunc: "invert" },
  { key: "opacity", label: "Opacity", unit: "%", min: 0, max: 100, defaultValue: 100, step: 1, cssFunc: "opacity" },
  { key: "saturate", label: "Saturate", unit: "%", min: 0, max: 300, defaultValue: 100, step: 1, cssFunc: "saturate" },
  { key: "sepia", label: "Sepia", unit: "%", min: 0, max: 100, defaultValue: 0, step: 1, cssFunc: "sepia" },
];

const DEFAULT_STATE: FilterState = {
  blur: 0,
  brightness: 100,
  contrast: 100,
  grayscale: 0,
  hueRotate: 0,
  invert: 0,
  opacity: 100,
  saturate: 100,
  sepia: 0,
  dropShadowEnabled: false,
  dropShadowX: 4,
  dropShadowY: 4,
  dropShadowBlur: 8,
  dropShadowColor: "#000000",
};

interface Preset {
  name: string;
  state: Partial<FilterState>;
}

const PRESETS: Preset[] = [
  { name: "None", state: {} },
  { name: "Vintage", state: { sepia: 40, contrast: 110, brightness: 95, saturate: 80 } },
  { name: "B&W", state: { grayscale: 100, contrast: 120 } },
  { name: "Warm", state: { sepia: 20, saturate: 130, brightness: 105 } },
  { name: "Cool", state: { hueRotate: 180, saturate: 70, brightness: 95 } },
  { name: "Dramatic", state: { contrast: 150, brightness: 90, saturate: 130 } },
  { name: "Faded", state: { contrast: 80, brightness: 110, saturate: 70, sepia: 15 } },
  { name: "Vivid", state: { saturate: 200, contrast: 120, brightness: 105 } },
  { name: "Nightvision", state: { brightness: 150, contrast: 130, hueRotate: 90, saturate: 200 } },
  { name: "X-Ray", state: { invert: 100, contrast: 130, brightness: 110 } },
  { name: "Duotone", state: { grayscale: 100, sepia: 100, saturate: 200, hueRotate: 160 } },
  { name: "Dreamy", state: { blur: 1, brightness: 115, contrast: 90, saturate: 120, sepia: 10 } },
];

export default function CssFilterTool() {
  useToolAnalytics("css-filter");

  const [filters, setFilters] = useState<FilterState>({ ...DEFAULT_STATE });
  const [copied, setCopied] = useState(false);
  const [activePreset, setActivePreset] = useState("None");

  const updateFilter = useCallback((key: keyof FilterState, value: number | boolean | string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setActivePreset("");
  }, []);

  const resetFilter = useCallback((key: keyof FilterState) => {
    setFilters((prev) => ({ ...prev, [key]: DEFAULT_STATE[key] }));
    setActivePreset("");
  }, []);

  const resetAll = useCallback(() => {
    setFilters({ ...DEFAULT_STATE });
    setActivePreset("None");
  }, []);

  const applyPreset = useCallback((preset: Preset) => {
    setFilters({ ...DEFAULT_STATE, ...preset.state });
    setActivePreset(preset.name);
  }, []);

  const filterString = useMemo(() => {
    const parts: string[] = [];
    for (const f of FILTERS) {
      const value = filters[f.key] as number;
      if (value !== f.defaultValue) {
        if (f.key === "blur") {
          parts.push(`${f.cssFunc}(${value}px)`);
        } else if (f.key === "hueRotate") {
          parts.push(`${f.cssFunc}(${value}deg)`);
        } else {
          parts.push(`${f.cssFunc}(${value}%)`);
        }
      }
    }
    if (filters.dropShadowEnabled) {
      parts.push(
        `drop-shadow(${filters.dropShadowX}px ${filters.dropShadowY}px ${filters.dropShadowBlur}px ${filters.dropShadowColor})`
      );
    }
    return parts.length > 0 ? parts.join(" ") : "none";
  }, [filters]);

  const cssOutput = useMemo(() => {
    return `filter: ${filterString};`;
  }, [filterString]);

  const copyCSS = useCallback(() => {
    navigator.clipboard.writeText(cssOutput).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [cssOutput]);

  useKeyboardShortcut("Enter", copyCSS, { ctrl: true });

  const isModified = filterString !== "none";
  const activeCount = FILTERS.filter((f) => (filters[f.key] as number) !== f.defaultValue).length +
    (filters.dropShadowEnabled ? 1 : 0);

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href="/"
            className="text-sm text-gray-400 hover:text-emerald-400 transition-colors"
          >
            ← Back to Tools
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            CSS Filter Generator
          </h1>
          <p className="text-gray-400">
            Build CSS filter effects visually — blur, brightness, contrast,
            grayscale, hue-rotate, invert, opacity, saturate, sepia, and
            drop-shadow. Preview in real time and copy production-ready CSS.
          </p>
        </div>

        {/* Presets */}
        <div className="mb-6">
          <h2 className="text-sm font-medium text-gray-400 mb-2">Presets</h2>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => applyPreset(preset)}
                className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                  activePreset === preset.name
                    ? "border-emerald-500 bg-emerald-500/20 text-emerald-300"
                    : "border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-600"
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Controls */}
          <div className="space-y-4">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Filters</h2>
                <div className="flex items-center gap-3">
                  {activeCount > 0 && (
                    <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
                      {activeCount} active
                    </span>
                  )}
                  <button
                    onClick={resetAll}
                    className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    Reset All
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {FILTERS.map((f) => {
                  const value = filters[f.key] as number;
                  const isActive = value !== f.defaultValue;
                  return (
                    <div key={f.key}>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-sm text-gray-300 font-medium">
                          {f.label}
                        </label>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-sm font-mono ${
                              isActive ? "text-emerald-400" : "text-gray-500"
                            }`}
                          >
                            {f.key === "blur" ? value.toFixed(1) : value}
                            {f.unit}
                          </span>
                          {isActive && (
                            <button
                              onClick={() => resetFilter(f.key)}
                              className="text-gray-600 hover:text-gray-400 text-xs"
                              title="Reset"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      </div>
                      <input
                        type="range"
                        min={f.min}
                        max={f.max}
                        step={f.step}
                        value={value}
                        onChange={(e) =>
                          updateFilter(f.key, parseFloat(e.target.value))
                        }
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Drop Shadow */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">
                  Drop Shadow
                </h2>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.dropShadowEnabled}
                    onChange={(e) =>
                      updateFilter("dropShadowEnabled", e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-gray-400 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600 peer-checked:after:bg-white" />
                </label>
              </div>

              {filters.dropShadowEnabled && (
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-sm text-gray-300">Offset X</label>
                      <span className="text-sm font-mono text-gray-500">
                        {filters.dropShadowX}px
                      </span>
                    </div>
                    <input
                      type="range"
                      min={-20}
                      max={20}
                      step={1}
                      value={filters.dropShadowX}
                      onChange={(e) =>
                        updateFilter("dropShadowX", parseInt(e.target.value))
                      }
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-sm text-gray-300">Offset Y</label>
                      <span className="text-sm font-mono text-gray-500">
                        {filters.dropShadowY}px
                      </span>
                    </div>
                    <input
                      type="range"
                      min={-20}
                      max={20}
                      step={1}
                      value={filters.dropShadowY}
                      onChange={(e) =>
                        updateFilter("dropShadowY", parseInt(e.target.value))
                      }
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-sm text-gray-300">Blur</label>
                      <span className="text-sm font-mono text-gray-500">
                        {filters.dropShadowBlur}px
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={30}
                      step={1}
                      value={filters.dropShadowBlur}
                      onChange={(e) =>
                        updateFilter(
                          "dropShadowBlur",
                          parseInt(e.target.value)
                        )
                      }
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-sm text-gray-300">Color</label>
                      <span className="text-sm font-mono text-gray-500">
                        {filters.dropShadowColor}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={filters.dropShadowColor}
                        onChange={(e) =>
                          updateFilter("dropShadowColor", e.target.value)
                        }
                        className="w-8 h-8 rounded cursor-pointer border border-gray-700 bg-transparent"
                      />
                      <input
                        type="text"
                        value={filters.dropShadowColor}
                        onChange={(e) =>
                          updateFilter("dropShadowColor", e.target.value)
                        }
                        className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm font-mono text-gray-300"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Preview + Output */}
          <div className="space-y-4">
            {/* Preview */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <h2 className="text-lg font-semibold text-white mb-3">
                Preview
              </h2>
              <div className="bg-gray-800 rounded-lg p-4 flex items-center justify-center min-h-[300px]">
                <div
                  className="w-full max-w-[280px] aspect-square rounded-lg overflow-hidden"
                  style={{ filter: filterString }}
                >
                  <div
                    className="w-full h-full"
                    style={{
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f97316 50%, #10b981 75%, #3b82f6 100%)",
                    }}
                  >
                    <svg
                      viewBox="0 0 280 280"
                      className="w-full h-full"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {/* Mountain scene */}
                      <rect
                        x="0"
                        y="0"
                        width="280"
                        height="280"
                        fill="url(#sky)"
                      />
                      <defs>
                        <linearGradient
                          id="sky"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop offset="0%" stopColor="#1e40af" />
                          <stop offset="60%" stopColor="#7dd3fc" />
                          <stop offset="100%" stopColor="#86efac" />
                        </linearGradient>
                      </defs>
                      {/* Sun */}
                      <circle cx="210" cy="60" r="30" fill="#fbbf24" />
                      {/* Mountains */}
                      <polygon
                        points="0,200 60,100 120,200"
                        fill="#4b5563"
                      />
                      <polygon
                        points="80,200 160,80 240,200"
                        fill="#374151"
                      />
                      <polygon
                        points="160,200 230,120 280,200"
                        fill="#4b5563"
                      />
                      {/* Snow caps */}
                      <polygon
                        points="145,90 160,80 175,90 165,100 155,100"
                        fill="#e5e7eb"
                      />
                      <polygon
                        points="52,110 60,100 68,110"
                        fill="#e5e7eb"
                      />
                      {/* Ground */}
                      <rect
                        x="0"
                        y="200"
                        width="280"
                        height="80"
                        fill="#16a34a"
                      />
                      {/* Trees */}
                      <polygon
                        points="30,200 40,160 50,200"
                        fill="#15803d"
                      />
                      <polygon
                        points="250,200 260,170 270,200"
                        fill="#15803d"
                      />
                      {/* Water */}
                      <ellipse
                        cx="140"
                        cy="240"
                        rx="50"
                        ry="15"
                        fill="#38bdf8"
                        opacity="0.6"
                      />
                      {/* Cloud */}
                      <g opacity="0.9">
                        <circle cx="70" cy="50" r="15" fill="white" />
                        <circle cx="85" cy="45" r="18" fill="white" />
                        <circle cx="100" cy="50" r="15" fill="white" />
                      </g>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* CSS Output */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-white">
                  CSS Output
                </h2>
                <button
                  onClick={copyCSS}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    copied
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  {copied ? "Copied!" : "Copy CSS"}
                </button>
              </div>
              <pre className="bg-gray-950 border border-gray-800 rounded-lg p-4 text-sm font-mono text-emerald-300 overflow-x-auto whitespace-pre-wrap break-all">
                {cssOutput}
              </pre>
              <p className="text-xs text-gray-500 mt-2">
                Ctrl+Enter to copy
              </p>
            </div>

            {/* Filter Reference */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <h2 className="text-lg font-semibold text-white mb-3">
                Filter Reference
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-400 border-b border-gray-800">
                      <th className="pb-2 pr-4">Function</th>
                      <th className="pb-2 pr-4">Range</th>
                      <th className="pb-2">Default</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-300">
                    {FILTERS.map((f) => (
                      <tr key={f.key} className="border-b border-gray-800/50">
                        <td className="py-1.5 pr-4 font-mono text-emerald-400">
                          {f.cssFunc}()
                        </td>
                        <td className="py-1.5 pr-4">
                          {f.min}–{f.max}
                          {f.unit}
                        </td>
                        <td className="py-1.5">
                          {f.defaultValue}
                          {f.unit}
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td className="py-1.5 pr-4 font-mono text-emerald-400">
                        drop-shadow()
                      </td>
                      <td className="py-1.5 pr-4">x y blur color</td>
                      <td className="py-1.5">—</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Active filters summary */}
            {isModified && (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <h2 className="text-lg font-semibold text-white mb-2">
                  Active Filters
                </h2>
                <div className="flex flex-wrap gap-2">
                  {FILTERS.filter(
                    (f) => (filters[f.key] as number) !== f.defaultValue
                  ).map((f) => (
                    <span
                      key={f.key}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded text-xs text-emerald-300"
                    >
                      {f.label}: {f.key === "blur" ? (filters[f.key] as number).toFixed(1) : filters[f.key] as number}
                      {f.unit}
                      <button
                        onClick={() => resetFilter(f.key)}
                        className="hover:text-white ml-1"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                  {filters.dropShadowEnabled && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded text-xs text-emerald-300">
                      drop-shadow
                      <button
                        onClick={() =>
                          updateFilter("dropShadowEnabled", false)
                        }
                        className="hover:text-white ml-1"
                      >
                        ✕
                      </button>
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
