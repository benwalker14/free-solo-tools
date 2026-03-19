"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { recordToolVisit } from "@/hooks/useRecentTools";

/**
 * Silently records tool page visits to localStorage.
 * Placed in the tools layout so every tool page visit is tracked.
 */
export default function RecentToolTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Only record top-level tool pages (e.g. /tools/json-formatter),
    // not sub-pages (e.g. /tools/json-formatter/examples)
    const match = pathname.match(/^\/tools\/[^/]+$/);
    if (match) {
      recordToolVisit(pathname);
    }
  }, [pathname]);

  return null;
}
