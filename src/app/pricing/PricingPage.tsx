"use client";

import { useState } from "react";
import Link from "next/link";

export default function PricingPage() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: billing }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Something went wrong. Please try again.");
        setLoading(false);
      }
    } catch {
      alert("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  const price = billing === "monthly" ? "$4.99" : "$39.99";
  const period = billing === "monthly" ? "/month" : "/year";
  const savings = billing === "yearly" ? "Save 33%" : null;

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

      {/* Billing Toggle */}
      <div className="mb-10 flex items-center justify-center gap-3">
        <span
          className={`text-sm font-medium ${
            billing === "monthly"
              ? "text-gray-900 dark:text-white"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          Monthly
        </span>
        <button
          onClick={() =>
            setBilling((b) => (b === "monthly" ? "yearly" : "monthly"))
          }
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
            billing === "yearly" ? "bg-indigo-600" : "bg-gray-300 dark:bg-gray-600"
          }`}
          role="switch"
          aria-checked={billing === "yearly"}
          aria-label="Toggle yearly billing"
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
              billing === "yearly" ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
        <span
          className={`text-sm font-medium ${
            billing === "yearly"
              ? "text-gray-900 dark:text-white"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          Yearly
        </span>
        {savings && (
          <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900 dark:text-green-300">
            {savings}
          </span>
        )}
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
              <CheckIcon className="text-green-500" />
              All tools available
            </li>
            <li className="flex items-start gap-2">
              <CheckIcon className="text-green-500" />
              25 operations per tool per day
            </li>
            <li className="flex items-start gap-2">
              <CheckIcon className="text-green-500" />
              No signup required
            </li>
          </ul>
          <Link
            href="/"
            className="block rounded-lg bg-gray-100 px-4 py-2.5 text-center text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Get Started Free
          </Link>
        </div>

        {/* Pro Tier */}
        <div className="relative rounded-2xl border-2 border-indigo-600 bg-white p-8 dark:bg-gray-900">
          <div className="absolute -top-3 right-6 rounded-full bg-indigo-600 px-3 py-0.5 text-xs font-medium text-white">
            Best Value
          </div>
          <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
            Pro
          </h2>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            For power users and professionals
          </p>
          <div className="mb-2">
            <span className="text-4xl font-bold text-gray-900 dark:text-white">
              {price}
            </span>
            <span className="text-gray-500 dark:text-gray-400">{period}</span>
          </div>
          <p className="mb-8 text-sm text-gray-500 dark:text-gray-400">
            {billing === "monthly"
              ? "or $39.99/year (save 33%)"
              : "$3.33/month, billed annually"}
          </p>
          <ul className="mb-8 space-y-3 text-sm text-gray-600 dark:text-gray-400">
            <li className="flex items-start gap-2">
              <CheckIcon className="text-indigo-500" />
              Unlimited operations
            </li>
            <li className="flex items-start gap-2">
              <CheckIcon className="text-indigo-500" />
              No advertisements
            </li>
            <li className="flex items-start gap-2">
              <CheckIcon className="text-indigo-500" />
              Batch processing
            </li>
            <li className="flex items-start gap-2">
              <CheckIcon className="text-indigo-500" />
              API access
            </li>
            <li className="flex items-start gap-2">
              <CheckIcon className="text-indigo-500" />
              Priority new tools
            </li>
          </ul>
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Redirecting..." : "Get Pro"}
          </button>
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-16">
        <h2 className="mb-8 text-center text-2xl font-bold text-gray-900 dark:text-white">
          Frequently Asked Questions
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FaqItem
            question="Can I cancel anytime?"
            answer="Yes. Cancel your Pro subscription at any time from your Stripe billing portal. You'll keep access until the end of your billing period."
          />
          <FaqItem
            question="What payment methods do you accept?"
            answer="We accept all major credit cards, debit cards, and select local payment methods through Stripe."
          />
          <FaqItem
            question="Is there a free trial?"
            answer="No trial needed — all tools are free to use with a daily limit. Upgrade to Pro only when you need unlimited access."
          />
          <FaqItem
            question="What counts as an operation?"
            answer="Each time you click a tool's action button (format, encode, generate, etc.) counts as one operation. Real-time tools like Color Converter and Regex Tester don't count."
          />
        </div>
      </div>
    </div>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={`mt-0.5 h-4 w-4 shrink-0 ${className}`}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 12.75l6 6 9-13.5"
      />
    </svg>
  );
}

function FaqItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
      <h3 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
        {question}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{answer}</p>
    </div>
  );
}
