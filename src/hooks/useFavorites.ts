"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

const STORAGE_KEY = "freesolo-favorites";

function getSnapshot(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

// Serialized version for useSyncExternalStore (needs string equality)
let cachedJson = "";
let cachedSet = new Set<string>();

function subscribe(callback: () => void) {
  const handler = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) callback();
  };
  window.addEventListener("storage", handler);
  window.addEventListener("favorites-changed", callback);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener("favorites-changed", callback);
  };
}

function getSnapshotStable(): string {
  const set = getSnapshot();
  const json = JSON.stringify([...set].sort());
  if (json !== cachedJson) {
    cachedJson = json;
    cachedSet = set;
  }
  return cachedJson;
}

function getServerSnapshot(): string {
  return "[]";
}

export function useFavorites() {
  const json = useSyncExternalStore(subscribe, getSnapshotStable, getServerSnapshot);
  const favorites = useMemo(
    () => (json === "[]" ? new Set<string>() : cachedSet),
    [json]
  );

  const toggleFavorite = useCallback((href: string) => {
    const current = getSnapshot();
    if (current.has(href)) {
      current.delete(href);
    } else {
      current.add(href);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...current]));
    window.dispatchEvent(new Event("favorites-changed"));
  }, []);

  const isFavorite = useCallback(
    (href: string) => favorites.has(href),
    [favorites]
  );

  return { favorites, toggleFavorite, isFavorite };
}
