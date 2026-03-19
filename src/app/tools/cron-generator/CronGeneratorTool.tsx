"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";

// --- Types ---

type Period = "minute" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "custom";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const DAY_ABBR = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

// --- Cron generation logic ---

interface CronConfig {
  period: Period;
  minute: number;
  hour: number;
  dayOfMonth: number;
  month: number;
  daysOfWeek: number[];
  everyNMinutes: number;
  everyNHours: number;
  // Custom fields
  customMinute: string;
  customHour: string;
  customDom: string;
  customMonth: string;
  customDow: string;
}

const DEFAULT_CONFIG: CronConfig = {
  period: "daily",
  minute: 0,
  hour: 0,
  dayOfMonth: 1,
  month: 1,
  daysOfWeek: [1], // Monday
  everyNMinutes: 5,
  everyNHours: 2,
  customMinute: "0",
  customHour: "*",
  customDom: "*",
  customMonth: "*",
  customDow: "*",
};

function buildExpression(config: CronConfig): string {
  switch (config.period) {
    case "minute":
      return config.everyNMinutes === 1
        ? "* * * * *"
        : `*/${config.everyNMinutes} * * * *`;
    case "hourly":
      return config.everyNHours === 1
        ? `${config.minute} * * * *`
        : `${config.minute} */${config.everyNHours} * * *`;
    case "daily":
      return `${config.minute} ${config.hour} * * *`;
    case "weekly":
      return `${config.minute} ${config.hour} * * ${config.daysOfWeek.sort((a, b) => a - b).join(",")}`;
    case "monthly":
      return `${config.minute} ${config.hour} ${config.dayOfMonth} * *`;
    case "yearly":
      return `${config.minute} ${config.hour} ${config.dayOfMonth} ${config.month} *`;
    case "custom":
      return `${config.customMinute} ${config.customHour} ${config.customDom} ${config.customMonth} ${config.customDow}`;
    default:
      return "* * * * *";
  }
}

function describeExpression(expr: string): string {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) return "Invalid expression";

  const [min, hour, dom, month, dow] = parts;
  const segments: string[] = [];

  // Handle minute / hour
  if (min === "*" && hour === "*") {
    segments.push("Every minute");
  } else if (min.startsWith("*/")) {
    segments.push(`Every ${min.slice(2)} minutes`);
    if (hour !== "*") {
      if (hour.startsWith("*/")) {
        segments[0] = `Every ${min.slice(2)} minutes, every ${hour.slice(2)} hours`;
      }
    }
  } else if (hour === "*") {
    segments.push(`At minute ${min} of every hour`);
  } else if (hour.startsWith("*/")) {
    segments.push(`At minute ${min}, every ${hour.slice(2)} hours`);
  } else {
    const h = parseInt(hour);
    const m = parseInt(min);
    if (!isNaN(h) && !isNaN(m)) {
      const hStr = h.toString().padStart(2, "0");
      const mStr = m.toString().padStart(2, "0");
      segments.push(`At ${hStr}:${mStr}`);
    } else {
      segments.push(`At minute ${min}, hour ${hour}`);
    }
  }

  // Day of month
  if (dom !== "*") {
    segments.push(`on day ${dom} of the month`);
  }

  // Month
  if (month !== "*") {
    const mIdx = parseInt(month);
    if (!isNaN(mIdx) && mIdx >= 1 && mIdx <= 12) {
      segments.push(`in ${MONTH_NAMES[mIdx - 1]}`);
    } else {
      segments.push(`in month ${month}`);
    }
  }

  // Day of week
  if (dow !== "*") {
    const dayParts = dow.split(",").map((d) => {
      const idx = parseInt(d);
      if (!isNaN(idx) && idx >= 0 && idx <= 6) return DAY_NAMES[idx];
      return d;
    });
    segments.push(`on ${dayParts.join(", ")}`);
  }

  return segments.join(", ");
}

