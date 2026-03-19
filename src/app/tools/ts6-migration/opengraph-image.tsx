import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "TypeScript 6.0 Migration Checker",
    "Analyze tsconfig.json for TS 6.0 breaking changes and get a migration plan.",
    "TS6"
  );
}
