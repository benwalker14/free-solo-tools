"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";
import RateLimitBanner from "@/components/RateLimitBanner";

// ── Format systems ──────────────────────────────────────────────────────────

type FormatSystem = "strftime" | "moment" | "datefns";

const FORMAT_SYSTEMS: { key: FormatSystem; label: string; description: string }[] = [
  { key: "strftime", label: "strftime", description: "Python, C, Ruby, PHP" },
  { key: "moment", label: "Moment.js / Day.js", description: "Also Luxon" },
  { key: "datefns", label: "date-fns", description: "TypeScript-first" },
];

interface Preset {
  label: string;
  strftime: string;
  moment: string;
  datefns: string;
}

const PRESETS: Preset[] = [
  { label: "ISO 8601", strftime: "%Y-%m-%dT%H:%M:%S", moment: "YYYY-MM-DDTHH:mm:ss", datefns: "yyyy-MM-dd'T'HH:mm:ss" },
  { label: "US Date", strftime: "%m/%d/%Y", moment: "MM/DD/YYYY", datefns: "MM/dd/yyyy" },
  { label: "EU Date", strftime: "%d/%m/%Y", moment: "DD/MM/YYYY", datefns: "dd/MM/yyyy" },
  { label: "Long Date", strftime: "%B %d, %Y", moment: "MMMM DD, YYYY", datefns: "MMMM dd, yyyy" },
  { label: "Short Date", strftime: "%b %d, %Y", moment: "MMM DD, YYYY", datefns: "MMM dd, yyyy" },
  { label: "Time 24h", strftime: "%H:%M:%S", moment: "HH:mm:ss", datefns: "HH:mm:ss" },
  { label: "Time 12h", strftime: "%I:%M %p", moment: "hh:mm A", datefns: "hh:mm a" },
  { label: "Full DateTime", strftime: "%A, %B %d, %Y %I:%M %p", moment: "dddd, MMMM DD, YYYY hh:mm A", datefns: "EEEE, MMMM dd, yyyy hh:mm a" },
  { label: "SQL DateTime", strftime: "%Y-%m-%d %H:%M:%S", moment: "YYYY-MM-DD HH:mm:ss", datefns: "yyyy-MM-dd HH:mm:ss" },
  { label: "RFC 2822", strftime: "%a, %d %b %Y %H:%M:%S", moment: "ddd, DD MMM YYYY HH:mm:ss", datefns: "EEE, dd MMM yyyy HH:mm:ss" },
  { label: "Log Format", strftime: "%Y-%m-%d %H:%M:%S.%f", moment: "YYYY-MM-DD HH:mm:ss.SSS", datefns: "yyyy-MM-dd HH:mm:ss.SSS" },
  { label: "Compact", strftime: "%Y%m%d%H%M%S", moment: "YYYYMMDDHHmmss", datefns: "yyyyMMddHHmmss" },
];

// ── Formatting engines ──────────────────────────────────────────────────────

const WEEKDAYS_FULL = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const WEEKDAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS_FULL = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function pad(n: number, width = 2): string {
  return n.toString().padStart(width, "0");
}

function h12(h: number): number {
  return h % 12 || 12;
}

function dayOfYear(d: Date): number {
  const start = new Date(d.getFullYear(), 0, 0);
  const diff = d.getTime() - start.getTime();
  return Math.floor(diff / 86400000);
}

function tzOffset(d: Date, colon = false): string {
  const off = -d.getTimezoneOffset();
  const sign = off >= 0 ? "+" : "-";
  const h = pad(Math.floor(Math.abs(off) / 60));
  const m = pad(Math.abs(off) % 60);
  return colon ? `${sign}${h}:${m}` : `${sign}${h}${m}`;
}

