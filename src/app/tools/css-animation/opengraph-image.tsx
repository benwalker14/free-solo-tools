import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "CSS Animation Generator",
    "Build CSS keyframe animations visually with presets, live preview, and copy-ready @keyframes code.",
    "CSS",
  );
}
