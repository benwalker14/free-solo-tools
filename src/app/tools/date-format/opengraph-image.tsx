import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "Date Format Tester",
    "Test date/time format patterns with live preview. Supports strftime, Moment.js, and date-fns.",
    "DT",
  );
}
