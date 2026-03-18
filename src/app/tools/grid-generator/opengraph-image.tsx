import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "CSS Grid Generator",
    "Build CSS grid layouts visually with columns, rows, gap, item placement, presets, and copy-ready CSS.",
    "CSS",
  );
}
