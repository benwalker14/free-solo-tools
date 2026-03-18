import type { Metadata } from "next";
import MarkdownPreviewTool from "./MarkdownPreviewTool";

export const metadata: Metadata = {
  title: "Markdown Preview",
  description:
    "Write and preview Markdown in real time. Supports headings, lists, code blocks, tables, links, and more. Free online Markdown editor — no signup required.",
  keywords: [
    "Markdown preview",
    "Markdown editor",
    "Markdown to HTML",
    "Markdown renderer",
    "online Markdown editor",
  ],
  alternates: {
    canonical: "/tools/markdown-preview",
  },
  openGraph: {
    title: "Markdown Preview - FreeSolo Tools",
    description:
      "Write and preview Markdown in real time. Free online tool.",
    url: "/tools/markdown-preview",
  },
};

export default function MarkdownPreviewPage() {
  return <MarkdownPreviewTool />;
}
