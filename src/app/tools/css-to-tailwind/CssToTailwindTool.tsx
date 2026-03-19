"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useSmartPasteInput } from "@/hooks/useSmartPasteInput";
import RateLimitBanner from "@/components/RateLimitBanner";

// ── CSS value → Tailwind class mappings ──

const SPACING_SCALE: Record<string, string> = {
  "0": "0",
  "0px": "0",
  "1px": "px",
  "0.125rem": "0.5",
  "2px": "0.5",
  "0.25rem": "1",
  "4px": "1",
  "0.375rem": "1.5",
  "6px": "1.5",
  "0.5rem": "2",
  "8px": "2",
  "0.625rem": "2.5",
  "10px": "2.5",
  "0.75rem": "3",
  "12px": "3",
  "0.875rem": "3.5",
  "14px": "3.5",
  "1rem": "4",
  "16px": "4",
  "1.25rem": "5",
  "20px": "5",
  "1.5rem": "6",
  "24px": "6",
  "1.75rem": "7",
  "28px": "7",
  "2rem": "8",
  "32px": "8",
  "2.25rem": "9",
  "36px": "9",
  "2.5rem": "10",
  "40px": "10",
  "2.75rem": "11",
  "44px": "11",
  "3rem": "12",
  "48px": "12",
  "3.5rem": "14",
  "56px": "14",
  "4rem": "16",
  "64px": "16",
  "5rem": "20",
  "80px": "20",
  "6rem": "24",
  "96px": "24",
  "7rem": "28",
  "112px": "28",
  "8rem": "32",
  "128px": "32",
  "9rem": "36",
  "144px": "36",
  "10rem": "40",
  "160px": "40",
  "11rem": "44",
  "176px": "44",
  "12rem": "48",
  "192px": "48",
  "13rem": "52",
  "208px": "52",
  "14rem": "56",
  "224px": "56",
  "15rem": "60",
  "240px": "60",
  "16rem": "64",
  "256px": "64",
  "18rem": "72",
  "288px": "72",
  "20rem": "80",
  "320px": "80",
  "24rem": "96",
  "384px": "96",
  "auto": "auto",
  "100%": "full",
  "100vw": "screen",
  "100vh": "screen",
  "min-content": "min",
  "max-content": "max",
  "fit-content": "fit",
  "50%": "1/2",
  "33.333333%": "1/3",
  "66.666667%": "2/3",
  "25%": "1/4",
  "75%": "3/4",
};

const FONT_SIZE_MAP: Record<string, string> = {
  "0.75rem": "text-xs",
  "12px": "text-xs",
  "0.875rem": "text-sm",
  "14px": "text-sm",
  "1rem": "text-base",
  "16px": "text-base",
  "1.125rem": "text-lg",
  "18px": "text-lg",
  "1.25rem": "text-xl",
  "20px": "text-xl",
  "1.5rem": "text-2xl",
  "24px": "text-2xl",
  "1.875rem": "text-3xl",
  "30px": "text-3xl",
  "2.25rem": "text-4xl",
  "36px": "text-4xl",
  "3rem": "text-5xl",
  "48px": "text-5xl",
  "3.75rem": "text-6xl",
  "60px": "text-6xl",
  "4.5rem": "text-7xl",
  "72px": "text-7xl",
  "6rem": "text-8xl",
  "96px": "text-8xl",
  "8rem": "text-9xl",
  "128px": "text-9xl",
};

const FONT_WEIGHT_MAP: Record<string, string> = {
  "100": "font-thin",
  "200": "font-extralight",
  "300": "font-light",
  "400": "font-normal",
  "500": "font-medium",
  "600": "font-semibold",
  "700": "font-bold",
  "800": "font-extrabold",
  "900": "font-black",
  thin: "font-thin",
  normal: "font-normal",
  bold: "font-bold",
};

const LINE_HEIGHT_MAP: Record<string, string> = {
  "1": "leading-none",
  "1.25": "leading-tight",
  "1.375": "leading-snug",
  "1.5": "leading-normal",
  "1.625": "leading-relaxed",
  "2": "leading-loose",
  "0.75rem": "leading-3",
  "1rem": "leading-4",
  "1.25rem": "leading-5",
  "1.5rem": "leading-6",
  "1.75rem": "leading-7",
  "2rem": "leading-8",
  "2.25rem": "leading-9",
  "2.5rem": "leading-10",
};

const BORDER_RADIUS_MAP: Record<string, string> = {
  "0": "rounded-none",
  "0px": "rounded-none",
  "0.125rem": "rounded-sm",
  "2px": "rounded-sm",
  "0.25rem": "rounded",
  "4px": "rounded",
  "0.375rem": "rounded-md",
  "6px": "rounded-md",
  "0.5rem": "rounded-lg",
  "8px": "rounded-lg",
  "0.75rem": "rounded-xl",
  "12px": "rounded-xl",
  "1rem": "rounded-2xl",
  "16px": "rounded-2xl",
  "1.5rem": "rounded-3xl",
  "24px": "rounded-3xl",
  "9999px": "rounded-full",
  "50%": "rounded-full",
};

const BORDER_WIDTH_MAP: Record<string, string> = {
  "0": "border-0",
  "0px": "border-0",
  "1px": "border",
  "2px": "border-2",
  "4px": "border-4",
  "8px": "border-8",
};

const OPACITY_MAP: Record<string, string> = {
  "0": "opacity-0",
  "0.05": "opacity-5",
  "0.1": "opacity-10",
  "0.15": "opacity-15",
  "0.2": "opacity-20",
  "0.25": "opacity-25",
  "0.3": "opacity-30",
  "0.35": "opacity-35",
  "0.4": "opacity-40",
  "0.45": "opacity-45",
  "0.5": "opacity-50",
  "0.55": "opacity-55",
  "0.6": "opacity-60",
  "0.65": "opacity-65",
  "0.7": "opacity-70",
  "0.75": "opacity-75",
  "0.8": "opacity-80",
  "0.85": "opacity-85",
  "0.9": "opacity-90",
  "0.95": "opacity-95",
  "1": "opacity-100",
};

