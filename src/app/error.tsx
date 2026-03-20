"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled error:", error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-7xl flex-1 flex-col items-center justify-center px-4 py-24 sm:px-6">
      <p className="mb-2 text-6xl font-bold text-red-600 dark:text-red-400">
        Oops
      </p>
      <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Something went wrong
      </h2>
      <p className="mb-8 text-center text-gray-600 dark:text-gray-400">
        An unexpected error occurred. Your data stays in your browser &mdash;
        nothing was sent anywhere.
      </p>
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
        >
          Try Again
        </button>
        <a
          href="/"
          className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          Browse Tools
        </a>
      </div>
    </div>
  );
}
