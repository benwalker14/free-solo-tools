"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";

interface GridItem {
  id: number;
  label: string;
  colSpan: number;
  rowSpan: number;
  colStart: string;
  rowStart: string;
  justifySelf: string;
  alignSelf: string;
}

interface GridContainerProps {
  columns: string;
  rows: string;
  gap: number;
  rowGap: number;
  columnGap: number;
  useUniformGap: boolean;
  justifyItems: string;
  alignItems: string;
  justifyContent: string;
  alignContent: string;
  autoFlow: string;
  autoColumns: string;
  autoRows: string;
}

interface Preset {
  name: string;
  description: string;
  container: Partial<GridContainerProps>;
  items: Omit<GridItem, "id" | "label">[];
}

const ITEM_COLORS = [
  "bg-indigo-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-cyan-500",
  "bg-violet-500",
  "bg-orange-500",
  "bg-teal-500",
  "bg-pink-500",
  "bg-blue-500",
  "bg-lime-500",
  "bg-fuchsia-500",
];

const JUSTIFY_ITEMS_OPTIONS = ["stretch", "start", "end", "center"];
const ALIGN_ITEMS_OPTIONS = ["stretch", "start", "end", "center"];
const JUSTIFY_CONTENT_OPTIONS = ["start", "end", "center", "stretch", "space-between", "space-around", "space-evenly"];
const ALIGN_CONTENT_OPTIONS = ["start", "end", "center", "stretch", "space-between", "space-around", "space-evenly"];
const AUTO_FLOW_OPTIONS = ["row", "column", "row dense", "column dense"];
const JUSTIFY_SELF_OPTIONS = ["auto", "stretch", "start", "end", "center"];
const ALIGN_SELF_OPTIONS = ["auto", "stretch", "start", "end", "center"];

const DEFAULT_CONTAINER: GridContainerProps = {
  columns: "1fr 1fr 1fr",
  rows: "auto",
  gap: 12,
  rowGap: 12,
  columnGap: 12,
  useUniformGap: true,
  justifyItems: "stretch",
  alignItems: "stretch",
  justifyContent: "start",
  alignContent: "start",
  autoFlow: "row",
  autoColumns: "auto",
  autoRows: "auto",
};

const DEFAULT_ITEM: Omit<GridItem, "id" | "label"> = {
  colSpan: 1,
  rowSpan: 1,
  colStart: "auto",
  rowStart: "auto",
  justifySelf: "auto",
  alignSelf: "auto",
};

const PRESETS: Preset[] = [
  {
    name: "Basic 3-Column",
    description: "Equal-width three column layout",
    container: { columns: "1fr 1fr 1fr", rows: "auto", gap: 16 },
    items: Array.from({ length: 6 }, () => ({ ...DEFAULT_ITEM })),
  },
  {
    name: "Sidebar Layout",
    description: "Fixed sidebar with fluid content",
    container: { columns: "250px 1fr", rows: "auto auto", gap: 0, rowGap: 0, columnGap: 0, useUniformGap: true },
    items: [
      { ...DEFAULT_ITEM, rowSpan: 2 },
      { ...DEFAULT_ITEM },
      { ...DEFAULT_ITEM },
    ],
  },
  {
    name: "Holy Grail",
    description: "Header, 3-col body, footer",
    container: { columns: "200px 1fr 200px", rows: "auto 1fr auto", gap: 8 },
    items: [
      { ...DEFAULT_ITEM, colSpan: 3 },
      { ...DEFAULT_ITEM },
      { ...DEFAULT_ITEM },
      { ...DEFAULT_ITEM },
      { ...DEFAULT_ITEM, colSpan: 3 },
    ],
  },
  {
    name: "Dashboard",
    description: "Mixed-size card grid",
    container: { columns: "1fr 1fr 1fr 1fr", rows: "auto auto", gap: 12 },
    items: [
      { ...DEFAULT_ITEM, colSpan: 2 },
      { ...DEFAULT_ITEM },
      { ...DEFAULT_ITEM },
      { ...DEFAULT_ITEM },
      { ...DEFAULT_ITEM, colSpan: 2 },
      { ...DEFAULT_ITEM },
    ],
  },
  {
    name: "Gallery",
    description: "Auto-fill responsive grid",
    container: { columns: "repeat(auto-fill, minmax(150px, 1fr))", rows: "auto", gap: 12 },
    items: Array.from({ length: 8 }, () => ({ ...DEFAULT_ITEM })),
  },
  {
    name: "Feature Grid",
    description: "Large hero with smaller items",
    container: { columns: "1fr 1fr", rows: "auto auto", gap: 12 },
    items: [
      { ...DEFAULT_ITEM, colSpan: 1, rowSpan: 2 },
      { ...DEFAULT_ITEM },
      { ...DEFAULT_ITEM },
    ],
  },
];

