"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";

// --- Cron parsing logic ---

const MONTH_NAMES = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
];
const DAY_NAMES = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const FIELD_DEFS = [
  { name: "Minute", min: 0, max: 59 },
  { name: "Hour", min: 0, max: 23 },
  { name: "Day of Month", min: 1, max: 31 },
  { name: "Month", min: 1, max: 12, names: MONTH_NAMES },
  { name: "Day of Week", min: 0, max: 6, names: DAY_NAMES },
] as const;

interface FieldDef {
  name: string;
  min: number;
  max: number;
  names?: readonly string[];
}

function resolveNamedValue(token: string, names?: readonly string[]): number {
  if (!names) return Number(token);
  const upper = token.toUpperCase();
  const idx = names.indexOf(upper);
  if (idx >= 0) return idx + (names === MONTH_NAMES ? 1 : 0);
  return Number(token);
}

function parseField(raw: string, def: FieldDef): number[] | string {
  const { min, max, names } = def;
  const values = new Set<number>();

  for (const part of raw.split(",")) {
    const trimmed = part.trim();
    if (!trimmed) return `Empty value in "${raw}"`;

    // */step
    const stepMatch = trimmed.match(/^(\*|(\d+|\w+)(?:-(\d+|\w+))?)(?:\/(\d+))?$/);
    if (!stepMatch) return `Invalid syntax: "${trimmed}"`;

    const [, rangePart, startToken, endToken, stepToken] = stepMatch;
    const step = stepToken ? Number(stepToken) : 1;

    if (step < 1) return `Step must be >= 1 in "${trimmed}"`;

    let rangeStart = min;
    let rangeEnd = max;

    if (rangePart === "*") {
      // keep defaults
    } else if (endToken !== undefined) {
      // explicit range
      rangeStart = resolveNamedValue(startToken, names);
      rangeEnd = resolveNamedValue(endToken, names);
    } else {
      // single value
      rangeStart = resolveNamedValue(startToken, names);
      rangeEnd = stepToken ? max : rangeStart;
    }

    if (isNaN(rangeStart) || isNaN(rangeEnd)) return `Non-numeric value in "${trimmed}"`;
    if (rangeStart < min || rangeStart > max) return `${rangeStart} out of range ${min}-${max}`;
    if (rangeEnd < min || rangeEnd > max) return `${rangeEnd} out of range ${min}-${max}`;

    for (let v = rangeStart; v <= rangeEnd; v += step) {
      values.add(v);
    }
  }

  return [...values].sort((a, b) => a - b);
}

function describeField(values: number[], def: FieldDef): string {
  const { name, min, max, names } = def;
  const allValues = max - min + 1;

  if (values.length === allValues) return `every ${name.toLowerCase()}`;
  if (values.length === 1) {
    const v = values[0];
    if (names === MONTH_NAMES) return MONTH_NAMES[v - 1];
    if (names === DAY_NAMES) return DAY_NAMES[v];
    if (name === "Minute") return `at minute ${v}`;
    if (name === "Hour") return `at hour ${v}`;
    return `on day ${v}`;
  }

  // Check for step pattern
  if (values.length > 2) {
    const step = values[1] - values[0];
    const isStep = values.every((v, i) => i === 0 || v - values[i - 1] === step);
    if (isStep && values[0] === min) {
      return `every ${step} ${name.toLowerCase()}${step > 1 ? "s" : ""}`;
    }
  }

  // List values
  const formatted = values.map((v) => {
    if (names === MONTH_NAMES) return MONTH_NAMES[v - 1];
    if (names === DAY_NAMES) return DAY_NAMES[v];
    return String(v);
  });
  return formatted.join(", ");
}

