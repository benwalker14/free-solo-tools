"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";

// --- Types ---

interface LocationBlock {
  id: string;
  path: string;
  type: "static" | "proxy" | "tryFiles" | "redirect" | "deny" | "custom";
  proxyPass: string;
  tryFilesTarget: string;
  redirectUrl: string;
  redirectCode: "301" | "302";
  customDirectives: string;
  cacheExpires: string;
}

interface UpstreamServer {
  address: string;
  weight: string;
  backup: boolean;
}

interface NginxConfig {
  // Server basics
  listenPort: string;
  serverName: string;
  root: string;
  index: string;

  // SSL
  enableSsl: boolean;
  sslCertificate: string;
  sslCertificateKey: string;
  sslProtocols: string;
  enableHsts: boolean;
  httpRedirect: boolean;

  // Gzip
  enableGzip: boolean;
  gzipTypes: string;

  // Security headers
  enableSecurityHeaders: boolean;

  // Logging
  accessLog: string;
  errorLog: string;

  // Client
  clientMaxBodySize: string;

  // Proxy
  enableWebSocket: boolean;
  proxyConnectTimeout: string;
  proxyReadTimeout: string;

  // Rate limiting
  enableRateLimit: boolean;
  rateLimitZone: string;
  rateLimitRate: string;
  rateLimitBurst: string;

  // Upstream (load balancing)
  enableUpstream: boolean;
  upstreamName: string;
  upstreamMethod: "round-robin" | "least_conn" | "ip_hash";
  upstreamServers: UpstreamServer[];

  // Locations
  locations: LocationBlock[];
}

// --- Constants ---

const DEFAULT_GZIP_TYPES =
  "text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml";

const DEFAULT_SSL_PROTOCOLS = "TLSv1.2 TLSv1.3";

let nextId = 100;
function genId() {
  return String(nextId++);
}

function defaultLocation(): LocationBlock {
  return {
    id: genId(),
    path: "/",
    type: "static",
    proxyPass: "http://localhost:3000",
    tryFilesTarget: "=404",
    redirectUrl: "https://example.com",
    redirectCode: "301",
    customDirectives: "",
    cacheExpires: "",
  };
}

function defaultConfig(): NginxConfig {
  return {
    listenPort: "80",
    serverName: "example.com",
    root: "/var/www/html",
    index: "index.html index.htm",
    enableSsl: false,
    sslCertificate: "/etc/letsencrypt/live/example.com/fullchain.pem",
    sslCertificateKey: "/etc/letsencrypt/live/example.com/privkey.pem",
    sslProtocols: DEFAULT_SSL_PROTOCOLS,
    enableHsts: true,
    httpRedirect: true,
    enableGzip: true,
    gzipTypes: DEFAULT_GZIP_TYPES,
    enableSecurityHeaders: true,
    accessLog: "/var/log/nginx/access.log",
    errorLog: "/var/log/nginx/error.log",
    clientMaxBodySize: "10m",
    enableWebSocket: false,
    proxyConnectTimeout: "60s",
    proxyReadTimeout: "60s",
    enableRateLimit: false,
    rateLimitZone: "one",
    rateLimitRate: "10r/s",
    rateLimitBurst: "20",
    enableUpstream: false,
    upstreamName: "backend",
    upstreamMethod: "round-robin",
    upstreamServers: [
      { address: "127.0.0.1:3001", weight: "", backup: false },
      { address: "127.0.0.1:3002", weight: "", backup: false },
    ],
    locations: [defaultLocation()],
  };
}

type PresetKey =
  | "static"
  | "reverseProxy"
  | "spa"
  | "nodeApp"
  | "php"
  | "loadBalancer"
  | "httpsRedirect";

const PRESETS: Record<
  PresetKey,
  { label: string; description: string; config: Partial<NginxConfig> & { locations: LocationBlock[] } }
