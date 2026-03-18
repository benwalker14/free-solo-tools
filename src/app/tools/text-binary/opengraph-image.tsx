import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "Text to Binary Converter",
    "Convert text to binary, hex, octal, or decimal and back.",
    "01",
  );
}
