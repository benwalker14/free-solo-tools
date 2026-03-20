import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "SQL Playground",
    "Run SQL queries in your browser with a full SQLite database powered by WebAssembly. Practice JOINs, CTEs, window functions, and more.",
    "SQL",
  );
}
