import { toolFaqsBatch2 } from "./tool-faqs-batch2";
import { toolFaqsBatch3 } from "./tool-faqs-batch3";
import { toolFaqsBatch4 } from "./tool-faqs-batch4";
import { toolFaqsBatch5 } from "./tool-faqs-batch5";

export interface FAQ {
  question: string;
  answer: string;
}

const batch1: Record<string, FAQ[]> = {
  "json-formatter": [
    {
      question: "How do I format JSON online?",
      answer:
        "Paste your JSON into the editor and it formats automatically with syntax highlighting and indentation. DevBolt's JSON Formatter validates your input in real time, showing exact error locations if the JSON is malformed. You can switch between 2-space and 4-space indentation, minify JSON into a single line for production use, or copy the formatted output with one click. Everything runs in your browser — your data never leaves your device, making it safe for formatting API responses, config files, and database exports that may contain sensitive information.",
    },
    {
      question: "How do I validate JSON for syntax errors?",
      answer:
        "Paste your JSON and the validator instantly checks for missing commas, unmatched brackets, trailing commas, incorrect quoting, and other syntax issues. Error messages include the exact line number and character position where the problem occurs, so you can fix it quickly. The validator follows the RFC 8259 JSON specification strictly — it catches common mistakes like single-quoted strings, unquoted keys, and comments that are valid in JavaScript but not in standard JSON. This is especially useful when debugging API payloads or editing configuration files manually.",
    },
    {
      question: "Is it safe to paste sensitive JSON data into an online formatter?",
      answer:
        "DevBolt's JSON Formatter processes everything client-side in your browser using JavaScript. Your data never leaves your device and no API calls are made. You can verify this by opening your browser's Network tab — you will see zero requests when formatting. This makes it safe for formatting JSON containing API keys, tokens, database records, or any sensitive data. Unlike server-based tools that send your data to remote servers for processing, client-side tools guarantee privacy by design.",
    },
    {
      question: "What is the difference between JSON formatting and minifying?",
      answer:
        "JSON formatting adds indentation, line breaks, and whitespace to make JSON human-readable and easier to debug. Minifying removes all unnecessary whitespace to produce the smallest possible output. Formatted JSON is better for development, debugging, and code reviews. Minified JSON is better for production API responses, network payloads, and storage — it reduces file size by 20-40% on average. DevBolt supports both operations: paste JSON and click Format to beautify it, or click Minify to compress it into a single line.",
    },
  ],

  "base64": [
    {
      question: "How do I encode text to Base64?",
      answer:
        "Paste or type your text in the input field and select Encode mode. The tool instantly converts your text to a Base64 string using the standard RFC 4648 alphabet (A-Z, a-z, 0-9, +, /). DevBolt's encoder handles full Unicode including emoji, CJK characters, and diacritics by encoding to UTF-8 first. The output can be copied with one click. Base64 encoding is commonly used to embed binary data in JSON payloads, HTML data URIs, email attachments (MIME), and authentication headers like HTTP Basic Auth.",
    },
    {
      question: "How do I decode a Base64 string?",
      answer:
        "Switch to Decode mode and paste your Base64 string. The decoder converts it back to the original text instantly. It handles standard Base64, URL-safe Base64 (using - and _ instead of + and /), and strings with or without padding characters (=). If the input is not valid Base64, the tool shows an error message. Decoding is useful for inspecting API responses, reading JWT payloads, examining email MIME content, and debugging data URLs in HTML and CSS.",
    },
    {
      question: "What is Base64 encoding used for in web development?",
      answer:
        "Base64 converts binary data into ASCII text using 64 printable characters. In web development, it is used for embedding small images as data URIs in CSS and HTML (avoiding extra HTTP requests), encoding binary files in JSON API payloads, HTTP Basic Authentication headers (username:password), email attachments via MIME encoding, and storing binary data in text-only formats like XML or CSV. Base64 increases data size by approximately 33%, so it is best for small payloads. For large files, direct binary transfer is more efficient.",
    },
    {
      question: "Is Base64 encoding the same as encryption?",
      answer:
        "No, Base64 is not encryption and provides zero security. It is an encoding scheme that converts binary data to text in a reversible way — anyone can decode a Base64 string instantly. Never use Base64 to protect passwords, API keys, or sensitive data. For actual security, use encryption algorithms like AES-256 or asymmetric encryption like RSA. Base64 is purely a data format conversion for transporting binary content through text-only channels.",
    },
  ],

  "hash-generator": [
    {
      question: "What is the difference between SHA-256, SHA-384, and SHA-512?",
      answer:
        "SHA-256, SHA-384, and SHA-512 are all part of the SHA-2 family and differ in output size and internal state. SHA-256 produces a 256-bit (64-character hex) hash, SHA-384 produces 384-bit (96-character), and SHA-512 produces 512-bit (128-character). SHA-256 is the most widely used for digital signatures, TLS certificates, Bitcoin mining, and file integrity checks. SHA-512 is faster on 64-bit processors and preferred for password hashing. SHA-384 is a truncated version of SHA-512, used in TLS 1.2+ cipher suites. All three are considered cryptographically secure as of 2026.",
    },
    {
      question: "Is SHA-1 still safe to use?",
      answer:
        "SHA-1 is no longer considered cryptographically secure. Google demonstrated a practical collision attack (SHAttered) in 2017, producing two different files with the same SHA-1 hash. Major browsers, CAs, and Git have moved away from SHA-1 for security purposes. However, SHA-1 is still acceptable for non-security uses like cache keys, checksums for accidental corruption detection, and content-addressable storage where collision resistance is not critical. For anything security-related — digital signatures, certificate validation, password hashing — use SHA-256 or SHA-512 instead.",
    },
    {
      question: "How do I verify a file's integrity using a hash?",
      answer:
        "Generate a hash of your file and compare it to the hash provided by the source. If both hashes match exactly, the file has not been modified or corrupted. The process is: download the file and the published hash (usually SHA-256), generate a hash of your downloaded file using the same algorithm, and compare the two strings character by character. Even a single bit change in the file produces a completely different hash. DevBolt's Hash Generator and File Hash Calculator both support this workflow with a verify mode for quick comparison.",
    },
  ],

  "uuid-generator": [
    {
      question: "What is a UUID and when should I use one?",
      answer:
        "A UUID (Universally Unique Identifier) is a 128-bit identifier formatted as 32 hexadecimal digits in 5 groups separated by hyphens (e.g., 550e8400-e29b-41d4-a716-446655440000). UUIDs are used as database primary keys, API resource identifiers, session tokens, distributed system correlation IDs, and file names that must be globally unique. The key advantage is that UUIDs can be generated independently on any machine without a central authority and are virtually guaranteed to be unique — the probability of collision for UUID v4 is astronomically low (1 in 2^122).",
    },
    {
      question: "What is the difference between UUID v4 and UUID v7?",
      answer:
        "UUID v4 is randomly generated using 122 random bits, making it unpredictable but unordered. UUID v7 (RFC 9562, 2024) embeds a Unix timestamp in the first 48 bits followed by random bits, making it both unique and time-sortable. UUID v7 is better for database primary keys because its time-ordering means sequential inserts maintain B-tree index locality, dramatically improving write performance in PostgreSQL, MySQL, and other databases. UUID v4 is better when unpredictability matters, like security tokens. For most new applications, UUID v7 is the recommended choice.",
    },
    {
      question: "Can two UUID v4 values ever be the same?",
      answer:
        "Theoretically yes, but practically no. UUID v4 uses 122 random bits, giving 5.3 × 10^36 possible values. To have a 50% chance of one collision, you would need to generate approximately 2.7 × 10^18 UUIDs — that is 2.7 quintillion. Generating one billion UUIDs per second, it would take 86 years to reach that threshold. For all practical purposes, UUID v4 collisions do not happen. However, the randomness quality depends on your system's cryptographic random number generator (CSPRNG). DevBolt uses the Web Crypto API which provides cryptographically strong randomness.",
    },
  ],

  "jwt-decoder": [
    {
      question: "How do I decode a JWT token?",
      answer:
        "Paste your JWT into the input field and it decodes instantly, showing the header, payload, and signature as formatted JSON. The header reveals the signing algorithm (HS256, RS256, etc.) and token type. The payload contains the claims — issuer, subject, audience, expiration, and any custom data. DevBolt's decoder color-codes the three JWT sections (header.payload.signature) and automatically converts Unix timestamps to human-readable dates. No server calls are made — decoding happens entirely in your browser, making it safe for tokens containing user data.",
    },
    {
      question: "Is it safe to paste JWTs into an online decoder?",
      answer:
        "It depends on the tool. DevBolt's JWT Decoder runs entirely client-side — your token never leaves your browser and no API calls are made. You can verify this in your browser's Network tab. This makes it safe for decoding production tokens. However, server-based JWT decoders send your token to a remote server for processing, which could expose the payload contents including user IDs, emails, roles, and permissions. Always check whether a tool is client-side before pasting sensitive JWTs. Note that JWT payloads are only Base64-encoded, not encrypted — anyone with the token can read the payload.",
    },
    {
      question: "What is the difference between HS256 and RS256 JWT algorithms?",
      answer:
        "HS256 (HMAC-SHA256) uses a single shared secret key for both signing and verification. It is simpler but requires distributing the secret to every service that needs to verify tokens. RS256 (RSA-SHA256) uses asymmetric cryptography — a private key signs tokens and a public key verifies them. RS256 is preferred for distributed systems because only the auth server needs the private key while any service can verify tokens using the freely shareable public key. HS256 is faster and suitable for single-service applications. Most modern auth providers (Auth0, Okta, Firebase) default to RS256.",
    },
    {
      question: "How do I check if a JWT has expired?",
      answer:
        "Look at the 'exp' (expiration) claim in the decoded payload. This value is a Unix timestamp representing when the token expires. DevBolt's decoder automatically converts this to a readable date and highlights whether the token is currently valid or expired. You can also check the 'iat' (issued at) and 'nbf' (not before) claims. In code, compare the exp value against the current Unix time: if Date.now() / 1000 > exp, the token has expired. Always validate expiration server-side — never trust client-side checks alone for security decisions.",
    },
  ],

  "regex-tester": [
    {
      question: "How do I test a regular expression online?",
      answer:
        "Enter your regex pattern in the pattern field and your test string in the text area. Matches are highlighted in real time as you type. DevBolt's Regex Tester shows all matches with their captured groups, positions, and full match details. You can toggle flags like global (g), case-insensitive (i), multiline (m), dotAll (s), and unicode (u). The tool uses JavaScript's native RegExp engine, so results match exactly what you would get in Node.js, browsers, and TypeScript. Sample patterns are included for common use cases like email, URL, and date validation.",
    },
    {
      question: "What does the g flag do in regex?",
      answer:
        "The global (g) flag tells the regex engine to find all matches in the input string, not just the first one. Without the g flag, the regex stops after the first match. With it, methods like String.matchAll() and RegExp.exec() iterate through every occurrence. For example, /\\d+/ without g on '123 abc 456' matches only '123', but /\\d+/g matches both '123' and '456'. The g flag is essential for search-and-replace operations, counting occurrences, and extracting all instances of a pattern from text.",
    },
    {
      question: "How do I match an email address with regex?",
      answer:
        "A practical email regex is /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/. This matches the local part (letters, digits, dots, underscores, percent, plus, hyphen), the @ symbol, the domain (letters, digits, dots, hyphens), and a TLD of 2 or more letters. Note that the full RFC 5322 email spec is extremely complex — no simple regex covers all valid email addresses. For production use, combine a reasonable regex for client-side UX feedback with server-side validation that sends a confirmation email. The regex above covers 99.9% of real-world email addresses.",
    },
  ],

  "url-parser": [
    {
      question: "What are the parts of a URL?",
      answer:
        "A URL consists of several components: the scheme/protocol (https://), authority (user:pass@host:port), hostname (example.com), port (443), pathname (/path/to/resource), query string (?key=value&key2=value2), and fragment/hash (#section). DevBolt's URL Parser breaks any URL into all of these components with clear labels. The scheme identifies the protocol (HTTP, HTTPS, FTP). The hostname identifies the server. The path identifies the specific resource. Query parameters pass data to the server. The fragment identifies a section within the page and is never sent to the server.",
    },
    {
      question: "How do I extract query parameters from a URL?",
      answer:
        "Paste the URL into DevBolt's URL Parser and it automatically extracts all query parameters into a readable key-value table. In JavaScript, use the built-in URL and URLSearchParams APIs: new URL(urlString).searchParams gives you a URLSearchParams object with .get(), .getAll(), .has(), and .entries() methods. For example, new URL('https://example.com?page=1&sort=name').searchParams.get('page') returns '1'. This is more reliable than manual string splitting because it handles URL encoding, duplicate keys, and edge cases correctly.",
    },
    {
      question: "What is the difference between encodeURI and encodeURIComponent?",
      answer:
        "encodeURI encodes a full URL, preserving characters that are valid in URLs like :, /, ?, #, and &. It is used to encode an entire URL string. encodeURIComponent encodes a single URL component (like a query parameter value), converting all special characters including :, /, ?, #, and &. Use encodeURIComponent for individual parameter values to prevent them from being interpreted as URL syntax. For example, if a search query contains '&', encodeURIComponent converts it to '%26', preventing it from being read as a parameter separator.",
    },
  ],

  "diff-checker": [
    {
      question: "How do I compare two text files online?",
      answer:
        "Paste the original text in the left panel and the modified text in the right panel. DevBolt's Diff Checker instantly highlights additions in green, deletions in red, and unchanged lines in the default color. The tool shows line-by-line differences with line numbers for easy reference. It works with any text content — code, configuration files, log output, prose, CSV data, or API responses. Everything runs client-side so your data stays private. For large files, the diff algorithm efficiently handles thousands of lines.",
    },
    {
      question: "What algorithm does a diff checker use?",
      answer:
        "Most diff tools use a variation of the Myers diff algorithm, which finds the shortest edit script (minimum number of insertions and deletions) to transform one text into another. It works by computing the longest common subsequence (LCS) between two inputs and representing everything else as additions or deletions. The algorithm runs in O(ND) time where N is the total length and D is the number of differences — it is fast when texts are similar. More advanced tools add a patience diff refinement that produces more human-readable results by anchoring on unique matching lines.",
    },
    {
      question: "Can I compare JSON or code files with a diff checker?",
      answer:
        "Yes, a diff checker works with any text format including JSON, JavaScript, Python, YAML, SQL, HTML, CSS, and more. For JSON specifically, consider using DevBolt's dedicated JSON Diff tool which understands JSON structure and shows semantic differences (added keys, removed keys, changed values) rather than just line-by-line text changes. For code files, the standard Diff Checker is ideal — it shows exactly which lines were added, removed, or modified, similar to what git diff produces.",
    },
  ],

  "epoch-converter": [
    {
      question: "What is a Unix epoch timestamp?",
      answer:
        "A Unix epoch timestamp is the number of seconds that have elapsed since January 1, 1970 00:00:00 UTC (the Unix epoch). For example, 1700000000 represents November 14, 2023 22:13:20 UTC. Timestamps are stored as integers, making them timezone-independent, easy to sort, and compact to store. They are used extensively in APIs, databases, log files, JWT tokens, and cron jobs. JavaScript uses millisecond timestamps (Date.now() returns milliseconds since epoch), while most other languages and systems use seconds.",
    },
    {
      question: "How do I convert a Unix timestamp to a human-readable date?",
      answer:
        "Enter the timestamp in DevBolt's Epoch Converter and it instantly shows the equivalent date and time in multiple formats (UTC, local time, ISO 8601, RFC 2822). The tool auto-detects whether your input is in seconds (10 digits) or milliseconds (13 digits). In JavaScript, use new Date(timestamp * 1000) for second timestamps or new Date(timestamp) for millisecond timestamps. In Python, use datetime.fromtimestamp(timestamp). The converter also shows relative time (e.g., '3 hours ago') for quick context.",
    },
    {
      question: "Why do developers use Unix timestamps instead of date strings?",
      answer:
        "Unix timestamps avoid timezone ambiguity, locale-dependent formatting, and parsing complexity. A timestamp like 1700000000 means the same instant everywhere in the world, while '11/14/2023' could be November 14 or 14 November depending on locale, and '2023-11-14 22:13:20' requires knowing the timezone. Timestamps are also integers, so they sort correctly, compare with simple arithmetic (duration = end - start), and take less storage than date strings. Databases index integers faster than strings. The only downside is that raw timestamps are not human-readable, which is why converter tools exist.",
    },
  ],

  "password-generator": [
    {
      question: "How long should a secure password be in 2026?",
      answer:
        "A secure password should be at least 16 characters long. NIST SP 800-63B recommends a minimum of 8 characters, but security researchers recommend 16+ for important accounts. Each additional character exponentially increases the number of possible combinations — a 16-character password with mixed case, digits, and symbols has approximately 10^31 combinations, making brute-force attacks impractical. For maximum security, use 20+ characters or a passphrase (4-6 random words). DevBolt's Password Generator creates cryptographically random passwords using the Web Crypto API, ensuring true randomness.",
    },
    {
      question: "What makes a password strong?",
      answer:
        "A strong password has three properties: length (16+ characters), randomness (not based on dictionary words, personal info, or patterns), and uniqueness (never reused across sites). Character diversity (uppercase, lowercase, digits, symbols) helps but length matters more — a 20-character lowercase password is stronger than an 8-character password with all character types. The strongest approach is using a password manager to generate and store unique random passwords for every account. Avoid common patterns like 'Password1!', keyboard walks (qwerty), or leetspeak substitutions (p@ssw0rd) — attackers check these first.",
    },
    {
      question: "Is it safe to generate passwords in a browser?",
      answer:
        "Yes, when the tool runs client-side. DevBolt's Password Generator uses the Web Crypto API (crypto.getRandomValues) which provides cryptographically secure random numbers directly in your browser. No passwords are sent to any server. You can verify this by checking the Network tab in developer tools — zero requests are made during generation. The Web Crypto API draws from your operating system's entropy pool (the same source used by OpenSSL and other cryptographic software), making browser-generated passwords as secure as those from command-line tools.",
    },
  ],

  "case-converter": [
    {
      question: "What are the common case conventions in programming?",
      answer:
        "The main conventions are: camelCase (first word lowercase, subsequent words capitalized — used in JavaScript, Java, TypeScript variables), PascalCase (all words capitalized — used for classes, React components, C# methods), snake_case (words separated by underscores, all lowercase — used in Python, Ruby, Rust, database columns), kebab-case (words separated by hyphens — used in CSS, HTML attributes, URLs), SCREAMING_SNAKE_CASE (uppercase snake_case — used for constants in most languages), and Title Case (first letter of each word capitalized — used for headings). DevBolt converts between all of these instantly.",
    },
    {
      question: "When should I use camelCase vs snake_case?",
      answer:
        "Follow the convention of your language and ecosystem. JavaScript, TypeScript, and Java use camelCase for variables and functions, PascalCase for classes. Python, Ruby, and Rust use snake_case for variables and functions, PascalCase for classes. Go uses camelCase for unexported and PascalCase for exported identifiers. Database columns typically use snake_case. REST API JSON responses vary — JavaScript APIs often use camelCase while Python APIs use snake_case. Consistency within a codebase matters more than which convention you choose. Many teams configure linters to enforce a single style.",
    },
    {
      question: "How do I convert variable names between cases in bulk?",
      answer:
        "Paste multiple variable names (one per line or separated by spaces) into DevBolt's Case Converter and select the target case. The tool handles conversion from any input case to any output case automatically, detecting word boundaries from camelCase humps, underscores, hyphens, and spaces. For bulk conversion in code, most IDEs offer find-and-replace with regex, and tools like sed or rename utilities handle file-level conversions. When migrating between conventions (e.g., Python to JavaScript), API serialization libraries like Pydantic or Jackson provide automatic case conversion for JSON fields.",
    },
  ],

  "csv-json": [
    {
      question: "How do I convert CSV to JSON?",
      answer:
        "Paste your CSV data with headers in the first row. DevBolt's converter automatically parses the CSV using the detected delimiter (comma, tab, semicolon, or pipe) and converts each row into a JSON object where keys are the column headers and values are the cell contents. The output is a JSON array of objects. The tool handles quoted fields, escaped characters, empty values, and multiline fields correctly. You can download the result as a .json file. This is useful for importing spreadsheet data into APIs, databases, and JavaScript applications.",
    },
    {
      question: "How do I convert JSON to CSV?",
      answer:
        "Paste a JSON array of objects and the converter extracts all unique keys as CSV column headers, then maps each object's values to the corresponding columns. Nested objects are flattened using dot notation (e.g., address.city becomes a column). Missing values become empty cells. The output can be downloaded as a .csv file that opens directly in Excel, Google Sheets, or Numbers. This is ideal for exporting API data to spreadsheets, generating reports, and importing data into tools that only accept CSV format.",
    },
    {
      question: "What delimiter should I use for CSV files?",
      answer:
        "Comma (,) is the standard and most widely supported delimiter. Use tab-separated values (TSV) when your data contains many commas (like addresses or descriptions). Semicolons are common in European locales where commas are used as decimal separators. Pipe (|) is used in some legacy systems and data warehouses. When choosing a delimiter, pick a character that does not appear in your data, or ensure values containing the delimiter are properly quoted. Most modern CSV parsers handle quoted fields correctly regardless of delimiter choice.",
    },
  ],

  "url-encoder": [
    {
      question: "What is URL encoding and why is it needed?",
      answer:
        "URL encoding (percent-encoding) replaces unsafe characters in URLs with a percent sign followed by two hex digits. For example, a space becomes %20 and an ampersand becomes %26. It is needed because URLs can only contain a limited set of ASCII characters. Special characters like spaces, &, =, ?, #, and non-ASCII characters (accents, CJK, emoji) must be encoded to be transmitted correctly. Without encoding, these characters would be misinterpreted as URL syntax — a literal & would be read as a parameter separator instead of data.",
    },
    {
      question: "What is the difference between encodeURI and encodeURIComponent in JavaScript?",
      answer:
        "encodeURI encodes a full URL string, preserving URL-structural characters like ://?#[]@!$&'()*+,;=. Use it when encoding a complete URL. encodeURIComponent encodes a single URL component value, converting everything except letters, digits, and -_.~. Use it for query parameter values, path segments, and fragment identifiers. Example: to encode the query value 'a=1&b=2', encodeURIComponent produces 'a%3D1%26b%3D2' (safe), while encodeURI produces 'a=1&b=2' (broken, because = and & retain their URL meaning). Always use encodeURIComponent for user-provided data in URLs.",
    },
    {
      question: "How do I decode a percent-encoded URL?",
      answer:
        "Paste the encoded URL into DevBolt's URL Decoder and it converts percent-encoded sequences back to readable characters. In JavaScript, use decodeURIComponent() for individual values or decodeURI() for full URLs. For example, decodeURIComponent('%E4%BD%A0%E5%A5%BD') returns '你好'. The decoder handles UTF-8 multi-byte sequences, plus signs as spaces (common in form data), and nested encoding. If you see double-encoded URLs like %2520 (where %25 is the encoded percent sign), you may need to decode twice.",
    },
  ],

  "json-yaml": [
    {
      question: "What is the difference between JSON and YAML?",
      answer:
        "JSON uses braces, brackets, and quotes with a strict syntax — it is great for machine parsing and APIs. YAML uses indentation-based syntax with no braces or quotes for most values — it is easier for humans to read and write. JSON does not support comments; YAML does. JSON has fewer data types; YAML supports dates, timestamps, and multi-line strings natively. YAML is a superset of JSON — all valid JSON is valid YAML. JSON is the standard for APIs and data exchange. YAML is preferred for configuration files (Kubernetes, Docker Compose, GitHub Actions, Ansible).",
    },
    {
      question: "How do I convert JSON to YAML?",
      answer:
        "Paste your JSON into DevBolt's JSON-YAML Converter and click the YAML output tab. The converter transforms JSON objects into YAML mappings, arrays into YAML sequences, and preserves data types. Nested objects become indented blocks. Strings that could be ambiguous (containing special YAML characters) are automatically quoted. The output is valid YAML that can be used directly in Kubernetes manifests, Docker Compose files, CI/CD configs, and other YAML-based tools. You can also convert YAML back to JSON with the reverse operation.",
    },
    {
      question: "Why do Kubernetes and Docker use YAML instead of JSON?",
      answer:
        "Kubernetes and Docker Compose use YAML because it supports comments (essential for documenting complex configs), is more readable for deeply nested structures (indentation vs braces), requires less syntax for the same content, and supports multi-line strings without escaping. YAML reduces configuration errors because the structure is visually apparent. However, Kubernetes actually accepts both JSON and YAML — you can submit JSON manifests to kubectl. Many teams write YAML for readability but generate it from code or templates in JSON-native languages like JavaScript and Go.",
    },
  ],

  "html-entities": [
    {
      question: "What are HTML entities and when should I use them?",
      answer:
        "HTML entities represent special characters using a named or numeric code — &amp; for &, &lt; for <, &gt; for >, &quot; for \", and &#39; for '. You must use entities when displaying characters that have special meaning in HTML. The < and > characters would be interpreted as HTML tags, & starts an entity reference, and quotes can break attribute values. Entities are also used for characters not available on your keyboard, like &copy; (©), &mdash; (—), &euro; (€), and Unicode symbols. DevBolt's encoder handles both named entities and numeric codes.",
    },
    {
      question: "What is the difference between HTML encoding and URL encoding?",
      answer:
        "HTML encoding converts characters to HTML entities for safe display in web pages. A less-than sign becomes &lt; so browsers render it as text instead of interpreting it as a tag. URL encoding (percent-encoding) converts characters to percent-hex codes for safe transmission in URLs. A space becomes %20 so it is not misread as a URL delimiter. HTML encoding protects against XSS (cross-site scripting) attacks in page content. URL encoding ensures data passes through URL parsing correctly. They serve different purposes and are not interchangeable — use HTML encoding in HTML content and URL encoding in URLs.",
    },
    {
      question: "How do I prevent XSS attacks with HTML encoding?",
      answer:
        "Always HTML-encode user-provided content before inserting it into HTML pages. This converts < to &lt;, > to &gt;, & to &amp;, \" to &quot;, and ' to &#39;, preventing injected scripts from executing. In React, JSX automatically escapes values in curly braces. In server-rendered HTML, use your framework's built-in escaping (htmlspecialchars in PHP, html.escape in Python, ERB's h helper in Rails). Never use innerHTML or dangerouslySetInnerHTML with unsanitized user input. For rich text, use a sanitization library like DOMPurify that allows safe HTML tags while stripping dangerous elements.",
    },
  ],

  "qr-code": [
    {
      question: "How do I generate a QR code from a URL?",
      answer:
        "Paste your URL into DevBolt's QR Code Generator and a QR code is generated instantly. You can customize the size, error correction level (Low, Medium, Quartile, High), and colors. Higher error correction allows the QR code to remain scannable even if partially obscured — High level can tolerate up to 30% damage. Download the QR code as a PNG image or copy it directly. The QR code works with any text content: URLs, WiFi credentials, contact cards (vCard), email addresses, phone numbers, and plain text messages.",
    },
    {
      question: "What is QR code error correction and which level should I use?",
      answer:
        "QR codes include redundant data that allows recovery even if part of the code is damaged or obscured. There are four levels: Low (7% recovery), Medium (15%), Quartile (25%), and High (30%). Medium is the default and works well for most digital uses like websites and apps. Use High when the QR code will be printed on materials that may get damaged, or if you want to add a logo overlay in the center. Use Low for maximum data density when the code will only be displayed on screens. Higher correction levels increase the QR code's physical size.",
    },
    {
      question: "What content types can QR codes encode?",
      answer:
        "QR codes can encode any text data. Common structured formats include: URLs (https://example.com), WiFi networks (WIFI:T:WPA;S:NetworkName;P:Password;;), contacts (BEGIN:VCARD format), email (mailto:user@example.com), phone numbers (tel:+1234567890), SMS (smsto:+1234567890:message), calendar events (BEGIN:VEVENT format), geographic coordinates (geo:latitude,longitude), and plain text. The maximum capacity is about 4,296 alphanumeric characters or 2,953 bytes of binary data. Shorter content produces smaller, more easily scannable QR codes.",
    },
  ],

  "sql-formatter": [
    {
      question: "How do I format SQL queries online?",
      answer:
        "Paste your SQL query into DevBolt's SQL Formatter and it instantly reformats it with proper indentation, keyword capitalization, and line breaks. The formatter handles SELECT, INSERT, UPDATE, DELETE, CREATE TABLE, JOIN, subqueries, CTEs (WITH), CASE statements, and window functions. It supports standard SQL, PostgreSQL, MySQL, SQLite, and SQL Server syntax. You can switch between formatted (readable) and minified (compact) output. Formatted SQL is essential for code reviews, documentation, and debugging complex queries with multiple joins or nested subqueries.",
    },
    {
      question: "Should SQL keywords be uppercase or lowercase?",
      answer:
        "Convention strongly favors UPPERCASE for SQL keywords (SELECT, FROM, WHERE, JOIN) while keeping table and column names in their natural case. This visual distinction makes queries easier to read by separating the SQL structure from the data identifiers. Most SQL style guides and linters (SQLFluff, pgFormatter) enforce uppercase keywords. Modern SQL is case-insensitive for keywords, so both work functionally. However, consistent formatting improves readability across teams. DevBolt's formatter automatically uppercases keywords while preserving your table and column name casing.",
    },
    {
      question: "How do I minify SQL for production use?",
      answer:
        "Switch to Minify mode in DevBolt's SQL Formatter to remove all unnecessary whitespace, line breaks, and extra spaces while preserving the query's functionality. Minified SQL uses less bandwidth when transmitted over networks and slightly reduces parsing time. However, unlike JavaScript or CSS minification, SQL minification provides minimal real-world performance benefit because the SQL query parser ignores whitespace. Minification is mainly useful for embedding SQL in code strings, logging compact query representations, or reducing payload size in API responses that include SQL. Keep formatted versions in your source code for readability.",
    },
  ],

  "json-to-typescript": [
    {
      question: "How do I generate TypeScript types from JSON?",
      answer:
        "Paste your JSON data into DevBolt's JSON to TypeScript converter and it automatically infers TypeScript interfaces from the structure. Object keys become interface properties with inferred types (string, number, boolean, null). Nested objects generate separate named interfaces. Arrays infer their element type from the first element. The tool handles optional fields (present in some array items but not others), null values (typed as null union), and mixed-type arrays. You can toggle between interface and type alias output, add export keywords, and download the generated .ts file.",
    },
    {
      question: "Should I use interface or type for TypeScript types?",
      answer:
        "Both work for object shapes, but conventions differ. Use interface for object contracts and public APIs — interfaces support declaration merging (extending across files), extends for inheritance, and are the TypeScript team's recommendation for object types. Use type aliases for unions (string | number), intersections, mapped types, conditional types, and non-object types. In practice, for JSON-to-TypeScript conversion, both produce identical results. Most codebases pick one for objects and stay consistent. React component props typically use interface; utility types use type.",
    },
    {
      question: "How does the JSON to TypeScript converter handle nested objects and arrays?",
      answer:
        "Nested objects are extracted into separate named interfaces. For example, { \"user\": { \"name\": \"string\" } } generates a root interface with a user property typed as a separate User interface. Arrays of objects generate an interface for the array element type. Arrays of primitives infer the primitive type (string[], number[]). Mixed-type arrays become union types. Deeply nested structures produce multiple interfaces with clear naming based on the property path. Null values create nullable union types (string | null). Empty arrays default to any[] since the element type cannot be inferred.",
    },
  ],

  "code-minifier": [
    {
      question: "What does minifying code do?",
      answer:
        "Minifying removes all unnecessary characters from source code without changing its functionality. This includes whitespace, line breaks, comments, and in the case of JavaScript, shortening variable names. For CSS, it also merges duplicate selectors and shorthand properties. Minification typically reduces JavaScript file size by 40-60% and CSS by 20-40%. Smaller files download faster, reducing page load time and bandwidth costs. Most build tools (webpack, Vite, esbuild) minify automatically for production builds. DevBolt's minifier handles JavaScript, CSS, and HTML with instant results and no server upload.",
    },
    {
      question: "What is the difference between minifying and beautifying code?",
      answer:
        "Minifying compresses code by removing all non-essential whitespace, comments, and formatting to produce the smallest possible file. Beautifying (also called prettifying or formatting) does the opposite — it adds consistent indentation, line breaks, and spacing to make code human-readable. Minified code is for production deployment where file size matters. Beautified code is for development where readability matters. You might beautify minified code to debug a production issue, or minify your source code for deployment. Both operations are reversible and do not change the code's behavior.",
    },
    {
      question: "Should I minify HTML?",
      answer:
        "HTML minification provides smaller gains than JavaScript or CSS minification — typically 10-20% size reduction. The benefit depends on how much whitespace and comments your HTML contains. For server-rendered pages with lots of template comments and indentation, minification helps. For SPAs where HTML is minimal and JavaScript is the main payload, the benefit is negligible. Modern HTTP compression (Brotli/Gzip) already eliminates most whitespace redundancy during transfer. Focus on minifying JavaScript and CSS first. HTML minification is a micro-optimization worth doing only after addressing larger performance bottlenecks.",
    },
  ],

  "chmod-calculator": [
    {
      question: "How do Unix file permissions work?",
      answer:
        "Unix file permissions control who can read (r), write (w), and execute (x) files and directories. Permissions are assigned to three groups: the file owner (user), the owner's group, and everyone else (other). Each permission is represented by a bit: read=4, write=2, execute=1. These are summed per group to form a 3-digit octal number. For example, 755 means owner can read+write+execute (7), group can read+execute (5), and others can read+execute (5). The command chmod 755 file.txt sets these permissions. DevBolt's calculator lets you toggle permissions visually and see the resulting octal and symbolic notation.",
    },
    {
      question: "What does chmod 755 mean?",
      answer:
        "chmod 755 sets the file permissions to rwxr-xr-x. Breaking it down: 7 (owner) = read (4) + write (2) + execute (1) — full access. 5 (group) = read (4) + execute (1) — can read and execute but not modify. 5 (other) = read (4) + execute (1) — same as group. This is the standard permission for executable scripts, web server directories, and programs that should be readable and runnable by everyone but only editable by the owner. It is one of the most commonly used permission sets in Linux systems.",
    },
    {
      question: "What is the difference between chmod 644 and chmod 755?",
      answer:
        "chmod 644 (rw-r--r--) allows the owner to read and write, while group and others can only read. This is the standard permission for regular files like HTML pages, images, configuration files, and documents. chmod 755 (rwxr-xr-x) adds execute permission for all users, making it suitable for executable scripts, programs, and directories. Directories require execute permission for users to list their contents and traverse into them. A common Linux setup uses 755 for directories and 644 for files. Web servers typically need 755 on document root directories and 644 on static files.",
    },
  ],

  "ai-model-comparison": [
    {
      question: "How do I compare AI models like GPT-4, Claude, and Gemini side by side?",
      answer:
        "Use DevBolt's AI Model Comparison table to filter and sort 21 models from 7 providers including OpenAI, Anthropic, Google, Meta, Mistral, xAI, and DeepSeek. You can compare context window sizes, pricing per million tokens, supported modalities, and release dates in a single view. Click any two models to see a detailed side-by-side comparison highlighting the differences. The table is kept up to date with current pricing and capabilities. This saves hours of switching between provider websites and documentation pages to gather the same information. All data is displayed client-side with no account or API key required.",
    },
    {
      question: "What is the difference between context window size and max output tokens in AI models?",
      answer:
        "The context window is the total number of tokens an AI model can process in a single request, including both your input prompt and the model's response. Max output tokens is the maximum length of the model's generated response alone. For example, a model with a 128K context window and 4K max output can accept roughly 124K tokens of input but will only generate up to 4K tokens in its reply. Larger context windows allow processing longer documents, codebases, or conversation histories. Models like Claude offer 200K context windows while GPT-4 Turbo offers 128K. Choosing the right context size depends on whether you need to analyze large documents or just handle short conversational exchanges.",
    },
    {
      question: "How much does it cost to use AI model APIs like GPT-4 and Claude?",
      answer:
        "AI model API pricing is measured per million tokens, with separate rates for input and output tokens. Pricing varies significantly: frontier models cost roughly $3-15 per million input tokens and $15-75 per million output tokens. Smaller models are 10-20x cheaper. Open-source models like Llama and Mistral can be self-hosted for the cost of GPU compute. DevBolt's comparison table shows current pricing for all major models so you can estimate costs before committing to a provider. Output tokens are typically 3-5x more expensive than input tokens across all providers.",
    },
  ],

  "ascii-art": [
    {
      question: "How do I convert text to ASCII art?",
      answer:
        "Type your text into the input field and select one of the available font styles to instantly generate ASCII art. DevBolt's ASCII Art Generator supports 7 font styles ranging from compact to large block letters, each producing a different visual effect. The generated ASCII art uses standard printable characters that render correctly in any monospaced font environment including terminals, code comments, README files, and plain text documents. You can copy the output with one click. ASCII art is commonly used for application banners displayed at startup, decorative code comments marking major sections, and text-based logos in CLI tools and documentation.",
    },
    {
      question: "How do I add ASCII art banners to my source code comments?",
      answer:
        "Generate your text in the desired font style, then use the comment wrapping feature to automatically wrap the output in comment syntax for your programming language. DevBolt supports wrapping in C-style block comments (/* */), single-line comments (//), hash comments (#), and HTML comments. This is a popular technique for marking major sections in source code files, adding eye-catching headers to configuration files, and creating startup banners for CLI applications. The comment wrapper preserves the monospaced alignment of the ASCII art characters so the banner renders correctly when viewed in any code editor or terminal with a fixed-width font.",
    },
    {
      question: "What fonts work best for ASCII art in terminals?",
      answer:
        "ASCII art requires a monospaced (fixed-width) font where every character occupies the same horizontal space. Common monospaced fonts include Consolas, Fira Code, JetBrains Mono, Source Code Pro, Menlo, and Courier New. All terminals and code editors use monospaced fonts by default, so ASCII art displays correctly in those environments. Problems arise when ASCII art is pasted into proportional-font contexts like word processors, email clients, or web pages without a monospace CSS rule. If your ASCII art looks misaligned, verify the rendering context uses a monospaced font. DevBolt's generator produces output optimized for standard monospace character widths.",
    },
  ],

  "border-radius": [
    {
      question: "How do I set different border-radius values for each corner in CSS?",
      answer:
        "Use the individual corner properties: border-top-left-radius, border-top-right-radius, border-bottom-right-radius, and border-bottom-left-radius. Or use the shorthand with four values in clockwise order: border-radius: 10px 20px 30px 40px sets top-left to 10px, top-right to 20px, bottom-right to 30px, and bottom-left to 40px. With two values, the first applies to top-left and bottom-right, the second to top-right and bottom-left. DevBolt's visual generator provides sliders for each corner so you can design the exact shape you want and copy the generated CSS code instantly.",
    },
    {
      question: "How do I create a circle or pill shape with border-radius?",
      answer:
        "For a perfect circle, set border-radius to 50% on a square element with equal width and height. For a pill or capsule shape, set border-radius to a value equal to or greater than half the element's height on a rectangular element. A button that is 40px tall with border-radius: 20px or border-radius: 9999px creates a pill shape. The 9999px trick works because browsers clamp the radius to the maximum possible curve, ensuring a perfect pill regardless of element dimensions. DevBolt's preview shows the shape updating in real time as you adjust the radius values.",
    },
    {
      question: "What is the difference between px and % values for border-radius?",
      answer:
        "Pixel values create a fixed curve size regardless of the element's dimensions. A 10px border-radius always creates the same size curve on any element. Percentage values are relative to the element's dimensions, with horizontal radii calculated from the width and vertical radii from the height. The most notable difference appears with 50%: on a square element, 50% creates a perfect circle, while a fixed pixel value only rounds the corners. For responsive designs, percentages adapt as element sizes change. For consistent small corner rounding across different components like cards and buttons, pixel values like 8px or 12px are more predictable and commonly used in design systems.",
    },
  ],

  "box-shadow": [
    {
      question: "How do I create a CSS box shadow?",
      answer:
        "Adjust the horizontal offset, vertical offset, blur radius, spread radius, and color using DevBolt's visual controls. The tool generates the CSS box-shadow property in real time as you change values. A typical subtle shadow looks like box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) where 0 is horizontal offset, 4px pushes the shadow downward, 6px controls blur softness, and -1px spread shrinks the shadow slightly. You can add multiple shadow layers for realistic depth, toggle the inset keyword for inner shadows, and preview the result on a sample card element. Copy the generated CSS and paste it directly into your stylesheet.",
    },
    {
      question: "What do the box-shadow values mean in CSS?",
      answer:
        "The CSS box-shadow property accepts up to six values. Horizontal offset (required) moves the shadow left (negative) or right (positive). Vertical offset (required) moves it up (negative) or down (positive). Blur radius (optional, default 0) controls the softness of shadow edges. Spread radius (optional, default 0) expands or shrinks the shadow beyond the element's dimensions. Color (optional) sets the shadow color, commonly using rgba for semi-transparent shadows. The inset keyword (optional) renders the shadow inside the element instead of outside. Multiple shadows can be combined with commas for layered depth effects.",
    },
    {
      question: "How do I create Material Design elevation shadows in CSS?",
      answer:
        "Material Design elevation uses multiple layered box shadows to simulate realistic depth. Each elevation level combines a key shadow (sharp, directional), an ambient shadow (soft, spread), and a penumbra shadow (medium softness). Higher elevations increase the offset and blur values. DevBolt's box shadow generator lets you build and preview these multi-layer shadows visually, adding or removing layers as needed. Material Design defines 24 elevation levels, but most interfaces use only 4 to 6 distinct levels to establish visual hierarchy. For cards, use elevation 1-2. For modals and dialogs, use elevation 8-16.",
    },
  ],

  "code-screenshot": [
    {
      question: "How do I create beautiful code screenshots for social media?",
      answer:
        "Paste your code into DevBolt's Code Screenshot Generator, select a theme, choose your programming language for syntax highlighting, and export a polished image. The tool offers 8 color themes and supports 13 languages including JavaScript, TypeScript, Python, Go, Rust, and more. You can customize the window frame style, padding, background color, and font size. The generator renders screenshots using HTML Canvas directly in your browser, so your code is never uploaded to any server. This makes it safe to screenshot proprietary code. The exported PNG images are high-resolution and ready to share on Twitter, LinkedIn, blog posts, and documentation.",
    },
    {
      question: "What themes are available for code screenshots?",
      answer:
        "DevBolt offers 8 color themes: Dracula (purple background with pastel syntax colors), Monokai (dark gray with vibrant highlights), GitHub Dark (GitHub's dark mode palette), One Dark (Atom editor theme), Nord (arctic blue tones), Solarized Dark (warm dark palette), Night Owl (deep blue with bright accents), and GitHub Light (clean white background). Each theme applies coordinated colors to keywords, strings, comments, functions, and operators. Dark themes like Dracula and One Dark work best for social media because they contrast well against white feeds. Light themes like GitHub Light suit documentation and blog posts with light backgrounds.",
    },
    {
      question: "How do I choose the right language for syntax highlighting in screenshots?",
      answer:
        "Select the programming language that matches your code to ensure proper syntax highlighting with correct keyword, string, comment, and operator colors. The language selector supports JavaScript, TypeScript, Python, Java, Go, Rust, C, C++, Ruby, PHP, Swift, Kotlin, and HTML. If your language is not listed, choose the closest relative. Incorrect language selection produces wrong or missing highlighting, making the screenshot less readable. For mixed-language snippets like HTML with embedded JavaScript, choose the dominant language. Higher padding values create more breathing room around the code for better readability at smaller sizes on social media.",
    },
  ],

  "color-converter": [
    {
      question: "How do I convert a HEX color to RGB?",
      answer:
        "Enter your HEX color code (e.g., #3B82F6) into the input field and the tool instantly displays the equivalent RGB, HSL, and other color format values. HEX codes represent colors using hexadecimal values for red, green, and blue channels. Each pair of hex digits maps to a 0-255 RGB value. For example, #FF0000 converts to RGB(255, 0, 0) because FF in hexadecimal equals 255 in decimal. DevBolt's Color Converter handles shorthand HEX codes like #F00, 8-digit HEX with alpha (#FF000080), and validates input in real time. The conversion runs entirely in your browser.",
    },
    {
      question: "What is the difference between HEX, RGB, and HSL color formats?",
      answer:
        "HEX, RGB, and HSL represent the same colors using different notation systems. HEX uses a six-character hexadecimal string prefixed with # and is the most common format in CSS. RGB specifies red, green, and blue channel values from 0 to 255, making it intuitive for programmatic color manipulation. HSL defines colors by hue (0-360 degrees on the color wheel), saturation (0-100%), and lightness (0-100%), making it easiest for adjusting brightness or vibrancy. All three formats represent 16.7 million colors. Choose HEX for compact CSS declarations, RGB for channel-level manipulation in code, and HSL when you need to create lighter or darker variants of a color.",
    },
    {
      question: "Can I convert colors with transparency (alpha channel)?",
      answer:
        "Yes, DevBolt's Color Converter supports alpha channel conversions across all formats. You can input 8-digit HEX codes (e.g., #3B82F680 where the last two digits represent opacity), RGBA values (e.g., rgba(59, 130, 246, 0.5)), or HSLA values (e.g., hsla(217, 91%, 60%, 0.5)). The alpha channel represents opacity on a scale from 0 (fully transparent) to 1 (fully opaque). In 8-digit HEX, the last two characters encode the alpha as a hexadecimal value from 00 (transparent) to FF (opaque). The tool converts the alpha value accurately between all supported formats.",
    },
  ],

  "color-palette": [
    {
      question: "How do I generate a color palette from a single base color?",
      answer:
        "Enter a base color in HEX, RGB, or HSL format and DevBolt generates harmonious palettes using color theory algorithms. The tool creates complementary, analogous, triadic, split-complementary, and monochromatic palettes by calculating mathematically related hues on the color wheel. Each palette includes colors with their HEX, RGB, and HSL values ready to copy. Monochromatic palettes vary the saturation and lightness of your base color, producing tints and shades ideal for UI design. The calculations happen entirely in your browser using HSL color space transformations ensuring colors follow established color theory principles for visual harmony.",
    },
    {
      question: "What is the difference between complementary, analogous, and triadic color schemes?",
      answer:
        "Complementary schemes pair two colors opposite each other on the color wheel (180 degrees apart), like blue and orange, creating high visual contrast ideal for call-to-action buttons. Analogous schemes use colors adjacent on the wheel (within 30 degrees), like blue, blue-green, and green, producing harmonious, cohesive palettes suited for calm professional designs. Triadic schemes use three colors spaced at 120-degree intervals, like red, blue, and yellow, providing vibrant variety while maintaining balance. Choose complementary for impact, analogous for subtlety, and triadic for dynamic energy. Each scheme serves different design goals and emotional responses.",
    },
    {
      question: "How do I create an accessible color palette for web design?",
      answer:
        "Start by generating a palette from your brand color, then verify that every text-to-background combination meets WCAG 2.1 contrast requirements: at least 4.5:1 for normal text (Level AA) and 7:1 for enhanced compliance (Level AAA). Large text (18px bold or 24px regular) requires a minimum 3:1 ratio. Ensure your palette includes at least one very dark color for body text and one very light color for backgrounds. Test interactive elements like links and buttons separately. Avoid conveying meaning through color alone, as this excludes colorblind users. Use DevBolt's Contrast Checker alongside the palette generator to test each combination.",
    },
  ],

  "compression-tester": [
    {
      question: "What is the difference between Brotli, Gzip, and Deflate compression?",
      answer:
        "Brotli, Gzip, and Deflate are HTTP compression algorithms that reduce file transfer sizes. Deflate is the oldest algorithm using LZ77 and Huffman coding. Gzip wraps Deflate with a header and checksum, and has been the web standard since the 1990s. Brotli, developed by Google, uses a larger sliding window, context modeling, and a static dictionary of common web strings, achieving 15-25% better compression than Gzip on typical web assets. DevBolt's Compression Tester lets you compare all three algorithms side by side on your actual content, showing compressed sizes and ratios instantly in your browser. All compression runs client-side.",
    },
    {
      question: "How much smaller will Brotli make my JavaScript and CSS files?",
      answer:
        "Brotli typically compresses JavaScript files 15-25% smaller than Gzip and CSS files 10-20% smaller at comparable compression levels. For example, a 100KB JavaScript bundle might compress to 30KB with Gzip but only 24KB with Brotli. The improvement comes from Brotli's built-in dictionary of common web strings like HTML tags, CSS properties, and JavaScript keywords. The actual savings depend on your content. Repetitive code with common patterns compresses better. Paste your actual files into DevBolt's Compression Tester to see exact before-and-after sizes for all three algorithms compared on your specific content.",
    },
    {
      question: "Should I use Brotli or Gzip for my web server?",
      answer:
        "Use Brotli for static assets and Gzip as a fallback. Brotli achieves better compression ratios but is slower to compress at high quality levels, making it ideal for pre-compressed static files served from CDNs. Gzip is faster to compress on the fly, better suited for dynamic content generated per request. Most CDNs including Cloudflare, AWS CloudFront, Vercel, and Netlify support Brotli automatically. Browser support exceeds 97% globally. Configure your server to serve Brotli when the client sends Accept-Encoding: br, falling back to Gzip for older clients. Pre-compress static assets with Brotli at level 11 during build time for maximum performance.",
    },
  ],

  "contrast-checker": [
    {
      question: "What is WCAG color contrast and why does it matter?",
      answer:
        "WCAG color contrast is the luminance ratio between foreground text and its background, measured on a scale from 1:1 (no contrast) to 21:1 (maximum, black on white). The Web Content Accessibility Guidelines require minimum contrast ratios so people with low vision or color deficiencies can read content. Level AA requires 4.5:1 for normal text and 3:1 for large text (18px bold or 24px regular). Level AAA requires 7:1 for normal text and 4.5:1 for large text. Meeting these standards is a legal requirement under accessibility laws like the ADA, Section 508, and the European Accessibility Act.",
    },
    {
      question: "How do I check if my colors meet WCAG accessibility standards?",
      answer:
        "Enter your foreground (text) color and background color using HEX, RGB, or HSL values in DevBolt's Contrast Checker. The tool calculates the contrast ratio and shows whether the combination passes WCAG 2.1 Level AA and Level AAA for both normal and large text. If a combination fails, try darkening the text or lightening the background until the required ratio is met. The tool displays the exact ratio so you can gauge how close you are. A common accessibility failure is light gray text on white backgrounds. Test all text-background combinations in your design system, including links, buttons, placeholder text, and error messages.",
    },
    {
      question: "What is the minimum contrast ratio for accessible text?",
      answer:
        "The minimum contrast ratio under WCAG 2.1 Level AA is 4.5:1 for normal-sized text and 3:1 for large text. For the stricter Level AAA standard, normal text needs 7:1 and large text needs 4.5:1. Non-text elements like form input borders, icons, and graphical objects require at least 3:1 against adjacent colors per WCAG 2.1 Success Criterion 1.4.11. These ratios are calculated using a formula based on relative luminance of the two colors. Pure black on white has the maximum ratio of 21:1. Most accessibility audits reference Level AA thresholds. DevBolt's checker evaluates all levels simultaneously.",
    },
  ],

  "cron-generator": [
    {
      question: "How do I build a cron expression with a visual editor?",
      answer:
        "DevBolt's Cron Generator provides dropdown menus and toggles for each field in a cron expression: minute, hour, day of month, month, and day of week. Select your desired values and the tool constructs the cron expression automatically, displaying it alongside a human-readable description and the next 5 scheduled run times. This eliminates the need to memorize cron syntax. You can build common schedules like every weekday at 9 AM, every first of the month, or every 15 minutes during business hours. The generated expression works with Linux crontab, AWS CloudWatch, GitHub Actions, and most scheduling systems.",
    },
    {
      question: "What is the format of a cron expression?",
      answer:
        "A standard cron expression has five space-separated fields: minute (0-59), hour (0-23), day of month (1-31), month (1-12), and day of week (0-7, where 0 and 7 both represent Sunday). Special characters include asterisk (*) for any value, comma (,) for lists, hyphen (-) for ranges, and slash (/) for step intervals. For example, '30 9 * * 1-5' means 9:30 AM every weekday, '*/15 * * * *' means every 15 minutes, and '0 0 1 * *' means midnight on the first of each month. Some systems like Quartz add a sixth field for seconds at the beginning.",
    },
    {
      question: "What is the difference between cron and crontab?",
      answer:
        "Cron is the background daemon on Unix-like systems that executes scheduled commands at specified times. Crontab (cron table) is the configuration file that defines the schedule entries. Each user has their own crontab managed via the crontab command: crontab -e to edit, crontab -l to list current jobs, and crontab -r to remove all jobs. System-wide cron jobs live in /etc/crontab or as files in /etc/cron.d/. The distinction matters because cron is the engine that reads crontab files and executes commands. In cloud environments, managed cron services like AWS EventBridge replace the cron daemon but use the same expression syntax.",
    },
  ],

  "cron-parser": [
    {
      question: "How do I read a cron expression?",
      answer:
        "A standard cron expression has five fields: minute (0-59), hour (0-23), day of month (1-31), month (1-12), and day of week (0-6, Sunday is 0). For example, '30 9 * * 1-5' means at 9:30 AM every Monday through Friday. The asterisk means every value, commas separate lists, hyphens define ranges, and slashes set intervals. Paste any cron expression into DevBolt's Cron Parser and it translates it into plain English with the next scheduled run times. The parser handles both 5-field Unix cron and 6-field Quartz/Spring cron with a seconds field.",
    },
    {
      question: "What is the difference between 5-field and 6-field cron expressions?",
      answer:
        "Standard Unix cron uses five fields: minute, hour, day of month, month, and day of week. Some systems add a sixth field for seconds at the beginning: second, minute, hour, day of month, month, day of week. The 6-field format is used by Java-based schedulers like Quartz and Spring. DevBolt's parser auto-detects both formats. If you are using Linux crontab, GitHub Actions, or AWS CloudWatch, use the 5-field format. If working with Quartz Scheduler or Spring Task Scheduling, check your platform's documentation since some use 5-field and others use 6-field with seconds.",
    },
    {
      question: "How do I test what times a cron expression will trigger?",
      answer:
        "Paste your cron expression into DevBolt's Cron Parser and it displays the next scheduled execution times along with a plain-English description. This lets you verify the schedule before deploying. Common mistakes caught by testing include off-by-one errors in hour fields, confusing day-of-week numbering (0 vs 1 for Monday varies by system), and misunderstanding step values (*/5 starts from 0, not from the current time). Always test edge cases like month-end dates, leap years, and timezone boundaries. The parser shows multiple upcoming run times so you can verify the pattern matches your expectations.",
    },
  ],

  "csp-builder": [
    {
      question: "What is a Content Security Policy (CSP) and why do I need one?",
      answer:
        "A Content Security Policy is an HTTP response header that tells browsers which resources (scripts, styles, images, fonts, frames) are allowed to load on your page. CSP prevents cross-site scripting (XSS) attacks by blocking inline scripts and resources from unauthorized domains. Without CSP, an attacker who injects malicious JavaScript can steal user data, session cookies, and credentials. A properly configured CSP reduces XSS risk by 90% or more because even if injection occurs, the browser refuses to execute unauthorized scripts. DevBolt's CSP Builder helps you construct the header visually with directive dropdowns and framework-specific presets.",
    },
    {
      question: "How do I create a Content Security Policy header?",
      answer:
        "Start with a restrictive default-src 'self' directive that only allows resources from your own domain, then add specific directives to allowlist trusted sources. Common directives include script-src for JavaScript, style-src for CSS, img-src for images, font-src for fonts, and connect-src for API endpoints. DevBolt's CSP Builder provides a visual interface where you select directives and add allowed sources without memorizing the syntax. Framework presets auto-configure common requirements like Google Fonts and analytics scripts. Test your policy in report-only mode first using Content-Security-Policy-Report-Only to log violations without blocking resources.",
    },
    {
      question: "What does 'unsafe-inline' mean in CSP and should I avoid it?",
      answer:
        "The 'unsafe-inline' keyword allows inline scripts and styles to execute, which significantly weakens CSP protection against XSS attacks. With unsafe-inline enabled for script-src, any injected inline script can still run, defeating much of CSP's purpose. Avoid it whenever possible. Instead, use nonces that change on every page load, or hashes for specific inline scripts. For styles, unsafe-inline is more commonly needed because many CSS-in-JS libraries inject inline styles. If you must use unsafe-inline for styles, ensure script-src remains strict. DevBolt's builder warns when you select unsafe-inline and suggests nonce-based alternatives.",
    },
  ],

  "css-animation": [
    {
      question: "How do I create a CSS keyframe animation?",
      answer:
        "Define animation steps using the @keyframes rule with percentage values from 0% to 100%, then apply the animation to an element using the animation shorthand property. DevBolt's CSS Animation Generator provides a visual timeline editor where you add keyframes, set properties at each point, and preview the animation in real time. The tool generates both the @keyframes rule and the animation property, which you copy directly into your CSS. Adjust duration, timing function, delay, and iteration count visually. Common animations like fade-in, slide, bounce, and spin are included as presets to get started quickly.",
    },
    {
      question: "What is the difference between CSS transitions and CSS animations?",
      answer:
        "CSS transitions animate between two states when a property changes, typically triggered by user interaction like :hover or :focus. CSS animations use @keyframes to define multi-step sequences that can run automatically on page load, loop indefinitely, and animate through multiple intermediate states. Transitions require a trigger event and only animate between start and end states. Animations offer iteration count, direction (normal, reverse, alternate), fill-mode to persist final state, and play-state to pause mid-animation. Use transitions for interactive feedback like button hovers. Use keyframe animations for loading spinners, entrance effects, and sequences without user interaction.",
    },
    {
      question: "What does animation-fill-mode do in CSS?",
      answer:
        "The animation-fill-mode property controls how styles are applied before the animation starts and after it ends. none (default) applies no styles outside the active animation period. forwards retains the styles from the last keyframe after the animation completes, preventing the element from snapping back. backwards applies the first keyframe styles during any delay period before the animation begins. both combines forwards and backwards behavior. This property is essential for entrance animations: if you animate opacity from 0 to 1, without fill-mode forwards the element reverts to invisible after the animation ends.",
    },
  ],

  "css-to-tailwind": [
    {
      question: "How do I convert CSS to Tailwind utility classes?",
      answer:
        "Paste your CSS declarations into DevBolt's CSS to Tailwind Converter and it maps each property-value pair to the corresponding Tailwind utility class. For example, display: flex becomes flex, margin-top: 1rem becomes mt-4, font-size: 0.875rem becomes text-sm. The converter handles common CSS properties including layout, spacing, typography, colors, borders, shadows, and transforms. Properties that map to Tailwind's default scale are converted to named utilities, while custom values use arbitrary value syntax like mt-[13px]. This accelerates migration from traditional CSS codebases to Tailwind.",
    },
    {
      question: "What CSS properties can be converted to Tailwind classes?",
      answer:
        "Most standard CSS properties have Tailwind equivalents. Layout properties like display, position, flex, and grid convert to utilities like flex, grid, absolute, and relative. Spacing properties (margin, padding) map to the spacing scale (m-4, p-6). Typography properties become text-lg, font-bold, leading-6, text-gray-700. Colors map to Tailwind's color palette when there is a match, or use arbitrary values for custom colors. Box model properties like width, height, border, and border-radius have direct equivalents. Some features like complex selectors and media queries require Tailwind modifiers (hover:, md:, focus:) rather than direct conversion.",
    },
    {
      question: "How do I handle custom CSS values that don't match Tailwind's default scale?",
      answer:
        "Tailwind supports arbitrary values using bracket syntax for any property that does not match the default scale. A margin of 13px becomes mt-[13px], a custom color becomes bg-[#1a2b3c], and a specific width becomes w-[calc(100%-2rem)]. DevBolt's converter automatically detects when a CSS value does not match a default utility and generates the arbitrary value syntax. For values you use frequently, extend Tailwind's theme in tailwind.config.js instead of using arbitrary values throughout your codebase. You can add custom spacing, colors, and font sizes in theme.extend to generate proper named utilities.",
    },
  ],

  "curl-converter": [
    {
      question: "How do I convert a cURL command to JavaScript fetch?",
      answer:
        "Paste your cURL command into DevBolt's converter and select JavaScript as the target language. The tool maps cURL options to fetch API parameters: the URL becomes fetch's first argument, -X maps to the method option, -H headers become entries in the headers object, and -d data becomes the body parameter. Authentication flags like -u are converted to an Authorization header with base64-encoded credentials. The converter handles most common cURL options used in API documentation and generates clean, ready-to-use code.",
    },
    {
      question: "What cURL options are supported in code conversion?",
      answer:
        "DevBolt's converter handles the most common cURL options: -X/--request for HTTP method, -H/--header for custom headers, -d/--data for request body, -u/--user for basic authentication, -b/--cookie for sending cookies, -L/--location for following redirects, -k/--insecure for skipping SSL verification, -F/--form for multipart form data, --data-urlencode for URL-encoded payloads, and -A/--user-agent for the User-Agent header. The converter supports output in multiple languages including JavaScript (fetch and axios), Python (requests), Go, PHP, Ruby, and more.",
    },
    {
      question: "How do I handle authentication when converting cURL to code?",
      answer:
        "The -u flag in cURL maps to language-specific auth mechanisms. For Python requests, it becomes the auth parameter tuple. For JavaScript fetch, it converts to a base64-encoded Authorization header. Bearer token authentication using -H Authorization: Bearer TOKEN converts directly to headers in all languages. DevBolt's converter generates idiomatic code for each target language, using the conventions and popular HTTP libraries of that ecosystem. Always review the generated authentication code to ensure secrets are loaded from environment variables rather than hardcoded in source code.",
    },
  ],

  "date-format-tester": [
    {
      question: "How do I test date format patterns in different programming languages?",
      answer:
        "Enter a date and a format pattern string to see the formatted output instantly. DevBolt's Date Format Tester supports format syntaxes from multiple ecosystems: strftime (Python, Ruby, C, PHP), moment.js/day.js (JavaScript), Go's reference-time format, and Java's DateTimeFormatter patterns. Each system uses different tokens. For example, a four-digit year is %Y in strftime, YYYY in moment.js, 2006 in Go, and yyyy in Java. The tool shows the result for your selected format system in real time and includes a reference table of all tokens.",
    },
    {
      question: "What are the common date format tokens across programming languages?",
      answer:
        "Date format tokens vary significantly between languages. For year: %Y (strftime), YYYY (moment.js), 2006 (Go), yyyy (Java). For month: %m (strftime), MM (moment.js), 01 (Go), MM (Java). For day: %d (strftime), DD (moment.js), 02 (Go), dd (Java). For hours: %H for 24-hour (strftime), HH (moment.js), 15 (Go), HH (Java). Go is unique in using a reference date instead of symbolic tokens. The inconsistency between systems is a common source of bugs, which is why testing format strings before deployment is essential.",
    },
    {
      question: "Why does Go use a reference date instead of format tokens?",
      answer:
        "Go uses the reference time Mon Jan 2 15:04:05 MST 2006 because each component has a unique numeric value: month 1, day 2, hour 15, minute 04, second 05, year 2006, timezone MST. This mnemonic sequence 1-2-3-4-5-6-7 makes it easier to remember than arbitrary tokens. To format a date, you write the reference time in the layout you want. For example, 2006-01-02 produces ISO dates. While unfamiliar to developers from other languages, it avoids ambiguity between similar tokens like mm (minutes) and MM (months) that frequently cause bugs in other format systems.",
    },
  ],

  "docker-compose": [
    {
      question: "How do I validate a Docker Compose file?",
      answer:
        "Paste your Docker Compose YAML into DevBolt's validator and it checks the structure against the Compose specification. The tool identifies syntax errors, invalid service options, incorrect port mapping formats, undefined network or volume references, and type mismatches. Common issues include YAML indentation errors, duplicate service names, invalid environment variable syntax, and referencing undefined volumes or networks. The validator provides specific error messages with line numbers so you can fix issues before running docker compose up. This is faster than waiting for Docker to fail at runtime.",
    },
    {
      question: "What is the difference between Docker Compose v2 and v3 file formats?",
      answer:
        "Version 2.x was designed for single-host deployments with features like mem_limit, cpu_shares, and the extends keyword. Version 3.x was designed for Docker Swarm compatibility, moving resource configuration under the deploy key. As of Docker Compose V2 (the Go rewrite), the version field is optional. The Compose Specification now unifies features from both versions as the canonical reference. For new projects, omit the version field and use the latest Compose Specification features. DevBolt's validator supports both format versions.",
    },
    {
      question: "How do I define health checks and service dependencies in Docker Compose?",
      answer:
        "Use the healthcheck key on a service to define how Docker determines readiness: a test command, interval, timeout, start_period, and retries. Then reference that health status in dependent services using depends_on with condition: service_healthy. The basic depends_on only waits for container start, not service readiness. Health-based dependencies ensure your application does not attempt database connections before PostgreSQL is accepting queries. For production reliability, also implement connection retry logic in your application code.",
    },
  ],

  "dockerfile-validator": [
    {
      question: "How do I validate a Dockerfile for best practices?",
      answer:
        "Paste your Dockerfile into DevBolt's validator and it checks for syntax errors, security issues, and best practice violations. The tool flags problems like running as root without a USER instruction, using the latest tag instead of pinned versions, missing health checks, inefficient layer ordering that breaks Docker cache, and missing .dockerignore recommendations. Each issue includes an explanation and suggested fix. The validator follows Docker's official best practices and Hadolint-style rules. All validation runs client-side in your browser.",
    },
    {
      question: "What are common Dockerfile security issues?",
      answer:
        "Critical Dockerfile security issues include running containers as root (always add a USER instruction with a non-root user), using unverified base images (prefer official images), not pinning base image versions (use specific tags like node:20-alpine instead of node:latest), including secrets in build layers (use multi-stage builds or BuildKit secrets), and installing unnecessary packages that increase the attack surface. Each layer in a Docker image is immutable, so secrets added in early layers persist even if removed in later layers.",
    },
    {
      question: "How do I optimize Dockerfile layer caching?",
      answer:
        "Docker builds images layer by layer, caching each layer and reusing it if the input has not changed. Order your Dockerfile instructions from least to most frequently changing. Copy dependency manifests (package.json, requirements.txt) and install dependencies before copying source code. This way, dependency installation is cached unless the manifest changes. A common Node.js pattern is: COPY package*.json ./ then RUN npm ci, then COPY . ./ as separate steps. Use .dockerignore to exclude node_modules, .git, and build artifacts from the build context.",
    },
  ],

  "encode-decode": [
    {
      question: "What is the difference between Base64, Base32, and Hex encoding?",
      answer:
        "Base64, Base32, and Hex are binary-to-text encoding schemes with different character sets and size overhead. Base64 uses 64 characters encoding 6 bits per character, producing output about 33% larger. Base32 uses 32 characters encoding 5 bits per character, about 60% larger. Hex uses 16 characters encoding 4 bits per character, doubling the size. Base64 is most compact and used for email, data URIs, and API payloads. Base32 is case-insensitive and used for TOTP secrets. Hex is used for hash outputs and color codes. DevBolt supports all formats plus URL and HTML encoding.",
    },
    {
      question: "When should I use URL encoding vs Base64 encoding?",
      answer:
        "URL encoding makes strings safe within URL components by replacing special characters with %XX hex sequences. Use it for query parameter values, path segments, and form data. Base64 converts arbitrary binary data into an ASCII string for embedding in text-based formats like JSON, XML, or email bodies. Use it when transmitting binary content through text-only channels. They are sometimes combined: Base64url encoding (used in JWTs) replaces + with - and / with _ to make Base64 output URL-safe without additional percent encoding.",
    },
    {
      question: "How do I decode text that has been encoded multiple times?",
      answer:
        "Double encoding happens when encoding functions are applied repeatedly by mistake. A space becomes %20 with one URL encoding pass, then %2520 with a second pass. To decode, apply the decoding function the same number of times. DevBolt's Multi-Tool lets you chain decoding operations: decode from one format, inspect the result, then decode again if needed. Common signs of double encoding include %25 sequences in URLs and Base64 output that decodes to another Base64 string. Fix the root cause by ensuring encoding is applied exactly once at the boundary where data transitions between contexts.",
    },
  ],

  "env-validator": [
    {
      question: "How do I validate a .env file for errors?",
      answer:
        "Paste your .env file contents into DevBolt's ENV Validator and it checks for syntax errors, duplicate keys, security concerns, and formatting issues. The tool identifies unquoted values containing spaces, missing equals signs, duplicate variable names, and values with unintended comments. It also flags potential security issues like variables named PASSWORD or SECRET with weak or placeholder values. The validator runs entirely in your browser, so your environment variables including secrets and API keys are never transmitted to any server.",
    },
    {
      question: "What are common mistakes in .env files?",
      answer:
        "Frequent .env mistakes include: forgetting to quote values with spaces, using inline comments incorrectly (some parsers treat # as part of the value), duplicate keys where the last definition silently wins, trailing whitespace becoming part of values, accidentally committing .env to version control, using $VAR expansion when the parser does not support it, and leaving placeholder values in production. Different parsers (dotenv for Node.js, python-dotenv, Docker) have slightly different rules causing values to behave differently across environments.",
    },
    {
      question: "Should I commit .env files to Git?",
      answer:
        "Never commit .env files containing real secrets to Git. Add .env to your .gitignore file. Instead, commit an .env.example with placeholder values documenting which variables are required. For team environments, use secret management tools like Doppler, 1Password, HashiCorp Vault, or your cloud provider's secret manager. For CI/CD, inject environment variables through the pipeline configuration. If secrets were accidentally committed, rotate them immediately since they remain in Git history even after deletion.",
    },
  ],

  "eslint-to-biome": [
    {
      question: "How do I migrate from ESLint to Biome?",
      answer:
        "Paste your ESLint configuration into DevBolt's ESLint to Biome Converter and it generates an equivalent biome.json. The tool maps over 100 ESLint rules to their Biome counterparts, translates rule severity levels, and extracts formatter settings from eslint-config-prettier. Biome is a fast Rust-based linter and formatter that replaces both ESLint and Prettier with a single tool, running 10-100x faster. After generating the Biome config, install Biome with npm install --save-dev @biomejs/biome, add it to your scripts, and remove ESLint and Prettier dependencies.",
    },
    {
      question: "What ESLint rules does Biome support?",
      answer:
        "Biome supports equivalents for most commonly used ESLint core rules and popular plugin rules including eslint:recommended, @typescript-eslint/recommended, eslint-plugin-react, eslint-plugin-react-hooks, eslint-plugin-jsx-a11y, and eslint-plugin-import. Biome organizes rules into categories: correctness, suspicious, style, complexity, performance, and accessibility. Some ESLint rules have no direct Biome equivalent, particularly specialized plugin rules or rules requiring TypeScript type information. DevBolt's converter identifies unmapped rules and lists them separately so you know which need manual review after migration.",
    },
    {
      question: "Why should I switch from ESLint and Prettier to Biome?",
      answer:
        "Biome combines linting and formatting in a single Rust-based tool that runs 10-100x faster than ESLint plus Prettier. This speeds up CI pipelines and editor feedback dramatically. Biome eliminates the configuration complexity of coordinating ESLint and Prettier. It provides consistent formatting without occasional conflicts between ESLint autofixes and Prettier. Biome requires a single biome.json instead of separate configs. The tradeoff is that Biome's rule library is smaller than ESLint's plugin ecosystem, so teams using niche plugins may need to keep ESLint for those specific rules.",
    },
  ],
};

export const toolFaqs: Record<string, FAQ[]> = {
  ...batch1,
  ...toolFaqsBatch2,
  ...toolFaqsBatch3,
  ...toolFaqsBatch4,
  ...toolFaqsBatch5,
};
