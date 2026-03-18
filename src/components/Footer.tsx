import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            FreeSolo Tools. Free online utilities that just work.
          </p>
          <div className="flex gap-6 text-sm text-gray-500 dark:text-gray-400">
            <Link
              href="/about"
              className="transition-colors hover:text-gray-700 dark:hover:text-gray-300"
            >
              About
            </Link>
            <Link
              href="/privacy"
              className="transition-colors hover:text-gray-700 dark:hover:text-gray-300"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="transition-colors hover:text-gray-700 dark:hover:text-gray-300"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
