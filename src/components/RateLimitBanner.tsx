"use client";

import Link from "next/link";

interface RateLimitBannerProps {
  remaining: number;
  dailyLimit: number;
  isLimited: boolean;
}

export default function RateLimitBanner({
  remaining,
  dailyLimit,
  isLimited,
}: RateLimitBannerProps) {
  if (isLimited) {
    return (
      <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 dark:border-amber-700 dark:bg-amber-950">
        <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
          You&apos;ve used all {dailyLimit} free uses for today.
        </p>
        <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
          Upgrade to{" "}
          <Link
            href="/pricing"
            className="font-semibold underline hover:text-amber-900 dark:hover:text-amber-100"
          >
            DevBolt Pro
          </Link>{" "}
          for unlimited access, or come back tomorrow.
        </p>
      </div>
    );
  }

  if (remaining <= 10 && remaining > 0) {
    return (
      <p className="text-xs text-gray-500 dark:text-gray-400">
        {remaining}/{dailyLimit} free uses remaining today
      </p>
    );
  }

  return null;
}
