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

export default function BiomeVsEslint() {
  return (
    <>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        Biome v2 shipped in early 2026 with first-class CSS and GraphQL
        linting, a stable plugin API, and a single binary that replaces
        ESLint, Prettier, and import sorting. ESLint 9 countered with a
        flat config overhaul and language-agnostic plugin system. If you
        are choosing between them — or planning a migration — this guide
        covers the real trade-offs, benchmarks, and a step-by-step migration
        path.
      </p>

      <Callout>
        Already decided to migrate? Use DevBolt&apos;s{" "}
        <Link
          href="/tools/eslint-to-biome"
          className="font-medium text-amber-700 underline hover:text-amber-600 dark:text-amber-300 dark:hover:text-amber-200"
        >
          ESLint to Biome Converter
        </Link>{" "}
        to convert your <Code>.eslintrc</Code> to <Code>biome.json</Code>{" "}
        instantly — 100+ rule mappings, formatter extraction, and migration
        guidance included.
      </Callout>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        What Biome and ESLint Actually Do
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        ESLint is a JavaScript/TypeScript linter. It analyzes your code for
        bugs, style violations, and best-practice issues using a plugin
        ecosystem. It does <strong>not</strong> format code — you need
        Prettier (or a similar tool) for that. A typical ESLint setup
        involves ESLint itself, Prettier, <Code>eslint-config-prettier</Code>{" "}
        to disable conflicting rules, and often 3-5 additional plugins
        (<Code>@typescript-eslint</Code>, <Code>eslint-plugin-react</Code>,{" "}
        <Code>eslint-plugin-import</Code>, etc.).
      </p>
      <p className="mt-3 text-gray-600 dark:text-gray-400">
        Biome is a single Rust binary that handles linting, formatting, and
        import sorting out of the box. One dependency. One config file. No
        plugin compatibility matrix to manage. It supports JavaScript,
        TypeScript, JSX, TSX, JSON, JSONC, CSS, and GraphQL (as of v2).
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Head-to-Head Comparison
      </h2>
      <div className="my-8 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800">
              <th className="py-3 pr-4 text-left font-semibold text-gray-900 dark:text-white">
                Feature
              </th>
              <th className="py-3 pr-4 text-left font-semibold text-gray-900 dark:text-white">
                ESLint 9
              </th>
              <th className="py-3 text-left font-semibold text-gray-900 dark:text-white">
                Biome v2
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-600 dark:text-gray-400">
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Language</td>
              <td className="py-3 pr-4">JavaScript (Node.js)</td>
              <td className="py-3">Rust (native binary)</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Linting</td>
              <td className="py-3 pr-4">JS/TS + plugins for React, Vue, Angular, etc.</td>
              <td className="py-3">JS/TS/JSX/CSS/GraphQL built-in, 280+ rules</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Formatting</td>
              <td className="py-3 pr-4">No (needs Prettier)</td>
              <td className="py-3">Built-in, Prettier-compatible</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Import sorting</td>
              <td className="py-3 pr-4">Via <Code>eslint-plugin-import</Code></td>
              <td className="py-3">Built-in</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Config format</td>
              <td className="py-3 pr-4"><Code>eslint.config.js</Code> (flat config)</td>
              <td className="py-3"><Code>biome.json</Code> (JSON)</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Speed</td>
              <td className="py-3 pr-4">Baseline</td>
              <td className="py-3">20-100x faster (Rust)</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Dependencies</td>
              <td className="py-3 pr-4">50-200+ (ESLint + plugins + Prettier)</td>
              <td className="py-3">1 (single binary)</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Plugin ecosystem</td>
              <td className="py-3 pr-4">Massive (2,800+ plugins on npm)</td>
              <td className="py-3">Growing (plugin API stable in v2)</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Editor support</td>
              <td className="py-3 pr-4">Excellent (every editor)</td>
              <td className="py-3">VS Code, IntelliJ, Zed, Neovim</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Vue/Svelte/Angular</td>
              <td className="py-3 pr-4">Full support via plugins</td>
              <td className="py-3">Partial (HTML embedded scripts not yet)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Performance: How Much Faster Is Biome?
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Biome is written in Rust and runs as a native binary. It does not
        start a Node.js process, does not load plugins through JavaScript,
        and processes files in parallel by default. In real-world projects,
        Biome typically lints and formats 20-100x faster than ESLint +
        Prettier combined.
      </p>
      <p className="mt-3 text-gray-600 dark:text-gray-400">
        On a 1,000-file TypeScript monorepo, a typical ESLint + Prettier
        run takes 15-30 seconds. Biome finishes the same check in under
        500ms. The difference is most visible in CI pipelines and
        pre-commit hooks, where tool startup time dominates.
      </p>
      <CodeBlock title="Benchmark: 1,000 TypeScript files">{`# ESLint + Prettier
$ time npx eslint . && npx prettier --check .
real    0m24.3s

# Biome
$ time npx @biomejs/biome check .
real    0m0.4s`}</CodeBlock>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        When to Stay on ESLint
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        ESLint is still the right choice in several situations:
      </p>
      <ul className="mt-4 space-y-3 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-400" />
          <span>
            <strong>Vue, Svelte, or Angular projects.</strong> Biome does not
            yet lint code inside <Code>.vue</Code>, <Code>.svelte</Code>, or
            Angular template files. ESLint with framework-specific plugins
            is still required here.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-400" />
          <span>
            <strong>You rely on niche ESLint plugins.</strong> If your
            project depends on plugins like{" "}
            <Code>eslint-plugin-security</Code>,{" "}
            <Code>eslint-plugin-testing-library</Code>, or domain-specific
            rules, check whether Biome covers those rules before switching.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-400" />
          <span>
            <strong>Custom ESLint rules.</strong> If you have written custom
            AST-based ESLint rules specific to your codebase, migrating them
            to Biome&apos;s plugin system requires rewriting in GritQL or
            Rust.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-400" />
          <span>
            <strong>Large team with established ESLint configs.</strong> If
            your team has invested heavily in a shared ESLint config package
            used across dozens of repos, the migration cost may outweigh the
            performance gains — at least until Biome&apos;s plugin ecosystem
            catches up.
          </span>
        </li>
      </ul>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        When to Switch to Biome
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Biome is the better choice if:
      </p>
      <ul className="mt-4 space-y-3 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-400" />
          <span>
            <strong>You are starting a new project.</strong> There is no
            reason to set up ESLint + Prettier + 5 plugins when Biome does
            it all with one dependency and one config file.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-400" />
          <span>
            <strong>CI is slow because of linting.</strong> If ESLint +
            Prettier takes more than a few seconds in your pipeline, Biome
            will cut that to near-zero.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-400" />
          <span>
            <strong>You want to lint CSS and JSON too.</strong> Biome lints
            CSS, JSON, JSONC, and GraphQL with no extra plugins. ESLint
            requires <Code>eslint-plugin-css</Code> or{" "}
            <Code>eslint-plugin-json</Code>, which are community-maintained
            and often lag behind.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-400" />
          <span>
            <strong>Dependency hygiene matters.</strong> A typical ESLint
            setup pulls in 50-200+ transitive dependencies. Biome is a
            single binary with zero JavaScript dependencies. Fewer
            dependencies means fewer supply chain risks and faster installs.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-400" />
          <span>
            <strong>You are tired of config conflicts.</strong> The
            ESLint + Prettier + TypeScript plugin dance is notoriously
            fragile. Biome eliminates entire categories of configuration
            issues because linting and formatting are unified.
          </span>
        </li>
      </ul>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Step-by-Step Migration: ESLint to Biome
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Here is how to migrate an existing ESLint + Prettier setup to Biome:
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Step 1: Install Biome
      </h3>
      <CodeBlock title="Terminal">{`npm install --save-dev --save-exact @biomejs/biome
npx @biomejs/biome init`}</CodeBlock>
      <p className="text-gray-600 dark:text-gray-400">
        This creates a <Code>biome.json</Code> with recommended defaults.
        The <Code>--save-exact</Code> flag pins the version — Biome
        recommends this because minor versions can introduce new lint rules.
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Step 2: Convert Your ESLint Config
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Use the{" "}
        <Link
          href="/tools/eslint-to-biome"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
        >
          ESLint to Biome Converter
        </Link>{" "}
        to translate your existing rules. Paste your <Code>.eslintrc.json</Code>{" "}
        and get a <Code>biome.json</Code> with mapped rules, extracted
        formatter settings, and a list of unsupported rules that need manual
        review.
      </p>
      <p className="mt-3 text-gray-600 dark:text-gray-400">
        Alternatively, Biome has a built-in migration command:
      </p>
      <CodeBlock title="Terminal">{`npx @biomejs/biome migrate eslint`}</CodeBlock>
      <p className="text-gray-600 dark:text-gray-400">
        This reads your ESLint config and appends equivalent Biome rules to{" "}
        <Code>biome.json</Code>. It also runs{" "}
        <Code>migrate prettier</Code> automatically if it detects a Prettier
        config.
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Step 3: Transfer Formatter Settings
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        If you were using Prettier, translate your settings to Biome&apos;s
        formatter section:
      </p>
      <CodeBlock title=".prettierrc (before)">{`{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "all",
  "printWidth": 100,
  "arrowParens": "always"
}`}</CodeBlock>
      <CodeBlock title="biome.json (after)">{`{
  "formatter": {
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  },
  "javascript": {
    "formatter": {
      "semicolons": "always",
      "quoteStyle": "single",
      "trailingCommas": "all",
      "arrowParentheses": "always"
    }
  }
}`}</CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Step 4: Update Your Scripts
      </h3>
      <CodeBlock title="package.json">{`{
  "scripts": {
    "lint": "biome check .",
    "lint:fix": "biome check --write .",
    "format": "biome format --write ."
  }
}`}</CodeBlock>
      <p className="text-gray-600 dark:text-gray-400">
        <Code>biome check</Code> runs linting, formatting, and import
        sorting in a single pass. <Code>--write</Code> applies fixes
        in-place (equivalent to <Code>eslint --fix</Code> +{" "}
        <Code>prettier --write</Code>).
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Step 5: Remove ESLint and Prettier
      </h3>
      <CodeBlock title="Terminal">{`npm uninstall eslint prettier eslint-config-prettier \\
  eslint-plugin-react eslint-plugin-react-hooks \\
  @typescript-eslint/eslint-plugin @typescript-eslint/parser \\
  eslint-plugin-import eslint-plugin-jsx-a11y

rm .eslintrc.json .prettierrc .eslintignore .prettierignore`}</CodeBlock>
      <p className="text-gray-600 dark:text-gray-400">
        Check your <Code>node_modules</Code> size before and after. It is
        common to see a 30-50 MB reduction from removing ESLint&apos;s
        dependency tree.
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Step 6: Update CI and Editor
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Replace ESLint and Prettier steps in CI with{" "}
        <Code>npx @biomejs/biome ci .</Code> (the <Code>ci</Code> command
        is like <Code>check</Code> but exits with a non-zero code on any
        issue). Install the{" "}
        <a
          href="https://marketplace.visualstudio.com/items?itemName=biomejs.biome"
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
        >
          Biome VS Code extension
        </a>{" "}
        and remove the ESLint and Prettier extensions. Set Biome as the
        default formatter in <Code>.vscode/settings.json</Code>:
      </p>
      <CodeBlock title=".vscode/settings.json">{`{
  "editor.defaultFormatter": "biomejs.biome",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "quickfix.biome": "explicit",
    "source.organizeImports.biome": "explicit"
  }
}`}</CodeBlock>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Rule Coverage: What Biome Supports
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Biome v2 ships with 280+ built-in lint rules organized into 8
        categories: <Code>correctness</Code>, <Code>suspicious</Code>,{" "}
        <Code>style</Code>, <Code>complexity</Code>, <Code>a11y</Code>,{" "}
        <Code>security</Code>, <Code>performance</Code>, and{" "}
        <Code>nursery</Code> (experimental). It covers the majority of
        rules from these ESLint packages:
      </p>
      <ul className="mt-4 space-y-2 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-400" />
          <span><strong>ESLint core</strong> — ~60 of the most-used rules</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-400" />
          <span><strong>@typescript-eslint</strong> — 18+ rules including <Code>no-explicit-any</Code>, <Code>no-non-null-assertion</Code>, <Code>consistent-type-imports</Code></span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-400" />
          <span><strong>eslint-plugin-react / react-hooks</strong> — 10+ rules including <Code>jsx-no-duplicate-props</Code>, <Code>rules-of-hooks</Code></span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-400" />
          <span><strong>eslint-plugin-jsx-a11y</strong> — 26+ accessibility rules</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-400" />
          <span><strong>eslint-plugin-import</strong> — import sorting and <Code>no-default-export</Code></span>
        </li>
      </ul>
      <p className="mt-4 text-gray-600 dark:text-gray-400">
        Notable gaps: Biome does not yet have equivalents for every rule in{" "}
        <Code>eslint-plugin-testing-library</Code>,{" "}
        <Code>eslint-plugin-security</Code>, or framework-specific plugins
        for Vue/Svelte/Angular.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Common Migration Pitfalls
      </h2>
      <ul className="mt-4 space-y-3 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-400" />
          <span>
            <strong>Formatting diff noise.</strong> Biome&apos;s formatter is
            Prettier-compatible but not identical. Expect minor whitespace
            differences. Run <Code>biome format --write .</Code> once and
            commit the diff separately to keep your migration commit clean.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-400" />
          <span>
            <strong>Stricter defaults.</strong> Biome&apos;s recommended rules
            are stricter than ESLint defaults. You may see new lint errors
            that ESLint never flagged. Review them — most are legitimate
            issues — or turn off specific rules you disagree with.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-400" />
          <span>
            <strong>Ignore patterns differ.</strong> Biome uses{" "}
            <Code>biome.json</Code>&apos;s <Code>files.ignore</Code> array
            instead of <Code>.eslintignore</Code> / <Code>.prettierignore</Code>.
            Transfer your ignore patterns manually.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-400" />
          <span>
            <strong>Inline disable comments.</strong> ESLint uses{" "}
            <Code>{`// eslint-disable-next-line`}</Code>. Biome uses{" "}
            <Code>{`// biome-ignore lint/ruleName: reason`}</Code>. You
            will need to find and replace these across your codebase.
          </span>
        </li>
      </ul>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Example: Before and After
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Here is a typical React + TypeScript ESLint config converted to Biome:
      </p>
      <CodeBlock title=".eslintrc.json (ESLint)">{`{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
    "prettier"
  ],
  "plugins": ["@typescript-eslint", "react", "import"],
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "react/react-in-jsx-scope": "off",
    "import/order": ["error", {
      "groups": ["builtin", "external", "internal"]
    }]
  }
}`}</CodeBlock>
      <CodeBlock title="biome.json (Biome)">{`{
  "$schema": "https://biomejs.dev/schemas/2.0.0/schema.json",
  "organizeImports": { "enabled": true },
  "formatter": {
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 80
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "correctness": {
        "noUnusedVariables": "error"
      },
      "suspicious": {
        "noExplicitAny": "warn",
        "noConsole": "warn"
      }
    }
  },
  "javascript": {
    "formatter": {
      "semicolons": "always",
      "quoteStyle": "double",
      "trailingCommas": "all"
    }
  }
}`}</CodeBlock>
      <p className="mt-3 text-gray-600 dark:text-gray-400">
        The Biome config is shorter, needs no plugins, and covers linting,
        formatting, and import sorting in one file. The 8 npm packages from
        the ESLint setup are replaced by a single <Code>@biomejs/biome</Code>{" "}
        dependency.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Running Both Side by Side
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        If you cannot migrate all at once, Biome can run alongside ESLint.
        Use Biome for formatting only (replacing Prettier) while keeping
        ESLint for linting. This is a low-risk first step:
      </p>
      <CodeBlock title="package.json">{`{
  "scripts": {
    "lint": "eslint .",
    "format": "biome format --write .",
    "check": "biome format . && eslint ."
  }
}`}</CodeBlock>
      <p className="mt-3 text-gray-600 dark:text-gray-400">
        Once you are comfortable with Biome&apos;s formatting, enable
        Biome&apos;s linter for the rules it covers and gradually disable
        the equivalent ESLint rules. This phased approach reduces risk for
        larger teams.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        The Bottom Line
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        ESLint is mature, flexible, and has unmatched plugin coverage. Biome
        is fast, simple, and eliminates entire categories of tooling
        complexity. For new projects and React/TypeScript codebases, Biome
        v2 is the better default in 2026. For projects that depend on
        framework-specific ESLint plugins or extensive custom rules, ESLint
        remains the safer choice — for now.
      </p>
      <p className="mt-3 text-gray-600 dark:text-gray-400">
        Ready to migrate? Use the{" "}
        <Link
          href="/tools/eslint-to-biome"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
        >
          ESLint to Biome Converter
        </Link>{" "}
        to translate your config automatically, and check the{" "}
        <Link
          href="/tools/eslint-to-biome/biome-rule-mapping"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
        >
          Biome Rule Mapping Reference
        </Link>{" "}
        to see exactly which ESLint rules have Biome equivalents.
      </p>

      <div className="my-12 rounded-xl border border-blue-200 bg-blue-50/50 p-6 dark:border-blue-900 dark:bg-blue-950/30">
        <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">
          Deploying your linted code to production?
        </p>
        <p className="mt-2 text-sm text-blue-800 dark:text-blue-400">
          <a
            href="https://www.digitalocean.com/products/app-platform"
            target="_blank"
            rel="noopener sponsored"
            className="font-medium underline hover:no-underline"
          >
            DigitalOcean App Platform
          </a>{" "}
          deploys Node.js, Next.js, and static sites with built-in CI/CD
          that runs your Biome checks automatically. Start with $200 free
          credit.
        </p>
      </div>
    </>
  );
}
