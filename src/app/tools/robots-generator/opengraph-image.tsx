import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "robots.txt Generator",
    "Generate robots.txt files with crawl rules for search engine bots.",
    "BOT",
  );
}
