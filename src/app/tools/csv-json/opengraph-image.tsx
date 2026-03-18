import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "CSV ↔ JSON Converter",
    "Convert between CSV and JSON formats instantly with custom delimiters.",
    "CSV",
  );
}
