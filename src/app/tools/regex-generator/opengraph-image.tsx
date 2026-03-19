import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "Regex Generator",
    "Generate regex patterns by describing what you need — 60+ curated patterns, visual composer, and live tester",
    "R.*",
  );
}
