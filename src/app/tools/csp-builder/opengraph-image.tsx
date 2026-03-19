import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "CSP Header Builder",
    "Build Content Security Policy headers visually with framework presets and security analysis.",
    "Security",
  );
}
