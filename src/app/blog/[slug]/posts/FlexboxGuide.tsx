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

export default function FlexboxGuide() {
  return (
    <>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        CSS Flexbox is the most widely used layout system in modern web
        development. Whether you&apos;re centering a div, building a navbar, or
        creating a responsive card grid, Flexbox handles it with a few lines of
        CSS. This guide covers everything you need, with practical examples
        you&apos;ll actually use.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        The Two Axes
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Flexbox works along two axes. Understanding these is the key to
        understanding everything else:
      </p>
      <ul className="mt-4 space-y-2 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Main axis</strong>{" "}
            — the direction items flow. Horizontal by default (<Code>row</Code>
            ), or vertical with <Code>flex-direction: column</Code>.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Cross axis</strong>{" "}
            — perpendicular to the main axis. If items flow horizontally, the
            cross axis is vertical, and vice versa.
          </span>
        </li>
      </ul>
      <p className="mt-4 text-gray-600 dark:text-gray-400">
        Every Flexbox property either controls layout along the main axis or
        the cross axis. Once you internalize this mental model, the entire
        system clicks.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Getting Started: The Container
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Add <Code>display: flex</Code> to a parent element, and its direct
        children become flex items:
      </p>
      <CodeBlock title="CSS">
        {`.container {
  display: flex;
}

/* Items now sit in a row, taking their natural width */`}
      </CodeBlock>
      <p className="text-gray-600 dark:text-gray-400">
        That single line changes the layout from block (stacked vertically) to
        flex (side by side). From here, you add properties to control
        direction, alignment, spacing, and wrapping.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Container Properties
      </h2>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        flex-direction
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Controls the main axis direction:
      </p>
      <CodeBlock title="CSS">
        {`flex-direction: row;            /* → left to right (default) */
flex-direction: row-reverse;    /* ← right to left */
flex-direction: column;         /* ↓ top to bottom */
flex-direction: column-reverse; /* ↑ bottom to top */`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        justify-content (main axis)
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Distributes items along the main axis:
      </p>
      <CodeBlock title="CSS">
        {`justify-content: flex-start;    /* pack items to the start */
justify-content: flex-end;      /* pack items to the end */
justify-content: center;        /* center items */
justify-content: space-between; /* equal space between items */
justify-content: space-around;  /* equal space around items */
justify-content: space-evenly;  /* truly equal spacing */`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        align-items (cross axis)
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Aligns items along the cross axis:
      </p>
      <CodeBlock title="CSS">
        {`align-items: stretch;    /* fill the container height (default) */
align-items: flex-start; /* align to the top */
align-items: flex-end;   /* align to the bottom */
align-items: center;     /* center vertically */
align-items: baseline;   /* align text baselines */`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        gap
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        The modern way to add spacing between flex items. No more margin hacks:
      </p>
      <CodeBlock title="CSS">
        {`gap: 16px;           /* equal row and column gap */
gap: 16px 24px;      /* row-gap column-gap */
row-gap: 16px;       /* vertical gap only */
column-gap: 24px;    /* horizontal gap only */`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        flex-wrap
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        By default, flex items try to fit on one line. Enable wrapping for
        responsive layouts:
      </p>
      <CodeBlock title="CSS">
        {`flex-wrap: nowrap; /* all items on one line (default) */
flex-wrap: wrap;   /* items wrap to next line */`}
      </CodeBlock>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Item Properties
      </h2>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        flex-grow, flex-shrink, flex-basis
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        These three properties control how items size themselves. The shorthand{" "}
        <Code>flex</Code> is the recommended way to set them:
      </p>
      <CodeBlock title="CSS">
        {`/* flex: <grow> <shrink> <basis> */
flex: 0 1 auto;  /* default — don't grow, can shrink, natural width */
flex: 1;         /* grow to fill available space */
flex: 1 1 0;     /* grow equally, ignore content width */
flex: 0 0 200px; /* fixed 200px, don't grow or shrink */`}
      </CodeBlock>
      <p className="text-gray-600 dark:text-gray-400">
        When multiple items have <Code>flex: 1</Code>, they share the available
        space equally. Give one item <Code>flex: 2</Code> and it takes twice as
        much space as the others.
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        align-self
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Override the container&apos;s <Code>align-items</Code> for a single item:
      </p>
      <CodeBlock title="CSS">
        {`.special-item {
  align-self: flex-end; /* this item sits at the bottom */
}`}
      </CodeBlock>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Common Patterns
      </h2>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        1. Center Anything
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        The most common Flexbox use case — centering both horizontally and
        vertically:
      </p>
      <CodeBlock title="CSS">
        {`.center-it {
  display: flex;
  justify-content: center; /* horizontal */
  align-items: center;     /* vertical */
  min-height: 100vh;       /* or whatever height you need */
}`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        2. Navigation Bar
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Logo on the left, links on the right:
      </p>
      <CodeBlock title="CSS">
        {`.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  height: 64px;
}`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        3. Responsive Card Grid
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Cards that wrap and fill available space:
      </p>
      <CodeBlock title="CSS">
        {`.card-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}

.card {
  flex: 1 1 300px; /* grow, shrink, min 300px before wrapping */
  /* Cards fill the row, wrapping when they can't fit */
}`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        4. Sticky Footer
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Footer sticks to the bottom even when content is short:
      </p>
      <CodeBlock title="CSS">
        {`.page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content {
  flex: 1; /* takes all available space, pushing footer down */
}

.footer {
  /* naturally sits at the bottom */
}`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        5. Holy Grail Layout
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Header, footer, sidebar, and main content:
      </p>
      <CodeBlock title="CSS">
        {`.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.body {
  display: flex;
  flex: 1;
}

.sidebar { flex: 0 0 250px; }
.main    { flex: 1; }

/* On mobile, stack vertically */
@media (max-width: 768px) {
  .body { flex-direction: column; }
  .sidebar { flex-basis: auto; }
}`}
      </CodeBlock>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Flexbox vs Grid: When to Use Which
      </h2>
      <p className="mb-4 text-gray-600 dark:text-gray-400">
        They&apos;re complementary, not competing. Here&apos;s the simple rule:
      </p>
      <ul className="space-y-2 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Flexbox</strong>{" "}
            — one-dimensional layout. Use for navbars, button groups, card rows,
            centering, and any layout that flows in a single direction.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Grid</strong>{" "}
            — two-dimensional layout. Use for page-level layouts, dashboards,
            image galleries, and anything that needs rows and columns
            simultaneously.
          </span>
        </li>
      </ul>
      <p className="mt-4 text-gray-600 dark:text-gray-400">
        In practice, most layouts use both: Grid for the page structure, Flexbox
        for the components inside it.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Quick Reference
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800">
              <th className="py-3 pr-4 text-left font-semibold text-gray-900 dark:text-white">
                Property
              </th>
              <th className="py-3 pr-4 text-left font-semibold text-gray-900 dark:text-white">
                Applied To
              </th>
              <th className="py-3 text-left font-semibold text-gray-900 dark:text-white">
                What It Does
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-600 dark:text-gray-400">
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4"><Code>display: flex</Code></td>
              <td className="py-3 pr-4">Container</td>
              <td className="py-3">Enables Flexbox</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4"><Code>flex-direction</Code></td>
              <td className="py-3 pr-4">Container</td>
              <td className="py-3">Sets main axis direction</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4"><Code>justify-content</Code></td>
              <td className="py-3 pr-4">Container</td>
              <td className="py-3">Main axis alignment</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4"><Code>align-items</Code></td>
              <td className="py-3 pr-4">Container</td>
              <td className="py-3">Cross axis alignment</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4"><Code>gap</Code></td>
              <td className="py-3 pr-4">Container</td>
              <td className="py-3">Space between items</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4"><Code>flex-wrap</Code></td>
              <td className="py-3 pr-4">Container</td>
              <td className="py-3">Allow items to wrap</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4"><Code>flex</Code></td>
              <td className="py-3 pr-4">Item</td>
              <td className="py-3">Grow/shrink/basis shorthand</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4"><Code>align-self</Code></td>
              <td className="py-3 pr-4">Item</td>
              <td className="py-3">Override cross axis alignment</td>
            </tr>
            <tr>
              <td className="py-3 pr-4"><Code>order</Code></td>
              <td className="py-3 pr-4">Item</td>
              <td className="py-3">Visual reordering</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="my-12 rounded-xl border border-blue-200 bg-blue-50/50 p-6 dark:border-blue-900 dark:bg-blue-950/30">
        <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">
          Deploy your layouts instantly
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
          deploys frontend sites from Git with automatic builds, preview
          deploys for every PR, and a free tier that covers most projects.
          Connect your repo and your Flexbox layouts go live on every push.
        </p>
      </div>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Build Layouts Visually
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Use our{" "}
        <Link
          href="/tools/flexbox-generator"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          CSS Flexbox Generator
        </Link>{" "}
        to visually experiment with every Flexbox property and instantly get the
        CSS code. Or try the{" "}
        <Link
          href="/tools/grid-generator"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          CSS Grid Generator
        </Link>{" "}
        for two-dimensional layouts. Both tools run entirely in your browser
        with no signup required.
      </p>
    </>
  );
}
