"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";

type CssUnit = "px" | "rem" | "em" | "pt" | "vw" | "vh" | "%";

interface ConversionSettings {
  baseFontSize: number;
  parentFontSize: number;
  viewportWidth: number;
  viewportHeight: number;
  parentWidth: number;
}

const UNITS: CssUnit[] = ["px", "rem", "em", "pt", "vw", "vh", "%"];

const UNIT_LABELS: Record<CssUnit, string> = {
  px: "Pixels (px)",
  rem: "Root EM (rem)",
  em: "EM (em)",
  pt: "Points (pt)",
  vw: "Viewport Width (vw)",
  vh: "Viewport Height (vh)",
  "%": "Percent (%)",
};

function toPx(
  value: number,
  unit: CssUnit,
  settings: ConversionSettings
): number {
  switch (unit) {
    case "px":
      return value;
    case "rem":
      return value * settings.baseFontSize;
    case "em":
      return value * settings.parentFontSize;
    case "pt":
      return value * (96 / 72);
    case "vw":
      return (value / 100) * settings.viewportWidth;
    case "vh":
      return (value / 100) * settings.viewportHeight;
    case "%":
      return (value / 100) * settings.parentWidth;
    default:
      return value;
  }
}

function fromPx(
  px: number,
  unit: CssUnit,
  settings: ConversionSettings
): number {
  switch (unit) {
    case "px":
      return px;
    case "rem":
      return px / settings.baseFontSize;
    case "em":
      return px / settings.parentFontSize;
    case "pt":
      return px / (96 / 72);
    case "vw":
      return (px / settings.viewportWidth) * 100;
    case "vh":
      return (px / settings.viewportHeight) * 100;
    case "%":
      return (px / settings.parentWidth) * 100;
    default:
      return px;
  }
}

function formatNumber(n: number): string {
  if (Number.isNaN(n) || !Number.isFinite(n)) return "—";
  const rounded = Math.round(n * 10000) / 10000;
  return String(rounded);
}

const REFERENCE_PX = [4, 8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72, 80, 96, 128];

