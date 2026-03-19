"use client";

import { usePathname } from "next/navigation";
import { quickAnswers } from "@/data/quick-answers";

export default function QuickAnswer() {
  const pathname = usePathname();

  if (!pathname || !pathname.startsWith("/tools/")) return null;

  // Only show on main tool pages, not subpages
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length !== 2) return null;

  const toolSlug = segments[1];
  const qa = quickAnswers[toolSlug];
  if (!qa) return null;

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 mt-2 mb-4">
      <div className="rounded-lg border border-indigo-100 bg-indigo-50/50 px-4 py-3 dark:border-indigo-900/50 dark:bg-indigo-950/20">
        <p className="text-sm font-medium text-indigo-900 dark:text-indigo-200 mb-1">
          {qa.question}
        </p>
        <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          {qa.answer}
        </p>
      </div>
    </div>
  );
}
