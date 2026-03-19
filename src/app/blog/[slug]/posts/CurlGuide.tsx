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

function FlagTable({
  rows,
}: {
  rows: { flag: string; description: string }[];
}) {
  return (
    <div className="my-6 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-800">
            <th className="py-3 pr-4 text-left font-semibold text-gray-900 dark:text-white">
              Flag
            </th>
            <th className="py-3 text-left font-semibold text-gray-900 dark:text-white">
              Description
            </th>
          </tr>
        </thead>
        <tbody className="text-gray-600 dark:text-gray-400">
          {rows.map((row, i) => (
            <tr
              key={i}
              className="border-b border-gray-100 dark:border-gray-800/50"
            >
              <td className="py-3 pr-4">
                <Code>{row.flag}</Code>
              </td>
              <td className="py-3">{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function CurlGuide() {
  return (
    <>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        cURL is the Swiss Army knife of HTTP requests. It&apos;s installed on
        virtually every machine, it&apos;s scriptable, and once you know the key
        flags you can test any API from your terminal in seconds. This guide
        covers the commands you&apos;ll use every day.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        The Basics
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        The simplest cURL command fetches a URL with a GET request:
      </p>
      <CodeBlock title="Simple GET request">
        {`curl https://api.example.com/users`}
      </CodeBlock>
      <p className="text-gray-600 dark:text-gray-400">
        By default, cURL prints the response body to stdout. Add flags to
        control the request method, headers, body, and output.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Essential Flags
      </h2>
      <FlagTable
        rows={[
          { flag: "-X METHOD", description: "Set HTTP method (GET, POST, PUT, PATCH, DELETE)" },
          { flag: "-H 'Key: Value'", description: "Add a request header" },
          { flag: "-d 'data'", description: "Send request body (implies POST)" },
          { flag: "-o file", description: "Write output to a file instead of stdout" },
          { flag: "-O", description: "Save file with its remote filename" },
          { flag: "-v", description: "Verbose — show request/response headers" },
          { flag: "-s", description: "Silent — hide progress bar and errors" },
          { flag: "-L", description: "Follow redirects (3xx responses)" },
          { flag: "-k", description: "Skip TLS certificate verification (dev only)" },
          { flag: "-i", description: "Include response headers in output" },
          { flag: "-w 'format'", description: "Custom output format (timing, status code)" },
          { flag: "--max-time N", description: "Timeout after N seconds" },
        ]}
      />

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Common Request Patterns
      </h2>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        GET with Headers
      </h3>
      <CodeBlock>
        {`curl -H "Authorization: Bearer YOUR_TOKEN" \\
     -H "Accept: application/json" \\
     https://api.example.com/users/123`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        POST JSON Data
      </h3>
      <CodeBlock>
        {`curl -X POST https://api.example.com/users \\
     -H "Content-Type: application/json" \\
     -d '{
       "name": "Jane Developer",
       "email": "jane@example.com",
       "role": "admin"
     }'`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        PUT (Update)
      </h3>
      <CodeBlock>
        {`curl -X PUT https://api.example.com/users/123 \\
     -H "Content-Type: application/json" \\
     -H "Authorization: Bearer YOUR_TOKEN" \\
     -d '{"name": "Jane Updated"}'`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        DELETE
      </h3>
      <CodeBlock>
        {`curl -X DELETE https://api.example.com/users/123 \\
     -H "Authorization: Bearer YOUR_TOKEN"`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        POST Form Data
      </h3>
      <CodeBlock>
        {`curl -X POST https://api.example.com/login \\
     -d "username=jane&password=secret123"`}
      </CodeBlock>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Authentication
      </h2>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Bearer Token
      </h3>
      <CodeBlock>
        {`curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \\
     https://api.example.com/protected`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Basic Auth
      </h3>
      <CodeBlock>
        {`curl -u username:password https://api.example.com/basic
# Equivalent to:
curl -H "Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ=" \\
     https://api.example.com/basic`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        API Key (Header)
      </h3>
      <CodeBlock>
        {`curl -H "X-API-Key: your-api-key-here" \\
     https://api.example.com/data`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        API Key (Query Parameter)
      </h3>
      <CodeBlock>
        {`curl "https://api.example.com/data?api_key=your-api-key-here"`}
      </CodeBlock>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        File Operations
      </h2>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Upload a File
      </h3>
      <CodeBlock>
        {`# Multipart form upload
curl -X POST https://api.example.com/upload \\
     -F "file=@/path/to/document.pdf" \\
     -F "description=Quarterly report"

# Raw file body
curl -X PUT https://api.example.com/files/doc.pdf \\
     -H "Content-Type: application/pdf" \\
     --data-binary @/path/to/document.pdf`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Download a File
      </h3>
      <CodeBlock>
        {`# Save with custom filename
curl -o report.pdf https://example.com/files/report.pdf

# Save with remote filename
curl -O https://example.com/files/report.pdf

# Download with progress bar
curl -# -O https://example.com/large-file.zip`}
      </CodeBlock>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Debugging Requests
      </h2>
      <p className="mb-4 text-gray-600 dark:text-gray-400">
        When an API call isn&apos;t working, these flags help you figure out
        why:
      </p>

      <h3 className="mt-6 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        See Everything (Verbose)
      </h3>
      <CodeBlock>
        {`curl -v https://api.example.com/users
# Shows: DNS resolution, TLS handshake, request headers,
# response headers, and body`}
      </CodeBlock>

      <h3 className="mt-6 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Get Just the Status Code
      </h3>
      <CodeBlock>
        {`curl -s -o /dev/null -w "%{http_code}" https://api.example.com/health
# Output: 200`}
      </CodeBlock>

      <h3 className="mt-6 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Measure Response Time
      </h3>
      <CodeBlock>
        {`curl -s -o /dev/null -w "DNS: %{time_namelookup}s
Connect: %{time_connect}s
TLS: %{time_appconnect}s
TTFB: %{time_starttransfer}s
Total: %{time_total}s
" https://api.example.com/users`}
      </CodeBlock>

      <h3 className="mt-6 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Response Headers Only
      </h3>
      <CodeBlock>
        {`curl -I https://api.example.com/users
# Same as: curl --head`}
      </CodeBlock>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Useful Recipes
      </h2>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Pretty-Print JSON Response
      </h3>
      <CodeBlock>
        {`curl -s https://api.example.com/users | python3 -m json.tool
# Or with jq:
curl -s https://api.example.com/users | jq .`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Follow Redirects
      </h3>
      <CodeBlock>
        {`curl -L https://short.url/abc123
# Follows 301/302 redirects to the final URL`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Send Cookies
      </h3>
      <CodeBlock>
        {`# Send a cookie
curl -b "session=abc123" https://example.com/dashboard

# Save cookies to a file, then reuse
curl -c cookies.txt https://example.com/login -d "user=jane&pass=secret"
curl -b cookies.txt https://example.com/dashboard`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Retry on Failure
      </h3>
      <CodeBlock>
        {`curl --retry 3 --retry-delay 2 https://api.example.com/unreliable`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Rate-Limited Loop
      </h3>
      <CodeBlock title="Bash script">
        {`for i in $(seq 1 100); do
  curl -s "https://api.example.com/items/$i" >> results.json
  sleep 0.5
done`}
      </CodeBlock>

      <div className="my-12 rounded-xl border border-blue-200 bg-blue-50/50 p-6 dark:border-blue-900 dark:bg-blue-950/30">
        <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">
          Building the API you&apos;re testing?
        </p>
        <p className="mt-2 text-sm text-blue-800 dark:text-blue-400">
          <a
            href="https://www.digitalocean.com/products/app-platform"
            target="_blank"
            rel="noopener sponsored"
            className="font-medium underline hover:no-underline"
          >
            DigitalOcean App Platform
          </a>{" "}
          deploys your API directly from a Git repo with auto-scaling, free SSL,
          and built-in monitoring. Test locally with cURL, push to deploy.
        </p>
      </div>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        cURL to Code
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Once you&apos;ve tested your request with cURL, convert it to your
        language of choice. Our{" "}
        <Link
          href="/tools/curl-converter"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          cURL to Code Converter
        </Link>{" "}
        transforms any cURL command into Python, JavaScript (fetch), Node.js,
        Go, PHP, and more — paste your command and get clean, idiomatic code
        instantly.
      </p>
      <p className="mt-4 text-gray-600 dark:text-gray-400">
        You can also use the{" "}
        <Link
          href="/tools/json-formatter"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          JSON Formatter
        </Link>{" "}
        to pretty-print API responses, and the{" "}
        <Link
          href="/tools/url-parser"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          URL Parser
        </Link>{" "}
        to break down complex endpoint URLs into their components.
      </p>
    </>
  );
}
