import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "Epoch / Timestamp Converter",
    "Convert Unix timestamps to dates and dates to timestamps. Seconds, milliseconds, and ISO 8601.",
    "EP",
  );
}
