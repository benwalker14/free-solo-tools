"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import RateLimitBanner from "@/components/RateLimitBanner";

// ── Types ──

interface CompressionResult {
  algorithm: string;
  originalSize: number;
  compressedSize: number;
  ratio: number;
  savings: number;
  timeMs: number;
  error?: string;
}

// ── Compression helpers ──

async function compressWithStream(
  data: Uint8Array,
  format: CompressionFormat,
): Promise<{ compressed: Uint8Array; timeMs: number }> {
  const start = performance.now();
  const cs = new CompressionStream(format);
  const writer = cs.writable.getWriter();
  const reader = cs.readable.getReader();

  const chunks: Uint8Array[] = [];
  writer.write(data as unknown as BufferSource);
  writer.close();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }

  const totalLen = chunks.reduce((s, c) => s + c.length, 0);
  const result = new Uint8Array(totalLen);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }

  return { compressed: result, timeMs: performance.now() - start };
}

async function compressWithBrotli(
  data: Uint8Array,
): Promise<{ compressed: Uint8Array; timeMs: number }> {
  const brotliModule = await import("brotli-wasm").then((m) => m.default);
  const start = performance.now();
  const compressed = brotliModule.compress(data);
  return { compressed, timeMs: performance.now() - start };
}

// ── Format helpers ──

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

// ── Samples ──

const SAMPLES: { label: string; text: string }[] = [
  {
    label: "JSON API Response",
    text: `{
  "users": [
    { "id": 1, "name": "Alice Johnson", "email": "alice@example.com", "role": "admin", "active": true, "created_at": "2025-01-15T08:30:00Z" },
    { "id": 2, "name": "Bob Smith", "email": "bob@example.com", "role": "editor", "active": true, "created_at": "2025-02-20T14:15:00Z" },
    { "id": 3, "name": "Carol White", "email": "carol@example.com", "role": "viewer", "active": false, "created_at": "2025-03-01T09:45:00Z" },
    { "id": 4, "name": "David Lee", "email": "david@example.com", "role": "editor", "active": true, "created_at": "2025-03-10T11:00:00Z" },
    { "id": 5, "name": "Eve Brown", "email": "eve@example.com", "role": "admin", "active": true, "created_at": "2025-03-15T16:30:00Z" }
  ],
  "pagination": { "page": 1, "per_page": 20, "total": 5, "total_pages": 1 },
  "meta": { "api_version": "2.0", "request_id": "req_abc123def456" }
}`,
  },
  {
    label: "HTML Page",
    text: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Example Page — Web Compression Test</title>
  <meta name="description" content="This is an example HTML page used to test compression ratios for Brotli, Gzip, and Deflate algorithms.">
  <link rel="stylesheet" href="/styles/main.css">
  <link rel="icon" type="image/png" href="/favicon.png">
  <script defer src="/scripts/app.js"></script>
</head>
<body>
  <header class="site-header">
    <nav class="nav-container">
      <a href="/" class="logo">CompressTest</a>
      <ul class="nav-links">
        <li><a href="/features">Features</a></li>
        <li><a href="/pricing">Pricing</a></li>
        <li><a href="/docs">Documentation</a></li>
        <li><a href="/blog">Blog</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul>
    </nav>
  </header>
  <main class="content">
    <section class="hero">
      <h1>Welcome to Our Platform</h1>
      <p>Build faster, deploy smarter, and scale effortlessly with our developer-first tools.</p>
      <div class="cta-buttons">
        <a href="/signup" class="btn btn-primary">Get Started Free</a>
        <a href="/demo" class="btn btn-secondary">Watch Demo</a>
      </div>
    </section>
    <section class="features">
      <h2>Why Developers Choose Us</h2>
      <div class="feature-grid">
        <div class="feature-card">
          <h3>Lightning Fast</h3>
          <p>Sub-millisecond response times powered by edge computing and smart caching strategies.</p>
        </div>
        <div class="feature-card">
          <h3>Secure by Default</h3>
          <p>End-to-end encryption, SOC 2 compliance, and automated security scanning built in.</p>
        </div>
        <div class="feature-card">
          <h3>Developer Experience</h3>
          <p>Intuitive APIs, comprehensive SDKs, and documentation that actually helps.</p>
        </div>
      </div>
    </section>
  </main>
  <footer class="site-footer">
    <p>&copy; 2025 CompressTest. All rights reserved.</p>
  </footer>
</body>
</html>`,
  },
  {
    label: "CSS Stylesheet",
    text: `:root {
  --color-primary: #4f46e5;
  --color-primary-dark: #4338ca;
  --color-secondary: #06b6d4;
  --color-background: #ffffff;
  --color-surface: #f9fafb;
  --color-text: #111827;
  --color-text-muted: #6b7280;
  --color-border: #e5e7eb;
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
}

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: var(--color-text);
  background: var(--color-background);
  line-height: 1.6;
}

.container { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; }

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.625rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: var(--radius-md);
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 150ms ease;
  text-decoration: none;
}

