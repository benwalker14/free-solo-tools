import type { Metadata } from "next";
import AIModelComparisonTool from "./AIModelComparisonTool";

export const metadata: Metadata = {
  title: "AI Model Comparison — GPT vs Claude vs Gemini Pricing & Coding IDEs",
  description:
    "Compare AI models side-by-side: Claude Opus 4.6, GPT-4.1, Gemini 3.1 Pro, Llama 4, and more. Pricing, context windows, capabilities for 23 models from 7 providers. Plus Cursor vs Copilot vs Windsurf vs Kiro vs Antigravity IDE comparison.",
  keywords: [
    "AI model comparison",
    "GPT vs Claude",
    "LLM comparison",
    "GPT-4.1 pricing",
    "Claude Opus 4.6 pricing",
    "Gemini 3 pricing",
    "AI model pricing",
    "LLM pricing comparison",
    "AI API pricing",
    "GPT vs Gemini",
    "Claude vs GPT",
    "best AI model",
    "cheapest LLM",
    "AI model context window",
    "reasoning models",
    "Cursor vs Copilot",
    "Cursor pricing",
    "Windsurf pricing",
    "Kiro pricing",
    "Google Antigravity",
    "AI coding IDE comparison",
    "best AI coding tool",
    "Cursor vs Windsurf",
    "GitHub Copilot pricing",
  ],
  alternates: { canonical: "/tools/ai-model-comparison" },
  openGraph: {
    title: "AI Model Comparison — GPT vs Claude vs Gemini + Coding IDEs - DevBolt",
    description:
      "Compare pricing, context windows, and capabilities of 23 AI models from 7 providers, plus 5 AI coding IDEs. Claude, GPT, Gemini, Cursor, Copilot, Windsurf, Kiro, and more.",
    url: "/tools/ai-model-comparison",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "AI Model Comparison",
  url: "https://devbolt.dev/tools/ai-model-comparison",
  description:
    "Compare AI models side-by-side: pricing, context windows, capabilities, and reasoning support for Claude Opus 4.6, GPT-4.1, Gemini 3.1 Pro, Llama 4, and more. Plus AI coding IDE pricing comparison for Cursor, Copilot, Windsurf, Kiro, and Antigravity.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  isAccessibleForFree: true,
  browserRequirements: "Any modern web browser",
  creator: { "@type": "Organization", name: "DevBolt", url: "https://devbolt.dev" },
};

export default function AIModelComparisonPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AIModelComparisonTool />
    </>
  );
}
