"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { marked } from "marked";

const SAMPLE_MARKDOWN = `# Hello, Markdown!

This is a **live preview** editor. Start typing on the left to see rendered output here.

## Features

- **Bold** and *italic* text
- [Links](https://example.com)
- Inline \`code\` and code blocks
- Lists, blockquotes, and more

### Code Block

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

> Blockquotes work too. This is great for documentation.

| Feature | Status |
|---------|--------|
| Headings | Supported |
| Lists | Supported |
| Tables | Supported |
`;

export default function MarkdownPreviewTool() {
  const [input, setInput] = useState(SAMPLE_MARKDOWN);

  const html = useMemo(() => {
    try {
      return marked.parse(input, { async: false }) as string;
    } catch {
      return "<p>Error rendering markdown</p>";
    }
  }, [input]);

  function handleCopyHtml() {
    navigator.clipboard.writeText(html);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="mb-8 block text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        &larr; Back to tools
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Markdown Preview
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Write Markdown on the left, see the rendered preview on the right.
      </p>

      <div className="mb-3 flex items-center justify-end gap-2">
        <button
          onClick={() => setInput("")}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          Clear
        </button>
        <button
          onClick={handleCopyHtml}
          className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-700"
        >
          Copy HTML
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Markdown
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your Markdown here..."
            className="h-[500px] w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 font-mono text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-600"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Preview
          </label>
          <div
            className="prose prose-sm dark:prose-invert max-w-none h-[500px] overflow-auto rounded-lg border border-gray-300 bg-white px-6 py-4 dark:border-gray-700 dark:bg-gray-900"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
    </div>
  );
}
