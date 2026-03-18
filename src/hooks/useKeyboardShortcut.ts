import { useEffect } from "react";

/**
 * Registers a global keyboard shortcut (Ctrl+Enter / Cmd+Enter) that
 * fires the given callback. Automatically cleaned up on unmount.
 */
export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  opts: { ctrl?: boolean } = { ctrl: true },
) {
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === key && (opts.ctrl ? e.ctrlKey || e.metaKey : true)) {
        e.preventDefault();
        callback();
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [key, callback, opts.ctrl]);
}
