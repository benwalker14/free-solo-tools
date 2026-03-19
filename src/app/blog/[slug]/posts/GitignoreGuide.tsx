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

export default function GitignoreGuide() {
  return (
    <>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        A <Code>.gitignore</Code> file tells Git which files and directories to
        exclude from version control. Getting it right prevents accidental
        commits of build artifacts, secrets, and system files. This guide
        covers the syntax, common patterns, and ready-to-use templates for
        popular frameworks.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        How .gitignore Works
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        When you run <Code>git add</Code> or <Code>git status</Code>, Git
        checks each file against your <Code>.gitignore</Code> patterns. If a
        file matches, Git pretends it doesn&apos;t exist — it won&apos;t be
        tracked, staged, or committed.
      </p>
      <p className="mt-4 text-gray-600 dark:text-gray-400">
        Create a <Code>.gitignore</Code> file in the root of your repository.
        Git reads it automatically — no configuration needed.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Pattern Syntax
      </h2>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Basic Patterns
      </h3>
      <CodeBlock title=".gitignore">
        {`# Ignore a specific file
secrets.json

# Ignore all files with an extension
*.log
*.tmp

# Ignore a directory (trailing slash)
node_modules/
dist/
build/

# Ignore files in any subdirectory
**/*.pyc`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Wildcards and Patterns
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800">
              <th className="py-3 pr-4 text-left font-semibold text-gray-900 dark:text-white">
                Pattern
              </th>
              <th className="py-3 pr-4 text-left font-semibold text-gray-900 dark:text-white">
                Matches
              </th>
              <th className="py-3 text-left font-semibold text-gray-900 dark:text-white">
                Example
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-600 dark:text-gray-400">
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4"><Code>*</Code></td>
              <td className="py-3 pr-4">Any characters except /</td>
              <td className="py-3"><Code>*.log</Code> matches <Code>error.log</Code></td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4"><Code>**</Code></td>
              <td className="py-3 pr-4">Any directory depth</td>
              <td className="py-3"><Code>**/test</Code> matches <Code>src/test</Code></td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4"><Code>?</Code></td>
              <td className="py-3 pr-4">Any single character</td>
              <td className="py-3"><Code>file?.txt</Code> matches <Code>file1.txt</Code></td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4"><Code>[abc]</Code></td>
              <td className="py-3 pr-4">Any character in set</td>
              <td className="py-3"><Code>file[0-9].txt</Code> matches <Code>file3.txt</Code></td>
            </tr>
            <tr>
              <td className="py-3 pr-4"><Code>!</Code></td>
              <td className="py-3 pr-4">Negation (un-ignore)</td>
              <td className="py-3"><Code>!important.log</Code> tracks that file</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Negation: The Exception Rule
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Use <Code>!</Code> to un-ignore specific files inside an ignored
        directory or pattern:
      </p>
      <CodeBlock title=".gitignore">
        {`# Ignore all log files
*.log

# But keep this one
!important.log

# Ignore build directory
build/

# But keep the README inside it
!build/README.md`}
      </CodeBlock>
      <p className="text-gray-600 dark:text-gray-400">
        Note: You can&apos;t un-ignore a file if its parent directory is
        ignored. To work around this, un-ignore the directory first, then
        ignore its contents, then un-ignore the specific file.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Templates by Framework
      </h2>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Node.js / JavaScript
      </h3>
      <CodeBlock title=".gitignore">
        {`node_modules/
dist/
build/
.next/
.nuxt/
coverage/
*.log
.env
.env.local
.env.*.local`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Python
      </h3>
      <CodeBlock title=".gitignore">
        {`__pycache__/
*.py[cod]
*.egg-info/
dist/
build/
.venv/
venv/
.env
*.sqlite3
.pytest_cache/
.mypy_cache/`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Go
      </h3>
      <CodeBlock title=".gitignore">
        {`# Binary
/bin/
*.exe

# Vendor (if not committing deps)
/vendor/

# IDE
.idea/
.vscode/

# OS
.DS_Store
Thumbs.db`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Rust
      </h3>
      <CodeBlock title=".gitignore">
        {`/target/
Cargo.lock  # for libraries only, commit for binaries
*.pdb`}
      </CodeBlock>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Files You Should Always Ignore
      </h2>
      <p className="mb-4 text-gray-600 dark:text-gray-400">
        Regardless of your stack, these should be in every{" "}
        <Code>.gitignore</Code>:
      </p>

      <h3 className="mt-6 mb-3 text-lg font-semibold text-gray-900 dark:text-white">
        Secrets and Environment Files
      </h3>
      <CodeBlock title=".gitignore">
        {`.env
.env.local
.env.*.local
*.pem
*.key
credentials.json
service-account.json`}
      </CodeBlock>
      <p className="text-gray-600 dark:text-gray-400">
        <strong className="text-gray-900 dark:text-white">This is critical.</strong>{" "}
        Accidentally committing API keys, database passwords, or private keys
        is one of the most common security incidents. Even if you delete the
        file later, it remains in Git history forever.
      </p>

      <h3 className="mt-6 mb-3 text-lg font-semibold text-gray-900 dark:text-white">
        OS and Editor Files
      </h3>
      <CodeBlock title=".gitignore">
        {`# macOS
.DS_Store
._*

# Windows
Thumbs.db
Desktop.ini

# Editors
.idea/
.vscode/
*.swp
*.swo
*~`}
      </CodeBlock>

      <h3 className="mt-6 mb-3 text-lg font-semibold text-gray-900 dark:text-white">
        Build Outputs and Dependencies
      </h3>
      <CodeBlock title=".gitignore">
        {`node_modules/
dist/
build/
out/
coverage/
*.min.js
*.min.css`}
      </CodeBlock>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Common Mistakes
      </h2>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Adding .gitignore After Committing Files
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        <Code>.gitignore</Code> only prevents <em>untracked</em> files from
        being added. If a file is already tracked by Git, adding it to{" "}
        <Code>.gitignore</Code> won&apos;t remove it. You need to untrack it
        first:
      </p>
      <CodeBlock title="Terminal">
        {`# Remove from Git tracking (keeps local file)
git rm --cached .env

# For directories
git rm -r --cached node_modules/

# Then commit
git commit -m "Remove tracked files that should be ignored"`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Ignoring Lock Files
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        <strong className="text-gray-900 dark:text-white">Do not ignore lock files.</strong>{" "}
        Files like <Code>package-lock.json</Code>, <Code>yarn.lock</Code>,{" "}
        <Code>pnpm-lock.yaml</Code>, <Code>Gemfile.lock</Code>, and{" "}
        <Code>poetry.lock</Code> should be committed. They ensure everyone on
        your team gets the same dependency versions.
      </p>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        The exception is <Code>Cargo.lock</Code> for Rust libraries (not
        binaries), since library consumers resolve their own dependencies.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Global .gitignore
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        For personal files (editor configs, OS files) that apply to all your
        repos, use a global gitignore instead of adding them to every project:
      </p>
      <CodeBlock title="Terminal">
        {`# Create a global gitignore
git config --global core.excludesFile ~/.gitignore_global

# Then add your patterns to ~/.gitignore_global
echo ".DS_Store" >> ~/.gitignore_global
echo ".idea/" >> ~/.gitignore_global`}
      </CodeBlock>
      <p className="text-gray-600 dark:text-gray-400">
        This keeps project <Code>.gitignore</Code> files clean and focused on
        project-specific patterns.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Debugging: Check If a File Is Ignored
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Use <Code>git check-ignore</Code> to see if and why a file is ignored:
      </p>
      <CodeBlock title="Terminal">
        {`# Check if a file is ignored
git check-ignore -v path/to/file

# Output shows which .gitignore file and line caused the match
# .gitignore:3:*.log    path/to/debug.log`}
      </CodeBlock>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Generate Your .gitignore
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Use our{" "}
        <Link
          href="/tools/gitignore-generator"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          .gitignore Generator
        </Link>{" "}
        to create a complete <Code>.gitignore</Code> file for your tech stack
        in seconds. Select your languages, frameworks, and editors, and get a
        ready-to-use file. You can also validate your existing{" "}
        <Code>.env</Code> files with our{" "}
        <Link
          href="/tools/env-validator"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          .env File Validator
        </Link>{" "}
        to catch exposed secrets before they reach your repo.
      </p>
    </>
  );
}
