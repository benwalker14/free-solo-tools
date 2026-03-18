import type { Metadata } from "next";
import JsonFormatterTool from "./JsonFormatterTool";

export const metadata: Metadata = {
  title: "JSON Formatter & Validator - FreeSolo Tools",
  description:
    "Format, validate, and minify JSON data instantly. Free online JSON tool.",
};

export default function JsonFormatterPage() {
  return <JsonFormatterTool />;
}
