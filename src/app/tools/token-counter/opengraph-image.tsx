import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "LLM Token Counter",
    "Count tokens and estimate API costs for GPT-4o, Claude, Gemini, and other LLMs with BPE tokenization.",
    "LLM",
  );
}
