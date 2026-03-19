import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "Dockerfile Validator & Linter",
    "Validate Dockerfiles for syntax errors, security issues, and best practices",
    "DKR",
  );
}
