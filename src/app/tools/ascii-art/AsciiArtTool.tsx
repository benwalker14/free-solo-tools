"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";
import RateLimitBanner from "@/components/RateLimitBanner";

// --- Font definitions ---
// Each font maps characters to an array of strings (rows).
// All characters in a font must have the same number of rows.

type FontMap = Record<string, string[]>;

const BANNER_FONT: FontMap = {
  A: [
    "  #  ",
    " # # ",
    "#   #",
    "#####",
    "#   #",
    "#   #",
  ],
  B: [
    "#### ",
    "#   #",
    "#### ",
    "#   #",
    "#   #",
    "#### ",
  ],
  C: [
    " ####",
    "#    ",
    "#    ",
    "#    ",
    "#    ",
    " ####",
  ],
  D: [
    "#### ",
    "#   #",
    "#   #",
    "#   #",
    "#   #",
    "#### ",
  ],
  E: [
    "#####",
    "#    ",
    "#### ",
    "#    ",
    "#    ",
    "#####",
  ],
  F: [
    "#####",
    "#    ",
    "#### ",
    "#    ",
    "#    ",
    "#    ",
  ],
  G: [
    " ####",
    "#    ",
    "# ###",
    "#   #",
    "#   #",
    " ####",
  ],
  H: [
    "#   #",
    "#   #",
    "#####",
    "#   #",
    "#   #",
    "#   #",
  ],
  I: [
    "#####",
    "  #  ",
    "  #  ",
    "  #  ",
    "  #  ",
    "#####",
  ],
  J: [
    "#####",
    "    #",
    "    #",
    "    #",
    "#   #",
    " ### ",
  ],
  K: [
    "#   #",
    "#  # ",
    "###  ",
    "#  # ",
    "#   #",
    "#   #",
  ],
  L: [
    "#    ",
    "#    ",
    "#    ",
    "#    ",
    "#    ",
    "#####",
  ],
  M: [
    "#   #",
    "## ##",
    "# # #",
    "#   #",
    "#   #",
    "#   #",
  ],
  N: [
    "#   #",
    "##  #",
    "# # #",
    "#  ##",
    "#   #",
    "#   #",
  ],
  O: [
    " ### ",
    "#   #",
    "#   #",
    "#   #",
    "#   #",
    " ### ",
  ],
  P: [
    "#### ",
    "#   #",
    "#### ",
    "#    ",
    "#    ",
    "#    ",
  ],
  Q: [
    " ### ",
    "#   #",
    "#   #",
    "# # #",
    "#  # ",
    " ## #",
  ],
  R: [
    "#### ",
    "#   #",
    "#### ",
    "#  # ",
    "#   #",
    "#   #",
  ],
  S: [
    " ####",
    "#    ",
    " ### ",
    "    #",
    "    #",
    "#### ",
  ],
  T: [
    "#####",
    "  #  ",
    "  #  ",
    "  #  ",
    "  #  ",
    "  #  ",
  ],
  U: [
    "#   #",
    "#   #",
    "#   #",
    "#   #",
    "#   #",
    " ### ",
  ],
  V: [
    "#   #",
    "#   #",
    "#   #",
    " # # ",
    " # # ",
    "  #  ",
  ],
  W: [
    "#   #",
    "#   #",
    "#   #",
    "# # #",
    "## ##",
    "#   #",
  ],
  X: [
    "#   #",
    " # # ",
    "  #  ",
    " # # ",
    "#   #",
    "#   #",
  ],
  Y: [
    "#   #",
    " # # ",
    "  #  ",
    "  #  ",
    "  #  ",
    "  #  ",
  ],
  Z: [
    "#####",
    "   # ",
    "  #  ",
    " #   ",
    "#    ",
    "#####",
  ],
  "0": [
    " ### ",
    "#  ##",
    "# # #",
    "##  #",
    "#   #",
    " ### ",
  ],
  "1": [
    "  #  ",
    " ##  ",
    "  #  ",
    "  #  ",
    "  #  ",
    "#####",
  ],
  "2": [
    " ### ",
    "#   #",
    "   # ",
    "  #  ",
    " #   ",
    "#####",
  ],
  "3": [
    " ### ",
    "#   #",
    "  ## ",
    "    #",
    "#   #",
    " ### ",
  ],
  "4": [
    "   # ",
    "  ## ",
    " # # ",
    "# #  ",
    "#####",
    "   # ",
  ],
  "5": [
    "#####",
    "#    ",
    "#### ",
    "    #",
    "#   #",
    " ### ",
  ],
  "6": [
    " ### ",
    "#    ",
    "#### ",
    "#   #",
    "#   #",
    " ### ",
  ],
  "7": [
    "#####",
    "    #",
    "   # ",
    "  #  ",
    " #   ",
    " #   ",
  ],
  "8": [
    " ### ",
    "#   #",
    " ### ",
    "#   #",
    "#   #",
    " ### ",
  ],
  "9": [
    " ### ",
    "#   #",
    "#   #",
    " ####",
    "    #",
    " ### ",
  ],
  " ": [
    "     ",
    "     ",
    "     ",
    "     ",
    "     ",
    "     ",
  ],
  "!": [
    "  #  ",
    "  #  ",
    "  #  ",
    "  #  ",
    "     ",
    "  #  ",
  ],
  ".": [
    "     ",
    "     ",
    "     ",
    "     ",
    "     ",
    "  #  ",
  ],
  ",": [
    "     ",
    "     ",
    "     ",
    "     ",
    "  #  ",
    " #   ",
  ],
  "-": [
    "     ",
    "     ",
    "#####",
    "     ",
    "     ",
    "     ",
  ],
  "_": [
    "     ",
    "     ",
    "     ",
    "     ",
    "     ",
    "#####",
  ],
  "?": [
    " ### ",
    "#   #",
    "   # ",
    "  #  ",
    "     ",
    "  #  ",
  ],
  "@": [
    " ### ",
    "#   #",
    "# ###",
    "# # #",
    "# ## ",
    " ### ",
  ],
  ":": [
    "     ",
    "  #  ",
    "     ",
    "     ",
    "  #  ",
    "     ",
  ],
  "/": [
    "    #",
    "   # ",
    "  #  ",
    " #   ",
    "#    ",
    "#    ",
  ],
};

