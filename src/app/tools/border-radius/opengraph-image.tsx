import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "CSS Border Radius Generator",
    "Design CSS border-radius visually with per-corner controls, presets, and copy-ready code.",
    "CSS",
  );
}
