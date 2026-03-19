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

export default function ReactVsVue() {
  return (
    <>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        React and Vue are the two most popular frontend frameworks for building
        interactive web applications. React uses JSX and an explicit,
        JavaScript-first approach. Vue uses templates and a more opinionated,
        batteries-included design. This guide compares them head-to-head so you
        can make an informed choice.
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
                React
              </th>
              <th className="py-3 text-left font-semibold text-gray-900 dark:text-white">
                Vue
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-600 dark:text-gray-400">
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Created by</td>
              <td className="py-3 pr-4">Meta (Facebook), 2013</td>
              <td className="py-3">Evan You, 2014</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Templating</td>
              <td className="py-3 pr-4">JSX (JavaScript + HTML)</td>
              <td className="py-3">HTML templates (or JSX optional)</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">State management</td>
              <td className="py-3 pr-4">useState, useReducer, Zustand, Redux</td>
              <td className="py-3">ref/reactive, Pinia (official)</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Reactivity</td>
              <td className="py-3 pr-4">Immutable (re-render on setState)</td>
              <td className="py-3">Proxy-based (auto-tracks dependencies)</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Meta-framework</td>
              <td className="py-3 pr-4">Next.js, Remix</td>
              <td className="py-3">Nuxt</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Bundle size</td>
              <td className="py-3 pr-4">~44 KB (react + react-dom)</td>
              <td className="py-3">~33 KB (vue)</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">TypeScript</td>
              <td className="py-3 pr-4">Excellent (first-class)</td>
              <td className="py-3">Excellent (Vue 3 written in TS)</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Learning curve</td>
              <td className="py-3 pr-4">Medium (JSX, hooks, ecosystem choices)</td>
              <td className="py-3">Lower (templates, clear structure)</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Job market</td>
              <td className="py-3 pr-4">Largest (44.7% developer usage)</td>
              <td className="py-3">Strong (especially Asia/Europe)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Component Syntax Compared
      </h2>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        A Counter Component
      </h3>
      <CodeBlock title="React (Hooks)">
        {`import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}`}
      </CodeBlock>
      <CodeBlock title="Vue 3 (Composition API)">
        {`<script setup>
import { ref } from "vue";

const count = ref(0);
</script>

<template>
  <div>
    <p>Count: {{ count }}</p>
    <button @click="count++">
      Increment
    </button>
  </div>
</template>`}
      </CodeBlock>

      <p className="text-gray-600 dark:text-gray-400">
        Both are concise and readable. React keeps everything in JavaScript —
        the template is JSX returned from a function. Vue separates template,
        script, and (optional) style in a Single File Component (<Code>.vue</Code>).
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Reactivity Model
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        This is the biggest architectural difference between the two:
      </p>
      <ul className="mt-4 space-y-3 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">React</strong> uses{" "}
            <strong className="text-gray-900 dark:text-white">immutable state</strong>.
            You call <Code>setState</Code> to trigger a re-render. React
            re-renders the component and diffs the virtual DOM to update the
            real DOM. You must use <Code>useMemo</Code> and{" "}
            <Code>useCallback</Code> to avoid unnecessary re-renders.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Vue</strong> uses{" "}
            <strong className="text-gray-900 dark:text-white">Proxy-based reactivity</strong>.
            You mutate state directly (<Code>count.value++</Code>), and Vue
            automatically tracks which components depend on that state and
            updates only those. No manual memoization needed.
          </span>
        </li>
      </ul>
      <CodeBlock title="React — manual optimization">
        {`// Without useMemo, expensiveCalc runs on every render
const result = useMemo(
  () => expensiveCalc(items),
  [items]
);`}
      </CodeBlock>
      <CodeBlock title="Vue — automatic tracking">
        {`// Vue tracks 'items' dependency automatically
const result = computed(() => expensiveCalc(items.value));`}
      </CodeBlock>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Ecosystem and Tooling
      </h2>
      <ul className="mt-4 space-y-3 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">React&apos;s ecosystem is larger but fragmented.</strong>{" "}
            You choose your own router (React Router, TanStack Router), state
            manager (Redux, Zustand, Jotai), form library (React Hook Form,
            Formik), and more. This flexibility is powerful but requires more
            decisions.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Vue&apos;s ecosystem is more cohesive.</strong>{" "}
            Vue Router and Pinia are official, maintained by the core team.
            Fewer choices to make, with clear &quot;blessed&quot; solutions.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">SSR/SSG:</strong>{" "}
            React has Next.js (the most popular full-stack React framework) and
            Remix. Vue has Nuxt. Both support server-side rendering, static
            generation, and API routes.
          </span>
        </li>
      </ul>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        When to Choose React
      </h2>
      <ul className="mt-4 space-y-3 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Job market priority</strong>{" "}
            — React has the largest share of frontend job listings, especially
            in North America.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Cross-platform</strong>{" "}
            — React Native lets you build iOS and Android apps with the same
            mental model. Vue has no equivalent at the same scale.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Large existing team</strong>{" "}
            — most frontend developers already know React. Hiring is easier.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Maximum flexibility</strong>{" "}
            — you want to choose every piece of the stack yourself.
          </span>
        </li>
      </ul>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        When to Choose Vue
      </h2>
      <ul className="mt-4 space-y-3 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Faster onboarding</strong>{" "}
            — Vue&apos;s template syntax is closer to standard HTML. Developers
            new to frontend find it more approachable.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Less boilerplate</strong>{" "}
            — Vue&apos;s reactivity system means less code for the same result.
            No <Code>useCallback</Code>, <Code>useMemo</Code>, or{" "}
            <Code>React.memo</Code> dance.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Official everything</strong>{" "}
            — router, state management, devtools, and testing utilities are all
            maintained by the core team.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Progressive enhancement</strong>{" "}
            — you can add Vue to an existing page with a <Code>&lt;script&gt;</Code>{" "}
            tag. React effectively requires a build step.
          </span>
        </li>
      </ul>

      <div className="my-12 rounded-xl border border-blue-200 bg-blue-50/50 p-6 dark:border-blue-900 dark:bg-blue-950/30">
        <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">
          Deploying React or Vue apps?
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
          provides instant deploys, edge functions, and form handling for
          Next.js and Nuxt apps. Connect your Git repo and ship in seconds.
        </p>
      </div>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        The Verdict
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Both are excellent, production-ready frameworks.{" "}
        <strong className="text-gray-900 dark:text-white">React</strong> wins on
        ecosystem size, job market, and cross-platform (React Native).{" "}
        <strong className="text-gray-900 dark:text-white">Vue</strong> wins on
        developer experience, simpler reactivity, and easier onboarding. For
        most teams, the choice comes down to hiring needs and existing
        expertise. You can build the same caliber of application with either.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Try It Yourself
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Working with React? Use our{" "}
        <Link
          href="/tools/html-to-jsx"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          HTML to JSX Converter
        </Link>{" "}
        to convert HTML snippets to valid JSX, or turn SVG icons into React
        components with the{" "}
        <Link
          href="/tools/svg-to-jsx"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          SVG to JSX Converter
        </Link>
        . For both frameworks, the{" "}
        <Link
          href="/tools/tailwind-generator"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          Tailwind CSS Generator
        </Link>{" "}
        helps you build utility-first styles visually.
      </p>
    </>
  );
}
