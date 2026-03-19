import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "Aspect Ratio Calculator",
    "Calculate, resize, and convert aspect ratios for images, video, and responsive design.",
    "⊞",
  );
}
