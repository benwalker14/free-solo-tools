"use client";

import { useState, useCallback, useEffect } from "react";

const STORAGE_KEY = "devbolt_usage";
const FREE_DAILY_LIMIT = 25;

interface UsageEntry {
  count: number;
  date: string;
}

function getTodayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function getUsage(toolSlug: string): UsageEntry {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { count: 0, date: getTodayKey() };
    const data = JSON.parse(raw) as Record<string, UsageEntry>;
    const entry = data[toolSlug];
    if (!entry || entry.date !== getTodayKey()) {
      return { count: 0, date: getTodayKey() };
    }
    return entry;
  } catch {
    return { count: 0, date: getTodayKey() };
  }
}

function setUsage(toolSlug: string, entry: UsageEntry): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const data = raw ? (JSON.parse(raw) as Record<string, UsageEntry>) : {};
    data[toolSlug] = entry;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage full or unavailable — fail silently
  }
}

export function useRateLimit(toolSlug: string) {
  const [usageCount, setUsageCount] = useState(0);
  const dailyLimit = FREE_DAILY_LIMIT;

  useEffect(() => {
    setUsageCount(getUsage(toolSlug).count);
  }, [toolSlug]);

  const isLimited = usageCount >= dailyLimit;
  const remaining = Math.max(0, dailyLimit - usageCount);

  const recordUsage = useCallback(() => {
    const current = getUsage(toolSlug);
    const updated = { count: current.count + 1, date: getTodayKey() };
    setUsage(toolSlug, updated);
    setUsageCount(updated.count);
    return updated.count <= dailyLimit;
  }, [toolSlug, dailyLimit]);

  return { usageCount, dailyLimit, remaining, isLimited, recordUsage };
}
