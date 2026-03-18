import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "Image Compressor",
    "Compress and resize images online. Adjust quality, convert formats, and reduce file size.",
    "CMP",
  );
}
