"use client";

import { usePathname } from "next/navigation";
import { toolFaqs } from "@/data/tool-faqs";

export default function ToolFAQ() {
  const pathname = usePathname();

  if (!pathname || !pathname.startsWith("/tools/")) return null;

  // Only show on main tool pages, not subpages
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length !== 2) return null;

  const toolSlug = segments[1];
  const faqs = toolFaqs[toolSlug];
  if (!faqs || faqs.length === 0) return null;

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <section className="mx-auto mt-12 mb-8 max-w-5xl px-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
        Frequently Asked Questions
      </h2>
      <div className="divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900">
        {faqs.map((faq, i) => (
          <details key={i} className="group" open={i === 0}>
            <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-left text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50 dark:text-white dark:hover:bg-gray-800/50 [&::-webkit-details-marker]:hidden list-none">
              <span>{faq.question}</span>
              <svg
                className="ml-3 h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200 group-open:rotate-180"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </summary>
            <div className="px-5 pb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
              {faq.answer}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
