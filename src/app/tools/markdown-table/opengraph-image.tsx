import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "Markdown Table Generator",
    "Build Markdown tables visually with an interactive editor. Import CSV, set alignment, and copy clean Markdown.",
    "TBL",
  );
}
