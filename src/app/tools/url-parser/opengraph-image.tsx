import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "URL Parser",
    "Parse and inspect URL components. View protocol, host, path, query parameters, and hash.",
    "URL",
  );
}
