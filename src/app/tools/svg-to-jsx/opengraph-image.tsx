import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "SVG to JSX Converter",
    "Convert SVG to JSX or a React/TypeScript component — camelCase attributes, style objects, forwardRef, and memo.",
    "SVG",
  );
}
