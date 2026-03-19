export interface SubpageFAQ {
  question: string;
  answer: string;
}

export interface SubpageContent {
  heading: string;
  body: string;
  codeExample?: string;
  codeLanguage?: string;
}

export interface ToolSubpage {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  content: SubpageContent[];
  faqs: SubpageFAQ[];
  keywords: string[];
  parentToolSlug: string;
  parentToolName: string;
}

import { batch1Subpages } from "./tool-subpages-batch1";
import { batch2Subpages } from "./tool-subpages-batch2";
import { batch3Subpages } from "./tool-subpages-batch3";
import { batch4Subpages } from "./tool-subpages-batch4";
import { batch5Subpages } from "./tool-subpages-batch5";
import { batch6Subpages } from "./tool-subpages-batch6";

const coreSubpages: Record<string, ToolSubpage[]> = {
  "hash-generator": [
    {
      slug: "sha256",
      title: "SHA-256 Hash Generator",
      metaTitle: "SHA-256 Hash Generator Online — Free & Instant",
      metaDescription:
        "Generate SHA-256 hashes online instantly. Secure, client-side hashing with no data sent to any server. Free SHA-256 hash calculator.",
      h1: "SHA-256 Hash Generator Online",
      intro:
        "Generate SHA-256 hashes instantly in your browser. Your data never leaves your device — all hashing is performed client-side using the Web Crypto API.",
      content: [
        {
          heading: "What is SHA-256?",
          body: "SHA-256 (Secure Hash Algorithm 256-bit) is a cryptographic hash function that produces a fixed 256-bit (32-byte) output, typically displayed as a 64-character hexadecimal string. It is part of the SHA-2 family designed by the NSA and published by NIST in 2001. SHA-256 is widely used in SSL/TLS certificates, Bitcoin mining, digital signatures, and data integrity verification.",
        },
        {
          heading: "Common uses for SHA-256",
          body: "SHA-256 is used to verify file integrity (checksums), secure password storage (with salt), blockchain and cryptocurrency proof-of-work, digital certificate signing, and software distribution verification. It is the default hash in Git for commit IDs and is recommended by NIST for most security applications.",
        },
        {
          heading: "SHA-256 vs other hash algorithms",
          body: "SHA-256 offers a strong balance between security and performance. MD5 and SHA-1 are faster but considered broken for cryptographic purposes. SHA-512 provides a larger output but is slower on 32-bit systems. For most applications, SHA-256 is the recommended choice.",
        },
      ],
      faqs: [
        {
          question: "Is SHA-256 secure?",
          answer:
            "Yes. SHA-256 has no known practical collision attacks and is recommended by NIST, used in TLS, Bitcoin, and most modern security systems.",
        },
        {
          question: "Can SHA-256 be reversed?",
          answer:
            "No. SHA-256 is a one-way function — you cannot recover the original input from the hash. This makes it ideal for password hashing and integrity verification.",
        },
        {
          question: "How long is a SHA-256 hash?",
          answer:
            "A SHA-256 hash is always 256 bits (32 bytes), typically represented as a 64-character hexadecimal string.",
        },
      ],
      keywords: [
        "sha256 hash generator",
        "sha256 online",
        "sha-256 generator",
        "sha256 hash calculator",
        "generate sha256 hash",
        "sha256 checksum",
      ],
      parentToolSlug: "hash-generator",
      parentToolName: "Hash Generator",
    },
    {
      slug: "sha512",
      title: "SHA-512 Hash Generator",
      metaTitle: "SHA-512 Hash Generator Online — Free & Instant",
      metaDescription:
        "Generate SHA-512 hashes online instantly. Client-side hashing for maximum privacy. Free SHA-512 hash calculator with no data uploads.",
      h1: "SHA-512 Hash Generator Online",
      intro:
        "Generate SHA-512 hashes instantly in your browser. All computation happens locally — your data is never sent to any server.",
      content: [
        {
          heading: "What is SHA-512?",
          body: "SHA-512 (Secure Hash Algorithm 512-bit) produces a 512-bit (64-byte) hash, displayed as a 128-character hexadecimal string. Part of the SHA-2 family, it provides a larger security margin than SHA-256. SHA-512 is actually faster than SHA-256 on 64-bit processors due to native 64-bit arithmetic. It is used in TLS handshakes, Ed25519 signatures, and HMAC authentication.",
          codeExample: '# Generate SHA-512 hash from command line\necho -n "hello world" | sha512sum\n\n# Python\nimport hashlib\nhash = hashlib.sha512(b"hello world").hexdigest()\nprint(hash)  # 309ecc489c12d6eb...\n\n# Node.js\nconst crypto = require("crypto");\ncrypto.createHash("sha512").update("hello world").digest("hex");',
        },
        {
          heading: "When to use SHA-512",
          body: "SHA-512 is preferred in environments that process 64-bit data natively, such as modern servers and desktops. It is commonly used in digital signatures, certificate authorities, secure file verification, and applications requiring maximum hash security margin. For password hashing, pair SHA-512 with a salt and key-stretching algorithm like bcrypt or Argon2 rather than using it directly.",
        },
      ],
      faqs: [
        {
          question: "Is SHA-512 more secure than SHA-256?",
          answer:
            "SHA-512 has a larger output (512 bits vs 256 bits), providing a higher theoretical security margin. However, SHA-256 is already secure against all known attacks. SHA-512 is preferred on 64-bit systems where it is actually faster.",
        },
        {
          question: "How long is a SHA-512 hash?",
          answer:
            "A SHA-512 hash is always 512 bits (64 bytes), represented as a 128-character hexadecimal string.",
        },
      ],
      keywords: [
        "sha512 hash generator",
        "sha512 online",
        "sha-512 generator",
        "sha512 hash calculator",
        "generate sha512",
      ],
      parentToolSlug: "hash-generator",
      parentToolName: "Hash Generator",
    },
    {
      slug: "md5",
      title: "MD5 Hash Generator",
      metaTitle: "MD5 Hash Generator Online — Free & Instant",
      metaDescription:
        "Generate MD5 hashes online. Fast, client-side MD5 hash calculator. Note: MD5 is not recommended for security — use SHA-256 instead.",
      h1: "MD5 Hash Generator Online",
      intro:
        "Generate MD5 hashes quickly in your browser. While MD5 is no longer recommended for cryptographic security, it remains widely used for checksums and non-security hash needs.",
      content: [
        {
          heading: "What is MD5?",
          body: "MD5 (Message Digest Algorithm 5) produces a 128-bit (16-byte) hash, displayed as a 32-character hexadecimal string. Designed by Ronald Rivest in 1991, MD5 was widely used for decades but is now considered cryptographically broken due to practical collision attacks discovered in 2004.",
        },
        {
          heading: "Should I use MD5?",
          body: "For security purposes (passwords, digital signatures, certificates), do not use MD5 — use SHA-256 or SHA-512 instead. MD5 is still acceptable for non-security uses like file checksums, cache keys, deduplication, and data partitioning where collision resistance is not critical.",
        },
      ],
      faqs: [
        {
          question: "Is MD5 secure?",
          answer:
            "No. MD5 is cryptographically broken — practical collision attacks exist. Do not use MD5 for passwords, signatures, or any security purpose. Use SHA-256 instead.",
        },
        {
          question: "Why is MD5 still used?",
          answer:
            "MD5 remains popular for non-security uses: file checksums, cache keys, data deduplication, and legacy system compatibility. It is fast and produces compact 32-character hashes.",
        },
      ],
      keywords: [
        "md5 hash generator",
        "md5 online",
        "md5 generator",
        "md5 hash calculator",
        "generate md5 hash",
        "md5 checksum",
      ],
      parentToolSlug: "hash-generator",
      parentToolName: "Hash Generator",
    },
  ],

  "json-formatter": [
    {
      slug: "minify",
      title: "JSON Minifier",
      metaTitle: "JSON Minifier Online — Compress JSON Instantly",
      metaDescription:
        "Minify and compress JSON data online. Remove whitespace, newlines, and formatting to reduce file size. Free JSON minifier tool.",
      h1: "JSON Minifier Online",
      intro:
        "Minify JSON data instantly by removing all unnecessary whitespace, newlines, and indentation. Reduce JSON payload size for faster API responses and smaller storage footprint.",
      content: [
        {
          heading: "Why minify JSON?",
          body: "Minified JSON removes all formatting whitespace while keeping the data identical. This reduces payload size by 10–40%, speeding up API responses, reducing bandwidth costs, and improving page load times. Most production APIs serve minified JSON by default. For large datasets, combining minification with Gzip or Brotli compression can reduce transfer size by over 90%.",
          codeExample: '// JavaScript — minify JSON programmatically\nconst formatted = JSON.stringify(data, null, 2); // pretty\nconst minified = JSON.stringify(data);             // compact\n\n# Command line — minify a JSON file\ncat data.json | python3 -c "import sys,json;print(json.dumps(json.load(sys.stdin)))" > min.json\n\n# jq (fastest CLI option)\njq -c . data.json > min.json',
        },
        {
          heading: "Minified vs formatted JSON",
          body: "Formatted (pretty-printed) JSON uses indentation and newlines for human readability. Minified JSON packs everything onto a single line. Both are valid JSON — parsers handle them identically. Use formatted JSON during development and minified JSON in production. Most frameworks like Express (res.json()) and Django REST Framework serve minified JSON in production mode automatically.",
        },
      ],
      faqs: [
        {
          question: "Does minifying JSON change the data?",
          answer:
            "No. Minification only removes whitespace and formatting. The data structure, values, and keys remain identical. JSON parsers produce the same result from both minified and formatted input.",
        },
        {
          question: "How much smaller is minified JSON?",
          answer:
            "Typically 10–40% smaller depending on nesting depth and key/value lengths. Deeply nested JSON with many keys sees the largest reduction.",
        },
      ],
      keywords: [
        "json minifier",
        "minify json online",
        "json compressor",
        "compress json",
        "json minify tool",
        "reduce json size",
      ],
      parentToolSlug: "json-formatter",
      parentToolName: "JSON Formatter",
    },
    {
      slug: "validate",
      title: "JSON Validator",
      metaTitle: "JSON Validator Online — Check JSON Syntax Instantly",
      metaDescription:
        "Validate JSON syntax online with detailed error messages. Find and fix JSON errors instantly. Free JSON syntax checker and validator.",
      h1: "JSON Validator Online",
      intro:
        "Validate your JSON data instantly with detailed error reporting. Paste or type JSON and get immediate feedback on syntax errors with line numbers and descriptions.",
      content: [
        {
          heading: "Common JSON syntax errors",
          body: "The most frequent JSON errors are: trailing commas after the last item in arrays or objects, single quotes instead of double quotes, unquoted keys, missing commas between items, and unclosed brackets or braces. JavaScript object syntax is not valid JSON — keys must be double-quoted strings.",
        },
        {
          heading: "JSON syntax rules",
          body: "Valid JSON must follow these rules: strings use double quotes only, keys must be double-quoted strings, no trailing commas, no comments, numbers cannot have leading zeros, and the root value must be an object or array (though modern parsers accept any JSON value).",
        },
      ],
      faqs: [
        {
          question: "What makes JSON invalid?",
          answer:
            "Common causes: trailing commas, single quotes, unquoted keys, comments, undefined/NaN values, and mismatched brackets. JSON is stricter than JavaScript object literals.",
        },
        {
          question: "Is JSON with comments valid?",
          answer:
            "No. Standard JSON (RFC 8259) does not support comments. Some parsers accept JSONC (JSON with Comments), but it is not valid JSON. Remove comments before validating.",
        },
      ],
      keywords: [
        "json validator",
        "validate json online",
        "json syntax checker",
        "json checker",
        "check json",
        "json lint",
      ],
      parentToolSlug: "json-formatter",
      parentToolName: "JSON Formatter",
    },
    {
      slug: "examples",
      title: "JSON Examples",
      metaTitle: "JSON Format Examples — Common Patterns & Templates",
      metaDescription:
        "JSON format examples for APIs, configs, and data structures. Copy-paste JSON templates for common use cases. Learn JSON syntax with practical examples.",
      h1: "JSON Format Examples & Templates",
      intro:
        "Browse common JSON format examples and templates. Copy any example directly into the formatter above to experiment with formatting, validation, and minification.",
      content: [
        {
          heading: "API response example",
          body: 'A typical REST API response wraps data in a standard envelope with status, data, and metadata fields. This pattern separates the payload from pagination info and provides a consistent structure for clients. Most frameworks like Express, FastAPI, and Spring Boot follow this convention.',
          codeExample: '{\n  "status": "success",\n  "data": {\n    "id": 1,\n    "name": "John Doe",\n    "email": "john@example.com",\n    "roles": ["admin", "user"]\n  },\n  "meta": {\n    "page": 1,\n    "total": 42,\n    "per_page": 20\n  }\n}',
        },
        {
          heading: "Configuration file example",
          body: 'JSON is widely used for configuration: package.json (Node.js), tsconfig.json (TypeScript), .eslintrc.json (ESLint), and settings.json (VS Code). These files typically use nested objects with string, number, boolean, and array values to define application behavior. Paste any config file into the formatter above to validate and beautify it.',
          codeExample: '// package.json — minimal Node.js project\n{\n  "name": "my-app",\n  "version": "1.0.0",\n  "type": "module",\n  "scripts": {\n    "dev": "next dev",\n    "build": "next build",\n    "start": "next start"\n  },\n  "dependencies": {\n    "next": "^16.0.0",\n    "react": "^19.0.0"\n  }\n}',
        },
        {
          heading: "Nested data structures",
          body: "JSON supports arbitrary nesting of objects and arrays. Common patterns include arrays of objects (database rows), nested objects (hierarchical data), and mixed structures (API responses with pagination). The formatter handles any nesting depth with proper indentation.",
          codeExample: '// Array of objects — common database/API pattern\n[\n  { "id": 1, "name": "Alice", "tags": ["admin"] },\n  { "id": 2, "name": "Bob", "tags": ["user", "editor"] }\n]\n\n// Nested hierarchy — org chart, menu, file tree\n{\n  "name": "Engineering",\n  "children": [\n    { "name": "Frontend", "children": [] },\n    { "name": "Backend", "children": [] }\n  ]\n}',
        },
      ],
      faqs: [
        {
          question: "What data types does JSON support?",
          answer:
            "JSON supports six data types: strings (double-quoted), numbers (integer or floating-point), booleans (true/false), null, objects (key-value pairs), and arrays (ordered lists).",
        },
        {
          question: "What is the maximum size of a JSON file?",
          answer:
            "JSON has no specification-defined size limit. Practical limits depend on the parser and available memory. Most APIs limit request bodies to 1–10 MB. This browser-based tool handles files up to several megabytes comfortably.",
        },
      ],
      keywords: [
        "json examples",
        "json format examples",
        "json template",
        "json sample data",
        "json syntax examples",
        "json structure examples",
      ],
      parentToolSlug: "json-formatter",
      parentToolName: "JSON Formatter",
    },
  ],

  base64: [
    {
      slug: "encode",
      title: "Base64 Encoder",
      metaTitle: "Base64 Encoder Online — Encode Text to Base64",
      metaDescription:
        "Encode text to Base64 online instantly. Supports UTF-8, Unicode, and special characters. Free Base64 encoding tool with no data uploads.",
      h1: "Base64 Encoder Online",
      intro:
        "Encode any text to Base64 format instantly. Supports full UTF-8 and Unicode characters. All encoding happens in your browser — nothing is sent to a server.",
      content: [
        {
          heading: "What is Base64 encoding?",
          body: "Base64 encoding converts binary data into a text format using 64 ASCII characters (A-Z, a-z, 0-9, +, /). It is used to safely transmit binary data through text-based protocols like email (MIME), JSON, XML, and URL query parameters. The encoded output is approximately 33% larger than the original.",
        },
        {
          heading: "When to use Base64 encoding",
          body: "Base64 is commonly used for: embedding images in HTML/CSS (data URIs), sending binary data in JSON APIs, email attachments (MIME encoding), storing binary data in text-based databases, and passing data through URL parameters. It is not encryption — Base64 is fully reversible and provides no security.",
        },
      ],
      faqs: [
        {
          question: "Is Base64 encoding the same as encryption?",
          answer:
            "No. Base64 is an encoding scheme, not encryption. Anyone can decode Base64 without a key. It is designed for data transport, not security.",
        },
        {
          question: "Why does Base64 increase file size?",
          answer:
            "Base64 represents 3 bytes of data using 4 ASCII characters, resulting in ~33% size increase. This is the trade-off for text-safe transport.",
        },
      ],
      keywords: [
        "base64 encode",
        "base64 encoder",
        "encode base64 online",
        "text to base64",
        "base64 encoding tool",
      ],
      parentToolSlug: "base64",
      parentToolName: "Base64 Codec",
    },
    {
      slug: "decode",
      title: "Base64 Decoder",
      metaTitle: "Base64 Decoder Online — Decode Base64 to Text",
      metaDescription:
        "Decode Base64 strings to plain text online. Supports UTF-8 and Unicode. Free Base64 decoder tool — private and instant.",
      h1: "Base64 Decoder Online",
      intro:
        "Decode Base64-encoded strings back to readable text instantly. Paste any Base64 string and get the decoded output. All processing happens locally in your browser.",
      content: [
        {
          heading: "How Base64 decoding works",
          body: "Base64 decoding reverses the encoding process: each group of 4 Base64 characters is converted back to 3 bytes of original data. Padding characters (=) at the end indicate the number of missing bytes. The decoded output is the exact original binary data.",
        },
        {
          heading: "Troubleshooting Base64 decode errors",
          body: "Common decode errors: the input contains characters outside the Base64 alphabet, incorrect padding, or the string was URL-safe Base64 (using - and _ instead of + and /). This tool handles standard Base64 and will flag invalid input with clear error messages.",
        },
      ],
      faqs: [
        {
          question: "Why is my Base64 string not decoding correctly?",
          answer:
            "Check for URL-safe Base64 (- and _ instead of + and /), missing padding (= characters), extra whitespace, or non-Base64 characters in the input.",
        },
        {
          question: "Can Base64 decode binary files?",
          answer:
            "Yes. Base64 can encode any binary data. This text tool decodes to text (UTF-8). For binary files like images, use a specialized Base64-to-file converter.",
        },
      ],
      keywords: [
        "base64 decode",
        "base64 decoder",
        "decode base64 online",
        "base64 to text",
        "base64 decoding tool",
      ],
      parentToolSlug: "base64",
      parentToolName: "Base64 Codec",
    },
    {
      slug: "image",
      title: "Base64 Image Encoder",
      metaTitle: "Base64 Image Encoder Online — Convert Images to Base64",
      metaDescription:
        "Convert images to Base64 data URIs online. Encode PNG, JPEG, GIF, SVG, and WebP images to Base64 for embedding in HTML, CSS, and JSON.",
      h1: "Base64 Image Encoder Online",
      intro:
        "Convert images to Base64 data URIs for embedding directly in HTML, CSS, or JSON. Supports all common image formats. Processing happens entirely in your browser.",
      content: [
        {
          heading: "Why encode images as Base64?",
          body: "Base64-encoded images can be embedded directly in HTML (<img src=\"data:image/png;base64,...\">) or CSS (background-image: url(data:...)). This eliminates an HTTP request, which can improve page load times for small images. Icons, logos, and small UI graphics are common candidates.",
        },
        {
          heading: "When not to use Base64 images",
          body: "Base64 increases size by ~33% and prevents browser caching. For images larger than 5–10 KB, regular image files with proper caching are usually more efficient. Base64 is best for small icons, simple logos, and inline SVGs under 5 KB.",
        },
      ],
      faqs: [
        {
          question: "What image formats can be encoded to Base64?",
          answer:
            "Any image format can be Base64-encoded: PNG, JPEG, GIF, SVG, WebP, BMP, ICO, and more. The format is preserved in the data URI MIME type.",
        },
        {
          question: "Does Base64 encoding reduce image quality?",
          answer:
            "No. Base64 is a lossless encoding — the image data is preserved exactly. The only difference is the text representation and the ~33% size increase.",
        },
      ],
      keywords: [
        "base64 image encoder",
        "image to base64",
        "convert image base64",
        "base64 image online",
        "data uri generator",
        "embed image base64",
      ],
      parentToolSlug: "base64",
      parentToolName: "Base64 Codec",
    },
  ],

  "uuid-generator": [
    {
      slug: "v4",
      title: "UUID v4 Generator",
      metaTitle: "UUID v4 Generator Online — Random UUID Generator",
      metaDescription:
        "Generate random UUID v4 identifiers online. Cryptographically random, RFC 4122 compliant. Free UUID v4 generator with bulk mode.",
      h1: "UUID v4 Generator Online",
      intro:
        "Generate cryptographically random UUID v4 identifiers instantly. Each UUID is generated using your browser's secure random number generator, ensuring true randomness.",
      content: [
        {
          heading: "What is UUID v4?",
          body: "UUID v4 (Universally Unique Identifier version 4) is a 128-bit identifier generated using random or pseudo-random numbers. It follows the format xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx, where 4 indicates version 4 and y is constrained to 8, 9, A, or B. With 2^122 possible values, the probability of generating a duplicate is negligibly small.",
        },
        {
          heading: "UUID versions compared",
          body: "UUID v1 uses MAC address + timestamp (can leak hardware info). UUID v4 uses pure randomness (most popular). UUID v5 uses namespace + name hashing (deterministic). UUID v7 (newer) uses timestamp + random (sortable). For most applications, UUID v4 is the standard choice.",
        },
      ],
      faqs: [
        {
          question: "Can UUID v4 have collisions?",
          answer:
            "Theoretically yes, but practically no. With 2^122 possible UUIDs, you would need to generate 2.7 quintillion UUIDs to have a 50% chance of one collision. It is safe to treat them as unique.",
        },
        {
          question: "Is UUID v4 sequential or sortable?",
          answer:
            "No. UUID v4 is purely random and not sortable by creation time. If you need time-sortable UUIDs, consider UUID v7 or ULID.",
        },
      ],
      keywords: [
        "uuid v4 generator",
        "uuid v4",
        "random uuid generator",
        "generate uuid v4",
        "uuid version 4",
        "uuid4 generator",
      ],
      parentToolSlug: "uuid-generator",
      parentToolName: "UUID Generator",
    },
    {
      slug: "bulk",
      title: "Bulk UUID Generator",
      metaTitle: "Bulk UUID Generator — Generate Multiple UUIDs at Once",
      metaDescription:
        "Generate multiple UUIDs at once. Bulk UUID v4 generator for databases, testing, and seed data. Generate up to 1000 UUIDs instantly.",
      h1: "Bulk UUID Generator",
      intro:
        "Generate multiple UUID v4 identifiers at once. Perfect for seeding databases, creating test fixtures, and populating spreadsheets. All generated client-side with cryptographic randomness.",
      content: [
        {
          heading: "When you need bulk UUIDs",
          body: "Bulk UUID generation is common for: seeding databases with test data, generating unique identifiers for CSV imports, creating test fixtures for automated testing, populating mock APIs, and assigning IDs to batch-imported records. Generate exactly the number you need and copy them all at once.",
          codeExample: '-- SQL: Insert bulk UUIDs as seed data\nINSERT INTO users (id, name) VALUES\n  (\'550e8400-e29b-41d4-a716-446655440000\', \'Alice\'),\n  (\'6ba7b810-9dad-11d1-80b4-00c04fd430c8\', \'Bob\');\n\n// JavaScript: generate UUIDs in code\nconst ids = Array.from({ length: 100 }, () => crypto.randomUUID());',
        },
        {
          heading: "Output formats",
          body: "Copy bulk UUIDs as a newline-separated list (one per line), comma-separated values, or a JSON array. Choose the format that matches your use case — paste directly into SQL INSERT statements, CSV files, or JSON fixtures. The JSON array format works directly with most API testing tools like Postman and Insomnia.",
        },
      ],
      faqs: [
        {
          question: "How many UUIDs can I generate at once?",
          answer:
            "This tool generates up to 1000 UUIDs per batch. For larger needs, generate multiple batches. All generation happens instantly in your browser.",
        },
        {
          question: "Are bulk-generated UUIDs guaranteed unique?",
          answer:
            "Yes, for all practical purposes. Each UUID is generated independently using the browser's cryptographic random number generator. The probability of any collision is astronomically small.",
        },
      ],
      keywords: [
        "bulk uuid generator",
        "generate multiple uuids",
        "batch uuid generator",
        "mass uuid generator",
        "uuid list generator",
      ],
      parentToolSlug: "uuid-generator",
      parentToolName: "UUID Generator",
    },
  ],

  "jwt-decoder": [
    {
      slug: "examples",
      title: "JWT Token Examples",
      metaTitle: "JWT Token Examples — Common JWT Claims & Payloads",
      metaDescription:
        "JWT token examples with common claims and payload structures. Learn JWT format with practical examples for authentication, authorization, and API tokens.",
      h1: "JWT Token Examples & Common Claims",
      intro:
        "Explore common JWT token examples and payload structures. Paste any example into the decoder above to inspect its header, payload, and claims in detail.",
      content: [
        {
          heading: "Standard JWT claims",
          body: "JWT defines several registered claims: iss (issuer), sub (subject), aud (audience), exp (expiration time), nbf (not before), iat (issued at), and jti (JWT ID). These are not required but are widely used conventions. Custom claims can be added for application-specific data like user roles, permissions, and email.",
        },
        {
          heading: "Authentication token example",
          body: "A typical auth JWT contains: header with algorithm (HS256 or RS256), payload with sub (user ID), email, roles/permissions, iat (issued timestamp), and exp (expiration). The signature ensures the token has not been tampered with. Access tokens typically expire in 15–60 minutes.",
        },
        {
          heading: "Common JWT header algorithms",
          body: "HS256 (HMAC-SHA256) uses a shared secret — simple but requires the secret on both sides. RS256 (RSA-SHA256) uses public/private key pairs — more secure for distributed systems. ES256 (ECDSA) is similar to RS256 but with smaller keys. Most APIs use RS256 for public key verification.",
        },
      ],
      faqs: [
        {
          question: "What are the three parts of a JWT?",
          answer:
            "A JWT has three Base64url-encoded parts separated by dots: the Header (algorithm and type), the Payload (claims/data), and the Signature (verification hash). Example: xxxxx.yyyyy.zzzzz",
        },
        {
          question: "Should I store sensitive data in JWT?",
          answer:
            "No. JWT payloads are only Base64-encoded, not encrypted. Anyone can decode and read the payload. Never store passwords, credit card numbers, or other secrets in JWT claims.",
        },
      ],
      keywords: [
        "jwt examples",
        "jwt token example",
        "jwt claims",
        "jwt payload example",
        "jwt format",
        "jwt structure example",
      ],
      parentToolSlug: "jwt-decoder",
      parentToolName: "JWT Decoder",
    },
    {
      slug: "structure",
      title: "JWT Structure Explained",
      metaTitle: "JWT Structure Explained — Header, Payload & Signature",
      metaDescription:
        "Understand JWT structure: header, payload, and signature. Learn how JSON Web Tokens work with visual breakdown and practical examples.",
      h1: "JWT Structure Explained",
      intro:
        "A JSON Web Token consists of three parts: Header, Payload, and Signature. Paste any JWT into the decoder above to see each part broken down with syntax highlighting.",
      content: [
        {
          heading: "JWT Header",
          body: "The header is a JSON object with two fields: \"alg\" (the signing algorithm, e.g., HS256, RS256) and \"typ\" (token type, always \"JWT\"). It is Base64url-encoded to form the first part of the token. The header tells the receiver how to verify the signature.",
        },
        {
          heading: "JWT Payload",
          body: "The payload contains the claims — statements about the user and metadata. Claims come in three types: Registered claims (iss, sub, exp — standardized by RFC 7519), Public claims (defined in the IANA JSON Web Token registry), and Private claims (custom application-specific claims agreed upon between parties).",
        },
        {
          heading: "JWT Signature",
          body: "The signature is created by taking the encoded header, encoded payload, a secret or private key, and the algorithm specified in the header. For HMAC: HMACSHA256(base64UrlEncode(header) + \".\" + base64UrlEncode(payload), secret). The signature verifies the token was not altered and, with asymmetric algorithms, verifies the sender's identity.",
        },
      ],
      faqs: [
        {
          question: "Can I decode a JWT without the secret key?",
          answer:
            "Yes. The header and payload are only Base64url-encoded, not encrypted. You can decode and read them without any key. The secret key is only needed to verify the signature.",
        },
        {
          question: "What happens if a JWT is expired?",
          answer:
            "An expired JWT (current time past the \"exp\" claim) should be rejected by the server. The token is still decodable, but the server should not trust its claims. Clients should request a new token using a refresh token.",
        },
      ],
      keywords: [
        "jwt structure",
        "jwt header payload signature",
        "how jwt works",
        "jwt format explained",
        "json web token structure",
        "jwt anatomy",
      ],
      parentToolSlug: "jwt-decoder",
      parentToolName: "JWT Decoder",
    },
  ],

  "regex-tester": [
    {
      slug: "email",
      title: "Email Regex Pattern",
      metaTitle: "Email Regex Pattern & Tester — Validate Email Addresses",
      metaDescription:
        "Test and validate email regex patterns online. Copy battle-tested email validation regex for JavaScript, Python, and PHP. Free email regex tester.",
      h1: "Email Regex Pattern & Tester",
      intro:
        "Test email validation regex patterns with real-time highlighting. Copy a battle-tested email regex pattern or build your own and test it against sample email addresses.",
      content: [
        {
          heading: "Simple email regex",
          body: "A practical email regex for most use cases: ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$ — this matches standard email formats with alphanumeric characters, common special characters in the local part, and a domain with a TLD of 2+ characters. It covers 99% of real-world email addresses.",
        },
        {
          heading: "Why perfect email regex is impossible",
          body: "The official email specification (RFC 5322) allows extremely unusual addresses like \"quoted strings\"@domain, (comments)user@domain, and even IP addresses as domains. A truly RFC-compliant regex is thousands of characters long and impractical. In practice, use a simple regex for basic validation, then verify with a confirmation email.",
        },
      ],
      faqs: [
        {
          question: "What is the best email regex?",
          answer:
            "For most applications: ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$ — it balances strictness with real-world compatibility. For production, pair it with a confirmation email for true validation.",
        },
        {
          question: "Should I validate emails with regex alone?",
          answer:
            "No. Regex can check format, but cannot verify the email exists or is deliverable. Always send a confirmation email for true validation. Use regex only as a first-pass filter.",
        },
      ],
      keywords: [
        "email regex",
        "email validation regex",
        "email regex pattern",
        "regex for email",
        "validate email regex",
        "email regex javascript",
      ],
      parentToolSlug: "regex-tester",
      parentToolName: "Regex Tester",
    },
    {
      slug: "phone",
      title: "Phone Number Regex",
      metaTitle: "Phone Number Regex Pattern & Tester — Validate Phone Numbers",
      metaDescription:
        "Test phone number regex patterns online. Regex patterns for US, international, and formatted phone numbers. Free phone regex tester.",
      h1: "Phone Number Regex Pattern & Tester",
      intro:
        "Test phone number validation regex patterns with real-time matching. Copy regex patterns for US numbers, international formats, and various phone number styles.",
      content: [
        {
          heading: "US phone number regex",
          body: "Match US phone numbers in various formats: ^\\+?1?[-.\\s]?\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}$ — this handles formats like (555) 123-4567, 555-123-4567, +1 555 123 4567, and 5551234567. It allows optional country code, parentheses, hyphens, dots, and spaces as separators between digit groups.",
          codeExample: '// JavaScript — validate US phone numbers\nconst usPhone = /^\\+?1?[-.\\s]?\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}$/;\n\nusPhone.test("(555) 123-4567");   // true\nusPhone.test("555-123-4567");      // true\nusPhone.test("+1 555 123 4567");   // true\nusPhone.test("5551234567");        // true\n\n# Python\nimport re\npattern = r"^\\+?1?[-.\\s]?\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}$"\nre.match(pattern, "(555) 123-4567")  # Match',
        },
        {
          heading: "International phone number regex",
          body: "For international numbers: ^\\+[1-9]\\d{1,14}$ (E.164 format) matches numbers like +14155551234 and +442071234567. For user-facing input that allows formatting: ^\\+?\\d{1,4}[-.\\s]?\\(?\\d{1,4}\\)?[-.\\s]?[\\d-.\\s]{4,15}$ handles most international formats with optional formatting characters. For production validation, consider using the libphonenumber library instead of regex alone.",
          codeExample: '// E.164 format — the international standard for phone storage\nconst e164 = /^\\+[1-9]\\d{1,14}$/;\n\ne164.test("+14155551234");    // true  (US)\ne164.test("+442071234567");   // true  (UK)\ne164.test("+81312345678");    // true  (Japan)\ne164.test("14155551234");     // false (missing +)',
        },
      ],
      faqs: [
        {
          question: "What regex matches all phone number formats?",
          answer:
            "No single regex perfectly matches all global phone formats. For best results, use E.164 format (^\\+[1-9]\\d{1,14}$) as a storage standard, and a lenient regex for input validation. Libraries like libphonenumber provide the most accurate validation.",
        },
        {
          question: "How do I validate phone numbers in JavaScript?",
          answer:
            "Use regex for basic format checking: /^\\+?1?[-.\\s]?\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}$/.test(phone). For production validation, use the google-libphonenumber library which handles international formats and carrier validation.",
        },
      ],
      keywords: [
        "phone number regex",
        "phone regex",
        "regex phone number",
        "phone validation regex",
        "us phone regex",
        "international phone regex",
      ],
      parentToolSlug: "regex-tester",
      parentToolName: "Regex Tester",
    },
    {
      slug: "cheat-sheet",
      title: "Regex Cheat Sheet",
      metaTitle: "Regex Cheat Sheet — Quick Reference for Regular Expressions",
      metaDescription:
        "Regex cheat sheet with all patterns, quantifiers, anchors, and groups. Quick reference for regular expressions in JavaScript, Python, and more.",
      h1: "Regex Cheat Sheet & Quick Reference",
      intro:
        "A quick reference for regular expression syntax. Test any pattern from this cheat sheet in the regex tester above with real-time match highlighting.",
      content: [
        {
          heading: "Character classes",
          body: "\\d — digit (0-9), \\D — non-digit, \\w — word character (a-z, A-Z, 0-9, _), \\W — non-word character, \\s — whitespace (space, tab, newline), \\S — non-whitespace, . — any character (except newline), [abc] — character set (a, b, or c), [^abc] — negated set (not a, b, or c), [a-z] — range (a through z).",
        },
        {
          heading: "Quantifiers",
          body: "* — zero or more, + — one or more, ? — zero or one (optional), {3} — exactly 3, {3,} — 3 or more, {3,5} — between 3 and 5. By default quantifiers are greedy (match as much as possible). Add ? for lazy matching: *?, +?, ?? (match as little as possible).",
        },
        {
          heading: "Anchors and groups",
          body: "^ — start of string, $ — end of string, \\b — word boundary. Groups: (abc) — capturing group, (?:abc) — non-capturing group, (?=abc) — positive lookahead, (?!abc) — negative lookahead, (?<=abc) — positive lookbehind, (?<!abc) — negative lookbehind. Backreferences: \\1, \\2 refer to captured groups.",
        },
      ],
      faqs: [
        {
          question: "What does \\b mean in regex?",
          answer:
            "\\b matches a word boundary — the position between a word character (\\w) and a non-word character. For example, \\bcat\\b matches \"cat\" in \"the cat sat\" but not in \"scatter\".",
        },
        {
          question: "What is the difference between * and + in regex?",
          answer:
            "* matches zero or more occurrences (the preceding element is optional). + matches one or more (at least one occurrence required). For example, a* matches \"\" and \"aaa\", while a+ matches \"a\" and \"aaa\" but not \"\".",
        },
      ],
      keywords: [
        "regex cheat sheet",
        "regex reference",
        "regex quick reference",
        "regular expression cheat sheet",
        "regex syntax",
        "regex guide",
      ],
      parentToolSlug: "regex-tester",
      parentToolName: "Regex Tester",
    },
  ],

  "password-generator": [
    {
      slug: "strong",
      title: "Strong Password Generator",
      metaTitle: "Strong Password Generator — Secure Random Passwords",
      metaDescription:
        "Generate strong, secure random passwords online. Customize length, characters, and complexity. All passwords generated locally in your browser.",
      h1: "Strong Password Generator",
      intro:
        "Generate cryptographically strong passwords instantly. Every password is created using your browser's secure random number generator — nothing is transmitted or stored.",
      content: [
        {
          heading: "What makes a password strong?",
          body: "A strong password has three properties: length (16+ characters), randomness (not based on dictionary words or personal info), and character diversity (uppercase, lowercase, digits, symbols). A truly random 16-character password with all character types would take billions of years to brute-force with current technology.",
        },
        {
          heading: "Password length recommendations",
          body: "NIST recommends passwords of at least 8 characters, but security experts recommend 16+ for important accounts. Each additional character exponentially increases the time to crack: a 12-character random password has ~71 bits of entropy, while 16 characters has ~95 bits. For maximum security, use 20+ characters.",
        },
      ],
      faqs: [
        {
          question: "How long should a strong password be?",
          answer:
            "At minimum 12 characters, ideally 16+. With a mix of uppercase, lowercase, digits, and symbols, a 16-character password has approximately 95 bits of entropy — effectively uncrackable by brute force.",
        },
        {
          question: "Are generated passwords truly random?",
          answer:
            "Yes. This tool uses the Web Crypto API (crypto.getRandomValues), the same cryptographic random number generator used for TLS encryption. The randomness is suitable for security-critical applications.",
        },
      ],
      keywords: [
        "strong password generator",
        "secure password generator",
        "random password generator",
        "password generator online",
        "generate strong password",
        "complex password generator",
      ],
      parentToolSlug: "password-generator",
      parentToolName: "Password Generator",
    },
    {
      slug: "pin",
      title: "Random PIN Generator",
      metaTitle: "Random PIN Generator Online — Generate Secure PINs",
      metaDescription:
        "Generate random PINs online — 4-digit, 6-digit, or custom length. Cryptographically secure random PIN generator for cards, locks, and 2FA.",
      h1: "Random PIN Generator",
      intro:
        "Generate cryptographically secure random PINs for bank cards, door locks, phone unlock codes, and two-factor authentication. All PINs are generated locally in your browser.",
      content: [
        {
          heading: "PIN security by length",
          body: "A 4-digit PIN has 10,000 possible combinations — easily brute-forced but standard for bank cards (which have attempt limits). A 6-digit PIN has 1,000,000 combinations — used by most 2FA apps. An 8-digit PIN has 100,000,000 combinations. Always rely on attempt limits and lockouts in addition to PIN length.",
        },
        {
          heading: "PINs to avoid",
          body: "Avoid sequential PINs (1234, 4321), repeated digits (0000, 1111), dates (birth year, anniversary), and common patterns (2580 — middle column on a keypad). Researchers found that just 20 common PINs account for 27% of all 4-digit PINs in use.",
        },
      ],
      faqs: [
        {
          question: "Is a 4-digit PIN secure?",
          answer:
            "On its own, no — 10,000 combinations can be brute-forced quickly. But systems using 4-digit PINs (bank cards, phones) add lockouts after failed attempts, making the PIN effective. For unrestricted systems, use 6+ digits.",
        },
        {
          question: "What is the most common PIN?",
          answer:
            "1234 is the most commonly used 4-digit PIN, followed by 1111, 0000, and 1212. These should always be avoided. A randomly generated PIN avoids these predictable patterns.",
        },
      ],
      keywords: [
        "pin generator",
        "random pin generator",
        "4 digit pin generator",
        "6 digit pin generator",
        "generate random pin",
        "secure pin generator",
      ],
      parentToolSlug: "password-generator",
      parentToolName: "Password Generator",
    },
  ],

  "epoch-converter": [
    {
      slug: "current",
      title: "Current Unix Timestamp",
      metaTitle: "Current Unix Timestamp — Live Epoch Time Now",
      metaDescription:
        "See the current Unix timestamp (epoch time) updating live. Convert the current time to seconds and milliseconds since January 1, 1970.",
      h1: "Current Unix Timestamp",
      intro:
        "The current Unix timestamp is displayed live below. Convert it to human-readable dates or convert any date to its Unix timestamp using the converter tool.",
      content: [
        {
          heading: "What is Unix time?",
          body: "Unix time (also called epoch time or POSIX time) counts the number of seconds elapsed since January 1, 1970, 00:00:00 UTC — known as the Unix epoch. It is used universally in programming for timestamp storage, date arithmetic, and cross-timezone coordination because it is timezone-independent.",
        },
        {
          heading: "Unix timestamp in different languages",
          body: "Get the current timestamp: JavaScript — Date.now() or Math.floor(Date.now() / 1000), Python — import time; time.time(), PHP — time(), Java — System.currentTimeMillis() / 1000, Ruby — Time.now.to_i, Go — time.Now().Unix(), Bash — date +%s.",
        },
      ],
      faqs: [
        {
          question: "What is the current Unix timestamp?",
          answer:
            "The current Unix timestamp updates every second. Use the live display on this page or run Date.now() in your browser console to get the current millisecond timestamp.",
        },
        {
          question: "What is the Year 2038 problem?",
          answer:
            "32-bit systems store Unix time as a signed 32-bit integer, which overflows on January 19, 2038. Most modern systems use 64-bit timestamps, which won't overflow for 292 billion years.",
        },
      ],
      keywords: [
        "current unix timestamp",
        "current epoch time",
        "unix time now",
        "epoch time now",
        "current timestamp",
        "unix timestamp now",
      ],
      parentToolSlug: "epoch-converter",
      parentToolName: "Epoch Converter",
    },
    {
      slug: "milliseconds",
      title: "Epoch Milliseconds Converter",
      metaTitle: "Epoch Milliseconds Converter — Convert ms Timestamps",
      metaDescription:
        "Convert epoch timestamps in milliseconds to dates and back. Handles both second and millisecond Unix timestamps. Free epoch ms converter.",
      h1: "Epoch Milliseconds Converter",
      intro:
        "Convert between millisecond-precision Unix timestamps and human-readable dates. JavaScript and Java use millisecond timestamps (13 digits), while Unix and Python default to seconds (10 digits).",
      content: [
        {
          heading: "Seconds vs milliseconds",
          body: "Unix timestamps come in two common formats: seconds since epoch (10 digits, e.g., 1710720000) and milliseconds since epoch (13 digits, e.g., 1710720000000). JavaScript's Date.now() returns milliseconds. Python's time.time() returns seconds with decimal. This converter handles both formats automatically.",
        },
        {
          heading: "Converting between seconds and milliseconds",
          body: "Seconds to milliseconds: multiply by 1000. Milliseconds to seconds: divide by 1000 and floor. Quick detection: if the timestamp has 13 digits, it is likely milliseconds; 10 digits means seconds. Timestamps in the billions (1,000,000,000+) are seconds after 2001; in the trillions (1,000,000,000,000+) are milliseconds.",
        },
      ],
      faqs: [
        {
          question: "How do I tell if a timestamp is seconds or milliseconds?",
          answer:
            "Count the digits: 10 digits = seconds (e.g., 1710720000), 13 digits = milliseconds (e.g., 1710720000000). Values above 1 trillion are always milliseconds.",
        },
        {
          question: "Why does JavaScript use milliseconds?",
          answer:
            "JavaScript's Date object was designed for browser precision where sub-second timing matters (animations, events). Date.now() returns milliseconds for consistency with Date.getTime() and setTimeout/setInterval.",
        },
      ],
      keywords: [
        "epoch milliseconds",
        "unix timestamp milliseconds",
        "convert epoch ms",
        "milliseconds to date",
        "date to milliseconds",
        "epoch ms converter",
      ],
      parentToolSlug: "epoch-converter",
      parentToolName: "Epoch Converter",
    },
  ],

  "color-converter": [
    {
      slug: "hex-to-rgb",
      title: "HEX to RGB Converter",
      metaTitle: "HEX to RGB Converter Online — Convert Color Codes",
      metaDescription:
        "Convert HEX color codes to RGB values online. Instant HEX to RGB conversion with color preview. Free color code converter.",
      h1: "HEX to RGB Converter",
      intro:
        "Convert HEX color codes to RGB values instantly. Enter a HEX code like #FF5733 and get the RGB equivalent (255, 87, 51). See a live color preview as you type.",
      content: [
        {
          heading: "How HEX to RGB conversion works",
          body: "A HEX color code like #FF5733 contains three pairs of hexadecimal digits: FF (red = 255), 57 (green = 87), 33 (blue = 51). Each pair converts from base-16 to a decimal value between 0–255. The conversion formula: R = parseInt(hex.substr(0,2), 16), G = parseInt(hex.substr(2,2), 16), B = parseInt(hex.substr(4,2), 16).",
        },
        {
          heading: "When to use RGB vs HEX",
          body: "HEX codes are compact (#FF5733) and standard in web design. RGB notation — rgb(255, 87, 51) — is more readable and supports an alpha channel as rgba(255, 87, 51, 0.5). Use HEX in CSS shorthand and design tools; use RGB/RGBA when you need transparency or programmatic color manipulation.",
        },
      ],
      faqs: [
        {
          question: "What is the RGB equivalent of #000000?",
          answer: "rgb(0, 0, 0) — pure black. Each hex pair (00) converts to decimal 0.",
        },
        {
          question: "Can HEX codes have transparency?",
          answer:
            "Yes. 8-digit HEX codes include alpha: #FF573380 where 80 (hex) = 128 (decimal) = 50% opacity. Not all tools support 8-digit HEX; RGBA is more widely compatible.",
        },
      ],
      keywords: [
        "hex to rgb",
        "hex to rgb converter",
        "convert hex to rgb",
        "hex color to rgb",
        "hex rgb converter",
        "color code converter",
      ],
      parentToolSlug: "color-converter",
      parentToolName: "Color Converter",
    },
    {
      slug: "rgb-to-hex",
      title: "RGB to HEX Converter",
      metaTitle: "RGB to HEX Converter Online — Convert Color Values",
      metaDescription:
        "Convert RGB color values to HEX codes online. Enter RGB values (0-255) and get the HEX color code. Free RGB to HEX converter.",
      h1: "RGB to HEX Converter",
      intro:
        "Convert RGB color values to HEX codes instantly. Enter red, green, and blue values (0–255) and get the corresponding HEX code with a live color preview.",
      content: [
        {
          heading: "How RGB to HEX conversion works",
          body: "Each RGB value (0–255) is converted to a two-digit hexadecimal number. Red 255 → FF, Green 87 → 57, Blue 51 → 33, combined as #FF5733. The formula converts each decimal channel to base-16 and pads single-digit results with a leading zero.",
          codeExample: '// JavaScript — RGB to HEX\nfunction rgbToHex(r, g, b) {\n  return "#" + [r, g, b]\n    .map(v => v.toString(16).padStart(2, "0"))\n    .join("");\n}\nrgbToHex(255, 87, 51); // "#ff5733"\n\n# Python\ndef rgb_to_hex(r, g, b):\n    return f"#{r:02x}{g:02x}{b:02x}"\nrgb_to_hex(255, 87, 51)  # "#ff5733"\n\n/* CSS — both formats are equivalent */\ncolor: rgb(255, 87, 51);\ncolor: #ff5733;',
        },
        {
          heading: "Shorthand HEX codes",
          body: "When each hex pair has identical digits (e.g., #AABBCC), the code can be shortened to #ABC. However, #FF5733 cannot be shortened because 57 and 33 have different digits. CSS supports both 3-digit and 6-digit HEX codes. Modern CSS also supports 8-digit hex for alpha transparency: #FF573380 is 50% transparent.",
        },
      ],
      faqs: [
        {
          question: "How do I convert RGB 255, 0, 0 to HEX?",
          answer:
            "RGB(255, 0, 0) = #FF0000. Red: 255 → FF, Green: 0 → 00, Blue: 0 → 00. This is pure red.",
        },
        {
          question: "What is the HEX code for white?",
          answer:
            "#FFFFFF — all channels at maximum (RGB 255, 255, 255). In shorthand: #FFF.",
        },
      ],
      keywords: [
        "rgb to hex",
        "rgb to hex converter",
        "convert rgb to hex",
        "rgb hex converter",
        "color rgb to hex",
        "rgb color code",
      ],
      parentToolSlug: "color-converter",
      parentToolName: "Color Converter",
    },
    {
      slug: "hex-to-hsl",
      title: "HEX to HSL Converter",
      metaTitle: "HEX to HSL Converter Online — Convert Color Codes",
      metaDescription:
        "Convert HEX color codes to HSL values online. Instant HEX to HSL conversion with color preview. Understand hue, saturation, and lightness.",
      h1: "HEX to HSL Converter",
      intro:
        "Convert HEX color codes to HSL (Hue, Saturation, Lightness) values. HSL is more intuitive for designers — easily adjust brightness and saturation without changing the base color.",
      content: [
        {
          heading: "What is HSL?",
          body: "HSL represents colors using three components: Hue (0–360°, the color wheel position), Saturation (0–100%, color intensity), and Lightness (0–100%, brightness). It is more intuitive than RGB for color manipulation — to lighten a color, just increase L; to desaturate, decrease S; to shift the hue, change H.",
        },
        {
          heading: "HSL vs RGB for web design",
          body: "HSL is ideal for creating color palettes and themes. To generate shades of a color, keep H and S fixed while varying L. To create complementary colors, add 180° to H. CSS supports hsl() natively: hsl(14, 100%, 60%) is equivalent to #FF5733 and rgb(255, 87, 51).",
        },
      ],
      faqs: [
        {
          question: "What is the HSL value for pure red?",
          answer:
            "hsl(0, 100%, 50%) — Hue 0° (red), full saturation, 50% lightness. This equals #FF0000 / rgb(255, 0, 0).",
        },
        {
          question: "How do I darken a color with HSL?",
          answer:
            "Reduce the Lightness (L) value. For example, hsl(14, 100%, 60%) is a bright orange-red; hsl(14, 100%, 30%) is the same hue, much darker. This is much easier than adjusting RGB values manually.",
        },
      ],
      keywords: [
        "hex to hsl",
        "hex to hsl converter",
        "convert hex to hsl",
        "hex hsl converter",
        "color hex to hsl",
        "hsl color converter",
      ],
      parentToolSlug: "color-converter",
      parentToolName: "Color Converter",
    },
  ],

  "url-encoder": [
    {
      slug: "encode",
      title: "URL Encoder",
      metaTitle: "URL Encoder Online — Encode URLs & Special Characters",
      metaDescription:
        "Encode URLs and special characters online. Convert spaces, symbols, and Unicode to percent-encoded format. Free URL encoding tool.",
      h1: "URL Encoder Online",
      intro:
        "Encode text for safe use in URLs. Converts spaces, symbols, and special characters to percent-encoded format (e.g., space → %20, & → %26).",
      content: [
        {
          heading: "What is URL encoding?",
          body: "URL encoding (percent-encoding) replaces unsafe ASCII characters with a % followed by two hex digits. For example, space becomes %20, & becomes %26, and = becomes %3D. This is required because URLs can only contain a limited set of characters (RFC 3986). Characters like &, =, ?, and # have special meaning in URLs and must be encoded when used as data.",
        },
        {
          heading: "encodeURIComponent vs encodeURI",
          body: "JavaScript provides two functions: encodeURIComponent() encodes everything except A-Z, a-z, 0-9, -, _, ., ~. Use it for query parameter values. encodeURI() preserves URL-structural characters (:, /, ?, #, &, =). Use it for complete URLs where you want to keep the structure intact.",
        },
      ],
      faqs: [
        {
          question: "When should I URL-encode?",
          answer:
            "Always encode user input placed in URLs: query parameters, path segments, and fragment identifiers. This prevents injection attacks and ensures special characters are transmitted correctly.",
        },
        {
          question: "Is %20 the same as +?",
          answer:
            "In query strings, + traditionally represents a space (application/x-www-form-urlencoded). In path segments and modern APIs, %20 is standard. Both decode to a space, but %20 is more universally correct.",
        },
      ],
      keywords: [
        "url encode",
        "url encoder",
        "url encode online",
        "percent encoding",
        "encode url characters",
        "url encoding tool",
      ],
      parentToolSlug: "url-encoder",
      parentToolName: "URL Encoder & Decoder",
    },
    {
      slug: "decode",
      title: "URL Decoder",
      metaTitle: "URL Decoder Online — Decode Percent-Encoded URLs",
      metaDescription:
        "Decode percent-encoded URLs online. Convert %20, %26, and other encoded characters back to readable text. Free URL decoding tool.",
      h1: "URL Decoder Online",
      intro:
        "Decode percent-encoded URLs back to readable text. Converts %20 to spaces, %26 to &, and all other percent-encoded sequences to their original characters.",
      content: [
        {
          heading: "How URL decoding works",
          body: "URL decoding reverses percent-encoding: each %XX sequence is replaced with the character whose ASCII/UTF-8 value matches the hex digits XX. For example, %20 → space (ASCII 32), %26 → & (ASCII 38), %C3%A9 → é (UTF-8 two-byte sequence). The + character is also decoded to space in query string context.",
        },
        {
          heading: "Common encoded characters",
          body: "Frequently seen encodings: %20 (space), %21 (!), %23 (#), %24 ($), %25 (%), %26 (&), %2B (+), %2F (/), %3A (:), %3D (=), %3F (?), %40 (@). Double-encoded URLs (e.g., %2520 for space) indicate the URL was encoded twice and needs to be decoded twice.",
        },
      ],
      faqs: [
        {
          question: "What does %20 mean in a URL?",
          answer:
            "% 20 is the percent-encoded representation of a space character. URLs cannot contain literal spaces, so they are encoded as %20 (or + in query strings).",
        },
        {
          question: "Why is my URL double-encoded?",
          answer:
            "Double encoding (e.g., %2520 instead of %20) happens when an already-encoded URL is encoded again. This is a common bug — ensure you only encode raw values, not already-encoded strings.",
        },
      ],
      keywords: [
        "url decode",
        "url decoder",
        "url decode online",
        "decode url",
        "percent decode",
        "url decoding tool",
      ],
      parentToolSlug: "url-encoder",
      parentToolName: "URL Encoder & Decoder",
    },
  ],
};

