import type { Metadata } from "next";
import JsonFormatterTool from "./JsonFormatterTool";

export const metadata: Metadata = {
  title: "JSON Formatter & Validator",
  description:
    "Format, validate, and minify JSON data instantly. Syntax highlighting, error detection, and pretty-printing. Free online JSON tool — no signup required.",
  keywords: [
    "JSON formatter",
    "JSON validator",
    "JSON minifier",
    "JSON pretty print",
    "format JSON online",
  ],
  alternates: {
    canonical: "/tools/json-formatter",
  },
  openGraph: {
    title: "JSON Formatter & Validator - FreeSolo Tools",
    description:
      "Format, validate, and minify JSON data instantly. Free online tool.",
    url: "/tools/json-formatter",
  },
};

export default function JsonFormatterPage() {
  return <JsonFormatterTool />;
}
