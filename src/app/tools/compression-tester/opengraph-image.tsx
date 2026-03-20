import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "Compression Tester",
    "Test and compare Brotli, Gzip, and Deflate compression ratios for text content — sizes, savings, and speed.",
    "ZIP",
  );
}
