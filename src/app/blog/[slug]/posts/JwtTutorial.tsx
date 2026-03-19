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

export default function JwtTutorial() {
  return (
    <>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        JSON Web Tokens (JWTs) are everywhere in modern web development. If
        you&apos;ve built an API, used OAuth, or integrated a third-party
        service, you&apos;ve almost certainly encountered one. This guide
        explains what they are, how they work, and the mistakes that trip up
        most developers.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        What Is a JWT?
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        A JWT is a compact, URL-safe string that carries a set of claims
        between two parties. It&apos;s commonly used for authentication — after a
        user logs in, the server issues a JWT that the client sends with
        subsequent requests to prove identity.
      </p>
      <p className="mt-4 text-gray-600 dark:text-gray-400">
        Unlike session-based auth where the server stores state, JWTs are{" "}
        <strong className="text-gray-900 dark:text-white">stateless</strong>.
        The token itself contains all the information the server needs to
        validate the request.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        JWT Structure: Three Parts
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Every JWT consists of three Base64URL-encoded parts separated by dots:
      </p>
      <CodeBlock title="JWT format">
        {`header.payload.signature`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        1. Header
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        The header declares the token type and signing algorithm:
      </p>
      <CodeBlock title="Decoded header">
        {`{
  "alg": "HS256",
  "typ": "JWT"
}`}
      </CodeBlock>
      <p className="text-gray-600 dark:text-gray-400">
        Common algorithms include <Code>HS256</Code> (HMAC + SHA-256),{" "}
        <Code>RS256</Code> (RSA + SHA-256), and <Code>ES256</Code> (ECDSA +
        SHA-256). The choice of algorithm determines how the signature is
        created and verified.
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        2. Payload
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        The payload contains <strong className="text-gray-900 dark:text-white">claims</strong> — statements
        about the user and token metadata:
      </p>
      <CodeBlock title="Decoded payload">
        {`{
  "sub": "1234567890",
  "name": "Jane Developer",
  "email": "jane@example.com",
  "role": "admin",
  "iat": 1710700800,
  "exp": 1710787200
}`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        3. Signature
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        The signature is created by signing the encoded header and payload with
        a secret key. For HS256:
      </p>
      <CodeBlock title="Signature creation">
        {`HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  secret
)`}
      </CodeBlock>
      <p className="text-gray-600 dark:text-gray-400">
        The signature ensures the token hasn&apos;t been tampered with. If anyone
        changes the payload, the signature won&apos;t match and the server will
        reject the token.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Standard Claims
      </h2>
      <p className="mb-4 text-gray-600 dark:text-gray-400">
        The JWT spec defines several{" "}
        <strong className="text-gray-900 dark:text-white">registered claims</strong>.
        None are required, but they&apos;re widely used:
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800">
              <th className="py-3 pr-4 text-left font-semibold text-gray-900 dark:text-white">
                Claim
              </th>
              <th className="py-3 pr-4 text-left font-semibold text-gray-900 dark:text-white">
                Name
              </th>
              <th className="py-3 text-left font-semibold text-gray-900 dark:text-white">
                Description
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-600 dark:text-gray-400">
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4"><Code>iss</Code></td>
              <td className="py-3 pr-4">Issuer</td>
              <td className="py-3">Who created the token</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4"><Code>sub</Code></td>
              <td className="py-3 pr-4">Subject</td>
              <td className="py-3">Who the token is about (usually a user ID)</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4"><Code>aud</Code></td>
              <td className="py-3 pr-4">Audience</td>
              <td className="py-3">Who the token is intended for</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4"><Code>exp</Code></td>
              <td className="py-3 pr-4">Expiration</td>
              <td className="py-3">Unix timestamp when the token expires</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4"><Code>iat</Code></td>
              <td className="py-3 pr-4">Issued At</td>
              <td className="py-3">Unix timestamp when the token was created</td>
            </tr>
            <tr>
              <td className="py-3 pr-4"><Code>nbf</Code></td>
              <td className="py-3 pr-4">Not Before</td>
              <td className="py-3">Token is invalid before this time</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        How JWT Authentication Works
      </h2>
      <ol className="space-y-3 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-3">
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
            1
          </span>
          <span>
            The user sends credentials (email + password) to your login
            endpoint.
          </span>
        </li>
        <li className="flex items-start gap-3">
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
            2
          </span>
          <span>
            The server verifies the credentials, creates a JWT with the
            user&apos;s claims, and signs it with a secret key.
          </span>
        </li>
        <li className="flex items-start gap-3">
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
            3
          </span>
          <span>
            The client stores the JWT (commonly in memory or an{" "}
            <Code>httpOnly</Code> cookie) and includes it in the{" "}
            <Code>Authorization</Code> header of subsequent requests.
          </span>
        </li>
        <li className="flex items-start gap-3">
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
            4
          </span>
          <span>
            The server verifies the signature and checks expiration on each
            request — no database lookup needed.
          </span>
        </li>
      </ol>
      <CodeBlock title="Authorization header">
        {`Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkphbmUgRGV2ZWxvcGVyIiwiaWF0IjoxNzEwNzAwODAwfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`}
      </CodeBlock>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Common Mistakes and Security Pitfalls
      </h2>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Storing JWTs in localStorage
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        <Code>localStorage</Code> is accessible to any JavaScript running on
        the page, making it vulnerable to XSS attacks. Prefer{" "}
        <Code>httpOnly</Code> cookies — they&apos;re not accessible via
        JavaScript and are sent automatically with requests.
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Not Validating the Algorithm
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        The classic <Code>alg: &quot;none&quot;</Code> attack works when
        servers blindly trust the algorithm specified in the header. Always
        validate that the algorithm matches what your server expects. Most
        modern JWT libraries handle this, but double-check your configuration.
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Setting Tokens That Never Expire
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        A stolen token without an expiration is a permanent key. Always set a
        reasonable <Code>exp</Code> claim. For access tokens, 15-60 minutes is
        common. Use refresh tokens for longer sessions.
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Putting Sensitive Data in the Payload
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        The payload is <strong className="text-gray-900 dark:text-white">encoded, not encrypted</strong>.
        Anyone can decode it with a Base64 decoder. Never include passwords,
        API keys, or other secrets in the payload. Use our{" "}
        <Link
          href="/tools/jwt-decoder"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          JWT Decoder
        </Link>{" "}
        to see how easy it is to read the payload of any JWT.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        When to Use JWTs (and When Not To)
      </h2>
      <p className="mb-4 text-gray-600 dark:text-gray-400">
        <strong className="text-gray-900 dark:text-white">Good use cases:</strong>
      </p>
      <ul className="mb-6 space-y-2 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>Stateless API authentication across microservices</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>Single sign-on (SSO) between applications</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>Short-lived authorization tokens (OAuth 2.0 access tokens)</span>
        </li>
      </ul>
      <p className="mb-4 text-gray-600 dark:text-gray-400">
        <strong className="text-gray-900 dark:text-white">Consider alternatives when:</strong>
      </p>
      <ul className="space-y-2 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-400" />
          <span>You need to revoke tokens immediately (JWTs are valid until they expire)</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-400" />
          <span>You&apos;re building a simple server-rendered app (session cookies are simpler)</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-400" />
          <span>Token payload would be very large (JWTs are sent with every request)</span>
        </li>
      </ul>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Try It Yourself
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Paste any JWT into our{" "}
        <Link
          href="/tools/jwt-decoder"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          JWT Decoder
        </Link>{" "}
        to instantly see its header, payload, and expiration status — all
        decoded locally in your browser. You can also use the{" "}
        <Link
          href="/tools/base64"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          Base64 Decoder
        </Link>{" "}
        to manually decode individual JWT parts, or the{" "}
        <Link
          href="/tools/hash-generator"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          Hash Generator
        </Link>{" "}
        to explore the SHA-256 algorithm used in JWT signatures.
      </p>
    </>
  );
}
