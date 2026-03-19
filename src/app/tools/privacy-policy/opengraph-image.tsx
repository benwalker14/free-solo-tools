import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "Privacy Policy Generator",
    "Generate a customizable privacy policy with GDPR, CCPA, and COPPA compliance.",
    "PP",
  );
}
