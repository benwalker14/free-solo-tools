import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "Markdown Preview",
    "Write and preview Markdown in real time. Free online tool.",
    "MD",
  );
}