let nextId = 7;

export default function GridGeneratorTool() {
  const [container, setContainer] = useState<GridContainerProps>({ ...DEFAULT_CONTAINER });
  const [items, setItems] = useState<GridItem[]>([
    { id: 1, label: "1", ...DEFAULT_ITEM },
    { id: 2, label: "2", ...DEFAULT_ITEM },
    { id: 3, label: "3", ...DEFAULT_ITEM },
    { id: 4, label: "4", ...DEFAULT_ITEM },
    { id: 5, label: "5", ...DEFAULT_ITEM },
    { id: 6, label: "6", ...DEFAULT_ITEM },
  ]);
  const [activeItemId, setActiveItemId] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { trackFirstInteraction } = useToolAnalytics("grid-generator");

  const updateContainer = useCallback(
    (updates: Partial<GridContainerProps>) => {
      trackFirstInteraction();
      setContainer((prev) => {
        const next = { ...prev, ...updates };
        if ("gap" in updates && prev.useUniformGap) {
          next.rowGap = updates.gap ?? prev.gap;
          next.columnGap = updates.gap ?? prev.gap;
        }
        return next;
      });
    },
    [trackFirstInteraction]
  );

  const updateItem = useCallback(
    (id: number, updates: Partial<Omit<GridItem, "id" | "label">>) => {
      trackFirstInteraction();
      setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));
    },
    [trackFirstInteraction]
  );

  function addItem() {
    trackFirstInteraction();
    if (items.length >= 12) return;
    const newId = nextId++;
    setItems([...items, { id: newId, label: String(items.length + 1), ...DEFAULT_ITEM }]);
    setActiveItemId(newId);
  }

  function removeItem(id: number) {
    trackFirstInteraction();
    if (items.length <= 1) return;
    const filtered = items.filter((item) => item.id !== id);
    setItems(filtered.map((item, i) => ({ ...item, label: String(i + 1) })));
    if (activeItemId === id) setActiveItemId(null);
  }

  function applyPreset(preset: Preset) {
    trackFirstInteraction();
    const newContainer = { ...DEFAULT_CONTAINER, ...preset.container };
    if (preset.container.gap !== undefined && newContainer.useUniformGap) {
      newContainer.rowGap = preset.container.gap;
      newContainer.columnGap = preset.container.gap;
    }
    setContainer(newContainer);
    const newItems = preset.items.map((item, i) => ({
      ...item,
      id: nextId++,
      label: String(i + 1),
    }));
    setItems(newItems);
    setActiveItemId(null);
  }

  function buildContainerCSS(): string {
    const lines = [
      "display: grid;",
      `grid-template-columns: ${container.columns};`,
    ];
    if (container.rows !== "auto") {
      lines.push(`grid-template-rows: ${container.rows};`);
    }
    if (container.useUniformGap) {
      if (container.gap > 0) lines.push(`gap: ${container.gap}px;`);
    } else {
      if (container.rowGap > 0 || container.columnGap > 0) {
        if (container.rowGap === container.columnGap) {
          lines.push(`gap: ${container.rowGap}px;`);
        } else {
          if (container.rowGap > 0) lines.push(`row-gap: ${container.rowGap}px;`);
          if (container.columnGap > 0) lines.push(`column-gap: ${container.columnGap}px;`);
        }
      }
    }
    if (container.justifyItems !== "stretch") lines.push(`justify-items: ${container.justifyItems};`);
    if (container.alignItems !== "stretch") lines.push(`align-items: ${container.alignItems};`);
    if (container.justifyContent !== "start") lines.push(`justify-content: ${container.justifyContent};`);
    if (container.alignContent !== "start") lines.push(`align-content: ${container.alignContent};`);
    if (container.autoFlow !== "row") lines.push(`grid-auto-flow: ${container.autoFlow};`);
    if (container.autoColumns !== "auto") lines.push(`grid-auto-columns: ${container.autoColumns};`);
    if (container.autoRows !== "auto") lines.push(`grid-auto-rows: ${container.autoRows};`);
    return lines.join("\n  ");
  }

  function buildItemCSS(item: GridItem, index: number): string | null {
    const lines: string[] = [];
    if (item.colSpan > 1) lines.push(`grid-column: span ${item.colSpan};`);
    if (item.rowSpan > 1) lines.push(`grid-row: span ${item.rowSpan};`);
    if (item.colStart !== "auto") lines.push(`grid-column-start: ${item.colStart};`);
    if (item.rowStart !== "auto") lines.push(`grid-row-start: ${item.rowStart};`);
    if (item.justifySelf !== "auto") lines.push(`justify-self: ${item.justifySelf};`);
    if (item.alignSelf !== "auto") lines.push(`align-self: ${item.alignSelf};`);
    if (lines.length === 0) return null;
    return `.item-${index + 1} {\n  ${lines.join("\n  ")}\n}`;
  }

  function buildFullCSS(): string {
    let css = `.container {\n  ${buildContainerCSS()}\n}`;
    items.forEach((item, i) => {
      const itemCSS = buildItemCSS(item, i);
      if (itemCSS) css += `\n\n${itemCSS}`;
    });
    return css;
  }

  function copyCSS() {
    navigator.clipboard.writeText(buildFullCSS());
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const activeItem = activeItemId !== null ? items.find((item) => item.id === activeItemId) : null;

  const selectClass =
    "rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";
  const inputClass =
    "rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";
  const labelClass = "text-sm font-medium text-gray-700 dark:text-gray-300";

  const effectiveGap = container.useUniformGap ? container.gap : undefined;
  const effectiveRowGap = container.useUniformGap ? container.gap : container.rowGap;
  const effectiveColumnGap = container.useUniformGap ? container.gap : container.columnGap;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="mb-8 block text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        &larr; Back to tools
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        CSS Grid Generator
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Build CSS grid layouts visually. Configure columns, rows, gap, and per-item placement. Copy production-ready CSS.
      </p>

      {/* Container Properties */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
        <h2 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Grid Container</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-1">
            <label className={labelClass}>Columns</label>
            <input
              type="text"
              value={container.columns}
              onChange={(e) => updateContainer({ columns: e.target.value })}
              placeholder="1fr 1fr 1fr"
              className={`${inputClass} w-full`}
            />
          </div>
          <div className="space-y-1">
            <label className={labelClass}>Rows</label>
            <input
              type="text"
              value={container.rows}
              onChange={(e) => updateContainer({ rows: e.target.value })}
              placeholder="auto"
              className={`${inputClass} w-full`}
            />
          </div>
          {container.useUniformGap ? (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className={labelClass}>Gap</label>
                <button
                  onClick={() => {
                    trackFirstInteraction();
                    setContainer((prev) => ({ ...prev, useUniformGap: false }));
                  }}
                  className="text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  Split
                </button>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={container.gap}
                  onChange={(e) => updateContainer({ gap: Math.max(0, Number(e.target.value) || 0) })}
                  className={`${inputClass} w-full`}
                />
                <span className="text-sm text-gray-500 dark:text-gray-400 shrink-0">px</span>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className={labelClass}>Row Gap</label>
                  <button
                    onClick={() => {
                      trackFirstInteraction();
                      setContainer((prev) => ({ ...prev, useUniformGap: true, gap: prev.rowGap }));
                    }}
                    className="text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    Unify
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={container.rowGap}
                    onChange={(e) => updateContainer({ rowGap: Math.max(0, Number(e.target.value) || 0) })}
                    className={`${inputClass} w-full`}
                  />
                  <span className="text-sm text-gray-500 dark:text-gray-400 shrink-0">px</span>
                </div>
              </div>
              <div className="space-y-1">
                <label className={labelClass}>Column Gap</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={container.columnGap}
                    onChange={(e) => updateContainer({ columnGap: Math.max(0, Number(e.target.value) || 0) })}
                    className={`${inputClass} w-full`}
                  />
                  <span className="text-sm text-gray-500 dark:text-gray-400 shrink-0">px</span>
                </div>
              </div>
            </>
          )}
          <div className="space-y-1">
            <label className={labelClass}>Auto Flow</label>
            <select
              value={container.autoFlow}
              onChange={(e) => updateContainer({ autoFlow: e.target.value })}
              className={`${selectClass} w-full`}
            >
              {AUTO_FLOW_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Advanced toggle */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="mt-4 text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          {showAdvanced ? "Hide advanced" : "Show advanced"}
        </button>
        {showAdvanced && (
          <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="space-y-1">
              <label className={labelClass}>Justify Items</label>
              <select
                value={container.justifyItems}
                onChange={(e) => updateContainer({ justifyItems: e.target.value })}
                className={`${selectClass} w-full`}
              >
                {JUSTIFY_ITEMS_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Align Items</label>
              <select
                value={container.alignItems}
                onChange={(e) => updateContainer({ alignItems: e.target.value })}
                className={`${selectClass} w-full`}
              >
                {ALIGN_ITEMS_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Justify Content</label>
              <select
                value={container.justifyContent}
                onChange={(e) => updateContainer({ justifyContent: e.target.value })}
                className={`${selectClass} w-full`}
              >
                {JUSTIFY_CONTENT_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Align Content</label>
              <select
                value={container.alignContent}
                onChange={(e) => updateContainer({ alignContent: e.target.value })}
                className={`${selectClass} w-full`}
              >
                {ALIGN_CONTENT_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Auto Columns</label>
              <input
                type="text"
                value={container.autoColumns}
                onChange={(e) => updateContainer({ autoColumns: e.target.value })}
                placeholder="auto"
                className={`${inputClass} w-full`}
              />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Auto Rows</label>
              <input
                type="text"
                value={container.autoRows}
                onChange={(e) => updateContainer({ autoRows: e.target.value })}
                placeholder="auto"
                className={`${inputClass} w-full`}
              />
            </div>
          </div>
        )}
      </div>

      {/* Live Preview */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Live Preview
          </h2>
          <button
            onClick={addItem}
            disabled={items.length >= 12}
            className={`rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors ${
              items.length >= 12 ? "opacity-40 cursor-not-allowed" : ""
            }`}
          >
            + Add Item
          </button>
        </div>
        <div
          className="min-h-[280px] rounded-xl border-2 border-dashed border-gray-300 bg-white p-4 dark:border-gray-600 dark:bg-gray-900"
          style={{
            display: "grid",
            gridTemplateColumns: container.columns,
            gridTemplateRows: container.rows !== "auto" ? container.rows : undefined,
            gap: effectiveGap !== undefined ? `${effectiveGap}px` : undefined,
            rowGap: effectiveGap === undefined ? `${effectiveRowGap}px` : undefined,
            columnGap: effectiveGap === undefined ? `${effectiveColumnGap}px` : undefined,
            justifyItems: container.justifyItems as React.CSSProperties["justifyItems"],
            alignItems: container.alignItems as React.CSSProperties["alignItems"],
            justifyContent: container.justifyContent as React.CSSProperties["justifyContent"],
            alignContent: container.alignContent as React.CSSProperties["alignContent"],
            gridAutoFlow: container.autoFlow,
            gridAutoColumns: container.autoColumns !== "auto" ? container.autoColumns : undefined,
            gridAutoRows: container.autoRows !== "auto" ? container.autoRows : undefined,
          }}
        >
          {items.map((item, i) => (
            <button
              key={item.id}
              onClick={() => setActiveItemId(activeItemId === item.id ? null : item.id)}
              className={`${ITEM_COLORS[i % ITEM_COLORS.length]} flex min-h-[60px] items-center justify-center rounded-lg text-sm font-bold text-white shadow-sm transition-all hover:opacity-90 ${
                activeItemId === item.id ? "ring-2 ring-offset-2 ring-indigo-500 dark:ring-offset-gray-900" : ""
              }`}
              style={{
                gridColumn: item.colSpan > 1 ? `span ${item.colSpan}` : item.colStart !== "auto" ? item.colStart : undefined,
                gridRow: item.rowSpan > 1 ? `span ${item.rowSpan}` : item.rowStart !== "auto" ? item.rowStart : undefined,
                justifySelf: item.justifySelf !== "auto" ? (item.justifySelf as React.CSSProperties["justifySelf"]) : undefined,
                alignSelf: item.alignSelf !== "auto" ? item.alignSelf : undefined,
                padding: "12px 20px",
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
        <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
          Click an item to configure its grid placement properties
        </p>
      </div>

      {/* Active Item Properties */}
      {activeItem && (
        <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-gray-900 dark:text-white">
              Item {items.findIndex((item) => item.id === activeItem.id) + 1} Properties
            </h2>
            <button
              onClick={() => removeItem(activeItem.id)}
              disabled={items.length <= 1}
              className={`rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950 transition-colors ${
                items.length <= 1 ? "opacity-40 cursor-not-allowed" : ""
              }`}
            >
              Remove Item
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            <div className="space-y-1">
              <label className={labelClass}>Column Span</label>
              <input
                type="number"
                min={1}
                max={12}
                value={activeItem.colSpan}
                onChange={(e) => updateItem(activeItem.id, { colSpan: Math.max(1, Number(e.target.value) || 1) })}
                className={`${inputClass} w-full`}
              />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Row Span</label>
              <input
                type="number"
                min={1}
                max={12}
                value={activeItem.rowSpan}
                onChange={(e) => updateItem(activeItem.id, { rowSpan: Math.max(1, Number(e.target.value) || 1) })}
                className={`${inputClass} w-full`}
              />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Column Start</label>
              <input
                type="text"
                value={activeItem.colStart}
                onChange={(e) => updateItem(activeItem.id, { colStart: e.target.value })}
                placeholder="auto"
                className={`${inputClass} w-full`}
              />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Row Start</label>
              <input
                type="text"
                value={activeItem.rowStart}
                onChange={(e) => updateItem(activeItem.id, { rowStart: e.target.value })}
                placeholder="auto"
                className={`${inputClass} w-full`}
              />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Justify Self</label>
              <select
                value={activeItem.justifySelf}
                onChange={(e) => updateItem(activeItem.id, { justifySelf: e.target.value })}
                className={`${selectClass} w-full`}
              >
                {JUSTIFY_SELF_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Align Self</label>
              <select
                value={activeItem.alignSelf}
                onChange={(e) => updateItem(activeItem.id, { alignSelf: e.target.value })}
                className={`${selectClass} w-full`}
              >
                {ALIGN_SELF_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

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
          {buildFullCSS()}
        </pre>
      </div>

      {/* Presets */}
      <div className="mb-8">
        <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Layout Presets
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset)}
              className="group rounded-lg border border-gray-200 p-3 text-left transition-colors hover:border-indigo-400 dark:border-gray-700 dark:hover:border-indigo-600"
            >
              <span className="block text-sm font-medium text-gray-700 group-hover:text-indigo-600 dark:text-gray-300 dark:group-hover:text-indigo-400">
                {preset.name}
              </span>
              <span className="block text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {preset.description}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Reference */}
      <details className="rounded-lg border border-gray-200 dark:border-gray-700">
        <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
          About CSS Grid
        </summary>
        <div className="border-t border-gray-200 px-4 py-3 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-400 space-y-2">
          <p>
            <strong className="text-gray-900 dark:text-white">CSS Grid</strong> is a two-dimensional layout
            system that handles both columns and rows simultaneously, unlike flexbox which is one-dimensional.
          </p>
          <p>
            <strong className="text-gray-900 dark:text-white">grid-template-columns / rows</strong> define
            the track sizes.{" "}
            <code className="mx-1 rounded bg-gray-100 px-1.5 py-0.5 text-xs dark:bg-gray-800">1fr 1fr 1fr</code>{" "}
            creates three equal columns.{" "}
            <code className="mx-1 rounded bg-gray-100 px-1.5 py-0.5 text-xs dark:bg-gray-800">repeat(3, 1fr)</code>{" "}
            is equivalent.
          </p>
          <p>
            <strong className="text-gray-900 dark:text-white">fr</strong> is a fractional unit that distributes
            available space.{" "}
            <code className="mx-1 rounded bg-gray-100 px-1.5 py-0.5 text-xs dark:bg-gray-800">1fr 2fr</code>{" "}
            gives the second column twice the space.
          </p>
          <p>
            <strong className="text-gray-900 dark:text-white">grid-column / grid-row</strong> on items control
            placement.{" "}
            <code className="mx-1 rounded bg-gray-100 px-1.5 py-0.5 text-xs dark:bg-gray-800">span 2</code>{" "}
            makes an item stretch across two tracks.
          </p>
          <p>
            <strong className="text-gray-900 dark:text-white">gap</strong> adds consistent spacing between
            grid tracks. You can set{" "}
            <code className="mx-1 rounded bg-gray-100 px-1.5 py-0.5 text-xs dark:bg-gray-800">row-gap</code>{" "}
            and{" "}
            <code className="mx-1 rounded bg-gray-100 px-1.5 py-0.5 text-xs dark:bg-gray-800">column-gap</code>{" "}
            independently.
          </p>
          <p>
            <strong className="text-gray-900 dark:text-white">auto-fill / auto-fit</strong> with{" "}
            <code className="mx-1 rounded bg-gray-100 px-1.5 py-0.5 text-xs dark:bg-gray-800">minmax()</code>{" "}
            create responsive grids without media queries.
          </p>
        </div>
      </details>
    </div>
  );
}
