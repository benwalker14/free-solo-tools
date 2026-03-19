export interface DetectionResult {
  format: string;
  confidence: number;
  toolHref: string;
  toolTitle: string;
  icon: string;
}

// Detect the most likely format of pasted text and suggest the best tool
export function detectFormat(text: string): DetectionResult | null {
  if (!text || text.length < 2) return null;

  const trimmed = text.trim();
  const results: DetectionResult[] = [];

  // JWT — very specific pattern, high confidence
  if (/^eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(trimmed)) {
    results.push({
      format: "JWT",
      confidence: 0.98,
      toolHref: "/tools/jwt-decoder",
      toolTitle: "JWT Decoder",
      icon: "JWT",
    });
  }

  // cURL command
  if (/^curl\s/i.test(trimmed)) {
    results.push({
      format: "cURL",
      confidence: 0.95,
      toolHref: "/tools/curl-converter",
      toolTitle: "cURL to Code",
      icon: "cURL",
    });
  }

  // Git diff / unified diff
  if (
    /^diff --git\s/.test(trimmed) ||
    /^--- a\//.test(trimmed) ||
    /^@@\s[+-]\d/.test(trimmed)
  ) {
    results.push({
      format: "Diff",
      confidence: 0.95,
      toolHref: "/tools/git-diff-viewer",
      toolTitle: "Git Diff Viewer",
      icon: "DIFF",
    });
  }

  // Dockerfile
  if (/^FROM\s+\S+/m.test(trimmed) && /^(RUN|CMD|COPY|ADD|EXPOSE|WORKDIR|ENV|ENTRYPOINT)\s/m.test(trimmed)) {
    results.push({
      format: "Dockerfile",
      confidence: 0.92,
      toolHref: "/tools/dockerfile-validator",
      toolTitle: "Dockerfile Validator",
      icon: "🐳",
    });
  }

  // JSON — try to parse
  if (
    (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
    (trimmed.startsWith("[") && trimmed.endsWith("]"))
  ) {
    try {
      JSON.parse(trimmed);
      results.push({
        format: "JSON",
        confidence: 0.95,
        toolHref: "/tools/json-formatter",
        toolTitle: "JSON Formatter",
        icon: "{ }",
      });
    } catch {
      // Not valid JSON, might still be JSON-like
    }
  }

  // SQL
  if (
    /^(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|WITH)\s/im.test(trimmed) &&
    /\b(FROM|INTO|TABLE|SET|WHERE|VALUES)\b/i.test(trimmed)
  ) {
    results.push({
      format: "SQL",
      confidence: 0.9,
      toolHref: "/tools/sql-formatter",
      toolTitle: "SQL Formatter",
      icon: "SQL",
    });
  }

  // XML (not HTML)
  if (/^<\?xml\s/i.test(trimmed) || (/^<[a-zA-Z][\w:-]*[\s>]/.test(trimmed) && !/<(!DOCTYPE\s+)?html[\s>]/i.test(trimmed) && /<\/[a-zA-Z][\w:-]*>\s*$/.test(trimmed))) {
    results.push({
      format: "XML",
      confidence: 0.88,
      toolHref: "/tools/xml-formatter",
      toolTitle: "XML Formatter",
      icon: "XML",
    });
  }

  // HTML
  if (/<(!DOCTYPE\s+)?html[\s>]/i.test(trimmed) || (/<(div|span|p|h[1-6]|a|img|table|form|section|header|footer|main|nav|ul|ol|li)\b/i.test(trimmed) && /<\/\w+>\s*$/i.test(trimmed))) {
    results.push({
      format: "HTML",
      confidence: 0.85,
      toolHref: "/tools/html-to-jsx",
      toolTitle: "HTML to JSX",
      icon: "JSX",
    });
  }

  // SVG
  if (/<svg[\s>]/i.test(trimmed) && /<\/svg>\s*$/i.test(trimmed)) {
    results.push({
      format: "SVG",
      confidence: 0.95,
      toolHref: "/tools/svg-optimizer",
      toolTitle: "SVG Optimizer",
      icon: "SVG",
    });
  }

  // .env file
  if (/^[A-Z_][A-Z0-9_]*=.*/m.test(trimmed) && (trimmed.match(/^[A-Z_][A-Z0-9_]*=/gm)?.length ?? 0) >= 2) {
    results.push({
      format: ".env",
      confidence: 0.82,
      toolHref: "/tools/env-validator",
      toolTitle: ".env Validator",
      icon: "ENV",
    });
  }

  // YAML (not TOML, not .env)
  if (
    !trimmed.startsWith("{") &&
    !trimmed.startsWith("[") &&
    /^[\w-]+:\s+\S/m.test(trimmed) &&
    (trimmed.match(/^[\w-]+:\s/gm)?.length ?? 0) >= 2 &&
    !/^[A-Z_][A-Z0-9_]*=/m.test(trimmed)
  ) {
    // Check for Docker Compose specifically
    if (/^services:\s*$/m.test(trimmed) || /^version:\s*['"]?\d/m.test(trimmed)) {
      results.push({
        format: "Docker Compose",
        confidence: 0.9,
        toolHref: "/tools/docker-compose",
        toolTitle: "Docker Compose Validator",
        icon: "🐳",
      });
    } else {
      results.push({
        format: "YAML",
        confidence: 0.75,
        toolHref: "/tools/yaml-formatter",
        toolTitle: "YAML Formatter",
        icon: "YML",
      });
    }
  }

  // TOML
  if (/^\[[\w.-]+\]\s*$/m.test(trimmed) && /^[\w.-]+\s*=\s*/m.test(trimmed)) {
    results.push({
      format: "TOML",
      confidence: 0.8,
      toolHref: "/tools/toml-converter",
      toolTitle: "TOML Converter",
      icon: "TML",
    });
  }

  // CSV (at least 2 rows with consistent comma-separated columns)
  if (!trimmed.startsWith("{") && !trimmed.startsWith("<")) {
    const lines = trimmed.split("\n").filter((l) => l.trim());
    if (lines.length >= 2) {
      const counts = lines.slice(0, 5).map((l) => (l.match(/,/g) || []).length);
      if (counts[0] >= 2 && counts.every((c) => c === counts[0])) {
        results.push({
          format: "CSV",
          confidence: 0.8,
          toolHref: "/tools/csv-json",
          toolTitle: "CSV to JSON",
          icon: "CSV",
        });
      }
    }
  }

  // URL
  if (/^https?:\/\/\S+$/i.test(trimmed) && trimmed.length < 2000) {
    results.push({
      format: "URL",
      confidence: 0.9,
      toolHref: "/tools/url-parser",
      toolTitle: "URL Parser",
      icon: "URL",
    });
  }

  // UUID
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(trimmed)) {
    results.push({
      format: "UUID",
      confidence: 0.95,
      toolHref: "/tools/uuid-generator",
      toolTitle: "UUID Generator",
      icon: "ID",
    });
  }

  // Regex pattern
  if (/^\/[^/]+\/[gimsuy]*$/.test(trimmed)) {
    results.push({
      format: "Regex",
      confidence: 0.85,
      toolHref: "/tools/regex-tester",
      toolTitle: "Regex Tester",
      icon: ".*",
    });
  }

  // CSS
  if (/^[\w.#@:[\]-]+\s*\{[^}]*\}/m.test(trimmed) && /:\s*[^;]+;/m.test(trimmed)) {
    results.push({
      format: "CSS",
      confidence: 0.78,
      toolHref: "/tools/css-to-tailwind",
      toolTitle: "CSS to Tailwind",
      icon: "CSS",
    });
  }

  // Markdown (headers, links, bold)
  if (
    /^#{1,6}\s+\S/m.test(trimmed) &&
    (trimmed.match(/^#{1,6}\s/gm)?.length ?? 0) >= 2
  ) {
    results.push({
      format: "Markdown",
      confidence: 0.75,
      toolHref: "/tools/markdown-preview",
      toolTitle: "Markdown Preview",
      icon: "MD",
    });
  }

  // Base64 — must be long enough and match pattern
  if (
    trimmed.length >= 24 &&
    /^[A-Za-z0-9+/]+={0,2}$/.test(trimmed) &&
    trimmed.length % 4 === 0
  ) {
    results.push({
      format: "Base64",
      confidence: 0.7,
      toolHref: "/tools/base64",
      toolTitle: "Base64 Codec",
      icon: "B64",
    });
  }

  // Return highest confidence match above threshold
  if (results.length === 0) return null;
  results.sort((a, b) => b.confidence - a.confidence);
  return results[0].confidence >= 0.6 ? results[0] : null;
}