const Z_INDEX_MAP: Record<string, string> = {
  "0": "z-0",
  "10": "z-10",
  "20": "z-20",
  "30": "z-30",
  "40": "z-40",
  "50": "z-50",
  "auto": "z-auto",
};

// Named colors → Tailwind palette (common ones)
const COLOR_MAP: Record<string, string> = {
  transparent: "transparent",
  currentcolor: "current",
  currentColor: "current",
  black: "black",
  "#000": "black",
  "#000000": "black",
  "rgb(0, 0, 0)": "black",
  "rgb(0,0,0)": "black",
  white: "white",
  "#fff": "white",
  "#ffffff": "white",
  "#FFF": "white",
  "#FFFFFF": "white",
  "rgb(255, 255, 255)": "white",
  "rgb(255,255,255)": "white",
  inherit: "inherit",
};

const TRANSITION_PROP_MAP: Record<string, string> = {
  all: "transition-all",
  none: "transition-none",
  color: "transition-colors",
  "background-color": "transition-colors",
  "border-color": "transition-colors",
  opacity: "transition-opacity",
  "box-shadow": "transition-shadow",
  transform: "transition-transform",
};

const TRANSITION_DURATION_MAP: Record<string, string> = {
  "75ms": "duration-75",
  "100ms": "duration-100",
  "150ms": "duration-150",
  "200ms": "duration-200",
  "300ms": "duration-300",
  "500ms": "duration-500",
  "700ms": "duration-700",
  "1000ms": "duration-1000",
  "1s": "duration-1000",
  "0.075s": "duration-75",
  "0.1s": "duration-100",
  "0.15s": "duration-150",
  "0.2s": "duration-200",
  "0.3s": "duration-300",
  "0.5s": "duration-500",
  "0.7s": "duration-700",
};

const TIMING_FN_MAP: Record<string, string> = {
  linear: "ease-linear",
  ease: "ease-out",
  "ease-in": "ease-in",
  "ease-out": "ease-out",
  "ease-in-out": "ease-in-out",
};

const CURSOR_MAP: Record<string, string> = {
  auto: "cursor-auto",
  default: "cursor-default",
  pointer: "cursor-pointer",
  wait: "cursor-wait",
  text: "cursor-text",
  move: "cursor-move",
  help: "cursor-help",
  "not-allowed": "cursor-not-allowed",
  none: "cursor-none",
  crosshair: "cursor-crosshair",
  grab: "cursor-grab",
  grabbing: "cursor-grabbing",
};

const BOX_SHADOW_MAP: Record<string, string> = {
  none: "shadow-none",
  "0 1px 2px 0 rgb(0 0 0 / 0.05)": "shadow-sm",
  "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)": "shadow",
  "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)": "shadow-md",
  "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)": "shadow-lg",
  "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)": "shadow-xl",
  "0 25px 50px -12px rgb(0 0 0 / 0.25)": "shadow-2xl",
  "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)": "shadow-inner",
};

// ── Converter logic ──

interface ConvertedRule {
  selector: string;
  classes: string[];
  unconverted: string[];
}

function spacingToTw(prefix: string, value: string): string | null {
  const v = value.trim();
  const scale = SPACING_SCALE[v];
  if (scale !== undefined) return `${prefix}-${scale}`;
  // negative values
  if (v.startsWith("-")) {
    const pos = v.slice(1);
    const s = SPACING_SCALE[pos];
    if (s !== undefined) return `-${prefix}-${s}`;
  }
  return null;
}

function colorToTw(prefix: string, value: string): string | null {
  const v = value.trim().toLowerCase();
  const mapped = COLOR_MAP[v] || COLOR_MAP[value.trim()];
  if (mapped) return `${prefix}-${mapped}`;
  return null;
}

