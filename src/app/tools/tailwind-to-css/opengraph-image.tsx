import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "Tailwind to CSS Converter",
    "Convert Tailwind CSS utility classes to standard CSS — 500+ classes including spacing, layout, and typography.",
    "CSS",
  );
}
