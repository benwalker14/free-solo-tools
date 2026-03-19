import type { Metadata } from "next";
import CodeComplexityAnalyzerTool from "./CodeComplexityAnalyzerTool";

export const metadata: Metadata = {
  title:
    "Code Complexity Analyzer — Cyclomatic & Cognitive Complexity for JS/TS",
  description:
    "Analyze JavaScript and TypeScript code for cyclomatic complexity, cognitive complexity, nesting depth, and maintainability index. Per-function metrics with risk grades. Free, client-side — your code never leaves your browser.",
  keywords: [
    "code complexity analyzer",
    "cyclomatic complexity",
    "cognitive complexity",
    "maintainability index",
    "code quality metrics",
    "javascript complexity",
    "typescript complexity",
    "nesting depth",
    "code metrics",
    "vibe coding quality",
    "ai generated code quality",
    "mccabe complexity",
    "code smell detector",
  ],
  alternates: {
    canonical: "/tools/code-complexity-analyzer",
  },
  openGraph: {
    title: "Code Complexity Analyzer - DevBolt",
    description:
      "Analyze JS/TS code for cyclomatic complexity, cognitive complexity, nesting depth & maintainability. Free, client-side, no signup.",
    url: "/tools/code-complexity-analyzer",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Code Complexity Analyzer",
  url: "https://devbolt.dev/tools/code-complexity-analyzer",
  description:
    "Analyze JavaScript and TypeScript code for cyclomatic complexity, cognitive complexity, nesting depth, and maintainability index with per-function metrics and risk grades.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  isAccessibleForFree: true,
  browserRequirements: "Any modern web browser",
  creator: {
    "@type": "Organization",
    name: "DevBolt",
    url: "https://devbolt.dev",
  },
};

export default function CodeComplexityAnalyzerPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CodeComplexityAnalyzerTool />
    </>
  );
}
