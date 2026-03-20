import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "Tailwind CSS Generator",
    "Build Tailwind CSS utility classes visually with live preview and component presets.",
    "TW",
  );
}
