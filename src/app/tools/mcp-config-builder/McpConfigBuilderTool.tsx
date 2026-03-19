"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Tab = "builder" | "templates" | "reference";
type ClientFormat = "claude-desktop" | "cursor" | "vscode" | "windsurf" | "claude-code";

interface EnvVar {
  key: string;
  value: string;
}

interface McpServer {
  id: string;
  name: string;
  command: string;
  args: string[];
  env: EnvVar[];
  disabled: boolean;
}

interface ServerTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  command: string;
  args: string[];
  env: EnvVar[];
}

// ---------------------------------------------------------------------------
// Client format info
// ---------------------------------------------------------------------------

const CLIENT_FORMATS: {
  id: ClientFormat;
  label: string;
  filePath: string;
  description: string;
}[] = [
  {
    id: "claude-desktop",
    label: "Claude Desktop",
    filePath: "claude_desktop_config.json",
    description: "Anthropic's Claude Desktop app",
  },
  {
    id: "cursor",
    label: "Cursor",
    filePath: ".cursor/mcp.json",
    description: "Cursor AI code editor",
  },
  {
    id: "vscode",
    label: "VS Code",
    filePath: ".vscode/mcp.json",
    description: "Visual Studio Code with Copilot",
  },
  {
    id: "windsurf",
    label: "Windsurf",
    filePath: "~/.codeium/windsurf/mcp_config.json",
    description: "Codeium's Windsurf editor",
  },
  {
    id: "claude-code",
    label: "Claude Code",
    filePath: ".mcp.json",
    description: "Anthropic's Claude Code CLI",
  },
];

// ---------------------------------------------------------------------------
// Server templates
// ---------------------------------------------------------------------------

