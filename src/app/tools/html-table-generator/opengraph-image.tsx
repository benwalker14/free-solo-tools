import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "HTML Table Generator",
    "Build HTML tables visually with an interactive editor.",
    "TBL",
  );
}
