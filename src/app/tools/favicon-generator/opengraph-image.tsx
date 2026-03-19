import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "Favicon Generator",
    "Generate favicons from text or emoji — download PNGs, SVG, and HTML tags.",
    "FAV",
  );
}
