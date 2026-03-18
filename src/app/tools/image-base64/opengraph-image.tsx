import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "Image to Base64 Converter",
    "Convert images to Base64 data URIs or decode Base64 strings back to images.",
    "IMG",
  );
}
