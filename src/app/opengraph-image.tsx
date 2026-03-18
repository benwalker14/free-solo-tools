import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "Free Online Tools That Just Work",
    "Fast, clean, and private developer tools. JSON formatter, Base64 encoder, hash generator, and more. No signup required.",
  );
}
