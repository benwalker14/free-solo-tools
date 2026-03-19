"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";
import RateLimitBanner from "@/components/RateLimitBanner";

type FormatStyle = "strftime" | "unicode" | "go" | "java";

// ── strftime formatter ──────────────────────────────────────────────
function strftime(fmt: string, d: Date): string {
  const pad = (n: number, w = 2) => String(n).padStart(w, "0");
  const map: Record<string, () => string> = {
    "%Y": () => String(d.getFullYear()),
    "%y": () => pad(d.getFullYear() % 100),
    "%m": () => pad(d.getMonth() + 1),
    "%-m": () => String(d.getMonth() + 1),
    "%d": () => pad(d.getDate()),
    "%-d": () => String(d.getDate()),
    "%H": () => pad(d.getHours()),
    "%-H": () => String(d.getHours()),
    "%I": () => pad(d.getHours() % 12 || 12),
    "%-I": () => String(d.getHours() % 12 || 12),
    "%M": () => pad(d.getMinutes()),
    "%-M": () => String(d.getMinutes()),
    "%S": () => pad(d.getSeconds()),
    "%-S": () => String(d.getSeconds()),
    "%p": () => (d.getHours() < 12 ? "AM" : "PM"),
    "%P": () => (d.getHours() < 12 ? "am" : "pm"),
    "%A": () => d.toLocaleDateString("en-US", { weekday: "long" }),
    "%a": () => d.toLocaleDateString("en-US", { weekday: "short" }),
    "%B": () => d.toLocaleDateString("en-US", { month: "long" }),
    "%b": () => d.toLocaleDateString("en-US", { month: "short" }),
    "%Z": () => {
      const m = d.toTimeString().match(/\((.+)\)/);
      return m ? m[1] : "";
    },
    "%z": () => {
      const off = -d.getTimezoneOffset();
      const sign = off >= 0 ? "+" : "-";
      const ah = Math.floor(Math.abs(off) / 60);
      const am = Math.abs(off) % 60;
      return `${sign}${pad(ah)}${pad(am)}`;
    },
    "%j": () => {
      const start = new Date(d.getFullYear(), 0, 0);
      const diff = d.getTime() - start.getTime();
      return String(Math.floor(diff / 86400000)).padStart(3, "0");
    },
    "%U": () => {
      const start = new Date(d.getFullYear(), 0, 1);
      const diff = d.getTime() - start.getTime();
      const day = start.getDay();
      return pad(Math.floor((diff / 86400000 + day) / 7));
    },
    "%W": () => {
      const start = new Date(d.getFullYear(), 0, 1);
      const diff = d.getTime() - start.getTime();
      const day = start.getDay() === 0 ? 6 : start.getDay() - 1;
      return pad(Math.floor((diff / 86400000 + day) / 7));
    },
    "%w": () => String(d.getDay()),
    "%u": () => String(d.getDay() || 7),
    "%s": () => String(Math.floor(d.getTime() / 1000)),
    "%n": () => "\n",
    "%t": () => "\t",
    "%%": () => "%",
  };
  // Sort keys by length desc so %-m matches before %m etc.
  const re = new RegExp(
    Object.keys(map)
      .sort((a, b) => b.length - a.length)
      .map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .join("|"),
    "g"
  );
  return fmt.replace(re, (m) => (map[m] ? map[m]() : m));
}

