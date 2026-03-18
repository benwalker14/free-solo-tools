import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "Cron Expression Parser",
    "Parse cron expressions into human-readable descriptions with next scheduled runs.",
    "CRN",
  );
}
