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

export default function TypeScriptVsJavaScript() {
  return (
    <>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        TypeScript is a strict superset of JavaScript that adds static type
        checking. Every valid JavaScript program is valid TypeScript, but
        TypeScript catches entire categories of bugs before your code ever runs.
        This guide covers the real differences, when each makes sense, and how
        to migrate.
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
                JavaScript
              </th>
              <th className="py-3 text-left font-semibold text-gray-900 dark:text-white">
                TypeScript
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-600 dark:text-gray-400">
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Type system</td>
              <td className="py-3 pr-4">Dynamic (runtime)</td>
              <td className="py-3">Static (compile-time)</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Compilation</td>
              <td className="py-3 pr-4">Interpreted directly</td>
              <td className="py-3">Compiled to JavaScript</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">File extension</td>
              <td className="py-3 pr-4"><Code>.js</Code>, <Code>.mjs</Code></td>
              <td className="py-3"><Code>.ts</Code>, <Code>.tsx</Code></td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Learning curve</td>
              <td className="py-3 pr-4">Lower</td>
              <td className="py-3">Higher (types, generics, utility types)</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Tooling / IDE</td>
              <td className="py-3 pr-4">Good (via inference)</td>
              <td className="py-3">Excellent (autocomplete, refactoring)</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Runtime</td>
              <td className="py-3 pr-4">Browser, Node.js, Deno, Bun</td>
              <td className="py-3">Same (compiles to JS), Deno/Bun run .ts natively</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Ecosystem</td>
              <td className="py-3 pr-4">npm (2M+ packages)</td>
              <td className="py-3">Same npm + DefinitelyTyped (@types/*)</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Adoption</td>
              <td className="py-3 pr-4">Universal (every browser)</td>
              <td className="py-3">#1 on GitHub (2024-2025), used by most new projects</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        What TypeScript Actually Adds
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        TypeScript&apos;s type system is{" "}
        <strong className="text-gray-900 dark:text-white">erased at compile time</strong>.
        There is zero runtime overhead — types exist only during development.
        The compiler strips them all away and outputs plain JavaScript.
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Type Annotations
      </h3>
      <CodeBlock title="JavaScript">
        {`function greet(name) {
  return "Hello, " + name;
}

greet(42); // No error — fails silently or produces "Hello, 42"`}
      </CodeBlock>
      <CodeBlock title="TypeScript">
        {`function greet(name: string): string {
  return "Hello, " + name;
}

greet(42); // ❌ Compile error: Argument of type 'number'
           //    is not assignable to parameter of type 'string'`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Interfaces and Type Aliases
      </h3>
      <CodeBlock title="TypeScript">
        {`interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user" | "guest";  // Union type
}

// The compiler ensures every User has exactly these fields
function sendEmail(user: User) {
  console.log(\`Sending to \${user.email}\`);
}

sendEmail({ id: 1, name: "Alice" });
// ❌ Property 'email' is missing
// ❌ Property 'role' is missing`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Generics
      </h3>
      <CodeBlock title="TypeScript">
        {`function first<T>(arr: T[]): T | undefined {
  return arr[0];
}

const num = first([1, 2, 3]);    // type: number | undefined
const str = first(["a", "b"]);   // type: string | undefined`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Enums and Utility Types
      </h3>
      <CodeBlock title="TypeScript">
        {`enum Status {
  Active = "active",
  Inactive = "inactive",
  Pending = "pending",
}

// Utility types transform existing types
type UserPreview = Pick<User, "id" | "name">;
type PartialUser = Partial<User>;
type ReadonlyUser = Readonly<User>;`}
      </CodeBlock>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Bugs TypeScript Catches
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        The most common JavaScript bugs that TypeScript eliminates at compile
        time:
      </p>
      <ul className="mt-4 space-y-3 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Typos in property names</strong>{" "}
            — <Code>user.naem</Code> instead of <Code>user.name</Code>.
            JavaScript silently returns <Code>undefined</Code>; TypeScript
            flags it immediately.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Null/undefined access</strong>{" "}
            — calling <Code>.toLowerCase()</Code> on a value that might be{" "}
            <Code>null</Code>. TypeScript&apos;s strict null checks force you
            to handle it.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Wrong argument types</strong>{" "}
            — passing a string where a number is expected. TypeScript catches
            this before the function ever runs.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Missing switch cases</strong>{" "}
            — forgetting to handle a variant in a union type. TypeScript&apos;s
            exhaustive checking warns you.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Incorrect return types</strong>{" "}
            — a function that sometimes returns a string and sometimes{" "}
            <Code>undefined</Code> without the caller knowing.
          </span>
        </li>
      </ul>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        When to Use JavaScript
      </h2>
      <ul className="mt-4 space-y-3 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Quick scripts and prototypes</strong>{" "}
            — one-off automation, shell scripts, or throwaway code where setup
            time outweighs type safety benefits.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Small, solo projects</strong>{" "}
            — when you&apos;re the only developer and the codebase is under a
            few hundred lines.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Learning web development</strong>{" "}
            — understanding JavaScript fundamentals before adding types on top.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Legacy codebases</strong>{" "}
            — when migration cost is too high and JSDoc + <Code>{"// @ts-check"}</Code> gives you
            most of the benefits.
          </span>
        </li>
      </ul>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        When to Use TypeScript
      </h2>
      <ul className="mt-4 space-y-3 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Team projects</strong>{" "}
            — types serve as living documentation. New developers understand
            function signatures without reading implementations.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Long-lived applications</strong>{" "}
            — any codebase you&apos;ll maintain for months or years. Refactoring
            with types is dramatically safer.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">APIs and shared libraries</strong>{" "}
            — types define the contract. Consumers get autocomplete and
            compile-time validation.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Complex data shapes</strong>{" "}
            — deeply nested objects, API responses, database models. Types make
            the shape explicit and catch mismatches.
          </span>
        </li>
      </ul>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        The Migration Path
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        You don&apos;t have to rewrite everything. TypeScript supports gradual
        adoption:
      </p>
      <ol className="mt-4 space-y-3 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-3">
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
            1
          </span>
          <span>
            <strong className="text-gray-900 dark:text-white">Add <Code>tsconfig.json</Code></strong>{" "}
            with <Code>allowJs: true</Code> and <Code>strict: false</Code>.
            Your existing JS files work unchanged.
          </span>
        </li>
        <li className="flex items-start gap-3">
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
            2
          </span>
          <span>
            <strong className="text-gray-900 dark:text-white">Rename files one at a time</strong>{" "}
            from <Code>.js</Code> to <Code>.ts</Code>. Fix errors as they
            appear.
          </span>
        </li>
        <li className="flex items-start gap-3">
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
            3
          </span>
          <span>
            <strong className="text-gray-900 dark:text-white">Add types to shared boundaries first</strong>{" "}
            — API responses, function parameters, component props.
          </span>
        </li>
        <li className="flex items-start gap-3">
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
            4
          </span>
          <span>
            <strong className="text-gray-900 dark:text-white">Enable strict mode</strong>{" "}
            once most files are converted. This turns on{" "}
            <Code>strictNullChecks</Code>, <Code>noImplicitAny</Code>, and
            other safety checks.
          </span>
        </li>
      </ol>
      <CodeBlock title="tsconfig.json (starter)">
        {`{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "dist",
    "declaration": true
  },
  "include": ["src"]
}`}
      </CodeBlock>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Performance: Is TypeScript Slower?
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        <strong className="text-gray-900 dark:text-white">At runtime, no.</strong>{" "}
        TypeScript compiles to JavaScript, so the executed code is identical in
        performance. The only overhead is the compilation step during
        development, which modern tools minimize:
      </p>
      <ul className="mt-4 space-y-2 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">esbuild</strong> — transpiles
            TypeScript 100x faster than <Code>tsc</Code> by skipping type checking
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">SWC</strong> — Rust-based
            transpiler used by Next.js, Vite, and Turbopack
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Bun / Deno</strong> — run{" "}
            <Code>.ts</Code> files directly without a separate compile step
          </span>
        </li>
      </ul>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Common TypeScript Mistakes
      </h2>
      <ul className="space-y-4 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">
              Overusing <Code>any</Code>.
            </strong>{" "}
            Every <Code>any</Code> is a hole in your type safety. Use{" "}
            <Code>unknown</Code> instead and narrow the type with checks.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">
              Not enabling strict mode.
            </strong>{" "}
            Without <Code>&quot;strict&quot;: true</Code>, TypeScript is
            permissive enough that you miss the bugs it was designed to catch.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">
              Type assertions everywhere.
            </strong>{" "}
            Using <Code>as SomeType</Code> tells TypeScript &quot;trust me&quot;
            — but you might be wrong. Prefer type guards and narrowing.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">
              Over-typing simple things.
            </strong>{" "}
            TypeScript infers types well. Writing{" "}
            <Code>const x: number = 5</Code> adds noise without value. Let
            inference work.
          </span>
        </li>
      </ul>

      <div className="my-12 rounded-xl border border-blue-200 bg-blue-50/50 p-6 dark:border-blue-900 dark:bg-blue-950/30">
        <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">
          Deploying TypeScript applications?
        </p>
        <p className="mt-2 text-sm text-blue-800 dark:text-blue-400">
          <a
            href="https://www.digitalocean.com/"
            target="_blank"
            rel="noopener sponsored"
            className="font-medium underline hover:no-underline"
          >
            DigitalOcean
          </a>{" "}
          provides simple, scalable cloud infrastructure for Node.js and
          TypeScript apps. App Platform auto-detects your{" "}
          <Code>tsconfig.json</Code> and builds automatically.
        </p>
      </div>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        The Verdict
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        For new projects of any meaningful size,{" "}
        <strong className="text-gray-900 dark:text-white">use TypeScript</strong>.
        The setup cost is negligible with modern frameworks (Next.js, Vite, and
        most CLI tools scaffold TypeScript by default), and the safety net pays
        for itself on the first refactor. JavaScript remains the right choice
        for quick scripts, learning fundamentals, and codebases where migration
        isn&apos;t practical.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Try It Yourself
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Use our{" "}
        <Link
          href="/tools/json-to-typescript"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          JSON to TypeScript Generator
        </Link>{" "}
        to instantly generate TypeScript interfaces from any JSON data. Test
        JavaScript snippets in the{" "}
        <Link
          href="/tools/js-playground"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          JavaScript/TypeScript Playground
        </Link>
        , or convert JSON API responses to typed code in 8 languages with the{" "}
        <Link
          href="/tools/json-to-code"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          JSON to Code Generator
        </Link>
        .
      </p>
    </>
  );
}
