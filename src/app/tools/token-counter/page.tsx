import type { Metadata } from "next";
import TokenCounterTool from "./TokenCounterTool";

export const metadata: Metadata = {
  title: "LLM Token Counter & Cost Calculator",
  description:
    "Count tokens for GPT-4o, Claude, Gemini, and other LLMs. Estimate API costs instantly. Supports BPE tokenization with up-to-date pricing for OpenAI, Anthropic, and Google models.",
  keywords: [
    "token counter",
    "LLM token counter",
    "GPT token counter",
    "Claude token counter",
    "Gemini token counter",
    "API cost calculator",
    "OpenAI pricing",
    "Anthropic pricing",
    "token estimator",
    "tiktoken",
    "BPE tokenizer",
    "AI cost calculator",
    "LLM pricing",
    "GPT-4o tokens",
    "Claude 4 tokens",
  ],
  alternates: { canonical: "/tools/token-counter" },
  openGraph: {
    title: "LLM Token Counter & Cost Calculator - DevBolt",
    description:
      "Count tokens for GPT-4o, Claude, Gemini, and other LLMs. Estimate API costs instantly with up-to-date pricing.",
    url: "/tools/token-counter",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "LLM Token Counter & Cost Calculator",
  url: "https://devbolt.dev/tools/token-counter",
  description:
    "Count tokens for GPT-4o, Claude, Gemini, and other LLMs. Estimate API costs with up-to-date pricing for OpenAI, Anthropic, and Google models.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  isAccessibleForFree: true,
  browserRequirements: "Any modern web browser",
  creator: { "@type": "Organization", name: "DevBolt", url: "https://devbolt.dev" },
};

export default function TokenCounterPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TokenCounterTool />
    </>
  );
}
