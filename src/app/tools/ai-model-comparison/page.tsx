import type { Metadata } from "next";
import AIModelComparisonTool from "./AIModelComparisonTool";

export const metadata: Metadata = {
  title: "AI Model Comparison — GPT vs Claude vs Gemini Pricing & Specs",
  description:
    "Compare AI models side-by-side: GPT-4o, Claude Opus 4, Gemini 2.5 Pro, Llama 4, and more. Pricing, context windows, capabilities, and reasoning support for 21 models from 7 providers.",
  keywords: [
    "AI model comparison",
    "GPT vs Claude",
    "LLM comparison",
    "GPT-4o pricing",
    "Claude pricing",
    "Gemini pricing",
    "AI model pricing",
    "LLM pricing comparison",
    "AI API pricing",
    "GPT vs Gemini",
    "Claude vs GPT",
    "best AI model",
    "cheapest LLM",
    "AI model context window",
    "reasoning models",
  ],
  alternates: { canonical: "/tools/ai-model-comparison" },
  openGraph: {
    title: "AI Model Comparison — GPT vs Claude vs Gemini - DevBolt",
    description:
      "Compare pricing, context windows, and capabilities of 21 AI models from 7 providers. GPT-4o, Claude, Gemini, Llama, and more.",
    url: "/tools/ai-model-comparison",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "AI Model Comparison",
  url: "https://devbolt.dev/tools/ai-model-comparison",
  description:
    "Compare AI models side-by-side: pricing, context windows, capabilities, and reasoning support for GPT-4o, Claude, Gemini, Llama, and more.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
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
