import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "URL Slug Generator",
    "Convert text into clean, URL-friendly slugs with Unicode support and bulk mode.",
    "/slug",
  );
}
