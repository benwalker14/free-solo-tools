export interface FAQ {
  question: string;
  answer: string;
}

export const toolFaqs: Record<string, FAQ[]> = {
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
};
