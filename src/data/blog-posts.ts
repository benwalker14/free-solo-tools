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
