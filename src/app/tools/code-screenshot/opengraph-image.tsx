import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "Code Screenshot Generator",
    "Create beautiful code screenshots with 8 themes, syntax highlighting, and customizable backgrounds. Free Carbon alternative.",
    "CAM",
  );
}
