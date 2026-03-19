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

export default function Base64VsUrlEncoding() {
  return (
    <>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        Base64 encoding and URL encoding are both ways to represent data using
        a safe set of characters — but they solve completely different
        problems. Base64 converts binary data to text. URL encoding makes
        strings safe for URLs. Using the wrong one causes bugs that are
        surprisingly hard to debug.
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
                Base64
              </th>
              <th className="py-3 text-left font-semibold text-gray-900 dark:text-white">
                URL Encoding
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-600 dark:text-gray-400">
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Purpose</td>
              <td className="py-3 pr-4">Represent binary data as ASCII text</td>
              <td className="py-3">Make strings safe for URL contexts</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Character set</td>
              <td className="py-3 pr-4"><Code>A-Z</Code>, <Code>a-z</Code>, <Code>0-9</Code>, <Code>+</Code>, <Code>/</Code>, <Code>=</Code></td>
              <td className="py-3">Unreserved chars pass through; reserved become <Code>%XX</Code></td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Size change</td>
              <td className="py-3 pr-4">+33% (3 bytes → 4 chars)</td>
              <td className="py-3">Variable (only reserved chars expand to 3x)</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Reversible</td>
              <td className="py-3 pr-4">Yes (decode to original bytes)</td>
              <td className="py-3">Yes (decode to original string)</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Handles binary</td>
              <td className="py-3 pr-4">Yes (designed for it)</td>
              <td className="py-3">No (text strings only)</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Encoding</td>
              <td className="py-3 pr-4"><Code>Hello!</Code> → <Code>SGVsbG8h</Code></td>
              <td className="py-3"><Code>Hello!</Code> → <Code>Hello%21</Code></td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Standard</td>
              <td className="py-3 pr-4">RFC 4648</td>
              <td className="py-3">RFC 3986</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Used in</td>
              <td className="py-3 pr-4">Data URIs, JWTs, email (MIME), API payloads</td>
              <td className="py-3">Query strings, form data, URL paths</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        How Base64 Works
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Base64 takes every 3 bytes of input and maps them to 4 ASCII characters
        from a 64-character alphabet. This turns binary data (images, files,
        encrypted data) into text that can be safely embedded in JSON, HTML,
        or email.
      </p>
      <CodeBlock title="Base64 encoding">
        {`Input bytes:  01001000 01100101 01101100  (H, e, l)
Split to 6-bit groups: 010010 000110 010101 101100
Map to Base64 chars:    S      G      V      s

"Hello, World!" → "SGVsbG8sIFdvcmxkIQ=="

The == padding ensures the output length is a multiple of 4.`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Base64 in Practice
      </h3>
      <CodeBlock title="JavaScript">
        {`// Encode
const encoded = btoa('Hello, World!');
// "SGVsbG8sIFdvcmxkIQ=="

// Decode
const decoded = atob('SGVsbG8sIFdvcmxkIQ==');
// "Hello, World!"

// Data URI for an image
const dataUri = \`data:image/png;base64,\${base64String}\`;

// JWT structure (3 Base64URL segments)
// header.payload.signature
// eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoiYWxpY2UifQ.abc123`}
      </CodeBlock>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        How URL Encoding Works
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        URL encoding (percent-encoding) replaces characters that have special
        meaning in URLs with <Code>%</Code> followed by their hex value. This
        prevents characters like <Code>&amp;</Code>, <Code>=</Code>,{" "}
        <Code>?</Code>, and <Code>/</Code> from being misinterpreted as URL
        delimiters.
      </p>
      <CodeBlock title="URL encoding">
        {`Input:   search query = "hello world & more"
Encoded: search%20query%20%3D%20%22hello%20world%20%26%20more%22

Space → %20 (or + in form data)
&     → %26
=     → %3D
"     → %22
/     → %2F`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        URL Encoding in Practice
      </h3>
      <CodeBlock title="JavaScript">
        {`// Encode a full URI component (query parameter value)
encodeURIComponent('price=10&currency=USD')
// "price%3D10%26currency%3DUSD"

// Encode a full URI (preserves :, /, ?, #, &, =)
encodeURI('https://example.com/search?q=hello world')
// "https://example.com/search?q=hello%20world"

// Common mistake: using encodeURI for query values
// ❌ encodeURI('price=10&tax=2')    → "price=10&tax=2" (& not escaped!)
// ✅ encodeURIComponent('price=10&tax=2') → "price%3D10%26tax%3D2"`}
      </CodeBlock>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Base64URL: The Hybrid
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Standard Base64 uses <Code>+</Code> and <Code>/</Code>, which are
        reserved characters in URLs. Base64URL replaces them with <Code>-</Code>{" "}
        and <Code>_</Code> and removes <Code>=</Code> padding. JWTs use
        Base64URL for exactly this reason.
      </p>
      <CodeBlock title="Base64 vs Base64URL">
        {`Standard Base64:  SGVsbG8+Lg==
Base64URL:        SGVsbG8-Lg

Replacements:
  + → -
  / → _
  = → (removed)

Used in: JWTs, URL-safe tokens, OAuth state parameters`}
      </CodeBlock>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Common Mistakes
      </h2>
      <ul className="space-y-4 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">
              Using Base64 to &ldquo;encrypt&rdquo; data.
            </strong>{" "}
            Base64 is an encoding, not encryption. Anyone can decode it. It
            provides zero security.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">
              Double-encoding URLs.
            </strong>{" "}
            Calling <Code>encodeURIComponent()</Code> twice turns{" "}
            <Code>%20</Code> into <Code>%2520</Code>. The <Code>%</Code>{" "}
            itself gets encoded on the second pass.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">
              Using <Code>encodeURI()</Code> for query parameters.
            </strong>{" "}
            <Code>encodeURI()</Code> preserves <Code>&amp;</Code> and{" "}
            <Code>=</Code>, which breaks query parameter values.
            Use <Code>encodeURIComponent()</Code> for individual values.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">
              Putting Base64 in URLs without Base64URL.
            </strong>{" "}
            Standard Base64&apos;s <Code>+</Code> and <Code>/</Code> characters
            get misinterpreted in URLs. Always use Base64URL for URL contexts.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">
              URL-encoding binary data.
            </strong>{" "}
            URL encoding works on text strings, not arbitrary bytes. Use
            Base64 for binary data (images, files, encrypted payloads).
          </span>
        </li>
      </ul>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        When to Use Each
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800">
              <th className="py-3 pr-4 text-left font-semibold text-gray-900 dark:text-white">
                Use Case
              </th>
              <th className="py-3 pr-4 text-left font-semibold text-gray-900 dark:text-white">
                Encoding
              </th>
              <th className="py-3 text-left font-semibold text-gray-900 dark:text-white">
                Why
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-600 dark:text-gray-400">
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4">Embedding images in CSS/HTML</td>
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Base64</td>
              <td className="py-3">Binary → text for data URIs</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4">URL query parameters</td>
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">URL Encoding</td>
              <td className="py-3">Preserves URL structure</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4">JWT tokens</td>
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Base64URL</td>
              <td className="py-3">JSON payload → URL-safe text</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4">Form submission</td>
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">URL Encoding</td>
              <td className="py-3"><Code>application/x-www-form-urlencoded</Code></td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4">Email attachments</td>
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Base64</td>
              <td className="py-3">Binary files in text-based MIME</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4">API auth tokens in URLs</td>
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">Base64URL</td>
              <td className="py-3">No +, /, or = to interfere with URL parsing</td>
            </tr>
            <tr>
              <td className="py-3 pr-4">Search parameters with special chars</td>
              <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">URL Encoding</td>
              <td className="py-3">Escapes &amp;, =, ? to prevent URL breakage</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Code Comparison
      </h2>
      <CodeBlock title="Python">
        {`import base64
from urllib.parse import quote, unquote

# Base64
encoded = base64.b64encode(b"Hello, World!").decode()
# "SGVsbG8sIFdvcmxkIQ=="

decoded = base64.b64decode("SGVsbG8sIFdvcmxkIQ==")
# b"Hello, World!"

# URL Encoding
encoded = quote("price=10&tax=2")
# "price%3D10%26tax%3D2"

decoded = unquote("price%3D10%26tax%3D2")
# "price=10&tax=2"`}
      </CodeBlock>
      <CodeBlock title="Go">
        {`package main

import (
    "encoding/base64"
    "net/url"
)

// Base64
encoded := base64.StdEncoding.EncodeToString([]byte("Hello, World!"))
// "SGVsbG8sIFdvcmxkIQ=="

// URL Encoding
encoded = url.QueryEscape("price=10&tax=2")
// "price%3D10%26tax%3D2"`}
      </CodeBlock>

      <div className="my-12 rounded-xl border border-blue-200 bg-blue-50/50 p-6 dark:border-blue-900 dark:bg-blue-950/30">
        <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">
          Building APIs that handle encoded data?
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
          provides scalable cloud infrastructure for your backend services.
          App Platform auto-deploys from GitHub with zero configuration.
        </p>
      </div>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        The Verdict
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        <strong className="text-gray-900 dark:text-white">Use Base64</strong>{" "}
        when you need to represent binary data as text — images, files,
        encrypted payloads, or any raw bytes that need to travel through a
        text-only channel.{" "}
        <strong className="text-gray-900 dark:text-white">Use URL encoding</strong>{" "}
        when you need to include special characters in URLs — query parameters,
        form data, or URL path segments. For tokens or Base64 data that appear
        in URLs, use Base64URL.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Try It Yourself
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Encode and decode Base64 with our{" "}
        <Link
          href="/tools/base64"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          Base64 Encoder & Decoder
        </Link>
        . Encode URLs with the{" "}
        <Link
          href="/tools/url-encoder"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          URL Encoder & Decoder
        </Link>
        , or try all encoding formats at once with the{" "}
        <Link
          href="/tools/encode-decode"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          Encode/Decode Multi-Tool
        </Link>
        .
      </p>
    </>
  );
}
