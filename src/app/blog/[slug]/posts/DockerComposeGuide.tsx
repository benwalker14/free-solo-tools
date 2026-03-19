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

export default function DockerComposeGuide() {
  return (
    <>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        Docker Compose lets you define and run multi-container applications with
        a single YAML file. Instead of running multiple <Code>docker run</Code>{" "}
        commands with dozens of flags, you describe your entire stack
        declaratively and bring it up with one command.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Your First Compose File
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        A <Code>compose.yaml</Code> file defines services (containers),
        networks, and volumes:
      </p>
      <CodeBlock title="compose.yaml">
        {`services:
  web:
    image: nginx:alpine
    ports:
      - "8080:80"
    volumes:
      - ./html:/usr/share/nginx/html

  api:
    build: ./api
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgres://user:pass@db:5432/myapp
    depends_on:
      - db

  db:
    image: postgres:16
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: myapp
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:`}
      </CodeBlock>
      <p className="text-gray-600 dark:text-gray-400">
        Run it with <Code>docker compose up</Code> and you have an Nginx web
        server, a Node.js API, and a PostgreSQL database — all networked
        together automatically.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Essential Commands
      </h2>
      <CodeBlock title="Terminal">
        {`# Start all services (foreground)
docker compose up

# Start in background (detached)
docker compose up -d

# Stop all services
docker compose down

# Stop and remove volumes (clean slate)
docker compose down -v

# Rebuild images before starting
docker compose up --build

# View logs
docker compose logs
docker compose logs api        # specific service
docker compose logs -f         # follow (live)

# Run a one-off command in a service
docker compose exec db psql -U user -d myapp
docker compose run api npm test

# Scale a service
docker compose up -d --scale worker=3

# Show running services
docker compose ps`}
      </CodeBlock>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Key Concepts
      </h2>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Services
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Each service becomes a container. You can use a pre-built image or
        build from a Dockerfile:
      </p>
      <CodeBlock title="compose.yaml">
        {`services:
  # Pre-built image from Docker Hub
  redis:
    image: redis:7-alpine

  # Build from a Dockerfile
  api:
    build:
      context: ./api
      dockerfile: Dockerfile
      args:
        NODE_ENV: production`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Ports
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Map host ports to container ports with <Code>HOST:CONTAINER</Code>:
      </p>
      <CodeBlock title="compose.yaml">
        {`ports:
  - "3000:3000"         # same port
  - "8080:80"           # host 8080 → container 80
  - "127.0.0.1:9090:80" # bind to localhost only`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Volumes
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Persist data and share files between host and container:
      </p>
      <CodeBlock title="compose.yaml">
        {`services:
  api:
    volumes:
      # Bind mount: host path → container path
      - ./src:/app/src

      # Named volume: managed by Docker
      - node_modules:/app/node_modules

  db:
    volumes:
      # Named volume for database persistence
      - pgdata:/var/lib/postgresql/data

# Declare named volumes
volumes:
  pgdata:
  node_modules:`}
      </CodeBlock>
      <p className="text-gray-600 dark:text-gray-400">
        Named volumes survive <Code>docker compose down</Code>. Bind mounts
        are great for development (live code reloading) but shouldn&apos;t be
        used in production.
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Environment Variables
      </h3>
      <CodeBlock title="compose.yaml">
        {`services:
  api:
    # Inline
    environment:
      - NODE_ENV=production
      - API_KEY=secret123

    # From a file
    env_file:
      - .env
      - .env.local`}
      </CodeBlock>
      <p className="text-gray-600 dark:text-gray-400">
        Use <Code>env_file</Code> for sensitive values — don&apos;t commit{" "}
        <Code>.env</Code> files to git. See our{" "}
        <Link
          href="/blog/gitignore-guide"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          .gitignore guide
        </Link>{" "}
        for what to exclude.
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        depends_on
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Control startup order. The basic form waits for the container to start,
        but not for it to be &quot;ready&quot;:
      </p>
      <CodeBlock title="compose.yaml">
        {`services:
  api:
    depends_on:
      # Basic: just wait for container to start
      - redis

      # With health check: wait until healthy
      db:
        condition: service_healthy

  db:
    image: postgres:16
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user"]
      interval: 5s
      timeout: 5s
      retries: 5`}
      </CodeBlock>
      <p className="text-gray-600 dark:text-gray-400">
        Always use <Code>condition: service_healthy</Code> for databases. A
        started PostgreSQL container isn&apos;t ready to accept connections for
        several seconds.
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Networks
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        By default, all services in a Compose file share a network and can
        reach each other by service name. You can define separate networks for
        isolation:
      </p>
      <CodeBlock title="compose.yaml">
        {`services:
  web:
    networks:
      - frontend

  api:
    networks:
      - frontend
      - backend

  db:
    networks:
      - backend    # not reachable from web

networks:
  frontend:
  backend:`}
      </CodeBlock>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Common Stack Templates
      </h2>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Node.js + PostgreSQL + Redis
      </h3>
      <CodeBlock title="compose.yaml">
        {`services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgres://user:pass@db:5432/app
      REDIS_URL: redis://cache:6379
    depends_on:
      db:
        condition: service_healthy
      cache:
        condition: service_started
    volumes:
      - ./src:/app/src  # hot reload in dev

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: app
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user"]
      interval: 5s
      timeout: 5s
      retries: 5

  cache:
    image: redis:7-alpine
    command: redis-server --maxmemory 64mb --maxmemory-policy allkeys-lru

volumes:
  pgdata:`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        WordPress + MySQL
      </h3>
      <CodeBlock title="compose.yaml">
        {`services:
  wordpress:
    image: wordpress:latest
    ports:
      - "8080:80"
    environment:
      WORDPRESS_DB_HOST: db
      WORDPRESS_DB_USER: wp
      WORDPRESS_DB_PASSWORD: secret
      WORDPRESS_DB_NAME: wordpress
    volumes:
      - wp_data:/var/www/html
    depends_on:
      db:
        condition: service_healthy

  db:
    image: mysql:8
    environment:
      MYSQL_ROOT_PASSWORD: rootsecret
      MYSQL_DATABASE: wordpress
      MYSQL_USER: wp
      MYSQL_PASSWORD: secret
    volumes:
      - db_data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  wp_data:
  db_data:`}
      </CodeBlock>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Development vs Production
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Use override files to separate dev and prod configuration:
      </p>
      <CodeBlock title="compose.yaml (base)">
        {`services:
  api:
    build: .
    environment:
      - NODE_ENV=production`}
      </CodeBlock>
      <CodeBlock title="compose.override.yaml (dev — auto-loaded)">
        {`services:
  api:
    build:
      target: development
    volumes:
      - ./src:/app/src
    environment:
      - NODE_ENV=development
      - DEBUG=true
    ports:
      - "9229:9229"  # Node.js debugger`}
      </CodeBlock>
      <p className="text-gray-600 dark:text-gray-400">
        Docker Compose automatically merges <Code>compose.override.yaml</Code>{" "}
        on top of <Code>compose.yaml</Code>. For production, use an explicit
        file: <Code>docker compose -f compose.yaml -f compose.prod.yaml up</Code>.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Resource Limits
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Prevent any service from consuming all host resources:
      </p>
      <CodeBlock title="compose.yaml">
        {`services:
  api:
    deploy:
      resources:
        limits:
          cpus: "1.0"
          memory: 512M
        reservations:
          cpus: "0.25"
          memory: 128M

  worker:
    deploy:
      replicas: 3  # run 3 instances
      restart_policy:
        condition: on-failure
        max_attempts: 3`}
      </CodeBlock>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Common Mistakes
      </h2>
      <ul className="space-y-4 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Assuming depends_on means &quot;ready.&quot;</strong>{" "}
            Without a health check, <Code>depends_on</Code> only waits for the
            container to start. Your database might not be accepting connections
            yet. Always add <Code>healthcheck</Code> and{" "}
            <Code>condition: service_healthy</Code>.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Bind-mounting node_modules.</strong>{" "}
            Mounting <Code>./:/app</Code> overwrites the container&apos;s{" "}
            <Code>node_modules</Code> with your host&apos;s (or empty)
            directory. Use a named volume for <Code>node_modules</Code> to
            prevent this.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Hardcoding secrets in compose files.</strong>{" "}
            Use <Code>env_file</Code> and add <Code>.env</Code> to{" "}
            <Code>.gitignore</Code>. For production, use Docker secrets or
            external secret managers.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Using <Code>latest</Code> tag in production.</strong>{" "}
            Always pin image versions (<Code>postgres:16</Code> not{" "}
            <Code>postgres:latest</Code>). The <Code>latest</Code> tag can
            change at any time and break your stack.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Forgetting to declare volumes.</strong>{" "}
            Named volumes must be declared in the top-level{" "}
            <Code>volumes:</Code> section, not just referenced in services.
            Docker Compose may create anonymous volumes instead, which are
            easily lost.
          </span>
        </li>
      </ul>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        docker-compose.yml vs compose.yaml
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        The modern filename is <Code>compose.yaml</Code> (recommended by
        Docker). The old <Code>docker-compose.yml</Code> still works but is
        considered legacy. Similarly, use <Code>docker compose</Code> (with a
        space) instead of <Code>docker-compose</Code> (with a hyphen) — the
        latter is the standalone v1 binary which is no longer maintained.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Try It Yourself
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Use our{" "}
        <Link
          href="/tools/docker-compose"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          Docker Compose Validator
        </Link>{" "}
        to validate your compose files for syntax errors, missing
        dependencies, and best practices. Building a Dockerfile? The{" "}
        <Link
          href="/tools/dockerfile-validator"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          Dockerfile Validator
        </Link>{" "}
        checks for security issues, layer optimization, and common mistakes.
        And for validating your environment variables, try the{" "}
        <Link
          href="/tools/env-validator"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          .env File Validator
        </Link>
        .
      </p>
    </>
  );
}