function convertProperty(prop: string, value: string): { classes: string[]; unconverted: string | null } {
  const v = value.trim();
  const classes: string[] = [];

  switch (prop) {
    // ── Display ──
    case "display":
      if (["block", "inline-block", "inline", "flex", "inline-flex", "grid", "inline-grid", "table", "table-row", "table-cell", "contents", "list-item", "hidden", "flow-root"].includes(v)) {
        classes.push(v === "none" ? "hidden" : v);
        return { classes, unconverted: null };
      }
      if (v === "none") {
        classes.push("hidden");
        return { classes, unconverted: null };
      }
      break;

    // ── Position ──
    case "position":
      if (["static", "fixed", "absolute", "relative", "sticky"].includes(v)) {
        classes.push(v);
        return { classes, unconverted: null };
      }
      break;

    // ── Top/Right/Bottom/Left ──
    case "top":
    case "right":
    case "bottom":
    case "left": {
      const tw = spacingToTw(prop, v);
      if (tw) { classes.push(tw); return { classes, unconverted: null }; }
      break;
    }
    case "inset":
      if (v === "0" || v === "0px") {
        classes.push("inset-0");
        return { classes, unconverted: null };
      }
      break;

    // ── Flex ──
    case "flex-direction":
      if (v === "row") classes.push("flex-row");
      else if (v === "row-reverse") classes.push("flex-row-reverse");
      else if (v === "column") classes.push("flex-col");
      else if (v === "column-reverse") classes.push("flex-col-reverse");
      if (classes.length) return { classes, unconverted: null };
      break;

    case "flex-wrap":
      if (v === "wrap") classes.push("flex-wrap");
      else if (v === "nowrap") classes.push("flex-nowrap");
      else if (v === "wrap-reverse") classes.push("flex-wrap-reverse");
      if (classes.length) return { classes, unconverted: null };
      break;

    case "flex":
      if (v === "1 1 0%" || v === "1") classes.push("flex-1");
      else if (v === "1 1 auto") classes.push("flex-auto");
      else if (v === "0 1 auto" || v === "initial") classes.push("flex-initial");
      else if (v === "none" || v === "0 0 auto") classes.push("flex-none");
      if (classes.length) return { classes, unconverted: null };
      break;

    case "flex-grow":
      if (v === "1") classes.push("grow");
      else if (v === "0") classes.push("grow-0");
      if (classes.length) return { classes, unconverted: null };
      break;

    case "flex-shrink":
      if (v === "1") classes.push("shrink");
      else if (v === "0") classes.push("shrink-0");
      if (classes.length) return { classes, unconverted: null };
      break;

    case "order":
      if (v === "0") classes.push("order-none");
      else if (/^-?\d+$/.test(v)) {
        const n = parseInt(v);
        if (n >= 1 && n <= 12) classes.push(`order-${n}`);
        else if (n === -9999) classes.push("order-first");
        else if (n === 9999) classes.push("order-last");
        else classes.push(`order-[${v}]`);
      }
      if (classes.length) return { classes, unconverted: null };
      break;

    // ── Grid ──
    case "grid-template-columns": {
      const match = v.match(/^repeat\((\d+),\s*1fr\)$/);
      if (match) { classes.push(`grid-cols-${match[1]}`); return { classes, unconverted: null }; }
      if (v === "none") { classes.push("grid-cols-none"); return { classes, unconverted: null }; }
      break;
    }
    case "grid-template-rows": {
      const match = v.match(/^repeat\((\d+),\s*1fr\)$/);
      if (match) { classes.push(`grid-rows-${match[1]}`); return { classes, unconverted: null }; }
      if (v === "none") { classes.push("grid-rows-none"); return { classes, unconverted: null }; }
      break;
    }

    // ── Gap ──
    case "gap": {
      const tw = spacingToTw("gap", v);
      if (tw) { classes.push(tw); return { classes, unconverted: null }; }
      break;
    }
    case "row-gap": {
      const tw = spacingToTw("gap-y", v);
      if (tw) { classes.push(tw); return { classes, unconverted: null }; }
      break;
    }
    case "column-gap": {
      const tw = spacingToTw("gap-x", v);
      if (tw) { classes.push(tw); return { classes, unconverted: null }; }
      break;
    }

    // ── Alignment ──
    case "justify-content":
      if (v === "flex-start" || v === "start") classes.push("justify-start");
      else if (v === "flex-end" || v === "end") classes.push("justify-end");
      else if (v === "center") classes.push("justify-center");
      else if (v === "space-between") classes.push("justify-between");
      else if (v === "space-around") classes.push("justify-around");
      else if (v === "space-evenly") classes.push("justify-evenly");
      if (classes.length) return { classes, unconverted: null };
      break;

    case "align-items":
      if (v === "flex-start" || v === "start") classes.push("items-start");
      else if (v === "flex-end" || v === "end") classes.push("items-end");
      else if (v === "center") classes.push("items-center");
      else if (v === "baseline") classes.push("items-baseline");
      else if (v === "stretch") classes.push("items-stretch");
      if (classes.length) return { classes, unconverted: null };
      break;

    case "align-self":
      if (v === "auto") classes.push("self-auto");
      else if (v === "flex-start" || v === "start") classes.push("self-start");
      else if (v === "flex-end" || v === "end") classes.push("self-end");
      else if (v === "center") classes.push("self-center");
      else if (v === "stretch") classes.push("self-stretch");
      else if (v === "baseline") classes.push("self-baseline");
      if (classes.length) return { classes, unconverted: null };
      break;

    case "align-content":
      if (v === "flex-start" || v === "start") classes.push("content-start");
      else if (v === "flex-end" || v === "end") classes.push("content-end");
      else if (v === "center") classes.push("content-center");
      else if (v === "space-between") classes.push("content-between");
      else if (v === "space-around") classes.push("content-around");
      else if (v === "space-evenly") classes.push("content-evenly");
      else if (v === "baseline") classes.push("content-baseline");
      if (classes.length) return { classes, unconverted: null };
      break;

    case "place-content":
      if (v === "center") { classes.push("place-content-center"); return { classes, unconverted: null }; }
      break;

    case "place-items":
      if (v === "center") { classes.push("place-items-center"); return { classes, unconverted: null }; }
      if (v === "start") { classes.push("place-items-start"); return { classes, unconverted: null }; }
      if (v === "end") { classes.push("place-items-end"); return { classes, unconverted: null }; }
      if (v === "stretch") { classes.push("place-items-stretch"); return { classes, unconverted: null }; }
      break;

    // ── Width / Height ──
    case "width": {
      const tw = spacingToTw("w", v);
      if (tw) { classes.push(tw); return { classes, unconverted: null }; }
      break;
    }
    case "height": {
      const tw = spacingToTw("h", v);
      if (tw) { classes.push(tw); return { classes, unconverted: null }; }
      break;
    }
    case "min-width": {
      if (v === "0" || v === "0px") { classes.push("min-w-0"); return { classes, unconverted: null }; }
      if (v === "100%") { classes.push("min-w-full"); return { classes, unconverted: null }; }
      if (v === "min-content") { classes.push("min-w-min"); return { classes, unconverted: null }; }
      if (v === "max-content") { classes.push("min-w-max"); return { classes, unconverted: null }; }
      break;
    }
    case "max-width": {
      if (v === "none") { classes.push("max-w-none"); return { classes, unconverted: null }; }
      if (v === "100%") { classes.push("max-w-full"); return { classes, unconverted: null }; }
      if (v === "min-content") { classes.push("max-w-min"); return { classes, unconverted: null }; }
      if (v === "max-content") { classes.push("max-w-max"); return { classes, unconverted: null }; }
      if (v === "fit-content") { classes.push("max-w-fit"); return { classes, unconverted: null }; }
      const maxWidthMap: Record<string, string> = {
        "20rem": "max-w-xs", "24rem": "max-w-sm", "28rem": "max-w-md",
        "32rem": "max-w-lg", "36rem": "max-w-xl", "42rem": "max-w-2xl",
        "48rem": "max-w-3xl", "56rem": "max-w-4xl", "64rem": "max-w-5xl",
        "72rem": "max-w-6xl", "80rem": "max-w-7xl",
        "320px": "max-w-xs", "384px": "max-w-sm", "448px": "max-w-md",
        "512px": "max-w-lg", "576px": "max-w-xl", "672px": "max-w-2xl",
        "768px": "max-w-3xl", "896px": "max-w-4xl", "1024px": "max-w-5xl",
        "1152px": "max-w-6xl", "1280px": "max-w-7xl",
      };
      if (maxWidthMap[v]) { classes.push(maxWidthMap[v]); return { classes, unconverted: null }; }
      break;
    }
    case "min-height": {
      if (v === "0" || v === "0px") { classes.push("min-h-0"); return { classes, unconverted: null }; }
      if (v === "100%") { classes.push("min-h-full"); return { classes, unconverted: null }; }
      if (v === "100vh") { classes.push("min-h-screen"); return { classes, unconverted: null }; }
      if (v === "100dvh") { classes.push("min-h-dvh"); return { classes, unconverted: null }; }
      break;
    }
    case "max-height": {
      if (v === "none") { classes.push("max-h-none"); return { classes, unconverted: null }; }
      if (v === "100%") { classes.push("max-h-full"); return { classes, unconverted: null }; }
      if (v === "100vh") { classes.push("max-h-screen"); return { classes, unconverted: null }; }
      const tw = spacingToTw("max-h", v);
      if (tw) { classes.push(tw); return { classes, unconverted: null }; }
      break;
    }

    // ── Padding ──
    case "padding": {
      const parts = v.split(/\s+/);
      if (parts.length === 1) {
        const tw = spacingToTw("p", parts[0]);
        if (tw) { classes.push(tw); return { classes, unconverted: null }; }
      } else if (parts.length === 2) {
        const py = spacingToTw("py", parts[0]);
        const px = spacingToTw("px", parts[1]);
        if (py && px) { classes.push(py, px); return { classes, unconverted: null }; }
      } else if (parts.length === 4) {
        const pt = spacingToTw("pt", parts[0]);
        const pr = spacingToTw("pr", parts[1]);
        const pb = spacingToTw("pb", parts[2]);
        const pl = spacingToTw("pl", parts[3]);
        if (pt && pr && pb && pl) { classes.push(pt, pr, pb, pl); return { classes, unconverted: null }; }
      }
      break;
    }
    case "padding-top": { const tw = spacingToTw("pt", v); if (tw) { classes.push(tw); return { classes, unconverted: null }; } break; }
    case "padding-right": { const tw = spacingToTw("pr", v); if (tw) { classes.push(tw); return { classes, unconverted: null }; } break; }
    case "padding-bottom": { const tw = spacingToTw("pb", v); if (tw) { classes.push(tw); return { classes, unconverted: null }; } break; }
    case "padding-left": { const tw = spacingToTw("pl", v); if (tw) { classes.push(tw); return { classes, unconverted: null }; } break; }

    // ── Margin ──
    case "margin": {
      const parts = v.split(/\s+/);
      if (parts.length === 1) {
        if (v === "0 auto" || v === "auto") { classes.push("mx-auto"); return { classes, unconverted: null }; }
        const tw = spacingToTw("m", parts[0]);
        if (tw) { classes.push(tw); return { classes, unconverted: null }; }
      } else if (parts.length === 2) {
        if (parts[1] === "auto") {
          const my = spacingToTw("my", parts[0]);
          if (my) { classes.push(my, "mx-auto"); return { classes, unconverted: null }; }
        }
        const my = spacingToTw("my", parts[0]);
        const mx = spacingToTw("mx", parts[1]);
        if (my && mx) { classes.push(my, mx); return { classes, unconverted: null }; }
      } else if (parts.length === 4) {
        const mt = spacingToTw("mt", parts[0]);
        const mr = spacingToTw("mr", parts[1]);
        const mb = spacingToTw("mb", parts[2]);
        const ml = spacingToTw("ml", parts[3]);
        if (mt && mr && mb && ml) { classes.push(mt, mr, mb, ml); return { classes, unconverted: null }; }
      }
      break;
    }
    case "margin-top": { const tw = spacingToTw("mt", v); if (tw) { classes.push(tw); return { classes, unconverted: null }; } break; }
    case "margin-right": { const tw = spacingToTw("mr", v); if (tw) { classes.push(tw); return { classes, unconverted: null }; } break; }
    case "margin-bottom": { const tw = spacingToTw("mb", v); if (tw) { classes.push(tw); return { classes, unconverted: null }; } break; }
    case "margin-left": { const tw = spacingToTw("ml", v); if (tw) { classes.push(tw); return { classes, unconverted: null }; } break; }

    // ── Typography ──
    case "font-size": {
      const mapped = FONT_SIZE_MAP[v];
      if (mapped) { classes.push(mapped); return { classes, unconverted: null }; }
      break;
    }
    case "font-weight": {
      const mapped = FONT_WEIGHT_MAP[v];
      if (mapped) { classes.push(mapped); return { classes, unconverted: null }; }
      break;
    }
    case "font-style":
      if (v === "italic") { classes.push("italic"); return { classes, unconverted: null }; }
      if (v === "normal") { classes.push("not-italic"); return { classes, unconverted: null }; }
      break;

    case "font-family":
      if (/sans-serif/i.test(v)) { classes.push("font-sans"); return { classes, unconverted: null }; }
      if (/serif/i.test(v) && !/sans-serif/i.test(v)) { classes.push("font-serif"); return { classes, unconverted: null }; }
      if (/mono|monospace|consolas|courier/i.test(v)) { classes.push("font-mono"); return { classes, unconverted: null }; }
      break;

    case "line-height": {
      const mapped = LINE_HEIGHT_MAP[v];
      if (mapped) { classes.push(mapped); return { classes, unconverted: null }; }
      break;
    }
    case "letter-spacing": {
      const lsMap: Record<string, string> = {
        "-0.05em": "tracking-tighter", "-0.025em": "tracking-tight",
        "0": "tracking-normal", "0em": "tracking-normal",
        "0.025em": "tracking-wide", "0.05em": "tracking-wider",
        "0.1em": "tracking-widest",
      };
      if (lsMap[v]) { classes.push(lsMap[v]); return { classes, unconverted: null }; }
      break;
    }

    case "text-align":
      if (["left", "center", "right", "justify", "start", "end"].includes(v)) {
        classes.push(`text-${v}`);
        return { classes, unconverted: null };
      }
      break;

    case "text-decoration":
    case "text-decoration-line":
      if (v === "underline") { classes.push("underline"); return { classes, unconverted: null }; }
      if (v === "overline") { classes.push("overline"); return { classes, unconverted: null }; }
      if (v === "line-through") { classes.push("line-through"); return { classes, unconverted: null }; }
      if (v === "none") { classes.push("no-underline"); return { classes, unconverted: null }; }
      break;

    case "text-transform":
      if (v === "uppercase") { classes.push("uppercase"); return { classes, unconverted: null }; }
      if (v === "lowercase") { classes.push("lowercase"); return { classes, unconverted: null }; }
      if (v === "capitalize") { classes.push("capitalize"); return { classes, unconverted: null }; }
      if (v === "none") { classes.push("normal-case"); return { classes, unconverted: null }; }
      break;

    case "white-space":
      if (v === "normal") { classes.push("whitespace-normal"); return { classes, unconverted: null }; }
      if (v === "nowrap") { classes.push("whitespace-nowrap"); return { classes, unconverted: null }; }
      if (v === "pre") { classes.push("whitespace-pre"); return { classes, unconverted: null }; }
      if (v === "pre-line") { classes.push("whitespace-pre-line"); return { classes, unconverted: null }; }
      if (v === "pre-wrap") { classes.push("whitespace-pre-wrap"); return { classes, unconverted: null }; }
      if (v === "break-spaces") { classes.push("whitespace-break-spaces"); return { classes, unconverted: null }; }
      break;

    case "word-break":
      if (v === "break-all") { classes.push("break-all"); return { classes, unconverted: null }; }
      if (v === "keep-all") { classes.push("break-keep"); return { classes, unconverted: null }; }
      break;

    case "overflow-wrap":
    case "word-wrap":
      if (v === "break-word") { classes.push("break-words"); return { classes, unconverted: null }; }
      break;

    case "text-overflow":
      if (v === "ellipsis") { classes.push("text-ellipsis"); return { classes, unconverted: null }; }
      if (v === "clip") { classes.push("text-clip"); return { classes, unconverted: null }; }
      break;

    case "vertical-align":
      if (["baseline", "top", "middle", "bottom", "text-top", "text-bottom", "sub", "super"].includes(v)) {
        classes.push(`align-${v}`);
        return { classes, unconverted: null };
      }
      break;

    case "list-style-type":
      if (v === "none") { classes.push("list-none"); return { classes, unconverted: null }; }
      if (v === "disc") { classes.push("list-disc"); return { classes, unconverted: null }; }
      if (v === "decimal") { classes.push("list-decimal"); return { classes, unconverted: null }; }
      break;

    case "list-style-position":
      if (v === "inside") { classes.push("list-inside"); return { classes, unconverted: null }; }
      if (v === "outside") { classes.push("list-outside"); return { classes, unconverted: null }; }
      break;

    // ── Colors ──
    case "color": {
      const tw = colorToTw("text", v);
      if (tw) { classes.push(tw); return { classes, unconverted: null }; }
      break;
    }
    case "background-color": {
      const tw = colorToTw("bg", v);
      if (tw) { classes.push(tw); return { classes, unconverted: null }; }
      break;
    }
    case "background":
      if (!v.includes("gradient") && !v.includes("url(")) {
        const tw = colorToTw("bg", v);
        if (tw) { classes.push(tw); return { classes, unconverted: null }; }
      }
      break;

    // ── Border ──
    case "border": {
      if (v === "none" || v === "0") { classes.push("border-0"); return { classes, unconverted: null }; }
      // Parse shorthand: width style color
      const borderParts = v.split(/\s+/);
      if (borderParts.length >= 1) {
        const bw = BORDER_WIDTH_MAP[borderParts[0]];
        if (bw) classes.push(bw);
        if (borderParts.length >= 2 && borderParts[1] === "solid") classes.push("border-solid");
        else if (borderParts.length >= 2 && borderParts[1] === "dashed") classes.push("border-dashed");
        else if (borderParts.length >= 2 && borderParts[1] === "dotted") classes.push("border-dotted");
        else if (borderParts.length >= 2 && borderParts[1] === "double") classes.push("border-double");
        else if (borderParts.length >= 2 && borderParts[1] === "none") classes.push("border-none");
        if (borderParts.length >= 3) {
          const bc = colorToTw("border", borderParts.slice(2).join(" "));
          if (bc) classes.push(bc);
        }
        if (classes.length) return { classes, unconverted: null };
      }
      break;
    }
    case "border-width": {
      const bw = BORDER_WIDTH_MAP[v];
      if (bw) { classes.push(bw); return { classes, unconverted: null }; }
      break;
    }
    case "border-style":
      if (["solid", "dashed", "dotted", "double", "none", "hidden"].includes(v)) {
        classes.push(`border-${v}`);
        return { classes, unconverted: null };
      }
      break;
    case "border-color": {
      const tw = colorToTw("border", v);
      if (tw) { classes.push(tw); return { classes, unconverted: null }; }
      break;
    }

    case "border-radius": {
      const parts = v.split(/\s+/);
      if (parts.length === 1) {
        const mapped = BORDER_RADIUS_MAP[v];
        if (mapped) { classes.push(mapped); return { classes, unconverted: null }; }
      }
      break;
    }

    // ── Overflow ──
    case "overflow":
      if (["auto", "hidden", "visible", "scroll", "clip"].includes(v)) {
        classes.push(`overflow-${v}`);
        return { classes, unconverted: null };
      }
      break;
    case "overflow-x":
      if (["auto", "hidden", "visible", "scroll", "clip"].includes(v)) {
        classes.push(`overflow-x-${v}`);
        return { classes, unconverted: null };
      }
      break;
    case "overflow-y":
      if (["auto", "hidden", "visible", "scroll", "clip"].includes(v)) {
        classes.push(`overflow-y-${v}`);
        return { classes, unconverted: null };
      }
      break;

    // ── Opacity ──
    case "opacity": {
      const mapped = OPACITY_MAP[v];
      if (mapped) { classes.push(mapped); return { classes, unconverted: null }; }
      break;
    }

    // ── Z-index ──
    case "z-index": {
      const mapped = Z_INDEX_MAP[v];
      if (mapped) { classes.push(mapped); return { classes, unconverted: null }; }
      break;
    }

    // ── Box shadow ──
    case "box-shadow": {
      const mapped = BOX_SHADOW_MAP[v.trim()];
      if (mapped) { classes.push(mapped); return { classes, unconverted: null }; }
      if (v === "none") { classes.push("shadow-none"); return { classes, unconverted: null }; }
      break;
    }

    // ── Cursor ──
    case "cursor": {
      const mapped = CURSOR_MAP[v];
      if (mapped) { classes.push(mapped); return { classes, unconverted: null }; }
      break;
    }

    // ── Pointer events ──
    case "pointer-events":
      if (v === "none") { classes.push("pointer-events-none"); return { classes, unconverted: null }; }
      if (v === "auto") { classes.push("pointer-events-auto"); return { classes, unconverted: null }; }
      break;

    // ── User select ──
    case "user-select":
      if (["none", "text", "all", "auto"].includes(v)) {
        classes.push(`select-${v}`);
        return { classes, unconverted: null };
      }
      break;

    // ── Visibility ──
    case "visibility":
      if (v === "visible") { classes.push("visible"); return { classes, unconverted: null }; }
      if (v === "hidden") { classes.push("invisible"); return { classes, unconverted: null }; }
      if (v === "collapse") { classes.push("collapse"); return { classes, unconverted: null }; }
      break;

    // ── Transition ──
    case "transition-property": {
      const mapped = TRANSITION_PROP_MAP[v];
      if (mapped) { classes.push(mapped); return { classes, unconverted: null }; }
      break;
    }
    case "transition-duration": {
      const mapped = TRANSITION_DURATION_MAP[v];
      if (mapped) { classes.push(mapped); return { classes, unconverted: null }; }
      break;
    }
    case "transition-timing-function": {
      const mapped = TIMING_FN_MAP[v];
      if (mapped) { classes.push(mapped); return { classes, unconverted: null }; }
      break;
    }

    // ── Transform ──
    case "transform":
      if (v === "none") { classes.push("transform-none"); return { classes, unconverted: null }; }
      break;

    // ── Object fit / position ──
    case "object-fit":
      if (["contain", "cover", "fill", "none", "scale-down"].includes(v)) {
        classes.push(`object-${v}`);
        return { classes, unconverted: null };
      }
      break;
    case "object-position":
      if (["bottom", "center", "left", "left-bottom", "left-top", "right", "right-bottom", "right-top", "top"].includes(v)) {
        classes.push(`object-${v}`);
        return { classes, unconverted: null };
      }
      break;

    // ── Aspect ratio ──
    case "aspect-ratio":
      if (v === "auto") { classes.push("aspect-auto"); return { classes, unconverted: null }; }
      if (v === "1 / 1" || v === "1/1") { classes.push("aspect-square"); return { classes, unconverted: null }; }
      if (v === "16 / 9" || v === "16/9") { classes.push("aspect-video"); return { classes, unconverted: null }; }
      break;

    // ── Box sizing ──
    case "box-sizing":
      if (v === "border-box") { classes.push("box-border"); return { classes, unconverted: null }; }
      if (v === "content-box") { classes.push("box-content"); return { classes, unconverted: null }; }
      break;

    // ── Resize ──
    case "resize":
      if (v === "none") { classes.push("resize-none"); return { classes, unconverted: null }; }
      if (v === "both") { classes.push("resize"); return { classes, unconverted: null }; }
      if (v === "vertical") { classes.push("resize-y"); return { classes, unconverted: null }; }
      if (v === "horizontal") { classes.push("resize-x"); return { classes, unconverted: null }; }
      break;

    // ── Appearance ──
    case "appearance":
      if (v === "none") { classes.push("appearance-none"); return { classes, unconverted: null }; }
      if (v === "auto") { classes.push("appearance-auto"); return { classes, unconverted: null }; }
      break;

    // ── Outline ──
    case "outline":
      if (v === "none" || v === "0") { classes.push("outline-none"); return { classes, unconverted: null }; }
      break;
    case "outline-offset":
      if (v === "0" || v === "0px") { classes.push("outline-offset-0"); return { classes, unconverted: null }; }
      if (v === "1px") { classes.push("outline-offset-1"); return { classes, unconverted: null }; }
      if (v === "2px") { classes.push("outline-offset-2"); return { classes, unconverted: null }; }
      if (v === "4px") { classes.push("outline-offset-4"); return { classes, unconverted: null }; }
      if (v === "8px") { classes.push("outline-offset-8"); return { classes, unconverted: null }; }
      break;

    // ── Table ──
    case "border-collapse":
      if (v === "collapse") { classes.push("border-collapse"); return { classes, unconverted: null }; }
      if (v === "separate") { classes.push("border-separate"); return { classes, unconverted: null }; }
      break;
    case "table-layout":
      if (v === "auto") { classes.push("table-auto"); return { classes, unconverted: null }; }
      if (v === "fixed") { classes.push("table-fixed"); return { classes, unconverted: null }; }
      break;

    // ── Scroll ──
    case "scroll-behavior":
      if (v === "smooth") { classes.push("scroll-smooth"); return { classes, unconverted: null }; }
      if (v === "auto") { classes.push("scroll-auto"); return { classes, unconverted: null }; }
      break;

    // ── Content ──
    case "content":
      if (v === "none" || v === '""' || v === "''") { classes.push("content-none"); return { classes, unconverted: null }; }
      break;

    // ── Isolation ──
    case "isolation":
      if (v === "isolate") { classes.push("isolate"); return { classes, unconverted: null }; }
      if (v === "auto") { classes.push("isolation-auto"); return { classes, unconverted: null }; }
      break;

    // ── Mix blend mode ──
    case "mix-blend-mode":
      if (["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"].includes(v)) {
        classes.push(`mix-blend-${v}`);
        return { classes, unconverted: null };
      }
      break;

    // ── Columns ──
    case "columns": {
      if (/^\d+$/.test(v) && parseInt(v) >= 1 && parseInt(v) <= 12) {
        classes.push(`columns-${v}`);
        return { classes, unconverted: null };
      }
      break;
    }

    // ── Accent color ──
    case "accent-color":
      if (v === "auto") { classes.push("accent-auto"); return { classes, unconverted: null }; }
      break;

    // ── Will change ──
    case "will-change":
      if (v === "auto") { classes.push("will-change-auto"); return { classes, unconverted: null }; }
      if (v === "scroll-position") { classes.push("will-change-scroll"); return { classes, unconverted: null }; }
      if (v === "contents") { classes.push("will-change-contents"); return { classes, unconverted: null }; }
      if (v === "transform") { classes.push("will-change-transform"); return { classes, unconverted: null }; }
      break;
  }

  // No match found
  return { classes: [], unconverted: `${prop}: ${v}` };
}

