import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "SQL Formatter & Beautifier",
    "Format, beautify, and minify SQL queries instantly. Free online tool.",
    "SQL",
  );
}
