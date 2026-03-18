import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "JSON Formatter & Validator",
    "Format, validate, and minify JSON data instantly. Free online tool.",
    "{ }",
  );
}
