"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { detectFormat, type DetectionResult } from "@/lib/format-detector";

const STORAGE_KEY = "smartpaste-content";
const TOAST_DURATION = 6000;

export function setSmartPasteContent(content: string) {
  try {
    sessionStorage.setItem(STORAGE_KEY, content);
  } catch {
    // sessionStorage full or unavailable
  }
}

export function getSmartPasteContent(): string | null {
  try {
    const content = sessionStorage.getItem(STORAGE_KEY);
    if (content) sessionStorage.removeItem(STORAGE_KEY);
    return content;
  } catch {
    return null;
  }
}

export default function SmartPaste() {
  const [detection, setDetection] = useState<(DetectionResult & { text: string }) | null>(null);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const router = useRouter();
  const pathname = usePathname();

  const dismiss = useCallback(() => {
    setVisible(false);
    setTimeout(() => setDetection(null), 200);
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const navigate = useCallback(() => {
    if (!detection) return;
    setSmartPasteContent(detection.text);
    dismiss();
    router.push(detection.toolHref);
  }, [detection, dismiss, router]);

  useEffect(() => {
    function onPaste(e: ClipboardEvent) {
      // Don't trigger inside input elements
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable ||
        target.closest("[contenteditable]")
      ) {
        return;
      }

      const text = e.clipboardData?.getData("text/plain");
      if (!text || text.length < 2 || text.length > 100_000) return;

      const result = detectFormat(text);
      if (!result) return;

      // Don't suggest if already on the suggested tool page
      if (pathname === result.toolHref || pathname.startsWith(result.toolHref + "/")) {
        return;
      }

      // Show toast
      setDetection({ ...result, text });
      setVisible(true);

      // Auto-dismiss
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(dismiss, TOAST_DURATION);
    }

    document.addEventListener("paste", onPaste);
    return () => {
      document.removeEventListener("paste", onPaste);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [pathname, dismiss]);

  if (!detection) return null;

  return (
    <div
      className={`fixed bottom-5 right-5 z-[90] max-w-sm transition-all duration-200 ${
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-4 opacity-0 pointer-events-none"
      }`}
    >
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-900">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-xs font-bold text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
            {detection.icon}
          </span>

          {/* Content */}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              Detected {detection.format}
            </p>
            <button
              onClick={navigate}
              className="mt-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              Open in {detection.toolTitle} &rarr;
            </button>
          </div>

          {/* Dismiss */}
          <button
            onClick={dismiss}
            className="shrink-0 rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            aria-label="Dismiss"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        </div>

        {/* Keyboard hint */}
        <div className="mt-2 flex items-center gap-2 border-t border-gray-100 pt-2 text-[11px] text-gray-400 dark:border-gray-800 dark:text-gray-500">
          <span className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3 w-3">
              <path fillRule="evenodd" d="M8 1.75a.75.75 0 0 1 .692.462l1.41 3.393 3.664.293a.75.75 0 0 1 .428 1.317l-2.791 2.39.853 3.575a.75.75 0 0 1-1.12.814L8 11.95l-3.136 1.844a.75.75 0 0 1-1.12-.814l.853-3.575-2.79-2.39a.75.75 0 0 1 .427-1.317l3.664-.293 1.41-3.393A.75.75 0 0 1 8 1.75Z" clipRule="evenodd" />
            </svg>
            Smart Paste
          </span>
          <span className="text-gray-300 dark:text-gray-600">&middot;</span>
          <span>Paste anywhere to detect format</span>
        </div>
      </div>
    </div>
  );
}
