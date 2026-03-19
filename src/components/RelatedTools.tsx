"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { tools } from "@/data/tools";

export default function RelatedTools() {
  const pathname = usePathname();

  if (!pathname || !pathname.startsWith("/tools/")) return null;

  // Extract tool slug (handle subpages like /tools/json-formatter/examples)
  const toolSlug = pathname.split("/")[2];
  if (!toolSlug) return null;

  const currentHref = `/tools/${toolSlug}`;
  const currentTool = tools.find((t) => t.href === currentHref);
  if (!currentTool) return null;

  // Get tools in the same category, excluding current
  const sameCategory = tools.filter(
    (t) => t.category === currentTool.category && t.href !== currentHref
  );

  // Deterministic selection: pick tools around the current tool's position
  // Use a simple hash of the slug to offset which 4 we pick
  const hash = toolSlug.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const start = hash % Math.max(sameCategory.length, 1);
  const related: typeof tools = [];
  for (let i = 0; i < Math.min(4, sameCategory.length); i++) {
    related.push(sameCategory[(start + i) % sameCategory.length]);
  }

  if (related.length === 0) return null;

  return (
    <section className="mx-auto mt-12 mb-8 max-w-5xl px-4">
      <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
        Related {currentTool.category} Tools
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {related.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-indigo-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-indigo-700"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 font-mono text-xs font-bold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
              {tool.icon}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                {tool.title}
              </p>
              <p className="mt-0.5 line-clamp-2 text-xs text-gray-500 dark:text-gray-400">
                {tool.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
