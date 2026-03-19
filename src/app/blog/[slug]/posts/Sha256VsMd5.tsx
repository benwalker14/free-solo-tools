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

export default function Sha256VsMd5() {
  return (
    <>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        MD5 and SHA-256 are both hash functions that produce a fixed-length
        digest from any input. MD5 produces a 128-bit hash. SHA-256 produces a
        256-bit hash. The critical difference:{" "}
        <strong className="text-gray-900 dark:text-white">
          MD5 is cryptographically broken
        </strong>
        . This guide covers what that means, when each is appropriate, and the
        practical code to use them.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Quick Comparison
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800">
              <th className="py-3 pr-4 text-left font-semibold text-gray-900 dark:text-white">
                Property
              </th>
              <th className="py-3 pr-4 text-left font-semibold text-gray-900 dark:text-white">
                MD5
              </th>
              <th className="py-3 text-left font-semibold text-gray-900 dark:text-white">
                SHA-256
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-600 dark:text-gray-400">
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Output size</td>
              <td className="py-3 pr-4">128 bits (32 hex chars)</td>
              <td className="py-3">256 bits (64 hex chars)</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Speed</td>
              <td className="py-3 pr-4">Very fast</td>
              <td className="py-3">Fast (slower than MD5)</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Collision resistance</td>
              <td className="py-3 pr-4">Broken (collisions found in seconds)</td>
              <td className="py-3">Strong (no practical collisions known)</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Pre-image resistance</td>
              <td className="py-3 pr-4">Weakened</td>
              <td className="py-3">Strong</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Year introduced</td>
              <td className="py-3 pr-4">1992</td>
              <td className="py-3">2001 (NSA / NIST)</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">First collision</td>
              <td className="py-3 pr-4">2004 (Wang et al.)</td>
              <td className="py-3">None found</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">OK for security?</td>
              <td className="py-3 pr-4">No</td>
              <td className="py-3">Yes</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">OK for checksums?</td>
              <td className="py-3 pr-4">Yes (non-adversarial)</td>
              <td className="py-3">Yes</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        What &ldquo;Broken&rdquo; Means
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        A hash function is broken when someone can produce two different inputs
        that generate the same hash output (a <strong className="text-gray-900 dark:text-white">collision</strong>).
        For MD5, this was demonstrated practically in 2004 and weaponized in
        real attacks:
      </p>
      <ul className="mt-4 space-y-3 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">2008: Rogue CA certificate.</strong>{" "}
            Researchers created a fraudulent SSL certificate authority using MD5
            collisions, allowing man-in-the-middle attacks on HTTPS.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">2012: Flame malware.</strong>{" "}
            State-sponsored malware used MD5 collisions to forge Windows Update
            signatures, spreading to millions of machines.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Today: Collisions in seconds.</strong>{" "}
            Tools like HashClash generate MD5 collisions on a laptop in under
            a minute. The attack is trivial.
          </span>
        </li>
      </ul>
      <p className="mt-4 text-gray-600 dark:text-gray-400">
        SHA-256 has no known collision attacks. The theoretical security
        margin is 2<sup>128</sup> operations for a collision — far beyond
        current computing capabilities, including quantum computers.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        The Output
      </h2>
      <CodeBlock title="Hashing 'Hello, World!'">
        {`MD5:    65a8e27d8879283831b664bd8b7f0ad4
SHA-256: dffd6021bb2bd5b0af676290809ec3a53191dd81c7f70a4b28688a362182986f`}
      </CodeBlock>
      <p className="text-gray-600 dark:text-gray-400">
        SHA-256 output is twice as long (64 hex characters vs 32). Both are
        deterministic — the same input always produces the same output.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Code Examples
      </h2>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Node.js
      </h3>
      <CodeBlock title="Node.js (crypto)">
        {`const crypto = require('crypto');

// SHA-256 — use this
const sha256 = crypto.createHash('sha256')
  .update('Hello, World!')
  .digest('hex');

// MD5 — only for non-security checksums
const md5 = crypto.createHash('md5')
  .update('Hello, World!')
  .digest('hex');`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Python
      </h3>
      <CodeBlock title="Python (hashlib)">
        {`import hashlib

# SHA-256
sha256 = hashlib.sha256(b"Hello, World!").hexdigest()

# MD5
md5 = hashlib.md5(b"Hello, World!").hexdigest()`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Browser (Web Crypto API)
      </h3>
      <CodeBlock title="JavaScript (browser)">
        {`async function sha256(message) {
  const data = new TextEncoder().encode(message);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Note: Web Crypto API does NOT support MD5
// — browsers intentionally exclude broken algorithms`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Command Line
      </h3>
      <CodeBlock title="Shell">
        {`# SHA-256
echo -n "Hello, World!" | sha256sum
# dffd6021bb2bd5b0af676290809ec3a5...

# MD5
echo -n "Hello, World!" | md5sum
# 65a8e27d8879283831b664bd8b7f0ad4`}
      </CodeBlock>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        When MD5 Is Still OK
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        MD5 is only appropriate in non-adversarial contexts where nobody is
        trying to forge data:
      </p>
      <ul className="mt-4 space-y-3 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Cache keys / deduplication.</strong>{" "}
            Checking if a file has changed for caching purposes. Speed matters,
            security doesn&apos;t.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Data integrity (trusted sources).</strong>{" "}
            Verifying a file wasn&apos;t corrupted during a local copy — not
            verifying it wasn&apos;t tampered with.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Legacy system compatibility.</strong>{" "}
            When you must interact with systems that only support MD5 and
            migration isn&apos;t possible.
          </span>
        </li>
      </ul>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        When to Use SHA-256
      </h2>
      <ul className="mt-4 space-y-3 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">File integrity verification.</strong>{" "}
            Verifying downloads, checking software signatures, comparing files
            across untrusted networks.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Digital signatures.</strong>{" "}
            HMAC-SHA256 for API authentication, JWT signing, webhook
            verification.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Certificate chains.</strong>{" "}
            TLS/SSL certificates use SHA-256. Browsers reject SHA-1 and MD5
            certificates.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Blockchain and merkle trees.</strong>{" "}
            Bitcoin and most blockchains use SHA-256 for block hashing and
            transaction verification.
          </span>
        </li>
      </ul>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Neither is for Password Hashing
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        <strong className="text-gray-900 dark:text-white">
          Do not use MD5 or SHA-256 for passwords.
        </strong>{" "}
        Both are designed to be fast — which is exactly what you don&apos;t
        want. An attacker with a GPU can compute billions of SHA-256 hashes per
        second. Use purpose-built password hashing algorithms instead:
      </p>
      <ul className="mt-4 space-y-2 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span><strong className="text-gray-900 dark:text-white">bcrypt</strong> — time-tested, widely supported, configurable cost factor</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span><strong className="text-gray-900 dark:text-white">scrypt</strong> — memory-hard, resists GPU/ASIC attacks</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span><strong className="text-gray-900 dark:text-white">Argon2id</strong> — winner of the Password Hashing Competition, current best practice</span>
        </li>
      </ul>

      <div className="my-12 rounded-xl border border-blue-200 bg-blue-50/50 p-6 dark:border-blue-900 dark:bg-blue-950/30">
        <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">
          Building authentication systems?
        </p>
        <p className="mt-2 text-sm text-blue-800 dark:text-blue-400">
          <a
            href="https://www.cloudways.com/"
            target="_blank"
            rel="noopener sponsored"
            className="font-medium underline hover:no-underline"
          >
            Cloudways
          </a>{" "}
          provides managed hosting with built-in security features, free SSL
          certificates, and automated backups — so you can focus on your
          application logic.
        </p>
      </div>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        The Verdict
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        <strong className="text-gray-900 dark:text-white">Default to SHA-256.</strong>{" "}
        It&apos;s fast enough for any use case where MD5 would be used, and it
        provides real security guarantees. Use MD5 only when you specifically
        need backward compatibility with legacy systems and there is no
        security requirement. For passwords, use bcrypt or Argon2id — never
        a general-purpose hash.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Try It Yourself
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Generate MD5, SHA-1, SHA-256, SHA-384, and SHA-512 hashes instantly with
        our{" "}
        <Link
          href="/tools/hash-generator"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          Hash Generator
        </Link>
        . Verify file integrity with the{" "}
        <Link
          href="/tools/file-hash"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          File Hash Calculator
        </Link>
        , or generate strong passwords with the{" "}
        <Link
          href="/tools/password-generator"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          Password Generator
        </Link>
        .
      </p>
    </>
  );
}
