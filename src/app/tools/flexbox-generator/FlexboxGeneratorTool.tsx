"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";

interface FlexItem {
  id: number;
  label: string;
  flexGrow: number;
  flexShrink: number;
  flexBasis: string;
  alignSelf: string;
  order: number;
}

interface ContainerProps {
  flexDirection: string;
  justifyContent: string;
  alignItems: string;
  flexWrap: string;
  alignContent: string;
  gap: number;
}

interface Preset {
  name: string;
  description: string;
  container: ContainerProps;
  items: Omit<FlexItem, "id" | "label">[];
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

const DIRECTION_OPTIONS = ["row", "row-reverse", "column", "column-reverse"];
const JUSTIFY_OPTIONS = ["flex-start", "flex-end", "center", "space-between", "space-around", "space-evenly"];
const ALIGN_ITEMS_OPTIONS = ["stretch", "flex-start", "flex-end", "center", "baseline"];
const WRAP_OPTIONS = ["nowrap", "wrap", "wrap-reverse"];
const ALIGN_CONTENT_OPTIONS = ["stretch", "flex-start", "flex-end", "center", "space-between", "space-around"];
const ALIGN_SELF_OPTIONS = ["auto", "stretch", "flex-start", "flex-end", "center", "baseline"];

const PRESETS: Preset[] = [
  {
    name: "Centered",
    description: "Perfectly centered content",
    container: { flexDirection: "row", justifyContent: "center", alignItems: "center", flexWrap: "nowrap", alignContent: "stretch", gap: 16 },
    items: [{ flexGrow: 0, flexShrink: 1, flexBasis: "auto", alignSelf: "auto", order: 0 }],
  },
  {
    name: "Navbar",
    description: "Logo left, nav items right",
    container: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", flexWrap: "nowrap", alignContent: "stretch", gap: 16 },
    items: [
      { flexGrow: 0, flexShrink: 0, flexBasis: "auto", alignSelf: "auto", order: 0 },
      { flexGrow: 1, flexShrink: 1, flexBasis: "auto", alignSelf: "auto", order: 0 },
      { flexGrow: 0, flexShrink: 0, flexBasis: "auto", alignSelf: "auto", order: 0 },
    ],
  },
  {
    name: "Sidebar",
    description: "Fixed sidebar with fluid content",
    container: { flexDirection: "row", justifyContent: "flex-start", alignItems: "stretch", flexWrap: "nowrap", alignContent: "stretch", gap: 0 },
    items: [
      { flexGrow: 0, flexShrink: 0, flexBasis: "200px", alignSelf: "auto", order: 0 },
      { flexGrow: 1, flexShrink: 1, flexBasis: "0%", alignSelf: "auto", order: 0 },
    ],
  },
  {
    name: "Card Grid",
    description: "Wrapping cards with equal width",
    container: { flexDirection: "row", justifyContent: "flex-start", alignItems: "stretch", flexWrap: "wrap", alignContent: "stretch", gap: 16 },
    items: [
      { flexGrow: 0, flexShrink: 0, flexBasis: "calc(33.333% - 11px)", alignSelf: "auto", order: 0 },
      { flexGrow: 0, flexShrink: 0, flexBasis: "calc(33.333% - 11px)", alignSelf: "auto", order: 0 },
      { flexGrow: 0, flexShrink: 0, flexBasis: "calc(33.333% - 11px)", alignSelf: "auto", order: 0 },
      { flexGrow: 0, flexShrink: 0, flexBasis: "calc(33.333% - 11px)", alignSelf: "auto", order: 0 },
      { flexGrow: 0, flexShrink: 0, flexBasis: "calc(33.333% - 11px)", alignSelf: "auto", order: 0 },
      { flexGrow: 0, flexShrink: 0, flexBasis: "calc(33.333% - 11px)", alignSelf: "auto", order: 0 },
    ],
  },
  {
    name: "Holy Grail",
    description: "Header, 3-column body, footer",
    container: { flexDirection: "column", justifyContent: "flex-start", alignItems: "stretch", flexWrap: "nowrap", alignContent: "stretch", gap: 8 },
    items: [
      { flexGrow: 0, flexShrink: 0, flexBasis: "auto", alignSelf: "auto", order: 0 },
      { flexGrow: 1, flexShrink: 1, flexBasis: "auto", alignSelf: "auto", order: 0 },
      { flexGrow: 0, flexShrink: 0, flexBasis: "auto", alignSelf: "auto", order: 0 },
    ],
  },
  {
    name: "Equal Columns",
    description: "Evenly distributed columns",
    container: { flexDirection: "row", justifyContent: "flex-start", alignItems: "stretch", flexWrap: "nowrap", alignContent: "stretch", gap: 16 },
    items: [
      { flexGrow: 1, flexShrink: 1, flexBasis: "0%", alignSelf: "auto", order: 0 },
      { flexGrow: 1, flexShrink: 1, flexBasis: "0%", alignSelf: "auto", order: 0 },
      { flexGrow: 1, flexShrink: 1, flexBasis: "0%", alignSelf: "auto", order: 0 },
    ],
  },
];

let nextId = 4;

const DEFAULT_ITEM: Omit<FlexItem, "id" | "label"> = {
  flexGrow: 0,
  flexShrink: 1,
  flexBasis: "auto",
  alignSelf: "auto",
  order: 0,
};

export default function FlexboxGeneratorTool() {
  const [container, setContainer] = useState<ContainerProps>({
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "stretch",
    flexWrap: "nowrap",
    alignContent: "stretch",
    gap: 12,
  });

  const [items, setItems] = useState<FlexItem[]>([
    { id: 1, label: "1", ...DEFAULT_ITEM },
    { id: 2, label: "2", ...DEFAULT_ITEM },
    { id: 3, label: "3", ...DEFAULT_ITEM },
  ]);

  const [activeItemId, setActiveItemId] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const { trackFirstInteraction } = useToolAnalytics("flexbox-generator");

  const updateContainer = useCallback(
    (updates: Partial<ContainerProps>) => {
      trackFirstInteraction();
      setContainer((prev) => ({ ...prev, ...updates }));
    },
    [trackFirstInteraction]
  );

  const updateItem = useCallback(
    (id: number, updates: Partial<Omit<FlexItem, "id" | "label">>) => {
      trackFirstInteraction();
      setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));
    },
    [trackFirstInteraction]
  );

  function addItem() {
    trackFirstInteraction();
    if (items.length >= 12) return;
    const newId = nextId++;
    const newItem: FlexItem = { id: newId, label: String(items.length + 1), ...DEFAULT_ITEM };
    setItems([...items, newItem]);
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
    setContainer(preset.container);
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
      "display: flex;",
      `flex-direction: ${container.flexDirection};`,
      `justify-content: ${container.justifyContent};`,
      `align-items: ${container.alignItems};`,
      `flex-wrap: ${container.flexWrap};`,
    ];
    if (container.flexWrap !== "nowrap" && container.alignContent !== "stretch") {
      lines.push(`align-content: ${container.alignContent};`);
    }
    if (container.gap > 0) {
      lines.push(`gap: ${container.gap}px;`);
    }
    return lines.join("\n  ");
  }

  function buildItemCSS(item: FlexItem, index: number): string | null {
    const lines: string[] = [];
    if (item.flexGrow !== 0) lines.push(`flex-grow: ${item.flexGrow};`);
    if (item.flexShrink !== 1) lines.push(`flex-shrink: ${item.flexShrink};`);
    if (item.flexBasis !== "auto") lines.push(`flex-basis: ${item.flexBasis};`);
    if (item.alignSelf !== "auto") lines.push(`align-self: ${item.alignSelf};`);
    if (item.order !== 0) lines.push(`order: ${item.order};`);
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

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="mb-8 block text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        &larr; Back to tools
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        CSS Flexbox Generator
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Build CSS flexbox layouts visually. Configure container and item properties, preview live, and copy the CSS.
      </p>

      {/* Container Properties */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
        <h2 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Container Properties</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <div className="space-y-1">
            <label className={labelClass}>Direction</label>
            <select
              value={container.flexDirection}
              onChange={(e) => updateContainer({ flexDirection: e.target.value })}
              className={`${selectClass} w-full`}
            >
              {DIRECTION_OPTIONS.map((opt) => (
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
              {JUSTIFY_OPTIONS.map((opt) => (
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
            <label className={labelClass}>Wrap</label>
            <select
              value={container.flexWrap}
              onChange={(e) => updateContainer({ flexWrap: e.target.value })}
              className={`${selectClass} w-full`}
            >
              {WRAP_OPTIONS.map((opt) => (
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
              disabled={container.flexWrap === "nowrap"}
            >
              {ALIGN_CONTENT_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className={labelClass}>Gap</label>
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
        </div>
      </div>

      {/* Live Preview */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Live Preview
          </h2>
          <div className="flex items-center gap-2">
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
        </div>
        <div
          className="min-h-[240px] rounded-xl border-2 border-dashed border-gray-300 bg-white p-4 dark:border-gray-600 dark:bg-gray-900"
          style={{
            display: "flex",
            flexDirection: container.flexDirection as React.CSSProperties["flexDirection"],
            justifyContent: container.justifyContent,
            alignItems: container.alignItems,
            flexWrap: container.flexWrap as React.CSSProperties["flexWrap"],
            alignContent: container.alignContent,
            gap: `${container.gap}px`,
          }}
        >
          {items.map((item, i) => (
            <button
              key={item.id}
              onClick={() => setActiveItemId(activeItemId === item.id ? null : item.id)}
              className={`${ITEM_COLORS[i % ITEM_COLORS.length]} flex min-h-[60px] min-w-[60px] items-center justify-center rounded-lg text-sm font-bold text-white shadow-sm transition-all hover:opacity-90 ${
                activeItemId === item.id ? "ring-2 ring-offset-2 ring-indigo-500 dark:ring-offset-gray-900" : ""
              }`}
              style={{
                flexGrow: item.flexGrow,
                flexShrink: item.flexShrink,
                flexBasis: item.flexBasis,
                alignSelf: item.alignSelf !== "auto" ? item.alignSelf : undefined,
                order: item.order,
                padding: "12px 20px",
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
        <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
          Click an item to configure its flex properties
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

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            <div className="space-y-1">
              <label className={labelClass}>flex-grow</label>
              <input
                type="number"
                min={0}
                max={10}
                value={activeItem.flexGrow}
                onChange={(e) => updateItem(activeItem.id, { flexGrow: Math.max(0, Number(e.target.value) || 0) })}
                className={`${inputClass} w-full`}
              />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>flex-shrink</label>
              <input
                type="number"
                min={0}
                max={10}
                value={activeItem.flexShrink}
                onChange={(e) => updateItem(activeItem.id, { flexShrink: Math.max(0, Number(e.target.value) || 0) })}
                className={`${inputClass} w-full`}
              />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>flex-basis</label>
              <input
                type="text"
                value={activeItem.flexBasis}
                onChange={(e) => updateItem(activeItem.id, { flexBasis: e.target.value })}
                placeholder="auto, 0%, 200px"
                className={`${inputClass} w-full`}
              />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>align-self</label>
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
            <div className="space-y-1">
              <label className={labelClass}>order</label>
              <input
                type="number"
                min={-10}
                max={10}
                value={activeItem.order}
                onChange={(e) => updateItem(activeItem.id, { order: Number(e.target.value) || 0 })}
                className={`${inputClass} w-full`}
              />
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
          About CSS Flexbox
        </summary>
        <div className="border-t border-gray-200 px-4 py-3 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-400 space-y-2">
          <p>
            <strong className="text-gray-900 dark:text-white">Flexbox</strong> is a one-dimensional layout
            model that distributes space among items in a container and controls their alignment.
          </p>
          <p>
            <strong className="text-gray-900 dark:text-white">flex-direction</strong> sets the main axis.{" "}
            <code className="mx-1 rounded bg-gray-100 px-1.5 py-0.5 text-xs dark:bg-gray-800">row</code> is
            horizontal (default),{" "}
            <code className="mx-1 rounded bg-gray-100 px-1.5 py-0.5 text-xs dark:bg-gray-800">column</code> is
            vertical.
          </p>
          <p>
            <strong className="text-gray-900 dark:text-white">justify-content</strong> aligns items along
            the main axis.{" "}
            <strong className="text-gray-900 dark:text-white">align-items</strong> aligns items along the
            cross axis.
          </p>
          <p>
            <strong className="text-gray-900 dark:text-white">flex-grow</strong> controls how much an item
            grows relative to siblings.{" "}
            <strong className="text-gray-900 dark:text-white">flex-shrink</strong> controls how much it
            shrinks.{" "}
            <strong className="text-gray-900 dark:text-white">flex-basis</strong> sets the initial size before
            growing or shrinking.
          </p>
          <p>
            <strong className="text-gray-900 dark:text-white">flex-wrap</strong> allows items to flow onto
            multiple lines when they exceed the container width.{" "}
            <strong className="text-gray-900 dark:text-white">align-content</strong> controls spacing between
            wrapped lines.
          </p>
          <p>
            <strong className="text-gray-900 dark:text-white">gap</strong> adds consistent spacing between
            flex items without needing margins.
          </p>
        </div>
      </details>
    </div>
  );
}