// ── Unicode / ICU pattern formatter (moment, date-fns, Java SimpleDateFormat) ─
function unicodeFormat(fmt: string, d: Date): string {
  const pad = (n: number, w = 2) => String(n).padStart(w, "0");
  const tokens: [RegExp, () => string][] = [
    [/yyyy/g, () => String(d.getFullYear())],
    [/yy/g, () => pad(d.getFullYear() % 100)],
    [/MMMM/g, () => d.toLocaleDateString("en-US", { month: "long" })],
    [/MMM/g, () => d.toLocaleDateString("en-US", { month: "short" })],
    [/MM/g, () => pad(d.getMonth() + 1)],
    [/M(?!a|o)/g, () => String(d.getMonth() + 1)],
    [/dd/g, () => pad(d.getDate())],
    [/d(?!e)/g, () => String(d.getDate())],
    [/EEEE/g, () => d.toLocaleDateString("en-US", { weekday: "long" })],
    [/EEE/g, () => d.toLocaleDateString("en-US", { weekday: "short" })],
    [/EE/g, () => d.toLocaleDateString("en-US", { weekday: "short" })],
    [/HH/g, () => pad(d.getHours())],
    [/H(?!:)/g, () => String(d.getHours())],
    [/hh/g, () => pad(d.getHours() % 12 || 12)],
    [/h(?!:)/g, () => String(d.getHours() % 12 || 12)],
    [/mm/g, () => pad(d.getMinutes())],
    [/m(?!i|o)/g, () => String(d.getMinutes())],
    [/ss/g, () => pad(d.getSeconds())],
    [/s(?!e|h)/g, () => String(d.getSeconds())],
    [/SSS/g, () => String(d.getMilliseconds()).padStart(3, "0")],
    [/SS/g, () => String(d.getMilliseconds()).padStart(3, "0").slice(0, 2)],
    [/S(?!e|u|a)/g, () => String(d.getMilliseconds()).padStart(3, "0").slice(0, 1)],
    [/a/g, () => (d.getHours() < 12 ? "AM" : "PM")],
    [/XXXX/g, () => {
      const off = -d.getTimezoneOffset();
      const sign = off >= 0 ? "+" : "-";
      return `${sign}${pad(Math.floor(Math.abs(off) / 60))}${pad(Math.abs(off) % 60)}`;
    }],
    [/XXX/g, () => {
      const off = -d.getTimezoneOffset();
      const sign = off >= 0 ? "+" : "-";
      return `${sign}${pad(Math.floor(Math.abs(off) / 60))}:${pad(Math.abs(off) % 60)}`;
    }],
    [/XX/g, () => {
      const off = -d.getTimezoneOffset();
      const sign = off >= 0 ? "+" : "-";
      return `${sign}${pad(Math.floor(Math.abs(off) / 60))}${pad(Math.abs(off) % 60)}`;
    }],
    [/X/g, () => {
      const off = -d.getTimezoneOffset();
      const sign = off >= 0 ? "+" : "-";
      const h = Math.floor(Math.abs(off) / 60);
      const m = Math.abs(off) % 60;
      return m === 0 ? `${sign}${pad(h)}` : `${sign}${pad(h)}${pad(m)}`;
    }],
  ];
  // Process quoted literals first (text in single quotes is literal)
  let result = fmt;
  const literals: string[] = [];
  result = result.replace(/'([^']*)'/g, (_, text) => {
    literals.push(text);
    return `\x00${literals.length - 1}\x00`;
  });
  for (const [re, fn] of tokens) {
    result = result.replace(re, fn);
  }
  result = result.replace(/\x00(\d+)\x00/g, (_, i) => literals[Number(i)]);
  return result;
}

