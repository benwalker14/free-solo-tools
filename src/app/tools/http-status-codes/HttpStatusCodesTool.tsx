"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";

interface StatusCode {
  code: number;
  name: string;
  description: string;
  details: string;
}

interface Category {
  key: string;
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  badgeBg: string;
  codes: StatusCode[];
}

const CATEGORIES: Category[] = [
  {
    key: "1xx",
    label: "Informational",
    color: "text-blue-700 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
    borderColor: "border-blue-200 dark:border-blue-800",
    badgeBg: "bg-blue-600",
    codes: [
      {
        code: 100,
        name: "Continue",
        description:
          "The server has received the request headers and the client should proceed to send the request body.",
        details:
          "Used with large request bodies. The client sends Expect: 100-continue, and the server responds with 100 before the client sends the body. This avoids sending large payloads that might be rejected.",
      },
      {
        code: 101,
        name: "Switching Protocols",
        description:
          "The server is switching protocols as requested by the client via the Upgrade header.",
        details:
          "Most commonly seen when upgrading an HTTP connection to WebSocket. The client sends an Upgrade: websocket header, and the server responds with 101 to confirm the protocol switch.",
      },
      {
        code: 102,
        name: "Processing",
        description:
          "The server has received and is processing the request, but no response is available yet.",
        details:
          "Defined by WebDAV (RFC 2518). Prevents the client from timing out when the server needs extended time to process a request. Rarely used in modern APIs.",
      },
      {
        code: 103,
        name: "Early Hints",
        description:
          "Used to return some response headers before the final HTTP message.",
        details:
          "Allows the browser to start preloading resources (stylesheets, scripts) via Link headers while the server is still preparing the full response. Improves page load performance.",
      },
    ],
  },
  {
    key: "2xx",
    label: "Success",
    color: "text-green-700 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-950/30",
    borderColor: "border-green-200 dark:border-green-800",
    badgeBg: "bg-green-600",
    codes: [
      {
        code: 200,
        name: "OK",
        description:
          "The request succeeded. The response body contains the requested resource.",
        details:
          "The most common HTTP status code. For GET requests, the response contains the requested data. For POST, it contains the result of the action. For PUT/PATCH, it may contain the updated resource.",
      },
      {
        code: 201,
        name: "Created",
        description:
          "The request succeeded and a new resource was created.",
        details:
          "Typically returned after a POST request that creates a new resource. The response should include a Location header with the URI of the newly created resource.",
      },
      {
        code: 202,
        name: "Accepted",
        description:
          "The request has been accepted for processing, but the processing has not been completed.",
        details:
          "Used for asynchronous operations. The server has received the request and will process it later (e.g., batch jobs, email sending, video processing). The response may include a link to check the status.",
      },
      {
        code: 203,
        name: "Non-Authoritative Information",
        description:
          "The server is a transforming proxy that received a 200 OK from the origin but is returning a modified version.",
        details:
          "Indicates the response metadata is not exactly as it would have been from the origin server. Used by proxies or CDNs that modify responses. Rarely used in practice.",
      },
      {
        code: 204,
        name: "No Content",
        description:
          "The request succeeded but there is no content to return.",
        details:
          "Common for DELETE requests and PUT/PATCH updates where the client doesn't need the updated resource back. The response must not include a body. Also used for preflight CORS responses.",
      },
      {
        code: 205,
        name: "Reset Content",
        description:
          "The server fulfilled the request and the client should reset the document view.",
        details:
          "Tells the client to reset the form or document that caused the request to be sent. For example, after submitting a form, the browser should clear all form fields. Rarely used.",
      },
      {
        code: 206,
        name: "Partial Content",
        description:
          "The server is delivering only part of the resource due to a Range header sent by the client.",
        details:
          "Used for resumable downloads and video/audio streaming. The client sends a Range header (e.g., Range: bytes=0-1023), and the server responds with 206 and a Content-Range header.",
      },
      {
        code: 207,
        name: "Multi-Status",
        description:
          "Conveys information about multiple resources in situations where multiple status codes might be appropriate.",
        details:
          "Defined by WebDAV (RFC 4918). The response body is an XML document containing multiple status codes for multiple sub-requests in a batch operation.",
      },
      {
        code: 208,
        name: "Already Reported",
        description:
          "Used inside a DAV: propstat response to avoid repeatedly enumerating the internal members of multiple bindings.",
        details:
          "Defined by WebDAV (RFC 5842). Prevents infinite loops in recursive directory listings where the same resource appears via multiple paths.",
      },
      {
        code: 226,
        name: "IM Used",
        description:
          "The server has fulfilled a GET request for the resource, and the response represents the result of instance-manipulations applied.",
        details:
          "Defined by RFC 3229 (Delta Encoding). The server sends a delta (difference) instead of the full resource, reducing bandwidth. Very rarely used.",
      },
    ],
  },
  {
    key: "3xx",
    label: "Redirection",
    color: "text-yellow-700 dark:text-yellow-400",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/30",
    borderColor: "border-yellow-200 dark:border-yellow-800",
    badgeBg: "bg-yellow-600",
    codes: [
      {
        code: 300,
        name: "Multiple Choices",
        description:
          "The request has more than one possible response. The client should choose one.",
        details:
          "Used when a resource is available in multiple representations (e.g., different languages or formats). The server provides a list of choices. Rarely used in practice.",
      },
      {
        code: 301,
        name: "Moved Permanently",
        description:
          "The requested resource has been permanently moved to a new URL.",
        details:
          "Search engines will update their index to use the new URL. Browsers cache the redirect. Use for permanent URL changes, domain migrations, or enforcing canonical URLs. The new URL is in the Location header.",
      },
      {
        code: 302,
        name: "Found",
        description:
          "The requested resource temporarily resides at a different URL.",
        details:
          'Originally meant "Moved Temporarily". The client should continue using the original URL. Browsers may incorrectly change POST to GET on redirect — use 307 instead if method preservation is needed.',
      },
      {
        code: 303,
        name: "See Other",
        description:
          "The response to the request can be found under a different URL using GET.",
        details:
          "Used after POST/PUT to redirect the client to a different resource via GET. Common in the Post/Redirect/Get (PRG) pattern to prevent form resubmission when the user refreshes.",
      },
      {
        code: 304,
        name: "Not Modified",
        description:
          "The resource has not been modified since the version specified in the request headers.",
        details:
          "Used for caching. The client sends If-Modified-Since or If-None-Match headers. If unchanged, the server responds with 304 and no body, telling the client to use its cached copy. Saves bandwidth.",
      },
      {
        code: 307,
        name: "Temporary Redirect",
        description:
          "The request should be repeated with another URI, but future requests should still use the original URI.",
        details:
          "Like 302, but guarantees the HTTP method and body will not change during the redirect. If the original request was POST, the redirected request will also be POST.",
      },
      {
        code: 308,
        name: "Permanent Redirect",
        description:
          "The resource has been permanently moved to another URI, and the request method must not change.",
        details:
          "Like 301, but guarantees the HTTP method and body will not change. Useful for API versioning where POST endpoints are permanently relocated.",
      },
    ],
  },
  {
    key: "4xx",
    label: "Client Error",
    color: "text-orange-700 dark:text-orange-400",
    bgColor: "bg-orange-50 dark:bg-orange-950/30",
    borderColor: "border-orange-200 dark:border-orange-800",
    badgeBg: "bg-orange-600",
    codes: [
      {
        code: 400,
        name: "Bad Request",
        description:
          "The server cannot process the request due to a client error (malformed syntax, invalid parameters).",
        details:
          "The generic client error response. Common causes: malformed JSON, missing required fields, invalid query parameters. The response body should explain what was wrong.",
      },
      {
        code: 401,
        name: "Unauthorized",
        description:
          "The request requires user authentication. The client must provide valid credentials.",
        details:
          'Despite the name, this means "unauthenticated" — the client has not proven its identity. The server should include a WWW-Authenticate header indicating the authentication scheme.',
      },
      {
        code: 402,
        name: "Payment Required",
        description:
          "Reserved for future use. Originally intended for digital payment systems.",
        details:
          "Not widely used in standard HTTP. Some APIs use it to indicate a paid subscription is required, or that the user has exceeded their usage quota.",
      },
      {
        code: 403,
        name: "Forbidden",
        description:
          "The server understood the request but refuses to authorize it.",
        details:
          "Unlike 401, the client's identity is known but they lack permission. Re-authenticating will not help. Common for accessing admin-only resources or IP-blocked requests.",
      },
      {
        code: 404,
        name: "Not Found",
        description:
          "The server cannot find the requested resource. The URL is not recognized.",
        details:
          "The most well-known HTTP error. Can mean the URL is wrong, the resource was deleted, or the server is deliberately hiding a resource's existence (instead of 403).",
      },
      {
        code: 405,
        name: "Method Not Allowed",
        description:
          "The HTTP method is not supported for the requested resource.",
        details:
          "For example, sending DELETE to a read-only resource, or POST to a resource that only accepts GET. The response must include an Allow header listing the supported methods.",
      },
      {
        code: 406,
        name: "Not Acceptable",
        description:
          "The server cannot produce a response matching the Accept headers sent by the client.",
        details:
          "Content negotiation failed. The client requested a format the server can't provide (e.g., Accept: application/xml when only JSON is available).",
      },
      {
        code: 407,
        name: "Proxy Authentication Required",
        description:
          "The client must first authenticate itself with the proxy.",
        details:
          "Similar to 401, but the authentication is required by a proxy server between the client and the origin server. The proxy must send a Proxy-Authenticate header.",
      },
      {
        code: 408,
        name: "Request Timeout",
        description:
          "The server timed out waiting for the client to send the request.",
        details:
          "The client did not produce a request within the time the server was prepared to wait. Some servers send this to close idle connections. The client may repeat the request.",
      },
      {
        code: 409,
        name: "Conflict",
        description:
          "The request conflicts with the current state of the server.",
        details:
          "Common in APIs when trying to create a resource that already exists, or when concurrent edits conflict (optimistic locking). The response should include enough information to resolve the conflict.",
      },
      {
        code: 410,
        name: "Gone",
        description:
          "The resource is no longer available and will not be available again.",
        details:
          "Unlike 404, this explicitly states the resource existed but has been intentionally and permanently removed. Search engines will deindex the page faster than with 404.",
      },
      {
        code: 411,
        name: "Length Required",
        description:
          "The server requires a Content-Length header in the request.",
        details:
          "The server refuses the request because it requires the Content-Length header to be defined. Rare in modern HTTP as most servers handle this automatically.",
      },
      {
        code: 412,
        name: "Precondition Failed",
        description:
          "One or more conditions in the request header fields evaluated to false.",
        details:
          "Used with conditional requests (If-Match, If-Unmodified-Since). For example, a PUT with If-Match fails because the ETag has changed, indicating someone else modified the resource.",
      },
      {
        code: 413,
        name: "Content Too Large",
        description:
          "The request body is larger than the server is willing to process.",
        details:
          'Previously called "Payload Too Large". The server may close the connection. Common when uploading files that exceed the server\'s size limit.',
      },
      {
        code: 414,
        name: "URI Too Long",
        description:
          "The URI provided was too long for the server to process.",
        details:
          "Can happen when a client incorrectly sends query data in a GET URI that should be in a POST body, or when redirect loops append to the URL.",
      },
      {
        code: 415,
        name: "Unsupported Media Type",
        description:
          "The server does not support the media type of the request body.",
        details:
          "For example, sending application/xml to an endpoint that only accepts application/json, or uploading an unsupported image format. Check the Content-Type header.",
      },
      {
        code: 416,
        name: "Range Not Satisfiable",
        description:
          "The range specified in the Range header cannot be fulfilled.",
        details:
          "The client requested a byte range that extends beyond the resource size. The server should return a Content-Range header with the actual size.",
      },
      {
        code: 417,
        name: "Expectation Failed",
        description:
          "The server cannot meet the requirements of the Expect request header.",
        details:
          "Usually related to the Expect: 100-continue header. The server indicates it cannot meet the stated expectation, so the client should not send the request body.",
      },
      {
        code: 418,
        name: "I'm a Teapot",
        description:
          "The server refuses to brew coffee because it is, permanently, a teapot.",
        details:
          "Defined in RFC 2324 (Hyper Text Coffee Pot Control Protocol) as an April Fools' joke in 1998. Not a real status code but widely known and beloved as an Easter egg in many web frameworks.",
      },
      {
        code: 421,
        name: "Misdirected Request",
        description:
          "The request was directed at a server that is not able to produce a response.",
        details:
          "Can occur with HTTP/2 when a connection is reused for a different hostname that the server's TLS certificate doesn't cover.",
      },
      {
        code: 422,
        name: "Unprocessable Content",
        description:
          "The server understands the content type and syntax but cannot process the contained instructions.",
        details:
          "Originally from WebDAV, now widely used in APIs. The request is well-formed (not a 400) but semantically incorrect — for example, valid JSON that fails business validation.",
      },
      {
        code: 423,
        name: "Locked",
        description:
          "The resource is currently locked and cannot be modified.",
        details:
          "WebDAV extension. The resource is locked by another user or process, preventing concurrent modifications.",
      },
      {
        code: 424,
        name: "Failed Dependency",
        description:
          "The request failed because it depended on another request that failed.",
        details:
          "WebDAV extension. In batch operations, if one sub-request fails and another depends on it, the dependent request gets 424.",
      },
      {
        code: 425,
        name: "Too Early",
        description:
          "The server is unwilling to risk processing a request that might be replayed.",
        details:
          "Used with TLS 1.3 Early Data (0-RTT). The server refuses to process the request because it was sent in early data and could potentially be a replay attack.",
      },
      {
        code: 426,
        name: "Upgrade Required",
        description:
          "The server refuses to perform the request using the current protocol.",
        details:
          "The server requires the client to upgrade to a different protocol. The response should include an Upgrade header indicating the required protocol (e.g., TLS/1.0, HTTP/2).",
      },
      {
        code: 428,
        name: "Precondition Required",
        description:
          "The origin server requires the request to be conditional.",
        details:
          "The server requires requests to include conditional headers like If-Match to prevent lost update problems. This prevents clients from accidentally overwriting changes made by others.",
      },
      {
        code: 429,
        name: "Too Many Requests",
        description:
          "The user has sent too many requests in a given amount of time (rate limiting).",
        details:
          "The server is rate limiting the client. The response should include a Retry-After header indicating how long to wait. Essential for API protection. Implement exponential backoff on the client side.",
      },
      {
        code: 431,
        name: "Request Header Fields Too Large",
        description:
          "The server refuses to process the request because the headers are too large.",
        details:
          "Either a single header field or the combined size of all headers is too large. Common when cookies accumulate excessive data. The client should reduce header size and retry.",
      },
      {
        code: 451,
        name: "Unavailable For Legal Reasons",
        description:
          "The server is denying access to the resource as a consequence of a legal demand.",
        details:
          "Named after Ray Bradbury's Fahrenheit 451. Used when content is censored by government order, blocked due to copyright (DMCA), or restricted by sanctions.",
      },
    ],
  },
  {
    key: "5xx",
    label: "Server Error",
    color: "text-red-700 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-950/30",
    borderColor: "border-red-200 dark:border-red-800",
    badgeBg: "bg-red-600",
    codes: [
      {
        code: 500,
        name: "Internal Server Error",
        description:
          "The server encountered an unexpected condition that prevented it from fulfilling the request.",
        details:
          "The generic server error. Could be an unhandled exception, a crash, or a bug. Never expose stack traces to the client in production — log internally and return a generic message.",
      },
      {
        code: 501,
        name: "Not Implemented",
        description:
          "The server does not support the functionality required to fulfill the request.",
        details:
          "The server does not recognize the request method or lacks the ability to process it. Different from 405 — 501 means the method is not implemented at all, not just disallowed for this resource.",
      },
      {
        code: 502,
        name: "Bad Gateway",
        description:
          "The server, acting as a gateway or proxy, received an invalid response from an upstream server.",
        details:
          "Common with reverse proxies (Nginx, load balancers) when the upstream application server crashes, returns malformed data, or is unreachable. Check upstream server health and logs.",
      },
      {
        code: 503,
        name: "Service Unavailable",
        description:
          "The server is currently unable to handle the request due to temporary overloading or maintenance.",
        details:
          "The server is temporarily down. Common during deployments, maintenance windows, or traffic spikes. Should include a Retry-After header. Search engines treat this as temporary.",
      },
      {
        code: 504,
        name: "Gateway Timeout",
        description:
          "The server, acting as a gateway or proxy, did not receive a timely response from an upstream server.",
        details:
          "Similar to 502 but specifically a timeout issue. Common with slow database queries, external API calls, or misconfigured proxy timeouts.",
      },
      {
        code: 505,
        name: "HTTP Version Not Supported",
        description:
          "The server does not support the HTTP protocol version used in the request.",
        details:
          "The server cannot process the request with the HTTP version used. Rare in practice, as protocol negotiation usually handles version compatibility automatically.",
      },
      {
        code: 506,
        name: "Variant Also Negotiates",
        description:
          "The server has an internal configuration error: transparent content negotiation results in a circular reference.",
        details:
          "Defined by RFC 2295. A misconfiguration where the chosen variant resource itself triggers further negotiation, creating an infinite loop. Very rare.",
      },
      {
        code: 507,
        name: "Insufficient Storage",
        description:
          "The server cannot store the representation needed to complete the request.",
        details:
          "Defined by WebDAV (RFC 4918). The server has run out of disk space or quota to store the resource.",
      },
      {
        code: 508,
        name: "Loop Detected",
        description:
          "The server detected an infinite loop while processing the request.",
        details:
          "Defined by WebDAV (RFC 5842). The server terminated an operation because it encountered an infinite loop. Similar to 506 but for WebDAV-specific operations.",
      },
      {
        code: 510,
        name: "Not Extended",
        description:
          "Further extensions to the request are required for the server to fulfill it.",
        details:
          "Defined by RFC 2774 (HTTP Extension Framework). The server requires additional extensions that the client did not include. Very rarely used.",
      },
      {
        code: 511,
        name: "Network Authentication Required",
        description:
          "The client needs to authenticate to gain network access.",
        details:
          "Used by captive portals (hotel WiFi, airport WiFi) that intercept HTTP traffic. The client must open a browser and authenticate before the network allows access.",
      },
    ],
  },
];

