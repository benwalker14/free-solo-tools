export interface HowToStep {
  name: string;
  text: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  readTime: string;
  tags: string[];
  relatedTools: { title: string; href: string }[];
  howToSteps?: HowToStep[];
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
    howToSteps: [
      { name: "Paste your JSON into a validator", text: "Use a JSON formatter tool to paste your JSON and see exactly where the parse error occurs. The tool highlights the line and character position of the first syntax error." },
      { name: "Check for trailing commas", text: "Remove any trailing commas after the last item in objects or arrays. JSON does not allow trailing commas, unlike JavaScript. For example, {\"a\": 1,} is invalid — remove the comma after the 1." },
      { name: "Replace single quotes with double quotes", text: "JSON requires double quotes for all strings and keys. Replace any single quotes with double quotes. {\'name\': \'value\'} must become {\"name\": \"value\"}." },
      { name: "Quote all object keys", text: "Every key in a JSON object must be a double-quoted string. Unquoted keys like {name: \"value\"} are invalid — change to {\"name\": \"value\"}." },
      { name: "Remove comments", text: "JSON does not support comments. Remove any // or /* */ comments from your JSON. If you need comments in config files, consider using JSONC or YAML instead." },
      { name: "Fix missing commas between items", text: "Add commas between every key-value pair in objects and every element in arrays. A missing comma like {\"a\": 1 \"b\": 2} causes a parse error." },
      { name: "Close all brackets and braces", text: "Ensure every opening { has a matching } and every [ has a matching ]. Use a JSON formatter with bracket matching to find unclosed delimiters." },
      { name: "Escape special characters in strings", text: "Backslashes, double quotes, newlines, and tabs inside strings must be escaped: use \\\\, \\\", \\n, and \\t respectively." },
      { name: "Replace undefined and NaN with null", text: "JSON does not support undefined or NaN. Replace these with null or remove the key entirely." },
      { name: "Validate the fixed JSON", text: "After making corrections, paste the JSON back into the validator to confirm it parses successfully. A valid JSON document should format cleanly with proper indentation." },
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
    howToSteps: [
      { name: "Decode the JWT token", text: "Paste the JWT into a decoder tool to inspect the header and payload. Check the algorithm (alg), expiration (exp), issuer (iss), and audience (aud) claims. This reveals which claim is causing the error." },
      { name: "Check the expiration time", text: "If you see TokenExpiredError, the exp claim timestamp has passed. Compare exp to the current Unix timestamp. Fix by issuing a new token or increasing the token lifetime in your auth configuration." },
      { name: "Verify the signing secret or key", text: "Invalid signature errors mean the token was signed with a different secret than what the verifier expects. Ensure the same secret key or key pair is used for signing and verification. Check for typos, encoding differences, or rotated keys." },
      { name: "Check for malformed token structure", text: "A valid JWT has exactly three Base64URL-encoded parts separated by dots: header.payload.signature. If the token is truncated, has extra characters, or is missing a segment, it will fail to parse." },
      { name: "Validate the algorithm", text: "Ensure the alg in the JWT header matches what your verification code expects. Never accept alg:none in production. If using RS256, verify with the public key, not the private key." },
      { name: "Check clock skew between servers", text: "If exp or nbf (not before) claims fail intermittently, your servers may have clock drift. Add a small clockTolerance (e.g., 30 seconds) to your JWT verification options." },
      { name: "Verify issuer and audience claims", text: "If your verifier checks iss or aud claims, ensure the values in the token match exactly. These are case-sensitive string comparisons." },
      { name: "Test with a freshly generated token", text: "Generate a new JWT with known-good claims and verify it works. This isolates whether the issue is in token generation or verification." },
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
    howToSteps: [
      { name: "Identify the CORS error in your browser console", text: "Open DevTools (F12) and check the Console tab. CORS errors show messages like 'Access to fetch has been blocked by CORS policy'. Note the specific error — missing header, preflight failure, or origin mismatch." },
      { name: "Understand that CORS is a server-side fix", text: "CORS errors cannot be fixed in frontend code. The server must send the correct Access-Control-Allow-Origin header. If you control the API, configure it on the server. If you do not, use a backend proxy." },
      { name: "Add the Access-Control-Allow-Origin header", text: "On your server, set the Access-Control-Allow-Origin header to the requesting origin (e.g., https://yourdomain.com) or use * for public APIs. Avoid using * if the request includes credentials." },
      { name: "Handle preflight OPTIONS requests", text: "For non-simple requests (PUT, DELETE, custom headers), the browser sends a preflight OPTIONS request. Your server must respond to OPTIONS with 200 and the correct Access-Control-Allow-Methods and Access-Control-Allow-Headers." },
      { name: "Configure allowed methods and headers", text: "Set Access-Control-Allow-Methods to the HTTP methods your API uses (GET, POST, PUT, DELETE). Set Access-Control-Allow-Headers to include any custom headers like Authorization or Content-Type." },
      { name: "Enable credentials if needed", text: "If your requests include cookies or Authorization headers, set Access-Control-Allow-Credentials: true on the server. When using credentials, you cannot use * for the origin — specify the exact origin instead." },
      { name: "Test with cURL to verify headers", text: "Use cURL to send a request directly to your API and inspect the response headers. Run: curl -I -H 'Origin: https://yourdomain.com' https://api.example.com/endpoint. Verify the CORS headers are present in the response." },
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
    howToSteps: [
      { name: "Validate your YAML syntax", text: "Paste your docker-compose.yml into a YAML validator. Most Compose errors are YAML syntax issues — incorrect indentation, tabs instead of spaces, or missing colons. YAML requires consistent 2-space indentation." },
      { name: "Check port mapping format", text: "Ports must be strings when using the short syntax to avoid YAML parsing issues. Use quotes: ports: - \"8080:80\" instead of ports: - 8080:80. Without quotes, YAML may interpret the colon as a time value." },
      { name: "Remove the version field for Compose V2", text: "Docker Compose V2 (the docker compose command without a hyphen) no longer requires the version field. If you see a version warning, remove the version: line entirely. It is ignored in modern Compose." },
      { name: "Fix service indentation", text: "All services must be indented under the services: key at the same level. Each service property (image, ports, volumes) must be indented one level deeper. Mixing tabs and spaces causes silent failures." },
      { name: "Use correct volume syntax", text: "Bind mounts use host:container format like ./data:/app/data. Named volumes are defined under the top-level volumes: key and referenced by name in services. Ensure paths use forward slashes even on Windows." },
      { name: "Quote environment variable values", text: "Always quote environment variable values, especially those containing special characters: environment: - \"DATABASE_URL=postgres://user:pass@db:5432/app\". Unquoted values with special YAML characters can break parsing." },
      { name: "Check depends_on syntax", text: "depends_on only controls startup order, not readiness. Use the short form (depends_on: - db) or long form with conditions (depends_on: db: condition: service_healthy) for health-check-based ordering." },
      { name: "Validate with docker compose config", text: "Run docker compose config to validate and display the resolved configuration. This command merges all compose files, resolves variables, and shows the final config. Fix any errors it reports." },
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
    howToSteps: [
      { name: "Test your pattern in an interactive regex tester", text: "Paste your regex pattern and test string into an interactive regex tester with real-time highlighting. This immediately shows which parts of the input match and which capture groups are populated." },
      { name: "Escape metacharacters that should be literal", text: "Characters like . * + ? ( ) [ ] { } ^ $ | \\ have special meaning in regex. To match them literally, prefix with a backslash. For example, to match a dot use \\. instead of just a period." },
      { name: "Switch from greedy to lazy quantifiers", text: "If your pattern matches too much text, your quantifiers are greedy. Add ? after *, +, or {} to make them lazy. For example, <.*?> matches the shortest possible tag instead of everything between the first < and last >." },
      { name: "Add anchors for exact matching", text: "Use ^ to anchor the start and $ to anchor the end of the string. Without anchors, a pattern like \\d{3} matches any 3-digit substring. With ^\\d{3}$, it only matches strings that are exactly 3 digits." },
      { name: "Check your regex flags", text: "Flags change matching behavior. Use g for global (find all matches, not just the first), i for case-insensitive matching, m for multiline mode (^ and $ match line boundaries), and s for dotall mode (. matches newlines)." },
      { name: "Fix character class ranges", text: "Inside square brackets, use hyphens for ranges like [a-z] or [0-9]. Place literal hyphens at the start or end: [-abc] or [abc-]. Escape special characters inside classes: [\\[\\]] to match brackets." },
      { name: "Avoid catastrophic backtracking", text: "Nested quantifiers like (a+)+ or (a|a)* cause exponential backtracking on non-matching input. Simplify your pattern, use possessive quantifiers (a++ if supported), or use atomic groups to prevent backtracking." },
      { name: "Test across multiple regex engines", text: "Regex behavior varies between JavaScript, Python, Go, and Java. Features like lookbehind width, Unicode support, and flag availability differ. Test your pattern in the target language to catch engine-specific issues." },
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
    slug: "biome-vs-eslint",
    title: "Biome vs ESLint 2026: Complete Migration Guide",
    description:
      "Compare Biome v2 and ESLint 9 side-by-side — performance, rule coverage, config complexity, and a step-by-step migration guide with before/after examples.",
    publishedAt: "2026-03-19",
    readTime: "12 min read",
    tags: ["Biome", "ESLint", "Tooling", "Migration"],
    relatedTools: [
      { title: "ESLint to Biome Converter", href: "/tools/eslint-to-biome" },
      { title: "JSON Formatter & Validator", href: "/tools/json-formatter" },
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
  {
    slug: "typescript-7-go-rewrite",
    title: "TypeScript 7.0: What the Go Rewrite Means for Every Developer",
    description:
      "TypeScript 7.0 rewrites the compiler in Go for 10x faster type-checking, 8x faster project loads, and instant IntelliSense. Here's what changes, what stays the same, and how to prepare your codebase.",
    publishedAt: "2026-03-19",
    readTime: "12 min read",
    tags: ["TypeScript", "Go", "Tooling", "Performance"],
    relatedTools: [
      { title: "tsconfig.json Visual Builder", href: "/tools/tsconfig-builder" },
      {
        title: "TypeScript 6.0 Migration Checker",
        href: "/tools/ts6-migration",
      },
      {
        title: "JSON to TypeScript Generator",
        href: "/tools/json-to-typescript",
      },
      {
        title: "TypeScript to JavaScript Converter",
        href: "/tools/typescript-to-js",
      },
    ],
  },
  {
    slug: "browser-tools-vs-vscode-extensions",
    title:
      "Why Browser-Based Tools Are Safer Than VS Code Extensions",
    description:
      "The GlassWorm worm compromised 433 VS Code extensions, npm packages, and GitHub repos in March 2026. Here's why browser-based developer tools are architecturally immune to supply chain attacks — and how to verify any tool is safe.",
    publishedAt: "2026-03-19",
    readTime: "11 min read",
    tags: ["Security", "VS Code", "Privacy", "Supply Chain"],
    relatedTools: [
      { title: "AI Code Security Scanner", href: "/tools/code-security-scanner" },
      { title: "Code Complexity Analyzer", href: "/tools/code-complexity-analyzer" },
      { title: "JSON Formatter & Validator", href: "/tools/json-formatter" },
      { title: ".env File Validator", href: "/tools/env-validator" },
    ],
    howToSteps: [
      { name: "Audit your installed VS Code extensions", text: "Run 'code --list-extensions' in your terminal to list every installed extension. For each one, check the publisher, last update date, and whether you actively use it. Remove any extension you don't need — every extension is attack surface." },
      { name: "Disable auto-update for extensions", text: "In VS Code settings, set extensions.autoUpdate to false. Review changelogs before accepting updates. This prevents a previously trusted extension from silently becoming malicious through an update." },
      { name: "Rotate your credentials", text: "If you had any recently installed or updated VS Code extensions, rotate your npm tokens (npm token revoke), GitHub personal access tokens, AWS access keys, SSH keys, and any API keys stored in environment variables." },
      { name: "Verify browser tools are client-side", text: "Open DevTools (F12), go to the Network tab, clear entries, then use the tool with test data. If zero network requests are made, your data never left your browser. If you see POST requests to an API, the tool is server-side and your data was sent elsewhere." },
      { name: "Use client-side browser tools for sensitive data", text: "For tasks involving credentials, tokens, API keys, or proprietary code, use a verified client-side browser tool instead of a VS Code extension. The browser sandbox guarantees your data cannot be exfiltrated — it cannot access your file system, shell, or credentials." },
      { name: "Scan code for hidden payloads", text: "GlassWorm hid malicious code in invisible Unicode characters. Run a security scan on any recently modified code to check for zero-width characters, hardcoded secrets, and injection patterns using a client-side code scanner." },
    ],
  },
  {
    slug: "vibe-coding-security",
    title: "Vibe Coding Security: How to Review AI-Generated Code for Vulnerabilities",
    description:
      "45% of AI-generated code contains vulnerabilities. This step-by-step guide covers how to review vibe-coded AI output for hardcoded secrets, injection, XSS, auth flaws, and complexity before shipping to production.",
    publishedAt: "2026-03-19",
    readTime: "14 min read",
    tags: ["Security", "AI", "HowTo", "Code Review"],
    relatedTools: [
      { title: "AI Code Security Scanner", href: "/tools/code-security-scanner" },
      { title: "Code Complexity Analyzer", href: "/tools/code-complexity-analyzer" },
      { title: "JWT Decoder", href: "/tools/jwt-decoder" },
      { title: ".env File Validator", href: "/tools/env-validator" },
    ],
    howToSteps: [
      { name: "Scan for known vulnerability patterns", text: "Run the AI-generated code through an automated security scanner to catch hardcoded secrets, dangerous functions like eval(), SQL injection via string interpolation, and common anti-patterns. This catches low-hanging fruit in seconds." },
      { name: "Check for hardcoded secrets and credentials", text: "Search for API keys, database passwords, JWT secrets, and connection strings hardcoded in the source. Replace them with environment variables and validate your .env file structure." },
      { name: "Validate all user inputs", text: "Verify that every value from request bodies, query parameters, URL paths, and headers is validated before use. Look for string interpolation in SQL queries, eval() with user input, innerHTML with unsanitized data, and file paths from user input." },
      { name: "Review authentication and authorization", text: "Check that JWT tokens are verified (not just decoded), algorithms are explicitly specified, role-based access controls exist on every endpoint, and cookies have httpOnly, secure, and sameSite attributes." },
      { name: "Check for cross-site scripting (XSS)", text: "Look for innerHTML, dangerouslySetInnerHTML, and document.write with unsanitized user data. Use textContent for text rendering or sanitize HTML with DOMPurify before rendering." },
      { name: "Audit dependencies and imports", text: "Verify that suggested packages exist, are actively maintained, and have no known vulnerabilities. Run npm audit after installing. Watch for hallucinated package names that could be typosquat targets." },
      { name: "Test error handling for information leakage", text: "Ensure error responses do not expose stack traces, SQL queries, file paths, or server configuration to clients. Log full errors server-side but return generic messages to users." },
      { name: "Measure code complexity", text: "Use a complexity analyzer to check cyclomatic complexity (keep under 10), cognitive complexity (keep under 15), and nesting depth (keep under 4). High complexity functions are statistically more likely to contain bugs including security bugs." },
    ],
  },
  {
    slug: "codebeautify-alternative",
    title:
      "CodeBeautify Alternative: 113 Tools That Never See Your Data",
    description:
      "CodeBeautify stores your data on their servers. DevBolt offers 113 free developer tools that run 100% client-side — your JSON, JWTs, code, and credentials never leave your browser.",
    publishedAt: "2026-03-19",
    readTime: "11 min read",
    tags: ["Security", "Privacy", "Tools", "Alternative"],
    relatedTools: [
      { title: "JSON Formatter & Validator", href: "/tools/json-formatter" },
      { title: "Base64 Encoder & Decoder", href: "/tools/base64" },
      { title: "JWT Decoder", href: "/tools/jwt-decoder" },
      { title: "AI Code Security Scanner", href: "/tools/code-security-scanner" },
    ],
  },
  {
    slug: "mcp-context-window-optimization",
    title: "MCP Context Window: How to Optimize Your AI Agent Setup",
    description:
      "MCP servers consume context window tokens every time your AI agent calls a tool. Learn how to audit your MCP config, reduce context bloat, and avoid the performance traps that waste tokens and slow down Claude, Cursor, and Windsurf.",
    publishedAt: "2026-03-19",
    readTime: "10 min read",
    tags: ["MCP", "AI", "Performance", "HowTo"],
    relatedTools: [
      { title: "MCP Config Builder", href: "/tools/mcp-config-builder" },
      { title: "LLM Token Counter", href: "/tools/token-counter" },
      { title: "JSON Formatter", href: "/tools/json-formatter" },
      { title: "JSON Visualizer", href: "/tools/json-visualizer" },
    ],
    howToSteps: [
      { name: "Audit your active MCP servers", text: "List every MCP server in your config file. For each one, check: do you actually use it daily? Each server adds tool definitions to every prompt, consuming hundreds to thousands of tokens. Remove servers you don't actively use." },
      { name: "Count your tool definitions", text: "Open your MCP config and count the total tools registered across all servers. Each tool's name, description, and parameter schema is injected into the context window. 50+ tools can consume 5,000–10,000 tokens before you even send your first message." },
      { name: "Measure the token cost", text: "Paste your full MCP config JSON into a token counter tool. Multiply the token count by the number of messages in a typical session. This reveals the cumulative cost of tool definitions over a conversation." },
      { name: "Disable unused servers", text: "Comment out or remove MCP servers you use less than weekly. You can re-enable them when needed. Fewer active servers means more context window available for your actual code and conversation." },
      { name: "Optimize tool descriptions", text: "If you're writing custom MCP servers, keep tool descriptions concise. A 200-word description wastes tokens on every single prompt. One sentence per tool is sufficient for the AI to understand when to use it." },
      { name: "Use server-specific configs per project", text: "Instead of one global config with every server enabled, create project-specific MCP configs that only include the servers relevant to that project. Database servers for backend work, design servers for frontend work." },
    ],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}
