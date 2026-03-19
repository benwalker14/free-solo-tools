"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";

/* ------------------------------------------------------------------ */
/*  Types & Constants                                                  */
/* ------------------------------------------------------------------ */

interface Preset {
  label: string;
  w: number;
  h: number;
  desc: string;
}

const PRESETS: Preset[] = [
  { label: "16:9", w: 16, h: 9, desc: "Widescreen / YouTube / HD" },
  { label: "4:3", w: 4, h: 3, desc: "Classic TV / iPad" },
  { label: "1:1", w: 1, h: 1, desc: "Square / Instagram" },
  { label: "3:2", w: 3, h: 2, desc: "Photography / DSLR" },
  { label: "21:9", w: 21, h: 9, desc: "Ultrawide / Cinema" },
  { label: "9:16", w: 9, h: 16, desc: "Vertical / Stories / Reels" },
  { label: "5:4", w: 5, h: 4, desc: "8×10 print / Medium format" },
  { label: "2:1", w: 2, h: 1, desc: "Univisium / 18:9 phone" },
  { label: "4:5", w: 4, h: 5, desc: "Instagram Portrait" },
  { label: "2.39:1", w: 239, h: 100, desc: "Anamorphic / Scope" },
];

interface DevicePreset {
  name: string;
  w: number;
  h: number;
  category: string;
}

const DEVICE_PRESETS: DevicePreset[] = [
  { name: "iPhone 15 Pro", w: 1179, h: 2556, category: "Phone" },
  { name: "iPhone 15", w: 1170, h: 2532, category: "Phone" },
  { name: "Samsung Galaxy S24", w: 1080, h: 2340, category: "Phone" },
  { name: "Google Pixel 8", w: 1080, h: 2400, category: "Phone" },
  { name: 'iPad Pro 12.9"', w: 2048, h: 2732, category: "Tablet" },
  { name: "iPad Air", w: 1640, h: 2360, category: "Tablet" },
  { name: "iPad Mini", w: 1488, h: 2266, category: "Tablet" },
  { name: 'MacBook Air 13"', w: 2560, h: 1664, category: "Laptop" },
  { name: 'MacBook Pro 16"', w: 3456, h: 2234, category: "Laptop" },
  { name: "Full HD (1080p)", w: 1920, h: 1080, category: "Monitor" },
  { name: "2K (1440p)", w: 2560, h: 1440, category: "Monitor" },
  { name: "4K UHD", w: 3840, h: 2160, category: "Monitor" },
  { name: "5K (iMac)", w: 5120, h: 2880, category: "Monitor" },
  { name: "Ultrawide WQHD", w: 3440, h: 1440, category: "Monitor" },
  { name: "YouTube Thumbnail", w: 1280, h: 720, category: "Social" },
  { name: "Twitter/X Post", w: 1200, h: 675, category: "Social" },
  { name: "OG Image", w: 1200, h: 630, category: "Social" },
  { name: "Instagram Post", w: 1080, h: 1080, category: "Social" },
  { name: "Instagram Story", w: 1080, h: 1920, category: "Social" },
  { name: "Facebook Cover", w: 1200, h: 628, category: "Social" },
];

/* ------------------------------------------------------------------ */
/*  Math helpers                                                       */
/* ------------------------------------------------------------------ */

function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
}

function simplify(w: number, h: number): [number, number] {
  if (!w || !h) return [0, 0];
  const d = gcd(w, h);
  return [w / d, h / d];
}

