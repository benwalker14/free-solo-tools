import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "cURL to Code Converter",
    "Convert cURL commands to JavaScript, Python, Go, PHP, Ruby, and Java code instantly.",
    "cURL",
  );
}