> = {
  static: {
    label: "Static Site",
    description: "Serve static HTML/CSS/JS files",
    config: {
      listenPort: "80",
      serverName: "example.com",
      root: "/var/www/html",
      index: "index.html index.htm",
      enableSsl: false,
      enableGzip: true,
      enableSecurityHeaders: true,
      enableUpstream: false,
      enableRateLimit: false,
      locations: [
        {
          id: genId(),
          path: "/",
          type: "tryFiles",
          proxyPass: "",
          tryFilesTarget: "=404",
          redirectUrl: "",
          redirectCode: "301",
          customDirectives: "",
          cacheExpires: "",
        },
        {
          id: genId(),
          path: "~* \\.(css|js|jpg|jpeg|png|gif|ico|svg|woff2?)$",
          type: "static",
          proxyPass: "",
          tryFilesTarget: "",
          redirectUrl: "",
          redirectCode: "301",
          customDirectives: "",
          cacheExpires: "30d",
        },
      ],
    },
  },
  reverseProxy: {
    label: "Reverse Proxy",
    description: "Proxy requests to a backend application",
    config: {
      listenPort: "80",
      serverName: "example.com",
      root: "/var/www/html",
      enableSsl: false,
      enableGzip: true,
      enableSecurityHeaders: true,
      enableUpstream: false,
      enableRateLimit: false,
      locations: [
        {
          id: genId(),
          path: "/",
          type: "proxy",
          proxyPass: "http://localhost:3000",
          tryFilesTarget: "",
          redirectUrl: "",
          redirectCode: "301",
          customDirectives: "",
          cacheExpires: "",
        },
      ],
    },
  },
  spa: {
    label: "SPA (React/Vue/Angular)",
    description: "Single-page app with client-side routing",
    config: {
      listenPort: "80",
      serverName: "example.com",
      root: "/var/www/app/dist",
      index: "index.html",
      enableSsl: false,
      enableGzip: true,
      enableSecurityHeaders: true,
      enableUpstream: false,
      enableRateLimit: false,
      locations: [
        {
          id: genId(),
          path: "/",
          type: "tryFiles",
          proxyPass: "",
          tryFilesTarget: "/index.html",
          redirectUrl: "",
          redirectCode: "301",
          customDirectives: "",
          cacheExpires: "",
        },
        {
          id: genId(),
          path: "/api/",
          type: "proxy",
          proxyPass: "http://localhost:3000",
          tryFilesTarget: "",
          redirectUrl: "",
          redirectCode: "301",
          customDirectives: "",
          cacheExpires: "",
        },
        {
          id: genId(),
          path: "~* \\.(css|js|jpg|jpeg|png|gif|ico|svg|woff2?)$",
          type: "static",
          proxyPass: "",
          tryFilesTarget: "",
          redirectUrl: "",
          redirectCode: "301",
          customDirectives: "",
          cacheExpires: "30d",
        },
      ],
    },
  },
  nodeApp: {
    label: "Node.js App",
    description: "Reverse proxy to Node.js with WebSocket support",
    config: {
      listenPort: "80",
      serverName: "example.com",
      root: "/var/www/app/public",
      enableSsl: false,
      enableGzip: true,
      enableSecurityHeaders: true,
      enableWebSocket: true,
      enableUpstream: false,
      enableRateLimit: false,
      locations: [
        {
          id: genId(),
          path: "/",
          type: "proxy",
          proxyPass: "http://localhost:3000",
          tryFilesTarget: "",
          redirectUrl: "",
          redirectCode: "301",
          customDirectives: "",
          cacheExpires: "",
        },
        {
          id: genId(),
          path: "~* \\.(css|js|jpg|jpeg|png|gif|ico|svg|woff2?)$",
          type: "static",
          proxyPass: "",
          tryFilesTarget: "",
          redirectUrl: "",
          redirectCode: "301",
          customDirectives: "",
          cacheExpires: "7d",
        },
      ],
    },
  },
  php: {
    label: "PHP / Laravel",
    description: "PHP-FPM with try_files for frameworks",
    config: {
      listenPort: "80",
      serverName: "example.com",
      root: "/var/www/app/public",
      index: "index.php index.html",
      enableSsl: false,
      enableGzip: true,
      enableSecurityHeaders: true,
      enableUpstream: false,
      enableRateLimit: false,
      locations: [
        {
          id: genId(),
          path: "/",
          type: "tryFiles",
          proxyPass: "",
          tryFilesTarget: "/index.php?$query_string",
          redirectUrl: "",
          redirectCode: "301",
          customDirectives: "",
          cacheExpires: "",
        },
        {
          id: genId(),
          path: "~ \\.php$",
          type: "custom",
          proxyPass: "",
          tryFilesTarget: "",
          redirectUrl: "",
          redirectCode: "301",
          customDirectives:
            "fastcgi_pass unix:/run/php/php-fpm.sock;\nfastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;\ninclude fastcgi_params;",
          cacheExpires: "",
        },
        {
          id: genId(),
          path: "~ /\\.(?!well-known).*",
          type: "deny",
          proxyPass: "",
          tryFilesTarget: "",
          redirectUrl: "",
          redirectCode: "301",
          customDirectives: "",
          cacheExpires: "",
        },
      ],
    },
  },
  loadBalancer: {
    label: "Load Balancer",
    description: "Distribute traffic across multiple backends",
    config: {
      listenPort: "80",
      serverName: "example.com",
      root: "/var/www/html",
      enableSsl: false,
      enableGzip: true,
      enableSecurityHeaders: true,
      enableUpstream: true,
      upstreamName: "backend",
      upstreamMethod: "round-robin",
      upstreamServers: [
        { address: "10.0.0.1:3000", weight: "", backup: false },
        { address: "10.0.0.2:3000", weight: "", backup: false },
        { address: "10.0.0.3:3000", weight: "", backup: true },
      ],
      enableRateLimit: false,
      locations: [
        {
          id: genId(),
          path: "/",
          type: "proxy",
          proxyPass: "http://backend",
          tryFilesTarget: "",
          redirectUrl: "",
          redirectCode: "301",
          customDirectives: "",
          cacheExpires: "",
        },
      ],
    },
  },
  httpsRedirect: {
    label: "HTTPS + SSL",
    description: "SSL termination with HTTP → HTTPS redirect",
    config: {
      listenPort: "443",
      serverName: "example.com",
      root: "/var/www/html",
      index: "index.html index.htm",
      enableSsl: true,
      httpRedirect: true,
      enableHsts: true,
      sslCertificate: "/etc/letsencrypt/live/example.com/fullchain.pem",
      sslCertificateKey: "/etc/letsencrypt/live/example.com/privkey.pem",
      sslProtocols: DEFAULT_SSL_PROTOCOLS,
      enableGzip: true,
      enableSecurityHeaders: true,
      enableUpstream: false,
      enableRateLimit: false,
      locations: [
        {
          id: genId(),
          path: "/",
          type: "tryFiles",
          proxyPass: "",
          tryFilesTarget: "=404",
          redirectUrl: "",
          redirectCode: "301",
          customDirectives: "",
          cacheExpires: "",
        },
      ],
    },
  },
};