// ── Go reference format (Mon Jan 2 15:04:05 MST 2006) ────────────
function goFormat(fmt: string, d: Date): string {
  const pad = (n: number, w = 2) => String(n).padStart(w, "0");
  const tokens: [string, () => string][] = [
    ["2006", () => String(d.getFullYear())],
    ["06", () => pad(d.getFullYear() % 100)],
    ["January", () => d.toLocaleDateString("en-US", { month: "long" })],
    ["Jan", () => d.toLocaleDateString("en-US", { month: "short" })],
    ["01", () => pad(d.getMonth() + 1)],
    ["1", () => String(d.getMonth() + 1)],
    ["Monday", () => d.toLocaleDateString("en-US", { weekday: "long" })],
    ["Mon", () => d.toLocaleDateString("en-US", { weekday: "short" })],
    ["02", () => pad(d.getDate())],
    ["2", () => String(d.getDate())],
    ["15", () => pad(d.getHours())],
    ["03", () => pad(d.getHours() % 12 || 12)],
    ["3", () => String(d.getHours() % 12 || 12)],
    ["04", () => pad(d.getMinutes())],
    ["4", () => String(d.getMinutes())],
    ["05", () => pad(d.getSeconds())],
    ["5", () => String(d.getSeconds())],
    ["PM", () => (d.getHours() < 12 ? "AM" : "PM")],
    ["pm", () => (d.getHours() < 12 ? "am" : "pm")],
    [".000", () => "." + String(d.getMilliseconds()).padStart(3, "0")],
    [".999", () => {
      const ms = d.getMilliseconds();
      return ms === 0 ? "" : "." + String(ms).padStart(3, "0");
    }],
    ["-0700", () => {
      const off = -d.getTimezoneOffset();
      const sign = off >= 0 ? "+" : "-";
      return `${sign}${pad(Math.floor(Math.abs(off) / 60))}${pad(Math.abs(off) % 60)}`;
    }],
    ["-07:00", () => {
      const off = -d.getTimezoneOffset();
      const sign = off >= 0 ? "+" : "-";
      return `${sign}${pad(Math.floor(Math.abs(off) / 60))}:${pad(Math.abs(off) % 60)}`;
    }],
    ["-07", () => {
      const off = -d.getTimezoneOffset();
      const sign = off >= 0 ? "+" : "-";
      return `${sign}${pad(Math.floor(Math.abs(off) / 60))}`;
    }],
    ["MST", () => {
      const m = d.toTimeString().match(/\((.+)\)/);
      return m ? m[1] : "";
    }],
    ["Z0700", () => {
      const off = -d.getTimezoneOffset();
      if (off === 0) return "Z";
      const sign = off > 0 ? "+" : "-";
      return `${sign}${pad(Math.floor(Math.abs(off) / 60))}${pad(Math.abs(off) % 60)}`;
    }],
  ];
  let result = fmt;
  for (const [token, fn] of tokens) {
    const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    result = result.replace(new RegExp(escaped, "g"), fn);
  }
  return result;
}

function formatDate(style: FormatStyle, pattern: string, d: Date): string {
  switch (style) {
    case "strftime":
      return strftime(pattern, d);
    case "unicode":
    case "java":
      return unicodeFormat(pattern, d);
    case "go":
      return goFormat(pattern, d);
  }
}

// ── Preset patterns ─────────────────────────────────────────────────
interface Preset {
  label: string;
  patterns: Record<FormatStyle, string>;
}

const PRESETS: Preset[] = [
  {
    label: "ISO 8601",
    patterns: {
      strftime: "%Y-%m-%dT%H:%M:%S%z",
      unicode: "yyyy-MM-dd'T'HH:mm:ssXXX",
      go: "2006-01-02T15:04:05-07:00",
      java: "yyyy-MM-dd'T'HH:mm:ssXXX",
    },
  },
  {
    label: "US Date",
    patterns: {
      strftime: "%m/%d/%Y",
      unicode: "MM/dd/yyyy",
      go: "01/02/2006",
      java: "MM/dd/yyyy",
    },
  },
  {
    label: "EU Date",
    patterns: {
      strftime: "%d/%m/%Y",
      unicode: "dd/MM/yyyy",
      go: "02/01/2006",
      java: "dd/MM/yyyy",
    },
  },
  {
    label: "Full Date + Time",
    patterns: {
      strftime: "%A, %B %-d, %Y %I:%M %p",
      unicode: "EEEE, MMMM d, yyyy hh:mm a",
      go: "Monday, January 2, 2006 03:04 PM",
      java: "EEEE, MMMM d, yyyy hh:mm a",
    },
  },
  {
    label: "Short Date + Time",
    patterns: {
      strftime: "%Y-%m-%d %H:%M:%S",
      unicode: "yyyy-MM-dd HH:mm:ss",
      go: "2006-01-02 15:04:05",
      java: "yyyy-MM-dd HH:mm:ss",
    },
  },
  {
    label: "Time Only (12h)",
    patterns: {
      strftime: "%I:%M:%S %p",
      unicode: "hh:mm:ss a",
      go: "03:04:05 PM",
      java: "hh:mm:ss a",
    },
  },
  {
    label: "Time Only (24h)",
    patterns: {
      strftime: "%H:%M:%S",
      unicode: "HH:mm:ss",
      go: "15:04:05",
      java: "HH:mm:ss",
    },
  },
  {
    label: "RFC 2822",
    patterns: {
      strftime: "%a, %d %b %Y %H:%M:%S %z",
      unicode: "EEE, dd MMM yyyy HH:mm:ss XX",
      go: "Mon, 02 Jan 2006 15:04:05 -0700",
      java: "EEE, dd MMM yyyy HH:mm:ss XX",
    },
  },
];

