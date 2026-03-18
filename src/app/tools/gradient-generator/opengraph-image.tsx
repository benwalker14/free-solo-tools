import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "CSS Gradient Generator",
    "Create beautiful CSS gradients visually with live preview and copy-ready code.",
    "CSS",
  );
}
