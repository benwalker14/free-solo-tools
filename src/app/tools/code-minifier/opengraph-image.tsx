import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "JS/CSS/HTML Minifier & Beautifier",
    "Minify and beautify JavaScript, CSS, and HTML code instantly. Free online tool.",
    "MIN",
  );
}
