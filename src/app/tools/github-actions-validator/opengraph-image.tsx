import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "GitHub Actions Validator",
    "Validate GitHub Actions workflow YAML for syntax, triggers, job structure, and deprecated actions.",
    "GHA",
  );
}
