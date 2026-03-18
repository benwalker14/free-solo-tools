import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "DevBolt privacy policy. All tools run client-side — your data never leaves your browser. We use cookieless analytics only.",
  openGraph: {
    title: "Privacy Policy | DevBolt",
    description:
      "DevBolt privacy policy. Your data never leaves your browser.",
    url: "https://devbolt.dev/privacy",
  },
  alternates: {
    canonical: "https://devbolt.dev/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          Privacy Policy
        </h1>
        <p className="mb-12 text-sm text-gray-500 dark:text-gray-400">
          Last updated: March 18, 2026
        </p>

        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
            The Short Version
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Every DevBolt tool runs entirely in your browser. Your data never
            leaves your device. We don&apos;t collect, store, or transmit any
            data you enter into our tools. Period.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
            Data Processing
          </h2>
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            All tools on DevBolt process data locally using client-side
            JavaScript and the Web Crypto API. This means:
          </p>
          <ul className="space-y-2 text-gray-600 dark:text-gray-400">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
              Your input data is never sent to any server
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
              We don&apos;t have access to the content you process
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
              No data is logged, cached, or stored on our infrastructure
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
            Analytics
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            We use{" "}
            <a
              href="https://vercel.com/analytics"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              Vercel Analytics
            </a>{" "}
            and{" "}
            <a
              href="https://vercel.com/docs/speed-insights"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              Vercel Speed Insights
            </a>{" "}
            for basic page-view metrics and performance monitoring. These
            services are cookieless and privacy-friendly — they do not track
            individual users, use cookies, or collect personal information.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
            Local Storage
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            DevBolt uses your browser&apos;s localStorage to save preferences
            such as your theme (light/dark), tool favorites, and daily usage
            counters. This data stays entirely on your device and is never
            transmitted to us.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
            Cookies
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            DevBolt does not use cookies. We don&apos;t set first-party or
            third-party cookies of any kind.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
            Third-Party Services
          </h2>
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            The only third-party services we use are:
          </p>
          <ul className="space-y-2 text-gray-600 dark:text-gray-400">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
              <span>
                <strong className="text-gray-900 dark:text-white">
                  Vercel
                </strong>{" "}
                — hosting, analytics, and speed insights (cookieless)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
              <span>
                <strong className="text-gray-900 dark:text-white">
                  Stripe
                </strong>{" "}
                — payment processing for Pro subscriptions (only if you choose
                to subscribe)
              </span>
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
            Pro Subscriptions
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            If you subscribe to DevBolt Pro, payment processing is handled
            entirely by{" "}
            <a
              href="https://stripe.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              Stripe
            </a>
            . We do not store your credit card details or billing information on
            our servers.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
            Contact
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Questions about this policy? Open an issue on our{" "}
            <a
              href="https://github.com/benwalker14/free-solo-tools"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              GitHub repository
            </a>{" "}
            or reach out via the{" "}
            <Link
              href="/about"
              className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              About page
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
