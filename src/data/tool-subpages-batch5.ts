import type { ToolSubpage } from "./tool-subpages";

export const batch5Subpages: Record<string, ToolSubpage[]> = {
  "json-formatter": [
    {
      slug: "safe",
      title: "Safe JSON Formatter",
      metaTitle: "Safe JSON Formatter Online — No Data Upload, 100% Private",
      metaDescription:
        "Format and validate JSON safely with zero data uploads. DevBolt's JSON formatter runs entirely in your browser — your data never touches a server. CodeBeautify alternative.",
      h1: "Safe JSON Formatter — Your Data Never Leaves Your Browser",
      intro:
        "Format, validate, and minify JSON with complete privacy. Unlike server-based tools like CodeBeautify and JSONFormatter.org, DevBolt processes everything client-side. Your API keys, credentials, and sensitive configuration data never leave your device.",
      content: [
        {
          heading: "Why you need a safe JSON formatter",
          body: "Developers routinely paste sensitive data into online JSON formatters: API responses containing authentication tokens, configuration files with database credentials, webhook payloads with customer PII, and environment variable exports. In November 2025, CodeBeautify and JSONFormatter.org suffered a data breach that exposed 5 GB of user-submitted data — including API keys, passwords, and session tokens that had been logged server-side. If you paste sensitive JSON into a server-based tool, you are trusting that server to handle your data responsibly. DevBolt eliminates that trust requirement entirely.",
        },
        {
          heading: "How DevBolt keeps your JSON private",
          body: "DevBolt's JSON formatter uses browser-native JSON.parse() and JSON.stringify() — the same functions your code already uses. When you paste JSON into this tool, the text stays in your browser's memory. No XMLHttpRequest, no fetch() call, no WebSocket connection, no server round-trip. You can verify this yourself: open your browser's DevTools Network tab before pasting JSON, and confirm zero requests are sent. The tool even works offline after your first visit thanks to service worker caching.",
        },
        {
          heading: "What data is at risk with server-based formatters",
          body: "Server-based JSON formatters can capture anything you paste: OAuth tokens and refresh tokens, AWS/GCP/Azure service account keys, database connection strings with passwords, JWT tokens containing user identity data, webhook payloads with customer email addresses, Stripe API keys and payment data, and internal API responses with business logic. Even if a tool claims not to log your data, a misconfigured server, a compromised CDN, or an analytics script can silently capture everything. Client-side processing is the only architecture that makes logging physically impossible.",
        },
        {
          heading: "How to verify a JSON formatter is safe",
          body: "Before trusting any online tool with sensitive data, verify it yourself. Open DevTools (F12) and go to the Network tab. Clear the log, then paste your JSON and click format. If the tool is truly client-side, you will see zero network requests related to your data. Check the Sources tab too — look for analytics scripts that might capture input fields. DevBolt passes this test every time. You can also disconnect from the internet entirely and confirm the tool still works.",
        },
      ],
      faqs: [
        {
          question: "Is DevBolt's JSON formatter safe for sensitive data?",
          answer:
            "Yes. DevBolt's JSON formatter runs 100% in your browser. Your JSON data is never sent to any server, stored in any database, or logged by any analytics tool. You can verify this by checking the Network tab in your browser's DevTools while using the tool.",
        },
        {
          question: "How is DevBolt different from CodeBeautify?",
          answer:
            "CodeBeautify processes data server-side and was involved in a November 2025 data breach that exposed 5 GB of user-submitted data. DevBolt processes everything client-side in your browser — it is architecturally impossible for DevBolt to access or store your data.",
        },
        {
          question: "Does the JSON formatter work offline?",
          answer:
            "Yes. After your first visit, DevBolt's service worker caches the tool for offline use. You can disconnect from the internet and the JSON formatter will continue to work, further proving that no server connection is needed.",
        },
        {
          question: "Can I use this JSON formatter for production API responses?",
          answer:
            "Absolutely. Since no data leaves your browser, it is safe to paste production API responses, even those containing authentication tokens, customer data, or internal business logic. This is the safest way to inspect JSON data online.",
        },
      ],
      keywords: [
        "safe json formatter",
        "private json formatter",
        "json formatter no upload",
        "secure json formatter",
        "codebeautify alternative",
        "offline json formatter",
        "json formatter privacy",
        "client-side json formatter",
      ],
      parentToolSlug: "json-formatter",
      parentToolName: "JSON Formatter",
    },
  ],

  base64: [
    {
      slug: "safe",
      title: "Safe Base64 Encoder & Decoder",
      metaTitle: "Safe Base64 Encoder & Decoder — Private, No Data Upload",
      metaDescription:
        "Encode and decode Base64 privately with zero server uploads. DevBolt's Base64 tool runs entirely in your browser. Safe for API keys, tokens, and credentials.",
      h1: "Safe Base64 Encoder & Decoder — No Server Upload",
      intro:
        "Encode and decode Base64 strings with complete privacy. DevBolt's Base64 tool processes everything in your browser using native JavaScript functions. Your tokens, API keys, and encoded credentials are never transmitted to any server.",
      content: [
        {
          heading: "Why Base64 privacy matters",
          body: "Base64 encoding is widely used to embed credentials in HTTP headers (Basic Auth), encode API keys for transport, embed images in HTML/CSS, and pass binary data through text-based protocols. When you decode a Base64 string, you are often revealing the raw credential or token it was protecting. Pasting a Base64-encoded API key into a server-based decoder means sending that key — in cleartext — to a third-party server. DevBolt decodes Base64 entirely in your browser using the native atob() and btoa() functions, so your decoded secrets never leave your device.",
        },
        {
          heading: "Common sensitive data encoded in Base64",
          body: "Authorization headers (Basic dXNlcjpwYXNzd29yZA==), JWT tokens (which are three Base64url-encoded segments), Docker registry credentials in .docker/config.json, Kubernetes Secrets (stored as Base64 in YAML manifests), SSH keys and certificates, SAML assertions, and email attachments. Each of these contains data that should never be sent to an untrusted server for decoding. A client-side Base64 tool is the only safe way to inspect these values online.",
        },
        {
          heading: "Verify this tool is safe",
          body: "Open your browser DevTools (F12), switch to the Network tab, and paste any Base64 string. Click encode or decode. You will see zero data-related network requests. DevBolt uses the Web APIs window.atob() and window.btoa() for standard Base64, and TextEncoder/TextDecoder for UTF-8 support. No server is involved at any point. The tool works fully offline after your first visit.",
        },
      ],
      faqs: [
        {
          question: "Is it safe to decode Base64 API keys online?",
          answer:
            "With DevBolt, yes. The Base64 decoder runs entirely in your browser — your decoded data never leaves your device. With server-based tools, no — your decoded API key would be sent to and potentially logged by a third-party server.",
        },
        {
          question: "Can I decode JWT tokens safely with this tool?",
          answer:
            "Yes. JWT tokens are Base64url-encoded. You can decode the header and payload segments safely here since all processing is client-side. For full JWT inspection with claim validation, try DevBolt's dedicated JWT Decoder tool.",
        },
        {
          question: "Does this Base64 tool work offline?",
          answer:
            "Yes. DevBolt uses a service worker for offline caching. After your first visit, you can disconnect from the internet and encode/decode Base64 strings without any network connection.",
        },
      ],
      keywords: [
        "safe base64 encoder",
        "private base64 decoder",
        "base64 no upload",
        "secure base64 decoder",
        "base64 decoder privacy",
        "offline base64 tool",
        "safe base64 decode online",
        "client-side base64",
      ],
      parentToolSlug: "base64",
      parentToolName: "Base64 Codec",
    },
  ],

  "jwt-decoder": [
    {
      slug: "safe",
      title: "Safe JWT Decoder",
      metaTitle: "Safe JWT Decoder Online — Decode JWTs Privately, No Upload",
      metaDescription:
        "Decode JWT tokens safely with zero data upload. DevBolt's JWT decoder runs in your browser — inspect headers, claims, and signatures without exposing tokens to any server.",
      h1: "Safe JWT Decoder — Inspect Tokens Without Exposing Them",
      intro:
        "Decode and inspect JWT tokens with complete privacy. Unlike server-based JWT tools, DevBolt decodes tokens entirely in your browser. Your authentication tokens, user data, and session information are never sent to any external server.",
      content: [
        {
          heading: "Why JWT privacy is critical",
          body: "JWT tokens are the keys to your users' sessions. A production JWT typically contains the user's ID, email, roles, and permissions — and the token itself grants access to your API. Pasting a valid JWT into a server-based decoder sends that token to a third party. If their server logs the request, that token can be replayed to impersonate your user until it expires. Even expired JWTs reveal user identity, internal claim structures, and issuer information that can be used for reconnaissance. DevBolt decodes JWTs entirely in your browser using base64url decoding — the token never touches a network.",
        },
        {
          heading: "What JWT claims reveal about your system",
          body: "A decoded JWT payload exposes more than user data. The iss (issuer) claim reveals your auth provider (Auth0, Firebase, Cognito). The aud (audience) claim shows your API endpoints. Custom claims expose your permission model, tenant structure, and role hierarchy. The alg header tells an attacker which signing algorithm you use. All of this is valuable reconnaissance data that should never be sent to a third-party server. Decode JWTs locally to keep your architecture details private.",
        },
        {
          heading: "How to safely debug JWT issues in production",
          body: "When debugging authentication issues in production, you often need to inspect live JWT tokens. The safe approach: copy the token from your browser's DevTools or API response, paste it into DevBolt's client-side JWT decoder, inspect the claims (especially exp, iat, and iss), and check the header algorithm. At no point does the token leave your machine. Never paste production JWTs into server-based tools like jwt.io's online decoder — while jwt.io is reputable, any server-based tool introduces unnecessary risk.",
        },
      ],
      faqs: [
        {
          question: "Is it safe to paste production JWT tokens into this decoder?",
          answer:
            "Yes. DevBolt's JWT decoder runs 100% in your browser. The token is decoded using JavaScript's atob() function locally — it is never transmitted to any server. This makes it safe for production tokens containing real user data.",
        },
        {
          question: "How is this different from jwt.io?",
          answer:
            "jwt.io also decodes tokens client-side, but it loads third-party scripts and analytics. DevBolt is a minimal, privacy-first tool with no third-party tracking scripts. Both are safer than fully server-based decoders, but DevBolt takes a stricter approach to privacy.",
        },
        {
          question: "Can someone steal my JWT if I decode it online?",
          answer:
            "Not with DevBolt. Since all decoding happens in your browser, the token stays on your device. With server-based tools, the token is transmitted over the network and could be logged server-side, making theft possible.",
        },
      ],
      keywords: [
        "safe jwt decoder",
        "private jwt decoder",
        "jwt decoder no upload",
        "secure jwt decoder",
        "decode jwt privately",
        "jwt decoder offline",
        "jwt decoder privacy",
        "safe jwt token decoder",
      ],
      parentToolSlug: "jwt-decoder",
      parentToolName: "JWT Decoder",
    },
  ],

  "password-generator": [
    {
      slug: "safe",
      title: "Safe Password Generator",
      metaTitle: "Safe Password Generator — Private, Offline, No Tracking",
      metaDescription:
        "Generate strong passwords privately with zero server contact. DevBolt uses your browser's crypto API to create passwords that never leave your device.",
      h1: "Safe Password Generator — Passwords That Never Leave Your Device",
      intro:
        "Generate cryptographically strong passwords with complete privacy. DevBolt uses your browser's Web Crypto API (crypto.getRandomValues) to generate passwords locally. No password is ever transmitted, stored, or logged — because no server is involved.",
      content: [
        {
          heading: "Why password generator privacy matters",
          body: "A password generator that phones home defeats its own purpose. If the generated password is sent to a server — even momentarily for 'randomness' or 'strength checking' — it is no longer a secret. Server-based password generators introduce three risks: the password could be logged, intercepted in transit, or stored in a database that gets breached. DevBolt generates passwords entirely in your browser using the Web Crypto API, the same cryptographic random number generator used by TLS encryption. The password exists only in your browser's memory until you copy it.",
        },
        {
          heading: "How browser-based password generation works",
          body: "DevBolt calls crypto.getRandomValues() to generate cryptographically secure random bytes, then maps those bytes to your chosen character set (uppercase, lowercase, digits, symbols). This is the same entropy source your browser uses for generating TLS session keys — it is backed by your operating system's CSPRNG (CryptGenRandom on Windows, /dev/urandom on Linux, SecRandomCopyBytes on macOS). No external entropy source or server-side randomness is needed.",
        },
        {
          heading: "What to look for in a safe password generator",
          body: "A trustworthy password generator should: (1) work entirely offline — disconnect from the internet and verify it still works, (2) use crypto.getRandomValues() or equivalent CSPRNG — check the source code, (3) send zero network requests when generating — verify in DevTools Network tab, (4) not require an account or login, (5) not include analytics scripts that capture form inputs. DevBolt meets all five criteria. You can audit the behavior yourself in under 30 seconds.",
        },
      ],
      faqs: [
        {
          question: "Are passwords generated by DevBolt truly random?",
          answer:
            "Yes. DevBolt uses the Web Crypto API (crypto.getRandomValues()), which provides cryptographically secure pseudo-random numbers backed by your operating system's entropy pool. This is the same randomness source used for TLS encryption.",
        },
        {
          question: "Does DevBolt store or log generated passwords?",
          answer:
            "No. Generated passwords exist only in your browser's memory. DevBolt has no server-side component for the password generator — there is nowhere for passwords to be sent or stored. You can verify this by checking the Network tab in DevTools.",
        },
        {
          question: "Can I use this password generator offline?",
          answer:
            "Yes. After your first visit, DevBolt's service worker caches the tool. You can disconnect from the internet and generate passwords without any network connection, further proving no server is involved.",
        },
      ],
      keywords: [
        "safe password generator",
        "private password generator",
        "password generator no tracking",
        "secure password generator offline",
        "password generator privacy",
        "offline password generator",
        "password generator no upload",
        "client-side password generator",
      ],
      parentToolSlug: "password-generator",
      parentToolName: "Password Generator",
    },
  ],

  "hash-generator": [
    {
      slug: "safe",
      title: "Safe Hash Generator",
      metaTitle: "Safe Hash Generator — Private SHA-256/MD5/SHA-512, No Upload",
      metaDescription:
        "Generate SHA-256, SHA-512, and MD5 hashes privately. DevBolt's hash tool runs in your browser using the Web Crypto API. Your data never touches a server.",
      h1: "Safe Hash Generator — Hash Data Without Uploading It",
      intro:
        "Generate SHA-256, SHA-512, SHA-1, and MD5 hashes with complete privacy. DevBolt uses your browser's Web Crypto API for all hashing — your input data never leaves your device. Safe for hashing passwords, API keys, and sensitive strings.",
      content: [
        {
          heading: "Why hash generator privacy matters",
          body: "Developers hash sensitive data for a reason: to protect it. Sending that same data to a server-based hash generator undermines the entire purpose. If you are hashing a password to compare against a stored hash, sending the plaintext password to a third-party server exposes it. If you are generating a checksum for a confidential file, uploading the file contents defeats confidentiality. DevBolt hashes everything locally using the Web Crypto API — your plaintext input stays on your device, and only the hash output exists in your browser.",
        },
        {
          heading: "How browser-based hashing works",
          body: "DevBolt uses the SubtleCrypto.digest() method from the Web Crypto API for SHA-1, SHA-256, SHA-384, and SHA-512. This is the same hashing implementation your browser uses for TLS certificate verification and Subresource Integrity checks — it is hardware-accelerated on most modern processors. For MD5, DevBolt uses a pure JavaScript implementation since MD5 is not included in the Web Crypto API. All computation happens in your browser's JavaScript engine.",
        },
        {
          heading: "Common sensitive data that gets hashed",
          body: "Passwords before database storage, file checksums for integrity verification, API request signatures (HMAC), content-addressable storage keys, de-duplication hashes for sensitive documents, and git commit hashes. Each of these involves data that should remain confidential. A client-side hash generator ensures the plaintext input never crosses a network boundary.",
        },
      ],
      faqs: [
        {
          question: "Is it safe to hash passwords with an online tool?",
          answer:
            "With DevBolt, yes — the password text stays in your browser and only the hash is generated locally. With server-based tools, no — the plaintext password would be transmitted to and potentially logged by the server.",
        },
        {
          question: "Does DevBolt's hash generator use the Web Crypto API?",
          answer:
            "Yes. SHA-1, SHA-256, SHA-384, and SHA-512 all use SubtleCrypto.digest(), which is hardware-accelerated and identical to the hashing used in TLS. MD5 uses a pure JavaScript implementation since browsers do not expose MD5 via Web Crypto.",
        },
        {
          question: "Can I verify file checksums safely with this tool?",
          answer:
            "Yes. DevBolt's File Hash Calculator lets you drag and drop files for hashing. The file is read locally using the FileReader API and hashed in your browser — the file content is never uploaded anywhere.",
        },
      ],
      keywords: [
        "safe hash generator",
        "private hash generator",
        "hash generator no upload",
        "safe sha256 generator",
        "private md5 generator",
        "offline hash generator",
        "secure hash tool",
        "client-side hash generator",
      ],
      parentToolSlug: "hash-generator",
      parentToolName: "Hash Generator",
    },
  ],

  "diff-checker": [
    {
      slug: "safe",
      title: "Safe Diff Checker",
      metaTitle: "Safe Diff Checker — Private Code Comparison, No Upload",
      metaDescription:
        "Compare code and text privately with zero data upload. DevBolt's diff checker runs in your browser — safe for source code, configs, and credentials.",
      h1: "Safe Diff Checker — Compare Code Without Uploading It",
      intro:
        "Compare code, configuration files, and text privately. DevBolt's diff checker runs entirely in your browser — your source code, environment configs, and sensitive text are never sent to any server.",
      content: [
        {
          heading: "Why diff checker privacy matters for developers",
          body: "Developers compare sensitive content daily: production vs staging config files (containing database URLs and API keys), .env file changes (with secrets), source code containing proprietary business logic, infrastructure-as-code files (with cloud credentials), and SQL migration scripts (revealing database schema). Server-based diff tools receive both sides of the comparison, doubling the exposure. DevBolt's diff algorithm runs entirely in your browser — both inputs stay on your device.",
        },
        {
          heading: "Safe for comparing configuration files",
          body: "Configuration diffs are the most dangerous to paste into online tools. A before-and-after comparison of a .env file reveals both the old and new values of every secret. An nginx.conf diff might expose internal IP addresses and upstream server names. A docker-compose.yml diff shows environment variables injected into containers. DevBolt makes these comparisons safe because the diff algorithm (longest common subsequence) runs in your browser's JavaScript engine with zero network involvement.",
        },
        {
          heading: "How to verify this diff checker is private",
          body: "Open DevTools (F12), go to the Network tab, and clear the log. Paste text into both input panels and click compare. You will see zero data-related requests. The diff is computed locally using a JavaScript LCS algorithm. You can also disconnect from the internet and verify the tool still works — proving no server connection is needed for the comparison.",
        },
      ],
      faqs: [
        {
          question: "Is it safe to compare production config files online?",
          answer:
            "With DevBolt, yes. The diff algorithm runs in your browser — both input texts stay on your device. With server-based diff tools, both versions of your config (and all their secrets) would be transmitted to the server.",
        },
        {
          question: "Can I compare source code without it being stored?",
          answer:
            "Yes. DevBolt does not store, log, or transmit any text you paste into the diff checker. The comparison is computed in your browser's memory and discarded when you close the tab.",
        },
        {
          question: "Is DevBolt's diff checker safe for proprietary code?",
          answer:
            "Yes. Since all processing is client-side, your proprietary source code never leaves your machine. This makes DevBolt safe for comparing trade secrets, unreleased features, and internal codebases.",
        },
      ],
      keywords: [
        "safe diff checker",
        "private diff checker",
        "diff checker no upload",
        "secure code comparison",
        "private code diff",
        "offline diff checker",
        "safe text comparison",
        "client-side diff tool",
      ],
      parentToolSlug: "diff-checker",
      parentToolName: "Diff Checker",
    },
  ],

  "json-visualizer": [
    {
      slug: "safe",
      title: "Safe JSON Viewer",
      metaTitle: "Safe JSON Viewer & Tree Explorer — Private, No Data Upload",
      metaDescription:
        "View and explore JSON data privately with an interactive tree viewer. DevBolt's JSON visualizer runs in your browser — safe for API responses and sensitive data.",
      h1: "Safe JSON Viewer — Explore Data Without Uploading It",
      intro:
        "Explore JSON data with an interactive tree viewer, completely privately. DevBolt's JSON visualizer processes everything in your browser — your API responses, database exports, and configuration data are never sent to any server.",
      content: [
        {
          heading: "Why JSON viewer privacy matters",
          body: "JSON viewers and tree explorers are used to inspect API responses, database query results, log entries, and configuration exports — all of which commonly contain sensitive data. A production API response might include user emails, session tokens, or payment information. A database export could contain entire customer records. JSON Crack and similar server-enhanced JSON viewers may process data through their backend for rendering. DevBolt renders the entire tree in your browser using pure DOM manipulation — no data leaves your device.",
        },
        {
          heading: "Safe for inspecting production data",
          body: "When debugging production issues, you often need to inspect live API responses or database records. DevBolt's JSON visualizer lets you paste production data safely: collapsible tree nodes let you navigate large responses, search highlights specific keys and values, JSON path copy shows the exact accessor for any node, and depth controls let you expand or collapse to any level. All of this runs client-side, making it safe for even the most sensitive production data.",
        },
        {
          heading: "How to verify this JSON viewer is private",
          body: "Open DevTools (F12), switch to the Network tab, and paste your JSON data. Expand nodes, search for keys, and copy paths. Zero network requests related to your data will appear. The tree is built using React components that render directly from the parsed JSON object in memory. You can also use the tool offline after your first visit.",
        },
      ],
      faqs: [
        {
          question: "Is this JSON viewer safe for production API data?",
          answer:
            "Yes. The entire tree visualization runs in your browser. Your JSON data stays in local memory and is never transmitted to any server. It is safe for API responses containing user data, tokens, and internal business logic.",
        },
        {
          question: "How is this different from JSON Crack?",
          answer:
            "JSON Crack is a powerful visualizer but uses server-side processing for some features. DevBolt's JSON viewer is 100% client-side — simpler but completely private. No data ever leaves your browser.",
        },
        {
          question: "Can I use this to view large JSON files privately?",
          answer:
            "Yes. DevBolt handles JSON files up to several megabytes in your browser. The collapsible tree, depth controls, and search help you navigate large datasets efficiently — all without any server involvement.",
        },
      ],
      keywords: [
        "safe json viewer",
        "private json viewer",
        "json viewer no upload",
        "secure json tree viewer",
        "private json explorer",
        "offline json viewer",
        "json viewer privacy",
        "client-side json viewer",
      ],
      parentToolSlug: "json-visualizer",
      parentToolName: "JSON Visualizer",
    },
  ],

  "sql-formatter": [
    {
      slug: "safe",
      title: "Safe SQL Formatter",
      metaTitle: "Safe SQL Formatter — Format SQL Privately, No Upload",
      metaDescription:
        "Format and beautify SQL queries privately with zero data upload. DevBolt's SQL formatter runs in your browser — safe for queries containing table names and business logic.",
      h1: "Safe SQL Formatter — Format Queries Without Exposing Your Schema",
      intro:
        "Format and beautify SQL queries with complete privacy. DevBolt's SQL formatter runs entirely in your browser — your queries, table names, column names, and WHERE clauses are never sent to any server.",
      content: [
        {
          heading: "Why SQL formatter privacy matters",
          body: "SQL queries reveal your database schema: table names, column names, relationships, and business logic encoded in WHERE clauses and JOINs. A complex query might expose customer table structures, payment processing logic, or internal analytics dimensions. Formatting a query on a server-based tool sends this structural information to a third party. DevBolt formats SQL entirely in your browser using a JavaScript SQL parser — your schema details stay private.",
        },
        {
          heading: "Safe for production queries",
          body: "When debugging slow queries or formatting complex JOINs, you often work with production SQL that references real tables and includes real filter conditions. DevBolt's SQL formatter handles all major SQL dialects (MySQL, PostgreSQL, SQLite, SQL Server, Oracle) and formats them locally. Paste your production query without worrying about exposing table names like 'users', 'payments', 'api_keys', or column names that reveal your data model.",
        },
        {
          heading: "What SQL queries can reveal about your system",
          body: "A single SQL query can expose: database table names and column names (your schema), JOIN relationships (your data model), WHERE conditions (your business rules), column types via CAST/CONVERT (your data types), index hints (your performance strategy), and literal values in INSERT/UPDATE statements (your actual data). Keeping queries private means keeping your entire database architecture private.",
        },
      ],
      faqs: [
        {
          question: "Is it safe to format production SQL queries online?",
          answer:
            "With DevBolt, yes. The SQL formatter runs entirely in your browser using a JavaScript parser. Your queries — including table names, column names, and filter conditions — never leave your device.",
        },
        {
          question: "Does DevBolt support all SQL dialects?",
          answer:
            "Yes. The formatter handles MySQL, PostgreSQL, SQLite, SQL Server, Oracle, and standard SQL. All dialect-specific formatting runs client-side in your browser.",
        },
        {
          question: "Can I format SQL containing sensitive data?",
          answer:
            "Yes. Since processing is 100% client-side, it is safe to format queries containing customer data, internal table names, and business logic. Nothing is transmitted or stored.",
        },
      ],
      keywords: [
        "safe sql formatter",
        "private sql formatter",
        "sql formatter no upload",
        "secure sql beautifier",
        "format sql privately",
        "offline sql formatter",
        "sql formatter privacy",
        "client-side sql formatter",
      ],
      parentToolSlug: "sql-formatter",
      parentToolName: "SQL Formatter",
    },
  ],

  "csv-json": [
    {
      slug: "safe",
      title: "Safe CSV to JSON Converter",
      metaTitle: "Safe CSV to JSON Converter — Private, No Data Upload",
      metaDescription:
        "Convert CSV to JSON privately with zero data upload. DevBolt's converter runs in your browser — safe for spreadsheets containing PII, financial data, and customer records.",
      h1: "Safe CSV to JSON Converter — Convert Data Without Uploading It",
      intro:
        "Convert CSV spreadsheets to JSON format with complete privacy. DevBolt parses and converts your CSV data entirely in your browser. Customer records, financial data, and employee information never leave your device.",
      content: [
        {
          heading: "Why CSV converter privacy matters",
          body: "CSV files are the universal data exchange format — and they almost always contain sensitive data. Customer exports from CRMs contain names, emails, and phone numbers. Financial reports contain revenue figures and account numbers. HR exports contain employee salaries and personal details. Database exports contain entire table dumps. When you paste CSV data into a server-based converter, all of this data is transmitted to a third-party server. DevBolt converts CSV to JSON and JSON to CSV entirely in your browser — the data stays on your machine.",
        },
        {
          heading: "Safe for regulated data",
          body: "If you work with GDPR-protected EU customer data, HIPAA-covered health records, PCI-regulated payment information, or FERPA-protected student records, using a server-based converter may constitute a data transfer that requires compliance documentation. DevBolt eliminates this concern entirely: since data never leaves your browser, there is no data transfer, no third-party processing, and no compliance risk. The conversion happens in your device's memory and nowhere else.",
        },
        {
          heading: "How the client-side CSV parser works",
          body: "DevBolt's CSV parser handles quoted fields, embedded commas, newlines within quotes, custom delimiters, and header row detection — all in JavaScript running in your browser. The parser reads the CSV text character by character, builds an array of arrays, and then maps it to JSON objects using the header row as keys. No external service is called at any point in the process.",
        },
      ],
      faqs: [
        {
          question: "Is it safe to convert customer CSV data online?",
          answer:
            "With DevBolt, yes. The CSV parser and JSON converter run entirely in your browser. Customer names, emails, addresses, and any other PII in your spreadsheet are never sent to any server.",
        },
        {
          question: "Does this meet GDPR requirements for data processing?",
          answer:
            "DevBolt does not process your data on any server — the conversion happens locally in your browser. Since there is no data transfer to a third party, the tool avoids the GDPR compliance concerns that apply to server-based converters.",
        },
        {
          question: "Can I convert large CSV files privately?",
          answer:
            "Yes. DevBolt handles CSV files up to several megabytes in your browser. For very large files (50MB+), your browser's memory may be the limiting factor, but no data is ever sent to a server regardless of file size.",
        },
      ],
      keywords: [
        "safe csv to json",
        "private csv converter",
        "csv converter no upload",
        "secure csv to json",
        "csv converter privacy",
        "offline csv to json",
        "safe csv json converter",
        "client-side csv converter",
      ],
      parentToolSlug: "csv-json",
      parentToolName: "CSV ↔ JSON Converter",
    },
  ],

  "regex-tester": [
    {
      slug: "safe",
      title: "Safe Regex Tester",
      metaTitle: "Safe Regex Tester — Test Patterns Privately, No Upload",
      metaDescription:
        "Test regex patterns privately with zero data upload. DevBolt's regex tester runs in your browser — safe for testing patterns against sensitive log data and source code.",
      h1: "Safe Regex Tester — Test Patterns Without Exposing Your Data",
      intro:
        "Test regular expressions against your data with complete privacy. DevBolt's regex tester runs entirely in your browser — your test strings, log data, and source code snippets are never sent to any server.",
      content: [
        {
          heading: "Why regex tester privacy matters",
          body: "When testing regex patterns, you paste real data as test input: log file entries containing IP addresses and usernames, source code with embedded strings and API endpoints, email lists for validation testing, user-submitted form data for pattern matching, and server access logs with authentication details. Server-based regex testers like regex101 transmit your test data to their backend for processing and pattern library features. DevBolt uses JavaScript's native RegExp engine to execute patterns entirely in your browser — your test data stays private.",
        },
        {
          heading: "Safe for testing against production data",
          body: "Building regex patterns for log parsing, data extraction, or input validation often requires testing against real production samples. With DevBolt, you can paste production log entries, real customer data, or internal source code as test input without worrying about data exposure. The regex engine is JavaScript's built-in RegExp — the same engine your production code uses. Results are highlighted in real-time as you type, with zero network involvement.",
        },
        {
          heading: "Client-side regex execution",
          body: "DevBolt creates a JavaScript RegExp object from your pattern and executes it against your test string using the native regex engine. Match results, capture groups, and highlighting are all computed in your browser. There is no server-side regex engine, no pattern saving to a remote database, and no sharing of your test data. You can verify this in the DevTools Network tab.",
        },
      ],
      faqs: [
        {
          question: "Is it safe to test regex against real data?",
          answer:
            "With DevBolt, yes. The regex engine runs entirely in your browser using JavaScript's native RegExp. Your test strings — whether log entries, customer data, or source code — are never transmitted to any server.",
        },
        {
          question: "How is this different from regex101?",
          answer:
            "regex101 is a powerful tool but transmits data to its server for features like pattern libraries and community sharing. DevBolt runs 100% client-side with no server component — simpler, but completely private.",
        },
        {
          question: "Does the regex tester work offline?",
          answer:
            "Yes. After your first visit, DevBolt caches the tool via service worker. You can test regex patterns offline, confirming that no server connection is needed.",
        },
      ],
      keywords: [
        "safe regex tester",
        "private regex tester",
        "regex tester no upload",
        "secure regex tester",
        "regex tester privacy",
        "offline regex tester",
        "safe regex tool",
        "client-side regex tester",
      ],
      parentToolSlug: "regex-tester",
      parentToolName: "Regex Tester",
    },
  ],

  "curl-converter": [
    {
      slug: "safe",
      title: "Safe cURL Converter",
      metaTitle: "Safe cURL to Code Converter — Private, No Data Upload",
      metaDescription:
        "Convert cURL commands to code privately with zero upload. DevBolt runs in your browser — safe for cURL commands containing API keys, auth tokens, and credentials.",
      h1: "Safe cURL Converter — Convert Commands Without Exposing Credentials",
      intro:
        "Convert cURL commands to Python, JavaScript, Go, and more with complete privacy. cURL commands frequently contain API keys, Bearer tokens, and Basic Auth credentials. DevBolt converts them entirely in your browser — credentials never leave your device.",
      content: [
        {
          heading: "Why cURL converter privacy is critical",
          body: "cURL commands are the most dangerous text developers paste into online tools. A typical cURL command includes: Authorization headers with Bearer tokens or Basic Auth credentials, API keys in query parameters or custom headers, cookie values containing session tokens, request bodies with user data or payment information, and internal API endpoint URLs revealing your infrastructure. Converting a cURL command on a server-based tool sends ALL of this — the full authentication credential, the target endpoint, and the payload — to a third party. DevBolt parses and converts cURL commands entirely in your browser.",
        },
        {
          heading: "Safe for production API debugging",
          body: "When debugging API issues, you often copy cURL commands from browser DevTools, Postman, or production logs. These commands contain live credentials. DevBolt converts them to Python requests, JavaScript fetch, Go http, PHP, Ruby, Rust, and Java — all without transmitting the command to any server. The parser handles headers, cookies, data flags, multipart forms, and authentication options locally.",
        },
        {
          heading: "What credentials are embedded in cURL commands",
          body: "Developers routinely paste cURL commands containing: -H 'Authorization: Bearer eyJ...' (JWT access tokens), -H 'X-API-Key: sk_live_...' (Stripe and other API keys), -u 'user:password' (Basic Auth credentials), -b 'session=abc123' (session cookies), -d '{\"credit_card\": \"4242...\"}' (payment data), and internal URLs like https://internal-api.company.com (infrastructure details). Every one of these should remain private.",
        },
      ],
      faqs: [
        {
          question: "Is it safe to convert cURL commands with API keys?",
          answer:
            "With DevBolt, yes. The cURL parser runs entirely in your browser — your API keys, Bearer tokens, and authentication headers are never sent to any server. The conversion to Python, JavaScript, or other languages happens locally.",
        },
        {
          question: "Does DevBolt store or log converted cURL commands?",
          answer:
            "No. DevBolt has no server-side component for the cURL converter. The command is parsed in your browser's memory and the generated code exists only in the output panel. Nothing is stored, logged, or transmitted.",
        },
        {
          question: "Can I convert cURL commands with sensitive request bodies?",
          answer:
            "Yes. Request bodies containing customer data, payment information, or internal business data are processed entirely in your browser. The converter handles -d, --data, --data-raw, and multipart form data — all client-side.",
        },
      ],
      keywords: [
        "safe curl converter",
        "private curl to code",
        "curl converter no upload",
        "secure curl converter",
        "curl converter privacy",
        "safe curl to python",
        "safe curl to javascript",
        "client-side curl converter",
      ],
      parentToolSlug: "curl-converter",
      parentToolName: "cURL to Code Converter",
    },
  ],

  "yaml-formatter": [
    {
      slug: "safe",
      title: "Safe YAML Formatter",
      metaTitle: "Safe YAML Formatter & Validator — Private, No Upload",
      metaDescription:
        "Format and validate YAML privately with zero data upload. DevBolt's YAML tool runs in your browser — safe for Kubernetes manifests, Docker configs, and CI/CD pipelines.",
      h1: "Safe YAML Formatter — Format Configs Without Uploading Them",
      intro:
        "Format and validate YAML with complete privacy. DevBolt's YAML formatter runs entirely in your browser — your Kubernetes manifests, Docker Compose files, CI/CD pipelines, and infrastructure configs are never sent to any server.",
      content: [
        {
          heading: "Why YAML formatter privacy matters",
          body: "YAML is the configuration language of modern infrastructure. Kubernetes manifests contain container image references, environment variables with secrets, and service account configurations. Docker Compose files embed database passwords and API keys as environment variables. GitHub Actions and GitLab CI pipelines reference deployment credentials and cloud provider secrets. Ansible playbooks contain SSH keys and vault passwords. Formatting any of these on a server-based tool sends your infrastructure secrets to a third party. DevBolt formats YAML locally using a JavaScript YAML parser.",
        },
        {
          heading: "Safe for infrastructure-as-code",
          body: "DevOps engineers format and validate YAML daily: Kubernetes Deployments with env vars, Helm values.yaml files with connection strings, Terraform variable files, CloudFormation templates, and ArgoCD application manifests. These files are the keys to your infrastructure. DevBolt's YAML formatter handles multi-document YAML, anchors/aliases, flow vs block style, and custom indentation — all processed in your browser with zero server contact.",
        },
        {
          heading: "Validate YAML syntax privately",
          body: "YAML syntax errors in infrastructure configs can cause deployment failures. DevBolt validates your YAML and reports line-number-specific errors without transmitting the file content. Find indentation issues, missing colons, incorrect quoting, and invalid anchors locally. The validator uses the js-yaml library running in your browser — the same library used by thousands of Node.js applications in production.",
        },
      ],
      faqs: [
        {
          question: "Is it safe to format Kubernetes YAML online?",
          answer:
            "With DevBolt, yes. The YAML formatter runs in your browser — your manifests, including environment variables, secrets, and service configurations, never leave your device. Server-based formatters would receive all of this data.",
        },
        {
          question: "Can I validate Docker Compose files privately?",
          answer:
            "Yes. Paste your docker-compose.yml into DevBolt's YAML formatter to validate syntax and formatting. Environment variables, port mappings, and volume configurations stay in your browser. For Docker-specific validation, try DevBolt's dedicated Docker Compose Validator.",
        },
        {
          question: "Does this support multi-document YAML?",
          answer:
            "Yes. DevBolt handles multi-document YAML files (separated by ---) commonly used in Kubernetes manifests. Each document is formatted and validated independently, all client-side.",
        },
      ],
      keywords: [
        "safe yaml formatter",
        "private yaml formatter",
        "yaml formatter no upload",
        "secure yaml validator",
        "yaml formatter privacy",
        "offline yaml formatter",
        "safe yaml validator",
        "client-side yaml formatter",
      ],
      parentToolSlug: "yaml-formatter",
      parentToolName: "YAML Formatter",
    },
  ],

  "code-security-scanner": [
    {
      slug: "ai-code-review",
      title: "AI Code Security Review",
      metaTitle: "AI Code Security Review — Scan AI-Generated Code for Vulnerabilities",
      metaDescription:
        "Review AI-generated code for security vulnerabilities. Detects common issues in code from ChatGPT, Claude, Copilot, and Cursor — injection, XSS, hardcoded secrets, and more.",
      h1: "AI Code Security Review — Find Vulnerabilities in AI-Generated Code",
      intro:
        "AI coding assistants generate code fast, but 45% of AI-generated code contains security vulnerabilities (Veracode, 2025). This scanner catches the most common security antipatterns before they reach production.",
      content: [
        {
          heading: "Why AI-generated code needs security review",
          body: "AI coding assistants like ChatGPT, Claude, GitHub Copilot, and Cursor generate functional code quickly, but they frequently introduce security vulnerabilities. Common issues include hardcoded API keys and secrets in example code, SQL queries built with string concatenation instead of parameterized queries, innerHTML and eval() usage without sanitization, missing input validation on user-controlled data, and insecure cookie or session configurations. These tools optimize for 'code that works' rather than 'code that is secure.' A dedicated security scan catches these patterns before deployment.",
        },
        {
          heading: "The vibe coding security problem",
          body: "Vibe coding — rapidly building applications with AI assistance — has transformed developer productivity. But speed introduces risk. When you accept AI suggestions without review, you inherit every security shortcut the model made. Production codebases with AI-generated authentication, database queries, and API handlers are particularly vulnerable. This scanner helps you review AI-generated code in seconds: paste the output, see every security issue highlighted with severity, CWE reference, and a specific fix.",
        },
        {
          heading: "Common vulnerabilities in AI-generated JavaScript",
          body: "The most frequent security issues in AI-generated JavaScript and TypeScript code: (1) Hardcoded secrets — AI often generates example API keys and leaves them in the code, (2) SQL injection — string concatenation in queries instead of parameterized statements, (3) XSS — using innerHTML or dangerouslySetInnerHTML with user data, (4) Command injection — passing user input to exec() or spawn(), (5) Insecure randomness — using Math.random() for tokens or session IDs, (6) Missing rate limiting on authentication endpoints. Each of these is detectable with pattern-based analysis.",
        },
      ],
      faqs: [
        {
          question: "What percentage of AI-generated code has security vulnerabilities?",
          answer:
            "According to Veracode's 2025 research, approximately 45% of AI-generated code contains security flaws. The most common issues are hardcoded credentials, injection vulnerabilities, and missing input validation. This rate is higher than human-written code because AI models optimize for functionality over security.",
        },
        {
          question: "Does this scanner send my code to an AI model?",
          answer:
            "No. The scanner uses local regex-based pattern matching in your browser — it does not call any AI API, LLM, or external service. Your code stays on your device. This is a deliberate design choice: code security tools should not introduce their own data exposure risks.",
        },
        {
          question: "Which AI coding tools produce the most vulnerabilities?",
          answer:
            "All AI coding assistants can produce vulnerable code. The risk depends more on the prompt and context than the specific tool. ChatGPT, Claude, Copilot, and Cursor all generate functional code that may include hardcoded secrets, injection-prone queries, and missing input validation. Always review AI-generated code before deploying.",
        },
      ],
      keywords: [
        "ai code security review",
        "ai generated code vulnerabilities",
        "vibe coding security",
        "chatgpt code security",
        "copilot code security",
        "ai code audit",
        "scan ai code for bugs",
        "review ai generated code",
      ],
      parentToolSlug: "code-security-scanner",
      parentToolName: "AI Code Security Scanner",
    },
    {
      slug: "javascript-security",
      title: "JavaScript Security Scanner",
      metaTitle: "JavaScript Security Scanner Online — Find JS Vulnerabilities",
      metaDescription:
        "Scan JavaScript code for security vulnerabilities online. Detects XSS, injection, hardcoded secrets, eval(), prototype pollution, and OWASP Top 10 issues. Free and private.",
      h1: "JavaScript Security Scanner — Detect JS Vulnerabilities Instantly",
      intro:
        "Scan JavaScript code for common security vulnerabilities with a free, client-side static analysis tool. Detects OWASP Top 10 issues including XSS, injection flaws, hardcoded secrets, and insecure patterns.",
      content: [
        {
          heading: "OWASP Top 10 vulnerabilities in JavaScript",
          body: "The OWASP Top 10 lists the most critical web application security risks. In JavaScript applications, the most common are: A01 Broken Access Control (missing authorization checks), A02 Cryptographic Failures (weak hashing, insecure randomness), A03 Injection (SQL, command, NoSQL injection via string concatenation), A04 Insecure Design (missing rate limiting, open redirects), A07 Cross-Site Scripting (innerHTML, document.write, dangerouslySetInnerHTML). This scanner checks for patterns associated with each of these categories.",
        },
        {
          heading: "Client-side vs server-side JavaScript security",
          body: "Client-side JavaScript faces XSS, prototype pollution, and DOM manipulation risks. Server-side Node.js faces injection, path traversal, SSRF, and command execution risks. This scanner covers both contexts — it detects innerHTML and document.write() (browser-specific), as well as exec(), readFile(), and database queries (server-specific). Paste any JavaScript code and get a comprehensive security assessment.",
        },
        {
          heading: "JavaScript-specific security patterns",
          body: "JavaScript has unique security concerns: eval() and new Function() enable arbitrary code execution, prototype pollution through bracket notation can bypass security checks, Math.random() is predictable and should never be used for security, template literals with ${} in database queries enable injection, and the dynamic typing system can be exploited for type confusion attacks. This scanner checks for all of these patterns with specific fix recommendations.",
        },
      ],
      faqs: [
        {
          question: "What JavaScript vulnerabilities does this scanner detect?",
          answer:
            "The scanner detects 20+ vulnerability patterns: hardcoded secrets and API keys, SQL/NoSQL/command injection, XSS via innerHTML and dangerouslySetInnerHTML, SSRF with user-controlled URLs, path traversal in filesystem operations, prototype pollution, eval() and new Function(), insecure cookies, CORS misconfigurations, weak hashing, JWT decode without verify, open redirects, and more.",
        },
        {
          question: "Does this work for TypeScript code?",
          answer:
            "Yes. TypeScript is a superset of JavaScript, so all JavaScript security patterns apply. The scanner analyzes the code as text — it works equally well with .js and .ts files, including React/JSX/TSX components.",
        },
        {
          question: "How accurate is regex-based security scanning?",
          answer:
            "Regex-based scanning catches common vulnerability patterns with high precision but can produce false positives (flagging safe code) and false negatives (missing complex vulnerabilities). It excels at finding hardcoded secrets, obvious injection patterns, and known antipatterns. For data flow analysis, use a full SAST tool like Semgrep or CodeQL.",
        },
      ],
      keywords: [
        "javascript security scanner",
        "js vulnerability scanner",
        "javascript security audit",
        "node.js security scanner",
        "xss scanner javascript",
        "javascript sast tool",
        "scan js code for vulnerabilities",
        "javascript owasp scanner",
      ],
      parentToolSlug: "code-security-scanner",
      parentToolName: "AI Code Security Scanner",
    },
    {
      slug: "hardcoded-secrets-scanner",
      title: "Hardcoded Secrets Scanner",
      metaTitle: "Hardcoded Secrets Scanner — Find API Keys & Credentials in Code",
      metaDescription:
        "Scan code for hardcoded API keys, passwords, tokens, and credentials. Detect secrets before they reach version control. Free, client-side — your code stays private.",
      h1: "Hardcoded Secrets Scanner — Detect Credentials Before They Leak",
      intro:
        "Find hardcoded API keys, passwords, tokens, and credentials in your code before they reach Git. Detects AWS keys, API secrets, database passwords, and authentication tokens using pattern matching — all in your browser.",
      content: [
        {
          heading: "The hardcoded secrets problem",
          body: "Hardcoded credentials are the most common and most dangerous security vulnerability in source code. GitGuardian's 2025 report found over 12 million new secrets exposed in public GitHub repositories in a single year. Once a secret is committed to Git, it exists in the repository history forever — even if deleted from the current codebase. Leaked AWS keys can be exploited within minutes by automated scanners. This tool catches secrets before they enter version control.",
        },
        {
          heading: "What secrets this scanner detects",
          body: "The scanner identifies: API keys with common naming patterns (api_key, apiKey, secret_key, client_secret), AWS access key IDs (AKIA prefix), authentication tokens (auth_token, access_token, bearer tokens), database passwords (password, passwd, DB_PASSWORD), private keys and client secrets, and hardcoded connection strings with embedded credentials. Each finding includes the exact line number and a recommendation to move the secret to environment variables.",
        },
        {
          heading: "Best practices for managing secrets",
          body: "Never hardcode secrets in source code. Use environment variables (process.env.API_KEY), a secrets manager (AWS Secrets Manager, HashiCorp Vault, Doppler), or a .env file that is listed in .gitignore. Add a pre-commit hook (git-secrets, detect-secrets) to catch leaked credentials automatically. Rotate any credential that has ever been committed to a repository, even if removed — it exists in Git history. Use this scanner as a quick check before committing.",
        },
      ],
      faqs: [
        {
          question: "What types of secrets does this scanner detect?",
          answer:
            "The scanner detects API keys, secret keys, passwords, authentication tokens, AWS access key IDs (AKIA prefix), client secrets, database credentials, and any string assigned to variables with common credential naming patterns. It uses regex pattern matching to identify secrets regardless of the programming language.",
        },
        {
          question: "Is this scanner safe for checking code with real secrets?",
          answer:
            "Yes. The scanner runs 100% in your browser — your code and any secrets it contains are never transmitted to any server. This is the safest way to check for hardcoded credentials online, because the detection tool itself does not create an exposure risk.",
        },
        {
          question: "How do I fix hardcoded secrets in my code?",
          answer:
            "Replace hardcoded values with environment variable references (process.env.API_KEY in Node.js, os.environ in Python). Store actual values in a .env file excluded from Git via .gitignore, or use a secrets manager. If the secret was ever committed to Git, rotate it immediately — deletion from the current code does not remove it from Git history.",
        },
      ],
      keywords: [
        "hardcoded secrets scanner",
        "find api keys in code",
        "detect credentials in code",
        "secret scanning tool",
        "find passwords in source code",
        "api key scanner",
        "credential detection",
        "pre-commit secret scanner",
      ],
      parentToolSlug: "code-security-scanner",
      parentToolName: "AI Code Security Scanner",
    },
  ],
};
