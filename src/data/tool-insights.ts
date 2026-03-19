export interface ToolInsight {
  title: string;
  content: string;
  type: "tip" | "pitfall" | "example" | "security";
}

export const toolInsights: Record<string, ToolInsight[]> = {
  "json-formatter": [
    {
      type: "pitfall",
      title: "Trailing commas silently break JSON",
      content:
        "JavaScript allows trailing commas in objects and arrays, but JSON does not. This is the #1 cause of \"Unexpected token\" errors when pasting config from JS/TS files. Remove the comma after the last item in every object and array.",
    },
    {
      type: "tip",
      title: "Use 2-space indentation for config files",
      content:
        "Most open-source projects (React, Vue, Angular, Node.js) standardize on 2-space indentation for JSON config files like package.json and tsconfig.json. Using 4 spaces doubles file size in deeply nested structures with no readability gain.",
    },
    {
      type: "security",
      title: "Never paste production secrets into online formatters",
      content:
        "Server-side JSON formatters can log your input. DevBolt processes everything in your browser — verify by opening DevTools Network tab and confirming zero outbound requests while formatting. This matters when working with API keys, tokens, or database credentials.",
    },
    {
      type: "example",
      title: "Minified JSON saves 15-30% bandwidth in API responses",
      content:
        "A typical REST API response with 4-space formatting can be 20-30% larger than its minified equivalent. For high-traffic endpoints serving thousands of requests per second, minifying JSON in production reduces bandwidth costs and improves TTFB (Time to First Byte).",
    },
  ],
  base64: [
    {
      type: "security",
      title: "Base64 is encoding, not encryption",
      content:
        "Base64 makes binary data text-safe — it provides zero security. Anyone can decode a Base64 string instantly. Never use Base64 to \"hide\" passwords, API keys, or tokens. Kubernetes Secrets store values as Base64, which misleads many developers into thinking they are encrypted.",
    },
    {
      type: "pitfall",
      title: "Standard Base64 breaks URLs",
      content:
        "The + and / characters in standard Base64 have special meaning in URLs and filenames. Use Base64url encoding (replaces + with - and / with _) for JWT tokens, URL parameters, and file names. Most languages have a dedicated base64url variant.",
    },
    {
      type: "tip",
      title: "Base64 increases size by ~33%",
      content:
        "Every 3 bytes of input become 4 Base64 characters. A 1 MB image embedded as a Base64 data URI becomes ~1.37 MB in your HTML/CSS. For images over 10 KB, a separate file with proper caching is almost always better for performance than inline Base64.",
    },
    {
      type: "example",
      title: "Data URIs skip an HTTP request but block rendering",
      content:
        "Small icons (under 2-4 KB) as Base64 data URIs reduce HTTP requests and can improve initial paint. But Base64 strings in CSS cannot be cached independently and increase stylesheet parse time. The sweet spot: inline SVG for icons, external files for photos.",
    },
  ],
  "hash-generator": [
    {
      type: "security",
      title: "MD5 and SHA-1 are broken for security — use SHA-256 minimum",
      content:
        "MD5 collisions can be generated in seconds on a laptop. SHA-1 was broken by Google in 2017 (SHAttered attack). For password hashing, neither SHA family is appropriate — use bcrypt, scrypt, or Argon2 which include salting and key stretching. SHA-256/512 are fine for file integrity checks and checksums.",
    },
    {
      type: "pitfall",
      title: "Same input always produces the same hash",
      content:
        "Hashing is deterministic. If you hash passwords with SHA-256 alone (no salt), identical passwords produce identical hashes. An attacker with rainbow tables can reverse millions of unsalted hashes instantly. Always salt before hashing for authentication use cases.",
    },
    {
      type: "tip",
      title: "SHA-256 is the standard for file verification",
      content:
        "When downloading software, compare the SHA-256 checksum on the publisher's site against the hash of your downloaded file. This detects corrupted downloads and man-in-the-middle tampering. Most Linux distros, Docker images, and security tools publish SHA-256 checksums.",
    },
    {
      type: "example",
      title: "Subresource Integrity uses SHA-384 by default",
      content:
        "When loading scripts from CDNs, add an integrity attribute with the SHA-384 hash: <script src=\"cdn/lib.js\" integrity=\"sha384-abc...\" crossorigin=\"anonymous\">. The browser refuses to execute the script if the hash doesn't match, preventing supply chain attacks.",
    },
  ],
  "uuid-generator": [
    {
      type: "tip",
      title: "Use UUIDv7 for database primary keys, not UUIDv4",
      content:
        "UUIDv4 is fully random, which causes B-tree index fragmentation and slower INSERT performance in databases. UUIDv7 (RFC 9562, ratified 2024) embeds a Unix timestamp in the first 48 bits, making IDs time-sortable and index-friendly. PostgreSQL 17+ and most ORMs now support UUIDv7 natively.",
    },
    {
      type: "pitfall",
      title: "UUID collision risk is real in browser crypto",
      content:
        "UUID v4 uses 122 random bits — collision probability is astronomically low with a good PRNG. However, some older browsers and embedded environments have weak crypto.getRandomValues() implementations. Always verify your runtime uses a cryptographically secure random source, especially in IoT or embedded JavaScript.",
    },
    {
      type: "example",
      title: "UUIDs vs auto-increment IDs: a practical trade-off",
      content:
        "Auto-increment IDs leak information (total record count, creation rate) and cause merge conflicts in distributed systems. UUIDs solve both problems but use 128 bits vs 32-64 bits, increasing index size by 2-4x. For most web apps under 10M rows, this trade-off is worth it. For analytics tables with billions of rows, consider ULID or Snowflake IDs.",
    },
    {
      type: "security",
      title: "UUIDv1 leaks your MAC address",
      content:
        "UUID version 1 embeds the machine's MAC address and creation timestamp. This means anyone with a v1 UUID can identify the machine that generated it and when. Never use UUIDv1 for user-facing identifiers. Stick with v4 (random) or v7 (time-sortable random).",
    },
  ],
  "color-converter": [
    {
      type: "tip",
      title: "HSL is the most intuitive model for UI design",
      content:
        "HSL separates hue (the color), saturation (intensity), and lightness (brightness). To create a darker button hover state, reduce lightness by 10%. To create a muted variant, reduce saturation. In HEX/RGB you'd need to adjust all three channels — HSL makes systematic color palettes trivial.",
    },
    {
      type: "pitfall",
      title: "HEX shorthand can cause subtle color differences",
      content:
        "#333 expands to #333333, but #123 expands to #112233 — not #010203. Each digit is doubled, not treated as the first digit of a two-digit pair. This catches designers who assume #1A2 means a color close to #1A2000 when it actually becomes #11AA22.",
    },
    {
      type: "example",
      title: "CSS oklch() is the future of web color",
      content:
        "The oklch() color function (supported in all modern browsers since 2023) provides perceptually uniform colors. Unlike HSL where lightness: 50% produces visually different brightness for different hues, oklch guarantees consistent perceived brightness. This is why a yellow and blue at the same HSL lightness look completely different.",
    },
    {
      type: "tip",
      title: "Use 8-digit HEX for alpha transparency",
      content:
        "Instead of rgba(255, 0, 0, 0.5), use #FF000080. The last two hex digits represent alpha (00 = transparent, FF = opaque). 80 in hex is 128 in decimal, or 50% opacity. This is supported in all modern browsers and keeps your CSS consistent with the HEX format.",
    },
  ],
  "jwt-decoder": [
    {
      type: "security",
      title: "JWTs are not encrypted — anyone can read the payload",
      content:
        "A JWT is just Base64url-encoded JSON. The signature prevents tampering but does not hide the contents. Never store sensitive data (passwords, SSNs, credit card numbers) in JWT claims. If you need encrypted tokens, use JWE (JSON Web Encryption) instead.",
    },
    {
      type: "pitfall",
      title: "The 'none' algorithm attack is still exploited",
      content:
        "Some JWT libraries accept alg: \"none\", which means no signature verification. Attackers forge tokens by changing the algorithm to \"none\" and removing the signature. Always validate that the algorithm matches your expected value (e.g., RS256) and reject 'none' explicitly.",
    },
    {
      type: "tip",
      title: "Set short expiration times and use refresh tokens",
      content:
        "Access tokens should expire in 5-15 minutes, not hours or days. A stolen JWT cannot be revoked (unlike session IDs) — short expiration limits the damage window. Use a refresh token (stored in an httpOnly cookie) to silently issue new access tokens.",
    },
    {
      type: "example",
      title: "Decode the three parts: Header.Payload.Signature",
      content:
        "Split the JWT at the dots. The header tells you the algorithm (RS256, HS256). The payload contains claims — iss (issuer), sub (subject), exp (expiration as Unix timestamp), iat (issued at). The signature is a cryptographic hash that proves the header and payload haven't been modified.",
    },
  ],
  "regex-tester": [
    {
      type: "pitfall",
      title: "Catastrophic backtracking can freeze your app",
      content:
        "Patterns like (a+)+ or (a|a)* cause exponential backtracking on non-matching input. A 25-character string can take minutes to process. Use atomic groups or possessive quantifiers (a++ in Java/PCRE) to prevent this. In JavaScript, use the 'v' flag with set notation where possible.",
    },
    {
      type: "tip",
      title: "Test edge cases, not just happy paths",
      content:
        "An email regex that matches test@example.com might also match test@.com or @example.com. Always test with: empty strings, strings with only whitespace, extremely long input (>1000 chars), Unicode characters, and inputs that almost-but-don't-quite match your pattern.",
    },
    {
      type: "example",
      title: "Named capture groups make regex maintainable",
      content:
        "Instead of (\\d{4})-(\\d{2})-(\\d{2}) where you access groups by index, use (?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2}). In JavaScript: match.groups.year. Named groups act as documentation and survive refactoring when you add or remove groups.",
    },
    {
      type: "security",
      title: "Never use regex for HTML parsing",
      content:
        "Regular expressions cannot handle nested structures. A regex to extract href attributes will break on nested quotes, CDATA sections, comments containing tags, and self-closing elements. Use a proper HTML parser (DOMParser in browsers, cheerio/jsdom in Node.js).",
    },
  ],
  "url-parser": [
    {
      type: "tip",
      title: "Use the URL API instead of regex for parsing",
      content:
        "JavaScript's built-in URL class handles edge cases that regex misses: IPv6 addresses, IDN domains, percent-encoded characters, port numbers, and protocol-relative URLs. new URL(str) throws on invalid URLs, making it a validator and parser in one.",
    },
    {
      type: "pitfall",
      title: "Query parameters can appear multiple times",
      content:
        "The URL ?color=red&color=blue is valid — color has two values. URLSearchParams.get() returns only the first value. Use URLSearchParams.getAll('color') to get all values as an array. Many developers lose data by assuming single-value parameters.",
    },
    {
      type: "security",
      title: "Open redirect vulnerabilities hide in URL parsing",
      content:
        "If your app redirects to a URL from a query parameter (?redirect=https://evil.com), an attacker can phish your users. Always validate that redirect URLs are relative paths or belong to an allowlist of trusted domains. Check the parsed hostname, not just string prefix matching.",
    },
    {
      type: "example",
      title: "Fragment identifiers never reach the server",
      content:
        "The # portion of a URL (hash/fragment) is client-side only — browsers strip it before sending HTTP requests. This is why single-page apps use hash routing: the server always sees the same URL. It also means you cannot log or track fragment changes server-side.",
    },
  ],
  "markdown-preview": [
    {
      type: "tip",
      title: "GitHub-Flavored Markdown adds tables, task lists, and more",
      content:
        "Standard Markdown (CommonMark) doesn't support tables, strikethrough, task lists, or autolinked URLs. GitHub-Flavored Markdown (GFM) adds all of these. If your content renders on GitHub (READMEs, issues, PRs), use GFM syntax. Other platforms may use different extensions.",
    },
    {
      type: "pitfall",
      title: "Two spaces at line end create a <br> — invisible bugs",
      content:
        "In Markdown, a line break requires either two trailing spaces or a backslash before the newline. Invisible trailing spaces cause unexpected line breaks, and many editors strip trailing whitespace automatically. Use a backslash (\\) at the end of the line for explicit, visible line breaks.",
    },
    {
      type: "security",
      title: "Markdown can contain raw HTML and XSS vectors",
      content:
        "Most Markdown renderers allow inline HTML. If you render user-submitted Markdown without sanitization, <script>alert('xss')</script> executes. Always sanitize HTML output with a library like DOMPurify. GitHub and GitLab strip dangerous tags — your app should too.",
    },
    {
      type: "example",
      title: "Reference-style links improve readability in long docs",
      content:
        "Instead of inline links [text](https://very-long-url.com/path/to/resource?param=value), use reference-style: [text][1] and define [1]: https://very-long-url.com/... at the bottom. This keeps paragraphs readable and makes URL updates a single-line change.",
    },
  ],
  "diff-checker": [
    {
      type: "tip",
      title: "Ignore whitespace changes to focus on real differences",
      content:
        "Reformatting code (indentation, trailing spaces, line endings) creates massive diffs that hide actual logic changes. Most diff tools have a 'ignore whitespace' option. In git: git diff -w ignores all whitespace, git diff -b ignores changes in amount of whitespace.",
    },
    {
      type: "pitfall",
      title: "Line-ending differences create false diffs",
      content:
        "Windows uses CRLF (\\r\\n), Unix/Mac uses LF (\\n). If two files differ only in line endings, every line shows as changed. Set up .gitattributes with '* text=auto' to normalize line endings. In diff tools, use the 'ignore line endings' option to see real changes.",
    },
    {
      type: "example",
      title: "Side-by-side vs unified diff: choose by context",
      content:
        "Unified diff (default in git) shows changes with +/- prefixes and surrounding context — best for code review in terminals and pull requests. Side-by-side diff places old and new versions in parallel columns — better for comparing configuration files or spotting moved blocks of code.",
    },
    {
      type: "tip",
      title: "Use structural diff for JSON and YAML",
      content:
        "Text diff treats JSON key reordering as a change, but JSON objects are unordered by spec. A structural diff (like DevBolt's JSON Diff tool) compares by key paths and values, ignoring key order and formatting differences. This eliminates noise when comparing API responses or config files.",
    },
  ],
  "epoch-converter": [
    {
      type: "pitfall",
      title: "JavaScript uses milliseconds, Unix uses seconds",
      content:
        "Date.now() in JavaScript returns milliseconds since epoch (13 digits like 1710864000000). Most backend systems, APIs, and databases use seconds (10 digits like 1710864000). Mixing them up gives dates in the year 56000+. Always check the digit count: 10 digits = seconds, 13 = milliseconds.",
    },
    {
      type: "tip",
      title: "Store timestamps in UTC, display in local time",
      content:
        "Always store and transmit timestamps as UTC Unix timestamps or ISO 8601 with timezone (2024-03-19T12:00:00Z). Convert to the user's local timezone only at the display layer. This prevents bugs when users are in different timezones or during daylight saving transitions.",
    },
    {
      type: "example",
      title: "The Year 2038 problem affects 32-bit timestamps",
      content:
        "A 32-bit signed integer overflows on January 19, 2038 at 03:14:07 UTC. Systems using 32-bit time_t will wrap to December 13, 1901. Linux kernels 5.6+ are 2038-safe for 64-bit, but embedded systems, IoT devices, and legacy databases may still be vulnerable. Use 64-bit timestamps in new systems.",
    },
    {
      type: "pitfall",
      title: "Leap seconds make UTC tricky for precise timing",
      content:
        "Unix timestamps pretend every day has exactly 86400 seconds, ignoring leap seconds. Since 1972, 27 leap seconds have been added. For most applications this doesn't matter, but for financial trading, GPS, or scientific computing, use TAI (International Atomic Time) or handle leap seconds explicitly.",
    },
  ],
  "password-generator": [
    {
      type: "security",
      title: "Length beats complexity for password strength",
      content:
        "A 20-character lowercase password (26^20 = 10^28 combinations) is stronger than an 8-character password with mixed case, numbers, and symbols (95^8 = 10^15). Modern guidance from NIST (SP 800-63B) recommends minimum 15 characters and removing complexity requirements that lead to predictable patterns like P@ssw0rd!.",
    },
    {
      type: "tip",
      title: "Use passphrases for memorable passwords",
      content:
        "Four random dictionary words (correct-horse-battery-staple style) create passwords that are both strong and memorable. At ~12,000 common English words, four random words give 12000^4 = 2x10^16 combinations — equivalent to a 12-character random password but far easier to type and remember.",
    },
    {
      type: "pitfall",
      title: "Excluding similar characters weakens your password less than you think",
      content:
        "Removing ambiguous characters (0/O, 1/l/I) from a 16-character password reduces the character set from ~95 to ~88 — a negligible 7% reduction in entropy. The readability gain is worth it for passwords you might need to read aloud, type on a phone, or share verbally.",
    },
    {
      type: "example",
      title: "Browser crypto.getRandomValues() is the gold standard",
      content:
        "Math.random() is not cryptographically secure — its output can be predicted. DevBolt uses crypto.getRandomValues(), which pulls from the OS entropy pool (CryptGenRandom on Windows, /dev/urandom on Linux). This is the same source used by OpenSSL and is suitable for generating passwords, tokens, and keys.",
    },
  ],
  "case-converter": [
    {
      type: "tip",
      title: "Naming conventions vary by language and context",
      content:
        "camelCase: JavaScript variables, Java methods. PascalCase: TypeScript types, React components, C# classes. snake_case: Python, Ruby, Rust, database columns. SCREAMING_SNAKE_CASE: constants in most languages. kebab-case: CSS classes, HTML attributes, URL slugs. Using the wrong convention breaks linter rules and team consistency.",
    },
    {
      type: "pitfall",
      title: "Acronyms in PascalCase are inconsistent across ecosystems",
      content:
        "Should it be XMLParser or XmlParser? HTTPSConnection or HttpsConnection? Go uses XMLParser (all caps for acronyms). C#/.NET uses XmlParser (only first letter capitalized). JavaScript/TypeScript has no consensus. Pick one convention per project and enforce it with a linter rule.",
    },
    {
      type: "example",
      title: "Database column names: snake_case is safest",
      content:
        "SQL is case-insensitive by default, but PostgreSQL lowercases unquoted identifiers. A column named userId becomes userid unless quoted. snake_case (user_id) avoids this trap entirely and is the standard convention in PostgreSQL, MySQL, and SQLite. ORMs like Prisma and Drizzle handle the mapping to camelCase in your application code.",
    },
    {
      type: "tip",
      title: "Use your ORM's naming strategy instead of manual conversion",
      content:
        "Prisma's @@map and @map, TypeORM's namingStrategy, and Sequelize's underscored option automatically convert between camelCase code and snake_case database columns. This eliminates manual case conversion bugs and keeps your codebase consistent.",
    },
  ],
  "csv-json": [
    {
      type: "pitfall",
      title: "Commas inside fields require quoting",
      content:
        "The CSV value \"San Francisco, CA\" must be wrapped in double quotes: \"San Francisco, CA\". If the value itself contains a double quote, escape it by doubling: \"She said \"\"hello\"\"\". Many hand-edited CSV files break on this rule, causing columns to shift right and corrupt the entire row.",
    },
    {
      type: "tip",
      title: "CSV has no standard — TSV is often safer",
      content:
        "Despite RFC 4180, CSV implementations differ on quoting, escaping, encoding, and line endings. Tab-Separated Values (TSV) avoids most issues because tabs rarely appear in data. Excel, Google Sheets, and most databases support TSV import. Use .tsv extension for clarity.",
    },
    {
      type: "example",
      title: "Flatten nested JSON before converting to CSV",
      content:
        "CSV is inherently flat (rows and columns). Nested JSON like {address: {city: \"NYC\"}} must be flattened to address.city or address_city. Arrays pose a harder problem — you'll need to either join values (\"a,b,c\") or create one row per array element. Decide your strategy before converting.",
    },
    {
      type: "security",
      title: "CSV injection is a real attack vector",
      content:
        "A CSV field starting with =, +, -, or @ is interpreted as a formula in Excel and Google Sheets. An attacker could inject =CMD(\"calc\") into user-generated data. When exporting user input to CSV, prefix these characters with a single quote (') or tab character to prevent formula execution.",
    },
  ],
  "word-counter": [
    {
      type: "tip",
      title: "Reading time calculation: 200-250 words per minute",
      content:
        "The industry standard for reading time estimates is 200-250 WPM for English text. Technical content with code blocks is slower (~150 WPM). Medium.com uses 265 WPM. For blog posts, display reading time to set reader expectations — posts showing 5-7 minute read time get the highest engagement.",
    },
    {
      type: "pitfall",
      title: "Word counting varies by definition and language",
      content:
        "Is 'don't' one word or two? Is a URL one word? CJK languages (Chinese, Japanese, Korean) don't use spaces between words — character count is the meaningful metric. Tools that split on whitespace give inaccurate counts for hyphenated words, contractions, and non-Latin scripts.",
    },
    {
      type: "example",
      title: "SEO content length guidelines by content type",
      content:
        "Blog posts: 1,500-2,500 words rank best for informational queries (Backlinko study). Product pages: 300-500 words. Landing pages: 500-1,000 words. Meta descriptions: 150-160 characters. Title tags: 50-60 characters. These are guidelines, not rules — match length to search intent.",
    },
  ],
  "url-encoder": [
    {
      type: "pitfall",
      title: "encodeURI vs encodeURIComponent: use the right one",
      content:
        "encodeURI() encodes a full URL but preserves :, /, ?, #, and &. encodeURIComponent() encodes everything including those characters. Use encodeURIComponent() for individual query parameter values. Use encodeURI() only for complete URLs. Mixing them up creates double-encoded or broken URLs.",
    },
    {
      type: "tip",
      title: "Spaces can be + or %20 depending on context",
      content:
        "In URL query strings (after ?), spaces can be encoded as + (application/x-www-form-urlencoded, used in HTML forms) or %20 (RFC 3986). In URL paths (before ?), only %20 is valid. JavaScript's encodeURIComponent uses %20. PHP's urlencode uses +. Be consistent within your application.",
    },
    {
      type: "security",
      title: "Double encoding causes security bypasses",
      content:
        "If your server decodes URL parameters twice, an attacker can bypass path traversal filters: %252e%252e%252f decodes to %2e%2e%2f then to ../. Always decode exactly once and validate after decoding. Web Application Firewalls often miss double-encoded payloads.",
    },
    {
      type: "example",
      title: "Non-ASCII characters require percent-encoding",
      content:
        "The URL path /users/josé must be encoded as /users/jos%C3%A9 for HTTP transmission. Modern browsers display the decoded version in the address bar, but the actual request uses percent-encoding. APIs should accept and return percent-encoded URLs to avoid encoding ambiguity.",
    },
  ],
  "json-yaml": [
    {
      type: "pitfall",
      title: "YAML has dangerous implicit type coercion",
      content:
        "In YAML, the value no is parsed as boolean false, not the string \"no\". Similarly: on/off, yes/no, true/false, and even country codes like NO (Norway) become booleans. Version numbers like 1.0 become floats (losing the trailing zero). Always quote strings that could be misinterpreted: country: \"NO\", version: \"1.0\".",
    },
    {
      type: "security",
      title: "YAML deserialization can execute arbitrary code",
      content:
        "YAML supports language-specific tags like !!python/object that can instantiate objects during parsing. This has led to critical RCE vulnerabilities in Ruby on Rails, Python, and Java applications. Always use safe loaders: yaml.safe_load() in Python, YAML.safe_load() in Ruby, js-yaml's safeLoad() in JavaScript.",
    },
    {
      type: "tip",
      title: "JSON is valid YAML (mostly)",
      content:
        "YAML 1.2 is a superset of JSON — any valid JSON document is valid YAML. This means you can use JSON syntax within YAML files for complex nested structures while keeping simple top-level config in YAML format. However, JSON with duplicate keys may behave differently in YAML parsers.",
    },
    {
      type: "example",
      title: "Use JSON for machine-to-machine, YAML for human-edited config",
      content:
        "JSON's strict syntax (required quotes, no comments) makes it ideal for APIs and data interchange — there's no ambiguity in parsing. YAML's comments, anchors, and clean syntax make it better for config files (docker-compose, Kubernetes, CI/CD). Don't use YAML for data storage or API responses.",
    },
  ],
  "qr-code": [
    {
      type: "tip",
      title: "Error correction level affects both density and resilience",
      content:
        "QR codes have 4 error correction levels: L (7%), M (15%), Q (25%), H (30%). Higher correction means larger codes but survive more damage — important for printed materials. Use L for screen display (minimal damage risk), M for standard print, H for codes that will have a logo overlay or be in harsh environments.",
    },
    {
      type: "pitfall",
      title: "QR codes have a maximum data capacity",
      content:
        "A QR code holds at most ~4,296 alphanumeric characters or ~2,953 bytes. Long URLs with UTM parameters easily exceed practical limits, making the QR code too dense to scan reliably. Use URL shorteners for long links. Keep QR content under 100 characters for reliable scanning at distance.",
    },
    {
      type: "example",
      title: "WiFi QR codes eliminate manual password typing",
      content:
        "The format WIFI:T:WPA;S:NetworkName;P:Password;; creates a QR code that auto-connects to WiFi when scanned. Supported on iOS 11+ and Android 10+. Perfect for guest networks, offices, and Airbnbs. Use T:WPA for WPA/WPA2, T:WEP for WEP, or T:nopass for open networks.",
    },
    {
      type: "security",
      title: "QR codes can be weaponized for phishing",
      content:
        "Attackers place malicious QR codes over legitimate ones (quishing attacks). A QR code linking to a fake login page is indistinguishable from a legitimate one visually. Always verify the URL domain after scanning before entering credentials. For business use, use branded short domains to make legitimate QR URLs recognizable.",
    },
  ],
  "sql-formatter": [
    {
      type: "tip",
      title: "Capitalize SQL keywords for readability",
      content:
        "Writing SELECT, FROM, WHERE, JOIN in uppercase and table/column names in lowercase is the most widely adopted SQL style. It creates immediate visual separation between SQL syntax and your data model. Most formatters default to this convention. Some teams prefer lowercase SQL — consistency matters more than the specific choice.",
    },
    {
      type: "pitfall",
      title: "SELECT * is a maintenance trap",
      content:
        "SELECT * fetches all columns, including ones added later that your code doesn't handle. It increases network transfer, prevents covering index optimizations, and breaks when columns are renamed or removed. Always list the specific columns you need. The only exception: EXISTS subqueries where the column list doesn't matter.",
    },
    {
      type: "example",
      title: "CTEs (WITH clauses) make complex queries readable",
      content:
        "Instead of nested subqueries 4 levels deep, use Common Table Expressions: WITH active_users AS (...), recent_orders AS (...) SELECT ... This reads top-to-bottom like a story and each CTE can be tested independently. PostgreSQL and MySQL 8+ optimize CTEs as well as subqueries in most cases.",
    },
    {
      type: "security",
      title: "Formatted SQL is easier to spot injection vulnerabilities",
      content:
        "Minified or poorly formatted SQL hides string concatenation patterns that signal SQL injection: 'SELECT * FROM users WHERE id = ' + userId. Well-formatted SQL makes these red flags visible during code review. Always use parameterized queries: WHERE id = $1 (PostgreSQL) or WHERE id = ? (MySQL).",
    },
  ],
  "html-entities": [
    {
      type: "security",
      title: "HTML entity encoding prevents XSS attacks",
      content:
        "Converting < to &lt; and > to &gt; in user-generated content prevents browsers from interpreting it as HTML. This is the fundamental defense against Cross-Site Scripting (XSS). Also encode & (to &amp;), \" (to &quot;), and ' (to &#x27;). Modern frameworks like React do this automatically in JSX expressions.",
    },
    {
      type: "pitfall",
      title: "Double encoding produces visible &amp;amp; in output",
      content:
        "If your template engine already escapes HTML and you manually encode before passing data, users see literal &amp;lt; instead of <. This happens frequently when switching between raw HTML and framework templates. Encode exactly once, at the output layer closest to the browser.",
    },
    {
      type: "tip",
      title: "Use numeric entities for special characters in email HTML",
      content:
        "Email clients have inconsistent HTML entity support. Named entities like &mdash; may not render in all clients (especially Outlook). Numeric entities (&#8212; for em dash, &#169; for copyright) have broader support. For maximum compatibility, use UTF-8 encoding and avoid entities entirely where possible.",
    },
    {
      type: "example",
      title: "The 5 mandatory HTML entities you must always encode",
      content:
        "In HTML content: &lt; (<), &gt; (>), &amp; (&). In HTML attributes: add &quot; (\") and &#x27; ('). These 5 characters have special meaning in HTML — failing to encode them in user input creates either broken markup or security vulnerabilities. Everything else can be left as UTF-8.",
    },
  ],
};
