"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

const STORAGE_KEY = "devbolt-recent-tools";
const MAX_RECENT = 8;

interface RecentEntry {
  href: string;
  ts: number;
}

function getEntries(): RecentEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

let cachedJson = "";
let cachedEntries: RecentEntry[] = [];

function subscribe(callback: () => void) {
  const handler = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) callback();
  };
  window.addEventListener("storage", handler);
  window.addEventListener("recent-tools-changed", callback);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener("recent-tools-changed", callback);
  };
}

function getSnapshotStable(): string {
  const entries = getEntries();
  const json = JSON.stringify(entries);
  if (json !== cachedJson) {
    cachedJson = json;
    cachedEntries = entries;
  }
  return cachedJson;
}

function getServerSnapshot(): string {
  return "[]";
}

export function recordToolVisit(href: string) {
  const entries = getEntries().filter((e) => e.href !== href);
  entries.unshift({ href, ts: Date.now() });
  if (entries.length > MAX_RECENT) entries.length = MAX_RECENT;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  window.dispatchEvent(new Event("recent-tools-changed"));
}

export function useRecentTools() {
  const json = useSyncExternalStore(
    subscribe,
    getSnapshotStable,
    getServerSnapshot,
  );
  const recentHrefs = useMemo(
    () =>
      json === "[]"
        ? []
        : cachedEntries.map((e) => e.href),
    [json],
  );

  const clearRecent = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event("recent-tools-changed"));
  }, []);

  return { recentHrefs, clearRecent };
}
