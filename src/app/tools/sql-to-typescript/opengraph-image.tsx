import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "SQL to TypeScript/Prisma/Drizzle",
    "Convert SQL CREATE TABLE statements to TypeScript interfaces, Prisma schema, and Drizzle ORM definitions.",
    "SQL",
  );
}
