import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "DevBolt terms of service. Free tools with optional Pro upgrade. All tools run client-side in your browser.",
  openGraph: {
    title: "Terms of Service | DevBolt",
    description: "DevBolt terms of service.",
    url: "https://devbolt.dev/terms",
  },
  alternates: {
    canonical: "https://devbolt.dev/terms",
  },
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          Terms of Service
        </h1>
        <p className="mb-12 text-sm text-gray-500 dark:text-gray-400">
          Last updated: March 18, 2026
        </p>

        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
            Acceptance of Terms
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            By accessing or using DevBolt (&quot;the Service&quot;), you agree
            to be bound by these terms. If you do not agree, please do not use
            the Service.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
            Description of Service
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            DevBolt provides free, browser-based developer utility tools. All
            tools run entirely on the client side — your data is processed
            locally and never sent to our servers. The Service is provided
            &quot;as is&quot; without warranties of any kind.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
            Free and Pro Tiers
          </h2>
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            DevBolt offers a free tier with daily usage limits and an optional{" "}
            <Link
              href="/pricing"
              className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              Pro subscription
            </Link>{" "}
            for unlimited access and additional features. Free-tier limits may
            change at any time.
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            Pro subscriptions are billed monthly or annually through Stripe. You
            may cancel at any time — your Pro access continues until the end of
            the current billing period. We do not offer refunds for partial
            billing periods.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
            Acceptable Use
          </h2>
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            You may use DevBolt for any lawful purpose. You agree not to:
          </p>
          <ul className="space-y-2 text-gray-600 dark:text-gray-400">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
              Attempt to disrupt or overload the Service
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
              Use automated systems to scrape or abuse the Service
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
              Circumvent usage limits or access controls
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
            Intellectual Property
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            DevBolt&apos;s source code is publicly available on{" "}
            <a
              href="https://github.com/benwalker14/free-solo-tools"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              GitHub
            </a>
            . The DevBolt name, logo, and branding are proprietary. You retain
            full ownership of any data you process through our tools — we claim
            no rights to your content.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
            Disclaimer of Warranties
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            The Service is provided &quot;as is&quot; and &quot;as
            available&quot; without warranties of any kind, express or implied.
            We do not guarantee that tools will produce accurate results for
            every input. You are responsible for verifying outputs before using
            them in production systems.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
            Limitation of Liability
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            To the maximum extent permitted by law, DevBolt and its operators
            shall not be liable for any indirect, incidental, or consequential
            damages arising from your use of the Service, including but not
            limited to data loss, security breaches on your device, or reliance
            on tool outputs.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
            Changes to Terms
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            We may update these terms at any time. Continued use of the Service
            after changes constitutes acceptance of the revised terms. We
            encourage you to review this page periodically.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
            Contact
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Questions about these terms? Open an issue on our{" "}
            <a
              href="https://github.com/benwalker14/free-solo-tools"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              GitHub repository
            </a>{" "}
            or visit the{" "}
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
