import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "GraphQL to TypeScript Converter",
    "Convert GraphQL SDL schemas to TypeScript interfaces, types, enums, and operations.",
    "GQL"
  );
}
