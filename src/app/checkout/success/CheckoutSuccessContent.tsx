"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [planType, setPlanType] = useState<string>("subscription");
  const [loading, setLoading] = useState(!!sessionId);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!sessionId) return;

    // Small delay to allow webhook to process
    const timer = setTimeout(() => {
      fetch(`/api/keys?session_id=${sessionId}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.api_key) setApiKey(data.api_key);
          if (data.plan_type) setPlanType(data.plan_type);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }, 2000);

    return () => clearTimeout(timer);
  }, [sessionId]);

  const copyKey = () => {
    if (!apiKey) return;
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isLifetime = planType === "lifetime";

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
        {isLifetime ? "Welcome to Pro — Forever!" : "Welcome to Pro!"}
      </h1>
      <p className="mb-8 text-gray-600 dark:text-gray-400">
        {isLifetime
          ? "Your lifetime access is active. Enjoy unlimited operations, no ads, and all Pro features — forever."
          : "Your subscription is active. Enjoy unlimited operations, no ads, and all Pro features."}
      </p>

      {/* API Key Section */}
      {loading && (
        <div className="mb-8 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Generating your API key...
          </p>
        </div>
      )}

      {apiKey && (
        <div className="mb-8 rounded-lg border border-gray-200 bg-gray-50 p-4 text-left dark:border-gray-700 dark:bg-gray-800/50">
          <h2 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
            Your API Key
          </h2>
          <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
            Save this key — you&apos;ll need it to use the{" "}
            <Link
              href="/docs"
              className="text-indigo-600 hover:underline dark:text-indigo-400"
            >
              DevBolt API
            </Link>
            .
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 overflow-x-auto rounded bg-gray-900 px-3 py-2 text-sm text-green-400">
              {apiKey}
            </code>
            <button
              onClick={copyKey}
              className="shrink-0 rounded bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-center gap-4">
        <Link
          href="/"
          className="inline-block rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
        >
          Start Using Tools
        </Link>
        {apiKey && (
          <Link
            href="/docs"
            className="inline-block rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            API Docs
          </Link>
        )}
      </div>
    </div>
  );
}
