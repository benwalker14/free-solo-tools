import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "JSON Mock Data Generator",
    "Generate realistic fake JSON data for API testing with 20+ field types and templates.",
    "MCK",
  );
}