function parseCSS(css: string): ConvertedRule[] {
  const results: ConvertedRule[] = [];
  // Remove multi-line comments
  const cleaned = css.replace(/\/\*[\s\S]*?\*\//g, "");

  // Match rule blocks: selector { declarations }
  const ruleRegex = /([^{}]+)\{([^{}]*)\}/g;
  let match;

  while ((match = ruleRegex.exec(cleaned)) !== null) {
    const selector = match[1].trim();
    const body = match[2].trim();
    const allClasses: string[] = [];
    const allUnconverted: string[] = [];

    // Parse declarations
    const declarations = body.split(";").filter((d) => d.trim());
    for (const decl of declarations) {
      const colonIdx = decl.indexOf(":");
      if (colonIdx < 0) continue;
      const property = decl.slice(0, colonIdx).trim().toLowerCase();
      const value = decl.slice(colonIdx + 1).trim();

      // Strip !important
      const cleanValue = value.replace(/\s*!important\s*$/, "");

      const result = convertProperty(property, cleanValue);
      if (result.classes.length > 0) {
        allClasses.push(...result.classes);
      }
      if (result.unconverted) {
        allUnconverted.push(result.unconverted);
      }
    }

    if (allClasses.length > 0 || allUnconverted.length > 0) {
      results.push({
        selector,
        classes: allClasses,
        unconverted: allUnconverted,
      });
    }
  }

  // Handle declarations without a selector (bare property: value lines)
  if (results.length === 0 && !cleaned.includes("{")) {
    const allClasses: string[] = [];
    const allUnconverted: string[] = [];
    const declarations = cleaned.split(";").filter((d) => d.trim());
    for (const decl of declarations) {
      const colonIdx = decl.indexOf(":");
      if (colonIdx < 0) continue;
      const property = decl.slice(0, colonIdx).trim().toLowerCase();
      const value = decl.slice(colonIdx + 1).trim();
      const cleanValue = value.replace(/\s*!important\s*$/, "");
      const result = convertProperty(property, cleanValue);
      if (result.classes.length > 0) allClasses.push(...result.classes);
      if (result.unconverted) allUnconverted.push(result.unconverted);
    }
    if (allClasses.length > 0 || allUnconverted.length > 0) {
      results.push({ selector: "(inline)", classes: allClasses, unconverted: allUnconverted });
    }
  }

  return results;
}

// ── Sample inputs ──

const SAMPLES: { label: string; css: string }[] = [
  {
    label: "Centered Card",
    css: `.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  margin: 0 auto;
  max-width: 28rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  background-color: white;
}`,
  },
  {
    label: "Button",
    css: `.btn {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: 0.375rem;
  cursor: pointer;
  user-select: none;
  transition-property: all;
  transition-duration: 150ms;
  transition-timing-function: ease-in-out;
}`,
  },
  {
    label: "Grid Layout",
    css: `.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  padding: 1rem 2rem;
  max-width: 72rem;
  margin: 0 auto;
}`,
  },
  {
    label: "Nav Header",
    css: `.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 50;
  padding: 1rem 1.5rem;
  background-color: white;
  border-bottom: 1px solid #000;
}`,
  },
  {
    label: "Typography",
    css: `.title {
  font-size: 2.25rem;
  font-weight: 700;
  line-height: 1.25;
  letter-spacing: -0.025em;
  text-align: center;
  text-transform: uppercase;
  color: black;
}`,
  },
  {
    label: "Overlay",
    css: `.overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: black;
  opacity: 0.5;
  z-index: 50;
  cursor: pointer;
}`,
  },
  {
    label: "Inline Styles",
    css: `display: flex;
align-items: center;
gap: 0.5rem;
padding: 0.75rem 1rem;
font-size: 0.875rem;
font-weight: 500;
border-radius: 0.25rem;
overflow: hidden;
white-space: nowrap;
text-overflow: ellipsis;`,
  },
];

// ── Component ──

export default function CssToTailwindTool() {
  const [css, setCss] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const { trackAction } = useToolAnalytics("css-to-tailwind");
  const { remaining, dailyLimit, isLimited, recordUsage } =
    useRateLimit("css-to-tailwind");
  useSmartPasteInput(setCss);

  const results = css.trim() ? parseCSS(css) : [];
  const totalClasses = results.reduce((sum, r) => sum + r.classes.length, 0);
  const totalUnconverted = results.reduce((sum, r) => sum + r.unconverted.length, 0);

  const handleConvert = useCallback(() => {
    if (isLimited) return;
    recordUsage();
    trackAction("convert");
  }, [isLimited, recordUsage, trackAction]);

  const handleLoadSample = useCallback(
    (sample: (typeof SAMPLES)[number]) => {
      setCss(sample.css);
      handleConvert();
    },
    [handleConvert],
  );

  const handleCopy = useCallback(
    (text: string, id: string) => {
      navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(null), 1500);
    },
    [],
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="mb-8 block text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        &larr; Back to tools
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        CSS to Tailwind Converter
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Paste CSS rules or inline styles and get the equivalent Tailwind CSS
        utility classes. Supports 100+ CSS properties including layout, spacing,
        typography, borders, and more.
      </p>

      <RateLimitBanner
        remaining={remaining}
        dailyLimit={dailyLimit}
        isLimited={isLimited}
      />

      {/* Samples */}
      <div className="mb-4 flex flex-wrap gap-2">
        <span className="text-xs text-gray-500 dark:text-gray-400 self-center">
          Samples:
        </span>
        {SAMPLES.map((s) => (
          <button
            key={s.label}
            onClick={() => handleLoadSample(s)}
            className="rounded border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            CSS Input
          </label>
          <textarea
            value={css}
            onChange={(e) => {
              setCss(e.target.value);
              handleConvert();
            }}
            placeholder={`Paste CSS here, e.g.:\n\n.card {\n  display: flex;\n  padding: 1rem;\n  border-radius: 0.5rem;\n}\n\nOr just property: value lines:\n\ndisplay: flex;\npadding: 1rem;`}
            rows={18}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 font-mono text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
            spellCheck={false}
          />
        </div>

        {/* Output */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Tailwind Output
            </label>
            {results.length > 0 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {totalClasses} class{totalClasses !== 1 ? "es" : ""} converted
                {totalUnconverted > 0 && (
                  <span className="text-amber-600 dark:text-amber-400">
                    {" "}
                    &middot; {totalUnconverted} unconverted
                  </span>
                )}
              </span>
            )}
          </div>

          <div className="rounded-lg border border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-900 min-h-[27.5rem] overflow-auto">
            {results.length === 0 ? (
              <div className="flex items-center justify-center h-full min-h-[27.5rem] text-gray-400 dark:text-gray-500 text-sm">
                Paste CSS to see Tailwind classes
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {results.map((rule, idx) => {
                  const classStr = rule.classes.join(" ");
                  return (
                    <div key={idx} className="p-4">
                      {/* Selector */}
                      <div className="flex items-center justify-between mb-2">
                        <code className="text-xs font-mono text-indigo-600 dark:text-indigo-400">
                          {rule.selector}
                        </code>
                        {classStr && (
                          <button
                            onClick={() => handleCopy(classStr, `rule-${idx}`)}
                            className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                          >
                            {copied === `rule-${idx}` ? "Copied!" : "Copy"}
                          </button>
                        )}
                      </div>

                      {/* Tailwind classes */}
                      {rule.classes.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {rule.classes.map((cls, ci) => (
                            <span
                              key={ci}
                              className="inline-block rounded bg-indigo-50 px-2 py-0.5 font-mono text-xs text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                            >
                              {cls}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Class string */}
                      {classStr && (
                        <div className="mt-2 rounded bg-gray-50 px-3 py-2 font-mono text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300 break-all">
                          class=&quot;{classStr}&quot;
                        </div>
                      )}

                      {/* Unconverted */}
                      {rule.unconverted.length > 0 && (
                        <div className="mt-2">
                          <span className="text-[10px] font-medium text-amber-600 dark:text-amber-400 uppercase tracking-wide">
                            Not converted:
                          </span>
                          <div className="mt-1 space-y-0.5">
                            {rule.unconverted.map((u, ui) => (
                              <div
                                key={ui}
                                className="font-mono text-xs text-gray-500 dark:text-gray-400"
                              >
                                {u}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Copy all button */}
      {results.length > 0 && (
        <div className="mt-4 flex gap-3">
          <button
            onClick={() => {
              const all = results
                .map(
                  (r) =>
                    `/* ${r.selector} */\n${r.classes.join(" ")}${
                      r.unconverted.length
                        ? `\n\n/* Unconverted:\n${r.unconverted.join(";\n")}; */`
                        : ""
                    }`,
                )
                .join("\n\n");
              handleCopy(all, "all");
            }}
            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
          >
            {copied === "all" ? "Copied!" : "Copy All"}
          </button>
          <button
            onClick={() => setCss("")}
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Clear
          </button>
        </div>
      )}

      {/* Property reference */}
      <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Supported CSS Properties
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-1 text-xs text-gray-600 dark:text-gray-400">
          {[
            "Layout: display, position, top/right/bottom/left, inset, z-index, overflow, visibility, box-sizing",
            "Flexbox: flex-direction, flex-wrap, flex, flex-grow, flex-shrink, order, justify-content, align-items, align-self, align-content",
            "Grid: grid-template-columns, grid-template-rows, gap, row-gap, column-gap, place-content, place-items",
            "Spacing: padding (all sides), margin (all sides), width, height, min/max width/height",
            "Typography: font-size, font-weight, font-style, font-family, line-height, letter-spacing, text-align, text-decoration, text-transform, white-space, word-break, text-overflow, vertical-align",
            "Colors: color, background-color, border-color (named + hex black/white)",
            "Borders: border, border-width, border-style, border-radius, outline, outline-offset",
            "Effects: opacity, box-shadow, cursor, pointer-events, user-select, transition, transform, mix-blend-mode, will-change",
            "Misc: object-fit, object-position, aspect-ratio, resize, appearance, scroll-behavior, list-style, table-layout, border-collapse, columns, content, isolation, accent-color",
          ].map((group, i) => (
            <div key={i} className="mb-2">
              <div className="font-medium text-gray-700 dark:text-gray-300">
                {group.split(":")[0]}
              </div>
              <div>{group.split(":").slice(1).join(":")}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          About CSS to Tailwind Converter
        </h2>
        <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
          <li>
            <strong>100+ properties</strong> — converts layout, spacing,
            typography, borders, effects, and more.
          </li>
          <li>
            <strong>Full selectors</strong> — handles class rules, ID rules, or
            bare inline style declarations.
          </li>
          <li>
            <strong>Shorthand parsing</strong> — expands padding, margin, and
            border shorthands into individual Tailwind classes.
          </li>
          <li>
            <strong>Unconverted tracking</strong> — properties without a direct
            Tailwind equivalent are flagged so you know what needs custom CSS.
          </li>
          <li>
            Everything runs in your browser — no data is sent over the network.
          </li>
        </ul>
      </div>
    </div>
  );
}
