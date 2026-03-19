import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "Zod Schema Generator",
    "Generate Zod validation schemas from JSON data instantly.",
    "ZOD",
  );
}