// ── Token reference ─────────────────────────────────────────────────
interface TokenRef {
  token: string;
  desc: string;
  example: string;
}

const STRFTIME_TOKENS: TokenRef[] = [
  { token: "%Y", desc: "4-digit year", example: "2026" },
  { token: "%y", desc: "2-digit year", example: "26" },
  { token: "%m", desc: "Month (01–12)", example: "03" },
  { token: "%-m", desc: "Month (1–12)", example: "3" },
  { token: "%B", desc: "Full month name", example: "March" },
  { token: "%b", desc: "Abbreviated month", example: "Mar" },
  { token: "%d", desc: "Day (01–31)", example: "18" },
  { token: "%-d", desc: "Day (1–31)", example: "18" },
  { token: "%A", desc: "Full weekday", example: "Wednesday" },
  { token: "%a", desc: "Abbreviated weekday", example: "Wed" },
  { token: "%H", desc: "Hour 24h (00–23)", example: "14" },
  { token: "%I", desc: "Hour 12h (01–12)", example: "02" },
  { token: "%M", desc: "Minute (00–59)", example: "05" },
  { token: "%S", desc: "Second (00–59)", example: "09" },
  { token: "%p", desc: "AM/PM", example: "PM" },
  { token: "%z", desc: "UTC offset", example: "+0100" },
  { token: "%Z", desc: "Timezone name", example: "EST" },
  { token: "%j", desc: "Day of year (001–366)", example: "077" },
  { token: "%w", desc: "Weekday (0=Sun)", example: "3" },
  { token: "%s", desc: "Unix timestamp", example: "1774070400" },
  { token: "%%", desc: "Literal %", example: "%" },
];

const UNICODE_TOKENS: TokenRef[] = [
  { token: "yyyy", desc: "4-digit year", example: "2026" },
  { token: "yy", desc: "2-digit year", example: "26" },
  { token: "MM", desc: "Month (01–12)", example: "03" },
  { token: "M", desc: "Month (1–12)", example: "3" },
  { token: "MMMM", desc: "Full month name", example: "March" },
  { token: "MMM", desc: "Abbreviated month", example: "Mar" },
  { token: "dd", desc: "Day (01–31)", example: "18" },
  { token: "d", desc: "Day (1–31)", example: "18" },
  { token: "EEEE", desc: "Full weekday", example: "Wednesday" },
  { token: "EEE", desc: "Abbreviated weekday", example: "Wed" },
  { token: "HH", desc: "Hour 24h (00–23)", example: "14" },
  { token: "hh", desc: "Hour 12h (01–12)", example: "02" },
  { token: "mm", desc: "Minute (00–59)", example: "05" },
  { token: "ss", desc: "Second (00–59)", example: "09" },
  { token: "SSS", desc: "Milliseconds", example: "042" },
  { token: "a", desc: "AM/PM", example: "PM" },
  { token: "XXX", desc: "Offset ±HH:mm", example: "+01:00" },
  { token: "XX", desc: "Offset ±HHmm", example: "+0100" },
];

