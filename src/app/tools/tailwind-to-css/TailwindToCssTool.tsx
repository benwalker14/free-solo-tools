"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useSmartPasteInput } from "@/hooks/useSmartPasteInput";
import RateLimitBanner from "@/components/RateLimitBanner";

// ── Tailwind class → CSS property mappings ──

const TAILWIND_TO_CSS: Record<string, string> = {
  // ── Display ──
  block: "display: block;",
  "inline-block": "display: inline-block;",
  inline: "display: inline;",
  flex: "display: flex;",
  "inline-flex": "display: inline-flex;",
  grid: "display: grid;",
  "inline-grid": "display: inline-grid;",
  contents: "display: contents;",
  "flow-root": "display: flow-root;",
  "list-item": "display: list-item;",
  hidden: "display: none;",
  table: "display: table;",
  "table-caption": "display: table-caption;",
  "table-cell": "display: table-cell;",
  "table-column": "display: table-column;",
  "table-column-group": "display: table-column-group;",
  "table-footer-group": "display: table-footer-group;",
  "table-header-group": "display: table-header-group;",
  "table-row-group": "display: table-row-group;",
  "table-row": "display: table-row;",

  // ── Position ──
  static: "position: static;",
  fixed: "position: fixed;",
  absolute: "position: absolute;",
  relative: "position: relative;",
  sticky: "position: sticky;",

  // ── Visibility ──
  visible: "visibility: visible;",
  invisible: "visibility: hidden;",
  collapse: "visibility: collapse;",

  // ── Flex Direction ──
  "flex-row": "flex-direction: row;",
  "flex-row-reverse": "flex-direction: row-reverse;",
  "flex-col": "flex-direction: column;",
  "flex-col-reverse": "flex-direction: column-reverse;",

  // ── Flex Wrap ──
  "flex-wrap": "flex-wrap: wrap;",
  "flex-wrap-reverse": "flex-wrap: wrap-reverse;",
  "flex-nowrap": "flex-wrap: nowrap;",

  // ── Flex ──
  "flex-1": "flex: 1 1 0%;",
  "flex-auto": "flex: 1 1 auto;",
  "flex-initial": "flex: 0 1 auto;",
  "flex-none": "flex: none;",

  // ── Flex Grow / Shrink ──
  grow: "flex-grow: 1;",
  "grow-0": "flex-grow: 0;",
  shrink: "flex-shrink: 1;",
  "shrink-0": "flex-shrink: 0;",

  // ── Justify Content ──
  "justify-normal": "justify-content: normal;",
  "justify-start": "justify-content: flex-start;",
  "justify-end": "justify-content: flex-end;",
  "justify-center": "justify-content: center;",
  "justify-between": "justify-content: space-between;",
  "justify-around": "justify-content: space-around;",
  "justify-evenly": "justify-content: space-evenly;",
  "justify-stretch": "justify-content: stretch;",

  // ── Justify Items ──
  "justify-items-start": "justify-items: start;",
  "justify-items-end": "justify-items: end;",
  "justify-items-center": "justify-items: center;",
  "justify-items-stretch": "justify-items: stretch;",

  // ── Justify Self ──
  "justify-self-auto": "justify-self: auto;",
  "justify-self-start": "justify-self: start;",
  "justify-self-end": "justify-self: end;",
  "justify-self-center": "justify-self: center;",
  "justify-self-stretch": "justify-self: stretch;",

  // ── Align Items ──
  "items-start": "align-items: flex-start;",
  "items-end": "align-items: flex-end;",
  "items-center": "align-items: center;",
  "items-baseline": "align-items: baseline;",
  "items-stretch": "align-items: stretch;",

  // ── Align Content ──
  "content-normal": "align-content: normal;",
  "content-start": "align-content: flex-start;",
  "content-end": "align-content: flex-end;",
  "content-center": "align-content: center;",
  "content-between": "align-content: space-between;",
  "content-around": "align-content: space-around;",
  "content-evenly": "align-content: space-evenly;",
  "content-baseline": "align-content: baseline;",
  "content-stretch": "align-content: stretch;",

  // ── Align Self ──
  "self-auto": "align-self: auto;",
  "self-start": "align-self: flex-start;",
  "self-end": "align-self: flex-end;",
  "self-center": "align-self: center;",
  "self-stretch": "align-self: stretch;",
  "self-baseline": "align-self: baseline;",

  // ── Place Content / Items / Self ──
  "place-content-center": "place-content: center;",
  "place-content-start": "place-content: start;",
  "place-content-end": "place-content: end;",
  "place-content-between": "place-content: space-between;",
  "place-content-around": "place-content: space-around;",
  "place-content-evenly": "place-content: space-evenly;",
  "place-content-baseline": "place-content: baseline;",
  "place-content-stretch": "place-content: stretch;",
  "place-items-start": "place-items: start;",
  "place-items-end": "place-items: end;",
  "place-items-center": "place-items: center;",
  "place-items-stretch": "place-items: stretch;",
  "place-items-baseline": "place-items: baseline;",
  "place-self-auto": "place-self: auto;",
  "place-self-start": "place-self: start;",
  "place-self-end": "place-self: end;",
  "place-self-center": "place-self: center;",
  "place-self-stretch": "place-self: stretch;",

  // ── Font Weight ──
  "font-thin": "font-weight: 100;",
  "font-extralight": "font-weight: 200;",
  "font-light": "font-weight: 300;",
  "font-normal": "font-weight: 400;",
  "font-medium": "font-weight: 500;",
  "font-semibold": "font-weight: 600;",
  "font-bold": "font-weight: 700;",
  "font-extrabold": "font-weight: 800;",
  "font-black": "font-weight: 900;",

  // ── Font Size ──
  "text-xs": "font-size: 0.75rem;\nline-height: 1rem;",
  "text-sm": "font-size: 0.875rem;\nline-height: 1.25rem;",
  "text-base": "font-size: 1rem;\nline-height: 1.5rem;",
  "text-lg": "font-size: 1.125rem;\nline-height: 1.75rem;",
  "text-xl": "font-size: 1.25rem;\nline-height: 1.75rem;",
  "text-2xl": "font-size: 1.5rem;\nline-height: 2rem;",
  "text-3xl": "font-size: 1.875rem;\nline-height: 2.25rem;",
  "text-4xl": "font-size: 2.25rem;\nline-height: 2.5rem;",
  "text-5xl": "font-size: 3rem;\nline-height: 1;",
  "text-6xl": "font-size: 3.75rem;\nline-height: 1;",
  "text-7xl": "font-size: 4.5rem;\nline-height: 1;",
  "text-8xl": "font-size: 6rem;\nline-height: 1;",
  "text-9xl": "font-size: 8rem;\nline-height: 1;",

  // ── Font Style ──
  italic: "font-style: italic;",
  "not-italic": "font-style: normal;",

  // ── Font Family ──
  "font-sans":
    'font-family: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";',
  "font-serif":
    'font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;',
  "font-mono":
    'font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;',

  // ── Text Align ──
  "text-left": "text-align: left;",
  "text-center": "text-align: center;",
  "text-right": "text-align: right;",
  "text-justify": "text-align: justify;",
  "text-start": "text-align: start;",
  "text-end": "text-align: end;",

  // ── Text Decoration ──
  underline: "text-decoration-line: underline;",
  overline: "text-decoration-line: overline;",
  "line-through": "text-decoration-line: line-through;",
  "no-underline": "text-decoration-line: none;",

  // ── Text Transform ──
  uppercase: "text-transform: uppercase;",
  lowercase: "text-transform: lowercase;",
  capitalize: "text-transform: capitalize;",
  "normal-case": "text-transform: none;",

  // ── Text Overflow ──
  truncate:
    "overflow: hidden;\ntext-overflow: ellipsis;\nwhite-space: nowrap;",
  "text-ellipsis": "text-overflow: ellipsis;",
  "text-clip": "text-overflow: clip;",

  // ── Line Height ──
  "leading-none": "line-height: 1;",
  "leading-tight": "line-height: 1.25;",
  "leading-snug": "line-height: 1.375;",
  "leading-normal": "line-height: 1.5;",
  "leading-relaxed": "line-height: 1.625;",
  "leading-loose": "line-height: 2;",
  "leading-3": "line-height: 0.75rem;",
  "leading-4": "line-height: 1rem;",
  "leading-5": "line-height: 1.25rem;",
  "leading-6": "line-height: 1.5rem;",
  "leading-7": "line-height: 1.75rem;",
  "leading-8": "line-height: 2rem;",
  "leading-9": "line-height: 2.25rem;",
  "leading-10": "line-height: 2.5rem;",

  // ── Letter Spacing ──
  "tracking-tighter": "letter-spacing: -0.05em;",
  "tracking-tight": "letter-spacing: -0.025em;",
  "tracking-normal": "letter-spacing: 0em;",
  "tracking-wide": "letter-spacing: 0.025em;",
  "tracking-wider": "letter-spacing: 0.05em;",
  "tracking-widest": "letter-spacing: 0.1em;",

  // ── Whitespace ──
  "whitespace-normal": "white-space: normal;",
  "whitespace-nowrap": "white-space: nowrap;",
  "whitespace-pre": "white-space: pre;",
  "whitespace-pre-line": "white-space: pre-line;",
  "whitespace-pre-wrap": "white-space: pre-wrap;",
  "whitespace-break-spaces": "white-space: break-spaces;",

  // ── Word Break ──
  "break-normal": "overflow-wrap: normal;\nword-break: normal;",
  "break-words": "overflow-wrap: break-word;",
  "break-all": "word-break: break-all;",
  "break-keep": "word-break: keep-all;",

  // ── List Style Type ──
  "list-none": "list-style-type: none;",
  "list-disc": "list-style-type: disc;",
  "list-decimal": "list-style-type: decimal;",

  // ── List Style Position ──
  "list-inside": "list-style-position: inside;",
  "list-outside": "list-style-position: outside;",

  // ── Vertical Align ──
  "align-baseline": "vertical-align: baseline;",
  "align-top": "vertical-align: top;",
  "align-middle": "vertical-align: middle;",
  "align-bottom": "vertical-align: bottom;",
  "align-text-top": "vertical-align: text-top;",
  "align-text-bottom": "vertical-align: text-bottom;",
  "align-sub": "vertical-align: sub;",
  "align-super": "vertical-align: super;",

  // ── Border Style ──
  "border-solid": "border-style: solid;",
  "border-dashed": "border-style: dashed;",
  "border-dotted": "border-style: dotted;",
  "border-double": "border-style: double;",
  "border-hidden": "border-style: hidden;",
  "border-none": "border-style: none;",

  // ── Border Width ──
  "border-0": "border-width: 0px;",
  border: "border-width: 1px;",
  "border-2": "border-width: 2px;",
  "border-4": "border-width: 4px;",
  "border-8": "border-width: 8px;",
  "border-t": "border-top-width: 1px;",
  "border-t-0": "border-top-width: 0px;",
  "border-t-2": "border-top-width: 2px;",
  "border-t-4": "border-top-width: 4px;",
  "border-t-8": "border-top-width: 8px;",
  "border-r": "border-right-width: 1px;",
  "border-r-0": "border-right-width: 0px;",
  "border-r-2": "border-right-width: 2px;",
  "border-r-4": "border-right-width: 4px;",
  "border-r-8": "border-right-width: 8px;",
  "border-b": "border-bottom-width: 1px;",
  "border-b-0": "border-bottom-width: 0px;",
  "border-b-2": "border-bottom-width: 2px;",
  "border-b-4": "border-bottom-width: 4px;",
  "border-b-8": "border-bottom-width: 8px;",
  "border-l": "border-left-width: 1px;",
  "border-l-0": "border-left-width: 0px;",
  "border-l-2": "border-left-width: 2px;",
  "border-l-4": "border-left-width: 4px;",
  "border-l-8": "border-left-width: 8px;",
  "border-x": "border-left-width: 1px;\nborder-right-width: 1px;",
  "border-x-0": "border-left-width: 0px;\nborder-right-width: 0px;",
  "border-x-2": "border-left-width: 2px;\nborder-right-width: 2px;",
  "border-x-4": "border-left-width: 4px;\nborder-right-width: 4px;",
  "border-x-8": "border-left-width: 8px;\nborder-right-width: 8px;",
  "border-y": "border-top-width: 1px;\nborder-bottom-width: 1px;",
  "border-y-0": "border-top-width: 0px;\nborder-bottom-width: 0px;",
  "border-y-2": "border-top-width: 2px;\nborder-bottom-width: 2px;",
  "border-y-4": "border-top-width: 4px;\nborder-bottom-width: 4px;",
  "border-y-8": "border-top-width: 8px;\nborder-bottom-width: 8px;",

  // ── Border Radius ──
  "rounded-none": "border-radius: 0px;",
  "rounded-sm": "border-radius: 0.125rem;",
  rounded: "border-radius: 0.25rem;",
  "rounded-md": "border-radius: 0.375rem;",
  "rounded-lg": "border-radius: 0.5rem;",
  "rounded-xl": "border-radius: 0.75rem;",
  "rounded-2xl": "border-radius: 1rem;",
  "rounded-3xl": "border-radius: 1.5rem;",
  "rounded-full": "border-radius: 9999px;",
  "rounded-t-none":
    "border-top-left-radius: 0px;\nborder-top-right-radius: 0px;",
  "rounded-t-sm":
    "border-top-left-radius: 0.125rem;\nborder-top-right-radius: 0.125rem;",
  "rounded-t":
    "border-top-left-radius: 0.25rem;\nborder-top-right-radius: 0.25rem;",
  "rounded-t-md":
    "border-top-left-radius: 0.375rem;\nborder-top-right-radius: 0.375rem;",
  "rounded-t-lg":
    "border-top-left-radius: 0.5rem;\nborder-top-right-radius: 0.5rem;",
  "rounded-t-xl":
    "border-top-left-radius: 0.75rem;\nborder-top-right-radius: 0.75rem;",
  "rounded-t-2xl":
    "border-top-left-radius: 1rem;\nborder-top-right-radius: 1rem;",
  "rounded-t-3xl":
    "border-top-left-radius: 1.5rem;\nborder-top-right-radius: 1.5rem;",
  "rounded-t-full":
    "border-top-left-radius: 9999px;\nborder-top-right-radius: 9999px;",
  "rounded-b-none":
    "border-bottom-left-radius: 0px;\nborder-bottom-right-radius: 0px;",
  "rounded-b-sm":
    "border-bottom-left-radius: 0.125rem;\nborder-bottom-right-radius: 0.125rem;",
  "rounded-b":
    "border-bottom-left-radius: 0.25rem;\nborder-bottom-right-radius: 0.25rem;",
  "rounded-b-md":
    "border-bottom-left-radius: 0.375rem;\nborder-bottom-right-radius: 0.375rem;",
  "rounded-b-lg":
    "border-bottom-left-radius: 0.5rem;\nborder-bottom-right-radius: 0.5rem;",
  "rounded-b-xl":
    "border-bottom-left-radius: 0.75rem;\nborder-bottom-right-radius: 0.75rem;",
  "rounded-b-2xl":
    "border-bottom-left-radius: 1rem;\nborder-bottom-right-radius: 1rem;",
  "rounded-b-3xl":
    "border-bottom-left-radius: 1.5rem;\nborder-bottom-right-radius: 1.5rem;",
  "rounded-b-full":
    "border-bottom-left-radius: 9999px;\nborder-bottom-right-radius: 9999px;",
  "rounded-l-none":
    "border-top-left-radius: 0px;\nborder-bottom-left-radius: 0px;",
  "rounded-l":
    "border-top-left-radius: 0.25rem;\nborder-bottom-left-radius: 0.25rem;",
  "rounded-l-lg":
    "border-top-left-radius: 0.5rem;\nborder-bottom-left-radius: 0.5rem;",
  "rounded-r-none":
    "border-top-right-radius: 0px;\nborder-bottom-right-radius: 0px;",
  "rounded-r":
    "border-top-right-radius: 0.25rem;\nborder-bottom-right-radius: 0.25rem;",
  "rounded-r-lg":
    "border-top-right-radius: 0.5rem;\nborder-bottom-right-radius: 0.5rem;",

  // ── Overflow ──
  "overflow-auto": "overflow: auto;",
  "overflow-hidden": "overflow: hidden;",
  "overflow-clip": "overflow: clip;",
  "overflow-visible": "overflow: visible;",
  "overflow-scroll": "overflow: scroll;",
  "overflow-x-auto": "overflow-x: auto;",
  "overflow-x-hidden": "overflow-x: hidden;",
  "overflow-x-clip": "overflow-x: clip;",
  "overflow-x-visible": "overflow-x: visible;",
  "overflow-x-scroll": "overflow-x: scroll;",
  "overflow-y-auto": "overflow-y: auto;",
  "overflow-y-hidden": "overflow-y: hidden;",
  "overflow-y-clip": "overflow-y: clip;",
  "overflow-y-visible": "overflow-y: visible;",
  "overflow-y-scroll": "overflow-y: scroll;",

  // ── Opacity ──
  "opacity-0": "opacity: 0;",
  "opacity-5": "opacity: 0.05;",
  "opacity-10": "opacity: 0.1;",
  "opacity-15": "opacity: 0.15;",
  "opacity-20": "opacity: 0.2;",
  "opacity-25": "opacity: 0.25;",
  "opacity-30": "opacity: 0.3;",
  "opacity-35": "opacity: 0.35;",
  "opacity-40": "opacity: 0.4;",
  "opacity-45": "opacity: 0.45;",
  "opacity-50": "opacity: 0.5;",
  "opacity-55": "opacity: 0.55;",
  "opacity-60": "opacity: 0.6;",
  "opacity-65": "opacity: 0.65;",
  "opacity-70": "opacity: 0.7;",
  "opacity-75": "opacity: 0.75;",
  "opacity-80": "opacity: 0.8;",
  "opacity-85": "opacity: 0.85;",
  "opacity-90": "opacity: 0.9;",
  "opacity-95": "opacity: 0.95;",
  "opacity-100": "opacity: 1;",

  // ── Z-Index ──
  "z-0": "z-index: 0;",
  "z-10": "z-index: 10;",
  "z-20": "z-index: 20;",
  "z-30": "z-index: 30;",
  "z-40": "z-index: 40;",
  "z-50": "z-index: 50;",
  "z-auto": "z-index: auto;",

  // ── Box Shadow ──
  "shadow-sm": "box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);",
  shadow:
    "box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);",
  "shadow-md":
    "box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);",
  "shadow-lg":
    "box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);",
  "shadow-xl":
    "box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);",
  "shadow-2xl": "box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);",
  "shadow-inner": "box-shadow: inset 0 2px 4px 0 rgb(0 0 0 / 0.05);",
  "shadow-none": "box-shadow: 0 0 #0000;",

  // ── Cursor ──
  "cursor-auto": "cursor: auto;",
  "cursor-default": "cursor: default;",
  "cursor-pointer": "cursor: pointer;",
  "cursor-wait": "cursor: wait;",
  "cursor-text": "cursor: text;",
  "cursor-move": "cursor: move;",
  "cursor-help": "cursor: help;",
  "cursor-not-allowed": "cursor: not-allowed;",
  "cursor-none": "cursor: none;",
  "cursor-crosshair": "cursor: crosshair;",
  "cursor-grab": "cursor: grab;",
  "cursor-grabbing": "cursor: grabbing;",
  "cursor-col-resize": "cursor: col-resize;",
  "cursor-row-resize": "cursor: row-resize;",
  "cursor-zoom-in": "cursor: zoom-in;",
  "cursor-zoom-out": "cursor: zoom-out;",

  // ── Pointer Events ──
  "pointer-events-none": "pointer-events: none;",
  "pointer-events-auto": "pointer-events: auto;",

  // ── User Select ──
  "select-none": "user-select: none;",
  "select-text": "user-select: text;",
  "select-all": "user-select: all;",
  "select-auto": "user-select: auto;",

  // ── Resize ──
  "resize-none": "resize: none;",
  resize: "resize: both;",
  "resize-y": "resize: vertical;",
  "resize-x": "resize: horizontal;",

  // ── Appearance ──
  "appearance-none": "appearance: none;",
  "appearance-auto": "appearance: auto;",

  // ── Object Fit ──
  "object-contain": "object-fit: contain;",
  "object-cover": "object-fit: cover;",
  "object-fill": "object-fit: fill;",
  "object-none": "object-fit: none;",
  "object-scale-down": "object-fit: scale-down;",

  // ── Object Position ──
  "object-bottom": "object-position: bottom;",
  "object-center": "object-position: center;",
  "object-left": "object-position: left;",
  "object-left-bottom": "object-position: left bottom;",
  "object-left-top": "object-position: left top;",
  "object-right": "object-position: right;",
  "object-right-bottom": "object-position: right bottom;",
  "object-right-top": "object-position: right top;",
  "object-top": "object-position: top;",

  // ── Aspect Ratio ──
  "aspect-auto": "aspect-ratio: auto;",
  "aspect-square": "aspect-ratio: 1 / 1;",
  "aspect-video": "aspect-ratio: 16 / 9;",

  // ── Box Sizing ──
  "box-border": "box-sizing: border-box;",
  "box-content": "box-sizing: content-box;",

  // ── Outline ──
  "outline-none":
    "outline: 2px solid transparent;\noutline-offset: 2px;",
  "outline-offset-0": "outline-offset: 0px;",
  "outline-offset-1": "outline-offset: 1px;",
  "outline-offset-2": "outline-offset: 2px;",
  "outline-offset-4": "outline-offset: 4px;",
  "outline-offset-8": "outline-offset: 8px;",

  // ── Table ──
  "border-collapse": "border-collapse: collapse;",
  "border-separate": "border-collapse: separate;",
  "table-auto": "table-layout: auto;",
  "table-fixed": "table-layout: fixed;",

  // ── Scroll ──
  "scroll-smooth": "scroll-behavior: smooth;",
  "scroll-auto": "scroll-behavior: auto;",

  // ── Isolation ──
  isolate: "isolation: isolate;",
  "isolation-auto": "isolation: auto;",

  // ── Mix Blend Mode ──
  "mix-blend-normal": "mix-blend-mode: normal;",
  "mix-blend-multiply": "mix-blend-mode: multiply;",
  "mix-blend-screen": "mix-blend-mode: screen;",
  "mix-blend-overlay": "mix-blend-mode: overlay;",
  "mix-blend-darken": "mix-blend-mode: darken;",
  "mix-blend-lighten": "mix-blend-mode: lighten;",
  "mix-blend-color-dodge": "mix-blend-mode: color-dodge;",
  "mix-blend-color-burn": "mix-blend-mode: color-burn;",
  "mix-blend-hard-light": "mix-blend-mode: hard-light;",
  "mix-blend-soft-light": "mix-blend-mode: soft-light;",
  "mix-blend-difference": "mix-blend-mode: difference;",
  "mix-blend-exclusion": "mix-blend-mode: exclusion;",
  "mix-blend-hue": "mix-blend-mode: hue;",
  "mix-blend-saturation": "mix-blend-mode: saturation;",
  "mix-blend-color": "mix-blend-mode: color;",
  "mix-blend-luminosity": "mix-blend-mode: luminosity;",

  // ── Will Change ──
  "will-change-auto": "will-change: auto;",
  "will-change-scroll": "will-change: scroll-position;",
  "will-change-contents": "will-change: contents;",
  "will-change-transform": "will-change: transform;",

  // ── Content ──
  "content-none": "content: none;",

  // ── Accent Color ──
  "accent-auto": "accent-color: auto;",

  // ── Transition ──
  "transition-none": "transition-property: none;",
  "transition-all":
    "transition-property: all;\ntransition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\ntransition-duration: 150ms;",
  transition:
    "transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;\ntransition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\ntransition-duration: 150ms;",
  "transition-colors":
    "transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;\ntransition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\ntransition-duration: 150ms;",
  "transition-opacity":
    "transition-property: opacity;\ntransition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\ntransition-duration: 150ms;",
  "transition-shadow":
    "transition-property: box-shadow;\ntransition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\ntransition-duration: 150ms;",
  "transition-transform":
    "transition-property: transform;\ntransition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\ntransition-duration: 150ms;",

  // ── Duration ──
  "duration-75": "transition-duration: 75ms;",
  "duration-100": "transition-duration: 100ms;",
  "duration-150": "transition-duration: 150ms;",
  "duration-200": "transition-duration: 200ms;",
  "duration-300": "transition-duration: 300ms;",
  "duration-500": "transition-duration: 500ms;",
  "duration-700": "transition-duration: 700ms;",
  "duration-1000": "transition-duration: 1000ms;",

  // ── Timing Function ──
  "ease-linear": "transition-timing-function: linear;",
  "ease-in": "transition-timing-function: cubic-bezier(0.4, 0, 1, 1);",
  "ease-out": "transition-timing-function: cubic-bezier(0, 0, 0.2, 1);",
  "ease-in-out":
    "transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);",

  // ── Delay ──
  "delay-75": "transition-delay: 75ms;",
  "delay-100": "transition-delay: 100ms;",
  "delay-150": "transition-delay: 150ms;",
  "delay-200": "transition-delay: 200ms;",
  "delay-300": "transition-delay: 300ms;",
  "delay-500": "transition-delay: 500ms;",
  "delay-700": "transition-delay: 700ms;",
  "delay-1000": "transition-delay: 1000ms;",

  // ── Transform ──
  "transform-none": "transform: none;",
  "transform-gpu": "transform: translateZ(0);",

  // ── Border Colors ──
  "border-transparent": "border-color: transparent;",
  "border-current": "border-color: currentColor;",
  "border-black": "border-color: rgb(0 0 0);",
  "border-white": "border-color: rgb(255 255 255);",
  "border-inherit": "border-color: inherit;",

  // ── Text Colors ──
  "text-transparent": "color: transparent;",
  "text-current": "color: currentColor;",
  "text-black": "color: rgb(0 0 0);",
  "text-white": "color: rgb(255 255 255);",
  "text-inherit": "color: inherit;",

  // ── Background Colors ──
  "bg-transparent": "background-color: transparent;",
  "bg-current": "background-color: currentColor;",
  "bg-black": "background-color: rgb(0 0 0);",
  "bg-white": "background-color: rgb(255 255 255);",
  "bg-inherit": "background-color: inherit;",
};

