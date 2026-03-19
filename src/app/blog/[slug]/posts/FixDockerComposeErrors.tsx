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

export default function FixDockerComposeErrors() {
  return (
    <>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        Docker Compose errors are almost always caused by YAML syntax mistakes or
        configuration misunderstandings. The most common culprits: indentation
        errors (tabs instead of spaces), wrong value types in port mappings,
        missing required fields, and version conflicts between Compose V1 and V2.
        This guide decodes the error messages, shows you the 10 most frequent
        mistakes, and gives you a step-by-step debugging workflow.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Docker Compose Error Messages Decoded
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Docker Compose error messages are notoriously cryptic. Here are the most
        common ones and what they actually mean:
      </p>
      <CodeBlock title="Terminal">
        {`yaml: line 8: found character that cannot start any token`}
      </CodeBlock>
      <p className="text-gray-600 dark:text-gray-400">
        This almost always means you have a tab character somewhere in your YAML.
        YAML forbids tabs for indentation &mdash; only spaces are allowed. Your
        editor may have inserted a tab without you noticing.
      </p>
      <CodeBlock title="Terminal">
        {`services.web.ports must be a list`}
      </CodeBlock>
      <p className="text-gray-600 dark:text-gray-400">
        You wrote <Code>ports: &quot;8080:80&quot;</Code> as a scalar value
        instead of a list. Ports must always be a YAML list (with{" "}
        <Code>-</Code> dashes).
      </p>
      <CodeBlock title="Terminal">
        {`services.api.depends_on contains an invalid type, it should be an array`}
      </CodeBlock>
      <p className="text-gray-600 dark:text-gray-400">
        You mixed up the short syntax (array of strings) with the long syntax
        (map with conditions). You can&apos;t combine both in the same{" "}
        <Code>depends_on</Code> block.
      </p>
      <CodeBlock title="Terminal">
        {`service "web" refers to undefined volume "app_data"`}
      </CodeBlock>
      <p className="text-gray-600 dark:text-gray-400">
        You referenced a named volume in a service but forgot to declare it in
        the top-level <Code>volumes:</Code> section.
      </p>
      <CodeBlock title="Terminal">
        {`yaml: unmarshal errors:
  line 3: cannot unmarshal !!str into compose.ServiceConfig`}
      </CodeBlock>
      <p className="text-gray-600 dark:text-gray-400">
        Docker expected a mapping (key-value pairs) but found a plain string.
        This usually means your indentation is wrong and a service definition
        is being parsed as a value instead of a nested object.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        The 10 Most Common Docker Compose Errors
      </h2>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        1. YAML Indentation Errors (Tabs vs Spaces)
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        The number one cause of Docker Compose failures. YAML requires spaces
        for indentation &mdash; tabs are illegal. Most editors default to tabs,
        so a single invisible tab character breaks your entire file.
      </p>
      <CodeBlock title="Wrong">
        {`services:
\tweb:                # tab character - YAML parser will reject this
\t\timage: nginx`}
      </CodeBlock>
      <CodeBlock title="Correct">
        {`services:
  web:                # two spaces
    image: nginx`}
      </CodeBlock>
      <p className="text-gray-600 dark:text-gray-400">
        <strong className="text-gray-900 dark:text-white">Fix:</strong> Configure
        your editor to insert spaces when you press Tab. In VS Code, set{" "}
        <Code>&quot;editor.insertSpaces&quot;: true</Code> and use 2-space
        indentation for YAML files. Run your file through our{" "}
        <Link
          href="/tools/yaml-formatter"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          YAML Formatter
        </Link>{" "}
        to catch invisible tab characters.
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        2. Invalid Port Format
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Port mappings in Docker Compose have a subtle gotcha: YAML interprets{" "}
        <Code>80:80</Code> as a base-60 number (sexagesimal), not a string. You
        must quote port mappings or the parser will silently convert them to an
        integer.
      </p>
      <CodeBlock title="Wrong">
        {`ports:
  - 80:80              # parsed as integer 4880, not "80:80"
  - 8080:80            # parsed as integer 488480`}
      </CodeBlock>
      <CodeBlock title="Correct">
        {`ports:
  - "80:80"            # quoted string
  - "8080:80"
  - "127.0.0.1:3000:3000"

# Or use long syntax:
ports:
  - target: 80
    published: 8080
    protocol: tcp`}
      </CodeBlock>
      <p className="text-gray-600 dark:text-gray-400">
        <strong className="text-gray-900 dark:text-white">Fix:</strong> Always
        wrap port mappings in quotes. This applies to any value containing a
        colon that should remain a string.
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        3. Wrong <Code>version</Code> Field
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        The <Code>version</Code> field at the top of a Compose file was required
        in Compose V1 but is deprecated in Compose V2. It still causes
        confusion because old tutorials tell you to include it, and newer
        versions of Docker Compose will print warnings or ignore features based
        on the version you specify.
      </p>
      <CodeBlock title="Outdated (V1-era)">
        {`version: "3.8"       # deprecated in Compose V2
services:
  web:
    image: nginx`}
      </CodeBlock>
      <CodeBlock title="Modern (Compose V2)">
        {`services:            # no version field needed
  web:
    image: nginx`}
      </CodeBlock>
      <p className="text-gray-600 dark:text-gray-400">
        <strong className="text-gray-900 dark:text-white">Fix:</strong> If you
        are using Docker Compose V2 (the <Code>docker compose</Code> command
        with a space), remove the <Code>version</Code> field entirely. It does
        nothing and may trigger misleading warnings.
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        4. Missing or Invalid <Code>services</Code> Top-Level Key
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Every Compose file needs a <Code>services</Code> key at the root level.
        A common mistake is putting service definitions directly at the top level
        or misspelling <Code>services</Code>.
      </p>
      <CodeBlock title="Wrong">
        {`web:                   # missing "services:" parent key
  image: nginx
  ports:
    - "80:80"`}
      </CodeBlock>
      <CodeBlock title="Correct">
        {`services:
  web:
    image: nginx
    ports:
      - "80:80"`}
      </CodeBlock>
      <p className="text-gray-600 dark:text-gray-400">
        <strong className="text-gray-900 dark:text-white">Fix:</strong> Make sure{" "}
        <Code>services:</Code> is at the root level of your file, with all
        service definitions indented beneath it.
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        5. Volume Mount Path Errors
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Volume mounts break in several ways: relative paths that don&apos;t
        resolve correctly, Windows-style backslashes, and forgetting to declare
        named volumes.
      </p>
      <CodeBlock title="Common mistakes">
        {`volumes:
  # Windows backslashes - won't work
  - C:\\Users\\me\\app:/app

  # Missing named volume declaration
  - mydata:/var/lib/data     # error if not declared in top-level volumes

  # Relative path that doesn't exist
  - ../shared:/app/shared    # fails if ../shared doesn't exist on host`}
      </CodeBlock>
      <CodeBlock title="Correct">
        {`services:
  api:
    volumes:
      - ./src:/app/src               # relative bind mount
      - /home/me/app:/app            # absolute bind mount
      - mydata:/var/lib/data         # named volume

volumes:
  mydata:                            # must be declared here`}
      </CodeBlock>
      <p className="text-gray-600 dark:text-gray-400">
        <strong className="text-gray-900 dark:text-white">Fix:</strong> Use
        forward slashes even on Windows (Docker translates them). Always declare
        named volumes in the top-level <Code>volumes:</Code> section. Use{" "}
        <Code>./</Code> to make relative paths explicit.
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        6. Environment Variable Syntax Errors
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Docker Compose supports two environment variable formats, and mixing them
        up causes subtle bugs. The list format uses <Code>=</Code> while the map
        format uses <Code>:</Code>.
      </p>
      <CodeBlock title="List syntax (with =)">
        {`environment:
  - NODE_ENV=production
  - DATABASE_URL=postgres://user:pass@db:5432/app`}
      </CodeBlock>
      <CodeBlock title="Map syntax (with :)">
        {`environment:
  NODE_ENV: production
  DATABASE_URL: postgres://user:pass@db:5432/app`}
      </CodeBlock>
      <CodeBlock title="Wrong (mixed syntax)">
        {`environment:
  - NODE_ENV: production       # combining - (list) with : (map) = error
  DATABASE_URL=postgres://...  # missing - dash for list item`}
      </CodeBlock>
      <p className="text-gray-600 dark:text-gray-400">
        <strong className="text-gray-900 dark:text-white">Fix:</strong> Pick one
        format and stick with it. For values containing special characters, use{" "}
        <Code>env_file</Code> and load from an external <Code>.env</Code> file.
        Validate your env files with our{" "}
        <Link
          href="/tools/env-validator"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          .env File Validator
        </Link>
        .
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        7. <Code>depends_on</Code> Condition vs Short Syntax
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        The <Code>depends_on</Code> field has two forms. The short syntax is an
        array of service names. The long syntax is a map with conditions. You
        cannot mix them, and trying to use conditions with the short syntax
        silently does nothing.
      </p>
      <CodeBlock title="Short syntax (starts container, doesn't wait for ready)">
        {`depends_on:
  - db
  - redis`}
      </CodeBlock>
      <CodeBlock title="Long syntax with conditions (Compose V2)">
        {`depends_on:
  db:
    condition: service_healthy
    restart: true              # restart this service if db restarts
  redis:
    condition: service_started`}
      </CodeBlock>
      <p className="text-gray-600 dark:text-gray-400">
        <strong className="text-gray-900 dark:text-white">Fix:</strong> If your
        app crashes because the database isn&apos;t ready, switch to the long
        syntax with <Code>condition: service_healthy</Code> and add a{" "}
        <Code>healthcheck</Code> to the database service. The short syntax only
        guarantees the container has started, not that the process inside is
        accepting connections.
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        8. Network Configuration Errors
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Custom networks are powerful but easy to misconfigure. The most common
        mistakes are referencing an external network that doesn&apos;t exist or
        specifying an invalid driver.
      </p>
      <CodeBlock title="Wrong">
        {`networks:
  mynet:
    external: true         # fails if "mynet" doesn't already exist

# Also wrong:
services:
  web:
    networks:
      - nonexistent        # network not declared in top-level networks`}
      </CodeBlock>
      <CodeBlock title="Correct">
        {`# Create the network if it doesn't exist:
networks:
  frontend:
    driver: bridge
  backend:
    driver: bridge

# Or for pre-existing networks:
networks:
  proxy_net:
    external: true         # must exist: docker network create proxy_net`}
      </CodeBlock>
      <p className="text-gray-600 dark:text-gray-400">
        <strong className="text-gray-900 dark:text-white">Fix:</strong> Declare
        all networks in the top-level <Code>networks:</Code> section. If using{" "}
        <Code>external: true</Code>, create the network first with{" "}
        <Code>docker network create</Code>.
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        9. Build Context Errors
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        When using <Code>build</Code> instead of <Code>image</Code>, the context
        path and Dockerfile location must be correct relative to the Compose
        file.
      </p>
      <CodeBlock title="Wrong">
        {`services:
  api:
    build: /api            # absolute path, probably not what you want
    # or
    build:
      context: ./api
      dockerfile: api/Dockerfile  # path is relative to context, not compose file`}
      </CodeBlock>
      <CodeBlock title="Correct">
        {`services:
  api:
    build: ./api             # Dockerfile must be at ./api/Dockerfile

  # Or with explicit Dockerfile path:
  api:
    build:
      context: .             # build context is project root
      dockerfile: docker/api.Dockerfile  # relative to context`}
      </CodeBlock>
      <p className="text-gray-600 dark:text-gray-400">
        <strong className="text-gray-900 dark:text-white">Fix:</strong> The{" "}
        <Code>context</Code> sets the root directory for the build. The{" "}
        <Code>dockerfile</Code> path is relative to the context, not to the
        Compose file. When in doubt, use <Code>context: .</Code> and provide the
        full relative path in <Code>dockerfile</Code>. Validate your Dockerfiles
        with our{" "}
        <Link
          href="/tools/dockerfile-validator"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          Dockerfile Validator
        </Link>
        .
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        10. Duplicate Service Names or Port Conflicts
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        YAML maps silently overwrite duplicate keys. If you define two services
        with the same name, the second one wins and the first disappears without
        any warning. Port conflicts are louder &mdash; Docker will refuse to
        start if two services try to bind to the same host port.
      </p>
      <CodeBlock title="Duplicate key (silent data loss)">
        {`services:
  api:
    image: node:22
    ports:
      - "3000:3000"

  api:                       # silently overwrites the first "api"
    image: python:3.13
    ports:
      - "8000:8000"`}
      </CodeBlock>
      <CodeBlock title="Port conflict (runtime error)">
        {`services:
  web:
    ports:
      - "80:80"
  proxy:
    ports:
      - "80:8080"            # port 80 on host is already taken by "web"`}
      </CodeBlock>
      <p className="text-gray-600 dark:text-gray-400">
        <strong className="text-gray-900 dark:text-white">Fix:</strong> Use
        unique service names and unique host ports. Run your Compose file through
        a{" "}
        <Link
          href="/tools/docker-compose"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          Docker Compose Validator
        </Link>{" "}
        to catch duplicate keys that YAML parsers won&apos;t warn you about.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        How to Debug Docker Compose Errors: Step-by-Step
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        When your Compose file won&apos;t work, follow this sequence to isolate
        the problem:
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Step 1: Run <Code>docker compose config</Code>
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        This command parses your Compose file, resolves all variables, merges
        override files, and prints the final resolved configuration. If there is
        a YAML syntax error, it will tell you exactly which line.
      </p>
      <CodeBlock title="Terminal">
        {`$ docker compose config
yaml: line 12: found character that cannot start any token

# If it succeeds, you'll see the fully resolved config:
$ docker compose config
name: myproject
services:
  web:
    image: nginx:alpine
    ports:
      - "8080:80"`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Step 2: Validate the YAML Syntax
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        If <Code>docker compose config</Code> gives you a cryptic YAML error,
        paste your file into a dedicated YAML validator. It will highlight the
        exact position of syntax errors, including invisible characters like tabs
        or non-breaking spaces. Try our{" "}
        <Link
          href="/tools/yaml-formatter"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          YAML Formatter &amp; Validator
        </Link>{" "}
        &mdash; paste your Compose file and it will point to the exact line and
        column.
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Step 3: Use <Code>docker compose up --dry-run</Code>
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Compose V2 supports a <Code>--dry-run</Code> flag that simulates
        starting your stack without actually creating containers. This catches
        configuration errors like missing images, invalid build contexts, and
        port conflicts before you commit to a full startup.
      </p>
      <CodeBlock title="Terminal">
        {`$ docker compose up --dry-run
[+] Dry run
 - Container myapp-db-1      Created
 - Container myapp-redis-1   Created
 - Container myapp-api-1     Created`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Step 4: Run a Compose-Specific Validator
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        YAML validators catch syntax errors but miss Docker Compose-specific
        issues like invalid service options, wrong field types, or deprecated
        keys. Use our{" "}
        <Link
          href="/tools/docker-compose"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          Docker Compose Validator
        </Link>{" "}
        to check for schema-level issues: unknown keys, wrong types, missing
        required fields, and common anti-patterns.
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Step 5: Read Service Logs
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        If the Compose file is valid but a service crashes on startup, check the
        logs:
      </p>
      <CodeBlock title="Terminal">
        {`# All services
$ docker compose logs

# Specific service (most useful)
$ docker compose logs api

# Follow logs in real time
$ docker compose logs -f api

# Show last 50 lines
$ docker compose logs --tail 50 api`}
      </CodeBlock>
      <p className="text-gray-600 dark:text-gray-400">
        Pay attention to exit codes. An exit code of 1 usually means an
        application error. Exit code 137 means the container was killed (likely
        an out-of-memory issue). Exit code 127 means the entrypoint command was
        not found.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Docker Compose V1 vs V2: Key Differences That Cause Errors
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Many Docker Compose errors come from following outdated tutorials written
        for V1. Here are the critical differences:
      </p>

      <ul className="mt-4 space-y-4 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Command name:</strong>{" "}
            V1 used <Code>docker-compose</Code> (hyphen, standalone binary). V2
            uses <Code>docker compose</Code> (space, Docker CLI plugin). The V1
            binary is no longer maintained. If you see{" "}
            <Code>docker-compose: command not found</Code>, you need the V2
            plugin.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Version field:</strong>{" "}
            V1 required a <Code>version: &quot;3.x&quot;</Code> field. V2
            ignores it and prints a warning. Remove it to keep your file clean.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">depends_on conditions:</strong>{" "}
            In V1 (file version 2.x), <Code>depends_on</Code> supported{" "}
            <Code>condition: service_healthy</Code>. In V1 (file version 3.x),
            conditions were removed for Swarm compatibility. V2 brings them
            back. If conditions aren&apos;t working, check whether you are
            actually running Compose V2.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Profiles:</strong>{" "}
            V2 introduced <Code>profiles</Code> to selectively enable services.
            If you use <Code>profiles</Code> in a V1 environment, it will be
            silently ignored or throw an unknown field error.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">File naming:</strong>{" "}
            V1 expected <Code>docker-compose.yml</Code>. V2 prefers{" "}
            <Code>compose.yaml</Code> (but still supports the old name). The
            canonical extension is <Code>.yaml</Code>, not <Code>.yml</Code>.
          </span>
        </li>
      </ul>

      <p className="mt-4 text-gray-600 dark:text-gray-400">
        Check your version with <Code>docker compose version</Code>. If the
        output shows &quot;Docker Compose version v2.x.x&quot;, you are on V2.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Best Practices to Avoid Compose Errors
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Most Docker Compose errors are preventable with a few habits:
      </p>
      <ul className="mt-4 space-y-4 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Always use spaces, never tabs.</strong>{" "}
            Configure your editor to use 2-space indentation for YAML files.
            This prevents the most common class of errors.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Quote all port mappings.</strong>{" "}
            Write <Code>&quot;8080:80&quot;</Code> not <Code>8080:80</Code>.
            Unquoted colon-separated numbers are interpreted as sexagesimal
            integers in YAML 1.1.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Use .env files for variables.</strong>{" "}
            Keep sensitive values out of your Compose file. Use{" "}
            <Code>env_file</Code> to load from an external file and add{" "}
            <Code>.env</Code> to your <Code>.gitignore</Code>.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Validate before deploying.</strong>{" "}
            Run <Code>docker compose config</Code> locally, then paste your file
            into a{" "}
            <Link
              href="/tools/docker-compose"
              className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              Docker Compose Validator
            </Link>{" "}
            to catch schema issues that <Code>config</Code> misses.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Pin image versions.</strong>{" "}
            Use <Code>postgres:16-alpine</Code> not{" "}
            <Code>postgres:latest</Code>. The <Code>latest</Code> tag changes
            without warning and can introduce breaking changes.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Add healthchecks to databases.</strong>{" "}
            Use <Code>depends_on</Code> with{" "}
            <Code>condition: service_healthy</Code> instead of the short syntax.
            A started container is not a ready container.
          </span>
        </li>
      </ul>

      <div className="my-12 rounded-xl border border-blue-200 bg-blue-50/50 p-6 dark:border-blue-900 dark:bg-blue-950/30">
        <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">
          Deploying Docker Compose stacks to production?
        </p>
        <p className="mt-2 text-sm text-blue-800 dark:text-blue-400">
          <a
            href="https://www.digitalocean.com/products/droplets"
            target="_blank"
            rel="noopener sponsored"
            className="font-medium underline hover:no-underline"
          >
            DigitalOcean Droplets
          </a>{" "}
          give you dedicated CPU and memory starting at $4/mo &mdash; spin up a
          Docker host in 55 seconds with one-click Docker pre-installed.
        </p>
      </div>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Validate Your Compose Files Online
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Stop guessing and start validating. Use our{" "}
        <Link
          href="/tools/docker-compose"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          Docker Compose Validator
        </Link>{" "}
        to catch syntax errors, schema violations, and common anti-patterns
        before they break your deployment. Building custom images? Run your
        Dockerfiles through the{" "}
        <Link
          href="/tools/dockerfile-validator"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          Dockerfile Validator
        </Link>{" "}
        to catch security issues and layer optimization mistakes. And if your
        YAML is the problem, the{" "}
        <Link
          href="/tools/yaml-formatter"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          YAML Formatter
        </Link>{" "}
        will format and validate it in one step. All tools run entirely in your
        browser &mdash; your configuration files never leave your machine.
      </p>
    </>
  );
}
