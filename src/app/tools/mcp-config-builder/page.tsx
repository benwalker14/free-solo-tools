import type { Metadata } from "next";
import McpConfigBuilderTool from "./McpConfigBuilderTool";

export const metadata: Metadata = {
  title: "MCP Config Builder",
  description:
    "Build MCP (Model Context Protocol) configuration files visually for Claude Desktop, Cursor, VS Code, Windsurf, and Claude Code. 16 server templates, 5 client formats, env var management. Free online tool — no signup required.",
  keywords: [
    "mcp config builder",
    "mcp.json generator",
    "model context protocol config",
    "claude desktop mcp config",
    "cursor mcp config",
    "vscode mcp config",
    "mcp server configuration",
    "mcp setup tool",
    "claude mcp servers",
    "mcp config generator",
  ],
  alternates: {
    canonical: "/tools/mcp-config-builder",
  },
  openGraph: {
    title: "MCP Config Builder - DevBolt",
    description:
      "Build MCP configuration files visually for Claude Desktop, Cursor, VS Code, and more. 16 server templates, 5 client formats. Free, client-side, no signup.",
    url: "/tools/mcp-config-builder",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "MCP Config Builder",
  url: "https://devbolt.dev/tools/mcp-config-builder",
  description:
    "Build MCP (Model Context Protocol) configuration files visually for Claude Desktop, Cursor, VS Code, Windsurf, and Claude Code. 16 server templates and 5 client formats.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  isAccessibleForFree: true,
  browserRequirements: "Any modern web browser",
  creator: { "@type": "Organization", name: "DevBolt", url: "https://devbolt.dev" },
};

export default function McpConfigBuilderPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <McpConfigBuilderTool />
    </>
  );
}
