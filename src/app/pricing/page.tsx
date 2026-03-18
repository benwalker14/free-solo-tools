import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing - FreeSolo Tools",
  description:
    "FreeSolo Tools pricing. Free tier for everyday use. Pro for unlimited access, no ads, and API access.",
};

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
          Simple, Transparent Pricing
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          All tools are free to use. Upgrade for unlimited access.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Free Tier */}
        <div className="rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
            Free
          </h2>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            Perfect for occasional use
          </p>
          <div className="mb-8">
            <span className="text-4xl font-bold text-gray-900 dark:text-white">
              $0
            </span>
            <span className="text-gray-500 dark:text-gray-400">/month</span>
          </div>
          <ul className="mb-8 space-y-3 text-sm text-gray-600 dark:text-gray-400">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-green-500">+</span>
              All tools available
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-green-500">+</span>
              10 operations per tool per day
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-green-500">+</span>
              No signup required
            </li>
          </ul>
          <div className="rounded-lg bg-gray-100 px-4 py-2.5 text-center text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
            Current Plan
          </div>
        </div>

        {/* Pro Tier */}
        <div className="relative rounded-2xl border-2 border-indigo-600 bg-white p-8 dark:bg-gray-900">
          <div className="absolute -top-3 right-6 rounded-full bg-indigo-600 px-3 py-0.5 text-xs font-medium text-white">
            Coming Soon
          </div>
          <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
            Pro
          </h2>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            For power users and professionals
          </p>
          <div className="mb-2">
            <span className="text-4xl font-bold text-gray-900 dark:text-white">
              $4.99
            </span>
            <span className="text-gray-500 dark:text-gray-400">/month</span>
          </div>
          <p className="mb-8 text-sm text-gray-500 dark:text-gray-400">
            or $39.99/year (save 33%)
          </p>
          <ul className="mb-8 space-y-3 text-sm text-gray-600 dark:text-gray-400">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-indigo-500">+</span>
              Unlimited operations
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-indigo-500">+</span>
              No advertisements
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-indigo-500">+</span>
              Batch processing
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-indigo-500">+</span>
              API access
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-indigo-500">+</span>
              Priority new tools
            </li>
          </ul>
          <div className="rounded-lg bg-indigo-100 px-4 py-2.5 text-center text-sm font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
            Coming Soon
          </div>
        </div>
      </div>
    </div>
  );
}