function getNextRuns(expr: string, count: number): Date[] {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) return [];

  const [minF, hourF, domF, monthF, dowF] = parts;

  function expandField(field: string, min: number, max: number): number[] {
    const values = new Set<number>();
    for (const part of field.split(",")) {
      const stepMatch = part.match(/^(\*|(\d+)(?:-(\d+))?)(?:\/(\d+))?$/);
      if (!stepMatch) return [];
      const [, rangePart, startStr, endStr, stepStr] = stepMatch;
      const step = stepStr ? parseInt(stepStr) : 1;
      let rangeStart = min;
      let rangeEnd = max;
      if (rangePart === "*") {
        // keep defaults
      } else if (endStr !== undefined) {
        rangeStart = parseInt(startStr);
        rangeEnd = parseInt(endStr);
      } else {
        rangeStart = parseInt(startStr);
        rangeEnd = stepStr ? max : rangeStart;
      }
      if (isNaN(rangeStart) || isNaN(rangeEnd)) return [];
      for (let v = rangeStart; v <= rangeEnd; v += step) values.add(v);
    }
    return [...values].sort((a, b) => a - b);
  }

  const minutes = expandField(minF, 0, 59);
  const hours = expandField(hourF, 0, 23);
  const doms = expandField(domF, 1, 31);
  const months = expandField(monthF, 1, 12);
  const dows = expandField(dowF, 0, 6);

  if (!minutes.length || !hours.length || !doms.length || !months.length || !dows.length) return [];

  const runs: Date[] = [];
  const candidate = new Date();
  candidate.setSeconds(0, 0);
  candidate.setMinutes(candidate.getMinutes() + 1);

  let iterations = 0;
  while (runs.length < count && iterations < 525_960) {
    iterations++;
    if (!months.includes(candidate.getMonth() + 1)) {
      candidate.setMonth(candidate.getMonth() + 1, 1);
      candidate.setHours(0, 0, 0, 0);
      continue;
    }
    if (!doms.includes(candidate.getDate()) || !dows.includes(candidate.getDay())) {
      candidate.setDate(candidate.getDate() + 1);
      candidate.setHours(0, 0, 0, 0);
      continue;
    }
    if (!hours.includes(candidate.getHours())) {
      candidate.setHours(candidate.getHours() + 1, 0, 0, 0);
      continue;
    }
    if (!minutes.includes(candidate.getMinutes())) {
      candidate.setMinutes(candidate.getMinutes() + 1, 0, 0);
      continue;
    }
    runs.push(new Date(candidate));
    candidate.setMinutes(candidate.getMinutes() + 1);
  }

  return runs;
}

