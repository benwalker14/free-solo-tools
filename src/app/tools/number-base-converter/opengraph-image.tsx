import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "Number Base Converter",
    "Convert between binary, octal, decimal, and hexadecimal instantly.",
    "0x",
  );
}