const GO_TOKENS: TokenRef[] = [
  { token: "2006", desc: "4-digit year", example: "2026" },
  { token: "06", desc: "2-digit year", example: "26" },
  { token: "01", desc: "Month (01–12)", example: "03" },
  { token: "1", desc: "Month (1–12)", example: "3" },
  { token: "January", desc: "Full month name", example: "March" },
  { token: "Jan", desc: "Abbreviated month", example: "Mar" },
  { token: "02", desc: "Day (01–31)", example: "18" },
  { token: "2", desc: "Day (1–31)", example: "18" },
  { token: "Monday", desc: "Full weekday", example: "Wednesday" },
  { token: "Mon", desc: "Abbreviated weekday", example: "Wed" },
  { token: "15", desc: "Hour 24h (00–23)", example: "14" },
  { token: "03", desc: "Hour 12h (01–12)", example: "02" },
  { token: "04", desc: "Minute (00–59)", example: "05" },
  { token: "05", desc: "Second (00–59)", example: "09" },
  { token: ".000", desc: "Milliseconds", example: ".042" },
  { token: "PM", desc: "AM/PM (upper)", example: "PM" },
  { token: "pm", desc: "am/pm (lower)", example: "pm" },
  { token: "-0700", desc: "Offset ±HHmm", example: "+0100" },
  { token: "-07:00", desc: "Offset ±HH:mm", example: "+01:00" },
  { token: "MST", desc: "Timezone name", example: "EST" },
];

function getTokens(style: FormatStyle): TokenRef[] {
  switch (style) {
    case "strftime":
      return STRFTIME_TOKENS;
    case "unicode":
    case "java":
      return UNICODE_TOKENS;
    case "go":
      return GO_TOKENS;
  }
}

const STYLE_LABELS: Record<FormatStyle, string> = {
  strftime: "strftime (Python, PHP, Ruby)",
  unicode: "Unicode (date-fns, Moment.js)",
  go: "Go (time.Format)",
  java: "Java (SimpleDateFormat)",
};