// ── Spacing scale: value → rem ──
const SPACING_VALUES: Record<string, string> = {
  "0": "0px",
  px: "1px",
  "0.5": "0.125rem",
  "1": "0.25rem",
  "1.5": "0.375rem",
  "2": "0.5rem",
  "2.5": "0.625rem",
  "3": "0.75rem",
  "3.5": "0.875rem",
  "4": "1rem",
  "5": "1.25rem",
  "6": "1.5rem",
  "7": "1.75rem",
  "8": "2rem",
  "9": "2.25rem",
  "10": "2.5rem",
  "11": "2.75rem",
  "12": "3rem",
  "14": "3.5rem",
  "16": "4rem",
  "20": "5rem",
  "24": "6rem",
  "28": "7rem",
  "32": "8rem",
  "36": "9rem",
  "40": "10rem",
  "44": "11rem",
  "48": "12rem",
  "52": "13rem",
  "56": "14rem",
  "60": "15rem",
  "64": "16rem",
  "72": "18rem",
  "80": "20rem",
  "96": "24rem",
  auto: "auto",
  full: "100%",
  screen: "100vw",
  min: "min-content",
  max: "max-content",
  fit: "fit-content",
  "1/2": "50%",
  "1/3": "33.333333%",
  "2/3": "66.666667%",
  "1/4": "25%",
  "2/4": "50%",
  "3/4": "75%",
  "1/5": "20%",
  "2/5": "40%",
  "3/5": "60%",
  "4/5": "80%",
  "1/6": "16.666667%",
  "5/6": "83.333333%",
  "1/12": "8.333333%",
  "5/12": "41.666667%",
  "7/12": "58.333333%",
  "11/12": "91.666667%",
};