const SERVER_TEMPLATES: ServerTemplate[] = [
  {
    id: "filesystem",
    name: "Filesystem",
    description: "Read, write, and manage files on your local filesystem",
    category: "Core",
    command: "npx",
    args: ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/directory"],
    env: [],
  },
  {
    id: "github",
    name: "GitHub",
    description: "Interact with GitHub repos, issues, PRs, and more",
    category: "Developer",
    command: "npx",
    args: ["-y", "@modelcontextprotocol/server-github"],
    env: [{ key: "GITHUB_PERSONAL_ACCESS_TOKEN", value: "ghp_your_token_here" }],
  },
  {
    id: "postgres",
    name: "PostgreSQL",
    description: "Query and manage PostgreSQL databases",
    category: "Database",
    command: "npx",
    args: ["-y", "@modelcontextprotocol/server-postgres", "postgresql://user:password@localhost:5432/dbname"],
    env: [],
  },
  {
    id: "sqlite",
    name: "SQLite",
    description: "Read and query SQLite database files",
    category: "Database",
    command: "npx",
    args: ["-y", "@modelcontextprotocol/server-sqlite", "/path/to/database.db"],
    env: [],
  },
  {
    id: "memory",
    name: "Memory",
    description: "Persistent memory using a local knowledge graph",
    category: "Core",
    command: "npx",
    args: ["-y", "@modelcontextprotocol/server-memory"],
    env: [],
  },
  {
    id: "brave-search",
    name: "Brave Search",
    description: "Web search and local search via Brave Search API",
    category: "Search",
    command: "npx",
    args: ["-y", "@modelcontextprotocol/server-brave-search"],
    env: [{ key: "BRAVE_API_KEY", value: "your_brave_api_key" }],
  },
  {
    id: "fetch",
    name: "Fetch",
    description: "Fetch web pages and convert to Markdown for AI consumption",
    category: "Core",
    command: "npx",
    args: ["-y", "@modelcontextprotocol/server-fetch"],
    env: [],
  },
  {
    id: "puppeteer",
    name: "Puppeteer",
    description: "Browser automation — navigate pages, take screenshots, interact with elements",
    category: "Developer",
    command: "npx",
    args: ["-y", "@modelcontextprotocol/server-puppeteer"],
    env: [],
  },
  {
    id: "google-drive",
    name: "Google Drive",
    description: "Search and read files from Google Drive",
    category: "Cloud",
    command: "npx",
    args: ["-y", "@modelcontextprotocol/server-gdrive"],
    env: [],
  },
  {
    id: "google-maps",
    name: "Google Maps",
    description: "Geocoding, directions, place search, and elevation data",
    category: "Cloud",
    command: "npx",
    args: ["-y", "@modelcontextprotocol/server-google-maps"],
    env: [{ key: "GOOGLE_MAPS_API_KEY", value: "your_google_maps_api_key" }],
  },
  {
    id: "slack",
    name: "Slack",
    description: "Read channels, post messages, and search Slack workspaces",
    category: "Cloud",
    command: "npx",
    args: ["-y", "@modelcontextprotocol/server-slack"],
    env: [{ key: "SLACK_BOT_TOKEN", value: "xoxb-your-bot-token" }, { key: "SLACK_TEAM_ID", value: "T00000000" }],
  },
  {
    id: "sequential-thinking",
    name: "Sequential Thinking",
    description: "Dynamic problem-solving through step-by-step reasoning",
    category: "Core",
    command: "npx",
    args: ["-y", "@modelcontextprotocol/server-sequential-thinking"],
    env: [],
  },
  {
    id: "git",
    name: "Git",
    description: "Read git history, diffs, branches, and repository metadata",
    category: "Developer",
    command: "npx",
    args: ["-y", "@modelcontextprotocol/server-git", "--repository", "/path/to/repo"],
    env: [],
  },
  {
    id: "everything",
    name: "Everything",
    description: "Reference/test server demonstrating all MCP capabilities",
    category: "Developer",
    command: "npx",
    args: ["-y", "@modelcontextprotocol/server-everything"],
    env: [],
  },
  {
    id: "sentry",
    name: "Sentry",
    description: "Retrieve and analyze error data from Sentry.io",
    category: "Developer",
    command: "npx",
    args: ["-y", "@modelcontextprotocol/server-sentry"],
    env: [{ key: "SENTRY_AUTH_TOKEN", value: "your_sentry_auth_token" }],
  },
  {
    id: "custom-sse",
    name: "Custom SSE Server",
    description: "Connect to any MCP server via Server-Sent Events (SSE)",
    category: "Custom",
    command: "npx",
    args: ["-y", "mcp-remote", "https://your-server.example.com/sse"],
    env: [],
  },
];

const TEMPLATE_CATEGORIES = ["All", "Core", "Developer", "Database", "Search", "Cloud", "Custom"];

// ---------------------------------------------------------------------------
// Reference data
// ---------------------------------------------------------------------------

interface ReferenceEntry {
  field: string;
  description: string;
  example: string;
  required: boolean;
}

