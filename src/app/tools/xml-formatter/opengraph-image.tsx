import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "XML Formatter & Validator",
    "Format, beautify, validate, and minify XML documents instantly. Free online tool.",
    "XML",
  );
}