// Spacing-based pattern matchers
interface SpacingPattern {
  regex: RegExp;
  template: (value: string) => string;
}

const SPACING_PATTERNS: SpacingPattern[] = [
  // Padding
  { regex: /^p-(.+)$/, template: (v) => `padding: ${v};` },
  { regex: /^px-(.+)$/, template: (v) => `padding-left: ${v};\npadding-right: ${v};` },
  { regex: /^py-(.+)$/, template: (v) => `padding-top: ${v};\npadding-bottom: ${v};` },
  { regex: /^pt-(.+)$/, template: (v) => `padding-top: ${v};` },
  { regex: /^pr-(.+)$/, template: (v) => `padding-right: ${v};` },
  { regex: /^pb-(.+)$/, template: (v) => `padding-bottom: ${v};` },
  { regex: /^pl-(.+)$/, template: (v) => `padding-left: ${v};` },
  // Margin
  { regex: /^m-(.+)$/, template: (v) => `margin: ${v};` },
  { regex: /^mx-(.+)$/, template: (v) => `margin-left: ${v};\nmargin-right: ${v};` },
  { regex: /^my-(.+)$/, template: (v) => `margin-top: ${v};\nmargin-bottom: ${v};` },
  { regex: /^mt-(.+)$/, template: (v) => `margin-top: ${v};` },
  { regex: /^mr-(.+)$/, template: (v) => `margin-right: ${v};` },
  { regex: /^mb-(.+)$/, template: (v) => `margin-bottom: ${v};` },
  { regex: /^ml-(.+)$/, template: (v) => `margin-left: ${v};` },
  // Width / Height
  { regex: /^w-(.+)$/, template: (v) => `width: ${v};` },
  { regex: /^h-(.+)$/, template: (v) => `height: ${v};` },
  { regex: /^min-w-(.+)$/, template: (v) => `min-width: ${v};` },
  { regex: /^min-h-(.+)$/, template: (v) => `min-height: ${v};` },
  { regex: /^max-w-(.+)$/, template: (v) => `max-width: ${v};` },
  { regex: /^max-h-(.+)$/, template: (v) => `max-height: ${v};` },
  // Gap
  { regex: /^gap-x-(.+)$/, template: (v) => `column-gap: ${v};` },
  { regex: /^gap-y-(.+)$/, template: (v) => `row-gap: ${v};` },
  { regex: /^gap-(.+)$/, template: (v) => `gap: ${v};` },
  // Inset
  { regex: /^inset-x-(.+)$/, template: (v) => `left: ${v};\nright: ${v};` },
  { regex: /^inset-y-(.+)$/, template: (v) => `top: ${v};\nbottom: ${v};` },
  { regex: /^inset-(.+)$/, template: (v) => `inset: ${v};` },
  // Top / Right / Bottom / Left
  { regex: /^top-(.+)$/, template: (v) => `top: ${v};` },
  { regex: /^right-(.+)$/, template: (v) => `right: ${v};` },
  { regex: /^bottom-(.+)$/, template: (v) => `bottom: ${v};` },
  { regex: /^left-(.+)$/, template: (v) => `left: ${v};` },
  // Space between
  { regex: /^space-x-(.+)$/, template: (v) => `/* > * + * */\nmargin-left: ${v};` },
  { regex: /^space-y-(.+)$/, template: (v) => `/* > * + * */\nmargin-top: ${v};` },
  // Scroll margin/padding
  { regex: /^scroll-m-(.+)$/, template: (v) => `scroll-margin: ${v};` },
  { regex: /^scroll-p-(.+)$/, template: (v) => `scroll-padding: ${v};` },
];

