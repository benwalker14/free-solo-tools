import type { Metadata } from "next";
import HtmlMarkdownTool from "../html-markdown/HtmlMarkdownTool";

const BASE_URL = "https://devbolt.dev";

export const metadata: Metadata = {
  title: "Markdown to HTML Converter Online — Free & Instant",
  description:
    "Convert Markdown to HTML online instantly. Transform README files, documentation, and blog posts into clean HTML. Supports GitHub Flavored Markdown, tables, code blocks, and more.",
  keywords: [
    "markdown to html",
    "markdown to html converter",
    "markdown to html online",
    "convert markdown to html",
    "md to html",
    "markdown to html converter online free",
    "markdown parser",
    "markdown renderer",
    "github markdown to html",
  ],
  alternates: {
    canonical: `${BASE_URL}/tools/markdown-to-html`,
  },
  openGraph: {
    title: "Markdown to HTML Converter Online — Free & Instant | DevBolt",
    description:
      "Convert Markdown to HTML instantly. Supports GFM tables, code blocks, task lists, and more.",
    url: `${BASE_URL}/tools/markdown-to-html`,
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Markdown to HTML Converter",
  url: `${BASE_URL}/tools/markdown-to-html`,
  description:
    "Convert Markdown to HTML online. Supports GitHub Flavored Markdown, tables, code fences, task lists, and more. Client-side processing.",
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
      name: "How do I convert Markdown to HTML?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Paste your Markdown into DevBolt's Markdown to HTML converter and the HTML output appears instantly. The tool supports all standard Markdown syntax including headings, bold, italic, links, images, lists, tables, code blocks, blockquotes, and horizontal rules. It also supports GitHub Flavored Markdown extensions like strikethrough, task lists, and pipe tables.",
      },
    },
    {
      "@type": "Question",
      name: "Does this converter support GitHub Flavored Markdown?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. This converter supports GitHub Flavored Markdown (GFM) including fenced code blocks with language identifiers, pipe tables with alignment, strikethrough (~~text~~), task lists (- [ ] and - [x]), and autolinked URLs. The output is standard HTML that renders correctly in any browser.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use the HTML output in my website?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. The converter produces clean, standards-compliant HTML that you can copy and paste directly into any website, email template, CMS, or application. The output uses semantic HTML elements (h1-h6, p, ul, ol, table, pre, code, blockquote) that work with any CSS framework. You can also download the HTML as a file.",
      },
    },
  ],
};

export default function MarkdownToHtmlPage() {
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
      <HtmlMarkdownTool initialDirection="md-to-html" />

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
          How to Convert Markdown to HTML
        </h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          Markdown is the preferred format for developer documentation, GitHub READMEs, technical
          blogs, and note-taking applications. But when you need to publish content on the web,
          embed it in emails, or integrate it into a CMS, you need HTML. This free online Markdown
          to HTML converter transforms your Markdown into clean, semantic HTML instantly — entirely
          in your browser.
        </p>

        <h3 className="mb-3 mt-8 text-xl font-semibold text-gray-900 dark:text-white">
          Why Convert Markdown to HTML?
        </h3>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          Markdown is designed for writing, not rendering. To display Markdown content on websites,
          in email campaigns, or within applications, it must be converted to HTML. Static site
          generators handle this automatically, but there are many scenarios where you need the raw
          HTML — embedding content in CMS platforms that don&apos;t support Markdown, creating email
          newsletters from Markdown drafts, generating HTML documentation from README files, or
          previewing how Markdown will render before committing.
        </p>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          This converter supports the full CommonMark specification plus GitHub Flavored Markdown
          (GFM) extensions, so the HTML output matches what GitHub, GitLab, and other platforms
          render. It handles fenced code blocks with language identifiers, pipe tables with column
          alignment, strikethrough text, task lists, and autolinked URLs.
        </p>

        <h3 className="mb-3 mt-8 text-xl font-semibold text-gray-900 dark:text-white">
          Common Use Cases
        </h3>
        <ul className="mb-4 list-inside list-disc space-y-2 text-gray-600 dark:text-gray-400">
          <li>
            <strong>Email newsletters:</strong> Write content in Markdown, then convert to HTML for
            email marketing platforms like Mailchimp, SendGrid, or ConvertKit.
          </li>
          <li>
            <strong>CMS integration:</strong> Convert Markdown blog posts and documentation into
            HTML for content management systems that require HTML input.
          </li>
          <li>
            <strong>Documentation sites:</strong> Generate HTML from Markdown source files for
            embedding in developer portals and API documentation.
          </li>
          <li>
            <strong>README preview:</strong> See how your GitHub README.md will render as HTML
            before pushing to a repository.
          </li>
          <li>
            <strong>Blog publishing:</strong> Convert Markdown drafts into HTML for WordPress,
            Medium, or custom publishing platforms.
          </li>
          <li>
            <strong>Presentations:</strong> Transform Markdown outlines into HTML slides for
            reveal.js or similar presentation frameworks.
          </li>
        </ul>

        <h3 className="mb-3 mt-8 text-xl font-semibold text-gray-900 dark:text-white">
          Supported Markdown Syntax
        </h3>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          This converter handles all standard Markdown syntax: headings (# through ######),
          paragraphs, bold (**text**), italic (*text*), inline code (`code`), fenced code blocks
          (```language), blockquotes (&gt;), ordered and unordered lists, links ([text](url)),
          images (![alt](src)), horizontal rules (---), tables with alignment, strikethrough
          (~~text~~), task lists (- [ ] item), and nested combinations of all elements. The output
          is clean, semantic HTML using proper elements like h1-h6, p, strong, em, code, pre, ul,
          ol, table, and blockquote.
        </p>

        <h3 className="mb-3 mt-8 text-xl font-semibold text-gray-900 dark:text-white">
          Privacy First
        </h3>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          This Markdown to HTML converter runs entirely in your browser using the marked library.
          Your content never leaves your device — no API calls, no server processing, no data
          storage. This makes it safe for converting internal documentation, draft blog posts, and
          any Markdown content containing sensitive information.
        </p>
      </div>
    </>
  );
}
