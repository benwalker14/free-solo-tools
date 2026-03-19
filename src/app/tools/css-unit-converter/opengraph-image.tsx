import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "CSS Unit Converter",
    "Convert between px, rem, em, pt, vw, vh, and % instantly.",
    "px→",
  );
}
