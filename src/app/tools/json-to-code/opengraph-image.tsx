import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "JSON to Code Generator",
    "Generate typed code from JSON in 8 languages — Go, Python, Java, C#, Dart, Rust, Swift, and Kotlin.",
    "< >",
  );
}
