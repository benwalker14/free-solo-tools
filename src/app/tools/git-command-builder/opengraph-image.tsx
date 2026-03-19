import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "Git Command Builder & Cheat Sheet",
    "Build git commands visually or browse 80+ commands in a searchable cheat sheet.",
    "Git",
  );
}
