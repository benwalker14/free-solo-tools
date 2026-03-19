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

  "tailwind-to-css": [
    {
      question: "How do I convert Tailwind utility classes to standard CSS?",
      answer:
        "Paste your Tailwind classes into the input field and the tool instantly generates the equivalent CSS properties. You can paste raw classes like 'flex items-center p-4', or a full class=\"...\" or className=\"...\" attribute — the tool strips the attribute syntax automatically. Each Tailwind class maps to one or more CSS declarations. You can customize the selector name (default is .element) to match your project's naming convention.",
    },
    {
      question: "Does the converter handle responsive and state prefixes like sm: and hover:?",
      answer:
        "Yes. Responsive prefixes (sm:, md:, lg:, xl:, 2xl:) and state prefixes (hover:, focus:, active:, dark:, disabled:, etc.) are recognized and stripped during conversion. The base class is converted to CSS normally and the prefix is noted as a comment so you know which classes need media queries or pseudo-selectors in your final CSS. Nested prefixes like sm:hover:bg-white are also handled.",
    },
    {
      question: "What Tailwind classes are supported?",
      answer:
        "The converter supports 500+ Tailwind utility classes covering: display, position, visibility, flexbox, grid, spacing (padding, margin, gap), sizing (width, height, min/max), typography (font size, weight, family, line height, letter spacing, text align/decoration/transform), borders (width, style, radius), effects (opacity, shadow), transforms (scale, rotate, translate, skew), transitions, filters (blur, grayscale), colors (black, white, transparent, current, arbitrary hex/rgb), and arbitrary bracket values like w-[300px] or bg-[#1a2b3c].",
    },
    {
      question: "How are unrecognized classes handled?",
      answer:
        "Classes that cannot be mapped to standard CSS — such as Tailwind color palette classes (bg-red-500, text-blue-300), plugin utilities, or custom classes — are listed separately as 'unrecognized'. This lets you see exactly which classes need manual conversion or a Tailwind config lookup. The tool converts everything it can and clearly flags the rest.",
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

  "favicon-generator": [
    {
      question: "How do I generate a favicon from text or emoji?",
      answer:
        "Type a letter, number, or paste an emoji into the input field and the tool renders it as a favicon in multiple sizes instantly. DevBolt's Favicon Generator draws the character onto an HTML canvas, applies your chosen background color and font styling, then exports the result as downloadable PNG files in standard favicon dimensions (16x16, 32x32, 48x48, 180x180, 192x192, 512x512). You also get an ICO file for legacy browser support and the HTML link tags to paste into your page head. The entire process runs in your browser.",
    },
    {
      question: "What favicon sizes and formats does a modern website need?",
      answer:
        "A modern website needs: a 32x32 favicon.ico for legacy browsers, a 180x180 PNG apple-touch-icon for iOS home screens, 192x192 and 512x512 PNGs in a web app manifest for Android and PWAs, and optionally an SVG favicon for crisp scaling on any display. SVG favicons support dark mode through embedded CSS media queries. Include the correct link tags in your HTML head: rel icon for the main favicon, rel apple-touch-icon for iOS, and a manifest.json entry. Placing favicon.ico at the domain root is recommended since browsers check that path automatically.",
    },
    {
      question: "Can I use an emoji as a favicon for my website?",
      answer:
        "Yes, emoji favicons are popular for developer tools, personal sites, and documentation portals because they are instantly recognizable and require no design work. DevBolt renders the emoji onto a canvas at each required size and exports crisp PNG files. Keep in mind that emoji rendering varies slightly between platforms. Choose universally recognizable emoji and test on multiple devices. For maximum compatibility, export as PNG rather than relying on SVG text elements, since emoji font support in SVGs can be inconsistent across browsers.",
    },
  ],

  "file-hash": [
    {
      question: "How do I verify a file's checksum using a hash?",
      answer:
        "Drag and drop your file into DevBolt's File Hash Calculator and it generates MD5, SHA-1, SHA-256, SHA-384, and SHA-512 hashes instantly. To verify integrity, compare the generated hash against the checksum provided by the source. The tool includes a verify mode where you paste the expected hash and it highlights whether the comparison passes or fails. All hashing runs client-side using the Web Crypto API, so your files never leave your device. This workflow is essential for verifying software downloads, firmware images, and ISO files.",
    },
    {
      question: "What is the difference between MD5, SHA-1, and SHA-256 for file hashing?",
      answer:
        "MD5 produces a 128-bit (32-character hex) hash and is fast but cryptographically broken. SHA-1 produces a 160-bit (40-character) hash and is also insecure after demonstrated collision attacks in 2017. SHA-256 produces a 256-bit (64-character) hash and remains cryptographically secure, making it the standard choice for file integrity verification. For simple corruption detection where deliberate tampering is not a concern, MD5 is sufficient and faster. For anything involving security or trust verification, use SHA-256 or SHA-512.",
    },
    {
      question: "Is it safe to hash sensitive files in a browser-based tool?",
      answer:
        "Yes, when the tool processes files entirely client-side. DevBolt's File Hash Calculator reads your file using the browser's FileReader API and computes hashes locally with the Web Crypto API. No file data is uploaded to any server. You can verify this by monitoring the Network tab during hashing. The file contents exist only in your browser's memory and are released when you close the page. This makes it safe for hashing confidential documents, proprietary builds, and any files containing sensitive data.",
    },
  ],

  "flexbox-generator": [
    {
      question: "How do I center an element vertically and horizontally with Flexbox?",
      answer:
        "Apply display: flex to the parent container, then set justify-content: center and align-items: center. This centers child elements both horizontally and vertically. If you need full-viewport centering, add height: 100vh to the parent. This is the most reliable centering technique in modern CSS, replacing older hacks involving position absolute with transforms or table-cell display. DevBolt's Flexbox Generator lets you toggle these properties visually and see the layout update in real time, then copy the generated CSS directly.",
    },
    {
      question: "What is the difference between flex-wrap and flex-shrink?",
      answer:
        "flex-wrap controls whether flex items are forced onto a single line or allowed to wrap onto multiple lines. The default nowrap keeps all items on one line. Setting flex-wrap: wrap allows items to flow to the next row when they exceed container width. flex-shrink controls how much an individual item shrinks relative to others when the container is too small. The default value of 1 means items shrink equally. Setting flex-shrink: 0 prevents an item from shrinking. Use flex-wrap for responsive layouts and flex-shrink to control which items compress first.",
    },
    {
      question: "When should I use Flexbox instead of CSS Grid?",
      answer:
        "Use Flexbox for one-dimensional layouts where content flows in a single row or column. Flexbox excels at navigation bars, button groups, card rows, and form input layouts. Use CSS Grid when you need two-dimensional control over both rows and columns simultaneously, such as full-page layouts, dashboards, or image galleries. A practical rule: if your layout is a line of items, use Flexbox. If it is a grid of cells, use Grid. Many real-world layouts combine both. DevBolt offers visual builders for both approaches.",
    },
  ],

  "git-command-builder": [
    {
      question: "What are the most commonly used git commands?",
      answer:
        "The essential git commands are: git status to check working tree state, git add to stage changes, git commit to save snapshots, git push to upload to remote, git pull to fetch and merge, git branch to manage branches, git checkout or git switch to change branches, git merge to combine branches, git log to view history, and git diff to compare changes. Beyond these, git stash temporarily shelves changes, git rebase rewrites history, and git cherry-pick applies specific commits. DevBolt's Git Command Builder covers 22 commands with interactive option selection.",
    },
    {
      question: "How do I undo the last git commit without losing changes?",
      answer:
        "Use git reset --soft HEAD~1 to undo the last commit while keeping all changes staged. Use git reset --mixed HEAD~1 to also unstage the changes. If you have already pushed the commit to a remote branch, use git revert HEAD instead, which creates a new commit that undoes the changes without rewriting history. Never use git reset on pushed shared-branch commits, as it rewrites history and causes conflicts for other contributors. DevBolt's Git Command Builder helps you select the right reset mode.",
    },
    {
      question: "What is the difference between git merge and git rebase?",
      answer:
        "git merge combines two branches by creating a new merge commit that has both branches as parents, preserving the complete branching history. git rebase moves your branch's commits to the tip of another branch, rewriting history to create a linear sequence. Merge is safer for shared branches because it does not alter existing commits. Rebase produces cleaner, linear history. The common workflow is to rebase your feature branch onto main before merging. Never rebase commits that have been pushed to shared branches, as this rewrites history others depend on.",
    },
  ],

  "git-diff-viewer": [
    {
      question: "How do I read git diff output?",
      answer:
        "Git diff output shows changes using unified diff format. Lines starting with --- indicate the original file and +++ the modified file. @@ markers show line number ranges. Lines prefixed with - (red) were removed, + (green) were added, and no prefix are unchanged context. DevBolt's Git Diff Viewer parses this raw output and renders it with syntax highlighting. You can toggle between inline mode (changes shown sequentially) and side-by-side mode (old and new versions in parallel columns) for easier comparison.",
    },
    {
      question: "What is the difference between inline and side-by-side diff views?",
      answer:
        "Inline diff shows changes sequentially in a single column — removed lines in red followed by added lines in green. This is compact and matches the standard unified diff format. Side-by-side view displays the old version on the left and new version on the right with corresponding lines aligned. Side-by-side is easier for reviewing modifications to individual lines. Inline is better for insertions, deletions, and narrow viewports. Most code review tools like GitHub default to side-by-side but let you toggle.",
    },
    {
      question: "How do I generate a git diff to paste into the viewer?",
      answer:
        "Run git diff for unstaged changes, git diff --staged for staged changes, or git diff HEAD~1 to compare against the previous commit. To compare branches, use git diff main..feature-branch. Copy the output from your terminal or redirect it to a file with git diff > changes.patch. Paste the raw unified diff output into DevBolt's viewer to see it rendered with syntax highlighting and color-coded changes, which is much easier to read than raw terminal output.",
    },
  ],

  "gitignore-generator": [
    {
      question: "What files should a .gitignore include for a Node.js project?",
      answer:
        "A Node.js .gitignore should exclude node_modules/ (dependencies), dist/ or build/ (compiled output), .env and .env.local (secrets), coverage/ (test reports), *.log files, .DS_Store and Thumbs.db (OS files), and .cache/ directories. Keep package-lock.json committed for reproducible installs. For TypeScript, also exclude *.tsbuildinfo. DevBolt's .gitignore Generator provides curated templates for Node.js, TypeScript, React, Next.js, and other frameworks with a single click.",
    },
    {
      question: "How does .gitignore pattern matching work?",
      answer:
        "Gitignore uses glob-style patterns. A bare pattern like *.log matches files anywhere in the repo. A leading slash /build/ anchors to the root. A trailing slash logs/ matches only directories. The wildcard * matches anything except path separators, while ** matches across directories. Negation with ! re-includes a previously excluded pattern. Patterns are evaluated top to bottom with later rules overriding earlier ones. Understanding these rules prevents common mistakes like ignoring files you intended to keep.",
    },
    {
      question: "Why does .gitignore not work for already-committed files?",
      answer:
        "Gitignore only affects untracked files — it has no effect on files already tracked by Git. If you committed a file before adding it to .gitignore, Git continues tracking it. To fix this, remove the file from tracking without deleting it from disk using git rm --cached filename. Then commit this removal. The .gitignore rule will now prevent re-adding. DevBolt generates .gitignore files upfront so you can add rules before your first commit.",
    },
  ],

  "gradient-generator": [
    {
      question: "How do I create a CSS linear gradient with a specific angle?",
      answer:
        "Set the gradient type to linear and adjust the angle. The angle controls the direction: 0deg flows bottom to top, 90deg left to right, 180deg top to bottom, 270deg right to left. You can also use keyword directions like to right or to bottom left. The generated CSS uses syntax like background: linear-gradient(135deg, #color1 0%, #color2 100%). DevBolt's Gradient Generator updates the preview in real time as you adjust angle, colors, and stop positions.",
    },
    {
      question: "How do I create a radial CSS gradient?",
      answer:
        "Switch to radial gradient mode and configure the shape (circle or ellipse), size, and center position. A radial gradient transitions colors outward from a center point. You can control the origin using percentage positions and size keywords like closest-side or farthest-corner. Radial gradients work well for spotlight effects, glowing buttons, circular backgrounds, and vignette overlays. Add multiple color stops for more complex transitions.",
    },
    {
      question: "Can I use CSS gradients as backgrounds for text?",
      answer:
        "Yes, apply gradients to text using background-clip and text-fill-color. Set the gradient as the element's background, then add -webkit-background-clip: text and background-clip: text to clip it to the text shape. Set -webkit-text-fill-color: transparent and color: transparent to make the text invisible so the gradient shows through. This technique works in all modern browsers and creates eye-catching gradient text effects for headings and hero sections. Include both -webkit- prefixed and unprefixed versions.",
    },
  ],

  "graphql-to-typescript": [
    {
      question: "How do I convert a GraphQL schema to TypeScript types?",
      answer:
        "Paste your GraphQL SDL into DevBolt's converter and it generates corresponding TypeScript interfaces and types. Object types become interfaces, scalar types map to TypeScript equivalents (String to string, Int/Float to number, Boolean to boolean, ID to string), enums become TypeScript enums or unions, and nullable fields are typed with null unions. The converter handles nested types, arrays, and non-null fields. The output is ready to use in your TypeScript codebase for type-safe API consumption.",
    },
    {
      question: "How does the converter handle GraphQL unions and interfaces?",
      answer:
        "GraphQL union types become TypeScript discriminated union types using the | operator. GraphQL interfaces become TypeScript interfaces that implementing types extend. The __typename field is included as a string literal type on each union member, enabling TypeScript's discriminated union pattern for exhaustive switch statements. This preserves the GraphQL type system's relationships in TypeScript's type system accurately.",
    },
    {
      question: "What is the difference between GraphQL code generation and manual TypeScript types?",
      answer:
        "Code generation automatically derives TypeScript types from your GraphQL schema, ensuring types always match the API contract. Manual typing requires maintaining interfaces by hand, risking drift when the schema changes. Generated types update instantly while manual types need human intervention. Code generation also handles complex nested structures and circular references that are error-prone to type manually. For production projects, tools like GraphQL Code Generator run during builds. For quick conversions, DevBolt provides instant browser-based results.",
    },
  ],

  "grid-generator": [
    {
      question: "How do I create a responsive CSS Grid layout without media queries?",
      answer:
        "Use repeat() with auto-fill or auto-fit and minmax(). The pattern grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)) creates columns that are at least 250px wide, automatically wrapping on smaller screens. auto-fill creates invisible empty tracks when extra space exists, while auto-fit collapses empty tracks so items stretch to fill the row. This single line of CSS replaces multiple media query breakpoints. DevBolt's Grid Generator lets you configure this visually.",
    },
    {
      question: "What does the fr unit mean in CSS Grid?",
      answer:
        "The fr (fraction) unit represents a share of the remaining available space after fixed-size tracks and gaps are calculated. Unlike percentages, which are based on total container width and do not account for gaps, fr units distribute only leftover space. This prevents content overflow issues that percentages can cause when combined with gaps. The fr unit is the preferred unit for flexible grid tracks in virtually all use cases.",
    },
    {
      question: "How do I make grid items span multiple rows or columns?",
      answer:
        "Use grid-column and grid-row properties on child elements. The syntax grid-column: 1 / 3 spans two columns. The shorthand grid-column: span 2 achieves the same result. Combine both: grid-column: span 2; grid-row: span 2 creates a 2x2 block. Named grid areas offer another approach using grid-template-areas with string patterns on the container and grid-area on children. DevBolt's Grid Generator supports both methods with a visual interface.",
    },
  ],

  "html-markdown": [
    {
      question: "How do I convert HTML to clean Markdown?",
      answer:
        "Paste your HTML into the input panel and DevBolt converts it to Markdown instantly. The converter maps HTML tags to Markdown equivalents: h1-h6 become # through ######, strong becomes **, em becomes *, links become [text](url), images become ![alt](src), and lists convert to bullet or numbered syntax. Tables become pipe-delimited Markdown tables. Code blocks become fenced blocks with triple backticks. Elements without Markdown equivalents are stripped, preserving only text content. All processing runs client-side.",
    },
    {
      question: "Can I convert Markdown back to HTML?",
      answer:
        "Yes, DevBolt's converter works bidirectionally. It processes all standard Markdown syntax including GitHub Flavored Markdown extensions like task lists, strikethrough, fenced code blocks with language identifiers, and pipe-delimited tables. The generated HTML uses semantic tags. This is useful for content management systems that store Markdown but serve HTML, email templates from Markdown drafts, and static site generators where you preview rendered output.",
    },
    {
      question: "What HTML elements have no Markdown equivalent?",
      answer:
        "Several HTML elements cannot be represented in standard Markdown: layout elements (div, section, article), form elements (input, select, textarea), media elements beyond images (video, audio, canvas, iframe), interactive elements (details, summary, dialog), and styling elements (span with classes). When converting, these elements are typically stripped with text content preserved, or passed through as raw HTML since most Markdown renderers allow inline HTML.",
    },
  ],

  "html-to-jsx": [
    {
      question: "How do I convert HTML to JSX for React?",
      answer:
        "Paste your HTML into DevBolt's converter and it transforms the markup into valid JSX. The converter handles all required attribute transformations: class becomes className, for becomes htmlFor, tabindex becomes tabIndex, and event handlers convert to camelCase. Inline style strings are converted to JavaScript objects with camelCase property names. Self-closing tags receive the required closing slash. The output is ready to paste directly into a React component.",
    },
    {
      question: "What are the key differences between HTML and JSX syntax?",
      answer:
        "JSX uses camelCase attributes instead of lowercase: className instead of class, htmlFor instead of for, onClick instead of onclick. The style attribute takes a JavaScript object instead of a CSS string. All tags must be explicitly closed, including void elements like br and img. JSX uses curly braces for JavaScript expressions. Comments use {/* */} instead of HTML comments. Adjacent elements must be wrapped in a parent element or Fragment.",
    },
    {
      question: "Does the converter handle inline styles and SVG attributes?",
      answer:
        "Yes. Inline CSS style strings are parsed and converted to JavaScript object syntax with camelCase property names. SVG attributes follow JSX conventions: stroke-width becomes strokeWidth, fill-opacity becomes fillOpacity. SVG-specific attributes like viewBox already use camelCase and remain unchanged. The converter processes all standard HTML and SVG attributes, ensuring the JSX output renders identically to the original HTML in a React application.",
    },
  ],

  "http-status-codes": [
    {
      question: "What is the difference between 301 and 302 HTTP redirects?",
      answer:
        "HTTP 301 Moved Permanently indicates the resource has been permanently relocated. Search engines transfer link equity to the new URL and update their index. Browsers cache 301 redirects aggressively. HTTP 302 Found indicates a temporary redirect. Search engines keep the original URL indexed. Use 301 for domain migrations and permanently moved pages. Use 302 for maintenance pages, A/B testing, and geo-based redirects. Using the wrong type negatively impacts SEO rankings.",
    },
    {
      question: "When should I return 404 vs 410 HTTP status codes?",
      answer:
        "HTTP 404 Not Found means the resource does not exist but may appear in the future. Search engines retry periodically. HTTP 410 Gone means the resource was intentionally and permanently removed. Search engines remove 410 pages from their index faster. Use 404 for mistyped URLs and broken links. Use 410 for discontinued products and deleted blog posts. For SEO cleanup, 410 more effectively tells search engines to stop crawling specific URLs.",
    },
    {
      question: "What does HTTP 429 Too Many Requests mean?",
      answer:
        "HTTP 429 means the client has been rate-limited. The response typically includes a Retry-After header. As a consumer, implement exponential backoff: wait the specified period, then retry with increasing delays. As a provider, return 429 with clear Retry-After headers and document your rate limits. Always respect 429 responses rather than retrying immediately, as aggressive retrying can lead to longer bans or IP blocking.",
    },
  ],

  "image-base64": [
    {
      question: "How do I embed a Base64 image in HTML or CSS?",
      answer:
        "For HTML, use the data URI as the src attribute: <img src=\"data:image/png;base64,...\">. For CSS, use it as background-image: url('data:image/png;base64,...'). DevBolt's Image to Base64 Converter generates the complete data URI string ready to copy. This eliminates an HTTP request, improving performance for small assets. The encoding runs entirely in your browser, so images stay private.",
    },
    {
      question: "What is the maximum recommended size for Base64 images?",
      answer:
        "Keep Base64-encoded images under 10KB original file size. Base64 increases data size by approximately 33%, so a 10KB image becomes roughly 13.3KB of text. Larger Base64 images increase page weight, block rendering, cannot be cached independently, and inflate your CSS or HTML file size. For images over 10KB, serving them as separate files with proper cache headers is more efficient. Base64 is best for tiny icons, simple UI graphics, and tracking pixels.",
    },
    {
      question: "Which image format should I convert to Base64?",
      answer:
        "Choose the smallest format for your image type. PNG works best for simple graphics, icons, and images with transparency. SVG is even better for vector graphics since it is already text-based. JPEG works for tiny photographic thumbnails. WebP offers the best compression for both photographic and graphic content. Avoid Base64-encoding GIF animations as they are typically large. Before encoding, optimize the source image to minimize the Base64 string length.",
    },
  ],

  "image-compressor": [
    {
      question: "What quality setting should I use for web image compression?",
      answer:
        "For JPEG and WebP images, a quality of 80-85% provides the best balance between file size and visual quality. At 80%, files are typically 50-70% smaller with differences virtually imperceptible. Below 70%, artifacts become noticeable. For hero images use 85-90%. For thumbnails, 60-75% is acceptable. PNG compression is lossless with no quality slider. DevBolt's compressor shows a side-by-side preview so you can fine-tune the setting.",
    },
    {
      question: "Should I use WebP instead of JPEG or PNG?",
      answer:
        "WebP is the recommended format for most web images in 2026 with over 97% browser support. WebP lossy produces files 25-35% smaller than equivalent JPEG, and WebP lossless is 26% smaller than PNG. WebP also supports transparency and animation in a single format. Use WebP as the primary format with JPEG or PNG fallbacks via the HTML picture element. The only drawbacks are slightly slower encoding and limited support in some email clients.",
    },
    {
      question: "How does client-side image compression work in the browser?",
      answer:
        "Browser-based compression uses the HTML Canvas API. The image is loaded onto a canvas, optionally resized, then exported using canvas.toBlob() with a specified format and quality parameter. Some tools use Web Workers to run compression in a background thread without blocking the UI. This entire pipeline runs locally — no images are uploaded to any server, making client-side compression both fast and private.",
    },
  ],

  "js-playground": [
    {
      question: "Can I run TypeScript in a browser-based JavaScript playground?",
      answer:
        "Yes, DevBolt's JavaScript Playground supports TypeScript by transpiling it to JavaScript before execution. Type annotations, interfaces, enums, generics, and other TypeScript features are processed and stripped during transpilation. Type errors are reported in the output panel. This is useful for testing TypeScript snippets, experimenting with type patterns, and prototyping without setting up a local project. The playground captures console.log output and handles async/await.",
    },
    {
      question: "Is code executed in a browser playground safe and sandboxed?",
      answer:
        "Browser-based playgrounds run code in a sandboxed environment preventing access to the file system, other tabs, and system resources. DevBolt's playground runs code in an isolated context where console methods are intercepted to display output. Avoid running untrusted code as it could still make network requests or consume CPU. The playground includes execution timeout protection to prevent runaway scripts from freezing your browser tab.",
    },
    {
      question: "What is the difference between running JavaScript in a playground vs Node.js?",
      answer:
        "A browser playground provides Web APIs (DOM, fetch, localStorage, Canvas) while Node.js provides server-side APIs (fs, http, path, child_process). Module systems differ: browsers use ES modules natively while Node.js supports both CommonJS and ES modules. Browser playgrounds cannot access the file system or spawn processes. Both environments share the same ECMAScript core. For testing pure logic and algorithms, a browser playground works perfectly. For file I/O and server code, you need Node.js.",
    },
  ],

  "json-diff": [
    {
      question: "How does JSON diff differ from a regular text diff?",
      answer:
        "A JSON diff compares the semantic structure and values of two documents, while a text diff compares raw lines. JSON diff understands that objects with reordered keys are identical. It reports differences as specific operations on key paths: added, removed, or changed at $.path.to.field. It handles nested objects and arrays intelligently, showing exactly which property changed rather than marking entire blocks as different.",
    },
    {
      question: "How does the tool handle array comparisons?",
      answer:
        "Array comparison uses index-based matching — element [0] in the first document is compared to element [0] in the second. This works well for ordered arrays where position matters. DevBolt's JSON Diff provides clear output showing which array elements were added, removed, or modified at each index. For complex comparisons, consider structuring your data so arrays contain objects with ID fields for easier tracking of additions and removals.",
    },
    {
      question: "Can I compare minified JSON with formatted JSON?",
      answer:
        "Yes, JSON diff compares parsed data structures, not raw text. A minified single-line string and a beautifully formatted version produce identical parse trees, so the diff correctly shows zero differences. This is a key advantage over text-based diffing, which would flag every line as changed. Only actual data differences — changed values, added keys, or removed keys — appear in the results.",
    },
  ],

  "json-mock-generator": [
    {
      question: "How do I generate realistic fake JSON data for API testing?",
      answer:
        "Define your schema using DevBolt's Mock Data Generator, selecting from over 30 field types including names, emails, addresses, phone numbers, UUIDs, dates, URLs, and IP addresses. Specify how many records to generate and the tool produces a JSON array instantly. The generated data follows real-world patterns. This is ideal for populating development databases, testing API endpoints, creating demo data, and load testing. All generation happens client-side.",
    },
    {
      question: "What field types are available for mock data generation?",
      answer:
        "DevBolt supports over 30 field types: person fields (name, email, phone, username), address fields (street, city, state, zip, country, lat/long), internet fields (URL, IP, MAC, domain, user agent), commerce fields (product name, price, company), date/time fields (past, future, recent, ISO timestamps), identifiers (UUID, auto-increment), and primitives (integer, float, boolean, lorem ipsum text). You can nest objects and create arrays of any field type.",
    },
    {
      question: "Can I generate mock data that matches my existing API schema?",
      answer:
        "Yes, configure field names and types to match your API's response structure. Create nested objects and arrays that mirror your real data model. The output is a valid JSON array usable as mock API responses, imported into development databases, or served from a local mock server for frontend development without waiting for the real backend.",
    },
  ],

  "json-path": [
    {
      question: "What is JSONPath and how do I use it?",
      answer:
        "JSONPath is a query language for extracting values from JSON documents, similar to XPath for XML. The root element is $, dot notation traverses objects ($.store.book), brackets access arrays ($[0]), wildcards select all children ($.store.*), and recursive descent (..) searches all levels. Filter expressions like $..book[?(@.price<10)] select elements matching conditions. DevBolt's JSONPath Tester lets you paste JSON, write expressions, and see results highlighted in real time.",
    },
    {
      question: "What is the difference between dot notation and bracket notation in JSONPath?",
      answer:
        "Dot notation uses periods to traverse: $.store.book.title. It is concise but only works with valid JavaScript identifiers. Bracket notation uses quoted strings: $['store']['book']['title']. It supports any property name including spaces and special characters. Bracket notation is required for array index access ($[0]) and filter expressions. Most developers use dot notation for simple paths and brackets when property names require it.",
    },
    {
      question: "How do I filter JSON arrays using JSONPath?",
      answer:
        "Filter expressions use [?(@.condition)] syntax. The @ symbol refers to the current element. Operators include comparison (==, !=, <, >), existence checks (@.property), and logical operators (&& for AND, || for OR). Examples: $..book[?(@.price<10)] selects cheap books, $..product[?(@.inStock && @.price<50)] selects affordable in-stock products. Test expressions in DevBolt's tester to verify matches before using them in production code.",
    },
  ],

  "json-schema": [
    {
      question: "What is JSON Schema and why use it for API validation?",
      answer:
        "JSON Schema is a declarative vocabulary for defining the structure, types, and constraints of JSON data. It specifies required fields, data types, string patterns, numeric ranges, array constraints, enum values, and nested structures. JSON Schema catches invalid request payloads before your business logic runs, generating precise error messages. It also serves as machine-readable API documentation. Most API frameworks support JSON Schema validation natively or through middleware. DevBolt's validator lets you test schemas against sample data instantly.",
    },
    {
      question: "How do I define optional vs required fields in JSON Schema?",
      answer:
        "All properties are optional by default. Required fields are listed in the required array at the object level. Define properties with types and constraints, then add required field names to the required array. A field present with null satisfies required unless you restrict the type to exclude null. For nested objects, each level has its own independent required array.",
    },
    {
      question: "What is the difference between JSON Schema Draft-07 and Draft 2020-12?",
      answer:
        "Draft 2020-12 added $dynamicRef for extensible recursive schemas, prefixItems for clearer tuple validation, $vocabulary for feature declarations, and unevaluatedProperties for better additional content control. Despite improvements, Draft-07 remains the most widely supported version. For new projects, Draft 2020-12 offers better expressiveness, but verify your validator library supports it before adopting.",
    },
  ],

  "json-to-code": [
    {
      question: "How do I generate typed code from JSON in Go, Python, or Rust?",
      answer:
        "Paste JSON into DevBolt's converter and select your target language. The tool generates: Go structs with json tags, Python dataclasses, Java classes with getters/setters, C# classes with JsonProperty attributes, Dart classes with fromJson/toJson, Rust structs with serde derives, Swift Codable structs, and Kotlin data classes. Nested objects create separate named types. Arrays infer element types. Null values generate nullable types. The output includes serialization boilerplate for each language's ecosystem.",
    },
    {
      question: "How does the converter handle nested objects and mixed-type arrays?",
      answer:
        "Nested objects are extracted into separate named types based on the parent property name. Mixed-type arrays are handled per language: Go uses any, Python uses Union or Any, Rust uses serde_json::Value, Java uses Object, and TypeScript uses a union type. Arrays of objects with inconsistent keys generate types with optional fields covering all possible properties.",
    },
    {
      question: "Which programming languages are supported?",
      answer:
        "DevBolt supports 8 languages: Go (structs with json tags), Python (dataclasses), Java (POJO with Jackson), C# (System.Text.Json attributes), Dart (fromJson factory constructors), Rust (serde Serialize/Deserialize), Swift (Codable structs), and Kotlin (data classes with kotlinx.serialization). Each output follows idiomatic conventions including proper naming (camelCase for Java, snake_case for Python/Rust, PascalCase for C#/Go).",
    },
  ],

  "json-to-csv": [
    {
      question: "How do I convert a JSON array to a CSV file?",
      answer:
        "Paste your JSON array of objects and the converter extracts all unique keys as column headers, mapping each object's values to corresponding columns. Missing values become empty cells. The output can be downloaded as a .csv file that opens in Excel, Google Sheets, or Numbers. The conversion runs entirely in your browser for privacy. This is ideal for exporting API responses, database results, and log data into spreadsheet formats.",
    },
    {
      question: "How does the converter handle nested JSON objects?",
      answer:
        "Nested objects are flattened using dot notation for column names. A record like {user: {name: 'Alice', address: {city: 'NYC'}}} produces columns user.name and user.address.city. Arrays within records can be joined into a single cell with a delimiter. DevBolt uses dot-notation flattening by default to produce a single row per JSON object with readable column names.",
    },
    {
      question: "What encoding issues should I watch for in JSON to CSV conversion?",
      answer:
        "Fields containing commas must be wrapped in double quotes per RFC 4180. Fields with double quotes need those quotes escaped by doubling them. Fields with newlines must be quoted. Unicode characters require UTF-8 encoding, and you may need a BOM prefix for Excel to detect UTF-8 correctly. Numeric strings like zip codes may lose leading zeros in spreadsheet applications.",
    },
  ],

  "json-to-graphql": [
    {
      question: "How do I generate a GraphQL schema from JSON data?",
      answer:
        "Paste your JSON data into DevBolt's converter and it automatically infers GraphQL type definitions from the structure. Object keys become fields, nested objects become separate GraphQL types, and arrays infer element types. The tool generates complete SDL output including type definitions, Query type with get-by-ID and list operations, and optional Mutation type with create/update/delete operations. Custom scalars like DateTime and Date are detected from ISO string patterns. All generation runs in your browser.",
    },
    {
      question: "What GraphQL types are inferred from JSON values?",
      answer:
        "String values become String, integers become Int, floating-point numbers become Float, booleans become Boolean, and fields named id or containing UUID patterns become ID. ISO date strings become DateTime or Date custom scalars. Nested objects become separate named GraphQL types. Arrays of primitives become lists like [String]. Arrays of objects are merged to capture all possible fields. Null values make the field nullable by omitting the ! non-null modifier.",
    },
    {
      question: "How does the converter handle nested objects and arrays?",
      answer:
        "Nested objects are extracted into separate named GraphQL types based on the parent field name. For example, a user field containing an address object generates both a User type and an Address type with the user field typed as Address. Arrays of objects merge all array elements to build a complete field set, handling cases where different objects have different keys. Deeply nested structures produce a type hierarchy that mirrors the JSON structure faithfully.",
    },
  ],

  "json-to-sql": [
    {
      question: "How do I convert JSON to SQL INSERT statements?",
      answer:
        "Paste a JSON array of objects and DevBolt generates SQL CREATE TABLE and INSERT statements automatically. The tool infers column types from values: strings become VARCHAR or TEXT, integers become INTEGER or BIGINT, floats become DOUBLE PRECISION or REAL, booleans become BOOLEAN, dates become TIMESTAMP, and UUIDs become UUID (PostgreSQL) or CHAR(36). You can choose between PostgreSQL, MySQL, and SQLite dialects. Options include batch INSERT, DROP TABLE IF EXISTS, and nullable columns. Download the generated .sql file or copy it directly.",
    },
    {
      question: "What SQL dialects are supported?",
      answer:
        "DevBolt supports PostgreSQL (JSONB, UUID, TIMESTAMP, DOUBLE PRECISION, dollar-quoting), MySQL (backtick quoting, JSON type, DATETIME, AUTO_INCREMENT), and SQLite (INTEGER/REAL/TEXT type affinities, boolean as 0/1). Each dialect uses its native syntax for quoting identifiers, data types, and auto-increment columns. The tool generates dialect-specific SQL that runs without modification on the target database.",
    },
    {
      question: "How are JSON data types mapped to SQL column types?",
      answer:
        "The converter maps types based on value analysis: strings become VARCHAR or TEXT, integers become INTEGER (or BIGINT for large values), floating-point numbers become DOUBLE PRECISION or REAL, booleans become BOOLEAN (or INTEGER 0/1 for SQLite), ISO date strings become TIMESTAMP or DATETIME, UUID strings become UUID (PostgreSQL) or CHAR(36), and nested objects become JSON or JSONB columns. Null values make columns nullable. The type mapping adapts per dialect to use native types.",
    },
  ],

  "json-to-zod": [
    {
      question: "How do I convert JSON to a Zod validation schema?",
      answer:
        "Paste JSON data or a JSON Schema document into DevBolt's converter. For JSON data, the tool infers Zod types from values: strings become z.string(), numbers become z.number(), booleans become z.boolean(), arrays become z.array(), and nested objects become z.object(). Common string formats like emails, URLs, and UUIDs are detected and add appropriate Zod refinements. For JSON Schema input, constraints like minLength, pattern, minimum, and enum map directly to Zod validation methods for precise conversion.",
    },
    {
      question: "What is the difference between converting JSON data vs JSON Schema to Zod?",
      answer:
        "Converting from JSON data infers types from actual values, which is quick but may miss constraints. A string 'hello' becomes z.string() but you would not know it should be an email. Converting from JSON Schema provides precise types with all constraints: format, pattern, minLength, maxLength, minimum, maximum, required fields, and enum values all map to specific Zod methods. Use JSON data conversion for rapid prototyping and JSON Schema conversion for production-grade validation schemas.",
    },
    {
      question: "How does the converter handle nullable and optional fields?",
      answer:
        "Null values in JSON data produce z.nullable() types. Fields present in some array objects but missing in others become .optional(). In JSON Schema, nullable: true maps to .nullable() and fields not listed in the required array become .optional(). You can enable both behaviors simultaneously for fields that can be null, undefined, or present. Toggle options control whether to add .optional(), .strict(), coerce mode, .describe(), and .default() to the generated schema.",
    },
  ],

  "json-visualizer": [
    {
      question: "How do I visualize JSON data as an interactive tree?",
      answer:
        "Paste your JSON into DevBolt's JSON Visualizer and it renders an interactive tree with collapsible and expandable nodes. Each object and array becomes a node you can click to expand or collapse. Values are color-coded by type: strings, numbers, booleans, and nulls each have distinct colors. The tree auto-expands the first two levels on parse. Use the depth controls (L2, L3, L5, All) to expand to a specific level. Hover over any node to see and copy its JSON path.",
    },
    {
      question: "What is the difference between a JSON tree viewer and a JSON formatter?",
      answer:
        "A JSON formatter outputs indented text with syntax highlighting — the result is still a text document you read linearly. A tree viewer like DevBolt's JSON Visualizer creates an interactive hierarchical display where you can collapse and expand sections, search for specific keys or values, copy individual paths, and navigate large documents without scrolling through thousands of lines. Tree viewers are better for exploring large, deeply nested JSON structures like API responses and configuration files.",
    },
    {
      question: "How do I search and navigate large JSON documents?",
      answer:
        "Use the search bar (Ctrl+F) to find keys or values within the tree. Matching nodes are highlighted and the tree automatically expands to reveal matches. Use depth controls to collapse everything to a manageable level, then expand only the sections you need. Hover over any node to see its full JSON path (e.g., $.data.users[0].name), which you can copy for use in code or JSONPath queries. Statistics show total keys, depth, and type counts for quick document overview.",
    },
  ],

  "jwt-builder": [
    {
      question: "How do I create and sign a JWT token?",
      answer:
        "Select an algorithm (HS256, RS256, ES256, or others), configure the header and payload claims using the visual editor, and provide a signing key. DevBolt's JWT Builder supports 10 algorithms: HMAC (HS256/384/512), RSA (RS256/384/512), ECDSA (ES256/384/512), and unsigned (none). For HMAC, enter a shared secret. For RSA and ECDSA, generate a key pair directly in the browser or paste your own. Standard claims like iss, sub, aud, exp, iat, nbf, and jti have dedicated fields with auto-populate. All signing runs client-side via the panva/jose library.",
    },
    {
      question: "What is the difference between HS256 and RS256 for JWT signing?",
      answer:
        "HS256 uses a single shared secret for both signing and verification — simpler but requires distributing the secret to every verifying service. RS256 uses asymmetric cryptography: a private key signs and a public key verifies. RS256 is preferred for distributed systems because only the auth server needs the private key while any service can verify using the public key. HS256 is faster and suitable for single-service applications. Most auth providers default to RS256.",
    },
    {
      question: "What standard claims should I include in a JWT?",
      answer:
        "Essential claims include: iss (issuer — who created the token), sub (subject — the user or entity), aud (audience — intended recipient service), exp (expiration — Unix timestamp when the token expires), iat (issued at — creation time), and jti (JWT ID — unique identifier to prevent replay attacks). Optional claims include nbf (not before — earliest valid time). Always set exp to limit token lifetime. DevBolt auto-populates iat with the current time and generates UUID values for jti.",
    },
  ],

  "k8s-validator": [
    {
      question: "How do I validate a Kubernetes YAML manifest online?",
      answer:
        "Paste your Kubernetes YAML into the input panel and the validator instantly checks for syntax errors, missing required fields, and best practice violations. It supports over 20 resource types including Deployment, Service, ConfigMap, Secret, Ingress, StatefulSet, DaemonSet, Job, CronJob, and PersistentVolumeClaim. The validator checks apiVersion, kind, metadata, spec structure, label selectors, container image formats, and port definitions. Results are categorized by severity. Everything runs client-side so your manifests stay private.",
    },
    {
      question: "What are the most common Kubernetes YAML errors?",
      answer:
        "Frequent errors include indentation mistakes (YAML uses spaces not tabs), mismatched label selectors between Deployments and Services, missing required fields like apiVersion or metadata.name, incorrect apiVersion for a resource type, invalid container port numbers, and duplicate keys. Security issues include running containers as root, missing securityContext, and not setting readOnlyRootFilesystem. The validator flags all of these with line numbers and fix suggestions.",
    },
    {
      question: "How do I check Kubernetes best practices in my manifests?",
      answer:
        "DevBolt's validator checks manifests against production best practices beyond basic syntax. It verifies resource requests and limits for CPU and memory, checks for readiness and liveness probes essential for rolling deployments, flags containers running as root or in privileged mode, validates that image tags avoid latest for reproducibility, and checks Pod disruption budgets for high availability. These checks catch deployment issues before they reach your cluster.",
    },
  ],

  "lorem-ipsum": [
    {
      question: "What is Lorem Ipsum and why do developers use it?",
      answer:
        "Lorem Ipsum is placeholder text derived from a scrambled passage of Cicero's De Finibus Bonorum et Malorum (45 BC). Developers and designers use it to fill layouts with realistic-looking text during development, before final content is written. It has a natural distribution of letter frequencies and word lengths that approximates real English prose, making it more realistic than repeated phrases. Using placeholder text lets teams evaluate typography, spacing, and layout without waiting for actual content.",
    },
    {
      question: "How do I generate placeholder text for mockups?",
      answer:
        "Select the output type (paragraphs, sentences, or words), specify the quantity, and DevBolt generates Lorem Ipsum text instantly. Paragraph mode produces blocks of text suitable for article layouts and card descriptions. Sentence mode gives individual sentences for shorter UI elements. Word mode outputs a specific word count for precise content fitting. Copy the generated text with one click and paste it into your design mockup, HTML template, or development prototype.",
    },
    {
      question: "What are alternatives to Lorem Ipsum for placeholder text?",
      answer:
        "Alternatives include Hipster Ipsum (trendy vocabulary), Bacon Ipsum (meat-themed), Cupcake Ipsum (dessert-themed), and Pirate Ipsum (pirate speak). For professional contexts, real content samples from your domain are often better because they test realistic word lengths and formatting patterns. Some designers use Blind Text Generator which produces text in multiple languages. The key consideration is that placeholder text should approximate the length and structure of final content to catch layout issues early.",
    },
  ],

  "markdown-preview": [
    {
      question: "How do I preview Markdown rendering in real time?",
      answer:
        "Type or paste Markdown in the editor panel and DevBolt shows the rendered HTML output instantly in the preview panel. Changes update in real time as you type, providing immediate visual feedback. The preview supports all standard Markdown elements plus GitHub Flavored Markdown extensions including fenced code blocks, task lists, tables, strikethrough, and autolinks. This is useful for writing README files, documentation, blog posts, and any content that will be rendered as Markdown.",
    },
    {
      question: "What Markdown syntax is supported in the preview?",
      answer:
        "DevBolt's preview supports headings (# through ######), bold (**text**), italic (*text*), links ([text](url)), images (![alt](src)), unordered and ordered lists, blockquotes, inline code, fenced code blocks with language identifiers, horizontal rules, tables with alignment, task lists (- [x] done), strikethrough (~~text~~), and HTML passthrough. This covers GitHub Flavored Markdown which is the most common Markdown variant used in developer documentation.",
    },
    {
      question: "How do I add code blocks with syntax highlighting in Markdown?",
      answer:
        "Use fenced code blocks with triple backticks and a language identifier. Start with ``` followed by the language name (js, python, go, rust, etc.) on the same line, write your code, then close with ```. The preview renders syntax-highlighted code blocks. Inline code uses single backticks for short snippets within text. For code that itself contains backticks, use double backticks as delimiters. Fenced blocks preserve whitespace and formatting exactly as written.",
    },
  ],

  "markdown-table": [
    {
      question: "How do I create a Markdown table?",
      answer:
        "Use DevBolt's visual table builder to add rows and columns, enter cell values, and generate properly formatted Markdown table syntax. Markdown tables use pipes (|) to separate columns and hyphens (-) for the header separator row. The header row is required and defines column names. Data rows follow below. The tool handles alignment of pipes and proper spacing so the raw Markdown is readable in source form. Copy the generated table directly into your README, documentation, or blog post.",
    },
    {
      question: "How do I align columns in a Markdown table?",
      answer:
        "Column alignment is controlled by colons in the separator row: left-aligned (:---), right-aligned (---:), or center-aligned (:---:). Default alignment (no colons or left colon only) is left-aligned. Right alignment is useful for numeric columns like prices or counts. Center alignment works well for status indicators and short labels. DevBolt's table builder provides alignment toggles for each column so you do not need to remember the colon syntax.",
    },
    {
      question: "What are the limitations of Markdown tables?",
      answer:
        "Markdown tables do not support cell merging (colspan/rowspan), nested tables, multi-line cell content, or complex formatting within cells. Cells are limited to inline formatting like bold, italic, code, and links. For complex tables with merged cells or rich content, use HTML table markup instead, which most Markdown renderers pass through directly. Markdown tables also require a header row — you cannot have a headerless data-only table in standard Markdown syntax.",
    },
  ],

  "mcp-config-builder": [
    {
      question: "What is MCP and what is mcp.json?",
      answer:
        "MCP (Model Context Protocol) is an open standard that lets AI assistants like Claude connect to external tools and data sources. The mcp.json configuration file defines which MCP servers an AI client should connect to, their transport settings, and environment variables. Different clients use different config file paths: Claude Desktop uses claude_desktop_config.json, Cursor uses .cursor/mcp.json, and VS Code uses settings.json. DevBolt's MCP Config Builder generates the correct format for your chosen client.",
    },
    {
      question: "How do I configure MCP servers for Claude Desktop?",
      answer:
        "Select Claude Desktop as your target client, then add MCP servers from the template library or configure custom ones. Each server needs a command (like npx or node), arguments (the server package name and options), and optionally environment variables for API keys. DevBolt provides 16 pre-configured server templates for popular services. The generated configuration goes into your Claude Desktop config file. The builder handles the correct JSON structure for each client format.",
    },
    {
      question: "What MCP server templates are available?",
      answer:
        "DevBolt includes 16 MCP server templates covering popular integrations: filesystem access, GitHub, PostgreSQL, SQLite, Brave Search, Google Maps, Slack, memory/knowledge graph, Puppeteer for web automation, and more. Each template includes the correct command, arguments, and required environment variable placeholders. You can customize any template and add multiple servers to a single configuration. The builder supports 5 client formats: Claude Desktop, Cursor, VS Code, Windsurf, and Claude Code.",
    },
  ],

  "meta-tag-generator": [
    {
      question: "What meta tags should every web page include for SEO?",
      answer:
        "Every page should include: title (50-60 characters), meta description (150-160 characters summarizing content), viewport meta for mobile responsiveness, charset declaration (UTF-8), and canonical URL to prevent duplicate content issues. For social sharing, add Open Graph tags (og:title, og:description, og:image, og:url) and Twitter Card tags (twitter:card, twitter:title, twitter:description, twitter:image). DevBolt's generator creates all of these from a simple form and outputs ready-to-paste HTML.",
    },
    {
      question: "How do I generate Open Graph meta tags for social sharing?",
      answer:
        "Fill in the title, description, image URL, and page URL fields. DevBolt generates the complete set of Open Graph meta tags: og:title, og:description, og:image, og:url, og:type, og:site_name, and the corresponding Twitter Card tags. The image should be at least 1200x630 pixels for optimal display on Facebook and LinkedIn. Test your tags using DevBolt's OG Preview tool to see how your page will appear when shared on social media platforms.",
    },
    {
      question: "What is the difference between meta description and og:description?",
      answer:
        "The meta description appears in search engine results pages (SERPs) below the page title. It should be 150-160 characters and optimized for click-through rate from search results. The og:description appears when the page is shared on social media platforms like Facebook, LinkedIn, and Twitter. It can be different from the meta description to suit the social context. If og:description is not set, social platforms often fall back to the meta description. Setting both allows you to optimize for each context separately.",
    },
  ],

  "nginx-config": [
    {
      question: "How do I generate an Nginx configuration file?",
      answer:
        "Select a preset template (Static Site, Reverse Proxy, SPA, Load Balancer, or PHP) and customize settings using the visual builder. Configure server name, listen port, root directory, SSL paths, proxy upstream addresses, and additional directives. The generator produces a complete nginx.conf server block. For reverse proxy setups, it includes proxy_pass, proxy_set_header, WebSocket support, and timeouts. For static sites, it adds gzip compression, cache headers, and try_files. Download or copy the configuration directly. All generation happens in your browser.",
    },
    {
      question: "How do I configure Nginx as a reverse proxy?",
      answer:
        "The essential directives are: listen 80 or 443 for SSL, server_name to match the domain, and a location block with proxy_pass pointing to the backend like http://localhost:3000. Important headers include proxy_set_header Host $host, X-Real-IP, X-Forwarded-For, and X-Forwarded-Proto. For WebSocket support, add proxy_http_version 1.1, proxy_set_header Upgrade $http_upgrade, and Connection upgrade. DevBolt's generator includes all these settings in the reverse proxy preset.",
    },
    {
      question: "How do I enable SSL/TLS in Nginx?",
      answer:
        "Add an SSL server block on port 443 with ssl_certificate and ssl_certificate_key directives pointing to your cert files. Set ssl_protocols to TLSv1.2 and TLSv1.3 only, use strong ciphers, and add HSTS. Create a separate port 80 block that redirects HTTP to HTTPS. Use Let's Encrypt with Certbot for free automated SSL certificates. DevBolt's generator produces all SSL settings correctly configured and ready for deployment.",
    },
  ],

  "number-base-converter": [
    {
      question: "How do I convert between decimal, binary, octal, and hexadecimal?",
      answer:
        "Enter a number in any base and DevBolt instantly shows the equivalent value in all four bases: decimal (base 10), binary (base 2), octal (base 8), and hexadecimal (base 16). The tool handles both integers and large numbers. This is essential for low-level programming, bitwise operations, memory address analysis, and understanding how computers store data. Each base serves different purposes: decimal for human-readable values, binary for bit manipulation, hex for memory addresses and color codes, and octal for Unix file permissions.",
    },
    {
      question: "Why do programmers use hexadecimal instead of binary?",
      answer:
        "Hexadecimal is a compact representation of binary data. Each hex digit represents exactly 4 binary bits, so a byte (8 bits) is always exactly 2 hex digits. Binary 11111111 becomes hex FF — much easier to read and type. Memory addresses, color codes, MAC addresses, and hash values use hex because it maintains a direct relationship to the underlying binary while being human-readable. Decimal does not map cleanly to binary boundaries, making it harder to reason about bit patterns.",
    },
    {
      question: "How do I convert a negative number to binary?",
      answer:
        "Negative integers in computers use two's complement representation. To convert -N to binary: write the positive N in binary, flip all bits (ones' complement), then add 1. For example, -5 in 8-bit binary: 5 is 00000101, flipped is 11111010, plus 1 is 11111011. The most significant bit indicates the sign: 0 for positive, 1 for negative. Two's complement is used by virtually all modern processors because it allows the same addition circuitry to handle both positive and negative numbers.",
    },
  ],

  "og-preview": [
    {
      question: "How do I preview my Open Graph tags before sharing?",
      answer:
        "Enter your page URL or paste the HTML head section into DevBolt's OG Preview tool. It extracts all Open Graph and Twitter Card meta tags and shows how your page will appear when shared on Facebook, Twitter, LinkedIn, and other platforms. The preview displays the title, description, image, and URL exactly as social media crawlers will render them. This lets you catch issues like truncated titles, missing images, or incorrect descriptions before sharing publicly.",
    },
    {
      question: "Why does my shared link show the wrong image on social media?",
      answer:
        "Common causes include: the og:image URL is relative instead of absolute (must start with https://), the image is too small (minimum 200x200 for most platforms, recommended 1200x630), the image URL returns a 404 or redirect that the crawler cannot follow, the server blocks social media crawlers via robots.txt, or the platform has cached an old version of your tags. Use DevBolt's OG Preview to verify your tags, then use Facebook's Sharing Debugger or Twitter's Card Validator to clear their cache and re-scrape your page.",
    },
    {
      question: "What are the recommended Open Graph image dimensions?",
      answer:
        "The recommended og:image size is 1200x630 pixels (1.91:1 aspect ratio) for optimal display across all major social platforms. Facebook recommends at least 600x315 pixels. Twitter summary_large_image cards use the same 1.91:1 ratio. LinkedIn displays images at a similar aspect ratio. For Twitter summary cards (smaller thumbnails), use 144x144 to 4096x4096 square images. Always include the og:image:width and og:image:height tags to help platforms render images without downloading them first. Keep file size under 5MB.",
    },
  ],

  "openapi-to-typescript": [
    {
      question: "How do I generate TypeScript types from an OpenAPI specification?",
      answer:
        "Paste your OpenAPI 3.x or Swagger 2.0 specification in JSON or YAML format into DevBolt's converter. It parses all schema definitions, path parameters, request bodies, and response types, generating corresponding TypeScript interfaces. Each schema component becomes a named interface. Nested objects create referenced types. Enum values become TypeScript union types or enums. The output is ready to use in your frontend or API client code for type-safe HTTP requests. Everything runs client-side.",
    },
    {
      question: "What parts of an OpenAPI spec are converted to TypeScript?",
      answer:
        "The converter generates types from: component schemas (the main data models), path operation parameters (query, path, header), request body schemas, response body schemas for each status code, enum definitions, and allOf/oneOf/anyOf compositions. allOf produces intersection types, oneOf/anyOf produce union types. Nullable fields become optional or null union types. Required fields are non-optional in the generated interfaces. The $ref references are resolved to produce clean, self-contained type definitions.",
    },
    {
      question: "How are OpenAPI request and response schemas mapped to TypeScript?",
      answer:
        "Request body schemas become input interfaces with the request content type's schema properties. Response schemas are generated per status code, so a 200 response and a 400 error response produce different types. Path parameters become function argument types. Query parameters produce an options interface with optional fields for non-required params. Common patterns like pagination, error responses, and list/detail endpoints generate reusable generic types. The converter preserves descriptions as JSDoc comments when enabled.",
    },
  ],

  "openapi-validator": [
    {
      question: "How do I validate an OpenAPI specification?",
      answer:
        "Paste your OpenAPI 3.x or Swagger 2.0 spec in JSON or YAML format. The validator parses it and checks against the official specification, reporting structural errors, missing required fields, invalid references, and schema issues. It verifies paths, operations, parameters, request bodies, responses, and security definitions. Broken $ref references are flagged immediately. Results include the exact path of each issue. All validation runs client-side in your browser.",
    },
    {
      question: "What is the difference between OpenAPI 3.0 and Swagger 2.0?",
      answer:
        "Swagger 2.0 uses swagger: 2.0, puts schemas under definitions, and uses in-body parameters. OpenAPI 3.0 uses openapi: 3.0.x, moves schemas to components/schemas, introduces a dedicated requestBody object, and adds support for multiple server URLs replacing host/basePath/schemes. OpenAPI 3.0 also adds content/mediaType patterns, callbacks, links, and cookie parameters. The validator auto-detects the version and applies appropriate rules.",
    },
    {
      question: "What common OpenAPI errors does the validator catch?",
      answer:
        "The validator catches missing required fields (info, paths, openapi version), invalid path parameter syntax, path parameters declared but not defined, $ref pointers to non-existent schemas, type errors, invalid HTTP methods, and missing response descriptions. Best practice violations include missing operationId, unused schema definitions, and security schemes referenced but not defined. For Swagger 2.0, it also validates consumes/produces media types.",
    },
  ],

  "package-json-generator": [
    {
      question: "How do I create a package.json for a new Node.js project?",
      answer:
        "Select a framework preset (Next.js, React+Vite, Node.js CLI, npm Library, Express API, or Monorepo Root) to start with recommended defaults, then customize fields using the visual editor. Configure name, version, description, author, license, scripts, dependencies, and module settings. DevBolt generates a complete package.json that updates in real time. The output includes proper exports configuration, engine requirements, and all fields formatted correctly. Download the file or copy it directly.",
    },
    {
      question: "What is the difference between dependencies and devDependencies?",
      answer:
        "dependencies are packages required at runtime when your application runs in production — frameworks like React or Express, utility libraries, and database drivers. devDependencies are packages needed only during development — build tools like webpack or Vite, test frameworks like Jest, linters like ESLint, and TypeScript itself. When users install your npm package, only dependencies are installed. devDependencies are skipped. For applications (not libraries), the distinction matters less but helps document which packages serve which purpose.",
    },
    {
      question: "Should I use ESM or CommonJS for my Node.js package?",
      answer:
        "Use ESM (type: module) for new projects. ESM is the JavaScript standard module system with import/export syntax, supports top-level await, enables better tree-shaking, and is the direction Node.js is moving. CommonJS (type: commonjs or no type field) uses require/module.exports and is the legacy default. For libraries published to npm, consider dual publishing with both ESM and CJS using the exports field in package.json to support all consumers. DevBolt's generator handles the exports configuration for both formats.",
    },
  ],

  "placeholder-image": [
    {
      question: "How do I generate a placeholder image for my website?",
      answer:
        "Set width and height in pixels, choose background and text colors, optionally enter custom overlay text, and select the output format (PNG, JPEG, WebP, or SVG). The image generates instantly in your browser. Download the file or copy the data URI to embed directly in HTML. Placeholder images are used during development to reserve layout space before final assets are ready. DevBolt generates everything client-side with no external service dependency.",
    },
    {
      question: "What format should I use for placeholder images?",
      answer:
        "PNG is the most versatile and works everywhere. SVG produces the smallest file and scales perfectly, ideal for responsive layouts. JPEG works best for simulating photograph placeholders. WebP offers smaller sizes than PNG with broad browser support. For wireframes, PNG or SVG are preferred for crisp rendering. For load testing, match the format and approximate size of your production images.",
    },
    {
      question: "How are these different from services like placehold.co?",
      answer:
        "External services generate images via URL parameters requiring internet and depending on third-party availability. DevBolt creates images entirely in your browser using the Canvas API with no external dependencies. Generated images work offline as downloaded files or data URIs. The advantage of external services is inline URL usage without downloading. The advantage of local generation is no network dependency, faster development loading, and no privacy concerns with request logging.",
    },
  ],

  "privacy-policy": [
    {
      question: "How do I generate a privacy policy for my website?",
      answer:
        "Fill in your organization details, select which data you collect (personal info, cookies, analytics, payment data), choose applicable regulations (GDPR, CCPA, COPPA), and configure data retention and third-party service disclosures. DevBolt generates a comprehensive privacy policy document covering all required sections. The generator covers data collection, usage purposes, sharing practices, user rights, cookie policies, and contact information. Download as formatted text or copy the Markdown output.",
    },
    {
      question: "What is the difference between GDPR and CCPA compliance?",
      answer:
        "GDPR (EU) requires explicit consent before collecting personal data, gives users rights to access, correct, delete, and port their data, requires a Data Protection Officer for large-scale processing, mandates 72-hour breach notification, and applies to any business processing EU resident data regardless of location. CCPA (California) gives consumers the right to know what data is collected, opt out of data sales, request deletion, and receive equal service regardless of privacy choices. CCPA applies to businesses exceeding revenue or data volume thresholds. Both require clear privacy policy disclosures.",
    },
    {
      question: "Do I need a privacy policy if my site does not collect personal data?",
      answer:
        "Yes, you likely still need one. If you use any analytics (including privacy-friendly ones like Plausible), advertising, embedded content (YouTube, Twitter), web fonts (Google Fonts), or CDNs, data is being collected or transmitted to third parties. Even server access logs contain IP addresses, which are personal data under GDPR. A privacy policy builds user trust, satisfies app store requirements, and protects you legally. DevBolt's generator helps create appropriate policies even for minimal-data sites.",
    },
  ],

  "prompt-builder": [
    {
      question: "How do I write effective prompts for AI coding assistants?",
      answer:
        "Structure your prompts with clear context, specific instructions, and expected output format. DevBolt's Prompt Builder provides 8 developer-focused templates covering code review, unit test generation, API documentation, data analysis, commit messages, SQL queries, refactoring, and code explanation. Each template uses reusable {{variables}} for customization. Effective prompts include the programming language, framework context, input/output examples, and constraints. The builder generates prompts in multiple API formats ready for use.",
    },
    {
      question: "What is the difference between system prompts and user prompts?",
      answer:
        "System prompts set the AI assistant's behavior, role, and constraints for the entire conversation. They define what the model should do and how it should respond. User prompts are the individual messages or questions within that context. System prompts persist across turns while user prompts change with each request. For API usage, the system message is sent once and user messages are sent per request. DevBolt's builder generates both components with proper formatting for each provider's API format.",
    },
    {
      question: "How do I format prompts for different AI APIs?",
      answer:
        "Each AI provider uses a different message format. OpenAI uses {role: 'system'/'user', content: '...'} in a messages array. Anthropic uses a system parameter plus {role: 'user'/'assistant', content: '...'} messages. Google Gemini uses {role: 'user'/'model', parts: [{text: '...'}]}. DevBolt's builder generates the correct JSON structure for each provider, including proper role labels, content formatting, and API-specific fields, so you can copy the output directly into your API calls.",
    },
  ],

  "readme-generator": [
    {
      question: "How do I create a professional README for my GitHub project?",
      answer:
        "Fill in project details using the form: name, description, installation commands, usage examples, and contribution guidelines. Select which sections to include such as badges, table of contents, screenshots, license, and acknowledgments. DevBolt generates a well-structured README.md with proper Markdown formatting and heading hierarchy. A live preview shows exactly how it will render on GitHub. Download the file or copy the Markdown directly. No account required.",
    },
    {
      question: "What sections should a good README include?",
      answer:
        "A comprehensive README should include: project title with brief description, badges for build status and version, longer description of purpose, installation instructions with copy-pasteable commands, usage examples with code blocks, configuration options, API reference for libraries, contributing guide, license section, and acknowledgments. For larger projects, add a table of contents, screenshots, roadmap, and documentation links. Prioritize installation and usage since most visitors need those first.",
    },
    {
      question: "How do I add badges to my GitHub README?",
      answer:
        "Badges use Markdown image syntax: ![label](url). The most popular service is shields.io which generates badges for npm version, build status, license, downloads, and code coverage. CI services like GitHub Actions provide their own badge URLs. DevBolt's README Generator includes a badge builder that generates the correct Markdown for popular badge types without manually constructing shield.io URLs.",
    },
  ],

  "regex-generator": [
    {
      question: "How do I generate a regex pattern from a text description?",
      answer:
        "Describe what you want to match in plain English and the tool suggests a corresponding regular expression. DevBolt's Regex Generator includes 60+ curated patterns for common use cases like email validation, phone numbers, IP addresses, dates, URLs, and postal codes. Select a category to browse pre-built patterns or use the visual composer to build custom expressions by combining character classes, quantifiers, groups, and anchors. Each generated pattern includes a human-readable explanation of what it matches. The tool uses JavaScript regex syntax compatible with Node.js and browsers.",
    },
    {
      question: "What are the most commonly used regex patterns for developers?",
      answer:
        "The most frequently needed patterns include email validation, URL matching, IPv4 addresses, ISO dates, phone numbers with optional country codes, hex color codes, and semantic version strings. DevBolt's library organizes these into categories so you can find and customize them quickly rather than writing patterns from scratch. Each pattern includes edge case notes and test examples.",
    },
    {
      question: "How do I convert a regex from one programming language to another?",
      answer:
        "Most regex syntax is shared across languages, but key differences exist. JavaScript uses /pattern/flags, Python uses raw strings with re.compile(), and Go uses backtick strings with regexp.MustCompile(). Lookbehind support varies between engines. Named groups use (?P<name>) in Python but (?<name>) in JavaScript. DevBolt generates JavaScript-compatible patterns by default. When porting, verify flag equivalents and escape character differences in your target language's string handling.",
    },
  ],

  "robots-generator": [
    {
      question: "How do I create a robots.txt file for my website?",
      answer:
        "Select which bots to allow or block, specify directory rules, and add your sitemap URL. DevBolt generates a properly formatted file ready to upload to your site's root directory. The syntax uses User-agent to specify crawlers, Disallow to block paths, Allow to override blocks for sub-paths, and Sitemap to point to your XML sitemap. Common configurations include blocking admin pages, API endpoints, and staging content while allowing all public content to be indexed.",
    },
    {
      question: "Should I block AI crawlers in robots.txt?",
      answer:
        "It depends on your content strategy. AI training crawlers like GPTBot (OpenAI), Google-Extended (Gemini training), CCBot (Common Crawl), and ClaudeBot (Anthropic) can be blocked individually. Blocking prevents your content from being used in AI training while keeping regular search indexing by Googlebot and Bingbot. Many publishers block AI crawlers to protect original content. DevBolt's generator includes presets for common AI crawler configurations.",
    },
    {
      question: "Does robots.txt block pages from appearing in Google search results?",
      answer:
        "No, robots.txt only prevents crawling, not indexing. Google can still list a URL if other sites link to it, showing the URL without a snippet. To truly prevent search appearance, use a noindex meta tag or X-Robots-Tag HTTP header. Ironically, robots.txt Disallow prevents Googlebot from seeing the noindex tag, so blocked pages cannot be de-indexed. For pages you want hidden from search, use noindex and allow crawling.",
    },
  ],

  "security-headers": [
    {
      question: "What HTTP security headers should every website have?",
      answer:
        "Every website should set: Content-Security-Policy (CSP) to control allowed resources and prevent XSS, Strict-Transport-Security (HSTS) to force HTTPS, X-Content-Type-Options: nosniff to prevent MIME sniffing, X-Frame-Options: DENY or SAMEORIGIN to prevent clickjacking, Referrer-Policy to control URL information sent to other sites, and Permissions-Policy to disable unused browser features. These add defense-in-depth layers that protect users even if application code has vulnerabilities. DevBolt generates correctly formatted configurations for your platform.",
    },
    {
      question: "How do I configure Content-Security-Policy headers?",
      answer:
        "CSP whitelists allowed content sources per resource type. Start with default-src 'self' allowing only your domain. Add script-src for JavaScript, style-src for CSS, img-src for images, connect-src for APIs, and font-src for fonts. Use report-uri or report-to to receive violation reports during rollout. DevBolt builds the policy from your selected directives and outputs server-specific configuration for Nginx, Apache, Vercel, Netlify, or Cloudflare.",
    },
    {
      question: "What is the difference between security header configs for Nginx, Apache, and Vercel?",
      answer:
        "Nginx uses add_header directives in server blocks. Apache uses Header set directives in .htaccess requiring mod_headers. Vercel uses a headers array in vercel.json. Cloudflare uses Transform Rules or a _headers file. The actual header names and values are identical — only the configuration syntax differs. DevBolt outputs the exact format for your chosen platform so you can copy it directly.",
    },
  ],

  "slug-generator": [
    {
      question: "What is a URL slug and why does it matter for SEO?",
      answer:
        "A URL slug is the human-readable portion of a URL identifying a specific page, like 'how-to-use-git' in example.com/blog/how-to-use-git. Slugs matter for SEO because search engines use them to understand page content. A descriptive slug with relevant keywords helps rankings. Best practices: use lowercase, separate words with hyphens, keep it to 3-5 words, remove stop words, and avoid special characters. Clean slugs also improve link sharing and user trust.",
    },
    {
      question: "How do I handle Unicode and special characters in URL slugs?",
      answer:
        "Unicode characters are typically transliterated to ASCII equivalents. Accented characters like e-acute become 'e', German umlauts like u-umlaut become 'ue'. CJK characters can use romanization systems. DevBolt handles transliteration automatically for common character sets. ASCII-only slugs ensure maximum compatibility across all systems, email clients, and social media platforms where URLs might be shared or truncated.",
    },
    {
      question: "Should I use hyphens or underscores in URL slugs?",
      answer:
        "Use hyphens (-). Google treats hyphens as word separators, so 'web-development' is indexed as two separate words. Underscores are treated as joiners, so 'web_development' is indexed as one compound word, reducing search relevance. This distinction was confirmed by Google and remains the standard recommendation. Most CMS platforms and URL slug libraries default to hyphens for this reason.",
    },
  ],

  "sql-to-typescript": [
    {
      question: "How do I convert SQL CREATE TABLE to TypeScript interfaces?",
      answer:
        "Paste SQL CREATE TABLE statements into the converter. It parses column names, data types, nullability, and defaults to generate TypeScript interfaces. SQL types map to TypeScript: VARCHAR/TEXT become string, INTEGER/BIGINT become number, BOOLEAN becomes boolean, TIMESTAMP/DATE become Date or string, and NUMERIC/DECIMAL become number or string for precision. NOT NULL columns are required, nullable columns get optional or null union types. DevBolt generates one interface per table with proper PascalCase naming.",
    },
    {
      question: "What is the difference between Prisma schema and Drizzle ORM output?",
      answer:
        "Prisma uses its own declarative schema language with models, field types, and attributes like @id, @default, @unique. It generates a type-safe client with findMany, create, and update methods. Drizzle uses plain TypeScript with functions like pgTable, varchar, integer, exporting table objects. Drizzle supports raw SQL more naturally. The converter outputs either Prisma's .prisma format or Drizzle's TypeScript definitions with your chosen database dialect. Foreign keys are preserved in both formats.",
    },
    {
      question: "How are SQL foreign keys converted to TypeScript or ORM schemas?",
      answer:
        "For TypeScript interfaces, foreign key columns become number or string properties with JSDoc comments noting the relationship. For Prisma, relationships become @relation attributes connecting the foreign key to the referenced model. For Drizzle, relationships use the relations() helper with one() and many() definitions. Primary keys, unique constraints, and indexes are preserved as corresponding decorators or method calls.",
    },
  ],

  "subnet-calculator": [
    {
      question: "How do I calculate the number of usable hosts in a subnet?",
      answer:
        "The formula is 2^(32-prefix) - 2, subtracting the network address and broadcast address. A /24 has 2^8 - 2 = 254 usable hosts. A /30 has 2 usable hosts, ideal for point-to-point links. A /31 is a special case (RFC 3021) with 2 usable addresses and no broadcast. DevBolt's subnet calculator shows host count, network address, broadcast address, and usable range instantly for any CIDR input.",
    },
    {
      question: "What is CIDR notation and how does it relate to subnet masks?",
      answer:
        "CIDR notation expresses an IP and subnet mask as 192.168.1.0/24. The number after the slash indicates how many bits are the network portion. /24 = 255.255.255.0, /16 = 255.255.0.0, /8 = 255.0.0.0. CIDR replaced classful addressing (Class A/B/C) for more flexible allocation and smaller routing tables. DevBolt converts between CIDR and dotted-decimal mask notation.",
    },
    {
      question: "What is VLSM and when should I use it?",
      answer:
        "VLSM (Variable Length Subnet Masking) divides a network into subnets of different sizes, each with a different prefix. Unlike fixed-length subnetting, VLSM matches subnet sizes to actual host requirements: a department with 100 hosts gets /25 while a point-to-point link gets /30. Sort requirements largest-first, allocate the largest subnet first, then subdivide remaining space. DevBolt's VLSM divider automates this calculation from a list of host count requirements.",
    },
  ],

  "svg-optimizer": [
    {
      question: "How does SVG optimization reduce file size?",
      answer:
        "SVG optimization removes unnecessary metadata, comments, editor-specific data, hidden elements, and redundant attributes. Design tools embed extra information browsers do not need. The optimizer also rounds numeric precision, merges paths, removes empty groups, and collapses transforms. These operations typically reduce size by 20-60% without visual change. DevBolt processes everything client-side so SVGs containing proprietary designs are never uploaded.",
    },
    {
      question: "Will optimizing my SVG change how it renders?",
      answer:
        "No, properly optimized SVGs render identically. The optimizer only removes data that does not affect visual output: editor metadata, unused namespaces, comments, and hidden elements. Numeric precision is reduced to a level below the visible threshold. DevBolt shows a before-and-after preview so you can visually verify the output matches the original before downloading.",
    },
    {
      question: "What causes SVG files from design tools to be unnecessarily large?",
      answer:
        "Design tools add proprietary metadata, generator comments, excessive decimal precision in coordinates, inline styles that could be shorter as attributes, unoptimized path data, embedded fonts or base64 raster images, unused gradient definitions, and empty group elements from deleted layers. Complex illustrations may contain hidden layers or elements outside the viewBox. DevBolt's optimizer addresses all of these in a single pass.",
    },
  ],

  "svg-to-jsx": [
    {
      question: "How do I convert SVG to JSX for React components?",
      answer:
        "Paste SVG markup and the converter transforms it into valid JSX: class becomes className, hyphenated attributes become camelCase (stroke-width to strokeWidth, fill-opacity to fillOpacity), inline styles become JavaScript objects, and xmlns is removed. DevBolt optionally wraps output in a named React component with forwardRef support, React.memo for performance, and TypeScript SVGProps typing.",
    },
    {
      question: "What attributes change when converting SVG to JSX?",
      answer:
        "SVG attributes like stroke-width, fill-rule, clip-path, and class become strokeWidth, fillRule, clipPath, and className in JSX. The style attribute changes from a CSS string to a JavaScript object. Event handlers become camelCase. The xmlns namespace is removed. Data attributes remain unchanged. These differences cause React warnings or rendering failures if you paste raw SVG into JSX without conversion. DevBolt handles all transformations automatically.",
    },
    {
      question: "How do I create a reusable React icon component from SVG?",
      answer:
        "Enable component output and the converter generates a named function component accepting standard SVG props like width, height, fill, and className. Enable forwardRef for ref access and memo for render optimization. The component spreads incoming props onto the root SVG element. For icon libraries, set fill to currentColor so icons inherit parent text color via CSS, working with Tailwind classes like text-blue-500.",
    },
  ],

  "tailwind-generator": [
    {
      question: "How do I build responsive layouts with Tailwind CSS?",
      answer:
        "Tailwind uses mobile-first responsive prefixes: sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px). Write base styles for mobile, then add prefixed utilities for larger screens. For example, w-full md:w-1/2 lg:w-1/3 makes an element full-width on mobile, half on tablets, one-third on desktops. DevBolt's visual generator lets you compose classes interactively with a live preview showing how the layout responds at each breakpoint.",
    },
    {
      question: "What is the difference between Tailwind CSS and traditional CSS?",
      answer:
        "Tailwind is utility-first: you compose styles by applying pre-built classes in HTML. Traditional CSS uses custom stylesheets with semantic class names. Tailwind eliminates context-switching between files, reduces CSS size through tree-shaking, and prevents specificity conflicts. Traditional CSS offers more semantic markup and easier global changes. Many teams use Tailwind with component frameworks where class repetition is managed through component abstraction.",
    },
    {
      question: "How do I use custom values in Tailwind CSS?",
      answer:
        "Use arbitrary value syntax with square brackets: w-[37px], bg-[#1da1f2], or p-[13px]. DevBolt's generator includes presets for common UI patterns. The live preview updates as you add or remove classes. For frequently used custom values, define them in tailwind.config.js under theme.extend for reuse as proper named utilities across your project.",
    },
  ],

  "text-binary": [
    {
      question: "How do I convert text to binary representation?",
      answer:
        "Type or paste text and each character is instantly converted to its binary equivalent. For ASCII text, each character maps to an 8-bit binary number. The letter A is 01000001 (decimal 65). UTF-8 characters may require 1 to 4 bytes, producing longer binary sequences for non-ASCII characters. DevBolt handles full Unicode including emoji and CJK characters. This conversion is useful for understanding computer data storage, debugging encoding issues, and educational purposes.",
    },
    {
      question: "What is the difference between ASCII and UTF-8 binary encoding?",
      answer:
        "ASCII uses fixed 7-bit encoding (stored as 8 bits) for 128 characters: English letters, digits, punctuation, and control characters. Every ASCII character is one byte. UTF-8 is variable-length and backward-compatible with ASCII. Characters beyond ASCII use 2-4 bytes: European accented characters use 2, CJK use 3, emoji use 4. UTF-8 is used by over 98% of websites. When converting text to binary, the encoding determines how many bits each character produces.",
    },
    {
      question: "How do I decode binary back to readable text?",
      answer:
        "Split the binary string into 8-bit groups, convert each to its decimal value, then map to the corresponding character. 01001000 01101001 converts to decimal 72 and 105, producing 'Hi'. For UTF-8, some characters span multiple bytes. DevBolt handles both directions instantly. Paste binary digits separated by spaces or as a continuous string and the tool reconstructs the original text.",
    },
  ],

  "text-shadow": [
    {
      question: "How do I create a CSS text-shadow effect?",
      answer:
        "Use the text-shadow property with horizontal offset, vertical offset, blur radius, and color. Unlike box-shadow, text-shadow does not support spread radius or inset. The shadow follows the exact shape of text characters. DevBolt's visual generator lets you adjust all values with sliders and color pickers, showing the result on sample text in real time. Customize preview text, font size, and background to match your design context.",
    },
    {
      question: "How do I create a neon glow or text outline effect with CSS?",
      answer:
        "Layer multiple text-shadow values separated by commas. For neon glow, use shadows with zero offset and increasing blur. For text outline, place shadows in all four directions with zero blur. DevBolt's generator supports adding multiple shadow layers visually, letting you build complex effects like fire text, retro 3D lettering, embossed looks, and letterpress indentations without writing CSS manually.",
    },
    {
      question: "What is the difference between text-shadow and box-shadow?",
      answer:
        "text-shadow follows the exact glyph shapes of text characters. box-shadow applies to the rectangular bounding box of an element. text-shadow accepts three lengths (offset-x, offset-y, blur) plus color. box-shadow additionally supports spread radius and the inset keyword. Both accept multiple comma-separated values and all CSS color formats. Use text-shadow for typographic effects on headings. Use box-shadow for element depth and card elevation.",
    },
  ],

  "token-counter": [
    {
      question: "How do LLM token counters calculate tokens from text?",
      answer:
        "Token counters use tokenization algorithms (BPE or SentencePiece) that split text into subword units. Common words like 'the' are single tokens while uncommon words are split into fragments. On average, one token is approximately 4 characters or 0.75 English words. DevBolt supports 19 models across 6 providers, each using their own tokenizer, so token counts vary between models for the same input.",
    },
    {
      question: "How do I estimate API costs for LLM calls?",
      answer:
        "Paste your prompt and select the target model. DevBolt counts input tokens and calculates cost based on per-token pricing. Input and output tokens are priced differently. Estimate output token count based on expected response length. Total cost = (input tokens x input price) + (output tokens x output price). For batch processing, these per-request costs add up quickly, making accurate estimation essential for budget planning.",
    },
    {
      question: "Why do different AI models produce different token counts for the same text?",
      answer:
        "Different models use different tokenizers trained on different datasets, producing different vocabulary sizes. A larger vocabulary generally means fewer tokens per text because more words are single tokens. Code-heavy text tokenizes very differently since some tokenizers have more programming language training data. The practical impact: the same prompt costs different amounts across providers, and context window limits hold different amounts of text.",
    },
  ],

  "toml-converter": [
    {
      question: "What is TOML and how does it differ from JSON and YAML?",
      answer:
        "TOML is a configuration format designed for clarity with unambiguous semantics. Unlike JSON, TOML supports comments, has native date/time types, and does not require quotes around most keys. Unlike YAML, TOML avoids indentation-based nesting, eliminating parsing errors. TOML uses [section] headers and dot-separated keys. It is standard for Rust's Cargo.toml, Python's pyproject.toml, and Hugo's config.toml. DevBolt converts bidirectionally between TOML, JSON, and YAML.",
    },
    {
      question: "How do I convert between TOML, JSON, and YAML?",
      answer:
        "Paste content in any of the three formats and select the target. The converter maps data types appropriately across formats. TOML datetime values become ISO 8601 strings in JSON. Inline tables expand into standard objects. Comments are lost when converting to JSON since JSON has no comment syntax. All conversion runs in your browser for privacy.",
    },
    {
      question: "When should I use TOML instead of YAML?",
      answer:
        "Use TOML when config is relatively flat, you want unambiguous parsing without type coercion surprises, and your ecosystem expects it (Rust, Python packaging, Hugo). TOML's explicit syntax means '123' is always a number and 'true' is always a boolean, unlike YAML where country codes and yes/no values can be misinterpreted. Use YAML for deeply nested structures, anchors/aliases, or when tools require it (Kubernetes, Docker Compose, GitHub Actions).",
    },
  ],

  "ts6-migration": [
    {
      question: "What are the breaking changes in TypeScript 6.0?",
      answer:
        "TypeScript 6.0 introduces stricter defaults: strict mode enabled by default, isolatedDeclarations enforced for libraries, verbatimModuleSyntax replacing deprecated flags, and module resolution defaults changing to node16/nodenext. Some deprecated compiler options are fully removed. DevBolt's checker analyzes your tsconfig.json against these changes and reports which affect your project, providing a readiness grade and specific migration guidance.",
    },
    {
      question: "How do I check if my TypeScript project is ready for TS 6.0?",
      answer:
        "Paste your tsconfig.json into DevBolt's analyzer. It examines compiler options against all known breaking changes and generates a readiness report with a letter grade (A through F). Each flagged item includes the breaking change description, your current setting, the recommended new setting, and step-by-step instructions. Issues are categorized by severity: critical (build failures), warnings (deprecated), and informational notes. Address critical issues first.",
    },
    {
      question: "What is isolatedDeclarations and how does it affect TypeScript code?",
      answer:
        "isolatedDeclarations requires explicit type annotations on all exported functions, classes, and variables so declaration files can be generated without full type inference. This means adding return type annotations to all exported functions. The benefit is dramatically faster declaration file generation since tools can process files in parallel. Library authors publishing to npm are the primary audience. Build tools like tsgo leverage it for performance.",
    },
  ],

  "tsconfig-builder": [
    {
      question: "How do I create a tsconfig.json for my project?",
      answer:
        "Select a framework preset (React, Next.js, Node.js, library, or vanilla TypeScript), then customize options using the visual editor. DevBolt organizes 35+ options into categories: strict type checking, module resolution, output settings, path aliases, and file inclusion. Each option shows a description of what it does and when to enable it. The generated tsconfig.json updates in real time and can be copied or downloaded.",
    },
    {
      question: "What does enabling strict mode do in tsconfig.json?",
      answer:
        "The strict flag enables a collection of stricter type-checking options: strictNullChecks, strictFunctionTypes, strictBindCallApply, strictPropertyInitialization, noImplicitAny, noImplicitThis, useUnknownInCatchVariables, and alwaysStrict. Enabling strict is recommended for all new projects. It catches common bugs at compile time and forces explicit type handling rather than relying on unsafe implicit any types.",
    },
    {
      question: "What is the difference between module and moduleResolution in tsconfig?",
      answer:
        "module controls the JavaScript module format TypeScript emits: commonjs emits require/module.exports, esnext emits import/export, nodenext emits Node.js native ESM. moduleResolution controls how TypeScript finds imported files: node (classic CommonJS resolution), node16/nodenext (ESM with package.json exports support), or bundler (modern bundler resolution). These are independent: you can emit ESM while using bundler resolution.",
    },
  ],

  "typescript-to-js": [
    {
      question: "How does TypeScript to JavaScript conversion work?",
      answer:
        "The converter strips all TypeScript-specific syntax: type annotations, interfaces, type aliases, generics, access modifiers (public/private/protected), type assertions (as keyword), non-null assertions, and declare statements. Enum declarations are converted to equivalent JavaScript objects. Optional chaining and nullish coalescing are preserved as valid modern JavaScript. The output runs directly in any JavaScript runtime.",
    },
    {
      question: "What happens to TypeScript enums when converted to JavaScript?",
      answer:
        "Numeric enums become immediately invoked functions creating bidirectional mapping objects. String enums become simpler one-directional objects. Const enums are inlined at every usage site and produce no runtime object. DevBolt's converter reproduces the same JavaScript output as the TypeScript compiler, ensuring identical runtime behavior.",
    },
    {
      question: "What is the difference between type stripping and full transpilation?",
      answer:
        "Type stripping removes only TypeScript-specific syntax while preserving all JavaScript code as-is. Full transpilation also transforms modern JavaScript for older targets: converting async/await to promises, optional chaining to ternaries, etc. DevBolt performs type stripping by default, sufficient when your target supports modern JavaScript. Node.js 22+ includes native type stripping, running TypeScript files directly.",
    },
  ],

  "word-counter": [
    {
      question: "How does the word counter estimate reading time?",
      answer:
        "Reading time is calculated by dividing word count by 200-250 words per minute, the average for adult English non-fiction reading. A 1,000-word article takes approximately 4-5 minutes. Speaking time uses 130-150 words per minute. DevBolt provides both reading and speaking time estimates for planning blog posts, documentation, presentations, and video scripts. The tool also counts characters, sentences, and paragraphs.",
    },
    {
      question: "Does the character count include spaces and punctuation?",
      answer:
        "DevBolt provides both: characters with spaces and characters without spaces. The with-spaces count includes everything. The without-spaces count excludes whitespace. Twitter and most social platforms count all characters including spaces. Some academic standards specify counts without spaces. The tool also counts sentences by detecting ending punctuation and paragraphs based on line breaks.",
    },
    {
      question: "Is my text data private when using an online word counter?",
      answer:
        "Yes, DevBolt processes all text entirely in your browser using client-side JavaScript. No text is transmitted to any server. You can verify by disconnecting from the internet — the tool still works. When you close the tab, all text data is cleared from memory. This makes it safe for confidential documents, unpublished manuscripts, legal contracts, and any sensitive content.",
    },
  ],

  "xml-formatter": [
    {
      question: "How do I format and beautify XML documents online?",
      answer:
        "Paste unformatted or minified XML and the tool formats it with proper indentation, line breaks, and syntax highlighting. You can customize indentation style and choose whether to preserve or collapse empty elements. The formatter validates structure, highlighting syntax errors with line numbers. DevBolt processes everything client-side so XML data containing API responses, configuration files, or SOAP messages never leaves your browser.",
    },
    {
      question: "What is the difference between well-formed XML and valid XML?",
      answer:
        "Well-formed XML follows basic syntax rules: single root element, properly opened and closed tags, correct nesting, and quoted attributes. Valid XML is well-formed and additionally conforms to a schema (DTD, XSD, or RelaxNG) specifying allowed elements, types, and structure. All valid XML is well-formed, but not all well-formed XML is valid. DevBolt checks for well-formedness, catching syntax errors like unclosed tags and duplicate attributes.",
    },
    {
      question: "How do I minify XML to reduce payload size?",
      answer:
        "Switch to minify mode to remove whitespace, line breaks, comments, and indentation while preserving structure and content. This reduces size by 10-30%. For greater reduction, enable Gzip or Brotli compression on your server, which compresses XML significantly more than whitespace removal alone. Most web servers support automatic content compression for XML MIME types.",
    },
  ],

  "yaml-formatter": [
    {
      question: "How do I validate YAML syntax online?",
      answer:
        "Paste your YAML document and the tool parses it instantly, highlighting syntax errors with line numbers. Common errors include incorrect indentation (YAML requires spaces not tabs), missing colons after keys, unquoted special characters, and inconsistent list formatting. Valid YAML is reformatted with consistent indentation. DevBolt processes everything in your browser, safe for validating Kubernetes manifests, Docker Compose files, and configs with sensitive values.",
    },
    {
      question: "What are the most common YAML syntax errors?",
      answer:
        "Most YAML errors involve indentation: using tabs instead of spaces causes parse failures. Other mistakes include forgetting the space after colons (name:value instead of name: value), unquoted strings with special characters, duplicate keys, and confusion between block scalar indicators (| for literal, > for folded). The 'Norway problem' where yes, no, on, off are parsed as booleans instead of strings is a persistent source of subtle bugs. Always quote ambiguous values.",
    },
    {
      question: "When should I use YAML instead of JSON for configuration?",
      answer:
        "Use YAML for configuration where readability, comments, and editability matter. YAML's indentation syntax is cleaner for nested structures and comment support is essential for documenting complex configs. Kubernetes, Docker Compose, GitHub Actions, GitLab CI, and Ansible use YAML. Use JSON for strict machine parsing and API data interchange. YAML is a superset of JSON, so valid JSON files are also valid YAML.",
    },
  ],

  "zod-schema": [
    {
      question: "How do I generate a Zod schema from JSON data?",
      answer:
        "Paste a JSON object or array and DevBolt infers the Zod schema from the structure: strings become z.string(), numbers z.number(), booleans z.boolean(), arrays z.array(), and nested objects z.object(). The generator detects common formats like emails, URLs, UUIDs, and dates, adding refinements like .email() or .url() automatically. You can also input JSON Schema for more precise conversion since constraints map directly to Zod methods.",
    },
    {
      question: "What is Zod and why use it for runtime validation in TypeScript?",
      answer:
        "Zod is a TypeScript-first schema validation library that checks data at runtime. Unlike TypeScript types that only exist at compile time, Zod validates when your application runs — critical for API responses, form inputs, environment variables, and external data. Zod schemas infer TypeScript types via z.infer, defining validation and types from a single source of truth. It integrates with React Hook Form, tRPC, Astro, Next.js server actions, and many frameworks.",
    },
    {
      question: "How do I add custom validation rules to a generated Zod schema?",
      answer:
        "Chain Zod's validation methods onto the generated schema: .min()/.max() for constraints, .email()/.url()/.uuid() for formats, .optional()/.nullable()/.default() for optionality, .nonempty() for arrays, and .refine()/.superRefine() for custom logic like password confirmation matching. Transform data during parsing with .transform() to coerce types or normalize formats. If you input JSON Schema with constraints, these methods are generated automatically.",
    },
  ],

  "code-security-scanner": [
    {
      question: "What security vulnerabilities does the AI Code Security Scanner detect?",
      answer:
        "The scanner checks for 20+ vulnerability patterns across 8 categories: hardcoded secrets and API keys (CWE-798), SQL injection via string concatenation (CWE-89), command injection through exec/spawn (CWE-78), cross-site scripting via innerHTML and dangerouslySetInnerHTML (CWE-79), server-side request forgery with user-controlled URLs (CWE-918), path traversal in filesystem operations (CWE-22), prototype pollution through dynamic property assignment (CWE-1321), insecure randomness with Math.random() (CWE-330), weak cryptographic algorithms, open redirects, missing rate limiting, and more. Each finding includes a CWE reference, severity level, and specific fix recommendation.",
    },
    {
      question: "Is the code scanner safe for proprietary or production code?",
      answer:
        "Yes. The scanner runs 100% in your browser using JavaScript pattern matching — your code is never sent to any server, API, or AI model. All analysis happens locally in your browser's memory and is discarded when you close the tab. You can verify this by checking the Network tab in DevTools while scanning. This makes it safe for scanning production code, internal libraries, and proprietary business logic that should never be shared with third parties.",
    },
    {
      question: "Can this scanner replace a full SAST tool like Semgrep or CodeQL?",
      answer:
        "No — this tool uses regex-based pattern matching to catch common vulnerabilities quickly, but it does not perform full abstract syntax tree (AST) analysis, data flow tracking, or taint analysis like Semgrep, CodeQL, or Snyk Code. It is best used as a quick first-pass review, especially for AI-generated code that may contain obvious security antipatterns. For production security audits, combine this with a proper SAST tool in your CI/CD pipeline.",
    },
  ],

  "code-complexity-analyzer": [
    {
      question: "What is cyclomatic complexity and why does it matter?",
      answer:
        "Cyclomatic complexity (CC) measures the number of independent paths through a function — essentially how many decision points (if, else if, case, loops, ternary, logical operators) exist. A CC of 1-5 means the function is simple and easy to test. 6-10 is moderate and may benefit from refactoring. Above 10 is complex and hard to test thoroughly — each path needs at least one test case. Above 20 is very high risk and should be split into smaller functions. This is especially important for AI-generated code, which often produces long functions with many branches.",
    },
    {
      question: "What is cognitive complexity and how is it different from cyclomatic?",
      answer:
        "Cognitive complexity measures how hard code is for a human to understand, as defined by SonarSource. Unlike cyclomatic complexity which counts all paths equally, cognitive complexity adds nesting penalties — an if inside a for inside another if scores much higher than three sequential if statements. This better reflects the mental effort needed to follow the code. A function with CC=10 might have cognitive complexity of 5 (flat structure) or 25 (deeply nested). DevBolt shows both metrics so you can identify functions that are both hard to test and hard to read.",
    },
    {
      question: "What is the maintainability index and how is the grade calculated?",
      answer:
        "The maintainability index (MI) is a composite metric originally developed at Carnegie Mellon and adopted by Microsoft Visual Studio. It combines cyclomatic complexity, lines of code, and Halstead volume (a measure of code vocabulary) into a single 0-100 score. Higher is better: 80-100 is grade A (highly maintainable), 60-79 is grade B, 40-59 is grade C, 20-39 is grade D, and below 20 is grade F. DevBolt uses a simplified version of this formula optimized for JavaScript and TypeScript functions.",
    },
    {
      question: "Is this tool accurate enough for production use?",
      answer:
        "DevBolt's Code Complexity Analyzer uses pattern-based static analysis to identify functions and calculate metrics. It handles standard JavaScript and TypeScript function declarations, arrow functions, class methods, and common patterns. The metrics are approximations — for precise results in CI/CD pipelines, use ESLint's complexity rule, SonarQube, or CodeClimate. This tool is ideal for quick code reviews, evaluating AI-generated code quality, and learning about complexity metrics without installing anything.",
    },
  ],

  "github-actions-validator": [
    {
      question: "How do I validate a GitHub Actions workflow YAML file online?",
      answer:
        "Paste your workflow YAML into the editor and click Validate. The tool checks for syntax errors, missing required fields (on, jobs, runs-on, steps), broken job dependencies (needs referencing undefined jobs), deprecated action versions with upgrade suggestions, invalid trigger events, permission scope errors, and common misconfigurations. Results are categorized as errors, warnings, and info. Everything runs client-side — your workflow files never leave your browser.",
    },
    {
      question: "What are the most common GitHub Actions workflow errors?",
      answer:
        "Frequent errors include missing runs-on (every job needs a runner), steps with both uses and run (only one allowed per step), action references without version pinning (@v4), broken needs dependencies referencing non-existent jobs, invalid trigger event names, incorrect permission values, and YAML indentation mistakes. Security issues include using outdated action versions with known vulnerabilities and missing timeout-minutes allowing runaway jobs.",
    },
    {
      question: "How do I pin GitHub Action versions for reproducible builds?",
      answer:
        "Always reference actions with a version tag like actions/checkout@v4 or a commit SHA for maximum security. Avoid @latest or @main which can change unexpectedly. DevBolt's validator flags unpinned actions and outdated versions, suggesting the latest stable release. For critical workflows, pin to a full commit SHA (actions/checkout@abc123) to prevent supply chain attacks through tag mutation.",
    },
    {
      question: "How do I fix broken job dependencies in GitHub Actions?",
      answer:
        "The needs field references other job IDs that must complete before the current job starts. If needs references a job ID that does not exist in the workflow, GitHub will reject it. Check that job IDs match exactly (case-sensitive). DevBolt's validator cross-references all needs values against defined job IDs and flags any missing references, self-references, and circular dependencies.",
    },
  ],

  "http-request-builder": [
    {
      question: "How do I build an HTTP request without code?",
      answer:
        "Use the visual builder to set the HTTP method (GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS), enter the URL, add headers, query parameters, authorization (Bearer token, Basic Auth, API Key), and a request body (JSON, form-urlencoded, or raw). The tool generates working code in cURL, JavaScript (fetch), Python (requests), Go (net/http), Rust (reqwest), and PHP (curl). Copy the generated code and paste it into your project. Everything runs in your browser — no data is sent to any server.",
    },
    {
      question: "How is this different from Postman or ReqBin?",
      answer:
        "This tool focuses on code generation rather than executing requests. Postman and ReqBin send actual HTTP requests from their servers. DevBolt's HTTP Request Builder runs entirely in your browser and generates ready-to-use code in 6 languages. There is no account, no download, and no data leaves your device. It is ideal for quickly scaffolding API calls in your preferred language without installing a desktop app.",
    },
    {
      question: "What authentication methods are supported?",
      answer:
        "The builder supports Bearer Token (adds Authorization: Bearer header), Basic Auth (base64-encoded username:password, uses native auth mechanisms in each language like requests auth= in Python and -u in cURL), and API Key (sent as a custom header or query parameter). Each auth method generates idiomatic code for the selected language.",
    },
    {
      question: "Can I send a JSON body with a GET request?",
      answer:
        "While technically possible, sending a body with GET is discouraged by HTTP specifications and many servers ignore it. The builder allows it for flexibility (some APIs like Elasticsearch accept GET with body), but best practice is to use POST, PUT, or PATCH for requests with a body. The builder does not restrict method-body combinations so you can match your API's requirements.",
    },
  ],
};
