import type { Metadata } from "next";
import PromptBuilderTool from "./PromptBuilderTool";

export const metadata: Metadata = {
  title: "AI Prompt Template Builder",
  description:
    "Build structured AI prompts with reusable templates, variables, and multi-format output for OpenAI, Anthropic, and Gemini APIs. 8 starter templates for code review, testing, documentation, and more. Free online tool — no signup required.",
  keywords: [
    "ai prompt builder",
    "prompt template builder",
    "chatgpt prompt builder",
    "claude prompt builder",
    "prompt engineering tool",
    "ai prompt generator",
    "structured prompt builder",
    "openai prompt template",
    "anthropic prompt format",
    "gemini prompt builder",
  ],
  alternates: {
    canonical: "/tools/prompt-builder",
  },
  openGraph: {
    title: "AI Prompt Template Builder - DevBolt",
    description:
      "Build structured AI prompts with templates, variables, and multi-format API output. Free, client-side, no signup.",
    url: "/tools/prompt-builder",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "AI Prompt Template Builder",
  url: "https://devbolt.dev/tools/prompt-builder",
  description:
    "Build structured AI prompts with reusable templates, variables, and multi-format output for OpenAI, Anthropic, and Gemini APIs.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  isAccessibleForFree: true,
  browserRequirements: "Any modern web browser",
  creator: { "@type": "Organization", name: "DevBolt", url: "https://devbolt.dev" },
};

export default function PromptBuilderPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PromptBuilderTool />
    </>
  );
}
