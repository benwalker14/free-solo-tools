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

export default function NextjsVsNuxt() {
  return (
    <>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        Next.js is the meta-framework for React. Nuxt is the meta-framework
        for Vue. Both handle routing, server-side rendering, static generation,
        and API endpoints. The biggest factor in choosing between them is
        which UI library you prefer — but there are real architectural
        differences. This guide covers both.
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
                Next.js
              </th>
              <th className="py-3 text-left font-semibold text-gray-900 dark:text-white">
                Nuxt
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-600 dark:text-gray-400">
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">UI library</td>
              <td className="py-3 pr-4">React</td>
              <td className="py-3">Vue</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Current version</td>
              <td className="py-3 pr-4">Next.js 15 (App Router)</td>
              <td className="py-3">Nuxt 3</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Rendering</td>
              <td className="py-3 pr-4">SSR, SSG, ISR, RSC (Server Components)</td>
              <td className="py-3">SSR, SSG, ISR, Hybrid per-route</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Routing</td>
              <td className="py-3 pr-4">File-based (App Router or Pages Router)</td>
              <td className="py-3">File-based (<Code>pages/</Code> directory)</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Server engine</td>
              <td className="py-3 pr-4">Node.js (custom)</td>
              <td className="py-3">Nitro (cross-platform, edge-ready)</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Data fetching</td>
              <td className="py-3 pr-4"><Code>async</Code> Server Components, <Code>fetch()</Code> with caching</td>
              <td className="py-3"><Code>useFetch()</Code>, <Code>useAsyncData()</Code></td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">State management</td>
              <td className="py-3 pr-4">React Context, Zustand, Jotai (BYO)</td>
              <td className="py-3">Pinia (official), <Code>useState()</Code> built-in</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">TypeScript</td>
              <td className="py-3 pr-4">First-class (configured by default)</td>
              <td className="py-3">First-class (auto-generated types)</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Deployment</td>
              <td className="py-3 pr-4">Vercel (optimized), any Node.js host</td>
              <td className="py-3">Any Node.js host, Cloudflare, Deno, edge</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">npm weekly downloads</td>
              <td className="py-3 pr-4">~7M</td>
              <td className="py-3">~600K</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Architecture Differences
      </h2>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Routing
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Both use file-based routing, but the conventions differ:
      </p>
      <CodeBlock title="Next.js App Router">
        {`app/
  page.tsx              → /
  about/page.tsx        → /about
  blog/[slug]/page.tsx  → /blog/:slug
  api/users/route.ts    → /api/users`}
      </CodeBlock>
      <CodeBlock title="Nuxt 3">
        {`pages/
  index.vue             → /
  about.vue             → /about
  blog/[slug].vue       → /blog/:slug
server/api/
  users.ts              → /api/users`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Data Fetching
      </h3>
      <CodeBlock title="Next.js (Server Component)">
        {`// app/posts/page.tsx — runs on the server
export default async function PostsPage() {
  const posts = await fetch('https://api.example.com/posts', {
    next: { revalidate: 60 }  // ISR: revalidate every 60s
  }).then(res => res.json());

  return (
    <ul>
      {posts.map(post => <li key={post.id}>{post.title}</li>)}
    </ul>
  );
}`}
      </CodeBlock>
      <CodeBlock title="Nuxt 3">
        {`<!-- pages/posts.vue -->
<script setup>
const { data: posts } = await useFetch('/api/posts', {
  transform: (data) => data.posts,
})
</script>

<template>
  <ul>
    <li v-for="post in posts" :key="post.id">
      {{ post.title }}
    </li>
  </ul>
</template>`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Component Syntax
      </h3>
      <CodeBlock title="Next.js (React)">
        {`'use client';
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(c => c + 1)}>
      Count: {count}
    </button>
  );
}`}
      </CodeBlock>
      <CodeBlock title="Nuxt 3 (Vue)">
        {`<script setup>
const count = ref(0)
</script>

<template>
  <button @click="count++">
    Count: {{ count }}
  </button>
</template>`}
      </CodeBlock>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Where Next.js Wins
      </h2>
      <ul className="mt-4 space-y-3 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">React Server Components.</strong>{" "}
            Server-side components that send zero JavaScript to the client.
            Nuxt has no equivalent — all Vue components ship client-side code.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Ecosystem size.</strong>{" "}
            React has more third-party component libraries, UI kits, and
            integrations than Vue. If you need a specific integration, React
            is more likely to have it.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Job market.</strong>{" "}
            React has significantly more job listings than Vue globally. If
            career marketability matters, Next.js/React has a larger surface
            area.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Vercel integration.</strong>{" "}
            Vercel (the company behind Next.js) provides optimized deployment
            with ISR, edge middleware, image optimization, and analytics
            out of the box.
          </span>
        </li>
      </ul>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Where Nuxt Wins
      </h2>
      <ul className="mt-4 space-y-3 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Simpler mental model.</strong>{" "}
            Vue&apos;s reactivity is built-in (<Code>ref()</Code>, <Code>computed()</Code>).
            React requires <Code>useState</Code>, <Code>useEffect</Code>,{" "}
            <Code>useMemo</Code>, <Code>useCallback</Code> and understanding
            closures, stale state, and dependency arrays.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Auto-imports.</strong>{" "}
            Nuxt auto-imports components, composables, and utilities. No
            import statements needed for <Code>ref()</Code>, <Code>computed()</Code>,
            or any component in your <Code>components/</Code> directory.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Nitro server engine.</strong>{" "}
            Nuxt&apos;s Nitro engine deploys to Cloudflare Workers, Deno
            Deploy, Vercel, Netlify, and bare Node.js with zero configuration
            changes. It&apos;s platform-agnostic by design.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Module ecosystem.</strong>{" "}
            Nuxt modules (<Code>@nuxtjs/image</Code>, <Code>@nuxtjs/i18n</Code>,{" "}
            <Code>@nuxt/content</Code>) integrate deeply with the framework
            and auto-configure themselves. Less boilerplate.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">No client/server split confusion.</strong>{" "}
            Next.js App Router requires understanding <Code>&quot;use client&quot;</Code>{" "}
            and <Code>&quot;use server&quot;</Code> boundaries. Nuxt components work
            in both contexts without directives.
          </span>
        </li>
      </ul>

      <div className="my-12 rounded-xl border border-blue-200 bg-blue-50/50 p-6 dark:border-blue-900 dark:bg-blue-950/30">
        <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">
          Deploying your Next.js or Nuxt app?
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
          supports both Next.js and Nuxt with automatic framework detection,
          edge functions, and preview deploys for every pull request.
        </p>
      </div>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Performance
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Both frameworks produce fast applications when used correctly. The
        differences are marginal:
      </p>
      <ul className="mt-4 space-y-3 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Bundle size:</strong>{" "}
            Vue&apos;s runtime is smaller than React&apos;s (~33KB vs ~42KB gzipped).
            In practice, app code dominates the bundle.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Server rendering:</strong>{" "}
            Next.js Server Components reduce client JavaScript to zero for
            non-interactive content. Nuxt sends hydration code for all components.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Build time:</strong>{" "}
            Nuxt uses Vite by default (fast dev server). Next.js uses Turbopack
            (fast, but still maturing).
          </span>
        </li>
      </ul>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        The Verdict
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        <strong className="text-gray-900 dark:text-white">Choose Next.js</strong>{" "}
        if you know React, need the largest ecosystem, want React Server
        Components, or are hiring from the React talent pool.{" "}
        <strong className="text-gray-900 dark:text-white">Choose Nuxt</strong>{" "}
        if you prefer Vue&apos;s simpler reactivity model, want auto-imports and
        less boilerplate, need platform-agnostic deployment, or are building
        content-heavy sites with <Code>@nuxt/content</Code>.
        Both are production-grade. The framework matters less than shipping.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Try It Yourself
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Convert HTML to JSX for your Next.js project with the{" "}
        <Link
          href="/tools/html-to-jsx"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          HTML to JSX Converter
        </Link>
        . Generate TypeScript interfaces from API responses with the{" "}
        <Link
          href="/tools/json-to-typescript"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          JSON to TypeScript Generator
        </Link>
        , or build Tailwind layouts visually with the{" "}
        <Link
          href="/tools/tailwind-generator"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          Tailwind CSS Generator
        </Link>
        .
      </p>
    </>
  );
}
