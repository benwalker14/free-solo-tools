"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";

// --- Types ---

interface TailwindConfig {
  // Layout
  display: string;
  flexDirection: string;
  justifyContent: string;
  alignItems: string;
  flexWrap: string;
  gap: string;
  // Sizing
  width: string;
  height: string;
  maxWidth: string;
  // Spacing
  padding: string;
  paddingX: string;
  paddingY: string;
  margin: string;
  marginX: string;
  marginY: string;
  // Typography
  fontSize: string;
  fontWeight: string;
  textColor: string;
  textAlign: string;
  lineHeight: string;
  letterSpacing: string;
  // Background
  bgColor: string;
  // Border
  borderWidth: string;
  borderRadius: string;
  borderColor: string;
  // Effects
  shadow: string;
  opacity: string;
  // Transitions
  transition: string;
  cursor: string;
  // Custom
  customClasses: string;
}

interface Preset {
  name: string;
  description: string;
  config: Partial<TailwindConfig>;
  previewText: string;
}

// --- Constants ---

const DEFAULT_CONFIG: TailwindConfig = {
  display: "",
  flexDirection: "",
  justifyContent: "",
  alignItems: "",
  flexWrap: "",
  gap: "",
  width: "",
  height: "",
  maxWidth: "",
  padding: "",
  paddingX: "",
  paddingY: "",
  margin: "",
  marginX: "",
  marginY: "",
  fontSize: "",
  fontWeight: "",
  textColor: "",
  textAlign: "",
  lineHeight: "",
  letterSpacing: "",
  bgColor: "",
  borderWidth: "",
  borderRadius: "",
  borderColor: "",
  shadow: "",
  opacity: "",
  transition: "",
  cursor: "",
  customClasses: "",
};

const DISPLAY_OPTIONS = ["", "block", "inline-block", "inline", "flex", "inline-flex", "grid", "inline-grid", "hidden"];
const FLEX_DIRECTION_OPTIONS = ["", "flex-row", "flex-row-reverse", "flex-col", "flex-col-reverse"];
const JUSTIFY_OPTIONS = ["", "justify-start", "justify-center", "justify-end", "justify-between", "justify-around", "justify-evenly"];
const ALIGN_OPTIONS = ["", "items-start", "items-center", "items-end", "items-baseline", "items-stretch"];
const FLEX_WRAP_OPTIONS = ["", "flex-wrap", "flex-wrap-reverse", "flex-nowrap"];
const GAP_OPTIONS = ["", "gap-0", "gap-1", "gap-2", "gap-3", "gap-4", "gap-5", "gap-6", "gap-8", "gap-10", "gap-12"];

const WIDTH_OPTIONS = ["", "w-auto", "w-full", "w-screen", "w-fit", "w-min", "w-max", "w-1/2", "w-1/3", "w-2/3", "w-1/4", "w-3/4", "w-16", "w-24", "w-32", "w-48", "w-64", "w-80", "w-96"];
const HEIGHT_OPTIONS = ["", "h-auto", "h-full", "h-screen", "h-fit", "h-min", "h-max", "h-8", "h-10", "h-12", "h-16", "h-24", "h-32", "h-48", "h-64"];
const MAX_WIDTH_OPTIONS = ["", "max-w-xs", "max-w-sm", "max-w-md", "max-w-lg", "max-w-xl", "max-w-2xl", "max-w-4xl", "max-w-6xl", "max-w-full", "max-w-screen-sm", "max-w-screen-md", "max-w-screen-lg"];

