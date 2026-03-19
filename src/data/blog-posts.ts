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
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}