function buildDescription(
  fields: { values: number[]; def: FieldDef }[],
): string {
  const [minute, hour, dom, month, dow] = fields;
  const parts: string[] = [];

  // Time
  const allMinutes = minute.values.length === 60;
  const allHours = hour.values.length === 24;

  if (allMinutes && allHours) {
    parts.push("Every minute");
  } else if (allMinutes) {
    parts.push(`Every minute past hour ${hour.values.join(", ")}`);
  } else if (allHours) {
    parts.push(`At minute ${minute.values.join(", ")} of every hour`);
  } else if (minute.values.length === 1 && hour.values.length === 1) {
    const h = hour.values[0];
    const m = minute.values[0];
    const hStr = h.toString().padStart(2, "0");
    const mStr = m.toString().padStart(2, "0");
    parts.push(`At ${hStr}:${mStr}`);
  } else {
    parts.push(
      `At minute ${minute.values.join(", ")} past hour ${hour.values.join(", ")}`,
    );
  }

  // Day of month
  const allDom = dom.values.length === 31;
  if (!allDom) {
    parts.push(`on day-of-month ${dom.values.join(", ")}`);
  }

  // Month
  const allMonths = month.values.length === 12;
  if (!allMonths) {
    parts.push(
      `in ${month.values.map((v) => MONTH_NAMES[v - 1]).join(", ")}`,
    );
  }

  // Day of week
  const allDow = dow.values.length === 7;
  if (!allDow) {
    parts.push(
      `on ${dow.values.map((v) => DAY_NAMES[v]).join(", ")}`,
    );
  }

  return parts.join(", ");
}

function getNextRuns(
  fields: { values: number[]; def: FieldDef }[],
  count: number,
): Date[] {
  const [minute, hour, dom, month, dow] = fields;
  const runs: Date[] = [];
  const now = new Date();
  const candidate = new Date(now);
  candidate.setSeconds(0, 0);
  candidate.setMinutes(candidate.getMinutes() + 1);

  const maxIterations = 525_960; // ~1 year of minutes
  let iterations = 0;

  while (runs.length < count && iterations < maxIterations) {
    iterations++;
    const m = candidate.getMonth() + 1;
    if (!month.values.includes(m)) {
      // Jump to next valid month
      candidate.setMonth(candidate.getMonth() + 1, 1);
      candidate.setHours(0, 0, 0, 0);
      continue;
    }

    const d = candidate.getDate();
    const w = candidate.getDay();
    if (!dom.values.includes(d) || !dow.values.includes(w)) {
      candidate.setDate(candidate.getDate() + 1);
      candidate.setHours(0, 0, 0, 0);
      continue;
    }

    const h = candidate.getHours();
    if (!hour.values.includes(h)) {
      candidate.setHours(candidate.getHours() + 1, 0, 0, 0);
      continue;
    }

    const min = candidate.getMinutes();
    if (!minute.values.includes(min)) {
      candidate.setMinutes(candidate.getMinutes() + 1, 0, 0);
      continue;
    }

    runs.push(new Date(candidate));
    candidate.setMinutes(candidate.getMinutes() + 1);
  }

  return runs;
}

interface ParseResult {
  fields: { raw: string; values: number[]; def: FieldDef; description: string }[];
  description: string;
  nextRuns: Date[];
}

function parseCron(expression: string): ParseResult | string {
  const parts = expression.trim().split(/\s+/);
  if (parts.length !== 5) {
    return `Expected 5 fields (minute hour day month weekday), got ${parts.length}`;
  }

  const fields: ParseResult["fields"] = [];
  for (let i = 0; i < 5; i++) {
    const result = parseField(parts[i], FIELD_DEFS[i]);
    if (typeof result === "string") {
      return `${FIELD_DEFS[i].name}: ${result}`;
    }
    fields.push({
      raw: parts[i],
      values: result,
      def: FIELD_DEFS[i],
      description: describeField(result, FIELD_DEFS[i]),
    });
  }

  const description = buildDescription(fields);
  const nextRuns = getNextRuns(fields, 5);

  return { fields, description, nextRuns };
}

// --- Presets ---

const PRESETS = [
  { label: "Every minute", value: "* * * * *" },
  { label: "Every hour", value: "0 * * * *" },
  { label: "Every day at midnight", value: "0 0 * * *" },
  { label: "Every Monday at 9 AM", value: "0 9 * * 1" },
  { label: "Every weekday at 8:30 AM", value: "30 8 * * 1-5" },
  { label: "Every 15 minutes", value: "*/15 * * * *" },
  { label: "1st of every month", value: "0 0 1 * *" },
  { label: "Every 6 hours", value: "0 */6 * * *" },
];

// --- Component ---