// Max-width named values
const MAX_WIDTH_MAP: Record<string, string> = {
  none: "none",
  xs: "20rem",
  sm: "24rem",
  md: "28rem",
  lg: "32rem",
  xl: "36rem",
  "2xl": "42rem",
  "3xl": "48rem",
  "4xl": "56rem",
  "5xl": "64rem",
  "6xl": "72rem",
  "7xl": "80rem",
  prose: "65ch",
  "screen-sm": "640px",
  "screen-md": "768px",
  "screen-lg": "1024px",
  "screen-xl": "1280px",
  "screen-2xl": "1536px",
};

// Min-height named values
const MIN_H_MAP: Record<string, string> = {
  "0": "0px",
  full: "100%",
  screen: "100vh",
  svh: "100svh",
  lvh: "100lvh",
  dvh: "100dvh",
  min: "min-content",
  max: "max-content",
  fit: "fit-content",
};

// Grid column/row patterns
const GRID_PATTERNS: Record<string, string> = {
  "grid-cols-none": "grid-template-columns: none;",
  "grid-cols-subgrid": "grid-template-columns: subgrid;",
  "grid-rows-none": "grid-template-rows: none;",
  "grid-rows-subgrid": "grid-template-rows: subgrid;",
  "col-auto": "grid-column: auto;",
  "col-span-full": "grid-column: 1 / -1;",
  "col-start-auto": "grid-column-start: auto;",
  "col-end-auto": "grid-column-end: auto;",
  "row-auto": "grid-row: auto;",
  "row-span-full": "grid-row: 1 / -1;",
  "row-start-auto": "grid-row-start: auto;",
  "row-end-auto": "grid-row-end: auto;",
  "auto-cols-auto": "grid-auto-columns: auto;",
  "auto-cols-min": "grid-auto-columns: min-content;",
  "auto-cols-max": "grid-auto-columns: max-content;",
  "auto-cols-fr": "grid-auto-columns: minmax(0, 1fr);",
  "auto-rows-auto": "grid-auto-rows: auto;",
  "auto-rows-min": "grid-auto-rows: min-content;",
  "auto-rows-max": "grid-auto-rows: max-content;",
  "auto-rows-fr": "grid-auto-rows: minmax(0, 1fr);",
  "grid-flow-row": "grid-auto-flow: row;",
  "grid-flow-col": "grid-auto-flow: column;",
  "grid-flow-dense": "grid-auto-flow: dense;",
  "grid-flow-row-dense": "grid-auto-flow: row dense;",
  "grid-flow-col-dense": "grid-auto-flow: column dense;",
};

