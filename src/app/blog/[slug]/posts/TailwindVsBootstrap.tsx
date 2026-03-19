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

export default function TailwindVsBootstrap() {
  return (
    <>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        Tailwind CSS and Bootstrap are the two most popular CSS frameworks, but
        they take fundamentally different approaches. Bootstrap gives you
        pre-built components. Tailwind gives you utility classes to build your
        own. This guide compares their philosophies, developer experience, and
        when each makes sense.
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
                Tailwind CSS
              </th>
              <th className="py-3 text-left font-semibold text-gray-900 dark:text-white">
                Bootstrap
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-600 dark:text-gray-400">
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Approach</td>
              <td className="py-3 pr-4">Utility-first (atomic classes)</td>
              <td className="py-3">Component-first (pre-built UI)</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Customization</td>
              <td className="py-3 pr-4">Fully custom by default</td>
              <td className="py-3">Theme overrides (Sass variables)</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Production CSS</td>
              <td className="py-3 pr-4">~10-30 KB (purged)</td>
              <td className="py-3">~170 KB (full), ~50 KB (purged)</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">JavaScript</td>
              <td className="py-3 pr-4">None (CSS only)</td>
              <td className="py-3">Included (dropdowns, modals, tooltips)</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Design freedom</td>
              <td className="py-3 pr-4">Unlimited (build anything)</td>
              <td className="py-3">Constrained (looks &quot;Bootstrap-y&quot;)</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Pre-built components</td>
              <td className="py-3 pr-4">None (use Headless UI, daisyUI, etc.)</td>
              <td className="py-3">50+ (navbar, modal, card, carousel, etc.)</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Learning curve</td>
              <td className="py-3 pr-4">Medium (memorize utility classes)</td>
              <td className="py-3">Lower (copy component snippets)</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Best for</td>
              <td className="py-3 pr-4">Custom designs, SPAs, React/Vue apps</td>
              <td className="py-3">Rapid prototyping, admin panels, MVPs</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Building the Same Card
      </h2>
      <CodeBlock title="Bootstrap">
        {`<div class="card" style="width: 18rem;">
  <img src="..." class="card-img-top" alt="...">
  <div class="card-body">
    <h5 class="card-title">Card title</h5>
    <p class="card-text">Some quick example text.</p>
    <a href="#" class="btn btn-primary">Go somewhere</a>
  </div>
</div>`}
      </CodeBlock>
      <CodeBlock title="Tailwind CSS">
        {`<div class="w-72 overflow-hidden rounded-lg bg-white shadow-md">
  <img src="..." class="w-full" alt="...">
  <div class="p-4">
    <h5 class="text-xl font-bold">Card title</h5>
    <p class="mt-2 text-gray-600">Some quick example text.</p>
    <a href="#" class="mt-4 inline-block rounded bg-blue-600
       px-4 py-2 text-white hover:bg-blue-700">
      Go somewhere
    </a>
  </div>
</div>`}
      </CodeBlock>
      <p className="text-gray-600 dark:text-gray-400">
        Bootstrap&apos;s version is shorter — you&apos;re using pre-defined{" "}
        <Code>.card</Code> and <Code>.btn</Code> classes. Tailwind&apos;s
        version is more verbose but every visual detail is explicit and
        customizable without touching CSS files.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        The Philosophy Difference
      </h2>
      <ul className="mt-4 space-y-3 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Bootstrap says:</strong>{" "}
            &quot;Here&apos;s a button. Use our button. Customize it with Sass
            variables if you want.&quot; The design decisions are made for you.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Tailwind says:</strong>{" "}
            &quot;Here are spacing, color, typography, and layout primitives.
            Build whatever button you want.&quot; You make every design decision.
          </span>
        </li>
      </ul>
      <p className="mt-4 text-gray-600 dark:text-gray-400">
        This is why Tailwind sites look unique while Bootstrap sites often look
        similar. It&apos;s also why Bootstrap is faster to prototype with —
        the decisions are pre-made.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Bundle Size
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Tailwind&apos;s purge system is aggressive. It scans your HTML/JSX for
        class names and removes everything unused:
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800">
              <th className="py-3 pr-4 text-left font-semibold text-gray-900 dark:text-white">
                Framework
              </th>
              <th className="py-3 pr-4 text-left font-semibold text-gray-900 dark:text-white">
                Full CSS
              </th>
              <th className="py-3 text-left font-semibold text-gray-900 dark:text-white">
                Typical Production
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-600 dark:text-gray-400">
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4">Tailwind CSS</td>
              <td className="py-3 pr-4">~3.5 MB (dev)</td>
              <td className="py-3">10-30 KB (gzipped)</td>
            </tr>
            <tr>
              <td className="py-3 pr-4">Bootstrap</td>
              <td className="py-3 pr-4">~170 KB (+ 80 KB JS)</td>
              <td className="py-3">50-80 KB CSS + JS (gzipped)</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-gray-600 dark:text-gray-400">
        Tailwind&apos;s production output is smaller because you only ship
        classes you actually use. Bootstrap ships component CSS whether you use
        those components or not (though tree-shaking helps).
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        When to Choose Tailwind
      </h2>
      <ul className="mt-4 space-y-3 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Custom designs</strong>{" "}
            — you have a Figma file or design system. Tailwind lets you
            implement any design without fighting framework opinions.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Component-based frameworks</strong>{" "}
            — React, Vue, Svelte, and Angular. Utility classes in component
            files eliminate context-switching between HTML and CSS.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Performance-critical apps</strong>{" "}
            — smaller CSS bundles and no unused styles.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Design consistency</strong>{" "}
            — Tailwind&apos;s spacing scale (<Code>p-1</Code> to <Code>p-12</Code>),
            color palette, and responsive prefixes enforce consistency
            without a style guide.
          </span>
        </li>
      </ul>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        When to Choose Bootstrap
      </h2>
      <ul className="mt-4 space-y-3 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Speed over uniqueness</strong>{" "}
            — admin dashboards, internal tools, and MVPs where &quot;looks
            professional&quot; matters more than &quot;looks unique.&quot;
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">No build step</strong>{" "}
            — Bootstrap works via a CDN link. No npm, no config, no purging.
            Add one <Code>&lt;link&gt;</Code> tag and start building.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Built-in JavaScript components</strong>{" "}
            — modals, tooltips, dropdowns, and carousels work out of the box.
            Tailwind requires separate libraries (Headless UI, Radix) for
            interactive components.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Teams without designers</strong>{" "}
            — Bootstrap&apos;s opinionated defaults look reasonable
            immediately. No design decisions required.
          </span>
        </li>
      </ul>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Responsive Design
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Both frameworks are mobile-first, but the syntax differs:
      </p>
      <CodeBlock title="Bootstrap responsive">
        {`<div class="col-12 col-md-6 col-lg-4">
  <!-- Full width on mobile, half on medium, third on large -->
</div>`}
      </CodeBlock>
      <CodeBlock title="Tailwind responsive">
        {`<div class="w-full md:w-1/2 lg:w-1/3">
  <!-- Same result, different syntax -->
</div>`}
      </CodeBlock>
      <p className="text-gray-600 dark:text-gray-400">
        Tailwind&apos;s responsive prefixes (<Code>sm:</Code>, <Code>md:</Code>,{" "}
        <Code>lg:</Code>) work on any utility, not just grid classes. You can
        make any property responsive: <Code>md:hidden</Code>,{" "}
        <Code>lg:text-xl</Code>, <Code>dark:bg-gray-900</Code>.
      </p>

      <div className="my-12 rounded-xl border border-blue-200 bg-blue-50/50 p-6 dark:border-blue-900 dark:bg-blue-950/30">
        <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">
          Deploying Tailwind or Bootstrap projects?
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
          auto-detects your build tool and deploys your site with edge caching,
          instant rollbacks, and built-in forms. Connect a Git repo and ship.
        </p>
      </div>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        The Verdict
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        <strong className="text-gray-900 dark:text-white">Tailwind</strong> is
        the better choice for most modern web projects, especially with
        component frameworks like React and Vue. It produces smaller bundles,
        gives you complete design control, and scales well with design systems.{" "}
        <strong className="text-gray-900 dark:text-white">Bootstrap</strong>{" "}
        remains the fastest way to get a professional-looking interface without
        design skills or a build step — ideal for prototypes, internal tools,
        and traditional server-rendered pages.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Try It Yourself
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Build utility-first layouts visually with our{" "}
        <Link
          href="/tools/tailwind-generator"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          Tailwind CSS Generator
        </Link>
        , convert existing CSS to Tailwind classes with the{" "}
        <Link
          href="/tools/css-to-tailwind"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          CSS to Tailwind Converter
        </Link>
        , or design layouts interactively with the{" "}
        <Link
          href="/tools/flexbox-generator"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          CSS Flexbox Generator
        </Link>{" "}
        and{" "}
        <Link
          href="/tools/grid-generator"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          CSS Grid Generator
        </Link>
        .
      </p>
    </>
  );
}
