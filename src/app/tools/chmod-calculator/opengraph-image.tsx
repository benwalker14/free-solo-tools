import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "Chmod Calculator",
    "Calculate Unix file permissions with an interactive permission matrix.",
    "rwx",
  );
}
