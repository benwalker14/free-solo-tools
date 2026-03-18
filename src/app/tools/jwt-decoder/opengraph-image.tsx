import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "JWT Decoder",
    "Decode and inspect JSON Web Tokens instantly. View header, payload, and expiration.",
    "JWT",
  );
}