// --- Generator ---

function generateConfig(config: NginxConfig): string {
  const lines: string[] = [];
  const indent = "    ";

  lines.push("# nginx.conf");
  lines.push("# Generated by DevBolt Nginx Config Generator");
  lines.push("# https://devbolt.dev/tools/nginx-config");
  lines.push("");

  // Rate limiting zone (must be in http context, outside server)
  if (config.enableRateLimit) {
    lines.push("# Rate limiting");
    lines.push(
      `limit_req_zone $binary_remote_addr zone=${config.rateLimitZone}:10m rate=${config.rateLimitRate};`
    );
    lines.push("");
  }

  // Upstream block
  if (config.enableUpstream) {
    lines.push(`upstream ${config.upstreamName} {`);
    if (config.upstreamMethod === "least_conn") {
      lines.push(`${indent}least_conn;`);
    } else if (config.upstreamMethod === "ip_hash") {
      lines.push(`${indent}ip_hash;`);
    }
    for (const srv of config.upstreamServers) {
      if (!srv.address.trim()) continue;
      let line = `${indent}server ${srv.address.trim()}`;
      if (srv.weight.trim()) line += ` weight=${srv.weight.trim()}`;
      if (srv.backup) line += " backup";
      line += ";";
      lines.push(line);
    }
    lines.push("}");
    lines.push("");
  }

  // HTTP → HTTPS redirect server block
  if (config.enableSsl && config.httpRedirect) {
    lines.push("# HTTP → HTTPS redirect");
    lines.push("server {");
    lines.push(`${indent}listen 80;`);
    lines.push(`${indent}listen [::]:80;`);
    lines.push(`${indent}server_name ${config.serverName};`);
    lines.push("");
    lines.push(`${indent}return 301 https://$host$request_uri;`);
    lines.push("}");
    lines.push("");
  }

  // Main server block
  lines.push("server {");

  // Listen
  if (config.enableSsl) {
    lines.push(`${indent}listen ${config.listenPort} ssl http2;`);
    lines.push(`${indent}listen [::]:${config.listenPort} ssl http2;`);
  } else {
    lines.push(`${indent}listen ${config.listenPort};`);
    lines.push(`${indent}listen [::]:${config.listenPort};`);
  }

  lines.push(`${indent}server_name ${config.serverName};`);
  lines.push("");

  // Root & index
  lines.push(`${indent}root ${config.root};`);
  if (config.index.trim()) {
    lines.push(`${indent}index ${config.index};`);
  }
  lines.push("");

  // SSL
  if (config.enableSsl) {
    lines.push(`${indent}# SSL configuration`);
    lines.push(`${indent}ssl_certificate ${config.sslCertificate};`);
    lines.push(`${indent}ssl_certificate_key ${config.sslCertificateKey};`);
    lines.push(`${indent}ssl_protocols ${config.sslProtocols};`);
    lines.push(
      `${indent}ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;`
    );
    lines.push(`${indent}ssl_prefer_server_ciphers off;`);
    lines.push(`${indent}ssl_session_cache shared:SSL:10m;`);
    lines.push(`${indent}ssl_session_timeout 10m;`);
    if (config.enableHsts) {
      lines.push(
        `${indent}add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;`
      );
    }
    lines.push("");
  }

  // Security headers
  if (config.enableSecurityHeaders) {
    lines.push(`${indent}# Security headers`);
    lines.push(`${indent}add_header X-Frame-Options "SAMEORIGIN" always;`);
    lines.push(`${indent}add_header X-Content-Type-Options "nosniff" always;`);
    lines.push(`${indent}add_header X-XSS-Protection "1; mode=block" always;`);
    lines.push(
      `${indent}add_header Referrer-Policy "strict-origin-when-cross-origin" always;`
    );
    lines.push("");
  }

  // Gzip
  if (config.enableGzip) {
    lines.push(`${indent}# Gzip compression`);
    lines.push(`${indent}gzip on;`);
    lines.push(`${indent}gzip_vary on;`);
    lines.push(`${indent}gzip_proxied any;`);
    lines.push(`${indent}gzip_comp_level 6;`);
    lines.push(`${indent}gzip_min_length 256;`);
    lines.push(`${indent}gzip_types ${config.gzipTypes};`);
    lines.push("");
  }

  // Client max body size
  if (config.clientMaxBodySize.trim()) {
    lines.push(`${indent}client_max_body_size ${config.clientMaxBodySize};`);
    lines.push("");
  }

  // Logging
  if (config.accessLog.trim()) {
    lines.push(`${indent}access_log ${config.accessLog};`);
  }
  if (config.errorLog.trim()) {
    lines.push(`${indent}error_log ${config.errorLog};`);
  }
  if (config.accessLog.trim() || config.errorLog.trim()) {
    lines.push("");
  }

  // Location blocks
  for (const loc of config.locations) {
    if (!loc.path.trim()) continue;

    lines.push(`${indent}location ${loc.path} {`);
    const inner = indent + indent;

    // Rate limiting
    if (config.enableRateLimit) {
      lines.push(
        `${inner}limit_req zone=${config.rateLimitZone} burst=${config.rateLimitBurst} nodelay;`
      );
    }

    switch (loc.type) {
      case "static":
        lines.push(`${inner}try_files $uri $uri/ =404;`);
        if (loc.cacheExpires.trim()) {
          lines.push(`${inner}expires ${loc.cacheExpires};`);
          lines.push(`${inner}add_header Cache-Control "public, immutable";`);
        }
        break;

      case "proxy":
        lines.push(`${inner}proxy_pass ${loc.proxyPass};`);
        lines.push(`${inner}proxy_http_version 1.1;`);
        lines.push(`${inner}proxy_set_header Host $host;`);
        lines.push(`${inner}proxy_set_header X-Real-IP $remote_addr;`);
        lines.push(
          `${inner}proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;`
        );
        lines.push(
          `${inner}proxy_set_header X-Forwarded-Proto $scheme;`
        );
        if (config.enableWebSocket) {
          lines.push(`${inner}proxy_set_header Upgrade $http_upgrade;`);
          lines.push(
            `${inner}proxy_set_header Connection "upgrade";`
          );
        }
        if (config.proxyConnectTimeout.trim()) {
          lines.push(
            `${inner}proxy_connect_timeout ${config.proxyConnectTimeout};`
          );
        }
        if (config.proxyReadTimeout.trim()) {
          lines.push(
            `${inner}proxy_read_timeout ${config.proxyReadTimeout};`
          );
        }
        break;

      case "tryFiles":
        lines.push(
          `${inner}try_files $uri $uri/ ${loc.tryFilesTarget};`
        );
        if (loc.cacheExpires.trim()) {
          lines.push(`${inner}expires ${loc.cacheExpires};`);
        }
        break;

      case "redirect":
        lines.push(
          `${inner}return ${loc.redirectCode} ${loc.redirectUrl};`
        );
        break;

      case "deny":
        lines.push(`${inner}deny all;`);
        break;

      case "custom":
        for (const line of loc.customDirectives.split("\n")) {
          if (line.trim()) {
            lines.push(`${inner}${line.trim()}`);
          }
        }
        break;
    }

    lines.push(`${indent}}`);
    lines.push("");
  }

  lines.push("}");

  return lines.join("\n");
}

