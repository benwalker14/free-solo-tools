"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";

interface Shadow {
  id: number;
  x: number;
  y: number;
  blur: number;
  spread: number;
  color: string;
  opacity: number;
  inset: boolean;
}

interface Preset {
  name: string;
  shadows: Omit<Shadow, "id">[];
}

const PRESETS: Preset[] = [
  {
    name: "Subtle",
    shadows: [
      { x: 0, y: 1, blur: 3, spread: 0, color: "#000000", opacity: 0.12, inset: false },
      { x: 0, y: 1, blur: 2, spread: -1, color: "#000000", opacity: 0.08, inset: false },
    ],
  },
  {
    name: "Medium",
    shadows: [
      { x: 0, y: 4, blur: 6, spread: -1, color: "#000000", opacity: 0.1, inset: false },
      { x: 0, y: 2, blur: 4, spread: -2, color: "#000000", opacity: 0.1, inset: false },
    ],
  },
  {
    name: "Large",
    shadows: [
      { x: 0, y: 10, blur: 15, spread: -3, color: "#000000", opacity: 0.1, inset: false },
      { x: 0, y: 4, blur: 6, spread: -4, color: "#000000", opacity: 0.1, inset: false },
    ],
  },
  {
    name: "Sharp",
    shadows: [
      { x: 4, y: 4, blur: 0, spread: 0, color: "#000000", opacity: 0.25, inset: false },
    ],
  },
  {
    name: "Dreamy",
    shadows: [
      { x: 0, y: 20, blur: 60, spread: -10, color: "#6366f1", opacity: 0.3, inset: false },
    ],
  },
  {
    name: "Layered",
    shadows: [
      { x: 0, y: 1, blur: 1, spread: 0, color: "#000000", opacity: 0.08, inset: false },
      { x: 0, y: 2, blur: 2, spread: 0, color: "#000000", opacity: 0.06, inset: false },
      { x: 0, y: 4, blur: 4, spread: 0, color: "#000000", opacity: 0.04, inset: false },
      { x: 0, y: 8, blur: 8, spread: 0, color: "#000000", opacity: 0.02, inset: false },
    ],
  },
  {
    name: "Inset",
    shadows: [
      { x: 0, y: 2, blur: 4, spread: 0, color: "#000000", opacity: 0.15, inset: true },
    ],
  },
  {
    name: "Neon",
    shadows: [
      { x: 0, y: 0, blur: 10, spread: 0, color: "#6366f1", opacity: 0.5, inset: false },
      { x: 0, y: 0, blur: 40, spread: 0, color: "#6366f1", opacity: 0.3, inset: false },
    ],
  },
];

let nextId = 2;