const BLOCK_FONT: FontMap = {};
for (const [ch, rows] of Object.entries(BANNER_FONT)) {
  BLOCK_FONT[ch] = rows.map((r) =>
    r
      .split("")
      .map((c) => (c === "#" ? "██" : "  "))
      .join(""),
  );
}

const SHADOW_FONT: FontMap = {};
for (const [ch, rows] of Object.entries(BANNER_FONT)) {
  SHADOW_FONT[ch] = rows.map((r, i) => {
    const base = r
      .split("")
      .map((c) => (c === "#" ? "█" : " "))
      .join("");
    // Add a shadow character shifted down-right
    if (i < rows.length - 1) {
      const next = rows[i + 1];
      const shadow = next
        .split("")
        .map((c) => (c === "#" ? "▓" : " "))
        .join("");
      // Merge: base overwrites shadow where present
      const merged = base
        .split("")
        .map((c, j) => (c !== " " ? c : shadow[j - 1] || " "))
        .join("");
      return merged;
    }
    return base;
  });
}

// Slim font - narrower characters
const SLIM_FONT: FontMap = {
  A: [" _ ", "/ \\", "| |", "|_|", "| |", "   "],
  B: [" _ ", "| \\", "|_/", "| \\", "|_/", "   "],
  C: [" __", "/  ", "|  ", "|  ", "\\__", "   "],
  D: [" _ ", "| \\", "| |", "| |", "|_/", "   "],
  E: [" __", "|  ", "|_ ", "|  ", "|__", "   "],
  F: [" __", "|  ", "|_ ", "|  ", "|  ", "   "],
  G: [" __", "/  ", "| _", "| |", "\\__|", "   "],
  H: ["   ", "| |", "|_|", "| |", "| |", "   "],
  I: ["___", " | ", " | ", " | ", "_|_", "   "],
  J: ["___", "  |", "  |", "  |", "\\_/", "   "],
  K: ["   ", "| /", "|/ ", "|\\ ", "| \\", "   "],
  L: ["   ", "|  ", "|  ", "|  ", "|__", "   "],
  M: ["    ", "|\\/|", "|  |", "|  |", "|  |", "    "],
  N: ["    ", "|\\ |", "| \\|", "|  |", "|  |", "    "],
  O: [" _ ", "/ \\", "| |", "| |", "\\_/", "   "],
  P: [" _ ", "|_)", "| \\", "|  ", "|  ", "   "],
  Q: [" _ ", "/ \\", "| |", "|\\|", "\\_\\", "   "],
  R: [" _ ", "|_)", "| \\", "| |", "| |", "   "],
  S: [" __", "/  ", "\\_\\", "  /", "__/", "   "],
  T: ["___", " | ", " | ", " | ", " | ", "   "],
  U: ["   ", "| |", "| |", "| |", "\\_/", "   "],
  V: ["   ", "\\ /", " V ", "   ", "   ", "   "],
  W: ["     ", "|   |", "| | |", " \\ / ", "  V  ", "     "],
  X: ["   ", "\\ /", " X ", "/ \\", "   ", "   "],
  Y: ["   ", "\\ /", " V ", " | ", " | ", "   "],
  Z: ["___", "  /", " / ", "/  ", "/__", "   "],
  " ": ["   ", "   ", "   ", "   ", "   ", "   "],
  "0": [" _ ", "/ \\", "| |", "| |", "\\_/", "   "],
  "1": [" _ ", "/| ", " | ", " | ", "_|_", "   "],
  "2": [" _ ", "/ )", " / ", "/  ", "/__", "   "],
  "3": [" _ ", "/ )", "_) ", " \\", "\\_/", "   "],
  "4": ["   ", "| |", "|_|", "  |", "  |", "   "],
  "5": [" __", "|  ", "|_ ", "  )", "_/ ", "   "],
  "6": [" _ ", "/  ", "|_ ", "| )", "\\_/", "   "],
  "7": ["___", "  /", " / ", "/  ", "|  ", "   "],
  "8": [" _ ", "/ \\", "\\_/", "/ \\", "\\_/", "   "],
  "9": [" _ ", "/ \\", "\\_|", "  |", " _/", "   "],
  "!": [" ", "|", "|", " ", "|", " "],
  ".": [" ", " ", " ", " ", ".", " "],
  ",": [" ", " ", " ", " ", ",", " "],
  "-": ["   ", "   ", "---", "   ", "   ", "   "],
  "_": ["   ", "   ", "   ", "   ", "___", "   "],
  "?": [" _ ", "/ )", " / ", "   ", " o ", "   "],
  "@": [" __ ", "/ _)", "| | ", "\\_) ", "    ", "    "],
  ":": [" ", "o", " ", " ", "o", " "],
  "/": ["  /", " / ", "/  ", "   ", "   ", "   "],
};

