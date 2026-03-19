export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  readTime: string;
  tags: string[];
  relatedTools: { title: string; href: string }[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "fix-invalid-json",
    title: "How to Fix Invalid JSON: The 10 Most Common Errors and Solutions",
    description:
      "Invalid JSON errors are caused by strict syntax rules — trailing commas, single quotes, unquoted keys, and more. This guide covers every common JSON parse error with fixes and code examples.",
    publishedAt: "2026-03-19",
    readTime: "12 min read",
    tags: ["JSON", "Debugging", "HowTo"],
    relatedTools: [
      { title: "JSON Formatter & Validator", href: "/tools/json-formatter" },
      { title: "JSON Schema Validator", href: "/tools/json-schema" },
      { title: "JSON Visualizer", href: "/tools/json-visualizer" },
      { title: "JSON Path Tester", href: "/tools/json-path" },
    ],
  },
  {
    slug: "fix-jwt-errors",
    title: "JWT Errors Explained: How to Fix Expired, Invalid, and Malformed Tokens",
    description:
      "JWT errors like TokenExpiredError, invalid signature, and malformed token are common in auth systems. Learn how to decode, diagnose, and fix every JWT error with code examples.",
    publishedAt: "2026-03-19",
    readTime: "12 min read",
    tags: ["JWT", "Authentication", "Debugging", "HowTo"],
    relatedTools: [
      { title: "JWT Decoder", href: "/tools/jwt-decoder" },
      { title: "JWT Builder & Generator", href: "/tools/jwt-builder" },
      { title: "Base64 Encoder & Decoder", href: "/tools/base64" },
      { title: "Hash Generator", href: "/tools/hash-generator" },
    ],
  },
  {
    slug: "fix-cors-errors",
    title: "How to Fix CORS Errors: A Complete Guide for Every Server Framework",
    description:
      "CORS errors are fixed on the server, not the client. Learn what causes 'No Access-Control-Allow-Origin' errors and how to configure CORS for Express, Next.js, Nginx, Go, and more.",
    publishedAt: "2026-03-19",
    readTime: "12 min read",
    tags: ["CORS", "Security", "Backend", "HowTo"],
    relatedTools: [
      { title: "CSP Header Builder", href: "/tools/csp-builder" },
      { title: "Security Headers Generator", href: "/tools/security-headers" },
      { title: "cURL to Code Converter", href: "/tools/curl-converter" },
      { title: "HTTP Status Code Reference", href: "/tools/http-status-codes" },
    ],
  },
  {
    slug: "fix-docker-compose-errors",
    title: "Docker Compose Errors: The 10 Most Common YAML Mistakes and How to Fix Them",
    description:
      "Docker Compose errors are usually YAML syntax issues — indentation, wrong port formats, volume paths, and version conflicts. This guide covers every common Compose error with fixes.",
    publishedAt: "2026-03-19",
    readTime: "12 min read",
    tags: ["Docker", "DevOps", "YAML", "HowTo"],
    relatedTools: [
      { title: "Docker Compose Validator", href: "/tools/docker-compose" },
      { title: "Dockerfile Validator", href: "/tools/dockerfile-validator" },
      { title: "YAML Validator & Formatter", href: "/tools/yaml-formatter" },
      { title: ".env File Validator", href: "/tools/env-validator" },
    ],
  },
  {
    slug: "fix-regex-errors",
    title: "Regex Errors: Why Your Pattern Isn't Matching and How to Fix It",
    description:
      "Regex errors are caused by unescaped characters, greedy matching, missing anchors, and language-specific quirks. Learn how to debug and fix every common regex problem with tested patterns.",
    publishedAt: "2026-03-19",
    readTime: "11 min read",
    tags: ["Regex", "Debugging", "HowTo"],
    relatedTools: [
      { title: "Regex Tester", href: "/tools/regex-tester" },
      { title: "Regex Generator", href: "/tools/regex-generator" },
      { title: "Word & Character Counter", href: "/tools/word-counter" },
      { title: "Case Converter", href: "/tools/case-converter" },
    ],
  },
  {
    slug: "typescript-6-migration-guide",
    title: "TypeScript 6.0 vs 5.x: Complete Migration Guide",
    description:
      "Everything that changed in TypeScript 6.0 — removed ES5 target, strict by default, new moduleResolution, changed defaults — with step-by-step migration instructions and before/after examples.",
    publishedAt: "2026-03-19",
    readTime: "11 min read",
    tags: ["TypeScript", "Migration", "tsconfig", "Guide"],
    relatedTools: [
      {
        title: "TypeScript 6.0 Migration Checker",
        href: "/tools/ts6-migration",
      },
      { title: "tsconfig.json Visual Builder", href: "/tools/tsconfig-builder" },
      {
        title: "TypeScript to JavaScript Converter",
        href: "/tools/typescript-to-js",
      },
    ],
  },
  {
    slug: "flexbox-vs-grid",
    title: "CSS Flexbox vs Grid: When to Use Each Layout System",
    description:
      "A practical comparison of CSS Flexbox and Grid — one-dimensional vs two-dimensional layouts, when to use each, and how to combine them effectively.",
    publishedAt: "2026-03-19",
    readTime: "9 min read",
    tags: ["CSS", "Layout", "Frontend", "Comparison"],
    relatedTools: [
      { title: "CSS Flexbox Generator", href: "/tools/flexbox-generator" },
      { title: "CSS Grid Generator", href: "/tools/grid-generator" },
      { title: "CSS to Tailwind Converter", href: "/tools/css-to-tailwind" },
    ],
  },
  {
    slug: "json-vs-yaml",
    title: "JSON vs YAML: Which Data Format Should You Use?",
    description:
      "Compare JSON and YAML side-by-side — syntax, comments, gotchas, parsing speed, and when each format is the right choice for APIs, config, and data exchange.",
    publishedAt: "2026-03-19",
    readTime: "9 min read",
    tags: ["JSON", "YAML", "DevOps", "Comparison"],
    relatedTools: [
      { title: "JSON ↔ YAML Converter", href: "/tools/json-yaml" },
      { title: "JSON Formatter & Validator", href: "/tools/json-formatter" },
      { title: "YAML Validator & Formatter", href: "/tools/yaml-formatter" },
    ],
  },
  {
    slug: "sha256-vs-md5",
    title: "SHA-256 vs MD5: Why MD5 Is Broken and What to Use Instead",
    description:
      "Understand the real differences between SHA-256 and MD5 — collision attacks, security guarantees, code examples, and why neither is for passwords.",
    publishedAt: "2026-03-19",
    readTime: "9 min read",
    tags: ["Security", "Cryptography", "Comparison"],
    relatedTools: [
      { title: "Hash Generator", href: "/tools/hash-generator" },
      { title: "File Hash Calculator", href: "/tools/file-hash" },
      { title: "Password Generator", href: "/tools/password-generator" },
    ],
  },
  {
    slug: "nextjs-vs-nuxt",
    title: "Next.js vs Nuxt: Choosing Between React and Vue Meta-Frameworks",
    description:
      "Compare Next.js and Nuxt — routing, data fetching, server rendering, ecosystem, and when each meta-framework is the better choice for your project.",
    publishedAt: "2026-03-19",
    readTime: "10 min read",
    tags: ["React", "Vue", "Frontend", "Comparison"],
    relatedTools: [
      { title: "HTML to JSX Converter", href: "/tools/html-to-jsx" },
      { title: "JSON to TypeScript Generator", href: "/tools/json-to-typescript" },
      { title: "Tailwind CSS Generator", href: "/tools/tailwind-generator" },
    ],
  },
  {
    slug: "base64-vs-url-encoding",
    title: "Base64 vs URL Encoding: What Each Does and When to Use Which",
    description:
      "Base64 converts binary to text. URL encoding makes strings safe for URLs. Learn the differences, common mistakes, and when to use each encoding.",
    publishedAt: "2026-03-19",
    readTime: "9 min read",
    tags: ["Encoding", "Web Development", "Comparison"],
    relatedTools: [
      { title: "Base64 Encoder & Decoder", href: "/tools/base64" },
      { title: "URL Encoder & Decoder", href: "/tools/url-encoder" },
      { title: "Encode/Decode Multi-Tool", href: "/tools/encode-decode" },
    ],
  },
  {
    slug: "typescript-vs-javascript",
    title: "TypeScript vs JavaScript: What's the Difference and Which Should You Use?",
    description:
      "A practical comparison of TypeScript and JavaScript — type systems, tooling, migration, performance, and when each is the right choice for your project.",
    publishedAt: "2026-03-19",
    readTime: "10 min read",
    tags: ["TypeScript", "JavaScript", "Comparison"],
    relatedTools: [
      { title: "JSON to TypeScript Generator", href: "/tools/json-to-typescript" },
      { title: "JavaScript/TypeScript Playground", href: "/tools/js-playground" },
      { title: "JSON to Code Generator", href: "/tools/json-to-code" },
    ],
  },
  {
    slug: "react-vs-vue",
    title: "React vs Vue: A Developer's Guide to Choosing the Right Framework",
    description:
      "Compare React and Vue side-by-side — component syntax, reactivity models, ecosystem, job market, and when each framework shines.",
    publishedAt: "2026-03-19",
    readTime: "10 min read",
    tags: ["React", "Vue", "Frontend", "Comparison"],
    relatedTools: [
      { title: "HTML to JSX Converter", href: "/tools/html-to-jsx" },
      { title: "SVG to JSX Converter", href: "/tools/svg-to-jsx" },
      { title: "Tailwind CSS Generator", href: "/tools/tailwind-generator" },
    ],
  },
  {
    slug: "rest-vs-graphql",
    title: "REST vs GraphQL: When to Use Each for Your API",
    description:
      "Understand the real trade-offs between REST and GraphQL — data fetching, caching, type safety, and which architecture fits your project.",
    publishedAt: "2026-03-19",
    readTime: "10 min read",
    tags: ["API", "Backend", "Comparison"],
    relatedTools: [
      { title: "OpenAPI Validator", href: "/tools/openapi-validator" },
      { title: "OpenAPI to TypeScript Converter", href: "/tools/openapi-to-typescript" },
      { title: "JSON Formatter", href: "/tools/json-formatter" },
    ],
  },
  {
    slug: "docker-vs-kubernetes",
    title: "Docker vs Kubernetes: What Each Does and When You Need Both",
    description:
      "Docker builds containers. Kubernetes orchestrates them at scale. Learn what each does, how they work together, and when you actually need Kubernetes.",
    publishedAt: "2026-03-19",
    readTime: "10 min read",
    tags: ["Docker", "Kubernetes", "DevOps", "Comparison"],
    relatedTools: [
      { title: "Dockerfile Validator", href: "/tools/dockerfile-validator" },
      { title: "Docker Compose Validator", href: "/tools/docker-compose" },
      { title: "Kubernetes YAML Validator", href: "/tools/k8s-validator" },
    ],
  },
  {
    slug: "tailwind-vs-bootstrap",
    title: "Tailwind CSS vs Bootstrap: Which CSS Framework Should You Use?",
    description:
      "Compare Tailwind's utility-first approach with Bootstrap's component library — bundle size, customization, responsive design, and which fits your project.",
    publishedAt: "2026-03-19",
    readTime: "9 min read",
    tags: ["CSS", "Tailwind", "Bootstrap", "Comparison"],
    relatedTools: [
      { title: "Tailwind CSS Generator", href: "/tools/tailwind-generator" },
      { title: "CSS to Tailwind Converter", href: "/tools/css-to-tailwind" },
      { title: "CSS Flexbox Generator", href: "/tools/flexbox-generator" },
    ],
  },
  {
    slug: "developer-tools-privacy",
    title:
      "Why Your Developer Tools Should Never Touch a Server",
    description:
      "The 2025 CodeBeautify and JSONFormatter data leak exposed 5 GB of developer credentials. Learn how to verify whether your tools are safe and why client-side processing is the only real guarantee.",
    publishedAt: "2026-03-19",
    readTime: "10 min read",
    tags: ["Security", "Privacy", "Best Practices"],
    relatedTools: [
      { title: "JSON Formatter & Validator", href: "/tools/json-formatter" },
      { title: "Base64 Encoder & Decoder", href: "/tools/base64" },
      { title: "JWT Decoder", href: "/tools/jwt-decoder" },
      { title: "Hash Generator", href: "/tools/hash-generator" },
    ],
  },
  {
    slug: "jwt-tutorial",
    title: "Understanding JWTs: A Developer's Guide to JSON Web Tokens",
    description:
      "Learn how JSON Web Tokens work, how to decode them, and common security pitfalls to avoid in your applications.",
    publishedAt: "2026-03-18",
    readTime: "8 min read",
    tags: ["Authentication", "Security", "Web Development"],
    relatedTools: [
      { title: "JWT Decoder", href: "/tools/jwt-decoder" },
      { title: "Base64 Encoder & Decoder", href: "/tools/base64" },
      { title: "Hash Generator", href: "/tools/hash-generator" },
    ],
  },
  {
    slug: "regex-cheat-sheet",
    title: "Regex Cheat Sheet: Patterns Every Developer Should Know",
    description:
      "A practical reference for regular expression syntax, common patterns, and real-world examples you'll actually use.",
    publishedAt: "2026-03-18",
    readTime: "10 min read",
    tags: ["Regex", "Reference", "Productivity"],
    relatedTools: [
      { title: "Regex Tester", href: "/tools/regex-tester" },
      { title: "Case Converter", href: "/tools/case-converter" },
      { title: "Word & Character Counter", href: "/tools/word-counter" },
    ],
  },
  {
    slug: "curl-guide",
    title: "The Practical cURL Guide: From Basic Requests to Advanced Usage",
    description:
      "Master cURL with practical examples for GET, POST, authentication, file uploads, and debugging HTTP requests.",
    publishedAt: "2026-03-18",
    readTime: "9 min read",
    tags: ["CLI", "HTTP", "API"],
    relatedTools: [
      { title: "cURL to Code Converter", href: "/tools/curl-converter" },
      { title: "JSON Formatter", href: "/tools/json-formatter" },
      { title: "URL Parser", href: "/tools/url-parser" },
    ],
  },
  {
    slug: "css-flexbox-guide",
    title: "CSS Flexbox: A Visual Guide to Every Property",
    description:
      "Learn CSS Flexbox with practical examples for centering, navbars, card grids, and responsive layouts. Includes a quick reference table and common patterns.",
    publishedAt: "2026-03-18",
    readTime: "10 min read",
    tags: ["CSS", "Layout", "Frontend"],
    relatedTools: [
      { title: "CSS Flexbox Generator", href: "/tools/flexbox-generator" },
      { title: "CSS Grid Generator", href: "/tools/grid-generator" },
      { title: "Tailwind CSS Generator", href: "/tools/tailwind-generator" },
    ],
  },
  {
    slug: "json-validation-guide",
    title: "How to Validate JSON: The 7 Most Common Errors and How to Fix Them",
    description:
      "A practical guide to JSON syntax rules, the most common validation errors, and how to debug malformed JSON fast.",
    publishedAt: "2026-03-18",
    readTime: "8 min read",
    tags: ["JSON", "Debugging", "Web Development"],
    relatedTools: [
      { title: "JSON Formatter & Validator", href: "/tools/json-formatter" },
      { title: "JSON Schema Validator", href: "/tools/json-schema" },
      { title: "JSON Path Tester", href: "/tools/json-path" },
    ],
  },
  {
    slug: "gitignore-guide",
    title: "How to Write a .gitignore File: Patterns, Templates, and Common Mistakes",
    description:
      "Learn .gitignore syntax, wildcard patterns, and ready-to-use templates for Node.js, Python, Go, and Rust. Avoid accidentally committing secrets and build artifacts.",
    publishedAt: "2026-03-18",
    readTime: "9 min read",
    tags: ["Git", "DevOps", "Security"],
    relatedTools: [
      { title: ".gitignore Generator", href: "/tools/gitignore-generator" },
      { title: ".env File Validator", href: "/tools/env-validator" },
      { title: "File Hash Calculator", href: "/tools/file-hash" },
    ],
  },
  {
    slug: "base64-encoding-explained",
    title: "Base64 Encoding Explained: How It Works and When to Use It",
    description:
      "Understand how Base64 encoding works, where it's used (JWTs, data URIs, APIs), and code examples in JavaScript, Python, Go, and the command line.",
    publishedAt: "2026-03-18",
    readTime: "9 min read",
    tags: ["Encoding", "Web Development", "Fundamentals"],
    relatedTools: [
      { title: "Base64 Encoder & Decoder", href: "/tools/base64" },
      { title: "Image to Base64 Converter", href: "/tools/image-base64" },
      { title: "Encode/Decode Multi-Tool", href: "/tools/encode-decode" },
    ],
  },
  {
    slug: "css-grid-guide",
    title: "CSS Grid Layout: The Complete Guide with Examples",
    description:
      "Learn CSS Grid with practical examples for responsive card grids, dashboard layouts, photo galleries, and named areas. Includes a quick reference table and common patterns.",
    publishedAt: "2026-03-18",
    readTime: "10 min read",
    tags: ["CSS", "Layout", "Frontend"],
    relatedTools: [
      { title: "CSS Grid Generator", href: "/tools/grid-generator" },
      { title: "CSS Flexbox Generator", href: "/tools/flexbox-generator" },
      { title: "Tailwind CSS Generator", href: "/tools/tailwind-generator" },
    ],
  },
  {
    slug: "docker-best-practices",
    title: "Dockerfile Best Practices: Smaller, Faster, More Secure Images",
    description:
      "Learn multi-stage builds, layer caching, security hardening, and the common Dockerfile mistakes that silently bloat your containers.",
    publishedAt: "2026-03-18",
    readTime: "9 min read",
    tags: ["Docker", "DevOps", "Security"],
    relatedTools: [
      { title: "Dockerfile Validator", href: "/tools/dockerfile-validator" },
      { title: "Docker Compose Validator", href: "/tools/docker-compose" },
      { title: "Nginx Config Generator", href: "/tools/nginx-config" },
    ],
  },
  {
    slug: "json-schema-guide",
    title: "JSON Schema: A Practical Guide to Validating JSON Data",
    description:
      "Learn JSON Schema from scratch — types, required fields, nested objects, arrays, $ref, composition, and conditional validation with real-world examples.",
    publishedAt: "2026-03-18",
    readTime: "9 min read",
    tags: ["JSON", "Validation", "API"],
    relatedTools: [
      { title: "JSON Schema Validator", href: "/tools/json-schema" },
      { title: "Zod Schema Generator", href: "/tools/zod-schema" },
      { title: "JSON Formatter & Validator", href: "/tools/json-formatter" },
    ],
  },
  {
    slug: "password-security-guide",
    title: "Password Security: What Developers and Users Need to Know",
    description:
      "Understand password entropy, how attacks work, hashing vs encryption, and implementation best practices with code examples in Node.js, Python, and Go.",
    publishedAt: "2026-03-18",
    readTime: "9 min read",
    tags: ["Security", "Authentication", "Best Practices"],
    relatedTools: [
      { title: "Password Generator", href: "/tools/password-generator" },
      { title: "Hash Generator", href: "/tools/hash-generator" },
      { title: ".env File Validator", href: "/tools/env-validator" },
    ],
  },
  {
    slug: "uuid-guide",
    title: "Understanding UUIDs: Versions, Formats, and When to Use Each",
    description:
      "Learn how UUIDs work, the differences between v1, v4, v5, and v7, and when to use each version. Includes code examples and database performance tips.",
    publishedAt: "2026-03-18",
    readTime: "10 min read",
    tags: ["Fundamentals", "Databases", "Web Development"],
    relatedTools: [
      { title: "UUID Generator", href: "/tools/uuid-generator" },
      { title: "Hash Generator", href: "/tools/hash-generator" },
      { title: "JSON Formatter", href: "/tools/json-formatter" },
    ],
  },
  {
    slug: "markdown-cheat-sheet",
    title: "Markdown Syntax Cheat Sheet: Every Feature You Need to Know",
    description:
      "A complete Markdown reference covering headings, formatting, links, code blocks, tables, task lists, GitHub-flavored features, and common mistakes.",
    publishedAt: "2026-03-18",
    readTime: "9 min read",
    tags: ["Markdown", "Reference", "Productivity"],
    relatedTools: [
      { title: "Markdown Preview", href: "/tools/markdown-preview" },
      { title: "Markdown Table Generator", href: "/tools/markdown-table" },
      { title: "HTML ↔ Markdown Converter", href: "/tools/html-markdown" },
    ],
  },
  {
    slug: "docker-compose-guide",
    title: "Docker Compose: A Practical Guide to Multi-Container Apps",
    description:
      "Learn Docker Compose with real-world examples for Node.js, PostgreSQL, Redis, and WordPress stacks. Covers services, volumes, networks, health checks, and common mistakes.",
    publishedAt: "2026-03-18",
    readTime: "11 min read",
    tags: ["Docker", "DevOps", "Containers"],
    relatedTools: [
      { title: "Docker Compose Validator", href: "/tools/docker-compose" },
      { title: "Dockerfile Validator", href: "/tools/dockerfile-validator" },
      { title: ".env File Validator", href: "/tools/env-validator" },
    ],
  },
  {
    slug: "yaml-guide",
    title: "YAML Syntax Guide: From Basics to Gotchas",
    description:
      "Learn YAML syntax, data types, multiline strings, anchors, and the notorious Norway problem. Includes real-world examples for Kubernetes, GitHub Actions, and Docker Compose.",
    publishedAt: "2026-03-18",
    readTime: "10 min read",
    tags: ["YAML", "DevOps", "Reference"],
    relatedTools: [
      { title: "YAML Validator & Formatter", href: "/tools/yaml-formatter" },
      { title: "JSON ↔ YAML Converter", href: "/tools/json-yaml" },
      { title: "Kubernetes YAML Validator", href: "/tools/k8s-validator" },
    ],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}
