import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "Docker Compose Validator",
    "Validate and format Docker Compose files with structure and reference checking.",
    "DCK",
  );
}