function mergeBatches(
  ...batches: Record<string, ToolSubpage[]>[]
): Record<string, ToolSubpage[]> {
  const result: Record<string, ToolSubpage[]> = {};
  for (const batch of batches) {
    for (const [key, pages] of Object.entries(batch)) {
      result[key] = [...(result[key] || []), ...pages];
    }
  }
  return result;
}

export const toolSubpages: Record<string, ToolSubpage[]> = mergeBatches(
  coreSubpages,
  batch1Subpages,
  batch2Subpages,
  batch3Subpages,
  batch4Subpages,
  batch5Subpages,
  batch6Subpages,
);

/** Get all sub-page slugs for sitemap generation */
export function getAllSubpages(): Array<{
  toolSlug: string;
  subpageSlug: string;
}> {
  const result: Array<{ toolSlug: string; subpageSlug: string }> = [];
  for (const [toolSlug, subpages] of Object.entries(toolSubpages)) {
    for (const sp of subpages) {
      result.push({ toolSlug, subpageSlug: sp.slug });
    }
  }
  return result;
}

/** Find a specific sub-page by tool slug and sub-page slug */
export function getSubpage(
  toolSlug: string,
  subpageSlug: string,
): ToolSubpage | undefined {
  return toolSubpages[toolSlug]?.find((sp) => sp.slug === subpageSlug);
}
