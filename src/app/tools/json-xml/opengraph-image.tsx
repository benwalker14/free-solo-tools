import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "JSON ↔ XML Converter",
    "Convert between JSON and XML formats instantly. Handles nested objects, arrays, attributes, and CDATA.",
    "XML",
  );
}