// --- Shared styles ---

const labelClass =
  "block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1";
const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white";
const selectClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white";
const checkboxLabel =
  "flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer";
const sectionTitle =
  "text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3";
const cardClass =
  "rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900/50";

// --- Component ---

export default function NginxConfigTool() {
  const [config, setConfig] = useState<NginxConfig>(defaultConfig());
  const [activeLocationId, setActiveLocationId] = useState<string>(
    config.locations[0].id
  );
  const [copied, setCopied] = useState(false);
  const { trackFirstInteraction } = useToolAnalytics("nginx-config");

  // --- Helpers ---

  const update = useCallback(
    (patch: Partial<NginxConfig>) => {
      trackFirstInteraction();
      setConfig((prev) => ({ ...prev, ...patch }));
    },
    [trackFirstInteraction]
  );

  const updateLocation = useCallback(
    (id: string, patch: Partial<LocationBlock>) => {
      trackFirstInteraction();
      setConfig((prev) => ({
        ...prev,
        locations: prev.locations.map((l) =>
          l.id === id ? { ...l, ...patch } : l
        ),
      }));
    },
    [trackFirstInteraction]
  );

  const addLocation = useCallback(() => {
    trackFirstInteraction();
    const loc = defaultLocation();
    loc.path = "/new-path";
    setConfig((prev) => ({ ...prev, locations: [...prev.locations, loc] }));
    setActiveLocationId(loc.id);
  }, [trackFirstInteraction]);

  const removeLocation = useCallback(
    (id: string) => {
      setConfig((prev) => {
        const next = prev.locations.filter((l) => l.id !== id);
        if (next.length === 0) {
          const loc = defaultLocation();
          setActiveLocationId(loc.id);
          return { ...prev, locations: [loc] };
        }
        if (activeLocationId === id) {
          setActiveLocationId(next[0].id);
        }
        return { ...prev, locations: next };
      });
    },
    [activeLocationId]
  );

  const applyPreset = useCallback(
    (key: PresetKey) => {
      trackFirstInteraction();
      const preset = PRESETS[key];
      if (!preset) return;
      const base = defaultConfig();
      const locs = preset.config.locations.map((l) => ({
        ...l,
        id: genId(),
      }));
      const merged: NginxConfig = {
        ...base,
        ...preset.config,
        locations: locs,
        upstreamServers: preset.config.upstreamServers
          ? [...preset.config.upstreamServers]
          : base.upstreamServers,
      };
      setConfig(merged);
      setActiveLocationId(locs[0].id);
    },
    [trackFirstInteraction]
  );

  const updateUpstreamServer = useCallback(
    (index: number, patch: Partial<UpstreamServer>) => {
      trackFirstInteraction();
      setConfig((prev) => ({
        ...prev,
        upstreamServers: prev.upstreamServers.map((s, i) =>
          i === index ? { ...s, ...patch } : s
        ),
      }));
    },
    [trackFirstInteraction]
  );

  const addUpstreamServer = useCallback(() => {
    trackFirstInteraction();
    setConfig((prev) => ({
      ...prev,
      upstreamServers: [
        ...prev.upstreamServers,
        { address: "127.0.0.1:300" + (prev.upstreamServers.length + 1), weight: "", backup: false },
      ],
    }));
  }, [trackFirstInteraction]);

  const removeUpstreamServer = useCallback((index: number) => {
    setConfig((prev) => ({
      ...prev,
      upstreamServers: prev.upstreamServers.filter((_, i) => i !== index),
    }));
  }, []);

  // --- Output ---

  const output = useMemo(() => generateConfig(config), [config]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [output]);

  const handleDownload = useCallback(() => {
    trackFirstInteraction();
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "nginx.conf";
    a.click();
    URL.revokeObjectURL(url);
  }, [output, trackFirstInteraction]);

  const activeLocation =
    config.locations.find((l) => l.id === activeLocationId) ||
    config.locations[0];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="mb-8 block text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        &larr; Back to tools
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Nginx Config Generator
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Generate nginx configuration files with a visual builder. Choose a
        preset, configure server settings, SSL, gzip, security headers, and
        location blocks — then copy or download the config.
      </p>

      {/* Presets */}
      <div className="mb-6">
        <h2 className={sectionTitle}>Presets</h2>
        <div className="flex flex-wrap gap-2">
          {(Object.entries(PRESETS) as [PresetKey, (typeof PRESETS)[PresetKey]][]).map(
            ([key, preset]) => (
              <button
                key={key}
                onClick={() => applyPreset(key)}
                className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                title={preset.description}
              >
                {preset.label}
              </button>
            )
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left: Configuration */}
        <div className="space-y-4">
          {/* Server Basics */}
          <div className={cardClass}>
            <h2 className={sectionTitle}>Server Basics</h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Listen Port</label>
                <input
                  type="text"
                  value={config.listenPort}
                  onChange={(e) => update({ listenPort: e.target.value })}
                  className={inputClass}
                  placeholder="80"
                />
              </div>
              <div>
                <label className={labelClass}>Server Name</label>
                <input
                  type="text"
                  value={config.serverName}
                  onChange={(e) => update({ serverName: e.target.value })}
                  className={inputClass}
                  placeholder="example.com"
                />
              </div>
              <div>
                <label className={labelClass}>Root</label>
                <input
                  type="text"
                  value={config.root}
                  onChange={(e) => update({ root: e.target.value })}
                  className={inputClass}
                  placeholder="/var/www/html"
                />
              </div>
              <div>
                <label className={labelClass}>Index</label>
                <input
                  type="text"
                  value={config.index}
                  onChange={(e) => update({ index: e.target.value })}
                  className={inputClass}
                  placeholder="index.html index.htm"
                />
              </div>
            </div>
          </div>

          {/* SSL */}
          <div className={cardClass}>
            <h2 className={sectionTitle}>SSL / TLS</h2>
            <label className={checkboxLabel}>
              <input
                type="checkbox"
                checked={config.enableSsl}
                onChange={(e) => update({ enableSsl: e.target.checked })}
                className="rounded border-gray-300 text-indigo-600 dark:border-gray-600 dark:bg-gray-800"
              />
              Enable SSL
            </label>
            {config.enableSsl && (
              <div className="mt-3 space-y-3">
                <div>
                  <label className={labelClass}>Certificate Path</label>
                  <input
                    type="text"
                    value={config.sslCertificate}
                    onChange={(e) =>
                      update({ sslCertificate: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Certificate Key Path</label>
                  <input
                    type="text"
                    value={config.sslCertificateKey}
                    onChange={(e) =>
                      update({ sslCertificateKey: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>SSL Protocols</label>
                  <input
                    type="text"
                    value={config.sslProtocols}
                    onChange={(e) =>
                      update({ sslProtocols: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>
                <div className="flex gap-4">
                  <label className={checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={config.enableHsts}
                      onChange={(e) =>
                        update({ enableHsts: e.target.checked })
                      }
                      className="rounded border-gray-300 text-indigo-600 dark:border-gray-600 dark:bg-gray-800"
                    />
                    HSTS
                  </label>
                  <label className={checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={config.httpRedirect}
                      onChange={(e) =>
                        update({ httpRedirect: e.target.checked })
                      }
                      className="rounded border-gray-300 text-indigo-600 dark:border-gray-600 dark:bg-gray-800"
                    />
                    HTTP → HTTPS Redirect
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Performance */}
          <div className={cardClass}>
            <h2 className={sectionTitle}>Performance</h2>
            <div className="space-y-3">
              <label className={checkboxLabel}>
                <input
                  type="checkbox"
                  checked={config.enableGzip}
                  onChange={(e) =>
                    update({ enableGzip: e.target.checked })
                  }
                  className="rounded border-gray-300 text-indigo-600 dark:border-gray-600 dark:bg-gray-800"
                />
                Enable Gzip Compression
              </label>
              <div>
                <label className={labelClass}>Client Max Body Size</label>
                <input
                  type="text"
                  value={config.clientMaxBodySize}
                  onChange={(e) =>
                    update({ clientMaxBodySize: e.target.value })
                  }
                  className={inputClass}
                  placeholder="10m"
                />
              </div>
            </div>
          </div>

          {/* Security */}
          <div className={cardClass}>
            <h2 className={sectionTitle}>Security</h2>
            <label className={checkboxLabel}>
              <input
                type="checkbox"
                checked={config.enableSecurityHeaders}
                onChange={(e) =>
                  update({ enableSecurityHeaders: e.target.checked })
                }
                className="rounded border-gray-300 text-indigo-600 dark:border-gray-600 dark:bg-gray-800"
              />
              Security Headers (X-Frame-Options, X-Content-Type-Options, X-XSS-Protection, Referrer-Policy)
            </label>
          </div>

          {/* Proxy Settings */}
          <div className={cardClass}>
            <h2 className={sectionTitle}>Proxy Settings</h2>
            <div className="space-y-3">
              <label className={checkboxLabel}>
                <input
                  type="checkbox"
                  checked={config.enableWebSocket}
                  onChange={(e) =>
                    update({ enableWebSocket: e.target.checked })
                  }
                  className="rounded border-gray-300 text-indigo-600 dark:border-gray-600 dark:bg-gray-800"
                />
                WebSocket Support
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Connect Timeout</label>
                  <input
                    type="text"
                    value={config.proxyConnectTimeout}
                    onChange={(e) =>
                      update({ proxyConnectTimeout: e.target.value })
                    }
                    className={inputClass}
                    placeholder="60s"
                  />
                </div>
                <div>
                  <label className={labelClass}>Read Timeout</label>
                  <input
                    type="text"
                    value={config.proxyReadTimeout}
                    onChange={(e) =>
                      update({ proxyReadTimeout: e.target.value })
                    }
                    className={inputClass}
                    placeholder="60s"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Rate Limiting */}
          <div className={cardClass}>
            <h2 className={sectionTitle}>Rate Limiting</h2>
            <label className={checkboxLabel}>
              <input
                type="checkbox"
                checked={config.enableRateLimit}
                onChange={(e) =>
                  update({ enableRateLimit: e.target.checked })
                }
                className="rounded border-gray-300 text-indigo-600 dark:border-gray-600 dark:bg-gray-800"
              />
              Enable Rate Limiting
            </label>
            {config.enableRateLimit && (
              <div className="mt-3 grid grid-cols-3 gap-3">
                <div>
                  <label className={labelClass}>Zone Name</label>
                  <input
                    type="text"
                    value={config.rateLimitZone}
                    onChange={(e) =>
                      update({ rateLimitZone: e.target.value })
                    }
                    className={inputClass}
                    placeholder="one"
                  />
                </div>
                <div>
                  <label className={labelClass}>Rate</label>
                  <input
                    type="text"
                    value={config.rateLimitRate}
                    onChange={(e) =>
                      update({ rateLimitRate: e.target.value })
                    }
                    className={inputClass}
                    placeholder="10r/s"
                  />
                </div>
                <div>
                  <label className={labelClass}>Burst</label>
                  <input
                    type="text"
                    value={config.rateLimitBurst}
                    onChange={(e) =>
                      update({ rateLimitBurst: e.target.value })
                    }
                    className={inputClass}
                    placeholder="20"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Load Balancing / Upstream */}
          <div className={cardClass}>
            <h2 className={sectionTitle}>Load Balancing (Upstream)</h2>
            <label className={checkboxLabel}>
              <input
                type="checkbox"
                checked={config.enableUpstream}
                onChange={(e) =>
                  update({ enableUpstream: e.target.checked })
                }
                className="rounded border-gray-300 text-indigo-600 dark:border-gray-600 dark:bg-gray-800"
              />
              Enable Upstream Block
            </label>
            {config.enableUpstream && (
              <div className="mt-3 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Upstream Name</label>
                    <input
                      type="text"
                      value={config.upstreamName}
                      onChange={(e) =>
                        update({ upstreamName: e.target.value })
                      }
                      className={inputClass}
                      placeholder="backend"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Method</label>
                    <select
                      value={config.upstreamMethod}
                      onChange={(e) =>
                        update({
                          upstreamMethod: e.target.value as NginxConfig["upstreamMethod"],
                        })
                      }
                      className={selectClass}
                    >
                      <option value="round-robin">Round Robin</option>
                      <option value="least_conn">Least Connections</option>
                      <option value="ip_hash">IP Hash</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>Servers</label>
                  {config.upstreamServers.map((srv, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={srv.address}
                        onChange={(e) =>
                          updateUpstreamServer(i, { address: e.target.value })
                        }
                        className={inputClass}
                        placeholder="127.0.0.1:3000"
                      />
                      <input
                        type="text"
                        value={srv.weight}
                        onChange={(e) =>
                          updateUpstreamServer(i, { weight: e.target.value })
                        }
                        className={`${inputClass} w-20`}
                        placeholder="wt"
                        title="Weight"
                      />
                      <label className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={srv.backup}
                          onChange={(e) =>
                            updateUpstreamServer(i, {
                              backup: e.target.checked,
                            })
                          }
                          className="rounded border-gray-300 text-indigo-600 dark:border-gray-600 dark:bg-gray-800"
                        />
                        Backup
                      </label>
                      {config.upstreamServers.length > 1 && (
                        <button
                          onClick={() => removeUpstreamServer(i)}
                          className="text-red-500 hover:text-red-700 text-lg leading-none"
                          title="Remove server"
                        >
                          &times;
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={addUpstreamServer}
                    className="text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    + Add Server
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Logging */}
          <div className={cardClass}>
            <h2 className={sectionTitle}>Logging</h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Access Log</label>
                <input
                  type="text"
                  value={config.accessLog}
                  onChange={(e) =>
                    update({ accessLog: e.target.value })
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Error Log</label>
                <input
                  type="text"
                  value={config.errorLog}
                  onChange={(e) =>
                    update({ errorLog: e.target.value })
                  }
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Location Blocks */}
          <div className={cardClass}>
            <h2 className={sectionTitle}>Location Blocks</h2>

            {/* Location tabs */}
            <div className="flex flex-wrap gap-1 mb-3">
              {config.locations.map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => setActiveLocationId(loc.id)}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                    activeLocationId === loc.id
                      ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                  }`}
                >
                  {loc.path || "(empty)"}
                </button>
              ))}
              <button
                onClick={addLocation}
                className="rounded-md px-2.5 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/20"
              >
                + Add
              </button>
            </div>

            {/* Active location editor */}
            {activeLocation && (
              <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/50">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Path</label>
                    <input
                      type="text"
                      value={activeLocation.path}
                      onChange={(e) =>
                        updateLocation(activeLocation.id, {
                          path: e.target.value,
                        })
                      }
                      className={inputClass}
                      placeholder="/"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Type</label>
                    <select
                      value={activeLocation.type}
                      onChange={(e) =>
                        updateLocation(activeLocation.id, {
                          type: e.target.value as LocationBlock["type"],
                        })
                      }
                      className={selectClass}
                    >
                      <option value="static">Static Files</option>
                      <option value="proxy">Reverse Proxy</option>
                      <option value="tryFiles">try_files</option>
                      <option value="redirect">Redirect</option>
                      <option value="deny">Deny All</option>
                      <option value="custom">Custom Directives</option>
                    </select>
                  </div>
                </div>

                {activeLocation.type === "proxy" && (
                  <div>
                    <label className={labelClass}>Proxy Pass</label>
                    <input
                      type="text"
                      value={activeLocation.proxyPass}
                      onChange={(e) =>
                        updateLocation(activeLocation.id, {
                          proxyPass: e.target.value,
                        })
                      }
                      className={inputClass}
                      placeholder="http://localhost:3000"
                    />
                  </div>
                )}

                {activeLocation.type === "tryFiles" && (
                  <div>
                    <label className={labelClass}>Fallback (try_files target)</label>
                    <input
                      type="text"
                      value={activeLocation.tryFilesTarget}
                      onChange={(e) =>
                        updateLocation(activeLocation.id, {
                          tryFilesTarget: e.target.value,
                        })
                      }
                      className={inputClass}
                      placeholder="=404 or /index.html"
                    />
                  </div>
                )}

                {activeLocation.type === "redirect" && (
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                      <label className={labelClass}>Redirect URL</label>
                      <input
                        type="text"
                        value={activeLocation.redirectUrl}
                        onChange={(e) =>
                          updateLocation(activeLocation.id, {
                            redirectUrl: e.target.value,
                          })
                        }
                        className={inputClass}
                        placeholder="https://example.com"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Code</label>
                      <select
                        value={activeLocation.redirectCode}
                        onChange={(e) =>
                          updateLocation(activeLocation.id, {
                            redirectCode: e.target.value as "301" | "302",
                          })
                        }
                        className={selectClass}
                      >
                        <option value="301">301 (Permanent)</option>
                        <option value="302">302 (Temporary)</option>
                      </select>
                    </div>
                  </div>
                )}

                {activeLocation.type === "custom" && (
                  <div>
                    <label className={labelClass}>Custom Directives</label>
                    <textarea
                      value={activeLocation.customDirectives}
                      onChange={(e) =>
                        updateLocation(activeLocation.id, {
                          customDirectives: e.target.value,
                        })
                      }
                      className={`${inputClass} font-mono text-xs`}
                      rows={4}
                      placeholder="fastcgi_pass unix:/run/php/php-fpm.sock;"
                    />
                  </div>
                )}

                {(activeLocation.type === "static" ||
                  activeLocation.type === "tryFiles") && (
                  <div>
                    <label className={labelClass}>
                      Cache Expires (optional)
                    </label>
                    <input
                      type="text"
                      value={activeLocation.cacheExpires}
                      onChange={(e) =>
                        updateLocation(activeLocation.id, {
                          cacheExpires: e.target.value,
                        })
                      }
                      className={inputClass}
                      placeholder="30d, 1h, etc."
                    />
                  </div>
                )}

                {config.locations.length > 1 && (
                  <button
                    onClick={() => removeLocation(activeLocation.id)}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    Remove this location
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: Output */}
        <div className="lg:sticky lg:top-8 lg:self-start">
          <div className={cardClass}>
            <div className="mb-3 flex items-center justify-between">
              <h2 className={sectionTitle + " mb-0"}>Generated Config</h2>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-indigo-700"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
                <button
                  onClick={handleDownload}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Download
                </button>
              </div>
            </div>
            <pre className="max-h-[75vh] overflow-auto rounded-lg bg-gray-950 p-4 text-xs leading-relaxed text-green-400 font-mono">
              {output}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
