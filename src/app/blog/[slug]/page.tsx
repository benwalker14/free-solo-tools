import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts, getBlogPost } from "@/data/blog-posts";
import FlexboxVsGrid from "./posts/FlexboxVsGrid";
import JsonVsYaml from "./posts/JsonVsYaml";
import Sha256VsMd5 from "./posts/Sha256VsMd5";
import NextjsVsNuxt from "./posts/NextjsVsNuxt";
import Base64VsUrlEncoding from "./posts/Base64VsUrlEncoding";
import TypeScriptVsJavaScript from "./posts/TypeScriptVsJavaScript";
import ReactVsVue from "./posts/ReactVsVue";
import RestVsGraphql from "./posts/RestVsGraphql";
import DockerVsKubernetes from "./posts/DockerVsKubernetes";
import TailwindVsBootstrap from "./posts/TailwindVsBootstrap";
import DevToolsPrivacy from "./posts/DevToolsPrivacy";
import JwtTutorial from "./posts/JwtTutorial";
import RegexCheatSheet from "./posts/RegexCheatSheet";
import CurlGuide from "./posts/CurlGuide";
import FlexboxGuide from "./posts/FlexboxGuide";
import JsonValidation from "./posts/JsonValidation";
import GitignoreGuide from "./posts/GitignoreGuide";
import Base64Explained from "./posts/Base64Explained";
import CssGridGuide from "./posts/CssGridGuide";
import DockerBestPractices from "./posts/DockerBestPractices";
import JsonSchemaGuide from "./posts/JsonSchemaGuide";
import PasswordSecurityGuide from "./posts/PasswordSecurityGuide";
import UuidGuide from "./posts/UuidGuide";
import MarkdownCheatSheet from "./posts/MarkdownCheatSheet";
import DockerComposeGuide from "./posts/DockerComposeGuide";
import YamlGuide from "./posts/YamlGuide";
import TypeScript6MigrationGuide from "./posts/TypeScript6MigrationGuide";
import BiomeVsEslint from "./posts/BiomeVsEslint";
import FixInvalidJson from "./posts/FixInvalidJson";
import FixJwtErrors from "./posts/FixJwtErrors";
import FixCorsErrors from "./posts/FixCorsErrors";
import FixDockerComposeErrors from "./posts/FixDockerComposeErrors";
import FixRegexErrors from "./posts/FixRegexErrors";
import VibeCodingSecurity from "./posts/VibeCodingSecurity";

const postContent: Record<string, React.ReactNode> = {
  "fix-invalid-json": <FixInvalidJson />,
  "fix-jwt-errors": <FixJwtErrors />,
  "fix-cors-errors": <FixCorsErrors />,
  "fix-docker-compose-errors": <FixDockerComposeErrors />,
  "fix-regex-errors": <FixRegexErrors />,
  "typescript-6-migration-guide": <TypeScript6MigrationGuide />,
  "biome-vs-eslint": <BiomeVsEslint />,
  "flexbox-vs-grid": <FlexboxVsGrid />,
  "json-vs-yaml": <JsonVsYaml />,
  "sha256-vs-md5": <Sha256VsMd5 />,
  "nextjs-vs-nuxt": <NextjsVsNuxt />,
  "base64-vs-url-encoding": <Base64VsUrlEncoding />,
  "typescript-vs-javascript": <TypeScriptVsJavaScript />,
  "react-vs-vue": <ReactVsVue />,
  "rest-vs-graphql": <RestVsGraphql />,
  "docker-vs-kubernetes": <DockerVsKubernetes />,
  "tailwind-vs-bootstrap": <TailwindVsBootstrap />,
  "developer-tools-privacy": <DevToolsPrivacy />,
  "jwt-tutorial": <JwtTutorial />,
  "regex-cheat-sheet": <RegexCheatSheet />,
  "curl-guide": <CurlGuide />,
  "css-flexbox-guide": <FlexboxGuide />,
  "json-validation-guide": <JsonValidation />,
  "gitignore-guide": <GitignoreGuide />,
  "base64-encoding-explained": <Base64Explained />,
  "css-grid-guide": <CssGridGuide />,
  "docker-best-practices": <DockerBestPractices />,
  "json-schema-guide": <JsonSchemaGuide />,
  "password-security-guide": <PasswordSecurityGuide />,
  "uuid-guide": <UuidGuide />,
  "markdown-cheat-sheet": <MarkdownCheatSheet />,
  "docker-compose-guide": <DockerComposeGuide />,
  "yaml-guide": <YamlGuide />,
  "vibe-coding-security": <VibeCodingSecurity />,
};

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: `${post.title} | DevBolt`,
      description: post.description,
      url: `https://devbolt.dev/blog/${post.slug}`,
      type: "article",
      publishedTime: post.publishedAt,
    },
    alternates: {
      canonical: `https://devbolt.dev/blog/${post.slug}`,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const content = postContent[slug];
  if (!content) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: {
      "@type": "Organization",
      name: "DevBolt",
      url: "https://devbolt.dev/about",
      sameAs: [
        "https://github.com/benwalker14/free-solo-tools",
      ],
    },
    publisher: {
      "@type": "Organization",
      name: "DevBolt",
      url: "https://devbolt.dev",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://devbolt.dev/blog/${post.slug}`,
    },
  };

  const howToJsonLd = post.howToSteps
    ? {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: post.title,
        description: post.description,
        step: post.howToSteps.map((step, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: step.name,
          text: step.text,
        })),
      }
    : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-3xl">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-gray-500 dark:text-gray-400">
          <Link
            href="/blog"
            className="transition-colors hover:text-gray-700 dark:hover:text-gray-300"
          >
            Blog
          </Link>
          <span className="mx-2">→</span>
          <span className="text-gray-900 dark:text-white">{post.title}</span>
        </nav>

        {/* Header */}
        <header className="mb-12">
          <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
            <span>
              By{" "}
              <Link
                href="/about"
                className="font-medium text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400"
              >
                The DevBolt Team
              </Link>
            </span>
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
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            {post.title}
          </h1>
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
        </header>

        {/* Content */}
        <article>{content}</article>

        {/* Author Bio — E-E-A-T signal */}
        <div className="mt-12 flex gap-4 rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-900/50">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-lg font-bold text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
            DB
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">
              Written by the DevBolt Team
            </p>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              DevBolt is a collection of 105+ free developer tools that run
              entirely in your browser — no data ever leaves your device. Built
              and maintained by AI agents, reviewed by humans.{" "}
              <Link
                href="/about"
                className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                Learn more about DevBolt
              </Link>
            </p>
          </div>
        </div>

        {/* Related Tools */}
        {post.relatedTools.length > 0 && (
          <aside className="mt-16 rounded-xl border border-gray-200 p-6 dark:border-gray-800">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Related Tools
            </h2>
            <div className="flex flex-wrap gap-3">
              {post.relatedTools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-indigo-300 hover:text-indigo-600 dark:border-gray-800 dark:text-gray-300 dark:hover:border-indigo-700 dark:hover:text-indigo-400"
                >
                  {tool.title}
                </Link>
              ))}
            </div>
          </aside>
        )}

        {/* Back to Blog */}
        <div className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-800">
          <Link
            href="/blog"
            className="text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            ← Back to all posts
          </Link>
        </div>

        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {howToJsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
          />
        )}
      </div>
    </div>
  );
}