const PADDING_OPTIONS = ["", "p-0", "p-1", "p-2", "p-3", "p-4", "p-5", "p-6", "p-8", "p-10", "p-12", "p-16"];
const PADDING_X_OPTIONS = ["", "px-0", "px-1", "px-2", "px-3", "px-4", "px-5", "px-6", "px-8", "px-10", "px-12", "px-16"];
const PADDING_Y_OPTIONS = ["", "py-0", "py-1", "py-2", "py-3", "py-4", "py-5", "py-6", "py-8", "py-10", "py-12", "py-16"];
const MARGIN_OPTIONS = ["", "m-0", "m-1", "m-2", "m-3", "m-4", "m-5", "m-6", "m-8", "m-auto"];
const MARGIN_X_OPTIONS = ["", "mx-0", "mx-1", "mx-2", "mx-3", "mx-4", "mx-5", "mx-6", "mx-8", "mx-auto"];
const MARGIN_Y_OPTIONS = ["", "my-0", "my-1", "my-2", "my-3", "my-4", "my-5", "my-6", "my-8", "my-auto"];

const FONT_SIZE_OPTIONS = ["", "text-xs", "text-sm", "text-base", "text-lg", "text-xl", "text-2xl", "text-3xl", "text-4xl", "text-5xl"];
const FONT_WEIGHT_OPTIONS = ["", "font-thin", "font-light", "font-normal", "font-medium", "font-semibold", "font-bold", "font-extrabold"];
const TEXT_COLOR_OPTIONS = [
  "", "text-white", "text-black",
  "text-gray-500", "text-gray-600", "text-gray-700", "text-gray-800", "text-gray-900",
  "text-red-500", "text-red-600", "text-red-700",
  "text-orange-500", "text-orange-600",
  "text-yellow-500", "text-yellow-600",
  "text-green-500", "text-green-600", "text-green-700",
  "text-blue-500", "text-blue-600", "text-blue-700",
  "text-indigo-500", "text-indigo-600", "text-indigo-700",
  "text-purple-500", "text-purple-600", "text-purple-700",
  "text-pink-500", "text-pink-600",
];
const TEXT_ALIGN_OPTIONS = ["", "text-left", "text-center", "text-right", "text-justify"];
const LINE_HEIGHT_OPTIONS = ["", "leading-none", "leading-tight", "leading-snug", "leading-normal", "leading-relaxed", "leading-loose"];
const LETTER_SPACING_OPTIONS = ["", "tracking-tighter", "tracking-tight", "tracking-normal", "tracking-wide", "tracking-wider", "tracking-widest"];

const BG_COLOR_OPTIONS = [
  "", "bg-transparent", "bg-white", "bg-black",
  "bg-gray-50", "bg-gray-100", "bg-gray-200", "bg-gray-500", "bg-gray-800", "bg-gray-900",
  "bg-red-50", "bg-red-100", "bg-red-500", "bg-red-600", "bg-red-700",
  "bg-orange-50", "bg-orange-500",
  "bg-yellow-50", "bg-yellow-400", "bg-yellow-500",
  "bg-green-50", "bg-green-100", "bg-green-500", "bg-green-600", "bg-green-700",
  "bg-blue-50", "bg-blue-100", "bg-blue-500", "bg-blue-600", "bg-blue-700",
  "bg-indigo-50", "bg-indigo-100", "bg-indigo-500", "bg-indigo-600", "bg-indigo-700",
  "bg-purple-50", "bg-purple-100", "bg-purple-500", "bg-purple-600",
  "bg-pink-50", "bg-pink-500",
];

const BORDER_WIDTH_OPTIONS = ["", "border", "border-0", "border-2", "border-4", "border-8"];
const BORDER_RADIUS_OPTIONS = ["", "rounded-none", "rounded-sm", "rounded", "rounded-md", "rounded-lg", "rounded-xl", "rounded-2xl", "rounded-3xl", "rounded-full"];
const BORDER_COLOR_OPTIONS = [
  "", "border-transparent", "border-white", "border-black",
  "border-gray-200", "border-gray-300", "border-gray-400", "border-gray-500",
  "border-red-300", "border-red-500",
  "border-green-300", "border-green-500",
  "border-blue-300", "border-blue-500",
  "border-indigo-300", "border-indigo-500",
  "border-purple-300", "border-purple-500",
];

