import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "JSON to GraphQL Schema",
    "Generate GraphQL schema definitions from JSON data with automatic type inference and Query/Mutation generation.",
    "GQL",
  );
}
