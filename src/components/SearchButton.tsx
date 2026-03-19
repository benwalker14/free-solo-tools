"use client";

import { useRef, useCallback } from "react";

function getIsMac() {
  return typeof navigator !== "undefined" &&
    navigator.platform.toUpperCase().includes("MAC");
}

export default function SearchButton() {
  const isMacRef = useRef<boolean | null>(null);

  const openPalette = useCallback(() => {
    if (isMacRef.current === null) isMacRef.current = getIsMac();
    const mac = isMacRef.current;
    document.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "k",
        ctrlKey: !mac,
        metaKey: mac,
        bubbles: true,
      }),
    );
  }, []);

  // For display, read lazily via a ref-backed value to avoid SSR mismatch
  // Default to "Ctrl+" for SSR, will be correct on hydration for non-Mac
  const label = typeof navigator !== "undefined" && getIsMac() ? "\u2318K" : "Ctrl+K";

  return (
    <button
      type="button"
      onClick={openPalette}
      className="flex items-center gap-1.5 rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-400 transition-colors hover:border-gray-300 hover:text-gray-600 dark:border-gray-700 dark:text-gray-500 dark:hover:border-gray-600 dark:hover:text-gray-300"
      aria-label="Search tools"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="h-3.5 w-3.5"
      >
        <path
          fillRule="evenodd"
          d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
          clipRule="evenodd"
        />
      </svg>
      <kbd className="font-sans" suppressHydrationWarning>{label}</kbd>
    </button>
  );
}