const SHADOW_OPTIONS = ["", "shadow-none", "shadow-sm", "shadow", "shadow-md", "shadow-lg", "shadow-xl", "shadow-2xl"];
const OPACITY_OPTIONS = ["", "opacity-0", "opacity-25", "opacity-50", "opacity-75", "opacity-100"];
const TRANSITION_OPTIONS = ["", "transition-none", "transition-all", "transition-colors", "transition-opacity", "transition-shadow", "transition-transform"];
const CURSOR_OPTIONS = ["", "cursor-pointer", "cursor-default", "cursor-not-allowed", "cursor-wait", "cursor-text", "cursor-move"];

const PRESETS: Preset[] = [
  {
    name: "Primary Button",
    description: "Solid indigo button with hover-ready styling",
    config: {
      display: "inline-flex",
      justifyContent: "justify-center",
      alignItems: "items-center",
      gap: "gap-2",
      paddingX: "px-5",
      paddingY: "py-2",
      fontSize: "text-sm",
      fontWeight: "font-semibold",
      textColor: "text-white",
      bgColor: "bg-indigo-600",
      borderRadius: "rounded-lg",
      shadow: "shadow-sm",
      transition: "transition-colors",
      cursor: "cursor-pointer",
    },
    previewText: "Click me",
  },
  {
    name: "Outline Button",
    description: "Bordered button with transparent background",
    config: {
      display: "inline-flex",
      justifyContent: "justify-center",
      alignItems: "items-center",
      gap: "gap-2",
      paddingX: "px-5",
      paddingY: "py-2",
      fontSize: "text-sm",
      fontWeight: "font-medium",
      textColor: "text-gray-700",
      bgColor: "bg-white",
      borderWidth: "border",
      borderColor: "border-gray-300",
      borderRadius: "rounded-lg",
      shadow: "shadow-sm",
      transition: "transition-colors",
      cursor: "cursor-pointer",
    },
    previewText: "Click me",
  },
  {
    name: "Card",
    description: "Rounded card container with shadow",
    config: {
      padding: "p-6",
      bgColor: "bg-white",
      borderWidth: "border",
      borderColor: "border-gray-200",
      borderRadius: "rounded-xl",
      shadow: "shadow-md",
    },
    previewText: "Card content goes here",
  },
  {
    name: "Badge",
    description: "Small inline status badge",
    config: {
      display: "inline-flex",
      alignItems: "items-center",
      paddingX: "px-2",
      paddingY: "py-1",
      fontSize: "text-xs",
      fontWeight: "font-medium",
      textColor: "text-green-700",
      bgColor: "bg-green-100",
      borderRadius: "rounded-full",
    },
    previewText: "Active",
  },
  {
    name: "Alert / Notice",
    description: "Info banner with left border accent",
    config: {
      display: "flex",
      alignItems: "items-center",
      gap: "gap-3",
      padding: "p-4",
      fontSize: "text-sm",
      textColor: "text-blue-700",
      bgColor: "bg-blue-50",
      borderWidth: "border",
      borderColor: "border-blue-300",
      borderRadius: "rounded-lg",
    },
    previewText: "This is an informational notice.",
  },
  {
    name: "Input Field",
    description: "Standard form text input",
    config: {
      width: "w-full",
      paddingX: "px-3",
      paddingY: "py-2",
      fontSize: "text-sm",
      textColor: "text-gray-900",
      bgColor: "bg-white",
      borderWidth: "border",
      borderColor: "border-gray-300",
      borderRadius: "rounded-lg",
      shadow: "shadow-sm",
    },
    previewText: "Type something…",
  },
  {
    name: "Avatar Circle",
    description: "Circular avatar placeholder",
    config: {
      display: "inline-flex",
      justifyContent: "justify-center",
      alignItems: "items-center",
      width: "w-10",
      height: "h-10",
      fontSize: "text-sm",
      fontWeight: "font-semibold",
      textColor: "text-white",
      bgColor: "bg-indigo-500",
      borderRadius: "rounded-full",
    },
    previewText: "VB",
  },
  {
    name: "Nav Link",
    description: "Horizontal navigation link",
    config: {
      display: "inline-flex",
      alignItems: "items-center",
      paddingX: "px-3",
      paddingY: "py-2",
      fontSize: "text-sm",
      fontWeight: "font-medium",
      textColor: "text-gray-600",
      borderRadius: "rounded-md",
      transition: "transition-colors",
      cursor: "cursor-pointer",
    },
    previewText: "Dashboard",
  },
  {
    name: "Centered Hero",
    description: "Centered text block for hero sections",
    config: {
      display: "flex",
      flexDirection: "flex-col",
      alignItems: "items-center",
      gap: "gap-4",
      paddingX: "px-6",
      paddingY: "py-16",
      textAlign: "text-center",
      maxWidth: "max-w-2xl",
      marginX: "mx-auto",
    },
    previewText: "Build something amazing",
  },
  {
    name: "Pill Tag",
    description: "Rounded pill-style tag for categories",
    config: {
      display: "inline-flex",
      alignItems: "items-center",
      paddingX: "px-3",
      paddingY: "py-1",
      fontSize: "text-xs",
      fontWeight: "font-medium",
      textColor: "text-indigo-600",
      bgColor: "bg-indigo-50",
      borderWidth: "border",
      borderColor: "border-indigo-200",
      borderRadius: "rounded-full",
    },
    previewText: "Tailwind",
  },
  {
    name: "Divider Section",
    description: "Section with top border divider",
    config: {
      paddingY: "py-6",
      borderWidth: "border",
      borderColor: "border-gray-200",
    },
    previewText: "Section content",
  },
  {
    name: "Flex Row Layout",
    description: "Horizontal flex container with gap",
    config: {
      display: "flex",
      flexDirection: "flex-row",
      alignItems: "items-center",
      justifyContent: "justify-between",
      gap: "gap-4",
      width: "w-full",
      padding: "p-4",
    },
    previewText: "Flex row content",
  },
];

