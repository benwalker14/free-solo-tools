import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "CSS Flexbox Generator",
    "Build flexbox layouts visually with live preview, item configuration, presets, and copy-ready CSS.",
    "CSS",
  );
}
