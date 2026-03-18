import type { Metadata } from "next";
import UrlParserTool from "./UrlParserTool";

export const metadata: Metadata = {
  title: "URL Parser",
  description:
    "Parse and inspect URL components instantly. View protocol, host, path, query parameters, and hash. Free online URL parser — no signup required.",
  keywords: [
    "URL parser",
    "URL decoder",
    "parse URL online",
    "URL components",
    "query string parser",
  ],
  alternates: {
    canonical: "/tools/url-parser",
  },
  openGraph: {
    title: "URL Parser - FreeSolo Tools",
    description:
      "Parse and inspect URL components. View protocol, host, path, query parameters, and hash.",
    url: "/tools/url-parser",
  },
};

export default function UrlParserPage() {
  return <UrlParserTool />;
}