.btn-primary {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.btn-primary:hover { background: var(--color-primary-dark); }

.btn-secondary {
  background: transparent;
  color: var(--color-primary);
  border-color: var(--color-border);
}

.btn-secondary:hover { background: var(--color-surface); }

.card {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  transition: box-shadow 150ms ease;
}

.card:hover { box-shadow: var(--shadow-md); }

.grid { display: grid; gap: 1.5rem; }
.grid-2 { grid-template-columns: repeat(2, 1fr); }
.grid-3 { grid-template-columns: repeat(3, 1fr); }

@media (max-width: 768px) {
  .grid-2, .grid-3 { grid-template-columns: 1fr; }
}

.flex { display: flex; }
.flex-col { flex-direction: column; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
.gap-2 { gap: 0.5rem; }
.gap-4 { gap: 1rem; }

.text-sm { font-size: 0.875rem; }
.text-lg { font-size: 1.125rem; }
.text-xl { font-size: 1.25rem; }
.font-bold { font-weight: 700; }
.text-muted { color: var(--color-text-muted); }`,
  },
  {
    label: "Log File",
    text: `2025-03-19T08:00:01.123Z [INFO]  server: HTTP server started on port 8080
2025-03-19T08:00:01.124Z [INFO]  server: TLS enabled with certificate /etc/ssl/certs/server.pem
2025-03-19T08:00:01.125Z [INFO]  database: Connected to PostgreSQL at db.internal:5432/myapp
2025-03-19T08:00:01.126Z [INFO]  cache: Redis connection established at cache.internal:6379
2025-03-19T08:00:01.127Z [INFO]  worker: Background job processor started with 4 workers
2025-03-19T08:00:05.234Z [INFO]  request: GET /api/v1/users 200 12ms user_agent=Mozilla/5.0
2025-03-19T08:00:05.456Z [INFO]  request: GET /api/v1/products 200 8ms user_agent=Mozilla/5.0
2025-03-19T08:00:06.789Z [WARN]  rate_limit: Client 192.168.1.42 approaching rate limit (98/100 requests in window)
2025-03-19T08:00:07.012Z [INFO]  request: POST /api/v1/orders 201 45ms user_agent=Mozilla/5.0
2025-03-19T08:00:07.345Z [INFO]  event: Order created order_id=ord_abc123 user_id=usr_456 total=49.99
2025-03-19T08:00:08.678Z [ERROR] request: POST /api/v1/payments 500 120ms error="payment gateway timeout"
2025-03-19T08:00:08.679Z [ERROR] payment: Gateway timeout after 5000ms gateway=stripe request_id=req_789
2025-03-19T08:00:09.012Z [INFO]  retry: Retrying payment request_id=req_789 attempt=2/3
2025-03-19T08:00:10.234Z [INFO]  payment: Payment succeeded request_id=req_789 attempt=2
2025-03-19T08:00:15.567Z [INFO]  request: GET /api/v1/users/profile 200 6ms user_agent=PostmanRuntime/7.36
2025-03-19T08:00:20.890Z [INFO]  worker: Job completed job_id=job_001 type=email_send duration=1234ms
2025-03-19T08:00:25.123Z [WARN]  database: Slow query detected query="SELECT * FROM orders WHERE created_at > $1" duration=2345ms
2025-03-19T08:00:30.456Z [INFO]  health: Health check passed cpu=23% memory=45% disk=67% connections=12/100
2025-03-19T08:00:35.789Z [INFO]  request: GET /api/v1/analytics 200 89ms user_agent=Mozilla/5.0
2025-03-19T08:00:40.012Z [INFO]  cache: Cache hit ratio 94.2% (1234/1310 requests served from cache)`,
  },
];

// ── Component ──

export default function CompressionTesterTool() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<CompressionResult[]>([]);
  const [error, setError] = useState("");
  const [isCompressing, setIsCompressing] = useState(false);
  const abortRef = useRef(false);

  const { trackAction } = useToolAnalytics("compression-tester");
  const { remaining, dailyLimit, isLimited, recordUsage } =
    useRateLimit("compression-tester");

  const handleCompress = useCallback(async () => {
    setError("");
    setResults([]);

    if (!input.trim()) {
      setError("Please enter or paste text to test compression.");
      return;
    }

    if (isLimited) return;
    recordUsage();
    trackAction("compress");

    setIsCompressing(true);
    abortRef.current = false;

    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const originalSize = data.length;
    const newResults: CompressionResult[] = [];

    // Gzip
    try {
      const { compressed, timeMs } = await compressWithStream(data, "gzip");
      newResults.push({
        algorithm: "Gzip",
        originalSize,
        compressedSize: compressed.length,
        ratio: compressed.length / originalSize,
        savings: ((originalSize - compressed.length) / originalSize) * 100,
        timeMs,
      });
    } catch {
      newResults.push({
        algorithm: "Gzip",
        originalSize,
        compressedSize: 0,
        ratio: 0,
        savings: 0,
        timeMs: 0,
        error: "CompressionStream not supported",
      });
    }

    if (abortRef.current) { setIsCompressing(false); return; }

    // Deflate
    try {
      const { compressed, timeMs } = await compressWithStream(data, "deflate");
      newResults.push({
        algorithm: "Deflate",
        originalSize,
        compressedSize: compressed.length,
        ratio: compressed.length / originalSize,
        savings: ((originalSize - compressed.length) / originalSize) * 100,
        timeMs,
      });
    } catch {
      newResults.push({
        algorithm: "Deflate",
        originalSize,
        compressedSize: 0,
        ratio: 0,
        savings: 0,
        timeMs: 0,
        error: "CompressionStream not supported",
      });
    }

    if (abortRef.current) { setIsCompressing(false); return; }

    // Brotli
    try {
      const { compressed, timeMs } = await compressWithBrotli(data);
      newResults.push({
        algorithm: "Brotli",
        originalSize,
        compressedSize: compressed.length,
        ratio: compressed.length / originalSize,
        savings: ((originalSize - compressed.length) / originalSize) * 100,
        timeMs,
      });
    } catch {
      newResults.push({
        algorithm: "Brotli",
        originalSize,
        compressedSize: 0,
        ratio: 0,
        savings: 0,
        timeMs: 0,
        error: "Brotli WASM failed to load",
      });
    }

    setResults(newResults);
    setIsCompressing(false);
  }, [input, isLimited, recordUsage, trackAction]);

  useKeyboardShortcut("Enter", handleCompress);

  function handleLoadSample(idx: number) {
    setInput(SAMPLES[idx].text);
    setResults([]);
    setError("");
  }

  function handleClear() {
    setInput("");
    setResults([]);
    setError("");
  }

  // Find best result (highest savings, no error)
  const bestResult = results
    .filter((r) => !r.error)
    .sort((a, b) => b.savings - a.savings)[0];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="mb-8 block text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        &larr; Back to tools
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Brotli / Gzip Compression Tester
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Test and compare Brotli, Gzip, and Deflate compression ratios for your
        text content. See which algorithm gives the best compression for your
        data.
      </p>

      <RateLimitBanner
        remaining={remaining}
        dailyLimit={dailyLimit}
        isLimited={isLimited}
      />

      {/* Input */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Input Text
          </label>
          <div className="flex gap-3">
            {SAMPLES.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => handleLoadSample(idx)}
                className="text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste text, JSON, HTML, CSS, or any content to test compression ratios..."
          rows={12}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 font-mono text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
          spellCheck={false}
        />
        {input && (
          <div className="mt-1 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>
              {formatBytes(new TextEncoder().encode(input).length)} &middot;{" "}
              {input.length.toLocaleString()} characters
            </span>
            <button
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Compress button */}
      <button
        onClick={handleCompress}
        disabled={isLimited || !input.trim() || isCompressing}
        className="mb-6 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-gray-900"
      >
        {isCompressing ? "Compressing..." : "Test Compression"}{" "}
        {!isCompressing && (
          <kbd className="ml-1.5 hidden rounded bg-indigo-500 px-1.5 py-0.5 text-xs font-medium sm:inline-block">
            Ctrl+Enter
          </kbd>
        )}
      </button>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="mb-6 space-y-4">
          {/* Summary bar */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Compression Results
              </h2>
              <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                Original: {formatBytes(results[0].originalSize)}
              </span>
            </div>

            {/* Comparison cards */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {results.map((result) => (
                <div
                  key={result.algorithm}
                  className={`rounded-lg border p-4 ${
                    result.error
                      ? "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/50"
                      : bestResult?.algorithm === result.algorithm
                        ? "border-green-300 bg-green-50 dark:border-green-800 dark:bg-green-950/50"
                        : "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      {result.algorithm}
                    </h3>
                    {!result.error &&
                      bestResult?.algorithm === result.algorithm && (
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900 dark:text-green-300">
                          Best
                        </span>
                      )}
                  </div>

                  {result.error ? (
                    <p className="text-xs text-red-600 dark:text-red-400">
                      {result.error}
                    </p>
                  ) : (
                    <>
                      <div className="space-y-1.5 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">
                            Compressed
                          </span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {formatBytes(result.compressedSize)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">
                            Savings
                          </span>
                          <span className="font-medium text-green-600 dark:text-green-400">
                            {result.savings.toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">
                            Ratio
                          </span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {result.ratio.toFixed(3)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">
                            Time
                          </span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {result.timeMs < 1
                              ? `${(result.timeMs * 1000).toFixed(0)} \u00b5s`
                              : `${result.timeMs.toFixed(1)} ms`}
                          </span>
                        </div>
                      </div>

                      {/* Visual bar */}
                      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                        <div
                          className={`h-full rounded-full transition-all ${
                            bestResult?.algorithm === result.algorithm
                              ? "bg-green-500"
                              : "bg-indigo-500"
                          }`}
                          style={{
                            width: `${Math.max(result.ratio * 100, 2)}%`,
                          }}
                        />
                      </div>
                      <div className="mt-1 flex justify-between text-xs text-gray-400 dark:text-gray-500">
                        <span>0%</span>
                        <span>{(result.ratio * 100).toFixed(0)}% of original</span>
                        <span>100%</span>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Comparison table */}
          <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
                  <th className="px-4 py-2.5 text-left font-medium text-gray-600 dark:text-gray-400">
                    Algorithm
                  </th>
                  <th className="px-4 py-2.5 text-right font-medium text-gray-600 dark:text-gray-400">
                    Original
                  </th>
                  <th className="px-4 py-2.5 text-right font-medium text-gray-600 dark:text-gray-400">
                    Compressed
                  </th>
                  <th className="px-4 py-2.5 text-right font-medium text-gray-600 dark:text-gray-400">
                    Savings
                  </th>
                  <th className="px-4 py-2.5 text-right font-medium text-gray-600 dark:text-gray-400">
                    Ratio
                  </th>
                  <th className="px-4 py-2.5 text-right font-medium text-gray-600 dark:text-gray-400">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {results.map((result) => (
                  <tr
                    key={result.algorithm}
                    className="border-b border-gray-100 dark:border-gray-800"
                  >
                    <td className="px-4 py-2.5 font-medium text-gray-900 dark:text-white">
                      {result.algorithm}
                      {!result.error &&
                        bestResult?.algorithm === result.algorithm && (
                          <span className="ml-2 text-xs text-green-600 dark:text-green-400">
                            Best
                          </span>
                        )}
                    </td>
                    <td className="px-4 py-2.5 text-right text-gray-600 dark:text-gray-400">
                      {formatBytes(result.originalSize)}
                    </td>
                    <td className="px-4 py-2.5 text-right text-gray-600 dark:text-gray-400">
                      {result.error ? "—" : formatBytes(result.compressedSize)}
                    </td>
                    <td className="px-4 py-2.5 text-right font-medium text-green-600 dark:text-green-400">
                      {result.error ? "—" : `${result.savings.toFixed(1)}%`}
                    </td>
                    <td className="px-4 py-2.5 text-right text-gray-600 dark:text-gray-400">
                      {result.error ? "—" : result.ratio.toFixed(3)}
                    </td>
                    <td className="px-4 py-2.5 text-right text-gray-600 dark:text-gray-400">
                      {result.error
                        ? "—"
                        : result.timeMs < 1
                          ? `${(result.timeMs * 1000).toFixed(0)} \u00b5s`
                          : `${result.timeMs.toFixed(1)} ms`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          About Compression Testing
        </h2>
        <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
          <li>
            <strong>Brotli</strong> — developed by Google, typically achieves
            15-25% better compression than Gzip for text content. Supported by
            all modern browsers via HTTPS.
          </li>
          <li>
            <strong>Gzip</strong> — the most widely supported compression
            format. Based on DEFLATE algorithm. Universally supported by web
            servers and browsers.
          </li>
          <li>
            <strong>Deflate</strong> — the underlying algorithm used by both
            Gzip and Zlib. Lower overhead than Gzip (no header/trailer), but
            less common as a standalone format.
          </li>
          <li>
            Compression ratios vary by content type — repetitive text like JSON
            and HTML compresses well (70-90% savings), while already-compressed
            or random data may not compress at all.
          </li>
          <li>
            Everything runs in your browser — Gzip and Deflate use the native
            CompressionStream API, Brotli uses brotli-wasm. No data is sent over
            the network.
          </li>
        </ul>
      </div>
    </div>
  );
}
