/// <reference lib="webworker" />

const CACHE_NAME = "devbolt-v1";

// App shell — core routes cached on install
const APP_SHELL = ["/", "/about", "/pricing"];

// Tool routes to cache on first visit
const TOOL_ROUTES = [
  "/tools/json-formatter",
  "/tools/base64",
  "/tools/hash-generator",
  "/tools/uuid-generator",
  "/tools/color-converter",
  "/tools/jwt-decoder",
  "/tools/regex-tester",
  "/tools/url-parser",
  "/tools/markdown-preview",
  "/tools/diff-checker",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)),
  );
  // Activate immediately
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  // Clean up old caches
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key)),
      ),
    ),
  );
  // Take control of all open tabs
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin GET requests
  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  // Skip API routes and Vercel analytics
  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/_")) return;

  // Network-first for navigation requests (HTML pages)
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache tool pages and app shell pages on successful fetch
          const pathname = url.pathname;
          if (
            TOOL_ROUTES.includes(pathname) ||
            APP_SHELL.includes(pathname)
          ) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() =>
          // Offline — serve from cache
          caches.match(request).then((cached) => cached || caches.match("/")),
        ),
    );
    return;
  }

  // Cache-first for static assets (JS, CSS, fonts, images)
  if (
    url.pathname.match(
      /\.(js|css|woff2?|ttf|otf|png|jpg|jpeg|svg|ico|webp)$/,
    ) ||
    url.pathname.startsWith("/_next/static/")
  ) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
            return response;
          }),
      ),
    );
    return;
  }

  // Network-first for everything else
  event.respondWith(
    fetch(request)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        return response;
      })
      .catch(() => caches.match(request)),
  );
});
