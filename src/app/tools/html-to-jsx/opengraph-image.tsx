import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "HTML to JSX Converter",
    "Convert HTML to JSX instantly — class to className, inline styles to objects, self-closing tags, and more.",
    "Convert",
  );
}
