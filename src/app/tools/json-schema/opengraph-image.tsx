import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "JSON Schema Validator",
    "Validate JSON data against JSON Schema with detailed error reporting.",
    "JSV",
  );
}
