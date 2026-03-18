import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "Color Palette Generator",
    "Generate harmonious color palettes from any base color using color theory algorithms.",
    "PAL",
  );
}
