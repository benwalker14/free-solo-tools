import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "CSS Filter Generator",
    "Build CSS filter effects visually with blur, brightness, contrast, grayscale, and more. 12 presets with live preview.",
    "CSS",
  );
}