function nowLocalISO(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export default function DateFormatTesterTool() {
  const [style, setStyle] = useState<FormatStyle>("strftime");
  const [pattern, setPattern] = useState("%Y-%m-%d %H:%M:%S");
  const [dateInput, setDateInput] = useState(nowLocalISO);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const { remaining, dailyLimit, isLimited, recordUsage } =
    useRateLimit("date-format-tester");
  const { trackAction } = useToolAnalytics("date-format-tester");

  const handleFormat = useCallback(() => {
    if (isLimited) return;
    recordUsage();
    trackAction("format");
    setError("");
    setOutput("");
    setCopied(false);

    try {
      const d = new Date(dateInput);
      if (isNaN(d.getTime())) {
        setError("Invalid date. Please check your input.");
        return;
      }
      setOutput(formatDate(style, pattern, d));
    } catch {
      setError("Error formatting date. Check your pattern and input.");
    }
  }, [style, pattern, dateInput, isLimited, recordUsage, trackAction]);

  useKeyboardShortcut("Enter", handleFormat);

  const handleNow = useCallback(() => {
    setDateInput(nowLocalISO());
  }, []);

  const handleCopy = useCallback(() => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  const handlePreset = useCallback(
    (preset: Preset) => {
      setPattern(preset.patterns[style]);
    },
    [style]
  );

  const handleStyleChange = useCallback(
    (newStyle: FormatStyle) => {
      // Try to find current pattern in presets and switch to equivalent
      const currentPreset = PRESETS.find((p) => p.patterns[style] === pattern);
      setStyle(newStyle);
      if (currentPreset) {
        setPattern(currentPreset.patterns[newStyle]);
      } else {
        // Set a sensible default
        setPattern(PRESETS[4].patterns[newStyle]); // Short Date + Time
      }
      setOutput("");
      setError("");
    },
    [style, pattern]
  );

  const tokens = useMemo(() => getTokens(style), [style]);

  // Live preview of all presets
  const presetPreviews = useMemo(() => {
    try {
      const d = new Date(dateInput);
      if (isNaN(d.getTime())) return null;
      return PRESETS.map((p) => ({
        label: p.label,
        pattern: p.patterns[style],
        output: formatDate(style, p.patterns[style], d),
      }));
    } catch {
      return null;
    }
  }, [dateInput, style]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="mb-8 block text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        &larr; Back to tools
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Date Format Tester
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Test date format patterns for strftime, date-fns, Moment.js, Go, and Java.
        Enter a date and pattern to see the formatted output instantly.
      </p>

      {/* Format style selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Format Style
        </label>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(STYLE_LABELS) as FormatStyle[]).map((s) => (
            <button
              key={s}
              onClick={() => handleStyleChange(s)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                style === s
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-800"
              }`}
            >
              {STYLE_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Date input */}
      <div className="mb-4">
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Input Date & Time
            </label>
            <input
              type="datetime-local"
              value={dateInput}
              step="1"
              onChange={(e) => setDateInput(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <button
            onClick={handleNow}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
          >
            Now
          </button>
        </div>
      </div>

      {/* Pattern input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Format Pattern
        </label>
        <input
          type="text"
          value={pattern}
          onChange={(e) => setPattern(e.target.value)}
          placeholder={style === "strftime" ? "%Y-%m-%d %H:%M:%S" : "yyyy-MM-dd HH:mm:ss"}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 font-mono text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      {/* Preset buttons */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Presets
        </label>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => handlePreset(p)}
              className="rounded-md border border-gray-300 bg-white px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2 items-center mb-6">
        <button
          onClick={handleFormat}
          disabled={isLimited}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          Format{" "}
          <kbd className="ml-1 hidden rounded bg-indigo-500 px-1.5 py-0.5 text-xs font-normal text-indigo-100 sm:inline">
            Ctrl+Enter
          </kbd>
        </button>
        <RateLimitBanner
          remaining={remaining}
          dailyLimit={dailyLimit}
          isLimited={isLimited}
        />
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Output */}
      {output && (
        <div className="mb-8 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Formatted Output
            </span>
            <button
              onClick={handleCopy}
              className="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <p className="font-mono text-lg text-gray-900 dark:text-gray-100 break-all">
            {output}
          </p>
        </div>
      )}

      {/* Live preset previews */}
      {presetPreviews && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Common Formats Preview
          </h2>
          <div className="rounded-lg border border-gray-300 dark:border-gray-700 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900">
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Format
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Pattern
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Output
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {presetPreviews.map((p) => (
                  <tr
                    key={p.label}
                    className="group hover:bg-gray-50 dark:hover:bg-gray-900/50 cursor-pointer"
                    onClick={() => setPattern(p.pattern)}
                  >
                    <td className="px-4 py-2 font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                      {p.label}
                    </td>
                    <td className="px-4 py-2 font-mono text-xs text-gray-500 dark:text-gray-500 break-all">
                      {p.pattern}
                    </td>
                    <td className="px-4 py-2 font-mono text-gray-900 dark:text-gray-100 break-all">
                      {p.output}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Click a row to use that pattern
          </p>
        </div>
      )}

      {/* Token reference */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Token Reference — {STYLE_LABELS[style]}
        </h2>
        <div className="rounded-lg border border-gray-300 dark:border-gray-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900">
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-24">
                  Token
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-36">
                  Example
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {tokens.map((t) => (
                <tr key={t.token} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                  <td className="px-4 py-1.5 font-mono font-medium text-indigo-600 dark:text-indigo-400">
                    {t.token}
                  </td>
                  <td className="px-4 py-1.5 text-gray-700 dark:text-gray-300">
                    {t.desc}
                  </td>
                  <td className="px-4 py-1.5 font-mono text-gray-500 dark:text-gray-500">
                    {t.example}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick reference */}
      <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-900">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
          Quick Reference
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500">
          <strong>strftime</strong> — Python (<code>datetime.strftime</code>), PHP (<code>strftime</code>), Ruby (<code>Time#strftime</code>), C.{" "}
          <strong>Unicode</strong> — date-fns (<code>format</code>), Moment.js, Day.js.{" "}
          <strong>Go</strong> — uses reference time <code>Mon Jan 2 15:04:05 MST 2006</code>.{" "}
          <strong>Java</strong> — <code>SimpleDateFormat</code>, Kotlin, Scala.
        </p>
      </div>
    </div>
  );
}
