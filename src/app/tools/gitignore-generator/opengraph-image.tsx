import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    ".gitignore Generator",
    "Generate .gitignore files from 50+ templates instantly.",
    ".gi",
  );
}
