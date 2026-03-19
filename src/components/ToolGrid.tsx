"use client";

import { useState, useMemo } from "react";
import { useFavorites } from "@/hooks/useFavorites";
import { useRecentTools } from "@/hooks/useRecentTools";
import type { Tool, ToolCategory } from "@/data/tools";
import { TOOL_CATEGORIES } from "@/data/tools";
import ToolCard from "./ToolCard";

export default function ToolGrid({ tools }: { tools: Tool[] }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { recentHrefs, clearRecent } = useRecentTools();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<ToolCategory | null>(
    null,
  );

  const filtered = useMemo(() => {
    let result = tools;
    if (activeCategory) {
      result = result.filter((t) => t.category === activeCategory);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q),
      );
    }
    return result;
  }, [tools, query, activeCategory]);

  const favoriteTools = filtered.filter((t) => isFavorite(t.href));
  const recentTools = useMemo(() => {
    const filteredSet = new Set(filtered.map((t) => t.href));
    return recentHrefs
      .filter((href) => filteredSet.has(href) && !isFavorite(href))
      .map((href) => filtered.find((t) => t.href === href)!)
      .filter(Boolean);
  }, [filtered, recentHrefs, isFavorite]);
  const pinnedHrefs = useMemo(() => {
    const s = new Set(favoriteTools.map((t) => t.href));
    recentTools.forEach((t) => s.add(t.href));
    return s;
  }, [favoriteTools, recentTools]);
  const otherTools = filtered.filter((t) => !pinnedHrefs.has(t.href));
  const isFiltering = query.trim() !== "" || activeCategory !== null;

  return (
    <>
      {/* Search and filter bar */}
      <div className="mb-8 space-y-3">
        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
          >
            <path
              fillRule="evenodd"
              d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
              clipRule="evenodd"
            />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools..."
            className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder-gray-500 dark:focus:border-indigo-600 dark:focus:ring-indigo-900"
            aria-label="Search tools"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {TOOL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() =>
                setActiveCategory(activeCategory === cat ? null : cat)
              }
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
              }`}
            >
              {cat}
            </button>
          ))}
          {isFiltering && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setActiveCategory(null);
              }}
              className="rounded-full px-3 py-1 text-xs font-medium text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <p className="py-12 text-center text-gray-500 dark:text-gray-400">
          No tools match your search. Try a different term.
        </p>
      ) : (
        <>
          {favoriteTools.length > 0 && (
            <div className="mb-8">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5 text-amber-400"
                >
                  <path d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                </svg>
                Favorites
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {favoriteTools.map((tool) => (
                  <ToolCard
                    key={tool.href}
                    {...tool}
                    isFavorite={true}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            </div>
          )}
          {recentTools.length > 0 && (
            <div className="mb-8">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5 text-indigo-500 dark:text-indigo-400"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Recently Used
                </h2>
                <button
                  type="button"
                  onClick={clearRecent}
                  className="text-xs text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
                >
                  Clear
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {recentTools.map((tool) => (
                  <ToolCard
                    key={tool.href}
                    {...tool}
                    isFavorite={false}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            </div>
          )}
          <div>
            {(favoriteTools.length > 0 || recentTools.length > 0) && (
              <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                All Tools
              </h2>
            )}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {otherTools.map((tool) => (
                <ToolCard
                  key={tool.href}
                  {...tool}
                  isFavorite={false}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}
