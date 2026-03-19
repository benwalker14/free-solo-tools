"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

interface CheatEntry {
  command: string;
  description: string;
  example: string;
  toolUrl?: string;
  toolLabel?: string;
}

interface CheatCategory {
  name: string;
  slug: string;
  entries: CheatEntry[];
}

interface FAQ {
  question: string;
  answer: string;
}

/* ------------------------------------------------------------------ */
/*  Data                                                              */
/* ------------------------------------------------------------------ */

const categories: CheatCategory[] = [
  {
    name: "Images",
    slug: "images",
    entries: [
      {
        command: "docker build .",
        description: "Build an image from a Dockerfile in the current directory",
        example: "Reads Dockerfile in . and creates an unnamed image",
      },
      {
        command: "docker build -t name:tag .",
        description: "Build and tag an image with a name and version",
        example: "docker build -t myapp:1.0 . -- tags as myapp:1.0",
      },
      {
        command: "docker images",
        description: "List all locally stored images",
        example: "Add --format to customize output columns",
      },
      {
        command: "docker pull image:tag",
        description: "Download an image from a registry",
        example: "docker pull node:20-alpine -- pulls from Docker Hub",
      },
      {
        command: "docker push image:tag",
        description: "Upload an image to a registry",
        example: "docker push myrepo/myapp:1.0 -- push to Docker Hub or private registry",
      },
      {
        command: "docker rmi image",
        description: "Remove one or more images",
        example: "docker rmi myapp:1.0 -- add -f to force removal",
      },
      {
        command: "docker image prune",
        description: "Remove all dangling (untagged) images",
        example: "Add -a to remove ALL unused images, not just dangling ones",
      },
      {
        command: "docker tag source:tag target:tag",
        description: "Create a new tag that refers to an existing image",
        example: "docker tag myapp:1.0 myrepo/myapp:latest",
      },
      {
        command: "docker save -o file.tar image",
        description: "Save an image to a tar archive file",
        example: "docker save -o myapp.tar myapp:1.0 -- for offline transfer",
      },
      {
        command: "docker load -i file.tar",
        description: "Load an image from a tar archive file",
        example: "docker load -i myapp.tar -- imports the image locally",
      },
    ],
  },
  {
    name: "Containers",
    slug: "containers",
    entries: [
      {
        command: "docker run image",
        description: "Create and start a new container from an image",
        example: "docker run ubuntu -- runs and attaches to the container",
      },
      {
        command: "docker run -d image",
        description: "Run a container in detached (background) mode",
        example: "docker run -d nginx -- returns the container ID",
      },
      {
        command: "docker run -p host:container image",
        description: "Map a host port to a container port",
        example: "docker run -p 8080:80 nginx -- access via localhost:8080",
      },
      {
        command: "docker run -v host:container image",
        description: "Mount a host directory or volume into the container",
        example: "docker run -v $(pwd):/app node:20 -- bind mount current dir",
      },
      {
        command: "docker run --rm image",
        description: "Automatically remove the container when it exits",
        example: "docker run --rm alpine echo hello -- cleans up after itself",
      },
      {
        command: "docker run --name myname image",
        description: "Assign a custom name to the container",
        example: "docker run --name web -d nginx -- easier to reference later",
      },
      {
        command: "docker ps",
        description: "List currently running containers",
        example: "Shows container ID, image, command, status, ports, and names",
      },
      {
        command: "docker ps -a",
        description: "List all containers including stopped ones",
        example: "Useful for finding exited containers to restart or remove",
      },
      {
        command: "docker stop container",
        description: "Gracefully stop a running container (SIGTERM, then SIGKILL)",
        example: "docker stop web -- waits 10s by default, use -t to change",
      },
      {
        command: "docker start container",
        description: "Start a previously stopped container",
        example: "docker start web -- resumes with original run configuration",
      },
      {
        command: "docker rm container",
        description: "Remove a stopped container",
        example: "docker rm web -- add -f to force-remove a running container",
      },
      {
        command: "docker exec -it container command",
        description: "Run a command inside a running container interactively",
        example: "docker exec -it web /bin/sh -- opens a shell session",
      },
    ],
  },
  {
    name: "Networks",
    slug: "networks",
    entries: [
      {
        command: "docker network create name",
        description: "Create a new user-defined network",
        example: "docker network create mynet -- bridge driver by default",
      },
      {
        command: "docker network ls",
        description: "List all Docker networks",
        example: "Shows network ID, name, driver, and scope",
      },
      {
        command: "docker network inspect name",
        description: "Display detailed information about a network",
        example: "Shows connected containers, subnet, gateway, and config",
      },
      {
        command: "docker network connect network container",
        description: "Connect a running container to a network",
        example: "docker network connect mynet web -- container joins network",
      },
      {
        command: "docker network disconnect network container",
        description: "Disconnect a container from a network",
        example: "docker network disconnect mynet web -- removes from network",
      },
      {
        command: "docker network rm name",
        description: "Remove one or more networks",
        example: "docker network rm mynet -- network must have no containers",
      },
      {
        command: "docker network prune",
        description: "Remove all unused networks",
        example: "Removes networks not used by any container. Add -f to skip prompt",
      },
    ],
  },
  {
    name: "Volumes",
    slug: "volumes",
    entries: [
      {
        command: "docker volume create name",
        description: "Create a named volume for persistent data storage",
        example: "docker volume create pgdata -- data survives container removal",
      },
      {
        command: "docker volume ls",
        description: "List all Docker volumes",
        example: "Shows volume driver and name",
      },
      {
        command: "docker volume inspect name",
        description: "Display detailed information about a volume",
        example: "Shows mount point, driver, creation date, and labels",
      },
      {
        command: "docker volume rm name",
        description: "Remove one or more volumes",
        example: "docker volume rm pgdata -- volume must not be in use",
      },
      {
        command: "docker volume prune",
        description: "Remove all volumes not used by any container",
        example: "WARNING: deletes data. Add -f to skip confirmation prompt",
      },
      {
        command: "-v name:/path vs --mount type=volume,src=name,dst=/path",
        description: "Two syntaxes for mounting volumes in docker run",
        example: "--mount is more explicit and recommended for clarity; -v is shorter",
      },
    ],
  },
  {
    name: "Docker Compose",
    slug: "compose",
    entries: [
      {
        command: "docker compose up",
        description: "Create and start all services defined in compose.yml",
        example: "Builds images if needed, creates networks and volumes",
        toolUrl: "/tools/docker-compose",
        toolLabel: "Validate",
      },
      {
        command: "docker compose up -d",
        description: "Start all services in detached (background) mode",
        example: "docker compose up -d -- returns control to your terminal",
        toolUrl: "/tools/docker-compose",
        toolLabel: "Validate",
      },
      {
        command: "docker compose down",
        description: "Stop and remove containers, networks created by up",
        example: "Add -v to also remove named volumes, --rmi all to remove images",
        toolUrl: "/tools/docker-compose",
        toolLabel: "Validate",
      },
      {
        command: "docker compose build",
        description: "Build or rebuild service images",
        example: "docker compose build --no-cache -- force full rebuild",
        toolUrl: "/tools/docker-compose",
        toolLabel: "Validate",
      },
      {
        command: "docker compose ps",
        description: "List containers for the current Compose project",
        example: "Shows status, ports, and command for each service",
        toolUrl: "/tools/docker-compose",
        toolLabel: "Validate",
      },
      {
        command: "docker compose logs",
        description: "View log output from all services",
        example: "docker compose logs -f web -- follow logs for specific service",
        toolUrl: "/tools/docker-compose",
        toolLabel: "Validate",
      },
      {
        command: "docker compose exec service command",
        description: "Execute a command in a running service container",
        example: "docker compose exec db psql -U postgres -- open psql shell",
        toolUrl: "/tools/docker-compose",
        toolLabel: "Validate",
      },
      {
        command: "docker compose pull",
        description: "Pull the latest images for all services",
        example: "Run before 'up' to ensure you have the newest versions",
        toolUrl: "/tools/docker-compose",
        toolLabel: "Validate",
      },
      {
        command: "docker compose restart",
        description: "Restart all or specific services",
        example: "docker compose restart web -- restarts only the web service",
        toolUrl: "/tools/docker-compose",
        toolLabel: "Validate",
      },
      {
        command: "docker compose config",
        description: "Validate and display the resolved Compose configuration",
        example: "Merges all compose files and shows the final config. Great for debugging",
        toolUrl: "/tools/docker-compose",
        toolLabel: "Validate",
      },
    ],
  },
  {
    name: "Dockerfile Instructions",
    slug: "dockerfile",
    entries: [
      {
        command: "FROM image:tag",
        description: "Set the base image for the build stage",
        example: "FROM node:20-alpine -- always pin a specific version",
        toolUrl: "/tools/dockerfile-validator",
        toolLabel: "Validate",
      },
      {
        command: "RUN command",
        description: "Execute a command during the image build process",
        example: "RUN apt-get update && apt-get install -y curl -- chain commands to reduce layers",
        toolUrl: "/tools/dockerfile-validator",
        toolLabel: "Validate",
      },
      {
        command: 'CMD ["executable", "arg1"]',
        description: "Set the default command to run when the container starts",
        example: 'CMD ["node", "server.js"] -- can be overridden at runtime',
        toolUrl: "/tools/dockerfile-validator",
        toolLabel: "Validate",
      },
      {
        command: 'ENTRYPOINT ["executable"]',
        description: "Set the main executable that always runs in the container",
        example: 'ENTRYPOINT ["python"] with CMD ["app.py"] -- CMD provides default args',
        toolUrl: "/tools/dockerfile-validator",
        toolLabel: "Validate",
      },
      {
        command: "COPY src dest",
        description: "Copy files or directories from host to image filesystem",
        example: "COPY package*.json ./ -- copy only what is needed first for caching",
        toolUrl: "/tools/dockerfile-validator",
        toolLabel: "Validate",
      },
      {
        command: "ADD src dest",
        description: "Copy files with extra features (auto-extract tar, fetch URLs)",
        example: "ADD app.tar.gz /app -- prefer COPY unless you need tar extraction",
        toolUrl: "/tools/dockerfile-validator",
        toolLabel: "Validate",
      },
      {
        command: "WORKDIR /path",
        description: "Set the working directory for subsequent instructions",
        example: "WORKDIR /app -- creates the directory if it does not exist",
        toolUrl: "/tools/dockerfile-validator",
        toolLabel: "Validate",
      },
      {
        command: "ENV KEY=value",
        description: "Set an environment variable in the image",
        example: "ENV NODE_ENV=production -- persists in running containers",
        toolUrl: "/tools/dockerfile-validator",
        toolLabel: "Validate",
      },
      {
        command: "EXPOSE port",
        description: "Document which port the container listens on at runtime",
        example: "EXPOSE 3000 -- informational only, does not publish the port",
        toolUrl: "/tools/dockerfile-validator",
        toolLabel: "Validate",
      },
      {
        command: "VOLUME /path",
        description: "Create a mount point for persistent or shared data",
        example: "VOLUME /data -- anonymous volume created at runtime",
        toolUrl: "/tools/dockerfile-validator",
        toolLabel: "Validate",
      },
      {
        command: "ARG NAME=default",
        description: "Define a build-time variable (not available in running container)",
        example: "ARG NODE_VERSION=20 then FROM node:${NODE_VERSION}-alpine",
        toolUrl: "/tools/dockerfile-validator",
        toolLabel: "Validate",
      },
      {
        command: 'HEALTHCHECK CMD ["curl", "-f", "http://localhost/"]',
        description: "Define a command to check container health at intervals",
        example: "HEALTHCHECK --interval=30s --timeout=3s CMD curl -f http://localhost/ || exit 1",
        toolUrl: "/tools/dockerfile-validator",
        toolLabel: "Validate",
      },
    ],
  },
  {
    name: "Debugging & Logs",
    slug: "debugging",
    entries: [
      {
        command: "docker logs container",
        description: "Fetch the stdout/stderr logs of a container",
        example: "docker logs web -- add --tail 100 to limit output",
      },
      {
        command: "docker logs -f container",
        description: "Follow (stream) log output in real-time",
        example: "docker logs -f web -- like tail -f, Ctrl+C to stop",
      },
      {
        command: "docker inspect container",
        description: "Return detailed JSON info about a container or image",
        example: "docker inspect web | jq '.[0].NetworkSettings' -- pipe to jq for readability",
      },
      {
        command: "docker stats",
        description: "Display a live stream of container resource usage",
        example: "docker stats web db -- monitor specific containers' CPU, memory, net, I/O",
      },
      {
        command: "docker top container",
        description: "Display the running processes inside a container",
        example: "docker top web -- similar to running ps inside the container",
      },
      {
        command: "docker events",
        description: "Stream real-time events from the Docker daemon",
        example: "docker events --filter type=container -- filter by object type",
      },
      {
        command: "docker diff container",
        description: "Show filesystem changes made inside a container since start",
        example: "A = added, C = changed, D = deleted files relative to the image",
      },
      {
        command: "docker cp container:/path /host/path",
        description: "Copy files between a container and the local filesystem",
        example: "docker cp web:/app/logs ./logs -- works with running or stopped containers",
      },
    ],
  },
  {
    name: "Registry & Hub",
    slug: "registry",
    entries: [
      {
        command: "docker login",
        description: "Log in to a Docker registry (Docker Hub by default)",
        example: "docker login ghcr.io -- log in to GitHub Container Registry",
      },
      {
        command: "docker logout",
        description: "Log out from a Docker registry",
        example: "docker logout ghcr.io -- removes stored credentials",
      },
      {
        command: "docker search term",
        description: "Search Docker Hub for images matching a term",
        example: "docker search nginx --filter stars=100 -- filter by popularity",
      },
      {
        command: "docker pull image:tag",
        description: "Download an image or repository from a registry",
        example: "docker pull ghcr.io/org/app:v2 -- pull from any registry",
      },
      {
        command: "docker push image:tag",
        description: "Upload an image to a registry",
        example: "Tag first, then push: docker tag app myrepo/app:v1 && docker push myrepo/app:v1",
      },
    ],
  },
];

