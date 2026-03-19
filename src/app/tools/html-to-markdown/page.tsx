import type { Metadata } from "next";
import HtmlMarkdownTool from "../html-markdown/HtmlMarkdownTool";

const BASE_URL = "https://devbolt.dev";

export const metadata: Metadata = {
  title: "HTML to Markdown Converter Online — Free & Instant",
  description:
    "Convert HTML to Markdown online instantly. Transform web pages, emails, and rich text into clean Markdown for GitHub READMEs, documentation, and static site generators. Free, client-side.",
  keywords: [
    "html to markdown",
    "html to markdown converter",
    "html to markdown online",
    "convert html to markdown",
    "html to md",
    "html to markdown converter online free",
    "turndown",
    "html to markdown tool",
    "web page to markdown",
  ],
  alternates: {
    canonical: `${BASE_URL}/tools/html-to-markdown`,
  },
  openGraph: {
    title: "HTML to Markdown Converter Online — Free & Instant | DevBolt",
    description:
      "Convert HTML to Markdown instantly. Transform web content into clean Markdown for documentation and READMEs.",
    url: `${BASE_URL}/tools/html-to-markdown`,
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "HTML to Markdown Converter",
  url: `${BASE_URL}/tools/html-to-markdown`,
  description:
    "Convert HTML to Markdown online. Handles headings, lists, tables, code blocks, images, links, and formatting. Client-side processing.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  isAccessibleForFree: true,
  browserRequirements: "Any modern web browser",
  creator: {
    "@type": "Organization",
    name: "DevBolt",
    url: BASE_URL,
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How do I convert HTML to Markdown?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Paste your HTML into DevBolt's HTML to Markdown converter and the Markdown output appears instantly. The tool converts headings, paragraphs, bold, italic, links, images, lists, tables, code blocks, and blockquotes into clean Markdown syntax. You can customize heading style (ATX # or Setext underline), bullet markers (-, *, +), and code block style (fenced or indented).",
      },
    },
    {
      "@type": "Question",
      name: "What HTML elements are supported?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The converter supports all common HTML elements: h1-h6 headings, p paragraphs, strong/b bold, em/i italic, a links, img images, ul/ol/li lists, table/thead/tbody/tr/th/td tables, pre/code code blocks, blockquote quotes, hr horizontal rules, br line breaks, and nested combinations of these elements. Unsupported or custom elements are stripped, preserving their text content.",
      },
    },
    {
      "@type": "Question",
      name: "Is this HTML to Markdown converter safe for private data?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. This converter runs entirely in your browser using the Turndown library. No data is sent to any server — your HTML content never leaves your device. This makes it safe for converting internal documentation, emails, CMS content, and any other HTML containing sensitive information.",
      },
    },
  ],
};

export default function HtmlToMarkdownPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <HtmlMarkdownTool initialDirection="html-to-md" />

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
          How to Convert HTML to Markdown
        </h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          Markdown has become the standard for developer documentation, GitHub READMEs, technical
          blogs, static site generators like Astro, Hugo, and Jekyll, and knowledge bases like
          Notion and Obsidian. But much of the web&apos;s content still lives in HTML — web pages,
          CMS exports, email templates, and legacy documentation. This free online HTML to Markdown
          converter transforms HTML into clean, readable Markdown instantly in your browser.
        </p>

        <h3 className="mb-3 mt-8 text-xl font-semibold text-gray-900 dark:text-white">
          Why Convert HTML to Markdown?
        </h3>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          Markdown is simpler to read, write, and version-control than HTML. Converting HTML to
          Markdown is essential when migrating content between platforms — moving blog posts from
          WordPress to a Markdown-based static site, extracting documentation from legacy HTML pages
          into a modern docs-as-code system, or importing web content into note-taking apps like
          Obsidian. Markdown files are also significantly smaller, render consistently across
          platforms, and work natively with Git for tracking changes.
        </p>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          Developers frequently need to convert HTML snippets to Markdown for GitHub issues,
          pull request descriptions, and README files. Technical writers convert HTML documentation
          exports into Markdown for inclusion in developer portals and API docs. Content teams
          migrate HTML newsletters and landing pages to Markdown for content management systems that
          use Markdown as their source format.
        </p>

        <h3 className="mb-3 mt-8 text-xl font-semibold text-gray-900 dark:text-white">
          Common Use Cases
        </h3>
        <ul className="mb-4 list-inside list-disc space-y-2 text-gray-600 dark:text-gray-400">
          <li>
            <strong>CMS migration:</strong> Convert WordPress, Drupal, or Ghost HTML exports into
            Markdown for Hugo, Astro, Next.js, or Gatsby static sites.
          </li>
          <li>
            <strong>GitHub READMEs:</strong> Transform HTML documentation into Markdown format for
            GitHub repositories.
          </li>
          <li>
            <strong>Knowledge bases:</strong> Import HTML content into Markdown-based tools like
            Notion, Obsidian, Docusaurus, or GitBook.
          </li>
          <li>
            <strong>Email to docs:</strong> Convert HTML email templates or rich-text content into
            Markdown for archival and documentation.
          </li>
          <li>
            <strong>Web scraping:</strong> Clean up scraped HTML content into readable Markdown for
            data processing and content aggregation.
          </li>
          <li>
            <strong>API documentation:</strong> Transform HTML API docs into Markdown for developer
            portals and SDK documentation.
          </li>
        </ul>

        <h3 className="mb-3 mt-8 text-xl font-semibold text-gray-900 dark:text-white">
          Customization Options
        </h3>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          This converter offers multiple customization options to match your preferred Markdown
          style. Choose between ATX-style headings (# Heading) or Setext-style (underlined with ===
          or ---). Select your preferred bullet marker (-, *, or +) for unordered lists. Pick fenced
          code blocks (``` backticks) or indented code blocks (4 spaces). These options ensure the
          output matches your project&apos;s Markdown conventions and linter rules.
        </p>

        <h3 className="mb-3 mt-8 text-xl font-semibold text-gray-900 dark:text-white">
          Privacy First
        </h3>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          This HTML to Markdown converter runs entirely in your browser using the Turndown library.
          Your HTML content never leaves your device — no API calls, no server processing, no data
          storage. This makes it safe for converting internal documentation, email content, CMS
          exports, and any HTML containing sensitive information.
        </p>
      </div>
    </>
  );
}
