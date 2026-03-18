import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "Base64 Encoder & Decoder",
    "Encode and decode Base64 strings online. Free, fast, and private.",
    "B64",
  );
}
