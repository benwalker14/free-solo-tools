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

export default function FixCorsErrors() {
  return (
    <>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        CORS errors are fixed on the <strong className="text-gray-900 dark:text-white">server</strong>, not the client.
        The browser blocks cross-origin requests unless the server responds with
        the correct <Code>Access-Control-Allow-Origin</Code> header. No amount
        of client-side code will bypass this &mdash; you need to configure the
        server that hosts the API.
      </p>

      {/* ── What Is CORS and Why Does It Exist? ── */}
      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        What Is CORS and Why Does It Exist?
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        CORS stands for <strong className="text-gray-900 dark:text-white">Cross-Origin Resource Sharing</strong>.
        It&apos;s a security mechanism built into every modern browser that
        restricts how a web page on one origin (say, <Code>https://app.example.com</Code>)
        can request resources from a different origin (say, <Code>https://api.example.com</Code>).
      </p>
      <p className="mt-4 text-gray-600 dark:text-gray-400">
        The underlying rule is the <strong className="text-gray-900 dark:text-white">Same-Origin Policy</strong>.
        Two URLs share the same origin only when they have the same protocol,
        host, and port. Without this policy, any malicious site you visit could
        silently make authenticated requests to your bank, your email, or any
        other service where you&apos;re logged in &mdash; stealing data or
        performing actions on your behalf.
      </p>
      <p className="mt-4 text-gray-600 dark:text-gray-400">
        CORS relaxes that restriction in a controlled way. Before sending certain
        cross-origin requests, the browser fires a <strong className="text-gray-900 dark:text-white">preflight request</strong> &mdash;
        an <Code>OPTIONS</Code> request that asks the server: &ldquo;Will you
        accept a request from this origin, with this method and these
        headers?&rdquo; Only if the server responds with the right CORS headers
        does the browser allow the actual request to proceed.
      </p>

      {/* ── The 7 Most Common CORS Errors ── */}
      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        The 7 Most Common CORS Errors
      </h2>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        1. &ldquo;No &apos;Access-Control-Allow-Origin&apos; header is present&rdquo;
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        The most common error. The server doesn&apos;t include the{" "}
        <Code>Access-Control-Allow-Origin</Code> header in its response at all.
        This means the server has no CORS configuration &mdash; you need to add one.
      </p>
      <CodeBlock title="Fix: Add the header to the response">
        {`Access-Control-Allow-Origin: https://app.example.com`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        2. &ldquo;Origin not allowed&rdquo;
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        The header exists, but its value doesn&apos;t match the requesting
        origin. If the header says <Code>https://app.example.com</Code> but your
        frontend is running on <Code>http://localhost:3000</Code>, the browser
        will block it. Double-check the origin value includes the correct
        protocol and port.
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        3. &ldquo;Preflight request failed&rdquo;
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        The browser sent an <Code>OPTIONS</Code> preflight request but the
        server returned a non-2xx status code, or didn&apos;t include the
        required CORS headers in the preflight response. Many servers and
        frameworks don&apos;t handle <Code>OPTIONS</Code> requests by default
        &mdash; you need to add explicit handling for them.
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        4. &ldquo;Method not allowed&rdquo;
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        The preflight response is missing the HTTP method in the{" "}
        <Code>Access-Control-Allow-Methods</Code> header. If your frontend sends
        a <Code>PUT</Code> or <Code>DELETE</Code> but the server only
        allows <Code>GET, POST</Code>, the request is blocked.
      </p>
      <CodeBlock title="Fix: Include all required methods">
        {`Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        5. &ldquo;Header not allowed&rdquo;
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        The request includes a custom header (commonly <Code>Authorization</Code> or{" "}
        <Code>Content-Type</Code> with a value other than the simple types) that
        the server hasn&apos;t explicitly allowed via{" "}
        <Code>Access-Control-Allow-Headers</Code>.
      </p>
      <CodeBlock title="Fix: Allow the headers your client sends">
        {`Access-Control-Allow-Headers: Content-Type, Authorization, X-Request-Id`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        6. &ldquo;Credentials not supported with wildcard origin&rdquo;
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        You set <Code>Access-Control-Allow-Credentials: true</Code> (needed for
        cookies or auth headers) but also used{" "}
        <Code>Access-Control-Allow-Origin: *</Code>. The spec forbids this
        combination. When credentials are involved, the origin must be an
        explicit value &mdash; not a wildcard.
      </p>
      <CodeBlock title="Fix: Use an explicit origin">
        {`Access-Control-Allow-Origin: https://app.example.com
Access-Control-Allow-Credentials: true`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        7. &ldquo;Redirect during preflight&rdquo;
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        The <Code>OPTIONS</Code> preflight request hit a 301 or 302 redirect
        (commonly from HTTP to HTTPS, or from a trailing-slash normalization).
        Preflight requests must not be redirected. Make sure the exact URL your
        frontend calls doesn&apos;t trigger a redirect on the server.
      </p>

      {/* ── How to Fix CORS Errors: Step-by-Step ── */}
      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        How to Fix CORS Errors: Step-by-Step
      </h2>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Step 1: Check the Browser Console
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Open DevTools (F12) and look at the Console tab. The error message tells
        you exactly which header is missing or mismatched. It will say something
        like: <em>&ldquo;has been blocked by CORS policy: No
        &apos;Access-Control-Allow-Origin&apos; header is present on the
        requested resource.&rdquo;</em>
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Step 2: Identify the Origin, Method, and Headers
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        In the Network tab, find the failed request. Note three things:
      </p>
      <ul className="mt-4 space-y-2 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Origin</strong> &mdash;
            the URL of the page making the request (e.g., <Code>http://localhost:3000</Code>)
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Method</strong> &mdash;
            the HTTP verb (GET, POST, PUT, DELETE, PATCH)
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Headers</strong> &mdash;
            any custom headers the request sends (Authorization, Content-Type, etc.)
          </span>
        </li>
      </ul>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Step 3: Add the Correct Headers on the Server
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Using the information from Step 2, configure your server to return:
      </p>
      <CodeBlock title="Required CORS response headers">
        {`Access-Control-Allow-Origin: https://your-frontend.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Max-Age: 86400`}
      </CodeBlock>
      <p className="mt-4 text-gray-600 dark:text-gray-400">
        The <Code>Access-Control-Max-Age</Code> header tells the browser to
        cache the preflight response for the specified number of seconds (86400 =
        24 hours), reducing the number of OPTIONS requests.
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Step 4: Handle Preflight (OPTIONS) Requests
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        The server must respond to <Code>OPTIONS</Code> requests with a{" "}
        <Code>204 No Content</Code> (or <Code>200 OK</Code>) status and include
        all the CORS headers. If your framework doesn&apos;t handle OPTIONS
        automatically, add an explicit route for it.
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Step 5: Test with cURL
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Simulate a preflight request from the terminal to verify your headers are
        correct:
      </p>
      <CodeBlock title="Simulate a preflight request">
        {`curl -X OPTIONS https://api.example.com/endpoint \\
  -H "Origin: https://your-frontend.com" \\
  -H "Access-Control-Request-Method: POST" \\
  -H "Access-Control-Request-Headers: Content-Type, Authorization" \\
  -v`}
      </CodeBlock>
      <p className="mt-4 text-gray-600 dark:text-gray-400">
        The response should include the <Code>Access-Control-Allow-Origin</Code>,{" "}
        <Code>Access-Control-Allow-Methods</Code>, and{" "}
        <Code>Access-Control-Allow-Headers</Code> headers. Use our{" "}
        <Link
          href="/tools/curl-converter"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          cURL to Code Converter
        </Link>{" "}
        to translate this command into fetch, axios, or any other HTTP client.
      </p>

      {/* ── Server Configuration Examples ── */}
      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Server Configuration Examples
      </h2>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Express.js (Node.js)
      </h3>
      <CodeBlock title="Express with cors middleware">
        {`import cors from "cors";
import express from "express";

const app = express();

app.use(cors({
  origin: "https://your-frontend.com",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  maxAge: 86400,
}));

// Or allow multiple origins
app.use(cors({
  origin: [
    "https://your-frontend.com",
    "http://localhost:3000",
  ],
}));`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Next.js API Routes
      </h3>
      <CodeBlock title="next.config.js">
        {`// next.config.js — global CORS via headers
module.exports = {
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "https://your-frontend.com" },
          { key: "Access-Control-Allow-Methods", value: "GET,POST,PUT,DELETE,OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
        ],
      },
    ];
  },
};`}
      </CodeBlock>
      <CodeBlock title="Route handler (App Router)">
        {`// app/api/data/route.ts
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "https://your-frontend.com",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export async function GET() {
  return Response.json({ data: "hello" }, {
    headers: {
      "Access-Control-Allow-Origin": "https://your-frontend.com",
    },
  });
}`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Nginx
      </h3>
      <CodeBlock title="nginx.conf">
        {`location /api/ {
    if ($request_method = 'OPTIONS') {
        add_header 'Access-Control-Allow-Origin' 'https://your-frontend.com';
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS';
        add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization';
        add_header 'Access-Control-Max-Age' 86400;
        return 204;
    }

    add_header 'Access-Control-Allow-Origin' 'https://your-frontend.com' always;
    proxy_pass http://backend;
}`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Apache (.htaccess)
      </h3>
      <CodeBlock title=".htaccess">
        {`<IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin "https://your-frontend.com"
    Header set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
    Header set Access-Control-Allow-Headers "Content-Type, Authorization"
</IfModule>

# Handle preflight
RewriteEngine On
RewriteCond %{REQUEST_METHOD} OPTIONS
RewriteRule ^(.*)$ $1 [R=204,L]`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Go (net/http)
      </h3>
      <CodeBlock title="Go CORS middleware">
        {`func corsMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Access-Control-Allow-Origin", "https://your-frontend.com")
        w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

        if r.Method == http.MethodOptions {
            w.WriteHeader(http.StatusNoContent)
            return
        }

        next.ServeHTTP(w, r)
    })
}`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Python Flask
      </h3>
      <CodeBlock title="Flask with flask-cors">
        {`from flask import Flask
from flask_cors import CORS

app = Flask(__name__)

CORS(app, resources={
    r"/api/*": {
        "origins": "https://your-frontend.com",
        "methods": ["GET", "POST", "PUT", "DELETE"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True,
        "max_age": 86400,
    }
})`}
      </CodeBlock>

      {/* ── Common CORS Mistakes ── */}
      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Common CORS Mistakes
      </h2>
      <ul className="mt-4 space-y-3 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">
              Using <Code>Access-Control-Allow-Origin: *</Code> with credentials.
            </strong>{" "}
            The wildcard origin and <Code>credentials: true</Code> are mutually
            exclusive. The browser will reject the response. Always use an
            explicit origin when sending cookies or auth headers.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">
              Not handling OPTIONS separately.
            </strong>{" "}
            Many frameworks route OPTIONS to the same handler as GET or POST,
            which may return a response body or wrong status code. Ensure OPTIONS
            returns <Code>204</Code> with the CORS headers and no body.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">
              Using a proxy in development but not in production.
            </strong>{" "}
            Tools like Vite and webpack-dev-server can proxy API requests during
            development, hiding CORS issues. Everything works locally, then
            breaks the moment you deploy. Always test with actual cross-origin
            requests before shipping.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">
              Forgetting <Code>Content-Type</Code> in allowed headers.
            </strong>{" "}
            If your client sends <Code>Content-Type: application/json</Code>,
            that triggers a preflight. The server must include{" "}
            <Code>Content-Type</Code> in <Code>Access-Control-Allow-Headers</Code>,
            or the preflight fails.
          </span>
        </li>
      </ul>

      {/* ── When NOT to Use CORS ── */}
      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        When NOT to Use CORS
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        CORS adds complexity. In many cases, you can avoid it entirely:
      </p>
      <ul className="mt-4 space-y-3 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Same-origin architecture.</strong>{" "}
            Serve your API and frontend from the same domain. If both live at{" "}
            <Code>https://example.com</Code>, there&apos;s no cross-origin
            request and no CORS needed.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Reverse proxy.</strong>{" "}
            Put Nginx, Caddy, or a cloud load balancer in front of your API so
            it&apos;s accessible under the same domain as your frontend (e.g.,{" "}
            <Code>example.com/api/*</Code> proxies to your backend).
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Backend-for-Frontend (BFF) pattern.</strong>{" "}
            Your frontend talks to its own server-side layer (e.g., Next.js API
            routes or a lightweight Express server), which then calls the
            external API server-to-server. Server-to-server requests are not
            subject to CORS.
          </span>
        </li>
      </ul>

      {/* ── Affiliate Callout (DigitalOcean) ── */}
      <div className="my-12 rounded-xl border border-blue-200 bg-blue-50/50 p-6 dark:border-blue-900 dark:bg-blue-950/30">
        <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">
          Need a server to configure?
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
          deploys your API directly from a Git repo with built-in CORS
          configuration, free SSL, and auto-scaling. Set your allowed origins in
          the dashboard, push to deploy, and stop fighting CORS headers by hand.
        </p>
      </div>

      {/* ── Closing ── */}
      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Secure Your Headers Beyond CORS
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        CORS is just one piece of browser security. Once your API is accepting
        cross-origin requests correctly, make sure the rest of your security
        headers are in order. Use our{" "}
        <Link
          href="/tools/csp-builder"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          CSP Header Builder
        </Link>{" "}
        to generate a Content Security Policy that prevents XSS attacks, and
        the{" "}
        <Link
          href="/tools/security-headers"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          Security Headers Generator
        </Link>{" "}
        to configure <Code>Strict-Transport-Security</Code>,{" "}
        <Code>X-Frame-Options</Code>, <Code>X-Content-Type-Options</Code>, and
        other headers that harden your application.
      </p>
      <p className="mt-4 text-gray-600 dark:text-gray-400">
        If you need to check what status code your server is returning for
        preflight requests, the{" "}
        <Link
          href="/tools/http-status-codes"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          HTTP Status Code Reference
        </Link>{" "}
        has the full list with explanations. And once you&apos;ve verified your
        CORS setup with cURL, paste the command into the{" "}
        <Link
          href="/tools/curl-converter"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          cURL to Code Converter
        </Link>{" "}
        to generate production-ready code in your language of choice.
      </p>
    </>
  );
}