function hexToRgba(hex: string, opacity: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

export default function BoxShadowTool() {
  const [shadows, setShadows] = useState<Shadow[]>([
    { id: 1, x: 0, y: 4, blur: 12, spread: 0, color: "#000000", opacity: 0.15, inset: false },
  ]);
  const [activeId, setActiveId] = useState(1);
  const [boxColor, setBoxColor] = useState("#ffffff");
  const [bgColor, setBgColor] = useState("#f3f4f6");
  const [borderRadius, setBorderRadius] = useState(12);
  const [copied, setCopied] = useState(false);
  const { trackFirstInteraction } = useToolAnalytics("box-shadow");

  const buildCSS = useCallback(() => {
    return shadows
      .map((s) => {
        const rgba = hexToRgba(s.color, s.opacity);
        return `${s.inset ? "inset " : ""}${s.x}px ${s.y}px ${s.blur}px ${s.spread}px ${rgba}`;
      })
      .join(",\n    ");
  }, [shadows]);

  const cssValue = buildCSS();
  const fullCSS = `box-shadow: ${cssValue};`;

  const activeShadow = shadows.find((s) => s.id === activeId) ?? shadows[0];

  function updateShadow(id: number, updates: Partial<Omit<Shadow, "id">>) {
    trackFirstInteraction();
    setShadows(shadows.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  }

  function addShadow() {
    trackFirstInteraction();
    if (shadows.length >= 8) return;
    const newId = nextId++;
    setShadows([
      ...shadows,
      { id: newId, x: 0, y: 4, blur: 12, spread: 0, color: "#000000", opacity: 0.15, inset: false },
    ]);
    setActiveId(newId);
  }

  function removeShadow(id: number) {
    trackFirstInteraction();
    if (shadows.length <= 1) return;
    const filtered = shadows.filter((s) => s.id !== id);
    setShadows(filtered);
    if (activeId === id) setActiveId(filtered[0].id);
  }

  function duplicateShadow(id: number) {
    trackFirstInteraction();
    if (shadows.length >= 8) return;
    const source = shadows.find((s) => s.id === id);
    if (!source) return;
    const newId = nextId++;
    setShadows([...shadows, { ...source, id: newId }]);
    setActiveId(newId);
  }

  function applyPreset(preset: Preset) {
    trackFirstInteraction();
    const newShadows = preset.shadows.map((s) => ({ ...s, id: nextId++ }));
    setShadows(newShadows);
    setActiveId(newShadows[0].id);
  }

  function copyCSS() {
    navigator.clipboard.writeText(fullCSS);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const inputClass =
    "rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";
  const btnClass =
    "rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors";

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="mb-8 block text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        &larr; Back to tools
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        CSS Box Shadow Generator
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Design beautiful CSS box shadows visually. Add multiple layers, adjust
        offsets, blur, spread, and copy the CSS.
      </p>

      {/* Live Preview */}
      <div
        className="mb-8 flex h-64 items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700"
        style={{ backgroundColor: bgColor }}
      >
        <div
          className="h-32 w-48 transition-shadow duration-150"
          style={{
            backgroundColor: boxColor,
            borderRadius: `${borderRadius}px`,
            boxShadow: cssValue,
          }}
        />
      </div>

      {/* Box & Background Colors */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Box:
          </label>
          <input
            type="color"
            value={boxColor}
            onChange={(e) => { trackFirstInteraction(); setBoxColor(e.target.value); }}
            className="h-9 w-12 cursor-pointer rounded border-0 bg-transparent p-0"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Background:
          </label>
          <input
            type="color"
            value={bgColor}
            onChange={(e) => { trackFirstInteraction(); setBgColor(e.target.value); }}
            className="h-9 w-12 cursor-pointer rounded border-0 bg-transparent p-0"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Radius:
          </label>
          <input
            type="range"
            min={0}
            max={50}
            value={borderRadius}
            onChange={(e) => { trackFirstInteraction(); setBorderRadius(Number(e.target.value)); }}
            className="w-24 accent-indigo-600"
          />
          <span className="w-10 text-sm text-gray-500 dark:text-gray-400 tabular-nums">
            {borderRadius}px
          </span>
        </div>
      </div>

      {/* Shadow Layers */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Shadow Layers ({shadows.length})
          </h2>
          <button
            onClick={addShadow}
            disabled={shadows.length >= 8}
            className={`${btnClass} ${shadows.length >= 8 ? "opacity-40 cursor-not-allowed" : ""}`}
          >
            + Add Layer
          </button>
        </div>

        {/* Layer Tabs */}
        <div className="mb-4 flex flex-wrap gap-2">
          {shadows.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setActiveId(s.id)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                activeId === s.id
                  ? "border border-indigo-500 bg-indigo-50 text-indigo-700 dark:border-indigo-500 dark:bg-indigo-950 dark:text-indigo-300"
                  : "border border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
              }`}
            >
              {s.inset ? "Inset " : ""}Layer {i + 1}
            </button>
          ))}
        </div>

        {/* Active Layer Controls */}
        {activeShadow && (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50 space-y-4">
            {/* X Offset */}
            <div className="flex flex-wrap items-center gap-3">
              <label className="w-20 text-sm font-medium text-gray-700 dark:text-gray-300">
                X Offset
              </label>
              <input
                type="range"
                min={-50}
                max={50}
                value={activeShadow.x}
                onChange={(e) => updateShadow(activeShadow.id, { x: Number(e.target.value) })}
                className="w-40 accent-indigo-600 sm:w-56"
              />
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min={-100}
                  max={100}
                  value={activeShadow.x}
                  onChange={(e) => updateShadow(activeShadow.id, { x: Number(e.target.value) || 0 })}
                  className={`${inputClass} w-20`}
                />
                <span className="text-sm text-gray-500 dark:text-gray-400">px</span>
              </div>
            </div>

            {/* Y Offset */}
            <div className="flex flex-wrap items-center gap-3">
              <label className="w-20 text-sm font-medium text-gray-700 dark:text-gray-300">
                Y Offset
              </label>
              <input
                type="range"
                min={-50}
                max={50}
                value={activeShadow.y}
                onChange={(e) => updateShadow(activeShadow.id, { y: Number(e.target.value) })}
                className="w-40 accent-indigo-600 sm:w-56"
              />
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min={-100}
                  max={100}
                  value={activeShadow.y}
                  onChange={(e) => updateShadow(activeShadow.id, { y: Number(e.target.value) || 0 })}
                  className={`${inputClass} w-20`}
                />
                <span className="text-sm text-gray-500 dark:text-gray-400">px</span>
              </div>
            </div>

            {/* Blur */}
            <div className="flex flex-wrap items-center gap-3">
              <label className="w-20 text-sm font-medium text-gray-700 dark:text-gray-300">
                Blur
              </label>
              <input
                type="range"
                min={0}
                max={100}
                value={activeShadow.blur}
                onChange={(e) => updateShadow(activeShadow.id, { blur: Number(e.target.value) })}
                className="w-40 accent-indigo-600 sm:w-56"
              />
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min={0}
                  max={200}
                  value={activeShadow.blur}
                  onChange={(e) => updateShadow(activeShadow.id, { blur: Math.max(0, Number(e.target.value) || 0) })}
                  className={`${inputClass} w-20`}
                />
                <span className="text-sm text-gray-500 dark:text-gray-400">px</span>
              </div>
            </div>

            {/* Spread */}
            <div className="flex flex-wrap items-center gap-3">
              <label className="w-20 text-sm font-medium text-gray-700 dark:text-gray-300">
                Spread
              </label>
              <input
                type="range"
                min={-50}
                max={50}
                value={activeShadow.spread}
                onChange={(e) => updateShadow(activeShadow.id, { spread: Number(e.target.value) })}
                className="w-40 accent-indigo-600 sm:w-56"
              />
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min={-100}
                  max={100}
                  value={activeShadow.spread}
                  onChange={(e) => updateShadow(activeShadow.id, { spread: Number(e.target.value) || 0 })}
                  className={`${inputClass} w-20`}
                />
                <span className="text-sm text-gray-500 dark:text-gray-400">px</span>
              </div>
            </div>

            {/* Color & Opacity */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Color
                </label>
                <input
                  type="color"
                  value={activeShadow.color}
                  onChange={(e) => updateShadow(activeShadow.id, { color: e.target.value })}
                  className="h-9 w-12 cursor-pointer rounded border-0 bg-transparent p-0"
                />
                <input
                  type="text"
                  value={activeShadow.color}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^#[0-9a-fA-F]{0,6}$/.test(val)) {
                      updateShadow(activeShadow.id, { color: val });
                    }
                  }}
                  className={`${inputClass} w-24 font-mono`}
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Opacity
                </label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={Math.round(activeShadow.opacity * 100)}
                  onChange={(e) => updateShadow(activeShadow.id, { opacity: Number(e.target.value) / 100 })}
                  className="w-24 accent-indigo-600"
                />
                <span className="w-10 text-sm text-gray-500 dark:text-gray-400 tabular-nums">
                  {Math.round(activeShadow.opacity * 100)}%
                </span>
              </div>
            </div>

            {/* Inset + Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={() => updateShadow(activeShadow.id, { inset: !activeShadow.inset })}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  activeShadow.inset
                    ? "border border-indigo-500 bg-indigo-50 text-indigo-700 dark:border-indigo-500 dark:bg-indigo-950 dark:text-indigo-300"
                    : "border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                }`}
              >
                Inset
              </button>
              <button
                onClick={() => duplicateShadow(activeShadow.id)}
                disabled={shadows.length >= 8}
                className={`${btnClass} ${shadows.length >= 8 ? "opacity-40 cursor-not-allowed" : ""}`}
              >
                Duplicate
              </button>
              <button
                onClick={() => removeShadow(activeShadow.id)}
                disabled={shadows.length <= 1}
                className={`rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950 transition-colors ${
                  shadows.length <= 1 ? "opacity-40 cursor-not-allowed" : ""
                }`}
              >
                Remove
              </button>
            </div>
          </div>
        )}
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
        <pre className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm font-mono text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 overflow-x-auto whitespace-pre-wrap">
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
            const previewShadow = preset.shadows
              .map((s) => {
                const rgba = hexToRgba(s.color, s.opacity);
                return `${s.inset ? "inset " : ""}${s.x}px ${s.y}px ${s.blur}px ${s.spread}px ${rgba}`;
              })
              .join(", ");
            return (
              <button
                key={preset.name}
                onClick={() => applyPreset(preset)}
                className="group rounded-lg border border-gray-200 p-3 text-left transition-colors hover:border-indigo-400 dark:border-gray-700 dark:hover:border-indigo-600"
              >
                <div className="mb-2 flex h-16 items-center justify-center rounded-md bg-gray-100 dark:bg-gray-800">
                  <div
                    className="h-8 w-12 rounded-md bg-white dark:bg-gray-200"
                    style={{ boxShadow: previewShadow }}
                  />
                </div>
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
          About CSS Box Shadows
        </summary>
        <div className="border-t border-gray-200 px-4 py-3 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-400 space-y-2">
          <p>
            The{" "}
            <code className="mx-1 rounded bg-gray-100 px-1.5 py-0.5 text-xs dark:bg-gray-800">
              box-shadow
            </code>{" "}
            property adds shadow effects around an element. The syntax is:{" "}
            <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs dark:bg-gray-800">
              x-offset y-offset blur spread color
            </code>.
          </p>
          <p>
            <strong className="text-gray-900 dark:text-white">
              Offsets (X/Y)
            </strong>{" "}
            control the shadow&apos;s position. Positive X moves right, positive Y moves down.
            Negative values move left and up.
          </p>
          <p>
            <strong className="text-gray-900 dark:text-white">Blur</strong>{" "}
            softens the shadow edges. Higher values create a more diffused shadow.
            A value of 0 creates a sharp shadow.
          </p>
          <p>
            <strong className="text-gray-900 dark:text-white">Spread</strong>{" "}
            expands or contracts the shadow. Positive values make the shadow larger,
            negative values make it smaller than the element.
          </p>
          <p>
            <strong className="text-gray-900 dark:text-white">Inset</strong>{" "}
            changes the shadow from outer to inner, creating a pressed/recessed
            effect.
          </p>
          <p>
            <strong className="text-gray-900 dark:text-white">
              Multiple shadows
            </strong>{" "}
            can be stacked for realistic depth. Layer subtle shadows for a natural
            look — this mimics how light creates multiple soft edges in the real world.
          </p>
        </div>
      </details>
    </div>
  );
}
