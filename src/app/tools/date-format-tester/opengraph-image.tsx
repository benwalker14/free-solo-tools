import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "Date Format Tester",
    "Test strftime, date-fns, Moment.js, Go & Java date format patterns with live preview.",
    "DT",
  );
}
