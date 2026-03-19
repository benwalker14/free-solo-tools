import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "ASCII Art Text Generator",
    "Convert text into ASCII art with multiple font styles for READMEs, comments, and terminals",
    "Aa",
  );
}
