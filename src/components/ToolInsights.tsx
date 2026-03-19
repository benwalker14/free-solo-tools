"use client";

import { usePathname } from "next/navigation";
import { toolInsights } from "@/data/tool-insights";

const typeConfig = {
  tip: {
    label: "Pro Tip",
    border: "border-emerald-200 dark:border-emerald-900/50",
    bg: "bg-emerald-50/50 dark:bg-emerald-950/20",
    badge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300",
    icon: (
      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  pitfall: {
    label: "Common Pitfall",
    border: "border-amber-200 dark:border-amber-900/50",
    bg: "bg-amber-50/50 dark:bg-amber-950/20",
    badge: "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300",
    icon: (
      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  },
  example: {
    label: "Real-World Example",
    border: "border-blue-200 dark:border-blue-900/50",
    bg: "bg-blue-50/50 dark:bg-blue-950/20",
    badge: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
    icon: (
      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  security: {
    label: "Security Note",
    border: "border-red-200 dark:border-red-900/50",
    bg: "bg-red-50/50 dark:bg-red-950/20",
    badge: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
    icon: (
      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
};

export default function ToolInsights() {
  const pathname = usePathname();

  if (!pathname || !pathname.startsWith("/tools/")) return null;

  const segments = pathname.split("/").filter(Boolean);
  if (segments.length !== 2) return null;

  const toolSlug = segments[1];
  const insights = toolInsights[toolSlug];
  if (!insights || insights.length === 0) return null;

  return (
    <section className="mx-auto mt-10 mb-2 max-w-5xl px-4">
      <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
        Tips &amp; Best Practices
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {insights.map((insight, i) => {
          const config = typeConfig[insight.type];
          return (
            <div
              key={i}
              className={`rounded-lg border ${config.border} ${config.bg} p-4`}
            >
              <div className="mb-2 flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${config.badge}`}
                >
                  {config.icon}
                  {config.label}
                </span>
              </div>
              <h3 className="mb-1 text-sm font-semibold text-gray-900 dark:text-white">
                {insight.title}
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                {insight.content}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
