import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "JS/TS Playground",
    "Run JavaScript and TypeScript code in your browser with instant console output. No setup required.",
    "JS",
  );
}
