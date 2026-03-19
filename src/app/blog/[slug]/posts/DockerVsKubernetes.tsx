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

export default function DockerVsKubernetes() {
  return (
    <>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        Docker and Kubernetes are not competitors — they solve different
        problems at different scales. Docker packages your application into a
        container. Kubernetes orchestrates hundreds or thousands of those
        containers across a cluster. This guide explains what each does, how
        they work together, and when you actually need Kubernetes.
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
                Docker
              </th>
              <th className="py-3 text-left font-semibold text-gray-900 dark:text-white">
                Kubernetes
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-600 dark:text-gray-400">
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">What it does</td>
              <td className="py-3 pr-4">Builds and runs containers</td>
              <td className="py-3">Orchestrates containers at scale</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Scope</td>
              <td className="py-3 pr-4">Single host</td>
              <td className="py-3">Multi-node cluster</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Scaling</td>
              <td className="py-3 pr-4">Manual (<Code>docker run</Code> more instances)</td>
              <td className="py-3">Automatic (HPA, VPA, cluster autoscaler)</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Self-healing</td>
              <td className="py-3 pr-4">Restart policies only</td>
              <td className="py-3">Automatic rescheduling, health checks, rollbacks</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Networking</td>
              <td className="py-3 pr-4">Bridge networks, port mapping</td>
              <td className="py-3">Service discovery, load balancing, ingress</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Config</td>
              <td className="py-3 pr-4">Dockerfile, docker-compose.yml</td>
              <td className="py-3">YAML manifests (Deployments, Services, etc.)</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Learning curve</td>
              <td className="py-3 pr-4">Moderate</td>
              <td className="py-3">Steep (many concepts and abstractions)</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Adoption</td>
              <td className="py-3 pr-4">71.1% of developers (2025)</td>
              <td className="py-3">28.5% of developers (2025)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        What Docker Does
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Docker packages an application and all its dependencies into a{" "}
        <strong className="text-gray-900 dark:text-white">container</strong> — a
        lightweight, isolated environment that runs the same way everywhere:
        your laptop, CI/CD, staging, production.
      </p>
      <CodeBlock title="Dockerfile">
        {`FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]`}
      </CodeBlock>
      <CodeBlock title="Build and run">
        {`docker build -t my-app .
docker run -p 3000:3000 my-app`}
      </CodeBlock>
      <p className="text-gray-600 dark:text-gray-400">
        For multi-container setups (app + database + Redis), Docker Compose
        defines everything in a single <Code>docker-compose.yml</Code>:
      </p>
      <CodeBlock title="docker-compose.yml">
        {`services:
  app:
    build: .
    ports: ["3000:3000"]
    depends_on: [db]
  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: secret`}
      </CodeBlock>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        What Kubernetes Does
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Kubernetes (K8s) manages containers{" "}
        <strong className="text-gray-900 dark:text-white">across multiple machines</strong>.
        It handles scheduling, scaling, networking, and recovery automatically:
      </p>
      <ul className="mt-4 space-y-3 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Pods</strong> — the
            smallest deployable unit. Usually one container per pod.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Deployments</strong> — declare
            the desired state (3 replicas of my-app v2.1). K8s makes it happen.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Services</strong> — stable
            network endpoints that route traffic to healthy pods.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Ingress</strong> — routes
            external HTTP traffic to services based on hostname or path.
          </span>
        </li>
      </ul>
      <CodeBlock title="Kubernetes Deployment">
        {`apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
        - name: my-app
          image: my-app:2.1
          ports:
            - containerPort: 3000
          resources:
            requests:
              memory: "128Mi"
              cpu: "250m"
            limits:
              memory: "256Mi"
              cpu: "500m"`}
      </CodeBlock>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        How They Work Together
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Docker builds the container image. Kubernetes runs it at scale. The
        typical workflow:
      </p>
      <ol className="mt-4 space-y-3 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-3">
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
            1
          </span>
          <span>Write a <Code>Dockerfile</Code> to build your app image.</span>
        </li>
        <li className="flex items-start gap-3">
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
            2
          </span>
          <span>Push the image to a container registry (Docker Hub, ECR, GCR).</span>
        </li>
        <li className="flex items-start gap-3">
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
            3
          </span>
          <span>Write Kubernetes manifests that reference the image.</span>
        </li>
        <li className="flex items-start gap-3">
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
            4
          </span>
          <span>Kubernetes pulls the image and runs it across your cluster.</span>
        </li>
      </ol>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        When Docker Alone Is Enough
      </h2>
      <ul className="mt-4 space-y-3 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Single-server deployments</strong>{" "}
            — a VPS running Docker Compose handles most apps. Add a reverse
            proxy (Nginx/Caddy) and you&apos;re production-ready.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Small teams / startups</strong>{" "}
            — Kubernetes operational overhead is significant. Docker Compose
            gets you 80% of the benefits with 20% of the complexity.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Local development</strong>{" "}
            — Docker Compose is the standard for running multi-service apps
            locally. Even teams using K8s in production use Compose locally.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">PaaS deployments</strong>{" "}
            — platforms like Railway, Render, and Fly.io take a Dockerfile and
            handle orchestration for you.
          </span>
        </li>
      </ul>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        When You Need Kubernetes
      </h2>
      <ul className="mt-4 space-y-3 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">High availability requirements</strong>{" "}
            — K8s automatically replaces failed pods, distributes across
            availability zones, and performs rolling updates with zero downtime.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Auto-scaling</strong>{" "}
            — scale pods based on CPU, memory, or custom metrics. Scale the
            cluster itself based on pending pod demand.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Many microservices</strong>{" "}
            — when you&apos;re running 10+ services, K8s service discovery,
            load balancing, and config management become essential.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Multi-cloud / hybrid</strong>{" "}
            — K8s provides a consistent deployment model across AWS, GCP,
            Azure, and on-premise.
          </span>
        </li>
      </ul>

      <div className="my-12 rounded-xl border border-blue-200 bg-blue-50/50 p-6 dark:border-blue-900 dark:bg-blue-950/30">
        <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">
          Running containers in production?
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
          offers managed Kubernetes (DOKS) with free control plane, plus App
          Platform for Dockerfile-based deployments without the K8s complexity.
        </p>
      </div>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        The Verdict
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        <strong className="text-gray-900 dark:text-white">Every developer should learn Docker.</strong>{" "}
        Containers are the standard unit of deployment. Learn Kubernetes{" "}
        <strong className="text-gray-900 dark:text-white">when you actually need it</strong>{" "}
        — not as a resume bullet point. Most applications run fine on Docker
        Compose + a single server or a PaaS. Kubernetes is the right choice
        when you need true multi-node orchestration, auto-scaling, and high
        availability — and when you have the team to operate it.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Try It Yourself
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Validate your container configurations with our{" "}
        <Link
          href="/tools/dockerfile-validator"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          Dockerfile Validator
        </Link>{" "}
        and{" "}
        <Link
          href="/tools/docker-compose"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          Docker Compose Validator
        </Link>
        . For Kubernetes, use the{" "}
        <Link
          href="/tools/k8s-validator"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          Kubernetes YAML Validator
        </Link>{" "}
        to catch manifest errors before deploying.
      </p>
    </>
  );
}