// Order
const ORDER_MAP: Record<string, string> = {
  "order-first": "order: -9999;",
  "order-last": "order: 9999;",
  "order-none": "order: 0;",
};

// ── Converter logic ──

interface ConvertResult {
  css: string;
  unconverted: string[];
  convertedCount: number;
}

function resolveSpacing(key: string): string | null {
  if (SPACING_VALUES[key]) return SPACING_VALUES[key];
  // Arbitrary value: [24px], [2rem], etc.
  const arbMatch = key.match(/^\[(.+)\]$/);
  if (arbMatch) return arbMatch[1];
  return null;
}

function convertClass(cls: string): string | null {
  // Direct match
  if (TAILWIND_TO_CSS[cls]) return TAILWIND_TO_CSS[cls];

  // Grid patterns
  if (GRID_PATTERNS[cls]) return GRID_PATTERNS[cls];

  // Order
  if (ORDER_MAP[cls]) return ORDER_MAP[cls];

  // Negative spacing (e.g., -mt-4)
  const negMatch = cls.match(/^-(.+)$/);

  // Grid cols/rows with number
  const gridColMatch = cls.match(/^grid-cols-(\d+)$/);
  if (gridColMatch) return `grid-template-columns: repeat(${gridColMatch[1]}, minmax(0, 1fr));`;
  const gridRowMatch = cls.match(/^grid-rows-(\d+)$/);
  if (gridRowMatch) return `grid-template-rows: repeat(${gridRowMatch[1]}, minmax(0, 1fr));`;

  // Col/row span
  const colSpanMatch = cls.match(/^col-span-(\d+)$/);
  if (colSpanMatch) return `grid-column: span ${colSpanMatch[1]} / span ${colSpanMatch[1]};`;
  const colStartMatch = cls.match(/^col-start-(\d+)$/);
  if (colStartMatch) return `grid-column-start: ${colStartMatch[1]};`;
  const colEndMatch = cls.match(/^col-end-(\d+)$/);
  if (colEndMatch) return `grid-column-end: ${colEndMatch[1]};`;
  const rowSpanMatch = cls.match(/^row-span-(\d+)$/);
  if (rowSpanMatch) return `grid-row: span ${rowSpanMatch[1]} / span ${rowSpanMatch[1]};`;
  const rowStartMatch = cls.match(/^row-start-(\d+)$/);
  if (rowStartMatch) return `grid-row-start: ${rowStartMatch[1]};`;
  const rowEndMatch = cls.match(/^row-end-(\d+)$/);
  if (rowEndMatch) return `grid-row-end: ${rowEndMatch[1]};`;

  // Columns
  const columnsMatch = cls.match(/^columns-(\d+)$/);
  if (columnsMatch) return `columns: ${columnsMatch[1]};`;

  // Order numeric
  const orderMatch = cls.match(/^order-(\d+)$/);
  if (orderMatch) return `order: ${orderMatch[1]};`;

  // Max-width named values
  const maxWMatch = cls.match(/^max-w-(.+)$/);
  if (maxWMatch && MAX_WIDTH_MAP[maxWMatch[1]]) {
    return `max-width: ${MAX_WIDTH_MAP[maxWMatch[1]]};`;
  }

  // Min-height named values
  const minHMatch = cls.match(/^min-h-(.+)$/);
  if (minHMatch && MIN_H_MAP[minHMatch[1]]) {
    return `min-height: ${MIN_H_MAP[minHMatch[1]]};`;
  }

  // h-screen, w-screen
  if (cls === "h-screen") return "height: 100vh;";
  if (cls === "h-dvh") return "height: 100dvh;";
  if (cls === "h-svh") return "height: 100svh;";
  if (cls === "h-lvh") return "height: 100lvh;";
  if (cls === "w-screen") return "width: 100vw;";

  // Spacing-based patterns
  for (const pattern of SPACING_PATTERNS) {
    const match = cls.match(pattern.regex);
    if (match) {
      const val = resolveSpacing(match[1]);
      if (val) return pattern.template(val);
    }
  }

  // Negative spacing patterns
  if (negMatch) {
    for (const pattern of SPACING_PATTERNS) {
      const match = negMatch[1].match(pattern.regex);
      if (match) {
        const val = resolveSpacing(match[1]);
        if (val && val !== "auto" && val !== "0px") {
          return pattern.template(`-${val}`);
        }
      }
    }
  }

  // Tailwind color utilities with palette (e.g., bg-red-500, text-blue-300)
  const colorPrefixes: Record<string, string> = {
    bg: "background-color",
    text: "color",
    "border": "border-color",
    "ring": "--tw-ring-color",
    "accent": "accent-color",
    "caret": "caret-color",
    "fill": "fill",
    "stroke": "stroke",
    "outline": "outline-color",
    "decoration": "text-decoration-color",
    "divide": "border-color /* > * + * */",
    "placeholder": "color /* ::placeholder */",
    "from": "--tw-gradient-from",
    "via": "--tw-gradient-via",
    "to": "--tw-gradient-to",
  };

  for (const [prefix, prop] of Object.entries(colorPrefixes)) {
    const colorMatch = cls.match(new RegExp(`^${prefix}-(.+)$`));
    if (colorMatch) {
      const colorVal = colorMatch[1];
      // Arbitrary color [#hex], [rgb(...)], etc.
      const arbMatch = colorVal.match(/^\[(.+)\]$/);
      if (arbMatch) return `${prop}: ${arbMatch[1]};`;
    }
  }

  // Arbitrary value with bracket notation: property-[value]
  // e.g., w-[300px], h-[calc(100vh-4rem)], top-[10%]
  const arbPropMatch = cls.match(/^([a-z-]+)-\[(.+)\]$/);
  if (arbPropMatch) {
    const arbPrefix = arbPropMatch[1];
    const arbVal = arbPropMatch[2];
    const arbMap: Record<string, string> = {
      w: "width",
      h: "height",
      p: "padding",
      m: "margin",
      px: "padding-left",
      py: "padding-top",
      pt: "padding-top",
      pr: "padding-right",
      pb: "padding-bottom",
      pl: "padding-left",
      mt: "margin-top",
      mr: "margin-right",
      mb: "margin-bottom",
      ml: "margin-left",
      mx: "margin-left",
      my: "margin-top",
      top: "top",
      right: "right",
      bottom: "bottom",
      left: "left",
      inset: "inset",
      gap: "gap",
      "gap-x": "column-gap",
      "gap-y": "row-gap",
      "min-w": "min-width",
      "max-w": "max-width",
      "min-h": "min-height",
      "max-h": "max-height",
      "text": "font-size",
      "leading": "line-height",
      "tracking": "letter-spacing",
      "indent": "text-indent",
      "z": "z-index",
      "basis": "flex-basis",
      "rounded": "border-radius",
      "border": "border-width",
      "outline": "outline-width",
      "ring": "--tw-ring-offset-width",
      "opacity": "opacity",
      "blur": "filter: blur()",
      "brightness": "filter: brightness()",
      "contrast": "filter: contrast()",
      "saturate": "filter: saturate()",
      "grayscale": "filter: grayscale()",
      "rotate": "transform: rotate()",
      "scale": "transform: scale()",
      "translate-x": "transform: translateX()",
      "translate-y": "transform: translateY()",
      "skew-x": "transform: skewX()",
      "skew-y": "transform: skewY()",
      "columns": "columns",
      "aspect": "aspect-ratio",
    };
    if (arbMap[arbPrefix]) {
      const cssProp = arbMap[arbPrefix];
      if (cssProp.includes("()")) {
        // Filter/transform functions
        const fn = cssProp.replace("()", `(${arbVal})`);
        return `${fn};`;
      }
      if (arbPrefix === "px") return `padding-left: ${arbVal};\npadding-right: ${arbVal};`;
      if (arbPrefix === "py") return `padding-top: ${arbVal};\npadding-bottom: ${arbVal};`;
      if (arbPrefix === "mx") return `margin-left: ${arbVal};\nmargin-right: ${arbVal};`;
      if (arbPrefix === "my") return `margin-top: ${arbVal};\nmargin-bottom: ${arbVal};`;
      return `${cssProp}: ${arbVal};`;
    }
  }

  // Ring utilities
  if (cls === "ring") return "box-shadow: var(--tw-ring-inset) 0 0 0 3px var(--tw-ring-color);";
  if (cls === "ring-0") return "box-shadow: var(--tw-ring-inset) 0 0 0 0px var(--tw-ring-color);";
  if (cls === "ring-1") return "box-shadow: var(--tw-ring-inset) 0 0 0 1px var(--tw-ring-color);";
  if (cls === "ring-2") return "box-shadow: var(--tw-ring-inset) 0 0 0 2px var(--tw-ring-color);";
  if (cls === "ring-4") return "box-shadow: var(--tw-ring-inset) 0 0 0 4px var(--tw-ring-color);";
  if (cls === "ring-8") return "box-shadow: var(--tw-ring-inset) 0 0 0 8px var(--tw-ring-color);";
  if (cls === "ring-inset") return "--tw-ring-inset: inset;";

  // Basis
  const basisMatch = cls.match(/^basis-(.+)$/);
  if (basisMatch) {
    const val = resolveSpacing(basisMatch[1]);
    if (val) return `flex-basis: ${val};`;
  }

  // Indent
  const indentMatch = cls.match(/^indent-(.+)$/);
  if (indentMatch) {
    const val = resolveSpacing(indentMatch[1]);
    if (val) return `text-indent: ${val};`;
  }

  // Filter utilities
  if (cls === "blur-none") return "filter: blur(0);";
  if (cls === "blur-sm") return "filter: blur(4px);";
  if (cls === "blur") return "filter: blur(8px);";
  if (cls === "blur-md") return "filter: blur(12px);";
  if (cls === "blur-lg") return "filter: blur(16px);";
  if (cls === "blur-xl") return "filter: blur(24px);";
  if (cls === "blur-2xl") return "filter: blur(40px);";
  if (cls === "blur-3xl") return "filter: blur(64px);";
  if (cls === "grayscale-0") return "filter: grayscale(0);";
  if (cls === "grayscale") return "filter: grayscale(100%);";
  if (cls === "invert-0") return "filter: invert(0);";
  if (cls === "invert") return "filter: invert(100%);";
  if (cls === "sepia-0") return "filter: sepia(0);";
  if (cls === "sepia") return "filter: sepia(100%);";

  // Backdrop filter
  if (cls === "backdrop-blur-none") return "backdrop-filter: blur(0);";
  if (cls === "backdrop-blur-sm") return "backdrop-filter: blur(4px);";
  if (cls === "backdrop-blur") return "backdrop-filter: blur(8px);";
  if (cls === "backdrop-blur-md") return "backdrop-filter: blur(12px);";
  if (cls === "backdrop-blur-lg") return "backdrop-filter: blur(16px);";
  if (cls === "backdrop-blur-xl") return "backdrop-filter: blur(24px);";
  if (cls === "backdrop-blur-2xl") return "backdrop-filter: blur(40px);";
  if (cls === "backdrop-blur-3xl") return "backdrop-filter: blur(64px);";

  // Scale
  const scaleMatch = cls.match(/^scale-(\d+)$/);
  if (scaleMatch) return `transform: scale(${parseInt(scaleMatch[1]) / 100});`;
  const scaleXMatch = cls.match(/^scale-x-(\d+)$/);
  if (scaleXMatch) return `transform: scaleX(${parseInt(scaleXMatch[1]) / 100});`;
  const scaleYMatch = cls.match(/^scale-y-(\d+)$/);
  if (scaleYMatch) return `transform: scaleY(${parseInt(scaleYMatch[1]) / 100});`;

  // Rotate
  const rotateMatch = cls.match(/^rotate-(\d+)$/);
  if (rotateMatch) return `transform: rotate(${rotateMatch[1]}deg);`;
  const negRotateMatch = cls.match(/^-rotate-(\d+)$/);
  if (negRotateMatch) return `transform: rotate(-${negRotateMatch[1]}deg);`;

  // Translate
  const translateXMatch = cls.match(/^translate-x-(.+)$/);
  if (translateXMatch) {
    const val = resolveSpacing(translateXMatch[1]);
    if (val) return `transform: translateX(${val});`;
  }
  const translateYMatch = cls.match(/^translate-y-(.+)$/);
  if (translateYMatch) {
    const val = resolveSpacing(translateYMatch[1]);
    if (val) return `transform: translateY(${val});`;
  }
  const negTranslateXMatch = cls.match(/^-translate-x-(.+)$/);
  if (negTranslateXMatch) {
    const val = resolveSpacing(negTranslateXMatch[1]);
    if (val) return `transform: translateX(-${val});`;
  }
  const negTranslateYMatch = cls.match(/^-translate-y-(.+)$/);
  if (negTranslateYMatch) {
    const val = resolveSpacing(negTranslateYMatch[1]);
    if (val) return `transform: translateY(-${val});`;
  }

  // Skew
  const skewXMatch = cls.match(/^skew-x-(\d+)$/);
  if (skewXMatch) return `transform: skewX(${skewXMatch[1]}deg);`;
  const skewYMatch = cls.match(/^skew-y-(\d+)$/);
  if (skewYMatch) return `transform: skewY(${skewYMatch[1]}deg);`;

  // Origin
  const originMap: Record<string, string> = {
    "origin-center": "transform-origin: center;",
    "origin-top": "transform-origin: top;",
    "origin-top-right": "transform-origin: top right;",
    "origin-right": "transform-origin: right;",
    "origin-bottom-right": "transform-origin: bottom right;",
    "origin-bottom": "transform-origin: bottom;",
    "origin-bottom-left": "transform-origin: bottom left;",
    "origin-left": "transform-origin: left;",
    "origin-top-left": "transform-origin: top left;",
  };
  if (originMap[cls]) return originMap[cls];

  return null;
}