function formatDateTime(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return `${dayNames[date.getDay()]} ${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function CronParserTool() {
  const [input, setInput] = useState("*/15 * * * *");
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const { trackFirstInteraction } = useToolAnalytics("cron-parser");

  const result = useMemo(() => parseCron(input), [input]);
  const isError = typeof result === "string";

  function handleInputChange(value: string) {
    setInput(value);
    trackFirstInteraction();
    setCopiedIdx(null);
  }

  function handleCopy(text: string, idx: number) {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="mb-8 block text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        &larr; Back to tools
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Cron Expression Parser
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Parse cron expressions into human-readable descriptions with next
        scheduled runs. Updates as you type.
      </p>

      {/* Input */}
      <div className="mb-4">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
          Cron Expression{" "}
          <span className="font-normal text-gray-400 dark:text-gray-500">
            (minute hour day month weekday)
          </span>
        </label>
        <input
          type="text"
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="* * * * *"
          spellCheck={false}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 font-mono text-lg tracking-wider text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
        />
      </div>

      {/* Presets */}
      <div className="mb-6 flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.value}
            onClick={() => handleInputChange(p.value)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              input === p.value
                ? "border-indigo-300 bg-indigo-50 text-indigo-700 dark:border-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                : "border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Error */}
      {isError && input.trim() && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
          {result}
        </div>
      )}

      {/* Results */}
      {!isError && (
        <>
          {/* Human-readable description */}
          <div className="mb-6 rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-4 dark:border-indigo-800 dark:bg-indigo-950">
            <div className="text-xs font-medium text-indigo-500 dark:text-indigo-400 uppercase tracking-wide mb-1">
              Description
            </div>
            <div className="text-lg font-medium text-indigo-900 dark:text-indigo-100">
              {result.description}
            </div>
          </div>

          {/* Field breakdown */}
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Field Breakdown
            </h2>
            <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {result.fields.map((field, i) => (
                <div
                  key={field.def.name}
                  className="flex items-center gap-4 px-4 py-3 group"
                >
                  <div className="w-28 shrink-0">
                    <span className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                      {field.def.name}
                    </span>
                  </div>
                  <div className="w-20 shrink-0 font-mono text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                    {field.raw}
                  </div>
                  <div className="flex-1 text-sm text-gray-700 dark:text-gray-300">
                    {field.description}
                  </div>
                  <button
                    onClick={() => handleCopy(field.raw, i)}
                    className="ml-2 flex-shrink-0 rounded border border-gray-300 px-2 py-0.5 text-xs font-medium text-gray-500 opacity-0 group-hover:opacity-100 focus:opacity-100 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800 transition-all"
                  >
                    {copiedIdx === i ? "Copied!" : "Copy"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Next runs */}
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Next 5 Runs
            </h2>
            {result.nextRuns.length > 0 ? (
              <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {result.nextRuns.map((date, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-4 py-2.5 group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-5 text-center text-xs font-medium text-gray-400 dark:text-gray-500">
                        {i + 1}
                      </span>
                      <span className="font-mono text-sm text-gray-900 dark:text-gray-100">
                        {formatDateTime(date)}
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopy(date.toISOString(), 100 + i)}
                      className="rounded border border-gray-300 px-2 py-0.5 text-xs font-medium text-gray-500 opacity-0 group-hover:opacity-100 focus:opacity-100 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800 transition-all"
                    >
                      {copiedIdx === 100 + i ? "Copied!" : "Copy"}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No upcoming runs found within the next year.
              </p>
            )}
          </div>
        </>
      )}

      {/* Quick reference */}
      <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Cron Syntax Reference
        </h2>
        <div className="font-mono text-xs text-gray-500 dark:text-gray-400 mb-3">
          ┌───── minute (0-59)
          <br />
          │ ┌───── hour (0-23)
          <br />
          │ │ ┌───── day of month (1-31)
          <br />
          │ │ │ ┌───── month (1-12 or JAN-DEC)
          <br />
          │ │ │ │ ┌───── day of week (0-6 or SUN-SAT)
          <br />
          * * * * *
        </div>
        <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
          <li>
            <code className="text-xs bg-gray-200 dark:bg-gray-800 px-1 rounded">*</code>{" "}
            any value &nbsp;
            <code className="text-xs bg-gray-200 dark:bg-gray-800 px-1 rounded">,</code>{" "}
            list &nbsp;
            <code className="text-xs bg-gray-200 dark:bg-gray-800 px-1 rounded">-</code>{" "}
            range &nbsp;
            <code className="text-xs bg-gray-200 dark:bg-gray-800 px-1 rounded">/</code>{" "}
            step
          </li>
          <li>
            Month names (JAN-DEC) and day names (SUN-SAT) are supported.
          </li>
          <li>
            Everything runs in your browser — no data is sent over the network.
          </li>
        </ul>
      </div>
    </div>
  );
}