// Star/decorative font
const STAR_FONT: FontMap = {};
for (const [ch, rows] of Object.entries(BANNER_FONT)) {
  STAR_FONT[ch] = rows.map((r) =>
    r
      .split("")
      .map((c) => (c === "#" ? "*" : " "))
      .join(""),
  );
}

// Dot font
const DOT_FONT: FontMap = {};
for (const [ch, rows] of Object.entries(BANNER_FONT)) {
  DOT_FONT[ch] = rows.map((r) =>
    r
      .split("")
      .map((c) => (c === "#" ? "●" : " "))
      .join(""),
  );
}

// Underscore font (using _ and |)
const LINES_FONT: FontMap = {};
for (const [ch, rows] of Object.entries(BANNER_FONT)) {
  LINES_FONT[ch] = rows.map((r) =>
    r
      .split("")
      .map((c) => (c === "#" ? "▪" : " "))
      .join(""),
  );
}

type FontName =
  | "banner"
  | "block"
  | "shadow"
  | "slim"
  | "star"
  | "dot"
  | "lines";

const FONTS: Record<FontName, { name: string; map: FontMap }> = {
  banner: { name: "Banner", map: BANNER_FONT },
  block: { name: "Block", map: BLOCK_FONT },
  shadow: { name: "Shadow", map: SHADOW_FONT },
  slim: { name: "Slim", map: SLIM_FONT },
  star: { name: "Star", map: STAR_FONT },
  dot: { name: "Dot", map: DOT_FONT },
  lines: { name: "Lines", map: LINES_FONT },
};

