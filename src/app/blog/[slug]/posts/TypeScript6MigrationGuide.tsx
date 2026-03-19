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

export default function TypeScript6MigrationGuide() {
  return (
    <>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        TypeScript 6.0 went GA on March 17, 2026, and it is the most
        opinionated major release since TypeScript adopted strict mode.
        Default compiler settings have changed, legacy targets have been
        removed, and several deprecated options are now errors. This guide
        walks through every breaking change, what they mean for your
        codebase, and how to migrate with confidence.
      </p>

      <Callout>
        Want to check your <Code>tsconfig.json</Code> automatically?
        Use DevBolt&apos;s{" "}
        <Link
          href="/tools/ts6-migration"
          className="font-medium text-amber-700 underline hover:text-amber-600 dark:text-amber-300 dark:hover:text-amber-200"
        >
          TypeScript 6.0 Migration Checker
        </Link>{" "}
        to analyze your config and get a readiness grade with fix instructions.
      </Callout>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        What Changed in TypeScript 6.0
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        TypeScript 6.0 makes three categories of changes: <strong>removed
        options</strong> that are now compile errors, <strong>new
        defaults</strong> that change behavior even with no config changes,
        and <strong>deprecated options</strong> that still work but emit
        warnings. Here is the full breakdown.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Removed Options (Breaking)
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        These options existed in TypeScript 5.x but are now compile errors in
        6.0. If your <Code>tsconfig.json</Code> uses any of them, the
        compiler will refuse to run.
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        ES3 and ES5 Targets Removed
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Setting <Code>{`"target": "es3"`}</Code> or{" "}
        <Code>{`"target": "es5"`}</Code> is now an error. TypeScript 6.0
        requires at least ES2015 (ES6) as the compilation target. The
        rationale is straightforward: no maintained browser or runtime
        requires ES5 output in 2026. IE11 was discontinued in June 2022,
        and even legacy enterprise environments have moved on.
      </p>
      <p className="mt-3 text-gray-600 dark:text-gray-400">
        <strong>How to fix:</strong> Change your target to{" "}
        <Code>{`"es2020"`}</Code> or later. If you were targeting ES5 for
        broad compatibility, <Code>{`"es2020"`}</Code> covers 97%+ of
        browsers. For Node.js projects, match your Node version:{" "}
        <Code>{`"es2022"`}</Code> for Node 18,{" "}
        <Code>{`"es2023"`}</Code> for Node 20.
      </p>
      <CodeBlock title="tsconfig.json — before">{`{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "es5"]
  }
}`}</CodeBlock>
      <CodeBlock title="tsconfig.json — after">{`{
  "compilerOptions": {
    "target": "es2020",
    "lib": ["dom", "es2020"]
  }
}`}</CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        outFile Removed
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        The <Code>outFile</Code> option (which concatenated all output into
        a single file) has been removed. This feature only worked with AMD
        and SystemJS modules, both of which are also removed. Modern bundlers
        like Vite, esbuild, and webpack handle bundling far more effectively.
      </p>
      <p className="mt-3 text-gray-600 dark:text-gray-400">
        <strong>How to fix:</strong> Remove <Code>outFile</Code> from your
        config. Use a dedicated bundler for single-file output. If you
        are building a library, use <Code>outDir</Code> instead and let your
        bundler handle the final output.
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        AMD, UMD, and System Module Formats Removed
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Setting <Code>{`"module": "amd"`}</Code>,{" "}
        <Code>{`"module": "umd"`}</Code>, or{" "}
        <Code>{`"module": "system"`}</Code> is now an error. These module
        formats were designed for a pre-ESM world. ESM (ES Modules) and
        CommonJS are the only module formats that matter in 2026.
      </p>
      <p className="mt-3 text-gray-600 dark:text-gray-400">
        <strong>How to fix:</strong> Switch to{" "}
        <Code>{`"module": "esnext"`}</Code> for ESM projects (recommended)
        or <Code>{`"module": "commonjs"`}</Code> for legacy Node.js CJS
        projects. If you were using UMD for browser globals, use a bundler
        with UMD output format instead.
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        moduleResolution &quot;classic&quot; and &quot;node&quot; Removed
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        The original <Code>{`"moduleResolution": "classic"`}</Code> (TypeScript&apos;s
        legacy resolver) and the confusingly named{" "}
        <Code>{`"moduleResolution": "node"`}</Code> (which was Node 10-era
        resolution, now called <Code>node10</Code>) are both removed.
      </p>
      <p className="mt-3 text-gray-600 dark:text-gray-400">
        <strong>How to fix:</strong> Use{" "}
        <Code>{`"moduleResolution": "bundler"`}</Code> for apps built with
        Vite, Next.js, or webpack. Use{" "}
        <Code>{`"moduleResolution": "node16"`}</Code> or{" "}
        <Code>{`"moduleResolution": "nodenext"`}</Code> for pure Node.js
        packages that need strict ESM/CJS resolution.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Changed Defaults
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        These are the most subtle breaking changes. Even if you do not modify
        your <Code>tsconfig.json</Code>, TypeScript 6.0 will behave
        differently because the implicit defaults have changed.
      </p>

      <div className="my-8 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800">
              <th className="py-3 pr-4 text-left font-semibold text-gray-900 dark:text-white">
                Option
              </th>
              <th className="py-3 pr-4 text-left font-semibold text-gray-900 dark:text-white">
                TS 5.x Default
              </th>
              <th className="py-3 text-left font-semibold text-gray-900 dark:text-white">
                TS 6.0 Default
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-600 dark:text-gray-400">
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">
                <Code>strict</Code>
              </td>
              <td className="py-3 pr-4"><Code>false</Code></td>
              <td className="py-3"><Code>true</Code></td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">
                <Code>target</Code>
              </td>
              <td className="py-3 pr-4"><Code>es3</Code></td>
              <td className="py-3"><Code>es2025</Code></td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">
                <Code>module</Code>
              </td>
              <td className="py-3 pr-4"><Code>commonjs</Code></td>
              <td className="py-3"><Code>esnext</Code></td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">
                <Code>moduleResolution</Code>
              </td>
              <td className="py-3 pr-4"><Code>node10</Code></td>
              <td className="py-3"><Code>bundler</Code></td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">
                <Code>rootDir</Code>
              </td>
              <td className="py-3 pr-4">Inferred from files</td>
              <td className="py-3"><Code>.</Code></td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">
                <Code>types</Code>
              </td>
              <td className="py-3 pr-4">All <Code>@types/*</Code></td>
              <td className="py-3"><Code>[]</Code> (empty)</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">
                <Code>noUncheckedSideEffectImports</Code>
              </td>
              <td className="py-3 pr-4"><Code>false</Code></td>
              <td className="py-3"><Code>true</Code></td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">
                <Code>esModuleInterop</Code>
              </td>
              <td className="py-3 pr-4"><Code>false</Code></td>
              <td className="py-3"><Code>true</Code> (locked)</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">
                <Code>allowSyntheticDefaultImports</Code>
              </td>
              <td className="py-3 pr-4"><Code>false</Code></td>
              <td className="py-3"><Code>true</Code> (locked)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        strict: true by Default
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        This is the biggest behavioral change. In TypeScript 5.x, strict
        mode was opt-in. In 6.0, it is on by default. This means{" "}
        <Code>strictNullChecks</Code>, <Code>strictFunctionTypes</Code>,{" "}
        <Code>strictBindCallApply</Code>, <Code>strictPropertyInitialization</Code>,{" "}
        <Code>noImplicitAny</Code>, <Code>noImplicitThis</Code>,{" "}
        <Code>alwaysStrict</Code>, and <Code>useUnknownInCatchVariables</Code>{" "}
        are all enabled unless you explicitly set <Code>{`"strict": false`}</Code>.
      </p>
      <p className="mt-3 text-gray-600 dark:text-gray-400">
        <strong>Impact:</strong> If your project did not have{" "}
        <Code>{`"strict": true`}</Code> in tsconfig, you will see new type
        errors — potentially hundreds in a large codebase. The most common
        are <Code>null</Code> checks (<Code>Object is possibly null</Code>)
        and implicit <Code>any</Code> parameters.
      </p>
      <p className="mt-3 text-gray-600 dark:text-gray-400">
        <strong>How to fix:</strong> If your codebase is not ready for strict
        mode, explicitly add <Code>{`"strict": false`}</Code> to your config.
        For a gradual migration, keep <Code>{`"strict": false`}</Code> and
        enable individual flags one at a time:{" "}
        <Code>strictNullChecks</Code> first, then{" "}
        <Code>noImplicitAny</Code>, and so on.
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        types: [] by Default
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        In TypeScript 5.x, omitting the <Code>types</Code> field meant
        &quot;include all <Code>@types/*</Code> packages in{" "}
        <Code>node_modules</Code>.&quot; In 6.0, the default is an empty
        array — no type packages are included automatically. This means{" "}
        <Code>@types/node</Code>, <Code>@types/react</Code>, and similar
        packages must be explicitly listed.
      </p>
      <CodeBlock title="tsconfig.json — explicit types">{`{
  "compilerOptions": {
    "types": ["node", "react", "jest"]
  }
}`}</CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        noUncheckedSideEffectImports: true
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Side-effect imports like <Code>{`import "./styles.css"`}</Code> or{" "}
        <Code>{`import "reflect-metadata"`}</Code> are now checked by default.
        If the imported module does not exist or has no type definition,
        TypeScript will report an error. This catches typos in side-effect
        imports that previously failed silently at runtime.
      </p>
      <p className="mt-3 text-gray-600 dark:text-gray-400">
        <strong>How to fix:</strong> For CSS/SCSS imports in bundler-based
        projects, ensure you have a declaration file (or use{" "}
        <Code>{`"moduleResolution": "bundler"`}</Code> which is now the
        default). For custom side-effect modules, add a{" "}
        <Code>.d.ts</Code> declaration file.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Deprecated Options (Warnings)
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        These options still work in TypeScript 6.0 but emit deprecation
        warnings. They will likely be removed in TypeScript 7.0. Fix them
        now to avoid a harder migration later.
      </p>
      <ul className="mt-4 space-y-2 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500" />
          <span>
            <Code>baseUrl</Code> without path aliases — if you are only using{" "}
            <Code>baseUrl</Code> for non-relative imports (like{" "}
            <Code>{`import "src/utils"`}</Code>), use <Code>paths</Code>{" "}
            instead. <Code>baseUrl</Code> is still valid when used alongside{" "}
            <Code>paths</Code>.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500" />
          <span>
            <Code>downlevelIteration</Code> — no longer needed when targeting
            ES2015+ (which is now required). Remove it.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500" />
          <span>
            <Code>{`"alwaysStrict": false`}</Code> — contradicts the new
            strict-by-default behavior. Either enable strict mode or use{" "}
            <Code>{`"strict": false`}</Code> to opt out entirely.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500" />
          <span>
            <Code>{`"esModuleInterop": false`}</Code> — this is now locked
            to <Code>true</Code>. Setting it to <Code>false</Code> emits a
            warning and is ignored.
          </span>
        </li>
      </ul>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Step-by-Step Migration Checklist
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Follow these steps to migrate a TypeScript 5.x project to 6.0:
      </p>
      <ol className="mt-4 space-y-4 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-3">
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
            1
          </span>
          <span>
            <strong>Run the Migration Checker.</strong> Paste your{" "}
            <Code>tsconfig.json</Code> into DevBolt&apos;s{" "}
            <Link
              href="/tools/ts6-migration"
              className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
            >
              TypeScript 6.0 Migration Checker
            </Link>{" "}
            to get a readiness grade and prioritized list of issues.
          </span>
        </li>
        <li className="flex items-start gap-3">
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
            2
          </span>
          <span>
            <strong>Update your target.</strong> Replace{" "}
            <Code>{`"target": "es5"`}</Code> with{" "}
            <Code>{`"target": "es2020"`}</Code> or later. Update{" "}
            <Code>lib</Code> to match.
          </span>
        </li>
        <li className="flex items-start gap-3">
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
            3
          </span>
          <span>
            <strong>Switch module and moduleResolution.</strong> Use{" "}
            <Code>{`"module": "esnext"`}</Code> and{" "}
            <Code>{`"moduleResolution": "bundler"`}</Code> for apps.
            Use <Code>{`"module": "node16"`}</Code> and{" "}
            <Code>{`"moduleResolution": "node16"`}</Code> for Node.js
            libraries.
          </span>
        </li>
        <li className="flex items-start gap-3">
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
            4
          </span>
          <span>
            <strong>Remove outFile.</strong> Delete it and use your bundler
            for single-file output.
          </span>
        </li>
        <li className="flex items-start gap-3">
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
            5
          </span>
          <span>
            <strong>Handle strict mode.</strong> If your project already had{" "}
            <Code>{`"strict": true`}</Code>, no change needed. If not,
            either add <Code>{`"strict": false`}</Code> to preserve current
            behavior, or start fixing type errors (recommended).
          </span>
        </li>
        <li className="flex items-start gap-3">
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
            6
          </span>
          <span>
            <strong>Add explicit types.</strong> List all <Code>@types/*</Code>{" "}
            packages in the <Code>types</Code> array:{" "}
            <Code>{`"types": ["node", "react", "jest"]`}</Code>.
          </span>
        </li>
        <li className="flex items-start gap-3">
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
            7
          </span>
          <span>
            <strong>Remove deprecated options.</strong> Delete{" "}
            <Code>downlevelIteration</Code>, standalone{" "}
            <Code>baseUrl</Code>, and{" "}
            <Code>{`"esModuleInterop": false`}</Code>.
          </span>
        </li>
        <li className="flex items-start gap-3">
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
            8
          </span>
          <span>
            <strong>Run <Code>tsc --noEmit</Code>.</strong> Fix any remaining
            errors. Most will be strict-mode type issues.
          </span>
        </li>
        <li className="flex items-start gap-3">
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
            9
          </span>
          <span>
            <strong>Update CI.</strong> Pin <Code>typescript@6</Code> in your
            lockfile and CI config. Run your full test suite.
          </span>
        </li>
      </ol>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Example: Migrating a Next.js Project
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Here is a real-world before/after for a typical Next.js App Router
        project:
      </p>
      <CodeBlock title="tsconfig.json — TypeScript 5.x">{`{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}`}</CodeBlock>
      <CodeBlock title="tsconfig.json — TypeScript 6.0">{`{
  "compilerOptions": {
    "target": "es2022",
    "lib": ["dom", "dom.iterable", "es2022"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "types": ["node", "react", "react-dom"]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}`}</CodeBlock>
      <p className="mt-3 text-gray-600 dark:text-gray-400">
        Key changes: <Code>target</Code> moved from <Code>es5</Code> to{" "}
        <Code>es2022</Code>, <Code>moduleResolution</Code> changed from{" "}
        <Code>node</Code> to <Code>bundler</Code>,{" "}
        <Code>esModuleInterop</Code> and{" "}
        <Code>allowSyntheticDefaultImports</Code> removed (now default),
        and <Code>types</Code> explicitly listed.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        The Escape Hatch: ignoreDeprecations
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        TypeScript 6.0 provides an escape hatch for deprecated (not removed)
        options:
      </p>
      <CodeBlock title="Suppress deprecation warnings">{`{
  "compilerOptions": {
    "ignoreDeprecations": "6.0"
  }
}`}</CodeBlock>
      <p className="mt-3 text-gray-600 dark:text-gray-400">
        This silences deprecation warnings but does not restore removed
        options. Use it as a temporary measure during migration, not as a
        permanent solution. These options will be fully removed in a future
        version.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Looking Ahead: TypeScript 7.0
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        TypeScript 7.0 is expected to be the most significant TypeScript
        release ever — a complete rewrite of the compiler in Go, promising
        7-10x compilation speed improvements. The 6.0 cleanup of legacy
        options is preparation for this rewrite. Migrating to 6.0 now
        ensures your codebase is ready for the Go-based compiler when it
        ships.
      </p>
      <p className="mt-3 text-gray-600 dark:text-gray-400">
        Start your migration today. Use the{" "}
        <Link
          href="/tools/ts6-migration"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
        >
          TypeScript 6.0 Migration Checker
        </Link>{" "}
        to analyze your config, and the{" "}
        <Link
          href="/tools/tsconfig-builder"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
        >
          tsconfig.json Visual Builder
        </Link>{" "}
        to generate a clean config from scratch.
      </p>
    </>
  );
}
