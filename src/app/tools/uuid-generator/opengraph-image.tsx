import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "UUID Generator",
    "Generate random UUID v4 identifiers. Bulk generation supported.",
    "ID",
  );
}
