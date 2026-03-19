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

export default function CssGridGuide() {
  return (
    <>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        CSS Grid is the most powerful layout system in CSS. While Flexbox handles
        one-dimensional layouts, Grid gives you full control over both rows and
        columns simultaneously. This guide covers everything from basic grids to
        advanced patterns like named areas and responsive layouts.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        When to Use Grid vs Flexbox
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        The simplest rule: use Grid when you need to control layout in two
        dimensions (rows <em>and</em> columns), and{" "}
        <Link
          href="/blog/css-flexbox-guide"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          Flexbox
        </Link>{" "}
        when you only need one. In practice, most pages use both &mdash; Grid
        for the overall page structure, Flexbox for the components inside it.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Creating Your First Grid
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Add <Code>display: grid</Code> to a container, then define your columns
        and rows:
      </p>
      <CodeBlock title="CSS">
        {`.grid-container {
  display: grid;
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: auto 1fr auto;
  gap: 16px;
}`}
      </CodeBlock>
      <p className="text-gray-600 dark:text-gray-400">
        This creates a three-column layout: two fixed 200px sidebars with a
        flexible center column. The <Code>1fr</Code> unit means &ldquo;one
        fraction of the remaining space.&rdquo;
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        The fr Unit
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        The <Code>fr</Code> unit is Grid&apos;s superpower. It distributes
        available space proportionally:
      </p>
      <CodeBlock title="CSS">
        {`/* Two equal columns */
grid-template-columns: 1fr 1fr;

/* Left column gets twice the space */
grid-template-columns: 2fr 1fr;

/* Fixed sidebar + flexible main */
grid-template-columns: 250px 1fr;

/* Three equal columns */
grid-template-columns: 1fr 1fr 1fr;`}
      </CodeBlock>
      <p className="text-gray-600 dark:text-gray-400">
        Unlike percentages, <Code>fr</Code> distributes space <em>after</em>{" "}
        accounting for gaps and fixed-size tracks. This means you never have to
        do math like <Code>calc(33.33% - 16px)</Code>.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        repeat() and minmax()
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        These two functions eliminate repetition and make grids responsive:
      </p>
      <CodeBlock title="CSS">
        {`/* Instead of: 1fr 1fr 1fr 1fr */
grid-template-columns: repeat(4, 1fr);

/* Auto-fill: as many 250px columns as fit */
grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));

/* Auto-fit: same, but collapses empty tracks */
grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));`}
      </CodeBlock>
      <p className="text-gray-600 dark:text-gray-400">
        The <Code>repeat(auto-fit, minmax(250px, 1fr))</Code> pattern is the
        single most useful Grid declaration. It creates a fully responsive grid
        with no media queries &mdash; columns are at least 250px wide and
        expand to fill available space.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Placing Items
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        By default, items fill the grid in order, one per cell. You can place
        them explicitly using line numbers:
      </p>
      <CodeBlock title="CSS">
        {`.header {
  grid-column: 1 / -1;  /* span all columns (1 to last) */
}

.sidebar {
  grid-column: 1 / 2;   /* first column */
  grid-row: 2 / 4;      /* span rows 2 and 3 */
}

.main {
  grid-column: 2 / -1;  /* from column 2 to the end */
}

/* Shorthand: span a number of tracks */
.wide-card {
  grid-column: span 2;  /* take up 2 columns */
}`}
      </CodeBlock>
      <p className="text-gray-600 dark:text-gray-400">
        Line numbers start at 1. Negative numbers count from the end, so{" "}
        <Code>-1</Code> means the last line. This is especially useful for
        full-width elements like headers and footers.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Named Grid Areas
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        For complex layouts, named areas make your CSS read like a visual map of
        the page:
      </p>
      <CodeBlock title="CSS">
        {`.layout {
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-rows: 60px 1fr 40px;
  grid-template-areas:
    "header  header"
    "sidebar main"
    "footer  footer";
  min-height: 100vh;
}

.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main    { grid-area: main; }
.footer  { grid-area: footer; }

/* Responsive: stack on mobile */
@media (max-width: 768px) {
  .layout {
    grid-template-columns: 1fr;
    grid-template-areas:
      "header"
      "main"
      "sidebar"
      "footer";
  }
}`}
      </CodeBlock>
      <p className="text-gray-600 dark:text-gray-400">
        Each string in <Code>grid-template-areas</Code> represents a row. Use
        the same name across cells to span that area. Use a <Code>.</Code> for
        empty cells.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Alignment
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Grid has two sets of alignment properties &mdash; one for the grid
        tracks within the container, and one for items within their cells:
      </p>
      <CodeBlock title="CSS">
        {`/* Align items within their cells */
justify-items: start | center | end | stretch;  /* horizontal */
align-items: start | center | end | stretch;    /* vertical */

/* Align a single item (override) */
justify-self: center;
align-self: end;

/* Align the entire grid within the container */
justify-content: center;  /* horizontal */
align-content: center;    /* vertical */

/* Center everything */
place-items: center;      /* shorthand for align-items + justify-items */`}
      </CodeBlock>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Common Patterns
      </h2>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        1. Responsive Card Grid
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        The most common Grid pattern &mdash; cards that automatically wrap
        and resize:
      </p>
      <CodeBlock title="CSS">
        {`.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

/* No media queries needed — it's responsive by default */`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        2. Dashboard Layout
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        A sidebar + main content area with a top navigation bar:
      </p>
      <CodeBlock title="CSS">
        {`.dashboard {
  display: grid;
  grid-template-columns: 240px 1fr;
  grid-template-rows: 64px 1fr;
  grid-template-areas:
    "nav    nav"
    "sidebar content";
  height: 100vh;
}

.nav     { grid-area: nav; }
.sidebar { grid-area: sidebar; overflow-y: auto; }
.content { grid-area: content; overflow-y: auto; padding: 24px; }`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        3. Photo Gallery with Featured Image
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        A large featured image with smaller thumbnails:
      </p>
      <CodeBlock title="CSS">
        {`.gallery {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(2, 200px);
  gap: 8px;
}

.gallery .featured {
  grid-column: span 2;
  grid-row: span 2;    /* takes 4 cells */
}

.gallery img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        4. Magazine / Masonry-Style Layout
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Articles of varying sizes, placed on a fixed grid:
      </p>
      <CodeBlock title="CSS">
        {`.magazine {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 150px;
  gap: 16px;
}

.article-large  { grid-column: span 2; grid-row: span 2; }
.article-tall   { grid-row: span 2; }
.article-wide   { grid-column: span 2; }`}
      </CodeBlock>

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
              <td className="py-3 pr-4"><Code>display: grid</Code></td>
              <td className="py-3 pr-4">Container</td>
              <td className="py-3">Enables Grid layout</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4"><Code>grid-template-columns</Code></td>
              <td className="py-3 pr-4">Container</td>
              <td className="py-3">Defines column tracks</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4"><Code>grid-template-rows</Code></td>
              <td className="py-3 pr-4">Container</td>
              <td className="py-3">Defines row tracks</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4"><Code>grid-template-areas</Code></td>
              <td className="py-3 pr-4">Container</td>
              <td className="py-3">Names grid regions</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4"><Code>gap</Code></td>
              <td className="py-3 pr-4">Container</td>
              <td className="py-3">Space between tracks</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4"><Code>justify-items</Code></td>
              <td className="py-3 pr-4">Container</td>
              <td className="py-3">Horizontal alignment in cells</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4"><Code>align-items</Code></td>
              <td className="py-3 pr-4">Container</td>
              <td className="py-3">Vertical alignment in cells</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4"><Code>grid-column</Code></td>
              <td className="py-3 pr-4">Item</td>
              <td className="py-3">Column placement / span</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4"><Code>grid-row</Code></td>
              <td className="py-3 pr-4">Item</td>
              <td className="py-3">Row placement / span</td>
            </tr>
            <tr>
              <td className="py-3 pr-4"><Code>grid-area</Code></td>
              <td className="py-3 pr-4">Item</td>
              <td className="py-3">Assigns item to named area</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Build Grid Layouts Visually
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Use our{" "}
        <Link
          href="/tools/grid-generator"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          CSS Grid Generator
        </Link>{" "}
        to visually design your grid and get the CSS instantly. For
        one-dimensional layouts, try the{" "}
        <Link
          href="/tools/flexbox-generator"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          CSS Flexbox Generator
        </Link>
        . Both tools run entirely in your browser with no signup required.
      </p>
    </>
  );
}
