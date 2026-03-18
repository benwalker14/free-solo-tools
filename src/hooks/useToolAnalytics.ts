"use client";

import { track } from "@vercel/analytics";
import { useRef, useCallback } from "react";

export function useToolAnalytics(toolSlug: string) {
  const tracked = useRef(false);

  const trackAction = useCallback(
    (action: string) => {
      track("tool_use", { tool: toolSlug, action });
    },
    [toolSlug]
  );

  const trackFirstInteraction = useCallback(() => {
    if (!tracked.current) {
      tracked.current = true;
      track("tool_use", { tool: toolSlug, action: "interact" });
    }
  }, [toolSlug]);

  return { trackAction, trackFirstInteraction };
}
