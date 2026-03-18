import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "HTML ↔ Markdown Converter",
    "Convert between HTML and Markdown in either direction. Free online tool.",
    "H↔M",
  );
}
