"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

interface ParsedUrl {
  protocol: string;
  username: string;
  password: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
  origin: string;
  params: [string, string][];
}

function parseUrl(input: string): ParsedUrl | null {
  try {
    const url = new URL(input);
    return {
      protocol: url.protocol,
      username: url.username,
      password: url.password,
      hostname: url.hostname,
      port: url.port,
      pathname: url.pathname,
      search: url.search,
      hash: url.hash,
      origin: url.origin,
      params: Array.from(url.searchParams.entries()),
    };
  } catch {
    return null;
  }
}

function handleCopy(text: string) {
  navigator.clipboard.writeText(text);
}

export default function UrlParserTool() {
  const [input, setInput] = useState("");

  const parsed = useMemo(() => (input.trim() ? parseUrl(input.trim()) : null), [input]);
  const isInvalid = input.trim().length > 0 && parsed === null;

  const components = parsed
    ? [
        { label: "Protocol", value: parsed.protocol },
        { label: "Origin", value: parsed.origin },
        { label: "Hostname", value: parsed.hostname },
        { label: "Port", value: parsed.port || "(default)" },
        ...(parsed.username
          ? [{ label: "Username", value: parsed.username }]
          : []),
        ...(parsed.password
          ? [{ label: "Password", value: parsed.password }]
          : []),
        { label: "Pathname", value: parsed.pathname },
        { label: "Search", value: parsed.search || "(none)" },
        { label: "Hash", value: parsed.hash || "(none)" },
      ]
    : [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="mb-8 block text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        &larr; Back to tools
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        URL Parser
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Parse and inspect URL components. View protocol, host, path, query
        parameters, and hash.
      </p>

      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            URL
          </label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="https://example.com/path?key=value#section"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 font-mono text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-600"
          />
          {isInvalid && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              Invalid URL. Make sure it includes a protocol (e.g., https://).
            </p>
          )}
        </div>

        {parsed && (
          <>
            <div>
              <h3 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Components
              </h3>
              <div className="rounded-lg border border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-950">
                <dl className="divide-y divide-gray-200 dark:divide-gray-700">
                  {components.map(({ label, value }) => (
                    <div
                      key={label}
                      className="flex items-center justify-between px-4 py-2"
                    >
                      <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {label}
                      </dt>
                      <dd className="flex items-center gap-2">
                        <code className="font-mono text-sm text-gray-900 dark:text-gray-100">
                          {value}
                        </code>
                        {value && value !== "(default)" && value !== "(none)" && (
                          <button
                            onClick={() => handleCopy(value)}
                            className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
                          >
                            Copy
                          </button>
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            {parsed.params.length > 0 && (
              <div>
                <h3 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Query Parameters ({parsed.params.length})
                </h3>
                <div className="rounded-lg border border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-950">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="px-4 py-2 text-left font-medium text-gray-600 dark:text-gray-400">
                          Key
                        </th>
                        <th className="px-4 py-2 text-left font-medium text-gray-600 dark:text-gray-400">
                          Value
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {parsed.params.map(([key, value], i) => (
                        <tr key={i}>
                          <td className="px-4 py-2">
                            <code className="font-mono text-indigo-600 dark:text-indigo-400">
                              {key}
                            </code>
                          </td>
                          <td className="px-4 py-2">
                            <code className="font-mono text-gray-900 dark:text-gray-100">
                              {value}
                            </code>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