function convertTailwindClasses(input: string): ConvertResult {
  const cleaned = input
    .replace(/class(?:Name)?=["'`]/g, "")
    .replace(/["'`]/g, "")
    .replace(/\{[^}]*\}/g, "")
    .trim();

  const classes = cleaned.split(/\s+/).filter((c) => c.length > 0);
  const cssLines: string[] = [];
  const unconverted: string[] = [];
  let convertedCount = 0;

  for (const cls of classes) {
    // Strip responsive/state prefixes for conversion (sm:, md:, lg:, hover:, focus:, dark:, etc.)
    const prefixMatch = cls.match(/^(?:(?:sm|md|lg|xl|2xl|hover|focus|active|disabled|visited|first|last|odd|even|group-hover|focus-within|focus-visible|dark|motion-safe|motion-reduce|print|portrait|landscape|aria-[^:]+|data-[^:]+):)*(.+)$/);
    const baseClass = prefixMatch ? prefixMatch[1] : cls;
    const prefix = cls.slice(0, cls.length - baseClass.length);

    const css = convertClass(baseClass);
    if (css) {
      if (prefix) {
        cssLines.push(`/* ${prefix}... */\n${css}`);
      } else {
        cssLines.push(css);
      }
      convertedCount++;
    } else {
      unconverted.push(cls);
    }
  }

  return {
    css: cssLines.join("\n"),
    unconverted,
    convertedCount,
  };
}

// ── Sample inputs ──

const SAMPLES: { label: string; classes: string }[] = [
  {
    label: "Card",
    classes:
      "flex flex-col items-center justify-center p-8 mx-auto max-w-md rounded-lg shadow-md bg-white",
  },
  {
    label: "Button",
    classes:
      "inline-flex items-center px-4 py-2 text-sm font-semibold rounded-md cursor-pointer select-none transition-all duration-150 ease-in-out",
  },
  {
    label: "Grid Layout",
    classes: "grid grid-cols-3 gap-6 px-8 py-4 max-w-6xl mx-auto",
  },
  {
    label: "Nav Header",
    classes:
      "flex items-center justify-between sticky top-0 z-50 px-6 py-4 bg-white border-b border-black",
  },
  {
    label: "Typography",
    classes:
      "text-4xl font-bold leading-tight tracking-tight text-center uppercase text-black",
  },
  {
    label: "Overlay",
    classes:
      "fixed inset-0 flex items-center justify-center bg-black opacity-50 z-50 cursor-pointer",
  },
  {
    label: "Responsive",
    classes:
      "w-full md:w-1/2 lg:w-1/3 p-4 sm:p-6 lg:p-8 text-sm md:text-base hover:bg-white dark:bg-black",
  },
];

// ── Component ──

export default function TailwindToCssTool() {
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);
  const [selectorName, setSelectorName] = useState(".element");

  const { trackAction } = useToolAnalytics("tailwind-to-css");
  const { remaining, dailyLimit, isLimited, recordUsage } =
    useRateLimit("tailwind-to-css");
  useSmartPasteInput(setInput);

  const result = input.trim() ? convertTailwindClasses(input) : null;

  const formattedCss = result
    ? `${selectorName} {\n${result.css
        .split("\n")
        .map((line) => `  ${line}`)
        .join("\n")}\n}`
    : "";

  const handleConvert = useCallback(() => {
    if (isLimited) return;
    recordUsage();
    trackAction("convert");
  }, [isLimited, recordUsage, trackAction]);

  const handleLoadSample = useCallback(
    (sample: (typeof SAMPLES)[number]) => {
      setInput(sample.classes);
      handleConvert();
    },
    [handleConvert],
  );

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(formattedCss);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [formattedCss]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="mb-8 block text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        &larr; Back to tools
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Tailwind CSS to CSS Converter
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Paste Tailwind utility classes and get the equivalent standard CSS.
        Supports spacing, layout, typography, borders, transforms, filters,
        colors, and arbitrary values.
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
            Tailwind Classes
          </label>
          <textarea
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              handleConvert();
            }}
            placeholder={`Paste Tailwind classes here, e.g.:\n\nflex items-center justify-between p-4 rounded-lg shadow-md bg-white\n\nAlso works with:\nclass="flex items-center ..."\nclassName="flex items-center ..."`}
            rows={10}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 font-mono text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
            spellCheck={false}
          />

          {/* Selector name */}
          <div className="mt-3 flex items-center gap-3">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
              CSS Selector:
            </label>
            <input
              type="text"
              value={selectorName}
              onChange={(e) => setSelectorName(e.target.value)}
              className="w-40 rounded border border-gray-300 bg-white px-2.5 py-1 font-mono text-xs text-gray-900 focus:border-indigo-500 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
            />
          </div>

          {/* Stats */}
          {result && (
            <div className="mt-3 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
              <span className="text-emerald-600 dark:text-emerald-400">
                {result.convertedCount} converted
              </span>
              {result.unconverted.length > 0 && (
                <span className="text-amber-600 dark:text-amber-400">
                  {result.unconverted.length} unrecognized
                </span>
              )}
            </div>
          )}
        </div>

        {/* Output */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              CSS Output
            </label>
            {formattedCss && (
              <button
                onClick={handleCopy}
                className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            )}
          </div>

          <div className="rounded-lg border border-gray-300 bg-gray-900 dark:border-gray-600 min-h-[16rem] overflow-auto">
            {!result ? (
              <div className="flex items-center justify-center h-full min-h-[16rem] text-gray-500 text-sm">
                Paste Tailwind classes to see CSS
              </div>
            ) : (
              <pre className="p-4 font-mono text-sm text-gray-100 whitespace-pre-wrap">
                <code>{formattedCss}</code>
              </pre>
            )}
          </div>

          {/* Unconverted classes */}
          {result && result.unconverted.length > 0 && (
            <div className="mt-3">
              <span className="text-[10px] font-medium text-amber-600 dark:text-amber-400 uppercase tracking-wide">
                Unrecognized classes (palette colors, plugins, or custom):
              </span>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {result.unconverted.map((cls, i) => (
                  <span
                    key={i}
                    className="inline-block rounded bg-amber-50 px-2 py-0.5 font-mono text-xs text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                  >
                    {cls}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action buttons */}
      {result && (
        <div className="mt-4 flex gap-3">
          <button
            onClick={handleCopy}
            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
          >
            {copied ? "Copied!" : "Copy CSS"}
          </button>
          <button
            onClick={() => setInput("")}
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Clear
          </button>
        </div>
      )}

      {/* Supported classes reference */}
      <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Supported Tailwind Classes
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-1 text-xs text-gray-600 dark:text-gray-400">
          {[
            "Layout: display, position, visibility, overflow, z-index, box-sizing, isolation",
            "Flexbox: flex-direction, wrap, grow, shrink, order, justify, align, self, gap",
            "Grid: grid-cols, grid-rows, col-span, row-span, auto-cols, auto-rows, flow",
            "Spacing: p, px, py, pt/r/b/l, m, mx, my, mt/r/b/l, space-x/y, gap",
            "Sizing: w, h, min-w, max-w, min-h, max-h, basis, screen, full, fractions",
            "Typography: text-size, font-weight/style/family, leading, tracking, text-align/decoration/transform, whitespace, truncate",
            "Borders: border-width/style/radius, rounded, outline, ring",
            "Effects: opacity, shadow, blur, grayscale, invert, sepia, backdrop-blur",
            "Transforms: scale, rotate, translate, skew, origin",
            "Transitions: transition, duration, ease, delay",
            "Colors: text, bg, border, ring, accent, fill, stroke (black/white/transparent/current + arbitrary values)",
            "Misc: cursor, pointer-events, select, resize, appearance, object-fit/position, aspect-ratio, will-change, mix-blend, columns, content, scroll, table, list",
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

      {/* About */}
      <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          About Tailwind CSS to CSS Converter
        </h2>
        <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
          <li>
            <strong>500+ utility classes</strong> — converts layout, spacing, typography, borders, transforms, filters, and more.
          </li>
          <li>
            <strong>Arbitrary values</strong> — handles bracket notation like <code className="text-xs bg-gray-200 dark:bg-gray-800 px-1 rounded">w-[300px]</code> and <code className="text-xs bg-gray-200 dark:bg-gray-800 px-1 rounded">bg-[#1a1a2e]</code>.
          </li>
          <li>
            <strong>Responsive/state prefixes</strong> — strips <code className="text-xs bg-gray-200 dark:bg-gray-800 px-1 rounded">sm:</code>, <code className="text-xs bg-gray-200 dark:bg-gray-800 px-1 rounded">hover:</code>, <code className="text-xs bg-gray-200 dark:bg-gray-800 px-1 rounded">dark:</code> etc. and marks them as comments.
          </li>
          <li>
            <strong>Selector input</strong> — customize the CSS selector name for the output.
          </li>
          <li>
            <strong>Unrecognized tracking</strong> — classes without a mapping are flagged so you can handle them manually.
          </li>
          <li>
            Everything runs in your browser — no data is sent over the network.
          </li>
        </ul>
      </div>
    </div>
  );
}
