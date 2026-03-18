import type { Metadata } from "next";
import UuidGeneratorTool from "./UuidGeneratorTool";

export const metadata: Metadata = {
  title: "UUID Generator",
  description:
    "Generate random UUID v4 identifiers instantly. Bulk generation supported. Free online UUID tool — no signup required.",
  keywords: [
    "UUID generator",
    "UUID v4",
    "random UUID",
    "generate UUID online",
    "bulk UUID generator",
  ],
  alternates: {
    canonical: "/tools/uuid-generator",
  },
  openGraph: {
    title: "UUID Generator - FreeSolo Tools",
    description:
      "Generate random UUID v4 identifiers. Bulk generation supported.",
    url: "/tools/uuid-generator",
  },
};

export default function UuidGeneratorPage() {
  return <UuidGeneratorTool />;
}
