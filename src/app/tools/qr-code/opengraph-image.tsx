import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "QR Code Generator",
    "Generate customizable QR codes from text or URLs. Download as PNG.",
    "QR",
  );
}
