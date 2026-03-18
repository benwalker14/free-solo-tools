import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Checkout Cancelled",
  robots: { index: false },
};

export default function CheckoutCancelPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
      <h1 className="mb-3 text-3xl font-bold text-gray-900 dark:text-white">
        Checkout Cancelled
      </h1>
      <p className="mb-8 text-gray-600 dark:text-gray-400">
        No worries — you can upgrade anytime. All tools remain free to use with
        daily limits.
      </p>
      <div className="flex items-center justify-center gap-4">
        <Link
          href="/pricing"
          className="inline-block rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
        >
          Back to Pricing
        </Link>
        <Link
          href="/"
          className="inline-block rounded-lg bg-gray-100 px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Browse Tools
        </Link>
      </div>
    </div>
  );
}