const REFERENCE: ReferenceEntry[] = [
  { field: "mcpServers", description: "Top-level object containing all MCP server configurations. Each key is a unique server name.", example: '"mcpServers": { ... }', required: true },
  { field: "command", description: "The executable to run the MCP server. Usually npx, node, python, uvx, or docker.", example: '"command": "npx"', required: true },
  { field: "args", description: "Array of command-line arguments passed to the command. Package name is typically the first arg for npx.", example: '"args": ["-y", "@modelcontextprotocol/server-filesystem", "/path"]', required: true },
  { field: "env", description: "Environment variables passed to the server process. Used for API keys, tokens, and configuration.", example: '"env": { "API_KEY": "..." }', required: false },
  { field: "disabled", description: "Set to true to temporarily disable a server without removing its configuration. (Claude Desktop, Claude Code)", example: '"disabled": true', required: false },
  { field: "type (VS Code)", description: 'VS Code uses "type": "stdio" to specify the transport. SSE servers use a url field instead.', example: '"type": "stdio"', required: false },
  { field: "url (VS Code SSE)", description: "For VS Code SSE-based servers, specify the server URL instead of command/args.", example: '"url": "https://server.example.com/sse"', required: false },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

let _idCounter = 0;
function uid() {
  return `srv_${Date.now()}_${++_idCounter}`;
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    || "server";
}

function generateConfig(servers: McpServer[], format: ClientFormat): string {
  if (servers.length === 0) return "// Add at least one server to generate config";

  if (format === "vscode") {
    const serversObj: Record<string, unknown> = {};
    for (const s of servers) {
      const entry: Record<string, unknown> = {
        type: "stdio",
        command: s.command,
        args: s.args,
      };
      if (s.env.length > 0) {
        const envObj: Record<string, string> = {};
        for (const e of s.env) if (e.key) envObj[e.key] = e.value;
        if (Object.keys(envObj).length > 0) entry.env = envObj;
      }
      if (s.disabled) entry.disabled = true;
      serversObj[slugify(s.name)] = entry;
    }
    return JSON.stringify({ servers: serversObj }, null, 2);
  }

  if (format === "claude-code") {
    const serversObj: Record<string, unknown> = {};
    for (const s of servers) {
      const entry: Record<string, unknown> = {
        command: s.command,
        args: s.args,
      };
      if (s.env.length > 0) {
        const envObj: Record<string, string> = {};
        for (const e of s.env) if (e.key) envObj[e.key] = e.value;
        if (Object.keys(envObj).length > 0) entry.env = envObj;
      }
      if (s.disabled) entry.disabled = true;
      serversObj[slugify(s.name)] = entry;
    }
    return JSON.stringify({ mcpServers: serversObj }, null, 2);
  }

  // claude-desktop, cursor, windsurf — all use mcpServers
  const serversObj: Record<string, unknown> = {};
  for (const s of servers) {
    const entry: Record<string, unknown> = {
      command: s.command,
      args: s.args,
    };
    if (s.env.length > 0) {
      const envObj: Record<string, string> = {};
      for (const e of s.env) if (e.key) envObj[e.key] = e.value;
      if (Object.keys(envObj).length > 0) entry.env = envObj;
    }
    if (s.disabled) entry.disabled = true;
    serversObj[slugify(s.name)] = entry;
  }
  return JSON.stringify({ mcpServers: serversObj }, null, 2);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function McpConfigBuilderTool() {
  useToolAnalytics("mcp-config-builder");

  const [tab, setTab] = useState<Tab>("builder");
  const [servers, setServers] = useState<McpServer[]>([]);
  const [clientFormat, setClientFormat] = useState<ClientFormat>("claude-desktop");
  const [copied, setCopied] = useState(false);
  const [templateSearch, setTemplateSearch] = useState("");
  const [templateCategory, setTemplateCategory] = useState("All");
  const [refSearch, setRefSearch] = useState("");
  const [expandedServer, setExpandedServer] = useState<string | null>(null);

  // Generated config
  const config = useMemo(() => generateConfig(servers, clientFormat), [servers, clientFormat]);
  const activeClient = CLIENT_FORMATS.find((c) => c.id === clientFormat)!;

  // Add server from template
  const addFromTemplate = useCallback((template: ServerTemplate) => {
    const newServer: McpServer = {
      id: uid(),
      name: template.name,
      command: template.command,
      args: [...template.args],
      env: template.env.map((e) => ({ ...e })),
      disabled: false,
    };
    setServers((prev) => [...prev, newServer]);
    setExpandedServer(newServer.id);
    setTab("builder");
  }, []);

  // Add blank server
  const addBlankServer = useCallback(() => {
    const newServer: McpServer = {
      id: uid(),
      name: "my-server",
      command: "npx",
      args: ["-y", "@your/mcp-server"],
      env: [],
      disabled: false,
    };
    setServers((prev) => [...prev, newServer]);
    setExpandedServer(newServer.id);
  }, []);

  // Remove server
  const removeServer = useCallback((id: string) => {
    setServers((prev) => prev.filter((s) => s.id !== id));
    setExpandedServer((prev) => (prev === id ? null : prev));
  }, []);

  // Update server field
  const updateServer = useCallback(
    (id: string, updates: Partial<McpServer>) => {
      setServers((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...updates } : s)),
      );
    },
    [],
  );

  // Args helpers
  const updateArg = useCallback((serverId: string, index: number, value: string) => {
    setServers((prev) =>
      prev.map((s) => {
        if (s.id !== serverId) return s;
        const newArgs = [...s.args];
        newArgs[index] = value;
        return { ...s, args: newArgs };
      }),
    );
  }, []);

  const addArg = useCallback((serverId: string) => {
    setServers((prev) =>
      prev.map((s) => (s.id === serverId ? { ...s, args: [...s.args, ""] } : s)),
    );
  }, []);

  const removeArg = useCallback((serverId: string, index: number) => {
    setServers((prev) =>
      prev.map((s) => {
        if (s.id !== serverId) return s;
        return { ...s, args: s.args.filter((_, i) => i !== index) };
      }),
    );
  }, []);

  // Env helpers
  const updateEnv = useCallback((serverId: string, index: number, field: "key" | "value", val: string) => {
    setServers((prev) =>
      prev.map((s) => {
        if (s.id !== serverId) return s;
        const newEnv = s.env.map((e, i) => (i === index ? { ...e, [field]: val } : e));
        return { ...s, env: newEnv };
      }),
    );
  }, []);

  const addEnv = useCallback((serverId: string) => {
    setServers((prev) =>
      prev.map((s) => (s.id === serverId ? { ...s, env: [...s.env, { key: "", value: "" }] } : s)),
    );
  }, []);

  const removeEnv = useCallback((serverId: string, index: number) => {
    setServers((prev) =>
      prev.map((s) => {
        if (s.id !== serverId) return s;
        return { ...s, env: s.env.filter((_, i) => i !== index) };
      }),
    );
  }, []);

  // Copy
  const copyOutput = useCallback(() => {
    navigator.clipboard.writeText(config).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [config]);

  // Download
  const downloadConfig = useCallback(() => {
    const blob = new Blob([config], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = activeClient.filePath.split("/").pop() || "mcp-config.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [config, activeClient]);

  // Filter templates
  const filteredTemplates = useMemo(() => {
    let list = SERVER_TEMPLATES;
    if (templateCategory !== "All") {
      list = list.filter((t) => t.category === templateCategory);
    }
    if (templateSearch.trim()) {
      const q = templateSearch.toLowerCase();
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q),
      );
    }
    return list;
  }, [templateSearch, templateCategory]);

  // Filter reference
  const filteredRef = useMemo(() => {
    if (!refSearch.trim()) return REFERENCE;
    const q = refSearch.toLowerCase();
    return REFERENCE.filter(
      (r) =>
        r.field.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q),
    );
  }, [refSearch]);

  // Check for duplicate server names
  const duplicateNames = useMemo(() => {
    const slugs = servers.map((s) => slugify(s.name));
    const seen = new Set<string>();
    const dupes = new Set<string>();
    for (const slug of slugs) {
      if (seen.has(slug)) dupes.add(slug);
      seen.add(slug);
    }
    return dupes;
  }, [servers]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          MCP Config Builder
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Build mcp.json configuration files visually for Claude Desktop, Cursor, VS Code, Windsurf, and Claude Code.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
        {(
          [
            { id: "builder" as Tab, label: "Builder", count: servers.length },
            { id: "templates" as Tab, label: "Templates" },
            { id: "reference" as Tab, label: "Reference" },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              tab === t.id
                ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-gray-100"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            {t.label}
            {"count" in t && t.count ? (
              <span className="ml-1.5 inline-flex items-center rounded-full bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                {t.count}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {/* Builder Tab */}
      {tab === "builder" && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left: Servers */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                MCP Servers
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setTab("templates")}
                  className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  + From Template
                </button>
                <button
                  onClick={addBlankServer}
                  className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  + Blank Server
                </button>
              </div>
            </div>

            {servers.length === 0 && (
              <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 py-10 text-center dark:border-gray-600 dark:bg-gray-800/50">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No servers configured yet.
                </p>
                <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                  Add a server from{" "}
                  <button onClick={() => setTab("templates")} className="text-blue-600 underline dark:text-blue-400">
                    templates
                  </button>{" "}
                  or{" "}
                  <button onClick={addBlankServer} className="text-blue-600 underline dark:text-blue-400">
                    create a blank one
                  </button>.
                </p>
              </div>
            )}

            {/* Server list */}
            <div className="space-y-2">
              {servers.map((server) => {
                const isExpanded = expandedServer === server.id;
                const slug = slugify(server.name);
                const isDuplicate = duplicateNames.has(slug);

                return (
                  <div
                    key={server.id}
                    className={`rounded-lg border transition-colors ${
                      isExpanded
                        ? "border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-900/20"
                        : server.disabled
                          ? "border-gray-200 bg-gray-50 opacity-60 dark:border-gray-700 dark:bg-gray-800/50"
                          : "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
                    }`}
                  >
                    {/* Server header */}
                    <div className="flex items-center gap-2 px-3 py-2.5">
                      <button
                        onClick={() => setExpandedServer(isExpanded ? null : server.id)}
                        className="flex min-w-0 flex-1 items-center gap-2 text-left"
                      >
                        <span className="text-xs text-gray-400">{isExpanded ? "▼" : "▶"}</span>
                        <span className="truncate font-mono text-sm font-medium text-gray-900 dark:text-gray-100">
                          {slug}
                        </span>
                        {server.disabled && (
                          <span className="rounded bg-gray-200 px-1.5 py-0.5 text-[10px] font-medium text-gray-500 dark:bg-gray-600 dark:text-gray-400">
                            disabled
                          </span>
                        )}
                        {isDuplicate && (
                          <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                            duplicate name
                          </span>
                        )}
                      </button>
                      <button
                        onClick={() => updateServer(server.id, { disabled: !server.disabled })}
                        title={server.disabled ? "Enable server" : "Disable server"}
                        className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {server.disabled ? "Enable" : "Disable"}
                      </button>
                      <button
                        onClick={() => removeServer(server.id)}
                        title="Remove server"
                        className="text-xs text-red-400 hover:text-red-600 dark:hover:text-red-300"
                      >
                        Remove
                      </button>
                    </div>

                    {/* Expanded config */}
                    {isExpanded && (
                      <div className="space-y-3 border-t border-gray-200 px-3 py-3 dark:border-gray-700">
                        {/* Name */}
                        <div>
                          <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
                            Server Name
                          </label>
                          <input
                            type="text"
                            value={server.name}
                            onChange={(e) => updateServer(server.id, { name: e.target.value })}
                            placeholder="my-server"
                            className="w-full rounded border border-gray-200 bg-white px-2 py-1.5 text-sm font-mono text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200 dark:placeholder-gray-500"
                          />
                          <p className="mt-0.5 text-[10px] text-gray-400">
                            Config key: <span className="font-mono">{slug}</span>
                          </p>
                        </div>

                        {/* Command */}
                        <div>
                          <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
                            Command
                          </label>
                          <input
                            type="text"
                            value={server.command}
                            onChange={(e) => updateServer(server.id, { command: e.target.value })}
                            placeholder="npx"
                            className="w-full rounded border border-gray-200 bg-white px-2 py-1.5 text-sm font-mono text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200 dark:placeholder-gray-500"
                          />
                        </div>

                        {/* Args */}
                        <div>
                          <div className="mb-1 flex items-center justify-between">
                            <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                              Arguments
                            </label>
                            <button
                              onClick={() => addArg(server.id)}
                              className="text-[10px] text-blue-600 hover:text-blue-700 dark:text-blue-400"
                            >
                              + Add Arg
                            </button>
                          </div>
                          <div className="space-y-1">
                            {server.args.map((arg, i) => (
                              <div key={i} className="flex gap-1">
                                <input
                                  type="text"
                                  value={arg}
                                  onChange={(e) => updateArg(server.id, i, e.target.value)}
                                  placeholder={`arg ${i}`}
                                  className="flex-1 rounded border border-gray-200 bg-white px-2 py-1 text-xs font-mono text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200 dark:placeholder-gray-500"
                                />
                                <button
                                  onClick={() => removeArg(server.id, i)}
                                  className="rounded px-1.5 text-xs text-red-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                                  title="Remove argument"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                            {server.args.length === 0 && (
                              <p className="text-[10px] text-gray-400 italic">No arguments</p>
                            )}
                          </div>
                        </div>

                        {/* Env vars */}
                        <div>
                          <div className="mb-1 flex items-center justify-between">
                            <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                              Environment Variables
                            </label>
                            <button
                              onClick={() => addEnv(server.id)}
                              className="text-[10px] text-blue-600 hover:text-blue-700 dark:text-blue-400"
                            >
                              + Add Env Var
                            </button>
                          </div>
                          <div className="space-y-1">
                            {server.env.map((envVar, i) => (
                              <div key={i} className="flex gap-1">
                                <input
                                  type="text"
                                  value={envVar.key}
                                  onChange={(e) => updateEnv(server.id, i, "key", e.target.value)}
                                  placeholder="KEY"
                                  className="w-1/3 rounded border border-gray-200 bg-white px-2 py-1 text-xs font-mono text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200 dark:placeholder-gray-500"
                                />
                                <input
                                  type="text"
                                  value={envVar.value}
                                  onChange={(e) => updateEnv(server.id, i, "value", e.target.value)}
                                  placeholder="value"
                                  className="flex-1 rounded border border-gray-200 bg-white px-2 py-1 text-xs font-mono text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200 dark:placeholder-gray-500"
                                />
                                <button
                                  onClick={() => removeEnv(server.id, i)}
                                  className="rounded px-1.5 text-xs text-red-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                                  title="Remove env var"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                            {server.env.length === 0 && (
                              <p className="text-[10px] text-gray-400 italic">No environment variables</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Output */}
          <div className="space-y-4">
            {/* Client format selector */}
            <div>
              <h2 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Client / Editor
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {CLIENT_FORMATS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setClientFormat(f.id)}
                    className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                      clientFormat === f.id
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                Save to: <span className="font-mono">{activeClient.filePath}</span>
              </p>
            </div>

            {/* Generated output */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Generated Config
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={downloadConfig}
                    disabled={servers.length === 0}
                    className="rounded-md bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
                  >
                    Download
                  </button>
                  <button
                    onClick={copyOutput}
                    disabled={servers.length === 0}
                    className="rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>
              <pre className="min-h-[120px] max-h-[400px] overflow-auto rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs font-mono text-gray-800 whitespace-pre-wrap break-all dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
                {config}
              </pre>
            </div>

            {/* Warnings */}
            {duplicateNames.size > 0 && (
              <div className="flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
                <span className="mt-px flex-shrink-0">⚠</span>
                <span>Duplicate server name{duplicateNames.size > 1 ? "s" : ""} detected: {Array.from(duplicateNames).join(", ")}. Each server must have a unique name.</span>
              </div>
            )}

            {servers.some((s) => s.env.some((e) => e.value.includes("your_") || e.value.includes("ghp_your"))) && (
              <div className="flex items-start gap-2 rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                <span className="mt-px flex-shrink-0">ℹ</span>
                <span>Remember to replace placeholder values in env vars with your actual API keys before saving.</span>
              </div>
            )}

            {/* Quick stats */}
            {servers.length > 0 && (
              <div className="rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
                <h2 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Config Stats
                </h2>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {servers.length}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Servers</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {servers.filter((s) => !s.disabled).length}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Active</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {servers.reduce((sum, s) => sum + s.env.length, 0)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Env Vars</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Templates Tab */}
      {tab === "templates" && (
        <div className="space-y-3">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Click a template to add it to your config. You can customize every field after adding.
          </p>

          {/* Search and category filter */}
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              value={templateSearch}
              onChange={(e) => setTemplateSearch(e.target.value)}
              placeholder="Search servers..."
              className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
            />
            <div className="flex flex-wrap gap-1">
              {TEMPLATE_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setTemplateCategory(cat)}
                  className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                    templateCategory === cat
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Template grid */}
          <div className="grid gap-3 sm:grid-cols-2">
            {filteredTemplates.map((template) => {
              const alreadyAdded = servers.some(
                (s) => s.command === template.command && JSON.stringify(s.args) === JSON.stringify(template.args),
              );
              return (
                <button
                  key={template.id}
                  onClick={() => addFromTemplate(template)}
                  className="group rounded-lg border border-gray-200 bg-white p-4 text-left transition-colors hover:border-blue-300 hover:bg-blue-50/50 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-700 dark:hover:bg-blue-900/20"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-400">
                      {template.name}
                    </span>
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                      {template.category}
                    </span>
                    {alreadyAdded && (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        added
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {template.description}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-mono text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                      {template.command}
                    </span>
                    {template.args.slice(0, 2).map((arg, i) => (
                      <span
                        key={i}
                        className="max-w-[180px] truncate rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-mono text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                      >
                        {arg}
                      </span>
                    ))}
                    {template.args.length > 2 && (
                      <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-mono text-gray-500 dark:bg-gray-700 dark:text-gray-500">
                        +{template.args.length - 2} more
                      </span>
                    )}
                  </div>
                  {template.env.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {template.env.map((e, i) => (
                        <span
                          key={i}
                          className="rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-mono text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
                        >
                          {e.key}
                        </span>
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
            {filteredTemplates.length === 0 && (
              <p className="col-span-2 py-8 text-center text-sm text-gray-400">
                No templates match &quot;{templateSearch}&quot;
              </p>
            )}
          </div>
        </div>
      )}

      {/* Reference Tab */}
      {tab === "reference" && (
        <div className="space-y-3">
          <input
            type="text"
            value={refSearch}
            onChange={(e) => setRefSearch(e.target.value)}
            placeholder="Search config fields..."
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
          />

          <div className="space-y-2">
            {filteredRef.map((r) => (
              <div
                key={r.field}
                className="rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {r.field}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      r.required
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                    }`}
                  >
                    {r.required ? "required" : "optional"}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                  {r.description}
                </p>
                <code className="mt-1.5 block rounded bg-gray-50 px-2 py-1 text-xs font-mono text-gray-700 dark:bg-gray-900 dark:text-gray-300">
                  {r.example}
                </code>
              </div>
            ))}
            {filteredRef.length === 0 && (
              <p className="py-8 text-center text-sm text-gray-400">
                No fields match &quot;{refSearch}&quot;
              </p>
            )}
          </div>

          {/* Client file paths */}
          <div className="rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Config File Paths by Client
            </h3>
            <div className="space-y-1.5">
              {CLIENT_FORMATS.map((c) => (
                <div key={c.id} className="flex items-center gap-2">
                  <span className="w-28 text-xs font-medium text-gray-600 dark:text-gray-400">
                    {c.label}
                  </span>
                  <code className="rounded bg-gray-50 px-2 py-0.5 text-xs font-mono text-gray-700 dark:bg-gray-900 dark:text-gray-300">
                    {c.filePath}
                  </code>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SEO sub-page links */}
      <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
        <h2 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
          Related Guides
        </h2>
        <div className="flex flex-wrap gap-2">
          {[
            { href: "/tools/mcp-config-builder/mcp-setup-guide", label: "MCP Setup Guide" },
            { href: "/tools/mcp-config-builder/popular-mcp-servers", label: "Popular MCP Servers" },
            { href: "/tools/mcp-config-builder/mcp-client-comparison", label: "MCP Client Comparison" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:border-blue-300 hover:text-blue-600 dark:border-gray-700 dark:text-gray-400 dark:hover:border-blue-700 dark:hover:text-blue-400"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
