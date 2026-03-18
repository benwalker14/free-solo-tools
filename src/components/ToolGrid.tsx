"use client";

import { useFavorites } from "@/hooks/useFavorites";
import ToolCard from "./ToolCard";

interface Tool {
  title: string;
  description: string;
  href: string;
  icon: string;
}

export default function ToolGrid({ tools }: { tools: Tool[] }) {
  const { isFavorite, toggleFavorite } = useFavorites();

  const favoriteTools = tools.filter((t) => isFavorite(t.href));
  const otherTools = tools.filter((t) => !isFavorite(t.href));

  return (
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
              <path
                d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
              />
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
      <div>
        {favoriteTools.length > 0 && (
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
  );
}
