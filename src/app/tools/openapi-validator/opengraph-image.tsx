import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "OpenAPI / Swagger Validator",
    "Validate OpenAPI 3.x and Swagger 2.0 specs for structure, paths, schemas, and best practices",
    "API",
  );
}
