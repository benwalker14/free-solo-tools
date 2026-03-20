import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "AI Prompt Builder",
    "Build structured AI prompts with templates, variables, and multi-format output for OpenAI, Anthropic, and Gemini.",
    "AI",
  );
}
