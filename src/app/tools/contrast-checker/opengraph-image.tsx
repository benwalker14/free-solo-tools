import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "Color Contrast Checker",
    "Check WCAG 2.1 contrast ratios for accessibility compliance — AA and AAA levels.",
    "A11y",
  );
}
