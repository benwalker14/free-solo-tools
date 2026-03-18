import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "JSON Path Tester",
    "Test JSONPath expressions against JSON data with real-time evaluation.",
    "$..",
  );
}
