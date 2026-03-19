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

export default function RestVsGraphql() {
  return (
    <>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        REST and GraphQL are the two dominant approaches to building web APIs.
        REST has been the industry standard for over a decade. GraphQL, created
        by Facebook in 2015, gives clients the power to request exactly the data
        they need. This guide covers how they differ, their trade-offs, and when
        to use each.
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
                REST
              </th>
              <th className="py-3 text-left font-semibold text-gray-900 dark:text-white">
                GraphQL
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-600 dark:text-gray-400">
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Architecture</td>
              <td className="py-3 pr-4">Resource-based (multiple endpoints)</td>
              <td className="py-3">Schema-based (single endpoint)</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Data fetching</td>
              <td className="py-3 pr-4">Server decides what to return</td>
              <td className="py-3">Client specifies exactly what it needs</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Over-fetching</td>
              <td className="py-3 pr-4">Common (fixed response shape)</td>
              <td className="py-3">Eliminated (query only what you need)</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Under-fetching</td>
              <td className="py-3 pr-4">Requires multiple requests</td>
              <td className="py-3">One query for nested/related data</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Caching</td>
              <td className="py-3 pr-4">Built-in HTTP caching (ETags, 304s)</td>
              <td className="py-3">Requires client-side cache (Apollo, urql)</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Versioning</td>
              <td className="py-3 pr-4"><Code>/api/v1/</Code>, <Code>/api/v2/</Code></td>
              <td className="py-3">Deprecate fields, no versioning needed</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Type safety</td>
              <td className="py-3 pr-4">Optional (via OpenAPI/Swagger)</td>
              <td className="py-3">Built-in (schema is the type system)</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Learning curve</td>
              <td className="py-3 pr-4">Lower (uses HTTP conventions)</td>
              <td className="py-3">Higher (query language, resolvers, schema)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        How REST Works
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        REST maps resources to URLs. Each URL represents an entity, and HTTP
        methods (<Code>GET</Code>, <Code>POST</Code>, <Code>PUT</Code>,{" "}
        <Code>DELETE</Code>) define operations on that resource:
      </p>
      <CodeBlock title="REST endpoints">
        {`GET    /api/users          → List all users
GET    /api/users/42       → Get user 42
POST   /api/users          → Create a user
PUT    /api/users/42       → Update user 42
DELETE /api/users/42       → Delete user 42
GET    /api/users/42/posts → Get user 42's posts`}
      </CodeBlock>
      <p className="text-gray-600 dark:text-gray-400">
        The server decides the response shape. If you need a user and their
        posts, that&apos;s two requests — or you add query parameters like{" "}
        <Code>?include=posts</Code> to customize the response.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        How GraphQL Works
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        GraphQL exposes a single endpoint. The client sends a query describing
        exactly what data it wants:
      </p>
      <CodeBlock title="GraphQL query">
        {`POST /graphql

{
  user(id: 42) {
    name
    email
    posts(limit: 5) {
      title
      createdAt
    }
  }
}`}
      </CodeBlock>
      <CodeBlock title="GraphQL response">
        {`{
  "data": {
    "user": {
      "name": "Alice",
      "email": "alice@example.com",
      "posts": [
        { "title": "Getting Started", "createdAt": "2025-01-15" },
        { "title": "Advanced Patterns", "createdAt": "2025-02-20" }
      ]
    }
  }
}`}
      </CodeBlock>
      <p className="text-gray-600 dark:text-gray-400">
        One request, exactly the fields you asked for. No extra data, no
        missing data, no second round trip.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        The Over-fetching Problem
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Suppose you&apos;re building a user list that only needs names and
        avatars:
      </p>
      <CodeBlock title="REST — GET /api/users">
        {`[
  {
    "id": 1,
    "name": "Alice",
    "email": "alice@example.com",
    "avatar": "/img/alice.jpg",
    "bio": "Full-stack developer...",      // Don't need this
    "phone": "+1-555-0100",               // Don't need this
    "address": { ... },                    // Don't need this
    "settings": { ... },                   // Don't need this
    "createdAt": "2024-01-15T..."          // Don't need this
  },
  ...
]`}
      </CodeBlock>
      <CodeBlock title="GraphQL — query only what you need">
        {`{
  users {
    name
    avatar
  }
}`}
      </CodeBlock>
      <p className="text-gray-600 dark:text-gray-400">
        This matters most on mobile networks where bandwidth is expensive and
        latency is high. GraphQL can reduce payload sizes by 50-90% compared to
        fixed REST responses.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        When to Choose REST
      </h2>
      <ul className="mt-4 space-y-3 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Simple CRUD APIs</strong>{" "}
            — if your data model is straightforward and clients don&apos;t need
            flexible queries, REST is simpler to build and maintain.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">HTTP caching matters</strong>{" "}
            — REST endpoints are cacheable by URL with standard HTTP headers.
            CDNs, browser caches, and reverse proxies all work out of the box.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">File uploads/downloads</strong>{" "}
            — REST handles binary data natively with multipart forms. GraphQL
            requires workarounds.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Public APIs</strong>{" "}
            — REST is universally understood. Any developer can call your API
            with <Code>curl</Code> without learning a query language.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Microservices</strong>{" "}
            — REST endpoints map cleanly to service boundaries. Each service
            owns its own resource URLs.
          </span>
        </li>
      </ul>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        When to Choose GraphQL
      </h2>
      <ul className="mt-4 space-y-3 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Multiple clients with different needs</strong>{" "}
            — a mobile app needs a subset of data, a web dashboard needs all of
            it, and an admin panel needs extra fields. One schema serves all.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Deeply nested/relational data</strong>{" "}
            — when displaying a user&apos;s posts, each post&apos;s comments,
            and each comment&apos;s author in a single view.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Rapid frontend iteration</strong>{" "}
            — frontend teams can add or remove fields from queries without
            waiting for backend changes.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Real-time features</strong>{" "}
            — GraphQL subscriptions provide a standardized way to push
            updates to clients via WebSockets.
          </span>
        </li>
      </ul>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Common Pitfalls
      </h2>
      <ul className="space-y-4 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">GraphQL N+1 queries.</strong>{" "}
            Without a dataloader, fetching a list of users and their posts can
            fire one SQL query per user. Use DataLoader or similar batching.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">GraphQL query complexity attacks.</strong>{" "}
            Clients can craft deeply nested queries that overwhelm your server.
            Always set depth limits and complexity scoring.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">REST API sprawl.</strong>{" "}
            Large REST APIs end up with hundreds of endpoints, each with
            slightly different query parameters. Documentation falls behind.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Using GraphQL for everything.</strong>{" "}
            File uploads, authentication, health checks — these are better
            served by plain HTTP endpoints alongside your GraphQL API.
          </span>
        </li>
      </ul>

      <div className="my-12 rounded-xl border border-blue-200 bg-blue-50/50 p-6 dark:border-blue-900 dark:bg-blue-950/30">
        <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">
          Building and deploying APIs?
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
          provides managed databases, load balancers, and App Platform for
          deploying REST and GraphQL APIs. Start with $200 in free credits.
        </p>
      </div>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        The Verdict
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        <strong className="text-gray-900 dark:text-white">REST</strong> is the
        safe default — simpler, universally understood, and battle-tested at
        every scale. Choose it unless you have a specific reason not to.{" "}
        <strong className="text-gray-900 dark:text-white">GraphQL</strong>{" "}
        shines when you have multiple clients with different data needs,
        complex relational data, or a fast-moving frontend team. Many
        production systems use both — GraphQL for the frontend gateway, REST
        for internal microservices.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Try It Yourself
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Working with REST APIs? Use our{" "}
        <Link
          href="/tools/openapi-validator"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          OpenAPI Validator
        </Link>{" "}
        to validate your API specs, convert them to TypeScript with the{" "}
        <Link
          href="/tools/openapi-to-typescript"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          OpenAPI to TypeScript Converter
        </Link>
        , or format API responses with the{" "}
        <Link
          href="/tools/json-formatter"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          JSON Formatter
        </Link>
        .
      </p>
    </>
  );
}
