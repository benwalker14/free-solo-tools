import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "Open Graph Preview",
    "Preview and debug Open Graph, Twitter Card, and SEO meta tags for social sharing.",
    "OG",
  );
}
