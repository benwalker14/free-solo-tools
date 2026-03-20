import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "JSON to SQL Converter",
    "Convert JSON arrays to SQL CREATE TABLE and INSERT statements for PostgreSQL, MySQL, and SQLite.",
    "SQL",
  );
}
