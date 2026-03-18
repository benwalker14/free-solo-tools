import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "Regex Tester",
    "Test and debug regular expressions in real time with match highlighting.",
    ".*",
  );
}
