import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "CSS to Tailwind Converter",
    "Convert CSS to Tailwind utility classes instantly — 100+ properties including layout, spacing, typography, and effects.",
    "TW",
  );
}
