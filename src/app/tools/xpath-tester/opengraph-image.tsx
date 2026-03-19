import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "XPath Tester",
    "Test XPath expressions against XML data with real-time evaluation. Select elements, filter attributes, and navigate XML structures.",
    "XML",
  );
}
