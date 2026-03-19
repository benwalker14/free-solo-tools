import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "IP / CIDR Toolkit",
    "Subnet calculator, VLSM divider, IP range to CIDR, and IP classifier.",
    "IP",
  );
}
