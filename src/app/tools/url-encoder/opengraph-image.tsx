import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "URL Encoder & Decoder",
    "Encode and decode URLs and URL components online. Free, fast, and private.",
    "%20",
  );
}
