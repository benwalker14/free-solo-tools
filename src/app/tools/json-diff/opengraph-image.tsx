import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "JSON Diff",
    "Compare two JSON objects and see structural differences — added, removed, and changed keys.",
    "J±",
  );
}
