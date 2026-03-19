import Link from "next/link";

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm font-mono text-indigo-600 dark:bg-gray-800 dark:text-indigo-400">
      {children}
    </code>
  );
}

function CodeBlock({ children, title }: { children: string; title?: string }) {
  return (
    <div className="my-6 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
      {title && (
        <div className="border-b border-gray-200 bg-gray-50 px-4 py-2 text-xs font-medium text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
          {title}
        </div>
      )}
      <pre className="overflow-x-auto bg-gray-50 p-4 text-sm leading-relaxed dark:bg-gray-900">
        <code className="font-mono text-gray-800 dark:text-gray-200">
          {children}
        </code>
      </pre>
    </div>
  );
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 rounded-lg border-l-4 border-amber-400 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-600 dark:bg-amber-900/20 dark:text-amber-200">
      {children}
    </div>
  );
}

function AffiliateBox({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="my-8 rounded-lg border border-blue-200 bg-blue-50 p-5 dark:border-blue-900 dark:bg-blue-950/30">
      <div className="text-sm text-blue-800 dark:text-blue-200">
        {children}
      </div>
    </div>
  );
}

export default function McpContextWindow() {
  return (
    <>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        The Model Context Protocol (MCP) lets AI coding assistants — Claude
        Desktop, Cursor, Windsurf, VS Code Copilot — call external tools like
        databases, file systems, and APIs. But every MCP server you enable injects
        its tool definitions into the context window of{" "}
        <strong>every single prompt</strong>. With a typical setup of 5-10
        servers, you can lose 5,000-15,000 tokens before you even ask your first
        question. This guide shows you how to audit, measure, and optimize your
        MCP configuration to get the most out of your context window.
      </p>

      <Callout>
        Need to build or edit your MCP config?{" "}
        <Link
          href="/tools/mcp-config-builder"
          className="font-medium text-amber-700 underline hover:text-amber-600 dark:text-amber-300 dark:hover:text-amber-200"
        >
          DevBolt&apos;s MCP Config Builder
        </Link>{" "}
        supports Claude Desktop, Cursor, VS Code, Windsurf, and Claude Code with
        16 server templates. 100% client-side — your config never leaves your
        browser.
      </Callout>

      {/* ── The Problem ── */}
      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        The Hidden Cost of MCP Tool Definitions
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        When you connect an MCP server, the AI client registers every tool that
        server exposes. Each tool registration includes its name, description,
        and full JSON Schema for parameters. This metadata is injected into the
        system prompt on <em>every message</em> — not just when you use the
        tool.
      </p>

      <CodeBlock title="What the AI sees in its system prompt (simplified)">
{`Available tools:
- filesystem_read_file: Read contents of a file
  params: { path: string (required), encoding: string (optional) }
- filesystem_write_file: Write content to a file
  params: { path: string, content: string, encoding: string }
- filesystem_list_directory: List directory contents
  params: { path: string, recursive: boolean }
- github_search_repositories: Search GitHub repos
  params: { query: string, sort: string, per_page: number }
- github_get_file_contents: Get file from a GitHub repo
  params: { owner: string, repo: string, path: string, branch: string }
... (50+ more tool definitions)

// Each tool definition = 50-200 tokens
// 50 tools × ~120 tokens = ~6,000 tokens per message`}
      </CodeBlock>

      <p className="text-gray-600 dark:text-gray-400">
        With Claude&apos;s Opus model at $15/million input tokens, a 50-tool
        setup costs roughly <strong>$0.09 per 1,000-message conversation</strong>{" "}
        just in tool definitions — before any actual work. For Sonnet ($3/M
        input), it&apos;s about $0.018 per conversation. Small per-message, but
        it adds up over hundreds of daily sessions.
      </p>

      {/* ── How to Audit ── */}
      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Step 1: Audit Your MCP Server Config
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Your MCP config lives in a JSON file. The location depends on your
        client:
      </p>

      <div className="my-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800">
              <th className="px-4 py-2 text-left font-semibold text-gray-900 dark:text-white">Client</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-900 dark:text-white">Config Location</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
            <tr>
              <td className="px-4 py-2 text-gray-700 dark:text-gray-300">Claude Desktop</td>
              <td className="px-4 py-2"><Code>~/Library/Application Support/Claude/claude_desktop_config.json</Code></td>
            </tr>
            <tr>
              <td className="px-4 py-2 text-gray-700 dark:text-gray-300">Cursor</td>
              <td className="px-4 py-2"><Code>~/.cursor/mcp.json</Code></td>
            </tr>
            <tr>
              <td className="px-4 py-2 text-gray-700 dark:text-gray-300">VS Code</td>
              <td className="px-4 py-2"><Code>.vscode/mcp.json</Code> (per project)</td>
            </tr>
            <tr>
              <td className="px-4 py-2 text-gray-700 dark:text-gray-300">Windsurf</td>
              <td className="px-4 py-2"><Code>~/.codeium/windsurf/mcp_config.json</Code></td>
            </tr>
            <tr>
              <td className="px-4 py-2 text-gray-700 dark:text-gray-300">Claude Code</td>
              <td className="px-4 py-2"><Code>~/.claude/settings.json</Code> (mcpServers key)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="text-gray-600 dark:text-gray-400">
        Open your config and list every server. For each one, ask: <em>Did I
        use this server in the last week?</em> If not, it&apos;s burning tokens
        for nothing.
      </p>

      <CodeBlock title="Example: Overloaded MCP config (claude_desktop_config.json)">
{`{
  "mcpServers": {
    "filesystem": { "command": "npx", "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/dev/projects"] },
    "github": { "command": "npx", "args": ["-y", "@modelcontextprotocol/server-github"], "env": { "GITHUB_TOKEN": "ghp_..." } },
    "postgres": { "command": "npx", "args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://..."] },
    "sqlite": { "command": "npx", "args": ["-y", "@modelcontextprotocol/server-sqlite", "path/to/db"] },
    "brave-search": { "command": "npx", "args": ["-y", "@modelcontextprotocol/server-brave-search"], "env": { "BRAVE_API_KEY": "..." } },
    "slack": { "command": "npx", "args": ["-y", "@modelcontextprotocol/server-slack"], "env": { "SLACK_TOKEN": "..." } },
    "memory": { "command": "npx", "args": ["-y", "@modelcontextprotocol/server-memory"] },
    "puppeteer": { "command": "npx", "args": ["-y", "@modelcontextprotocol/server-puppeteer"] },
    "google-drive": { "command": "npx", "args": ["-y", "@anthropic/mcp-server-gdrive"] },
    "sentry": { "command": "npx", "args": ["-y", "@sentry/mcp-server-sentry"], "env": { "SENTRY_AUTH": "..." } }
  }
}`}
      </CodeBlock>

      <p className="text-gray-600 dark:text-gray-400">
        Ten servers is common among power users. But if you&apos;re working on a
        frontend React project, do you really need the PostgreSQL, Sentry, and
        Google Drive servers running? Each adds 300-1,500 tokens of tool
        definitions to every prompt.
      </p>

      {/* ── Measuring Token Cost ── */}
      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Step 2: Measure the Token Cost
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        To understand the actual impact, count the tokens your tool definitions
        consume:
      </p>
      <ol className="mt-4 space-y-3 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-2">
          <span className="text-indigo-600 dark:text-indigo-400 mt-0.5 font-bold">1.</span>
          <span>
            Open your MCP config JSON file
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-indigo-600 dark:text-indigo-400 mt-0.5 font-bold">2.</span>
          <span>
            Paste it into DevBolt&apos;s{" "}
            <Link href="/tools/token-counter" className="text-indigo-600 underline hover:text-indigo-500 dark:text-indigo-400">
              LLM Token Counter
            </Link>{" "}
            to see the raw config size
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-indigo-600 dark:text-indigo-400 mt-0.5 font-bold">3.</span>
          <span>
            Multiply by <strong>3-5x</strong> for the actual system prompt
            injection — the AI client expands each server definition into full
            tool schemas with parameter descriptions
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-indigo-600 dark:text-indigo-400 mt-0.5 font-bold">4.</span>
          <span>
            Multiply by your average messages per session to get the total
            per-session token cost
          </span>
        </li>
      </ol>

      <Callout>
        Rule of thumb: each MCP server adds roughly <strong>200-1,500 tokens</strong>{" "}
        of tool definitions to every prompt (depending on how many tools it
        exposes). A filesystem server with 5 tools is on the low end; a GitHub
        server with 20+ tools is on the high end.
      </Callout>

      {/* ── Optimization Strategies ── */}
      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Step 3: Optimize Your Configuration
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Here are five practical strategies to reduce MCP context waste, ranked by
        impact:
      </p>

      <h3 className="mt-8 mb-3 text-lg font-semibold text-gray-900 dark:text-white">
        1. Remove servers you don&apos;t use weekly
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        The single highest-impact change. Most developers enable servers when
        they first discover MCP and never clean up. If you haven&apos;t used the
        Slack or Google Drive server in weeks, remove it. You can always add it
        back in 30 seconds.
      </p>

      <CodeBlock title="Optimized config: Only what you need">
{`{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/dev/projects"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_TOKEN": "ghp_..." }
    }
  }
}`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-lg font-semibold text-gray-900 dark:text-white">
        2. Use project-specific configs instead of global
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Instead of one massive global config, use per-project configs. VS Code
        supports this natively with <Code>.vscode/mcp.json</Code>. For Claude
        Code, use <Code>.claude/settings.local.json</Code> in the project root.
        Your backend project gets the PostgreSQL server; your frontend project
        gets just the filesystem server.
      </p>

      <CodeBlock title=".vscode/mcp.json — Frontend project (minimal)">
{`{
  "servers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "."]
    }
  }
}`}
      </CodeBlock>

      <CodeBlock title=".vscode/mcp.json — Backend project (database tools)">
{`{
  "servers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "."]
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://localhost:5432/mydb"]
    }
  }
}`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-lg font-semibold text-gray-900 dark:text-white">
        3. Write concise tool descriptions for custom servers
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        If you&apos;re building custom MCP servers, keep tool descriptions to one
        sentence. A 200-word description wastes tokens on every single prompt.
        The AI model only needs enough context to decide <em>when</em> to use
        the tool and <em>what parameters</em> to pass.
      </p>

      <CodeBlock title="Good vs. bad tool descriptions">
{`// BAD: 50+ tokens wasted
{
  "name": "query_database",
  "description": "Execute a SQL query against the PostgreSQL database. This tool
    connects to the configured database and runs any valid SQL statement including
    SELECT, INSERT, UPDATE, DELETE. Results are returned as JSON arrays. The tool
    handles connection pooling, query timeouts, and error formatting automatically.
    Use this for any database operation."
}

// GOOD: 15 tokens, equally effective
{
  "name": "query_database",
  "description": "Execute a SQL query and return results as JSON."
}`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-lg font-semibold text-gray-900 dark:text-white">
        4. Consolidate overlapping servers
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        If you have separate MCP servers for PostgreSQL and SQLite, and you only
        use one database at a time, only enable the one you need. Similarly, if
        you have both the Brave Search server and a custom web scraping server,
        pick one per session.
      </p>

      <h3 className="mt-8 mb-3 text-lg font-semibold text-gray-900 dark:text-white">
        5. Monitor context window usage
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Claude Code shows token usage in the status bar. Cursor shows it in the
        chat panel. Watch for sessions where you hit the context limit
        unexpectedly — MCP tool bloat is often the cause. If you&apos;re
        hitting limits in conversations that used to work fine, audit your MCP
        config first.
      </p>

      {/* ── The Perplexity CTO Controversy ── */}
      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Why MCP Context Matters Now: The Perplexity CTO Debate
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        In early 2026, Perplexity&apos;s CTO publicly questioned whether MCP&apos;s
        architecture was fundamentally wasteful — arguing that injecting tool
        schemas into every prompt was an inefficient design that would not scale
        as AI agents gained more capabilities. The debate highlighted a real
        tension in the MCP ecosystem: tool richness vs. context efficiency.
      </p>
      <p className="mt-4 text-gray-600 dark:text-gray-400">
        Proponents of MCP argue that the token cost is acceptable because tool
        definitions are cached in KV cache after the first message, reducing
        the actual per-message cost to near zero for subsequent turns. Critics
        counter that the first-message cost still matters, and that the
        definitions consume <em>context window space</em> regardless of caching
        — space that could be used for more code, more files, and more
        conversation history.
      </p>
      <p className="mt-4 text-gray-600 dark:text-gray-400">
        The practical answer is to be intentional about which servers you enable.
        MCP is powerful, but like any tool, it has a cost. The optimization
        strategies above help you get the benefits of MCP without paying an
        unnecessary context tax.
      </p>

      {/* ── Common Mistakes ── */}
      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        5 Common MCP Config Mistakes
      </h2>
      <ol className="mt-4 space-y-4 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-2">
          <span className="text-red-500 mt-0.5 font-bold">1.</span>
          <span>
            <strong className="text-gray-900 dark:text-white">
              Enabling every server &quot;just in case&quot;
            </strong>{" "}
            — Each server has a token cost even when unused. Only enable what
            you&apos;ll use this session.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-red-500 mt-0.5 font-bold">2.</span>
          <span>
            <strong className="text-gray-900 dark:text-white">
              Hardcoding secrets in the config file
            </strong>{" "}
            — Use environment variables (<Code>GITHUB_TOKEN</Code>) instead of
            pasting tokens directly. Your MCP config may end up in version
            control.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-red-500 mt-0.5 font-bold">3.</span>
          <span>
            <strong className="text-gray-900 dark:text-white">
              Running database servers with production credentials
            </strong>{" "}
            — AI agents can execute arbitrary SQL. Always use read-only
            credentials or a development database.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-red-500 mt-0.5 font-bold">4.</span>
          <span>
            <strong className="text-gray-900 dark:text-white">
              Not restarting after config changes
            </strong>{" "}
            — Most clients require a restart to pick up MCP config changes.
            Claude Desktop, Cursor, and Windsurf all need a fresh start.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-red-500 mt-0.5 font-bold">5.</span>
          <span>
            <strong className="text-gray-900 dark:text-white">
              Ignoring npx startup time
            </strong>{" "}
            — <Code>npx -y</Code> downloads the server package on first run,
            which can take 10-30 seconds. Install globally ({" "}
            <Code>npm install -g</Code>) for instant startup.
          </span>
        </li>
      </ol>

      {/* ── Quick Reference ── */}
      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        MCP Server Token Cost Quick Reference
      </h2>
      <p className="mb-4 text-gray-600 dark:text-gray-400">
        Approximate token cost per server, added to every prompt:
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800">
              <th className="px-4 py-2 text-left font-semibold text-gray-900 dark:text-white">Server</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-900 dark:text-white">Tools</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-900 dark:text-white">~Tokens</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-900 dark:text-white">Impact</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
            <tr>
              <td className="px-4 py-2 text-gray-700 dark:text-gray-300">Filesystem</td>
              <td className="px-4 py-2 text-gray-600 dark:text-gray-400">5</td>
              <td className="px-4 py-2 text-gray-600 dark:text-gray-400">~400</td>
              <td className="px-4 py-2"><span className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900 dark:text-green-300">Low</span></td>
            </tr>
            <tr>
              <td className="px-4 py-2 text-gray-700 dark:text-gray-300">Memory</td>
              <td className="px-4 py-2 text-gray-600 dark:text-gray-400">3</td>
              <td className="px-4 py-2 text-gray-600 dark:text-gray-400">~250</td>
              <td className="px-4 py-2"><span className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900 dark:text-green-300">Low</span></td>
            </tr>
            <tr>
              <td className="px-4 py-2 text-gray-700 dark:text-gray-300">PostgreSQL</td>
              <td className="px-4 py-2 text-gray-600 dark:text-gray-400">5</td>
              <td className="px-4 py-2 text-gray-600 dark:text-gray-400">~500</td>
              <td className="px-4 py-2"><span className="rounded bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">Medium</span></td>
            </tr>
            <tr>
              <td className="px-4 py-2 text-gray-700 dark:text-gray-300">GitHub</td>
              <td className="px-4 py-2 text-gray-600 dark:text-gray-400">20+</td>
              <td className="px-4 py-2 text-gray-600 dark:text-gray-400">~1,500</td>
              <td className="px-4 py-2"><span className="rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900 dark:text-red-300">High</span></td>
            </tr>
            <tr>
              <td className="px-4 py-2 text-gray-700 dark:text-gray-300">Puppeteer</td>
              <td className="px-4 py-2 text-gray-600 dark:text-gray-400">8</td>
              <td className="px-4 py-2 text-gray-600 dark:text-gray-400">~800</td>
              <td className="px-4 py-2"><span className="rounded bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">Medium</span></td>
            </tr>
            <tr>
              <td className="px-4 py-2 text-gray-700 dark:text-gray-300">Brave Search</td>
              <td className="px-4 py-2 text-gray-600 dark:text-gray-400">2</td>
              <td className="px-4 py-2 text-gray-600 dark:text-gray-400">~200</td>
              <td className="px-4 py-2"><span className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900 dark:text-green-300">Low</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      <AffiliateBox>
        <strong>Running MCP servers in production?</strong> Use{" "}
        <a
          href="https://www.digitalocean.com/?refcode=placeholder&utm_campaign=Referral_Invite&utm_medium=Referral_Program"
          target="_blank"
          rel="noopener sponsored"
          className="font-medium text-blue-700 underline hover:text-blue-600 dark:text-blue-300 dark:hover:text-blue-200"
        >
          DigitalOcean
        </a>{" "}
        for dedicated MCP server hosting with predictable pricing. Deploy
        Node.js MCP servers on App Platform or Droplets starting at $4/mo.
      </AffiliateBox>

      {/* ── FAQ ── */}
      <h2 className="mt-12 mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
        Frequently Asked Questions
      </h2>

      <div className="space-y-6">
        <div>
          <h3 className="font-medium text-gray-900 dark:text-white mb-2">
            Does MCP really affect context window size?
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Yes. MCP tool definitions are injected into the system prompt, which
            counts against your context window. With Claude&apos;s 200K context
            window, 10,000 tokens of tool definitions is 5% of your available
            space — space that could hold roughly 30 pages of code instead.
          </p>
        </div>

        <div>
          <h3 className="font-medium text-gray-900 dark:text-white mb-2">
            Are tool definitions cached between messages?
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Anthropic&apos;s API supports prompt caching, and tool definitions
            at the start of the system prompt are good candidates for caching.
            This reduces the token <em>cost</em> (you pay less) but not the
            context <em>space</em> (they still occupy the window). In practice,
            reducing the number of tools still frees up context for more code
            and conversation.
          </p>
        </div>

        <div>
          <h3 className="font-medium text-gray-900 dark:text-white mb-2">
            Can I dynamically enable/disable MCP servers mid-conversation?
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Not yet in most clients. Claude Desktop and Cursor require a restart
            to pick up config changes. Claude Code can reload MCP servers within
            a session using <Code>/mcp</Code>. This limitation is why
            project-specific configs are more practical than dynamic toggling.
          </p>
        </div>

        <div>
          <h3 className="font-medium text-gray-900 dark:text-white mb-2">
            What&apos;s the optimal number of MCP servers?
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            There&apos;s no fixed number, but 2-4 servers per project is a good
            target. One for file access, one for version control, and one or two
            for project-specific needs (database, deployment). Beyond 5 servers,
            the context cost becomes noticeable and the AI may struggle to choose
            the right tool.
          </p>
        </div>

        <div>
          <h3 className="font-medium text-gray-900 dark:text-white mb-2">
            How do I build my MCP config file?
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            DevBolt&apos;s{" "}
            <Link href="/tools/mcp-config-builder" className="text-indigo-600 underline hover:text-indigo-500 dark:text-indigo-400">
              MCP Config Builder
            </Link>{" "}
            lets you visually compose your config with 16 server templates across
            5 client formats. Pick your client, add only the servers you need,
            configure environment variables, and download the config file. All
            processing happens in your browser.
          </p>
        </div>
      </div>
    </>
  );
}
