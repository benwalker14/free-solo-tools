import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "JSON to TypeScript Generator",
    "Generate TypeScript interfaces and type aliases from JSON data instantly.",
    "TS",
  );
}
