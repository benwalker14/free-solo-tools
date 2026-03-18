import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "FreeSolo Pro",
    "Free tier for everyday use. Pro for unlimited access at $4.99/mo.",
  );
}
