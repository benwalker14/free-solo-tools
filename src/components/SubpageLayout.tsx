import Link from "next/link";
import type { ToolSubpage } from "@/data/tool-subpages";
import { toolSubpages } from "@/data/tool-subpages";

interface SubpageLayoutProps {
  data: ToolSubpage;
  children: React.ReactNode;
}

export default function SubpageLayout({ data, children }: SubpageLayoutProps) {
  const relatedSubpages = (toolSubpages[data.parentToolSlug] || []).filter(
    (sp) => sp.slug !== data.slug,
  );

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: data.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const webAppJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: data.title,
    url: `https://devbolt.dev/tools/${data.parentToolSlug}/${data.slug}`,
    description: data.metaDescription,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    isAccessibleForFree: true,
    browserRequirements: "Any modern web browser",
    creator: { "@type": "Organization", name: "DevBolt", url: "https://devbolt.dev" },
    isPartOf: {
      "@type": "SoftwareApplication",
      name: data.parentToolName,
      url: `https://devbolt.dev/tools/${data.parentToolSlug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }}
      />

      {/* Breadcrumbs */}
      <div className="mx-auto max-w-4xl px-4 pt-8 sm:px-6">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          <ol className="flex items-center gap-1.5">
            <li>
              <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                DevBolt
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link
                href={`/tools/${data.parentToolSlug}`}
                className="hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                {data.parentToolName}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-gray-900 dark:text-white font-medium">
              {data.title}
            </li>
          </ol>
        </nav>

        {/* Page heading */}
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
          {data.h1}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          {data.intro}
        </p>
      </div>

      {/* Embedded tool */}
      {children}

      {/* Content sections */}
      <div className="mx-auto max-w-4xl px-4 pb-12 sm:px-6">
        <div className="mt-12 space-y-8">
          {data.content.map((section, i) => (
            <section key={i}>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {section.heading}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {section.body}
              </p>
              {section.codeExample && (
                <pre className="mt-4 overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm leading-relaxed text-gray-100">
                  <code>{section.codeExample}</code>
                </pre>
              )}
            </section>
          ))}
        </div>

        {/* FAQ section */}
        {data.faqs.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {data.faqs.map((faq, i) => (
                <div key={i}>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related sub-pages */}
        {relatedSubpages.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Related tools
            </h2>
            <div className="flex flex-wrap gap-3">
              {relatedSubpages.map((sp) => (
                <Link
                  key={sp.slug}
                  href={`/tools/${data.parentToolSlug}/${sp.slug}`}
                  className="inline-flex items-center rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors"
                >
                  {sp.title}
                </Link>
              ))}
              <Link
                href={`/tools/${data.parentToolSlug}`}
                className="inline-flex items-center rounded-lg border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/30 px-4 py-2 text-sm font-medium text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
              >
                &larr; All {data.parentToolName} features
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
