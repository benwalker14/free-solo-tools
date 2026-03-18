import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "HTML Entity Encoder & Decoder",
    "Encode and decode HTML entities online. Convert special characters to named or numeric entities.",
    "&;",
  );
}
