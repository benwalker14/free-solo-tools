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
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}