function formatStrftime(d: Date, fmt: string): string {
  let result = "";
  let i = 0;
  while (i < fmt.length) {
    if (fmt[i] === "%" && i + 1 < fmt.length) {
      const c = fmt[i + 1];
      switch (c) {
        case "Y": result += d.getFullYear(); break;
        case "y": result += pad(d.getFullYear() % 100); break;
        case "m": result += pad(d.getMonth() + 1); break;
        case "d": result += pad(d.getDate()); break;
        case "e": result += d.getDate().toString().padStart(2, " "); break;
        case "H": result += pad(d.getHours()); break;
        case "k": result += d.getHours().toString().padStart(2, " "); break;
        case "I": result += pad(h12(d.getHours())); break;
        case "l": result += h12(d.getHours()).toString().padStart(2, " "); break;
        case "M": result += pad(d.getMinutes()); break;
        case "S": result += pad(d.getSeconds()); break;
        case "f": result += pad(d.getMilliseconds(), 3) + "000"; break;
        case "p": result += d.getHours() >= 12 ? "PM" : "AM"; break;
        case "P": result += d.getHours() >= 12 ? "pm" : "am"; break;
        case "A": result += WEEKDAYS_FULL[d.getDay()]; break;
        case "a": result += WEEKDAYS_SHORT[d.getDay()]; break;
        case "B": result += MONTHS_FULL[d.getMonth()]; break;
        case "b": case "h": result += MONTHS_SHORT[d.getMonth()]; break;
        case "j": result += pad(dayOfYear(d), 3); break;
        case "w": result += d.getDay().toString(); break;
        case "u": result += (d.getDay() || 7).toString(); break;
        case "Z": result += Intl.DateTimeFormat("en", { timeZoneName: "short" }).formatToParts(d).find(p => p.type === "timeZoneName")?.value ?? ""; break;
        case "z": result += tzOffset(d); break;
        case "s": result += Math.floor(d.getTime() / 1000).toString(); break;
        case "F": result += `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; break;
        case "T": result += `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`; break;
        case "R": result += `${pad(d.getHours())}:${pad(d.getMinutes())}`; break;
        case "n": result += "\n"; break;
        case "t": result += "\t"; break;
        case "%": result += "%"; break;
        default: result += "%" + c;
      }
      i += 2;
    } else {
      result += fmt[i];
      i++;
    }
  }
  return result;
}

function formatMoment(d: Date, fmt: string): string {
  // Process tokens from longest to shortest to avoid partial matches
  const tokens: [RegExp, () => string][] = [
    [/YYYY/g, () => d.getFullYear().toString()],
    [/YY/g, () => pad(d.getFullYear() % 100)],
    [/MMMM/g, () => MONTHS_FULL[d.getMonth()]],
    [/MMM/g, () => MONTHS_SHORT[d.getMonth()]],
    [/MM/g, () => pad(d.getMonth() + 1)],
    [/M(?![oA])/g, () => (d.getMonth() + 1).toString()],
    [/DD/g, () => pad(d.getDate())],
    [/D(?![oe])/g, () => d.getDate().toString()],
    [/dddd/g, () => WEEKDAYS_FULL[d.getDay()]],
    [/ddd/g, () => WEEKDAYS_SHORT[d.getDay()]],
    [/dd/g, () => WEEKDAYS_SHORT[d.getDay()].slice(0, 2)],
    [/HH/g, () => pad(d.getHours())],
    [/H(?!H)/g, () => d.getHours().toString()],
    [/hh/g, () => pad(h12(d.getHours()))],
    [/h(?!h)/g, () => h12(d.getHours()).toString()],
    [/mm/g, () => pad(d.getMinutes())],
    [/ss/g, () => pad(d.getSeconds())],
    [/SSS/g, () => pad(d.getMilliseconds(), 3)],
    [/SS/g, () => pad(Math.floor(d.getMilliseconds() / 10))],
    [/A/g, () => d.getHours() >= 12 ? "PM" : "AM"],
    [/a/g, () => d.getHours() >= 12 ? "pm" : "am"],
    [/ZZ/g, () => tzOffset(d)],
    [/Z(?!Z)/g, () => tzOffset(d, true)],
    [/X/g, () => Math.floor(d.getTime() / 1000).toString()],
    [/x/g, () => d.getTime().toString()],
  ];

  // Escape [...] blocks
  const escaped: string[] = [];
  let result = fmt.replace(/\[([^\]]*)\]/g, (_, text) => {
    escaped.push(text);
    return `\x00${escaped.length - 1}\x00`;
  });

  for (const [regex, fn] of tokens) {
    result = result.replace(regex, fn);
  }

  // Restore escaped blocks
  result = result.replace(/\x00(\d+)\x00/g, (_, idx) => escaped[Number(idx)]);
  return result;
}

function formatDateFns(d: Date, fmt: string): string {
  const tokens: [RegExp, () => string][] = [
    [/yyyy/g, () => d.getFullYear().toString()],
    [/yy/g, () => pad(d.getFullYear() % 100)],
    [/MMMM/g, () => MONTHS_FULL[d.getMonth()]],
    [/MMM/g, () => MONTHS_SHORT[d.getMonth()]],
    [/MM/g, () => pad(d.getMonth() + 1)],
    [/M(?![oM])/g, () => (d.getMonth() + 1).toString()],
    [/dd/g, () => pad(d.getDate())],
    [/d(?![d])/g, () => d.getDate().toString()],
    [/EEEE/g, () => WEEKDAYS_FULL[d.getDay()]],
    [/EEE/g, () => WEEKDAYS_SHORT[d.getDay()]],
    [/EE/g, () => WEEKDAYS_SHORT[d.getDay()].slice(0, 2)],
    [/HH/g, () => pad(d.getHours())],
    [/H(?!H)/g, () => d.getHours().toString()],
    [/hh/g, () => pad(h12(d.getHours()))],
    [/h(?!h)/g, () => h12(d.getHours()).toString()],
    [/mm/g, () => pad(d.getMinutes())],
    [/m(?!m)/g, () => d.getMinutes().toString()],
    [/ss/g, () => pad(d.getSeconds())],
    [/s(?!s)/g, () => d.getSeconds().toString()],
    [/SSS/g, () => pad(d.getMilliseconds(), 3)],
    [/aaa/g, () => d.getHours() >= 12 ? "pm" : "am"],
    [/aa/g, () => d.getHours() >= 12 ? "PM" : "AM"],
    [/a(?!a)/g, () => d.getHours() >= 12 ? "PM" : "AM"],
    [/XXX/g, () => tzOffset(d, true)],
    [/xx/g, () => tzOffset(d)],
    [/t/g, () => Math.floor(d.getTime() / 1000).toString()],
    [/T/g, () => d.getTime().toString()],
  ];

  // Escape '...' blocks
  const escaped: string[] = [];
  let result = fmt.replace(/'([^']*)'/g, (_, text) => {
    escaped.push(text);
    return `\x00${escaped.length - 1}\x00`;
  });

  for (const [regex, fn] of tokens) {
    result = result.replace(regex, fn);
  }

  result = result.replace(/\x00(\d+)\x00/g, (_, idx) => escaped[Number(idx)]);
  return result;
}

function formatDate(d: Date, fmt: string, system: FormatSystem): string {
  try {
    switch (system) {
      case "strftime": return formatStrftime(d, fmt);
      case "moment": return formatMoment(d, fmt);
      case "datefns": return formatDateFns(d, fmt);
    }
  } catch {
    return "(invalid format)";
  }
}

// ── Token reference tables ──────────────────────────────────────────────────

interface TokenRef {
  token: string;
  description: string;
  example: string;
}

const STRFTIME_TOKENS: TokenRef[] = [
  { token: "%Y", description: "4-digit year", example: "2024" },
  { token: "%y", description: "2-digit year", example: "24" },
  { token: "%m", description: "Month (zero-padded)", example: "01–12" },
  { token: "%d", description: "Day (zero-padded)", example: "01–31" },
  { token: "%e", description: "Day (space-padded)", example: " 1–31" },
  { token: "%H", description: "Hour 24h (zero-padded)", example: "00–23" },
  { token: "%I", description: "Hour 12h (zero-padded)", example: "01–12" },
  { token: "%M", description: "Minute", example: "00–59" },
  { token: "%S", description: "Second", example: "00–59" },
  { token: "%f", description: "Microsecond", example: "000000" },
  { token: "%p", description: "AM/PM", example: "AM, PM" },
  { token: "%A", description: "Full weekday name", example: "Monday" },
  { token: "%a", description: "Abbreviated weekday", example: "Mon" },
  { token: "%B", description: "Full month name", example: "January" },
  { token: "%b", description: "Abbreviated month", example: "Jan" },
  { token: "%j", description: "Day of year", example: "001–366" },
  { token: "%w", description: "Weekday number (0=Sun)", example: "0–6" },
  { token: "%u", description: "Weekday number (1=Mon)", example: "1–7" },
  { token: "%Z", description: "Timezone name", example: "UTC, EST" },
  { token: "%z", description: "UTC offset", example: "+0000" },
  { token: "%s", description: "Unix timestamp", example: "1700000000" },
  { token: "%F", description: "ISO date (%Y-%m-%d)", example: "2024-01-15" },
  { token: "%T", description: "ISO time (%H:%M:%S)", example: "14:30:00" },
  { token: "%R", description: "Hours:minutes", example: "14:30" },
  { token: "%%", description: "Literal %", example: "%" },
];

const MOMENT_TOKENS: TokenRef[] = [
  { token: "YYYY", description: "4-digit year", example: "2024" },
  { token: "YY", description: "2-digit year", example: "24" },
  { token: "MMMM", description: "Full month name", example: "January" },
  { token: "MMM", description: "Abbreviated month", example: "Jan" },
  { token: "MM", description: "Month (zero-padded)", example: "01–12" },
  { token: "M", description: "Month", example: "1–12" },
  { token: "DD", description: "Day (zero-padded)", example: "01–31" },
  { token: "D", description: "Day", example: "1–31" },
  { token: "dddd", description: "Full weekday name", example: "Monday" },
  { token: "ddd", description: "Abbreviated weekday", example: "Mon" },
  { token: "dd", description: "2-char weekday", example: "Mo" },
  { token: "HH", description: "Hour 24h (zero-padded)", example: "00–23" },
  { token: "H", description: "Hour 24h", example: "0–23" },
  { token: "hh", description: "Hour 12h (zero-padded)", example: "01–12" },
  { token: "h", description: "Hour 12h", example: "1–12" },
  { token: "mm", description: "Minute (zero-padded)", example: "00–59" },
  { token: "ss", description: "Second (zero-padded)", example: "00–59" },
  { token: "SSS", description: "Millisecond", example: "000–999" },
  { token: "A", description: "AM/PM", example: "AM, PM" },
  { token: "a", description: "am/pm", example: "am, pm" },
  { token: "Z", description: "UTC offset (+00:00)", example: "+05:30" },
  { token: "ZZ", description: "UTC offset (+0000)", example: "+0530" },
  { token: "X", description: "Unix timestamp (s)", example: "1700000000" },
  { token: "x", description: "Unix timestamp (ms)", example: "1700000000000" },
  { token: "[text]", description: "Escape literal text", example: "[at] → at" },
];

const DATEFNS_TOKENS: TokenRef[] = [
  { token: "yyyy", description: "4-digit year", example: "2024" },
  { token: "yy", description: "2-digit year", example: "24" },
  { token: "MMMM", description: "Full month name", example: "January" },
  { token: "MMM", description: "Abbreviated month", example: "Jan" },
  { token: "MM", description: "Month (zero-padded)", example: "01–12" },
  { token: "M", description: "Month", example: "1–12" },
  { token: "dd", description: "Day (zero-padded)", example: "01–31" },
  { token: "d", description: "Day", example: "1–31" },
  { token: "EEEE", description: "Full weekday name", example: "Monday" },
  { token: "EEE", description: "Abbreviated weekday", example: "Mon" },
  { token: "EE", description: "2-char weekday", example: "Mo" },
  { token: "HH", description: "Hour 24h (zero-padded)", example: "00–23" },
  { token: "H", description: "Hour 24h", example: "0–23" },
  { token: "hh", description: "Hour 12h (zero-padded)", example: "01–12" },
  { token: "h", description: "Hour 12h", example: "1–12" },
  { token: "mm", description: "Minute (zero-padded)", example: "00–59" },
  { token: "m", description: "Minute", example: "0–59" },
  { token: "ss", description: "Second (zero-padded)", example: "00–59" },
  { token: "s", description: "Second", example: "0–59" },
  { token: "SSS", description: "Millisecond", example: "000–999" },
  { token: "a", description: "AM/PM", example: "AM, PM" },
  { token: "XXX", description: "UTC offset (+00:00)", example: "+05:30" },
  { token: "xx", description: "UTC offset (+0000)", example: "+0530" },
  { token: "'text'", description: "Escape literal text", example: "'at' → at" },
];

const TOKEN_REFS: Record<FormatSystem, TokenRef[]> = {
  strftime: STRFTIME_TOKENS,
  moment: MOMENT_TOKENS,
  datefns: DATEFNS_TOKENS,
};

// ── Component ───────────────────────────────────────────────────────────────

export default function DateFormatTool() {
  const [system, setSystem] = useState<FormatSystem>("strftime");
  const [pattern, setPattern] = useState("%Y-%m-%d %H:%M:%S");
  const [dateInput, setDateInput] = useState("");
  const [useNow, setUseNow] = useState(true);
  const [now, setNow] = useState(() => new Date());
  const [copied, setCopied] = useState(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const { remaining, dailyLimit, isLimited, recordUsage } = useRateLimit("date-format");
  const { trackAction } = useToolAnalytics("date-format");

  // Live clock when "Use now" is active
  useEffect(() => {
    if (!useNow) return;
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, [useNow]);

  const date = useMemo(() => {
    if (useNow) return now;
    const parsed = new Date(dateInput);
    return isNaN(parsed.getTime()) ? null : parsed;
  }, [useNow, now, dateInput]);

  const output = useMemo(() => {
    if (!date) return "(invalid date)";
    if (!pattern) return "";
    return formatDate(date, pattern, system);
  }, [date, pattern, system]);

  const handleCopy = useCallback(() => {
    if (!output || output === "(invalid date)" || output === "(invalid format)") return;
    if (isLimited) return;
    recordUsage();
    trackAction("copy");
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [output, isLimited, recordUsage, trackAction]);

  const handleCopyToken = useCallback((token: string) => {
    navigator.clipboard.writeText(token);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 1200);
  }, []);

  const handlePreset = useCallback((preset: Preset) => {
    trackAction("preset");
    setPattern(preset[system]);
  }, [system, trackAction]);

  const handleSystemChange = useCallback((newSystem: FormatSystem) => {
    trackAction("switch-system");
    // Find matching preset for current pattern to auto-convert
    const currentPreset = PRESETS.find((p) => p[system] === pattern);
    setSystem(newSystem);
    if (currentPreset) {
      setPattern(currentPreset[newSystem]);
    } else {
      // Set default pattern for new system
      switch (newSystem) {
        case "strftime": setPattern("%Y-%m-%d %H:%M:%S"); break;
        case "moment": setPattern("YYYY-MM-DD HH:mm:ss"); break;
        case "datefns": setPattern("yyyy-MM-dd HH:mm:ss"); break;
      }
    }
  }, [system, pattern, trackAction]);

  useKeyboardShortcut("Enter", handleCopy);

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
        Test date/time format patterns with live preview. Supports strftime (Python/C/Ruby), Moment.js / Day.js, and date-fns token systems.
      </p>

      {/* Format system selector */}
      <div className="mb-6 flex flex-wrap gap-2">
        {FORMAT_SYSTEMS.map((s) => (
          <button
            key={s.key}
            onClick={() => handleSystemChange(s.key)}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              system === s.key
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            {s.label}
            <span className="ml-1.5 text-xs opacity-75 hidden sm:inline">
              ({s.description})
            </span>
          </button>
        ))}
      </div>

      {/* Date input */}
      <div className="mb-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Input Date
          </label>
          <label className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
            <input
              type="checkbox"
              checked={useNow}
              onChange={(e) => {
                setUseNow(e.target.checked);
                if (!e.target.checked) {
                  setDateInput(new Date().toISOString().slice(0, 19));
                }
              }}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600"
            />
            Use current time (live)
          </label>
        </div>
        {useNow ? (
          <div className="flex items-center gap-3">
            <div className="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 font-mono text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
              {now.toISOString()}
            </div>
            <div className="relative flex h-3 w-3 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
            </div>
          </div>
        ) : (
          <input
            type="datetime-local"
            step="1"
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
        )}
      </div>

      {/* Format pattern */}
      <div className="mb-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Format Pattern
          </label>
          <div className="relative">
            <select
              onChange={(e) => {
                const preset = PRESETS[Number(e.target.value)];
                if (preset) handlePreset(preset);
                e.target.value = "";
              }}
              value=""
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            >
              <option value="" disabled>
                Load preset...
              </option>
              {PRESETS.map((p, i) => (
                <option key={i} value={i}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <input
          type="text"
          value={pattern}
          onChange={(e) => setPattern(e.target.value)}
          placeholder={system === "strftime" ? "%Y-%m-%d %H:%M:%S" : system === "moment" ? "YYYY-MM-DD HH:mm:ss" : "yyyy-MM-dd HH:mm:ss"}
          spellCheck={false}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-mono text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
        />
      </div>

      {/* Output */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Formatted Output
          </label>
          <button
            onClick={handleCopy}
            disabled={isLimited || !output || output === "(invalid date)" || output === "(invalid format)"}
            className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {copied ? "Copied!" : "Copy"}
            <kbd className="ml-1 hidden rounded bg-indigo-500 px-1 py-0.5 text-[10px] font-normal text-indigo-100 sm:inline">
              Ctrl+Enter
            </kbd>
          </button>
        </div>
        <div
          className={`rounded-lg border px-4 py-3 font-mono text-lg break-all ${
            output === "(invalid date)" || output === "(invalid format)"
              ? "border-red-200 bg-red-50 text-red-600 dark:border-red-900 dark:bg-red-950/20 dark:text-red-400"
              : "border-gray-200 bg-gray-50 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          }`}
        >
          {output || <span className="text-gray-400">Enter a format pattern above</span>}
        </div>
      </div>

      <RateLimitBanner remaining={remaining} dailyLimit={dailyLimit} isLimited={isLimited} />

      {/* All presets quick view */}
      <details className="mt-6 rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <summary className="px-5 py-3 cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
          Common format patterns — click to load
        </summary>
        <div className="px-5 pb-4 overflow-x-auto">
          <table className="w-full text-sm mt-2">
            <thead>
              <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                <th className="pb-2 pr-4 font-medium">Name</th>
                <th className="pb-2 pr-4 font-medium">Pattern</th>
                <th className="pb-2 font-medium">Preview</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 dark:text-gray-300">
              {PRESETS.map((p, i) => (
                <tr
                  key={i}
                  onClick={() => handlePreset(p)}
                  className="border-b border-gray-100 dark:border-gray-700/50 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                >
                  <td className="py-2 pr-4 font-medium">{p.label}</td>
                  <td className="py-2 pr-4 font-mono text-xs text-indigo-600 dark:text-indigo-400">{p[system]}</td>
                  <td className="py-2 font-mono text-xs text-gray-500 dark:text-gray-400">
                    {date ? formatDate(date, p[system], system) : "–"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>

      {/* Token reference */}
      <details className="mt-4 rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <summary className="px-5 py-3 cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
          {FORMAT_SYSTEMS.find((s) => s.key === system)?.label} token reference — click tokens to copy
        </summary>
        <div className="px-5 pb-4 overflow-x-auto">
          <table className="w-full text-sm mt-2">
            <thead>
              <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                <th className="pb-2 pr-4 font-medium w-24">Token</th>
                <th className="pb-2 pr-4 font-medium">Description</th>
                <th className="pb-2 font-medium w-32">Example</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 dark:text-gray-300">
              {TOKEN_REFS[system].map((t) => (
                <tr
                  key={t.token}
                  className="border-b border-gray-100 dark:border-gray-700/50"
                >
                  <td className="py-1.5 pr-4">
                    <button
                      onClick={() => handleCopyToken(t.token)}
                      className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
                      title={`Copy "${t.token}"`}
                    >
                      {copiedToken === t.token ? "Copied!" : t.token}
                    </button>
                  </td>
                  <td className="py-1.5 pr-4 text-gray-600 dark:text-gray-400">{t.description}</td>
                  <td className="py-1.5 text-gray-500 dark:text-gray-500 font-mono text-xs">{t.example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