// --- Helpers ---

const labelFor = (cls: string) => cls || "(none)";

const selectClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={selectClass}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {labelFor(opt)}
          </option>
        ))}
      </select>
    </div>
  );
}

// --- Component ---

export default function TailwindGeneratorTool() {
  const [config, setConfig] = useState<TailwindConfig>(DEFAULT_CONFIG);
  const [copied, setCopied] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [previewText, setPreviewText] = useState("Preview element");
  const [previewTag, setPreviewTag] = useState<"div" | "button" | "span" | "a" | "p" | "section">("div");
  const { trackFirstInteraction } = useToolAnalytics("tailwind-generator");

  const update = useCallback(
    (key: keyof TailwindConfig, value: string) => {
      trackFirstInteraction();
      setConfig((prev) => ({ ...prev, [key]: value }));
    },
    [trackFirstInteraction]
  );

  const applyPreset = useCallback(
    (preset: Preset) => {
      trackFirstInteraction();
      setConfig({ ...DEFAULT_CONFIG, ...preset.config });
      setPreviewText(preset.previewText);
    },
    [trackFirstInteraction]
  );

  const resetAll = useCallback(() => {
    setConfig(DEFAULT_CONFIG);
    setPreviewText("Preview element");
  }, []);

  // Build class string from config
  const classString = useMemo(() => {
    const parts: string[] = [];
    const keys = Object.keys(config) as (keyof TailwindConfig)[];
    for (const key of keys) {
      if (key === "customClasses") continue;
      const val = config[key];
      if (val) parts.push(val);
    }
    if (config.customClasses.trim()) {
      parts.push(...config.customClasses.trim().split(/\s+/));
    }
    return parts.join(" ");
  }, [config]);

  const htmlOutput = useMemo(() => {
    if (!classString) return `<${previewTag}>\n  ${previewText}\n</${previewTag}>`;
    return `<${previewTag} class="${classString}">\n  ${previewText}\n</${previewTag}>`;
  }, [classString, previewText, previewTag]);

  function copyClasses() {
    navigator.clipboard.writeText(classString);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function copyHtml() {
    navigator.clipboard.writeText(htmlOutput);
    setCopiedHtml(true);
    setTimeout(() => setCopiedHtml(false), 1500);
  }

  // Count active classes
  const activeCount = classString ? classString.split(" ").length : 0;

  const sf = (configKey: keyof TailwindConfig) => (v: string) => update(configKey, v);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        &larr; Back to tools
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Tailwind CSS Generator
      </h1>
      <p className="mt-2 mb-8 text-gray-600 dark:text-gray-400">
        Build Tailwind utility classes visually — pick properties, see a live
        preview, and copy the class string.
      </p>

      {/* ——— Live Preview ——— */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Live Preview
          </h2>
          <span className="text-xs text-gray-500 dark:text-gray-500">
            {activeCount} {activeCount === 1 ? "class" : "classes"} active
          </span>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-900 flex items-center justify-center min-h-[160px]">
          {/* We render a generic div with inline Tailwind-like styles derived from the class names */}
          <div className="relative w-full flex items-center justify-center">
            <div
              className={classString || undefined}
              style={!classString ? { color: "#9ca3af", fontStyle: "italic" } : undefined}
            >
              {previewText}
            </div>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <div>
            <label className="mr-2 text-xs font-medium text-gray-600 dark:text-gray-400">
              Preview text
            </label>
            <input
              type="text"
              value={previewText}
              onChange={(e) => setPreviewText(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="mr-2 text-xs font-medium text-gray-600 dark:text-gray-400">
              Tag
            </label>
            <select
              value={previewTag}
              onChange={(e) => setPreviewTag(e.target.value as typeof previewTag)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {(["div", "button", "span", "a", "p", "section"] as const).map((t) => (
                <option key={t} value={t}>
                  &lt;{t}&gt;
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={resetAll}
            className="ml-auto rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
          >
            Reset All
          </button>
        </div>
      </div>

      {/* ——— Presets ——— */}
      <div className="mb-8">
        <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Presets
        </h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset)}
              className="group rounded-lg border border-gray-200 p-3 text-left transition-colors hover:border-indigo-400 dark:border-gray-700 dark:hover:border-indigo-600"
            >
              <span className="block text-sm font-medium text-gray-800 group-hover:text-indigo-600 dark:text-gray-200 dark:group-hover:text-indigo-400">
                {preset.name}
              </span>
              <span className="block text-xs text-gray-500 dark:text-gray-500 mt-0.5">
                {preset.description}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ——— Property Sections ——— */}
      <div className="space-y-6">
        {/* Layout */}
        <Section title="Layout">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <SelectField label="Display" value={config.display} options={DISPLAY_OPTIONS} onChange={sf("display")} />
            <SelectField label="Flex Direction" value={config.flexDirection} options={FLEX_DIRECTION_OPTIONS} onChange={sf("flexDirection")} />
            <SelectField label="Justify Content" value={config.justifyContent} options={JUSTIFY_OPTIONS} onChange={sf("justifyContent")} />
            <SelectField label="Align Items" value={config.alignItems} options={ALIGN_OPTIONS} onChange={sf("alignItems")} />
            <SelectField label="Flex Wrap" value={config.flexWrap} options={FLEX_WRAP_OPTIONS} onChange={sf("flexWrap")} />
            <SelectField label="Gap" value={config.gap} options={GAP_OPTIONS} onChange={sf("gap")} />
          </div>
        </Section>

        {/* Sizing */}
        <Section title="Sizing">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <SelectField label="Width" value={config.width} options={WIDTH_OPTIONS} onChange={sf("width")} />
            <SelectField label="Height" value={config.height} options={HEIGHT_OPTIONS} onChange={sf("height")} />
            <SelectField label="Max Width" value={config.maxWidth} options={MAX_WIDTH_OPTIONS} onChange={sf("maxWidth")} />
          </div>
        </Section>

        {/* Spacing */}
        <Section title="Spacing">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <SelectField label="Padding (all)" value={config.padding} options={PADDING_OPTIONS} onChange={sf("padding")} />
            <SelectField label="Padding X" value={config.paddingX} options={PADDING_X_OPTIONS} onChange={sf("paddingX")} />
            <SelectField label="Padding Y" value={config.paddingY} options={PADDING_Y_OPTIONS} onChange={sf("paddingY")} />
            <SelectField label="Margin (all)" value={config.margin} options={MARGIN_OPTIONS} onChange={sf("margin")} />
            <SelectField label="Margin X" value={config.marginX} options={MARGIN_X_OPTIONS} onChange={sf("marginX")} />
            <SelectField label="Margin Y" value={config.marginY} options={MARGIN_Y_OPTIONS} onChange={sf("marginY")} />
          </div>
        </Section>

        {/* Typography */}
        <Section title="Typography">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <SelectField label="Font Size" value={config.fontSize} options={FONT_SIZE_OPTIONS} onChange={sf("fontSize")} />
            <SelectField label="Font Weight" value={config.fontWeight} options={FONT_WEIGHT_OPTIONS} onChange={sf("fontWeight")} />
            <SelectField label="Text Color" value={config.textColor} options={TEXT_COLOR_OPTIONS} onChange={sf("textColor")} />
            <SelectField label="Text Align" value={config.textAlign} options={TEXT_ALIGN_OPTIONS} onChange={sf("textAlign")} />
            <SelectField label="Line Height" value={config.lineHeight} options={LINE_HEIGHT_OPTIONS} onChange={sf("lineHeight")} />
            <SelectField label="Letter Spacing" value={config.letterSpacing} options={LETTER_SPACING_OPTIONS} onChange={sf("letterSpacing")} />
          </div>
        </Section>

        {/* Background */}
        <Section title="Background">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <SelectField label="Background Color" value={config.bgColor} options={BG_COLOR_OPTIONS} onChange={sf("bgColor")} />
          </div>
        </Section>

        {/* Border */}
        <Section title="Border">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <SelectField label="Border Width" value={config.borderWidth} options={BORDER_WIDTH_OPTIONS} onChange={sf("borderWidth")} />
            <SelectField label="Border Radius" value={config.borderRadius} options={BORDER_RADIUS_OPTIONS} onChange={sf("borderRadius")} />
            <SelectField label="Border Color" value={config.borderColor} options={BORDER_COLOR_OPTIONS} onChange={sf("borderColor")} />
          </div>
        </Section>

        {/* Effects */}
        <Section title="Effects & Transitions">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <SelectField label="Box Shadow" value={config.shadow} options={SHADOW_OPTIONS} onChange={sf("shadow")} />
            <SelectField label="Opacity" value={config.opacity} options={OPACITY_OPTIONS} onChange={sf("opacity")} />
            <SelectField label="Transition" value={config.transition} options={TRANSITION_OPTIONS} onChange={sf("transition")} />
            <SelectField label="Cursor" value={config.cursor} options={CURSOR_OPTIONS} onChange={sf("cursor")} />
          </div>
        </Section>

        {/* Custom classes */}
        <Section title="Custom Classes">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
              Additional Tailwind classes (space-separated)
            </label>
            <input
              type="text"
              value={config.customClasses}
              onChange={(e) => update("customClasses", e.target.value)}
              placeholder="e.g. hover:bg-indigo-700 focus:ring-2 sm:text-lg"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-mono dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
              Add responsive, hover, focus, or any classes not covered by the
              dropdowns above.
            </p>
          </div>
        </Section>
      </div>

      {/* ——— Output ——— */}
      <div className="mt-8 space-y-6">
        {/* Class string output */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Class String
            </h2>
            <button
              onClick={copyClasses}
              disabled={!classString}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {copied ? "Copied!" : "Copy Classes"}
            </button>
          </div>
          <pre className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm font-mono text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 overflow-x-auto whitespace-pre-wrap break-all">
            {classString || "(no classes selected)"}
          </pre>
        </div>

        {/* HTML output */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              HTML Output
            </h2>
            <button
              onClick={copyHtml}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
            >
              {copiedHtml ? "Copied!" : "Copy HTML"}
            </button>
          </div>
          <pre className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm font-mono text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 overflow-x-auto whitespace-pre-wrap">
            {htmlOutput}
          </pre>
        </div>
      </div>

      {/* ——— About ——— */}
      <div className="mt-8 space-y-3">
        <details className="rounded-lg border border-gray-200 dark:border-gray-700">
          <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
            About Tailwind CSS
          </summary>
          <div className="border-t border-gray-200 px-4 py-3 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-400 space-y-2">
            <p>
              <strong>Tailwind CSS</strong> is a utility-first CSS framework that
              lets you style elements by composing small, single-purpose classes
              directly in your HTML.
            </p>
            <p>
              Instead of writing custom CSS like{" "}
              <code className="rounded bg-gray-100 px-1 dark:bg-gray-800">
                padding: 1rem; background-color: blue;
              </code>{" "}
              you write{" "}
              <code className="rounded bg-gray-100 px-1 dark:bg-gray-800">
                p-4 bg-blue-500
              </code>{" "}
              directly on the element.
            </p>
            <p>
              This tool helps you explore Tailwind&apos;s utility classes visually.
              Pick properties from the dropdowns, see the live preview update, and
              copy the generated class string into your project.
            </p>
          </div>
        </details>

        <details className="rounded-lg border border-gray-200 dark:border-gray-700">
          <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
            Tips for Using This Generator
          </summary>
          <div className="border-t border-gray-200 px-4 py-3 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-400 space-y-2">
            <p>
              <strong>Start with a preset</strong> — pick a component preset
              (Button, Card, Badge) and tweak from there.
            </p>
            <p>
              <strong>Use the Custom Classes field</strong> for responsive prefixes
              (<code className="rounded bg-gray-100 px-1 dark:bg-gray-800">sm:</code>,{" "}
              <code className="rounded bg-gray-100 px-1 dark:bg-gray-800">md:</code>,{" "}
              <code className="rounded bg-gray-100 px-1 dark:bg-gray-800">lg:</code>),
              state variants
              (<code className="rounded bg-gray-100 px-1 dark:bg-gray-800">hover:</code>,{" "}
              <code className="rounded bg-gray-100 px-1 dark:bg-gray-800">focus:</code>,{" "}
              <code className="rounded bg-gray-100 px-1 dark:bg-gray-800">active:</code>),
              and dark mode
              (<code className="rounded bg-gray-100 px-1 dark:bg-gray-800">dark:</code>).
            </p>
            <p>
              <strong>Padding vs. Padding X/Y</strong> — if you set both{" "}
              <code className="rounded bg-gray-100 px-1 dark:bg-gray-800">p-*</code>{" "}
              and{" "}
              <code className="rounded bg-gray-100 px-1 dark:bg-gray-800">px-*/py-*</code>,
              the axis-specific values will override the all-sides value in the
              browser. Choose one or the other.
            </p>
          </div>
        </details>
      </div>
    </div>
  );
}

// --- Sub-components ---

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="border-b border-gray-200 bg-gray-50 px-4 py-2.5 dark:border-gray-700 dark:bg-gray-800/50">
        <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {title}
        </h2>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}