export default function CssUnitConverterTool() {
  const [inputValue, setInputValue] = useState("16");
  const [fromUnit, setFromUnit] = useState<CssUnit>("px");
  const [toUnit, setToUnit] = useState<CssUnit>("rem");
  const [settings, setSettings] = useState<ConversionSettings>({
    baseFontSize: 16,
    parentFontSize: 16,
    viewportWidth: 1920,
    viewportHeight: 1080,
    parentWidth: 1920,
  });
  const [batchInput, setBatchInput] = useState("");
  const [batchFromUnit, setBatchFromUnit] = useState<CssUnit>("px");
  const [batchToUnit, setBatchToUnit] = useState<CssUnit>("rem");
  const [showSettings, setShowSettings] = useState(false);
  const [copied, setCopied] = useState("");
  const { trackFirstInteraction } = useToolAnalytics("css-unit-converter");

  const numericValue = parseFloat(inputValue);
  const pxValue = Number.isNaN(numericValue)
    ? NaN
    : toPx(numericValue, fromUnit, settings);
  const result = Number.isNaN(pxValue)
    ? "—"
    : formatNumber(fromPx(pxValue, toUnit, settings));

  const handleSwap = useCallback(() => {
    trackFirstInteraction();
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  }, [fromUnit, toUnit, trackFirstInteraction]);

  const copyText = useCallback(
    (text: string, label: string) => {
      navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(""), 1500);
    },
    []
  );

  const batchConvert = useCallback(() => {
    trackFirstInteraction();
    const lines = batchInput.split("\n");
    return lines
      .map((line) => {
        const regex = new RegExp(
          `(-?[\\d.]+)\\s*${batchFromUnit.replace("%", "\\%")}`,
          "gi"
        );
        return line.replace(regex, (_match, numStr: string) => {
          const num = parseFloat(numStr);
          if (Number.isNaN(num)) return _match;
          const px = toPx(num, batchFromUnit, settings);
          const converted = fromPx(px, batchToUnit, settings);
          return `${formatNumber(converted)}${batchToUnit}`;
        });
      })
      .join("\n");
  }, [batchInput, batchFromUnit, batchToUnit, settings, trackFirstInteraction]);

  const batchResult = batchInput ? batchConvert() : "";

  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";
  const selectClass =
    "rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";
  const btnSecondaryClass =
    "rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors";

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="mb-8 block text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        &larr; Back to tools
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        CSS Unit Converter
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Convert between px, rem, em, pt, vw, vh, and % with configurable base
        sizes.
      </p>

      {/* Single value converter */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Value
            </label>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => {
                trackFirstInteraction();
                setInputValue(e.target.value);
              }}
              className={inputClass}
              placeholder="Enter value"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  copyText(`${result}${toUnit}`, "result");
                }
              }}
            />
          </div>
          <div className="w-full sm:w-40">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              From
            </label>
            <select
              value={fromUnit}
              onChange={(e) => {
                trackFirstInteraction();
                setFromUnit(e.target.value as CssUnit);
              }}
              className={`${selectClass} w-full`}
            >
              {UNITS.map((u) => (
                <option key={u} value={u}>
                  {UNIT_LABELS[u]}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleSwap}
            className={`${btnSecondaryClass} self-end`}
            title="Swap units"
          >
            ⇄
          </button>
          <div className="w-full sm:w-40">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              To
            </label>
            <select
              value={toUnit}
              onChange={(e) => {
                trackFirstInteraction();
                setToUnit(e.target.value as CssUnit);
              }}
              className={`${selectClass} w-full`}
            >
              {UNITS.map((u) => (
                <option key={u} value={u}>
                  {UNIT_LABELS[u]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Result */}
        <div className="mt-6 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Result
              </span>
              <p className="text-2xl font-mono font-bold text-gray-900 dark:text-white">
                {result}
                <span className="text-lg text-gray-500 dark:text-gray-400 ml-1">
                  {toUnit}
                </span>
              </p>
              {!Number.isNaN(pxValue) && toUnit !== "px" && fromUnit !== "px" && (
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  = {formatNumber(pxValue)}px
                </p>
              )}
            </div>
            <button
              onClick={() => copyText(`${result}${toUnit}`, "result")}
              className={btnSecondaryClass}
            >
              {copied === "result" ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        {/* All units */}
        {!Number.isNaN(pxValue) && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {UNITS.filter((u) => u !== fromUnit).map((u) => {
              const val = formatNumber(fromPx(pxValue, u, settings));
              return (
                <button
                  key={u}
                  onClick={() => copyText(`${val}${u}`, u)}
                  className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-left hover:border-indigo-300 hover:bg-indigo-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-indigo-600 dark:hover:bg-gray-750 transition-colors"
                >
                  <span className="text-xs text-gray-500 dark:text-gray-400 block">
                    {u}
                  </span>
                  <span className="text-sm font-mono font-medium text-gray-900 dark:text-white">
                    {val}
                    {u}
                  </span>
                  {copied === u && (
                    <span className="text-xs text-indigo-600 dark:text-indigo-400 ml-2">
                      Copied!
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Settings panel */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 mb-6">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="w-full flex items-center justify-between p-4 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rounded-xl"
        >
          <span>Conversion Settings</span>
          <span className="text-gray-400">{showSettings ? "▲" : "▼"}</span>
        </button>
        {showSettings && (
          <div className="border-t border-gray-200 dark:border-gray-700 p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Root font size (for rem)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={settings.baseFontSize}
                  min={1}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      baseFontSize: Math.max(1, Number(e.target.value) || 16),
                    })
                  }
                  className={inputClass}
                />
                <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                  px
                </span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Parent font size (for em)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={settings.parentFontSize}
                  min={1}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      parentFontSize: Math.max(1, Number(e.target.value) || 16),
                    })
                  }
                  className={inputClass}
                />
                <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                  px
                </span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Viewport width (for vw)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={settings.viewportWidth}
                  min={1}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      viewportWidth: Math.max(
                        1,
                        Number(e.target.value) || 1920
                      ),
                    })
                  }
                  className={inputClass}
                />
                <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                  px
                </span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Viewport height (for vh)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={settings.viewportHeight}
                  min={1}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      viewportHeight: Math.max(
                        1,
                        Number(e.target.value) || 1080
                      ),
                    })
                  }
                  className={inputClass}
                />
                <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                  px
                </span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Parent width (for %)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={settings.parentWidth}
                  min={1}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      parentWidth: Math.max(1, Number(e.target.value) || 1920),
                    })
                  }
                  className={inputClass}
                />
                <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                  px
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Batch converter */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          Batch Converter
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Paste CSS and replace all unit values at once.
        </p>
        <div className="flex items-center gap-3 mb-3">
          <label className="text-sm text-gray-600 dark:text-gray-400">
            Replace
          </label>
          <select
            value={batchFromUnit}
            onChange={(e) => setBatchFromUnit(e.target.value as CssUnit)}
            className={selectClass}
          >
            {UNITS.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-600 dark:text-gray-400">with</span>
          <select
            value={batchToUnit}
            onChange={(e) => setBatchToUnit(e.target.value as CssUnit)}
            className={selectClass}
          >
            {UNITS.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Input CSS
            </label>
            <textarea
              value={batchInput}
              onChange={(e) => setBatchInput(e.target.value)}
              rows={8}
              className={`${inputClass} font-mono text-xs`}
              placeholder={`.container {\n  padding: 16px;\n  margin: 24px;\n  font-size: 14px;\n  gap: 8px;\n}`}
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Output
              </label>
              {batchResult && (
                <button
                  onClick={() => copyText(batchResult, "batch")}
                  className={btnSecondaryClass}
                >
                  {copied === "batch" ? "Copied!" : "Copy"}
                </button>
              )}
            </div>
            <textarea
              value={batchResult}
              readOnly
              rows={8}
              className={`${inputClass} font-mono text-xs bg-gray-50 dark:bg-gray-800`}
              placeholder="Converted CSS will appear here..."
            />
          </div>
        </div>
      </div>

      {/* Reference table */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          px ↔ rem Reference Table
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Base font size: {settings.baseFontSize}px
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="py-2 px-3 text-left font-medium text-gray-700 dark:text-gray-300">
                  px
                </th>
                <th className="py-2 px-3 text-left font-medium text-gray-700 dark:text-gray-300">
                  rem
                </th>
                <th className="py-2 px-3 text-left font-medium text-gray-700 dark:text-gray-300">
                  em
                </th>
                <th className="py-2 px-3 text-left font-medium text-gray-700 dark:text-gray-300">
                  pt
                </th>
              </tr>
            </thead>
            <tbody>
              {REFERENCE_PX.map((px) => (
                <tr
                  key={px}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="py-2 px-3 font-mono text-gray-900 dark:text-white">
                    {px}px
                  </td>
                  <td className="py-2 px-3 font-mono text-gray-900 dark:text-white">
                    {formatNumber(fromPx(px, "rem", settings))}rem
                  </td>
                  <td className="py-2 px-3 font-mono text-gray-900 dark:text-white">
                    {formatNumber(fromPx(px, "em", settings))}em
                  </td>
                  <td className="py-2 px-3 font-mono text-gray-900 dark:text-white">
                    {formatNumber(fromPx(px, "pt", settings))}pt
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Keyboard shortcut hint */}
      <p className="mt-4 text-center text-xs text-gray-400 dark:text-gray-500">
        Press <kbd className="rounded border border-gray-300 px-1 py-0.5 text-xs dark:border-gray-600">Enter</kbd> to copy result
      </p>
    </div>
  );
}
