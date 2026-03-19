import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "tsconfig.json Visual Builder",
    "Build TypeScript configuration visually with framework presets and explanations for every compiler option.",
    "TS"
  );
}
