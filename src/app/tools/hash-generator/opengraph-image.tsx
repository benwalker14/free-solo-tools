import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "Hash Generator",
    "Generate SHA-1, SHA-256, SHA-384, SHA-512 hashes online. Secure and free.",
    "#",
  );
}
