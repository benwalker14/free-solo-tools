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

export default function FlexboxVsGrid() {
  return (
    <>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        CSS Flexbox and Grid are both layout systems, but they solve different
        problems. Flexbox handles one-dimensional layouts (rows or columns).
        Grid handles two-dimensional layouts (rows <em>and</em> columns at the
        same time). This guide covers when to use each, how they differ, and
        how to combine them.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Quick Comparison
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800">
              <th className="py-3 pr-4 text-left font-semibold text-gray-900 dark:text-white">
                Feature
              </th>
              <th className="py-3 pr-4 text-left font-semibold text-gray-900 dark:text-white">
                Flexbox
              </th>
              <th className="py-3 text-left font-semibold text-gray-900 dark:text-white">
                Grid
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-600 dark:text-gray-400">
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Layout model</td>
              <td className="py-3 pr-4">One-dimensional (row or column)</td>
              <td className="py-3">Two-dimensional (rows and columns)</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Content vs layout</td>
              <td className="py-3 pr-4">Content-first (items size themselves)</td>
              <td className="py-3">Layout-first (grid defines the structure)</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Alignment</td>
              <td className="py-3 pr-4">Main axis + cross axis</td>
              <td className="py-3">Row axis + column axis + area placement</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Gaps</td>
              <td className="py-3 pr-4"><Code>gap</Code></td>
              <td className="py-3"><Code>row-gap</Code>, <Code>column-gap</Code>, <Code>gap</Code></td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Item placement</td>
              <td className="py-3 pr-4">Source order (or <Code>order</Code>)</td>
              <td className="py-3">Explicit line numbers, named areas, <Code>span</Code></td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Wrapping</td>
              <td className="py-3 pr-4"><Code>flex-wrap</Code> (new rows lose alignment)</td>
              <td className="py-3">Implicit rows/columns maintain grid tracks</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Browser support</td>
              <td className="py-3 pr-4">98%+ (since 2015)</td>
              <td className="py-3">97%+ (since 2017)</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Best for</td>
              <td className="py-3 pr-4">Navbars, button groups, centering</td>
              <td className="py-3">Page layouts, dashboards, card grids</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Flexbox: One Direction at a Time
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Flexbox lays out items along a single axis. You choose the direction
        with <Code>flex-direction</Code> — either <Code>row</Code> (horizontal)
        or <Code>column</Code> (vertical). Items distribute themselves along
        that axis based on their content size and flex properties.
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Classic Navbar
      </h3>
      <CodeBlock title="CSS">
        {`.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
}

/* Items naturally size to their content
   and distribute along the main axis */`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Centering (the reason Flexbox exists)
      </h3>
      <CodeBlock title="CSS">
        {`.center-both {
  display: flex;
  justify-content: center;  /* horizontal */
  align-items: center;      /* vertical */
  min-height: 100vh;
}`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Key Flex Properties
      </h3>
      <CodeBlock title="CSS">
        {`.item {
  flex-grow: 1;    /* Take up available space */
  flex-shrink: 0;  /* Don't shrink below basis */
  flex-basis: 200px; /* Starting size */

  /* Shorthand: */
  flex: 1 0 200px;
}`}
      </CodeBlock>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Grid: Rows and Columns Together
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        CSS Grid defines a two-dimensional layout on the container. You declare
        rows and columns, then place items into the resulting cells. The grid
        structure exists independently of the content — items slot into it.
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Responsive Card Grid
      </h3>
      <CodeBlock title="CSS">
        {`.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

/* Cards automatically wrap to new rows
   and stay aligned in a proper grid */`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Dashboard Layout with Named Areas
      </h3>
      <CodeBlock title="CSS">
        {`.dashboard {
  display: grid;
  grid-template-areas:
    "header  header"
    "sidebar main"
    "footer  footer";
  grid-template-columns: 250px 1fr;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}

.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main    { grid-area: main; }
.footer  { grid-area: footer; }`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Spanning Rows and Columns
      </h3>
      <CodeBlock title="CSS">
        {`.featured {
  grid-column: span 2;  /* Take up 2 columns */
  grid-row: span 2;     /* Take up 2 rows */
}

.sidebar {
  grid-column: 3;       /* Place in column 3 */
  grid-row: 1 / -1;     /* Span all rows */
}`}
      </CodeBlock>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        The Wrapping Problem
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        This is where the real difference shows. When Flexbox items wrap with{" "}
        <Code>flex-wrap: wrap</Code>, each row is independent — items in
        row 2 don&apos;t align with items in row 1. Grid maintains column
        alignment across all rows because the tracks are defined on the
        container, not the items.
      </p>
      <CodeBlock title="Flexbox wrapping — columns DON'T align">
        {`.flex-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.flex-cards > * {
  flex: 1 1 300px;
  /* If 2 items land in the last row, they stretch
     to fill the space — NOT aligned to the grid above */
}`}
      </CodeBlock>
      <CodeBlock title="Grid wrapping — columns DO align">
        {`.grid-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  /* Items always align to the same column tracks,
     regardless of how many are in the last row */
}`}
      </CodeBlock>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        When to Use Flexbox
      </h2>
      <ul className="mt-4 space-y-3 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Navigation bars</strong>{" "}
            — horizontal lists of links with flexible spacing.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Button groups and toolbars</strong>{" "}
            — items that need even spacing in a single row.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Centering content</strong>{" "}
            — the fastest way to center anything horizontally and vertically.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Content-driven layouts</strong>{" "}
            — when items should size based on their content, not a predefined grid.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Reordering within a single axis</strong>{" "}
            — the <Code>order</Code> property makes it easy to rearrange items
            without changing HTML.
          </span>
        </li>
      </ul>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        When to Use Grid
      </h2>
      <ul className="mt-4 space-y-3 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Page layouts</strong>{" "}
            — header, sidebar, main, footer arrangements.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Card grids</strong>{" "}
            — when items should maintain column alignment across rows.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Dashboards</strong>{" "}
            — complex layouts with items spanning multiple rows or columns.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Form layouts</strong>{" "}
            — label/input pairs that need consistent column alignment.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Overlapping elements</strong>{" "}
            — Grid allows items to occupy the same cell, useful for image
            overlays and stacking without <Code>position: absolute</Code>.
          </span>
        </li>
      </ul>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Using Them Together
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        The best layouts combine both. Use Grid for the overall page structure
        and Flexbox for components within grid cells.
      </p>
      <CodeBlock title="CSS">
        {`/* Grid for the page layout */
.page {
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}

/* Flexbox for the header inside the grid */
.header {
  grid-column: 1 / -1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
}

/* Grid for the card section inside main */
.card-section {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

/* Flexbox inside each card */
.card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}`}
      </CodeBlock>

      <div className="my-12 rounded-xl border border-blue-200 bg-blue-50/50 p-6 dark:border-blue-900 dark:bg-blue-950/30">
        <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">
          Deploying CSS-heavy applications?
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
          deploys your frontend instantly with automatic HTTPS, CDN, and
          preview deploys for every pull request — perfect for testing
          responsive layouts.
        </p>
      </div>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Common Mistakes
      </h2>
      <ul className="space-y-4 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">
              Using Flexbox for card grids.
            </strong>{" "}
            Wrapped Flexbox items don&apos;t maintain column alignment. Switch to{" "}
            <Code>grid</Code> with <Code>auto-fill</Code>/<Code>minmax()</Code>.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">
              Using Grid for simple centering.
            </strong>{" "}
            While <Code>place-items: center</Code> works,{" "}
            <Code>display: flex</Code> with <Code>justify-content</Code> and{" "}
            <Code>align-items</Code> is more intuitive for single-element centering.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">
              Forgetting <Code>min-width: 0</Code> in Flexbox.
            </strong>{" "}
            Flex items default to <Code>min-width: auto</Code>, which prevents
            them from shrinking below their content size. This causes overflow
            with long text or code blocks.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">
              Over-specifying Grid tracks.
            </strong>{" "}
            Use <Code>auto-fill</Code> and <Code>minmax()</Code> instead of
            hardcoded column counts. Let the browser handle responsiveness.
          </span>
        </li>
      </ul>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        The Verdict
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        <strong className="text-gray-900 dark:text-white">They&apos;re not competing.</strong>{" "}
        Flexbox is for distributing items in a single direction. Grid is for
        defining two-dimensional layouts. Use Flexbox inside Grid cells. Use
        Grid for overall page structure. The question isn&apos;t &ldquo;which
        one&rdquo; — it&apos;s &ldquo;which one here.&rdquo;
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Try It Yourself
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Build Flexbox layouts visually with our{" "}
        <Link
          href="/tools/flexbox-generator"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          CSS Flexbox Generator
        </Link>
        , create Grid layouts with the{" "}
        <Link
          href="/tools/grid-generator"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          CSS Grid Generator
        </Link>
        , or convert your CSS to Tailwind utility classes with the{" "}
        <Link
          href="/tools/css-to-tailwind"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          CSS to Tailwind Converter
        </Link>
        .
      </p>
    </>
  );
}
