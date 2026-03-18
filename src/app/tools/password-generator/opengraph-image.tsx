import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "Password Generator",
    "Generate strong, cryptographically secure random passwords with customizable length and character sets.",
    "PW",
  );
}
