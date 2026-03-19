import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "Nginx Config Generator",
    "Generate nginx configuration files with a visual builder.",
    "NGX",
  );
}
