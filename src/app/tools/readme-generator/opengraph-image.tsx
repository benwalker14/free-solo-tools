import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "README Generator",
    "Generate professional GitHub README.md files with badges, install steps, and usage examples.",
    "RDM",
  );
}
