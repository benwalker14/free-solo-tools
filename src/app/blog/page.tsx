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
  },
};

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          Blog
        </h1>
        <p className="mb-12 text-lg text-gray-600 dark:text-gray-400">
          Practical guides, tutorials, and cheat sheets for developers.
        </p>

        <div className="space-y-8">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block rounded-xl border border-gray-200 p-6 transition-all hover:border-indigo-300 hover:shadow-lg dark:border-gray-800 dark:hover:border-indigo-700"
            >
              <div className="mb-3 flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
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
