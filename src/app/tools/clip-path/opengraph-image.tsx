import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "CSS Clip-path Generator",
    "Design CSS clip-path shapes visually with draggable polygon points, circle, ellipse, and inset modes.",
    "CSS",
  );
}
