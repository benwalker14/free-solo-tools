import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "Encode / Decode Multi-Tool",
    "Base64, Base32, Hex, Binary, URL, and HTML encoding & decoding in one tool.",
    "E/D",
  );
}
