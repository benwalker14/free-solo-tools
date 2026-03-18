import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-7xl flex-1 flex-col items-center justify-center px-4 py-24 sm:px-6">
      <p className="mb-2 text-6xl font-bold text-indigo-600 dark:text-indigo-400">
        404
      </p>
      <h1 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Page not found
      </h1>
      <p className="mb-8 text-center text-gray-600 dark:text-gray-400">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="flex gap-4">
        <Link
          href="/"
          className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
        >
          Browse Tools
        </Link>
        <Link
          href="/about"
          className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          About DevBolt
        </Link>
      </div>
    </div>
  );
}
