import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "YAML Validator & Formatter",
    "Validate, format, beautify, and minify YAML documents instantly.",
    "YAM",
  );
}
