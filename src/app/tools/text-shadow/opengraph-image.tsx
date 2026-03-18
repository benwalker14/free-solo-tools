import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "CSS Text Shadow Generator",
    "Design beautiful CSS text shadows visually with multiple layers, presets, and copy-ready code.",
    "CSS",
  );
}
