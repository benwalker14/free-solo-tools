import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "Color Converter",
    "Convert colors between HEX, RGB, and HSL formats. Free online tool.",
    "CLR",
  );
}