function formatDateTime(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return `${dayNames[date.getDay()]} ${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

// --- Presets ---

const PRESETS = [
  { label: "Every 5 minutes", config: { ...DEFAULT_CONFIG, period: "minute" as Period, everyNMinutes: 5 } },
  { label: "Every hour at :00", config: { ...DEFAULT_CONFIG, period: "hourly" as Period, minute: 0, everyNHours: 1 } },
  { label: "Daily at midnight", config: { ...DEFAULT_CONFIG, period: "daily" as Period, minute: 0, hour: 0 } },
  { label: "Daily at 9:00 AM", config: { ...DEFAULT_CONFIG, period: "daily" as Period, minute: 0, hour: 9 } },
  { label: "Weekdays at 8:30", config: { ...DEFAULT_CONFIG, period: "weekly" as Period, minute: 30, hour: 8, daysOfWeek: [1, 2, 3, 4, 5] } },
  { label: "Every Monday 9 AM", config: { ...DEFAULT_CONFIG, period: "weekly" as Period, minute: 0, hour: 9, daysOfWeek: [1] } },
  { label: "1st of month at midnight", config: { ...DEFAULT_CONFIG, period: "monthly" as Period, minute: 0, hour: 0, dayOfMonth: 1 } },
  { label: "Jan 1st at midnight", config: { ...DEFAULT_CONFIG, period: "yearly" as Period, minute: 0, hour: 0, dayOfMonth: 1, month: 1 } },
];

// --- Component ---

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: number | string;
  onChange: (v: number) => void;
  options: { value: number; label: string }[];
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function DayOfWeekPicker({
  selected,
  onChange,
}: {
  selected: number[];
  onChange: (days: number[]) => void;
}) {
  function toggle(day: number) {
    if (selected.includes(day)) {
      const next = selected.filter((d) => d !== day);
      if (next.length > 0) onChange(next);
    } else {
      onChange([...selected, day]);
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Day(s) of Week
      </label>
      <div className="flex flex-wrap gap-2">
        {DAY_ABBR.map((name, i) => (
          <button
            key={i}
            type="button"
            onClick={() => toggle(i)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              selected.includes(i)
                ? "bg-indigo-600 text-white shadow-sm"
                : "border border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800"
            }`}
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function CronGeneratorTool() {
  const [config, setConfig] = useState<CronConfig>(DEFAULT_CONFIG);
  const [copied, setCopied] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const { trackFirstInteraction } = useToolAnalytics("cron-generator");

  const expression = useMemo(() => buildExpression(config), [config]);
  const description = useMemo(() => describeExpression(expression), [expression]);
  const nextRuns = useMemo(() => getNextRuns(expression, 5), [expression]);

  const update = useCallback(
    (patch: Partial<CronConfig>) => {
      setConfig((prev) => ({ ...prev, ...patch }));
      trackFirstInteraction();
    },
    [trackFirstInteraction],
  );

  function handleCopyExpression() {
    navigator.clipboard.writeText(expression);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function handleCopyRun(text: string, idx: number) {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  }

  function applyPreset(preset: CronConfig) {
    setConfig(preset);
    trackFirstInteraction();
  }

  // Build options
  const minuteOptions = Array.from({ length: 60 }, (_, i) => ({
    value: i,
    label: i.toString().padStart(2, "0"),
  }));
  const hourOptions = Array.from({ length: 24 }, (_, i) => ({
    value: i,
    label: `${i.toString().padStart(2, "0")}:00 (${i === 0 ? "12 AM" : i < 12 ? `${i} AM` : i === 12 ? "12 PM" : `${i - 12} PM`})`,
  }));
  const dayOfMonthOptions = Array.from({ length: 31 }, (_, i) => ({
    value: i + 1,
    label: `${i + 1}`,
  }));
  const monthOptions = MONTH_NAMES.map((name, i) => ({
    value: i + 1,
    label: name,
  }));
  const everyNMinutesOptions = [1, 2, 3, 5, 10, 15, 20, 30].map((n) => ({
    value: n,
    label: n === 1 ? "Every minute" : `Every ${n} minutes`,
  }));
  const everyNHoursOptions = [1, 2, 3, 4, 6, 8, 12].map((n) => ({
    value: n,
    label: n === 1 ? "Every hour" : `Every ${n} hours`,
  }));

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="mb-8 block text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        &larr; Back to tools
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Crontab Generator
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Build cron expressions visually — select your schedule and get the expression
        instantly. Pair with the{" "}
        <Link
          href="/tools/cron-parser"
          className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 underline"
        >
          Cron Expression Parser
        </Link>{" "}
        for full cron debugging.
      </p>

      {/* Presets */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Quick Presets
        </label>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => applyPreset(p.config)}
              className="rounded-full border border-gray-300 px-3 py-1 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Period selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Run Every...
        </label>
        <div className="flex flex-wrap gap-2">
          {(
            [
              { value: "minute", label: "Minute(s)" },
              { value: "hourly", label: "Hour(s)" },
              { value: "daily", label: "Day" },
              { value: "weekly", label: "Week" },
              { value: "monthly", label: "Month" },
              { value: "yearly", label: "Year" },
              { value: "custom", label: "Custom" },
            ] as { value: Period; label: string }[]
          ).map((p) => (
            <button
              key={p.value}
              onClick={() => update({ period: p.value })}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                config.period === p.value
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Contextual options */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Schedule Options
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          {config.period === "minute" && (
            <SelectField
              label="Interval"
              value={config.everyNMinutes}
              onChange={(v) => update({ everyNMinutes: v })}
              options={everyNMinutesOptions}
            />
          )}

          {config.period === "hourly" && (
            <>
              <SelectField
                label="Interval"
                value={config.everyNHours}
                onChange={(v) => update({ everyNHours: v })}
                options={everyNHoursOptions}
              />
              <SelectField
                label="At Minute"
                value={config.minute}
                onChange={(v) => update({ minute: v })}
                options={minuteOptions}
              />
            </>
          )}

          {config.period === "daily" && (
            <>
              <SelectField
                label="Hour"
                value={config.hour}
                onChange={(v) => update({ hour: v })}
                options={hourOptions}
              />
              <SelectField
                label="Minute"
                value={config.minute}
                onChange={(v) => update({ minute: v })}
                options={minuteOptions}
              />
            </>
          )}

          {config.period === "weekly" && (
            <>
              <div className="sm:col-span-2">
                <DayOfWeekPicker
                  selected={config.daysOfWeek}
                  onChange={(days) => update({ daysOfWeek: days })}
                />
              </div>
              <SelectField
                label="Hour"
                value={config.hour}
                onChange={(v) => update({ hour: v })}
                options={hourOptions}
              />
              <SelectField
                label="Minute"
                value={config.minute}
                onChange={(v) => update({ minute: v })}
                options={minuteOptions}
              />
            </>
          )}

          {config.period === "monthly" && (
            <>
              <SelectField
                label="Day of Month"
                value={config.dayOfMonth}
                onChange={(v) => update({ dayOfMonth: v })}
                options={dayOfMonthOptions}
              />
              <SelectField
                label="Hour"
                value={config.hour}
                onChange={(v) => update({ hour: v })}
                options={hourOptions}
              />
              <SelectField
                label="Minute"
                value={config.minute}
                onChange={(v) => update({ minute: v })}
                options={minuteOptions}
              />
            </>
          )}

          {config.period === "yearly" && (
            <>
              <SelectField
                label="Month"
                value={config.month}
                onChange={(v) => update({ month: v })}
                options={monthOptions}
              />
              <SelectField
                label="Day of Month"
                value={config.dayOfMonth}
                onChange={(v) => update({ dayOfMonth: v })}
                options={dayOfMonthOptions}
              />
              <SelectField
                label="Hour"
                value={config.hour}
                onChange={(v) => update({ hour: v })}
                options={hourOptions}
              />
              <SelectField
                label="Minute"
                value={config.minute}
                onChange={(v) => update({ minute: v })}
                options={minuteOptions}
              />
            </>
          )}

          {config.period === "custom" && (
            <>
              <div className="sm:col-span-2">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  Enter raw cron field values. Use <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded">*</code> for any, <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded">,</code> for list, <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded">-</code> for range, <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded">/</code> for step.
                </p>
              </div>
              {[
                { label: "Minute (0-59)", key: "customMinute" as const, placeholder: "0" },
                { label: "Hour (0-23)", key: "customHour" as const, placeholder: "*" },
                { label: "Day of Month (1-31)", key: "customDom" as const, placeholder: "*" },
                { label: "Month (1-12)", key: "customMonth" as const, placeholder: "*" },
                { label: "Day of Week (0-6, 0=Sun)", key: "customDow" as const, placeholder: "*" },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {field.label}
                  </label>
                  <input
                    type="text"
                    value={config[field.key]}
                    onChange={(e) => update({ [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                    spellCheck={false}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 font-mono text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
                  />
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Generated expression */}
      <div className="mb-6 rounded-lg border border-indigo-200 bg-indigo-50 p-5 dark:border-indigo-800 dark:bg-indigo-950">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-indigo-500 dark:text-indigo-400 uppercase tracking-wide">
            Generated Expression
          </span>
          <button
            onClick={handleCopyExpression}
            className="rounded border border-indigo-300 bg-white px-3 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-50 dark:border-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 dark:hover:bg-indigo-800 transition-colors"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <div className="font-mono text-2xl font-bold text-indigo-900 dark:text-indigo-100 tracking-wider mb-3">
          {expression}
        </div>
        <div className="text-sm text-indigo-700 dark:text-indigo-300">
          {description}
        </div>
      </div>

      {/* Field breakdown */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Field Breakdown
        </h2>
        <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {["Minute", "Hour", "Day of Month", "Month", "Day of Week"].map(
            (name, i) => {
              const parts = expression.split(/\s+/);
              const raw = parts[i] || "*";
              return (
                <div key={name} className="flex items-center gap-4 px-4 py-3">
                  <div className="w-28 shrink-0">
                    <span className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                      {name}
                    </span>
                  </div>
                  <div className="font-mono text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                    {raw}
                  </div>
                </div>
              );
            },
          )}
        </div>
      </div>

      {/* Next runs */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Next 5 Runs
        </h2>
        {nextRuns.length > 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {nextRuns.map((date, i) => (
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
                  onClick={() => handleCopyRun(date.toISOString(), i)}
                  className="rounded border border-gray-300 px-2 py-0.5 text-xs font-medium text-gray-500 opacity-0 group-hover:opacity-100 focus:opacity-100 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800 transition-all"
                >
                  {copiedIdx === i ? "Copied!" : "Copy"}
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

      {/* Cron syntax reference */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
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
          │ │ │ ┌───── month (1-12)
          <br />
          │ │ │ │ ┌───── day of week (0-6, 0=Sunday)
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
            Use the{" "}
            <Link
              href="/tools/cron-parser"
              className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 underline"
            >
              Cron Expression Parser
            </Link>{" "}
            to decode and debug existing expressions.
          </li>
          <li>
            Everything runs in your browser — no data is sent over the network.
          </li>
        </ul>
      </div>
    </div>
  );
}
