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

export default function DockerBestPractices() {
  return (
    <>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        A well-written Dockerfile is the difference between a 1.2GB image that
        takes five minutes to build and a 50MB image that builds in seconds.
        This guide covers the practices that actually matter &mdash; multi-stage
        builds, layer caching, security, and the mistakes that silently bloat
        your containers.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Start with the Right Base Image
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Your base image determines your starting size and attack surface. Choose
        the smallest image that has what you need:
      </p>
      <ul className="mt-4 space-y-2 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Alpine variants</strong>{" "}
            (<Code>node:22-alpine</Code>, <Code>python:3.13-alpine</Code>) &mdash;
            ~5MB base. Great when it works, but musl libc can cause issues with
            some native modules.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Slim variants</strong>{" "}
            (<Code>node:22-slim</Code>, <Code>python:3.13-slim</Code>) &mdash;
            ~80MB base. Debian-based, fewer compatibility issues than Alpine.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Distroless</strong>{" "}
            (<Code>gcr.io/distroless/nodejs22</Code>) &mdash; no shell, no
            package manager. Minimal attack surface for production.
          </span>
        </li>
      </ul>
      <p className="mt-4 text-gray-600 dark:text-gray-400">
        Always pin a specific version. <Code>FROM node:latest</Code> today might
        break your build tomorrow.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Multi-Stage Builds
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Multi-stage builds are the single most impactful optimization. Build in
        one stage, copy only what you need to a minimal runtime stage:
      </p>
      <CodeBlock title="Dockerfile">
        {`# Stage 1: Build
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy only what's needed to run
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/index.js"]`}
      </CodeBlock>
      <p className="text-gray-600 dark:text-gray-400">
        The final image doesn&apos;t include source code, devDependencies, or
        build tools. For a typical Node.js app, this can cut image size by 60-80%.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Layer Caching: Order Matters
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Docker caches each layer. When a layer changes, all subsequent layers
        are rebuilt. Put things that change <em>least</em> first:
      </p>
      <CodeBlock title="Dockerfile">
        {`# GOOD: Dependencies change less often than source code
COPY package*.json ./
RUN npm ci
COPY . .

# BAD: Copying everything first busts the cache every time
COPY . .
RUN npm ci`}
      </CodeBlock>
      <p className="text-gray-600 dark:text-gray-400">
        With the good order, changing a source file won&apos;t re-download all
        your npm packages. The <Code>npm ci</Code> layer stays cached.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Use .dockerignore
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Without a <Code>.dockerignore</Code>, <Code>COPY . .</Code> sends
        everything to the Docker daemon &mdash; including{" "}
        <Code>node_modules</Code>, <Code>.git</Code>, and test files:
      </p>
      <CodeBlock title=".dockerignore">
        {`node_modules
.git
.gitignore
*.md
Dockerfile
docker-compose*.yml
.env*
.DS_Store
coverage
.nyc_output
dist`}
      </CodeBlock>
      <p className="text-gray-600 dark:text-gray-400">
        This speeds up build context transfer and prevents accidentally leaking
        secrets into the image.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Security Best Practices
      </h2>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Don&apos;t run as root
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Containers run as root by default. If an attacker escapes the
        application, they have root access to the container:
      </p>
      <CodeBlock title="Dockerfile">
        {`# Create a non-root user
RUN addgroup --system appgroup && \\
    adduser --system --ingroup appgroup appuser

# Copy files with correct ownership
COPY --from=builder --chown=appuser:appgroup /app ./

# Switch to non-root
USER appuser

CMD ["node", "dist/index.js"]`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Never put secrets in the image
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Even if you delete a secret in a later layer, it&apos;s still visible
        in the image history. Use build-time secrets or runtime environment
        variables:
      </p>
      <CodeBlock title="Dockerfile">
        {`# BAD: Secret is baked into a layer
COPY .env .
RUN source .env && npm run build

# GOOD: Use Docker BuildKit secrets
RUN --mount=type=secret,id=env,target=.env \\
    source .env && npm run build`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Scan for vulnerabilities
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Run <Code>docker scout quickview</Code> or{" "}
        <Code>trivy image myapp:latest</Code> to check for known CVEs in your
        base image and installed packages. Do this in CI, not just locally.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Reduce Layer Count
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Each <Code>RUN</Code>, <Code>COPY</Code>, and <Code>ADD</Code>{" "}
        instruction creates a new layer. Combine related commands:
      </p>
      <CodeBlock title="Dockerfile">
        {`# BAD: 3 layers
RUN apt-get update
RUN apt-get install -y curl
RUN rm -rf /var/lib/apt/lists/*

# GOOD: 1 layer, and cleanup in the same layer
RUN apt-get update && \\
    apt-get install -y --no-install-recommends curl && \\
    rm -rf /var/lib/apt/lists/*`}
      </CodeBlock>
      <p className="text-gray-600 dark:text-gray-400">
        The <Code>--no-install-recommends</Code> flag prevents apt from pulling
        in packages you don&apos;t need. Cleaning up in the same{" "}
        <Code>RUN</Code> removes the apt cache from the layer entirely.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Health Checks
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Add a <Code>HEALTHCHECK</Code> so Docker (and orchestrators like
        Kubernetes) know when your container is actually ready:
      </p>
      <CodeBlock title="Dockerfile">
        {`HEALTHCHECK --interval=30s --timeout=3s --retries=3 \\
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1`}
      </CodeBlock>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Common Mistakes
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800">
              <th className="py-3 pr-4 text-left font-semibold text-gray-900 dark:text-white">
                Mistake
              </th>
              <th className="py-3 text-left font-semibold text-gray-900 dark:text-white">
                Fix
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-600 dark:text-gray-400">
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4">Using <Code>:latest</Code> tag</td>
              <td className="py-3">Pin specific version (<Code>node:22.5-alpine</Code>)</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4"><Code>npm install</Code> in production</td>
              <td className="py-3">Use <Code>npm ci</Code> for deterministic installs</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4">No <Code>.dockerignore</Code></td>
              <td className="py-3">Always create one to exclude <Code>.git</Code>, <Code>node_modules</Code>, etc.</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4">Copying secrets into the image</td>
              <td className="py-3">Use BuildKit secrets or runtime env vars</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4">Running as root</td>
              <td className="py-3">Add <Code>USER</Code> instruction</td>
            </tr>
            <tr>
              <td className="py-3 pr-4">Installing dev dependencies in production</td>
              <td className="py-3">Use multi-stage builds or <Code>npm ci --omit=dev</Code></td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Validate Your Dockerfiles
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Use our{" "}
        <Link
          href="/tools/dockerfile-validator"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          Dockerfile Validator
        </Link>{" "}
        to check for syntax errors, security issues, and best practices
        violations. For multi-container setups, try the{" "}
        <Link
          href="/tools/docker-compose"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          Docker Compose Validator
        </Link>
        . Both tools run entirely in your browser.
      </p>
    </>
  );
}
