import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "Placeholder Image Generator",
    "Generate custom placeholder images for wireframes and prototyping.",
    "IMG",
  );
}
