import type { FAQ } from "./tool-faqs";

export const toolFaqsBatch4: Record<string, FAQ[]> = {
  "date-format-tester": [
    {
      question: "What is the difference between strftime and date-fns format tokens?",
      answer:
        "Strftime uses percent-based tokens like %Y for four-digit year and %m for zero-padded month, originating from C and used in Python, Ruby, and PHP. Date-fns uses letter-based tokens like yyyy and MM, following Unicode CLDR patterns also used by Java's DateTimeFormatter. The key confusion point is case sensitivity: in date-fns, MM is month while mm is minutes, and yyyy is calendar year while YYYY is week-numbering year. Strftime avoids this ambiguity since each token is a unique percent-letter pair. A date format tester lets you compare outputs across libraries simultaneously so you can verify your pattern produces the correct result before deploying.",
    },
    {
      question: "How do I format dates in Go using time.Format?",
      answer:
        "Go uses a reference time approach instead of abstract tokens. The reference time is Mon Jan 2 15:04:05 MST 2006, and you write your desired format using those specific values. For example, 2006-01-02 produces an ISO date like 2025-03-19, and 3:04 PM produces a 12-hour time. The numbers are not arbitrary: 1 is month, 2 is day, 3 is hour (12h), 4 is minutes, 5 is seconds, 6 is year, and 7 is timezone offset. This design eliminates the need to memorize token characters but can be confusing at first. Testing with a live preview tool helps verify your Go format string produces the expected output.",
    },
    {
      question: "How do I display timezone offsets in date format strings?",
      answer:
        "Timezone formatting varies significantly across libraries. In strftime, %z gives a numeric offset like +0530 and %Z gives the abbreviation like EST. In date-fns, the tokens are xxx for an offset with colon like +05:30 and zzz for the abbreviated name. Java uses XXX for ISO offset with colon and z for short timezone name. Go uses -0700 for numeric offset and MST for abbreviation in its reference time system. A common mistake is confusing timezone abbreviations, which are ambiguous and not standardized, with numeric offsets, which are unambiguous. For APIs and data storage, always prefer ISO 8601 format with numeric offset or store times in UTC.",
    },
  ],
  "json-mock-generator": [
    {
      question: "How do I generate realistic fake JSON data for API testing?",
      answer:
        "Use a JSON mock data generator that supports typed field definitions. Define your schema by specifying field names and their data types such as firstName, email, uuid, date, or integer with min/max ranges. The generator produces randomized but realistic values using libraries like Faker.js patterns. Most generators support 30 or more field types including addresses, phone numbers, company names, URLs, and IP addresses. You can set the number of records to generate, nest objects, and create arrays. This approach is faster and more realistic than manually writing test fixtures, and it ensures your test data covers edge cases like special characters in names or varying string lengths.",
    },
    {
      question: "What field types are available for mock JSON generation?",
      answer:
        "Common field types include string primitives like firstName, lastName, fullName, email, username, and password. Numeric types include integer, float, and price with configurable ranges. Date types support ISO 8601 timestamps, past dates, future dates, and Unix epochs. Network types include IPv4, IPv6, URL, domain, and MAC address. Location types cover street address, city, state, country, zipCode, latitude, and longitude. Identifier types include UUID, MongoDB ObjectId, and auto-incrementing ID. Boolean and enum types let you generate random true/false values or pick from a defined set. Some generators also support credit card numbers, IBAN codes, color hex values, and file paths.",
    },
    {
      question: "What is the difference between mock data and fixture data?",
      answer:
        "Mock data is dynamically generated with random but realistic values, useful for load testing, populating development databases, and testing with varied inputs. Fixture data is static, hand-crafted test data stored in files, useful for deterministic unit tests where you need predictable inputs and outputs. Mock data excels at finding edge cases you might not anticipate because the randomization produces diverse combinations. Fixtures excel at reproducibility since the same test always uses identical data. In practice, most projects use both: fixtures for unit tests that assert specific values, and generated mock data for integration tests, UI prototyping, and performance testing. Seed-based generators can bridge the gap by producing consistent random data from a fixed seed.",
    },
  ],
  "readme-generator": [
    {
      question: "What sections should a good GitHub README include?",
      answer:
        "A well-structured GitHub README should include a project title with a brief description, badges showing build status and version, an installation section with step-by-step commands, a usage section with code examples, and a license declaration. Beyond these essentials, popular additions include a features list, screenshots or demo GIFs, a configuration section, API documentation or links to docs, a contributing guide, a changelog reference, and acknowledgments. The key principle is progressive disclosure: lead with what the project does and how to install it, then provide deeper details for users who need them. Projects with more than a few contributors should also include a code of conduct and issue templates reference.",
    },
    {
      question: "How do I add badges to my GitHub README?",
      answer:
        "Badges are small status images typically placed at the top of a README, rendered using services like shields.io. The Markdown syntax is ![alt](image-url) optionally wrapped in a link. Common badges include build status from GitHub Actions using the URL pattern github.com/user/repo/actions/workflows/ci.yml/badge.svg, npm version from img.shields.io/npm/v/package, license type, code coverage percentage, and download counts. Shields.io supports static and dynamic badges with customizable colors and labels. You can also create custom badges by using the pattern img.shields.io/badge/label-message-color. Keep badge count reasonable, typically three to six, to avoid visual clutter at the top of your README.",
    },
    {
      question: "How do I write a good project description for my README?",
      answer:
        "Start with a single sentence that explains what the project does and who it is for, avoiding jargon when possible. Follow with two to three sentences covering the key problem it solves, what makes it different from alternatives, and any notable technical characteristics. For example, instead of writing a modular extensible framework for data processing, write a Python library that cleans messy CSV files in one line of code, 10x faster than pandas for files under 1GB. Include a brief code snippet or command showing the simplest possible usage. If your project has a visual component, add a screenshot immediately after the description. This section is the most important part of your README since most visitors decide whether to continue reading based on the first paragraph.",
    },
  ],
  "dockerfile-validator": [
    {
      question: "What are common Dockerfile best practices?",
      answer:
        "Key Dockerfile best practices include using specific base image tags instead of latest to ensure reproducible builds, combining RUN commands with && to reduce image layers, placing frequently changing instructions like COPY near the end to maximize layer caching, and running as a non-root user with the USER directive. Always use COPY instead of ADD unless you specifically need URL fetching or tar extraction. Include a .dockerignore file to exclude node_modules, .git, and other unnecessary files from the build context. Use multi-stage builds to separate build dependencies from the runtime image, which significantly reduces final image size. Set WORKDIR instead of using cd commands, and prefer exec form CMD [\"node\", \"app.js\"] over shell form.",
    },
    {
      question: "What is the difference between CMD and ENTRYPOINT in a Dockerfile?",
      answer:
        "CMD sets the default command that runs when a container starts but can be completely overridden by passing arguments to docker run. ENTRYPOINT sets the main executable that always runs and cannot be easily overridden. When both are used together, CMD provides default arguments to the ENTRYPOINT. For example, ENTRYPOINT [\"python\"] with CMD [\"app.py\"] runs python app.py by default, but docker run myimage script.py would run python script.py instead. Use ENTRYPOINT when your container should always run a specific program, and CMD when you want flexible default behavior. Both support shell form (CMD node app.js) and exec form (CMD [\"node\", \"app.js\"]), but exec form is preferred because it handles signals properly.",
    },
    {
      question: "How do I reduce Docker image size?",
      answer:
        "Multi-stage builds are the most effective technique. Use a full SDK image for building and copy only the compiled output to a minimal runtime image like alpine or distroless. For Node.js, run npm ci --omit=dev in the final stage to exclude development dependencies. For Go, compile a static binary and use FROM scratch for a minimal image. Chain RUN commands with && and end with rm -rf /var/lib/apt/lists/* to clean up package manager caches in the same layer. Use .dockerignore to exclude tests, documentation, and local configuration from the build context. Choose alpine variants of base images when possible, as they are typically 5 to 50 MB compared to hundreds of megabytes for full Debian-based images. Review layers with docker history to identify size offenders.",
    },
  ],
  "k8s-validator": [
    {
      question: "What are required fields in a Kubernetes manifest?",
      answer:
        "Every Kubernetes manifest requires four top-level fields: apiVersion specifying the API group and version like apps/v1, kind specifying the resource type like Deployment or Service, metadata containing at least a name field, and spec defining the desired state. For Deployments, the spec must include a selector with matchLabels, a replicas count, and a template with its own metadata and spec containing at least one container with name and image fields. Services require a selector to match pod labels, ports with port and targetPort, and a type like ClusterIP or LoadBalancer. Omitting required fields causes cryptic validation errors on apply, so validating manifests locally before deploying saves significant debugging time.",
    },
    {
      question: "How do I set resource limits in Kubernetes?",
      answer:
        "Resource limits are set in the container spec under resources with two subsections: requests, the minimum guaranteed resources, and limits, the maximum allowed resources. CPU is specified in cores or millicores, such as 500m for half a core. Memory is specified in bytes with suffixes like 128Mi for mebibytes or 1Gi for gibibytes. A common starting point is requests of 100m CPU and 128Mi memory with limits of 500m CPU and 512Mi memory, adjusted based on actual usage. Always set both requests and limits. Without requests, the scheduler cannot make informed placement decisions. Without limits, a single container can consume all node resources and cause evictions. Use kubectl top pods to observe actual resource consumption and tune values accordingly.",
    },
    {
      question: "What security settings should I validate in Kubernetes manifests?",
      answer:
        "Critical security settings include setting securityContext.runAsNonRoot to true and runAsUser to a non-zero UID to prevent containers from running as root. Set readOnlyRootFilesystem to true and explicitly drop all capabilities with drop: [ALL], adding back only required ones. Avoid using privileged: true or hostNetwork: true unless absolutely necessary. Set automountServiceAccountToken to false for pods that do not need Kubernetes API access. Use NetworkPolicies to restrict pod-to-pod communication. Always pull images from trusted registries and specify image digests or exact tags rather than latest. Validate that no secrets are hardcoded in environment variables by using Secret references or external secret managers instead of plain-text values in manifests.",
    },
  ],
  "robots-generator": [
    {
      question: "What is the correct format for a robots.txt file?",
      answer:
        "A robots.txt file consists of one or more rule groups, each starting with a User-agent directive specifying which crawler the rules apply to, followed by Allow and Disallow directives for URL paths. User-agent: * applies rules to all crawlers. Disallow: /admin/ blocks the admin directory, while Allow: /admin/public/ creates an exception within it. An empty Disallow: directive means allow everything. The file must be placed at the site root, accessible at domain.com/robots.txt. Each directive goes on its own line, and groups are separated by blank lines. The Sitemap directive can appear anywhere and points crawlers to your XML sitemap. Robots.txt is a voluntary protocol and does not enforce access control, so never rely on it to protect sensitive data.",
    },
    {
      question: "How do I block AI crawlers in robots.txt?",
      answer:
        "To block AI training crawlers, add User-agent directives for known bot names. Common AI crawler identifiers include GPTBot for OpenAI, Google-Extended for Google AI training, anthropic-ai for Anthropic, CCBot for Common Crawl used by many AI companies, and Bytespider for ByteDance. For each, set Disallow: / to block all pages. Note that User-agent names are case-sensitive and must match exactly. Some AI companies have introduced additional bot names, so check their documentation for current identifiers. Be aware that blocking Google-Extended only prevents AI training use while still allowing regular Google Search indexing via Googlebot. Robots.txt compliance is voluntary, so some scrapers may ignore your directives entirely. Consider supplementing with HTTP headers and meta tags for additional protection.",
    },
    {
      question: "What is the difference between Disallow and noindex?",
      answer:
        "Disallow in robots.txt tells crawlers not to fetch or crawl a URL, but it does not prevent the page from appearing in search results if other pages link to it. The page can still show up with a URL-only listing. The noindex directive, set via a meta robots tag or X-Robots-Tag HTTP header, tells search engines not to include the page in their index at all. However, the crawler must be able to access the page to see the noindex tag, so using both Disallow and noindex together is counterproductive. If you want a page completely excluded from search results, use noindex without Disallow. If you want to save crawl budget by preventing access to low-value pages, use Disallow. For maximum exclusion, use noindex and let crawlers access the page.",
    },
  ],
  "openapi-validator": [
    {
      question: "What is the difference between OpenAPI 3.0 and Swagger 2.0?",
      answer:
        "OpenAPI 3.0 is the successor to Swagger 2.0 with several structural changes. The top-level swagger: 2.0 field became openapi: 3.0.x. Host, basePath, and schemes were consolidated into a servers array supporting multiple URLs with variables. The definitions section moved under components/schemas, and security definitions moved to components/securitySchemes. Request bodies are now defined separately from parameters using a requestBody object with content type mappings, instead of using in: body parameters. OpenAPI 3.0 added support for oneOf, anyOf, and allOf composition keywords, callbacks for webhooks, and links for describing relationships between operations. Most new projects should use OpenAPI 3.0 or 3.1, as tooling support is now mature and the specification is more expressive.",
    },
    {
      question: "How do I validate an OpenAPI specification?",
      answer:
        "Validation checks an OpenAPI spec at multiple levels: structural validity ensures required fields like openapi, info, and paths exist with correct types; reference resolution verifies all $ref pointers resolve to valid targets; semantic validation checks that parameter names are unique per operation, response codes are valid HTTP status codes, and security schemes are properly referenced. Online validators and CLI tools like spectral or swagger-cli perform these checks automatically. Common errors include missing required description fields, invalid JSON Schema types in schemas, duplicate operationId values, and circular references that some generators cannot handle. Validating during CI prevents publishing broken API documentation and catches incompatibilities before client SDK generation.",
    },
    {
      question: "What are best practices for writing OpenAPI specifications?",
      answer:
        "Use descriptive operationId values that match your code's function names since code generators use them directly. Add summary and description to every operation and schema property. Define reusable schemas under components/schemas and reference them with $ref instead of duplicating definitions. Use appropriate HTTP status codes and define error response schemas consistently across endpoints. Include example values for request bodies and responses to improve documentation readability. Tag operations logically to group related endpoints. Use enum types for fields with a fixed set of values. Define security schemes at the component level and apply them globally or per-operation as needed. Version your API in the servers URL and keep the info.version field updated to reflect the current contract version.",
    },
  ],
  "zod-schema": [
    {
      question: "What is Zod and why should I use it for validation?",
      answer:
        "Zod is a TypeScript-first schema validation library that lets you define schemas and automatically infer TypeScript types from them, eliminating the need to maintain separate type definitions and runtime validators. You define a schema like z.object({ name: z.string(), age: z.number().min(0) }) and extract the type with z.infer<typeof schema>. Zod validates data at runtime and returns detailed error messages when validation fails. It supports complex types including unions, intersections, recursive schemas, transformations, and refinements with custom logic. Compared to alternatives like Joi or Yup, Zod has better TypeScript integration, smaller bundle size, and a more composable API. It is widely used in Next.js, tRPC, and React Hook Form projects for both client and server validation.",
    },
    {
      question: "How do I generate a Zod schema from existing JSON data?",
      answer:
        "Paste your JSON data into a Zod schema generator, which analyzes the structure and infers appropriate Zod types. It maps JSON strings to z.string(), numbers to z.number(), booleans to z.boolean(), arrays to z.array(), and nested objects to z.object(). Advanced generators detect common patterns like email addresses, URLs, UUIDs, and ISO dates, applying format-specific validations like z.string().email() or z.string().url() automatically. Nullable fields are wrapped with z.nullable() and optional fields with z.optional(). For arrays, the generator inspects all elements to determine the most specific shared type. Review the generated schema and add constraints like min, max, regex patterns, and custom refinements that cannot be inferred from data alone.",
    },
    {
      question: "What is the difference between z.optional and z.nullable in Zod?",
      answer:
        "z.optional() makes a field accept undefined or be omitted entirely from the object, producing a TypeScript type of T | undefined. z.nullable() makes a field accept null as a value, producing T | null. These can be combined: z.string().nullable().optional() accepts string, null, or undefined. In practice, optional is used for fields that may not be present in the input object, like optional form fields. Nullable is used for fields that exist but may have no value, common in database records where columns allow NULL. When parsing API responses, use nullable for JSON fields that return null and optional for fields that may be missing from the response entirely. Zod also provides z.nullish() as shorthand for nullable plus optional.",
    },
  ],
  "placeholder-image": [
    {
      question: "How do I generate placeholder images for web prototyping?",
      answer:
        "Use a placeholder image generator to create images with specific dimensions, background colors, text overlays, and formats. Specify width and height in pixels, choose a background and text color, and optionally add label text showing the dimensions or a custom message. Common sizes include 1200x630 for social media cards, 800x600 for content images, 150x150 for avatars, and 1920x1080 for hero banners. Generated images can be downloaded as PNG, JPEG, SVG, or WebP. For development, placeholder images help establish layout proportions and identify spacing issues before final assets are ready. They are preferable to using random stock photos during prototyping because they clearly indicate where real content needs to be added.",
    },
    {
      question: "What image dimensions should I use for common web layouts?",
      answer:
        "Standard web image dimensions vary by use case. Hero banners are typically 1920x1080 or 1440x600 pixels. Blog featured images are commonly 1200x630, which also works well for Open Graph social sharing. Product thumbnails are usually 300x300 or 400x400 square. User avatars range from 48x48 for small displays to 200x200 for profile pages. Logo placements are typically 200x50 to 300x100 for horizontal logos. Mobile app screenshots for stores are 1284x2778 for iPhone and 1080x1920 for Android. Card components in grids commonly use 16:9 aspect ratio at 400x225 or 4:3 at 400x300. Always provide images at 2x resolution for retina displays, so a 300x300 display size needs a 600x600 source image.",
    },
    {
      question: "What is the difference between PNG, JPEG, WebP, and SVG for placeholder images?",
      answer:
        "PNG supports transparency and lossless compression, making it ideal for logos, icons, and images with text or sharp edges. File sizes are larger than JPEG for photographs. JPEG uses lossy compression optimized for photographs and complex gradients, producing small files but introducing artifacts around sharp edges and text. WebP supports both lossy and lossless compression with transparency, typically producing files 25-30% smaller than JPEG at equivalent quality, and is supported by all modern browsers. SVG is a vector format that scales to any resolution without quality loss, perfect for simple placeholder shapes and text overlays with the smallest file size. For placeholder images with solid colors and text, SVG or PNG produces the crispest results while WebP offers the best size-to-quality ratio.",
    },
  ],
  "nginx-config": [
    {
      question: "How do I set up an nginx reverse proxy?",
      answer:
        "An nginx reverse proxy forwards client requests to a backend server using the proxy_pass directive inside a location block. A basic configuration includes a server block listening on port 80 or 443 with a server_name matching your domain, and a location / block containing proxy_pass http://localhost:3000 pointing to your application. Essential proxy headers to include are proxy_set_header Host $host to preserve the original hostname, X-Real-IP $remote_addr for the client IP, X-Forwarded-For $proxy_add_x_forwarded_for for proxy chains, and X-Forwarded-Proto $scheme so the backend knows if the original request was HTTPS. Add proxy_http_version 1.1 and Upgrade headers if your application uses WebSockets. For multiple backend servers, define an upstream block for load balancing.",
    },
    {
      question: "How do I configure SSL/TLS in nginx?",
      answer:
        "Configure SSL by adding listen 443 ssl to your server block along with ssl_certificate and ssl_certificate_key directives pointing to your certificate and private key files. Use certificates from Let's Encrypt with Certbot for free automated SSL. Set ssl_protocols to TLSv1.2 TLSv1.3 to disable older insecure versions. Configure ssl_ciphers with a modern cipher suite and enable ssl_prefer_server_ciphers on. Add a separate server block listening on port 80 that returns a 301 redirect to the HTTPS version. Enable HSTS by adding the Strict-Transport-Security header with a max-age of at least 31536000 seconds. For performance, enable ssl_session_cache shared:SSL:10m and ssl_session_timeout of 10 minutes to reduce TLS handshake overhead for returning visitors.",
    },
    {
      question: "How do I enable gzip compression in nginx?",
      answer:
        "Enable gzip compression by adding gzip on in the http block of your nginx configuration. Set gzip_types to specify which MIME types to compress, commonly including text/plain, text/css, application/json, application/javascript, text/xml, application/xml, and image/svg+xml. Do not compress already-compressed formats like JPEG, PNG, or gzip archives. Set gzip_min_length to 256 or 1000 bytes to skip compressing tiny responses where the overhead is not worthwhile. Use gzip_comp_level between 4 and 6 for a good balance of compression ratio and CPU usage. Enable gzip_vary on to send the Vary: Accept-Encoding header for proper CDN and proxy caching behavior. Add gzip_proxied any to compress responses from proxied backends. These settings typically reduce text-based response sizes by 60 to 80 percent.",
    },
  ],
  "env-validator": [
    {
      question: "What is the correct syntax for .env files?",
      answer:
        "A .env file contains key-value pairs in the format KEY=value, one per line. Values can be unquoted, single-quoted to preserve literal text, or double-quoted to support escape sequences like newlines. Comments start with # and blank lines are ignored. Keys conventionally use UPPER_SNAKE_CASE. There should be no spaces around the equals sign in most parsers, though some are lenient. Multiline values require double quotes with literal newlines or \\n escape sequences. Do not use export prefixes unless your parser supports them, as many do not. Common issues include trailing whitespace in values, mismatched quotes, and using single quotes when you need escape sequence processing. Always add .env to your .gitignore file to prevent committing secrets to version control.",
    },
    {
      question: "How do I prevent secrets from leaking in .env files?",
      answer:
        "First, add .env and all environment-specific variants like .env.local and .env.production to .gitignore before creating them. Check your git history to ensure no .env files were previously committed, and use git filter-branch or BFG Repo-Cleaner to purge them if found. Create an .env.example file with placeholder values committed to the repository so team members know which variables are needed without exposing real values. Use a secrets manager like AWS Secrets Manager, HashiCorp Vault, or Doppler for production secrets instead of .env files. Never prefix secrets with NEXT_PUBLIC_ or VITE_ as those prefixes expose values to client-side bundles. Review CI/CD logs to ensure environment variables are masked and not printed during builds.",
    },
    {
      question: "What should I check when validating .env files?",
      answer:
        "Validate for syntax errors including missing values, mismatched quotes, spaces around equals signs, and invalid key names containing special characters. Check for duplicate keys where the last definition silently overrides earlier ones. Verify required variables are present by comparing against an .env.example template. Flag potential security risks like private keys, passwords, or tokens that appear to be placeholder or default values such as password123 or changeme. Detect values that should be quoted but are not, particularly those containing spaces or special characters. Check for references to undefined variables if your parser supports variable expansion. Validate URL-formatted values for correct syntax and port numbers for valid ranges. Warn about keys prefixed with NEXT_PUBLIC_ or REACT_APP_ that contain sensitive-looking values since those are exposed to browsers.",
    },
  ],
  "file-hash": [
    {
      question: "What is the difference between MD5, SHA-1, and SHA-256?",
      answer:
        "MD5 produces a 128-bit hash and is fast but cryptographically broken, meaning collisions can be deliberately created. Use it only for non-security checksums like verifying file downloads against a known hash. SHA-1 produces a 160-bit hash and is also considered insecure after practical collision attacks were demonstrated in 2017. SHA-256, part of the SHA-2 family, produces a 256-bit hash and remains cryptographically secure for all current applications. SHA-384 and SHA-512 produce longer hashes with similar security margins. For file integrity verification, SHA-256 is the standard recommendation. For password hashing, none of these are appropriate since you should use bcrypt, scrypt, or Argon2 instead, as those are deliberately slow to resist brute-force attacks.",
    },
    {
      question: "How do I verify a file's integrity using a hash?",
      answer:
        "Download both the file and its published hash value, typically provided as a .sha256 or .md5 file or listed on the download page. Compute the hash of your downloaded file using a tool that supports the same algorithm. Compare your computed hash with the published hash character by character. If they match exactly, the file has not been corrupted or tampered with during transfer. Even a single bit change in the file produces a completely different hash value. On the command line, use sha256sum on Linux, shasum -a 256 on macOS, or Get-FileHash in PowerShell on Windows. A browser-based file hash tool lets you drag and drop the file to compute hashes without installing anything or running terminal commands.",
    },
    {
      question: "Can two different files produce the same hash?",
      answer:
        "Theoretically yes, this is called a collision, where two different inputs produce identical hash output. Since hash functions map infinite possible inputs to a fixed-size output, collisions must mathematically exist. However, for secure hash algorithms like SHA-256, finding a collision by brute force would require approximately 2^128 operations, which is computationally infeasible with current or foreseeable technology. For MD5 and SHA-1, researchers have demonstrated practical collision attacks where specially crafted files produce identical hashes, which is why these algorithms are deprecated for security purposes. For accidental collisions from random corruption, the probability is astronomically small for any algorithm, roughly 1 in 2^128 for MD5 and 1 in 2^256 for SHA-256, making hash verification reliable for detecting data corruption.",
    },
  ],
  "ascii-art": [
    {
      question: "How do I add ASCII art text to source code comments?",
      answer:
        "Generate the ASCII art text using a font style that renders well in monospaced code editors, then wrap each line with your language's comment syntax. For JavaScript or TypeScript, prefix each line with //. For Python, use # on each line or wrap in triple quotes. For CSS, wrap the entire block in /* */. Many ASCII art generators include a comment wrapping option that automatically adds the appropriate syntax for your language. Keep banner text short, ideally one or two words, to avoid excessively wide comment blocks that extend beyond typical editor widths of 80 to 120 columns. Common uses include section headers in large files, startup banners in CLI tools, and license headers that stand out visually when scrolling through code.",
    },
    {
      question: "What are the most readable ASCII art font styles?",
      answer:
        "The most readable fonts for code and terminal use are Banner, Standard, and Big, which use simple block characters that render clearly at any terminal width. Banner produces tall single-stroke letters that are easy to read but take significant vertical space. Standard is the default in most generators and provides a good balance of readability and compactness. Big uses thicker characters for higher visibility. Avoid decorative fonts like Script or Shadow for functional use as they can be difficult to read in narrow terminals and are harder for screen readers to process. For very compact needs, Small and Mini fonts reduce the line count per character to three or four lines. Test your chosen font in your actual terminal or editor to ensure it renders correctly with your font settings.",
    },
    {
      question: "What characters are used to create ASCII art?",
      answer:
        "Traditional ASCII art uses the 95 printable ASCII characters from the standard set, primarily letters, numbers, symbols like @ # $ % and structural characters like | / \\ _ and -. Block-style ASCII art fonts rely heavily on underscores, forward slashes, backslashes, and pipes to construct letter shapes. Shading techniques use characters ordered by visual density: a space is lightest, then period, colon, equals, plus, hash, and @ sign as the darkest. Modern terminals and editors supporting Unicode expand the palette with box-drawing characters, block elements like full and half blocks, and Braille patterns for higher resolution rendering. For maximum compatibility across systems and fonts, stick to basic ASCII characters since Unicode characters may render differently depending on the monospaced font and terminal emulator in use.",
    },
  ],
  "regex-generator": [
    {
      question: "How do I write a regex to validate email addresses?",
      answer:
        "A practical email regex that covers the vast majority of real-world addresses is ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$ which checks for one or more valid local part characters, an @ symbol, a domain with dots, and a top-level domain of at least two letters. The full RFC 5322 specification allows many uncommon characters including quoted strings with spaces and comments, making a perfectly compliant regex extremely complex and impractical. For production systems, use a simple regex for basic format checking, then verify the address actually exists by sending a confirmation email. Most validation libraries include a well-tested email pattern. Overly strict regex patterns can reject valid addresses with newer TLDs, plus addressing, or internationalized domain names.",
    },
    {
      question: "What is the difference between greedy and lazy regex quantifiers?",
      answer:
        "Greedy quantifiers (*, +, {n,m}) match as many characters as possible while still allowing the overall pattern to succeed. Lazy quantifiers (*?, +?, {n,m}?) match as few characters as possible. For example, given the input <b>hello</b><b>world</b>, the greedy pattern <b>.*</b> matches the entire string from the first <b> to the last </b>, while the lazy pattern <b>.*?</b> matches just <b>hello</b>. Greedy matching is the default in most regex engines. Use lazy quantifiers when you want the shortest possible match, which is common when extracting content between delimiters. Performance-wise, greedy matching backtracks from the end while lazy matching expands from the start, and one may be significantly faster than the other depending on input patterns.",
    },
    {
      question: "How do I match text across multiple lines with regex?",
      answer:
        "By default, the dot character matches any character except newlines, and ^ and $ match the start and end of the entire string. Two flags modify this behavior. The s flag, called dotAll or single-line mode, makes the dot match newline characters, so .* can span multiple lines. The m flag, called multiline mode, makes ^ and $ match the start and end of each line within the string, not just the entire string. These can be combined: with both s and m enabled, .* matches across lines while ^ still anchors to line beginnings. An alternative to the s flag is using [\\s\\S]* which matches any character including newlines regardless of flags. In JavaScript, these are set as /pattern/ms or via the RegExp constructor flags argument.",
    },
  ],
  "token-counter": [
    {
      question: "How do LLM tokens work and why do they matter?",
      answer:
        "LLM tokens are chunks of text that language models process as individual units, typically ranging from one character to one whole word. Common English words like the or and are single tokens, while longer or uncommon words are split into multiple tokens. A rough estimate is that one token equals about 0.75 English words, or about 4 characters. Tokens matter because LLM pricing is calculated per token for both input and output, and every model has a maximum context window measured in tokens. If your prompt plus expected response exceeds the context window, the request will fail or the model will truncate input. Understanding token counts helps you estimate API costs, optimize prompt length, and choose the right model for your use case. Code typically uses more tokens per semantic unit than prose.",
    },
    {
      question: "What is the difference between input tokens and output tokens?",
      answer:
        "Input tokens are the tokens in your prompt including system instructions, conversation history, and the current user message. Output tokens are the tokens the model generates in its response. Most API providers charge different rates for each, with output tokens typically costing two to four times more than input tokens because generation is more computationally expensive than processing. For example, GPT-4o charges less per input token than per output token. When estimating API costs, count your prompt tokens as input cost and estimate the expected response length for output cost. Long system prompts contribute to input token costs on every request, so keeping them concise saves money. Some providers also count special tokens like message delimiters and function definitions against your input token budget.",
    },
    {
      question: "How do I reduce token usage to lower LLM API costs?",
      answer:
        "Start by trimming system prompts to remove redundant instructions and verbose examples. Use concise phrasing: say list 5 items instead of please provide me with a list of five items. For conversation applications, implement a sliding context window that drops older messages instead of sending the entire history with each request. Summarize long documents before including them as context rather than sending raw text. Use structured output formats like JSON which are typically more token-efficient than verbose prose responses. Choose the right model size for each task since simpler tasks may not need the largest model. Cache frequent identical requests to avoid redundant API calls. For code generation, providing a focused code snippet is cheaper than sending an entire file. Monitor token usage per request to identify unexpectedly expensive patterns.",
    },
  ],
  "ai-model-comparison": [
    {
      question: "What are the main differences between GPT-4o, Claude, and Gemini?",
      answer:
        "GPT-4o from OpenAI offers strong general-purpose performance with native multimodal input including images, audio, and video, plus fast response times and wide third-party integration. Claude from Anthropic emphasizes longer context windows up to 200K tokens, careful instruction following, and strong performance on analysis and writing tasks. Gemini from Google provides large context windows up to 1M or 2M tokens, native integration with Google services, and competitive pricing especially for the Flash variants. Each model family includes multiple tiers from small and fast to large and capable. Performance varies by task type, so the best choice depends on your specific use case, required context length, budget, latency requirements, and whether you need features like function calling, vision, or code execution.",
    },
    {
      question: "How do I choose the right LLM for my application?",
      answer:
        "Evaluate models across five dimensions: capability, which is how well it performs your specific task; context window, which is the maximum input size it can handle; latency, which is how quickly it responds; cost per token for your expected volume; and API features like function calling, streaming, vision, and fine-tuning support. Start by testing your most important prompts across multiple models to compare output quality. For high-volume applications, smaller models like GPT-4o-mini or Claude Haiku provide 80-90% of the quality at a fraction of the cost. For complex reasoning or long-document analysis, use the largest models. Consider a routing approach where simple queries go to cheap fast models and complex queries go to capable expensive ones. Check rate limits and availability guarantees since these vary significantly between providers and pricing tiers.",
    },
    {
      question: "What does context window size mean for LLM usage?",
      answer:
        "The context window is the maximum number of tokens a model can process in a single request, including both your input prompt and the generated output. A 128K context window means the total of your system prompt, conversation history, any documents or data you include, and the model's response must fit within 128,000 tokens. Larger context windows enable processing longer documents, maintaining longer conversation histories, and including more examples in few-shot prompts. However, larger contexts cost more per request and may increase latency. Not all information within the context window is utilized equally since some models show degraded recall for information in the middle of very long contexts, known as the lost in the middle effect. For most applications, optimizing what you include in the context is more effective than simply using the largest available window.",
    },
  ],
  "git-command-builder": [
    {
      question: "What is the difference between git merge and git rebase?",
      answer:
        "Git merge creates a new merge commit that combines two branches, preserving the complete history of both branches including the point where they diverged. Git rebase replays your branch's commits on top of another branch, creating new commits with the same changes but different hashes, resulting in a linear history without merge commits. Merge is safer for shared branches because it does not rewrite history, while rebase produces a cleaner log that is easier to read and bisect. The common workflow is to rebase your feature branch onto the latest main to incorporate updates, then merge the feature branch into main with a merge commit. Never rebase commits that have been pushed to a shared branch, as it rewrites history that others may have based work on, causing conflicts and duplicate commits.",
    },
    {
      question: "How do I undo the last git commit without losing changes?",
      answer:
        "Use git reset --soft HEAD~1 to undo the last commit while keeping all changes staged and ready to commit again. Use git reset --mixed HEAD~1, which is the default, to undo the commit and unstage the changes but keep them in your working directory. Use git reset --hard HEAD~1 to undo the commit and permanently discard all changes, which cannot be easily recovered. If you already pushed the commit, use git revert HEAD instead, which creates a new commit that undoes the changes without rewriting history. The key difference is that reset rewrites local history and should only be used for unpushed commits, while revert is safe for shared branches because it adds to history rather than removing from it. You can reset multiple commits by changing the number after the tilde.",
    },
    {
      question: "How do I use git stash to save work in progress?",
      answer:
        "Git stash temporarily shelves uncommitted changes so you can switch branches without committing incomplete work. Run git stash to save both staged and unstaged tracked file changes, or git stash -u to also include untracked files. Your working directory reverts to the last commit state. To restore stashed changes, use git stash pop which applies the stash and removes it from the stash list, or git stash apply which applies it but keeps it stored. You can maintain multiple stashes and list them with git stash list. Apply a specific stash with git stash apply stash@{2} using its index. Use git stash show -p to preview a stash's contents before applying. For named stashes, use git stash push -m \"description\" which makes it easier to identify stashes when you have several saved.",
    },
  ],
  "csp-builder": [
    {
      question: "What is a Content Security Policy and why do I need one?",
      answer:
        "A Content Security Policy (CSP) is an HTTP response header that tells browsers which sources of content are allowed to load on your page, providing a strong defense against cross-site scripting (XSS) and data injection attacks. By specifying allowed origins for scripts, styles, images, fonts, and other resource types, you prevent attackers from injecting malicious content even if they find an XSS vulnerability. For example, script-src 'self' only allows scripts from your own domain, blocking injected script tags pointing to attacker-controlled servers. CSP also prevents clickjacking through the frame-ancestors directive and can enforce HTTPS with upgrade-insecure-requests. Start with a report-only mode using Content-Security-Policy-Report-Only to log violations without blocking, then switch to enforcing mode once your policy is tuned.",
    },
    {
      question: "How do I allow inline scripts and styles in CSP?",
      answer:
        "The safest approach is to use nonce-based CSP where you generate a unique random value for each response, add it as a nonce attribute on each inline script and style tag, and include nonce-{value} in your CSP header. This allows specific inline elements while blocking injected ones. An alternative is hash-based CSP where you compute the SHA-256 hash of each inline script or style content and add sha256-{base64hash} to the policy. The least secure option is adding unsafe-inline to script-src or style-src, which allows all inline code and significantly weakens XSS protection. For styles, unsafe-inline is sometimes acceptable since CSS injection is lower risk than script injection. Never use unsafe-eval for scripts unless absolutely required by a framework, as it enables string-to-code execution patterns that attackers can exploit.",
    },
    {
      question: "What CSP directives should I set for a React or Next.js application?",
      answer:
        "For a typical React or Next.js application, start with default-src 'self' as the baseline. Set script-src to 'self' with nonces for inline scripts that Next.js generates, or 'self' 'unsafe-inline' 'unsafe-eval' during development. Set style-src to 'self' 'unsafe-inline' since many CSS-in-JS solutions require inline styles. Set img-src to 'self' data: and add any CDN domains serving your images. Set font-src to 'self' plus any font CDN like fonts.gstatic.com. Set connect-src to 'self' plus your API domains and any analytics endpoints. Add frame-ancestors 'none' to prevent your site from being embedded in iframes. For Next.js specifically, check if your build uses eval-based source maps and adjust script-src accordingly for development versus production. Use next.config.js headers configuration or middleware to set the CSP header on all responses.",
    },
  ],
  "html-to-jsx": [
    {
      question: "What changes when converting HTML to JSX?",
      answer:
        "Several HTML attributes must be renamed for JSX compatibility since JSX uses JavaScript property names instead of HTML attribute names. The class attribute becomes className, and for becomes htmlFor. Inline style attributes change from strings to objects with camelCase properties: style=\"background-color: red\" becomes style={{backgroundColor: 'red'}}. All self-closing tags like img, br, input, and hr must include a trailing slash. Event handler attributes change from lowercase onclick to camelCase onClick. Boolean attributes like disabled and checked can be written without a value. The tabindex attribute becomes tabIndex, and all data- and aria- attributes remain unchanged. Comments change from <!-- comment --> to {/* comment */}. JSX also requires a single root element, so multiple sibling elements must be wrapped in a fragment <></> or a container div.",
    },
    {
      question: "How do I convert inline styles from HTML to JSX format?",
      answer:
        "HTML inline styles are strings with CSS property names in kebab-case, like style=\"font-size: 16px; background-color: blue; margin-top: 10px\". JSX inline styles are JavaScript objects with camelCase property names and string or number values, like style={{fontSize: '16px', backgroundColor: 'blue', marginTop: '10px'}}. Numeric pixel values can omit the px suffix for most properties: marginTop: 10 is equivalent to marginTop: '10px'. Properties with vendor prefixes like -webkit-transform become WebkitTransform with the vendor prefix capitalized. CSS custom properties (variables) use the same syntax in the style object. The double curly braces are not special syntax; the outer braces are JSX expression delimiters and the inner braces define the JavaScript object literal.",
    },
    {
      question: "What is the difference between HTML to JSX and HTML to React?",
      answer:
        "HTML to JSX conversion handles syntax transformation: renaming attributes, converting styles, fixing self-closing tags, and adjusting event handlers to produce valid JSX markup that can be used directly in a React component's return statement. HTML to React conversion goes further by creating a complete functional or class component structure including imports, component function definition, state management for interactive elements, and event handler implementations. For example, an HTML form with inputs would become JSX through attribute renaming, but would become a full React component with useState hooks, onChange handlers, and form submission logic. Most online converters focus on JSX conversion since component architecture decisions depend on your application's specific requirements and patterns.",
    },
  ],
  "json-to-code": [
    {
      question: "How do I generate typed code from a JSON response?",
      answer:
        "Paste your JSON data into a JSON-to-code generator and select your target language. The tool analyzes the structure, detects types for each field based on values, and generates corresponding type definitions or classes. For TypeScript, it creates interfaces with proper types. For Go, it generates structs with json tags. For Python, it can produce dataclasses or Pydantic models. For Java, it creates POJOs with appropriate field types and annotations. The generator handles nested objects by creating separate types for each level and arrays by analyzing element types. Review the output for optional versus required fields since a single JSON sample may not reveal which fields can be null or absent. For production use, add validation logic and handle edge cases that the sample data may not represent.",
    },
    {
      question: "What languages are commonly supported for JSON to code generation?",
      answer:
        "Most JSON-to-code generators support TypeScript interfaces, Go structs with json tags, Python dataclasses or Pydantic models, Java classes with getter/setter methods, C# classes with JsonProperty attributes, Kotlin data classes, Swift Codable structs, Rust structs with serde derive macros, and Dart classes with fromJson factory constructors. Each language has idiomatic patterns for JSON serialization. TypeScript benefits from interface definitions for type checking without runtime overhead. Go requires explicit struct tags for field name mapping. Python Pydantic models provide both type hints and runtime validation. Rust serde handles serialization and deserialization with compile-time safety. The choice of target output depends on your project's language and which serialization library you use.",
    },
    {
      question: "How does JSON to code handle nested objects and arrays?",
      answer:
        "Nested JSON objects are converted into separate named types with the parent type referencing them as fields. For example, a user object with an address sub-object generates both a User type and an Address type, with User containing an address field of type Address. Arrays are typed based on their element analysis: an array of strings becomes string[] or []string, while an array of objects generates a named type for the element. Mixed-type arrays may produce union types in TypeScript or interface types in other languages. Deeply nested structures create correspondingly deep type hierarchies. Some generators flatten certain patterns or let you customize type names. Null values in arrays or fields typically result in optional or nullable type annotations depending on the target language's conventions.",
    },
  ],
  "code-screenshot": [
    {
      question: "How do I create a code screenshot for social media?",
      answer:
        "Paste your code into a code screenshot generator, select a syntax highlighting theme, choose your programming language for correct highlighting, and configure the appearance including background color or gradient, padding, font size, and whether to show line numbers or a window title bar. Export as PNG at 2x resolution for sharp display on high-DPI screens and social media platforms. Keep code snippets short, typically 10 to 25 lines, since longer code becomes unreadable at social media display sizes. Use a theme with good contrast: dark themes like Dracula, One Dark, or Monokai work well against most social media backgrounds. Add a descriptive window title to give context about what the code does. Most platforms compress images, so PNG at higher resolution produces better results than JPEG.",
    },
    {
      question: "What themes work best for code screenshots?",
      answer:
        "Dark themes generally produce the most visually appealing code screenshots and perform better on social media where feeds often have light backgrounds, creating natural contrast. Popular choices include Dracula with its purple-accented palette, One Dark Pro from the Atom editor family, Monokai which is the classic Sublime Text theme, Night Owl designed for accessibility, and GitHub Dark for a familiar developer aesthetic. Light themes like GitHub Light or Solarized Light work well for documentation, blog posts, and presentations with white backgrounds. When choosing a theme, prioritize readability of syntax colors over aesthetics. Ensure string literals, keywords, functions, and comments are all clearly distinguishable. Test your screenshot at the actual display size since some themes with subtle color differences look great in editors but lose distinction when scaled down.",
    },
    {
      question: "What resolution and format should I use for code screenshots?",
      answer:
        "Export at 2x or 3x resolution to ensure crisp text on retina displays and after social media compression. For Twitter/X, the recommended image size is 1200x675 pixels at 2x, making the render resolution 2400x1350. For blog posts and documentation, 1600 pixels wide at 2x is sufficient. Use PNG format for code screenshots because it handles sharp text edges and solid color regions without compression artifacts, unlike JPEG which blurs text at any quality setting. PNG files for code screenshots are typically 200-500KB, which is acceptable for web use. If file size is a concern, use a PNG optimizer to reduce size without quality loss. SVG export is ideal for documentation sites since it scales perfectly and keeps file sizes small, but most social media platforms do not support SVG display.",
    },
  ],
};
