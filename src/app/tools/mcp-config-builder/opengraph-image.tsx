import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "MCP Config Builder",
    "Build MCP configuration files visually for Claude Desktop, Cursor, VS Code, Windsurf, and Claude Code.",
    "MCP",
  );
}
