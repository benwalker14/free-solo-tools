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

export default function Base64Explained() {
  return (
    <>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        Base64 is one of those things developers use constantly without fully
        understanding. You&apos;ve probably seen it in JWTs, data URIs, email
        attachments, and API keys. This guide explains what Base64 is, how the
        encoding works, and when to use it.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        What Is Base64?
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Base64 is a binary-to-text encoding scheme. It takes any data — text,
        images, files — and represents it using only 64 ASCII characters:{" "}
        <Code>A-Z</Code>, <Code>a-z</Code>, <Code>0-9</Code>,{" "}
        <Code>+</Code>, and <Code>/</Code>, plus <Code>=</Code> for padding.
      </p>
      <p className="mt-4 text-gray-600 dark:text-gray-400">
        The key insight:{" "}
        <strong className="text-gray-900 dark:text-white">
          Base64 is encoding, not encryption.
        </strong>{" "}
        It doesn&apos;t protect data — anyone can decode it. Its purpose is to
        safely transport binary data through text-only channels.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        How the Encoding Works
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Base64 encoding follows a straightforward process:
      </p>
      <ol className="mt-4 space-y-3 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-3">
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
            1
          </span>
          <span>
            Convert each character to its 8-bit binary representation.
          </span>
        </li>
        <li className="flex items-start gap-3">
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
            2
          </span>
          <span>
            Concatenate all the bits into one continuous binary string.
          </span>
        </li>
        <li className="flex items-start gap-3">
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
            3
          </span>
          <span>
            Split the binary string into groups of 6 bits (instead of 8).
          </span>
        </li>
        <li className="flex items-start gap-3">
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
            4
          </span>
          <span>
            Map each 6-bit group to a character in the Base64 alphabet.
          </span>
        </li>
        <li className="flex items-start gap-3">
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
            5
          </span>
          <span>
            Add <Code>=</Code> padding if needed to make the output a multiple
            of 4 characters.
          </span>
        </li>
      </ol>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Example: Encoding &quot;Hi&quot;
      </h3>
      <CodeBlock title="Step by step">
        {`Text:     H         i
ASCII:    72        105
Binary:   01001000  01101001

Concatenated: 010010000110100 1
Split into 6-bit groups: 010010  000110  1001xx

Pad to fill last group: 010010  000110  100100

Base64 index:  18      6       36
Base64 char:   S       G       k

Add padding:   SGk=

Result: "Hi" → "SGk="`}
      </CodeBlock>
      <p className="text-gray-600 dark:text-gray-400">
        Three bytes of input become four Base64 characters. This is why Base64
        encoded data is always about 33% larger than the original.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        The Padding Character
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        The <Code>=</Code> character at the end is padding. Since Base64 works
        in groups of 3 bytes (24 bits = four 6-bit groups), padding fills the
        gap when the input length isn&apos;t divisible by 3:
      </p>
      <ul className="mt-4 space-y-2 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>Input length divisible by 3: no padding</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>1 byte remainder: <Code>==</Code> (two padding characters)</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>2 byte remainder: <Code>=</Code> (one padding character)</span>
        </li>
      </ul>
      <CodeBlock title="Examples">
        {`"A"   → "QQ=="   (1 byte → 2 padding)
"Hi"  → "SGk="   (2 bytes → 1 padding)
"Hey" → "SGV5"   (3 bytes → no padding)`}
      </CodeBlock>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Where Base64 Is Used
      </h2>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Data URIs
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Embed small images directly in HTML or CSS without a separate HTTP
        request:
      </p>
      <CodeBlock title="HTML">
        {`<img src="data:image/png;base64,iVBORw0KGgo..." alt="icon" />`}
      </CodeBlock>
      <p className="text-gray-600 dark:text-gray-400">
        Best for small images (under 10KB). For larger files, the 33% size
        increase makes separate files more efficient.
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        JSON Web Tokens (JWTs)
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        JWTs use Base64URL encoding (a URL-safe variant) for the header and
        payload sections. This lets tokens be safely included in URLs and HTTP
        headers. See our{" "}
        <Link
          href="/blog/jwt-tutorial"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          JWT tutorial
        </Link>{" "}
        for a deep dive.
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Email Attachments (MIME)
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Email was originally designed for ASCII text only. Base64 encoding lets
        email protocols (SMTP) carry binary attachments like images and PDFs by
        encoding them as text.
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        API Payloads
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        APIs sometimes accept binary data (file uploads, images) as Base64
        strings in JSON payloads, since JSON can&apos;t represent raw binary:
      </p>
      <CodeBlock title="JSON">
        {`{
  "filename": "avatar.png",
  "content": "iVBORw0KGgoAAAANSUh...",
  "encoding": "base64"
}`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        HTTP Basic Authentication
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        The <Code>Authorization</Code> header encodes credentials as{" "}
        <Code>username:password</Code> in Base64:
      </p>
      <CodeBlock title="HTTP Header">
        {`Authorization: Basic dXNlcjpwYXNzd29yZA==
// Decodes to: "user:password"`}
      </CodeBlock>
      <p className="text-gray-600 dark:text-gray-400">
        Remember: this is{" "}
        <strong className="text-gray-900 dark:text-white">not secure</strong>{" "}
        on its own. Always use HTTPS with Basic Auth.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Base64 in Different Languages
      </h2>
      <CodeBlock title="JavaScript (Browser)">
        {`// Encode
const encoded = btoa("Hello World");
// "SGVsbG8gV29ybGQ="

// Decode
const decoded = atob("SGVsbG8gV29ybGQ=");
// "Hello World"`}
      </CodeBlock>

      <CodeBlock title="JavaScript (Node.js)">
        {`// Encode
const encoded = Buffer.from("Hello World").toString("base64");

// Decode
const decoded = Buffer.from(encoded, "base64").toString("utf-8");`}
      </CodeBlock>

      <CodeBlock title="Python">
        {`import base64

# Encode
encoded = base64.b64encode(b"Hello World").decode()
# "SGVsbG8gV29ybGQ="

# Decode
decoded = base64.b64decode("SGVsbG8gV29ybGQ=").decode()
# "Hello World"`}
      </CodeBlock>

      <CodeBlock title="Go">
        {`import "encoding/base64"

// Encode
encoded := base64.StdEncoding.EncodeToString([]byte("Hello World"))

// Decode
decoded, _ := base64.StdEncoding.DecodeString(encoded)`}
      </CodeBlock>

      <CodeBlock title="Command line">
        {`# Encode
echo -n "Hello World" | base64
# SGVsbG8gV29ybGQ=

# Decode
echo "SGVsbG8gV29ybGQ=" | base64 -d
# Hello World`}
      </CodeBlock>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Base64 vs Base64URL
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Standard Base64 uses <Code>+</Code> and <Code>/</Code>, which have
        special meanings in URLs. Base64URL replaces them:
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800">
              <th className="py-3 pr-4 text-left font-semibold text-gray-900 dark:text-white">
                Variant
              </th>
              <th className="py-3 pr-4 text-left font-semibold text-gray-900 dark:text-white">
                Characters
              </th>
              <th className="py-3 text-left font-semibold text-gray-900 dark:text-white">
                Used In
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-600 dark:text-gray-400">
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4">Base64</td>
              <td className="py-3 pr-4"><Code>A-Z a-z 0-9 + /</Code></td>
              <td className="py-3">Email, data URIs, general encoding</td>
            </tr>
            <tr>
              <td className="py-3 pr-4">Base64URL</td>
              <td className="py-3 pr-4"><Code>A-Z a-z 0-9 - _</Code></td>
              <td className="py-3">JWTs, URLs, filenames</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Common Mistakes
      </h2>
      <ul className="space-y-4 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Using Base64 for security.</strong>{" "}
            Base64 is trivially reversible. Never use it to &quot;hide&quot;
            passwords or sensitive data. Use proper encryption instead.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Double encoding.</strong>{" "}
            Encoding data that&apos;s already Base64 encoded produces valid
            output but nonsense when decoded. Make sure you encode raw bytes, not
            an already-encoded string.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Encoding large files as data URIs.</strong>{" "}
            Base64 increases size by 33%. A 1MB image becomes 1.33MB inline — and
            can&apos;t be cached separately by the browser. Use data URIs only
            for small assets.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Forgetting Unicode.</strong>{" "}
            The browser&apos;s <Code>btoa()</Code> only handles Latin-1
            characters. For Unicode text, encode to UTF-8 first:{" "}
            <Code>btoa(unescape(encodeURIComponent(text)))</Code>.
          </span>
        </li>
      </ul>

      <div className="my-12 rounded-xl border border-blue-200 bg-blue-50/50 p-6 dark:border-blue-900 dark:bg-blue-950/30">
        <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">
          Handling file uploads and Base64 payloads?
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
          provides managed hosting with scalable storage, built-in CDN, and
          optimized PHP/Node.js stacks for APIs that process encoded data.
          Deploy on DigitalOcean, AWS, or GCP.
        </p>
      </div>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Try It Yourself
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Use our{" "}
        <Link
          href="/tools/base64"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          Base64 Encoder & Decoder
        </Link>{" "}
        to encode and decode text or files instantly in your browser. For
        converting images to Base64 data URIs, try the{" "}
        <Link
          href="/tools/image-base64"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          Image to Base64 Converter
        </Link>
        . And for a multi-format encoding tool that handles Base64, Base32,
        Hex, and more, check out the{" "}
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
