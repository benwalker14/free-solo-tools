import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "JSON to CSV Converter",
    "Convert JSON arrays to CSV with nested object flattening, column selection, and .csv download.",
    "J→C",
  );
}