function formatRatio(w: number, h: number): string {
  const [sw, sh] = simplify(w, h);
  if (!sw || !sh) return "—";
  if (sw <= 100 && sh <= 100) return `${sw}:${sh}`;
  const decimal = w / h;
  return `${decimal.toFixed(2)}:1`;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

type Tab = "calculator" | "resize" | "devices";

export default function AspectRatioCalculatorTool() {
  useToolAnalytics("aspect-ratio-calculator");

  /* --- calculator tab state --- */
  const [width, setWidth] = useState("1920");
  const [height, setHeight] = useState("1080");

  /* --- resize tab state --- */
  const [origW, setOrigW] = useState("1920");
  const [origH, setOrigH] = useState("1080");
  const [targetW, setTargetW] = useState("1280");
  const [targetH, setTargetH] = useState("");
  const [lockField, setLockField] = useState<"w" | "h">("w");

  /* --- devices tab state --- */
  const [deviceFilter, setDeviceFilter] = useState("All");

  /* --- shared --- */
  const [tab, setTab] = useState<Tab>("calculator");

  /* ---------- calculator results ---------- */
  const w = parseFloat(width) || 0;
  const h = parseFloat(height) || 0;
  const ratio = useMemo(() => formatRatio(w, h), [w, h]);
  const decimal = w && h ? (w / h).toFixed(4) : "—";
  const [simW, simH] = useMemo(() => simplify(w, h), [w, h]);

  const commonSizes = useMemo(() => {
    if (!simW || !simH) return [];
    const widths = [320, 480, 640, 768, 960, 1024, 1280, 1440, 1600, 1920, 2560, 3840];
    return widths.map((tw) => ({
      w: tw,
      h: Math.round((tw * simH) / simW),
    }));
  }, [simW, simH]);

  /* ---------- resize results ---------- */
  const oW = parseFloat(origW) || 0;
  const oH = parseFloat(origH) || 0;

  const resizedResult = useMemo(() => {
    if (!oW || !oH) return null;
    if (lockField === "w") {
      const tw = parseFloat(targetW);
      if (!tw) return null;
      return { w: tw, h: Math.round((tw * oH) / oW) };
    } else {
      const th = parseFloat(targetH);
      if (!th) return null;
      return { w: Math.round((th * oW) / oH), h: th };
    }
  }, [oW, oH, targetW, targetH, lockField]);

  /* ---------- device tab ---------- */
  const categories = useMemo(() => {
    const cats = new Set(DEVICE_PRESETS.map((d) => d.category));
    return ["All", ...Array.from(cats)];
  }, []);

  const filteredDevices = useMemo(
    () =>
      deviceFilter === "All"
        ? DEVICE_PRESETS
        : DEVICE_PRESETS.filter((d) => d.category === deviceFilter),
    [deviceFilter],
  );

  /* ---------- handlers ---------- */
  const applyPreset = useCallback((p: Preset) => {
    setWidth(String(p.w));
    setHeight(String(p.h));
    setTab("calculator");
  }, []);

  const applyDevice = useCallback((d: DevicePreset) => {
    setWidth(String(d.w));
    setHeight(String(d.h));
    setTab("calculator");
  }, []);

  const swapDimensions = useCallback(() => {
    setWidth(height);
    setHeight(width);
  }, [width, height]);

  const copyCSS = useCallback(() => {
    if (!simW || !simH) return;
    navigator.clipboard.writeText(`aspect-ratio: ${simW} / ${simH};`);
  }, [simW, simH]);

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {/* Navigation */}
        <div className="mb-6 flex items-center gap-3 text-sm text-gray-400">
          <Link href="/" className="hover:text-gray-200">
            Home
          </Link>
          <span>/</span>
          <span className="text-gray-200">Aspect Ratio Calculator</span>
        </div>

        {/* Title */}
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-lg text-blue-400">
              ⊞
            </div>
            <h1 className="text-2xl font-bold sm:text-3xl">
              Aspect Ratio Calculator
            </h1>
          </div>
          <p className="text-gray-400">
            Calculate, convert, and resize aspect ratios for images, video, and
            responsive design.
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-1 rounded-lg bg-gray-800 p-1">
          {(
            [
              ["calculator", "Calculate Ratio"],
              ["resize", "Resize / Scale"],
              ["devices", "Device Presets"],
            ] as const
          ).map(([t, label]) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition ${
                tab === t
                  ? "bg-gray-700 text-gray-100 shadow"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* =================== Calculator Tab =================== */}
        {tab === "calculator" && (
          <div className="space-y-6">
            {/* Input */}
            <div className="rounded-lg border border-gray-800 bg-gray-900 p-5">
              <h3 className="mb-4 text-sm font-semibold text-gray-300">
                Enter Dimensions
              </h3>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="mb-1 block text-xs text-gray-400">Width</label>
                  <input
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2.5 text-center text-lg font-mono text-gray-100 focus:border-blue-500 focus:outline-none"
                    min={0}
                  />
                </div>
                <button
                  onClick={swapDimensions}
                  className="mt-4 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm hover:bg-gray-700"
                  title="Swap width and height"
                >
                  ⇄
                </button>
                <div className="flex-1">
                  <label className="mb-1 block text-xs text-gray-400">Height</label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2.5 text-center text-lg font-mono text-gray-100 focus:border-blue-500 focus:outline-none"
                    min={0}
                  />
                </div>
              </div>
            </div>

            {/* Results */}
            {w > 0 && h > 0 && (
              <div className="rounded-lg border border-gray-800 bg-gray-900 p-5">
                <h3 className="mb-4 text-sm font-semibold text-gray-300">
                  Result
                </h3>

                {/* Big ratio display */}
                <div className="mb-4 flex items-center justify-center gap-6 rounded-lg bg-gray-800/50 py-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-100">{ratio}</div>
                    <div className="mt-1 text-xs text-gray-400">Aspect Ratio</div>
                  </div>
                  <div className="h-12 w-px bg-gray-700" />
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-100">{decimal}</div>
                    <div className="mt-1 text-xs text-gray-400">Decimal</div>
                  </div>
                </div>

                {/* Visual preview */}
                <div className="mb-4 flex items-center justify-center">
                  <div
                    className="flex items-center justify-center rounded border-2 border-blue-500 bg-blue-950/40 text-xs font-medium text-blue-300"
                    style={{
                      width: `${Math.min(240, Math.max(60, (240 * Math.min(w / h, 3)) / 3))}px`,
                      height: `${Math.min(240, Math.max(60, (240 * Math.min(h / w, 3)) / 3))}px`,
                    }}
                  >
                    {w} × {h}
                  </div>
                </div>

                {/* CSS aspect-ratio */}
                <div className="flex items-center justify-between rounded-lg bg-gray-800/50 px-4 py-2.5">
                  <code className="text-sm text-gray-300">
                    aspect-ratio: {simW} / {simH};
                  </code>
                  <button
                    onClick={copyCSS}
                    className="rounded px-2 py-1 text-xs text-blue-400 hover:bg-blue-900/30"
                  >
                    Copy
                  </button>
                </div>
              </div>
            )}

            {/* Presets */}
            <div className="rounded-lg border border-gray-800 bg-gray-900 p-5">
              <h3 className="mb-3 text-sm font-semibold text-gray-300">
                Common Aspect Ratios
              </h3>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                {PRESETS.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => applyPreset(p)}
                    className={`rounded-lg border px-3 py-2.5 text-left transition hover:border-blue-500 hover:bg-blue-900/20 ${
                      ratio === p.label
                        ? "border-blue-500 bg-blue-900/20"
                        : "border-gray-700 bg-gray-800"
                    }`}
                  >
                    <div className="text-sm font-semibold text-gray-100">
                      {p.label}
                    </div>
                    <div className="text-xs text-gray-400">{p.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Common sizes table */}
            {commonSizes.length > 0 && (
              <div className="rounded-lg border border-gray-800 bg-gray-900 p-5">
                <h3 className="mb-3 text-sm font-semibold text-gray-300">
                  Equivalent Sizes at {ratio}
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-400">
                          Width
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-400">
                          Height
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-400">
                          Pixels
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-400">
                          Label
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {commonSizes.map((s) => {
                        const mp = ((s.w * s.h) / 1_000_000).toFixed(1);
                        const label =
                          s.w === 1920 && s.h === 1080
                            ? "1080p / Full HD"
                            : s.w === 2560 && s.h === 1440
                              ? "1440p / 2K"
                              : s.w === 3840 && s.h === 2160
                                ? "2160p / 4K UHD"
                                : s.w === 1280 && s.h === 720
                                  ? "720p / HD"
                                  : s.w === 640 && s.h === 480
                                    ? "VGA"
                                    : "";
                        return (
                          <tr
                            key={s.w}
                            className="border-b border-gray-800"
                          >
                            <td className="px-3 py-2 font-mono text-gray-100">
                              {s.w}
                            </td>
                            <td className="px-3 py-2 font-mono text-gray-100">
                              {s.h}
                            </td>
                            <td className="px-3 py-2 text-gray-400">
                              {mp} MP
                            </td>
                            <td className="px-3 py-2 text-gray-400">{label}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =================== Resize Tab =================== */}
        {tab === "resize" && (
          <div className="space-y-6">
            <div className="rounded-lg border border-gray-800 bg-gray-900 p-5">
              <h3 className="mb-4 text-sm font-semibold text-gray-300">
                Original Dimensions
              </h3>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="mb-1 block text-xs text-gray-400">Width</label>
                  <input
                    type="number"
                    value={origW}
                    onChange={(e) => setOrigW(e.target.value)}
                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2.5 text-center font-mono text-gray-100 focus:border-blue-500 focus:outline-none"
                    min={0}
                  />
                </div>
                <div className="flex-1">
                  <label className="mb-1 block text-xs text-gray-400">Height</label>
                  <input
                    type="number"
                    value={origH}
                    onChange={(e) => setOrigH(e.target.value)}
                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2.5 text-center font-mono text-gray-100 focus:border-blue-500 focus:outline-none"
                    min={0}
                  />
                </div>
              </div>
              {oW > 0 && oH > 0 && (
                <div className="mt-2 text-xs text-gray-400">
                  Ratio: <span className="font-medium">{formatRatio(oW, oH)}</span>
                </div>
              )}
            </div>

            <div className="rounded-lg border border-gray-800 bg-gray-900 p-5">
              <h3 className="mb-4 text-sm font-semibold text-gray-300">
                Target Dimension
              </h3>
              <div className="mb-3 flex flex-wrap gap-2">
                <button
                  onClick={() => setLockField("w")}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                    lockField === "w"
                      ? "bg-blue-900/30 text-blue-300"
                      : "bg-gray-800 text-gray-400"
                  }`}
                >
                  Set Width → Calculate Height
                </button>
                <button
                  onClick={() => setLockField("h")}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                    lockField === "h"
                      ? "bg-blue-900/30 text-blue-300"
                      : "bg-gray-800 text-gray-400"
                  }`}
                >
                  Set Height → Calculate Width
                </button>
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="mb-1 block text-xs text-gray-400">
                    Target Width
                  </label>
                  <input
                    type="number"
                    value={lockField === "w" ? targetW : resizedResult ? String(resizedResult.w) : ""}
                    onChange={lockField === "w" ? (e) => setTargetW(e.target.value) : undefined}
                    readOnly={lockField !== "w"}
                    className={`w-full rounded-lg border px-3 py-2.5 text-center font-mono focus:outline-none ${
                      lockField === "w"
                        ? "border-gray-700 bg-gray-800 text-gray-100 focus:border-blue-500"
                        : "border-gray-800 bg-gray-850 text-gray-500"
                    }`}
                    min={0}
                  />
                </div>
                <div className="flex-1">
                  <label className="mb-1 block text-xs text-gray-400">
                    Target Height
                  </label>
                  <input
                    type="number"
                    value={lockField === "h" ? targetH : resizedResult ? String(resizedResult.h) : ""}
                    onChange={lockField === "h" ? (e) => setTargetH(e.target.value) : undefined}
                    readOnly={lockField !== "h"}
                    className={`w-full rounded-lg border px-3 py-2.5 text-center font-mono focus:outline-none ${
                      lockField === "h"
                        ? "border-gray-700 bg-gray-800 text-gray-100 focus:border-blue-500"
                        : "border-gray-800 bg-gray-850 text-gray-500"
                    }`}
                    min={0}
                  />
                </div>
              </div>
            </div>

            {resizedResult && (
              <div className="rounded-lg border border-emerald-800 bg-emerald-950/30 p-4">
                <div className="flex items-center gap-3">
                  <div className="text-lg font-bold text-emerald-200">
                    {resizedResult.w} × {resizedResult.h}
                  </div>
                  <span className="text-sm text-emerald-400">
                    ({formatRatio(resizedResult.w, resizedResult.h)} — same ratio preserved)
                  </span>
                </div>
                <div className="mt-1 text-xs text-emerald-400">
                  {((resizedResult.w * resizedResult.h) / 1_000_000).toFixed(2)} megapixels •{" "}
                  Scale factor: {(resizedResult.w / oW).toFixed(2)}×
                </div>
              </div>
            )}
          </div>
        )}

        {/* =================== Devices Tab =================== */}
        {tab === "devices" && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setDeviceFilter(cat)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                    deviceFilter === cat
                      ? "bg-blue-900/30 text-blue-300"
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-800">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700 bg-gray-900">
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-400">
                      Device
                    </th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-400">
                      Width
                    </th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-400">
                      Height
                    </th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-400">
                      Ratio
                    </th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-400">
                      Category
                    </th>
                    <th className="px-4 py-2.5" />
                  </tr>
                </thead>
                <tbody>
                  {filteredDevices.map((d) => (
                    <tr
                      key={d.name}
                      className="border-b border-gray-800"
                    >
                      <td className="px-4 py-2.5 font-medium text-gray-100">
                        {d.name}
                      </td>
                      <td className="px-4 py-2.5 font-mono text-gray-300">
                        {d.w}
                      </td>
                      <td className="px-4 py-2.5 font-mono text-gray-300">
                        {d.h}
                      </td>
                      <td className="px-4 py-2.5 text-gray-400">
                        {formatRatio(d.w, d.h)}
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="rounded-full bg-gray-800 px-2 py-0.5 text-xs text-gray-400">
                          {d.category}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        <button
                          onClick={() => applyDevice(d)}
                          className="text-xs text-blue-400 hover:underline"
                        >
                          Use
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
