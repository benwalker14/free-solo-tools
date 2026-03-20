import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "@/data/blog-posts";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Developer guides, tutorials, and cheat sheets — practical references for JWT, regex, cURL, and more.",
  openGraph: {
    title: "Blog | DevBolt",
    description:
      "Developer guides, tutorials, and cheat sheets — practical references for JWT, regex, cURL, and more.",
    url: "https://devbolt.dev/blog",
  },
  alternates: {
    canonical: "https://devbolt.dev/blog",
    types: {
      "application/rss+xml": "https://devbolt.dev/blog/feed.xml",
    },
  },
};

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          Blog
        </h1>
        <div className="mb-12 flex items-center justify-between">
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Practical guides, tutorials, and cheat sheets for developers.
          </p>
          <a
            href="/blog/feed.xml"
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 transition-colors hover:border-orange-300 hover:text-orange-600 dark:border-gray-700 dark:text-gray-400 dark:hover:border-orange-600 dark:hover:text-orange-400"
            title="RSS Feed"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19 7.38 20 6.18 20C5 20 4 19 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1Z" />
            </svg>
            RSS
          </a>
        </div>

        <div className="space-y-8">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block rounded-xl border border-gray-200 p-6 transition-all hover:border-indigo-300 hover:shadow-lg dark:border-gray-800 dark:hover:border-indigo-700"
            >
              <div className="mb-3 flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-medium text-gray-700 dark:text-gray-300">Written by DevBolt Team</span>
                <span className="text-gray-300 dark:text-gray-600">·</span>
                <time dateTime={post.publishedAt}>
                  {new Date(post.publishedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                <span className="text-gray-300 dark:text-gray-600">·</span>
                <span>{post.readTime}</span>
              </div>
              <h2 className="mb-2 text-xl font-semibold text-gray-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                {post.title}
              </h2>
              <p className="mb-4 text-gray-600 dark:text-gray-400">
                {post.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
