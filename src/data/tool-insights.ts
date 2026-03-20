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
  "chmod-calculator": [
    {
      type: "tip",
      title: "Use symbolic mode for readable, composable permissions",
      content:
        "chmod u+rwx,g+rx,o+r is clearer than chmod 754. Symbolic mode lets you add or remove specific permissions without recalculating the full octal number. Use + to add, - to remove, = to set exactly. Symbolic mode is especially useful in scripts where intent matters more than brevity.",
    },
    {
      type: "pitfall",
      title: "777 permissions are a security red flag",
      content:
        "chmod 777 grants read, write, and execute to everyone — including other users on the server. This is the most common misconfiguration in web deployments. For web files: 644 for files (owner read/write, others read), 755 for directories (owner full, others read/execute). Never use 777 in production.",
    },
    {
      type: "security",
      title: "The sticky bit prevents file deletion in shared directories",
      content:
        "Setting chmod 1777 on /tmp means any user can create files, but only the file owner can delete them. Without the sticky bit (just 777), any user can delete any other user's files. The sticky bit is the '1' prefix in octal notation or 't' in ls -l output (drwxrwxrwt).",
    },
    {
      type: "example",
      title: "SUID/SGID bits can be dangerous on executables",
      content:
        "chmod 4755 (SUID) makes an executable run as the file owner, not the user who invoked it. This is how /usr/bin/passwd can write to /etc/shadow. Misconfigured SUID binaries are a top privilege escalation vector. Audit SUID files regularly: find / -perm -4000 -type f.",
    },
  ],
  "gradient-generator": [
    {
      type: "tip",
      title: "Use oklch() color space for perceptually smooth gradients",
      content:
        "CSS linear-gradient in sRGB can produce muddy grays in the middle of a gradient (especially blue-to-yellow). Using color interpolation in oklch — background: linear-gradient(in oklch, blue, yellow) — produces vibrant, perceptually uniform transitions. Supported in all modern browsers since 2023.",
    },
    {
      type: "pitfall",
      title: "Gradients with too many color stops slow rendering",
      content:
        "Each color stop in a CSS gradient adds a calculation per pixel during paint. Gradients with 8+ stops on large elements can cause noticeable frame drops during scroll, especially on mobile. Use 2-4 stops for backgrounds. For complex gradients, consider a pre-rendered image with proper caching.",
    },
    {
      type: "example",
      title: "Repeating gradients create stripes and patterns without images",
      content:
        "repeating-linear-gradient(45deg, #000 0 10px, transparent 10px 20px) creates diagonal stripes with zero HTTP requests. Combine with background-size and background-blend-mode for complex patterns. This eliminates image assets for decorative backgrounds and reduces page weight.",
    },
    {
      type: "security",
      title: "Gradients in email HTML have minimal client support",
      content:
        "Outlook, Gmail, and Yahoo Mail either ignore or partially support CSS gradients. Always provide a solid background-color fallback before your gradient declaration. For email, use a background image hosted on a CDN rather than relying on CSS gradient rendering.",
    },
  ],
  "xml-formatter": [
    {
      type: "tip",
      title: "Use XML namespaces correctly to avoid element conflicts",
      content:
        "When combining XML from different sources (SOAP envelopes, SVG in HTML, RSS feeds), namespaces prevent element name collisions. Always declare namespaces on the root element with xmlns:prefix and reference elements as prefix:elementName. Default namespace (xmlns without prefix) applies to the element and all descendants.",
    },
    {
      type: "pitfall",
      title: "Self-closing tags behave differently in XML vs HTML",
      content:
        "In XML, <br/> is valid and means an empty br element. In HTML, <br/> is treated as <br> — the slash is ignored. But <script/> in HTML does NOT self-close — the browser waits for </script>. When generating XHTML or mixing XML/HTML, always use explicit closing tags for non-void elements.",
    },
    {
      type: "security",
      title: "XML External Entity (XXE) attacks can read server files",
      content:
        "An XML document with <!DOCTYPE foo [<!ENTITY xxe SYSTEM \"file:///etc/passwd\">]> can exfiltrate server files when parsed by a vulnerable XML processor. Disable external entity processing in every XML parser: set disallow-doctype-decl or disable external-general-entities. This is OWASP Top 10 #5.",
    },
    {
      type: "example",
      title: "CDATA sections let you embed raw text without escaping",
      content:
        "Instead of escaping every < and & in embedded code snippets, wrap them in <![CDATA[...]]>. Everything inside CDATA is treated as raw text. This is essential for RSS feed descriptions containing HTML and SOAP messages containing XML fragments. Note: CDATA cannot be nested.",
    },
  ],
  "code-minifier": [
    {
      type: "tip",
      title: "Enable source maps alongside minification for debugging",
      content:
        "Minification replaces variable names with single characters, making stack traces unreadable. Source maps (.map files) map minified code back to original source. Configure your bundler to generate source maps and upload them to your error tracking service (Sentry, Datadog). Never serve source maps publicly in production.",
    },
    {
      type: "pitfall",
      title: "CSS minification can break specificity in rare cases",
      content:
        "Some aggressive CSS minifiers merge selectors or reorder declarations. If your CSS relies on source order for specificity tie-breaking (two selectors with equal specificity), reordering changes which rule wins. Use explicit specificity (more specific selectors or layers) rather than relying on source order.",
    },
    {
      type: "example",
      title: "Gzip/Brotli compression after minification gives 80-90% reduction",
      content:
        "Minification alone typically reduces JavaScript by 30-50%. But Gzip or Brotli compression on the minified output achieves 80-90% total reduction. Enable both: minify during build (removes dead code, shortens names) and compress during transfer (HTTP Content-Encoding). They're complementary, not alternatives.",
    },
    {
      type: "security",
      title: "Minification is not obfuscation",
      content:
        "Minified code is smaller but not secret. Variable shortening is trivially reversed with a beautifier. If you need to protect client-side logic (license checks, API keys), move it to the server. No client-side technique — including obfuscation — prevents a determined attacker from reading your JavaScript.",
    },
  ],
  "image-base64": [
    {
      type: "tip",
      title: "Inline images under 4KB, external files above",
      content:
        "Base64 encoding increases size by 33%, but eliminates an HTTP request. For tiny icons and sprites under 4KB, the round-trip savings outweigh the size increase. Above 4KB, a separate file with caching headers is more efficient. Most bundlers (Webpack, Vite) have this threshold configurable via asset size limits.",
    },
    {
      type: "pitfall",
      title: "Base64 images bypass browser image caching",
      content:
        "When you inline a Base64 image in CSS or HTML, the browser cannot cache it separately. Every page load re-downloads the encoded data as part of the document. For images used across multiple pages (logos, icons), serve them as files with Cache-Control headers for maximum performance.",
    },
    {
      type: "security",
      title: "Validate image MIME types before encoding",
      content:
        "A file with a .png extension might actually be a script or executable. Always verify the file's magic bytes (file signature) match the expected format before accepting user uploads. For Base64-encoded images in data URIs, browsers enforce the MIME type — but your server-side code should too.",
    },
    {
      type: "example",
      title: "Use data URIs for placeholder images and loading states",
      content:
        "A 1x1 transparent PNG as Base64 is just 68 characters. Use it as a placeholder src while lazy-loading full images: src=\"data:image/png;base64,iVBOR...\" data-src=\"real-image.jpg\". This prevents layout shift (CLS) without any HTTP request for the placeholder.",
    },
  ],
  "color-palette": [
    {
      type: "tip",
      title: "Use the 60-30-10 rule for balanced color schemes",
      content:
        "Allocate 60% to your dominant/neutral color, 30% to your secondary color, and 10% to an accent color. This interior design principle works perfectly for UI: 60% background, 30% cards/containers, 10% buttons/CTAs. It creates visual hierarchy without requiring design expertise.",
    },
    {
      type: "pitfall",
      title: "Colors that look great together can fail accessibility",
      content:
        "A beautiful palette doesn't guarantee readability. Blue text on purple background may be aesthetically pleasing but fail WCAG contrast requirements (4.5:1 for normal text, 3:1 for large text). Always check contrast ratios between text and background colors — use DevBolt's Contrast Checker tool.",
    },
    {
      type: "example",
      title: "Generate palettes from a single brand color using HSL manipulation",
      content:
        "Start with your brand color in HSL. Create variants by adjusting lightness: 95% for backgrounds, 85% for borders, 50% for primary, 30% for hover, 15% for dark text. Adjust saturation: lower for neutrals, higher for accents. This systematic approach creates cohesive design tokens from one color choice.",
    },
    {
      type: "security",
      title: "Color alone should never convey critical information",
      content:
        "8% of men have color vision deficiency. A form that marks invalid fields only with red color is unusable for colorblind users. Always pair color with a second indicator: icons, text labels, patterns, or borders. WCAG 1.4.1 requires that color is not the sole means of conveying information.",
    },
  ],
  "json-to-typescript": [
    {
      type: "tip",
      title: "Prefer interfaces over types for object shapes",
      content:
        "TypeScript interfaces support declaration merging, better error messages, and faster type checking. Use 'interface' for object shapes (API responses, props, configs) and 'type' for unions, intersections, and mapped types. In large codebases, this distinction improves IDE performance and compiler speed.",
    },
    {
      type: "pitfall",
      title: "Inferred types from JSON samples miss nullable fields",
      content:
        "If your JSON sample has all fields populated, the generated TypeScript types won't include null or undefined. Real API responses often have optional fields. After generating types, review each field: should it be required or optional (?)? Can it be null? The sample data is just one snapshot — your types should cover all valid states.",
    },
    {
      type: "example",
      title: "Use utility types to derive related types",
      content:
        "Generate the base type from JSON, then use TypeScript utilities: Partial<User> for patch endpoints, Pick<User, 'id' | 'name'> for list views, Omit<User, 'password'> for public responses. This avoids duplicating type definitions and ensures changes propagate automatically.",
    },
    {
      type: "security",
      title: "Runtime validation must match your TypeScript types",
      content:
        "TypeScript types are erased at runtime — they don't validate actual API data. An API returning {age: \"thirty\"} won't trigger a type error at runtime even if you typed age as number. Use Zod, io-ts, or valibot to validate data at system boundaries (API calls, form inputs, file reads).",
    },
  ],
  "yaml-formatter": [
    {
      type: "tip",
      title: "Use 2-space indentation for YAML — it's the de facto standard",
      content:
        "Kubernetes, Docker Compose, GitHub Actions, and Ansible all use 2-space indentation in their documentation and examples. Using tabs in YAML is a syntax error. Using 4 spaces works but doubles visual nesting depth. Stick with 2 spaces to match ecosystem conventions and keep deeply nested configs readable.",
    },
    {
      type: "pitfall",
      title: "YAML treats 'no', 'off', and 'false' as boolean false",
      content:
        "A country code field with value NO (Norway), or a feature flag named 'off' will be silently coerced to boolean false. YAML 1.1 also treats y/n, on/off as booleans. Always quote ambiguous string values: country: \"NO\", mode: \"off\". YAML 1.2 is stricter but many parsers still default to 1.1 behavior.",
    },
    {
      type: "security",
      title: "YAML anchors can cause exponential memory consumption",
      content:
        "YAML anchors (&) and aliases (*) enable reuse, but a billion laughs attack uses nested anchors to expand a small document into gigabytes: a: &a [*b,*b], b: &b [*c,*c]... Set recursion depth limits and maximum document size in your YAML parser. Most libraries have these options but leave them disabled by default.",
    },
    {
      type: "example",
      title: "Multi-line strings: use | for literal, > for folded",
      content:
        "The | (pipe) preserves newlines exactly as written — ideal for scripts, SQL, and code blocks. The > (greater-than) folds newlines into spaces, creating paragraphs — ideal for descriptions and long text. Add - to strip trailing newlines (|-, >-) or + to preserve them (|+, >+).",
    },
  ],
  "json-path": [
    {
      type: "tip",
      title: "Use recursive descent (..) to find deeply nested values",
      content:
        "$.store..price finds all price fields regardless of depth — you don't need to know the exact path. This is invaluable when exploring unfamiliar API responses. Combine with filters: $..book[?(@.price < 10)] finds all books under $10 anywhere in the document.",
    },
    {
      type: "pitfall",
      title: "JSONPath implementations vary significantly",
      content:
        "There is no single JSONPath standard (RFC 9535 was published in 2024 but adoption is incomplete). Jayway (Java), Goessner (original), and jsonpath-plus (JS) handle filter expressions, array slicing, and script expressions differently. Always test your JSONPath queries against the specific library your production code uses.",
    },
    {
      type: "example",
      title: "Array slicing follows Python conventions",
      content:
        "$.items[0:3] returns the first 3 items (indices 0, 1, 2). $.items[-1:] returns the last item. $.items[::2] returns every other item. The syntax is [start:end:step]. These operations are much more efficient than fetching all items and filtering in application code when your JSONPath engine supports server-side evaluation.",
    },
    {
      type: "security",
      title: "Filter expressions can be injection vectors",
      content:
        "JSONPath filter expressions like [?(@.name == 'value')] can be vulnerable to injection if the value comes from user input without sanitization. An attacker could inject ')]|| true ||[?(1==1' to bypass filters. Always parameterize or sanitize user input in JSONPath queries, just like SQL.",
    },
  ],
  "svg-optimizer": [
    {
      type: "tip",
      title: "Remove metadata and editor data for 30-60% size reduction",
      content:
        "Design tools (Illustrator, Figma, Sketch) embed editor metadata, comments, hidden layers, and unused definitions in exported SVGs. Stripping this data typically reduces file size by 30-60% with zero visual change. SVGO is the standard optimizer — run it on every SVG before committing to your repo.",
    },
    {
      type: "pitfall",
      title: "Aggressive optimization can break SVG animations and filters",
      content:
        "Removing IDs, merging paths, or converting shapes to paths can break CSS animations targeting specific elements, SMIL animations, JavaScript interactions, and filter references. If your SVG uses animation or interactivity, test the optimized output thoroughly. Disable path merging and ID removal for interactive SVGs.",
    },
    {
      type: "example",
      title: "Inline SVG vs img tag: choose by use case",
      content:
        "Inline SVG (<svg> in HTML) allows CSS styling, JavaScript interaction, and eliminates an HTTP request — use for icons, logos, and interactive graphics. SVG as <img> is cached independently and doesn't increase DOM size — use for complex illustrations and decorative images that don't need manipulation.",
    },
    {
      type: "security",
      title: "SVGs can contain embedded JavaScript",
      content:
        "SVG supports <script> tags and event handlers (onload, onclick). An uploaded SVG with malicious JavaScript executes when rendered inline or viewed directly. Never serve user-uploaded SVGs inline — use <img> tag (blocks script execution), Content-Security-Policy, or sanitize with DOMPurify before rendering.",
    },
  ],
  "image-compressor": [
    {
      type: "tip",
      title: "Use WebP for photos, SVG for icons, AVIF for next-gen",
      content:
        "WebP gives 25-35% smaller files than JPEG at equivalent quality and is supported in all modern browsers. AVIF is 20% smaller still but slower to encode. SVG is infinitely scalable for icons and logos. Use the <picture> element with AVIF → WebP → JPEG fallback chain for maximum browser coverage.",
    },
    {
      type: "pitfall",
      title: "Quality 80 is the sweet spot — below 70 introduces visible artifacts",
      content:
        "JPEG quality 80-85 is visually indistinguishable from 100 but 60-70% smaller. Below quality 70, compression artifacts (banding in gradients, ringing around edges) become visible, especially on retina displays. For hero images, use quality 85. For thumbnails, quality 75 is acceptable.",
    },
    {
      type: "example",
      title: "Responsive images save 50%+ bandwidth on mobile",
      content:
        "A 2000px hero image on a 375px phone wastes 80% of pixels. Use srcset to serve appropriately sized images: <img srcset=\"hero-400.webp 400w, hero-800.webp 800w, hero-1600.webp 1600w\" sizes=\"100vw\">. Combined with compression, this can reduce mobile image bandwidth by 70-85%.",
    },
    {
      type: "security",
      title: "Image metadata can leak sensitive information",
      content:
        "EXIF data in photos can contain GPS coordinates, device model, camera serial number, and timestamps. Before publishing user-uploaded images, strip all metadata. Most image processing libraries (sharp, Pillow, ImageMagick) can remove EXIF data during conversion or optimization.",
    },
  ],
  "box-shadow": [
    {
      type: "tip",
      title: "Layer multiple shadows for realistic depth",
      content:
        "A single box-shadow looks flat. Layer 2-3 shadows with increasing blur and offset for natural-looking elevation: box-shadow: 0 1px 2px rgba(0,0,0,0.1), 0 4px 8px rgba(0,0,0,0.08), 0 12px 24px rgba(0,0,0,0.06). This mimics how real objects cast soft, diffused shadows at multiple distances.",
    },
    {
      type: "pitfall",
      title: "Box shadows trigger paint on scroll — use sparingly",
      content:
        "CSS box-shadow forces the browser to repaint the element's layer on every frame during animations or scroll. For fixed/sticky headers with shadows, add will-change: box-shadow or use transform: translateZ(0) to promote the element to its own compositor layer. Better yet, use a pseudo-element for the shadow.",
    },
    {
      type: "example",
      title: "Use inset shadows for pressed/active button states",
      content:
        "An inset shadow creates the illusion of a pressed button: box-shadow: inset 0 2px 4px rgba(0,0,0,0.2). Combine with removing the outer shadow and a slight translateY for a convincing click effect. This costs zero additional DOM elements and works in all browsers.",
    },
    {
      type: "security",
      title: "Shadow tricks can be used for clickjacking indicators",
      content:
        "Exaggerated box-shadows or outlines are sometimes used to visually indicate iframe boundaries in clickjacking defense. If your site is framed, a visible shadow around the viewport helps users recognize they're in an embedded context. Always set X-Frame-Options or CSP frame-ancestors as the primary defense.",
    },
  ],
  "contrast-checker": [
    {
      type: "tip",
      title: "WCAG AA requires 4.5:1 for normal text, 3:1 for large text",
      content:
        "Large text is defined as 18pt (24px) regular weight or 14pt (18.66px) bold. Logos and decorative text are exempt. For AAA (enhanced) compliance: 7:1 for normal text, 4.5:1 for large text. Meeting AA is legally required in many jurisdictions (ADA, EAA, EN 301 549). AAA is best practice for public-facing content.",
    },
    {
      type: "pitfall",
      title: "Contrast ratios don't account for thin font weights",
      content:
        "WCAG contrast calculations use luminance values, not font weight. But a 400-weight font at 4.5:1 contrast is more readable than a 300-weight font at the same ratio. Light and thin font weights (100-300) need higher contrast to be legible, especially at small sizes. Use 500+ weight for body text.",
    },
    {
      type: "example",
      title: "Semi-transparent text has variable contrast",
      content:
        "Text with opacity: 0.7 or color: rgba(0,0,0,0.6) has different effective contrast depending on the background behind it. Over a white background it might pass, but over an image it might fail. Calculate contrast against the worst-case background. For text over images, add a solid or gradient overlay.",
    },
    {
      type: "security",
      title: "Low contrast can be a dark pattern",
      content:
        "Deliberately low-contrast text for unsubscribe links, terms of service links, or opt-out options is a dark pattern that may violate accessibility laws and FTC guidelines. The EU's Digital Services Act explicitly addresses deceptive interface design. Ensure all interactive elements meet minimum contrast requirements.",
    },
  ],
  "flexbox-generator": [
    {
      type: "tip",
      title: "Use gap instead of margin for consistent spacing",
      content:
        "The gap property (gap: 16px) creates uniform spacing between flex items without affecting the first/last item. Before gap support, developers used margin with negative margin on the container or :last-child overrides. gap works in Flexbox (all modern browsers since 2021) and eliminates spacing hacks.",
    },
    {
      type: "pitfall",
      title: "flex: 1 doesn't mean equal widths — it means equal growth",
      content:
        "flex: 1 sets flex-grow: 1, flex-shrink: 1, flex-basis: 0%. Items grow equally from 0 width, but content can make them unequal. For truly equal widths, use flex: 1 1 0% AND min-width: 0 (to allow items to shrink below content size). Or use CSS Grid with grid-template-columns: repeat(3, 1fr).",
    },
    {
      type: "example",
      title: "Centering anything: display:flex + place-items:center",
      content:
        "The CSS holy grail — centering vertically and horizontally — is one line: display: flex; place-items: center (shorthand for align-items + justify-items). Or use place-content: center for the container-level equivalent. No more margin: auto, transform: translate(-50%), or table-cell hacks.",
    },
    {
      type: "security",
      title: "Flexbox order changes visual order, not DOM order",
      content:
        "The CSS order property rearranges visual display but screen readers and keyboard navigation follow DOM order. If your flex order creates a different visual sequence than the tab order, keyboard users will be confused and disoriented. Keep visual and DOM order aligned for accessible navigation.",
    },
  ],
  "grid-generator": [
    {
      type: "tip",
      title: "Use minmax() with auto-fill for responsive grids without media queries",
      content:
        "grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)) creates a responsive grid that automatically adjusts column count based on container width. Items are at least 250px wide and grow to fill space. Zero media queries, zero JavaScript — pure CSS responsive layout.",
    },
    {
      type: "pitfall",
      title: "auto-fill vs auto-fit: subtle but important difference",
      content:
        "auto-fill creates empty tracks when there's extra space. auto-fit collapses empty tracks, stretching items to fill. With 2 items in a 4-column grid: auto-fill leaves 2 empty column tracks; auto-fit stretches the 2 items to fill all space. Use auto-fit for most layouts, auto-fill when you need placeholder spacing.",
    },
    {
      type: "example",
      title: "Named grid areas create self-documenting layouts",
      content:
        "grid-template-areas: \"header header\" \"sidebar main\" \"footer footer\" reads like an ASCII art layout. Assign areas with grid-area: header. This is more maintainable than grid-column/grid-row coordinates for complex page layouts. Areas can be rearranged in media queries for responsive design.",
    },
    {
      type: "security",
      title: "CSS Grid can visually reorder form fields away from tab order",
      content:
        "Like Flexbox order, Grid placement (grid-row, grid-column, grid-area) changes visual position without affecting DOM/tab order. A login form where the password field visually appears before username but tabs in reverse order is confusing and could be exploited for phishing-style misdirection.",
    },
  ],
  "border-radius": [
    {
      type: "tip",
      title: "Use percentage for perfect circles and ellipses",
      content:
        "border-radius: 50% on a square element creates a perfect circle. On a rectangle, it creates an ellipse. For pill-shaped buttons, use border-radius: 9999px — this guarantees fully rounded ends regardless of the element's height. Avoid using exact pixel values for pill shapes, as they break when content changes size.",
    },
    {
      type: "pitfall",
      title: "Individual corner syntax has two notations — don't mix them",
      content:
        "The shorthand border-radius: 10px 20px 30px 40px sets all four corners (top-left, top-right, bottom-right, bottom-left — clockwise from top-left). The longhand border-top-left-radius: 10px 20px sets horizontal and vertical radii for elliptical corners. Mixing shorthand clockwise order with the longhand properties causes unexpected results.",
    },
    {
      type: "example",
      title: "Superellipse (squircle) shapes for iOS-style icons",
      content:
        "Apple's iOS icons use a superellipse, not border-radius. CSS can approximate this with border-radius values slightly less than 50%: try border-radius: 22% for a squircle effect. For pixel-perfect iOS icons, use SVG clip-path with a superellipse formula or the CSS clip-path: path() function.",
    },
    {
      type: "security",
      title: "Border radius clips content but doesn't clip pointer events",
      content:
        "A rounded element still has a rectangular click area unless you add clip-path. An invisible corner region can still receive clicks, causing unexpected button presses or link activations. For circular buttons, match the clickable area with border-radius: 50% AND a clip-path or explicit pointer-events handling.",
    },
  ],
  "text-shadow": [
    {
      type: "tip",
      title: "Multiple text-shadows create outline and glow effects",
      content:
        "Stack four shadows at 1px offsets in each direction for a text outline: text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000. For a glow effect, use 0 offset with large blur: text-shadow: 0 0 10px rgba(0,150,255,0.8). No additional markup needed.",
    },
    {
      type: "pitfall",
      title: "Text shadows render on every glyph — performance cost with long text",
      content:
        "Each text-shadow is rendered per character. Multiple shadows on large text blocks (especially with blur) can cause visible paint lag. Use text-shadow for headings and short UI labels. For body text, prefer background gradients or container shadows instead. Profile with Chrome DevTools Paint panel.",
    },
    {
      type: "example",
      title: "Improve readability of text over images with shadow",
      content:
        "White text on a photo is often illegible in bright areas. A subtle dark text-shadow — text-shadow: 0 1px 3px rgba(0,0,0,0.6) — ensures readability against any background. This is more performant than adding a gradient overlay to the image and works on dynamic content.",
    },
    {
      type: "security",
      title: "Text shadows can make hidden text visible to scrapers",
      content:
        "Some anti-scraping techniques use text-shadow to visually display data while keeping the DOM text different (honeypot characters). However, sophisticated scrapers parse computed styles including text-shadow. Don't rely on CSS tricks as a data protection mechanism — use proper access controls and rate limiting.",
    },
  ],
  "css-animation": [
    {
      type: "tip",
      title: "Animate only transform and opacity for 60fps performance",
      content:
        "Animating width, height, top, left, margin, or padding triggers layout recalculation on every frame. Animating transform (translate, scale, rotate) and opacity runs on the GPU compositor thread, bypassing the main thread entirely. This is the difference between janky 15fps and smooth 60fps animations.",
    },
    {
      type: "pitfall",
      title: "will-change creates a new stacking context and compositor layer",
      content:
        "will-change: transform promotes an element to its own GPU layer, which uses memory. Apply it to 2-5 elements max, not broadly. Overuse causes excessive memory consumption and can actually decrease performance. Only apply will-change just before the animation starts and remove it after.",
    },
    {
      type: "example",
      title: "Use @media (prefers-reduced-motion) to respect user preferences",
      content:
        "@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } } Users with vestibular disorders enable reduced motion in their OS settings. Ignoring this preference is an accessibility violation.",
    },
    {
      type: "security",
      title: "Animations can be used for timing attacks",
      content:
        "CSS animations fire animationend events that reveal timing information. An attacker could measure animation completion time to infer CSS selector matches (history sniffing via :visited selectors was patched, but novel timing channels emerge periodically). Keep security-sensitive UI state independent of CSS animations.",
    },
  ],
  "markdown-table": [
    {
      type: "tip",
      title: "Use alignment colons for cleaner data presentation",
      content:
        "Add colons in the separator row: :--- for left-align, :---: for center, ---: for right-align. Right-align numeric columns (prices, counts, percentages) for easier comparison. This works on GitHub, GitLab, dev.to, and most Markdown renderers. It's the single most overlooked Markdown table feature.",
    },
    {
      type: "pitfall",
      title: "Markdown tables can't span rows or columns",
      content:
        "Unlike HTML tables, Markdown has no colspan or rowspan. Every cell must exist and cannot merge with neighbors. For complex layouts with merged cells, embedded HTML tables inside Markdown work on most renderers — but lose the clean syntax benefit. Consider restructuring your data to avoid the need for merges.",
    },
    {
      type: "example",
      title: "Pipe characters in cell content must be escaped",
      content:
        "To include a literal | in a Markdown table cell, use the HTML entity &#124; or escape it as \\|. This catches many developers when documenting shell commands (piping), regular expressions, or TypeScript union types. Most Markdown editors don't auto-escape pipes in table mode.",
    },
    {
      type: "security",
      title: "Markdown tables can contain injected links and images",
      content:
        "User-generated Markdown tables can include [phishing](https://evil.com) links or ![tracking pixel](https://evil.com/track) images that load when rendered. If rendering user Markdown, sanitize the output with allowlisted URL schemes (https only) and consider blocking external image URLs.",
    },
  ],
  "text-binary": [
    {
      type: "tip",
      title: "ASCII uses only 7 bits — the 8th bit enabled character sets",
      content:
        "Original ASCII maps 128 characters to 7-bit values (0-127). The 8th bit was unused, leading to dozens of incompatible extensions (Latin-1, Windows-1252, etc.) that each mapped 128-255 differently. UTF-8 solved this by using variable-length encoding: 1 byte for ASCII, 2-4 bytes for everything else. Always use UTF-8.",
    },
    {
      type: "pitfall",
      title: "Emoji and CJK characters are 3-4 bytes in UTF-8",
      content:
        "The string '😀' is 1 character but 4 bytes in UTF-8. 'Hello 😀' is 7 characters but 10 bytes. Database VARCHAR(10) might reject it if measured in bytes. JavaScript's String.length counts UTF-16 code units: '😀'.length === 2. Use Array.from('😀').length for true character count.",
    },
    {
      type: "example",
      title: "Binary representation reveals bitwise operations visually",
      content:
        "Seeing 5 (0101) AND 3 (0011) = 1 (0001) in binary makes bitwise operations intuitive. This is invaluable for understanding permission bitmasks (Unix chmod 755 = 111 101 101), IP subnet masks (255.255.255.0 = 24 ones followed by 8 zeros), and flag enums.",
    },
    {
      type: "security",
      title: "Unicode homoglyphs enable phishing attacks",
      content:
        "The Cyrillic 'а' (U+0430) looks identical to Latin 'a' (U+0061) but is a different byte sequence. Attackers use homoglyphs to create convincing phishing URLs (pаypal.com) and bypass text filters. Always validate domains using Punycode (xn-- prefix) and normalize Unicode input with NFC or NFKC before comparison.",
    },
  ],
  "meta-tag-generator": [
    {
      type: "tip",
      title: "Title tags should be 50-60 characters for full SERP display",
      content:
        "Google displays approximately 50-60 characters (or 600px) of your title tag. Longer titles get truncated with an ellipsis, losing your call-to-action or brand name. Front-load your primary keyword. Format: Primary Keyword — Secondary Keyword | Brand. Unique titles per page are essential.",
    },
    {
      type: "pitfall",
      title: "Duplicate meta descriptions across pages hurt SEO",
      content:
        "Google treats duplicate meta descriptions as a signal of low-quality or auto-generated content. Each page needs a unique 150-160 character description that accurately summarizes the content and includes a natural call-to-action. If you can't write unique descriptions, it's better to omit them and let Google auto-generate.",
    },
    {
      type: "example",
      title: "Open Graph tags control how your pages appear when shared",
      content:
        "og:title, og:description, og:image, and og:url are the four essential Open Graph tags. Without them, social platforms extract random text and images from your page. The og:image should be 1200x630px for optimal display on Facebook, LinkedIn, and Twitter. Add twitter:card: summary_large_image for full-width Twitter previews.",
    },
    {
      type: "security",
      title: "Meta tags can expose internal infrastructure",
      content:
        "The <meta name=\"generator\"> tag reveals your CMS and version (e.g., WordPress 6.4). <meta name=\"author\"> exposes employee names for social engineering. The referrer-policy meta tag controls what URL information is sent to external sites. Set referrer-policy to strict-origin-when-cross-origin to prevent URL leakage.",
    },
  ],
  "json-schema": [
    {
      type: "tip",
      title: "Use $ref to keep schemas DRY and maintainable",
      content:
        "Instead of repeating the same address object definition in user, order, and shipping schemas, define it once in $defs and reference it: {\"$ref\": \"#/$defs/address\"}. This mirrors how TypeScript interfaces work. Changes to the address schema automatically propagate to all references.",
    },
    {
      type: "pitfall",
      title: "additionalProperties defaults to true — your schema allows anything",
      content:
        "Without \"additionalProperties\": false, a schema requiring {name, email} happily accepts {name, email, isAdmin: true}. This is a common source of mass assignment vulnerabilities. Always set additionalProperties explicitly. Use \"additionalProperties\": false in strict APIs and true only when extensibility is intentional.",
    },
    {
      type: "example",
      title: "Combine allOf, oneOf, anyOf for complex validation",
      content:
        "allOf: all schemas must match (intersection, like TypeScript &). oneOf: exactly one must match (discriminated union). anyOf: at least one must match (union, like TypeScript |). Use oneOf with a discriminator field for tagged unions: {\"oneOf\": [{type: \"card\"}, {type: \"bank\"}], \"discriminator\": {\"propertyName\": \"type\"}}.",
    },
    {
      type: "security",
      title: "Validate schema constraints server-side, not just client-side",
      content:
        "Client-side JSON Schema validation improves UX but provides zero security. Attackers bypass your frontend entirely. Every API endpoint must validate request bodies server-side against the schema. Use AJV (JavaScript), jsonschema (Python), or similar libraries as middleware in your API handler.",
    },
  ],
  "subnet-calculator": [
    {
      type: "tip",
      title: "/24 gives 254 usable hosts — the standard small network",
      content:
        "A /24 subnet (255.255.255.0) provides 256 addresses with 254 usable for hosts (network and broadcast addresses are reserved). For most office LANs and VPCs, /24 is the right starting point. /16 gives ~65K hosts (large campus), /8 gives ~16M (enterprise backbone). Memorize /24, /16, /8 — derive others from there.",
    },
    {
      type: "pitfall",
      title: "Private IP ranges overlap — plan before peering VPCs",
      content:
        "RFC 1918 defines 10.0.0.0/8, 172.16.0.0/12, and 192.168.0.0/16 as private. When connecting two VPCs or VPNs, overlapping CIDR blocks cause routing conflicts. If both use 10.0.0.0/16, you can't peer them. Plan non-overlapping ranges from day one: 10.1.0.0/16 for production, 10.2.0.0/16 for staging, etc.",
    },
    {
      type: "example",
      title: "Use /32 for single-host allow rules in security groups",
      content:
        "In AWS security groups, GCP firewall rules, or iptables, 203.0.113.5/32 means exactly one IP address. Use /32 for bastion host SSH rules and admin panel access. Common mistake: using /24 or /16 when you meant to restrict to a single IP, accidentally allowing 254 or 65K addresses.",
    },
    {
      type: "security",
      title: "IPv6 /128 is the equivalent of IPv4 /32",
      content:
        "In IPv6, a /128 prefix identifies a single host. The standard subnet allocation is /64 (18 quintillion addresses per subnet). ISPs typically assign /48 to businesses and /56 to residential customers. Never run IPv6 without a firewall — the myth that NAT provided security in IPv4 does not apply.",
    },
  ],
  "gitignore-generator": [
    {
      type: "tip",
      title: "Commit .gitignore before your first code commit",
      content:
        "Once a file is tracked by git, adding it to .gitignore won't untrack it. You must git rm --cached filename first. Start every project with a proper .gitignore to avoid accidentally committing node_modules, .env, build artifacts, or IDE config. GitHub's template collection (github/gitignore) covers most languages and frameworks.",
    },
    {
      type: "pitfall",
      title: "Negation patterns (!file) don't re-include files in ignored directories",
      content:
        "If you ignore dist/ and then try to include dist/important.js with !dist/important.js, it won't work. Git doesn't look inside ignored directories at all. You'd need to ignore dist/* (contents only, not the directory itself) and then negate. This subtle distinction causes many .gitignore bugs.",
    },
    {
      type: "security",
      title: "Always ignore .env and credential files",
      content:
        "The #1 cause of leaked secrets on GitHub is missing .gitignore entries for .env, .env.local, credentials.json, *.pem, and *.key files. Add these entries to your global .gitignore (~/.gitignore_global) so they're ignored across all projects. Use git-secrets or trufflehog as pre-commit hooks for additional safety.",
    },
    {
      type: "example",
      title: "Use global .gitignore for IDE and OS files",
      content:
        "Files like .DS_Store (macOS), Thumbs.db (Windows), .idea/ (JetBrains), .vscode/ (VS Code) are user-specific, not project-specific. Configure a global gitignore: git config --global core.excludesfile ~/.gitignore_global. This keeps project .gitignore clean and focused on language/framework patterns.",
    },
  ],
  "cron-parser": [
    {
      type: "tip",
      title: "Use @weekly, @daily, @hourly shortcuts for common schedules",
      content:
        "Instead of memorizing that 0 0 * * 0 means weekly on Sunday, use @weekly. Cron supports @yearly (Jan 1), @monthly (1st), @weekly (Sunday), @daily (midnight), @hourly, and @reboot. These are self-documenting and less error-prone. Supported in most cron implementations including crond, systemd timers, and GitHub Actions.",
    },
    {
      type: "pitfall",
      title: "Day-of-week numbering varies between implementations",
      content:
        "Standard cron uses 0-7 for Sunday-Saturday (both 0 and 7 are Sunday). But some systems use 1-7 (Monday-Sunday). AWS EventBridge uses 1-7 (Sunday-Saturday). Quartz (Java) uses 1-7 (Sunday-Saturday). Always check your specific platform's documentation and test the schedule before deploying.",
    },
    {
      type: "example",
      title: "Combine ranges and steps for business hours schedules",
      content:
        "Run every 15 minutes during business hours on weekdays: */15 9-17 * * 1-5. The range (9-17) limits hours, the step (*/15) sets frequency, and the day-of-week range (1-5) excludes weekends. This runs 36 times per day instead of 96 — a significant difference for rate-limited operations.",
    },
    {
      type: "security",
      title: "Cron jobs run with the scheduling user's full permissions",
      content:
        "A cron job added to root's crontab runs as root. If the script it executes is writable by other users, they can escalate privileges by modifying the script. Always ensure cron script files are owned by the cron user and not world-writable (chmod 700). Audit crontabs regularly with crontab -l.",
    },
  ],
  "cron-generator": [
    {
      type: "tip",
      title: "Stagger cron jobs to avoid thundering herd problems",
      content:
        "If 50 cron jobs all run at 0 * * * * (top of every hour), they compete for CPU, memory, and network simultaneously. Stagger them: use random minute offsets (7 * * * *, 23 * * * *, 41 * * * *) or hash-based scheduling. Cloud services like AWS often add jitter to prevent customer cron storms.",
    },
    {
      type: "pitfall",
      title: "Cron doesn't handle missed executions",
      content:
        "If your server was down when a daily backup job was scheduled to run, cron doesn't run it when the server comes back up. Use anacron for laptops and intermittently connected machines — it tracks the last run date and executes missed jobs. For cloud, use managed schedulers (AWS EventBridge, Cloud Scheduler) with retry policies.",
    },
    {
      type: "example",
      title: "Lock your cron jobs to prevent overlapping runs",
      content:
        "A cron job running every minute that takes 3 minutes to complete will have 3 concurrent instances. Use flock: * * * * * flock -n /tmp/myjob.lock /path/to/script.sh. The -n flag makes flock exit immediately if the lock is held. This prevents data corruption, duplicate emails, and resource exhaustion.",
    },
    {
      type: "security",
      title: "Redirect cron output or it becomes email",
      content:
        "By default, cron emails all stdout/stderr to the cron user. This can expose sensitive data in email logs and fill mail queues. Redirect output: */5 * * * * /path/to/job >> /var/log/myjob.log 2>&1. Set MAILTO=\"\" in crontab to disable emails entirely, then use proper log aggregation instead.",
    },
  ],
  "favicon-generator": [
    {
      type: "tip",
      title: "You need at least 3 sizes: 32x32, 180x180, and 192x192",
      content:
        "favicon.ico (32x32) for browser tabs, apple-touch-icon.png (180x180) for iOS home screen, and icon-192.png / icon-512.png for Android PWA manifest. Most generators produce 10+ sizes, but these three cover 95% of use cases. Use SVG favicon for modern browsers: <link rel=\"icon\" type=\"image/svg+xml\" href=\"icon.svg\">.",
    },
    {
      type: "pitfall",
      title: "Favicon caching is extremely aggressive",
      content:
        "Browsers cache favicons for days or weeks, ignoring standard Cache-Control headers. After updating your favicon, users may see the old one for a long time. Bust the cache by changing the filename (favicon-v2.png) or adding a query parameter (?v=2) to the link tag. Chrome requires clearing the favicon cache at chrome://favicon/.",
    },
    {
      type: "example",
      title: "SVG favicons support dark mode with @media queries",
      content:
        "An SVG favicon can include <style>@media (prefers-color-scheme: dark) { ... }</style> to show a different color in dark mode. No other format supports this. The SVG can also use currentColor to inherit theme colors. Browser support is excellent: Chrome 80+, Firefox 41+, Safari 15+.",
    },
    {
      type: "security",
      title: "Favicons can track users across sites",
      content:
        "The 'supercookie' technique uses favicon cache entries as a fingerprinting vector. By serving unique favicons per user and checking which cached versions a browser requests, trackers can identify users even after cookie deletion. Modern browsers are mitigating this by partitioning favicon caches by top-level site.",
    },
  ],
  "slug-generator": [
    {
      type: "tip",
      title: "Keep slugs under 75 characters for SEO",
      content:
        "Google displays about 75 characters of URL in search results before truncating. Shorter slugs are easier to share, copy, and remember. Remove stop words (the, a, an, in, of, for) and use 3-5 keywords maximum: /tools/json-formatter not /tools/the-best-json-formatter-and-validator-tool-for-developers.",
    },
    {
      type: "pitfall",
      title: "Changing slugs breaks existing links — always redirect",
      content:
        "Every external link, bookmark, and search engine index points to your current URL. Changing a slug without a 301 redirect creates 404 errors and loses accumulated SEO authority. In Next.js, add redirects in next.config.ts. Always maintain a redirect map for renamed pages.",
    },
    {
      type: "example",
      title: "Handle Unicode slugs with transliteration, not removal",
      content:
        "\"Über die Brücke\" should become uber-die-brucke, not -die-br-cke. Use a transliteration library (speakingurl, limax, slugify) that converts ü→u, ñ→n, é→e, ø→o. For CJK content, consider Pinyin romanization or keeping Unicode in the URL (modern browsers display it properly).",
    },
    {
      type: "security",
      title: "Validate slugs to prevent path traversal",
      content:
        "User-generated slugs like ../../../etc/passwd or ..\\windows\\system32 can enable directory traversal if used directly in file paths. Always sanitize: remove dots, slashes, and backslashes. Validate against a strict regex like /^[a-z0-9]+(?:-[a-z0-9]+)*$/ and never use slugs to construct file system paths without validation.",
    },
  ],
  "curl-converter": [
    {
      type: "tip",
      title: "Use -v (verbose) to debug request/response headers",
      content:
        "curl -v shows the full HTTP conversation: DNS resolution, TLS handshake, request headers, response headers, and body. Lines prefixed with > are sent, < are received, * are connection info. For HTTPS debugging, this reveals certificate issues, redirect chains, and header mismatches that -i alone doesn't show.",
    },
    {
      type: "pitfall",
      title: "Shell quoting differs between Bash, Zsh, and PowerShell",
      content:
        "curl -H 'Content-Type: application/json' works in Bash but fails in PowerShell (which uses different quoting). Windows cmd uses double quotes only. When converting cURL commands, always consider the target shell. Use -H \"Content-Type: application/json\" for maximum cross-platform compatibility.",
    },
    {
      type: "example",
      title: "Extract cURL commands from browser DevTools",
      content:
        "In Chrome/Firefox/Edge DevTools Network tab: right-click any request → Copy → Copy as cURL. This captures the exact headers, cookies, and authentication the browser sent. Paste it into DevBolt's converter to get equivalent Python, JavaScript, Go, or PHP code with all headers preserved.",
    },
    {
      type: "security",
      title: "cURL commands in documentation often contain real credentials",
      content:
        "Developers frequently paste cURL commands with Bearer tokens, API keys, or Basic auth into Slack, GitHub issues, and Stack Overflow. These credentials are harvestable by bots. Always replace real credentials with placeholders (YOUR_API_KEY) before sharing. Use environment variables: curl -H \"Authorization: Bearer $API_KEY\".",
    },
  ],
  "json-to-csv": [
    {
      type: "tip",
      title: "Flatten nested objects before converting to CSV",
      content:
        "CSV is inherently flat — there are no nested columns. When converting JSON with nested objects, flatten keys using dot notation (user.address.city → user_address_city). This preserves the data hierarchy in column names while keeping the output importable into Excel, Google Sheets, and databases.",
    },
    {
      type: "pitfall",
      title: "Commas and newlines inside values break naive CSV parsers",
      content:
        "If a JSON string value contains commas, quotes, or newlines, the CSV cell must be wrapped in double quotes with internal quotes escaped as \"\". Many hand-rolled CSV converters skip this, producing corrupt files that import incorrectly into spreadsheets and databases.",
    },
    {
      type: "example",
      title: "Export API responses to CSV for stakeholder reports",
      content:
        "Product managers and data analysts often need API data in spreadsheets. Converting a /api/users JSON response to CSV lets them build pivot tables and charts in Excel without writing code. Use consistent field ordering so the columns align across exports.",
    },
    {
      type: "security",
      title: "CSV injection can execute formulas in spreadsheets",
      content:
        "If JSON values start with =, +, -, or @, Excel and Google Sheets interpret them as formulas. A malicious value like '=HYPERLINK(\"http://evil.com\",\"Click\")' can execute when opened. Prefix dangerous values with a single quote or tab character before CSV export.",
    },
  ],
  "json-to-code": [
    {
      type: "tip",
      title: "Use generated types as a starting point, not the final schema",
      content:
        "Auto-generated Go structs, Python dataclasses, and Rust structs infer types from sample data. A field with value 1 might be inferred as int when it should be float, or a missing nullable field won't be marked as optional. Always review generated types against your API documentation.",
    },
    {
      type: "pitfall",
      title: "Sample data may not represent all possible field types",
      content:
        "If your JSON sample has a null field, the generator can't determine the actual type (string? object?). If a field is sometimes an array and sometimes null, the generated type might miss the array case. Use the most complete sample data available — ideally from API docs, not a single response.",
    },
    {
      type: "example",
      title: "Generate Go structs with json tags from API responses",
      content:
        "Paste a JSON API response to get Go structs with correct json:\"fieldName\" tags. Go uses PascalCase for exported fields but APIs use camelCase or snake_case — the generated tags handle this mapping automatically, saving tedious manual struct creation.",
    },
    {
      type: "security",
      title: "Never expose internal fields in generated API types",
      content:
        "When generating types from a database record JSON, internal fields like password_hash, internal_id, or is_admin may appear. Remove these from your public-facing types. Use separate request/response types rather than sharing one struct that accidentally exposes sensitive fields.",
    },
  ],
  "json-to-sql": [
    {
      type: "tip",
      title: "Use transactions for multi-row INSERT statements",
      content:
        "When converting a JSON array to INSERT statements, wrap them in BEGIN/COMMIT. Without a transaction, a failure mid-import leaves your database in a partial state — some rows inserted, others missing. Transactions ensure all-or-nothing atomicity.",
    },
    {
      type: "pitfall",
      title: "Auto-inferred SQL types may not match your schema",
      content:
        "A JSON number 42 could be INTEGER, BIGINT, or NUMERIC depending on context. A date string might be DATE, TIMESTAMP, or VARCHAR. Always verify the generated CREATE TABLE types match your intended schema, especially for IDs (UUID vs SERIAL) and monetary values (NUMERIC vs FLOAT).",
    },
    {
      type: "example",
      title: "Seed a development database from JSON fixtures",
      content:
        "Keep test data as JSON files in your repo, convert to SQL for seeding dev/staging databases. This workflow is common with tools like Prisma seed scripts. JSON fixtures are easier to read and edit than raw SQL INSERT statements.",
    },
    {
      type: "security",
      title: "Sanitize string values to prevent SQL injection",
      content:
        "Generated INSERT statements should properly escape single quotes in string values (O'Brien → O''Brien). If you're using the generated SQL in application code rather than direct database import, prefer parameterized queries instead of string-interpolated INSERT statements.",
    },
  ],
  "json-to-graphql": [
    {
      type: "tip",
      title: "Use custom scalar types for dates and IDs",
      content:
        "GraphQL has no built-in Date or DateTime type. When generating a schema from JSON with date strings, define custom scalars (scalar DateTime) rather than using String. This enables proper validation and serialization with libraries like graphql-scalars.",
    },
    {
      type: "pitfall",
      title: "Nullable vs non-null defaults matter for schema evolution",
      content:
        "Making all fields non-null (String!) in your generated schema is strict but dangerous — adding a new nullable field later is a breaking change for clients expecting non-null. Start with nullable fields by default and only add ! for fields you're certain will always be present.",
    },
    {
      type: "example",
      title: "Generate a schema from your REST API responses",
      content:
        "Migrating from REST to GraphQL? Paste your existing REST JSON responses to get a starting GraphQL schema. This captures the current data shape and lets you iterate on the schema design before writing resolvers.",
    },
    {
      type: "security",
      title: "Limit query depth to prevent denial-of-service",
      content:
        "Deeply nested GraphQL types (User → Posts → Comments → Author → Posts...) allow recursive queries that can overwhelm your server. After generating your schema, configure query depth limiting (typically 7-10 levels max) using graphql-depth-limit or similar middleware.",
    },
  ],
  "json-to-zod": [
    {
      type: "tip",
      title: "Add .transform() for runtime data coercion",
      content:
        "Generated Zod schemas validate shape, but API data often needs transformation — date strings to Date objects, string numbers to actual numbers, empty strings to null. Chain .transform() after .parse() to clean data in the same step as validation.",
    },
    {
      type: "pitfall",
      title: "z.infer<typeof schema> doesn't capture .transform() output types",
      content:
        "z.infer gives you the input type. If your schema uses .transform(), you need z.output<typeof schema> for the transformed type. Using z.infer with transforms means your TypeScript types won't match the actual runtime values.",
    },
    {
      type: "example",
      title: "Validate API responses at the boundary",
      content:
        "Parse every external API response through a Zod schema: const data = UserSchema.parse(await res.json()). This catches type mismatches immediately at the boundary rather than letting bad data propagate through your app and cause cryptic errors downstream.",
    },
    {
      type: "security",
      title: "Use .strict() to reject unexpected fields",
      content:
        "By default, Zod strips unknown keys. If an attacker sends extra fields (isAdmin: true, role: 'superuser'), they're silently removed. But if you spread the parsed object into a database query, those fields might sneak through. Use .strict() to throw on unexpected fields instead of silently dropping them.",
    },
  ],
  "json-visualizer": [
    {
      type: "tip",
      title: "Collapse to depth 2 for a structural overview",
      content:
        "Large JSON responses can have hundreds of nodes. Collapsing to depth 2 gives you the top-level structure — what keys exist, which are objects vs arrays — without drowning in leaf values. Expand individual branches to explore specific sections.",
    },
    {
      type: "pitfall",
      title: "Large JSON files (10MB+) can freeze browser-based viewers",
      content:
        "Tree rendering creates DOM nodes for every key-value pair. A 50,000-node JSON tree can make the browser unresponsive. For large files, use the search feature to find specific paths rather than expanding the entire tree, or filter the JSON to the relevant subset first.",
    },
    {
      type: "example",
      title: "Copy JSON paths for use in code",
      content:
        "Hover over any node to see its full path (e.g., data.users[0].address.city). Copy this path directly into your JavaScript (obj.data.users[0].address.city), Python (data['users'][0]['address']['city']), or jq (.data.users[0].address.city) code.",
    },
    {
      type: "security",
      title: "Inspect API responses for accidentally exposed data",
      content:
        "Use the tree view to audit API responses for fields that shouldn't be public: password hashes, internal IDs, email addresses, API keys, or admin flags. It's easier to spot sensitive fields in a visual tree than in raw JSON text.",
    },
  ],
  "json-diff": [
    {
      type: "tip",
      title: "Sort object keys before diffing for meaningful comparisons",
      content:
        "JSON object key order is not guaranteed by the spec. Two semantically identical objects with different key ordering will show as completely different in a naive diff. Sort keys alphabetically before comparing to focus on actual value changes rather than ordering noise.",
    },
    {
      type: "pitfall",
      title: "Array diffs are order-sensitive by default",
      content:
        "Moving an item from index 0 to index 5 in a JSON array appears as a deletion and an addition, not a move. If your arrays represent unordered sets (e.g., tags, roles), sort them first. For ordered sequences (timeline events), the positional diff is correct.",
    },
    {
      type: "example",
      title: "Compare API responses across environments",
      content:
        "Diff the JSON response from staging vs production for the same endpoint to catch environment-specific bugs: missing fields, different default values, or schema version mismatches. This is faster than manually reading two large response bodies.",
    },
    {
      type: "security",
      title: "Diff config files before deploying to catch unintended changes",
      content:
        "Before deploying updated Kubernetes manifests, Terraform state, or application config, diff the old vs new JSON/YAML. This review step catches accidental permission escalations, removed security headers, or disabled authentication flags that might slip through in large config files.",
    },
  ],
  "json-xml": [
    {
      type: "tip",
      title: "Use consistent root and item element names",
      content:
        "JSON-to-XML conversion requires choosing element names for arrays and the root element. Use descriptive names (<users><user>...</user></users>) rather than generic ones (<root><item>...</item></root>). This makes the XML self-documenting and easier to query with XPath.",
    },
    {
      type: "pitfall",
      title: "JSON arrays and XML have a fundamental mismatch",
      content:
        "JSON has native arrays: [1, 2, 3]. XML represents arrays as repeated sibling elements: <item>1</item><item>2</item><item>3</item>. Converting XML back to JSON, there's ambiguity: is a single <item> a one-element array or a standalone element? Different converters make different choices.",
    },
    {
      type: "example",
      title: "Convert REST API JSON to XML for SOAP/legacy system integration",
      content:
        "Many enterprise systems (banking, healthcare, government) still require XML/SOAP. Converting modern REST JSON responses to XML bridges the gap when integrating with legacy systems without rewriting the upstream API.",
    },
    {
      type: "security",
      title: "XML External Entity (XXE) attacks don't apply to generated XML",
      content:
        "XXE vulnerabilities occur when XML parsers process external entity declarations in untrusted input. When generating XML from JSON, the output contains no DOCTYPE or entity declarations, so it's safe. However, if you're parsing XML input, always disable external entity resolution in your parser.",
    },
  ],
  "json-mock-generator": [
    {
      type: "tip",
      title: "Use realistic data types for each field",
      content:
        "Names, emails, addresses, and UUIDs each have distinct formats. Using random strings for all fields makes mocks unrealistic and hides bugs — a regex-validated email field won't catch issues if your mock always generates 'test@test.com'. Use field-specific generators for realistic test data.",
    },
    {
      type: "pitfall",
      title: "Mock data with identical patterns creates false confidence",
      content:
        "If all mock users have the same country, language, or timezone, you won't catch i18n bugs. If all dates are in the same month, date boundary bugs hide. Ensure mocks include edge cases: different locales, DST transitions, Unicode names (é, ñ, 中文), and empty/null optional fields.",
    },
    {
      type: "example",
      title: "Generate 500 rows to stress-test pagination and search",
      content:
        "Test your frontend table component with 500 realistic rows to verify pagination, virtual scrolling, sorting, and filtering all work under load. This catches performance issues that don't appear with 5-row toy datasets.",
    },
    {
      type: "security",
      title: "Never use mock data generators to create fake production records",
      content:
        "Generated data should only be used in development and testing environments. Inserting fake records into production databases (even 'test' accounts) can violate data integrity, skew analytics, and create compliance issues. Use feature flags or separate environments instead.",
    },
  ],
  "html-markdown": [
    {
      type: "tip",
      title: "Clean up HTML before converting for best Markdown output",
      content:
        "Rich text editors (Google Docs, Word, Notion) export HTML full of inline styles, empty spans, and nested divs. Strip these before converting — Markdown has no concept of font colors or spacing divs. The cleaner the HTML input, the more readable the Markdown output.",
    },
    {
      type: "pitfall",
      title: "HTML tables convert poorly to Markdown",
      content:
        "Markdown tables don't support colspan, rowspan, cell alignment, or nested elements. Complex HTML tables with merged cells or nested lists convert to pipe tables that lose structure. For complex tables, consider keeping them as raw HTML blocks within your Markdown.",
    },
    {
      type: "example",
      title: "Migrate blog content from WordPress to Markdown-based platforms",
      content:
        "Export WordPress posts as HTML, then convert to Markdown for Gatsby, Hugo, Astro, or Next.js MDX blogs. Batch-convert all posts, then manually review headings, images (update paths), and code blocks that may need syntax highlighting hints added.",
    },
    {
      type: "security",
      title: "Markdown-to-HTML renders can introduce XSS if not sanitized",
      content:
        "Raw HTML is valid Markdown — a Markdown file containing <script>alert('xss')</script> will execute when rendered. Always use a sanitizing Markdown renderer (like DOMPurify + marked) that strips script tags, event handlers, and javascript: URLs from the HTML output.",
    },
  ],
  "html-to-jsx": [
    {
      type: "tip",
      title: "class → className is just the start",
      content:
        "Beyond class → className, HTML-to-JSX conversion handles 50+ attribute renames: for → htmlFor, tabindex → tabIndex, onclick → onClick, stroke-width → strokeWidth, and all SVG attributes. Missing even one causes React warnings and broken functionality.",
    },
    {
      type: "pitfall",
      title: "Inline style strings must become objects",
      content:
        "HTML: style=\"margin-top: 10px; background-color: red\". JSX: style={{ marginTop: '10px', backgroundColor: 'red' }}. The conversion involves camelCasing every CSS property and wrapping values as strings. Numeric values (except unitless ones like zIndex) need string quotes.",
    },
    {
      type: "example",
      title: "Port HTML email templates to React Email or MJML",
      content:
        "Email templates are notoriously HTML-heavy with inline styles and legacy attributes. Converting to JSX is the first step toward using React Email, which lets you build email templates with components. Convert the HTML, then extract repeated patterns into reusable React components.",
    },
    {
      type: "security",
      title: "innerHTML → dangerouslySetInnerHTML is intentionally scary",
      content:
        "React renamed innerHTML to dangerouslySetInnerHTML as a warning. If your HTML uses innerHTML, the converter preserves it — but you should replace it with proper React components. Rendering user-supplied HTML via dangerouslySetInnerHTML is the #1 source of XSS in React apps.",
    },
  ],
  "html-table-generator": [
    {
      type: "tip",
      title: "Use <thead>, <tbody>, and <th> for accessible tables",
      content:
        "Screen readers use table structure to navigate. <thead> with <th> headers lets assistive technology announce column names as users move through cells. Without semantic markup, a table is just a grid of anonymous values. Always use proper table sections even for simple tables.",
    },
    {
      type: "pitfall",
      title: "Tables are not responsive by default",
      content:
        "HTML tables overflow on mobile screens because they don't shrink below their content width. Wrap tables in a container with overflow-x: auto for horizontal scrolling, or use CSS to stack columns vertically on small screens. Never use tables for page layout — use CSS Grid or Flexbox.",
    },
    {
      type: "example",
      title: "Generate comparison tables for documentation sites",
      content:
        "Pricing pages, feature comparison matrices, and API reference tables are everywhere in docs. Generate the HTML with proper headers and captions, then style with your framework's table classes (Tailwind's divide-y, Bootstrap's table-striped) for consistent appearance.",
    },
    {
      type: "security",
      title: "Escape user data rendered in table cells",
      content:
        "If table content comes from user input or external APIs, HTML-encode special characters (<, >, &, \") before rendering in cells. Unescaped content like <img onerror=alert(1)> in a table cell is a stored XSS vulnerability.",
    },
  ],
  "docker-compose": [
    {
      type: "tip",
      title: "Always pin image versions — never use :latest in production",
      content:
        "image: postgres:latest means your dev, staging, and production environments can run different Postgres versions. Pin to a specific version (postgres:16.2-alpine) for reproducible builds. Use Docker Compose's extends feature or .env files to manage version numbers centrally.",
    },
    {
      type: "pitfall",
      title: "depends_on only waits for container start, not readiness",
      content:
        "depends_on: [db] starts the database container before your app, but doesn't wait for it to accept connections. Your app will crash connecting to a database that's still initializing. Use healthcheck + condition: service_healthy, or add retry logic in your app's database connection code.",
    },
    {
      type: "example",
      title: "Use named volumes for database persistence across restarts",
      content:
        "Without a named volume, docker compose down destroys your database data. Define volumes: db-data: and mount it with volumes: - db-data:/var/lib/postgresql/data. Named volumes persist across container lifecycle changes. Use docker compose down -v only when you intentionally want to reset data.",
    },
    {
      type: "security",
      title: "Never hardcode secrets in docker-compose.yml",
      content:
        "Environment variables with passwords (POSTGRES_PASSWORD: mysecret) get committed to version control. Use env_file: .env with .env in .gitignore, or Docker Secrets for Swarm mode. For local development, docker compose supports a .env file that's automatically loaded.",
    },
  ],
  "dockerfile-validator": [
    {
      type: "tip",
      title: "Order layers from least to most frequently changing",
      content:
        "Docker caches layers sequentially — a change invalidates all subsequent layers. Put OS packages and dependencies (rarely change) before your application code (changes every commit). This pattern: COPY package.json → RUN npm install → COPY . means npm install is cached unless package.json changes.",
    },
    {
      type: "pitfall",
      title: "Running as root inside containers is a critical security risk",
      content:
        "By default, Dockerfiles run as root. If an attacker exploits your app, they have root access inside the container (and potentially escape to the host). Always add USER nonroot after installing dependencies. Many base images (gcr.io/distroless) run as non-root by default.",
    },
    {
      type: "example",
      title: "Use multi-stage builds to reduce image size by 90%",
      content:
        "A Node.js app with devDependencies can produce a 1.5 GB image. Multi-stage build: stage 1 installs and builds (FROM node:20 AS builder), stage 2 copies only the output (FROM node:20-slim, COPY --from=builder /app/dist). Final image: ~150 MB with no build tools, source code, or devDependencies.",
    },
    {
      type: "security",
      title: "Scan your Dockerfile for known vulnerabilities",
      content:
        "Use hadolint for Dockerfile best practices and docker scout or trivy for vulnerability scanning of base images. Alpine-based images have fewer CVEs than Ubuntu/Debian bases. Pin base images with digest (@sha256:...) to prevent supply chain attacks via tag hijacking.",
    },
  ],
  "k8s-validator": [
    {
      type: "tip",
      title: "Always set resource requests and limits",
      content:
        "Without resource limits, a single pod can consume all CPU/memory on a node, killing other workloads. Set requests (guaranteed minimum) and limits (hard ceiling) for every container: resources: { requests: { cpu: 100m, memory: 128Mi }, limits: { cpu: 500m, memory: 512Mi } }.",
    },
    {
      type: "pitfall",
      title: "Missing liveness probes cause zombie pods",
      content:
        "Without a livenessProbe, Kubernetes doesn't know if your app is deadlocked. The pod stays 'Running' while serving zero requests. Add an HTTP or TCP liveness probe that checks actual application health, not just that the process is alive. Set initialDelaySeconds high enough for startup.",
    },
    {
      type: "example",
      title: "Use readinessProbe to prevent traffic to unhealthy pods",
      content:
        "During deployment, new pods receive traffic immediately even if they're still loading config or warming caches. A readinessProbe tells the Service to wait until the pod is ready. This prevents 502/503 errors during rollouts. Use a /healthz endpoint that checks dependencies (DB, cache).",
    },
    {
      type: "security",
      title: "Run pods as non-root with read-only filesystem",
      content:
        "Set securityContext: { runAsNonRoot: true, readOnlyRootFilesystem: true, allowPrivilegeEscalation: false }. This limits the blast radius of container escapes. Use emptyDir volumes for any paths that need write access (tmp, logs). Most app containers don't need to write to the root filesystem.",
    },
  ],
  "nginx-config": [
    {
      type: "tip",
      title: "Enable gzip for text-based assets to save 60-80% bandwidth",
      content:
        "Add gzip on; with gzip_types text/plain text/css application/json application/javascript text/xml. Don't gzip images or already-compressed files (gzip_min_length 256). For modern browsers, consider adding Brotli (ngx_brotli) for an additional 15-20% improvement over gzip.",
    },
    {
      type: "pitfall",
      title: "proxy_pass with a trailing slash behaves differently",
      content:
        "proxy_pass http://backend/ (with slash) strips the location prefix. proxy_pass http://backend (without slash) preserves it. Example: location /api/ with proxy_pass http://backend/ forwards /api/users as /users. Without the slash, it forwards as /api/users. This subtle difference causes routing bugs.",
    },
    {
      type: "example",
      title: "Serve SPAs with try_files for client-side routing",
      content:
        "Single-page apps need all routes to serve index.html: location / { try_files $uri $uri/ /index.html; }. This serves existing static files directly but falls back to index.html for any path your JavaScript router handles. Without this, refreshing /dashboard returns a 404.",
    },
    {
      type: "security",
      title: "Hide Nginx version and add security headers",
      content:
        "server_tokens off; hides the Nginx version from response headers. Add add_header X-Content-Type-Options nosniff; add_header X-Frame-Options DENY; add_header Referrer-Policy strict-origin-when-cross-origin; to prevent MIME sniffing, clickjacking, and referrer leakage. Use DevBolt's Security Headers tool for the full set.",
    },
  ],
  "security-headers": [
    {
      type: "tip",
      title: "Start with Strict-Transport-Security and Content-Type-Options",
      content:
        "HSTS (Strict-Transport-Security: max-age=63072000; includeSubDomains) forces HTTPS and prevents SSL stripping attacks. X-Content-Type-Options: nosniff prevents browsers from MIME-sniffing responses as executable scripts. These two headers are the highest impact and lowest risk to add.",
    },
    {
      type: "pitfall",
      title: "Don't set HSTS includeSubDomains if you have HTTP-only subdomains",
      content:
        "HSTS with includeSubDomains forces HTTPS on every subdomain. If staging.example.com or internal.example.com uses plain HTTP, those sites become unreachable. Start with the main domain only, verify all subdomains support HTTPS, then add includeSubDomains.",
    },
    {
      type: "example",
      title: "Test your headers with SecurityHeaders.com before deploying",
      content:
        "Configure your headers in DevBolt's generator, deploy them to staging, then scan with securityheaders.com to verify they're applied correctly. Many headers are silently ignored if the syntax is wrong. A B+ grade or higher indicates solid security posture.",
    },
    {
      type: "security",
      title: "Permissions-Policy replaces the deprecated Feature-Policy",
      content:
        "Permissions-Policy: camera=(), microphone=(), geolocation=() blocks your site (and embedded iframes) from accessing sensitive device APIs. Even if your app doesn't use these features, blocking them prevents any injected third-party script from silently activating the camera or microphone.",
    },
  ],
  "csp-builder": [
    {
      type: "tip",
      title: "Start with Content-Security-Policy-Report-Only",
      content:
        "A misconfigured CSP breaks your site — scripts stop loading, styles disappear, images fail. Deploy as Content-Security-Policy-Report-Only first to log violations without blocking. Monitor report-uri endpoints for a week, fix legitimate sources, then switch to enforcing mode.",
    },
    {
      type: "pitfall",
      title: "'unsafe-inline' for scripts defeats the purpose of CSP",
      content:
        "script-src 'self' 'unsafe-inline' allows any inline <script> tag, which is exactly what XSS attacks inject. Use nonces (script-src 'nonce-abc123') or hashes instead. Most frameworks (Next.js, Nuxt) support CSP nonces. 'unsafe-inline' for styles is less dangerous but still not ideal.",
    },
    {
      type: "example",
      title: "Build a CSP for Next.js with Google Analytics",
      content:
        "Start with default-src 'self'; script-src 'self' 'nonce-{random}' https://www.googletagmanager.com; img-src 'self' https://www.google-analytics.com; connect-src 'self' https://www.google-analytics.com. Next.js 14+ supports nonce-based CSP via middleware. Test with Report-Only first.",
    },
    {
      type: "security",
      title: "frame-ancestors replaces X-Frame-Options for clickjacking protection",
      content:
        "frame-ancestors 'none' (equivalent to X-Frame-Options: DENY) prevents your site from being embedded in iframes on other domains. Unlike X-Frame-Options, CSP frame-ancestors supports multiple domains and is the modern standard. Set both for backward compatibility with older browsers.",
    },
  ],
  "code-security-scanner": [
    {
      type: "tip",
      title: "Scan code before committing, not after deployment",
      content:
        "Integrate security scanning into your pre-commit hooks or CI pipeline. Finding a hardcoded API key in a PR review is 100x cheaper than finding it in production logs after a breach. Shift security left — the earlier you catch vulnerabilities, the cheaper and safer the fix.",
    },
    {
      type: "pitfall",
      title: "Not all findings are exploitable — prioritize by context",
      content:
        "A scanner flags Math.random() in all contexts, but using it for CSS animation jitter is fine — only for tokens and secrets is it dangerous. Focus on critical and high severity findings first. For each finding, ask: can an attacker actually reach and exploit this code path?",
    },
    {
      type: "example",
      title: "Use scanner results to build a security checklist for AI code reviews",
      content:
        "AI code assistants (Copilot, Cursor, Claude) often generate code with hardcoded secrets, SQL injection via string concatenation, and missing input validation. Run their output through a security scanner to build a team checklist of common AI code mistakes to watch for.",
    },
    {
      type: "security",
      title: "Static analysis catches known patterns — not business logic flaws",
      content:
        "Scanners detect SQL injection, XSS, and hardcoded secrets, but they can't catch authorization bypass (user A accessing user B's data), IDOR vulnerabilities, or race conditions. Static scanning is one layer — combine with manual code review and penetration testing for complete coverage.",
    },
  ],
  "code-complexity-analyzer": [
    {
      type: "tip",
      title: "Aim for cyclomatic complexity under 10 per function",
      content:
        "Functions with complexity above 10 are hard to test and maintain. Each branch (if/else, switch case, ternary, catch) adds a test case you need to write. A function with complexity 15 needs at minimum 15 test paths. Extract helper functions or use early returns to reduce branching.",
    },
    {
      type: "pitfall",
      title: "Low complexity doesn't mean good code — it means testable code",
      content:
        "A function that calls 20 external services sequentially has low cyclomatic complexity (no branches) but is a maintenance nightmare. Complexity metrics measure one dimension of code quality. Combine with nesting depth, cognitive complexity, and function length for a complete picture.",
    },
    {
      type: "example",
      title: "Use complexity to prioritize refactoring in legacy codebases",
      content:
        "Sort functions by complexity to find the highest-risk code. Functions with complexity 25+ are the ones that cause the most bugs and take the longest to modify. Refactor these first — the ROI on reducing a function from complexity 30 to three functions of complexity 8 is enormous.",
    },
    {
      type: "security",
      title: "High complexity correlates with more vulnerabilities",
      content:
        "Research shows that functions with cyclomatic complexity above 15 are 2-3x more likely to contain security bugs. Complex branching logic hides edge cases where input validation is skipped or authorization checks are bypassed. High complexity code deserves extra security review.",
    },
  ],
  "typescript-to-js": [
    {
      type: "tip",
      title: "TypeScript enums become runtime objects — consider const enums",
      content:
        "Regular TypeScript enums compile to JavaScript objects with reverse mappings. const enums are inlined at compile time and produce no runtime code. When converting TS to JS, regular enum values become object lookups, while const enum values become literal constants.",
    },
    {
      type: "pitfall",
      title: "Type-only imports disappear and may break side effects",
      content:
        "TypeScript's type-only imports (import type { Foo }) are removed during compilation. But if you accidentally import a value as a type, the import disappears and any side effects from that module (polyfills, global registrations) stop executing. Use import type consistently to avoid confusion.",
    },
    {
      type: "example",
      title: "Strip types to share code with non-TypeScript projects",
      content:
        "Need to share a utility function with a JavaScript project? Convert it to JS rather than requiring the consumer to set up TypeScript. The core logic stays identical — you're just removing type annotations, interfaces, and generics to get portable JavaScript.",
    },
    {
      type: "security",
      title: "TypeScript's type system provides no runtime safety",
      content:
        "TypeScript types exist only at compile time. After conversion to JavaScript, there's no runtime validation. If your code relies on types to prevent invalid data (expecting a number but receiving a string), add runtime validation with Zod, io-ts, or manual checks at system boundaries.",
    },
  ],
  "graphql-to-typescript": [
    {
      type: "tip",
      title: "Generate types from the schema, not from sample responses",
      content:
        "Schema-based generation captures every possible field, nullable type, and union variant. Response-based generation only captures what appeared in one query. Use your .graphql schema files as the source of truth for comprehensive TypeScript types.",
    },
    {
      type: "pitfall",
      title: "GraphQL nullable fields should be T | null, not optional (T?)",
      content:
        "In GraphQL, a nullable field (without !) can explicitly return null. In TypeScript, field?: T means the field might be undefined (missing from the object). These are semantically different. Use field: T | null for nullable GraphQL fields to preserve the distinction.",
    },
    {
      type: "example",
      title: "Auto-generate types from your GraphQL API for end-to-end type safety",
      content:
        "Combine graphql-codegen with this converter to auto-generate TypeScript types from your GraphQL schema on every build. Your queries, mutations, and React hooks get typed automatically — changing a field name in the schema immediately surfaces type errors across your frontend.",
    },
    {
      type: "security",
      title: "Don't expose internal schema types in client-side code",
      content:
        "Generated types from your full schema may include admin-only types (AdminUser, InternalMetrics, AuditLog). Only generate client types from the public schema or specific operations. Exposing internal type names helps attackers understand your data model.",
    },
  ],
  "openapi-to-typescript": [
    {
      type: "tip",
      title: "Generate both request and response types for full coverage",
      content:
        "An OpenAPI spec defines request bodies, query parameters, path parameters, and response schemas. Generate types for all of them — not just responses. This gives you type-safe API clients where both the data you send and receive are validated at compile time.",
    },
    {
      type: "pitfall",
      title: "oneOf/anyOf/discriminatedUnion schemas need manual refinement",
      content:
        "OpenAPI's oneOf and anyOf map to TypeScript union types, but the generated unions are often too broad. If your API uses discriminated unions (type: 'email' | type: 'sms'), add a discriminator to the OpenAPI spec so the generated types include proper type narrowing.",
    },
    {
      type: "example",
      title: "Generate a type-safe API client from your Swagger spec",
      content:
        "Paste your openapi.json, generate TypeScript interfaces, then use them with a typed fetch wrapper. Every endpoint gets a function with typed parameters and return type. When the API changes, regenerate types and TypeScript immediately flags all the places your code needs to update.",
    },
    {
      type: "security",
      title: "Validate responses even with generated types",
      content:
        "Generated types provide compile-time safety but not runtime safety. A compromised or buggy API might return data that doesn't match the spec. Use Zod schemas (convert types to Zod with DevBolt's JSON to Zod tool) for runtime validation of critical API responses.",
    },
  ],
  "openapi-validator": [
    {
      type: "tip",
      title: "Validate your spec in CI to prevent drift from implementation",
      content:
        "Add OpenAPI validation to your CI pipeline. Every PR that changes routes should also update the spec. Stale specs mislead consumers, break code generation, and cause integration failures. Tools like spectral or redocly lint can enforce rules beyond basic schema validity.",
    },
    {
      type: "pitfall",
      title: "A valid spec doesn't mean a usable API",
      content:
        "Validation checks structure (valid JSON/YAML, required fields, correct $ref targets) but not quality. An API with 50 endpoints all named /do-thing-1 through /do-thing-50, no descriptions, and no examples passes validation but is unusable. Add descriptions, examples, and consistent naming.",
    },
    {
      type: "example",
      title: "Validate before publishing to API marketplaces or gateways",
      content:
        "API gateways (Kong, Apigee), documentation tools (Redoc, Swagger UI), and marketplaces (RapidAPI) all consume OpenAPI specs. An invalid spec fails silently — routes don't appear, parameters are missing, or types are wrong. Always validate before publishing to catch $ref errors and missing schemas.",
    },
    {
      type: "security",
      title: "Define security schemes for every endpoint",
      content:
        "OpenAPI specs should declare security schemes (Bearer token, API key, OAuth2) and apply them to each operation. Endpoints without a security requirement in the spec might accidentally be deployed without authentication. Use the validator to verify every endpoint has appropriate security defined.",
    },
  ],
  "sql-to-typescript": [
    {
      type: "tip",
      title: "Generate Prisma schemas for rapid prototyping, Drizzle for production control",
      content:
        "Prisma's schema is more concise and includes migrations out of the box — great for prototyping. Drizzle's schema is TypeScript-native, giving you full control over queries with zero abstraction cost. Choose based on your project maturity and performance requirements.",
    },
    {
      type: "pitfall",
      title: "SQL DECIMAL/NUMERIC types should not become TypeScript number",
      content:
        "JavaScript's number type is IEEE 754 floating point — it cannot exactly represent 0.1 + 0.2. Financial and precision-sensitive SQL columns (DECIMAL, NUMERIC, MONEY) should map to string or a Decimal library (decimal.js, Prisma Decimal) in TypeScript, not number.",
    },
    {
      type: "example",
      title: "Migrate a legacy database to a modern TypeScript ORM",
      content:
        "Export your existing database schema as CREATE TABLE statements (pg_dump --schema-only), paste into this converter, and get Prisma or Drizzle schemas. This shortcut saves hours of manually translating column types, constraints, and relationships for legacy database migrations.",
    },
    {
      type: "security",
      title: "Generated types should separate read and write interfaces",
      content:
        "A SQL table with auto-generated id, created_at, and hashed_password columns shouldn't have a single TypeScript interface. Create separate InsertUser (without id/timestamps), SelectUser (without password), and InternalUser (full row) types to prevent accidentally exposing or overwriting sensitive columns.",
    },
  ],
  "sql-playground": [
    {
      type: "tip",
      title: "Practice JOINs with the built-in sample datasets",
      content:
        "Understanding JOINs is the most important SQL skill. Use the sample datasets with related tables (users + orders, posts + comments) to practice INNER JOIN, LEFT JOIN, and self-joins. Master these three and you can handle 95% of real-world query requirements.",
    },
    {
      type: "pitfall",
      title: "SQLite has quirks that differ from PostgreSQL and MySQL",
      content:
        "This playground runs SQLite (via WebAssembly). SQLite uses dynamic typing (any column accepts any type), doesn't enforce VARCHAR length, and has limited ALTER TABLE support. Queries that work here may need adjustment for PostgreSQL (stricter types) or MySQL (different date functions).",
    },
    {
      type: "example",
      title: "Use CTEs and window functions for interview-style SQL problems",
      content:
        "WITH ranked AS (SELECT *, ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS rn FROM employees) SELECT * FROM ranked WHERE rn <= 3; This common interview pattern uses both CTEs and window functions — practice it here until it's second nature.",
    },
    {
      type: "security",
      title: "Client-side SQL is safe — your data never leaves the browser",
      content:
        "This playground runs SQLite entirely in WebAssembly inside your browser. Your tables and data exist only in browser memory and are discarded when you close the tab. No database server is involved, so there's no risk of accidental data exposure or SQL injection to a production system.",
    },
  ],
  "tsconfig-builder": [
    {
      type: "tip",
      title: "Enable strict mode — it catches bugs that unit tests miss",
      content:
        "strict: true enables strictNullChecks, noImplicitAny, strictFunctionTypes, and more. These catch null pointer errors, implicit any types, and function signature mismatches at compile time. Fixing strict mode errors in a new project is easy — retrofitting it into a large codebase is painful.",
    },
    {
      type: "pitfall",
      title: "moduleResolution: 'node' is legacy — use 'bundler' for modern apps",
      content:
        "moduleResolution: 'node' (Node10) follows Node.js's CommonJS resolution algorithm. For apps using Vite, Next.js, or any bundler, use 'bundler' which supports package.json exports, conditional imports, and ESM properly. 'nodenext' is for pure Node.js ESM projects.",
    },
    {
      type: "example",
      title: "Use path aliases to eliminate ../../../ imports",
      content:
        "Set baseUrl: '.' and paths: { '@/*': ['src/*'] } to enable import { Button } from '@/components/Button' instead of import { Button } from '../../../components/Button'. Most bundlers (Vite, Next.js, webpack) need matching aliases in their config.",
    },
    {
      type: "security",
      title: "skipLibCheck: true hides vulnerabilities in dependencies",
      content:
        "skipLibCheck skips type checking of .d.ts files, which includes node_modules type definitions. While this speeds up compilation, it means type-level bugs or incompatibilities in dependencies won't surface until runtime. In security-critical code, consider disabling skipLibCheck.",
    },
  ],
  "eslint-to-biome": [
    {
      type: "tip",
      title: "Biome combines linting and formatting — replace Prettier too",
      content:
        "Biome replaces both ESLint and Prettier in a single tool. Remove eslint-config-prettier, @typescript-eslint/parser, and all ESLint plugins. One biome.json replaces .eslintrc, .prettierrc, and .editorconfig. This typically removes 10-15 devDependencies.",
    },
    {
      type: "pitfall",
      title: "Not all ESLint rules have Biome equivalents",
      content:
        "Biome supports ~200 lint rules vs ESLint's ecosystem of thousands across plugins. Plugin-specific rules (eslint-plugin-react-hooks, eslint-plugin-import) may not have 1:1 mappings. Check the converter's warnings output for unmapped rules and assess whether you actually need them.",
    },
    {
      type: "example",
      title: "Migrate incrementally with biome check --apply for auto-fixes",
      content:
        "Don't fix all linting issues manually. Run biome check --apply to auto-fix safe issues (formatting, import sorting, simple lint fixes), then review biome check --apply-unsafe for riskier transformations. Commit the auto-fixes separately from manual fixes for clean git history.",
    },
    {
      type: "security",
      title: "Biome's security rules catch patterns ESLint misses by default",
      content:
        "Biome includes security rules (noGlobalEval, noDangerouslySetInnerHtml, noGlobalAssign) in its recommended preset — no extra plugins needed. ESLint requires eslint-plugin-security or manual configuration for equivalent coverage. After migrating, verify your security rules are still active.",
    },
  ],
  "ts6-migration": [
    {
      type: "tip",
      title: "Check for ES5 target and CommonJS modules first — these are removed",
      content:
        "TypeScript 6.0 removes target: 'ES5' and module: 'commonjs' output modes. If your tsconfig.json uses these, you must migrate to ES2015+ target and ESM modules. This is the highest-impact breaking change and affects the most projects.",
    },
    {
      type: "pitfall",
      title: "strict: true is now the default — existing projects may see new errors",
      content:
        "Previously, strict mode was opt-in. In TS 6.0, it's the default. Projects that relied on implicit any types, unchecked null access, and loose function types will see hundreds of new errors. Add strict: false to your tsconfig.json explicitly if you can't fix them yet.",
    },
    {
      type: "example",
      title: "Run the migration checker before upgrading TypeScript",
      content:
        "Paste your tsconfig.json into DevBolt's TS6 Migration Checker before running npm install typescript@6. The readiness grade (A-F) and specific issue list tell you exactly what to fix. Grade A projects can upgrade immediately; grade D/F projects need preparation.",
    },
    {
      type: "security",
      title: "The strict default improves security of TypeScript codebases",
      content:
        "strict: true enables strictNullChecks (prevents null pointer errors), noImplicitAny (prevents untyped code), and strictFunctionTypes (prevents unsafe function assignments). These catches prevent common vulnerability patterns. Embrace the strict default rather than disabling it.",
    },
  ],
  "jwt-builder": [
    {
      type: "tip",
      title: "Use RS256 for multi-service architectures, HS256 for single-service",
      content:
        "HS256 (symmetric) uses one shared secret — any service that can verify a JWT can also create one. RS256 (asymmetric) uses a private key to sign and a public key to verify. In microservice architectures, RS256 lets services verify tokens without having the signing key.",
    },
    {
      type: "pitfall",
      title: "Never set excessively long expiration times",
      content:
        "JWTs cannot be revoked — once issued, they're valid until expiration. A JWT with exp set to 1 year means a leaked token grants access for up to a year. Use short-lived access tokens (5-15 minutes) paired with refresh tokens for session management.",
    },
    {
      type: "example",
      title: "Include only the minimum necessary claims in the payload",
      content:
        "JWTs are sent with every request — large payloads waste bandwidth. Include only identity (sub), permissions (role), and expiration (exp, iat). Don't embed user profiles, preferences, or other data that can be fetched from your API when needed.",
    },
    {
      type: "security",
      title: "Never use the 'none' algorithm in production",
      content:
        "The alg: 'none' option creates unsigned tokens — useful for development and testing only. Attackers exploit misconfigured JWT libraries by sending tokens with alg: 'none' to bypass signature verification. Always validate the algorithm server-side and reject 'none' in production.",
    },
  ],
  "lorem-ipsum": [
    {
      type: "tip",
      title: "Use realistic placeholder text length for layout testing",
      content:
        "Lorem Ipsum is great for testing layouts, but don't use uniform paragraph lengths. Real content varies wildly — mix short and long paragraphs to catch overflow, truncation, and responsive layout issues before real content arrives.",
    },
    {
      type: "pitfall",
      title: "Lorem Ipsum hides content readability problems",
      content:
        "Because Lorem Ipsum is unreadable by design, it masks issues like font size being too small, line height being too tight, or contrast being too low. Test with real content samples alongside placeholder text to catch typography issues early.",
    },
    {
      type: "example",
      title: "Use structured placeholder data for component testing",
      content:
        "For cards, tables, and lists, pure Lorem Ipsum text doesn't reveal layout issues. Generate varied-length names (3-30 chars), descriptions (1-3 sentences), and numbers to stress-test component layouts realistically.",
    },
    {
      type: "security",
      title: "Remove all placeholder text before shipping to production",
      content:
        "Lorem Ipsum left in production pages damages SEO rankings and user trust. Search engines may flag pages with Latin placeholder text as low-quality. Add a build-time check or linter rule to catch leftover placeholder content.",
    },
  ],
  "number-base-converter": [
    {
      type: "tip",
      title: "Use hex for colors and memory addresses, binary for bit flags",
      content:
        "Each number base has its sweet spot: hexadecimal for colors (#FF5733), memory addresses, and byte values. Binary for bitwise operations and feature flags. Octal for Unix file permissions (chmod 755). Decimal for everything humans need to read.",
    },
    {
      type: "pitfall",
      title: "JavaScript parseInt() defaults to base 10, not auto-detect",
      content:
        "parseInt('010') returns 10 in modern JS (base 10), but returned 8 in older engines (octal). Always specify the radix: parseInt('0xFF', 16) for hex, parseInt('111', 2) for binary. The implicit radix has caused countless subtle bugs.",
    },
    {
      type: "example",
      title: "Hex is just a compact way to write binary",
      content:
        "Each hex digit maps to exactly 4 binary bits: 0xF = 1111, 0xA = 1010. This makes hex ideal for reading binary data — a 32-bit value like 11111111000000001010101001010101 becomes FF00AA55, which is actually readable.",
    },
    {
      type: "security",
      title: "Validate numeric inputs to prevent injection via unusual bases",
      content:
        "Attackers sometimes bypass input validation by encoding payloads in hex (0x) or octal (0). Ensure your input parsing handles all numeric representations consistently and doesn't accidentally interpret user input as a different base.",
    },
  ],
  "tailwind-generator": [
    {
      type: "tip",
      title: "Use @apply sparingly — it defeats Tailwind's purpose",
      content:
        "Extracting utility classes into @apply rules in CSS recreates the specificity and maintenance problems Tailwind was designed to solve. Use @apply only for truly repeated patterns (like .btn) that can't be handled with component extraction.",
    },
    {
      type: "pitfall",
      title: "Tailwind purges unused classes — dynamic class names break",
      content:
        "Tailwind's JIT compiler scans your source files for class names as static strings. Dynamically constructing classes like `bg-${color}-500` won't work — the compiler can't find them. Use complete class strings: `color === 'red' ? 'bg-red-500' : 'bg-blue-500'`.",
    },
    {
      type: "example",
      title: "Design tokens map cleanly to Tailwind's config",
      content:
        "Extend tailwind.config.js with your design system tokens: custom colors, spacing scale, font families. This gives you autocomplete and consistency while keeping Tailwind's utility-first approach. One config file replaces scattered CSS variables.",
    },
    {
      type: "security",
      title: "Never inject user-supplied values directly into class names",
      content:
        "If you build class names from user input (e.g., className={userInput}), an attacker could inject arbitrary CSS via Tailwind's arbitrary value syntax like [background:url(malicious-site)]. Always validate and whitelist allowed values.",
    },
  ],
  "og-preview": [
    {
      type: "tip",
      title: "Test OG images at 1200x630px — that's the universal sweet spot",
      content:
        "Facebook, LinkedIn, Twitter, and Slack all render OG images differently, but 1200x630px works well across all platforms. Keep important text in the center 60% of the image since platforms crop edges differently.",
    },
    {
      type: "pitfall",
      title: "OG tags are cached aggressively by social platforms",
      content:
        "Facebook and LinkedIn cache OG metadata for days to weeks. Changing your og:image or og:title won't update existing shares. Use Facebook's Sharing Debugger and LinkedIn's Post Inspector to force a cache refresh after updating.",
    },
    {
      type: "example",
      title: "og:description should be 55-200 characters for best display",
      content:
        "Too short and platforms may fall back to page content. Too long and it gets truncated mid-sentence. Write a compelling 2-sentence summary: what the page is + why someone should click. This is your ad copy for social sharing.",
    },
    {
      type: "security",
      title: "Sanitize user-generated content in dynamic OG tags",
      content:
        "If your OG tags include user-submitted content (like post titles), ensure proper HTML entity encoding. Unescaped quotes or angle brackets in og:title/og:description can break the meta tag structure and enable XSS via social sharing previews.",
    },
  ],
  "js-playground": [
    {
      type: "tip",
      title: "Use console.table() for arrays and objects in the playground",
      content:
        "console.log() outputs messy nested objects. console.table() renders arrays of objects as formatted tables, making it far easier to compare values. Also try console.dir() for interactive tree views of DOM elements and complex objects.",
    },
    {
      type: "pitfall",
      title: "Top-level await requires module mode or async wrapper",
      content:
        "If your code uses `await fetch(...)` at the top level, it needs to run in a module context or be wrapped in an async IIFE: `(async () => { const data = await fetch(...); })()`. Most playgrounds don't enable module mode by default.",
    },
    {
      type: "example",
      title: "Test array methods by chaining .map(), .filter(), .reduce()",
      content:
        "The playground is perfect for experimenting with functional array patterns. Try: `[1,2,3,4,5].filter(n => n % 2).map(n => n ** 2).reduce((a,b) => a+b, 0)` — understanding this chain is fundamental to modern JavaScript.",
    },
    {
      type: "security",
      title: "Browser playgrounds sandbox code — but be careful with production data",
      content:
        "Client-side JS playgrounds run code in your browser, not a server. But code you paste may contain API keys, tokens, or credentials. DevBolt never sends your code anywhere, but always scrub sensitive data from code snippets before testing.",
    },
  ],
  "toml-converter": [
    {
      type: "tip",
      title: "TOML preserves data types that JSON and YAML handle differently",
      content:
        "TOML natively supports dates (2024-01-15), times, and datetimes without string wrapping. When converting to JSON, these become strings. When converting to YAML, datetime support varies by parser. Be aware of type fidelity when round-tripping between formats.",
    },
    {
      type: "pitfall",
      title: "TOML tables and arrays of tables have non-obvious syntax",
      content:
        "[server] is a table (object). [[server]] is an array of tables (array of objects). Confusing these causes silent data corruption — your config ends up with one object instead of an array, or vice versa. Double brackets = array.",
    },
    {
      type: "example",
      title: "pyproject.toml is now the standard Python config format",
      content:
        "Python's ecosystem has consolidated on pyproject.toml (PEP 621, PEP 660). Tools like Poetry, Hatch, PDM, Ruff, Black, and pytest all read from it. If you're maintaining Python packages, learning TOML syntax is no longer optional.",
    },
    {
      type: "security",
      title: "Validate TOML configs before deployment — syntax errors fail silently",
      content:
        "Unlike JSON which fails loudly on parse errors, many TOML parsers silently ignore malformed sections or fall back to defaults. A typo in your Cargo.toml or pyproject.toml could mean missing dependencies or wrong build settings in production.",
    },
  ],
  "encode-decode": [
    {
      type: "tip",
      title: "Know when to use URL encoding vs Base64 vs Hex",
      content:
        "URL encoding (%20) for query parameters and form data. Base64 for embedding binary in text (emails, data URIs). Hex for debugging byte-level data and hash values. Each encoding serves a different purpose — using the wrong one creates bugs.",
    },
    {
      type: "pitfall",
      title: "Double-encoding is the most common encoding bug",
      content:
        "Encoding an already-encoded string turns %20 into %2520 (encoding the % sign). This happens when multiple layers (framework, middleware, manual code) each apply encoding. Decode first, then encode once at the boundary.",
    },
    {
      type: "example",
      title: "Base32 is used in TOTP/2FA secret keys",
      content:
        "Google Authenticator and similar 2FA apps use Base32-encoded secrets because Base32 uses only uppercase letters and digits 2-7, making it easy to type manually and resistant to confusion between similar characters (0/O, 1/I/l).",
    },
    {
      type: "security",
      title: "Encoding is not encryption — it provides zero confidentiality",
      content:
        "Base64, hex, URL encoding, and HTML entities are all trivially reversible. Never use encoding to 'hide' sensitive data. If you need confidentiality, use actual encryption (AES-256-GCM, ChaCha20-Poly1305). Encoding is for format compatibility, not security.",
    },
  ],
  "privacy-policy": [
    {
      type: "tip",
      title: "List every third-party service that receives user data",
      content:
        "GDPR and CCPA require you to disclose all data processors. This includes analytics (Google Analytics, Mixpanel), payment processors (Stripe), email services (SendGrid), CDNs (Cloudflare), and error tracking (Sentry). Missing one can result in enforcement action.",
    },
    {
      type: "pitfall",
      title: "Copy-pasting another site's privacy policy is legally risky",
      content:
        "A privacy policy must accurately describe YOUR data practices. If you copy a policy that mentions features you don't have or omits ones you do, it's misleading and potentially violates regulations. Generate one tailored to your actual stack.",
    },
    {
      type: "example",
      title: "Update your policy every time you add a new integration",
      content:
        "Adding Google Analytics? Adding a chat widget? Switching email providers? Each change requires a privacy policy update. Set a quarterly calendar reminder to audit your third-party services and update the policy accordingly.",
    },
    {
      type: "security",
      title: "A privacy policy is a legal document — consider lawyer review",
      content:
        "Generators create a solid starting point, but GDPR fines can reach 4% of global revenue. For any app handling PII (personally identifiable information), have a lawyer review your generated policy before publishing.",
    },
  ],
  "http-status-codes": [
    {
      type: "tip",
      title: "Use 201 Created for POST success, not 200 OK",
      content:
        "200 OK means 'request succeeded.' 201 Created means 'request succeeded AND a new resource was created.' Using the right status code helps API consumers handle responses correctly and makes your API self-documenting.",
    },
    {
      type: "pitfall",
      title: "Don't return 200 with an error message in the body",
      content:
        "APIs that return `{ status: 200, error: 'Not found' }` break HTTP semantics and make error handling unreliable. HTTP clients, proxies, and monitoring tools rely on status codes. Return 404 for not found, 400 for bad input, 500 for server errors.",
    },
    {
      type: "example",
      title: "429 Too Many Requests should include Retry-After header",
      content:
        "When rate limiting, always include a Retry-After header with the number of seconds until the client can retry. This lets well-behaved clients implement exponential backoff correctly instead of hammering your API in a tight loop.",
    },
    {
      type: "security",
      title: "Don't leak implementation details in error responses",
      content:
        "A 500 error that returns a stack trace, database connection string, or internal path gives attackers a roadmap. In production, return generic error messages with status codes. Log detailed errors server-side where only your team can see them.",
    },
  ],
  "date-format-tester": [
    {
      type: "tip",
      title: "ISO 8601 (YYYY-MM-DD) is the only unambiguous date format",
      content:
        "01/02/03 means January 2 in the US, February 1 in Europe, and February 3 in some Asian countries. ISO 8601 (2024-01-02) is internationally unambiguous and sorts correctly as a string. Always use it for APIs, logs, and data exchange.",
    },
    {
      type: "pitfall",
      title: "JavaScript's Date.parse() behavior varies across browsers",
      content:
        "Date.parse('2024-01-15') returns different results depending on whether a time zone is included. Without a timezone suffix, some browsers treat it as UTC, others as local time. Always include timezone: '2024-01-15T00:00:00Z' for UTC.",
    },
    {
      type: "example",
      title: "Go's time format uses a reference date, not symbols",
      content:
        "Go formats dates using the reference time 'Mon Jan 2 15:04:05 MST 2006' — each component has a specific value (Jan=1, 2=day, 15=3PM, 04=minute, 05=second, 2006=year). It's unintuitive at first but eliminates ambiguity in format strings.",
    },
    {
      type: "security",
      title: "Timezone-unaware dates cause authentication and billing bugs",
      content:
        "A subscription that 'expires on January 15' — in which timezone? A user in UTC+12 loses access 12 hours before a user in UTC-12. Always store timestamps in UTC with timezone info, and convert to local time only for display.",
    },
  ],
  "readme-generator": [
    {
      type: "tip",
      title: "A great README answers three questions in 30 seconds",
      content:
        "What does this do? How do I install/use it? Where can I get help? If a developer can't answer these within 30 seconds of landing on your repo, they'll move on. Lead with a one-sentence description, then installation, then usage example.",
    },
    {
      type: "pitfall",
      title: "Screenshots and GIFs dramatically increase engagement",
      content:
        "READMEs with visual content get 2-3x more stars and contributions than text-only ones. A 10-second GIF showing your tool in action is worth more than 500 words of description. Use tools like Kap, LICEcap, or asciinema.",
    },
    {
      type: "example",
      title: "Include a copy-pasteable quick start that works in under 60 seconds",
      content:
        "The best READMEs have a quick start section with 3-5 commands that a developer can copy-paste to see the project running. If it takes more than 60 seconds from git clone to 'hello world', simplify your setup.",
    },
    {
      type: "security",
      title: "Never include secrets, API keys, or internal URLs in your README",
      content:
        "Git history is permanent — even if you delete a secret from the README, it's in the commit history forever. Use .env.example with placeholder values instead. Review your README for any hardcoded URLs, IPs, or credentials before pushing.",
    },
  ],
  "robots-generator": [
    {
      type: "tip",
      title: "Block AI crawlers separately from search engine bots",
      content:
        "GPTBot, CCBot, Google-Extended, and anthropic-ai are separate from Googlebot. You can allow search indexing while blocking AI training crawlers. Add specific Disallow rules for each AI bot you want to exclude.",
    },
    {
      type: "pitfall",
      title: "robots.txt is advisory, not enforceable",
      content:
        "robots.txt is a gentleman's agreement — well-behaved crawlers respect it, but malicious scrapers ignore it completely. Don't rely on robots.txt for security. Use authentication, rate limiting, and IP blocking for actual access control.",
    },
    {
      type: "example",
      title: "Always include your sitemap URL in robots.txt",
      content:
        "Add `Sitemap: https://yourdomain.com/sitemap.xml` at the bottom of robots.txt. This helps search engines discover all your pages faster, even if they're not well-linked internally. It's the single most impactful line in the file.",
    },
    {
      type: "security",
      title: "Don't expose sensitive paths by listing them in Disallow rules",
      content:
        "Adding `Disallow: /admin` or `Disallow: /internal-api` to robots.txt tells every attacker exactly where your admin panel and internal APIs live. robots.txt is public. Secure sensitive paths with authentication, not crawl directives.",
    },
  ],
  "zod-schema": [
    {
      type: "tip",
      title: "Use z.infer<typeof schema> to keep types and validation in sync",
      content:
        "Define the Zod schema once and derive the TypeScript type from it. This guarantees your type definition and runtime validation are always identical. No more 'type says string but validation allows number' bugs.",
    },
    {
      type: "pitfall",
      title: "z.object() is strict about extra keys by default — z.passthrough() isn't",
      content:
        "z.object({name: z.string()}).parse({name: 'test', extra: true}) strips the extra key silently. Use .strict() to reject unknown keys, or .passthrough() to preserve them. The default behavior (strip) can silently lose data.",
    },
    {
      type: "example",
      title: "Chain .transform() for coercion + validation in one step",
      content:
        "z.string().transform(Number).pipe(z.number().min(0).max(100)) validates that input is a string, coerces it to a number, then validates the number is 0-100. This handles form inputs where everything starts as a string.",
    },
    {
      type: "security",
      title: "Always validate API inputs with Zod at the boundary",
      content:
        "TypeScript types disappear at runtime. A malicious API request can send any shape of data. Use Zod schemas as middleware to validate and sanitize every incoming request body, query parameter, and path parameter before your business logic touches it.",
    },
  ],
  "placeholder-image": [
    {
      type: "tip",
      title: "Match placeholder dimensions to your actual image requirements",
      content:
        "Using random placeholder sizes hides layout shift (CLS) issues. If your design calls for 16:9 thumbnails at 320x180, generate placeholders at exactly that size. This reveals how your layout handles the real aspect ratio.",
    },
    {
      type: "pitfall",
      title: "Placeholder services can go offline — breaking your dev environment",
      content:
        "External services like placeholder.com or placekitten.com can go down or change URLs. Generate placeholders client-side (using Canvas/SVG) for reliability. DevBolt generates locally — no external dependency.",
    },
    {
      type: "example",
      title: "Use colored placeholders to distinguish content zones in wireframes",
      content:
        "Assign different background colors to hero images (blue), thumbnails (green), avatars (purple), and ads (red). This makes wireframe reviews faster because stakeholders can instantly identify which content type goes where.",
    },
    {
      type: "security",
      title: "Never use placeholder images in production — they signal an unfinished product",
      content:
        "Placeholder images left in production erode user trust and can indicate neglected code. Add build-time checks that flag any remaining placeholder URLs (placeholder.com, via.placeholder, picsum.photos) before deploying.",
    },
  ],
  "env-validator": [
    {
      type: "tip",
      title: "Compare .env against .env.example on every deploy",
      content:
        "Your .env.example should list every variable your app needs (with empty or example values). Validate that production .env has all required keys before starting the app. Missing variables cause runtime crashes that are hard to debug.",
    },
    {
      type: "pitfall",
      title: "Quoted and unquoted .env values behave differently",
      content:
        "In most .env parsers, VALUE=hello world sets VALUE to 'hello world' (with space). But VALUE=\"hello world\" includes the quotes in some parsers and strips them in others. Be consistent: always quote values containing spaces or special characters.",
    },
    {
      type: "example",
      title: "Use dotenv-vault or SOPS for team .env sharing",
      content:
        "Sharing .env files via Slack, email, or git is insecure and error-prone. Tools like dotenv-vault encrypt .env files for safe version control, while SOPS (by Mozilla) encrypts individual values. Both support team key rotation.",
    },
    {
      type: "security",
      title: "Never commit .env files to git — add them to .gitignore immediately",
      content:
        "Even private repos can be leaked, forked, or accessed by contractors. Committed .env files with API keys are the #1 cause of credential leaks in GitHub repos. If you accidentally committed one, rotate ALL the secrets — git history is permanent.",
    },
  ],
  "file-hash": [
    {
      type: "tip",
      title: "SHA-256 is the standard for file integrity verification",
      content:
        "SHA-256 balances speed and collision resistance for file verification. MD5 is fast but broken for security purposes. SHA-1 has known collision attacks. SHA-512 adds marginal security for significantly more computation. SHA-256 is the sweet spot.",
    },
    {
      type: "pitfall",
      title: "Hash comparison must be constant-time to prevent timing attacks",
      content:
        "Comparing hashes with === in JavaScript short-circuits on the first different byte, leaking information about how many bytes matched. For security-critical comparisons, use crypto.timingSafeEqual() or a constant-time comparison function.",
    },
    {
      type: "example",
      title: "Verify downloaded files by comparing hashes from the publisher",
      content:
        "Software publishers provide SHA-256 checksums alongside downloads. After downloading, hash the file and compare. If the hashes don't match, the file was corrupted in transit or tampered with. This catches supply-chain attacks.",
    },
    {
      type: "security",
      title: "MD5 should never be used for security — only legacy compatibility",
      content:
        "MD5 collision attacks are practical — researchers generated two different PDF files with the same MD5 hash in 2005. Use SHA-256 minimum for integrity verification. MD5 is only acceptable for non-security checksums like cache busting.",
    },
  ],
  "ascii-art": [
    {
      type: "tip",
      title: "Use ASCII art banners in CLI tools for brand recognition",
      content:
        "Popular CLI tools like Vite, Nuxt, and Fastify show ASCII art logos on startup. It makes your tool memorable and adds personality. Keep it under 6 lines tall and test in both 80-column and 120-column terminals.",
    },
    {
      type: "pitfall",
      title: "ASCII art breaks with proportional fonts and narrow terminals",
      content:
        "ASCII art relies on monospace fonts where every character has equal width. If someone views it in a proportional font (email, web page without <pre>), the alignment breaks completely. Always wrap ASCII art in <pre> or code blocks.",
    },
    {
      type: "example",
      title: "Comment-wrapped ASCII art makes great file header separators",
      content:
        "Use ASCII art section headers in long config files or scripts to create visual landmarks. A bold banner saying '=== DATABASE CONFIG ===' is easier to spot when scrolling than a plain comment. Keep it tasteful — one line, not a whole paragraph.",
    },
    {
      type: "security",
      title: "Sanitize user input before rendering as ASCII art",
      content:
        "If users can input text that gets rendered as ASCII art in a web page, ensure proper HTML escaping. Characters like <, >, &, and quotes in the ASCII output could enable XSS if rendered as raw HTML instead of inside a code block.",
    },
  ],
  "regex-generator": [
    {
      type: "tip",
      title: "Start simple and add complexity — don't try to match everything at once",
      content:
        "The best regex patterns are built incrementally. Start with a pattern that matches the simplest case, then add groups and alternations for edge cases. A regex that's 90% accurate and readable beats a 100% accurate one that nobody can maintain.",
    },
    {
      type: "pitfall",
      title: "Regex for email/URL validation is almost always wrong",
      content:
        "The RFC 5322 email regex is 6,000+ characters long. Simple patterns like `^.+@.+\\..+$` reject valid emails. For email validation, check for @ and a dot in the domain — then send a confirmation email. That's the only real validation.",
    },
    {
      type: "example",
      title: "Use named capture groups for readable extraction",
      content:
        "Instead of `(\\d{4})-(\\d{2})-(\\d{2})` where you access matches by index, use `(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})`. Named groups make your code self-documenting: `match.groups.year` beats `match[1]`.",
    },
    {
      type: "security",
      title: "Untested regex can cause ReDoS — catastrophic backtracking",
      content:
        "Patterns like `(a+)+$` take exponential time on inputs like 'aaaaaaaaaaaaaab'. Attackers exploit this to DoS servers. Avoid nested quantifiers, use atomic groups or possessive quantifiers where available, and test with pathological inputs.",
    },
  ],
  "token-counter": [
    {
      type: "tip",
      title: "System prompts and tool definitions count toward your context window",
      content:
        "The context window isn't just for your messages — system prompts, function definitions, and tool schemas consume tokens too. A complex system prompt with 20 tool definitions can use 3,000-5,000 tokens before the conversation even starts.",
    },
    {
      type: "pitfall",
      title: "Token count varies dramatically between models for the same text",
      content:
        "GPT-4 and Claude use different tokenizers. The same 1,000-word essay might be 1,200 tokens in GPT-4 (cl100k) but 1,400 in Claude. Always count tokens with the specific model's tokenizer — estimates based on 'words ÷ 0.75' are unreliable.",
    },
    {
      type: "example",
      title: "Estimate API costs before running batch jobs",
      content:
        "Processing 10,000 documents through GPT-4o at $2.50/M input tokens and $10/M output tokens adds up fast. Token-count a representative sample, multiply by your dataset size, and calculate costs before running the full batch.",
    },
    {
      type: "security",
      title: "Long prompts can be used to hide prompt injection attacks",
      content:
        "Attackers embed malicious instructions deep in long documents, hoping the LLM follows them. If you're processing user-submitted content through an LLM, be aware that longer inputs provide more surface area for prompt injection.",
    },
  ],
  "ai-model-comparison": [
    {
      type: "tip",
      title: "Match model tier to task complexity — don't default to the largest model",
      content:
        "GPT-4o Mini and Claude 3.5 Haiku handle classification, extraction, and simple Q&A at 10-20x lower cost than their flagship siblings. Reserve GPT-4o and Claude Opus for complex reasoning, code generation, and multi-step tasks.",
    },
    {
      type: "pitfall",
      title: "Benchmark scores don't reflect real-world application performance",
      content:
        "A model scoring 90% on MMLU might perform poorly on your specific domain. Always evaluate models against your actual use case with a representative test set. Academic benchmarks measure general capability, not fitness for your task.",
    },
    {
      type: "example",
      title: "Use different models for different pipeline stages",
      content:
        "A cost-effective AI pipeline might use Haiku for initial classification, Sonnet for content generation, and Opus only for final quality review. Mixing model tiers in a pipeline can cut costs 60-80% with minimal quality loss.",
    },
    {
      type: "security",
      title: "Check data retention policies before sending sensitive content",
      content:
        "Some API tiers use your data for model training unless you opt out. OpenAI's default API doesn't train on data, but ChatGPT conversations may be used. Check each provider's data usage policy, especially for regulated industries (healthcare, finance).",
    },
  ],
  "git-command-builder": [
    {
      type: "tip",
      title: "Learn git reflog — it's your safety net for almost any mistake",
      content:
        "git reflog records every HEAD movement for 90 days. Accidentally deleted a branch? Reset too hard? Rebased wrong? Find the commit SHA in reflog and git checkout or git reset to recover. It's saved countless hours of lost work.",
    },
    {
      type: "pitfall",
      title: "git rebase rewrites history — never rebase shared branches",
      content:
        "Rebasing commits that others have pulled creates duplicate commits and merge conflicts for your entire team. Golden rule: only rebase your own unpushed commits. Once pushed, use merge or create a new commit to fix issues.",
    },
    {
      type: "example",
      title: "Use git stash with a message to avoid losing context",
      content:
        "`git stash` with no message creates unnamed stash entries that pile up into an unreadable list. Use `git stash push -m 'WIP: auth refactor'` so you can find your stashed work later with `git stash list`.",
    },
    {
      type: "security",
      title: "Sign your commits with GPG or SSH keys to prove authorship",
      content:
        "Git commits can have any author name and email — anyone can commit as you. GPG or SSH commit signing proves that commits genuinely came from you. GitHub shows a 'Verified' badge on signed commits. Enable it for any security-sensitive repository.",
    },
  ],
  "code-screenshot": [
    {
      type: "tip",
      title: "Use 2x resolution for crisp screenshots on Retina displays",
      content:
        "Export at 2x resolution to ensure code screenshots look sharp on high-DPI displays (MacBooks, modern phones). A 1x screenshot at 800x600 becomes blurry when shared on social media platforms that display at Retina resolution.",
    },
    {
      type: "pitfall",
      title: "Code screenshots are not accessible — always provide the actual code",
      content:
        "Screen readers cannot read text in images. Search engines cannot index it. Users cannot copy-paste from it. Use code screenshots for visual appeal in presentations and social media, but always include the actual code in an accessible format too.",
    },
    {
      type: "example",
      title: "Dark theme screenshots stand out on Twitter and LinkedIn feeds",
      content:
        "Social media feeds are dominated by light backgrounds. Dark-theme code screenshots (Dracula, One Dark, Monokai) create visual contrast that stops the scroll. Pair with a gradient background for extra pop.",
    },
    {
      type: "security",
      title: "Review code screenshots for leaked secrets before sharing",
      content:
        "It's easy to screenshot code that includes API keys, database URLs, internal hostnames, or .env variables. Unlike text posts, you can't search and redact images after sharing. Review every screenshot carefully before posting publicly.",
    },
  ],
  "css-to-tailwind": [
    {
      type: "tip",
      title: "Convert one component at a time, not the entire stylesheet",
      content:
        "Migrating a full CSS file to Tailwind at once creates an overwhelming diff and high risk of regressions. Convert one component, verify it visually, commit, then move to the next. Incremental migration reduces review burden and bug risk.",
    },
    {
      type: "pitfall",
      title: "Not every CSS property has a Tailwind utility — some need arbitrary values",
      content:
        "Tailwind covers 95% of common CSS but misses edge cases like specific grid-template-areas or complex animations. Use arbitrary values `[property:value]` for one-offs, or keep a small custom CSS file for truly unique styles.",
    },
    {
      type: "example",
      title: "CSS shorthand properties need to be expanded for Tailwind conversion",
      content:
        "`margin: 10px 20px 30px` must be split into `mt-2.5 mx-5 mb-7.5` (or the nearest Tailwind spacing values). Shorthand properties like background, border, and font each decompose into multiple Tailwind utilities.",
    },
    {
      type: "security",
      title: "Audit converted class names for accidentally exposed internal naming",
      content:
        "CSS class names like .admin-panel, .internal-api-form, or .billing-secret sometimes reveal application structure. When converting to Tailwind, these class names are removed from the DOM — an incidental security improvement.",
    },
  ],
  "svg-to-jsx": [
    {
      type: "tip",
      title: "Use React.forwardRef for icon components to support refs",
      content:
        "SVG icon components often need refs for tooltips, focus management, and animations. Wrapping your SVG component with React.forwardRef lets parent components attach refs to the underlying SVG element.",
    },
    {
      type: "pitfall",
      title: "SVG attributes use camelCase in JSX, not kebab-case",
      content:
        "stroke-width becomes strokeWidth, fill-opacity becomes fillOpacity, clip-path becomes clipPath. Missing these conversions causes React warnings and broken rendering. There are 80+ SVG attributes that need camelCase conversion.",
    },
    {
      type: "example",
      title: "Pass size and color as props for reusable icon components",
      content:
        "Instead of hardcoding width/height and fill in your SVG, accept them as props with sensible defaults: `({ size = 24, color = 'currentColor', ...props })`. Using 'currentColor' inherits the parent's text color automatically.",
    },
    {
      type: "security",
      title: "Sanitize SVG content before converting — SVGs can contain scripts",
      content:
        "SVG files can embed JavaScript via <script> tags, event handlers (onclick, onload), and xlink:href with javascript: URIs. When converting user-uploaded SVGs to React components, strip all script elements and event handler attributes first.",
    },
  ],
  "prompt-builder": [
    {
      type: "tip",
      title: "Structure prompts with clear sections: role, context, task, format",
      content:
        "The most effective prompts follow a consistent structure: (1) Role — who the AI should be, (2) Context — background information, (3) Task — exactly what to do, (4) Format — how to structure the output. This reduces ambiguity and improves response quality.",
    },
    {
      type: "pitfall",
      title: "Vague instructions produce vague outputs — be specific about format",
      content:
        "Saying 'summarize this code' gives unpredictable results. Saying 'explain what this function does in 2-3 sentences, then list its parameters as a markdown table with name, type, and description columns' gives consistent, usable output.",
    },
    {
      type: "example",
      title: "Include examples in your prompt for consistent output formatting",
      content:
        "Few-shot prompting (including 2-3 example input/output pairs) dramatically improves format consistency. Show the AI exactly what good output looks like, and it will follow the pattern. This is more effective than lengthy format instructions.",
    },
    {
      type: "security",
      title: "Never include secrets or credentials in prompt templates",
      content:
        "Prompt templates are often stored in version control, shared across teams, or sent to third-party API providers. Never embed API keys, database credentials, or internal URLs in your prompts. Reference them via environment variables instead.",
    },
  ],
  "mcp-config-builder": [
    {
      type: "tip",
      title: "Start with 2-3 MCP servers, not 20 — context window is finite",
      content:
        "Every MCP server adds tool definitions to the AI's context window, consuming tokens and potentially confusing the model. Start with the servers you actually need (filesystem, database, search) and add more only when you hit a real limitation.",
    },
    {
      type: "pitfall",
      title: "MCP server permissions are as dangerous as shell access",
      content:
        "An MCP server with filesystem access can read/write any file the process can access. A database MCP server can DROP tables. Always configure the narrowest permissions possible — read-only by default, write access only for specific paths or operations.",
    },
    {
      type: "example",
      title: "Use environment variables for server connection strings in MCP config",
      content:
        "Never hardcode database URLs, API keys, or connection strings in your MCP config file. Use env: references or a .env file. MCP configs are often committed to repos or shared in documentation, exposing embedded credentials.",
    },
    {
      type: "security",
      title: "Review MCP server source code before granting it system access",
      content:
        "MCP servers run as local processes with access to your system. A malicious or compromised MCP server could exfiltrate data, modify files, or open network connections. Only use MCP servers from trusted sources and review their capabilities.",
    },
  ],
  "package-json-generator": [
    {
      type: "tip",
      title: "Use the exports field instead of main for modern packages",
      content:
        "The 'exports' field in package.json provides precise control over what consumers can import. It supports conditional exports (import vs require), subpath exports, and prevents access to internal modules. It's the modern replacement for main, module, and types.",
    },
    {
      type: "pitfall",
      title: "Semver ranges in dependencies can break your build unexpectedly",
      content:
        "^1.2.3 allows any 1.x.x update, which can introduce breaking changes despite semver promises. Many packages don't follow semver strictly. Use a lockfile (package-lock.json) and review dependency updates deliberately rather than relying on automatic semver resolution.",
    },
    {
      type: "example",
      title: "Define scripts for the full development lifecycle",
      content:
        "A complete scripts section includes: dev, build, start, test, lint, format, typecheck, and clean. Add pre/post hooks like prebuild for type checking. Well-defined scripts make onboarding instant — new developers just run npm run dev.",
    },
    {
      type: "security",
      title: "Audit install scripts — they run with full system access",
      content:
        "npm packages can define preinstall and postinstall scripts that execute arbitrary code on `npm install`. Malicious packages have used this to steal credentials and crypto wallet keys. Use `npm audit` and review install scripts of new dependencies.",
    },
  ],
  "git-diff-viewer": [
    {
      type: "tip",
      title: "Side-by-side view is better for small changes, inline for large refactors",
      content:
        "Side-by-side (split) view clearly shows character-level differences in modified lines, ideal for code review of small changes. Inline (unified) view is better for understanding the flow of large refactors where lines move between functions.",
    },
    {
      type: "pitfall",
      title: "Whitespace-only changes hide real code changes in diffs",
      content:
        "Reformatting indentation or switching tabs to spaces can generate hundreds of diff lines that bury actual logic changes. Use `git diff -w` to ignore whitespace changes, or configure your diff viewer to collapse whitespace-only diffs.",
    },
    {
      type: "example",
      title: "Review diffs file-by-file, not as one massive scroll",
      content:
        "A 500-line diff across 20 files is overwhelming as a continuous scroll. Collapsible file sections let you review one file at a time, mark files as reviewed, and focus on the files you know are critical first.",
    },
    {
      type: "security",
      title: "Always diff before committing to catch accidentally staged secrets",
      content:
        "`git diff --staged` shows exactly what you're about to commit. Review it for accidentally added .env files, hardcoded tokens, debug credentials, or console.log statements before every commit. This 10-second habit prevents security incidents.",
    },
  ],
  "compression-tester": [
    {
      type: "tip",
      title: "Brotli compresses 15-25% better than Gzip for text content",
      content:
        "Brotli consistently beats Gzip on HTML, CSS, JavaScript, and JSON. The tradeoff: Brotli compression is slower (use static pre-compression for assets) but decompression is equally fast. All modern browsers support Brotli via the br content-encoding.",
    },
    {
      type: "pitfall",
      title: "Don't compress already-compressed formats like JPEG, PNG, or MP4",
      content:
        "Images, videos, and most binary formats are already compressed. Running them through Gzip or Brotli wastes CPU and can actually increase file size due to compression headers. Only compress text-based formats and uncompressed data.",
    },
    {
      type: "example",
      title: "Pre-compress static assets at build time with maximum compression",
      content:
        "Brotli level 11 compresses 50% better than level 1 but takes 100x longer. For static assets (JS, CSS), compress once at build time with maximum quality. For dynamic responses, use Brotli level 4-6 for a good speed/ratio tradeoff.",
    },
    {
      type: "security",
      title: "Be aware of BREACH attacks when compressing HTTP responses",
      content:
        "The BREACH attack exploits HTTP compression to extract secrets like CSRF tokens by measuring response sizes. Mitigations include: don't reflect user input and secrets on the same page, add random padding to responses, or use per-request CSRF tokens.",
    },
  ],
  "http-request-builder": [
    {
      type: "tip",
      title: "Use PUT for full resource replacement, PATCH for partial updates",
      content:
        "PUT replaces the entire resource — if you PUT a user object without the email field, the email is deleted. PATCH updates only the fields you send. Most API consumers want PATCH semantics but mistakenly use PUT, causing data loss.",
    },
    {
      type: "pitfall",
      title: "GET requests should never have side effects",
      content:
        "GET requests can be retried, cached, prefetched, and bookmarked by browsers and CDNs. A GET endpoint that deletes data or sends emails will trigger those actions every time someone shares the URL or a browser prefetches it.",
    },
    {
      type: "example",
      title: "Always include Content-Type and Accept headers for API requests",
      content:
        "Content-Type tells the server what format you're sending (application/json). Accept tells it what format you want back. Omitting these causes 415 Unsupported Media Type errors and format negotiation bugs that are hard to diagnose.",
    },
    {
      type: "security",
      title: "Never send credentials in URL query parameters",
      content:
        "Query strings are logged in server access logs, browser history, proxy logs, and referrer headers. Use Authorization headers (Bearer tokens) or request bodies for credentials. URLs with tokens also get indexed by search engines if linked.",
    },
  ],
  "github-actions-validator": [
    {
      type: "tip",
      title: "Pin action versions to full commit SHAs, not tags",
      content:
        "Using `uses: actions/checkout@v4` trusts that the tag won't be moved to malicious code. Pin to a specific SHA: `uses: actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11`. Tags can be reassigned; commit SHAs are immutable.",
    },
    {
      type: "pitfall",
      title: "GitHub Actions secrets are not available in pull requests from forks",
      content:
        "For security, GitHub doesn't expose repository secrets to workflows triggered by pull_request from forks. This breaks CI for open-source projects. Use pull_request_target (carefully) or run secret-dependent tests only on push to protected branches.",
    },
    {
      type: "example",
      title: "Use concurrency groups to cancel outdated workflow runs",
      content:
        "Add `concurrency: { group: '${{ github.workflow }}-${{ github.ref }}', cancel-in-progress: true }` to cancel previous runs when you push again to the same branch. This saves CI minutes and speeds up feedback on the latest code.",
    },
    {
      type: "security",
      title: "Never use ${{ github.event.*.body }} in run: steps without sanitization",
      content:
        "PR titles, branch names, and issue bodies are user-controlled. Using them directly in shell commands enables injection: a branch named `; rm -rf /` executes as shell code. Always assign to an environment variable first and quote it.",
    },
  ],
  "tailwind-to-css": [
    {
      type: "tip",
      title: "Use this conversion to understand what Tailwind utilities actually generate",
      content:
        "Converting Tailwind to CSS is a great learning tool. Seeing that `flex items-center gap-4` produces `display: flex; align-items: center; gap: 1rem;` builds understanding of both CSS and Tailwind simultaneously.",
    },
    {
      type: "pitfall",
      title: "Tailwind responsive prefixes generate @media queries, not simple properties",
      content:
        "Converting `md:flex lg:grid` produces two separate @media queries, not just two properties. The CSS output can be significantly more verbose than the Tailwind input, which is exactly why Tailwind exists.",
    },
    {
      type: "example",
      title: "Extract Tailwind-to-CSS for email templates and non-Tailwind projects",
      content:
        "Email clients don't support utility-class CSS. Convert your Tailwind-styled component to plain CSS, then inline it for email compatibility. Also useful when contributing CSS to projects that don't use Tailwind.",
    },
    {
      type: "security",
      title: "Verify converted CSS doesn't include unsafe arbitrary values",
      content:
        "Tailwind's arbitrary value syntax (e.g., [background:url(...)]) passes through to CSS directly. When converting Tailwind to CSS, audit any arbitrary values for unexpected URLs, JavaScript expressions, or data URIs that could pose security risks.",
    },
  ],
  "env-converter": [
    {
      type: "tip",
      title: "Docker Compose env_file and environment behave differently",
      content:
        "env_file loads a .env file at container start. environment sets vars directly in the compose file. env_file values can be overridden by environment. Use env_file for defaults and environment for per-service overrides.",
    },
    {
      type: "pitfall",
      title: "Kubernetes ConfigMaps are not for secrets — use Secrets instead",
      content:
        "ConfigMaps are stored in plain text in etcd and visible to anyone with cluster read access. Use Kubernetes Secrets for credentials, API keys, and certificates. Even better: use a secrets manager like Vault, AWS Secrets Manager, or sealed-secrets.",
    },
    {
      type: "example",
      title: "Generate Kubernetes ConfigMap YAML from .env for fast deployments",
      content:
        "Instead of manually creating ConfigMap YAML, convert your .env file directly. Split sensitive vars into a Secret and non-sensitive vars into a ConfigMap. This ensures your K8s manifests stay in sync with your local dev environment.",
    },
    {
      type: "security",
      title: "Base64 encoding in K8s Secrets is not encryption",
      content:
        "Kubernetes Secrets are just Base64-encoded — anyone with kubectl access can decode them instantly. Enable etcd encryption at rest, use RBAC to limit Secret access, and consider external secrets managers for production workloads.",
    },
  ],
  "css-unit-converter": [
    {
      type: "tip",
      title: "Use rem for typography, px for borders, % or vw/vh for layout",
      content:
        "rem scales with the user's font size preference (accessibility). px is precise and predictable for borders and shadows. Viewport units (vw/vh) and percentages create fluid layouts. Mixing these purposefully is better than using one unit everywhere.",
    },
    {
      type: "pitfall",
      title: "1rem is not always 16px — users change their base font size",
      content:
        "1rem equals the root element's font-size, which defaults to 16px but can be changed by users for accessibility. Designing with rem means your layout respects user preferences. Hardcoding px ignores accessibility settings.",
    },
    {
      type: "example",
      title: "The 62.5% trick: set html { font-size: 62.5% } for easy rem math",
      content:
        "With 62.5%, 1rem = 10px, making conversions trivial: 14px = 1.4rem, 20px = 2rem. Body text then gets `font-size: 1.6rem` (16px). This preserves rem's accessibility benefits while eliminating mental math.",
    },
    {
      type: "security",
      title: "Viewport units can leak information about screen size",
      content:
        "In sensitive applications, CSS that uses vw/vh can be probed via JavaScript to determine exact screen dimensions. This is a minor fingerprinting vector but relevant for privacy-sensitive applications where you want to minimize device identification.",
    },
  ],
  "aspect-ratio-calculator": [
    {
      type: "tip",
      title: "Use CSS aspect-ratio property instead of the padding-top hack",
      content:
        "The old trick of `padding-top: 56.25%` for 16:9 is no longer needed. CSS `aspect-ratio: 16/9` does the same thing with clearer intent and works on any element. Browser support is universal since 2022.",
    },
    {
      type: "pitfall",
      title: "Aspect ratio changes when you add borders or padding",
      content:
        "With `box-sizing: content-box` (default), padding and borders are added outside the content area, changing the effective aspect ratio. Always use `box-sizing: border-box` with aspect-ratio to ensure the ratio includes padding and borders.",
    },
    {
      type: "example",
      title: "Common aspect ratios: 16:9 (video), 4:3 (photos), 1:1 (social avatars)",
      content:
        "YouTube/Vimeo embeds: 16:9. Instagram posts: 1:1 or 4:5. Twitter/X images: 16:9 or 2:1. Blog hero images: typically 2:1 or 21:9. Knowing these standards helps you create images that display without cropping on each platform.",
    },
    {
      type: "security",
      title: "Validate image dimensions server-side to prevent memory exhaustion",
      content:
        "An attacker could upload a 50000x50000px image that's only 1MB compressed but requires 10GB of memory when decompressed. Always validate image dimensions server-side and reject images exceeding reasonable limits for your use case.",
    },
  ],
  "clip-path": [
    {
      type: "tip",
      title: "Use clip-path for reveal animations instead of overflow: hidden",
      content:
        "clip-path can be animated with CSS transitions for smooth reveal effects: transition from `circle(0%)` to `circle(100%)` for a circular reveal, or `inset(0 100% 0 0)` to `inset(0)` for a horizontal wipe. These are GPU-accelerated and performant.",
    },
    {
      type: "pitfall",
      title: "clip-path clips everything including box-shadow and outline",
      content:
        "Elements with clip-path lose their box-shadow and outline because those are rendered outside the clipping region. Use filter: drop-shadow() instead of box-shadow for clipped elements — drop-shadow follows the clip-path shape.",
    },
    {
      type: "example",
      title: "Create custom shaped sections with polygon clip-path",
      content:
        "Angled section dividers (diagonal cuts between page sections) use `clip-path: polygon(0 0, 100% 0, 100% 85%, 0 100%)`. This creates a clean diagonal edge without SVG or pseudo-elements, and the angle is easily adjustable.",
    },
    {
      type: "security",
      title: "clip-path hides content visually but not from screen readers or DOM",
      content:
        "Clipped content is invisible but still present in the DOM and accessible to screen readers, search engines, and JavaScript. Never use clip-path to 'hide' sensitive information — use server-side rendering control instead.",
    },
  ],
  "css-filter": [
    {
      type: "tip",
      title: "Use filter: grayscale(1) for accessible disabled/inactive states",
      content:
        "Instead of reducing opacity (which can make text unreadable), use `filter: grayscale(1) opacity(0.7)` for disabled elements. The grayscale clearly signals 'inactive' while maintaining text legibility and contrast ratios.",
    },
    {
      type: "pitfall",
      title: "CSS filters create a new stacking context — z-index changes may break",
      content:
        "Any non-none filter value creates a new stacking context, which can cause z-index issues. Dropdown menus, modals, and tooltips inside a filtered parent may render incorrectly. This is a common source of 'why is my modal behind the overlay' bugs.",
    },
    {
      type: "example",
      title: "Chain multiple filters for image editing effects",
      content:
        "Instagram-style filters are just CSS filter chains. 'Vintage': `sepia(0.4) contrast(1.1) brightness(1.1) saturate(1.3)`. 'Dramatic': `contrast(1.4) brightness(0.9) saturate(1.5)`. Order matters — filters apply left to right.",
    },
    {
      type: "security",
      title: "CSS filters can be used to exfiltrate data via timing attacks",
      content:
        "In theory, computationally expensive filter chains (multiple blur() operations) can be used for CSS-based timing attacks. While impractical in most scenarios, be aware that complex filters on user-controlled content could theoretically leak information.",
    },
  ],
  "xpath-tester": [
    {
      type: "tip",
      title: "Use // for deep search, / for direct children only",
      content:
        "`//title` finds all title elements anywhere in the document. `/html/head/title` only matches the exact path. Start with // to explore, then tighten to / for precision. // is slower on large documents because it searches the entire tree.",
    },
    {
      type: "pitfall",
      title: "XPath 1.0 has no regex support — use contains() and starts-with()",
      content:
        "Browser-native XPath is version 1.0, which lacks regex. For pattern matching, chain string functions: `//a[contains(@href, 'example') and starts-with(@class, 'nav')]`. XPath 2.0+ has matches() with regex, but browsers don't support it natively.",
    },
    {
      type: "example",
      title: "Select elements by text content with text() and contains()",
      content:
        "`//button[text()='Submit']` matches exact text. `//button[contains(text(), 'Sign')]` matches partial text like 'Sign In', 'Sign Up', 'Sign Out'. Use normalize-space() to handle whitespace: `//p[normalize-space()='Hello World']`.",
    },
    {
      type: "security",
      title: "User-supplied XPath can enable injection in server-side queries",
      content:
        "If you build XPath queries from user input without sanitization, attackers can inject expressions to extract data. `//user[name='admin' or '1'='1']` bypasses authentication. Always parameterize or sanitize XPath inputs on the server side.",
    },
  ],
};