function renderText(text: string, fontMap: FontMap): string {
  const upper = text.toUpperCase();
  const chars = upper.split("").filter((c) => fontMap[c]);

  if (chars.length === 0) return "";

  const height = fontMap["A"]?.length ?? 0;
  const lines: string[] = [];

  for (let row = 0; row < height; row++) {
    const parts = chars.map((c) => {
      const glyph = fontMap[c];
      return glyph?.[row] ?? "";
    });
    lines.push(parts.join(" "));
  }

  // Trim trailing whitespace from each line
  return lines.map((l) => l.trimEnd()).join("\n");
}

// Comment wrapping options
type WrapStyle = "none" | "slash" | "hash" | "html" | "box";

function wrapOutput(text: string, style: WrapStyle): string {
  if (style === "none") return text;

  const lines = text.split("\n");

  switch (style) {
    case "slash":
      return lines.map((l) => `// ${l}`).join("\n");
    case "hash":
      return lines.map((l) => `# ${l}`).join("\n");
    case "html":
      return `<!--\n${lines.map((l) => `  ${l}`).join("\n")}\n-->`;
    case "box": {
      const maxLen = Math.max(...lines.map((l) => l.length));
      const border = "+" + "-".repeat(maxLen + 2) + "+";
      const padded = lines.map(
        (l) => `| ${l.padEnd(maxLen)} |`,
      );
      return [border, ...padded, border].join("\n");
    }
    default:
      return text;
  }
}

