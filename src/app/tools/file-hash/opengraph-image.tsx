import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "File Hash Calculator",
    "Compute MD5, SHA-1, SHA-256, SHA-384, SHA-512 hashes for any file",
    "#F",
  );
}
