"use client";

import { useEffect } from "react";
import { getSmartPasteContent } from "@/components/SmartPaste";

/**
 * Hook for tool components to auto-load content from Smart Paste.
 * Call this in your tool component and pass the setter for the input state.
 * If the user arrived via Smart Paste, the input will be pre-filled.
 *
 * @param setInput - State setter for the tool's input field
 * @param onLoad - Optional callback after content is loaded (e.g. to auto-process)
 */
export function useSmartPasteInput(
  setInput: (value: string) => void,
  onLoad?: () => void,
) {
  useEffect(() => {
    const content = getSmartPasteContent();
    if (content) {
      setInput(content);
      // Defer the onLoad callback so state has time to settle
      if (onLoad) {
        requestAnimationFrame(() => onLoad());
      }
    }
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
