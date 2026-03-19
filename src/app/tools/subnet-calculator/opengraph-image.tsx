import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "Subnet Calculator",
    "Calculate IPv4 subnet details from CIDR notation instantly.",
    "IP",
  );
}
