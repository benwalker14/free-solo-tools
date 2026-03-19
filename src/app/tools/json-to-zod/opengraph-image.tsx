import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "JSON to Zod Converter",
    "Convert JSON or JSON Schema to Zod validation schemas instantly.",
    "ZOD",
  );
}
