import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "Word & Character Counter",
    "Count words, characters, sentences, paragraphs, and estimate reading time.",
    "W#",
  );
}
