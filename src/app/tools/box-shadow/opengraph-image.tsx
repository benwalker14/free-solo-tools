import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "CSS Box Shadow Generator",
    "Design beautiful CSS box shadows visually with multiple layers, presets, and copy-ready code.",
    "CSS",
  );
}
