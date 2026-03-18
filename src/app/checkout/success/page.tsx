import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Welcome to Pro",
  robots: { index: false },
};

export default function CheckoutSuccessPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
      <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
        <svg
          className="h-8 w-8 text-green-600 dark:text-green-400"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 12.75l6 6 9-13.5"
          />
        </svg>
      </div>
      <h1 className="mb-3 text-3xl font-bold text-gray-900 dark:text-white">
        Welcome to Pro!
      </h1>
      <p className="mb-8 text-gray-600 dark:text-gray-400">
        Your subscription is active. Enjoy unlimited operations, no ads, and all
        Pro features.
      </p>
      <Link
        href="/"
        className="inline-block rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
      >
        Start Using Tools
      </Link>
    </div>
  );
}
