import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "SVG Optimizer & Viewer",
    "Optimize and clean SVG files by removing metadata, comments, and editor cruft.",
    "SVG",
  );
}
