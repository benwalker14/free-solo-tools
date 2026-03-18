import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "Diff Checker",
    "Compare two blocks of text and see differences highlighted. Free online tool.",
    "+-",
  );
}
