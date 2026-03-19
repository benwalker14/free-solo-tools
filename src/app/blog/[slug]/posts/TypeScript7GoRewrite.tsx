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

function AffiliateBox() {
  return (
    <div className="my-8 rounded-lg border border-blue-200 bg-blue-50 p-5 dark:border-blue-800 dark:bg-blue-900/20">
      <p className="text-sm font-semibold text-blue-800 dark:text-blue-200">
        Build faster with DigitalOcean
      </p>
      <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
        Deploy TypeScript apps on DigitalOcean App Platform — auto-scaling, managed databases, and built-in CI/CD.{" "}
        <a
          href="https://m.do.co/c/devbolt"
          rel="noopener sponsored"
          className="font-medium underline hover:text-blue-600 dark:hover:text-blue-200"
        >
          Get $200 in free credits →
        </a>
      </p>
    </div>
  );
}

export default function TypeScript7GoRewrite() {
  return (
    <>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        In March 2025, Anders Hejlsberg announced that the TypeScript compiler
        would be rewritten in Go. One year later, the results are in: TypeScript
        7.0 delivers 10x faster type-checking, 8x faster project loads, and a
        native language server that makes editor lag a thing of the past. This
        is the most significant change to the TypeScript toolchain since the
        language was created in 2012.
      </p>

      <Callout>
        Already on TypeScript 6.0? Use DevBolt&apos;s{" "}
        <Link
          href="/tools/tsconfig-builder"
          className="font-medium text-amber-700 underline hover:text-amber-600 dark:text-amber-300 dark:hover:text-amber-200"
        >
          tsconfig.json Visual Builder
        </Link>{" "}
        to generate a clean config that&apos;s ready for TypeScript 7.0. Still
        on 5.x? Start with the{" "}
        <Link
          href="/tools/ts6-migration"
          className="font-medium text-amber-700 underline hover:text-amber-600 dark:text-amber-300 dark:hover:text-amber-200"
        >
          TypeScript 6.0 Migration Checker
        </Link>
        .
      </Callout>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Why a Rewrite? Why Go?
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        The TypeScript compiler has been written in TypeScript since day one.
        This was a deliberate bootstrapping choice — &quot;dogfooding&quot; the
        language proved its capabilities. But after a decade, the self-hosted
        compiler hit fundamental performance limits. Large codebases with
        millions of lines of TypeScript routinely took 30-60 seconds to
        type-check, and editor IntelliSense lagged behind keystrokes in complex
        files.
      </p>
      <p className="mt-3 text-gray-600 dark:text-gray-400">
        The TypeScript team evaluated several languages for the rewrite. Rust
        was a candidate but its borrow checker added friction for a codebase
        that relies heavily on shared mutable state during type resolution.
        C++ was ruled out for maintenance burden. Go was chosen for three
        reasons:
      </p>
      <ul className="mt-4 space-y-2 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-500" />
          <span>
            <strong>Structural similarity to TypeScript.</strong> Go&apos;s
            interfaces and structural typing map naturally to how the TypeScript
            compiler represents types internally. Porting algorithms was more
            direct than translating to Rust&apos;s ownership model.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-500" />
          <span>
            <strong>Built-in concurrency.</strong> Goroutines and channels allow
            parallel type-checking across files with minimal synchronization
            overhead. The JavaScript compiler was single-threaded by design.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-500" />
          <span>
            <strong>Fast compilation and simple deployment.</strong> The Go
            compiler itself is fast, and the resulting binary is a single native
            executable with no runtime dependencies. No more{" "}
            <Code>node_modules</Code> for the compiler.
          </span>
        </li>
      </ul>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Performance: The Numbers
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        The TypeScript team shared benchmarks from the native compiler
        (codenamed &quot;Corsa&quot;) running against real-world open-source
        projects. The improvements are dramatic:
      </p>

      <div className="my-8 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800">
              <th className="py-3 pr-4 text-left font-semibold text-gray-900 dark:text-white">
                Metric
              </th>
              <th className="py-3 pr-4 text-left font-semibold text-gray-900 dark:text-white">
                TS 6.0 (JS)
              </th>
              <th className="py-3 pr-4 text-left font-semibold text-gray-900 dark:text-white">
                TS 7.0 (Go)
              </th>
              <th className="py-3 text-left font-semibold text-gray-900 dark:text-white">
                Improvement
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-600 dark:text-gray-400">
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">
                Full type-check (large monorepo)
              </td>
              <td className="py-3 pr-4">48s</td>
              <td className="py-3 pr-4">5s</td>
              <td className="py-3 font-semibold text-green-600 dark:text-green-400">~10x</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">
                Project load in editor
              </td>
              <td className="py-3 pr-4">12s</td>
              <td className="py-3 pr-4">1.5s</td>
              <td className="py-3 font-semibold text-green-600 dark:text-green-400">~8x</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">
                Autocomplete latency
              </td>
              <td className="py-3 pr-4">200-800ms</td>
              <td className="py-3 pr-4">20-80ms</td>
              <td className="py-3 font-semibold text-green-600 dark:text-green-400">~10x</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">
                Memory usage
              </td>
              <td className="py-3 pr-4">2-4 GB</td>
              <td className="py-3 pr-4">400-800 MB</td>
              <td className="py-3 font-semibold text-green-600 dark:text-green-400">~4x less</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">
                Incremental rebuild
              </td>
              <td className="py-3 pr-4">3-8s</td>
              <td className="py-3 pr-4">0.3-0.8s</td>
              <td className="py-3 font-semibold text-green-600 dark:text-green-400">~10x</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="text-gray-600 dark:text-gray-400">
        These improvements come from three sources: native code execution (vs
        JIT-compiled JavaScript), parallel type-checking across CPU cores, and
        more efficient memory management without a garbage-collected heap the
        size of a V8 isolate.
      </p>

      <AffiliateBox />

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        What Stays the Same
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        TypeScript 7.0 is a compiler rewrite, not a language rewrite. The type
        system, syntax, and language semantics are identical to TypeScript 6.0.
        Your existing code does not need changes.
      </p>
      <ul className="mt-4 space-y-2 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-500" />
          <span>
            <strong>Same <Code>tsconfig.json</Code> format.</strong> Your
            existing config works without changes. The same compiler options are
            supported.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-500" />
          <span>
            <strong>Same type system.</strong> Every type, generic, utility type,
            conditional type, template literal type, and mapped type works
            identically. The Go compiler passes the full TypeScript conformance
            test suite.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-500" />
          <span>
            <strong>Same CLI interface.</strong> The <Code>tsc</Code> command
            accepts the same flags. Build scripts, CI pipelines, and Makefiles
            work unchanged.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-500" />
          <span>
            <strong>Same <Code>.d.ts</Code> output.</strong> Declaration files
            generated by the Go compiler are identical to those from the JS
            compiler. Library authors can upgrade without breaking consumers.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-500" />
          <span>
            <strong>Same error messages.</strong> Error codes, messages, and
            diagnostic output are preserved. Your <Code>{"// @ts-ignore"}</Code>{" "}
            and <Code>{"// @ts-expect-error"}</Code> comments still work.
          </span>
        </li>
      </ul>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        What Actually Changes
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        While the language is the same, the tooling and ecosystem around the
        compiler changes in meaningful ways.
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Native Binary Distribution
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        TypeScript 7.0 ships as a native binary for each platform (macOS arm64,
        macOS x64, Linux x64, Linux arm64, Windows x64). When you{" "}
        <Code>npm install typescript@7</Code>, the package includes a thin JS
        wrapper that delegates to the platform-specific binary. This is the same
        approach used by esbuild and Bun.
      </p>
      <CodeBlock title="Installation is the same">{`# Install TypeScript 7.0
npm install typescript@7 --save-dev

# The tsc command works identically
npx tsc --noEmit
npx tsc --build`}</CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Native Language Server
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        The old <Code>tsserver</Code> (a Node.js process that powered editor
        IntelliSense) is replaced by a native Go-based language server. This is
        where the 8x project-load improvement and 10x autocomplete speedup come
        from. VS Code, Neovim, JetBrains IDEs, and any LSP-compatible editor
        will use the new server automatically.
      </p>
      <p className="mt-3 text-gray-600 dark:text-gray-400">
        For most developers, this is the most noticeable change. Large projects
        that previously caused VS Code to freeze during IntelliSense will now
        respond instantly. The &quot;TypeScript is initializing...&quot; delay
        on project open drops from seconds to milliseconds.
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Parallel Type-Checking
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        The Go compiler leverages goroutines to type-check files across all
        available CPU cores. The JavaScript compiler was limited to a single
        thread due to V8&apos;s execution model. On a machine with 8 cores,
        type-checking a project with independent modules can be up to 6-8x
        faster from parallelism alone (before counting the native code
        advantage).
      </p>
      <p className="mt-3 text-gray-600 dark:text-gray-400">
        This particularly benefits monorepos and large codebases where files
        have minimal interdependencies. The compiler analyzes the dependency
        graph and type-checks independent sub-graphs concurrently.
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Compiler API Changes
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        The biggest breaking change is for <strong>tools that use the
        TypeScript Compiler API</strong> programmatically. The{" "}
        <Code>typescript</Code> npm package previously exported a full
        JavaScript API (<Code>ts.createProgram</Code>,{" "}
        <Code>ts.createSourceFile</Code>, etc.). In TypeScript 7.0, the
        compiler is a Go binary — the old JS API is not available.
      </p>
      <p className="mt-3 text-gray-600 dark:text-gray-400">
        Instead, TypeScript 7.0 provides:
      </p>
      <ul className="mt-4 space-y-2 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-500" />
          <span>
            A <strong>gRPC-based API</strong> for programmatic access to type
            information, diagnostics, and AST data. This is faster than the old
            JS API because it avoids serializing the entire AST into JavaScript
            objects.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-500" />
          <span>
            A <strong>compatibility layer</strong> (<Code>typescript-compat</Code>)
            that wraps the gRPC API in the old JS API surface for tools that
            need time to migrate.
          </span>
        </li>
      </ul>

      <Callout>
        <strong>Who is affected?</strong> If you only use <Code>tsc</Code> from
        the command line or through a bundler (Vite, webpack, Next.js), nothing
        changes. The Compiler API change only affects authors of custom
        transformers, lint rules, codemods, and tools that call{" "}
        <Code>ts.createProgram()</Code> directly. ESLint&apos;s{" "}
        <Code>typescript-eslint</Code> and Biome have already shipped
        compatible versions.
      </Callout>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Impact on Your Stack
      </h2>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Next.js, Vite, and Bundlers
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Bundlers that only use TypeScript for type-checking (not transpilation)
        work immediately. Next.js, Vite, and webpack all use SWC or esbuild for
        actual code transformation and delegate to <Code>tsc</Code> for type
        checking. Since the CLI interface is unchanged, your build pipeline
        works as-is.
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        CI/CD Pipelines
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        CI pipelines see the most dramatic improvement. A type-check step that
        previously took 45 seconds now completes in under 5 seconds. For teams
        with large monorepos, this means faster PR checks and shorter feedback
        loops.
      </p>
      <CodeBlock title="GitHub Actions — before and after">{`# Before: TypeScript 6.0 (JS compiler)
# ✓ Type check: 47s
# ✓ Total CI: 3m 12s

# After: TypeScript 7.0 (Go compiler)
# ✓ Type check: 4.8s
# ✓ Total CI: 2m 30s`}</CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Monorepos
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Monorepos with project references (<Code>tsc --build</Code>) benefit
        from both native speed and parallel sub-project checking. A monorepo
        with 20 packages that took 2 minutes to type-check can drop to 15-20
        seconds. The Go compiler processes the project reference graph and
        checks independent packages concurrently.
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Editor Experience
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        This is where most developers will <em>feel</em> the difference. The
        native language server means:
      </p>
      <ul className="mt-4 space-y-2 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-500" />
          <span>
            Instant autocomplete, even in files with complex generics or
            conditional types
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-500" />
          <span>
            Go-to-definition and find-all-references respond in milliseconds,
            not seconds
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-500" />
          <span>
            Error squiggles appear as you type, not after a 1-2 second delay
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-500" />
          <span>
            Memory usage drops significantly — VS Code no longer needs 2-4 GB
            for the TypeScript language service on large projects
          </span>
        </li>
      </ul>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Preparing Your Codebase
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        The best thing you can do right now is migrate to TypeScript 6.0.
        The 6.0 release was designed as a &quot;cleanup release&quot; that
        removed legacy options and modernized defaults specifically to ease the
        transition to the Go compiler. If your project builds clean on
        TypeScript 6.0, it will work on 7.0 without changes.
      </p>
      <ol className="mt-4 space-y-4 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-3">
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
            1
          </span>
          <span>
            <strong>Migrate to TypeScript 6.0 first.</strong> Follow our{" "}
            <Link
              href="/blog/typescript-6-migration-guide"
              className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
            >
              TypeScript 6.0 Migration Guide
            </Link>{" "}
            or use the{" "}
            <Link
              href="/tools/ts6-migration"
              className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
            >
              Migration Checker
            </Link>
            .
          </span>
        </li>
        <li className="flex items-start gap-3">
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
            2
          </span>
          <span>
            <strong>Audit Compiler API usage.</strong> Search your codebase
            for <Code>{`import * as ts from "typescript"`}</Code> or{" "}
            <Code>ts.createProgram</Code>. If you have custom transformers or
            codemods, plan to migrate them to the new gRPC API or use the
            compatibility layer.
          </span>
        </li>
        <li className="flex items-start gap-3">
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
            3
          </span>
          <span>
            <strong>Check your toolchain versions.</strong> Ensure{" "}
            <Code>typescript-eslint</Code>, <Code>ts-jest</Code>,{" "}
            <Code>ts-node</Code>, and any TypeScript plugins are updated to
            versions that support TypeScript 7.0. Most have shipped compatible
            releases already.
          </span>
        </li>
        <li className="flex items-start gap-3">
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
            4
          </span>
          <span>
            <strong>Generate a clean <Code>tsconfig.json</Code>.</strong>{" "}
            Use the{" "}
            <Link
              href="/tools/tsconfig-builder"
              className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
            >
              tsconfig.json Visual Builder
            </Link>{" "}
            to create a config from scratch with modern defaults rather than
            carrying forward years of accumulated options.
          </span>
        </li>
        <li className="flex items-start gap-3">
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
            5
          </span>
          <span>
            <strong>Test with the beta.</strong> Install{" "}
            <Code>typescript@next</Code> and run your full build + test suite.
            File issues early for any behavioral differences.
          </span>
        </li>
      </ol>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        A Recommended tsconfig.json for TypeScript 7.0
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Here is a minimal, modern config that works with both TypeScript 6.0
        and 7.0. Since 6.0 already defaults to most of these values, many
        lines are optional — included here for explicitness.
      </p>
      <CodeBlock title="tsconfig.json — ready for TS 7.0">{`{
  "compilerOptions": {
    "target": "es2023",
    "module": "esnext",
    "moduleResolution": "bundler",
    "strict": true,
    "noEmit": true,
    "isolatedModules": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "jsx": "preserve",
    "lib": ["dom", "dom.iterable", "es2023"],
    "types": ["node", "react", "react-dom"],
    "incremental": true
  },
  "include": ["src/**/*.ts", "src/**/*.tsx"],
  "exclude": ["node_modules", "dist"]
}`}</CodeBlock>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        The Broader Trend: Native Rewrites
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        TypeScript&apos;s Go rewrite fits into a larger pattern of JavaScript
        tooling being rewritten in faster languages. This is not a fad — it
        reflects the maturing of the ecosystem:
      </p>

      <div className="my-8 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800">
              <th className="py-3 pr-4 text-left font-semibold text-gray-900 dark:text-white">
                Tool
              </th>
              <th className="py-3 pr-4 text-left font-semibold text-gray-900 dark:text-white">
                Original
              </th>
              <th className="py-3 pr-4 text-left font-semibold text-gray-900 dark:text-white">
                Rewritten In
              </th>
              <th className="py-3 text-left font-semibold text-gray-900 dark:text-white">
                Speedup
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-600 dark:text-gray-400">
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">esbuild</td>
              <td className="py-3 pr-4">—</td>
              <td className="py-3 pr-4">Go</td>
              <td className="py-3">10-100x vs webpack</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">SWC</td>
              <td className="py-3 pr-4">Babel (JS)</td>
              <td className="py-3 pr-4">Rust</td>
              <td className="py-3">20-70x</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Biome</td>
              <td className="py-3 pr-4">ESLint + Prettier (JS)</td>
              <td className="py-3 pr-4">Rust</td>
              <td className="py-3">25-35x</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Oxc</td>
              <td className="py-3 pr-4">Various (JS)</td>
              <td className="py-3 pr-4">Rust</td>
              <td className="py-3">50x+ parsing</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">TypeScript</td>
              <td className="py-3 pr-4">TypeScript (JS)</td>
              <td className="py-3 pr-4">Go</td>
              <td className="py-3">10x</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Tailwind CSS v4</td>
              <td className="py-3 pr-4">PostCSS (JS)</td>
              <td className="py-3 pr-4">Rust (Lightning CSS)</td>
              <td className="py-3">5-10x</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="text-gray-600 dark:text-gray-400">
        The common thread: JavaScript tooling that was &quot;fast enough&quot;
        for small projects becomes a bottleneck at scale. Native rewrites fix
        the bottleneck without changing the user-facing API. For developers,
        the tools work the same way — they just respond instantly.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        FAQ
      </h2>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Do I need to rewrite my code for TypeScript 7.0?
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        No. TypeScript 7.0 is a compiler rewrite, not a language change. If
        your code compiles on TypeScript 6.0, it compiles on 7.0 without
        modification.
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Will the old JavaScript compiler still be maintained?
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        TypeScript 6.x will continue receiving critical bug fixes for a
        transition period, but all new feature development happens on the Go
        compiler. The JavaScript compiler is effectively in maintenance mode.
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Does this affect my bundler (Vite, webpack, Next.js)?
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        No. Bundlers that use SWC or esbuild for transpilation and only
        delegate to <Code>tsc</Code> for type-checking will work identically.
        The CLI interface is unchanged.
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Can I still use <Code>ts-node</Code> or <Code>tsx</Code>?
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Yes. <Code>tsx</Code> (which uses esbuild under the hood) works
        immediately. <Code>ts-node</Code> depends on the TypeScript Compiler
        API and needs a version that supports the compatibility layer or the
        new gRPC API.
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        When should I upgrade?
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        If you are already on TypeScript 6.0 and your toolchain is compatible,
        upgrade immediately — the performance improvements are free. If you are
        on TypeScript 5.x, migrate to 6.0 first (the harder step), then
        upgrade to 7.0.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Bottom Line
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        TypeScript 7.0 is the rare major version that requires no code
        changes but dramatically improves the developer experience. Faster
        type-checking, instant IntelliSense, lower memory usage, and shorter
        CI times — all for free. The Go rewrite validates a decade-long bet:
        TypeScript&apos;s value was always in the type system, not the
        implementation language.
      </p>
      <p className="mt-3 text-gray-600 dark:text-gray-400">
        Get your codebase ready today. Use the{" "}
        <Link
          href="/tools/ts6-migration"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
        >
          TypeScript 6.0 Migration Checker
        </Link>{" "}
        to ensure you are on a clean 6.0 config, then build a fresh config with
        the{" "}
        <Link
          href="/tools/tsconfig-builder"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
        >
          tsconfig.json Visual Builder
        </Link>
        . And if you are generating TypeScript from other formats, tools like
        the{" "}
        <Link
          href="/tools/json-to-typescript"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
        >
          JSON to TypeScript Generator
        </Link>{" "}
        and{" "}
        <Link
          href="/tools/graphql-to-typescript"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
        >
          GraphQL to TypeScript Converter
        </Link>{" "}
        produce clean output that works with both compilers.
      </p>
    </>
  );
}
