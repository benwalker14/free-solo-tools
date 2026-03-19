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

export default function UuidGuide() {
  return (
    <>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        UUIDs (Universally Unique Identifiers) are 128-bit identifiers used
        everywhere — database primary keys, API request IDs, distributed
        systems, session tokens. This guide covers the different UUID versions,
        how they work, and when to pick each one.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        What Is a UUID?
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        A UUID is a 128-bit number represented as 32 hexadecimal digits in five
        groups separated by hyphens:
      </p>
      <CodeBlock title="UUID format">
        {`550e8400-e29b-41d4-a716-446655440000
\\_____/ \\__/ \\__/ \\__/ \\__________/
  8       4    4    4       12

Total: 32 hex digits = 128 bits`}
      </CodeBlock>
      <p className="text-gray-600 dark:text-gray-400">
        The third group&apos;s first digit indicates the{" "}
        <strong className="text-gray-900 dark:text-white">version</strong>. In the
        example above, <Code>4</Code> in <Code>41d4</Code> means UUID v4. The
        fourth group&apos;s first digit indicates the{" "}
        <strong className="text-gray-900 dark:text-white">variant</strong> (usually{" "}
        <Code>8</Code>, <Code>9</Code>, <Code>a</Code>, or <Code>b</Code> for
        RFC 4122 UUIDs).
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        UUID vs GUID
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        They&apos;re the same thing. Microsoft calls them GUIDs (Globally Unique
        Identifiers), everyone else calls them UUIDs. The format, generation
        algorithms, and RFC specification are identical. If you see a GUID in
        .NET or SQL Server, treat it as a UUID.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        UUID Versions Explained
      </h2>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        UUID v1 — Timestamp + MAC Address
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Combines a 60-bit timestamp (100-nanosecond intervals since October 15,
        1582) with the machine&apos;s MAC address. UUIDs generated on the same
        machine sort chronologically.
      </p>
      <CodeBlock title="UUID v1 structure">
        {`f47ac10b-58cc-1de5-97d0-0242ac120002
                  ^
                  version 1

Pros: Naturally sortable by time, guaranteed unique per machine
Cons: Leaks MAC address (privacy concern), clock skew issues`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        UUID v4 — Random
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        The most commonly used version. 122 bits are randomly generated (6 bits
        reserved for version and variant). No timestamp, no MAC address, no
        coordination needed.
      </p>
      <CodeBlock title="UUID v4 structure">
        {`550e8400-e29b-41d4-a716-446655440000
                  ^
                  version 4

122 random bits → 2^122 possible values
≈ 5.3 × 10^36 unique UUIDs

Collision probability:
  • 1 billion UUIDs → ~0.00000000000000003% chance
  • You'd need to generate 2.71 × 10^18 UUIDs for a 50% chance`}
      </CodeBlock>
      <p className="text-gray-600 dark:text-gray-400">
        For most applications, v4 is the right choice. The collision
        probability is so low that it&apos;s effectively zero for any real-world
        use case.
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        UUID v7 — Timestamp + Random (Recommended)
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        The newest version (RFC 9562, 2024). Combines a 48-bit Unix timestamp
        (millisecond precision) with 74 random bits. This gives you the best of
        both worlds: natural sortability{" "}
        <em>and</em> privacy.
      </p>
      <CodeBlock title="UUID v7 structure">
        {`018f6b5e-c913-7a2b-8d1f-3c4e5f6a7b8c
                  ^
                  version 7

First 48 bits: Unix timestamp (ms)
Remaining bits: Random

Pros: Sortable by creation time, no MAC address leak
Cons: Newer, not yet supported everywhere`}
      </CodeBlock>
      <p className="text-gray-600 dark:text-gray-400">
        UUID v7 is the recommended choice for new projects, especially for
        database primary keys. The timestamp prefix means IDs sort
        chronologically, which is{" "}
        <strong className="text-gray-900 dark:text-white">
          significantly better for database index performance
        </strong>{" "}
        than random v4 UUIDs.
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        UUID v5 — Namespace + Name (SHA-1 Hash)
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Deterministic: the same namespace + name always produces the same UUID.
        Useful when you need a stable identifier derived from a known value.
      </p>
      <CodeBlock title="UUID v5 example">
        {`// Same inputs always produce the same UUID:
namespace = "6ba7b810-9dad-11d1-80b4-00c04fd430c8" (URL namespace)
name      = "https://devbolt.dev"
result    = "a6e5e5c0-..."  (always the same)

Use cases:
  • Generating IDs from URLs, emails, or DNS names
  • Deduplication — same input = same ID`}
      </CodeBlock>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Which Version Should You Use?
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800">
              <th className="py-3 pr-4 text-left font-semibold text-gray-900 dark:text-white">
                Use Case
              </th>
              <th className="py-3 pr-4 text-left font-semibold text-gray-900 dark:text-white">
                Version
              </th>
              <th className="py-3 text-left font-semibold text-gray-900 dark:text-white">
                Why
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-600 dark:text-gray-400">
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4">Database primary keys</td>
              <td className="py-3 pr-4"><Code>v7</Code></td>
              <td className="py-3">Sortable, good index performance</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4">General unique IDs</td>
              <td className="py-3 pr-4"><Code>v4</Code></td>
              <td className="py-3">Simple, widely supported</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4">Deterministic IDs from names</td>
              <td className="py-3 pr-4"><Code>v5</Code></td>
              <td className="py-3">Same input = same UUID</td>
            </tr>
            <tr>
              <td className="py-3 pr-4">Legacy systems</td>
              <td className="py-3 pr-4"><Code>v1</Code></td>
              <td className="py-3">Only if required by existing code</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Generating UUIDs in Code
      </h2>
      <CodeBlock title="JavaScript (Node.js / Browser)">
        {`// Built-in (v4) — Node.js 14.17+ and all modern browsers
const id = crypto.randomUUID();
// "3b241101-e2bb-4d7a-8613-e4bfa8964d71"

// Using the uuid package (v4)
import { v4 as uuidv4 } from "uuid";
const id = uuidv4();

// Using the uuid package (v7)
import { v7 as uuidv7 } from "uuid";
const id = uuidv7();`}
      </CodeBlock>

      <CodeBlock title="Python">
        {`import uuid

# v4 (random)
id = uuid.uuid4()
# UUID('a8098c1a-f86e-11da-bd1a-00112444be1e')

# v5 (namespace + name)
id = uuid.uuid5(uuid.NAMESPACE_URL, "https://devbolt.dev")

# v7 (Python 3.14+)
id = uuid.uuid7()`}
      </CodeBlock>

      <CodeBlock title="Go">
        {`import "github.com/google/uuid"

// v4
id := uuid.New()
// "f47ac10b-58cc-4372-a567-0e02b2c3d479"

// v7
id, _ := uuid.NewV7()

// From string
parsed, err := uuid.Parse("550e8400-e29b-41d4-a716-446655440000")`}
      </CodeBlock>

      <CodeBlock title="PostgreSQL">
        {`-- v4 (built-in since PostgreSQL 13)
SELECT gen_random_uuid();

-- Use as primary key
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL
);`}
      </CodeBlock>

      <CodeBlock title="Command line">
        {`# macOS / Linux
uuidgen
# 5A6A8C6B-3E7D-4A2F-9B1C-8D5E6F7A8B9C

# Python one-liner
python3 -c "import uuid; print(uuid.uuid4())"

# Node.js one-liner
node -e "console.log(crypto.randomUUID())"`}
      </CodeBlock>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        UUID vs Auto-Increment IDs
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800">
              <th className="py-3 pr-4 text-left font-semibold text-gray-900 dark:text-white">
                Feature
              </th>
              <th className="py-3 pr-4 text-left font-semibold text-gray-900 dark:text-white">
                UUID
              </th>
              <th className="py-3 text-left font-semibold text-gray-900 dark:text-white">
                Auto-Increment
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-600 dark:text-gray-400">
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4">Size</td>
              <td className="py-3 pr-4">16 bytes</td>
              <td className="py-3">4–8 bytes</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4">Distributed generation</td>
              <td className="py-3 pr-4">No coordination needed</td>
              <td className="py-3">Requires central authority</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4">Predictability</td>
              <td className="py-3 pr-4">Not guessable</td>
              <td className="py-3">Sequential, easy to enumerate</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4">Index performance</td>
              <td className="py-3 pr-4">v7 good, v4 poor</td>
              <td className="py-3">Excellent</td>
            </tr>
            <tr>
              <td className="py-3 pr-4">URL safety</td>
              <td className="py-3 pr-4">Doesn&apos;t leak count</td>
              <td className="py-3">Reveals total records</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-gray-600 dark:text-gray-400">
        Auto-increment IDs leak information. If your user profile is at{" "}
        <Code>/users/42</Code>, attackers know you have at most 42 users and can
        enumerate all of them. UUIDs prevent this.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Common Mistakes
      </h2>
      <ul className="space-y-4 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Using v4 as a database primary key without considering performance.</strong>{" "}
            Random UUIDs fragment B-tree indexes because inserts land at random
            positions. Use v7 for sequential inserts, or store UUIDs as{" "}
            <Code>BINARY(16)</Code> instead of <Code>CHAR(36)</Code>.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Treating UUIDs as secrets.</strong>{" "}
            UUIDs are unique but not necessarily unpredictable (v1 is
            predictable). Never use a UUID as a password, API key, or security
            token. Use{" "}
            <Code>crypto.randomBytes()</Code> or a dedicated token generator
            instead.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Storing UUIDs as strings.</strong>{" "}
            A UUID string is 36 characters (with hyphens). Stored as{" "}
            <Code>CHAR(36)</Code>, that&apos;s 36 bytes. Stored as a native UUID
            type or <Code>BINARY(16)</Code>, it&apos;s only 16 bytes — less than
            half the storage and much faster to index.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Case-sensitive comparison.</strong>{" "}
            UUIDs are case-insensitive. <Code>550E8400...</Code> and{" "}
            <Code>550e8400...</Code> are the same UUID. Always normalize to
            lowercase before comparing or storing.
          </span>
        </li>
      </ul>

      <div className="my-12 rounded-xl border border-blue-200 bg-blue-50/50 p-6 dark:border-blue-900 dark:bg-blue-950/30">
        <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">
          Running PostgreSQL with UUID primary keys?
        </p>
        <p className="mt-2 text-sm text-blue-800 dark:text-blue-400">
          <a
            href="https://www.digitalocean.com/products/managed-databases"
            target="_blank"
            rel="noopener sponsored"
            className="font-medium underline hover:no-underline"
          >
            DigitalOcean Managed Databases
          </a>{" "}
          handle backups, failover, and scaling for PostgreSQL, MySQL, and Redis.
          Built-in <Code>gen_random_uuid()</Code> support with no server
          management.
        </p>
      </div>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Try It Yourself
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Use our{" "}
        <Link
          href="/tools/uuid-generator"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          UUID Generator
        </Link>{" "}
        to generate v1, v4, and v7 UUIDs instantly in your browser. Need to
        verify a hash of your UUID? Try the{" "}
        <Link
          href="/tools/hash-generator"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          Hash Generator
        </Link>
        . And if you&apos;re building an API that uses UUIDs, check out the{" "}
        <Link
          href="/tools/json-formatter"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          JSON Formatter
        </Link>{" "}
        to validate your API responses.
      </p>
    </>
  );
}