const ALL_CODES = CATEGORIES.flatMap((cat) =>
  cat.codes.map((code) => ({ ...code, category: cat }))
);

export default function HttpStatusCodesTool() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [expandedCode, setExpandedCode] = useState<number | null>(null);
  const [copiedCode, setCopiedCode] = useState<number | null>(null);
  const { trackAction } = useToolAnalytics("http-status-codes");

  const filtered = useMemo(() => {
    return ALL_CODES.filter((item) => {
      const matchesCategory =
        activeCategory === "all" || item.category.key === activeCategory;
      if (!search) return matchesCategory;
      const q = search.toLowerCase();
      return (
        matchesCategory &&
        (item.code.toString().includes(q) ||
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q))
      );
    });
  }, [search, activeCategory]);

  const groupedFiltered = useMemo(() => {
    const groups: Record<string, typeof ALL_CODES> = {};
    for (const item of filtered) {
      const key = item.category.key;
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    }
    return groups;
  }, [filtered]);

  const handleCopy = (code: number, name: string) => {
    trackAction("copy");
    navigator.clipboard.writeText(`${code} ${name}`);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1500);
  };

  const toggleExpand = (code: number) => {
    trackAction("expand");
    setExpandedCode(expandedCode === code ? null : code);
  };

  const categoryTabs = [
    { key: "all", label: "All" },
    ...CATEGORIES.map((c) => ({ key: c.key, label: c.key.toUpperCase() })),
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="mb-8 block text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        &larr; Back to tools
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        HTTP Status Code Reference
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Complete reference for all HTTP response status codes. Search by code or
        name, filter by category, and click any code for detailed explanations.
      </p>

      {/* Search */}
      <div className="relative mb-4">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="Search by code, name, or description (e.g. 404, Not Found, cache)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-3 text-sm text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder-gray-400"
        />
      </div>

      {/* Category tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {categoryTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveCategory(tab.key)}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              activeCategory === tab.key
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            {tab.label}
            <span className="ml-1.5 text-xs opacity-75">
              {tab.key === "all"
                ? ALL_CODES.length
                : CATEGORIES.find((c) => c.key === tab.key)?.codes.length}
            </span>
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-xs text-gray-500 dark:text-gray-500 mb-4">
        {filtered.length} status code{filtered.length !== 1 ? "s" : ""}
        {search && ` matching "${search}"`}
      </p>

      {/* Status code list - grouped by category */}
      {filtered.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white py-16 text-center text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
          No status codes match &ldquo;{search}&rdquo;
        </div>
      ) : (
        <div className="space-y-8">
          {CATEGORIES.map((cat) => {
            const items = groupedFiltered[cat.key];
            if (!items || items.length === 0) return null;
            return (
              <div key={cat.key}>
                <h2
                  className={`text-lg font-semibold ${cat.color} mb-3 flex items-center gap-2`}
                >
                  <span
                    className={`${cat.badgeBg} text-white text-xs font-bold px-2 py-0.5 rounded`}
                  >
                    {cat.key}
                  </span>
                  {cat.label}
                </h2>
                <div className="space-y-2">
                  {items.map((item) => {
                    const isExpanded = expandedCode === item.code;
                    const isCopied = copiedCode === item.code;
                    return (
                      <div
                        key={item.code}
                        className={`rounded-lg border ${item.category.borderColor} ${item.category.bgColor} overflow-hidden transition-all`}
                      >
                        <button
                          onClick={() => toggleExpand(item.code)}
                          className="flex w-full items-center gap-4 px-4 py-3 text-left hover:bg-white/30 dark:hover:bg-white/5 transition-colors"
                        >
                          <span
                            className={`${item.category.badgeBg} text-white font-mono font-bold text-sm px-2.5 py-1 rounded shrink-0`}
                          >
                            {item.code}
                          </span>
                          <div className="min-w-0 flex-1">
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {item.name}
                            </span>
                            <p className="mt-0.5 text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                              {item.description}
                            </p>
                          </div>
                          <svg
                            className={`h-4 w-4 shrink-0 text-gray-400 transition-transform ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>

                        {isExpanded && (
                          <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 px-4 py-4">
                            <div className="space-y-3">
                              <div>
                                <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                                  Description
                                </h4>
                                <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                                  {item.description}
                                </p>
                              </div>
                              <div>
                                <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                                  When to use
                                </h4>
                                <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                                  {item.details}
                                </p>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopy(item.code, item.name);
                                }}
                                className="rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
                              >
                                {isCopied
                                  ? "Copied!"
                                  : `Copy "${item.code} ${item.name}"`}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick Reference Table */}
      <details className="mt-10 rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <summary className="px-5 py-3 cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
          Quick reference — most common status codes
        </summary>
        <div className="px-5 pb-4 overflow-x-auto">
          <table className="w-full text-sm mt-2">
            <thead>
              <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                <th className="pb-2 pr-4 font-medium">Code</th>
                <th className="pb-2 pr-4 font-medium">Meaning</th>
                <th className="pb-2 font-medium">Common Use</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 dark:text-gray-300">
              {[
                ["200", "OK", "Successful request"],
                ["201", "Created", "Resource created (POST)"],
                ["204", "No Content", "Successful delete or update"],
                ["301", "Moved Permanently", "URL/domain migration"],
                ["302", "Found", "Temporary redirect"],
                ["304", "Not Modified", "Cache hit — use local copy"],
                ["400", "Bad Request", "Invalid request body/params"],
                ["401", "Unauthorized", "Missing/invalid auth"],
                ["403", "Forbidden", "Insufficient permissions"],
                ["404", "Not Found", "Resource doesn't exist"],
                ["409", "Conflict", "Version/state conflict"],
                ["422", "Unprocessable", "Validation error"],
                ["429", "Too Many Requests", "Rate limited"],
                ["500", "Internal Server Error", "Unhandled server bug"],
                ["502", "Bad Gateway", "Upstream server down"],
                ["503", "Service Unavailable", "Maintenance/overload"],
              ].map(([code, meaning, use]) => (
                <tr
                  key={code}
                  className="border-b border-gray-100 dark:border-gray-700/50"
                >
                  <td className="py-2 pr-4 font-mono font-bold">{code}</td>
                  <td className="py-2 pr-4">{meaning}</td>
                  <td className="py-2 text-gray-500 dark:text-gray-400">
                    {use}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>

      {/* REST API Cheat Sheet */}
      <details className="mt-4 rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <summary className="px-5 py-3 cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
          REST API cheat sheet — which codes to return
        </summary>
        <div className="px-5 pb-4 text-sm text-gray-600 dark:text-gray-400 space-y-3 mt-2">
          <div>
            <h3 className="text-gray-900 dark:text-gray-200 font-medium mb-1">
              GET /resources
            </h3>
            <p>
              <span className="text-green-600 dark:text-green-400 font-mono">
                200
              </span>{" "}
              with the list.{" "}
              <span className="text-yellow-600 dark:text-yellow-400 font-mono">
                304
              </span>{" "}
              if cached.
            </p>
          </div>
          <div>
            <h3 className="text-gray-900 dark:text-gray-200 font-medium mb-1">
              GET /resources/:id
            </h3>
            <p>
              <span className="text-green-600 dark:text-green-400 font-mono">
                200
              </span>{" "}
              with the resource.{" "}
              <span className="text-orange-600 dark:text-orange-400 font-mono">
                404
              </span>{" "}
              if not found.
            </p>
          </div>
          <div>
            <h3 className="text-gray-900 dark:text-gray-200 font-medium mb-1">
              POST /resources
            </h3>
            <p>
              <span className="text-green-600 dark:text-green-400 font-mono">
                201
              </span>{" "}
              + Location header.{" "}
              <span className="text-orange-600 dark:text-orange-400 font-mono">
                400
              </span>
              /
              <span className="text-orange-600 dark:text-orange-400 font-mono">
                422
              </span>{" "}
              for validation.{" "}
              <span className="text-orange-600 dark:text-orange-400 font-mono">
                409
              </span>{" "}
              for duplicates.
            </p>
          </div>
          <div>
            <h3 className="text-gray-900 dark:text-gray-200 font-medium mb-1">
              PUT/PATCH /resources/:id
            </h3>
            <p>
              <span className="text-green-600 dark:text-green-400 font-mono">
                200
              </span>{" "}
              with updated resource, or{" "}
              <span className="text-green-600 dark:text-green-400 font-mono">
                204
              </span>{" "}
              if no body.{" "}
              <span className="text-orange-600 dark:text-orange-400 font-mono">
                404
              </span>{" "}
              if not found.
            </p>
          </div>
          <div>
            <h3 className="text-gray-900 dark:text-gray-200 font-medium mb-1">
              DELETE /resources/:id
            </h3>
            <p>
              <span className="text-green-600 dark:text-green-400 font-mono">
                204
              </span>{" "}
              on success.{" "}
              <span className="text-orange-600 dark:text-orange-400 font-mono">
                404
              </span>{" "}
              if not found (or{" "}
              <span className="text-green-600 dark:text-green-400 font-mono">
                204
              </span>{" "}
              idempotently).
            </p>
          </div>
          <div>
            <h3 className="text-gray-900 dark:text-gray-200 font-medium mb-1">
              Any endpoint
            </h3>
            <p>
              <span className="text-orange-600 dark:text-orange-400 font-mono">
                401
              </span>{" "}
              if not authenticated.{" "}
              <span className="text-orange-600 dark:text-orange-400 font-mono">
                403
              </span>{" "}
              if not authorized.{" "}
              <span className="text-orange-600 dark:text-orange-400 font-mono">
                429
              </span>{" "}
              if rate limited.{" "}
              <span className="text-red-600 dark:text-red-400 font-mono">
                500
              </span>{" "}
              for unexpected errors.
            </p>
          </div>
        </div>
      </details>
    </div>
  );
}
