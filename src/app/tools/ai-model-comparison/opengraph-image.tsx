import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "AI Model Comparison",
    "Compare 23 AI models and 5 coding IDEs — pricing, context windows, and capabilities side by side.",
    "AI",
  );
}
