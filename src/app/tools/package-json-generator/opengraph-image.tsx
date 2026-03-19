import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "package.json Generator",
    "Generate package.json visually with framework presets, dependencies, and scripts.",
    "{ }"
  );
}
