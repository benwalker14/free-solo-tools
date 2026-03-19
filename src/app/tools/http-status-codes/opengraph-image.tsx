import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "HTTP Status Code Reference",
    "Complete reference for all HTTP 1xx, 2xx, 3xx, 4xx, and 5xx status codes.",
    "HTTP",
  );
}
