import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "Meta Tag Generator",
    "Generate SEO, Open Graph, and Twitter Card meta tags with live preview.",
    "META",
  );
}
