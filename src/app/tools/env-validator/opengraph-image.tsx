import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    ".env File Validator",
    "Validate .env files for syntax errors, duplicate keys, and security risks.",
    "ENV",
  );
}
