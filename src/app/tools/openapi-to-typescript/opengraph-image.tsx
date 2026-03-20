import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "OpenAPI to TypeScript",
    "Convert OpenAPI 3.x and Swagger 2.0 specs to TypeScript interfaces with $ref resolution, enums, and API types.",
    "API",
  );
}