const totalEntries = categories.reduce((sum, c) => sum + c.entries.length, 0);

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export default function DockerCheatSheet({ faqs }: { faqs: FAQ[] }) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [copiedIdx, setCopiedIdx] = useState<string | null>(null);

  /* Filter logic */
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return categories
      .filter((cat) => activeCategory === "all" || cat.slug === activeCategory)
      .map((cat) => ({
        ...cat,
        entries: cat.entries.filter(
          (e) =>
            !q ||
            e.command.toLowerCase().includes(q) ||
            e.description.toLowerCase().includes(q) ||
            e.example.toLowerCase().includes(q)
        ),
      }))
      .filter((cat) => cat.entries.length > 0);
  }, [search, activeCategory]);

  const matchCount = filtered.reduce((s, c) => s + c.entries.length, 0);

  /* Copy handler */
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIdx(id);
      setTimeout(() => setCopiedIdx(null), 1500);
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-5xl">
        {/* ---- Header ---- */}
        <nav className="mb-8 text-sm text-gray-500 dark:text-gray-400">
          <Link
            href="/cheatsheets"
            className="transition-colors hover:text-gray-700 dark:hover:text-gray-300"
          >
            Cheat Sheets
          </Link>
          <span className="mx-2">{"\u2192"}</span>
          <span className="text-gray-900 dark:text-white">Docker</span>
        </nav>

        <h1 className="mb-3 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          Docker Cheat Sheet
        </h1>
        <p className="mb-8 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
          Comprehensive Docker CLI reference with {totalEntries} commands across{" "}
          {categories.length} categories. Search, filter, copy, and click to
          validate your configurations with DevBolt tools.
        </p>

        {/* ---- Search ---- */}
        <div className="relative mb-6">
          <svg
            className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search commands, descriptions, examples..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:placeholder-gray-500 dark:focus:border-sky-500"
          />
        </div>

        {/* ---- Category Tabs ---- */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setActiveCategory("all")}
            className={`shrink-0 rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors ${
              activeCategory === "all"
                ? "bg-sky-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setActiveCategory(cat.slug)}
              className={`shrink-0 rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors ${
                activeCategory === cat.slug
                  ? "bg-sky-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* ---- Match Count ---- */}
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          Showing{" "}
          <span className="font-medium text-gray-900 dark:text-white">
            {matchCount}
          </span>{" "}
          of{" "}
          <span className="font-medium text-gray-900 dark:text-white">
            {totalEntries}
          </span>{" "}
          commands
        </p>

        {/* ---- Categories & Entries ---- */}
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center dark:border-gray-800 dark:bg-gray-900">
            <p className="text-gray-500 dark:text-gray-400">
              No commands match your search. Try a different term.
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {filtered.map((cat) => (
              <section key={cat.slug}>
                <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
                  {cat.name}
                </h2>
                <div className="space-y-3">
                  {cat.entries.map((entry, idx) => {
                    const entryId = `${cat.slug}-${idx}`;
                    return (
                      <div
                        key={entryId}
                        className="rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:border-sky-300 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-sky-700"
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          {/* Command + description */}
                          <div className="min-w-0 flex-1">
                            <code className="inline-block rounded bg-gray-100 px-2 py-1 text-sm font-mono text-sky-700 dark:bg-gray-800 dark:text-sky-400">
                              {entry.command}
                            </code>
                            <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-300">
                              {entry.description}
                            </p>
                            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                              {entry.example}
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="flex shrink-0 items-center gap-2">
                            {entry.toolUrl && (
                              <Link
                                href={entry.toolUrl}
                                className="rounded-md bg-sky-50 px-3 py-1.5 text-xs font-medium text-sky-700 transition-colors hover:bg-sky-100 dark:bg-sky-950 dark:text-sky-400 dark:hover:bg-sky-900"
                              >
                                {entry.toolLabel || "Validate"}
                              </Link>
                            )}
                            <button
                              onClick={() =>
                                handleCopy(entry.command, entryId)
                              }
                              className="rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                              title="Copy command"
                            >
                              {copiedIdx === entryId ? (
                                <span className="flex items-center gap-1">
                                  <svg
                                    className="h-3.5 w-3.5 text-green-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                  Copied
                                </span>
                              ) : (
                                <span className="flex items-center gap-1">
                                  <svg
                                    className="h-3.5 w-3.5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                    />
                                  </svg>
                                  Copy
                                </span>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* ---- FAQ Section ---- */}
        <section className="mt-16">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <div className="divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900">
            {faqs.map((faq, i) => (
              <details key={i} className="group" open={i === 0}>
                <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 text-left text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50 dark:text-white dark:hover:bg-gray-800/50 [&::-webkit-details-marker]:hidden">
                  <span>{faq.question}</span>
                  <svg
                    className="ml-3 h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200 group-open:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>
                <div className="px-5 pb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* ---- Related Tools ---- */}
        <section className="mt-16">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
            Related Tools
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                href: "/tools/docker-compose",
                title: "Docker Compose Validator",
                desc: "Validate Docker Compose YAML",
              },
              {
                href: "/tools/dockerfile-validator",
                title: "Dockerfile Validator",
                desc: "Check Dockerfile best practices",
              },
              {
                href: "/tools/yaml-formatter",
                title: "YAML Formatter",
                desc: "Format and validate YAML",
              },
              {
                href: "/tools/k8s-validator",
                title: "Kubernetes Validator",
                desc: "Validate Kubernetes manifests",
              },
            ].map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group rounded-lg border border-gray-200 bg-white p-5 transition-all hover:border-sky-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-sky-700"
              >
                <h3 className="font-medium text-gray-900 transition-colors group-hover:text-sky-600 dark:text-white dark:group-hover:text-sky-400">
                  {tool.title}
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {tool.desc}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* ---- Back to Cheat Sheets ---- */}
        <div className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-800">
          <Link
            href="/cheatsheets"
            className="text-sm font-medium text-sky-600 transition-colors hover:text-sky-500 dark:text-sky-400 dark:hover:text-sky-300"
          >
            {"\u2190"} Back to all cheat sheets
          </Link>
        </div>
      </div>
    </div>
  );
}
