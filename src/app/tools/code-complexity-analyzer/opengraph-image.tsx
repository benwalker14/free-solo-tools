import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "Code Complexity Analyzer",
    "Analyze JS/TS code for cyclomatic complexity, cognitive complexity, nesting depth & maintainability index.",
    "Inspect",
  );
}
