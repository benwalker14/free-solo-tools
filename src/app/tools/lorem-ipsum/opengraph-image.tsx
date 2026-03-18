import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "Lorem Ipsum Generator",
    "Generate placeholder text in paragraphs, sentences, or words for your designs and layouts.",
    "Li",
  );
}
