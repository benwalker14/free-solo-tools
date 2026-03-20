"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { toolDemos, type ToolDemoStep } from "@/data/tool-demos";

export default function ToolDemo() {
  const pathname = usePathname();

  // Only show on main tool pages, not subpages
  if (!pathname || !pathname.startsWith("/tools/")) return null;
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length !== 2) return null;

  const toolSlug = segments[1];
  const demos = toolDemos[toolSlug];
  if (!demos || demos.length === 0) return null;

  // key={toolSlug} forces remount when navigating between tools
  return <ToolDemoPlayer key={toolSlug} demos={demos} />;
}

function ToolDemoPlayer({ demos }: { demos: ToolDemoStep[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [phase, setPhase] = useState<"input" | "processing" | "output">("input");
  const [isPaused, setIsPaused] = useState(false);

  const demo = demos[activeIndex];

  const advanceToNext = useCallback(() => {
    setPhase("input");
    setActiveIndex((prev) => (prev + 1) % demos.length);
  }, [demos.length]);

  // Auto-cycle animation
  useEffect(() => {
    if (isPaused) return;

    const durations = { input: 1500, processing: 600, output: 3000 };
    const nextPhase = phase === "input" ? "processing" : phase === "processing" ? "output" : null;

    const timer = setTimeout(
      nextPhase ? () => setPhase(nextPhase) : advanceToNext,
      durations[phase]
    );

    return () => clearTimeout(timer);
  }, [phase, isPaused, advanceToNext]);

  const handleDotClick = (i: number) => {
    setActiveIndex(i);
    setPhase("input");
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 mb-4">
      <div
        className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800/50 overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 dark:border-gray-700/50">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span
                className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  phase === "processing"
                    ? "animate-ping bg-amber-400"
                    : phase === "output"
                      ? "bg-emerald-400"
                      : "bg-indigo-400"
                }`}
              />
              <span
                className={`relative inline-flex h-2 w-2 rounded-full ${
                  phase === "processing"
                    ? "bg-amber-500"
                    : phase === "output"
                      ? "bg-emerald-500"
                      : "bg-indigo-500"
                }`}
              />
            </span>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {demo.label}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {demos.map((_, i) => (
              <button
                key={i}
                onClick={() => handleDotClick(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === activeIndex
                    ? "w-4 bg-indigo-500 dark:bg-indigo-400"
                    : "w-1.5 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                }`}
                aria-label={`Demo ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Demo content */}
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-stretch min-h-[120px]">
          {/* Input panel */}
          <div className="px-4 py-3">
            <div className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1.5 font-medium">
              Input
            </div>
            <pre
              className={`text-xs leading-relaxed font-mono text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-all transition-opacity duration-300 ${
                phase === "input" ? "opacity-100" : "opacity-60"
              }`}
            >
              {demo.input}
            </pre>
          </div>

          {/* Transform arrow */}
          <div className="flex items-center justify-center px-3 py-2 sm:py-0">
            <div
              className={`flex items-center gap-1 transition-all duration-300 ${
                phase === "processing"
                  ? "scale-110 text-amber-500"
                  : phase === "output"
                    ? "text-emerald-500"
                    : "text-gray-300 dark:text-gray-600"
              }`}
            >
              <span className="hidden sm:block text-[10px] uppercase tracking-wider font-medium whitespace-nowrap">
                {demo.action}
              </span>
              <svg
                className={`w-4 h-4 sm:rotate-0 rotate-90 transition-transform duration-300 ${
                  phase === "processing" ? "translate-x-0.5" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </div>

          {/* Output panel */}
          <div className="px-4 py-3 bg-gray-50/50 dark:bg-gray-900/30 sm:border-l border-t sm:border-t-0 border-gray-100 dark:border-gray-700/50">
            <div className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1.5 font-medium">
              Output
            </div>
            <pre
              className={`text-xs leading-relaxed font-mono whitespace-pre-wrap break-all transition-all duration-500 ${
                phase === "output"
                  ? "opacity-100 text-emerald-700 dark:text-emerald-400"
                  : phase === "processing"
                    ? "opacity-30 text-gray-400"
                    : "opacity-20 text-gray-300 dark:text-gray-600"
              }`}
            >
              {phase === "processing" ? "..." : demo.output}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
