import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "JSON Visualizer",
    "Visualize JSON as an interactive tree — collapsible nodes, search, path copy, depth controls, and statistics.",
    "{ }",
  );
}