export default function AsciiArtTool() {
  const [text, setText] = useState("Hello");
  const [font, setFont] = useState<FontName>("banner");
  const [wrapStyle, setWrapStyle] = useState<WrapStyle>("none");
  const [copied, setCopied] = useState(false);

  const { remaining, dailyLimit, isLimited, recordUsage } =
    useRateLimit("ascii-art");
  const { trackAction } = useToolAnalytics("ascii-art");

  const output = useMemo(() => {
    if (!text.trim()) return "";
    const raw = renderText(text, FONTS[font].map);
    return wrapOutput(raw, wrapStyle);
  }, [text, font, wrapStyle]);

  const handleCopy = useCallback(() => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [output]);

  const handleGenerate = useCallback(() => {
    if (isLimited) return;
    recordUsage();
    trackAction("generate");
  }, [isLimited, recordUsage, trackAction]);

  useKeyboardShortcut("Enter", handleGenerate);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="mb-8 block text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        &larr; Back to tools
      </Link>

      <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
        ASCII Art Text Generator
      </h1>
      <p className="mb-8 text-gray-600 dark:text-gray-400">
        Convert text into ASCII art with multiple font styles. Perfect for
        READMEs, code comments, terminal banners, and social media.
      </p>

      {/* Input */}
      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Text
        </label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your text..."
          maxLength={30}
          className="w-full rounded-lg border border-gray-300 bg-white p-3 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        <p className="mt-1 text-xs text-gray-500">{text.length}/30 characters</p>
      </div>

      {/* Font selection */}
      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Font
        </label>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(FONTS) as FontName[]).map((f) => (
            <button
              key={f}
              onClick={() => setFont(f)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                font === f
                  ? "bg-indigo-600 text-white"
                  : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              {FONTS[f].name}
            </button>
          ))}
        </div>
      </div>

      {/* Comment wrapping */}
      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Comment Style
        </label>
        <div className="flex flex-wrap gap-2">
          {(
            [
              { value: "none", label: "None" },
              { value: "slash", label: "// C/JS" },
              { value: "hash", label: "# Python/Shell" },
              { value: "html", label: "<!-- HTML -->" },
              { value: "box", label: "Box" },
            ] as { value: WrapStyle; label: string }[]
          ).map((s) => (
            <button
              key={s.value}
              onClick={() => setWrapStyle(s.value)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                wrapStyle === s.value
                  ? "bg-indigo-600 text-white"
                  : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Output */}
      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Output
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (!output) return;
                const blob = new Blob([output], { type: "text/plain" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "ascii-art.txt";
                a.click();
                URL.revokeObjectURL(url);
              }}
              disabled={!output}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Download .txt
            </button>
            <button
              onClick={handleCopy}
              disabled={!output}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
        <pre className="min-h-[180px] overflow-x-auto rounded-lg border border-gray-200 bg-gray-50 p-4 font-mono text-xs leading-tight text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
          {output || "Type some text above to see the ASCII art"}
        </pre>
      </div>

      {/* Font preview grid */}
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Font Preview
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {(Object.keys(FONTS) as FontName[])
            .filter((f) => f !== font)
            .map((f) => (
              <button
                key={f}
                onClick={() => setFont(f)}
                className="rounded-lg border border-gray-200 bg-white p-3 text-left transition-colors hover:border-indigo-300 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-indigo-600"
              >
                <span className="mb-2 block text-xs font-medium text-gray-500 dark:text-gray-400">
                  {FONTS[f].name}
                </span>
                <pre className="overflow-hidden font-mono text-[8px] leading-tight text-gray-700 dark:text-gray-300">
                  {renderText(text.slice(0, 8) || "Hi", FONTS[f].map)}
                </pre>
              </button>
            ))}
        </div>
      </div>

      <RateLimitBanner
        remaining={remaining}
        dailyLimit={dailyLimit}
        isLimited={isLimited}
      />

      {/* About section */}
      <details className="group mt-12">
        <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200">
          About ASCII Art Text Generator
        </summary>
        <div className="mt-4 space-y-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          <p>
            ASCII art uses printable text characters to create visual designs.
            This generator converts your text into large banner-style art using
            several built-in font styles, inspired by classic Unix tools like
            FIGlet and banner.
          </p>
          <p>
            <strong>Banner</strong> uses hash (#) characters for a classic
            terminal look. <strong>Block</strong> uses full-block Unicode
            characters (██) for a bold, heavy appearance.{" "}
            <strong>Shadow</strong> adds a shaded depth effect behind each
            letter.
          </p>
          <p>
            <strong>Slim</strong> renders narrow characters using lines and
            slashes for a lighter feel. <strong>Star</strong> uses asterisks (*),{" "}
            <strong>Dot</strong> uses filled circles (●), and{" "}
            <strong>Lines</strong> uses small squares (▪).
          </p>
          <p>
            <strong>Comment wrapping</strong> lets you wrap the output in code
            comment syntax — perfect for adding ASCII banners to source code
            files, shell scripts, or HTML pages.
          </p>
          <p>
            Common uses include README headers, code file banners, terminal
            splash screens, commit message decoration, and fun social media
            posts. Everything runs in your browser — no data is sent to any
            server.
          </p>
        </div>
      </details>
    </div>
  );
}
