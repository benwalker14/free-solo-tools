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

export default function MarkdownCheatSheet() {
  return (
    <>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        Markdown is a lightweight markup language used in GitHub READMEs, docs
        sites, blogs, Slack messages, and more. This cheat sheet covers every
        syntax element you&apos;ll need — from basic formatting to tables, task
        lists, and extended features.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Headings
      </h2>
      <CodeBlock title="Markdown">
        {`# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6`}
      </CodeBlock>
      <p className="text-gray-600 dark:text-gray-400">
        Always put a space after the <Code>#</Code>. Most style guides
        recommend using only one <Code># Heading 1</Code> per document (the
        title), then <Code>##</Code> for sections.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Text Formatting
      </h2>
      <CodeBlock title="Markdown">
        {`**bold text**
*italic text*
***bold and italic***
~~strikethrough~~
\`inline code\`

> This is a blockquote.
> It can span multiple lines.`}
      </CodeBlock>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Links and Images
      </h2>
      <CodeBlock title="Markdown">
        {`[Link text](https://example.com)
[Link with title](https://example.com "Hover text")

![Alt text](image.png)
![Alt text](image.png "Image title")

<!-- Reference-style links (useful for repeated URLs) -->
[DevBolt][1] is a collection of [free tools][1].

[1]: https://devbolt.dev`}
      </CodeBlock>
      <p className="text-gray-600 dark:text-gray-400">
        Reference-style links keep your Markdown readable when the same URL
        appears multiple times.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Lists
      </h2>
      <CodeBlock title="Markdown">
        {`<!-- Unordered lists (use -, *, or +) -->
- Item one
- Item two
  - Nested item
  - Another nested item
- Item three

<!-- Ordered lists -->
1. First item
2. Second item
3. Third item

<!-- The numbers don't matter — Markdown auto-numbers -->
1. First
1. Second
1. Third`}
      </CodeBlock>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Task Lists
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Supported by GitHub, GitLab, and most Markdown renderers:
      </p>
      <CodeBlock title="Markdown">
        {`- [x] Write the README
- [x] Add installation instructions
- [ ] Write contributing guidelines
- [ ] Add changelog`}
      </CodeBlock>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Code Blocks
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Use triple backticks with a language identifier for syntax highlighting:
      </p>
      <CodeBlock title="Markdown">
        {`\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

\`\`\`python
def greet(name):
    return f"Hello, {name}!"
\`\`\`

\`\`\`bash
npm install && npm run dev
\`\`\``}
      </CodeBlock>
      <p className="text-gray-600 dark:text-gray-400">
        Common language identifiers: <Code>javascript</Code>, <Code>typescript</Code>,{" "}
        <Code>python</Code>, <Code>go</Code>, <Code>rust</Code>, <Code>bash</Code>,{" "}
        <Code>sql</Code>, <Code>json</Code>, <Code>yaml</Code>, <Code>css</Code>,{" "}
        <Code>html</Code>, <Code>diff</Code>.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Tables
      </h2>
      <CodeBlock title="Markdown">
        {`| Feature    | Free  | Pro   |
| ---------- | ----- | ----- |
| Tools      | All   | All   |
| API Access | No    | Yes   |
| Support    | Forum | Email |

<!-- Column alignment -->
| Left   | Center  | Right  |
| :----- | :-----: | -----: |
| text   |  text   |   text |`}
      </CodeBlock>
      <p className="text-gray-600 dark:text-gray-400">
        Table alignment uses colons: <Code>:---</Code> for left, <Code>:---:</Code>{" "}
        for center, <Code>---:</Code> for right. Building tables by hand is
        tedious — use our{" "}
        <Link
          href="/tools/markdown-table"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          Markdown Table Generator
        </Link>{" "}
        to create them visually.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Horizontal Rules
      </h2>
      <CodeBlock title="Markdown">
        {`---
***
___

(Three or more hyphens, asterisks, or underscores)`}
      </CodeBlock>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Escaping Characters
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Prefix special characters with a backslash to display them literally:
      </p>
      <CodeBlock title="Markdown">
        {`\\* Not italic \\*
\\# Not a heading
\\[Not a link\\](not-a-url)
\\\`Not code\\\`

Special characters you can escape:
\\  \`  *  _  {}  []  ()  #  +  -  .  !  |`}
      </CodeBlock>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        GitHub-Flavored Markdown (GFM)
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        GitHub extends standard Markdown with several features:
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Autolinks
      </h3>
      <CodeBlock title="Markdown">
        {`<!-- URLs and emails are automatically linked -->
https://devbolt.dev
user@example.com

<!-- Issue and PR references -->
#123
org/repo#456`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Alerts / Callouts
      </h3>
      <CodeBlock title="Markdown">
        {`> [!NOTE]
> Useful background information.

> [!TIP]
> Helpful advice for better results.

> [!IMPORTANT]
> Key information users should know.

> [!WARNING]
> Potential issues to be aware of.

> [!CAUTION]
> Risks of certain actions.`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Footnotes
      </h3>
      <CodeBlock title="Markdown">
        {`Here is a statement that needs a citation.[^1]

And another one with a named footnote.[^note]

[^1]: This is the footnote content.
[^note]: Named footnotes work too.`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Collapsed Sections
      </h3>
      <CodeBlock title="Markdown (HTML)">
        {`<details>
<summary>Click to expand</summary>

Hidden content goes here.
You can use **Markdown** inside.

\`\`\`js
console.log("Even code blocks work!");
\`\`\`

</details>`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Mermaid Diagrams
      </h3>
      <CodeBlock title="Markdown">
        {`\`\`\`mermaid
graph LR
  A[Start] --> B{Decision}
  B -->|Yes| C[Do thing]
  B -->|No| D[Skip]
  C --> E[End]
  D --> E
\`\`\``}
      </CodeBlock>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        README Best Practices
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        A good README should include these sections:
      </p>
      <ol className="mt-4 space-y-3 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-3">
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
            1
          </span>
          <span>
            <strong className="text-gray-900 dark:text-white">Title and description</strong> — what the project does in one sentence.
          </span>
        </li>
        <li className="flex items-start gap-3">
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
            2
          </span>
          <span>
            <strong className="text-gray-900 dark:text-white">Installation</strong> — how to get it running locally.
          </span>
        </li>
        <li className="flex items-start gap-3">
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
            3
          </span>
          <span>
            <strong className="text-gray-900 dark:text-white">Usage</strong> — a quick example or screenshot.
          </span>
        </li>
        <li className="flex items-start gap-3">
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
            4
          </span>
          <span>
            <strong className="text-gray-900 dark:text-white">API / Configuration</strong> — if applicable.
          </span>
        </li>
        <li className="flex items-start gap-3">
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
            5
          </span>
          <span>
            <strong className="text-gray-900 dark:text-white">Contributing</strong> — how others can help.
          </span>
        </li>
        <li className="flex items-start gap-3">
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
            6
          </span>
          <span>
            <strong className="text-gray-900 dark:text-white">License</strong> — always include one.
          </span>
        </li>
      </ol>
      <p className="mt-4 text-gray-600 dark:text-gray-400">
        Our{" "}
        <Link
          href="/tools/readme-generator"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          README Generator
        </Link>{" "}
        can scaffold a complete README with all these sections in seconds.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Common Mistakes
      </h2>
      <ul className="space-y-4 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Missing blank lines.</strong>{" "}
            Headings, code blocks, lists, and blockquotes need a blank line
            before them. Without it, many parsers won&apos;t render them
            correctly.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Broken reference links.</strong>{" "}
            If you use <Code>[text][ref]</Code> but forget the{" "}
            <Code>[ref]: url</Code> definition at the bottom, the link
            won&apos;t render.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Inconsistent list markers.</strong>{" "}
            Mixing <Code>-</Code>, <Code>*</Code>, and <Code>+</Code> in the
            same list is valid but looks messy. Pick one and stick with it.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Forgetting image alt text.</strong>{" "}
            <Code>![](image.png)</Code> works but is bad for accessibility.
            Always describe the image: <Code>![Screenshot of dashboard](image.png)</Code>.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">No language on code fences.</strong>{" "}
            Always specify the language after the backticks (<Code>```js</Code>)
            for proper syntax highlighting.
          </span>
        </li>
      </ul>

      <div className="my-12 rounded-xl border border-blue-200 bg-blue-50/50 p-6 dark:border-blue-900 dark:bg-blue-950/30">
        <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">
          Building a docs site or blog with Markdown?
        </p>
        <p className="mt-2 text-sm text-blue-800 dark:text-blue-400">
          <a
            href="https://www.netlify.com/"
            target="_blank"
            rel="noopener sponsored"
            className="font-medium underline hover:no-underline"
          >
            Netlify
          </a>{" "}
          deploys static sites from Git with free SSL, global CDN, and instant
          rollbacks. Works great with Docusaurus, Jekyll, Hugo, and any
          Markdown-based static site generator.
        </p>
      </div>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Try It Yourself
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Use our{" "}
        <Link
          href="/tools/markdown-preview"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          Markdown Preview
        </Link>{" "}
        to write and preview Markdown in real time. Need to create a table? The{" "}
        <Link
          href="/tools/markdown-table"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          Markdown Table Generator
        </Link>{" "}
        builds them visually. And if you&apos;re converting between HTML and
        Markdown, try the{" "}
        <Link
          href="/tools/html-markdown"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          HTML ↔ Markdown Converter
        </Link>
        .
      </p>
    </>
  );
}
