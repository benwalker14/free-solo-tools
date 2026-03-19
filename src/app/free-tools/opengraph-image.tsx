import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "77+ Free Developer Tools Online",
    "No signup, no tracking, 100% client-side. JSON formatter, Base64 encoder, hash generator, UUID generator, regex tester, and more.",
  );
}
