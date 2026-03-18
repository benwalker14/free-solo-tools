import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "Text Case Converter",
    "Convert between camelCase, snake_case, kebab-case, PascalCase, and more.",
    "Aa",
  );
}
