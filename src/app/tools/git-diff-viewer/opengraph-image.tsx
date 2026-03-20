import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "Git Diff Viewer",
    "Paste unified diff output and view with syntax highlighting, line numbers, and side-by-side or inline display.",
    "GDV",
  );
}
