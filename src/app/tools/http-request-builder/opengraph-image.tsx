import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "HTTP Request Builder",
    "Build HTTP requests visually and generate code in cURL, JavaScript, Python, Go, Rust, and PHP.",
    "HTTP",
  );
}
