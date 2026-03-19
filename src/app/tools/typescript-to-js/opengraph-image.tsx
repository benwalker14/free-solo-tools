import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "TypeScript to JavaScript Converter",
    "Strip types, interfaces, enums, and generics to get clean JavaScript output.",
    "TS"
  );
}
