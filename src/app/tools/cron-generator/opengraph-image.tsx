import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "Crontab Generator",
    "Build cron expressions visually with an interactive schedule builder.",
    "CRON",
  );
}
